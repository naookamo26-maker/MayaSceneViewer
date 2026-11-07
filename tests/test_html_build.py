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


class BuildScriptTest(unittest.TestCase):
    """packaging/build_html.py（build_exe.py と同じく、配る物を作るスクリプト）"""

    def setUp(self):
        sys.path.insert(0, os.path.join(ROOT, "packaging"))
        import build_html
        self.script = build_html
        self.dir = tempfile.mkdtemp(prefix="build_html_script_")

    def run_script(self, args):
        out = io.StringIO()
        with mock.patch("sys.stdout", new=out):
            code = self.script.main(args + ["--no-js-check"])
        return code, out.getvalue()

    def test_viewer_and_embed(self):
        out = os.path.join(self.dir, "viewer.html")
        code, text = self.run_script(["-o", out])
        self.assertEqual(code, 0, text)
        self.assertEqual(self.script.verify(out), [])
        with mock.patch.object(self.script, "dist_dir", lambda: self.dir):
            code, text = self.run_script(["--embed", TEXTURED_MSV, "--embed", ARM_MA])
        self.assertEqual(code, 0, text)
        for name in ("textured_sample.html", "sample_arm.html"):      # 1 ファイルにつき 1 つ、dist/ に
            with open(os.path.join(self.dir, name), encoding="utf-8") as f:
                self.assertEqual(_embedded(f.read())[:4], b"PK\x03\x04", name)

    def test_same_place_as_exe(self):
        """出力先は exe と同じ: 実行したフォルダの dist/（PyInstaller の DEFAULT_DISTPATH と同じ決め方）"""
        here = os.getcwd()
        try:
            os.chdir(self.dir)
            self.assertEqual(self.script.dist_dir(), os.path.join(self.dir, "dist"))
            code, text = self.run_script([])
            self.assertEqual(code, 0, text)
            self.assertTrue(os.path.isfile(os.path.join(self.dir, "dist", "MayaSceneViewer.html")))
        finally:
            os.chdir(here)

    def test_errors(self):
        self.assertEqual(self.run_script(["--embed", os.path.join(self.dir, "none.msv")])[0], 1)
        self.assertEqual(self.run_script(["-o", "x.html", "--embed", TEXTURED_MSV, "--embed", ARM_MA])[0], 1)
        bad = os.path.join(self.dir, "bad.html")
        with open(bad, "w", encoding="utf-8") as f:
            f.write('<link rel="stylesheet" href="style.css"><script src="viewer.bundle.js"></script>')
        self.assertEqual(len(self.script.verify(bad)), 3)


if __name__ == "__main__":
    unittest.main()
