// 自作ノードの定義の計算を JavaScript の関数にしたもの（nodeDef.js の generateRunner）が、IR をたどる計算（interpret）と
// 同じ結果（ビット単位）・同じ誤り（同じ文言）になるか。
// 前提: python tools/make_nodedef_compile_fixture.py（samples/nodedef_compile_defs.json。exprespy の書き方の一覧を変換したもの）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
import { compileNodeDef, setNodeDefCompile } from '../src/nodeDef.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const samples = path.resolve(here, '../../samples');
const loadJson = (name) => JSON.parse(readFileSync(path.join(samples, name), 'utf8'));

/** 決まった乱数（種ごとに同じ列） */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const hash = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

/**
 * いろいろな入力を返す io。同じ種・同じプラグなら同じ値（毎回新しいオブジェクト）。ときどき型の違う値・0 を返して、
 * 誤りの経路も通す
 */
function makeIo(seed) {
  const frame = 1 + Math.floor(rng(seed)() * 48);
  return {
    frame, fps: 24,
    read(plug, info) {
      const r = rng(seed * 7919 + hash(plug));
      const x = () => (r() < 0.1 ? 0 : Math.round((r() * 8 - 4) * 1000) / 1000);
      const wrong = r() < 0.05;
      const type = info && info.component === undefined ? info.type : 'double';
      if (type === 'matrix' && !wrong) {
        const m = new Matrix4().makeRotationFromEuler({ x: x(), y: x(), z: x(), order: 'XYZ', isEuler: true });
        m.setPosition(x(), x(), x());
        return m;
      }
      if (info && info.size && !wrong) return Array.from({ length: info.size }, x);
      if (wrong) return r() < 0.5 ? [x(), x(), x()] : new Matrix4();
      return x();
    },
    indices: (prefix) => (hash(prefix) % 3 === 0 ? [] : [0, 1, 3]),
    connected: (plug) => hash(plug) % 2 === 0,
  };
}

/** 結果を比べられる形に（数はビット単位で比べる: -0 と 0、NaN も区別する） */
function snapshot(fn) {
  try {
    return { out: norm(fn()) };
  } catch (e) {
    return { error: `${e.constructor.name}: ${e.message}` };
  }
}
function norm(v) {
  if (typeof v === 'number') return Object.is(v, -0) ? '-0' : Number.isNaN(v) ? 'NaN' : v;
  if (v && v.isMatrix4) return { m: v.elements.map(norm) };
  if (Array.isArray(v)) return v.map(norm);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, norm(x)]));
  return v;
}

function compare(def, label, seeds = 40) {
  const d = compileNodeDef(def);
  assert.ok(d.compiled, `${label}: 関数にできる`);
  for (let seed = 1; seed <= seeds; seed++) {
    const a = snapshot(() => d.interpret(makeIo(seed)));
    const b = snapshot(() => d.run(makeIo(seed)));
    assert.deepEqual(b, a, `${label}（種 ${seed}）`);
  }
}

test('サンプルの自作ノードの定義: いろいろな入力で、IR をたどる計算と同じ結果・同じ誤り', () => {
  let n = 0;
  for (const file of readdirSync(samples).filter((f) => f.endsWith('.json') && f !== 'nodedef_compile_defs.json')) {
    const d = loadJson(file);
    const defs = (d.animation && d.animation.nodeDefs) || d.nodeDefs || {};
    for (const [type, def] of Object.entries(defs)) { compare(def, `${file}: ${type}`); n++; }
  }
  assert.ok(n >= 30, `定義の数 ${n}`);
});

test('exprespy の書き方の一覧（約 100 通り）を変換した定義: IR をたどる計算と同じ結果・同じ誤り', () => {
  const list = loadJson('nodedef_compile_defs.json');
  assert.ok(list.length >= 90, `${list.length} 個`);
  for (const { name, def } of list) compare(def, name, 25);
});

