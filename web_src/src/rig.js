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
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { clampLimits, composeLocalMatrix, composeMaya, decomposeMaya, evaluateCurve, mayaEuler, poseChannels } from './animation.js';
import { compileExpression } from './expression.js';
import { evaluateTrax } from './trax.js';
import { compileNodeDef, componentPlug } from './nodeDef.js';
import {
  arcLength, curveSegment, derivativeAt, domain, nearestParam, parseNurbsCurve, pointAt, pointAtDistance, pointAtLength, polyline,
  rebuildCurve, reverseCurve, withCvs,
} from './curve.js';
import { MATH_DEFAULTS, evaluateMath, mathAngleInput, mathKind, mathOutputs } from './mathNodes.js';
import { buildPlan, runPlan } from './rigCompiled.js';
import { ConstraintMethods, installMethods } from './rigConstraints.js';
import { IkMethods } from './rigIk.js';
import { enterDeep, isStackOverflow, leaveDeep, mayOverflow, newDeepState, runDeep, stackNames, useOrder } from './deepEval.js';

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
  // カメラとエイムの lookAt: カメラは −Z を向くので aim の既定は (0, 0, −1)
  lookAt: { a: [0, 0, -1], u: [0, 1, 0], wu: [0, 1, 0], wut: 3, o: [0, 0, 0], tws: 0, twist: 0 },
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
  multDoubleLinear: { i1: 0, i2: 0 },                                    // Maya の既定値は 0（書かれていなければ 0）
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
  // Maya の既定値は ia・ib 0、acm 0（足し算）。ふつうは acm にレイヤーの .sam（既定 1 = かけ算）が接続される
  animBlendNodeAdditiveScale: { ia: 0, ib: 0, wa: 1, wb: 1, acm: 0 },
  // ウェイト .wgth・ミュート .mt・Override .ovrd・Passthrough .pthg（既定 1）・ソロ .sl・
  // 回転の重ね方 .ram（0 = 成分ごと、1 = レイヤーごと（クォータニオン））・スケールの重ね方 .sam（0 = 足し算、1 = かけ算）・
  // 親のレイヤーから: ウェイト .pwth・ミュート .pmte・兄弟のソロ .sslo（Maya の技術資料。古いサンプルの .w・.m も読むので、
  // それらは既定値を持たせない）
  animLayer: { wgth: 1, mt: 0, ovrd: 0, pthg: 1, sl: 0, ram: 0, sam: 1, pwth: 1, pmte: 0, sslo: 0 },
  cluster: { en: 1 },
  pointOnCurveInfo: { pr: 0, top: 0 },
};
// ikHandle の属性の既定値（スプライン IK を含む）
// （前向きの軸は .dpa。古いサンプルの .dfa も読むので、dpa は既定値を持たせない）
DEFAULTS.ikHandle = { ...DEFAULTS.ikHandle, roc: 0, off: 0, rol: 0, dtce: 0, dwut: 0, dwua: 3, dfa: 0,
  dwuv: [0, 1, 0], dwve: [0, 1, 0], twt: 0, rtm: 0, dtvt: 0, dtst: 0, dten: 0 };

// 型ごとの出力の属性（これ以外の名前で計算結果を探さない。入力を読むときに自分の計算へ戻らないため）
const OUTPUTS = {
  unitConversion: /^o$/, multiplyDivide: /^o[xyz]?$/, plusMinusAverage: /^o(1|2[xy]?|3[xyz]?)$/,
  reverse: /^o[xyz]?$/, condition: /^oc[rgb]?$/, blendColors: /^op[rgb]?$/, pairBlend: /^o[tr][xyz]?$/,
  pointConstraint: /^ct[xyz]?$/, poleVectorConstraint: /^ct[xyz]?$/, orientConstraint: /^cr[xyz]?$/,
  parentConstraint: /^c[tr][xyz]?$/, scaleConstraint: /^cs[xyz]?$/, aimConstraint: /^cr[xyz]?$/, lookAt: /^cr[xyz]?$/,
  distanceDimShape: /^(dist|distance)$/,
  quatToEuler: /^ort[xyz]?$/, eulerToQuat: /^oq[xyzw]?$/, quatProd: /^oq[xyzw]?$/, quatInvert: /^oq[xyzw]?$/,
  quatNormalize: /^oq[xyzw]?$/, quatSlerp: /^oq[xyzw]?$/, curveInfo: /^(al|arcLength)$/,
  nurbsCurve: /^(ws|worldSpace|l|local)(\[\d+\])?$/, skinCluster: /^og(\[\d+\])?$/, tweak: /^og(\[\d+\])?$/,
  groupParts: /^og$/, transformGeometry: /^og$/,
  rebuildCurve: /^oc$/, reverseCurve: /^oc$/, subCurve: /^oc$/, detachCurve: /^oc\[\d+\]$/,
  nearestPointOnCurve: /^(p[xyz]?|pr|position[XYZ]?|parameter)$/, wire: /^og(\[\d+\])?$/, locator: /^(wp|worldPosition)(\[\d+\])?$/, expression: /^(out|output)\[\d+\]$/,
  addDoubleLinear: /^o$/, multDoubleLinear: /^o$/, clamp: /^op[rgb]?$/, setRange: /^o[xyz]?$/, remapValue: /^(ov|outValue)$/,
  distanceBetween: /^d$/, vectorProduct: /^o[xyz]?$/, blendTwoAttr: /^o$/, blendWeighted: /^o$/, choice: /^o$/,
  animBlendNodeAdditiveDL: /^o$/, animBlendNodeAdditiveDA: /^o$/, animBlendNodeAdditiveRotation: /^o[xyz]?$/, animLayer: /^(fgwt|fo|bgwt|omte|oram|csol)$/,
  animBlendNodeAdditive: /^o$/, animBlendNodeAdditiveF: /^o$/, animBlendNodeAdditiveFL: /^o$/, animBlendNodeAdditiveFA: /^o$/,
  animBlendNodeAdditiveI16: /^o$/, animBlendNodeAdditiveI32: /^o$/, animBlendNodeAdditiveScale: /^o$/,
  animBlendNodeBoolean: /^o$/, animBlendNodeEnum: /^o$/, animBlendNodeTime: /^o$/,
  cluster: /^og(\[\d+\])?$/, pointOnCurveInfo: /^(p|n|t|nn|nt|cc)[xyz]?$|^cr$/,
  animCurveUA: /^(o|output)$/, animCurveUL: /^(o|output)$/, animCurveUU: /^(o|output)$/,
  character: /^(lv|av|uv|tv)\[\d+\]$/,
  multMatrix: /^o$/, decomposeMatrix: /^o(t|r|s|sh)[xyz]?$|^oq[xyzw]?$/, composeMatrix: /^omat$/, inverseMatrix: /^omat$/,
  fourByFourMatrix: /^(o|output)$/,
};
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
 * 動くノード（moving の順）のローカル行列（target）を、再生キャッシュの並びにする。f32: 32 ビットの数で持つ（大きさが半分。
 * 値は 32 ビットに丸める。描画は GPU で 32 ビットなので、見た目にはほぼ出ない）
 */
