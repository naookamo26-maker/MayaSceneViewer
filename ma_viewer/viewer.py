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
from typing import Optional

from .qt_compat import (QAction, QWebChannel, QWebEnginePage, QWebEngineScript, QWebEngineSettings,
                        QWebEngineView, QtCore, QtGui, QtWidgets, Qt, Signal, Slot, require_webengine,
                        run_javascript)

from . import schema  # noqa: E402
from .resources import index_html  # noqa: E402
from .resources import APP_NAME  # noqa: E402  ソフト名（ウィンドウのタイトルなど。英語表記）  web 一式の場所（exe 化しても見つかるように探す）
CHUNK_SIZE = 4 * 1024 * 1024          # runJavaScript 1 回あたりの文字数（4 の倍数: 配列の base64 をかけらごとに戻すため）
OPENABLE_EXT = (".ma", ".json", ".msv", ".mb")
DATA_EXT = (".json", ".msv")      # 変換済みのデータ（解析しない。アニメーションも一緒に入っている）


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
    statusSignal = Signal(str, int)
    loadEventSignal = Signal(str, str)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.allowed_files = set()   # JS に渡してよいファイル（読み込んだシーンのテクスチャ）
        self.package_path = None     # 開いている .msv（同梱のテクスチャを渡す）
        self.package_names = set()   # JS に渡してよい .msv の中の名前

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

    @Slot(str, int)
    def statusMessage(self, text, ms):
        """ビューアの操作のメッセージ（Qt ではウィンドウのステータスバーに出す。ms = 0 なら消さない）"""
        self.statusSignal.emit(text, ms)

    @Slot(str)
    def copyText(self, text):
        """ビューアの文字をクリップボードにコピーする（評価のプロファイラの［テキストでコピー］）"""
        QtWidgets.QApplication.clipboard().setText(text)

    @Slot(str, str)
    def loadEvent(self, name, detail):
        """読み込みの段階がビューアで終わった（scene: 最初の描画・animation: アニメーションの準備・cache: 再生キャッシュ）"""
        self.loadEventSignal.emit(name, detail)

    # JS から保存・読み戻しできる設定（キー → QSettings のキー）
    SAVED_SETTINGS = {"playbackCacheMB": "viewer/playbackCacheMB", "playbackCachePrecision": "viewer/playbackCachePrecision",
                      "ikChainSolver": "viewer/ikChainSolver"}

    @Slot(str, str)
    def saveSetting(self, key, value):
        """JS の設定を保存する（次回の起動で loadSetting から読み戻す）。決まったキーだけ受け付ける。"""
        if key in self.SAVED_SETTINGS:
            _settings_set(self.SAVED_SETTINGS[key], str(value))

    @Slot(str, result=str)
    def loadSetting(self, key):
        """保存した JS の設定（なければ空文字）。"""
        if key not in self.SAVED_SETTINGS:
            return ""
        try:
            v = _settings().value(self.SAVED_SETTINGS[key], "")
        except Exception:  # noqa: BLE001
            return ""
        return "" if v is None else str(v)

    @Slot(str, result=str)
    def readPackedBase64(self, name):
        """.msv に同梱したテクスチャを JS に渡す（zip の中から読む。展開したファイルは作らない）。"""
        if not self.package_path or name not in self.package_names:
            self.logSignal.emit("warn", "シーンに含まれないデータの読み込み要求を拒否しました: %s" % name)
            return ""
        try:
            from .package import Package
            return base64.b64encode(Package(self.package_path).read(name)).decode("ascii")
        except Exception as exc:  # noqa: BLE001
            self.logSignal.emit("warn", "同梱のテクスチャを読めません: %s（%s）" % (name, exc))
            return ""

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
    statusMessage = Signal(str, int)                # ビューアの操作のメッセージ（ステータスバーへ）
    loadEvent = Signal(str, str)                    # 読み込みの段階がビューアで終わった

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
        self.warnings_text = ""                       # 分類ごとに見出し・仕切りで分けた文章（ビューアが作る）
        self.bridge.warningsSignal.connect(self._on_warnings)
        self.bridge.showWarningsSignal.connect(self.showWarningsRequested)
        self.bridge.logSignal.connect(self.logMessage)
        self.bridge.statusSignal.connect(self.statusMessage)
        self.bridge.loadEventSignal.connect(self.loadEvent)
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

    def set_scene(self, scene: dict, message: str = "シーンを転送中", payload: Optional[Payload] = None):
        """共通 JSON（dict）をビューアに送る。大きなデータは分割して送る。
        payload: 読み込みスレッドで文字列にしておいたもの（なければここで文字列にする）"""
        self.bridge.allowed_files = {os.path.normcase(os.path.abspath(t["resolved"]))
                                     for t in scene.get("textures") or [] if t.get("resolved")}
        pkg_path = (scene.get("source") or {}).get("packagePath")
        self.bridge.package_path = pkg_path
        self.bridge.package_names = set()
        if pkg_path:
            for t in scene.get("textures") or []:
                self.bridge.package_names.update(x["packed"] for x in [t] + list(t.get("tiles") or []) if x.get("packed"))
        payload = payload or Payload.of(scene)
        self.last_dump_seconds = payload.seconds
        return self._transfer(scene, payload, "beginTransfer", "endTransfer", message)

    def _transfer(self, data, payload: "Payload", begin: str, end: str, message: Optional[str] = None) -> int:
        """data を分割して送る。大きな数値の配列は JSON から抜き出して先に 1 つずつ送り（ビューアがその場でバイト列に
        戻す）、そのあと JSON の骨組みを送る。ブラウザの文字列の上限（約 5.3 億文字）を超えるシーンも送れる。
        戻り値: 送った文字数"""
        skeleton, blobs = schema.split_blobs(data)
        text = payload.text if not blobs else json.dumps(skeleton, ensure_ascii=True, separators=(",", ":"))
        total = len(text) + sum(len(b) for b in blobs)
        if message is None:
            self._call(begin, total)
        else:
            self._call(begin, message, total)
        for b in blobs:
            # かけらの長さは 4 の倍数（base64 の区切り。ビューアはかけらごとにバイト列に戻す）
            for i in range(0, len(b), CHUNK_SIZE):
                self.run_js("window.mayaViewer.appendBlobChunk(%s)" % json.dumps(b[i:i + CHUNK_SIZE]))
            self.run_js("window.mayaViewer.endBlob()")
        for i in range(0, len(text), CHUNK_SIZE):
            self.run_js("window.mayaViewer.appendChunk(%s)" % json.dumps(text[i:i + CHUNK_SIZE]))
        self._call(end)
        return total

    def set_animation(self, anim: dict, payload: Optional[Payload] = None):
        """アニメーション（共通 JSON の animation）を送る。シーンを送ったあとに呼ぶ。
        payload: 読み込みスレッドで文字列にしておいたもの（なければここで文字列にする）"""
        payload = payload or Payload.of(anim)
        self.last_dump_seconds = payload.seconds
        return self._transfer(anim, payload, "beginAnimationTransfer", "endAnimationTransfer")

    def set_animation_status(self, text: str):
        """アニメーションの読み込み状況（タイムラインに表示）"""
        self._call("setAnimationStatus", text)

    def select_path(self, path: str):
        self._call("selectByPath", path)

    def select_paths(self, paths):
        """パスの一覧で選ぶ（最後がリード。Maya の選択に合わせるとき）"""
        self._call("selectByPaths", list(paths))

    def show_loading(self, text: str, frac: float = -1.0, sub_text: str = "", sub_frac: float = -1.0):
        """読み込み中の表示。sub_text・sub_frac はいま読んでいるファイル（リファレンスがあるときの 2 段目）"""
        self._call("showLoading", text, frac, sub_text, sub_frac)

    def hide_loading(self):
        self._call("hideLoading")

    def show_error(self, text: str):
        self._call("showError", text)

    def set_message(self, text: str):
        self._call("setMessage", text)

    def clear(self):
        self._call("clear")

    def _on_warnings(self, text):
        """警告の一覧（{ list: [文章], text: 分類ごとに見出し・仕切りで分けた文章 }。古い形の配列も受け取る）"""
        try:
            data = json.loads(text)
        except ValueError:
            data = []
        if isinstance(data, dict):
            self.warnings = [str(w) for w in data.get("list") or []]
            self.warnings_text = str(data.get("text") or "")
        else:
            self.warnings = [str(w) for w in data] if isinstance(data, list) else []
            self.warnings_text = "\n".join(self.warnings)
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
            self._dev_view.setWindowTitle("開発者ツール - %s" % APP_NAME)
            self._dev_view.resize(1000, 700)
            self.page.setDevToolsPage(self._dev_view.page())
        self._dev_view.show()
        self._dev_view.raise_()


