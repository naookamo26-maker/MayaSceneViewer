// テイク（アニメーションだけの入出力）の検証: 分けて当て直すと元と同じになること（takes.js）
// 前提: samples/*.json（tools/make_*.py）
import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import {
  chooseNamespace, chooseTarget, composeAnimation, decodeTake, encodeTake, namespaceOf, splitAnimation, stripNamespace,
  takeNamespaces, targetRoots,
} from '../src/takes.js';
import { openPackage, openTakes } from '../src/package.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const samples = path.resolve(here, '../../samples');
const load = (name) => JSON.parse(readFileSync(path.join(samples, name), 'utf8'));

/** 全フレーム（と半フレーム）の動くノードの行列・props の値・キーの時刻 */
function evaluateAll(scene, anim) {
  const clip = new AnimationClip(anim);
  const st = scene.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(clip, scene.nodes, (ni) => st[ni]);
  rig.playbackLimit = 0;
  const lo = Math.floor(Math.min(clip.start, +anim.animStart || clip.start));
  const hi = Math.ceil(Math.max(clip.end, +anim.animEnd || clip.end));
  const frames = [];
  for (let f = lo; f <= hi; f += 0.5) {
    const mats = new Map();
    for (const [ni, m] of rig.evaluate(f)) mats.set(ni, [...m.elements]);
    const props = new Map();
    for (const p of rig.evaluateProps()) props.set(`${p.kind}${p.index}`, p.values);
    frames.push({ f, mats, props });
  }
  return { moving: [...rig.moving].sort((a, b) => a - b), frames, keys: clip.keyTimes(), problems: [...rig.problems] };
}

function assertSame(a, b, label) {
  assert.deepEqual(b.moving, a.moving, `${label}: 動くノード`);
  assert.deepEqual(b.keys, a.keys, `${label}: キーの時刻`);
  let worst = 0, where = '';
  for (let i = 0; i < a.frames.length; i++) {
    const fa = a.frames[i], fb = b.frames[i];
    for (const [ni, m] of fa.mats) {
      const o = fb.mats.get(ni);
      assert.ok(o, `${label}: ノード ${ni} の行列がない（${fa.f}）`);
      for (let k = 0; k < 16; k++) {
        const d = Math.abs(m[k] - o[k]);
        if (d > worst) { worst = d; where = `ノード ${ni}・フレーム ${fa.f}`; }
      }
    }
    for (const [k, v] of fa.props) assert.deepEqual(fb.props.get(k), v, `${label}: props ${k}（${fa.f}）`);
  }
  assert.ok(worst < 1e-5, `${label}: 行列の差 ${worst}（${where}）`);
}

const animated = readdirSync(samples).filter((f) => f.endsWith('_sample.json') || f === 'sample_arm.json' || f.endsWith('_mapped.json'))
  .filter((f) => {
    const d = load(f);
    return d && !Array.isArray(d) && d.animation && (d.animation.curves || []).length;
  });

test('名前空間の扱い', () => {
  assert.equal(namespaceOf('|world_grp|armA:rig_grp|armA:hand_ctrl'), 'armA');
  assert.equal(namespaceOf('armA:prop:crate'), 'armA:prop');
  assert.equal(namespaceOf('|a|b'), '');
  assert.equal(stripNamespace('|world_grp|armA:rig_grp|armA:hand_ctrl', 'armA'), '|world_grp|rig_grp|hand_ctrl');
  assert.equal(stripNamespace('|armA:prop:crate', 'armA'), '|prop:crate');
});

for (const f of animated) {
  test(`往復: ${f}（分けて当て直すと元と同じ）`, () => {
    const scene = load(f);
    const orig = evaluateAll(scene, scene.animation);
    const nss = takeNamespaces(scene);
    assert.ok(nss.length >= 1, 'テイクにできる名前空間がある');
    const before = JSON.stringify(scene.animation);
    // 名前空間ごとに分け、順に当て直す（JSON を通して、保存・読み込みの形も確かめる）
    let cur = scene;
    for (const ns of nss) {
      const { base, take } = splitAnimation(cur, ns);
      assert.ok(take.curves.length > 0 && take.bindings.length > 0, `${f}: テイクにキーがある`);
      const baseTimeCurves = base.curves.filter((c) => c.type[0] === 'T' && !c.trax).length;
      const origTimeCurves = cur.animation.curves.filter((c) => c.type[0] === 'T' && !c.trax).length;
      assert.ok(baseTimeCurves < origTimeCurves, `${f}: 土台からテイクのキーを外す`);
      const back = decodeTake(JSON.parse(JSON.stringify(encodeTake(take))));
      const { animation, report } = composeAnimation(cur, base, [{ take: back, namespace: ns }]);
      assert.deepEqual(report.missed, [], `${f}: 当たらなかった結び付け`);
      assert.equal(report.staticsMissed, 0);
      assert.equal(report.applied, take.bindings.length);
      cur = { ...cur, animation };
    }
    assert.equal(JSON.stringify(scene.animation), before, '元の animation を書き換えない');
    assertSame(orig, evaluateAll(scene, cur.animation), f);
  });
}

