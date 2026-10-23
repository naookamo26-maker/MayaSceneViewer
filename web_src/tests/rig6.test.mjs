// 第 6 段階（cluster で動くワイヤー・標準の計算ノード・アニメーションレイヤー）の評価の検証
// 前提: python tools/make_rig6_sample.py（samples/rig6_sample.json を作る）
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
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/rig6_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const gid = (n) => data.animation.graph.find((g) => g.name === n).id;
const FRAMES = [1, 12, 24, 36, 48];
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}
const lin = (f, a, b) => a + (b - a) * (f - 1) / 47;

test('保存時のフレームでは、動くノードがファイルの値を再現する', () => {
  const rig = at(1);
  for (const [ni, m] of rig.matrices) {
    if (rig.tainted.has(ni)) continue;                 // 自作ノードの影響を受ける脚（ファイルの値のまま）
    const file = data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(near(v, file[k], 1e-4), `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
  assert.equal(rig.problems.size, 0, [...rig.problems].join());
});

test('cluster で動くワイヤー → wire → スプライン IK', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const wire = rig.plug(gid('t2_wireShape'), 'ws');
    const tip = lin(f, 0, 3), mid = lin(f, 0, 2) * 0.5;
    assert.ok(nearVec(wire.cvs[3], new Vector3(8, tip, -10)), `フレーム ${f}: CV 3 ${wire.cvs[3].toArray()}`);
    assert.ok(nearVec(wire.cvs[2], new Vector3(16 / 3, mid, -10)), `フレーム ${f}: CV 2（ウェイト 0.5）${wire.cvs[2].toArray()}`);
    assert.ok(nearVec(wire.cvs[1], new Vector3(8 / 3, 0, -10)), 'ウェイト 0 の CV は動かない');
    const tail = rig.plug(gid('t2_curveShape'), 'ws');
    for (let k = 0; k < 4; k++) assert.ok(nearVec(tail.cvs[k], pointAt(wire, k / 3), 2e-3), `フレーム ${f}: 尻尾のカーブの CV ${k}`);
    const { pts } = polyline(tail, 256);
    for (let i = 0; i < 5; i++) {
      const p = new Vector3().setFromMatrixPosition(rig.world(idx(`t2_${i}`)));
      assert.ok(Math.min(...pts.map((q) => q.distanceTo(p))) < 0.05, `フレーム ${f}: t2_${i} がカーブの上にない`);
    }
  }
});

test('標準の計算ノード', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = lin(f, 0, 10), ty = lin(f, 0, 4);
    const t = (n) => rig.chan(idx(n)).t;
    assert.ok(near(t('u_jnt1')[0], tx + 2) && near(t('u_jnt1')[1], tx * 3), `フレーム ${f}: add / mult`);
    assert.deepEqual(t('u_jnt2').map((v) => +v.toFixed(6)), [Math.min(tx, 1), Math.min(ty, 1), 0].map((v) => +v.toFixed(6)), `フレーム ${f}: clamp`);
    const u = tx / 10;
    assert.ok(near(t('u_jnt3')[0], u <= 0.5 ? u * 2 : (1 - u) * 2), `フレーム ${f}: remapValue ${t('u_jnt3')[0]}`);
    assert.ok(near(t('u_jnt3')[1], Math.hypot(tx, ty, 5)), `フレーム ${f}: distanceBetween`);
    assert.ok(near(t('u_jnt3')[2], tx / 10), `フレーム ${f}: setRange`);
    assert.deepEqual(t('u_jnt4').map((v) => +v.toFixed(6)), [0, 0, +ty.toFixed(6)], `フレーム ${f}: vectorProduct（外積）`);
    assert.ok(near(t('u_jnt5')[0], tx * 0.75 + 10 * 0.25), `フレーム ${f}: blendTwoAttr`);
    assert.ok(near(t('u_jnt5')[1], tx * 2 + ty), `フレーム ${f}: blendWeighted`);
    assert.ok(near(t('u_jnt5')[2], ty), `フレーム ${f}: choice`);
  }
});

test('アニメーションレイヤー: ベース + レイヤー × ウェイト', () => {
  for (const f of FRAMES) {
    const r = at(f).chan(idx('lay_jnt')).r[0];
    assert.ok(near(r, lin(f, 0, 30) + 0.5 * lin(f, 0, 10), 1e-6), `フレーム ${f}: rx ${r}`);
  }
});

test('自作ノード（未知の型）で動く極ベクトルの IK は「不明」として扱う', () => {
  const rig = at(24);
  for (const n of ['knee_pv', 'leg_hip', 'leg_knee']) assert.equal(rig.statusOf(idx(n)), 'unknown', n);
});

test('ドリブンキー: 独自の属性・unitConversion を経由した回転で引く。タイムラインのキーには含めない', () => {
  for (const f of FRAMES) {
    const c = at(f).chan(idx('roll_jnt'));
    assert.ok(near(c.r[2], lin(f, 0, 10) * 9, 1e-6), `フレーム ${f}: rz ${c.r[2]}`);
    assert.ok(near(c.t[1], lin(f, 0, 45) / 15, 1e-6), `フレーム ${f}: ty ${c.t[1]}`);
  }
  const clip = new AnimationClip(data.animation);
  assert.ok(clip.timeCurves.length < clip.curves.length);
  assert.ok(clip.keyTimes().every((t) => t >= 1 && t <= 48), `${clip.keyTimes()}`);
});
