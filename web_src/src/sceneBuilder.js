// 共通 JSON（maya-scene-lite）→ three.js のシーン。
// DOM に依存しないので Node.js 上でもテストできる。
import {
  BufferAttribute, BufferGeometry, Bone, Color, DetachedBindMode, DoubleSide, Float32BufferAttribute,
  Group, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, Skeleton, SkinnedMesh,
  Uint16BufferAttribute, Vector3, Box3,
} from 'three';
import { triangulatePolygons, buildWireIndex } from './geometry.js';
import { assignWeights, decodeSkin, effectiveWeight, listedSlots } from './weights.js';
import { cornerNormals } from './normals.js';
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
  root.updateMatrixWorld(true);
  return { root, nodeObjects, meshes, jointIndices, childrenOf, influenceUsage, materials, defaultMaterial, allMaterials };
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
      attrs[name].array.set(expandToRender(src, 4, e.origOf));
      attrs[name].needsUpdate = true;
    }
    if (e.skinned) { e.skinned.boundingSphere = null; e.skinned.boundingBox = null; }
    changed++;
  }
  return changed;
}

/** 姿勢の基準 mode でのノードの行列。バインドポーズの情報がないノードは、バインドポーズでも保存時の値にする */
export function poseBaseMatrix(ud, mode) {
  if (mode !== 'bind') return ud.fileMatrix;
  return ud.bindMatrix || ud.savedMatrix || ud.fileMatrix;
}

/**
 * 姿勢の基準を切り替える。'bind' はバインドポーズ（情報のないノードは保存時の値）、'file' はファイルの値
 * （アニメーションがあれば現在のフレームの値）。
 * ポーズ確認の追加分は PoseState.reapplyAll() で掛け直すこと。
 */
export function applyPoseSource(built, mode) {
  for (const o of built.nodeObjects) {
    const ud = o.userData;
    ud.baseMatrix.copy(poseBaseMatrix(ud, mode));
    o.matrix.copy(ud.baseMatrix);
  }
  built.root.updateMatrixWorld(true);
}

export function hasBindPose(built) {
  return built.nodeObjects.some((o) => o.userData.bindMatrix);
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
  const cn = cornerNormals(positions, m.counts, m.indices, m.hardEdges, vertexCount);
  const topo = buildRenderTopology(m, vertexCount, cn.group);
  const { origOf, firstRender, cornerRender } = topo;
  // 表示用頂点の法線（同じまとまりのコーナーは同じ法線）
  const renderNormals = new Float32Array(topo.renderCount * 3);
  for (let c = 0; c < cornerRender.length; c++) renderNormals.set(cn.normals.subarray(c * 3, c * 3 + 3), cornerRender[c] * 3);

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
    return target.applyMatrix4(entry.skinned.matrixWorld);
  }
  return target.applyMatrix4(entry.staticMesh.matrixWorld);
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

/** 表示中のメッシュとジョイントを包む箱（大きいメッシュは間引いて計算） */
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
  if (box.isEmpty()) box.set(new Vector3(-50, -50, -50), new Vector3(50, 50, 50));
  return box;
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
    if (e.skeleton) e.skeleton.dispose();
  }
  built.root.removeFromParent();
}
