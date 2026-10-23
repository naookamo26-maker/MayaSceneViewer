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
        self.assertNotIn("expression", types)          # rand() を使う式は解釈できない

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
        _sc, anim = from_text(body % "ikSpringSolver")
        self.assertIsNone(anim)                   # 評価するものがない
        ms = parse_ma_text(HEADER + body % "ikSpringSolver", "t.ma")
        scene_to_dict(ms)
        self.assertIn("ikSpringSolver は未対応", ms.graph_info.ik[0]["problem"])
        # ジョイント 2 つの回転プレーン IK は解けない（極ベクトルの面が決まらない）
        body2 = body.replace('connectAttr "d.tx" "eff.tx";', 'connectAttr "b.tx" "eff.tx";')
        ms = parse_ma_text(HEADER + body2 % "ikRPsolver", "t.ma")
        scene_to_dict(ms)
        self.assertIn("2 個しかありません", ms.graph_info.ik[0]["problem"])
        # ジョイント 4 つの回転プレーン・シングルチェーンは解ける
        for solver in ("ikRPsolver", "ikSCsolver"):
            _sc, anim = from_text(body % solver)
            self.assertEqual(len(next(g for g in anim["graph"] if g["type"] == "ikHandle")["ik"]["chain"]), 4)

    def test_attr_ranges_are_expanded(self):
        ms = parse_ma_text(HEADER + 'createNode plusMinusAverage -n "p";\n\tsetAttr -s 3 ".i1[0:2]"  1 2 3;\n'
                           '\tsetAttr -s 2 ".i3[0:1]" -type "float3" 1 2 3 4 5 6 ;\n', "t.ma")
        attrs = parse_attrs(ms.text, ms.nodes[0])
        self.assertEqual((attrs["i1[0]"], attrs["i1[1]"], attrs["i1[2]"]), (1.0, 2.0, 3.0))
        self.assertEqual(attrs["i3[1]"], [4.0, 5.0, 6.0])



