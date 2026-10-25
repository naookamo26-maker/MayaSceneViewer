# -*- coding: utf-8 -*-
"""階層のリファレンスの表示（アイコンの印・名前空間）と、メッシュの行の選択・選択情報のメッシュの欄を確認する。

  python tests/qt_reference_tree_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
前提: python tools/make_reference_sample.py（samples/reference_project を作る）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER = r"""
window.__rt = (() => {
  const rows = () => [...document.querySelectorAll('#tree .row')];
  const row = (name) => rows().find((r) => r.querySelector('.name').textContent === name);
  const mark = (name) => {
    const r = row(name);
    return { referenced: r.classList.contains('referenced'), badge: !!r.querySelector('.ref-badge'),
      ns: (r.querySelector('.name .ns') || {}).textContent || '', title: r.querySelector('.name').title };
  };
  const clickName = (name) => {
    row(name).querySelector('.name').click();
    const sel = document.querySelector('#tree .row.selected');
    return { selected: sel ? sel.querySelector('.name').textContent : null,
      info: document.getElementById('select-info').innerText };
  };
  return { mark, clickName, tabs: document.querySelectorAll('#left [role="tab"]').length,
    meshPane: !!document.getElementById('pane-meshes') };
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
        win.open_file(os.path.join(ROOT, "samples", "reference_project", "scenes", "shot.ma"))
        QtCore.QTimer.singleShot(3000, lambda: js(HELPER, lambda _: nxt()))

    def s_panel(nxt):
        def got(r):
            check(r["tabs"] == 0 and not r["meshPane"], "左パネルはメッシュのタブがなく、階層だけ")
            nxt()
        js("JSON.stringify({ tabs: __rt.tabs, meshPane: __rt.meshPane })", got)

    def s_marks(nxt):
        def got(r):
            a, n, w = r["a"], r["nested"], r["local"]
            check(a["referenced"] and a["badge"], "リファレンスのノードはアイコンに印が付く")
            check(a["ns"] == "armA:", "名前空間は別の色で表示する（%s）" % a["ns"])
            check("リファレンス: armA（arm_rig.ma）" in a["title"], "ツールチップにリファレンスのファイル")
            check(n["badge"] and "armA:prop（prop.ma）" in n["title"], "入れ子のリファレンスは内側のファイル")
            check(not w["referenced"] and not w["badge"] and w["ns"] == "", "シーンのノードには印を付けない")
            nxt()
        js("JSON.stringify({ a: __rt.mark('armA:shoulder'), nested: __rt.mark('armA:prop:crate'),"
           " local: __rt.mark('world_grp') })", got)

    def s_select(nxt):
        def got(r):
            m, t = r["mesh"], r["transform"]
            check(m["selected"] == "armA:prop:crateShape", "メッシュの行をクリックすると、その行が選択される")
            check("三角形" in m["info"] and "UV" in m["info"] and "既定のマテリアル" in m["info"],
                  "選択情報に、メッシュの三角形・UV・マテリアルを出す")
            check("リファレンス\tarmA:prop（prop.ma）" in m["info"], "選択情報にリファレンス")
            check(t["selected"] == "armA:prop:crate", "transform の行をクリックすると transform の行が選択される")
            nxt()
        js("JSON.stringify({ mesh: __rt.clickName('armA:prop:crateShape'), transform: __rt.clickName('armA:prop:crate') })",
           got)

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        os.makedirs(args.shot, exist_ok=True)

        def save(_):
            QtCore.QTimer.singleShot(300, lambda: (win.grab().save(os.path.join(args.shot, "reference_tree.png")), nxt()))
        js("__rt.clickName('armA:arm_geoShape'); 1", save)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_panel, s_marks, s_select, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
