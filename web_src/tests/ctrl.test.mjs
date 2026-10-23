// 第 5 段階（NURBS カーブの表示・上級ツイストの見直し）の検証
// 前提: python tools/make_ctrl_sample.py（samples/ctrl_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Group, Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { CurveOverlay, CURVE_COLOR, curveFromEntry, curvePoints } from '../src/curveOverlay.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/ctrl_sample.json'), 'utf8'));
const ik = JSON.parse(readFileSync(path.resolve(here, '../../samples/ik_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const curveOf = (n) => data.curves.find((c) => c.name === n);
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-4) => a.distanceTo(b) <= tol;

function at(d, f) {
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}
const axis = (m, k) => new Vector3().setFromMatrixColumn(m, k).normalize();

test('カーブの読み取り: 周期的な円は閉じ、.cp の調整を足す', () => {
  const circle = curveFromEntry(curveOf('ctrl_circleShape'));
  const pts = curvePoints(circle);
  assert.ok(nearVec(pts[0], pts[pts.length - 1], 1e-6), '円が閉じている');
  for (const p of pts) assert.ok(near(p.y, 0, 1e-9));
  const r = pts.map((p) => Math.hypot(p.x, p.z));
  assert.ok(Math.max(...r) - Math.min(...r) < 0.15 * Math.max(...r), '円に近い');
  // 1 次の閉じた四角形は CV をそのまま結ぶ
  const sq = curvePoints(curveFromEntry(curveOf('ctrl_squareShape')));
  assert.equal(sq.length, 5);
  const tw = curveFromEntry(curveOf('ctrl_tweakShape'));
  assert.ok(nearVec(tw.cvs[1], new Vector3(1, 2, 0)), 'CV 1 に (0, 2, 0) を足す');
});

test('カーブの出力: 色・表示状態・中間オブジェクト', () => {
  assert.deepEqual(curveOf('ctrl_circleShape').color, [1, 1, 0]);
  assert.deepEqual(curveOf('ctrl_squareShape').color, [0.2, 0.9, 0.5]);
  assert.deepEqual(curveOf('ctrl_layerShape').color, [1, 0, 0]);
  assert.equal(curveOf('ctrl_tmplShape').display, 1);
  assert.equal(curveOf('ctrl_hiddenShape').visible, false);
  assert.equal(data.curves.filter((c) => c.transform === idx('ctrl_multi')).length, 2);
  assert.equal(curveOf('ctrl_ioonlyShape'), undefined);
  assert.ok(!names.includes('ctrl_ioonly'), '表示するカーブがない transform は出力しない');
});

test('CurveOverlay: transform の子に線を置き、表示・選択・形の差し替えができる', () => {
  const nodeObjects = data.nodes.map(() => new Group());
  const ov = new CurveOverlay();
  const built = { nodeObjects };
  ov.build(built, data.curves);
  const ci = data.curves.indexOf(curveOf('ctrl_circleShape'));
  const it = ov.items[ci];
  assert.equal(it.line.parent, nodeObjects[idx('ctrl_circle')]);
  assert.ok(ov.hasCurve(idx('ctrl_circle')) && !ov.hasCurve(idx('arm_a')));
  assert.equal(ov.items[data.curves.indexOf(curveOf('ctrl_hiddenShape'))].line.visible, false);
  const plain = ov.items[data.curves.indexOf(curveOf('ctrl_tweakShape'))];
  assert.ok(plain.line.material.color.equals(CURVE_COLOR));
  ov.setSelected(idx('ctrl_circle'));
  assert.ok(!it.line.material.color.equals(it.color));
  ov.setSelected(-1);
  assert.ok(it.line.material.color.equals(it.color));
  const hidden = data.nodes.map((n, i) => i === idx('ctrl_circle'));
  ov.setHiddenNodes(hidden);
  assert.equal(it.line.visible, false);
  ov.setHiddenNodes(null);
  ov.setVisible(false);
  assert.equal(it.line.visible, false);
  ov.setVisible(true);
  assert.ok(built.curveItems === ov.items);
  ov.clear();
  assert.equal(it.line.parent, null);
});

test('リグで形が変わるカーブ: グラフの shape がカーブの番号を指し、変形した形を返す', () => {
  const g = ik.animation.graph.find((x) => x.name === 'spA_curveShape');
  const c = ik.curves[g.shape];
  assert.equal(c.name, 'spA_curveShape');
  assert.ok(c.fromInput, '保存されていない形は、変形前の形（Orig）を使う');
  const rig = at(ik, 48);
  const deformed = rig.plug(g.id, 'local');
  const base = curveFromEntry(c);
  assert.ok(deformed.cvs[3].distanceTo(base.cvs[3]) > 1, 'フレーム 48 では先端が動いている');
  assert.ok(nearVec(at(ik, 1).plug(g.id, 'local').cvs[3], base.cvs[3]), '保存時のフレームでは変形前と同じ');
});

test('保存時のフレームでは、動くノードがファイルの値を再現する', () => {
  const rig = at(data, 1);
  for (const [ni, m] of rig.matrices) {
    const file = data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(near(v, file[k], 1e-4), `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
  assert.equal(rig.problems.size, 0, [...rig.problems].join());
});

test('コントローラーの回転がジョイントに伝わる（カーブのコントローラー）', () => {
  const q = new Quaternion();
  at(data, 48).world(idx('arm_a')).decompose(new Vector3(), q, new Vector3());
  assert.ok(1 - Math.abs(q.dot(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2))) < 1e-6);
});

test('上級ツイスト（ベクトル・始点と終点）: 170° のひねりを均等に配る（途中で反転しない）', () => {
  const rig = at(data, 1);
  const step = 170 / 3 * Math.PI / 180;
  for (let i = 0; i < 4; i++) {
    const z = axis(rig.world(idx(`spC_${i}`)), 2);
    const a = step * i;
    assert.ok(nearVec(z, new Vector3(0, -Math.sin(a), Math.cos(a))), `spC_${i} の Z 軸 ${z.toArray()}`);
    assert.ok(nearVec(axis(rig.world(idx(`spC_${i}`)), 0), new Vector3(1, 0, 0)));
  }
});

test('上級ツイストの up 軸: Closest Y は近い方（下向きのまま）、Positive Y は上に向ける', () => {
  const rig = at(data, 1);
  for (let i = 0; i < 4; i++) {
    assert.ok(nearVec(axis(rig.world(idx(`spD_${i}`)), 1), new Vector3(0, -1, 0)), `spD_${i}`);
    assert.ok(nearVec(axis(rig.world(idx(`spE_${i}`)), 1), new Vector3(0, 1, 0)), `spE_${i}`);
  }
});
