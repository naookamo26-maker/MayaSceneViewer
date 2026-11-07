# -*- coding: utf-8 -*-
"""バージョン表記（ma_viewer/version.py が唯一の元）: 形式・JS（package.json・package-lock.json・ビルド済みのビューア）・README との一致・表示"""
from __future__ import annotations

import io
import json
import os
import re
import sys
import tempfile
import unittest
import zipfile
from unittest import mock

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

import ma_viewer  # noqa: E402
from ma_viewer import package  # noqa: E402
from ma_viewer.cli import main as cli_main  # noqa: E402
from ma_viewer.version import __version__  # noqa: E402

SEMVER = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")


class VersionTest(unittest.TestCase):
    def test_semver(self):
        self.assertRegex(__version__, SEMVER, "メジャー.マイナー.パッチ")
        self.assertEqual(ma_viewer.__version__, __version__)

    def test_same_as_js(self):
        """web_src/package.json と、ビルド済みのビューア（viewer.bundle.js）も同じバージョン"""
        with open(os.path.join(ROOT, "web_src", "package.json"), encoding="utf-8") as f:
            self.assertEqual(json.load(f)["version"], __version__, "web_src/package.json の version を合わせる")
        with open(os.path.join(ROOT, "web_src", "package-lock.json"), encoding="utf-8") as f:
            lock = json.load(f)
        self.assertEqual(lock["version"], __version__, "web_src/package-lock.json の version を合わせる")
        self.assertEqual(lock["packages"][""]["version"], __version__, "web_src/package-lock.json の packages[\"\"] も合わせる")
        with open(os.path.join(ROOT, "ma_viewer", "web", "viewer.bundle.js"), encoding="utf-8") as f:
            bundle = f.read()
        self.assertIn('"%s"' % __version__, bundle, "ビューアを作り直す（cd web_src && node build.mjs）")

    def test_readme(self):
        """README の「バージョン」の節も同じ（上げ方のルールは CLAUDE.md）"""
        with open(os.path.join(ROOT, "README.md"), encoding="utf-8") as f:
            self.assertIn("いまのバージョンは %s です。" % __version__, f.read(), "README の「いまのバージョン」を合わせる")

    def test_cli_version(self):
        out = io.StringIO()
        with mock.patch("sys.stdout", new=out), self.assertRaises(SystemExit) as cm:
            cli_main(["--version"])
        self.assertEqual(cm.exception.code, 0)
        self.assertEqual(out.getvalue().strip(), "Maya Scene Viewer %s" % __version__)

    def test_package_manifest(self):
        """.msv には、作ったビューアのバージョンを入れる"""
        scene = {"schema": "maya-scene-lite", "version": 1, "source": {"kind": "ma"}, "nodes": [], "meshes": [],
                 "warnings": [], "stats": {}}
        path = os.path.join(tempfile.mkdtemp(prefix="version_test_"), "v.msv")
        package.write_package(scene, path)
        with zipfile.ZipFile(path) as zf:
            self.assertEqual(json.loads(zf.read("manifest.json"))["generatorVersion"], __version__)


if __name__ == "__main__":
    unittest.main()
