// NURBS カーブ（Maya の nurbsCurve）の読み取りと評価。DOM に依存しない。
//
// .ma の setAttr ".cc" -type "nurbsCurve" の値（Python が数値の配列にしたもの）:
//   次数 スパン数 形（0 開・1 閉・2 周期） 有理（0/1） 次元（2/3） ノット数 ノット… CV 数 CV…（次元 + 有理なら重み）
// Maya はノットの両端を 1 つずつ省いて書く（ノット数 = スパン数 + 2·次数 − 1）ので、評価のときに補う。
import { Vector3 } from 'three';

/** カーブの値（プラグで受け渡す）: { isCurve, degree, form, knots（両端を補ったもの）, cvs: Vector3[], weights } */
export function parseNurbsCurve(list) {
  if (!Array.isArray(list) || list.length < 6) return null;
  let i = 0;
  const degree = Math.round(list[i++]);
  i++;                                                   // スパン数（ノットと CV の数から決まる）
  const form = Math.round(list[i++]);
  const rational = Math.round(list[i++]) === 1;
  const dim = Math.round(list[i++]);
  const nk = Math.round(list[i++]);
  const knots = list.slice(i, i + nk);
  i += nk;
  const ncv = Math.round(list[i++]);
  const stride = dim + (rational ? 1 : 0);
  const cvs = [];
  const weights = [];
  for (let k = 0; k < ncv; k++) {
    const o = i + k * stride;
    cvs.push(new Vector3(list[o], list[o + 1], dim >= 3 ? list[o + 2] : 0));
    weights.push(rational ? list[o + dim] : 1);
  }
  if (degree < 1 || cvs.length < degree + 1 || knots.length < 1) return null;
  const full = [knots[0], ...knots, knots[knots.length - 1]];
  return makeCurve(degree, form, full, cvs, rational ? weights : null);
}

export function makeCurve(degree, form, knots, cvs, weights = null) {
  return { isCurve: true, degree, form, knots, cvs, weights };
}

/** CV を作り替えたカーブ（ノットなどはそのまま） */
export function withCvs(curve, cvs) {
  return makeCurve(curve.degree, curve.form, curve.knots, cvs, curve.weights);
}

export function domain(curve) {
  const n = curve.cvs.length;
  return [curve.knots[curve.degree], curve.knots[n]];
}

let _d = new Float64Array(16);            // pointAt の作業用（制御点 (x·w, y·w, z·w, w) を次数 + 1 個）

/** パラメータ u の点（de Boor のアルゴリズム） */
export function pointAt(curve, u, target = new Vector3()) {
  const { degree: p, knots: U, cvs, weights } = curve;
  const n = cvs.length;
  u = Math.min(Math.max(u, U[p]), U[n]);
  let k = p;
  while (k < n - 1 && U[k + 1] <= u) k++;
  if (_d.length < (p + 1) * 4) _d = new Float64Array((p + 1) * 4);
  const d = _d;
  for (let j = 0; j <= p; j++) {
    const c = cvs[k - p + j];
    const w = weights ? weights[k - p + j] : 1;
    d[j * 4] = c.x * w; d[j * 4 + 1] = c.y * w; d[j * 4 + 2] = c.z * w; d[j * 4 + 3] = w;
  }
  for (let r = 1; r <= p; r++) {
    for (let j = p; j >= r; j--) {
      const i = k - p + j;
      const den = U[i + p - r + 1] - U[i];
      const a = den > 1e-12 ? (u - U[i]) / den : 0;
      for (let c = 0; c < 4; c++) d[j * 4 + c] = (1 - a) * d[(j - 1) * 4 + c] + a * d[j * 4 + c];
    }
  }
  const h = p * 4;
  return target.set(d[h] / d[h + 3], d[h + 1] / d[h + 3], d[h + 2] / d[h + 3]);
}

const polylines = new WeakMap();            // カーブ → { 分割数 → 折れ線 }（カーブの値は作ったあと変えないので使い回す）

