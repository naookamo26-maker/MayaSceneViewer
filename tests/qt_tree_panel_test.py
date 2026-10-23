# -*- coding: utf-8 -*-
"""階層の開閉（Shift+クリック・すべて開く/閉じる）と、左パネルの幅の変更を確認する。

  python tests/qt_tree_panel_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER = r"""
window.__tp = (() => {
  const rows = () => [...document.querySelectorAll('#tree .row')];
  const visible = () => rows().filter((r) => !r.hidden).map((r) => r.querySelector('.name').textContent);
  const twisty = (name, shift) => {
    const r = rows().find((x) => x.querySelector('.name').textContent === name);
    r.querySelector('.twisty').dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: !!shift }));
    return visible();
  };
  const click = (id) => { document.getElementById(id).click(); return visible(); };
  const width = () => ({
    left: Math.round(document.getElementById('left').getBoundingClientRect().width),
    viewport: Math.round(document.getElementById('viewport').getBoundingClientRect().width),
  });
  const drag = (dx) => {
    const h = document.getElementById('left-resizer'), r = h.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + 100;
    const o = (t, xx, b) => h.dispatchEvent(new PointerEvent(t, { clientX: xx, clientY: y, button: t === 'pointermove' ? -1 : 0,
      buttons: b, pointerId: 1, pointerType: 'mouse', isPrimary: true, bubbles: true }));
    o('pointerdown', x, 1); o('pointermove', x + dx / 2, 1); o('pointermove', x + dx, 1); o('pointerup', x + dx, 0);
  };
  return { visible, twisty, click, width, drag };
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

    ROOTS = ["arm_geo", "rig_grp", "props_grp", "hidden_geo"]
    CHAIN = ["shoulder", "elbow", "forearm_twist", "wrist", "wrist_end"]

    def s_load(nxt):
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, lambda: js(HELPER, lambda _: nxt()))

    def s_all(nxt):
        js("JSON.stringify([__tp.visible().length, __tp.click('tree-collapse-all'), __tp.click('tree-expand-all').length])",
           lambda r: (check(r[1] == ROOTS, "すべて閉じる: ルートだけ表示 %s" % r[1]),
                      check(r[2] == r[0] == 13, "すべて開く: 全 %d 行を表示" % r[2]), nxt()))

    def s_shift(nxt):
        code = """JSON.stringify((() => {
          __tp.click('tree-collapse-all');
          const a = __tp.twisty('rig_grp', true);      // Shift+クリック: rig_grp 以下をすべて開く
          const b = __tp.twisty('shoulder', true);     // Shift+クリック: shoulder 以下をすべて閉じる
          const c = __tp.twisty('shoulder', false);    // 通常クリック: shoulder だけ開く
          const d = __tp.twisty('rig_grp', false);     // 通常クリック: rig_grp を閉じる
          return { a, b, c, d };
        })())"""

        def got(r):
            check(all(n in r["a"] for n in CHAIN) and "box" not in r["a"],
                  "Shift+クリックで配下をすべて開く（他の枝は閉じたまま）")
            check("shoulder" in r["b"] and "elbow" not in r["b"], "Shift+クリックで配下をすべて閉じる")
            check("elbow" in r["c"] and "forearm_twist" not in r["c"],
                  "通常クリックは 1 段だけ開く（閉じた孫の階層は閉じたまま）")
            check(r["d"] == ROOTS, "通常クリックで閉じる")
            nxt()
        js(code, got)

    def s_resize(nxt):
        def step1(w0):
            js("__tp.drag(120); 'ok'", lambda _: js("JSON.stringify(__tp.width())", lambda w1: step2(w0, w1)))

        def step2(w0, w1):
            print("  幅（前 → ドラッグ後）:", w0, "→", w1)
            check(w1["left"] == w0["left"] + 120, "ドラッグで左パネルが 120px 広がる")
            check(w0["viewport"] - w1["viewport"] == 120, "その分ビューポートが狭くなる")
            shot("tree_resized.png")
            js("__tp.drag(2000); JSON.stringify(__tp.width())", lambda w2: step3(w2))

        def step3(w2):
            check(w2["left"] == 640, "広げすぎると上限（640px）で止まる: %s" % w2["left"])
            js("""(()=>{const h=document.getElementById('left-resizer'); h.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));
                  return 1;})()""", lambda _: js("JSON.stringify(__tp.width())", step4))

        def step4(w3):
            check(w3["left"] == 260, "ダブルクリックで元の幅（260px）に戻る")
            js("""(()=>{const h=document.getElementById('left-resizer'); h.focus();
                  h.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
                  h.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true}));
                  return JSON.stringify(__tp.width());})()""",
               lambda w4: (check(w4["left"] == 260 + 16 + 64, "キーボード（→ と Shift+→）でも変えられる: %s" % w4["left"]), nxt()))
        js("JSON.stringify(__tp.width())", step1)

    def shot(name):
        if args.shot:
            os.makedirs(args.shot, exist_ok=True)
            win.grab().save(os.path.join(args.shot, name))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_all, s_shift, s_resize, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
