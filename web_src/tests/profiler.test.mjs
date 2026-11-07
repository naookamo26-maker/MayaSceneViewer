// 評価のプロファイラ（profiler.js）: 記録しても評価の結果が変わらないこと・種類ごと・経路ごとの集計・文字の結果
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { EvalProfiler, PARTS, cacheInfo, nodeCategory, profilerText, uniqueNames } from '../src/profiler.js';
import { bakeFrames, createBaker } from '../src/rigBakeCore.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));

function makeRig(d, { compiled = true, limit = 0 } = {}) {
  const statics = d.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => statics[ni]);
  rig.useCompiled = compiled;
  rig.setPlaybackLimit(limit);
  return rig;
}
const framesOf = (rig) => { const out = []; for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) out.push(f); return out; };
const valuesOf = (mats) => JSON.stringify([...mats].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, Array.from(m.elements)]));

/** ビューアの applyFrame と同じ順に、記録しながら評価する */
function recordFrame(prof, rig, f, reason = '理由') {
  prof.beginFrame(f);
  const t = performance.now();
  rig.profile = prof;
  let mats;
  try { mats = rig.evaluate(f, undefined, new Map()); } finally { rig.profile = null; }
  prof.addEval(rig, performance.now() - t, reason);
  prof.add('curves', 0.5);
  prof.endFrame();
  prof.addRender(1);
  return mats;
}

test('記録しても評価の結果は変わらず、種類ごとに専用の評価の手順を分ける', () => {
  const d = load('compiled_sample.json');
  const plain = makeRig(d), rec = makeRig(d);
  const prof = new EvalProfiler();
  prof.start();
  for (const f of framesOf(plain)) {
    assert.equal(valuesOf(recordFrame(prof, rec, f)), valuesOf(plain.evaluate(f, undefined, new Map())), `フレーム ${f}`);
  }
  assert.ok(rec.compiledPlan, '専用の評価を使う');
  assert.equal(rec.profile, null, '記録のあとは評価器に何も残さない');
  const labels = prof.rows('type').map((r) => r.label);
  for (const want of ['キーで動くノード', 'IK（ikRPsolver）で動くジョイント', 'IK（ikSCsolver）で動くジョイント', 'parentConstraint で動くノード',
    'aimConstraint で動くノード', 'lookAt で動くノード', '動かないノード（親の行列を掛けるだけ）']) {
    assert.ok(labels.includes(want), `種類: ${want}（${labels.join(' / ')}）`);
  }
  assert.ok(labels.some((l) => /^計算ノード（.+）で動くノード$|計算ノード（/.test(l)), '計算ノードで動くノード');
  // 最初のフレームは汎用の経路（計画を作る前）、2 フレーム目からは専用の評価
  assert.equal(prof.frames[0].path, 'generic');
  assert.ok(prof.frames.slice(1).every((e) => e.path === 'compiled'));
  const paths = prof.rows('path').map((r) => r.label);
  assert.ok(paths.includes('専用の評価'));
  assert.ok(paths.includes('汎用の経路（理由）'), paths.join(' / '));
  // ノードごと: 時間の大きい順に、名前と種類。上位 limit 個
  const byNode = prof.rows('node');
  assert.ok(byNode.length > 0 && byNode.length <= 100);
  for (let i = 1; i < byNode.length; i++) assert.ok(byNode[i - 1].ms >= byNode[i].ms, '時間の大きい順');
  for (const r of byNode) {
    assert.equal(r.label, d.nodes[r.ni].name);
    assert.ok(labels.includes(r.kind), `種類は種類ごとの表のどれか: ${r.kind}`);
  }
  assert.equal(prof.rows('node', 3).length, 3);
  const share = prof.rows('type').reduce((s, r) => s + r.share, 0);
  assert.ok(Math.abs(share - 1) < 1e-9, '割合の合計は 1');
  // フレームの内訳: 評価・カーブ・描画・その他が入る
  const s = prof.summary();
  assert.equal(s.frames, framesOf(plain).length);
  assert.equal(s.hits, 0);
  assert.equal(s.avg.curves, 0.5);
  assert.equal(s.avg.render, 1);
  assert.ok(s.avg.compiled > 0 && s.avg.scene >= 0);
  const cov = prof.coverage();
  assert.ok(cov.categories > 0 && cov.rig > 0);
});

