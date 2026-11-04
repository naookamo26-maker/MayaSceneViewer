// スプライン IK の評価の検証（合成したシーン。サンプルのファイルは使わない）
// - ikBlend: 開始ジョイントの移動（rootOnCurve）も、回転と同じく FK の値と混ぜる
// - 上級ツイストの up ベクトルの成分（.dwux・.dwuy・.dwuz、.dwvx・.dwvy・.dwvz。「dwuv + 軸」ではない）
// - チェーンがカーブより長いとき: カーブを終端の接線の向きにまっすぐ延ばした線の上に、骨の長さを保って並べる
// - rootOnCurve がキー・接続で決まるとき: ほかのノードが読む開始ジョイントの移動も、表示と同じ値
import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { derivativeAt, parseNurbsCurve, pointAt } from '../src/curve.js';

const tr = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];

/** .cc の値（開いたカーブ・一様なノット）を CV の列から作る */
function cc(cvs, degree = 3) {
  const spans = cvs.length - degree;
  const knots = [];
  for (let i = 0; i < degree - 1; i++) knots.push(0);
  for (let i = 0; i <= spans; i++) knots.push(i);
  for (let i = 0; i < degree - 1; i++) knots.push(spans);
  return [degree, spans, 0, 0, 3, knots.length, ...knots, cvs.length, ...cvs.flat()];
}

/**
 * ジョイント 5 本（j0 は root、ほかは X に 2 ずつ）・スプライン IK のハンドル・カーブの transform のシーン。
 * handle: ハンドルの attrs に足すもの、inputs: ハンドルの inputs に足すもの、curves / values: animation.curves とキーの値
 */
function scene(cvs, { handle = {}, inputs = {}, root = [0, 0, 0], curves = [], times = [], values = [] } = {}) {
  const dag = [
    { name: 'j0', joint: true, parent: -1, t: root },
    ...[1, 2, 3, 4].map((i) => ({ name: `j${i}`, joint: true, parent: i - 1, t: [2, 0, 0] })),
    { name: 'ik', parent: -1, t: [0, 0, 0] },
    { name: 'crv', parent: -1, t: [0, 0, 0] },
  ];
  const nodes = dag.map((n) => ({ name: n.name, path: '|' + n.name, type: n.joint ? 'joint' : 'transform', parent: n.parent,
    matrix: tr(...n.t), inheritsTransform: true, visible: true }));
  const animNodes = dag.map((n, i) => ({ node: i, joint: !!n.joint, ro: 0, t: n.t.slice(), r: [0, 0, 0], s: [1, 1, 1],
    ra: [0, 0, 0], ...(n.joint ? { jo: [0, 0, 0] } : {}) }));
  const graph = [
    { id: 1, name: 'ik', type: 'ikHandle', dag: 5, attrs: { roc: 1, ...handle },
      inputs: { ic: { node: 2, attr: 'ws' }, ...inputs }, ik: { solver: 'ikSplineSolver', chain: [0, 1, 2, 3, 4] } },
    { id: 2, name: 'crvShape', type: 'nurbsCurve', dag: -1, attrs: { cc: cc(cvs) }, parent: 6 },
  ];
  const animation = { fps: 24, start: 1, end: 1, current: 1, curves, channels: [], nodes: animNodes, graph,
    times, values, tangentTypes: [], fixedTangents: [], upAxis: 'y' };
  const rig = new RigEvaluator(new AnimationClip(animation), nodes, (ni) => new Matrix4().fromArray(nodes[ni].matrix));
  rig.evaluate(1);
  return rig;
}

const pos = (rig, ni) => new Vector3().setFromMatrixPosition(rig.world(ni));
const near = (a, b, tol = 1e-6) => a.distanceTo(b) <= tol;
// 始点 (1, 1, 0) の直線のカーブ（開始ジョイント (0, 0, 0) とはずれている）
const LINE = [[1, 1, 0], [11 / 3, 1, 0], [19 / 3, 1, 0], [9, 1, 0]];

test('ikBlend: 開始ジョイントの移動も FK の値と混ぜる（0 なら FK のまま、カーブに付けない）', () => {
  const at = (ikb) => scene(LINE, { handle: { ikb } });
  assert.ok(near(pos(at(1), 0), new Vector3(1, 1, 0)), 'ikBlend 1: カーブの始点');
  assert.ok(near(pos(at(0.5), 0), new Vector3(0.5, 0.5, 0)), 'ikBlend 0.5: FK の位置とカーブの始点の中間');
  const fk = at(0);
  for (let i = 0; i < 5; i++) assert.ok(near(pos(fk, i), new Vector3(2 * i, 0, 0)), `ikBlend 0: j${i} は FK の位置 ${pos(fk, i).toArray()}`);
});

