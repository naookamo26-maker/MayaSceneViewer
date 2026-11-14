// リグ（コンストレイント・IK・計算ノード）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（rig.py）が出力した animation.graph を、プラグ（ノードの属性）単位で必要になったときに計算する。
//   * 値の単位は Maya の内部単位にそろえる（角度はラジアン）。DAG ノードの回転を読み書きするときだけ度に直す
//   * ワールド行列は「ファイルの値（カーブ・リグの結果）· ポーズ確認の追加分」で計算する（表示がバインドポーズでも同じ）
//     → ポーズ確認でコントローラーを動かすと、コンストレイントや IK が追従する
//   * 1 回の評価（evaluate）の中では、同じプラグ・行列を一度だけ計算する
//   * 循環（自分の結果を自分で使う）に当たったら、そこはファイルの値で打ち切る
//   * 依存の追跡: 覚えた値ごとに、計算中に読んだ「外から変わる入力」（いまはポーズ確認の追加分のノード）を deps に記録し、
//     読んだ値の deps も引き継ぐ（memo・poseAt）。入力を変えたら、それを読んだ値・動くノードだけを作り直す
//     （keep の dropKeep、再生キャッシュの seed）。ビューアで編集（キー・属性の値の変更など）を扱うときも、変えるものを
//     読む所で同じように依存を記録すれば（例: カーブの番号・プラグを入力の印にする）、影響する部分だけを作り直せる
// 完全な再現は目指さず、Maya と同じ考え方の近似にする（docs/data_format.md「animation.graph」）。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { composeLocalMatrix, decomposeMaya } from './animation.js';

import { compileNodeDef } from './nodeDef.js';
import { arcLength, rebuildCurve, reverseCurve } from './curve.js';
import { MATH_DEFAULTS, mathAngleInput, mathKind, mathOutputs } from './mathNodes.js';
import NODE_TYPES from '../../ma_viewer/node_types.json' with { type: 'json' };

import { ConstraintMethods, installMethods } from './rigConstraints.js';
import { IkMethods } from './rigIk.js';
import { MathMethods } from './rigMath.js';
import { PlaybackMethods } from './rigPlayback.js';
import { DagMethods } from './rigDag.js';
import { PlugMethods } from './rigPlug.js';
import { NodeDefMethods } from './rigNodeDef.js';
import { DisplayMethods } from './rigDisplay.js';
import { newDeepState, stackNames } from './deepEval.js';

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

// 型ごとの既定値（ファイルに値がないとき）・出力の属性・角度の属性は、ma_viewer/node_types.json の types（Python と共通の
// 型の登録。整備計画の D5）。ikHandle の極ベクトルの既定値は Z 軸、lookAt の aim は −Z、前向きの軸は .dpa（古いサンプルの
// .dfa も読むので dpa は既定値を持たせない）、animLayer の .w・.m（古い名前）も既定値を持たせない、などは JSON の値のまま
const DEFAULTS = Object.fromEntries(Object.entries(NODE_TYPES.types).filter(([, e]) => e.defaults).map(([t, e]) => [t, e.defaults]));

// 型ごとの出力の属性（これ以外の名前で計算結果を探さない。入力を読むときに自分の計算へ戻らないため）
const OUTPUTS = Object.fromEntries(Object.entries(NODE_TYPES.types).filter(([, e]) => e.outputs)
  .map(([t, e]) => [t, new RegExp(e.outputs)]));
// ファイルの値が度で書かれている角度の属性（内部ではラジアンで扱う）
const ANGLE_ATTRS = Object.fromEntries(Object.entries(NODE_TYPES.types).filter(([, e]) => e.angles)
  .map(([t, e]) => [t, new RegExp(e.angles)]));
// DAG ノードの、値が決まると行列が変わる属性
// ローカル行列を決める属性（移動・回転・スケール・ピボット・rotateAxis・jointOrient・せん断・回転順）。CHANNEL_RE は opm も
const CHANNEL_ATTR_RE = /^((t|r|s|jo|ra|rp|sp|rpt|spt)[xyz]?|sh|shxy|shxz|shyz|ro)$/;
const CHANNEL_RE = /^((t|r|s|jo|ra|rp|sp|rpt|spt)[xyz]?|sh|shxy|shxz|shyz|ro|opm)$/;
const VEC_KEYS = ['t', 'r', 's', 'jo', 'ra', 'rp', 'sp', 'rpt', 'spt', 'sh'];   // ローカル行列の 3 つ組の属性
const ANGLE_KEYS = new Set(['r', 'jo', 'ra']);                                 // 接続の値はラジアン、チャンネルは度
const SHEAR_AXIS = { shxy: 0, shxz: 1, shyz: 2 };
/** ローカル行列の属性の種類と成分（tx → ['t', 0]・rp → ['rp', -1]・shxz → ['sh', 1]・ro → ['ro', -1]） */
function xformKey(key) {
  let r = XFORM_KEYS.get(key);                // 属性名だけで決まるので、毎フレーム正規表現で調べ直さない（結果は書き換えないこと）
  if (r) return r;
  if (key in SHEAR_AXIS) r = ['sh', SHEAR_AXIS[key]];
  else {
    const m = /^(t|r|s|jo|ra|rp|sp|rpt|spt)([xyz])?$/.exec(key);
    r = m ? [m[1], m[2] ? XYZ.indexOf(m[2]) : -1] : [key, -1];
  }
  XFORM_KEYS.set(key, r);
  return r;
}
const XFORM_KEYS = new Map();
const CHAN_MODES = { full: 0, fk: 1, t: 2 };
const NO_INPUTS = [];
const NO_POSE = () => null;                // ポーズ確認の追加分なし
const BUSY = Symbol('busy');
// decomposeMatrix・composeMatrix の途中の値（使い回す）
const _dcT = new Vector3(), _dcQ = new Quaternion(), _dcS = new Vector3(), _dcSh = new Vector3();
const _cpQ = new Quaternion(), _cpE = new Euler();
/** outputsCommon が扱わない種類 */
const NOT_COMMON = Symbol('notCommon');
/** グラフのノード → 正規表現 → 配列の属性の添字（indices。返す配列は書き換えないこと） */
const INDICES = new WeakMap();

