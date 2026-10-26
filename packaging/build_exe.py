# -*- coding: utf-8 -*-
"""1 ファイルの exe を作る。  python packaging/build_exe.py

  前提: pip install pyinstaller
  出力: dist/MayaSceneViewer.exe（Windows）/ dist/MayaSceneViewer（Linux・macOS）

ma_viewer/node_defs/*.json（自作ノードの定義）も同梱する。ビルドの前に検証し、誤りがあれば止める。

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
    if not os.path.isfile(os.path.join(ROOT, "ma_viewer", "icon", "MayaSceneViewer.ico")):
        print("アイコン（ma_viewer/icon/MayaSceneViewer.ico）がありません（python packaging/make_icon.py で作ってください）")
        return 1
    # 同梱する自作ノードの定義を検証する（誤りのある定義は配らない）
    sys.path.insert(0, ROOT)
    from ma_viewer.node_defs import DEF_DIR, load_definitions
    defs = load_definitions()
    if defs.errors:
        print("自作ノードの定義（%s）に誤りがあります。直してからビルドしてください:" % DEF_DIR)
        for t, why in sorted(defs.errors.items()):
            print("  %s: %s" % (t, why))
        return 1
    print("同梱する自作ノードの定義: %s" % ("、".join(sorted(defs.nodes)) or "なし"))
    os.chdir(ROOT)
    PyInstaller.__main__.run([os.path.join(HERE, "maya_ma_viewer.spec"), "--noconfirm", "--clean"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
