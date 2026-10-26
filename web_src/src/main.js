// ビューア本体。window.mayaViewer を通じて Python（Qt）から操作される。
import {
  BufferGeometry, Color, DirectionalLight, Float32BufferAttribute, HemisphereLight, LineBasicMaterial, LineSegments, MOUSE,
  Matrix4, Object3D, OrthographicCamera, PerspectiveCamera, Points, PointsMaterial, Quaternion, Raycaster, SRGBColorSpace, Scene,
  Vector2, Vector3, WebGLRenderer, Box3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { PoseState, identityPose, poseFromTransform, poseMatrix, poseQuaternion } from './pose.js';
import {
  applyPoseSource, hasBindPose, poseBaseMatrix, BASE_COLOR, buildScene, computeBounds, disposeScene, originalVertex, renderVertexWorldPosition, validateScene,
  vertexWorldPosition, writeVertexColors,
} from './sceneBuilder.js';
import { base64ToArrayBuffer } from './textures.js';
import { MapManager, usageFor } from './mapManager.js';
import { JointOverlay } from './jointOverlay.js';
import { fillHeatmap, fillInfluenceBlend, fillSolid, vertexWeights } from './weights.js';
import { UI, referenceOf } from './ui.js';
import { connectBridge, isQtHost } from './bridge.js';
import { History, sameChanges } from './history.js';
import { compareGpuCpuSkinning } from './skinCheck.js';
import { AnimationClip, worldRotationDegrees } from './animation.js';
import { RigEvaluator, visibleFrom } from './rig.js';
import { Timeline } from './timeline.js';
import { CurveOverlay } from './curveOverlay.js';
import { CameraIcons, cameraFrustum, cameraParams } from './cameraView.js';
import { SequencerPanel, activeShot, shotStarts, shotTime } from './sequencer.js';

const VERSION = '1.0.0';
const D2R = Math.PI / 180;
const DEFAULTS = {
  shading: 'smooth', wire: false, skin: true, joints: false, xray: true, grid: true,   // 骨は初期状態で非表示（J で切り替え）
  curves: true,                  // NURBS カーブ（コントローラーの形など）
  axes: 'selected', jointSize: 1, weightMode: 'off',
  textures: true, alpha: 'material', alphaStyle: 'cutout',
  poseSource: 'bind',
  lighting: 'standard',          // 'standard' | 'flat'（ライトの影響なし。Maya のフラットライト）
  mapView: 'combined',           // 'combined'（合成）または単独表示するマップの種類
  maps: { normal: true, roughness: false, metalness: false, ao: false, emissive: false, opacity: false },
  normalFlipY: false,            // ノーマルマップの緑を反転（DirectX 形式）
  tool: 'select', space: 'local', gizmoSize: 1,
  cameraIcons: true,             // シーンのカメラの形を描く
  cameraGate: true,              // カメラから見るとき、解像度ゲートの外側を暗くする
  hud: true,                     // ヘッドアップディスプレイ（再生のフレームレート）
  pickMode: 'object',            // クリックで選ぶもの: 'object'（オブジェクト）・'vertex'（頂点とそのウェイト）
  pickAll: false,                // Maya で選択できないもの（テンプレート・リファレンス）もクリックで選ぶ
};
const TOOLS = ['select', 'translate', 'rotate', 'scale'];
const num = (n) => n.toLocaleString('ja-JP');


const _v = new Vector3();
const _v2 = new Vector3();
const _q = new Quaternion();

class ViewerApp {
  constructor() {
    this.settings = { ...DEFAULTS };
    this.data = null;
    this.built = null;
    this.selected = -1;
    this.selectedMesh = -1;     // 階層のメッシュの行から選んだメッシュ（なければ -1）
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
    this.poseSourceChosen = false;  // 読み込んでから、姿勢の基準を自分で切り替えたか（アニメーションの読み込みで自動で切り替えない）
    this.cameras = [];              // シーンのカメラ（共通 JSON の cameras）
    this.viewCamera = -1;           // いま見ているカメラ（-1 は自由視点）
    this.camEdit = null;            // 停止中にカメラのビューを動かしたとき { ci, frame }（フレームが変わると戻す）
    this.freeTarget = null;         // カメラから見ている間の、自由視点の注視点（戻すときに使う）
    this.cameraProps = new Map();   // カメラの番号 → アニメーション・リグで決まる属性の値（焦点距離など）
    this.sequence = null;           // カメラシーケンサ（共通 JSON の sequencer）
    this.seqFrame = 0;              // シーケンスのフレーム
    this.seqFollow = false;         // ビューポートをシーケンス（ショットのカメラとフレーム）で表示するか
    this.seqPlaying = false;
    this.fpsMeter = null;           // 再生のフレームレートの計測（startFpsMeter）
    this.ui = new UI(this);
    this.timeline = new Timeline(this);
    this.seqPanel = new SequencerPanel(this);
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
    this.keyLight = key;
    // シーンのカメラから見るときの視点（透視投影・平行投影）。投影はカメラの属性から毎回作る
    this.viewPersp = new PerspectiveCamera();
    this.viewOrtho = new OrthographicCamera();
    this.scene.add(this.viewPersp, this.viewOrtho);
    this.cameraIcons = new CameraIcons();

    this.grid = null;
    this.updateGrid(new Box3(new Vector3(-10, 0, -10), new Vector3(10, 10, 10)));

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.DOLLY };
    this.controls.screenSpacePanning = true;
    // 慣性なし: ドラッグを離した時点でカメラを止める（three.js の既定値と同じだが明示しておく）
    this.controls.enableDamping = false;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', () => { this.beginCameraEdit(); this.requestRender(); });
    this.controls.addEventListener('start', () => this.prepareCameraEdit());   // カメラのビューの操作を始めた

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
      this.controls.enabled = !e.value && this.canNavigate();
      // 1 回のドラッグを 1 つの操作として記録する
      if (e.value) this.beginPoseEdit([this.selected], { translate: '移動', rotate: '回転', scale: 'スケール' }[this.gizmo.mode] || '変更');
      else { this.endPoseEdit(); this.syncGizmo(); }
    });
    this.gizmo.addEventListener('objectChange', () => this.onGizmoChange());
    this.scene.add(this.gizmo);

    this.overlay = new JointOverlay();
    this.curves = new CurveOverlay();
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
    if (!this.renderer) return;
    if (this.viewCamera >= 0) this.syncViewCamera();
    this.renderer.render(this.scene, this.activeCamera());
  }

  /** 描画・ピックに使うカメラ（シーンのカメラから見ているときはその視点） */
  activeCamera() {
    if (this.viewCamera < 0) return this.camera;
    const cam = this.cameras[this.viewCamera];
    return cam && cam.orthographic ? this.viewOrtho : this.viewPersp;
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
      if (e.altKey && !e.ctrlKey && !e.metaKey && this.hasTimeline) {
        // Maya と同じ: Alt+V = 再生／停止、Alt+, / Alt+. = 前／次のフレーム（記号はキーの位置で判定）
        if (e.code === 'KeyV') this.togglePlay();
        else if (e.code === 'Comma') this.stepFrame(-1);
        else if (e.code === 'Period') this.stepFrame(1);
        else return;
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (this.hasTimeline && (k === ',' || k === '.' || k === 'home' || k === 'end')) {
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
      else if (k === 'b') this.togglePoseSource();
      else if (k === 'f8') set('pickMode', this.settings.pickMode === 'vertex' ? 'object' : 'vertex');   // Maya と同じ: F8
      else if (k === 'c') {
        if (!this.cameras.length) this.ui.setMessage('このシーンにはカメラがありません');
        else this.setCamera(e.shiftKey ? -1 : this.nextCamera());
      }
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
      this.poseSourceChosen = false;
      applyPoseSource(built, this.settings.poseSource);
      this.pose.reapplyAll();
      built.root.updateMatrixWorld(true);
      this.curves.build(built, data.curves);
      this.initVisibility();
      mark('姿勢');
      const bounds = computeBounds(built, true);
      this.sceneRadius = Math.max(bounds.getSize(_v).length() / 2, 1e-3);
      mark('範囲');
      this.overlay.build(built, data.nodes, this.sceneRadius);
      this.cameras = data.cameras || [];
      this.cameraIcons.build(built, this.cameras, Math.max(this.sceneRadius * 0.3, 1));
      this.ui.setCameras(this.cameras);
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
      const nCurves = this.curves.items.filter(Boolean).length;
      this.ui.setStats(`メッシュ ${num(built.meshes.length)} ・ 頂点 ${num(verts)} ・ 三角形 ${num(tris)} ・ ジョイント ${num(built.jointIndices.length)}`
        + (nCurves ? ` ・ カーブ ${num(nCurves)}` : '') + (this.cameras.length ? ` ・ カメラ ${num(this.cameras.length)}` : ''));
      this.ui.setEmpty(false);
      this.ui.hideError();
      this.ui.hideLoading();
      this.ui.showNodeInfo(null);
      this.ui.showVertexInfo(null);
      this.ui.showPoseFor(-1);
      this.frameAll(true);
      // 保存したときに Maya のビューで見ていたカメラから表示する（persp などの起動時のカメラなら自由視点）
      const vc = data.viewCamera ?? -1;
      if (vc >= 0 && vc < this.cameras.length) this.setCamera(vc, { quiet: true });
      this.sequence = data.sequencer && (data.sequencer.shots || []).length ? data.sequencer : null;
      this.seqFrame = this.sequence ? this.sequence.start : 0;
      this.seqFollow = false;
      this.seqPanel.build(this.sequence, this.cameras);
      this.updateSequencePanel();
      this.fpsMeter = null;
      this.updateHud();
      this.maps.reset(data);
      this.requestMaps();
      mark('マテリアル');
      const renderStart = performance.now();
      this.ui.setMessage(`読み込みました（${Math.round(performance.now() - t0)} ms）`
        + (this.viewCamera >= 0 ? `。Maya のビューと同じく、カメラ ${this.cameras[this.viewCamera].name} から表示しています（Shift+C で自由視点）` : ''), 6000);
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
      this.updateToolbarHints();
      return true;
    } catch (err) {
      this.ui.hideLoading();
      this.ui.showError('シーンを表示できませんでした。\n' + (err && err.message || err));
      this.log('error', err && err.stack || err);
      return false;
    }
  }

  clearScene() {
    this.pauseSequence();
    this.sequence = null;
    this.seqFollow = false;
    if (this.seqPanel) this.seqPanel.build(null, []);
    this.setCamera(-1, { quiet: true });
    this.cameraIcons.clear();
    this.cameras = [];
    this.cameraProps = new Map();
    this.textureToken = (this.textureToken || 0) + 1;   // 読み込み中のテクスチャを無効にする
    if (this.maps) this.maps.reset(null);
    if (this.built) disposeScene(this.built);
    this.built = null;
    this.data = null;
    this.overlay.clear();
    this.curves.clear();
    if (this.gizmo) this.gizmo.detach();
    this.pose = null;
    this.edit = null;
    this.history.clear();
    this.selected = -1;
    this.selectedMesh = -1;     // 階層のメッシュの行から選んだメッシュ（なければ -1）
    this.picked = null;
    if (this.marker) this.marker.visible = false;
    this.pause();
    this.clip = null;
    this.rig = null;
    this.rigCurves = null;
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
    this.ui.setCameras([]);
    this.updateHud();
    this.updateToolbarHints();
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
    this.grid = makeGrid(size, 20);
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
    this.updateToolbarHints();
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
      case 'cameraIcons': this.updateCameraIcons(); break;
      case 'hud': this.updateHud(); break;
      case 'pickMode':
        if (value !== 'vertex' && this.picked) { this.picked = null; this.marker.visible = false; }
        this.ui.showVertexInfo(this.vertexInfo(), value);
        break;
      case 'cameraGate': this.updateGate(); break;
      case 'curves': this.curves.setVisible(value); break;
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
    this.curves.setVisible(st.curves);
    this.overlay.setXray(st.xray);
    this.overlay.setAxesMode(st.axes);
    this.overlay.setSize(st.jointSize);
    this.applyShading();
    this.applyWeights();
    this.requestRender();
  }

  applyShading() {
    const st = this.settings;
    // 選択したノードとその子孫のメッシュは、選択の色のワイヤーを重ねる（Maya の選択の表示）
    const sel = new Set();
    if (this.selected >= 0 && this.data) {
      sel.add(this.selected);
      this.data.nodes.forEach((n, i) => { if (sel.has(n.parent)) sel.add(i); });
    }
    const weightWire = st.weightMode !== 'off' && st.shading === 'none';
    for (const e of this.built.meshes) {
      const useSkin = st.skin && !!e.skinned;
      const shaded = e.visible && st.shading !== 'none';
      const highlight = e.visible && sel.has(e.transform) && !weightWire;
      const wire = e.visible && (st.wire || st.shading === 'none' || highlight);
      e.staticMesh.visible = shaded && !useSkin;
      if (e.skinned) e.skinned.visible = shaded && useSkin;
      e.staticWire.visible = wire && !useSkin;
      if (e.skinnedWire) e.skinnedWire.visible = wire && useSkin;
      const wireOnly = st.shading === 'none';
      e.wireMaterial.opacity = highlight ? 0.9 : wireOnly ? 0.95 : 0.5;
      e.wireMaterial.color.set(highlight ? 0xf2a93b : wireOnly ? 0xc8d2da : 0x1d2024);
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
        this.showTextureState();
        if (errors.length) this.ui.addWarnings(errors);
        this.ui.setMessage(`テクスチャ ${total} 枚を読み込みました`);
        this.log('info', `textures loaded: ${total}`);
      } else {
        this.ui.setMessage(`テクスチャを読み込み中（${done} / ${total}）`, 0);
      }
    }, (key, s) => errors.push(`${s.info.node}: テクスチャを読み込めませんでした（${s.resolved}）: ${s.message}`));
    if (started) this.ui.setMessage(`テクスチャを読み込み中（0 / ${started}）`, 0);
    this.showTextureState();
    this.applyMaterials();
  }

  /** テクスチャの読み込み状況を、選択情報のメッシュの欄に反映する */
  showTextureState() {
    this.ui.setTextureState(this.textureStatusList());
    if (this.selected >= 0) this.ui.showNodeInfo(this.nodeInfo(this.selected));
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
    this.rigHidden = new Set();     // リグ（接続・カーブ）で決まる表示が、いまのフレームで非表示のノード
    this.rigShown = new Set();      // そのうち、目のアイコンなどで表示し直したノード（リグより優先）
    this.data.nodes.forEach((n, i) => { if (n.visible === false) this.hidden.add(i); });
    for (const e of this.built.meshes) {
      e.selfVisible = e.data.visibleSelf !== undefined ? e.data.visibleSelf !== false : e.data.visible !== false;
      e.rigHidden = false;
      e.rigShown = false;
    }
    this.computeVisibility();
  }

  /** ノード自身が非表示か（目のアイコンの状態。リグで隠れている場合も含む） */
  isNodeHidden(ni) {
    return this.hidden.has(ni) || (this.rigHidden.has(ni) && !this.rigShown.has(ni));
  }

  /** メッシュ自身が表示されるか（親の表示状態は含まない） */
  isMeshShown(mi) {
    const e = this.built.meshes[mi];
    return e.selfVisible && !(e.rigHidden && !e.rigShown);
  }

  /** 親を含めた実際の表示状態（Maya と同じく、親が非表示なら子も非表示） */
  computeVisibility() {
    const nodes = this.data.nodes;
    const eff = new Array(nodes.length).fill(false);
    nodes.forEach((n, i) => { eff[i] = this.isNodeHidden(i) || (n.parent >= 0 && eff[n.parent]); });
    this.hiddenEff = eff;
    this.built.meshes.forEach((e, mi) => { e.visible = this.isMeshShown(mi) && !eff[e.transform]; });
  }

  /** アニメーション・リグで決まる表示（animation.props の .v など）を、いまのフレームの値にする。変わったら true */
  applyRigVisibility(props) {
    let changed = false;
    for (const p of props) {
      if (p.kind !== 'node' && p.kind !== 'mesh') continue;
      const st = p.static || {};
      const hide = !!st.layerHidden || !visibleFrom({ ...st, ...p.values });
      if (p.kind === 'node') {
        if (hide !== this.rigHidden.has(p.index)) { changed = true; if (hide) this.rigHidden.add(p.index); else this.rigHidden.delete(p.index); }
      } else {
        const e = this.built.meshes[p.index];
        if (e && e.rigHidden !== hide) { changed = true; e.rigHidden = hide; }
      }
    }
    return changed;
  }

  updateVisibility() {
    if (!this.built) return;
    this.computeVisibility();
    this.overlay.setHiddenNodes(this.hiddenEff);
    this.curves.setHiddenNodes(this.hiddenEff);
    this.ui.updateVisibilityMarks(this);
    this.updateCameraIcons();
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
    if (visible) {
      this.hidden.delete(ni);
      if (this.rigHidden.has(ni)) this.rigShown.add(ni);    // リグで隠れていても表示する
    } else {
      this.hidden.add(ni);
      this.rigShown.delete(ni);
    }
    this.updateVisibility();
    this.ui.setMessage(`${visible ? '表示' : '非表示に'}しました: ${this.data.nodes[ni].name}`);
  }

  toggleNodeVisible(ni) {
    if (ni >= 0 && this.hidden) this.setNodeVisible(ni, this.isNodeHidden(ni));
  }

  setMeshVisible(mi, v) {
    if (!this.built) return;
    const e = this.built.meshes[mi];
    e.selfVisible = v;
    e.rigShown = v && e.rigHidden;                          // リグで隠れていても表示する
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
    // 前のアニメーションで決めた表示・カメラの値を捨てる（このあとの applyFrame で評価し直す）
    this.rigHidden.clear();
    this.rigShown.clear();
    for (const e of this.built.meshes) { e.rigHidden = false; e.rigShown = false; }
    this.cameraProps = new Map();
    this.updateVisibility();
    // リグ（コンストレイント・IK・計算ノード）を含めて評価する（上で作成）。動かないノードはファイルの値
    // 姿勢の基準が変わったときに子のスケール補正も掛け直すよう、動くノードとその子を覚えておく
    this.rig = new RigEvaluator(clip, this.data.nodes, (ni) => this.built.nodeObjects[ni].userData.fileMatrix);
    const touched = new Set();
    for (const ni of this.rig.moving) {
      touched.add(ni);
      for (const c of this.built.childrenOf[ni]) touched.add(c);
    }
    this.animTouched = [...touched].sort((a, b) => a - b);
    // 保存時の値は、保存したときのフレーム（time1）の値（カーブで決まる値は .ma に残っていないため）。
    // バインドポーズの表示で、バインドポーズの情報がないノードに使う
    for (const [ni, m] of this.rig.evaluate(clip.current, () => null, new Map())) {
      this.built.nodeObjects[ni].userData.savedMatrix.copy(m);
    }
    const warnings = clip.warnings.concat([...this.rig.problems].map((p) => `アニメーション: リグの評価を打ち切りました（${p}）。`));
    if (warnings.length) this.ui.setWarnings((this.ui.warnings || []).concat(warnings));
    // 推定・不明のノードをジョイントの表示で色分けする
    this.overlay.setStatus(this.rig.fallback.size || this.rig.tainted.size ? (ni) => this.rig.statusOf(ni) : null);
    // コントローラー（ジョイント・メッシュ以外でリグを動かすノード）の目印
    const meshNodes = new Set(this.built.meshes.map((e) => e.transform));
    // （カーブの形を持つコントローラーは、カーブそのものが見えるので目印を出さない）
    this.overlay.setControllers([...this.rig.directDrivers].filter((ni) => this.data.nodes[ni].type !== 'joint'
      && !meshNodes.has(ni) && !this.curves.hasCurve(ni)).sort((a, b) => a - b));
    // リグで形が変わるカーブ（skinCluster・制御点の接続）: 共通 JSON の curves の番号 → グラフの id
    this.rigCurves = (anim.graph || []).filter((g) => g.type === 'nurbsCurve' && g.shape >= 0).map((g) => [g.shape, g.id]);
    // キーがなくリグだけのときは、タイムラインは出さずに評価だけする（ポーズ確認でコントローラーを動かせる）
    if (!this.hasTimeline) this.timeline.setStatus('');
    this.timeline.setClip(this.hasTimeline ? clip : null);
    this.updateTimelineKeys();
    // キーのあるアニメーションは「ファイルの値」で見る（バインドポーズのままではアニメーションが見えないため）。
    // 読み込みのあとで自分でバインドポーズを選んでいたら、そのままにする
    const switched = this.hasTimeline && !this.poseSourceChosen && this.settings.poseSource === 'bind' && hasBindPose(this.built);
    if (switched) this.setSetting('poseSource', 'file');
    this.applyFrame(clip.current);
    if (this.seqFollow) this.applySequence();
    this.fpsMeter = null;
    this.updateHud();
    this.updateToolbarHints();
    const st = anim.stats || {};
    this.ui.setMessage(`アニメーションを読み込みました（カーブ ${num(st.curves ?? clip.curves.length)} 本・`
      + `動くノード ${num(this.rig.moving.size)} 個・${clip.start}〜${clip.end} フレーム）`
      + (switched ? '。姿勢の基準を「ファイルの値」に切り替えました（B でバインドポーズ）' : ''), 6000);
    this.log('info', `animation loaded: ${clip.curves.length} curves, ${clip.nodes.length} nodes`);
    return true;
  }

  /** 現在のフレームの、リグ（カーブ・コンストレイント・IK）を評価した値 { t, r, s }（動かないノードは null） */
  rigValues(ni) {
    const c = this.rig.rest(ni) ? this.rig.chan(ni) : null;
    return c ? { t: c.t.slice(), r: c.r.slice(), s: c.s.slice() } : null;
  }

  /**
   * 保存時のフレームの再現チェック（IK の解き方が Maya と合っているか）。表示は変えない。
   * 戻り値は RigEvaluator.verifySaved() の一覧に frame を足したもの（アニメーションがなければ null）
   */
  verifyRig() {
    if (!this.rig || !this.clip) return null;
    this.rig.evaluate(this.clip.current, () => null, new Map());
    // ファイルに書かれた回転（Maya の答え）と比べる。表示用の行列（nodes の matrix）は、移動などが接続で決まる
    // ノードではバインドポーズ・既定値に置き換えてあるので使わない
    const list = this.rig.verifySaved((ni) => this.rig.fileRestLocal(ni));
    this.applyFrame(this.frame);                       // 表示中のフレームの評価に戻す
    return { frame: this.clip.current, handles: list };
  }

  /** タイムラインを出すか（キーのあるカーブか、frame・time を使う expression があるとき） */
  get hasTimeline() { return !!(this.clip && (this.clip.timeCurves.length || (this.rig && (this.rig.usesTime || this.rig.hasTrax)))); }

  /** フレーム f の姿勢にする（ポーズ確認の追加分はそのまま上に重ねる。リグはポーズ確認の結果も使って評価する） */
  applyFrame(f, light = this.playing) {
    if (!this.clip || !this.built) return;
    if (this.camEdit && f !== this.camEdit.frame) this.endCameraEdit();   // 動かしたカメラの視点は、フレームが変わると戻す
    this.frame = f;
    const poseOf = (ni) => (this.pose && this.pose.has(ni) ? poseMatrix(this.pose.get(ni), new Matrix4()) : null);
    const mats = this.rig.evaluate(f, poseOf);
    const mode = this.settings.poseSource;
    const sceneHasBind = hasBindPose(this.built);
    for (const [ni, m] of mats) {
      const ud = this.built.nodeObjects[ni].userData;
      ud.fileMatrix.copy(m);
      ud.baseMatrix.copy(poseBaseMatrix(ud, mode, sceneHasBind));     // バインドポーズではフレームによらない
    }
    for (const ni of this.animTouched) this.pose.apply(ni);
    // カーブの形（バインドポーズの表示では変形前の形）
    const bindView = mode === 'bind' && sceneHasBind;
    for (const [ci, gid] of this.rigCurves || []) this.curves.setShape(ci, bindView ? null : this.rig.plug(gid, 'local'));
    // 表示（.v など）・カメラの焦点距離などの、接続で決まる値（姿勢の基準によらず、いまのフレームの値）
    if (this.rig.props.length) {
      const props = this.rig.evaluateProps();
      for (const p of props) if (p.kind === 'camera') this.cameraProps.set(p.index, p.values);
      if (this.applyRigVisibility(props)) this.updateVisibility();
    }
    this.timeline.setFrame(f);
    this.rigBusy = true;
    try { this.afterPoseChange(light); } finally { this.rigBusy = false; }
  }

  /** 姿勢の基準（バインドポーズ／ファイルの値）を切り替える（ツールバーのボタン・B キー） */
  togglePoseSource() {
    this.setPoseSource(this.settings.poseSource === 'bind' ? 'file' : 'bind');
  }

  setPoseSource(mode) {
    this.poseSourceChosen = true;
    this.setSetting('poseSource', mode);
    if (this.built && !hasBindPose(this.built)) this.ui.setMessage('このシーンにはバインドポーズの情報がありません（ファイルの値で表示します）');
    else this.ui.setMessage(mode === 'bind' ? 'バインドポーズで表示します' : 'ファイルの値（アニメーションのフレームの姿勢）で表示します');
  }

  /** タイムラインを操作したとき。バインドポーズの表示中なら「ファイルの値」に切り替える（アニメーションが見えないため） */
  ensureAnimatedPose() {
    if (this.settings.poseSource === 'bind' && hasBindPose(this.built)) {
      this.setSetting('poseSource', 'file');
      this.ui.setMessage('アニメーションを確認するため、姿勢の基準を「ファイルの値」に切り替えました', 6000);
    }
  }

  scrubTo(f) {
    if (!this.hasTimeline) return;
    if (this.seqFollow) this.setSequenceFollow(false);   // シーンのタイムラインを操作した
    this.pauseSequence();
    this.pause();
    this.ensureAnimatedPose();
    this.applyFrame(f);
  }

  stepFrame(d) {
    if (!this.hasTimeline) return;
    this.scrubTo(this.clip.wrap(Math.round(this.frame) + d));
  }

  /** 前・次のキー（選択ノードにキーがあればそのノードのキー、なければすべてのキー） */
  stepKey(d) {
    if (!this.hasTimeline) return;
    const times = this.keyTimesForSelection();
    const eps = 1e-6;
    const t = d > 0 ? times.find((x) => x > this.frame + eps) : [...times].reverse().find((x) => x < this.frame - eps);
    if (t !== undefined) this.scrubTo(t);
    else this.ui.setMessage(d > 0 ? 'これより後のキーはありません' : 'これより前のキーはありません');
  }

  goToEdge(d) {
    if (this.hasTimeline) this.scrubTo(d < 0 ? this.clip.start : this.clip.end);
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

  /** 再生／停止（下部の再生ボタン・Alt+V）。シーケンスの再生中は、シーンの再生に切り替えずにシーケンスを止める */
  togglePlay() {
    if (this.seqPlaying) this.pauseSequence();
    else if (this.playing) this.pause();
    else this.play();
  }

  /** 下部の再生ボタンの表示（シーケンスの再生中もシーンのフレームが進むので、停止のボタンにする） */
  updatePlayButton() { this.timeline.setPlaying(this.playing || this.seqPlaying); }

  /** 再生（実時間。間に合わないときはフレームを飛ばす。範囲の最後まで行くと先頭に戻る） */
  play() {
    if (!this.hasTimeline || this.playing) return;
    this.pauseSequence();
    if (this.seqFollow) this.setSequenceFollow(false);
    this.ensureAnimatedPose();
    this.endPoseEdit();
    const from = this.frame >= this.clip.start && this.frame <= this.clip.end ? Math.round(this.frame) : this.clip.start;
    this.endCameraEdit();
    this.playing = true;
    this.updateNavigation();
    this.updatePlayButton();
    const t0 = performance.now();
    this.startFpsMeter(this.clip.fps);
    const tick = (now) => {
      if (!this.playing || !this.clip) return;
      // requestAnimationFrame の時刻は t0 より前のことがある（そのまま使うと 1 フレーム前に戻る）
      const f = this.clip.wrap(from + Math.floor((Math.max(now - t0, 0) / 1000) * this.clip.fps));
      if (f !== this.frame) { this.applyFrame(f); this.countShownFrame(now); }
      this.playHandle = requestAnimationFrame(tick);
    };
    this.playHandle = requestAnimationFrame(tick);
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    cancelAnimationFrame(this.playHandle);
    this.updateNavigation();
    this.stopFpsMeter();
    this.updatePlayButton();
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

  /** ノードを選ぶ。opts.mesh: 階層のメッシュの行から選んだときのメッシュの番号（その行を強調する） */
  select(ni, opts = {}) {
    if (!this.built || ni < 0 || ni >= this.data.nodes.length) return;
    this.selected = ni;
    this.selectedMesh = opts.mesh ?? -1;
    this.overlay.setSelected(ni);
    this.curves.setSelected(ni);
    this.updateCameraIcons();
    this.applyShading();
    this.ui.highlightNode(ni, this.data.nodes, this.selectedMesh);
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
    this.select(this.built.meshes[mi].transform, { notify: true, mesh: mi });
  }

  selectByPath(path) {
    if (!this.data) return false;
    const nodes = this.data.nodes;
    let ni = nodes.findIndex((n) => n.path === path);
    if (ni < 0) ni = nodes.findIndex((n) => n.path.endsWith('|' + path.replace(/^\|/, '')) || n.name === path);
    let mesh = -1;
    if (ni < 0) {
      mesh = this.data.meshes.findIndex((m) => m.path === path || m.name === path);
      if (mesh >= 0) ni = this.data.meshes[mesh].transform;
    }
    if (ni < 0) return false;
    this.select(ni, { notify: false, mesh });
    return true;
  }

  clearSelection() {
    if (!this.built) return;
    this.selected = -1;
    this.selectedMesh = -1;     // 階層のメッシュの行から選んだメッシュ（なければ -1）
    this.picked = null;
    this.marker.visible = false;
    this.overlay.setSelected(-1);
    this.curves.setSelected(-1);
    this.updateCameraIcons();
    this.applyShading();
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
      index: e.index, selected: e.index === this.selectedMesh,
      name: e.name, vertices: e.vertexCount, faces: e.data.counts.length,
      cluster: e.data.skin ? e.data.skin.cluster : '', skin: e.skin ? e.skin.stats : null,
      normalizeSetting: e.data.skin ? (e.data.skin.normalize ?? 1) : null,
      normalized: e.skin ? e.skin.normalize : false,
    }));
    // このノードがカメラの transform なら、いまのフレームの値（キー・リグで決まる焦点距離など）
    const cameras = [];
    this.cameras.forEach((cam, ci) => {
      if (cam.transform !== ni) return;
      const over = this.cameraProps.get(ci);
      cameras.push({ index: ci, cam, p: cameraParams(cam, over), animated: over ? Object.keys(over) : [],
        viewing: ci === this.viewCamera, render: this.data.render });
    });
    return {
      node: n,
      worldPos: _v.setFromMatrixPosition(obj.matrixWorld).toArray(),
      worldRot: worldRotationDegrees(obj.matrixWorld, (n.attrs && n.attrs.ro) || 0),
      usage, meshes, cameras, posed: this.pose.has(ni),
      hiddenSelf: !!(this.hidden && this.isNodeHidden(ni)),
      hiddenByRig: !!(this.rigHidden && this.rigHidden.has(ni) && !this.rigShown.has(ni) && !this.hidden.has(ni)),
      hiddenByParent: !!(this.hiddenEff && this.hiddenEff[ni] && !(this.hidden && this.isNodeHidden(ni))),
      bindSource: n.bindSource || null,
      unselectable: n.unselectable || null,
      reference: referenceOf(this.data, n.name),
      usingBind: this.settings.poseSource === 'bind' && !!n.bindMatrix,
      drivenBy: n.drivenBy || null,
      animChannels: this.clip ? this.clip.channelsOf(ni) : [],
      rigDrivers: this.rig ? this.rig.driversOf(ni) : [],
      rigStatus: this.rig ? this.rig.statusOf(ni) : null,     // 'estimated'・'unknown'（リグで求められない）・null
      animLoaded: !!this.clip,
      animValues: this.rig ? this.rigValues(ni) : null,
      frame: this.frame,
    };
  }

  pick(ev) {
    if (!this.built) return;
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new Vector2(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    const cam = this.activeCamera();
    this.raycaster.setFromCamera(ndc, cam);
    // Maya のビューポートで選べないもの（テンプレート・リファレンス）は、「選択の制限を無視」がオフなら選ばない
    const force = !!this.settings.pickAll;
    const nodes = this.data.nodes;
    const okNode = (ni) => force || !nodes[ni].unselectable;
    if (this.settings.joints) {
      const ni = this.overlay.pick(this.raycaster);
      if (ni >= 0 && okNode(ni)) { this.select(ni, { notify: true }); return; }
    }
    // カーブ: 画面上で約 5 ピクセル以内を通る線（メッシュより手前なら優先）
    const perPx = this.pixelSize(rect.height);
    const curveHit = this.curves.pick(this.raycaster, perPx * 5, (c) => force || !(c.unselectable || nodes[c.transform].unselectable));
    const useSkin = this.settings.skin;
    if (this.poseDirty) {
      for (const e of this.built.meshes) if (e.skinned) { e.skinned.boundingSphere = null; e.skinned.boundingBox = null; }
      this.poseDirty = false;
    }
    const targets = [];
    for (const e of this.built.meshes) {
      if (!e.visible || !(force || !e.data.unselectable)) continue;
      targets.push(useSkin && e.skinned ? e.skinned : e.staticMesh);
    }
    const hits = this.raycaster.intersectObjects(targets, false);
    if (curveHit.node >= 0 && (!hits.length || curveHit.distance <= hits[0].distance)) {
      this.select(curveHit.node, { notify: true });
      return;
    }
    if (!hits.length) { this.clearSelection(); return; }
    const h = hits[0];
    const e = this.built.meshes[h.object.userData.meshIndex];
    if (this.settings.pickMode !== 'vertex') {
      // オブジェクトの選択: メッシュの transform を選ぶ
      this.picked = null;
      this.marker.visible = false;
      this.select(e.transform, { notify: true });
      return;
    }
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
    this.beforeDriverPose(ni);
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
    // リグがあれば、ポーズ確認の結果（コントローラーの移動など）でコンストレイント・IK を評価し直す
    if (this.rig && this.rig.hasGraph && !this.rigBusy) {
      this.applyFrame(this.frame, light);
      return;
    }
    this.built.root.updateMatrixWorld(true);
    this.overlay.update();
    this.poseDirty = true;
    this.updateMarker();
    if (!light && this.picked) this.ui.showVertexInfo(this.vertexInfo());
    if (!light && this.selected >= 0) this.ui.showNodeInfo(this.nodeInfo(this.selected));
    if (!light) this.updateToolbarHints();
    if (!this.gizmoDragging) this.syncGizmo();
    this.requestRender();
  }

  /** リグを動かすノード（コントローラーなど）をポーズ確認で動かすときは、骨が動いて見えるよう「ファイルの値」にする */
  beforeDriverPose(ni) {
    if (this.rig && this.rig.drivers.has(ni) && this.settings.poseSource === 'bind' && hasBindPose(this.built)) {
      this.setSetting('poseSource', 'file');
      this.ui.setMessage('コントローラーの動きを確認するため、姿勢の基準を「ファイルの値」に切り替えました', 6000);
    }
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
    this.beforeDriverPose(this.selected);
    this.pose.set(this.selected, pose);
    this.afterPoseChange();
    this.ui.showPoseFor(this.selected, pose);
  }

  // ------------------------------------------------------------------ ツールバーの状態
  /**
   * いまの表示設定では押しても見た目が変わらない切り替えに、理由を付けて示す（押せないのではなく、効果がない）。
   * 例: ワイヤーのみの表示中のワイヤー、ウェイトの表示中のテクスチャ、ジョイントを隠しているときの前面表示
   */
  updateToolbarHints() {
    const st = this.settings, b = this.built;
    const hints = {};
    if (!b) {
      for (const id of ['opt-wire', 'opt-tex', 'opt-skin', 'opt-joints', 'opt-curves', 'opt-xray', 'opt-bind']) hints[id] = 'シーンを読み込むと使えます';
      this.ui.setToolbarHints(hints);
      return;
    }
    const hasSkin = b.meshes.some((e) => e.skinned);
    const hasBind = hasBindPose(b);
    if (st.shading === 'none') hints['opt-wire'] = 'ワイヤーのみの表示（4）では、常にワイヤーを表示します（5 でシェーディングに戻す）';
    if (st.weightMode !== 'off') hints['opt-tex'] = 'ウェイトの表示中は、テクスチャとマテリアルの色を表示しません';
    else if (st.shading === 'none') hints['opt-tex'] = 'ワイヤーのみの表示（4）では、テクスチャを表示しません';
    else if (!(this.data.materials || []).length) hints['opt-tex'] = 'このシーンにはマテリアル・テクスチャがありません';
    if (!hasSkin) hints['opt-skin'] = 'スキン（skinCluster）のあるメッシュがありません';
    else if (st.poseSource === 'bind' && hasBind && !(this.pose && this.pose.size)) {
      hints['opt-skin'] = 'バインドポーズでは、スキン変形の有無で形は変わりません（B でファイルの値にするか、ポーズ確認で動かすと違いが出ます）';
    }
    if (!b.jointIndices.length && !(this.overlay.controls || []).length) hints['opt-joints'] = 'ジョイントがありません';
    if (!st.joints) hints['opt-xray'] = 'ジョイントを表示していないため効果がありません（J でジョイントを表示）';
    if (!this.curves.items.some(Boolean)) hints['opt-curves'] = 'このシーンには NURBS カーブがありません';
    if (!hasBind) hints['opt-bind'] = 'このシーンにはバインドポーズの情報がありません（ファイルの値で表示します）';
    this.ui.setToolbarHints(hints);
  }

  // ------------------------------------------------------------------ 再生のフレームレート（ヘッドアップディスプレイ）
  /**
   * 再生を始めたとき。再生は実時間で、描画が間に合わないとフレームを飛ばすので、
   * 実際に表示できたフレーム数（直近 1 秒）を、シーンのフレームレート（目標）と並べて表示する
   */
  startFpsMeter(target) {
    this.fpsMeter = { target, times: [], start: performance.now(), shown: 0, shownAt: 0, first: 0, last: 0 };
    this.updateHud(true);
  }

  /** 再生で新しいフレームを表示したとき */
  countShownFrame(now) {
    const m = this.fpsMeter;
    if (!m) return;
    m.times.push(now);
    if (!m.shown) m.first = now;
    m.last = now;
    m.shown++;
    while (m.times.length && m.times[0] < now - 1000) m.times.shift();
    if (now - m.shownAt > 250) { m.shownAt = now; this.updateHud(); }   // 表示の更新は 1 秒に 4 回まで
  }

  stopFpsMeter() {
    const m = this.fpsMeter;
    if (!m) return;
    const sec = (m.last - m.first) / 1000;                    // 最初と最後に表示したフレームの間
    // 直前の再生の平均（再生は時間からフレームを決めるので目標を超えない。超えるのは表示の間隔の量子化の誤差）
    m.average = sec > 0.25 ? Math.min((m.shown - 1) / sec, m.target) : null;
    m.stopped = true;
    this.updateHud();
  }

  /** 直近 1 秒のフレームレート（フレームが 2 つ以上あるとき） */
  currentFps() {
    const t = this.fpsMeter ? this.fpsMeter.times : [];
    if (t.length < 2) return null;
    return Math.min(((t.length - 1) * 1000) / Math.max(t[t.length - 1] - t[0], 1), this.fpsMeter.target);
  }

  updateHud(starting = false) {
    const m = this.fpsMeter;
    const show = !!(this.settings.hud && this.built && (this.hasTimeline || this.sequence));
    let text = '', cls = 'idle';
    if (show) {
      const target = (m && m.target) || (this.clip && this.clip.fps) || 24;
      const f1 = (v) => v.toFixed(1);
      if (m && !m.stopped) {
        const fps = starting ? null : this.currentFps();
        text = `再生 ${fps === null ? '--.-' : f1(fps)} / ${f1(target)} fps`;
        // 立ち上がり（0.5 秒）を過ぎて、目標の 9 割に届かなければ処理落ち
        cls = fps !== null && performance.now() - m.start > 500 && fps < target * 0.9 ? 'slow' : '';
      } else {
        text = m && m.average ? `直前の再生 ${f1(m.average)} / ${f1(target)} fps` : `${f1(target)} fps`;
      }
    }
    this.ui.setHud(show ? text : null, cls);
  }

  // ------------------------------------------------------------------ カメラシーケンサ
  /** シーケンスのフレームを f にする。follow: true ならビューポートもシーケンスで表示する */
  setSequenceFrame(f, opts = {}) {
    if (!this.sequence) return;
    this.seqFrame = Math.min(Math.max(f, this.sequence.start), this.sequence.end);
    if (this.seqPlaying) this.seqClock = { from: this.seqFrame, t0: performance.now() };   // 再生中なら、ここから再生を続ける
    if (opts.follow && !this.seqFollow) this.seqFollow = true;
    if (this.seqFollow) this.applySequence();
    this.updateSequencePanel();
  }

  setSequenceFollow(on) {
    this.seqFollow = !!on && !!this.sequence;
    if (this.seqFollow) this.applySequence();
    else this.pauseSequence();
    this.updateSequencePanel();
  }

  /** いまのシーケンスのフレームのショットの、カメラとシーンのフレームにする */
  applySequence() {
    const shot = activeShot(this.sequence && this.sequence.shots, this.seqFrame);
    if (!shot) return;
    if (shot.camera >= 0 && shot.camera !== this.viewCamera) this.setCamera(shot.camera, { quiet: true, fromSequence: true });
    if (this.hasTimeline) {
      if (this.playing) this.pause();
      this.ensureAnimatedPose();
      this.applyFrame(shotTime(shot, this.seqFrame), this.seqPlaying);
    } else {
      this.requestRender();
    }
  }

  updateSequencePanel() {
    if (!this.sequence) return;
    this.seqPanel.update(this.seqFrame, activeShot(this.sequence.shots, this.seqFrame), this.cameras, this.seqFollow, this.seqPlaying);
  }

  /** 前・次のショットの先頭へ（使うショットが変わるフレーム。shotStarts） */
  stepShot(d) {
    if (!this.sequence) return;
    const starts = shotStarts(this.sequence.shots);
    const t = d > 0 ? starts.find((x) => x > this.seqFrame + 1e-6) : [...starts].reverse().find((x) => x < this.seqFrame - 1e-6);
    if (t !== undefined) this.setSequenceFrame(t, { follow: true });
  }

  toggleSequencePlay() { if (this.seqPlaying) this.pauseSequence(); else this.playSequence(); }

  /** シーケンスを実時間で再生する（最後まで行くと先頭に戻る） */
  playSequence() {
    if (!this.sequence || this.seqPlaying) return;
    this.pause();
    this.seqFollow = true;
    this.endCameraEdit();
    this.seqPlaying = true;
    this.updateNavigation();
    this.updatePlayButton();
    const fps = (this.clip && this.clip.fps) || 24;
    const { start, end } = this.sequence;
    this.seqClock = { from: this.seqFrame >= end ? start : Math.floor(this.seqFrame), t0: performance.now() };
    this.startFpsMeter(fps);
    const tick = (now) => {
      if (!this.seqPlaying) return;
      const span = end - start + 1;
      const { from, t0 } = this.seqClock;      // 再生中にショット送りなどでフレームを動かすと変わる
      const f = start + ((Math.floor(from) - start + Math.floor((Math.max(now - t0, 0) / 1000) * fps)) % span);
      if (f !== this.seqFrame) { this.seqFrame = f; this.applySequence(); this.updateSequencePanel(); this.countShownFrame(now); }
      this.seqHandle = requestAnimationFrame(tick);
    };
    this.updateSequencePanel();
    this.seqHandle = requestAnimationFrame(tick);
  }

  pauseSequence() {
    if (!this.seqPlaying) return;
    this.seqPlaying = false;
    cancelAnimationFrame(this.seqHandle);
    this.updateNavigation();
    this.updatePlayButton();
    this.stopFpsMeter();
    if (this.built) this.afterPoseChange();
    this.updateSequencePanel();
  }

  // ------------------------------------------------------------------ シーンのカメラ
  /** 次のカメラ（C キー）。最後のカメラの次は自由視点 */
  nextCamera() {
    if (!this.cameras.length) return -1;
    return this.viewCamera + 1 < this.cameras.length ? this.viewCamera + 1 : -1;
  }

  /** シーンのカメラから見る（-1 で自由視点に戻す） */
  setCamera(ci, opts = {}) {
    if (!opts.fromSequence && !opts.quiet && this.seqFollow) this.setSequenceFollow(false);   // 自分でカメラを選んだ
    if (!(ci >= 0 && ci < this.cameras.length)) ci = -1;
    if (ci === this.viewCamera) return;
    if (!this.renderer) { this.viewCamera = -1; return; }
    if (this.viewCamera < 0 && ci >= 0) this.freeTarget = this.controls.target.clone();
    if (ci < 0 && this.freeTarget) { this.controls.target.copy(this.freeTarget); this.freeTarget = null; }
    this.viewCamera = ci;
    this.endCameraEdit();
    const cam = this.activeCamera();
    cam.add(this.keyLight, this.keyLight.target);     // ライトは見ている視点についていく
    this.controls.object = cam;                         // 視点の操作の対象（カメラから見ているときはそのカメラ）
    this.updateNavigation();
    if (this.gizmo) this.gizmo.camera = cam;
    this.updateCameraIcons();
    this.updateGate();
    if (!opts.quiet) this.ui.setMessage(ci >= 0 ? `カメラ ${this.cameras[ci].name} から表示します（Shift+C で自由視点）` : '自由視点に戻しました');
    if (this.selected >= 0 && this.built) this.ui.showNodeInfo(this.nodeInfo(this.selected));   // 「このカメラから見る」の状態
    this.requestRender();
  }

  /** 見ているカメラの位置・向き・投影を、いまのフレームのカメラに合わせる（描画のたびに呼ぶ） */
  syncViewCamera() {
    const c = this.cameras[this.viewCamera];
    const obj = c && this.built ? this.built.nodeObjects[c.transform] : null;
    if (!obj) return;
    const cam = this.activeCamera();
    if (!(this.camEdit && this.camEdit.ci === this.viewCamera)) {   // 停止中に動かした視点は、フレームが変わるまで保つ
      obj.updateWorldMatrix(true, false);
      obj.matrixWorld.decompose(cam.position, _q, _v);
      cam.quaternion.copy(_q);
    }
    cam.updateMatrixWorld(true);
    const vp = document.getElementById('viewport');
    const W = Math.max(1, vp.clientWidth), H = Math.max(1, vp.clientHeight);
    const render = (this.data && this.data.render) || {};
    // 解像度ゲートは、左上のタイトルと下端のタイムライン（ビューポートに重ねて表示）を避けた範囲に収める
    const title = document.getElementById('vp-title'), tl = document.getElementById('timeline');
    const inset = { top: title && title.textContent ? title.offsetTop + title.offsetHeight + 4 : 0,
      bottom: tl && !tl.hidden ? tl.offsetHeight : 0 };
    const fr = cameraFrustum(cameraParams(c, this.cameraProps.get(this.viewCamera)), W, H, render.deviceAspectRatio, 1.06, inset);
    if (fr.ortho) {
      Object.assign(cam, { left: fr.left, right: fr.right, top: fr.top, bottom: fr.bottom, near: fr.near, far: fr.far });
      cam.updateProjectionMatrix();
    } else {
      cam.near = fr.near;
      cam.far = fr.far;
      cam.projectionMatrix.makePerspective(fr.left, fr.right, fr.top, fr.bottom, fr.near, fr.far);
      cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
      cam.fov = 2 * Math.atan((fr.top - fr.bottom) / 2 / fr.near) / D2R;   // 視点の操作（パンの量）に使う縦の画角
    }
    this.gateRect = fr.gate;
    this.ui.setGate(this.settings.cameraGate, fr.gate, W, H);
  }

  /** 視点を動かせるか（自由視点はいつでも、シーンのカメラから見ているときは再生していない間） */
  canNavigate() {
    return this.viewCamera < 0 || !(this.playing || this.seqPlaying);
  }

  updateNavigation() {
    if (this.controls) this.controls.enabled = this.canNavigate() && !this.gizmoDragging;
    this.ui.setViewCamera(this.viewCamera, this.viewCamera >= 0 ? this.cameras[this.viewCamera].name : '', !!this.camEdit);
  }

  /**
   * カメラから見ているときに視点の操作を始めたら、いまの位置・向きから動かせるよう、回転の中心（注視点）を
   * 視線の先のシーンの中心あたりに置く（中心が後ろにあれば、シーンの大きさの距離）。視点はまだ変えない
   */
  prepareCameraEdit() {
    if (this.viewCamera < 0 || this.camEdit) return;
    const cam = this.activeCamera();
    const fwd = new Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
    const center = this.built ? computeBounds(this.built, this.settings.skin).getCenter(new Vector3()) : new Vector3();
    const d = center.sub(cam.position).dot(fwd);
    this.controls.target.copy(cam.position).addScaledVector(fwd, d > this.sceneRadius * 0.05 ? d : Math.max(this.sceneRadius, 1));
  }

  /**
   * カメラから見ているときに視点が動いたら、その視点を保つ（表示だけ。フレームを動かすか再生すると、カメラの位置に戻る）
   */
  beginCameraEdit() {
    if (this.viewCamera < 0 || this.camEdit) return;
    this.camEdit = { ci: this.viewCamera, frame: this.frame };
    this.updateNavigation();
    this.ui.setMessage(`カメラ ${this.cameras[this.viewCamera].name} の視点を一時的に動かしています（保存しません。フレームを動かすか再生すると戻ります）`, 6000);
  }

  /** 動かしたカメラの視点を、カメラの位置に戻す */
  endCameraEdit() {
    if (!this.camEdit) return;
    this.camEdit = null;
    this.viewOrtho.zoom = 1;
    this.updateNavigation();
    this.requestRender();
  }

  updateGate() {
    if (this.viewCamera < 0) this.ui.setGate(null);
    else this.requestRender();                         // 描画のときに位置を合わせる
  }

  updateCameraIcons() {
    if (!this.cameraIcons || !this.built) return;
    this.cameraIcons.update(!!this.settings.cameraIcons, (ni) => !!(this.hiddenEff && this.hiddenEff[ni]), this.viewCamera, this.selected);
  }

  /** ビューポートの 1 ピクセルが、注視点のあたりでワールドの何単位か（カーブのピックの許容範囲） */
  pixelSize(heightPx) {
    const cam = this.activeCamera();
    const h = Math.max(heightPx, 1);
    if (cam.isOrthographicCamera) return (cam.top - cam.bottom) / cam.zoom / h;
    if (this.viewCamera >= 0) {
      const center = this.built ? computeBounds(this.built, this.settings.skin).getCenter(new Vector3()) : new Vector3();
      const e = cam.projectionMatrix.elements;               // 透視投影: 視野の縦の広がり 2 / e[5]
      return (2 / e[5]) * cam.position.distanceTo(center) / h;
    }
    return 2 * cam.position.distanceTo(this.controls.target) * Math.tan(cam.fov * D2R / 2) / h;
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
    this.curves.expandBox(box, sub);
    const r = Math.max(box.getSize(_v).length() / 2, this.overlay.radius() * 12, this.sceneRadius * 0.05);
    this.fit(box.getCenter(new Vector3()), r);
  }

  fit(center, radius, resetDirection = false) {
    this.setCamera(-1, { quiet: true });          // カメラから見ているときは自由視点に戻す
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
      curves: this.curves.items.filter(Boolean).length,
      cameras: this.cameras.map((c) => c.name),
      viewCamera: this.viewCamera >= 0 ? this.cameras[this.viewCamera].name : null,
      cameraEdited: !!this.camEdit, navigation: !!(this.controls && this.controls.enabled),
      fps: this.fpsMeter ? { current: this.currentFps(), average: this.fpsMeter.average ?? null, target: this.fpsMeter.target,
        playing: !this.fpsMeter.stopped } : null,
      sequence: this.sequence ? { frame: this.seqFrame, follow: this.seqFollow, playing: this.seqPlaying,
        shot: (activeShot(this.sequence.shots, this.seqFrame) || {}).shotName || null, shots: this.sequence.shots.length } : null,
      hiddenMeshes: this.built.meshes.filter((e) => !e.visible).map((e) => e.name),
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
        curves: this.clip.curves.length, nodes: this.rig ? this.rig.moving.size : this.clip.nodes.length,
        graphNodes: this.rig ? this.rig.graph.length : 0, rigProblems: this.rig ? [...this.rig.problems] : [],
      } : null,
    };
  }
}

