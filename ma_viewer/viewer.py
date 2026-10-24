# -*- coding: utf-8 -*-
"""Qt のビューア（スタンドアロン・Maya 共通）。

ViewerWidget : QWebEngineView で web/index.html を表示し、共通 JSON を three.js 側へ送る
ViewerWindow : メニュー・ログ・ファイル読み込み（別スレッド）・ドロップ・Maya 連携
"""
from __future__ import annotations

import base64
import json
import os
import time
import traceback

from .qt_compat import (QAction, QWebChannel, QWebEnginePage, QWebEngineScript, QWebEngineSettings,
                        QWebEngineView, QtCore, QtGui, QtWidgets, Qt, Signal, Slot, require_webengine,
                        run_javascript)

from .resources import index_html  # noqa: E402  web 一式の場所（exe 化しても見つかるように探す）
CHUNK_SIZE = 4 * 1024 * 1024          # runJavaScript 1 回あたりの文字数
OPENABLE_EXT = (".ma", ".json", ".mb")


class _Cancelled(Exception):
    pass


# ---------------------------------------------------------------------------
# JS ⇄ Python
# ---------------------------------------------------------------------------

class Bridge(QtCore.QObject):
    """QWebChannel で JS に公開するオブジェクト（JS 側からは bridge.xxx() で呼ぶ）。"""
    readySignal = Signal()
    selectedSignal = Signal(str)
    logSignal = Signal(str, str)
    historySignal = Signal(bool, bool, str, str)
    warningsSignal = Signal(str)
    showWarningsSignal = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self.allowed_files = set()   # JS に渡してよいファイル（読み込んだシーンのテクスチャ）

    @Slot()
    def jsReady(self):
        self.readySignal.emit()

    @Slot(str)
    def nodeSelected(self, path):
        self.selectedSignal.emit(path)

    @Slot(str, str)
    def log(self, level, text):
        self.logSignal.emit(level, text)

    @Slot(bool, bool, str, str)
    def historyChanged(self, can_undo, can_redo, undo_label, redo_label):
        self.historySignal.emit(can_undo, can_redo, undo_label, redo_label)

    @Slot(str)
    def warningsChanged(self, text):
        """警告の一覧（JSON の文字列の配列）"""
        self.warningsSignal.emit(text)

    @Slot()
    def showWarnings(self):
        self.showWarningsSignal.emit()

    @Slot(str, result=str)
    def readFileBase64(self, path):
        """テクスチャを JS に渡す（file:// で直接読めなかったときの代替経路）。"""
        key = os.path.normcase(os.path.abspath(path))
        if key not in self.allowed_files:
            self.logSignal.emit("warn", "シーンに含まれないファイルの読み込み要求を拒否しました: %s" % path)
            return ""
        try:
            with open(path, "rb") as f:
                return base64.b64encode(f.read()).decode("ascii")
        except OSError as exc:
            self.logSignal.emit("warn", "テクスチャを読めません: %s（%s）" % (path, exc))
            return ""


class ViewerPage(QWebEnginePage):
    """コンソール出力をログへ流し、ページ外への遷移を止める。

    ビューにファイルが落とされた場合、Chromium はそのファイルへ遷移しようとするので、
    ここで止めて「ファイルを開く」要求に変える。
    """
    fileDropped = Signal(str)
    consoleMessage = Signal(str, str)

    def javaScriptConsoleMessage(self, level, message, line, source):
        names = {0: "info", 1: "warn", 2: "error"}
        try:
            lv = names.get(int(level), "info")
        except (TypeError, ValueError):
            lv = "warn" if "Warning" in str(level) else ("error" if "Error" in str(level) else "info")
        self.consoleMessage.emit(lv, "%s（%s:%s）" % (message, os.path.basename(str(source)), line))

    index_path = ""

    def acceptNavigationRequest(self, url, nav_type, is_main_frame):
        if url.isLocalFile():
            path = os.path.normcase(os.path.abspath(url.toLocalFile()))
            if path == os.path.normcase(self.index_path):
                return True
            if path.lower().endswith(OPENABLE_EXT):
                self.fileDropped.emit(url.toLocalFile())
            return False
        if url.scheme() in ("data", "about", "blob"):
            return True
        return False


