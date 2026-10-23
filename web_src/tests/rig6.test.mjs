// 第 6 段階（cluster で動くワイヤー・標準の計算ノード・アニメーションレイヤー）の評価の検証
// 前提: python tools/make_rig6_sample.py（samples/rig6_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
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
    // ファイルに書かれた値（表示用の行列は、移動が接続で決まるジョイントではバインドポーズに置き換わっている）
    const fr = rig.fileRestLocal(ni);
    const file = fr ? fr.elements : data.nodes[ni].matrix;
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

test('pointOnCurveInfo: 長さの割合の点・終点の接線の向き', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const wire = rig.plug(gid('t2_wireShape'), 'ws');
    const { pts, len, total } = polyline(wire, 256);
    let k = 0;
    while (len[k + 1] < total / 2) k++;
    const half = pts[k].clone().lerp(pts[k + 1], (total / 2 - len[k]) / (len[k + 1] - len[k]));
    const p = new Vector3(...rig.chan(idx('poc_jnt')).t);
    assert.ok(p.distanceTo(half) < 1e-2, `フレーム ${f}: 長さの半分の点 ${p.toArray()} != ${half.toArray()}`);
    const tan = new Vector3(...rig.chan(idx('poc_jnt2')).t);
    const end = pointAt(wire, 1).sub(pointAt(wire, 0.999)).normalize();
    assert.ok(near(tan.length(), 1, 1e-6) && tan.distanceTo(end) < 1e-3, `フレーム ${f}: 終点の接線 ${tan.toArray()}`);
  }
});

test('極ベクトルを書かない RP IK は、Maya の既定値 (0, 0, 1) の側に曲げる', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const b = new Vector3().setFromMatrixPosition(rig.world(idx('arm2_b')));
    const c = new Vector3().setFromMatrixPosition(rig.world(idx('arm2_c')));
    assert.ok(b.z > 10.5 && Math.abs(b.y) < 1e-6, `フレーム ${f}: 肘 ${b.toArray()}`);
    assert.ok(c.distanceTo(new Vector3(lin(f, 46, 43), 0, 10)) < 1e-4, `フレーム ${f}: 手首がハンドルに届く`);
  }
});

test('保存時のフレームの再現チェック: 一致する IK は ✓、ファイルの回転をずらすと、ねじれ・曲がりに分けて報告する', () => {
  const rig = at(data.animation.current);
  const fileLocal = (ni) => new Matrix4().fromArray(data.nodes[ni].matrix);
  const res = rig.verifySaved(fileLocal);
  const arm = res.find((h) => h.handle === 'arm2_ik');
  assert.ok(arm.ok, JSON.stringify(arm));
  assert.deepEqual(arm.pv.map((v) => +v.toFixed(6)), [0, 0, 1]);
  // 肩のファイルの値を骨の軸（+X 寄り）まわりに 30° ねじった場合
  const a = idx('arm2_a');
  const bone = new Vector3(3, 0, 1).normalize();
  const r2 = rig.verifySaved((ni) => (ni === a ? fileLocal(a).multiply(new Matrix4().makeRotationAxis(bone, 30 * Math.PI / 180)) : fileLocal(ni)));
  const j = r2.find((h) => h.handle === 'arm2_ik').joints[0];
  assert.ok(!j.ok && near(Math.abs(j.roll), 30, 1e-3) && j.bend < 1e-3, JSON.stringify(j));
});

