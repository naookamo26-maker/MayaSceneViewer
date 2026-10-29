// アニメーション（共通 JSON の animation）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（animation.py）はキーの時刻・値・接線の種類と、固定の接線だけを渡す。
// 接線の傾きの計算（スプライン・オートなど）とカーブの評価はここで行う。
// Autodesk が公開している animX（Maya と同じ評価をするライブラリ。github.com/Autodesk/animx）と同じにしたもの:
//   * 重みなしのカーブ: 区間ごとのエルミート補間
//   * 重み付きのカーブ: 接線の長さを制御点にした 3 次ベジエ（制御点が区間からはみ出すときの直し方も animX と同じ）
//   * オート・オートミックス・オートイーズの傾き、範囲外（リニア・繰り返し・往復など）
// animX にない（Maya の計算が公開されていない）ので近似のもの:
//   * スプライン・クランプ・プラトーの傾き（docs/animation_curves.md）
// ローカル行列は Maya の式（docs/data_format.md「行列の規約」）で組み立てる。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

// 接線の種類（.ma の kit / kot / .tan の値）
export const TANGENT = {
  FIXED: 1, LINEAR: 2, FLAT: 3, STEP: 5, SLOW: 6, FAST: 7, SPLINE: 9, CLAMPED: 10, PLATEAU: 16, STEP_NEXT: 17, AUTO: 18,
  AUTO_MIX: 19, AUTO_EASE: 20, AUTO_CUSTOM: 21,
};
// 範囲外の振る舞い（.pre / .pst）
export const INFINITY = { CONSTANT: 0, LINEAR: 1, CYCLE: 3, CYCLE_RELATIVE: 4, OSCILLATE: 5 };

const D2R = Math.PI / 180;
const EPS = 1e-9;
const STEP_HOLD = 1;        // この区間はキーの値を保つ（ステップ）
const STEP_NEXT = 2;        // この区間は次のキーの値（ステップ（次））

/** 数値の配列（リスト、または {dtype, count, data: base64}）を型付き配列にする */
export function decodeArray(entry, Ctor = Float32Array) {
  if (entry == null) return new Ctor(0);
  if (Array.isArray(entry)) return Ctor.from(entry);
  const bin = atob(entry.data || '');
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  if (entry.dtype === 'uint8') return Ctor === Uint8Array ? bytes : Ctor.from(bytes);
  const f = new Float32Array(bytes.buffer, 0, Math.floor(bytes.length / 4));
  return Ctor === Float32Array ? f : Ctor.from(f);
}

function resolveType(k, fallback) {
  if (k === 0) k = fallback || TANGENT.AUTO;
  // オートカスタムは、係数を Maya の設定から読めないのでオートイーズにする（animX のテストと同じ扱い）
  if (k === TANGENT.AUTO_CUSTOM) return TANGENT.AUTO_EASE;
  return k;
}

const sign1 = (x) => (x < 0 ? -1 : 1);       // animX の _SIGN（0 は正）
const EASE_C = -0.5;                         // オートイーズの係数（animX の kEaseCoefficient）

/**
 * オート系の接線の傾き（animX の _autoTangent と同じ）。両隣の傾きの間で目標の傾きを決め、
 * 制御点が両隣のキーの値の範囲から出ないよう、両隣の傾きの 3 倍で抑える（山・谷では平ら）。
 *   オート: 両隣を結ぶ傾き・オートミックス: 両隣の傾きを時間の比で線形に混ぜる・オートイーズ: 近い側を強く効かせて混ぜる
 */
