// リグ（コンストレイント・IK・計算ノード）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（rig.py）が出力した animation.graph を、プラグ（ノードの属性）単位で必要になったときに計算する。
//   * 値の単位は Maya の内部単位にそろえる（角度はラジアン）。DAG ノードの回転を読み書きするときだけ度に直す
//   * ワールド行列は「ファイルの値（カーブ・リグの結果）· ポーズ確認の追加分」で計算する（表示がバインドポーズでも同じ）
//     → ポーズ確認でコントローラーを動かすと、コンストレイントや IK が追従する
//   * 1 回の評価（evaluate）の中では、同じプラグ・行列を一度だけ計算する
//   * 循環（自分の結果を自分で使う）に当たったら、そこはファイルの値で打ち切る
// 完全な再現は目指さず、Maya と同じ考え方の近似にする（docs/data_format.md「animation.graph」）。
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { composeLocalMatrix, evaluateCurve } from './animation.js';
import { compileExpression } from './expression.js';
import { arcLength, domain, parseNurbsCurve, pointAt, pointAtDistance, pointAtLength, polyline, withCvs } from './curve.js';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const EPS = 1e-9;
const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const THREE_ORDER = ROTATE_ORDERS.map((o) => o.split('').reverse().join('').toUpperCase());
const XYZ = ['x', 'y', 'z'];
const RGB = ['r', 'g', 'b'];
const XY = ['x', 'y'];
const XYZW = ['x', 'y', 'z', 'w'];
const IDENTITY = new Matrix4();

// 計算ノードの属性の既定値（ファイルに値がないとき）
const DEFAULTS = {
  multiplyDivide: { i1: [0, 0, 0], i2: [1, 1, 1], op: 1 },
  plusMinusAverage: { op: 1 },
  reverse: { i: [0, 0, 0] },
  condition: { ft: 0, st: 0, op: 0, ct: [0, 0, 0], cf: [1, 1, 1] },
  blendColors: { c1: [1, 0, 0], c2: [0, 0, 1], b: 0.5 },
  pairBlend: { w: 1, it1: [0, 0, 0], it2: [0, 0, 0], ir1: [0, 0, 0], ir2: [0, 0, 0], ri: 0 },
  unitConversion: { i: 0, cf: 1 },
  ikHandle: { pv: [0, 0, 1], twi: 0, ikb: 1 },              // Maya の既定の極ベクトルは Z 軸（既定値はファイルに書かれない）
  scaleConstraint: { o: [1, 1, 1] },
  aimConstraint: { a: [1, 0, 0], u: [0, 1, 0], wu: [0, 1, 0], wut: 3, o: [0, 0, 0] },
  decomposeMatrix: { ro: 0 },
  composeMatrix: { it: [0, 0, 0], ir: [0, 0, 0], is: [1, 1, 1], ish: [0, 0, 0], iro: 0, uer: 1 },
  quatToEuler: { iq: [0, 0, 0, 1], iro: 0 },
  eulerToQuat: { irt: [0, 0, 0], iro: 0 },
  quatProd: { iq1: [0, 0, 0, 1], iq2: [0, 0, 0, 1] },
  quatInvert: { iq: [0, 0, 0, 1] },
  quatNormalize: { iq: [0, 0, 0, 1] },
  quatSlerp: { iq1: [0, 0, 0, 1], iq2: [0, 0, 0, 1], it: 0 },
  displayLayer: { v: 1, dt: 0, e: 1 },
  addDoubleLinear: { i1: 0, i2: 0 },
  multDoubleLinear: { i1: 1, i2: 1 },
  clamp: { ip: [0, 0, 0], mn: [0, 0, 0], mx: [0, 0, 0] },
  setRange: { v: [0, 0, 0], n: [0, 0, 0], m: [0, 0, 0], on: [0, 0, 0], om: [0, 0, 0] },
  remapValue: { i: 0, imn: 0, imx: 1, omn: 0, omx: 1 },
  distanceBetween: { p1: [0, 0, 0], p2: [0, 0, 0] },
  vectorProduct: { i1: [0, 0, 0], i2: [0, 0, 0], op: 1, no: 0 },
  blendTwoAttr: { ab: 0 },
  blendWeighted: {},
  choice: { s: 0 },
  animBlendNodeAdditiveDL: { ia: 0, ib: 0, wa: 1, wb: 1 },
  animBlendNodeAdditiveDA: { ia: 0, ib: 0, wa: 1, wb: 1 },
  animBlendNodeAdditiveRotation: { ia: [0, 0, 0], ib: [0, 0, 0], wa: 1, wb: 1 },
  animLayer: { w: 1, m: 0 },
  cluster: { en: 1 },
  pointOnCurveInfo: { pr: 0, top: 0 },
};
// ikHandle の属性の既定値（スプライン IK を含む）
DEFAULTS.ikHandle = { ...DEFAULTS.ikHandle, roc: 0, off: 0, rol: 0, dtce: 0, dwut: 0, dwua: 0, dfa: 0,
  dwuv: [0, 1, 0], dwve: [0, 1, 0] };

// 型ごとの出力の属性（これ以外の名前で計算結果を探さない。入力を読むときに自分の計算へ戻らないため）
const OUTPUTS = {
  unitConversion: /^o$/, multiplyDivide: /^o[xyz]?$/, plusMinusAverage: /^o(1|2[xy]?|3[xyz]?)$/,
  reverse: /^o[xyz]?$/, condition: /^oc[rgb]?$/, blendColors: /^op[rgb]?$/, pairBlend: /^o[tr][xyz]?$/,
  pointConstraint: /^ct[xyz]?$/, poleVectorConstraint: /^ct[xyz]?$/, orientConstraint: /^cr[xyz]?$/,
  parentConstraint: /^c[tr][xyz]?$/, scaleConstraint: /^cs[xyz]?$/, aimConstraint: /^cr[xyz]?$/,
  quatToEuler: /^ort[xyz]?$/, eulerToQuat: /^oq[xyzw]?$/, quatProd: /^oq[xyzw]?$/, quatInvert: /^oq[xyzw]?$/,
  quatNormalize: /^oq[xyzw]?$/, quatSlerp: /^oq[xyzw]?$/, curveInfo: /^(al|arcLength)$/,
  nurbsCurve: /^(ws|worldSpace|l|local)(\[\d+\])?$/, skinCluster: /^og(\[\d+\])?$/, tweak: /^og(\[\d+\])?$/,
  groupParts: /^og$/, wire: /^og(\[\d+\])?$/, locator: /^(wp|worldPosition)(\[\d+\])?$/, expression: /^(out|output)\[\d+\]$/,
  addDoubleLinear: /^o$/, multDoubleLinear: /^o$/, clamp: /^op[rgb]?$/, setRange: /^o[xyz]?$/, remapValue: /^(ov|outValue)$/,
  distanceBetween: /^d$/, vectorProduct: /^o[xyz]?$/, blendTwoAttr: /^o$/, blendWeighted: /^o$/, choice: /^o$/,
  animBlendNodeAdditiveDL: /^o$/, animBlendNodeAdditiveDA: /^o$/, animBlendNodeAdditiveRotation: /^o[xyz]?$/, animLayer: /^fo$/,
  cluster: /^og(\[\d+\])?$/, pointOnCurveInfo: /^(p|n|t|nn|nt|cc)[xyz]?$|^cr$/,
  animCurveUA: /^(o|output)$/, animCurveUL: /^(o|output)$/, animCurveUU: /^(o|output)$/,
  multMatrix: /^o$/, decomposeMatrix: /^o(t|r|s|sh)[xyz]?$|^oq[xyzw]?$/, composeMatrix: /^omat$/, inverseMatrix: /^omat$/,
};
// DAG ノードの、値が決まると行列が変わる属性
const CHANNEL_RE = /^([trs][xyz]?|opm)$/;

/** ファイルの値が度で書かれている角度の属性（内部ではラジアンで扱う） */
function isAngleAttr(type, attr) {
  switch (type) {
    case 'pairBlend': return /^ir[12][xyz]?$/.test(attr);
    case 'orientConstraint': case 'aimConstraint': return /^o[xyz]?$/.test(attr);
    case 'composeMatrix': return /^ir[xyz]?$/.test(attr);
    case 'eulerToQuat': return /^irt[xyz]?$/.test(attr);
    case 'parentConstraint': return /^tg\[\d+\]\.tor[xyz]?$/.test(attr);
    case 'ikHandle': return attr === 'twi';
    case 'animBlendNodeAdditiveDA': return /^i[ab]$/.test(attr);
    case 'animBlendNodeAdditiveRotation': return /^i[ab][xyz]?$/.test(attr);
    default: return false;
  }
}

/** 3 つ組の属性の成分の名前（c1 → c1r など） */
function suffixesOf(type, base) {
  if ((type === 'blendColors' && (base === 'c1' || base === 'c2' || base === 'op'))
    || (type === 'condition' && (base === 'ct' || base === 'cf' || base === 'oc'))
    || (type === 'clamp' && /^(ip|mn|mx|op)$/.test(base))) return RGB;
  if (type === 'plusMinusAverage' && /^(o2|i2\[\d+\])$/.test(base)) return XY;
  if (/^(iq|iq1|iq2|oq)$/.test(base)) return XYZW;                // 四元数
  return XYZ;
}

const _v = new Vector3();
const _v2 = new Vector3();
const _s = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();

function rotationOf(m, target = new Quaternion()) {
  m.decompose(_v, target, _s);
  return target;
}
function positionOf(m, target = new Vector3()) { return target.setFromMatrixPosition(m); }
function eulerQuat(deg, order = 0, target = new Quaternion()) {
  return target.setFromEuler(_e.set(deg[0] * D2R, deg[1] * D2R, deg[2] * D2R, THREE_ORDER[order] || 'ZYX'));
}
function radQuat(rad, target = new Quaternion()) {
  return target.setFromEuler(_e.set(rad[0], rad[1], rad[2], 'ZYX'));     // 回転順 xyz
}

/** 重み付きの回転の平均（符号をそろえた四元数の和を正規化） */
function averageQuat(list) {
  const out = new Quaternion(0, 0, 0, 0);
  const ref = list[0].q;
  for (const { q, w } of list) {
    const sgn = q.dot(ref) < 0 ? -w : w;
    out.x += q.x * sgn; out.y += q.y * sgn; out.z += q.z * sgn; out.w += q.w * sgn;
  }
  return out.normalize();
}

// 再現チェックで試す IK の解き方の候補（Maya の細部の解釈が分からない点の組み合わせ）
const RP_VARIANTS = [];
for (const plane of ['points', 'axis']) {
  for (const twistSign of [1, -1, 0]) {
    for (const pvSpace of ['handle', 'world', 'start']) {
      for (const side of [1, -1]) RP_VARIANTS.push({ plane, twistSign, pvSpace, side });
    }
  }
}
const IK_VARIANTS = {
  ikRPsolver: RP_VARIANTS,
  ikSplineSolver: [{ splineInterp: 'angle' }, { splineInterp: 'lerp' }],
};
function variantLabel(v) {
  if (v.splineInterp) return v.splineInterp === 'lerp' ? 'ひねり: up ベクトルを直線で補間' : 'ひねり: 角度で配る（今の解き方）';
  const tw = { 1: 'ひねり 今の向き', '-1': 'ひねり 逆向き', 0: 'ひねり 使わない' }[v.twistSign];
  const sp = { handle: '極ベクトル ハンドルの親の空間', world: '極ベクトル ワールド空間', start: '極ベクトル 開始ジョイントの親の空間' }[v.pvSpace];
  const pl = v.plane === 'axis' ? '面 開始ジョイントの軸（肘の回転軸）を基準面にそろえる' : '面 3 点（今の解き方）';
  return `${pl}・${tw}・${sp}・肘 ${v.side === 1 ? '極ベクトルの側' : '反対側'}`;
}

