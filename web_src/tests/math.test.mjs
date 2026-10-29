// Maya 2024 以降の計算ノード・Maya 2020 以降の行列ノード・DL 版・addDL・multDL の評価の検証
// 前提: python tools/make_math_sample.py（samples/math_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { MATH_TYPES } from '../src/mathNodes.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/math_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-6) => a.every((x, i) => near(x, b[i], tol));
const FRAMES = [1, 7, 12, 24];
const tx = (f) => 10 * (f - 1) / 23;
const rz = (f) => 90 * (f - 1) / 23;
const D2R = Math.PI / 180;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  const chan = (n) => rig.chan(idx(n));
  const pos = (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n))).toArray();
  const axis = (n, k) => new Vector3().setFromMatrixColumn(rig.world(idx(n)), k).normalize().toArray();
  return { chan, pos, axis };
}

test('新しいノードは評価できるノード（警告しない）', () => {
  assert.deepEqual(data.warnings || [], []);
  for (const t of ['addDL', 'multDL', 'sum', 'blendMatrix', 'aimMatrix', 'parentMatrix', 'distanceBetweenDL', 'pointMatrixMult']) {
    assert.ok(data.animation.graph.some((g) => g.type === t), t);
  }
});

test('Python と JS の対応する型の一覧が同じ', () => {
  const py = readFileSync(path.resolve(here, '../../ma_viewer/rig.py'), 'utf8');
  const block = /MATH_TYPES = \{([^}]*)\}/.exec(py)[1];
  const list = [...block.matchAll(/"(\w+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(list, [...MATH_TYPES].sort());
});

test('スカラー: addDL・multDL・sum・multiply・subtract・clampRange・smoothStep・divide → lerp', () => {
  for (const f of FRAMES) {
    const { chan } = at(f), x = tx(f);
    assert.ok(nearVec(chan('s_add').t.slice(0, 2), [x + 2, 3 * x]), `addDL・multDL ${f}`);
    assert.ok(nearVec(chan('s_sum').t, [x + 3, 2 * x, x - 4]), `sum・multiply・subtract ${f}`);
    const u = x / 10;
    assert.ok(nearVec(chan('s_clamp').t, [Math.min(6, Math.max(2, x)), u * u * (3 - 2 * u), 2 + x]), `clampRange・smoothStep・lerp ${f}`);
  }
});

test('三角関数（入力の角度はラジアン、ファイルの値は度）・比較・論理・丸め・DL 版', () => {
  for (const f of FRAMES) {
    const { chan } = at(f), x = tx(f), r = rz(f) * D2R;
    const t = chan('s_trig');
    assert.ok(near(t.t[0], Math.cos(r)) && near(t.t[1], 0.5), `cos・sin ${f}: ${t.t}`);
    assert.ok(near(t.r[2], rz(f), 1e-5), `acos → 回転 ${f}: ${t.r}`);
    assert.ok(nearVec(chan('s_cmp').t, [x > 5 ? 1 : 0, x > 5 ? 0 : 1, Math.max(x, 3)]), `greaterThan・not・max ${f}`);
    assert.ok(nearVec(chan('s_rnd').t, [Math.floor(x + 0.5), x % 3, x * x]), `round・modulo・power ${f}`);
    assert.ok(nearVec(chan('s_dl').t.slice(0, 2), [x + 5, Math.hypot(x, 5)]), `sumDL・distanceBetweenDL ${f}`);
  }
});

test('ベクトル: crossProduct・angleBetween（オイラー角）・rotateVector', () => {
  for (const f of FRAMES) {
    const { chan } = at(f), r = rz(f) * D2R;
    assert.ok(nearVec(chan('v_cross').t, [0, 0, 1]));
    assert.ok(nearVec(chan('v_ab').r, [0, 0, 90], 1e-5));
    assert.ok(nearVec(chan('v_rot').t, [Math.cos(r), Math.sin(r), 0]), `rotateVector ${f}`);
  }
});

test('行列: blendMatrix（ウェイトで移動と回転を混ぜる）・pickMatrix（移動だけ）・wtAddMatrix', () => {
  for (const f of FRAMES) {
    const { pos, axis } = at(f), x = tx(f), w = x / 10;
    assert.ok(nearVec(pos('m_blend'), [x, 0, 0]), `blendMatrix の位置 ${f}`);
    const a = w * Math.PI / 2;
    assert.ok(nearVec(axis('m_blend', 0), [Math.cos(a), Math.sin(a), 0], 1e-6), `blendMatrix の回転 ${f}: ${axis('m_blend', 0)}`);
    assert.ok(nearVec(pos('m_pick'), [10, 0, 0]) && nearVec(axis('m_pick', 0), [1, 0, 0]), 'pickMatrix');
    assert.ok(nearVec(pos('m_wt'), [5, 0, 0]), 'wtAddMatrix');
  }
});

test('行列: aimMatrix（X 軸をターゲットへ）・parentMatrix（ターゲットを親に、オフセット (0, 2, 0)）', () => {
  for (const f of FRAMES) {
    const { pos, axis } = at(f), x = tx(f), r = rz(f) * D2R;
    const d = new Vector3(x, 0, 5).normalize().toArray();
    assert.ok(nearVec(pos('m_aim'), [0, 0, 0]) && nearVec(axis('m_aim', 0), d), `aimMatrix ${f}: ${axis('m_aim', 0)}`);
    assert.ok(nearVec(pos('m_par'), [x - 2 * Math.sin(r), 2 * Math.cos(r), 5]), `parentMatrix ${f}: ${pos('m_par')}`);
    assert.ok(nearVec(axis('m_par', 0), [Math.cos(r), Math.sin(r), 0]), 'parentMatrix の回転はターゲットに従う');
  }
});

test('行列から取り出す・点を掛ける: translation・rotationFromMatrix、multiplyPointByMatrix、pointMatrixMult、axisFromMatrix', () => {
  for (const f of FRAMES) {
    const { chan } = at(f), x = tx(f), r = rz(f) * D2R;
    assert.ok(nearVec(chan('m_tr').t, [x, 0, 5]) && nearVec(chan('m_tr').r, [0, 0, rz(f)], 1e-5), `translation・rotation ${f}`);
    const p = [x + Math.cos(r), Math.sin(r), 5];
    assert.ok(nearVec(chan('m_pt').t, p), `multiplyPointByMatrix（成分の名前 x）${f}: ${chan('m_pt').t}`);
    assert.ok(nearVec(chan('m_pmm').t, p), `pointMatrixMult ${f}`);
    assert.ok(nearVec(chan('m_ax').t, [-Math.sin(r), Math.cos(r), 0]), `axisFromMatrix（Y）${f}`);
  }
});

test('既定値: divide の除数 1、power の指数 2、0 で割ると 0（Maya はエラー）', () => {
  const g = (attrs, type) => {
    const d = JSON.parse(JSON.stringify(data));
    const node = d.animation.graph.find((x) => x.name === 'div1');
    node.type = type; node.attrs = attrs; node.inputs = {};
    const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
    rig.evaluate(1);
    return rig.plug(node.id, 'o');
  };
  assert.equal(g({ i1: 6 }, 'divide'), 6);
  assert.equal(g({ i1: 6, i2: 0 }, 'divide'), 0);
  assert.equal(g({ i: 3 }, 'power'), 9);
  assert.ok(near(g({ i: 8 }, 'log'), 3), 'log の底の既定値 2');
  assert.equal(g({ i: -7, m: 3 }, 'modulo'), 2, 'modulo は 0〜除数に巻き戻す');
  assert.ok(near(g({}, 'pi'), Math.PI));
  assert.equal(g({ i1: 2, i2: 3 }, 'addDL'), 5);
  assert.equal(g({ i1: 2, i2: 3 }, 'multDL'), 6);
  assert.equal(g({ i1: 2 }, 'multDL'), 0, 'multDL の入力の既定値は 0');
});

test('そのほかのスカラー・行列のノード', () => {
  const run = (attrs, type, out = 'o') => {
    const d = JSON.parse(JSON.stringify(data));
    const node = d.animation.graph.find((x) => x.name === 'div1');
    node.type = type; node.attrs = attrs; node.inputs = {};
    const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
    rig.evaluate(1);
    return rig.plug(node.id, out);
  };
  const M = [1, 2, 3, 0, 4, 5, 6, 0, 7, 8, 10, 0, 11, 12, 13, 1];        // Maya の行の順
  assert.ok(near(run({ i1: 2, i2: 6, i: 5 }, 'inverseLerp'), 0.75));
  assert.ok(near(run({ 'i[0]': 2, 'i[1]': 4, 'i[2]': 9 }, 'average'), 5));
  assert.equal(run({ 'i[0]': 2, 'i[1]': -4 }, 'min'), -4);
  assert.equal(run({ i: -2.5 }, 'absoluteDL'), 2.5);
  assert.equal(run({ i: 2.7 }, 'truncate'), 2);
  assert.equal(run({ i: -2.2 }, 'ceil'), -2);
  assert.equal(run({ i1: 3, i2: 3.05, e: 0.1 }, 'equal'), 1);
  assert.equal(run({ i1: 1, i2: 0 }, 'and'), 0);
  assert.equal(run({ i1: 1, i2: 0 }, 'or'), 1);
  assert.ok(near(run({ i1: 0, i2: 1 }, 'atan2'), Math.PI / 2), 'atan2 は (入力 1 = x, 入力 2 = y)');
  assert.ok(near(run({ i: 90 }, 'cosDL'), 0), 'DL 版もファイルの値は度');
  assert.equal(run({ i: 3, cf: 2 }, 'unitToTimeConversion'), 6);
  assert.ok(near(run({ i: M }, 'determinant'), 1 * (5 * 10 - 6 * 8) - 2 * (4 * 10 - 6 * 7) + 3 * (4 * 8 - 5 * 7)));
  assert.deepEqual(run({ m: M, i: 1 }, 'rowFromMatrix'), [4, 5, 6, 0]);
  assert.deepEqual(run({ m: M, i: 2 }, 'columnFromMatrix'), [3, 6, 10, 13]);
  assert.deepEqual(run({ i: [3, 0, 4] }, 'length'), 5);
  assert.deepEqual(run({ i: [3, 0, 4] }, 'normalize').map((v) => +v.toFixed(6)), [0.6, 0, 0.8]);
  const sum = run({ 'i[0]': M, 'i[1]': M }, 'addMatrix');
  assert.deepEqual(sum.elements.slice(0, 3), [2, 4, 6]);
  const held = run({ o: M }, 'holdMatrix');
  assert.deepEqual(held.elements.slice(12, 15), [11, 12, 13], 'holdMatrix は入力がなければファイルの値');
});
