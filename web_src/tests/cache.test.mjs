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

test('再生キャッシュは上限を超えて覚えない（カーブの形・属性の値も数える）', () => {
  for (const name of ['rig6_mapped', 'stretch_spline_mapped', 'vis_camera_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    rig.bake(frames.slice(0, 1));
    const one = rig.snapshotBytes;
    assert.ok(one >= rig.moving.size * 128, name);
    rig.setPlaybackLimit(one * 5 + 10);
    rig.bake(frames);
    const st = rig.playbackStats();
    // 1 フレーム目には時間で変わらないカーブの形の分も入るので、2 フレーム目以降は小さいこともある
    assert.ok(st.frames >= 5 && st.frames < frames.length, `${name}: ${st.frames} フレーム`);
    assert.ok(st.bytes <= st.limit, `${name}: ${st.bytes} <= ${st.limit}`);
    assert.ok(st.full, name);
    assert.deepEqual(state(rig, 20), fresh(data, 20), name);
  }
});

test('時間で形が変わるカーブは、フレームごとに大きさを数える（変わらない形は 1 回だけ）', () => {
  const data = load('stretch_spline_mapped');
  const rig = makeRig(data);
  const frames = framesOf(rig);
  rig.bake(frames);
  const matsOnly = frames.length * (rig.moving.size * 128);
  const shapes = rig.curveIds().map((gid) => [...rig.snapshots.values()].map((sn) => sn.curves.get(gid)));
  const varying = shapes.filter((list) => new Set(list).size > 1).length;
  assert.ok(varying > 0, '形が変わるカーブがある');
  assert.ok(rig.snapshotBytes > matsOnly + frames.length * varying * 160, `${rig.snapshotBytes} > ${matsOnly}`);
});

test('上限を下げると先に覚えたフレームから捨て、0 にすると使わない', () => {
  const data = load('ik_sample');
  const rig = makeRig(data);
  const frames = framesOf(rig);
  rig.evaluate(30);
  rig.bake(frames);
  assert.equal(rig.snapshots.size, frames.length);
  const half = rig.snapshotBytes / 2;
  rig.setPlaybackLimit(half);
  assert.ok(rig.snapshotBytes <= half, `${rig.snapshotBytes} <= ${half}`);
  assert.ok(rig.hasSnapshot(30), 'いまのフレームは残す');
  assert.ok(!rig.hasSnapshot(frames[0]), '先に覚えたフレームから捨てる');
  assert.deepEqual(state(rig, 1), fresh(data, 1));
  rig.setPlaybackLimit(0);
  assert.equal(rig.snapshots.size, 0);
  assert.equal(rig.bake(frames), 0);
  state(rig, 3);
  assert.equal(rig.snapshots.size, 0, 'オフのあいだは覚えない');
  assert.deepEqual(state(rig, 4), fresh(data, 4));
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

// ---------------------------------------------------------------- 追加分ごとのキャッシュ（ノードごとの目印）
/** ノード番号 → Matrix4 の追加分から、poseOf とノードごとの目印（Map）を作る */
function posed(entries) {
  const m = new Map(entries.map(([ni, mat]) => [ni, mat]));
  const keys = new Map(entries.map(([ni, mat]) => [ni, mat.elements.map((x) => x.toFixed(9)).join(',')]));
  return [m.size ? (ni) => m.get(ni) || null : undefined, m.size ? keys : undefined];
}

/** evaluate の中での、動くノードのローカル行列の計算の回数を数える（評価のあとに読む値の分は数えない） */
function countLocal(rig) {
  const c = { n: 0, on: false };
  const orig = rig.localFileUncached.bind(rig);
  rig.localFileUncached = (ni, rest) => { if (c.on) c.n++; return orig(ni, rest); };
  const ev = rig.evaluate.bind(rig);
  rig.evaluate = (...a) => { c.on = true; try { return ev(...a); } finally { c.on = false; } };
  return c;
}

test('リグが読まないノードを動かしても、再生キャッシュと keep を捨てない', () => {
  for (const name of ['ctrl_sample', 'ik_sample', 'rig6_mapped']) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    rig.evaluate(frames[0]);
    rig.bake(frames);
    const unread = data.nodes.findIndex((_, i) => !rig.poseReads.has(i));
    assert.ok(unread >= 0, `${name}: リグが読まないノードがある`);
    const keepSize = rig.keep.local.size + rig.keep.world.size + rig.keep.chan.size;
    const [of, key] = posed([[unread, new Matrix4().makeTranslation(3, 0, 0)]]);
    const c = countLocal(rig);
    for (const f of frames) assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `${name} フレーム ${f}`);
    assert.equal(c.n, 0, `${name}: 計算し直さない`);
    assert.equal(rig.snapshots.size, frames.length, name);
    assert.equal(rig.layers.length, 1, `${name}: 新しいレイヤーを作らない`);
    assert.ok(rig.keep.local.size + rig.keep.world.size + rig.keep.chan.size >= keepSize, `${name}: keep を残す`);
  }
});

test('追加分を前と同じに戻すと、前のレイヤーをそのまま使う（元に戻す・キーのある値をカーブに戻す）', () => {
  for (const name of ['ctrl_sample', 'ik_sample', 'rig6_mapped', 'camaim_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    rig.bake(frames);
    // リグが読むコントローラー（読まないものは、動かしても同じレイヤーを使う）
    const driver = [...rig.directDrivers].sort((a, b) => a - b).find((ni) => rig.poseReads.has(ni));
    const [ofA, keyA] = posed([[driver, new Matrix4().makeTranslation(0.5, 1, -0.25)]]);
    assert.deepEqual(state(rig, 5, ofA, keyA), fresh(data, 5, ofA, keyA), name);
    assert.equal(rig.layers.length, 2, `${name}: 追加分のレイヤーを作る`);
    const c = countLocal(rig);
    for (const f of frames) assert.deepEqual(state(rig, f), fresh(data, f), `${name} フレーム ${f}`);
    assert.equal(c.n, 0, `${name}: 追加分を戻したら、計算し直さない`);
    // 同じ追加分（別の Map でも中身が同じ）に戻すと、そのフレームも計算し直さない
    const [ofA2, keyA2] = posed([[driver, new Matrix4().makeTranslation(0.5, 1, -0.25)]]);
    assert.deepEqual(state(rig, 5, ofA2, keyA2), fresh(data, 5, ofA, keyA), name);
    assert.equal(c.n, 0, `${name}: 同じ追加分のフレームは計算し直さない`);
  }
});

test('新しい追加分のフレームは、影響を受けるノードだけを計算する（ほかのレイヤーから写す）', () => {
  let seededSome = false;
  for (const name of ['ctrl_sample', 'ik_sample', 'rig6_mapped', 'rig6_sample', 'camaim_sample', 'hik_sample', 'math_sample']) {
    const data = load(name);
    const rig = makeRig(data);
    const frames = framesOf(rig);
    rig.bake(frames);
    const drivers = [...rig.directDrivers].sort((a, b) => a - b);
    for (const ni of [drivers[0], drivers[drivers.length - 1]]) {
      const [of, key] = posed([[ni, new Matrix4().makeRotationY(0.3).setPosition(0.2, -0.4, 0.1)]]);
      rig.setPlaybackPose(of, key);
      const full = makeRig(data);
      const cFull = countLocal(full);
      full.evaluate(frames[0], of, undefined, key);
      const c = countLocal(rig);
      rig.evaluate(frames[0], of, undefined, key);
      assert.ok(c.n <= cFull.n, `${name}: ${c.n} <= ${cFull.n}`);
      if (rig.seeded > 0) seededSome = true;
      rig.bake(frames);
      for (const f of frames) assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `${name} ノード ${ni} フレーム ${f}`);
      rig.setPlaybackPose(null);
    }
  }
  assert.ok(seededSome, '影響のないノードを写すことがある');
});

test('追加分を変えると、変えたノードを読んだ keep の値だけを捨てる', () => {
  const data = load('rig6_mapped');
  const rig = makeRig(data);
  rig.evaluate(1);
  rig.evaluate(2);
  const before = rig.keep.chan.size + rig.keep.world.size + rig.keep.local.size + rig.keep.posed.size;
  const drivers = [...rig.directDrivers].sort((a, b) => a - b);
  const [of, key] = posed([[drivers[0], new Matrix4().makeTranslation(0, 0.5, 0)]]);
  rig.playbackLimit = 0;
  rig.evaluate(2, of, undefined, key);
  const after = rig.keep.chan.size + rig.keep.world.size + rig.keep.local.size + rig.keep.posed.size;
  assert.ok(before > 0 && after > 0, `${before} → ${after}`);
  for (const f of [2, 7, 30]) assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `フレーム ${f}`);
});

