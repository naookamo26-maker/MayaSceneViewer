// 共通 JSON（maya-scene-lite）→ three.js のシーン。
// DOM に依存しないので Node.js 上でもテストできる。
import {
  BufferAttribute, BufferGeometry, Bone, Color, DetachedBindMode, DoubleSide, Float32BufferAttribute,
  Group, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Skeleton, SkinnedMesh, Sphere,
  Uint16BufferAttribute, Vector3, Box3,
} from 'three';
import { triangulatePolygons, buildWireIndex } from './geometry.js';
import { assignWeights, decodeSkin, effectiveWeight, listedSlots } from './weights.js';
import { cornerNormals } from './normals.js';
import { unpackMeshArrays } from './arrays.js';
import { enableEightInfluences, useEightInfluencesOnCpu } from './skinning8.js';

export const SCHEMA_NAME = 'maya-scene-lite';

export function validateScene(data) {
  if (!data || data.schema !== SCHEMA_NAME) throw new Error('対応していないデータ形式です（schema が maya-scene-lite ではありません）');
  if (!Array.isArray(data.nodes) || !Array.isArray(data.meshes)) throw new Error('nodes / meshes がありません');
}

/**
 * @returns {{
 *   root: Group, nodeObjects: Object3D[], meshes: MeshEntry[], jointIndices: number[],
 *   childrenOf: number[][], influenceUsage: Map<number, {mesh:number, slot:number}[]>
 * }}
 */
export function buildScene(data, options = {}) {
  validateScene(data);
  // バイナリの数値の配列（Python が pack_array で詰めたもの）を型付き配列に戻す
  for (const m of data.meshes) unpackMeshArrays(m);
  const root = new Group();
  root.name = '__mayaRoot';
  root.matrixAutoUpdate = false;

  const nodeObjects = data.nodes.map((n, i) => {
    const o = n.type === 'joint' ? new Bone() : new Group();
    o.name = n.name;
    o.matrixAutoUpdate = false;
    o.matrix.fromArray(n.matrix);
    o.userData = {
      nodeIndex: i, path: n.path, type: n.type,
      baseMatrix: o.matrix.clone(),                                         // いま基準にしている行列
      fileMatrix: o.matrix.clone(),                                         // ファイルの値（アニメーションでは現在のフレームの値）
      savedMatrix: o.matrix.clone(),                                        // 保存時の値（フレームによらない）
      bindMatrix: n.bindMatrix ? new Matrix4().fromArray(n.bindMatrix) : null,  // バインドポーズ
    };
    return o;
  });
  const childrenOf = data.nodes.map(() => []);
  data.nodes.forEach((n, i) => {
    const p = n.parent;
    if (p >= 0) childrenOf[p].push(i);
    // inheritsTransform が off のノードは親の変換を受けないのでルート直下に置く
    const parentObj = p >= 0 && n.inheritsTransform !== false ? nodeObjects[p] : root;
    parentObj.add(nodeObjects[i]);
  });
  root.updateMatrixWorld(true);

  const jointIndices = [];
  data.nodes.forEach((n, i) => { if (n.type === 'joint') jointIndices.push(i); });

  // マテリアル（Maya のマテリアルごとに 1 つ作り、メッシュ間で共有する）
  const materials = (data.materials || []).map((md, i) => makeSurfaceMaterial(md, i, 0, data.textures));
  const defaultMaterial = makeSurfaceMaterial(null, -1, 0, data.textures);
  const allMaterials = [defaultMaterial, ...materials];
  // UDIM のマテリアルは、タイルごとに別のマテリアルを作る（必要になったものだけ）
  const variants = new Map();
  const materialFor = (mi, tile) => {
    if (!(mi >= 0 && mi < materials.length)) return defaultMaterial;
    const base = materials[mi];
    if (!tile || !base.userData.udim) return base;
    const key = mi + ':' + tile;
    if (!variants.has(key)) {
      const v = makeSurfaceMaterial(data.materials[mi], mi, tile, data.textures);
      variants.set(key, v);
      allMaterials.push(v);
    }
    return variants.get(key);
  };

  const influenceUsage = new Map();
  const meshes = data.meshes.map((m, mi) => {
    const entry = buildMesh(m, mi, nodeObjects, materials, materialFor, options);
    if (entry.skin) {
      m.skin.influences.forEach((ni, slot) => {
        if (!influenceUsage.has(ni)) influenceUsage.set(ni, []);
        influenceUsage.get(ni).push({ mesh: mi, slot });
      });
    }
    return entry;
  });
  if (options.shareSkeletons !== false) shareSkeletons(meshes);
  if (options.frustumCulling !== false) {
    for (const e of meshes) setupFrustumCulling(e);
    buildCullGroups(meshes);
  }
  root.updateMatrixWorld(true);
  return { root, nodeObjects, meshes, jointIndices, childrenOf, influenceUsage, materials, defaultMaterial, allMaterials };
}

/**
 * 子を持たない表示用のオブジェクト（メッシュ・カーブの線）の行列の計算を軽くする（毎フレーム、数千〜数万個ある）。
 *   * 親に対する行列が単位行列なら、ワールド行列は親のワールド行列をコピーする（掛け算しない。結果は同じ）
 *   * 非表示のあいだは計算せず、「更新が必要」の印（matrixWorldNeedsUpdate）だけ付ける。three.js は印の付いたオブジェクトを
 *     次の描画の前に計算し直すので、表示に切り替えれば正しい行列になる。描画の前に行列を読むところは worldMatrixOf を使う。
 *     シーン全体をたどらずに描くとき（main.js の render）のために、印を付けたものを pendingLeaves に覚える（flushLeaves）
 * スキン付きメッシュ（DetachedBindMode）の bindMatrixInverse は bind で決まり変わらないので、計算し直さない
 */
const isIdentity = (e) => e[0] === 1 && e[5] === 1 && e[10] === 1 && e[15] === 1 && e[1] === 0 && e[2] === 0 && e[3] === 0
  && e[4] === 0 && e[6] === 0 && e[7] === 0 && e[8] === 0 && e[9] === 0 && e[11] === 0 && e[12] === 0 && e[13] === 0 && e[14] === 0;

export function installLeafUpdate(o) {
  o.leafUpdate = true;                                  // updateWorldList が同じ扱いをする印
  o.updateMatrixWorld = function updateMatrixWorld(force) {
    if (this.children.length) { Object3D.prototype.updateMatrixWorld.call(this, force); return; }   // あとから子を付けたとき
    if (!this.visible) { this.matrixWorldNeedsUpdate = true; pendingLeaves.add(this); return; }
    if (this.matrixWorldNeedsUpdate || force) {
      const p = this.parent;
      if (!p) this.matrixWorld.copy(this.matrix);
      else if (isIdentity(this.matrix.elements)) this.matrixWorld.copy(p.matrixWorld);
      else this.matrixWorld.multiplyMatrices(p.matrixWorld, this.matrix);
      this.matrixWorldNeedsUpdate = false;
    }
  };
  return o;
}

