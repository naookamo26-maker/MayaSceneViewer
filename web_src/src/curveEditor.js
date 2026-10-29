// カーブエディタ（Maya の Graph Editor の確認用。見るだけで、カーブは変えない）。
//
// 選んだノードを動かすアニメーションカーブ（ビューアが読み込んだもの）を、横軸フレーム・縦軸値のグラフに描く:
//   * ノードの移動・回転・スケールのキー（clip.channels）
//   * ノードの属性に直接つながるカーブ（表示 .v・ピボットなど。リグのグラフの入力）
//   * 計算ノードを通してつながるカーブ（ドリブンキーなど。横軸はドライバーの値）
// 値の単位はファイルと同じ（回転は度、長さはシーンの単位）。前後の無限（pre / post infinity）の部分は点線。
// 画面の下のパネル（初期状態では最小化）。カーブは別のキャンバスに描いておき、フレームが変わったときは
// 現在のフレームの線だけを描き直す（再生中も軽い）。
import { TANGENT, INFINITY, evaluateCurve } from './animation.js';

// ---------------------------------------------------------------------- DOM に依存しない部分
const AXIS_COLORS = { x: '#e5675b', y: '#6cc070', z: '#5b9be5' };     // Maya と同じ X 赤・Y 緑・Z 青
const OTHER_COLORS = ['#d9c36a', '#c58be0', '#5fc7c0', '#e59a5b', '#a8b4c0'];
const BASE_LABEL = { t: '移動', r: '回転', s: 'スケール', v: '表示' };
const CHANNEL_ORDER = ['tx', 'ty', 'tz', 'rx', 'ry', 'rz', 'sx', 'sy', 'sz', 'v'];

export const TANGENT_LABEL = {
  [TANGENT.FIXED]: '固定', [TANGENT.LINEAR]: 'リニア', [TANGENT.FLAT]: 'フラット', [TANGENT.STEP]: 'ステップ',
  [TANGENT.SLOW]: 'スロー', [TANGENT.FAST]: 'ファスト', [TANGENT.SPLINE]: 'スプライン', [TANGENT.CLAMPED]: 'クランプ',
  [TANGENT.PLATEAU]: 'プラトー', [TANGENT.STEP_NEXT]: 'ステップ（次）', [TANGENT.AUTO]: 'オート', [TANGENT.AUTO_MIX]: 'オートミックス',
  [TANGENT.AUTO_EASE]: 'オートイーズ', [TANGENT.AUTO_CUSTOM]: 'オートカスタム',
};
export const INFINITY_LABEL = {
  [INFINITY.CONSTANT]: '定数', [INFINITY.LINEAR]: 'リニア', [INFINITY.CYCLE]: 'サイクル',
  [INFINITY.CYCLE_RELATIVE]: 'オフセット付きサイクル', [INFINITY.OSCILLATE]: '往復',
};

/** カーブの横軸の意味（時間のカーブはフレーム、ドリブンキー（UA・UL・UU）はドライバーの値、Trax はクリップの中の時間） */
export function curveAxis(c) {
  if (c.trax) return 'clip';
  return !c.type || c.type[0] === 'T' ? 'time' : 'driver';
}

/** チャンネルの表示名（tx → 移動 X、ほかは属性名のまま。via があれば「属性 ← 計算ノード」） */
export function channelLabel(attr, via = null) {
  const m = /^([trs])([xyz])$/.exec(attr);
  const base = m ? `${BASE_LABEL[m[1]]} ${m[2].toUpperCase()}` : (BASE_LABEL[attr] || attr);
  return via ? `${base} ← ${via}` : base;
}

/** チャンネルの色（xyz の成分は Maya と同じ色、ほかは順に） */
export function channelColor(attr, i) {
  const m = /^(?:[trs]|ra|rp|sp|jo)?([xyz])$/.exec(attr);
  return m ? AXIS_COLORS[m[1]] : OTHER_COLORS[i % OTHER_COLORS.length];
}

/**
 * 選んだノード ni を動かすカーブの一覧 [{ attr, curve, via, label, color }]（ビューアが読み込んだ範囲）。
 * clip: AnimationClip、rig: RigEvaluator（なくてもよい）
 */
