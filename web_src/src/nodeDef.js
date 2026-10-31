// 自作ノード（プラグイン）の定義（共通 JSON の animation.nodeDefs）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（ma_viewer/node_defs.py）が、定義ファイルの計算（Python の書き方の一部）を検証して IR（入れ子の配列）に
// 変換している。ここでは IR を関数に組み立て、リグの評価（rig.js）から呼ぶ。
//   * 値: 数・ベクトル（数の配列）・行列（three.js の Matrix4。ほかの行列ノードと同じく Maya の 16 個の値をそのまま並べたもの）
//   * 角度はラジアン（ファイルの値・定義の既定値は度。読むときにラジアンにする）
//   * 行列の積・点の変換は Maya と同じ行ベクトルの規約（m1 * m2 は m1 を先に掛ける）
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { decomposeMaya } from './animation.js';

/** 四元数 → 回転の値（ラジアン。three.js の順の文字列 o）。Maya の API と同じ標準の分け方 */
function apiEuler(q, o) {
  const e = new Euler().setFromQuaternion(q, o);
  return [e.x, e.y, e.z];
}

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const THREE_ORDER = ROTATE_ORDERS.map((o) => o.split('').reverse().join('').toUpperCase());
const MAX_STEPS = 200000;                 // 1 回の計算のループの上限（終わらない計算を止める）
const ANGLE_TYPES = new Set(['angle', 'angle3']);
const VECTOR_SIZE = { vector: 3, double3: 3, float3: 3, angle3: 3, double2: 2, float2: 2, double4: 4 };

export class NodeDefError extends Error {}

const fail = (msg) => { throw new NodeDefError(msg); };
const isMat = (v) => v && v.isMatrix4;
const isVec = (v) => Array.isArray(v);
const isNum = (v) => typeof v === 'number' || typeof v === 'boolean';
const num = (v, what) => (isNum(v) ? +v : fail(`${what}に数以外（${kindOf(v)}）を渡しています`));
const vec = (v, what) => (isVec(v) ? v : fail(`${what}にベクトル以外（${kindOf(v)}）を渡しています`));
const mat = (v, what) => (isMat(v) ? v : (isVec(v) && v.length === 16 ? new Matrix4().fromArray(v) : fail(`${what}に行列以外（${kindOf(v)}）を渡しています`)));
function kindOf(v) {
  if (isMat(v)) return '行列';
  if (isVec(v)) return `ベクトル（${v.length} 個）`;
  if (isNum(v)) return '数';
  return v === undefined ? '値なし' : typeof v;
}
const cell = (r, c, what) => {
  const i = Math.trunc(num(r, `${what} の行`)), j = Math.trunc(num(c, `${what} の列`));
  if (i < 0 || i > 3 || j < 0 || j > 3) fail(`${what} の行・列は 0〜3 です（${i}, ${j}）`);
  return i * 4 + j;
};
const truthy = (v) => (isVec(v) ? v.length > 0 : !!v);
const order = (o) => THREE_ORDER[Math.round(o || 0)] || 'ZYX';
const v3 = (v) => new Vector3(v[0] || 0, v[1] || 0, v[2] || 0);
const q4 = (q) => new Quaternion(q[0] || 0, q[1] || 0, q[2] || 0, q[3] ?? 1);
const qarr = (q) => [q.x, q.y, q.z, q.w];

// ---------------------------------------------------------------------- 演算
function elementwise(a, b, f, op) {
  if (isVec(a) && isVec(b)) {
    if (a.length !== b.length) fail(`長さの違うベクトル（${a.length} 個と ${b.length} 個）を ${op} しています`);
    return a.map((x, i) => f(x, b[i]));
  }
  if (isVec(a) && isNum(b)) return a.map((x) => f(x, +b));
  if (isNum(a) && isVec(b)) return b.map((x) => f(+a, x));
  return null;
}

