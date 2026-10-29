// アニメーションカーブの評価が、Autodesk animX（Maya と同じ評価をする公開ライブラリ）と同じになることの検証。
// animX を書き写した参照実装（animxReference.mjs）と、ランダムに作ったカーブで値を比べる。
// 対象: オート・オートミックス・オートイーズの接線、固定の接線（重みなし・重み付き。重みが区間より長いものを含む）、
// フラット・リニア・ステップ・ステップ（次）、範囲外（一定・リニア・繰り返し・オフセット付き繰り返し・往復）。
// スプライン・クランプ・プラトーは animX にない（Maya の計算が公開されていない）ので対象外。
import test from 'node:test';
import assert from 'node:assert/strict';
import { TANGENT, INFINITY, prepareCurve, evaluateCurve } from '../src/animation.js';
import { TT, INF, prepare, evaluate } from './animxReference.mjs';

const FPS = 24;
const TO_ANIMX = {
  [TANGENT.FIXED]: TT.Fixed, [TANGENT.LINEAR]: TT.Linear, [TANGENT.FLAT]: TT.Flat, [TANGENT.STEP]: TT.Step,
  [TANGENT.STEP_NEXT]: TT.StepNext, [TANGENT.AUTO]: TT.Auto, [TANGENT.AUTO_MIX]: TT.AutoMix, [TANGENT.AUTO_EASE]: TT.AutoEase,
};
const INF_TO_ANIMX = {
  [INFINITY.CONSTANT]: INF.Constant, [INFINITY.LINEAR]: INF.Linear, [INFINITY.CYCLE]: INF.Cycle,
  [INFINITY.CYCLE_RELATIVE]: INF.CycleRelative, [INFINITY.OSCILLATE]: INF.Oscillate,
};

/** 再現できる乱数（xorshift） */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/**
 * カーブの組（ビューア用・参照用）を作る。keys: [{ t（フレーム）, v, tin, tout, fixIn: [x, y], fixOut: [x, y] }]
 * 固定の接線の x はフレーム、y は値の単位
 */
function build(keys, { weighted = false, pre = 0, post = 0 } = {}) {
  const n = keys.length;
  const times = Float64Array.from(keys.map((k) => k.t));
  const values = Float64Array.from(keys.map((k) => k.v));
  const types = new Uint8Array(2 * n);
  const fixedOf = new Map();
  keys.forEach((k, i) => {
    types[2 * i] = k.tin;
    types[2 * i + 1] = k.tout;
    if (k.fixIn || k.fixOut) fixedOf.set(i, [...(k.fixIn || [NaN, NaN]), ...(k.fixOut || [NaN, NaN])]);
  });
  const viewer = prepareCurve({ name: 'c', type: 'TU', offset: 0, count: n, tangent: 0, weighted, pre, post },
    times, values, types, fixedOf);
  // 参照用（秒）。オート系は animX が計算し直す。それ以外は Maya と同じ向きの接線を与える
  const span = (i, side) => {
    if (side === 'in') return i > 0 ? keys[i].t - keys[i - 1].t : (i < n - 1 ? keys[i + 1].t - keys[i].t : 1);
    return i < n - 1 ? keys[i + 1].t - keys[i].t : (i > 0 ? keys[i].t - keys[i - 1].t : 1);
  };
  const tangent = (k, i, side) => {
    const type = side === 'in' ? k.tin : k.tout;
    const fix = side === 'in' ? k.fixIn : k.fixOut;
    if (type === TANGENT.FIXED) return { type: TT.Fixed, x: fix[0] / FPS, y: fix[1] };
    if (type === TANGENT.LINEAR) {
      const [a, b] = side === 'in' ? (i > 0 ? [i - 1, i] : [i, i + 1]) : (i < n - 1 ? [i, i + 1] : [i - 1, i]);
      return { type: TT.Linear, x: (keys[b].t - keys[a].t) / FPS, y: keys[b].v - keys[a].v };
    }
    return { type: TO_ANIMX[type], x: span(i, side) / FPS, y: 0 };
  };
  const reference = prepare({
    weighted, pre: INF_TO_ANIMX[pre], post: INF_TO_ANIMX[post],
    keys: keys.map((k, i) => ({ time: k.t / FPS, value: k.v, tanIn: tangent(k, i, 'in'), tanOut: tangent(k, i, 'out') })),
  });
  return { viewer, reference };
}

/** 範囲の外（前後 2.5 周）まで、キーの時刻と細かい刻みで比べる */
function compare(pair, label) {
  const { viewer, reference } = pair;
  const t0 = viewer.t[0], t1 = viewer.t[viewer.n - 1];
  const period = Math.max(t1 - t0, 1);
  const times = [...viewer.t];
  for (let x = t0 - 2.5 * period; x <= t1 + 2.5 * period; x += period / 97) times.push(x);
  let worst = 0, at = null;
  for (const f of times) {
    const a = evaluateCurve(viewer, f), b = evaluate(f / FPS, reference);
    const err = Math.abs(a - b) / Math.max(1, Math.abs(b));
    if (err > worst) { worst = err; at = { f, viewer: a, animx: b }; }
  }
  // 範囲外の繰り返しでは、Maya（animX）は時刻を 1/141120000 秒の刻みに丸めるので、ごくわずかに違う
  assert.ok(worst < 1e-5, `${label}: 最大の差 ${worst.toExponential(2)}（${JSON.stringify(at)}）`);
}

