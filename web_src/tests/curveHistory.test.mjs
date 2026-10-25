// ヒストリのあるカーブ（形を作るノードから形を求めたもの）の表示とスプライン IK の検証
// 前提: python tools/make_curve_history_sample.py（samples/curve_history_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { parseNurbsCurve, polyline } from '../src/curve.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/curve_history_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const tx = (f) => 5 * (f - 1) / 23;

test('形を作るノード（circle・transformGeometry）から求めた形のカーブを表示する', () => {
  const byName = Object.fromEntries(data.curves.map((c) => [c.name, c]));
  assert.deepEqual(Object.keys(byName).sort(), ['hexBShape', 'ringAShape', 'spC_curveShape']);
  const ring = parseNurbsCurve(byName.ringAShape.cc);
  assert.ok(ring, 'ringAShape');
  // 半径 2 の円: カーブ上の点は、中心から距離 2（法線 +Y なので y = 0）
  const { pts } = polyline(ring);
  assert.ok(pts.length > 16);
  for (const p of pts) {
    assert.ok(near(Math.hypot(p.x, p.z), 2, 2e-2) && near(p.y, 0), `ringA の点 ${p.toArray()}`);
  }
  const spc = parseNurbsCurve(byName.spC_curveShape.cc);
  assert.ok(spc.cvs.every((c) => near(c.x, 20)), 'transformGeometry で X に 20 移動');
});

test('スプライン IK は、transformGeometry から求めた形のカーブに沿う（カーブの transform のキーにも付いてくる）', () => {
  for (const f of [1, 12, 24]) {
    const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
    rig.evaluate(f);
    for (let i = 0; i < 5; i++) {
      const p = new Vector3().setFromMatrixPosition(rig.world(idx(`spC_${i}`)));
      assert.ok(near(p.x, 20 + tx(f)) && near(p.y, 2 * i) && near(p.z, 0), `フレーム ${f}: spC_${i} ${p.toArray()}`);
    }
    assert.deepEqual([...rig.problems], []);
  }
});
