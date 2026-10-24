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
        self.assertEqual(anim["stats"]["curves"], 7)          # box.v の表示のカーブも読む
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

    def test_visibility_curve(self):
        """表示のキー（box.v）は animation.props に入り、ビューアがフレームごとに評価する"""
        names = [n["name"] for n in self.scene["nodes"]]
        props = [p for p in self.anim["props"] if p["kind"] == "node" and names[p["index"]] == "box"]
        self.assertEqual(len(props), 1)
        c, *_ = self.curve("box_visibility")
        self.assertEqual(props[0]["inputs"], {"v": {"curve": self.anim["curves"].index(c)}})
        self.assertEqual(props[0]["static"]["v"], 1.0)

    def test_warnings(self):
        w = "\n".join(self.anim["warnings"])
        self.assertIn("pointConstraint", w)
        self.assertIn("forearm_twist", w)
        self.assertNotIn("（v）", w)                          # 表示（box.v）のカーブは再生する（animation.props）
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


class TestCameraAimAndDistance(unittest.TestCase):
    """カメラとエイム（lookAt）と距離の寸法（distanceDimShape）。前提: python tools/make_camaim_sample.py"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "camaim_sample.ma"), animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        cls.graph = {g["name"]: g for g in cls.anim["graph"]}

    def test_no_warnings(self):
        self.assertFalse(any("lookAt" in w or "自作ノード" in w for w in self.scene["warnings"]), self.scene["warnings"])
        self.assertEqual(len(self.anim["warnings"]), 1, self.anim["warnings"])
        self.assertIn("bad_roll_group の tws", self.anim["warnings"][0])     # 未対応のノードからの twist だけ
        self.assertEqual(self.anim["tainted"], [])

    def test_unsupported_twist_source_is_dropped(self):
        # twist が未対応のノード（frameCache）から来ていても、lookAt は評価する（twist の接続だけ外す）
        g = self.graph["bad_roll_group"]
        self.assertNotIn("tws", g["inputs"])
        cam = next(x for x in self.anim["graph"] if x["dag"] == self.names.index("bad_roll_cam"))
        self.assertEqual(cam["inputs"]["rx"], {"node": g["id"], "attr": "crx"})

    def test_look_at_drives_camera_rotation(self):
        g = self.graph["cam_aim_group"]
        self.assertEqual(g["type"], "lookAt")
        self.assertEqual(self.names[g["driven"]], "aim_cam")               # constraintParentInverseMatrix の接続元
        self.assertEqual([self.graph_name(t["node"]) for t in g["targets"]], ["aim_cam_aim"])
        self.assertEqual(g["attrs"]["tws"], 20.0)
        cam = next(x for x in self.anim["graph"] if x["dag"] == self.names.index("aim_cam"))
        self.assertEqual(cam["inputs"]["rx"], {"node": g["id"], "attr": "crx"})

    def test_twist_from_other_attributes(self):
        # カメラのシェイプの独自の属性・別のノードの独自の角度の属性（doubleAngle）。値はラジアンにする
        shape = self.graph["shape_roll_camShape"]
        self.assertEqual(self.graph["shape_roll_group"]["inputs"]["tws"], {"node": shape["id"], "attr": "rol"})
        self.assertAlmostEqual(shape["attrs"]["rol"], math.radians(20))
        self.assertAlmostEqual(self.graph["roll_ctrl"]["attrs"]["rol"], math.radians(20))

    def test_distance_dimension(self):
        g = self.graph["distanceDimensionShape1"]
        self.assertEqual(sorted(g["inputs"]), ["ep", "sp"])
        self.assertEqual(self.graph["stretch_md"]["inputs"]["i1x"], {"node": g["id"], "attr": "dist"})

    def graph_name(self, gid):
        return next(x["name"] for x in self.anim["graph"] if x["id"] == gid)


class TestSelectability(unittest.TestCase):
    """Maya のビューポートで選択できないもの。前提: python tools/make_select_sample.py"""

    def test_unselectable(self):
        sc = load_ma(os.path.join(ROOT, "samples", "select_sample.ma"))
        schema.validate(sc)
        nodes = {n["name"]: n.get("unselectable") for n in sc["nodes"]}
        meshes = {m["name"]: m.get("unselectable") for m in sc["meshes"]}
        self.assertEqual(nodes["box"], "テンプレート")                       # .template
        self.assertEqual(meshes["boxShape"], "テンプレート")                  # 親がテンプレート
        self.assertEqual((nodes["arm_geo"], meshes["arm_geoShape"]), ("リファレンス", "リファレンス"))   # レイヤー
        self.assertEqual((nodes["wrist"], nodes["wrist_end"]), ("テンプレート", "テンプレート"))  # オーバーライド（子も）
        self.assertIsNone(nodes["forearm_twist"])
        self.assertIsNone(meshes["hidden_geoShape"])
        self.assertFalse(any("unselectable" in n for n in load_ma(PLAIN)["nodes"]))


class TestSequencer(unittest.TestCase):
    """カメラシーケンサ。前提: python tools/make_sequencer_sample.py"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "sequencer_sample.ma"))
        schema.validate(cls.scene)
        cls.shots = {s["shotName"]: s for s in cls.scene["sequencer"]["shots"]}

    def cam(self, s):
        return self.scene["cameras"][s["camera"]]["name"]

    def test_shots(self):
        self.assertEqual(sorted(self.shots), ["SH010", "SH015", "SH020", "SH030", "SH035", "SH040", "SH099"])
        s = self.shots["SH010"]
        self.assertEqual((s["name"], self.cam(s), s["startFrame"], s["endFrame"], s["sequenceStartFrame"], s["track"]),
                         ("shot1", "shot_cam", 1.0, 12.0, 1.0, 1))
        self.assertEqual(self.shots["SH015"]["track"], 2)
        self.assertTrue(self.shots["SH099"]["mute"])
        self.assertEqual((self.scene["sequencer"]["start"], self.scene["sequencer"]["end"]), (1.0, 49.0))

    def test_sequence_end_frame(self):
        """sequenceEndFrame = 開始 + preHold + (endFrame − startFrame) × scale + postHold"""
        s = self.shots["SH030"]
        self.assertEqual((s["scale"], s["preHold"], s["sequenceEndFrame"]), (2.0, 2.0, 36.0))

    def test_startup_camera_of_shot_is_exported(self):
        self.assertEqual(self.cam(self.shots["SH040"]), "persp")
        self.assertEqual([c["name"] for c in self.scene["cameras"]], ["shot_cam", "ortho_cam", "persp"])

    def test_scene_without_shots(self):
        self.assertIsNone(load_ma(PLAIN)["sequencer"])


