// 値を求められないノードの推定（バインドポーズの形を保つ）の検証
// 前提: python tools/make_fallback_sample.py（samples/fallback_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/fallback_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const sameMatrix = (a, b, msg) => a.elements.forEach((v, k) => assert.ok(near(v, b.elements[k]), `${msg}[${k}] ${v} != ${b.elements[k]}`));

function at(f, poseOf) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f, poseOf);
  return rig;
}

test('推定・不明の判定', () => {
  const rig = at(1);
  assert.equal(rig.statusOf(idx('shoulder')), 'estimated');
  assert.equal(rig.statusOf(idx('elbow')), 'estimated');
  for (const n of ['ctrl_grp', 'arm_ctrl', 'box']) assert.equal(rig.statusOf(idx(n)), 'unknown', n);
  for (const n of ['rig_grp', 'forearm_twist', 'wrist']) assert.equal(rig.statusOf(idx(n)), null, n);
  assert.equal(rig.problems.size, 0);
});

test('推定したノードは、確かな祖先からの相対をバインドポーズのとおりに保ち、祖先の動きについていく', () => {
  for (const f of [1, 24, 48]) {
    const rig = at(f);
    const rel = (a, b, W) => W(a).clone().invert().multiply(W(b));
    const W = (n) => rig.world(idx(n));
    const B = (n) => rig.bindWorld(idx(n));
    sameMatrix(rel('rig_grp', 'shoulder', W), rel('rig_grp', 'shoulder', B), `フレーム ${f} shoulder`);
    sameMatrix(rel('shoulder', 'elbow', W), rel('shoulder', 'elbow', B), `フレーム ${f} elbow`);
    // rig_grp はキーで上がる（0 → 5）
    assert.ok(near(new Vector3().setFromMatrixPosition(W('rig_grp')).y, (f - 1) / 47 * 5));
  }
});

test('推定の基準の祖先をポーズ確認で動かすと、形を保ったままついていく', () => {
  const move = new Matrix4().makeTranslation(0, 0, 4);
  const rig = at(1, (ni) => (ni === idx('rig_grp') ? move : null));
  const p = new Vector3().setFromMatrixPosition(rig.world(idx('shoulder')));
  const p0 = new Vector3().setFromMatrixPosition(at(1).world(idx('shoulder')));
  assert.ok(near(p.z - p0.z, 4) && near(p.x, p0.x) && near(p.y, p0.y));
});

test('推定のノードは、使っていない接続ではなく推定の説明を出す', () => {
  const rig = at(1);
  const d = rig.driversOf(idx('shoulder'));
  assert.equal(d.length, 1);
  assert.match(d[0], /推定: .*rig_grp からの相対/);
  assert.match(rig.driversOf(idx('box'))[0], /^不明/);
});
