# -*- coding: utf-8 -*-
"""アニメーションの読み込み（animation.py と 2 段階読み込み）のテスト。

  python tests/test_animation.py
前提: python tools/make_anim_sample.py（samples/anim_sample.ma を作る）
"""
from __future__ import annotations

import json
import math
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import schema  # noqa: E402
from ma_viewer.animation import build_animation, fps_of, rest_matrix, unpack  # noqa: E402
from ma_viewer.extract_ma import load_ma, load_ma_staged, scene_to_dict  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "anim_sample.ma")
PLAIN = os.path.join(ROOT, "samples", "sample_arm.ma")

HEADER = 'requires maya "2024";\ncurrentUnit -l %s -a %s -t %s;\n'


def scene_from_text(body: str, linear="centimeter", angle="degree", time="film"):
    """テキストからシーンとアニメーションを作る（ジョイント 1 つ + 任意のカーブ）"""
    text = HEADER % (linear, angle, time) + body
    ms = parse_ma_text(text, "test.ma")
    sc = scene_to_dict(ms)
    return sc, build_animation(ms, ms.out_index)


class TestStagedLoad(unittest.TestCase):
    def test_first_stage_does_not_read_curves(self):
        scene, load_animation = load_ma_staged(SAMPLE)
        self.assertNotIn("animation", scene)
        anim = load_animation()
        self.assertIsNotNone(anim)
        self.assertEqual(anim["stats"]["curves"], 6)
        schema.validate(dict(scene, animation=anim))

    def test_same_scene_with_and_without_animation(self):
        """アニメーションを読んでも、シーン本体（nodes・meshes）は変わらない"""
        a = load_ma(SAMPLE)
        b = load_ma(SAMPLE, animation=True)
        self.assertEqual(json.dumps(a["nodes"]), json.dumps(b["nodes"]))
        self.assertEqual(json.dumps(a["meshes"]), json.dumps(b["meshes"]))
        self.assertIn("animation", b)

    def test_file_without_animation(self):
        _scene, load_animation = load_ma_staged(PLAIN)
        self.assertIsNone(load_animation())

    def test_no_skip_mode_gives_same_animation(self):
        """setAttr を読み飛ばさない検証用のモードでも、同じカーブが読める"""
        base = load_ma(SAMPLE, animation=True)["animation"]
        import ma_viewer.ma_scene as ms_mod
        os.environ["MA_VIEWER_NO_SKIP"] = "1"          # skips_attrs() は呼ぶたびに読む
        saved = ms_mod._NO_SKIP                         # _wants_setattr() は読み込み時の値を使う
        ms_mod._NO_SKIP = True
        try:
            with open(SAMPLE, encoding="utf-8") as f:
                text = f.read()
            ms = parse_ma_text(text, SAMPLE)
            self.assertGreater(ms.stats.get("setAttr", 0), 0)
            self.assertEqual(ms.stats.get("読み飛ばし", 0), 0)
            scene_to_dict(ms)
            other = build_animation(ms, ms.out_index)
        finally:
            del os.environ["MA_VIEWER_NO_SKIP"]
            ms_mod._NO_SKIP = saved
        self.assertEqual(unpack(base["values"]), unpack(other["values"]))
        self.assertEqual(base["channels"], other["channels"])


class TestSampleAnimation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(SAMPLE, animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]

    def curve(self, name):
        c = next(c for c in self.anim["curves"] if c["name"] == name)
        o = c["offset"]
        t = unpack(self.anim["times"])[o:o + c["count"]]
        v = unpack(self.anim["values"])[o:o + c["count"]]
        types = unpack(self.anim["tangentTypes"])[2 * o:2 * (o + c["count"])]
        return c, t, v, types

    def test_time_and_range(self):
        a = self.anim
        self.assertEqual((a["fps"], a["timeUnit"]), (24.0, "film"))
        self.assertEqual((a["start"], a["end"], a["animStart"], a["animEnd"]), (1, 24, 1, 30))
        self.assertEqual(a["current"], 1.0)

    def test_channels(self):
        got = sorted((self.names[c["node"]], c["attr"]) for c in self.anim["channels"])
        self.assertEqual(got, [("box", "tx"), ("elbow", "ry"), ("rig_grp", "ty"), ("shoulder", "rz"),
                               ("shoulder", "sx"), ("wrist", "rx")])

    def test_keys_and_tangent_types(self):
        c, t, v, types = self.curve("wrist_rotateX")
        self.assertEqual((t, v), ([1, 10, 20], [0, 30, -30]))
        self.assertEqual(types, [0, 5, 0, 5, 0, 5])          # 出の接線がステップ
        c, t, v, types = self.curve("rig_grp_translateY")
        self.assertEqual(c["post"], 3)
        c, _t, _v, _types = self.curve("shoulder_rotateZ")
        self.assertEqual(c["tangent"], 18)

    def test_fixed_tangents_are_in_frames(self):
        c, *_ = self.curve("box_translateX")
        self.assertTrue(c["weighted"])
        fx = unpack(self.anim["fixedTangents"])
        rows = [fx[i:i + 5] for i in range(0, len(fx), 5)]
        first = next(r for r in rows if r[0] == c["offset"])
        # x は秒 → フレーム（24 fps）。y は cm のまま（作業単位が cm）
        self.assertEqual(first[1:], [12.0, 0.0, 36.0, 0.0])

    def test_warnings(self):
        w = "\n".join(self.anim["warnings"])
        self.assertIn("pointConstraint", w)
        self.assertIn("forearm_twist", w)
        self.assertIn("（v）", w)
        self.assertIn("表示していないノード", w)
        # カーブで動くノードには「ファイルに値がありません」の警告を出さない（再生できるため）
        self.assertFalse(any(x.startswith("shoulder:") for x in self.scene["warnings"]))
        self.assertTrue(any(x.startswith("forearm_twist:") for x in self.scene["warnings"]))

    def test_rest_matrix_matches_file_matrix(self):
        """アニメーションしない成分の材料から、ファイルと同じ行列ができる（box はバインドポーズで置き換えない）"""
        box = next(e for e in self.anim["nodes"] if self.names[e["node"]] == "box")
        m = rest_matrix(box)
        for a, b in zip(m, self.scene["nodes"][box["node"]]["matrix"]):
            self.assertAlmostEqual(a, b, places=6)

    def test_scale_compensation_dependents(self):
        """親ジョイントのスケールが動くとき、子ジョイントも材料に含める（.is の接続先）"""
        elbow = next(e for e in self.anim["nodes"] if self.names[e["node"]] == "elbow")
        self.assertEqual(self.names[elbow["isNode"]], "shoulder")


