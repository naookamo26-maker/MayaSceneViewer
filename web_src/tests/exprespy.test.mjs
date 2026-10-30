// exprespy（Python で式を書くノード）のコードを変換した定義の評価の検証。期待する値は、コードの意味（コンストレイントの
// 性質）から three.js で別に求める
// 前提: python tools/make_exprespy_sample.py（samples/exprespy_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/exprespy_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const idx = (n) => { const i = names.indexOf(n); assert.ok(i >= 0, n); return i; };
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const nearVec = (a, b, tol = 1e-6) => a.distanceTo(b) <= tol;
const FRAMES = [1, 7, 12, 24];
const D2R = Math.PI / 180;
const ORDERS = ['ZYX', 'XZY', 'YXZ', 'YZX', 'ZXY', 'XYZ'];   // Maya の回転順の番号 → three の順（逆順）

function at(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}
const v3 = (a) => new Vector3(...a);
const pos = (m) => new Vector3().setFromMatrixPosition(m);
const axis = (m, k) => new Vector3().setFromMatrixColumn(m, k).normalize();
const rotOf = (m) => { const p = new Vector3(), q = new Quaternion(), s = new Vector3(); m.decompose(p, q, s); return q; };
/** 回転のピボットの、親の空間の位置（t + rp + rpt）をワールドへ */
function pivotWorld(rig, name) {
  const c = rig.chan(idx(name));
  const parent = data.nodes[idx(name)].parent;
  const local = v3(c.t).add(v3(c.rp || [0, 0, 0])).add(v3(c.rpt || [0, 0, 0]));
  return parent >= 0 ? local.applyMatrix4(rig.world(parent)) : local;
}
const parentWorld = (rig, name) => {
  const p = data.nodes[idx(name)].parent;
  return p >= 0 ? rig.world(p) : new Matrix4();
};

test('exprespy のノードを定義で評価し、解析できないノードは警告する', () => {
  const graph = data.animation.graph.filter((g) => g.type === 'exprespy');
  const defined = graph.filter((g) => g.def).map((g) => g.name).sort();
  assert.deepEqual(defined, ['aimCnsEx', 'aimUpCnsEx', 'chainA', 'chainB', 'oriCnsEx', 'posCnsEx', 'quatEx', 'timeEx']);
  for (const g of graph.filter((x) => x.def)) {
    assert.match(g.def, /^exprespy:[0-9a-f]{12}$/);
    assert.ok(data.animation.nodeDefs[g.def], g.def);
  }
  const warnings = data.warnings.join('\n');
  assert.match(warnings, /exprespy badCmds のコードを解析できません（1 行目: maya\.cmds/);
  assert.match(warnings, /exprespy badMesh のコードを解析できません（形状（boxShape\.o）/);
  const rig = at(12);
  for (const n of ['posCnst', 'oriCnst', 'aimCnst', 'aimUpCnst', 'jT', 'jC', 'jQ']) rig.chan(idx(n));
  assert.deepEqual([...rig.problems], []);
});

test('posCnsEx: 位置のコンストレイント（ピボット・親の逆行列・オフセット）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const expect = pivotWorld(rig, 'src').applyMatrix4(parentWorld(rig, 'posCnst').clone().invert()).add(new Vector3(0, 0, -3));
    assert.ok(nearVec(v3(rig.chan(idx('posCnst')).t), expect), `フレーム ${f}: ${rig.chan(idx('posCnst')).t}`);
  }
});

test('oriCnsEx: 向きのコンストレイント（回転順 zxy の入力と reorderIt）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const a = rotOf(rig.world(idx('oriCnst'))), b = rotOf(rig.world(idx('src')));
    assert.ok(near(Math.abs(a.dot(b)), 1, 1e-9), `フレーム ${f}: ${a.toArray()} / ${b.toArray()}`);
    assert.equal(rig.chan(idx('oriCnst')).ro, 2);
  }
});

test('aimCnsEx: エイム（MQuaternion(ベクトル, ベクトル)・setValue で回転順 yzx の値にする）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const dir = pivotWorld(rig, 'src').sub(pivotWorld(rig, 'aimCnst')).normalize();
    assert.ok(nearVec(axis(rig.world(idx('aimCnst')), 1), dir), `フレーム ${f}`);
  }
});

test('aimUpCnsEx: アップベクトルつきのエイム（外積・normalize()・MMatrix・setValue(行列)）', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const c = rig.chan(idx('aimUpCnst'));
    // サンプルのコードは親の回転を打ち消さないので、ローカルの回転の軸をワールドの向きと比べる
    const L = new Matrix4().makeRotationFromEuler(new Euler(...c.r.map((v) => v * D2R), ORDERS[c.ro || 0]));
    const dst = pivotWorld(rig, 'aimUpCnst');
    const aim = pivotWorld(rig, 'src').sub(dst).normalize();
    const up = pivotWorld(rig, 'upv').sub(dst);
    assert.ok(nearVec(axis(L, 1), aim), `フレーム ${f}: Y`);
    assert.ok(near(up.dot(axis(L, 2)), 0, 1e-9), `フレーム ${f}: Z ⟂ up`);
    assert.ok(up.dot(axis(L, 0)) > 0, `フレーム ${f}: X は up の側`);
  }
});

test('timeEx: time1 からの入力（秒）と、接続のない入力の値', () => {
  for (const f of FRAMES) {
    assert.ok(near(at(f).chan(idx('jT')).t[1], Math.sin(2 * f / 24) * 3), `フレーム ${f}`);
  }
});

test('chainA → chainB: exprespy どうしの接続（MVector の出力 → 入力）と import の別名', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const t = v3(rig.chan(idx('src')).t);
    assert.ok(near(rig.chan(idx('jC')).t[0], 2 * t.length()), `フレーム ${f}`);
  }
});

test('quatEx: MQuaternion(角度, 軸) と asEulerRotation', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const r = rig.chan(idx('jQ')).r;
    const rz = rig.chan(idx('src')).r[2];
    assert.ok(near(r[0], 0) && near(r[1], 0) && near(r[2], rz), `フレーム ${f}: ${r} / ${rz}`);
  }
});