class ViewerWidget(QtWidgets.QWidget):
    """three.js ビューアを表示するウィジェット。他のツールに組み込んで使うこともできる。"""
    nodeSelected = Signal(str)
    logMessage = Signal(str, str)
    fileDropped = Signal(str)
    pageReady = Signal()
    historyChanged = Signal(bool, bool, str, str)   # 元に戻せるか, やり直せるか, それぞれの操作名
    warningsChanged = Signal(list)                  # 警告の一覧
    showWarningsRequested = Signal()                # ビューアの警告アイコンが押された

    def __init__(self, parent=None):
        require_webengine()
        super().__init__(parent)
        self._loaded = False
        self._pending = []
        self._dev_view = None

        self.view = QWebEngineView(self)
        self.view.setAcceptDrops(False)
        self.page = ViewerPage(self.view)
        self.view.setPage(self.page)
        self.view.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)

        st = self.page.settings()
        WA = QWebEngineSettings.WebAttribute
        st.setAttribute(WA.LocalContentCanAccessFileUrls, True)
        st.setAttribute(WA.LocalContentCanAccessRemoteUrls, False)
        st.setAttribute(WA.WebGLEnabled, True)

        self.bridge = Bridge(self)
        self.channel = QWebChannel(self.page)
        self.channel.registerObject("bridge", self.bridge)
        self.page.setWebChannel(self.channel)
        self.has_channel = self._inject_qwebchannel()

        self.bridge.selectedSignal.connect(self.nodeSelected)
        self.bridge.historySignal.connect(self.historyChanged)
        self.warnings: list = []
        self.bridge.warningsSignal.connect(self._on_warnings)
        self.bridge.showWarningsSignal.connect(self.showWarningsRequested)
        self.bridge.logSignal.connect(self.logMessage)
        self.page.consoleMessage.connect(lambda lv, t: self.logMessage.emit(lv, "JS: " + t))
        self.page.fileDropped.connect(self.fileDropped)
        self.view.loadFinished.connect(self._on_load_finished)

        lay = QtWidgets.QVBoxLayout(self)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.addWidget(self.view)

        self.index_path = index_html()      # 見つからなければ、探した場所つきのエラー
        self.page.index_path = self.index_path
        self.view.load(QtCore.QUrl.fromLocalFile(self.index_path))

    def _inject_qwebchannel(self) -> bool:
        """Qt に内蔵の qwebchannel.js をページ生成時に差し込む（選択の同期に使う）。"""
        f = QtCore.QFile(":/qtwebchannel/qwebchannel.js")
        if not f.open(QtCore.QIODevice.OpenModeFlag.ReadOnly):
            self.logMessage.emit("warn", "qwebchannel.js を読めないため、ビューアからの選択通知は使えません。")
            return False
        src = bytes(f.readAll()).decode("utf-8")
        f.close()
        script = QWebEngineScript()
        script.setName("qwebchannel.js")
        script.setSourceCode(src)
        world = QWebEngineScript.ScriptWorldId.MainWorld
        script.setWorldId(world.value if hasattr(world, "value") else int(world))
        script.setInjectionPoint(QWebEngineScript.InjectionPoint.DocumentCreation)
        script.setRunsOnSubFrames(False)
        self.page.scripts().insert(script)
        return True

    def _on_load_finished(self, ok):
        if not ok:
            self.logMessage.emit("error", "ビューアの HTML を読み込めませんでした: %s" % self.index_path)
            return
        self._loaded = True
        pending, self._pending = self._pending, []
        for code, cb in pending:
            run_javascript(self.page, code, cb)
        self.pageReady.emit()

    @property
    def is_ready(self) -> bool:
        return self._loaded

    # ------------------------------------------------------------------
    def run_js(self, code: str, callback=None):
        """ページ読み込み前の呼び出しは、読み込み完了まで順番に保留する。"""
        if not self._loaded:
            self._pending.append((code, callback))
            return
        run_javascript(self.page, code, callback)

    def _call(self, func: str, *args, callback=None):
        js_args = ", ".join(json.dumps(a, ensure_ascii=True) for a in args)
        self.run_js("window.mayaViewer && window.mayaViewer.%s(%s)" % (func, js_args), callback)

    def set_scene(self, scene: dict, message: str = "シーンを転送中"):
        """共通 JSON（dict）をビューアに送る。大きなデータは分割して送る。"""
        self.bridge.allowed_files = {os.path.normcase(os.path.abspath(t["resolved"]))
                                     for t in scene.get("textures") or [] if t.get("resolved")}
        t0 = time.perf_counter()
        payload = json.dumps(scene, ensure_ascii=True, separators=(",", ":"))
        self.last_dump_seconds = time.perf_counter() - t0
        self._call("beginTransfer", message)
        for i in range(0, len(payload), CHUNK_SIZE):
            self.run_js("window.mayaViewer.appendChunk(%s)" % json.dumps(payload[i:i + CHUNK_SIZE]))
        self._call("endTransfer")
        return len(payload)

    def set_animation(self, anim: dict):
        """アニメーション（共通 JSON の animation）を送る。シーンを送ったあとに呼ぶ。"""
        t0 = time.perf_counter()
        payload = json.dumps(anim, ensure_ascii=True, separators=(",", ":"))
        self.last_dump_seconds = time.perf_counter() - t0
        self._call("beginAnimationTransfer")
        for i in range(0, len(payload), CHUNK_SIZE):
            self.run_js("window.mayaViewer.appendChunk(%s)" % json.dumps(payload[i:i + CHUNK_SIZE]))
        self._call("endAnimationTransfer")
        return len(payload)

    def set_animation_status(self, text: str):
        """アニメーションの読み込み状況（タイムラインに表示）"""
        self._call("setAnimationStatus", text)

    def select_path(self, path: str):
        self._call("selectByPath", path)

    def show_loading(self, text: str, frac: float = -1.0):
        self._call("showLoading", text, frac)

    def hide_loading(self):
        self._call("hideLoading")

    def show_error(self, text: str):
        self._call("showError", text)

    def set_message(self, text: str):
        self._call("setMessage", text)

    def clear(self):
        self._call("clear")

    def _on_warnings(self, text):
        try:
            self.warnings = [str(w) for w in json.loads(text)]
        except ValueError:
            self.warnings = []
        self.warningsChanged.emit(self.warnings)

    def undo(self):
        self._call("undo")

    def redo(self):
        self._call("redo")

    def get_stats(self, callback):
        """ビューアの状態を dict で callback に渡す（JS のオブジェクトは JSON 文字列で受け取る）。"""
        def done(text):
            try:
                callback(json.loads(text) if text else None)
            except ValueError:
                callback(None)
        self.run_js("JSON.stringify(window.mayaViewer ? window.mayaViewer.getStats() : null)", done)

    def open_dev_tools(self):
        """Chromium の開発者ツールを別ウィンドウで開く（表示の不具合調査用）。"""
        if self._dev_view is None:
            self._dev_view = QWebEngineView()
            self._dev_view.setWindowTitle("開発者ツール - Maya シーンビューア")
            self._dev_view.resize(1000, 700)
            self.page.setDevToolsPage(self._dev_view.page())
        self._dev_view.show()
        self._dev_view.raise_()


