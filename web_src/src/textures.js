// テクスチャの読み込み。
//   1. file:// の URL を直接読む（Qt の WebEngine ではローカルファイルの読み込みを許可している）
//   2. 読めなければ Python（bridge.readFileBase64）から受け取る
// TGA は three.js の TGALoader で画素データにし、PNG・JPEG などはブラウザで ImageBitmap にする。
import {
  DataTexture, LinearFilter, LinearMipmapLinearFilter, NoColorSpace, RGBAFormat, RepeatWrapping, SRGBColorSpace, Texture,
} from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';

export const MAX_TEXTURE_SIZE = 2048;

export function readFileXHR(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      // file:// では status が 0 になる
      if ((xhr.status === 200 || xhr.status === 0) && xhr.response && xhr.response.byteLength) resolve(xhr.response);
      else reject(new Error('読み込めません（status ' + xhr.status + '）'));
    };
    xhr.onerror = () => reject(new Error('読み込めません（アクセスが許可されていない可能性があります）'));
    xhr.send();
  });
}

export function base64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function newCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function scanAlpha(data) {
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) return true;
  return false;
}

/** RGBA の画素データを縮小する（面積平均。アルファで色を掛けないので透明部分の色も保つ） */
export function resizeRGBA(src, w, h, w2, h2) {
  const out = new Uint8Array(w2 * h2 * 4);
  const sx = w / w2, sy = h / h2;
  for (let y = 0; y < h2; y++) {
    const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    for (let x = 0; x < w2; x++) {
      const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
      let r = 0, g = 0, b = 0, a = 0;
      for (let yy = y0; yy < y1; yy++) {
        let i = (yy * w + x0) * 4;
        for (let xx = x0; xx < x1; xx++, i += 4) { r += src[i]; g += src[i + 1]; b += src[i + 2]; a += src[i + 3]; }
      }
      const n = (y1 - y0) * (x1 - x0), o = (y * w2 + x) * 4;
      out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = a / n;
    }
  }
  return out;
}

/**
 * ファイルの先頭から画像の大きさと、アルファを持てない形式か（opaque）を読む（デコードせずに済ませるため）。
 * PNG（IHDR・tRNS）と JPEG（SOF）だけ。読めない・EXIF のある JPEG（向きで縦横が入れ替わりうる）は null
 */
export function imageInfo(buffer) {
  const b = new Uint8Array(buffer);
  const u32 = (o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
  const u16 = (o) => (b[o] << 8) | b[o + 1];
  const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (b.length >= 33 && PNG.every((x, i) => b[i] === x)) {
    if (String.fromCharCode(b[12], b[13], b[14], b[15]) !== 'IHDR') return null;
    const width = u32(16), height = u32(20), colorType = b[25];
    // 色の種類 0（グレー）・2（RGB）・3（パレット）は、tRNS がなければアルファを持たない
    let opaque = colorType === 0 || colorType === 2 || colorType === 3;
    for (let o = 8; opaque && o + 8 <= b.length;) {
      const len = u32(o), type = String.fromCharCode(b[o + 4], b[o + 5], b[o + 6], b[o + 7]);
      if (type === 'tRNS') opaque = false;
      if (type === 'IDAT' || type === 'IEND') break;
      o += 12 + len;
    }
    return width && height ? { width, height, opaque } : null;
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    for (let o = 2; o + 9 < b.length;) {
      if (b[o] !== 0xff) return null;
      const m = b[o + 1];
      if (m === 0xff) { o++; continue; }                       // 詰め物
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { o += 2; continue; }
      const len = u16(o + 2);
      if (m === 0xe1 && String.fromCharCode(b[o + 4], b[o + 5], b[o + 6], b[o + 7]) === 'Exif') return null;
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        const height = u16(o + 5), width = u16(o + 7);
        return width && height ? { width, height, opaque: true } : null;
      }
      o += 2 + len;
    }
  }
  // WebP（.msv に同梱したテクスチャ）: RIFF....WEBP の後の最初のチャンクで大きさとアルファの有無が分かる
  if (b.length >= 30 && String.fromCharCode(b[0], b[1], b[2], b[3]) === 'RIFF'
      && String.fromCharCode(b[8], b[9], b[10], b[11]) === 'WEBP') {
    const kind = String.fromCharCode(b[12], b[13], b[14], b[15]);
    const le24 = (o) => b[o] | (b[o + 1] << 8) | (b[o + 2] << 16);
    if (kind === 'VP8 ') {                                     // 非可逆・アルファなし
      const width = (b[26] | (b[27] << 8)) & 0x3fff, height = (b[28] | (b[29] << 8)) & 0x3fff;
      return width && height ? { width, height, opaque: true } : null;
    }
    if (kind === 'VP8L' && b[20] === 0x2f) {                   // 可逆
      const bits = (b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24)) >>> 0;
      const width = (bits & 0x3fff) + 1, height = ((bits >>> 14) & 0x3fff) + 1;
      return { width, height, opaque: !((bits >>> 28) & 1) };
    }
    if (kind === 'VP8X') {                                     // 拡張（アルファ付きの非可逆など）
      return { width: le24(24) + 1, height: le24(27) + 1, opaque: !(b[20] & 0x10) };
    }
  }
  return null;
}

function fitSize(w, h) {
  const longest = Math.max(w, h);
  if (longest <= MAX_TEXTURE_SIZE) return [w, h];
  const k = MAX_TEXTURE_SIZE / longest;
  return [Math.max(1, Math.round(w * k)), Math.max(1, Math.round(h * k))];
}