class TestCharacterSets(unittest.TestCase):
    """キャラクターセットと Trax のクリップ。前提: python tools/make_trax_sample.py"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "trax_sample.ma"), animation=True)
        cls.anim = cls.scene["animation"]
        schema.validate(cls.scene)

    def char(self, name):
        return next(g for g in self.anim["graph"] if g["name"] == name)

    def curve_name(self, i):
        return self.anim["curves"][i]["name"]

    def test_no_unsupported_warning(self):
        self.assertFalse(any("character" in w for w in self.anim["warnings"] + self.scene["warnings"]), self.anim["warnings"])

    def test_clips(self):
        clips = {c["name"]: c for c in self.char("character1")["trax"]["clips"]}
        self.assertEqual(sorted(clips), ["raise1", "swing1"])
        sw, ra = clips["swing1"], clips["raise1"]
        self.assertEqual((sw["start"], sw["sourceStart"], sw["sourceEnd"], sw["postCycle"]), (1.0, 0.0, 10.0, 1.0))
        self.assertEqual((ra["start"], ra["scale"], ra["track"]), (30.0, 2.0, 1.0))
        # ソースクリップのカーブ → キャラクターの出力（angularValues[1] = shoulder.rz、linearValues[1] = box.tx）
        self.assertEqual({k: self.curve_name(v) for k, v in sw["channels"].items()},
                         {"av[1]": "swing_shoulder_rotateZ", "lv[1]": "swing_box_translateX"})
        self.assertEqual({k: self.curve_name(v) for k, v in ra["channels"].items()},
                         {"av[1]": "raise_shoulder_rotateZ", "lv[1]": "raise_box_translateX"})
        # クリップのカーブは、キーがクリップの中の時間なので印を付ける
        self.assertTrue(all(self.anim["curves"][v].get("trax") for v in sw["channels"].values()))

    def test_members_connect_through_character(self):
        names = [n["name"] for n in self.scene["nodes"]]
        shoulder = next(g for g in self.anim["graph"] if g["dag"] == names.index("shoulder"))
        self.assertEqual(shoulder["inputs"]["rz"], {"node": self.char("character1")["id"], "attr": "av[1]"})

    def test_character_without_clips(self):
        c2 = self.char("character2")
        self.assertNotIn("trax", c2)
        self.assertEqual(self.curve_name(c2["inputs"]["lv[0]"]["curve"]), "character2_rig_grp_translateY")


class TestVisibilityAndCameras(unittest.TestCase):
    """リグで切り替える表示（animation.props）とシーンのカメラ（cameras）。前提: python tools/make_vis_camera_sample.py"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(os.path.join(ROOT, "samples", "vis_camera_sample.ma"), animation=True)
        cls.anim = cls.scene["animation"]
        cls.names = [n["name"] for n in cls.scene["nodes"]]
        schema.validate(cls.scene)

    def prop(self, kind, name):
        if kind == "node":
            index = self.names.index(name)
        elif kind == "mesh":
            index = [m["name"] for m in self.scene["meshes"]].index(name)
        else:
            index = [c["name"] for c in self.scene["cameras"]].index(name)
        return next(p for p in self.anim["props"] if p["kind"] == kind and p["index"] == index)

    def graph(self, name):
        return next(g for g in self.anim["graph"] if g["name"] == name)

    def test_cameras(self):
        cams = {c["name"]: c for c in self.scene["cameras"]}
        self.assertEqual(sorted(cams), ["ortho_cam", "shot_cam"])        # persp などの起動時のカメラは出さない
        shot = cams["shot_cam"]
        self.assertEqual(self.names[shot["transform"]], "shot_cam")
        self.assertAlmostEqual(shot["horizontalFilmAperture"], 1.41732)  # .cap（2 つ組）から
        self.assertAlmostEqual(shot["verticalFilmAperture"], 0.94488)
        self.assertEqual((shot["nearClipPlane"], shot["filmFit"], shot["orthographic"]), (1.0, 1, False))
        self.assertTrue(cams["ortho_cam"]["orthographic"])
        self.assertEqual(cams["ortho_cam"]["orthographicWidth"], 40.0)
        self.assertEqual(self.scene["render"]["width"], 1920)
        self.assertAlmostEqual(self.scene["render"]["deviceAspectRatio"], 16 / 9, places=5)

    def test_visibility_props(self):
        # コントローラーの独自の属性 → box.v（カメラのキーと同じく animation.props に入る）
        box = self.prop("node", "box")
        self.assertEqual(box["inputs"], {"v": {"node": self.graph("vis_ctrl")["id"], "attr": "geoVis"}})
        self.assertFalse(box["static"]["layerHidden"])
        # reverse を経由してシェイプの lodv
        arm_shape = self.prop("mesh", "arm_geoShape")
        self.assertEqual(arm_shape["inputs"]["lodv"], {"node": self.graph("vis_rev")["id"], "attr": "ox"})
        # キーのある独自の属性 → arm_geo.v
        self.assertEqual(self.prop("node", "arm_geo")["inputs"]["v"]["attr"], "proxyVis")
        self.assertIn("curve", self.graph("vis_ctrl")["inputs"]["proxyVis"])
        self.assertEqual(self.graph("vis_ctrl")["attrs"]["geoVis"], 0.0)
        self.assertFalse(any("（v）" in w or "lodv" in w for w in self.anim["warnings"]))

    def test_view_camera(self):
        """保存したときに Maya のビューで見ていたカメラ（uiConfigurationScriptNode の Current Layout）"""
        self.assertEqual(self.scene["cameras"][self.scene["viewCamera"]]["name"], "shot_cam")
        self.assertEqual(load_ma(PLAIN)["viewCamera"], -1)        # 分からないときは -1（自由視点）

    def test_camera_focal_length_curve(self):
        fl = self.prop("camera", "shot_cam")["inputs"]["fl"]
        self.assertEqual(self.anim["curves"][fl["curve"]]["name"], "shot_camShape_focalLength")

    def test_scene_without_driven_visibility_has_no_props(self):
        self.assertNotIn("props", load_ma(PLAIN, animation=True).get("animation") or {})


if __name__ == "__main__":
    unittest.main()
