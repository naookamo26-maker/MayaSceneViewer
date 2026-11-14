// スキン付きメッシュのクリックの選択（光線との交差）と、変形後の頂点の位置（矩形選択）。
//
// three.js の SkinnedMesh のレイキャストは、三角形の頂点ごとに applyBoneTransform（skinning8.js の applyBoneTransform8）を
// 呼び、インフルエンスごとに「骨のワールド行列 · 骨の逆行列」を掛け直す（20 万頂点で 1 クリック 300 ms ほど）。ここでは
// 骨ごとの行列を 1 回だけ作り、表示用頂点をすべて 1 回だけ変形して型付き配列に入れ、その配列で三角形を調べる。
//   * 変形の式と計算の順は applyBoneTransform8 と同じ（bindMatrixInverse · Σ w · 骨のワールド行列 · 骨の逆行列 · bindMatrix · p）。
//     倍精度の配列に入れるので、位置はビット単位で同じ
//   * 三角形の判定は three.js の Ray.intersectTriangle（watertight）と同じ式。面の向き（材質の side・グループごとの材質）・
//     drawRange・raycaster.near / far・ワールドの距離も Mesh の標準のレイキャストと同じに扱うので、当たり（メッシュ・三角形・
//     距離・点）は標準と同じになる
//   * 変形した位置は、骨の行列・バインド行列・属性（version）が変わるまで覚えて使い回す
//   * 変形の前に、範囲で外せるメッシュは外す（覚えた位置の箱か、skinCull の骨ごとの球をいまの骨の行列で移した箱）
// 標準と同じ結果を保証できないもの（モーフ・射影を含む行列・インターリーブの属性）は、three.js の標準のレイキャストに任せる。
import { BackSide, Box3, FrontSide, Matrix4, Ray, Vector3 } from 'three';
import { scaleBound } from './sceneBuilder.js';

const _m = new Matrix4(), _inv = new Matrix4(), _ray = new Ray(), _skinRay = new Ray(), _box = new Box3();
const SETS = [['skinIndex', 'skinWeight'], ['skinIndex1', 'skinWeight1']];

const isAffine = (e) => e[3] === 0 && e[7] === 0 && e[11] === 0 && e[15] === 1;

/** 変形を倍精度の配列で行えるか（モーフがない・属性が普通の配列・行列がアフィン）。行列は呼ぶたびに確かめる */
function canDeform(sm) {
  const g = sm.geometry, A = g.attributes;
  if (g.morphAttributes && g.morphAttributes.position && sm.morphTargetInfluences && sm.morphTargetInfluences.length) return false;
  if (!A.position || A.position.isInterleavedBufferAttribute || A.position.itemSize !== 3) return false;
  for (const [si, sw] of SETS) {
    const ia = A[si], wa = A[sw];
    if (!ia || !wa) continue;
    if (ia.isInterleavedBufferAttribute || wa.isInterleavedBufferAttribute || ia.normalized || wa.normalized) return false;
    if (ia.itemSize !== 4 || wa.itemSize !== 4) return false;
  }
  return isAffine(sm.bindMatrix.elements) && isAffine(sm.bindMatrixInverse.elements);
}

/** 骨ごとの行列（骨のワールド行列 · 骨の逆行列）。射影を含めば null */
function boneMatrices(sk, out) {
  const nb = sk.bones.length;
  const bm = out && out.length === nb * 16 ? out : new Float64Array(nb * 16);
  for (let b = 0; b < nb; b++) {
    _m.multiplyMatrices(sk.bones[b].matrixWorld, sk.boneInverses[b]);
    const e = _m.elements;
    if (!isAffine(e)) return null;
    bm.set(e, b * 16);
  }
  return bm;
}