test('土台: テイクを外すと、テイクのキーは残らない（リグのドリブンキーは残る）', () => {
  const scene = load('rig6_sample.json');
  const { base, take } = splitAnimation(scene, '');
  assert.ok(base.curves.every((c) => c.type[0] === 'U'), 'ドリブンキーだけが残る');
  assert.equal(base.curves.length, 2);
  assert.ok(take.nodes.some((n) => n.type === 'animLayer'), 'アニメーションレイヤーを運ぶ');
  assert.ok(take.nodes.some((n) => n.type.startsWith('animBlendNode')));
  assert.ok(take.bindings.some((b) => b.from), 'ブレンドの出力の結び付け');
  assert.ok(!base.graph.some((g) => g.type === 'animLayer'));
  // 土台だけでも評価できる
  const r = evaluateAll(scene, base);
  assert.ok(r.frames.length > 0);
});

test('Trax: キャラクターセットのクリップを運ぶ', () => {
  const scene = load('trax_sample.json');
  const { base, take } = splitAnimation(scene, '');
  const ch = take.nodes.find((n) => n.type === 'character');
  assert.ok(ch && ch.trax && ch.trax.clips.length >= 2);
  assert.ok(take.curves.some((c) => c.trax));
  assert.ok(!base.graph.some((g) => g.trax));
});

test('カメラを運ばない（土台にカメラのキーが残る）', () => {
  for (const f of ['sequencer_sample.json', 'camaim_sample.json']) {
    const scene = load(f);
    const cams = new Set((scene.cameras || []).map((c) => c.transform));
    const camPaths = new Set([...cams].map((i) => scene.nodes[i].path));
    for (const ns of takeNamespaces(scene)) {
      const { base, take } = splitAnimation(scene, ns);
      assert.ok(!take.bindings.some((b) => camPaths.has(b.target)), `${f}: カメラへの結び付けがない`);
      assert.ok(!take.bindings.some((b) => b.prop === 'camera'));
      const camCurves = (scene.animation.props || []).filter((p) => p.kind === 'camera');
      for (const p of camCurves) {
        const bp = base.props.find((x) => x.kind === 'camera' && x.index === p.index);
        assert.deepEqual(Object.keys(bp.inputs), Object.keys(p.inputs), `${f}: カメラの属性のキーが土台に残る`);
      }
      for (const ch of scene.animation.channels.filter((c) => cams.has(c.node))) {
        assert.ok(base.channels.some((c) => c.node === ch.node && c.attr === ch.attr), `${f}: カメラのキーが土台に残る`);
      }
    }
  }
});

test('当たらないもの: 相手のないテイク・あいまいな名前は落ちず、report に理由つきで出る', () => {
  const src = load('anim_sample.json');
  const { take } = splitAnimation(src, '');
  // 相手のないシーン
  const other = load('sample_arm.json');
  const { base } = splitAnimation(other, '');
  const lonely = { ...take, bindings: [...take.bindings, { target: '|nowhere|ghost', attr: 'tx', curve: 0 }] };
  const r = composeAnimation(other, base, [{ take: lonely, namespace: '' }]);
  assert.ok(r.report.missed.some((m) => m.target === '|nowhere|ghost' && m.reason === 'missing'));
  // あいまい: 同じ名前のノードが 2 つ（親の違うもの）
  const dup = {
    nodes: [
      { name: 'a', path: '|a', type: 'transform', parent: -1, matrix: new Matrix4().toArray() },
      { name: 'ctl', path: '|a|ctl', type: 'transform', parent: 0, matrix: new Matrix4().toArray() },
      { name: 'b', path: '|b', type: 'transform', parent: -1, matrix: new Matrix4().toArray() },
      { name: 'ctl', path: '|b|ctl', type: 'transform', parent: 2, matrix: new Matrix4().toArray() },
    ],
  };
  const t2 = { ...take, namespace: '', bindings: [{ target: '|x|ctl', attr: 'tx', curve: 0 }, { target: '|q|a|ctl', attr: 'ty', curve: 0 }] };
  const r2 = composeAnimation(dup, splitAnimation(dup, '').base, [{ take: t2, namespace: '' }]);
  assert.deepEqual(r2.report.missed.map((m) => m.reason), ['ambiguous']);
  assert.equal(r2.report.applied, 1, '下からいちばん長く一致するもの（|a|ctl）には当たる');
  assert.equal(r2.animation.channels[0].node, 1);
});