const BIN = {
  '+': (a, b) => (isNum(a) && isNum(b) ? a + b : elementwise(a, b, (x, y) => x + y, '+') ?? fail(`${kindOf(a)}と${kindOf(b)}は足せません`)),
  '-': (a, b) => (isNum(a) && isNum(b) ? a - b : elementwise(a, b, (x, y) => x - y, '-') ?? fail(`${kindOf(a)}と${kindOf(b)}は引けません`)),
  '*': (a, b) => {
    if (isNum(a) && isNum(b)) return a * b;
    // Maya の m1 * m2（m1 を先に掛ける。行ベクトル）は、three.js では m2 · m1
    if (isMat(a) && isMat(b)) return b.clone().multiply(a);
    if (isVec(a) && isVec(b)) fail('ベクトル同士の * は使えません（内積は dot、外積は cross、成分ごとの積は [a.x * b.x, …]）');
    if (isMat(a) || isMat(b)) fail('行列とベクトル・数の * は使えません（点は xform_point、向きは xform_vector）');
    return elementwise(a, b, (x, y) => x * y, '*');
  },
  '/': (a, b) => {
    if (isVec(b)) fail('ベクトルでは割れません');
    const d = num(b, '割る数');
    if (d === 0) fail('0 で割っています');
    return isNum(a) ? a / d : elementwise(a, d, (x, y) => x / y, '/') ?? fail(`${kindOf(a)}は割れません`);
  },
  '//': (a, b) => { const d = num(b, '割る数'); if (d === 0) fail('0 で割っています'); return Math.floor(num(a, '割られる数') / d); },
  '%': (a, b) => { const d = num(b, '割る数'); if (d === 0) fail('0 で割っています'); const x = num(a, '割られる数'); return ((x % d) + d) % d; },
  '**': (a, b) => num(a, '累乗') ** num(b, '累乗'),
  '==': (a, b) => (isVec(a) && isVec(b) ? a.length === b.length && a.every((x, i) => x === b[i]) : num(a, '比較') === num(b, '比較')),
  '!=': (a, b) => !BIN['=='](a, b),
  '<': (a, b) => num(a, '比較') < num(b, '比較'),
  '<=': (a, b) => num(a, '比較') <= num(b, '比較'),
  '>': (a, b) => num(a, '比較') > num(b, '比較'),
  '>=': (a, b) => num(a, '比較') >= num(b, '比較'),
};

/** Python の round（偶数への丸め） */
function pyRound(x, nd = 0) {
  const k = 10 ** nd;
  const y = x * k;
  const r = Math.round(y);
  return (Math.abs(y % 1) === 0.5 ? 2 * Math.round(y / 2) : r) / k;
}

// 鏡に映した行列は Z のスケールを負にする（Maya の MTransformationMatrix と同じ分け方）
// 行列の分解は MTransformationMatrix と同じ（鏡に映した行列は Z のスケールを負にする）
const decompose = (m) => decomposeMaya(mat(m, '行列の分解'), undefined, undefined, undefined, undefined, 'z');

