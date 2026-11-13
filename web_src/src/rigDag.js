// RigEvaluator の DAG ノード（チャンネルの値・ローカル行列・ワールド行列・親の空間・レストの値・ポーズ確認の追加分）。rig.js から分けたもの（整備計画の D5）。
// メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Matrix4, Vector3 } from 'three';
import { clampLimits, composeLocalMatrix, evaluateCurve, poseChannels } from './animation.js';
import {
  ANGLE_KEYS, CHAN_MODES, CHANNEL_ATTR_RE, D2R, IDENTITY, NO_INPUTS, R2D, VEC_KEYS, VIS_DEFAULTS, xformKey, XYZ,
} from './rig.js';

export class DagMethods {
  rest(ni) {
    const e = this.clip.byNode.get(ni);
    return e ? e.rest : null;
  }

  parentWorld(ni) {
    const n = this.sceneNodes[ni];
    return n.parent >= 0 && n.inheritsTransform !== false ? this.world(n.parent) : IDENTITY;
  }

  /** offsetParentMatrix（Matrix4。接続があれば評価した値、なければファイルの値。単位行列なら null） */
  opmOf(ni) {
    const g = this.dagGraph.get(ni);
    const src = g && g.inputs ? g.inputs.opm : null;
    let v = src ? this.source(src) : null;
    if (!src) {
      const rest = this.rest(ni);
      v = rest ? rest.opm : this.sceneNodes[ni].opm;
    }
    if (v && v.isMatrix4) return v;
    return Array.isArray(v) && v.length === 16 ? new Matrix4().fromArray(v) : null;
  }

  /**
   * 親の空間（Maya の .parentMatrix）: 親のワールド行列 · offsetParentMatrix（Maya の資料: offsetParentMatrix は親と
   * ローカルの間の暗黙の親）。チャンネルの値（移動・回転）を解釈する空間。ワールド行列 = 親の空間 · ローカル（opm を除く）
   */
  parentSpace(ni) {
    const P = this.parentWorld(ni);
    const o = this.opmOf(ni);
    return o ? P.clone().multiply(o) : P;
  }

  /** ローカル行列（Maya の .matrix。offsetParentMatrix を含まない。ポーズ確認の追加分を含む） */
  localMatrix(ni) {
    const o = this.opmOf(ni);
    const L = this.posedLocal(ni);
    return o ? o.clone().invert().multiply(L) : L;
  }

  /**
   * チャンネルの値 { t, r（度）, s }。mode: 'full'（すべて）・'fk'（IK を除く）・'t'（移動だけ。回転の計算を避ける）
   */
  chan(ni, mode = 'full') {
    const rest = this.rest(ni);
    if (!rest) return null;
    const restCopy = () => {
      const c = { ...rest };
      for (const k of VEC_KEYS) if (rest[k]) c[k] = rest[k].slice();
      return c;
    };
    return this.memo(this.cache.chan, this.keep.chan, ni * 3 + CHAN_MODES[mode], () => {
      const out = restCopy();
      const entry = this.clip.byNode.get(ni);
      // カーブが動かす属性（接続より優先する）。't' のときに使わない成分が入っていても、下でその成分の接続は読まないので同じ
      const fromCurve = this.curveAttrsOf(entry);
      for (const ch of entry.channels) {
        if (mode === 't' && ch.base !== 't') continue;
        out[ch.base][ch.axis] = evaluateCurve(ch.curve, this.frame);
        this.varying = true;
      }
      for (const [key2, src] of this.chanInputs(ni)) {
        if (key2 === 'opm') {                                   // offsetParentMatrix の接続（行列ベースの親子付け）
          if (mode === 't') continue;
          const m = this.source(src);
          if (m && m.isMatrix4) out.opm = m.toArray();
          else if (Array.isArray(m) && m.length === 16) out.opm = m.slice();
          continue;
        }
        const [base, axis] = xformKey(key2);
        if ((mode === 't' && base !== 't') || fromCurve.has(key2)) continue;
        const v = this.source(src);
        if (v === undefined) continue;
        if (base === 'ro') {                                    // 回転順（スペースの切り替えなど）
          const x = Array.isArray(v) ? v[0] : v;
          if (typeof x === 'number' && Number.isFinite(x)) out.ro = Math.min(5, Math.max(0, Math.round(x)));
          continue;
        }
        const k = ANGLE_KEYS.has(base) ? R2D : 1;
        if (!out[base]) out[base] = [0, 0, 0];                  // ファイルに値がない（既定値 0）ピボットなど
        if (axis < 0) {
          if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (!fromCurve.has(base + XYZ[a])) out[base][a] = v[a] * k;
        } else if (typeof v === 'number') out[base][axis] = v * k;
      }
      if (this.ikJoint.has(ni) && (mode === 'full' || (mode === 't' && this.splineRoots.has(ni)))) {
        const sol = this.solveIK(this.ikJoint.get(ni));
        const v = sol && sol.get(ni);
        if (Array.isArray(v)) {
          if (mode === 'full') out.r = v;
        } else if (v) {                                    // { r, t }（スプライン IK の開始ジョイント）
          if (v.t) out.t = v.t;
          if (v.r && mode === 'full') out.r = v.r;
        }
      }
      return clampLimits(out);                                 // 移動・回転・スケールの制限（Maya の transform の limit）
    }, restCopy, () => `chan ${mode}:${ni}`);
  }

