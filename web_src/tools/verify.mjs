// Maya の正解（tools/maya_export_truth.py の出力）と、ビューアの評価を比べる。
//   node tools/verify.mjs scene.json truth.json [--report out.json] [--top 20] [--pos 0.001] [--rot 0.01]
//   node tools/verify.mjs scene.json --make-truth out.json [--start 1 --end 24]   ビューアの評価を正解と同じ形式で書く
// scene.json: 共通 JSON（アニメーションを含む。python -m ma_viewer export scene.ma -o scene.json）。
//   python -m ma_viewer verify scene.ma truth.json でも同じ（.ma を読んでからこれを呼ぶ）
// truth.json: { fps, start, end, nodes: { フルパス: { frames: [...], world: [[16 個], ...], visible: [...], shown: [...] } } }
//   world は Maya のワールド行列（MDagPath.inclusiveMatrix。行ベクトルの規約で 16 個を行の順に。移動は 12〜14 番目）。
//   visible はノード自身の表示（.v など）、shown は親を含めた表示（MDagPath.isVisible）。どちらも省略できる。
// 出力: ノードごとの差の最大（位置の距離・回転の角度（度）・スケールの差）と、しきい値を超えたノードの数。
//   差の大きい順に --top 個を表示する。--report を付けると全ノードの結果を JSON に書く。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator, hiddenByProps } from '../src/rig.js';

/** 共通 JSON を評価する評価器を作る。アニメーションがなければ null（ファイルの値のまま） */
export function makeViewer(scene) {
  const statics = scene.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const anim = scene.animation;
  if (!anim) return { scene, statics, clip: null, rig: null };
  const clip = new AnimationClip(anim);
  const rig = new RigEvaluator(clip, scene.nodes, (ni) => statics[ni]);
  return { scene, statics, clip, rig };
}

/**
 * フレーム f の、全ノードのワールド行列（Matrix4 の配列）・自身の表示・親を含めた表示。
 * ワールド行列はビューアと同じく、親のワールド行列 · ローカル行列（inheritsTransform が false ならローカル行列のまま）
 */
export function viewerFrame(v, f) {
  const nodes = v.scene.nodes;
  const mats = v.rig ? v.rig.evaluate(f) : new Map();
  const props = v.rig && v.rig.props.length ? v.rig.evaluateProps() : [];
  const self = nodes.map((n) => n.visible !== false);
  for (const p of props) if (p.kind === 'node' && p.index < self.length) self[p.index] = !hiddenByProps(p.static, p.values);
  const world = new Array(nodes.length);
  const shown = new Array(nodes.length);
  const visit = (i) => {
    if (world[i]) return;
    const n = nodes[i];
    const local = mats.get(i) || v.statics[i];
    const p = n.parent;
    if (p >= 0) visit(p);
    world[i] = p >= 0 && n.inheritsTransform !== false ? world[p].clone().multiply(local) : local.clone();
    shown[i] = self[i] && (p < 0 || shown[p]);
  };
  for (let i = 0; i < nodes.length; i++) {
    // 深い階層でも再帰しないように、未計算の祖先を根から順に計算する
    const chain = [];
    for (let k = i; k >= 0 && !world[k]; k = nodes[k].parent) chain.push(k);
    for (let c = chain.length - 1; c >= 0; c--) visit(chain[c]);
  }
  return { world, self, shown };
}

const _p = new Vector3(), _q = new Quaternion(), _s = new Vector3();
const _p2 = new Vector3(), _q2 = new Quaternion(), _s2 = new Vector3();