export class RigEvaluator {
  /**
   * @param clip AnimationClip（カーブとノードの材料）
   * @param sceneNodes 共通 JSON の nodes
   * @param staticLocal (ni) => Matrix4  動かないノードのローカル行列（ファイルの値）
   */
  constructor(clip, sceneNodes, staticLocal) {
    this.clip = clip;
    this.sceneNodes = sceneNodes;
    this.staticLocal = staticLocal;
    this.graph = (clip.raw.graph || []).slice();
    this.byId = new Map(this.graph.map((g) => [g.id, g]));
    this.dagGraph = new Map();               // ノード番号 → グラフのノード
    for (const g of this.graph) if (g.dag >= 0) this.dagGraph.set(g.dag, g);
    this.ikJoint = new Map();                // IK で回転が決まるジョイント → ハンドル（グラフの id）
    for (const g of this.graph) {
      if (!g.ik) continue;
      for (const ni of g.ik.chain.slice(0, -1)) this.ikJoint.set(ni, g.id);      // 終端以外
    }
    // ほかのノードを動かすノード（コンストレイントのターゲット・IK ハンドル・計算ノードの入力元）とその祖先。
    // ポーズ確認でこれらを動かしたら、リグを評価し直す
    this.drivers = new Set();
    this.directDrivers = new Set();          // 直接の入力元と IK ハンドル（と、その親）。コントローラーの目印に使う
    const addUp = (ni) => {
      this.directDrivers.add(ni);
      for (let x = ni; x >= 0 && !this.drivers.has(x); x = sceneNodes[x].parent) this.drivers.add(x);
    };
    for (const g of this.graph) {
      if (g.ik) {
        addUp(g.dag);
        if (sceneNodes[g.dag].parent >= 0) this.directDrivers.add(sceneNodes[g.dag].parent);
      }
      for (const src of Object.values(g.inputs || {})) {
        const s = src.node !== undefined ? this.byId.get(src.node) : null;
        if (s && s.dag >= 0) addUp(s.dag);
      }
    }
    // 動くノード: カーブ・リグの接続・IK で値が決まるノードと、スケールが動く親を持つジョイント（スケール補正）。
    // それ以外の材料（コントローラーなど）は、プラグの値を読むためだけに使い、行列はファイルの値のまま
    this.moving = new Set();
    const scaled = new Set();
    for (const e of clip.entries) {
      const g = this.dagGraph.get(e.node);
      const keys = g && g.inputs ? Object.keys(g.inputs).filter((k) => CHANNEL_RE.test(k)) : [];
      if (e.channels.length || this.ikJoint.has(e.node) || keys.length) this.moving.add(e.node);
      if (e.channels.some((c) => c.base === 's') || keys.some((k) => k[0] === 's')) scaled.add(e.node);
    }
    for (const e of clip.entries) {
      if ((e.rest.isNode ?? -1) >= 0 && scaled.has(e.rest.isNode)) this.moving.add(e.node);
    }
    // 値を求められないノード: バインドポーズの形で推定する（fallback）・推定もできない（tainted。子にも伝わる）
    this.fallback = new Map((clip.raw.fallback || []).map((f) => [f.node, f]));
    for (const ni of this.fallback.keys()) this.moving.add(ni);
    const taintRoots = new Set(clip.raw.tainted || []);
    this.tainted = new Set();
    sceneNodes.forEach((n, i) => {
      const p = n.inheritsTransform !== false ? n.parent : -1;
      if (taintRoots.has(i) || (p >= 0 && this.tainted.has(p) && !this.fallback.has(i))) this.tainted.add(i);
    });
    this.bindCache = new Map();
    this.matrices = new Map();               // evaluate() の結果（動くノードだけ）
    // スプライン IK で、開始ジョイントの位置もカーブに合わせるもの（rootOnCurve）
    this.splineRoots = new Set(this.graph.filter((g) => g.ik && g.ik.solver === 'ikSplineSolver'
      && ((g.attrs || {}).roc ?? 0) >= 0.5).map((g) => g.ik.chain[0]));
    // 時間で変わる expression（frame・time を使う式）があるか（キーがなくてもタイムラインを出す）
    this.usesTime = this.graph.some((g) => g.type === 'expression' && /\b(frame|time)\b/.test(g.expr || ''));
    this.problems = new Set();               // 評価中に見つかった問題（循環など）
    this.ikVariant = null;                   // 再現チェックで試す IK の解き方の候補（ふだんは null）
    this.frame = 0;
    this.poseOf = () => null;
    this.reset();
  }

  get hasGraph() { return this.graph.length > 0; }

  reset() {
    this.cache = { chan: new Map(), local: new Map(), world: new Map(), plug: new Map(), out: new Map(), ik: new Map() };
    this.busy = new Set();
  }

  /**
   * フレーム f の、動くノードのローカル行列（ポーズ確認の追加分を含まない）を計算する。
   * @param poseOf (ni) => Matrix4 | null  ポーズ確認の追加分（ワールド行列の計算にだけ使う）
   */
  evaluate(f, poseOf = () => null, target = this.matrices) {
    this.frame = f;
    this.poseOf = poseOf;
    this.reset();
    for (const ni of this.moving) {
      const m = target.get(ni) || new Matrix4();
      m.copy(this.localFile(ni));
      target.set(ni, m);
    }
    return target;
  }

  /** 循環の防止。key の計算中にもう一度 key を求めたら fallback を返す */
  guard(key, fn, fallback) {
    if (this.busy.has(key)) {
      this.problems.add(`循環: ${key}`);
      return fallback();
    }
    this.busy.add(key);
    try { return fn(); } finally { this.busy.delete(key); }
  }

  // ------------------------------------------------------------------ DAG ノード
  rest(ni) {
    const e = this.clip.byNode.get(ni);
    return e ? e.rest : null;
  }

  parentWorld(ni) {
    const n = this.sceneNodes[ni];
    return n.parent >= 0 && n.inheritsTransform !== false ? this.world(n.parent) : IDENTITY;
  }

