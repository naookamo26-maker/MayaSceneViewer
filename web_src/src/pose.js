// ポーズ確認用の姿勢変更（表示だけで、ファイルには保存しない）。
//
// ノードごとに「ファイル上の姿勢に対する追加分」D = 移動・回転・スケール を持ち、
//   ローカル行列 = 基準ローカル行列 · D        （列ベクトル規約）
// とする。D はノード自身のローカル軸が基準。
//
// 基準ローカル行列は通常ファイル上の値そのもの。ただし segmentScaleCompensate が有効な
// ジョイントの親にスケールの追加分があるときは、Maya と同じく
//   T · S⁻¹ · (平行移動を除いた残り)
// として、子の位置だけが伸びて子自身は拡大されないようにする。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { composeMaya, decomposeMaya, mayaEuler } from './animation.js';

const D2R = Math.PI / 180;
const MIN_SCALE = 1e-3;

const _e = new Euler();
const _q = new Quaternion();
const _p = new Vector3();
const _s = new Vector3();
const _m = new Matrix4();
const _rest = new Matrix4();
const _d = new Matrix4();

export function identityPose() {
  return { t: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] };
}

function clampScale(v) {
  if (!Number.isFinite(v)) return 1;
  return Math.abs(v) < MIN_SCALE ? (v < 0 ? -MIN_SCALE : MIN_SCALE) : v;
}

export function normalizePose(p) {
  const n = (a, d) => (Array.isArray(a) && a.length === 3 ? a.map((v) => (Number.isFinite(+v) ? +v : d)) : [d, d, d]);
  return { t: n(p && p.t, 0), r: n(p && p.r, 0), s: n(p && p.s, 1).map(clampScale) };
}

export function isIdentityPose(p, eps = 1e-9) {
  return p.t.every((v) => Math.abs(v) <= eps) && p.r.every((v) => Math.abs(v) <= eps)
    && p.s.every((v) => Math.abs(v - 1) <= eps);
}

/** 回転は度・回転順 XYZ（Maya と同じく X → Y → Z。three.js の Euler では 'ZYX'） */
export function poseQuaternion(p, target = new Quaternion()) {
  _e.set(p.r[0] * D2R, p.r[1] * D2R, p.r[2] * D2R, 'ZYX');
  return target.setFromEuler(_e);
}

export function poseMatrix(p, target = new Matrix4()) {
  return target.compose(_p.fromArray(p.t), poseQuaternion(p, _q), _s.fromArray(p.s));
}

/** Object3D の position / quaternion / scale から姿勢を作る（ハンドル操作の結果を読む） */
export function poseFromTransform(position, quaternion, scale) {
  _e.setFromQuaternion(quaternion, 'ZYX');
  return normalizePose({
    t: position.toArray(),
    r: [_e.x / D2R, _e.y / D2R, _e.z / D2R],
    s: scale.toArray(),
  });
}

const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const threeOrder = (ro) => (ROTATE_ORDERS[ro] || 'xyz').split('').reverse().join('').toUpperCase();
const degQuat = (v, ro = 0) => new Quaternion().setFromEuler(new Euler(v[0] * D2R, v[1] * D2R, v[2] * D2R, threeOrder(ro)));

/** 固定するチャンネル（{ t | r | s: [X, Y, Z] }）があるか */
export function hasFixed(fixed) {
  return !!fixed && ['t', 'r', 's'].some((k) => fixed[k] && fixed[k].some(Boolean));
}

/**
 * 追加分 pose を、Maya のチャンネルの一部を基準のまま固定したものにする（ロックした属性・キーのある属性）。
 * ローカル行列 L = base · D を Maya のチャンネルに分け（移動 = 親の空間の位置、回転 = jointOrient・rotateAxis を
 * 除いた回転の値（回転順 ro）、スケール = base のスケール × 追加分のスケール）、fixed の成分を base の値に戻し、
 * Maya と同じ T · R · S（せん断は base のもの）で組み直してから D を求め直す。すべて固定すれば D は単位
 * （base の軸ごとに違うスケールと追加分の回転が生む、Maya のチャンネルにないせん断は残さない）。
 * @param base 基準のローカル行列  @param fixed { t | r | s: [X, Y, Z] }（true の成分を固定）
 * @param frame { ro: 0〜5, jo: [度] | null, ra: [度] | null }（ノードの回転の値の分け方）
 */
