// リグの専用の評価（rigCompiled.js）: 従来の評価器（RigEvaluator の汎用の経路）とビット単位で同じ結果になるか
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { near } from './near.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));
const data = load('compiled_sample.json');

function makeRig(d, compiled, limit = 0) {
  const statics = d.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => statics[ni]);
  rig.useCompiled = compiled;
  rig.setPlaybackLimit(limit);
  return rig;
}
const framesOf = (rig) => { const out = []; for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) out.push(f); return out; };
/** 動くノードのローカル行列（ビット単位で比べるため、そのままの数値） */
const valuesOf = (rig, f, poseOf, poseKey) => JSON.stringify([...rig.evaluate(f, poseOf, new Map(), poseKey)]
  .sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, Array.from(m.elements)]));
/** 再生キャッシュから読んだ値と比べるとき（キャッシュは 32 ビットに丸めてあるので、ごく近ければよい） */
const nearValues = (a, b, msg) => near(JSON.parse(a), JSON.parse(b), msg);
const nodeIndex = (name) => data.nodes.findIndex((n) => n.name === name);

test('サンプルのリグは専用の評価になり、全フレームで従来の評価器とビット単位で同じ', () => {
  const a = makeRig(data, false), b = makeRig(data, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, `計画を作る（${b.compiledReason}）`);
  assert.deepEqual(b.compiledPlan.counts, { simple: 6, driven: 21, delegated: 0, constraints: 13, ik: 3, math: 3 });
  assert.equal(b.compiledPlan.iks.filter((ik) => ik.pvc).length, 1, '極ベクトルのコンストレイントも専用に計算する');
  // 逆順・整数でないフレームも
  for (const f of [...frames, ...frames.slice().reverse(), 1.5, 7.25, 29.9, 0, 40]) {
    assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
  }
  assert.equal(a.compiledPlan, undefined, 'useCompiled = false なら計画を作らない');
});

test('再生キャッシュに入れたものも同じ（32 ビットに丸めた分を除く）。ポーズ確認で動かすと、影響を受けるノードだけ計算し直して合う', () => {
  const b = makeRig(data, true, 1e9), fresh = makeRig(data, false);
  const frames = framesOf(b);
  for (const f of frames) b.evaluate(f);                       // 1 回目で計画を作り、残りは専用の評価で作って覚える
  assert.ok(b.compiledPlan);
  assert.equal(b.snapshots.size, frames.length);
  for (const f of frames) {
    nearValues(valuesOf(b, f), valuesOf(fresh, f), `キャッシュから ${f}`);
    assert.ok(b.current, `フレーム ${f} はキャッシュから`);
  }
  // c1・jt（コンストレイントのターゲット）・j0（コンストレイントで動く）・pv_a（極ベクトルのターゲット）・k0・m1（IK のジョイント）を
  // 動かす。c0 は計算ノードの入力元、q1 は計算ノードで動く（m1・q1 は従来の評価器でも全体を計算し直す）: 従来の評価器が、専用の評価で覚えた
  // フレームから影響のないノードを写し、影響のあるノード（依存の記録で見分ける）だけ計算する
  for (const name of ['c1', 'jt', 'j0', 'jp', 'pv_a', 'k0', 'm1', 'c2', 'c0', 'q1', 'grp']) {
    const ni = nodeIndex(name);
    const m = new Matrix4().compose(new Vector3(0.1, 0.2, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.4), new Vector3(1, 1, 1));
    const poseOf = (n) => (n === ni ? m : null), keys = new Map([[ni, name]]);
    for (const f of frames) nearValues(valuesOf(b, f, poseOf, keys), valuesOf(fresh, f, poseOf, keys), `${name} を動かしたとき ${f}`);
    assert.ok(b.seeded > 0 || ['grp', 'm1', 'q1'].includes(name), `${name}: 影響のないノードは写す（${b.seeded}）`);
  }
  for (const f of frames) nearValues(valuesOf(b, f), valuesOf(fresh, f), `追加分を戻したとき ${f}`);
});

test('扱えない種類のノードは従来の評価器に任せて混ぜて計算し、全フレームでビット単位で同じ（任せる理由を残す）', () => {
  for (const [name, why] of [['ik_sample.json', /IK/], ['math_sample.json', /offsetParentMatrix/], ['camaim_sample.json', null],
    ['constraint_space_sample.json', null], ['rig_sample.json', null]]) {
    const d = load(name);
    const a = makeRig(d, false), b = makeRig(d, true);
    const frames = framesOf(a);
    b.evaluate(frames[0]);
    assert.ok(b.compiledPlan, `${name}: ${b.compiledReason}`);
    assert.ok(b.compiledPlan.counts.simple + b.compiledPlan.counts.driven > 0, name);
    if (why) assert.ok(Object.keys(b.compiledPlan.delegated).some((r) => why.test(r)), `${name}: ${Object.keys(b.compiledPlan.delegated)}`);
    for (const f of [...frames, 1.5, frames[frames.length - 1] + 3]) assert.equal(valuesOf(b, f), valuesOf(a, f), `${name} フレーム ${f}`);
  }
});

