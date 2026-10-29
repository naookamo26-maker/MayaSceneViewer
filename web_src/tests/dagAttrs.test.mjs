// transform・joint のピボット・rotateAxis・jointOrient・せん断・回転順への接続と、移動・回転・スケールの制限の検証
// 前提: python tools/make_dag_attrs_sample.py（samples/dag_attrs_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip, clampLimits } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/dag_attrs_sample.json'), 'utf8'));
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
  return { rig, pos };
}

test('警告しない（接続はすべて評価できる）', () => {
  assert.deepEqual(data.warnings || [], []);
  assert.deepEqual(data.animation.warnings || [], []);
});

test('rotatePivot への接続: ピボットのまわりに回る。piv.rp を読む', () => {
  for (const f of FRAMES) {
    const { pos } = at(f), p = tx(f);
    assert.ok(nearVec(pos('pivC'), [p, 1 - p, 0]), `${f}: ${pos('pivC')}`);
    assert.ok(nearVec(pos('rd'), [p, 0, 0]), `rd ${f}`);
  }
});

test('移動・回転の制限: 最大を超えると最大で止まる', () => {
  for (const f of FRAMES) {
    const { pos, rig } = at(f);
    const x = Math.min(tx(f), 2), a = Math.min(rz(f), 45) * D2R;
    assert.ok(nearVec(pos('limC'), [x + Math.cos(a), Math.sin(a), 0]), `${f}: ${pos('limC')}`);
    assert.ok(Math.abs(rig.chan(idx('lim')).t[0] - x) < 1e-9, 'チャンネルの値も収める');
  }
});

test('ファイルの値が制限を超えていても、静的な行列は制限に収める（Python）', () => {
  const a = 30 * D2R;
  const { pos } = at(1);
  assert.ok(nearVec(pos('limSC'), [0, Math.cos(a), Math.sin(a)], 1e-5), `${pos('limSC')}`);
});

test('jointOrient・rotateAxis への接続（接続の値はラジアン）', () => {
  for (const f of FRAMES) {
    const { pos } = at(f), a = rz(f) * D2R;
    assert.ok(nearVec(pos('jk'), [Math.cos(a), Math.sin(a), 0]), `jo ${f}: ${pos('jk')}`);
    assert.ok(nearVec(pos('raC'), [Math.cos(a), Math.sin(a), 0]), `ra ${f}: ${pos('raC')}`);
  }
});

test('rotateOrder への接続: xyz（X → Z）と zxy（Z → X）で向きが変わる', () => {
  assert.ok(nearVec(at(1).pos('roC'), [0, 1, 0]), `${at(1).pos('roC')}`);
  assert.ok(nearVec(at(24).pos('roC'), [0, 0, 1]), `${at(24).pos('roC')}`);
});

test('shear への接続（shearXY: x += xy · y）', () => {
  for (const f of FRAMES) assert.ok(nearVec(at(f).pos('shC'), [tx(f), 1, 0]), `${f}`);
});

test('clampLimits: 有効な成分だけを収める', () => {
  const x = { t: [5, -5, 0], r: [100, 0, -100], s: [1, 1, 1], lim: { t: [[null, -1, null], [2, null, null]], r: [[-45, null, -45], [45, null, null]] } };
  clampLimits(x);
  assert.deepEqual(x.t, [2, -1, 0]);
  assert.deepEqual(x.r, [45, 0, -45]);
});
