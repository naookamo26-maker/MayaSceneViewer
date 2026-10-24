# -*- coding: utf-8 -*-
"""Qt ビューアの自動確認（画面なしでも動く）。

  python tests/qt_smoke_test.py [scene.ma] [--shot out_dir]

ウィンドウを起動して .ma を読み込み、JS 側の状態（getStats）と選択の往復を確認する。
--shot を付けると、キャンバスとウィンドウ全体の画像を保存する。
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("scene", nargs="?", default=os.path.join(ROOT, "samples", "sample_arm.ma"))
    ap.add_argument("--shot", default=None)
    ap.add_argument("--offscreen", action="store_true", help="画面なしで実行する")
    args = ap.parse_args()

    if args.offscreen:
        os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
        os.environ.setdefault("QTWEBENGINE_DISABLE_SANDBOX", "1")
        os.environ.setdefault("QTWEBENGINE_CHROMIUM_FLAGS",
                              "--no-sandbox --ignore-gpu-blocklist --use-gl=angle --use-angle=swiftshader "
                              "--enable-unsafe-swiftshader")

    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.app import apply_dark_style
    from ma_viewer.viewer import ViewerWindow
    apply_dark_style(app)

    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    results = {"errors": []}
    win.viewer.logMessage.connect(lambda lv, t: results["errors"].append(t) if lv == "error" else None)
    selected = []
    win.viewer.nodeSelected.connect(selected.append)

    def fail(msg):
        print("NG:", msg)
        results["ok"] = False
        app.quit()

    def check_stats(stats):
        print("JS の状態:", stats)
        if not stats or not stats.get("loaded"):
            return fail("シーンが読み込まれていません")
        if not stats.get("webgl"):
            return fail("WebGL が使えません")
        results["stats"] = stats
        run_next()

    def check_pose_source():
        js = """JSON.stringify((() => {
          const app = window.mayaViewer.debug.app;
          const i = app.data.nodes.findIndex((n) => n.name === 'elbow');
          const pos = () => app.built.nodeObjects[i].matrixWorld.elements.slice(12, 15).map((v) => +v.toFixed(4));
          const r = { mode: app.settings.poseSource, title: document.getElementById('vp-title').textContent, bind: pos() };
          const btn = document.getElementById('opt-bind');       // バインドポーズのボタン（押すとファイルの値）
          r.pressed = btn.getAttribute('aria-pressed');
          btn.click();
          r.file = pos(); r.title2 = document.getElementById('vp-title').textContent;
          window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow');
          r.info = document.getElementById('select-info').innerText;
          btn.click();
          r.back = pos(); r.pressed2 = btn.getAttribute('aria-pressed');
          return r;
        })())"""

        def got(r):
            r = json.loads(r)
            print("姿勢:", {k: r[k] for k in ("mode", "bind", "file", "back")})
            if r["mode"] != "bind" or "バインドポーズ" not in r["title"]:
                return fail("既定がバインドポーズになっていません")
            if r["pressed"] != "true" or r["pressed2"] != "true":
                return fail("バインドポーズのボタンの押下状態が姿勢の基準と合っていません")
            if r["bind"] != [6, 5, 0] or r["file"] == r["bind"] or r["back"] != r["bind"]:
                return fail("姿勢の切り替えで骨の位置が期待どおりに変わりません")
            if "skinCluster の .pm" not in r["info"] or "ファイルの値" not in r["title2"]:
                return fail("姿勢の情報源が表示されていません")
            print("姿勢の切り替え: OK")
            run_next()
        win.viewer.run_js(js, got)

    def check_selected(stats):
        print("選択後:", stats.get("selected"))
        if stats.get("selected") != "|rig_grp|shoulder|elbow":
            return fail("Python からの選択が反映されていません")
        run_next()

    def set_weights_and_pose():
        js = ("document.getElementById('opt-weights').value='selected';"
              "document.getElementById('opt-weights').dispatchEvent(new Event('change'));"
              "document.getElementById('pose-rz').value='40';"
              "document.getElementById('pose-rz').dispatchEvent(new Event('input'));"
              "document.getElementById('legend').hidden");
        win.viewer.run_js(js, lambda hidden: (print("凡例の表示:", not hidden), run_next()))

    def click_joint_in_tree():
        # 階層ツリーの行をクリック → bridge.nodeSelected が Python に届くか
        js = ("(()=>{const r=[...document.querySelectorAll('#tree .row')].find(e=>e.textContent.includes('wrist'));"
              "r.querySelector('.name').click(); return r.textContent;})()")
        win.viewer.run_js(js, lambda t: (print("ツリーをクリック:", t), QtCore.QTimer.singleShot(500, run_next)))

    def check_bridge():
        print("Python が受け取った選択:", selected)
        if not selected or not selected[-1].endswith("wrist"):
            return fail("JS → Python の選択通知が届いていません")
        run_next()

    def click_vertex():
        # ワイヤー・フラット・色分けに切り替え、腕の頂点 150 の画面位置を実際にクリックする
        js = """(()=>{
          const set=(id,v)=>{const e=document.getElementById(id); e.value=v; e.dispatchEvent(new Event('change'));};
          set('opt-weights','all'); set('opt-shading','flat');
          document.getElementById('opt-wire').click();
          const app=window.mayaViewer.debug.app; const m=app.built.meshes[0];
          const p=m.skinned.getVertexPosition(150, app.marker.position.clone()).applyMatrix4(m.skinned.matrixWorld);
          p.project(app.camera);
          const r=app.canvas.getBoundingClientRect();
          const x=r.left+(p.x+1)/2*r.width, y=r.top+(1-p.y)/2*r.height;
          const o={clientX:x, clientY:y, button:0, bubbles:true, pointerId:1, isPrimary:true};
          app.canvas.dispatchEvent(new PointerEvent('pointerdown', o));
          app.canvas.dispatchEvent(new PointerEvent('pointerup', o));
          return [Math.round(x), Math.round(y)].join(',');
        })()"""
        win.viewer.run_js(js, lambda r: (print("頂点をクリック（画面座標）:", r), QtCore.QTimer.singleShot(400, run_next)))

    def check_vertex_panel():
        def done(text):
            print("頂点パネル:", " ".join((text or "").split())[:160])
            if not text or "arm_geoShape.vtx[" not in text or "合計" not in text:
                return fail("頂点のウェイトが表示されていません")
            run_next()
        win.viewer.run_js("document.getElementById('vertex-body').innerText", done)

    def shot(suffix=""):
        if not args.shot:
            return run_next()
        os.makedirs(args.shot, exist_ok=True)

        def save(data_url):
            if data_url and data_url.startswith("data:image/png;base64,"):
                with open(os.path.join(args.shot, "canvas%s.png" % suffix), "wb") as f:
                    f.write(base64.b64decode(data_url.split(",", 1)[1]))
            win.grab().save(os.path.join(args.shot, "window%s.png" % suffix))
            print("画像を保存しました:", args.shot)
            run_next()
        win.viewer.run_js("document.getElementById('canvas').toDataURL('image/png')", save)

    def finish():
        results.setdefault("ok", True)
        app.quit()

    queue = [
        lambda: win.open_file(args.scene),
        lambda: QtCore.QTimer.singleShot(2500, run_next),
        lambda: win.viewer.get_stats(check_stats),
        check_pose_source,
        lambda: (win.viewer.select_path("|rig_grp|shoulder|elbow"), QtCore.QTimer.singleShot(300, run_next)),
        lambda: win.viewer.get_stats(check_selected),
        set_weights_and_pose,
        click_joint_in_tree,
        check_bridge,
        lambda: QtCore.QTimer.singleShot(400, run_next),
        shot,
        click_vertex,
        check_vertex_panel,
        lambda: shot("2"),
        finish,
    ]

    def run_next():
        if queue:
            queue.pop(0)()

    def start():
        queue.pop(0)()   # open_file（読み込みは別スレッドなので戻りを待たない）
        run_next()

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, start))
    QtCore.QTimer.singleShot(60000, lambda: fail("タイムアウト"))
    app.exec()
    if results["errors"]:
        print("ログのエラー:")
        for e in results["errors"]:
            print("  ", e)
    print("結果:", "OK" if results.get("ok") else "NG")
    return 0 if results.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())