test('汎用の経路に任せたノードは、任せた理由ごとに分ける', () => {
  const d = load('stretch_spline_sample.json');
  const rig = makeRig(d);
  const prof = new EvalProfiler();
  prof.start();
  for (const f of framesOf(rig)) recordFrame(prof, rig, f);
  assert.ok(rig.compiledPlan, rig.compiledReason);
  const why = Object.keys(rig.compiledPlan.delegated);
  assert.ok(why.length, '任せたノードがあるサンプル');
  const paths = prof.rows('path');
  for (const w of why) {
    const row = paths.find((r) => r.label === `汎用の経路に任せた: ${w}`);
    assert.ok(row, `経路: ${w}`);
    assert.equal(row.path, 'generic');
    assert.equal(row.nodes, rig.compiledPlan.delegated[w]);
  }
  const g = prof.frames.slice(1).reduce((s, e) => s + (e.parts.generic || 0), 0);
  assert.ok(g > 0, '専用の評価のフレームでも、任せたノードの時間は汎用の経路に入る');
});

test('汎用の経路だけで評価するときは、ノードを何で動くかで分け、理由を経路に出す', () => {
  const d = load('compiled_sample.json');
  const rig = makeRig(d, { compiled: false });
  const prof = new EvalProfiler();
  prof.start();
  for (const f of framesOf(rig)) recordFrame(prof, rig, f, '専用の評価を使わない設定');
  assert.ok(prof.frames.every((e) => e.path === 'generic' && e.reason === '専用の評価を使わない設定'));
  const paths = prof.rows('path');
  assert.equal(paths.length, 1);
  assert.equal(paths[0].label, '汎用の経路（専用の評価を使わない設定）');
  assert.equal(paths[0].nodes, rig.moving.size);
  const types = prof.rows('type');
  assert.equal(types.reduce((s, r) => s + r.nodes, 0), rig.moving.size, '動くノードはどれか 1 つの種類');
  const ik = [...rig.ikJoint.keys()][0];
  assert.match(nodeCategory(rig, ik), /^IK（ik(RP|SC)solver）で動くジョイント$/);
});

test('再生キャッシュのフレームはコピーとして数え、キャッシュを使わずに測るときは覚えたフレームをそのまま残す', () => {
  const d = load('compiled_sample.json');
  const rig = makeRig(d, { limit: 64 * 1024 * 1024 });
  const frames = framesOf(rig);
  for (const f of frames) rig.evaluate(f);                     // キャッシュを作る
  const have = rig.snapshots.size;
  const prof = new EvalProfiler();
  prof.start();
  for (const f of frames) recordFrame(prof, rig, f);
  assert.ok(prof.frames.every((e) => e.path === 'cache' && e.parts.cache >= 0 && !e.parts.compiled));
  assert.equal(prof.evaluated, 0);
  assert.equal(prof.rows('type').length, 0, 'キャッシュのフレームは評価の内訳に入れない');
  const before = valuesOf(rig.evaluate(frames[3], undefined, new Map()));
  rig.bypassCache = true;
  for (const f of frames) recordFrame(prof, rig, f);
  rig.bypassCache = false;
  assert.equal(prof.evaluated, frames.length);
  assert.equal(rig.snapshots.size, have, '覚えたフレームは捨てない・増やさない');
  assert.equal(valuesOf(rig.evaluate(frames[3], undefined, new Map())), before);
  assert.equal(rig.lastPath, 'cache');
  const s = prof.summary();
  assert.equal(s.hits, frames.length);
  assert.equal(s.evaluated, frames.length);
  // キャッシュの状態: 1 フレームの大きさと、上限ごとに入るフレームの数
  const ci = cacheInfo(rig, rig.clip);
  assert.equal(ci.moving, rig.moving.size);
  assert.equal(ci.frames, frames.length);
  assert.equal(ci.range, frames.length);
  assert.ok(ci.perFrame >= rig.moving.size * 128);
  assert.deepEqual(ci.fits.map(([mb]) => mb), [128, 256, 512, 1024, 2048]);
  assert.ok(ci.fits.every(([, n]) => n === frames.length), '小さいリグなら範囲の全フレームが入る');
});

