// Python のノードプラグインから変換した定義（convert-plugin）の評価の検証。期待する値はプラグインの compute と同じ式
// 前提: python tools/make_plugin_convert_sample.py（samples/plugin_convert_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/plugin_convert_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const FRAMES = [1, 7, 12, 24];
const tx = (f) => 10 * (f - 1) / 23;                 // ctrl.tx のキー（リニア）
const rz = (f) => 90 * (f - 1) / 23;                 // ctrl.rz のキー（度）

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('変換した型のノードはすべて定義で評価する', () => {
  const types = Object.keys(data.animation.nodeDefs).sort();
  assert.deepEqual(types, ['aimMatrix2', 'angleScale', 'legacySum', 'matrixOffset', 'stretchArray', 'targetAverage',
    'vectorLength', 'weightedSumNode']);
  const rig = at(12);
  for (const n of ['jA', 'jB', 'jC', 'jD', 'jE', 'jF', 'jG', 'jH', 'jI']) rig.chan(idx(n));
  assert.deepEqual([...rig.problems], []);
});

test('weightedSumNode: 物理番号でたどり、論理番号で weight を引く', () => {
  for (const f of FRAMES) assert.ok(near(at(f).chan(idx('jA')).t[1], 0.5 * tx(f) + 3 * 2), `フレーム ${f}`);
});

test('targetAverage: 配列の compound の位置の重み付きの平均（createPoint の出力と成分 otX）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const t = rig.chan(idx('jB')).t;
    const expect = (tx(f) + 4 * 3) / 4;
    assert.ok(near(t[0], expect) && near(t[1], 0) && near(t[2], 0), `フレーム ${f}: ${t}`);
    assert.ok(near(rig.chan(idx('jC')).t[0], expect), `フレーム ${f}: jC.tx`);
  }
});

test('angleScale: MAngle の入出力（asRadians・asDegrees・math.radians）', () => {
  for (const f of FRAMES) assert.ok(near(at(f).chan(idx('jD')).r[0], 2 * rz(f) + 10), `フレーム ${f}`);
});

test('aimMatrix2: MPoint × 行列・MVector の外積・MMatrix の作成と行列の出力', () => {
  for (const f of FRAMES) {
    const origin = new Vector3(tx(f), 0, 0);
    const x = new Vector3(0, 5, 10).sub(origin).normalize();
    const z = new Vector3().crossVectors(x, new Vector3(0, 1, 0)).normalize();
    const y = new Vector3().crossVectors(z, x);
    const m = new Matrix4().makeBasis(x, y, z);
    const c = at(f).chan(idx('jF'));
    for (let k = 0; k < 3; k++) assert.ok(near(c.t[k], origin.getComponent(k)), `フレーム ${f}: t ${c.t}`);
    // 回転は行列で比べる（Maya の xyz は three の 'ZYX'）
    const got = new Matrix4().makeRotationFromEuler(new Euler(...c.r.map((v) => v * Math.PI / 180), 'ZYX'));
    for (let k = 0; k < 16; k++) {
      assert.ok(near(got.elements[k], m.elements[k], 1e-6), `フレーム ${f}: r ${c.r}`);
    }
  }
});

test('stretchArray: 出力の配列（MArrayDataBuilder）', () => {
  for (const f of FRAMES) {
    const t = at(f).chan(idx('jE')).t;
    assert.ok(near(t[0], 3 * tx(f)) && near(t[1], -5), `フレーム ${f}: ${t}`);
  }
});

test('API 1.0: legacySum（elementCount と next）・vectorLength（数の compound の成分への接続）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const g = rig.chan(idx('jG')).t;
    const len = Math.hypot(tx(f), 3, 4);
    assert.ok(near(g[0], (tx(f) + 2) * 0.5), `フレーム ${f}: legacySum ${g[0]}`);
    assert.ok(near(g[1], len), `フレーム ${f}: length ${g[1]}`);
    const h = rig.chan(idx('jH')).t;
    assert.ok(near(h[0], tx(f) / len) && near(h[1], 3 / len) && near(h[2], 4 / len), `フレーム ${f}: normal ${h}`);
  }
});

test('API 1.0: matrixOffset（型つきの行列の属性・MFnMatrixData の読み書き）', () => {
  const D2R = Math.PI / 180;
  const rot = new Matrix4().makeRotationFromEuler(new Euler(30 * D2R, 45 * D2R, 60 * D2R, 'ZYX'));
  for (const f of FRAMES) {
    const c = at(f).chan(idx('jI'));
    const t = [tx(f) + 1, 4, 6];
    for (let k = 0; k < 3; k++) assert.ok(near(c.t[k], t[k]), `フレーム ${f}: t ${c.t}`);
    const got = new Matrix4().makeRotationFromEuler(new Euler(...c.r.map((v) => v * D2R), 'ZYX'));
    for (let k = 0; k < 16; k++) assert.ok(near(got.elements[k], rot.elements[k], 1e-6), `フレーム ${f}: r ${c.r}`);
  }
});