// ---- 再生キャッシュの行列の並び。ローカル行列は移動・回転・スケール（とせん断）でできていて、最後の行が 0, 0, 0, 1 なので、
// 残りの 12 個だけを持つ（キャッシュが 25% 小さくなる）。コンストレイントの計算などで、最後の行が丸めの誤差だけ違う
// （1 が 0.9999999999999998 になるなど）ことがあるので、AFFINE_TOL 以内なら 12 個にして、読むときは 0, 0, 0, 1 に戻す
// （違いは 1e-16 ほど。親の移動に掛かる影響も見た目には出ない）。それより違う行列があるフレームは 16 個ずつ持つ
const AFFINE = [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14];       // 持つ要素（列優先の Matrix4.elements の番号）
const AFFINE_TOL = 1e-12;
const isAffine = (e) => Math.abs(e[3]) <= AFFINE_TOL && Math.abs(e[7]) <= AFFINE_TOL && Math.abs(e[11]) <= AFFINE_TOL
  && Math.abs(e[15] - 1) <= AFFINE_TOL;

/**
 * 動くノード（moving の順）のローカル行列（target）を、再生キャッシュの並びにする。32 ビットの数で持つ（64 ビットの半分の
 * 大きさ。値は 32 ビットに丸めるが、描画は GPU で 32 ビットなので、見た目にはほぼ出ない）
 */
export function packSnapshotMats(target, moving) {
  let affine = true;
  for (const ni of moving) if (!isAffine(target.get(ni).elements)) { affine = false; break; }
  const stride = affine ? 12 : 16;
  const mats = new Float32Array(moving.size * stride);
  let o = 0;
  for (const ni of moving) {
    const e = target.get(ni).elements;
    if (affine) for (let k = 0; k < 12; k++) mats[o + k] = e[AFFINE[k]];
    else for (let k = 0; k < 16; k++) mats[o + k] = e[k];
    o += stride;
  }
  return mats;
}

/** 2 つのキャッシュの並びが同じか（型・長さ・値。0 と -0 も区別する） */
function sameMats(a, b) {
  if (a.constructor !== b.constructor || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i], y = b[i];
    if (x !== y || (x === 0 && 1 / x !== 1 / y)) return false;
  }
  return true;
}

/** 再生キャッシュの並びの、1 つの行列の数の個数（12 か 16。count: 動くノードの数）。どちらでもなければ 0 */
export function snapshotStride(mats, count) {
  if (mats.length === count * 12) return 12;
  if (mats.length === count * 16) return 16;
  return 0;
}

/** 再生キャッシュの並びの i 番目の行列を m に入れる */
export function readSnapshotMat(mats, stride, i, m) {
  const o = i * stride;
  if (stride === 16) return m.fromArray(mats, o);
  const e = m.elements;
  for (let k = 0; k < 12; k++) e[AFFINE[k]] = mats[o + k];
  e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
  return m;
}
/** deep のやり直しで使う関数（評価器ごとに 1 回だけ作る。呼んだときの状態は st.saved） */
function deepHooks(st) {
  return {
    retry() {
      // あふれた所から戻る途中で片付けられなかったもの（計算中の印・状態）を、呼んだときに戻す
      const sv = st.saved, self = sv.self, marks = st.marks;
      self.varying = sv.varying;
      self.dcur = sv.dcur;
      if (!sv.busy) self.busy.clear();
      if (sv.prof && sv.prof.defStack) sv.prof.defStack.length = sv.defs;
      for (let i = sv.mark; i < marks.length; i += 2) if (marks[i].get(marks[i + 1]) === BUSY) marks[i].delete(marks[i + 1]);
      marks.length = sv.mark;
    },
    stuck(at) { return st.saved.self.unstick(at); },
  };
}

/** 専用の評価をやめた理由（スタックがあふれた所の関数名） */
const overflowReason = (e) => `計算の鎖が深すぎる（スタックがあふれた: ${stackNames(e && e.stack).join(' ← ') || '場所不明'}）`;               // キャッシュの計算中の印（循環の検出）
const PLAN = { def: 0, input: 1, component: 2, output: 3, triple: 4, static: 5 };   // plugPlan の種類
const SNAPSHOT_BASE = 512;                 // 再生キャッシュの 1 フレームの入れ物の大きさ（バイト。目安）
const OPAQUE = -1;                         // 追加分の目印がノードごとでないとき（版の数など）の印。どの値もこれを読んだことにする
const NO_KEYS = new Map();                 // 追加分なしの目印
const NO_FRAMES = new Map();               // 再生キャッシュのないとき（snapshots）
const MAX_LAYERS = 6;                      // 再生キャッシュのレイヤーの数の上限（追加分なし・再生で使うものは残す）

/**
 * 追加分の目印（ノード番号 → 文字列の Map）。poseKey が Map ならそのまま、版の数などなら OPAQUE の 1 つだけにする。
 * 追加分があって目印がなければ null（毎回別物として扱う）
 */
function poseKeysOf(poseOf, poseKey) {
  if (poseOf === NO_POSE) return NO_KEYS;
  if (poseKey instanceof Map) return poseKey;
  return poseKey === undefined || poseKey === null ? null : new Map([[OPAQUE, poseKey]]);
}

const copyKeys = (k) => (k === null || k === NO_KEYS || !k.size ? (k && NO_KEYS) : new Map(k));

/** 2 つの目印で値の違うノード（Set）。どちらかが null・OPAQUE が違うなら null（すべて違うとみなす） */
function diffKeys(a, b) {
  if (!a || !b) return null;
  const out = new Set();
  if (a === b) return out;
  for (const [k, v] of a) if (b.get(k) !== v) out.add(k);
  for (const [k, v] of b) if (a.get(k) !== v) out.add(k);
  return out.has(OPAQUE) ? null : out;
}