/** 折れ線で近似した点の列と、始点からの長さ（弧長）。結果は読むだけにすること（同じカーブでは同じものを返す） */
export function polyline(curve, perSpan = 32) {
  let byCount = polylines.get(curve);
  if (!byCount) polylines.set(curve, byCount = new Map());
  let poly = byCount.get(perSpan);
  if (!poly) byCount.set(perSpan, poly = buildPolyline(curve, perSpan));
  return poly;
}

function buildPolyline(curve, perSpan) {
  const [u0, u1] = domain(curve);
  const spans = Math.max(1, curve.cvs.length - curve.degree);
  const count = Math.max(16, spans * perSpan);
  const pts = [];
  const len = [0];
  for (let k = 0; k <= count; k++) {
    pts.push(pointAt(curve, u0 + (u1 - u0) * (k / count)));
    if (k > 0) len.push(len[k - 1] + pts[k].distanceTo(pts[k - 1]));
  }
  return { pts, len, total: len[len.length - 1] };
}

export function arcLength(curve) {
  return polyline(curve).total;
}

/** 弧長 s の点（折れ線の上で補間） */
export function pointAtLength(poly, s, target = new Vector3()) {
  const { pts, len } = poly;
  if (s <= 0) return target.copy(pts[0]);
  if (s >= poly.total) return target.copy(pts[pts.length - 1]);
  let lo = 0, hi = len.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (len[mid] <= s) lo = mid; else hi = mid;
  }
  const t = (s - len[lo]) / Math.max(len[hi] - len[lo], 1e-12);
  return target.lerpVectors(pts[lo], pts[hi], t);
}

/**
 * 折れ線の segFrom 番目の線分以降で、点 from から距離 dist の最初の点（スプライン IK でジョイントを並べる）。
 * 見つからなければ null。戻り値 { point, seg }
 */
export function pointAtDistance(poly, from, dist, segFrom = 0, curve = null) {
  const { pts } = poly;
  for (let k = Math.max(0, segFrom); k < pts.length - 1; k++) {
    const a = pts[k], b = pts[k + 1];
    if (b.distanceTo(from) < dist) continue;
    if (curve && a.distanceTo(from) <= dist) {
      // カーブそのものの上で、|C(u) − from| = dist となるパラメータ u を、この折れ線の区間の中で二分法で求める
      // （折れ線の弦はカーブの内側を通るので、折れ線の上の点は少しずれる）
      const [u0, u1] = domain(curve);
      const step = (u1 - u0) / (pts.length - 1);
      let lo = u0 + step * k, hi = Math.min(u1, lo + step);
      const p = new Vector3();
      for (let it = 0; it < 40; it++) {
        const mid = (lo + hi) / 2;
        if (pointAt(curve, mid, p).distanceTo(from) < dist) lo = mid; else hi = mid;
      }
      return { point: pointAt(curve, (lo + hi) / 2), seg: k };
    }
    // |a + t(b − a) − from| = dist を t ∈ [0, 1] で解く（a が円の内側、b が外側）
    const ab = new Vector3().subVectors(b, a);
    const af = new Vector3().subVectors(a, from);
    const A = ab.dot(ab), B = 2 * af.dot(ab), C = af.dot(af) - dist * dist;
    const disc = Math.max(0, B * B - 4 * A * C);
    const t = A > 1e-12 ? (-B + Math.sqrt(disc)) / (2 * A) : 0;
    return { point: a.clone().addScaledVector(ab, Math.min(1, Math.max(0, t))), seg: k };
  }
  return null;
}

// ---------------------------------------------------------------------------
// カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）と nearestPointOnCurve の計算。
// 読み込み時に形を求める Python（ma_viewer/nurbs.py）と同じ手順にそろえる（The NURBS Book の FindSpan・DersBasisFuns・Boehm）

/** u を含む区間 [knots[k], knots[k+1]) の k（p ≤ k ≤ n − 1。n は CV 数） */
export function findSpan(knots, p, n, u) {
  if (u >= knots[n]) {
    let k = n - 1;
    while (k > p && knots[k] >= knots[n]) k--;
    return k;
  }
  if (u <= knots[p]) {
    let k = p;
    while (k < n - 1 && knots[k + 1] <= knots[p]) k++;
    return k;
  }
  let lo = p, hi = n;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (u < knots[mid]) hi = mid; else lo = mid;
  }
  return lo;
}

