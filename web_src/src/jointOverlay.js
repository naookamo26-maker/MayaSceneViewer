// ジョイントの表示（球・骨・ローカル軸）とピック。リグのコントローラーの目印（ControlOverlay）もまとめて扱う。
// 骨はシーン階層とは別のオーバーレイとして描くので、Maya 側で骨の親が非表示でも表示できる。
// ジョイントとコントローラーは別のグループに入れ、表示を別々に切り替える（Maya のジョイントとロケーターの表示と同じ）。
import {
  BufferGeometry, Color, DynamicDrawUsage, Float32BufferAttribute, Group, InstancedMesh,
  LineBasicMaterial, LineSegments, Matrix4, MeshBasicMaterial, Quaternion, SphereGeometry, Vector3,
} from 'three';
import { ControlOverlay } from './controlOverlay.js';

export const JOINT_COLOR = new Color(0x5ec8e5);
export const SELECT_COLOR = new Color(0xf2a93b);
export const ESTIMATED_COLOR = new Color(0xb9a6f2);     // バインドポーズの形で推定したノード
export const UNKNOWN_COLOR = new Color(0x6b737c);       // 値を求められないノード
const AXIS_COLORS = [new Color(0xe5675b), new Color(0x7fd16b), new Color(0x5b8ff0)];

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _dir = new Vector3();
const _up = new Vector3(0, 1, 0);
const _ident = new Quaternion();

/** Maya 風の骨: 根元から 10% の位置で太くなり、先端へ細くなる八面体 */
function boneGeometry() {
  const w = 1, h = 0.1;
  const v = [
    0, 0, 0, // 0 根元
    w, h, 0, 0, h, w, -w, h, 0, 0, h, -w, // 1..4 胴
    0, 1, 0, // 5 先端
  ];
  const idx = [0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 1, 4, 5, 1, 2, 5, 2, 3, 5, 3, 4, 5, 4, 1];
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(v, 3));
  g.setIndex(idx);
  return g;
}