  /**
   * チャンネルの値 { t, r（度）, s }。mode: 'full'（すべて）・'fk'（IK を除く）・'t'（移動だけ。回転の計算を避ける）
   */
  chan(ni, mode = 'full') {
    const key = `${mode}:${ni}`;
    const hit = this.cache.chan.get(key);
    if (hit) return hit;
    const rest = this.rest(ni);
    const out = rest ? { ...rest, t: rest.t.slice(), r: rest.r.slice(), s: rest.s.slice() } : null;
    if (!out) return null;
    const res = this.guard(`chan ${key}`, () => {
      const entry = this.clip.byNode.get(ni);
      const fromCurve = new Set();
      for (const ch of entry.channels) {
        if (mode === 't' && ch.base !== 't') continue;
        out[ch.base][ch.axis] = evaluateCurve(ch.curve, this.frame);
        fromCurve.add(ch.attr);
      }
      const g = this.dagGraph.get(ni);
      if (g && g.inputs) {
        for (const [key2, src] of Object.entries(g.inputs)) {
          if (key2 === 'opm' && mode !== 't') {                 // offsetParentMatrix の接続（行列ベースの親子付け）
            const m = this.source(src);
            if (m && m.isMatrix4) out.opm = m.toArray();
            else if (Array.isArray(m) && m.length === 16) out.opm = m.slice();
            continue;
          }
          const base = key2[0];
          if (!/^[trs][xyz]?$/.test(key2) || (mode === 't' && base !== 't') || fromCurve.has(key2)) continue;
          const v = this.source(src);
          if (v === undefined) continue;
          const k = base === 'r' ? R2D : 1;
          if (key2.length === 1) {
            if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (!fromCurve.has(base + XYZ[a])) out[base][a] = v[a] * k;
          } else if (typeof v === 'number') out[base][XYZ.indexOf(key2[1])] = v * k;
        }
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
      return out;
    }, () => out);
    this.cache.chan.set(key, res);
    return res;
  }

  /** ローカル行列（ファイルの値。ポーズ確認の追加分なし） */
  localFile(ni) {
    const hit = this.cache.local.get(ni);
    if (hit) return hit;
    const fb = this.fallback.get(ni);
    if (fb) {
      // 推定: 確かな一番近い祖先（anchor）からの相対を、バインドポーズのとおりに保つ
      //   W = W(anchor) · B(anchor)⁻¹ · B(ni)   →   ローカル = 親の W⁻¹ · W
      const W = fb.anchor >= 0
        ? this.world(fb.anchor).clone().multiply(this.bindWorld(fb.anchor).clone().invert()).multiply(this.bindWorld(ni))
        : this.bindWorld(ni).clone();
      const m = this.parentWorld(ni).clone().invert().multiply(W);
      this.cache.local.set(ni, m);
      return m;
    }
    const rest = this.rest(ni);
    if (!rest || !this.moving.has(ni)) return this.staticLocal(ni);
    const c = this.chan(ni, 'full');
    let isScale = null;
    if (rest.joint && (rest.isScale || (rest.isNode ?? -1) >= 0)) {
      isScale = rest.isNode >= 0 && this.rest(rest.isNode) ? this.chan(rest.isNode, 'full').s : rest.isScale;
    }
    const m = composeLocalMatrix(c, isScale, new Matrix4());
    this.cache.local.set(ni, m);
    return m;
  }

  /** ワールド行列（ファイルの値 · ポーズ確認の追加分） */
  world(ni) {
    const hit = this.cache.world.get(ni);
    if (hit) return hit;
    const m = this.guard(`world ${ni}`, () => {
      const local = this.localFile(ni).clone();
      const d = this.poseOf(ni);
      if (d) local.multiply(d);
      return new Matrix4().multiplyMatrices(this.parentWorld(ni), local);
    }, () => {
      const local = this.staticLocal(ni);
      return new Matrix4().multiplyMatrices(this.parentWorld(ni), local);
    });
    this.cache.world.set(ni, m);
    return m;
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
    const t = (this.chan(ni, 't') || { t: [0, 0, 0] }).t;
    return target.set(t[0], t[1], t[2]).applyMatrix4(this.parentWorld(ni));
  }

  /** DAG ノードのプラグ */
  dagPlug(ni, attr) {
    const rest = this.rest(ni);
    const g = this.dagGraph.get(ni);
    const base = attr.replace(/\[\d+\]$/, '');                // pm[0] → pm
    const comp = (arr, k) => (k >= 0 ? arr[k] : arr);
    if (/^[trs][xyz]?$/.test(base)) {
      const axis = base.length === 2 ? XYZ.indexOf(base[1]) : -1;
      const c = rest ? this.chan(ni, base[0] === 't' ? 't' : 'full') : null;
      if (!c) return axis >= 0 ? (base[0] === 's' ? 1 : 0) : (base[0] === 's' ? [1, 1, 1] : [0, 0, 0]);
      if (base[0] === 't') return comp(c.t, axis);
      if (base[0] === 'r') return comp(c.r.map((v) => v * D2R), axis);
      return comp(c.s, axis);
    }
    switch (base) {
      case 'pm': case 'parentMatrix': return this.parentWorld(ni);
      case 'pim': case 'parentInverseMatrix': return this.parentWorld(ni).clone().invert();
      case 'wm': case 'worldMatrix': return this.world(ni);
      case 'wim': case 'worldInverseMatrix': return this.world(ni).clone().invert();
      case 'm': case 'matrix': return this.localFile(ni);
      case 'rp': case 'rpt': case 'sp': case 'spt': return rest && rest[base] ? rest[base] : [0, 0, 0];
      case 'jo': case 'ra': return rest && rest[base] ? rest[base].map((v) => v * D2R) : [0, 0, 0];
      case 'ro': return rest ? rest.ro || 0 : 0;
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

  // ------------------------------------------------------------------ プラグ
  /** 接続元の値 */
  source(src) {
    if (src.curve !== undefined) {
      const c = this.clip.curves[src.curve];
      if (!c) return undefined;
      const v = evaluateCurve(c, this.frame);
      return c.type === 'TA' ? v * D2R : v;
    }
    const g = this.byId.get(src.node);
    if (!g) return undefined;
    return g.dag >= 0 ? this.dagPlug(g.dag, src.attr) : this.plug(src.node, src.attr);
  }

  /** グラフのノードの属性の値（接続 → 計算結果 → ファイルの値 → 既定値） */
  plug(id, attr) {
    const key = `${id}.${attr}`;
    if (this.cache.plug.has(key)) return this.cache.plug.get(key);
    const v = this.guard(`plug ${key}`, () => this.plugUncached(id, attr), () => undefined);
    this.cache.plug.set(key, v);
    return v;
  }

  plugUncached(id, attr) {
    const g = this.byId.get(id);
    const inputs = g.inputs || {};
    if (inputs[attr]) return this.source(inputs[attr]);
    // 成分（ox）: 3 つ組（o）が接続されている
    const m = /^(.*?)([xyzrgb])$/.exec(attr);
    if (m && inputs[m[1]] && suffixesOf(g.type, m[1]).includes(m[2])) {
      const v = this.source(inputs[m[1]]);
      return Array.isArray(v) ? v[suffixesOf(g.type, m[1]).indexOf(m[2])] : undefined;
    }
    // 計算結果
    if (OUTPUTS[g.type] && OUTPUTS[g.type].test(attr)) {
      const outs = this.outputs(id);
      if (!outs) return undefined;
      return attr in outs ? outs[attr] : outs[attr.replace(/\[\d+\]$/, '')];       // ws[0] → ws
    }
    // 3 つ組: 成分ごとに接続・値がある
    const sfx = suffixesOf(g.type, attr);
    if (sfx.some((s) => inputs[attr + s])) {
      const def = this.staticValue(g, attr);
      return sfx.map((s, k) => {
        const v = this.plug(id, attr + s);
        return v !== undefined ? v : (Array.isArray(def) ? def[k] : 0);
      });
    }
    return this.staticValue(g, attr);
  }

  /** ファイルの値（なければ型ごとの既定値）。角度はラジアンにする */
  staticValue(g, attr) {
    const attrs = g.attrs || {};
    const k = isAngleAttr(g.type, attr) ? D2R : 1;
    const scale = (v) => (Array.isArray(v) ? v.map((x) => x * k) : v * k);
    if (attr in attrs) return scale(attrs[attr]);
    const m = /^(.*?)([xyzrgb])$/.exec(attr);
    if (m && Array.isArray(attrs[m[1]])) {
      const idx = suffixesOf(g.type, m[1]).indexOf(m[2]);
      if (idx >= 0) return attrs[m[1]][idx] * (isAngleAttr(g.type, m[1]) ? D2R : 1);
    }
    const sfx = suffixesOf(g.type, attr);
    if (sfx.some((s) => (attr + s) in attrs)) {
      const def = this.defaultValue(g.type, attr);
      return sfx.map((s, i) => (attr + s in attrs ? attrs[attr + s] : (Array.isArray(def) ? def[i] : 0)) * k);
    }
    return this.defaultValue(g.type, attr, k);
  }

  defaultValue(type, attr, k = 1) {
    if (/^w\d+$/.test(attr) || /\.tw$/.test(attr)) return 1;            // コンストレイントのウェイト
    const d = DEFAULTS[type] && DEFAULTS[type][attr];
    if (d !== undefined) return Array.isArray(d) ? d.map((x) => x * k) : d * k;
    const m = /^(.*?)([xyzrgb])$/.exec(attr);
    if (m && DEFAULTS[type] && Array.isArray(DEFAULTS[type][m[1]])) return DEFAULTS[type][m[1]][suffixesOf(type, m[1]).indexOf(m[2])] * k;
    return undefined;
  }

  /** 行列の属性（Matrix4。ファイルの値は 16 要素の配列。なければ単位行列） */
  mat(id, attr) {
    const v = this.plug(id, attr);
    if (v && v.isMatrix4) return v;
    if (Array.isArray(v) && v.length === 16) return new Matrix4().fromArray(v);
    return new Matrix4();
  }

  /** 配列の属性の添字（接続とファイルの値の両方から） */
  indices(g, re) {
    const keys = [...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})];
    return [...new Set(keys.map((k) => re.exec(k)).filter(Boolean).map((m) => +m[1]))].sort((a, b) => a - b);
  }

  num(id, attr, def = 0) {
    const v = this.plug(id, attr);
    return typeof v === 'number' && Number.isFinite(v) ? v : def;
  }

  vec(id, base, def = [0, 0, 0]) {
    const v = this.plug(id, base);
    if (Array.isArray(v)) return def.map((d, i) => (Number.isFinite(v[i]) ? v[i] : d));
    return def.slice();
  }

  // ------------------------------------------------------------------ 計算ノード
  outputs(id) {
    if (this.cache.out.has(id)) return this.cache.out.get(id);
    const o = this.guard(`out ${id}`, () => this.outputsUncached(id), () => null);
    this.cache.out.set(id, o);
    return o;
  }

  outputsUncached(id) {
    const g = this.byId.get(id);
    let o = null;
    switch (g.type) {
      case 'unitConversion': o = { o: this.num(id, 'i') * this.num(id, 'cf', 1) }; break;
      case 'multiplyDivide': o = this.multiplyDivide(id); break;
      case 'plusMinusAverage': o = this.plusMinusAverage(id); break;
      case 'reverse': o = expand('o', this.vec(id, 'i').map((x) => 1 - x), XYZ); break;
      case 'condition': o = this.condition(id); break;
      case 'blendColors': o = this.blendColors(id); break;
      case 'pairBlend': o = this.pairBlend(id); break;
      case 'pointConstraint': case 'orientConstraint': case 'parentConstraint':
      case 'scaleConstraint': case 'poleVectorConstraint': case 'aimConstraint':
        o = this.constraint(g);
        break;
      case 'multMatrix': {
        // Maya の o = i[0] · i[1] · …（行ベクトル）は、three.js では … · i[1] · i[0]
        const out = new Matrix4();
        for (const i of this.indices(g, /^i\[(\d+)\]$/)) out.premultiply(this.mat(id, `i[${i}]`));
        o = { o: out };
        break;
      }
      case 'decomposeMatrix': {
        const t = new Vector3(), q = new Quaternion(), s = new Vector3();
        this.mat(id, 'imat').decompose(t, q, s);
        const e = new Euler().setFromQuaternion(q, THREE_ORDER[Math.round(this.num(id, 'ro', 0))] || 'ZYX');
        o = { ...expand('ot', t.toArray(), XYZ), ...expand('or', [e.x, e.y, e.z], XYZ), ...expand('os', s.toArray(), XYZ),
          ...expand('osh', [0, 0, 0], XYZ), ...expand('oq', [q.x, q.y, q.z, q.w], ['x', 'y', 'z', 'w']) };
        break;
      }
      case 'composeMatrix': {
        const t = this.vec(id, 'it'), r = this.vec(id, 'ir'), s = this.vec(id, 'is', [1, 1, 1]);
        let q;
        if (this.num(id, 'uer', 1) >= 0.5) {
          q = new Quaternion().setFromEuler(new Euler(r[0], r[1], r[2], THREE_ORDER[Math.round(this.num(id, 'iro', 0))] || 'ZYX'));
        } else {
          const v = this.vec(id, 'iq', [0, 0, 0, 1]);
          q = new Quaternion(v[0], v[1], v[2], v[3] ?? 1).normalize();
        }
        o = { omat: new Matrix4().compose(new Vector3(...t), q, new Vector3(...s)) };
        break;
      }
      case 'inverseMatrix': o = { omat: this.mat(id, 'imat').clone().invert() }; break;
      case 'quatToEuler': {
        const e = new Euler().setFromQuaternion(this.quat(id, 'iq').normalize(), this.order(id, 'iro'));
        o = expand('ort', [e.x, e.y, e.z], XYZ);
        break;
      }
      case 'eulerToQuat': {
        const r = this.vec(id, 'irt');
        const q = new Quaternion().setFromEuler(new Euler(r[0], r[1], r[2], this.order(id, 'iro')));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatProd': {
        // Maya の積 input1 · input2 は「1 を先に回してから 2」（行ベクトル規約）。three.js では q2 · q1
        const q = this.quat(id, 'iq2').multiply(this.quat(id, 'iq1'));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatInvert': case 'quatNormalize': {
        const q = this.quat(id, 'iq').normalize();
        if (g.type === 'quatInvert') q.invert();
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatSlerp': {
        const q = this.quat(id, 'iq1').normalize().slerp(this.quat(id, 'iq2').normalize(), this.num(id, 'it', 0));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'curveInfo': {
        const c = this.plug(id, 'ic');
        const al = c && c.isCurve ? arcLength(c) : 0;
        o = { al, arcLength: al };
        break;
      }
      case 'nurbsCurve': o = this.curveOutputs(g); break;
      case 'locator': {
        const p = positionOf(g.parent >= 0 ? this.world(g.parent) : IDENTITY).toArray();
        o = { wp: p, worldPosition: p };
        break;
      }
      case 'skinCluster': o = this.skinCurve(g); break;
      case 'wire': o = this.wireCurves(g); break;
      case 'cluster': o = this.clusterCurves(g); break;
      case 'addDoubleLinear': o = { o: this.num(id, 'i1', 0) + this.num(id, 'i2', 0) }; break;
      case 'multDoubleLinear': o = { o: this.num(id, 'i1', 1) * this.num(id, 'i2', 1) }; break;
      case 'clamp': {
        const v = this.vec(id, 'ip'), lo = this.vec(id, 'mn'), hi = this.vec(id, 'mx');
        o = expand('op', v.map((x, i) => Math.min(Math.max(x, lo[i]), hi[i])), RGB);
        break;
      }
      case 'setRange': {
        const v = this.vec(id, 'v'), n = this.vec(id, 'n'), m = this.vec(id, 'm'), on = this.vec(id, 'on'), om = this.vec(id, 'om');
        o = expand('o', v.map((x, i) => (Math.abs(om[i] - on[i]) < 1e-12 ? n[i] : n[i] + (x - on[i]) / (om[i] - on[i]) * (m[i] - n[i]))), XYZ);
        break;
      }
      case 'remapValue': o = this.remapValue(g); break;
      case 'pointOnCurveInfo': o = this.pointOnCurve(g); break;
      case 'distanceBetween': {
        const p1 = new Vector3(...this.vec(id, 'p1')).applyMatrix4(this.mat(id, 'im1'));
        const p2 = new Vector3(...this.vec(id, 'p2')).applyMatrix4(this.mat(id, 'im2'));
        o = { d: p1.distanceTo(p2) };
        break;
      }
      case 'vectorProduct': {
        // op: 0 なし・1 内積・2 外積・3 ベクトル × 行列・4 点 × 行列
        const a = new Vector3(...this.vec(id, 'i1')), b = new Vector3(...this.vec(id, 'i2'));
        const op = Math.round(this.num(id, 'op', 1));
        let r;
        if (op === 1) { const d = a.dot(b); r = new Vector3(d, d, d); }
        else if (op === 2) r = a.clone().cross(b);
        else if (op === 3) r = a.clone().applyMatrix3(new Matrix3().setFromMatrix4(this.mat(id, 'm')));   // 移動を除く
        else if (op === 4) r = a.clone().applyMatrix4(this.mat(id, 'm'));
        else r = a.clone();
        if (this.num(id, 'no', 0) >= 0.5 && op !== 1) r.normalize();
        o = expand('o', r.toArray(), XYZ);
        break;
      }
      case 'blendTwoAttr': {
        const ab = this.num(id, 'ab', 0);
        o = { o: this.num(id, 'i[0]', 0) * (1 - ab) + this.num(id, 'i[1]', 0) * ab };
        break;
      }
      case 'blendWeighted': {
        let sum = 0;
        for (const k of this.indices(g, /^i\[(\d+)\]$/)) sum += this.num(id, `i[${k}]`, 0) * this.num(id, `w[${k}]`, 1);
        o = { o: sum };
        break;
      }
      case 'choice': o = { o: this.plug(id, `i[${Math.round(this.num(id, 's', 0))}]`) }; break;
      case 'animBlendNodeAdditiveDL': case 'animBlendNodeAdditiveDA':
        o = { o: this.num(id, 'ia', 0) * this.num(id, 'wa', 1) + this.num(id, 'ib', 0) * this.num(id, 'wb', 1) };
        break;
      case 'animBlendNodeAdditiveRotation': {
        const a = this.vec(id, 'ia'), b = this.vec(id, 'ib'), wa = this.num(id, 'wa', 1), wb = this.num(id, 'wb', 1);
        o = expand('o', a.map((x, i) => x * wa + b[i] * wb), XYZ);
        break;
      }
      case 'animCurveUA': case 'animCurveUL': case 'animCurveUU': {
        // ドリブンキー: 入力（ドライバーの値。角度は unitConversion で度になっている）でカーブを引く
        const c = this.clip.curves[g.curve];
        if (!c) break;
        const v = evaluateCurve(c, this.num(id, 'i', 0));
        o = { o: g.type === 'animCurveUA' ? v * D2R : v };
        o.output = o.o;
        break;
      }
      case 'animLayer': o = { fo: this.num(id, 'm', 0) >= 0.5 ? 0 : this.num(id, 'w', 1) }; break;
      case 'expression': o = this.expression(g); break;
      case 'tweak': {                                       // 頂点の調整は反映しない（形はそのまま通す）
        const c = this.plug(id, 'ip[0].ig');
        o = c && c.isCurve ? { og: c } : null;
        break;
      }
      case 'groupParts': {
        const c = this.plug(id, 'ig');
        o = c && c.isCurve ? { og: c } : null;
        break;
      }
      default: break;
    }
    return o;
  }

  /**
   * wire: ワイヤー（dw[i]）とベースワイヤー（bw[i]）の差で、カーブ（ip[k].ig）の CV を動かす（ワールド空間で計算）。
   * CV ごとにベースワイヤーの一番近い点（パラメータ u）を求め、距離 d と影響範囲 dds[i] から重み f = (1 − (d/dds)²)²。
   *   p' = W(u) + R · (p − B(u)) · (1 + (sc − 1) · f)    （B・W はベースワイヤー・ワイヤーの点、R は接線の向きの変化 × rot · f）
   *   移動量 = (p' − p) · f をワイヤーごとに足し、エンベロープ（en）と CV のウェイト（wl[k].w[v]）を掛ける。
   * Maya の計算式は公開されていないので近似（tension・localInfluence・holder は使わない）
   */
  wireCurves(g) {
    const id = g.id;
    const wires = this.indices(g, /^dw\[(\d+)\]$/).map((i) => {
      const W = this.plug(id, `dw[${i}]`), B = this.plug(id, `bw[${i}]`);
      if (!W || !W.isCurve || !B || !B.isCurve || W.cvs.length !== B.cvs.length) return null;
      // 同じパラメータで折れ線にする（ベースの点とワイヤーの点が対応する）
      const pb = polyline(B, 32).pts, pw = polyline(W, 32).pts;
      return { pb, pw, dds: this.num(id, `dds[${i}]`, 1), sc: this.num(id, `sc[${i}]`, 1) };
    }).filter(Boolean);
    const en = this.num(id, 'en', 1), rot = this.num(id, 'rot', 1);
    const out = {};
    for (const k of this.indices(g, /^ip\[(\d+)\]\.ig$/)) {
      const c = this.plug(id, `ip[${k}].ig`);
      if (!c || !c.isCurve) continue;
      const gp = (g.geom || {})[k];
      const Wg = gp >= 0 ? this.world(gp) : IDENTITY;
      const WgInv = Wg.clone().invert();
      const attrs = g.attrs || {};
      const cvs = c.cvs.map((local, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const weight = (typeof wv === 'number' ? wv : 1) * en;
        if (!wires.length || Math.abs(weight) < EPS) return local.clone();
        const p = local.clone().applyMatrix4(Wg);
        const disp = new Vector3();
        for (const { pb, pw, dds, sc } of wires) {
          // ベースワイヤーの一番近い点（折れ線の線分 j の割合 t）
          let best = Infinity, bj = 0, bt = 0;
          for (let j = 0; j < pb.length - 1; j++) {
            const ab = _v.subVectors(pb[j + 1], pb[j]);
            const L = ab.lengthSq();
            const t = L > EPS ? Math.min(1, Math.max(0, _v2.subVectors(p, pb[j]).dot(ab) / L)) : 0;
            const d = _v2.copy(pb[j]).addScaledVector(ab, t).distanceToSquared(p);
            if (d < best) { best = d; bj = j; bt = t; }
          }
          const d = Math.sqrt(best);
          if (dds <= EPS || d >= dds) continue;
          const x = d / dds;
          const f = (1 - x * x) * (1 - x * x);
          const Bu = new Vector3().lerpVectors(pb[bj], pb[bj + 1], bt);
          const Wu = new Vector3().lerpVectors(pw[bj], pw[bj + 1], bt);
          const tb = new Vector3().subVectors(pb[bj + 1], pb[bj]).normalize();
          const tw = new Vector3().subVectors(pw[bj + 1], pw[bj]).normalize();
          const R = new Quaternion().slerp(new Quaternion().setFromUnitVectors(tb, tw), Math.min(1, Math.max(0, rot * f)));
          const q = new Vector3().subVectors(p, Bu).multiplyScalar(1 + (sc - 1) * f).applyQuaternion(R);
          disp.add(Wu.add(q).sub(p).multiplyScalar(f));
        }
        return p.addScaledVector(disp, weight).applyMatrix4(WgInv);
      });
      out[`og[${k}]`] = withCvs(c, cvs);
      if (!out.og) out.og = out[`og[${k}]`];
    }
    return out;
  }

  /**
   * cluster: ハンドルの行列でカーブ（ip[k].ig）の CV を動かす。
   * Maya の p · gm · pm · ma · gm⁻¹（行ベクトル）を three.js の順で gm⁻¹ · ma · pm · gm とし、CV のウェイト（wl[k].w[v]）と
   * エンベロープで元の位置と混ぜる。gm（geomMatrix）がファイルになければ、変形するカーブの transform のワールド行列。
   * relative（ハンドルの親の動きを除く）には対応しない
   */
  clusterCurves(g) {
    const id = g.id;
    const D = this.mat(id, 'ma').clone().multiply(this.mat(id, 'pm'));
    const en = this.num(id, 'en', 1);
    const attrs = g.attrs || {};
    const out = {};
    for (const k of this.indices(g, /^ip\[(\d+)\]\.ig$/)) {
      const c = this.plug(id, `ip[${k}].ig`);
      if (!c || !c.isCurve) continue;
      const gp = (g.geom || {})[k];
      const G = Array.isArray(attrs[`gm[${k}]`]) ? new Matrix4().fromArray(attrs[`gm[${k}]`]) : (gp >= 0 ? this.world(gp) : IDENTITY);
      const M = G.clone().invert().multiply(D).multiply(G);
      const cvs = c.cvs.map((p, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const w = (typeof wv === 'number' ? wv : 1) * en;
        return Math.abs(w) < EPS ? p.clone() : p.clone().lerp(p.clone().applyMatrix4(M), w);
      });
      out[`og[${k}]`] = withCvs(c, cvs);
      if (!out.og) out.og = out[`og[${k}]`];
    }
    return out;
  }

  /**
   * pointOnCurveInfo: カーブ（ic）のパラメータ pr の点・接線・法線。turnOnPercentage（top）なら pr は長さの割合（0〜1）。
   * 接線（t）はパラメータでの微分、法線（n）は 2 階微分の接線に垂直な成分（曲率の向き）。どちらも差分で求める
   */
  pointOnCurve(g) {
    const id = g.id;
    const c = this.plug(id, 'ic');
    if (!c || !c.isCurve) return null;
    const [u0, u1] = domain(c);
    let u = this.num(id, 'pr', 0);
    if (this.num(id, 'top', 0) >= 0.5) {
      const poly = polyline(c, 64);
      const s = Math.min(Math.max(u, 0), 1) * poly.total;
      let k = 0;
      while (k < poly.len.length - 2 && poly.len[k + 1] < s) k++;
      const seg = poly.len[k + 1] - poly.len[k];
      const frac = seg > EPS ? (s - poly.len[k]) / seg : 0;
      u = u0 + (u1 - u0) * (k + frac) / (poly.pts.length - 1);
    }
    u = Math.min(Math.max(u, u0), u1);
    const h = (u1 - u0) * 1e-4;
    const at = (x) => pointAt(c, Math.min(Math.max(x, u0), u1));
    const p = at(u);
    const a = Math.max(u - h, u0), b = Math.min(u + h, u1);
    const t = at(b).sub(at(a)).divideScalar(b - a);
    const d2 = at(b).add(at(a)).sub(p.clone().multiplyScalar(2)).divideScalar(((b - a) / 2) ** 2);
    const tn = t.clone().normalize();
    const n = d2.clone().addScaledVector(tn, -d2.dot(tn));
    const speed2 = t.lengthSq();
    const curvature = speed2 > EPS ? n.length() / speed2 : 0;
    const cr = curvature > EPS ? 1 / curvature : 0;
    const cc = curvature > EPS ? p.clone().addScaledVector(n.clone().normalize(), cr) : p.clone();
    return { ...expand('p', p.toArray(), XYZ), ...expand('t', t.toArray(), XYZ), ...expand('nt', tn.toArray(), XYZ),
      ...expand('n', n.toArray(), XYZ), ...expand('nn', n.clone().normalize().toArray(), XYZ),
      ...expand('cc', cc.toArray(), XYZ), cr };
  }

  /** remapValue: 入力を 0〜1 にして値のランプ（vl[i]: 位置 vp・値 fv・補間 vi）を引き、出力の範囲に戻す */
  remapValue(g) {
    const id = g.id;
    const lo = this.num(id, 'imn', 0), hi = this.num(id, 'imx', 1);
    const t = Math.abs(hi - lo) < 1e-12 ? 0 : (this.num(id, 'i', 0) - lo) / (hi - lo);
    const attrs = g.attrs || {};
    const pts = this.indices(g, /^vl\[(\d+)\]/).map((i) => {
      const whole = attrs[`vl[${i}]`];
      const get = (name, k, def) => {
        if ((g.inputs || {})[`vl[${i}].${name}`]) return this.num(id, `vl[${i}].${name}`, def);
        if (typeof attrs[`vl[${i}].${name}`] === 'number') return attrs[`vl[${i}].${name}`];
        return Array.isArray(whole) && Number.isFinite(whole[k]) ? whole[k] : def;
      };
      return { p: get('vp', 0, 0), v: get('fv', 1, 0), interp: Math.round(get('vi', 2, 1)) };
    }).sort((a, b) => a.p - b.p);
    let r;
    if (!pts.length) r = Math.min(1, Math.max(0, t));                        // 既定: (0, 0)〜(1, 1) の直線
    else if (t <= pts[0].p) r = pts[0].v;
    else if (t >= pts[pts.length - 1].p) r = pts[pts.length - 1].v;
    else {
      let j = 0;
      while (j < pts.length - 2 && pts[j + 1].p <= t) j++;
      const a = pts[j], b = pts[j + 1];
      const u = (t - a.p) / Math.max(b.p - a.p, 1e-12);
      // 補間: 0 なし・1 線形・2 スムーズ・3 スプライン（スムーズで近似）
      const f = a.interp === 0 ? 0 : a.interp === 1 ? u : u * u * (3 - 2 * u);
      r = a.v + (b.v - a.v) * f;
    }
    const omn = this.num(id, 'omn', 0), omx = this.num(id, 'omx', 1);
    const ov = omn + r * (omx - omn);
    return { ov, outValue: ov };
  }

  /** expression: 式を（最初の 1 回だけ）関数にして、このフレームの値で評価する。出力は out[n] */
  expression(g) {
    if (g.program === undefined) {
      try {
        g.program = compileExpression(g.expr || '');
      } catch (err) {
        g.program = null;
        g.problem = err.message;
      }
    }
    if (!g.program) {
      this.problems.add(`expression ${g.name} を解釈できません: ${g.problem}`);
      return null;
    }
    let res;
    try {
      res = g.program.run({
        input: (k) => this.num(g.id, `in[${k}]`, 0),
        frame: this.frame,
        time: this.frame / (this.clip.fps || 24),
      });
    } catch (err) {
      this.problems.add(`expression ${g.name}: ${err.message}`);
      return null;
    }
    const o = {};
    for (const [k, v] of res.out) if (Number.isFinite(v)) o[`out[${k}]`] = v;
    return o;
  }

  quat(id, base) {
    const v = this.vec(id, base, [0, 0, 0, 1]);
    return new Quaternion(v[0], v[1], v[2], v[3]);
  }

  order(id, attr) { return THREE_ORDER[Math.round(this.num(id, attr, 0))] || 'ZYX'; }

  /** nurbsCurve の出力: local（形）と ws（ワールド空間）。形は create の接続か .cc。制御点（cp）の接続は位置をそのまま使う */
  curveOutputs(g) {
    let base = null;
    const inputs = g.inputs || {};
    if (inputs.cr) {
      const v = this.source(inputs.cr);
      if (v && v.isCurve) base = v;
    }
    if (!base) base = parseNurbsCurve((g.attrs || {}).cc);
    if (!base) return null;
    const cvs = base.cvs.map((c) => c.clone());
    for (const [k, v] of Object.entries(g.attrs || {})) {          // ファイルの調整（tweak）は足す
      const m = /^cp\[(\d+)\]$/.exec(k);
      if (m && cvs[+m[1]] && Array.isArray(v)) cvs[+m[1]].add(new Vector3(v[0], v[1], v[2]));
    }
    for (const [k, src] of Object.entries(inputs)) {               // 接続は位置そのもの
      const m = /^cp\[(\d+)\](?:\.([xyz])v)?$/.exec(k);
      if (!m || !cvs[+m[1]]) continue;
      const v = this.source(src);
      if (m[2] && typeof v === 'number') cvs[+m[1]].setComponent(XYZ.indexOf(m[2]), v);
      else if (Array.isArray(v)) cvs[+m[1]].set(v[0], v[1], v[2]);
    }
    const local = withCvs(base, cvs);
    const Wp = g.parent >= 0 ? this.world(g.parent) : IDENTITY;
    const ws = withCvs(base, cvs.map((c) => c.clone().applyMatrix4(Wp)));
    return { l: local, local, ws, worldSpace: ws };
  }

  /** カーブの skinCluster: p' = Σ w · (W · pm · gm) · p → gm⁻¹（three.js の順。Maya の p · gm · pm · W · gm⁻¹） */
  skinCurve(g) {
    const c = this.plug(g.id, 'ip[0].ig');
    if (!c || !c.isCurve || !g.skin) return null;
    if (!g.weightsOf) {
      g.weightsOf = new Map();
      for (const [v, i, w] of g.skin.weights) {
        if (!g.weightsOf.has(v)) g.weightsOf.set(v, []);
        g.weightsOf.get(v).push([i, w]);
      }
    }
    const gm = g.skin.gm ? new Matrix4().fromArray(g.skin.gm) : new Matrix4();
    const gmInv = gm.clone().invert();
    const mats = new Map();
    const matOf = (i) => {
      if (!mats.has(i)) {
        const pmIn = (g.inputs || {})[`pm[${i}]`];
        const pm = pmIn ? this.mat(g.id, `pm[${i}]`) : new Matrix4().fromArray(g.skin.pm[String(i)] || new Matrix4().elements);
        mats.set(i, this.mat(g.id, `ma[${i}]`).clone().multiply(pm).multiply(gm));
      }
      return mats.get(i);
    };
    const cvs = c.cvs.map((p, v) => {
      const list = g.weightsOf.get(v);
      if (!list) return p.clone();
      const acc = new Vector3();
      let total = 0;
      for (const [i, w] of list) {
        if (w === 0) continue;
        acc.addScaledVector(p.clone().applyMatrix4(matOf(i)), w);
        total += w;
      }
      return total > EPS ? acc.divideScalar(total).applyMatrix4(gmInv) : p.clone();
    });
    const out = withCvs(c, cvs);
    return { og: out };
  }

  multiplyDivide(id) {
    const a = this.vec(id, 'i1'), b = this.vec(id, 'i2', [1, 1, 1]);
    const op = Math.round(this.num(id, 'op', 1));
    const r = a.map((x, i) => {
      if (op === 1) return x * b[i];
      if (op === 2) return Math.abs(b[i]) < EPS ? x : x / b[i];
      if (op === 3) return x ** b[i];
      return x;
    });
    return expand('o', r, XYZ);
  }

  plusMinusAverage(id) {
    const g = this.byId.get(id);
    const op = Math.round(this.num(id, 'op', 1));
    const keys = new Set([...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})]);
    const idx = (re) => [...new Set([...keys].map((k) => re.exec(k)).filter(Boolean).map((m) => +m[1]))].sort((a, b) => a - b);
    const combine = (list) => {
      if (!list.length) return 0;
      if (op === 2) return list.slice(1).reduce((s, x) => s - x, list[0]);
      const sum = list.reduce((s, x) => s + x, 0);
      if (op === 3) return sum / list.length;
      return op === 0 ? list[0] : sum;
    };
    // 2D・3D の入力の成分は i2[0].i2x・i3[0].i3x の名前
    const element = (kind, i, sfx) => {
      const base = `i${kind}[${i}]`;
      const whole = this.plug(id, base);
      return sfx.map((s, k) => {
        const v = this.plug(id, `${base}.i${kind}${s}`);
        if (typeof v === 'number') return v;
        return Array.isArray(whole) ? whole[k] : 0;
      });
    };
    const one = idx(/^i1\[(\d+)\]$/).map((i) => this.num(id, `i1[${i}]`));
    const two = idx(/^i2\[(\d+)\]/).map((i) => element(2, i, XY));
    const three = idx(/^i3\[(\d+)\]/).map((i) => element(3, i, XYZ));
    const o2 = [0, 1].map((a) => combine(two.map((v) => v[a])));
    const o3 = [0, 1, 2].map((a) => combine(three.map((v) => v[a])));
    return { o1: combine(one), ...expand('o2', o2, XY), ...expand('o3', o3, XYZ) };
  }

