// テクスチャの読み込み: ファイルの先頭から大きさとアルファを持てない形式かを読む（imageInfo）
import test from 'node:test';
import assert from 'node:assert/strict';
import { imageInfo } from '../src/textures.js';

/** PNG の先頭（シグネチャ・IHDR と、続くチャンクの見出し）。画素データは読まないので中身は空でよい */
function png(w, h, colorType, chunks = []) {
  const out = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const u32 = (v) => [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
  const chunk = (type, data) => out.push(...u32(data.length), ...[...type].map((c) => c.charCodeAt(0)), ...data, 0, 0, 0, 0);
  chunk('IHDR', [...u32(w), ...u32(h), 8, colorType, 0, 0, 0]);
  for (const [type, data] of chunks) chunk(type, data);
  chunk('IDAT', [1, 2, 3]);
  chunk('IEND', []);
  return new Uint8Array(out).buffer;
}

/** JPEG の先頭（SOI・APP0 か APP1・SOF） */
function jpeg(w, h, { exif = false, sof = 0xc0 } = {}) {
  const app = exif ? [0xff, 0xe1, 0, 8, 0x45, 0x78, 0x69, 0x66, 0, 0] : [0xff, 0xe0, 0, 7, 0x4a, 0x46, 0x49, 0x46, 0];
  return new Uint8Array([0xff, 0xd8, ...app, 0xff, sof, 0, 11, 8, h >> 8, h & 255, w >> 8, w & 255, 1, 1, 0x11, 0, 0xff, 0xd9]).buffer;
}

test('PNG: 大きさと、tRNS のない RGB・グレー・パレットはアルファを持たない', () => {
  assert.deepEqual(imageInfo(png(4096, 2048, 2)), { width: 4096, height: 2048, opaque: true });
  assert.deepEqual(imageInfo(png(7, 9, 0)), { width: 7, height: 9, opaque: true });
  assert.deepEqual(imageInfo(png(16, 8, 3, [['PLTE', [0, 0, 0]]])), { width: 16, height: 8, opaque: true });
  assert.deepEqual(imageInfo(png(16, 8, 3, [['PLTE', [0, 0, 0]], ['tRNS', [0]]])), { width: 16, height: 8, opaque: false });
  assert.deepEqual(imageInfo(png(40, 30, 6)), { width: 40, height: 30, opaque: false });     // RGBA は画素を調べる
  assert.deepEqual(imageInfo(png(40, 30, 4)), { width: 40, height: 30, opaque: false });     // グレー + アルファ
});

test('JPEG: SOF から大きさを読む。EXIF があれば向きで縦横が変わりうるので読まない', () => {
  assert.deepEqual(imageInfo(jpeg(640, 480)), { width: 640, height: 480, opaque: true });
  assert.deepEqual(imageInfo(jpeg(300, 200, { sof: 0xc2 })), { width: 300, height: 200, opaque: true });   // プログレッシブ
  assert.equal(imageInfo(jpeg(64, 32, { exif: true })), null);
});

test('PNG・JPEG 以外と壊れたファイルは null（デコードして調べる）', () => {
  assert.equal(imageInfo(new Uint8Array([0x42, 0x4d, 0, 0, 0, 0]).buffer), null);   // BMP
  assert.equal(imageInfo(new Uint8Array(0).buffer), null);
  assert.equal(imageInfo(png(4, 4, 2).slice(0, 20)), null);
});
