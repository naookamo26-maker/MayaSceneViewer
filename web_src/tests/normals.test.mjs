// 頂点法線の重み（Maya の mesh の vertexNormalMethod。Autodesk の技術資料）: 0 重みなし・1 角度・2 面積・3 角度 × 面積（既定）
import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { cornerNormals } from '../src/normals.js';

// 頂点 0 を共有し、辺 0–2 でつながる 2 つの面。A は xy 平面（頂点 0 の角 90 度・面積 2）、B は yz 平面で傾いた細い三角形
const P = [new Vector3(0, 0, 0), new Vector3(2, 0, 0), new Vector3(0, 2, 0), new Vector3(0, 1, -3)];
const positions = Float32Array.from(P.flatMap((p) => p.toArray()));
const counts = [3, 3];
const indices = [0, 1, 2, 0, 2, 3];

function expected(method) {
  const acc = new Vector3();
  for (let f = 0; f < 2; f++) {
    const [a, b, c] = indices.slice(f * 3, f * 3 + 3).map((i) => P[i]);
    const cross = b.clone().sub(a).cross(c.clone().sub(a));
    const area = cross.length() / 2;
    const angle = b.clone().sub(a).angleTo(c.clone().sub(a));      // 頂点 0（どちらの面でも先頭）での角
    const w = (method === 1 || method === 3 ? angle : 1) * (method === 2 || method === 3 ? area : 1);
    acc.addScaledVector(cross.normalize(), w);
  }
  return acc.normalize();
}

test('頂点法線の重みの 4 種類（頂点 0 のコーナー）', () => {
  const seen = [];
  for (const method of [0, 1, 2, 3]) {
    const { normals } = cornerNormals(positions, counts, indices, [], 4, method);
    const n = new Vector3(normals[0], normals[1], normals[2]);
    assert.ok(n.distanceTo(expected(method)) < 1e-6, `method ${method}: ${n.toArray()} != ${expected(method).toArray()}`);
    for (const m of seen) assert.ok(n.distanceTo(m) > 1e-3, `method ${method} が別の種類と同じ`);
    seen.push(n);
  }
  // 省略時は 3（Maya の既定）
  const d = cornerNormals(positions, counts, indices, [], 4).normals;
  assert.ok(new Vector3(d[0], d[1], d[2]).distanceTo(expected(3)) < 1e-6);
});
