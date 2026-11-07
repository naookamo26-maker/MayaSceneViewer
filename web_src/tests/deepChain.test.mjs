// 計算ノード・自作ノードの長い鎖でスタックがあふれても、値が壊れないか（deepEval.js）。
// 再生キャッシュはスタックの小さい Web Worker で作るので、そこで「Maximum call stack size exceeded」になると、
// 自作ノードの値が「値なし」になって、そのフレームの姿勢が壊れていた。
// スタックを小さくした Node.js のワーカースレッドで、汎用の経路・専用の評価・計画を作るときのたどり方を確かめる。
// 前提: python tools/make_nodedef_sample.py（samples/nodedef_sample.json）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = JSON.parse(readFileSync(path.resolve(here, '../../samples/nodedef_sample.json'), 'utf8'));
const LENGTH = 6000;                                   // 鎖の長さ（小さいスタックでは、あふれる長さ）
const FRAMES = [1, 2, 3, 4, 7, 12, 24];
const tx = (f) => 10 * (f - 1) / 23;                   // ctrl.tx のキー（リニア）

/** ctrl.tx → step0 → step1 → … → jA.ty の鎖（o = i * 0.5 + 1）を足したシーン */
function chainScene(n) {
  const data = structuredClone(base);
  const anim = data.animation;
  anim.nodeDefs.halfPlusOne = {
    type: 'halfPlusOne',
    attributes: [
      { name: 'input', short: 'i', type: 'double', default: 0 },
      { name: 'output', short: 'o', type: 'double', output: true, default: 0 },
    ],
    ir: [['set', ['o', [['o', null]]], ['b', '+', ['b', '*', ['a', [['i', null]]], ['n', 0.5]], ['n', 1]]]],
  };
  // 0 で割るノード（実行時の誤りの確かめ用）は、問題が出て専用の評価にならないので外す
  const dv = anim.graph.find((g) => g.name === 'dv1');
  for (const g of anim.graph) {
    for (const [k, v] of Object.entries(g.inputs || {})) if (v.node === dv.id) delete g.inputs[k];
  }
  const ctrl = anim.graph.find((g) => g.name === 'ctrl');
  let id = Math.max(...anim.graph.map((g) => g.id)) + 1;
  let prev = { node: ctrl.id, attr: 'tx' };
  for (let k = 0; k < n; k++, id++) {
    anim.graph.push({ id, name: `step${k}`, type: 'halfPlusOne', dag: -1, def: 'halfPlusOne', inputs: { i: prev } });
    prev = { node: id, attr: 'o' };
  }
  anim.graph.find((g) => g.name === 'jA').inputs.ty = prev;
  return data;
}

/** 鎖の先の値（同じ計算の順番） */
function expected(f, n) {
  let x = tx(f);
  for (let k = 0; k < n; k++) x = x * 0.5 + 1;
  return x;
}

const scene = chainScene(LENGTH);
const jA = scene.nodes.findIndex((nd) => nd.name === 'jA');

test('画面側の評価器: 長い鎖でも値が正しく、問題がない（汎用の経路・専用の評価）', () => {
  const rig = new RigEvaluator(new AnimationClip(scene.animation), scene.nodes, (ni) => new Matrix4().fromArray(scene.nodes[ni].matrix));
  for (const f of FRAMES) {
    rig.evaluate(f);
    assert.equal(rig.chan(jA).t[1], expected(f, LENGTH), `フレーム ${f}（${rig.lastPath}）`);
  }
  assert.deepEqual([...rig.problems], []);
  assert.ok(rig.compiledPlan, `専用の評価にならない: ${rig.compiledReason}`);
});