/** 区間 k の基底関数 N[k−p..k] とその nd 階までの導関数: ders[階][j] */
export function basisDers(knots, p, k, u, nd) {
  const ndu = Array.from({ length: p + 1 }, () => new Array(p + 1).fill(0));
  const left = new Array(p + 1).fill(0), right = new Array(p + 1).fill(0);
  ndu[0][0] = 1;
  for (let j = 1; j <= p; j++) {
    left[j] = u - knots[k + 1 - j];
    right[j] = knots[k + j] - u;
    let saved = 0;
    for (let r = 0; r < j; r++) {
      ndu[j][r] = right[r + 1] + left[j - r];
      const tmp = ndu[j][r] !== 0 ? ndu[r][j - 1] / ndu[j][r] : 0;
      ndu[r][j] = saved + right[r + 1] * tmp;
      saved = left[j - r] * tmp;
    }
    ndu[j][j] = saved;
  }
  const ders = Array.from({ length: nd + 1 }, () => new Array(p + 1).fill(0));
  for (let j = 0; j <= p; j++) ders[0][j] = ndu[j][p];
  for (let r = 0; r <= p; r++) {
    let s1 = 0, s2 = 1;
    const a = [new Array(p + 1).fill(0), new Array(p + 1).fill(0)];
    a[0][0] = 1;
    for (let kk = 1; kk <= nd; kk++) {
      let d = 0;
      const rk = r - kk, pk = p - kk;
      if (r >= kk) {
        a[s2][0] = ndu[pk + 1][rk] !== 0 ? a[s1][0] / ndu[pk + 1][rk] : 0;
        d = a[s2][0] * ndu[rk][pk];
      }
      const j1 = rk >= -1 ? 1 : -rk;
      const j2 = r - 1 <= pk ? kk - 1 : p - r;
      for (let j = j1; j <= j2; j++) {
        a[s2][j] = ndu[pk + 1][rk + j] !== 0 ? (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j] : 0;
        d += a[s2][j] * ndu[rk + j][pk];
      }
      if (r <= pk) {
        a[s2][kk] = ndu[pk + 1][r] !== 0 ? -a[s1][kk - 1] / ndu[pk + 1][r] : 0;
        d += a[s2][kk] * ndu[r][pk];
      }
      ders[kk][r] = d;
      [s1, s2] = [s2, s1];
    }
  }
  let f = p;
  for (let kk = 1; kk <= nd; kk++) {
    for (let j = 0; j <= p; j++) ders[kk][j] *= f;
    f *= p - kk;
  }
  return ders;
}

/** 1 階の導関数（有理のカーブは差分） */
export function derivativeAt(curve, u) {
  const { degree: p, knots, cvs } = curve;
  if (curve.weights) {
    const [a, b] = domain(curve);
    const h = (b - a) * 1e-6;
    const u0 = Math.max(a, u - h), u1 = Math.min(b, u + h);
    return pointAt(curve, u1).sub(pointAt(curve, u0)).divideScalar(u1 - u0);
  }
  const k = findSpan(knots, p, cvs.length, u);
  const d1 = basisDers(knots, p, k, u, 1)[1];
  const out = new Vector3();
  for (let j = 0; j <= p; j++) out.addScaledVector(cvs[k - p + j], d1[j]);
  return out;
}

/** 向きを反転（パラメータの範囲は同じ。Maya の reverseCurve） */
export function reverseCurve(c) {
  const lo = c.knots[0], hi = c.knots[c.knots.length - 1];
  return makeCurve(c.degree, c.form, c.knots.slice().reverse().map((k) => lo + hi - k), c.cvs.slice().reverse().map((p) => p.clone()),
    c.weights ? c.weights.slice().reverse() : null);
}

const homog = (c) => c.cvs.map((p, i) => { const w = c.weights ? c.weights[i] : 1; return [p.x * w, p.y * w, p.z * w, w]; });
const fromHomog = (c, knots, H, form = c.form) => makeCurve(c.degree, form, knots, H.map((h) => new Vector3(h[0] / h[3], h[1] / h[3], h[2] / h[3])),
  c.weights ? H.map((h) => h[3]) : null);