# ---------------------------------------------------------------------------
# 読み込みスレッド
# ---------------------------------------------------------------------------

class _LoadWorker(QtCore.QObject):
    """読み込みは 2 段階: シーン（finished）を先に渡して表示し、そのあとアニメーション（animationReady）を読む。"""
    progress = Signal(float, str)
    finished = Signal(object, float)
    failed = Signal(str, str)
    animationProgress = Signal(float, str)
    animationReady = Signal(object, float)     # animation（なければ None）, 秒
    animationFailed = Signal(str, str)
    done = Signal()

    def __init__(self, path: str, animation: bool = True):
        super().__init__()
        self.path = path
        self.animation = animation
        self.in_animation = False
        self._cancel = False
        self._last = 0.0

    def cancel(self):
        self._cancel = True

    def _progress(self, frac, msg):
        if self._cancel:
            raise _Cancelled()
        now = time.time()
        if now - self._last > 0.25 or frac >= 1.0:      # 再描画の負荷を抑えるため、更新は毎秒 4 回まで
            self._last = now
            (self.animationProgress if self.in_animation else self.progress).emit(frac, msg)

    @Slot()
    def run(self):
        t0 = time.time()
        load_animation = None
        try:
            if self.path.lower().endswith(".json"):
                from . import schema
                with open(self.path, encoding="utf-8") as f:
                    scene = json.load(f)
                schema.validate(scene)
                scene.setdefault("source", {}).setdefault("name", os.path.basename(self.path))
            else:
                from .extract_ma import load_ma_staged
                scene, load_animation = load_ma_staged(self.path, progress=self._progress)
            self.finished.emit(scene, time.time() - t0)
        except _Cancelled:
            self.failed.emit("中止しました", "")
            load_animation = None
        except Exception as exc:  # noqa: BLE001
            self.failed.emit(str(exc), traceback.format_exc())
            load_animation = None
        # 2 段階目: シーンの表示と並行して、アニメーションカーブを読む
        if load_animation is not None and self.animation and not self._cancel:
            self.in_animation = True
            t1 = time.time()
            try:
                anim = load_animation(self._progress)
                if not self._cancel:
                    self.animationReady.emit(anim, time.time() - t1)
            except _Cancelled:
                pass
            except Exception as exc:  # noqa: BLE001  アニメーションが読めなくてもシーンは表示したままにする
                self.animationFailed.emit(str(exc), traceback.format_exc())
        self.done.emit()


# ---------------------------------------------------------------------------
# ウィンドウ
# ---------------------------------------------------------------------------

