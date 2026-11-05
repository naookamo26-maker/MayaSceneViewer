// 警告の分類（warnGroups.js）: 分類ごとに見出し・仕切りで分けた一覧
import test from 'node:test';
import assert from 'node:assert/strict';
import { groupOf, groupWarnings, warningsText } from '../src/warnGroups.js';

test('警告の文章から分類を決める', () => {
  const cases = [
    ['アニメーション: 移動・回転・スケール以外の属性（v）のカーブは再生しません。', 'アニメーション・リグ'],
    ['elbow: rz ← drv（myCustomDriver） が接続で決まるため、ファイルに値がありません。バインドポーズ（skinCluster の .bindPose）', 'アニメーション・リグ'],
    ['exprespy badMesh のコードを解析できません（形状（boxShape.o）の入力は変換できません（メッシュ・カーブのデータは扱えません））。', 'アニメーション・リグ'],
    ['（同様の警告が他に 2 件: 接続で値が決まるノード）', 'アニメーション・リグ'],
    ['body: skinCluster が複数あります（skin1 のみ使用）', 'スキン・デフォーマ'],
    ['skin1: ウェイトが記録されていない頂点が 3 個あります', 'スキン・デフォーマ'],
    ['body: UV のない面が 4 個あります', 'マテリアル・テクスチャ・UV'],
    ['tex1: テクスチャが見つかりません: a.png', 'マテリアル・テクスチャ・UV'],
    ['rbDShape: 形を作るノード rbD_offset（offsetCurve。カーブのオフセット）を計算できません。表示しません（スプライン IK などにも使えません）', 'カーブ'],
    ['boxShape: 形状データ（頂点・辺・面）がないため除外しました', 'メッシュ・形状'],
    ['リファレンス「arm」（名前空間 arm）を読み込みませんでした: ファイルがありません。', 'ファイル・リファレンス・単位'],
    ['作業単位が mm です。値はファイルに書かれたまま表示します（cm 以外は未検証）。', 'ファイル・リファレンス・単位'],
    ['よく分からない警告', 'その他'],
  ];
  for (const [text, want] of cases) assert.equal(groupOf(text), want, text);
});

test('分類の順に並べ、見出し（件数）・仕切り線・空行で分けた文章にする', () => {
  const list = ['よく分からない警告', 'アニメーション: カーブは再生しません。', 'body: UV のない面が 4 個あります',
    'リファレンス「arm」を読み込みませんでした。', 'アニメーション: もう 1 つ。'];
  const groups = groupWarnings(list);
  assert.deepEqual(groups.map((g) => g.name), ['ファイル・リファレンス・単位', 'マテリアル・テクスチャ・UV', 'アニメーション・リグ', 'その他']);
  assert.deepEqual(groups[2].items, ['カーブは再生しません。', 'もう 1 つ。'], '分類で分かる前置きは外す');
  const text = warningsText(list);
  assert.match(text, /^■ ファイル・リファレンス・単位（1 件）\n─+\n・リファレンス「arm」を読み込みませんでした。\n\n■ マテリアル/);
  assert.match(text, /■ アニメーション・リグ（2 件）\n─+\n・カーブは再生しません。\n・もう 1 つ。/);
  assert.equal(warningsText([]), '警告はありません。');
});
