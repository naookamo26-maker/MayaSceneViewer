// NURBS カーブ（コントローラーの形・スプライン IK のカーブなど）の表示とピック。
// 線はカーブの transform（シーン階層のノード）の子に置くので、アニメーションやポーズ確認の動きにそのままついていく。
// リグで形が変わるカーブ（skinCluster・制御点の接続）は setShape() で形を差し替える。
import { BufferGeometry, Color, Float32BufferAttribute, Line, LineBasicMaterial, Vector3 } from 'three';
import { parseNurbsCurve, pointAt, domain, withCvs } from './curve.js';

export const CURVE_COLOR = new Color(0xd3d9e0);          // 色の指定がないカーブ（Maya の既定の濃紺は暗い背景で見えにくく、ジョイントの水色とも分ける）
const TEMPLATE_COLOR = new Color(0x80868d);              // テンプレート表示
const SELECT_COLOR = new Color(0xf2a93b);
const PER_SPAN = 16;                                     // 1 スパンあたりの折れ線の点の数

/** 共通 JSON の curves の 1 本からカーブ（.cc の形に .cp の調整を足したもの）。読めなければ null */
export function curveFromEntry(c) {
  const base = parseNurbsCurve(c.cc);
  if (!base) return null;
  if (!c.tweaks || !c.tweaks.length) return base;
  const cvs = base.cvs.map((v) => v.clone());
  for (const [i, x, y, z] of c.tweaks) if (cvs[i]) cvs[i].add(new Vector3(x, y, z));
  return withCvs(base, cvs);
}

/** 描画用の点の列（次数 1 は CV をそのまま結ぶ） */
export function curvePoints(curve, out = []) {
  out.length = 0;
  if (curve.degree === 1) {
    for (const p of curve.cvs) out.push(p.clone());
    return out;
  }
  const [u0, u1] = domain(curve);
  const count = Math.max(8, (curve.cvs.length - curve.degree) * PER_SPAN);
  for (let k = 0; k <= count; k++) out.push(pointAt(curve, u0 + (u1 - u0) * (k / count)));
  return out;
}

function toArray(points) {
  const arr = new Float32Array(points.length * 3);
  points.forEach((p, k) => { arr[k * 3] = p.x; arr[k * 3 + 1] = p.y; arr[k * 3 + 2] = p.z; });
  return arr;
}

export class CurveOverlay {
  constructor() {
    this.items = [];          // { entry, line, base（ファイルの形）, color, node }
    this.byNode = new Map();  // transform のノード番号 → items の番号の配列
    this.visible = true;
    this.hiddenNodes = null;
    this.selected = -1;
  }

  clear() {
    for (const it of this.items) {
      it.line.removeFromParent();
      it.line.geometry.dispose();
      it.line.material.dispose();
    }
    this.items = [];
    this.byNode = new Map();
    this.selected = -1;
  }

  build(built, curves) {
    this.clear();
    (curves || []).forEach((c, ci) => {
      const curve = curveFromEntry(c);
      const parent = built.nodeObjects[c.transform];
      if (!curve || !parent) return;
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(toArray(curvePoints(curve)), 3));
      const color = c.display === 1 ? TEMPLATE_COLOR : c.color ? new Color().setRGB(c.color[0], c.color[1], c.color[2]) : CURVE_COLOR;
      const line = new Line(geometry, new LineBasicMaterial({ color }));
      line.name = c.name;
      line.userData = { curveIndex: ci, nodeIndex: c.transform };
      line.matrixAutoUpdate = false;
      parent.add(line);
      const item = { entry: c, line, base: curve, color, node: c.transform, selfVisible: c.visibleSelf ?? c.visible !== false };
      this.items[ci] = item;
      if (!this.byNode.has(c.transform)) this.byNode.set(c.transform, []);
      this.byNode.get(c.transform).push(ci);
    });
    built.curveItems = this.items;            // 範囲の計算（computeBounds）に使う
    this.apply();
  }

  /** ci 番目のカーブの形を差し替える（null ならファイルの形に戻す） */
  setShape(ci, curve) {
    const it = this.items[ci];
    if (!it) return;
    const c = curve && curve.isCurve ? curve : it.base;
    if (it.current === c) return;
    it.current = c;
    const arr = toArray(curvePoints(c));
    const attr = it.line.geometry.getAttribute('position');
    if (attr.array.length === arr.length) {
      attr.array.set(arr);
      attr.needsUpdate = true;
    } else {
      it.line.geometry.setAttribute('position', new Float32BufferAttribute(arr, 3));
    }
    it.line.geometry.boundingSphere = null;
  }

  setVisible(v) { this.visible = v; this.apply(); }
  /** @param hidden 配列（nodeIndex → 非表示なら true）または null */
  setHiddenNodes(hidden) { this.hiddenNodes = hidden; this.apply(); }
  setSelected(ni) { this.selected = ni; this.apply(); }
  /** カーブを持つ（表示する）transform か。コントローラーの目印を出さないために使う */
  hasCurve(ni) { return this.byNode.has(ni); }

  isShown(it) {
    return this.visible && it.selfVisible && !(this.hiddenNodes && this.hiddenNodes[it.node]);
  }

  apply() {
    for (const it of this.items) {
      if (!it) continue;
      it.line.visible = this.isShown(it);
      it.line.material.color.copy(it.node === this.selected ? SELECT_COLOR : it.color);
    }
  }

  /** 表示中のカーブの点で箱を広げる（nodes を渡すと、その transform のカーブだけ） */
  expandBox(box, nodes = null) {
    for (const it of this.items) {
      if (!it || !it.line.visible || (nodes && !nodes.has(it.node))) continue;
      const pos = it.line.geometry.getAttribute('position');
      const step = Math.max(1, Math.floor(pos.count / 16));
      for (let k = 0; k < pos.count; k += step) box.expandByPoint(_v.fromBufferAttribute(pos, k).applyMatrix4(it.line.matrixWorld));
    }
    return box;
  }

  /** レイが当たった（近くを通る）カーブの transform のノード番号（なければ -1）。threshold はワールド空間の距離 */
  /** @param allow (共通 JSON の curves の 1 件) => 選べるか（Maya で選択できないカーブを除くときなど） */
  pick(raycaster, threshold, allow = () => true) {
    const lines = this.items.filter((it) => it && it.line.visible && allow(it.entry)).map((it) => it.line);
    if (!lines.length) return { node: -1, distance: Infinity };
    const saved = raycaster.params.Line.threshold;
    raycaster.params.Line.threshold = threshold;
    const hits = raycaster.intersectObjects(lines, false);
    raycaster.params.Line.threshold = saved;
    return hits.length ? { node: hits[0].object.userData.nodeIndex, distance: hits[0].distance } : { node: -1, distance: Infinity };
  }
}

const _v = new Vector3();
