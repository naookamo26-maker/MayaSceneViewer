// 画面のパネル類（DOM）。描画やシーン操作は app（main.js）に任せる。

const $ = (id) => document.getElementById(id);

const ICON = {
  joint: '<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',
  transform: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',
  mesh: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  skin: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>',
};

const EYE = '<svg class="on" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.8" fill="currentColor"/></svg><svg class="off" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M2 12 12 2" stroke="currentColor" stroke-width="1.4"/></svg>';
/** ノード名の名前空間から、そのノードを読み込んだリファレンス（.ma のみ。入れ子なら内側のもの）。なければ null */
export function referenceOf(data, name) {
  let best = null;
  for (const r of (data.source && data.source.references) || []) {
    if (r.loaded && r.namespace && name.startsWith(r.namespace + ':')
        && (!best || r.namespace.length > best.namespace.length)) best = r;
  }
  return best;
}
/** パスのファイル名 */
const fileName = (p) => String(p || '').split(/[\\/]/).pop();
/** 階層の名前: 名前空間（armA:）は薄く表示する */
function nameHtml(label) {
  const k = label.lastIndexOf(':');
  return k > 0 ? `<span class="ns">${esc(label.slice(0, k + 1))}</span>${esc(label.slice(k + 1))}` : esc(label);
}
/** 進捗のバー（i 要素）に割合を反映する。割合が分からなければ止まった帯で表示する */
function setBar(bar, frac) {
  const known = typeof frac === 'number' && frac >= 0;
  bar.parentElement.classList.toggle('indeterminate', !known);
  bar.style.width = known ? `${Math.round(Math.min(1, frac) * 100)}%` : '';
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const fmt = (v, d = 3) => {
  if (!Number.isFinite(v)) return String(v);
  const x = Math.abs(v) < 0.5 * 10 ** -d ? 0 : v;
  return x.toFixed(d);
};
const fmt3 = (a, d = 3) => a.map((v) => fmt(v, d)).join(', ');
const num = (n) => n.toLocaleString('ja-JP');

export class UI {
  constructor(app) {
    this.app = app;
    this.rows = [];
    this.rowOfNode = new Map();
    this.collapsed = new Set();
    this.selectedRow = null;
    this.filter = '';
    this.msgTimer = 0;
    this.textureState = null;       // テクスチャの読み込み状況（選択情報のメッシュの欄に出す）
    this.bindToolbar();
    this.bindTree();
    this.bindPose();
    this.bindPanels();
    this.bindResizer();
  }

  // ---------------------------------------------------------------- 左パネルの幅
  bindResizer() {
    const handle = $('left-resizer');
    const app = $('app');
    const DEFAULT = 260, MIN = 160;
    const maxWidth = () => Math.max(MIN, Math.min(640, Math.floor(window.innerWidth * 0.5)));
    const current = () => $('left').getBoundingClientRect().width;
    const setWidth = (w) => {
      const v = Math.round(Math.max(MIN, Math.min(maxWidth(), w)));
      app.style.setProperty('--left-user', v + 'px');
      handle.setAttribute('aria-valuenow', String(v));
      return v;
    };
    handle.setAttribute('aria-valuemin', String(MIN));
    handle.setAttribute('aria-valuemax', String(maxWidth()));
    let drag = null;
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      drag = { x: e.clientX, w: current() };
      try { handle.setPointerCapture(e.pointerId); } catch (err) { /* 合成イベントなど */ }
      handle.classList.add('dragging');
      document.body.classList.add('resizing');
    });
    handle.addEventListener('pointermove', (e) => {
      if (drag) setWidth(drag.w + (e.clientX - drag.x));
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      handle.classList.remove('dragging');
      document.body.classList.remove('resizing');
    };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
    handle.addEventListener('dblclick', () => { app.style.removeProperty('--left-user'); handle.setAttribute('aria-valuenow', String(DEFAULT)); });
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 64 : 16;
      if (e.key === 'ArrowLeft') setWidth(current() - step);
      else if (e.key === 'ArrowRight') setWidth(current() + step);
      else if (e.key === 'Home') setWidth(MIN);
      else if (e.key === 'End') setWidth(maxWidth());
      else return;
      e.preventDefault();
      e.stopPropagation();
    });
    this.setLeftWidth = setWidth;
  }

  // ---------------------------------------------------------------- パネルの最小化
  bindPanels() {
    for (const side of ['left', 'right']) {
      $(side + '-collapse').addEventListener('click', () => this.setPanelCollapsed(side, true));
      $(side + '-expand').addEventListener('click', () => this.setPanelCollapsed(side, false));
    }
  }

  setPanelCollapsed(side, collapsed) {
    document.body.classList.toggle(side + '-collapsed', collapsed);
    $(side + '-collapse').setAttribute('aria-expanded', String(!collapsed));
    $(side + '-expand').setAttribute('aria-expanded', String(!collapsed));
    // フォーカスを、表示されている側のボタンへ移す
    $(side + (collapsed ? '-expand' : '-collapse')).focus();
  }

  isPanelCollapsed(side) { return document.body.classList.contains(side + '-collapsed'); }

  setHost(host) { document.body.dataset.host = host; }

  // ---------------------------------------------------------------- ツールバー
  bindToolbar() {
    const s = (key, v) => this.app.setSetting(key, v);
    // メニューの選択肢（押すとすぐ切り替える。data-close-on-pick のメニューは選んだら閉じる）
    document.querySelectorAll('.choices[data-setting]').forEach((group) => {
      group.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-value]');
        if (!b) return;
        const key = group.dataset.setting;
        if (key === 'camera') this.app.setCamera(+b.dataset.value);
        else s(key, b.dataset.value);
        if (group.closest('[data-close-on-pick]') && this.closeMenus) this.closeMenus();
      });
    });
    $('opt-bind').addEventListener('click', () => this.app.togglePoseSource());
    $('opt-camera-icons').addEventListener('change', (e) => s('cameraIcons', e.target.checked));
    $('opt-hud').addEventListener('change', (e) => s('hud', e.target.checked));
    $('opt-camera-gate').addEventListener('change', (e) => s('cameraGate', e.target.checked));
    $('opt-normal-flip').addEventListener('change', (e) => s('normalFlipY', e.target.checked));
    document.querySelectorAll('#map-toggles [data-map]').forEach((el) => {
      el.addEventListener('change', () => this.app.setMapToggle(el.dataset.map, el.checked));
    });
    $('opt-jsize').addEventListener('input', (e) => s('jointSize', parseFloat(e.target.value)));
    const toggles = { 'opt-wire': 'wire', 'opt-skin': 'skin', 'opt-joints': 'joints', 'opt-curves': 'curves', 'opt-xray': 'xray', 'opt-tex': 'textures', 'opt-grid': 'grid' };
    for (const [id, key] of Object.entries(toggles)) {
      $(id).addEventListener('click', (e) => {
        const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
        e.currentTarget.setAttribute('aria-pressed', String(on));
        s(key, on);
      });
    }
    document.querySelectorAll('#opt-tool [data-tool]').forEach((b) => {
      b.addEventListener('click', () => s('tool', b.dataset.tool));
    });
    document.querySelectorAll('#opt-pick [data-pick]').forEach((b) => {
      b.addEventListener('click', () => s('pickMode', b.dataset.pick));
    });
    $('opt-pick-all').addEventListener('click', (e) => s('pickAll', e.currentTarget.getAttribute('aria-pressed') !== 'true'));
    $('opt-space').addEventListener('click', (e) => s('space', e.currentTarget.getAttribute('aria-pressed') === 'true' ? 'local' : 'world'));
    this.bindMenus();
    $('btn-undo').addEventListener('click', () => this.app.undo());
    $('btn-warnings').addEventListener('click', () => this.app.showWarnings());
    $('warn-dialog-close').addEventListener('click', () => $('warn-dialog').close());
    $('btn-redo').addEventListener('click', () => this.app.redo());
    $('btn-frame-all').addEventListener('click', () => this.app.frameAll());
    $('btn-frame-sel').addEventListener('click', () => this.app.frameSelection());
    $('file-input').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) this.app.loadFile(f);
      e.target.value = '';
    });
    document.querySelector('label[for="file-input"]').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file-input').click(); }
    });
  }

  /** キーボード操作などで変わった設定をツールバーに反映 */
  syncSettings(st) {
    document.querySelectorAll('.choices[data-setting]').forEach((group) => {
      if (group.dataset.setting !== 'camera') this.checkChoice(group, st[group.dataset.setting]);
    });
    $('opt-jsize').value = st.jointSize;
    $('opt-wire').setAttribute('aria-pressed', String(st.wire));
    $('opt-skin').setAttribute('aria-pressed', String(st.skin));
    $('opt-joints').setAttribute('aria-pressed', String(st.joints));
    $('opt-curves').setAttribute('aria-pressed', String(st.curves !== false));
    $('opt-xray').setAttribute('aria-pressed', String(st.xray));
    $('opt-grid').setAttribute('aria-pressed', String(!!st.grid));
    $('opt-tex').setAttribute('aria-pressed', String(st.textures));
    $('opt-bind').setAttribute('aria-pressed', String(st.poseSource === 'bind'));
    $('opt-camera-icons').checked = st.cameraIcons !== false;
    $('opt-hud').checked = st.hud !== false;
    $('opt-camera-gate').checked = st.cameraGate !== false;
    $('opt-normal-flip').checked = !!st.normalFlipY;
    $('map-toggles').disabled = st.mapView !== 'combined';
    document.querySelectorAll('#map-toggles [data-map]').forEach((el) => { el.checked = !!st.maps[el.dataset.map]; });
    $('opt-space').setAttribute('aria-pressed', String(st.space === 'world'));
    document.querySelectorAll('#opt-pick [data-pick]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pick === st.pickMode)));
    $('opt-pick-all').setAttribute('aria-pressed', String(!!st.pickAll));
    // メニュー名の横に、既定と違う設定を表示する
    const VIEW = { baseColor: 'ベースカラー', normal: '法線', roughness: 'ラフネス', metalness: 'メタリック', ao: 'AO', emissive: 'エミッシブ', opacity: '不透明度' };
    const viewState = [st.lighting === 'flat' ? 'フラットライト' : '', st.shading === 'none' ? 'ワイヤーのみ' : st.shading === 'flat' ? 'フラット' : '']
      .filter(Boolean).join('・');
    $('menu-view-state').textContent = viewState;
    $('menu-maps-state').textContent = st.mapView !== 'combined' ? VIEW[st.mapView] || '' : '';
    $('menu-weights-state').textContent = { selected: 'ヒートマップ', all: '色分け' }[st.weightMode] || '';
    document.querySelectorAll('#opt-tool [data-tool]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tool === st.tool));
    });
  }

  /**
   * 今の表示設定では効果のない切り替えボタンを薄く表示し、理由をツールチップに足す（押すこと自体はできる）。
   * @param hints {ボタンの id: 理由}（載っていないボタンは通常の表示）
   */
  setToolbarHints(hints) {
    for (const id of ['opt-wire', 'opt-tex', 'opt-skin', 'opt-joints', 'opt-curves', 'opt-xray', 'opt-bind', 'opt-grid']) {
      const b = $(id);
      if (b.dataset.baseTitle === undefined) b.dataset.baseTitle = b.title;
      const why = hints[id];
      b.classList.toggle('inert', !!why);
      b.title = why ? `${b.dataset.baseTitle}\n※ いまは効果がありません: ${why}` : b.dataset.baseTitle;
    }
  }

  // ---------------------------------------------------------------- シーンのカメラ
  /** 選択肢のうち value のボタンを選んだ状態にする */
  checkChoice(group, value) {
    group.querySelectorAll('button[data-value]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.value === String(value))));
  }

  setCameras(list) {
    const group = $('opt-camera');
    group.textContent = '';
    const add = (value, text, sub) => {
      const b = document.createElement('button');
      Object.assign(b, { type: 'button', textContent: text, title: text });
      b.setAttribute('role', 'radio');
      b.dataset.value = String(value);
      if (sub) { const s2 = document.createElement('span'); s2.className = 'c-sub'; s2.textContent = sub; b.appendChild(s2); }
      group.appendChild(b);
    };
    add(-1, '自由視点（パース）');
    list.forEach((c, i) => add(i, c.name, c.orthographic ? '平行投影' : `${fmt(c.focalLength, 0)}mm`));
    if (!list.length) {
      const p = document.createElement('p');
      p.className = 'muted small';
      p.textContent = 'このシーンにはカメラがありません';
      group.appendChild(p);
    }
    $('camera-note').hidden = !list.length;
    this.setViewCamera(-1, '');
  }

  /** @param edited 停止中にカメラのビューを動かしているか */
  setViewCamera(ci, name, edited = false) {
    this.checkChoice($('opt-camera'), ci);
    $('menu-camera-state').textContent = ci >= 0 ? name + (edited ? '（視点を移動中）' : '') : '';
    $('viewport').classList.toggle('viewing-camera', ci >= 0);
    $('vp-hint').textContent = ci >= 0
      ? `カメラ ${name} から表示中${edited ? '（視点を動かしています。フレームを動かすか再生すると戻ります）' : '（停止中はドラッグで視点を動かせます）'}`
        + '　Shift+C: 自由視点に戻す'
      : '左ドラッグ: 回転　中ドラッグ: 移動　右ドラッグ・ホイール: ズーム　クリック: 選択';
  }

  /** 解像度ゲート（ビューポート上のピクセル）。rect が null なら隠す。mask=false なら枠だけ */
  setGate(mask, rect, W, H) {
    const el = $('cam-gate');
    if (!rect) { el.hidden = true; return; }
    el.hidden = false;
    el.classList.toggle('no-mask', !mask);
    const [t, b, l, r] = el.children;
    const px = (v) => `${Math.round(v)}px`;
    Object.assign(t.style, { left: 0, right: 0, top: 0, height: px(rect.y) });
    Object.assign(b.style, { left: 0, right: 0, bottom: 0, height: px(H - rect.y - rect.h) });
    Object.assign(l.style, { left: 0, top: px(rect.y), width: px(rect.x), height: px(rect.h) });
    Object.assign(r.style, { right: 0, top: px(rect.y), width: px(W - rect.x - rect.w), height: px(rect.h) });
    Object.assign(el.querySelector('.g-frame').style, { left: px(rect.x), top: px(rect.y), width: px(rect.w), height: px(rect.h) });
  }

  // ---------------------------------------------------------------- メニュー（ツールバーのドロップダウン）
  bindMenus() {
    const buttons = [...document.querySelectorAll('.menu-btn')];
    const close = (except) => {
      for (const b of buttons) {
        if (b === except) continue;
        b.setAttribute('aria-expanded', 'false');
        $(b.getAttribute('aria-controls')).hidden = true;
      }
    };
    for (const b of buttons) {
      b.addEventListener('click', () => {
        const open = b.getAttribute('aria-expanded') !== 'true';
        close(b);
        b.setAttribute('aria-expanded', String(open));
        const panel = $(b.getAttribute('aria-controls'));
        panel.hidden = !open;
        if (open) {
          // 画面の下端までに収める（はみ出す分はメニューの中でスクロール）。選んでいる項目が見えるところまで送る
          panel.style.maxHeight = `${Math.max(160, window.innerHeight - panel.getBoundingClientRect().top - 12)}px`;
          const checked = panel.querySelector('.choices.list.scroll [aria-checked="true"]');
          if (checked) checked.scrollIntoView({ block: 'nearest' });
        }
      });
    }
    // メニューの外をクリックしたら閉じる（メニューの中の操作では閉じない）
    document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.menu')) close(null); });
    // Esc で閉じて、ボタンにフォーカスを戻す（ビューの選択解除より優先）
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const openBtn = buttons.find((b) => b.getAttribute('aria-expanded') === 'true');
      if (!openBtn) return;
      close(null);
      openBtn.focus();
      e.stopPropagation();
      e.preventDefault();
    });
    this.closeMenus = () => close(null);
  }

  // ---------------------------------------------------------------- 階層
  bindTree() {
    const tree = $('tree');
    tree.addEventListener('click', (e) => {
      const rowEl = e.target.closest('.row');
      if (!rowEl) return;
      const row = this.rows[+rowEl.dataset.row];
      if (e.target.closest('.eye')) {
        if (row.mesh >= 0) this.app.setMeshVisible(row.mesh, !this.app.isMeshShown(row.mesh));
        else this.app.toggleNodeVisible(row.node);
        return;
      }
      if (e.target.closest('.twisty')) {
        const open = this.collapsed.has(row.key);   // 閉じていれば開く
        if (e.shiftKey) this.setSubtreeOpen(+rowEl.dataset.row, open);
        else if (open) this.collapsed.delete(row.key);
        else this.collapsed.add(row.key);
        this.applyTreeVisibility();
        return;
      }
      if (row.mesh >= 0) this.app.selectMesh(row.mesh);      // メッシュの行はその行を選択状態にする
      else this.app.select(row.node, { notify: true });
    });
    $('tree-expand-all').addEventListener('click', () => this.setAllOpen(true));
    $('tree-collapse-all').addEventListener('click', () => this.setAllOpen(false));
    $('tree-filter').addEventListener('input', (e) => {
      this.filter = e.target.value.trim().toLowerCase();
      this.applyTreeVisibility();
    });
  }

  populate(data, built) {
    const tree = $('tree');
    tree.textContent = '';
    this.rows = [];
    this.rowOfNode = new Map();
    this.rowOfMesh = new Map();
    this.collapsed = new Set();
    this.selectedRow = null;
    this.textureState = null;
    const meshesOf = new Map();
    data.meshes.forEach((m, mi) => {
      if (!meshesOf.has(m.transform)) meshesOf.set(m.transform, []);
      meshesOf.get(m.transform).push(mi);
    });
    const frag = document.createDocumentFragment();
    const collapseDeep = data.nodes.length > 400;
    const addRow = (row) => {
      const el = document.createElement('div');
      // リファレンスから読み込んだノード（名前空間から判定）は、アイコンに印を付けて名前の色を変える
      const ref = referenceOf(data, row.label);
      el.className = 'row' + (row.dim ? ' dim' : '') + (ref ? ' referenced' : '');
      el.setAttribute('role', 'treeitem');
      el.dataset.row = String(this.rows.length);
      el.style.setProperty('--depth', row.depth);
      const title = row.title + (ref ? `\nリファレンス: ${ref.namespace}（${fileName(ref.resolved || ref.path)}）` : '');
      el.innerHTML = `<button class="twisty${row.hasChildren ? '' : ' leaf'}" tabindex="-1" aria-label="開閉" title="クリック: 開閉　Shift+クリック: 下の階層もまとめて開閉">▾</button>`
        + `<span class="icon">${row.icon}${ref ? '<i class="ref-badge" aria-label="リファレンス"></i>' : ''}</span>`
        + `<span class="name" title="${esc(title)}">${nameHtml(row.label)}</span>`
        + `<button class="eye" tabindex="-1" aria-pressed="true" aria-label="表示" title="表示・非表示（H: 切り替え / Ctrl+H: 隠す / Shift+H: 表示）">${EYE}</button>`;
      row.eye = el.lastChild;
      row.el = el;
      row.twisty = el.firstChild;
      this.rows.push(row);
      frag.appendChild(el);
      return row;
    };
    const visit = (ni, depth) => {
      const n = data.nodes[ni];
      const kids = built.childrenOf[ni];
      const meshKids = meshesOf.get(ni) || [];
      const row = addRow({
        key: 'n' + ni, node: ni, mesh: -1, depth, label: n.name, title: n.path,
        icon: n.type === 'joint' ? ICON.joint : ICON.transform,
        hasChildren: kids.length + meshKids.length > 0, dim: n.visible === false,
      });
      this.rowOfNode.set(ni, row);
      if (collapseDeep && depth >= 2 && row.hasChildren) this.collapsed.add(row.key);
      for (const mi of meshKids) {
        const m = data.meshes[mi];
        this.rowOfMesh.set(mi, addRow({
          key: 'm' + mi, node: ni, mesh: mi, depth: depth + 1, label: m.name, title: m.path,
          icon: m.skin ? ICON.skin : ICON.mesh, hasChildren: false, dim: m.visible === false,
        }));
      }
      for (const k of kids) visit(k, depth + 1);
    };
    data.nodes.forEach((n, i) => { if (n.parent < 0) visit(i, 0); });
    tree.appendChild(frag);
    this.applyTreeVisibility();
  }

  /** rowIndex の行と、その下の階層をすべて開く（open=false なら閉じる） */
  /** 目のアイコンと、親が非表示で隠れている行の表示を更新する（app: isNodeHidden・isMeshShown・hiddenEff） */
  updateVisibilityMarks(app) {
    const meshes = app.built.meshes;
    for (const row of this.rows) {
      let on, dim;
      if (row.mesh >= 0) {
        on = app.isMeshShown(row.mesh);
        dim = !meshes[row.mesh].visible;
      } else {
        on = !app.isNodeHidden(row.node);
        dim = !!app.hiddenEff[row.node];
      }
      row.eye.setAttribute('aria-pressed', String(on));
      row.eye.setAttribute('aria-label', on ? '表示中' : '非表示');
      row.el.classList.toggle('dim', dim);
    }
  }

  setSubtreeOpen(rowIndex, open) {
    const top = this.rows[rowIndex];
    for (let i = rowIndex; i < this.rows.length; i++) {
      const r = this.rows[i];
      if (i > rowIndex && r.depth <= top.depth) break;
      if (!r.hasChildren) continue;
      if (open) this.collapsed.delete(r.key); else this.collapsed.add(r.key);
    }
  }

  /** すべての階層を開く／閉じる */
  setAllOpen(open) {
    this.collapsed.clear();
    if (!open) for (const r of this.rows) if (r.hasChildren) this.collapsed.add(r.key);
    this.applyTreeVisibility();
    if (open && this.selectedRow && !this.selectedRow.el.hidden) this.selectedRow.el.scrollIntoView({ block: 'nearest' });
  }

  applyTreeVisibility() {
    const f = this.filter;
    let hideDepth = Infinity;
    for (const row of this.rows) {
      if (f) {
        row.el.hidden = !row.label.toLowerCase().includes(f);
        continue;
      }
      if (row.depth > hideDepth) { row.el.hidden = true; continue; }
      hideDepth = Infinity;
      row.el.hidden = false;
      const closed = this.collapsed.has(row.key);
      row.twisty.textContent = closed ? '▸' : '▾';
      if (row.hasChildren) row.el.setAttribute('aria-expanded', String(!closed));
      if (closed) hideDepth = row.depth;
    }
  }

  /** 選択中のノードの行を強調する。mesh（メッシュの番号）を渡すと、そのメッシュの行を強調する */
  highlightNode(ni, nodes, mesh = -1) {
    if (this.selectedRow) {
      this.selectedRow.el.classList.remove('selected');
      this.selectedRow.el.removeAttribute('aria-selected');
    }
    this.selectedRow = null;
    const row = (mesh >= 0 && this.rowOfMesh.get(mesh)) || this.rowOfNode.get(ni);
    if (!row) return;
    // 祖先を開く
    let p = nodes[ni].parent;
    let changed = false;
    while (p >= 0) {
      if (this.collapsed.delete('n' + p)) changed = true;
      p = nodes[p].parent;
    }
    if (changed) this.applyTreeVisibility();
    row.el.classList.add('selected');
    row.el.setAttribute('aria-selected', 'true');
    this.selectedRow = row;
    if (!row.el.hidden) row.el.scrollIntoView({ block: 'nearest' });
  }

  /** テクスチャの読み込み状況（選択情報のメッシュの欄に出す）を受け取る */
  setTextureState(state) { this.textureState = state; }

  /** 選択情報のメッシュの欄: 三角形・UV・マテリアルとテクスチャの読み込み状況 */
  meshDetailHtml(mi) {
    const data = this.app.data;
    const e = this.app.built.meshes[mi];
    const m = data.meshes[mi];
    const textureState = this.textureState;
    const mats = data.materials || [];
    const texLabel = (ti) => {
      if (ti < 0) return '<span class="tex">テクスチャなし</span>';
      const info = (data.textures || [])[ti] || {};
      const st = (textureState && textureState[ti]) || { status: info.resolved && info.format ? 'loading' : 'missing' };
      const name = esc(fileName(info.path) || info.node || '?');
      const where = esc(info.resolved || info.path || '');
      if (st.status === 'ok') {
        const size = (st.tiles > 1 ? `UDIM ${st.tiles} タイル・` : '')
          + (st.sourceWidth !== st.width ? `${st.sourceWidth}→${st.width}px` : `${st.width}px`);
        return `<span class="tex-ok" aria-label="読み込み済み">✓</span><span class="tex" title="${where}">${name}（${size}${st.hasAlpha ? '・アルファあり' : ''}）</span>`;
      }
      if (st.status === 'loading') return `<span class="tex-wait">…</span><span class="tex" title="${where}">${name}（読み込み中）</span>`;
      if (st.status === 'pending') return `<span class="tex-wait">–</span><span class="tex" title="${where}">${name}（未読み込み）</span>`;
      const why = st.status === 'error' ? '読み込めません' : (info.resolved ? '形式に未対応' : '見つかりません');
      return `<span class="tex-bad" aria-label="${why}">✕</span><span class="tex" title="${where}">${name}（${why}）</span>`;
    };
    let h = '<table class="kv">';
    h += `<tr><th>三角形</th><td>${num(e.triCount)}</td></tr>`;
    if (m.visible === false) h += '<tr><th>Maya での表示</th><td>非表示</td></tr>';
    // UV の状態（テクスチャが貼られない原因を調べるため）
    if (m.uv) {
      let noUv = 0, off = 0;
      for (const c of m.counts) { for (let k = 0; k < c; k++) if (m.uv.indices[off + k] < 0) { noUv++; break; } off += c; }
      h += `<tr><th>UV</th><td>${esc(m.uv.set)}${noUv ? `（<span class="tex-bad">UV のない面 ${num(noUv)}</span>）` : ''}</td></tr>`;
    } else {
      h += '<tr><th>UV</th><td>なし</td></tr>';
    }
    h += '</table>';
    const perFace = m.faceMaterials || m.counts.map(() => m.material ?? -1);
    const faceCount = new Map();
    for (const x of perFace) faceCount.set(x, (faceCount.get(x) || 0) + 1);
    const multi = faceCount.size > 1;
    h += '<ul class="mats">';
    for (const [mi2, cnt] of faceCount) {
      const md = mats[mi2];
      const faces = multi ? `<span class="faces">${num(cnt)} 面</span>` : '';
      h += md
        ? `<li><span title="${esc(md.type)}">${esc(md.name)}</span>${faces}${texLabel(md.texture)}</li>`
        : `<li><span>既定のマテリアル</span>${faces}</li>`;
      // ベースカラー以外のマップ（法線・ラフネスなど）の状態
      const other = md && md.maps ? Object.entries(md.maps).filter(([k]) => k !== 'baseColor') : [];
      if (other.length) {
        const LABEL = { normal: '法線', roughness: 'ラフネス', metalness: 'メタリック', ao: 'AO', emissive: 'エミッシブ', opacity: '不透明度' };
        const MARK = { ok: '<span class="tex-ok">✓</span>', loading: '<span class="tex-wait">…</span>',
          pending: '<span class="tex-wait">–</span>', missing: '<span class="tex-bad">✕</span>', error: '<span class="tex-bad">✕</span>' };
        const items = other.map(([k, mp]) => {
          const st2 = (textureState && textureState[mp.texture]) || { status: 'pending' };
          const ch = mp.channel && mp.channel !== 'rgb' ? `（${mp.channel.toUpperCase()}）` : '';
          return `${LABEL[k] || k}${ch} ${MARK[st2.status] || ''}`;
        });
        h += `<li class="sub-maps">${items.join('　')}</li>`;
      }
    }
    return h + '</ul>';
  }

  // ---------------------------------------------------------------- 選択情報
  showNodeInfo(info) {
    const head = $('select-head');
    const body = $('select-info');
    if (!info) {
      head.innerHTML = '<p class="muted">ジョイント・メッシュ・カメラをクリックすると、ここに情報を表示します。</p>';
      body.innerHTML = '';
      return;
    }
    const n = info.node;
    const a = n.attrs || {};
    const typeLabel = info.cameras && info.cameras.length ? 'カメラ'
      : ({ joint: 'ジョイント', transform: 'トランスフォーム' }[n.type] || n.type);
    head.innerHTML = `<p class="info-title">${esc(n.name)}<span class="info-type">${esc(typeLabel)}</span>`
      + `${info.posed ? '<span class="posed-badge">ポーズ変更中</span>' : ''}</p>`
      + `<p class="info-path">${esc(n.path)}</p>`;

    const SRC = { pm: 'skinCluster の .pm', dagPose: 'dagPose', bps: 'ジョイントの .bps' };
    let h = '<table class="kv">';
    h += `<tr><th>表示</th><td>${info.hiddenByRig ? '非表示（リグ・アニメーションで決まる値）' : info.hiddenSelf ? '非表示'
      : info.hiddenByParent ? '親が非表示のため隠れています' : '表示中'}</td></tr>`;
    if (info.reference) {
      h += `<tr><th>リファレンス</th><td>${esc(info.reference.namespace)}（${esc(fileName(info.reference.resolved || info.reference.path))}）</td></tr>`;
    }
    if (info.unselectable) h += `<tr><th>Maya での選択</th><td>ビューポートでは選択できない（${esc(info.unselectable)}）</td></tr>`;
    // 姿勢の基準は、バインドポーズの情報があるノードとジョイントだけ（ほかは常にファイルの値）
    if (info.bindSource || n.type === 'joint') {
      h += `<tr><th>姿勢の基準</th><td>${info.usingBind ? 'バインドポーズ' : 'ファイルの値'}</td></tr>`;
      h += `<tr><th>バインドポーズの情報</th><td>${info.bindSource ? esc(SRC[info.bindSource] || info.bindSource) : 'なし'}</td></tr>`;
    }
    h += '</table>';
    const anim = info.animChannels || [];
    const rig = info.rigDrivers || [];
    if (anim.length || rig.length) {
      h += '<table class="kv">';
      if (anim.length) h += `<tr><th>アニメーション</th><td>${esc(anim.join('・'))}</td></tr>`;
      if (rig.length) h += `<tr><th>リグ</th><td>${rig.slice(0, 6).map(esc).join('<br>')}${rig.length > 6 ? '<br>ほか' : ''}</td></tr>`;
      h += '</table>';
    }
    // カメラはレンズの情報を先に出す（カメラを選んだときに知りたいもの）
    for (const c of info.cameras || []) h += this.cameraHtml(c);
    // アニメーションを読み込んだあとは、カーブ・リグで評価する値は注記から外す
    // （リグで求められたノード（推定・不明でない）は、接続で決まる値もすべて評価している）
    const evaluated = /（animCurveT[LAU]）$/;
    const solved = info.animLoaded && !info.rigStatus;
    const driven = (info.drivenBy || []).filter((d) => !(solved && (rig.length || evaluated.test(d))));
    if (driven.length) {
      h += '<p class="note small">次の値は接続で決まるため、ファイルに残っていません'
        + (info.bindSource ? '（「ファイルの値」でもバインドポーズの姿勢で表示）' : '（既定値で表示）') + '：<br>'
        + driven.slice(0, 6).map(esc).join('<br>') + (driven.length > 6 ? '<br>ほか' : '') + '</p>';
    }
    h += '<p class="sub">ファイル上の値</p><table class="kv">';
    if (a.t) h += `<tr><th>移動</th><td>${fmt3(a.t)}</td></tr>`;
    if (a.r) h += `<tr><th>回転</th><td>${fmt3(a.r, 2)}</td></tr>`;
    if (a.jo) h += `<tr><th>ジョイントの向き</th><td>${fmt3(a.jo, 2)}</td></tr>`;
    if (a.s) h += `<tr><th>スケール</th><td>${fmt3(a.s)}</td></tr>`;
    if (a.ro) h += `<tr><th>回転順</th><td>${esc(a.ro)}</td></tr>`;
    h += '</table>';
    if (info.animValues) {
      const v = info.animValues;
      h += `<p class="sub">フレーム ${esc(fmt(info.frame, Number.isInteger(info.frame) ? 0 : 2))} の値</p><table class="kv">`
        + `<tr><th>移動</th><td>${fmt3(v.t)}</td></tr><tr><th>回転</th><td>${fmt3(v.r, 2)}</td></tr>`
        + `<tr><th>スケール</th><td>${fmt3(v.s)}</td></tr></table>`;
    }
    h += `<table class="kv" style="margin-top:6px"><tr><th>ワールド位置</th><td>${fmt3(info.worldPos)}</td></tr></table>`;
    if (info.usage && info.usage.length) {
      h += '<p class="sub">インフルエンスとして</p><table class="kv">';
      for (const u of info.usage) {
        h += `<tr><th>${esc(u.meshName)}</th><td>${num(u.count)} / ${num(u.total)} 頂点</td></tr>`;
      }
      h += '</table>';
    } else if (n.type === 'joint') {
      h += '<p class="muted small">どのメッシュのインフルエンスにもなっていません。</p>';
    }
    if (info.meshes && info.meshes.length) {
      for (const m of info.meshes) {
        h += `<p class="sub${m.selected ? ' selected-mesh' : ''}">メッシュ ${esc(m.name)}</p><table class="kv">`;
        h += `<tr><th>頂点 / 面</th><td>${num(m.vertices)} / ${num(m.faces)}</td></tr>`;
        if (m.skin) {
          const sk = m.skin;
          h += `<tr><th>skinCluster</th><td>${esc(m.cluster)}</td></tr>`;
          h += `<tr><th>インフルエンス</th><td>${sk.influenceCount}（最大 ${sk.maxCount}/頂点）</td></tr>`;
          h += `<tr><th>5〜8 つの頂点</th><td>${num(sk.over4 - sk.overMax)}</td></tr>`;
          h += `<tr><th>9 つ以上の頂点</th><td>${num(sk.overMax)}</td></tr>`;
          h += `<tr><th>合計が 1 でない頂点</th><td>${num(sk.unnormalized)}</td></tr>`;
              const ns = { 0: 'なし', 1: 'インタラクティブ', 2: 'ポスト' }[m.normalizeSetting] || '?';   // ビューアは常に正規化
          h += `<tr><th>Maya の正規化の設定</th><td>${ns}</td></tr>`;
          h += `<tr><th>合計が 0 の頂点</th><td>${num(sk.zero)}（割り当て済み）</td></tr>`;
        }
        h += '</table>';
        if (m.skin && m.skin.overMax) h += '<p class="note small">9 つ以上のインフルエンスを持つ頂点は、上位 8 つで変形表示しています（ヒートマップと数値は全インフルエンス）。</p>';
        h += this.meshDetailHtml(m.index);
      }
    }
    body.innerHTML = h;
    body.querySelectorAll('[data-view-camera]').forEach((el) => {
      el.addEventListener('click', () => this.app.setCamera(+el.dataset.viewCamera));
    });
  }

  /**
   * 選択情報のカメラの欄（レンズ・フィルムバック・投影・クリップ面・レンダーの解像度）。
   * c: { index, cam（共通 JSON の cameras の 1 件）, p（いまのフレームの値。cameraParams）, animated（キー・リグで決まる属性）, viewing }
   */
  cameraHtml(c) {
    const { cam, p } = c;
    const MM = 25.4;
    const anim = (k) => (c.animated.includes(k) ? '<span class="sub-note">キー・リグ</span>' : '');
    const FIT = ['フィル', '水平', '垂直', 'オーバースキャン'];
    // 画角: フィルムの幅（インチ）と焦点距離（mm）から。カメラスケールの分だけ広がる
    const fov = (film) => 2 * Math.atan((film * MM * p.cs) / (2 * p.fl)) * 180 / Math.PI;
    let h = `<p class="sub">カメラ ${esc(cam.shape || cam.name)}</p>`;
    h += c.viewing ? '<p class="muted small">このカメラから見ています（Shift+C で自由視点）</p>'
      : `<div class="pose-btns"><button class="btn" data-view-camera="${c.index}">このカメラから見る</button></div>`;
    h += '<table class="kv">';
    if (p.ortho) {
      h += `<tr><th>投影</th><td>平行投影</td></tr><tr><th>幅</th><td>${fmt(p.ow, 3)}${anim('ow')}</td></tr>`;
    } else {
      h += `<tr><th>焦点距離</th><td>${fmt(p.fl, 2)} mm${anim('fl')}</td></tr>`;
      h += `<tr><th>画角（水平 / 垂直）</th><td>${fmt(fov(p.hfa * p.lsr), 2)}° / ${fmt(fov(p.vfa), 2)}°</td></tr>`;
    }
    h += `<tr><th>フィルムバック</th><td title="${fmt(p.hfa, 4)} × ${fmt(p.vfa, 4)} インチ">`
      + `${fmt(p.hfa * MM, 2)} × ${fmt(p.vfa * MM, 2)} mm${anim('hfa') || anim('vfa')}</td></tr>`;
    h += `<tr><th>フィルムフィット</th><td>${FIT[p.fit] || p.fit}</td></tr>`;
    if (Math.abs(p.lsr - 1) > 1e-6) h += `<tr><th>レンズスクイーズ</th><td>${fmt(p.lsr, 3)}</td></tr>`;
    if (p.hfo || p.vfo) h += `<tr><th>フィルムオフセット</th><td>${fmt(p.hfo, 3)}, ${fmt(p.vfo, 3)} in${anim('hfo') || anim('vfo')}</td></tr>`;
    if (Math.abs(p.cs - 1) > 1e-6) h += `<tr><th>カメラスケール</th><td>${fmt(p.cs, 3)}</td></tr>`;
    h += `<tr><th>クリップ面</th><td>${fmt(p.near, 3)} 〜 ${fmt(p.far, 1)}${anim('ncp') || anim('fcp')}</td></tr>`;
    const r = c.render || {};
    if (r.width && r.height) h += `<tr><th>レンダーの解像度</th><td>${num(r.width)} × ${num(r.height)}</td></tr>`;
    if (cam.renderable === false) h += '<tr><th>レンダー</th><td>対象外（renderable がオフ）</td></tr>';
    return h + '</table>';
  }

  // ---------------------------------------------------------------- 頂点
  /** @param mode 選択の対象（'object' のときは、頂点の選び方を案内する） */
  showVertexInfo(info, mode = this.app.settings.pickMode) {
    const body = $('vertex-body');
    // 頂点の欄は、頂点を選んでいるときと、頂点の選択に切り替えたとき（案内）だけ出す
    $('sec-vertex').hidden = !info && mode !== 'vertex';
    if (!info) {
      body.innerHTML = '<p class="muted">メッシュをクリックすると、いちばん近い頂点のウェイトを表示します。</p>';
      return;
    }
    let h = `<p class="info-title">${esc(info.meshName)}.vtx[${info.vertex}]</p>`;
    h += `<table class="kv"><tr><th>ワールド位置</th><td>${fmt3(info.worldPos)}</td></tr></table>`;
    if (!info.skinned) {
      h += '<p class="muted">このメッシュにはスキンがありません。</p>';
      body.innerHTML = h;
      return;
    }
    if (!info.weights.length) {
      h += '<p class="note err">この頂点にはウェイトがありません（ジョイントもありません）。</p>';
      body.innerHTML = h;
      return;
    }
    h += '<ul class="wlist">';
    info.weights.forEach((w, i) => {
      const dropped = i >= 8;
      const scaled = info.assigned || (info.normalized && Math.abs(info.sum - 1) > 1e-3);
      const val = scaled ? `${fmt(w.weight, 4)} → ${fmt(w.effective, 4)}` : fmt(w.weight, 4);
      h += `<li class="${dropped ? 'dropped' : ''}"><span class="jn" data-node="${w.nodeIndex}" title="${esc(w.path)}">${esc(w.name)}</span>`
        + `<span class="wv">${val}</span><span class="bar"><i style="width:${Math.min(100, w.effective * 100).toFixed(1)}%"></i></span></li>`;
    });
    h += '</ul>';
    h += `<table class="kv" style="margin-top:6px"><tr><th>合計</th><td>${fmt(info.sum, 4)}</td></tr>`
      + `<tr><th>インフルエンス数</th><td>${info.weights.length}</td></tr></table>`;
    if (info.weights.length > 8) h += '<p class="note small">9 つ目以降（薄い表示）は変形表示に使われていません。</p>';
    if (info.assigned) {
      h += `<p class="note small">ウェイトの合計が 0 のため、「ウェイトの分配」（${info.distribution}）に合わせて割り当てた値（→ の右）で変形しています。</p>`;
    } else if (Math.abs(info.sum - 1) > 1e-3) {
      h += '<p class="note small">ウェイトの合計が 1 ではありません。変形には合計で割った値（→ の右）を使っています。</p>';
    }
    body.innerHTML = h;
    body.querySelectorAll('.jn').forEach((el) => {
      el.addEventListener('click', () => this.app.select(+el.dataset.node, { notify: true }));
    });
  }

  // ---------------------------------------------------------------- ポーズ
  bindPose() {
    const AX = ['x', 'y', 'z'];
    const num = (id, d) => { const v = parseFloat($(id).value); return Number.isFinite(v) ? v : d; };
    const read = () => ({
      t: AX.map((a) => num('pose-t' + a, 0)),
      r: AX.map((a) => num('pose-r' + a, 0)),
      s: AX.map((a) => num('pose-s' + a, 1)),
    });
    const onInput = () => {
      // 確定（Enter・フォーカス移動）までを 1 つの操作として記録する
      this.app.beginPoseEdit([this.app.selected], '数値入力');
      this.app.setPoseForSelected(read());
    };
    for (const k of ['t', 'r', 's']) {
      for (const a of AX) {
        const el = $('pose-' + k + a);
        el.addEventListener('input', onInput);
        el.addEventListener('change', () => this.app.endPoseEdit());
        el.addEventListener('blur', () => this.app.endPoseEdit());
        // Enter で確定（次の欄へは Tab）
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.blur(); });
      }
    }
    $('pose-reset').addEventListener('click', () => this.app.resetPose(this.app.selected));
    $('pose-reset-all').addEventListener('click', () => this.app.resetAllPoses());
  }

  /** @param pose {t, r, s}（省略時は変更なしの姿勢） */
  showPoseFor(nodeIndex, pose) {
    const on = nodeIndex >= 0;
    $('pose-ctrls').hidden = !on;
    if (!on) return;
    const p = pose || { t: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] };
    const active = document.activeElement;
    const put = (id, v) => { const el = $(id); if (el !== active) el.value = String(+v.toFixed(4)); };
    ['x', 'y', 'z'].forEach((a, i) => {
      put('pose-t' + a, p.t[i]);
      put('pose-r' + a, p.r[i]);
      put('pose-s' + a, p.s[i]);
    });
  }

  // ---------------------------------------------------------------- 警告・凡例・状態
  /** 警告を追加する（テクスチャの読み込み失敗など、あとから分かったもの） */
  addWarnings(list) {
    this.warnings = (this.warnings || []).concat(list);
    this.setWarnings(this.warnings);
  }

  /** 警告を更新する。ツールバーには件数付きのアイコンだけを出し（警告があるときだけ）、一覧は別ウィンドウで見る */
  setWarnings(list) {
    this.warnings = list.slice();
    const btn = $('btn-warnings');
    btn.hidden = !list.length;
    $('warn-count').textContent = String(list.length);
    btn.title = `警告 ${list.length} 件を表示`;
    btn.setAttribute('aria-label', btn.title);
    $('warn-body').innerHTML = list.length
      ? '<ul>' + list.map((w) => `<li>${esc(w)}</li>`).join('') + '</ul>'
      : '<p class="muted">警告はありません。</p>';
    this.app.onWarningsChanged(this.warnings);
  }

  /** ブラウザで開いているとき（Qt のウィンドウがない）の警告の一覧 */
  openWarningDialog() {
    const d = $('warn-dialog');
    if (!d.open) d.showModal();
  }

  setHistoryState(h) {
    const u = $('btn-undo'), r = $('btn-redo');
    u.disabled = !h.canUndo;
    r.disabled = !h.canRedo;
    u.title = (h.canUndo ? `元に戻す: ${h.undoLabel}` : '元に戻す') + '（Ctrl+Z / Z）';
    r.title = (h.canRedo ? `やり直す: ${h.redoLabel}` : 'やり直す') + '（Ctrl+Y / Shift+Z）';
  }

  setLegend(mode, jointName) {
    const el = $('legend');
    if (mode === 'off') { el.hidden = true; return; }
    el.hidden = false;
    if (mode === 'selected') {
      el.innerHTML = jointName
        ? `<div class="lg-title">ウェイト: ${esc(jointName)}</div><div class="lg-bar"></div><div class="lg-scale"><span>0</span><span>0.5</span><span>1</span></div>`
        : '<div class="lg-title">ジョイントを選ぶとウェイトを表示します</div>';
    } else {
      el.innerHTML = '<div class="lg-title">インフルエンスごとに色分け</div><div class="muted small">境界の混色がウェイトの混ざり具合です。</div>';
    }
  }

  setTitle(text) { $('vp-title').textContent = text || ''; }
  /** ヘッドアップディスプレイ（text が null なら隠す。cls: '' / 'slow'（処理落ち）/ 'idle'（停止中）） */
  setHud(text, cls) {
    const el = $('vp-hud');
    el.hidden = text === null;
    if (text === null) return;
    el.textContent = text;
    el.className = cls || '';
  }
  setFile(text) { $('status-file').textContent = text; }
  setStats(text) { $('status-stats').textContent = text; }
  setMessage(text, ms = 4000) {
    $('status-msg').textContent = text || '';
    clearTimeout(this.msgTimer);
    if (text && ms) this.msgTimer = setTimeout(() => { $('status-msg').textContent = ''; }, ms);
  }
  setEmpty(on) { $('empty').hidden = !on; }
  /**
   * 読み込み中の表示。frac（0〜1）があれば全体の進捗のバーに反映する（再描画は呼ばれたときだけ）。
   * subText・subFrac は、いま読んでいるファイルの進み具合（リファレンスがあるときの 2 段目。なければ隠す）
   */
  showLoading(text, frac, subText, subFrac) {
    $('loading').hidden = false;
    $('loading-text').textContent = text || '読み込み中';
    setBar($('loading-bar'), frac);
    $('loading-sub').hidden = !subText;
    if (subText) {
      $('loading-sub-text').textContent = subText;
      setBar($('loading-sub-bar'), subFrac);
    }
  }
  hideLoading() { $('loading').hidden = true; }
  showError(text) { const e = $('error'); e.hidden = false; e.textContent = text; }
  hideError() { $('error').hidden = true; }
}