function autoSlope(type, px, x, nx, py, y, ny) {
  const prevSlope = (y - py) / (x - px), nextSlope = (ny - y) / (nx - x);
  const prev3 = 3 * prevSlope, next3 = 3 * nextSlope;
  let target;
  if (type === TANGENT.AUTO) target = (ny - py) / (nx - px);
  else {
    const f = (x - px) / (nx - px);
    let g = f;
    if (type === TANGENT.AUTO_EASE) {
      const h = f - 0.5;
      g = 0.5 + h * (1 - EASE_C + 4 * EASE_C * h * h);
    }
    target = (1 - g) * prevSlope + g * nextSlope;
  }
  if (sign1(prev3) !== sign1(next3) || sign1(target) !== sign1(next3)) return 0;
  return next3 >= 0 ? Math.min(target, next3, prev3) : Math.max(target, next3, prev3);
}

/** 1 本のカーブを評価できる形にする（接線の傾きと重みを計算する） */
export function prepareCurve(meta, times, values, types, fixedOf) {
  const n = meta.count;
  const off = meta.offset;
  const t = Float64Array.from(times.subarray(off, off + n));
  const v = Float64Array.from(values.subarray(off, off + n));
  const inSlope = new Float64Array(n);
  const outSlope = new Float64Array(n);
  const inW = new Float64Array(n);       // 重み付きのときの接線の長さ（フレーム）。0 は既定（区間の長さ）
  const outW = new Float64Array(n);
  const step = new Uint8Array(n);
  const weighted = !!meta.weighted;
  const secant = (a, b) => (v[b] - v[a]) / Math.max(t[b] - t[a], EPS);

  const computed = (type, i, side) => {
    const hasPrev = i > 0, hasNext = i < n - 1;
    const prev = hasPrev ? secant(i - 1, i) : 0;
    const next = hasNext ? secant(i, i + 1) : 0;
    switch (type) {
      case TANGENT.LINEAR:
        if (side === 'in') return hasPrev ? prev : next;
        return hasNext ? next : prev;
      case TANGENT.FLAT: case TANGENT.STEP: case TANGENT.STEP_NEXT:
        return 0;
      case TANGENT.CLAMPED: {
        if (!hasPrev || !hasNext) return hasPrev ? prev : next;
        if (Math.abs(v[i] - v[i - 1]) < EPS || Math.abs(v[i + 1] - v[i]) < EPS) return 0;
        return secant(i - 1, i + 1);
      }
      case TANGENT.AUTO: case TANGENT.AUTO_MIX: case TANGENT.AUTO_EASE:
        if (!hasPrev || !hasNext) return 0;                 // 両端は平ら
        return autoSlope(type, t[i - 1], t[i], t[i + 1], v[i - 1], v[i], v[i + 1]);
      case TANGENT.PLATEAU: {                               // 近似（Maya の計算は公開されていない）
        if (!hasPrev || !hasNext) return 0;                 // 両端は平ら
        if (prev * next <= 0) return 0;                     // 山・谷は平ら
        const s = secant(i - 1, i + 1);
        const lim = 3 * Math.min(Math.abs(prev), Math.abs(next));   // 行き過ぎを抑える
        return Math.sign(s) * Math.min(Math.abs(s), lim);
      }
      default:                                              // スプライン・スロー・ファスト・不明
        if (hasPrev && hasNext) return secant(i - 1, i + 1);
        return hasPrev ? prev : next;
    }
  };

  for (let i = 0; i < n; i++) {
    const k = off + i;
    const tin = resolveType(types.length ? types[2 * k] : 0, meta.tangent);
    const tout = resolveType(types.length ? types[2 * k + 1] : 0, meta.tangent);
    if (tout === TANGENT.STEP) step[i] = STEP_HOLD;
    else if (tout === TANGENT.STEP_NEXT) step[i] = STEP_NEXT;
    const fx = fixedOf.get(k);
    for (const side of ['in', 'out']) {
      const type = side === 'in' ? tin : tout;
      let slope = computed(type, i, side);
      let w = 0;
      const x = fx ? (side === 'in' ? fx[0] : fx[2]) : NaN;
      const y = fx ? (side === 'in' ? fx[1] : fx[3]) : NaN;
      // 固定の接線（kix など）は、種類が「固定」のとき、または重み付きのカーブで使う
      if (Number.isFinite(x) && Number.isFinite(y) && (type === TANGENT.FIXED || weighted)) {
        const keepSlope = type === TANGENT.LINEAR || type === TANGENT.FLAT || type === TANGENT.STEP || type === TANGENT.STEP_NEXT;
        if (!keepSlope && Math.abs(x) > EPS) slope = y / x;
        if (weighted) w = Math.abs(x);
      }
      if (side === 'in') { inSlope[i] = slope; inW[i] = w; } else { outSlope[i] = slope; outW[i] = w; }
    }
  }
  return {
    name: meta.name, type: meta.type, trax: !!meta.trax, n, t, v, inSlope, outSlope, inW, outW, step, weighted,
    pre: meta.pre || 0, post: meta.post || 0, last: 0,
  };
}

