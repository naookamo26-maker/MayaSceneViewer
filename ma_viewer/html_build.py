# -*- coding: utf-8 -*-
"""ビューアを 1 つの HTML ファイルにまとめる（CSS と JS を中に入れる）。Teams・Slack などで渡しやすくするため。

  python -m ma_viewer build-html -o viewer.html                      ビューアだけ（開いてからファイルを開く）
  python -m ma_viewer build-html --embed scene.msv -o scene.html     シーンを埋め込む（開くとそのシーンを表示）

埋め込むシーンは .msv（テクスチャ・表示の状態を含む）のまま base64 で入れる。.ma・.json を指定したら、
先にパッケージにしてから入れる。ブラウザは HTML の中から取り出して読むので、一時ファイルは作らない。
"""
from __future__ import annotations

import base64
import html
import json
import os
import re
import tempfile
from typing import Callable, Optional

from . import package
from .resources import APP_NAME, web_dir
from .version import __version__

EMBED_ID = "embedded-package"


def _inline_script(js: str) -> str:
    # </script と <!-- があると、HTML の解析がそこで script を終える・ずれるので、JS として同じ意味のまま書き換える
    return js.replace("</script", "<\\/script").replace("<!--", "<\\!--")


def _inline_style(css: str) -> str:
    return css.replace("</style", "<\\/style")


def package_bytes(path: str, textures: str = package.DEFAULT_TEXTURES,
                  progress: Optional[Callable[[str], None]] = None) -> bytes:
    """埋め込むパッケージのバイト列。.msv はそのまま、.ma・.json はパッケージにする"""
    low = path.lower()
    if package.is_package(low):
        with open(path, "rb") as f:
            data = f.read()
        package.Package(path)                       # 壊れていないか確かめる
        return data
    if low.endswith(".json"):
        from . import schema
        with open(path, encoding="utf-8") as f:
            scene = json.load(f)
        schema.validate(scene)
    elif low.endswith(".ma"):
        from .extract_ma import load_ma
        scene = load_ma(path, animation=True)
    else:
        raise ValueError("埋め込めるのは .msv・.ma・.json です: %s" % path)
    fd, tmp = tempfile.mkstemp(suffix=package.EXT)
    os.close(fd)
    try:
        package.write_package(scene, tmp, textures=textures, progress=progress)
        with open(tmp, "rb") as f:
            return f.read()
    finally:
        os.remove(tmp)


def build_html(embed: Optional[str] = None, textures: str = package.DEFAULT_TEXTURES,
               progress: Optional[Callable[[str], None]] = None) -> str:
    """1 ファイルの HTML（文字列）。embed: 埋め込むシーン（.msv・.ma・.json）"""
    d = web_dir()
    with open(os.path.join(d, "index.html"), encoding="utf-8") as f:
        page = f.read()
    with open(os.path.join(d, "style.css"), encoding="utf-8") as f:
        css = f.read()
    with open(os.path.join(d, "viewer.bundle.js"), encoding="utf-8") as f:
        js = f.read()
    link = re.search(r'<link rel="stylesheet" href="style\.css">', page)
    script = re.search(r'<script src="viewer\.bundle\.js"></script>', page)
    if not link or not script:
        raise RuntimeError("index.html に style.css・viewer.bundle.js の読み込みが見つかりません")
    embedded = ""
    title = APP_NAME
    if embed:
        data = package_bytes(embed, textures=textures, progress=progress)
        name = os.path.splitext(os.path.basename(embed))[0] + package.EXT
        title = "%s - %s" % (os.path.splitext(name)[0], APP_NAME)
        embedded = ('<script type="application/x-msv-base64" id="%s" data-name="%s">%s</script>\n'
                    % (EMBED_ID, html.escape(name, quote=True), base64.b64encode(data).decode("ascii")))
    page = (page[:link.start()] + "<style>\n" + _inline_style(css) + "\n</style>" + page[link.end():script.start()]
            + embedded + "<script>\n" + _inline_script(js) + "\n</script>" + page[script.end():])
    page = page.replace("<title>%s</title>" % APP_NAME, "<title>%s</title>" % html.escape(title), 1)
    meta = '<meta name="generator" content="%s %s">' % (APP_NAME, __version__)
    return page.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + meta, 1)


def write_html(out: str, embed: Optional[str] = None, textures: str = package.DEFAULT_TEXTURES,
               progress: Optional[Callable[[str], None]] = None) -> int:
    text = build_html(embed, textures=textures, progress=progress)
    tmp = out + ".part"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, out)
    return os.path.getsize(out)
