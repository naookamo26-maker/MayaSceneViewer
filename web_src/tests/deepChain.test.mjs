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
