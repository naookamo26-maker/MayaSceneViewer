# -*- coding: utf-8 -*-
"""Maya からビューアを開く。

    import ma_viewer.maya_launcher as mv
    mv.show()              # 現在のシーンを表示
    mv.show("selection")   # 選択したノード以下だけを表示
    mv.show(None)          # 空のウィンドウを開く（.ma を開く用途）
    mv.show(r"C:/path/scene.ma")
    mv.reload_and_show()   # 開発用: モジュールを読み直してから開く
"""
from __future__ import annotations

import os
import sys

_WINDOW = None


def maya_main_window():
    from maya import OpenMayaUI as omui
    from .qt_compat import QtWidgets, wrapInstance
    ptr = omui.MQtUtil.mainWindow()
    return wrapInstance(int(ptr), QtWidgets.QWidget) if ptr is not None else None


def show(load="scene"):
    """ビューアを開く（既に開いていれば作り直す）。"""
    global _WINDOW
    from .qt_compat import QtCore, require_webengine
    require_webengine()
    from .viewer import ViewerWindow

    close()
    win = ViewerWindow(parent=maya_main_window(), host="maya")
    win.show()
    win.raise_()
    win.activateWindow()
    _WINDOW = win
    if load in ("scene", "selection"):
        QtCore.QTimer.singleShot(0, lambda: win.load_from_maya(load == "selection"))
    elif load and os.path.isfile(str(load)):
        win.open_file(str(load))
    return win


def close():
    global _WINDOW
    if _WINDOW is not None:
        from .qt_compat import isValid
        try:
            if isValid(_WINDOW):
                _WINDOW.close()
        except RuntimeError:
            pass
    _WINDOW = None


def reload_and_show(load="scene"):
    """開発用: ma_viewer パッケージを読み直してから開く。"""
    close()
    for name in [n for n in sys.modules if n == "ma_viewer" or n.startswith("ma_viewer.")]:
        del sys.modules[name]
    import ma_viewer.maya_launcher as fresh
    return fresh.show(load)