# ---------------------------------------------------------------------------
# 読み込みスレッド
# ---------------------------------------------------------------------------

class Payload:
    """ビューアに送る JSON の文字列と、文字列にかかった秒数。大きなシーンでは文字列にするのに時間がかかるので、
    読み込みスレッドで作っておき、画面のスレッドを止めない"""
    __slots__ = ("text", "seconds", "cached")

    def __init__(self, text: str, seconds: float, cached: bool = False):
        self.text = text
        self.seconds = seconds
        self.cached = cached          # 変換結果のキャッシュから読んだもの

    @classmethod
    def of(cls, data) -> "Payload":
        t0 = time.perf_counter()
        text = json.dumps(data, ensure_ascii=True, separators=(",", ":"))
        return cls(text, time.perf_counter() - t0)


class _LoadWorker(QtCore.QObject):
    """読み込みは 2 段階: シーン（finished）を先に渡して表示し、そのあとアニメーション（animationReady）を読む。"""
    progress = Signal(float, str, str, float)   # 全体の割合, 文言, いま読んでいるファイルの文言・割合（なければ "", -1）
    finished = Signal(object, float, object)   # シーン, 秒, 文字列にしたもの（Payload）
    failed = Signal(str, str)
    animationProgress = Signal(float, str)
    animationReady = Signal(object, float, object)   # animation（なければ None）, 秒, 文字列にしたもの（Payload か None）
    animationFailed = Signal(str, str)
    done = Signal()

    def __init__(self, path: str, animation: bool = True, references: bool = True, cache: bool = True, staged=None):
        super().__init__()
        self.path = path
        # 読み込みの関数（進捗 → (シーン, アニメーションを読む関数)）。Maya で開いているシーン（maya_scene.load_staged）
        self.staged = staged
        self.animation = animation
        self.references = references
        self.cache = cache            # 変換結果のディスクキャッシュを使う・保存する（scene_cache）
        self.in_animation = False
        self._cancel = False
        self._last = 0.0

    def cancel(self):
        self._cancel = True

    def _progress(self, frac, msg, detail=None):
        if self._cancel:
            raise _Cancelled()
        now = time.time()
        if now - self._last > 0.25 or frac >= 1.0:      # 再描画の負荷を抑えるため、更新は毎秒 4 回まで
            self._last = now
            if self.in_animation:
                self.animationProgress.emit(frac, msg)
            else:
                sub_text, sub_frac = detail if detail else ("", -1.0)
                self.progress.emit(frac, msg, sub_text, float(sub_frac))

    @Slot()
    def run(self):
        t0 = time.time()
        load_animation = None
        try:
            if self.staged is not None:
                scene, load_animation = self.staged(self._progress)
            elif self.path.lower().endswith(".msv"):
                from .package import read_package
                scene, _pkg = read_package(self.path)
            elif self.path.lower().endswith(".json"):
                from . import schema
                with open(self.path, encoding="utf-8") as f:
                    scene = json.load(f)
                schema.validate(scene)
                scene.setdefault("source", {}).setdefault("name", os.path.basename(self.path))
            else:
                if self._load_cached(t0):
                    self.done.emit()
                    return
                from .extract_ma import load_ma_staged
                scene, load_animation = load_ma_staged(self.path, progress=self._progress,
                                                       references=self.references)
            seconds = time.time() - t0
            payload = Payload.of(scene)
            self.finished.emit(scene, seconds, payload)
            if load_animation is not None:
                self._store_scene(load_animation, payload)
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
                seconds = time.time() - t1
                if not self._cancel:
                    apayload = Payload.of(anim) if anim is not None else None
                    self.animationReady.emit(anim, seconds, apayload)
                    self._store_animation(apayload)
            except _Cancelled:
                pass
            except Exception as exc:  # noqa: BLE001  アニメーションが読めなくてもシーンは表示したままにする
                self.animationFailed.emit(str(exc), traceback.format_exc())
        self.done.emit()

    # ---- 変換結果のディスクキャッシュ（scene_cache）
    def _load_cached(self, t0: float) -> bool:
        """保存した変換結果が使えれば、それをシーン・アニメーションとして渡して True"""
        if not self.cache:
            return False
        try:
            from . import scene_cache
            hit = scene_cache.lookup(self.path, self.references, self.animation)
            if hit is None:
                return False
            scene = json.loads(hit.scene_text)
            anim = json.loads(hit.anim_text) if self.animation and hit.anim_text else None
        except Exception:  # noqa: BLE001  キャッシュが読めなければ、ふつうに読み込む
            return False
        from .extract_ma import LAST_TIMING
        LAST_TIMING.clear()
        self.finished.emit(scene, time.time() - t0, Payload(hit.scene_text, 0.0, cached=True))
        if self.animation and not self._cancel:
            self.in_animation = True
            self.animationReady.emit(anim, 0.0, Payload(hit.anim_text, 0.0, cached=True) if anim is not None else None)
        return True

    def _store_scene(self, load_animation, payload: "Payload") -> None:
        self._cache_ok = False
        if not self.cache:
            return
        try:
            from . import scene_cache
            from .extract_ma import LAST_TIMING
            ms = getattr(load_animation, "scene", None)
            if ms is not None:
                timing = {k: LAST_TIMING.get(k) for k in ("parse", "convert") if k in LAST_TIMING}
                self._cache_ok = scene_cache.store_scene(self.path, self.references, scene_cache.record(ms, self.path),
                                                         payload.text, timing)
        except Exception:  # noqa: BLE001  保存の失敗で読み込みを止めない
            self._cache_ok = False

    def _store_animation(self, payload: "Optional[Payload]") -> None:
        if not self.cache or not getattr(self, "_cache_ok", False):
            return
        try:
            from . import scene_cache
            scene_cache.store_animation(self.path, self.references, payload.text if payload is not None else None)
        except Exception:  # noqa: BLE001
            pass


