# -*- coding: utf-8 -*-
"""ビューポートの中央に重ねる表示（起動直後の案内・読み込み中・エラー）が、2 つ以上同時に出ないことの確認（Qt）。

  python tests/qt_overlay_test.py      （画面のない Linux では xvfb-run -a を付けるか QT_QPA_PLATFORM=offscreen）

  1. 起動直後は案内だけ
  2. .ma を開くと、読み込み中だけ → 読み終えたら何も出さない
  3. ない .ma を開くとエラーだけ（案内を重ねない）
  4. そのあと .ma を開き直すと、前のエラーを消して読み込み中だけ → 読み終えたら何も出さない
"""
from __future__ import annotations

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

STEPS = [
    ("起動直後", None),
    (".ma を開く", os.path.join(ROOT, "samples", "sample_arm.ma")),
    ("ない .ma を開く", os.path.join(ROOT, "samples", "nothing_here.ma")),
    ("もう一度 .ma を開く", os.path.join(ROOT, "samples", "compiled_sample.ma")),
]
# 中央に重ねる表示の変化を、変わるたびに記録する
WATCH = """(() => { window.__overlayLog = []; const ids = ['empty', 'loading', 'error'];
  const snap = () => ids.filter((id) => !document.getElementById(id).hidden).join('+') || 'none';
  let last = ''; const rec = () => { const s = snap(); if (s !== last) { window.__overlayLog.push(s); last = s; } };
  new MutationObserver(rec).observe(document.getElementById('viewport'),
    { attributes: true, subtree: true, attributeFilter: ['hidden'] }); rec(); return true; })()"""


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
    # 読めないファイルのダイアログは出さない（テストを止めないため）
    QtWidgets.QMessageBox.warning = lambda *a, **k: None
    QtWidgets.QMessageBox.critical = lambda *a, **k: None
    win = ViewerWindow(host="standalone")
    win.resize(1200, 800)
    win.show()
    ok = {"v": True}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def finish(raw):
        log = json.loads(raw)
        print("記録:", log)
        states = [s for s in log if not s.startswith("--- ")]
        check(all("+" not in s for s in states), "重ねる表示は、いつも 1 つ以下: %s" % states)

        def after(label):
            i = log.index("--- " + label)
            rest = log[i + 1:]
            end = next((k for k, s in enumerate(rest) if s.startswith("--- ")), len(rest))
            return rest[:end]

        check(log[0] == "empty", "起動直後は案内だけ")
        check(after(".ma を開く") == ["loading", "none"], "読み込み中 → 何も出さない: %s" % after(".ma を開く"))
        check(after("ない .ma を開く")[-1:] == ["error"], "ない .ma はエラーだけ: %s" % after("ない .ma を開く"))
        check(after("もう一度 .ma を開く") == ["loading", "none"],
              "開き直すとエラーを消して読み込み中 → 何も出さない: %s" % after("もう一度 .ma を開く"))
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    def run(i=0):
        if i == len(STEPS):
            win.viewer.run_js("JSON.stringify(window.__overlayLog)", finish)
            return
        label, path = STEPS[i]
        win.viewer.run_js("window.__overlayLog.push(%s)" % json.dumps("--- " + label))
        if path:
            win.open_file(path)
        wait_done(lambda: run(i + 1))

    def wait_done(then, t0=None):
        # 読み込みのスレッドが終わり、読み込み中の表示が消えるまで待つ
        import time
        t0 = t0 or time.time()

        def got(raw):
            if (win._thread is None and raw == "true") or time.time() - t0 > 30:
                QtCore.QTimer.singleShot(500, then)
            else:
                QtCore.QTimer.singleShot(200, lambda: wait_done(then, t0))
        win.viewer.run_js("document.getElementById('loading').hidden", lambda r: got("true" if r is True or r == "true" else "false"))

    def start():
        win.viewer.run_js(WATCH, lambda _r: QtCore.QTimer.singleShot(300, run))

    if getattr(win.viewer, "_loaded", False):
        QtCore.QTimer.singleShot(300, start)
    else:
        win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, start))
    QtCore.QTimer.singleShot(120000, lambda: (print("時間切れ"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