  condition(id) {
    const a = this.num(id, 'ft'), b = this.num(id, 'st');
    const op = Math.round(this.num(id, 'op'));
    const ok = [a === b, a !== b, a > b, a >= b, a < b, a <= b][op] ?? false;
    return expand('oc', ok ? this.vec(id, 'ct', [0, 0, 0]) : this.vec(id, 'cf', [1, 1, 1]), RGB);
  }

  blendColors(id) {
    const c1 = this.vec(id, 'c1', [1, 0, 0]), c2 = this.vec(id, 'c2', [0, 0, 1]);
    const b = this.num(id, 'b', 0.5);
    return expand('op', c1.map((x, i) => x * b + c2[i] * (1 - b)), RGB);
  }

  pairBlend(id) {
    const w = this.num(id, 'w', 1);
    // 入力の成分は「軸 → 番号」の順の名前（itx1・irz2 など）。3 つ組（it1）の接続・値もある
    const g = this.byId.get(id);
    const inputs = g.inputs || {}, attrs = g.attrs || {};
    const tri = (b, k, angle) => {
      const whole = this.vec(id, `${b}${k}`);
      return XYZ.map((ax, i) => {
        const key = `${b}${ax}${k}`;
        if (inputs[key]) return this.num(id, key, 0);
        if (typeof attrs[key] === 'number') return attrs[key] * (angle ? D2R : 1);
        return whole[i];
      });
    };
    const t1 = tri('it', 1, false), t2 = tri('it', 2, false);
    const r1 = tri('ir', 1, true), r2 = tri('ir', 2, true);
    // 成分ごとのモード: 0 = 混ぜる、1 = 入力 1 だけ、2 = 入力 2 だけ
    const mode = (name) => Math.round(this.num(id, name, 0));
    const pick = (a, b, m) => (m === 1 ? a : m === 2 ? b : a * (1 - w) + b * w);
    const ot = XYZ.map((ax, i) => pick(t1[i], t2[i], mode(`t${ax}m`)));
    let or;
    if (Math.round(this.num(id, 'ri', 0)) === 1) {        // 四元数で補間
      const q = radQuat(r1).slerp(radQuat(r2, new Quaternion()), w);
      const e = new Euler().setFromQuaternion(q, 'ZYX');
      or = [e.x, e.y, e.z];
    } else {
      or = XYZ.map((ax, i) => pick(r1[i], r2[i], mode(`r${ax}m`)));
    }
    return { ...expand('ot', ot, XYZ), ...expand('or', or, XYZ) };
  }

