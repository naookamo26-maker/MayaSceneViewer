// ハンドルのロックした軸（灰色で表示し、つかめない）の判定
import test from 'node:test';
import assert from 'node:assert/strict';
import { commonLocks, handleLocked } from '../src/gizmoLocks.js';

test('1 軸のハンドルは、その軸がロックなら動かせない', () => {
  const locks = [true, false, false];
  assert.equal(handleLocked('X', locks), true);
  assert.equal(handleLocked('Y', locks), false);
  assert.equal(handleLocked('Z', locks), false);
});

test('平面・中央のハンドルは、含む軸がすべてロックのときだけ動かせない（一部なら結果で固定する）', () => {
  assert.equal(handleLocked('XY', [true, false, false]), false);
  assert.equal(handleLocked('XY', [true, true, false]), true);
  assert.equal(handleLocked('XYZ', [true, true, false]), false);
  assert.equal(handleLocked('XYZ', [true, true, true]), true);
});

test('視点の向きの回転（E）・自由回転（XYZE）は、3 軸ともロックのときだけ', () => {
  assert.equal(handleLocked('E', [true, true, false]), false);
  assert.equal(handleLocked('XYZE', [true, true, false]), false);
  assert.equal(handleLocked('E', [true, true, true]), true);
  assert.equal(handleLocked('XYZE', [true, true, true]), true);
});

test('ロックがなければ、どのハンドルも動かせる', () => {
  for (const name of ['X', 'Y', 'Z', 'XY', 'YZ', 'XZ', 'XYZ', 'E', 'XYZE']) {
    assert.equal(handleLocked(name, null), false);
    assert.equal(handleLocked(name, [false, false, false]), false);
  }
});

test('複数のノードを一緒に動かすとき: すべてのノードでロックしている軸だけを灰色にする', () => {
  assert.equal(commonLocks([[true, false, false], null]), null);                  // ほかのノードは X に動かせる
  assert.deepEqual(commonLocks([[true, true, false], [true, false, false]]), [true, false, false]);
  assert.deepEqual(commonLocks([[true, true, true]]), [true, true, true]);
  assert.equal(commonLocks([]), null);
  assert.equal(commonLocks([null, null]), null);
});
