# -*- coding: utf-8 -*-
"""リグ（コンストレイント・IK・計算ノード）の確認（Qt）。

  python tests/qt_rig_test.py      （画面のない Linux では xvfb-run -a を付ける）

  1. rig_sample.ma を開くと、リグを含むアニメーションを受け取り、フレームを動かすと IK で腕が動く
  2. ポーズ確認でコントローラーを動かすと、IK・コンストレイントが追従する（元に戻すと戻る）
  3. キーがなくリグだけの .ma では、タイムラインを出さずに評価する
  4. 第 3 段階（行列ノード・SC IK）の .ma を開き、フレームとコントローラーの操作で動く
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
RIG3 = os.path.join(ROOT, "samples", "rig3_sample.ma")

STATE_JS = """JSON.stringify((() => {
  const s = window.mayaViewer.getStats();
  const app = window.mayaViewer.debug.app;
  const at = (name) => {
    const i = app.built ? app.data.nodes.findIndex((n) => n.name === name) : -1;
    return i >= 0 ? app.built.nodeObjects[i].matrixWorld.elements.slice(12, 15).map((v) => +v.toFixed(3)) : null;
  };
  return {
    loaded: !!s.loaded, name: s.loaded ? app.sceneName || '' : '', animation: s.animation || null,
    pose: s.settings ? s.settings.poseSource : null, timeline: !document.getElementById('timeline').hidden,
    wrist: at('wrist'), hand: at('hand_ctrl'), prop: at('prop'), j: at('j'), ctrl: at('ctrl'),
    controls: app.overlay.controls.map((i) => app.data.nodes[i].name),
  };
})())"""

STATIC_RIG = '''//Maya ASCII 2024 scene
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode transform -n "ctrl";
	setAttr ".t" -type "double3" 1 2 3 ;
createNode joint -n "j";
	setAttr ".t" -type "double3" 1 2 3 ;
createNode pointConstraint -n "j_pointConstraint1" -p "j";
	setAttr -k on ".w0";
connectAttr "ctrl.t" "j_pointConstraint1.tg[0].tt";
connectAttr "ctrl.pm" "j_pointConstraint1.tg[0].tpm";
connectAttr "j_pointConstraint1.w0" "j_pointConstraint1.tg[0].tw";
connectAttr "j.pim" "j_pointConstraint1.cpim";
connectAttr "j_pointConstraint1.ctx" "j.tx";
connectAttr "j_pointConstraint1.cty" "j.ty";
connectAttr "j_pointConstraint1.ctz" "j.tz";
'''


def _parse(r):
    if isinstance(r, str) and r[:1] in ("{", "["):
        return json.loads(r)
    return r


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    load_setting = win.a_anim.isChecked()
    win.a_anim.setChecked(True)
    ok = {"v": True}
    tmp = tempfile.mkdtemp(prefix="rig_test_")

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

    def wait_idle(then):
        if win._thread is not None:
            QtCore.QTimer.singleShot(100, lambda: wait_idle(then))
        else:
            then()

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    close = lambda a, b, tol=1e-3: a is not None and b is not None and all(abs(x - y) <= tol for x, y in zip(a, b))  # noqa: E731

    def s_open(nxt):
        win.open_file(RIG)

        def got(s):
            a = s["animation"] or {}
            check(a.get("graphNodes", 0) > 20 and a.get("rigProblems") == [], "リグを含むアニメーションを受け取った: %s"
                  % {k: a.get(k) for k in ("curves", "nodes", "graphNodes", "rigProblems")})
            check(s["timeline"], "タイムラインを表示")
            check(set(s["controls"]) >= {"hand_ctrl", "arm_ik", "elbow_pv", "tgtA", "tgtB"},
                  "コントローラーの目印: %s" % s["controls"])
            check(close(s["wrist"], [10, 10, 0]) and close(s["prop"], [12, 10, 0]), "保存時のフレームの姿勢")
            wait_idle(nxt)
        wait_state(lambda s: s["loaded"] and s["animation"], got)

    def s_frame(nxt):
        def got(s):
            check(close(s["wrist"], s["hand"]) and close(s["hand"], [7, 13, 0]),
                  "フレーム 24: 手首が IK でコントローラーに届く: 手首 %s / コントローラー %s" % (s["wrist"], s["hand"]))
            nxt()
        js("window.mayaViewer.setFrame(24); 'ok'", lambda _: js(STATE_JS, got))

    def s_pose(nxt):
        code = """(() => {
          window.mayaViewer.selectByPath('|hand_ctrl');
          const set = (id, v) => { const el = document.getElementById(id); el.focus(); el.value = v;
            el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.blur(); };
          set('pose-tx', '1'); set('pose-tz', '2');
          return 'ok';
        })()"""

        def moved(s):
            # 移動はコントローラーのローカル軸が基準（フレーム 24 では z 軸まわりに回っている）
            check(close(s["wrist"], s["hand"]) and not close(s["hand"], [7, 13, 0]) and abs(s["hand"][2] - 2) < 1e-3,
                  "数値入力でコントローラーを動かすと、手首が追従する: 手首 %s / コントローラー %s" % (s["wrist"], s["hand"]))
            js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })); "
               "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })); 'ok'",
               lambda _: js(STATE_JS, undone))

        def undone(s):
            check(close(s["wrist"], [7, 13, 0]), "元に戻すと手首も戻る: %s" % s["wrist"])
            wait_idle(nxt)
        js(code, lambda _: js(STATE_JS, moved))

    def s_static(nxt):
        path = os.path.join(tmp, "static_rig.ma")
        with open(path, "w", encoding="utf-8") as f:
            f.write(STATIC_RIG)
        win.open_file(path)

        def loaded(s):
            check(s["animation"] is not None and s["animation"]["curves"] == 0 and not s["timeline"],
                  "キーがないリグ: 評価するが、タイムラインは出さない")
            code = """(() => {
              const app = window.mayaViewer.debug.app;
              app.setPose(app.data.nodes.findIndex((n) => n.name === 'ctrl'), { t: [3, 0, 0], r: [0, 0, 0], s: [1, 1, 1] });
              return 'ok';
            })()"""
            js(code, lambda _: js(STATE_JS, moved))

        def moved(s):
            check(close(s["j"], [4, 2, 3]), "コントローラーを動かすと、pointConstraint のジョイントが追従する: %s" % s["j"])
            nxt()
        wait_idle(lambda: wait_state(lambda s: s["loaded"] and s["name"] == "static_rig.ma" and s["animation"], loaded))

    def s_stage3(nxt):
        """第 3 段階: 行列ノード・aim・SC IK。コントローラーを動かすと SC IK が追従する"""
        win.open_file(RIG3)
        code = """JSON.stringify((() => {
          const app = window.mayaViewer.debug.app;
          const p = (n) => app.built.nodeObjects[app.data.nodes.findIndex((x) => x.name === n)].matrixWorld.elements
            .slice(12, 15).map((v) => +v.toFixed(3));
          window.mayaViewer.setFrame(48);
          const out = { mm: p('mm_jnt'), sc2: p('sc2_c'), sc2ik: p('sc2_ik') };
          app.setPose(app.data.nodes.findIndex((x) => x.name === 'sc2_ctrl'), { t: [-1, 1, 0], r: [0, 0, 0], s: [1, 1, 1] });
          out.posed = p('sc2_c'); out.posedIk = p('sc2_ik');
          out.problems = window.mayaViewer.getStats().animation.rigProblems;
          return out;
        })())"""

        def got(r):
            check(close(r["mm"], [-20, 0, -2]), "フレーム 48: multMatrix・decomposeMatrix の結果 %s" % r["mm"])
            check(close(r["sc2"], r["sc2ik"]) and close(r["posed"], r["posedIk"]) and not close(r["posed"], r["sc2"]),
                  "SC IK: ハンドルに届き、コントローラーを動かすと追従する: %s → %s" % (r["sc2"], r["posed"]))
            check(r["problems"] == [], "評価の問題なし")
            nxt()
        wait_idle(lambda: wait_state(lambda s: s["loaded"] and s["name"] == "rig3_sample.ma" and s["animation"],
                                     lambda _s: js(code, got)))

    def finish(_=None):
        win.a_anim.setChecked(load_setting)
        print("結果:", "OK" if ok["v"] else "NG")
        app.exit(0 if ok["v"] else 1)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(300, lambda: run(
        [s_open, s_frame, s_pose, s_static, s_stage3, finish])))
    QtCore.QTimer.singleShot(120000, lambda: (print("タイムアウト"), app.exit(2)))
    return app.exec()


if __name__ == "__main__":
    sys.exit(main())