function sameArray(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** 覚えた変形がいまの状態のものか（骨の行列・バインド行列・属性の配列と version が同じ） */
function cacheValid(c, sm, bm) {
  if (!c || !sameArray(c.bm, bm) || !sameArray(c.bind, sm.bindMatrix.elements) || !sameArray(c.bindInv, sm.bindMatrixInverse.elements)) return false;
  const A = sm.geometry.attributes;
  const now = attrKeys(A);
  for (let i = 0; i < now.length; i++) if (now[i] !== c.attrs[i]) return false;
  return true;
}

function attrKeys(A) {
  const keys = [A.position.array, A.position.version];
  for (const [si, sw] of SETS) {
    const ia = A[si], wa = A[sw];
    keys.push(ia ? ia.array : null, ia ? ia.version : -1, wa ? wa.array : null, wa ? wa.version : -1);
  }
  return keys;
}

/**
 * 変形後の表示用頂点の位置（メッシュのローカル空間。x, y, z の順の Float64Array）と、その範囲の箱。
 * 骨の行列などが変わっていなければ、前に求めたものを返す。変形を倍精度で行えないメッシュは null
 * @param e buildScene のメッシュのエントリ（e.skinned がある）
 */
export function deformedPositions(e) {
  const sm = e.skinned;
  if (!sm || !canDeform(sm)) return null;
  const prev = e.deformCache;
  const bm = boneMatrices(sm.skeleton, prev ? prev.work : null);
  if (!bm) return null;
  if (cacheValid(prev, sm, bm)) return prev;          // bm は作業用の配列（prev.work）。覚えた行列は prev.bm
  const A = sm.geometry.attributes;
  const pos = A.position.array, n = A.position.count;
  const out = prev && prev.positions.length === n * 3 ? prev.positions : new Float64Array(n * 3);
  const B = sm.bindMatrix.elements, BI = sm.bindMatrixInverse.elements;
  const sets = [];
  for (const [si, sw] of SETS) if (A[si] && A[sw]) sets.push(A[si].array, A[sw].array);
  const ns = sets.length;
  let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
  for (let v = 0; v < n; v++) {
    const px = pos[v * 3], py = pos[v * 3 + 1], pz = pos[v * 3 + 2];
    // applyBoneTransform8 と同じ順: bindMatrix で移し、インフルエンスごとに w を掛けて足し、bindMatrixInverse で戻す
    const bx = B[0] * px + B[4] * py + B[8] * pz + B[12];
    const by = B[1] * px + B[5] * py + B[9] * pz + B[13];
    const bz = B[2] * px + B[6] * py + B[10] * pz + B[14];
    let x = 0, y = 0, z = 0;
    for (let s = 0; s < ns; s += 2) {
      const ia = sets[s], wa = sets[s + 1];
      for (let k = 0; k < 4; k++) {
        const w = wa[v * 4 + k];
        if (w === 0) continue;
        const o = ia[v * 4 + k] * 16;
        x += (bm[o] * bx + bm[o + 4] * by + bm[o + 8] * bz + bm[o + 12]) * w;
        y += (bm[o + 1] * bx + bm[o + 5] * by + bm[o + 9] * bz + bm[o + 13]) * w;
        z += (bm[o + 2] * bx + bm[o + 6] * by + bm[o + 10] * bz + bm[o + 14]) * w;
      }
    }
    const rx = BI[0] * x + BI[4] * y + BI[8] * z + BI[12];
    const ry = BI[1] * x + BI[5] * y + BI[9] * z + BI[13];
    const rz = BI[2] * x + BI[6] * y + BI[10] * z + BI[14];
    out[v * 3] = rx; out[v * 3 + 1] = ry; out[v * 3 + 2] = rz;
    if (rx < minx) minx = rx; if (rx > maxx) maxx = rx;
    if (ry < miny) miny = ry; if (ry > maxy) maxy = ry;
    if (rz < minz) minz = rz; if (rz > maxz) maxz = rz;
  }
  // 箱は丸めの分だけ少し広げる（外す判定にだけ使う）
  const pad = 1e-6 * Math.max(maxx - minx, maxy - miny, maxz - minz, Math.abs(minx), Math.abs(maxx), Math.abs(miny), Math.abs(maxy), Math.abs(minz), Math.abs(maxz)) + 1e-12;
  const box = new Box3(new Vector3(minx - pad, miny - pad, minz - pad), new Vector3(maxx + pad, maxy + pad, maxz + pad));
  const c = {
    positions: out, box,
    bm: Float64Array.from(bm), work: bm,
    bind: Float64Array.from(B), bindInv: Float64Array.from(BI), attrs: attrKeys(A),
  };
  e.deformCache = c;
  return c;
}

/**
 * skinCull（骨ごとの、骨のローカル空間の球）を、いまの骨の行列でスキンの計算の空間（bindMatrix の後）に移して包む箱。
 * 変形後の頂点は、ウェイトが正で合計がほぼ 1 なので、骨ごとの点の凸結合（の 1 ± 1e-4 倍）としてこの箱に入る。
 * 作れなければ null
 */
function skinSpaceBox(e, target) {
  const c = e.skinCull, sk = e.skinned.skeleton;
  if (!c || e.skeleton !== sk) return null;
  let minx = Infinity, miny = Infinity, minz = Infinity, maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
  const s = c.spheres;
  for (let i = 0; i < c.bones.length; i++) {
    const bone = sk.bones[c.bones[i]];
    if (!bone) return null;
    const m = bone.matrixWorld.elements;
    if (!isAffine(m)) return null;
    const x = s[i * 4], y = s[i * 4 + 1], z = s[i * 4 + 2];
    const px = m[0] * x + m[4] * y + m[8] * z + m[12];
    const py = m[1] * x + m[5] * y + m[9] * z + m[13];
    const pz = m[2] * x + m[6] * y + m[10] * z + m[14];
    const r = s[i * 4 + 3] * scaleBound(bone.matrixWorld) * (1 + 1e-6);
    if (px - r < minx) minx = px - r; if (py - r < miny) miny = py - r; if (pz - r < minz) minz = pz - r;
    if (px + r > maxx) maxx = px + r; if (py + r > maxy) maxy = py + r; if (pz + r > maxz) maxz = pz + r;
  }
  if (!(minx <= maxx)) return null;
  // ウェイトの合計の許容差（1e-4）の分と丸めの分の余裕
  const far = Math.max(Math.abs(minx), Math.abs(maxx), Math.abs(miny), Math.abs(maxy), Math.abs(minz), Math.abs(maxz));
  const pad = 2e-4 * Math.sqrt(3) * far + 1e-6 * Math.max(maxx - minx, maxy - miny, maxz - minz) + 1e-12;
  target.min.set(minx - pad, miny - pad, minz - pad);
  target.max.set(maxx + pad, maxy + pad, maxz + pad);
  return target;
}

/**
 * スキン付きメッシュ（e.skinned）といちばん手前で当たるところ。three.js の intersectObject(e.skinned, false) の
 * 先頭と同じもの（{ distance, point, object, face: { a, b, c, materialIndex }, faceIndex }）か、当たらなければ null。
 * 標準と同じ計算ができないメッシュは undefined（呼ぶ側が three.js のレイキャストを使う）
 */
export function raycastSkinnedNearest(e, raycaster) {
  const sm = e.skinned;
  const material = sm.material;
  if (material === undefined) return null;
  if (!canDeform(sm)) return undefined;
  const mw = sm.matrixWorld;
  _inv.copy(mw).invert();
  _ray.copy(raycaster.ray).applyMatrix4(_inv);
  // 変形の前に外す（覚えた変形がいまのものならその箱、なければ skinCull の球）
  let cache = e.deformCache;
  if (cache) {
    const bm = boneMatrices(sm.skeleton, cache.work);
    if (!bm) return undefined;
    if (!cacheValid(cache, sm, bm)) cache = null;
  }
  if (cache) {
    if (!_ray.intersectsBox(cache.box)) return null;
  } else {
    const box = skinSpaceBox(e, _box);
    if (box) {
      _skinRay.copy(_ray).applyMatrix4(sm.bindMatrix);
      if (!_skinRay.intersectsBox(box)) return null;
    }
    cache = deformedPositions(e);
    if (!cache) return undefined;
    if (!_ray.intersectsBox(cache.box)) return null;
  }
  return nearestTriangle(sm, cache.positions, _ray, raycaster);
}

/** 三角形を調べる範囲と材質（Mesh._computeIntersections と同じ分け方） */
function ranges(geometry, material, count) {
  const dr = geometry.drawRange;
  if (Array.isArray(material)) {
    return geometry.groups.map((g) => ({
      start: Math.max(g.start, dr.start),
      end: Math.min(count, Math.min(g.start + g.count, dr.start + dr.count)),
      material: material[g.materialIndex], materialIndex: g.materialIndex,
    }));
  }
  return [{ start: Math.max(0, dr.start), end: Math.min(count, dr.start + dr.count), material, materialIndex: 0 }];
}

function nearestTriangle(sm, P, ray, raycaster) {
  const geometry = sm.geometry;
  const index = geometry.index;
  if (index && index.isInterleavedBufferAttribute) return undefined;
  const idx = index ? index.array : null;
  const count = index ? index.count : geometry.attributes.position.count;
  const o = ray.origin, d = ray.direction;
  const O = [o.x, o.y, o.z], D = [d.x, d.y, d.z];
  // Ray.intersectTriangle の投影の軸（光線の向きで決まるので 1 回だけ）
  const adx = Math.abs(d.x), ady = Math.abs(d.y), adz = Math.abs(d.z);
  let kx, ky, kz;
  if (adx >= ady && adx >= adz) { kz = 0; if (d.x >= 0) { kx = 1; ky = 2; } else { kx = 2; ky = 1; } }
  else if (ady >= adz) { kz = 1; if (d.y >= 0) { kx = 2; ky = 0; } else { kx = 0; ky = 2; } }
  else { kz = 2; if (d.z >= 0) { kx = 0; ky = 1; } else { kx = 1; ky = 0; } }
  const dkz = D[kz];
  if (dkz === 0) return null;
  const sx = D[kx] / dkz, sy = D[ky] / dkz, sz = 1 / dkz;
  const okx = O[kx], oky = O[ky], okz = O[kz];
  const W = sm.matrixWorld.elements;
  const wo = raycaster.ray.origin;
  const near = raycaster.near, far = raycaster.far;
  let best = null, bestD = Infinity;
  for (const r of ranges(geometry, sm.material, count)) {
    const mat = r.material;
    if (!mat) continue;
    const back = mat.side === BackSide;
    const cull = back || mat.side === FrontSide;
    for (let j = r.start; j < r.end; j += 3) {
      const va = idx ? idx[j] : j, vb = idx ? idx[j + 1] : j + 1, vc = idx ? idx[j + 2] : j + 2;
      // 裏だけを描く材質は、標準と同じく頂点の順を逆にして（c, b, a）表として調べる
      const pa = (back ? vc : va) * 3, pb = vb * 3, pc = (back ? va : vc) * 3;
      const akx = P[pa + kx] - okx, aky = P[pa + ky] - oky, akz = P[pa + kz] - okz;
      const bkx = P[pb + kx] - okx, bky = P[pb + ky] - oky, bkz = P[pb + kz] - okz;
      const ckx = P[pc + kx] - okx, cky = P[pc + ky] - oky, ckz = P[pc + kz] - okz;
      const ax = akx - sx * akz, ay = aky - sy * akz;
      const bx = bkx - sx * bkz, by = bky - sy * bkz;
      const cx = ckx - sx * ckz, cy = cky - sy * ckz;
      const u = cx * by - cy * bx;
      const v = ax * cy - ay * cx;
      const w = bx * ay - by * ax;
      if (cull) { if (u < 0 || v < 0 || w < 0) continue; }
      else if ((u < 0 || v < 0 || w < 0) && (u > 0 || v > 0 || w > 0)) continue;
      const det = u + v + w;
      if (det === 0) continue;
      const tScaled = sz * (u * akz + v * bkz + w * ckz);
      if (det > 0 ? tScaled < 0 : tScaled > 0) continue;
      const t = tScaled / det;
      // 当たった点（ローカル）→ ワールド。距離はワールドの光線の原点から（Mesh の checkIntersection と同じ）
      const lx = d.x * t + o.x, ly = d.y * t + o.y, lz = d.z * t + o.z;
      const iw = 1 / (W[3] * lx + W[7] * ly + W[11] * lz + W[15]);
      const px = (W[0] * lx + W[4] * ly + W[8] * lz + W[12]) * iw;
      const py = (W[1] * lx + W[5] * ly + W[9] * lz + W[13]) * iw;
      const pz = (W[2] * lx + W[6] * ly + W[10] * lz + W[14]) * iw;
      const ex = wo.x - px, ey = wo.y - py, ez = wo.z - pz;
      const dist = Math.sqrt(ex * ex + ey * ey + ez * ez);
      if (dist < near || dist > far) continue;
      if (dist < bestD) {
        bestD = dist;
        best = { distance: dist, point: new Vector3(px, py, pz), object: sm, face: { a: va, b: vb, c: vc, materialIndex: r.materialIndex }, faceIndex: Math.floor(j / 3) };
      }
    }
  }
  return best;
}

/**
 * いくつかのメッシュのうち、いちばん手前で当たるもの（three.js の raycaster.intersectObjects(objects, false)[0] と同じ）。
 * fast(o) がエントリを返すオブジェクト（スキンを表示しているスキン付きメッシュ）は raycastSkinnedNearest で調べる
 */
export function intersectNearest(raycaster, objects, fast) {
  let best = null;
  for (const o of objects) {
    if (!o.layers.test(raycaster.layers)) continue;
    const e = fast ? fast(o) : null;
    let h = e ? raycastSkinnedNearest(e, raycaster) : undefined;
    if (h === undefined) {
      const list = [];
      o.raycast(raycaster, list);
      h = null;
      for (const x of list) if (!h || x.distance < h.distance) h = x;   // 標準の並べ替えと同じく、同じ距離なら先のもの
    }
    if (h && (!best || h.distance < best.distance)) best = h;
  }
  return best;
}

/**
 * 表示用頂点のワールド空間の位置（renderVertexWorldPosition をすべての頂点に使ったものと同じ値）を Float32Array に入れる。
 * スキン付きメッシュは deformedPositions を使う（求められなければ null。呼ぶ側が頂点ごとに計算する）
 */
export function skinnedWorldPositions(e, worldMatrix, out) {
  const c = deformedPositions(e);
  if (!c) return null;
  const P = c.positions, n = P.length / 3, W = worldMatrix.elements;
  for (let v = 0; v < n; v++) {
    const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
    const iw = 1 / (W[3] * x + W[7] * y + W[11] * z + W[15]);
    out[v * 3] = (W[0] * x + W[4] * y + W[8] * z + W[12]) * iw;
    out[v * 3 + 1] = (W[1] * x + W[5] * y + W[9] * z + W[13]) * iw;
    out[v * 3 + 2] = (W[2] * x + W[6] * y + W[10] * z + W[14]) * iw;
  }
  return out;
}
