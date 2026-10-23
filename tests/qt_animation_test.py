# -*- coding: utf-8 -*-
"""アニメーションの 2 段階読み込みとタイムラインの確認（Qt）。

  python tests/qt_animation_test.py      （画面のない Linux では xvfb-run -a を付ける）

  1. .ma を開くと、シーンを先に表示し、アニメーションをあとから受け取る
  2. タイムラインの操作（フレームの移動・キー送り・再生）で骨とメッシュが動く
  3. アニメーションの読み込み中に別のファイルを開くと、読み込みを中止して開き直す
  4. ［アニメーションを読み込む］をオフにすると読み込まない
  5. 書き出した JSON にはアニメーションが含まれ、開くと再生できる
  6. アニメーションのあるシーンを開き直すと、古いアニメーションを消して読み込み中の表示を出す
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

ANIM = os.path.join(ROOT, "samples", "anim_sample.ma")
PLAIN = os.path.join(ROOT, "samples", "sample_arm.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const app = window.mayaViewer.debug.app;
  const tl = document.getElementById('timeline');
  const wrist = app.built ? app.data.nodes.findIndex((n) => n.name === 'wrist') : -1;
  return {
    loaded: !!s.loaded, name: s.loaded ? app.sceneName || '' : '', animation: s.animation || null,
    pose: s.settings ? s.settings.poseSource : null,
    timeline: !tl.hidden, status: document.getElementById('tl-status').textContent,
    wrist: wrist >= 0 ? app.built.nodeObjects[wrist].matrixWorld.elements.slice(12, 15).map((v) => +v.toFixed(3)) : null,
  };
})())"""


