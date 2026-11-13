// RigEvaluator の表示用の情報（選択したノードを動かしているもの: 接続・IK・推定）。rig.js から分けたもの（整備計画の D5）。
// メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { CHANNEL_RE } from './rig.js';

export class DisplayMethods {
  /** ノードを動かしているもの（選択ノードの情報に出す） */
  driversOf(ni) {
    const fb = this.fallback.get(ni);
    if (fb) {
      // 推定したノードは接続を使っていないので、推定のことだけを示す
      const base = fb.anchor >= 0 ? this.sceneNodes[fb.anchor].name : 'ワールド';
      return [`推定: ${(fb.unresolved || []).join('・') || '親の位置'} を求められないため、${base} からの相対をバインドポーズの形で表示`];
    }
    const out = this.tainted.has(ni) ? ['不明: 未対応のノードの影響で値を求められません（ファイルの値・既定値のまま）'] : [];
    const g = this.dagGraph.get(ni);
    if (g && g.inputs) {
      for (const [key, src] of Object.entries(g.inputs)) {
        if (!CHANNEL_RE.test(key) || src.curve !== undefined) continue;
        const sg = this.byId.get(src.node);
        if (sg) out.push(`${key} ← ${sg.name}（${sg.type}）`);
      }
    }
    if (this.ikJoint.has(ni)) {
      const h = this.byId.get(this.ikJoint.get(ni));
      out.push(`r ← ${h.name}（IK）`);
    }
    return out;
  }
}
