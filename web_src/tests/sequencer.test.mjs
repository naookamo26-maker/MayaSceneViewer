// カメラシーケンサ（ショットの選び方・シーケンスとシーンのフレームの対応）の検証
// 前提: python tools/make_sequencer_sample.py（samples/sequencer_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { activeShot, shotTime } from '../src/sequencer.js';

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

test('重なるショットはトラックの番号が大きい方、ミュートしたショットは使わない', () => {
  assert.deepEqual(at(5), ['SH015', 'ortho_cam', 1]);
  assert.deepEqual(at(8), ['SH015', 'ortho_cam', 4]);
  assert.deepEqual(at(9), ['SH010', 'shot_cam', 9]);
  assert.equal(at(16)[0], 'SH020');                       // SH099（ミュート）は無視
});

test('scale と preHold: 長さが scale 倍になり、preHold の間は最初のフレームで止まる', () => {
  assert.deepEqual(at(26), ['SH030', 'shot_cam', 20]);
  assert.deepEqual(at(28), ['SH030', 'shot_cam', 20]);
  assert.deepEqual(at(30), ['SH030', 'shot_cam', 21]);
  assert.deepEqual(at(36), ['SH030', 'shot_cam', 24]);
});

test('ショットのないフレーム', () => {
  assert.equal(at(38), null);
  assert.equal(at(0), null);
});
