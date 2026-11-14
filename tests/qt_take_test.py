# -*- coding: utf-8 -*-
"""テイク（アニメーションだけ）の一覧の確認: 表示・切り替え・ドロップの振り分け・.msv と .msva への書き出しと読み直し。

  python tests/qt_take_test.py      （画面のない Linux では xvfb-run -a を付ける）
前提: samples/reference_project（shot.ma・assets/arm_rig.ma）
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

RIG = os.path.join(ROOT, "samples", "reference_project", "assets", "arm_rig.ma")
SHOT = os.path.join(ROOT, "samples", "reference_project", "scenes", "shot.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const rows = [...document.querySelectorAll('#take-list .take-row')];
  return { loaded: !!s.loaded, name: window.mayaViewer.debug.app.sceneName || '', animation: s.animation || null,
           active: window.mayaViewer.activeTake(), count: window.mayaViewer.takeCount(),
           rows: rows.map((r) => (r.querySelector('.take-name') || {}).textContent || ''),
           activeRow: rows.findIndex((r) => r.getAttribute('aria-current') === 'true') - 1,
           dropHighlight: document.getElementById('sec-takes').classList.contains('take-drop'),
           takesTab: !document.getElementById('sec-takes').hidden };
})())"""


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtGui, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer import package
    from ma_viewer.viewer import ViewerWindow
    tmp = tempfile.TemporaryDirectory()
    shot_json = os.path.join(tmp.name, "shot010.json")
    subprocess.check_call([sys.executable, "-m", "ma_viewer", "export", SHOT, "-o", shot_json], cwd=ROOT,
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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

    def parse(r):
        if isinstance(r, str) and r[:1] in "{[":
            try:
                return json.loads(r)
            except ValueError:
                return r
        return r

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(parse(r))))

    def state(then):
        js(STATE_JS, then, 0)

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def wait_until(cond, then, timeout=20):
        t0 = time.time()

        def poll():
            def got(s):
                if cond(s) or time.time() - t0 > timeout:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(200, poll)
            state(got)
        QtCore.QTimer.singleShot(300, poll)

    def open_and_wait(path, then, anim=True):
        win.open_file(path)
        wait_until(lambda s: s["loaded"] and s["name"] == os.path.basename(path) and (s["animation"] or not anim), then)

    keep = []

    def drop_at(paths, page_xy, then):
        """ページの座標（CSS の px）にファイルを落とす（ウィンドウの dropEvent に渡す）"""
        view = win.viewer.view
        zoom = view.zoomFactor() or 1.0
        local = QtCore.QPoint(int(page_xy[0] * zoom), int(page_xy[1] * zoom))
        pos = view.mapTo(win, local)
        md = QtCore.QMimeData()
        md.setUrls([QtCore.QUrl.fromLocalFile(p) for p in paths])
        ev = QtGui.QDropEvent(QtCore.QPointF(pos), QtCore.Qt.DropAction.CopyAction, md,
                              QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier)
        mv = QtGui.QDragMoveEvent(pos, QtCore.Qt.DropAction.CopyAction, md,
                                  QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier)
        keep.append((md, ev, mv))                 # イベントを渡し終えるまで、Python の側で持っておく
        win.dragMoveEvent(mv)

        def after_move(s):
            win.dropEvent(ev)
            QtCore.QTimer.singleShot(1500, lambda: state(lambda s2: then(s, s2)))
        QtCore.QTimer.singleShot(400, lambda: state(after_move))

    def rect_of(selector, then):
        js("JSON.stringify((() => { const r = document.querySelector(%s).getBoundingClientRect(); "
           "return [r.left + r.width / 2, r.top + r.height / 2, r.bottom]; })())" % json.dumps(selector), then, 0)

    saved = {}
    keep = []

    def step_open(nxt):
        def got(s):
            check(s["loaded"] and s["animation"] is not None, "リグ（arm_rig.ma）を開く: %s" % s["name"])
            check(s["rows"][:1] == ["シーンのアニメーション"] and s["count"] == 0, "一覧の先頭はシーンのアニメーション: %s" % s["rows"])
            saved["sceneRange"] = (s["animation"]["start"], s["animation"]["end"])
            nxt()
        open_and_wait(RIG, got)

    def step_load(nxt):
        win.load_take_files([shot_json])
        wait_until(lambda s: s["count"] >= 1, lambda s: (
            check(s["rows"] == ["シーンのアニメーション", "shot010"], "ファイルからテイクを足す: %s" % s["rows"]),
            check(s["active"] == -1, "足しただけでは切り替えない"),
            nxt()))

    def step_load_ma(nxt):
        # .ma もテイクとして読み込める（読み込みスレッドで解析する）。読み終えたら一覧の末尾に足す
        win.load_take_files([SHOT])
        wait_until(lambda s: s["count"] >= 2, lambda s: (
            check(s["rows"][-1:] == ["shot"] and s["name"] == "arm_rig.ma", ".ma からテイクを読み込む（シーンは開き直さない）: %s" % s["rows"]),
            check(s["takesTab"], "足したらテイクのタブを出す"),
            js("(window.mayaViewer.debug.app.removeTake(1), 1)", lambda _r: nxt(), 300)), timeout=40)

    def step_switch(nxt):
        js("window.mayaViewer.setTake(0)", lambda _r: state(lambda s: (
            check(s["active"] == 0 and s["activeRow"] == 0, "テイクに切り替える（行を強調）"),
            check(s["animation"] and (s["animation"]["start"], s["animation"]["end"]) == (1, 24),
                  "範囲がテイクのものになる: %s" % ([(s["animation"] or {}).get("start"), (s["animation"] or {}).get("end")],)),
            check(s["animation"] and s["animation"]["frame"] == 1, "先頭のフレームへ移る"),
            nxt())), 800)

    def step_drop_list(nxt):
        def got_rect(r):
            # テイクの一覧の下端の少し上（最後の行のあと）に .json を落とす → テイクとして足す
            def done(before, after):
                check(before["dropHighlight"], "ドラッグ中は一覧の枠を強調する")
                check(after["count"] == 2 and after["rows"][-1] == "shot010", "一覧に落とした .json はテイクとして足す: %s" % after["rows"])
                check(after["name"] == "arm_rig.ma", "シーンは開き直さない")
                check(not after["dropHighlight"], "落としたら強調を消す")
                nxt()
            drop_at([shot_json], (r[0], r[2] - 3), done)
        rect_of("#sec-takes", got_rect)

    def step_drop_tab(nxt):
        # プロパティのタブを出しているときも、縦のタブ［テイク］に落とせばテイクとして足す（末尾）
        def got_rect(r):
            def done(before, after):
                check(before["takesTab"], "ドラッグでタブに載せると、テイクのタブに切り替える")
                check(after["count"] == 3, "タブに落とした .json はテイクとして足す: %s" % after["rows"])
                js("(window.mayaViewer.debug.app.removeTake(2), 1)", lambda _r: nxt(), 300)
            drop_at([shot_json], (r[0], r[1]), done)
        js("document.getElementById('tab-props').click()", lambda _r: rect_of("#tab-takes", got_rect), 200)

    def step_drop_msva(nxt):
        # .msva はビューポートに落としてもテイクとして足す
        path = os.path.join(tmp.name, "two.msva")

        def got_takes(takes):
            package.write_takes(takes[:1], path)

            def got_rect(r):
                drop_at([path], (r[0], r[1]), lambda _b, after: (
                    check(after["count"] == 3 and after["name"] == "arm_rig.ma", ".msva はビューポートに落としてもテイクとして足す: %s" % after["rows"]),
                    nxt()))
            rect_of("#viewport", got_rect)
        win.viewer.get_takes(got_takes)

    def step_export_msva(nxt):
        out = os.path.join(tmp.name, "out.msva")
        orig = QtWidgets.QFileDialog.getSaveFileName
        QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (out, ""))
        try:
            win.export_takes()
        finally:
            pass

        def later():
            QtWidgets.QFileDialog.getSaveFileName = orig
            takes = package.read_takes(out) if os.path.isfile(out) else []
            check(len(takes) == 3, "［テイクを書き出す］ですべて .msva に書き出す: %d 個" % len(takes))
            nxt()
        QtCore.QTimer.singleShot(1200, later)

    def step_export_msv(nxt):
        out = os.path.join(tmp.name, "rig_with_takes.msv")
        saved["msv"] = out
        orig = QtWidgets.QFileDialog.getSaveFileName
        QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (out, ""))
        win._export_package_with(dict(win.package_options(), view=True, textures="none"))

        def later():
            QtWidgets.QFileDialog.getSaveFileName = orig
            scene, _pkg = package.read_package(out) if os.path.isfile(out) else ({}, None)
            check(len(scene.get("savedTakes") or []) == 3, ".msv にテイクを入れて書き出す")
            check((scene.get("savedView") or {}).get("takes") == {"active": 0}, "表示の状態に選んでいたテイクを入れる")
            nxt()
        QtCore.QTimer.singleShot(2500, later)

    def step_reopen(nxt):
        def got(s):
            check(s["count"] == 3 and s["rows"][1:] == ["shot010", "shot010", "shot010"], "読み直すと一覧が戻る: %s" % s["rows"])
            check(s["active"] == 0, "選んでいたテイクが戻る")
            check(s["animation"] and (s["animation"]["start"], s["animation"]["end"]) == (1, 24), "テイクの範囲で開く")
            nxt()
        open_and_wait(saved["msv"], got)

    def step_overwrite(nxt):
        # 開いている .msv と同じ名前に上書きして、開き直す（テイクを 1 つ消してから）。.msva も同じ名前に上書きする
        out = saved["msv"]
        orig = QtWidgets.QFileDialog.getSaveFileName
        QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (out, ""))

        def removed(_r):
            win._export_package_with(dict(win.package_options(), view=True, textures="none"))

            def later():
                QtWidgets.QFileDialog.getSaveFileName = orig
                scene, _pkg = package.read_package(out)
                check(len(scene.get("savedTakes") or []) == 2, "開いている .msv に上書きする: テイク %d 個" % len(scene.get("savedTakes") or []))
                msva = os.path.join(tmp.name, "out.msva")
                QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (msva, ""))
                win.export_takes()

                def later2():
                    QtWidgets.QFileDialog.getSaveFileName = orig
                    check(len(package.read_takes(msva)) == 2, ".msva に上書きする")
                    open_and_wait(out, lambda s: (check(s["count"] == 2, "上書きした .msv を開き直せる: %s" % s["rows"]), nxt()))
                QtCore.QTimer.singleShot(1200, later2)
            QtCore.QTimer.singleShot(2500, later)
        js("(window.mayaViewer.debug.app.removeTake(2), 1)", removed, 300)

    def step_drop_scene(nxt):
        # 一覧の外（ビューポート）に .json を落とすと、いままでどおりシーンを開く（一覧は空になる）
        def got_rect(r):
            def done(_b, _a):
                # 共通 JSON のシーンの名前は、元のファイルの名前（source.name）
                wait_until(lambda s: s["name"] == "shot.ma", lambda s: (
                    check(s["name"] == "shot.ma" and s["count"] == 0, "ビューポートに落とした .json はシーンとして開く（一覧は空）: %s" % s["name"]),
                    nxt()))
            drop_at([shot_json], (r[0], r[1]), done)
        rect_of("#viewport", got_rect)

    def finish(*_):
        win.a_anim.setChecked(load_setting)
        win.close()
        tmp.cleanup()
        app.quit()

    QtCore.QTimer.singleShot(500, lambda: run([step_open, step_load, step_load_ma, step_switch, step_drop_list, step_drop_tab, step_drop_msva,
                                               step_export_msva, step_export_msv, step_reopen, step_overwrite, step_drop_scene, finish]))
    QtCore.QTimer.singleShot(150000, lambda: (check(False, "時間切れ"), finish()))
    app.exec()
    print("ALL OK" if ok["v"] else "FAILED")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