test('再現チェックの候補探し: Maya の答えが「ひねり逆向き」なら、それを一番合う解き方として見つける', () => {
  const d = JSON.parse(JSON.stringify(data));
  const g = d.animation.graph.find((x) => x.name === 'arm2_ik');
  g.attrs = { ...(g.attrs || {}), twi: 30 };                     // ひねり 30°
  const mk = () => new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  // 「Maya の答え」: ひねりを逆向きに解いたときのローカル行列
  const maya = mk();
  maya.ikVariant = { twistSign: -1, pvSpace: 'handle', side: 1 };
  maya.evaluate(d.animation.current);
  const answer = new Map(g.ik.chain.map((ni) => [ni, maya.localFile(ni).clone()]));
  const rig = mk();
  rig.evaluate(d.animation.current);
  const res = rig.verifySaved((ni) => answer.get(ni) || new Matrix4().fromArray(d.nodes[ni].matrix));
  const h = res.find((x) => x.handle === 'arm2_ik');
  assert.ok(!h.ok && h.error > 50, `今の解き方では 60° 近くずれる: ${h.error}`);
  assert.ok(h.reach < 1e-6, 'ハンドルには届いている');
  assert.equal(h.best.variant.twistSign, -1, h.best.label);
  assert.ok(h.best.error < 1e-3, `${h.best.error}`);
  assert.equal(rig.ikVariant, null, '試したあとは元の解き方に戻す');
});

test('再現チェック: 移動がコンストレイントで決まる（表示用の行列がバインドポーズに置き換わる）ジョイントも、ファイルの回転と比べる', () => {
  const rig = at(data.animation.current);
  const ni = idx('arm3_a');
  assert.ok(Math.abs(data.nodes[ni].matrix[2]) < 1e-9, '表示用の行列はバインドポーズ（回転 0）');
  const res = rig.verifySaved((n) => rig.fileRestLocal(n));
  const h = res.find((x) => x.handle === 'arm3_ik');
  assert.ok(h.ok, JSON.stringify(h.joints));
  // 表示用の行列と比べると（以前のやり方）、20° ずれていると誤って判定してしまう
  const wrong = rig.verifySaved((n) => new Matrix4().fromArray(data.nodes[n].matrix)).find((x) => x.handle === 'arm3_ik');
  assert.ok(!wrong.ok && near(wrong.joints[0].angle, 20, 0.01), `${wrong.joints[0].angle}`);
});

test('自作のトランスフォームノード（未知の型）を transform として評価する', () => {
  for (const f of FRAMES) {
    const t = at(f).chan(idx('cx_jnt')).t;
    assert.ok(near(t[1], lin(f, 0, 2)) && near(t[2], 50), `フレーム ${f}: ${t}`);
  }
});

test('再現チェック: 極ベクトルの入力が Maya と違うと、肘の向きのずれとして出す', () => {
  const d = JSON.parse(JSON.stringify(data));
  const mk = () => new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  // 「Maya の答え」: 極ベクトルが (0, 1, 0) のときの姿勢
  const g = d.animation.graph.find((x) => x.name === 'arm2_ik');
  g.attrs = { ...(g.attrs || {}), pv: [0, 1, 0] };
  const maya = mk();
  maya.evaluate(d.animation.current);
  const answer = new Map(g.ik.chain.map((ni) => [ni, maya.localFile(ni).clone()]));
  g.attrs.pv = [0, 0, 1];                                       // こちらは (0, 0, 1)
  const rig = mk();
  rig.evaluate(d.animation.current);
  const h = rig.verifySaved((ni) => answer.get(ni) || rig.fileRestLocal(ni)).find((x) => x.handle === 'arm2_ik');
  assert.ok(!h.ok && Math.abs(Math.abs(h.poleError) - 90) < 1, `極ベクトルの差 90°: ${h.poleError}`);
  const ok = at(d.animation.current).verifySaved((ni) => at(d.animation.current).fileRestLocal(ni)).find((x) => x.handle === 'arm2_ik');
  assert.ok(ok.ok && Math.abs(ok.poleError) < 1e-3);
});