export class JointOverlay {
  constructor() {
    this.group = new Group();
    this.group.name = '__jointOverlay';
    this.jointGroup = new Group();       // 球・骨・ローカル軸
    this.controlGroup = new Group();     // コントローラーの目印
    this.group.add(this.jointGroup, this.controlGroup);
    this.size = 1;
    this.xray = true;
    this.axesMode = 'selected';
    this.selected = -1;
    this.hiddenNodes = null;   // nodeIndex → true なら描かない（親を含めて非表示のノード）
    this.joints = [];
    this.links = [];
    this.slotOf = new Map();
    this.sphereGeo = new SphereGeometry(1, 14, 10);
    this.boneGeo = boneGeometry();
    this.sphereMat = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
    this.boneMat = new MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.9 });
    this.axesMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 });
    this.spheres = null;
    this.bones = null;
    this.axes = null;
    this.controls = [];        // コントローラーのノード番号
    this.ctrl = new ControlOverlay();
    this.controlGroup.add(this.ctrl.group);
    this.medianBone = 0;
    this.statusOf = null;      // (nodeIndex) => 'estimated' | 'unknown' | null
  }

  clear() {
    for (const o of [this.spheres, this.bones, this.axes]) {
      if (o) { this.jointGroup.remove(o); if (o.isLineSegments) o.geometry.dispose(); else o.dispose?.(); }
    }
    this.spheres = this.bones = this.axes = null;
    this.ctrl.clear();
    this.controls = [];
    this.statusOf = null;
    this.joints = [];
    this.links = [];
    this.slotOf = new Map();
    this.selected = -1;
  }

  /** @param built buildScene() の結果  @param nodes data.nodes */
  build(built, nodes, sceneRadius) {
    this.clear();
    this.built = built;
    this.nodes = nodes;
    this.joints = built.jointIndices.slice();
    this.joints.forEach((ni, k) => this.slotOf.set(ni, k));
    for (const ni of this.joints) {
      let p = nodes[ni].parent;
      while (p >= 0 && nodes[p].type !== 'joint') p = nodes[p].parent;
      if (p >= 0) this.links.push([p, ni]);
    }
    // 基準サイズ: 骨の長さの中央値の 12%（シーンが大きすぎる・小さすぎる場合に備えて上限あり）
    const lens = this.links.map(([p, c]) => _a.setFromMatrixPosition(built.nodeObjects[p].matrixWorld)
      .distanceTo(_b.setFromMatrixPosition(built.nodeObjects[c].matrixWorld))).filter((l) => l > 1e-9).sort((x, y) => x - y);
    const median = lens.length ? lens[lens.length >> 1] : 0;
    this.medianBone = median;
    this.baseSize = median > 0 ? Math.min(sceneRadius * 0.015, median * 0.12) : sceneRadius * 0.012;
    const nj = Math.max(1, this.joints.length);
    this.spheres = new InstancedMesh(this.sphereGeo, this.sphereMat, nj);
    this.spheres.count = this.joints.length;
    this.spheres.instanceMatrix.setUsage(DynamicDrawUsage);
    this.spheres.frustumCulled = false;
    const nl = Math.max(1, this.links.length);
    this.bones = new InstancedMesh(this.boneGeo, this.boneMat, nl);
    this.bones.count = this.links.length;
    this.bones.instanceMatrix.setUsage(DynamicDrawUsage);
    this.bones.frustumCulled = false;
    const ag = new BufferGeometry();
    ag.setAttribute('position', new Float32BufferAttribute(new Float32Array(nj * 18), 3).setUsage(DynamicDrawUsage));
    const col = new Float32Array(nj * 18);
    for (let k = 0; k < nj; k++) {
      for (let a = 0; a < 3; a++) {
        for (let e = 0; e < 2; e++) {
          const o = (k * 6 + a * 2 + e) * 3;
          col[o] = AXIS_COLORS[a].r; col[o + 1] = AXIS_COLORS[a].g; col[o + 2] = AXIS_COLORS[a].b;
        }
      }
    }
    ag.setAttribute('color', new Float32BufferAttribute(col, 3));
    this.axes = new LineSegments(ag, this.axesMat);
    this.axes.frustumCulled = false;
    this.jointGroup.add(this.bones, this.spheres, this.axes);
    this.applyXray();
    this.update();
  }

  applyXray() {
    for (const m of [this.sphereMat, this.boneMat, this.axesMat]) {
      m.depthTest = !this.xray;
      m.depthWrite = !this.xray;
      m.needsUpdate = true;
    }
    for (const o of [this.spheres, this.bones, this.axes]) if (o) o.renderOrder = this.xray ? 10 : 0;
    this.ctrl.setXray(this.xray);
  }

  /**
   * リグのコントローラー（ジョイント・メッシュ以外でリグを動かすノード）の目印を描く
   * @param list ノード番号  @param roles classifyControls() の結果  @param charRadius キャラクターの大きさ（骨がないときの基準）
   */
  setControllers(list, roles = new Map(), charRadius = 1) {
    this.controls = list.slice();
    const objs = this.built.nodeObjects;
    const pos = (ni) => _a.setFromMatrixPosition(objs[ni].matrixWorld);
    // ジョイントの骨の長さ: 親のジョイントまで（ルートは子までの平均）
    const parentLen = new Map(), childLens = new Map();
    for (const [p, c] of this.links) {
      const l = pos(p).distanceTo(_b.setFromMatrixPosition(objs[c].matrixWorld));
      parentLen.set(c, l);
      if (!childLens.has(p)) childLens.set(p, []);
      childLens.get(p).push(l);
    }
    const boneLen = (ni) => {
      const l = parentLen.get(ni);
      if (l > 1e-9) return l;
      const cs = (childLens.get(ni) || []).filter((x) => x > 1e-9);
      return cs.length ? cs.reduce((a, b) => a + b, 0) / cs.length : 0;
    };
    const nearestJoint = (p) => {
      let best = -1, bd = Infinity;
      for (const ni of this.joints) { const d = pos(ni).distanceToSquared(p); if (d < bd) { bd = d; best = ni; } }
      return best;
    };
    this.ctrl.build(this.controls, roles, { nodes: this.nodes, objs, boneLen, nearestJoint, medianBone: this.medianBone, charRadius });
    this.ctrl.setXray(this.xray);
    this.update();
  }

  /** コントローラーの色（'role' | 'side'）・大きさの基準（'bone' | 'screen'）・大きさの倍率・隠す役割 */
  setControlOptions(o) {
    if (o.color !== undefined) this.ctrl.setColorMode(o.color);
    if (o.sizeMode !== undefined) this.ctrl.setSizeMode(o.sizeMode);
    if (o.scale !== undefined) this.ctrl.setScale(o.scale);
    if (o.hiddenRoles !== undefined) this.ctrl.setHiddenRoles(o.hiddenRoles);
    this.updateControls();
  }

  /** 画面上で一定の大きさにするための、位置ごとの 1 ピクセルの長さ（null で使わない） */
  setPixelSize(fn) { this.ctrl.pixelAt = fn; }

  setXray(v) { this.xray = v; this.applyXray(); }
  setSize(v) { this.size = v; this.update(); }
  setAxesMode(v) { this.axesMode = v; this.update(); }
  setSelected(ni) { this.selected = ni; this.update(); }
  /** ジョイント（球・骨・ローカル軸）の表示 */
  setVisible(v) { this.jointGroup.visible = v; }
  /** コントローラーの目印の表示 */
  setControlsVisible(v) { this.controlGroup.visible = v; }
  /** 推定・不明のノードの色分け（null で解除） */
  setStatus(fn) { this.statusOf = fn; this.update(); }
  /** @param hidden 配列（nodeIndex → 非表示なら true）または null */
  setHiddenNodes(hidden) { this.hiddenNodes = hidden; this.update(); }

  radius() { return this.baseSize * this.size; }

  update() {
    if (!this.spheres) return;
    const objs = this.built.nodeObjects;
    const r = this.radius();
    const childOfSelected = new Set();
    this.links.forEach(([p, c], k) => { if (p === this.selected) childOfSelected.add(k); });

    const hidden = this.hiddenNodes;
    const isHidden = (ni) => !!(hidden && hidden[ni]);
    const baseColor = (ni, normal) => {
      const st = this.statusOf ? this.statusOf(ni) : null;
      return st === 'estimated' ? ESTIMATED_COLOR : st === 'unknown' ? UNKNOWN_COLOR : normal;
    };
    this.joints.forEach((ni, k) => {
      objs[ni].matrixWorld.decompose(_p, _q, _s);
      const rr = isHidden(ni) ? 0 : r;           // 非表示のジョイントは大きさ 0（ピックもされない）
      _m.compose(_p, _ident, _s.set(rr, rr, rr));
      this.spheres.setMatrixAt(k, _m);
      this.spheres.setColorAt(k, ni === this.selected ? SELECT_COLOR : baseColor(ni, JOINT_COLOR));
    });
    this.spheres.instanceMatrix.needsUpdate = true;
    if (this.spheres.instanceColor) this.spheres.instanceColor.needsUpdate = true;
    this.spheres.boundingSphere = null;

    this.links.forEach(([p, c], k) => {
      _a.setFromMatrixPosition(objs[p].matrixWorld);
      _b.setFromMatrixPosition(objs[c].matrixWorld);
      _dir.subVectors(_b, _a);
      const len = _dir.length();
      if (len < 1e-9 || isHidden(c)) {
        _m.makeScale(0, 0, 0);
      } else {
        _q.setFromUnitVectors(_up, _dir.multiplyScalar(1 / len));
        const w = Math.min(r * 0.75, len * 0.12);
        _m.compose(_a, _q, _s.set(w, len, w));
      }
      this.bones.setMatrixAt(k, _m);
      this.bones.setColorAt(k, childOfSelected.has(k) ? SELECT_COLOR : baseColor(c, JOINT_COLOR));
    });
    this.bones.instanceMatrix.needsUpdate = true;
    if (this.bones.instanceColor) this.bones.instanceColor.needsUpdate = true;
    this.bones.boundingSphere = null;

    // ローカル軸
    const pos = this.axes.geometry.attributes.position;
    const arr = pos.array;
    let n = 0;
    const axisLen = r * 4;
    const showAll = this.axesMode === 'all';
    const list = showAll ? this.joints : (this.axesMode === 'selected' && this.selected >= 0 ? [this.selected] : []);
    for (const ni of list) {
      if (isHidden(ni)) continue;
      const e = objs[ni].matrixWorld.elements;
      _p.set(e[12], e[13], e[14]);
      for (let a = 0; a < 3; a++) {
        _dir.set(e[a * 4], e[a * 4 + 1], e[a * 4 + 2]);
        const l = _dir.length() || 1;
        _dir.multiplyScalar(axisLen / l).add(_p);
        const o = (n * 6 + a * 2) * 3;
        arr[o] = _p.x; arr[o + 1] = _p.y; arr[o + 2] = _p.z;
        arr[o + 3] = _dir.x; arr[o + 4] = _dir.y; arr[o + 5] = _dir.z;
      }
      n++;
      if (n * 6 > arr.length / 3) break;
    }
    this.axes.geometry.setDrawRange(0, n * 6);
    pos.needsUpdate = true;
    // 描画対象がないオブジェクトは隠す（描画数 0 の警告を避ける）
    this.axes.visible = n > 0;
    this.spheres.visible = this.joints.length > 0;
    this.bones.visible = this.links.length > 0;

    this.updateControls();
  }

  /** コントローラーの目印だけを合わせる（画面上で一定の大きさのときは、視点が変わるたびに呼ぶ） */
  updateControls() {
    if (!this.spheres || !this.controls.length) return;
    const hidden = this.hiddenNodes;
    this.ctrl.update({
      selected: this.selected,
      selectColor: SELECT_COLOR,
      isHidden: (ni) => !!(hidden && hidden[ni]),
      statusColor: (ni) => {
        const st = this.statusOf ? this.statusOf(ni) : null;
        return st === 'estimated' ? ESTIMATED_COLOR : st === 'unknown' ? UNKNOWN_COLOR : null;
      },
    });
  }

  /** レイが当たったジョイント・コントローラーの nodeIndex（なければ -1）。表示していないほうは選ばない */
  pick(raycaster) {
    if (!this.spheres) return -1;
    if (this.jointGroup.visible && this.joints.length) {
      const hits = raycaster.intersectObject(this.spheres, false);
      if (hits.length && hits[0].instanceId !== undefined) return this.joints[hits[0].instanceId];
    }
    if (this.controlGroup.visible && this.controls.length) return this.ctrl.pick(raycaster.ray);
    return -1;
  }
}
