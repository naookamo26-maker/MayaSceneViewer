// 第 4 段階（displayLayer・四元数ノード・3 本以上のジョイントの IK・スプライン IK）の評価の検証
// 前提: python tools/make_ik_sample.py（samples/ik_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { arcLength, makeCurve, parseNurbsCurve, pointAt, polyline } from '../src/curve.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/ik_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const gid = (n) => data.animation.graph.find((g) => g.name === n).id;
const FRAMES = [1, 12, 24, 36, 48];
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;
const sameRot = (a, b, tol = 1e-6) => 1 - Math.abs(a.dot(b)) < tol;

function at(f, poseOf) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f, poseOf);
  const W = (n) => rig.world(idx(n));
  const pos = (n) => new Vector3().setFromMatrixPosition(W(n));
  const rot = (n) => { const q = new Quaternion(); W(n).decompose(new Vector3(), q, new Vector3()); return q; };
  return { rig, W, pos, rot };
}

test('NURBS カーブの評価: 端点・直線・長さ', () => {
  const c = parseNurbsCurve([3, 1, 0, 0, 3, 6, 0, 0, 0, 1, 1, 1, 4, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0]);
  assert.ok(nearVec(pointAt(c, 0), new Vector3(0, 0, 0)) && nearVec(pointAt(c, 1), new Vector3(3, 0, 0)));
  assert.ok(near(arcLength(c), 3, 1e-6));
  // 複数スパン（ノットの両端を補う）でも端点を通る
  const c2 = parseNurbsCurve([3, 2, 0, 0, 3, 7, 0, 0, 0, 1, 2, 2, 2, 5, 0, 0, 0, 1, 1, 0, 2, 2, 0, 3, 1, 0, 4, 0, 0]);
  assert.ok(nearVec(pointAt(c2, 0), new Vector3(0, 0, 0)) && nearVec(pointAt(c2, 2), new Vector3(4, 0, 0)));
  assert.equal(makeCurve(1, 0, [0, 0, 1, 1], [new Vector3(), new Vector3(1, 0, 0)]).degree, 1);
});