class TestStage3(unittest.TestCase):
    """aimConstraint・シングルチェーン IK・行列ノード・offsetParentMatrix"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "rig3_sample.ma"), animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        cls.graph = {g["name"]: g for g in cls.anim["graph"]}

    def test_node_types(self):
        types = {g["type"] for g in self.anim["graph"]}
        for t in ("aimConstraint", "multMatrix", "decomposeMatrix", "composeMatrix", "inverseMatrix"):
            self.assertIn(t, types)
        self.assertEqual(self.anim["upAxis"], "y")

    def test_aim_attrs(self):
        g = self.graph["eye_aimConstraint1"]
        self.assertEqual(g["attrs"]["wut"], 1.0)
        self.assertEqual(g["inputs"]["wum"]["attr"], "wm")
        self.assertIn("eye_up", self.names)                  # world up のオブジェクトも出力する

    def test_single_chain_ik(self):
        self.assertEqual([self.names[i] for i in self.graph["sc_ik"]["ik"]["chain"]], ["sc_a", "sc_b"])
        self.assertEqual(self.graph["sc2_ik"]["ik"]["solver"], "ikSCsolver")
        self.assertEqual(len(self.graph["sc4_ik"]["ik"]["chain"]), 4)            # 第 4 段階で対応
        self.assertNotIn("sc4_ik", "\n".join(self.anim["warnings"]))

    def test_matrix_attr(self):
        m = self.graph["mm_mult"]["attrs"]["i[0]"]
        self.assertEqual(len(m), 16)
        self.assertEqual(m[12:15], [2.0, 0.0, 0.0])

    def test_offset_parent_matrix(self):
        """offsetParentMatrix はファイルの値（1 段階目の行列計算）にも入る"""
        n = {x["name"]: x for x in self.scene["nodes"]}
        self.assertEqual(n["opm_jnt"]["worldMatrix"][12:15], [6.0, 0.0, -20.0])
        self.assertEqual(n["opm_jnt"]["matrix"][12:15], [6.0, 0.0, -20.0])
        rest = {self.names[e["node"]]: e for e in self.anim["nodes"]}
        self.assertEqual(rest["opm_follow"]["opm"][12:15], [0.0, 0.0, -30.0])
        self.assertIn("opm", self.graph["opm_follow"]["inputs"])
        # トランスフォームからの直接の接続は評価できるので、「ファイルに値がありません」の警告を出さない
        self.assertFalse(any(w.startswith("opm_follow:") for w in self.scene["warnings"]))

    def test_offset_parent_matrix_with_rotation(self):
        """回転を含む offsetParentMatrix: ワールド行列 = ローカル · opm（Maya の行ベクトル規約）"""
        import math
        from ma_viewer import mathutil as M
        c, s = math.cos(math.pi / 2), math.sin(math.pi / 2)
        opm = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 10, 0, 0, 1]          # z 軸まわり 90 度 + 移動 (10, 0, 0)
        sc, _ = from_text('createNode transform -n "x";\n\tsetAttr ".t" -type "double3" 1 0 0 ;\n'
                          '\tsetAttr ".opm" -type "matrix" %s;\n'
                          'createNode joint -n "j" -p "x";\n' % " ".join("%g" % v for v in opm))
        world = sc["nodes"][0]["worldMatrix"]
        expect = M.mul(M.translate((1, 0, 0)), opm)
        for a, b in zip(world, expect):
            self.assertAlmostEqual(a, b, places=9)
        self.assertAlmostEqual(world[13], 1.0)                 # (1, 0, 0) を z 軸まわりに 90 度 → (0, 1, 0) + (10, 0, 0)



class TestFallback(unittest.TestCase):
    """値を求められないノード: バインドポーズの形で推定（fallback）・推定できない（tainted）"""

    def test_sample(self):
        scene = load_ma(os.path.join(ROOT, "samples", "fallback_sample.ma"), animation=True)
        names = [n["name"] for n in scene["nodes"]]
        a = scene["animation"]
        fb = {names[f["node"]]: f for f in a["fallback"]}
        self.assertEqual(set(fb), {"shoulder", "elbow"})
        self.assertEqual(names[fb["shoulder"]["anchor"]], "rig_grp")     # 不明な祖先（なし）を飛ばして確かな祖先
        self.assertEqual(names[fb["elbow"]["anchor"]], "shoulder")       # 推定したノードも基準にできる
        self.assertEqual(fb["elbow"]["unresolved"], ["rz"])
        self.assertEqual({names[i] for i in a["tainted"]}, {"ctrl_grp", "arm_ctrl", "box"})
        self.assertIn("バインドポーズの形で推定", "\n".join(a["warnings"]))

    def test_anchor_skips_unknown_parent(self):
        """親が不明でも、バインドポーズの情報があるジョイントは、さらに上の確かな祖先を基準に推定する"""
        body = ('createNode transform -n "root";\n'
                'createNode transform -n "grp" -p "root";\n'
                'createNode joint -n "j" -p "grp";\n'
                '\tsetAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 3 4 5 1;\n'
                'createNode expression -n "ex";\n'
                'connectAttr "ex.out[0]" "grp.tx";\n')
        sc, anim = from_text(body)
        names = [n["name"] for n in sc["nodes"]]
        self.assertEqual([(names[f["node"]], names[f["anchor"]]) for f in anim["fallback"]], [("j", "root")])
        self.assertEqual([names[i] for i in anim["tainted"]], ["grp"])

    def test_ik_with_unknown_handle(self):
        """IK ハンドルの位置が分からないときは、チェーンのジョイントも推定に回す（原点へ伸びないように）"""
        body = ('createNode joint -n "a";\n\tsetAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1;\n'
                'createNode joint -n "b" -p "a";\n\tsetAttr ".t" -type "double3" 1 0 0.2 ;\n'
                '\tsetAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 1 0 0.2 1;\n'
                'createNode joint -n "c" -p "b";\n\tsetAttr ".t" -type "double3" 1 0 -0.2 ;\n'
                'createNode ikEffector -n "eff" -p "b";\n'
                'createNode transform -n "ctrl";\ncreateNode ikHandle -n "ik" -p "ctrl";\n'
                'createNode ikRPsolver -n "rp";\ncreateNode expression -n "ex";\n'
                'connectAttr "a.msg" "ik.hsj";\nconnectAttr "eff.hp" "ik.hee";\nconnectAttr "rp.msg" "ik.hsv";\n'
                'connectAttr "c.tx" "eff.tx";\nconnectAttr "ex.out[0]" "ctrl.tx";\n')
        sc, anim = from_text(body)
        names = [n["name"] for n in sc["nodes"]]
        fb = {names[f["node"]]: f for f in anim["fallback"]}
        self.assertEqual(set(fb), {"a", "b"})
        self.assertTrue(fb["a"]["unresolved"][0].startswith("r（IK: ik）"))



class TestStage4(unittest.TestCase):
    """displayLayer・四元数ノード・3 本以上のジョイントの IK・スプライン IK"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "ik_sample.ma"), animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        cls.graph = {g["name"]: g for g in cls.anim["graph"]}

    def test_no_warnings(self):
        self.assertEqual(self.anim["warnings"], [])
        self.assertEqual(self.scene["warnings"], [])

    def test_display_layer(self):
        n = {x["name"]: x for x in self.scene["nodes"]}
        self.assertFalse(n["proxy_geo"]["visible"])                       # 非表示のレイヤー
        mesh = next(m for m in self.scene["meshes"] if m["name"] == "proxy_geoShape")
        self.assertFalse(mesh["visible"])
        self.assertEqual(self.graph["hidden_layer"]["attrs"]["v"], 0.0)  # リグからは値を読むだけ
        self.assertNotIn("inputs", self.graph["hidden_layer"])

    def test_display_layer_disabled_or_visible(self):
        base = ('createNode transform -n "g";\ncreateNode mesh -n "gShape" -p "g";\n'
                '\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;\n\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;\n'
                '\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2;\n'
                'createNode displayLayer -n "lay";\n%s'
                'connectAttr "lay.di" "g.do";\n')
        sc, _ = from_text(base % '\tsetAttr ".v" no;\n')
        self.assertFalse(sc["nodes"][0]["visible"])
        sc, _ = from_text(base % '')
        self.assertTrue(sc["nodes"][0]["visible"])
        sc, _ = from_text(base % '\tsetAttr ".v" no;\n\tsetAttr ".e" no;\n')        # レイヤーが無効なら影響しない
        self.assertTrue(sc["nodes"][0]["visible"])

    def test_quat_nodes(self):
        self.assertEqual(self.graph["q_e2q_45"]["attrs"]["irt"], [0.0, 0.0, 45.0])
        self.assertEqual(self.graph["q_slerp"]["attrs"]["it"], 0.5)
        for t in ("quatToEuler", "eulerToQuat", "quatProd", "quatInvert", "quatSlerp", "decomposeMatrix"):
            self.assertIn(t, {g["type"] for g in self.anim["graph"]})

    def test_long_chains(self):
        self.assertEqual(len(self.graph["rp4_ik"]["ik"]["chain"]), 4)
        self.assertEqual(self.graph["sc4_ik"]["ik"]["solver"], "ikSCsolver")

    def test_spline_ik(self):
        ik = self.graph["spA_ik"]
        self.assertEqual(ik["ik"]["solver"], "ikSplineSolver")
        self.assertEqual([self.names[i] for i in ik["ik"]["chain"]], ["spA_%d" % i for i in range(5)])
        shape = self.anim["graph"][ik["inputs"]["ic"]["node"]]
        self.assertEqual(shape["name"], "spA_curveShape")
        self.assertEqual(self.names[shape["parent"]], "spA_curve")        # カーブの親も出力する
        skin = self.anim["graph"][shape["inputs"]["cr"]["node"]]
        self.assertEqual(skin["type"], "skinCluster")
        self.assertEqual(skin["skin"]["weights"], [[0, 0, 1.0], [1, 0, 1.0], [2, 1, 1.0], [3, 1, 1.0]])
        self.assertEqual(set(skin["skin"]["pm"]), {"0", "1"})
        orig = self.anim["graph"][skin["inputs"]["ip[0].ig"]["node"]]
        self.assertEqual(orig["attrs"]["cc"][:6], [3.0, 1.0, 0.0, 0.0, 3.0, 6.0])

    def test_spline_ik_locators_and_twist(self):
        g = self.graph["spB_ik"]
        self.assertEqual(g["attrs"]["dtce"], 1.0)
        self.assertEqual(set(g["inputs"]), {"ic", "dwum", "dwue"})
        shape = self.anim["graph"][g["inputs"]["ic"]["node"]]
        srcs = [self.anim["graph"][shape["inputs"]["cp[%d]" % i]["node"]] for i in range(4)]
        self.assertEqual([s["type"] for s in srcs], ["locator"] * 4)
        self.assertEqual([self.names[s["parent"]] for s in srcs], ["spB_loc%d" % i for i in range(4)])


