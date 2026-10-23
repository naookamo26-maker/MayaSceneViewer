// expression ノードの式（MEL の式のうち、数値の計算だけ）の解釈器。DOM に依存しない。
//
// 対応: 入力 .I[n]・出力 .O[n]・frame・time・変数（$x。float / int の宣言、型は最初の代入で決まる）、
//   = += -= *= /= ++ --、四則演算と %、比較・論理演算・? :、if / else・for・while（繰り返しは上限あり）・{ }、
//   数学関数（FUNCTIONS）。MEL と同じく、整数どうしの割り算は切り捨て。
// 非対応（Python 側の ma_viewer/expression.py で事前に見分ける）: MEL コマンド・文字列・ベクトル・
//   .I/.O 以外の属性の参照・フレームをまたいで値を持ち越すグローバル変数。
// 式はフレームごとに最初から評価する（変数は毎回 0 から）。

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const LOOP_LIMIT = 100000;

const smooth = (a, b, x) => {
  if (a === b) return x < a ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** 数学関数（名前 → [引数の数, 関数]）。Python 側の FUNCTIONS と同じ一覧 */
export const FUNCTIONS = {
  sin: [1, Math.sin], cos: [1, Math.cos], tan: [1, Math.tan],
  asin: [1, Math.asin], acos: [1, Math.acos], atan: [1, Math.atan], atan2: [2, Math.atan2],
  sind: [1, (x) => Math.sin(x * D2R)], cosd: [1, (x) => Math.cos(x * D2R)], tand: [1, (x) => Math.tan(x * D2R)],
  asind: [1, (x) => Math.asin(x) * R2D], acosd: [1, (x) => Math.acos(x) * R2D], atand: [1, (x) => Math.atan(x) * R2D],
  atan2d: [2, (y, x) => Math.atan2(y, x) * R2D],
  abs: [1, Math.abs], sqrt: [1, Math.sqrt], pow: [2, Math.pow], exp: [1, Math.exp], log: [1, Math.log],
  log10: [1, Math.log10], floor: [1, Math.floor], ceil: [1, Math.ceil], trunc: [1, Math.trunc], sign: [1, Math.sign],
  min: [2, Math.min], max: [2, Math.max],
  clamp: [3, (lo, hi, x) => Math.min(Math.max(x, lo), hi)],          // MEL: clamp(min, max, value)
  smoothstep: [3, smooth],                                              // smoothstep(start, end, value)
  linstep: [3, (a, b, x) => (a === b ? (x < a ? 0 : 1) : Math.min(1, Math.max(0, (x - a) / (b - a))))],
  deg_to_rad: [1, (x) => x * D2R], rad_to_deg: [1, (x) => x * R2D],
  fmod: [2, (a, b) => a % b], hypot: [2, Math.hypot],
  equivalent: [2, (a, b) => (Math.abs(a - b) <= 1e-5 ? 1 : 0)],
  equivalentTol: [3, (a, b, t) => (Math.abs(a - b) <= t ? 1 : 0)],
};
const CONSTANTS = { true: 1, false: 0, on: 1, off: 0, yes: 1, no: 0 };

const TOKEN_RE = /\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|(\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?)|\.([IO])\[(\d+)\]|(\$\w+)|([A-Za-z_]\w*)|(\+\+|--|[-+*/%]=|==|!=|<=|>=|&&|\|\||[-+*/%=<>!?:;,(){}])/y;

export class ExpressionError extends Error {}

function tokenize(src) {
  const out = [];
  TOKEN_RE.lastIndex = 0;
  let pos = 0;
  while (pos < src.length) {
    TOKEN_RE.lastIndex = pos;
    const m = TOKEN_RE.exec(src);
    if (!m) throw new ExpressionError(`読めない文字「${src[pos]}」`);
    pos = TOKEN_RE.lastIndex;
    if (m[1] !== undefined) out.push({ t: 'num', v: parseFloat(m[1]), int: !/[.eE]/.test(m[1]) });
    else if (m[2] !== undefined) out.push({ t: m[2], v: +m[3] });
    else if (m[4] !== undefined) out.push({ t: 'var', v: m[4] });
    else if (m[5] !== undefined) out.push({ t: 'name', v: m[5] });
    else if (m[6] !== undefined) out.push({ t: 'op', v: m[6] });
  }
  out.push({ t: 'end', v: '' });
  return out;
}

/**
 * 式を関数にする。戻り値の run(env) は { out: Map(出力の番号 → 値) } を返す。
 * env: { input(n) → 数値, frame, time }
 */
export function compileExpression(src) {
  const toks = tokenize(src);
  let p = 0;
  const types = new Map();          // 変数名 → 'int' | 'float'
  const outputs = new Set();
  const peek = () => toks[p];
  const isOp = (v) => toks[p].t === 'op' && toks[p].v === v;
  const expect = (v) => {
    if (!isOp(v)) throw new ExpressionError(`「${v}」が必要です（「${toks[p].v}」）`);
    p++;
  };

  // ---------------------------------------------------------------- 式（{ f: (ctx) => 数値, int: 整数か }）
  const binary = (l, r, op) => {
    const int = l.int && r.int;
    const a = l.f, b = r.f;
    switch (op) {
      case '+': return { f: (c) => a(c) + b(c), int };
      case '-': return { f: (c) => a(c) - b(c), int };
      case '*': return { f: (c) => a(c) * b(c), int };
      case '/': return int ? { f: (c) => { const d = b(c); return d === 0 ? 0 : Math.trunc(a(c) / d); }, int }
        : { f: (c) => a(c) / b(c), int };
      case '%': return { f: (c) => a(c) % b(c), int };
      case '==': return { f: (c) => (a(c) === b(c) ? 1 : 0), int: true };
      case '!=': return { f: (c) => (a(c) !== b(c) ? 1 : 0), int: true };
      case '<': return { f: (c) => (a(c) < b(c) ? 1 : 0), int: true };
      case '<=': return { f: (c) => (a(c) <= b(c) ? 1 : 0), int: true };
      case '>': return { f: (c) => (a(c) > b(c) ? 1 : 0), int: true };
      case '>=': return { f: (c) => (a(c) >= b(c) ? 1 : 0), int: true };
      case '&&': return { f: (c) => (a(c) && b(c) ? 1 : 0), int: true };
      case '||': return { f: (c) => (a(c) || b(c) ? 1 : 0), int: true };
      default: throw new ExpressionError(`未対応の演算子 ${op}`);
    }
  };
  const LEVELS = [['||'], ['&&'], ['==', '!='], ['<', '<=', '>', '>='], ['+', '-'], ['*', '/', '%']];

  // 代入先（変数・出力）
  const target = (tok) => {
    if (tok.t === 'var') {
      const name = tok.v;
      return {
        get: (c) => c.vars.get(name) || 0,
        set: (c, v) => c.vars.set(name, types.get(name) === 'int' ? Math.trunc(v) : v),
        declare: (int) => { if (!types.has(name)) types.set(name, int ? 'int' : 'float'); },
        int: () => types.get(name) === 'int',
      };
    }
    if (tok.t === 'O') {
      const k = tok.v;
      outputs.add(k);
      return { get: (c) => c.out.get(k) || 0, set: (c, v) => c.out.set(k, v), declare: () => {}, int: () => false };
    }
    throw new ExpressionError(`「${tok.v}」には代入できません`);
  };

  function assignment() {
    const tok = peek();
    if ((tok.t === 'var' || tok.t === 'O') && toks[p + 1].t === 'op' && /^[-+*/%]?=$/.test(toks[p + 1].v)) {
      p++;
      const op = toks[p++].v;
      const tg = target(tok);
      const rhs = assignment();
      tg.declare(rhs.int);
      if (op === '=') return { f: (c) => { const v = rhs.f(c); tg.set(c, v); return tg.get(c); }, int: tg.int() };
      const bin = binary({ f: tg.get, int: tg.int() }, rhs, op[0]);
      return { f: (c) => { tg.set(c, bin.f(c)); return tg.get(c); }, int: tg.int() };
    }
    return ternary();
  }

  function ternary() {
    const cond = level(0);
    if (!isOp('?')) return cond;
    p++;
    const a = assignment();
    expect(':');
    const b = assignment();
    return { f: (c) => (cond.f(c) ? a.f(c) : b.f(c)), int: a.int && b.int };
  }

  function level(k) {
    if (k >= LEVELS.length) return unary();
    let left = level(k + 1);
    while (peek().t === 'op' && LEVELS[k].includes(peek().v)) {
      const op = toks[p++].v;
      left = binary(left, level(k + 1), op);
    }
    return left;
  }

  function unary() {
    if (isOp('-')) { p++; const a = unary(); return { f: (c) => -a.f(c), int: a.int }; }
    if (isOp('+')) { p++; return unary(); }
    if (isOp('!')) { p++; const a = unary(); return { f: (c) => (a.f(c) ? 0 : 1), int: true }; }
    if (isOp('++') || isOp('--')) {
      const d = toks[p++].v === '++' ? 1 : -1;
      const tg = target(toks[p++]);
      return { f: (c) => { tg.set(c, tg.get(c) + d); return tg.get(c); }, int: tg.int() };
    }
    return postfix();
  }

  function postfix() {
    const tok = peek();
    if ((tok.t === 'var' || tok.t === 'O') && toks[p + 1].t === 'op' && (toks[p + 1].v === '++' || toks[p + 1].v === '--')) {
      p += 2;
      const d = toks[p - 1].v === '++' ? 1 : -1;
      const tg = target(tok);
      return { f: (c) => { const v = tg.get(c); tg.set(c, v + d); return v; }, int: tg.int() };
    }
    return primary();
  }

  function primary() {
    const tok = toks[p++];
    switch (tok.t) {
      case 'num': { const v = tok.v; return { f: () => v, int: tok.int }; }
      case 'I': { const k = tok.v; return { f: (c) => c.input(k), int: false }; }
      case 'O': { const k = tok.v; return { f: (c) => c.out.get(k) || 0, int: false }; }
      case 'var': {
        const name = tok.v;
        return { f: (c) => c.vars.get(name) || 0, int: types.get(name) === 'int' };
      }
      case 'name': {
        if (tok.v === 'frame') return { f: (c) => c.frame, int: false };
        if (tok.v === 'time') return { f: (c) => c.time, int: false };
        if (tok.v in CONSTANTS) { const v = CONSTANTS[tok.v]; return { f: () => v, int: true }; }
        const fn = FUNCTIONS[tok.v];
        if (!fn) throw new ExpressionError(`未対応の名前 ${tok.v}`);
        expect('(');
        const args = [];
        if (!isOp(')')) {
          args.push(assignment());
          while (isOp(',')) { p++; args.push(assignment()); }
        }
        expect(')');
        if (args.length !== fn[0]) throw new ExpressionError(`${tok.v} の引数は ${fn[0]} 個です`);
        const call = fn[1];
        const fs = args.map((a) => a.f);
        if (fs.length === 1) { const [a] = fs; return { f: (c) => call(a(c)), int: false }; }
        return { f: (c) => call(...fs.map((a) => a(c))), int: false };
      }
      case 'op':
        if (tok.v === '(') {
          // キャスト (int) (float)
          if (peek().t === 'name' && (peek().v === 'int' || peek().v === 'float') && toks[p + 1].v === ')') {
            const int = toks[p].v === 'int';
            p += 2;
            const a = unary();
            return int ? { f: (c) => Math.trunc(a.f(c)), int: true } : { f: a.f, int: false };
          }
          const e = assignment();
          expect(')');
          return e;
        }
        break;
      default: break;
    }
    throw new ExpressionError(`「${tok.v || '式の終わり'}」は読めません`);
  }

  // ---------------------------------------------------------------- 文（(ctx) => void）
  function statement() {
    const tok = peek();
    if (isOp(';')) { p++; return () => {}; }
    if (isOp('{')) {
      p++;
      const list = [];
      while (!isOp('}')) {
        if (peek().t === 'end') throw new ExpressionError('「}」が足りません');
        list.push(statement());
      }
      p++;
      return (c) => { for (const s of list) s(c); };
    }
    if (tok.t === 'name' && (tok.v === 'float' || tok.v === 'int')) {
      p++;
      const int = tok.v === 'int';
      const list = [];
      for (;;) {
        const v = toks[p++];
        if (v.t !== 'var') throw new ExpressionError('変数名（$…）が必要です');
        types.set(v.v, int ? 'int' : 'float');
        const tg = target(v);
        if (isOp('=')) {
          p++;
          const rhs = assignment();
          list.push((c) => tg.set(c, rhs.f(c)));
        } else {
          list.push((c) => tg.set(c, 0));
        }
        if (!isOp(',')) break;
        p++;
      }
      expect(';');
      return (c) => { for (const s of list) s(c); };
    }
    if (tok.t === 'name' && tok.v === 'if') {
      p++;
      expect('(');
      const cond = assignment();
      expect(')');
      const a = statement();
      let b = null;
      if (peek().t === 'name' && peek().v === 'else') { p++; b = statement(); }
      return (c) => { if (cond.f(c)) a(c); else if (b) b(c); };
    }
    if (tok.t === 'name' && tok.v === 'while') {
      p++;
      expect('(');
      const cond = assignment();
      expect(')');
      const body = statement();
      return (c) => { let n = 0; while (cond.f(c)) { if (++n > LOOP_LIMIT) throw new ExpressionError('繰り返しが多すぎます'); body(c); } };
    }
    if (tok.t === 'name' && tok.v === 'for') {
      p++;
      expect('(');
      const init = isOp(';') ? null : assignment();
      expect(';');
      const cond = isOp(';') ? null : assignment();
      expect(';');
      const step = isOp(')') ? null : assignment();
      expect(')');
      const body = statement();
      return (c) => {
        let n = 0;
        for (init && init.f(c); !cond || cond.f(c); step && step.f(c)) {
          if (++n > LOOP_LIMIT) throw new ExpressionError('繰り返しが多すぎます');
          body(c);
        }
      };
    }
    const e = assignment();
    if (peek().t !== 'end') expect(';');
    return (c) => { e.f(c); };
  }

  const program = [];
  while (peek().t !== 'end') program.push(statement());
  return {
    outputs: [...outputs].sort((a, b) => a - b),
    run(env) {
      const ctx = { vars: new Map(), out: new Map(), input: env.input, frame: env.frame, time: env.time };
      for (const s of program) s(ctx);
      return ctx;
    },
  };
}
