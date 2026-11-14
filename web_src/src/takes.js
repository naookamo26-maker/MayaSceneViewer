// テイク（アニメーションだけの入出力）: シーンのアニメーションを「土台」と「テイク」に分け、別のシーンの土台にテイクを当てる。
// DOM に依存しない純粋な関数なので、Node.js 上でもテストできる（tests/takes.test.mjs）。
//
//   splitAnimation(scene, namespace)   → { base, take }  名前空間 1 つ分のアニメーション側のもの（キー・レイヤー・Trax）を外す
//   composeAnimation(scene, base, [{ take, namespace }]) → { animation, report }  土台にテイクを当てた animation を作る
//
// 形式は docs/data_format.md の「テイク」。カーブの番号（animation.curves の位置）を指す所は 5 つ:
// channels[].curve・graph[].inputs[属性].curve・props[].inputs[属性].curve・ドリブンキーの graph[].curve・
// Trax の graph[].trax.clips[].channels。分けるときも当てるときも、すべて振り直す。
// 元の animation（とキーの配列）は書き換えない。組み立てのたびに新しいオブジェクトと配列を作る。
import { Matrix4 } from 'three';
import { composeLocalMatrix, decodeArray } from './animation.js';

const CHANNELS = new Set(['tx', 'ty', 'tz', 'rx', 'ry', 'rz', 'sx', 'sy', 'sz']);
const VIS_ATTRS = new Set(['v', 'lodv', 'ove', 'ovv', 'lv', 'le']);
const PROP_TARGETS = new Set(['node', 'mesh', 'curve', 'shape']);       // テイクで運ぶ props（camera・place2d は運ばない）
const ROTATE_ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const AXES = ['x', 'y', 'z'];
// キーのない値に入れない、DAG ノードの標準の属性（優先角度など。リグの作りなので、別のリグには運ばない）
const STATIC_SKIP = new Set(['pa', 'pax', 'pay', 'paz']);
const CM_PER_UNIT = { mm: 0.1, cm: 1, m: 100, km: 100000, in: 2.54, ft: 30.48, yd: 91.44, mi: 160934.4 };

/** 名前（DAG のパスなら最後の階層）の名前空間（`armA:prop:crate` → `armA:prop`。なければ ''） */
export function namespaceOf(name) {
  const leaf = String(name || '').split('|').pop();
  const i = leaf.lastIndexOf(':');
  return i > 0 ? leaf.slice(0, i) : '';
}

/** パス（または名前）の各階層から、名前空間 ns を外す（ns が '' なら何もしない） */
export function stripNamespace(path, ns) {
  if (!ns) return String(path || '');
  const pre = ns + ':';
  return String(path || '').split('|').map((c) => (c.startsWith(pre) ? c.slice(pre.length) : c)).join('|');
}

/** アニメーション側のノード（土台から外して、テイクの nodes で運ぶもの）の型か */
export function isAnimationNode(g) {
  return g.type === 'animLayer' || String(g.type).startsWith('animBlendNode') || (g.type === 'character' && !!g.trax);
}

/** 名前空間 ns のリグに対して、リグの外（ショット側）にあるものか。ns が '' のシーンは、すべて外とする */
function outside(name, ns) {
  return ns === '' || namespaceOf(name) !== ns;
}

const isTimeCurve = (c) => !!c && (!c.type || c.type[0] === 'T');

/** キーの配列を型付き配列にする（なければ空） */
function keyArrays(anim) {
  return {
    times: decodeArray(anim.times), values: decodeArray(anim.values),
    types: decodeArray(anim.tangentTypes, Uint8Array), fixed: decodeArray(anim.fixedTangents),
  };
}

/** 固定の接線を、キーの番号 → 5 つ組の位置の一覧にする */
function fixedIndex(fixed) {
  const m = new Map();
  for (let i = 0; i + 4 < fixed.length; i += 5) m.set(fixed[i], i);
  return m;
}

/**
 * カーブを詰め直す。order は元のカーブの番号の並び（新しい番号の順）。
 * @returns { curves, times, values, tangentTypes, fixedTangents }（型付き配列）
 */
function packCurves(anim, ka, order, fx = fixedIndex(ka.fixed)) {
  let n = 0;
  for (const ci of order) n += anim.curves[ci].count | 0;
  const times = new Float32Array(n), values = new Float32Array(n), types = new Uint8Array(n * 2);
  const fixed = [];
  const curves = [];
  let off = 0;
  for (const ci of order) {
    const c = anim.curves[ci];
    const cnt = c.count | 0;
    times.set(ka.times.subarray(c.offset, c.offset + cnt), off);
    values.set(ka.values.subarray(c.offset, c.offset + cnt), off);
    if (ka.types.length >= (c.offset + cnt) * 2) types.set(ka.types.subarray(c.offset * 2, (c.offset + cnt) * 2), off * 2);
    for (let k = 0; k < cnt; k++) {
      const p = fx.get(c.offset + k);
      if (p !== undefined) fixed.push(off + k, ka.fixed[p + 1], ka.fixed[p + 2], ka.fixed[p + 3], ka.fixed[p + 4]);
    }
    curves.push({ ...c, offset: off, count: cnt });
    off += cnt;
  }
  return { curves, times, values, tangentTypes: types, fixedTangents: Float32Array.from(fixed) };
}