function intersects(a, b) {
  if (a.size > b.size) [a, b] = [b, a];
  for (const x of a) if (b.has(x)) return true;
  return false;
}
/** 型ごとの出力の属性（新しい計算ノードは mathNodes.js。distanceBetweenDL は distanceBetween と同じ） */
function outputsOf(type) {
  if (OUTPUTS[type]) return OUTPUTS[type];
  if (type === 'distanceBetweenDL') return OUTPUTS.distanceBetween;
  const mk = mathKind(type);
  return mk ? mathOutputs(mk) : null;
}
function defaultsOf(type) {
  if (DEFAULTS[type]) return DEFAULTS[type];
  if (type === 'distanceBetweenDL') return DEFAULTS.distanceBetween;
  const mk = mathKind(type);
  return mk ? (MATH_DEFAULTS[mk] || DEFAULTS[mk] || {}) : null;
}

const NOTHING = () => undefined;
const NULL = () => null;
const TIME_RE = /\b(frame|time)\b/;       // expression が時間を読むか
const OUT_ATTR = Array.from({ length: 64 }, (_, k) => `out[${k}]`);   // expression の出力の属性の名前（よく使う番号）
// 値のキャッシュ（chan のキーは ni · 3 + モード、plug は id → 属性 → 値）
const emptyCache = () => ({ chan: new Map(), posed: new Map(), local: new Map(), world: new Map(), plug: new Map(), out: new Map(), ik: new Map() });

/** ファイルの値が度で書かれている角度の属性（内部ではラジアンで扱う） */
/** aim と up が平行な aimConstraint の解き方の候補（最短の回転をどこから測るか） */
const AIM_MODES = [
  ['parent', '親の空間の軸から（今の解き方）'],
  ['world', 'ワールドの軸から'],
  ['rest', 'レスト回転（.restRotate）から'],
];

function isAngleAttr(type, attr) {
  const mk = mathKind(type);
  if (mk) return mathAngleInput(mk, attr);                       // 新しい計算ノード（mathNodes.js）
  const re = ANGLE_ATTRS[type];
  return re ? re.test(attr) : false;
}

/** かけ算で重ねるスケールの x^w（負のスケールは向きを残して大きさだけを w 乗する） */
function weightedPow(x, w) {
  if (w === 1) return x;
  if (w === 0) return 1;
  return Math.sign(x) * Math.abs(x) ** w;
}

const _lrA = new Quaternion(), _lrB = new Quaternion(), _lrI = new Quaternion(), _lrE = new Euler();
/**
 * 回転のレイヤーごとの重ね方（Rotation Accumulation: By Layer）。a・b はラジアンの (x, y, z)、ro は回転順。
 * 足し算のレイヤー（wa 1）: 下のレイヤーまでの回転 a に、このレイヤーの回転 b を wb の割合で重ねる（クォータニオンの積。
 * b をジョイントの向きの中で先に回す順。推定）。Override（wa < 1）: a（wa 0 なら回転なし）から b へ wb の割合で slerp
 */