// ---------------------------------------------------------------------- 手で書いた IR（誤りの順番・境目）
const attrs = [
  { name: 'input', short: 'in', type: 'double', default: 0, array: true },
  { name: 'vec', short: 'vc', type: 'double3', default: [0, 0, 0], components: ['vcx', 'vcy', 'vcz'] },
  { name: 'mat', short: 'mt', type: 'matrix' },
  { name: 'output', short: 'o', type: 'double', output: true, array: true },
  { name: 'outVec', short: 'ov', type: 'double3', output: true, components: ['ovx', 'ovy', 'ovz'] },
];
const n = (x) => ['n', x];
const l = (x) => ['l', x];
const c = (name, ...args) => ['c', name, args];
const out = (i) => ['o', [['o', typeof i === 'number' ? n(i) : i]]];
const inp = (i) => ['a', [['in', typeof i === 'number' ? n(i) : i]]];
const CASES = {
  'and・or は値を返す': [['set', out(0), ['b', 'and', inp(0), inp(1)]], ['set', out(1), ['b', 'or', inp(0), n(7)]]],
  '続けた演算（ch）・単項': [['set', out(0), ['ch', ['+', '-', '*', '/'], [inp(0), inp(1), n(2), inp(2), inp(3)]]],
    ['set', out(1), ['u', '-', inp(0)]], ['set', out(2), ['u', 'not', inp(1)]]],
  '比較・Python の割り算': [['set', out(0), ['b', '<', inp(0), inp(1)]], ['set', out(1), ['b', '==', inp(0), inp(0)]],
    ['set', out(2), ['b', '%', inp(0), inp(1)]], ['set', out(3), ['b', '//', inp(2), inp(1)]], ['set', out(4), ['b', '**', inp(1), n(2)]]],
  '条件の式・添字（負・範囲外）・成分': [['set', l('v'), ['v', [n(1), n(2), n(3)]]],
    ['set', out(0), ['if', inp(0), ['i', l('v'), n(-1)], ['g', ['a', [['vc', null]]], 2]]],
    ['set', out(1), ['i', l('v'), ['c', 'int', [inp(1)]]]]],
  'リストの要素への代入（範囲外・未設定・リストでない）': [['set', l('v'), ['v', [n(0), n(0), n(0)]]],
    ['set', ['li', 'v', c('int', inp(0))], inp(1)], ['set', out(0), ['i', l('v'), n(0)]],
    ['set', ['li', 'w', c('int', inp(0))], n(1)]],
  '累算代入（変数・リストの要素・出力・まだない出力）': [['set', l('s'), inp(0)], ['aug', '+', l('s'), inp(1)],
    ['set', l('v'), ['v', [n(1), n(2)]]], ['aug', '*', ['li', 'v', n(1)], inp(2)],
    ['set', out(0), l('s')], ['aug', '-', out(0), ['i', l('v'), n(1)]], ['aug', '+', out(c('int', inp(3))), n(1)]],
  'for と range（1〜3 個の引数・負の刻み・刻み 0）': [['set', l('s'), n(0)],
    ['for', 'i', c('range', n(5)), [['aug', '+', l('s'), l('i')]]],
    ['for', 'i', c('range', n(2), n(9), n(3)), [['aug', '+', l('s'), l('i')]]],
    ['for', 'i', c('range', n(5), n(-5), n(-2)), [['aug', '+', l('s'), l('i')]]],
    ['for', 'i', c('range', inp(0), inp(1)), [['aug', '+', l('s'), l('i')]]],
    ['set', out(0), l('s')],
    ['for', 'i', c('range', n(0), n(3), c('int', inp(2))), [['aug', '+', l('s'), n(1)]]], ['set', out(1), l('s')]],
  'for で値の列・break・continue・入れ子': [['set', l('s'), n(0)],
    ['for', 'x', ['a', [['vc', null]]], [
      ['if', ['b', '<', l('x'), n(0)], [['continue']], []],
      ['for', 'k', c('range', n(4)), [['if', ['b', '>=', l('k'), n(2)], [['break']], []], ['aug', '+', l('s'), l('x')]]],
    ]], ['set', out(0), l('s')], ['for', 'x', inp(0), [['set', out(1), l('x')]]]],
  '属性の添字が実行時に決まる・配列の数・接続': [['for', 'i', c('indices', ['p', [['in', null]]]), [['set', out(l('i')), inp(l('i'))]]],
    ['set', out(9), c('count', ['p', [['in', null]]])], ['set', out(10), c('connected', ['p', [['vc', null]]])],
    ['set', ['o', [['ov', null]]], ['a', [['vc', null]]]]],
  '関数（行列・ベクトル・時間・数にならない結果・ない関数）': [['set', out(0), c('determinant', ['a', [['mt', null]]])],
    ['set', ['o', [['ov', null]]], c('translation', ['a', [['mt', null]]])], ['set', out(1), c('time')],
    ['set', out(2), c('frame')], ['set', out(3), c('sqrt', inp(0))], ['set', out(4), c('log', inp(1))],
    ['set', out(5), c('nothing', n(1))]],
  '未設定の変数': [['set', out(0), l('nothing')]],
  '繰り返しの上限': [['set', l('s'), n(0)], ['for', 'i', c('range', n(1000)), [['for', 'j', c('range', n(1000)), [['aug', '+', l('s'), n(1)]]]]],
    ['set', out(0), l('s')]],
  '大きすぎる range': [['for', 'i', c('range', n(300000)), []]],
};

test('手で書いた IR: 誤りの順番・境目も、IR をたどる計算と同じ', () => {
  for (const [name, ir] of Object.entries(CASES)) compare({ type: 't', attributes: attrs, ir }, name, 60);
});

test('for の外の break・知らない属性は関数にせず、IR をたどる計算と同じ誤りにする', () => {
  for (const ir of [[['break']], [['set', out(0), ['a', [['nothing', null]]]]]]) {
    const d = compileNodeDef({ type: 't', attributes: attrs, ir });
    assert.equal(d.compiled, false);
    assert.deepEqual(snapshot(() => d.run(makeIo(1))), snapshot(() => d.interpret(makeIo(1))));
  }
});

test('関数にしない設定（setNodeDefCompile(false)）でも、リグの評価の結果は同じ', () => {
  for (const file of ['exprespy_sample.json', 'exprespy_bendroll_sample.json', 'plugin_convert_sample.json', 'nodedef_sample.json']) {
    const d = loadJson(file);
    const values = () => {
      const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
      rig.setPlaybackLimit(0);
      const out = [];
      for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) {
        out.push([...rig.evaluate(f, undefined, new Map())].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, norm(m)]));
      }
      return { out, problems: [...rig.problems].sort() };
    };
    setNodeDefCompile(false);
    let a;
    try { a = values(); } finally { setNodeDefCompile(true); }
    assert.deepEqual(values(), a, file);
  }
});

test('項の多い式（数万項の足し算）も入れ子にせずに関数にし、結果は同じ', () => {
  const N = 20000;
  const terms = Array.from({ length: N }, (_, i) => inp(i % 3));
  const d = compileNodeDef({ type: 't', attributes: attrs, ir: [['set', out(0), ['ch', Array(N - 1).fill('+'), terms]]] });
  assert.ok(d.compiled);
  for (let seed = 1; seed <= 5; seed++) assert.deepEqual(snapshot(() => d.run(makeIo(seed))), snapshot(() => d.interpret(makeIo(seed))));
});