/** 区間 i（t[i] 〜 t[i+1]）の中の時刻 x の値 */
function segmentValue(c, i, x) {
  const t0 = c.t[i], t1 = c.t[i + 1], v0 = c.v[i], v1 = c.v[i + 1];
  if (c.step[i] === STEP_HOLD) return v0;
  if (c.step[i] === STEP_NEXT) return x > t0 ? v1 : v0;
  const dt = t1 - t0;
  if (dt <= EPS) return v1;
  if (!c.weighted || (c.outW[i] === 0 && c.inW[i + 1] === 0)) {
    // エルミート（接線は区間の長さで伸ばす）
    const s = (x - t0) / dt, s2 = s * s, s3 = s2 * s;
    const m0 = c.outSlope[i] * dt, m1 = c.inSlope[i + 1] * dt;
    return (2 * s3 - 3 * s2 + 1) * v0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * v1 + (s3 - s2) * m1;
  }
  // 重み付き: 制御点 (t0 + wo/3, v0 + so·wo/3), (t1 − wi/3, v1 − si·wi/3) の 3 次ベジエ
  const wo = c.outW[i] || dt, wi = c.inW[i + 1] || dt;
  return bezierSegment(t0, v0, t0 + wo / 3, v0 + c.outSlope[i] * wo / 3, t1 - wi / 3, v1 - c.inSlope[i + 1] * wi / 3, t1, v1, x);
}

/**
 * 重み付きの区間の値（animX の Tbezier::evaluate と同じ）。制御点の時刻を区間で 0〜1 にし、時刻が逆戻りしない
 * （x(s) が単調な）ように直してから、x(s) = 時刻 となる s で値を求める。制御点を直すときは接線の傾きを保つ
 */
export function bezierSegment(t0, v0, x1, y1, x2, y2, t1, v1, x) {
  const range = t1 - t0;
  if (range === 0) return 0;
  let n1 = (x1 - t0) / range, n2 = (x2 - t0) / range;
  const linear = Math.abs(n1 - 1 / 3) <= 1e-6 && Math.abs(n2 - 2 / 3) <= 1e-6;
  const o1 = n1, o2 = n2;
  if (n1 < 0) n1 = 0;
  if (n2 > 1) n2 = 1;
  if (n1 > 1 || n2 < 0) [n1, n2] = checkMonotonic(n1, n2);
  if (n1 !== o1 && Math.abs(o1) > BEZ_EPS) y1 = v0 + (y1 - v0) * n1 / o1;
  if (n2 !== o2 && Math.abs(o2 - 1) > BEZ_EPS) y2 = v1 - (v1 - y2) * (1 - n2) / (1 - o2);
  let s;
  if (Math.abs(x - t0) <= BEZ_EPS) s = 0;
  else if (Math.abs(x - t1) <= BEZ_EPS) s = 1;
  else s = (x - t0) / range;
  let u = s;
  if (!linear) {
    // x(u) = 3·n1·u(1−u)² + 3·n2·u²(1−u) + u³ は [0, 1] で単調なので、二分法で x(u) = s を解く
    const xa = 3 * n1, xb = 3 * n2 - 6 * n1, xc = 1 + 3 * n1 - 3 * n2;     // x(u) = ((xc·u + xb)·u + xa)·u
    let lo = 0, hi = 1;
    for (let k = 0; k < 60; k++) {
      u = (lo + hi) / 2;
      if (((xc * u + xb) * u + xa) * u < s) lo = u; else hi = u;
    }
    u = (lo + hi) / 2;
  }
  const w = 1 - u;
  return w * w * w * v0 + 3 * w * w * u * y1 + 3 * w * u * u * y2 + u * u * u * v1;
}