function layerRotation(a, b, wa, wb, ro) {
  const order = THREE_ORDER[ro] || 'ZYX';
  _lrA.setFromEuler(_lrE.set(a[0], a[1], a[2], order));
  _lrB.setFromEuler(_lrE.set(b[0], b[1], b[2], order));
  _lrI.identity();
  let q;
  if (wa >= 1 - 1e-9) {
    q = _lrA.multiply(_lrI.slerp(_lrB, wb));             // a · b^wb
  } else if (wb >= 1 - 1e-9) {
    q = _lrB;
  } else {
    // Passthrough（wa = 1 − wb）なら a、そうでない（wa 0）なら回転なしから
    const base = _lrI.slerp(_lrA, Math.min(1, Math.max(0, wa / (1 - wb))));
    q = base.slerp(_lrB, wb);
  }
  _lrE.setFromQuaternion(q, order);
  return [_lrE.x, _lrE.y, _lrE.z];
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

// 成分の短い名前が「まとめた名前 + 軸」にならない属性（Maya の技術資料）: 型 → まとめた名前 → 成分の名前
const REST_T = { rst: ['rtx', 'rty', 'rtz'] };                        // restTranslate
const REST_R = { rsrr: ['rrx', 'rry', 'rrz'] };                       // restRotate
const IRREGULAR = {
  ikHandle: { dwuv: ['dwux', 'dwuy', 'dwuz'], dwve: ['dwvx', 'dwvy', 'dwvz'] },   // dWorldUpVector・dWorldUpVectorEnd
  pointConstraint: REST_T, poleVectorConstraint: REST_T,
  orientConstraint: REST_R, aimConstraint: REST_R, lookAt: REST_R,
  parentConstraint: { ...REST_T, ...REST_R },
};

/**
 * 種類と属性名だけで決まる値を覚える（関数 fn(type, attr)）。正規表現を使う関数を、属性を初めて読むとき（計算ノードの鎖を
 * さかのぼる深い所）に何度も呼ぶと、よく使う正規表現を機械語にするコンパイルがスタックの残りの少ない所で起き、
 * エラーにならずにプロセスごと止まることがある（V8）。覚えておけば、種類と属性名ごとに最初の 1 回だけになる
 */
function byTypeAttr(fn) {
  const cache = new Map();
  return (type, attr) => {
    const key = `${type}\u0000${attr}`;
    let v = cache.get(key);
    if (v === undefined && !cache.has(key)) { v = fn(type, attr); cache.set(key, v); }
    return v;
  };
}

/** まとめた属性 base の成分の属性の名前（c1 → c1r・c1g・c1b、dwuv → dwux・dwuy・dwuz）。返す配列は書き換えないこと */
const componentsOf = byTypeAttr(componentsOfUncached);
function componentsOfUncached(type, base) {
  const t = IRREGULAR[type];
  if (t && t[base]) return t[base];
  return suffixesOf(type, base).map((s) => base + s);
}

/** 成分の属性の名前 → [まとめた名前, 番号]（ox → ['o', 0]、dwuy → ['dwuv', 1]）。成分でなければ null。書き換えないこと */
const componentOf = byTypeAttr(componentOfUncached);
/** 計算結果の属性なら、添字を除いた名前（ws[0] → ws）。そうでなければ null */
const outputBaseOf = byTypeAttr((type, attr) => {
  const re = outputsOf(type);
  return re && re.test(attr) ? attr.replace(/\[\d+\]$/, '') : null;
});
function componentOfUncached(type, attr) {
  const t = IRREGULAR[type];
  if (t) {
    for (const base in t) {
      const i = t[base].indexOf(attr);
      if (i >= 0) return [base, i];
    }
  }
  const m = /^(.*?)([xyzrgb])$/.exec(attr);
  if (!m || (t && t[m[1]])) return null;
  const i = suffixesOf(type, m[1]).indexOf(m[2]);
  return i >= 0 ? [m[1], i] : null;
}

const _v = new Vector3();
const _v2 = new Vector3();
const _s = new Vector3();
const _q = new Quaternion();

/** 折れ線 pts の、点 p に一番近い点（線分 j の割合 t と距離 d） */
function closestOnPolyline(pts, p) {
  let best = Infinity, bj = 0, bt = 0;
  for (let j = 0; j < pts.length - 1; j++) {
    const ab = _v.subVectors(pts[j + 1], pts[j]);
    const L = ab.lengthSq();
    const t = L > EPS ? Math.min(1, Math.max(0, _v2.subVectors(p, pts[j]).dot(ab) / L)) : 0;
    const d = _v2.copy(pts[j]).addScaledVector(ab, t).distanceToSquared(p);
    if (d < best) { best = d; bj = j; bt = t; }
  }
  return { d: Math.sqrt(best), j: bj, t: bt };
}
const _e = new Euler();
const _m = new Matrix4();

/** 行列の回転（Maya と同じ分け方。せん断・鏡に映した行列も Maya と同じに扱う） */
function rotationOf(m, target = new Quaternion()) {
  decomposeMaya(m, _v, target, _s);
  return target;
}
function positionOf(m, target = new Vector3()) { return target.setFromMatrixPosition(m); }
function eulerQuat(deg, order = 0, target = new Quaternion()) {
  return target.setFromEuler(_e.set(deg[0] * D2R, deg[1] * D2R, deg[2] * D2R, THREE_ORDER[order] || 'ZYX'));
}
function radQuat(rad, target = new Quaternion()) {
  return target.setFromEuler(_e.set(rad[0], rad[1], rad[2], 'ZYX'));     // 回転順 xyz
}

/**
 * orientConstraint・parentConstraint の回転の補間（interpType。.int）。Autodesk の技術資料: 0 No Flip・1 Average（四元数の
 * 平均。既定）・2 Shortest（ターゲットの間の最短の経路）・3 Longest・4 Cache。ターゲットが 1 つなら補間しない。
 * 式が分かる 2 ターゲットの Shortest だけを最短の弧の slerp にし、ほかは平均にする（警告は Python 側で出す）
 */
export const INTERP_SHORTEST = 2;
export function constraintQuat(list, interp) {
  if (interp === INTERP_SHORTEST && list.length === 2) {
    const s = list[0].w + list[1].w;
    if (s > EPS) return list[0].q.clone().slerp(list[1].q, list[1].w / s);
  }
  return averageQuat(list);
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
      for (const pvConvert of ['full', 'rot', 'reflect']) {
        for (const side of [1, -1]) RP_VARIANTS.push({ plane, twistSign, pvSpace, pvConvert, side });
      }
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
  const cv = { full: '空間の変換 スケール込み（今の解き方）', rot: '空間の変換 IK は回転だけ（反転を除く）',
    reflect: '空間の変換 IK は回転だけ（反転を残す）' }[v.pvConvert || 'full'];
  return `${pl}・${tw}・${sp}・${cv}・肘 ${v.side === 1 ? '極ベクトルの側' : '反対側'}`;
}

// 表示の属性の既定値（.v・.lodv・描画のオーバーライドの .ove / .ovv）
export const VIS_DEFAULTS = { v: 1, lodv: 1, ove: 0, ovv: 1 };

/** 表示の属性の値（{ v, lodv, ove, ovv }。足りないものは既定値）から、表示されるか */
export function visibleFrom(vals) {
  const g = (k) => (typeof vals[k] === 'number' ? vals[k] : VIS_DEFAULTS[k]);
  return g('v') >= 0.5 && g('lodv') >= 0.5 && !(g('ove') >= 0.5 && g('ovv') < 0.5);
}

/**
 * animation.props（node・mesh・curve）の評価結果から、リグで隠れるか。
 * ディスプレイレイヤーの表示（lv）・有効（le）が接続で決まるときはその値で、そうでなければファイルの値（layerHidden）で決める
 * @param st props の static（ファイルの値）  @param values evaluateProps の values
 */
export function hiddenByProps(st, values) {
  const s = st || {}, v = values || {};
  const all = { ...s, ...v };
  let layer = !!s.layerHidden;
  if (typeof v.lv === 'number' || typeof v.le === 'number') {
    const n = (k) => (typeof all[k] === 'number' ? all[k] : 1);
    layer = n('le') >= 0.5 && n('lv') < 0.5;              // 無効なレイヤーは表示に影響しない
  }
  return layer || !visibleFrom(all);
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
    // グラフから求めた値（グラフのオブジェクトには書き込まない。共通 JSON をそのまま別の評価器・ワーカーに渡せるように）
    this.derived = { maskSets: new WeakMap(), programs: new WeakMap(), weightsOf: new WeakMap() };
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
      for (const src of Object.values(g.inputs || {})) this.addDriverSource(src, addUp);
    }
    // 表示（.v など）・カメラの属性などの入力元も、コントローラー（表示を切り替えるスイッチなど）
    for (const p of clip.raw.props || []) for (const src of Object.values(p.inputs || {})) this.addDriverSource(src, addUp);
    // 動くノード: カーブ・リグの接続・IK で値が決まるノードと、スケールが動く親を持つジョイント（スケール補正）。
    // それ以外の材料（コントローラーなど）は、プラグの値を読むためだけに使い、行列はファイルの値のまま
    this.moving = new Set();
    const scaled = new Set();
    for (const e of clip.entries) {
      const g = this.dagGraph.get(e.node);
      const keys = g && g.inputs ? Object.keys(g.inputs).filter((k) => CHANNEL_RE.test(k)) : [];
      if (e.channels.length || this.ikJoint.has(e.node) || keys.length) this.moving.add(e.node);
      if (e.channels.some((c) => c.base === 's') || keys.some((k) => xformKey(k)[0] === 's')) scaled.add(e.node);
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
    // スプライン IK で、開始ジョイントの位置もカーブに合わせることがあるもの（rootOnCurve がオン、またはキー・接続で
    // 決まる）。chan(ni, 't') でも IK を解く（オフのフレームでは IK は移動を変えないので、FK の値のまま）
    this.splineRoots = new Set(this.graph.filter((g) => g.ik && g.ik.solver === 'ikSplineSolver'
      && (((g.attrs || {}).roc ?? 0) >= 0.5 || !!(g.inputs && g.inputs.roc))).map((g) => g.ik.chain[0]));
    // 時間で変わる expression（frame・time を使う式）があるか（キーがなくてもタイムラインを出す）
    this.usesTime = this.graph.some((g) => g.type === 'expression' && TIME_RE.test(g.expr || ''));
    this.hasTrax = this.graph.some((g) => g.trax);          // キャラクターセットの Trax のクリップ（時間で変わる）
    this.props = clip.raw.props || [];       // 表示・カメラの属性の接続（evaluateProps）
    // 自作ノードの定義（animation.nodeDefs）: 型 → 評価できる形。定義が壊れていれば、そのノードは評価しない
    this.defs = new Map();
    const td = performance.now();
    for (const [t, d] of Object.entries(clip.raw.nodeDefs || {})) {
      try { this.defs.set(t, compileNodeDef(d)); } catch (e) { this.defs.set(t, null); }
    }
    this.defsMs = performance.now() - td;     // 定義を評価できる形にした時間（評価のプロファイラのワーカーの欄）
    this.problems = new Set();               // 評価中に見つかった問題（循環など）
    this.deepState = newDeepState();         // 深い再帰でスタックがあふれたときのやり直し（deepEval.js・deep）
    this.profile = null;                     // 評価のプロファイラ（記録中だけ。profiler.js）
    this.bypassCache = false;                // 再生キャッシュを使わずに評価する（評価のプロファイラの「キャッシュを使わずに測る」）
    this.lastPath = null;                    // 直前の evaluate の経路（'cache' 再生キャッシュ / 'compiled' 専用の評価 / 'generic' 汎用の経路）
    this.ikVariant = null;                   // 再現チェックで試す IK の解き方の候補（ふだんは null）
    this.aimMode = null;                     // aim と up が平行な aimConstraint の解き方（再現チェックで試す。null = parent）
    this.frame = 0;
    this.poseOf = NO_POSE;                   // ポーズ確認の追加分（evaluate で受け取る。リグの中では poseAt を通して読む）
    this.poseKey = null;                     // evaluate で受け取った追加分の目印（そのまま）
    this.poseKeys = NO_KEYS;                 // 追加分の目印（poseKeysOf。ノード番号 → 文字列。null = 目印なし）
    // 依存の追跡: 追加分を読んだことのあるノード（poseReads。これまでの評価すべての和）と、計算した値ごとに読んだノード
    // （キャッシュの Map の deps）。読まれていないノードの追加分を変えても、キャッシュは捨てない。変えたノードを読んだ
    // 値だけを捨てる・作り直す
    this.poseReads = new Set([OPAQUE]);
    this.dcur = null;                        // いま計算中の値が読んだノード（Set。null = まだない。変えない集合）
    // 依存の集合は変えずに共有し、同じ組み合わせの和は覚えて使い回す（グラフの形は変わらないので、2 フレーム目からは
    // 新しい集合をほとんど作らない）。集合の番号（depIds）・1 ノードだけの集合（depSingles）・和（depUnions: 番号 → 番号 → 和）
    this.depIds = new WeakMap();
    this.nextDepId = 1;
    this.depSingles = new Map();
    this.depUnions = new Map();
    this.depUnionCount = 0;
    this.nodeDeps = new Map();               // 動くノード → そのローカル行列が読んだノード（再生キャッシュに入れた評価すべての和）
    this.dependents = new Map();             // ノード → その追加分で値が変わりうる動くノード（nodeDeps の逆引き）
    // 時間で変わらない値（キー・frame・time・Trax のどれも読まずに求めた値）は、フレームをまたいで keep に残す。
    // 追加分を変えたら、変えたノードを読んだ値だけを捨てる（keepKeys と比べる）。再現チェックの候補
    // （ikVariant・aimMode）が変わったらすべて捨てる（keepFor と比べる）
    this.keep = emptyCache();
    this.keepKeys = NO_KEYS;
    this.keepFor = { ikVariant: null, aimMode: null };
    this.keepStatic = true;                  // false なら keep を使わない（毎フレームすべて計算する）
    this.plans = new Map();                  // グラフの id → 属性 → 値の求め方（plugPlan）
    // 専用の評価（rigCompiled.js）。最初の評価のあとで計画を作る（undefined = まだ・null = 扱えないリグ）。
    // useCompiled を false にすると、いつもこの評価器で評価する（テスト・比較用）
    this.compiledPlan = undefined;
    this.compiledReason = null;
    this.useCompiled = true;
    this.chanInputList = new Map();          // ノード番号 → チャンネルの接続（chanInputs）
    this.curveAttrs = new Map();             // AnimationClip のノードの材料 → カーブが動かす属性（curveAttrsOf）
    this.varying = false;                    // いま計算中の値が、時間で変わる値を読んだか
    // 再生キャッシュ: 追加分ごとのレイヤー { keys（追加分の目印）, frames（整数のフレーム → { mats（動くノードのローカル
    // 行列を並べた Float32Array）, props, curves, bytes, layer }）, bytes }。後ろほど新しく使ったもの。
    // 2 周目以降の再生はコピーだけにする。追加分を前と同じに戻せば（元に戻す・キーのある値をカーブに戻す）前のレイヤーを
    // そのまま使い、新しい追加分のフレームは、ほかのレイヤーの同じフレームから影響のないノードの行列を写して作る（seed）。
    // 上限（バイト）を超えたら古いレイヤーから捨てる。0 なら使わない（setPlaybackLimit）
    this.layers = [];
    this.layer = null;                       // いまのフレームの評価に使ったレイヤー
    this.play = null;                        // 再生で使う追加分 { poseOf, key, keys }（setPlaybackPose。null = いまの追加分）
    this.snapshotBytes = 0;                  // 再生キャッシュの大きさ（全レイヤー。カーブの形・属性の値を含む目安）
    this.frameBytes = this.moving.size * 48 + SNAPSHOT_BASE;    // 1 フレームの大きさの見込み（32 ビットの数を 12 個ずつ。覚えたフレームの最大）
    this.countedCurves = new WeakSet();      // 大きさを数えたカーブの値（時間で変わらない形は全フレームで同じものを使う）
    this.playbackLimit = 512 * 1024 * 1024;
    this.current = null;                     // いまのフレームの再生キャッシュ（覚えないフレームは null）
    this.seeded = 0;                         // いまのフレームの評価で、ほかのレイヤーから写した動くノードの数（確認用）
    this.reset();
  }

  get hasGraph() { return this.graph.length > 0; }

  /** 1 回の評価の準備。追加分・再現チェックの候補が変わっていたら、それを読んだ keep の値を捨てる */
  reset() {
    const k = this.keepFor;
    if (k.ikVariant !== this.ikVariant || k.aimMode !== this.aimMode) {
      this.keep = emptyCache();
      this.keepFor = { ikVariant: this.ikVariant, aimMode: this.aimMode };
      this.keepKeys = copyKeys(this.poseKeys);
    } else if (this.keepKeys !== this.poseKeys) {
      const d = diffKeys(this.keepKeys, this.poseKeys);
      if (d === null || d.size) {
        const changed = this.readsOf(d);
        if (changed === null || changed.size) this.dropKeep(changed);
        this.keepKeys = copyKeys(this.poseKeys);
      }
    }
    this.cache = emptyCache();
    this.busy = new Set();
    this.varying = false;
    this.current = null;
    this.dcur = null;
  }

  /** 値の違うノード d（null = すべて）のうち、評価で追加分を読んだことのあるもの（null = すべて） */
  readsOf(d) {
    if (d === null) return null;
    const out = new Set();
    for (const n of d) if (this.poseReads.has(n)) out.add(n);
    return out;
  }

  /** keep のうち、changed（null = どれか）のノードの追加分を読んだ値を捨てる */
  dropKeep(changed) {
    const drop = (m) => {
      if (!m.deps) return;
      for (const [key, d] of m.deps) {
        if (changed === null ? d.size > 0 : intersects(d, changed)) { m.delete(key); m.deps.delete(key); }
      }
    };
    for (const [name, m] of Object.entries(this.keep)) {
      if (name === 'plug') for (const sub of m.values()) drop(sub);
      else drop(m);
    }
  }

  /** ポーズ確認の追加分（ノード ni の。なければ null）。読んだことを依存として覚える */
  poseAt(ni) {
    this.poseReads.add(ni);
    let one = this.depSingles.get(ni);
    if (!one) this.depSingles.set(ni, one = new Set([ni]));
    this.dcur = this.unionDeps(this.dcur, one);
    return this.poseOf(ni);
  }

  /** いま計算中の値の依存に、読んだ値の依存 d を足す（d は変えない） */
  addDeps(d) {
    if (d) this.dcur = this.unionDeps(this.dcur, d);
  }

  depIdOf(set) {
    let id = this.depIds.get(set);
    if (id === undefined) this.depIds.set(set, id = this.nextDepId++);
    return id;
  }

  /** 依存の集合 a と b の和（どちらも変えない。同じ組み合わせなら前に作ったものを返す） */
  unionDeps(a, b) {
    if (!a) return b;
    if (!b || a === b) return a;
    let ia = this.depIdOf(a), ib = this.depIdOf(b);
    if (ia > ib) { const t = ia; ia = ib; ib = t; }
    let row = this.depUnions.get(ia);
    if (!row) this.depUnions.set(ia, row = new Map());
    let u = row.get(ib);
    if (u === undefined) {
      const big = a.size >= b.size ? a : b, small = big === a ? b : a;
      let all = true;
      for (const x of small) if (!big.has(x)) { all = false; break; }
      if (all) u = big;
      else { u = new Set(big); for (const x of small) u.add(x); }
      if (++this.depUnionCount > 500000) {                 // 追加分を何度も変えたときなど、覚えすぎたら捨てる
        this.depUnions = new Map();
        this.depUnionCount = 0;
        row = new Map();
        this.depUnions.set(ia, row);
      }
      row.set(ib, u);
    }
    return u;
  }

  /** 動くノード ni のローカル行列が読んだノードを覚える（seed で、影響を受けないノードを見分ける） */
  addNodeDeps(ni, d) {
    let u = this.nodeDeps.get(ni);
    if (u === d) return;
    if (!u) this.nodeDeps.set(ni, u = new Set());
    for (const x of d) {
      if (u.has(x)) continue;
      u.add(x);
      let s = this.dependents.get(x);
      if (!s) this.dependents.set(x, s = new Set());
      s.add(ni);
    }
  }

  /**
   * 接続元 src の DAG ノードを、ほかを動かすノード（drivers・directDrivers）に加える。ロケーター・自作のシェイプの
   * 属性（独自の属性のスイッチなど）なら、その transform（Maya でシェイプを選ぶと選ばれるノード）
   */
  addDriverSource(src, addUp) {
    const s = src.node !== undefined ? this.byId.get(src.node) : null;
    if (!s) return;
    if (s.dag >= 0) addUp(s.dag);
    else if (s.type !== 'nurbsCurve' && s.parent >= 0) addUp(s.parent);
  }

}