test('上級ツイストの up ベクトルは、成分（.dwux など）で書かれていても・つながっていても読む', () => {
  const yAxis = (rig, ni = 0) => new Vector3().setFromMatrixColumn(rig.world(ni), 1);
  const adv = { dtce: 1, dwut: 5, dwua: 0 };                       // Vector・up 軸 +Y
  const whole = scene(LINE, { handle: { ...adv, dwuv: [0, 0, 1] } });
  assert.ok(near(yAxis(whole), new Vector3(0, 0, 1)), '基準: まとめた値（.dwuv）');
  const comp = scene(LINE, { handle: { ...adv, dwux: 0, dwuy: 0, dwuz: 1 } });
  assert.ok(near(yAxis(comp), new Vector3(0, 0, 1)), `成分の値: ${yAxis(comp).toArray()}`);
  // 成分への接続（キー。値 1）: Y 成分は既定値 1 のままにならないよう、ファイルの値 0 を入れておく
  const keyed = scene(LINE, { handle: { ...adv, dwuy: 0 }, inputs: { dwuz: { curve: 0 } },
    curves: [{ name: 'ik_dwuz', type: 'TU', count: 1, offset: 0 }], times: [1], values: [1] });
  assert.ok(near(yAxis(keyed), new Vector3(0, 0, 1)), `成分への接続: ${yAxis(keyed).toArray()}`);
  // 始点と終点（Vector (Start/End)）: 終点の up は .dwvx・.dwvy・.dwvz
  const se = scene(LINE, { handle: { dtce: 1, dwut: 6, dwua: 0, dwuv: [0, 1, 0], dwvx: 0, dwvy: 0, dwvz: 1 } });
  assert.ok(near(yAxis(se, 3), new Vector3(0, 0, 1), 1e-4), `終点の up（成分）: ${yAxis(se, 3).toArray()}`);
});

test('チェーンがカーブより長いとき、カーブの先のジョイントは終端の接線を延ばした線の上（骨の長さを保つ）', () => {
  const cvs = [[0, 0, 0], [2, 0, 0], [3, 0, 0], [3.5, 1.5, 0]];   // 長さ約 4.4。終わりで上へ曲がる
  const rig = scene(cvs);
  const c = parseNurbsCurve(cc(cvs));
  const end = pointAt(c, 1), dir = derivativeAt(c, 1).normalize();
  const offLine = (p) => { const d = p.clone().sub(end); return d.addScaledVector(dir, -d.dot(dir)).length(); };
  for (const i of [3, 4]) {
    const p = pos(rig, i);
    assert.ok(offLine(p) < 1e-6, `j${i} が延長線の上 ${p.toArray()}（ずれ ${offLine(p)}）`);
    assert.ok(p.clone().sub(end).dot(dir) > 0, `j${i} はカーブの終端より先`);
  }
  for (let i = 1; i < 5; i++) {
    const L = pos(rig, i).distanceTo(pos(rig, i - 1));
    assert.ok(Math.abs(L - 2) < 1e-6, `骨 ${i} の長さ ${L}`);
  }
});

test('rootOnCurve がキーで決まるとき、ほかのノードが読む開始ジョイントの移動も表示と同じ', () => {
  const on = scene(LINE, { handle: { roc: 0 }, inputs: { roc: { curve: 0 } },
    curves: [{ name: 'ik_roc', type: 'TU', count: 1, offset: 0 }], times: [1], values: [1] });
  const shown = pos(on, 0);
  assert.ok(near(shown, new Vector3(1, 1, 0)), `表示はカーブの始点 ${shown.toArray()}`);
  assert.ok(near(new Vector3(...on.dagPlug(0, 't')), shown), `.t（ほかのノードが読む値） ${on.dagPlug(0, 't')}`);
  assert.ok(near(on.pivotWorld(0), shown), `コンストレイントのターゲットの位置 ${on.pivotWorld(0).toArray()}`);
  // キーの値が 0（オフ）なら、移動は FK のまま
  const off = scene(LINE, { handle: { roc: 1 }, inputs: { roc: { curve: 0 } },
    curves: [{ name: 'ik_roc', type: 'TU', count: 1, offset: 0 }], times: [1], values: [0] });
  assert.ok(near(pos(off, 0), new Vector3(0, 0, 0)) && near(new Vector3(...off.dagPlug(0, 't')), new Vector3(0, 0, 0)));
});
