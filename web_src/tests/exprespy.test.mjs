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
  assert.deepEqual(defined, ['aimCnsEx', 'aimUpCnsEx', 'chainA', 'chainB', 'limitEx', 'oriCnsEx', 'posCnsEx', 'pyEx', 'pyEx2', 'pyEx3', 'quatEx', 'timeEx'].concat(['aliasEx', 'lookupEx']).sort());
  for (const g of graph.filter((x) => x.def)) {
    assert.match(g.def, /^exprespy:[0-9a-f]{12}$/);
    assert.ok(data.animation.nodeDefs[g.def], g.def);
  }
  const warnings = data.warnings.join('\n');
  assert.match(warnings, /exprespy badCmds のコードを解析できません（1 行目: maya\.cmds/);
  assert.match(warnings, /exprespy badMesh のコードを解析できません（形状（boxShape\.o）/);
  const rig = at(12);
  for (const n of ['posCnst', 'oriCnst', 'aimCnst', 'aimUpCnst', 'jT', 'jC', 'jQ', 'jL', 'jP', 'jP2', 'jR', 'jR2', 'jS', 'jS2', 'jF', 'jK']) rig.chan(idx(n));
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

test('limitEx: 既定値つきの引数（max=None）と None の判定', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const t = rig.chan(idx('jL')).t;
    assert.ok(near(t[0], Math.max(tx, 0)) && near(t[1], Math.max(-tx, 0)) && near(t[2], Math.min(Math.max(tx, 0), 1.5)),
      `フレーム ${f}: ${t} / tx ${tx}`);
  }
});

test('pyEx: ループの展開・try / except KeyError・内包表記・分解代入・while', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const t = rig.chan(idx('jP')).t;
    assert.ok(near(t[0], tx + 5) && near(t[1], 2 * tx + 16) && near(t[2], 2 - tx), `フレーム ${f}: ${t} / tx ${tx}`);
    assert.ok(near(rig.chan(idx('jP2')).t[0], 9), `フレーム ${f}: while`);
  }
});

test('pyEx2: 実行時の IN[i]・OUT[i]・展開したループの実行時の break・ループの中の return・辞書・定数の文字列', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const t = rig.chan(idx('jR')).t, t2 = rig.chan(idx('jR2')).t;
    assert.ok(near(t[0], tx > 0 ? 10 * tx + 2 : tx + 2), `フレーム ${f}: 辞書 ${t[0]} / tx ${tx}`);
    assert.ok(near(t[1], tx + 2), `フレーム ${f}: 実行時の IN[i] ${t[1]}`);
    assert.ok(near(t[2], tx > 2.5 ? 0 : 2), `フレーム ${f}: ループの中の return ${t[2]}`);
    assert.ok(near(t2[0], tx >= 3 ? 0 : tx + 2), `フレーム ${f}: 実行時の break ${t2[0]}`);
    assert.ok(near(t2[1], 7), `フレーム ${f}: 実行時の OUT[i] ${t2[1]}`);
  }
});

test('pyEx3: クラス・リストの append・except（ZeroDivisionError・ValueError）・再帰', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const t = rig.chan(idx('jS')).t, t2 = rig.chan(idx('jS2')).t;
    assert.ok(near(t[0], 2 * Math.max(tx, 0) + 8), `フレーム ${f}: クラス ${t[0]} / tx ${tx}`);
    assert.ok(near(t[1], -5), `フレーム ${f}: ZeroDivisionError ${t[1]}`);
    assert.ok(near(t[2], tx < 0 ? -1 : Math.sqrt(tx)), `フレーム ${f}: ValueError ${t[2]}`);
    assert.ok(near(t2[0], 30), `フレーム ${f}: 再帰 ${t2[0]}`);
    assert.ok(near(t2[1], 2 * tx + 5), `フレーム ${f}: append ${t2[1]}`);
  }
});

test('aliasEx: クラスの別名（V = api.MVector）・min / max と同じ名前の引数・式の中の setValue と四元数の exp', () => {
  for (const f of FRAMES) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const k = Math.min(Math.max(tx / 2, 0), 1);
    const c = rig.chan(idx('jF'));
    assert.ok(nearVec(v3(c.t), new Vector3(k, 0.5 + 0.5 * k, 1)), `フレーム ${f}: ${c.t} / k ${k}`);
    // exp((v, 0)) = (v / |v| · sin |v|, cos |v|): 軸 v / |v| まわりに 2|v| 回す
    const v = new Vector3(0.2 * k, 0.2, 0.1);
    const expect = new Quaternion().setFromAxisAngle(v.clone().normalize(), 2 * v.length());
    const got = new Quaternion().setFromEuler(new Euler(...c.r.map((x) => x * D2R), ORDERS[c.ro || 0]));
    assert.ok(near(Math.abs(got.dot(expect)), 1, 1e-9), `フレーム ${f}: 回転 ${c.r}`);
  }
});