// 種類ごとのファイルに分けたメソッド（RigEvaluator のメソッドのまま。整備計画の D5）
installMethods(RigEvaluator, ConstraintMethods);
installMethods(RigEvaluator, IkMethods);
installMethods(RigEvaluator, MathMethods);
installMethods(RigEvaluator, PlaybackMethods);
installMethods(RigEvaluator, DagMethods);
installMethods(RigEvaluator, PlugMethods);
installMethods(RigEvaluator, NodeDefMethods);
installMethods(RigEvaluator, DisplayMethods);
/** 3 つ組の値を、まとめた名前（o）と成分の名前（ox など）の両方で引けるようにする */
function expand(base, values, suffixes) {
  return expandInto({}, base, values, suffixes);
}

/** expand を o に書き足す（出力を 1 つのオブジェクトにまとめる。スプレッド構文で作り直さない） */
function expandInto(o, base, values, suffixes) {
  o[base] = values;
  for (let i = 0; i < suffixes.length; i++) o[base + suffixes[i]] = values[i];
  return o;
}

// ------------------------------------------------------------------ IK の解き方（スプライン以外）
// ev は値の読み方（RigEvaluator そのもの、または専用の評価の読み方。rigCompiled.js）。どちらも同じ数式を通る
export function solveIKCore(ev, id) {
  const g = ev.byId.get(id);
  if (g.ik.solver === 'ikSplineSolver') return ev.solveSpline(id);
  if (g.ik.chain.length === 2) return solveOneBone(ev, id);
  if (g.ik.chain.length > 3) return solveChain(ev, id);
  const [s, mid, end] = g.ik.chain;
  const sc = g.ik.solver === 'ikSCsolver';
  if (!ev.rest(s) || !ev.rest(mid)) return null;
  const P = ev.parentWorld(s);
  const fkS = ev.chan(s, 'fk'), fkM = ev.chan(mid, 'fk');
  const Ls = composeLocalMatrix(fkS, ev.isScaleOf(s), new Matrix4());
  let Lm = composeLocalMatrix(fkM, ev.isScaleOf(mid), new Matrix4());
  const tEnd = (ev.chan(end, 't') || { t: [0, 0, 0] }).t;
  const Ws = new Matrix4().multiplyMatrices(P, Ls);
  let Wm = new Matrix4().multiplyMatrices(Ws, Lm);
  const A = positionOf(Ws), B = positionOf(Wm);
  let C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Wm);
  const l1 = B.distanceTo(A), l2 = C.distanceTo(B);
  if (l1 < EPS || l2 < EPS) return null;
  // まっすぐなチェーンは曲げる向きが決まらないので、優先角（.pa）で曲げた形を基準にする
  let n0 = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, B));
  const pa = ev.dagGraph.get(mid) && ev.dagGraph.get(mid).attrs && ev.dagGraph.get(mid).attrs.pa;
  if (n0.lengthSq() < EPS * l1 * l2 && Array.isArray(pa)) {
    Lm = composeLocalMatrix({ ...fkM, r: pa }, ev.isScaleOf(mid), new Matrix4());
    Wm = new Matrix4().multiplyMatrices(Ws, Lm);
    C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Wm);
    n0 = new Vector3().subVectors(B, A).cross(new Vector3().subVectors(C, B));
  }
  const hni = g.dag;
  const H = positionOf(ev.world(hni));
  const u = new Vector3().subVectors(H, A);
  const d = u.length();
  if (d < EPS) return null;
  u.divideScalar(d);
  // 極ベクトル（ハンドルの親の空間）→ ワールド。ひねり（twist）で u のまわりに回す。
  // シングルチェーン（SC）は極ベクトルを持たないので、FK の形の中間ジョイントの側に曲げる（面を保つ）
  const pvLocal = sc ? [0, 0, 0] : ev.vec(id, 'pv', [0, 0, 1]);
  const pv = ev.pvWorld(pvLocal, hni, s);
  let v = pv.clone().addScaledVector(u, -pv.dot(u));
  if (v.lengthSq() < EPS) v = new Vector3().subVectors(B, A).addScaledVector(u, -new Vector3().subVectors(B, A).dot(u));
  if (v.lengthSq() < EPS) v = new Vector3(0, 1, 0).cross(u).lengthSq() > EPS ? new Vector3(0, 1, 0).cross(u) : new Vector3(1, 0, 0).cross(u);
  v.normalize();
  if (!sc && ev.ikVariant && ev.ikVariant.side === -1) v.negate();
  const twist = sc ? 0 : ev.num(id, 'twi', 0) * ev.twistSign();
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
  if (!sc && ev.ikVariant && ev.ikVariant.plane === 'axis') {
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
  const pq = rotationOf(ev.parentSpace(s));
  let rs = ev.localEuler(s, pq.clone().invert().multiply(qs1));
  let rm = ev.localEuler(mid, qs1.clone().invert().multiply(qm1));
  const blend = ev.num(id, 'ikb', 1);
  if (blend < 1 - EPS) {                                    // IK と FK を混ぜる（ikBlend）
    const mix = (fk, ik, ni) => {
      const ro = THREE_ORDER[(ev.rest(ni) || {}).ro || 0];
      const q = eulerQuat(fk, (ev.rest(ni) || {}).ro || 0).slerp(eulerQuat(ik, (ev.rest(ni) || {}).ro || 0), Math.max(0, blend));
      const e = new Euler().setFromQuaternion(q, ro);
      return [e.x * R2D, e.y * R2D, e.z * R2D];
    };
    rs = mix(fkS.r, rs, s);
    rm = mix(fkM.r, rm, mid);
  }
  return new Map([[s, rs], [mid, rm]]);
}

