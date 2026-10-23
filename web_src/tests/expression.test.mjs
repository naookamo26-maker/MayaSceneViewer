// expression の解釈器（src/expression.js）と、サンプルの expression ノードの評価の検証
// 前提: python tools/make_ctrl_sample.py（samples/ctrl_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { compileExpression, ExpressionError } from '../src/expression.js';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const run = (src, env = {}) => compileExpression(src).run({ input: (k) => (env.inputs || [])[k] || 0, frame: env.frame ?? 1, time: env.time ?? 0 }).out;
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

test('四則演算・優先順位・単項演算・整数の割り算', () => {
  assert.equal(run('.O[0] = 1 + 2 * 3 - 4 / 2;').get(0), 5);
  assert.equal(run('.O[0] = 7 / 2; .O[1] = 7.0 / 2; .O[2] = 7 % 3; .O[3] = -(2 + 1);').get(0), 3);
  assert.equal(run('.O[0] = 7.0 / 2;').get(0), 3.5);
  assert.equal(run('.O[0] = 7 % 3;').get(0), 1);
  assert.equal(run('.O[0] = -(2 + 1) * +2;').get(0), -6);
  assert.equal(run('.O[0] = (int)3.7 + (float)1;').get(0), 4);
});

test('入力・frame・time・関数', () => {
  const out = run('.O[0] = .I[0] * 2 + .I[1];\n.O[1] = frame;\n.O[2] = time;\n.O[3] = sind(90) + clamp(0, 1, 5) + smoothstep(0, 10, 5);',
    { inputs: [3, 4], frame: 12, time: 0.5 });
  assert.equal(out.get(0), 10);
  assert.equal(out.get(1), 12);
  assert.equal(out.get(2), 0.5);
  assert.ok(near(out.get(3), 1 + 1 + 0.5));
  assert.ok(near(run('.O[0] = atan2d(1, 1) + rad_to_deg(deg_to_rad(30)) + max(2, min(5, 3)) + pow(2, 3) + abs(-1);').get(0), 45 + 30 + 3 + 8 + 1));
});

test('変数・宣言・複合代入・増減・比較・論理・三項演算子', () => {
  const out = run(`
    float $a = 1.5, $b;
    int $i = 2.9;          // 整数に切り捨て
    $b = $a * 2;
    $b += 1; $b *= 2;
    $c = 10;               // 宣言なし（最初の代入で型が決まる）
    $c++; ++$c; $c--;
    .O[0] = $b; .O[1] = $i; .O[2] = $c;
    .O[3] = ($a > 1 && !($i == 3)) ? 1 : 0;
    .O[4] = $a <= 1 || $i != 2;
  `);
  assert.equal(out.get(0), 8);
  assert.equal(out.get(1), 2);
  assert.equal(out.get(2), 11);
  assert.equal(out.get(3), 1);
  assert.equal(out.get(4), 0);
});

test('if / else・for・while・ブロック・コメント', () => {
  const src = `
    /* 範囲で分ける */
    if (frame < 10) .O[0] = 1;
    else if (frame < 20) { .O[0] = 2; }
    else .O[0] = 3;
    float $sum = 0;
    for ($k = 1; $k <= 4; $k++) $sum += $k;
    int $n = 0;
    while ($n < 5) $n += 2;
    .O[1] = $sum; .O[2] = $n;
  `;
  assert.equal(run(src, { frame: 5 }).get(0), 1);
  assert.equal(run(src, { frame: 15 }).get(0), 2);
  assert.equal(run(src, { frame: 25 }).get(0), 3);
  assert.equal(run(src).get(1), 10);
  assert.equal(run(src).get(2), 6);
  assert.deepEqual(compileExpression(src).outputs, [0, 1, 2]);
});

test('解釈できない式はエラーになる', () => {
  for (const bad of ['.O[0] = getAttr(1);', '.O[0] = sin(1, 2);', '.O[0] = (1 + 2;', '.O[0] = 1 +;', '.O[0] = "a";', 'if (1) { .O[0] = 1;']) {
    assert.throws(() => compileExpression(bad), ExpressionError, bad);
  }
  assert.throws(() => run('while (1) .O[0] = 1;'), ExpressionError);
});

// ---------------------------------------------------------------- サンプルの expression ノード
const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/ctrl_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => names.indexOf(n);

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('サンプル: expression で動くジョイント（frame・入力・if・unitConversion・整数の割り算）', () => {
  for (const f of [1, 12, 24, 36, 48]) {
    const rig = at(f);
    assert.ok(near(rig.chan(idx('e_jnt1')).t[1], Math.sin(f * 0.2) * 3, 1e-9), `フレーム ${f}: e_jnt1.ty`);
    const h = 5 * (f - 1) / 47;                       // ctrl_circle.ty（キー 0 → 5、線形）
    const c = rig.chan(idx('e_jnt2'));
    assert.ok(near(c.t[1], h > 2.5 ? h * 2 : 0, 1e-6), `フレーム ${f}: e_jnt2.ty ${c.t[1]}`);
    assert.ok(near(c.r[2], Math.min(f, 45), 1e-6), `フレーム ${f}: e_jnt2.rz ${c.r[2]}`);
    assert.equal(c.t[0], 3);
    const p = new Vector3().setFromMatrixPosition(rig.world(idx('e_jnt1')));
    assert.ok(near(p.y, Math.sin(f * 0.2) * 3, 1e-9));
  }
  assert.equal(at(1).problems.size, 0, [...at(1).problems].join());
});

test('サンプル: 解釈できない expression は警告し、グラフに入れない', () => {
  assert.ok(data.animation.warnings.some((w) => w.includes('expr_mel') && w.includes('MEL コマンド')));
  assert.ok(!data.animation.graph.some((g) => g.name === 'expr_mel'));
  assert.ok((data.animation.tainted || []).includes(idx('e_jnt3')));
});
