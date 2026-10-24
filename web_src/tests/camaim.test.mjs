// カメラとエイム（lookAt）と、距離の寸法（distanceDimShape）の検証
// 前提: python tools/make_camaim_sample.py（samples/camaim_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/camaim_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const D2R = Math.PI / 180;

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  assert.equal(rig.problems.size, 0, [...rig.problems].join());
  return rig;
}
const axis = (m, i) => new Vector3().setFromMatrixColumn(m, i).normalize();
const pos = (m) => new Vector3().setFromMatrixPosition(m);

test('カメラとエイム: カメラの −Z がエイムのロケーターを向く（ロケーターのキーにもついていく）', () => {
  for (const f of [1, 12, 24]) {
    const rig = at(f);
    const cam = rig.world(idx('aim_cam')), aim = rig.world(idx('aim_cam_aim'));
    const want = pos(aim).sub(pos(cam)).normalize();
    const look = axis(cam, 2).negate();
    assert.ok(look.angleTo(want) < 1e-6, `フレーム ${f}: ${look.angleTo(want) / D2R} 度ずれ`);
  }
  // エイムは 1 → 24 で x が 0 → 10 に動く
  assert.ok(Math.abs(pos(at(24).world(idx('aim_cam_aim'))).x - 10) < 1e-6);
});

test('ターゲットの位置がロケーターのシェイプ（worldPosition）からつながる場合も、カメラはエイムを向く', () => {
  const rig = at(1);
  const cam = rig.world(idx('shape_cam')), aim = rig.world(idx('shape_cam_aim'));
  const want = pos(aim).sub(pos(cam)).normalize();
  const look = axis(cam, 2).negate();
  assert.ok(look.angleTo(want) < 1e-6, `${look.angleTo(want) / D2R} 度ずれ`);
  assert.ok(want.y < -0.3, 'エイムはカメラより下（下を向く）');
});

test('カメラとエイム: twist（ロール）で視線のまわりに回る', () => {
  const rig = at(1);                                      // 2 台のエイムが同じ位置（twist なしのエイムはキーなし）
  const a = rig.world(idx('aim_cam')), b = rig.world(idx('roll_cam'));
  assert.ok(axis(a, 2).angleTo(axis(b, 2)) < 1e-6, '視線は同じ');
  const roll = axis(a, 1).angleTo(axis(b, 1)) / D2R;
  assert.ok(Math.abs(roll - 20) < 1e-4, `ロール ${roll} 度`);
  // twist なしのカメラは、上（+Y）が world up（+Y）の側を向く（横に傾かない）
  assert.ok(Math.abs(axis(b, 0).y) < 1e-6, 'twist なしのカメラの横の軸は水平');
});

test('twist を別のアトリビュート（カメラのシェイプ・別のノードの角度の属性）からつないでも、同じロールになる', () => {
  const rig = at(1);
  const a = rig.world(idx('aim_cam'));
  for (const n of ['shape_roll_cam', 'attr_roll_cam']) {
    const b = rig.world(idx(n));
    assert.ok(axis(a, 2).angleTo(axis(b, 2)) < 1e-6 && axis(a, 1).angleTo(axis(b, 1)) < 1e-6, `${n}: twist 20 度のカメラと同じ向き`);
  }
});

test('距離の寸法: 2 つのロケーターの距離 ÷ 6 で box.sx が決まる', () => {
  for (const [f, d] of [[1, 3], [24, 9]]) {
    const sx = at(f).chan(idx('box')).s[0];
    assert.ok(Math.abs(sx - d / 6) < 1e-6, `フレーム ${f}: ${sx}`);
  }
});
