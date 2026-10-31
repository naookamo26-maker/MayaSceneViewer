// HumanIK のコントロールリグ（FK）で動くスケルトンの評価の検証
// 前提: python tools/make_hik_sample.py（samples/hik_fk_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/hik_fk_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const PARTS = ['Hips', 'Spine', 'Spine1', 'LeftArm', 'LeftForeArm', 'LeftHand', 'Head', 'LeftUpLeg', 'LeftLeg'];
const ctrl = (p) => idx(`Character1_Ctrl_${p}`);

function rig(f, poseOf) {
  const r = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  if (poseOf) r.evaluate(f, poseOf, undefined, {});
  else r.evaluate(f);
  return r;
}
const rot = (m) => new Matrix4().extractRotation(m);
/** 2 つの行列の向きの差（度）。四元数の acos は 0 の近くで精度が落ちるため、相対の回転から atan2 で求める */
function angle(a, b) {
  const e = rot(a).transpose().multiply(rot(b)).elements;      // 列優先: e[c * 4 + r]
  const s = Math.hypot(e[6] - e[9], e[8] - e[2], e[1] - e[4]);
  return Math.atan2(s, e[0] + e[5] + e[10] - 1) * 180 / Math.PI;
}
const dist = (a, b) => new Vector3().setFromMatrixPosition(a).distanceTo(new Vector3().setFromMatrixPosition(b));

/** 部位のワールドの期待値: 向き = コントローラー · スタンスのコントローラー⁻¹ · スタンスのスケルトン（列ベクトル）、位置 = コントローラー */
function check(r, r0, label) {
  for (const p of PARTS) {
    const c = r.world(ctrl(p)), b = r.world(idx(p));
    const exp = c.clone().multiply(r0.world(ctrl(p)).clone().invert()).multiply(r0.bindWorld(idx(p)));
    assert.ok(angle(b, exp) < 1e-4, `${label}: ${p} の向きのずれ ${angle(b, exp)}°`);
    assert.ok(dist(b, c) < 1e-4, `${label}: ${p} の位置のずれ ${dist(b, c)}`);
  }
}

test('HumanIK の FK は行列ノードで評価する（HIKState2SK の未対応・推定の警告を出さない）', () => {
  const w = data.warnings || [];
  assert.ok(w.some((x) => x.includes('コントロールリグの FK のコントローラーから求めて再生します')), w.join('\n'));
  assert.ok(!w.some((x) => x.includes('HIKState2SK') || x.includes('推定')), w.join('\n'));
  assert.ok(data.animation.graph.some((g) => g.name === 'LeftArm_hikFK_r' && g.type === 'multMatrix'));
  assert.ok(!(data.animation.fallback || []).length, '推定するノードはない');
});

test('スタンス（フレーム 1）: スケルトンはバインドポーズと同じ', () => {
  const r = rig(1);
  for (const p of [...PARTS, 'ShoulderExtra']) {
    assert.ok(angle(r.world(idx(p)), r.bindWorld(idx(p))) < 1e-4, `${p}: 向き ${angle(r.world(idx(p)), r.bindWorld(idx(p)))}°`);
    assert.ok(dist(r.world(idx(p)), r.bindWorld(idx(p))) < 1e-4, `${p}: 位置 ${dist(r.world(idx(p)), r.bindWorld(idx(p)))}`);
  }
});

test('キー（フレーム 4・10）: 部位のワールドはコントローラーに追従する（jointOrient・rotateAxis・回転順によらない）', () => {
  const r0 = rig(1);
  for (const f of [4, 10]) {
    const r = rig(f);
    check(r, r0, `フレーム ${f}`);
    assert.ok(angle(r.world(idx('LeftForeArm')), r0.world(idx('LeftForeArm'))) > (f === 10 ? 30 : 5), '腕が動いている');
    assert.ok(dist(r.world(idx('Hips')), r0.world(idx('Hips'))) > 1, '腰が動いている');
  }
});

test('キャラクタライズしていないジョイント（ShoulderExtra）は、親のワールド · ファイルのローカル', () => {
  const r = rig(10);
  const exp = r.world(idx('Spine1')).clone().multiply(new Matrix4().fromArray(data.nodes[idx('ShoulderExtra')].matrix));
  assert.ok(angle(r.world(idx('ShoulderExtra')), exp) < 1e-4 && dist(r.world(idx('ShoulderExtra')), exp) < 1e-4);
});

test('ポーズ確認: FK のコントローラーを動かすとスケルトンが追従する', () => {
  const r0 = rig(1);
  const pose = new Map([[ctrl('LeftForeArm'), new Matrix4().makeRotationFromEuler(new Euler(0.3, -0.8, 0.2))],
    [ctrl('Spine1'), new Matrix4().makeRotationFromEuler(new Euler(0.2, 0.1, -0.3))]]);
  const r = rig(6, (ni) => pose.get(ni) || null);
  check(r, r0, 'ポーズ確認');
  const rk = rig(6);
  assert.ok(angle(r.world(idx('LeftHand')), rk.world(idx('LeftHand'))) > 10, '手も動く');
});
