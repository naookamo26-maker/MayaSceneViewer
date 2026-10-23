// リグ（コンストレイント・IK・計算ノード）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（rig.py）が出力した animation.graph を、プラグ（ノードの属性）単位で必要になったときに計算する。
//   * 値の単位は Maya の内部単位にそろえる（角度はラジアン）。DAG ノードの回転を読み書きするときだけ度に直す
//   * ワールド行列は「ファイルの値（カーブ・リグの結果）· ポーズ確認の追加分」で計算する（表示がバインドポーズでも同じ）
//     → ポーズ確認でコントローラーを動かすと、コンストレイントや IK が追従する
//   * 1 回の評価（evaluate）の中では、同じプラグ・行列を一度だけ計算する
//   * 循環（自分の結果を自分で使う）に当たったら、そこはファイルの値で打ち切る
// 完全な再現は目指さず、Maya と同じ考え方の近似にする（docs/data_format.md「animation.graph」）。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { composeLocalMatrix, evaluateCurve } from './animation.js';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const EPS = 1e-9;
const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const THREE_ORDER = ROTATE_ORDERS.map((o) => o.split('').reverse().join('').toUpperCase());
const XYZ = ['x', 'y', 'z'];
const RGB = ['r', 'g', 'b'];
const XY = ['x', 'y'];
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
  ikHandle: { pv: [0, 1, 0], twi: 0, ikb: 1 },
  scaleConstraint: { o: [1, 1, 1] },
};

// 型ごとの出力の属性（これ以外の名前で計算結果を探さない。入力を読むときに自分の計算へ戻らないため）
const OUTPUTS = {
  unitConversion: /^o$/, multiplyDivide: /^o[xyz]?$/, plusMinusAverage: /^o(1|2[xy]?|3[xyz]?)$/,
  reverse: /^o[xyz]?$/, condition: /^oc[rgb]?$/, blendColors: /^op[rgb]?$/, pairBlend: /^o[tr][xyz]?$/,
  pointConstraint: /^ct[xyz]?$/, poleVectorConstraint: /^ct[xyz]?$/, orientConstraint: /^cr[xyz]?$/,
  parentConstraint: /^c[tr][xyz]?$/, scaleConstraint: /^cs[xyz]?$/,
};

/** ファイルの値が度で書かれている角度の属性（内部ではラジアンで扱う） */
function isAngleAttr(type, attr) {
  switch (type) {
    case 'pairBlend': return /^ir[12][xyz]?$/.test(attr);
    case 'orientConstraint': return /^o[xyz]?$/.test(attr);
    case 'parentConstraint': return /^tg\[\d+\]\.tor[xyz]?$/.test(attr);
    case 'ikHandle': return attr === 'twi';
    default: return false;
  }
}

/** 3 つ組の属性の成分の名前（c1 → c1r など） */
function suffixesOf(type, base) {
  if ((type === 'blendColors' && (base === 'c1' || base === 'c2' || base === 'op'))
    || (type === 'condition' && (base === 'ct' || base === 'cf' || base === 'oc'))) return RGB;
  if (type === 'plusMinusAverage' && /^(o2|i2\[\d+\])$/.test(base)) return XY;
  return XYZ;
}

const _v = new Vector3();
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
      const [s, m] = g.ik.chain;
      this.ikJoint.set(s, g.id);
      this.ikJoint.set(m, g.id);
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
      const keys = g && g.inputs ? Object.keys(g.inputs).filter((k) => /^[trs][xyz]?$/.test(k)) : [];
      if (e.channels.length || this.ikJoint.has(e.node) || keys.length) this.moving.add(e.node);
      if (e.channels.some((c) => c.base === 's') || keys.some((k) => k[0] === 's')) scaled.add(e.node);
    }
    for (const e of clip.entries) {
      if ((e.rest.isNode ?? -1) >= 0 && scaled.has(e.rest.isNode)) this.moving.add(e.node);
    }
    this.matrices = new Map();               // evaluate() の結果（動くノードだけ）
    this.problems = new Set();               // 評価中に見つかった問題（循環など）
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
      if (mode === 'full' && this.ikJoint.has(ni)) {
        const sol = this.solveIK(this.ikJoint.get(ni));
        if (sol && sol.has(ni)) out.r = sol.get(ni);
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
      return outs && attr in outs ? outs[attr] : undefined;
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

  num(id, attr, def = 0) {
    const v = this.plug(id, attr);
    return typeof v === 'number' && Number.isFinite(v) ? v : def;
  }

  vec(id, base, def = [0, 0, 0]) {
    const v = this.plug(id, base);
    if (Array.isArray(v)) return v.map((x, i) => (Number.isFinite(x) ? x : def[i]));
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
      case 'scaleConstraint': case 'poleVectorConstraint':
        o = this.constraint(g);
        break;
      default: break;
    }
    return o;
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
    const t1 = this.vec(id, 'it1'), t2 = this.vec(id, 'it2');
    const r1 = this.vec(id, 'ir1'), r2 = this.vec(id, 'ir2');
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
        const rot = new Matrix4().extractRotation(pwInv);
        return expand('ct', v.applyMatrix4(rot).toArray(), XYZ);
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
    const [s, mid, end] = g.ik.chain;
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
    // 極ベクトル（ハンドルの親の空間）→ ワールド。ひねり（twist）で u のまわりに回す
    const pvLocal = this.vec(id, 'pv', [0, 1, 0]);
    const pvRot = new Matrix4().extractRotation(this.parentWorld(hni));
    const pv = new Vector3(pvLocal[0], pvLocal[1], pvLocal[2]).applyMatrix4(pvRot);
    let v = pv.clone().addScaledVector(u, -pv.dot(u));
    if (v.lengthSq() < EPS) v = new Vector3().subVectors(B, A).addScaledVector(u, -new Vector3().subVectors(B, A).dot(u));
    if (v.lengthSq() < EPS) v = new Vector3(0, 1, 0).cross(u).lengthSq() > EPS ? new Vector3(0, 1, 0).cross(u) : new Vector3(1, 0, 0).cross(u);
    v.normalize();
    const twist = this.num(id, 'twi', 0);
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
    const qs1 = R1.clone().multiply(qs0);
    // 中間ジョイント: 面の法線のまわりに回して、終端をハンドルに向ける
    const a = new Vector3().subVectors(C, B).normalize().applyQuaternion(R1);
    const b = new Vector3().subVectors(H1, B1).normalize();
    const ang = Math.atan2(n1.dot(a.clone().cross(b)), a.dot(b));
    const R2 = new Quaternion().setFromAxisAngle(n1, ang);
    const qm1 = R2.multiply(R1).multiply(rotationOf(Wm));
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

  isScaleOf(ni) {
    const rest = this.rest(ni);
    if (!rest || !rest.joint) return null;
    if ((rest.isNode ?? -1) >= 0 && this.rest(rest.isNode)) return this.chan(rest.isNode, 'fk').s;
    return rest.isScale || null;
  }

  // ------------------------------------------------------------------ 表示用
  /** ノードを動かしているもの（選択ノードの情報に出す） */
  driversOf(ni) {
    const out = [];
    const g = this.dagGraph.get(ni);
    if (g && g.inputs) {
      for (const [key, src] of Object.entries(g.inputs)) {
        if (!/^[trs][xyz]?$/.test(key) || src.curve !== undefined) continue;
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