/** ノット u を times 回挿入（Boehm。形は変わらない） */
export function insertKnot(c, u, times) {
  const p = c.degree;
  let H = homog(c);
  let knots = c.knots.slice();
  for (let t = 0; t < times; t++) {
    const n = H.length;
    const k = findSpan(knots, p, n, u);
    const next = [];
    for (let i = 0; i <= n; i++) {
      if (i <= k - p) next.push(H[i]);
      else if (i > k) next.push(H[i - 1]);
      else {
        const den = knots[i + p] - knots[i];
        const a = den !== 0 ? (u - knots[i]) / den : 0;
        next.push(H[i].map((x, j) => (1 - a) * H[i - 1][j] + a * x));
      }
    }
    H = next;
    knots = [...knots.slice(0, k + 1), u, ...knots.slice(k + 1)];
  }
  return fromHomog(c, knots, H);
}

/** パラメータ a〜b の部分（パラメータはそのまま。開いたカーブ）。範囲がなければ null */
export function curveSegment(c, a, b) {
  const [lo, hi] = domain(c);
  a = Math.max(lo, Math.min(hi, a)); b = Math.max(lo, Math.min(hi, b));
  if (b - a <= 1e-12 * Math.max(1, Math.abs(hi - lo))) return null;
  const p = c.degree;
  let x = c;
  for (const u of [a, b]) {
    if (lo < u && u < hi) {
      const mult = x.knots.filter((k) => Math.abs(k - u) <= 1e-12).length;
      if (mult < p) x = insertKnot(x, u, p - mult);
    }
  }
  const H = homog(x);
  const n = H.length;
  const first = a > lo ? findSpan(x.knots, p, n, a) - p : 0;
  let last = b < hi ? findSpan(x.knots, p, n, b) : n - 1;
  if (b < hi) while (last > p && x.knots[last] >= b - 1e-12) last--;
  const knots = [...new Array(p + 1).fill(a), ...x.knots.slice(first + p + 1, last + 1).filter((k) => a + 1e-12 < k && k < b - 1e-12),
    ...new Array(p + 1).fill(b)];
  const cvs = H.slice(first, last + 1);
  if (knots.length !== cvs.length + p + 1) return null;
  return fromHomog(x, knots, cvs, 0);
}

/** 一様なノット（両端を補ったもの）。multipleEnds なら両端を次数 + 1 重にする（端の CV を通る） */
export function uniformKnots(a, b, spans, degree, multipleEnds) {
  const h = (b - a) / spans;
  if (multipleEnds) {
    return [...new Array(degree + 1).fill(a), ...Array.from({ length: spans - 1 }, (_, i) => a + h * (i + 1)), ...new Array(degree + 1).fill(b)];
  }
  return Array.from({ length: spans + 2 * degree + 1 }, (_, j) => a + h * (j - degree));
}

