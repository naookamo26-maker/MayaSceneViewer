// ハードエッジを考慮した法線（Maya の辺のスムーズ／ハードと同じ考え方）。
//
// 面の角（コーナー）ごとに、同じ頂点を共有し、かつスムーズな辺でつながっている面どうしを
// 1 つのまとまり（スムージンググループ）にし、まとまりごとに面の法線を平均する。
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

/**
 * @param hardEdges 頂点の組 [a, b, a, b, ...]（共通 JSON の hardEdges）
 * @returns {{ group: Int32Array, normals: Float32Array }}
 *   group[コーナー] = まとまりの代表コーナー番号、normals[コーナー*3..] = そのコーナーの法線
 *
 * 頂点ごとに、その頂点を使う面の角（コーナー）を集め、隣り合う面（同じ辺を共有し、
 * その辺がスムーズ）の角どうしをつなぐ。大きな連想配列を使わないので速い。
 */
export function cornerNormals(positions, counts, indices, hardEdges, vertexCount) {
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
  for (let i = 0; i + 1 < (hardEdges ? hardEdges.length : 0); i += 2) {
    const a = hardEdges[i], b = hardEdges[i + 1];
    hard.add(a < b ? a * vertexCount + b : b * vertexCount + a);
  }
  const smooth = (v, u) => !hard.size || !hard.has(v < u ? v * vertexCount + u : u * vertexCount + v);

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
  for (let c = 0; c < nCorner; c++) {
    const r = find(c) * 3, f = faceOf[c] * 3;
    acc[r] += fn[f]; acc[r + 1] += fn[f + 1]; acc[r + 2] += fn[f + 2];
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
