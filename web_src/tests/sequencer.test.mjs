// カメラシーケンサ（ショットの選び方・シーケンスとシーンのフレームの対応）の検証
// 前提: python tools/make_sequencer_sample.py（samples/sequencer_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { activeShot, bakeOrder, sequenceCachedRuns, sequenceSceneFrames, shotStarts, shotTime } from '../src/sequencer.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/sequencer_sample.json'), 'utf8'));
const shots = data.sequencer.shots;
const cam = (s) => (s && s.camera >= 0 ? data.cameras[s.camera].name : null);
const at = (f) => { const s = activeShot(shots, f); return s ? [s.shotName, cam(s), shotTime(s, f)] : null; };

test('シーケンスのフレームごとのショット・カメラ・シーンのフレーム', () => {
  assert.deepEqual(at(1), ['SH010', 'shot_cam', 1]);
  assert.deepEqual(at(12), ['SH010', 'shot_cam', 12]);
  assert.deepEqual(at(13), ['SH020', 'ortho_cam', 12]);
  assert.deepEqual(at(25), ['SH020', 'ortho_cam', 24]);
  assert.deepEqual(at(45), ['SH040', 'persp', 6]);        // 起動時のカメラ（persp）のショット
});

test('重なるショットはトラックの番号が小さい（上の段の）方、ミュートしたショットは使わない', () => {
  assert.deepEqual(at(5), ['SH010', 'shot_cam', 5]);      // SH015（トラック 2）より SH010（トラック 1）
  assert.deepEqual(at(8), ['SH010', 'shot_cam', 8]);
  assert.deepEqual(at(38), ['SH035', 'ortho_cam', 2]);    // トラック 1 にショットがなければトラック 2
  assert.equal(at(16)[0], 'SH020');                       // SH099（ミュート）は無視
});

test('scale と preHold: 長さが scale 倍になり、preHold の間は最初のフレームで止まる', () => {
  assert.deepEqual(at(26), ['SH030', 'shot_cam', 20]);
  assert.deepEqual(at(28), ['SH030', 'shot_cam', 20]);
  assert.deepEqual(at(30), ['SH030', 'shot_cam', 21]);
  assert.deepEqual(at(36), ['SH030', 'shot_cam', 24]);
});

test('ショットのないフレーム', () => {
  assert.equal(at(0), null);
});

test('ショット送りは使うショットが変わるフレームに止まる（隠れたショット・ミュートの先頭には止まらない）', () => {
  const starts = shotStarts(shots);
  assert.ok(!starts.includes(5), 'SH015（トラック 2・SH010 に隠れる）の先頭には止まらない');
  assert.deepEqual(starts.map((f) => activeShot(shots, f).shotName), [...new Set(starts.map((f) => activeShot(shots, f).shotName))]);
  assert.deepEqual(starts.slice(0, 3).map((f) => [f, activeShot(shots, f).shotName]), [[1, 'SH010'], [13, 'SH020'], [26, 'SH030']]);
  assert.ok(starts.some((f) => activeShot(shots, f).shotName === 'SH035'), 'トラック 1 が空いて見えるトラック 2 のショットには止まる');
});

// ---------------------------------------------------------------------- 再生キャッシュを作る順番
test('sequenceSceneFrames: シーケンスを途中から再生したときに通るシーンのフレーム（戻って先頭から・重ねない・整数だけ）', () => {
  const shots = [
    { track: 1, sequenceStartFrame: 1, sequenceEndFrame: 4, startFrame: 101, endFrame: 104, scale: 1 },
    { track: 1, sequenceStartFrame: 5, sequenceEndFrame: 8, startFrame: 50, endFrame: 53, scale: 1 },
    { track: 1, sequenceStartFrame: 9, sequenceEndFrame: 12, startFrame: 102, endFrame: 103.5, scale: 2 },   // 半フレームずつ
  ];
  assert.deepEqual(sequenceSceneFrames(shots, 1, 12, 6), [51, 52, 53, 102, 103, 101, 104, 50]);
  assert.deepEqual(sequenceSceneFrames(shots, 1, 12, 1), [101, 102, 103, 104, 50, 51, 52, 53]);
});

test('bakeOrder: いまのフレームから再生範囲の終わり → 先頭から、シーケンスで見ているときはショットの順が先。作ってあるものは除く', () => {
  const sequence = { start: 1, end: 6, shots: [
    { track: 1, sequenceStartFrame: 1, sequenceEndFrame: 3, startFrame: 30, endFrame: 32, scale: 1 },   // 再生範囲の外
    { track: 1, sequenceStartFrame: 4, sequenceEndFrame: 6, startFrame: 4, endFrame: 6, scale: 1 },
  ] };
  const base = { start: 1, end: 8, frame: 5, sequence, seqFrame: 2 };
  assert.deepEqual(bakeOrder({ ...base, follow: false }, () => false), [5, 6, 7, 8, 1, 2, 3, 4, 31, 32, 30]);
  assert.deepEqual(bakeOrder({ ...base, follow: true }, () => false), [31, 32, 4, 5, 6, 30, 7, 8, 1, 2, 3]);
  assert.deepEqual(bakeOrder({ ...base, follow: true }, (f) => f % 2 === 0), [31, 5, 7, 1, 3]);
  assert.deepEqual(bakeOrder({ ...base, sequence: null, follow: true }, () => false), [5, 6, 7, 8, 1, 2, 3, 4]);
});

test('sequenceCachedRuns: シーケンスのフレームのうち、ショットのシーンのフレームがキャッシュにある範囲（整数でないフレームは除く）', () => {
  const shots = [
    { track: 1, sequenceStartFrame: 1, sequenceEndFrame: 4, startFrame: 101, endFrame: 104, scale: 1 },
    { track: 1, sequenceStartFrame: 5, sequenceEndFrame: 8, startFrame: 102, endFrame: 103.5, scale: 2 },   // 半フレームずつ
  ];
  const have = new Set([101, 102, 103, 104]);
  assert.deepEqual(sequenceCachedRuns(shots, 1, 10, (f) => have.has(f)), [[1, 5], [7, 7]]);
  assert.deepEqual(sequenceCachedRuns(shots, 1, 10, () => false), []);
});
