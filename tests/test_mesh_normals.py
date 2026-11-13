# -*- coding: utf-8 -*-
"""メッシュの見た目（M6）: 頂点法線の重みの種類（.vnm）を共通 JSON に出す。ユーザーが指定した法線・
スムーズメッシュプレビューは使わないので警告を出す（Autodesk の技術資料「mesh」）"""
from __future__ import annotations

import os
import shutil
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.extract_ma import load_ma  # noqa: E402

HEAD = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


def mesh(name, extra=""):
    return ('createNode transform -n "%s";\ncreateNode mesh -n "%sShape" -p "%s";\n'
            '\tsetAttr -s 3 ".vt[0:2]"  0 0 0 1 0 0 0 1 0;\n'
            '\tsetAttr -s 3 ".ed[0:2]"  0 1 0 1 2 0 2 0 0;\n'
            '\tsetAttr -ch 3 ".fc[0]" -type "polyFaces" \n\t\tf 3 0 1 2;\n%s' % (name, name, name, extra))


class MeshNormalsTest(unittest.TestCase):
    def load(self, body):
        d = tempfile.mkdtemp()
        try:
            p = os.path.join(d, "m.ma")
            with open(p, "w", encoding="utf-8") as f:
                f.write(HEAD + body)
            return load_ma(p)
        finally:
            shutil.rmtree(d, ignore_errors=True)

    def test_normal_method_and_warnings(self):
        scene = self.load(mesh("a") + mesh("b", '\tsetAttr ".vnm" 1;\n')
                          + mesh("c", '\tsetAttr -s 3 ".n[0:2]" -type "float3"  1e+20 1e+20 1e+20 1e+20 1e+20 1e+20 '
                                      '1e+20 1e+20 1e+20;\n')
                          + mesh("d", '\tsetAttr -s 3 ".n[0:2]" -type "float3"  0 0 1 0 0 1 0 0 1;\n\tsetAttr ".dsm" 2;\n'))
        by = {m["name"]: m for m in scene["meshes"]}
        self.assertNotIn("normalMethod", by["aShape"])               # 既定（3: 角度と面積）は書かない
        self.assertEqual(by["bShape"]["normalMethod"], 1)
        w = scene["warnings"]
        self.assertTrue(any("dShape: ユーザーが指定した法線" in x for x in w), w)
        self.assertFalse(any("cShape: ユーザーが指定した法線" in x for x in w), w)   # 1e+20 は Maya が計算した法線
        self.assertTrue(any("dShape: スムーズメッシュプレビュー" in x for x in w), w)
        self.assertFalse(any("aShape" in x for x in w), w)


if __name__ == "__main__":
    unittest.main()
