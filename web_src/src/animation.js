// アニメーション（共通 JSON の animation）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（animation.py）はキーの時刻・値・接線の種類と、固定の接線だけを渡す。
// 接線の傾きの計算（スプライン・オートなど）とカーブの評価はここで行う。完全な再現は目指さず、
// Maya の見た目に近い補間にする:
//   * 重みなしのカーブ: 区間ごとのエルミート補間（Maya と同じ）
//   * 重み付きのカーブ: 接線の長さを制御点にした 3 次ベジエ
//   * スプライン・クランプ・オート・プラトーの傾きは近似（オートとプラトーは山・谷で平らにし、行き過ぎを抑える）
// ローカル行列は Maya の式（docs/data_format.md「行列の規約」）で組み立てる。
import { Euler, Matrix4 } from 'three';

// 接線の種類（.ma の kit / kot / .tan の値）
export const TANGENT = {
  FIXED: 1, LINEAR: 2, FLAT: 3, STEP: 5, SLOW: 6, FAST: 7, SPLINE: 9, CLAMPED: 10, PLATEAU: 16, STEP_NEXT: 17, AUTO: 18,
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
  if (k >= 19 && k <= 21) return TANGENT.AUTO;        // オートの派生（autoMix・autoEase・autoCustom）
  return k;
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
      case TANGENT.AUTO: case TANGENT.PLATEAU: {
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
  const x1 = Math.min(t0 + wo / 3, t1), x2 = Math.max(t1 - wi / 3, t0);
  const y1 = v0 + c.outSlope[i] * (x1 - t0), y2 = v1 - c.inSlope[i + 1] * (t1 - x2);
  const bez = (p0, p1, p2, p3, s) => {
    const u = 1 - s;
    return u * u * u * p0 + 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s * p3;
  };
  // x(s) = x は単調なので二分法で解く
  let lo = 0, hi = 1, s = (x - t0) / dt;
  for (let k = 0; k < 40; k++) {
    const xs = bez(t0, x1, x2, t1, s);
    if (Math.abs(xs - x) < 1e-7) break;
    if (xs < x) lo = s; else hi = s;
    s = (lo + hi) / 2;
  }
  return bez(v0, y1, y2, v1, s);
}

function inRange(c, x) {
  const t = c.t, n = c.n;
  if (x >= t[n - 1]) return c.v[n - 1];
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
