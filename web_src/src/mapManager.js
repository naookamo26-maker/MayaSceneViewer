// マップ（テクスチャ）の読み込みと管理。
//   * 表示設定から必要なマップだけを読み込む（ラフネスなどは有効にしたときに初めて読む）
//   * 同じ画像は 1 回だけ読み、用途ごとのテクスチャ（sRGB・リニア・チャンネル抽出）を使い回す
//   * UDIM はタイルごとに管理する
import { loadImage, makeTexture } from './textures.js';

/** マップの種類と用途 → makeTexture の usage */
export function usageFor(kind, channel, view) {
  const ch = !channel || channel === 'rgb' ? (kind === 'baseColor' || kind === 'emissive' || kind === 'normal' ? 'rgb' : 'r') : channel;
  if (view) return ch === 'rgb' ? 'view:rgb' : 'view:' + ch;
  if (kind === 'baseColor' || kind === 'emissive') return ch === 'rgb' ? 'color' : 'scalar:' + ch;
  if (kind === 'normal') return 'normal';
  return 'scalar:' + ch;
}

/** 表示設定 → 読み込む必要のあるマップの種類 */
export function neededKinds(st) {
  if (!st.textures) return [];
  if (st.mapView && st.mapView !== 'combined') return [st.mapView];
  const out = ['baseColor'];
  for (const k of ['normal', 'roughness', 'metalness', 'ao', 'emissive', 'opacity']) if (st.maps && st.maps[k]) out.push(k);
  return out;
}

export class MapManager {
  constructor() {
    this.state = new Map();     // key → { status, ti, tile, info, decoded, via, textures: Map, message }
    this.token = 0;
    this.data = null;
  }

  reset(data) {
    for (const s of this.state.values()) for (const t of s.textures.values()) t.dispose();
    this.state.clear();
    this.token++;
    this.data = data;
  }

  /** キー → 読み込み元（UDIM ならそのタイルのファイル） */
  source(key) {
    const [tiStr, tileStr] = String(key).split(':');
    const ti = +tiStr, tile = tileStr ? +tileStr : 0;
    const info = (this.data && this.data.textures || [])[ti];
    if (!info) return null;
    if (info.udim) {
      const t = (info.tiles || []).find((x) => x.tile === tile);
      return { ti, tile, info, url: t ? t.url : null, resolved: t ? t.resolved : null, format: info.format };
    }
    return { ti, tile, info, url: info.url, resolved: info.resolved, format: info.format };
  }

  /** 設定に必要なマップのキー */
  neededKeys(materials, st) {
    const kinds = neededKinds(st);
    const keys = new Set();
    for (const m of materials) {
      for (const kind of kinds) {
        const mp = m.userData.maps[kind];
        if (mp) keys.add(mp.key);
      }
    }
    return keys;
  }

  /**
   * 足りないマップを読み込む。読み込みが 1 枚終わるたびに onProgress(done, total) を呼ぶ。
   * @returns 読み込みを始めた枚数
   */
  ensure(keys, readViaBridge, opts, onProgress, onError) {
    const token = this.token;
    const jobs = [];
    for (const key of keys) {
      if (this.state.has(key)) continue;
      const src = this.source(key);
      if (!src || !src.resolved || !src.format) {
        this.state.set(key, { status: 'missing', ...src, textures: new Map() });
        continue;
      }
      const s = { status: 'loading', ...src, textures: new Map() };
      this.state.set(key, s);
      jobs.push([key, s]);
    }
    let done = 0;
    for (const [key, s] of jobs) {
      loadImage(s.url, s.resolved, s.format, readViaBridge, opts).then((r) => {
        if (token !== this.token) return;
        s.status = 'ok';
        s.decoded = r.decoded;
        s.via = r.via;
      }).catch((err) => {
        if (token !== this.token) return;
        s.status = 'error';
        s.message = String(err && err.message || err);
        if (onError) onError(key, s);
      }).finally(() => {
        if (token !== this.token) return;
        done++;
        if (onProgress) onProgress(done, jobs.length);
      });
    }
    return jobs.length;
  }

  /** 読み込み済みならテクスチャ（用途ごとに 1 回だけ作る） */
  texture(key, usage) {
    const s = this.state.get(key);
    if (!s || s.status !== 'ok') return null;
    let t = s.textures.get(usage);
    if (!t) {
      t = makeTexture(s.decoded, usage);
      s.textures.set(usage, t);
    }
    return t;
  }

  hasAlpha(key) {
    const s = this.state.get(key);
    return !!(s && s.status === 'ok' && s.decoded.hasAlpha);
  }

  /** テクスチャ番号ごとの状態（UDIM はタイルをまとめる）: ok / loading / error / missing / pending（未読み込み） */
  textureStatus(ti) {
    const info = (this.data && this.data.textures || [])[ti];
    if (!info) return { status: 'missing' };
    const keys = info.udim ? (info.tiles || []).map((t) => `${ti}:${t.tile}`) : [String(ti)];
    if (!keys.length) return { status: 'missing', info };
    const list = keys.map((k) => this.state.get(k));
    if (list.some((s) => s && s.status === 'loading')) return { status: 'loading', info };
    if (list.some((s) => s && s.status === 'error')) {
      return { status: 'error', info, message: list.find((s) => s && s.status === 'error').message };
    }
    if (list.some((s) => s && s.status === 'missing')) return { status: 'missing', info };
    if (list.every((s) => s && s.status === 'ok')) {
      const d = list[0].decoded;
      return {
        status: 'ok', info, via: list[0].via, tiles: keys.length, width: d.width, height: d.height,
        sourceWidth: d.sourceWidth, sourceHeight: d.sourceHeight, hasAlpha: list.some((s) => s.decoded.hasAlpha),
      };
    }
    return { status: 'pending', info };
  }
}
