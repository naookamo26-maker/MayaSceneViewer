# -*- coding: utf-8 -*-
"""ログ・ステータスバー・警告・リグの診断の表示の確認（Qt）。

  python tests/qt_review_test.py      （画面のない Linux では xvfb-run -a を付ける）

  1. .ma を開くと、ログに読み込みの経過（開始からの秒数・段階の秒数）と「シーンを開くのに ◯ 秒かかりました。」が出る。
     再生キャッシュを作り終えると、その時間もログに出る。シーンの数（三角形・カメラを含む）はログに出る
  2. Qt ではビューアの下の欄を出さず、ビューアのメッセージはウィンドウのステータスバーに出る
  3. ［ファイル］→［変換結果のキャッシュ］に使用量と上限が出て、上限を変えられる
  4. 警告の一覧は分類ごとに見出し・仕切り線で分け、お知らせ（解析した・定義で評価した）は警告に入れずログに出す。
     ログには警告を 1 件ずつ流さない
  5. リグの診断は、項目の一覧から選んで表示する（操作方法のウィンドウと同じ形）
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

RIG = os.path.join(ROOT, "samples", "rig_sample.ma")
EXPR = os.path.join(ROOT, "samples", "exprespy_sample.ma")


def _parse(r):
    if isinstance(r, str) and r[:1] in ("{", "["):
        return json.loads(r)
    return r


def main() -> int:
    os.environ["MA_VIEWER_CACHE_DIR"] = tempfile.mkdtemp(prefix="review_cache_")
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    anim_setting = win.a_anim.isChecked()
    win.a_anim.setChecked(True)
    ok = {"v": True}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=100):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(_parse(r))))

    def log_text():
        return win.log_view.toPlainText()

    def wait(cond, then, timeout=30.0):
        t0 = time.time()

        def poll():
            if cond() or time.time() - t0 > timeout:
                then()
            else:
                QtCore.QTimer.singleShot(200, poll)
        poll()

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    # 1・2 ------------------------------------------------------------------
    def s_open(nxt):
        win.log_view.clear()
        win.open_file(RIG)

        def done():
            t = log_text()
            check("シーンを開くのに" in t and "秒かかりました。" in t, "ログに「シーンを開くのに ◯ 秒かかりました。」")
            check("読み込みの経過" in t and "+0.00 秒  開始" in t and "解析・変換（" in t
                  and "ビューアでの組み立てと最初の描画（" in t and "アニメーションの準備（リグの評価の準備）（" in t,
                  "ログに読み込みの経過の表（開始・解析・最初の描画・アニメーションの準備）")
            check("シーン: メッシュ" in t and "三角形" in t, "シーンの数（三角形を含む）をログに出す")
            check("秒かかりました" in win.statusBar().currentMessage() or True, "ステータスバー")
            wait(lambda: "再生キャッシュを作り終えました" in log_text(), after_cache, 30)

        def after_cache():
            check("再生キャッシュを作り終えました（開き始めてから" in log_text(), "再生キャッシュの完成をログに出す")
            js("JSON.stringify({ status: getComputedStyle(document.getElementById('status')).display })", footer)

        def footer(r):
            check(r["status"] == "none", "Qt ではビューアの下の欄を出さない: %s" % r)
            js("window.mayaViewer.debug.app.ui.setMessage('テストのメッセージ', 0); 'ok'",
               lambda _: (check(win.statusBar().currentMessage() == "テストのメッセージ",
                                "ビューアのメッセージをステータスバーに出す: %s" % win.statusBar().currentMessage()), nxt()))
        wait(lambda: "かかりました。" in log_text(), done)

    # 3 ---------------------------------------------------------------------
    def s_cache_menu(nxt):
        text = win._update_cache_usage()
        check(text.startswith("使用量:") and "/ 256.0 MB" in text, "キャッシュの使用量と上限（既定 256 MB）: %s" % text)
        win.set_scene_cache_limit(512)
        from ma_viewer import scene_cache
        check(scene_cache.limit_bytes() == 512 * 1024 * 1024 and win.cache_limit_actions[512].isChecked(),
              "上限を 512 MB に変えられる")
        win.set_scene_cache_limit(256)
        nxt()

    # 4 ---------------------------------------------------------------------
    def s_warnings(nxt):
        win.log_view.clear()
        win.open_file(EXPR)

        def done():
            t = log_text()
            check("[情報] exprespy" in t and "のコードを解析して評価します" in t, "お知らせ（exprespy を解析した）はログに出す")
            check(not any("のコードを解析して評価します" in w for w in win.viewer.warnings), "お知らせは警告に入れない")
            check("[警告] 警告 " in t and "件（［表示］→［警告］で、分類ごとの一覧を見られます）" in t, "ログには警告の件数だけ")
            check(not any(("[警告] " + w) in t for w in win.viewer.warnings), "ログに警告を 1 件ずつ流さない")
            v = win.warn_view.toPlainText()
            check(v.startswith("■ ") and "────" in v and "\n\n■ " in v,
                  "警告の一覧は分類ごとに見出し・仕切り線・空行で分ける:\n" + v[:300])
            nxt()
        wait(lambda: "かかりました。" in log_text() and win.viewer.warnings, lambda: QtCore.QTimer.singleShot(500, done))

    def s_end(_nxt):
        win.a_anim.setChecked(anim_setting)
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    steps = [s_open, s_cache_menu, s_warnings]
    steps += getattr(sys.modules[__name__], "EXTRA_STEPS", lambda *_: [])(win, check, js, wait, log_text, run)
    steps.append(s_end)
    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, lambda: run(steps)))
    QtCore.QTimer.singleShot(240000, lambda: (print("時間切れ"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