test('別の名前空間へ: 名前空間と親の違いを吸収する', () => {
  const src = load('anim_sample.json');
  const { take } = splitAnimation(src, '');
  // 同じシーンの名前を名前空間 rigB: と親 |shot_grp の下に移したもの
  const moved = JSON.parse(JSON.stringify(src));
  for (const n of moved.nodes) {
    n.name = 'rigB:' + n.name;
    n.path = '|shot_grp' + n.path.split('|').map((c) => (c ? 'rigB:' + c : c)).join('|');
  }
  for (const g of moved.animation.graph || []) g.name = 'rigB:' + g.name;
  const pick = chooseNamespace(moved, take);
  assert.equal(pick.namespace, 'rigB');
  assert.equal(pick.count, take.bindings.length);
  const { base } = splitAnimation(moved, 'rigB');
  const { animation, report } = composeAnimation(moved, base, [{ take, namespace: 'rigB' }]);
  assert.deepEqual(report.missed, []);
  assertSame(evaluateAll(src, src.animation), evaluateAll(moved, animation), '名前空間の違い');
});

test('長さの単位の違い: 移動のカーブの値を直す', () => {
  const src = load('anim_sample.json');
  const { base, take } = splitAnimation(src, '');
  const mTake = { ...take, linearUnit: 'm' };
  const { animation } = composeAnimation(src, base, [{ take: mTake, namespace: '' }]);
  const tl = take.curves.findIndex((c) => c.type === 'TL');
  const c0 = take.curves[tl];
  const c1 = animation.curves.find((c) => c.name === c0.name);
  assert.ok(Math.abs(animation.values[c1.offset + 1] - take.values[c0.offset + 1] * 100) < 1e-3);
});

