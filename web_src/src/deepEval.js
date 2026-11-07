// 深い再帰でスタックがあふれたときのやり直し（評価器 rig.js・計画を作る rigCompiled.js）。
//
// 評価は、必要になった値を上流へさかのぼって（再帰で）求める。計算ノード・自作ノードが長い鎖になっていると呼び出しが
// 深くなり、スタックの小さい所（Web Worker など）では「Maximum call stack size exceeded」になる。
//   * 値を覚える所（キャッシュ）は、計算の途中でスタックがあふれたら、その計算をもう一度行う関数を state.at に残す
//     （いちばん深い所が先に残し、外側は上書きしない）
//   * runDeep は、あふれたら state.at を浅いスタックから先に求めて（結果はキャッシュに残る）、元の計算をやり直す。
//     やり直すたびに、さかのぼる鎖が短くなる。計算の順番は同じなので、結果はあふれなかったときと同じ
//   * runDeep の中（state.depth > 0）では、エラーを受け止めて「値なし」にする所も、あふれのエラーは上へ渡す
//   * 先に求めた計算ノードの出力（state.at.outId）は、求め終えた順に state.order に覚える。次のフレームからは、評価の初めに
//     その順で先に求めておく（rig.js の prewarmDeep）。深い所から順に求まっているので、毎フレームあふれ直さない

/** 何回までやり直すか（終わらないときの安全のため） */
const MAX_RETRIES = 100000;

/** 値を覚える所が使う状態（評価器ごとに 1 つ。評価器を引き継いだオブジェクトも同じものを使う） */
export function newDeepState() {
  return { depth: 0, at: null, retries: 0, order: [], known: new Set(), marks: [] };
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
      try {
        const v = todo[todo.length - 1]();
        const done = todo.pop();
        if (!todo.length) return v;
        if (done.outId !== undefined && !state.known.has(done.outId)) {   // 先に求めた計算ノードの出力の順番を覚える
          state.known.add(done.outId);
          state.order.push(done.outId);
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
