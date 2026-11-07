// 自作ノード（プラグイン）の定義（共通 JSON の animation.nodeDefs）の評価。DOM に依存しないので Node.js 上でもテストできる。
//
// Python（ma_viewer/node_defs.py）が、定義ファイルの計算（Python の書き方の一部）を検証して IR（入れ子の配列）に
// 変換している。ここでは IR を関数に組み立て、リグの評価（rig.js）から呼ぶ。
//   * 値: 数・ベクトル（数の配列）・行列（three.js の Matrix4。ほかの行列ノードと同じく Maya の 16 個の値をそのまま並べたもの）
//   * 角度はラジアン（ファイルの値・定義の既定値は度。読むときにラジアンにする）
//   * 行列の積・点の変換は Maya と同じ行ベクトルの規約（m1 * m2 は m1 を先に掛ける）
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { decomposeMaya, mayaEuler } from './animation.js';

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
  // と同じく、同じ向きを表す 2 通りの角度のうち 0 に近い方（Maya で確かめた: Y まわりに 150° は (0, 150, 0)）
  rotation: (m, o) => mayaEuler(decompose(m).q, order(o)),
  scale: (m) => decompose(m).s.toArray(),
  xform_point: (p, m) => v3(vec(p, 'xform_point')).applyMatrix4(mat(m, 'xform_point')).toArray(),
  xform_vector: (v, m) => v3(vec(v, 'xform_vector')).applyMatrix3(new Matrix3().setFromMatrix4(mat(m, 'xform_vector'))).toArray(),
  quat_from_euler: (r, o) => qarr(new Quaternion().setFromEuler(new Euler(...vec(r, 'quat_from_euler').slice(0, 3), order(o)))),
  euler_from_quat: (q, o) => mayaEuler(q4(vec(q, 'euler_from_quat')).normalize(), order(o)),
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

  const interpret = (io) => {
    const env = { io, locals: new Map(), outs: {}, steps: 0 };
    try {
      runBlock(def.ir || [], env);
    } catch (e) {
      if (e === BREAK || e === CONTINUE) fail('break・continue が for の外にあります');
      throw e;
    }
    return expandOutputs(env.outs);
  };
  // 計算を JavaScript の関数にする（毎フレーム IR をたどるより速い）。作れなければ null（IR をたどる）
  const generated = compileEnabled ? generateRunner(def.ir || [], top) : null;
  let useGenerated = !!generated;                  // fallBack で IR をたどる計算に切り替える

  /** 出力（ベクトルは成分のプラグにも入れる） */
  const componentsOf = new Map();                  // 出力のプラグ → 成分のプラグ（なければ null）。名前で決まるので覚える
  const expandOutputs = (outs) => {
    const out = {};
    for (const plug in outs) {
      const v = outs[plug];
      out[plug] = v;
      let comps = componentsOf.get(plug);
      if (comps === undefined) {
        const m = /^(.*?)([A-Za-z_]\w*)$/.exec(plug.replace(/\[\d+\]$/, ''));
        const info = m ? infoOf.get(m[2]) : null;
        // 成分のプラグ: out → outx、配列の要素 out[3] → out[3].outx（Maya と同じ）
        comps = info && info.components ? info.components.map((c) => componentPlug(plug, c)) : null;
        componentsOf.set(plug, comps);
      }
      if (comps && isVec(v)) comps.forEach((cp, k) => { out[cp] = v[k]; });
    }
    return out;
  };

  return {
    type: def.type,
    top,
    infoOf: (plug) => infoOf.get(plug.split('.').pop().replace(/\[\d+\]$/, '')) || null,
    /** 出力のプラグか（out・out[2]・tg[0].ot・成分の outx） */
    isOutput: (plug) => outputBases.has(plug.split(/[.[]/)[0]),
    /** 計算を JavaScript の関数にしたか（できなければ、IR をたどって計算する） */
    get compiled() { return useGenerated; },
    run(io) {
      if (useGenerated) return expandOutputs(generated(io));
      return interpret(io);
    },
    /**
     * 関数をやめて、IR をたどる計算にする（変数の多い定義の関数は 1 回の呼び出しで使うスタックが大きく、スタックの小さい
     * Web Worker では浅い所から呼んでもあふれる。IR をたどる計算はスタックを少しずつ使う）。切り替えたら true
     */
    fallBack() {
      if (!useGenerated) return false;
      useGenerated = false;
      return true;
    },
    /** IR をたどって計算する（生成した関数と結果を比べるテスト用にも使う） */
    interpret,
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

// ---------------------------------------------------------------------- 計算を JavaScript の関数にする
// IR をたどる計算（compileNodeDef の interpret）と同じ順番で値を求め、同じ補助関数（BIN・FUNCS・num など）を使い、
// 同じ誤り（同じ文言）を出す。違うのは、式の種類の振り分け・変数の Map・定数の添字の属性名の組み立て・
// range の配列を、関数を作るときに済ませておくこと。扱わない形（for の外の break など）があれば作らない（null）。

let compileEnabled = true;
/** 計算を JavaScript の関数にするか（false: いつも IR をたどる。比べるテスト用） */
export function setNodeDefCompile(on) { compileEnabled = !!on; }

const UNSET = Object.freeze({ unset: true });       // 値をまだ入れていない変数
// 数どうしなら JavaScript の演算子と同じ結果になる演算（BIN の数の場合と同じ。/ //・% は 0 の確かめがあるので BIN）
const JS_OPS = { '+': '+', '-': '-', '*': '*', '<': '<', '<=': '<=', '>': '>', '>=': '>=', '==': '===', '!=': '!==' };
/** 生成した関数が使う補助（IR をたどる計算と同じもの） */
const H = {
  fail, num, vec, truthy, copy: copyValue, B: BIN, F: FUNCS, U: UNSET,
  over: () => fail('計算の繰り返しが多すぎます（終わらない計算の恐れ）'),   // 文ごとの確かめ（作るコードを短くするため 1 つにまとめる）
  local: (v, name) => (v === UNSET ? fail(`変数 ${name} に値がまだ入っていません`) : v),
  neg: (a) => (isVec(a) ? a.map((x) => -x) : -num(a, '符号の反転')),
  index: (base, iv) => {
    const i = Math.trunc(num(iv, '添字'));
    if (isMat(base)) fail('行列に添字は使えません（translation(m) などを使ってください）');
    const arr = vec(base, '添字');
    const k = i < 0 ? arr.length + i : i;
    if (k < 0 || k >= arr.length) fail(`添字 ${i} が範囲外です（${arr.length} 個）`);
    return arr[k];
  },
  comp: (v, k) => {
    const arr = vec(v, '成分（.x など）');
    if (k >= arr.length) fail(`成分 .${'xyzw'[k]} はありません（${arr.length} 個）`);
    return arr[k];
  },
  fin: (name, v) => (typeof v === 'number' && !Number.isFinite(v) ? fail(`${name} の結果が数になりません（NaN・無限大）`) : v),
  sub: (iv) => `[${Math.trunc(num(iv, '添字'))}]`,
  // 代入先のリスト（添字より先に確かめる）
  target: (arr0) => vec(arr0 === UNSET ? undefined : arr0, '代入先'),
  setItem: (arr, iv, value) => {
    const i = Math.trunc(num(iv, '添字'));
    if (i < 0 || i >= arr.length) fail(`添字 ${i} が範囲外です`);
    arr[i] = num(value, '要素');
  },
  out: (outs, name) => {
    if (!(name in outs)) fail(`出力 ${name} に値がまだ入っていません`);
    return outs[name];
  },
  // for x in range(...): 配列を作らずに数える（FUNCS.range と同じ値・同じ誤り）
  range: (a, b, c) => {
    let [lo, hi, st] = b === undefined ? [0, a, 1] : [a, b, c ?? 1];
    lo = Math.trunc(lo); hi = Math.trunc(hi); st = Math.trunc(st);
    if (!st) fail('range の刻みが 0 です');
    const count = st > 0 ? Math.ceil((hi - lo) / st) : Math.ceil((lo - hi) / -st);
    if (count > MAX_STEPS) fail('range が大きすぎます');
    return [lo, hi, st];
  },
};

class NoCodegen extends Error {}
const giveUp = () => { throw new NoCodegen(); };

/**
 * IR → 関数 (io) => 出力 { プラグ: 値 }（成分のプラグに分ける前）。作れなければ null
 * @param top 属性の短い名前 → 属性の情報（compileNodeDef と同じもの）
 */
/** これより変数の多い定義は、変数を配列にまとめる（generateRunner） */
const MANY_LOCALS = 256;

export function generateRunner(ir, top) {
  if (typeof Function !== 'function') return null;
  const K = [];                                   // 定数（属性の情報など）
  const konst = (v) => { K.push(v); return `K[${K.length - 1}]`; };
  // 変数の名前 → JS の変数名（$L 番号。数が多ければ、あとで配列 V の要素に置き換える）
  const locals = new Map();
  const localVar = (name) => {
    if (!locals.has(name)) locals.set(name, `$L${locals.size}`);
    return locals.get(name);
  };
  // 一時変数は、式の入れ子の深さ（depth）と、その式の中の番号（slot）で名前を決める。同じ深さの兄弟の式は、前の式の値を
  // もう親の一時変数に移し終えているので、同じ名前を使い回せる（式ごとに新しい名前にすると、演算の多い定義では一時変数が
  // 何万個にもなり、1 回の呼び出しで使うスタックが大きくなって、スタックの小さい Web Worker ではあふれる）。
  // 深さ 0 は文の中（代入の値・添字）、式は深さ 1 から。for の数え方の変数（R 番号）は本体のあいだ生きるので別に数える
  const temps = new Set();
  let depth = 0;
  const temp = (slot) => { const t = `T${depth}_${slot}`; temps.add(t); return t; };
  let loopTemps = 0;
  const loopTemp = () => { const t = `R${loopTemps++}`; temps.add(t); return t; };
  const str = (v) => JSON.stringify(String(v));
  const lit = (v) => {
    if (typeof v === 'number') return Object.is(v, -0) ? '-0' : Number.isFinite(v) ? String(v) : konst(v);
    if (typeof v === 'boolean') return String(v);
    return konst(v);
  };

  // 属性のパス → { name: プラグの名前の式（JS）, info: 最後の属性の情報（定数）}。添字が定数なら名前も定数
  const plug = (path) => {
    if (!Array.isArray(path) || !path.length) giveUp();
    const parts = [];
    let info = null;
    let named = false;                            // 名前を 1 つでも付けたか（次の名前の前に . を付ける）
    path.forEach(([short, idx], k) => {
      info = k === 0 ? top.get(short) : (info && info.children ? info.children.get(short) : undefined);
      if (!info) giveUp();                       // 知らない属性（IR をたどる計算と同じ誤りにするため、作らない）
      const skipParent = k === 0 && info.type === 'compound' && !info.array && path.length > 1;
      let sub = '';
      if (idx !== null && idx !== undefined) {
        if (idx[0] === 'n' && typeof idx[1] === 'number') sub = { text: `[${Math.trunc(idx[1])}]` };
        else sub = { code: `H.sub(${expr(idx)})` };
      }
      if (skipParent) { if (sub && sub.code) parts.push({ code: `(${sub.code}, '')` }); return; }
      parts.push({ text: (named ? '.' : '') + short });
      named = true;
      if (sub) parts.push(sub);
    });
    // 添字の式は、IR をたどる計算と同じく左から順に求める
    const text = parts.every((p) => p.text !== undefined);
    const name = text ? str(parts.map((p) => p.text).join(''))
      : parts.map((p) => (p.text !== undefined ? str(p.text) : `(${p.code})`)).join(' + ');
    return { name, info: konst(info), constant: text };
  };

  const expr = (e) => {
    depth++;
    try { return exprAt(e); } finally { depth--; }
  };
  const exprAt = (e) => {
    if (!Array.isArray(e)) giveUp();
    switch (e[0]) {
      case 'n': return lit(e[1]);
      case 'v': return `[${e[1].map((x) => `H.num(${expr(x)}, 'リストの要素')`).join(', ')}]`;
      case 'l': return `H.local(${localVar(e[1])}, ${str(e[1])})`;
      case 'a': { const p = plug(e[1]); return `io.read(${p.name}, ${p.info})`; }
      case 'b': {
        if (e[1] === 'and' || e[1] === 'or') {
          const t = temp(0);
          return e[1] === 'and' ? `((${t} = ${expr(e[2])}), H.truthy(${t}) ? ${expr(e[3])} : ${t})`
            : `((${t} = ${expr(e[2])}), H.truthy(${t}) ? ${t} : ${expr(e[3])})`;
        }
        return binary(e[1], expr(e[2]), expr(e[3]));
      }
      case 'ch': {
        // 項の多い式（数百項の足し算など）を入れ子にしないよう、一時変数に左から順に入れていく
        const acc = temp(2);                     // binary の 0・1 と別
        const steps = [`(${acc} = ${expr(e[2][0])})`];
        for (let k = 0; k < e[1].length; k++) steps.push(`(${acc} = ${binary(e[1][k], acc, expr(e[2][k + 1]))})`);
        return `(${steps.join(', ')}, ${acc})`;
      }
      case 'u': return e[1] === 'not' ? `!H.truthy(${expr(e[2])})` : `H.neg(${expr(e[2])})`;
      case 'if': return `(H.truthy(${expr(e[1])}) ? ${expr(e[2])} : ${expr(e[3])})`;
      case 'i': return `H.index(${expr(e[1])}, ${expr(e[2])})`;
      case 'g': return `H.comp(${expr(e[1])}, ${lit(e[2])})`;
      case 'c': return call(e[1], e[2]);
      default: return giveUp();
    }
  };

  // 二項演算: 数どうしなら直接計算し、それ以外は BIN（型の確かめ・ベクトル・行列。結果は BIN と同じ）。
  // 左・右の順に 1 回ずつ求める
  const binary = (op, a, b) => {
    if (!BIN[op]) giveUp();
    const js = JS_OPS[op];
    if (!js) return `H.B[${str(op)}](${a}, ${b})`;
    const x = temp(0), y = temp(1);
    return `((${x} = ${a}), (${y} = ${b}), typeof ${x} === 'number' && typeof ${y} === 'number' ? ${x} ${js} ${y} : H.B[${str(op)}](${x}, ${y}))`;
  };

  const call = (name, args) => {
    switch (name) {
      case 'frame': return 'io.frame';
      case 'time': return '(io.frame / (io.fps || 24))';
      case 'indices': case 'count': {
        if (!args[0] || !Array.isArray(args[0][1])) giveUp();   // 属性のパス（["p", パス]。IR をたどる計算と同じく [1] を使う）
        const p = plug(args[0][1]);
        return name === 'count' ? `io.indices(${p.name}).length` : `io.indices(${p.name})`;
      }
      case 'connected': {
        if (!args[0] || !Array.isArray(args[0][1])) giveUp();
        return `(io.connected(${plug(args[0][1]).name}) ? 1 : 0)`;
      }
      default:
        if (!FUNCS[name]) return `H.fail(${str(`関数 ${name} はありません`)})`;
        return `H.fin(${str(name)}, H.F[${str(name)}](${args.map(expr).join(', ')}))`;
    }
  };

  // 代入: value は求めた値（JS の式。先に一時変数へ入れてから、代入先の添字を求める）
  const assign = (target, value) => {
    if (target[0] === 'l') return `${localVar(target[1])} = ${value};`;
    const t = temp(3);                            // 文の一時変数（深さ 0。値・添字の式は深さ 1 から）
    if (target[0] === 'li') {
      const a = temp(4);
      return `${t} = ${value}; ${a} = H.target(${localVar(target[1])}); H.setItem(${a}, ${expr(target[2])}, ${t});`;
    }
    if (target[0] !== 'o') giveUp();
    const p = plug(target[1]);
    return `${t} = ${value}; outs[${p.name}] = ${t};`;
  };
  const current = (target) => {
    if (target[0] === 'l') return expr(target);
    if (target[0] === 'li') return `H.index(H.local(${localVar(target[1])}, ${str(target[1])}), ${expr(target[2])})`;
    if (target[0] !== 'o') giveUp();
    return `H.out(outs, ${plug(target[1]).name})`;
  };

  let loops = 0;
  const block = (stmts) => {
    if (!Array.isArray(stmts)) giveUp();
    return stmts.map((s) => {
      const head = `if (++S > ${MAX_STEPS}) H.over();\n`;
      switch (s[0]) {
        case 'set': return head + assign(s[1], `H.copy(${expr(s[2])})`);
        case 'aug': {
          return head + assign(s[2], binary(s[1], current(s[2]), expr(s[3])));
        }
        case 'if': return `${head}if (H.truthy(${expr(s[1])})) {\n${block(s[2])}\n} else {\n${block(s[3])}\n}`;
        case 'for': {
          const v = localVar(s[1]);
          const it = s[2];
          loops++;
          let code;
          if (Array.isArray(it) && it[0] === 'c' && it[1] === 'range' && it[2].length >= 1 && it[2].length <= 3) {
            // range: 配列を作らずに数える（値・誤りは FUNCS.range と同じ）
            const r = loopTemp();
            const a = it[2].map(expr);
            const x = loopTemp();
            code = `${r} = H.range(${a.join(', ')});\n`
              + `for (let ${x} = ${r}[0]; ${r}[2] > 0 ? ${x} < ${r}[1] : ${x} > ${r}[1]; ${x} += ${r}[2]) {\n${v} = ${x};\n${block(s[3])}\n}`;
          } else {
            const x = loopTemp();
            code = `for (const ${x} of H.vec(${expr(it)}, 'for の繰り返し')) {\n${v} = ${x};\n${block(s[3])}\n}`;
          }
          loops--;
          return head + code;
        }
        case 'break': case 'continue':
          if (!loops) giveUp();                  // for の外（IR をたどる計算と同じ誤りにするため、作らない）
          return `${head}${s[0]};`;
        default: return giveUp();
      }
    }).join('\n');
  };

  let body;
  try {
    body = block(ir);
  } catch (e) {
    return null;                                  // 扱わない形・深すぎる入れ子など（IR をたどって計算する）
  }
  // 変数が多ければ、配列 V の要素にする（1 回の呼び出しで使うスタックを小さくする）
  const many = locals.size > MANY_LOCALS;
  if (many) body = body.replace(/\$L(\d+)/g, 'V[$1]');
  const decl = many ? [] : [...locals.values()].map((v) => `${v} = H.U`);
  for (const t of temps) decl.push(t);
  const src = `'use strict';\nlet S = 0;\nconst outs = {};\n${many ? `const V = new Array(${locals.size}).fill(H.U);\n` : ''}`
    + `${decl.length ? `let ${decl.join(', ')};\n` : ''}${body}\nreturn outs;`;
  try {
    const fn = new Function('io', 'H', 'K', src);   // eslint-disable-line no-new-func
    return (io) => fn(io, H, K);
  } catch (e) {
    return null;                                  // 関数を作れない環境（Content-Security-Policy など）
  }
}