const BEZ_EPS = 1e-10;                   // animX の kDblEpsilon

/** 制御点の時刻（0〜1 にしたもの）を、x(s) が単調になる範囲に入れる（animX の checkMonotonic。1 つ目を優先） */
function checkMonotonic(n1, n2) {
  let a = n1, b = 1 - n2;                // 制御の並びを [0, a, 1 − b, 1] にして考える
  if (a < 0) a = 0;
  if (b < 0) b = 0;
  if (a > 1 || b > 1) {
    const d = a * (a - 2 + b) + b * (b - 2) + 1;
    if (d + BEZ_EPS > 0) {
      // 楕円 a² + b² − 2(a + b) + ab + 1 = 0 の内側に入れる
      if (a + BEZ_EPS < 4 / 3) {
        const bb = a - 2, cc = a - 1;
        const discr = Math.sqrt(bb * bb - 4 * cc * cc);
        let root = (-bb + discr) * 0.5;
        if (b + BEZ_EPS > root) b = root - BEZ_EPS;
        else {
          root = (-bb - discr) * 0.5;
          if (b < root + BEZ_EPS) b = root + BEZ_EPS;
        }
      } else {
        a = 4 / 3 - BEZ_EPS;
        b = 1 / 3 - BEZ_EPS;
      }
    }
  }
  return [a, 1 - b];
}

const KEY_SNAP = 2.4e-9;     // キーの時刻にこれより近ければキーの値（Maya は 1e-10 秒。24 fps のフレームにしたもの）

function inRange(c, x) {
  const t = c.t, n = c.n;
  if (x >= t[n - 1] - KEY_SNAP) return c.v[n - 1];
  // 再生中は直前の区間の近くを探すことが多いので、前回の位置から調べる
  let i = c.last;
  if (!(i < n - 1 && t[i] <= x && x < t[i + 1])) {
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (t[mid] <= x) lo = mid; else hi = mid;
    }
    i = lo;
    c.last = i;
  }
  if (t[i + 1] - x <= KEY_SNAP) return c.v[i + 1];
  if (x - t[i] <= KEY_SNAP) return c.v[i];
  return segmentValue(c, i, x);
}

/** カーブの時刻 x（フレーム）の値 */
export function evaluateCurve(c, x) {
  const n = c.n;
  if (n === 0) return 0;
  if (n === 1) return c.v[0];
  const t0 = c.t[0], tn = c.t[n - 1];
  if (x >= t0 && x <= tn) return inRange(c, x);
  const before = x < t0;
  const mode = before ? c.pre : c.post;
  if (mode === INFINITY.LINEAR) {
    return before ? c.v[0] + c.inSlope[0] * (x - t0) : c.v[n - 1] + c.outSlope[n - 1] * (x - tn);
  }
  const period = tn - t0;
  if (period <= EPS || !(mode === INFINITY.CYCLE || mode === INFINITY.CYCLE_RELATIVE || mode === INFINITY.OSCILLATE)) {
    return before ? c.v[0] : c.v[n - 1];
  }
  const cycles = Math.floor((x - t0) / period);
  let local = x - cycles * period;
  if (mode === INFINITY.OSCILLATE && (cycles % 2 !== 0)) local = t0 + tn - local;
  const val = inRange(c, local);
  return mode === INFINITY.CYCLE_RELATIVE ? val + cycles * (c.v[n - 1] - c.v[0]) : val;
}

