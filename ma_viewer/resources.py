# -*- coding: utf-8 -*-
"""ビューアの web 一式（index.html・style.css・viewer.bundle.js）の場所を探す。

次の順に探し、index.html があるフォルダを使う。
  1. 環境変数 MA_VIEWER_WEB_DIR
  2. exe 化したとき（PyInstaller など）の一時展開フォルダ（sys._MEIPASS）の ma_viewer/web と web
  3. exe と同じフォルダの ma_viewer/web と web
  4. このパッケージのフォルダの web（通常の Python 実行・Maya 内）
"""
from __future__ import annotations

import os
import sys
from typing import List

WEB_FILES = ("index.html", "style.css", "viewer.bundle.js")


def web_dir_candidates() -> List[str]:
    out: List[str] = []
    env = os.environ.get("MA_VIEWER_WEB_DIR")
    if env:
        out.append(env)
    if getattr(sys, "frozen", False):
        meipass = getattr(sys, "_MEIPASS", None)
        if meipass:
            out += [os.path.join(meipass, "ma_viewer", "web"), os.path.join(meipass, "web")]
        exe_dir = os.path.dirname(os.path.abspath(sys.executable))
        out += [os.path.join(exe_dir, "ma_viewer", "web"), os.path.join(exe_dir, "web")]
    out.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "web"))
    seen = set()
    uniq = []
    for p in out:
        k = os.path.normcase(os.path.abspath(p))
        if k not in seen:
            seen.add(k)
            uniq.append(os.path.abspath(p))
    return uniq


def web_dir() -> str:
    """index.html のあるフォルダ。見つからなければ、探した場所と対処法つきで FileNotFoundError。"""
    tried = web_dir_candidates()
    for d in tried:
        if os.path.isfile(os.path.join(d, "index.html")):
            missing = [f for f in WEB_FILES if not os.path.isfile(os.path.join(d, f))]
            if missing:
                raise FileNotFoundError("ビューアのファイルが足りません（%s）: %s" % (", ".join(missing), d))
            return d
    raise FileNotFoundError(
        "ビューアの HTML（index.html）が見つかりません。\n探した場所:\n  " + "\n  ".join(tried) + "\n\n"
        "exe 化した場合は、ma_viewer/web フォルダを同梱してください。"
        "PyInstaller なら packaging/maya_ma_viewer.spec を使うか、"
        "--add-data \"ma_viewer/web%sma_viewer/web\" を付けてください。" % os.pathsep)


def index_html() -> str:
    return os.path.join(web_dir(), "index.html")