/** 1 ボーン（ikSCsolver）: 開始ジョイントを最短の回転で回して、終端をハンドルの方へ向ける */
export function solveOneBone(ev, id) {
  const g = ev.byId.get(id);
  const [s, end] = g.ik.chain;
  if (!ev.rest(s)) return null;
  const P = ev.parentWorld(s);
  const fkS = ev.chan(s, 'fk');
  const Ws = new Matrix4().multiplyMatrices(P, composeLocalMatrix(fkS, ev.isScaleOf(s), new Matrix4()));
  const tEnd = (ev.chan(end, 't') || { t: [0, 0, 0] }).t;
  const A = positionOf(Ws);
  const C = new Vector3(tEnd[0], tEnd[1], tEnd[2]).applyMatrix4(Ws);
  const H = positionOf(ev.world(g.dag));
  const from = C.sub(A), to = H.sub(A);
  if (from.lengthSq() < EPS || to.lengthSq() < EPS) return null;
  const R = new Quaternion().setFromUnitVectors(from.normalize(), to.normalize());
  let rs = ev.localEuler(s, rotationOf(ev.parentSpace(s)).invert().multiply(R.multiply(rotationOf(Ws))));
  const blend = ev.num(id, 'ikb', 1);
  if (blend < 1 - EPS) {
    const ro = (ev.rest(s) || {}).ro || 0;
    const e = new Euler().setFromQuaternion(eulerQuat(fkS.r, ro).slerp(eulerQuat(rs, ro), Math.max(0, blend)), THREE_ORDER[ro]);
    rs = [e.x * R2D, e.y * R2D, e.z * R2D];
  }
  return new Map([[s, rs]]);
}

