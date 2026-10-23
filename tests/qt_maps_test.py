# -*- coding: utf-8 -*-
"""フラットライト・マップの表示切り替え・ノーマルマップ・UDIM の確認（画面の画素を読む）。

  python tests/qt_maps_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tests"))
from qt_texture_test import HELPER  # noqa: E402  画面の画素を読む補助（__tx）

SCENE = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")


def near(c, rgb, tol=6):
    return all(abs(a - b) <= tol for a, b in zip(c, rgb))


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

    def tex_state(node, then):
        js("JSON.stringify(window.mayaViewer.getTextureState().find(t => t.node === '%s'))" % node, then, 0)

    def wait_loaded(then, tries=[0]):
        def got(st):
            if any(t["status"] == "loading" for t in st) and tries[0] < 50:
                tries[0] += 1
                return QtCore.QTimer.singleShot(200, lambda: wait_loaded(then))
            tries[0] = 0
            then(st)
        js("JSON.stringify(window.mayaViewer.getTextureState())", got, 0)

    def s_load(nxt):
        win.open_file(SCENE)
        # 画素を読むので、手前に重なることがあるグリッドは隠す
        QtCore.QTimer.singleShot(2500, lambda: wait_loaded(lambda st: js(HELPER + "; __tx.app.grid.visible = false; 1", lambda _: (
            check(next(t for t in st if t["node"] == "pbr_orm_file")["status"] == "pending",
                  "ラフネス・メタリック用の ORM は、表示するまで読み込まない（遅延読み込み）"),
            check(next(t for t in st if t["node"] == "pbr_normal_file")["status"] == "ok", "ノーマルマップは最初から読み込む"),
            nxt()))))

    def s_flat(nxt):
        code = """JSON.stringify((() => {
          __tx.look('|quad_geo');
          const lit = __tx.colorAt('quad_geoShape', -0.4, 0.4, 0);
          __tx.set('opt-lighting', 'flat');
          const flat = __tx.colorAt('quad_geoShape', -0.4, 0.4, 0);
          __tx.set('opt-lighting', 'standard');
          return { lit, flat };
        })())"""
        js(code, lambda r: (print("  標準 / フラット:", r["lit"], r["flat"]),
                            check(near(r["flat"], (230, 40, 40)), "フラットライト: テクスチャの色（230, 40, 40）がそのまま出る"),
                            check(not near(r["lit"], (230, 40, 40), 3), "標準ライトではライトの影響を受ける"), nxt()))

    def s_map_views(nxt):
        code = """JSON.stringify((() => {
          __tx.look('|pbr_geo');
          __tx.set('opt-map-view', 'roughness');
          return 1;
        })())"""

        def after(_):
            wait_loaded(lambda st: js("""JSON.stringify((() => {
              const r = { roughTop: __tx.colorAt('pbr_geoShape', 0, 0.5, 0), roughBottom: __tx.colorAt('pbr_geoShape', 0, -0.5, 0) };
              __tx.set('opt-map-view', 'metalness');
              r.metalLeft = __tx.colorAt('pbr_geoShape', -0.5, 0, 0); r.metalRight = __tx.colorAt('pbr_geoShape', 0.5, 0, 0);
              return r; })())""", lambda r: (
                print("  ラフネス 上/下:", r["roughTop"][:3], r["roughBottom"][:3], " メタリック 左/右:", r["metalLeft"][:3], r["metalRight"][:3]),
                check(next(t for t in st if t["node"] == "pbr_orm_file")["status"] == "ok", "単独表示にすると ORM を読み込む"),
                check(near(r["roughTop"], (230, 230, 230)) and near(r["roughBottom"], (30, 30, 30)),
                      "ラフネス: ORM の G を、値どおりのグレー（230 / 30）で表示"),
                check(near(r["metalLeft"], (0, 0, 0)) and near(r["metalRight"], (255, 255, 255)),
                      "メタリック: ORM の B を、値どおりのグレー（0 / 255）で表示"),
                nxt())))
        js(code, after)

    def s_normal(nxt):
        code = """JSON.stringify((() => {
          // 板を正面から大きく映す（斜めだと細い縞が縮小時のぼかしで混ざるため）
          const app = __tx.app, V = app.camera.position.constructor;
          const c = new V().setFromMatrixPosition(app.built.nodeObjects[app.data.nodes.findIndex(n => n.name === 'nrm_geo')].matrixWorld);
          app.controls.target.copy(c); app.camera.position.copy(c).add(new V(0, 0, 3.2)); app.controls.update(); app.render();
          __tx.set('opt-map-view', 'normal');
          const view = [__tx.colorAt('nrm_geoShape', -0.9375 + 0.0625, 0, 0), __tx.colorAt('nrm_geoShape', -0.9375 + 0.3125, 0, 0)];
          __tx.set('opt-map-view', 'combined');
          const on = [__tx.colorAt('nrm_geoShape', -0.875, 0, 0), __tx.colorAt('nrm_geoShape', -0.625, 0, 0)];
          const t = document.querySelector('#map-toggles [data-map=normal]'); t.checked = false; t.dispatchEvent(new Event('change'));
          const off = [__tx.colorAt('nrm_geoShape', -0.875, 0, 0), __tx.colorAt('nrm_geoShape', -0.625, 0, 0)];
          t.checked = true; t.dispatchEvent(new Event('change'));
          return { view, on, off };
        })())"""

        def got(r):
            print("  法線マップ 単独:", [c[:3] for c in r["view"]], " 合成 オン:", [c[:3] for c in r["on"]], " オフ:", [c[:3] for c in r["off"]])
            check(near(r["view"][0], (220, 128, 180)) and near(r["view"][1], (36, 128, 180)),
                  "法線マップの単独表示: 画像の色がそのまま出る")
            diff = lambda a, b: sum(abs(x - y) for x, y in zip(a[:3], b[:3]))  # noqa: E731
            d_on, d_off = diff(*r["on"]), diff(*r["off"])
            check(d_on > 60 and d_on > d_off * 5,
                  "ノーマルマップ オン: 縞ごとに陰影が変わる（差 %d。オフでは %d）" % (d_on, d_off))
            nxt()
        js(code, got)

    def s_udim(nxt):
        code = """JSON.stringify((() => {
          __tx.look('|udim_geo');
          __tx.set('opt-lighting', 'flat');
          const r = [__tx.colorAt('udim_geoShape', -1, 0, 0), __tx.colorAt('udim_geoShape', 1, 0, 0)];
          return r;
        })())"""
        js(code, lambda r: (print("  UDIM 左/右:", r[0][:3], r[1][:3]),
                            check(near(r[0], (230, 60, 60)) and near(r[1], (60, 90, 230)),
                                  "UDIM: 左は 1001（赤）、右は 1002（青）のタイル"), nxt()))

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        js("""(()=>{ __tx.set('opt-lighting', 'standard'); __tx.set('opt-map-view', 'combined');
              for (const k of ['roughness','metalness','emissive']) { const t = document.querySelector('#map-toggles [data-map=' + k + ']');
                t.checked = true; t.dispatchEvent(new Event('change')); }
              const a = __tx.app; a.frameAll(true); document.getElementById('tab-meshes').click(); a.render(); return 1; })()""",
           lambda _: wait_loaded(lambda st: QtCore.QTimer.singleShot(400, lambda: (
               os.makedirs(args.shot, exist_ok=True), win.grab().save(os.path.join(args.shot, "maps_overview.png")),
               js("(()=>{ __tx.set('opt-map-view', 'roughness'); __tx.app.render(); return 1; })()",
                  lambda _: (win.grab().save(os.path.join(args.shot, "maps_roughness.png")), nxt()), 400)))))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_flat, s_map_views, s_normal, s_udim, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
