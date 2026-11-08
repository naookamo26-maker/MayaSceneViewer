// 評価のプロファイラ: 再生・フレームの移動のあいだ、1 フレームの処理の内訳と、リグの評価の種類ごと・経路ごとの時間を記録する。
// DOM に依存しない（画面は profilerPanel.js）。記録していないあいだは、評価器に何も渡さない（速さに影響しない）。
//
// 時間の精度: ブラウザの performance.now() は、安全のため 0.1 ms 程度に丸められることがある（丸めには揺らぎがあり、
// 多くの区間を足すと平均では正しい値に近づく）。1 ノードの評価は数 µs なので、ノードごとの時間は 1 回では測れない。
// 種類ごとに、記録したフレームを通して足し合わせて出す（多く記録するほど正確。合計はリグの評価の時間と比べて示す）。
import { stepCategory } from './rigCompiled.js';
import { stackNames } from './deepEval.js';

/** 行列の更新・表示・その他（scene）の内訳（その他は scene からこれらを引いた残り） */
export const SUB_PARTS = [
  { key: 'matrices', label: '行列のコピー' },
  { key: 'pose', label: '姿勢の組み立て' },
  { key: 'world', label: 'ワールド行列の計算' },
  { key: 'overlay', label: 'ジョイント・コントローラーの表示の更新' },
];

/** フレームの内訳（グラフの積み上げの順。色はこの順に分類色を割り当てる） */
export const PARTS = [
  { key: 'cache', label: '再生キャッシュから写す' },
  { key: 'compiled', label: '専用の評価' },
  { key: 'generic', label: '汎用の経路' },
  { key: 'curves', label: 'カーブの形' },
  { key: 'props', label: '接続で決まる値（表示・カメラなど）' },
  { key: 'scene', label: '行列の更新・表示・その他' },
  { key: 'render', label: '描画（CPU 側）' },
];

/**
 * 記録を始めてから、集計に入れないフレームの数。記録中だけ通る計測の処理は、始めの数フレームは機械語になっておらず、
 * 種類の分類も初めて求めるので、いつもの 2〜5 倍かかる（記録を始めた直後に跳ねる）。計算はするので、そのあとは正しく測れる
 */
export const WARM_FRAMES = 5;
const MAX_FRAMES = 5000;               // 覚えるフレームの数（古いものから捨てる。種類ごとの集計は捨てない）
export const NODE_ROWS = 100;          // ノードごとの表に出す数（時間の大きい順）
const CON_RE = /Constraint$|^lookAt$/;

/** 汎用の経路で評価したノードが何で動くか（RigEvaluator の接続から。専用の評価の分類と同じ名前にそろえる） */
export function nodeCategory(rig, ni) {
  if (rig.fallback && rig.fallback.has(ni)) return '推定のノード';
  if (rig.ikJoint && rig.ikJoint.has(ni)) {
    const h = rig.byId.get(rig.ikJoint.get(ni));
    return `IK（${(h && h.ik && h.ik.solver) || 'IK'}）で動くジョイント`;
  }
  if (rig.tainted && rig.tainted.has(ni)) return '値を求められないノード（未対応のノードの影響）';
  const types = new Set();
  const g = rig.dagGraph && rig.dagGraph.get(ni);
  if (g && g.inputs) {
    for (const src of Object.values(g.inputs)) {
      if (!src || src.curve !== undefined) continue;
      const sg = rig.byId.get(src.node);
      if (!sg) continue;
      types.add(sg.dag >= 0 ? 'DAG ノードの直接の接続' : CON_RE.test(sg.type) ? sg.type : `計算ノード（${sg.type}）`);
    }
  }
  if (!types.size) return 'キーで動くノード';
  return `${[...types].sort().join('・')} で動くノード`;
}

export class EvalProfiler {
  constructor() {
    this.recording = false;
    this.clear();
  }

