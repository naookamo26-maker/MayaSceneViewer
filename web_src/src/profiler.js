// 評価のプロファイラ: 再生・フレームの移動のあいだ、1 フレームの処理の内訳と、リグの評価の種類ごと・経路ごとの時間を記録する。
// DOM に依存しない（画面は profilerPanel.js）。記録していないあいだは、評価器に何も渡さない（速さに影響しない）。
//
// 時間の精度: ブラウザの performance.now() は、安全のため 0.1 ms 程度に丸められることがある（丸めには揺らぎがあり、
// 多くの区間を足すと平均では正しい値に近づく）。1 ノードの評価は数 µs なので、ノードごとの時間は 1 回では測れない。
// 種類ごとに、記録したフレームを通して足し合わせて出す（多く記録するほど正確。合計はリグの評価の時間と比べて示す）。
import { stepCategory } from './rigCompiled.js';

/** フレームの内訳（グラフの積み上げの順。色はこの順に分類色を割り当てる） */
export const PARTS = [
  { key: 'cache', label: '再生キャッシュから写す' },
  { key: 'compiled', label: '専用の評価' },
  { key: 'generic', label: '汎用の経路' },
  { key: 'curves', label: 'カーブの形' },
  { key: 'props', label: '接続で決まる値（表示・カメラなど）' },
  { key: 'scene', label: '行列の更新・表示・その他' },
  { key: 'render', label: '描画（CPU 側）' },
];

const MAX_FRAMES = 5000;               // 覚えるフレームの数（古いものから捨てる。種類ごとの集計は捨てない）
const CON_RE = /Constraint$|^lookAt$/;

/** 汎用の経路で評価したノードが何で動くか（RigEvaluator の接続から。専用の評価の分類と同じ名前にそろえる） */
export function nodeCategory(rig, ni) {
  if (rig.fallback && rig.fallback.has(ni)) return '推定のノード';
  if (rig.ikJoint && rig.ikJoint.has(ni)) {
    const h = rig.byId.get(rig.ikJoint.get(ni));
    return `IK（${(h && h.ik && h.ik.solver) || 'IK'}）で動くジョイント`;
  }
  if (rig.tainted && rig.tainted.has(ni)) return '値を求められないノード（未対応のノードの影響）';
  const types = new Set();
  const g = rig.dagGraph && rig.dagGraph.get(ni);
  if (g && g.inputs) {
    for (const src of Object.values(g.inputs)) {
      if (!src || src.curve !== undefined) continue;
      const sg = rig.byId.get(src.node);
      if (!sg) continue;
      types.add(sg.dag >= 0 ? 'DAG ノードの直接の接続' : CON_RE.test(sg.type) ? sg.type : `計算ノード（${sg.type}）`);
    }
  }
  if (!types.size) return 'キーで動くノード';
  return `${[...types].sort().join('・')} で動くノード`;
}

export class EvalProfiler {
  constructor() {
    this.recording = false;
    this.clear();
  }

  clear() {
    this.frames = [];                  // [{ f, path, parts: { key: ms }, total, interval, reason }]
    this.categories = new Map();       // 種類 → { label, path, nodes: Set, ms }
    this.reasons = new Map();          // 経路（汎用の経路に任せた理由など）→ { label, path, nodes: Set, ms }
    this.evaluated = 0;                // キャッシュを使わずに評価したフレームの数
    this.current = null;
    this.lastShown = 0;
    this.stepCache = new WeakMap();    // 計画の手順 → 分類
    this.nodeCache = new Map();        // 汎用の経路のノード番号 → 種類
    this.cacheRig = null;
    this.version = (this.version || 0) + 1;
  }

  start() { this.recording = true; this.lastShown = 0; this.version++; }
  stop() { this.recording = false; this.current = null; this.version++; }

  // ---------------------------------------------------------------- 1 フレーム
  /** フレームの処理を始める（記録中でなければ null を返し、何もしない） */
  beginFrame(f) {
    if (!this.recording) return null;
    this.current = { f, path: null, parts: {}, total: 0, interval: 0, genericMs: 0, reason: null, t0: performance.now() };
    return this.current;
  }

  /** 区間の時間を足す（part は PARTS の key） */
  add(part, ms) {
    const c = this.current;
    if (c) c.parts[part] = (c.parts[part] || 0) + ms;
  }