test('スタックの小さいワーカー: あふれてもやり直して、画面側と同じ値になる（再生キャッシュを作る経路）', async () => {
  const src = `
    import { parentPort, workerData } from 'node:worker_threads';
    import { createBaker, bakeFrames, bakerInfo } from ${JSON.stringify(new URL('../src/rigBakeCore.js', import.meta.url).href)};
    const { anim, nodes, frames, jA } = workerData;
    const baker = createBaker(anim, nodes);
    const out = [];
    for (const f of frames) {
      const r0 = baker.rig.deepState.retries;
      bakeFrames(baker, { frames: [f] });
      const retries = baker.rig.deepState.retries - r0;   // 再生キャッシュを作る評価のやり直し（下の chan を読む前に数える）
      out.push({ f, ty: baker.rig.chan(jA).t[1], path: baker.rig.lastPath, retries });
    }
    parentPort.postMessage({ out, info: bakerInfo(baker), retries: baker.rig.deepState.retries, problems: [...baker.rig.problems] });
  `;
  const res = await new Promise((resolve, reject) => {
    const w = new Worker(new URL(`data:text/javascript,${encodeURIComponent(src)}`), {
      workerData: { anim: JSON.stringify(scene.animation), nodes: scene.nodes, frames: FRAMES, jA },
      resourceLimits: { stackSizeMb: 1 },
    });
    w.once('message', resolve);
    w.once('error', reject);
  });
  assert.ok(res.retries > 0, 'スタックがあふれていない（鎖を長くするか、スタックを小さくする）');
  assert.deepEqual(res.problems, []);
  assert.ok(res.info.plan, `専用の評価にならない: ${res.info.reason}`);
  for (const { f, ty, path: p } of res.out) assert.equal(ty, expected(f, LENGTH), `フレーム ${f}（${p}）`);
  assert.ok(res.out.some((o) => o.path === 'compiled'), '専用の評価の経路を通っていない');
  // やり直した順番を覚えて、次のフレームから深い所を先に求めるので、毎フレームあふれ直さない
  const late = res.out.slice(-3).map((o) => o.retries);
  assert.deepEqual(late, [0, 0, 0], `あとのフレームでもやり直している: ${res.out.map((o) => o.retries).join(',')}`);
});

test('専用の評価でやり直せない所のスタックがあふれたら、計画をやめて汎用の経路で同じ値を求める', () => {
  const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/math_sample.json'), 'utf8'));
  const make = () => new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  const rig = make(), ref = make();
  ref.useCompiled = false;
  rig.evaluate(1);
  assert.ok(rig.compiledPlan, '専用の評価にならない');
  // 計画の手順を読むとスタックがあふれたことにする（ワーカーの中で、やり直せない所であふれたとき）
  Object.defineProperty(rig.compiledPlan, 'order', {
    get() { const e = new RangeError('Maximum call stack size exceeded'); e.stack = `${e.message}\n    at chanTObj (x:1:1)\n    at Object.dagPlug (x:1:1)`; throw e; },
  });
  for (const f of [5, 9]) {
    const got = rig.evaluate(f, undefined, new Map()), want = ref.evaluate(f, undefined, new Map());
    assert.equal(rig.lastPath, 'generic', `フレーム ${f}`);
    for (const [ni, m] of want) assert.deepEqual(got.get(ni).elements, m.elements, `フレーム ${f}・ノード ${ni}`);
  }
  assert.equal(rig.compiledPlan, null);
  assert.equal(rig.compiledReason, '計算の鎖が深すぎる（スタックがあふれた: chanTObj ← dagPlug）');
});