/** 空のアニメーション（アニメーションのないシーンの土台） */
export function emptyAnimation(scene = {}) {
  return {
    fps: 24, timeUnit: 'film', upAxis: (scene.source && scene.source.upAxis) || 'y', start: 1, end: 1, animStart: 1, animEnd: 1,
    current: 1, curves: [], channels: [], nodes: [], graph: [], props: [], nodeDefs: {}, fallback: [], tainted: [],
    times: new Float32Array(0), values: new Float32Array(0), tangentTypes: new Uint8Array(0), fixedTangents: new Float32Array(0),
    warnings: [],
  };
}

/** シーンの中の、props の対象のパス（なければ null） */
function propTargetPath(scene, kind, index) {
  if (kind === 'node' || kind === 'shape') return scene.nodes[index] ? scene.nodes[index].path : null;
  if (kind === 'mesh') return (scene.meshes || [])[index] ? scene.meshes[index].path || scene.meshes[index].name : null;
  if (kind === 'curve') return (scene.curves || [])[index] ? scene.curves[index].path || scene.curves[index].name : null;
  return null;
}

/** カメラ（とそのシェイプ）の transform のノード番号 */
function cameraNodes(scene) {
  const s = new Set();
  for (const c of scene.cameras || []) if (Number.isInteger(c.transform) && c.transform >= 0) s.add(c.transform);
  return s;
}

/**
 * テイクにできる名前空間の一覧（アニメーション側のものが当たる名前空間。数の多い順）。
 * 名前空間のないシーンは [''] になる。
 */
export function takeNamespaces(scene) {
  const anim = scene && scene.animation;
  if (!anim || !(anim.curves || []).length) return [];
  const count = new Map();
  for (const ns of candidateNamespaces(scene)) {
    const { take } = splitAnimation(scene, ns);
    if (take && take.bindings.length) count.set(ns, take.bindings.length);
  }
  return [...count.keys()].sort((a, b) => count.get(b) - count.get(a));
}

/** シーンに出てくる名前空間（'' を含む） */
function candidateNamespaces(scene) {
  const s = new Set(['']);
  for (const n of scene.nodes || []) s.add(namespaceOf(n.name || n.path));
  for (const g of (scene.animation && scene.animation.graph) || []) s.add(namespaceOf(g.name));
  return [...s];
}

/**
 * シーンのアニメーションを、名前空間 ns の「土台」と「テイク」に分ける。
 * @param scene 共通 JSON（nodes・animation・cameras・meshes・curves・source）
 * @param ns 名前空間（'' は名前空間なし。カメラを除いた全体）
 * @param opts { name: テイクの名前, source: テイクの source }
 * @returns { base: 土台の animation, take: テイク（結び付けがなければ bindings は空） }
 */
