// ビューア本体。window.mayaViewer を通じて Python（Qt）から操作される。
import {
  BufferGeometry, DirectionalLight, Float32BufferAttribute, GridHelper, HemisphereLight, MOUSE,
  Object3D, PerspectiveCamera, Points, PointsMaterial, Raycaster, SRGBColorSpace, Scene, Vector2, Vector3, WebGLRenderer,
  Box3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { PoseState, identityPose, poseFromTransform, poseQuaternion } from './pose.js';
import {
  applyPoseSource, hasBindPose, poseBaseMatrix, BASE_COLOR, buildScene, computeBounds, disposeScene, originalVertex, renderVertexWorldPosition, validateScene,
  vertexWorldPosition, writeVertexColors,
} from './sceneBuilder.js';
import { base64ToArrayBuffer } from './textures.js';
import { MapManager, usageFor } from './mapManager.js';
import { JointOverlay } from './jointOverlay.js';
import { fillHeatmap, fillInfluenceBlend, fillSolid, vertexWeights } from './weights.js';
import { UI } from './ui.js';
import { connectBridge, isQtHost } from './bridge.js';
import { History, sameChanges } from './history.js';
import { compareGpuCpuSkinning } from './skinCheck.js';
import { AnimationClip } from './animation.js';
import { Timeline } from './timeline.js';

const VERSION = '1.0.0';
const D2R = Math.PI / 180;
const DEFAULTS = {
  shading: 'smooth', wire: false, skin: true, joints: false, xray: true, grid: true,   // 骨は初期状態で非表示（J で切り替え）
  axes: 'selected', jointSize: 1, weightMode: 'off',
  textures: true, alpha: 'material', alphaStyle: 'cutout',
  poseSource: 'bind',
  lighting: 'standard',          // 'standard' | 'flat'（ライトの影響なし。Maya のフラットライト）
  mapView: 'combined',           // 'combined'（合成）または単独表示するマップの種類
  maps: { normal: true, roughness: false, metalness: false, ao: false, emissive: false, opacity: false },
  normalFlipY: false,            // ノーマルマップの緑を反転（DirectX 形式）
  tool: 'select', space: 'local', gizmoSize: 1,
};
const TOOLS = ['select', 'translate', 'rotate', 'scale'];
const num = (n) => n.toLocaleString('ja-JP');

const _v = new Vector3();
const _v2 = new Vector3();

class ViewerApp {
  constructor() {
    this.settings = { ...DEFAULTS };
    this.data = null;
    this.built = null;
    this.selected = -1;
    this.picked = null;
    this.pose = null;           // PoseState（シーン読み込み時に作る）
    this.maps = new MapManager();
    this.edit = null;           // 記録中の操作（元に戻す用）
    this.history = new History((changes) => this.applyPoseChanges(changes));
    this.history.onChange = (h) => this.historyChanged(h);
    this.poseDirty = false;
    this.gizmoDragging = false;
    this.bridge = null;
    this.transfer = null;
    this.sceneRadius = 50;
    this.clip = null;           // AnimationClip（アニメーションを読み込んだとき）
    this.frame = 0;             // 現在のフレーム
    this.playing = false;
    this.sceneLoading = false;  // シーンの転送が終わり、組み立てを待っている間
    this.pendingAnimation = null;   // シーンの組み立て前に届いたアニメーション
    this.ui = new UI(this);
    this.timeline = new Timeline(this);
    this.ui.setHost(isQtHost() ? 'qt' : 'browser');
    this.ui.syncSettings(this.settings);     // ツールバーの表示を初期設定（DEFAULTS）に合わせる
    try {
      this.initRenderer();
    } catch (err) {
      this.renderer = null;
      this.ui.setEmpty(false);
      this.ui.showError('WebGL を初期化できませんでした。\n'
        + 'GPU ドライバを更新するか、環境変数 QTWEBENGINE_CHROMIUM_FLAGS に --ignore-gpu-blocklist を指定して起動してください。\n\n'
        + String(err && err.message || err));
    }
    this.bindEvents();
    connectBridge((b) => {
      this.bridge = b;
      if (b.jsReady) b.jsReady();
      this.historyChanged(this.history);
      this.onWarningsChanged(this.ui.warnings || []);
    });
  }

  // ------------------------------------------------------------------ 初期化
  initRenderer() {
    const canvas = document.getElementById('canvas');
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(35, 1, 0.1, 10000);
    this.camera.position.set(28, 21, 28);
    this.scene.add(this.camera);
    this.scene.add(new HemisphereLight(0xe4ecf2, 0x3b3631, 1.7));
    const key = new DirectionalLight(0xffffff, 2.0);
    key.position.set(0.4, 0.8, 1);
    key.target.position.set(0, 0, -1);
    this.camera.add(key, key.target);

    this.grid = null;
    this.updateGrid(new Box3(new Vector3(-10, 0, -10), new Vector3(10, 10, 10)));

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.DOLLY };
    this.controls.screenSpacePanning = true;
    // 慣性なし: ドラッグを離した時点でカメラを止める（three.js の既定値と同じだが明示しておく）
    this.controls.enableDamping = false;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', () => this.requestRender());

    // 移動・回転・スケールのハンドル。ノードを直接ではなく、基準フレーム内の代理オブジェクトを動かし、
    // その変換をポーズの追加分として読む（pose.js 参照）
    this.poseFrame = new Object3D();
    this.poseFrame.name = '__poseFrame';
    this.poseFrame.matrixAutoUpdate = false;
    this.poseProxy = new Object3D();
    this.poseProxy.name = '__poseProxy';
    this.poseFrame.add(this.poseProxy);
    this.scene.add(this.poseFrame);
    this.gizmo = new TransformControls(this.camera, canvas);
    this.gizmo.setSpace('local');
    this.gizmo.setSize(DEFAULTS.gizmoSize);
    this.gizmo.addEventListener('change', () => this.requestRender());
    this.gizmo.addEventListener('dragging-changed', (e) => {
      this.gizmoDragging = e.value;
      this.controls.enabled = !e.value;
      // 1 回のドラッグを 1 つの操作として記録する
      if (e.value) this.beginPoseEdit([this.selected], { translate: '移動', rotate: '回転', scale: 'スケール' }[this.gizmo.mode] || '変更');
      else { this.endPoseEdit(); this.syncGizmo(); }
    });
    this.gizmo.addEventListener('objectChange', () => this.onGizmoChange());
    this.scene.add(this.gizmo);

    this.overlay = new JointOverlay();
    this.scene.add(this.overlay.group);

    const mg = new BufferGeometry();
    mg.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
    this.marker = new Points(mg, new PointsMaterial({
      color: 0xf2a93b, size: 10, sizeAttenuation: false, depthTest: false, transparent: true,
    }));
    this.marker.renderOrder = 20;
    this.marker.visible = false;
    this.marker.frustumCulled = false;
    this.scene.add(this.marker);

    this.raycaster = new Raycaster();
    const vp = document.getElementById('viewport');
    new ResizeObserver(() => this.resize()).observe(vp);
    this.resize();
  }

  resize() {
    if (!this.renderer) return;
    const vp = document.getElementById('viewport');
    const w = Math.max(1, vp.clientWidth), h = Math.max(1, vp.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  requestRender() {
    if (this.renderPending || !this.renderer) return;
    this.renderPending = true;
    requestAnimationFrame(() => { this.renderPending = false; this.render(); });
  }

  render() {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }

  bindEvents() {
    if (this.canvas) {
      let down = null;
      this.canvas.addEventListener('pointerdown', (e) => {
        // ハンドルの上で押したときは選択（ピック）しない
        const onGizmo = !!(this.gizmo && this.gizmo.object && this.gizmo.axis !== null);
        down = { x: e.clientX, y: e.clientY, b: e.button, onGizmo };
      });
      this.canvas.addEventListener('pointerup', (e) => {
        if (down && !down.onGizmo && !this.gizmoDragging && down.b === 0 && e.button === 0
          && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) this.pick(e);
        down = null;
      });
      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    window.addEventListener('keydown', (e) => {
      const t = e.target;
      // 入力欄では文字入力の取り消し（ブラウザ標準）を優先する
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (k === 'h' && !e.shiftKey) this.setNodeVisible(this.selected, false);   // Maya と同じ: Ctrl+H = 隠す
        else if (k === 'z' && !e.shiftKey) this.undo();
        else if (k === 'y' || (k === 'z' && e.shiftKey)) this.redo();
        else return;
        e.preventDefault();
        return;
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && this.clip) {
        // Maya と同じ: Alt+V = 再生／停止、Alt+, / Alt+. = 前／次のフレーム（記号はキーの位置で判定）
        if (e.code === 'KeyV') this.togglePlay();
        else if (e.code === 'Comma') this.stepFrame(-1);
        else if (e.code === 'Period') this.stepFrame(1);
        else return;
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (this.clip && (k === ',' || k === '.' || k === 'home' || k === 'end')) {
        if (k === ',') this.stepKey(-1);            // Maya と同じ: , / . = 前／次のキー
        else if (k === '.') this.stepKey(1);
        else this.goToEdge(k === 'home' ? -1 : 1);
        e.preventDefault();
        return;
      }
      if (k === 'h') {                                  // Maya と同じ: H = 切り替え、Shift+H = 表示
        if (e.shiftKey) this.setNodeVisible(this.selected, true);
        else this.toggleNodeVisible(this.selected);
        e.preventDefault();
        return;
      }
      if (k === 'z') {                                  // Maya と同じ: z = 元に戻す、Shift+Z = やり直す
        if (e.shiftKey) this.redo(); else this.undo();
        e.preventDefault();
        return;
      }
      const set = (key, v) => { this.setSetting(key, v); this.ui.syncSettings(this.settings); };
      if (k === 'f') this.frameSelection();
      else if (k === 'a') this.frameAll();
      else if (k === 'escape') this.clearSelection();
      else if (k === '4') set('shading', 'none');
      else if (k === '5') { set('shading', 'smooth'); set('textures', false); }   // Maya と同じ: 5 = テクスチャなし
      else if (k === '6') { set('shading', 'smooth'); set('textures', true); }    //               6 = テクスチャあり
      else if (k === 'j') set('joints', !this.settings.joints);
      else if (k === 'q') set('tool', 'select');
      else if (k === 'w') set('tool', 'translate');
      else if (k === 'e') set('tool', 'rotate');
      else if (k === 'r') set('tool', 'scale');
      else if (k === '+' || k === '=' || k === ';') set('gizmoSize', Math.min(4, this.settings.gizmoSize * 1.25));
      else if (k === '-') set('gizmoSize', Math.max(0.25, this.settings.gizmoSize / 1.25));
      else return;
      e.preventDefault();
    });
    // ブラウザで開いたときの JSON ドロップ（Qt 版はウィンドウ側で .ma を受け取る）
    if (!isQtHost()) {
      document.addEventListener('dragover', (e) => { e.preventDefault(); document.body.classList.add('drag-over'); });
      document.addEventListener('dragleave', (e) => { if (!e.relatedTarget) document.body.classList.remove('drag-over'); });
      document.addEventListener('drop', (e) => {
        e.preventDefault();
        document.body.classList.remove('drag-over');
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this.loadFile(f);
      });
    }
    window.addEventListener('error', (e) => this.ui.setMessage('エラー: ' + e.message, 8000));
  }

  log(level, text) {
    if (this.bridge && this.bridge.log) this.bridge.log(level, String(text));
  }

  // ------------------------------------------------------------------ 読み込み
  loadFile(file) {
    if (/\.(ma|mb)$/i.test(file.name)) {
      this.ui.showError(`${file.name} はブラウザでは直接読めません。\n`
        + 'python -m ma_viewer export でJSONに変換するか、Qt版のビューア（python -m ma_viewer）で開いてください。');
      return;
    }
    this.ui.showLoading(`${file.name} を読み込み中`);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.source && !data.source.name) data.source.name = file.name;
        setTimeout(() => this.loadScene(data), 0);
      } catch (err) {
        this.ui.hideLoading();
        this.ui.showError(`${file.name} を JSON として読めませんでした。\n${err.message}`);
      }
    };
    reader.readAsText(file);
  }

  loadScene(data) {
    this.sceneLoading = false;
    if (!this.renderer) return false;
    const t0 = performance.now();
    this.pause();
    try {
      validateScene(data);
      this.clearScene();
      const tb = performance.now();
      const built = buildScene(data);    // ウェイトは常に正規化する
      const buildMs = performance.now() - tb;
      this.scene.add(built.root);
      this.data = data;
      this.built = built;
      // 画面の準備の内訳（ログに出す）
      const marks = [];
      let tm0 = performance.now();
      const mark = (label) => { const t = performance.now(); marks.push([label, t - tm0]); tm0 = t; };
      this.pose = new PoseState(built, data);
      this.edit = null;
      this.history.clear();
      applyPoseSource(built, this.settings.poseSource);
      this.pose.reapplyAll();
      built.root.updateMatrixWorld(true);
      this.initVisibility();
      mark('姿勢');
      const bounds = computeBounds(built, true);
      this.sceneRadius = Math.max(bounds.getSize(_v).length() / 2, 1e-3);
      mark('範囲');
      this.overlay.build(built, data.nodes, this.sceneRadius);
      this.updateGrid(bounds);
      mark('ジョイント');
      this.ui.populate(data, built);
      this.updateVisibility();
      mark('一覧');
      this.applyAll();
      mark('表示設定');

      const warnings = (data.warnings || []).slice();
      for (const e of built.meshes) {
        if (!e.skin) continue;
        const s = e.skin.stats;
        if (s.overMax) warnings.push(`${e.name}: 9 つ以上のインフルエンスを持つ頂点が ${num(s.overMax)} 個あります（変形表示は上位 8 つ）。`);
        if (s.unnormalized) warnings.push(`${e.name}: ウェイトの合計が 1 でない頂点が ${num(s.unnormalized)} 個あります（変形時に合計で割って表示しています）。`);
        if (s.zero) {
          const how = e.data.skin.weightDistribution === 1 ? '近傍' : '距離';
          warnings.push(`${e.name}: ウェイトの合計が 0 の頂点が ${num(s.zero)} 個あります。${e.data.skin.cluster} の「ウェイトの分配」（${how}）に合わせて割り当てて表示しています。`);
        }
      }
      this.ui.setWarnings(warnings);
      const src = data.source || {};
      const name = src.name || (src.path ? String(src.path).split(/[\\/]/).pop() : '') || (src.kind === 'maya' ? 'Maya シーン' : '');
      this.sceneName = name;
      this.updateTitle();
      this.ui.setFile(name || '（名前なし）');
      const tris = built.meshes.reduce((s, e) => s + e.triCount, 0);
      const verts = built.meshes.reduce((s, e) => s + e.vertexCount, 0);
      this.ui.setStats(`メッシュ ${num(built.meshes.length)} ・ 頂点 ${num(verts)} ・ 三角形 ${num(tris)} ・ ジョイント ${num(built.jointIndices.length)}`);
      this.ui.setEmpty(false);
      this.ui.hideError();
      this.ui.hideLoading();
      this.ui.showNodeInfo(null);
      this.ui.showVertexInfo(null);
      this.ui.showPoseFor(-1);
      this.frameAll(true);
      this.maps.reset(data);
      this.requestMaps();
      mark('マテリアル');
      const renderStart = performance.now();
      this.ui.setMessage(`読み込みました（${Math.round(performance.now() - t0)} ms）`);
      this.log('info', `scene loaded: ${built.meshes.length} meshes, ${built.jointIndices.length} joints`);
      // 読み込みの内訳（ビューア側）。最初の描画が終わったところまでを測る
      const tm = this.timing || {};
      const setupStart = tb + buildMs;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const ms = (x) => `${Math.round(x)} ms`;
        marks.push(['最初の描画', performance.now() - renderStart]);
        this.lastTiming = { transfer: tm.transfer || 0, parse: tm.parse || 0, build: buildMs, setup: performance.now() - setupStart,
          setupParts: Object.fromEntries(marks) };
        this.log('info', `読み込みの内訳（ビューア）: 受け渡し ${ms(this.lastTiming.transfer)}・JSON の解釈 ${ms(this.lastTiming.parse)}`
          + `・シーンの組み立て ${ms(buildMs)}・画面の準備と最初の描画 ${ms(this.lastTiming.setup)}`
          + `（${marks.map(([k, v]) => `${k} ${ms(v)}`).join('・')}）`);
        this.timing = null;
      }));
      // アニメーション（JSON に含まれているもの、またはシーンの組み立て前に届いたもの）
      const anim = this.pendingAnimation || data.animation;
      this.pendingAnimation = null;
      if (anim) this.setAnimation(anim);
      return true;
    } catch (err) {
      this.ui.hideLoading();
      this.ui.showError('シーンを表示できませんでした。\n' + (err && err.message || err));
      this.log('error', err && err.stack || err);
      return false;
    }
  }

  clearScene() {
    this.textureToken = (this.textureToken || 0) + 1;   // 読み込み中のテクスチャを無効にする
    if (this.maps) this.maps.reset(null);
    if (this.built) disposeScene(this.built);
    this.built = null;
    this.data = null;
    this.overlay.clear();
    if (this.gizmo) this.gizmo.detach();
    this.pose = null;
    this.edit = null;
    this.history.clear();
    this.selected = -1;
    this.picked = null;
    if (this.marker) this.marker.visible = false;
    this.pause();
    this.clip = null;
    this.timeline.setClip(null);
  }

  clearAll() {
    this.pendingAnimation = null;
    this.clearScene();
    this.timeline.setStatus('');
    this.ui.populate({ nodes: [], meshes: [] }, { childrenOf: [], meshes: [] });
    this.ui.setWarnings([]);
    this.ui.setTitle('');
    this.ui.setFile('ファイル未読み込み');
    this.ui.setStats('');
    this.ui.setEmpty(true);
    this.ui.showNodeInfo(null);
    this.ui.showVertexInfo(null);
    this.ui.showPoseFor(-1);
    this.ui.setLegend('off');
    this.requestRender();
  }

  updateTitle() {
    let t = this.sceneName || '';
    if (this.built && hasBindPose(this.built)) t += this.settings.poseSource === 'bind' ? '（バインドポーズ）' : '（ファイルの値）';
    this.ui.setTitle(t);
  }

  updateGrid(bounds) {
    if (this.grid) { this.scene.remove(this.grid); this.grid.geometry.dispose(); this.grid.material.dispose(); }
    const ext = Math.max(Math.abs(bounds.min.x), Math.abs(bounds.max.x), Math.abs(bounds.min.z), Math.abs(bounds.max.z), 1e-3);
    const size = niceCeil(ext * 2.4);
    this.grid = new GridHelper(size, 20, 0x2b2f34, 0x5d656e);
    this.grid.material.transparent = true;
    this.grid.material.opacity = 0.6;
    this.grid.material.depthWrite = false;
    this.grid.renderOrder = -1;
    this.grid.visible = !!this.settings.grid;
    this.scene.add(this.grid);
  }

  // ------------------------------------------------------------------ 設定
  setSetting(key, value) {
    if (key === 'tool' && !TOOLS.includes(value)) return;
    this.settings[key] = value;
    if (key === 'gizmoSize' && this.gizmo) this.gizmo.setSize(value);
    if (key === 'space' && this.gizmo) this.gizmo.setSpace(value);
    if (key === 'grid' && this.grid) this.grid.visible = !!value;      // シーンがなくても切り替えられる
    this.ui.syncSettings(this.settings);     // ツールバーの表示（押下状態・メニューの状態）を合わせる
    if (!this.built) { this.requestRender(); return; }
    switch (key) {
      case 'tool':
      case 'space':
        this.updateGizmo();
        break;
      case 'shading':
      case 'wire':
        this.applyShading();
        this.applyWeights();
        break;
      case 'skin':
        this.applyShading();
        this.poseDirty = true;
        this.updateMarker();
        if (this.picked) this.ui.showVertexInfo(this.vertexInfo());
        break;
      case 'joints': this.overlay.setVisible(value); break;
      case 'xray': this.overlay.setXray(value); break;
      case 'axes': this.overlay.setAxesMode(value); break;
      case 'jointSize': this.overlay.setSize(value); break;
      case 'weightMode': this.applyWeights(); break;
      case 'textures':
      case 'alpha':
      case 'alphaStyle':
      case 'lighting':
      case 'mapView':
      case 'maps':
      case 'normalFlipY':
        this.requestMaps();
        break;
      case 'poseSource':
        applyPoseSource(this.built, value);
        this.pose.reapplyAll();
        this.afterPoseChange();
        this.updateTitle();
        break;
      default: break;
    }
    this.requestRender();
  }

  applyAll() {
    const st = this.settings;
    this.overlay.setVisible(st.joints);
    this.overlay.setXray(st.xray);
    this.overlay.setAxesMode(st.axes);
    this.overlay.setSize(st.jointSize);
    this.applyShading();
    this.applyWeights();
    this.requestRender();
  }

  applyShading() {
    const st = this.settings;
    for (const e of this.built.meshes) {
      const useSkin = st.skin && !!e.skinned;
      const shaded = e.visible && st.shading !== 'none';
      const wire = e.visible && (st.wire || st.shading === 'none');
      e.staticMesh.visible = shaded && !useSkin;
      if (e.skinned) e.skinned.visible = shaded && useSkin;
      e.staticWire.visible = wire && !useSkin;
      if (e.skinnedWire) e.skinnedWire.visible = wire && useSkin;
      const wireOnly = st.shading === 'none';
      e.wireMaterial.opacity = wireOnly ? 0.95 : 0.5;
      e.wireMaterial.color.set(wireOnly ? 0xc8d2da : 0x1d2024);
    }
  }

  applyWeights() {
    const mode = this.settings.weightMode;
    const on = mode !== 'off';
    for (const e of this.built.meshes) {
      const wireColors = on && this.settings.shading === 'none';
      if (e.wireMaterial.vertexColors !== wireColors) { e.wireMaterial.vertexColors = wireColors; e.wireMaterial.needsUpdate = true; }
      if (wireColors) e.wireMaterial.color.set(0xffffff);
      if (!on) continue;
      // 元の頂点単位で色を作り、表示用頂点（UV の継ぎ目で分割）に展開する
      const colors = new Float32Array(e.vertexCount * 3);
      if (!e.skin) fillSolid(colors, 0.42, 0.43, 0.45);
      else if (mode === 'selected') {
        const slot = this.selected >= 0 ? e.data.skin.influences.indexOf(this.selected) : -1;
        fillHeatmap(colors, e.skin, slot, e.vertexCount);
      } else fillInfluenceBlend(colors, e.skin, e.data.skin.influences, e.vertexCount);
      writeVertexColors(e, colors);
    }
    this.applyMaterials();
    this.ui.setLegend(mode, this.selected >= 0 && this.data ? this.data.nodes[this.selected].name : null);
  }

  /** 表示設定（テクスチャ・透過・ウェイト・フラット）を、すべてのマテリアルに反映する */
  applyMaterials() {
    if (!this.built) return;
    const st = this.settings;
    const weights = st.weightMode !== 'off';
    const view = st.mapView || 'combined';
    const unlitMode = st.lighting === 'flat' || view !== 'combined';
    const flat = st.shading === 'flat';
    const M = this.maps;
    const show = st.textures && !weights;
    const tex = (ud, kind, isView) => {
      const mp = ud.maps[kind];
      return show && mp ? M.texture(mp.key, usageFor(kind, mp.channel, isView)) : null;
    };
    const setColorView = (c, v) => c.setRGB(v, v, v, SRGBColorSpace);   // 値をそのまま画面に出す
    for (const m of this.built.allMaterials) {
      const ud = m.userData;
      const base = tex(ud, 'baseColor', false);
      const baseKey = ud.maps.baseColor && ud.maps.baseColor.key;
      const hasAlpha = !!(base && M.hasAlpha(baseKey));
      const alphaOn = hasAlpha && st.alpha !== 'none' && (st.alpha === 'all' || ud.useAlpha);
      const opacityMap = st.maps.opacity ? tex(ud, 'opacity', false) : null;
      // 真偽値にそろえる（three.js は transparent が厳密に false のときだけ不透明として描く）
      const anyAlpha = !!(alphaOn || opacityMap);
      const cutout = anyAlpha && st.alphaStyle === 'cutout';
      const blend = anyAlpha && st.alphaStyle === 'blend';
      const alphaTest = cutout ? 0.5 : blend ? 0.01 : 0;
      const surfaceColor = (c) => {
        if (weights || base) c.set(0xffffff);
        else if (st.textures && ud.isMaya) c.copy(ud.baseColor);
        else c.set(BASE_COLOR);
      };

      // --- ライトあり（合成表示）
      surfaceColor(m.color);
      m.map = base;
      m.normalMap = st.maps.normal ? tex(ud, 'normal', false) : null;
      m.normalScale.set(1, st.normalFlipY ? -1 : 1);
      m.roughnessMap = st.maps.roughness ? tex(ud, 'roughness', false) : null;
      m.roughness = m.roughnessMap ? 1 : (ud.roughness ?? 0.78);
      m.metalnessMap = st.maps.metalness ? tex(ud, 'metalness', false) : null;
      m.metalness = m.metalnessMap ? 1 : (ud.metalness ?? 0);
      m.aoMap = st.maps.ao ? tex(ud, 'ao', false) : null;
      m.emissiveMap = st.maps.emissive ? tex(ud, 'emissive', false) : null;
      m.emissive.set(m.emissiveMap ? 0xffffff : 0x000000);
      m.alphaMap = opacityMap;
      m.vertexColors = weights;
      m.flatShading = flat;
      m.transparent = blend;
      m.alphaTest = alphaTest;

      // --- ライトなし（フラットライト・マップの単独表示）
      const u = ud.unlit;
      u.vertexColors = weights;
      u.alphaMap = null;
      if (view === 'combined' || weights) {
        surfaceColor(u.color);
        u.map = weights ? null : base;
        u.transparent = blend;
        u.alphaTest = weights ? 0 : alphaTest;
        u.alphaMap = weights ? null : opacityMap;
      } else {
        u.map = tex(ud, view, true);
        u.transparent = false;
        u.alphaTest = 0;
        if (u.map) u.color.set(0xffffff);
        else if (view === 'baseColor') surfaceColor(u.color);
        else if (view === 'normal') u.color.setRGB(0.5, 0.5, 1, SRGBColorSpace);        // 平らな法線の色
        else if (view === 'roughness') setColorView(u.color, ud.roughness ?? 0.78);
        else if (view === 'metalness') setColorView(u.color, ud.metalness ?? 0);
        else if (view === 'emissive') u.color.set(0x000000);
        else u.color.set(0xffffff);                                                     // AO・不透明度は 1
      }
      for (const x of [m, u]) {
        const sig = [x.map, x.normalMap, x.roughnessMap, x.metalnessMap, x.aoMap, x.emissiveMap, x.alphaMap]
          .map((t) => (t ? 1 : 0)).join('') + [x.vertexColors, x.flatShading, x.transparent, x.alphaTest > 0].join();
        if (x.userData.sig !== sig) { x.userData.sig = sig; x.needsUpdate = true; }
      }
    }
    // ライトあり／なしのマテリアルを差し替える
    for (const e of this.built.meshes) {
      const mats = unlitMode ? e.materials.map((m) => m.userData.unlit) : e.materials;
      const mat = mats.length > 1 ? mats : mats[0];
      e.staticMesh.material = mat;
      if (e.skinned) e.skinned.material = mat;
    }
    this.requestRender();
  }

  /** 表示設定に必要なマップを読み込み（足りないものだけ）、マテリアルに反映する */
  requestMaps() {
    if (!this.built) return;
    const keys = this.maps.neededKeys(this.built.allMaterials, this.settings);
    const readViaBridge = this.bridge && this.bridge.readFileBase64
      ? (path) => new Promise((resolve, reject) => this.bridge.readFileBase64(path, (b64) => (b64 ? resolve(base64ToArrayBuffer(b64)) : reject(new Error('Python から受け取れませんでした')))))
      : null;
    const errors = [];
    const started = this.maps.ensure(keys, readViaBridge, { forceBridge: !!this.forceBridgeTextures }, (done, total) => {
      this.applyMaterials();
      if (done === total) {
        this.ui.populateMeshes(this.data, this.built, this.textureStatusList());
        if (errors.length) this.ui.addWarnings(errors);
        this.ui.setMessage(`テクスチャ ${total} 枚を読み込みました`);
        this.log('info', `textures loaded: ${total}`);
      } else {
        this.ui.setMessage(`テクスチャを読み込み中（${done} / ${total}）`, 0);
      }
    }, (key, s) => errors.push(`${s.info.node}: テクスチャを読み込めませんでした（${s.resolved}）: ${s.message}`));
    if (started) this.ui.setMessage(`テクスチャを読み込み中（0 / ${started}）`, 0);
    this.ui.populateMeshes(this.data, this.built, this.textureStatusList());
    this.applyMaterials();
  }

  textureStatusList() {
    return ((this.data && this.data.textures) || []).map((_, i) => this.maps.textureStatus(i));
  }

  setMapToggle(kind, on) {
    this.settings.maps = { ...this.settings.maps, [kind]: on };
    this.setSetting('maps', this.settings.maps);
  }

  // ------------------------------------------------------------------ 表示・非表示
  /** 読み込み時: Maya で非表示のノード・メッシュを、そのまま非表示にする */
  initVisibility() {
    this.hidden = new Set();
    this.data.nodes.forEach((n, i) => { if (n.visible === false) this.hidden.add(i); });
    for (const e of this.built.meshes) {
      e.selfVisible = e.data.visibleSelf !== undefined ? e.data.visibleSelf !== false : e.data.visible !== false;
    }
    this.computeVisibility();
  }

  /** 親を含めた実際の表示状態（Maya と同じく、親が非表示なら子も非表示） */
  computeVisibility() {
    const nodes = this.data.nodes;
    const eff = new Array(nodes.length).fill(false);
    nodes.forEach((n, i) => { eff[i] = this.hidden.has(i) || (n.parent >= 0 && eff[n.parent]); });
    this.hiddenEff = eff;
    for (const e of this.built.meshes) e.visible = e.selfVisible && !eff[e.transform];
  }

  updateVisibility() {
    if (!this.built) return;
    this.computeVisibility();
    this.overlay.setHiddenNodes(this.hiddenEff);
    this.ui.updateVisibilityMarks(this.hidden, this.hiddenEff, this.built.meshes);
    if (this.picked && !this.built.meshes[this.picked.mesh].visible) {
      this.picked = null;
      this.marker.visible = false;
      this.ui.showVertexInfo(null);
    }
    if (this.selected >= 0) this.ui.showNodeInfo(this.nodeInfo(this.selected));
    this.poseDirty = true;
    this.applyShading();
    this.requestRender();
  }

  setNodeVisible(ni, visible) {
    if (!this.built || ni < 0) return;
    if (visible) this.hidden.delete(ni); else this.hidden.add(ni);
    this.updateVisibility();
    this.ui.setMessage(`${visible ? '表示' : '非表示に'}しました: ${this.data.nodes[ni].name}`);
  }

  toggleNodeVisible(ni) {
    if (ni >= 0 && this.hidden) this.setNodeVisible(ni, this.hidden.has(ni));
  }

  setMeshVisible(mi, v) {
    if (!this.built) return;
    this.built.meshes[mi].selfVisible = v;
    this.ui.setMeshChecked(mi, v);
    this.updateVisibility();
  }

  // ------------------------------------------------------------------ 選択
  // ------------------------------------------------------------------ アニメーション
  /** アニメーション（共通 JSON の animation）を読み込む。シーンの組み立て前なら、組み立て後に読み込む */
  setAnimation(anim) {
    if (this.sceneLoading || !this.built) {
      this.pendingAnimation = anim;
      return true;
    }
    let clip;
    try {
      clip = new AnimationClip(anim);
      const bad = clip.nodes.find((ni) => !(ni >= 0 && ni < this.data.nodes.length));
      if (bad !== undefined) throw new Error(`ノード番号 ${bad} がシーンにありません`);
    } catch (err) {
      this.timeline.setStatus('アニメーションを読み込めませんでした: ' + (err && err.message || err));
      this.log('error', err && err.stack || err);
      return false;
    }
    this.pause();
    this.clip = clip;
    this.data.animation = anim;
    // 姿勢の基準が変わったときに子のスケール補正も掛け直すよう、動くノードとその子を覚えておく
    const touched = new Set();
    for (const ni of clip.nodes) {
      touched.add(ni);
      for (const c of this.built.childrenOf[ni]) touched.add(c);
    }
    this.animTouched = [...touched].sort((a, b) => a - b);
    // 保存時の値は、保存したときのフレーム（time1）の値（カーブで決まる値は .ma に残っていないため）。
    // バインドポーズの表示で、バインドポーズの情報がないノードに使う
    for (const [ni, m] of clip.evaluate(clip.current)) this.built.nodeObjects[ni].userData.savedMatrix.copy(m);
    if (clip.warnings.length) this.ui.setWarnings((this.ui.warnings || []).concat(clip.warnings));
    this.timeline.setClip(clip);
    this.updateTimelineKeys();
    this.applyFrame(clip.current);
    const st = anim.stats || {};
    this.ui.setMessage(`アニメーションを読み込みました（カーブ ${num(st.curves ?? clip.curves.length)} 本・`
      + `動くノード ${num(clip.nodes.length)} 個・${clip.start}〜${clip.end} フレーム）`, 6000);
    this.log('info', `animation loaded: ${clip.curves.length} curves, ${clip.nodes.length} nodes`);
    return true;
  }

  /** フレーム f の姿勢にする（ポーズ確認の追加分はそのまま上に重ねる） */
  applyFrame(f) {
    if (!this.clip || !this.built) return;
    this.frame = f;
    const mats = this.clip.evaluate(f);
    const mode = this.settings.poseSource;
    for (const [ni, m] of mats) {
      const ud = this.built.nodeObjects[ni].userData;
      ud.fileMatrix.copy(m);
      ud.baseMatrix.copy(poseBaseMatrix(ud, mode));     // バインドポーズではフレームによらない
    }
    for (const ni of this.animTouched) this.pose.apply(ni);
    this.timeline.setFrame(f);
    this.afterPoseChange(this.playing);
  }

  /** タイムラインを操作したとき。バインドポーズの表示中なら「ファイルの値」に切り替える（アニメーションが見えないため） */
  ensureAnimatedPose() {
    if (this.settings.poseSource === 'bind' && hasBindPose(this.built)) {
      this.setSetting('poseSource', 'file');
      this.ui.setMessage('アニメーションを確認するため、姿勢の基準を「ファイルの値」に切り替えました', 6000);
    }
  }

  scrubTo(f) {
    if (!this.clip) return;
    this.pause();
    this.ensureAnimatedPose();
    this.applyFrame(f);
  }

  stepFrame(d) {
    if (!this.clip) return;
    this.scrubTo(this.clip.wrap(Math.round(this.frame) + d));
  }

  /** 前・次のキー（選択ノードにキーがあればそのノードのキー、なければすべてのキー） */
  stepKey(d) {
    if (!this.clip) return;
    const times = this.keyTimesForSelection();
    const eps = 1e-6;
    const t = d > 0 ? times.find((x) => x > this.frame + eps) : [...times].reverse().find((x) => x < this.frame - eps);
    if (t !== undefined) this.scrubTo(t);
    else this.ui.setMessage(d > 0 ? 'これより後のキーはありません' : 'これより前のキーはありません');
  }

  goToEdge(d) {
    if (this.clip) this.scrubTo(d < 0 ? this.clip.start : this.clip.end);
  }

  setPlaybackRange(start, end) {
    if (!this.clip) return;
    if (!(Number.isFinite(start) && Number.isFinite(end))) { this.timeline.setRange(this.clip.start, this.clip.end); return; }
    if (end < start) [start, end] = [end, start];
    this.clip.start = start;
    this.clip.end = end;
    this.timeline.setRange(start, end);
    if (this.frame < start || this.frame > end) this.scrubTo(Math.min(Math.max(this.frame, start), end));
  }

  togglePlay() { if (this.playing) this.pause(); else this.play(); }

  /** 再生（実時間。間に合わないときはフレームを飛ばす。範囲の最後まで行くと先頭に戻る） */
  play() {
    if (!this.clip || this.playing) return;
    this.ensureAnimatedPose();
    this.endPoseEdit();
    const from = this.frame >= this.clip.start && this.frame <= this.clip.end ? Math.round(this.frame) : this.clip.start;
    this.playing = true;
    this.timeline.setPlaying(true);
    const t0 = performance.now();
    const tick = (now) => {
      if (!this.playing || !this.clip) return;
      const f = this.clip.wrap(from + Math.floor(((now - t0) / 1000) * this.clip.fps));
      if (f !== this.frame) this.applyFrame(f);
      this.playHandle = requestAnimationFrame(tick);
    };
    this.playHandle = requestAnimationFrame(tick);
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    cancelAnimationFrame(this.playHandle);
    this.timeline.setPlaying(false);
    // 再生中は省いていた、パネルの情報を更新する
    if (this.built) this.afterPoseChange();
  }

  keyTimesForSelection() {
    if (!this.clip) return [];
    const own = this.selected >= 0 ? this.clip.keyTimes(this.selected) : [];
    return own.length ? own : this.clip.keyTimes();
  }

  updateTimelineKeys() {
    if (!this.clip) return;
    const own = this.selected >= 0 && this.clip.keyTimes(this.selected).length;
    this.timeline.setKeys(this.keyTimesForSelection(),
      own ? `${this.data.nodes[this.selected].name} のキー` : 'すべてのキー');
  }

  select(ni, opts = {}) {
    if (!this.built || ni < 0 || ni >= this.data.nodes.length) return;
    this.selected = ni;
    this.overlay.setSelected(ni);
    this.ui.highlightNode(ni, this.data.nodes);
    this.ui.showNodeInfo(this.nodeInfo(ni));
    this.ui.showPoseFor(ni, this.pose.get(ni));
    this.updateGizmo();
    if (this.settings.weightMode === 'selected') this.applyWeights();
    this.updateTimelineKeys();
    if (opts.notify && this.bridge && this.bridge.nodeSelected) this.bridge.nodeSelected(this.data.nodes[ni].path);
    this.requestRender();
  }

  selectMesh(mi) {
    if (!this.built) return;
    this.select(this.built.meshes[mi].transform, { notify: true });
  }

  selectByPath(path) {
    if (!this.data) return false;
    const nodes = this.data.nodes;
    let ni = nodes.findIndex((n) => n.path === path);
    if (ni < 0) ni = nodes.findIndex((n) => n.path.endsWith('|' + path.replace(/^\|/, '')) || n.name === path);
    if (ni < 0) {
      const mi = this.data.meshes.findIndex((m) => m.path === path || m.name === path);
      if (mi >= 0) ni = this.data.meshes[mi].transform;
    }
    if (ni < 0) return false;
    this.select(ni, { notify: false });
    return true;
  }

  clearSelection() {
    if (!this.built) return;
    this.selected = -1;
    this.picked = null;
    this.marker.visible = false;
    this.overlay.setSelected(-1);
    this.ui.highlightNode(-1, this.data.nodes);
    this.ui.showNodeInfo(null);
    this.ui.showVertexInfo(null);
    this.ui.showPoseFor(-1);
    this.updateGizmo();
    if (this.settings.weightMode === 'selected') this.applyWeights();
    this.updateTimelineKeys();
    this.requestRender();
  }

  nodeInfo(ni) {
    const n = this.data.nodes[ni];
    const obj = this.built.nodeObjects[ni];
    const usage = (this.built.influenceUsage.get(ni) || []).map((u) => {
      const e = this.built.meshes[u.mesh];
      return { meshName: e.name, count: e.skin.stats.affected[u.slot], total: e.vertexCount };
    });
    const meshes = this.built.meshes.filter((e) => e.transform === ni).map((e) => ({
      name: e.name, vertices: e.vertexCount, faces: e.data.counts.length,
      cluster: e.data.skin ? e.data.skin.cluster : '', skin: e.skin ? e.skin.stats : null,
      normalizeSetting: e.data.skin ? (e.data.skin.normalize ?? 1) : null,
      normalized: e.skin ? e.skin.normalize : false,
    }));
    return {
      node: n,
      worldPos: _v.setFromMatrixPosition(obj.matrixWorld).toArray(),
      usage, meshes, posed: this.pose.has(ni),
      hiddenSelf: !!(this.hidden && this.hidden.has(ni)),
      hiddenByParent: !!(this.hiddenEff && this.hiddenEff[ni] && !(this.hidden && this.hidden.has(ni))),
      bindSource: n.bindSource || null,
      usingBind: this.settings.poseSource === 'bind' && !!n.bindMatrix,
      drivenBy: n.drivenBy || null,
      animChannels: this.clip ? this.clip.channelsOf(ni) : [],
      animValues: this.clip ? this.clip.valuesOf(ni) : null,
      frame: this.frame,
    };
  }

  pick(ev) {
    if (!this.built) return;
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new Vector2(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    if (this.settings.joints) {
      const ni = this.overlay.pick(this.raycaster);
      if (ni >= 0) { this.select(ni, { notify: true }); return; }
    }
    const useSkin = this.settings.skin;
    if (this.poseDirty) {
      for (const e of this.built.meshes) if (e.skinned) { e.skinned.boundingSphere = null; e.skinned.boundingBox = null; }
      this.poseDirty = false;
    }
    const targets = [];
    for (const e of this.built.meshes) {
      if (!e.visible) continue;
      targets.push(useSkin && e.skinned ? e.skinned : e.staticMesh);
    }
    const hits = this.raycaster.intersectObjects(targets, false);
    if (!hits.length) { this.clearSelection(); return; }
    const h = hits[0];
    const e = this.built.meshes[h.object.userData.meshIndex];
    // face の番号は表示用頂点（UV の継ぎ目で分割）なので、元の頂点番号に戻す
    let best = -1, bestD = Infinity;
    for (const rv of [h.face.a, h.face.b, h.face.c]) {
      const d = renderVertexWorldPosition(e, rv, useSkin, _v2).distanceToSquared(h.point);
      if (d < bestD) { bestD = d; best = originalVertex(e, rv); }
    }
    this.pickVertex(e.index, best);
  }

  pickVertex(mi, v) {
    this.picked = { mesh: mi, vertex: v };
    this.updateMarker();
    this.ui.showVertexInfo(this.vertexInfo());
    this.requestRender();
  }

  vertexInfo() {
    if (!this.picked || !this.built) return null;
    const e = this.built.meshes[this.picked.mesh];
    const v = this.picked.vertex;
    const useSkin = this.settings.skin && !!e.skinned;
    const worldPos = vertexWorldPosition(e, v, useSkin, _v2).toArray();
    const base = { meshName: e.name, vertex: v, worldPos, skinned: !!e.skin };
    if (!e.skin) return base;
    const nodes = this.data.nodes;
    const weights = vertexWeights(e.skin, v).map((w) => {
      const ni = e.data.skin.influences[w.slot];
      return { name: nodes[ni].name, path: nodes[ni].path, nodeIndex: ni, weight: w.weight, effective: w.effective, assigned: !!w.assigned };
    });
    return { ...base, weights, sum: weights.reduce((s, w) => s + w.weight, 0), normalized: e.skin.normalize,
      assigned: weights.some((w) => w.assigned), distribution: e.data.skin.weightDistribution === 1 ? '近傍' : '距離' };
  }

  updateMarker() {
    if (!this.picked || !this.built) { if (this.marker) this.marker.visible = false; return; }
    const e = this.built.meshes[this.picked.mesh];
    vertexWorldPosition(e, this.picked.vertex, this.settings.skin && !!e.skinned, _v2);
    const pos = this.marker.geometry.attributes.position;
    pos.setXYZ(0, _v2.x, _v2.y, _v2.z);
    pos.needsUpdate = true;
    this.marker.visible = true;
  }

  // ------------------------------------------------------------------ ポーズ確認
  /** パネルの入力欄から（{t, r, s}） */
  setPoseForSelected(pose) {
    if (this.selected >= 0) this.setPose(this.selected, pose);
  }

  setPose(ni, pose) {
    if (!this.pose) return;
    this.pose.set(ni, pose);
    this.afterPoseChange();
  }

  resetPose(ni) {
    if (ni < 0 || !this.pose) return;
    this.endPoseEdit();
    this.beginPoseEdit([ni], 'ノードを戻す');
    this.pose.reset(ni);
    this.endPoseEdit();
    this.afterPoseChange();
    this.ui.showPoseFor(ni, identityPose());
  }

  resetAllPoses() {
    if (!this.pose) return;
    this.endPoseEdit();
    this.beginPoseEdit([...this.pose.poses.keys()], 'すべて戻す', true);
    this.pose.resetAll();
    this.endPoseEdit();
    this.afterPoseChange();
    if (this.selected >= 0) this.ui.showPoseFor(this.selected, identityPose());
  }

  // ------------------------------------------------------------------ 元に戻す・やり直し
  snapshotPose(ni) {
    return this.pose && this.pose.has(ni) ? this.pose.get(ni) : null;
  }

  /** 操作の記録を始める（すでに記録中なら何もしない）。終わったら endPoseEdit() */
  beginPoseEdit(nodes, label, noNodeName = false) {
    if (this.edit || !this.pose) return;
    nodes = nodes.filter((ni) => ni >= 0);
    if (!nodes.length) return;
    const name = !noNodeName && nodes.length === 1 && this.data ? `（${this.data.nodes[nodes[0]].name}）` : '';
    this.edit = { label: label + name, nodes, before: nodes.map((ni) => [ni, this.snapshotPose(ni)]) };
  }

  endPoseEdit() {
    const e = this.edit;
    if (!e) return;
    this.edit = null;
    const after = e.nodes.map((ni) => [ni, this.snapshotPose(ni)]);
    if (!sameChanges(e.before, after)) this.history.push({ label: e.label, before: e.before, after });
  }

  undo() {
    this.endPoseEdit();
    const e = this.history.undo();
    this.ui.setMessage(e ? `元に戻しました: ${e.label}` : '元に戻せる操作はありません');
    return !!e;
  }

  redo() {
    this.endPoseEdit();
    const e = this.history.redo();
    this.ui.setMessage(e ? `やり直しました: ${e.label}` : 'やり直せる操作はありません');
    return !!e;
  }

  /** 履歴の変更一覧（[ノード番号, 姿勢 or null]）を適用する */
  applyPoseChanges(changes) {
    if (!this.pose) return;
    for (const [ni, p] of [...changes].sort((a, b) => a[0] - b[0])) this.pose.set(ni, p || identityPose());
    // 1 つのノードだけの操作なら、そのノードを選択して変化を見やすくする
    if (changes.length === 1 && changes[0][0] !== this.selected) this.select(changes[0][0], { notify: false });
    this.afterPoseChange();
    if (this.selected >= 0) this.ui.showPoseFor(this.selected, this.pose.get(this.selected));
  }

  // ------------------------------------------------------------------ 警告
  onWarningsChanged(list) {
    if (this.bridge && this.bridge.warningsChanged) this.bridge.warningsChanged(JSON.stringify(list));
  }

  /** 警告の一覧を開く（Qt では別ウィンドウ、ブラウザではページ内のダイアログ） */
  showWarnings() {
    if (this.bridge && this.bridge.showWarnings) this.bridge.showWarnings();
    else this.ui.openWarningDialog();
  }

  historyChanged(h) {
    this.ui.setHistoryState(h);
    if (this.bridge && this.bridge.historyChanged) this.bridge.historyChanged(h.canUndo, h.canRedo, h.undoLabel, h.redoLabel);
  }

  /** @param light 再生中など、パネルの情報の更新を省くとき */
  afterPoseChange(light = false) {
    this.built.root.updateMatrixWorld(true);
    this.overlay.update();
    this.poseDirty = true;
    this.updateMarker();
    if (!light && this.picked) this.ui.showVertexInfo(this.vertexInfo());
    if (!light && this.selected >= 0) this.ui.showNodeInfo(this.nodeInfo(this.selected));
    if (!this.gizmoDragging) this.syncGizmo();
    this.requestRender();
  }

  /** 選択と操作モードに合わせてハンドルを付け外しする */
  updateGizmo() {
    if (!this.gizmo) return;
    const tool = this.settings.tool;
    if (!this.built || this.selected < 0 || tool === 'select') {
      this.gizmo.detach();
    } else {
      // 代理オブジェクトを選択ノードの位置に合わせてから付ける
      this.syncGizmo(true);
      this.gizmo.setMode(tool);
      this.gizmo.setSpace(this.settings.space);
      if (this.gizmo.object !== this.poseProxy) this.gizmo.attach(this.poseProxy);
    }
    this.requestRender();
  }

  /** 代理オブジェクトを、選択ノードの基準フレームと現在の追加分に合わせる */
  syncGizmo(force = false) {
    if (!this.gizmo || this.selected < 0 || !this.pose) return;
    if (!force && !this.gizmo.object) return;
    this.built.root.updateMatrixWorld(true);
    this.pose.frameMatrix(this.selected, this.poseFrame.matrix);
    const p = this.pose.get(this.selected);
    this.poseProxy.position.fromArray(p.t);
    poseQuaternion(p, this.poseProxy.quaternion);
    this.poseProxy.scale.fromArray(p.s);
    this.poseFrame.updateMatrixWorld(true);
  }

  /** ハンドルを動かしたとき: 代理オブジェクトの変換を追加分として適用する */
  onGizmoChange() {
    if (this.selected < 0 || !this.pose) return;
    const pr = this.poseProxy;
    const pose = poseFromTransform(pr.position, pr.quaternion, pr.scale);
    // スケールを 0 付近で止めたときは代理オブジェクトにも反映する
    pr.scale.fromArray(pose.s);
    this.pose.set(this.selected, pose);
    this.afterPoseChange();
    this.ui.showPoseFor(this.selected, pose);
  }

  // ------------------------------------------------------------------ カメラ
  frameAll(resetDirection = false) {
    if (!this.built || !this.renderer) return;
    const box = computeBounds(this.built, this.settings.skin);
    this.fit(box.getCenter(new Vector3()), Math.max(box.getSize(_v).length() / 2, 1e-3), resetDirection);
  }

  frameSelection() {
    if (!this.built) return;
    if (this.picked) {
      const e = this.built.meshes[this.picked.mesh];
      const p = vertexWorldPosition(e, this.picked.vertex, this.settings.skin && !!e.skinned, new Vector3());
      this.fit(p, this.sceneRadius * 0.12);
      return;
    }
    if (this.selected < 0) { this.frameAll(); return; }
    // 選択ノード以下のメッシュとジョイントを包む
    const sub = new Set([this.selected]);
    this.data.nodes.forEach((n, i) => { if (sub.has(n.parent)) sub.add(i); });
    const box = new Box3();
    for (const e of this.built.meshes) {
      if (!sub.has(e.transform)) continue;
      const step = Math.max(1, Math.floor(e.vertexCount / 5000));
      for (let v = 0; v < e.vertexCount; v += step) box.expandByPoint(vertexWorldPosition(e, v, this.settings.skin, _v2));
    }
    for (const ni of sub) box.expandByPoint(_v2.setFromMatrixPosition(this.built.nodeObjects[ni].matrixWorld));
    const r = Math.max(box.getSize(_v).length() / 2, this.overlay.radius() * 12, this.sceneRadius * 0.05);
    this.fit(box.getCenter(new Vector3()), r);
  }

  fit(center, radius, resetDirection = false) {
    const cam = this.camera;
    const dir = resetDirection ? new Vector3(1, 0.75, 1) : cam.position.clone().sub(this.controls.target);
    if (dir.lengthSq() < 1e-12) dir.set(1, 0.75, 1);
    dir.normalize();
    const dist = radius / Math.sin((cam.fov * D2R) / 2) * 1.05;
    this.controls.target.copy(center);
    cam.position.copy(center).addScaledVector(dir, dist);
    cam.near = Math.max(dist / 2000, 1e-4);
    cam.far = dist * 50 + radius * 10;
    cam.updateProjectionMatrix();
    this.controls.update();
    this.requestRender();
  }

  stats() {
    if (!this.built) return { loaded: false };
    return {
      loaded: true,
      meshes: this.built.meshes.length,
      vertices: this.built.meshes.reduce((s, e) => s + e.vertexCount, 0),
      triangles: this.built.meshes.reduce((s, e) => s + e.triCount, 0),
      joints: this.built.jointIndices.length,
      selected: this.selected >= 0 ? this.data.nodes[this.selected].path : null,
      posedNodes: this.pose ? this.pose.size : 0,
      textures: this.textureStatusList().map((t, i) => ({ node: this.data.textures[i].node, status: t.status,
        via: t.via || null, hasAlpha: !!t.hasAlpha, size: t.width ? [t.width, t.height] : null, tiles: t.tiles || 0 })),
      gizmoAttached: !!(this.gizmo && this.gizmo.object),
      timing: this.lastTiming || null,
      settings: { ...this.settings },
      webgl: !!this.renderer,
      animation: this.clip ? {
        frame: this.frame, playing: this.playing, start: this.clip.start, end: this.clip.end, fps: this.clip.fps,
        curves: this.clip.curves.length, nodes: this.clip.nodes.length,
      } : null,
    };
  }
}

