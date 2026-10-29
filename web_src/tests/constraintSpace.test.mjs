// コンストレイントの空間と行列の分け方の検証（Maya が保存した実物のリグとの照合で確かめた解釈）
// 前提: python tools/make_constraint_space_sample.py（samples/constraint_space_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip, decomposeMaya, mayaEuler } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/constraint_space_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const nearVec = (a, b, tol = 1e-6) => a.every((x, i) => Math.abs(x - b[i]) <= tol);
const FRAMES = [1, 7, 12, 24];
const tx = (f) => 4 * (f - 1) / 23;
const rz = (f) => 90 * (f - 1) / 23;
const D2R = Math.PI / 180;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  const pos = (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n))).toArray();
  const chan = (n) => rig.chan(idx(n));
  return { rig, pos, chan };
}
const tgtA = (f) => { const a = rz(f) * D2R; return [tx(f) + 10 * Math.cos(a) - 2 * Math.sin(a), 10 * Math.sin(a) + 2 * Math.cos(a), 0]; };

test('警告しない', () => {
  assert.deepEqual(data.warnings || [], []);
  assert.deepEqual(data.animation.warnings || [], []);
});

test('offsetParentMatrix は親の空間に入る: コンストレイントは opm を含む親の空間で値を決める', () => {
  for (const f of FRAMES) {
    const { pos, chan } = at(f), p = tgtA(f);
    assert.ok(nearVec(pos('opmJ'), p), `フレーム ${f}: opmJ ${pos('opmJ')} ターゲット ${p}`);
    assert.ok(nearVec(chan('opmJ').t, [p[0] - 5, p[1], p[2]]), `移動の値は opm を除いた分 ${chan('opmJ').t}`);
  }
});

test('.matrix・.inverseMatrix は opm を含まない、.parentMatrix は opm を含む', () => {
  for (const f of FRAMES) {
    const { chan } = at(f), p = tgtA(f);
    assert.ok(nearVec(chan('rM').t, [p[0] - 5, p[1], 0]), `.m ${chan('rM').t}`);
    assert.ok(nearVec(chan('rP').t, [5, 0, 0]), `.pm ${chan('rP').t}`);
    assert.ok(nearVec(chan('rI').t, [5 - p[0], -p[1], 0]), `.im ${chan('rI').t}`);
  }
});

test('scaleConstraint はターゲットのスケールの加重幾何平均（1 と 4 → 2）', () => {
  assert.ok(nearVec(at(1).chan('sC').s, [2, 2, 2]));
});

test('コンストレイントは rotateAxis を使わない（回転の値はターゲットの回転のまま）', () => {
  for (const f of FRAMES) assert.ok(nearVec(at(f).chan('raJ').r, [0, 0, rz(f)], 1e-6), `フレーム ${f}: ${at(f).chan('raJ').r}`);
});

test('ウェイトがすべて 0 なら、enableRestPosition でレストの値（.rst・.rsrr）', () => {
  const { chan } = at(12);
  assert.ok(nearVec(chan('restJ').t, [1, 2, 3]) && nearVec(chan('restJ').r, [0, 0, 45], 1e-9));
});

test('行列から回転の値: Maya と同じく 0 に近い角度（(180, 30, 180) ではなく (0, 150, 0)）', () => {
  assert.ok(nearVec(at(1).chan('eJ').r, [0, 150, 0], 1e-9), `${at(1).chan('eJ').r}`);
});

test('parentConstraint は前回の値（.lr）に近い角度を選ぶ', () => {
  assert.ok(nearVec(at(1).chan('lrJ').r, [0, 360, 0], 1e-9), `${at(1).chan('lrJ').r}`);
});

test('ジョイント 2 つの回転プレーン IK: 骨がハンドルの方を向く', () => {
  for (const f of FRAMES) {
    const { pos } = at(f), a = rz(f) * D2R;
    const h = new Vector3(tx(f) - 3 * Math.sin(a), 3 * Math.cos(a), 0);
    const e1 = new Vector3(...pos('e1'));
    assert.ok(Math.abs(e1.length() - 2) < 1e-9 && e1.clone().normalize().distanceTo(h.normalize()) < 1e-9, `フレーム ${f}: ${e1.toArray()}`);
  }
});

test('ターゲットの位置は (translate + rotatePivot + rotatePivotTranslate) · 親（scalePivot・スケールによらない）', () => {
  assert.ok(nearVec(at(1).pos('pvJ'), [1, 0, 0]), `${at(1).pos('pvJ')}`);
});

test('mayaEuler: どの回転順でも元の回転に戻り、2 通りの角度のうち 0 に近い方・真ん中が ±90° なら最後の軸を 0', () => {
  for (const order of ['ZYX', 'XZY', 'YXZ', 'YZX', 'ZXY', 'XYZ']) {
    for (let k = 0; k < 200; k++) {
      const q = new Quaternion(Math.sin(k), Math.cos(3 * k), Math.sin(5 * k + 1), Math.cos(7 * k + 2)).normalize();
      const e = mayaEuler(q, order);
      const back = new Quaternion().setFromEuler(new Euler(e[0], e[1], e[2], order));
      assert.ok(Math.abs(Math.abs(q.dot(back)) - 1) < 1e-9, `${order} ${k}`);
    }
  }
  const deg = (v) => v.map((x) => Math.round(x / D2R * 1000) / 1000);
  const q = (x, y, z) => new Quaternion().setFromEuler(new Euler(x * D2R, y * D2R, z * D2R, 'ZYX'));
  assert.deepEqual(deg(mayaEuler(q(-90, -79.986, -158.714), 0)), [90, -100.014, 21.286]);
  assert.deepEqual(deg(mayaEuler(q(0, 90, 3.689), 0)), [-3.689, 90, 0]);
  assert.deepEqual(deg(mayaEuler(q(0, 0, 0), 0, [0, 2 * Math.PI, 0])), [0, 360, 0]);
  // 鏡に映した行列: 反転は 3 軸のスケール
  assert.deepEqual(decomposeMaya(new Matrix4().makeScale(-1, 1, 1)).s.toArray(), [-1, -1, -1]);
});