export function splitAnimation(scene, ns = '', opts = {}) {
  const anim = scene.animation;
  if (!anim) return { base: emptyAnimation(scene), take: null };
  const nodes = scene.nodes || [];
  const graph = anim.graph || [];
  const props = anim.props || [];
  const curves = anim.curves || [];
  const byId = new Map(graph.map((g) => [g.id, g]));
  const cams = cameraNodes(scene);
  const nodeNs = (ni) => (nodes[ni] ? namespaceOf(nodes[ni].name || nodes[ni].path) : null);
  const graphTarget = (g) => (g.dag >= 0 ? (nodes[g.dag] ? nodes[g.dag].path : g.name) : g.name);
  const graphNs = (g) => (g.dag >= 0 ? nodeNs(g.dag) : namespaceOf(g.name));
  const graphCam = (g) => g.dag >= 0 && cams.has(g.dag);
  const propNs = (p) => {
    if (!PROP_TARGETS.has(p.kind)) return null;
    const path = propTargetPath(scene, p.kind, p.index);
    if (path === null) return null;
    if ((p.kind === 'node' || p.kind === 'shape') && cams.has(p.index)) return null;
    return namespaceOf(path);
  };

  // --- アニメーション側のノード: 下流（それを読むノード・props）をたどり、当たる相手の名前空間を調べる ---
  const consumers = new Map();          // id → [{ g } | { p }]
  const addConsumer = (id, c) => { if (!consumers.has(id)) consumers.set(id, []); consumers.get(id).push(c); };
  for (const g of graph) for (const src of Object.values(g.inputs || {})) if (src && src.node !== undefined) addConsumer(src.node, { g });
  for (const p of props) for (const src of Object.values(p.inputs || {})) if (src && src.node !== undefined) addConsumer(src.node, { p });
  const candidate = new Set(graph.filter((g) => isAnimationNode(g) && outside(g.name, ns)).map((g) => g.id));
  const terminalsOf = (id) => {
    const out = [];
    const seen = new Set([id]);
    const stack = [id];
    while (stack.length) {
      const x = stack.pop();
      for (const c of consumers.get(x) || []) {
        if (c.g && candidate.has(c.g.id)) {
          if (!seen.has(c.g.id)) { seen.add(c.g.id); stack.push(c.g.id); }
        } else {
          out.push(c.g ? (graphCam(c.g) ? null : graphNs(c.g)) : propNs(c.p));
        }
      }
    }
    return out;
  };
  const inTake = new Set();             // テイクに入れるアニメーション側のノード
  const dropFromBase = new Set();       // 土台から外すもの（下流がすべてこの名前空間のもの）
  for (const id of candidate) {
    const t = terminalsOf(id);
    if (!t.some((x) => x === ns)) continue;
    inTake.add(id);
    if (t.every((x) => x === ns)) dropFromBase.add(id);
  }

  // --- 結び付け ---------------------------------------------------------------
  const takeCurve = new Map();          // 元のカーブの番号 → テイクのカーブの番号
  const takeCurveOrder = [];
  const tc = (ci) => {
    if (!takeCurve.has(ci)) { takeCurve.set(ci, takeCurveOrder.length); takeCurveOrder.push(ci); }
    return takeCurve.get(ci);
  };
  const takeNode = new Map();           // graph の id → テイクの nodes の番号
  const takeNodeOrder = graph.filter((g) => inTake.has(g.id));
  takeNodeOrder.forEach((g, i) => takeNode.set(g.id, i));
  // テイクに入れるカーブ: 時間のカーブで、リグの外にあるもの（Trax のクリップのカーブは character と一緒に運ぶ）
  const curveTakes = (ci) => {
    const c = curves[ci];
    return isTimeCurve(c) && !c.trax && outside(c.name, ns);
  };
  const bindings = [];
  const bindingKey = new Set();
  const removeChannel = new Set();      // channels の位置
  const removeInput = new Map();        // graph の id → 外す属性の集合
  const removePropInput = new Map();    // props の位置 → 外す属性の集合
  const mark = (m, k, attr) => { if (!m.has(k)) m.set(k, new Set()); m.get(k).add(attr); };
  const pushBinding = (b) => {
    const key = `${b.prop || ''}|${b.target}|${b.attr}`;
    if (bindingKey.has(key)) return;
    bindingKey.add(key);
    bindings.push(b);
  };
  (anim.channels || []).forEach((ch, i) => {
    if (cams.has(ch.node) || nodeNs(ch.node) !== ns || !curveTakes(ch.curve)) return;
    removeChannel.add(i);
    pushBinding({ target: nodes[ch.node].path, attr: ch.attr, curve: tc(ch.curve) });
  });
  for (const g of graph) {
    if (inTake.has(g.id)) continue;
    const hit = !graphCam(g) && graphNs(g) === ns;
    for (const [attr, src] of Object.entries(g.inputs || {})) {
      if (!hit || !src) continue;
      if (src.curve !== undefined && g.curve === undefined && curveTakes(src.curve)) {
        mark(removeInput, g.id, attr);
        pushBinding({ target: graphTarget(g), attr, curve: tc(src.curve) });
      } else if (src.node !== undefined && inTake.has(src.node)) {
        mark(removeInput, g.id, attr);
        pushBinding({ target: graphTarget(g), attr, from: { node: takeNode.get(src.node), attr: src.attr } });
      }
    }
  }
  props.forEach((p, pi) => {
    if (propNs(p) !== ns) return;
    const target = propTargetPath(scene, p.kind, p.index);
    for (const [attr, src] of Object.entries(p.inputs || {})) {
      if (!src) continue;
      const b = { target, attr, prop: p.kind };
      if (src.curve !== undefined && curveTakes(src.curve)) b.curve = tc(src.curve);
      else if (src.node !== undefined && inTake.has(src.node)) b.from = { node: takeNode.get(src.node), attr: src.attr };
      else continue;
      mark(removePropInput, pi, attr);
      pushBinding(b);
    }
  });

  // --- テイクの nodes（アニメーション側のノード）-----------------------------------
  const takeNodes = takeNodeOrder.map((g) => {
    const e = {};
    for (const [k, v] of Object.entries(g)) if (k !== 'id' && k !== 'dag' && k !== 'inputs' && k !== 'trax') e[k] = v;
    if (g.attrs) e.attrs = { ...g.attrs };
    const inputs = {};
    for (const [attr, src] of Object.entries(g.inputs || {})) {
      if (!src) continue;
      if (src.curve !== undefined) inputs[attr] = { curve: tc(src.curve) };
      else if (src.node !== undefined && takeNode.has(src.node)) inputs[attr] = { node: takeNode.get(src.node), attr: src.attr };
      else if (src.node !== undefined && byId.has(src.node)) inputs[attr] = { target: graphTarget(byId.get(src.node)), attr: src.attr };
    }
    if (Object.keys(inputs).length) e.inputs = inputs;
    if (g.trax) {
      e.trax = { ...g.trax, clips: (g.trax.clips || []).map((c) => {
        const chs = {};
        for (const [k, ci] of Object.entries(c.channels || {})) chs[k] = tc(ci);
        return { ...c, channels: chs };
      }) };
    }
    return e;
  });

  // --- キーのない値: キーのある相手の、キーのない t・r・s と独自の属性 ------------------
  const bound = new Map();              // 相手 → 結び付けた属性
  for (const b of bindings) if (!b.prop) mark(bound, b.target, b.attr);
  const restOf = new Map((anim.nodes || []).map((e) => [e.node, e]));
  const nodeByPath = new Map(nodes.map((n, i) => [n.path, i]));
  const graphByTarget = new Map(graph.map((g) => [graphTarget(g), g]));
  const statics = [];
  for (const [target, attrs] of bound) {
    const values = {};
    const ni = nodeByPath.get(target);
    const rest = ni !== undefined ? restOf.get(ni) : null;
    if (rest) {
      for (const base of ['t', 'r', 's']) {
        AXES.forEach((ax, k) => {
          const a = base + ax;
          if (!attrs.has(a) && Array.isArray(rest[base]) && Number.isFinite(rest[base][k])) values[a] = rest[base][k];
        });
      }
    }
    const g = graphByTarget.get(target);
    if (g && g.attrs && (g.dag < 0 || g.type === 'transform' || g.type === 'joint')) {
      for (const [a, v] of Object.entries(g.attrs)) {
        if (typeof v !== 'number' || attrs.has(a) || VIS_ATTRS.has(a) || STATIC_SKIP.has(a) || (g.inputs && g.inputs[a])) continue;
        if (g.dag < 0) continue;                  // DG ノード（リグの計算ノード）の値はリグの作りなので運ばない
        values[a] = v;
      }
    }
    if (Object.keys(values).length) statics.push({ target, values });
  }

  // --- 警告: ショット側で足したコンストレイント（運ばない） ---------------------------
  const warnings = [];
  if (ns !== '') {
    const extra = graph.filter((g) => String(g.type).endsWith('Constraint') && namespaceOf(g.name) !== ns
      && Number.isInteger(g.driven) && g.driven >= 0 && nodeNs(g.driven) === ns).map((g) => g.name);
    if (extra.length) warnings.push(`ショット側で足したコンストレイントは運びません: ${extra.join('・')}`);
  }

  // --- テイクのカーブ・キー -------------------------------------------------------
  const ka = keyArrays(anim);
  const fx = fixedIndex(ka.fixed);
  const takeKeys = packCurves(anim, ka, takeCurveOrder, fx);
  const src = scene.source || {};
  const baseName = opts.name || String(src.name || 'take').replace(/\.[^.]*$/, '');
  const take = {
    name: baseName, namespace: ns,
    source: opts.source || { kind: src.kind || 'json', name: src.name || '' },
    fps: anim.fps, timeUnit: anim.timeUnit, linearUnit: src.linearUnit || 'cm',
    start: anim.start, end: anim.end, animStart: anim.animStart ?? anim.start, animEnd: anim.animEnd ?? anim.end,
    curves: takeKeys.curves, times: takeKeys.times, values: takeKeys.values,
    tangentTypes: takeKeys.tangentTypes, fixedTangents: takeKeys.fixedTangents,
    bindings, nodes: takeNodes, statics, warnings,
  };

  // --- 土台: 外したものを除き、カーブとノードの番号を詰め直す -------------------------------
  const keptGraph = graph.filter((g) => !dropFromBase.has(g.id));
  const idMap = new Map(keptGraph.map((g, i) => [g.id, i]));
  const baseCurve = new Map();
  const baseOrder = [];
  const bc = (ci) => {
    if (!baseCurve.has(ci)) { baseCurve.set(ci, baseOrder.length); baseOrder.push(ci); }
    return baseCurve.get(ci);
  };
  const remapInputs = (inputs, removed) => {
    const out = {};
    for (const [attr, s] of Object.entries(inputs || {})) {
      if (removed && removed.has(attr)) continue;
      if (!s) continue;
      if (s.curve !== undefined) out[attr] = { ...s, curve: bc(s.curve) };
      else if (s.node !== undefined) {
        if (!idMap.has(s.node)) continue;         // 外したアニメーション側のノード（このあと結び付けで戻す）
        out[attr] = { ...s, node: idMap.get(s.node) };
      } else out[attr] = { ...s };
    }
    return out;
  };
  const channels = [];
  (anim.channels || []).forEach((ch, i) => { if (!removeChannel.has(i)) channels.push({ ...ch, curve: bc(ch.curve) }); });
  const baseGraph = keptGraph.map((g) => {
    const e = { ...g, id: idMap.get(g.id) };
    const inputs = remapInputs(g.inputs, removeInput.get(g.id));
    if (Object.keys(inputs).length) e.inputs = inputs; else delete e.inputs;
    if (g.curve !== undefined) e.curve = bc(g.curve);
    if (g.targets) e.targets = g.targets.map((t) => ({ ...t, node: idMap.has(t.node) ? idMap.get(t.node) : -1 }));
    if (g.trax) {
      e.trax = { ...g.trax, clips: (g.trax.clips || []).map((c) => {
        const chs = {};
        for (const [k, ci] of Object.entries(c.channels || {})) chs[k] = bc(ci);
        return { ...c, channels: chs };
      }) };
    }
    return e;
  });
  const baseProps = props.map((p, pi) => ({ ...p, inputs: remapInputs(p.inputs, removePropInput.get(pi)) }));
  const baseKeys = packCurves(anim, ka, baseOrder, fx);
  const base = {
    ...anim,
    curves: baseKeys.curves, times: baseKeys.times, values: baseKeys.values,
    tangentTypes: baseKeys.tangentTypes, fixedTangents: baseKeys.fixedTangents,
    channels, graph: baseGraph, props: baseProps,
    nodes: (anim.nodes || []).map((e) => ({ ...e })),
  };
  delete base.stats;
  return { base, take };
}