/** .ma を共通 JSON にする（Python の export）。Python がなければ null */
function exportMa(rel) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'take-'));
  const out = path.join(dir, 'out.json');
  try {
    execFileSync(process.env.PYTHON || 'python3', ['-m', 'ma_viewer', 'export', path.join(samples, rel), '-o', out],
      { cwd: path.resolve(here, '../..'), stdio: 'ignore' });
    return JSON.parse(readFileSync(out, 'utf8'));
  } catch (err) {
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('別のシーンへ: shot.ma のテイクを arm_rig.ma（名前空間なし・親が違う）に当てると、shot.ma と同じ行列になる', (t) => {
  const shot = exportMa('reference_project/scenes/shot.ma');
  const rig = exportMa('reference_project/assets/arm_rig.ma');
  if (!shot || !rig) { t.skip('Python で .ma を読めない'); return; }
  assert.deepEqual(takeNamespaces(shot), ['armA']);
  const { take } = splitAnimation(shot, 'armA');
  assert.ok(take.statics.some((s) => s.values.fkik === 1), 'キーのない値（fkik = 1）を運ぶ');
  const pick = chooseNamespace(rig, take);
  assert.equal(pick.namespace, '');
  const { base } = splitAnimation(rig, '');
  const { animation, report } = composeAnimation(rig, base, [{ take, namespace: '' }]);
  assert.deepEqual(report.missed, []);
  const a = evaluateAll(shot, shot.animation);
  const b = evaluateAll(rig, animation);
  // 同じ名前（名前空間と親を外した名前）のノードの、ワールドではなくローカルの行列を比べる（親の違いを除く）
  const leaf = (p) => p.split('|').pop().split(':').pop();
  const rigIndex = new Map(rig.nodes.map((n, i) => [leaf(n.path), i]));
  let compared = 0;
  for (let i = 0; i < a.frames.length; i++) {
    for (const [ni, m] of a.frames[i].mats) {
      const ri = rigIndex.get(leaf(shot.nodes[ni].path));
      const o = b.frames[i].mats.get(ri);
      assert.ok(o, `${shot.nodes[ni].path} が動く`);
      for (let k = 0; k < 16; k++) assert.ok(Math.abs(m[k] - o[k]) < 1e-5, `${shot.nodes[ni].path} @${a.frames[i].f}`);
      compared++;
    }
    for (const [k, v] of a.frames[i].props) {
      // props は番号がシーンごとに違うので、値の集合で比べる
      assert.ok([...b.frames[i].props.values()].some((x) => JSON.stringify(x) === JSON.stringify(v)), `props ${k}`);
    }
  }
  assert.ok(compared > 0);
});

test('.msva・.msv: Python で書いたテイクを読んで当てると、元と同じになる', async (t) => {
  const scene = load('rig6_sample.json');
  const { base, take } = splitAnimation(scene, '');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'take-'));
  try {
    writeFileSync(path.join(dir, 'takes.json'), JSON.stringify([encodeTake(take)]));
    const py = [
      'import json, sys',
      'from ma_viewer import package',
      'd = sys.argv[1]',
      'takes = json.load(open(d + "/takes.json"))',
      'package.write_takes(takes, d + "/t.msva")',
      'scene, _ = package.read_package("samples/sample_arm.msv")',
      'package.write_package(scene, d + "/s.msv", textures="none", takes=takes)',
    ].join('\n');
    try {
      execFileSync(process.env.PYTHON || 'python3', ['-c', py, dir], { cwd: path.resolve(here, '../..'), stdio: 'ignore' });
    } catch (err) {
      t.skip('Python で書き出せない');
      return;
    }
    const buf = (f) => { const b = readFileSync(path.join(dir, f)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
    const takes = await openTakes(buf('t.msva'));
    assert.equal(takes.length, 1);
    const back = decodeTake(takes[0]);
    assert.ok(back.times instanceof Float32Array);
    const { animation, report } = composeAnimation(scene, base, [{ take: back, namespace: '' }]);
    assert.deepEqual(report.missed, []);
    assertSame(evaluateAll(scene, scene.animation), evaluateAll(scene, animation), '.msva');
    // .msv の中のテイク（シーンは元のまま開ける）
    const { scene: s2 } = await openPackage(buf('s.msv'));
    assert.equal(s2.savedTakes.length, 1);
    assert.equal(s2.savedTakes[0].name, take.name);
    assert.equal((await openTakes(buf('s.msv'))).length, 1);
    await assert.rejects(openPackage(buf('t.msva')), /テイクだけのファイル/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('.msva をブラウザの処理（takeFile.js）で書くと、JS と Python の両方で読める', async (t) => {
  const { buildTakesFile } = await import('../src/takeFile.js');
  const scene = load('rig6_sample.json');
  const { base, take } = splitAnimation(scene, '');
  const bytes = await buildTakesFile([take, { ...take, name: '二つめ' }], { version: '9.9.9' });
  const back = await openTakes(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  assert.deepEqual(back.map((x) => x.name), [take.name, '二つめ']);
  const { animation } = composeAnimation(scene, base, [{ take: decodeTake(back[0]), namespace: '' }]);
  assertSame(evaluateAll(scene, scene.animation), evaluateAll(scene, animation), 'JS で書いた .msva');
  const dir = mkdtempSync(path.join(os.tmpdir(), 'take-'));
  try {
    writeFileSync(path.join(dir, 't.msva'), bytes);
    const py = 'import json, sys\nfrom ma_viewer import package\nts = package.read_takes(sys.argv[1])\n'
      + 'm = json.loads(__import__("zipfile").ZipFile(sys.argv[1]).read("manifest.json"))\n'
      + 'print(json.dumps([[t["name"] for t in ts], m["format"], m["generatorVersion"], len(package.schema.array_values(ts[0]["times"]))]))';
    let out;
    try {
      out = execFileSync(process.env.PYTHON || 'python3', ['-c', py, path.join(dir, 't.msva')], { cwd: path.resolve(here, '../..') });
    } catch (err) {
      t.skip('Python で読めない');
      return;
    }
    const [names, format, version, nkeys] = JSON.parse(String(out));
    assert.deepEqual(names, [take.name, '二つめ']);
    assert.equal(format, 'maya-scene-viewer-takes');
    assert.equal(version, '9.9.9');
    assert.equal(nkeys, take.times.length);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/** Python で .ma を読む: { scene: 共通 JSON, takes: 参照先を読まずに取り出したテイク（takes_from_ma）}。Python がなければ null */
function maWithDirectTakes(maPath) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'take-'));
  const out = path.join(dir, 'out.json');
  const py = 'import json, sys\nfrom ma_viewer.extract_ma import load_ma\nfrom ma_viewer.take import takes_from_ma\n'
    + 'sc = load_ma(sys.argv[1], animation=True)\nts, _n = takes_from_ma(sys.argv[1])\n'
    + 'json.dump({"scene": sc, "takes": ts}, open(sys.argv[2], "w"))';
  try {
    execFileSync(process.env.PYTHON || 'python3', ['-c', py, maPath, out], { cwd: path.resolve(here, '../..'), stdio: 'ignore' });
    return JSON.parse(readFileSync(out, 'utf8'));
  } catch (err) {
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

for (const name of ['anim_sample', 'rig6_sample', 'trax_sample', 'ctrl_sample', 'rig_sample', 'hik_sample', 'camaim_sample']) {
  test(`.ma から直接（参照先を読まない取り出し）: ${name} は、当て直すと元と同じ`, (t) => {
    const r = maWithDirectTakes(path.join(samples, `${name}.ma`));
    if (!r) { t.skip('Python で .ma を読めない'); return; }
    const { scene, takes } = r;
    assert.ok(takes.length >= 1, 'テイクがある');
    let cur = scene;
    for (const raw of takes) {
      const take = decodeTake(raw);
      const ns = chooseNamespace(cur, take).namespace;
      const { base } = splitAnimation(cur, ns);
      const { animation } = composeAnimation(cur, base, [{ take, namespace: ns }]);
      cur = { ...cur, animation };
    }
    assertSame(evaluateAll(scene, scene.animation), evaluateAll(scene, cur.animation), name);
  });
}

test('参照先のファイルがないショット: リファレンスの編集から取り出して arm_rig.ma に当てると、shot.ma と同じ行列になる', (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'take-noref-'));
  try {
    copyFileSync(path.join(samples, 'reference_project/scenes/shot.ma'), path.join(dir, 'shot.ma'));
    const r = maWithDirectTakes(path.join(dir, 'shot.ma'));
    const shot = exportMa('reference_project/scenes/shot.ma');
    const rig = exportMa('reference_project/assets/arm_rig.ma');
    if (!r || !shot || !rig) { t.skip('Python で .ma を読めない'); return; }
    assert.ok(!r.scene.animation, '参照先がないと、シーンとしてはアニメーションを読めない');
    assert.deepEqual(r.takes.map((x) => x.namespace), ['armA']);
    const take = decodeTake(r.takes[0]);
    // 参照先のある状態で取り出したもの（ビューアの取り出し）と、結び付け・キーが同じ
    const ref = splitAnimation(shot, 'armA').take;
    assert.deepEqual(take.bindings.map((b) => [b.target, b.attr]), ref.bindings.map((b) => [b.target, b.attr]));
    assert.deepEqual(Array.from(take.times), Array.from(ref.times));
    assert.deepEqual(Array.from(take.values), Array.from(ref.values));
    assert.ok(take.statics.some((s) => s.values.fkik === 1), 'リファレンスの編集の setAttr（fkik = 1）を運ぶ');
    const { base } = splitAnimation(rig, '');
    const { animation, report } = composeAnimation(rig, base, [{ take, namespace: chooseNamespace(rig, take).namespace }]);
    assert.deepEqual(report.missed, []);
    const a = evaluateAll(shot, shot.animation);
    const b = evaluateAll(rig, animation);
    const leaf = (p) => p.split('|').pop().split(':').pop();
    const rigIndex = new Map(rig.nodes.map((n, i) => [leaf(n.path), i]));
    let compared = 0;
    for (let i = 0; i < a.frames.length; i++) {
      for (const [ni, m] of a.frames[i].mats) {
        const o = b.frames[i].mats.get(rigIndex.get(leaf(shot.nodes[ni].path)));
        assert.ok(o, shot.nodes[ni].path);
        for (let k = 0; k < 16; k++) assert.ok(Math.abs(m[k] - o[k]) < 1e-5, `${shot.nodes[ni].path} @${a.frames[i].f}`);
        compared++;
      }
      for (const v of a.frames[i].props.values()) {
        assert.ok([...b.frames[i].props.values()].some((x) => JSON.stringify(x) === JSON.stringify(v)), '表示');
      }
    }
    assert.ok(compared > 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/** 同じリグを、名前空間を付けずに 2 体（|charA・|charB の下）並べたシーン（アニメーションなし） */
function twoCopies(src) {
  const nodes = [];
  const restNodes = [];
  for (const g of ['charA', 'charB']) {
    const gi = nodes.length;
    nodes.push({ name: g, path: `|${g}`, type: 'transform', parent: -1, matrix: new Matrix4().toArray(), attrs: { t: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1], ro: 'xyz' } });
    restNodes.push({ node: gi, joint: false, ro: 0, t: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1], ra: [0, 0, 0] });
    const off = nodes.length;
    for (const n of src.nodes) {
      nodes.push({ ...n, path: `|${g}${n.path}`, parent: n.parent >= 0 ? n.parent + off : gi });
    }
    // ローカル行列の材料（元のアニメーションのもの。isNode もずらす）
    for (const e of src.animation.nodes) {
      restNodes.push({ ...e, node: e.node + off, ...(e.isNode >= 0 ? { isNode: e.isNode + off } : {}) });
    }
  }
  return { ...src, nodes, restNodes, animation: undefined, meshes: [], curves: [], cameras: [] };
}

test('名前空間のない同じリグが 2 体: いちばん上のノードで当てる先を選ぶ（ほかのキャラクターの動きは残す）', () => {
  const src = load('anim_sample.json');
  const { take } = splitAnimation(src, '');
  const scene = twoCopies(src);
  assert.deepEqual(targetRoots(scene, take, ''), ['|charA', '|charB']);
  const pick = chooseTarget(scene, take);
  assert.deepEqual(pick.candidates.map((c) => c.root), ['|charA', '|charB']);
  assert.equal(pick.root, '|charA', '既定は最初のもの');
  // 当てる先を決めないと、同じ名前が 2 つあるので当たらない（あいまい）
  const none = composeAnimation(scene, splitAnimation(scene, '').base, [{ take, namespace: '' }]);
  assert.equal(none.report.applied, 0);
  assert.ok(none.report.missed.every((m) => m.reason === 'ambiguous'));
  // charA に当てる → charB に当てる（charA の動きは土台に残る）
  const a = composeAnimation(scene, splitAnimation(scene, '', { root: '|charA' }).base, [{ take, namespace: '', root: '|charA' }]);
  assert.deepEqual(a.report.missed, []);
  const withA = { ...scene, animation: a.animation };
  const b = composeAnimation(withA, splitAnimation(withA, '', { root: '|charB' }).base, [{ take, namespace: '', root: '|charB' }]);
  assert.deepEqual(b.report.missed, []);
  const orig = evaluateAll(src, src.animation);
  const both = evaluateAll(scene, b.animation);
  const off = { charA: 1, charB: 2 + src.nodes.length };
  // キーの相手のノードを比べる（コンストレイントで動く forearm_twist は、このシーンにリグを写していないので比べない）
  const keyed = [...new Set(src.animation.channels.map((c) => c.node))];
  for (let i = 0; i < orig.frames.length; i++) {
    for (const ni of keyed) {
      const m = orig.frames[i].mats.get(ni);
      for (const g of ['charA', 'charB']) {
        const o = both.frames[i].mats.get(ni + off[g]);
        assert.ok(o, `${g} の ${src.nodes[ni].path} が動く`);
        for (let k = 0; k < 16; k++) assert.ok(Math.abs(m[k] - o[k]) < 1e-5, `${g} ${src.nodes[ni].path} @${orig.frames[i].f}`);
      }
    }
  }
  // charB だけを外して当て直しても、charA の動きはそのまま
  const again = composeAnimation(withA, splitAnimation(withA, '', { root: '|charB' }).base, []);
  assert.ok(again.animation.channels.every((c) => c.node < off.charB), '土台は charA のキーだけ');
  assert.equal(again.animation.channels.length, a.animation.channels.length);
});

test('同じリグが 1 体なら、当てる先のノードは決めない', () => {
  const src = load('anim_sample.json');
  const { take } = splitAnimation(src, '');
  assert.deepEqual(targetRoots(src, take, ''), []);
  const pick = chooseTarget(src, take);
  assert.equal(pick.root, null);
  assert.equal(pick.candidates.length, 1);
});
