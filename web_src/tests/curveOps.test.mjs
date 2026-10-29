// カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）と nearestPointOnCurve の検証
// 前提: python tools/make_curve_ops_sample.py（samples/curve_ops_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { curveSegment, domain, nearestParam, parseNurbsCurve, pointAt, rebuildCurve, reverseCurve } from '../src/curve.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/curve_ops_sample.json'), 'utf8'));
const curveOf = (n) => parseNurbsCurve(data.curves.find((c) => c.name === n).cc);
const idx = (n) => data.nodes.findIndex((x) => x.name === n);
const graph = (n) => data.animation.graph.find((g) => g.name === n);
const maxDist = (a, b, [u0, u1], [v0, v1] = [u0, u1], n = 40) => {
  let m = 0;
  for (let i = 0; i <= n; i++) m = Math.max(m, pointAt(a, u0 + (u1 - u0) * i / n).distanceTo(pointAt(b, v0 + (v1 - v0) * i / n)));
  return m;
};
const src = curveOf('srcShape');

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('読み込みで焼き付けた形（Python）と、ビューアの同じ計算（JS）が一致する', () => {
  const rb = curveOf('rbShape');
  assert.deepEqual(domain(rb), [0, 1]);
  assert.ok(maxDist(rb, rebuildCurve(src, { spans: 8, degree: 3, keepRange: 0, multipleEnds: true }), [0, 1]) < 1e-5, 'rebuildCurve');
  assert.ok(maxDist(curveOf('rvShape'), reverseCurve(src), [0, 4]) < 1e-5, 'reverseCurve');
  assert.ok(maxDist(curveOf('dt0Shape'), curveSegment(src, 0, 1.5), [0, 1.5]) < 1e-5, 'detachCurve の出力 0');
  assert.ok(maxDist(curveOf('dt2Shape'), curveSegment(src, 2.5, 4), [2.5, 4]) < 1e-5, 'detachCurve の出力 2');
  assert.ok(maxDist(curveOf('scShape'), curveSegment(src, 1, 3), [1, 3]) < 1e-5, 'subCurve');
  assert.ok(maxDist(curveOf('scShape'), src, [1, 3]) < 1e-5, '切り出した部分は元の形のまま');
});

test('作り直したカーブは元の形に近く、端の点を保つ', () => {
  const rb = curveOf('rbShape');
  assert.ok(pointAt(rb, 0).distanceTo(new Vector3(0, 0, 0)) < 1e-5 && pointAt(rb, 1).distanceTo(new Vector3(6, 0, 0)) < 1e-5);
  assert.ok(maxDist(rb, src, [0, 1], [0, 4]) < 0.05, `最大のずれ ${maxDist(rb, src, [0, 1], [0, 4])}`);
});

test('動くヒストリ: 入力のカーブが動くと、rebuildCurve をフレームごとに評価する', () => {
  assert.ok(graph('dyn_rebuild'), '動くヒストリはリグとして評価する');
  for (const f of [1, 12, 24]) {
    const rig = at(f);
    const ty = 3 * (f - 1) / 23;
    const moved = parseNurbsCurve(data.curves.find((c) => c.name === 'dynSrcShape').cc);
    moved.cvs[6] = new Vector3(6, ty, 0);
    const exp = rebuildCurve(moved, { spans: 6, degree: 3, keepRange: 1, multipleEnds: true });
    const got = rig.plug(graph('dynShape').id, 'local');
    assert.ok(maxDist(got, exp, [0, 4]) < 1e-9, `フレーム ${f}`);
    assert.ok(pointAt(got, 4).distanceTo(new Vector3(6, ty, 0)) < 1e-6, '終端はロケーターの位置');
  }
});

test('nearestPointOnCurve: いちばん近い点の位置（.p）とパラメータ（.pr）', () => {
  for (const f of [1, 8, 16, 24]) {
    const rig = at(f);
    const probe = new Vector3(6 * (f - 1) / 23, 3, 0);
    const u = rig.chan(idx('nj2')).t[0];
    const p = new Vector3(...rig.chan(idx('nj')).t);
    assert.ok(Math.abs(u - nearestParam(src, probe)) < 1e-6, `パラメータ ${f}`);
    assert.ok(p.distanceTo(pointAt(src, u)) < 1e-6, '位置はそのパラメータの点');
    let best = Infinity;
    for (let i = 0; i <= 4000; i++) best = Math.min(best, pointAt(src, 4 * i / 4000).distanceTo(probe));
    assert.ok(p.distanceTo(probe) <= best + 1e-6, `いちばん近い点 ${f}: ${p.distanceTo(probe)} / ${best}`);
  }
});

test('スプライン IK: 作り直したカーブ（焼き付けた形）に沿ってジョイントが並ぶ', () => {
  const rig = at(1);
  const rb = curveOf('rbShape');
  for (const n of ['sp_0', 'sp_1', 'sp_2', 'sp_3', 'sp_4']) {
    const p = new Vector3().setFromMatrixPosition(rig.world(idx(n)));
    const u = nearestParam(rb, p);
    assert.ok(pointAt(rb, u).distanceTo(p) < 1e-3, `${n} はカーブの上: ${pointAt(rb, u).distanceTo(p)}`);
  }
});
