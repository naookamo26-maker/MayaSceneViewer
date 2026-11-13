# -*- coding: utf-8 -*-
"""ノードの型の登録（ma_viewer/node_types.json。Python と JS が同じものを読む。整備計画の D5）の形"""
from __future__ import annotations

import os
import re
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import rig  # noqa: E402
from ma_viewer.ma_scene import skips_attrs  # noqa: E402
from ma_viewer.node_types import NODE_TYPES, types_of_kind  # noqa: E402


class NodeTypesTest(unittest.TestCase):
    def test_shape(self):
        kinds = {"utility", "constraint", "geometry", "other"}
        for t, e in NODE_TYPES["types"].items():
            self.assertIn(e.get("kind"), kinds, t)
            for key in ("outputs", "angles"):
                if key in e:
                    re.compile(e[key])                    # JS の正規表現（Python でも読める書き方だけを使う）
                    self.assertTrue(e[key].startswith("^") and e[key].endswith("$"), (t, key))
            self.assertTrue(set(e) <= {"kind", "outputs", "defaults", "angles"}, t)
        self.assertEqual(NODE_TYPES["skipAttrs"], sorted(set(NODE_TYPES["skipAttrs"])))
        self.assertEqual(NODE_TYPES["math"], sorted(set(NODE_TYPES["math"])))
        self.assertFalse(set(NODE_TYPES["math"]) & set(NODE_TYPES["types"]))   # 計算ノード（math）は別の一覧

    def test_python_sets(self):
        self.assertEqual(rig.CONSTRAINT_TYPES, types_of_kind("constraint"))
        self.assertEqual(rig.GEOMETRY_TYPES, types_of_kind("geometry"))
        self.assertEqual(rig.UTILITY_TYPES, types_of_kind("utility") | set(NODE_TYPES["math"]))
        self.assertIn("pointConstraint", rig.CONSTRAINT_TYPES)
        self.assertIn("multiplyDivide", rig.UTILITY_TYPES)
        self.assertTrue(skips_attrs("multiplyDivide") and skips_attrs("network"))

    def test_evaluable_types_have_outputs(self):
        """評価する型（utility・constraint・geometry）は出力の名前を持つ（値を読むだけの displayLayer と、
        distanceBetween と同じに扱う distanceBetweenDL を除く）"""
        missing = sorted(t for t, e in NODE_TYPES["types"].items()
                         if e["kind"] != "other" and "outputs" not in e)
        self.assertEqual(missing, ["displayLayer", "distanceBetweenDL"])


if __name__ == "__main__":
    unittest.main()