  /** ノードのカーブが動かす属性の Set（チャンネルの並びが同じあいだは使い回す） */
  curveAttrsOf(entry) {
    let c = this.curveAttrs.get(entry);
    if (!c || c.n !== entry.channels.length) {
      c = { n: entry.channels.length, set: new Set(entry.channels.map((ch) => ch.attr)) };
      this.curveAttrs.set(entry, c);
    }
    return c.set;
  }

  /** チャンネル（移動・回転・スケール）と offsetParentMatrix の接続 [属性, 接続元]（接続の順。最初に 1 回だけ調べる） */
  chanInputs(ni) {
    let list = this.chanInputList.get(ni);
    if (!list) {
      const g = this.dagGraph.get(ni);
      list = g && g.inputs ? Object.entries(g.inputs).filter(([k]) => k === 'opm' || CHANNEL_ATTR_RE.test(k)) : NO_INPUTS;
      this.chanInputList.set(ni, list);
    }
    return list;
  }

  /** ローカル行列（ファイルの値。ポーズ確認の追加分なし） */
  localFile(ni) {
    const rest = this.rest(ni);
    if (!this.fallback.has(ni) && (!rest || !this.moving.has(ni))) return this.staticLocal(ni);
    return this.memo(this.cache.local, this.keep.local, ni, () => this.localFileUncached(ni, rest), null, null);
  }

  localFileUncached(ni, rest) {
    const fb = this.fallback.get(ni);
    if (fb) {
      // 推定: 確かな一番近い祖先（anchor）からの相対を、バインドポーズのとおりに保つ
      //   W = W(anchor) · B(anchor)⁻¹ · B(ni)   →   ローカル = 親の W⁻¹ · W
      const W = fb.anchor >= 0
        ? this.world(fb.anchor).clone().multiply(this.bindWorld(fb.anchor).clone().invert()).multiply(this.bindWorld(ni))
        : this.bindWorld(ni).clone();
      return this.parentWorld(ni).clone().invert().multiply(W);
    }
    const c = this.chan(ni, 'full');
    let isScale = null;
    if (rest.isScale || (rest.isNode ?? -1) >= 0) {
      isScale = rest.isNode >= 0 && this.rest(rest.isNode) ? this.chan(rest.isNode, 'full').s : rest.isScale;
    }
    return composeLocalMatrix(c, isScale, new Matrix4());
  }

  /** ワールド行列（ファイルの値 · ポーズ確認の追加分） */
  world(ni) {
    return this.memo(this.cache.world, this.keep.world, ni, () => {
      return new Matrix4().multiplyMatrices(this.parentWorld(ni), this.posedLocal(ni));
    }, () => {
      const local = this.staticLocal(ni);
      return new Matrix4().multiplyMatrices(this.parentWorld(ni), local);
    }, () => `world ${ni}`);
  }

  /**
   * ポーズ確認の追加分を含むローカル行列。チャンネルの値の分かるノードは、追加分を移動・回転・スケールの値に入れて
   * 制限（limit）の範囲に収めたもの（ファイルの値 · 組み直した差分。制限にかからなければ ファイルの値 · 追加分）
   */
  posedLocal(ni) {
    const d = this.poseAt(ni);
    if (!d) return this.localFile(ni);
    const local = this.localFile(ni).clone();
    if (!this.rest(ni) || this.fallback.has(ni)) return local.multiply(d);
    const isScale = this.isScaleOf(ni);
    const before = composeLocalMatrix(this.chan(ni, 'full'), isScale, new Matrix4());
    return local.multiply(before.invert().multiply(composeLocalMatrix(this.posedChan(ni), isScale, new Matrix4())));
  }

  /**
   * 移動の値（ポーズ確認の追加分を含む）。追加分がなければ回転を求めない chan(ni, 't')（IK などの循環を避ける）
   */
  posedT(ni) {
    return this.poseAt(ni) && !this.fallback.has(ni) ? this.posedChan(ni).t : this.chan(ni, 't').t;
  }

  /**
   * ほかのノードが読む移動・回転・スケールの値（ポーズ確認の追加分を入れ、制限の範囲に収めたもの）。
   * 追加分がなければ chan(ni, 'full') と同じ
   */
  posedChan(ni) {
    const d = this.rest(ni) && !this.fallback.has(ni) ? this.poseAt(ni) : null;
    if (!d) return this.chan(ni, 'full');
    // 追加分は memo の中でも読む（覚えた値の依存に入れる。追加分を変えたら捨てる）
    return this.memo(this.cache.posed, this.keep.posed, ni,
      () => clampLimits(poseChannels(this.chan(ni, 'full'), this.isScaleOf(ni), this.poseAt(ni))),
      () => this.chan(ni, 'full'), () => `pose ${ni}`);
  }