// ---------------------------------------------------------------------- フレームごとのワールド行列の計算（平らな一覧）
/**
 * 非表示のあいだ計算を後回しにした葉（installLeafUpdate・updateWorldList が覚える）。シーン全体をたどらずに描くときは、
 * 描画の前に flushLeaves で、表示になったものだけ計算する
 */
export const pendingLeaves = new Set();

/**
 * pendingLeaves のうち、表示になったものの行列を計算する（親のワールド行列は計算済みであること）。
 * 印が消えたもの（ほかで計算した）・シーンから外したものは忘れる
 */
export function flushLeaves() {
  for (const o of pendingLeaves) {
    if (!o.matrixWorldNeedsUpdate || !o.parent) { pendingLeaves.delete(o); continue; }
    if (!o.visible) continue;
    o.updateMatrixWorld();
    pendingLeaves.delete(o);
  }
}

/**
 * roots とその子孫を、親が先・子があとの順に並べた一覧（updateWorldList）。three.js の updateMatrixWorld(true) は木を
 * 再帰でたどるので、オブジェクトの数が多いと、掛け算よりたどる手間のほうが大きい。
 * list.ends[i]: i の子孫の範囲の終わり（i の子孫は i + 1 〜 ends[i] - 1）。list.auto[i]: 自分で行列を組み立てる
 * （matrixAutoUpdate。いつも計算し直す）。一覧を作ったあとに子を足したり外したりしたら、作り直すこと
 */
export function buildWorldList(roots) {
  const list = [], ends = [];
  const visit = (o) => {
    const i = list.length;
    list.push(o);
    ends.push(0);
    for (const c of o.children) visit(c);
    ends[i] = list.length;
  };
  for (const r of roots) visit(r);
  list.ends = Int32Array.from(ends);
  list.auto = Uint8Array.from(list, (o) => (o.matrixAutoUpdate ? 1 : 0));
  return list;
}

/**
 * 一覧（buildWorldList）のワールド行列を計算する（roots.updateMatrixWorld(true) と同じ結果。掛け算の順番も three.js の
 * multiplyMatrices と同じなので、ビット単位で同じ）。一覧の先頭の親のワールド行列は、計算済みであること
 */
export function updateWorldList(list) {
  updateWorldRange(list, 0, list.length);
}

/**
 * 一覧のうち、印（dirty[i]。ローカル行列が変わった）の付いたものとその子孫だけ計算する（ほかは前の計算のまま正しい）。
 * 自分で行列を組み立てるもの（list.auto）は、いつも計算する。印は消す。計算した数を返す
 */
export function updateWorldListDirty(list, dirty) {
  const ends = list.ends, auto = list.auto, n = list.length;
  let count = 0;
  for (let i = 0; i < n;) {
    if (dirty[i] || auto[i]) {
      const e = ends[i];
      updateWorldRange(list, i, e);
      dirty.fill(0, i, e);
      count += e - i;
      i = e;
    } else i++;
  }
  return count;
}

function updateWorldRange(list, from, to) {
  for (let i = from; i < to; i++) {
    const o = list[i];
    if (o.matrixAutoUpdate) o.updateMatrix();
    if (o.leafUpdate && !o.children.length) {
      // 子を持たない表示用のオブジェクト（installLeafUpdate と同じ）: 非表示なら「更新が必要」の印だけ。単位行列ならコピー
      if (!o.visible) { o.matrixWorldNeedsUpdate = true; pendingLeaves.add(o); continue; }
      const p = o.parent;
      if (!p) o.matrixWorld.copy(o.matrix);
      else if (isIdentity(o.matrix.elements)) o.matrixWorld.copy(p.matrixWorld);
      else mulInto(p.matrixWorld.elements, o.matrix.elements, o.matrixWorld.elements);
      o.matrixWorldNeedsUpdate = false;
      continue;
    }
    if (o.matrixWorldAutoUpdate !== false) {
      const p = o.parent;
      if (!p) o.matrixWorld.copy(o.matrix);
      else mulInto(p.matrixWorld.elements, o.matrix.elements, o.matrixWorld.elements);
    }
    o.matrixWorldNeedsUpdate = false;
  }
}

