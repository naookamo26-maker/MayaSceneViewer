# -*- coding: utf-8 -*-
"""ノードの表示・非表示（階層の目のアイコン・Ctrl+H / Shift+H）の確認。

  python tests/qt_visibility_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER = r"""
window.__vis = (() => {
  const app = window.mayaViewer.debug.app;
  const rows = () => [...document.querySelectorAll('#tree .row')];
  const row = (name) => rows().find((r) => r.querySelector('.name').textContent === name);
  const eye = (name) => { row(name).querySelector('.eye').click(); return state(); };
  const mesh = (name) => app.built.meshes.find((m) => m.name === name);
  const jointSize = (name) => {
    const k = app.overlay.joints.indexOf(app.data.nodes.findIndex((n) => n.name === name));
    return +app.overlay.spheres.instanceMatrix.array[k * 16].toFixed(4);   // 球の大きさ（行列の X 成分）
  };
  const state = () => ({
    rows: Object.fromEntries(rows().map((r) => [r.querySelector('.name').textContent,
      { eye: r.querySelector('.eye').getAttribute('aria-pressed') === 'true', dim: r.classList.contains('dim') }])),
    meshes: Object.fromEntries(app.built.meshes.map((m) => [m.name, { visible: m.visible, self: m.selfVisible,
      drawn: (m.skinned || m.staticMesh).visible || m.staticMesh.visible }])),
    joints: { shoulder: jointSize('shoulder'), elbow: jointSize('elbow'), wrist_end: jointSize('wrist_end') },
  });
  const key = (k, mods) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...mods }));
  return { eye, state, key, app };
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
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, lambda: js(HELPER + "; document.getElementById('opt-joints').click(); 'ok'",
                                                  lambda _: nxt()))

    def s_initial(nxt):
        def got(s):
            check(not s["rows"]["hidden_geo"]["eye"], "Maya で非表示のノードは、最初から非表示（目に斜線）")
            check(s["rows"]["hidden_geoShape"]["dim"] and s["rows"]["hidden_geoShape"]["eye"],
                  "その下のメッシュは、親が非表示のため薄く表示（メッシュ自身は表示）")
            check(not s["meshes"]["hidden_geoShape"]["visible"] and s["meshes"]["arm_geoShape"]["visible"], "描画も一致")
            nxt()
        js("JSON.stringify(__vis.state())", got)

    def s_toggle_group(nxt):
        def got(r):
            a, b = r["a"], r["b"]
            check(a["meshes"]["hidden_geoShape"]["visible"] and not a["rows"]["hidden_geoShape"]["dim"],
                  "非表示だったグループを表示すると、その下のメッシュも表示")
            check(not b["meshes"]["arm_geoShape"]["visible"] and b["meshes"]["arm_geoShape"]["self"]
                  and b["rows"]["arm_geoShape"]["eye"],
                  "グループを隠すと下のメッシュも隠れる（メッシュ自身の表示の設定と行の目はそのまま）")
            check(b["joints"]["shoulder"] > 0, "別の枝のジョイントは表示されたまま")
            nxt()
        js("JSON.stringify({ a: __vis.eye('hidden_geo'), b: __vis.eye('arm_geo') })", got)

    def s_joints(nxt):
        def got(r):
            check(r["hid"]["joints"] == {"shoulder": 0, "elbow": 0, "wrist_end": 0},
                  "ジョイントを隠すと、その下の骨もすべて隠れる")
            check(r["shown"]["joints"]["shoulder"] > 0 and r["shown"]["joints"]["wrist_end"] > 0, "表示に戻せる")
            nxt()
        js("JSON.stringify({ hid: __vis.eye('shoulder'), shown: __vis.eye('shoulder') })", got)

    def s_mesh_row(nxt):
        code = """JSON.stringify((() => {
          __vis.eye('arm_geo');                                 // グループを表示に戻す
          const a = __vis.eye('arm_geoShape');                   // メッシュの行の目
          const b = __vis.eye('arm_geoShape');
          return { a, b };
        })())"""

        def got(r):
            check(not r["a"]["meshes"]["arm_geoShape"]["visible"] and not r["a"]["rows"]["arm_geoShape"]["eye"],
                  "メッシュの行の目で、メッシュだけを隠せる")
            check(r["a"]["rows"]["arm_geo"]["eye"], "メッシュを隠しても、親の transform の目はそのまま")
            check(r["b"]["meshes"]["arm_geoShape"]["visible"] and r["b"]["rows"]["arm_geoShape"]["eye"],
                  "もう一度押すと表示に戻る")
            nxt()
        js(code, got)

    def s_keys(nxt):
        code = """JSON.stringify((() => {
          window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow');
          __vis.key('h', { ctrlKey: true });
          const a = __vis.state();
          const info = document.getElementById('select-info').innerText;
          window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow|forearm_twist');
          const info2 = document.getElementById('select-info').innerText;
          window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow');
          __vis.key('H', { shiftKey: true });
          const b = __vis.state();
          __vis.key('h');                                  // H だけ: 切り替え（表示 → 非表示）
          const c = __vis.state();
          __vis.key('h');                                  // もう一度で表示に戻る
          return { a, b, c, d: __vis.state(), info, info2 };
        })())"""

        def got(r):
            check(r["a"]["joints"]["elbow"] == 0 and r["a"]["joints"]["shoulder"] > 0 and not r["a"]["rows"]["elbow"]["eye"],
                  "Ctrl+H で選択中のノードを隠す")
            check("非表示" in r["info"] and "親が非表示のため隠れています" in r["info2"], "選択情報に表示状態")
            check(r["b"]["joints"]["elbow"] > 0 and r["b"]["rows"]["elbow"]["eye"], "Shift+H で表示する")
            check(r["c"]["joints"]["elbow"] == 0 and not r["c"]["rows"]["elbow"]["eye"]
                  and r["d"]["joints"]["elbow"] > 0 and r["d"]["rows"]["elbow"]["eye"], "H だけで表示・非表示を切り替える")
            nxt()
        js(code, got)

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        js("__vis.eye('props_grp'); __vis.app.frameAll(true); __vis.app.render(); 'ok'",
           lambda _: (os.makedirs(args.shot, exist_ok=True), win.grab().save(os.path.join(args.shot, "visibility.png")), nxt()), 400)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_initial, s_toggle_group, s_joints, s_mesh_row, s_keys, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
