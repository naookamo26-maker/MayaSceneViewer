// 再生キャッシュを別の評価器（Web Worker）で作る: ワーカーで作って取り込んだものが、画面のスレッドで作るものと同じか
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { bakeFrames, createBaker, decodeBaked } from '../src/rigBakeCore.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '../../samples');
const files = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('expected') && !f.includes('_defs'))
  .filter((f) => { const d = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); return d.animation && (d.animation.graph || []).length; });

function mainRig(data) {
  const statics = data.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  return new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => statics[ni]);
}

/** フレーム f の値（行列・props・カーブの形）を比べられる形にする */
function snapshotOf(rig, f, poseOf, poseKey) {
  const mats = rig.evaluate(f, poseOf, new Map(), poseKey);
  const r = (x) => (Math.abs(x) < 1e-12 ? 0 : +x.toPrecision(11));
  return JSON.stringify({
    mats: [...mats].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, m.elements.map(r)]),
    props: (rig.props.length ? rig.evaluateProps() : []).map((p) => [p.kind, p.index, Object.entries(p.values)]),
    curves: rig.curveIds().map((g) => { const c = rig.curveShape(g); return c && c.cvs ? c.cvs.map((p) => [r(p.x), r(p.y), r(p.z)]) : c; }),
  });
}

/** ワーカーと同じ処理（postMessage の代わりに structuredClone）で作って取り込む */
function bakeInWorker(rig, data, frames, chunk = 5) {
  const baker = createBaker(JSON.stringify(data.animation), structuredClone(data.nodes));
  const pose = rig.playbackPoseData();
  let n = 0;
  for (let i = 0; i < frames.length; i += chunk) {
    const msg = structuredClone(bakeFrames(baker, { frames: frames.slice(i, i + chunk), poses: pose.poses }));
    const r = decodeBaked(msg);
    n += rig.importSnapshots(pose.keys, r.frames, r.deps, r.poseReads);
  }
  return n;
}

const framesOf = (rig) => { const out = []; for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) out.push(f); return out; };

test('ワーカーで作った再生キャッシュは、画面のスレッドで作るものと同じ値を返す（追加分なし）', () => {
  assert.ok(files.length >= 10, `リグのあるサンプル ${files.length} 個`);
  for (const f of files) {
    const data = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    const a = mainRig(data), b = mainRig(data), fresh = mainRig(data);
    fresh.setPlaybackLimit(0);
    a.setPlaybackLimit(1e12); b.setPlaybackLimit(1e12);
    const frames = framesOf(a);
    a.bake(frames);
    const n = bakeInWorker(b, data, frames);
    assert.equal(n, frames.length, `${f}: すべてのフレームを取り込む`);
    for (const fr of frames) assert.ok(b.snapshots.has(fr) && a.snapshots.has(fr), `${f} フレーム ${fr} が再生キャッシュにある`);
    for (const fr of frames) {
      const want = snapshotOf(fresh, fr);
      assert.equal(snapshotOf(b, fr), want, `${f} フレーム ${fr}（取り込んだもの）`);
      assert.equal(snapshotOf(a, fr), want, `${f} フレーム ${fr}（画面のスレッド）`);
    }
  }
});

test('追加分（ポーズ確認）があっても同じ。取り込んだあとに追加分を変えると、影響を受けるノードだけ計算し直して合う', () => {
  let checked = 0;
  for (const f of files) {
    const data = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
    const b = mainRig(data), fresh = mainRig(data);
    fresh.setPlaybackLimit(0);
    b.setPlaybackLimit(1e12);
    const drivers = [...b.directDrivers].filter((ni) => b.sceneNodes[ni].type !== 'joint').slice(0, 2);
    if (!drivers.length) continue;
    const frames = framesOf(b);
    const mk = (deg) => new Map(drivers.map((ni) => [ni, new Matrix4().compose(new Vector3(0.3, 0, 0),
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), deg * Math.PI / 180), new Vector3(1, 1, 1))]));
    const p1 = mk(25), k1 = new Map(drivers.map((ni) => [ni, 'p1']));
    const poseOf1 = (ni) => p1.get(ni) || null;
    b.setPlaybackPose(poseOf1, k1);
    assert.equal(bakeInWorker(b, data, frames), frames.length, f);
    for (const fr of frames) assert.equal(snapshotOf(b, fr, poseOf1, k1), snapshotOf(fresh, fr, poseOf1, k1), `${f} 追加分あり ${fr}`);
    // 1 つ目のノードだけ追加分を変える: 取り込んだフレームから、影響を受けないノードを写して作る（seed）
    const p2 = new Map(p1); p2.set(drivers[0], mk(-40).get(drivers[0]));
    const k2 = new Map(k1); k2.set(drivers[0], 'p2');
    const poseOf2 = (ni) => p2.get(ni) || null;
    for (const fr of frames) assert.equal(snapshotOf(b, fr, poseOf2, k2), snapshotOf(fresh, fr, poseOf2, k2), `${f} 追加分を変えた ${fr}`);
    checked++;
  }
  assert.ok(checked >= 5, `コントローラーのあるサンプル ${checked} 個`);
});

test('上限に達したら途中で止め、動くノードの数が違う結果は入れない', () => {
  const data = JSON.parse(readFileSync(path.join(dir, 'ik_sample.json'), 'utf8'));
  const b = mainRig(data);
  const frames = framesOf(b);
  b.setPlaybackLimit(1e12);
  b.evaluate(frames[0]);
  const one = b.playbackStats().bytes;
  b.clearPlayback();
  b.setPlaybackLimit(one * 5.5);
  const n = bakeInWorker(b, data, frames);
  assert.ok(n >= 4 && n <= 6 && n < frames.length, `上限まで: ${n} / ${frames.length}`);
  const c = mainRig(data);
  c.setPlaybackLimit(1e12);
  const pose = c.playbackPoseData();
  assert.equal(c.importSnapshots(pose.keys, [{ f: 1, mats: new Float64Array(16), props: null, curves: new Map() }]), 0);
});
