// テイクだけのファイル（.msva）を書く（ブラウザ・Node.js の両方で動く）。形は ma_viewer/package.py の write_takes と同じ:
//   manifest.json（format: maya-scene-viewer-takes）・takes.json（数値の配列は bin/takes.bin を指す）・bin/takes.bin
// 数値の配列は詰め直さず（encoding: none）そのまま並べ、zip の圧縮は deflate（CompressionStream('deflate-raw')。
// 使えない環境では無圧縮）にする。読むのは package.js の openTakes・Python の read_takes。
import { decodeArray } from './animation.js';
import { encodeTake } from './takes.js';

// ビルド時に埋め込むバージョン（Node で直接動かしたときは呼び出し側が opts.version で渡す）
const BUILT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0-dev';

const TYPED = { times: ['float32', Float32Array], values: ['float32', Float32Array], tangentTypes: ['uint8', Uint8Array],
  fixedTangents: ['float32', Float32Array] };

let crcTable = null;
function crc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function deflateRaw(bytes) {
  if (typeof CompressionStream !== 'function') return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (err) {
    return null;
  }
}

/** 日時 → zip の日付・時刻（DOS 形式） */
function dosTime(d) {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/**
 * zip を作る（ZIP64 なし）。entries: [{ name, data: Uint8Array }]。圧縮できない環境では無圧縮で入れる
 * @returns Uint8Array
 */
export async function writeZip(entries, now = new Date()) {
  const enc = new TextEncoder();
  const { time, date } = dosTime(now);
  const parts = [];
  const central = [];
  let offset = 0;
  for (const e of entries) {
    const name = enc.encode(e.name);
    const crc = crc32(e.data);
    const comp = await deflateRaw(e.data);
    const method = comp && comp.length < e.data.length ? 8 : 0;
    const body = method === 8 ? comp : e.data;
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true);            // 名前は UTF-8
    local.setUint16(8, method, true);
    local.setUint16(10, time, true);
    local.setUint16(12, date, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, body.length, true);
    local.setUint32(22, e.data.length, true);
    local.setUint16(26, name.length, true);
    local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), name, body);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint16(10, method, true);
    c.setUint16(12, time, true);
    c.setUint16(14, date, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, body.length, true);
    c.setUint32(24, e.data.length, true);
    c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + body.length;
  }
  const cdSize = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of all) { out.set(p, o); o += p.length; }
  return out;
}

/**
 * テイクの一覧を .msva の中身（Uint8Array）にする。テイクの数値の配列は、型付き配列・base64・数値のリストのどれでもよい
 */
export async function buildTakesFile(takes, opts = {}) {
  const now = opts.now || new Date();
  const chunks = [];
  let pos = 0;
  const out = takes.map((raw) => {
    const t = { ...encodeTake(raw) };
    for (const [k, [dtype, C]] of Object.entries(TYPED)) {
      const a = decodeArray(raw[k], C);
      const pad = (4 - (pos % 4)) % 4;
      if (pad) { chunks.push(new Uint8Array(pad)); pos += pad; }
      const bytes = new Uint8Array(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength));
      t[k] = { dtype, count: a.length, buffer: 'bin/takes.bin', offset: pos, encoding: 'none' };
      chunks.push(bytes);
      pos += bytes.length;
    }
    return t;
  });
  const bin = new Uint8Array(pos);
  let o = 0;
  for (const c of chunks) { bin.set(c, o); o += c.length; }
  const enc = new TextEncoder();
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
  const manifest = { format: 'maya-scene-viewer-takes', version: 1, created: iso, generator: 'MayaSceneViewer', generatorVersion: opts.version || BUILT_VERSION };
  return writeZip([
    { name: 'manifest.json', data: enc.encode(JSON.stringify(manifest, null, 1)) },
    { name: 'takes.json', data: enc.encode(JSON.stringify({ takes: out })) },
    { name: 'bin/takes.bin', data: bin },
  ], now);
}