// ---------------------------------------------------------------------- ローカル行列
const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const THREE_ORDER = ROTATE_ORDERS.map((o) => o.split('').reverse().join('').toUpperCase());  // Maya の xyz → three の 'ZYX'
const _e = new Euler();
const _f = new Matrix4();

/**
 * 行列を移動・回転・スケール・せん断に分ける（Maya の decomposeMatrix・MTransformationMatrix と同じ分け方）。
 * Maya の行列（行ベクトル）は S · Sh · R · T（Sh は行の順に (1, 0, 0)・(xy, 1, 0)・(xz, yz, 1)）。軸（three.js の列 =
 * Maya の行）を X・Y・Z の順に直交させ（グラム・シュミット）、X 軸の向きをそのまま回転の X 軸にする。
 * 残りはせん断 (xy, xz, yz)。three.js の decompose は軸を正規化するだけなので、せん断があると回転がずれる。
 * 鏡に映した行列（行列式が負）は、反転を Z のスケールに入れる（three.js は X に入れる）。
 * 例: diag(1, 1, −1) → 回転なし・スケール (1, 1, −1)
 */
export function decomposeMaya(m, t = new Vector3(), q = new Quaternion(), s = new Vector3(), sh = new Vector3()) {
  const e = m.elements;
  t.set(e[12], e[13], e[14]);
  const x = new Vector3(e[0], e[1], e[2]), y = new Vector3(e[4], e[5], e[6]), z = new Vector3(e[8], e[9], e[10]);
  const sx = x.length();
  if (sx < 1e-12) { m.decompose(t, q, s); sh.set(0, 0, 0); return { t, q, s, sh }; }
  x.divideScalar(sx);
  const dxy = y.dot(x);
  y.addScaledVector(x, -dxy);
  const sy = y.length();
  if (sy < 1e-12) { m.decompose(t, q, s); sh.set(0, 0, 0); return { t, q, s, sh }; }
  y.divideScalar(sy);
  const dxz = z.dot(x), dyz = z.dot(y);
  z.addScaledVector(x, -dxz).addScaledVector(y, -dyz);
  let sz = z.length();
  if (sz < 1e-12) { m.decompose(t, q, s); sh.set(0, 0, 0); return { t, q, s, sh }; }
  z.divideScalar(sz);
  if (new Vector3().crossVectors(x, y).dot(z) < 0) { sz = -sz; z.negate(); }   // 鏡に映した行列: 反転は Z
  q.setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
  s.set(sx, sy, sz);
  sh.set(dxy / sy, dxz / sz, dyz / sz);
  return { t, q, s, sh };
}

/** Maya の composeMatrix と同じ行列（行ベクトルの S · Sh · R · T）。q は回転の四元数、sh はせん断 (xy, xz, yz) */
export function composeMaya(t, q, s, sh = [0, 0, 0], target = new Matrix4()) {
  const R = new Matrix4().makeRotationFromQuaternion(q);
  const Sh = new Matrix4().set(1, sh[0], sh[1], 0, 0, 1, sh[2], 0, 0, 0, 1, 0, 0, 0, 0, 1);
  const S = new Matrix4().makeScale(s[0], s[1], s[2]);
  target.makeTranslation(t[0], t[1], t[2]).multiply(R).multiply(Sh).multiply(S);
  return target;
}

/**
 * ワールド行列の回転を、回転順 ro（'xyz' などの文字列か 0〜5）の角度（度）にする。
 * Maya の xform -q -ws -ro と同じ値（ジョイントの向き・rotateAxis・親の回転を含む。スケールは除く）
 */
