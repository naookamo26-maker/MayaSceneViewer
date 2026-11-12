# -*- coding: utf-8 -*-
"""Maya 用ウィンドウ（host="maya"）の動作確認を偽の Maya で行う。

  xvfb-run python tests/qt_maya_fake_test.py

Maya シーンの読み込み（Maya の API で集める maya_scene.collect は、サンプルの .ma から同じ形を作るものに差し替える。
test_maya_scene と同じ）→ .ma と同じ読み込みスレッドで表示するか → ビューアでの選択が cmds.select に届くか →
Maya 側の選択変更（scriptJob）がビューアに反映されるか → 閉じたときに scriptJob を消すか。
"""
import os
import sys
import types

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tests"))

import test_maya_scene as T  # noqa: E402
from ma_viewer import maya_scene  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "anim_sample.ma")
maya_scene.collect = lambda selection_only=False, progress=None: T.scene_text(SAMPLE)
calls = {"select": [], "jobs": {}, "killed": [], "selection": []}


def scriptJob(**kw):
    if "event" in kw:
        calls["jobs"][1] = kw["event"][1]
        return 1
    if "exists" in kw:
        return kw["exists"] in calls["jobs"]
    if "kill" in kw:
        calls["killed"].append(kw["kill"])
        calls["jobs"].pop(kw["kill"], None)


cmds = types.ModuleType("maya.cmds")
cmds.scriptJob = scriptJob
cmds.objExists = lambda p: True
cmds.select = lambda p=None, replace=True, clear=False: calls["select"].append(p)
cmds.ls = lambda selection=False, long=False: list(calls["selection"])
maya = types.ModuleType("maya")
maya.cmds = cmds
sys.modules.update({"maya": maya, "maya.cmds": cmds})

from ma_viewer.qt_compat import QtCore, QtWidgets  # noqa: E402
QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
app = QtWidgets.QApplication(sys.argv[:1])
from ma_viewer.viewer import ViewerWindow  # noqa: E402

win = ViewerWindow(host="maya")
win.show()
result = {"ok": True}


def check(cond, msg):
    print(("OK " if cond else "NG ") + msg)
    if not cond:
        result["ok"] = False


def step1():
    win.load_from_maya(False)
    QtCore.QTimer.singleShot(2000, step2)


def step2():
    scene = win.current_scene or {}
    check(scene.get("source", {}).get("kind") == "maya" and scene.get("animation"),
          "スタンドアロンと同じくアニメーションも読む: %s" % bool(scene.get("animation")))
    win.viewer.get_stats(lambda st: (check(st and st["loaded"] and st["meshes"] == 3, "Maya シーンを表示: %s" % (st and st.get("meshes"))),
                                     step3()))


def step3():
    js = ("(()=>{const r=[...document.querySelectorAll('#tree .row')].find(e=>e.textContent.trim()=='▾elbow');"
          "r.querySelector('.name').click(); return 1;})()")
    win.viewer.run_js(js, lambda _: QtCore.QTimer.singleShot(500, step4))


def step4():
    # 複数選択に対応して、cmds.select にはパスの一覧（最後がリード）を渡す
    check(calls["select"] and calls["select"][-1][-1].endswith("|elbow"), "ビューアの選択を Maya へ: %s" % calls["select"])
    # Maya 側で wrist を選択したことにして scriptJob のコールバックを呼ぶ
    calls["selection"] = ["|rig_grp|shoulder|elbow|forearm_twist|wrist"]
    calls["jobs"][1]()
    QtCore.QTimer.singleShot(400, step5)


def step5():
    win.viewer.get_stats(lambda st: (check(st["selected"].endswith("|wrist"), "Maya の選択に追従: %s" % st["selected"]),
                                     step6()))


def step6():
    win.close()
    check(calls["killed"] == [1], "閉じたときに scriptJob を削除: %s" % calls["killed"])
    app.quit()


win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, step1))
QtCore.QTimer.singleShot(40000, app.quit)
app.exec()
print("結果:", "OK" if result["ok"] else "NG")
sys.exit(0 if result["ok"] else 1)