test('保存時のフレームでは、動くノードがファイルの値を再現する', () => {
  const { rig } = at(1);
  for (const [ni, m] of rig.matrices) {
    const file = data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(near(v, file[k], 1e-4), `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
  assert.equal(rig.problems.size, 0, [...rig.problems].join());
});

test('displayLayer: 非表示のレイヤーのノードは非表示、レイヤーの値も読める', () => {
  assert.equal(data.nodes[idx('proxy_geo')].visible, false);
  for (const f of FRAMES) assert.ok(near(at(f).rig.chan(idx('layer_jnt')).t[0], 1));
});

test('四元数ノード: quatToEuler・eulerToQuat・quatInvert・quatProd・quatSlerp', () => {
  for (const f of FRAMES) {
    const { rot } = at(f);
    const qc = rot('q_ctrl');
    assert.ok(sameRot(rot('q_jnt'), qc), `フレーム ${f}: quatToEuler`);
    // Maya の quatProd(q1, q2) は q1 を先に回す → three.js では q2 · q1
    const inv45 = new Quaternion().setFromEuler(new Euler(0, 0, Math.PI / 4)).invert();
    assert.ok(sameRot(rot('q2_jnt'), inv45.clone().multiply(qc)), `フレーム ${f}: quatProd`);
    assert.ok(sameRot(rot('q3_jnt'), new Quaternion().slerp(qc, 0.5)), `フレーム ${f}: quatSlerp`);
  }
});

function checkChain(f, joints, handle, side, planeOf) {
  const { pos } = at(f);
  const P = joints.map(pos);
  const H = pos(handle);
  assert.ok(nearVec(P[P.length - 1], H, 1e-3), `フレーム ${f}: 終端 ${P[P.length - 1].toArray()} ハンドル ${H.toArray()}`);
  const fkLens = [Math.sqrt(10), Math.sqrt(10), 3];
  for (let i = 0; i < P.length - 1; i++) assert.ok(near(P[i].distanceTo(P[i + 1]), fkLens[i], 1e-4), `フレーム ${f}: 骨 ${i}`);
  const u = H.clone().sub(P[0]).normalize();
  const v = planeOf(pos).sub(P[0]); v.addScaledVector(u, -v.dot(u)).normalize();
  const n = u.clone().cross(v);
  for (const p of P) assert.ok(Math.abs(p.clone().sub(P[0]).dot(n)) < 1e-3, `フレーム ${f}: 面の上にない`);
  const mid = P[1].clone().sub(P[0]);
  assert.ok(mid.dot(v) * side > 0, `フレーム ${f}: 曲がる向き`);
}

test('3 本以上のジョイントの IK（回転プレーン）: ハンドルに届き、極ベクトルの面の上、極ベクトルの側に曲がる', () => {
  for (const f of FRAMES) checkChain(f, ['rp4_a', 'rp4_b', 'rp4_c', 'rp4_d'], 'rp4_ik', 1, (pos) => pos('rp4_pv'));
});

test('3 本以上のジョイントの IK（シングルチェーン）: ハンドルに届き、FK の形の側（-z）に曲がる', () => {
  for (const f of FRAMES) {
    checkChain(f, ['sc4_a', 'sc4_b', 'sc4_c', 'sc4_d'], 'sc4_ik', 1, (pos) => pos('sc4_a').add(new Vector3(0, 0, -1)));
  }
});

/** 点とカーブ（ワールド空間）の距離 */
function distToCurve(curve, p) {
  const { pts } = polyline(curve, 256);
  let best = Infinity;
  for (let k = 0; k < pts.length - 1; k++) {
    const a = pts[k], ab = pts[k + 1].clone().sub(a);
    const t = Math.min(1, Math.max(0, p.clone().sub(a).dot(ab) / ab.lengthSq()));
    best = Math.min(best, a.clone().addScaledVector(ab, t).distanceTo(p));
  }
  return best;
}

test('スプライン IK（skinCluster で動くカーブ）: ジョイントがカーブの上に並び、骨の長さが保たれる', () => {
  for (const f of FRAMES) {
    const { rig, pos } = at(f);
    const curve = rig.plug(gid('spA_curveShape'), 'ws');
    assert.ok(curve && curve.isCurve);
    const P = [0, 1, 2, 3, 4].map((i) => pos(`spA_${i}`));
    assert.ok(nearVec(P[0], pointAt(curve, 0), 1e-4), `フレーム ${f}: 開始ジョイントがカーブの始点（rootOnCurve）`);
    for (let i = 0; i < 5; i++) assert.ok(distToCurve(curve, P[i]) < 2e-3, `フレーム ${f}: spA_${i} がカーブの上にない`);
    for (let i = 0; i < 4; i++) assert.ok(near(P[i].distanceTo(P[i + 1]), 2, 1e-4), `フレーム ${f}: 骨の長さ`);
    // カーブの終点は drv_top に合わせて動く
    assert.ok(nearVec(pointAt(curve, 1), pos('drv_top'), 1e-4));
  }
  assert.ok(at(48).pos('spA_4').x > -29.9, '曲がったカーブに沿って動く');
});

test('curveInfo: カーブの長さ', () => {
  for (const f of FRAMES) {
    const { rig } = at(f);
    const len = arcLength(rig.plug(gid('spA_curveShape'), 'ws'));
    assert.ok(near(rig.chan(idx('len_jnt')).t[0], len, 1e-6));
    if (f === 1) assert.ok(near(len, 8, 1e-4));
  }
});

/** 骨の向き dirs と各ジョイントの up 軸 ys から、隣の骨へ最小の回転で運んだときの、ひねりの角度の列 */
function twistSteps(dirs, ys) {
  const steps = [];
  for (let i = 1; i < dirs.length; i++) {
    const carried = ys[i - 1].clone().applyQuaternion(new Quaternion().setFromUnitVectors(dirs[i - 1], dirs[i]));
    steps.push(Math.atan2(dirs[i].dot(carried.clone().cross(ys[i])), carried.dot(ys[i])));
  }
  return steps;
}

test('スプライン IK（ロケーターで動くカーブ・上級ツイスト）: 両端の up 軸が world up に合い、ひねりが均等に配られる', () => {
  for (const f of FRAMES) {
    const { rig, pos, W } = at(f);
    const curve = rig.plug(gid('spB_curveShape'), 'ws');
    const P = [0, 1, 2, 3, 4].map((i) => pos(`spB_${i}`));
    for (let i = 0; i < 5; i++) assert.ok(distToCurve(curve, P[i]) < 2e-3, `フレーム ${f}: spB_${i}`);
    assert.ok(nearVec(pointAt(curve, 1), pos('spB_loc3')), 'カーブの終点はロケーター');
    const rx = (f - 1) / 47 * 150 * Math.PI / 180;
    const upS = new Vector3(0, 1, 0), upE = new Vector3(0, Math.cos(rx), Math.sin(rx));
    const dirs = [], ys = [];
    for (let i = 0; i < 4; i++) {
      const dir = P[i + 1].clone().sub(P[i]).normalize();
      const x = new Vector3().setFromMatrixColumn(W(`spB_${i}`), 0).normalize();
      const y = new Vector3().setFromMatrixColumn(W(`spB_${i}`), 1).normalize();
      assert.ok(nearVec(x, dir, 1e-4), `フレーム ${f}: spB_${i} の X 軸が骨の向き`);
      assert.ok(Math.abs(x.dot(y)) < 1e-6);
      dirs.push(dir); ys.push(y);
    }
    const proj = (u, d) => u.clone().addScaledVector(d, -u.dot(d)).normalize();
    assert.ok(nearVec(ys[0], proj(upS, dirs[0]), 1e-4), `フレーム ${f}: 始点の Y 軸 ${ys[0].toArray()}`);
    assert.ok(nearVec(ys[3], proj(upE, dirs[3]), 1e-4), `フレーム ${f}: 終点の Y 軸 ${ys[3].toArray()}`);
    const steps = twistSteps(dirs, ys);
    for (const s of steps) assert.ok(near(s, steps[0], 1e-4), `フレーム ${f}: ひねりが均等でない ${steps}`);
    if (f === 48) assert.ok(steps[0] > 0.6, `150° のひねりが途中で反転しない ${steps}`);
  }
});

test('ポーズ確認でドライバーのジョイントを動かすと、カーブとスプライン IK が追従する', () => {
  const move = new Matrix4().makeTranslation(2, 0, 0);
  const { rig, pos } = at(1, (ni) => (ni === idx('drv_top') ? move : null));
  const curve = rig.plug(gid('spA_curveShape'), 'ws');
  assert.ok(nearVec(pointAt(curve, 1), new Vector3(-28, 8, 0)));
  for (let i = 0; i < 5; i++) assert.ok(distToCurve(curve, pos(`spA_${i}`)) < 2e-3);
});
