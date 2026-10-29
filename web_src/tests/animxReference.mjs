// テスト用の参照実装: Autodesk animX（Maya と同じアニメーションカーブの評価をする公開ライブラリ）の
// src/animx.cpp・src/internal/interpolators.h・src/internal/Tbezier.h を、そのまま JavaScript に書き写したもの。
//   https://github.com/Autodesk/animx  （Apache License 2.0。Copyright Autodesk, Inc.）
// ビューアの animation.js（速さのために組み立て方を変えている）が、これと同じ値になることを確かめる。
// 時刻は秒。接線は animX と同じく (x: 秒, y: 値の単位)、制御点はキー + 接線 / 3。
// 時間は 64 ビットの精度（MAYA_64BIT_TIME_PRECISION。1 秒 = 141120000 tick）として扱う。

export const TT = {
  Global: 0, Fixed: 1, Linear: 2, Flat: 3, Step: 4, Slow: 5, Fast: 6, Smooth: 7, Clamped: 8, Auto: 9, AutoMix: 10,
  AutoEase: 11, Sine: 12, Parabolic: 13, Log: 14, Plateau: 15, StepNext: 16,
};
export const INF = { Constant: 0, Linear: 1, Cycle: 2, CycleRelative: 3, Oscillate: 4 };

const kDblEpsilon = 1.0e-10;
const kTicksPerSecond = 141120000;
const equivalent = (a, b, eps = kDblEpsilon) => Math.abs(a - b) <= eps;
const isAuto = (t) => t === TT.Auto || t === TT.AutoMix || t === TT.AutoEase;
const SIGN = (x) => (x < 0 ? -1 : 1);
const toTickDoubleTime = (time) => Math.round(time * kTicksPerSecond) / kTicksPerSecond;

/**
 * カーブ: { keys: [{ time, value, tanIn: { type, x, y }, tanOut: { type, x, y } }], weighted, pre, post }。
 * オート系の接線は animX のテストと同じく計算し直す（prepare）
 */
export function prepare(curve) {
  const keys = curve.keys.map((k, i) => ({ ...k, index: i, tanIn: { ...k.tanIn }, tanOut: { ...k.tanOut } }));
  const n = keys.length;
  for (let i = 0; i < n; i++) {
    const k = keys[i];
    const prev = i > 0 ? keys[i - 1] : null, next = i < n - 1 ? keys[i + 1] : null;
    const interp = curve.weighted ? 'bezier' : 'hermite';
    if (isAuto(k.tanIn.type)) Object.assign(k.tanIn, autoTangent(true, k.tanIn.type, k, prev, next, interp));
    if (isAuto(k.tanOut.type)) Object.assign(k.tanOut, autoTangent(false, k.tanOut.type, k, prev, next, interp));
  }
  for (let i = 0; i < n; i++) {
    const k = keys[i];
    k.linearInterpolation = (k.tanOut.type === TT.Linear && i + 1 < n && keys[i + 1].tanIn.type === TT.Linear)
      || (k.tanIn.type === TT.Linear && i > 0 && keys[i - 1].tanOut.type === TT.Linear);
  }
  return { ...curve, keys };
}

function validateTangent(interp, t) {
  if (interp === 'hermite') {
    const len = Math.sqrt(t.x * t.x + t.y * t.y);
    if (len > 0) { t.x /= len; t.y /= len; }
  } else if (t.x < 0) t.x = 0;
  return t;
}

function autoTangentCore(calcIn, x, px, nx, y, py, ny, type) {
  const kEaseCoefficient = -0.5;
  let targetSlope = 0;
  const prevSlope3 = 3 * (y - py) / (x - px);
  const nextSlope3 = 3 * (ny - y) / (nx - x);
  if (type === TT.Auto) targetSlope = (ny - py) / (nx - px);
  else {
    const prevSlope = (y - py) / (x - px);
    const nextSlope = (ny - y) / (nx - x);
    const f = (x - px) / (nx - px);
    if (type === TT.AutoMix) targetSlope = (1 - f) * prevSlope + f * nextSlope;
    else {
      const c = kEaseCoefficient;
      const fm = f - 0.5;
      const g = 0.5 + fm * (1 - c + 4 * c * fm * fm);
      targetSlope = (1 - g) * prevSlope + g * nextSlope;
    }
  }
  if (SIGN(prevSlope3) !== SIGN(nextSlope3) || SIGN(targetSlope) !== SIGN(nextSlope3)) targetSlope = 0;
  else if (nextSlope3 >= 0) targetSlope = Math.min(Math.min(targetSlope, nextSlope3), prevSlope3);
  else targetSlope = Math.max(Math.max(targetSlope, nextSlope3), prevSlope3);
  const tx = calcIn ? x - px : nx - x;
  return { x: tx, y: targetSlope * tx };
}