test('記録していないあいだは何も測らない', () => {
  const prof = new EvalProfiler();
  assert.equal(prof.beginFrame(1), null);
  prof.add('compiled', 3);
  prof.endFrame();
  prof.addRender(2);
  assert.equal(prof.frames.length, 0);
  prof.start();
  prof.beginFrame(1);
  prof.endFrame();
  prof.stop();
  prof.addRender(5);
  assert.equal(prof.frames.length, 1);
  assert.equal(prof.frames[0].parts.render, undefined, '止めたあとの描画は足さない');
  prof.clear();
  assert.equal(prof.frames.length, 0);
  assert.equal(prof.categories.size, 0);
});

test('文字の結果に、フレームの内訳・種類ごと・経路ごと・キャッシュ・ワーカーを出す', () => {
  const d = load('compiled_sample.json');
  const rig = makeRig(d, { limit: 64 * 1024 * 1024 });
  const prof = new EvalProfiler();
  prof.start();
  for (const f of framesOf(rig)) recordFrame(prof, rig, f);
  const text = profilerText(prof, {
    scene: { meshes: 1, vertices: 8, joints: 3, curves: 0 }, clip: rig.clip, rig,
    workers: { available: true, count: 3, cores: 4, frames: 30, perFrame: 2, throughput: 900 },
  });
  for (const want of ['■ フレームの内訳', '■ リグの評価の種類ごと', '■ 評価の経路ごと', '■ 専用の評価の計画', '■ 再生キャッシュ',
    '■ 再生キャッシュを作るワーカー', '■ ノードごと', 'キーで動くノード', '専用の評価', 'ワーカー 3 個（CPU のコア 4）', '上限ごとに入るフレーム数']) {
    assert.ok(text.includes(want), want);
  }
  for (const p of PARTS) assert.ok(text.includes(p.label), p.label);
});

test('ワーカーで作るときも、評価にかかった時間を返す', () => {
  const d = load('compiled_sample.json');
  const baker = createBaker(d.animation, d.nodes);
  const r = bakeFrames(baker, { frames: [1, 2, 3], poses: [] });
  assert.equal(r.frames.length, 3);
  assert.ok(typeof r.ms === 'number' && r.ms >= 0);
});

test('ノードごとの表: 同じ名前のノードは、区別できるところまで DAG のパスを付ける', () => {
  const e = (name, dagPath) => ({ name, dagPath });
  assert.deepEqual(uniqueNames([
    e('base_F', '|chA|face|base_F'), e('base_F', '|chB|face|base_F'), e('neck', '|chA|neck'), e('head', '|chC|head'),
  ]), ['chA|face|base_F', 'chB|face|base_F', 'neck', 'head']);
  // パスでも区別できないとき（同じパス）は、そのまま
  assert.deepEqual(uniqueNames([e('x', '|a|x'), e('x', '|a|x')]), ['a|x', 'a|x']);
  assert.deepEqual(uniqueNames([e('n0', '')]), ['n0']);
});

test('専用の評価の欄に、自作ノードの定義の数と、計算を JavaScript の関数にした数を出す', async () => {
  const { planInfo } = await import('../src/profiler.js');
  const d = load('exprespy_sample.json');
  const rig = makeRig(d);
  rig.evaluate(1); rig.evaluate(2);
  const pi = planInfo(rig);
  assert.equal(pi.defs.total, Object.keys(d.animation.nodeDefs).length);
  assert.equal(pi.defs.compiled, pi.defs.total);
  const text = profilerText(new EvalProfiler(), { rig, clip: rig.clip });
  assert.ok(text.includes(`自作ノードの定義（exprespy など）: ${pi.defs.total} 種類（計算を JavaScript の関数にした ${pi.defs.total}）`), text);
});