/** 2 つのワールド行列の差: { pos（距離）, rot（角度・度）, scl（スケールの成分の差の最大） } */
export function matrixDiff(a, b) {
  a.decompose(_p, _q, _s);
  b.decompose(_p2, _q2, _s2);
  // 角度は相対の回転 q⁻¹·q2 から atan2 で求める（acos は 0 の近くで丸めの誤差が大きい）
  const d = _q.invert().multiply(_q2);
  const half = Math.atan2(Math.hypot(d.x, d.y, d.z), Math.abs(d.w));
  return {
    pos: _p.distanceTo(_p2),
    rot: (2 * half * 180) / Math.PI,
    scl: Math.max(Math.abs(_s.x - _s2.x), Math.abs(_s.y - _s2.y), Math.abs(_s.z - _s2.z)),
  };
}

/** ビューアの評価を正解と同じ形式にする（Maya なしのテスト・回帰の記録用） */
export function makeTruth(scene, frames) {
  const v = makeViewer(scene);
  const out = { fps: v.clip ? v.clip.fps : 24, start: frames[0], end: frames[frames.length - 1], source: 'viewer', nodes: {} };
  for (const n of scene.nodes) out.nodes[n.path] = { frames: [], world: [], visible: [], shown: [] };
  for (const f of frames) {
    const r = viewerFrame(v, f);
    scene.nodes.forEach((n, i) => {
      const e = out.nodes[n.path];
      e.frames.push(f);
      e.world.push(Array.from(r.world[i].elements));
      e.visible.push(r.self[i]);
      e.shown.push(r.shown[i]);
    });
  }
  return out;
}

/**
 * 比べる。戻り値 { frames, compared, missing（ビューアにないノード）, extra（正解にないノードの数）, over: { pos, rot, any },
 *   visibleMismatch, rows: [{ path, pos, rot, scl, frame（最大の差のフレーム）, visible（表示の食い違いのフレーム数）, note }] }
 * rows は差の大きい順（位置のしきい値で割った値と回転のしきい値で割った値の大きいほう）
 */
export function compare(scene, truth, { pos = 0.001, rot = 0.01 } = {}) {
  const v = makeViewer(scene);
  const byPath = new Map(scene.nodes.map((n, i) => [n.path, i]));
  const fallback = new Set(((scene.animation && scene.animation.fallback) || []).map((e) => e.node));
  const tainted = new Set((scene.animation && scene.animation.tainted) || []);
  const entries = Object.entries(truth.nodes || {});
  const missing = [];
  const targets = [];
  for (const [path, e] of entries) {
    const i = byPath.get(path);
    if (i === undefined) missing.push(path); else targets.push([path, i, e]);
  }
  // 正解のフレームの和集合（ノードごとに同じはずだが、違っても動くように）
  const frameSet = new Set();
  for (const [, , e] of targets) for (const f of e.frames || []) frameSet.add(f);
  const frames = [...frameSet].sort((a, b) => a - b);
  const stats = targets.map(([path, i]) => ({ path, index: i, pos: 0, rot: 0, scl: 0, frame: null, visible: 0, shown: 0,
    note: fallback.has(i) ? 'バインドポーズで推定' : tainted.has(i) ? '値を求められない' : '' }));
  const lookup = targets.map(([, , e]) => new Map((e.frames || []).map((f, k) => [f, k])));
  const m = new Matrix4();
  for (const f of frames) {
    const r = viewerFrame(v, f);
    targets.forEach(([, i, e], t) => {
      const k = lookup[t].get(f);
      if (k === undefined) return;
      const s = stats[t];
      const w = e.world && e.world[k];
      if (w && w.length === 16) {
        const d = matrixDiff(r.world[i], m.fromArray(w));
        const worse = d.pos / pos > Math.max(s.pos / pos, s.rot / rot) || d.rot / rot > Math.max(s.pos / pos, s.rot / rot);
        if (worse || s.frame === null) s.frame = f;
        s.pos = Math.max(s.pos, d.pos); s.rot = Math.max(s.rot, d.rot); s.scl = Math.max(s.scl, d.scl);
      }
      if (e.visible && e.visible[k] !== undefined && !!e.visible[k] !== r.self[i]) s.visible++;
      if (e.shown && e.shown[k] !== undefined && !!e.shown[k] !== r.shown[i]) s.shown++;
    });
  }
  const score = (s) => Math.max(s.pos / pos, s.rot / rot);
  stats.sort((a, b) => score(b) - score(a) || a.path.localeCompare(b.path));
  return {
    frames: frames.length,
    compared: stats.length,
    missing,
    extra: scene.nodes.filter((n) => !(n.path in (truth.nodes || {}))).length,
    over: { pos: stats.filter((s) => s.pos > pos).length, rot: stats.filter((s) => s.rot > rot).length,
      any: stats.filter((s) => s.pos > pos || s.rot > rot).length },
    visibleMismatch: stats.filter((s) => s.visible || s.shown).length,
    thresholds: { pos, rot },
    rows: stats,
  };
}

