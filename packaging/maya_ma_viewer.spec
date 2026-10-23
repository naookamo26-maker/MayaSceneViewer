# -*- mode: python ; coding: utf-8 -*-
# PyInstaller の設定（1 ファイルの exe）。
#   pyinstaller packaging/maya_ma_viewer.spec        （または python packaging/build_exe.py）
#
# ビューアの web 一式（index.html・style.css・viewer.bundle.js）は Python のコードではないため、
# datas で明示的に同梱する。実行時は一時展開フォルダ（sys._MEIPASS）の ma_viewer/web に置かれ、
# ma_viewer/resources.py がそこを見つける。
import os

ROOT = os.path.abspath(os.path.join(SPECPATH, ".."))
WEB = os.path.join(ROOT, "ma_viewer", "web")

a = Analysis(
    [os.path.join(ROOT, "run_viewer.py")],
    pathex=[ROOT],
    binaries=[],
    datas=[(os.path.join(WEB, f), os.path.join("ma_viewer", "web"))
           for f in ("index.html", "style.css", "viewer.bundle.js")],
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
)