  clear() {
    this.frames = [];                  // [{ f, path, parts: { key: ms }, total, interval, reason }]
    this.categories = new Map();       // 種類 → { label, path, nodes: Set, ms }
    this.reasons = new Map();          // 経路（汎用の経路に任せた理由など）→ { label, path, nodes: Set, ms }
    this.perNode = new Map();          // ノード番号 → { ni, name, label（種類）, path, ms }（ノードごとの表）
    this.perDef = new Map();           // 自作ノード（グラフの id）→ { name, type, compiled, compute, read, calls }
    this.evaluated = 0;                // キャッシュを使わずに評価したフレームの数
    this.warmLeft = this.warmStart ?? WARM_FRAMES;   // 集計に入れない、準備のフレームの残り（WARM_FRAMES）
    this.warmed = 0;                   // 準備として除いたフレームの数
    this.current = null;
    this.lastShown = 0;
    this.stepCache = new WeakMap();    // 計画の手順 → 分類
    this.nodeCache = new Map();        // 汎用の経路のノード番号 → 種類
    this.cacheRig = null;
    this.version = (this.version || 0) + 1;
  }

  /** @param warm 集計に入れない始めのフレームの数（WARM_FRAMES） */
  start(warm = WARM_FRAMES) { this.recording = true; this.lastShown = 0; this.warmLeft = this.warmStart = warm; this.version++; }
  stop() { this.recording = false; this.current = null; this.version++; }

  // ---------------------------------------------------------------- 1 フレーム
  /**
   * フレームの処理を始める（記録中でなければ null を返し、何もしない）。
   * @param prep 準備中（テクスチャの読み込み中など）なら、その説明。そのフレームは記録するが、集計には入れない
   */
  beginFrame(f, prep = null) {
    if (!this.recording) return null;
    const skip = this.warmLeft > 0 ? 'warm' : prep ? 'prep' : null;
    this.current = { f, path: null, parts: {}, total: 0, interval: 0, genericMs: 0, reason: null, t0: performance.now(), skip, prep };
    return this.current;
  }

  /** いまのフレームを集計に入れないか（準備のフレーム・準備中） */
  get skipping() { return !!(this.current && this.current.skip); }

  /** 数の記録（key: いまは 'world' だけ。計算した数 n・全体 total） */
  count(key, n, total) {
    const c = this.current;
    if (c) (c.counts || (c.counts = {}))[key] = [n, total];
  }

  /** 行列の更新・表示の内訳の時間を足す（key は SUB_PARTS の key） */
  sub(key, ms) {
    const c = this.current;
    if (c) (c.sub || (c.sub = {}))[key] = ((c.sub && c.sub[key]) || 0) + ms;
  }

  /** 区間の時間を足す（part は PARTS の key） */
  add(part, ms) {
    const c = this.current;
    if (c) c.parts[part] = (c.parts[part] || 0) + ms;
  }

  /**
   * リグの評価の時間を、経路（rig.lastPath）に合わせて振り分ける。
   * @param reason 全体を汎用の経路で評価したときの理由
   */
  addEval(rig, ms, reason) {
    const c = this.current;
    if (!c) return;
    c.path = rig.lastPath;
    if (rig.lastPath === 'cache') { this.add('cache', ms); return; }
    if (!c.skip) this.evaluated++;
    if (rig.lastPath === 'generic') {
      this.add('generic', ms);
      c.reason = reason;
      if (c.skip) return;
      const e = this.addReason(`汎用の経路（${reason}）`, 'generic', null, ms);
      for (const ni of rig.moving) e.nodes.add(ni);
      return;
    }
    // 専用の評価: 任せたノードの時間（手順ごとに記録した分）は汎用の経路
    const g = Math.min(c.genericMs, ms);
    this.add('generic', g);
    this.add('compiled', ms - g);
  }

  /** 専用の評価の手順ごとの時間（runPlan から。記録中だけ呼ばれる） */
  step(plan, s, ms) {
    if (this.cacheRig !== plan.rig) this.resetCaches(plan.rig);
    let cat = this.stepCache.get(s);
    if (!cat) this.stepCache.set(s, cat = stepCategory(plan, s));
    if (cat.path === 'generic' && this.current) this.current.genericMs += ms;
    if (this.skipping) return;
    this.addCategory(cat.label, cat.path, s.ni, ms);
    this.addNode(plan.rig, s.ni, cat.label, cat.path, ms);
    if (cat.path === 'generic') {
      this.addReason(`汎用の経路に任せた: ${cat.why}`, 'generic', s.ni, ms);
    } else {
      this.addReason('専用の評価', 'compiled', s.ni, ms);
    }
  }

