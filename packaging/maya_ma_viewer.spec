# -*- mode: python ; coding: utf-8 -*-
# PyInstaller の設定（1 ファイルの exe）。
#   pyinstaller packaging/maya_ma_viewer.spec        （または python packaging/build_exe.py）
#
# ビューアの web 一式（index.html・style.css・viewer.bundle.js）は Python のコードではないため、
# datas で明示的に同梱する。実行時は一時展開フォルダ（sys._MEIPASS）の ma_viewer/web に置かれ、
# ma_viewer/resources.py がそこを見つける。
# 自作ノードの定義（ma_viewer/node_defs/*.json）も必ず同梱する（ma_viewer/node_defs に置かれ、node_defs.py が読む）。
# アイコン（ma_viewer/icon/MayaSceneViewer.ico）は exe のアイコンにし、ウィンドウのアイコン用に同梱もする。
import glob
import os

ROOT = os.path.abspath(os.path.join(SPECPATH, ".."))
WEB = os.path.join(ROOT, "ma_viewer", "web")
NODE_DEFS = os.path.join(ROOT, "ma_viewer", "node_defs")
ICON = os.path.join(ROOT, "ma_viewer", "icon", "MayaSceneViewer.ico")   # packaging/make_icon.py で SVG から作る

a = Analysis(
    [os.path.join(ROOT, "run_viewer.py")],
    pathex=[ROOT],
    binaries=[],
    datas=[(os.path.join(WEB, f), os.path.join("ma_viewer", "web"))
           for f in ("index.html", "style.css", "viewer.bundle.js")]
          + [(p, os.path.join("ma_viewer", "node_defs")) for p in sorted(glob.glob(os.path.join(NODE_DEFS, "*.json")))]
          + [(ICON, os.path.join("ma_viewer", "icon"))],      # ウィンドウのアイコン（resources.icon_path が読む）
    hiddenimports=["PySide6.QtWebEngineCore", "PySide6.QtWebEngineWidgets", "PySide6.QtWebChannel"],
    hookspath=[],
    runtime_hooks=[],
    # Maya 内でだけ使うモジュールと、ビューアに不要な大きなパッケージは入れない
    excludes=["maya", "ma_viewer.extract_maya", "ma_viewer.maya_launcher", "tkinter"],   # numpy は読み込みの高速化に使うので含める
    noarchive=False,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="MayaSceneViewer",
    debug=False,
    strip=False,
    upx=False,              # UPX は QtWebEngine の DLL を壊すことがあるので使わない
    console=False,          # ウィンドウアプリ（エラーはダイアログで表示）
    disable_windowed_traceback=False,
    icon=ICON,              # exe のアイコン
)
