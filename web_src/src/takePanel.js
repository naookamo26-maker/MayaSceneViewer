// テイクの一覧（右パネルの右端の縦のタブ［テイク］）。行をクリックするとテイクに切り替える。先頭の行は「シーンのアニメーション」。
// 状態は ViewerApp（main.js の takes・activeTake）が持ち、ここは表示と操作の受け付けだけ。
//   行: 名前・範囲・フレーム数・当てている相手（名前空間）・警告の印（当たらなかった結び付け。クリックで中身）
//   行の操作: 名前の変更（F2・ダブルクリック）・削除（Delete）・.msva に書き出す（ブラウザはダウンロード）
//   一覧の操作: 読み込む（ファイルを選ぶ）・すべて書き出す・並べ替え（名前・開始フレーム・長さ・当てる先）。
//   ファイルを一覧にドラッグ＆ドロップするとテイクとして足す
//   当てる先: 候補が複数（名前空間が複数・名前空間のない同じリグが複数）なら、行の一覧で選ぶ
//   並べ替え: 行をドラッグ、または Alt+↑↓
import { takeFrames, takeTargetLabel } from './takes.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtFrame = (v) => (Number.isInteger(+v) ? String(+v) : (+v).toFixed(2).replace(/\.?0+$/, ''));

export class TakePanel {
  constructor(app) {
    this.app = app;
    this.root = $('sec-takes');
    this.list = $('take-list');
    this.open = new Set();            // 当たらなかった結び付けを開いている行
    this.editing = -1;                // 名前を変えている行
    this.dropAt = -1;
    if (!this.root || !this.list) return;
    this.bindTabs();
    const input = $('take-input');
    $('take-import').addEventListener('click', () => {
      // Qt 版は Python が読む（.msva・.msv・共通 JSON）。ブラウザはファイルを選ぶ
      if (this.qt('importTakes')) this.app.bridge.importTakes();
      else if (input) input.click();
    });
    if (input) {
      input.addEventListener('change', () => {
        const files = [...(input.files || [])];
        input.value = '';
        if (files.length) this.app.loadTakeFiles(files, -1, false);
      });
    }
    const all = $('take-export-all');
    if (all) all.addEventListener('click', () => this.exportTakes(null));
    this.list.addEventListener('click', (e) => this.onClick(e));
    this.list.addEventListener('dblclick', (e) => {
      const row = e.target.closest('.take-row');
      if (row && +row.dataset.index >= 0 && !e.target.closest('button')) this.startRename(+row.dataset.index);
    });
    this.list.addEventListener('keydown', (e) => this.onKey(e));
    this.list.addEventListener('change', (e) => {
      const sel = e.target.closest('select.take-target');
      const row = sel && sel.closest('.take-row');
      if (row) this.app.setTakeTarget(+row.dataset.index, +sel.value);
    });
    const mi = $('menu-take-import');
    if (mi) mi.addEventListener('click', () => $('take-import').click());
    const me = $('menu-take-export');
    if (me) me.addEventListener('click', () => this.exportTakes(null));
    const sort = $('take-sort');
    if (sort) {
      sort.addEventListener('change', () => {
        const [by, dir] = String(sort.value).split(':');
        sort.value = '';
        if (by) this.app.sortTakes(by, dir === 'desc');
      });
      sort.addEventListener('keydown', (e) => e.stopPropagation());
    }
    this.bindReorder();
    this.render();
  }