export function fixChannels(base, pose, fixed, frame = {}) {
  if (!hasFixed(fixed)) return pose;
  const p = normalizePose(pose);
  const L = base.clone().multiply(poseMatrix(p, new Matrix4()));
  const db = decomposeMaya(base), dl = decomposeMaya(L);
  const on = (k, i) => !!(fixed[k] && fixed[k][i]);
  const t = dl.t.toArray(), sc = db.s.toArray().map((v, i) => v * p.s[i]);
  for (let i = 0; i < 3; i++) {
    if (on('t', i)) t[i] = db.t.getComponent(i);
    if (on('s', i)) sc[i] = db.s.getComponent(i);
  }
  let q = dl.q;
  if (fixed.r && fixed.r.some(Boolean)) {
    const ro = frame.ro || 0;
    const jo = frame.jo ? degQuat(frame.jo) : new Quaternion(), ra = frame.ra ? degQuat(frame.ra) : new Quaternion();
    const value = (qq) => jo.clone().invert().multiply(qq).multiply(ra.clone().invert());   // 回転の値の部分
    const eb = mayaEuler(value(db.q), ro);
    const el = mayaEuler(value(dl.q), ro, eb);
    for (let i = 0; i < 3; i++) if (on('r', i)) el[i] = eb[i];
    q = jo.clone().multiply(new Quaternion().setFromEuler(new Euler(el[0], el[1], el[2], threeOrder(ro)))).multiply(ra);
  }
  const L2 = composeMaya(t, q, sc, db.sh.toArray(), new Matrix4());
  const D = base.clone().invert().multiply(L2);
  const pos = new Vector3(), quat = new Quaternion(), scl = new Vector3();
  D.decompose(pos, quat, scl);
  return poseFromTransform(pos, quat, scl);
}

let poseVersion = 0;                       // 追加分を変えるたびに増やす（ほかの PoseState とも重ならない）

export class PoseState {
  /** @param built buildScene() の結果  @param data 共通 JSON */
  constructor(built, data) {
    this.built = built;
    this.data = data;
    this.poses = new Map();
    this.version = ++poseVersion;           // 追加分の版（リグの評価のキャッシュを捨てる目安）
  }

  has(ni) { return this.poses.has(ni); }

  get(ni) {
    const p = this.poses.get(ni);
    return p ? normalizePose(p) : identityPose();
  }

  get size() { return this.poses.size; }

  /** 追加分を除いた基準のローカル行列（親のスケール補正を含む） */
  restLocal(ni, target = new Matrix4()) {
    const obj = this.built.nodeObjects[ni];
    const base = obj.userData.baseMatrix;
    target.copy(base);
    const n = this.data.nodes[ni];
    const pi = n.parent;
    if (n.inheritsTransform === false || pi < 0) return target;
    // ジョイント（segmentScaleCompensate。親もジョイント）か、自作ノードの割り当てで親のスケールを打ち消すと指定したノード
    const joint = n.type === 'joint' && n.segmentScaleCompensate !== false && this.data.nodes[pi].type === 'joint';
    if (!joint && !n.compensatesParentScale) return target;
    const pp = this.poses.get(pi);
    if (!pp) return target;
    const s = pp.s;
    if (s[0] === 1 && s[1] === 1 && s[2] === 1) return target;
    const e = base.elements;
    const tx = e[12], ty = e[13], tz = e[14];
    _rest.copy(base);
    _rest.elements[12] = 0; _rest.elements[13] = 0; _rest.elements[14] = 0;
    _m.makeScale(1 / s[0], 1 / s[1], 1 / s[2]);
    target.multiplyMatrices(_m, _rest);
    target.elements[12] = tx; target.elements[13] = ty; target.elements[14] = tz;
    return target;
  }

  /** ノードの行列を「基準 · 追加分」にする */
  apply(ni) {
    const obj = this.built.nodeObjects[ni];
    this.restLocal(ni, obj.matrix);
    const p = this.poses.get(ni);
    if (p) obj.matrix.multiply(poseMatrix(p, _d));
  }

  /** 追加分を設定する。単位姿勢なら削除。直下の子（スケール補正の対象）も計算し直す */
  set(ni, pose) {
    const p = normalizePose(pose);
    if (isIdentityPose(p)) this.poses.delete(ni);
    else this.poses.set(ni, p);
    this.version = ++poseVersion;
    this.apply(ni);
    for (const c of this.built.childrenOf[ni]) this.apply(c);
  }

  reset(ni) { this.set(ni, identityPose()); }

  /** 基準の行列を切り替えたあと、すべてのノードに追加分を掛け直す */
  reapplyAll() {
    for (let i = 0; i < this.built.nodeObjects.length; i++) this.apply(i);
  }

  resetAll() {
    this.poses.clear();
    this.version = ++poseVersion;
    this.built.nodeObjects.forEach((o) => o.matrix.copy(o.userData.baseMatrix));
  }

  /**
   * ハンドルを置く基準フレーム（親のワールド行列 · 基準ローカル行列）。
   * この中に置いた代理オブジェクトのローカル変換が、そのまま追加分 D になる。
   * 呼ぶ前にシーンのワールド行列を更新しておくこと。
   */
  frameMatrix(ni, target = new Matrix4()) {
    const obj = this.built.nodeObjects[ni];
    return target.multiplyMatrices(obj.parent.matrixWorld, this.restLocal(ni, _m.clone()));
  }
}