test('専用に計算できるノードのないリグは、計画を作らず従来の評価器で評価する（理由を残す）', () => {
  for (const [name, why] of [['sequencer_sample.json', /動くノードがない/], ['trax_sample.json', /character/]]) {
    const d = load(name);
    const b = makeRig(d, true);
    b.evaluate(Math.ceil(b.clip.start));
    assert.equal(b.compiledPlan, null, name);
    assert.match(b.compiledReason, why, `${name}: ${b.compiledReason}`);
  }
});

test('動かないジョイントが親のスケールの打ち消しの元を持っても、専用の評価を使い、結果は同じ', () => {
  // HumanIK の部位に割り当てていない途中のジョイントの形（以前はこのノード 1 つでリグ全体を汎用の経路にしていた）
  const d = load('static_is_sample.json');
  const a = makeRig(d, false), b = makeRig(d, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, `計画を作る（${b.compiledReason}）`);
  assert.deepEqual(b.compiledPlan.delegated, {});
  const B = d.nodes.findIndex((n) => n.name === 'B');
  assert.ok(!b.moving.has(B) && b.rest(B) && b.rest(b.rest(B).isNode), 'B は動かず、打ち消しの元（A）にレストの値がある');
  for (const f of [...frames, 1.5, 12.25, 0, 30]) assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
});

test('専用の評価を使えないときの理由に、原因の中身を入れる', () => {
  const d = load('nodedef_sample.json');
  const rig = makeRig(d, true);
  rig.evaluate(Math.ceil(rig.clip.start));
  assert.equal(rig.compiledPlan, null);
  assert.match(rig.compiledReason, /^評価の打ち切り（循環など。計算の順番で結果が変わりうる: .+）$/);
  assert.ok(rig.compiledReason.includes([...rig.problems][0]), rig.compiledReason);
});

test('animLayer（ウェイトとミュートだけで出力が決まる）を読むノードも、専用の評価で計算する', () => {
  const d = load('rig6_sample.json');
  const a = makeRig(d, false), b = makeRig(d, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, b.compiledReason);
  assert.ok(d.animation.graph.some((g) => g.type === 'animLayer'), 'animLayer のあるサンプル');
  assert.ok(!Object.keys(b.compiledPlan.delegated).some((w) => w.includes('animLayer')), JSON.stringify(b.compiledPlan.delegated));
  for (const f of frames) assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
});

test('ノード単位の計算の順番が循環しても、循環の中のノードを任せて専用の評価にし、ビット単位で同じ', () => {
  // 前提: python tools/make_order_cycle_sample.py。tx は ty の移動（コンストレイント）を、ty は回転の入力の tx を読む
  const d = load('order_cycle_sample.json');
  const a = makeRig(d, false), b = makeRig(d, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, `計画を作る（${b.compiledReason}）`);
  const delegated = b.compiledPlan.order.filter((s) => s.why).map((s) => [d.nodes[s.ni].name, s.why]);
  assert.deepEqual(delegated, [['ty', '計算の順番の循環の中のノード']]);
  for (const f of [...frames, ...frames.slice().reverse(), 3.5]) assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
  assert.deepEqual([...b.problems], []);
});

test('expression（入力とフレームだけで出力が決まる）で動くノードも、専用の評価で計算し、ビット単位で同じ', () => {
  // ctrl_sample: frame を読む式（expr_wave → e_jnt1）と、入力・変数・if を使う式（expr_logic → e_jnt2）
  const d = load('ctrl_sample.json');
  const a = makeRig(d, false), b = makeRig(d, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, b.compiledReason);
  assert.ok(!Object.keys(b.compiledPlan.delegated).some((w) => w.includes('expression')), JSON.stringify(b.compiledPlan.delegated));
  for (const name of ['e_jnt1', 'e_jnt2']) {
    const ni = d.nodes.findIndex((n) => n.name === name);
    assert.notEqual(b.compiledPlan.steps.get(ni).kind, 3, `${name} は任せない`);
  }
  // 前後に飛ぶ順・途中のフレームでも（frame を読む式は、フレームごとに値が変わる）
  for (const f of [...frames, ...[...frames].reverse(), 1.5, 7.25]) assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
});
