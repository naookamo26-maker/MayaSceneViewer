# -*- coding: utf-8 -*-
"""スタンドアロン起動:  python -m ma_viewer [file.ma|file.json]

  --selftest            ファイルを読み込み、結果（JSON）を出力して終了する（exe の動作確認用）
  --selftest-out PATH   結果をファイルにも書く（コンソールのない exe 向け）
  --selftest-timeout N  待つ秒数（既定 60）
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import traceback


def main(argv=None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    ap = argparse.ArgumentParser(prog="MayaSceneViewer", add_help=True)
    ap.add_argument("file", nargs="?", help=".ma または共通 JSON")
    ap.add_argument("--selftest", action="store_true", help="読み込んで結果を出力し、終了する")
    ap.add_argument("--selftest-out", default=None)
    ap.add_argument("--selftest-timeout", type=float, default=60.0)
    args, _unknown = ap.parse_known_args(argv)

    # GPU のブロックリストで WebGL が無効になる環境への対策（利用者が指定していればそちらを優先）
    os.environ.setdefault("QTWEBENGINE_CHROMIUM_FLAGS", "--ignore-gpu-blocklist")

    # QtWebEngine は QApplication より先に import する必要がある
    from .qt_compat import QtCore, QtGui, QtWidgets, require_webengine
    from .resources import icon_path
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    app.setApplicationName("Maya シーンビューア")
    icon = icon_path()
    if icon:                            # タイトルバー・タスクバーのアイコン（exe のアイコンは spec で指定）
        app.setWindowIcon(QtGui.QIcon(icon))
    apply_dark_style(app)

    try:
        require_webengine()
        from .viewer import ViewerWindow
        win = ViewerWindow(host="standalone")
    except Exception as exc:  # noqa: BLE001  exe ではコンソールがないので、ダイアログで知らせる
        detail = "%s\n\n%s" % (exc, traceback.format_exc())
        if args.selftest:
            _selftest_result({"ok": False, "error": str(exc)}, args.selftest_out)
            return 1
        QtWidgets.QMessageBox.critical(None, "Maya シーンビューア - 起動できません", str(exc))
        sys.stderr.write(detail)
        return 1

    win.show()
    if args.file:
        win.open_file(args.file)
    if args.selftest:
        _start_selftest(app, win, args)
    return app.exec()


def _selftest_result(result: dict, out_path):
    text = json.dumps(result, ensure_ascii=False, indent=1)
    try:
        sys.stdout.write(text + "\n")
        sys.stdout.flush()
    except (AttributeError, OSError):       # コンソールのない exe
        pass
    if out_path:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)


def _start_selftest(app, win, args):
    """ページとシーン（テクスチャを含む）の読み込みを待ち、状態を出力して終了する。"""
    from .qt_compat import QtCore
    from .resources import web_dir
    state = {"done": False}

    def finish(stats, ok, error=None):
        if state["done"]:
            return
        state["done"] = True
        _selftest_result({"ok": ok, "error": error, "frozen": bool(getattr(sys, "frozen", False)),
                          "webDir": web_dir(), "file": args.file, "stats": stats}, args.selftest_out)
        app.exit(0 if ok else 1)

    def poll():
        def got(stats):
            if not stats:
                return QtCore.QTimer.singleShot(300, poll)
            if args.file and not stats.get("loaded"):
                return QtCore.QTimer.singleShot(300, poll)
            if any(t.get("status") == "loading" for t in stats.get("textures") or []):
                return QtCore.QTimer.singleShot(300, poll)
            ok = bool(stats.get("webgl")) and (stats.get("loaded") or not args.file)
            finish(stats, ok, None if ok else "読み込みまたは WebGL の初期化に失敗しました")
        win.viewer.get_stats(got)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, poll))
    QtCore.QTimer.singleShot(int(args.selftest_timeout * 1000), lambda: finish(None, False, "タイムアウト"))


def apply_dark_style(app):
    """スタンドアロン時にメニュー等をビューアと同じ暗い配色にする（Maya 内では Maya の配色に従う）。"""
    from .qt_compat import QtGui
    app.setStyle("Fusion")
    pal = QtGui.QPalette()
    R = QtGui.QPalette.ColorRole
    G = QtGui.QPalette.ColorGroup
    c = QtGui.QColor
    for role, col in ((R.Window, "#1c1e21"), (R.WindowText, "#dde1e6"), (R.Base, "#25282c"),
                      (R.AlternateBase, "#2c3035"), (R.Text, "#dde1e6"), (R.Button, "#25282c"),
                      (R.ButtonText, "#dde1e6"), (R.ToolTipBase, "#25282c"), (R.ToolTipText, "#dde1e6"),
                      (R.Highlight, "#33404a"), (R.HighlightedText, "#f2f6f9"), (R.Link, "#5ec8e5"),
                      (R.PlaceholderText, "#8e97a1")):
        pal.setColor(role, c(col))
    for role in (R.WindowText, R.Text, R.ButtonText):
        pal.setColor(G.Disabled, role, c("#6b737c"))
    app.setPalette(pal)


if __name__ == "__main__":
    sys.exit(main())
