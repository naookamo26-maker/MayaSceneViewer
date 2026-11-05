// 共通 JSON の数値の配列: 数値のリストか、base64 にしたリトルエンディアンのバイナリ { dtype, count, data }。
// Python（schema.pack_array）がバイナリにした配列を、型付き配列に直接戻す。

const TYPES = { float32: Float32Array, int32: Int32Array, uint16: Uint16Array, uint8: Uint8Array };

/** base64 → バイト列（使えればブラウザの組み込みの復元を使う） */
export function base64ToBytes(b64) {
  if (typeof Uint8Array.fromBase64 === 'function') return Uint8Array.fromBase64(b64);
  const bin = atob(b64);
  const n = bin.length;
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** バイナリの配列（{ dtype, count, data }）か */
export function isPacked(x) {
  return !!x && typeof x === 'object' && !Array.isArray(x) && !ArrayBuffer.isView(x) && typeof x.data === 'string' && !!x.dtype;
}

/**
 * 数値の配列を型付き配列にする。
 * @param entry 数値のリスト・型付き配列・{ dtype, count, data }（null なら空）
 * @param Ctor 結果の型（省略時はバイナリならその dtype の型、リストなら Float32Array）
 */
export function decodeArray(entry, Ctor = null) {
  if (entry == null) return new (Ctor || Float32Array)(0);
  if (ArrayBuffer.isView(entry)) return !Ctor || entry instanceof Ctor ? entry : Ctor.from(entry);
  if (Array.isArray(entry)) return (Ctor || Float32Array).from(entry);
  const T = TYPES[entry.dtype];
  if (!T) throw new Error(`対応していない配列の型です: ${entry.dtype}`);
  const bytes = base64ToBytes(entry.data || '');
  const count = Math.floor(bytes.length / T.BYTES_PER_ELEMENT);
  // 型の大きさの倍数の位置から始まる、独立したバッファにする（fromBase64 の結果もそのまま使える）
  const arr = bytes.byteOffset % T.BYTES_PER_ELEMENT === 0 ? new T(bytes.buffer, bytes.byteOffset, count) : new T(bytes.slice().buffer, 0, count);
  return !Ctor || arr instanceof Ctor ? arr : Ctor.from(arr);
}

/** バイナリなら型付き配列にし、リストはそのまま返す（従来の JSON の値はそのまま使う） */
export function unpackArray(x) {
  return isPacked(x) ? decodeArray(x) : x;
}

/**
 * メッシュの数値の配列（positions・counts・indices・hardEdges・uv・skin）のうち、バイナリのものを型付き配列に戻す
 * （その場で書き換える。2 回呼んでもよい）
 */
export function unpackMeshArrays(m) {
  for (const k of ['positions', 'counts', 'indices', 'hardEdges']) if (m[k] != null) m[k] = unpackArray(m[k]);
  if (m.uv) {
    m.uv.values = unpackArray(m.uv.values);
    m.uv.indices = unpackArray(m.uv.indices);
  }
  if (m.skin) for (const k of ['counts', 'indices', 'weights']) m.skin[k] = unpackArray(m.skin[k]);
  return m;
}
