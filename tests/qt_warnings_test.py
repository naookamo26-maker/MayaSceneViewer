# -*- coding: utf-8 -*-
"""警告のパネル（下部でログとタブ切り替え。［表示］→［警告］・ツールバーの警告アイコン）の確認。

  python tests/qt_warnings_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shot", default=None)
    args = ap.parse_args()
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.app import apply_dark_style
    from ma_viewer.viewer import ViewerWindow
    apply_dark_style(app)
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    ok = {"v": True}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=200):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(
            delay, lambda: then(json.loads(r) if isinstance(r, str) and r[:1] in "{[" else r)))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    BADGE = """JSON.stringify({ hidden: document.getElementById('btn-warnings').hidden,
      count: document.getElementById('warn-count').textContent, panel: !!document.getElementById('sec-warn') })"""

    def s_load(nxt):
        win.open_file(os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma"))
        QtCore.QTimer.singleShot(3000, nxt)

    def s_badge(nxt):
        def got(r):
            n = len(win.viewer.warnings)
            check(not r["panel"], "右パネルに警告の欄はない")
            check(not r["hidden"] and r["count"] == str(n) and n >= 1, "ツールバーに件数付きの警告アイコン（%s 件）" % r["count"])
            check(win.a_warn.text() == "警告（%d 件）" % n, "［表示］メニューに件数: %s" % win.a_warn.text())
            check(win.warn_dock.windowTitle() == "警告（%d 件）" % n, "タブの見出しに件数: %s" % win.warn_dock.windowTitle())
            nxt()
        js(BADGE, got)

    def tabs_of_log():
        return [d.objectName() for d in win.tabifiedDockWidgets(win.log_dock)]

    def s_menu(nxt):
        win.a_warn.trigger()
        QtCore.QTimer.singleShot(300, lambda: (
            check(win.warn_dock.isVisible(), "メニューから警告のパネルが開く"),
            check(win.dockWidgetArea(win.warn_dock) == QtCore.Qt.DockWidgetArea.BottomDockWidgetArea, "パネルは下部"),
            check(win.warn_list.count() == len(win.viewer.warnings), "一覧の件数が一致（%d 件）" % win.warn_list.count()),
            win.log_dock.show(),
            QtCore.QTimer.singleShot(200, lambda: (
                check("MayaSceneViewerWarnings" in tabs_of_log(), "ログと警告は同じ場所でタブになる"),
                shot("warnings_tab.png"),
                win.log_dock.raise_(), nxt()))))

    def s_toolbar(nxt):
        # ログのタブが前面にある状態で、ツールバーのアイコンを押すと警告のタブが前面に出る
        js("document.getElementById('btn-warnings').click(); 1", lambda _: QtCore.QTimer.singleShot(300, lambda: (
            check(win.warn_dock.isVisible() and not win.warn_dock.visibleRegion().isEmpty(),
                  "ツールバーの警告アイコンで、警告のタブが前面に出る"), nxt())))

    def s_update(nxt):
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, lambda: (
            check(win.warn_dock.isVisible() and win.warn_list.count() == len(win.viewer.warnings),
                  "開いたまま別のファイルを読み込むと更新（%d 件）" % win.warn_list.count()),
            win.copy_warnings(),
            check(QtWidgets.QApplication.clipboard().text() == "\n".join(win.viewer.warnings), "すべてコピー"),
            nxt()))

    def s_dialog(nxt):
        js("""JSON.stringify((() => { window.mayaViewer.debug.app.ui.openWarningDialog();
              const d = document.getElementById('warn-dialog'); const r = { open: d.open, items: d.querySelectorAll('li').length };
              d.close(); return r; })())""",
           lambda r: (check(r["open"] and r["items"] == len(win.viewer.warnings), "ブラウザ用のダイアログにも一覧（%d 件）" % r["items"]), nxt()))

    def s_clear(nxt):
        win.viewer.clear()
        QtCore.QTimer.singleShot(400, lambda: js(BADGE, lambda r: (
            check(r["hidden"] and win.a_warn.text() == "警告" and win.warn_list.count() == 0,
                  "シーンを閉じるとアイコンが消え、一覧も空になる"), nxt())))

    def shot(name):
        if args.shot:
            os.makedirs(args.shot, exist_ok=True)
            win.warn_dock.raise_()
            QtWidgets.QApplication.processEvents()
            win.grab().save(os.path.join(args.shot, name))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_badge, s_menu, s_toolbar, s_update, s_dialog, s_clear, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