  /**
   * リグの評価の時間を、経路（rig.lastPath）に合わせて振り分ける。
   * @param reason 全体を汎用の経路で評価したときの理由
   */
  addEval(rig, ms, reason) {
    const c = this.current;
    if (!c) return;
    c.path = rig.lastPath;
    if (rig.lastPath === 'cache') { this.add('cache', ms); return; }
    this.evaluated++;
    if (rig.lastPath === 'generic') {
      this.add('generic', ms);
      c.reason = reason;
      const e = this.addReason(`汎用の経路（${reason}）`, 'generic', null, ms);
      for (const ni of rig.moving) e.nodes.add(ni);
      return;
    }
    // 専用の評価: 任せたノードの時間（手順ごとに記録した分）は汎用の経路
    const g = Math.min(c.genericMs, ms);
    this.add('generic', g);
    this.add('compiled', ms - g);
  }

  /** 専用の評価の手順ごとの時間（runPlan から。記録中だけ呼ばれる） */
  step(plan, s, ms) {
    if (this.cacheRig !== plan.rig) this.resetCaches(plan.rig);
    let cat = this.stepCache.get(s);
    if (!cat) this.stepCache.set(s, cat = stepCategory(plan, s));
    this.addCategory(cat.label, cat.path, s.ni, ms);
    if (cat.path === 'generic') {
      if (this.current) this.current.genericMs += ms;
      this.addReason(`汎用の経路に任せた: ${cat.why}`, 'generic', s.ni, ms);
    } else {
      this.addReason('専用の評価', 'compiled', s.ni, ms);
    }
  }

  /** 汎用の経路のノードごとの時間（RigEvaluator.evaluate から。記録中だけ呼ばれる） */
  node(rig, ni, ms) {
    if (this.cacheRig !== rig) this.resetCaches(rig);
    let label = this.nodeCache.get(ni);
    if (!label) this.nodeCache.set(ni, label = nodeCategory(rig, ni));
    this.addCategory(label, 'generic', ni, ms);
  }

  resetCaches(rig) {
    this.cacheRig = rig;
    this.stepCache = new WeakMap();
    this.nodeCache = new Map();
  }

  addCategory(label, path, ni, ms) {
    let e = this.categories.get(label);
    if (!e) this.categories.set(label, e = { label, path, nodes: new Set(), ms: 0 });
    e.nodes.add(ni);
    e.ms += ms;
  }

  addReason(label, path, ni, ms) {
    let e = this.reasons.get(label);
    if (!e) this.reasons.set(label, e = { label, path, nodes: new Set(), ms: 0 });
    if (ni !== null && ni !== undefined) e.nodes.add(ni);
    e.ms += ms;
    return e;
  }

  /** フレームの処理を終える（描画はこのあとの addRender で足す） */
  endFrame(now = performance.now()) {
    const c = this.current;
    if (!c) return;
    const known = PARTS.reduce((s, p) => s + (p.key === 'scene' || p.key === 'render' ? 0 : (c.parts[p.key] || 0)), 0);
    c.parts.scene = Math.max(0, now - c.t0 - known);        // 評価・カーブ・値のほか（行列の更新・オーバーレイなど）
    c.interval = this.lastShown ? now - this.lastShown : 0;
    this.lastShown = now;
    delete c.t0;
    delete c.genericMs;
    this.frames.push(c);
    if (this.frames.length > MAX_FRAMES) this.frames.splice(0, this.frames.length - MAX_FRAMES);
    this.pending = c;                  // 次の描画の時間を入れる
    this.current = null;
    this.version++;
  }

  /** 描画（renderer.render）の時間。直前に記録したフレームのものとして足す */
  addRender(ms) {
    const c = this.pending;
    if (!this.recording || !c) return;
    c.parts.render = (c.parts.render || 0) + ms;
    this.pending = null;
    this.version++;
  }