/** 結果を文章にする（表示用） */
export function formatReport(res, top = 20) {
  const L = [];
  L.push(`比べたノード: ${res.compared}（フレーム ${res.frames}）。ビューアにないノード: ${res.missing.length}。`
    + `正解にないノード: ${res.extra}`);
  L.push(`しきい値（位置 ${res.thresholds.pos}・回転 ${res.thresholds.rot} 度）を超えたノード: ${res.over.any}`
    + `（位置 ${res.over.pos}・回転 ${res.over.rot}）。表示が食い違うノード: ${res.visibleMismatch}`);
  const rows = res.rows.slice(0, top).filter((s) => s.pos > 0 || s.rot > 0 || s.scl > 0 || s.visible || s.shown);
  if (rows.length) {
    L.push('');
    L.push('差の大きいノード:');
    L.push('| ノード | 位置 | 回転（度） | スケール | 最大のフレーム | 表示の食い違い（自身・親を含む） | 備考 |');
    L.push('|---|---|---|---|---|---|---|');
    for (const s of rows) {
      L.push(`| ${s.path} | ${s.pos.toPrecision(4)} | ${s.rot.toPrecision(4)} | ${s.scl.toPrecision(4)} | ${s.frame ?? '-'} `
        + `| ${s.visible}・${s.shown} | ${s.note} |`);
    }
  }
  if (res.missing.length) {
    L.push('');
    L.push(`ビューアにないノード（先頭 ${Math.min(top, res.missing.length)} 個）: ${res.missing.slice(0, top).join(', ')}`);
  }
  return L.join('\n');
}

function main(argv) {
  const opt = (name, def) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : def; };
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--')));
  if (!pos.length) {
    console.error('使い方: node tools/verify.mjs scene.json truth.json [--report out.json] [--top 20] [--pos 0.001] [--rot 0.01]\n'
      + '        node tools/verify.mjs scene.json --make-truth out.json [--start N --end N]');
    return 2;
  }
  const scene = JSON.parse(readFileSync(pos[0], 'utf8'));
  const makeTo = opt('--make-truth', null);
  if (makeTo) {
    const anim = scene.animation || {};
    const start = +opt('--start', anim.start ?? 1), end = +opt('--end', anim.end ?? start);
    const frames = [];
    for (let f = Math.ceil(start); f <= end; f++) frames.push(f);
    writeFileSync(makeTo, JSON.stringify(makeTruth(scene, frames)));
    console.log(`ビューアの評価を書きました: ${makeTo}（フレーム ${frames.length}）`);
    return 0;
  }
  if (pos.length < 2) { console.error('正解の JSON（truth.json）を指定してください'); return 2; }
  const truth = JSON.parse(readFileSync(pos[1], 'utf8'));
  const res = compare(scene, truth, { pos: +opt('--pos', 0.001), rot: +opt('--rot', 0.01) });
  console.log(formatReport(res, +opt('--top', 20)));
  const reportTo = opt('--report', null);
  if (reportTo) { writeFileSync(reportTo, JSON.stringify(res, null, 1)); console.log(`\n全ノードの結果: ${reportTo}`); }
  return res.over.any || res.visibleMismatch ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exitCode = main(process.argv.slice(2));