test('再生で使う追加分（setPlaybackPose）で作り、タイムラインの帯はそのレイヤーを示す', () => {
  const data = load('ik_sample');
  const rig = makeRig(data);
  const frames = framesOf(rig);
  rig.evaluate(10);
  rig.bake(frames);
  const drivers = [...rig.directDrivers].sort((a, b) => a - b);
  const [of, key] = posed([[drivers[0], new Matrix4().makeTranslation(0.3, 0, 0)]]);
  // いまのフレームだけ動かしている（再生すると戻る）: 再生で使うのは追加分なし
  rig.setPlaybackPose();
  state(rig, 10, of, key);
  assert.equal(rig.hasSnapshot(10), true);
  assert.equal(rig.snapshots.size, frames.length, '追加分なしのレイヤーを示す');
  const c = countLocal(rig);
  assert.equal(rig.bake(frames), 0, '作り直さない');
  assert.equal(c.n, 0);
  assert.equal(rig.playbackFull, false);
  // 再生でも残る追加分: そのレイヤーを作る
  rig.setPlaybackPose(of, key);
  assert.equal(rig.snapshots.size, 1, 'いまのフレームだけ');
  rig.bake(frames);
  assert.equal(rig.snapshots.size, frames.length);
  for (const f of [1, 24, 48]) assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `フレーム ${f}`);
});

