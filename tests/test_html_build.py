# -*- coding: utf-8 -*-
"""1 ファイルの HTML（ma_viewer/html_build.py・python -m ma_viewer build-html）"""
from __future__ import annotations

import base64
import io
import os
import re
import sys
import tempfile
import unittest
from unittest import mock

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import html_build, package  # noqa: E402
from ma_viewer.cli import main as cli_main  # noqa: E402
from ma_viewer.version import __version__  # noqa: E402

TEXTURED_MSV = os.path.join(ROOT, "samples", "textured_sample.msv")
ARM_MA = os.path.join(ROOT, "samples", "sample_arm.ma")


def _embedded(page: str) -> bytes:
    m = re.search(r'<script type="application/x-msv-base64" id="embedded-package" data-name="[^"]*">([^<]*)</script>', page)
    return base64.b64decode(m.group(1)) if m else b""


class HtmlBuildTest(unittest.TestCase):
    def test_single_file(self):
        """CSS・JS を中に入れ、外のファイルを読まない"""
        page = html_build.build_html()
        self.assertNotIn('src="viewer.bundle.js"', page)
        self.assertNotIn('href="style.css"', page)
        self.assertEqual(page.count("<style>"), 1)
        self.assertNotRegex(page, r"<script[^>]+src=")
        self.assertNotRegex(page, r'<link[^>]+rel="stylesheet"')
        self.assertIn('<meta name="generator" content="Maya Scene Viewer %s">' % __version__, page)
        self.assertEqual(_embedded(page), b"")
        # JS の中の </script は、HTML の script を途中で終えない形にする
        self.assertEqual(html_build._inline_script('a="</script>";b="<!--"'), 'a="<\\/script>";b="<\\!--"')

    def test_embed_package(self):
        """.msv はそのまま埋め込む（テクスチャ・表示の状態ごと）。タイトルはシーン名"""
        page = html_build.build_html(embed=TEXTURED_MSV)
        with open(TEXTURED_MSV, "rb") as f:
            self.assertEqual(_embedded(page), f.read())
        self.assertIn("<title>textured_sample - Maya Scene Viewer</title>", page)
        # 埋め込みは、ビューアの script より前（ビューアが起動したときに読める）
        self.assertLess(page.index('id="embedded-package"'), page.index("<script>\n"))

    def test_embed_ma_makes_package(self):
        """.ma を指定したら、パッケージにしてから埋め込む"""
        data = _embedded(html_build.build_html(embed=ARM_MA))
        self.assertEqual(data[:4], b"PK\x03\x04")
        path = os.path.join(tempfile.mkdtemp(prefix="html_build_"), "arm.msv")
        with open(path, "wb") as f:
            f.write(data)
        scene, _pkg = package.read_package(path)
        self.assertTrue(scene["meshes"])

    def test_cli(self):
        d = tempfile.mkdtemp(prefix="html_build_cli_")
        out = os.path.join(d, "scene.html")
        with mock.patch("sys.stdout", new=io.StringIO()):
            self.assertEqual(cli_main(["build-html", "--embed", TEXTURED_MSV, "-o", out, "-q"]), 0)
            self.assertEqual(cli_main(["build-html", "-o", os.path.join(d, "viewer.html"), "-q"]), 0)
        with mock.patch("sys.stderr", new=io.StringIO()):
            self.assertEqual(cli_main(["build-html", "--embed", os.path.join(d, "none.msv"), "-q"]), 1)
        self.assertTrue(os.path.getsize(out) > os.path.getsize(TEXTURED_MSV))
        self.assertFalse(os.path.exists(out + ".part"))


if __name__ == "__main__":
    unittest.main()
