// 深い再帰でスタックがあふれたときのやり直し（評価器 rig.js・計画を作る rigCompiled.js）。
//
// 評価は、必要になった値を上流へさかのぼって（再帰で）求める。計算ノード・自作ノードが長い鎖になっていると呼び出しが
// 深くなり、スタックの小さい所（Web Worker など）では「Maximum call stack size exceeded」になる。
//   * 値を覚える所（キャッシュ）は、計算の途中でスタックがあふれたら、その計算をもう一度行う関数を state.at に残す
//     （いちばん深い所が先に残し、外側は上書きしない）
//   * runDeep は、あふれたら state.at を浅いスタックから先に求めて（結果はキャッシュに残る）、元の計算をやり直す。
//     やり直すたびに、さかのぼる鎖が短くなる。計算の順番は同じなので、結果はあふれなかったときと同じ
//   * runDeep の中（state.depth > 0）では、エラーを受け止めて「値なし」にする所も、あふれのエラーは上へ渡す

/** 何回までやり直すか（終わらないときの安全のため） */
const MAX_RETRIES = 100000;

/** 値を覚える所が使う状態（評価器ごとに 1 つ。評価器を引き継いだオブジェクトも同じものを使う） */
export function newDeepState() {
  return { depth: 0, at: null, retries: 0 };
}

/**
 * スタックのあふれかもしれないエラーか（スタックの残りが少ない所でも呼べるよう、関数を呼ばずに調べる）。
 * Chromium・Safari は RangeError、Firefox は InternalError（too much recursion）
 */
export function mayOverflow(e) {
  return e instanceof RangeError || (!!e && e.name === 'InternalError');
}

/** スタックのあふれのエラーか（やり直す前に、ほかの RangeError と見分ける） */
export function isStackOverflow(e) {
  return mayOverflow(e) && /call stack|stack size|recursion/i.test(String(e.message));
}

/**
 * fn を求める。スタックがあふれたら、state.at（いちばん深い所の計算）を先に求めてから、やり直す。
 * onRetry: やり直す前に呼ぶ（計算中の印などを片付ける）。runDeep の中で呼ばれたら、そのまま fn を呼ぶ（外側がやり直す）
 */
export function runDeep(state, fn, onRetry) {
  if (state.depth) return fn();
  state.depth = 1;
  const todo = [fn];
  try {
    for (let n = 0; ;) {
      state.at = null;
      try {
        const v = todo[todo.length - 1]();
        todo.pop();
        if (!todo.length) return v;
      } catch (e) {
        const at = state.at;
        if (!at || !isStackOverflow(e) || ++n > MAX_RETRIES) throw e;
        state.retries++;
        if (onRetry) onRetry();
        todo.push(at);
      }
    }
  } finally {
    state.depth = 0;
    state.at = null;
  }
}