const AUTO_TYPES = [TANGENT.AUTO, TANGENT.AUTO_MIX, TANGENT.AUTO_EASE];
const INFS = [INFINITY.CONSTANT, INFINITY.LINEAR, INFINITY.CYCLE, INFINITY.CYCLE_RELATIVE, INFINITY.OSCILLATE];

function randomKeys(r, n, typesOf) {
  const keys = [];
  let t = Math.round(r() * 20) - 10;
  let v = (r() - 0.5) * 20;
  for (let i = 0; i < n; i++) {
    const shape = r();
    if (i > 0) {
      t += r() < 0.15 ? 0.25 + r() : 1 + Math.round(r() * 15);                  // 間隔の短いキーも混ぜる
      if (shape < 0.15) { /* 同じ値（平ら） */ } else if (shape < 0.5) v += (r() - 0.3) * 10;   // 単調に近い
      else v = (r() - 0.5) * 20;
    }
    const [tin, tout] = typesOf(r, i);
    const k = { t, v, tin, tout };
    // 固定の接線: 傾きはいろいろ、重み付きのときの長さは区間の 0.1〜4 倍（3 倍を超えると区間からはみ出す）
    const fix = () => [(0.1 + r() * 4) * (1 + r() * 10), (r() - 0.5) * 30];
    if (tin === TANGENT.FIXED) k.fixIn = fix();
    if (tout === TANGENT.FIXED) k.fixOut = fix();
    keys.push(k);
  }
  return keys;
}

test('オート・オートミックス・オートイーズの接線が animX と同じ（重みなし・重み付き、範囲外も）', () => {
  const r = rng(1);
  for (let c = 0; c < 400; c++) {
    const type = AUTO_TYPES[c % 3];
    const keys = randomKeys(r, 2 + Math.floor(r() * 7), () => [type, type]);
    const opts = { weighted: r() < 0.5, pre: INFS[Math.floor(r() * 5)], post: INFS[Math.floor(r() * 5)] };
    compare(build(keys, opts), `カーブ ${c}（種類 ${type}・${JSON.stringify(opts)}）`);
  }
});

test('接線の種類が混ざったカーブ（固定・フラット・ステップ・オート系）が animX と同じ', () => {
  const r = rng(2);
  const pick = (r2) => {
    const x = r2();
    if (x < 0.25) return [TANGENT.FIXED, TANGENT.FIXED];
    if (x < 0.35) return [TANGENT.FLAT, TANGENT.FLAT];
    if (x < 0.42) return [TANGENT.FLAT, TANGENT.STEP];
    if (x < 0.48) return [TANGENT.FLAT, TANGENT.STEP_NEXT];
    if (x < 0.6) return [TANGENT.FIXED, AUTO_TYPES[Math.floor(r2() * 3)]];        // 入りと出で種類が違う
    const a = AUTO_TYPES[Math.floor(r2() * 3)];
    return [a, a];
  };
  for (let c = 0; c < 600; c++) {
    const keys = randomKeys(r, 2 + Math.floor(r() * 7), pick);
    const opts = { weighted: r() < 0.5, pre: INFS[Math.floor(r() * 5)], post: INFS[Math.floor(r() * 5)] };
    compare(build(keys, opts), `カーブ ${c}（${JSON.stringify(opts)}）`);
  }
});

test('重み付きの接線が区間より長いときの直し方が animX と同じ（時刻が逆戻りしないように詰める）', () => {
  // 出の接線の長さが区間の 3 倍を超える（制御点が次のキーより後ろになる）
  for (const [wo, wi] of [[40, 3], [36, 1], [50, 20], [100, 100], [31, 29], [12, 45]]) {
    const keys = [
      { t: 0, v: 0, tin: TANGENT.FIXED, tout: TANGENT.FIXED, fixIn: [10, 0], fixOut: [wo, wo * 0.8] },
      { t: 10, v: 5, tin: TANGENT.FIXED, tout: TANGENT.FIXED, fixIn: [wi, -wi * 0.3], fixOut: [10, 0] },
    ];
    compare(build(keys, { weighted: true }), `長さ ${wo}・${wi}`);
  }
});

test('すべてリニアのカーブ（範囲外のリニアは端の線分の傾きで伸ばす）が animX と同じ', () => {
  const r = rng(3);
  for (let c = 0; c < 100; c++) {
    const keys = randomKeys(r, 2 + Math.floor(r() * 6), () => [TANGENT.LINEAR, TANGENT.LINEAR]);
    const opts = { weighted: r() < 0.5, pre: INFS[Math.floor(r() * 5)], post: INFS[Math.floor(r() * 5)] };
    compare(build(keys, opts), `カーブ ${c}（${JSON.stringify(opts)}）`);
  }
});

test('オートミックス・オートイーズは従来のオートと違う（キーの間隔が不均等なとき）', () => {
  // 両隣の傾きの 3 倍で抑えられない値にする（抑えられると、どれも同じ傾きになる）
  const keys = (type) => [0, 2, 12].map((t, i) => ({ t, v: [0, 4, 14][i], tin: type, tout: type }));
  const at = (type) => evaluateCurve(build(keys(type)).viewer, 1);
  const auto = at(TANGENT.AUTO), mix = at(TANGENT.AUTO_MIX), ease = at(TANGENT.AUTO_EASE);
  assert.ok(Math.abs(auto - mix) > 1e-3 && Math.abs(auto - ease) > 1e-3 && Math.abs(mix - ease) > 1e-3, `${auto} ${mix} ${ease}`);
  // オートカスタム（21）はオートイーズと同じに扱う
  assert.equal(at(TANGENT.AUTO_CUSTOM), ease);
});
