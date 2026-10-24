# -*- coding: utf-8 -*-
"""カメラシーケンサ（下部のパネル・シーケンスの再生）と、キャラクターセットの Trax のクリップの確認。

  python tests/qt_sequencer_test.py      （画面のない Linux では xvfb-run -a を付ける）
前提: python tools/make_sequencer_sample.py・python tools/make_trax_sample.py
"""
from __future__ import annotations

import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

SEQ = os.path.join(ROOT, "samples", "sequencer_sample.ma")
TRAX = os.path.join(ROOT, "samples", "trax_sample.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const el = document.getElementById('sequencer');
  const lanes = document.getElementById('seq-lanes').getBoundingClientRect();
  const vp = document.getElementById('viewport').getBoundingClientRect();
  return { loaded: !!s.loaded, name: window.mayaViewer.debug.app.sceneName || '', animation: s.animation || null, seq: s.sequence, view: s.viewCamera,
           panel: !el.hidden, lanes: [lanes.x, lanes.y, lanes.width, lanes.height], vpBottom: vp.bottom, seqTop: el.getBoundingClientRect().top,
           shots: document.querySelectorAll('#seq-rows .seq-shot').length,
           current: (document.querySelector('#seq-rows .seq-shot.current b') || {}).textContent || null };
})())"""


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    try:
        from PySide6 import QtTest
    except ImportError:
        from PySide2 import QtTest
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    load_setting = win.a_anim.isChecked()
    win.a_anim.setChecked(True)
    ok = {"v": True}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(
            delay, lambda: then(json.loads(r) if isinstance(r, str) and r[:1] in "{[" else r)))

    def state(then):
        js(STATE_JS, then, 0)

    def click(x, y):
        target = win.viewer.view.focusProxy() or win.viewer.view
        QtTest.QTest.mouseClick(target, QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier,
                                QtCore.QPoint(int(x), int(y)))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def open_and_wait(path, then):
        win.open_file(path)
        t0 = time.time()

        def poll():
            def got(s):
                if (s["loaded"] and s["animation"] and s["name"] == os.path.basename(path)) or time.time() - t0 > 20:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(200, poll)
            state(got)
        poll()

    def s_open(nxt):
        def got(s):
            check(s["panel"] and s["shots"] == 6, "ショットがあると下部にカメラシーケンサを表示（ショット 6 個）")
            check(abs(s["seqTop"] - s["vpBottom"]) < 2, "パネルはビューポートのすぐ下")
            check(s["seq"]["frame"] == 1 and not s["seq"]["follow"], "最初はシーケンスに従わない（Maya のビューのカメラのまま）")
            s_open.lanes = s["lanes"]
            nxt()
        open_and_wait(SEQ, got)

    def s_click(nxt):
        x, y, w, h = s_open.lanes

        def at(f):
            return x + (f - 1 + 0.5) / 49.0 * w

        click(at(30), y + h - 12)               # シーケンスのフレーム 30（SH030: scale 2・preHold 2 → シーン 21）

        def got(s):
            check(s["seq"]["follow"] and s["seq"]["frame"] == 30 and s["current"] == "SH030",
                  "トラックをクリックするとそのフレームへ移動し、シーケンスで見る: %s" % s["seq"])
            check(s["view"] == "shot_cam" and s["animation"]["frame"] == 21,
                  "ショットのカメラ（shot_cam）とシーンのフレーム（21）にする: %s / %s" % (s["view"], s["animation"]["frame"]))
            click(at(6), y + h - 12)
            QtCore.QTimer.singleShot(300, lambda: state(got2))

        def got2(s):
            check(s["current"] == "SH015" and s["view"] == "ortho_cam" and s["animation"]["frame"] == 2,
                  "重なるショットはトラック 2 を使う（SH015・ortho_cam・シーン 2）: %s" % s["current"])
            nxt()
        QtCore.QTimer.singleShot(300, lambda: state(got))

    def s_play(nxt):
        def started(s):
            check(s["seq"]["playing"], "再生ボタンでシーケンスを再生")
            QtCore.QTimer.singleShot(700, lambda: state(moved))

        def moved(s):
            check(s["seq"]["frame"] > 6, "再生中はシーケンスのフレームが進む: %s" % s["seq"]["frame"])
            js("document.getElementById('seq-play').click(); 'ok'", lambda _: state(stopped))

        def stopped(s):
            check(not s["seq"]["playing"], "もう一度押すと停止")
            js("document.querySelector('#opt-camera [data-value=\"-1\"]').click(); 'ok'", lambda _: state(free))

        def free(s):
            check(s["view"] is None and not s["seq"]["follow"], "自分でカメラを選ぶと、シーケンスに従うのをやめる")
            nxt()
        js("document.getElementById('seq-play').click(); 'ok'", lambda _: state(started))

    def s_trax(nxt):
        def got(s):
            check(not s["panel"], "ショットのないシーンではパネルを出さない")
            js("""JSON.stringify((() => { const a = window.mayaViewer.debug.app; const i = a.data.nodes.findIndex((n) => n.name === 'shoulder');
                   const r = []; for (const f of [1, 6, 50]) { window.mayaViewer.setFrame(f); r.push(+a.rig.chan(i).r[2].toFixed(3)); }
                   return { rz: r, warn: window.mayaViewer.getWarnings().filter((w) => /character/.test(w)) }; })())""",
               lambda r: (check(r["rz"] == [0, 45, -22.5] and not r["warn"],
                                "キャラクターセットの Trax のクリップを再生（shoulder.rz: %s）" % r["rz"]), nxt()))
        open_and_wait(TRAX, got)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_open, s_click, s_play, s_trax, lambda _: (win.a_anim.setChecked(load_setting), app.quit())])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