const FUNCS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
  sqrt: (x) => (x < 0 ? fail('負の数の sqrt です') : Math.sqrt(x)), pow: Math.pow, exp: Math.exp,
  log: (x, b) => (b === undefined ? Math.log(x) : Math.log(x) / Math.log(b)), log10: Math.log10,
  abs: (x) => (isVec(x) ? x.map(Math.abs) : Math.abs(x)), floor: Math.floor, ceil: Math.ceil, round: pyRound, trunc: Math.trunc,
  sign: Math.sign, hypot: Math.hypot, fmod: (a, b) => a % b, radians: (x) => x * D2R, degrees: (x) => x * R2D,
  min: (...a) => Math.min(...(a.length === 1 && isVec(a[0]) ? a[0] : a)),
  max: (...a) => Math.max(...(a.length === 1 && isVec(a[0]) ? a[0] : a)),
  clamp: (x, lo, hi) => Math.min(Math.max(x, lo), hi),
  lerp: (a, b, t) => BIN['+'](a, BIN['*'](BIN['-'](b, a), num(t, 'lerp の割合'))),
  smoothstep: (e0, e1, x) => { const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1); return t * t * (3 - 2 * t); },
  int: (x) => Math.trunc(num(x, 'int')), float: (x) => num(x, 'float'), bool: (x) => (truthy(x) ? 1 : 0),
  vector: (x, y, z) => [num(x, 'vector'), num(y, 'vector'), num(z, 'vector')],
  dot: (a, b) => vec(a, 'dot').reduce((s, x, i) => s + x * vec(b, 'dot')[i], 0),
  cross: (a, b) => v3(vec(a, 'cross')).cross(v3(vec(b, 'cross'))).toArray(),
  length: (a) => Math.hypot(...vec(a, 'length')),
  normalize: (a) => { const l = Math.hypot(...vec(a, 'normalize')); return l > 0 ? a.map((x) => x / l) : a.slice(); },
  distance: (a, b) => Math.hypot(...vec(a, 'distance').map((x, i) => x - vec(b, 'distance')[i])),
  angle: (a, b) => v3(vec(a, 'angle')).angleTo(v3(vec(b, 'angle'))),
  identity: () => new Matrix4(),
  matrix: (a) => mat(a, 'matrix').clone(),
  inverse: (m) => mat(m, 'inverse').clone().invert(),
  transpose: (m) => mat(m, 'transpose').clone().transpose(),
  // 要素（行・列は Maya の 0〜3。行ベクトルの規約なので、移動は 3 行目）。three.js の elements は Maya の行の順に並ぶ
  element: (m, r, c) => mat(m, 'element').elements[cell(r, c, 'element')],
  set_element: (m, r, c, v) => {
    const out = mat(m, 'set_element').clone();
    out.elements[cell(r, c, 'set_element')] = num(v, 'set_element の値');
    return out;
  },
  matrix_values: (m) => Array.from(mat(m, 'matrix_values').elements),
  determinant: (m) => mat(m, 'determinant').determinant(),
  determinant3: (m) => new Matrix3().setFromMatrix4(mat(m, 'determinant3')).determinant(),
  equivalent: (a, b, tol) => {
    const x = mat(a, 'equivalent').elements, y = mat(b, 'equivalent').elements, t = tol === undefined ? 1e-10 : num(tol, 'equivalent の許容差');
    return x.every((v, i) => Math.abs(v - y[i]) <= t) ? 1 : 0;
  },
  // 移動・回転（ラジアン、回転順 Maya の 0〜5）・スケールから行列（Maya の S · R · T）
  compose: (t, r, s, o) => new Matrix4().compose(v3(vec(t, 'compose の移動')),
    new Quaternion().setFromEuler(new Euler(...vec(r, 'compose の回転').slice(0, 3), order(o))), v3(vec(s, 'compose のスケール'))),
  translation: (m) => decompose(m).t.toArray(),
  // 行列・四元数から回転の値を出す関数は、Maya の API（MTransformationMatrix.rotation()・MQuaternion.asEulerRotation()）
  // と同じ標準の答え（真ん中の軸が ±90° の範囲）。コンストレイントの「0 や前回の値に近い方」（mayaEuler）とは違う
  rotation: (m, o) => apiEuler(decompose(m).q, order(o)),
  scale: (m) => decompose(m).s.toArray(),
  xform_point: (p, m) => v3(vec(p, 'xform_point')).applyMatrix4(mat(m, 'xform_point')).toArray(),
  xform_vector: (v, m) => v3(vec(v, 'xform_vector')).applyMatrix3(new Matrix3().setFromMatrix4(mat(m, 'xform_vector'))).toArray(),
  quat_from_euler: (r, o) => qarr(new Quaternion().setFromEuler(new Euler(...vec(r, 'quat_from_euler').slice(0, 3), order(o)))),
  euler_from_quat: (q, o) => apiEuler(q4(vec(q, 'euler_from_quat')).normalize(), order(o)),
  quat_from_matrix: (m) => qarr(decompose(m).q),
  matrix_from_quat: (q) => new Matrix4().makeRotationFromQuaternion(q4(vec(q, 'matrix_from_quat')).normalize()),
  // Maya の a * b（a を先に回す）は、three.js では b · a
  quat_mul: (a, b) => qarr(q4(vec(b, 'quat_mul')).multiply(q4(vec(a, 'quat_mul')))),
  quat_slerp: (a, b, t) => qarr(q4(vec(a, 'quat_slerp')).normalize().slerp(q4(vec(b, 'quat_slerp')).normalize(), num(t, 'quat_slerp'))),
  quat_inverse: (q) => qarr(q4(vec(q, 'quat_inverse')).invert()),
  quat_normalize: (q) => qarr(q4(vec(q, 'quat_normalize')).normalize()),
  range: (a, b, c) => {
    let [lo, hi, st] = b === undefined ? [0, a, 1] : [a, b, c ?? 1];
    lo = Math.trunc(lo); hi = Math.trunc(hi); st = Math.trunc(st);
    if (!st) fail('range の刻みが 0 です');
    const out = [];
    for (let i = lo; st > 0 ? i < hi : i > hi; i += st) { out.push(i); if (out.length > MAX_STEPS) fail('range が大きすぎます'); }
    return out;
  },
};

// ---------------------------------------------------------------------- 定義の組み立て
/**
 * 定義（{ type, attributes, ir }）を評価できる形にする。
 * 戻り値の run(io) が出力 { プラグ: 値 } を返す。io は評価する側（rig.js）が用意する:
 *   read(plug, info) 入力の属性の値・indices(prefix) 配列の要素の番号・connected(plug)・frame・fps
 */
