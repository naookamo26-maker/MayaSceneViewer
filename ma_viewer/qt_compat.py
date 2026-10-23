# -*- coding: utf-8 -*-
"""PySide6 の import をまとめる（PySide6 / Qt 6.5 以降が前提。Maya 2025 以降に同梱）。

QtWebEngine が含まれない環境では WEBENGINE_ERROR に理由が入り、require_webengine() で例外になる。

注意: QtWebEngine はアプリケーション（QApplication）の作成前に import する必要がある。
スタンドアロン起動（app.py）では、このモジュールを先に import してから QApplication を作る。
"""
from __future__ import annotations

try:
    from PySide6 import QtCore, QtGui, QtWidgets  # noqa: F401
    from PySide6.QtGui import QAction  # noqa: F401
    from shiboken6 import isValid, wrapInstance  # noqa: F401
except ImportError as exc:  # pragma: no cover
    raise ImportError("PySide6 が見つかりません。pip install PySide6 でインストールしてください。") from exc

WEBENGINE_ERROR = None
try:
    from PySide6.QtWebChannel import QWebChannel  # noqa: F401
    from PySide6.QtWebEngineCore import QWebEnginePage, QWebEngineScript, QWebEngineSettings  # noqa: F401
    from PySide6.QtWebEngineWidgets import QWebEngineView  # noqa: F401
except ImportError as exc:  # pragma: no cover - 環境依存
    WEBENGINE_ERROR = "PySide6 に QtWebEngine が含まれていません（%s）" % exc
    QWebChannel = QWebEnginePage = QWebEngineScript = QWebEngineSettings = QWebEngineView = None

Signal = QtCore.Signal
Slot = QtCore.Slot
Qt = QtCore.Qt


def require_webengine():
    """QtWebEngine が使えなければ、対処法つきのメッセージで例外を出す。"""
    if WEBENGINE_ERROR:
        raise ImportError(
            WEBENGINE_ERROR + "\n"
            "スタンドアロンでは pip install PySide6 で入る完全版を使ってください。\n"
            "Maya 内で使えない場合は、python -m ma_viewer export で JSON に変換し、"
            "スタンドアロン版またはブラウザで開く方法があります。")


def run_javascript(page, code: str, callback=None):
    """runJavaScript を呼ぶ。結果が必要なときだけ callback を渡す。"""
    if callback is None:
        page.runJavaScript(code)
        return
    try:
        page.runJavaScript(code, 0, callback)
    except TypeError:  # 古い PySide6 の引数形式
        page.runJavaScript(code, callback)
