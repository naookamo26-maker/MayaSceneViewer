# -*- coding: utf-8 -*-
"""リグで切り替える表示・シーンのカメラ・バインドポーズのボタン・ツールバーの「効果なし」の表示の確認。

  python tests/qt_viscam_test.py      （画面のない Linux では xvfb-run -a を付ける）
前提: python tools/make_vis_camera_sample.py
"""
from __future__ import annotations

import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

SAMPLE = os.path.join(ROOT, "samples", "vis_camera_sample.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const $ = (id) => document.getElementById(id);
  return {
    loaded: !!s.loaded, animation: s.animation || null, pose: s.settings ? s.settings.poseSource : null,
    hidden: s.hiddenMeshes || [], cameras: s.cameras || [], view: s.viewCamera || null,
    bindPressed: $('opt-bind').getAttribute('aria-pressed'),
    inert: [...document.querySelectorAll('#toolbar .icon-btn.inert')].map((b) => b.id),
    gate: !$('cam-gate').hidden, camState: $('menu-camera-state').textContent,
    wire: $('opt-wire').getAttribute('aria-pressed'),
  };
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

    def key(k, shift=False):
        return ("window.dispatchEvent(new KeyboardEvent('keydown', { key: '%s', shiftKey: %s, bubbles: true })); 'ok'"
                % (k, "true" if shift else "false"))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def s_open(nxt):
        win.open_file(SAMPLE)
        t0 = time.time()

        def poll():
            def got(s):
                if (s["loaded"] and s["animation"]) or time.time() - t0 > 20:
                    check(s["loaded"] and s["animation"], "シーンとアニメーションを読み込んだ")
                    check(s["pose"] == "file" and s["bindPressed"] == "false",
                          "アニメーションを読み込むと「ファイルの値」に切り替わり、バインドポーズのボタンが戻る")
                    check(sorted(s["hidden"]) == ["boxShape", "hidden_geoShape"],
                          "フレーム 1: コントローラーの属性で隠れる箱は非表示、腕は表示: %s" % s["hidden"])
                    check(s["cameras"] == ["shot_cam", "ortho_cam"], "シーンのカメラ: %s" % s["cameras"])
                    check(s["view"] == "shot_cam" and s["gate"],
                          "保存したときに Maya のビューで見ていたカメラ（shot_cam）から表示する: %s" % s["view"])
                    js(key("C", True), lambda _: nxt())          # 以降は自由視点から
                else:
                    QtCore.QTimer.singleShot(200, poll)
            state(got)
        poll()

    def s_frame(nxt):
        def got(s):
            check("arm_geoShape" in s["hidden"], "フレーム 15: キーのある属性で腕も非表示: %s" % s["hidden"])
            # 目のアイコンで表示し直すと、リグで隠れていても表示する
            js("""(() => { const app = window.mayaViewer.debug.app;
                   const i = app.data.nodes.findIndex((n) => n.name === 'arm_geo');
                   app.select(i); const before = document.getElementById('select-info').innerText;
                   app.toggleNodeVisible(i); return JSON.stringify({ before, hidden: window.mayaViewer.getStats().hiddenMeshes }); })()""",
               lambda r: (check("リグ・アニメーションで決まる値" in r["before"], "選択情報に、リグで隠れていることを表示"),
                          check("arm_geoShape" not in r["hidden"], "H（目のアイコン）で表示し直せる"),
                          nxt()))
        js("window.mayaViewer.setFrame(15); 'ok'", lambda _: state(got))

    def s_camera(nxt):
        def cam1(s):
            check(s["view"] == "shot_cam" and s["gate"] and s["camState"] == "shot_cam",
                  "C でカメラ shot_cam から表示し、解像度ゲートを出す: %s" % {k: s[k] for k in ("view", "gate", "camState")})
            js(key("c"), lambda _: state(cam2))

        def cam2(s):
            check(s["view"] == "ortho_cam", "もう一度 C で次のカメラ（平行投影）")
            js(key("C", True), lambda _: state(free))

        def free(s):
            check(s["view"] is None and not s["gate"], "Shift+C で自由視点に戻す")
            nxt()
        js(key("c"), lambda _: state(cam1))

    def s_camera_menu(nxt):
        """［カメラ］を開いて、カメラの名前を押す（2 クリック）だけで切り替わり、メニューは閉じる"""
        target = win.viewer.view.focusProxy() or win.viewer.view

        def click(x, y):
            QtTest.QTest.mouseClick(target, QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier,
                                    QtCore.QPoint(int(x), int(y)))

        center = ("JSON.stringify((() => { const r = document.querySelector(%s).getBoundingClientRect();"
                  " return [r.x + r.width / 2, r.y + r.height / 2]; })())")

        def opened(_):
            js(center % "'#opt-camera [data-value=\"1\"]'", lambda p: (click(*p), QtCore.QTimer.singleShot(300, lambda: state(done))))

        def done(s):
            js("document.getElementById('menu-camera').hidden", lambda hidden: (
                check(s["view"] == "ortho_cam" and hidden is True,
                      "［カメラ］→ カメラの名前の 2 クリックで切り替わり、メニューが閉じる: %s" % s["view"]),
                js(key("C", True), lambda _: nxt())))
        js(center % "'.menu-btn[aria-controls=\"menu-camera\"]'", lambda p: (click(*p), QtCore.QTimer.singleShot(300, lambda: opened(None))))

    def s_camera_drag(nxt):
        """カメラから見ているとき: 停止中はドラッグで視点を動かせ、フレームを動かすとカメラの位置に戻る。再生中は動かせない"""
        drag_js = """JSON.stringify((() => {
          const app = window.mayaViewer.debug.app, c = app.canvas, r = c.getBoundingClientRect();
          const cam = app.activeCamera(), before = cam.position.toArray();
          const ev = (type, x, y, buttons) => c.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y,
            button: type === 'pointermove' ? -1 : 0, buttons, pointerId: 1, pointerType: 'mouse', isPrimary: true, bubbles: true }));
          const x = r.left + r.width / 2, y = r.top + r.height / 2;
          ev('pointerdown', x, y, 1);
          for (let i = 1; i <= 8; i++) ev('pointermove', x + i * 10, y + i * 3, 1);
          ev('pointerup', x + 80, y + 24, 0);
          app.render();
          const node = app.built.nodeObjects[app.cameras[app.viewCamera].transform].getWorldPosition(cam.position.clone());
          const s = window.mayaViewer.getStats();
          return { moved: cam.position.distanceTo(new cam.position.constructor(...before)) > 1e-3,
                   offNode: cam.position.distanceTo(node) > 1e-3, edited: s.cameraEdited, view: s.viewCamera,
                   state: document.getElementById('menu-camera-state').textContent };
        })())"""

        def dragged(r):
            check(r["moved"] and r["offNode"] and r["edited"] and r["view"] == "shot_cam",
                  "停止中はカメラのビューをドラッグで動かせる（カメラから見たまま）: %s" % r)
            check("視点を移動中" in r["state"], "メニュー名の横に視点を移動中と表示: %s" % r["state"])
            js("""JSON.stringify((() => { window.mayaViewer.setFrame(6); const app = window.mayaViewer.debug.app; app.render();
                   const cam = app.activeCamera(); const node = app.built.nodeObjects[app.cameras[app.viewCamera].transform].getWorldPosition(cam.position.clone());
                   return { back: cam.position.distanceTo(node) < 1e-4, edited: window.mayaViewer.getStats().cameraEdited }; })())""", back)

        def back(r):
            check(r["back"] and not r["edited"], "フレームを動かすとカメラの位置に戻る: %s" % r)
            js("""JSON.stringify((() => { document.getElementById('tl-play').click();
                   const s = window.mayaViewer.getStats(); const nav = s.navigation; document.getElementById('tl-play').click();
                   return { nav, after: window.mayaViewer.getStats().navigation }; })())""", playing)

        def playing(r):
            check(r["nav"] is False and r["after"] is True, "再生中は視点を動かせず、止めると動かせる: %s" % r)
            js(key("C", True), lambda _: nxt())
        js("window.mayaViewer.setFrame(5); window.mayaViewer.debug.app.setCamera(0); 'ok'", lambda _: js(drag_js, dragged))

    def s_bind_key(nxt):
        js(key("b"), lambda _: state(lambda s: (
            check(s["pose"] == "bind" and s["bindPressed"] == "true", "B でバインドポーズに切り替え（ボタンも押下状態）"),
            js(key("b"), lambda _: nxt()))))

    def s_inert(nxt):
        # ワイヤーのみ（4）ではワイヤーのボタンは効果がない: 薄く表示するが、クリックは受け付ける
        pos_js = """JSON.stringify((() => { const b = document.getElementById('opt-wire'); const r = b.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2, wire: b.getAttribute('aria-pressed'),
                     inert: [...document.querySelectorAll('#toolbar .icon-btn.inert')].map((x) => x.id) }; })())"""

        def got(pos):
            check("opt-wire" in pos["inert"], "ワイヤーのみの表示では［ワイヤー］を効果なしとして表示: %s" % pos["inert"])
            check("opt-xray" in pos["inert"], "ジョイントを隠しているときは［前面に表示］を効果なしとして表示")
            target = win.viewer.view.focusProxy() or win.viewer.view
            QtTest.QTest.mouseClick(target, QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier,
                                    QtCore.QPoint(int(pos["x"]), int(pos["y"])))
            QtCore.QTimer.singleShot(300, lambda: state(lambda s: clicked(pos, s)))

        def clicked(pos, s):
            check(s["wire"] != pos["wire"], "効果なしの表示でも、マウスのクリックで押下状態は切り替わる")
            js(key("5"), lambda _: state(back))

        def back(s):
            check("opt-wire" not in s["inert"], "シェーディングに戻すと通常の表示")
            nxt()
        js(key("4"), lambda _: js(pos_js, got))

    def s_grid(nxt):
        js("""JSON.stringify((() => { const g = window.mayaViewer.debug.app.grid; const c = g.geometry.getAttribute('color');
               const cols = new Set(); for (let i = 0; i < c.count; i++) cols.add([c.getX(i), c.getY(i), c.getZ(i)].map((v) => v.toFixed(2)).join());
               return { n: cols.size, red: [...cols].some((s) => { const [r, g2, b] = s.split(',').map(Number); return r > g2 * 1.5 && r > b * 1.5; }) }; })())""",
           lambda r: (check(r["n"] == 3 and r["red"], "グリッドの原点の線は軸の色（3 色・X 軸は赤系）: %s" % r), nxt()))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_open, s_frame, s_camera, s_camera_menu, s_camera_drag, s_bind_key, s_inert, s_grid,
         lambda _: (win.a_anim.setChecked(load_setting), app.quit())])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
