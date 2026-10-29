// アニメーションの評価の検証: node --test tests/
// 前提: python tools/make_anim_sample.py（samples/anim_sample.json と期待値を作る）
import { Euler, Matrix4, Quaternion } from 'three';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { applyPoseSource, buildScene } from '../src/sceneBuilder.js';
import {
  AnimationClip, INFINITY, TANGENT, composeLocalMatrix, decodeArray, evaluateCurve, prepareCurve, worldRotationDegrees, decomposeMaya, composeMaya,
} from '../src/animation.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const samples = path.resolve(here, '../../samples');
const data = JSON.parse(readFileSync(path.join(samples, 'anim_sample.json'), 'utf8'));
const expected = JSON.parse(readFileSync(path.join(samples, 'anim_sample.expected.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);

/** テスト用に 1 本のカーブを作る */
function curve(keys, opts = {}) {
  const times = Float32Array.from(keys.map((k) => k[0]));
  const values = Float32Array.from(keys.map((k) => k[1]));
  const types = new Uint8Array(keys.length * 2);
  keys.forEach((k, i) => { types[2 * i] = k[2] || 0; types[2 * i + 1] = k[3] || 0; });
  const meta = { name: 'c', type: 'TU', offset: 0, count: keys.length, tangent: opts.tangent ?? TANGENT.AUTO,
    weighted: !!opts.weighted, pre: opts.pre || 0, post: opts.post || 0 };
  return prepareCurve(meta, times, values, types, opts.fixed || new Map());
}

const close = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;

test('base64 の配列を読める', () => {
  const t = decodeArray(data.animation.times);
  assert.equal(t.length, data.animation.times.count);
  assert.deepEqual(Array.from(decodeArray([1, 2, 3])), [1, 2, 3]);
  const types = decodeArray(data.animation.tangentTypes, Uint8Array);
  assert.equal(types.length, data.animation.tangentTypes.count);
});

test('リニア・フラット・ステップの補間', () => {
  const lin = curve([[0, 0, TANGENT.LINEAR, TANGENT.LINEAR], [10, 10, TANGENT.LINEAR, TANGENT.LINEAR]]);
  assert.ok(close(evaluateCurve(lin, 2.5), 2.5));
  const flat = curve([[0, 0, TANGENT.FLAT, TANGENT.FLAT], [10, 10, TANGENT.FLAT, TANGENT.FLAT]]);
  assert.ok(close(evaluateCurve(flat, 5), 5));                 // 対称なので中央は半分
  assert.ok(evaluateCurve(flat, 1) < 1);                         // 立ち上がりはゆっくり
  const step = curve([[0, 1, 0, TANGENT.STEP], [10, 5, 0, TANGENT.STEP]]);
  assert.equal(evaluateCurve(step, 9.9), 1);
  assert.equal(evaluateCurve(step, 10), 5);
  const next = curve([[0, 1, 0, TANGENT.STEP_NEXT], [10, 5, 0, TANGENT.STEP_NEXT]]);
  assert.equal(evaluateCurve(next, 0), 1);
  assert.equal(evaluateCurve(next, 0.1), 5);
});

test('オート接線は山で平らになり、キーの値を行き過ぎない', () => {
  const c = curve([[0, 0], [10, 10], [20, 0]]);
  assert.equal(c.inSlope[1], 0);
  assert.equal(c.outSlope[1], 0);
  for (let x = 0; x <= 20; x += 0.5) assert.ok(evaluateCurve(c, x) <= 10 + 1e-9, `x=${x}`);
  // 単調な並びでは行き過ぎない（0 → 10 → 11）
  const m = curve([[0, 0], [10, 10], [20, 11]]);
  for (let x = 10; x <= 20; x += 0.5) assert.ok(evaluateCurve(m, x) <= 11 + 1e-9, `x=${x}`);
  // スプラインは前後の平均の傾き
  const sp = curve([[0, 0], [10, 10], [20, 0]], { tangent: TANGENT.SPLINE });
  assert.equal(sp.outSlope[1], 0);
  const sp2 = curve([[0, 0], [10, 10], [20, 30]], { tangent: TANGENT.SPLINE });
  assert.ok(close(sp2.outSlope[1], 1.5));
});

test('範囲外: 一定・リニア・繰り返し・オフセット付き繰り返し・往復', () => {
  const keys = [[0, 0, TANGENT.LINEAR, TANGENT.LINEAR], [10, 10, TANGENT.LINEAR, TANGENT.LINEAR]];
  assert.equal(evaluateCurve(curve(keys), 15), 10);
  assert.ok(close(evaluateCurve(curve(keys, { post: INFINITY.LINEAR }), 15), 15));
  assert.ok(close(evaluateCurve(curve(keys, { pre: INFINITY.LINEAR }), -5), -5));
  assert.ok(close(evaluateCurve(curve(keys, { post: INFINITY.CYCLE }), 13), 3));
  assert.ok(close(evaluateCurve(curve(keys, { post: INFINITY.CYCLE_RELATIVE }), 13), 13));
  assert.ok(close(evaluateCurve(curve(keys, { post: INFINITY.OSCILLATE }), 13), 7));
  assert.ok(close(evaluateCurve(curve(keys, { pre: INFINITY.CYCLE }), -3), 7));
});

test('重み付きの固定接線: 出の接線を長くすると立ち上がりが遅れる', () => {
  const c = data.animation.curves.findIndex((x) => x.name === 'box_translateX');
  const clip = new AnimationClip(data.animation);
  const cv = clip.curves[c];
  assert.ok(cv.weighted);
  assert.ok(close(cv.outW[0], 36) && close(cv.inW[1], 12), `${cv.outW[0]} ${cv.inW[1]}`);   // 秒 → フレーム（24 fps）
  assert.ok(close(evaluateCurve(cv, 1), 0) && close(evaluateCurve(cv, 25), 10));
  const mid = evaluateCurve(cv, 13);
  assert.ok(mid < 5, `重い出の接線なら中央は半分より小さい: ${mid}`);
  let prev = -1;
  for (let x = 1; x <= 25; x += 0.25) {                      // 単調に増える
    const v = evaluateCurve(cv, x);
    assert.ok(v >= prev - 1e-6, `x=${x}`);
    prev = v;
  }
});

test('ローカル行列の組み立てが Python（mathutil）と一致する', () => {
  const clip = new AnimationClip(data.animation);
  for (const [frame, mats] of Object.entries(expected.frames)) {
    const result = clip.evaluate(+frame);
    for (const [name, m] of Object.entries(mats)) {
      const ni = names.indexOf(name);
      const e = result.get(ni).elements;
      m.forEach((v, k) => assert.ok(close(e[k], v, 1e-4), `frame ${frame} ${name}[${k}] ${e[k]} != ${v}`));
    }
  }
});

test('アニメーションしないノードの材料からも、ファイルと同じ行列ができる', () => {
  // ピボット・シアー・回転順を持つ box（ファイルの値は nodes[].matrix にある）
  const rest = data.animation.nodes.find((n) => names[n.node] === 'box');
  const m = composeLocalMatrix(rest, null).elements;
  const fileMatrix = data.nodes[rest.node].matrix;
  fileMatrix.forEach((v, k) => assert.ok(close(m[k], v, 1e-6), `box[${k}] ${m[k]} != ${v}`));
});

test('再生範囲とキーの時刻', () => {
  const clip = new AnimationClip(data.animation);
  assert.equal(clip.fps, 24);
  assert.equal(clip.start, 1);
  assert.equal(clip.end, 24);
  assert.equal(clip.wrap(25), 1);
  assert.equal(clip.wrap(0), 24);
  const shoulder = names.indexOf('shoulder');
  assert.deepEqual(clip.keyTimes(shoulder), [1, 12, 24]);
  assert.deepEqual(clip.channelsOf(shoulder).sort(), ['rz', 'sx']);
  assert.ok(clip.keyTimes().includes(25));
});

test('バインドポーズの表示はフレームによらない（バインドポーズの情報がないノードは保存時の値）', () => {
  const built = buildScene(data);
  const clip = new AnimationClip(data.animation);
  const ud = (name) => built.nodeObjects[names.indexOf(name)].userData;
  for (const [ni, m] of clip.evaluate(clip.current)) built.nodeObjects[ni].userData.savedMatrix.copy(m);
  for (const [ni, m] of clip.evaluate(12)) built.nodeObjects[ni].userData.fileMatrix.copy(m);   // フレーム 12 に進めた
  const rig = ud('rig_grp'), shoulder = ud('shoulder');
  assert.equal(rig.bindMatrix, null);
  assert.ok(shoulder.bindMatrix);
  applyPoseSource(built, 'bind');
  assert.ok(rig.baseMatrix.equals(rig.savedMatrix), 'バインドポーズの情報がないノードは保存時の値');
  assert.ok(!rig.baseMatrix.equals(rig.fileMatrix), 'フレーム 12 の値ではない');
  assert.ok(shoulder.baseMatrix.equals(shoulder.bindMatrix));
  applyPoseSource(built, 'file');
  assert.ok(rig.baseMatrix.equals(rig.fileMatrix), 'ファイルの値ではフレーム 12 の値');
  assert.ok(shoulder.baseMatrix.equals(shoulder.fileMatrix));
});

test('ワールド回転（xform -q -ws -ro と同じ）: 回転順ごとに、回転の値に戻る。ジョイントの向き・スケールも含めて', () => {
  const orders = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
  orders.forEach((name, ro) => {
    const m = composeLocalMatrix({ t: [1, 2, 3], r: [10, 20, 30], s: [0.5, 2, 1], ro, joint: false }, null);
    worldRotationDegrees(m, name).forEach((v, k) => assert.ok(Math.abs(v - [10, 20, 30][k]) < 1e-9, `${name}: ${v}`));
    worldRotationDegrees(m, ro).forEach((v, k) => assert.ok(Math.abs(v - [10, 20, 30][k]) < 1e-9, `${ro}: ${v}`));
  });
  // ジョイント: 回転 0・ジョイントの向き (0, 0, 45) なら、ワールド回転は (0, 0, 45)
  const j = composeLocalMatrix({ t: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1], jo: [0, 0, 45], ro: 0, joint: true }, null);
  worldRotationDegrees(j, 0).forEach((v, k) => assert.ok(Math.abs(v - [0, 0, 45][k]) < 1e-9, `ジョイント: ${v}`));
});

test('行列の分解（Maya と同じ）: 鏡に映した行列は 3 軸のスケールを負にし、元の行列に戻る', () => {
  const m = composeLocalMatrix({ t: [1, 2, 3], r: [10, 20, 30], s: [2, 3, -4], ro: 0, joint: false }, null);
  const { t, q, s } = decomposeMaya(m);
  assert.deepEqual(t.toArray().map((v) => Math.round(v * 1e9) / 1e9), [1, 2, 3]);
  [-2, -3, -4].forEach((v, k) => assert.ok(Math.abs(s.toArray()[k] - v) < 1e-9, `s ${s.toArray()}`));
  const back = new Matrix4().compose(t, q, s);
  back.elements.forEach((v, k) => assert.ok(Math.abs(v - m.elements[k]) < 1e-9));
  // diag(1, 1, −1) は Z まわりに 180° の回転・スケール (−1, −1, −1)
  const z = decomposeMaya(new Matrix4().makeScale(1, 1, -1));
  assert.deepEqual(z.s.toArray(), [-1, -1, -1]);
  assert.ok(Math.abs(Math.abs(z.q.z) - 1) < 1e-12, `q ${z.q.toArray()}`);
  // 反転のない行列は three.js の decompose と同じ
  const p = composeLocalMatrix({ t: [0, 0, 0], r: [5, 6, 7], s: [1, 2, 3], ro: 0, joint: false }, null);
  decomposeMaya(p).s.toArray().forEach((v, k) => assert.ok(Math.abs(v - [1, 2, 3][k]) < 1e-9));
});

test('行列の分解（Maya と同じ）: せん断のある行列は、せん断を分けてから回転にする（three.js の decompose とは回転が違う）', () => {
  // Maya の transform の式（S · Sh · R · T）で組んだ行列
  const x = { t: [1, -2, 3], r: [25, -40, 70], s: [0.4, 1.5, 2], sh: [0.3, -0.2, 0.5], ro: 0, joint: false };
  const m = composeLocalMatrix(x, null);
  const { t, q, s, sh } = decomposeMaya(m);
  const want = new Quaternion().setFromEuler(new Euler(25 * Math.PI / 180, -40 * Math.PI / 180, 70 * Math.PI / 180, 'ZYX'));
  assert.ok(Math.abs(Math.abs(q.dot(want)) - 1) < 1e-9, '回転');
  [[t, x.t], [s, x.s], [sh, x.sh]].forEach(([got, w]) => got.toArray().forEach((v, k) => assert.ok(Math.abs(v - w[k]) < 1e-9, `${got.toArray()} != ${w}`)));
  // composeMatrix と同じ組み立て（composeMaya）で、元の行列に戻る
  const back = composeMaya(t.toArray(), q, s.toArray(), sh.toArray());
  back.elements.forEach((v, k) => assert.ok(Math.abs(v - m.elements[k]) < 1e-9));
  // three.js の decompose は、せん断があると回転がずれる
  const q3 = new Quaternion();
  m.decompose(new (t.constructor)(), q3, new (t.constructor)());
  assert.ok(Math.abs(Math.abs(q3.dot(want)) - 1) > 1e-4);
});
