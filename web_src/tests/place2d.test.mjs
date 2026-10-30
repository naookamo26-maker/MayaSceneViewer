// place2dTexture（テクスチャの UV の繰り返し・オフセット）: 静的な値と、リグ・キー・exprespy で動く値の反映
// 前提: python tools/make_place2d_sample.py（samples/textured_project/scenes/place2d_sample.ma を作る）。
// テストのたびに .ma から共通 JSON を書き出す（テクスチャのパスが環境ごとに違うため）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { MapManager } from '../src/mapManager.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const jsonPath = path.join(tmpdir(), 'maya_viewer_place2d_test.json');
execFileSync('python3', ['-m', 'ma_viewer', 'export', '-q',
  path.join(root, 'samples', 'textured_project', 'scenes', 'place2d_sample.ma'), '-o', jsonPath], { cwd: root });
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const FRAMES = [1, 7, 12, 24];
const tx = (f) => (f - 1) / 23;
const ty = (f) => 2 * (f - 1) / 23;
const texIndex = (node) => { const i = data.textures.findIndex((t) => t.node === node); assert.ok(i >= 0, node); return i; };

function propsAt(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  const props = rig.evaluateProps();
  assert.deepEqual([...rig.problems], []);
  return props;
}

/** 読み込み済みの画像（1 画素）を入れた MapManager */
function manager() {
  const m = new MapManager();
  m.reset(data);
  const decoded = { kind: 'data', image: { data: new Uint8Array(4), width: 1, height: 1 }, width: 1, height: 1, hasAlpha: false };
  data.textures.forEach((info, ti) => m.state.set(String(ti), { status: 'ok', ti, tile: 0, info, decoded, textures: new Map() }));
  return m;
}

/** フレーム f の props をテクスチャに入れて、テクスチャ番号 ti の (repeat, offset) を返す */
function uvAt(f, node) {
  const m = manager();
  const ti = texIndex(node);
  const t = m.texture(String(ti), 'color');
  for (const p of propsAt(f)) if (p.kind === 'place2d') m.setPlace2d(p.index, p.values);
  return { repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y] };
}

const same = (got, want, label) => {
  for (const k of ['repeat', 'offset']) {
    for (let i = 0; i < 2; i++) assert.ok(near(got[k][i], want[k][i]), `${label}: ${k} ${got[k]} / ${want[k]}`);
  }
};

test('静的な値: repeatUV と offset をテクスチャの repeat・offset に入れる', () => {
  const m = manager();
  const t = m.texture(String(texIndex('f1')), 'color');
  same({ repeat: [t.repeat.x, t.repeat.y], offset: [t.offset.x, t.offset.y] }, { repeat: [2, 3], offset: [0.25, 0.5] }, 'f1');
});

test('ジョイントで動かす: 長い名前（offsetU）の接続と、計算ノード経由の ofv・ファイルの値の repeatV', () => {
  for (const f of FRAMES) same(uvAt(f, 'f2'), { repeat: [1, 2], offset: [tx(f), ty(f) / 2] }, `フレーム ${f}`);
});

test('exprespy で 2 つ組の offset をまとめて動かす', () => {
  for (const f of FRAMES) same(uvAt(f, 'f3'), { repeat: [1, 1], offset: [tx(f) / 2, tx(f)] }, `フレーム ${f}`);
});

test('キー（animCurveTU）で repeatU を動かす', () => {
  for (const f of FRAMES) same(uvAt(f, 'f4'), { repeat: [1 + 3 * tx(f), 1], offset: [0, 0] }, `フレーム ${f}`);
});

test('反映しない属性（rotateUV）は警告し、offset は反映する', () => {
  assert.ok(data.warnings.some((w) => w.includes('place2dTexture p5 の rotateUV は反映しません')), data.warnings.join('\n'));
  same(uvAt(1, 'f5'), { repeat: [1, 1], offset: [0.1, 0] }, 'f5');
});

test('値が変わらなければ setPlace2d は false を返し、あとから作るテクスチャにもいまの値が入る', () => {
  const m = manager();
  const p = propsAt(24).find((x) => x.kind === 'place2d' && x.index === data.textures[texIndex('f2')].uv.place2d);
  assert.equal(m.setPlace2d(p.index, p.values), true);
  assert.equal(m.setPlace2d(p.index, p.values), false);
  const t = m.texture(String(texIndex('f2')), 'scalar:r');           // 値を入れたあとに作るテクスチャ
  assert.ok(near(t.offset.x, 1) && near(t.offset.y, 1) && near(t.repeat.y, 2));
});
