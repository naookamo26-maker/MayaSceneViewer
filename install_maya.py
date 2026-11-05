# -*- coding: utf-8 -*-
"""Maya のビューポートにこのファイルをドラッグ＆ドロップすると、
現在のシェルフに「Maya Scene Viewer」のボタンを追加します。"""
import os

SHELF_COMMAND = u'''# Maya Scene Viewer
import sys
_root = r"{root}"
if _root not in sys.path:
    sys.path.append(_root)
import ma_viewer.maya_launcher as _mv
_mv.show()
'''


def onMayaDroppedPythonFile(*args):
    from maya import cmds, mel
    try:
        root = os.path.dirname(os.path.abspath(__file__))
    except NameError:
        picked = cmds.fileDialog2(fileMode=3, caption="maya_ma_viewer フォルダを選択")
        if not picked:
            return
        root = picked[0]
    if not os.path.isdir(os.path.join(root, "ma_viewer")):
        cmds.confirmDialog(title="Maya Scene Viewer", message="ma_viewer フォルダが見つかりません:\n" + root,
                           button=["OK"])
        return
    top = mel.eval("$tmp = $gShelfTopLevel")
    shelf = cmds.tabLayout(top, query=True, selectTab=True)
    cmds.shelfButton(parent=shelf, label="SceneViewer", annotation="Maya Scene Viewer（現在のシーンを表示）",
                     imageOverlayLabel="View", image1="pythonFamily.png", sourceType="python",
                     command=SHELF_COMMAND.format(root=root.replace("\\", "/")))
    cmds.confirmDialog(title="Maya Scene Viewer",
                       message="シェルフ「%s」にボタンを追加しました。" % shelf, button=["OK"])
