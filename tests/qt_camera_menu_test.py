# -*- coding: utf-8 -*-
"""カメラの多いシーンのカメラのメニュー（一覧のスクロール）と、解像度ゲートの位置を確認する。

  * カメラが多いと、メニューのカメラの一覧だけがスクロールし、メニューは画面の下端に収まる
  * メニューを開くと、見ているカメラが一覧に見える位置まで送る
  * 横長のビューポートでも、解像度ゲートは左上のタイトルと下端のタイムラインに重ならず、縦横比はレンダーの解像度（16:9）

  python tests/qt_camera_menu_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
シーン（カメラ 40 個・キーあり）は一時フォルダに作る。
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

CAMERAS = 40


def scene_text() -> str:
    lines = ['requires maya "2024";', 'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "box";',
             'createNode mesh -n "boxShape" -p "box";',
             '\tsetAttr -s 4 ".vt[0:3]"  -1 0 1 1 0 1 -1 0 -1 1 0 -1;',
             '\tsetAttr -s 4 ".ed[0:3]"  0 1 0 0 2 0 1 3 0 2 3 0;',
             '\tsetAttr -s 1 -ch 4 ".fc[0]" -type "polyFaces" ',
             '\t\tf 4 0 2 -4 -2;']
    for i in range(CAMERAS):
        lines += ['createNode transform -n "camera_with_a_long_name_%02d";' % i,
                  '\tsetAttr ".t" -type "double3" %d 5 20 ;' % (i - CAMERAS // 2),
                  'createNode camera -n "camera_with_a_long_name_%02dShape" -p "camera_with_a_long_name_%02d";' % (i, i),
                  '\tsetAttr ".fl" %d;' % (20 + i)]
    # キー（タイムラインを出す）
    lines += ['createNode animCurveTL -n "box_translateX";', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 3;',
              'connectAttr "box_translateX.o" "box.tx";',
              'select -ne :defaultResolution;', '\tsetAttr ".w" 1920;', '\tsetAttr ".h" 1080;',
              '\tsetAttr ".dar" 1.7777777910232544;']
    return "\n".join(lines) + "\n"


JS_MENU = r"""JSON.stringify((() => {
  const app = window.mayaViewer.debug.app;
  app.setCamera(%d, { quiet: true });
  const btn = document.querySelector('[aria-controls="menu-camera"]');
  btn.click();
  const panel = document.getElementById('menu-camera'), list = document.getElementById('opt-camera');
  const pr = panel.getBoundingClientRect(), lr = list.getBoundingClientRect();
  const checked = list.querySelector('[aria-checked="true"]').getBoundingClientRect();
  const gate = document.getElementById('opt-camera-gate').getBoundingClientRect();
  const r = { items: list.querySelectorAll('button').length, scrolls: list.scrollHeight > list.clientHeight + 1,
    panelBottom: Math.round(pr.bottom), winH: window.innerHeight,
    checkedVisible: checked.top >= lr.top - 1 && checked.bottom <= lr.bottom + 1,
    gateOptionVisible: gate.bottom <= pr.bottom + 1 && gate.top >= pr.top };
  btn.click();
  return r;
})())"""

JS_GATE = r"""JSON.stringify((() => {
  const app = window.mayaViewer.debug.app;
  app.render();
  const b = (sel) => document.querySelector(sel).getBoundingClientRect();
  const f = b('#cam-gate .g-frame'), t = b('#vp-title'), tl = b('#timeline');
  return { ratio: f.width / f.height, top: f.top, bottom: f.bottom, titleBottom: t.bottom, timelineTop: tl.top,
    timeline: !document.getElementById('timeline').hidden };
})())"""


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
    win.resize(1900, 700)                    # 横長: ゲートの高さがビューポートの高さで決まる
    win.show()
    ok = {"v": True}
    tmp = tempfile.mkdtemp()
    path = os.path.join(tmp, "many_cameras.ma")
    with open(path, "w", encoding="utf-8") as f:
        f.write(scene_text())

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=300):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(
            delay, lambda: then(json.loads(r) if isinstance(r, str) and r[:1] in "{[" else r)))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def s_load(nxt):
        win.open_file(path)
        QtCore.QTimer.singleShot(3500, nxt)

    def s_menu(nxt):
        def got(r):
            check(r["items"] == CAMERAS + 1, "カメラの一覧に、自由視点とカメラ %d 個" % CAMERAS)
            check(r["scrolls"], "カメラが多いと、一覧がスクロールする")
            check(r["panelBottom"] <= r["winH"], "メニューは画面の下端に収まる（%d / %d）" % (r["panelBottom"], r["winH"]))
            check(r["gateOptionVisible"], "一覧の下の設定（解像度ゲート）は見えたまま")
            check(r["checkedVisible"], "見ているカメラ（下の方）が一覧に見える位置まで送る")
            nxt()
        js(JS_MENU % (CAMERAS - 3), got)

    def s_gate(nxt):
        def got(r):
            check(r["timeline"], "タイムラインを表示している")
            check(abs(r["ratio"] - 16 / 9) < 0.01, "解像度ゲートの縦横比は 16:9（%.3f）" % r["ratio"])
            check(r["bottom"] <= r["timelineTop"] + 0.5, "ゲートの下端はタイムラインより上（%.0f / %.0f）"
                  % (r["bottom"], r["timelineTop"]))
            check(r["top"] >= r["titleBottom"], "ゲートの上端は左上のタイトルより下")
            nxt()
        js(JS_GATE, got)

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        os.makedirs(args.shot, exist_ok=True)

        def save(_):
            QtCore.QTimer.singleShot(400, lambda: (win.grab().save(os.path.join(args.shot, "camera_menu.png")),
                                                   js("document.querySelector('[aria-controls=\"menu-camera\"]').click(); 1",
                                                      lambda _: nxt())))
        js("document.querySelector('[aria-controls=\"menu-camera\"]').click(); 1", save)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_menu, s_gate, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    shutil.rmtree(tmp, ignore_errors=True)
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