/** G · X = R（部分ピボットのガウスの消去）。G は n×n、R は n×3 */
function solve(G, R) {
  const n = G.length, m = R[0].length;
  const A = G.map((row, i) => [...row, ...R[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    if (Math.abs(A[piv][c]) < 1e-300) continue;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < n; r++) {
      if (r === c || A[r][c] === 0) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n + m; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => Array.from({ length: m }, (_, j) => (row[i] !== 0 ? row[n + j] / row[i] : 0)));
}

/**
 * 一様なノットで作り直す（Maya の rebuildCurve の uniform の近似。Python の nurbs.rebuild と同じ手順）。
 * keepRange: 0 = 0〜1、1 = 元のパラメータの範囲、2 = 0〜スパン数。keepCvs なら CV はそのままでノットだけ一様に。
 * それ以外は、元のカーブの点（元のパラメータで均等に取る）に最小二乗であてはめ、端の点・接線を重い重みの条件として加える
 */
export function rebuildCurve(c, { spans, degree, keepRange = 1, multipleEnds = true, keepEndPoints = true, keepTangents = true, keepCvs = false }) {
  const [t0, t1] = domain(c);
  const periodic = c.form === 2;
  if (keepCvs) {
    degree = c.degree;
    spans = periodic ? c.cvs.length - c.degree : c.cvs.length - degree;
  }
  spans = Math.max(1, Math.round(spans));
  degree = Math.max(1, Math.round(degree));
  if (periodic) spans = Math.max(spans, degree);
  const [a, b] = keepRange === 0 ? [0, 1] : keepRange === 2 ? [0, spans] : [t0, t1];
  const knots = uniformKnots(a, b, spans, degree, multipleEnds && !periodic);
  const ncv = spans + degree;
  if (keepCvs) return makeCurve(degree, c.form, knots, c.cvs.map((p) => p.clone()), c.weights ? c.weights.slice() : null);
  const nFree = periodic ? spans : ncv;
  const col = periodic ? (i) => i % spans : (i) => i;
  const rows = [];
  const addRow = (u, order, target, w) => {
    const k = findSpan(knots, degree, ncv, u);
    const D = basisDers(knots, degree, k, u, order)[order];
    const row = new Array(nFree).fill(0);
    for (let j = 0; j <= degree; j++) row[col(k - degree + j)] += D[j];
    rows.push({ row, y: target, w });
  };
  const m = Math.max(10 * ncv, 100);
  const toNew = t1 !== t0 ? (b - a) / (t1 - t0) : 1;
  for (let s = 0; s <= m; s++) {
    const t = t0 + (t1 - t0) * s / m;
    addRow(a + (t - t0) * toNew, 0, pointAt(c, t), 1);
  }
  if (!periodic) {
    const W = 1e9;
    if (keepEndPoints) { addRow(a, 0, pointAt(c, t0), W); addRow(b, 0, pointAt(c, t1), W); }
    if (keepTangents && degree > 1) {
      addRow(a, 1, derivativeAt(c, t0).divideScalar(toNew), W);
      addRow(b, 1, derivativeAt(c, t1).divideScalar(toNew), W);
    }
  }
  const G = Array.from({ length: nFree }, () => new Array(nFree).fill(0));
  const R = Array.from({ length: nFree }, () => [0, 0, 0]);
  for (const { row, y, w } of rows) {
    const nz = [];
    row.forEach((v, i) => { if (v !== 0) nz.push(i); });
    for (const i of nz) {
      R[i][0] += w * row[i] * y.x; R[i][1] += w * row[i] * y.y; R[i][2] += w * row[i] * y.z;
      for (const j of nz) G[i][j] += w * row[i] * row[j];
    }
  }
  for (let i = 0; i < nFree; i++) G[i][i] += 1e-12;
  const X = solve(G, R);
  return makeCurve(degree, periodic ? 2 : 0, knots, Array.from({ length: ncv }, (_, i) => new Vector3(...X[col(i)])), null);
}

/** 点 p にいちばん近いカーブ上のパラメータ（粗く探してから、前後の区間を黄金分割で詰める。Python の nurbs.nearest_param と同じ） */
export function nearestParam(c, p) {
  const [a, b] = domain(c);
  const n = Math.max(64, 16 * (c.cvs.length - c.degree));
  const q = new Vector3();
  const dist2 = (u) => pointAt(c, u, q).distanceToSquared(p);
  let best = Infinity, k = 0;
  for (let s = 0; s <= n; s++) {
    const d = dist2(a + (b - a) * s / n);
    if (d < best) { best = d; k = s; }
  }
  let lo = a + (b - a) * Math.max(0, k - 1) / n, hi = a + (b - a) * Math.min(n, k + 1) / n;
  const g = (Math.sqrt(5) - 1) / 2;
  let x1 = hi - g * (hi - lo), x2 = lo + g * (hi - lo), f1 = dist2(x1), f2 = dist2(x2);
  for (let it = 0; it < 80; it++) {
    if (f1 <= f2) { hi = x2; x2 = x1; f2 = f1; x1 = hi - g * (hi - lo); f1 = dist2(x1); }
    else { lo = x1; x1 = x2; f1 = f2; x2 = lo + g * (hi - lo); f2 = dist2(x2); }
  }
  return (lo + hi) / 2;
}