// ------------------------------------------------------------------ 当てる

/** 当てる先の名前の表（名前空間 tns のノード・graph・メッシュ・カーブ） */
function targetIndex(scene, base, tns) {
  const nodes = scene.nodes || [];
  const leafMap = (list, pathOf) => {
    const m = new Map();
    list.forEach((x, i) => {
      const p = pathOf(x);
      if (!p || namespaceOf(p) !== tns) return;
      const comps = stripNamespace(p, tns).split('|').filter(Boolean);
      const leaf = comps[comps.length - 1];
      if (!m.has(leaf)) m.set(leaf, []);
      m.get(leaf).push({ i, comps });
    });
    return m;
  };
  const dg = new Map();
  for (const g of base.graph || []) {
    if (g.dag >= 0 || namespaceOf(g.name) !== tns) continue;
    const k = stripNamespace(g.name, tns);
    if (!dg.has(k)) dg.set(k, []);
    dg.get(k).push(g);
  }
  return {
    node: leafMap(nodes, (n) => n.path),
    mesh: leafMap(scene.meshes || [], (m) => m.path || m.name),
    curve: leafMap(scene.curves || [], (c) => c.path || c.name),
    dg,
  };
}

/** パスの下から一致する階層の数がいちばん多いもの（同じ数が複数なら null = あいまい） */
function bestMatch(list, comps) {
  if (!list || !list.length) return { hit: null, reason: 'missing' };
  if (list.length === 1) return { hit: list[0].i };
  let best = -1, hit = null, tie = false;
  for (const c of list) {
    let k = 0;
    while (k < comps.length && k < c.comps.length && comps[comps.length - 1 - k] === c.comps[c.comps.length - 1 - k]) k++;
    if (k > best) { best = k; hit = c.i; tie = false; } else if (k === best) tie = true;
  }
  return tie ? { hit: null, reason: 'ambiguous' } : { hit };
}

