// 画面のパネル類（DOM）。描画やシーン操作は app（main.js）に任せる。

const $ = (id) => document.getElementById(id);

const ICON = {
  joint: '<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',
  transform: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',
  mesh: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  skin: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>',
};

const EYE = '<svg class="on" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.8" fill="currentColor"/></svg><svg class="off" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M2 12 12 2" stroke="currentColor" stroke-width="1.4"/></svg>';
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
    this.bindToolbar();
    this.bindTabs();
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
    $('opt-shading').addEventListener('change', (e) => s('shading', e.target.value));
    $('opt-axes').addEventListener('change', (e) => s('axes', e.target.value));
    $('opt-weights').addEventListener('change', (e) => s('weightMode', e.target.value));
    $('opt-alpha').addEventListener('change', (e) => s('alpha', e.target.value));
    $('opt-pose-source').addEventListener('change', (e) => s('poseSource', e.target.value));
    $('opt-lighting').addEventListener('change', (e) => s('lighting', e.target.value));
    $('opt-map-view').addEventListener('change', (e) => s('mapView', e.target.value));
    $('opt-normal-flip').addEventListener('change', (e) => s('normalFlipY', e.target.checked));
    document.querySelectorAll('#map-toggles [data-map]').forEach((el) => {
      el.addEventListener('change', () => this.app.setMapToggle(el.dataset.map, el.checked));
    });
    $('opt-alpha-style').addEventListener('change', (e) => s('alphaStyle', e.target.value));
    $('opt-jsize').addEventListener('input', (e) => s('jointSize', parseFloat(e.target.value)));
    const toggles = { 'opt-wire': 'wire', 'opt-skin': 'skin', 'opt-joints': 'joints', 'opt-xray': 'xray', 'opt-tex': 'textures', 'opt-grid': 'grid' };
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
    $('opt-shading').value = st.shading;
    $('opt-axes').value = st.axes;
    $('opt-weights').value = st.weightMode;
    $('opt-jsize').value = st.jointSize;
    $('opt-wire').setAttribute('aria-pressed', String(st.wire));
    $('opt-skin').setAttribute('aria-pressed', String(st.skin));
    $('opt-joints').setAttribute('aria-pressed', String(st.joints));
    $('opt-xray').setAttribute('aria-pressed', String(st.xray));
    $('opt-grid').setAttribute('aria-pressed', String(!!st.grid));
    $('opt-tex').setAttribute('aria-pressed', String(st.textures));
    $('opt-alpha').value = st.alpha;
    $('opt-pose-source').value = st.poseSource;
    $('opt-lighting').value = st.lighting;
    $('opt-map-view').value = st.mapView;
    $('opt-normal-flip').checked = !!st.normalFlipY;
    $('map-toggles').disabled = st.mapView !== 'combined';
    document.querySelectorAll('#map-toggles [data-map]').forEach((el) => { el.checked = !!st.maps[el.dataset.map]; });
    $('opt-alpha-style').value = st.alphaStyle;
    $('opt-space').setAttribute('aria-pressed', String(st.space === 'world'));
    // メニュー名の横に、既定と違う設定を表示する
    const VIEW = { baseColor: 'ベースカラー', normal: '法線', roughness: 'ラフネス', metalness: 'メタリック', ao: 'AO', emissive: 'エミッシブ', opacity: '不透明度' };
    const viewState = [st.lighting === 'flat' ? 'フラットライト' : '', st.shading === 'none' ? 'ワイヤーのみ' : st.shading === 'flat' ? 'フラット' : '',
      st.poseSource === 'file' ? 'ファイルの値' : ''].filter(Boolean).join('・');
    $('menu-view-state').textContent = viewState;
    $('menu-maps-state').textContent = st.mapView !== 'combined' ? VIEW[st.mapView] || '' : '';
    $('menu-weights-state').textContent = { selected: 'ヒートマップ', all: '色分け' }[st.weightMode] || '';
    document.querySelectorAll('#opt-tool [data-tool]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tool === st.tool));
    });
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
        $(b.getAttribute('aria-controls')).hidden = !open;
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

  bindTabs() {
    const tabs = [['tab-tree', 'pane-tree'], ['tab-meshes', 'pane-meshes']];
    for (const [tid, pid] of tabs) {
      $(tid).addEventListener('click', () => {
        for (const [t2, p2] of tabs) {
          $(t2).setAttribute('aria-selected', String(t2 === tid));
          $(p2).hidden = t2 !== tid;
        }
      });
    }
  }

  // ---------------------------------------------------------------- 階層
  bindTree() {
    const tree = $('tree');
    tree.addEventListener('click', (e) => {
      const rowEl = e.target.closest('.row');
      if (!rowEl) return;
      const row = this.rows[+rowEl.dataset.row];
      if (e.target.closest('.eye')) {
        if (row.mesh >= 0) this.app.setMeshVisible(row.mesh, !this.app.built.meshes[row.mesh].selfVisible);
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
      if (row.mesh >= 0) this.app.selectMesh(row.mesh);
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
    this.collapsed = new Set();
    this.selectedRow = null;
    const meshesOf = new Map();
    data.meshes.forEach((m, mi) => {
      if (!meshesOf.has(m.transform)) meshesOf.set(m.transform, []);
      meshesOf.get(m.transform).push(mi);
    });
    const frag = document.createDocumentFragment();
    const collapseDeep = data.nodes.length > 400;
    const addRow = (row) => {
      const el = document.createElement('div');
      el.className = 'row' + (row.dim ? ' dim' : '');
      el.setAttribute('role', 'treeitem');
      el.dataset.row = String(this.rows.length);
      el.style.setProperty('--depth', row.depth);
      el.innerHTML = `<button class="twisty${row.hasChildren ? '' : ' leaf'}" tabindex="-1" aria-label="開閉" title="クリック: 開閉　Shift+クリック: 下の階層もまとめて開閉">▾</button>`
        + `<span class="icon">${row.icon}</span><span class="name" title="${esc(row.title)}">${esc(row.label)}</span>`
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
        addRow({
          key: 'm' + mi, node: ni, mesh: mi, depth: depth + 1, label: m.name, title: m.path,
          icon: m.skin ? ICON.skin : ICON.mesh, hasChildren: false, dim: m.visible === false,
        });
      }
      for (const k of kids) visit(k, depth + 1);
    };
    data.nodes.forEach((n, i) => { if (n.parent < 0) visit(i, 0); });
    tree.appendChild(frag);
    this.applyTreeVisibility();
    this.populateMeshes(data, built);
  }

  /** rowIndex の行と、その下の階層をすべて開く（open=false なら閉じる） */
  /** 目のアイコンと、親が非表示で隠れている行の表示を更新する */
  updateVisibilityMarks(hidden, hiddenEff, meshes) {
    for (const row of this.rows) {
      let on, dim;
      if (row.mesh >= 0) {
        const e = meshes[row.mesh];
        on = e.selfVisible;
        dim = !e.visible;
      } else {
        on = !hidden.has(row.node);
        dim = !!hiddenEff[row.node];
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

  highlightNode(ni, nodes) {
    if (this.selectedRow) this.selectedRow.el.classList.remove('selected');
    this.selectedRow = null;
    const row = this.rowOfNode.get(ni);
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

  populateMeshes(data, built, textureState) {
    const list = $('mesh-list');
    list.textContent = '';
    const mats = data.materials || [];
    const texLabel = (ti) => {
      if (ti < 0) return '<span class="tex">テクスチャなし</span>';
      const info = (data.textures || [])[ti] || {};
      const st = (textureState && textureState[ti]) || { status: info.resolved && info.format ? 'loading' : 'missing' };
      const name = esc(String(info.path || '').split(/[\\/]/).pop() || info.node || '?');
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
    built.meshes.forEach((e, mi) => {
      const m = data.meshes[mi];
      const item = document.createElement('div');
      item.className = 'mesh-item';
      const id = 'mesh-vis-' + mi;
      let meta = `頂点 ${num(e.vertexCount)} ・ 面 ${num(m.counts.length)} ・ 三角形 ${num(e.triCount)}`;
      if (e.skin) {
        meta += `<br>スキン ${esc(m.skin.cluster)}（インフルエンス ${e.skin.stats.influenceCount}・最大 ${e.skin.stats.maxCount}/頂点）`;
      }
      if (m.visible === false) meta += '<br>Maya では非表示';
      // UV の状態（テクスチャが貼られない原因を調べるため）
      if (m.uv) {
        let noUv = 0, off = 0;
        for (const c of m.counts) { for (let k = 0; k < c; k++) if (m.uv.indices[off + k] < 0) { noUv++; break; } off += c; }
        meta += `<br>UV ${esc(m.uv.set)}` + (noUv ? `（<span class="tex-bad">UV のない面 ${num(noUv)}</span>）` : '');
      } else {
        meta += '<br>UV なし';
      }
      const perFace = m.faceMaterials || m.counts.map(() => m.material ?? -1);
      const faceCount = new Map();
      for (const x of perFace) faceCount.set(x, (faceCount.get(x) || 0) + 1);
      const multi = faceCount.size > 1;
      let matHtml = '<ul class="mats">';
      for (const [mi2, cnt] of faceCount) {
        const md = mats[mi2];
        const faces = multi ? `<span class="faces">${num(cnt)} 面</span>` : '';
        matHtml += md
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
          matHtml += `<li class="sub-maps">${items.join('　')}</li>`;
        }
      }
      matHtml += '</ul>';
      item.innerHTML = `<input type="checkbox" id="${id}" ${e.visible ? 'checked' : ''} aria-label="${esc(m.name)} を表示">`
        + `<label class="name" for="${id}">${esc(m.name)}</label><div class="meta">${meta}</div>${matHtml}`;
      item.querySelector('input').addEventListener('change', (ev) => this.app.setMeshVisible(mi, ev.target.checked));
      item.querySelector('.name').addEventListener('click', (ev) => { ev.preventDefault(); this.app.selectMesh(mi); });
      list.appendChild(item);
    });
  }

  setMeshChecked(mi, v) {
    const el = $('mesh-vis-' + mi);
    if (el) el.checked = v;
  }

  // ---------------------------------------------------------------- 選択情報
  showNodeInfo(info) {
    const head = $('select-head');
    const body = $('select-info');
    if (!info) {
      head.innerHTML = '<p class="muted">ジョイントやメッシュをクリックすると、ここに情報を表示します。</p>';
      body.innerHTML = '';
      return;
    }
    const n = info.node;
    const a = n.attrs || {};
    const typeLabel = { joint: 'ジョイント', transform: 'トランスフォーム' }[n.type] || n.type;
    head.innerHTML = `<p class="info-title">${esc(n.name)}<span class="info-type">${esc(typeLabel)}</span>`
      + `${info.posed ? '<span class="posed-badge">ポーズ変更中</span>' : ''}</p>`
      + `<p class="info-path">${esc(n.path)}</p>`;

    const SRC = { pm: 'skinCluster の .pm', dagPose: 'dagPose', bps: 'ジョイントの .bps' };
    let h = '<table class="kv">';
    h += `<tr><th>表示</th><td>${info.hiddenSelf ? '非表示' : info.hiddenByParent ? '親が非表示のため隠れています' : '表示中'}</td></tr>`;
    h += `<tr><th>姿勢の基準</th><td>${info.usingBind ? 'バインドポーズ' : 'ファイルの値'}</td></tr>`;
    h += `<tr><th>バインドポーズの情報</th><td>${info.bindSource ? esc(SRC[info.bindSource] || info.bindSource) : 'なし'}</td></tr>`;
    h += '</table>';
    const anim = info.animChannels || [];
    const rig = info.rigDrivers || [];
    if (anim.length || rig.length) {
      h += '<table class="kv">';
      if (anim.length) h += `<tr><th>アニメーション</th><td>${esc(anim.join('・'))}</td></tr>`;
      if (rig.length) h += `<tr><th>リグ</th><td>${rig.slice(0, 6).map(esc).join('<br>')}${rig.length > 6 ? '<br>ほか' : ''}</td></tr>`;
      h += '</table>';
    }
    // アニメーションを読み込んだあとは、カーブ・リグで評価する値は注記から外す
    const evaluated = /（(animCurveT[LAU]|pointConstraint|orientConstraint|parentConstraint|scaleConstraint|poleVectorConstraint|unitConversion|pairBlend|blendColors|multiplyDivide|plusMinusAverage|reverse|condition)）$/;
    const driven = (info.drivenBy || []).filter((d) => !(info.animLoaded && evaluated.test(d)));
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
        h += `<p class="sub">メッシュ ${esc(m.name)}</p><table class="kv">`;
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
      }
    }
    body.innerHTML = h;
  }

  // ---------------------------------------------------------------- 頂点
  showVertexInfo(info) {
    const body = $('vertex-body');
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
  setFile(text) { $('status-file').textContent = text; }
  setStats(text) { $('status-stats').textContent = text; }
  setMessage(text, ms = 4000) {
    $('status-msg').textContent = text || '';
    clearTimeout(this.msgTimer);
    if (text && ms) this.msgTimer = setTimeout(() => { $('status-msg').textContent = ''; }, ms);
  }
  setEmpty(on) { $('empty').hidden = !on; }
  /** 読み込み中の表示。frac（0〜1）があれば進捗のバーに反映する（再描画は呼ばれたときだけ） */
  showLoading(text, frac) {
    $('loading').hidden = false;
    $('loading-text').textContent = text || '読み込み中';
    const known = typeof frac === 'number' && frac >= 0;
    $('loading-bar').parentElement.classList.toggle('indeterminate', !known);
    $('loading-bar').style.width = known ? `${Math.round(Math.min(1, frac) * 100)}%` : '';
  }
  hideLoading() { $('loading').hidden = true; }
  showError(text) { const e = $('error'); e.hidden = false; e.textContent = text; }
  hideError() { $('error').hidden = true; }
}
