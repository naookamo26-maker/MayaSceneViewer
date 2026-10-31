# -*- coding: utf-8 -*-
"""HumanIK（HIK）の構成の読み取り（ソースの見分け・警告・リグの診断）のテスト。

  python tests/test_hik.py
シーンはテストの中で書く（Maya 2020 の HumanIK が書き出す接続の形。ノードの属性名は Rokoko の
Maya-Demo-Project（MIT）の DemoScene.ma と、HumanIK のコントロールリグのシーンで確かめた）。
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.animation import build_animation  # noqa: E402
from ma_viewer.custom_nodes import is_standard_type  # noqa: E402
from ma_viewer.extract_ma import scene_to_dict  # noqa: E402
from ma_viewer.hik import analyze_hik  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

HEADER = '''requires maya "2020";
requires -nodeType "HIKSolverNode" -nodeType "HIKRetargeterNode" -nodeType "HIKCharacterNode"
		 -nodeType "HIKSK2State" -nodeType "HIKState2SK" -nodeType "HIKFK2State" -nodeType "HIKEffector2State"
		 -nodeType "HIKPinning2State" -nodeType "HIKProperty2State" -nodeType "hikFKJoint" -nodeType "hikIKEffector"
		 -dataType "HIKCharacter" -dataType "HIKCharacterState" "mayaHIK" "1.0_HIK_2016.5";
currentUnit -l centimeter -a degree -t film;
'''

# ターゲットのスケルトン（Hips → Spine → LeftArm）。skinCluster の代わりに .bps でバインドポーズを持たせる
TARGET = '''createNode joint -n "Hips";
	setAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 100 0 1;
createNode joint -n "Spine" -p "Hips";
	setAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 110 0 1;
createNode joint -n "LeftArm" -p "Spine";
	setAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 15 140 0 1;
	addAttr -s false -ci true -sn "ch" -ln "Character" -at "message";
createNode HIKCharacterNode -n "TargetHik";
	setAttr ".OutputCharacterDefinition" -type "HIKCharacter" ;
	setAttr ".HipsTy" 100;
createNode HIKProperty2State -n "HIKproperties1";
createNode HIKState2SK -n "HIKState2SK1";
connectAttr "Hips.ch" "TargetHik.Hips";
connectAttr "Spine.ch" "TargetHik.Spine";
connectAttr "LeftArm.ch" "TargetHik.LeftArm";
connectAttr "TargetHik.OutputCharacterDefinition" "HIKState2SK1.InputCharacterDefinition";
'''
for _j, _p in (("Hips", "Hips"), ("Spine", "Spine"), ("LeftArm", "LeftArm")):
    for _c in ("Tx", "Ty", "Tz", "Rx", "Ry", "Rz", "Sx", "Sy", "Sz"):
        TARGET += 'connectAttr "HIKState2SK1.%s%s" "%s.%s";\n' % (_p, _c, _j, _c[0].lower() + _c[1])
    TARGET += ('connectAttr "%s.pm" "HIKState2SK1.%sPGX";\nconnectAttr "%s.jo" "HIKState2SK1.%sPreR";\n'
               'connectAttr "%s.ra" "HIKState2SK1.%sPostR";\nconnectAttr "%s.ro" "HIKState2SK1.%sROrder";\n'
               % (_j, _p, _j, _p, _j, _p, _j, _p))

# リターゲット: ソースのキャラクター（キーのある Src_Hips）→ HIKSK2State → HIKRetargeterNode → HIKState2SK
RETARGET = TARGET + '''createNode joint -n "Src_Hips";
createNode joint -n "Src_Spine" -p "Src_Hips";
createNode HIKCharacterNode -n "SourceHik";
	setAttr ".OutputCharacterDefinition" -type "HIKCharacter" ;
createNode HIKSK2State -n "HIKSK2State1";
createNode HIKRetargeterNode -n "HIKRetargeterNode1";
createNode animCurveTA -n "Src_Hips_rotateX";
	setAttr -s 2 ".ktv[0:1]"  1 0 10 45;
connectAttr "Src_Hips_rotateX.o" "Src_Hips.rx";
connectAttr "Src_Hips.ch" "SourceHik.Hips";
connectAttr "Src_Spine.ch" "SourceHik.Spine";
connectAttr "SourceHik.OutputCharacterDefinition" "HIKSK2State1.InputCharacterDefinition";
connectAttr "Src_Hips.wm" "HIKSK2State1.HipsGX";
connectAttr "Src_Spine.wm" "HIKSK2State1.SpineGX";
connectAttr "HIKSK2State1.OutputCharacterState" "HIKRetargeterNode1.InputCharacterState";
connectAttr "SourceHik.OutputCharacterDefinition" "HIKRetargeterNode1.InputCharacterDefinitionSrc";
connectAttr "TargetHik.OutputCharacterDefinition" "HIKRetargeterNode1.InputCharacterDefinitionDst";
connectAttr "HIKRetargeterNode1.OutputCharacterState" "HIKState2SK1.InputCharacterState";
'''

# コントロールリグ: FK のコントローラー（hikFKJoint）→ HIKFK2State、IK エフェクター（hikIKEffector）→ HIKEffector2State
# → HIKPinning2State → HIKSolverNode → HIKState2SK
CONTROL_RIG = TARGET + '''createNode transform -n "TargetHik_Ctrl_Reference";
createNode hikFKJoint -n "TargetHik_Ctrl_Hips" -p "TargetHik_Ctrl_Reference";
	setAttr ".jo" -type "double3" 0 0 0 ;
createNode hikFKJoint -n "TargetHik_Ctrl_Spine" -p "TargetHik_Ctrl_Hips";
createNode hikIKEffector -n "TargetHik_Ctrl_HipsEffector" -p "TargetHik_Ctrl_Reference";
createNode hikIKEffector -n "TargetHik_Ctrl_LeftWristEffector" -p "TargetHik_Ctrl_Reference";
createNode HIKFK2State -n "HIKFK2State1";
createNode HIKEffector2State -n "HIKEffector2State1";
createNode HIKPinning2State -n "HIKPinning2State1";
createNode HIKSolverNode -n "HIKSolverNode1";
connectAttr "TargetHik.OutputCharacterDefinition" "HIKFK2State1.InputCharacterDefinition";
connectAttr "TargetHik_Ctrl_Hips.wm" "HIKFK2State1.HipsGX";
connectAttr "TargetHik_Ctrl_Spine.wm" "HIKFK2State1.SpineGX";
connectAttr "TargetHik_Ctrl_HipsEffector.wm" "HIKEffector2State1.HipsEffectorGX";
connectAttr "TargetHik_Ctrl_LeftWristEffector.wm" "HIKEffector2State1.LeftHandEffectorGX";
connectAttr "HIKEffector2State1.EFF" "HIKPinning2State1.InputEffectorState";
connectAttr "HIKPinning2State1.OutputEffectorState" "HIKSolverNode1.InputEffectorState";
connectAttr "HIKFK2State1.OutputCharacterState" "HIKSolverNode1.InputCharacterState";
connectAttr "TargetHik.OutputCharacterDefinition" "HIKSolverNode1.InputCharacterDefinition";
connectAttr "HIKproperties1.OutputPropertySetState" "HIKSolverNode1.InputPropertySetState";
connectAttr "HIKSolverNode1.OutputCharacterState" "HIKState2SK1.InputCharacterState";
'''


def convert(body: str):
    ms = parse_ma_text(HEADER + body, "hik.ma")
    scene = scene_to_dict(ms)
    anim = build_animation(ms, ms.out_index)
    return ms, scene, scene["warnings"] + anim.get("warnings", [])


def report(body: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "hik.ma")
        with open(path, "w", encoding="utf-8") as f:
            f.write(HEADER + body)
        return rig_report_file(path)


class HikTest(unittest.TestCase):
    def test_hik_types_are_standard(self):
        ms = parse_ma_text(HEADER)
        self.assertEqual(ms.plugin_node_types.get("HIKState2SK"), "mayaHIK")
        for t in ("HIKState2SK", "HIKSolverNode", "HIKRetargeterNode", "hikIKEffector", "hikFKJoint"):
            self.assertTrue(is_standard_type(ms, t), t)    # Maya に付属するプラグインの型は自作ノードではない

    def test_fk_joint_is_joint(self):
        ms = parse_ma_text(HEADER + CONTROL_RIG)
        ctrl = next(n for n in ms.nodes if n.name == "TargetHik_Ctrl_Spine")
        self.assertEqual(ctrl.type, "joint")
        self.assertEqual(ctrl.parent.name, "TargetHik_Ctrl_Hips")

    def test_retarget(self):
        ms = parse_ma_text(HEADER + RETARGET)
        chars = {c.name: c for c in analyze_hik(ms)}
        self.assertEqual(sorted(chars), ["SourceHik", "TargetHik"])
        tgt = chars["TargetHik"]
        self.assertEqual(sorted(tgt.bones), ["Hips", "LeftArm", "Spine"])
        self.assertEqual([d.name for d in tgt.driven], ["Hips", "Spine", "LeftArm"])
        self.assertEqual([(s.kind, s.character.name) for s in tgt.sources], [("retarget", "SourceHik")])
        self.assertEqual(chars["SourceHik"].feeds, ["TargetHik"])
        self.assertEqual(chars["SourceHik"].keyed_bones, 1)
        self.assertFalse(chars["SourceHik"].driven)

    def test_control_rig(self):
        ms = parse_ma_text(HEADER + CONTROL_RIG)
        (c,) = analyze_hik(ms)
        (s,) = c.sources
        self.assertEqual((s.kind, s.fk, s.ik, s.pinning), ("control_rig", 2, 2, True))
        self.assertEqual(s.fk2state.name, "HIKFK2State1")
        self.assertEqual(s.state2sk.name, "HIKState2SK1")

    def test_stance(self):
        body = TARGET + '''createNode HIKSolverNode -n "HIKSolverNode1";
connectAttr "HIKSolverNode1.OutputCharacterState" "HIKState2SK1.InputCharacterState";
'''
        (c,) = analyze_hik(parse_ma_text(HEADER + body))
        self.assertEqual([s.kind for s in c.sources], ["stance"])

    def test_warnings_are_grouped(self):
        _ms, _scene, warnings = convert(RETARGET)
        hik = [w for w in warnings if w.startswith("HumanIK:")]
        self.assertEqual(len(hik), 1)
        self.assertIn("キャラクター TargetHik のスケルトン（Hips、Spine、LeftArm。3 個）は、キャラクター SourceHik からの"
                      "リターゲットで動きます", hik[0])
        self.assertIn("スケルトンのベイク処理", hik[0])
        # ジョイントごとの「接続で決まる」と、HIKState2SK の「未対応」は HumanIK の警告にまとめる
        self.assertFalse([w for w in warnings if "が接続で決まるため" in w], warnings)
        self.assertFalse([w for w in warnings if "HIKState2SK（" in w], warnings)

    def test_control_rig_fk(self):
        ms, _scene, warnings = convert(CONTROL_RIG)
        (c,) = ms.hik_characters
        self.assertEqual(c.fk_parts, ["Hips", "Spine"])               # FK のコントローラーのある部位
        self.assertEqual(c.fk_missing, ["LeftArm"])                    # ない部位は HIKState2SK のまま（評価しない）
        self.assertEqual([d.name for d in c.driven], ["LeftArm"])
        hips = next(n for n in ms.nodes if n.name == "Hips")
        self.assertEqual(hips.inputs["tx"][0].name, "Hips_hikFK_dt")   # 移動・回転は行列ノードから
        self.assertEqual(hips.inputs["rz"][0].name, "Hips_hikFK_dr")
        self.assertNotIn("sx", hips.inputs)                            # スケールは HIKState2SK の接続を外す
        mr = next(n for n in ms.nodes if n.name == "Hips_hikFK_r")
        self.assertEqual({k: (v[0].name, v[1]) for k, v in mr.inputs.items()},
                         {"i[1]": ("TargetHik_Ctrl_Hips", "wm"), "i[2]": ("Hips", "pim")})
        hik = [w for w in warnings if w.startswith("HumanIK:")]
        self.assertEqual(len(hik), 2, hik)
        self.assertIn("キャラクター TargetHik のスケルトン（2 部位）は、コントロールリグの FK のコントローラーから求めて再生します",
                      hik[0])
        self.assertIn("キャラクター TargetHik のスケルトン（LeftArm。1 個）は、コントロールリグ（FK のコントローラーのない部位）で"
                      "動きます", hik[1])
        self.assertFalse([w for w in warnings if "自作ノードの型" in w], warnings)   # hikFKJoint は transform に格上げしない

    def test_ik_reach_warning(self):
        body = CONTROL_RIG.replace('createNode hikIKEffector -n "TargetHik_Ctrl_LeftWristEffector" -p "TargetHik_Ctrl_Reference";',
                                   'createNode hikIKEffector -n "TargetHik_Ctrl_LeftWristEffector" -p "TargetHik_Ctrl_Reference";\n'
                                   '\tsetAttr ".rt" 1;')
        ms, _scene, warnings = convert(body)
        self.assertEqual(ms.hik_characters[0].ik_active, ["TargetHik_Ctrl_LeftWristEffector"])
        self.assertTrue([w for w in warnings if "IK エフェクター TargetHik_Ctrl_LeftWristEffector は Reach が 0 ではない" in w],
                        warnings)
        _ms, _scene, warnings = convert(CONTROL_RIG)
        self.assertFalse([w for w in warnings if "Reach" in w], warnings)

    def test_rig_report(self):
        text = report(RETARGET)
        self.assertIn("■ HumanIK", text)
        self.assertIn("- キャラクター TargetHik: 部位 3 個をキャラクタライズ（Hips=Hips、Spine=Spine、LeftArm=LeftArm）", text)
        self.assertIn("★ スケルトンを動かすもの: キャラクター SourceHik からのリターゲット（HIKRetargeterNode1 → HIKState2SK）",
                      text)
        self.assertIn("このキャラクターをソースにするキャラクター: TargetHik（部位のジョイントのうちキーのあるもの 1 個）", text)
        self.assertIn("HIKState2SK: 27 か所（HumanIK。下の「HumanIK」を参照）", text)
        self.assertNotIn("自作ノードの割り当て", text)                   # HIK の型に雛形を出さない

    def test_rig_report_control_rig(self):
        text = report(CONTROL_RIG)
        self.assertIn("✓ FK のコントローラーから求める部位: 2 個（Hips、Spine）", text)
        self.assertIn("★ FK のコントローラーのない部位（評価しません）: LeftArm", text)
        self.assertIn("★ HumanIK で動くノード（評価しません）: 1 個（LeftArm）", text)

    def test_no_hik(self):
        text = report('createNode joint -n "j1";\n')
        self.assertNotIn("■ HumanIK", text)


if __name__ == "__main__":
    unittest.main()
