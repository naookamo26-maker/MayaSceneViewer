// キャラクターセットと Trax のクリップの評価の検証
// 前提: python tools/make_trax_sample.py（samples/trax_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { clipRange, clipSourceTime } from '../src/trax.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/trax_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return { rz: rig.chan(idx('shoulder')).r[2], tx: rig.chan(idx('box')).t[0], ty: rig.chan(idx('rig_grp')).t[1], rig };
}

test('クリップの時間: 開始・スケール・サイクル・hold', () => {
  const r = clipRange({ start: 10, sourceStart: 0, sourceEnd: 10, scale: 2, postCycle: 1, hold: 5, channels: {} }, []);
  assert.deepEqual([r.begin, r.playEnd, r.end], [10, 50, 55]);
  assert.equal(clipSourceTime(r, 10), 0);
  assert.equal(clipSourceTime(r, 20), 5);         // スケール 2: 2 フレームでソースの 1 フレーム
  assert.equal(clipSourceTime(r, 35), 2.5);       // 2 回目のサイクル
  assert.equal(clipSourceTime(r, 50), 10);        // 最後
  assert.equal(clipSourceTime(r, 53), 10);        // hold の間は最後の値
});

test('Trax のクリップでキャラクターセットのメンバーが動く（swing1: 1〜21 で 2 回）', () => {
  assert.ok(near(at(1).rz, 0) && near(at(1).tx, 0));
  assert.ok(near(at(6).rz, 45, 1e-4) && near(at(6).tx, 2.5, 1e-4));
  assert.ok(near(at(11).rz, 0, 1e-4), '2 回目の先頭');
  assert.ok(near(at(16).rz, 45, 1e-4) && near(at(16).tx, 2.5, 1e-4));
  assert.ok(near(at(21).rz, 90, 1e-4) && near(at(21).tx, 5, 1e-4));
});

test('クリップの間は直前のクリップの最後の値、スケール 2 のクリップは 2 倍の長さ（raise1: 30〜70）', () => {
  assert.ok(near(at(25).rz, 90, 1e-4) && near(at(25).tx, 5, 1e-4));
  assert.ok(near(at(30).rz, 0, 1e-4));
  assert.ok(near(at(50).rz, -22.5, 1e-4) && near(at(50).tx, -1.5, 1e-4));
  assert.ok(near(at(70).rz, -45, 1e-4) && near(at(80).tx, -3, 1e-4));
});

test('クリップのないキャラクターセット: カーブの値をそのまま通す', () => {
  assert.ok(near(at(1).ty, 0, 1e-4));
  assert.ok(near(at(80).ty, 4, 1e-4));
  assert.equal(at(40).rig.problems.size, 0);
});
