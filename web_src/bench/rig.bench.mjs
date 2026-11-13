// リグの評価の速さを測る（開発用）: node [--expose-gc] bench/rig.bench.mjs [--repeat N] [--save file] [--check file] [--file json]
//   samples/ の、アニメーションのある JSON をすべて読み（--file なら、その共通 JSON だけ）、範囲の全フレームをビューアと同じ順
//   （evaluate → evaluateProps → カーブの形）で評価する。
//   1 周目: 新しい評価器で 1 周（読み込み直後の再生）。2 周目以降: 同じ評価器でくり返す。
//   キャッシュなし: 再生キャッシュを使わずに評価だけをくり返す（評価そのものの速さ）。
//   固定なし: さらに、時間で変わらない値もフレームごとに計算し直す。
//   汎用（generic）: 専用の評価（rigCompiled.js）を使わず、キャッシュなしで評価する。plan: 専用の評価を使ったか。
//   最初: 新しい評価器の最初の 1 フレーム（計画を作る分を含む）。
//   キャッシュ: 1 周目のあとの再生キャッシュの playbackStats().bytes（上限の計算に使う値。MB）。
//   実メモリ: GC 後のヒープの増加の、キャッシュありとなし（上限 0）の評価器での差（MB。node --expose-gc のときだけ）。
//   大きなリグは tools/make_big_rig_sample.py で一時フォルダに作って --file で測る。
//   --save で全フレームの行列などを保存し、--check で保存した結果と同じか確かめる（高速化の前後の比較用）。
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '../../samples');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const repeat = Math.max(1, +opt('--repeat', 20));
const saveTo = opt('--save', null);
const checkWith = opt('--check', null);
const single = opt('--file', null);
const gc = typeof globalThis.gc === 'function' ? globalThis.gc : null;
// 型付き配列の中身は heapUsed に入らない（external）ので足す
const heap = () => { gc(); gc(); const m = process.memoryUsage(); return m.heapUsed + m.external; };
const mb = (b) => (b / (1024 * 1024)).toFixed(1);

function load(file) {
  const data = JSON.parse(readFileSync(single ? file : path.join(dir, file), 'utf8'));
  const anim = data.animation;
  if (!anim || !(anim.graph || []).length && !(anim.curves || []).length) return null;
  return data;
}

function makeRig(data) {
  const clip = new AnimationClip(data.animation);
  const statics = data.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(clip, data.nodes, (ni) => statics[ni]);
  const curves = (data.animation.graph || []).filter((g) => g.type === 'nurbsCurve' && g.shape >= 0).map((g) => g.id);
  return { clip, rig, curves };
}

function framesOf(clip) {
  const out = [];
  for (let f = Math.ceil(clip.start); f <= clip.end; f++) out.push(f);
  return out;
}

/** 1 フレーム分（ビューアの applyFrame と同じ順）。record があれば結果を文字列にして返す */
function step(ctx, f, record) {
  const mats = ctx.rig.evaluate(f);
  const props = ctx.rig.props.length ? ctx.rig.evaluateProps() : [];
  const shapes = ctx.curves.map((gid) => (ctx.rig.curveShape ? ctx.rig.curveShape(gid) : ctx.rig.plug(gid, 'local')));
  if (!record) return null;
  const r = (x) => (Math.abs(x) < 1e-12 ? 0 : +x.toPrecision(12));
  return JSON.stringify({
    mats: [...mats].sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, m.elements.map(r)]),
    props: props.map((p) => [p.kind, p.index, Object.entries(p.values).map(([k, v]) => [k, r(v)])]),
    shapes: shapes.map((c) => (c && c.cvs ? c.cvs.map((p) => [r(p.x), r(p.y), r(p.z)]) : null)),
  });
}

const files = single ? [path.resolve(single)]
  : readdirSync(dir).filter((f) => f.endsWith('.json') && !f.includes('expected') && !f.includes('_defs')).sort();