export function compileNodeDef(def) {
  const top = new Map();
  const outputBases = new Set();
  const infoOf = new Map();                         // 名前（子・成分も）→ 属性の情報
  const prep = (spec, parent) => {
    const info = { ...spec, parent, children: new Map(), size: VECTOR_SIZE[spec.type] || 0, angle: ANGLE_TYPES.has(spec.type) };
    for (const c of spec.children || []) info.children.set(c.short, prep(c, info));
    infoOf.set(spec.short, info);
    for (const [k, c] of (spec.components || []).entries()) infoOf.set(c, { component: k, of: info, angle: info.angle });
    return info;
  };
  for (const a of def.attributes || []) {
    const info = prep(a, null);
    top.set(a.short, info);
    if (a.output) {
      outputBases.add(a.short);
      for (const c of a.components || []) outputBases.add(c);
      if (a.type === 'compound' && !a.array) {
        for (const c of info.children.values()) { outputBases.add(c.short); for (const k of c.components || []) outputBases.add(k); }
      }
    }
  }

  // ---- 属性のパス → プラグの名前（compound（配列でない）の子は、子の名前だけ）
  const plugOf = (path, env) => {
    let name = '';
    let info = null;
    for (const [k, [short, idx]] of path.entries()) {
      info = k === 0 ? top.get(short) : info.children.get(short);
      const skipParent = k === 0 && info.type === 'compound' && !info.array && path.length > 1;
      const i = idx === null ? '' : `[${Math.trunc(num(evalExpr(idx, env), '添字'))}]`;
      if (!skipParent) name += (name ? '.' : '') + short + i;
    }
    return { name, info };
  };

  // ---- 式
  const evalExpr = (e, env) => {
    switch (e[0]) {
      case 'n': return e[1];
      case 'v': return e[1].map((x) => num(evalExpr(x, env), 'リストの要素'));
      case 'l': {
        if (!env.locals.has(e[1])) fail(`変数 ${e[1]} に値がまだ入っていません`);
        return env.locals.get(e[1]);
      }
      case 'a': { const p = plugOf(e[1], env); return env.io.read(p.name, p.info); }
      case 'b': {
        if (e[1] === 'and') { const a = evalExpr(e[2], env); return truthy(a) ? evalExpr(e[3], env) : a; }
        if (e[1] === 'or') { const a = evalExpr(e[2], env); return truthy(a) ? a : evalExpr(e[3], env); }
        return BIN[e[1]](evalExpr(e[2], env), evalExpr(e[3], env));
      }
      case 'ch': {                                   // a + b - c …（左から順に。項の多い式を入れ子にしない）
        let v = evalExpr(e[2][0], env);
        for (let k = 0; k < e[1].length; k++) v = BIN[e[1][k]](v, evalExpr(e[2][k + 1], env));
        return v;
      }
      case 'u': {
        const a = evalExpr(e[2], env);
        if (e[1] === 'not') return !truthy(a);
        return isVec(a) ? a.map((x) => -x) : -num(a, '符号の反転');
      }
      case 'if': return truthy(evalExpr(e[1], env)) ? evalExpr(e[2], env) : evalExpr(e[3], env);
      case 'i': {
        const base = evalExpr(e[1], env);
        const i = Math.trunc(num(evalExpr(e[2], env), '添字'));
        if (isMat(base)) fail('行列に添字は使えません（translation(m) などを使ってください）');
        const arr = vec(base, '添字');
        const k = i < 0 ? arr.length + i : i;
        if (k < 0 || k >= arr.length) fail(`添字 ${i} が範囲外です（${arr.length} 個）`);
        return arr[k];
      }
      case 'g': {
        const arr = vec(evalExpr(e[1], env), '成分（.x など）');
        if (e[2] >= arr.length) fail(`成分 .${'xyzw'[e[2]]} はありません（${arr.length} 個）`);
        return arr[e[2]];
      }
      case 'c': return call(e[1], e[2], env);
      default: return fail(`知らない式です（${e[0]}）`);
    }
  };

  const call = (name, args, env) => {
    switch (name) {
      case 'frame': return env.io.frame;
      case 'time': return env.io.frame / (env.io.fps || 24);
      case 'indices': case 'count': {
        const p = plugOf(args[0][1], env);
        const list = env.io.indices(p.name);
        return name === 'count' ? list.length : list;
      }
      case 'connected': return env.io.connected(plugOf(args[0][1], env).name) ? 1 : 0;
      default: {
        const f = FUNCS[name];
        if (!f) fail(`関数 ${name} はありません`);
        const v = f(...args.map((a) => evalExpr(a, env)));
        if (typeof v === 'number' && !Number.isFinite(v)) fail(`${name} の結果が数になりません（NaN・無限大）`);
        return v;
      }
    }
  };

  // ---- 文
  const BREAK = {}, CONTINUE = {};
  const assign = (target, value, env) => {
    if (target[0] === 'l') { env.locals.set(target[1], value); return; }
    if (target[0] === 'li') {
      const arr = vec(env.locals.get(target[1]), '代入先');
      const i = Math.trunc(num(evalExpr(target[2], env), '添字'));
      if (i < 0 || i >= arr.length) fail(`添字 ${i} が範囲外です`);
      arr[i] = num(value, '要素');
      return;
    }
    const p = plugOf(target[1], env);
    env.outs[p.name] = value;
  };
  const current = (target, env) => {
    if (target[0] === 'l') return evalExpr(target, env);
    if (target[0] === 'li') return evalExpr(['i', ['l', target[1]], target[2]], env);
    const p = plugOf(target[1], env);
    if (!(p.name in env.outs)) fail(`出力 ${p.name} に値がまだ入っていません`);
    return env.outs[p.name];
  };
  const runBlock = (stmts, env) => {
    for (const s of stmts) {
      if (++env.steps > MAX_STEPS) fail('計算の繰り返しが多すぎます（終わらない計算の恐れ）');
      switch (s[0]) {
        case 'set': assign(s[1], copyValue(evalExpr(s[2], env)), env); break;
        case 'aug': assign(s[2], BIN[s[1]](current(s[2], env), evalExpr(s[3], env)), env); break;
        case 'if': runBlock(truthy(evalExpr(s[1], env)) ? s[2] : s[3], env); break;
        case 'for': {
          const it = evalExpr(s[2], env);
          for (const x of vec(it, 'for の繰り返し')) {
            env.locals.set(s[1], x);
            try { runBlock(s[3], env); } catch (e) {
              if (e === BREAK) break;
              if (e === CONTINUE) continue;
              throw e;
            }
          }
          break;
        }
        case 'break': throw BREAK;
        case 'continue': throw CONTINUE;
        default: fail(`知らない文です（${s[0]}）`);
      }
    }
  };

  /** 出力（ベクトルは成分のプラグにも入れる） */
  const expandOutputs = (outs) => {
    const out = {};
    for (const [plug, v] of Object.entries(outs)) {
      out[plug] = v;
      const m = /^(.*?)([A-Za-z_]\w*)$/.exec(plug.replace(/\[\d+\]$/, ''));
      const info = m ? infoOf.get(m[2]) : null;
      if (info && info.components && isVec(v)) {
        // 成分のプラグ: out → outx、配列の要素 out[3] → out[3].outx（Maya と同じ）
        info.components.forEach((c, k) => { out[componentPlug(plug, c)] = v[k]; });
      }
    }
    return out;
  };

  return {
    type: def.type,
    top,
    infoOf: (plug) => infoOf.get(plug.split('.').pop().replace(/\[\d+\]$/, '')) || null,
    /** 出力のプラグか（out・out[2]・tg[0].ot・成分の outx） */
    isOutput: (plug) => outputBases.has(plug.split(/[.[]/)[0]),
    run(io) {
      const env = { io, locals: new Map(), outs: {}, steps: 0 };
      try {
        runBlock(def.ir || [], env);
      } catch (e) {
        if (e === BREAK || e === CONTINUE) fail('break・continue が for の外にあります');
        throw e;
      }
      return expandOutputs(env.outs);
    },
  };
}

/** ベクトルの属性のプラグ（in・in[3]・tg[0].tt）の、成分 c のプラグ（inx・in[3].inx・tg[0].ttx） */
export function componentPlug(plug, c) {
  if (/\]$/.test(plug)) return `${plug}.${c}`;
  const k = plug.lastIndexOf('.');
  return k >= 0 ? `${plug.slice(0, k + 1)}${c}` : c;
}

/** 代入するときに値を複製する（ベクトルの要素を書き換えても、元の値が変わらないように） */
function copyValue(v) {
  if (isVec(v)) return v.slice();
  if (isMat(v)) return v.clone();
  return v;
}

/** 属性の情報から、角度か（ファイルの値・既定値は度） */
export function isAngleInfo(info) { return !!(info && info.angle); }
