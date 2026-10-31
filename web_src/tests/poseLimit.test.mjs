// ポーズ確認で動かした分を、チャンネルの値（ほかのノードが読む移動・回転・スケール）に入れ、制限（limit）の範囲に収める
// 前提: python tools/make_dag_attrs_sample.py（samples/dag_attrs_sample.json）・python tools/make_exprespy_sample.py
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip, composeLocalMatrix, poseChannels } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { limitPose, nodeChannels, poseMatrix } from '../src/pose.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const sameM = (a, b, tol = 1e-9) => a.elements.every((v, i) => near(v, b.elements[i], tol));
const POSE = { t: [0.5, -1, 2], r: [15, -20, 35], s: [1.5, 1.5, 1.5] };

function rigOf(data) {
  const idx = (n) => { const i = data.nodes.findIndex((x) => x.name === n); assert.ok(i >= 0, n); return i; };
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  const pos = (n) => new Vector3().setFromMatrixPosition(rig.world(idx(n)));
  return { rig, idx, pos };
}

test('poseChannels: ローカル行列 · 追加分 と同じ行列になる値（ピボット・rotateAxis・jointOrient・opm・親のスケールの打ち消し）', () => {
  const opm = new Matrix4().makeTranslation(1, -2, 0.5).multiply(new Matrix4().makeRotationY(0.4)).toArray();
  const cases = [
    [{ t: [1, 2, 3], r: [10, 20, 30], s: [1, 1, 1], ro: 2, rp: [0.5, 1, -1], sp: [0.5, 1, -1], rpt: [0.1, 0, 0], ra: [0, 10, 0] }, null],
    [{ t: [1, 2, 3], r: [10, -40, 30], s: [2, 2, 2], ro: 4, jo: [0, 0, 45], ra: [5, 0, 0], joint: true }, [2, 1, 0.5]],
    [{ t: [0, 1, 0], r: [0, 0, 0], s: [1, 1, 1], ro: 0, opm, rp: [0, 2, 0], sp: [0, 2, 0] }, null],
  ];
  const D = poseMatrix(POSE, new Matrix4());
  for (const [c, isScale] of cases) {
    const want = composeLocalMatrix(c, isScale, new Matrix4()).multiply(D);
    const got = composeLocalMatrix(poseChannels(c, isScale, D), isScale, new Matrix4());
    assert.ok(sameM(got, want), JSON.stringify(c));
  }
});

test('limitPose: 制限の範囲の外の成分を端の値にする（範囲の中ならそのまま）', () => {
  const c = { t: [1, 0, 0], r: [0, 0, 0], s: [1, 1, 1], ro: 0, rp: [0, 1, 0], sp: [0, 1, 0], lim: { t: [[null, null, null], [2, null, null]], r: [[null, null, null], [null, null, 45]] } };
  const inside = { t: [0.5, 3, 0], r: [0, 0, 20], s: [1, 1, 1] };
  assert.equal(limitPose(c, null, inside), inside);
  const p = limitPose(c, null, { t: [5, 3, 0], r: [10, 0, 90], s: [1, 1, 1] });
  const v = poseChannels(c, null, poseMatrix(p, new Matrix4()));
  assert.ok(near(v.t[0], 2) && near(v.r[2], 45) && near(v.r[0], 10), JSON.stringify(v));
});

test('nodeChannels: リグで動かないノードの制限（limS の rx は最大 30 度。ファイルの 90 度も収める）', () => {
  const data = load('dag_attrs_sample.json');
  const n = data.nodes.find((x) => x.name === 'limS');
  const c = nodeChannels(n);
  assert.ok(near(c.r[0], 30));
  assert.ok(sameM(composeLocalMatrix(c, null, new Matrix4()), new Matrix4().fromArray(n.matrix), 1e-6));
  const p = limitPose(c, null, { t: [0, 0, 0], r: [40, 0, 0], s: [1, 1, 1] });
  assert.ok(near(poseChannels(c, null, poseMatrix(p, new Matrix4())).r[0], 30));
  assert.equal(nodeChannels(data.nodes.find((x) => x.name === 'ctrl')), null);
});