/**
 * テイクの相手を当てる先で探す。
 * @returns { kind: 'node' | 'dg' | 'mesh' | 'curve', index } か { reason: 'missing' | 'ambiguous' }
 */
function resolveTarget(index, target, takeNs, kind = 'node') {
  const comps = stripNamespace(target, takeNs).split('|').filter(Boolean);
  const leaf = comps[comps.length - 1];
  if (kind === 'mesh' || kind === 'curve') {
    const r = bestMatch(index[kind].get(leaf), comps);
    return r.hit !== null ? { kind, index: r.hit } : { reason: r.reason };
  }
  const isPath = String(target).includes('|');
  if (isPath || !index.dg.has(leaf)) {
    const r = bestMatch(index.node.get(leaf), comps);
    if (r.hit !== null) return { kind: 'node', index: r.hit };
    if (isPath || r.reason === 'ambiguous') return { reason: r.reason };
  }
  const list = index.dg.get(leaf);
  if (!list) return { reason: 'missing' };
  return list.length === 1 ? { kind: 'dg', index: list[0].id } : { reason: 'ambiguous' };
}

/** 結び付けのうち、当てる先の名前空間 tns で相手が見つかる数 */
export function countMatches(scene, take, tns, base = null) {
  const b = base || (scene.animation ? { graph: scene.animation.graph || [] } : { graph: [] });
  const index = targetIndex(scene, b, tns);
  let n = 0;
  for (const bd of take.bindings || []) {
    const r = resolveTarget(index, bd.target, take.namespace || '', bd.prop || 'node');
    if (r.kind) n++;
  }
  return n;
}

/**
 * テイクを当てる先の名前空間を決める（当たる結び付けのいちばん多いもの。同じならテイクの名前空間、それもなければ最初のもの）
 * @returns { namespace, count }
 */
