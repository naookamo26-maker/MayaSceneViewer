// コンポーネントタグ（Maya 2022 以降。cluster が変形する CV をタグで選ぶ）の評価の検証
// 前提: python tools/make_component_tag_sample.py（samples/component_tag_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { pointAt, polyline } from '../src/curve.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/component_tag_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const gid = (n) => data.animation.graph.find((g) => g.name === n).id;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;
const lin = (f, a, b) => a + (b - a) * (f - 1) / 47;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('cluster はタグで選んだ CV だけを動かし、ワイヤーが曲がる', () => {
  for (const f of [1, 24, 48]) {
    const rig = at(f);
    const drv = rig.plug(gid('fin_drvShape'), 'ws');
    assert.ok(nearVec(drv.cvs[0], new Vector3(0, 0, 5)), `フレーム ${f}: CV 0 ${drv.cvs[0].toArray()}`);
    assert.ok(nearVec(drv.cvs[1], new Vector3(8 / 3, 0, 5)), `フレーム ${f}: CV 1 ${drv.cvs[1].toArray()}`);
    assert.ok(nearVec(drv.cvs[2], new Vector3(16 / 3, lin(f, 0, 1.5), 5)), `フレーム ${f}: CV 2 ${drv.cvs[2].toArray()}`);
    assert.ok(nearVec(drv.cvs[3], new Vector3(8, lin(f, 0, 3), 5)), `フレーム ${f}: CV 3 ${drv.cvs[3].toArray()}`);
    // スレイブのカーブはワイヤーに沿って曲がり（CV がワイヤーの対応する点に乗る）、骨はその上にある
    const slave = rig.plug(gid('fin_slaveShape'), 'ws');
    for (let k = 0; k < 4; k++) assert.ok(nearVec(slave.cvs[k], pointAt(drv, k / 3), 2e-3), `フレーム ${f}: スレイブの CV ${k} ${slave.cvs[k].toArray()}`);
    const { pts } = polyline(slave, 256);
    for (let i = 0; i < 5; i++) {
      const p = new Vector3().setFromMatrixPosition(rig.world(idx(`fin_${i}`)));
      assert.ok(Math.min(...pts.map((q) => q.distanceTo(p))) < 0.05, `フレーム ${f}: fin_${i} がカーブの上にない`);
    }
  }
});

test('タグの式が "*" の cluster は全部の CV を動かす', () => {
  const rig = at(48);
  const c = rig.plug(gid('fin_allShape'), 'ws');
  const xs = [0, 8 / 3, 16 / 3, 8];
  c.cvs.forEach((p, k) => assert.ok(nearVec(p, new Vector3(xs[k], 2, -5)), `CV ${k} ${p.toArray()}`));
});

test('再現チェックのスプライン IK の詳細: ワイヤーの上流の cluster（ハンドル・動かす CV）を並べる', () => {
  const rig = at(48);
  const h = rig.verifySaved((n) => rig.fileRestLocal(n)).find((x) => x.handle === 'fin_ik');
  const w = h.detail.spline.chain.find((s) => s.type === 'wire').wires[0];
  assert.deepEqual(w.driver.map((s) => s.name),
    ['fin_drvShape', 'fin_k4', 'fin_k3', 'fin_k2', 'fin_k1', 'fin_drvShapeOrig']);
  const k4 = w.driver[1];
  assert.equal(k4.handle, 'fin_k4Handle.wm');
  assert.deepEqual(k4.handlePos, [0, 3, 0]);
  assert.equal(k4.pm, 'なし（単位行列）');
  assert.deepEqual(k4.tagged, [3]);
  assert.deepEqual(k4.movedCvs, [[3, 3]]);
  assert.deepEqual(w.driver[4].movedCvs, []);           // fin_k1 のハンドルは動かない
});

test('parentConstraint はターゲットの回転ピボットに、動かされるノードの回転ピボットを合わせる', () => {
  for (const f of [1, 24, 48]) {
    const rig = at(f);
    const lead = new Vector3().setFromMatrixPosition(rig.world(idx('fin_lead')));
    const follow = new Vector3().setFromMatrixPosition(rig.world(idx('fin_follow')));
    assert.ok(nearVec(lead, new Vector3(1, lin(f, 0, 2), 0)), `フレーム ${f}: fin_lead ${lead.toArray()}`);
    // ピボットのワールド位置: fin_lead (6 + 1, y, 0) = fin_follow (4 + tx, y, 0) → tx = 3
    assert.ok(nearVec(follow, new Vector3(3, lin(f, 0, 2), 0)), `フレーム ${f}: fin_follow ${follow.toArray()}`);
  }
});