  // ---------------------------------------------------------------- 集計
  /** フレームの内訳の平均など */
  summary() {
    const fr = this.frames;
    const avg = {};
    for (const p of PARTS) avg[p.key] = 0;
    let total = 0, hits = 0, sumInterval = 0, nInterval = 0, max = 0;
    for (const e of fr) {
      let t = 0;
      for (const p of PARTS) { const v = e.parts[p.key] || 0; avg[p.key] += v; t += v; }
      e.total = t;
      total += t;
      if (t > max) max = t;
      if (e.path === 'cache') hits++;
      if (e.interval > 0 && e.interval < 1000) { sumInterval += e.interval; nInterval++; }   // 止めていた間・スクラブの間は除く
    }
    const n = fr.length || 1;
    for (const p of PARTS) avg[p.key] /= n;
    return {
      frames: fr.length, hits, evaluated: fr.length - hits, avg, total: total / n, max,
      fps: nInterval ? 1000 / (sumInterval / nInterval) : null,
    };
  }

  /** 種類ごと（mode = 'type'）・経路ごと（'path'）の行。合計時間の大きい順 */
  rows(mode) {
    const src = mode === 'path' ? this.reasons : this.categories;
    const all = [...src.values()];
    const sum = all.reduce((s, e) => s + e.ms, 0) || 1;
    const per = this.evaluated || 1;
    return all.map((e) => ({ label: e.label, path: e.path, nodes: e.nodes.size, ms: e.ms / per, share: e.ms / sum }))
      .sort((a, b) => b.ms - a.ms);
  }

  /** 評価したフレームの、種類ごとの合計（1 フレームあたり）と、リグの評価の時間（専用 + 汎用）の比較 */
  coverage() {
    let rig = 0, cats = 0;
    for (const e of this.frames) if (e.path !== 'cache') rig += (e.parts.compiled || 0) + (e.parts.generic || 0);
    for (const e of this.categories.values()) cats += e.ms;
    const per = this.evaluated || 1;
    return { rig: rig / per, categories: cats / per };
  }
}

