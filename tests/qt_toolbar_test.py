# -*- coding: utf-8 -*-
"""ツールバー（アイコンの切り替え・ドロップダウンメニュー）の確認。

  python tests/qt_toolbar_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER = r"""
window.__tb = (() => {
  const $ = (id) => document.getElementById(id);
  const btn = (panel) => document.querySelector(`.menu-btn[aria-controls="${panel}"]`);
  const openState = () => ['menu-view', 'menu-maps', 'menu-weights'].map((p) => !$(p).hidden);
  const set = (id, v) => { const el = $(id); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
  return { $, btn, openState, set };
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
        win.open_file(os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma"))
        QtCore.QTimer.singleShot(2500, lambda: js(HELPER, lambda _: nxt()))

    def s_layout(nxt):
        js("""JSON.stringify({ h: Math.round(document.getElementById('toolbar').getBoundingClientRect().height),
              normalize: !!document.getElementById('opt-weight-normalize'), maps: !!document.getElementById('sec-maps') })""",
           lambda r: (check(r["h"] <= 44, "ツールバーが 1 行に収まる（高さ %dpx）" % r["h"]),
                      check(not r["normalize"], "ウェイトの正規化の切り替えはない"),
                      check(not r["maps"], "右パネルにマップの欄はない（ツールバーのメニューに移動）"), nxt()))

    def s_menus(nxt):
        code = """JSON.stringify((() => {
          const r = {};
          __tb.btn('menu-maps').click();                 r.open1 = __tb.openState();
          __tb.set('opt-map-view', 'roughness');        r.afterChange = __tb.openState();   // 中で設定を変えても閉じない
          r.mapsState = __tb.$('menu-maps-state').textContent;
          __tb.btn('menu-view').click();                 r.switch = __tb.openState();        // 別のメニューを開くと前のは閉じる
          document.getElementById('tree').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          r.outside = __tb.openState();                                                       // 外をクリックで閉じる
          __tb.btn('menu-weights').click();
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          r.esc = __tb.openState();
          __tb.set('opt-weights', 'selected');           r.weightsState = __tb.$('menu-weights-state').textContent;
          __tb.set('opt-lighting', 'flat');              r.viewState = __tb.$('menu-view-state').textContent;
          __tb.set('opt-map-view', 'combined'); __tb.set('opt-weights', 'off'); __tb.set('opt-lighting', 'standard');
          r.cleared = [__tb.$('menu-maps-state').textContent, __tb.$('menu-weights-state').textContent, __tb.$('menu-view-state').textContent];
          return r;
        })())"""

        def got(r):
            check(r["open1"] == [False, True, False], "［マップ］を開く")
            check(r["afterChange"] == [False, True, False], "メニューの中で設定を変えても閉じない")
            check(r["mapsState"] == "ラフネス", "メニュー名の横に状態を表示（マップ: %s）" % r["mapsState"])
            check(r["switch"] == [True, False, False], "別のメニューを開くと前のメニューは閉じる")
            check(r["outside"] == [False, False, False], "メニューの外をクリックすると閉じる")
            check(r["esc"] == [False, False, False], "Esc で閉じる")
            check(r["weightsState"] == "ヒートマップ" and r["viewState"] == "フラットライト", "ウェイト・表示の状態も表示")
            check(r["cleared"] == ["", "", ""], "既定に戻すと状態の表示は消える")
            nxt()
        js(code, got)

    def s_icons(nxt):
        code = """JSON.stringify((() => {
          const app = window.mayaViewer.debug.app, r = {};
          const sp = document.getElementById('opt-space');
          sp.click(); r.world = [sp.getAttribute('aria-pressed'), app.settings.space];
          sp.click(); r.local = [sp.getAttribute('aria-pressed'), app.settings.space];
          const wire = document.getElementById('opt-wire');
          wire.click(); r.wire = [wire.getAttribute('aria-pressed'), app.settings.wire]; wire.click();
          r.joints = document.getElementById('opt-joints').getAttribute('aria-pressed');
          const grid = document.getElementById('opt-grid');
          r.grid0 = [grid.getAttribute('aria-pressed'), app.grid.visible];
          grid.click(); r.grid1 = [grid.getAttribute('aria-pressed'), app.grid.visible, app.settings.grid];
          return r;
        })())"""
        js(code, lambda r: (check(r["world"] == ["true", "world"] and r["local"] == ["false", "local"], "ハンドルの向きのアイコン（ワールド／ローカル）"),
                            check(r["wire"] == ["true", True], "ワイヤーのアイコンで切り替え"),
                            check(r["joints"] == "false", "ジョイントの表示は初期状態でオフ"),
                            check(r["grid0"] == ["true", True] and r["grid1"] == ["false", False, False],
                                  "グリッドのアイコンで地面のグリッドを隠す"), s_grid_reload(nxt)))

    def s_grid_reload(nxt):
        # オフにしたまま開き直しても、グリッドは隠れたまま。もう一度押すと表示
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, lambda: js("""JSON.stringify((() => {
          const app = window.mayaViewer.debug.app, g = document.getElementById('opt-grid');
          const after = app.grid.visible; g.click();
          return { after, again: [g.getAttribute('aria-pressed'), app.grid.visible] }; })())""",
            lambda r: (check(r["after"] is False, "開き直してもグリッドは隠れたまま"),
                       check(r["again"] == ["true", True], "もう一度押すと表示"), nxt())))

    def s_no_qt_toolbar(nxt):
        # 上部の Qt のツールバーはなく、開く・再読み込みは［ファイル］メニューから（ショートカットも有効）
        check(not win.findChildren(QtWidgets.QToolBar), "上部の Qt のツールバーはない")
        file_menu = [m for m in win.findChildren(QtWidgets.QMenu) if m.title() == "ファイル"][0]
        items = {a.text(): a.shortcut().toString() for a in file_menu.actions() if a.text()}
        check(items.get("開く…") == "Ctrl+O" and items.get("再読み込み") == "F5",
              "［ファイル］メニューに［開く］（Ctrl+O）と［再読み込み］（F5）: %s" % items)
        try:
            from PySide6 import QtTest
        except ImportError:
            from PySide2 import QtTest
        before = win.log_view.toPlainText().count("読み込み開始")
        # ショートカットはアクティブなウィンドウでだけ働くので、先にアクティブにする（画面のない環境向け）
        win.activateWindow()
        QtTest.QTest.qWaitForWindowActive(win, 3000)
        (win.viewer.focusProxy() or win.viewer).setFocus()
        QtTest.QTest.keyClick(win.windowHandle(), QtCore.Qt.Key.Key_F5)     # 実際のキー操作と同じ経路
        QtCore.QTimer.singleShot(2500, lambda: (
            check(win.log_view.toPlainText().count("読み込み開始") == before + 1, "ビューアにフォーカスがあっても F5 で再読み込み"),
            nxt()))

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        os.makedirs(args.shot, exist_ok=True)
        js("(()=>{ __tb.btn('menu-maps').click(); window.mayaViewer.debug.app.frameAll(true); return 1; })()",
           lambda _: (win.grab().save(os.path.join(args.shot, "toolbar_menu.png")), nxt()), 500)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_layout, s_menus, s_icons, s_no_qt_toolbar, s_shot, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
