// 画面のパネル類（DOM）。描画やシーン操作は app（main.js）に任せる。

import { CONTROL_ROLES, ROLE_LABELS } from './controlRoles.js';
import { groupWarnings } from './warnGroups.js';
import { ROLE_COLORS } from './controlOverlay.js';

const $ = (id) => document.getElementById(id);
// コントローラーの種別のアイコン（ビューポートの目印と同じ形）
const ROLE_ICON = {
  ik: 'M3 5.5 8 3l5 2.5v5.5L8 13.5 3 11ZM3 5.5 8 8l5-2.5M8 8v5.5',
  pole: 'M2.5 10.5 8 2.5l5.5 8L8 13.5ZM8 2.5v11M2.5 10.5l11 0',
  spline: 'M8 2.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 1 0 0-11ZM2.5 8c0 1.2 2.5 2 5.5 2s5.5-.8 5.5-2-2.5-2-5.5-2-5.5.8-5.5 2ZM8 2.5c-1.2 0-2 2.5-2 5.5s.8 5.5 2 5.5',
  constraint: 'M8 1.5v13M1.5 8h13M8 1.5 6.3 3.2M8 1.5l1.7 1.7M8 14.5l-1.7-1.7M8 14.5l1.7-1.7M1.5 8l1.7-1.7M1.5 8l1.7 1.7M14.5 8l-1.7-1.7M14.5 8l-1.7 1.7',
  aim: 'M8 2.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 1 0 0-11ZM8 6a2 2 0 1 0 0 4a2 2 0 1 0 0-4ZM8 1v4M8 11v4M1 8h4M11 8h4',
  switch: 'M4 14.5V1.5h8.5v6H4M4 1.5l8.5 6M12.5 1.5 4 7.5',
  driven: 'M8 2 14 13H2ZM8 2l1 7 5 4M9 9l-7 4',
  locator: 'M8 1.5v13M1.5 8h13M3.5 12.5l9-9',
  other: 'M8 2 13 8 8 14 3 8ZM3 8h10M8 2 6.5 8 8 14',
};
const hex = (c) => '#' + c.toString(16).padStart(6, '0');

