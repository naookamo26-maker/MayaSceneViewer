# -*- coding: utf-8 -*-
"""自作ノードの割り当てで指定する、親のスケールの打ち消し（segmentScaleCompensate）の検証。

スケール (0.5, 1, 1) のジョイントの子に、型を知らない DAG ノード（移動 (2, 0, 0)・回転 (0, 30, 0)）と、その子のジョイント。
  * 割り当てなし: transform として扱い、親のスケールを受け継ぐ（行列がゆがむ）
  * {"as": "transform", "segmentScaleCompensate": true}・{"as": "joint"}: 親のスケールを打ち消す
    （ワールドのスケールは 1・ゆがみなし。移動は親のスケールで縮む: ワールドの位置 (1, 0, 0)）
"""
import json
import math
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.custom_nodes import load_node_map  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402

MA = """//Maya ASCII 2024 scene
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode joint -n "pj";
\tsetAttr ".s" -type "double3" 0.5 1 1 ;
createNode myCompXform -n "cx" -p "pj";
\tsetAttr ".t" -type "double3" 2 0 0 ;
\tsetAttr ".r" -type "double3" 0 30 0 ;
createNode joint -n "cj" -p "cx";
\tsetAttr ".t" -type "double3" 1 0 0 ;
"""


def columns(m):
    return [m[0:3], m[4:7], m[8:11]]


def skew(m):
    cs = [[x / math.sqrt(sum(y * y for y in c)) for x in c] for c in columns(m)]
    dot = lambda a, b: abs(sum(x * y for x, y in zip(a, b)))  # noqa: E731
    return max(dot(cs[0], cs[1]), dot(cs[0], cs[2]), dot(cs[1], cs[2]))


class ScaleCompensationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.path = os.path.join(cls.tmp.name, "comp.ma")
        with open(cls.path, "w", encoding="utf-8") as f:
            f.write(MA)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def load(self, node_map):
        scene = load_ma(self.path, node_map=node_map)
        return {n["name"]: n for n in scene["nodes"]}, scene

    def test_default_inherits_parent_scale(self):
        nodes, _ = self.load({})
        self.assertGreater(skew(nodes["cx"]["worldMatrix"]), 1e-2)

    def test_compensating_transform_and_joint(self):
        for spec in ({"as": "transform", "segmentScaleCompensate": True}, {"as": "joint"}):
            with self.subTest(spec=spec):
                nodes, scene = self.load({"myCompXform": spec})
                w = nodes["cx"]["worldMatrix"]
                self.assertLess(skew(w), 1e-9)
                for c in columns(w):
                    self.assertAlmostEqual(math.sqrt(sum(x * x for x in c)), 1.0, places=9)
                for got, want in zip(w[12:15], (1.0, 0.0, 0.0)):
                    self.assertAlmostEqual(got, want, places=9)
                self.assertTrue(nodes["cx"].get("compensatesParentScale"))
                # 子のジョイントは、打ち消したノードの向きのまま 1 離れる（ワールドのスケール 1）
                cj = nodes["cj"]["worldMatrix"]
                d = [cj[12 + k] - w[12 + k] for k in range(3)]
                self.assertAlmostEqual(math.sqrt(sum(x * x for x in d)), 1.0, places=9)
                self.assertTrue(any("親のスケールを打ち消す" in x for x in scene["warnings"]))

    def test_transform_without_compensation(self):
        nodes, _ = self.load({"myCompXform": {"as": "transform"}})
        self.assertGreater(skew(nodes["cx"]["worldMatrix"]), 1e-2)
        self.assertNotIn("compensatesParentScale", nodes["cx"])

    def test_config_file(self):
        """設定ファイル（.ma と同じフォルダの ma_viewer_nodes.json）の segmentScaleCompensate"""
        cfg = os.path.join(self.tmp.name, "ma_viewer_nodes.json")
        with open(cfg, "w", encoding="utf-8") as f:
            json.dump({"myCompXform": {"as": "transform", "segmentScaleCompensate": True}, "myBone": "joint",
                       "myPlain": {"as": "transform"}}, f)
        try:
            m = load_node_map(self.path)
            self.assertTrue(m["myCompXform"]["ssc"])
            self.assertTrue(m["myBone"]["ssc"])            # joint の既定は打ち消す
            self.assertFalse(m["myPlain"]["ssc"])
            nodes, _ = self.load(None)
            self.assertLess(skew(nodes["cx"]["worldMatrix"]), 1e-9)
        finally:
            os.remove(cfg)


if __name__ == "__main__":
    unittest.main()