export function worldRotationDegrees(m, ro = 0) {
  const i = typeof ro === 'string' ? ROTATE_ORDERS.indexOf(ro) : Math.round(ro);
  const { q } = decomposeMaya(m);
  const e = new Euler().setFromQuaternion(q, THREE_ORDER[i] || 'ZYX');
  return [e.x / D2R, e.y / D2R, e.z / D2R];
}

/**
 * Maya の式でローカル行列を作る（docs/data_format.md「行列の規約」）。
 * Maya の行ベクトル規約の積 A·B は、three.js（列ベクトル）では B·A なので、Maya の並び順に premultiply する。
 * @param x {t, r（度）, s, ro, ra（度）, jo（度）, rp, sp, rpt, spt, sh, joint}
 * @param isScale 打ち消す親のスケール（ジョイントの segmentScaleCompensate・自作ノードの割り当てで指定したノード。なければ null）
 */
export function composeLocalMatrix(x, isScale, target = new Matrix4()) {
  target.identity();
  const mul = (m) => target.premultiply(m);
  const tr = (v, k = 1) => (v ? _f.makeTranslation(v[0] * k, v[1] * k, v[2] * k) : null);
  const rot = (r, ro) => _f.makeRotationFromEuler(_e.set(r[0] * D2R, r[1] * D2R, r[2] * D2R, THREE_ORDER[ro] || 'ZYX'));
  const sc = x.s;
  if (x.joint) {
    mul(_f.makeScale(sc[0], sc[1], sc[2]));
    if (x.ra) mul(rot(x.ra, 0));
    mul(rot(x.r, x.ro || 0));
    if (x.jo) mul(rot(x.jo, 0));
    if (isScale) mul(_f.makeScale(isScale[0] ? 1 / isScale[0] : 1, isScale[1] ? 1 / isScale[1] : 1, isScale[2] ? 1 / isScale[2] : 1));
    mul(tr(x.t));
    return withOffsetParent(x, target);
  }
  if (x.sp) mul(tr(x.sp, -1));
  mul(_f.makeScale(sc[0], sc[1], sc[2]));
  if (x.sh) mul(_f.set(1, x.sh[0], x.sh[1], 0, 0, 1, x.sh[2], 0, 0, 0, 1, 0, 0, 0, 0, 1));
  if (x.sp) mul(tr(x.sp));
  if (x.spt) mul(tr(x.spt));
  if (x.rp) mul(tr(x.rp, -1));
  if (x.ra) mul(rot(x.ra, 0));
  mul(rot(x.r, x.ro || 0));
  if (x.rp) mul(tr(x.rp));
  if (x.rpt) mul(tr(x.rpt));
  if (isScale) mul(_f.makeScale(isScale[0] ? 1 / isScale[0] : 1, isScale[1] ? 1 / isScale[1] : 1, isScale[2] ? 1 / isScale[2] : 1));
  mul(tr(x.t));
  return withOffsetParent(x, target);
}

/**
 * 移動・回転・スケールの制限（x.lim = { t | r | s: [[最小 × 3], [最大 × 3]]。null は制限なし。回転は度）の範囲に、
 * x.t・x.r・x.s を収める（Maya の transform の minTransLimit など。有効なものだけが入っている）
 */
export function clampLimits(x) {
  const lim = x.lim;
  if (!lim) return x;
  for (const k in lim) {
    const v = x[k], [lo, hi] = lim[k];
    if (!v) continue;
    for (let i = 0; i < 3; i++) {
      if (lo[i] != null && v[i] < lo[i]) v[i] = lo[i];
      if (hi[i] != null && v[i] > hi[i]) v[i] = hi[i];
    }
  }
  return x;
}

/** offsetParentMatrix（Maya 2020 以降）: ワールド行列 = ローカル · opm · 親（Maya の順）。opm は 16 要素か Matrix4 */
function withOffsetParent(x, target) {
  if (!x.opm) return target;
  return target.premultiply(x.opm.isMatrix4 ? x.opm : _f.fromArray(x.opm));
}

const AXIS = { x: 0, y: 1, z: 2 };