test('自作ノード（exprespy）ごとに、計算と入力の読み込みを分けて記録し、評価の結果は変わらない', () => {
  const d = load('exprespy_sample.json');
  const plain = makeRig(d), rec = makeRig(d);
  const prof = new EvalProfiler();
  prof.start();
  for (const f of framesOf(plain)) {
    assert.equal(valuesOf(recordFrame(prof, rec, f)), valuesOf(plain.evaluate(f, undefined, new Map())), `フレーム ${f}`);
  }
  const defs = d.animation.graph.filter((g) => g.def);
  const rows = prof.rows('def');
  assert.ok(rows.length > 0 && rows.length <= defs.length, `${rows.length} 個`);
  for (const r of rows) {
    assert.ok(defs.some((g) => g.name === r.label), r.label);
    assert.ok(r.compute >= 0 && r.read >= 0 && Math.abs(r.ms - (r.compute + r.read)) < 1e-9);
    assert.equal(r.compiled, true, '関数にした定義');
  }
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].ms >= rows[i].ms, '合計の大きい順');
  const t = prof.defTotals();
  assert.equal(t.nodes, prof.perDef.size);
  assert.equal(prof.defStack.length, 0, '入れ子の記録を閉じる');
  const text = profilerText(prof, { rig: rec, clip: rec.clip });
  assert.ok(text.includes('■ 自作ノード（exprespy など）の計算と入力の読み込み'), text);
  assert.ok(text.includes(rows[0].label));
});

test('自作ノードは、1 回の計算の中で同じ入力を 1 回だけ読む（回数をプロファイラに出す）', () => {
  const d = load('exprespy_sample.json');
  const rig = makeRig(d);
  const calls = new Map();
  const orig = rig.defRead.bind(rig);
  // 専用の評価は rig を土台にした読み方（Object.create）から呼ぶので、原型の側を差し替える
  const proto = Object.getPrototypeOf(rig);
  const saved = proto.defRead;
  proto.defRead = function defRead(g, plug, info) {
    const k = `${this.frame}|${g.id}|${plug}`;
    calls.set(k, (calls.get(k) || 0) + 1);
    return saved.call(this, g, plug, info);
  };
  try {
    for (const f of framesOf(rig)) rig.evaluate(f, undefined, new Map());
  } finally { proto.defRead = saved; }
  assert.ok(calls.size > 0);
  assert.ok([...calls.values()].every((n) => n === 1), '同じ入力を 2 回読まない');
  void orig;
  // プロファイラ: 読んだ回数（同じ入力も数える）≥ 異なる入力の数
  const prof = new EvalProfiler();
  prof.start();
  const rec = makeRig(d);
  for (const f of framesOf(rec)) recordFrame(prof, rec, f);
  const rows = prof.rows('def');
  assert.ok(rows.length && rows.every((r) => r.inputs > 0 && r.reads >= r.inputs), JSON.stringify(rows.map((r) => [r.inputs, r.reads])));
  assert.ok(profilerText(prof, { rig: rec, clip: rec.clip }).includes('（読む回数 '));
});

test('行列の更新・表示の内訳と、ドローコール・ポリゴン数を集計する（その他は残り）', () => {
  const prof = new EvalProfiler();
  prof.start();
  for (let f = 1; f <= 4; f++) {
    prof.beginFrame(f);
    prof.sub('matrices', 1); prof.sub('pose', 2); prof.sub('world', 3); prof.sub('overlay', 0.5);
    prof.current.t0 -= 10;                     // この区間に 10 ms かかったことにする（scene = 10 − ほかの区間）
    prof.endFrame();
    prof.addRender(4, { calls: 100 * f, triangles: 1000, lines: 0 });
  }
  const s = prof.summary();
  assert.equal(s.sub.matrices, 1);
  assert.equal(s.sub.pose, 2);
  assert.equal(s.sub.world, 3);
  assert.equal(s.sub.overlay, 0.5);
  assert.ok(s.avg.scene >= 10 && Math.abs(s.sub.other - (s.avg.scene - 6.5)) < 1e-9);
  assert.equal(s.draw.calls, 250);
  assert.equal(s.draw.triangles, 1000);
  const text = profilerText(prof, {});
  assert.ok(text.includes('行列の更新・表示・その他の内訳: 行列のコピー 1.00 ms'), text);
  assert.ok(text.includes('ドローコール 250・ポリゴン数（三角形） 1000'), text);
});
