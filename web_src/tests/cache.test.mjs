// リグの評価のキャッシュ（時間で変わらない値の keep・再生キャッシュ）の検証。
// キャッシュを使わずにフレームごとに新しく評価した結果と、同じになることを確かめる
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const SAMPLES = ['ctrl_sample', 'ik_sample', 'rig6_mapped', 'stretch_spline_mapped', 'trax_sample', 'nodedef_sample',
  'camaim_sample', 'vis_camera_sample', 'fallback_sample', 'curve_history_sample'];
const load = (name) => JSON.parse(readFileSync(path.resolve(here, `../../samples/${name}.json`), 'utf8'));

function makeRig(data, cached = true) {
  const statics = data.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => statics[ni]);
  if (!cached) { rig.keepStatic = false; rig.playbackLimit = 0; }
  return rig;
}

function framesOf(rig) {
  const out = [];
  for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) out.push(f);
  return out;
}

/** 評価のあとに読める値をまとめる（行列・表示などの属性・カーブの形と、あとから求めるチャンネル・ワールド行列） */
function state(rig, f, poseOf, poseKey) {
  const mats = rig.evaluate(f, poseOf, undefined, poseKey);
  const r = (x) => Math.round(x * 1e9) / 1e9 + 0;
  return {
    mats: [...mats].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, m.elements.map(r)]),
    props: rig.props.length ? rig.evaluateProps().map((p) => [p.kind, p.index, p.values]) : [],
    curves: rig.curveIds().map((gid) => { const c = rig.curveShape(gid); return c ? c.cvs.map((p) => p.toArray().map(r)) : null; }),
    chan: [...rig.moving].map((ni) => { const c = rig.chan(ni); return c ? [c.t, c.r, c.s].flat().map(r) : null; }),
    world: [...rig.moving].map((ni) => rig.world(ni).elements.map(r)),
  };
}

function fresh(data, f, poseOf, poseKey) {
  return state(makeRig(data, false), f, poseOf, poseKey);
}

test('前後に飛びながら同じ評価器で評価しても、毎回新しく評価した結果と同じ', () => {
  for (const name of SAMPLES) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    const order = [...frames, ...[...frames].reverse(), ...frames.filter((_, i) => i % 5 === 0), 1.5, frames[0]];
    for (const f of order) assert.deepEqual(state(rig, f), fresh(data, f), `${name} フレーム ${f}`);
    assert.ok(rig.snapshots.size > 0 || rig.moving.size === 0, `${name}: 再生キャッシュを作る`);
  }
});

test('時間で変わらない値は、フレームをまたいで計算し直さない', () => {
  const data = load('ctrl_sample');
  const rig = makeRig(data);
  rig.playbackLimit = 0;
  let calls = 0;
  const orig = rig.outputsUncached.bind(rig);
  rig.outputsUncached = (id) => { calls++; return orig(id); };
  rig.evaluate(1);
  const first = calls;
  calls = 0;
  rig.evaluate(2);
  assert.ok(rig.keep.out.size > 0, '時間で変わらない計算ノードがある');
  assert.ok(calls < first, `2 フレーム目の計算は 1 フレーム目より少ない（${calls} < ${first}）`);
  // keep を使わなければ毎回すべて計算する
  const all = makeRig(data, false);
  all.outputsUncached = (id) => { calls++; return RigEvaluator.prototype.outputsUncached.call(all, id); };
  calls = 0;
  all.evaluate(1);
  const a = calls;
  calls = 0;
  all.evaluate(2);
  assert.equal(calls, a);
});

test('ポーズ確認の追加分を変えると、キャッシュを捨てて評価し直す', () => {
  for (const name of ['ctrl_sample', 'ik_sample', 'rig6_mapped', 'camaim_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const drivers = [...rig.directDrivers].sort((a, b) => a - b);
    assert.ok(drivers.length, name);
    const poseA = new Map([[drivers[0], new Matrix4().makeTranslation(0.5, 1, -0.25)]]);
    const poseB = new Map([[drivers[0], new Matrix4().makeRotationY(0.4)], [drivers[drivers.length - 1], new Matrix4().makeTranslation(0, -1, 0)]]);
    const ofA = (ni) => poseA.get(ni) || null, ofB = (ni) => poseB.get(ni) || null;
    const steps = [[1, undefined, undefined], [5, ofA, 1], [6, ofA, 1], [5, ofA, 1], [5, ofB, 2], [6, ofB, 2], [5, undefined, undefined],
      [6, ofA, 3], [6, ofA, undefined]];
    for (const [f, of, key] of steps) {
      assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `${name} フレーム ${f}・版 ${key}`);
    }
  }
});

test('再生キャッシュを先に作っても、いまのフレームの値は変わらない', () => {
  for (const name of ['ik_sample', 'rig6_mapped', 'stretch_spline_mapped', 'vis_camera_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    const before = state(rig, 7);
    rig.bake(frames);
    assert.equal(rig.snapshots.size, frames.length, name);
    // bake のあとに、いまのフレーム（7）の値をあとから読んでも同じ
    const after = {
      mats: [...rig.matrices].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, m.elements.map((x) => Math.round(x * 1e9) / 1e9 + 0)]),
    };
    assert.deepEqual(after.mats, before.mats, name);
    assert.equal(rig.frame, 7);
    for (const f of [frames[0], 12, frames[frames.length - 1]]) assert.deepEqual(state(rig, f), fresh(data, f), `${name} フレーム ${f}`);
    // 続けて作ると、途中で止められる
    const rig2 = makeRig(data);
    rig2.evaluate(2.5);
    let n = 0;
    assert.equal(rig2.bake(frames, () => ++n < 3), 3);
    assert.equal(rig2.frame, 2.5);
  }
});

test('再生キャッシュは上限を超えて覚えない', () => {
  const data = load('rig6_mapped');
  const rig = makeRig(data);
  const per = rig.moving.size * 128 + 256;
  rig.playbackLimit = per * 5;
  const frames = framesOf(rig);
  rig.bake(frames);
  assert.equal(rig.snapshots.size, 5);
  assert.ok(rig.playbackFull);
  assert.deepEqual(state(rig, 20), fresh(data, 20));
});

test('再現チェックのあとも、評価の結果は変わらない', () => {
  for (const name of ['ik_sample', 'rig6_mapped', 'ctrl_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const clean = makeRig(data, false);
    for (const f of [1, 10, 20]) state(rig, f);
    rig.evaluate(rig.clip.current);
    clean.evaluate(clean.clip.current);
    const fl = (r) => (ni) => r.fileRestLocal(ni);
    assert.deepEqual(JSON.parse(JSON.stringify(rig.verifySaved(fl(rig)))), JSON.parse(JSON.stringify(clean.verifySaved(fl(clean)))), name);
    for (const f of [10, 21]) assert.deepEqual(state(rig, f), fresh(data, f), `${name} フレーム ${f}`);
  }
});