/** 読み込んだアニメーション。evaluate(フレーム) でノードごとのローカル行列を計算する */
export class AnimationClip {
  constructor(anim) {
    this.raw = anim;
    this.fps = +anim.fps || 24;
    this.start = +anim.start;
    this.end = +anim.end;
    if (!(this.end >= this.start)) { this.start = 0; this.end = 0; }
    this.current = Number.isFinite(+anim.current) ? +anim.current : this.start;
    const times = decodeArray(anim.times);
    const values = decodeArray(anim.values);
    const types = decodeArray(anim.tangentTypes, Uint8Array);
    const fixed = decodeArray(anim.fixedTangents);
    const fixedOf = new Map();
    for (let i = 0; i + 4 < fixed.length; i += 5) fixedOf.set(fixed[i], [fixed[i + 1], fixed[i + 2], fixed[i + 3], fixed[i + 4]]);
    this.curves = (anim.curves || []).map((c) => prepareCurve(c, times, values, types, fixedOf));
    // 時間のカーブ（ドリブンキー UA・UL・UU を除く。キーの目盛りとタイムラインに使う）
    // 時間で引くカーブ（Trax のクリップのカーブは、キーがクリップの中の時間なので除く）
    this.timeCurves = this.curves.filter((c) => (!c.type || c.type[0] === 'T') && !c.trax);
    this.warnings = (anim.warnings || []).slice();
    // ノードごとの材料と、動かす属性
    const byNode = new Map();
    for (const n of anim.nodes || []) {
      byNode.set(n.node, {
        node: n.node, rest: n, isNode: n.isNode ?? -1, isScale: n.isScale || null, channels: [],
        cur: { ...n, t: n.t.slice(), r: n.r.slice(), s: n.s.slice() },
      });
    }
    for (const ch of anim.channels || []) {
      const e = byNode.get(ch.node);
      const c = this.curves[ch.curve];
      if (!e || !c) continue;
      e.channels.push({ base: ch.attr[0], axis: AXIS[ch.attr[1]], curve: c, attr: ch.attr });
    }
    this.entries = [...byNode.values()];
    this.byNode = byNode;
    this.matrices = new Map(this.entries.map((e) => [e.node, new Matrix4()]));
  }

  /** 動くノードの番号 */
  get nodes() { return this.entries.map((e) => e.node); }

  /** ノードを動かすカーブの属性名 */
  channelsOf(ni) {
    const e = this.byNode.get(ni);
    return e ? e.channels.map((c) => c.attr) : [];
  }

  /** キーのある時刻（ノードを指定すればそのノードのカーブだけ） */
  keyTimes(ni = -1) {
    const set = new Set();
    const list = ni >= 0 ? (this.byNode.get(ni) || { channels: [] }).channels.map((c) => c.curve) : this.timeCurves;
    for (const c of list) for (let i = 0; i < c.n; i++) set.add(c.t[i]);
    return [...set].sort((a, b) => a - b);
  }

  /** フレーム x の各ノードのローカル行列を計算する（this.matrices に入る） */
  evaluate(x) {
    for (const e of this.entries) {
      const cur = e.cur;
      for (const ch of e.channels) cur[ch.base][ch.axis] = evaluateCurve(ch.curve, x);
      clampLimits(cur);
    }
    for (const e of this.entries) {
      let isScale = null;
      if (e.isScale || e.isNode >= 0) {
        const p = e.isNode >= 0 ? this.byNode.get(e.isNode) : null;
        isScale = p ? p.cur.s : e.isScale;
      }
      composeLocalMatrix(e.cur, isScale, this.matrices.get(e.node));
    }
    return this.matrices;
  }

  /** 再生範囲の中に収めたフレーム（繰り返し再生用） */
  wrap(x) {
    const len = this.end - this.start + 1;
    if (len <= 1) return this.start;
    return this.start + ((((x - this.start) % len) + len) % len);
  }
}