  // ------------------------------------------------------------------ コンストレイント
  /** 出力（ct・cr・cs）は、動かされるノードの親の空間・内部単位 */
  constraint(g) {
    const id = g.id;
    const targets = [];
    for (const t of g.targets || []) {
      const tg = this.byId.get(t.node);
      if (!tg || tg.dag < 0) continue;
      const w = this.num(id, `tg[${t.index}].tw`, 1);
      if (w > 0) targets.push({ ni: tg.dag, index: t.index, w });
    }
    const total = targets.reduce((s, t) => s + t.w, 0);
    if (total <= EPS) return null;
    const driven = g.driven;
    const pw = driven >= 0 ? this.parentWorld(driven) : IDENTITY;
    const pwInv = pw.clone().invert();
    const pivot = (ni) => {                                    // ターゲットの回転ピボットのワールド位置
      const r = this.rest(ni);
      const rp = r && r.rp ? r.rp : [0, 0, 0];
      return new Vector3(rp[0], rp[1], rp[2]).applyMatrix4(this.world(ni));
    };
    const weighted = (fn) => {
      const acc = new Vector3();
      for (const t of targets) acc.addScaledVector(fn(t), t.w / total);
      return acc;
    };
    const toTranslate = (pWorld) => {
      const p = pWorld.clone().applyMatrix4(pwInv);
      const o = g.type === 'pointConstraint' ? this.vec(id, 'o') : [0, 0, 0];
      const crp = this.vec(id, 'crp'), crt = this.vec(id, 'crt');
      return [p.x + o[0] - crp[0] - crt[0], p.y + o[1] - crp[1] - crt[1], p.z + o[2] - crp[2] - crt[2]];
    };
    const toRotate = (qWorld) => {
      const local = rotationOf(pw).invert().multiply(qWorld);
      return this.localEuler(driven, local).map((v) => v * D2R);
    };
    switch (g.type) {
      case 'pointConstraint':
        return expand('ct', toTranslate(weighted((t) => pivot(t.ni))), XYZ);
      case 'poleVectorConstraint': {
        const target = weighted((t) => pivot(t.ni));
        const start = g.pivot >= 0 ? this.pivotPosition(g.pivot) : new Vector3();
        const v = target.sub(start);
        // 動かされるノード（IK ハンドル）の親の空間へ（スケール・反転を含む 3x3。IK 側の変換と打ち消し合う）
        return expand('ct', v.applyMatrix3(new Matrix3().setFromMatrix4(pwInv)).toArray(), XYZ);
      }
      case 'orientConstraint': {
        const o = this.vec(id, 'o');
        const q = averageQuat(targets.map((t) => ({ q: rotationOf(this.world(t.ni)), w: t.w })));
        return expand('cr', toRotate(q.multiply(radQuat(o))), XYZ);
      }
      case 'parentConstraint': {
        const list = targets.map((t) => {
          const tot = this.vec(id, `tg[${t.index}].tot`), tor = this.vec(id, `tg[${t.index}].tor`);
          const m = this.world(t.ni).clone()
            .multiply(_m.makeTranslation(tot[0], tot[1], tot[2]))
            .multiply(_m.makeRotationFromQuaternion(radQuat(tor, _q)));
          return { m, w: t.w };
        });
        const pos = new Vector3();
        for (const { m, w } of list) pos.addScaledVector(positionOf(m, _v.clone()), w / total);
        const q = averageQuat(list.map(({ m, w }) => ({ q: rotationOf(m), w })));
        return { ...expand('ct', toTranslate(pos), XYZ), ...expand('cr', toRotate(q), XYZ) };
      }
      case 'aimConstraint': {
        // 動かされるノードの回転ピボットから、ターゲットの方へ aim ベクトル（.a）を向け、up ベクトル（.u）を
        // world up（.wut: 0 シーンの上・1 オブジェクト・2 オブジェクトの回転・3 ベクトル・4 なし）の側に向ける
        const rest = this.rest(driven) || {};
        const tt = driven >= 0 ? this.chan(driven, 't').t : [0, 0, 0];
        const add = (a, b) => (b ? [a[0] + b[0], a[1] + b[1], a[2] + b[2]] : a);
        const pd = new Vector3(...add(add(tt, rest.rp), rest.rpt)).applyMatrix4(pw);
        const dir = weighted((t) => pivot(t.ni)).sub(pd);
        if (dir.lengthSq() < EPS) return null;
        dir.normalize();
        const a = new Vector3(...this.vec(id, 'a', [1, 0, 0])).normalize();
        const u = new Vector3(...this.vec(id, 'u', [0, 1, 0]));
        const wut = Math.round(this.num(id, 'wut', 3));
        const wu = new Vector3(...this.vec(id, 'wu', [0, 1, 0]));
        let up = null;
        if (wut === 0) up = (this.clip.raw.upAxis || 'y') === 'z' ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
        else if (wut === 1) up = positionOf(this.mat(id, 'wum')).sub(pd);
        else if (wut === 2) up = wu.clone().applyMatrix4(new Matrix4().extractRotation(this.mat(id, 'wum')));
        else if (wut === 3) up = wu;
        let q;
        const uPerp = u.clone().addScaledVector(a, -u.dot(a));
        const upPerp = up ? up.clone().addScaledVector(dir, -up.dot(dir)) : null;
        if (!up || uPerp.lengthSq() < EPS || upPerp.lengthSq() < EPS) {
          q = new Quaternion().setFromUnitVectors(a, dir);          // up を決めない: 最短の回転
        } else {
          const frame = (x, y) => new Matrix4().makeBasis(x, y, x.clone().cross(y));
          uPerp.normalize(); upPerp.normalize();
          q = new Quaternion().setFromRotationMatrix(frame(dir, upPerp).multiply(frame(a, uPerp).transpose()));
        }
        return expand('cr', toRotate(q.multiply(radQuat(this.vec(id, 'o')))), XYZ);
      }
      case 'scaleConstraint': {
        const s = weighted((t) => { this.world(t.ni).decompose(_v, _q, _s); return _s.clone(); });
        pw.decompose(_v, _q, _s);
        const o = this.vec(id, 'o', [1, 1, 1]);
        return expand('cs', [s.x / (_s.x || 1) * o[0], s.y / (_s.y || 1) * o[1], s.z / (_s.z || 1) * o[2]], XYZ);
      }
      default: return null;
    }
  }

  /**
   * 親の空間での回転（四元数）を、ノードの回転の値（度）にする。
   * joint: 回転部分 = JO · R · RA（three.js の順）、transform: R · RA
   */
  localEuler(ni, localQuat) {
    const rest = this.rest(ni) || { joint: false, ro: 0 };
    let q = localQuat.clone();
    if (rest.joint && rest.jo) q = eulerQuat(rest.jo, 0).invert().multiply(q);
    if (rest.ra) q.multiply(eulerQuat(rest.ra, 0).invert());
    const e = new Euler().setFromQuaternion(q, THREE_ORDER[rest.ro || 0] || 'ZYX');
    return [e.x * R2D, e.y * R2D, e.z * R2D];
  }

  // ------------------------------------------------------------------ IK（回転プレーン・2 ボーン）
  /** IK ハンドル（グラフの id）を解き、開始ジョイントと中間ジョイントの回転（度）を返す */
  solveIK(id) {
    if (this.cache.ik.has(id)) return this.cache.ik.get(id);
    const res = this.guard(`ik ${id}`, () => this.solveIKUncached(id), () => null);
    this.cache.ik.set(id, res);
    return res;
  }

