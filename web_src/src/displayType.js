// Maya の表示の種類（テンプレート・リファレンス）。共通 JSON の unselectable（選べない理由）と、カーブの display から決める。
//   テンプレート … .template（祖先も含む）か、ディスプレイレイヤー・描画のオーバーライドの表示の種類がテンプレート。
//                  Maya と同じく灰色のワイヤー（シェーディングしない）で描き、ジョイント・ロケーター・カーブも灰色にする
//   リファレンス … 選べないだけで、描画はふだんと同じ（Maya と同じ）
import { Color } from 'three';

export const TEMPLATE_LABEL = 'テンプレート';
/** テンプレートの色（Maya の既定のテンプレートの灰色に近い、暗い背景で見える灰色） */
export const TEMPLATE_COLOR = new Color(0x80868d);
export const TEMPLATE_HEX = 0x80868d;

/** ノード・メッシュ・カーブ（共通 JSON の 1 件）がテンプレート表示か */
export function isTemplated(entry) {
  return !!entry && (entry.unselectable === TEMPLATE_LABEL || entry.display === 1);
}
