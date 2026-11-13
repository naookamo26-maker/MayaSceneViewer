// Maya の正解と比べる道具（tools/verify.mjs）の確認（Maya なし）。
// 正解をビューアの評価から作ると差 0、わざとずらしたノード・表示は検出されること。
// 前提: python tools/make_rig_sample.py・python tools/make_vis_camera_sample.py（samples/ の JSON）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { compare, formatReport, makeTruth, matrixDiff, viewerFrame, makeViewer } from '../tools/verify.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

test('ビューアの評価から作った正解とは差 0', () => {
  const scene = load('rig_sample.json');
  const truth = makeTruth(scene, range(1, 48));
  const res = compare(scene, truth);
  assert.equal(res.compared, scene.nodes.length);
  assert.equal(res.frames, 48);
  assert.equal(res.over.any, 0);
  assert.equal(res.visibleMismatch, 0);
  assert.deepEqual(res.missing, []);
  for (const r of res.rows) { assert.ok(r.pos < 1e-9, r.path); assert.ok(r.rot < 1e-6, r.path); }
});

test('1 ノードの位置・回転をずらすと検出される（差の大きい順の先頭・フレーム）', () => {
  const scene = load('rig_sample.json');
  const truth = makeTruth(scene, range(1, 48));
  const target = '|shoulder|elbow';
  const e = truth.nodes[target];
  const k = e.frames.indexOf(20);
  const m = new Matrix4().fromArray(e.world[k]);
  m.multiply(new Matrix4().makeRotationZ((0.5 * Math.PI) / 180)).setPosition(m.elements[12] + 0.01, m.elements[13], m.elements[14]);
  e.world[k] = Array.from(m.elements);
  const res = compare(scene, truth);
  assert.equal(res.over.any, 1);
  assert.equal(res.rows[0].path, target);
  assert.equal(res.rows[0].frame, 20);
  assert.ok(Math.abs(res.rows[0].rot - 0.5) < 1e-6, String(res.rows[0].rot));
  assert.ok(Math.abs(res.rows[0].pos - 0.01) < 1e-9, String(res.rows[0].pos));
  assert.match(formatReport(res), /\|shoulder\|elbow \| 0\.01000 \| 0\.5000/);
});

test('表示の食い違い・ビューアにないノード', () => {
  const scene = load('vis_camera_sample.json');
  const v = makeViewer(scene);
  const frames = range(Math.ceil(v.clip.start), v.clip.end);
  const truth = makeTruth(scene, frames);
  const path0 = scene.nodes[0].path;
  truth.nodes[path0].shown = truth.nodes[path0].shown.map((x, i) => (i === 0 ? !x : x));
  truth.nodes['|onlyInMaya'] = { frames: [frames[0]], world: [Array.from(new Matrix4().elements)] };
  const res = compare(scene, truth);
  assert.equal(res.visibleMismatch, 1);
  assert.deepEqual(res.missing, ['|onlyInMaya']);
  assert.equal(res.rows.find((r) => r.path === path0).shown, 1);
});

test('リグで変わる表示を評価する（props の .v）', () => {
  const scene = load('vis_camera_sample.json');
  const v = makeViewer(scene);
  const nodeProps = v.rig.props.filter((p) => p.kind === 'node');
  assert.ok(nodeProps.length > 0);
  const seen = new Set();
  for (let f = Math.ceil(v.clip.start); f <= v.clip.end; f++) seen.add(viewerFrame(v, f).self[nodeProps[0].index]);
  assert.equal(seen.size, 2, 'フレームによって表示が変わる');
});

test('matrixDiff: 同じ行列は 0、スケールの差', () => {
  const a = new Matrix4().makeRotationY(1).setPosition(1, 2, 3);
  assert.deepEqual(matrixDiff(a, a.clone()), { pos: 0, rot: 0, scl: 0 });
  const d = matrixDiff(a, a.clone().scale({ x: 2, y: 1, z: 1 }));
  assert.ok(Math.abs(d.scl - 1) < 1e-12);
});