export function collectChannels(clip, rig, ni) {
  const out = [];
  if (!clip || ni < 0) return out;
  const seen = new Set();
  const add = (attr, curve, via = null) => {
    if (!curve || seen.has(curve)) return;
    seen.add(curve);
    out.push({ attr, curve, via });
  };
  const entry = clip.byNode.get(ni);
  for (const ch of entry ? entry.channels : []) add(ch.attr, ch.curve);
  // リグのグラフの入力: 直接つながるカーブと、計算ノードを通してつながるカーブ（DAG ノードでは止める）
  const g = rig && rig.dagGraph ? rig.dagGraph.get(ni) : null;
  // via: 属性の直接の接続元の計算ノードの名前（表示用）
  const walk = (attr, src, depth, visited, via) => {
    if (src.curve !== undefined) { add(attr, clip.curves[src.curve], via); return; }
    if (src.node === undefined || depth >= 6 || !rig.byId) return;
    const sg = rig.byId.get(src.node);
    if (!sg || sg.dag >= 0 || visited.has(src.node)) return;
    visited.add(src.node);
    // ドリブンキー（animCurveUA・UL・UU）: グラフのノードがカーブを持つ。ドライバー（入力）の先はたどらない
    if (sg.curve !== undefined) { add(attr, clip.curves[sg.curve], via); return; }
    for (const s2 of Object.values(sg.inputs || {})) walk(attr, s2, depth + 1, visited, via || sg.name);
  };
  for (const [attr, src] of Object.entries((g && g.inputs) || {})) walk(attr, src, 0, new Set(), null);
  // 表示など、リグのプロパティの入力
  for (const p of (clip.raw && clip.raw.props) || []) {
    if (p.kind !== 'node' || p.index !== ni) continue;
    for (const [attr, src] of Object.entries(p.inputs || {})) if (src.curve !== undefined) add(attr, clip.curves[src.curve]);
  }
  const rank = (c) => { const i = CHANNEL_ORDER.indexOf(c.attr); return i < 0 ? CHANNEL_ORDER.length : i; };
  out.sort((a, b) => (rank(a) - rank(b)) || (a.via ? 1 : 0) - (b.via ? 1 : 0) || a.attr.localeCompare(b.attr));
  out.forEach((c, i) => {
    const axis = curveAxis(c.curve);
    c.label = channelLabel(c.attr, c.via) + (axis === 'driver' ? '（ドリブンキー）' : axis === 'clip' ? '（Trax）' : '');
    c.color = channelColor(c.attr, i);
  });
  return out;
}

/** 表示しているカーブの横軸（'time' フレーム・'driver' ドライバーの値・'clip' クリップの時間・'mixed' 混在。なければ 'time'） */
export function viewAxis(channels) {
  const kinds = new Set(channels.filter((c) => c.visible !== false).map((c) => curveAxis(c.curve)));
  if (kinds.size === 0) return 'time';
  return kinds.size === 1 ? [...kinds][0] : 'mixed';
}