export function chooseNamespace(scene, take) {
  let best = null;
  for (const ns of candidateNamespaces(scene)) {
    const n = countMatches(scene, take, ns);
    if (!best || n > best.count || (n === best.count && n > 0 && ns === (take.namespace || '') && best.namespace !== ns)) {
      best = { namespace: ns, count: n };
    }
  }
  return best || { namespace: '', count: 0 };
}

/** ノードのローカル行列の材料（restNodes か、なければ nodes[].attrs から作る）。warn は形がずれうるとき true */
function restEntryOf(scene, ni) {
  const r = (scene.restNodes || []).find((e) => e.node === ni);
  if (r) return { entry: cloneEntry(r), warn: false };
  const n = scene.nodes[ni];
  const a = n.attrs || {};
  const ro = ROTATE_ORDERS.indexOf(a.ro || 'xyz');
  const e = {
    node: ni, joint: n.type === 'joint', ro: ro >= 0 ? ro : 0,
    t: (a.t || [0, 0, 0]).slice(), r: (a.r || [0, 0, 0]).slice(), s: (a.s || [1, 1, 1]).slice(), ra: [0, 0, 0],
  };
  if (n.type === 'joint') e.jo = (a.jo || [0, 0, 0]).slice();
  if (n.opm) e.opm = n.opm.slice();
  // 材料から作った行列がファイルの行列と違えば（ピボット・rotateAxis など）、形がずれる
  let warn = false;
  if (Array.isArray(n.matrix) && n.matrix.length === 16) {
    const m = composeLocalMatrix(cloneEntry(e), null, new Matrix4());
    const el = m.elements;
    warn = el.some((v, i) => Math.abs(v - n.matrix[i]) > 1e-4 * Math.max(1, Math.abs(n.matrix[i])));
  }
  return { entry: e, warn };
}

function cloneEntry(e) {
  const o = { ...e };
  for (const k of ['t', 'r', 's', 'ra', 'jo', 'rp', 'sp', 'rpt', 'spt', 'sh']) if (Array.isArray(e[k])) o[k] = e[k].slice();
  return o;
}

const REASONS = { missing: '相手がない', ambiguous: 'あいまい', attr: '属性がない', connected: 'リグの接続がある' };

/** report の理由の文言 */
export function reasonText(reason) { return REASONS[reason] || reason; }

/**
 * 土台にテイクを当てた animation を作る（元の base・テイクは書き換えない）。
 * @param scene 当てる先のシーン（nodes・meshes・curves・restNodes・source）
 * @param base splitAnimation で作った土台
 * @param entries [{ take, namespace: 当てる先の名前空間 }]（範囲とフレームレートは最後のテイクのもの）
 * @returns { animation, report: { applied, missed: [{ target, attr, reason }], staticsMissed, warnings } }
 */
