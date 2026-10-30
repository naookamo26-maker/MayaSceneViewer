// ポーズ確認の追加分を、Maya のチャンネルの一部（ロックした属性・キーのある属性）を固定したものにする（fixChannels）
import test from 'node:test';
import assert from 'node:assert/strict';
import { Euler, Matrix4, Quaternion } from 'three';
import { composeLocalMatrix, decomposeMaya, mayaEuler } from '../src/animation.js';

const D2R = Math.PI / 180;
import { fixChannels, hasFixed, poseMatrix } from '../src/pose.js';

const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const sameQ = (a, b) => near(Math.abs(a.dot(b)), 1, 1e-9);
const frame = { ro: 2, jo: [0, 0, 45], ra: [0, 10, 0] };
const base = composeLocalMatrix({ t: [1, 2, 3], r: [10, 20, 30], s: [1, 2, 1], ro: 2, jo: [0, 0, 45], ra: [0, 10, 0], joint: true }, null);
const pose = { t: [0.5, -1, 2], r: [15, -20, 5], s: [1.2, 1, 0.8] };
const local = (p) => decomposeMaya(base.clone().multiply(poseMatrix(p, new Matrix4())));

test('固定がなければ追加分はそのまま', () => {
  assert.equal(fixChannels(base, pose, null, frame), pose);
  assert.equal(hasFixed({ t: [false, false, false] }), false);
  assert.equal(hasFixed({ r: [false, true, false] }), true);
});

test('すべて固定すれば追加分は単位（軸ごとに違うスケールの基準でも）', () => {
  const p = fixChannels(base, pose, { t: [1, 1, 1], r: [1, 1, 1], s: [1, 1, 1] }, frame);
  for (const k of ['t', 'r']) p[k].forEach((v) => assert.ok(near(v, 0, 1e-9), `${k} ${p[k]}`));
  p.s.forEach((v) => assert.ok(near(v, 1, 1e-9), `s ${p.s}`));
});

test('回転だけ固定: 回転は基準のまま、位置とスケールは動かした値', () => {
  const a = local(fixChannels(base, pose, { r: [1, 1, 1] }, frame)), b = decomposeMaya(base), c = local(pose);
  assert.ok(sameQ(a.q, b.q));
  assert.ok(a.t.distanceTo(c.t) < 1e-9);
  a.s.toArray().forEach((v, i) => assert.ok(near(v, b.s.getComponent(i) * pose.s[i]), `${a.s.toArray()}`));
});

test('移動 X だけ固定（親の空間の値）: X は基準、Y・Z・回転は動かした値', () => {
  const uni = composeLocalMatrix({ t: [1, 2, 3], r: [10, 20, 30], s: [1, 1, 1], ro: 0, joint: true }, null);
  const fixedP = fixChannels(uni, pose, { t: [1, 0, 0] }, {});
  const a = decomposeMaya(uni.clone().multiply(poseMatrix(fixedP, new Matrix4())));
  const c = decomposeMaya(uni.clone().multiply(poseMatrix(pose, new Matrix4())));
  assert.ok(near(a.t.x, 1) && near(a.t.y, c.t.y) && near(a.t.z, c.t.z));
  assert.ok(sameQ(a.q, c.q) && a.s.distanceTo(c.s) < 1e-9);
});

test('回転の値の一部だけ固定: 固定した成分（jointOrient・rotateAxis を除いた回転の値）は基準のまま', () => {
  // 回転の値 = jo⁻¹ · 回転 · ra⁻¹ を回転順 zxy（ro 2）で分けた角度。rx を固定する
  const uni = composeLocalMatrix({ t: [1, 2, 3], r: [10, 20, 30], s: [1, 1, 1], ro: 2, jo: [0, 0, 45], ra: [0, 10, 0], joint: true }, null);
  const value = (m) => {
    const q = decomposeMaya(m).q;
    const jo = new Quaternion().setFromEuler(new Euler(0, 0, 45 * D2R, 'ZYX'));
    const ra = new Quaternion().setFromEuler(new Euler(0, 10 * D2R, 0, 'ZYX'));
    return mayaEuler(jo.invert().multiply(q).multiply(ra.invert()), 2).map((v) => v / D2R);
  };
  const p = fixChannels(uni, pose, { r: [1, 0, 0] }, frame);
  const after = value(uni.clone().multiply(poseMatrix(p, new Matrix4())));
  const edited = value(uni.clone().multiply(poseMatrix(pose, new Matrix4())));
  assert.ok(near(after[0], 10, 1e-7), `rx ${after}`);
  assert.ok(!near(edited[0], 10, 1e-3), '動かした値は rx も変わっている');
  const again = fixChannels(uni, p, { r: [1, 0, 0] }, frame);    // 固定済みのものをもう一度固定しても変わらない
  for (const k of ['t', 'r', 's']) p[k].forEach((v, i) => assert.ok(near(v, again[k][i], 1e-7), `${k}`));
});