class TestStage5(unittest.TestCase):
    """第 5 段階: NURBS カーブの出力・expression の判定"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "ctrl_sample.ma"), animation=True)
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        cls.curves = {c["name"]: c for c in cls.scene["curves"]}
        cls.graph = {g["name"]: g for g in cls.scene["animation"]["graph"]}

    def test_curves(self):
        c = self.curves["ctrl_circleShape"]
        self.assertEqual(self.names[c["transform"]], "ctrl_circle")
        self.assertEqual(c["cc"][:6], [3.0, 8.0, 2.0, 0.0, 3.0, 13.0])     # 次数・スパン・周期的・非有理・3 次元・ノット数
        self.assertEqual(c["color"], [1.0, 1.0, 0.0])                       # シェイプのオーバーライド（色番号 17）
        self.assertEqual(self.curves["ctrl_squareShape"]["color"], [0.2, 0.9, 0.5])   # transform の RGB
        self.assertEqual(self.curves["ctrl_layerShape"]["color"], [1.0, 0.0, 0.0])   # ディスプレイレイヤー（13）
        self.assertEqual(self.curves["ctrl_tmplShape"]["display"], 1)
        self.assertFalse(self.curves["ctrl_hiddenShape"]["visible"])
        self.assertEqual(self.curves["ctrl_tweakShape"]["tweaks"], [[1, 0.0, 2.0, 0.0]])
        self.assertNotIn("ctrl_ioonlyShape", self.curves)
        self.assertNotIn("ctrl_ioonly", self.names)
        self.assertEqual(self.scene["stats"]["curves"], len(self.scene["curves"]))

    def test_curve_from_history(self):
        """形が保存されていないカーブ（skinCluster で変形）は、入力をたどって変形前の形を使い、グラフと対応づける"""
        sc = load_ma(os.path.join(ROOT, "samples", "ik_sample.ma"), animation=True)
        curves = {c["name"]: (i, c) for i, c in enumerate(sc["curves"])}
        i, c = curves["spA_curveShape"]
        self.assertTrue(c.get("fromInput"))
        g = next(g for g in sc["animation"]["graph"] if g["name"] == "spA_curveShape")
        self.assertEqual(g["shape"], i)
        self.assertNotIn("spA_curveShapeOrig", curves)                     # 中間オブジェクトは表示しない

    def test_curve_attrs_without_skip(self):
        """カーブの属性は、読み飛ばし（span）からも、ふつうの解析からも同じに読める"""
        sc, _anim = from_text('createNode transform -n "c";\ncreateNode nurbsCurve -n "cShape" -p "c";\n'
                              '\tsetAttr ".ove" yes;\n\tsetAttr ".ovc" 13;\n'
                              '\tsetAttr ".cc" -type "nurbsCurve" 1 1 0 no 3 2 0 1 2 0 0 0 1 0 0;\n')
        self.assertEqual(len(sc["curves"]), 1)
        self.assertEqual(sc["curves"][0]["color"], [1.0, 0.0, 0.0])
        self.assertEqual(sc["nodes"][0]["name"], "c")

    def test_expressions(self):
        self.assertEqual(self.graph["expr_wave"]["expr"], ".O[0] = sin(frame * 0.2) * 3;")
        self.assertIn("if ($h > 2.5)", self.graph["expr_logic"]["expr"])
        self.assertNotIn("tim", self.graph["expr_wave"].get("inputs", {}))     # 時間はビューアのフレームから
        self.assertNotIn("expr_mel", self.graph)
        w = "\n".join(self.scene["animation"]["warnings"])
        self.assertIn("expression expr_mel を解釈できません", w)
        # 解釈できる expression で動くノードには「ファイルに値がありません」の警告を出さない
        sw = "\n".join(self.scene["warnings"])
        self.assertNotIn("e_jnt2:", sw)
        self.assertIn("e_jnt3:", sw)

    def test_check_expression(self):
        from ma_viewer.expression import check_expression
        ok = ["float $a = .I[0] * 2;\nif ($a > 1) .O[0] = $a; else .O[0] = clamp(0, 1, frame);",
              "int $i; for ($i = 0; $i < 3; $i++) .O[0] += time; // comment", ".O[0] = (int)(.I[1] / 2);"]
        for text in ok:
            self.assertIsNone(check_expression(text), text)
        bad = {".O[0] = rand(1);": "rand", '.O[0] = `getAttr "a.tx"`;': "MEL", "pCube1.tx = 1;": "pCube1.tx",
               ".tx = 1;": ".tx", '.O[0] = size("abc");': "size", '$s = "abc";': "文字列", "vector $v = <<1, 0, 0>>;": "vector", "$v = <<1, 0, 0>>;": "ベクトル",
               "print(1);": "print"}
        for text, word in bad.items():
            problem = check_expression(text)
            self.assertIsNotNone(problem, text)
            self.assertIn(word, problem, text)


if __name__ == "__main__":
    unittest.main()