test('自作ノードの割り当て（multMatrix として評価）: 行列を出す自作ノードの先も動く', () => {
  const mapped = JSON.parse(readFileSync(path.resolve(here, '../../samples/rig6_mapped.json'), 'utf8'));
  const i = mapped.nodes.findIndex((n) => n.name === 'mm_jnt2');
  for (const f of FRAMES) {
    const rig = new RigEvaluator(new AnimationClip(mapped.animation), mapped.nodes, (ni) => new Matrix4().fromArray(mapped.nodes[ni].matrix));
    rig.evaluate(f);
    const t = rig.chan(i).t;
    assert.ok(near(t[0], lin(f, 0, 10)) && near(t[1], lin(f, 0, 4)), `フレーム ${f}: ${t}`);
  }
  assert.ok(at(24).tainted.has(idx('mm_jnt2')), '設定なしでは評価できない（不明）');
});

test('再現チェック: 開始ジョイントの親のずれと、最初にずれるノード（別の IK で動くもの）を出す', () => {
  const rig = at(data.animation.current);
  const fl = (ni) => rig.fileRestLocal(ni);
  const ok = rig.verifySaved(fl).find((h) => h.handle === 'arm4_ik');
  assert.ok(ok.ok && ok.parent && ok.parent.name === 't2_4' && ok.parent.angle < 1e-3 && !ok.parent.firstBad, JSON.stringify(ok.parent));
  // 「Maya の答え」では尻尾の t2_2 が 10° 回っていた、とする
  const t22 = idx('t2_2');
  const tilted = (ni) => (ni === t22 ? fl(ni).multiply(new Matrix4().makeRotationZ(10 * Math.PI / 180)) : fl(ni));
  const h = rig.verifySaved(tilted).find((x) => x.handle === 'arm4_ik');
  assert.ok(h.parent.angle > 9 && h.parent.firstBad && h.parent.firstBad.name === 't2_2', JSON.stringify(h.parent));
  assert.equal(h.parent.firstBad.ik, 't2_ik');
});

test('再現チェック: 極ベクトルの目標（poleVectorConstraint のターゲット）のウェイト・位置・ずれ', () => {
  // 脚 leg_ik の極ベクトルは自作ノードで動く knee_pv が目標（ずれの判定は「不明」なので、構成だけ確かめる）
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(data.animation.current);
  const g = data.animation.graph.find((x) => x.name === 'leg_ik');
  const pt = rig.poleTargets(g, (ni) => rig.fileRestLocal(ni), 0.5);
  assert.equal(pt.via, 'leg_pvc');
  assert.equal(pt.targets.length, 1);
  assert.equal(pt.targets[0].name, 'knee_pv');
  assert.equal(pt.targets[0].weight, 1);
  assert.ok(Array.isArray(pt.start) && pt.start.length === 3);
});

test('極ベクトルの空間の変換: 反転（スケール -1）や不均一なスケールのある親でも、コンストレイントと IK の変換が打ち消し合う', () => {
  const d = JSON.parse(JSON.stringify(data));
  // leg_ik の親 foot_ctrl を反転・不均一スケールにする（ファイルの値を書き換える）
  const fi = d.nodes.findIndex((n) => n.name === 'foot_ctrl');
  const m = new Matrix4().compose(new Vector3(20, 0, 0), new Quaternion().setFromEuler(new Euler(0.3, -0.7, 0.2)), new Vector3(-1, 2, 0.5));
  d.nodes[fi].matrix = m.toArray();
  const rest = d.animation.nodes.find((n) => n.node === fi);
  if (rest) d.animation.nodes = d.animation.nodes.filter((n) => n !== rest);
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  rig.evaluate(1);
  const g = d.animation.graph.find((x) => x.name === 'leg_ik');
  const pvc = d.animation.graph.find((x) => x.name === 'leg_pvc');
  const pvW = rig.pvWorld(rig.vec(g.id, 'pv', [0, 0, 1]), g.dag, g.ik.chain[0]);
  const tgt = new Vector3().setFromMatrixPosition(rig.world(idx('knee_pv')));
  const start = rig.pivotPosition(pvc.pivot);
  assert.ok(pvW.distanceTo(tgt.sub(start)) < 1e-6, `${pvW.toArray()}`);
});