test('変数・演算の多い自作ノード: 関数のまま、スタックの小さいワーカーで正しい値を求める（一時変数の使い回し・変数の配列）', async () => {
  const VARS = 40000;
  const data = structuredClone(base);
  const anim = data.animation;
  const dv = anim.graph.find((g) => g.name === 'dv1');
  for (const g of anim.graph) for (const [k, v] of Object.entries(g.inputs || {})) if (v.node === dv.id) delete g.inputs[k];
  // s = Σ (i + k)（k = 0 … VARS-1。変数 x0 … を 1 つずつ使う）
  const a = ['a', [['i', null]]];
  const ir = [['set', ['l', 's'], ['n', 0]]];
  for (let k = 0; k < VARS; k++) ir.push(['set', ['l', `x${k}`], ['b', '+', a, ['n', k]]]);
  for (let k = 0; k < VARS; k++) ir.push(['set', ['l', 's'], ['b', '+', ['l', 's'], ['l', `x${k}`]]]);
  ir.push(['set', ['o', [['o', null]]], ['b', '*', ['l', 's'], ['n', 1e-9]]]);
  anim.nodeDefs.manyLocals = {
    type: 'manyLocals', ir,
    attributes: [{ name: 'input', short: 'i', type: 'double', default: 0 }, { name: 'output', short: 'o', type: 'double', output: true, default: 0 }],
  };
  const ctrl = anim.graph.find((g) => g.name === 'ctrl');
  const id = Math.max(...anim.graph.map((g) => g.id)) + 1;
  anim.graph.push({ id, name: 'big', type: 'manyLocals', dag: -1, def: 'manyLocals', inputs: { i: { node: ctrl.id, attr: 'tx' } } });
  anim.graph.find((g) => g.name === 'jA').inputs.ty = { node: id, attr: 'o' };
  const want = (f) => { let s = 0; for (let k = 0; k < VARS; k++) s += tx(f) + k; return s * 1e-9; };

  const src = `
    import { parentPort, workerData } from 'node:worker_threads';
    import { createBaker, bakeFrames, bakerInfo } from ${JSON.stringify(new URL('../src/rigBakeCore.js', import.meta.url).href)};
    const { anim, nodes, jA } = workerData;
    const baker = createBaker(anim, nodes);
    const out = [];
    for (const f of [1, 5, 9]) {
      const r = bakeFrames(baker, { frames: [f] });
      out.push({ f, ty: baker.rig.chan(jA).t[1], timing: r.timing });
    }
    parentPort.postMessage({ out, info: bakerInfo(baker), problems: [...baker.rig.problems] });
  `;
  const res = await new Promise((resolve, reject) => {
    const w = new Worker(new URL(`data:text/javascript,${encodeURIComponent(src)}`), {
      workerData: { anim: JSON.stringify(anim), nodes: data.nodes, jA },
      resourceLimits: { stackSizeMb: 1 },
    });
    w.once('message', resolve);
    w.once('error', reject);
  });
  assert.deepEqual(res.problems, []);
  for (const { f, ty } of res.out) assert.equal(ty, want(f), `フレーム ${f}`);
  const last = res.out[res.out.length - 1].timing;
  assert.equal(last.interpreted, 0, JSON.stringify(last));
  assert.equal(res.info.defsCompiled, res.info.defsTotal);
  assert.ok(res.info.plan, `専用の評価にならない: ${res.info.reason}`);
});

test('関数がスタックに収まらない自作ノード: その定義だけ IR をたどる計算に切り替えて、正しい値を求める', () => {
  const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/nodedef_sample.json'), 'utf8'));
  const make = () => new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  const rig = make(), ref = make();
  const d = rig.defs.get('angleDouble');
  assert.ok(d.compiled);
  // 関数で計算すると、浅い所から呼んでもスタックがあふれることにする（変数の多い定義をスタックの小さいワーカーで呼んだとき）
  const run = d.run;
  d.run = function (io) {
    if (d.compiled) throw new RangeError('Maximum call stack size exceeded');
    return run.call(d, io);
  };
  for (const f of [1, 7, 12]) {
    const got = rig.evaluate(f, undefined, new Map()), want = ref.evaluate(f, undefined, new Map());
    for (const [ni, m] of want) assert.deepEqual(got.get(ni).elements, m.elements, `フレーム ${f}・ノード ${ni}`);
  }
  assert.equal(d.compiled, false);
  assert.deepEqual([...rig.defsInterpreted], ['angleDouble']);
  assert.deepEqual([...rig.problems], [...ref.problems]);
  assert.ok(rig.deepState.retries < 10, `やり直しが多すぎる: ${rig.deepState.retries}`);
});
