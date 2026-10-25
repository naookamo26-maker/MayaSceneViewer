# -*- coding: utf-8 -*-
"""右パネル（プロパティ）が、選んでいるものに関係する欄だけを出すことを確認する。

  * カメラを選ぶと、カメラの欄（焦点距離・画角・フィルムバックなど。キーで動く焦点距離はいまのフレームの値）
  * 「このカメラから見る」ボタン
  * 頂点の欄は、頂点の選択（F8）に切り替えたときだけ
  * 姿勢の基準は、バインドポーズの情報があるノード・ジョイントだけ
  * カメラのメニューに、古い説明（カメラから見ている間は動かせない）が残っていない

  python tests/qt_properties_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
前提: python tools/make_vis_camera_sample.py（samples/vis_camera_sample.ma を作る）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER = r"""
window.__pp = (() => {
  const app = window.mayaViewer.debug.app;
  const info = () => ({ head: document.getElementById('select-head').innerText,
    body: document.getElementById('select-info').innerText,
    vertexShown: !document.getElementById('sec-vertex').hidden, viewCamera: app.viewCamera });
  const select = (path) => { window.mayaViewer.selectByPath(path); return info(); };
  const frame = (f) => { window.mayaViewer.setFrame(f); app.render(); return info(); };
  const view = () => { document.querySelector('#select-info [data-view-camera]').click(); return info(); };
  const free = () => { app.setCamera(-1, { quiet: true }); return info(); };
  const pick = (mode) => { document.querySelector('#opt-pick [data-pick="' + mode + '"]').click(); return info(); };
  return { info, select, frame, view, free, pick, note: document.getElementById('camera-note').textContent };
})(); 'ok'
"""


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

    def s_load(nxt):
        win.open_file(os.path.join(ROOT, "samples", "vis_camera_sample.ma"))
        QtCore.QTimer.singleShot(3500, lambda: js(HELPER, lambda _: nxt()))

    def s_initial(nxt):
        def got(r):
            check(not r["info"]["vertexShown"], "オブジェクトの選択では、頂点の欄を出さない")
            check("できません" not in r["note"] and "再現します" in r["note"],
                  "カメラのメニューに古い説明が残っていない: %s" % r["note"])
            nxt()
        js("JSON.stringify({ info: __pp.info(), note: __pp.note })", got)

    def s_camera(nxt):
        def got(r):
            f1, f24 = r["f1"], r["f24"]
            check("カメラ" in f1["head"], "カメラの transform を選ぶと、種類は「カメラ」")
            check("カメラ shot_camShape" in f1["body"] and "焦点距離\t35.00 mm" in f1["body"],
                  "カメラの欄に焦点距離（1 フレーム目 35 mm）")
            check("54.43°" in f1["body"], "画角（水平）: フィルムバック 36 mm・焦点距離 35 mm → 54.43°")
            check("フィルムフィット\t水平" in f1["body"] and "レンダーの解像度\t1,920 × 1,080" in f1["body"],
                  "フィルムフィットとレンダーの解像度")
            check("キー・リグ" in f1["body"], "キーで動く焦点距離には印")
            check("焦点距離\t85.00 mm" in f24["body"] and "23.91°" in f24["body"],
                  "フレームを動かすと、いまのフレームの焦点距離・画角（24 フレーム目 85 mm）")
            check("姿勢の基準" not in f1["body"], "バインドポーズの情報のないノードには、姿勢の基準を出さない")
            check("このカメラから見る" in f1["body"], "自由視点のときは「このカメラから見る」ボタン")
            nxt()
        # 開いたときは、保存時の Maya のビューと同じく shot_cam から見ているので、自由視点に戻してから確かめる
        js("JSON.stringify({ f1: (__pp.free(), __pp.frame(1), __pp.select('|shot_cam')), f24: __pp.frame(24) })", got)

    def s_view(nxt):
        def got(r):
            check(r["viewCamera"] == 0 and "このカメラから見ています" in r["body"], "「このカメラから見る」で、そのカメラから見る")
            nxt()
        js("JSON.stringify(__pp.view())", got, 400)

    def s_ortho(nxt):
        def got(r):
            check("投影\t平行投影" in r["body"] and "焦点距離" not in r["body"], "平行投影のカメラは、焦点距離の代わりに幅")
            nxt()
        js("JSON.stringify(__pp.select('|ortho_cam'))", got)

    def s_joint(nxt):
        def got(r):
            check("姿勢の基準" in r["body"] and "カメラ" not in r["body"], "ジョイントには姿勢の基準を出し、カメラの欄は出さない")
            nxt()
        js("JSON.stringify(__pp.select('|rig_grp|shoulder'))", got)

    def s_vertex(nxt):
        def got(r):
            check(r["v"]["vertexShown"], "頂点の選択に切り替えると、頂点の欄（案内）を出す")
            check(not r["o"]["vertexShown"], "オブジェクトの選択に戻すと、頂点の欄を隠す")
            nxt()
        js("JSON.stringify({ v: __pp.pick('vertex'), o: __pp.pick('object') })", got)

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        os.makedirs(args.shot, exist_ok=True)

        def save(_):
            QtCore.QTimer.singleShot(400, lambda: (win.grab().save(os.path.join(args.shot, "properties_camera.png")), nxt()))
        js("__pp.free(); __pp.frame(12); __pp.select('|shot_cam'); 1", save)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_initial, s_camera, s_view, s_ortho, s_joint, s_vertex, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
