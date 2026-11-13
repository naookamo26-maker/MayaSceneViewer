# -*- coding: utf-8 -*-
"""ノードの型ごとの属性名の表（ma_viewer/attr_names.json。Autodesk の技術資料から作る。D1）"""
from __future__ import annotations

import json
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import ma_reader as R  # noqa: E402
from ma_viewer.attr_names import names_for  # noqa: E402

HEAD = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


class AttrNamesTest(unittest.TestCase):
    def test_table(self):
        with open(os.path.join(ROOT, "ma_viewer", "attr_names.json"), encoding="utf-8") as f:
            data = json.load(f)
        for t, p in data["parents"].items():
            seen = {t}
            while p in data["parents"]:                     # 親の型をたどって循環しない
                self.assertNotIn(p, seen, t)
                seen.add(p)
                p = data["parents"][p]
        ls, shorts = names_for("joint")                     # 親（transform・dagNode）の名前も入る
        self.assertEqual((ls["jointOrient"], ls["translateX"], ls["visibility"]), ("jo", "tx", "v"))
        self.assertIn("jo", shorts)
        self.assertIsNone(names_for("myPluginNode"))

    def test_typed_normalize(self):
        """型で意味の違う名前は型の表、型の短い名前はそのまま、表にない名前は全体の表"""
        uc, md, ik = names_for("unitConversion"), names_for("multiplyDivide"), names_for("ikHandle")
        self.assertEqual(R.normalize_attr("input"), "ip")              # 全体の表（デフォーマの input）
        self.assertEqual(R.normalize_attr_typed("input", uc), "i")
        self.assertEqual(R.normalize_attr_typed("input1X", md), "i1x")
        self.assertEqual(R.normalize_attr_typed("output.outputX", md), "o.ox")
        self.assertEqual(R.normalize_attr_typed("twist", ik), "twi")
        self.assertEqual(R.normalize_attr_typed("i1x", md), "i1x")
        self.assertEqual(R.normalize_attr_typed("worldMatrix[0]", names_for("transform")), "wm[0]")
        pc = names_for("parentConstraint")
        self.assertEqual(R.normalize_attr_typed("target[1].targetParentMatrix", pc), "tg[1].tpm")

    def test_connections_use_type_names(self):
        from ma_viewer.ma_scene import parse_ma_text
        ms = parse_ma_text(HEAD + 'createNode transform -n "a";\ncreateNode unitConversion -n "uc";\n'
                                  'createNode multiplyDivide -n "md";\n'
                                  'connectAttr "a.translateX" "uc.input";\nconnectAttr "uc.output" "md.input1X";\n')
        uc, md = ms.resolve("uc"), ms.resolve("md")
        self.assertEqual(uc.inputs["i"][1], "tx")
        self.assertEqual(md.inputs["i1x"], (uc, "o"))

    def test_spec_includes_table(self):
        with open(os.path.join(ROOT, "packaging", "maya_ma_viewer.spec"), encoding="utf-8") as f:
            self.assertIn("attr_names.json", f.read())          # exe に同梱する


if __name__ == "__main__":
    unittest.main()
