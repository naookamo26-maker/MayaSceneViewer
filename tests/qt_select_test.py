# -*- coding: utf-8 -*-
"""クリックでの選択（オブジェクト・頂点）、Maya で選択できないもの、ヘッドアップディスプレイと右パネルのボタンの位置の確認。

  python tests/qt_select_test.py      （画面のない Linux では xvfb-run -a を付ける）
前提: python tools/make_select_sample.py
"""
from __future__ import annotations

import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

SAMPLE = os.path.join(ROOT, "samples", "select_sample.ma")
ANIM = os.path.join(ROOT, "samples", "anim_sample.ma")

# 腕のメッシュの頂点 150 の画面位置（ビューの中のピクセル）
POS_JS = """JSON.stringify((() => {
  const app = window.mayaViewer.debug.app; app.frameAll(true); app.render();
  const m = app.built.meshes.find((e) => e.name === 'arm_geoShape');
  const obj = m.skinned && m.skinned.visible ? m.skinned : m.staticMesh;
  const p = (obj.getVertexPosition ? obj.getVertexPosition(150, app.marker.position.clone()) : app.marker.position.clone()).applyMatrix4(obj.matrixWorld);
  p.project(app.camera);
  const r = app.canvas.getBoundingClientRect();
  return [r.left + (p.x + 1) / 2 * r.width, r.top + (1 - p.y) / 2 * r.height];
})())"""
STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats(); const app = window.mayaViewer.debug.app;
  const arm = app.built ? app.built.meshes.find((e) => e.name === 'arm_geoShape') : null;
  return { loaded: !!s.loaded, name: app.sceneName || '', selected: s.selected, picked: app.picked,
           mode: (s.settings || {}).pickMode, force: (s.settings || {}).pickAll,
           armWire: arm ? [arm.staticWire.visible || !!(arm.skinnedWire && arm.skinnedWire.visible), '#' + arm.wireMaterial.color.getHexString()] : null,
           info: document.getElementById('select-info').innerText, vertex: document.getElementById('vertex-body').innerText };
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

    target = lambda: win.viewer.view.focusProxy() or win.viewer.view  # noqa: E731

    def click(p, then):
        QtTest.QTest.mouseClick(target(), QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier,
                                QtCore.QPoint(int(p[0]), int(p[1])))
        QtCore.QTimer.singleShot(300, lambda: state(then))

    def press(key, then):
        win.activateWindow()
        QtTest.QTest.keyClick(target(), key)
        QtCore.QTimer.singleShot(300, lambda: state(then))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def open_and_wait(path, then):
        win.open_file(path)
        t0 = time.time()

        def poll():
            state(lambda s: then(s) if (s["loaded"] and s["name"] == os.path.basename(path)) or time.time() - t0 > 20
                  else QtCore.QTimer.singleShot(200, poll))
        poll()

    def s_open(nxt):
        def got(s):
            check(s["mode"] == "object" and not s["force"], "既定はオブジェクトの選択・選択の制限あり")
            js(POS_JS, lambda p: (setattr(s_open, "p", p), nxt()))
        open_and_wait(SAMPLE, got)

    def s_blocked(nxt):
        def got(s):
            check(s["selected"] is None, "Maya で選べない（リファレンスのレイヤー）腕はクリックしても選ばない: %s" % s["selected"])
            js("document.getElementById('opt-pick-all').click(); 'ok'", lambda _: click(s_open.p, forced))

        def forced(s):
            check(s["selected"] == "|arm_geo" and s["picked"] is None,
                  "「選択の制限を無視」をオンにすると、オブジェクト（arm_geo）を選ぶ: %s" % s["selected"])
            check(s["armWire"] == [True, "#f2a93b"], "選んだオブジェクトのメッシュを選択の色のワイヤーで強調: %s" % s["armWire"])
            check("ビューポートでは選択できない（リファレンス）" in s["info"], "選択情報に Maya での選択の可否を表示")
            press(QtCore.Qt.Key.Key_F8, vertex_mode)

        def vertex_mode(s):
            check(s["mode"] == "vertex", "F8 で頂点の選択に切り替える")
            click(s_open.p, vertex_clicked)

        def vertex_clicked(s):
            check(bool(s["picked"]) and "arm_geoShape.vtx[" in s["vertex"], "頂点の選択ではいちばん近い頂点のウェイトを表示: %s" % s["picked"])
            js("document.querySelector('#opt-pick [data-pick=\"object\"]').click(); document.getElementById('opt-pick-all').click(); 'ok'",
               lambda _: nxt())
        click(s_open.p, got)

    def s_hud_and_panel(nxt):
        def got(_s):
            js("""JSON.stringify((() => { const h = document.getElementById('vp-hud').getBoundingClientRect();
                   const v = document.getElementById('viewport').getBoundingClientRect();
                   const head = document.querySelector('#right .panel-head'); const b = document.getElementById('right-collapse').getBoundingClientRect();
                   const cs = getComputedStyle(document.getElementById('vp-hud'));
                   return { right: v.right - h.right, bottomHalf: h.top > v.top + v.height / 2, oneLine: h.height < 20, bg: cs.backgroundColor,
                            btnLeft: b.left - head.getBoundingClientRect().left, text: document.getElementById('vp-hud').textContent }; })())""",
               lambda r: (check(r["right"] < 20 and r["bottomHalf"] and r["oneLine"], "フレームレートの表示は右下に 1 行: %s" % r),
                          check(r["bg"] in ("rgba(0, 0, 0, 0)", "transparent"), "表示に背景の色はない: %s" % r["bg"]),
                          check(r["btnLeft"] < 4, "右パネルのたたむボタンはパネルの左端: %s" % r["btnLeft"]),
                          nxt()))
        open_and_wait(ANIM, got)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_open, s_blocked, s_hud_and_panel, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