  /**
   * 行をドラッグして並べ替える（ポインターで動かす。HTML のドラッグ＆ドロップは、Qt 版の Web ビューがドロップを受けないため
   * 使わない）。4 px 以上動かしたらドラッグとし、離したときに、線を出した位置へ動かす
   */
  bindReorder() {
    let drag = null;
    const insertAt = (y) => {
      const rows = [...this.list.querySelectorAll('.take-row')].filter((el) => +el.dataset.index >= 0);
      for (const el of rows) {
        const b = el.getBoundingClientRect();
        if (y < b.top + b.height / 2) return +el.dataset.index;
      }
      return this.app.takes.length;
    };
    const showLine = (at) => {
      for (const el of this.list.querySelectorAll('.take-row')) {
        const i = +el.dataset.index;
        el.classList.toggle('drop-before', at >= 0 && i === at);
        el.classList.toggle('drop-after', at >= 0 && at === this.app.takes.length && i === at - 1);
        el.classList.toggle('dragging', !!drag && drag.active && i === drag.from);
      }
    };
    this.list.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, input, select')) return;
      const row = e.target.closest('.take-row');
      const i = row ? +row.dataset.index : -1;
      if (i < 0 || this.editing >= 0) return;
      drag = { from: i, y: e.clientY, id: e.pointerId, active: false, at: -1 };
    });
    this.list.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.active) {
        if (Math.abs(e.clientY - drag.y) < 4) return;
        drag.active = true;
        try { this.list.setPointerCapture(e.pointerId); } catch (err) { /* 取れなくてもよい */ }
        this.list.classList.add('reordering');
      }
      drag.at = insertAt(e.clientY);
      showLine(drag.at);
      e.preventDefault();
    });
    const end = (e, cancel) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const d = drag;
      drag = null;
      this.list.classList.remove('reordering');
      showLine(-1);
      if (!d.active) return;
      this.suppressClick = true;                   // ドラッグの終わりのクリックで、テイクを切り替えない
      setTimeout(() => { this.suppressClick = false; }, 0);
      if (cancel || d.at < 0) return;
      const to = d.at > d.from ? d.at - 1 : d.at;
      if (this.app.moveTake(d.from, to)) this.focusRow(to);
    };
    this.list.addEventListener('pointerup', (e) => end(e, false));
    this.list.addEventListener('pointercancel', (e) => end(e, true));
  }

  /** 右パネルの縦のタブ（プロパティ・テイク）。クリック・↑↓ キーで切り替える */
  bindTabs() {
    this.tabs = [...document.querySelectorAll('#right .side-tab')];
    for (const t of this.tabs) {
      t.addEventListener('click', () => this.showTab(t.id));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        const k = this.tabs.indexOf(t) + (e.key === 'ArrowDown' ? 1 : -1);
        const next = this.tabs[(k + this.tabs.length) % this.tabs.length];
        this.showTab(next.id);
        next.focus();
        e.preventDefault();
        e.stopPropagation();
      });
    }
    let saved = null;
    try { saved = localStorage.getItem('msv.rightTab'); } catch (err) { saved = null; }
    if (saved && $(saved)) this.showTab(saved, false);
  }

  /** 右パネルのタブを切り替える（id: tab-props・tab-takes） */
  showTab(id, remember = true) {
    const tab = $(id);
    if (!tab || !this.tabs) return;
    for (const t of this.tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const pane = $(t.dataset.pane);
      if (pane) pane.hidden = !on;
    }
    const title = $('right-title');
    if (title) title.textContent = tab.firstChild ? tab.firstChild.textContent : '';
    if (remember) { try { localStorage.setItem('msv.rightTab', id); } catch (err) { /* 保存できなくてもよい */ } }
  }

  get takesShown() { return !!this.root && !this.root.hidden; }

  /** Qt 版のブリッジの関数があるか */
  qt(name) { return !!(this.app.bridge && typeof this.app.bridge[name] === 'function'); }

  /** テイクを .msva に書き出す。indices の -1 はシーンのアニメーション。省くと一覧のすべて（空ならシーンのアニメーション） */
  exportTakes(indices) {
    if (!this.app.takes.length && !this.app.sceneAnim) { this.app.ui.setMessage('書き出すテイクがありません', 4000); return; }
    const first = indices && indices.length === 1 && indices[0] >= 0 ? this.app.takes[indices[0]] : null;
    const name = first ? first.take.name : (this.app.sceneName || 'takes').replace(/\.[^.]*$/, '');
    // Qt 版は保存先を Python が聞く。ブラウザはダウンロードとして保存する
    if (this.qt('exportTakes')) this.app.bridge.exportTakes(this.app.takesJson(indices), name);
    else this.app.downloadTakes(indices, name);
  }

  onClick(e) {
    if (this.suppressClick) return;
    if (e.target.closest('select')) return;
    const row = e.target.closest('.take-row');
    if (!row) return;
    const i = +row.dataset.index;
    const btn = e.target.closest('button');
    if (btn) {
      e.stopPropagation();
      const act = btn.dataset.act;
      if (act === 'warn') { if (this.open.has(i)) this.open.delete(i); else this.open.add(i); this.render(); }
      else if (act === 'rename') this.startRename(i);
      else if (act === 'delete') this.app.removeTake(i);
      else if (act === 'export') this.exportTakes([i]);
      else if (act === 'target-node') this.targetSelectedNode(i);
      return;
    }
    if (e.target.closest('input')) return;
    if (i !== this.app.activeTake) this.app.setTake(i);
  }

  /** 階層・ビューポートで選んでいるノードを、テイク i の当てる先にする */
  targetSelectedNode(i) {
    const ni = this.app.selected;
    if (!(ni >= 0)) { this.app.ui.setMessage('当てる先にするノード（キャラクターのいちばん上のグループなど）を、階層で選んでください', 6000); return; }
    this.app.setTakeTargetNode(i, ni);
  }

  onKey(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.target.tagName === 'SELECT') { e.stopPropagation(); return; }   // 当てる先の一覧の操作はビューアに渡さない
    const row = e.target.closest('.take-row');
    if (!row) return;
    const i = +row.dataset.index;
    const rows = [...this.list.querySelectorAll('.take-row')];
    const k = rows.indexOf(row);
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.altKey) {
      // Alt+↑↓: テイクを上下に動かす
      const to = i + (e.key === 'ArrowDown' ? 1 : -1);
      if (i >= 0 && this.app.moveTake(i, to)) this.focusRow(to);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const next = rows[k + (e.key === 'ArrowDown' ? 1 : -1)];
      if (next) next.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (i !== this.app.activeTake) this.app.setTake(i);
    } else if (e.key === 'F2' && i >= 0) {
      this.startRename(i);
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && i >= 0) {
      this.app.removeTake(i);
      this.focusRow(Math.min(i, this.app.takes.length - 1));
    } else return;
    e.preventDefault();
    e.stopPropagation();            // ビューアのキー操作（再生など）に渡さない
  }

  focusRow(i) {
    const row = this.list.querySelector(`.take-row[data-index="${i}"]`);
    if (row) row.focus();
  }

  startRename(i) {
    if (!this.app.takes[i]) return;
    this.editing = i;
    this.render();
    const input = this.list.querySelector('.take-rename');
    if (!input) return;
    input.focus();
    input.select();
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      this.editing = -1;
      if (save) this.app.renameTake(i, input.value); else this.render();
      this.focusRow(i);
    };
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
    });
    input.addEventListener('blur', () => finish(true));
  }

  render() {
    if (!this.root || !this.list) return;
    const app = this.app;
    const takes = app.takes;
    const count = $('take-count');
    if (count) count.textContent = takes.length ? `${takes.length}` : '';
    const all = $('take-export-all');
    if (all) {
      all.hidden = !takes.length && !app.sceneAnim;
      all.title = takes.length ? '一覧のテイクをすべて .msva に書き出す' : 'シーンのアニメーションを .msva に書き出す';
    }
    const sort = $('take-sort');
    if (sort) sort.hidden = takes.length < 2;
    const hint = $('take-hint');
    if (hint) {
      hint.textContent = app.built ? (this.qt('importTakes') ? '.msva・.ma・.msv・共通 JSON' : '.msva・.msv・共通 JSON') + ' をこのタブにドラッグ＆ドロップすると、テイクとして足します（行をクリックで切り替え。テイクがなければ［書き出す…］でシーンのアニメーションを .msva にできます）'
        : 'シーンを開くと、テイク（ほかのシーンのアニメーション）を当てて切り替えられます';
    }
    const html = [];
    const sceneLabel = app.sceneAnim ? 'シーンのアニメーション' : 'アニメーションなし';
    const sa = app.sceneAnim;
    const sceneMeta = sa && Number.isFinite(+sa.start) ? `${fmtFrame(sa.start)}〜${fmtFrame(sa.end)}` : '';
    if (app.built) {
      html.push(this.rowHtml(-1, sceneLabel, sceneMeta, '', 0));
      takes.forEach((e, i) => {
        const t = e.take;
        const meta = `${fmtFrame(t.start)}〜${fmtFrame(t.end)}`;
        const report = e.report;
        const missed = report ? report.missed.length + (report.staticsMissed ? 1 : 0) : 0;
        html.push(this.rowHtml(i, t.name, meta, e, missed, report));
      });
    }
    this.list.innerHTML = html.join('');
    this.list.hidden = !app.built;
  }

  rowHtml(i, name, meta, target, missed, report = null) {
    const app = this.app;
    const active = i === app.activeTake;
    const t = i >= 0 ? app.takes[i].take : null;
    const nameHtml = i >= 0 && i === this.editing
      ? `<input class="take-rename" type="text" value="${esc(name)}" aria-label="テイクの名前">`
      : `<span class="take-name">${esc(name)}</span>`;
    const warn = missed ? `<button type="button" class="take-warn" data-act="warn" aria-expanded="${this.open.has(i)}"`
      + ` title="当たらなかった結び付けがあります（クリックで一覧）">⚠${missed}</button>` : '';
    const exportBtn = '<button type="button" class="icon-btn" data-act="export" title=".msva に書き出す" aria-label=".msva に書き出す">⤓</button>';
    const acts = i < 0 ? (app.sceneAnim ? `<span class="take-acts">${exportBtn}</span>` : '') : '<span class="take-acts">'
      + '<button type="button" class="icon-btn" data-act="rename" title="名前を変える（F2）" aria-label="名前を変える">✎</button>'
      + '<button type="button" class="icon-btn" data-act="target-node" title="階層で選んでいるノードの下に当てる（当てる先が自動で見つからないとき）" aria-label="選んでいるノードに当てる">◎</button>'
      + exportBtn
      + '<button type="button" class="icon-btn" data-act="delete" title="一覧から消す（Delete）" aria-label="一覧から消す">×</button>'
      + '</span>';
    // 当てる先: 候補が複数あれば一覧で選ぶ。1 つなら、名前空間・ノードのあるときだけ名前を出す
    let nsHtml = '';
    const label = target ? takeTargetLabel(target) : '';
    const cands = (target && target.candidates) || [];
    if (cands.length > 1) {
      const cur = cands.findIndex((c) => c.namespace === target.namespace && (c.root || null) === (target.root || null));
      nsHtml = `<select class="take-target" aria-label="当てる先" title="当てる先（名前空間・キャラクターのいちばん上のノード）">`
        + cands.map((c, k) => `<option value="${k}"${k === cur ? ' selected' : ''}>${esc(takeTargetLabel(c))}（${c.count}）</option>`).join('')
        + '</select>';
    } else if (target) {
      // 候補が 1 つでも、当てている先を出す（名前空間もノードもなければ「シーン全体」）
      nsHtml = `<span class="take-ns" title="当てる先">${esc(target.namespace || target.root ? label : 'シーン全体')}</span>`;
    }
    // 行のツールチップ: 名前・範囲・フレーム数・当てている相手・警告
    const tip = [name];
    if (t) {
      tip.push(`${fmtFrame(t.start)}〜${fmtFrame(t.end)}（${takeFrames(t)} フレーム・${t.fps} fps）`);
      tip.push(`当てている先: ${label}${target.root ? `（${target.root}）` : ''}`);
      if (t.source && t.source.name) tip.push(`取り出したファイル: ${t.source.name}`);
    } else if (meta) tip.push(meta);
    if (report && report.warnings && report.warnings.length) tip.push(...report.warnings);
    let detail = '';
    if (missed && this.open.has(i)) {
      const lines = app.takeMissedText(i).split('\n').filter(Boolean);
      detail = `<li class="take-detail">${lines.map((l) => `<div>${esc(l)}</div>`).join('')}</li>`;
    }
    return `<li class="take-row${active ? ' active' : ''}${i < 0 ? ' scene' : ''}" role="option" tabindex="0" data-index="${i}"`
      + ` aria-selected="${active}"${active ? ' aria-current="true"' : ''} title="${esc(tip.join('\n'))}">`
      + `${nameHtml}<span class="take-range">${esc(meta)}</span>${acts}${nsHtml}${warn}</li>${detail}`;
  }

  /** ページの座標 (x, y) がテイクの区切りの中なら、入れる位置（行のあいだ。末尾は takes.length）。外は -1 */
  dropIndex(x, y) {
    if (!this.root || !this.app.built || x < 0) return -1;
    const tab = $('tab-takes');
    if (tab) {                                     // タブ［テイク］にドロップしても足す（末尾）
      const t = tab.getBoundingClientRect();
      if (t.width && x >= t.left && x <= t.right && y >= t.top && y <= t.bottom) return this.app.takes.length;
    }
    if (!this.takesShown) return -1;
    const r = this.root.getBoundingClientRect();
    if (!r.width || !r.height || x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
    const rows = [...this.list.querySelectorAll('.take-row')].filter((el) => +el.dataset.index >= 0);
    for (const el of rows) {
      const b = el.getBoundingClientRect();
      if (y < b.top + b.height / 2) return +el.dataset.index;
    }
    return this.app.takes.length;
  }

  /** ドラッグ中: 一覧の上なら枠を強調して、入る位置に線を出す。戻り値は dropIndex と同じ */
  dragOver(x, y) {
    const at = this.dropIndex(x, y);
    if (!this.root) return at;
    // ドラッグ中にタブ［テイク］に載せたら、テイクの面に切り替える（一覧の行のあいだに落とせるように）
    const tab = $('tab-takes');
    const onTab = !!tab && at >= 0 && !this.takesShown;
    if (onTab) this.showTab('tab-takes', false);
    if (tab) tab.classList.toggle('drop', at >= 0);
    if (at === this.dropAt) return at;
    this.dropAt = at;
    this.root.classList.toggle('take-drop', at >= 0);
    for (const el of this.list.querySelectorAll('.take-row')) {
      const i = +el.dataset.index;
      el.classList.toggle('drop-before', at >= 0 && i === at);
      el.classList.toggle('drop-after', at >= 0 && at === this.app.takes.length && i === at - 1);
    }
    return at;
  }
}
