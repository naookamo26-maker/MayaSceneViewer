# -*- coding: utf-8 -*-
"""リグ（コンストレイント・IK・計算ノード）の探索と書き出しのテスト。

  python tests/test_rig.py
前提: python tools/make_rig_sample.py（samples/rig_sample.ma を作る）
"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.animation import build_animation  # noqa: E402
from ma_viewer.extract_ma import load_ma, load_ma_staged, scene_to_dict  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402
from ma_viewer.rig import parse_attrs  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "rig_sample.ma")
PLAIN = os.path.join(ROOT, "samples", "sample_arm.ma")
HEADER = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


def from_text(body: str):
    ms = parse_ma_text(HEADER + body, "test.ma")
    sc = scene_to_dict(ms)
    return sc, build_animation(ms, ms.out_index)


class TestDiscovery(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(SAMPLE, animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        cls.graph = {g["name"]: g for g in cls.anim["graph"]}

    def test_controllers_are_output(self):
        """コンストレイントのターゲット・IK ハンドル・計算ノードの入力元（ジョイントでもメッシュでもない）も出力する"""
        for n in ("hand_ctrl", "arm_ik", "elbow_pv", "tgtA", "tgtB", "scl_ctrl", "ctrl_util"):
            self.assertIn(n, self.names)
        # 評価に関係しない DAG ノード（エフェクター・コンストレイントのノード）は出力しない
        for n in ("effector1", "prop_parentConstraint1"):
            self.assertNotIn(n, self.names)

    def test_graph_nodes(self):
        types = {g["type"] for g in self.anim["graph"]}
        for t in ("poleVectorConstraint", "orientConstraint", "parentConstraint", "pointConstraint", "scaleConstraint",
                  "multiplyDivide", "plusMinusAverage", "reverse", "unitConversion", "condition", "blendColors",
                  "pairBlend", "ikHandle"):
            self.assertIn(t, types)
        self.assertNotIn("expression", types)

    def test_ik(self):
        ik = self.graph["arm_ik"]["ik"]
        self.assertEqual(ik["solver"], "ikRPsolver")
        self.assertEqual([self.names[i] for i in ik["chain"]], ["shoulder", "elbow", "wrist"])
        pvc = self.graph["arm_ik_poleVectorConstraint1"]
        self.assertEqual(self.names[pvc["pivot"]], "shoulder")
        self.assertEqual(self.names[pvc["driven"]], "arm_ik")
        self.assertEqual(set(self.graph["arm_ik"]["inputs"]), {"pvx", "pvy", "pvz"})

    def test_constraint_targets_and_offsets(self):
        pc = self.graph["prop_parentConstraint1"]
        self.assertEqual(self.names[pc["driven"]], "prop")
        self.assertEqual([self.anim["graph"][t["node"]]["name"] for t in pc["targets"]], ["wrist"])
        self.assertEqual(pc["attrs"]["tg[0].tor"], [0.0, 0.0, 90.0])
        pt = self.graph["head_pointConstraint1"]
        self.assertEqual(len(pt["targets"]), 2)
        self.assertIn("curve", pt["inputs"]["w1"])            # ウェイトのカーブ
        self.assertEqual(pt["attrs"]["w0"], 1.0)

    def test_custom_attr_and_static_values(self):
        self.assertEqual(self.graph["ctrl_util"]["attrs"]["blend"], 0.25)
        self.assertEqual(self.graph["pma_add"]["attrs"]["i1[1]"], 1.0)
        self.assertEqual(self.graph["cond"]["attrs"]["ct"], [2.0, 0.0, 0.0])
        self.assertEqual(self.graph["bc"]["inputs"]["b"]["attr"], "blend")

    def test_rest_entries(self):
        """評価に使う DAG ノードには、ローカル行列の材料（rest）がある"""
        rest = {self.names[n["node"]] for n in self.anim["nodes"]}
        for n in ("shoulder", "elbow", "wrist", "hand_ctrl", "arm_ik", "elbow_pv", "prop", "head", "util_jnt"):
            self.assertIn(n, rest)

    def test_warnings(self):
        w = "\n".join(self.anim["warnings"])
        self.assertIn("expression", w)
        self.assertIn("animCurveUA", w)
        self.assertNotIn("表示していないノード", w)         # ウェイトのカーブはリグの入力
        # リグで評価できるノードには「ファイルに値がありません」の警告を出さない
        scene_w = "\n".join(self.scene["warnings"])
        for n in ("wrist:", "prop:", "head:", "util_jnt:", "pb_jnt:"):
            self.assertNotIn(n, scene_w)
        self.assertIn("expr_jnt:", scene_w)

    def test_first_stage_reads_no_values(self):
        """1 段階目は接続だけを見る（属性の値は 2 段階目で読む）"""
        scene, load_animation = load_ma_staged(SAMPLE)
        self.assertNotIn("animation", scene)
        self.assertIn("hand_ctrl", [n["name"] for n in scene["nodes"]])
        self.assertIsNotNone(load_animation())

    def test_scene_without_rig_is_unchanged(self):
        a = load_ma(PLAIN)
        self.assertEqual([n["name"] for n in a["nodes"]],
                         ["arm_geo", "rig_grp", "shoulder", "elbow", "forearm_twist", "wrist", "wrist_end", "props_grp",
                          "box", "hidden_geo"])


class TestSmallRigs(unittest.TestCase):
    def test_static_rig_without_curves(self):
        """キーがなくても、コンストレイントがあれば評価用のデータを出す"""
        _sc, anim = from_text(
            'createNode transform -n "ctrl";\n\tsetAttr ".t" -type "double3" 1 2 3 ;\n'
            'createNode joint -n "j";\n'
            'createNode pointConstraint -n "pc" -p "j";\n'
            'connectAttr "ctrl.t" "pc.tg[0].tt";\nconnectAttr "ctrl.pm" "pc.tg[0].tpm";\n'
            'connectAttr "pc.ctx" "j.tx";\n')
        self.assertIsNotNone(anim)
        self.assertEqual(anim["curves"], [])
        self.assertTrue(any(g["type"] == "pointConstraint" for g in anim["graph"]))

    def test_static_rig_from_file(self):
        """ファイルから読む経路（2 段階）でも、キーのないリグを評価用に出す（本文を手放さない）"""
        import tempfile
        path = os.path.join(tempfile.mkdtemp(), "static.ma")
        with open(path, "w", encoding="utf-8") as f:
            f.write(HEADER + 'createNode transform -n "ctrl";\ncreateNode joint -n "j";\n'
                    'createNode pointConstraint -n "pc" -p "j";\n'
                    'connectAttr "ctrl.t" "pc.tg[0].tt";\nconnectAttr "pc.ctx" "j.tx";\n')
        _scene, load_animation = load_ma_staged(path)
        self.assertIsNotNone(load_animation())

    def test_unsupported_ik(self):
        body = ('createNode joint -n "a";\ncreateNode joint -n "b" -p "a";\n\tsetAttr ".t" -type "double3" 1 0 0 ;\n'
                'createNode joint -n "c" -p "b";\n\tsetAttr ".t" -type "double3" 1 0 0 ;\n'
                'createNode joint -n "d" -p "c";\n\tsetAttr ".t" -type "double3" 1 0 0 ;\n'
                'createNode ikEffector -n "eff" -p "c";\ncreateNode ikHandle -n "ik";\n'
                'createNode %s -n "solver";\n'
                'connectAttr "a.msg" "ik.hsj";\nconnectAttr "eff.hp" "ik.hee";\nconnectAttr "solver.msg" "ik.hsv";\n'
                'connectAttr "d.tx" "eff.tx";\n')
        _sc, anim = from_text(body % "ikSCsolver")
        self.assertIsNone(anim)                   # 評価するものがない
        ms = parse_ma_text(HEADER + body % "ikRPsolver", "t.ma")
        scene_to_dict(ms)
        problems = [e["problem"] for e in ms.graph_info.ik]
        self.assertTrue(problems and "2 ボーン" in problems[0])

    def test_attr_ranges_are_expanded(self):
        ms = parse_ma_text(HEADER + 'createNode plusMinusAverage -n "p";\n\tsetAttr -s 3 ".i1[0:2]"  1 2 3;\n'
                           '\tsetAttr -s 2 ".i3[0:1]" -type "float3" 1 2 3 4 5 6 ;\n', "t.ma")
        attrs = parse_attrs(ms.text, ms.nodes[0])
        self.assertEqual((attrs["i1[0]"], attrs["i1[1]"], attrs["i1[2]"]), (1.0, 2.0, 3.0))
        self.assertEqual(attrs["i3[1]"], [4.0, 5.0, 6.0])


if __name__ == "__main__":
    unittest.main()
