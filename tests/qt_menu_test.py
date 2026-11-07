# -*- coding: utf-8 -*-
"""メニューの構成・パッケージの書き出しのオプションボックス（❒）・区切り線の確認（Qt）。

  python tests/qt_menu_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）

  1. ［ファイル］はファイルの操作だけ。読み込みの設定（アニメーション・リファレンス・変換結果のキャッシュ）は［設定］
  2. 書き出しの項目は、左側のクリックで前回の設定のまま書き出し、右端の ❒ のクリックと → キーでオプションを開く
  3. 暗い配色（スタンドアロン）でも区切り線が見え、❒ はほかの項目と同じ文字色（ハイライト中はその文字色）で描く
     （明るい配色でも同じ）
  4. オプションの画面: ［設定を保存］で設定だけ保存し、［書き出し］でその設定で書き出す。書き出したら設定をステータスバーに出す
"""
from __future__ import annotations

import argparse
import os
import sys
import tempfile
import time
import zipfile
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

TEXTURED = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")
KEYS = ("packageTextures", "packageView", "packageMaxSize", "packageQuality")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shot", help="メニューの画像を保存するフォルダ")
    args = ap.parse_args()
    os.environ["MA_VIEWER_CACHE_DIR"] = tempfile.mkdtemp(prefix="menu_cache_")
    from ma_viewer.qt_compat import QtCore, QtGui, QtWidgets
    from PySide6.QtTest import QTest
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.app import apply_dark_style
    apply_dark_style(app)
    from ma_viewer import viewer as viewer_mod
    from ma_viewer.viewer import ViewerWindow
    settings = viewer_mod._settings()
    saved = {k: settings.value(k) for k in KEYS}       # テストのあとに元に戻す
    for k in KEYS:
        settings.remove(k)
    win = ViewerWindow(host="standalone")
    win.resize(1200, 800)
    win.show()
    ok = {"v": True}
    tmp = tempfile.mkdtemp(prefix="menu_test_")

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def label(a):
        return a.text().split("\t")[0]

    # 1 ---------------------------------------------------------------------
    titles = [a.text() for a in win.menuBar().actions()]
    check(titles == ["ファイル", "編集", "表示", "設定", "ヘルプ"], "メニューの並び: %s" % titles)
    file_items = [label(a) if not a.isSeparator() else "-" for a in win.file_menu.actions()]
    check(file_items == ["新規シーン", "-", "開く…", "再読み込み", "-", "パッケージ（.msv）として書き出し…", "-", "閉じる"],
          "［ファイル］はファイルの操作だけ: %s" % file_items)
    set_items = [a.menu().title() if a.menu() else (label(a) if not a.isSeparator() else "-")
                 for a in win.settings_menu.actions()]
    check(set_items == ["アニメーションを読み込む", "リファレンスを読み込む", "-", "変換結果のキャッシュ"],
          "［設定］に読み込みの設定: %s" % set_items)
    check(win.a_export_pkg.shortcut().toString() == "Ctrl+Shift+E", "書き出しのショートカットは Ctrl+Shift+E のまま")

    # 2・3 -------------------------------------------------------------------
    calls = []
    win.export_package = lambda: calls.append("export")                 # 左側のクリック（triggered）
    win.a_export_pkg.triggered.disconnect()
    win.a_export_pkg.triggered.connect(lambda *_: calls.append("export"))
    m = win.file_menu
    m._boxes[win.a_export_pkg] = lambda: calls.append("options")

    def popup():
        m.popup(QtCore.QPoint(80, 80))
        for _ in range(10):
            app.processEvents()
            time.sleep(0.02)

    popup()
    box = m.box_rect(win.a_export_pkg)
    QTest.mouseClick(m, QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier, box.center())
    app.processEvents()
    QTest.qWait(50)
    check(calls == ["options"] and not m.isVisible(), "❒ をクリックするとオプションを開き、メニューは閉じる: %s" % calls)
    popup()
    row = m.actionGeometry(win.a_export_pkg)
    QTest.mouseClick(m, QtCore.Qt.MouseButton.LeftButton, QtCore.Qt.KeyboardModifier.NoModifier,
                     QtCore.QPoint(row.left() + 40, row.center().y()))
    QTest.qWait(50)
    check(calls[-1:] == ["export"], "項目の左側をクリックすると、前回の設定で書き出す: %s" % calls)
    popup()
    m.setActiveAction(win.a_export_pkg)
    QTest.keyClick(m, QtCore.Qt.Key.Key_Right)
    QTest.qWait(50)
    check(calls[-1:] == ["options"], "→ キーでもオプションを開く: %s" % calls)

    def lum(c):
        return 0.299 * c.red() + 0.587 * c.green() + 0.114 * c.blue()

    def inspect(name):
        popup()
        img_plain = m.grab().toImage()
        m.setActiveAction(win.a_export_pkg)
        app.processEvents()
        img_active = m.grab().toImage()
        m.hide()
        if args.shot:
            os.makedirs(args.shot, exist_ok=True)
            img_plain.save(os.path.join(args.shot, "menu_%s.png" % name))
            img_active.save(os.path.join(args.shot, "menu_%s_active.png" % name))
        pal = m.palette()
        bg = img_plain.pixelColor(6, m.actionGeometry(win.file_menu.actions()[2]).center().y())
        # 区切り線: 「新規シーン」と「開く」の間の行で、背景と最も違う色
        top = m.actionGeometry(win.file_menu.actions()[0]).bottom() + 1
        bottom = m.actionGeometry(win.file_menu.actions()[2]).top()
        x = m.width() // 2
        diff = max(abs(lum(img_plain.pixelColor(x, y)) - lum(bg)) for y in range(top, bottom))
        check(diff >= 12, "%s: 区切り線が背景と区別できる（明るさの差 %.0f）" % (name, diff))
        r = m.box_rect(win.a_export_pkg)
        edge = img_plain.pixelColor(r.left(), r.center().y())
        want = pal.color(QtGui.QPalette.ColorRole.Text)
        check(abs(lum(edge) - lum(want)) < 40, "%s: ❒ はほかの項目の文字色で描く（%s / 文字色 %s）"
              % (name, edge.name(), want.name()))
        edge_a = img_active.pixelColor(r.left(), r.center().y())
        want_a = pal.color(QtGui.QPalette.ColorRole.HighlightedText)
        check(abs(lum(edge_a) - lum(want_a)) < 40, "%s: ハイライト中の ❒ はハイライトの文字色（%s / %s）"
              % (name, edge_a.name(), want_a.name()))

    inspect("dark")
    # 明るい配色（Maya の配色など、パレットが違うとき）でも同じに描く
    dark_palette, dark_css = app.palette(), app.styleSheet()
    app.setStyleSheet("")
    app.setPalette(app.style().standardPalette())
    inspect("light")
    app.setPalette(dark_palette)
    app.setStyleSheet(dark_css)

    # 4 ---------------------------------------------------------------------
    del win.export_package                               # 本物に戻す
    m._boxes[win.a_export_pkg] = win.export_package_options
    win.a_export_pkg.triggered.disconnect()
    win.a_export_pkg.triggered.connect(lambda *_: win.export_package())
    out = os.path.join(tmp, "menu_test.msv")
    QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (out, ""))
    orig_exec = QtWidgets.QDialog.exec
    plan = {"button": "設定を保存"}

    def fake_exec(dlg):
        if dlg is not getattr(win, "package_options_dialog", None):
            return orig_exec(dlg)
        combo = dlg.findChildren(QtWidgets.QComboBox)[0]
        combo.setCurrentIndex(combo.findData("all"))
        dlg.findChildren(QtWidgets.QSpinBox)[0].setValue(65)
        dlg.findChildren(QtWidgets.QCheckBox)[0].setChecked(False)
        buttons = [b.text() for b in dlg.findChildren(QtWidgets.QPushButton)]
        check(buttons == ["書き出し", "設定を保存", "閉じる"], "ボタンは Maya と同じ並び: %s" % buttons)
        next(b for b in dlg.findChildren(QtWidgets.QPushButton) if b.text() == plan["button"]).click()
        return dlg.result()
    QtWidgets.QDialog.exec = fake_exec

    def step_open():
        win.open_file(TEXTURED)
        wait(lambda: win._thread is None and win.current_scene is not None, step_save)

    def step_save():
        check(win.package_options()["textures"] == "albedo" and win.package_options()["view"],
              "最初の設定はアルベドのみ・表示の状態あり")
        win.export_package_options()                     # ［設定を保存］: 書き出さずに設定だけ
        opts = win.package_options()
        check(opts["textures"] == "all" and opts["quality"] == 65 and not opts["view"] and not os.path.exists(out),
              "［設定を保存］は設定だけ保存して書き出さない: %s" % opts)
        win.statusBar().clearMessage()
        win.export_package()                             # いつもの書き出し: ダイアログなしで保存した設定を使う
        wait(lambda: os.path.exists(out), step_check_export)

    def step_check_export():
        with zipfile.ZipFile(out) as zf:
            manifest = json.loads(zf.read("manifest.json"))
            names = zf.namelist()
        check(manifest["textures"] == "all" and "view.json" not in names,
              "保存した設定で、ダイアログなしで書き出す（すべてのマップ・表示の状態なし）")
        msg = win.statusBar().currentMessage()
        check("すべてのマップ" in msg and "品質 65" in msg and "表示の状態なし" in msg,
              "書き出したら、使った設定をステータスバーに出す: %s" % msg)
        os.remove(out)
        plan["button"] = "書き出し"
        win.export_package_options()                     # ［書き出し］: その設定で書き出す
        wait(lambda: os.path.exists(out), step_end)

    def step_end():
        check(os.path.exists(out), "オプションの画面の［書き出し］で書き出す")
        QtWidgets.QDialog.exec = orig_exec
        for k, v in saved.items():
            if v is None:
                settings.remove(k)
            else:
                settings.setValue(k, v)
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    def wait(cond, then, timeout=30.0):
        t0 = time.time()

        def poll():
            if cond() or time.time() - t0 > timeout:
                then()
            else:
                QtCore.QTimer.singleShot(200, poll)
        poll()

    # 手順 1〜3 の間にページの準備が終わっていることがある
    if getattr(win.viewer, "_loaded", False):
        QtCore.QTimer.singleShot(300, step_open)
    else:
        win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, step_open))
    QtCore.QTimer.singleShot(120000, lambda: (print("時間切れ"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