  /** バインドポーズのワールド行列（バインドポーズの情報がないノードはファイルの値。フレームによらない） */
  bindWorld(ni) {
    const hit = this.bindCache.get(ni);
    if (hit) return hit;
    const n = this.sceneNodes[ni];
    const local = new Matrix4().fromArray(n.bindMatrix || n.matrix);
    const p = n.inheritsTransform !== false ? n.parent : -1;
    const m = p >= 0 ? this.bindWorld(p).clone().multiply(local) : local;
    this.bindCache.set(ni, m);
    return m;
  }

  /** 'estimated'（バインドポーズの形で推定）・'unknown'（値を求められない）・null */
  statusOf(ni) {
    if (this.fallback.has(ni)) return 'estimated';
    return this.tainted.has(ni) ? 'unknown' : null;
  }

  /** 回転に依存しない位置（親のワールド行列 · 移動の値）。IK の開始ジョイントなど、循環を避けたい所で使う */
  pivotPosition(ni, target = new Vector3()) {
    const t = this.rest(ni) ? this.posedT(ni) : [0, 0, 0];
    return target.set(t[0], t[1], t[2]).applyMatrix4(this.parentSpace(ni));
  }

  /** DAG ノードのプラグ */
  dagPlug(ni, attr) {
    const rest = this.rest(ni);
    const g = this.dagGraph.get(ni);
    const base = attr.replace(/\[\d+\]$/, '');                // pm[0] → pm
    const comp = (arr, k) => (k >= 0 ? arr[k] : arr);
    if (/^[trs][xyz]?$/.test(base)) {
      const axis = base.length === 2 ? XYZ.indexOf(base[1]) : -1;
      const c = !rest ? null : this.poseAt(ni) ? this.posedChan(ni) : this.chan(ni, base[0] === 't' ? 't' : 'full');
      if (!c) return axis >= 0 ? (base[0] === 's' ? 1 : 0) : (base[0] === 's' ? [1, 1, 1] : [0, 0, 0]);
      if (base[0] === 't') return comp(c.t, axis);
      if (base[0] === 'r') return comp(c.r.map((v) => v * D2R), axis);
      return comp(c.s, axis);
    }
    switch (base) {
      case 'pm': case 'parentMatrix': return this.parentSpace(ni);
      case 'pim': case 'parentInverseMatrix': return this.parentSpace(ni).clone().invert();
      case 'wm': case 'worldMatrix': return this.world(ni);
      case 'wim': case 'worldInverseMatrix': return this.world(ni).clone().invert();
      case 'm': case 'matrix': case 'xm': case 'xformMatrix': return this.localMatrix(ni);
      case 'im': case 'inverseMatrix': return this.localMatrix(ni).clone().invert();
      default: break;
    }
    if (CHANNEL_ATTR_RE.test(base)) {                         // ピボット・rotateAxis・jointOrient・せん断・回転順（接続があれば評価した値）
      // その属性の接続だけを評価する（コンストレイントは動かすノードの rp・jo を読むので、チャンネル全体を求めると循環する）
      const [key, axis] = xformKey(base);
      const k = ANGLE_KEYS.has(key) ? D2R : 1;
      let ro = rest ? rest.ro || 0 : 0;
      const v = rest && Array.isArray(rest[key]) ? rest[key].map((x) => x * k) : [0, 0, 0];   // ro は数
      for (const [key2, src] of this.chanInputs(ni)) {
        const [b, a] = xformKey(key2);
        if (b !== key) continue;
        const x = this.source(src);
        if (key === 'ro') { const y = Array.isArray(x) ? x[0] : x; if (typeof y === 'number') ro = Math.min(5, Math.max(0, Math.round(y))); }
        else if (a < 0 && Array.isArray(x)) for (let i = 0; i < 3; i++) v[i] = x[i];
        else if (a >= 0 && typeof x === 'number') v[a] = x;
      }
      if (key === 'ro') return ro;
      return comp(v, axis);
    }
    switch (base) {
      case 'v': case 'lodv': case 'ove': case 'ovv': {
        // 表示の属性: 接続があれば評価し、なければファイルの値（Python は既定と違う値だけを attrs に入れる）
        const v = g ? this.plug(g.id, base) : undefined;
        return typeof v === 'number' ? v : VIS_DEFAULTS[base];
      }
      case 'opm': case 'offsetParentMatrix': {
        const c = rest ? this.chan(ni, 'full') : null;
        return c && c.opm ? new Matrix4().fromArray(c.opm) : new Matrix4();
      }
      default: break;
    }
    if (g) {
      const v = this.plug(g.id, attr);
      if (v !== undefined) return v;
    }
    return 0;
  }
}
