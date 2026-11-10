// Qt 版からの分割の転送（transfer.js）: 大きな数値の配列を JSON から抜き出して別に送ったものを、元の配列に戻せるか
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TransferBuffer, resolveBlobs } from '../src/transfer.js';
import { decodeArray, isPacked } from '../src/arrays.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => readFileSync(path.resolve(here, '../../samples', name), 'utf8');

/** schema.split_blobs と同じ: pack_array の形の配列を { dtype, count, blob } にして、base64 を一覧に抜き出す */
function split(obj, blobs, minChars) {
  if (Array.isArray(obj)) return obj.map((v) => (v && typeof v === 'object' ? split(v, blobs, minChars) : v));
  if (!obj || typeof obj !== 'object') return obj;
  if (isPacked(obj) && obj.data.length >= minChars) {
    blobs.push(obj.data);
    const { data, ...rest } = obj;
    return { ...rest, blob: blobs.length - 1 };
  }
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = v && typeof v === 'object' ? split(v, blobs, minChars) : v;
  return out;
}

/** viewer.py の _transfer と同じ順に送る（配列はかけら（4 の倍数の長さ）ごと → JSON の骨組み） */
function send(text, chunk, minChars) {
  const blobs = [];
  const skeleton = JSON.stringify(split(JSON.parse(text), blobs, minChars));
  const tr = new TransferBuffer(skeleton.length + blobs.reduce((a, b) => a + b.length, 0));
  for (const b of blobs) {
    for (let i = 0; i < b.length; i += chunk) tr.appendBlob(b.slice(i, i + chunk));
    tr.endBlob();
  }
  for (let i = 0; i < skeleton.length; i += chunk) tr.append(skeleton.slice(i, i + chunk));
  assert.equal(tr.fraction, 1);
  return { ...tr.finish(), count: blobs.length };
}

/** 元の JSON の配列と、受け取ったものの配列が同じか（pack_array の形はその型の配列に戻して比べる） */
function same(a, b, at = '') {
  if (isPacked(a)) {
    assert.ok(ArrayBuffer.isView(b) || isPacked(b), `${at}: 配列`);
    assert.deepEqual(Array.from(decodeArray(b)), Array.from(decodeArray(a)), at);
    assert.equal((ArrayBuffer.isView(b) ? b : decodeArray(b)).constructor, decodeArray(a).constructor, `${at}: 型`);
    return;
  }
  if (Array.isArray(a)) { assert.equal(b.length, a.length, at); a.forEach((x, i) => same(x, b[i], `${at}[${i}]`)); return; }
  if (a && typeof a === 'object') { assert.deepEqual(Object.keys(b).sort(), Object.keys(a).sort(), at); for (const k of Object.keys(a)) same(a[k], b[k], `${at}.${k}`); return; }
  // テストの中で骨組みを JSON.stringify で作るので -0 は 0 になる（Python の json.dumps は -0.0 のまま）
  if (typeof a === 'number' && a === 0) assert.ok(b === 0, at);
  else assert.equal(b, a, at);
}

test('シーン・アニメーションの配列を抜き出して送っても、元と同じ値に戻る（かけらの区切り・配列の大きさを変えて）', () => {
  for (const name of ['shared_skin_sample.json', 'batch_sample.json', 'camaim_sample.json']) {
    const text = load(name);
    const orig = JSON.parse(text);
    for (const [chunk, minChars] of [[4, 0], [1024, 16], [4 * 1024 * 1024, 64]]) {
      const got = send(text, chunk, minChars);
      assert.ok(got.count > 0, `${name}: 抜き出した配列がある`);
      assert.equal(got.text, null, '配列を抜き出したら、文字列は渡さない');
      same(orig, got.obj, name);
    }
  }
});

test('配列を抜き出さなければ、受け取った JSON の文字列も返す（再生キャッシュのワーカーに渡す）', () => {
  const tr = new TransferBuffer();
  tr.append('{"a":');
  tr.append('[1,2]}');
  assert.equal(tr.fraction, -1);
  const r = tr.finish();
  assert.deepEqual(r.obj, { a: [1, 2] });
  assert.equal(r.text, '{"a":[1,2]}');
});

test('壊れた転送は理由つきの誤りにする（長さの違い・ない配列・知らない型）', () => {
  const bytes = new Uint8Array(new Float32Array([1, 2, 3]).buffer);
  assert.throws(() => resolveBlobs({ x: { dtype: 'float32', count: 4, blob: 0 } }, [bytes]), /長さが違います/);
  assert.throws(() => resolveBlobs({ x: { dtype: 'float32', count: 3, blob: 1 } }, [bytes]), /ありません/);
  assert.throws(() => resolveBlobs({ x: { dtype: 'float16', count: 3, blob: 0 } }, [bytes]), /対応していない/);
  const ok = resolveBlobs({ x: [{ dtype: 'float32', count: 3, blob: 0 }] }, [bytes]);
  assert.deepEqual(Array.from(ok.x[0]), [1, 2, 3]);
});