  /** 汎用の経路のノードごとの時間（RigEvaluator.evaluate から。記録中だけ呼ばれる） */
  node(rig, ni, ms) {
    if (this.cacheRig !== rig) this.resetCaches(rig);
    let label = this.nodeCache.get(ni);
    if (!label) this.nodeCache.set(ni, label = nodeCategory(rig, ni));
    if (this.skipping) return;
    this.addCategory(label, 'generic', ni, ms);
    this.addNode(rig, ni, label, 'generic', ms);
  }

  /**
   * 自作ノード（exprespy など）の 1 回の計算（RigEvaluator.defOutputsProfiled から。記録中だけ）。
   * compute: 計算そのもの、read: 入力の読み込み（上流の値を求める時間。ほかの自作ノードの分は除く）
   */
  defNode(g, d, compute, read, reads = 0, inputs = 0) {
    if (this.skipping) return;
    let e = this.perDef.get(g.id);
    if (!e) {
      this.perDef.set(g.id, e = { id: g.id, name: g.name, type: g.def, compiled: !!(d && d.compiled), compute: 0, read: 0, calls: 0,
        reads: 0, inputs: 0 });
    }
    e.compute += compute;
    e.read += read;
    e.calls++;
    e.reads += reads;                  // コードが入力を読んだ回数（同じ入力も数える）
    e.inputs += inputs;                // 実際に読んだ入力の数（異なる入力）
  }

  addNode(rig, ni, label, path, ms) {
    let e = this.perNode.get(ni);
    if (!e) {
      const n = rig.sceneNodes[ni];
      this.perNode.set(ni, e = { ni, name: (n && (n.name || n.path)) || `ノード ${ni}`, dagPath: (n && n.path) || '', label, path, ms: 0 });
    }
    e.ms += ms;
  }

  resetCaches(rig) {
    this.cacheRig = rig;
    this.stepCache = new WeakMap();
    this.nodeCache = new Map();
  }

  addCategory(label, path, ni, ms) {
    let e = this.categories.get(label);
    if (!e) this.categories.set(label, e = { label, path, nodes: new Set(), ms: 0 });
    e.nodes.add(ni);
    e.ms += ms;
  }

  addReason(label, path, ni, ms) {
    let e = this.reasons.get(label);
    if (!e) this.reasons.set(label, e = { label, path, nodes: new Set(), ms: 0 });
    if (ni !== null && ni !== undefined) e.nodes.add(ni);
    e.ms += ms;
    return e;
  }

  /** フレームの処理を終える（描画はこのあとの addRender で足す） */
  endFrame(now = performance.now()) {
    const c = this.current;
    if (!c) return;
    const known = PARTS.reduce((s, p) => s + (p.key === 'scene' || p.key === 'render' ? 0 : (c.parts[p.key] || 0)), 0);
    c.parts.scene = Math.max(0, now - c.t0 - known);        // 評価・カーブ・値のほか（行列の更新・オーバーレイなど）
    c.interval = this.lastShown ? now - this.lastShown : 0;
    this.lastShown = now;
    delete c.t0;
    delete c.genericMs;
    this.current = null;
    if (c.skip === 'warm') {           // 準備のフレーム: 覚えない（描画の時間も入れない）
      this.warmLeft--;
      this.warmed++;
      this.pending = null;
      this.version++;
      return;
    }
    this.frames.push(c);
    if (this.frames.length > MAX_FRAMES) this.frames.splice(0, this.frames.length - MAX_FRAMES);
    this.pending = c;                  // 次の描画の時間を入れる
    this.current = null;
    this.version++;
  }

