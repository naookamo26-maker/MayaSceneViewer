// テストの補助: 評価の結果をまとめた値を、32 ビットに丸めた分の違いを許して比べる（cache.test.mjs・bakeWorker.test.mjs）
import assert from 'node:assert/strict';

/**
 * 2 つの値（評価の結果をまとめたものなど）が同じか。数はごく近ければよい（再生キャッシュは行列を 32 ビットの数で持つので、
 * キャッシュから読んだ値と新しく評価した値は、32 ビットに丸めた分だけ違う）。数以外・形は同じであること
 */
const TOL = 1e-5;
export function near(actual, expected, msg = '', at = '') {
  if (typeof expected === 'number' && typeof actual === 'number') {
    const ok = actual === expected || Math.abs(actual - expected) <= TOL * (1 + Math.abs(expected));
    assert.ok(ok, `${msg}${at}: ${actual} と ${expected}`);
  } else if (Array.isArray(expected) && Array.isArray(actual)) {
    assert.equal(actual.length, expected.length, `${msg}${at}: 長さ`);
    expected.forEach((x, i) => near(actual[i], x, msg, `${at}[${i}]`));
  } else if (expected && typeof expected === 'object' && actual && typeof actual === 'object') {
    assert.deepEqual(Object.keys(actual), Object.keys(expected), `${msg}${at}: キー`);
    for (const k of Object.keys(expected)) near(actual[k], expected[k], msg, `${at}.${k}`);
  } else {
    assert.deepEqual(actual, expected, `${msg}${at}`);
  }
}
