// 共有用の URL（share.js）: クエリの読み書きと、URL から読めないときの説明
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShareQuery, fetchFailureMessage, isZip, parseShareQuery } from '../src/share.js';

const DEFAULTS = { wire: false, joints: false, curves: false, lighting: 'standard', jointSize: 1, controlHidden: [],
  maps: { normal: true, roughness: false, ao: false } };

test('クエリを読む: ファイル・フレーム・カメラ・自由視点・表示の設定', () => {
  const q = parseShareQuery('?file=https://ex.com/a.msv&frame=24&camera=shotCam&wire=1&lighting=flat&jointSize=1.5'
    + '&controlHidden=ik,fk&maps=normal,ao', DEFAULTS);
  assert.equal(q.file, 'https://ex.com/a.msv');
  assert.equal(q.view.frame, 24);
  assert.deepEqual(q.view.camera, { mode: 'scene', path: 'shotCam' });
  assert.deepEqual(q.view.settings, { wire: true, lighting: 'flat', jointSize: 1.5, controlHidden: ['ik', 'fk'],
    maps: { normal: true, roughness: false, ao: true } });
  assert.deepEqual(q.invalid, []);
  const v = parseShareQuery('?view=1,2,3,4,5,6,35', DEFAULTS);
  assert.deepEqual(v.view.camera, { mode: 'free', position: [1, 2, 3], target: [4, 5, 6], fov: 35 });
});

test('読めない値は使わずに知らせる。指定がなければ view は null', () => {
  const q = parseShareQuery('?frame=abc&view=1,2&wire=maybe&maps=normal,nothing&unknown=1', DEFAULTS);
  assert.deepEqual(q.invalid.sort(), ['frame', 'maps', 'view', 'wire']);
  assert.equal(q.view, null);
  assert.equal(parseShareQuery('', DEFAULTS).view, null);
});

test('表示の状態 → クエリ → 読み戻すと同じ（基準と同じ設定は入れない）', () => {
  const state = { frame: 12.5, camera: { mode: 'free', position: [1.123456, 2, 3], target: [0, 0, 0], fov: 35 },
    settings: { wire: true, joints: false, curves: true, lighting: 'flat', jointSize: 1, controlHidden: [], maps: DEFAULTS.maps } };
  const query = buildShareQuery(state, DEFAULTS, { file: 'https://ex.com/a b.msv' });
  assert.ok(!/joints=|jointSize=|maps=/.test(query), query);          // 既定と同じものは入れない
  const back = parseShareQuery('?' + query, DEFAULTS);
  assert.equal(back.file, 'https://ex.com/a b.msv');
  assert.equal(back.view.frame, 12.5);
  assert.deepEqual(back.view.camera.position, [1.1235, 2, 3]);       // 小数 4 桁
  assert.deepEqual(back.view.settings, { wire: true, curves: true, lighting: 'flat' });
  // 基準（.msv に保存した設定）が違えば、既定と同じ値でも入れる
  const q2 = buildShareQuery({ settings: { wire: false } }, { ...DEFAULTS, wire: true });
  assert.equal(q2, 'wire=0');
  // シーンのカメラは名前
  assert.equal(buildShareQuery({ camera: { mode: 'scene', name: 'shotCam', path: '|shotCam' } }, DEFAULTS), 'camera=shotCam');
});

test('URL から読めないときの説明', () => {
  const page = 'https://viewer.example.com/viewer.html';
  assert.match(fetchFailureMessage({ url: 'a.msv', page, status: 404 }), /見つかりません（404）/);
  assert.match(fetchFailureMessage({ url: 'a.msv', page, status: 403 }), /ログインやアクセスの権限/);
  assert.match(fetchFailureMessage({ url: 'a.msv', page, contentType: 'text/html; charset=utf-8' }), /Web ページ/);
  assert.match(fetchFailureMessage({ url: 'https://other.com/a.msv', page, error: new TypeError('Failed to fetch') }), /CORS/);
  assert.match(fetchFailureMessage({ url: 'http://other.com/a.msv', page }), /https のページから http/);
  assert.match(fetchFailureMessage({ url: 'file:///C:/a.msv', page: 'file:///C:/viewer.html', error: new TypeError('x') }), /この PC 上のファイル/);
});

test('zip（.msv）かを先頭で見分ける', () => {
  assert.equal(isZip(new Uint8Array([0x50, 0x4b, 3, 4, 0]).buffer), true);
  assert.equal(isZip(new TextEncoder().encode('{"schema":1}').buffer), false);
  assert.equal(isZip(new ArrayBuffer(2)), false);
});