  /**
   * 描画の時間。直前に記録したフレームのものとして足す。ms: renderer.render、prep: その前の準備（行列の確認・
   * まとめて描くメッシュへの写し）。描画（CPU 側）には両方を足す
   */
  addRender(ms, info = null, prep = 0) {
    const c = this.pending;
    if (!this.recording || !c) return;
    c.parts.render = (c.parts.render || 0) + ms + prep;
    c.renderPrep = (c.renderPrep || 0) + prep;
    // ドローコール・ポリゴン数（三角形）・ライン（three.js の renderer.info.render。描画のたびに数え直される）
    if (info) c.draw = { calls: info.calls || 0, triangles: info.triangles || 0, lines: info.lines || 0 };
    this.pending = null;
    this.version++;
  }

  // ---------------------------------------------------------------- 集計
  /** フレームの内訳の平均など */
  summary() {
    const fr = this.frames.filter((e) => !e.skip);       // 準備中のフレームは集計に入れない
    const prep = this.frames.length - fr.length;
    const avg = {};
    for (const p of PARTS) avg[p.key] = 0;
    let total = 0, hits = 0, sumInterval = 0, nInterval = 0, max = 0;
    for (const e of fr) {
      let t = 0;
      for (const p of PARTS) { const v = e.parts[p.key] || 0; avg[p.key] += v; t += v; }
      e.total = t;
      total += t;
      if (t > max) max = t;
      if (e.path === 'cache') hits++;
      if (e.interval > 0 && e.interval < 1000) { sumInterval += e.interval; nInterval++; }   // 止めていた間・スクラブの間は除く
    }
    const n = fr.length || 1;
    for (const p of PARTS) avg[p.key] /= n;
    // 行列の更新・表示の内訳（その他 = 全体から内訳を引いた残り）と、ドローコール・ポリゴン数の平均
    const sub = {};
    for (const p of SUB_PARTS) sub[p.key] = fr.reduce((a, e) => a + ((e.sub && e.sub[p.key]) || 0), 0) / n;
    sub.other = Math.max(0, avg.scene - SUB_PARTS.reduce((a, p) => a + sub[p.key], 0));
    const drawn = fr.filter((e) => e.draw);
    const renderPrep = fr.reduce((a, e) => a + (e.renderPrep || 0), 0) / n;
    // ワールド行列を計算した数（前のフレームから変わったノードの下だけ）の平均
    const wc = fr.filter((e) => e.counts && e.counts.world);
    const world = wc.length ? { n: wc.reduce((a, e) => a + e.counts.world[0], 0) / wc.length, total: wc[wc.length - 1].counts.world[1] } : null;
    const draw = drawn.length ? {
      calls: drawn.reduce((a, e) => a + e.draw.calls, 0) / drawn.length,
      triangles: drawn.reduce((a, e) => a + e.draw.triangles, 0) / drawn.length,
      lines: drawn.reduce((a, e) => a + e.draw.lines, 0) / drawn.length,
    } : null;
    return {
      frames: fr.length, hits, evaluated: fr.length - hits, avg, sub, draw, total: total / n, max, prep, warmed: this.warmed,
      renderPrep, world,
      fps: nInterval ? 1000 / (sumInterval / nInterval) : null,
    };
  }

  /**
   * 種類ごと（mode = 'type'）・経路ごと（'path'）・ノードごと（'node'。上位 limit 個）の行。合計時間の大きい順。
   * ノードごとの行は { label: ノードの名前, kind: 種類, ni, nodes: 1, ms, share }
   */
  rows(mode, limit = NODE_ROWS) {
    if (mode === 'def') {
      // 自作ノード: 計算と入力の読み込みの合計の大きい順（1 フレームあたり）
      const all = [...this.perDef.values()];
      const sum = all.reduce((t, e) => t + e.compute + e.read, 0) || 1;
      const per = this.evaluated || 1;
      return all.sort((a, b) => (b.compute + b.read) - (a.compute + a.read)).slice(0, limit)
        .map((e) => ({ label: e.name, kind: e.type, compiled: e.compiled, nodes: 1, compute: e.compute / per, read: e.read / per,
          ms: (e.compute + e.read) / per, share: (e.compute + e.read) / sum,
          reads: e.calls ? e.reads / e.calls : 0, inputs: e.calls ? e.inputs / e.calls : 0 }));
    }
    if (mode === 'node') {
      const all = [...this.perNode.values()];
      const sum = all.reduce((t, e) => t + e.ms, 0) || 1;
      const per = this.evaluated || 1;
      const top = all.sort((a, b) => b.ms - a.ms).slice(0, limit);
      const names = uniqueNames(top);
      return top.map((e, i) => ({ label: names[i], kind: e.label, ni: e.ni, path: e.path, dagPath: e.dagPath, nodes: 1,
        ms: e.ms / per, share: e.ms / sum }));
    }
    const src = mode === 'path' ? this.reasons : this.categories;
    const all = [...src.values()];
    const sum = all.reduce((s, e) => s + e.ms, 0) || 1;
    const per = this.evaluated || 1;
    return all.map((e) => ({ label: e.label, path: e.path, nodes: e.nodes.size, ms: e.ms / per, share: e.ms / sum }))
      .sort((a, b) => b.ms - a.ms);
  }

