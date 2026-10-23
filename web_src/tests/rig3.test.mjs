// 第 3 段階（aimConstraint・シングルチェーン IK・行列ノード・offsetParentMatrix）の評価の検証
// 前提: python tools/make_rig3_sample.py（samples/rig3_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/rig3_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const FRAMES = [1, 12, 24, 36, 48];
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;

/** グラフの属性を書き換えた animation（aim の world up の種類など） */
function withAttrs(name, attrs) {
  const anim = JSON.parse(JSON.stringify(data.animation));
  const g = anim.graph.find((x) => x.name === name);
  g.attrs = { ...(g.attrs || {}), ...attrs };
  return anim;
}

function at(f, anim = data.animation, poseOf) {
  const rig = new RigEvaluator(new AnimationClip(anim), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f, poseOf);
  const W = (n) => rig.world(idx(n));
  const pos = (n) => new Vector3().setFromMatrixPosition(W(n));
  const axis = (n, k) => new Vector3().setFromMatrixColumn(W(n), k).normalize();
  return { rig, W, pos, axis };
}

test('保存時のフレームでは、動くノードがファイルの値を再現する', () => {
  const { rig } = at(1);
  for (const [ni, m] of rig.matrices) {
    const file = data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(near(v, file[k], 1e-4), `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
  assert.equal(rig.problems.size, 0, [...rig.problems].join());
});

test('aimConstraint（world up: オブジェクト）: X 軸がターゲットへ、Y 軸が up オブジェクトの側', () => {
  for (const f of FRAMES) {
    const { pos, axis } = at(f);
    const dir = pos('look_tgt').sub(pos('eye')).normalize();
    assert.ok(nearVec(axis('eye', 0), dir), `フレーム ${f}: aim`);
    const up = pos('eye_up').sub(pos('eye'));
    const y = axis('eye', 1);
    assert.ok(Math.abs(y.dot(dir)) < 1e-4 && y.dot(up) > 0, `フレーム ${f}: up`);
    assert.ok(Math.abs(axis('eye', 2).dot(up)) < 1e-4, `フレーム ${f}: Y 軸が (aim, up) の面の上`);
  }
});

test('aimConstraint（world up: ベクトル）: up (0, 0, 1) の Z 軸が world up の側', () => {
  for (const f of FRAMES) {
    const { pos, axis } = at(f);
    const dir = pos('look_tgt').sub(pos('aim_vec')).normalize();
    assert.ok(nearVec(axis('aim_vec', 0), dir), `フレーム ${f}: aim`);
    const z = axis('aim_vec', 2);
    assert.ok(z.z > 0 && Math.abs(axis('aim_vec', 1).z) < 1e-4, `フレーム ${f}: up`);
  }
});

test('aimConstraint: world up の種類（シーンの上・オブジェクトの回転・なし）とオフセット', () => {
  const base = at(24);
  const dir = base.pos('look_tgt').sub(base.pos('eye')).normalize();
  // シーンの上（y）
  const scene = at(24, withAttrs('eye_aimConstraint1', { wut: 0 }));
  assert.ok(nearVec(scene.axis('eye', 0), dir) && scene.axis('eye', 1).y > 0 && Math.abs(scene.axis('eye', 2).y) < 1e-4);
  // オブジェクトの回転（eye_up は回転なし → world up (0, 0, 1) のまま）
  const rot = at(24, withAttrs('eye_aimConstraint1', { wut: 2, wu: [0, 0, 1] }));
  assert.ok(nearVec(rot.axis('eye', 0), dir) && rot.axis('eye', 1).z > 0);
  // なし: 最短の回転
  const none = at(24, withAttrs('eye_aimConstraint1', { wut: 4 }));
  const expect = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), dir);
  const q = new Quaternion(); none.W('eye').decompose(new Vector3(), q, new Vector3());
  assert.ok(1 - Math.abs(q.dot(expect)) < 1e-6);
  // オフセット (0, 0, 90): ワールドの向き = aim の向き · Rz(90)
  const off = at(24, withAttrs('eye_aimConstraint1', { o: [0, 0, 90] }));
  const exp = new Matrix4().extractRotation(base.W('eye')).multiply(new Matrix4().makeRotationZ(Math.PI / 2));
  const got = new Matrix4().extractRotation(off.W('eye'));
  got.elements.forEach((v, k) => assert.ok(near(v, exp.elements[k]), `[${k}]`));
});

test('シングルチェーン IK（1 ボーン）: 終端がハンドルの方を向き、骨の長さが保たれる', () => {
  for (const f of FRAMES) {
    const { pos } = at(f);
    const A = pos('sc_a'), B = pos('sc_b'), H = pos('sc_ik');
    assert.ok(near(A.distanceTo(B), 5));
    assert.ok(B.clone().sub(A).normalize().dot(H.clone().sub(A).normalize()) > 1 - 1e-6, `フレーム ${f}`);
  }
  assert.ok(nearVec(at(48).pos('sc_b'), at(48).pos('sc_a').add(new Vector3(3, 5, 2).normalize().multiplyScalar(5))));
});

test('シングルチェーン IK（2 ボーン）: ハンドルに届き、FK の形の側（-z）に曲がる', () => {
  for (const f of FRAMES) {
    const { pos } = at(f);
    const A = pos('sc2_a'), B = pos('sc2_b'), C = pos('sc2_c'), H = pos('sc2_ik');
    assert.ok(nearVec(C, H, 1e-3), `フレーム ${f}: ${C.toArray()} ${H.toArray()}`);
    assert.ok(near(A.distanceTo(B), Math.sqrt(10)) && near(B.distanceTo(C), Math.sqrt(10)));
    const u = H.clone().sub(A).normalize();
    const side = B.clone().sub(A); side.addScaledVector(u, -side.dot(u));
    assert.ok(side.z < 0, `フレーム ${f}: 曲がる向き`);
  }
});

test('multMatrix・decomposeMatrix: Maya の掛ける順（ローカル軸で (2, 0, 0) ずらす）', () => {
  for (const f of FRAMES) {
    const { pos, W } = at(f);
    const ry = (f - 1) / 47 * 90 * Math.PI / 180;
    const exp = new Vector3(-20, 0, 0).add(new Vector3(2, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), ry));
    assert.ok(nearVec(pos('mm_jnt'), exp, 1e-4), `フレーム ${f}: ${pos('mm_jnt').toArray()} != ${exp.toArray()}`);
    const q = new Quaternion(); W('mm_jnt').decompose(new Vector3(), q, new Vector3());
    assert.ok(1 - Math.abs(q.dot(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), ry))) < 1e-6);
  }
});

test('composeMatrix・inverseMatrix: 移動と回転 (0, 0, 30) の逆行列', () => {
  for (const f of FRAMES) {
    const { W } = at(f);
    const tx = 1 + (f - 1) / 47 * 3;
    const exp = new Matrix4().makeTranslation(tx, 2, 3).multiply(new Matrix4().makeRotationZ(Math.PI / 6)).invert();
    W('cm_jnt').elements.forEach((v, k) => assert.ok(near(v, exp.elements[k]), `フレーム ${f}[${k}]`));
  }
});

test('offsetParentMatrix: ファイルの値（Python の行列計算）と、接続（行列による親子付け）', () => {
  const w = data.nodes[idx('opm_jnt')].worldMatrix;
  assert.deepEqual([w[12], w[13], w[14]], [6, 0, -20]);
  for (const f of FRAMES) {
    const { pos } = at(f);
    assert.ok(nearVec(pos('opm_follow'), pos('opm_src').add(new Vector3(0, 1, 0))), `フレーム ${f}`);
  }
  // ポーズ確認で opm_src を動かすと追従する
  const move = new Matrix4().makeTranslation(0, 3, 0);
  const posed = at(1, data.animation, (ni) => (ni === idx('opm_src') ? move : null));
  assert.ok(nearVec(posed.pos('opm_follow'), new Vector3(0, 4, -30)));
});

test('未対応の IK（ジョイント 4 つのシングルチェーン）は警告に出す', () => {
  assert.match(data.animation.warnings.join('\n'), /sc4_ik/);
});