function niceCeil(x) {
  const p = 10 ** Math.floor(Math.log10(x));
  for (const m of [1, 2, 5, 10]) if (m * p >= x) return m * p;
  return 10 * p;
}

// ---------------------------------------------------------------------- 外部 API
const app = new ViewerApp();

window.mayaViewer = {
  version: VERSION,
  loadScene(data) {
    try {
      const t = performance.now();
      const obj = typeof data === 'string' ? JSON.parse(data) : data;
      app.timing = { ...(app.timing || {}), parse: typeof data === 'string' ? performance.now() - t : 0 };
      return app.loadScene(obj);
    } catch (err) {
      app.sceneLoading = false;
      app.ui.hideLoading();
      app.ui.showError('データを読めませんでした。\n' + err.message);
      return false;
    }
  },
  /** 大きなデータを分割して受け取る（Python の runJavaScript 用） */
  beginTransfer(message) {
    app.transfer = [];
    app.transferStart = performance.now();
    app.ui.showLoading(message || 'データを受け取り中');
    return true;
  },
  appendChunk(text) { if (app.transfer) app.transfer.push(text); return true; },
  endTransfer() {
    const text = app.transfer ? app.transfer.join('') : '';
    app.transfer = null;
    app.sceneLoading = true;            // 組み立てまでに届いたアニメーションは、組み立て後に読み込む
    app.timing = { transfer: performance.now() - (app.transferStart || performance.now()) };
    app.ui.showLoading('シーンを組み立て中');
    setTimeout(() => this.loadScene(text), 16);
    return text.length;
  },
  /** アニメーションを分割して受け取る（シーンのあとに届く） */
  beginAnimationTransfer() { app.transfer = []; return true; },
  endAnimationTransfer() {
    const text = app.transfer ? app.transfer.join('') : '';
    app.transfer = null;
    try {
      return app.setAnimation(JSON.parse(text));
    } catch (err) {
      app.timeline.setStatus('アニメーションを読めませんでした: ' + err.message);
      return false;
    }
  },
  setAnimation(data) { return app.setAnimation(typeof data === 'string' ? JSON.parse(data) : data); },
  /** アニメーションの読み込み状況（空文字で消す） */
  setAnimationStatus(text) {
    // 組み立て待ちのシーンがあれば、いまのアニメーションはこのあと消えるので状況を出す
    app.timeline.setStatus(app.clip && !app.sceneLoading ? '' : text);
    return true;
  },
  setFrame(f) { app.scrubTo(+f); return app.frame; },
  play() { app.play(); },
  pause() { app.pause(); },
  showLoading(text, frac) { app.ui.setEmpty(false); app.ui.showLoading(text, frac); },
  hideLoading() { app.ui.hideLoading(); if (!app.built) app.ui.setEmpty(true); },
  showError(text) { app.ui.hideLoading(); app.ui.showError(text); },
  setMessage(text) { app.ui.setMessage(text); },
  selectByPath(path) { return app.selectByPath(path); },
  clear() { app.clearAll(); return true; },
  getStats() { return app.stats(); },
  /** テクスチャの読み込み状況 */
  getTextureState() { return app.stats().textures; },
  frameAll() { app.frameAll(); },
  undo() { return app.undo(); },
  redo() { return app.redo(); },
  getWarnings() { return (app.ui.warnings || []).slice(); },
  showWarnings() { app.showWarnings(); },
  getHistory() {
    const h = app.history;
    return { canUndo: h.canUndo, canRedo: h.canRedo, undo: h.undoStack.map((e) => e.label), redo: h.redoStack.map((e) => e.label) };
  },
  /** 開発者ツールでの調査用（window.mayaViewer.debug.app） */
  debug: {
    get app() { return app; },
    /** GPU のスキン変形と CPU の計算（Maya の式）を描画結果で比べる */
    checkSkinning(meshIndex = 0, opts = {}) { return compareGpuCpuSkinning(app, meshIndex, opts); },
  },
};