export function packSnapshotMats(target, moving, f32 = false) {
  let affine = true;
  for (const ni of moving) if (!isAffine(target.get(ni).elements)) { affine = false; break; }
  const stride = affine ? 12 : 16;
  const mats = new (f32 ? Float32Array : Float64Array)(moving.size * stride);
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
  switch (type) {
    case 'pairBlend': return /^ir[12][xyz]?$/.test(attr);
    // オフセット・レスト回転（.rsrr。成分は .rrx など）
    case 'orientConstraint': case 'aimConstraint': return /^(o[xyz]?|rsrr|rr[xyz])$/.test(attr);
    case 'lookAt': return /^(o[xyz]?|tws|twist|rsrr|rr[xyz])$/.test(attr);
    case 'composeMatrix': return /^ir[xyz]?$/.test(attr);
    case 'eulerToQuat': return /^irt[xyz]?$/.test(attr);
    case 'parentConstraint': return /^(tg\[\d+\]\.tor[xyz]?|rsrr|rr[xyz])$/.test(attr);
    case 'ikHandle': return attr === 'twi' || attr === 'rol';         // ツイスト・ロール（.ma は度）
    case 'animBlendNodeAdditiveDA': case 'animBlendNodeAdditiveFA': return /^i[ab]$/.test(attr);
    case 'animBlendNodeAdditiveRotation': return /^i[ab][xyz]?$/.test(attr);
    default: return false;
  }
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
    this.chainSolver = 'fabrik';             // 3 ボーン以上の IK の解き方（CHAIN_SOLVERS。setChainSolver）
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
    this.keepFor = { ikVariant: null, aimMode: null, chainSolver: this.chainSolver };
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
    // 行列を並べた Float64Array）, props, curves, bytes, layer }）, bytes }。後ろほど新しく使ったもの。
    // 2 周目以降の再生はコピーだけにする。追加分を前と同じに戻せば（元に戻す・キーのある値をカーブに戻す）前のレイヤーを
    // そのまま使い、新しい追加分のフレームは、ほかのレイヤーの同じフレームから影響のないノードの行列を写して作る（seed）。
    // 上限（バイト）を超えたら古いレイヤーから捨てる。0 なら使わない（setPlaybackLimit）
    this.layers = [];
    this.layer = null;                       // いまのフレームの評価に使ったレイヤー
    this.play = null;                        // 再生で使う追加分 { poseOf, key, keys }（setPlaybackPose。null = いまの追加分）
    this.snapshotBytes = 0;                  // 再生キャッシュの大きさ（全レイヤー。カーブの形・属性の値を含む目安）
    this.cacheFloat32 = false;                               // 再生キャッシュを 32 ビットの数で持つか（setCachePrecision）
    this.frameBytes = this.moving.size * 96 + SNAPSHOT_BASE;    // 1 フレームの大きさの見込み（12 個ずつ。覚えたフレームの最大）
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
    if (k.ikVariant !== this.ikVariant || k.aimMode !== this.aimMode || k.chainSolver !== this.chainSolver) {
      this.keep = emptyCache();
      this.keepFor = { ikVariant: this.ikVariant, aimMode: this.aimMode, chainSolver: this.chainSolver };
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

  // ------------------------------------------------------------------ 再生キャッシュ
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

  // ------------------------------------------------------------------ DAG ノード
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

  // ------------------------------------------------------------------ プラグ
  /**
   * 移動・回転・スケール以外で接続で決まる属性（animation.props: 表示・カメラの焦点距離など）の、
   * 現在のフレームの値。evaluate() のあとに呼ぶ。[{ kind, index, values: { 属性: 数値 }, static }]
   * （place2d の of・re は [u, v]）
   */
  evaluateProps() {
    if (this.current && this.current.props) return this.current.props;
    const out = [];
    for (const p of this.props) {
      const values = {};
      for (const [attr, src] of Object.entries(p.inputs || {})) {
        const v = this.deep(() => this.guard(`prop ${p.kind}${p.index}.${attr}`, () => this.source(src), () => undefined));
        if (p.kind === 'place2d' && (attr === 'of' || attr === 're') && Array.isArray(v)) {   // 2 つ組（u, v）
          if (v.length >= 2 && Number.isFinite(v[0]) && Number.isFinite(v[1])) values[attr] = [v[0], v[1]];
          continue;
        }
        const x = Array.isArray(v) ? v[0] : v;
        if (typeof x === 'number' && Number.isFinite(x)) values[attr] = x;
      }
      out.push({ kind: p.kind, index: p.index, values, static: p.static || null });
    }
    if (this.current) {
      this.current.props = out;
      this.addSnapshotBytes(this.current, out.reduce((n, p) => n + 64 + Object.keys(p.values).length * 48, 64));
    }
    return out;
  }

  /** リグで形が変わるカーブ（nurbsCurve のシェイプ）のグラフの id */
  curveIds() {
    if (!this.curveIdList) this.curveIdList = this.graph.filter((g) => g.type === 'nurbsCurve' && g.shape >= 0).map((g) => g.id);
    return this.curveIdList;
  }

  /** いまのフレームのカーブの形（plug(gid, 'local')。再生キャッシュにあればそれを使う） */
  curveShape(gid) {
    const c = this.current;
    if (c && c.curves.has(gid)) return c.curves.get(gid);
    const v = this.deep(() => this.plug(gid, 'local'));
    if (c) {
      c.curves.set(gid, v);
      if (v && v.isCurve && !this.countedCurves.has(v)) {   // CV（Vector3）1 個あたり約 64 バイト
        this.countedCurves.add(v);
        this.addSnapshotBytes(c, 160 + v.cvs.length * 64);
      }
    }
    return v;
  }

  /** 接続元の値 */
  source(src) {
    if (src.curve !== undefined) {
      const c = this.clip.curves[src.curve];
      if (!c) return undefined;
      const v = evaluateCurve(c, this.frame);
      this.varying = true;
      return c.type === 'TA' ? v * D2R : v;
    }
    const g = this.byId.get(src.node);
    if (!g) return undefined;
    return g.dag >= 0 ? this.dagPlug(g.dag, src.attr) : this.plug(src.node, src.attr);
  }

  /** グラフのノードの属性の値（接続 → 計算結果 → ファイルの値 → 既定値） */
  plug(id, attr) {
    let fm = this.cache.plug.get(id);
    if (!fm) { this.cache.plug.set(id, fm = new Map()); fm.ownerId = id; }   // ownerId: やり直しの印（memo）
    let km = this.keep.plug.get(id);
    if (!km) this.keep.plug.set(id, km = new Map());
    return this.memo(fm, km, attr, () => this.plugUncached(id, attr), NOTHING, () => `plug ${id}.${attr}`);
  }

  plugUncached(id, attr) {
    const g = this.byId.get(id);
    return this.plugWithPlan(g, attr, this.plugPlan(g, attr));
  }

  /** 求め方（plugPlan）がわかっている属性の値（専用の評価の読み手は、求め方を覚えておいて直接呼ぶ） */
  plugWithPlan(g, attr, plan) {
    const id = g.id;
    switch (plan.kind) {
      case PLAN.def: return this.defPlug(g, attr);
      case PLAN.input: return this.source(plan.src);
      case PLAN.component: {                               // 成分（ox）: 3 つ組（o）が接続されている
        const v = this.source(plan.src);
        return Array.isArray(v) ? v[plan.index] : undefined;
      }
      case PLAN.output: {                                  // 計算結果
        const outs = this.outputs(id);
        if (!outs) return undefined;
        return attr in outs ? outs[attr] : outs[plan.base];                           // ws[0] → ws
      }
      case PLAN.triple: {                                  // 3 つ組: 成分ごとに接続・値がある
        const def = plan.def;
        return plan.names.map((name, k) => {
          const v = this.plug(id, name);
          return v !== undefined ? v : (Array.isArray(def) ? def[k] : 0);
        });
      }
      default: return this.staticValue(g, attr);
    }
  }

  /**
   * 属性の値の求め方（接続 → 成分の接続 → 計算結果 → 成分ごとの接続 → ファイルの値）。グラフの形だけで決まるので、
   * 属性ごとに最初の 1 回だけ調べて覚えておく
   */
  plugPlan(g, attr) {
    let plans = this.plans.get(g.id);
    if (!plans) this.plans.set(g.id, plans = new Map());
    let plan = plans.get(attr);
    if (plan) return plan;
    const inputs = g.inputs || {};
    if (g.def) {                                           // 自作ノード（成分などは定義が扱う）
      plan = { kind: PLAN.def };
      plans.set(attr, plan);
      return plan;
    }
    const comp = componentOf(g.type, attr);                // 成分（ox → o の 0 番目）
    const names = componentsOf(g.type, attr);              // まとめた属性の成分（o → ox・oy・oz）
    const outBase = outputBaseOf(g.type, attr);
    if (inputs[attr]) plan = { kind: PLAN.input, src: inputs[attr] };
    else if (comp && inputs[comp[0]]) plan = { kind: PLAN.component, src: inputs[comp[0]], index: comp[1] };
    else if (outBase !== null) plan = { kind: PLAN.output, base: outBase };
    else if (names.some((x) => inputs[x])) plan = { kind: PLAN.triple, names, def: this.staticValue(g, attr) };
    else plan = { kind: PLAN.static };
    plans.set(attr, plan);
    return plan;
  }

  /** ファイルの値（なければ型ごとの既定値）。角度はラジアンにする */
  staticValue(g, attr) {
    const attrs = g.attrs || {};
    const k = isAngleAttr(g.type, attr) ? D2R : 1;
    const scale = (v) => (Array.isArray(v) ? v.map((x) => x * k) : v * k);
    if (attr in attrs) return scale(attrs[attr]);
    const comp = componentOf(g.type, attr);
    if (comp && Array.isArray(attrs[comp[0]])) return attrs[comp[0]][comp[1]] * (isAngleAttr(g.type, comp[0]) ? D2R : 1);
    const names = componentsOf(g.type, attr);
    if (names.some((x) => x in attrs)) {
      const def = this.defaultValue(g.type, attr);
      return names.map((x, i) => (x in attrs ? attrs[x] : (Array.isArray(def) ? def[i] : 0)) * k);
    }
    return this.defaultValue(g.type, attr, k);
  }

  defaultValue(type, attr, k = 1) {
    if (/^w\d+$/.test(attr) || /\.tw$/.test(attr)) return 1;            // コンストレイントのウェイト
    const table = defaultsOf(type);
    const d = table ? table[attr] : undefined;
    if (d !== undefined) return Array.isArray(d) ? d.map((x) => x * k) : d * k;
    const comp = componentOf(type, attr);
    if (comp && table && Array.isArray(table[comp[0]])) return table[comp[0]][comp[1]] * k;
    return undefined;
  }

  /** 行列の属性（Matrix4。ファイルの値は 16 要素の配列。なければ単位行列） */
  mat(id, attr) {
    const v = this.plug(id, attr);
    if (v && v.isMatrix4) return v;
    if (Array.isArray(v) && v.length === 16) return new Matrix4().fromArray(v);
    return new Matrix4();
  }

  /** 配列の属性の添字（接続とファイルの値の両方から）。グラフの形だけで決まるので、ノードと re ごとに 1 回だけ求めて覚える */
  indices(g, re) {
    let byRe = INDICES.get(g);
    if (!byRe) INDICES.set(g, byRe = new Map());
    let out = byRe.get(re.source);
    if (!out) {
      const keys = [...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})];
      out = [...new Set(keys.map((k) => re.exec(k)).filter(Boolean).map((m) => +m[1]))].sort((a, b) => a - b);
      byRe.set(re.source, out);
    }
    return out;
  }

  /** 属性の名前の候補（短い名前・長い名前）のうち、接続か値があるもの（なければ最初の名前） */
  attrName(g, names) {
    return names.find((k) => (g.inputs && g.inputs[k]) || (g.attrs && k in g.attrs)) || names[0];
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

  // ------------------------------------------------------------------ 自作ノードの定義（nodeDef.js）
  /** 定義で評価するノードの属性の値（出力は計算結果、入力は接続 → ファイルの値 → 既定値） */
  defPlug(g, attr) {
    const d = this.defs.get(g.def);
    if (!d) return undefined;
    if (d.isOutput(attr)) {
      const outs = this.outputs(g.id);
      return outs ? outs[attr] : undefined;
    }
    return this.defRead(g, attr, d.infoOf(attr));
  }

  defOutputs(g) {
    const d = this.defs.get(g.def);
    if (!d) {
      this.problems.add(`${g.name}: 自作ノードの定義 ${g.def} を読めません`);
      return null;
    }
    this.varying = true;                           // 定義の計算はいまのフレームを読める
    const prof = this.profile;
    if (prof && prof.defNode) return this.defOutputsProfiled(g, d, prof);
    // 1 回の計算の中では入力の値は変わらないので、同じ入力は 1 回だけ読む（exprespy のコードで同じ IN[i] を何度も書くと、
    // その数だけ読み込みが起きていた）。計算は入力の値を書き換えない（代入は複製する）ので、同じ値を渡してよい
    const seen = new Map();
    const io = {
      frame: this.frame,
      fps: this.clip.fps || 24,
      read: (plug, info) => {
        let v = seen.get(plug);
        if (v === undefined && !seen.has(plug)) { v = this.defRead(g, plug, info); seen.set(plug, v); }
        return v;
      },
      indices: (prefix) => this.defIndices(g, prefix),
      connected: (plug) => {
        const keys = Object.keys(g.inputs || {});
        return keys.some((k) => k === plug || k.startsWith(`${plug}.`) || k.startsWith(`${plug}[`));
      },
    };
    try {
      return d.run(io);
    } catch (e) {
      if (this.deepState.depth && mayOverflow(e)) throw e;    // スタックのあふれは deep がやり直す（値なしにしない）
      this.problems.add(`${g.name}（${g.def}）: ${e.message}`);
      return null;
    }
  }

  /** 定義のノードの入力の値。角度はラジアン、時間は接続がなければいまのフレーム */
  /**
   * 評価のプロファイラの記録中の defOutputs: 計算そのものと、入力の読み込み（上流の値を求める時間を含む）を分けて測る。
   * 入力の読み込みの中でほかの自作ノードを計算したら、その時間は内側のノードに付ける（外側の読み込みから引く）
   */
  defOutputsProfiled(g, d, prof) {
    const stack = prof.defStack || (prof.defStack = []);
    const rec = { read: 0, child: 0, reads: 0 };
    stack.push(rec);
    const seen = new Map();                        // defOutputs と同じく、同じ入力は 1 回だけ読む
    const io = {
      frame: this.frame,
      fps: this.clip.fps || 24,
      read: (plug, info) => {
        rec.reads++;
        if (seen.has(plug)) return seen.get(plug);
        const t = performance.now();
        try {
          const v = this.defRead(g, plug, info);
          seen.set(plug, v);
          return v;
        } finally { rec.read += performance.now() - t; }
      },
      indices: (prefix) => this.defIndices(g, prefix),
      connected: (plug) => {
        const keys = Object.keys(g.inputs || {});
        return keys.some((k) => k === plug || k.startsWith(`${plug}.`) || k.startsWith(`${plug}[`));
      },
    };
    const t0 = performance.now();
    try {
      return d.run(io);
    } catch (e) {
      if (this.deepState.depth && mayOverflow(e)) throw e;    // スタックのあふれは deep がやり直す（値なしにしない）
      this.problems.add(`${g.name}（${g.def}）: ${e.message}`);
      return null;
    } finally {
      const total = performance.now() - t0;
      stack.pop();
      if (stack.length) stack[stack.length - 1].child += total;
      prof.defNode(g, d, total - rec.read, Math.max(0, rec.read - rec.child), rec.reads, seen.size);
    }
  }

  defRead(g, plug, info) {
    const inputs = g.inputs || {}, attrs = g.attrs || {};
    if (!info) return inputs[plug] ? this.source(inputs[plug]) : attrs[plug];
    if (info.component !== undefined) {            // ベクトルの成分（inx）を直接読む
      if (inputs[plug]) {
        const v = this.source(inputs[plug]);
        return typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : 0);
      }
      const k = info.angle ? D2R : 1;
      if (typeof attrs[plug] === 'number') return attrs[plug] * k;
      const d = info.of.default || [];
      return (d[info.component] ?? 0) * k;
    }
    const k = info.angle ? D2R : 1;
    if (info.type === 'matrix') {
      const v = inputs[plug] ? this.source(inputs[plug]) : attrs[plug];
      if (v && v.isMatrix4) return v;
      return new Matrix4().fromArray(Array.isArray(v) && v.length === 16 ? v : info.default);
    }
    if (info.size) {
      // ベクトル: 全体の接続 → 成分ごとの接続・値 → 全体の値 → 既定値
      if (inputs[plug]) {
        const v = this.source(inputs[plug]);
        if (Array.isArray(v)) return v.slice(0, info.size);
      }
      const whole = Array.isArray(attrs[plug]) ? attrs[plug] : null;
      return (info.components || []).map((c, i) => {
        const cp = componentPlug(plug, c);
        if (inputs[cp]) {
          const v = this.source(inputs[cp]);
          return typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : 0);
        }
        if (typeof attrs[cp] === 'number') return attrs[cp] * k;
        if (whole && typeof whole[i] === 'number') return whole[i] * k;
        return (info.default ? info.default[i] : 0) * k;
      });
    }
    // 数
    if (inputs[plug]) {
      const v = this.source(inputs[plug]);
      if (typeof v === 'number') return v;
      if (Array.isArray(v) && typeof v[0] === 'number') return v[0];
      return 0;
    }
    if (info.type === 'time') { this.varying = true; return this.frame; }   // 時間（time1 への接続は .ma の読み込みで消えるため、いまのフレーム）
    if (typeof attrs[plug] === 'number') return attrs[plug] * k;
    if (Array.isArray(attrs[plug]) && typeof attrs[plug][0] === 'number') return attrs[plug][0] * k;
    return (typeof info.default === 'number' ? info.default : 0) * k;
  }

  /** 配列の属性（prefix[n]）の、存在する要素の番号（接続とファイルの値から。小さい順） */
  defIndices(g, prefix) {
    const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.indices(g, new RegExp(`^${esc}\\[(\\d+)\\]`));
  }

  // ------------------------------------------------------------------ 計算ノード
  outputs(id) {
    return this.memo(this.cache.out, this.keep.out, id, () => this.outputsUncached(id), NULL, () => `out ${id}`);
  }

  /** よく使う種類の計算ノードの出力（outputsUncached の先に振り分ける）。それ以外の種類は NOT_COMMON */
  outputsCommon(id, g) {
    let o = null;
    switch (g.type) {
      case 'unitConversion': o = { o: this.num(id, 'i') * this.num(id, 'cf', 1) }; break;
      case 'multMatrix': {
        // Maya の o = i[0] · i[1] · …（行ベクトル）は、three.js では … · i[1] · i[0]
        const out = new Matrix4();
        for (const i of this.indices(g, /^i\[(\d+)\]$/)) out.premultiply(this.mat(id, `i[${i}]`));
        o = { o: out };
        break;
      }
      case 'decomposeMatrix': {
        // Maya と同じ分け方（せん断を分けてから回転にする。鏡に映した行列は Z のスケールを負にする（MTransformationMatrix。
        // コンストレイントの 3 軸とは違う）。角度は 0 に近い方）
        // 途中の値（_dc*）は使い回すので、入力はすべて先に読む（読むと、ほかの decomposeMatrix を計算して書き換えることがある）
        const m = this.mat(id, 'imat'), ro = Math.round(this.num(id, 'ro', 0));
        const { t, q, s, sh } = decomposeMaya(m, _dcT, _dcQ, _dcS, _dcSh, 'z');
        const e = mayaEuler(q, ro);
        // 出力は決まった名前なので、1 つのオブジェクトリテラルで作る（よく使うノード。形が毎回同じで速い）
        o = {
          ot: [t.x, t.y, t.z], otx: t.x, oty: t.y, otz: t.z,
          or: e, orx: e[0], ory: e[1], orz: e[2],
          os: [s.x, s.y, s.z], osx: s.x, osy: s.y, osz: s.z,
          osh: [sh.x, sh.y, sh.z], oshx: sh.x, oshy: sh.y, oshz: sh.z,
          oq: [q.x, q.y, q.z, q.w], oqx: q.x, oqy: q.y, oqz: q.z, oqw: q.w,
        };
        break;
      }
      case 'composeMatrix': {
        const t = this.vec(id, 'it'), r = this.vec(id, 'ir'), s = this.vec(id, 'is', [1, 1, 1]);
        const sh = this.vec(id, 'ish');                     // せん断（inputShear）も入れる
        let q;
        if (this.num(id, 'uer', 1) >= 0.5) {
          // 回転順は .ro（Maya の技術資料。古いサンプルの .iro も読む）
          const ro = this.num(id, this.attrName(this.byId.get(id), ['ro', 'iro']), 0);
          // 途中の値（_cpQ・_cpE）は使い回すので、入力はすべて先に読んである（このあとは属性を読まない）
          q = _cpQ.setFromEuler(_cpE.set(r[0], r[1], r[2], THREE_ORDER[Math.round(ro)] || 'ZYX'));
        } else {
          const v = this.vec(id, 'iq', [0, 0, 0, 1]);
          q = new Quaternion(v[0], v[1], v[2], v[3] ?? 1).normalize();
        }
        o = { omat: composeMaya(t, q, s, sh) };
        break;
      }
      case 'inverseMatrix': o = { omat: this.mat(id, 'imat').clone().invert() }; break;
      // アニメーションレイヤー: 下のレイヤーまでの値（ia）にこのレイヤーの値（ib）をウェイトで重ねる
      case 'animBlendNodeAdditiveDL': case 'animBlendNodeAdditiveDA': case 'animBlendNodeAdditive':
      case 'animBlendNodeAdditiveF': case 'animBlendNodeAdditiveFL': case 'animBlendNodeAdditiveFA':
      case 'animBlendNodeTime':
        o = { o: this.num(id, 'ia', 0) * this.num(id, 'wa', 1) + this.num(id, 'ib', 0) * this.num(id, 'wb', 1) };
        break;
      case 'animBlendNodeAdditiveI16': case 'animBlendNodeAdditiveI32':
        o = { o: Math.round(this.num(id, 'ia', 0) * this.num(id, 'wa', 1) + this.num(id, 'ib', 0) * this.num(id, 'wb', 1)) };
        break;
      case 'animBlendNodeAdditiveScale': {
        // かけ算で重ねる（acm 1。レイヤーの .sam の既定）: ia^wa · ib^wb。足し算（acm 0）: ia · wa + ib · wb
        // （Maya の技術資料の式。Override のレイヤーは wa（背面のウェイト）で下のレイヤーを弱める）
        const ia = this.num(id, 'ia', 0), ib = this.num(id, 'ib', 0), wa = this.num(id, 'wa', 1), wb = this.num(id, 'wb', 1);
        o = { o: this.num(id, 'acm', 0) >= 0.5 ? weightedPow(ia, wa) * weightedPow(ib, wb) : ia * wa + ib * wb };
        break;
      }
      case 'animBlendNodeBoolean': case 'animBlendNodeEnum':
        // 足し合わせられない型: ウェイトが 0 でなければこのレイヤーの値、0 なら下のレイヤーまでの値（Maya の技術資料）
        o = { o: this.num(id, 'wb', 1) > 0 ? this.num(id, 'ib', 0) : this.num(id, 'ia', 0) };
        break;
      case 'animBlendNodeAdditiveRotation': {
        // 成分ごとに読む（vec と同じ値。3 つ組を読むと成分を読んで配列を作り直すので、よく使うノードでは直接読む）
        const wa = this.num(id, 'wa', 1), wb = this.num(id, 'wb', 1);
        const ax = this.num(id, 'iax', 0), ay = this.num(id, 'iay', 0), az = this.num(id, 'iaz', 0);
        const bx = this.num(id, 'ibx', 0), by = this.num(id, 'iby', 0), bz = this.num(id, 'ibz', 0);
        let x, y, z;
        if (this.num(id, 'acm', 0) >= 0.5) {
          // レイヤーごと（.ram 1）: クォータニオンで重ねる（入力の値はすべて先に読んである）
          [x, y, z] = layerRotation([ax, ay, az], [bx, by, bz], wa, wb, Math.round(this.num(id, 'ro', 0)));
        } else {
          // 成分ごと（.ram 0。Maya の既定）: ia · wa + ib · wb
          x = ax * wa + bx * wb; y = ay * wa + by * wb; z = az * wa + bz * wb;
        }
        o = { o: [x, y, z], ox: x, oy: y, oz: z };
        break;
      }
      default: return NOT_COMMON;
    }
    return o;
  }

  /**
   * アニメーションレイヤーの出力（Maya の技術資料・ユーザーガイド。保存されたシーンの値で確かめた）。
   * ミュート .omte: 自分のミュート .mt・親のミュート .pmte・兄弟がソロでこのレイヤーはソロでない（.sslo かつ .sl でない）。
   * 子のレイヤーへは .omte → .pmte、.fgwt → .pwth、.csol → .sslo とつながる。
   * 前面のウェイト .fgwt（古いサンプルの .fo も）: ミュートなら 0、それ以外はウェイト .wgth × 親のウェイト .pwth。
   * 背面のウェイト .bgwt（blend ノードの wa）: 足し算のレイヤーとミュートしたレイヤーは 1。Override は、Passthrough
   * （.pthg）なら 1 − 前面のウェイト（下のレイヤーと混ぜる）、そうでなければ 0（下のレイヤーは見えない）
   */
  animLayer(g) {
    const id = g.id;
    const soloOut = this.num(id, 'sslo', 0) >= 0.5 && this.num(id, 'sl', 0) < 0.5;
    const muted = this.num(id, this.attrName(g, ['mt', 'm']), 0) >= 0.5 || this.num(id, 'pmte', 0) >= 0.5 || soloOut;
    const fg = muted ? 0 : this.num(id, this.attrName(g, ['wgth', 'w']), 1) * this.num(id, 'pwth', 1);
    let bg = 1;
    if (!muted && this.num(id, 'ovrd', 0) >= 0.5) bg = this.num(id, 'pthg', 1) >= 0.5 ? 1 - fg : 0;
    // 子のレイヤーのどれかがソロ（.chsl[i] ← 子の .sl）
    let csol = 0;
    for (const k of new Set([...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})])) {
      if (/^chsl\[\d+\]$/.test(k) && this.num(id, k, 0) >= 0.5) { csol = 1; break; }
    }
    return { fgwt: fg, fo: fg, bgwt: bg, omte: muted ? 1 : 0, oram: this.num(id, 'ram', 0), csol };
  }

  outputsUncached(id) {
    const g = this.byId.get(id);
    if (g.def) return this.defOutputs(g);
    // よく使う種類は、小さな関数で先に振り分ける（大きな振り分けは種類の名前を上から順に比べるので、後ろの種類ほど遅い）
    const common = this.outputsCommon(id, g);
    if (common !== NOT_COMMON) return common;
    let o = null;
    switch (g.type === 'distanceBetweenDL' ? 'distanceBetween' : g.type) {
      case 'multiplyDivide': o = this.multiplyDivide(id); break;
      case 'plusMinusAverage': o = this.plusMinusAverage(id); break;
      case 'reverse': o = expand('o', this.vec(id, 'i').map((x) => 1 - x), XYZ); break;
      case 'condition': o = this.condition(id); break;
      case 'blendColors': o = this.blendColors(id); break;
      case 'pairBlend': o = this.pairBlend(id); break;
      case 'pointConstraint': case 'orientConstraint': case 'parentConstraint':
      case 'scaleConstraint': case 'poleVectorConstraint': case 'aimConstraint': case 'lookAt':
        o = this.constraint(g);
        break;
      case 'distanceDimShape': {
        // 距離の寸法: 開始点（.startPoint）と終了点（.endPoint。ふつうはロケーターの worldPosition）の距離
        const p = (names) => new Vector3(...this.vec(id, this.attrName(g, names)));
        const d = p(['sp', 'startPoint']).distanceTo(p(['ep', 'endPoint']));
        o = { dist: d, distance: d };
        break;
      }
      case 'fourByFourMatrix': {
        // 16 個の数（i00〜i33 = 行・列。長い名前は in00〜in33）を、Maya の行の順に並べた行列。既定値は単位行列
        const v = [];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const x = this.plug(id, `i${r}${c}`) ?? this.plug(id, `in${r}${c}`);
            v.push(typeof x === 'number' ? x : (r === c ? 1 : 0));
          }
        }
        const m = new Matrix4().fromArray(v);
        o = { o: m, output: m };
        break;
      }
      case 'quatToEuler': {
        o = expand('ort', mayaEuler(this.quat(id, 'iq').normalize(), this.order(id, 'iro')), XYZ);
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
      case 'multDoubleLinear': o = { o: this.num(id, 'i1', 0) * this.num(id, 'i2', 0) }; break;
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
        const no = this.num(id, 'no', 0) >= 0.5;
        if (op === 1) {
          // 内積で normalizeOutput がオンなら、入力を正規化してからの内積（角度の cos。-1〜1）。長さ 0 のベクトルは 0。
          // 出典: Autodesk Maya ノードの技術資料「vectorProduct」（normalizeOutput の説明）
          const d = no ? a.clone().normalize().dot(b.clone().normalize()) : a.dot(b);
          r = new Vector3(d, d, d);
        } else if (op === 2) r = a.clone().cross(b);
        else if (op === 3) r = a.clone().applyMatrix3(new Matrix3().setFromMatrix4(this.mat(id, 'm')));   // 移動を除く
        else if (op === 4) r = a.clone().applyMatrix4(this.mat(id, 'm'));
        else r = a.clone();
        if (no && op !== 1) r.normalize();
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
      case 'character': {
        // キャラクターセット: カーブが直接つながる属性はそのまま（plugUncached で先に返る）。
        // Trax のクリップがあれば、いまのフレームで有効なクリップの値。なければファイルの値
        o = {};
        // （角度の値 av[i] のファイルの値は度。ほかの角度の出力と同じくラジアンにする）
        for (const [k, v] of Object.entries(g.attrs || {})) if (OUTPUTS.character.test(k)) o[k] = /^av\[/.test(k) ? v * D2R : v;
        if (g.trax) this.varying = true;
        if (g.trax) Object.assign(o, evaluateTrax(g.trax, this.frame, this.clip.curves, (c, v) => (c.type === 'TA' ? v * D2R : v)));
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
      case 'animLayer': o = this.animLayer(g); break;
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
      case 'transformGeometry': {
        // 入力のカーブの CV に行列を掛ける（Maya の行ベクトルの p · txf。invertTransform なら逆行列）
        const c = this.plug(id, 'ig');
        if (!c || !c.isCurve) { o = null; break; }
        const m = this.mat(id, 'txf').clone();
        if (this.num(id, 'itf', 0) >= 0.5) m.invert();
        o = { og: withCvs(c, c.cvs.map((p) => p.clone().applyMatrix4(m))) };
        break;
      }
      // カーブのヒストリ（入力の形が動く・属性が接続されているもの。動かないものは読み込みで焼き付ける）。
      // 計算は curve.js（読み込みの ma_viewer/nurbs.py と同じ手順）
      case 'rebuildCurve': {
        const c = this.plug(id, 'ic');
        const keepCvs = this.num(id, 'kcp', 0) >= 0.5;
        if (!c || !c.isCurve || (Math.round(this.num(id, 'rt', 0)) !== 0 && !keepCvs)) { o = null; break; }   // uniform だけ
        o = { oc: rebuildCurve(c, {
          spans: this.num(id, 's', 4), degree: this.num(id, 'd', 3), keepRange: Math.round(this.num(id, 'kr', 1)),
          multipleEnds: this.num(id, 'end', 0) >= 0.5, keepEndPoints: this.num(id, 'kep', 1) >= 0.5,
          keepTangents: this.num(id, 'kt', 1) >= 0.5, keepCvs,
        }) };
        break;
      }
      case 'reverseCurve': {
        const c = this.plug(id, 'ic');
        o = c && c.isCurve ? { oc: reverseCurve(c) } : null;
        break;
      }
      case 'subCurve': {
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve || c.form === 2) { o = null; break; }
        const [lo, hi] = domain(c);
        const mn = this.num(id, 'min', 0), mx = this.num(id, 'max', -1);
        const [a, b] = this.num(id, 'r', 0) >= 0.5 ? [lo + (hi - lo) * mn, lo + (hi - lo) * mx] : [mn, mx < mn ? hi : mx];
        o = { oc: curveSegment(c, a, b) };
        break;
      }
      case 'detachCurve': {
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve || c.form === 2) { o = null; break; }
        const [lo, hi] = domain(c);
        const cuts = [lo, ...this.indices(g, /^p\[(\d+)\]$/).map((k) => this.num(id, `p[${k}]`, 0)), hi];
        o = {};
        for (let k = 0; k + 1 < cuts.length; k++) {
          if (this.num(id, `k[${k}]`, 1) < 0.5) continue;              // 残さない部分（keep）
          o[`oc[${k}]`] = curveSegment(c, cuts[k], cuts[k + 1]);
        }
        break;
      }
      case 'nearestPointOnCurve': {
        // 入力の点（.ip）にいちばん近いカーブ（.ic）上の点（.p）とパラメータ（.pr）
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve) { o = null; break; }
        const u = nearestParam(c, new Vector3(...this.vec(id, 'ip')));
        const p = pointAt(c, u).toArray();
        o = expandInto({ pr: u, parameter: u, position: p, positionX: p[0], positionY: p[1], positionZ: p[2] }, 'p', p, XYZ);
        break;
      }
      default: {
        const mk = mathKind(g.type);                             // 新しい計算ノード・行列ノード（mathNodes.js）
        if (mk) o = evaluateMath(this, g, mk);
        break;
      }
    }
    return o;
  }

  /** wire の入力 k のカーブ（ワールド空間の CV）と、ワールド行列（変形するカーブの transform） */
  wireInput(g, k) {
    const c = this.plug(g.id, `ip[${k}].ig`);
    if (!c || !c.isCurve) return null;
    const gp = (g.geom || {})[k];
    const Wg = gp >= 0 ? this.world(gp) : IDENTITY;
    return { curve: c, Wg, world: c.cvs.map((p) => p.clone().applyMatrix4(Wg)) };
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
    // 回転の効きは .ro（Maya の技術資料。古いサンプルの .rot も読む）
    const en = this.num(id, 'en', 1), rot = this.num(id, this.attrName(g, ['ro', 'rot']), 1);
    const out = {};
    for (const k of this.indices(g, /^ip\[(\d+)\]\.ig$/)) {
      const c = this.plug(id, `ip[${k}].ig`);
      if (!c || !c.isCurve) continue;
      const gp = (g.geom || {})[k];
      const Wg = gp >= 0 ? this.world(gp) : IDENTITY;
      const WgInv = Wg.clone().invert();
      const attrs = g.attrs || {};
      const only = this.maskOf(g, k);
      const cvs = c.cvs.map((local, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const weight = (typeof wv === 'number' ? wv : 1) * en;
        if (!wires.length || Math.abs(weight) < EPS || (only && !only.has(v))) return local.clone();
        const p = local.clone().applyMatrix4(Wg);
        const disp = new Vector3();
        for (const { pb, pw, dds, sc } of wires) {
          const { d, j: bj, t: bt } = closestOnPolyline(pb, p);
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

  /** コンポーネントタグか groupParts の .inputComponents で選んだ、入力 k の変形する CV の番号（Set）。選んでいなければ null（すべて） */
  maskOf(g, k) {
    const list = (g.mask || {})[k];
    if (!Array.isArray(list)) return null;
    let sets = this.derived.maskSets.get(g);
    if (!sets) this.derived.maskSets.set(g, sets = {});
    if (!sets[k]) sets[k] = new Set(list);
    return sets[k];
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
      const only = this.maskOf(g, k);
      const cvs = c.cvs.map((p, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const w = (typeof wv === 'number' ? wv : 1) * en;
        if (only && !only.has(v)) return p.clone();
        return Math.abs(w) < EPS ? p.clone() : p.clone().lerp(p.clone().applyMatrix4(M), w);
      });
      out[`og[${k}]`] = withCvs(c, cvs);
      if (!out.og) out.og = out[`og[${k}]`];
    }
    return out;
  }

  /**
   * pointOnCurveInfo: カーブ（ic）のパラメータ pr の点・接線・法線。turnOnPercentage（top）なら pr はパラメータの範囲を
   * 0〜1 にそろえた値（長さの割合ではない。カーブの伸び方によって点の間隔は変わる）。
   * 接線（t）はパラメータでの微分、法線（n）は 2 階微分の接線に垂直な成分（曲率の向き）。どちらも差分で求める
   */
  pointOnCurve(g) {
    const id = g.id;
    const c = this.plug(id, 'ic');
    if (!c || !c.isCurve) return null;
    const [u0, u1] = domain(c);
    let u = this.num(id, 'pr', 0);
    // turnOnPercentage: pr はパラメータの範囲を 0〜1 にそろえた値（Maya と同じ。長さの割合ではない）
    if (this.num(id, 'top', 0) >= 0.5) u = u0 + (u1 - u0) * Math.min(Math.max(u, 0), 1);
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
    const o = { cr };
    expandInto(o, 'p', p.toArray(), XYZ);
    expandInto(o, 't', t.toArray(), XYZ);
    expandInto(o, 'nt', tn.toArray(), XYZ);
    expandInto(o, 'n', n.toArray(), XYZ);
    expandInto(o, 'nn', n.clone().normalize().toArray(), XYZ);
    return expandInto(o, 'cc', cc.toArray(), XYZ);
  }

  /** remapValue: 入力を 0〜1 にして値のランプ（vl[i]: 位置 vp・値 fv・補間 vi）を引き、出力の範囲に戻す */
  remapValue(g) {
    const id = g.id;
    const lo = this.num(id, 'imn', 0), hi = this.num(id, 'imx', 1);
    const t = Math.abs(hi - lo) < 1e-12 ? 0 : (this.num(id, 'i', 0) - lo) / (hi - lo);
    const attrs = g.attrs || {};
    const pts = this.indices(g, /^vl\[(\d+)\]/).map((i) => {
      const whole = attrs[`vl[${i}]`];
      // 項目の名前は .vlp・.vlfv・.vli（Maya の技術資料）。古いサンプルの .vp・.fv・.vi も読む
      const get = (names, k, def) => {
        for (const name of names) {
          if ((g.inputs || {})[`vl[${i}].${name}`]) return this.num(id, `vl[${i}].${name}`, def);
          if (typeof attrs[`vl[${i}].${name}`] === 'number') return attrs[`vl[${i}].${name}`];
        }
        return Array.isArray(whole) && Number.isFinite(whole[k]) ? whole[k] : def;
      };
      return { p: get(['vlp', 'vp'], 0, 0), v: get(['vlfv', 'fv'], 1, 0), interp: Math.round(get(['vli', 'vi'], 2, 1)) };
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
    let compiled = this.derived.programs.get(g);
    if (compiled === undefined) {
      try {
        // 時間を読むか・入力の属性の名前は式で決まるので、最初の 1 回だけ求める
        compiled = { program: compileExpression(g.expr || ''), problem: null, time: TIME_RE.test(g.expr || ''), inAttr: [] };
      } catch (err) {
        compiled = { program: null, problem: err.message };
      }
      this.derived.programs.set(g, compiled);
    }
    if (!compiled.program) {
      this.problems.add(`expression ${g.name} を解釈できません: ${compiled.problem}`);
      return null;
    }
    if (compiled.time) this.varying = true;
    const inAttr = compiled.inAttr, id = g.id;
    let res;
    try {
      res = compiled.program.run({
        input: (k) => this.num(id, inAttr[k] || (inAttr[k] = `in[${k}]`), 0),
        frame: this.frame,
        time: this.frame / (this.clip.fps || 24),
      });
    } catch (err) {
      if (this.deepState.depth && mayOverflow(err)) throw err;  // スタックのあふれは deep がやり直す
      this.problems.add(`expression ${g.name}: ${err.message}`);
      return null;
    }
    const o = {};
    for (const [k, v] of res.out) if (Number.isFinite(v)) o[OUT_ATTR[k] || `out[${k}]`] = v;
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
    let weightsOf = this.derived.weightsOf.get(g);
    if (!weightsOf) {
      this.derived.weightsOf.set(g, weightsOf = new Map());
      for (const [v, i, w] of g.skin.weights) {
        if (!weightsOf.has(v)) weightsOf.set(v, []);
        weightsOf.get(v).push([i, w]);
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
    const only = this.maskOf(g, 0);
    const cvs = c.cvs.map((p, v) => {
      const list = weightsOf.get(v);
      if (!list || (only && !only.has(v))) return p.clone();
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
    return expandInto(expandInto({ o1: combine(one) }, 'o2', o2, XY), 'o3', o3, XYZ);
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
    const rotMode = Math.round(this.num(id, 'rm', 0));
    if (rotMode === 1 || rotMode === 2) {                  // 回転は入力 1（または 2）だけ
      or = (rotMode === 1 ? r1 : r2).slice();
    } else if (Math.round(this.num(id, 'ri', 0)) === 1) {        // 四元数で補間
      // 入力と出力の回転は、動かされるノードの回転順（.ro。Autodesk の技術資料「pairBlend」の rotateOrder）
      const order = THREE_ORDER[Math.round(this.num(id, 'ro', 0))] || 'ZYX';
      const quat = (r) => new Quaternion().setFromEuler(_e.set(r[0], r[1], r[2], order));
      const q = quat(r1).slerp(quat(r2), w);
      const e = new Euler().setFromQuaternion(q, order);
      or = [e.x, e.y, e.z];
    } else {
      // 回転のモードは .rm（3 軸に共通。Maya の技術資料）で、ここでは混ぜる（0）。
      // 古いサンプルの軸ごとの名前（.rxm など）があればそれを使う
      or = XYZ.map((ax, i) => {
        const own = `r${ax}m`;
        return pick(r1[i], r2[i], (g.inputs && g.inputs[own]) || (g.attrs && own in g.attrs) ? mode(own) : 0);
      });
    }
    return expandInto(expand('ot', ot, XYZ), 'or', or, XYZ);
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


// 種類ごとのファイルに分けたメソッド（RigEvaluator のメソッドのまま。整備計画の D5）
installMethods(RigEvaluator, ConstraintMethods);
installMethods(RigEvaluator, IkMethods);
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

/**
 * 3 ボーン以上の IK の解き方（CHAIN_SOLVERS）。'fabrik': FK の形から、面の上で FABRIK（反復）で解く（既定）。
 * 'preferred': 優先角（.pa）の形から、関節ごとの曲がりの比を保ったまま曲がり具合だけを変えて届かせる（solveChainPreferred）
 */
export const CHAIN_SOLVERS = ['fabrik', 'preferred'];

/** 3 本以上のジョイントの IK（回転プレーン・シングルチェーン）: 面の上で FABRIK を解く */
export function solveChain(ev, id) {
  if (ev.chainSolver === 'preferred') return solveChainPreferred(ev, id);
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

/**
 * 3 ボーン以上の IK（優先角から曲げる。オプション）。FK の値によらず、毎回同じ形（優先角の形）から解く:
 *   1. 優先角（.pa。ファイルになければ Maya の既定値 0）で組んだ形を基準にする
 *   2. 基準の形が曲がっている面（開始 → 終端の軸と、途中のジョイントのずれの側）の法線のまわりで、途中の各ジョイントの
 *      曲がる角度を、同じ倍率 k で増やす・減らす（関節ごとの曲がりの比を保つ）。まっすぐな形は、どのジョイントも同じ角度で曲げる
 *   3. 開始から終端までの距離がハンドルまでの距離になる k を探す（k = 0 がいちばん伸びた形。届かなければ k = 0）
 *   4. 形を丸ごと回して、終端をハンドルの方へ、曲がる側を極ベクトル（＋ひねり）の側へ向ける。シングルチェーンは
 *      最短の回転でハンドルの方へ向ける（曲がる側は基準の形のまま）
 */
export function solveChainPreferred(ev, id) {
  const g = ev.byId.get(id);
  const chain = g.ik.chain;
  if (chain.some((ni) => !ev.rest(ni))) return null;
  const n = chain.length;
  // 1. 優先角の形（ワールド）
  const P = ev.parentWorld(chain[0]);
  const W = [];
  let m = P;
  chain.forEach((ni, i) => {
    let c;
    if (i === n - 1) c = ev.chan(ni, 't');
    else {
      const node = ev.dagGraph.get(ni);
      const pa = node && node.attrs && Array.isArray(node.attrs.pa) ? node.attrs.pa : [0, 0, 0];
      c = { ...ev.chan(ni, 'fk'), r: pa };
    }
    m = new Matrix4().multiplyMatrices(m, composeLocalMatrix(c, ev.isScaleOf(ni), new Matrix4()));
    W.push(m);
  });
  const pos = W.map((w) => positionOf(w));
  const bones = [];
  for (let i = 0; i < n - 1; i++) bones.push(new Vector3().subVectors(pos[i + 1], pos[i]));
  const total = bones.reduce((t, b) => t + b.length(), 0);
  if (bones.some((b) => b.length() < EPS)) return null;
  const A = pos[0];
  const H = positionOf(ev.world(g.dag));
  const u = new Vector3().subVectors(H, A);
  const dist = u.length();
  if (dist < EPS) return null;
  u.divideScalar(dist);
  const rp = g.ik.solver === 'ikRPsolver';
  // 極ベクトルの側（ハンドルの方向に垂直な成分。ひねりで回す）
  let side = null;
  if (rp) {
    const pv = ev.pvWorld(ev.vec(id, 'pv', [0, 0, 1]), g.dag, chain[0]);
    side = pv.addScaledVector(u, -pv.dot(u));
    if (ev.ikVariant && ev.ikVariant.side === -1) side.negate();
    if (side.lengthSq() < EPS) side = null;
  }
  // 2. 曲がる面: 軸（開始 → 終端）と、途中のジョイントの軸からのずれの和の側。まっすぐなら極ベクトルの側
  let axis = new Vector3().subVectors(pos[n - 1], A);
  if (axis.lengthSq() < EPS) axis = bones[0].clone();
  axis.normalize();
  const off = new Vector3();
  for (let i = 1; i < n - 1; i++) {
    const v = new Vector3().subVectors(pos[i], A);
    off.add(v.addScaledVector(axis, -v.dot(axis)));
  }
  let bendSide = off.lengthSq() > EPS * total * total ? off.clone() : null;
  if (!bendSide && side) bendSide = side.clone().addScaledVector(axis, -side.dot(axis));
  if (!bendSide || bendSide.lengthSq() < EPS) {
    bendSide = new Vector3(0, 1, 0).cross(axis);
    if (bendSide.lengthSq() < EPS) bendSide = new Vector3(1, 0, 0).cross(axis);
  }
  bendSide.normalize();
  const nrm = new Vector3().crossVectors(axis, bendSide).normalize();   // このまわりの正の回転で、軸が曲がる側へ向く
  // 途中の各ジョイントの曲がる角度（nrm のまわり、符号つき）
  const rest = [];
  for (let i = 1; i < n - 1; i++) {
    rest.push(Math.atan2(nrm.dot(new Vector3().crossVectors(bones[i - 1], bones[i])), bones[i - 1].dot(bones[i])));
  }
  const maxAbs = rest.reduce((t, a) => Math.max(t, Math.abs(a)), 0);
  const straight = maxAbs < 1e-6;
  // 倍率 k のときの角度: 曲がった形は rest × k（k = 1 が基準の形）、まっすぐな形は、どのジョイントも -k（曲がる側へ）
  // ボーン i の基準からの回転 = 途中のジョイント 1..i の角度の変化の和
  const turnsAt = (k) => {
    const out = [0];
    let sum = 0;
    for (let i = 1; i < n - 1; i++) {
      sum += straight ? -k : rest[i - 1] * (k - 1);
      out.push(sum);
    }
    return out;
  };
  const endAt = (k) => {
    const t = turnsAt(k);
    const e = new Vector3();
    for (let i = 0; i < n - 1; i++) e.add(bones[i].clone().applyAxisAngle(nrm, t[i]));
    return e;
  };
  const reach = (k) => endAt(k).length();
  // 3. 届く距離になる倍率を探す（k = 0 から、どこかの関節が半回転するまで。最初に届いたところを二分法で詰める）
  const kMax = straight ? Math.PI : Math.PI / maxAbs;
  let k = 0;
  if (reach(0) > dist) {
    const STEPS = 96;
    let prev = 0, best = 0, bestErr = Infinity, found = false;
    for (let s = 1; s <= STEPS && !found; s++) {
      const kk = (kMax * s) / STEPS;
      const r = reach(kk);
      if (Math.abs(r - dist) < bestErr) { bestErr = Math.abs(r - dist); best = kk; }
      if (r <= dist) {
        let lo = prev, hi = kk;
        for (let it = 0; it < 50; it++) {
          const mid = (lo + hi) / 2;
          if (reach(mid) > dist) lo = mid; else hi = mid;
        }
        k = (lo + hi) / 2;
        found = true;
      }
      prev = kk;
    }
    if (!found) k = best;
  }
  const turns = turnsAt(k);
  const end = endAt(k);
  // 4. 形を丸ごと回す: 終端の向き x0 → u。曲がる側は、RP なら極ベクトルの側、SC なら最短の回転
  const x0 = end.lengthSq() > EPS ? end.clone().normalize() : axis.clone();
  let R;
  if (rp) {
    let v = side ? side.clone() : null;
    if (!v) {
      const sd = new Vector3().crossVectors(nrm, x0).applyQuaternion(new Quaternion().setFromUnitVectors(x0, u));
      v = sd.addScaledVector(u, -sd.dot(u));
    }
    const twist = ev.num(id, 'twi', 0) * ev.twistSign();
    if (Math.abs(twist) > EPS) v.applyQuaternion(new Quaternion().setFromAxisAngle(u, twist));
    v.normalize();
    // 解いた形の曲がる側は nrm × x0。（向き, 曲がる側）の組を（u, v）へ
    const sd0 = new Vector3().crossVectors(nrm, x0).normalize();
    const basis = (a, b) => new Matrix4().makeBasis(a, b, a.clone().cross(b));
    R = new Quaternion().setFromRotationMatrix(basis(u, v).multiply(basis(x0, sd0).transpose()));
  } else {
    R = new Quaternion().setFromUnitVectors(x0, u);
  }
  // ジョイントのワールドの回転 = 全体の回転 × 面の法線のまわりの回転 × 優先角の形の回転
  const Q = [];
  for (let i = 0; i < n - 1; i++) {
    Q.push(R.clone().multiply(new Quaternion().setFromAxisAngle(nrm, turns[i])).multiply(rotationOf(W[i])));
  }
  return ikLocals(ev, id, chain, P, Q);
}

// 種類ごとのファイル（rigConstraints.js など）が使う、このファイルの定数・作業用のオブジェクト・補助関数
export { D2R, R2D, EPS, XYZ, IDENTITY, _m, _q, _v, rotationOf, positionOf, eulerQuat, radQuat, expand, expandInto };
export { AIM_MODES, IK_VARIANTS, NULL, variantLabel, closestOnPolyline };
