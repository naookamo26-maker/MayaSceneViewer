// キャラクターセットの Trax のクリップ（共通 JSON の graph の character の trax）の評価。
//
// クリップ 1 つ: シーンのフレーム start から、ソースの範囲 sourceStart〜sourceEnd を scale 倍の長さで再生する。
// preCycle / postCycle の回数だけ前後にくり返し、そのあと hold フレームのあいだ最後の値を保つ。weight を掛ける。
// 同じフレームで複数のクリップが有効なときは、あとから始まるクリップ（同じならトラックの番号が大きい方）を使う。
// どのクリップの範囲でもないときは、直前のクリップの最後の値（最初のクリップより前は、最初のクリップの最初の値）。
import { evaluateCurve } from './animation.js';

/** クリップの時間の範囲（シーンのフレーム） */
export function clipRange(clip, curves) {
  let ss = clip.sourceStart, se = clip.sourceEnd;
  if (!(Number.isFinite(ss) && Number.isFinite(se))) {
    // ソースの範囲がなければ、カーブのキーの範囲
    let lo = Infinity, hi = -Infinity;
    for (const ci of Object.values(clip.channels || {})) {
      const c = curves[ci];
      if (!c || !c.n) continue;
      lo = Math.min(lo, c.t[0]);
      hi = Math.max(hi, c.t[c.n - 1]);
    }
    if (!Number.isFinite(ss)) ss = Number.isFinite(lo) ? lo : 0;
    if (!Number.isFinite(se)) se = Number.isFinite(hi) ? hi : ss;
  }
  const scale = Math.abs(clip.scale) > 1e-9 ? Math.abs(clip.scale) : 1;
  const len = Math.max(se - ss, 0);
  const cycle = len * scale;                                        // 1 回分の長さ（シーンのフレーム）
  const start = clip.start || 0;
  const begin = start - Math.max(clip.preCycle || 0, 0) * cycle;
  const playEnd = start + (1 + Math.max(clip.postCycle || 0, 0)) * cycle;
  return { ss, se, len, scale, start, begin, playEnd, end: playEnd + Math.max(clip.hold || 0, 0) };
}

/** シーンのフレーム f での、クリップの中の時間（ソースの時間） */
export function clipSourceTime(r, f) {
  if (r.len <= 0) return r.ss;
  if (f >= r.playEnd) return r.se;                                  // 最後まで再生した（hold の間も最後の値）
  if (f <= r.begin) return r.ss;
  const u = (f - r.start) / r.scale;
  const local = ((u % r.len) + r.len) % r.len;
  return r.ss + local;
}

/**
 * フレーム f の、キャラクターの出力の値 { "lv[3]": 値, ... }。
 * @param curves animation.curves を評価できる形にしたもの（AnimationClip.curves）
 * @param convert (カーブ, 値) => 値  単位の変換（角度をラジアンにするなど。省略時はカーブの値のまま）
 */
export function evaluateTrax(trax, f, curves, convert = (c, v) => v) {
  const clips = (trax.clips || []).filter((c) => (c.enable ?? 1) >= 0.5)
    .map((c) => ({ clip: c, r: clipRange(c, curves) }));
  if (!clips.length) return {};
  const active = clips.filter(({ r }) => f >= r.begin && f <= r.end);
  let pick, time;
  if (active.length) {
    active.sort((a, b) => (a.r.start - b.r.start) || ((a.clip.track || 0) - (b.clip.track || 0)) || (a.clip.order - b.clip.order));
    pick = active[active.length - 1];
    time = clipSourceTime(pick.r, f);
  } else {
    const before = clips.filter(({ r }) => r.end < f).sort((a, b) => a.r.end - b.r.end);
    if (before.length) { pick = before[before.length - 1]; time = pick.r.se; } else {
      pick = clips.slice().sort((a, b) => a.r.begin - b.r.begin)[0];
      time = pick.r.ss;
    }
  }
  const w = pick.clip.weight ?? 1;
  const out = {};
  for (const [plug, ci] of Object.entries(pick.clip.channels || {})) {
    const c = curves[ci];
    if (c) out[plug] = convert(c, evaluateCurve(c, time)) * w;
  }
  return out;
}

/** 下部のパネルなどで並びを見せるための、クリップの範囲の一覧 */
export function traxSummary(trax, curves) {
  return (trax.clips || []).map((c) => ({ name: c.name, track: c.track || 0, enable: (c.enable ?? 1) >= 0.5, ...clipRange(c, curves) }));
}