test('lookupEx: リストを関数に渡し、ループの変数で切り出す折れ線の表引き・文字列の切り出し', () => {
  const xs = [-20, 0, 20], ys = [-2, 0, 1];
  const table = (t) => {                                // コードと同じ手順（Python の動き）
    for (let n = 0; n < xs.length; n++) {
      const pk = xs.slice(n, n + 2), pv = ys.slice(n, n + 2);
      if (pk.length === 1) return pv[0];
      if (t < pk[0]) return pv[0];
      if (pk[0] <= t && t < pk[1]) return pv[0] + ((t - pk[0]) / (pk[1] - pk[0])) * (pv[1] - pv[0]);
    }
    return 0;
  };
  for (const f of [1, 4, 7, 12, 16, 20, 24]) {
    const rig = at(f);
    const tx = rig.chan(idx('src')).t[0];
    const t = rig.chan(idx('jK')).t;
    assert.ok(near(t[0], table(tx * 10)) && near(t[1], 2), `フレーム ${f}: ${t} / 期待 ${table(tx * 10)}`);
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

// ---------------------------------------------------------------------------------------------------------------
// bend_roll（if not COUNT: の初期化・def・lambda・IN.get・自分の独自の属性の入力・四元数の log・exp）
const br = JSON.parse(readFileSync(path.resolve(here, '../../samples/exprespy_bendroll_sample.json'), 'utf8'));
const brIdx = (n) => { const i = br.nodes.findIndex((x) => x.name === n); assert.ok(i >= 0, n); return i; };
function brAt(f) {
  const rig = new RigEvaluator(new AnimationClip(br.animation), br.nodes, (ni) => new Matrix4().fromArray(br.nodes[ni].matrix));
  rig.evaluate(f);
  return rig;
}

test('bend_roll: すべての exprespy を定義で評価する', () => {
  const graph = br.animation.graph.filter((g) => g.type === 'exprespy');
  assert.equal(graph.length, 9);
  assert.ok(graph.every((g) => g.def), graph.filter((g) => !g.def).map((g) => g.name).join(','));
  const rig = brAt(12);
  for (const n of ['bend1', 'roll1', 'roll2', 'bend2', 'roll3', 'bend3']) rig.chan(brIdx(n));
  assert.deepEqual([...rig.problems], []);
});

test('bend_roll: 曲げとひねりに分けて組み立て直すと、元の回転になる（両方の順）', () => {
  for (const f of FRAMES) {
    const rig = brAt(f);
    const src = rotOf(rig.world(brIdx('src')));
    for (const n of ['roll1', 'bend2']) {
      assert.ok(near(Math.abs(rotOf(rig.world(brIdx(n))).dot(src)), 1, 1e-9), `フレーム ${f}: ${n}`);
    }
    // ひねりは X 軸まわりだけ、曲げは X 軸の向きを src と同じにする
    for (const n of ['roll1', 'roll2']) {
      const r = rig.chan(brIdx(n)).r;
      assert.ok(near(r[1], 0) && near(r[2], 0), `フレーム ${f}: ${n} ${r}`);
    }
    const xAxis = (m) => new Vector3(1, 0, 0).applyQuaternion(rotOf(m));
    assert.ok(nearVec(xAxis(rig.world(brIdx('bend1'))), xAxis(rig.world(brIdx('src')))), `フレーム ${f}: bend1 の X 軸`);
  }
});

test('bend_roll: 指数写像（method = 1）は回転ベクトルの成分に分ける（四元数の log・exp）', () => {
  for (const f of FRAMES) {
    const rig = brAt(f);
    const q = rotOf(rig.world(brIdx('src')));
    const v = new Vector3(q.x, q.y, q.z);
    const rv = v.clone().normalize().multiplyScalar(2 * Math.atan2(v.length(), q.w));     // 回転ベクトル
    assert.ok(near(rig.chan(brIdx('roll3')).r[0] * D2R, rv.x, 1e-9), `フレーム ${f}: roll3`);
    const b = new Vector3(0, rv.y, rv.z);
    const expect = new Quaternion().setFromAxisAngle(b.clone().normalize(), b.length());
    assert.ok(near(Math.abs(rotOf(rig.world(brIdx('bend3'))).dot(expect)), 1, 1e-9), `フレーム ${f}: bend3`);
  }
});
