# -*- coding: utf-8 -*-
"""元に戻す・やり直しの確認（Qt）。

  python tests/qt_undo_test.py      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tests"))

from qt_gizmo_test import HELPER_JS  # noqa: E402  ハンドルを掴んでドラッグする補助

UNDO_HELPER = r"""
window.__ud = (() => {
  const app = window.mayaViewer.debug.app;
  const idx = (n) => app.data.nodes.findIndex((x) => x.name === n);
  const pose = (n) => app.pose.get(idx(n));
  const key = (k, mods = {}, target = window) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...mods }));
  const hist = () => window.mayaViewer.getHistory();
  const typeInto = (id, values) => {
    const el = document.getElementById(id);
    el.focus();
    for (const v of values) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  };
  const r = (n) => pose(n).r.map((v) => +v.toFixed(3));
  const t = (n) => pose(n).t.map((v) => +v.toFixed(3));
  return { app, idx, pose, key, hist, typeInto, r, t };
})(); 'ok'
"""


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
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

    SCENE = os.path.join(ROOT, "samples", "sample_arm.ma")

    def s_load(nxt):
        win.open_file(SCENE)
        QtCore.QTimer.singleShot(2500, lambda: js(
            HELPER_JS + UNDO_HELPER + "; window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow'); 'ok'", lambda _: nxt()))

    def s_record(nxt):
        code = """JSON.stringify((() => {
          __gz.key('w'); let h = __gz.find('X'); __gz.drag(h.x, h.y, h.dirx * 80, h.diry * 80);
          __gz.key('e'); h = __gz.find('X'); __gz.drag(h.x, h.y, 40, 60);
          __gz.key('q');
          __ud.typeInto('pose-ry', ['1', '15', '15.5']);     // 3 回入力して確定 → 1 操作
          return { hist: __ud.hist(), t: __ud.t('elbow'), r: __ud.r('elbow') };
        })())"""

        def got(r):
            print("  履歴:", r["hist"]["undo"])
            check(r["hist"]["undo"] == ["移動（elbow）", "回転（elbow）", "数値入力（elbow）"],
                  "ドラッグ 2 回と数値入力（3 回入力して確定）が 3 つの操作として記録される")
            check(r["r"][1] == 15.5 and r["t"][0] > 0.05, "変更が適用されている")
            nxt()
        js(code, got, 400)

    def s_keys(nxt):
        code = """JSON.stringify((() => {
          const out = {};
          __ud.key('z', { ctrlKey: true });            out.a = { r: __ud.r('elbow'), h: __ud.hist() };
          __ud.key('z', { ctrlKey: true });            out.b = { r: __ud.r('elbow'), t: __ud.t('elbow') };
          __ud.key('y', { ctrlKey: true });            out.c = { r: __ud.r('elbow') };
          __ud.key('z');                               out.d = { r: __ud.r('elbow') };
          __ud.key('Z', { shiftKey: true });           out.e = { r: __ud.r('elbow') };
          __ud.key('z', { ctrlKey: true, shiftKey: true }); out.f = { h: __ud.hist() };
          return out;
        })())"""

        def got(r):
            check(r["a"]["r"][1] == 0 and abs(r["a"]["r"][0]) > 1 and r["a"]["h"]["redo"] == ["数値入力（elbow）"],
                  "Ctrl+Z: 数値入力だけが戻る（ハンドルの回転は残る）")
            check(r["b"]["r"] == [0, 0, 0] and r["b"]["t"][0] > 0.05, "Ctrl+Z: 回転が戻る（移動は残る）")
            check(abs(r["c"]["r"][0]) > 1, "Ctrl+Y: 回転をやり直す")
            check(r["d"]["r"] == [0, 0, 0], "Z: 元に戻す（Maya と同じ）")
            check(abs(r["e"]["r"][0]) > 1, "Shift+Z: やり直す（Maya と同じ）")
            check(r["f"]["h"]["redo"] == [], "Ctrl+Shift+Z: やり直す")
            nxt()
        js(code, got)

    def s_input_focus(nxt):
        code = """JSON.stringify((() => {
          const before = __ud.hist().undo.length;
          const el = document.getElementById('pose-tx'); el.focus();
          __ud.key('z', { ctrlKey: true }, el);        // 入力欄では文字の取り消しを優先
          el.blur();
          return { before, after: __ud.hist().undo.length };
        })())"""
        js(code, lambda r: (check(r["before"] == r["after"], "入力欄にフォーカスがあるときはビューアの取り消しをしない"), nxt()))

    def s_reset_all(nxt):
        code = """JSON.stringify((() => {
          document.getElementById('pose-reset-all').click();
          const after = { t: __ud.t('elbow'), last: __ud.hist().undo.slice(-1)[0] };
          window.mayaViewer.selectByPath('|rig_grp|shoulder');
          window.mayaViewer.undo();
          return { after, t: __ud.t('elbow'), selected: __ud.app.data.nodes[__ud.app.selected].name };
        })())"""
        js(code, lambda r: (check(r["after"]["t"] == [0, 0, 0] and r["after"]["last"] == "すべて戻す", "すべて戻すが 1 つの操作"),
                            check(r["t"][0] > 0.05, "元に戻すと、戻す前の姿勢に復帰"), nxt()))

    def s_select_on_undo(nxt):
        code = """(() => {
          window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow');
          __ud.typeInto('pose-rz', ['10']);
          window.mayaViewer.selectByPath('|rig_grp|shoulder');
          window.mayaViewer.undo();
          return __ud.app.data.nodes[__ud.app.selected].name;
        })()"""
        js(code, lambda name: (check(name == "elbow", "元に戻すと、変更したノードが選択される（%s）" % name), nxt()))

    def s_menu(nxt):
        text = win.a_undo.text()
        check(win.a_undo.isEnabled() and text.startswith("元に戻す: ") and "Ctrl+Z" in text,
              "メニューに操作名つきで表示: %s" % text.replace("\t", " "))

        def drain(_=None, n=[0]):
            if win.a_undo.isEnabled() and n[0] < 20:
                n[0] += 1
                win.a_undo.trigger()
                return QtCore.QTimer.singleShot(150, drain)
            js("JSON.stringify(window.mayaViewer.getHistory())", lambda h: (
                check(not win.a_undo.isEnabled() and win.a_redo.isEnabled() and not h["canUndo"],
                      "メニューから元に戻し続けると、元に戻すが無効・やり直すが有効になる"), nxt()))
        drain()

    def s_reload(nxt):
        win.open_file(SCENE)
        QtCore.QTimer.singleShot(2500, lambda: js("JSON.stringify(window.mayaViewer.getHistory())", lambda h: (
            check(not h["canUndo"] and not h["canRedo"] and not win.a_redo.isEnabled(), "開き直すと履歴が消える"), nxt())))

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_record, s_keys, s_input_focus, s_reset_all, s_select_on_undo, s_menu, s_reload, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(90000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
