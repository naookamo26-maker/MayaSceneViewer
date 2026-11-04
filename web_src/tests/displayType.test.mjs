// テンプレート表示（Maya で灰色のワイヤーに描くもの）の判定と、カーブの色
import test from 'node:test';
import assert from 'node:assert/strict';
import { Object3D } from 'three';
import { TEMPLATE_COLOR, isTemplated } from '../src/displayType.js';
import { CURVE_COLOR, CurveOverlay } from '../src/curveOverlay.js';

test('テンプレート: 選べない理由がテンプレートか、カーブの表示の種類が 1。リファレンスは普通に描く', () => {
  assert.equal(isTemplated({ unselectable: 'テンプレート' }), true);
  assert.equal(isTemplated({ display: 1 }), true);
  assert.equal(isTemplated({ unselectable: 'リファレンス', display: 2 }), false);
  assert.equal(isTemplated({}), false);
  assert.equal(isTemplated(null), false);
});

test('カーブ: .template（祖先を含む）でテンプレートなら、色の指定があっても灰色', () => {
  const cc = [1, 1, 0, 0, 3, 2, 0, 1, 2, 0, 0, 0, 1, 0, 0];   // 次数 1・スパン 1・開いた形・3 次元・ノット 2・CV 2
  const parent = new Object3D();
  const built = { nodeObjects: [parent] };
  const ov = new CurveOverlay();
  const base = { name: 'c', path: '|t|c', transform: 0, visible: true, visibleSelf: true, cc };
  ov.build(built, [
    { ...base, color: [1, 0, 0], display: 0, unselectable: 'テンプレート' },   // 親の .template
    { ...base, color: null, display: 1, unselectable: 'テンプレート' },        // 表示の種類がテンプレート
    { ...base, color: [1, 0, 0], display: 2, unselectable: 'リファレンス' },   // リファレンスは自分の色
    { ...base, color: null, display: 0 },
  ]);
  const colors = ov.items.map((it) => it && it.line.material.color.getHex());
  assert.deepEqual(colors, [TEMPLATE_COLOR.getHex(), TEMPLATE_COLOR.getHex(), 0xff0000, CURVE_COLOR.getHex()]);
});