export function composeAnimation(scene, base, entries) {
  const report = { applied: 0, missed: [], staticsMissed: 0, warnings: [] };
  const ka = keyArrays(base);
  // 写す（graph・channels・props・nodes・カーブ）
  const graph = (base.graph || []).map((g) => ({ ...g, inputs: g.inputs ? { ...g.inputs } : undefined, attrs: g.attrs ? { ...g.attrs } : undefined }));
  for (const g of graph) { if (!g.inputs) delete g.inputs; if (!g.attrs) delete g.attrs; }
  const channels = (base.channels || []).map((c) => ({ ...c }));
  const props = (base.props || []).map((p) => ({ ...p, inputs: { ...(p.inputs || {}) } }));
  const restNodes = (base.nodes || []).map(cloneEntry);
  const restOf = new Map(restNodes.map((e) => [e.node, e]));
  const curves = (base.curves || []).map((c) => ({ ...c }));
  let nKeys = ka.times.length;
  for (const { take } of entries) nKeys += take ? decodeArray(take.times).length : 0;
  const times = new Float32Array(nKeys), values = new Float32Array(nKeys), types = new Uint8Array(nKeys * 2);
  times.set(ka.times); values.set(ka.values); types.set(ka.types.subarray(0, Math.min(ka.types.length, ka.times.length * 2)));
  const fixed = Array.from(ka.fixed);
  let keyOff = ka.times.length;
  const dagGraph = new Map(graph.filter((g) => g.dag >= 0).map((g) => [g.dag, g]));
  const sceneUnit = CM_PER_UNIT[(scene.source && scene.source.linearUnit) || 'cm'] || 1;
  const warnedRest = [];
  let last = null;

  const ensureRest = (ni) => {
    if (restOf.has(ni)) return restOf.get(ni);
    const { entry, warn } = restEntryOf(scene, ni);
    if (warn) warnedRest.push(scene.nodes[ni].name);
    restNodes.push(entry);
    restOf.set(ni, entry);
    return entry;
  };
  const ensureGraphNode = (ni) => {
    if (dagGraph.has(ni)) return dagGraph.get(ni);
    const n = scene.nodes[ni];
    const g = { id: graph.length, name: n.name, type: n.type, dag: ni };
    graph.push(g);
    dagGraph.set(ni, g);
    ensureRest(ni);
    return g;
  };
  const setInput = (g, attr, src) => {
    const cur = g.inputs && g.inputs[attr];
    if (cur && cur.curve === undefined) return false;       // リグの接続がある属性には当てない
    if (!g.inputs) g.inputs = {};
    g.inputs[attr] = src;
    return true;
  };
  const attrName = (g, attr) => (g && g.names && g.names[attr]) || attr;

  for (const { take, namespace } of entries) {
    if (!take) continue;
    last = take;
    const tns = namespace ?? '';
    const takeNs = take.namespace || '';
    const index = targetIndex(scene, { graph }, tns);
    // カーブとキー（長さの単位が違えば、移動のカーブの値と接線を直す）
    const t = keyArrays(take);
    const unitK = (CM_PER_UNIT[take.linearUnit || 'cm'] || 1) / sceneUnit;
    const curveBase = curves.length;
    const tfx = fixedIndex(t.fixed);
    for (const c of take.curves || []) {
      const cnt = c.count | 0;
      const k = c.type === 'TL' && Math.abs(unitK - 1) > 1e-12 ? unitK : 1;
      times.set(t.times.subarray(c.offset, c.offset + cnt), keyOff);
      const v = t.values.subarray(c.offset, c.offset + cnt);
      if (k === 1) values.set(v, keyOff); else for (let i = 0; i < cnt; i++) values[keyOff + i] = v[i] * k;
      if (t.types.length >= (c.offset + cnt) * 2) types.set(t.types.subarray(c.offset * 2, (c.offset + cnt) * 2), keyOff * 2);
      for (let i = 0; i < cnt; i++) {
        const p = tfx.get(c.offset + i);
        if (p !== undefined) fixed.push(keyOff + i, t.fixed[p + 1], t.fixed[p + 2] * k, t.fixed[p + 3], t.fixed[p + 4] * k);
      }
      curves.push({ ...c, offset: keyOff, count: cnt });
      keyOff += cnt;
    }
    // 相手を引く（graph のノードの id。DAG ノードは graph になければ足す）
    const graphIdOf = (target) => {
      const r = resolveTarget(index, target, takeNs, 'node');
      if (!r.kind) return { reason: r.reason };
      if (r.kind === 'dg') return { id: r.index };
      return { id: ensureGraphNode(r.index).id, node: r.index };
    };
    // テイクの nodes を graph の後ろに足す
    const nodeBase = graph.length;
    const added = (take.nodes || []).map((n, i) => {
      const g = { ...n, id: nodeBase + i, dag: -1 };
      if (n.attrs) g.attrs = { ...n.attrs };
      delete g.inputs;
      if (n.trax) {
        g.trax = { ...n.trax, clips: (n.trax.clips || []).map((c) => {
          const chs = {};
          for (const [k, ci] of Object.entries(c.channels || {})) chs[k] = ci + curveBase;
          return { ...c, channels: chs };
        }) };
      }
      return g;
    });
    graph.push(...added);
    (take.nodes || []).forEach((n, i) => {
      const g = added[i];
      const inputs = {};
      for (const [attr, s] of Object.entries(n.inputs || {})) {
        if (s.curve !== undefined) inputs[attr] = { curve: s.curve + curveBase };
        else if (s.node !== undefined) inputs[attr] = { node: nodeBase + s.node, attr: s.attr };
        else if (s.target !== undefined) {
          const r = graphIdOf(s.target);
          if (r.id === undefined) { report.missed.push({ target: s.target, attr: s.attr, reason: r.reason }); continue; }
          inputs[attr] = { node: r.id, attr: attrName(graph[r.id], s.attr) };
        }
      }
      if (Object.keys(inputs).length) g.inputs = inputs;
    });
    // 結び付け
    const keyed = new Map();            // ノード番号 → カーブ・接続で決まる属性
    for (const b of take.bindings || []) {
      const src = b.curve !== undefined ? { curve: b.curve + curveBase } : b.from ? { node: nodeBase + b.from.node, attr: b.from.attr } : null;
      if (!src) continue;
      const miss = (reason) => report.missed.push({ target: b.target, attr: b.attr, reason });
      if (b.prop) {
        // 表示（props）
        const kind = b.prop;
        const r = resolveTarget(index, b.target, takeNs, kind);
        if (!r.kind || (kind === 'node' && r.kind !== 'node')) { miss(r.reason || 'missing'); continue; }
        let p = props.find((x) => x.kind === kind && x.index === r.index);
        if (!p) {
          p = { kind, index: r.index, inputs: {}, static: visStatic(scene, kind, r.index) };
          props.push(p);
        }
        p.inputs[b.attr] = src;
        report.applied++;
        continue;
      }
      const r = resolveTarget(index, b.target, takeNs, 'node');
      if (!r.kind) { miss(r.reason); continue; }
      if (r.kind === 'node' && CHANNELS.has(b.attr)) {
        const ni = r.index;
        const g = dagGraph.get(ni);
        if (g && g.inputs && g.inputs[b.attr] && g.inputs[b.attr].curve === undefined) { miss('connected'); continue; }
        if (b.curve !== undefined) {
          ensureRest(ni);
          const old = channels.findIndex((c) => c.node === ni && c.attr === b.attr);
          if (old >= 0) channels.splice(old, 1);
          channels.push({ node: ni, attr: b.attr, curve: src.curve });
          if (g) setInput(g, b.attr, src);
        } else {
          setInput(ensureGraphNode(ni), b.attr, src);
        }
        if (!keyed.has(ni)) keyed.set(ni, new Set());
        keyed.get(ni).add(b.attr);
        report.applied++;
        continue;
      }
      const g = r.kind === 'dg' ? graph[r.index] : ensureGraphNode(r.index);
      if (!setInput(g, attrName(g, b.attr), src)) { miss('connected'); continue; }
      report.applied++;
    }
    // キーのない値
    for (const s of take.statics || []) {
      const r = resolveTarget(index, s.target, takeNs, 'node');
      if (!r.kind) { report.staticsMissed += Object.keys(s.values || {}).length; continue; }
      const ni = r.kind === 'node' ? r.index : -1;
      const g = r.kind === 'dg' ? graph[r.index] : dagGraph.get(ni);
      const keys = keyed.get(ni) || new Set();
      for (const [a, v] of Object.entries(s.values || {})) {
        if (typeof v !== 'number') continue;
        if (ni >= 0 && CHANNELS.has(a)) {
          const e = restOf.get(ni);
          if (!e || keys.has(a)) { if (!e) report.staticsMissed++; continue; }
          const k = a[0] === 't' ? unitK : 1;
          e[a[0]][AXES.indexOf(a[1])] = v * k;
        } else if (g) {
          const name = attrName(g, a);
          if (g.inputs && g.inputs[name]) continue;
          g.attrs = { ...(g.attrs || {}), [name]: v };
        } else report.staticsMissed++;
      }
    }
    for (const w of take.warnings || []) report.warnings.push(w);
  }
  if (warnedRest.length) {
    report.warnings.push(`ローカル行列の材料がないノード（${warnedRest.slice(0, 5).join('・')}${warnedRest.length > 5 ? ' など' : ''}）は、`
      + 'ピボット・rotateAxis が合わず形がずれることがあります。');
  }
  channels.sort((a, b) => a.node - b.node || (a.attr < b.attr ? -1 : a.attr > b.attr ? 1 : 0));
  restNodes.sort((a, b) => a.node - b.node);
  const animation = {
    ...base,
    curves, channels, graph, props, nodes: restNodes,
    times, values, tangentTypes: types, fixedTangents: Float32Array.from(fixed),
  };
  delete animation.stats;
  if (last) {
    animation.fps = last.fps ?? animation.fps;
    animation.timeUnit = last.timeUnit ?? animation.timeUnit;
    animation.start = last.start;
    animation.end = last.end;
    animation.animStart = last.animStart ?? last.start;
    animation.animEnd = last.animEnd ?? last.end;
    animation.current = last.start;
  }
  return { animation, report };
}

