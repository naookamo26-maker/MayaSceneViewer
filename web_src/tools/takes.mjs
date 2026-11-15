// コマンドラインのテイクの取り出し（python -m ma_viewer take・pack --take から呼ぶ）。
//   node tools/takes.mjs sources.json out.json [--namespace NS ...]
// sources.json: ma_viewer/take.py の read_sources が作るテイクの元の一覧（.msva のテイク・シーン）。
// シーンからは名前空間ごとにテイクを取り出し（takes.js の extractTakes。ビューアと同じ処理）、テイクの一覧（数値の配列は
// base64）を out.json に書く。標準出力に 1 行ずつ「名前<TAB>名前空間<TAB>範囲<TAB>結び付けの数」を出す。
import { readFileSync, writeFileSync } from 'node:fs';
import { decodeTake, encodeTake, extractTakes } from '../src/takes.js';

const args = process.argv.slice(2);
const namespaces = [];
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--namespace') namespaces.push(args[++i] ?? '');
  else files.push(args[i]);
}
const [src, out] = files;
const sources = JSON.parse(readFileSync(src, 'utf8'));
const takes = [];
for (const s of sources) {
  if (s.kind === 'takes') {
    for (const t of s.takes || []) if (!namespaces.length || namespaces.includes(t.namespace || '')) takes.push(decodeTake(t));
  } else if (s.kind === 'scene') {
    takes.push(...extractTakes(s.scene, s.name || '', namespaces.length ? namespaces : null).map(decodeTake));
    // 参照先を読み込めなかったリファレンスのテイク（Python がリファレンスの編集から取り出したもの）
    for (const t of s.takes || []) if (!namespaces.length || namespaces.includes(t.namespace || '')) takes.push(decodeTake(t));
  }
}
writeFileSync(out, JSON.stringify(takes.map(encodeTake)));
for (const t of takes) console.log([t.name, t.namespace || '', `${t.start}-${t.end}`, t.bindings.length].join('\t'));