  /** 自作ノード全体の、計算と入力の読み込みの合計（1 フレームあたり）と、ノードの数 */
  defTotals() {
    let compute = 0, read = 0;
    for (const e of this.perDef.values()) { compute += e.compute; read += e.read; }
    const per = this.evaluated || 1;
    return { nodes: this.perDef.size, compute: compute / per, read: read / per };
  }

  /** 評価したフレームの、種類ごとの合計（1 フレームあたり）と、リグの評価の時間（専用 + 汎用）の比較 */
  coverage() {
    let rig = 0, cats = 0;
    for (const e of this.frames) if (!e.skip && e.path !== 'cache') rig += (e.parts.compiled || 0) + (e.parts.generic || 0);
    for (const e of this.categories.values()) cats += e.ms;
    const per = this.evaluated || 1;
    return { rig: rig / per, categories: cats / per };
  }
}

/**
 * 表に出すノードの名前。同じ名前のノード（別のキャラクターの同じ名前のジョイントなど）は、区別できるところまで
 * DAG のパスを後ろから付ける（|char1|head|base_F → head|base_F）
 */
export function uniqueNames(entries) {
  const parts = entries.map((e) => (e.dagPath ? e.dagPath.split('|').filter(Boolean) : [e.name]));
  const depth = entries.map(() => 1);
  for (let round = 0; round < 64; round++) {
    const label = (i) => parts[i].slice(-depth[i]).join('|');
    const groups = new Map();
    entries.forEach((_, i) => { const k = label(i); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
    let changed = false;
    for (const idx of groups.values()) {
      if (idx.length < 2) continue;
      for (const i of idx) if (depth[i] < parts[i].length) { depth[i]++; changed = true; }
    }
    if (!changed) break;
  }
  return entries.map((e, i) => (depth[i] > 1 ? parts[i].slice(-depth[i]).join('|') : e.name));
}

/** バイト数を読みやすく */
export function formatBytes(b) {
  if (b < 1024 * 1024) return `${Math.max(1, Math.ceil(b / 1024))} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(b >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export const CACHE_LIMITS_MB = [128, 256, 512, 1024, 2048];

/**
 * 再生キャッシュの状態
 * @returns null（リグがない）か { moving, perFrame, frames, range, bytes, limit, fits: [[MB, フレーム数]] }
 */
export function cacheInfo(rig, clip) {
  if (!rig || !clip) return null;
  const st = rig.playbackStats();
  const L = rig.playbackLayer();
  // 1 フレームの大きさ: 覚えたフレームの平均（まだないときは見込み）
  const perFrame = L && L.frames.size ? L.bytes / L.frames.size : rig.frameBytes;
  let range = 0, have = 0;
  for (let f = Math.ceil(clip.start); f <= clip.end; f++) { range++; if (L && L.frames.has(f)) have++; }
  return {
    moving: rig.moving.size, perFrame, frames: have, range, bytes: st.bytes, limit: st.limit, full: st.full,
    // 上限ごとに入るフレームの数（再生範囲で頭打ちにしない。範囲の短いシーンでも、ほかのシーンの見積もりに使えるように）
    fits: CACHE_LIMITS_MB.map((mb) => [mb, Math.floor((mb * 1024 * 1024) / Math.max(1, perFrame))]),
  };
}

/** 専用の評価の計画の状態（defs: 自作ノードの定義の種類の数と、計算を JavaScript の関数にした数） */
export function planInfo(rig) {
  if (!rig) return null;
  const defs = rig.defs ? [...rig.defs.values()] : [];
  const d = { total: defs.length, compiled: defs.filter((x) => x && x.compiled).length };
  const p = rig.compiledPlan;
  if (!p) return { used: false, reason: rig.compiledReason || (rig.compiledPlan === undefined ? '最初の評価のあとで作ります' : '不明'), defs: d };
  return { used: true, counts: p.counts, delegated: p.delegated, defs: d };
}

const pad = (s, n) => {
  // 全角を 2 文字分として、右を空白で埋める
  let w = 0;
  for (const ch of String(s)) w += /[\u0000-ÿ]/.test(ch) ? 1 : 2;
  return String(s) + ' '.repeat(Math.max(1, n - w));
};
const ms = (v) => `${v.toFixed(2)} ms`;
const TEXT_NODE_ROWS = 30;             // 文字の結果に出すノードの数

/**
 * 結果を文字にする（［テキストでコピー］）
 * @param ctx { scene: { meshes, vertices, joints, curves }, clip, rig, workers: BakeWorkers の stats() }
 */
export function profilerText(prof, ctx) {
  const L = [];
  const s = prof.summary();
  L.push('評価のプロファイラ');
  if (ctx.scene) {
    const c = ctx.scene;
    L.push(`シーン: メッシュ ${c.meshes}・頂点 ${c.vertices}・ジョイント ${c.joints}・カーブ ${c.curves}`);
  }
  if (ctx.clip) L.push(`再生範囲: ${ctx.clip.start}〜${ctx.clip.end}（${ctx.clip.fps} fps。フレームバジェット ${(1000 / ctx.clip.fps).toFixed(1)} ms）`);
  L.push('');
  L.push(`■ フレームの内訳（記録 ${s.frames} フレーム: キャッシュあり ${s.hits}・キャッシュなし ${s.evaluated}）`);
  if (s.fps) L.push(`表示できたフレームレート: ${s.fps.toFixed(1)} fps`);
  if (s.warmed || s.prep) {
    L.push(`  集計から除いたフレーム: 記録を始めた直後（準備） ${s.warmed}・準備中（テクスチャの読み込み中など） ${s.prep}`);
  }
  for (const p of PARTS) L.push(`  ${pad(p.label, 36)}${ms(s.avg[p.key])}`);
  const subText = (p) => `${p.label} ${ms(s.sub[p.key])}` + (p.key === 'world' && s.world ? `（${Math.round(s.world.n)} / ${s.world.total} 個）` : '');
  L.push(`  行列の更新・表示・その他の内訳: ${SUB_PARTS.map(subText).join('・')}・その他 ${ms(s.sub.other)}`);
  if (s.draw) L.push(`  描画のうち、準備（行列の確認・まとめて描くメッシュへの写し）: ${ms(s.renderPrep)}`);
  if (s.draw) L.push(`  ドローコール ${Math.round(s.draw.calls)}・ポリゴン数（三角形） ${Math.round(s.draw.triangles)}・ライン ${Math.round(s.draw.lines)}（1 フレームの平均）`);
  L.push(`  ${pad('合計（平均）', 36)}${ms(s.total)}　最大 ${ms(s.max)}`);
  const split = (pred) => {
    const fr = prof.frames.filter((e) => !e.skip && pred(e));
    if (!fr.length) return null;
    return fr.reduce((a, e) => a + PARTS.reduce((t, p) => t + (e.parts[p.key] || 0), 0), 0) / fr.length;
  };
  const hit = split((e) => e.path === 'cache'), miss = split((e) => e.path !== 'cache');
  if (hit !== null) L.push(`  キャッシュありのフレームの平均: ${ms(hit)}`);
  if (miss !== null) L.push(`  キャッシュなしのフレームの平均: ${ms(miss)}`);
  for (const [mode, title] of [['type', '■ リグの評価の種類ごと（キャッシュなしのフレームの平均）'], ['path', '■ 評価の経路ごと（キャッシュなしのフレームの平均）'],
    ['node', `■ ノードごと（時間の大きい ${TEXT_NODE_ROWS} 個。上流の計算は、最初に読んだノードに入る）`]]) {
    L.push('');
    L.push(title);
    const rows = prof.rows(mode, TEXT_NODE_ROWS);
    if (!rows.length) L.push('  （キャッシュなしで評価したフレームがありません）');
    for (const r of rows) {
      if (mode === 'node') L.push(`  ${pad(r.label, 40)}${pad(ms(r.ms), 12)}${pad(`${(r.share * 100).toFixed(1)}%`, 8)}${r.kind}`);
      else L.push(`  ${pad(r.label, 60)}${pad(`${r.nodes} 個`, 10)}${pad(ms(r.ms), 12)}${(r.share * 100).toFixed(1)}%`);
    }
  }
  const cov = prof.coverage();
  if (prof.evaluated) L.push(`  （種類ごとの合計 ${ms(cov.categories)} / リグの評価 ${ms(cov.rig)}）`);
  if (prof.perDef.size) {
    const t = prof.defTotals();
    L.push('');
    L.push(`■ 自作ノード（exprespy など）の計算と入力の読み込み（キャッシュなしのフレームの平均。時間の大きい ${TEXT_NODE_ROWS} 個）`);
    L.push(`  全体: ${t.nodes} 個・計算 ${ms(t.compute)}・入力の読み込み ${ms(t.read)}`);
    for (const r of prof.rows('def', TEXT_NODE_ROWS)) {
      L.push(`  ${pad(r.label, 40)}計算 ${pad(ms(r.compute), 12)}読み込み ${pad(ms(r.read), 12)}`
        + `${pad(`入力 ${Math.round(r.inputs)}（読む回数 ${Math.round(r.reads)}）`, 28)}${r.kind}${r.compiled ? '' : '（関数にしていない）'}`);
    }
  }
  const pi = planInfo(ctx.rig);
  if (pi) {
    L.push('');
    L.push('■ 専用の評価の計画');
    if (!pi.used) L.push(`  使っていません: ${pi.reason}`);
    else {
      const c = pi.counts;
      L.push(`  キーで動く ${c.simple}・入力で動く ${c.driven}（計算ノード ${c.math || 0}）・任せた ${c.delegated}・コンストレイント ${c.constraints}・IK ${c.ik}`);
      for (const [why, n] of Object.entries(pi.delegated || {})) L.push(`  任せた理由: ${why}（${n} 個）`);
    }
    if (pi.defs.total) L.push(`  自作ノードの定義（exprespy など）: ${pi.defs.total} 種類（計算を JavaScript の関数にした ${pi.defs.compiled}）`);
  }
  const ci = cacheInfo(ctx.rig, ctx.clip);
  if (ci) {
    L.push('');
    L.push('■ 再生キャッシュ');
    L.push(`  動くノード ${ci.moving} 個・1 フレーム ${formatBytes(ci.perFrame)}`);
    L.push(`  覚えたフレーム ${ci.frames} / ${ci.range}・${formatBytes(ci.bytes)}（上限 ${ci.limit ? formatBytes(ci.limit) : 'オフ'}）`);
    L.push(`  上限ごとに入るフレーム数（再生範囲は ${ci.range} フレーム）: ${ci.fits.map(([mb, n]) => `${mb >= 1024 ? mb / 1024 + 'GB' : mb + 'MB'} ${n}`).join('・')}`);
  }
  const w = ctx.workers;
  if (w) {
    L.push('');
    L.push('■ 再生キャッシュを作るワーカー');
    if (!w.available) {
      L.push('  使っていません（画面のスレッドの空き時間に作ります）');
      if (w.error) L.push(`  理由: ${errorText(w.error)}`);
    } else {
      L.push(`  ワーカー ${w.count} 個（CPU のコア ${w.cores || '不明'}）・${w.busy ? '作っています' : '止まっています'}`);
      if (w.frames) {
        L.push(`  読み込んでから作ったフレーム ${w.frames}・1 フレームの評価 ${ms(w.perFrame)}（ワーカーの中）`);
        if (w.throughput) L.push(`  全体の速さ: 1 フレームあたり ${ms(1000 / w.throughput)}（${w.throughput.toFixed(1)} フレーム/秒）`);
      } else L.push('  まだ作っていません');
      const st = workerStartText(w);
      if (st) L.push(`  ${st}`);
    }
  }
  L.push('');
  L.push('※ 描画は CPU 側で命令を出す時間で、GPU の処理の時間は含みません。1 ノードの時間は短いため、記録したフレームを通した平均です。');
  return L.join('\n');
}

/** ワーカーのエラー（スタックを含む文字）を 1 行に: 1 行目と、起きた所の関数名 */
export function errorText(message) {
  const s = String(message || '');
  const names = stackNames(s);
  return `${s.split('\n')[0]}${names.length ? `（場所: ${names.join(' ← ')}）` : ''}`;
}

/**
 * ワーカーが作り始めるまでの様子（評価のプロファイラ）: 最初の結果が届くまでの時間と、ワーカーの中の時間
 * （準備・最初のフレーム・計画・スタックがあふれてやり直した回数）。何もなければ空
 */
export function workerStartText(w) {
  const sec = (x) => `${(x / 1000).toFixed(1)} 秒`;
  const parts = [];
  if (w.firstMs !== null && w.firstMs !== undefined) parts.push(`最初の結果が届くまで ${sec(w.firstMs)}`);
  else if (w.waitingMs !== null && w.waitingMs !== undefined) parts.push(`最初の結果を待っています（${sec(w.waitingMs)}）`);
  const t = w.timing;
  if (t) {
    // 準備の内訳: JSON の読み込み・アニメーション（AnimationClip）・評価器（RigEvaluator。うち自作ノードの定義を関数にする時間）
    const has = (x) => x !== undefined && x !== null;
    const inner = [];
    if (has(t.parseMs)) inner.push(`JSON の読み込み ${sec(t.parseMs)}`);
    if (has(t.clipMs)) inner.push(`アニメーション ${sec(t.clipMs)}${has(t.keys) ? `（キー ${t.keys.toLocaleString('en-US')} 個）` : ''}`);
    if (has(t.rigMs)) inner.push(`評価器 ${sec(t.rigMs)}（うち自作ノードの定義を関数にする ${sec(t.defsMs || 0)}）`);
    else if (has(t.defsMs)) inner.push(`自作ノードの定義を関数にする ${sec(t.defsMs)}`);
    const recv = has(t.recvMs) ? `受け取り ${sec(t.recvMs)}・` : '';
    parts.push(`ワーカーの中: ${recv}準備 ${sec(t.createMs)}${inner.length ? `（${inner.join('・')}）` : ''}・最初のフレーム ${sec(t.firstMs)}`
      + `${t.planMs !== null ? `（うち専用の評価の計画 ${sec(t.planMs)}）` : ''}・専用の評価 ${t.plan ? '使う' : `使わない${t.reason ? `（${t.reason}）` : ''}`}`
      + `・スタックがあふれてやり直した回数 ${t.retries}`
      + `${t.interpreted ? `・関数をやめて IR をたどる計算にした自作ノードの定義 ${t.interpreted} 種類（関数ではスタックに収まらない）` : ''}`);
  }
  if (w.sendMs) parts.push(`アニメーションを送る（画面のスレッド）${sec(w.sendMs)}`);
  return parts.join('・');
}

/** ［このフレームを確かめる］の結果を文字にする（［テキストでコピー］） */
export function checkText(r) {
  if (!r) return '';
  const L = [`■ このフレームの確認（フレーム ${r.frame}${r.posed ? '。ポーズ確認の追加分あり' : ''}）`];
  const list = (diff) => diff.slice(0, 30).map((d) => `    ${d.name}（差 ${d.err.toExponential(1)}）`);
  for (const x of r.rig) {
    L.push(`  ${x.label}: 動くノード ${x.compared} 個のうち、汎用の経路と違うもの ${x.diff.length} 個`);
    L.push(...list(x.diff));
  }
  L.push(`  表示の行列: 表示中のオブジェクト ${r.display.checked} 個のうち、親からたどった値と違うもの ${r.display.diff.length} 個`);
  L.push(...list(r.display.diff));
  return L.join('\n');
}
