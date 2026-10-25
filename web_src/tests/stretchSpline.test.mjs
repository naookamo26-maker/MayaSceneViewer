// 骨ごとに伸び縮みするスプライン IK（カーブ上の点どうしの距離 → ジョイントのスケール）の評価の検証
// 前提: python tools/make_stretch_spline_sample.py（samples/stretch_spline_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
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