/** IK のチェーンの FK の形: 親のワールド行列 P、各ジョイントのワールド行列 W と位置（終端は移動の値だけ使う） */
export function fkChain(ev, chain) {
  const P = ev.parentWorld(chain[0]);
  const W = [];
  let prev = P;
  chain.forEach((ni, i) => {
    const c = i === chain.length - 1 ? ev.chan(ni, 't') : ev.chan(ni, 'fk');
    prev = new Matrix4().multiplyMatrices(prev, composeLocalMatrix(c, ev.isScaleOf(ni), new Matrix4()));
    W.push(prev);
  });
  return { P, W, pos: W.map((m) => positionOf(m)) };
}

/** 新しいワールドの回転（開始から終端の手前まで）→ ジョイントの回転の値。ikBlend で FK と混ぜる */
export function ikLocals(ev, id, chain, P, Qnew) {
  const blend = ev.num(id, 'ikb', 1);
  const out = new Map();
  let parentQ = rotationOf(ev.parentSpace(chain[0]));     // offsetParentMatrix も親の空間に入れる
  Qnew.forEach((q, i) => {
    const ni = chain[i];
    let r = ev.localEuler(ni, parentQ.clone().invert().multiply(q));
    if (blend < 1 - EPS) {
      const ro = (ev.rest(ni) || {}).ro || 0;
      const e = new Euler().setFromQuaternion(eulerQuat(ev.chan(ni, 'fk').r, ro)
        .slerp(eulerQuat(r, ro), Math.max(0, blend)), THREE_ORDER[ro]);
      r = [e.x * R2D, e.y * R2D, e.z * R2D];
    }
    out.set(ni, r);
    parentQ = q;
  });
  return out;
}

