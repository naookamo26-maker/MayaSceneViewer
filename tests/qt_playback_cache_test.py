# -*- coding: utf-8 -*-
"""リグの再生キャッシュの確認（Qt）。

  python tests/qt_playback_cache_test.py      （画面のない Linux では xvfb-run -a を付ける）

  1. リグのあるアニメーションを開くと、止まっているあいだに全フレームの再生キャッシュを作る（表示は変えない）。
     ヘッドアップディスプレイにフレーム数と大きさ、タイムラインの上端に緑の帯を出す
  2. キャッシュから表示したフレームでも、IK で手首がコントローラーに届く
  3. ポーズ確認でコントローラーを動かすとキャッシュを捨て、動かしたあとの姿勢で作り直す（手首が追従する）
  4. 元に戻すと、元の姿勢で作り直す
  5. ［表示］の上限の設定: 保存した値を起動時に読み戻す・変えると保存する・オフにすると捨てて覚えない
     （テストの最後に、保存してあった値に戻す）
"""
from __future__ import annotations

import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

RIG = os.path.join(ROOT, "samples", "rig_sample.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const app = window.mayaViewer.debug.app;
  const at = (name) => {
    const i = app.built ? app.data.nodes.findIndex((n) => n.name === name) : -1;
    return i >= 0 ? app.built.nodeObjects[i].matrixWorld.elements.slice(12, 15).map((v) => +v.toFixed(3)) : null;
  };
  const rig = app.rig;
  return {
    loaded: !!s.loaded, animation: s.animation || null, frame: app.frame,
    frames: app.clip ? Math.floor(app.clip.end) - Math.ceil(app.clip.start) + 1 : 0,
    snapshots: rig ? rig.snapshots.size : -1, cached: rig ? !!rig.current : false,
    wrist: at('wrist'), hand: at('hand_ctrl'),
    limitMB: rig ? rig.playbackLimit / 1048576 : null, settingMB: app.settings.playbackCacheMB,
    cacheHud: document.getElementById('vp-cache').hidden ? null : document.getElementById('vp-cache').textContent,
    viewState: document.getElementById('menu-view-state').textContent,
    bar: (() => {   // タイムラインの上端（帯の高さ）の、緑の画素の割合
      const c = document.getElementById('tl-keys');
      if (!c.width) return 0;
      const d = c.getContext('2d').getImageData(0, 0, c.width, 1).data;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 1] > 150 && d[i] < 120 && d[i + 3] > 200) n++;
      return n / c.width;
    })(),
  };
})())"""


def _parse(r):
    if isinstance(r, str) and r[:1] in ("{", "["):
        return json.loads(r)
    return r


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow, _settings
    # 保存した上限を起動時に読み戻すか確かめる（元の値はテストの最後に戻す）
    key = "viewer/playbackCacheMB"
    saved = _settings().value(key, None)
    _settings().setValue(key, "512")
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    load_setting = win.a_anim.isChecked()
    win.a_anim.setChecked(True)
    ok = {"v": True}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(_parse(r))))

    def wait_state(cond, then, timeout=20.0):
        t0 = time.time()

        def poll():
            def got(s):
                if cond(s) or time.time() - t0 > timeout:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(200, poll)
            js(STATE_JS, got, 0)
        poll()

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    close = lambda a, b, tol=1e-3: a is not None and b is not None and all(abs(x - y) <= tol for x, y in zip(a, b))  # noqa: E731
    baked = lambda s: s["frames"] > 0 and s["snapshots"] == s["frames"]  # noqa: E731
    first = {}

    def s_open(nxt):
        win.open_file(RIG)

        def got(s):
            check(s["settingMB"] == 512 and s["limitMB"] == 512, "保存した上限（512MB）を起動時に読み戻す: %s / %s"
                  % (s["settingMB"], s["limitMB"]))
            check(baked(s), "止まっているあいだに全フレームの再生キャッシュを作る: %d / %d" % (s["snapshots"], s["frames"]))
            check(close(s["wrist"], first["wrist"]), "キャッシュを作っても表示中の姿勢は変わらない: %s" % s["wrist"])
            check(bool(s["cacheHud"]) and s["cacheHud"].startswith("キャッシュ 48 / 48 フレーム・") and s["cacheHud"].endswith(" KB"),
                  "ヘッドアップディスプレイにキャッシュのフレーム数と大きさ: %s" % s["cacheHud"])
            check(s["bar"] > 0.8, "タイムラインの上端に、覚えたフレームの緑の帯: %.2f" % s["bar"])
            nxt()

        def loaded(s):
            first.update(s)
            wait_state(baked, got)
        wait_state(lambda s: s["loaded"] and s["animation"], loaded)

    def s_frame(nxt):
        def got(s):
            check(s["cached"], "フレーム 24 はキャッシュから表示する")
            check(close(s["wrist"], s["hand"]) and close(s["hand"], [7, 13, 0]),
                  "キャッシュのフレームでも手首がコントローラーに届く: 手首 %s / コントローラー %s" % (s["wrist"], s["hand"]))
            nxt()
        js("window.mayaViewer.setFrame(24); 'ok'", lambda _: js(STATE_JS, got))

    def s_pose(nxt):
        code = """(() => {
          window.mayaViewer.selectByPath('|hand_ctrl');
          const set = (id, v) => { const el = document.getElementById(id); el.focus(); el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.blur(); };
          set('pose-tz', '2');
          return 'ok';
        })()"""

        def moved(s):
            check(s["snapshots"] < s["frames"], "コントローラーを動かすとキャッシュを捨てる: %d" % s["snapshots"])
            check(s["bar"] < 0.2 and bool(s["cacheHud"]) and s["cacheHud"].startswith("キャッシュ 1 / 48 "),
                  "捨てると帯と表示も減る: %.2f・%s" % (s["bar"], s["cacheHud"]))
            check(close(s["wrist"], s["hand"]) and abs(s["hand"][2] - 2) < 1e-3,
                  "動かしたコントローラーに手首が追従する: 手首 %s / コントローラー %s" % (s["wrist"], s["hand"]))
            wait_state(baked, rebaked)

        def rebaked(s):
            check(baked(s), "動かしたあとの姿勢でキャッシュを作り直す: %d / %d" % (s["snapshots"], s["frames"]))
            js("window.mayaViewer.setFrame(12); window.mayaViewer.setFrame(24); 'ok'", lambda _: js(STATE_JS, back))

        def back(s):
            check(s["cached"] and close(s["wrist"], s["hand"]) and abs(s["hand"][2] - 2) < 1e-3,
                  "作り直したキャッシュでも手首が追従する: 手首 %s / コントローラー %s" % (s["wrist"], s["hand"]))
            js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })); 'ok'",
               lambda _: wait_state(lambda x: baked(x) and close(x["wrist"], [7, 13, 0]), undone))

        def undone(s):
            check(close(s["wrist"], [7, 13, 0]) and baked(s), "元に戻すと元の姿勢で作り直す: 手首 %s・%d / %d"
                  % (s["wrist"], s["snapshots"], s["frames"]))
            nxt()
        js(code, lambda _: js(STATE_JS, moved))

    pick = lambda mb: ("(() => { document.querySelector('#opt-playback-cache [data-value=\"%d\"]').click(); return 'ok'; })()"  # noqa: E731
                       % mb)

    def s_setting(nxt):
        def low(s):
            check(s["settingMB"] == 128 and s["limitMB"] == 128 and baked(s), "上限を 128MB にする（小さいシーンなので全フレーム残る）: %s"
                  % s["limitMB"])
            check(win.viewer.bridge.loadSetting("playbackCacheMB") == "128", "変えた上限を保存する: %s"
                  % win.viewer.bridge.loadSetting("playbackCacheMB"))
            js(pick(0), lambda _: js(STATE_JS, off))

        def off(s):
            check(s["limitMB"] == 0 and s["snapshots"] == 0 and s["bar"] == 0, "オフにすると捨てる: %s フレーム・帯 %.2f"
                  % (s["snapshots"], s["bar"]))
            check(s["cacheHud"] == "キャッシュ オフ" and "キャッシュなし" in s["viewState"],
                  "オフの表示（ヘッドアップディスプレイ・メニュー名の横）: %s・%s" % (s["cacheHud"], s["viewState"]))
            js("window.mayaViewer.setFrame(10); window.mayaViewer.setFrame(11); 'ok'",
               lambda _: QtCore.QTimer.singleShot(800, lambda: js(STATE_JS, still_off)))

        def still_off(s):
            check(s["snapshots"] == 0 and close(s["wrist"], s["hand"]), "オフのあいだは覚えない（評価はする）: %d" % s["snapshots"])
            js(pick(256), lambda _: wait_state(baked, back_on))

        def back_on(s):
            check(s["limitMB"] == 256 and baked(s), "オンに戻すと作り直す: %d / %d" % (s["snapshots"], s["frames"]))
            nxt()
        js(pick(128), lambda _: js(STATE_JS, low))

    def finish(_=None):
        if saved is None:
            _settings().remove(key)
        else:
            _settings().setValue(key, saved)
        win.a_anim.setChecked(load_setting)
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, lambda: run([s_open, s_frame, s_pose, s_setting, finish])))
    QtCore.QTimer.singleShot(120000, lambda: (print("タイムアウト"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