/**
 * 地面のグリッド（XZ 平面）。原点を通る線は軸の色にして、背景の暗い色に溶けないようにする
 * （X 軸 = 赤、Z 軸 = 青。Maya のビューの軸の色と同じ系統）
 */
function makeGrid(size, divisions) {
  const half = size / 2, step = size / divisions;
  const line = new Color(0x5d656e), axisX = new Color(0xd0675f), axisZ = new Color(0x5f8fd8);
  const pos = [], col = [];
  const add = (a, b, c) => { pos.push(...a, ...b); col.push(c.r, c.g, c.b, c.r, c.g, c.b); };
  for (let i = 0; i <= divisions; i++) {
    const k = -half + i * step;
    const center = Math.abs(k) < step * 1e-6;
    add([-half, 0, k], [half, 0, k], center ? axisX : line);    // X 方向の線（中央は X 軸）
    add([k, 0, -half], [k, 0, half], center ? axisZ : line);    // Z 方向の線（中央は Z 軸）
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new Float32BufferAttribute(col, 3));
  const grid = new LineSegments(g, new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7 }));
  grid.name = '__grid';
  return grid;
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
  showLoading(text, frac, subText, subFrac) { app.ui.setEmpty(false); app.ui.showLoading(text, frac, subText, subFrac); },
  hideLoading() { app.ui.hideLoading(); if (!app.built) app.ui.setEmpty(true); },
  showError(text) { app.ui.hideLoading(); app.ui.showError(text); },
  setMessage(text) { app.ui.setMessage(text); },
  selectByPath(path) { return app.selectByPath(path); },
  clear() { app.clearAll(); return true; },
  getStats() { return app.stats(); },
  /** 保存時のフレームの再現チェック（IK の結果とファイルの値の比較） */
  verifyRig() { return app.verifyRig(); },
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
