# -*- coding: utf-8 -*-
"""1 ファイルの exe を作る。  python packaging/build_exe.py

  前提: pip install pyinstaller
  出力: dist/MayaSceneViewer.exe（Windows）/ dist/MayaSceneViewer（Linux・macOS）

できた exe の動作確認:
  dist/MayaSceneViewer.exe samples/sample_arm.ma --selftest --selftest-out selftest.json
  → selftest.json の "ok" が true なら、web 一式の読み込みとシーンの表示まで成功
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def main() -> int:
    try:
        import PyInstaller.__main__
    except ImportError:
        print("PyInstaller が見つかりません。pip install pyinstaller でインストールしてください。")
        return 1
    web = os.path.join(ROOT, "ma_viewer", "web")
    missing = [f for f in ("index.html", "style.css", "viewer.bundle.js") if not os.path.isfile(os.path.join(web, f))]
    if missing:
        print("ビューアのファイルが足りません: %s（web_src で npm run build を実行してください）" % ", ".join(missing))
        return 1
    os.chdir(ROOT)
    PyInstaller.__main__.run([os.path.join(HERE, "maya_ma_viewer.spec"), "--noconfirm", "--clean"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