HELP_TEXT = """\
<b>マウス</b><br>
左ドラッグ: 回転　中ドラッグ: 移動　右ドラッグ・ホイール: ズーム<br>
クリック: ジョイントを選択／メッシュ上ならいちばん近い頂点のウェイトを表示<br><br>
<b>キー</b><br>
F: 選択を表示　A: 全体を表示　Esc: 選択解除<br>
Q: 選択　W: 移動　E: 回転　R: スケール　＋／−: ハンドルの大きさ<br>
Ctrl+Z（Z）: 元に戻す　Ctrl+Y・Ctrl+Shift+Z（Shift+Z）: やり直す<br>
H: 選択中のノードの表示・非表示を切り替え　Ctrl+H: 隠す　Shift+H: 表示する（階層の目のアイコンでも切り替え）<br>
4: ワイヤーのみ　5: シェーディング（テクスチャなし）　6: シェーディング（テクスチャあり）　J: ジョイント表示<br>
B: バインドポーズ／ファイルの値の切り替え（ツールバーの人のアイコンでも切り替え）<br>
C: 次のシーンのカメラから見る　Shift+C: 自由視点に戻す（ツールバーの［カメラ］でも選べます）<br>
ツールバーの薄く破線の枠のボタンは、いまの表示設定では効果がありません（ツールチップに理由を表示）。<br><br>
<b>アニメーション</b>（.ma にキーがあるとき。ビューポート下端のタイムライン）<br>
Alt+V: 再生・停止　Alt+, / Alt+.: 前／次のフレーム　, / .: 前／次のキー　Home / End: 先頭／最後<br>
アニメーションはシーンの表示後に読み込みます（［ファイル］→［アニメーションを読み込む］でオフにできます）。キーがあれば姿勢の基準は自動で「ファイルの値」になります。<br>
コンストレイント・IK・計算ノード・キャラクターセット（Trax のクリップ）も評価します。黄緑の八面体はコントローラーで、選んで W・E・R で動かすと IK などが追従します。<br>
シーンにショットがあると、ビューポートの下にカメラシーケンサを表示します。トラックをクリックするか再生すると、ショットのカメラとフレームで表示します。<br><br>
<b>パネル</b><br>
左右のパネルは、見出し横の ‹ › で最小化できます。最小化した帯をクリックすると戻ります。<br>
左パネルの幅は、右端をドラッグして変えられます（ダブルクリックで元の幅）。<br>
階層の ▸ ▾ を Shift+クリックすると、その下の階層もまとめて開閉します。⊞ ⊟ ですべて開く・閉じる。<br><br>
<b>マップ</b><br>
ツールバーの［マップ］で、合成（PBR）表示と各マップ（ベースカラー・法線・ラフネス・メタリック・AO・エミッシブ・不透明度）の単独表示を切り替えられます。<br>
ツールバーの［表示］でライトをフラットにすると、ライトの影響なしでテクスチャの色をそのまま表示します。<br><br>
<b>ウェイトの確認</b><br>
ツールバーの［ウェイト］を「選択ジョイント」にしてジョイントを選ぶとヒートマップを表示します。<br>
ジョイントを選んで W・E・R のハンドルを動かすか、右パネル［選択］のポーズ確認欄の数値を変えると、
ウェイトによる変形を確かめられます（保存はされません）。
"""


def _settings():
    return QtCore.QSettings("MayaSceneViewer", "MayaSceneViewer")


def _settings_bool(key: str, default: bool) -> bool:
    try:
        v = _settings().value(key, default)
    except Exception:  # noqa: BLE001
        return default
    if isinstance(v, str):
        return v.lower() in ("true", "1", "yes")
    return bool(v)


def _settings_set(key: str, value) -> None:
    try:
        _settings().setValue(key, value)
    except Exception:  # noqa: BLE001
        pass