/** 目盛りの間隔（1・2・5 × 10 の累乗。span を count 個くらいに分ける） */
export function niceStep(span, count) {
  const raw = Math.abs(span) / Math.max(count, 1);
  if (!(raw > 0) || !Number.isFinite(raw)) return 1;
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

/** 値の範囲（正規化するときは、カーブごとの最小・最大で -1〜1 に縮める係数も返す） */
export function curveRange(c, x0, x1, samples = 200) {
  let lo = Infinity, hi = -Infinity;
  const take = (v) => { if (v < lo) lo = v; if (v > hi) hi = v; };
  for (let i = 0; i < c.n; i++) if (c.t[i] >= x0 && c.t[i] <= x1) take(c.v[i]);
  for (let i = 0; i <= samples; i++) take(evaluateCurve(c, x0 + (x1 - x0) * (i / samples)));
  return { lo, hi };
}

/** 正規化の写像（値 → -1〜1）。範囲が 0 なら中心を 0 にする */
export function normalizer(c, x0, x1) {
  const { lo, hi } = curveRange(c, x0, x1);
  const mid = (lo + hi) / 2, half = (hi - lo) / 2;
  const k = half > 1e-9 ? 1 / half : 1;
  return { map: (v) => (v - mid) * k, scale: k };
}

/**
 * 全体を表示する範囲 { x0, x1, y0, y1 }。横はキーの範囲と再生範囲を合わせたもの、縦はその範囲の値（少し余白）。
 * channels: collectChannels の結果（visible が false のものは除く）
 */
export function frameAll(channels, start, end, normalize = false) {
  const vis = channels.filter((c) => c.visible !== false);
  let x0 = Infinity, x1 = -Infinity;
  for (const ch of vis) {
    if (!ch.curve.n) continue;
    x0 = Math.min(x0, ch.curve.t[0]);
    x1 = Math.max(x1, ch.curve.t[ch.curve.n - 1]);
  }
  if (vis.some((c) => curveAxis(c.curve) === 'time') || !Number.isFinite(x0)) {
    if (Number.isFinite(start)) x0 = Math.min(x0, start);
    if (Number.isFinite(end)) x1 = Math.max(x1, end);
  }
  if (!Number.isFinite(x0)) { x0 = 0; x1 = 1; }
  if (x1 - x0 < 1e-6) { x0 -= 1; x1 += 1; }
  let y0 = Infinity, y1 = -Infinity;
  if (normalize) { y0 = -1; y1 = 1; } else {
    for (const ch of vis) {
      const { lo, hi } = curveRange(ch.curve, x0, x1);
      y0 = Math.min(y0, lo);
      y1 = Math.max(y1, hi);
    }
  }
  if (!Number.isFinite(y0)) { y0 = -1; y1 = 1; }
  if (y1 - y0 < 1e-6) { y0 -= 1; y1 += 1; }
  const px = (x1 - x0) * 0.04, py = (y1 - y0) * 0.1;
  return { x0: x0 - px, x1: x1 + px, y0: y0 - py, y1: y1 + py };
}

/** 値の表示（桁数をそろえる） */
export function fmtValue(v) {
  if (!Number.isFinite(v)) return String(v);
  const a = Math.abs(v);
  return a >= 1000 ? v.toFixed(1) : a >= 1 ? v.toFixed(3) : v.toFixed(4);
}

// ---------------------------------------------------------------------- パネル（DOM）
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PAD = { left: 52, right: 10, top: 20, bottom: 6 };     // グラフの余白（左は値の目盛り、上はフレームの目盛り）
const HANDLE_PX = 36;                                         // 重みのない接線のハンドルの長さ（画面のピクセル）
const MIN_H = 140;

export class CurveEditor {
  constructor(app) {
    this.app = app;
    this.clip = null;
    this.rig = null;
    this.node = -1;
    this.channels = [];
    this.hidden = new Set();          // 隠したチャンネル（カーブのオブジェクト。ノードを変えても覚えておく）
    this.view = null;
    this.normalize = false;
    this.selectedKey = null;          // { ch: チャンネルの番号, k: キーの番号 }
    this.hover = false;
    this.layer = document.createElement('canvas');   // カーブまで描いたもの（現在のフレームの線は毎回描く）
    this.canvas = $('ce-graph');
    this.list = $('ce-list');
    this.setCollapsed(true);                         // 初期状態では最小化
    $('ce-collapse').addEventListener('click', () => this.setCollapsed(!this.collapsed));
    $('ce-frame-all').addEventListener('click', () => this.frameAll());
    $('ce-normalize').addEventListener('click', () => {
      this.normalize = !this.normalize;
      $('ce-normalize').setAttribute('aria-pressed', String(this.normalize));
      this.frameAll();
    });
    const panel = $('curve-editor');
    panel.addEventListener('pointerenter', () => { this.hover = true; });
    panel.addEventListener('pointerleave', () => { this.hover = false; });
    new ResizeObserver(() => this.render()).observe(this.canvas);
    this.bindGraph();
    this.bindResizer();
  }

  get collapsed() { return document.body.classList.contains('curve-editor-collapsed'); }

  setCollapsed(on) {
    document.body.classList.toggle('curve-editor-collapsed', on);
    const b = $('ce-collapse');
    b.setAttribute('aria-expanded', String(!on));
    b.textContent = on ? '▴' : '▾';                  // パネルは画面の下: 閉じると下に縮む
    b.title = on ? 'カーブエディタを開く' : 'カーブエディタを最小化';
    if (!on) { this.rebuild(); }
  }

  /** アニメーションを読み込んだ・閉じた（clip が null ならパネルを隠す） */
  setClip(clip, rig) {
    this.clip = clip;
    this.rig = rig;
    this.hidden.clear();
    $('curve-editor').hidden = !clip;
    this.setNode(this.node);
  }

  /** 選んだノード（-1 で選択なし） */
  setNode(ni) {
    this.node = ni;
    this.selectedKey = null;
    if (!this.collapsed) this.rebuild();
    else this.updateTitle();
  }

  rebuild() {
    this.channels = collectChannels(this.clip, this.rig, this.node);
    for (const ch of this.channels) ch.visible = !this.hidden.has(ch.curve);
    this.buildList();
    this.updateTitle();
    this.frameAll();
  }

  updateTitle() {
    const nodes = this.app.data ? this.app.data.nodes : [];
    const name = this.node >= 0 && nodes[this.node] ? nodes[this.node].name : '';
    $('ce-node').textContent = name ? `${name}${this.collapsed ? '' : `・カーブ ${this.channels.length} 本`}` : '';
    this.updateInfo();
  }

  buildList() {
    const list = this.list;
    list.textContent = '';
    if (this.node < 0 || !this.channels.length) {
      const p = document.createElement('p');
      p.className = 'ce-empty';
      p.textContent = this.node < 0 ? 'ノードを選ぶと、そのカーブを表示します' : 'このノードを動かすカーブはありません（読み込んだ範囲）';
      list.appendChild(p);
      return;
    }
    this.channels.forEach((ch, i) => {
      const row = document.createElement('label');
      row.className = 'ce-row';
      row.title = `${ch.curve.name}（${ch.curve.type || ''}）\nダブルクリック: このカーブだけを表示`;
      row.innerHTML = `<input type="checkbox"${ch.visible ? ' checked' : ''}><i style="background:${ch.color}"></i><span>${esc(ch.label)}</span>`;
      const box = row.firstChild;
      box.addEventListener('change', () => this.setVisible(i, box.checked));
      row.addEventListener('dblclick', (e) => {
        e.preventDefault();
        this.channels.forEach((c, j) => this.setVisible(j, j === i, false));
        this.syncList();
        this.frameAll();
      });
      list.appendChild(row);
    });
  }

  syncList() {
    this.list.querySelectorAll('.ce-row input').forEach((box, i) => { box.checked = this.channels[i].visible; });
  }

  setVisible(i, on, redraw = true) {
    const ch = this.channels[i];
    ch.visible = on;
    if (on) this.hidden.delete(ch.curve); else this.hidden.add(ch.curve);
    if (this.selectedKey && this.selectedKey.ch === i && !on) this.selectedKey = null;
    if (redraw) { this.updateInfo(); this.render(); }
  }

  frameAll() {
    if (!this.clip) return;
    this.view = frameAll(this.channels, this.clip.start, this.clip.end, this.normalize);
    this.render();
  }

  /** 選んだキーを中心に表示する（なければ全体） */
  frameSelected() {
    const s = this.selectedKey;
    if (!s || !this.view) { this.frameAll(); return; }
    const c = this.channels[s.ch].curve;
    const x = c.t[s.k], y = this.valueOf(s.ch, c.v[s.k]);
    const w = (this.view.x1 - this.view.x0) / 2, h = (this.view.y1 - this.view.y0) / 2;
    this.view = { x0: x - w, x1: x + w, y0: y - h, y1: y + h };
    this.render();
  }

  // ---- 座標
  plotRect() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    return { x: PAD.left, y: PAD.top, w: Math.max(w - PAD.left - PAD.right, 1), h: Math.max(h - PAD.top - PAD.bottom, 1) };
  }

  sx(x) { const r = this.plotRect(); return r.x + ((x - this.view.x0) / (this.view.x1 - this.view.x0)) * r.w; }

  sy(y) { const r = this.plotRect(); return r.y + (1 - (y - this.view.y0) / (this.view.y1 - this.view.y0)) * r.h; }

  fromScreen(px, py) {
    const r = this.plotRect();
    return { x: this.view.x0 + ((px - r.x) / r.w) * (this.view.x1 - this.view.x0), y: this.view.y1 - ((py - r.y) / r.h) * (this.view.y1 - this.view.y0) };
  }

  /** 表示する値（正規化するときは、キーの範囲と再生範囲での最小・最大を -1〜1 に） */
  valueOf(i, v) {
    const ch = this.channels[i];
    if (!this.normalize) return v;
    if (!ch.norm) {
      const c = ch.curve;
      const x0 = Math.min(c.n ? c.t[0] : 0, this.clip ? this.clip.start : 0);
      const x1 = Math.max(c.n ? c.t[c.n - 1] : 0, this.clip ? this.clip.end : 0);
      ch.norm = normalizer(c, x0, x1);
    }
    return ch.norm.map(v);
  }

  // ---- 描画
  render() {
    if (this.collapsed || !this.canvas || !this.view) return;
    const c = this.canvas, w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    for (const cv of [c, this.layer]) {
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
    }
    const g = this.layer.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const r = this.plotRect();
    // 再生範囲の外は暗く（横軸がフレームのとき）
    g.fillStyle = '#1f2225';
    g.fillRect(r.x, r.y, r.w, r.h);
    if (this.clip && viewAxis(this.channels) !== 'driver') {
      const a = Math.max(this.sx(this.clip.start), r.x), b = Math.min(this.sx(this.clip.end), r.x + r.w);
      if (b > a) { g.fillStyle = '#272b30'; g.fillRect(a, r.y, b - a, r.h); }
    }
    this.drawGrid(g, r, w);
    g.save();
    g.beginPath();
    g.rect(r.x, r.y, r.w, r.h);
    g.clip();
    this.channels.forEach((ch, i) => { if (ch.visible) this.drawCurve(g, r, i); });
    this.drawSelectedKey(g);
    g.restore();
    this.drawFrame();
  }

  drawGrid(g, r, w) {
    const v = this.view;
    g.font = '10px system-ui, sans-serif';
    g.textBaseline = 'middle';
    // 横（フレーム）
    const xs = niceStep(v.x1 - v.x0, Math.max(2, r.w / 70));
    g.fillStyle = '#8e97a1';
    g.textAlign = 'center';
    for (let x = Math.ceil(v.x0 / xs) * xs; x <= v.x1; x += xs) {
      const px = Math.round(this.sx(x)) + 0.5;
      g.fillStyle = 'rgba(255, 255, 255, 0.06)';
      g.fillRect(px, r.y, 1, r.h);
      g.fillStyle = '#8e97a1';
      g.fillText(fmtTick(x, xs), px, PAD.top / 2);
    }
    // 縦（値）
    const ys = niceStep(v.y1 - v.y0, Math.max(2, r.h / 36));
    g.textAlign = 'right';
    for (let y = Math.ceil(v.y0 / ys) * ys; y <= v.y1; y += ys) {
      const py = Math.round(this.sy(y)) + 0.5;
      const zero = Math.abs(y) < ys * 1e-6;
      g.fillStyle = zero ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.06)';
      g.fillRect(r.x, py, r.w, 1);
      g.fillStyle = '#8e97a1';
      g.fillText(fmtTick(y, ys), PAD.left - 6, py);
    }
    g.fillStyle = 'rgba(255, 255, 255, 0.12)';
    g.fillRect(r.x, PAD.top - 1, w - PAD.left - PAD.right, 1);
    // 横軸の意味（左上の角）
    const axis = viewAxis(this.channels);
    g.fillStyle = '#8e97a1';
    g.textAlign = 'left';
    g.fillText({ time: 'フレーム', driver: 'ドライバー', clip: 'クリップ', mixed: '混在' }[axis], 4, PAD.top / 2);
  }

  drawCurve(g, r, i) {
    const ch = this.channels[i], c = ch.curve;
    if (!c.n) return;
    const first = c.t[0], last = c.t[c.n - 1];
    const step = Math.max((this.view.x1 - this.view.x0) / r.w, 1e-6);   // 1 ピクセルごと
    const piece = (a, b, dashed) => {
      if (b <= a) return;
      g.setLineDash(dashed ? [4, 4] : []);
      g.beginPath();
      let x = a, firstPt = true;
      while (true) {
        const px = this.sx(x), py = this.sy(this.valueOf(i, evaluateCurve(c, x)));
        if (firstPt) { g.moveTo(px, py); firstPt = false; } else g.lineTo(px, py);
        if (x >= b) break;
        x = Math.min(x + step, b);
        // キーの時刻を飛ばさない（ステップの角を正しく描く）
      }
      g.stroke();
    };
    g.lineWidth = 1.5;
    g.strokeStyle = ch.color;
    g.globalAlpha = 0.9;
    piece(this.view.x0, Math.min(first, this.view.x1), true);           // 前の無限
    // キーのあいだ: 区間ごとに描く（ステップの区間は角を描く）
    g.setLineDash([]);
    g.beginPath();
    for (let k = 0; k < c.n - 1; k++) {
      const a = c.t[k], b = c.t[k + 1];
      if (b < this.view.x0 || a > this.view.x1) continue;
      const x0 = Math.max(a, this.view.x0), x1 = Math.min(b, this.view.x1);
      g.moveTo(this.sx(x0), this.sy(this.valueOf(i, evaluateCurve(c, x0))));
      if (c.step[k]) {
        const hold = c.step[k] === 1 ? c.v[k] : c.v[k + 1];
        g.lineTo(this.sx(a), this.sy(this.valueOf(i, hold)));
        g.lineTo(this.sx(b), this.sy(this.valueOf(i, hold)));
        g.lineTo(this.sx(b), this.sy(this.valueOf(i, c.v[k + 1])));
        continue;
      }
      for (let x = x0 + step; x < x1; x += step) g.lineTo(this.sx(x), this.sy(this.valueOf(i, evaluateCurve(c, x))));
      g.lineTo(this.sx(x1), this.sy(this.valueOf(i, k + 1 === c.n - 1 && x1 === b ? c.v[k + 1] : evaluateCurve(c, x1))));
    }
    g.stroke();
    piece(Math.max(last, this.view.x0), this.view.x1, true);            // 後の無限
    g.globalAlpha = 1;
    // キー
    g.fillStyle = ch.color;
    for (let k = 0; k < c.n; k++) {
      const px = this.sx(c.t[k]), py = this.sy(this.valueOf(i, c.v[k]));
      if (px < r.x - 4 || px > r.x + r.w + 4) continue;
      g.fillRect(Math.round(px) - 2, Math.round(py) - 2, 5, 5);
    }
  }

  /** 選んだキー（白い枠）と接線のハンドル */
  drawSelectedKey(g) {
    const s = this.selectedKey;
    if (!s || !this.channels[s.ch] || !this.channels[s.ch].visible) return;
    const c = this.channels[s.ch].curve;
    const px = this.sx(c.t[s.k]), py = this.sy(this.valueOf(s.ch, c.v[s.k]));
    const scale = this.normalize && this.channels[s.ch].norm ? this.channels[s.ch].norm.scale : 1;
    g.strokeStyle = '#f2f2f2';
    g.fillStyle = '#f2f2f2';
    g.lineWidth = 1;
    for (const side of [-1, 1]) {
      if ((side < 0 && s.k === 0) || (side > 0 && s.k === c.n - 1)) continue;
      const slope = (side < 0 ? c.inSlope[s.k] : c.outSlope[s.k]) * scale;
      const wgt = side < 0 ? c.inW[s.k] : c.outW[s.k];
      let dx, dy;
      if (c.weighted && wgt > 0) {
        dx = this.sx(c.t[s.k] + side * wgt / 3) - px;
        dy = this.sy(this.valueOf(s.ch, c.v[s.k]) + side * slope * wgt / 3) - py;
      } else {
        const ux = this.sx(c.t[s.k] + side) - px, uy = this.sy(this.valueOf(s.ch, c.v[s.k]) + side * slope) - py;
        const len = Math.hypot(ux, uy) || 1;
        dx = (ux / len) * HANDLE_PX;
        dy = (uy / len) * HANDLE_PX;
      }
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(px + dx, py + dy);
      g.stroke();
      g.beginPath();
      g.arc(px + dx, py + dy, 2.5, 0, Math.PI * 2);
      g.fill();
    }
    g.strokeRect(Math.round(px) - 3.5, Math.round(py) - 3.5, 8, 8);
  }

  /** カーブの絵の上に、現在のフレームの線を描く（フレームが変わるたび） */
  drawFrame() {
    if (this.collapsed || !this.view) return;
    const c = this.canvas, w = c.clientWidth, h = c.clientHeight;
    const g = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(this.layer, 0, 0);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = this.plotRect();
    const f = this.app.frame;
    const px = Math.round(this.sx(f)) + 0.5;
    const timeAxis = ['time', 'mixed'].includes(viewAxis(this.channels));   // ドリブンキーだけなら、横軸はフレームではない
    if (timeAxis && px >= r.x && px <= r.x + r.w) {
      g.fillStyle = '#f2a93b';
      g.fillRect(px - 0.5, 0, 2, h);
      g.font = '10px system-ui, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      const label = Number.isInteger(f) ? String(f) : f.toFixed(1);
      const tw = g.measureText(label).width + 8;
      g.fillRect(px - tw / 2, 1, tw, PAD.top - 4);
      g.fillStyle = '#1c1e21';
      g.fillText(label, px, PAD.top / 2);
    }
    void w;
  }

  /** 現在のフレームが変わった */
  setFrame() { this.drawFrame(); }

  updateInfo() {
    const el = $('ce-info');
    const s = this.selectedKey;
    if (!s || !this.channels[s.ch]) {
      el.textContent = this.collapsed || this.node < 0 ? '' : 'キーをクリックで情報・ホイール: ズーム（Shift: 横だけ・Ctrl: 縦だけ）・ドラッグ: 移動・右ドラッグ: ズーム・上端をドラッグ: フレーム・A: 全体・F: 選んだキー';
      el.title = el.textContent;
      return;
    }
    const ch = this.channels[s.ch], c = ch.curve;
    const axis = curveAxis(c);
    const xLabel = axis === 'time' ? 'フレーム' : axis === 'clip' ? 'クリップの時間' : 'ドライバーの値';
    const tan = (k) => TANGENT_LABEL[k] || String(k);
    const x = c.t[s.k];
    const xText = axis !== 'driver' && Math.abs(x - Math.round(x)) < 1e-6 ? String(Math.round(x)) : fmtValue(x);
    const parts = [`${ch.label}（${c.name}）`, `キー ${s.k + 1} / ${c.n}`, `${xLabel} ${xText}`, `値 ${fmtValue(c.v[s.k])}`,
      `接線 イン ${tan(c.tinType[s.k])}・アウト ${tan(c.toutType[s.k])}`];
    if (c.weighted) parts.push('ウェイト付き');
    if (s.k === 0 && c.pre) parts.push(`前: ${INFINITY_LABEL[c.pre] || c.pre}`);
    if (s.k === c.n - 1 && c.post) parts.push(`後: ${INFINITY_LABEL[c.post] || c.post}`);
    el.textContent = parts.join('・');
    el.title = el.textContent;
  }

  /** 画面の点の近くのキー（なければ null） */
  keyAt(px, py, radius = 6) {
    let best = null, bestD = radius * radius;
    this.channels.forEach((ch, i) => {
      if (!ch.visible) return;
      const c = ch.curve;
      for (let k = 0; k < c.n; k++) {
        const dx = this.sx(c.t[k]) - px, dy = this.sy(this.valueOf(i, c.v[k])) - py;
        const d = dx * dx + dy * dy;
        if (d <= bestD) { bestD = d; best = { ch: i, k }; }
      }
    });
    return best;
  }

  // ---- 操作
  bindGraph() {
    const c = this.canvas;
    let drag = null;
    const local = (e) => { const b = c.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('wheel', (e) => {
      if (!this.view) return;
      e.preventDefault();
      const p = local(e), at = this.fromScreen(p.x, p.y);
      const k = Math.exp(Math.sign(e.deltaY) * 0.15);
      const zx = !e.ctrlKey, zy = !e.shiftKey;
      const v = this.view;
      this.view = {
        x0: zx ? at.x + (v.x0 - at.x) * k : v.x0, x1: zx ? at.x + (v.x1 - at.x) * k : v.x1,
        y0: zy ? at.y + (v.y0 - at.y) * k : v.y0, y1: zy ? at.y + (v.y1 - at.y) * k : v.y1,
      };
      this.render();
    }, { passive: false });
    c.addEventListener('pointerdown', (e) => {
      if (!this.view) return;
      const p = local(e);
      try { c.setPointerCapture(e.pointerId); } catch (err) { /* 合成イベントなど */ }
      if (e.button === 0 && !e.altKey && p.y < PAD.top && viewAxis(this.channels) !== 'driver') {   // 上端の目盛り: フレームを動かす
        drag = { mode: 'scrub' };
        this.scrub(p.x);
        return;
      }
      if (e.button === 0 && !e.altKey) {
        const key = this.keyAt(p.x, p.y);
        this.selectedKey = key;
        this.updateInfo();
        this.render();
        if (key) return;
      }
      // 右ボタン（Alt+右も）: ズーム、それ以外: 移動
      drag = { mode: e.button === 2 ? 'zoom' : 'pan', x: p.x, y: p.y, view: { ...this.view }, at: this.fromScreen(p.x, p.y) };
    });
    c.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const p = local(e);
      if (drag.mode === 'scrub') { this.scrub(p.x); return; }
      const r = this.plotRect(), v = drag.view;
      const dx = p.x - drag.x, dy = p.y - drag.y;
      if (drag.mode === 'pan') {
        const fx = ((v.x1 - v.x0) / r.w) * dx, fy = ((v.y1 - v.y0) / r.h) * dy;
        this.view = { x0: v.x0 - fx, x1: v.x1 - fx, y0: v.y0 + fy, y1: v.y1 + fy };
      } else {
        const kx = Math.exp(-dx * 0.01), ky = Math.exp(dy * 0.01);
        const a = drag.at;
        this.view = { x0: a.x + (v.x0 - a.x) * kx, x1: a.x + (v.x1 - a.x) * kx, y0: a.y + (v.y0 - a.y) * ky, y1: a.y + (v.y1 - a.y) * ky };
      }
      this.render();
    });
    const end = () => { drag = null; };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
  }

  scrub(px) {
    const f = Math.round(this.fromScreen(px, 0).x);
    if (this.clip) this.app.scrubTo(Math.min(Math.max(f, this.clip.start), this.clip.end));
  }

  /** キー操作（パネルの上にポインターがあるときだけ。扱ったら true） */
  handleKey(e) {
    if (!this.hover || this.collapsed || e.ctrlKey || e.metaKey || e.altKey) return false;
    const k = e.key.toLowerCase();
    if (k === 'a') this.frameAll();
    else if (k === 'f') this.frameSelected();
    else return false;
    e.preventDefault();
    return true;
  }

  /** パネルの上端をドラッグして高さを変える */
  bindResizer() {
    const handle = $('ce-resizer'), panel = $('curve-editor');
    let start = null;
    handle.addEventListener('pointerdown', (e) => {
      if (this.collapsed) return;
      start = { y: e.clientY, h: panel.getBoundingClientRect().height };
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* 合成イベントなど */ }
    });
    handle.addEventListener('pointermove', (e) => {
      if (!start) return;
      const max = Math.max(MIN_H, window.innerHeight * 0.7);
      const h = Math.min(Math.max(start.h + (start.y - e.clientY), MIN_H), max);
      panel.style.height = `${Math.round(h)}px`;
    });
    const end = () => { start = null; };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }
}

/** 目盛りの数値（間隔に合わせた桁数） */
function fmtTick(v, step) {
  const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  return (Math.abs(v) < step * 1e-6 ? 0 : v).toFixed(Math.min(d, 6));
}
