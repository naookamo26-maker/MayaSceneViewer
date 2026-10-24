# -*- coding: utf-8 -*-
"""GPU のスキン変形（8 インフルエンス）が CPU の計算（Maya の式）と一致するかを、描画結果で確認する。

  python tests/qt_skin8_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）

同じポーズを「GPU で変形したメッシュ」と「CPU で変形した頂点で作ったメッシュ」で描き、
塗られた画素の不一致を数える。対照として three.js 標準（4 インフルエンス）のシェーダーでも描き、
こちらは大きくずれる（＝この比較で違いを検出できる）ことも確かめる。
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)


def T(x):
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1]


def chain_scene(n_joints=8):
    """X 方向に並んだジョイントと、全頂点が全ジョイントに均等なウェイトを持つ板。"""
    nodes = [{"name": "geo", "path": "|geo", "type": "transform", "parent": -1, "matrix": T(0),
              "worldMatrix": T(0), "visible": True, "attrs": {}}]
    path = ""
    for j in range(n_joints):
        path += "|j%d" % j
        nodes.append({"name": "j%d" % j, "path": path, "type": "joint", "parent": -1 if j == 0 else j,
                      "matrix": T(0 if j == 0 else 1), "worldMatrix": T(j), "visible": True, "attrs": {},
                      "segmentScaleCompensate": True})
    cols = n_joints * 4 + 1
    positions = []
    for c in range(cols):
        x = c * 0.25
        positions += [x, 0, -0.6, x, 0, 0.6]
    counts, indices = [], []
    for c in range(cols - 1):
        counts.append(4)
        indices += [c * 2, c * 2 + 2, c * 2 + 3, c * 2 + 1]
    nv = cols * 2
    w = round(1.0 / n_joints, 6)
    return {
        "schema": "maya-scene-lite", "version": 1,
        "source": {"kind": "test", "name": "8 インフルエンスの確認"},
        "warnings": [], "stats": {"meshes": 1, "vertices": nv, "joints": n_joints},
        "nodes": nodes,
        "meshes": [{"name": "plateShape", "path": "|geo|plateShape", "transform": 0, "visible": True,
                    "positions": positions, "counts": counts, "indices": indices,
                    "skin": {"cluster": "skinCluster1", "method": 0,
                             "influences": list(range(1, n_joints + 1)),
                             "bindPreMatrices": [T(-j) for j in range(n_joints)], "geomMatrix": T(0),
                             "counts": [n_joints] * nv,
                             "indices": list(range(n_joints)) * nv,
                             "weights": [w] * (n_joints * nv)}}],
    }


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

    CHECK = """JSON.stringify((()=>{
      const d = window.mayaViewer.debug, app = d.app;
      %s
      app.frameAll(true);
      return { eight: d.checkSkinning(0), four: d.checkSkinning(0, { eightOnGpu: false }),
               maxCount: app.built.meshes[0].skin.stats.maxCount };
    })())"""

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def s_chain(nxt):
        win.show_scene(chain_scene(8))
        QtCore.QTimer.singleShot(1500, lambda: js(CHECK % """
          app.setPose(8, { t: [0, 0.5, 0], r: [0, 0, 70], s: [1, 1, 1] });
          app.setPose(6, { t: [0, 0, 0], r: [30, 0, 0], s: [1, 1.5, 1] });""", lambda r: (
            print("  合成シーン:", r),
            check(r["maxCount"] == 8, "全頂点が 8 インフルエンスを持つ"),
            check(r["eight"]["covered"] > 2000, "メッシュが十分な大きさで描かれている（%d 画素）" % r["eight"]["covered"]),
            check(r["eight"]["ratio"] < 0.01, "GPU（8 本）と CPU の描画が一致（不一致 %.3f%%）" % (r["eight"]["ratio"] * 100)),
            check(r["four"]["ratio"] > 0.1, "対照: 4 本までのシェーダーでは大きくずれる（不一致 %.1f%%）" % (r["four"]["ratio"] * 100)),
            shot("skin8_chain.png", nxt))))

    def s_arm(nxt):
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, lambda: js(CHECK % """
          const i = (n) => app.data.nodes.findIndex((x) => x.name === n);
          app.setPose(i('elbow'), { t: [0, 0, 0], r: [0, 0, -50], s: [1, 1, 1] });
          app.setPose(i('forearm_twist'), { t: [0, 0, 0], r: [80, 0, 0], s: [1, 1, 1] });""", lambda r: (
            print("  サンプルの腕:", r),
            check(r["eight"]["ratio"] < 0.01, "サンプルの腕でも GPU と CPU が一致（不一致 %.3f%%）" % (r["eight"]["ratio"] * 100)),
            nxt())))

    def shot(name, nxt):
        if args.shot:
            os.makedirs(args.shot, exist_ok=True)
            js("(()=>{document.querySelector('#opt-weights [data-value=\"all\"]').click();"
               "window.mayaViewer.debug.app.render(); return 1;})()",
               lambda _: (win.grab().save(os.path.join(args.shot, name)), nxt()), 400)
        else:
            nxt()

    def s_normalized(nxt):
        # ウェイトの合計 0.6・ポスト正規化。GPU でも合計で割った値で変形されるか
        sc = chain_scene(8)
        sk = sc["meshes"][0]["skin"]
        sk["weights"] = [round(w * 0.6, 6) for w in sk["weights"]]
        sk["normalize"] = 2
        win.show_scene(sc)
        QtCore.QTimer.singleShot(1500, lambda: js(CHECK % """
          app.setPose(8, { t: [0, 0.5, 0], r: [0, 0, 70], s: [1, 1, 1] });""", lambda r: (
            print("  正規化（ポスト）:", r),
            check(r["eight"]["ratio"] < 0.01, "ポスト正規化でも GPU と CPU が一致（不一致 %.3f%%）" % (r["eight"]["ratio"] * 100)),
            nxt())))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run([s_chain, s_arm, s_normalized, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