class ViewerWindow(QtWidgets.QMainWindow):
    """host: "standalone" または "maya" """

    def __init__(self, parent=None, host: str = "standalone"):
        super().__init__(parent)
        self.host = host
        self.current_path = None
        self.current_scene = None
        self._thread = None
        self._worker = None
        self._pending_open = None          # アニメーションの読み込みを中止したあとに開くファイル
        self._anim_scene = None            # アニメーションを読み込み中のシーン
        self._sel_job = None
        self._last_viewer_path = None

        self.setWindowTitle("Maya シーンビューア")
        self.setObjectName("MayaSceneViewerWindow")
        self.resize(1440, 880)
        self.setAcceptDrops(True)
        self.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose, True)

        self.viewer = ViewerWidget(self)
        self.setCentralWidget(self.viewer)
        self.viewer.logMessage.connect(self.log)
        self.viewer.nodeSelected.connect(self._on_viewer_selected)
        self.viewer.fileDropped.connect(self.open_file)

        self._build_log_dock()
        self._build_actions()
        self.statusBar().showMessage("準備完了")
        if not self.viewer.has_channel:
            self.log("warn", "ビューア→Python の通知が無効です（選択同期は使えません）。")
        if host == "maya":
            self._install_maya_selection_job()

    # ------------------------------------------------------------------ UI
    def _build_log_dock(self):
        self.log_view = QtWidgets.QPlainTextEdit()
        self.log_view.setReadOnly(True)
        self.log_view.setMaximumBlockCount(5000)
        self.log_dock = QtWidgets.QDockWidget("ログ", self)
        self.log_dock.setObjectName("MayaSceneViewerLog")
        self.log_dock.setWidget(self.log_view)
        self.addDockWidget(Qt.DockWidgetArea.BottomDockWidgetArea, self.log_dock)

        # 警告: ログと同じ下部のパネルに置き、タブで切り替える
        self.warn_list = QtWidgets.QListWidget()
        self.warn_list.setWordWrap(True)
        self.warn_list.setAlternatingRowColors(True)
        self.warn_list.setSelectionMode(QtWidgets.QAbstractItemView.SelectionMode.ExtendedSelection)
        copy_btn = QtWidgets.QPushButton("すべてコピー")
        copy_btn.clicked.connect(self.copy_warnings)
        box = QtWidgets.QWidget()
        lay = QtWidgets.QVBoxLayout(box)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.addWidget(self.warn_list, 1)
        row = QtWidgets.QHBoxLayout()
        row.addStretch(1)
        row.addWidget(copy_btn)
        lay.addLayout(row)
        self.warn_dock = QtWidgets.QDockWidget("警告", self)
        self.warn_dock.setObjectName("MayaSceneViewerWarnings")
        self.warn_dock.setWidget(box)
        self.addDockWidget(Qt.DockWidgetArea.BottomDockWidgetArea, self.warn_dock)
        self.tabifyDockWidget(self.log_dock, self.warn_dock)
        self.log_dock.hide()
        self.warn_dock.hide()

    def _act(self, text, slot, shortcut=None, checkable=False, checked=False, tip=None):
        a = QAction(text, self)
        if shortcut:
            a.setShortcut(QtGui.QKeySequence(shortcut))
            a.setShortcutContext(Qt.ShortcutContext.WindowShortcut)
        if checkable:
            a.setCheckable(True)
            a.setChecked(checked)
            a.toggled.connect(slot)
        else:
            a.triggered.connect(lambda *_: slot())
        if tip:
            a.setStatusTip(tip)
        return a

    def _build_actions(self):
        mb = self.menuBar()
        # 上部の Qt のツールバーは置かない（開く・再読み込みなどはすべて［ファイル］［Maya］メニューにある）

        a_open = self._act("開く…", self.open_dialog, "Ctrl+O", tip=".ma または共通 JSON を開く")
        a_reload = self._act("再読み込み", self.reload, "F5", tip="同じファイルを読み直す")
        a_export = self._act("JSON として書き出し…", self.export_json, "Ctrl+Shift+E")
        a_close = self._act("閉じる", self.close, "Ctrl+W")
        self.a_anim = self._act("アニメーションを読み込む", self._toggle_animation, checkable=True,
                                checked=_settings_bool("loadAnimation", True),
                                tip=".ma のアニメーションカーブを、シーンの表示後に読み込む（次に開くファイルから有効）")
        m = mb.addMenu("ファイル")
        for a in (a_open, a_reload, a_export):
            m.addAction(a)
        m.addSeparator()
        m.addAction(self.a_anim)
        m.addSeparator()
        m.addAction(a_close)

        # 元に戻す・やり直し。キー操作はビューア（Web 側）が受け取るので、ここでは表示だけにする
        # （Qt のショートカットにすると、数値入力欄での文字の取り消しまで奪ってしまうため）
        me = mb.addMenu("編集")
        self.a_undo = self._act("元に戻す\tCtrl+Z", self.viewer.undo)
        self.a_redo = self._act("やり直す\tCtrl+Y", self.viewer.redo)
        self.a_undo.setEnabled(False)
        self.a_redo.setEnabled(False)
        me.addAction(self.a_undo)
        me.addAction(self.a_redo)
        self.viewer.historyChanged.connect(self._on_history_changed)

        if self.host == "maya":
            a_scene = self._act("Maya シーンを読み込み", lambda: self.load_from_maya(False),
                                tip="現在の Maya シーンのメッシュとジョイントを表示")
            a_sel = self._act("選択から読み込み", lambda: self.load_from_maya(True),
                              tip="選択したノード以下のメッシュとジョイントだけを表示")
            a_pull = self._act("Maya の選択を反映", self.pull_maya_selection)
            self.a_sync = self._act("ビューアの選択を Maya に反映", lambda v: None, checkable=True, checked=True)
            self.a_follow = self._act("Maya の選択に追従", self._toggle_follow, checkable=True, checked=True)
            mm = mb.addMenu("Maya")
            for a in (a_scene, a_sel, a_pull):
                mm.addAction(a)
            mm.addSeparator()
            mm.addAction(self.a_sync)
            mm.addAction(self.a_follow)

        mv = mb.addMenu("表示")
        a_log = self.log_dock.toggleViewAction()
        a_log.setText("ログ")
        a_log.setShortcut(QtGui.QKeySequence("Ctrl+L"))
        mv.addAction(a_log)
        # 警告は下部のパネル（ログとタブで切り替え）
        self.a_warn = self.warn_dock.toggleViewAction()
        self.a_warn.setText("警告")
        mv.addAction(self.a_warn)
        self.a_rig = self._act("リグの診断…", self.show_rig_report,
                               tip="評価できないノード（自作ノードなど）と、IK の極ベクトル・ひねりの上流を一覧にする")
        mv.addAction(self.a_rig)
        mv.addAction(self._act("開発者ツール", self.viewer.open_dev_tools, "F12"))
        self.viewer.warningsChanged.connect(self._on_warnings_changed)
        self.viewer.showWarningsRequested.connect(self.show_warnings)
        mh = mb.addMenu("ヘルプ")
        mh.addAction(self._act("操作方法", self.show_help, "F1"))

    def _on_history_changed(self, can_undo, can_redo, undo_label, redo_label):
        self.a_undo.setEnabled(can_undo)
        self.a_redo.setEnabled(can_redo)
        self.a_undo.setText(("元に戻す: %s" % undo_label if can_undo else "元に戻す") + "\tCtrl+Z")
        self.a_redo.setText(("やり直す: %s" % redo_label if can_redo else "やり直す") + "\tCtrl+Y")

    def _on_warnings_changed(self, warnings):
        self.warn_list.clear()
        self.warn_list.addItems(warnings)
        title = "警告（%d 件）" % len(warnings) if warnings else "警告"
        self.warn_dock.setWindowTitle(title)
        self.a_warn.setText(title)

    def show_warnings(self):
        """下部のパネルで警告のタブを前面に出す"""
        self.warn_dock.show()
        self.warn_dock.raise_()

    def copy_warnings(self):
        QtWidgets.QApplication.clipboard().setText("\n".join(self.viewer.warnings))

    def show_rig_report(self):
        """リグの診断（.ma を読み直して、評価できないノードと IK の上流を一覧にする）"""
        path = self.current_path
        if not path or not path.lower().endswith(".ma"):
            QtWidgets.QMessageBox.information(self, "リグの診断", ".ma ファイルを開いているときに使えます。")
            return
        from .rig_report import format_verification, rig_report_file
        QtWidgets.QApplication.setOverrideCursor(Qt.CursorShape.WaitCursor)
        try:
            text = rig_report_file(path)
        except Exception as exc:  # noqa: BLE001  診断の失敗はメッセージで知らせる
            text = "診断できませんでした: %s" % exc
        finally:
            QtWidgets.QApplication.restoreOverrideCursor()

        def with_check(raw):
            # ビューアで、保存時のフレームの IK の結果をファイルの値と比べる
            try:
                result = json.loads(raw) if isinstance(raw, str) and raw not in ("", "null") else None
            except ValueError:
                result = None
            self._show_rig_report_dialog(path, format_verification(result) + "\n\n" + text)
        self.viewer.run_js("JSON.stringify(window.mayaViewer && window.mayaViewer.verifyRig())", with_check)

    def _show_rig_report_dialog(self, path, text):
        dlg = QtWidgets.QDialog(self)
        dlg.setWindowTitle("リグの診断 - %s" % os.path.basename(path))
        dlg.resize(820, 640)
        lay = QtWidgets.QVBoxLayout(dlg)
        view = QtWidgets.QPlainTextEdit(text)
        view.setReadOnly(True)
        view.setLineWrapMode(QtWidgets.QPlainTextEdit.LineWrapMode.NoWrap)
        lay.addWidget(view)
        row = QtWidgets.QHBoxLayout()
        row.addStretch(1)
        b_copy = QtWidgets.QPushButton("コピー")
        b_copy.clicked.connect(lambda: QtWidgets.QApplication.clipboard().setText(text))
        b_close = QtWidgets.QPushButton("閉じる")
        b_close.clicked.connect(dlg.accept)
        row.addWidget(b_copy)
        row.addWidget(b_close)
        lay.addLayout(row)
        self.rig_report_text = text            # テスト用
        self.rig_report_dialog = dlg
        dlg.show()

    def show_help(self):
        QtWidgets.QMessageBox.information(self, "操作方法", HELP_TEXT)

    # ------------------------------------------------------------------ ログ
    @Slot(str, str)
    def log(self, level, text):
        mark = {"error": "エラー", "warn": "警告"}.get(level, "情報")
        self.log_view.appendPlainText("%s [%s] %s" % (time.strftime("%H:%M:%S"), mark, text))
        if level == "error":
            self.log_dock.show()

    # ------------------------------------------------------------------ 読み込み
    def open_dialog(self):
        start = os.path.dirname(self.current_path) if self.current_path else ""
        path, _ = QtWidgets.QFileDialog.getOpenFileName(
            self, "ファイルを開く", start, "Maya ASCII / 共通 JSON (*.ma *.json);;Maya ASCII (*.ma);;JSON (*.json)")
        if path:
            self.open_file(path)

    def reload(self):
        if self.current_path:
            self.open_file(self.current_path)
        elif self.host == "maya" and self.current_scene is not None:
            self.load_from_maya(False)

    def open_file(self, path: str):
        path = os.path.abspath(path)
        if not os.path.isfile(path):
            self._error("ファイルが見つかりません:\n%s" % path)
            return
        if path.lower().endswith(".mb"):
            self._error("Maya バイナリ (.mb) は読み込めません。Maya で .ma として保存し直してください。")
            return
        if not path.lower().endswith((".ma", ".json")):
            self._error(".ma または .json を指定してください。")
            return
        if self._thread is not None:
            if self._worker is not None and self._worker.in_animation:
                # アニメーションの読み込み中なら中止して、終わりしだい新しいファイルを開く
                self._pending_open = path
                self._worker.cancel()
                self.viewer.set_animation_status("")
                return
            self.statusBar().showMessage("読み込み中です。完了してから開き直してください。", 5000)
            return
        self.current_path = path
        name = os.path.basename(path)
        self.setWindowTitle("%s - Maya シーンビューア" % name)
        self.viewer.show_loading("%s を読み込み中" % name)
        self.statusBar().showMessage("読み込み中: %s" % path)
        self.log("info", "読み込み開始: %s" % path)

        self._thread = QtCore.QThread(self)
        self._worker = _LoadWorker(path, animation=self.a_anim.isChecked())
        self._worker.moveToThread(self._thread)
        self._thread.started.connect(self._worker.run)
        self._worker.progress.connect(self._on_progress)
        self._worker.finished.connect(self._on_loaded)
        self._worker.failed.connect(self._on_failed)
        self._worker.animationProgress.connect(self._on_animation_progress)
        self._worker.animationReady.connect(self._on_animation_ready)
        self._worker.animationFailed.connect(self._on_animation_failed)
        self._worker.done.connect(self._thread.quit)
        self._thread.finished.connect(self._on_thread_finished)
        self._thread.start()

    @Slot(float, str)
    def _on_progress(self, frac, msg):
        self.viewer.show_loading(msg, frac)
        self.statusBar().showMessage(msg)

    @Slot(object, float)
    def _on_loaded(self, scene, seconds):
        self.show_scene(scene, "解析 %.2f 秒" % seconds)
        self._anim_scene = scene           # このシーンのアニメーションだけを受け取る
        if self._worker is not None and self._worker.animation and not self.current_path.lower().endswith(".json"):
            self.viewer.set_animation_status("アニメーションを読み込み中")

    @Slot(float, str)
    def _on_animation_progress(self, frac, msg):
        if self._pending_open is None:
            self.viewer.set_animation_status(msg)

    @Slot(object, float)
    def _on_animation_ready(self, anim, seconds):
        if self._pending_open is not None or self.current_scene is None or self.current_scene is not self._anim_scene:
            return
        if anim is None:
            self.viewer.set_animation_status("")
            return
        self.current_scene["animation"] = anim
        size = self.viewer.set_animation(anim)
        st = anim.get("stats", {})
        for w in anim.get("warnings", []):
            self.log("warn", w)
        amount = "%.1f MB" % (size / 1048576.0) if size >= 1048576 else "%d KB" % max(1, size // 1024)
        msg = "アニメーション: カーブ %s 本・キー %s 個・ノード %s 個（解析 %.2f 秒・転送 %s）" % (
            "{:,}".format(st.get("curves", 0)), "{:,}".format(st.get("keys", 0)), "{:,}".format(st.get("nodes", 0)),
            seconds, amount)
        self.statusBar().showMessage(msg, 8000)
        self.log("info", msg)

    @Slot(str, str)
    def _on_animation_failed(self, message, detail):
        if detail:
            self.log("error", detail)
        self.viewer.set_animation_status("アニメーションを読み込めませんでした: %s" % message)
        self.log("warn", "アニメーションを読み込めませんでした（シーンはそのまま表示します）: %s" % message)

    def _toggle_animation(self, on):
        _settings_set("loadAnimation", bool(on))
        self.statusBar().showMessage("アニメーションを%s（次に開くファイルから）" % ("読み込みます" if on else "読み込みません"),
                                     5000)

    @Slot(str, str)
    def _on_failed(self, message, detail):
        if detail:
            self.log("error", detail)
        self._error("読み込めませんでした。\n%s" % message)

    def _on_thread_finished(self):
        if self._worker is not None:
            self._worker.deleteLater()
        if self._thread is not None:
            self._thread.deleteLater()
        self._worker = None
        self._thread = None
        if self._pending_open is not None:
            path, self._pending_open = self._pending_open, None
            self.open_file(path)

    def show_scene(self, scene: dict, note: str = ""):
        """共通 JSON をビューアに表示する（Maya 抽出や外部ツールからも使える）。"""
        self.current_scene = scene
        st = scene.get("stats", {})
        size = self.viewer.set_scene(scene)
        for w in scene.get("warnings", []):
            self.log("warn", w)
        try:
            from .extract_ma import LAST_TIMING
            if LAST_TIMING and (scene.get("source") or {}).get("kind") == "ma":
                self.log("info", "読み込みの内訳（Python）: .ma の解析 %.2f 秒・変換 %.2f 秒・JSON の文字列化 %.2f 秒"
                         "（処理した文 %s・読み飛ばした文 %s・numpy %s）"
                         % (LAST_TIMING["parse"], LAST_TIMING["convert"], self.viewer.last_dump_seconds,
                            "{:,}".format(LAST_TIMING.get("statements", 0)), "{:,}".format(LAST_TIMING.get("skipped", 0)),
                            "あり" if LAST_TIMING.get("numpy") else "なし"))
                if LAST_TIMING.get("top_parse"):
                    self.log("info", "解析の内訳: ファイルの読み込み %.2f 秒・文の切り出しと読み飛ばし %.2f 秒・%s" % (
                        LAST_TIMING.get("read", 0.0), LAST_TIMING.get("parse_other", 0.0),
                        "・".join("%s %.2f 秒（%s 文・%.1f MB）" % (k, sec, "{:,}".format(n), size / 1e6)
                                 for k, sec, n, size in LAST_TIMING["top_parse"])))
                if LAST_TIMING.get("fast"):
                    self.log("info", "速い経路の利用状況: " + "・".join(
                        "%s %s 件" % (k, "{:,}".format(v)) for k, v in sorted(LAST_TIMING["fast"].items())))
                if LAST_TIMING.get("top_convert"):
                    self.log("info", "変換の内訳: " + "・".join(
                        "%s %.2f 秒" % (k, sec) for k, sec in LAST_TIMING["top_convert"]))
        except Exception:     # noqa: BLE001  計測の失敗で読み込みを止めない
            pass
        amount = "%.1f MB" % (size / 1048576.0) if size >= 1048576 else "%d KB" % max(1, size // 1024)
        msg = "メッシュ %s ・ 頂点 %s ・ ジョイント %s ・ 転送 %s" % (
            st.get("meshes", len(scene.get("meshes", []))), "{:,}".format(st.get("vertices", 0)),
            st.get("joints", "?"), amount)
        if note:
            msg += " ・ " + note
        self.statusBar().showMessage(msg)
        self.log("info", msg)

    def _error(self, text):
        self.viewer.show_error(text)
        self.statusBar().showMessage(text.splitlines()[0], 8000)
        self.log("error", text)

    def export_json(self):
        if self.current_scene is None:
            QtWidgets.QMessageBox.information(self, "JSON として書き出し", "先にシーンを読み込んでください。")
            return
        base = os.path.splitext(self.current_path)[0] + ".json" if self.current_path else "scene.json"
        path, _ = QtWidgets.QFileDialog.getSaveFileName(self, "JSON として書き出し", base, "JSON (*.json)")
        if not path:
            return
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.current_scene, f, ensure_ascii=False, separators=(",", ":"))
        self.statusBar().showMessage("書き出しました: %s" % path, 6000)
        self.log("info", "書き出しました: %s" % path)

    # ------------------------------------------------------------------ ドロップ
    @staticmethod
    def _dropped_path(event):
        md = event.mimeData()
        if md.hasUrls():
            for url in md.urls():
                if url.isLocalFile() and url.toLocalFile().lower().endswith(OPENABLE_EXT):
                    return url.toLocalFile()
        return None

    def dragEnterEvent(self, event):
        if self._dropped_path(event):
            event.acceptProposedAction()
        else:
            event.ignore()

    def dragMoveEvent(self, event):
        if self._dropped_path(event):
            event.acceptProposedAction()

    def dropEvent(self, event):
        path = self._dropped_path(event)
        if path:
            event.acceptProposedAction()
            self.open_file(path)

    # ------------------------------------------------------------------ Maya 連携
    def load_from_maya(self, selection_only: bool = False):
        from . import extract_maya
        self.current_path = None
        QtWidgets.QApplication.setOverrideCursor(Qt.CursorShape.WaitCursor)
        t0 = time.time()
        try:
            self.viewer.show_loading("Maya からデータを取得中")
            QtWidgets.QApplication.processEvents()
            scene = extract_maya.extract_scene(selection_only=selection_only)
        except Exception as exc:  # noqa: BLE001
            self.log("error", traceback.format_exc())
            self._error("Maya からデータを取得できませんでした。\n%s" % exc)
            return
        finally:
            QtWidgets.QApplication.restoreOverrideCursor()
        name = scene.get("source", {}).get("name") or "Maya シーン"
        self.setWindowTitle("%s - Maya シーンビューア" % name)
        self.show_scene(scene, "取得 %.2f 秒" % (time.time() - t0))

    def _on_viewer_selected(self, path):
        self._last_viewer_path = path
        self.statusBar().showMessage("選択: %s" % path, 4000)
        if self.host != "maya" or not self.a_sync.isChecked():
            return
        try:
            from maya import cmds
            if cmds.objExists(path):
                cmds.select(path, replace=True)
            else:
                self.log("warn", "Maya のシーンに %s がありません（選択を反映できません）" % path)
        except Exception as exc:  # noqa: BLE001
            self.log("warn", "Maya の選択を変更できませんでした: %s" % exc)

    def pull_maya_selection(self):
        try:
            from maya import cmds
        except ImportError:
            return
        sel = cmds.ls(selection=True, long=True) or []
        if sel:
            self.viewer.select_path(sel[0])

    def _on_maya_selection_changed(self):
        try:
            if not self.a_follow.isChecked():
                return
            from maya import cmds
            sel = cmds.ls(selection=True, long=True) or []
            if sel and sel[0] != self._last_viewer_path:
                self.viewer.select_path(sel[0])
        except Exception:  # noqa: BLE001  ウィンドウ破棄中などは無視
            pass

    def _toggle_follow(self, on):
        if on and self._sel_job is None:
            self._install_maya_selection_job()

    def _install_maya_selection_job(self):
        try:
            from maya import cmds
            self._sel_job = cmds.scriptJob(event=["SelectionChanged", self._on_maya_selection_changed])
        except Exception as exc:  # noqa: BLE001
            self._sel_job = None
            self.log("warn", "Maya の選択監視を開始できませんでした: %s" % exc)

    def _remove_maya_selection_job(self):
        if self._sel_job is None:
            return
        try:
            from maya import cmds
            if cmds.scriptJob(exists=self._sel_job):
                cmds.scriptJob(kill=self._sel_job, force=True)
        except Exception:  # noqa: BLE001
            pass
        self._sel_job = None

    # ------------------------------------------------------------------
    def closeEvent(self, event):
        self._remove_maya_selection_job()
        if self._worker is not None:
            self._worker.cancel()
        if self._thread is not None:
            self._thread.quit()
            self._thread.wait(3000)
        super().closeEvent(event)

