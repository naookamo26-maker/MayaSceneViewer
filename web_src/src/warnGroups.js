// 警告の分類（警告の一覧を分類ごとに見出し・仕切りで分けて表示する。Qt の警告パネルとブラウザのダイアログで共通）。
// 警告は Python の変換・アニメーションの解析・ビューアから届く文章なので、文章の言葉で分ける（上から順に調べ、最初に当てはまる分類）。

const ANIM = 'アニメーション・リグ', SKIN = 'スキン・デフォーマ', MAT = 'マテリアル・テクスチャ・UV', CURVE = 'カーブ',
  MESH = 'メッシュ・形状', FILE = 'ファイル・リファレンス・単位';
export const OTHER = 'その他';
/** 表示の順番 */
export const ORDER = [FILE, MESH, MAT, SKIN, CURVE, ANIM, OTHER];
/** 調べる順番（[分類, 当てはまる言葉]） */
const RULES = [
  [ANIM, /^アニメーション[:：]/],
  [ANIM, /exprespy|expression|接続で(値が)?決まる|HumanIK|コンストレイント|自作ノード/],
  [SKIN, /skinCluster|インフルエンス|ウェイト|スキニング|バインド行列|デフォーマ|blendShape/],
  [MAT, /テクスチャ|マテリアル|UV|place2dTexture|バンプ|file ノード|layered|シェーダー|シェーダ/],
  [CURVE, /カーブ/],
  [ANIM, /IK|定義|リグ/],
  [MESH, /面|形状|メッシュ|頂点|トポロジー/],
  [FILE, /リファレンス|作業単位|角度単位|属性値|parent コマンド|親ノード|ショット|名前空間/],
];

/** 警告の文章 → 分類の名前 */
export function groupOf(text) {
  let t = String(text);
  const same = /^（同様の警告が他に \d+ 件[:：]\s*(.*)）$/.exec(t);   // 数だけ数えた警告は、その内容で分ける
  if (same) t = same[1];
  for (const [name, re] of RULES) if (re.test(t)) return name;
  return OTHER;
}

/** 表示用の文章（分類で分かる前置き「アニメーション: 」を外す） */
export function displayText(text) {
  return String(text).replace(/^アニメーション[:：]\s*/, '');
}

/** 警告の一覧 → [{ name, items: [表示用の文章] }]（ORDER の順。空の分類は出さない） */
export function groupWarnings(list) {
  const by = new Map(ORDER.map((n) => [n, []]));
  for (const w of list || []) by.get(groupOf(w)).push(displayText(w));
  return [...by].filter(([, items]) => items.length).map(([name, items]) => ({ name, items }));
}

/** 分類ごとの文章（コピー・Qt の表示用）。見出し・仕切り線・空行で分ける */
export function warningsText(list) {
  const groups = groupWarnings(list);
  if (!groups.length) return '警告はありません。';
  return groups.map((g) => [`■ ${g.name}（${g.items.length} 件）`, '─'.repeat(40), ...g.items.map((t) => `・${t}`)].join('\n'))
    .join('\n\n');
}