const ICON = {
  joint: '<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',
  transform: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',
  mesh: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  skin: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  locator: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10M2.8 9.2l6.4-6.4" fill="none" stroke="#8e97a1" stroke-width="1.3" stroke-linecap="round"/></svg>',
  camera: '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="3.5" width="7" height="5.5" rx="1" fill="none" stroke="#8e97a1" stroke-width="1.2"/><path d="M8 5.5 11 4v4.5L8 7" fill="none" stroke="#8e97a1" stroke-width="1.2" stroke-linejoin="round"/></svg>',
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
// エラー（#error）を自動で消すまでの時間と、出した直後に操作で消さない時間（ミリ秒）
const ERROR_HIDE_MS = 8000;
const ERROR_GRACE_MS = 400;
const fileName = (p) => String(p || '').split(/[\\/]/).pop();
/** これより行が多い階層は、見えている範囲の行だけを要素にする（仮想リスト） */
export const TREE_VIRTUAL_ROWS = 2000;
const TREE_ROW_HEIGHT = 22;          // 行の高さ（style.css の .row と同じ）
/** 階層の名前: 名前空間（armA:）は薄く表示する（HTML を解析せずに要素へ入れる） */
function setNameContent(el, label) {
  const k = label.lastIndexOf(':');
  if (k > 0) {
    const ns = document.createElement('span');
    ns.className = 'ns';
    ns.textContent = label.slice(0, k + 1);
    el.append(ns, label.slice(k + 1));
  } else {
    el.textContent = label;
  }
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
    this.emptyWanted = true;                        // 起動直後はシーンがない（案内を出す。syncOverlays）
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
    $('opt-csize').addEventListener('input', (e) => s('controlSize', parseFloat(e.target.value)));
    // コントローラーの種別ごとの表示（チェックを外した種別を隠す）
    const roles = $('control-roles');
    for (const r of CONTROL_ROLES) {
      const row = document.createElement('label');
      row.className = 'role-row';
      row.dataset.role = r;
      row.innerHTML = `<input type="checkbox" data-role="${r}" checked><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="${ROLE_ICON[r]}"/></svg>`
        + `<span class="rn">${ROLE_LABELS[r]}</span><span class="rc"></span>`;
      roles.appendChild(row);
    }
    const hiddenRoles = () => [...roles.querySelectorAll('input[data-role]')].filter((x) => !x.checked).map((x) => x.dataset.role);
    roles.addEventListener('change', () => s('controlHidden', hiddenRoles()));
    $('btn-roles-all').addEventListener('click', () => s('controlHidden', []));
    $('btn-roles-none').addEventListener('click', () => s('controlHidden', CONTROL_ROLES.slice()));
    const toggles = { 'opt-wire': 'wire', 'opt-skin': 'skin', 'opt-joints': 'joints', 'opt-controls': 'controls', 'opt-curves': 'curves', 'opt-xray': 'xray', 'opt-tex': 'textures', 'opt-grid': 'grid' };
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
    const fileLabel = document.querySelector('label[for="file-input"]');
    fileLabel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('file-input').click(); }
    });
    // ［ファイル］メニューの項目: 選んだらメニューを閉じる（ファイルを選ぶ画面の裏に残さない）
    fileLabel.addEventListener('click', () => { if (this.closeMenus) this.closeMenus(); });
  }

  /** キーボード操作などで変わった設定をツールバーに反映 */
  syncSettings(st) {
    document.querySelectorAll('.choices[data-setting]').forEach((group) => {
      if (group.dataset.setting !== 'camera') this.checkChoice(group, st[group.dataset.setting]);
    });
    $('opt-jsize').value = st.jointSize;
    $('opt-csize').value = st.controlSize;
    const hidden = new Set(st.controlHidden || []);
    document.querySelectorAll('#control-roles .role-row').forEach((row) => {
      const r = row.dataset.role;
      row.querySelector('input').checked = !hidden.has(r);
      row.querySelector('svg').style.color = st.controlColor === 'side' ? '' : hex(ROLE_COLORS[r]);   // 左右の色のときは形だけ
    });
    $('opt-wire').setAttribute('aria-pressed', String(st.wire));
    $('opt-skin').setAttribute('aria-pressed', String(st.skin));
    $('opt-joints').setAttribute('aria-pressed', String(st.joints));
    $('opt-controls').setAttribute('aria-pressed', String(st.controls !== false));
    $('opt-curves').setAttribute('aria-pressed', String(st.curves !== false));
    $('opt-xray').setAttribute('aria-pressed', String(st.xray));
    $('opt-grid').setAttribute('aria-pressed', String(!!st.grid));
    $('opt-tex').setAttribute('aria-pressed', String(st.textures));
    $('opt-bind').setAttribute('aria-pressed', String(st.poseSource === 'bind'));
    $('opt-camera-icons').checked = !!st.cameraIcons;
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
    const viewState = [st.lighting === 'flat' ? 'フラットライト' : '', st.shading === 'none' ? 'ワイヤーのみ' : st.shading === 'flat' ? 'フラット' : '',
      st.playbackCacheMB === 0 ? 'キャッシュなし' : '', st.playbackCachePrecision === 'float64' ? 'キャッシュ 64 ビット' : '',
      st.ikChainSolver === 'preferred' ? 'IK: 優先角' : '']
      .filter(Boolean).join('・');
    $('menu-view-state').textContent = viewState;
    $('menu-maps-state').textContent = st.mapView !== 'combined' ? VIEW[st.mapView] || '' : '';
    $('menu-weights-state').textContent = { selected: 'ヒートマップ', all: '色分け' }[st.weightMode] || '';
    document.querySelectorAll('#opt-tool [data-tool]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tool === st.tool));
    });
  }

  /** コントローラーの種別ごとの数（null はリグを読み込む前）。シーンにない種別は薄くする */
  setControlCounts(counts) {
    document.querySelectorAll('#control-roles .role-row').forEach((row) => {
      const n = counts ? counts[row.dataset.role] || 0 : 0;
      row.querySelector('.rc').textContent = counts ? String(n) : '';
      row.classList.toggle('none', !n);
    });
    $('control-roles-note').textContent = counts ? 'カーブの形のコントローラーは、カーブの表示で切り替えます。'
      : 'コントローラーは、アニメーション（リグ）を読み込むと表示します。';
  }

  /**
   * 今の表示設定では効果のない切り替えボタンを薄く表示し、理由をツールチップに足す（押すこと自体はできる）。
   * @param hints {ボタンの id: 理由}（載っていないボタンは通常の表示）
   */
  setToolbarHints(hints) {
    for (const id of ['opt-wire', 'opt-tex', 'opt-skin', 'opt-joints', 'opt-controls', 'opt-curves', 'opt-xray', 'opt-bind', 'opt-grid']) {
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
    // ビューポートの左下の案内は短くする（詳しい操作は［ヘルプ］→［操作方法］と README）
    $('vp-hint').textContent = ci >= 0
      ? `カメラ ${name} から表示中${edited ? '（視点を一時的に移動中）' : ''}　Shift+C: 自由視点`
      : 'Alt+マウス: 視点の操作　クリック・ドラッグ: 選択';
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
        this.keepRowInPlace(row, () => {               // 開閉した行は、画面の同じ高さのまま
          if (e.shiftKey) this.setSubtreeOpen(+rowEl.dataset.row, open);
          else if (open) this.collapsed.delete(row.key);
          else this.collapsed.add(row.key);
          this.applyTreeVisibility();
        });
        return;
      }
      // Maya のアウトライナーと同じ: Ctrl+クリックで切り替え、Shift+クリックでリードの行からその行までを選ぶ
      // （Ctrl+Shift+クリックは加える）。メッシュの行は、その transform を選ぶ
      const ctrl = e.ctrlKey || e.metaKey;
      if (e.shiftKey && !ctrl && this.selectedRow && !this.selectedRow.hidden) {
        this.app.setSelection(this.rangeNodes(this.selectedRow, row), { notify: true });
        return;
      }
      const mode = ctrl && e.shiftKey ? 'add' : ctrl ? 'toggle' : 'replace';
      if (row.mesh >= 0) this.app.selectMesh(row.mesh, { mode });      // メッシュの行はその行を選択状態にする
      else this.app.select(row.node, { notify: true, mode });
    });
    // Maya のアウトライナーと同じく、キー操作はマウスが上にあるパネルで受ける（treeKey）
    tree.addEventListener('scroll', () => { this.shrinkTreePad(); this.scheduleTreeRender(); }, { passive: true });
    new ResizeObserver(() => this.scheduleTreeRender()).observe(tree);
    tree.addEventListener('pointerenter', () => { this.treeHover = true; });
    tree.addEventListener('pointerleave', () => { this.treeHover = false; });
    $('tree-expand-all').addEventListener('click', () => this.setAllOpen(true));
    $('tree-collapse-all').addEventListener('click', () => this.setAllOpen(false));
    $('tree-filter').addEventListener('input', (e) => {
      this.filter = e.target.value.trim().toLowerCase();
      this.applyTreeVisibility();
    });
  }

  /**
   * 階層の上でのキー操作（Maya のアウトライナー）。F: 選択を表示（祖先を開いてスクロール）、↑ ↓: 表示している前後の行を選ぶ、
   * ← : 閉じる（閉じていれば親を選ぶ）、→ : 開く（開いていれば最初の子を選ぶ）。使ったら true
   */
  treeKey(e) {
    if (!this.treeHover || !this.rows || !this.rows.length) return false;
    const k = e.key;
    if (k === 'f' || k === 'F') { this.revealSelected(); return true; }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k)) return false;
    const cur = this.selectedRow;
    const shown = this.shownRows;
    if (!cur || cur.hidden) {
      if (shown.length && (k === 'ArrowUp' || k === 'ArrowDown')) this.selectRow(k === 'ArrowUp' ? shown[shown.length - 1] : shown[0]);
      return true;
    }
    const i = shown.indexOf(cur);
    if (k === 'ArrowUp' && i > 0) this.selectRow(shown[i - 1]);
    else if (k === 'ArrowDown' && i < shown.length - 1) this.selectRow(shown[i + 1]);
    else if (k === 'ArrowLeft') {
      if (cur.hasChildren && !this.collapsed.has(cur.key) && !this.filter) {
        this.keepRowInPlace(cur, () => { this.collapsed.add(cur.key); this.applyTreeVisibility(); });
      }
      else {
        const p = this.parentRow(cur);
        if (p && !p.hidden) this.selectRow(p);
      }
    } else if (k === 'ArrowRight' && cur.hasChildren) {
      if (this.collapsed.has(cur.key)) this.keepRowInPlace(cur, () => { this.collapsed.delete(cur.key); this.applyTreeVisibility(); });
      else if (shown[i + 1] && shown[i + 1].depth > cur.depth) this.selectRow(shown[i + 1]);
    }
    return true;
  }

  /** 表示している行のうち、from から to までの行のノード（選んだ順。to の行が最後 = リード） */
  rangeNodes(from, to) {
    const shown = this.shownRows;
    let a = shown.indexOf(from), b = shown.indexOf(to);
    if (a < 0 || b < 0) return [to.node];
    const step = a <= b ? 1 : -1;
    const out = [];
    for (let i = a; ; i += step) {
      const n = shown[i].node;
      const k = out.indexOf(n);
      if (k >= 0) out.splice(k, 1);
      out.push(n);
      if (i === b) break;
    }
    return out;
  }

  /** 階層の行を選ぶ（クリックと同じ）。表示の範囲に入れる */
  selectRow(row) {
    if (row.mesh >= 0) this.app.selectMesh(row.mesh);
    else this.app.select(row.node, { notify: true });
    this.scrollToRow(row, 'nearest');
  }

  /** 選択している行を見えるようにする（祖先を開いて、まん中にスクロール。Maya のアウトライナーの F） */
  revealSelected() {
    const row = this.selectedRow;
    if (!row) return;
    const nodes = this.app.data.nodes;
    let changed = false;
    for (let p = row.mesh >= 0 ? row.node : nodes[row.node].parent; p >= 0; p = nodes[p].parent) {
      if (this.collapsed.delete('n' + p)) changed = true;
    }
    if (this.filter && row.hidden) {                       // 絞り込みで隠れていれば、絞り込みを外す
      this.filter = '';
      $('tree-filter').value = '';
      changed = true;
    }
    if (changed) this.applyTreeVisibility();
    if (!row.hidden) this.scrollToRow(row, 'center');
  }

  populate(data, built) {
    const tree = $('tree');
    tree.textContent = '';
    tree.scrollTop = 0;
    this.treePad = 0;
    this.treePadW = 0;
    this.treeMinW = 0;
    this.treePadEl = null;
    this.rows = [];
    this.shownRows = [];
    this.rowOfNode = new Map();
    this.rowOfMesh = new Map();
    this.collapsed = new Set();
    this.selectedRow = null;
    this.selectedRows = [];
    this.parentMarks = [];
    this.textureState = null;
    const meshesOf = new Map();
    data.meshes.forEach((m, mi) => {
      if (!meshesOf.has(m.transform)) meshesOf.set(m.transform, []);
      meshesOf.get(m.transform).push(mi);
    });
    const cameraNodes = new Set((data.cameras || []).map((c) => c.transform));
    const collapseDeep = data.nodes.length > 400;
    // 行の要素は、アイコンとリファレンスの印の組み合わせごとのひな形を複製して作る（行ごとに HTML を解析すると、
    // ノードの多いシーンで遅いため）
    const templates = new Map();
    const templateOf = (icon, ref) => {
      const key = icon + (ref ? '\u0001' : '');
      let t = templates.get(key);
      if (!t) {
        t = document.createElement('div');
        t.setAttribute('role', 'treeitem');
        t.innerHTML = '<button class="twisty" tabindex="-1" aria-label="開閉" title="クリック: 開閉　Shift+クリック: 下の階層もまとめて開閉">▾</button>'
          + `<span class="icon">${icon}${ref ? '<i class="ref-badge" aria-label="リファレンス"></i>' : ''}</span>`
          + '<span class="name"></span>'
          + `<button class="eye" tabindex="-1" aria-pressed="true" aria-label="表示" title="表示・非表示（H: 切り替え / Ctrl+H: 隠す / Shift+H: 表示）">${EYE}</button>`;
        templates.set(key, t);
      }
      return t;
    };
    // 行の要素は描くときに作る（大きなシーンでは見えている行だけ。makeRowEl）
    this.makeRowEl = (row) => {
      const ref = row.ref;
      const el = templateOf(row.icon, !!ref).cloneNode(true);
      el.dataset.row = String(row.index);
      el.style.setProperty('--depth', row.depth);
      if (!row.hasChildren) el.firstChild.classList.add('leaf');
      const name = el.childNodes[2];
      name.title = row.title + (ref ? `\nリファレンス: ${ref.namespace}（${fileName(ref.resolved || ref.path)}）` : '');
      setNameContent(name, row.label);
      row.eye = el.lastChild;
      row.el = el;
      row.twisty = el.firstChild;
      row.drawn = '';
      this.syncRow(row);
      return el;
    };
    const addRow = (row) => {
      // リファレンスから読み込んだノード（名前空間から判定）は、アイコンに印を付けて名前の色を変える
      row.ref = referenceOf(data, row.label);
      row.index = this.rows.length;
      // 行の状態（要素には syncRow で反映する）
      Object.assign(row, { el: null, hidden: false, closed: false, selected: false, other: false, childSelected: false,
        filterParent: false, eyeOn: true });
      this.rows.push(row);
      return row;
    };
    const visit = (ni, depth) => {
      const n = data.nodes[ni];
      const kids = built.childrenOf[ni];
      const meshKids = meshesOf.get(ni) || [];
      const icon = n.type === 'joint' ? ICON.joint : cameraNodes.has(ni) ? ICON.camera
        : n.shape === 'locator' ? ICON.locator : ICON.transform;
      const row = addRow({
        key: 'n' + ni, node: ni, mesh: -1, depth, label: n.name, title: n.path, icon,
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
    // 行が多ければ、見えている範囲の行だけを描く（少なければ、これまでどおり全行の要素を順に置く）
    this.treeVirtual = this.rows.length > TREE_VIRTUAL_ROWS;
    if (this.treeVirtual) {
      this.treeTop = document.createElement('div');
      this.treeBottom = document.createElement('div');
      this.treeTop.className = this.treeBottom.className = 'tree-spacer';
      // 横幅: 見えていない行の幅は測れないので、名前の長さから見積もったいちばん長い行の幅にそろえる
      let w = 0;
      for (const r of this.rows) w = Math.max(w, 6 + r.depth * 14 + 34 + r.label.length * 7.5 + 26);
      this.treeMinW = Math.ceil(w);
      this.treeTop.style.minWidth = `${this.treeMinW}px`;
    } else {
      const frag = document.createDocumentFragment();
      for (const r of this.rows) frag.appendChild(this.makeRowEl(r));
      // 開閉した行を同じ高さに保つための、下の余白（keepRowInPlace）
      this.treePadEl = document.createElement('div');
      this.treePadEl.className = 'tree-spacer';
      this.treePadEl.style.height = '0px';
      frag.appendChild(this.treePadEl);
      tree.appendChild(frag);
    }
    this.applyTreeVisibility();
  }

  /** 行の状態（表示・選択・開閉・目のアイコン）を、要素があれば要素に反映する */
  syncRow(row) {
    const el = row.el;
    if (!el) return;
    const cls = 'row' + (row.dim ? ' dim' : '') + (row.ref ? ' referenced' : '') + (row.filterParent ? ' filter-parent' : '')
      + (row.childSelected ? ' child-selected' : '') + (row.selected ? ' selected' : '') + (row.other ? ' other' : '');
    const key = cls + (row.hidden ? 'h' : '') + (row.closed ? 'c' : '') + (row.eyeOn ? 'e' : '');
    if (row.drawn === key) return;
    row.drawn = key;
    if (el.className !== cls) el.className = cls;
    if (!this.treeVirtual) el.hidden = row.hidden;
    row.twisty.textContent = row.closed ? '▸' : '▾';
    if (row.hasChildren) el.setAttribute('aria-expanded', String(!row.closed));
    if (row.selected) el.setAttribute('aria-selected', 'true'); else el.removeAttribute('aria-selected');
    row.eye.setAttribute('aria-pressed', String(row.eyeOn));
    row.eye.setAttribute('aria-label', row.eyeOn ? '表示中' : '非表示');
  }

  /** 行の状態を変えたあと: 全行を描いているなら要素に反映し、見えている行だけなら描き直す */
  syncRows(rows) {
    if (this.treeVirtual) this.renderTree();
    else for (const r of rows) this.syncRow(r);
  }

  scheduleTreeRender() {
    if (!this.treeVirtual || this.treeRenderPending) return;
    this.treeRenderPending = true;
    requestAnimationFrame(() => { this.treeRenderPending = false; this.renderTree(); });
  }

  /** 見えている範囲の行（前後に少し余分）だけを要素にして置く（大きなシーンのとき） */
  renderTree() {
    if (!this.treeVirtual || !this.rows) return;
    const tree = $('tree');
    const shown = this.shownRows;
    const h = TREE_ROW_HEIGHT, view = tree.clientHeight || 600;
    // 行が減った直後（絞り込み・閉じる）は、スクロール位置が内容の高さを超えていることがあるので収める
    const top = Math.min(tree.scrollTop, Math.max(0, shown.length * h + (this.treePad || 0) - view));
    const first = Math.max(0, Math.floor(top / h) - 20);
    const last = Math.min(shown.length, Math.ceil((top + view) / h) + 20);
    this.treeTop.style.height = `${first * h}px`;
    this.treeBottom.style.height = `${(shown.length - last) * h + (this.treePad || 0)}px`;
    const els = [this.treeTop];
    for (let i = first; i < last; i++) {
      const r = shown[i];
      if (r.el) this.syncRow(r); else this.makeRowEl(r);
      els.push(r.el);
    }
    els.push(this.treeBottom);
    const cur = tree.children;
    if (cur.length !== els.length || els.some((e, i) => cur[i] !== e)) tree.replaceChildren(...els);
  }

  /** 行の親の行（メッシュの行は transform の行）。なければ undefined */
  parentRow(row) {
    if (row.mesh >= 0) return this.rowOfNode.get(row.node);
    const n = this.app.data.nodes[row.node];
    return n && n.parent >= 0 ? this.rowOfNode.get(n.parent) : undefined;
  }

  /** 行の上端の、階層の表示領域の上端からの高さ（表示していない行は null） */
  rowOffset(row) {
    const tree = $('tree');
    if (!row || row.hidden) return null;
    if (this.treeVirtual) {
      const i = this.shownRows.indexOf(row);
      return i < 0 ? null : i * TREE_ROW_HEIGHT - tree.scrollTop;
    }
    if (!row.el) return null;
    return row.el.getBoundingClientRect().top - tree.getBoundingClientRect().top;
  }

  /** 行の左右の位置: [字下げの左端（▸）, 名前の右端]（階層の内容の左端から） */
  rowSpanX(row) {
    const x0 = 6 + row.depth * 14;                      // style.css の .row の padding-left
    const name = row.el && row.el.isConnected ? row.el.childNodes[2] : null;
    let w = row.label.length * 7.5;                     // 描いていない行は名前の長さから
    if (name) {
      // 名前の要素は行の幅いっぱいに伸びる（flex: 1）ので、要素ではなく文字の幅を測る
      const range = document.createRange();
      range.selectNodeContents(name);
      const rw = range.getBoundingClientRect().width;
      if (rw > 0) w = rw + 4;                           // .name の padding-right
    }
    return [x0, x0 + 34 + w];                           // ▸・アイコン・間隔（14 + 4 + 12 + 4）のあとに名前
  }

  /** 行の字下げから名前の終わりまでが見えるように、横にスクロールする（入りきらなければ字下げの左端に合わせる） */
  scrollToRowX(row) {
    const tree = $('tree');
    const [x0, x1] = this.rowSpanX(row);
    const view = tree.clientWidth - 28;                 // 右端の目のアイコン（.eye）の幅を除く
    const left = tree.scrollLeft;
    if (x0 - 6 >= left && x1 <= left + view) return;
    tree.scrollLeft = Math.max(0, Math.min(x0 - 6, x1 - view));
  }

  /** 画面に見えている一番上の行 */
  topShownRow() {
    const tree = $('tree');
    if (this.treeVirtual) return this.shownRows[Math.min(this.shownRows.length - 1, Math.floor(tree.scrollTop / TREE_ROW_HEIGHT))];
    return this.shownRows.find((r) => this.rowOffset(r) > -TREE_ROW_HEIGHT / 2);
  }

  /** 下の余白（px）。表示しきれない分だけ足し、なければ 0 */
  setTreePad(px) {
    this.treePad = Math.max(0, Math.ceil(px));
    if (this.treePadEl) this.treePadEl.style.height = `${this.treePad}px`;
  }

  /** 横の余白: 内容の幅をこの幅（px）以上にする（0 なら行の幅のまま） */
  setTreePadW(px) {
    this.treePadW = Math.max(0, Math.ceil(px));
    if (this.treePadEl) this.treePadEl.style.minWidth = this.treePadW ? `${this.treePadW}px` : '';
    if (this.treeTop) this.treeTop.style.minWidth = `${Math.max(this.treeMinW, this.treePadW)}px`;
  }

  /** 上へスクロールしたら、要らなくなった下の余白を詰める（表示の下端より下の分だけなので、見えている行は動かない） */
  shrinkTreePad() {
    const tree = $('tree');
    if (this.treePadW && tree.scrollLeft + tree.clientWidth < this.treePadW) {
      this.setTreePadW(tree.scrollLeft + tree.clientWidth);   // 左へスクロールしたら、右の余白を詰める（見えない所だけ）
    }
    if (!this.treePad) return;
    const content = tree.scrollHeight - this.treePad;
    const need = tree.scrollTop + tree.clientHeight - content;
    if (need < this.treePad) {
      this.setTreePad(need);
      if (this.treeVirtual) this.renderTree();
    }
  }

  /**
   * fn（行の開閉）のあとも、anchor の行を画面の同じ高さに保つ（Maya のアウトライナーで原因を追いやすいように）。
   * anchor が隠れたら、見えている一番近い祖先の行を保つ。閉じて内容が足りなくなったら、下に余白を足す
   * （そのままだとブラウザがスクロール位置を詰めて、操作した行が下へずれる）
   */
  keepRowInPlace(anchor, fn) {
    const tree = $('tree');
    const y0 = this.rowOffset(anchor);
    const x0 = tree.scrollLeft;
    // 横: 深い行を閉じると内容の幅が縮み、ブラウザが横のスクロール位置を詰めるので、右に余白を足して保つ
    if (x0 > 0) this.setTreePadW(Math.max(this.treePadW, x0 + tree.clientWidth));
    fn();
    if (y0 === null) return;
    let row = anchor;
    while (row && row.hidden) row = this.parentRow(row);
    const y1 = this.rowOffset(row);                   // いまのスクロール位置で（詰められていれば、詰めたあとの位置で）
    if (y1 === null) return;
    tree.scrollLeft = x0;
    if (row !== anchor) this.scrollToRowX(row);       // 代わりに保つ祖先の行が左に外れていれば、見える所まで
    const want = tree.scrollTop + (y1 - y0);
    const content = tree.scrollHeight - (this.treePad || 0);
    this.setTreePad(want + tree.clientHeight - content);
    if (this.treeVirtual) this.renderTree();           // 下の詰め物の高さに余白を入れてから、スクロールする
    tree.scrollTop = Math.max(0, want);
    if (this.treeVirtual) this.renderTree();
  }

  /** 行を見える位置にスクロールする（block: 'nearest' | 'center'。scrollIntoView と同じ） */
  scrollToRow(row, block = 'nearest') {
    if (!this.treeVirtual) {
      if (row.el) {
        // 縦だけ動かす（scrollIntoView は横も行の左端に合わせてしまう）。横は名前が見えるように
        const tree = $('tree'), left = tree.scrollLeft;
        row.el.scrollIntoView({ block, inline: 'nearest' });
        tree.scrollLeft = left;
        this.scrollToRowX(row);
      }
      return;
    }
    const i = this.shownRows.indexOf(row);
    if (i < 0) return;
    const tree = $('tree'), h = TREE_ROW_HEIGHT, view = tree.clientHeight || 600;
    const top = i * h;
    if (block === 'center') tree.scrollTop = top - (view - h) / 2;
    else if (top < tree.scrollTop) tree.scrollTop = top;
    else if (top + h > tree.scrollTop + view) tree.scrollTop = top + h - view;
    this.renderTree();
    this.scrollToRowX(row);                            // 描いたあと（名前の幅を測れる）に横も
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
      row.eyeOn = on;
      row.dim = dim;
    }
    this.syncRows(this.rows);
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
    // 見えている選択中の行（なければ一番上に見えている行）を、画面の同じ高さに保つ
    // （選択中の行が閉じた中に隠れていれば、見えている一番近い祖先の行）
    const sel = this.selectedRow;
    let base = sel;
    while (base && base.hidden) base = this.parentRow(base);
    const y = base ? this.rowOffset(base) : null;
    const onScreen = y !== null && y > -TREE_ROW_HEIGHT && y < $('tree').clientHeight;
    this.keepRowInPlace(onScreen ? base : this.topShownRow(), () => {
      this.collapsed.clear();
      if (!open) for (const r of this.rows) if (r.hasChildren) this.collapsed.add(r.key);
      this.applyTreeVisibility();
    });
    if (open && sel && !sel.hidden) {
      const ys = this.rowOffset(sel);                  // 開いて出てきた選択中の行が画面の外なら、見える所まで
      if (ys === null || ys < 0 || ys + TREE_ROW_HEIGHT > $('tree').clientHeight) this.scrollToRow(sel, 'nearest');
    }
  }

  applyTreeVisibility() {
    const f = this.filter;
    let hideDepth = Infinity;
    if (f) {
      // Maya のアウトライナーと同じく、名前の合う行とその親の行を出す（親は薄く）
      const keep = [];
      for (let i = this.rows.length - 1, need = -1; i >= 0; i--) {      // need: 親を探している行の深さ（なければ -1）
        const row = this.rows[i];
        const hit = row.label.toLowerCase().includes(f);
        const parent = !hit && row.depth < need;
        keep[i] = hit || parent;
        if (hit || parent) need = row.depth;
        row.filterParent = parent;
      }
      this.rows.forEach((row, i) => { row.hidden = !keep[i]; });
    } else {
      for (const row of this.rows) {
        row.filterParent = false;
        if (row.depth > hideDepth) { row.hidden = true; continue; }
        hideDepth = Infinity;
        row.hidden = false;
        row.closed = this.collapsed.has(row.key);
        if (row.closed) hideDepth = row.depth;
      }
    }
    this.shownRows = this.rows.filter((r) => !r.hidden);
    this.syncRows(this.rows);
  }

  /**
   * 選択中のノードの行を強調する。ni はリード、mesh（メッシュの番号）を渡すとリードはそのメッシュの行を強調する。
   * all は選択中のノードすべて（複数のとき、リード以外の行は淡く強調する）
   */
  highlightNode(ni, nodes, mesh = -1, all = null) {
    const touched = [];
    for (const r of this.selectedRows || []) { r.selected = r.other = false; touched.push(r); }
    this.selectedRows = [];
    this.selectedRow = null;
    for (const r of this.parentMarks || []) { r.childSelected = false; touched.push(r); }
    this.parentMarks = [];
    const row = (mesh >= 0 && this.rowOfMesh.get(mesh)) || this.rowOfNode.get(ni);
    const rows = [];
    for (const n of all || []) {
      const r = this.rowOfNode.get(n);
      if (r && r !== row && n !== ni) rows.push(r);
    }
    if (row) rows.push(row);
    if (!rows.length) { this.syncRows(touched); return; }
    const marked = new Set(rows);
    // Maya のアウトライナーと同じく、ビューポートで選んでも階層は開かない・スクロールしない（F で表示）。
    // 選んだノードの祖先の行に印を付け、閉じた中に選択があることが分かるようにする
    for (const r of rows) {
      for (let p = r.mesh >= 0 ? r.node : nodes[r.node].parent; p >= 0; p = nodes[p].parent) {
        const pr = this.rowOfNode.get(p);
        if (pr && !marked.has(pr)) { pr.childSelected = true; this.parentMarks.push(pr); marked.add(pr); touched.push(pr); }
      }
    }
    for (const r of rows) {
      r.selected = true;
      r.other = r !== row;
      this.selectedRows.push(r);
      touched.push(r);
    }
    this.selectedRow = row || null;
    this.syncRows(touched);
  }

  /** 矩形選択の枠（rect はキャンバスの中のピクセル。null で消す） */
  setMarquee(rect) {
    let el = document.getElementById('marquee');
    if (!rect) { if (el) el.hidden = true; return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'marquee';
      document.getElementById('viewport').appendChild(el);
    }
    el.hidden = false;
    Object.assign(el.style, { left: `${rect.left}px`, top: `${rect.top}px`,
      width: `${Math.max(0, rect.right - rect.left)}px`, height: `${Math.max(0, rect.bottom - rect.top)}px` });
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
      const st = (textureState && textureState[ti]) || { status: (info.resolved || info.packed) && info.format ? 'loading' : 'missing' };
      const name = esc(fileName(info.path) || info.node || '?');
      const where = esc(info.resolved || (info.packed ? `${info.path || ''}（パッケージに同梱: ${info.packed}）` : info.path) || '');
      if (st.status === 'ok') {
        const size = (st.tiles > 1 ? `UDIM ${st.tiles} タイル・` : '')
          + (st.sourceWidth !== st.width ? `${st.sourceWidth}→${st.width}px` : `${st.width}px`);
        return `<span class="tex-ok" aria-label="読み込み済み">✓</span><span class="tex" title="${where}">${name}（${size}${st.hasAlpha ? '・アルファあり' : ''}）</span>`;
      }
      if (st.status === 'loading') return `<span class="tex-wait">…</span><span class="tex" title="${where}">${name}（読み込み中）</span>`;
      if (st.status === 'pending') return `<span class="tex-wait">–</span><span class="tex" title="${where}">${name}（未読み込み）</span>`;
      const why = st.status === 'error' ? '読み込めません'
        : info.omitted === 'albedo-only' || info.omitted === 'none' ? 'パッケージに同梱していません'
          : info.omitted === 'unreadable' || info.resolved || info.packed ? '形式に未対応' : '見つかりません';
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
    const perFace = m.faceMaterials || Array.from(m.counts, () => m.material ?? -1);
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
      head.innerHTML = '<p class="muted">ビューポートでクリックするか、階層で選ぶと（カメラは階層から）、ここに情報を表示します。</p>';
      body.innerHTML = '';
      return;
    }
    const n = info.node;
    const a = n.attrs || {};
    const typeLabel = info.cameras && info.cameras.length ? 'カメラ'
      : ({ joint: 'ジョイント', transform: 'トランスフォーム' }[n.type] || n.type)
        // シェイプの種類: ロケーターと、自作のシェイプ（プラグインのロケーターなど。ロケーターと同じく目印で示す）の型
        + (n.shape === 'locator' ? `（${n.shapeType || 'ロケーター'}）` : '');
    // 「ポーズ変更中」の印は、出ていないときも場所を取っておく（動かし始め・戻したときに下の行が上下に動かないように）
    head.innerHTML = `<p class="info-title"><span class="info-name">${esc(n.name)}<span class="info-type">${esc(typeLabel)}</span></span>`
      + `<span class="posed-badge${info.posed ? '' : ' off'}"${info.posed ? '' : ' aria-hidden="true"'}>ポーズ変更中</span></p>`
      + `<p class="info-path">${esc(n.path)}</p>`
      + this.selectionListHtml(info.selection);

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
      if (info.bindPoses && info.bindPoses.length > 1) {
        // skinCluster（dagPose）ごとにバインド時の姿勢が違う。先頭が使ったもの
        const [used, ...others] = info.bindPoses;
        h += `<tr><th>バインドポーズが複数</th><td><span class="badge warn">${info.bindPoses.length} 通り</span>。使用: ${esc(used.join('・'))}`
          + `<br>別の姿勢: ${others.map((o) => esc(o.join('・'))).join(' / ')}</td></tr>`;
      }
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
    h += `<table class="kv" style="margin-top:6px"><tr><th>ワールド位置</th><td>${fmt3(info.worldPos)}</td></tr>`
      + (info.worldRot ? `<tr><th title="Maya の xform -q -ws -ro と同じ値（回転順はノードの回転順）">ワールド回転</th><td>${fmt3(info.worldRot, 3)}</td></tr>` : '')
      + '</table>';
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
    // 複数選択の一覧: 名前をクリックすると、選択はそのままでそのノードをリードにする
    head.querySelectorAll('.sel-multi li[data-node]').forEach((el) => {
      el.addEventListener('click', () => this.app.makeLead(+el.dataset.node));
    });
    const det = head.querySelector('.sel-multi');
    if (det) det.addEventListener('toggle', () => { this.selListOpen = det.open; });
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

  /** 複数選んでいるときの見出し（選択数とリード）と、選んだものの一覧（折りたたみ）。1 つなら空 */
  selectionListHtml(sel) {
    if (!sel || sel.length < 2) return '';
    const lead = sel[sel.length - 1];
    const TYPE = { joint: 'ジョイント', transform: 'トランスフォーム' };
    // 選んだ順（最後がリード）。一覧は新しく選んだものを上に出す
    const items = sel.slice().reverse().map((s) => `<li${s.lead ? ' class="lead" title="リード（パネル・数値欄はこのノード）"'
      : ` data-node="${s.node}" title="クリックでリードにする"`}>${esc(s.name)}<span class="t">${esc(TYPE[s.type] || s.type)}${s.lead ? '・リード' : ''}</span></li>`);
    return `<details class="sel-multi"${this.selListOpen ? ' open' : ''}><summary><b>${sel.length} 個を選択</b>（リード: ${esc(lead.name)}）</summary>`
      + `<ul>${items.join('')}</ul></details>`;
  }

  // ---------------------------------------------------------------- ポーズ
  bindPose() {
    const AX = ['x', 'y', 'z'];
    // 読めない欄（空欄など）は、いまの値のまま（既定値にしない）
    const num = (id, d) => {
      const v = parseFloat($(id).value);
      if (Number.isFinite(v)) return v;
      const p = this.app.selected >= 0 && this.app.pose ? this.app.pose.get(this.app.selected) : null;
      const m = /^pose-([trs])([xyz])$/.exec(id);
      return p && m ? p[m[1]]['xyz'.indexOf(m[2])] : d;
    };
    const read = () => ({
      t: AX.map((a) => num('pose-t' + a, 0)),
      r: AX.map((a) => num('pose-r' + a, 0)),
      s: AX.map((a) => num('pose-s' + a, 1)),
    });
    for (const k of ['t', 'r', 's']) {
      AX.forEach((a, i) => {
        const el = $('pose-' + k + a);
        // 確定（Enter・フォーカス移動）までを 1 つの操作として記録する。複数選んでいれば、Maya のチャンネルボックスと
        // 同じく、入力した成分だけを選んだものすべてに同じ値で入れる（ほかの成分はそれぞれの値のまま）
        el.addEventListener('input', () => {
          // 打ちかけ（「-」や空欄など、まだ数値として読めないとき）は動かさない（既定値に一度戻って形が跳ねないように）
          const v = parseFloat(el.value);
          if (!Number.isFinite(v)) return;
          if (this.app.selection.length > 1) {
            this.app.beginPoseEdit(this.app.selection.slice(), '数値入力');
            this.app.setPoseChannelForSelection(k, i, v);
          } else {
            this.app.beginPoseEdit([this.app.selected], '数値入力');
            this.app.setPoseForSelected(read());
          }
        });
        // 確定したら、実際の値（Maya でロックしたチャンネルを固定し直した結果）で欄を表示し直す
        const commit = () => {
          this.app.endPoseEdit();
          if (this.app.selected >= 0 && this.app.pose) this.showPoseFor(this.app.selected, this.app.pose.get(this.app.selected));
        };
        el.addEventListener('change', commit);
        el.addEventListener('blur', commit);
        // Enter で確定（次の欄へは Tab）
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter') el.blur(); });
      });
    }
    // 複数選んでいれば、選んだものすべてを戻す
    $('pose-reset').addEventListener('click', () => this.app.resetPoses(this.app.selection.length ? this.app.selection.slice() : [this.app.selected]));
    $('pose-reset-all').addEventListener('click', () => this.app.resetAllPoses());
  }

  /** @param pose {t, r, s}（省略時は変更なしの姿勢） */
  /**
   * Maya でロックしたチャンネル（{ t | r | s: [X, Y, Z] } か null）を示す。3 成分ともロックした行は入力できなくする
   * （一部の成分だけのロックは、入力した結果をチャンネルの値で固定し直す。欄はローカル軸なので成分は対応しない）
   */
  setPoseLocks(locked) {
    const names = { t: '移動', r: '回転', s: 'スケール' };
    const parts = [];
    for (const k of ['t', 'r', 's']) {
      const l = (locked && locked[k]) || [false, false, false];
      const all = l.every(Boolean);
      ['x', 'y', 'z'].forEach((a) => { $(`pose-${k}${a}`).disabled = all; });
      if (all) parts.push(names[k]);
      else if (l.some(Boolean)) parts.push(names[k] + ' ' + ['X', 'Y', 'Z'].filter((_, i) => l[i]).join('・'));
    }
    const el = $('pose-lock');
    el.hidden = !parts.length;
    el.textContent = parts.length ? `Maya でロック: ${parts.join('、')}（動かしても、この値は変わりません）` : '';
  }

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
    // 複数選択: 欄はリードの値。ノードごとに値が違う欄に印を付け、入力すると全部に入ることを示す
    const multi = this.app.selection.length > 1 ? this.app.selectionPoseInfo() : null;
    for (const k of ['t', 'r', 's']) {
      ['x', 'y', 'z'].forEach((a, i) => {
        const el = $(`pose-${k}${a}`);
        const mixed = !!(multi && multi.mixed[k][i]);
        el.classList.toggle('mixed', mixed);
        el.title = mixed ? 'ノードごとに値が違います（表示はリードの値。入力すると、選んだものすべてがこの値になります）' : '';
      });
    }
    const note = $('pose-multi');
    note.hidden = !multi;
    note.textContent = multi ? `数値はリード（${multi.leadName}）の値です。入力した欄の値を、選んだ ${multi.count} 個すべてに入れます（Maya のチャンネルボックスと同じ）。`
      + (multi.mixed.any ? '斜体の欄はノードごとに値が違います。' : '') : '';
    $('pose-reset').textContent = multi ? `選択を戻す（${multi.count} 個）` : 'このノードを戻す';
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
    // 分類ごとに見出しと仕切りで分ける（Qt の警告パネルと同じ分け方。warnGroups.js）
    $('warn-body').innerHTML = list.length
      ? groupWarnings(list).map((g) => `<section class="warn-group"><h3>${esc(g.name)}（${g.items.length} 件）</h3>`
        + '<ul>' + g.items.map((w) => `<li>${esc(w)}</li>`).join('') + '</ul></section>').join('')
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
  /** 再生キャッシュの行（text が null なら隠す。cls: '' / 'full'（上限に達した）） */
  setCacheHud(text, cls) {
    const el = $('vp-cache');
    el.hidden = text === null;
    if (text === null) return;
    el.textContent = text;
    el.className = cls || '';
  }
  setFile(text) { $('status-file').textContent = text; }
  setStats(text) { $('status-stats').textContent = text; }
  setMessage(text, ms = 4000) {
    // Qt ではウィンドウのステータスバーに出す（ビューアの下の欄は表示しない）
    const b = this.app && this.app.bridge;
    if (b && b.statusMessage) b.statusMessage(text || '', text ? ms || 0 : 0);
    $('status-msg').textContent = text || '';
    clearTimeout(this.msgTimer);
    if (text && ms) this.msgTimer = setTimeout(() => { $('status-msg').textContent = ''; }, ms);
  }
  /**
   * 起動直後の案内（#empty）・読み込み中（#loading）・エラー（#error）は、どれもビューポートの中央に重ねて出すので、
   * 1 つだけを出す。案内は、読み込み中でもエラーでもないときだけ出す（setEmpty は「シーンがない」ことを伝えるだけ）
   */
  setEmpty(on) { this.emptyWanted = !!on; this.syncOverlays(); }
  syncOverlays() { $('empty').hidden = !(this.emptyWanted && $('loading').hidden && $('error').hidden); }
  /**
   * 読み込み中の表示。frac（0〜1）があれば全体の進捗のバーに反映する（再描画は呼ばれたときだけ）。
   * subText・subFrac は、いま読んでいるファイルの進み具合（リファレンスがあるときの 2 段目。なければ隠す）
   */
  showLoading(text, frac, subText, subFrac) {
    $('loading').hidden = false;
    $('error').hidden = true;                       // 前の読み込みの誤りは消す（新しく読み込み始めた）
    $('loading-text').textContent = text || '読み込み中';
    setBar($('loading-bar'), frac);
    $('loading-sub').hidden = !subText;
    if (subText) {
      $('loading-sub-text').textContent = subText;
      setBar($('loading-sub-bar'), subFrac);
    }
    this.syncOverlays();
  }
  hideLoading() { $('loading').hidden = true; this.syncOverlays(); }
  /**
   * エラーをビューポートの中央に出す。出したままだと見づらいので、一定の時間（ERROR_HIDE_MS）が経つか、
   * ユーザーが操作（クリック・キー・ホイール）したら消す。opts.sticky: 消さない（WebGL を初期化できないなど、
   * 操作しても直らず、消すと何も表示されない理由がわからなくなるとき）
   */
  showError(text, opts = {}) {
    const e = $('error');
    e.hidden = false;
    e.textContent = text;
    $('loading').hidden = true;                     // 読み込みは終わった（失敗した）
    this.syncOverlays();
    clearTimeout(this.errorTimer);
    this.errorTimer = null;
    this.errorShownAt = performance.now();
    this.errorSticky = !!opts.sticky;
    if (this.errorSticky) return;
    this.errorTimer = setTimeout(() => this.hideError(), ERROR_HIDE_MS);
    if (!this.errorDismissBound) {
      // 操作で消す。出した直後（ERROR_GRACE_MS 以内）の操作では消さない（読み終わりと同時のクリックで、読む前に消えないように）
      this.errorDismissBound = true;
      const dismiss = () => {
        if (this.errorSticky || $('error').hidden) return;
        if (performance.now() - this.errorShownAt < ERROR_GRACE_MS) return;
        this.hideError();
      };
      for (const type of ['pointerdown', 'keydown', 'wheel']) window.addEventListener(type, dismiss, { capture: true, passive: true });
    }
  }
  hideError() {
    clearTimeout(this.errorTimer);
    this.errorTimer = null;
    $('error').hidden = true;
    this.syncOverlays();
  }
}