  solveIKUncached(id) {
    const g = this.byId.get(id);
    if (g.ik.solver === 'ikSplineSolver') return this.solveSpline(id);
    if (g.ik.chain.length === 2) return this.solveOneBone(id);
    if (g.ik.chain.length > 3) return this.solveChain(id);
    const [s, mid, end] = g.ik.chain;
    const sc = g.ik.solver === 'ikSCsolver';
    if (!this.rest(s) || !this.rest(mid)) return null;
    const P = this.parentWorld(s);
    const fkS = this.chan(s, 'fk'), fkM = this.chan(mid, 'fk');
    const Ls = composeLocalMatrix(fkS, this.isScaleOf(s), new Matrix4());
    let Lm = composeLocalMatrix(fkM, this.isScaleOf(mid), new Matrix4());
    const tEnd = (this.chan(end, 't') || { t: [0, 0, 0] }).t;
    const Ws = new Matrix4().multiplyMatrices(P, Ls);
    let Wm = new Matrix4().multiplyMatrices(Ws, Lm);
    const A = positionOf(Ws), B = positionOf(Wm);
    let C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Wm);
    const l1 = B.distanceTo(A), l2 = C.distanceTo(B);
    if (l1 < EPS || l2 < EPS) return null;
    // まっすぐなチェーンは曲げる向きが決まらないので、優先角（.pa）で曲げた形を基準にする
    let n0 = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, B));
    const pa = this.dagGraph.get(mid) && this.dagGraph.get(mid).attrs && this.dagGraph.get(mid).attrs.pa;
    if (n0.lengthSq() < EPS * l1 * l2 && Array.isArray(pa)) {
      Lm = composeLocalMatrix({ ...fkM, r: pa }, this.isScaleOf(mid), new Matrix4());
      Wm = new Matrix4().multiplyMatrices(Ws, Lm);
      C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Wm);
      n0 = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, B));
    }
    const hni = g.dag;
    const H = positionOf(this.world(hni));
    const u = new Vector3().subVectors(H, A);
    const d = u.length();
    if (d < EPS) return null;
    u.divideScalar(d);
    // 極ベクトル（ハンドルの親の空間）→ ワールド。ひねり（twist）で u のまわりに回す。
    // シングルチェーン（SC）は極ベクトルを持たないので、FK の形の中間ジョイントの側に曲げる（面を保つ）
    const pvLocal = sc ? [0, 0, 0] : this.vec(id, 'pv', [0, 0, 1]);
    const pv = this.pvWorld(pvLocal, hni, s);
    let v = pv.clone().addScaledVector(u, -pv.dot(u));
    if (v.lengthSq() < EPS) v = new Vector3().subVectors(B, A).addScaledVector(u, -new Vector3().subVectors(B, A).dot(u));
    if (v.lengthSq() < EPS) v = new Vector3(0, 1, 0).cross(u).lengthSq() > EPS ? new Vector3(0, 1, 0).cross(u) : new Vector3(1, 0, 0).cross(u);
    v.normalize();
    if (!sc && this.ikVariant && this.ikVariant.side === -1) v.negate();
    const twist = sc ? 0 : this.num(id, 'twi', 0) * this.twistSign();
    if (Math.abs(twist) > EPS) v.applyQuaternion(new Quaternion().setFromAxisAngle(u, twist));
    // 余弦定理で中間ジョイントの位置
    const dc = Math.min(Math.max(d, Math.abs(l1 - l2)), l1 + l2);
    const cosA = Math.min(1, Math.max(-1, (l1 * l1 + dc * dc - l2 * l2) / (2 * l1 * dc)));
    const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    const B1 = A.clone().addScaledVector(u, l1 * cosA).addScaledVector(v, l1 * sinA);
    const H1 = A.clone().addScaledVector(u, dc);
    // 開始ジョイント: （骨の向き, 面の法線）の組を、FK の形から IK の形へ回す
    const d0 = new Vector3().subVectors(B, A).normalize();
    const d1 = new Vector3().subVectors(B1, A).normalize();
    let n1 = new Vector3().subVectors(B1, A).cross(new Vector3().subVectors(H1, B1));
    if (n1.lengthSq() < EPS) n1 = v.clone().cross(u);
    n1.normalize();
    if (n0.lengthSq() < EPS) n0 = n1.clone(); else n0.normalize();
    const frame = (dd, nn) => new Matrix4().makeBasis(dd, nn, dd.clone().cross(nn));
    const R1 = new Quaternion().setFromRotationMatrix(frame(d1, n1).multiply(frame(d0, n0).transpose()));
    const qs0 = rotationOf(Ws);
    let qs1 = R1.clone().multiply(qs0);
    // 中間ジョイント: 面の法線のまわりに回して、終端をハンドルに向ける
    const a = new Vector3().subVectors(C, B).normalize().applyQuaternion(R1);
    const b = new Vector3().subVectors(H1, B1).normalize();
    const ang = Math.atan2(n1.dot(a.clone().cross(b)), a.dot(b));
    const R2 = new Quaternion().setFromAxisAngle(n1, ang);
    let qm1 = R2.multiply(R1).multiply(rotationOf(Wm));
    if (!sc && this.ikVariant && this.ikVariant.plane === 'axis') {
      // （再現チェックの候補）3 点の面ではなく、開始ジョイントの軸（FK の形で面の法線に一番近い軸＝肘の回転軸）を
      // 基準面の法線にそろえる: チェーン全体を、開始 → ハンドルの軸のまわりに回す（終端はハンドルに残る）
      const axes = [0, 1, 2].map((k) => new Vector3().setFromMatrixColumn(Ws, k).normalize());
      let bi = 0;
      axes.forEach((ax, k) => { if (Math.abs(ax.dot(n0)) > Math.abs(axes[bi].dot(n0))) bi = k; });
      const sgn = Math.sign(axes[bi].dot(n0)) || 1;
      const ax = axes[bi].clone().applyQuaternion(R1);
      const want = n1.clone().multiplyScalar(sgn);
      ax.addScaledVector(u, -ax.dot(u));
      want.addScaledVector(u, -want.dot(u));
      if (ax.lengthSq() > EPS && want.lengthSq() > EPS) {
        const phi = Math.atan2(u.dot(ax.clone().cross(want)), ax.dot(want));
        const Rq = new Quaternion().setFromAxisAngle(u, phi);
        qs1 = Rq.clone().multiply(qs1);
        qm1 = Rq.clone().multiply(qm1);
      }
    }
    // ワールドの回転 → ジョイントの回転の値
    const pq = rotationOf(P);
    let rs = this.localEuler(s, pq.clone().invert().multiply(qs1));
    let rm = this.localEuler(mid, qs1.clone().invert().multiply(qm1));
    const blend = this.num(id, 'ikb', 1);
    if (blend < 1 - EPS) {                                    // IK と FK を混ぜる（ikBlend）
      const mix = (fk, ik, ni) => {
        const ro = THREE_ORDER[(this.rest(ni) || {}).ro || 0];
        const q = eulerQuat(fk, (this.rest(ni) || {}).ro || 0).slerp(eulerQuat(ik, (this.rest(ni) || {}).ro || 0), Math.max(0, blend));
        const e = new Euler().setFromQuaternion(q, ro);
        return [e.x * R2D, e.y * R2D, e.z * R2D];
      };
      rs = mix(fkS.r, rs, s);
      rm = mix(fkM.r, rm, mid);
    }
    return new Map([[s, rs], [mid, rm]]);
  }

  /** 1 ボーン（ikSCsolver）: 開始ジョイントを最短の回転で回して、終端をハンドルの方へ向ける */
  solveOneBone(id) {
    const g = this.byId.get(id);
    const [s, end] = g.ik.chain;
    if (!this.rest(s)) return null;
    const P = this.parentWorld(s);
    const fkS = this.chan(s, 'fk');
    const Ws = new Matrix4().multiplyMatrices(P, composeLocalMatrix(fkS, this.isScaleOf(s), new Matrix4()));
    const tEnd = (this.chan(end, 't') || { t: [0, 0, 0] }).t;
    const A = positionOf(Ws);
    const C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Ws);
    const H = positionOf(this.world(g.dag));
    const from = C.sub(A), to = H.sub(A);
    if (from.lengthSq() < EPS || to.lengthSq() < EPS) return null;
    const R = new Quaternion().setFromUnitVectors(from.normalize(), to.normalize());
    let rs = this.localEuler(s, rotationOf(P).invert().multiply(R.multiply(rotationOf(Ws))));
    const blend = this.num(id, 'ikb', 1);
    if (blend < 1 - EPS) {
      const ro = (this.rest(s) || {}).ro || 0;
      const e = new Euler().setFromQuaternion(eulerQuat(fkS.r, ro).slerp(eulerQuat(rs, ro), Math.max(0, blend)), THREE_ORDER[ro]);
      rs = [e.x * R2D, e.y * R2D, e.z * R2D];
    }
    return new Map([[s, rs]]);
  }

  /** IK のチェーンの FK の形: 親のワールド行列 P、各ジョイントのワールド行列 W と位置（終端は移動の値だけ使う） */
  fkChain(chain) {
    const P = this.parentWorld(chain[0]);
    const W = [];
    let prev = P;
    chain.forEach((ni, i) => {
      const c = i === chain.length - 1 ? this.chan(ni, 't') : this.chan(ni, 'fk');
      prev = new Matrix4().multiplyMatrices(prev, composeLocalMatrix(c, this.isScaleOf(ni), new Matrix4()));
      W.push(prev);
    });
    return { P, W, pos: W.map((m) => positionOf(m)) };
  }

  /** 新しいワールドの回転（開始から終端の手前まで）→ ジョイントの回転の値。ikBlend で FK と混ぜる */
  ikLocals(id, chain, P, Qnew) {
    const blend = this.num(id, 'ikb', 1);
    const out = new Map();
    let parentQ = rotationOf(P);
    Qnew.forEach((q, i) => {
      const ni = chain[i];
      let r = this.localEuler(ni, parentQ.clone().invert().multiply(q));
      if (blend < 1 - EPS) {
        const ro = (this.rest(ni) || {}).ro || 0;
        const e = new Euler().setFromQuaternion(eulerQuat(this.chan(ni, 'fk').r, ro)
          .slerp(eulerQuat(r, ro), Math.max(0, blend)), THREE_ORDER[ro]);
        r = [e.x * R2D, e.y * R2D, e.z * R2D];
      }
      out.set(ni, r);
      parentQ = q;
    });
    return out;
  }

  /** 位置の列 q（開始から終端）に合うよう、FK の形の各ジョイントを順に最小の回転で回す（delta は最初に全体へ掛ける回転） */
  rotateAlong(fk, q, delta, twistOf = null) {
    const { W, pos } = fk;
    const out = [];
    let d = delta.clone();
    for (let i = 0; i < q.length - 1; i++) {
      const qW = rotationOf(W[i]);
      const cur = d.clone().multiply(qW);
      const a = new Vector3().subVectors(pos[i + 1], pos[i]).normalize().applyQuaternion(d);
      const b = new Vector3().subVectors(q[i + 1], q[i]).normalize();
      let qi = new Quaternion().setFromUnitVectors(a, b).multiply(cur);
      const tw = twistOf ? twistOf(i) : 0;
      if (Math.abs(tw) > EPS) qi = new Quaternion().setFromAxisAngle(b, tw).multiply(qi);
      out.push(qi);
      d = qi.clone().multiply(qW.clone().invert());
    }
    return out;
  }

  /** 3 本以上のジョイントの IK（回転プレーン・シングルチェーン）: 面の上で FABRIK を解く */
  solveChain(id) {
    const g = this.byId.get(id);
    const chain = g.ik.chain;
    if (chain.some((ni) => !this.rest(ni))) return null;
    const fk = this.fkChain(chain);
    const { pos } = fk;
    const n = pos.length;
    const lens = [];
    for (let i = 0; i < n - 1; i++) lens.push(pos[i + 1].distanceTo(pos[i]));
    if (lens.some((l) => l < EPS)) return null;
    const total = lens.reduce((s, l) => s + l, 0);
    const A = pos[0];
    const H = positionOf(this.world(g.dag));
    const u = new Vector3().subVectors(H, A);
    const dist = u.length();
    if (dist < EPS) return null;
    u.divideScalar(dist);
    // FK の形の軸（開始 → 終端）と、曲がっている側（途中のジョイントの、軸からのずれの平均）
    const axis0 = new Vector3().subVectors(pos[n - 1], A).normalize();
    const side0 = new Vector3();
    for (let i = 1; i < n - 1; i++) {
      const v = new Vector3().subVectors(pos[i], A);
      side0.add(v.addScaledVector(axis0, -v.dot(axis0)));
    }
    // 目標の面: 回転プレーンは極ベクトルの側、シングルチェーンは FK の形の側
    let v = null;
    if (g.ik.solver === 'ikRPsolver') {
      const pvL = this.vec(id, 'pv', [0, 0, 1]);
      const pv = this.pvWorld(pvL, g.dag, chain[0]);
      v = pv.addScaledVector(u, -pv.dot(u));
      if (this.ikVariant && this.ikVariant.side === -1) v.negate();
    }
    if (!v || v.lengthSq() < EPS) v = side0.clone().addScaledVector(u, -side0.dot(u));
    if (v.lengthSq() < EPS) v = new Vector3(0, 1, 0).cross(u).lengthSq() > EPS ? new Vector3(0, 1, 0).cross(u) : new Vector3(1, 0, 0).cross(u);
    v.normalize();
    if (g.ik.solver === 'ikRPsolver') {
      const twist = this.num(id, 'twi', 0) * this.twistSign();
      if (Math.abs(twist) > EPS) v.applyQuaternion(new Quaternion().setFromAxisAngle(u, twist));
    }
    // FK の形を、軸がハンドルへ、曲がる側が v へ向くように丸ごと回す
    let n0 = side0.lengthSq() > EPS ? side0.clone().normalize().cross(axis0) : null;
    const n1 = v.clone().cross(u).normalize();
    if (!n0 || n0.lengthSq() < EPS) n0 = n1.clone();
    n0.normalize();
    const frame = (dd, nn) => new Matrix4().makeBasis(dd, nn, dd.clone().cross(nn));
    const R1 = new Quaternion().setFromRotationMatrix(frame(u, n1).multiply(frame(axis0, n0).transpose()));
    const q = pos.map((p) => p.clone().sub(A).applyQuaternion(R1).add(A));
    if (dist >= total) {                                     // 届かない: まっすぐ伸ばす
      let s = 0;
      for (let i = 1; i < n; i++) { s += lens[i - 1]; q[i] = A.clone().addScaledVector(u, s); }
    } else {
      for (let it = 0; it < 64; it++) {
        q[n - 1].copy(H);
        for (let i = n - 2; i >= 0; i--) q[i] = q[i + 1].clone().add(q[i].clone().sub(q[i + 1]).normalize().multiplyScalar(lens[i]));
        q[0].copy(A);
        for (let i = 1; i < n; i++) q[i] = q[i - 1].clone().add(q[i].clone().sub(q[i - 1]).normalize().multiplyScalar(lens[i - 1]));
        if (q[n - 1].distanceTo(H) < total * 1e-7) break;
      }
    }
    return this.ikLocals(id, chain, fk.P, this.rotateAlong(fk, q, R1));
  }

  /**
   * スプライン IK: ジョイントをカーブに沿って並べる（骨の長さを保ち、次のジョイントはカーブ上で骨の長さだけ離れた点）。
   * rootOnCurve なら開始ジョイントをカーブの始点（+ オフセット）に置く。
   * 向きは最小の回転 + ひねり（roll は全体、twist は終端に向けて配分）。上級ツイスト（dtce）なら world up に合わせる
   */
  solveSpline(id) {
    const g = this.byId.get(id);
    const chain = g.ik.chain;
    if (chain.some((ni) => !this.rest(ni))) return null;
    const curve = this.plug(id, 'ic');
    if (!curve || !curve.isCurve) return null;
    const fk = this.fkChain(chain);
    const { pos } = fk;
    const n = pos.length;
    const lens = [];
    for (let i = 0; i < n - 1; i++) lens.push(pos[i + 1].distanceTo(pos[i]));
    const poly = polyline(curve);
    const roc = this.num(id, 'roc', 0) >= 0.5;
    let start, seg = 0;
    if (roc) {
      const s = Math.min(Math.max(this.num(id, 'off', 0), 0), 1) * poly.total;
      start = pointAtLength(poly, s);
      while (seg < poly.len.length - 2 && poly.len[seg + 1] < s) seg++;
    } else {
      start = pos[0].clone();
      let best = Infinity;
      poly.pts.forEach((p, k) => { const d = p.distanceToSquared(start); if (d < best) { best = d; seg = Math.max(0, k - 1); } });
    }
    const q = [start];
    const endDir = new Vector3().subVectors(poly.pts[poly.pts.length - 1], poly.pts[poly.pts.length - 2]).normalize();
    for (let i = 0; i < n - 1; i++) {
      const r = pointAtDistance(poly, q[i], lens[i], seg);
      if (r) { q.push(r.point); seg = r.seg; } else q.push(q[i].clone().addScaledVector(endDir, lens[i]));
    }
    const bones = n - 1;
    let Qnew;
    if (this.num(id, 'dtce', 0) >= 0.5 && Math.round(this.num(id, 'dwut', 0)) !== 7) {
      Qnew = this.splineAdvancedTwist(id, fk, q, bones);
    } else {
      const twist = this.num(id, 'twi', 0), roll = this.num(id, 'rol', 0);
      Qnew = this.rotateAlong(fk, q, new Quaternion(), (i) => (i === 0 ? roll : 0) + (bones > 1 ? (i === 0 ? 0 : twist / (bones - 1)) : twist));
    }
    const out = this.ikLocals(id, chain, fk.P, Qnew);
    if (roc) {
      const t = start.clone().applyMatrix4(fk.P.clone().invert());
      out.set(chain[0], { r: out.get(chain[0]), t: t.toArray() });
    }
    return out;
  }

  /**
   * 上級ツイスト: 骨の向きに forward 軸（.dfa）を、world up に up 軸（.dwua）を向ける。
   * 始点・終点の 2 つを使う種類（.dwut 2・4・6）は、始点と終点の up のなす角（ひねり）をチェーンに沿って均等に配る
   * （up のベクトルを直線で補間すると、向きの差が大きいときに途中で潰れて反転するため）。
   * up 軸の Closest は、＋と−のうち world up に近い方を使う（最小の回転で並べたときの向きで決める）
   */
  splineAdvancedTwist(id, fk, q, bones) {
    const AXES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const UP = [[0, 1, 0], [0, -1, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1], [0, 0, 1], [1, 0, 0], [-1, 0, 0], [1, 0, 0]];
    const upAxis = Math.round(this.num(id, 'dwua', 0));
    const closest = upAxis === 2 || upAxis === 5 || upAxis === 8;
    const fa = new Vector3(...(AXES[Math.round(this.num(id, 'dfa', 0))] || AXES[0]));
    const ua = new Vector3(...(UP[upAxis] || UP[0]));
    const type = Math.round(this.num(id, 'dwut', 0));
    const vecIn = (attr, mat) => {
      const v = new Vector3(...this.vec(id, attr, [0, 1, 0]));
      return mat ? v.applyMatrix4(new Matrix4().extractRotation(this.mat(id, mat))) : v;
    };
    const objPos = (mat) => positionOf(this.mat(id, mat));
    const sceneUp = (this.clip.raw.upAxis || 'y') === 'z' ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
    const dirs = [];
    for (let i = 0; i < bones; i++) dirs.push(new Vector3().subVectors(q[i + 1], q[i]).normalize());
    // ジョイントごとの world up（始点・終点を使う種類は両端だけ）
    const upOf = (i, start) => {
      const p = q[i];
      switch (type) {
        case 1: return objPos('dwum').sub(p);
        case 2: return objPos(start ? 'dwum' : 'dwue').sub(p);
        case 3: return vecIn('dwuv', 'dwum');
        case 4: return start ? vecIn('dwuv', 'dwum') : vecIn('dwve', 'dwue');
        case 5: return vecIn('dwuv');
        case 6: return vecIn(start ? 'dwuv' : 'dwve');
        default: return sceneUp.clone();
      }
    };
    const perp = (v, dir) => {
      v.addScaledVector(dir, -v.dot(dir));
      return v.lengthSq() < EPS ? null : v.normalize();
    };
    const ups = new Array(bones).fill(null);
    if ((type === 2 || type === 4 || type === 6) && bones > 1 && this.ikVariant && this.ikVariant.splineInterp === 'lerp') {
      // （再現チェックの候補）始点と終点の up のベクトルを直線で補間する
      const a = upOf(0, true), b = upOf(bones - 1, false);
      for (let i = 0; i < bones; i++) ups[i] = perp(a.clone().lerp(b, i / (bones - 1)), dirs[i]);
    } else if ((type === 2 || type === 4 || type === 6) && bones > 1) {
      // 始点の up を骨に沿って最小の回転で運び、終点の up とのずれの角度を、始点からの長さに比例して配る
      const u0 = perp(upOf(0, true), dirs[0]);
      const u1 = perp(upOf(bones - 1, false), dirs[bones - 1]);
      if (u0) {
        const carried = [u0.clone()];
        for (let i = 1; i < bones; i++) {
          carried.push(perp(carried[i - 1].clone().applyQuaternion(new Quaternion().setFromUnitVectors(dirs[i - 1], dirs[i])), dirs[i])
            || carried[i - 1].clone());
        }
        const last = carried[bones - 1];
        const total = u1 ? Math.atan2(dirs[bones - 1].dot(last.clone().cross(u1)), last.dot(u1)) : 0;
        const along = [0];
        for (let i = 1; i < bones; i++) along.push(along[i - 1] + q[i].distanceTo(q[i - 1]));
        const span = along[bones - 1] || 1;
        for (let i = 0; i < bones; i++) {
          ups[i] = carried[i].clone().applyQuaternion(new Quaternion().setFromAxisAngle(dirs[i], total * along[i] / span));
        }
      }
    } else {
      for (let i = 0; i < bones; i++) ups[i] = perp(upOf(i, true), dirs[i]);
    }
    const frame = (x, y) => new Matrix4().makeBasis(x, y, x.clone().cross(y));
    const faN = fa.clone().normalize();
    const uaP = ua.clone().addScaledVector(faN, -ua.dot(faN)).normalize();
    const flipped = uaP.clone().negate();
    const minimal = closest ? this.rotateAlong(fk, q, new Quaternion()) : null;
    const out = [];
    for (let i = 0; i < bones; i++) {
      const dir = dirs[i];
      const up = ups[i];
      if (!up) { out.push(new Quaternion().setFromUnitVectors(faN, dir)); continue; }
      // Closest: 最小の回転で並べたときの up 軸が world up と逆向きなら、− の軸を world up に向ける
      const axis = closest && uaP.clone().applyQuaternion(minimal[i]).dot(up) < 0 ? flipped : uaP;
      out.push(new Quaternion().setFromRotationMatrix(frame(dir, up).multiply(frame(faN, axis).transpose())));
    }
    return out;
  }

  /** 極ベクトルを解釈する空間（ふだんはハンドルの親。再現チェックでは候補を切り替える） */
  pvSpace(handleNi, startNi) {
    const sp = this.ikVariant ? this.ikVariant.pvSpace : null;
    if (sp === 'world') return IDENTITY;
    if (sp === 'start') return this.parentWorld(startNi);
    return this.parentWorld(handleNi);
  }

  /** 極ベクトル（ハンドルの親の空間の値）→ ワールド（スケール・反転を含む 3x3。poleVectorConstraint の変換と打ち消し合う） */
  pvWorld(pvLocal, handleNi, startNi) {
    return new Vector3(pvLocal[0], pvLocal[1], pvLocal[2]).applyMatrix3(new Matrix3().setFromMatrix4(this.pvSpace(handleNi, startNi)));
  }

  /** ひねりの向き（ふだんは 1。再現チェックでは −1・0 も試す） */
  twistSign() {
    const t = this.ikVariant ? this.ikVariant.twistSign : undefined;
    return typeof t === 'number' ? t : 1;
  }

  /**
   * ファイルに書かれた値で組み立てたローカル行列（保存したときの Maya の答え。再現チェックに使う）。
   * 移動・スケールが接続で決まる（ファイルに値がない）ときは評価した値を使う。回転が接続で決まるときは比べられないので null
   */
  fileRestLocal(ni) {
    const rest = this.rest(ni);
    if (!rest) return null;
    const g = this.dagGraph.get(ni);
    const keys = g && g.inputs ? Object.keys(g.inputs) : [];
    if (keys.some((k) => /^r[xyz]?$/.test(k))) return null;
    // キー（アニメーションカーブ）で決まる成分もファイルに値がないので、評価した値を使う（カーブの評価は確か）
    const e = this.clip.byNode.get(ni);
    const curve = new Set((e ? e.channels : []).map((c) => c.base));
    const c = { ...rest };
    if (curve.has('r')) c.r = this.chan(ni, 'fk').r;
    if (curve.has('t') || keys.some((k) => /^t[xyz]?$/.test(k))) c.t = this.chan(ni, 't').t;
    if (curve.has('s') || keys.some((k) => /^s[xyz]?$/.test(k))) c.s = this.chan(ni).s;
    if (keys.includes('opm')) c.opm = this.chan(ni).opm;           // 接続で決まる offsetParentMatrix
    return composeLocalMatrix(c, this.isScaleOf(ni), new Matrix4());
  }

  /** IK のチェーンの、評価した回転とファイルの回転の比較（verifySaved の 1 ハンドル分） */
  compareChain(g, fileLocal, tol) {
    const chain = g.ik.chain;
    const joints = [];
    let parentFile = this.parentWorld(chain[0]);
    let endFile = null;
    const filePos = [];
    const fileW = [];
    for (let k = 0; k < chain.length; k++) {
      const ni = chain[k];
      const file = fileLocal(ni);
      if (!file) break;
      const Wf = parentFile.clone().multiply(file);
      filePos.push(positionOf(Wf));
      fileW.push(Wf);
      if (k === chain.length - 1) { endFile = Wf; break; }
      const We = this.world(ni);
      const qf = rotationOf(Wf), qe = rotationOf(We);
      const d = qe.clone().multiply(qf.clone().invert());                      // ファイル → 評価 の回転
      if (d.w < 0) { d.x = -d.x; d.y = -d.y; d.z = -d.z; d.w = -d.w; }
      const angle = 2 * Math.acos(Math.min(1, d.w)) * R2D;
      // 骨の向き（次のジョイントへ）のまわりの成分（ねじれ）と、それ以外（曲がり）に分ける
      const nextLocal = fileLocal(chain[k + 1]);
      const bone = nextLocal ? new Vector3().setFromMatrixPosition(nextLocal).applyQuaternion(qf).normalize() : null;
      let roll = 0, bend = angle;
      if (bone && bone.lengthSq() > EPS) {
        const proj = bone.clone().multiplyScalar(new Vector3(d.x, d.y, d.z).dot(bone));
        const twist = new Quaternion(proj.x, proj.y, proj.z, d.w).normalize();
        roll = 2 * Math.atan2(new Vector3(twist.x, twist.y, twist.z).dot(bone), twist.w) * R2D;
        if (roll > 180) roll -= 360;
        if (roll < -180) roll += 360;
        const swing = d.clone().multiply(twist.clone().invert());
        bend = 2 * Math.acos(Math.min(1, Math.abs(swing.w))) * R2D;
      }
      const position = positionOf(Wf).distanceTo(positionOf(We));
      joints.push({ node: ni, name: this.sceneNodes[ni].name, angle, roll, bend, position, ok: angle <= tol });
      parentFile = Wf;
    }
    // ファイルの値の終端と、評価したハンドルの位置の距離（大きければ、ハンドルを動かすリグの側の問題）
    const H = positionOf(this.world(g.dag));
    const reach = endFile ? positionOf(endFile).distanceTo(H) : null;
    // 回転プレーン: ファイルの姿勢の「曲がる向き」（Maya が使った極ベクトル＋ひねり）と、こちらの極ベクトル＋ひねりの差。
    // 大きければ、極ベクトル・ひねりの入力（それを決めるノードの評価）が Maya と違う
    let poleError = null;
    if (g.ik.solver === 'ikRPsolver' && filePos.length === chain.length && chain.length >= 3) {
      const A = filePos[0];
      const u = H.clone().sub(A).normalize();
      const side = new Vector3();
      for (let k = 1; k < filePos.length - 1; k++) {
        const v = filePos[k].clone().sub(A);
        side.add(v.addScaledVector(u, -v.dot(u)));
      }
      const pvL = this.vec(g.id, 'pv', [0, 0, 1]);
      const pv = this.pvWorld(pvL, g.dag, chain[0]);
      const want = pv.addScaledVector(u, -pv.dot(u));
      if (this.ikVariant && this.ikVariant.side === -1) want.negate();
      const tw = this.num(g.id, 'twi', 0) * this.twistSign();
      if (Math.abs(tw) > EPS) want.applyQuaternion(new Quaternion().setFromAxisAngle(u, tw));
      if (side.lengthSq() > EPS && want.lengthSq() > EPS) {
        side.normalize(); want.normalize();
        poleError = Math.atan2(u.dot(want.clone().cross(side)), want.dot(side)) * R2D;   // want → side の角度（u まわり）
      }
    }
    // 詳細（ずれの原因を調べるための生の数値。ワールド空間）
    const r3 = (v) => v.toArray().map((x) => Math.round(x * 1e4) / 1e4);
    const evalPos = chain.map((ni) => positionOf(this.world(ni)));
    const lens = (P) => P.slice(1).map((p, k) => Math.round(p.distanceTo(P[k]) * 1e4) / 1e4);
    const detail = {
      fileJoints: filePos.map(r3), evalJoints: evalPos.map(r3), handle: r3(H),
      fileLengths: lens(filePos), evalLengths: lens(evalPos),
      pv: g.ik.solver === 'ikRPsolver'
        ? r3(this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, chain[0]))
        : null,
      twist: Math.round(this.num(g.id, 'twi', 0) * R2D * 1e4) / 1e4,
      ikBlend: this.num(g.id, 'ikb', 1),
    };
    // ジョイントの軸と基準面（開始 → ハンドル と 極ベクトル＋ひねり の面）の法線のなす角（度）。
    // Maya の答え（ファイル）でどれかの軸が 0° / 180° なら、Maya はその軸を基準面の法線にそろえている
    if (g.ik.solver === 'ikRPsolver' && filePos.length) {
      const u = H.clone().sub(filePos[0]).normalize();
      const v = this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, chain[0]);
      v.addScaledVector(u, -v.dot(u));
      const tw = this.num(g.id, 'twi', 0) * this.twistSign();
      if (Math.abs(tw) > EPS) v.applyQuaternion(new Quaternion().setFromAxisAngle(u, tw));
      const nRef = u.clone().cross(v).normalize();
      const nFile = filePos.length >= 3 ? filePos[1].clone().sub(filePos[0]).cross(filePos[2].clone().sub(filePos[1])).normalize() : null;
      const axesTo = (W, n) => [0, 1, 2].map((a) => {
        const ax = new Vector3().setFromMatrixColumn(W, a).normalize();
        return Math.round(Math.acos(Math.max(-1, Math.min(1, ax.dot(n)))) * R2D * 100) / 100;
      });
      detail.axes = chain.slice(0, -1).map((ni, k) => {
        const rest = this.rest(ni) || {};
        const dg = this.dagGraph.get(ni);
        const pa = dg && dg.attrs && Array.isArray(dg.attrs.pa) ? dg.attrs.pa : null;
        const round = (a) => (Array.isArray(a) ? a.map((x) => Math.round(x * 1e3) / 1e3) : null);
        return {
          name: this.sceneNodes[ni].name,
          fileToRef: fileW[k] ? axesTo(fileW[k], nRef) : null,
          evalToRef: axesTo(this.world(ni), nRef),
          fileToChain: fileW[k] && nFile ? axesTo(fileW[k], nFile) : null,
          r: round(rest.r), jo: round(rest.jo), ra: round(rest.ra), pa: round(pa), ro: rest.ro ?? 0,
        };
      });
    }
    return { joints, reach, poleError, detail, error: joints.reduce((m, j) => Math.max(m, j.angle), 0) };
  }

  /**
   * 保存時のフレームの再現チェック: IK で回転が決まるジョイントについて、評価した回転とファイルに保存された回転
   * （保存したときに Maya が IK を解いた結果）を比べる。evaluate(clip.current) のあとに呼ぶ。
   * ずれがあれば、解き方の候補（ひねりの向き・極ベクトルの空間・肘の側・スプライン IK のひねりの配り方）を
   * 総当たりで試して、ファイルの値に一番合うものを best に入れる。
   * 戻り値: IK ハンドルごとに { handle, solver, chain, pv（ワールド）, twist（度）, joints, reach, error, best, ok }
   */
  /**
   * 開始ジョイントの親が、ファイルの値（保存時の Maya の答え）からどれだけずれているか。
   * ルートから親までを順に、評価したローカル行列とファイルのローカル行列を比べ、最初にずれるノードも探す
   * （値が接続で決まり、ファイルに値がないノードは比べられないので飛ばす）
   */
  parentDrift(ni, fileLocal, tol, includeSelf = false) {
    const chain = includeSelf ? [ni] : [];
    for (let x = this.sceneNodes[ni].parent; x >= 0; x = this.sceneNodes[x].inheritsTransform !== false ? this.sceneNodes[x].parent : -1) chain.unshift(x);
    if (!chain.length) return null;
    let Wf = new Matrix4();
    let firstBad = null;
    for (const x of chain) {
      const evalLocal = this.localFile(x);
      let file = this.rest(x) ? fileLocal(x) : this.staticLocal(x);
      if (!file) file = evalLocal;                                   // 比べられない（回転が接続で決まる）
      Wf = Wf.clone().multiply(file);
      if (!firstBad) {
        const d = rotationOf(evalLocal).clone().multiply(rotationOf(file).clone().invert());
        const ang = 2 * Math.acos(Math.min(1, Math.abs(d.w))) * R2D;
        const pos = positionOf(evalLocal).distanceTo(positionOf(file));
        if (ang > tol || pos > 1e-3) {
          const ik = this.ikJoint.has(x) ? this.byId.get(this.ikJoint.get(x)).name : null;
          firstBad = { name: this.sceneNodes[x].name, angle: ang, position: pos, ik };
        }
      }
    }
    const We = this.world(chain[chain.length - 1]);
    const d = rotationOf(We).clone().multiply(rotationOf(Wf).clone().invert());
    return { name: this.sceneNodes[chain[chain.length - 1]].name, angle: 2 * Math.acos(Math.min(1, Math.abs(d.w))) * R2D,
      position: positionOf(We).distanceTo(positionOf(Wf)), firstBad };
  }

  /**
   * 極ベクトルを決める poleVectorConstraint のターゲットごとの、ウェイト・計算した位置・ファイルの値とのずれ
   * （そのノード自身と親を、ルートから順に比べて最初にずれるノード）。極ベクトルが接続で決まらなければ null
   */
  poleTargets(g, fileLocal, tol) {
    const inputs = g.inputs || {};
    const src = inputs.pv || inputs.pvx || inputs.pvy || inputs.pvz;
    const cg = src && src.node !== undefined ? this.byId.get(src.node) : null;
    if (!cg) return null;
    if (cg.type !== 'poleVectorConstraint') return { via: `${cg.name}（${cg.type}）`, targets: [] };
    const start = cg.pivot >= 0 ? this.pivotPosition(cg.pivot) : null;
    const offset = this.vec(cg.id, 'o', [0, 0, 0]);
    const targets = (cg.targets || []).map((t) => {
      const tg = this.byId.get(t.node);
      if (!tg || tg.dag < 0) return null;
      const ni = tg.dag;
      const r = this.rest(ni);
      const rp = r && r.rp ? r.rp : [0, 0, 0];
      const pos = new Vector3(rp[0], rp[1], rp[2]).applyMatrix4(this.world(ni));
      return { name: this.sceneNodes[ni].name, weight: this.num(cg.id, `tg[${t.index}].tw`, 1),
        position: pos.toArray().map((x) => Math.round(x * 1e4) / 1e4),
        drift: this.parentDrift(ni, fileLocal, tol, true) };
    }).filter(Boolean);
    return { via: cg.name, start: start ? start.toArray().map((x) => Math.round(x * 1e4) / 1e4) : null,
      offset: offset.some((x) => Math.abs(x) > 1e-9) ? offset : null, targets };
  }

  verifySaved(fileLocal, tol = 0.5) {
    const out = [];
    for (const g of this.graph) {
      if (!g.ik) continue;
      const base = this.compareChain(g, fileLocal, tol);
      const parent = this.parentDrift(g.ik.chain[0], fileLocal, tol);
      const poleTargets = g.ik.solver === 'ikRPsolver' ? this.poleTargets(g, fileLocal, tol) : null;
      let best = null;
      if (base.error > tol && base.joints.length) {
        for (const v of IK_VARIANTS[g.ik.solver] || []) {
          this.ikVariant = v;
          this.reset();
          const r = this.compareChain(g, fileLocal, tol);
          if (!best || r.error < best.error - 1e-6) best = { variant: v, label: variantLabel(v), error: r.error };
        }
        this.ikVariant = null;
        this.reset();
      }
      const pv = g.ik.solver === 'ikRPsolver'
        ? this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, g.ik.chain[0]).toArray()
        : null;
      out.push({ handle: g.name, solver: g.ik.solver, chain: g.ik.chain.map((ni) => this.sceneNodes[ni].name), pv,
        twist: this.num(g.id, 'twi', 0) * R2D, joints: base.joints, reach: base.reach, poleError: base.poleError, parent,
        detail: base.detail, poleTargets,
        error: base.error, best,
        ok: base.joints.every((j) => j.ok) });
    }
    return out;
  }

  isScaleOf(ni) {
    const rest = this.rest(ni);
    if (!rest || !rest.joint) return null;
    if ((rest.isNode ?? -1) >= 0 && this.rest(rest.isNode)) return this.chan(rest.isNode, 'fk').s;
    return rest.isScale || null;
  }

  // ------------------------------------------------------------------ 表示用
  /** ノードを動かしているもの（選択ノードの情報に出す） */
  driversOf(ni) {
    const fb = this.fallback.get(ni);
    if (fb) {
      // 推定したノードは接続を使っていないので、推定のことだけを示す
      const base = fb.anchor >= 0 ? this.sceneNodes[fb.anchor].name : 'ワールド';
      return [`推定: ${(fb.unresolved || []).join('・') || '親の位置'} を求められないため、${base} からの相対をバインドポーズの形で表示`];
    }
    const out = this.tainted.has(ni) ? ['不明: 未対応のノードの影響で値を求められません（ファイルの値・既定値のまま）'] : [];
    const g = this.dagGraph.get(ni);
    if (g && g.inputs) {
      for (const [key, src] of Object.entries(g.inputs)) {
        if (!CHANNEL_RE.test(key) || src.curve !== undefined) continue;
        const sg = this.byId.get(src.node);
        if (sg) out.push(`${key} ← ${sg.name}（${sg.type}）`);
      }
    }
    if (this.ikJoint.has(ni)) {
      const h = this.byId.get(this.ikJoint.get(ni));
      out.push(`r ← ${h.name}（IK）`);
    }
    return out;
  }
}

/** 3 つ組の値を、まとめた名前（o）と成分の名前（ox など）の両方で引けるようにする */
function expand(base, values, suffixes) {
  const o = { [base]: values };
  suffixes.forEach((s, i) => { o[base + s] = values[i]; });
  return o;
}
