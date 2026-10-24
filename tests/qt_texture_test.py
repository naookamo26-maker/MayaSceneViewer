# -*- coding: utf-8 -*-
"""テクスチャ表示の確認（Qt）。

  python tests/qt_texture_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）

  * file:// での直接読み込みと、Python 経由の代替経路の両方で読めるか
  * 四隅の色が違う板で、テクスチャの向きが Maya と同じか（画面の画素を読んで確認）
  * アルファの切り抜き・透過しないの切り替え
  * ウェイト表示中はテクスチャを外し、戻すと復帰するか
  * UV の継ぎ目で分けた頂点をクリックしても、元の頂点番号で表示されるか
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
SCENE = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")

HELPER = r"""
window.__tx = (() => {
  const app = window.mayaViewer.debug.app;
  const V = app.camera.position.constructor;
  const mesh = (n) => app.built.meshes.find((m) => m.name === n);
  /** メッシュのローカル座標の点を描いたときの画面の色 [r,g,b] */
  const colorAt = (meshName, x, y, z) => {
    const e = mesh(meshName);
    const p = new V(x, y, z).applyMatrix4(e.staticMesh.matrixWorld).project(app.camera);
    app.render();
    const gl = app.renderer.getContext();
    const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
    const px = Math.round((p.x + 1) / 2 * W), py = Math.round((p.y + 1) / 2 * H);
    const buf = new Uint8Array(4);
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return [buf[0], buf[1], buf[2], buf[3]];   // 背景（何も描かれていない所）はアルファ 0
  };
  const set = (id, v) => { const el = document.getElementById(id); el.querySelector('[data-value="' + v + '"]').click(); };   // メニューの選択肢を押す
  const look = (path) => { window.mayaViewer.selectByPath(path); app.fit(new V().setFromMatrixPosition(
    app.built.nodeObjects[app.selected].matrixWorld), 1.6, true); app.clearSelection(); app.render(); };
  return { app, mesh, colorAt, set, look };
})(); 'ok'
"""


def dominant(c, ch):
    other = [c[i] for i in range(3) if i != ch]
    return c[ch] > max(other) + 40


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

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(
            delay, lambda: then(json.loads(r) if isinstance(r, str) and r[:1] in "{[" else r)))

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def wait_textures(expect_via, nxt, tries=[0]):
        def got(st):
            loading = [t for t in st if t["status"] == "loading"]
            if loading and tries[0] < 50:
                tries[0] += 1
                return QtCore.QTimer.singleShot(200, lambda: wait_textures(expect_via, nxt))
            tries[0] = 0
            by = {t["node"]: t for t in st}
            print("  テクスチャ:", {k: (v["status"], v["via"], v["size"], v["hasAlpha"]) for k, v in by.items()})
            for n in ("quad_file", "box_file", "leaf_file"):
                check(by[n]["status"] == "ok" and by[n]["via"] == expect_via,
                      "%s を読み込み（経路: %s）" % (n, by[n]["via"]))
            check(by["missing_file"]["status"] == "missing", "見つからないテクスチャは missing")
            check(by["leaf_file"]["hasAlpha"] and not by["quad_file"]["hasAlpha"], "アルファの有無を判定")
            nxt()
        js("JSON.stringify(window.mayaViewer.getTextureState())", got, 0)

    def s_load(nxt):
        win.open_file(SCENE)
        QtCore.QTimer.singleShot(2000, lambda: wait_textures("file", nxt))

    def s_orientation(nxt):
        js(HELPER + "; __tx.look('|quad_geo'); 'ok'", lambda _: js(
            "JSON.stringify(['tl','tr','bl','br'].map(k => __tx.colorAt('quad_geoShape', k[1]==='l'?-0.4:0.4, k[0]==='t'?0.4:-0.4, 0)))",
            lambda c: (print("  四隅の色（左上・右上・左下・右下）:", c),
                       check(dominant(c[0], 0), "左上が赤"), check(dominant(c[1], 1), "右上が緑"),
                       check(dominant(c[2], 2), "左下が青"), check(min(c[3]) > 150, "右下が白"),
                       shot("texture_quad.png", nxt)), 0), 300)

    def s_alpha(nxt):
        code = """JSON.stringify((() => {
          __tx.look('|leaf_geo');
          const r = {};
          for (const mode of ['material', 'none', 'all']) {
            __tx.set('opt-alpha', mode);
            r[mode] = { corner: __tx.colorAt('leaf_geoShape', -0.9, -0.9, 0), center: __tx.colorAt('leaf_geoShape', 0, 0, 0) };
          }
          __tx.set('opt-alpha-style', 'blend');
          r.blend = { corner: __tx.colorAt('leaf_geoShape', -0.9, -0.9, 0), center: __tx.colorAt('leaf_geoShape', 0, 0, 0) };
          __tx.set('opt-alpha-style', 'cutout');
          __tx.set('opt-alpha', 'material');
          return r;
        })())"""

        def got(r):
            print("  葉の色:", r)
            check(dominant(r["material"]["center"], 1), "中心はテクスチャの緑")
            check(r["material"]["corner"][3] == 0, "切り抜き: 四隅は描かれない（アルファ 0）")
            check(r["none"]["corner"][3] == 255 and dominant(r["none"]["corner"], 1),
                  "透過しない: 四隅も描かれ、透明部分に保存された色（緑）が見える")
            check(r["all"]["corner"][3] == 0, "「アルファのある画像すべて」でも切り抜かれる")
            check(dominant(r["blend"]["center"], 1), "半透明でも中心は緑")
            shot("texture_leaf.png", nxt)
        js(code, got, 300)

    def s_weights(nxt):
        code = """JSON.stringify((() => {
          const m = __tx.app.built.materials.find((x) => x.name === 'quad_mat');
          const before = !!m.map;
          __tx.set('opt-weights', 'all'); const during = !!m.map;
          __tx.set('opt-weights', 'off'); const after = !!m.map;
          return { before, during, after };
        })())"""
        js(code, lambda r: (check(r["before"] and not r["during"] and r["after"],
                                  "ウェイト表示中はテクスチャを外し、戻すと復帰: %s" % r), nxt()))

    def s_pick(nxt):
        code = """(() => {
          const app = __tx.app; app.frameAll(true); app.render();
          document.querySelector('#opt-pick [data-pick="vertex"]').click();   // 頂点を選ぶ（既定はオブジェクト）
          const e = __tx.mesh('box_geoShape');
          const p = new (app.camera.position.constructor)(0, 0.6, 0.6).applyMatrix4(e.staticMesh.matrixWorld);
          app.built.root.updateMatrixWorld(true);
          const q = p.clone().project(app.camera), r = app.canvas.getBoundingClientRect();
          const o = { clientX: r.left + (q.x + 1) / 2 * r.width, clientY: r.top + (1 - q.y) / 2 * r.height,
                      button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', isPrimary: true, bubbles: true };
          app.canvas.dispatchEvent(new PointerEvent('pointerdown', o));
          app.canvas.dispatchEvent(new PointerEvent('pointerup', { ...o, buttons: 0 }));
          return JSON.stringify(app.picked);
        })()"""
        js(code, lambda r: (print("  クリックした頂点:", r),
                            check(r and r["vertex"] < 8, "分割した頂点でも元の頂点番号（0〜7）で表示"),
                            nxt()), 300)

    def s_bridge(nxt):
        js("window.mayaViewer.debug.app.forceBridgeTextures = true; 'ok'", lambda _: (
            win.open_file(SCENE), QtCore.QTimer.singleShot(2000, lambda: wait_textures("python", nxt))))

    def shot(name, nxt):
        if args.shot:
            os.makedirs(args.shot, exist_ok=True)
            win.grab().save(os.path.join(args.shot, name))
        nxt()

    def s_overview(nxt):
        if not args.shot:
            return nxt()
        js("(()=>{const a=window.mayaViewer.debug.app; a.forceBridgeTextures=false; a.frameAll(true);"
           "a.controls.object.position.sub(a.controls.target).multiplyScalar(0.75).add(a.controls.target); a.controls.update();"
           "document.getElementById('tab-meshes').click(); a.render(); return 1;})()",
           lambda _: shot("texture_overview.png", nxt), 500)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_orientation, s_alpha, s_weights, s_pick, s_bridge, s_overview, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
