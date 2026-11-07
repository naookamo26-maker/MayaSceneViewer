// ビューアの JS を 1 ファイルにまとめる: node build.mjs
// 出力は通常の <script> で読める IIFE 形式（file:// から ES モジュールを読めない環境に対応）。
// PySide6（Qt 6.5 以降、Chromium 108 以降）向けに変換する。
import { build } from 'esbuild';
import { readFileSync, statSync } from 'node:fs';

const outfile = '../ma_viewer/web/viewer.bundle.js';
// バージョンは Python 側（ma_viewer/version.py）を唯一の元にし、ビルド時に埋め込む
const versionMatch = /__version__\s*=\s*"(\d+\.\d+\.\d+)"/.exec(readFileSync('../ma_viewer/version.py', 'utf8'));
if (!versionMatch) throw new Error('ma_viewer/version.py からバージョンを読めません');
const APP_VERSION = versionMatch[1];
// 再生キャッシュを作る Web Worker（src/rigWorker.js）を先にまとめ、文字列としてビューアに埋め込む（bakeWorkers.js）
const worker = await build({
  entryPoints: ['src/rigWorker.js'],
  bundle: true,
  format: 'iife',
  target: ['chrome108'],
  minify: true,
  legalComments: 'none',
  write: false,
  logLevel: 'warning',
});
await build({
  define: { __RIG_WORKER_SOURCE__: JSON.stringify(worker.outputFiles[0].text), __APP_VERSION__: JSON.stringify(APP_VERSION) },
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  target: ['chrome108'],
  minify: true,
  legalComments: 'eof',
  outfile,
  logLevel: 'warning',
});
console.log(`ビルド完了: ${outfile}（${(statSync(outfile).size / 1024).toFixed(0)} KB・バージョン ${APP_VERSION}）`);