/**
 * 画像データ → テクスチャの元データ。長辺が MAX_TEXTURE_SIZE を超える場合は縮小する。
 * 透明な画素の色も保つため、アルファで色を掛けない（premultiply しない）経路で読む。
 * @returns {Promise<{kind:'data'|'bitmap', image, width, height, sourceWidth, sourceHeight, hasAlpha}>}
 *   kind 'data' の image は { data: Uint8Array（上の行から順の RGBA）, width, height }
 */
export async function decodeImage(buffer, format) {
  if (format === 'tga') {
    const img = new TGALoader().parse(buffer);
    if (!img || !img.data || !img.width) throw new Error('TGA を解析できません');
    let data = new Uint8Array(img.data.buffer, img.data.byteOffset, img.width * img.height * 4);
    const [w2, h2] = fitSize(img.width, img.height);
    if (w2 !== img.width) data = resizeRGBA(data, img.width, img.height, w2, h2);
    return { kind: 'data', image: { data, width: w2, height: h2 }, width: w2, height: h2,
      sourceWidth: img.width, sourceHeight: img.height, hasAlpha: scanAlpha(data) };
  }
  const blob = new Blob([buffer]);
  // 大きさはファイルの先頭から読む（読めない形式だけ、大きさを知るために一度デコードする）
  const info = imageInfo(buffer);
  let sourceWidth, sourceHeight;
  if (info) {
    sourceWidth = info.width; sourceHeight = info.height;
  } else {
    const probe = await createImageBitmap(blob);
    sourceWidth = probe.width; sourceHeight = probe.height;
    probe.close && probe.close();
  }
  const [w2, h2] = fitSize(sourceWidth, sourceHeight);
  const opts = { premultiplyAlpha: 'none', colorSpaceConversion: 'none', imageOrientation: 'flipY' };
  if (w2 !== sourceWidth) Object.assign(opts, { resizeWidth: w2, resizeHeight: h2, resizeQuality: 'high' });
  const bmp = await createImageBitmap(blob, opts);
  // 形式上アルファを持てない画像は、画素を読み戻さない
  if (info && info.opaque) {
    return { kind: 'bitmap', image: bmp, width: bmp.width, height: bmp.height, sourceWidth, sourceHeight, hasAlpha: false };
  }
  // アルファの有無だけ調べる（色はテクスチャ側で使う）
  const c = newCanvas(bmp.width, bmp.height);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0);
  const hasAlpha = scanAlpha(ctx.getImageData(0, 0, c.width, c.height).data);
  return { kind: 'bitmap', image: bmp, width: bmp.width, height: bmp.height, sourceWidth, sourceHeight, hasAlpha };
}

/** 画素（上の行から順の RGBA）。ImageBitmap はキャンバスに描いて読む（結果はキャッシュ） */
export function decodedPixels(decoded) {
  if (decoded.kind === 'data') return decoded.image.data;
  if (!decoded.pixels) {
    const c = newCanvas(decoded.width, decoded.height);
    const ctx = c.getContext('2d', { willReadFrequently: true });
    // ImageBitmap は上下を反転して読み込んでいるので、描くときに戻す
    ctx.translate(0, decoded.height);
    ctx.scale(1, -1);
    ctx.drawImage(decoded.image, 0, 0);
    decoded.pixels = ctx.getImageData(0, 0, decoded.width, decoded.height).data;
  }
  return decoded.pixels;
}

/** チャンネル ch（r / g / b / a）を R・G・B に入れたグレースケールの画素 */
export function channelPixels(pixels, ch) {
  const o = { r: 0, g: 1, b: 2, a: 3 }[ch] ?? 0;
  const out = new Uint8Array(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    const v = pixels[i + o];
    out[i] = v; out[i + 1] = v; out[i + 2] = v; out[i + 3] = 255;
  }
  return out;
}

function dataTexture(data, w, h) {
  const t = new DataTexture(data, w, h, RGBAFormat);
  t.flipY = true;                 // 画素は上の行から順
  t.magFilter = LinearFilter;
  t.minFilter = LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

/**
 * 用途に合わせたテクスチャを作る。UV の (0,0) は画像の左下（Maya と同じ）。
 *   'color'     : ベースカラー・エミッシブ（sRGB）
 *   'normal'    : ノーマルマップ（リニア）
 *   'scalar:<c>': ラフネス・メタリック・AO・不透明度（チャンネル c をグレースケールにしたもの。リニア）
 *   'view:rgb' / 'view:<c>': マップの単独表示用（画素の値がそのまま画面に出るよう sRGB として扱う）
 */
export function makeTexture(decoded, usage) {
  const [kind, ch] = usage.split(':');
  let t;
  if (ch && ch !== 'rgb') {
    t = dataTexture(channelPixels(decodedPixels(decoded), ch), decoded.width, decoded.height);
  } else if (decoded.kind === 'data') {
    const { data, width, height } = decoded.image;
    t = dataTexture(data, width, height);
  } else {
    t = new Texture(decoded.image);
    t.flipY = false;                // ImageBitmap は読み込み時に上下を反転済み
  }
  t.premultiplyAlpha = false;
  t.colorSpace = kind === 'color' || kind === 'view' ? SRGBColorSpace : NoColorSpace;
  t.wrapS = RepeatWrapping;
  t.wrapT = RepeatWrapping;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

/** 画像ファイルを読み込んで解析する（テクスチャはまだ作らない） */
export async function loadImage(url, resolved, format, readViaBridge, opts = {}) {
  let buffer = null;
  let via = 'file';
  let firstError = null;
  if (url && !opts.forceBridge) {
    try {
      buffer = await readFileXHR(url);
    } catch (err) {
      firstError = err;
    }
  }
  if (!buffer && readViaBridge && resolved) {
    buffer = await readViaBridge(resolved);
    via = 'python';
  }
  if (!buffer) throw firstError || new Error('読み込む方法がありません');
  return { decoded: await decodeImage(buffer, format), via };
}
