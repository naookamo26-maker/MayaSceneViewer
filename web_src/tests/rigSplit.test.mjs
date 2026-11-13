// rig.js から分けたファイル（rigConstraints.js・rigIk.js・rigMath.js）が、使っている rig.js の名前（定数・作業用の
// オブジェクト・補助関数）をすべて import しているか（整備計画の D5）。メソッドはプロトタイプに足すので、import を
// 忘れても、その経路を通るまで ReferenceError にならない。ここでは文字列として調べる
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(path.resolve(here, '../src', f), 'utf8');

/** 最上位で宣言・import された名前（const a = 1, b = 2 の 2 つめ以降も） */
function topNames(src) {
  const names = new Set();
  for (const line of src.split('\n')) {
    let m = /^(?:export\s+)?(?:const|let|var)\s+(.*)$/.exec(line);
    if (m) {
      let depth = 0, cur = '';
      for (const ch of m[1]) {
        if ('([{'.includes(ch)) depth++;
        else if (')]}'.includes(ch)) depth--;
        else if (ch === ',' && depth === 0) { cur += '\0'; continue; }
        if (depth === 0) cur += ch;
      }
      for (const part of cur.split('\0')) { const mm = /^\s*(\w+)\s*=/.exec(part); if (mm) names.add(mm[1]); }
    }
    m = /^(?:export\s+)?(?:async\s+)?(?:function\*?|class)\s+(\w+)/.exec(line);
    if (m) names.add(m[1]);
  }
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
    for (const n of m[1].split(',')) { const x = n.trim().split(' as ').pop().trim(); if (x) names.add(x); }
  }
  for (const m of src.matchAll(/import\s+(\w+)\s+from/g)) names.add(m[1]);
  return names;
}

test('分けたファイルは、使う rig.js の名前をすべて import している', () => {
  const rigNames = topNames(read('rig.js'));
  // 分けたファイル: RigEvaluator のメソッドを持つクラス（export class 〜Methods）を書いた rig*.js
  const files = readdirSync(path.resolve(here, '../src')).filter((f) => /^rig\w+\.js$/.test(f)
    && /^export class \w+Methods /m.test(read(f)));
  assert.ok(files.length >= 4, files.join());
  for (const f of files) {
    const src = read(f);
    const have = topNames(src);
    const body = src.slice(src.indexOf('export class'));
    const missing = [...rigNames].filter((n) => !have.has(n)
      && new RegExp(`(?<![\\w.$])${n.replace(/\$/g, '\\$')}(?![\\w$:])`).test(body));
    assert.deepEqual(missing, [], f);
  }
});