/** 位置の列 q（開始から終端）に合うよう、FK の形の各ジョイントを順に最小の回転で回す（delta は最初に全体へ掛ける回転） */
export function rotateAlong(ev, fk, q, delta, twistOf = null) {
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
export function solveChain(ev, id) {
  const g = ev.byId.get(id);
  const chain = g.ik.chain;
  if (chain.some((ni) => !ev.rest(ni))) return null;
  const fk = fkChain(ev, chain);
  const { pos } = fk;
  const n = pos.length;
  const lens = [];
  for (let i = 0; i < n - 1; i++) lens.push(pos[i + 1].distanceTo(pos[i]));
  if (lens.some((l) => l < EPS)) return null;
  const total = lens.reduce((s, l) => s + l, 0);
  const A = pos[0];
  const H = positionOf(ev.world(g.dag));
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
    const pvL = ev.vec(id, 'pv', [0, 0, 1]);
    const pv = ev.pvWorld(pvL, g.dag, chain[0]);
    v = pv.addScaledVector(u, -pv.dot(u));
    if (ev.ikVariant && ev.ikVariant.side === -1) v.negate();
  }
  if (!v || v.lengthSq() < EPS) v = side0.clone().addScaledVector(u, -side0.dot(u));
  if (v.lengthSq() < EPS) v = new Vector3(0, 1, 0).cross(u).lengthSq() > EPS ? new Vector3(0, 1, 0).cross(u) : new Vector3(1, 0, 0).cross(u);
  v.normalize();
  if (g.ik.solver === 'ikRPsolver') {
    const twist = ev.num(id, 'twi', 0) * ev.twistSign();
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
  return ikLocals(ev, id, chain, fk.P, rotateAlong(ev, fk, q, R1));
}

// 種類ごとのファイル（rigConstraints.js など）が使う、このファイルの定数・作業用のオブジェクト・補助関数
export { D2R, R2D, EPS, XYZ, IDENTITY, _m, _q, _v, rotationOf, positionOf, eulerQuat, radQuat, expand, expandInto };
export { AIM_MODES, IK_VARIANTS, NULL, variantLabel, closestOnPolyline };
export { NOT_COMMON, OUTPUTS, OUT_ATTR, RGB, THREE_ORDER, TIME_RE, XY, XYZW, _cpE, _cpQ, _dcQ, _dcS, _dcSh, _dcT, _e, layerRotation, weightedPow };
export { BUSY, MAX_LAYERS, NO_FRAMES, NO_KEYS, NO_POSE, OPAQUE, SNAPSHOT_BASE, copyKeys, deepHooks, diffKeys, overflowReason, poseKeysOf, sameMats };
export { ANGLE_KEYS, CHANNEL_ATTR_RE, CHAN_MODES, NO_INPUTS, VEC_KEYS, xformKey };
export { INDICES, NOTHING, PLAN, componentOf, componentsOf, defaultsOf, isAngleAttr, outputBaseOf };
export { CHANNEL_RE };
