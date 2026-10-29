// カーブエディタ（見るだけ）の、DOM に依存しない部分の検証: 選んだノードのカーブの集め方・表示範囲・目盛り
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip, TANGENT, evaluateCurve } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import {
  channelColor, channelLabel, collectChannels, curveAxis, frameAll, niceStep, normalizer, viewAxis,
} from '../src/curveEditor.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));
function setup(name) {
  const data = load(name);
  const clip = new AnimationClip(data.animation);
  const rig = new RigEvaluator(clip, data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  const idx = (n) => data.nodes.findIndex((x) => x.name === n);
  return { data, clip, rig, idx };
}

test('選んだノードのキー（移動・回転・スケール）を、tx・ty・…の順に集める', () => {
  const { clip, rig, idx } = setup('anim_sample.json');
  const ch = collectChannels(clip, rig, idx('shoulder'));
  assert.deepEqual(ch.map((c) => c.attr), ['rz', 'sx']);
  assert.deepEqual(ch.map((c) => c.label), ['回転 Z', 'スケール X']);
  assert.equal(ch[0].color, '#5b9be5');                        // Z は青、X は赤
  assert.equal(ch[1].color, '#e5675b');
  assert.equal(curveAxis(ch[0].curve), 'time');
  assert.deepEqual(collectChannels(clip, rig, -1), []);
  assert.deepEqual(collectChannels(null, rig, 0), []);
});

test('ドリブンキー（グラフのノードのカーブ）も集め、ドライバーの先はたどらない', () => {
  const { clip, rig, idx } = setup('rig6_sample.json');
  const ch = collectChannels(clip, rig, idx('roll_jnt'));
  assert.deepEqual(ch.map((c) => c.attr), ['ty', 'rz']);
  assert.ok(ch.every((c) => curveAxis(c.curve) === 'driver'));
  assert.ok(ch[0].label.endsWith('（ドリブンキー）'));
  assert.equal(viewAxis(ch), 'driver');
  ch[1].visible = false;
  assert.equal(viewAxis(ch), 'driver');
});

test('表示範囲: 横はキーと再生範囲、縦は値（接線の行き過ぎも含む）に余白。正規化は -1〜1', () => {
  const { clip, rig, idx } = setup('anim_sample.json');
  const ch = collectChannels(clip, rig, idx('shoulder'));
  const v = frameAll(ch, clip.start, clip.end);
  assert.ok(v.x0 < 1 && v.x1 > 24);
  let hi = -Infinity;
  for (let f = 1; f <= 24; f += 0.25) hi = Math.max(hi, evaluateCurve(ch[0].curve, f));
  assert.ok(v.y1 > hi && v.y0 < 0, `${JSON.stringify(v)} ${hi}`);
  const n = frameAll(ch, clip.start, clip.end, true);
  assert.ok(n.y0 < -1 && n.y0 > -1.5 && n.y1 > 1 && n.y1 < 1.5);
  const norm = normalizer(ch[0].curve, 1, 24);
  assert.ok(Math.abs(norm.map(hi) - 1) < 1e-3 && Math.abs(norm.map(0) + 1) < 1e-3);
  // 隠したカーブは範囲に入れない・カーブがなければ再生範囲
  assert.deepEqual(frameAll([], 1, 24).x0 < 1, true);
});

test('目盛りの間隔は 1・2・5 × 10 の累乗', () => {
  assert.equal(niceStep(24, 5), 5);
  assert.equal(niceStep(100, 10), 10);
  assert.equal(niceStep(0.8, 4), 0.2);
  assert.equal(niceStep(0.9, 4), 0.5);
  assert.equal(niceStep(0, 4), 1);
});

test('チャンネルの名前と色', () => {
  assert.equal(channelLabel('ty'), '移動 Y');
  assert.equal(channelLabel('v'), '表示');
  assert.equal(channelLabel('rx', 'unitConversion1'), '回転 X ← unitConversion1');
  assert.equal(channelLabel('myAttr'), 'myAttr');
  assert.equal(channelColor('rpx', 0), '#e5675b');
  assert.notEqual(channelColor('myAttr', 0), channelColor('myAttr', 1));
});

test('カーブはキーごとの接線の種類（.ma の値）を持つ', () => {
  const { clip } = setup('anim_sample.json');
  for (const c of clip.curves) {
    assert.equal(c.tinType.length, c.n);
    assert.ok([...c.tinType, ...c.toutType].every((k) => Object.values(TANGENT).includes(k)), c.name);
  }
});
