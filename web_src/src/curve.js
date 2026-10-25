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

/** パラメータ u の点（de Boor のアルゴリズム） */
export function pointAt(curve, u, target = new Vector3()) {
  const { degree: p, knots: U, cvs, weights } = curve;
  const n = cvs.length;
  const [u0, u1] = domain(curve);
  u = Math.min(Math.max(u, u0), u1);
  let k = p;
  while (k < n - 1 && U[k + 1] <= u) k++;
  const d = [];
  for (let j = 0; j <= p; j++) {
    const c = cvs[k - p + j];
    const w = weights ? weights[k - p + j] : 1;
    d.push([c.x * w, c.y * w, c.z * w, w]);
  }
  for (let r = 1; r <= p; r++) {
    for (let j = p; j >= r; j--) {
      const i = k - p + j;
      const den = U[i + p - r + 1] - U[i];
      const a = den > 1e-12 ? (u - U[i]) / den : 0;
      for (let c = 0; c < 4; c++) d[j][c] = (1 - a) * d[j - 1][c] + a * d[j][c];
    }
  }
  const h = d[p];
  return target.set(h[0] / h[3], h[1] / h[3], h[2] / h[3]);
}

/** 折れ線で近似した点の列と、始点からの長さ（弧長） */
export function polyline(curve, perSpan = 32) {
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
