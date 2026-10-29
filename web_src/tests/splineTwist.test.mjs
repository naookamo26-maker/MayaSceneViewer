// スプライン IK のひねり（Maya の ikHandle の資料に合わせたもの）の検証
// ロール（度）・ひねりの配り方（twistType・rootTwistMode）・上級ツイストでのロールとひねりの値（Total・Start/End）・前向きの軸（.dpa）
// 前提: python tools/make_ik_sample.py（samples/ik_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = readFileSync(path.resolve(here, '../../samples/ik_sample.json'), 'utf8');
const D2R = Math.PI / 180;

/** ハンドル name の属性を attrs で書き換えて評価し、チェーンの各ジョイントのワールド行列を返す */
function solve(name, attrs) {
  const d = JSON.parse(base);
  const g = d.animation.graph.find((x) => x.name === name);
  g.attrs = { ...(g.attrs || {}), ...attrs };
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  rig.evaluate(d.animation.current ?? 1);
  return g.ik.chain.map((ni) => rig.world(ni).clone());
}

/** 2 つの結果の、骨ごとの骨の軸まわりのひねりの差（度。開始から終端の手前まで） */
function twistDiff(a, b) {
  const out = [];
  for (let i = 0; i < a.length - 1; i++) {
    const pa = new Vector3().setFromMatrixPosition(a[i]), pb = new Vector3().setFromMatrixPosition(b[i]);
    assert.ok(pa.distanceTo(pb) < 1e-6, 'ひねりで位置は変わらない');
    const dir = new Vector3().setFromMatrixPosition(a[i + 1]).sub(pa).normalize();
    const qa = new Quaternion().setFromRotationMatrix(new Matrix4().extractRotation(a[i]));
    const qb = new Quaternion().setFromRotationMatrix(new Matrix4().extractRotation(b[i]));
    const dq = qa.multiply(qb.invert());
    const ang = 2 * Math.atan2(new Vector3(dq.x, dq.y, dq.z).dot(dir), dq.w) / D2R;
    out.push(((ang + 540) % 360) - 180);
  }
  return out;
}
const near = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol;
const nearList = (xs, ys, tol = 1e-3) => xs.length === ys.length && xs.every((x, i) => near(x, ys[i], tol));

test('ロールは度で読み、チェーン全体を回す（上級ツイストなし）', () => {
  const d = twistDiff(solve('spA_ik', { rol: 30 }), solve('spA_ik', {}));
  assert.ok(nearList(d, d.map(() => 30)), JSON.stringify(d));
});

test('ひねりの配り方: リニアは終端で合計、イーズインは終端側で多く、Root Twist Mode は開始ジョイントもひねる', () => {
  const zero = solve('spA_ik', {});
  const lin = twistDiff(solve('spA_ik', { twi: 60 }), zero);
  const n = lin.length;
  assert.ok(nearList(lin, lin.map((_, i) => 60 * i / (n - 1))), 'リニア（開始ジョイントは 0）: ' + JSON.stringify(lin));
  const easeIn = twistDiff(solve('spA_ik', { twi: 60, twt: 1 }), zero);
  assert.ok(near(easeIn[0], 0) && near(easeIn[n - 1], 60), JSON.stringify(easeIn));
  for (let i = 1; i < n - 1; i++) assert.ok(easeIn[i] < lin[i] - 1e-6, 'イーズインは途中が少ない');
  const easeOut = twistDiff(solve('spA_ik', { twi: 60, twt: 2 }), zero);
  for (let i = 1; i < n - 1; i++) assert.ok(easeOut[i] > lin[i] + 1e-6, 'イーズアウトは途中が多い');
  const root = twistDiff(solve('spA_ik', { twi: 60, rtm: 1 }), zero);
  assert.ok(nearList(root, root.map((_, i) => 60 * (i + 1) / n)), 'Root Twist Mode: ' + JSON.stringify(root));
});

test('上級ツイスト: ロールとひねり（Total）を up ベクトルの向きに足す', () => {
  const zero = solve('spB_ik', {});
  const d = twistDiff(solve('spB_ik', { twi: 60, rol: 10 }), zero);
  const n = d.length;
  assert.ok(nearList(d, d.map((_, i) => 10 + 60 * i / (n - 1))), JSON.stringify(d));
});

test('上級ツイスト: Start/End は始点・終点の値（度）の間を配る', () => {
  const zero = solve('spB_ik', {});
  const d = twistDiff(solve('spB_ik', { dtvt: 1, dtse: [10, 50] }), zero);
  const n = d.length;
  assert.ok(nearList(d, d.map((_, i) => 10 + 40 * i / (n - 1))), JSON.stringify(d));
  const d2 = twistDiff(solve('spB_ik', { dtvt: 1, dtst: 10, dten: 50 }), zero);
  assert.ok(nearList(d2, d), '成分（.dtst・.dten）で書かれていても同じ');
  const off = twistDiff(solve('spB_ik', { dtvt: 1, dtse: [10, 50], dtce: 0 }), solve('spB_ik', { dtce: 0 }));
  assert.ok(nearList(off, off.map(() => 0)), '上級ツイストがオフなら使わない');
});

test('前向きの軸は .dpa（Maya の技術資料の短い名前）。古い .dfa も読む', () => {
  const byDpa = solve('spB_ik', { dfa: undefined, dpa: 2 });
  const byDfa = solve('spB_ik', { dfa: 2 });
  const def = solve('spB_ik', {});
  for (let i = 0; i < byDpa.length; i++) assert.ok(byDpa[i].equals(byDfa[i]), `ジョイント ${i}`);
  assert.ok(!byDpa[0].equals(def[0]), '前向きの軸を変えると向きが変わる');
});
