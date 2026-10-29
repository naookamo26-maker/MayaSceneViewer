// リグのコントローラー（カーブの形のない、リグを動かすノード）の役割の判定。
// リグのグラフで「どのノードの、どの属性が、何に使われているか」から決め、目印の形・色・大きさに使う。

/** 役割（優先順。1 つのノードが複数の役割を持つときは先のものを使う） */
export const CONTROL_ROLES = ['ik', 'pole', 'spline', 'constraint', 'aim', 'switch', 'driven', 'locator', 'other'];

export const ROLE_LABELS = {
  ik: 'IK コントローラー',
  pole: 'ポールベクター',
  spline: 'スプライン IK の制御',
  constraint: 'コンストレイントのターゲット',
  aim: 'エイム・注視のターゲット',
  switch: '属性のスイッチ',
  driven: 'ドリブンキーのドライバー',
  locator: 'ロケーター・計算の材料',
  other: 'その他',
};

const CONSTRAINTS = new Set(['pointConstraint', 'orientConstraint', 'parentConstraint', 'scaleConstraint']);
const AIMS = new Set(['aimConstraint', 'lookAt']);
// 行列の属性（これを読む計算ノードの入力元は「計算の材料」）
const MATRIX_ATTRS = new Set(['wm', 'm', 'pm', 'wim', 'im', 'pim', 'xm', 'worldMatrix', 'matrix', 'parentMatrix', 'worldInverseMatrix']);
const isDrivenKey = (g) => /^animCurveU[ALTU]$/.test(g.type);

/**
 * @param graph リグのグラフ（共通 JSON の animation.graph）
 * @param nodes 共通 JSON の nodes
 * @param candidates 目印を出すノード番号の一覧
 * @returns Map<nodeIndex, { role, chain?: number[], joint?: number, lineTo?: number }>
 *   chain: 大きさの基準にするジョイントのチェーン（IK・ポールベクター・スプライン IK）
 *   joint: 大きさの基準にするジョイント（動かす先で最初に見つかったもの）
 *   lineTo: 破線で結ぶノード（ポールベクター → 肘・膝、エイム → 向くノード）
 */
