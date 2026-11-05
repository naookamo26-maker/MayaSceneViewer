// リグの専用の評価（rigCompiled.js）: 従来の評価器（RigEvaluator の汎用の経路）とビット単位で同じ結果になるか
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(path.resolve(here, '../../samples', name), 'utf8'));
const data = load('compiled_sample.json');

function makeRig(d, compiled, limit = 0) {
  const statics = d.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => statics[ni]);
  rig.useCompiled = compiled;
  rig.setPlaybackLimit(limit);
  return rig;
}
const framesOf = (rig) => { const out = []; for (let f = Math.ceil(rig.clip.start); f <= rig.clip.end; f++) out.push(f); return out; };
/** 動くノードのローカル行列（ビット単位で比べるため、そのままの数値） */
const valuesOf = (rig, f, poseOf, poseKey) => JSON.stringify([...rig.evaluate(f, poseOf, new Map(), poseKey)]
  .sort((a, b) => a[0] - b[0]).map(([ni, m]) => [ni, Array.from(m.elements)]));
const nodeIndex = (name) => data.nodes.findIndex((n) => n.name === name);

test('サンプルのリグは専用の評価になり、全フレームで従来の評価器とビット単位で同じ', () => {
  const a = makeRig(data, false), b = makeRig(data, true);
  const frames = framesOf(a);
  b.evaluate(frames[0]);
  assert.ok(b.compiledPlan, `計画を作る（${b.compiledReason}）`);
  assert.deepEqual(b.compiledPlan.counts, { simple: 4, driven: 5, constraints: 5 });
  // 逆順・整数でないフレームも
  for (const f of [...frames, ...frames.slice().reverse(), 1.5, 7.25, 29.9, 0, 40]) {
    assert.equal(valuesOf(b, f), valuesOf(a, f), `フレーム ${f}`);
  }
  assert.equal(a.compiledPlan, undefined, 'useCompiled = false なら計画を作らない');
});

test('再生キャッシュに入れたものも同じ。ポーズ確認で動かすと、影響を受けるノードだけ計算し直して合う', () => {
  const b = makeRig(data, true, 1e9), fresh = makeRig(data, false);
  const frames = framesOf(b);
  for (const f of frames) b.evaluate(f);                       // 1 回目で計画を作り、残りは専用の評価で作って覚える
  assert.ok(b.compiledPlan);
  assert.equal(b.snapshots.size, frames.length);
  for (const f of frames) {
    assert.equal(valuesOf(b, f), valuesOf(fresh, f), `キャッシュから ${f}`);
    assert.ok(b.current, `フレーム ${f} はキャッシュから`);
  }
  // c1・jt（コンストレイントのターゲット）と j0（コンストレイントで動く）を動かす: 従来の評価器が、専用の評価で覚えた
  // フレームから影響のないノードを写し、影響のあるノード（依存の記録で見分ける）だけ計算する
  for (const name of ['c1', 'jt', 'j0', 'grp']) {
    const ni = nodeIndex(name);
    const m = new Matrix4().compose(new Vector3(0.1, 0.2, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.4), new Vector3(1, 1, 1));
    const poseOf = (n) => (n === ni ? m : null), keys = new Map([[ni, name]]);
    for (const f of frames) assert.equal(valuesOf(b, f, poseOf, keys), valuesOf(fresh, f, poseOf, keys), `${name} を動かしたとき ${f}`);
    assert.ok(b.seeded > 0 || name === 'grp', `${name}: 影響のないノードは写す（${b.seeded}）`);
  }
  for (const f of frames) assert.equal(valuesOf(b, f), valuesOf(fresh, f), `追加分を戻したとき ${f}`);
});

test('扱えない種類のノードを含むリグは、計画を作らず従来の評価器で評価する（理由を残す）', () => {
  for (const [name, why] of [['ik_sample.json', /カーブ|IK/], ['math_sample.json', /チャンネルの入力/], ['sequencer_sample.json', /props/]]) {
    const d = load(name);
    const b = makeRig(d, true);
    b.evaluate(Math.ceil(b.clip.start));
    assert.equal(b.compiledPlan, null, name);
    assert.match(b.compiledReason, why, `${name}: ${b.compiledReason}`);
  }
});