# ---------------------------------------------------------------------------
# ウィンドウ
# ---------------------------------------------------------------------------

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
        self._maya_selection = False       # Maya から読んだのが選択範囲だけか（読み直しで使う）

        self.setWindowTitle(APP_NAME)
        self.setObjectName("MayaSceneViewerWindow")
        self.resize(1440, 880)
        self.setAcceptDrops(True)
        self.setAttribute(Qt.WidgetAttribute.WA_DeleteOnClose, True)

        self.viewer = ViewerWidget(self)
        self.setCentralWidget(self.viewer)
        self.viewer.logMessage.connect(self.log)
        self.viewer.statusMessage.connect(lambda text, ms: self.statusBar().showMessage(text, ms))
        self.viewer.loadEvent.connect(self._on_load_event)
        self.load_clock = None
        self.viewer.nodeSelected.connect(self._on_viewer_selected)
        self.viewer.fileDropped.connect(self.open_file)

        self._build_log_dock()
        self._build_actions()
        self.statusBar().showMessage("準備完了")
        self.log("info", self.version_text())
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
        # 一覧は分類ごとに見出し・仕切り線・空行で分けた文章（ビューアの warnGroups.js が分ける）
        self.warn_view = QtWidgets.QPlainTextEdit()
        self.warn_view.setReadOnly(True)
        self.warn_view.setPlainText("警告はありません。")
        copy_btn = QtWidgets.QPushButton("すべてコピー")
        copy_btn.clicked.connect(self.copy_warnings)
        box = QtWidgets.QWidget()
        lay = QtWidgets.QVBoxLayout(box)
        lay.setContentsMargins(0, 0, 0, 0)
        lay.addWidget(self.warn_view, 1)
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
        from .option_menu import OptionBoxMenu

        a_new = self._act("新規シーン", self.new_scene, "Ctrl+N", tip="表示中のシーンを閉じて、何も開いていない状態にする")
        a_open = self._act("開く…", self.open_dialog, "Ctrl+O", tip=".ma・パッケージ（.msv）・共通 JSON を開く")
        a_reload = self._act("再読み込み", self.reload, "F5", tip="同じファイルを読み直す")
        # 共通 JSON の書き出しはコマンド（python -m ma_viewer export。.msv からも戻せる）で行う
        a_export_pkg = self._act("パッケージ（.msv）として書き出し…", self.export_package, "Ctrl+Shift+E",
                                 tip="前回の設定で、テクスチャ（既定はアルベドのみ）と表示の状態を入れた小さな 1 ファイルにする")
        self.a_export_pkg = a_export_pkg
        a_close = self._act("閉じる", self.close, "Ctrl+W")
        self.a_anim = self._act("アニメーションを読み込む", self._toggle_animation, checkable=True,
                                checked=_settings_bool("loadAnimation", True),
                                tip=".ma のアニメーションカーブを、シーンの表示後に読み込む（次に開くファイルから有効）")
        self.a_refs = self._act("リファレンスを読み込む", self._toggle_references, checkable=True,
                                checked=_settings_bool("loadReferences", True),
                                tip=".ma のリファレンス（file -r）の中身も読み込む（次に開くファイルから有効。F5 で読み直し）")
        self.a_cache = self._act("変換結果をキャッシュする", self._toggle_cache, checkable=True,
                                 checked=_settings_bool("sceneCache", True),
                                 tip="変換した結果を保存し、同じ .ma（リファレンス・テクスチャも同じ）を開き直すときは解析を省く"
                                     "（次に開くファイルから有効）")
        a_clear_cache = self._act("キャッシュを消去", self.clear_scene_cache,
                                  tip="保存した変換結果をすべて消す")
        # 変換結果のキャッシュの上限（既定 256 MB。1 シーンは元の .ma のおよそ 1 割）
        from . import scene_cache
        try:
            limit_mb = int(_settings().value("sceneCacheMB", scene_cache.DEFAULT_LIMIT_MB))
        except (TypeError, ValueError):
            limit_mb = scene_cache.DEFAULT_LIMIT_MB
        scene_cache.set_limit_mb(limit_mb)
        self.a_cache_usage = QtGui.QAction("使用量: -", self)
        self.a_cache_usage.setEnabled(False)
        self.cache_limit_actions = {}
        limit_group = QtGui.QActionGroup(self)
        for size_mb in (128, 256, 512, 1024, 2048):
            a = QtGui.QAction("上限 %s" % ("%d GB" % (size_mb // 1024) if size_mb >= 1024 else "%d MB" % size_mb), self,
                              checkable=True)
            a.setChecked(size_mb == limit_mb)
            a.triggered.connect(lambda _c=False, v=size_mb: self.set_scene_cache_limit(v))
            limit_group.addAction(a)
            self.cache_limit_actions[size_mb] = a
        # ［ファイル］はファイルの操作だけ。読み込みの設定（アニメーション・リファレンス・キャッシュ）は［設定］
        m = OptionBoxMenu("ファイル", self)
        mb.addMenu(m)
        self.file_menu = m
        m.addAction(a_new)
        m.addSeparator()
        m.addAction(a_open)
        m.addAction(a_reload)
        m.addSeparator()
        m.addAction(a_export_pkg)
        m.set_option_box(a_export_pkg, self.export_package_options)
        m.addSeparator()
        m.addAction(a_close)
        ms = QtWidgets.QMenu("設定", self)           # 並びは［ヘルプ］の前（下で追加）
        self.settings_menu = ms
        ms.addAction(self.a_anim)
        ms.addAction(self.a_refs)
        ms.addSeparator()
        mc = ms.addMenu("変換結果のキャッシュ")
        mc.addAction(self.a_cache)
        mc.addSeparator()
        mc.addAction(self.a_cache_usage)
        for a in self.cache_limit_actions.values():
            mc.addAction(a)
        mc.addSeparator()
        mc.addAction(a_clear_cache)
        mc.aboutToShow.connect(self._update_cache_usage)
        self.cache_menu = mc

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

        mv = mb.addMenu("ウインドウ")
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
        self.a_profiler = self._act("評価のプロファイラ", self.show_profiler,
                                    tip="再生中の 1 フレームの処理の内訳と、リグの評価の種類ごとの時間・再生キャッシュの状態を表示する")
        mv.addAction(self.a_profiler)
        mv.addSeparator()
        mv.addAction(self._act("開発者ツール", self.viewer.open_dev_tools, "F12"))
        self.viewer.warningsChanged.connect(self._on_warnings_changed)
        self.viewer.showWarningsRequested.connect(self.show_warnings)
        mb.addMenu(ms)
        mh = mb.addMenu("ヘルプ")
        mh.addAction(self._act("操作方法", self.show_help, "F1"))
        mh.addSeparator()
        mh.addAction(self._act("バージョン情報…", self.show_about))

    def _on_history_changed(self, can_undo, can_redo, undo_label, redo_label):
        self.a_undo.setEnabled(can_undo)
        self.a_redo.setEnabled(can_redo)
        self.a_undo.setText(("元に戻す: %s" % undo_label if can_undo else "元に戻す") + "\tCtrl+Z")
        self.a_redo.setText(("やり直す: %s" % redo_label if can_redo else "やり直す") + "\tCtrl+Y")

    def _on_warnings_changed(self, warnings):
        self.warn_view.setPlainText(self.viewer.warnings_text if warnings else "警告はありません。")
        title = "警告（%d 件）" % len(warnings) if warnings else "警告"
        self.warn_dock.setWindowTitle(title)
        self.a_warn.setText(title)

    def show_warnings(self):
        """下部のパネルで警告のタブを前面に出す"""
        self.warn_dock.show()
        self.warn_dock.raise_()

    def copy_warnings(self):
        QtWidgets.QApplication.clipboard().setText(self.viewer.warnings_text if self.viewer.warnings else "")

    def show_profiler(self):
        """［ウインドウ］→［評価のプロファイラ］: ビューアの上に重ねるパネルを開く（profilerPanel.js）"""
        self.viewer.run_js("window.mayaViewer && window.mayaViewer.showProfiler()")

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
        """リグの診断のウィンドウ（操作方法と同じく、左の項目の一覧から選んで表示する。report_dialog.py）"""
        from .report_dialog import show_report
        dlg = show_report(self, "リグの診断 - %s" % os.path.basename(path), text)
        self.rig_report_text = text            # テスト用
        self.rig_report_dialog = dlg

    @staticmethod
    def version_env() -> str:
        """動いている環境（Python・PySide6・Qt のバージョン）"""
        import platform
        try:
            import PySide6
            qt = "PySide6 %s・Qt %s" % (PySide6.__version__, QtCore.qVersion())
        except Exception:  # noqa: BLE001
            qt = "Qt %s" % QtCore.qVersion()
        return "Python %s・%s" % (platform.python_version(), qt)

    @classmethod
    def version_text(cls) -> str:
        """ソフト名・バージョンと、動いている環境（ログ用）"""
        from . import __version__
        return "%s %s（%s）" % (APP_NAME, __version__, cls.version_env())

    def show_about(self):
        """［ヘルプ］→［バージョン情報］"""
        from . import __version__
        from .package import pillow_status
        ok, _why = pillow_status()
        QtWidgets.QMessageBox.about(
            self, "バージョン情報",
            "<h3>%s</h3><p>バージョン %s</p><p>%s</p><p>テクスチャの WebP 変換（Pillow）: %s</p>"
            % (APP_NAME, __version__, self.version_env(), "使える" if ok else "使えない"))

    def show_help(self):
        from .help_dialog import show_help
        show_help(self, index_html())

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
            self, "ファイルを開く", start, "Maya ASCII / パッケージ / 共通 JSON (*.ma *.msv *.json);;Maya ASCII (*.ma);;パッケージ (*.msv);;JSON (*.json)")
        if path:
            self.open_file(path)

    def new_scene(self):
        """［ファイル］→［新規シーン］（Ctrl+N）: 表示中のシーンを閉じて、何も開いていない状態にする"""
        if self._thread is not None:
            if self._worker is not None and self._worker.in_animation:
                self._pending_open = None
                self._worker.cancel()                  # アニメーションの読み込みは中止する（シーンは消す）
            else:
                self.statusBar().showMessage("読み込み中です。完了してから新規シーンにしてください。", 5000)
                return
        self.current_path = None
        self.current_scene = None
        self._anim_scene = None
        self.load_clock = None
        self.viewer.set_animation_status("")
        self.viewer.clear()
        self.setWindowTitle(APP_NAME)
        self.statusBar().showMessage("新規シーン", 4000)
        self.log("info", "新規シーン（表示していたシーンを閉じました）")

    def reload(self):
        if self.current_path:
            self.open_file(self.current_path)
        elif self.host == "maya" and self.current_scene is not None:
            self.load_from_maya(self._maya_selection)

    def open_file(self, path: str):
        path = os.path.abspath(path)
        if not os.path.isfile(path):
            self._error("ファイルが見つかりません:\n%s" % path)
            return
        if path.lower().endswith(".mb"):
            self._error("Maya バイナリ (.mb) は読み込めません。Maya で .ma として保存し直してください。")
            return
        if not path.lower().endswith((".ma",) + DATA_EXT):
            self._error(".ma・.msv・.json のどれかを指定してください。")
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
        self.setWindowTitle("%s - %s" % (name, APP_NAME))
        self.viewer.show_loading("%s を読み込み中" % name)
        self.statusBar().showMessage("読み込み中: %s" % path)
        self.log("info", "読み込み開始: %s" % path)
        self._start_worker(_LoadWorker(path, animation=self.a_anim.isChecked(), references=self.a_refs.isChecked(),
                                       cache=self.a_cache.isChecked()))

    def _start_worker(self, worker: "_LoadWorker"):
        """読み込みスレッドを始める（ファイル・Maya で開いているシーンで共通）"""
        from .load_clock import LoadClock
        self.load_clock = LoadClock(worker.path)
        self.load_clock.expect_animation = self.a_anim.isChecked() and not worker.path.lower().endswith(DATA_EXT)
        self._thread = QtCore.QThread(self)
        self._worker = worker
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

    @Slot(float, str, str, float)
    def _on_progress(self, frac, msg, sub_text, sub_frac):
        self.viewer.show_loading(msg, frac, sub_text, sub_frac)
        self.statusBar().showMessage("%s　%s" % (msg, sub_text) if sub_text else msg)

    @Slot(object, float, object)
    def _on_loaded(self, scene, seconds, payload=None):
        cached = payload is not None and payload.cached
        clock = getattr(self, "load_clock", None)
        if clock is not None and not clock.finished:
            clock.mark("変換結果のキャッシュから読み込み" if cached else
                       (("パッケージの読み込み" if clock.path.lower().endswith(".msv") else "JSON の読み込み")
                        if clock.path.lower().endswith(DATA_EXT) else "解析・変換"))
            if scene.get("animation"):
                clock.expect_animation = True              # JSON にアニメーションが入っている
        self.show_scene(scene, ("キャッシュから読み込み %.2f 秒" if cached else "解析 %.2f 秒") % seconds, payload)
        if cached:
            self.log("info", "変換結果のキャッシュから読み込みました（.ma・リファレンス・テクスチャ・設定が前回と同じため、"
                             "解析を省きました。［設定］→［変換結果のキャッシュ］で切り替え）")
        self._anim_scene = scene           # このシーンのアニメーションだけを受け取る
        if self._worker is not None and self._worker.animation and not self._worker.path.lower().endswith(DATA_EXT):
            self.viewer.set_animation_status("アニメーションを読み込み中")

    @Slot(float, str)
    def _on_animation_progress(self, frac, msg):
        if self._pending_open is None:
            self.viewer.set_animation_status(msg)

    @Slot(object, float, object)
    def _on_animation_ready(self, anim, seconds, payload=None):
        if self._pending_open is not None or self.current_scene is None or self.current_scene is not self._anim_scene:
            return
        clock = getattr(self, "load_clock", None)
        if anim is None:
            self.viewer.set_animation_status("")
            if clock is not None:
                clock.expect_animation = False
                self._finish_load_clock()
            return
        if clock is not None and not clock.finished:
            clock.mark("アニメーションの解析と転送")
        self.current_scene["animation"] = anim
        size = self.viewer.set_animation(anim, payload)
        st = anim.get("stats", {})
        for n in anim.get("notes", []):
            self.log("info", n)
        if anim.get("warnings"):
            self.log("warn", "アニメーションの警告 %d 件（［ウインドウ］→［警告］で、分類ごとの一覧を見られます）" % len(anim["warnings"]))
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
        clock = getattr(self, "load_clock", None)
        if clock is not None:
            clock.expect_animation = False
            self._finish_load_clock()

    @Slot(str, str)
    def _on_load_event(self, name, detail):
        """ビューアでの読み込みの段階の終わり（scene: 最初の描画・animation: アニメーションの準備・cache: 再生キャッシュ）"""
        clock = getattr(self, "load_clock", None)
        if clock is None:
            return
        if name == "cache":
            if clock.finished:
                from .load_clock import fmt_seconds
                msg = "再生キャッシュを作り終えました（開き始めてから %s・作成 %s）" % (
                    fmt_seconds(clock.elapsed()), fmt_seconds(float(detail or 0)))
                self.log("info", msg)
                self.statusBar().showMessage(msg, 6000)
            return
        if clock.finished:
            return
        if name == "scene" and not clock.scene_done:
            clock.mark("ビューアでの組み立てと最初の描画")
            clock.scene_done = True
        elif name == "animation" and not clock.animation_done:
            clock.mark("アニメーションの準備（リグの評価の準備）" if detail != "failed" else "アニメーションの準備（失敗）")
            clock.animation_done = True
        self._finish_load_clock()

    def _finish_load_clock(self):
        """シーンの表示（と、読むならアニメーションの準備）が終わったら、経過と合計をログに出す"""
        clock = getattr(self, "load_clock", None)
        if clock is None or clock.finished or not clock.ready():
            return
        clock.finish()
        self.log("info", clock.summary())
        msg = clock.total_message()
        self.log("info", msg)
        self.statusBar().showMessage(msg, 10000)

    def _toggle_cache(self, on):
        _settings_set("sceneCache", bool(on))
        self.statusBar().showMessage("変換結果を%s（次に開くファイルから）" % ("キャッシュします" if on else "キャッシュしません"), 5000)

    def _update_cache_usage(self):
        """［変換結果のキャッシュ］を開いたとき: 使用量 / 上限（件数）"""
        from . import scene_cache
        mb = lambda b: "%.1f MB" % (b / 1048576.0)  # noqa: E731
        n = len(scene_cache.entries())
        text = "使用量: %s / %s（%d 件）" % (mb(scene_cache.total_bytes()), mb(scene_cache.limit_bytes()), n)
        if scene_cache.limit_from_env():
            text += "　※ 上限は環境変数 MA_VIEWER_CACHE_MB"
        self.a_cache_usage.setText(text)
        return text

    def set_scene_cache_limit(self, mb):
        from . import scene_cache
        scene_cache.set_limit_mb(mb)
        _settings_set("sceneCacheMB", int(mb))
        for v, a in self.cache_limit_actions.items():
            a.setChecked(v == mb)
        scene_cache.prune()
        msg = "変換結果のキャッシュの上限を %s にしました（%s）" % (
            "%d GB" % (mb // 1024) if mb >= 1024 else "%d MB" % mb, self._update_cache_usage())
        self.statusBar().showMessage(msg, 6000)
        self.log("info", msg)

    def clear_scene_cache(self):
        from . import scene_cache
        n = scene_cache.clear()
        msg = "変換結果のキャッシュを消去しました（%d 件。%s）" % (n, scene_cache.cache_dir())
        self.statusBar().showMessage(msg, 6000)
        self.log("info", msg)

    def _toggle_references(self, on):
        _settings_set("loadReferences", bool(on))
        self.statusBar().showMessage("リファレンスを%s（次に開くファイルから）" % ("読み込みます" if on else "読み込みません"),
                                     5000)

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

    def show_scene(self, scene: dict, note: str = "", payload: Optional[Payload] = None):
        """共通 JSON をビューアに表示する（Maya 抽出や外部ツールからも使える）。
        payload: 読み込みスレッドで文字列にしておいたもの（なければここで文字列にする）"""
        self.current_scene = scene
        st = scene.get("stats", {})
        size = self.viewer.set_scene(scene, payload=payload)
        # お知らせ（解析した・定義で評価したなど）はログに出す。警告はログに 1 件ずつ流さず、件数だけ
        for n in scene.get("notes", []):
            self.log("info", n)
        if scene.get("warnings"):
            self.log("warn", "警告 %d 件（［ウインドウ］→［警告］で、分類ごとの一覧を見られます）" % len(scene["warnings"]))
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
        # シーンの数（三角形・カメラを含む）はビューアがログに出すので、ここでは転送の大きさだけ
        self.log("info", "ビューアへの転送: %s%s" % (amount, "（%s）" % note if note else ""))

    def _error(self, text):
        self.viewer.show_error(text)
        self.statusBar().showMessage(text.splitlines()[0], 8000)
        self.log("error", text)

    # ---- パッケージ（.msv）の書き出し。項目はいつもの設定で書き出し、右端の ❒ でオプションを開く（Maya と同じ）
    PACKAGE_TEXTURE_MODES = [("albedo", "アルベドのみ（おすすめ）"), ("all", "すべてのマップ"), ("none", "入れない")]
    PACKAGE_MAX_SIZES = [(1024, "1024 px"), (2048, "2048 px（おすすめ。ビューアの表示の上限）"), (4096, "4096 px"),
                         (0, "縮めない")]

    def package_options(self) -> dict:
        """パッケージの書き出しの設定（前回の設定。なければ既定）"""
        from . import package
        s = _settings()
        modes = [k for k, _ in self.PACKAGE_TEXTURE_MODES]
        textures = s.value("packageTextures", package.DEFAULT_TEXTURES)

        def num(key, default, lo, hi):
            try:
                v = int(s.value(key, default))
            except (TypeError, ValueError):
                return default
            return v if lo <= v <= hi else default
        return {"textures": textures if textures in modes else package.DEFAULT_TEXTURES,
                "view": _settings_bool("packageView", True),
                "maxSize": num("packageMaxSize", package.DEFAULT_MAX_SIZE, 0, 16384),
                "quality": num("packageQuality", package.DEFAULT_QUALITY, 1, 100)}

    def save_package_options(self, opts: dict) -> None:
        _settings_set("packageTextures", opts["textures"])
        _settings_set("packageView", bool(opts["view"]))
        _settings_set("packageMaxSize", int(opts["maxSize"]))
        _settings_set("packageQuality", int(opts["quality"]))

    def package_options_summary(self, opts: dict) -> str:
        """設定の要約（ステータスバー・ログ用）"""
        tex = dict(self.PACKAGE_TEXTURE_MODES)[opts["textures"]].replace("（おすすめ）", "")
        parts = ["テクスチャ: " + tex]
        if opts["textures"] != "none":
            parts.append("最大 %d px" % opts["maxSize"] if opts["maxSize"] else "縮めない")
            parts.append("品質 %d" % opts["quality"])
        parts.append("表示の状態あり" if opts["view"] else "表示の状態なし")
        return "・".join(parts)

    def export_package(self):
        """［ファイル］→［パッケージ（.msv）として書き出し］: 前回の設定のまま、保存先だけを選んで書き出す"""
        self._export_package_with(self.package_options())

    def export_package_options(self):
        """［ファイル］→［パッケージ（.msv）として書き出し］の ❒: 設定を変える（書き出す・設定だけ保存する）"""
        from . import package
        title = "パッケージ（.msv）の書き出しのオプション"
        opts = self.package_options()
        dlg = QtWidgets.QDialog(self)
        dlg.setWindowTitle(title)
        form = QtWidgets.QFormLayout(dlg)
        combo = QtWidgets.QComboBox(dlg)
        for key, label in self.PACKAGE_TEXTURE_MODES:
            combo.addItem(label, key)
        combo.setCurrentIndex([k for k, _ in self.PACKAGE_TEXTURE_MODES].index(opts["textures"]))
        form.addRow("同梱するテクスチャ", combo)
        size_combo = QtWidgets.QComboBox(dlg)
        for v, label in self.PACKAGE_MAX_SIZES:
            size_combo.addItem(label, v)
        sizes = [v for v, _ in self.PACKAGE_MAX_SIZES]
        if opts["maxSize"] not in sizes:
            size_combo.addItem("%d px" % opts["maxSize"], opts["maxSize"])
            sizes.append(opts["maxSize"])
        size_combo.setCurrentIndex(sizes.index(opts["maxSize"]))
        form.addRow("テクスチャの最大サイズ", size_combo)
        quality = QtWidgets.QSpinBox(dlg)
        quality.setRange(1, 100)
        quality.setValue(opts["quality"])
        quality.setToolTip("WebP の品質（1〜100。大きいほどきれいで、ファイルが大きい。既定 %d）" % package.DEFAULT_QUALITY)
        form.addRow("テクスチャの品質", quality)
        ok_convert, why = package.pillow_status()
        note = QtWidgets.QLabel("テクスチャは WebP にして入れます（アルファも残します）。" if ok_convert
                                else "テクスチャは元のまま入れます（%s）" % why, dlg)
        note.setWordWrap(True)
        form.addRow(note)

        def sync():
            on = combo.currentData() != "none" and ok_convert
            size_combo.setEnabled(on)
            quality.setEnabled(on)
        combo.currentIndexChanged.connect(lambda *_: sync())
        sync()
        view_box = QtWidgets.QCheckBox("表示の状態を保存する（カメラ・表示設定・非表示・フレーム・ポーズ）", dlg)
        view_box.setToolTip("開いたときに、いまの見た目で表示する。アニメーションカーブのあるノードのポーズと、選択は保存しない")
        view_box.setChecked(opts["view"])
        form.addRow(view_box)
        # Maya のオプションボックスと同じ並び（OS によって変わらないよう、順に置く）: 書き出し・設定を保存・閉じる
        buttons = QtWidgets.QHBoxLayout()
        b_export = QtWidgets.QPushButton("書き出し", dlg)
        b_save = QtWidgets.QPushButton("設定を保存", dlg)
        b_save.setToolTip("書き出さずに設定だけ保存して閉じる")
        b_close = QtWidgets.QPushButton("閉じる", dlg)
        for b in (b_export, b_save, b_close):
            b.setAutoDefault(False)
            buttons.addWidget(b)
        b_export.setDefault(True)
        chosen = {"action": None}

        def current():
            return {"textures": combo.currentData(), "view": view_box.isChecked(),
                    "maxSize": int(size_combo.currentData()), "quality": int(quality.value())}

        def choose(action):
            chosen["action"] = action
            dlg.accept()
        b_export.clicked.connect(lambda *_: choose("export"))
        b_save.clicked.connect(lambda *_: choose("save"))
        b_close.clicked.connect(dlg.reject)
        form.addRow(buttons)
        self.package_options_dialog = dlg          # テスト用
        if dlg.exec() != QtWidgets.QDialog.DialogCode.Accepted or chosen["action"] is None:
            return
        new = current()
        self.save_package_options(new)
        if chosen["action"] == "save":
            self.statusBar().showMessage("書き出しの設定を保存しました: " + self.package_options_summary(new), 6000)
            return
        self._export_package_with(new)

    def _export_package_with(self, opts: dict):
        from . import package
        title = "パッケージ（.msv）として書き出し"
        if self.current_scene is None:
            QtWidgets.QMessageBox.information(self, title, "先にシーンを読み込んでください。")
            return
        base = os.path.splitext(self.current_path)[0] + package.EXT if self.current_path else "scene" + package.EXT
        path, _ = QtWidgets.QFileDialog.getSaveFileName(self, title, base, "パッケージ (*.msv)")
        if not path:
            return
        if not path.lower().endswith(package.EXT):
            path += package.EXT
        src_path = (self.current_scene.get("source") or {}).get("packagePath")
        if src_path and os.path.normcase(os.path.abspath(src_path)) == os.path.normcase(os.path.abspath(path)):
            self._error("開いているパッケージと同じファイルには書き出せません。別の名前にしてください。")
            return
        scene = self.current_scene
        if not opts["view"]:
            self._write_package(scene, path, opts, src_path, None)
            return

        def got(raw):
            # ビューアの表示の状態（JSON の文字列）を受け取ってから書き出す
            try:
                view = json.loads(raw) if isinstance(raw, str) and raw not in ("", "null") else None
            except ValueError:
                view = None
            if view is None:
                self.log("warn", "表示の状態を受け取れなかったため、保存せずに書き出します")
            self._write_package(scene, path, opts, src_path, view)
        self.viewer.run_js("window.mayaViewer && window.mayaViewer.getViewState ? window.mayaViewer.getViewState() : ''",
                           got)

    def _write_package(self, scene, path, opts, src_path, view):
        from . import package
        QtWidgets.QApplication.setOverrideCursor(QtCore.Qt.CursorShape.WaitCursor)
        try:
            source = package.Package(src_path) if src_path and os.path.isfile(src_path) else None
            r = package.write_package(scene, path, textures=opts["textures"], max_size=opts["maxSize"],
                                      quality=opts["quality"], source=source, view=view)
        except Exception as exc:  # noqa: BLE001
            QtWidgets.QApplication.restoreOverrideCursor()
            self.log("error", traceback.format_exc())
            self._error("書き出せませんでした。\n%s" % exc)
            return
        QtWidgets.QApplication.restoreOverrideCursor()
        size = "%.2f MB" % (r["size"] / 1048576.0)
        used = dict(opts, view=bool(r["view"]))
        summary = self.package_options_summary(used)
        self.statusBar().showMessage("書き出しました: %s（%s・%s）" % (os.path.basename(path), size, summary), 8000)
        self.log("info", "書き出しました: %s（%s・%s・同梱したテクスチャ %d 枚%s）"
                 % (path, size, summary, r["textures"], "・WebP" if r["converted"] else "・元のまま" if r["textures"] else ""))
        for w in r["warnings"]:
            self.log("warn", w)


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
        """Maya で開いているシーンを読む。Maya の API で集めるところだけを画面のスレッドで行い、
        変換（.ma を開いたときと同じ。アニメーションは後から）は読み込みスレッドで行う"""
        if self._thread is not None:
            self.statusBar().showMessage("読み込み中です。完了してから読み直してください。", 5000)
            return
        from . import maya_scene

        def progress(frac, msg, _detail=None):
            self.viewer.show_loading(msg, frac)
            QtWidgets.QApplication.processEvents()

        self.current_path = None
        self._maya_selection = selection_only
        QtWidgets.QApplication.setOverrideCursor(Qt.CursorShape.WaitCursor)
        try:
            progress(0.0, "Maya からシーンを取得中")
            st = maya_scene.collect(selection_only, progress)
        except Exception as exc:  # noqa: BLE001
            self.log("error", traceback.format_exc())
            self._error("Maya からデータを取得できませんでした。\n%s" % exc)
            return
        finally:
            QtWidgets.QApplication.restoreOverrideCursor()
        name = os.path.basename(st.source_path) or "Maya シーン"
        self.setWindowTitle("%s - %s" % (name, APP_NAME))
        self.log("info", "Maya から読み込み開始: %s%s" % (name, "（選択範囲）" if selection_only else ""))
        self._start_worker(_LoadWorker("", animation=self.a_anim.isChecked(), cache=False,
                                       staged=lambda p: maya_scene.load_staged(st, p)))

    def _on_viewer_selected(self, path):
        # 複数選んだときはパスが改行で区切られている（最後がリード。Maya の選択の順と同じ）
        # 空ならビューアで選択を解除した（Maya の選択も解除する）
        paths = [p for p in path.split("\n") if p]
        self._last_viewer_path = paths
        if not paths:
            self.statusBar().showMessage("選択を解除しました", 4000)
        elif len(paths) == 1:
            self.statusBar().showMessage("選択: %s" % paths[0], 4000)
        else:
            self.statusBar().showMessage("選択: %d 個（リード: %s）" % (len(paths), paths[-1]), 4000)
        if self.host != "maya" or not self.a_sync.isChecked():
            return
        try:
            from maya import cmds
            if not paths:
                cmds.select(clear=True)
                return
            found = [p for p in paths if cmds.objExists(p)]
            for p in paths:
                if p not in found:
                    self.log("warn", "Maya のシーンに %s がありません（選択を反映できません）" % p)
            if found:
                cmds.select(found, replace=True)
        except Exception as exc:  # noqa: BLE001
            self.log("warn", "Maya の選択を変更できませんでした: %s" % exc)

    def pull_maya_selection(self):
        try:
            from maya import cmds
        except ImportError:
            return
        sel = cmds.ls(selection=True, long=True) or []
        self.viewer.select_paths(sel)          # 空なら、ビューアの選択も解除する

    def _on_maya_selection_changed(self):
        try:
            if not self.a_follow.isChecked():
                return
            from maya import cmds
            sel = cmds.ls(selection=True, long=True) or []
            if sel != self._last_viewer_path:      # ビューアで選んだ（解除した）結果の通知なら送り返さない
                self._last_viewer_path = sel
                self.viewer.select_paths(sel)      # 空なら、ビューアの選択も解除する
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

