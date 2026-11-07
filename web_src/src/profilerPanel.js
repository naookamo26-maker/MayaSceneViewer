// 評価のプロファイラの画面（ビューポートの上に重ねる、動かせるパネル）。集計は profiler.js。
//   * フレームの内訳: 1 フレームごとの積み上げ棒（記録した順。右がいちばん新しい）。フレームバジェット（1000 / fps）の線
//   * リグの評価の内訳: 種類ごと（何で動くノードか）・経路ごと（専用の評価か、汎用の経路に任せたか、その理由）
//   * 再生キャッシュとワーカーの状態
import { PARTS, SUB_PARTS, cacheInfo, checkText, formatBytes, errorText, planInfo, profilerText, workerStartText } from './profiler.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (n) => Number(n).toLocaleString('ja-JP');
const msText = (v) => `${v < 10 ? v.toFixed(2) : v.toFixed(1)} ms`;
const MAX_ROWS = 40;                   // 表に出す行の数（残りは「ほか」にまとめる）
const BAR = 3, GAP = 1;                // グラフの棒の幅と間隔（px）

/** 内訳の色（PARTS の順。分類色の暗い背景向けの段を順に使う。パネルの地色で色覚の違いでも見分けられることを確かめた） */
export const PART_COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9'];

export class ProfilerPanel {
  constructor(app) {
    this.app = app;
    this.mode = 'type';
    this.hover = -1;
    this.drawnVersion = -1;
    this.build();
  }