def _parse(r):
    if isinstance(r, str) and r[:1] in ("{", "["):
        try:
            return json.loads(r)
        except ValueError:
            print("JSON として読めない結果:", r[:200])
            raise
    return r


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer import animation as anim_mod
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    load_setting = win.a_anim.isChecked()
    win.a_anim.setChecked(True)
    ok = {"v": True}
    tmp = tempfile.mkdtemp(prefix="anim_test_")

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(
            delay, lambda: then(_parse(r))))

    def wait_state(cond, then, timeout=20.0):
        """JS の状態が cond を満たすまで待つ（満たさなければ最後の状態を渡す）"""
        t0 = time.time()

        def poll():
            def got(s):
                if cond(s) or time.time() - t0 > timeout:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(200, poll)
            js(STATE_JS, got, 0)
        poll()

    def wait_idle(then):
        """読み込みのスレッドが終わるまで待つ"""
        if win._thread is not None:
            QtCore.QTimer.singleShot(100, lambda: wait_idle(then))
        else:
            then()

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    # 1 ---------------------------------------------------------------------
    def s_open(nxt):
        win.open_file(ANIM)

        def got(s):
            a = s["animation"] or {}
            check(s["loaded"] and s["name"] == "anim_sample.ma", "シーンを表示した")
            check(bool(a) and a["curves"] == 6 and a["nodes"] == 5, "アニメーションをあとから受け取った: %s" % a)
            check(s["timeline"] and s["status"] == "", "タイムラインを表示し、読み込み中の表示は消えた")
            check(a.get("frame") == 1 and (a.get("start"), a.get("end")) == (1, 24), "再生範囲 1〜24・現在 1 フレーム")
            check(s["pose"] == "bind", "読み込み直後はバインドポーズのまま")
            check("animation" in (win.current_scene or {}), "Python 側のシーンにもアニメーションを保持（書き出し用）")
            check(any(w.startswith("アニメーション:") for w in win.viewer.warnings), "アニメーションの警告を警告一覧に追加")
            check("アニメーション" in win.statusBar().currentMessage(), "ステータスバーに読み込み結果: %s"
                  % win.statusBar().currentMessage())
            s_open.wrist1 = s["wrist"]
            wait_idle(nxt)
        wait_state(lambda s: s["loaded"] and s["animation"], got)

    # 2 ---------------------------------------------------------------------
    def s_scrub(nxt):
        code = """(() => {
          window.mayaViewer.selectByPath('|rig_grp|shoulder');
          const sl = document.getElementById('tl-slider');
          sl.value = '12'; sl.dispatchEvent(new Event('input'));
          return 'ok';
        })()"""

        def after(_):
            def got(s):
                check(s["animation"]["frame"] == 12, "スライダーで 12 フレームに移動")
                check(s["pose"] == "file", "タイムラインを操作すると「ファイルの値」に切り替わる")
                check(s["wrist"] != s_open.wrist1, "骨が動いた: %s → %s" % (s_open.wrist1, s["wrist"]))
                js("document.getElementById('select-info').innerText", lambda t: (
                    check("アニメーション" in t and "フレーム 12 の値" in t, "選択ノードの情報にアニメーションの値"),
                    nxt()))
            js(STATE_JS, got)
        js(code, after)

    def s_keys(nxt):
        code = """JSON.stringify((() => {
          const k = (key, mods = {}) => window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...mods }));
          const f = () => window.mayaViewer.getStats().animation.frame;
          const out = {};
          k(','); out.prevKey = f();
          k('.'); out.nextKey = f();
          k('…', { altKey: true, code: 'Period' }); out.nextFrame = f();
          k('End'); out.end = f();
          k('Home'); out.home = f();
          return out;
        })())"""

        def got(r):
            check(r == {"prevKey": 1, "nextKey": 12, "nextFrame": 13, "end": 24, "home": 1},
                  "キー送り（, .）・コマ送り（Alt+.）・先頭と最後（Home・End）: %s" % r)
            nxt()
        js(code, got)

    def s_play(nxt):
        js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', code: 'KeyV', altKey: true })); 'ok'",
           lambda _: QtCore.QTimer.singleShot(700, lambda: js(STATE_JS, got)))

        def got(s):
            a = s["animation"]
            check(a["playing"] and a["frame"] > 3, "Alt+V で再生（0.7 秒で %s フレームまで進む）" % a["frame"])
            js("window.mayaViewer.pause(); window.mayaViewer.getStats().animation.playing", lambda p: (
                check(p is False, "停止"), nxt()))

    # 3 ---------------------------------------------------------------------
    def s_cancel(nxt):
        original = anim_mod.build_animation

        def slow(ms, out_index, progress=None):
            for i in range(100):                     # 5 秒かかる読み込み（途中で中止できる）
                if progress:
                    progress(i / 100.0, "アニメーションを読み込み中 %d%%" % i)
                time.sleep(0.05)
            return original(ms, out_index, progress)

        anim_mod.build_animation = slow
        win.open_file(ANIM)

        def loading(s):
            check(s["loaded"] and s["timeline"] and "読み込み中" in s["status"],
                  "アニメーションの読み込み中はタイムラインに状況を表示: %r" % s["status"])
            win.open_file(PLAIN)              # 読み込み中に別のファイルを開く
            anim_mod.build_animation = original   # 中止した読み込みは差し替えた関数のまま止まる

            def done(s2):
                check(s2["name"] == "sample_arm.ma" and s2["animation"] is None and not s2["timeline"],
                      "読み込みを中止して別のファイルを開いた（アニメーションは付かない）: %s" % {
                          k: s2[k] for k in ("name", "animation", "timeline", "status")})
                wait_idle(nxt)
            wait_state(lambda s2: s2["loaded"] and s2["name"] == "sample_arm.ma", lambda s2: QtCore.QTimer.singleShot(
                800, lambda: js(STATE_JS, done)))
        wait_state(lambda s: s["loaded"] and s["name"] == "anim_sample.ma" and "読み込み中" in s["status"], loading)

    # 4 ---------------------------------------------------------------------
    def s_disabled(nxt):
        win.a_anim.setChecked(False)
        win.open_file(ANIM)

        def got(s):
            check(s["name"] == "anim_sample.ma" and s["animation"] is None and not s["timeline"],
                  "［アニメーションを読み込む］がオフなら読み込まない")
            win.a_anim.setChecked(True)
            nxt()
        wait_idle(lambda: QtCore.QTimer.singleShot(500, lambda: wait_state(lambda s: s["loaded"], got)))

    # 5 ---------------------------------------------------------------------
    def s_json(nxt):
        win.open_file(ANIM)

        def loaded(_s):
            path = os.path.join(tmp, "anim.json")
            scene = dict(win.current_scene, source=dict(win.current_scene["source"], name="anim.json"))
            with open(path, "w", encoding="utf-8") as f:
                json.dump(scene, f, ensure_ascii=False)
            win.open_file(path)

            def got(s):
                check(s["name"] == "anim.json" and s["animation"] and s["animation"]["curves"] == 6,
                      "書き出した JSON を開くとアニメーションも読み込む")
                nxt()
            wait_idle(lambda: wait_state(lambda s: s["loaded"] and s["name"] == "anim.json" and s["animation"], got))
        wait_idle(lambda: wait_state(lambda s: s["loaded"] and s["animation"], loaded))

    # 6 ---------------------------------------------------------------------
    def s_reopen(nxt):
        """アニメーションを再生できる状態から開き直すと、古いアニメーションは消え、読み込み中の表示が出る"""
        original = anim_mod.build_animation

        def slow(ms, out_index, progress=None):
            for i in range(30):
                if progress:
                    progress(i / 30.0, "アニメーションを読み込み中 %d%%" % int(i * 100 / 30))
                time.sleep(0.05)
            return original(ms, out_index, progress)

        anim_mod.build_animation = slow
        win.open_file(ANIM)

        def loading(s):
            anim_mod.build_animation = original
            check(s["animation"] is None and s["timeline"] and "読み込み中" in s["status"],
                  "開き直すと古いアニメーションは消え、読み込み中の表示が出る: %r" % s["status"])

            def done(s2):
                check(bool(s2["animation"]) and s2["status"] == "", "読み込みが終わるとタイムラインが使える")
                wait_idle(nxt)
            wait_state(lambda s2: s2["animation"], done)
        wait_state(lambda s: s["loaded"] and s["name"] == "anim_sample.ma" and "読み込み中" in s["status"], loading)

    def finish(_=None):
        win.a_anim.setChecked(load_setting)
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    def start():
        run([s_open, s_scrub, s_keys, s_play, s_cancel, s_disabled, s_json, s_reopen, finish])

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, start))
    QtCore.QTimer.singleShot(120000, lambda: (print("タイムアウト"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
