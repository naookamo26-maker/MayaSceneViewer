// パッケージ（.msv）の読み込み: zip の目次・展開・数値の配列の復元・同梱のテクスチャ
// 前提: python -m ma_viewer pack samples/sample_arm.ma -o samples/sample_arm.msv
//       samples/textured_sample.msv は textured_sample.ma を --textures all で、表示の状態（view.json）付きで書き出したもの
//       （tests/test_package.py の make_textured_sample で作り直せる）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { openPackage, readZipDirectory } from '../src/package.js';
import { decodeArray } from '../src/arrays.js';
import { buildScene } from '../src/sceneBuilder.js';
import { imageInfo } from '../src/textures.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const samples = path.resolve(here, '../../samples');
const load = (name) => { const b = readFileSync(path.join(samples, name)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };

test('.msv の数値の配列は、同じシーンの JSON（base64）と同じ値になる', async () => {
  const { scene } = await openPackage(load('sample_arm.msv'));
  const json = JSON.parse(readFileSync(path.join(samples, 'sample_arm.json'), 'utf8'));
  assert.equal(scene.meshes.length, json.meshes.length);
  scene.meshes.forEach((m, i) => {
    for (const k of ['positions', 'counts', 'indices']) {
      assert.ok(ArrayBuffer.isView(m[k]), `${k} は型付き配列`);
      // samples の JSON は小数を丸めて保存している（.msv は .ma の float32 のまま）
      const want = Array.from(decodeArray(json.meshes[i][k]));
      assert.equal(m[k].length, want.length, `${m.name}.${k}`);
      m[k].forEach((v, n) => assert.ok(Math.abs(v - want[n]) < 1e-5, `${m.name}.${k}[${n}] ${v} != ${want[n]}`));
    }
    if (m.skin) {
      const want = Array.from(decodeArray(json.meshes[i].skin.weights));
      m.skin.weights.forEach((v, n) => assert.ok(Math.abs(v - want[n]) < 1e-5, `weights[${n}]`));
    }
  });
  // 配列ごとに独立したバッファ（Worker に送るときに全体を複製しない）
  assert.equal(scene.meshes[0].positions.buffer.byteLength, scene.meshes[0].positions.byteLength);
  const built = buildScene(scene);
  assert.equal(built.meshes.length, json.meshes.length);
});

test('同梱のテクスチャは WebP で、目次から読める。見つからないテクスチャは理由つき', async () => {
  const buf = load('textured_sample.msv');
  const dir = readZipDirectory(buf);
  assert.ok(dir.has('scene.json') && dir.has('bin/data.bin'));
  const { scene, pkg } = await openPackage(buf);
  const packed = scene.textures.filter((t) => t.packed);
  assert.ok(packed.length >= 5);
  for (const t of packed) {
    assert.equal(t.format, 'webp');
    assert.equal(t.resolved, null);
    const info = imageInfo((await pkg.read(t.packed)).buffer);
    assert.ok(info && info.width > 0 && info.height > 0, t.packed);
  }
  const udim = scene.textures.find((t) => t.udim);
  assert.deepEqual(udim.tiles.map((x) => x.packed), ['textures/8.1001.webp', 'textures/8.1002.webp']);
  const missing = scene.textures.find((t) => t.node === 'missing_file');
  assert.equal(missing.packed, null);
  assert.equal(missing.omitted, 'missing');
  // アルファを使う葉のテクスチャは、アルファ付きの WebP（VP8X のアルファの印）
  const leaf = scene.textures.find((t) => t.node === 'leaf_file');
  assert.equal(imageInfo((await pkg.read(leaf.packed)).buffer).opaque, false);
  buildScene(scene);
});

test('view.json（書き出したときの表示の状態）は scene.savedView に入る', async () => {
  const { scene } = await openPackage(load('textured_sample.msv'));
  assert.equal(scene.savedView.version, 1);
  assert.equal(scene.savedView.camera.mode, 'free');
  assert.deepEqual(scene.savedView.visibility.hidden, ['|plain_geo']);
  // view.json のないパッケージでは入らない
  const { scene: arm } = await openPackage(load('sample_arm.msv'));
  assert.equal(arm.savedView, undefined);
});

test('zip でないもの・壊れたものは分かりやすい誤りにする', async () => {
  await assert.rejects(openPackage(new TextEncoder().encode('{"schema":1}').buffer), /zip として読めません/);
});

test('WebP の先頭から大きさとアルファの有無を読む', () => {
  // VP8（非可逆・アルファなし）: フレームの見出しの後に 14 bit の幅・高さ
  const vp8 = new Uint8Array(30);
  vp8.set([...'RIFF'].map((c) => c.charCodeAt(0)), 0); vp8.set([...'WEBPVP8 '].map((c) => c.charCodeAt(0)), 8);
  vp8.set([0x9d, 0x01, 0x2a, 0x00, 0x08, 0x00, 0x04], 23);     // 幅 2048・高さ 1024
  assert.deepEqual(imageInfo(vp8.buffer), { width: 2048, height: 1024, opaque: true });
  // VP8X（拡張）: アルファの印と、24 bit の幅−1・高さ−1
  const x = new Uint8Array(30);
  x.set([...'RIFF'].map((c) => c.charCodeAt(0)), 0); x.set([...'WEBPVP8X'].map((c) => c.charCodeAt(0)), 8);
  x[20] = 0x10; x.set([255, 1, 0, 127, 0, 0], 24);              // 幅 512・高さ 128
  assert.deepEqual(imageInfo(x.buffer), { width: 512, height: 128, opaque: false });
});