function flatTangent(calcIn, key, prev, next, interp) {
  let inx = 0, outx = 0;
  if (prev) inx = key.time - prev.time;
  if (next) outx = next.time - key.time;
  if (!prev) inx = outx;
  if (!next) outx = inx;
  return validateTangent(interp, { x: calcIn ? inx : outx, y: 0 });
}

function autoTangent(calcIn, type, key, prev, next, interp) {
  if (!prev || !next) return flatTangent(calcIn, key, prev, next, interp);
  return validateTangent(interp, autoTangentCore(calcIn, key.time, prev.time, next.time, key.value, prev.value, next.value, type));
}

function hermite(startX, startY, x1, y1, x2, y2, endX, endY, time) {
  const dx = endX - startX, dy = endY - startY;
  const tx0 = x1 - startX, ty0 = y1 - startY;
  const tx1 = endX - x2, ty1 = endY - y2;
  const epsilon = 2e-7;
  let c0, c1, c2, c3;
  if (equivalent(dx * ty0, dy * tx0, Math.abs(epsilon * dx * ty0)) && equivalent(dx * ty1, dy * tx1, Math.abs(epsilon * dx * ty1))) {
    c0 = 0; c1 = 0; c2 = dy / dx; c3 = startY;
  } else {
    const m1 = tx0 !== 0 ? ty0 / tx0 : 0;
    const m2 = tx1 !== 0 ? ty1 / tx1 : 0;
    const length = 1 / (dx * dx);
    const d1 = dx * m1, d2 = dx * m2;
    c0 = (d1 + d2 - dy - dy) * length / dx;
    c1 = (dy + dy + dy - d1 - d1 - d2) * length;
    c2 = m1;
    c3 = startY;
  }
  const t = time - startX;
  return t * (t * (t * c0 + c1) + c2) + c3;
}

function constrainInsideBounds(x1, x2) {
  const kFourThirds = 4 / 3, kOneThird = 1 / 3;
  if (x1 + kDblEpsilon < kFourThirds) {
    const b = x1 - 2, c = x1 - 1;
    const discr = Math.sqrt(b * b - 4 * c * c);
    let root = (-b + discr) * 0.5;
    if (x2 + kDblEpsilon > root) x2 = root - kDblEpsilon;
    else {
      root = (-b - discr) * 0.5;
      if (x2 < root + kDblEpsilon) x2 = root + kDblEpsilon;
    }
  } else {
    x1 = kFourThirds - kDblEpsilon;
    x2 = kOneThird - kDblEpsilon;
  }
  return [x1, x2];
}

function checkMonotonic(x1, x2, keepFirst) {
  x2 = 1 - x2;
  if (x1 < 0) x1 = 0;
  if (x2 < 0) x2 = 0;
  if (x1 > 1 || x2 > 1) {
    const d = x1 * (x1 - 2 + x2) + x2 * (x2 - 2) + 1;
    if (d + kDblEpsilon > 0) {
      if (keepFirst) [x1, x2] = constrainInsideBounds(x1, x2);
      else [x2, x1] = constrainInsideBounds(x2, x1);
    }
  }
  return [x1, 1 - x2];
}

function bezierToPower(a1, b1, c1, d1) {
  const a = b1 - a1, b = c1 - b1, c = d1 - c1, d = b - a;
  return [c - b - d, d + d + d, a + a + a, a1];       // [3 次, 2 次, 1 次, 定数]
}

