# -*- coding: utf-8 -*-
"""Maya 用ウィンドウ（host="maya"）の動作確認を偽の Maya API で行う。

  xvfb-run python tests/qt_maya_fake_test.py

Maya シーンの読み込み → ビューアでの選択が cmds.select に届くか →
Maya 側の選択変更（scriptJob）がビューアに反映されるか → 閉じたときに scriptJob を消すか。
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tests"))

import test_extract_maya_fake as F  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402

F.SCENE = F.FakeScene(load_ma(os.path.join(ROOT, "samples", "sample_arm.ma")))
F.install_fake_maya()
cmds = sys.modules["maya.cmds"]
calls = {"select": [], "jobs": {}, "killed": []}


def scriptJob(**kw):
    if "event" in kw:
        calls["jobs"][1] = kw["event"][1]
        return 1
    if "exists" in kw:
        return kw["exists"] in calls["jobs"]
    if "kill" in kw:
        calls["killed"].append(kw["kill"])
        calls["jobs"].pop(kw["kill"], None)


cmds.scriptJob = scriptJob
cmds.objExists = lambda p: p in F.SCENE.dag
cmds.select = lambda p, replace=True: calls["select"].append(p)

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
    win.viewer.get_stats(lambda st: (check(st and st["loaded"] and st["meshes"] == 3, "Maya シーンを表示: %s" % (st and st.get("meshes"))),
                                     step3()))


def step3():
    js = ("(()=>{const r=[...document.querySelectorAll('#tree .row')].find(e=>e.textContent.trim()=='▾elbow');"
          "r.querySelector('.name').click(); return 1;})()")
    win.viewer.run_js(js, lambda _: QtCore.QTimer.singleShot(500, step4))


def step4():
    check(calls["select"] and calls["select"][-1].endswith("|elbow"), "ビューアの選択を Maya へ: %s" % calls["select"])
    # Maya 側で wrist を選択したことにして scriptJob のコールバックを呼ぶ
    F.SCENE.selection = ["|rig_grp|shoulder|elbow|forearm_twist|wrist"]
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
