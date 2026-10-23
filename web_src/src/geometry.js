// 多角形 → 三角形の分割と、ポリゴン辺のワイヤー用インデックス。
import { ShapeUtils, Vector2 } from 'three';

/**
 * 面ごとの頂点数 counts と連結された頂点番号 indices から三角形を作る。
 * 3 角形はそのまま、4 角形は短い対角線で分割、5 角形以上は平面に投影して耳切り法。
 * @returns {{ index: Uint32Array, corners: Uint32Array, triCount: number, triToFace: Uint32Array }}
 *   index は頂点番号、corners は面の角（indices 上の位置）の番号。どちらも 3 つで 1 三角形。
 *   UV の継ぎ目で頂点を分ける場合は corners を使う。
 */
export function triangulatePolygons(positions, counts, indices) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += Math.max(0, counts[i] - 2);
  const corners = new Uint32Array(total * 3);
  const triToFace = new Uint32Array(total);
  let t = 0;
  let off = 0;
  const P = (v, k) => positions[v * 3 + k];
  const put = (a, b, c, f) => { corners[t * 3] = a; corners[t * 3 + 1] = b; corners[t * 3 + 2] = c; triToFace[t++] = f; };

  for (let f = 0; f < counts.length; f++) {
    const n = counts[f];
    if (n === 3) {
      put(off, off + 1, off + 2, f);
    } else if (n === 4) {
      const a = indices[off], b = indices[off + 1], c = indices[off + 2], d = indices[off + 3];
      if (dist2(P, a, c) <= dist2(P, b, d)) { put(off, off + 1, off + 2, f); put(off, off + 2, off + 3, f); }
      else { put(off, off + 1, off + 3, f); put(off + 1, off + 2, off + 3, f); }
    } else if (n > 4) {
      const poly = Array.from(indices.slice(off, off + n));
      const local = triangulateNgonLocal(positions, poly);
      for (let k = 0; k < local.length; k += 3) put(off + local[k], off + local[k + 1], off + local[k + 2], f);
    }
    off += n;
  }
  const index = new Uint32Array(t * 3);
  for (let i = 0; i < t * 3; i++) index[i] = indices[corners[i]];
  return { index, corners, triCount: t, triToFace };
}

function dist2(P, a, b) {
  const x = P(a, 0) - P(b, 0), y = P(a, 1) - P(b, 1), z = P(a, 2) - P(b, 2);
  return x * x + y * y + z * z;
}

/** Newell 法の法線 */
function newellNormal(positions, poly) {
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i] * 3, b = poly[(i + 1) % poly.length] * 3;
    const ax = positions[a], ay = positions[a + 1], az = positions[a + 2];
    const bx = positions[b], by = positions[b + 1], bz = positions[b + 2];
    nx += (ay - by) * (az + bz);
    ny += (az - bz) * (ax + bx);
    nz += (ax - bx) * (ay + by);
  }
  return [nx, ny, nz];
}

/** 5 角形以上の分割（頂点番号で返す） */
export function triangulateNgon(positions, poly) {
  return triangulateNgonLocal(positions, poly).map((k) => poly[k]);
}

/** 5 角形以上の分割。面内の番号（0..n-1）で、必ず n-2 個の三角形を返す（失敗時は扇形分割）。 */
export function triangulateNgonLocal(positions, poly) {
  const n = poly.length;
  const normal = newellNormal(positions, poly);
  const ax = Math.abs(normal[0]), ay = Math.abs(normal[1]), az = Math.abs(normal[2]);
  // 法線の最大成分の軸を落として 2D に投影
  let u = 0, v = 1;
  if (ax >= ay && ax >= az) { u = 1; v = 2; } else if (ay >= az) { u = 2; v = 0; }
  const contour = poly.map((vi) => new Vector2(positions[vi * 3 + u], positions[vi * 3 + v]));
  let faces = null;
  try {
    faces = ShapeUtils.triangulateShape(contour, []);
  } catch (e) {
    faces = null;
  }
  const out = [];
  if (faces && faces.length === n - 2) {
    for (const [i0, i1, i2] of faces) {
      let b = i1, c = i2;
      // 元の面の向きと揃える
      const tn = triNormal(positions, poly[i0], poly[b], poly[c]);
      if (tn[0] * normal[0] + tn[1] * normal[1] + tn[2] * normal[2] < 0) { const tmp = b; b = c; c = tmp; }
      out.push(i0, b, c);
    }
    return out;
  }
  for (let i = 1; i < n - 1; i++) out.push(0, i, i + 1);
  return out;
}

function triNormal(positions, a, b, c) {
  const ax = positions[a * 3], ay = positions[a * 3 + 1], az = positions[a * 3 + 2];
  const ux = positions[b * 3] - ax, uy = positions[b * 3 + 1] - ay, uz = positions[b * 3 + 2] - az;
  const vx = positions[c * 3] - ax, vy = positions[c * 3 + 1] - ay, vz = positions[c * 3 + 2] - az;
  return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
}

/**
 * ポリゴンの辺（三角形分割の対角線を含まない）をワイヤー表示するためのインデックス。
 * 辺 a-b を退化三角形 (a, b, b) として並べ、wireframe マテリアルで描くと
 * スキン変形にも追従する線になる。
 */
export function buildWireIndex(counts, indices, vertexCount) {
  // 辺ごとに、その辺を最初に通るコーナー（面の順）だけが出力する（大きな Set を使わない）
  const nCorner = indices.length;
  const nextV = new Int32Array(nCorner);
  let off = 0;
  for (let f = 0; f < counts.length; f++) {
    const n = counts[f];
    for (let k = 0; k < n; k++) nextV[off + k] = indices[off + ((k + 1) % n)];
    off += n;
  }
  const start = new Uint32Array(vertexCount + 1);
  for (let c = 0; c < nCorner; c++) start[indices[c] + 1]++;
  for (let v = 0; v < vertexCount; v++) start[v + 1] += start[v];
  const fill = start.slice(0, vertexCount);
  const byVertex = new Uint32Array(nCorner);
  for (let c = 0; c < nCorner; c++) byVertex[fill[indices[c]]++] = c;   // コーナー番号の昇順に並ぶ
  const out = new Uint32Array(nCorner * 3);
  let n = 0;
  for (let c = 0; c < nCorner; c++) {
    const a = indices[c], b = nextV[c];
    let first = true;
    for (let i = start[a]; i < start[a + 1] && first; i++) {
      const d = byVertex[i];
      if (d >= c) break;
      if (nextV[d] === b) first = false;               // 同じ向きで先に出てきた
    }
    for (let i = start[b]; i < start[b + 1] && first; i++) {
      const d = byVertex[i];
      if (d >= c) break;
      if (nextV[d] === a) first = false;               // 逆向き（隣の面）で先に出てきた
    }
    if (first) { out[n++] = a; out[n++] = b; out[n++] = b; }
  }
  return { index: out.slice(0, n), edgeCount: n / 3 };
}
