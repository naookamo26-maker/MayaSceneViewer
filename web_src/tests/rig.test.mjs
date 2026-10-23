// リグ（コンストレイント・IK・計算ノード）の評価の検証: node --test tests/rig.test.mjs
// 前提: python tools/make_rig_sample.py（samples/rig_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/rig_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const FRAMES = [1, 7.5, 12, 24, 36, 48];

function makeRig() {
  const clip = new AnimationClip(data.animation);
  const rig = new RigEvaluator(clip, data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  return { clip, rig };
}

/** フレーム f で評価し、ワールド行列を返す関数を作る */
function at(f, poseOf) {
  const { rig } = makeRig();
  rig.evaluate(f, poseOf);
  return { rig, world: (n) => rig.world(idx(n)), pos: (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n))) };
}

const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;
const rot = (m) => { const q = new Quaternion(); m.decompose(new Vector3(), q, new Vector3()); return q; };
const sameRot = (a, b, tol = 1e-4) => 1 - Math.abs(a.dot(b)) < tol;

test('保存時のフレームでは、すべてのノードがファイルの値を再現する（IK・コンストレイント・計算ノードを含む）', () => {
  const { rig } = makeRig();
  const mats = rig.evaluate(1);
  const skip = new Set([idx('expr_jnt')]);           // 未対応のノードで動く（ファイルに値がない）
  for (const [ni, m] of mats) {
    if (skip.has(ni)) continue;
    const file = data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(near(v, file[k], 1e-4), `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
  assert.equal(rig.problems.size, 0, [...rig.problems].join(', '));
});

test('IK: 手首がハンドルに届き、骨の長さが保たれ、肘が極ベクトルの側に曲がる', () => {
  for (const f of FRAMES) {
    const { pos, rig } = at(f);
    const A = pos('shoulder'), B = pos('elbow'), C = pos('wrist'), H = pos('arm_ik'), PV = pos('elbow_pv');
    assert.ok(nearVec(C, H, 1e-3), `フレーム ${f}: 手首 ${C.toArray()} ハンドル ${H.toArray()}`);
    assert.ok(near(A.distanceTo(B), Math.sqrt(26)) && near(B.distanceTo(C), Math.sqrt(26)), `フレーム ${f}: 骨の長さ`);
    // 肘は (肩, ハンドル, 極ベクトルの目標) の面の上で、目標の側
    const u = H.clone().sub(A).normalize();
    const v = PV.clone().sub(A); v.addScaledVector(u, -v.dot(u)).normalize();
    const n = u.clone().cross(v);
    const e = B.clone().sub(A);
    assert.ok(Math.abs(e.dot(n)) < 1e-3, `フレーム ${f}: 肘が面の上にない ${e.dot(n)}`);
    assert.ok(e.dot(v) > 0, `フレーム ${f}: 肘が極ベクトルの反対側`);
    assert.equal(rig.problems.size, 0);
  }
  // 動いていること（フレーム 24 でハンドルは (7, 13, 0)）
  assert.ok(nearVec(at(24).pos('wrist'), new Vector3(7, 13, 0), 1e-3));
});

test('ハンドルが届かないときは、ハンドルの方向にまっすぐ伸びる', () => {
  const far = new Matrix4().makeTranslation(30, 0, 0);
  const poseOf = (ni) => (ni === idx('hand_ctrl') ? far : null);
  const { pos } = at(1, poseOf);
  const A = pos('shoulder'), C = pos('wrist'), H = pos('arm_ik');
  assert.ok(near(A.distanceTo(C), 2 * Math.sqrt(26), 1e-3));
  const dir = H.clone().sub(A).normalize();
  assert.ok(C.clone().sub(A).normalize().dot(dir) > 0.9999);
});

test('ポーズ確認でコントローラーを動かすと、IK とコンストレイントが追従する', () => {
  const move = new Matrix4().makeTranslation(-2, 1, 1);
  const poseOf = (ni) => (ni === idx('hand_ctrl') ? move : null);
  const { pos } = at(1, poseOf);
  assert.ok(nearVec(pos('wrist'), new Vector3(8, 11, 1), 1e-3), pos('wrist').toArray().join());
  assert.ok(nearVec(pos('prop'), new Vector3(10, 11, 1), 1e-3), '箱は手首の位置 + (2, 0, 0)');
});

test('orientConstraint: 手首のワールドの向きがコントローラーと同じ', () => {
  for (const f of FRAMES) {
    const { world } = at(f);
    assert.ok(sameRot(rot(world('wrist')), rot(world('hand_ctrl'))), `フレーム ${f}`);
  }
  // フレーム 48 で z 軸まわり 30 度
  const q = rot(at(48).world('wrist'));
  assert.ok(sameRot(q, new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), 30 * Math.PI / 180)));
});

test('parentConstraint: 箱 = 手首 · 移動 (2, 0, 0) · 回転 (0, 0, 90)', () => {
  for (const f of FRAMES) {
    const { world } = at(f);
    const exp = world('wrist').clone().multiply(new Matrix4().makeTranslation(2, 0, 0))
      .multiply(new Matrix4().makeRotationZ(Math.PI / 2));
    world('prop').elements.forEach((v, k) => assert.ok(near(v, exp.elements[k], 1e-4), `フレーム ${f}[${k}]`));
  }
});

test('pointConstraint: カーブで動くウェイトで 2 つのターゲットの間を動く', () => {
  assert.ok(near(at(1).pos('head').x, 0));            // ウェイト 1 : 1
  assert.ok(near(at(48).pos('head').x, 2.5));          // ウェイト 1 : 3 → (-5 + 15) / 4
  assert.ok(near(at(48).pos('head').y, 20));
});

test('scaleConstraint: ターゲットと同じワールドのスケール', () => {
  const s = new Vector3();
  at(24).world('scl_jnt').decompose(new Vector3(), new Quaternion(), s);
  assert.ok(nearVec(s, new Vector3(2, 2, 2)));
});

test('計算ノード: multiplyDivide・plusMinusAverage・reverse・unitConversion・condition・blendColors・pairBlend', () => {
  for (const f of FRAMES) {
    const ty = (f - 1) / 47;                             // ctrl_util.ty（1 → 0、48 → 1 のリニア）
    const { rig } = at(f);
    const u = rig.chan(idx('util_jnt'));
    assert.ok(near(u.t[0], 4 * ty + 1), `フレーム ${f} tx ${u.t[0]}`);
    assert.ok(near(u.r[2], 90 * (1 - ty), 1e-3), `フレーム ${f} rz ${u.r[2]}`);
    assert.equal(u.s[1], ty > 0.5 ? 2 : 1);
    assert.ok(near(u.s[2], 1.5));
    const p = rig.chan(idx('pb_jnt'));
    assert.ok(near(p.t[0], 1) && near(p.t[1], 0.5 * ty), `フレーム ${f} pb t ${p.t}`);
    assert.ok(near(p.r[2], 45, 1e-3));
  }
});

test('未対応のノードは警告に出し、評価しない', () => {
  const w = data.animation.warnings.join('\n');
  assert.match(w, /expression/);
  assert.match(w, /animCurveUA/);
  const { rig } = at(24);
  assert.deepEqual(rig.chan(idx('expr_jnt')).r, [0, 0, 0]);
});

test('ノードを動かしているものの説明', () => {
  const { rig } = makeRig();
  assert.ok(rig.driversOf(idx('elbow')).some((s) => s.includes('arm_ik')));
  assert.ok(rig.driversOf(idx('prop')).some((s) => s.includes('parentConstraint')));
});

test('ジョイントの向き・回転順・rotateAxis があっても、IK と orientConstraint が成り立つ', () => {
  const anim = JSON.parse(JSON.stringify(data.animation));
  const set = (name, v) => Object.assign(anim.nodes.find((n) => n.node === idx(name)), v);
  set('shoulder', { jo: [10, 20, 30], ro: 3, ra: [5, -5, 0] });
  set('elbow', { jo: [0, 0, -15], ro: 1, r: [0, 0, -10] });
  set('wrist', { jo: [30, 0, 10], ro: 4, ra: [0, 10, 0] });
  const clip = new AnimationClip(anim);
  const rig = new RigEvaluator(clip, data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  for (const f of FRAMES) {
    rig.evaluate(f);
    const p = (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n)));
    const A = p('shoulder'), B = p('elbow'), C = p('wrist'), H = p('arm_ik'), PV = p('elbow_pv');
    // 肩の向きを変えたので、骨の長さはファイルの位置から（移動の値は変わらない）
    assert.ok(nearVec(C, H, 1e-3), `フレーム ${f}: 手首 ${C.toArray()} ハンドル ${H.toArray()}`);
    assert.ok(near(A.distanceTo(B), Math.sqrt(26)) && near(B.distanceTo(C), Math.sqrt(26)));
    const u = H.clone().sub(A).normalize();
    const v = PV.clone().sub(A); v.addScaledVector(u, -v.dot(u)).normalize();
    assert.ok(Math.abs(B.clone().sub(A).dot(u.clone().cross(v))) < 1e-3, `フレーム ${f}: 肘が面の上にない`);
    assert.ok(B.clone().sub(A).dot(v) > 0, `フレーム ${f}: 肘が極ベクトルの反対側`);
    assert.ok(sameRot(rot(rig.world(idx('wrist'))), rot(rig.world(idx('hand_ctrl')))), `フレーム ${f}: 手首の向き`);
  }
});
