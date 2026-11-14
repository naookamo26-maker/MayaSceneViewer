# -*- coding: utf-8 -*-
"""読み込み中の動きの確認（Qt）。

  python tests/qt_load_test.py      （画面のない Linux では xvfb-run -a を付ける）

  1. 読み込みを始めると、前のシーンの再生と再生キャッシュの作成を止める（読み込みと CPU を取り合わない）
  2. 読み込み中に同じファイルを開き直しても（投げ入れ直しても）、最初から読み直さない
  3. 読み込み中に別のファイルを開くと、いまの読み込みを中止して新しいファイルを開く。何度開いても、ビューアで
     組み立てるのは最後のものだけ。中止したことは誤りとして出さない
  4. 読み込みに失敗したら、前のシーンはそのまま（再生できる）
大きなシーンは一時フォルダに作る（tools/make_big_rig_sample.py）。変換結果のキャッシュは使わない。
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

RIG = os.path.join(ROOT, "samples", "rig_sample.ma")
ANIM = os.path.join(ROOT, "samples", "anim_sample.ma")

# 組み立てたシーンの名前を記録する（ビューアの loadScene を包む）
HOOK_JS = """(() => {
  const app = window.mayaViewer.debug.app;
  window.__loads = [];
  if (!app.__hooked) {
    const f = app.loadScene.bind(app);
    app.loadScene = (d) => { window.__loads.push((d.source && d.source.name) || '?'); return f(d); };
    app.__hooked = true;
  }
  return true;
})()"""
STATE_JS = """JSON.stringify((() => {
  const app = window.mayaViewer.debug.app;
  return { loaded: !!app.built, name: app.sceneName || '', playing: !!app.playing, busy: !!app.loadBusy,
           clip: !!app.clip, baking: !!(app.bakers && app.bakers.job) || !!app.bakeHandle || !!app.bakeTimer,
           error: !document.getElementById('error').hidden, loads: window.__loads || [] };
})())"""


def _parse(r):
    if isinstance(r, str) and r[:1] in ("{", "["):
        return json.loads(r)
    return r


def main() -> int:
    tmp = tempfile.mkdtemp(prefix="msv_load_")
    big = os.path.join(tmp, "big_rig.ma")
    subprocess.check_call([sys.executable, os.path.join(ROOT, "tools", "make_big_rig_sample.py"), "300", "120", big],
                          stdout=subprocess.DEVNULL)
    broken = os.path.join(tmp, "broken.msv")       # zip でない .msv（読み込みに失敗する）
    with open(broken, "wb") as f:
        f.write(b"not a zip")

    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    saved = (win.a_anim.isChecked(), win.a_cache.isChecked())
    win.a_anim.setChecked(True)
    win.a_cache.setChecked(False)                   # 毎回解析する（読み込み中の状態を作るため）
    ok = {"v": True}
    logs = []
    win.viewer.logMessage.connect(lambda level, text: logs.append((level, text)))
    _log = win.log

    def log(level, text):
        logs.append((level, text))
        _log(level, text)
    win.log = log

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=0):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(_parse(r))))

    def wait(cond, then, timeout=60.0):
        t0 = time.time()

        def poll():
            def got(s):
                if (cond(s) and win._thread is None) or time.time() - t0 > timeout:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(150, poll)
            js(STATE_JS, got)
        poll()

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def s_open_rig(nxt):
        win.open_file(RIG)
        wait(lambda s: s["loaded"] and s["clip"] and s["name"] == "rig_sample.ma", lambda s: js(HOOK_JS, lambda _r: nxt()))

    def s_play_then_load(nxt):
        def started(_r):
            def playing(s):
                check(s["playing"], "前のシーンを再生している")
                win.open_file(big)
                worker = win._worker
                win.open_file(big)                       # 同じファイルを投げ入れ直す
                check(win._worker is worker and win._pending_open is None,
                      "読み込み中に同じファイルを開き直しても、最初から読み直さない")

                def during(s2):
                    check(s2["busy"] and not s2["playing"], "読み込みを始めると、前のシーンの再生を止める: %s" % s2)
                    check(not s2["baking"], "読み込み中は、前のシーンの再生キャッシュを作らない")
                    js("window.mayaViewer.play(), true", lambda _r: js(STATE_JS, lambda s3: (
                        check(not s3["playing"], "読み込み中は、前のシーンを再生し直さない"), nxt())), 0)
                QtCore.QTimer.singleShot(200, lambda: js(STATE_JS, during))
            QtCore.QTimer.singleShot(300, lambda: js(STATE_JS, playing))
        js("window.mayaViewer.play(), true", started)

    def s_switch(nxt):
        # big を読み込み中に、別のファイルを何度か開く（最後に開いたものだけを読む）
        win.open_file(RIG)
        win.open_file(big)
        win.open_file(ANIM)
        check(win._pending_open == os.path.abspath(ANIM), "読み込み中に開いたファイルは、中止のあとに開く（最後のもの）")

        def done(s):
            check(s["name"] == "anim_sample.ma" and s["loaded"], "最後に開いたファイルを表示する: %s" % s["name"])
            check(s["loads"] == ["anim_sample.ma"], "ビューアで組み立てたのは最後のものだけ: %s" % s["loads"])
            check(not s["error"], "中止したことを誤りとして出さない")
            check(not any(lv == "error" for lv, _t in logs), "ログに誤りがない: %s" % [t for lv, t in logs if lv == "error"][:2])
            check(any("読み込みを中止しました" in t for _lv, t in logs), "中止したことはログに出す")
            logs.clear()
            nxt()
        wait(lambda s: s["name"] == "anim_sample.ma" and s["clip"], done)

    def s_broken(nxt):
        js(HOOK_JS, lambda _r: None)
        win.open_file(broken)

        def done(s):
            check(s["name"] == "anim_sample.ma" and s["loaded"], "読み込みに失敗しても、前のシーンはそのまま: %s" % s["name"])
            check(not s["busy"], "失敗したら読み込み中を解く")
            js("window.mayaViewer.play(), true", lambda _r: QtCore.QTimer.singleShot(300, lambda: js(STATE_JS, lambda s2: (
                check(s2["playing"], "失敗したあとも、前のシーンを再生できる"),
                js("window.mayaViewer.pause(), true", lambda _r2: nxt())))))
        wait(lambda s: s["error"] or (s["loads"] and s["loads"][-1] == "broken.msv"), done, timeout=30)

    def finish(_nxt):
        win.a_anim.setChecked(saved[0])
        win.a_cache.setChecked(saved[1])
        print("結果: %s" % ("OK" if ok["v"] else "NG"))
        win.close()
        app.exit(0 if ok["v"] else 1)

    QtCore.QTimer.singleShot(1500, lambda: run([s_open_rig, s_play_then_load, s_switch, s_broken, finish]))
    QtCore.QTimer.singleShot(240000, lambda: (print("NG タイムアウト"), app.exit(1)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
