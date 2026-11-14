// ハードエッジを考慮した法線（Maya の辺のスムーズ／ハードと同じ考え方）。
//
// 面の角（コーナー）ごとに、同じ頂点を共有し、かつスムーズな辺でつながっている面どうしを
// 1 つのまとまり（スムージンググループ）にし、まとまりごとに面の法線を重み付きで足す。
// 重みは Maya の mesh の vertexNormalMethod（.vnm。Autodesk の技術資料）: 0 重みなし（単純な平均）・1 角度（面の辺が
// その頂点で作る角度）・2 面積・3 角度と面積（既定。角度 × 面積とする）。
// ハードエッジをまたぐ面どうしは別のまとまりになるので、そこで陰影が切れる。

/** Newell 法の面法線（長さは面積の 2 倍。平均すると面積の重み付きになる） */
function faceNormals(positions, counts, indices) {
  const out = new Float32Array(counts.length * 3);
  let off = 0;
  for (let f = 0; f < counts.length; f++) {
    const n = counts[f];
    let nx = 0, ny = 0, nz = 0;
    for (let k = 0; k < n; k++) {
      const a = indices[off + k] * 3, b = indices[off + ((k + 1) % n)] * 3;
      nx += (positions[a + 1] - positions[b + 1]) * (positions[a + 2] + positions[b + 2]);
      ny += (positions[a + 2] - positions[b + 2]) * (positions[a] + positions[b]);
      nz += (positions[a] - positions[b]) * (positions[a + 1] + positions[b + 1]);
    }
    out[f * 3] = nx; out[f * 3 + 1] = ny; out[f * 3 + 2] = nz;
    off += n;
  }
  return out;
}

/** 頂点 v での、前の頂点 p と次の頂点 q への辺のなす角（ラジアン） */
function cornerAngle(positions, v, p, q) {
  const vx = positions[v * 3], vy = positions[v * 3 + 1], vz = positions[v * 3 + 2];
  const ax = positions[p * 3] - vx, ay = positions[p * 3 + 1] - vy, az = positions[p * 3 + 2] - vz;
  const bx = positions[q * 3] - vx, by = positions[q * 3 + 1] - vy, bz = positions[q * 3 + 2] - vz;
  const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
  return Math.atan2(Math.sqrt(cx * cx + cy * cy + cz * cz), ax * bx + ay * by + az * bz);
}

/**
 * @param hardEdges 頂点の組 [a, b, a, b, ...]（共通 JSON の hardEdges）
 * @param method 頂点法線の重みの種類（共通 JSON の meshes の normalMethod。省略時は 3 = 角度と面積）
 * @returns {{ group: Int32Array, normals: Float32Array }}
 *   group[コーナー] = まとまりの代表コーナー番号、normals[コーナー*3..] = そのコーナーの法線
 *
 * 頂点ごとに、その頂点を使う面の角（コーナー）を集め、隣り合う面（同じ辺を共有し、
 * その辺がスムーズ）の角どうしをつなぐ。大きな連想配列を使わないので速い。
 */
export function cornerNormals(positions, counts, indices, hardEdges, vertexCount, method = 3) {
  const nCorner = indices.length;
  const nFace = counts.length;
  const fn = faceNormals(positions, counts, indices);
  // コーナーごとの面・前後の頂点
  const faceOf = new Uint32Array(nCorner);
  const prevV = new Int32Array(nCorner);
  const nextV = new Int32Array(nCorner);
  let off = 0;
  for (let f = 0; f < nFace; f++) {
    const n = counts[f];
    for (let k = 0; k < n; k++) {
      const c = off + k;
      faceOf[c] = f;
      prevV[c] = indices[off + ((k + n - 1) % n)];
      nextV[c] = indices[off + ((k + 1) % n)];
    }
    off += n;
  }
  // 頂点 → コーナーの一覧（CSR 形式）
  const start = new Uint32Array(vertexCount + 1);
  for (let c = 0; c < nCorner; c++) start[indices[c] + 1]++;
  for (let v = 0; v < vertexCount; v++) start[v + 1] += start[v];
  const fill = start.slice(0, vertexCount);
  const byVertex = new Uint32Array(nCorner);
  for (let c = 0; c < nCorner; c++) byVertex[fill[indices[c]]++] = c;

  // ハードエッジ（少ないので Set で十分）
  const hard = new Set();
  const onHard = new Uint8Array(vertexCount);            // ハードエッジの端の頂点か（Set を引く回数を減らす）
  for (let i = 0; i + 1 < (hardEdges ? hardEdges.length : 0); i += 2) {
    const a = hardEdges[i], b = hardEdges[i + 1];
    hard.add(a < b ? a * vertexCount + b : b * vertexCount + a);
    if (a < vertexCount) onHard[a] = 1;
    if (b < vertexCount) onHard[b] = 1;
  }
  const smooth = (v, u) => !onHard[v] || !onHard[u] || !hard.has(v < u ? v * vertexCount + u : u * vertexCount + v);

  const parent = new Int32Array(nCorner);
  for (let c = 0; c < nCorner; c++) parent[c] = c;
  const find = (c) => {
    while (parent[c] !== c) { parent[c] = parent[parent[c]]; c = parent[c]; }
    return c;
  };
  for (let v = 0; v < vertexCount; v++) {
    const a = start[v], b = start[v + 1];
    for (let i = a; i < b; i++) {
      const ci = byVertex[i];
      for (let j = i + 1; j < b; j++) {
        const cj = byVertex[j];
        // 同じ辺（v と共通の隣の頂点）を共有し、その辺がスムーズならつなぐ
        let u = -1;
        if (prevV[ci] === prevV[cj] || prevV[ci] === nextV[cj]) u = prevV[ci];
        else if (nextV[ci] === prevV[cj] || nextV[ci] === nextV[cj]) u = nextV[ci];
        if (u < 0 || u === v || !smooth(v, u)) continue;
        const ri = find(ci), rj = find(cj);
        if (ri !== rj) parent[rj] = ri;
      }
    }
  }
  const acc = new Float64Array(nCorner * 3);
  const byArea = method === 2 || method === 3, byAngle = method === 1 || method === 3;
  for (let c = 0; c < nCorner; c++) {
    const r = find(c) * 3, f = faceOf[c] * 3;
    let w = 1;
    if (!byArea) {                                        // 面の法線の長さ（面積）を使わない
      const l = Math.sqrt(fn[f] * fn[f] + fn[f + 1] * fn[f + 1] + fn[f + 2] * fn[f + 2]);
      w = l > 0 ? 1 / l : 0;
    }
    if (byAngle) w *= cornerAngle(positions, indices[c], prevV[c], nextV[c]);
    acc[r] += fn[f] * w; acc[r + 1] += fn[f + 1] * w; acc[r + 2] += fn[f + 2] * w;
  }
  const group = new Int32Array(nCorner);
  const normals = new Float32Array(nCorner * 3);
  for (let c = 0; c < nCorner; c++) {
    const r = find(c);
    group[c] = r;
    const x = acc[r * 3], y = acc[r * 3 + 1], z = acc[r * 3 + 2];
    const l = Math.sqrt(x * x + y * y + z * z) || 1;   // Math.hypot は遅い
    normals[c * 3] = x / l; normals[c * 3 + 1] = y / l; normals[c * 3 + 2] = z / l;
  }
  return { group, normals };
}
