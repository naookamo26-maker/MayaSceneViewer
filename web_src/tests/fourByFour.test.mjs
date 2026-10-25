// fourByFourMatrix（16 個の数から行列を作る）の評価の検証
// 前提: python tools/make_fourbyfour_sample.py（samples/fourbyfour_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/fourbyfour_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const FRAMES = [1, 7, 12, 24];
const tx = (f) => 10 * (f - 1) / 23;
const ty = (f) => 4 * (f - 1) / 23;
const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6);

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  const pos = (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n)));
  return { rig, pos };
}

test('fourByFourMatrix は評価できるノード（評価できないノードとして警告しない）', () => {
  assert.ok(!(data.warnings || []).some((w) => w.includes('fourByFourMatrix')), (data.warnings || []).join('\n'));
  assert.ok(data.animation.graph.some((g) => g.type === 'fourByFourMatrix'));
});

test('16 個の数（行の順）・短い名前と長い名前の接続・ファイルの値 → decomposeMatrix', () => {
  for (const f of FRAMES) {
    const c = at(f).rig.chan(idx('jA'));
    const t = [tx(f), ty(f), 5];
    for (let k = 0; k < 3; k++) assert.ok(near(c.t[k], t[k]), `フレーム ${f}: t ${c.t}`);
    assert.ok(near(c.r[0], 0) && near(c.r[1], 0) && near(c.r[2], 30), `フレーム ${f}: r ${c.r}`);
  }
});

test('offsetParentMatrix への接続（出力の短い名前 o）と、値のない fourByFourMatrix は単位行列', () => {
  for (const f of FRAMES) {
    const { pos } = at(f);
    const b = pos('jB');
    assert.ok(near(b.x, C + tx(f)) && near(b.y, S + ty(f)) && near(b.z, 5), `フレーム ${f}: jB ${b.toArray()}`);
    const c = pos('jC');
    assert.ok(near(c.x, 0) && near(c.y, 3) && near(c.z, 0), `フレーム ${f}: jC ${c.toArray()}`);
  }
});
