// RigEvaluator の再生キャッシュ（フレームごとの評価結果を覚えて使う・レイヤー・上限・ポーズ確認の追加分）と、フレームの評価の入口（evaluate）。rig.js から分けたもの（整備計画の D5）。
// メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Matrix4 } from 'three';
import { enterDeep, isStackOverflow, leaveDeep, mayOverflow, runDeep, useOrder } from './deepEval.js';
import { buildPlan, runPlan } from './rigCompiled.js';
import {
  BUSY, CHAIN_SOLVERS, copyKeys, deepHooks, diffKeys, MAX_LAYERS, NO_FRAMES, NO_KEYS, NO_POSE, OPAQUE,
  overflowReason, packSnapshotMats, poseKeysOf, readSnapshotMat, sameMats, SNAPSHOT_BASE, snapshotStride,
} from './rig.js';

export class PlaybackMethods {
  /**
   * 追加分の目印 keys で使えるレイヤー（評価で読んだノードの追加分がすべて同じもの。新しく使ったものから探す）。
   * create なら、なければ作り、見つけたものは目印を keys にして一番新しくする
   */
  layerFor(keys, create = false) {
    if (keys === null) return null;
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const L = this.layers[i];
      const d = diffKeys(L.keys, keys);
      if (d === null) continue;
      let ok = true;
      for (const n of d) if (this.poseReads.has(n)) { ok = false; break; }
      if (!ok) continue;
      if (create) {
        // 読んでいないノードの違いは、このレイヤーの値に影響しない。あとから読むようになっても合うよう、目印をいまのものにする
        if (d.size) L.keys = copyKeys(keys);
        if (i !== this.layers.length - 1) { this.layers.splice(i, 1); this.layers.push(L); }
      }
      return L;
    }
    if (!create) return null;
    const L = { keys: copyKeys(keys), frames: new Map(), bytes: 0 };
    this.layers.push(L);
    this.trimLayers(L);
    return L;
  }

  /** 再生で使う追加分のレイヤー（なければ null） */
  playbackLayer() {
    return this.layerFor(this.play ? this.play.keys : this.poseKeys);
  }

  /**
   * 再生で使う追加分（bake で作り、タイムラインの帯・playbackStats で示すもの）。ポーズ確認で、フレームを変えると
   * 戻る分（キーのある値）を除いたもの。poseOf を省くと追加分なし、null を渡すと「いまの追加分と同じ」
   */
  setPlaybackPose(poseOf = NO_POSE, poseKey = undefined) {
    this.play = poseOf === null ? null : { poseOf, key: poseKey, keys: poseKeysOf(poseOf, poseKey) };
  }

  /** レイヤーを捨てる */
  dropLayer(L) {
    const i = this.layers.indexOf(L);
    if (i < 0) return;
    this.layers.splice(i, 1);
    this.snapshotBytes -= L.bytes;
    if (this.current && this.current.layer === L) this.current = null;
    if (this.layer === L) this.layer = null;
  }

  /** レイヤーが多すぎたら、古いものから捨てる（keep・追加分なし・再生で使うものは残す） */
  trimLayers(keep) {
    if (this.layers.length <= MAX_LAYERS) return;
    const play = this.playbackLayer();
    for (const L of [...this.layers]) {
      if (this.layers.length <= MAX_LAYERS) break;
      if (L !== keep && L !== play && L.keys.size) this.dropLayer(L);
    }
  }

  /**
   * レイヤー L にもう 1 フレーム入るか。L が再生で使うレイヤーなら、ほかのレイヤーを古いものから捨てて場所を空ける
   * （ポーズ確認の操作中の、一時的な追加分のレイヤーのためには捨てない）
   */
  roomFor(L) {
    const fits = () => this.snapshotBytes + this.frameBytes <= this.playbackLimit;
    if (fits()) return true;
    if (L !== this.playbackLayer()) return false;
    for (const other of [...this.layers]) {
      if (other === L) continue;
      this.dropLayer(other);
      if (fits()) return true;
    }
    return false;
  }

  /** 再生キャッシュをすべて捨てる */
  clearPlayback() {
    this.layers = [];
    this.layer = null;
    this.snapshotBytes = 0;
    this.countedCurves = new WeakSet();
    this.current = null;
  }

  /**
   * 変化のないフレーム: 隣のフレーム（f−1・f+1）と行列がすべて同じなら、そのデータを共有する（snap.mats を置き換え、
   * 共有元に sharers として覚える。共有したフレームは行列の分を数えない）。共有したら true
   */
  shareMats(layer, f, snap) {
    for (const g of [f - 1, f + 1]) {
      const other = layer.frames.get(g);
      if (!other) continue;
      const owner = other.owner || other;
      if (owner === snap || !sameMats(owner.mats, snap.mats)) continue;
      snap.mats = owner.mats;
      snap.owner = owner;
      (owner.sharers || (owner.sharers = [])).push(snap);
      return true;
    }
    return false;
  }

  /**
   * 3 ボーン以上の IK の解き方（CHAIN_SOLVERS の 1 つ）。変えたら、覚えた値・専用の評価の計画・再生キャッシュを捨てる。
   * 変えたら true
   */
  setChainSolver(mode) {
    mode = CHAIN_SOLVERS.includes(mode) ? mode : 'fabrik';
    if (this.chainSolver === mode) return false;
    this.chainSolver = mode;
    this.compiledPlan = undefined;
    this.clearPlayback();
    this.reset();
    return true;
  }

  /** 再生キャッシュの精度（true: 32 ビット）。変えたら覚えたフレームを捨てる（作り直す） */
  setCachePrecision(f32) {
    f32 = !!f32;
    if (this.cacheFloat32 === f32) return;
    this.cacheFloat32 = f32;
    this.frameBytes = this.moving.size * (f32 ? 48 : 96) + SNAPSHOT_BASE;
    this.clearPlayback();
  }

  /** 再生キャッシュの上限（バイト。0 なら使わない）。いまの大きさが上限を超えたら、古いレイヤー・先に覚えたフレームから捨てる */
  setPlaybackLimit(bytes) {
    this.playbackLimit = Math.max(0, bytes || 0);
    if (this.playbackLimit === 0) { this.clearPlayback(); return; }
    const play = this.playbackLayer();
    const order = [...this.layers.filter((L) => L !== play), ...(play ? [play] : [])];
    for (const L of order) {
      for (const [f, snap] of L.frames) {
        if (this.snapshotBytes <= this.playbackLimit) return;
        if (snap === this.current || !L.frames.has(f)) continue;
        // 共有元を捨てるときは、共有しているフレームも捨てる（数えていない行列のデータが残らないように）
        for (const x of [snap, ...(snap.sharers || [])]) {
          if (x === this.current) {
            // いま使っているフレームは捨てない。共有元を捨てるなら、これを新しい共有元にして行列の分を数える
            if (x !== snap && x.owner === snap) {
              x.owner = null;
              x.bytes += snap.mats.byteLength;
              L.bytes += snap.mats.byteLength;
              this.snapshotBytes += snap.mats.byteLength;
            }
            continue;
          }
          let found = false;
          for (const [g, y] of L.frames) if (y === x) { L.frames.delete(g); found = true; break; }
          if (!found) continue;                          // もう捨ててある
          L.bytes -= x.bytes;
          this.snapshotBytes -= x.bytes;
        }
      }
      if (!L.frames.size && L !== this.layer) this.dropLayer(L);
    }
  }

  /** 再生キャッシュの状態 { frames（再生で使うレイヤーのフレーム数）, bytes（全レイヤー）, limit, full, layers } */
  playbackStats() {
    const L = this.playbackLayer();
    return { frames: L ? L.frames.size : 0, bytes: this.snapshotBytes, limit: this.playbackLimit, full: this.playbackFull,
      layers: this.layers.length };
  }

  /** 再生で使うレイヤーのフレーム（整数のフレーム → 再生キャッシュ。なければ空） */
  get snapshots() {
    const L = this.playbackLayer();
    return L ? L.frames : NO_FRAMES;
  }

  /** 再生キャッシュに足した値の大きさを数える */
  addSnapshotBytes(snap, bytes) {
    snap.bytes += bytes;
    snap.layer.bytes += bytes;
    this.snapshotBytes += bytes;
    if (snap.bytes > this.frameBytes) this.frameBytes = snap.bytes;
  }

  /**
   * ほかのレイヤーにある同じフレームの再生キャッシュから、追加分の違いの影響を受けない動くノードのローカル行列を、
   * このフレームの値として写す（影響を受けるノードだけを計算する）。影響の有無は nodeDeps（そのフレームを覚えたときの
   * 評価で読んだノード）で決める。写したノードの数を返す
   */
  seed(f, layer) {
    let best = null, bestAffected = null;
    for (const L of this.layers) {
      if (L === layer) continue;
      const snap = L.frames.get(f);
      if (!snap) continue;
      const affected = this.affectedBy(this.readsOf(diffKeys(L.keys, this.poseKeys)));
      if (!best || affected.size < bestAffected.size) { best = snap; bestAffected = affected; }
    }
    if (!best || bestAffected.size >= this.moving.size) return 0;
    const local = this.cache.local;
    const deps = local.deps || (local.deps = new Map());
    let n = 0, i = 0;
    const stride = snapshotStride(best.mats, this.moving.size);
    for (const ni of this.moving) {
      if (!bestAffected.has(ni)) {
        local.set(ni, readSnapshotMat(best.mats, stride, i, new Matrix4()));
        const d = this.nodeDeps.get(ni);
        if (d && d.size) deps.set(ni, new Set(d));          // nodeDeps はあとで足すので、変えない複製にする
        n++;
      }
      i++;
    }
    return n;
  }

  /** changed（null = どれか）のノードの追加分で値が変わりうる動くノード */
  affectedBy(changed) {
    const out = new Set();
    if (changed === null) {
      for (const [ni, d] of this.nodeDeps) if (d.size) out.add(ni);
      return out;
    }
    for (const c of changed) {
      const s = this.dependents.get(c);
      if (s) for (const ni of s) out.add(ni);
    }
    return out;
  }

  /**
   * フレーム f の、動くノードのローカル行列（ポーズ確認の追加分を含まない）を計算する。
   * @param poseOf (ni) => Matrix4 | null  ポーズ確認の追加分（ノード自身の軸の追加分）。ワールド行列と、ほかのノードが読む
   *   移動・回転・スケールの値（posedChan）に入れ、制限（limit）の範囲に収める
   * @param poseKey poseOf の中身の目印。ノード番号 → 文字列の Map（そのノードの追加分が同じあいだは同じ文字列）なら、
   *   変えたノードの影響を受ける値だけを作り直す。版の数などなら、変わったら追加分を読んだ値をすべて作り直す。
   *   ないときは、フレームをまたぐキャッシュを使わない
   */
  evaluate(f, poseOf = NO_POSE, target = this.matrices, poseKey = undefined) {
    this.frame = f;
    this.poseOf = poseOf;
    this.poseKey = poseKey;
    this.poseKeys = poseKeysOf(poseOf, poseKey);
    this.reset();
    this.seeded = 0;
    // bypassCache: 評価のプロファイラで「キャッシュなし」を測るとき（覚えたフレームは捨てず、読みも書きもしない）
    const playable = !this.bypassCache && Number.isInteger(f) && this.ikVariant === null && this.aimMode === null && this.playbackLimit > 0
      && this.poseKeys !== null;
    const layer = this.layer = playable ? this.layerFor(this.poseKeys, true) : null;
    const hit = layer ? layer.frames.get(f) : null;
    if (hit) {
      this.lastPath = 'cache';
      const stride = snapshotStride(hit.mats, this.moving.size);
      let i = 0;
      for (const ni of this.moving) {
        const m = target.get(ni) || new Matrix4();
        readSnapshotMat(hit.mats, stride, i++, m);
        target.set(ni, m);
      }
      this.current = hit;
      return target;
    }
    // 専用の評価: ポーズ確認の追加分がなく、再現チェックの候補を試していないとき（結果はこの評価器と同じ）
    const compiled = this.useCompiled && this.poseKeys === NO_KEYS && this.ikVariant === null && this.aimMode === null;
    if (compiled && this.compiledPlan) {
      const plan = this.compiledPlan;
      const store = !!layer && this.roomFor(layer);
      this.lastPath = 'compiled';
      plan.profile = this.profile;                       // 評価のプロファイラの記録中だけ（手順ごとの時間）
      let ok = true;
      try {
        runPlan(plan, f, target);
      } catch (e) {
        // スタックがあふれた（やり直せない所。スタックの小さい Web Worker で起きる）: 計画をやめて、汎用の経路で評価し直す
        if (!isStackOverflow(e)) throw e;
        this.dropPlan(e);
        ok = false;
      } finally { plan.profile = null; }
      if (ok) {
        if (store && !plan.depsAdded) {                  // 追加分を読む依存（計画を作った評価で記録したもの）
          for (const s of plan.moving) if (s.deps && s.deps.size) this.addNodeDeps(s.ni, s.deps);
          plan.depsAdded = true;
        }
        if (store) this.storeSnapshot(f, layer, target);
        return target;
      }
      this.reset();                                      // 計画が途中まで入れた値を捨てる
    }
    if (layer) this.seeded = this.seed(f, layer);
    const store = !!layer && this.roomFor(layer);
    const capture = compiled && this.compiledPlan === undefined ? new Map() : null;
    this.lastPath = 'generic';
    // 評価のプロファイラの記録中だけ、ノードごとの時間を渡す（profile.node(評価器, ノード番号, ms)。上流の値は、
    // 最初に読んだノードの時間に入る）
    const prof = this.profile;
    let t0 = prof ? performance.now() : 0;
    useOrder(this.deepState, 'generic');                 // 汎用の経路で覚えた順番
    this.prewarmDeep();                                  // 鎖が長くてスタックがあふれた所は、深い所から先に求める
    for (const ni of this.moving) {
      this.dcur = null;
      const m = target.get(ni) || new Matrix4();
      m.copy(this.deep(() => this.localFile(ni)));
      target.set(ni, m);
      if (store && this.dcur) this.addNodeDeps(ni, this.dcur);
      if (capture) capture.set(ni, this.dcur);
      if (prof) { const t1 = performance.now(); prof.node(this, ni, t1 - t0); t0 = t1; }
    }
    this.dcur = null;
    if (capture) {                                       // 扱えるリグなら、次のフレームから専用の評価にする
      const tp = performance.now();
      let r;
      try {
        r = buildPlan(this, capture);
      } catch (e) {
        if (!isStackOverflow(e)) throw e;                // スタックがあふれた: 専用の評価は使わない（汎用の経路のまま）
        r = { reason: overflowReason(e) };
      }
      this.planMs = performance.now() - tp;              // 計画を作った時間（評価のプロファイラのワーカーの欄）
      this.compiledPlan = r.plan || null;
      this.compiledReason = r.reason || null;
    }
    if (store) this.storeSnapshot(f, layer, target);
    return target;
  }

  /** 専用の評価の計算でスタックがあふれた: 計画をやめる（次のフレームから汎用の経路。理由に、あふれた所の関数名を入れる） */
  dropPlan(e) {
    this.compiledPlan = null;
    this.compiledReason = overflowReason(e);
  }

  /** フレーム f の動くノードのローカル行列を、再生キャッシュのレイヤー layer に入れる */
  storeSnapshot(f, layer, target) {
    const mats = packSnapshotMats(target, this.moving, this.cacheFloat32);
    this.current = { mats, props: null, curves: new Map(), bytes: 0, layer };
    layer.frames.set(f, this.current);
    this.addSnapshotBytes(this.current, this.shareMats(layer, f, this.current) ? SNAPSHOT_BASE : mats.byteLength + SNAPSHOT_BASE);
  }

  /** フレーム f が（再生で使うレイヤーの）再生キャッシュにあるか */
  hasSnapshot(f) { return this.snapshots.has(f); }

  /** 再生で使うレイヤーが、ほかのレイヤーを捨てても上限に達するか */
  get playbackFull() {
    const L = this.playbackLayer();
    return (L ? L.bytes : 0) + this.frameBytes > this.playbackLimit;
  }

  /**
   * 再生キャッシュを先に作る（空き時間に少しずつ呼ぶ）。再生で使う追加分（setPlaybackPose）で作る。
   * いまのフレームの評価の結果（matrices と、あとから求める値）は変えない。
   * @param frames 作るフレーム  @param more () => boolean  続けてよいか（1 フレーム目は必ず作る）
   * @returns 作ったフレームの数
   */
  bake(frames, more = () => true) {
    if (this.playbackLimit <= 0) return 0;
    const back = { f: this.frame, poseOf: this.poseOf, key: this.poseKey };
    const play = this.play || back;
    const L = this.layerFor(this.play ? this.play.keys : this.poseKeys);
    const todo = frames.filter((f) => Number.isInteger(f) && !(L && L.frames.has(f)));
    if (!todo.length) return 0;
    const scratch = new Map();
    let n = 0;
    for (const f of todo) {
      if (n > 0 && !more()) break;
      this.evaluate(f, play.poseOf, scratch, play.key);
      if (!this.current) break;                          // 上限に達した（目印がなく覚えられないときも）
      if (this.props.length) this.evaluateProps();
      for (const gid of this.curveIds()) this.curveShape(gid);
      n++;
    }
    this.evaluate(back.f, back.poseOf, this.matrices, back.key);
    return n;
  }

  /**
   * 再生で使う追加分（bake で作るもの）を、ワーカーに送れる形にする: { keys（目印の Map）, poses: [[ノード番号,
   * 追加分の行列の 16 要素 | null, 目印]]（ノード番号の順）, sig（目印を並べた文字列。同じ追加分か比べる） }。
   * 目印がない・ノードごとの目印でない（版の数など）ときは null（ワーカーでは作れない）
   */
  playbackPoseData() {
    const play = this.play || { poseOf: this.poseOf, keys: this.poseKeys };
    const keys = play.keys;
    if (!keys || keys.has(OPAQUE)) return null;
    const poses = [];
    for (const [ni, key] of keys) {
      const m = play.poseOf(ni);
      poses.push([ni, m ? m.toArray() : null, key]);
    }
    poses.sort((a, b) => a[0] - b[0]);
    return { keys, poses, sig: JSON.stringify(poses.map((p) => [p[0], p[2]])) };
  }

  /**
   * ほかの評価器（ワーカー）が作った再生キャッシュを、目印 keys のレイヤーに入れる（bake の代わり）。
   * @param frames [{ f, mats（動くノードの順の Float64Array）, props, curves: Map（グラフの id → カーブの形） }]
   * @param deps [[動くノード, 読んだ追加分のノード…]]（nodeDeps に足す）  @param poseReads 追加分を読んだノード
   * @returns 入れたフレームの数（上限に達したら途中で止める）
   */
  importSnapshots(keys, frames, deps = [], poseReads = []) {
    if (this.playbackLimit <= 0 || !keys) return 0;
    // 作った評価器が追加分を読んだノード（レイヤーの見分けと、追加分を変えたときに作り直す範囲に使う）
    for (const n of poseReads) this.poseReads.add(n);
    for (const [ni, list] of deps) if (list.length) this.addNodeDeps(ni, new Set(list));
    const L = this.layerFor(keys, true);
    let n = 0;
    for (const fr of frames) {
      if (!Number.isInteger(fr.f) || L.frames.has(fr.f)) continue;
      if (!snapshotStride(fr.mats, this.moving.size)) continue;       // 動くノードの数が違う（別のリグの結果）
      if (!this.roomFor(L)) break;
      const snap = { mats: fr.mats, props: fr.props || null, curves: fr.curves || new Map(), bytes: 0, layer: L };
      L.frames.set(fr.f, snap);
      let bytes = this.shareMats(L, fr.f, snap) ? SNAPSHOT_BASE : fr.mats.byteLength + SNAPSHOT_BASE;
      if (snap.props) bytes += snap.props.reduce((k, p) => k + 64 + Object.keys(p.values).length * 48, 64);
      for (const v of snap.curves.values()) {
        if (v && v.isCurve && !this.countedCurves.has(v)) { this.countedCurves.add(v); bytes += 160 + v.cvs.length * 64; }
      }
      this.addSnapshotBytes(snap, bytes);
      n++;
    }
    return n;
  }

  /** 値のキャッシュ。fm: このフレームだけ・km: 時間で変わらない値。fallback があれば循環を防ぐ（label は問題の表示） */
  memo(fm, km, key, compute, fallback, label) {
    let v = fm.get(key);
    if (v !== undefined || fm.has(key)) {
      this.varying = true;                    // fm に残るのは時間で変わる値（と計算中の印）
      if (v !== BUSY) {
        if (fm.deps) this.addDeps(fm.deps.get(key));
        return v;
      }
      // 循環の防止。key の計算中にもう一度 key を求めたら fallback を返す
      this.problems.add(`循環: ${label()}`);
      return fallback();
    }
    v = km.get(key);
    if (v !== undefined || km.has(key)) {
      if (km.deps) this.addDeps(km.deps.get(key));
      return v;
    }
    // 計算するのがいちばん外側のとき（chan・world などを直接読むときも）は、スタックのあふれをやり直せるようにする（deep）
    if (!this.deepState.depth) return this.deep(() => this.memo(fm, km, key, compute, fallback, label));
    const outer = this.varying, outerDeps = this.dcur;
    this.varying = false;
    this.dcur = null;
    // 計算中の印は、付けた所を marks に記録する（スタックがあふれて片付けられなかった印を、deep がそこだけ消す）
    const marks = this.deepState.marks, mark = marks.length;
    // 先に記録してから印を付ける（印を付けたあと、記録する前にスタックがあふれると、片付けられない印が残って循環に見える）
    if (fallback) { marks.push(fm, key); fm.set(key, BUSY); }
    let done = false;
    let entered = false;
    try {
      enterDeep(this.deepState);                          // 入れ子の段数を数える（上限を超えたら、あふれたのと同じ扱い）
      entered = true;
      v = compute();
      done = true;
    } catch (e) {
      // スタックがあふれたら、この値をあとで浅い所から求め直せるようにする（いちばん深い所だけ。deep）
      const ds = this.deepState;
      if (ds.depth && ds.at === null && mayOverflow(e)) {
        ds.at = () => this.memo(fm, km, key, compute, fallback, label);
        ds.at.place = fm;                                  // 同じ計算か（deepEval.js の runDeep が、進まないことを見分ける）
        ds.at.key = key;
        // 次のフレームから先に求める（prewarmDeep）: 計算ノードの出力・属性の値・そのほかの値（ワールド行列・チャンネルなど。
        // どのキャッシュの値かと、求め方 compute を覚える。compute はノードの番号などしか使わないので、次のフレームでも使える）
        if (fm === this.cache.out) ds.at.warm = { key: `o${key}`, id: key, attr: null };
        else if (fm.ownerId !== undefined) ds.at.warm = { key: `p${fm.ownerId}.${key}`, id: fm.ownerId, attr: key };
        else {
          const map = Object.keys(this.cache).find((n) => this.cache[n] === fm);
          // self: 求めた評価器（compute はその評価器のメソッドを呼ぶ。時間で変わるかの印も同じ評価器で見る）
          if (map) ds.at.warm = { key: `${map}|${key}`, map, k: key, compute, fallback, label, self: this };
        }
      }
      throw e;
    } finally {
      if (entered) leaveDeep(this.deepState);
      if (!done) fm.delete(key);                          // 先に消す（あふれた直後は、このあとの呼び出しが失敗しうる）
      else marks.length = mark;
      const varying = this.varying, deps = this.dcur;
      this.varying = outer || varying;
      this.dcur = outerDeps;
      this.addDeps(deps);
      if (done) {
        // 値と、その値が読んだ追加分のノード（deps。追加分を変えたときに捨てる値を見分ける）を覚える
        let m = fm;
        if (!varying && this.keepStatic) { fm.delete(key); m = km; }
        m.set(key, v);
        if (deps) (m.deps || (m.deps = new Map())).set(key, deps);
        else if (m.deps) m.deps.delete(key);
      }
    }
    return v;
  }

  /**
   * fn() を求める。上流へさかのぼる鎖が長くてスタックがあふれたら、いちばん深い所の値を先に求めてやり直す（deepEval.js）。
   * スタックの小さい Web Worker（再生キャッシュを作る）でも、画面側と同じ値になる
   */
  deep(fn) {
    const st = this.deepState;
    if (st.depth) return fn();
    // 呼んだときの状態（やり直す前に戻す）。よく呼ぶので、関数は作らずに状態に置く（deepHooks）
    const sv = st.saved;
    sv.self = this;                                      // 評価器か、計画の読み手（plan.ad。状態を戻す相手）
    sv.varying = this.varying;
    sv.dcur = this.dcur;
    sv.busy = this.busy.size;
    sv.prof = this.profile;
    sv.defs = sv.prof && sv.prof.defStack ? sv.prof.defStack.length : 0;
    sv.mark = st.marks.length;
    const hooks = st.hooks || (st.hooks = deepHooks(st));
    return runDeep(st, fn, hooks.retry, hooks.stuck);
  }

  /**
   * 浅い所から求め直しても、その計算の中だけでスタックがあふれる（deep）: 自作ノードの定義を JavaScript の関数にしたもので
   * あれば、その定義を IR をたどる計算にする（変数の多い定義の関数は、1 回の呼び出しで使うスタックが大きい）。直したら true
   */
  unstick(at) {
    if (!at.warm || at.warm.attr !== null) return false;
    const g = this.byId.get(at.warm.id);
    const d = g && g.def ? this.defs.get(g.def) : null;
    if (!d || !d.fallBack()) return false;
    (this.defsInterpreted || (this.defsInterpreted = new Set())).add(g.def);   // 評価のプロファイラのワーカーの欄に出す
    return true;
  }

  /**
   * 前のフレームでスタックがあふれて先に求めた計算ノードの出力を、深い所から順に先に求めておく（deepEval.js の order）。
   * reader: 値を求めるオブジェクト（専用の評価では計画の読み手 plan.ad）
   */
  prewarmDeep(reader = this) {
    const st = this.deepState, order = st.order;
    try {
      for (let i = 0; i < order.length; i++) {
        st.insertAt = i;                                 // ここで新しく覚えたものは、この項目の手前に入る
        const w = order[i];
        if (w.map) {
          // 覚えたときと同じ評価器で求める（compute はその評価器を this にした関数。別の読み手の memo で求めると、
          // compute が付けた「時間で変わる」の印を読み手が見ず、時間で変わる値を keep に入れてしまう）
          const s = w.self || reader;
          s.deep(() => s.memo(s.cache[w.map], s.keep[w.map], w.k, w.compute, w.fallback, w.label));
        }
        else if (w.attr === null) reader.deep(() => reader.outputs(w.id));
        else reader.deep(() => reader.plug(w.id, w.attr));
        i = st.insertAt;                                 // 手前に入った分だけ進める（いまの項目の位置）
      }
    } finally {
      st.insertAt = -1;
    }
  }

  /** 循環の防止（キャッシュしない値に使う）。key の計算中にもう一度 key を求めたら fallback を返す */
  guard(key, fn, fallback) {
    if (this.busy.has(key)) {
      this.problems.add(`循環: ${key}`);
      this.varying = true;
      return fallback();
    }
    this.busy.add(key);
    try { return fn(); } finally { this.busy.delete(key); }
  }
}