/** out = a · b（列優先の 4×4。three.js の Matrix4.multiplyMatrices と同じ式・同じ順番） */
function mulInto(a, b, out) {
  const a11 = a[0], a12 = a[4], a13 = a[8], a14 = a[12];
  const a21 = a[1], a22 = a[5], a23 = a[9], a24 = a[13];
  const a31 = a[2], a32 = a[6], a33 = a[10], a34 = a[14];
  const a41 = a[3], a42 = a[7], a43 = a[11], a44 = a[15];
  const b11 = b[0], b12 = b[4], b13 = b[8], b14 = b[12];
  const b21 = b[1], b22 = b[5], b23 = b[9], b24 = b[13];
  const b31 = b[2], b32 = b[6], b33 = b[10], b34 = b[14];
  const b41 = b[3], b42 = b[7], b43 = b[11], b44 = b[15];
  out[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  out[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  out[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  out[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
  out[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  out[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  out[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  out[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
  out[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  out[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  out[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  out[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
  out[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
  out[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
  out[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
  out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
}

// ---------------------------------------------------------------------- 視錐台カリング（画面の外のメッシュを描かない）
const _m4 = new Matrix4(), _w = new Matrix4(), _sph = new Sphere();

/**
 * 3x3 部分の拡大率の上限（球の半径に掛ける）。列が直交していれば最大の列の長さ（正確）、せん断があれば
 * フロベニウスノルム（必ず大きめ）
 */
export function scaleBound(m) {
  const e = m.elements;
  const ax = e[0], ay = e[1], az = e[2], bx = e[4], by = e[5], bz = e[6], cx = e[8], cy = e[9], cz = e[10];
  const la = ax * ax + ay * ay + az * az, lb = bx * bx + by * by + bz * bz, lc = cx * cx + cy * cy + cz * cz;
  const tol = 1e-6 * Math.max(la, lb, lc, 1e-30);
  const ortho = Math.abs(ax * bx + ay * by + az * bz) <= tol && Math.abs(ax * cx + ay * cy + az * cz) <= tol
    && Math.abs(bx * cx + by * cy + bz * cz) <= tol;
  return Math.sqrt(ortho ? Math.max(la, lb, lc) : la + lb + lc);
}

/**
 * メッシュを画面の外なら描かない（three.js の frustumCulled）。動かないメッシュは形の範囲で判定する（three.js のまま）。
 * スキン付きメッシュは、骨ごとに「その骨が影響する頂点を骨のローカル空間に移した球」を読み込み時に求めておき、
 * 判定のたびに各骨のいまのワールド行列で移した球を包む球で判定する（頂点はウェイトの合計が 1 の混ぜ合わせなので、
 * 必ずこの球の中に入る）。ウェイトの合計が 1 でない頂点があるメッシュ（正規化しない設定など）は、範囲を保証できない
 * ので判定しない（いつも描く）
 */
export function setupFrustumCulling(e) {
  for (const o of [e.staticMesh, e.staticWire]) if (o) o.frustumCulled = true;
  if (!e.skinned) return;
  e.skinCull = buildSkinCull(e);
  for (const o of [e.skinned, e.skinnedWire]) {
    if (!o) continue;
    o.frustumCulled = true;
    o.intersectsFrustum = function intersectsFrustum(frustum) {
      if (!e.skinCull || !e.cullGroup) return true;   // 範囲を保証できない
      return frustum.intersectsSphere(skinnedWorldSphere(e, this, _sph));
    };
  }
}

/** 骨ごとの、骨のローカル空間の球（読み込み時・ウェイトを変えたときに作る）。ウェイトの合計が 1 でなければ null */
export function buildSkinCull(e) {
  const g = e.geometry, sk = e.skeleton, sm = e.skinned;
  if (!g || !sk || !sm) return null;
  const pos = g.attributes.position.array;
  const A = g.attributes;
  const ias = [], was = [];
  if (A.skinIndex && A.skinWeight) { ias.push(A.skinIndex.array); was.push(A.skinWeight.array); }
  if (A.skinIndex1 && A.skinWeight1) { ias.push(A.skinIndex1.array); was.push(A.skinWeight1.array); }
  const n = A.position.count;
  const nb = sk.bones.length;
  const nSet = ias.length;
  // 1 回目: ウェイトを確かめ、点の数を数える（null の条件はどれに当たっても null なので、調べる順は問わない）
  let total = 0;
  for (let s = 0; s < nSet; s++) {
    const wa = was[s], ia = ias[s];
    for (let i = 0, m = n * 4; i < m; i++) {
      const w = wa[i];
      if (w === 0) continue;
      if (!(w > 0)) return null;                   // 負のウェイト（範囲を保証できない）
      if (ia[i] >= nb) return null;
      total++;
    }
  }
  for (let v = 0; v < n; v++) {
    let sum = 0;
    for (let s = 0; s < nSet; s++) { const wa = was[s], o = v * 4; for (let k = 0; k < 4; k++) sum += wa[o + k]; }
    if (Math.abs(sum - 1) > 1e-4) return null;     // ウェイトの合計が 1 でない
  }
  // 骨ごとの変換（骨の逆行列 · bindMatrix）と、骨のローカル空間の点の範囲（箱 → 球）。点は型付き配列に入れる
  const mats = new Array(nb).fill(null);
  const box = new Float64Array(nb * 6);            // 骨 → minx, miny, minz, maxx, maxy, maxz
  const seen = new Uint8Array(nb);
  const order = [];                                // 骨を初めて見た順（結果の並び）
  const px = new Float64Array(total * 3), pb = new Int32Array(total);
  let t = 0;
  for (let v = 0; v < n; v++) {
    const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
    for (let s = 0; s < nSet; s++) {
      const wa = was[s], ia = ias[s];
      for (let k = 0; k < 4; k++) {
        const i = v * 4 + k;
        if (wa[i] === 0) continue;
        const b = ia[i];
        let m = mats[b];
        if (!m) m = mats[b] = new Matrix4().multiplyMatrices(sk.boneInverses[b], sm.bindMatrix).elements;
        // Vector3.applyMatrix4 と同じ式（w で割る）
        const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);
        const cx = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w;
        const cy = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w;
        const cz = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w;
        const o = b * 6;
        if (!seen[b]) { seen[b] = 1; order.push(b); box[o] = box[o + 3] = cx; box[o + 1] = box[o + 4] = cy; box[o + 2] = box[o + 5] = cz; }
        else {
          if (cx < box[o]) box[o] = cx;
          if (cy < box[o + 1]) box[o + 1] = cy;
          if (cz < box[o + 2]) box[o + 2] = cz;
          if (cx > box[o + 3]) box[o + 3] = cx;
          if (cy > box[o + 4]) box[o + 4] = cy;
          if (cz > box[o + 5]) box[o + 5] = cz;
        }
        px[t * 3] = cx; px[t * 3 + 1] = cy; px[t * 3 + 2] = cz; pb[t++] = b;
      }
    }
  }
  const r2 = new Float64Array(nb);
  for (let i = 0; i < t; i++) {
    const b = pb[i], o = b * 6;
    const dx = px[i * 3] - (box[o] + box[o + 3]) / 2, dy = px[i * 3 + 1] - (box[o + 1] + box[o + 4]) / 2, dz = px[i * 3 + 2] - (box[o + 2] + box[o + 5]) / 2;
    const d = dx * dx + dy * dy + dz * dz;
    if (d > r2[b]) r2[b] = d;
  }
  const bones = [], data = [];
  for (const b of order) {
    const o = b * 6;
    bones.push(b);
    data.push((box[o] + box[o + 3]) / 2, (box[o + 1] + box[o + 4]) / 2, (box[o + 2] + box[o + 5]) / 2, Math.sqrt(r2[b]) * (1 + 1e-6) + 1e-9);
  }
  return { bones: Int32Array.from(bones), spheres: Float64Array.from(data) };
}

/**
 * 視錐台カリングのまとまり: 同じジョイントを使うスキン付きメッシュ（ほぼキャラクター単位）。骨ごとの球（骨のローカル
 * 空間）を、まとまりのメッシュすべての分を包むように 1 つにしておき、判定のたびの計算を「メッシュの数 × 骨の数」から
 * 「骨の数」に減らす（メッシュごとに骨の数だけ計算すると、骨の多いシーンではカリングで減る描画より重くなる）。
 * その代わり、スキン付きメッシュはまとまりごと画面の外のときに描かない。e.cullGroup に入れる
 */
export function buildCullGroups(meshes) {
  const list = meshes.filter((e) => e.skinned && e.skinCull);
  for (const e of meshes) e.cullGroup = null;
  // 同じ骨（ジョイントのオブジェクト）を使うメッシュをつなぐ
  const parent = list.map((_, i) => i);
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  const owner = new Map();
  list.forEach((e, i) => {
    for (const b of e.skinCull.bones) {
      const bone = e.skeleton.bones[b];
      const j = owner.get(bone);
      if (j === undefined) owner.set(bone, i);
      else { const a = find(i), c = find(j); if (a !== c) parent[a] = c; }
    }
  });
  const groups = new Map();
  list.forEach((e, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, { entries: [], spheres: new Map() });
    const g = groups.get(r);
    g.entries.push(e);
    const c = e.skinCull;
    for (let k = 0; k < c.bones.length; k++) {
      const bone = e.skeleton.bones[c.bones[k]];
      if (!g.spheres.has(bone)) g.spheres.set(bone, []);
      g.spheres.get(bone).push(c.spheres[k * 4], c.spheres[k * 4 + 1], c.spheres[k * 4 + 2], c.spheres[k * 4 + 3]);
    }
  });
  for (const g of groups.values()) {
    const bones = [...g.spheres.keys()];
    const data = new Float64Array(bones.length * 4);
    bones.forEach((bone, k) => {
      const sp = g.spheres.get(bone);
      // 球を包む球（箱の中心から、いちばん遠い球の端まで）
      let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
      for (let i = 0; i < sp.length; i += 4) {
        const r = sp[i + 3];
        minx = Math.min(minx, sp[i] - r); miny = Math.min(miny, sp[i + 1] - r); minz = Math.min(minz, sp[i + 2] - r);
        maxx = Math.max(maxx, sp[i] + r); maxy = Math.max(maxy, sp[i + 1] + r); maxz = Math.max(maxz, sp[i + 2] + r);
      }
      const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2;
      let rad = 0;
      for (let i = 0; i < sp.length; i += 4) {
        const dx = sp[i] - cx, dy = sp[i + 1] - cy, dz = sp[i + 2] - cz;
        rad = Math.max(rad, Math.sqrt(dx * dx + dy * dy + dz * dz) + sp[i + 3]);
      }
      data[k * 4] = cx; data[k * 4 + 1] = cy; data[k * 4 + 2] = cz; data[k * 4 + 3] = rad * (1 + 1e-9) + 1e-12;
    });
    const group = { bones, spheres: data, stamp: -1, cx: 0, cy: 0, cz: 0, radius: 0 };
    for (const e of g.entries) e.cullGroup = group;
  }
  return groups.size;
}

/** まとまりのいまの範囲（スキンの計算の空間の球）。1 回の描画の中では 1 回だけ計算する */
/** カリングのまとまりの、いまのフレームの球（スキンの計算の空間。meshBatches.js のまとめたスキン付きメッシュでも使う） */
export function groupSphereOf(group) { return groupSphere(group); }

function groupSphere(group) {
  if (group.stamp === cullStamp) return group;
  group.stamp = cullStamp;
  const s = group.spheres, nb = group.bones.length;
  if (!group.work) group.work = new Float64Array(nb * 4);
  const w = group.work;
  let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
  for (let i = 0; i < nb; i++) {
    const bone = group.bones[i];
    const m = bone.matrixWorld.elements;
    const x = s[i * 4], y = s[i * 4 + 1], z = s[i * 4 + 2];
    // 骨のワールド行列（アフィン）で中心を移す
    const px = m[0] * x + m[4] * y + m[8] * z + m[12];
    const py = m[1] * x + m[5] * y + m[9] * z + m[13];
    const pz = m[2] * x + m[6] * y + m[10] * z + m[14];
    const r = s[i * 4 + 3] * scaleBound(bone.matrixWorld);
    w[i * 4] = px; w[i * 4 + 1] = py; w[i * 4 + 2] = pz; w[i * 4 + 3] = r;
    if (px - r < minx) minx = px - r; if (py - r < miny) miny = py - r; if (pz - r < minz) minz = pz - r;
    if (px + r > maxx) maxx = px + r; if (py + r > maxy) maxy = py + r; if (pz + r > maxz) maxz = pz + r;
  }
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2;
  let radius = 0;
  for (let i = 0; i < nb; i++) {
    const dx = w[i * 4] - cx, dy = w[i * 4 + 1] - cy, dz = w[i * 4 + 2] - cz;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + w[i * 4 + 3];
    if (d > radius) radius = d;
  }
  // ウェイトの合計の許容差（1e-4）の分、原点からの距離に比例する余裕を足す
  radius += 2e-4 * (Math.sqrt(cx * cx + cy * cy + cz * cz) + radius);
  group.cx = cx; group.cy = cy; group.cz = cz; group.radius = radius;
  return group;
}

let cullStamp = 0;
/** 描画のたびに呼ぶ（まとまりの範囲を、1 回の描画の中では 1 回だけ計算するための目印を進める） */
export function nextCullFrame() { cullStamp++; }

/** スキン付きメッシュ o のいまの範囲（ワールド空間の球）。まとまり（e.cullGroup）の範囲を、このメッシュの空間に移す */
export function skinnedWorldSphere(e, o, target = new Sphere()) {
  const g = groupSphere(e.cullGroup);
  // スキンの計算の空間 → メッシュの空間（bindMatrixInverse）→ ワールド（matrixWorld）
  _w.multiplyMatrices(worldMatrixOf(o), _m4.copy(o.bindMatrixInverse));
  target.center.set(g.cx, g.cy, g.cz).applyMatrix4(_w);
  target.radius = g.radius * scaleBound(_w) * (1 + 1e-6);
  return target;
}

/** 表示用のオブジェクトの、いまのワールド行列（非表示のあいだに計算を省いていたら、ここで計算する） */
export function worldMatrixOf(o) {
  if (o.matrixWorldNeedsUpdate) o.updateMatrixWorld();
  return o.matrixWorld;
}

const MAX_SHARED_BONES = 65535;                  // 骨の番号は Uint16（skinIndex）

/**
 * 同じジョイントを同じバインド行列（bindPreMatrix）で使うスキン付きメッシュ同士で、1 つの Skeleton（骨の和集合）を使う。
 * three.js は Skeleton ごとに毎フレーム骨の行列を計算して GPU に送る（テクスチャの転送）ので、メッシュの数だけあった
 * 計算と転送を、まとまりの数に減らす。各メッシュの骨の番号（skinIndex・skinIndex1 の表示用の属性）を和集合の番号に
 * 振り直す（entry.boneRemap: 元のスロット → 和集合の番号）。ウェイトの表示などが使う元のスロット（entry.skin）は変えない。
 * 変形の結果は同じ（同じ骨の行列 · 同じバインド行列を、同じウェイトで混ぜる）
 * @returns まとまりの数
 */
export function shareSkeletons(meshes) {
  const groups = [];                             // { bones: [], inverses: [], index: Map(骨 → 番号) }
  const same = (a, b) => { const x = a.elements, y = b.elements; for (let i = 0; i < 16; i++) if (x[i] !== y[i]) return false; return true; };
  const fits = (g, sk) => {
    let add = 0;
    for (let i = 0; i < sk.bones.length; i++) {
      const k = g.index.get(sk.bones[i]);
      if (k === undefined) add++;
      else if (!same(g.inverses[k], sk.boneInverses[i])) return false;   // 同じジョイントでバインド行列が違う
    }
    return g.bones.length + add <= MAX_SHARED_BONES;
  };
  for (const e of meshes) {
    const sk = e.skeleton;
    if (!sk || !e.skinned) continue;
    let g = groups.find((x) => fits(x, sk));
    if (!g) groups.push(g = { bones: [], inverses: [], index: new Map(), entries: [] });
    const remap = new Uint16Array(sk.bones.length);
    sk.bones.forEach((b, i) => {
      let k = g.index.get(b);
      if (k === undefined) { k = g.bones.length; g.bones.push(b); g.inverses.push(sk.boneInverses[i].clone()); g.index.set(b, k); }
      remap[i] = k;
    });
    e.boneRemap = remap;
    g.entries.push(e);
  }
  for (const g of groups) {
    if (g.entries.length < 2) { for (const e of g.entries) e.boneRemap = null; continue; }   // 1 つだけなら元のまま
    const shared = new Skeleton(g.bones, g.inverses);
    for (const e of g.entries) {
      const attrs = e.geometry.attributes;
      for (const name of ['skinIndex', 'skinIndex1']) {
        const arr = attrs[name].array;
        for (let i = 0; i < arr.length; i++) arr[i] = e.boneRemap[arr[i]];
        attrs[name].needsUpdate = true;
      }
      e.skeleton.dispose();
      e.skeleton = shared;
      e.skinned.bind(shared, e.skinned.bindMatrix);
      if (e.skinnedWire) e.skinnedWire.bind(shared, e.skinnedWire.bindMatrix);
    }
  }
  return groups.filter((g) => g.entries.length >= 2).length;
}

export const BASE_COLOR = 0xc9c6c0;

/**
 * ウェイトを変形時に正規化するか。
 * mode: 'maya'（skinCluster の設定に従う。ポストなら正規化）/ 'always' / 'none'
 */
export function shouldNormalize(skin, mode = 'always') {
  if (mode === 'always') return true;
  if (mode === 'none') return false;
  return skin.normalize === 2;
}

/**
 * 合計が 0 の頂点にウェイトを割り当てる（skinCluster の「ウェイトの分配」の設定に合わせる）。
 *   距離（0）: 記録されているジョイントに、バインド時の距離が近いほど多く配分（1 つなら 100%、等距離なら均等）。
 *              記録が 1 つもなければ、いちばん近いジョイントに 100%。
 *   近傍（1）: 辺でつながった頂点のウェイトの平均。記録されているジョイントがあれば、その中で配分する。
 *              周りにウェイトのある頂点がなければ「距離」と同じ。
 * Maya の正確な計算式は公開されていないため、この配分は近似。
 */
export function assignZeroWeights(decoded, m, positions) {
  const zero = decoded.zeroVertices;
  if (!zero.length) return 0;
  const sk = m.skin;
  const gm = new Matrix4().fromArray(sk.geomMatrix);
  const _m = new Matrix4();
  const jointPos = sk.bindPreMatrices.map((a) => new Vector3().setFromMatrixPosition(_m.fromArray(a).invert()));
  const p = new Vector3();
  const zeroSet = new Set(zero);
  let neighbors = null;
  if (sk.weightDistribution === 1) {
    neighbors = new Map();
    const link = (a, b) => { if (!neighbors.has(a)) neighbors.set(a, new Set()); neighbors.get(a).add(b); };
    let off = 0;
    for (const n of m.counts) {
      for (let k = 0; k < n; k++) {
        const a = m.indices[off + k], b = m.indices[off + ((k + 1) % n)];
        if (zeroSet.has(a)) link(a, b);
        if (zeroSet.has(b)) link(b, a);
      }
      off += n;
    }
  }
  for (const v of zero) {
    const listed = listedSlots(decoded, v);
    let list = null;
    if (neighbors && neighbors.has(v)) {
      const acc = new Map();
      for (const nb of neighbors.get(v)) {
        if (zeroSet.has(nb)) continue;
        for (let s = 0; s < jointPos.length; s++) {
          const w = effectiveWeight(decoded, nb, s);
          if (w > 0 && (!listed.length || listed.includes(s))) acc.set(s, (acc.get(s) || 0) + w);
        }
      }
      if (acc.size) list = [...acc].map(([slot, w]) => ({ slot, w }));
    }
    if (!list) {
      p.fromArray(positions, v * 3).applyMatrix4(gm);
      const dist = (s) => Math.max(p.distanceTo(jointPos[s]), 1e-6);
      if (listed.length) {
        list = listed.map((s) => ({ slot: s, w: 1 / dist(s) }));
      } else {
        let best = 0;
        for (let s = 1; s < jointPos.length; s++) if (dist(s) < dist(best)) best = s;
        list = [{ slot: best, w: 1 }];
      }
    }
    assignWeights(decoded, v, list);
  }
  return zero.length;
}

/** 正規化の切り替えに合わせて、スキン付きメッシュのウェイトを作り直す */
export function applySkinNormalization(built, mode) {
  let changed = 0;
  for (const e of built.meshes) {
    if (!e.skin) continue;
    const normalize = shouldNormalize(e.data.skin, mode);
    if (e.skin.normalize === normalize) continue;
    e.skin = decodeSkin(e.data.skin, e.vertexCount, { normalize });
    if (normalize) assignZeroWeights(e.skin, e.data, Float32Array.from(e.data.positions));
    const attrs = e.geometry.attributes;
    for (const [name, src] of [['skinWeight', e.skin.skinWeight], ['skinWeight1', e.skin.skinWeight1],
      ['skinIndex', e.skin.skinIndex], ['skinIndex1', e.skin.skinIndex1]]) {
      const arr = attrs[name].array;
      arr.set(expandToRender(src, 4, e.origOf));
      // Skeleton を共有しているメッシュは、骨の番号を和集合の番号に振り直す（shareSkeletons）
      if (e.boneRemap && name.startsWith('skinIndex')) for (let i = 0; i < arr.length; i++) arr[i] = e.boneRemap[arr[i]];
      attrs[name].needsUpdate = true;
    }
    if (e.skinned) { e.skinned.boundingSphere = null; e.skinned.boundingBox = null; }
    if (e.skinned && 'skinCull' in e) e.skinCull = buildSkinCull(e);   // 視錐台カリングの範囲を作り直す
    changed++;
  }
  if (changed && built.meshes.some((e) => 'cullGroup' in e)) buildCullGroups(built.meshes);
  return changed;
}

/**
 * 姿勢の基準 mode でのノードの行列。バインドポーズの情報がないノードは、バインドポーズでも保存時の値にする。
 * sceneHasBind が false（シーンにバインドポーズの情報が 1 つもない）なら、バインドポーズもファイルの値と同じ
 */
export function poseBaseMatrix(ud, mode, sceneHasBind = true) {
  if (mode !== 'bind' || !sceneHasBind) return ud.fileMatrix;
  return ud.bindMatrix || ud.savedMatrix || ud.fileMatrix;
}

/**
 * 姿勢の基準を切り替える。'bind' はバインドポーズ（情報のないノードは保存時の値）、'file' はファイルの値
 * （アニメーションがあれば現在のフレームの値）。
 * ポーズ確認の追加分は PoseState.reapplyAll() で掛け直すこと。
 */
export function applyPoseSource(built, mode) {
  const sceneHasBind = hasBindPose(built);
  for (const o of built.nodeObjects) {
    const ud = o.userData;
    ud.baseMatrix.copy(poseBaseMatrix(ud, mode, sceneHasBind));
    o.matrix.copy(ud.baseMatrix);
  }
  built.root.updateMatrixWorld(true);
}

export function hasBindPose(built) {
  if (built.hasBind === undefined) built.hasBind = built.nodeObjects.some((o) => o.userData.bindMatrix);
  return built.hasBind;
}

export const MAP_KINDS = ['baseColor', 'normal', 'roughness', 'metalness', 'ao', 'emissive', 'opacity'];

/** マップの読み込み・管理に使うキー（UDIM はタイルごと） */
export function textureKey(ti, tile) {
  return tile ? `${ti}:${tile}` : String(ti);
}

/**
 * 面の描画用マテリアル。md は共通 JSON の materials[] の 1 件（null なら既定）。
 * ライトの影響を受けない版（フラットライト・マップの単独表示用）を userData.unlit に持つ。
 */
function makeSurfaceMaterial(md, index, tile, textures) {
  const common = { side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
  const m = new MeshStandardMaterial({ color: BASE_COLOR, roughness: 0.78, metalness: 0.0, ...common });
  const unlit = new MeshBasicMaterial({ color: BASE_COLOR, ...common });
  enableEightInfluences(m);   // 8 インフルエンス対応（スキンなしのメッシュには影響しない）
  enableEightInfluences(unlit);
  m.name = md ? md.name + (tile ? ` <${tile}>` : '') : '(既定)';
  unlit.name = m.name;
  const baseColor = new Color(BASE_COLOR);
  if (md && Array.isArray(md.color)) baseColor.setRGB(md.color[0], md.color[1], md.color[2]);
  // マップ: 種類 → { key（読み込み用）, texture 番号, channel }
  const maps = {};
  let udim = false;
  const srcMaps = (md && md.maps) || (md && md.texture >= 0 ? { baseColor: { texture: md.texture, channel: 'rgb' } } : {});
  for (const [kind, mp] of Object.entries(srcMaps)) {
    const info = (textures || [])[mp.texture];
    if (!info) continue;
    if (info.udim) udim = true;
    maps[kind] = { texture: mp.texture, channel: mp.channel || 'rgb', key: textureKey(mp.texture, info.udim ? tile : 0) };
  }
  m.userData = {
    index, tile, udim, isMaya: !!md, baseColor, maps,
    textureIndex: maps.baseColor ? maps.baseColor.texture : -1,
    useAlpha: !!(md && md.useAlpha),
    roughness: md && typeof md.roughness === 'number' ? md.roughness : null,
    metalness: md && typeof md.metalness === 'number' ? md.metalness : null,
    textures: {}, hasAlpha: false, unlit, sig: '',
  };
  return m;
}

/**
 * 表示用の頂点を作る。UV の継ぎ目では、同じ頂点でも UV ごとに別の表示用頂点にする。
 * origOf[表示用] = 元の頂点番号、firstRender[元] = 最初の表示用頂点、cornerRender[面の角] = 表示用頂点
 */
export function buildRenderTopology(m, vertexCount, cornerGroup = null) {
  const nCorner = m.indices.length;
  const uv = m.uv;
  if ((!uv || !uv.values || !uv.values.length) && !cornerGroup) {
    const ident = new Uint32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) ident[i] = i;
    return {
      renderCount: vertexCount, origOf: ident, firstRender: Int32Array.from(ident),
      cornerRender: Uint32Array.from(m.indices), uvs: null,
    };
  }
  const nuv = uv && uv.values ? uv.values.length / 2 : 0;
  // 法線のまとまり（ハードエッジで分かれる）と UV の組み合わせごとに表示用頂点を作る。
  // ほとんどのまとまりは UV が 1 つだけなので、配列で直接引き、2 つ目以降（UV の継ぎ目）だけ Map を使う
  const nKey = cornerGroup ? nCorner : vertexCount;
  const firstUv = new Int32Array(nKey).fill(-2);
  const firstR = new Int32Array(nKey);
  const extra = new Map();
  const origOf = new Uint32Array(nCorner + vertexCount);
  const uvs = nuv ? new Float32Array((nCorner + vertexCount) * 2) : null;
  let count = 0;
  const cornerRender = new Uint32Array(nCorner);
  for (let c = 0; c < nCorner; c++) {
    const v = m.indices[c];
    const u = nuv ? uv.indices[c] : -1;
    const g = cornerGroup ? cornerGroup[c] : v;
    let r;
    if (firstUv[g] === -2) {
      firstUv[g] = u;
      r = firstR[g] = count++;
    } else if (firstUv[g] === u) {
      r = firstR[g];
    } else {
      const key = g * (nuv + 1) + (u + 1);
      r = extra.get(key);
      if (r === undefined) { r = count++; extra.set(key, r); }
      else { cornerRender[c] = r; continue; }
    }
    if (r === count - 1) {
      origOf[r] = v;
      if (uvs) { uvs[r * 2] = u >= 0 ? uv.values[u * 2] : 0; uvs[r * 2 + 1] = u >= 0 ? uv.values[u * 2 + 1] : 0; }
    }
    cornerRender[c] = r;
  }
  const firstRender = new Int32Array(vertexCount).fill(-1);
  for (let r = 0; r < count; r++) if (firstRender[origOf[r]] < 0) firstRender[origOf[r]] = r;
  for (let v = 0; v < vertexCount; v++) {
    if (firstRender[v] < 0) {             // どの面にも使われていない頂点
      firstRender[v] = count;
      origOf[count++] = v;
    }
  }
  return { renderCount: count, origOf: origOf.slice(0, count), firstRender, cornerRender,
    uvs: uvs ? uvs.slice(0, count * 2) : null };
}

/** 元の頂点単位の配列（itemSize 個ずつ）を表示用頂点に展開する */
export function expandToRender(src, itemSize, origOf, Ctor = src.constructor) {
  const out = new Ctor(origOf.length * itemSize);
  for (let r = 0; r < origOf.length; r++) {
    const o = origOf[r] * itemSize, d = r * itemSize;
    for (let k = 0; k < itemSize; k++) out[d + k] = src[o + k];
  }
  return out;
}

/** 面の UV の平均位置から UDIM のタイル番号（1001〜）を求める。UV がなければ 1001 */
export function faceTiles(m) {
  const tiles = new Uint16Array(m.counts.length).fill(1001);
  const uv = m.uv;
  if (!uv) return tiles;
  let off = 0;
  for (let f = 0; f < m.counts.length; f++) {
    let su = 0, sv = 0, n = 0;
    for (let k = 0; k < m.counts[f]; k++) {
      const u = uv.indices[off + k];
      if (u >= 0) { su += uv.values[u * 2]; sv += uv.values[u * 2 + 1]; n++; }
    }
    if (n) {
      const tu = Math.min(9, Math.max(0, Math.floor(su / n))), tv = Math.max(0, Math.floor(sv / n));
      tiles[f] = 1001 + tu + 10 * tv;
    }
    off += m.counts[f];
  }
  return tiles;
}

function buildMesh(m, meshIndex, nodeObjects, poolMaterials, materialFor, options) {
  const positions = Float32Array.from(m.positions);
  const vertexCount = positions.length / 3;
  const tri = triangulatePolygons(positions, m.counts, m.indices);
  const wire = buildWireIndex(m.counts, m.indices, vertexCount);
  const cn = cornerNormals(positions, m.counts, m.indices, m.hardEdges, vertexCount, m.normalMethod ?? 3);
  const topo = buildRenderTopology(m, vertexCount, cn.group);
  const { origOf, firstRender, cornerRender } = topo;
  // 表示用頂点の法線（同じまとまりのコーナーは同じ法線）
  const renderNormals = new Float32Array(topo.renderCount * 3);
  {
    const src = cn.normals;                         // 要素を直接写す（コーナーごとに subarray を作らない）
    for (let c = 0, n = cornerRender.length; c < n; c++) {
      const d = cornerRender[c] * 3, o = c * 3;
      renderNormals[d] = src[o]; renderNormals[d + 1] = src[o + 1]; renderNormals[d + 2] = src[o + 2];
    }
  }

  // 面ごとのマテリアル（UDIM ならタイルごと）→ このメッシュ内のスロット
  const faceMat = m.faceMaterials || null;
  const single = Number.isInteger(m.material) ? m.material : -1;
  const needTiles = (faceMat || [single]).some((mi) => poolMaterials[mi] && poolMaterials[mi].userData.udim);
  const tiles = needTiles ? faceTiles(m) : null;
  const slotOf = new Map();
  const slots = [];
  const slotFor = (f) => {
    const mat = materialFor(faceMat ? faceMat[f] : single, tiles ? tiles[f] : 0);
    if (!slotOf.has(mat)) { slotOf.set(mat, slots.length); slots.push(mat); }
    return slotOf.get(mat);
  };
  const triSlot = new Uint16Array(tri.triCount);
  for (let t = 0; t < tri.triCount; t++) triSlot[t] = slotFor(tri.triToFace[t]);
  if (!slots.length) slots.push(materialFor(single, 0));

  // 三角形をスロット順に並べ、表示用頂点の番号にする
  const counts = new Uint32Array(slots.length);
  for (let t = 0; t < tri.triCount; t++) counts[triSlot[t]]++;
  const starts = new Uint32Array(slots.length);
  for (let s = 1; s < slots.length; s++) starts[s] = starts[s - 1] + counts[s - 1];
  const fill = starts.slice();
  const index = new Uint32Array(tri.triCount * 3);
  for (let t = 0; t < tri.triCount; t++) {
    const d = fill[triSlot[t]]++ * 3;
    index[d] = cornerRender[tri.corners[t * 3]];
    index[d + 1] = cornerRender[tri.corners[t * 3 + 1]];
    index[d + 2] = cornerRender[tri.corners[t * 3 + 2]];
  }

  const posAttr = new BufferAttribute(expandToRender(positions, 3, origOf), 3);
  const colorAttr = new Float32BufferAttribute(new Float32Array(topo.renderCount * 3).fill(1), 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('normal', new BufferAttribute(renderNormals, 3));
  geometry.setAttribute('color', colorAttr);
  if (topo.uvs) geometry.setAttribute('uv', new BufferAttribute(topo.uvs, 2));
  geometry.setIndex(new BufferAttribute(index, 1));
  if (slots.length > 1) for (let s = 0; s < slots.length; s++) geometry.addGroup(starts[s] * 3, counts[s] * 3, s);
  const surfaceMaterial = slots.length > 1 ? slots : slots[0];

  // ポリゴンの辺のワイヤー（元の頂点番号 → 表示用頂点）
  const wireIndex = new Uint32Array(wire.index.length);
  for (let i = 0; i < wire.index.length; i++) wireIndex[i] = firstRender[wire.index[i]];
  const wireGeometry = new BufferGeometry();
  wireGeometry.setAttribute('position', posAttr);
  wireGeometry.setAttribute('color', colorAttr);
  wireGeometry.setIndex(new BufferAttribute(wireIndex, 1));

  const wireMaterial = options.wireMaterial || new MeshBasicMaterial({
    color: 0x1d2024, wireframe: true, transparent: true, opacity: 0.55, depthWrite: false,
  });
  enableEightInfluences(wireMaterial);

  const parent = nodeObjects[m.transform];
  let skinned = null, skinnedWire = null, decoded = null, skeleton = null;
  const staticMesh = new Mesh(geometry, surfaceMaterial);
  const staticWire = new Mesh(wireGeometry, wireMaterial);

  if (m.skin) {
    decoded = decodeSkin(m.skin, vertexCount, { normalize: shouldNormalize(m.skin, options.normalizeMode) });
    if (decoded.normalize) assignZeroWeights(decoded, m, positions);
    const skinAttrs = {
      skinIndex: new Uint16BufferAttribute(expandToRender(decoded.skinIndex, 4, origOf), 4),
      skinWeight: new Float32BufferAttribute(expandToRender(decoded.skinWeight, 4, origOf), 4),
      skinIndex1: new Uint16BufferAttribute(expandToRender(decoded.skinIndex1, 4, origOf), 4),
      skinWeight1: new Float32BufferAttribute(expandToRender(decoded.skinWeight1, 4, origOf), 4),
    };
    for (const [name, attr] of Object.entries(skinAttrs)) {
      geometry.setAttribute(name, attr);
      wireGeometry.setAttribute(name, attr);
    }

    const bones = m.skin.influences.map((ni) => nodeObjects[ni]);
    const inverses = m.skin.bindPreMatrices.map((a) => new Matrix4().fromArray(a));
    skeleton = new Skeleton(bones, inverses);
    const gm = new Matrix4().fromArray(m.skin.geomMatrix);

    // Maya: p' = Σ w · p · gm · pm · wm · gm⁻¹（行ベクトル）
    // three: bindMatrixInverse · Σ w · boneWorld · boneInverse · bindMatrix · p（列ベクトル）
    skinned = useEightInfluencesOnCpu(new SkinnedMesh(geometry, surfaceMaterial));
    skinned.bindMode = DetachedBindMode;
    skinned.bind(skeleton, gm);
    skinnedWire = useEightInfluencesOnCpu(new SkinnedMesh(wireGeometry, wireMaterial));
    skinnedWire.bindMode = DetachedBindMode;
    skinnedWire.bind(skeleton, gm);
  }

  for (const o of [staticMesh, staticWire, skinned, skinnedWire]) {
    if (!o) continue;
    o.matrixAutoUpdate = false;
    installLeafUpdate(o);
    o.frustumCulled = false;
    o.userData.meshIndex = meshIndex;
    parent.add(o);
  }
  staticWire.renderOrder = 1;
  if (skinnedWire) skinnedWire.renderOrder = 1;

  return {
    index: meshIndex,
    name: m.name,
    path: m.path,
    transform: m.transform,
    data: m,
    vertexCount,
    renderVertexCount: topo.renderCount,
    origOf, firstRender,
    triCount: tri.triCount,
    edgeCount: wire.edgeCount,
    geometry, wireGeometry, wireMaterial,
    materials: slots,
    staticMesh, staticWire, skinned, skinnedWire, skeleton,
    skin: decoded,
    visible: m.visible !== false,
  };
}

const _v = new Vector3();

/** 表示用頂点 rv の現在の位置（スキン適用後・ワールド空間） */
export function renderVertexWorldPosition(entry, rv, useSkin, target) {
  target.fromBufferAttribute(entry.geometry.attributes.position, rv);
  if (useSkin && entry.skinned) {
    entry.skinned.applyBoneTransform(rv, target);
    return target.applyMatrix4(worldMatrixOf(entry.skinned));
  }
  return target.applyMatrix4(worldMatrixOf(entry.staticMesh));
}

/** 元の頂点 v の現在の位置（スキン適用後・ワールド空間） */
export function vertexWorldPosition(entry, v, useSkin, target) {
  return renderVertexWorldPosition(entry, entry.firstRender[v], useSkin, target);
}

/** 表示用頂点の番号 → 元の頂点番号 */
export function originalVertex(entry, rv) {
  return entry.origOf[rv];
}

/** 元の頂点単位の色（3 個ずつ）を color 属性に展開して書き込む */
export function writeVertexColors(entry, origColors) {
  const attr = entry.geometry.attributes.color;
  const out = attr.array;
  const origOf = entry.origOf;
  for (let r = 0; r < origOf.length; r++) {
    const o = origOf[r] * 3;
    out[r * 3] = origColors[o]; out[r * 3 + 1] = origColors[o + 1]; out[r * 3 + 2] = origColors[o + 2];
  }
  attr.needsUpdate = true;
}

/** 表示中のメッシュ・ジョイント・カーブを包む箱（大きいメッシュは間引いて計算） */
export function computeBounds(built, useSkin, includeHidden = false) {
  const box = new Box3();
  for (const e of built.meshes) {
    if (!includeHidden && !e.visible) continue;
    const step = Math.max(1, Math.floor(e.vertexCount / 20000));
    for (let v = 0; v < e.vertexCount; v += step) box.expandByPoint(vertexWorldPosition(e, v, useSkin, _v));
  }
  for (const ji of built.jointIndices) {
    box.expandByPoint(_v.setFromMatrixPosition(built.nodeObjects[ji].matrixWorld));
  }
  for (const it of built.curveItems || []) {          // NURBS カーブ（CurveOverlay が作った線）
    if (!it || (!includeHidden && !it.line.visible)) continue;
    const pos = it.line.geometry.getAttribute('position');
    const step = Math.max(1, Math.floor(pos.count / 16));
    for (let k = 0; k < pos.count; k += step) box.expandByPoint(_v.fromBufferAttribute(pos, k).applyMatrix4(it.line.matrixWorld));
  }
  if (box.isEmpty()) box.set(new Vector3(-50, -50, -50), new Vector3(50, 50, 50));
  return box;
}

/**
 * キャラクターの大きさ（半径）: スキンのあるメッシュの範囲。なければメッシュ全体、メッシュもなければ 0。
 * 大きな背景やカメラに引きずられないよう、コントローラーの目印の大きさの基準（骨のないとき）に使う
 */
export function characterRadius(built) {
  const box = new Box3();
  for (const skinOnly of [true, false]) {
    for (const e of built.meshes) {
      if (skinOnly && !e.skin) continue;
      const step = Math.max(1, Math.floor(e.vertexCount / 5000));
      for (let v = 0; v < e.vertexCount; v += step) box.expandByPoint(vertexWorldPosition(e, v, true, _v));
    }
    if (!box.isEmpty()) break;
  }
  return box.isEmpty() ? 0 : box.getSize(new Vector3()).length() / 2;
}

export function disposeScene(built) {
  if (!built) return;
  const seen = new Set();
  const dispose = (o) => { if (o && !seen.has(o)) { seen.add(o); o.dispose(); } };
  for (const m of built.allMaterials || []) {
    if (m.userData.unlit) dispose(m.userData.unlit);   // テクスチャはアプリ側（MapManager）でまとめて破棄する
    dispose(m);
  }
  for (const e of built.meshes) {
    dispose(e.geometry); dispose(e.wireGeometry); dispose(e.wireMaterial);
    if (e.skeleton) dispose(e.skeleton);                 // 共有している Skeleton は 1 回だけ
  }
  built.root.removeFromParent();
  pendingLeaves.clear();
}