export function classifyControls(graph, nodes, candidates) {
  const byId = new Map(graph.map((g) => [g.id, g]));
  const idOfDag = new Map();
  for (const g of graph) if (g.dag >= 0) idOfDag.set(g.dag, g.id);
  // 下流（入力元のグラフ id → [{ g: 使う側, key: 入力の名前, attr: 出力の属性 }]）
  const users = new Map();
  for (const g of graph) {
    for (const [key, src] of Object.entries(g.inputs || {})) {
      if (src.node === undefined) continue;
      if (!users.has(src.node)) users.set(src.node, []);
      users.get(src.node).push({ g, key, attr: src.attr });
    }
  }
  const usersOf = (id) => users.get(id) || [];
  const isJoint = (ni) => ni >= 0 && nodes[ni].type === 'joint';
  const roles = new Map();               // nodeIndex → Set(役割)
  const extra = new Map();               // nodeIndex → { chain, lineTo }
  const add = (ni, role, info) => {
    if (ni < 0 || isJoint(ni)) return;
    if (!roles.has(ni)) roles.set(ni, new Set());
    roles.get(ni).add(role);
    if (info) extra.set(ni + ':' + role, info);
  };
  const midJoint = (chain) => chain[Math.max(1, Math.floor((chain.length - 1) / 2))] ?? chain[0];

  for (const g of graph) {
    if (!g.ik || !(g.dag >= 0)) continue;
    const chain = g.ik.chain || [];
    // IK ハンドルとその親（手のコントローラーなど）
    add(g.dag, 'ik', { chain });
    const p = nodes[g.dag].parent;
    if (p >= 0) add(p, 'ik', { chain });
    // ポールベクター: IK の極ベクトル（pv）を決める poleVectorConstraint のターゲット
    for (const [key, src] of Object.entries(g.inputs || {})) {
      if (!/^pv[xyz]?$/.test(key) || src.node === undefined) continue;
      const pvc = byId.get(src.node);
      if (!pvc || pvc.type !== 'poleVectorConstraint') continue;
      for (const [k2, s2] of Object.entries(pvc.inputs || {})) {
        const t = k2.startsWith('tg[') && s2.node !== undefined ? byId.get(s2.node) : null;
        if (t && t.dag >= 0) add(t.dag, 'pole', { chain, lineTo: midJoint(chain) });
      }
    }
    // スプライン IK: カーブ（ic）の上流で形を変えるノード（cluster のハンドル・制御点につながるノードなど）
    const ic = g.inputs && g.inputs.ic;
    if (g.ik.solver === 'ikSplineSolver') {
      // ワールドの上方向に使うノード（上級ツイストの dWorldUpMatrix など）
      for (const [key, src] of Object.entries(g.inputs || {})) {
        const s = key !== 'ic' && src.node !== undefined ? byId.get(src.node) : null;
        if (s && s.dag >= 0) add(s.dag, 'spline', { chain });
      }
    }
    if (g.ik.solver === 'ikSplineSolver' && ic && ic.node !== undefined) {
      const seen = new Set();
      const stack = [ic.node];
      while (stack.length && seen.size < 500) {
        const id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        const n = byId.get(id);
        if (!n) continue;
        for (const src of Object.values(n.inputs || {})) {
          const s = src.node !== undefined ? byId.get(src.node) : null;
          if (!s) continue;
          if (s.dag >= 0) add(s.dag, 'spline', { chain });   // DAG ノードでたどるのをやめる（その先は別のリグ）
          else stack.push(s.id);
        }
      }
    }
  }

  // それ以外の役割: 入力元として使われ方を見る
  for (const ni of candidates) {
    const id = idOfDag.get(ni);
    for (const { g, key, attr } of id === undefined ? [] : usersOf(id)) {
      const target = key.startsWith('tg[');
      if (CONSTRAINTS.has(g.type) && target) add(ni, 'constraint');
      else if (AIMS.has(g.type) && (target || key === 'wum' || key === 'wuo')) {   // ターゲットか上方向のノード
        const aimed = usersOf(g.id).map((u) => u.g.dag).find((d) => d >= 0);
        add(ni, 'aim', target && aimed !== undefined ? { lineTo: aimed } : null);
      } else if (isDrivenKey(g) || (g.type === 'unitConversion' && usersOf(g.id).some((u) => isDrivenKey(u.g)))) add(ni, 'driven');
      else if (g.dag >= 0 || g.ik || g.type === 'poleVectorConstraint' || CONSTRAINTS.has(g.type) || AIMS.has(g.type)) continue;
      else if (MATRIX_ATTRS.has(attr)) add(ni, 'locator');
      else if (g.type !== 'cluster' && g.type !== 'skinCluster') add(ni, 'switch');
    }
    if (nodes[ni].shape === 'locator') add(ni, 'locator');
  }

  const out = new Map();
  for (const ni of candidates) {
    const set = roles.get(ni);
    const role = set ? CONTROL_ROLES.find((r) => set.has(r)) : 'other';
    const info = { role, ...(extra.get(ni + ':' + role) || {}) };
    if (!info.chain) {
      const j = firstJointDownstream(idOfDag.get(ni), usersOf, nodes);
      if (j >= 0) info.joint = j;
    }
    out.set(ni, info);
  }
  return out;
}

/** 入力元から下流へたどって、最初に見つかったジョイント（大きさの基準。なければ -1） */
function firstJointDownstream(startId, usersOf, nodes) {
  if (startId === undefined) return -1;
  let front = [startId];
  const seen = new Set(front);
  for (let depth = 0; depth < 8 && front.length; depth++) {
    const next = [];
    for (const id of front) {
      for (const { g } of usersOf(id)) {
        if (g.dag >= 0 && nodes[g.dag].type === 'joint') return g.dag;
        if (!seen.has(g.id)) { seen.add(g.id); next.push(g.id); }
      }
    }
    front = next;
  }
  return -1;
}

/** 名前から左右を決める（'L' | 'R' | null）。名前空間・パスは除き、_ などの区切りと小文字 → 大文字の境目で単語に分ける */
export function sideFromName(name) {
  const n = String(name).split('|').pop().split(':').pop();
  const words = n.split(/[_\-.\d]+|(?<=[a-z])(?=[A-Z])/).filter(Boolean).map((w) => w.toLowerCase());
  const l = words.some((w) => LEFT.has(w)) || /^L(?=[A-Z][a-z])/.test(n);
  const r = words.some((w) => RIGHT.has(w)) || /^R(?=[A-Z][a-z])/.test(n);
  if (l && !r) return 'L';
  if (r && !l) return 'R';
  return null;
}
const LEFT = new Set(['l', 'lf', 'lt', 'lft', 'left']);
const RIGHT = new Set(['r', 'rt', 'rgt', 'right']);