/** props の項目を新しく作るときの static（ファイルの表示の値） */
function visStatic(scene, kind, index) {
  const x = kind === 'mesh' ? (scene.meshes || [])[index] : kind === 'curve' ? (scene.curves || [])[index] : scene.nodes[index];
  const visible = x && x.visible !== false;
  return { v: visible ? 1 : 0, lodv: 1, ove: 0, ovv: 1, layerHidden: false };
}

// ------------------------------------------------------------------ JSON

const TYPED = { times: Float32Array, values: Float32Array, tangentTypes: Uint8Array, fixedTangents: Float32Array };
const DTYPE = { times: 'float32', values: 'float32', tangentTypes: 'uint8', fixedTangents: 'float32' };

function bytesToBase64(bytes) {
  if (typeof bytes.toBase64 === 'function') return bytes.toBase64();
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

/** テイクの数値の配列を型付き配列にする（読み込んだ JSON・.msva の takes.json のテイク） */
export function decodeTake(take) {
  const t = { ...take };
  for (const [k, C] of Object.entries(TYPED)) t[k] = decodeArray(take[k], C);
  t.bindings = take.bindings || [];
  t.nodes = take.nodes || [];
  t.statics = take.statics || [];
  t.warnings = take.warnings || [];
  t.curves = take.curves || [];
  return t;
}

/** テイクを JSON にできる形にする（数値の配列は base64 の { dtype, count, data }） */
export function encodeTake(take) {
  const t = { ...take };
  for (const k of Object.keys(TYPED)) {
    const a = decodeArray(take[k], TYPED[k]);
    t[k] = { dtype: DTYPE[k], count: a.length, data: bytesToBase64(new Uint8Array(a.buffer, a.byteOffset, a.byteLength)) };
  }
  delete t.report;
  return t;
}

/** テイクのフレーム数（範囲の長さ） */
export function takeFrames(take) {
  return Math.max(0, Math.round((+take.end) - (+take.start)) + 1);
}
