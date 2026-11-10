// Python（Qt 版）から分割して届くデータの受け取り（viewer.py の set_scene・set_animation）。
//
// 大きな数値の配列（base64 のバイナリ）は JSON から抜き出して別に届く（schema.split_blobs）。届いたかけらは、その場で
// バイト列に戻して持つ（ブラウザの文字列には約 5.3 億文字の上限があり、850MB のシーンを 1 つの文字列につなげられない）。
// 最後に届く JSON の骨組みでは、抜き出した配列が { dtype, count, blob: 番号 } になっているので、型付き配列に置き換える。
import { base64ToBytes } from './arrays.js';

const TYPES = { float32: Float32Array, int32: Int32Array, uint16: Uint16Array, uint8: Uint8Array };

export class TransferBuffer {
  constructor(total = 0) {
    this.total = total;          // 届く文字数の合計（進み具合。分からなければ 0）
    this.received = 0;
    this.text = [];              // JSON の骨組みのかけら
    this.parts = [];             // いま受け取っている配列のバイト列のかけら
    this.blobs = [];             // 番号 → バイト列（Uint8Array）
  }

  /** JSON の骨組みのかけら */
  append(text) {
    this.text.push(text);
    this.received += text.length;
  }

  /** 抜き出した配列のかけら（base64。最後のかけら以外は 4 文字の倍数の長さ） */
  appendBlob(b64) {
    this.parts.push(base64ToBytes(b64));
    this.received += b64.length;
  }

  /** 配列 1 つを受け取り終えた（番号は届いた順） */
  endBlob() {
    const parts = this.parts;
    this.parts = [];
    let out;
    if (parts.length === 1) out = parts[0];
    else {
      out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0));
      let off = 0;
      for (const p of parts) { out.set(p, off); off += p.length; }
    }
    this.blobs.push(out);
    return this.blobs.length - 1;
  }

  /** 進み具合（0〜1。合計が分からなければ -1） */
  get fraction() {
    return this.total > 0 ? Math.min(1, this.received / this.total) : -1;
  }

  /** JSON の骨組みを読み、抜き出した配列を型付き配列に置き換えたもの */
  finish() {
    const text = this.text.join('');
    this.text = [];
    const obj = JSON.parse(text);
    const had = this.blobs.length > 0;
    if (had) resolveBlobs(obj, this.blobs);
    this.blobs = [];
    // text: 配列を抜き出していなければ、受け取った JSON の文字列（再生キャッシュのワーカーにそのまま渡せる）
    return { obj, text: had ? null : text };
  }
}

function isBlobRef(x) {
  return x && typeof x === 'object' && !Array.isArray(x) && typeof x.blob === 'number' && typeof x.dtype === 'string' && !('data' in x);
}

/** 抜き出した配列の参照 { dtype, count, blob } を、型付き配列に置き換える（その場で書き換える） */
export function resolveBlobs(obj, blobs) {
  const toTyped = (ref) => {
    const T = TYPES[ref.dtype];
    if (!T) throw new Error(`対応していない配列の型です: ${ref.dtype}`);
    const bytes = blobs[ref.blob];
    if (!bytes) throw new Error(`転送された配列（${ref.blob} 番）がありません`);
    const count = Math.floor(bytes.length / T.BYTES_PER_ELEMENT);
    if (typeof ref.count === 'number' && ref.count !== count) throw new Error(`転送された配列（${ref.blob} 番）の長さが違います（${count} / ${ref.count}）`);
    return bytes.byteOffset % T.BYTES_PER_ELEMENT === 0 ? new T(bytes.buffer, bytes.byteOffset, count) : new T(bytes.slice().buffer, 0, count);
  };
  const stack = [obj];
  while (stack.length) {
    const o = stack.pop();
    const keys = Array.isArray(o) ? o.keys() : Object.keys(o);
    for (const k of keys) {
      const v = o[k];
      if (!v || typeof v !== 'object' || ArrayBuffer.isView(v)) continue;
      if (isBlobRef(v)) o[k] = toTyped(v);
      else stack.push(v);
    }
  }
  return obj;
}