const saved = {};
const expected = checkWith ? JSON.parse(readFileSync(checkWith, 'utf8')) : null;
let mismatches = 0;
const rows = [];
const total = { first: 0, warm: 0, nocache: 0, generic: 0, nokeep: 0, frames: 0 };
for (const fileArg of files) {
  const data = load(fileArg);
  const file = single ? path.basename(fileArg) : fileArg;
  if (!data) { if (single) console.log(`アニメーションがありません: ${fileArg}`); continue; }
  // 1 周目（新しい評価器）。最初の 1 フレームは別に測る
  let ctx = makeRig(data);
  const frames = framesOf(ctx.clip);
  if (!frames.length) continue;
  let t0 = performance.now();
  step(ctx, frames[0], false);
  const once = performance.now() - t0;
  for (let i = 1; i < frames.length; i++) step(ctx, frames[i], false);
  const first = (performance.now() - t0) / frames.length;
  // 再生キャッシュの大きさ: 数えている値と、GC 後の実際のヒープの増加（キャッシュあり − キャッシュなしの評価器で 1 周）
  const cacheBytes = ctx.rig.playbackStats ? ctx.rig.playbackStats().bytes : 0;
  let realBytes = null;
  if (gc && 'playbackLimit' in ctx.rig) {
    const grow = (limit) => {
      let c = null;
      const h0 = heap();
      c = makeRig(data);
      if (!limit) c.rig.playbackLimit = 0;
      for (const f of frames) step(c, f, false);
      const d = heap() - h0;
      c.rig.evaluate(frames[0]);                         // 測るまで c を生かしておく
      return d;
    };
    const keep = ctx;
    ctx = null;
    realBytes = grow(true) - grow(false);
    ctx = keep;
  }
  // 2 周目以降（同じ評価器）
  t0 = performance.now();
  for (let k = 0; k < repeat; k++) for (const f of frames) step(ctx, f, false);
  const warm = (performance.now() - t0) / (frames.length * repeat);
  // キャッシュなし（評価そのもの）
  ctx = makeRig(data);
  if ('playbackLimit' in ctx.rig) ctx.rig.playbackLimit = 0;
  for (const f of frames) step(ctx, f, false);
  t0 = performance.now();
  for (let k = 0; k < repeat; k++) for (const f of frames) step(ctx, f, false);
  const nocache = (performance.now() - t0) / (frames.length * repeat);
  const plan = ctx.rig.compiledPlan ? '専用' : '汎用';
  // 汎用の経路だけ（専用の評価を使わない。キャッシュなし）
  ctx = makeRig(data);
  if ('playbackLimit' in ctx.rig) { ctx.rig.playbackLimit = 0; ctx.rig.useCompiled = false; }
  for (const f of frames) step(ctx, f, false);
  t0 = performance.now();
  for (let k = 0; k < repeat; k++) for (const f of frames) step(ctx, f, false);
  const generic = (performance.now() - t0) / (frames.length * repeat);
  // 固定なし（時間で変わらない値もフレームごとに計算する）
  ctx = makeRig(data);
  if ('playbackLimit' in ctx.rig) { ctx.rig.playbackLimit = 0; ctx.rig.keepStatic = false; }
  for (const f of frames) step(ctx, f, false);
  t0 = performance.now();
  for (let k = 0; k < repeat; k++) for (const f of frames) step(ctx, f, false);
  const nokeep = (performance.now() - t0) / (frames.length * repeat);
  rows.push({ file, nodes: ctx.rig.moving.size, graph: ctx.rig.graph.length, frames: frames.length,
    once: once.toFixed(1), first: first.toFixed(3), warm: warm.toFixed(3), nocache: nocache.toFixed(3), generic: generic.toFixed(3), plan,
    nokeep: nokeep.toFixed(3), cacheMB: mb(cacheBytes), realMB: realBytes === null ? '-' : mb(realBytes) });
  total.first += first * frames.length; total.warm += warm * frames.length; total.nocache += nocache * frames.length;
  total.nokeep += nokeep * frames.length;
  total.generic += generic * frames.length;
  total.frames += frames.length;
  // 結果の記録・照合（新しい評価器で、前後に飛ぶ順も混ぜて評価する）
  if (saveTo || expected) {
    const fresh = makeRig(data);
    const order = [...frames, ...[...frames].reverse(), ...frames.filter((_, i) => i % 3 === 0)];
    const out = {};
    for (const f of order) {
      const s = step(fresh, f, true);
      if (out[f] !== undefined && out[f] !== s) { mismatches++; console.log(`  順番で結果が変わる: ${file} フレーム ${f}`); }
      out[f] = s;
    }
    saved[file] = out;
    if (expected) {
      for (const f of frames) {
        if (!expected[file] || expected[file][f] !== out[f]) { mismatches++; console.log(`  保存した結果と違う: ${file} フレーム ${f}`); }
      }
    }
  }
}
console.table(rows);
console.log(`1 フレームあたり（ms・全サンプルの平均）: 1 周目 ${(total.first / total.frames).toFixed(3)} ・ `
  + `2 周目以降 ${(total.warm / total.frames).toFixed(3)} ・ キャッシュなし ${(total.nocache / total.frames).toFixed(3)}`
  + `（汎用の経路だけ ${(total.generic / total.frames).toFixed(3)}）・ `
  + `固定なし ${(total.nokeep / total.frames).toFixed(3)}`);
if (!gc) console.log('実メモリ（realMB）は node --expose-gc で実行したときだけ測ります');
if (saveTo) { writeFileSync(saveTo, JSON.stringify(saved)); console.log(`結果を保存しました: ${saveTo}`); }
if (expected || saveTo) {
  console.log(mismatches ? `一致しない結果: ${mismatches} 件` : '結果はすべて一致しました');
  if (mismatches) process.exitCode = 1;
}
