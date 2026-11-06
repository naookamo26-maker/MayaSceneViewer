// シーンのパッケージ（.msv。ma_viewer/package.py が書き出す zip）の読み込み。
//   * zip の目次（セントラルディレクトリ）を読み、必要な項目だけをメモリの上で展開する（ファイルは作らない）
//   * 展開はブラウザ標準の DecompressionStream('deflate-raw')（Chromium 103 以降。Qt 6.5 以降の WebEngine も同じ）
//   * scene.json の数値の配列 {dtype, count, buffer, offset} は、bin の該当部分を型付き配列にして置き換える
//     （配列ごとに独立したバッファにする。Worker に送るとき、大きなバッファ全体を複製しないように）
//   * テクスチャは read(name) で必要になったときに展開する

export const PACKAGE_EXT = /\.msv$/i;
const FORMAT_NAME = 'maya-scene-viewer-package';
const FORMAT_VERSION = 1;
const TYPES = { float32: Float32Array, int32: Int32Array, uint16: Uint16Array, uint8: Uint8Array };

/** zip の目次: 名前 → { method, compSize, size, dataStart } */
export function readZipDirectory(buffer) {
  const u8 = new Uint8Array(buffer);
  const dv = new DataView(buffer instanceof ArrayBuffer ? buffer : u8.buffer, u8.byteOffset, u8.byteLength);
  // 終端レコード（End of Central Directory）を後ろから探す（コメントは最大 65535 バイト）
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 22 - 65535); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('zip として読めません（壊れているか、.msv ではありません）');
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  if (count === 0xffff || p === 0xffffffff) throw new Error('4 GB を超えるパッケージ（ZIP64）には対応していません');
  const dec = new TextDecoder();
  const entries = new Map();
  for (let k = 0; k < count; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error('zip の目次が壊れています');
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const size = dv.getUint32(p + 24, true);
    const nameLen = dv.getUint16(p + 28, true), extraLen = dv.getUint16(p + 30, true), commentLen = dv.getUint16(p + 32, true);
    const local = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nameLen));
    // 中身の位置は、各項目の前のローカルヘッダの大きさ（名前・拡張の長さは目次と違うことがある）で決まる
    if (dv.getUint32(local, true) !== 0x04034b50) throw new Error(`zip の項目が壊れています: ${name}`);
    const dataStart = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
    entries.set(name, { method, compSize, size, dataStart });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') throw new Error('このブラウザは展開（DecompressionStream）に対応していません');
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** 開いた .msv */
export class ScenePackage {
  constructor(buffer) {
    this.bytes = new Uint8Array(buffer);
    this.entries = readZipDirectory(buffer);
  }

  has(name) { return this.entries.has(name); }

  /** 項目を展開して Uint8Array で返す */
  async read(name) {
    const e = this.entries.get(name);
    if (!e) throw new Error(`パッケージに ${name} がありません`);
    const raw = this.bytes.subarray(e.dataStart, e.dataStart + e.compSize);
    if (e.method === 0) return raw.slice();
    if (e.method === 8) return inflateRaw(raw);
    throw new Error(`対応していない圧縮方式です（${e.method}）: ${name}`);
  }

  async readJson(name) {
    return JSON.parse(new TextDecoder().decode(await this.read(name)));
  }

  /** シーン（共通 JSON）。数値の配列は型付き配列にする */
  async scene() {
    const manifest = this.has('manifest.json') ? await this.readJson('manifest.json') : {};
    if (manifest.format && manifest.format !== FORMAT_NAME) throw new Error(`対応していないパッケージです（format: ${manifest.format}）`);
    if ((manifest.version || 1) > FORMAT_VERSION) {
      throw new Error(`新しい版のビューアで作られたパッケージです（version ${manifest.version}）。ビューアを更新してください`);
    }
    if (!this.has('scene.json')) throw new Error('シーンのパッケージ（.msv）ではありません（scene.json がありません）');
    const data = await this.readJson('scene.json');
    const buffers = new Map();
    const refs = [];
    collectRefs(data, refs);
    for (const r of refs) if (!buffers.has(r.ref.buffer)) buffers.set(r.ref.buffer, await this.read(r.ref.buffer));
    for (const r of refs) r.set(toTyped(r.ref, buffers.get(r.ref.buffer)));
    this.manifest = manifest;
    return data;
  }
}

function isRef(x) {
  return x && typeof x === 'object' && !Array.isArray(x) && typeof x.buffer === 'string' && 'dtype' in x && 'count' in x && !('data' in x);
}

/** 配列の参照と、置き換える関数を集める */
function collectRefs(obj, out) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const v = obj[i];
      if (v && typeof v === 'object') {
        if (isRef(v)) out.push({ ref: v, set: (a) => { obj[i] = a; } });
        else collectRefs(v, out);
      }
    }
  } else if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v && typeof v === 'object') {
        if (isRef(v)) out.push({ ref: v, set: (a) => { obj[k] = a; } });
        else collectRefs(v, out);
      }
    }
  }
}

function toTyped(ref, bin) {
  const T = TYPES[ref.dtype];
  if (!T) throw new Error(`対応していない配列の型です: ${ref.dtype}`);
  const start = ref.offset || 0, len = ref.count * T.BYTES_PER_ELEMENT;
  if (start + len > bin.length) throw new Error('パッケージの数値のデータが足りません（壊れている可能性があります）');
  return new T(bin.slice(start, start + len).buffer);
}

/** ArrayBuffer（.msv の中身）→ { scene, pkg } */
export async function openPackage(buffer) {
  const pkg = new ScenePackage(buffer);
  const scene = await pkg.scene();
  return { scene, pkg };
}
