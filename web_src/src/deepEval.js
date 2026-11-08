// 深い再帰でスタックがあふれたときのやり直し（評価器 rig.js・計画を作る rigCompiled.js）。
//
// 評価は、必要になった値を上流へさかのぼって（再帰で）求める。計算ノード・自作ノードが長い鎖になっていると呼び出しが
// 深くなり、スタックの小さい所（Web Worker など）では「Maximum call stack size exceeded」になる。
//   * 値を覚える所（キャッシュ）は、計算の途中でスタックがあふれたら、その計算をもう一度行う関数を state.at に残す
//     （いちばん深い所が先に残し、外側は上書きしない）
//   * runDeep は、あふれたら state.at を浅いスタックから先に求めて（結果はキャッシュに残る）、元の計算をやり直す。
//     やり直すたびに、さかのぼる鎖が短くなる。計算の順番は同じなので、結果はあふれなかったときと同じ
//   * runDeep の中（state.depth > 0）では、エラーを受け止めて「値なし」にする所も、あふれのエラーは上へ渡す
//   * 先に求めた計算のうち、次のフレームでも同じものを求められるもの（state.at.warm: 計算ノードの出力・属性の値・
//     ワールド行列などの値）は、求め終えた順に state.order に覚える（汎用の経路と専用の評価とで別に。useOrder）。
//     次のフレームからは、評価の初めにその順で先に求めておく（rig.js の prewarmDeep）。
//     深い所から順に求まっているので、毎フレームあふれ直さない
//   * 本物のスタックの限界までは行かない: 値を覚える所の入れ子が DEEP_LIMIT 段を超えたら、あふれたのと同じエラー（DEEP_ERROR）を
//     投げて、同じようにやり直す。スタックの残りが少ない所では、正規表現の機械語へのコンパイルなどがエラーにならずに
//     プロセスごと止まることがある（V8）ため

/** 何回までやり直すか（終わらないときの安全のため） */
const MAX_RETRIES = 100000;

/** 値を覚える所の入れ子の上限（これを超えたら、浅い所からやり直す。Web Worker のスタックでも十分に収まる段数） */
export const DEEP_LIMIT = 64;

/** 入れ子の上限を超えたときに投げるエラー（スタックのあふれと同じに扱う。毎回作らない） */
export const DEEP_ERROR = new RangeError('Maximum call stack size exceeded（評価の入れ子の上限）');

/** 値を覚える所が使う状態（評価器ごとに 1 つ。評価器を引き継いだオブジェクトも同じものを使う） */
export function newDeepState() {
  const orders = { generic: { order: [], known: new Set() }, plan: { order: [], known: new Set() } };
  return { depth: 0, at: null, retries: 0, orders, order: orders.generic.order, known: orders.generic.known, marks: [], level: 0,
    insertAt: -1 };                              // insertAt: 先に求めている途中に覚えた順番を入れる位置（-1 なら最後）
}

/** 覚える順番を、経路（'generic' 汎用の経路・'plan' 専用の評価）のものにする */
export function useOrder(state, name) {
  const o = state.orders[name];
  state.order = o.order;
  state.known = o.known;
}

/** 値を計算する前に呼ぶ（入れ子の段数を数え、上限を超えたら DEEP_ERROR）。計算のあと必ず leaveDeep を呼ぶこと */
export function enterDeep(state) {
  if (++state.level > DEEP_LIMIT && state.depth) throw DEEP_ERROR;
}

export function leaveDeep(state) {
  state.level--;
}

/**
 * スタックのあふれかもしれないエラーか（スタックの残りが少ない所でも呼べるよう、関数を呼ばずに調べる）。
 * Chromium・Safari は RangeError、Firefox は InternalError（too much recursion）
 */
export function mayOverflow(e) {
  return e instanceof RangeError || (!!e && e.name === 'InternalError');
}

/**
 * エラーが起きた所の関数名（スタックの先頭から、重ならないものを max 個まで）。スタックがあふれた所を見分けるため
 * （評価のプロファイラに出す）。取り出せなければ空
 */
export function stackNames(stack, max = 6) {
  const names = [];
  for (const line of String(stack || '').split('\n')) {
    // V8: "    at name (url:1:2)" / "    at url:1:2"、Firefox・Safari: "name@url:1:2"
    const m = /^\s*at\s+(?:new\s+)?([^\s(]+)\s+\(/.exec(line) || /^([^@\s]+)@/.exec(line);
    const name = m ? m[1].replace(/^.*\./, '') : null;
    if (name && !names.includes(name)) names.push(name);
    if (names.length >= max) break;
  }
  return names;
}

/** スタックのあふれのエラーか（やり直す前に、ほかの RangeError と見分ける） */
export function isStackOverflow(e) {
  return mayOverflow(e) && /call stack|stack size|recursion/i.test(String(e.message));
}

/**
 * fn を求める。スタックがあふれたら、state.at（いちばん深い所の計算）を先に求めてから、やり直す。
 * onRetry: やり直す前に呼ぶ（計算中の印などを片付ける）。runDeep の中で呼ばれたら、そのまま fn を呼ぶ（外側がやり直す）
 * 浅い所から求め直した計算が、またその計算の中だけであふれたら（state.at の place・key が同じ。鎖が深いのではなく、
 * 1 回の計算が大きい）、onStuck(at) に直してもらう（true なら同じ計算をやり直す）。直せなければ、そのエラーを投げる
 */
export function runDeep(state, fn, onRetry, onStuck) {
  if (state.depth) return fn();
  state.depth = 1;
  const todo = [fn];
  try {
    for (let n = 0; ;) {
      state.at = null;
      state.level = 0;                           // やり直すたびに、浅い所から数える
      try {
        const v = todo[todo.length - 1]();
        const done = todo.pop();
        if (!todo.length) return v;
        const w = done.warm;                       // 先に求めた計算の順番を覚える（{ key, id, attr }。attr がなければ出力）
        if (w && !state.known.has(w.key)) {
          state.known.add(w.key);
          // 先に求めている途中（prewarmDeep）なら、いま求めている項目の手前に入れる（次のフレームで、深いものから順になる）
          if (state.insertAt >= 0) state.order.splice(state.insertAt++, 0, w);
          else state.order.push(w);
        }
      } catch (e) {
        const at = state.at;
        if (!at || !isStackOverflow(e) || ++n > MAX_RETRIES) throw e;
        state.retries++;
        if (onRetry) onRetry();
        const top = todo[todo.length - 1];
        if (top.place !== undefined && at.place === top.place && at.key === top.key) {
          if (!onStuck || !onStuck(at)) throw e;          // 進まない（同じ計算が、浅い所からでもあふれる）
          continue;
        }
        todo.push(at);
      }
    }
  } finally {
    state.depth = 0;
    state.at = null;
  }
}