test('ポーズ確認で動かしたコントローラーの値を、接続先が読む（制限の範囲に収める）', () => {
  const { rig, idx, pos } = rigOf(load('dag_attrs_sample.json'));
  const ctrl = idx('ctrl'), lim = idx('lim');
  rig.evaluate(1);
  assert.ok(near(rig.chan(lim).t[0], 0));
  const moveBy = (x) => { const d = new Matrix4().makeTranslation(x, 0, 0); rig.evaluate(1, (ni) => (ni === ctrl ? d : null), undefined, {}); };
  moveBy(1.5);
  assert.ok(near(rig.posedChan(ctrl).t[0], 1.5));
  assert.ok(near(pos('limC').x, 2.5), `${pos('limC').toArray()}`);       // lim.tx = 1.5、子は X に +1
  moveBy(5);
  assert.ok(near(pos('limC').x, 3), `${pos('limC').toArray()}`);         // lim.tx は最大 2
});

test('ポーズ確認で動かした分も、そのノードの制限の範囲に収める（リグで値の決まるノード）', () => {
  const { rig, idx, pos } = rigOf(load('dag_attrs_sample.json'));
  const lim = idx('lim');
  const d = new Matrix4().makeTranslation(5, 0, 0);
  rig.evaluate(1, (ni) => (ni === lim ? d : null), undefined, {});
  assert.ok(near(rig.posedChan(lim).t[0], 2));
  assert.ok(near(pos('limC').x, 3), `${pos('limC').toArray()}`);
});

test('exprespy の入力: ポーズ確認で動かしたノードの移動の値を読む', () => {
  const { rig, idx, pos } = rigOf(load('exprespy_sample.json'));
  const src = idx('src');
  rig.evaluate(1);
  const before = pos('posCnst').clone(), jl = rig.chan(idx('jL')).t[0];
  const d = new Matrix4().makeTranslation(5, 0, 0);
  rig.evaluate(1, (ni) => (ni === src ? d : null), undefined, {});
  assert.ok(pos('posCnst').distanceTo(before) > 1, `${before.toArray()} → ${pos('posCnst').toArray()}`);
  assert.ok(!near(rig.chan(idx('jL')).t[0], jl));
});

test('コンストレイント: ポーズ確認で動かしたターゲットに追従する（ターゲット自身の移動・回転）', () => {
  const { rig, idx } = rigOf(load('constraint_space_sample.json'));
  const D = new Matrix4().compose(new Vector3(0.5, 0.7, 0.3), new Quaternion().setFromAxisAngle(new Vector3(1, 0.3, 0).normalize(), 0.3), new Vector3(1, 1, 1));
  const rel = (kind, c, t) => {
    const T = rig.world(idx(t)), C = rig.world(idx(c));
    if (kind === 'point') return new Vector3().setFromMatrixPosition(C).sub(rig.pivotWorld(idx(t))).toArray();
    const tq = new Quaternion().setFromRotationMatrix(new Matrix4().extractRotation(T));
    const cq = new Quaternion().setFromRotationMatrix(new Matrix4().extractRotation(C));
    if (kind === 'orient') return tq.invert().multiply(cq).toArray();
    return T.clone().invert().multiply(C).toArray();
  };
  for (const [kind, c, t] of [['parent', 'lrJ', 'lrT'], ['orient', 'raJ', 'ctrl'], ['point', 'opmJ', 'tgtA']]) {
    rig.evaluate(1);
    const a = rel(kind, c, t);
    rig.evaluate(1, (ni) => (ni === idx(t) ? D : null), undefined, {});
    const b = rel(kind, c, t);
    a.forEach((v, i) => assert.ok(Math.abs(Math.abs(v) - Math.abs(b[i])) < 1e-6, `${kind} ${c} ← ${t}: ${a} / ${b}`));
  }
});