/** バイト数を読みやすく */
export function formatBytes(b) {
  if (b < 1024 * 1024) return `${Math.max(1, Math.ceil(b / 1024))} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(b >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export const CACHE_LIMITS_MB = [128, 256, 512, 1024, 2048];

/**
 * 再生キャッシュの状態
 * @returns null（リグがない）か { moving, perFrame, frames, range, bytes, limit, fits: [[MB, フレーム数]] }
 */
export function cacheInfo(rig, clip) {
  if (!rig || !clip) return null;
  const st = rig.playbackStats();
  const L = rig.playbackLayer();
  // 1 フレームの大きさ: 覚えたフレームの平均（まだないときは見込み）
  const perFrame = L && L.frames.size ? L.bytes / L.frames.size : rig.frameBytes;
  let range = 0, have = 0;
  for (let f = Math.ceil(clip.start); f <= clip.end; f++) { range++; if (L && L.frames.has(f)) have++; }
  return {
    moving: rig.moving.size, perFrame, frames: have, range, bytes: st.bytes, limit: st.limit, full: st.full,
    fits: CACHE_LIMITS_MB.map((mb) => [mb, Math.min(range, Math.floor((mb * 1024 * 1024) / Math.max(1, perFrame)))]),
  };
}

/** 専用の評価の計画の状態 */
export function planInfo(rig) {
  if (!rig) return null;
  const p = rig.compiledPlan;
  if (!p) return { used: false, reason: rig.compiledReason || (rig.compiledPlan === undefined ? '最初の評価のあとで作ります' : '不明') };
  return { used: true, counts: p.counts, delegated: p.delegated };
}

const pad = (s, n) => {
  // 全角を 2 文字分として、右を空白で埋める
  let w = 0;
  for (const ch of String(s)) w += /[\u0000-ÿ]/.test(ch) ? 1 : 2;
  return String(s) + ' '.repeat(Math.max(1, n - w));
};
const ms = (v) => `${v.toFixed(2)} ms`;

/**
 * 結果を文字にする（［テキストでコピー］）
 * @param ctx { scene: { meshes, vertices, joints, curves }, clip, rig, workers: BakeWorkers の stats() }
 */
export function profilerText(prof, ctx) {
  const L = [];
  const s = prof.summary();
  L.push('評価のプロファイラ');
  if (ctx.scene) {
    const c = ctx.scene;
    L.push(`シーン: メッシュ ${c.meshes}・頂点 ${c.vertices}・ジョイント ${c.joints}・カーブ ${c.curves}`);
  }
  if (ctx.clip) L.push(`再生範囲: ${ctx.clip.start}〜${ctx.clip.end}（${ctx.clip.fps} fps。1 フレームの持ち時間 ${(1000 / ctx.clip.fps).toFixed(1)} ms）`);
  L.push('');
  L.push(`■ フレームの内訳（記録 ${s.frames} フレーム: キャッシュあり ${s.hits}・キャッシュなし ${s.evaluated}）`);
  if (s.fps) L.push(`表示できたフレームレート: ${s.fps.toFixed(1)} fps`);
  for (const p of PARTS) L.push(`  ${pad(p.label, 36)}${ms(s.avg[p.key])}`);
  L.push(`  ${pad('合計（平均）', 36)}${ms(s.total)}　最大 ${ms(s.max)}`);
  const split = (pred) => {
    const fr = prof.frames.filter(pred);
    if (!fr.length) return null;
    return fr.reduce((a, e) => a + PARTS.reduce((t, p) => t + (e.parts[p.key] || 0), 0), 0) / fr.length;
  };
  const hit = split((e) => e.path === 'cache'), miss = split((e) => e.path !== 'cache');
  if (hit !== null) L.push(`  キャッシュありのフレームの平均: ${ms(hit)}`);
  if (miss !== null) L.push(`  キャッシュなしのフレームの平均: ${ms(miss)}`);
  for (const [mode, title] of [['type', '■ リグの評価の種類ごと（キャッシュなしのフレームの平均）'], ['path', '■ 評価の経路ごと（キャッシュなしのフレームの平均）']]) {
    L.push('');
    L.push(title);
    const rows = prof.rows(mode);
    if (!rows.length) L.push('  （キャッシュなしで評価したフレームがありません）');
    for (const r of rows) L.push(`  ${pad(r.label, 60)}${pad(`${r.nodes} 個`, 10)}${pad(ms(r.ms), 12)}${(r.share * 100).toFixed(1)}%`);
  }
  const cov = prof.coverage();
  if (prof.evaluated) L.push(`  （種類ごとの合計 ${ms(cov.categories)} / リグの評価 ${ms(cov.rig)}）`);
  const pi = planInfo(ctx.rig);
  if (pi) {
    L.push('');
    L.push('■ 専用の評価の計画');
    if (!pi.used) L.push(`  使っていません: ${pi.reason}`);
    else {
      const c = pi.counts;
      L.push(`  キーで動く ${c.simple}・入力で動く ${c.driven}（計算ノード ${c.math || 0}）・任せた ${c.delegated}・コンストレイント ${c.constraints}・IK ${c.ik}`);
      for (const [why, n] of Object.entries(pi.delegated || {})) L.push(`  任せた理由: ${why}（${n} 個）`);
    }
  }
  const ci = cacheInfo(ctx.rig, ctx.clip);
  if (ci) {
    L.push('');
    L.push('■ 再生キャッシュ');
    L.push(`  動くノード ${ci.moving} 個・1 フレーム ${formatBytes(ci.perFrame)}`);
    L.push(`  覚えたフレーム ${ci.frames} / ${ci.range}・${formatBytes(ci.bytes)}（上限 ${ci.limit ? formatBytes(ci.limit) : 'オフ'}）`);
    L.push(`  上限ごとに入るフレーム数: ${ci.fits.map(([mb, n]) => `${mb >= 1024 ? mb / 1024 + 'GB' : mb + 'MB'} ${n}`).join('・')}`);
  }
  const w = ctx.workers;
  if (w) {
    L.push('');
    L.push('■ 再生キャッシュを作るワーカー');
    if (!w.available) L.push('  使っていません（画面のスレッドの空き時間に作ります）');
    else {
      L.push(`  ワーカー ${w.count} 個（CPU のコア ${w.cores || '不明'}）`);
      if (w.frames) {
        L.push(`  作ったフレーム ${w.frames}・1 フレームの評価 ${ms(w.perFrame)}（ワーカーの中）`);
        if (w.throughput) L.push(`  全体の速さ: 1 フレームあたり ${ms(1000 / w.throughput)}（${w.throughput.toFixed(1)} フレーム/秒）`);
      } else L.push('  まだ作っていません');
    }
  }
  L.push('');
  L.push('※ 描画は CPU 側で命令を出す時間で、GPU の処理の時間は含みません。1 ノードの時間は短いため、記録したフレームを通した平均です。');
  return L.join('\n');
}
