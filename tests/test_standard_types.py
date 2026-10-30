# -*- coding: utf-8 -*-
"""Maya の標準の型と自作ノードの見分け（リグの診断の、自作ノードの割り当ての雛形）と、requires の読み取りのテスト。

  python tests/test_standard_types.py
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.custom_nodes import is_standard_type  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

FOLLICLE_SCENE = """requires maya "2024";
requires -nodeType "myRibbon" "myPlugin" "1.2";
currentUnit -l centimeter -a degree -t film;
createNode joint -n "j1";
createNode joint -n "j2";
createNode transform -n "fol";
createNode follicle -n "folShape" -p "fol";
createNode blendShape -n "bs";
createNode myRibbon -n "rb";
connectAttr "folShape.ot" "j1.t";
connectAttr "rb.out" "j2.tx";
"""


class StandardTypesTest(unittest.TestCase):
    def test_requires_node_types(self):
        ms = parse_ma_text('requires maya "2020";\n'
                           'requires -nodeType "aiOptions" -nodeType "aiAOVDriver" -dataType "aiData" "mtoa" "4.1.1";\n'
                           'requires "stereoCamera" "10.0";\n')
        self.assertEqual(ms.plugins, ["mtoa", "stereoCamera"])           # 型の名前をプラグインにしない
        self.assertEqual(ms.plugin_versions, {"mtoa": "4.1.1", "stereoCamera": "10.0"})
        self.assertEqual(ms.plugin_node_types, {"aiOptions": "mtoa", "aiAOVDriver": "mtoa"})
        self.assertEqual(ms.maya_version, "2020")

    def test_is_standard_type(self):
        ms = parse_ma_text('requires -nodeType "follicle" "fakePlugin" "1.0";\n')
        for t in ("blendShape", "uvPin", "motionPath", "polyCube", "animCurveTL", "HIKSolverNode", "multMatrix", "sum"):
            self.assertTrue(is_standard_type(ms, t), t)
        for t in ("myCustomDriver", "aiStandardSurface", "follicle"):   # follicle はプラグインの型と書かれている
            self.assertFalse(is_standard_type(ms, t), t)

    def test_rig_report_template_only_for_custom_nodes(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "f.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(FOLLICLE_SCENE)
            report = rig_report_file(path)
        self.assertIn("- follicle: 1 か所", report)                     # 評価できないことは出す
        self.assertIn("■ 自作ノードの割り当て（設定ファイルの雛形）", report)
        self.assertIn('"myRibbon": {', report)                          # 自作ノードには雛形を出す
        self.assertNotIn('"follicle": {', report)                       # 標準の型には出さない
        self.assertIn("■ プラグイン（requires）: myPlugin", report)

    def test_no_template_section_for_standard_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "f.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(FOLLICLE_SCENE.replace('connectAttr "rb.out" "j2.tx";\n', ""))
            report = rig_report_file(path)
        self.assertIn("- follicle: 1 か所", report)
        self.assertNotIn("自作ノードの割り当て", report)

    def test_fallback_sample_keeps_custom_template(self):
        report = rig_report_file(os.path.join(ROOT, "samples", "fallback_sample.ma"))
        self.assertIn('"myCustomDriver": {', report)


if __name__ == "__main__":
    unittest.main()
