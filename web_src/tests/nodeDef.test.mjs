// 自作ノードの定義（animation.nodeDefs）の評価の検証
// 前提: python tools/make_nodedef_sample.py（samples/nodedef_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { compileNodeDef } from '../src/nodeDef.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/nodedef_sample.json'), 'utf8'));
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

test('数が不定の配列（番号が飛ぶ・既定値）: weightedSum', () => {
  for (const f of FRAMES) {
    const ty = at(f).chan(idx('jA')).t[1];
    assert.ok(near(ty, 0.5 * tx(f) + 2 * 1 + 1 * 2), `フレーム ${f}: ${ty}`);
  }
});

test('配列の compound（行列とウェイト）・ベクトルの出力と成分への接続: matrixBlend', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const t = rig.chan(idx('jB')).t;
    const expect = (tx(f) * 1 + 4 * 3) / 4;
    assert.ok(near(t[0], expect) && near(t[1], 0) && near(t[2], 0), `フレーム ${f}: jB ${t}`);
    assert.ok(near(rig.chan(idx('jC')).t[0], expect), `フレーム ${f}: jC.tx（成分 otx）`);
  }
});

test('角度: キーはラジアン、ファイルの値（offset 10 度）は度で書かれている: angleDouble', () => {
  for (const f of FRAMES) {
    const r = at(f).chan(idx('jD')).r[0];
    assert.ok(near(r, 2 * rz(f) + 10, 1e-6), `フレーム ${f}: ${r}`);
  }
});

test('時間の属性は、接続がなければいまのフレーム: waveNode', () => {
  for (const f of FRAMES) {
    const tz = at(f).chan(idx('jA')).t[2];
    assert.ok(near(tz, Math.sin(f * 0.1) * 2), `フレーム ${f}: ${tz}`);
  }
});

test('実行時の誤り（0 で割る）はリグの問題として報告し、ほかのノードは評価を続ける', () => {
  const rig = at(12);
  rig.chan(idx('jE'));
  const problems = [...rig.problems];
  assert.ok(problems.some((p) => p.includes('dv1') && p.includes('0 で割っています')), problems.join());
  assert.equal(problems.length, 1, problems.join());
});

// ---------------------------------------------------------------------- 計算の言語（関数・演算）
function run(ir, inputs = {}, attributes = null) {
  const attrs = attributes || [
    { name: 'input', short: 'in', type: 'double', default: 0 },
    { name: 'output', short: 'o', type: 'double', output: true },
  ];
  const d = compileNodeDef({ type: 't', attributes: attrs, ir });
  return d.run({ frame: 10, fps: 24, read: (p) => inputs[p], indices: () => [], connected: () => false });
}
const set = (expr) => [['set', ['o', [['o', null]]], expr]];
const c = (name, ...args) => ['c', name, args];
const n = (x) => ['n', x];
const v = (...xs) => ['v', xs.map(n)];

test('Python と同じ割り算・余り・丸め', () => {
  assert.equal(run(set(['b', '%', n(-7), n(3)])).o, 2);              // Python: -7 % 3 = 2
  assert.equal(run(set(['b', '//', n(-7), n(2)])).o, -4);
  assert.equal(run(set(c('round', n(2.5)))).o, 2);                    // 偶数への丸め
  assert.equal(run(set(c('round', n(3.5)))).o, 4);
  assert.throws(() => run(set(['b', '/', n(1), n(0)])), /0 で割っています/);
});

test('行列の積は Maya と同じ順（m1 * m2 は m1 を先に掛ける）', () => {
  // 回転（Z 90 度）してから移動 (5, 0, 0): 点 (1, 0, 0) → (0, 1, 0) → (5, 1, 0)
  const rot = c('compose', v(0, 0, 0), v(0, 0, Math.PI / 2), v(1, 1, 1));
  const move = c('compose', v(5, 0, 0), v(0, 0, 0), v(1, 1, 1));
  const out = run([['set', ['l', 'm'], ['b', '*', rot, move]],
    ['set', ['o', [['o', null]]], c('xform_point', v(1, 0, 0), ['l', 'm'])]],
  {}, [{ name: 'output', short: 'o', type: 'vector', output: true, components: ['ox', 'oy', 'oz'] }]).o;
  assert.ok(near(out[0], 5) && near(out[1], 1) && near(out[2], 0), out.join());
  // xform_vector は移動を含めない
  const dir = run(set(c('xform_vector', v(1, 0, 0), ['b', '*', rot, move])), {},
    [{ name: 'output', short: 'o', type: 'vector', output: true, components: ['ox', 'oy', 'oz'] }]).o;
  assert.ok(near(dir[0], 0) && near(dir[1], 1), dir.join());
});

test('四元数の積は Maya と同じ順（a * b は a を先に回す）', () => {
  // X 90 度 → Y 90 度。three.js では qy · qx
  const qx = new Quaternion().setFromEuler(new Euler(Math.PI / 2, 0, 0));
  const qy = new Quaternion().setFromEuler(new Euler(0, Math.PI / 2, 0));
  const out = run(set(c('quat_mul', v(qx.x, qx.y, qx.z, qx.w), v(qy.x, qy.y, qy.z, qy.w))), {},
    [{ name: 'output', short: 'o', type: 'double4', output: true, components: ['ox', 'oy', 'oz', 'ow'] }]).o;
  const expect = qy.clone().multiply(qx);
  const p = new Vector3(0, 1, 0).applyQuaternion(new Quaternion(...out));
  assert.ok(p.distanceTo(new Vector3(0, 1, 0).applyQuaternion(expect)) < 1e-9);
});

test('ベクトルの演算と成分', () => {
  const outV = [{ name: 'output', short: 'o', type: 'vector', output: true, components: ['ox', 'oy', 'oz'] }];
  assert.deepEqual(run(set(['b', '+', v(1, 2, 3), v(1, 1, 1)]), {}, outV), { o: [2, 3, 4], ox: 2, oy: 3, oz: 4 });
  assert.equal(run(set(c('dot', v(1, 2, 3), v(4, 5, 6)))).o, 32);
  assert.equal(run(set(['g', c('cross', v(1, 0, 0), v(0, 1, 0)), 2])).o, 1);
  assert.throws(() => run(set(['b', '*', v(1, 2, 3), v(1, 2, 3)])), /dot/);    // ベクトル同士の * は使えない
});

test('for・break・ローカル変数・未設定の変数の誤り', () => {
  const ir = [['set', ['l', 's'], n(0)],
    ['for', 'i', c('range', n(10)), [['if', ['b', '>=', ['l', 'i'], n(4)], [['break']], []],
      ['aug', '+', ['l', 's'], ['l', 'i']]]],
    ['set', ['o', [['o', null]]], ['l', 's']]];
  assert.equal(run(ir).o, 0 + 1 + 2 + 3);
  assert.throws(() => run(set(['l', 'nothing'])), /値がまだ入っていません/);
});
