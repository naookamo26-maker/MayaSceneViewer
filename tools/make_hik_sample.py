# -*- coding: utf-8 -*-
"""HumanIK のコントロールリグ（FK）で動くスケルトンの検証用サンプルを生成する。

  python tools/make_hik_sample.py   → samples/hik_fk_sample.ma, samples/hik_fk_sample.json

Maya 2020 の HumanIK が書き出す接続の形（Kano のコントロールリグのシーンで確かめた）で、値は自作のもの。
  * スケルトン（Root → Hips → Spine → Spine1 → ShoulderExtra → LeftArm → LeftForeArm → LeftHand、Spine1 → Head、
    Hips → LeftUpLeg → LeftLeg）。ShoulderExtra はキャラクタライズしない（HIKState2SK で動かない）ジョイント。
    ジョイントごとに jointOrient・rotateAxis・回転順・バインド時の回転の値を変えてある。腕は A ポーズ（下に 31 度）
  * キャラクター Character1（HIKCharacterNode）: 部位ごとのスタンスのワールドの位置 <部位>Tx〜Tz と向き <部位>Rx〜Rz
    （xyz の順。スケルトンのバインドポーズと同じ）
  * コントロールリグ: Character1_Ctrl_Reference（transform）の下の hikFKJoint。スタンスで回転の値は 0。
    向きは部位ごとに jointOrient・rotateAxis で決め、単位行列でないもの（腕は A ポーズの向きなど）もある
    → HIKFK2State → HIKSolverNode ← HIKPinning2State ← HIKEffector2State ← hikIKEffector（Reach 0）
    → HIKState2SK → スケルトンの移動・回転・スケール
  * キー（再生範囲 1〜10。1 はすべて 0 = スタンス）: Hips の移動 Y・Z と回転 Y、Spine の回転 X、LeftArm の回転 Z・X、
    LeftForeArm の回転 Y、LeftUpLeg の回転 X、Head の回転 Z
期待値: フレーム 1 はスケルトン = バインドポーズ。どのフレームも、部位のワールドの向きは
  （コントローラーのワールドの向き）· （スタンスのコントローラーの向き）⁻¹ · （スタンスのスケルトンの向き）（列ベクトル）、
  位置はコントローラーの位置。ShoulderExtra は Spine1 のワールド · ファイルのローカル。
"""
from __future__ import annotations

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
OUT_MA = os.path.join(ROOT, "samples", "hik_fk_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "hik_fk_sample.json")

from ma_viewer import mathutil as M  # noqa: E402

D = math.pi / 180.0
ORDERS = M.ROTATE_ORDERS


def rad(v):
    return [x * D for x in v]


def euler_xyz(m):
    """行ベクトルの回転行列 M = Rx · Ry · Rz（Maya の xyz）のオイラー角（度）"""
    b = math.asin(max(-1.0, min(1.0, -m[2])))
    a = math.atan2(m[6], m[10])
    c = math.atan2(m[1], m[0])
    out = [a / D, b / D, c / D]
    assert all(abs(x - y) < 1e-9 for x, y in zip(M.euler(rad(out)), _rot(m))), "euler_xyz"
    return out


def _rot(m):
    out = list(m)
    out[12:15] = [0.0, 0.0, 0.0]
    return out


def mat(pos, rot_deg, order="xyz"):
    m = M.euler(rad(rot_deg), order)
    m[12:15] = list(pos)
    return m


# スケルトン: 名前 → (親, 部位, ワールドの位置, ワールドの向き（度・xyz）, rotateAxis, バインド時の回転, 回転順)
SKELETON = [
    ("Root", None, "Reference", (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0), 0),
    ("Hips", "Root", "Hips", (0, 100, 0), (90, 0, 90), (0, 0, 0), (0, 0, 0), 0),
    ("Spine", "Hips", "Spine", (0, 110, 1), (88, 5, 90), (10, 0, 0), (0, 4, 0), 1),
    ("Spine1", "Spine", "Spine1", (0, 125, 2), (92, -3, 89), (0, 0, 0), (0, 0, 0), 0),
    ("ShoulderExtra", "Spine1", None, (5, 140, 1), (0, 0, 12), (0, 0, 0), (3, 0, 0), 0),
    ("LeftArm", "ShoulderExtra", "LeftArm", (15, 140, 0), (0, 0, -31), (0, 15, 0), (0, 0, 6), 3),
    ("LeftForeArm", "LeftArm", "LeftForeArm", (40, 125, -1), (5, -8, -33), (0, 0, 0), (0, 0, 0), 5),
    ("LeftHand", "LeftForeArm", "LeftHand", (62, 112, 0), (0, 0, -31), (-20, 0, 0), (0, 0, 0), 0),
    ("Head", "Spine1", "Head", (0, 160, 3), (90, 2, 90), (0, 0, 0), (0, 0, 0), 2),
    ("LeftUpLeg", "Hips", "LeftUpLeg", (10, 95, 0), (180, 0, -92), (0, 0, 0), (0, 0, 0), 0),
    ("LeftLeg", "LeftUpLeg", "LeftLeg", (11, 50, 2), (178, 3, -91), (0, 0, 0), (2, 0, 0), 4),
]
# コントロールリグ: 部位 → (親, スタンスのワールドの向き（度・xyz）, rotateAxis)。位置はスケルトンと同じ
CONTROLS = [
    ("Hips", None, (0, 0, 0), (0, 0, 0)),
    ("Spine", "Hips", (0, 0, 0), (0, 0, 0)),
    ("Spine1", "Spine", (0, 0, 0), (0, 0, 0)),
    ("LeftArm", "Spine1", (0, 0, -31), (-90, 0, 0)),
    ("LeftForeArm", "LeftArm", (0, 0, -31), (0, 0, 0)),
    ("LeftHand", "LeftForeArm", (0, 0, -31), (0, 0, 0)),
    ("Head", "Spine1", (0, 0, 0), (0, 0, 0)),
    ("LeftUpLeg", "Hips", (0, 0, 0), (0, 0, 0)),
    ("LeftLeg", "LeftUpLeg", (0, 0, 0), (0, 0, 0)),
]
# キー: (コントローラーの部位, 属性, フレーム 10 の値)。フレーム 1 は 0（Hips の移動はスタンスの値）
KEYS = [
    ("Hips", "ty", -6.0), ("Hips", "tz", 12.0), ("Hips", "ry", 25.0),
    ("Spine", "rx", 15.0), ("LeftArm", "rz", 40.0), ("LeftArm", "rx", -20.0),
    ("LeftForeArm", "ry", 55.0), ("LeftUpLeg", "rx", -35.0), ("Head", "rz", 18.0),
]


def local_values(world, parent_world, ra, r, ro):
    """ワールドの行列から、ジョイントの移動と jointOrient（rotateAxis・回転の値は与えたもの）を求める"""
    local = M.mul(world, M.inverse(parent_world)) if parent_world is not None else list(world)
    t = M.position(local)
    # ローカルの回転 = RA · R · JO → JO = R⁻¹ · RA⁻¹ · ローカル
    jo_m = M.mul(M.mul(M.inverse(M.euler(rad(r), ORDERS[ro])), M.inverse(M.euler(rad(ra)))), _rot(local))
    return t, euler_xyz(jo_m)


def fmt(v):
    return " ".join("%.12g" % x for x in v)


def main():
    lines = ['//Maya ASCII 2020 scene', '//Name: hik_fk_sample.ma', 'requires maya "2020";',
             'requires -nodeType "HIKSolverNode" -nodeType "HIKCharacterNode" -nodeType "HIKFK2State"',
             '\t\t -nodeType "HIKEffector2State" -nodeType "HIKPinning2State" -nodeType "HIKState2SK"',
             '\t\t -nodeType "HIKProperty2State" -nodeType "hikFKJoint" -nodeType "hikIKEffector"',
             '\t\t -dataType "HIKCharacter" -dataType "HIKCharacterState" -dataType "HIKEffectorState"',
             '\t\t -dataType "HIKPropertySetState" "mayaHIK" "1.0_HIK_2016.5";',
             'currentUnit -l centimeter -a degree -t film;']
    conns = []
    world = {}
    part_of = {}
    for name, parent, part, pos, rot, ra, r, ro in SKELETON:
        w = mat(pos, rot)
        world[name] = w
        t, jo = local_values(w, world.get(parent), ra, r, ro)
        lines.append('createNode joint -n "%s"%s;' % (name, ' -p "%s"' % parent if parent else ""))
        lines.append('\taddAttr -s false -ci true -sn "ch" -ln "Character" -at "message";')
        if part in (None, "Reference"):
            lines.append('\tsetAttr ".t" -type "double3" %s ;' % fmt(t))      # HIKState2SK で動かないジョイント
            lines.append('\tsetAttr ".r" -type "double3" %s ;' % fmt(r))
        lines.append('\tsetAttr ".ra" -type "double3" %s ;' % fmt(ra))
        lines.append('\tsetAttr ".jo" -type "double3" %s ;' % fmt(jo))
        if ro:
            lines.append('\tsetAttr ".ro" %d;' % ro)
        lines.append('\tsetAttr ".bps" -type "matrix" %s ;' % fmt(w))
        if part:
            part_of[name] = part
            conns.append('connectAttr "%s.ch" "Character1.%s";' % (name, part))
    # キャラクター（スタンス）
    lines.append('createNode HIKCharacterNode -n "Character1";')
    lines.append('\tsetAttr ".OutputCharacterDefinition" -type "HIKCharacter" ;')
    lines.append('\tsetAttr ".InputCharacterizationLock" yes;')
    for name, _p, part, pos, rot, *_rest in SKELETON:
        if not part:
            continue
        for axis, v in zip("xyz", pos):
            if v:
                lines.append('\tsetAttr ".%sT%s" %.12g;' % (part, axis, v))
        for axis, v in zip("xyz", euler_xyz(world[name])):
            if abs(v) > 1e-12:
                lines.append('\tsetAttr ".%sR%s" %.12g;' % (part, axis, v))
    # コントロールリグ
    pos_of = {part: pos for _n, _p, part, pos, *_r in SKELETON}
    lines.append('createNode transform -n "Character1_Ctrl_Reference";')
    cworld = {None: M.identity()}
    cpath = {None: "Character1_Ctrl_Reference"}
    for part, parent, rot, ra in CONTROLS:
        w = mat(pos_of[part], rot)
        cworld[part] = w
        t, jo = local_values(w, cworld[parent], ra, (0, 0, 0), 0)
        name = "Character1_Ctrl_" + part
        cpath[part] = name
        lines.append('createNode hikFKJoint -n "%s" -p "%s";' % (name, cpath[parent]))
        lines.append('\tsetAttr ".t" -type "double3" %s ;' % fmt(t))
        lines.append('\tsetAttr ".ra" -type "double3" %s ;' % fmt(ra))
        lines.append('\tsetAttr ".jo" -type "double3" %s ;' % fmt(jo))
        conns.append('connectAttr "%s.wm" "HIKFK2State1.%sGX";' % (name, part))
    conns.append('connectAttr "Character1_Ctrl_Reference.wm" "HIKFK2State1.ReferenceGX";')
    lines.append('createNode hikIKEffector -n "Character1_Ctrl_LeftWristEffector" -p "Character1_Ctrl_Reference";')
    lines.append('\tsetAttr ".t" -type "double3" %s ;' % fmt(pos_of["LeftHand"]))
    conns += ['connectAttr "Character1_Ctrl_LeftWristEffector.wm" "HIKEffector2State1.LeftWristEffectorGX[0]";',
              'connectAttr "Character1_Ctrl_LeftWristEffector.rt" "HIKEffector2State1.LeftWristEffectorReachT[0]";',
              'connectAttr "Character1_Ctrl_LeftWristEffector.rr" "HIKEffector2State1.LeftWristEffectorReachR[0]";']
    for t in ("HIKFK2State1:HIKFK2State", "HIKEffector2State1:HIKEffector2State", "HIKPinning2State1:HIKPinning2State",
              "HIKproperties1:HIKProperty2State", "HIKSolverNode1:HIKSolverNode", "HIKState2SK1:HIKState2SK"):
        n, tp = t.split(":")
        lines.append('createNode %s -n "%s";' % (tp, n))
    conns += [
        'connectAttr "Character1.OutputCharacterDefinition" "HIKFK2State1.InputCharacterDefinition";',
        'connectAttr "Character1.OutputCharacterDefinition" "HIKSolverNode1.InputCharacterDefinition";',
        'connectAttr "Character1.OutputCharacterDefinition" "HIKState2SK1.InputCharacterDefinition";',
        'connectAttr "HIKproperties1.OutputPropertySetState" "HIKSolverNode1.InputPropertySetState";',
        'connectAttr "HIKFK2State1.OutputCharacterState" "HIKSolverNode1.InputCharacterState";',
        'connectAttr "HIKEffector2State1.EFF" "HIKPinning2State1.InputEffectorState";',
        'connectAttr "HIKPinning2State1.OutputEffectorState" "HIKSolverNode1.InputEffectorState";',
        'connectAttr "HIKSolverNode1.OutputCharacterState" "HIKState2SK1.InputCharacterState";',
    ]
    for name, part in part_of.items():
        if part == "Reference":
            continue
        for ch in ("Tx", "Ty", "Tz", "Rx", "Ry", "Rz", "Sx", "Sy", "Sz"):
            conns.append('connectAttr "HIKState2SK1.%s%s" "%s.%s";' % (part, ch, name, ch.lower()))
        conns += ['connectAttr "%s.pm" "HIKState2SK1.%sPGX";' % (name, part),
                  'connectAttr "%s.jo" "HIKState2SK1.%sPreR";' % (name, part),
                  'connectAttr "%s.ra" "HIKState2SK1.%sPostR";' % (name, part),
                  'connectAttr "%s.ro" "HIKState2SK1.%sROrder";' % (name, part),
                  'connectAttr "%s.ssc" "HIKState2SK1.%sSC";' % (name, part),
                  'connectAttr "%s.is" "HIKState2SK1.%sIS";' % (name, part)]
    # キー
    for part, attr, v in KEYS:
        ctype = "animCurveTL" if attr.startswith("t") else "animCurveTA"
        cname = "Character1_Ctrl_%s_%s" % (part, attr)
        v0 = 0.0
        if attr.startswith("t"):                        # Hips の移動（Reference の下なので、スタンスの位置から動かす）
            v0 = pos_of[part]["xyz".index(attr[1])]
            v = v0 + v
        lines.append('createNode %s -n "%s";' % (ctype, cname))
        lines.append('\tsetAttr ".tan" 2;')
        lines.append('\tsetAttr -s 2 ".ktv[0:1]"  1 %.12g 10 %.12g;' % (v0, v))
        conns.append('connectAttr "%s.o" "Character1_Ctrl_%s.%s";' % (cname, part, attr))
    lines += ['createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 10 -ast 1 -aet 10 ";',
              '\tsetAttr ".st" 6;']
    lines += conns
    lines.append('// End of hik_fk_sample.ma')
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT_MA, animation=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s / %s" % (OUT_MA, OUT_JSON))
    for w in scene.get("warnings", []):
        print("  警告: %s" % w)


if __name__ == "__main__":
    main()
