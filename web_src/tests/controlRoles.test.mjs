// コントローラーの役割（目印の形）と左右の判定の検証
// 前提: python tools/make_rig_sample.py などで samples/*_sample.json を作る
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { classifyControls, sideFromName } from '../src/controlRoles.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, `../../samples/${name}.json`), 'utf8'));

/** main.js と同じく、目印を出すノード（ジョイント・メッシュ・カーブ以外の、リグを動かすノード）を判定する */
function roles(name) {
  const d = load(name);
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  const meshNodes = new Set(d.meshes.map((m) => m.transform));
  const curveNodes = new Set((d.curves || []).map((c) => c.transform));
  const list = [...rig.directDrivers].filter((ni) => d.nodes[ni].type !== 'joint' && !meshNodes.has(ni) && !curveNodes.has(ni));
  const out = {};
  for (const [ni, r] of classifyControls(d.animation.graph, d.nodes, list)) {
    out[d.nodes[ni].name] = { ...r, chain: r.chain && r.chain.map((i) => d.nodes[i].name), joint: r.joint >= 0 ? d.nodes[r.joint].name : undefined,
      lineTo: r.lineTo >= 0 ? d.nodes[r.lineTo].name : undefined };
  }
  return out;
}

test('IK・ポールベクター・コンストレイント・属性のスイッチ（rig_sample）', () => {
  const r = roles('rig_sample');
  assert.equal(r.arm_ik.role, 'ik');
  assert.equal(r.hand_ctrl.role, 'ik', 'IK ハンドルの親（手のコントローラー）も IK');
  assert.deepEqual(r.hand_ctrl.chain, ['shoulder', 'elbow', 'wrist']);
  assert.equal(r.elbow_pv.role, 'pole');
  assert.equal(r.elbow_pv.lineTo, 'elbow', 'ポールベクターは肘と破線で結ぶ');
  for (const n of ['tgtA', 'tgtB', 'scl_ctrl']) assert.equal(r[n].role, 'constraint', n);
  assert.equal(r.tgtA.joint, 'head', '大きさの基準は動かす先のジョイント');
  assert.equal(r.ctrl_util.role, 'switch');
});

test('スプライン IK の制御・ドリブンキー・計算の材料（rig6_sample）', () => {
  const r = roles('rig6_sample');
  assert.equal(r.cl_tipHandle.role, 'spline', 'cluster のハンドル（カーブを変形する）');
  assert.equal(r.cl_midHandle.role, 'spline');
  assert.equal(r.cl_tipHandle.chain.length, 5);
  assert.equal(r.roll_ctrl.role, 'driven');
  assert.equal(r.drv2.role, 'driven', 'unitConversion を挟んだドリブンキー');
  assert.equal(r.db_loc.role, 'locator', 'distanceBetween の行列の入力');
  assert.equal(r.knee_pv.role, 'pole');
  assert.equal(r.knee_pv.lineTo, 'leg_knee');
  assert.equal(r.arm3_root.role, 'constraint');
});

test('エイム・スプライン IK の上方向・ロケーター（rig3_sample・ik_sample・ctrl_sample）', () => {
  const r3 = roles('rig3_sample');
  assert.equal(r3.look_tgt.role, 'aim');
  assert.ok(r3.look_tgt.lineTo, 'エイムのターゲットは向くノードと結ぶ');
  assert.equal(r3.eye_up.role, 'aim', 'エイムの上方向のノード');
  assert.equal(r3.eye_up.lineTo, undefined, '上方向のノードは結ばない');
  const ik = roles('ik_sample');
  assert.equal(ik.spB_upS.role, 'spline', 'スプライン IK の上級ツイストの上方向');
  assert.equal(ik.rp4_pv.role, 'pole');
  const d = load('ctrl_sample');
  assert.equal(d.nodes.find((n) => n.name === 'tw_loc0').shape, 'locator', '.ma からロケーターのシェイプを読む');
  assert.deepEqual(d.nodes.find((n) => n.name === 'ctrl_layer').color, [1, 0, 0], 'ディスプレイレイヤーの色');
  const ctrl = roles('ctrl_sample');
  assert.equal(ctrl.bp_tgt.role, 'constraint');
});

test('cluster のハンドルはピボットの位置に目印を置く（.ma の pivot）', () => {
  const d = load('rig6_sample');
  assert.deepEqual(d.nodes.find((n) => n.name === 'cl_tipHandle').pivot, [8, 0, -10]);
});

test('名前から左右を決める', () => {
  for (const n of ['L_arm_ctrl', 'leftHand_ctrl', 'handL', 'LArm', 'rig:l_leg_ik', 'ctrl_l01', 'lf_foot']) assert.equal(sideFromName(n), 'L', n);
  for (const n of ['arm_R', 'rt_foot', 'footRight', '|grp|R_hand']) assert.equal(sideFromName(n), 'R', n);
  for (const n of ['BALL_ctrl', 'spine_ctrl', 'Lip_ctrl', 'IKFK_switch', 'R_L_mix', 'root']) assert.equal(sideFromName(n), null, n);
});