/** [0, 1] の中の、単調な 3 次式 p3·t³ + p2·t² + p1·t + p0 = 0 の根（animX は nurbs::polyZeroes。ここは二分法） */
function rootInUnit(p3, p2, p1, p0) {
  const f = (t) => ((p3 * t + p2) * t + p1) * t + p0;
  let lo = 0, hi = 1;
  if (f(lo) > 0 || f(hi) < 0) return 0;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

function bezier(startX, startY, x1, y1, x2, y2, endX, endY, time) {
  const rangeX = endX - startX;
  if (rangeX === 0) return 0;
  let nX1 = (x1 - startX) / rangeX, nX2 = (x2 - startX) / rangeX;
  const fLinear = equivalent(nX1, 1 / 3, 1e-6) && equivalent(nX2, 2 / 3, 1e-6);
  const oldX1 = nX1, oldX2 = nX2;
  if (nX1 < 0) nX1 = 0;
  if (nX2 > 1) nX2 = 1;
  if (nX1 > 1 || nX2 < 0) [nX1, nX2] = checkMonotonic(nX1, nX2, true);
  if (nX1 !== oldX1) {
    x1 = startX + nX1 * rangeX;
    if (!equivalent(oldX1, 0)) y1 = startY + (y1 - startY) * nX1 / oldX1;
  }
  if (nX2 !== oldX2) {
    x2 = startX + nX2 * rangeX;
    if (!equivalent(oldX2, 1)) y2 = endY - (endY - y2) * (1 - nX2) / (1 - oldX2);
  }
  const px = bezierToPower(0, nX1, nX2, 1);
  const py = bezierToPower(startY, y1, y2, endY);
  let s;
  if (equivalent(time, startX)) s = 0;
  else if (equivalent(time, endX)) s = 1;
  else s = (time - startX) / (endX - startX);
  const t = fLinear ? s : rootInUnit(px[0], px[1], px[2], px[3] - s);
  return t * (t * (t * py[0] + py[1]) + py[2]) + py[3];
}

function spanMethod(k) {
  if (k.linearInterpolation) return 'linear';
  if (k.tanOut.type === TT.Step) return 'step';
  if (k.tanOut.type === TT.StepNext) return 'stepNext';
  return 'curve';
}

function tangentAngle(key, inTangent) {
  const tx = inTangent ? key.tanIn.x : key.tanOut.x, ty = inTangent ? key.tanIn.y : key.tanOut.y;
  if (!equivalent(tx, 0)) return Math.atan(ty / tx);
  return (equivalent(ty, 0) ? 0 : Math.sign(ty) * 90) * Math.PI / 180;
}

function isStatic(c) {
  return c.keys.every((k) => k.value === c.keys[0].value && k.tanIn.y === 0 && k.tanOut.y === 0);
}

function evaluateInfinity(time, c, pre) {
  const first = c.keys[0], last = c.keys[c.keys.length - 1];
  const range = last.time - first.time;
  if (range === 0) return 0;
  const ratio = (time > last.time ? time - last.time : time - first.time) / range;
  let numCycles = Math.trunc(ratio);
  let remainder = Math.abs(ratio - numCycles);
  let factoredTime = range * remainder;
  numCycles = Math.abs(numCycles) + 1;
  const type = pre ? c.pre : c.post;
  const odd = (numCycles / 2) % 1 !== 0;
  if (pre) {
    if (type === INF.Oscillate) factoredTime = odd ? first.time + factoredTime : last.time - factoredTime;
    else if (type === INF.Cycle || type === INF.CycleRelative) factoredTime = last.time - factoredTime;
    else if (type === INF.Linear) return first.value - (first.time - time) * Math.tan(tangentAngle(first, true));
  } else if (type === INF.Oscillate) factoredTime = odd ? last.time - factoredTime : first.time + factoredTime;
  else if (type === INF.Cycle || type === INF.CycleRelative) factoredTime = first.time + factoredTime;
  else if (type === INF.Linear) return last.value + (time - last.time) * Math.tan(tangentAngle(last, false));
  let value = evaluate(toTickDoubleTime(factoredTime), c);
  if (pre && type === INF.CycleRelative) value -= numCycles * (last.value - first.value);
  else if (!pre && type === INF.CycleRelative) value += numCycles * (last.value - first.value);
  return value;
}

/** prepare() したカーブの時刻 time（秒）の値（animX の evaluateCurve） */
export function evaluate(time, c) {
  const keys = c.keys;
  if (!keys.length) return 0;
  const first = keys[0], last = keys[keys.length - 1];
  if (c.pre !== INF.Constant && time < first.time) return evaluateInfinity(time, c, true);
  if (c.post !== INF.Constant && time > last.time) return evaluateInfinity(time, c, false);
  if (isStatic(c)) return first.value;
  const next = keys.find((k) => k.time >= time) || last;
  if (equivalent(next.time, time) || (next.time < time && next.index === 0)) return next.value;
  if (time >= last.time && next.index === last.index) return last.value;
  if (next.index === 0) return next.value;
  const prev = keys[next.index - 1];
  const method = spanMethod(prev);
  if (method === 'linear') return next.time === prev.time ? prev.value : prev.value + (time - prev.time) / (next.time - prev.time) * (next.value - prev.value);
  if (method === 'step') return prev.value;
  if (method === 'stepNext') return next.value;
  const args = [prev.time, prev.value, prev.time + prev.tanOut.x / 3, prev.value + prev.tanOut.y / 3,
    next.time - next.tanIn.x / 3, next.value - next.tanIn.y / 3, next.time, next.value, time];
  return c.weighted ? bezier(...args) : hermite(...args);
}