class TestUnits(unittest.TestCase):
    BODY = ('createNode joint -n "j";\n'
            'createNode animCurveTA -n "j_rx";\n\tsetAttr ".tan" 2;\n'
            '\tsetAttr -s 2 ".ktv[0:1]"  0 0 10 %s;\n'
            '\tsetAttr -s 2 ".kix[0:1]"  1 1;\n\tsetAttr -s 2 ".kiy[0:1]"  0 %s;\n'
            'createNode animCurveTL -n "j_tx";\n'
            '\tsetAttr -s 2 ".ktv[0:1]"  0 0 10 2;\n'
            '\tsetAttr -s 2 ".kix[0:1]"  1 1;\n\tsetAttr -s 2 ".kiy[0:1]"  0 100;\n'
            'connectAttr "j_rx.o" "j.rx";\nconnectAttr "j_tx.o" "j.translateX";\n')

    def test_radian_and_meter(self):
        _sc, anim = scene_from_text(self.BODY % (math.pi / 2, math.pi), linear="meter", angle="radian", time="ntsc")
        self.assertEqual(anim["fps"], 30.0)
        vals = unpack(anim["values"])
        # 角度は度に、長さはファイルの単位（m）のまま
        self.assertAlmostEqual(vals[1], 90.0, places=4)
        self.assertAlmostEqual(vals[3], 2.0, places=5)
        fx = unpack(anim["fixedTangents"])
        rows = {int(fx[i]): fx[i + 1:i + 5] for i in range(0, len(fx), 5)}
        self.assertAlmostEqual(rows[1][0], 30.0)                 # 1 秒 = 30 フレーム
        self.assertAlmostEqual(rows[1][1], 180.0, places=3)      # ラジアン → 度
        self.assertAlmostEqual(rows[3][1], 1.0, places=5)        # cm → m
        self.assertEqual((anim["start"], anim["end"]), (0.0, 10.0))   # playbackOptions がなければキーの範囲

    def test_fps_names(self):
        self.assertEqual(fps_of("film"), 24.0)
        self.assertEqual(fps_of("pal"), 25.0)
        self.assertEqual(fps_of("ntscf"), 60.0)
        self.assertEqual(fps_of("23.976fps"), 23.976)
        self.assertEqual(fps_of("120fps"), 120.0)

    def test_split_key_pieces(self):
        """キーが複数の setAttr に分かれていても（添字の範囲ごと）並べ直して読む"""
        body = ('createNode joint -n "j";\n'
                'createNode animCurveTU -n "j_sx";\n'
                '\tsetAttr -s 3 ".ktv[1:2]"  5 2 9 3;\n'
                '\tsetAttr ".ktv[0]"  1 1;\n'
                '\tsetAttr ".kot[2]"  5;\n'
                'connectAttr "j_sx.o" "j.sx";\n')
        _sc, anim = scene_from_text(body)
        self.assertEqual(unpack(anim["times"]), [1, 5, 9])
        self.assertEqual(unpack(anim["values"]), [1, 2, 3])
        self.assertEqual(unpack(anim["tangentTypes"]), [0, 0, 0, 0, 0, 5])

    def test_current_time(self):
        body = ('createNode joint -n "j";\n'
                'createNode animCurveTU -n "j_sx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 1 9 3;\n'
                'select -ne :time1;\n\tsetAttr ".o" 7;\n\tsetAttr ".unw" 7;\n'
                'connectAttr "j_sx.o" "j.sx";\n')
        _sc, anim = scene_from_text(body)
        self.assertEqual(anim["current"], 7.0)


if __name__ == "__main__":
    unittest.main()
