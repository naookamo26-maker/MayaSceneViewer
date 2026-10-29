// アニメーションカーブをビューアと同じ方法で評価する（tools/compare_anim_curves.py から呼ぶ）。
//   node tools/eval_curves.mjs in.json out.json
// in.json: { anim: 共通 JSON の animation（curves・times・values・tangentTypes・fixedTangents・fps）, samples: [[フレーム, ...], ...] }
//   （samples はカーブごと。数値の配列は、ビューアに渡すときと同じく float32 にしてから評価する）
// out.json: { values: [[値, ...], ...], slopes: [[[入りの傾き, 出の傾き], ...], ...] }（傾きは値 / フレーム）
import { readFileSync, writeFileSync } from 'node:fs';
import { AnimationClip, evaluateCurve } from '../src/animation.js';

const [input, output] = process.argv.slice(2);
const { anim, samples } = JSON.parse(readFileSync(input, 'utf8'));
const clip = new AnimationClip({ start: 0, end: 0, nodes: [], channels: [], ...anim });
const values = clip.curves.map((c, i) => (samples[i] || []).map((f) => evaluateCurve(c, f)));
const slopes = clip.curves.map((c) => Array.from({ length: c.n }, (_, k) => [c.inSlope[k], c.outSlope[k]]));
writeFileSync(output, JSON.stringify({ values, slopes }));