  build() {
    const el = document.createElement('section');
    el.id = 'profiler';
    el.hidden = true;
    el.setAttribute('aria-labelledby', 'prof-title');
    el.innerHTML = `
      <div class="prof-head" id="prof-head">
        <h2 id="prof-title">評価のプロファイラ</h2>
        <div class="prof-actions">
          <button type="button" class="btn prof-rec" id="prof-record" aria-pressed="false" title="記録を始める・止める。記録中に再生・フレームの移動をすると、1 フレームごとの内訳を記録する">● 記録</button>
          <button type="button" class="btn" id="prof-clear" title="記録を消す">消去</button>
          <button type="button" class="btn" id="prof-copy" title="結果を文字でコピーする">テキストでコピー</button>
          <button type="button" class="btn" id="prof-close" aria-label="閉じる" title="閉じる（記録も止める）">×</button>
        </div>
      </div>
      <div class="prof-body">
        <label class="check prof-bypass" title="覚えたフレームは捨てずに、記録中だけ毎フレーム評価し直して測る（既定。リグの評価の内訳を見るため）。キャッシュがあるときの速さを見るときは外す"><input type="checkbox" id="prof-nocache" checked> 再生キャッシュを使わずに測る</label>
        <div id="prof-summary" class="prof-summary"></div>
        <h3>フレームの内訳</h3>
        <ul class="prof-legend" id="prof-legend"></ul>
        <div class="prof-graph-wrap"><canvas id="prof-graph" aria-label="フレームごとの処理の内訳のグラフ"></canvas></div>
        <div id="prof-tip" class="prof-tip"></div>
        <div id="prof-detail" class="prof-detail"></div>
        <div class="prof-tabs-row">
          <h3>リグの評価の内訳</h3>
          <div class="prof-tabs" role="tablist" aria-label="分け方">
            <button type="button" role="tab" data-mode="type" aria-selected="true">種類ごと</button>
            <button type="button" role="tab" data-mode="path" aria-selected="false">経路ごと</button>
            <button type="button" role="tab" data-mode="node" aria-selected="false">ノードごと</button>
            <button type="button" role="tab" data-mode="def" aria-selected="false" title="exprespy などの自作ノードの、計算そのものと入力の読み込みの時間">自作ノード</button>
          </div>
        </div>
        <p class="muted small" id="prof-table-note"></p>
        <div class="prof-table-wrap"><table id="prof-table"></table></div>
        <div class="prof-tabs-row"><h3>このフレームの確認</h3>
          <button type="button" class="btn" id="prof-check" title="いまのフレームを、汎用の経路・専用の評価・再生キャッシュ・いまの表示で比べ、表示中のオブジェクトの行列も確かめる（表示が壊れて見えるフレームで押す）">このフレームを確かめる</button></div>
        <div id="prof-check-result" class="prof-check"><span class="muted">表示が壊れて見えるフレームで押すと、リグの評価の経路ごとの違いと、表示の行列の違いを確かめます。</span></div>
        <h3>再生キャッシュとワーカー</h3>
        <div id="prof-cache" class="prof-cache"></div>
      </div>`;
    const vp = $('viewport') || document.body;
    vp.appendChild(el);
    this.el = el;
    $('prof-legend').innerHTML = PARTS.map((p, i) => `<li><i style="background:${PART_COLORS[i]}"></i>${esc(p.label)}</li>`).join('');
    $('prof-record').addEventListener('click', () => this.setRecording(!this.app.profiler.recording));
    $('prof-clear').addEventListener('click', () => { this.app.profiler.clear(); this.hover = -1; this.refresh(true); });
    $('prof-copy').addEventListener('click', () => this.copy());
    $('prof-check').addEventListener('click', () => this.runCheck());
    $('prof-close').addEventListener('click', () => this.close());
    $('prof-nocache').addEventListener('change', (e) => this.setBypass(e.target.checked));
    for (const b of el.querySelectorAll('.prof-tabs [role=tab]')) {
      b.addEventListener('click', () => {
        this.mode = b.dataset.mode;
        for (const x of el.querySelectorAll('.prof-tabs [role=tab]')) x.setAttribute('aria-selected', String(x === b));
        this.refresh(true);
      });
    }
    // ノードごとの表: 行を押すと、そのノードを選ぶ（階層・プロパティで確かめられる）
    $('prof-table').addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-ni]');
      if (!tr) return;
      const ni = Number(tr.dataset.ni);
      if (this.app.built && this.app.built.nodeObjects[ni]) this.app.select(ni);
    });
    const cv = $('prof-graph');
    cv.addEventListener('pointermove', (e) => {
      const i = this.barAt(e.offsetX);
      if (i !== this.hover) { this.hover = i; this.refresh(true); }
    });
    cv.addEventListener('pointerleave', () => { this.hover = -1; this.refresh(true); });
    this.enableDrag($('prof-head'));
    // キー操作（再生の Alt+V など）がパネルのボタンに取られないよう、押したあとはビューアに戻す
    el.addEventListener('pointerup', (e) => { if (e.target.closest('button')) e.target.blur(); });
  }

  /** 見出しをつかんで動かす */
  enableDrag(handle) {
    let start = null;
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button')) return;
      const r = this.el.getBoundingClientRect(), p = this.el.offsetParent.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, left: r.left - p.left, top: r.top - p.top, pw: p.width, ph: p.height, w: r.width };
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    handle.addEventListener('pointermove', (e) => {
      if (!start) return;
      const left = Math.min(Math.max(0, start.left + e.clientX - start.x), Math.max(0, start.pw - start.w));
      const top = Math.min(Math.max(0, start.top + e.clientY - start.y), Math.max(0, start.ph - 40));
      Object.assign(this.el.style, { left: `${left}px`, top: `${top}px`, right: 'auto' });
    });
    const end = () => { start = null; };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  open() {
    this.el.hidden = false;
    if (!this.timer) this.timer = setInterval(() => this.refresh(), 250);
    this.refresh(true);
  }

  close() {
    this.setRecording(false);
    this.el.hidden = true;
    clearInterval(this.timer);
    this.timer = null;
  }

  get isOpen() { return !this.el.hidden; }

  setRecording(on) {
    const p = this.app.profiler;
    if (on) p.start(); else p.stop();
    if (!on) this.setBypass(false, true);
    else if ($('prof-nocache').checked) this.setBypass(true);
    const b = $('prof-record');
    b.setAttribute('aria-pressed', String(on));
    b.textContent = on ? '■ 停止' : '● 記録';
    this.refresh(true);
  }

  /** 再生キャッシュを使わずに測る（記録中だけ。覚えたフレームはそのまま） */
  setBypass(on, keepCheck = false) {
    const rig = this.app.rig;
    if (!keepCheck) $('prof-nocache').checked = on;
    if (rig) rig.bypassCache = on && this.app.profiler.recording;
  }

  /** グラフの x 座標 → 記録したフレームの番号 */
  barAt(x) {
    const fr = this.app.profiler.frames;
    const first = Math.max(0, fr.length - this.visibleBars());
    const i = first + Math.floor(x / (BAR + GAP));
    return i >= first && i < fr.length ? i : -1;
  }

  visibleBars() {
    const cv = $('prof-graph');
    return Math.max(1, Math.floor((cv.clientWidth - 2) / (BAR + GAP)));
  }

  /** 表示を更新する（記録が変わっていなければ描き直さない） */
  refresh(force = false) {
    if (this.el.hidden) return;
    const prof = this.app.profiler;
    if (this.app.rig) this.app.rig.bypassCache = prof.recording && $('prof-nocache').checked;
    // 再生キャッシュとワーカーの欄は、記録していなくても変わる（空き時間・ワーカーで作る）ので、毎回描き直す
    if (!force && prof.version === this.drawnVersion) { this.renderCache(); return; }
    this.drawnVersion = prof.version;
    this.renderSummary();
    this.drawGraph();
    this.renderTip();
    this.renderTable();
    this.renderCache();
  }

  renderSummary() {
    const prof = this.app.profiler, s = prof.summary(), clip = this.app.clip;
    const budget = clip ? 1000 / clip.fps : null;
    const parts = [];
    if (!this.app.rig) parts.push('アニメーションのあるシーンを開くと使えます。');
    else if (!s.frames) parts.push(prof.recording ? '記録中: 再生するか、フレームを動かしてください。' : '［● 記録］を押してから再生すると、1 フレームごとの内訳を記録します。');
    else {
      parts.push(`記録 ${num(s.frames)} フレーム（キャッシュあり ${num(s.hits)}・なし ${num(s.evaluated)}）`);
      parts.push(`平均 <b>${msText(s.total)}</b>・最大 ${msText(s.max)}`);
      if (s.fps) parts.push(`表示できたフレームレート <b>${s.fps.toFixed(1)} fps</b>`);
      if (budget) parts.push(`フレームバジェット ${msText(budget)}（${clip.fps} fps）`);
    }
    $('prof-summary').innerHTML = parts.map((x) => `<span>${x}</span>`).join('');
    // 行列の更新・表示・その他の内訳と、ドローコール・ポリゴン数（記録したフレームの平均）
    const detail = [];
    if (s.frames) {
      detail.push(`<span><b>行列の更新・表示・その他</b>（平均 ${msText(s.avg.scene)}）: `
        + `${SUB_PARTS.map((p) => `${esc(p.label)} ${msText(s.sub[p.key])}`).join('・')}・その他 ${msText(s.sub.other)}</span>`);
      if (s.draw) {
        detail.push(`<span><b>描画</b>（平均 ${msText(s.avg.render)}）: ドローコール ${num(Math.round(s.draw.calls))}・`
          + `ポリゴン数（三角形） ${num(Math.round(s.draw.triangles))}${s.draw.lines ? `・ライン ${num(Math.round(s.draw.lines))}` : ''}</span>`);
      }
    }
    $('prof-detail').innerHTML = detail.join('');
  }

  drawGraph() {
    const cv = $('prof-graph');
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const css = getComputedStyle(this.el);
    const ink = css.getPropertyValue('--text-dim').trim() || '#8e97a1';
    const line = css.getPropertyValue('--line').trim() || '#383d43';
    const prof = this.app.profiler, fr = prof.frames, clip = this.app.clip;
    const budget = clip ? 1000 / clip.fps : 33.3;
    const n = this.visibleBars(), first = Math.max(0, fr.length - n);
    const shown = fr.slice(first);
    const totals = shown.map((e) => PARTS.reduce((t, p) => t + (e.parts[p.key] || 0), 0));
    // 縦の目盛り: フレームバジェットの 1.5 倍か、記録の最大（上位の外れ値で潰れないよう 98% 点）の大きいほう
    const sorted = [...totals].sort((a, b) => a - b);
    const top = sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.98))] : 0;
    const ymax = niceCeil(Math.max(budget * 1.5, top * 1.1, 1));
    const padL = 0, padB = 0;
    const plotH = h - padB;
    const y = (v) => plotH - (Math.min(v, ymax) / ymax) * (plotH - 14);   // 上に目盛りの文字の分を空ける
    // 目盛りの線（控えめ）
    g.strokeStyle = line; g.lineWidth = 1;
    g.fillStyle = ink; g.font = '10px system-ui, sans-serif'; g.textBaseline = 'bottom';
    for (const v of [ymax / 2, ymax]) {
      const yy = Math.round(y(v)) + 0.5;
      g.beginPath(); g.moveTo(padL, yy); g.lineTo(w, yy); g.stroke();
      g.fillText(`${v >= 10 ? Math.round(v) : v.toFixed(1)} ms`, 2, yy - 1);
    }
    // 棒（下から PARTS の順に積む。上端の角だけ丸める）
    shown.forEach((e, k) => {
      const x = padL + k * (BAR + GAP);
      let base = 0;
      PARTS.forEach((p, i) => {
        const v = e.parts[p.key] || 0;
        if (v <= 0) return;
        const y0 = y(base), y1 = y(base + v);
        g.fillStyle = PART_COLORS[i];
        g.fillRect(x, y1, BAR, Math.max(0.5, y0 - y1));
        base += v;
      });
      if (first + k === this.hover) {
        g.strokeStyle = '#dde1e6'; g.lineWidth = 1;
        g.strokeRect(x - 1.5, y(base) - 1.5, BAR + 3, plotH - y(base) + 1.5);
      }
      if (totals[k] > ymax) {                       // 目盛りを超えたフレームは上端に印
        g.fillStyle = '#e5675b';
        g.fillRect(x, 0, BAR, 2);
      }
    });
    // フレームバジェットの線
    const yb = Math.round(y(budget)) + 0.5;
    g.strokeStyle = '#dde1e6'; g.setLineDash([4, 3]); g.lineWidth = 1;
    g.beginPath(); g.moveTo(padL, yb); g.lineTo(w, yb); g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#dde1e6'; g.textAlign = 'right';
    g.fillText(`フレームバジェット ${budget.toFixed(1)} ms`, w - 2, yb - 2);
    g.textAlign = 'left';
  }

  renderTip() {
    const prof = this.app.profiler, e = prof.frames[this.hover];
    const tip = $('prof-tip');
    if (!e) {
      tip.innerHTML = prof.frames.length ? '<span class="muted">棒にマウスを乗せると、そのフレームの内訳を表示します。</span>' : '';
      return;
    }
    const total = PARTS.reduce((t, p) => t + (e.parts[p.key] || 0), 0);
    const path = e.path === 'cache' ? 'キャッシュあり' : e.path === 'compiled' ? '専用の評価' : e.path === 'generic' ? `汎用の経路（${e.reason || ''}）` : '';
    const items = PARTS.map((p, i) => [p, i, e.parts[p.key] || 0]).filter(([, , v]) => v > 0.005)
      .map(([p, i, v]) => `<span><i style="background:${PART_COLORS[i]}"></i>${esc(p.label)} ${msText(v)}</span>`);
    const extra = [];
    if (e.sub) extra.push(`行列の更新・表示の内訳: ${SUB_PARTS.map((p) => `${esc(p.label)} ${msText(e.sub[p.key] || 0)}`).join('・')}`);
    if (e.draw) extra.push(`ドローコール ${num(e.draw.calls)}・ポリゴン数（三角形） ${num(e.draw.triangles)}`);
    tip.innerHTML = `<b>フレーム ${esc(e.f)}</b>・${esc(path)}・合計 <b>${msText(total)}</b>${e.interval ? `・前のフレームから ${msText(e.interval)}` : ''}<div class="prof-tip-items">${items.join('')}</div>`
      + (extra.length ? `<div class="prof-tip-extra">${extra.join('<br>')}</div>` : '');
  }

  renderTable() {
    const prof = this.app.profiler;
    const rows = prof.rows(this.mode);
    const cov = prof.coverage();
    const note = $('prof-table-note');
    if (!prof.evaluated) {
      note.textContent = 'キャッシュなしで評価したフレームがまだありません（キャッシュのあるフレームはコピーだけで、評価しません）。「再生キャッシュを使わずに測る」で測れます。';
      $('prof-table').innerHTML = '';
      return;
    }
    if (this.mode === 'def') { this.renderDefTable(rows); return; }
    note.textContent = `キャッシュなしで評価した ${num(prof.evaluated)} フレームの平均。`
      + (this.mode !== 'path' ? '上流のコンストレイント・計算ノード・IK は、最初に読んだノードの時間に入ります。' : '')
      + (this.mode === 'node' ? `時間の大きい ${num(rows.length)} 個（行を押すとそのノードを選びます）。` : '')
      + `合計 ${msText(cov.categories)}（リグの評価の時間 ${msText(cov.rig)}）。`;
    $('prof-table').className = this.mode === 'node' ? 'by-node' : '';
    if (this.mode === 'node') {
      const maxShare = Math.max(...rows.map((r) => r.share), 0.0001);
      const body = rows.map((r) => `<tr data-ni="${r.ni}" class="${r.path === 'generic' ? 'generic' : ''}" title="クリックで選択">`
        + `<td class="lbl" title="${esc(r.dagPath || r.label)}">${esc(r.label)}</td><td class="kind" title="${esc(r.kind)}">${esc(r.kind)}</td>`
        + `<td class="n">${msText(r.ms)}</td>`
        + `<td class="share"><span class="bar" style="width:${(r.share / maxShare) * 100}%"></span><span class="pct">${(r.share * 100).toFixed(1)}%</span></td></tr>`).join('');
      $('prof-table').innerHTML = `<thead><tr><th>ノード</th><th>種類</th><th class="n">1 フレーム</th><th>割合</th></tr></thead><tbody>${body}</tbody>`;
      return;
    }
    const shown = rows.slice(0, MAX_ROWS), rest = rows.slice(MAX_ROWS);
    const maxShare = Math.max(...rows.map((r) => r.share), 0.0001);
    const tr = (r) => `<tr class="${r.path === 'generic' ? 'generic' : ''}"><td class="lbl" title="${esc(r.label)}">${esc(r.label)}</td>`
      + `<td class="n">${num(r.nodes)}</td><td class="n">${msText(r.ms)}</td>`
      + `<td class="share"><span class="bar" style="width:${(r.share / maxShare) * 100}%"></span><span class="pct">${(r.share * 100).toFixed(1)}%</span></td></tr>`;
    let body = shown.map(tr).join('');
    if (rest.length) {
      const sum = rest.reduce((a, r) => ({ ms: a.ms + r.ms, share: a.share + r.share, nodes: a.nodes + r.nodes }), { ms: 0, share: 0, nodes: 0 });
      body += tr({ label: `ほか ${rest.length} 種類`, path: '', ...sum });
    }
    $('prof-table').innerHTML = `<thead><tr><th>${this.mode === 'type' ? '種類（何で動くノードか）' : '経路'}</th><th class="n">ノード</th><th class="n">1 フレーム</th><th>割合</th></tr></thead><tbody>${body}</tbody>`;
  }

  /** 自作ノード（exprespy など）: 計算そのものと、入力の読み込みの時間 */
  renderDefTable(rows) {
    const prof = this.app.profiler;
    const note = $('prof-table-note');
    $('prof-table').className = 'by-def';
    if (!rows.length) {
      note.textContent = '記録したフレームで、自作ノード（exprespy など）を計算していません。';
      $('prof-table').innerHTML = '';
      return;
    }
    const t = prof.defTotals();
    note.textContent = `キャッシュなしで評価した ${num(prof.evaluated)} フレームの平均。自作ノード ${num(t.nodes)} 個の合計: `
      + `計算 ${msText(t.compute)}・入力の読み込み ${msText(t.read)}（上流の値を求める時間を含む。ほかの自作ノードの分は除く）。`
      + `時間の大きい ${num(rows.length)} 個。「入力」は 1 回の計算で読んだ異なる入力の数（かっこはコードが読んだ回数。同じ入力は 1 回だけ読みます）。`;
    const max = Math.max(...rows.map((r) => r.ms), 0.0001);
    const body = rows.map((r) => `<tr title="${esc(r.kind)}${r.compiled ? '' : '（関数にしていない）'}">`
      + `<td class="lbl">${esc(r.label)}</td><td class="n">${msText(r.compute)}</td><td class="n">${msText(r.read)}</td>`
      + `<td class="n">${num(Math.round(r.inputs))}（${num(Math.round(r.reads))}）</td>`
      + `<td class="share"><span class="bar" style="width:${(r.ms / max) * 100}%"></span><span class="pct">${msText(r.ms)}</span></td></tr>`).join('');
    $('prof-table').innerHTML = `<thead><tr><th>自作ノード</th><th class="n">計算</th><th class="n">読み込み</th><th class="n">入力</th><th>合計</th></tr></thead><tbody>${body}</tbody>`;
  }

  renderCache() {
    const app = this.app;
    const ci = cacheInfo(app.rig, app.clip), pi = planInfo(app.rig), w = app.bakers.stats();
    const sc = app.profilerScene();
    const items = [];
    if (sc) items.push(['シーン', `メッシュ ${num(sc.meshes)}（スキン付き ${num(sc.skinned)}）・頂点 ${num(sc.vertices)}・ジョイント ${num(sc.joints)}・カーブ ${num(sc.curves)}（リグで形が変わる ${num(sc.rigCurves)}）`]);
    if (pi) {
      if (!pi.used) items.push(['専用の評価', `使っていません: ${pi.reason}`]);
      else {
        const c = pi.counts;
        const del = Object.entries(pi.delegated || {}).map(([why, n]) => `${why} ${num(n)}`).join('・');
        items.push(['専用の評価', `キーで動く ${num(c.simple)}・入力で動く ${num(c.driven)}・汎用の経路に任せた ${num(c.delegated)}${del ? `（${esc(del)}）` : ''}`]);
      }
      if (pi.defs.total) items.push(['自作ノードの定義', `${num(pi.defs.total)} 種類（exprespy など）・計算を JavaScript の関数にした ${num(pi.defs.compiled)}`]);
    }
    if (ci) {
      items.push(['動くノード', `${num(ci.moving)} 個・キャッシュは 1 フレーム ${formatBytes(ci.perFrame)}`]);
      items.push(['覚えたフレーム', `${num(ci.frames)} / ${num(ci.range)}・${formatBytes(ci.bytes)}（上限 ${ci.limit ? formatBytes(ci.limit) : 'オフ'}）${ci.limit > 0 && ci.full && ci.frames < ci.range ? '・<span class="warn">上限に達しています</span>' : ''}`]);
      items.push(['上限ごとに入る数', ci.fits.map(([mb, n]) => `${mb >= 1024 ? mb / 1024 + ' GB' : mb + ' MB'}: ${num(n)}`).join('　')]);
    }
    if (!w.available) {
      items.push(['ワーカー', '使っていません（画面のスレッドの空き時間に作ります）']);
      if (w.error) items.push(['使えない理由', esc(errorText(w.error))]);
    } else {
      let t = `${w.count} 個（CPU のコア ${w.cores || '不明'}）・${w.busy ? '作っています' : '止まっています'}`;
      if (w.frames) {
        t += `・読み込んでから作ったフレーム ${num(w.frames)}・1 フレームの評価 ${msText(w.perFrame)}（ワーカーの中）`;
        if (w.throughput) t += `・全体で 1 フレーム ${msText(1000 / w.throughput)}`;
      }
      items.push(['ワーカー', t]);
      const st = workerStartText(w);
      if (st) items.push(['作り始め', esc(st)]);
    }
    $('prof-cache').innerHTML = `<dl>${items.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
  }

  text() {
    const app = this.app;
    const t = profilerText(app.profiler, { scene: app.profilerScene(), clip: app.clip, rig: app.rig, workers: app.bakers.stats() });
    return this.checkResult ? `${t}\n\n${checkText(this.checkResult)}` : t;
  }

  /** ［このフレームを確かめる］ */
  runCheck() {
    const out = $('prof-check-result');
    out.innerHTML = '<span class="muted">確かめています…</span>';
    setTimeout(async () => {                         // 表示を更新してから（大きなシーンでは数秒かかる）
      let r;
      try { r = await this.app.checkFrame(); } catch (e) { out.textContent = `確かめられませんでした: ${e.message}`; return; }
      this.checkResult = r;
      if (!r) { out.textContent = 'アニメーションのあるシーンを開くと使えます。'; return; }
      const list = (diff) => (diff.length
        ? `<ul>${diff.slice(0, 12).map((d) => `<li><span class="lbl">${esc(d.name)}</span> <span class="muted">差 ${d.err.toExponential(1)}</span></li>`).join('')}${diff.length > 12 ? `<li class="muted">ほか ${num(diff.length - 12)} 個</li>` : ''}</ul>` : '');
      const rows = r.rig.map((x) => `<div><b>${esc(x.label)}</b>: 動くノード ${num(x.compared)} 個のうち、汎用の経路と違うもの `
        + `<span class="${x.diff.length ? 'warn' : 'ok'}">${num(x.diff.length)} 個</span>${list(x.diff)}</div>`);
      rows.push(`<div><b>表示の行列</b>: 表示中のオブジェクト ${num(r.display.checked)} 個のうち、親からたどった値と違うもの `
        + `<span class="${r.display.diff.length ? 'warn' : 'ok'}">${num(r.display.diff.length)} 個</span>${list(r.display.diff)}</div>`);
      out.innerHTML = `<div class="muted">フレーム ${esc(r.frame)}${r.posed ? '（ポーズ確認の追加分があるため、いまの表示は比べません）' : ''}</div>${rows.join('')}`;
    }, 30);
  }

  async copy() {
    const text = this.text();
    let ok = false;
    if (this.app.bridge && this.app.bridge.copyText) { this.app.bridge.copyText(text); ok = true; }
    if (!ok) {
      try { await navigator.clipboard.writeText(text); ok = true; } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
      }
    }
    this.app.ui.setMessage(ok ? '評価のプロファイラの結果をコピーしました' : 'コピーできませんでした', 5000);
    return text;
  }
}

function niceCeil(x) {
  const p = 10 ** Math.floor(Math.log10(x));
  for (const m of [1, 2, 2.5, 5, 10]) if (x <= m * p) return m * p;
  return 10 * p;
}
