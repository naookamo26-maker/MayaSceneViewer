// 骨ごとに伸び縮みするスプライン IK（カーブ上の点どうしの距離 → ジョイントのスケール）の評価の検証
// 前提: python tools/make_stretch_spline_sample.py（samples/stretch_spline_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { pointAt } from '../src/curve.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/stretch_spline_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const gid = (n) => data.animation.graph.find((g) => g.name === n).id;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('骨ごとの伸び: ジョイントはカーブの上のパラメータ 0・0.25・0.5・0.75・1 の点に乗る', () => {
  for (const f of [1, 24, 48]) {
    const rig = at(f);
    const crv = rig.plug(gid('sb_crvShape'), 'ws');
    for (let i = 0; i < 5; i++) {
      const p = new Vector3().setFromMatrixPosition(rig.world(idx(`sb_${i}`)));
      const q = pointAt(crv, i / 4);
      assert.ok(p.distanceTo(q) < 0.02, `フレーム ${f}: sb_${i} ${p.toArray()} ≠ ${q.toArray()}`);
    }
  }
});

test('保存時のフレームは、ファイルの値を再現する', () => {
  const rig = at(1);
  for (const [ni, m] of rig.matrices) {
    const fr = rig.fileRestLocal(ni);
    const file = fr ? fr.elements : data.nodes[ni].matrix;
    m.elements.forEach((v, k) => assert.ok(Math.abs(v - file[k]) < 1e-4, `${names[ni]}[${k}] ${v} != ${file[k]}`));
  }
});

// 伸び縮みするジョイントの子の、型を知らないノード（親のスケールを打ち消す自作の transform）
const mapped = JSON.parse(readFileSync(path.resolve(here, '../../samples/stretch_spline_mapped.json'), 'utf8'));

/** 行列の 3 つの軸（列）どうしの内積の大きさの最大（0 ならゆがみがない） */
function skew(m) {
  const e = m.elements;
  const c = [0, 4, 8].map((k) => new Vector3(e[k], e[k + 1], e[k + 2]).normalize());
  return Math.max(Math.abs(c[0].dot(c[1])), Math.abs(c[0].dot(c[2])), Math.abs(c[1].dot(c[2])));
}

function atData(d, f) {
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('親のスケールを打ち消すと指定した自作ノード: ゆがまず、コンストレイントで付くジョイントの向きが合う', () => {
  const ix = (d, n) => d.nodes.findIndex((x) => x.name === n);
  for (const f of [24, 48]) {
    const rig = atData(mapped, f);
    const comp = rig.world(ix(mapped, 'sb_comp'));
    const p = new Vector3(), q = new Quaternion(), s = new Vector3();
    comp.decompose(p, q, s);
    assert.ok(Math.abs(s.x - 1) < 1e-6 && Math.abs(s.y - 1) < 1e-6 && Math.abs(s.z - 1) < 1e-6, `フレーム ${f}: スケール ${s.toArray()}`);
    assert.ok(skew(comp) < 1e-6, `フレーム ${f}: ゆがみ ${skew(comp)}`);
    // 位置は親のジョイント sb_1 と同じ（移動 0）、向きは sb_1 の向き · (0, 30, 0)
    const parent = rig.world(ix(mapped, 'sb_1'));
    const pp = new Vector3(), pq = new Quaternion(), ps = new Vector3();
    parent.decompose(pp, pq, ps);
    assert.ok(ps.x < 0.999 || ps.x > 1.001, `フレーム ${f}: 親が伸び縮みしている ${ps.toArray()}`);
    assert.ok(p.distanceTo(pp) < 1e-6);
    const want = pq.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 6));
    assert.ok(Math.abs(Math.abs(q.dot(want)) - 1) < 1e-9, `フレーム ${f}: 向き`);
    const fq = new Quaternion();
    rig.world(ix(mapped, 'sb_follow')).decompose(new Vector3(), fq, new Vector3());
    assert.ok(Math.abs(Math.abs(fq.dot(want)) - 1) < 1e-9, `フレーム ${f}: sb_follow の向き`);
  }
  // 割り当てなし（親のスケールを受け継ぐ transform）では、親が伸び縮みすると行列がゆがむ
  assert.ok(skew(atData(data, 48).world(idx('sb_comp'))) > 1e-2);
});