test('いろいろな追加分を行き来しても、毎回新しく評価した結果と同じ（上限が小さくても）', () => {
  for (const name of ['ctrl_sample', 'ik_sample', 'rig6_mapped', 'stretch_spline_mapped', 'camaim_sample', 'fallback_sample', 'hik_sample']) {
    const data = load(name);
    for (const small of [false, true]) {
      const rig = makeRig(data);
      const frames = framesOf(rig);
      const drivers = [...rig.directDrivers].sort((a, b) => a - b);
      const moving = [...rig.moving];
      const cand = [...new Set([drivers[0], drivers[drivers.length - 1], moving[0], moving[moving.length - 1]])].filter((x) => x !== undefined);
      if (small) { rig.bake(frames.slice(0, 3)); rig.setPlaybackLimit(rig.snapshotBytes * 2); }
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const poses = [[], [[cand[0], new Matrix4().makeTranslation(0.4, 0, 0)]]];
      for (let i = 0; i < 4; i++) {
        const ni = cand[Math.floor(rnd() * cand.length)];
        poses.push([[ni, new Matrix4().makeRotationX(rnd() - 0.5).setPosition(rnd() - 0.5, 0, rnd() - 0.5)]]);
      }
      for (let step = 0; step < 14; step++) {
        const [of, key] = posed(poses[Math.floor(rnd() * poses.length)]);
        if (rnd() < 0.5) { rig.setPlaybackPose(of, key); rig.bake(frames, (() => { let k = 0; return () => ++k < 6; })()); }
        const f = frames[Math.floor(rnd() * frames.length)];
        assert.deepEqual(state(rig, f, of, key), fresh(data, f, of, key), `${name}${small ? '（上限小）' : ''} ステップ ${step} フレーム ${f}`);
      }
      assert.ok(rig.layers.length <= 6, name);
      assert.ok(rig.snapshotBytes <= rig.playbackLimit, name);
    }
  }
});
