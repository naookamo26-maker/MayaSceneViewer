# -*- coding: utf-8 -*-
"""exprespy（Python で式を書くノード）の評価の検証用サンプルを生成する。

  python tools/make_exprespy_sample.py
    → samples/exprespy_sample.ma（exprespy ノードを使うシーン）、
      samples/exprespy_sample.json（書き出した共通 JSON。web_src/tests/exprespy.test.mjs が読む）

再生範囲 1〜24。src.tx にキー（1: -3 → 24: 3）、src.rz にキー（1: 0 → 24: 90 度）、upv.ty にキー（1: 4 → 24: -2）。
コンストレイントの 4 つ（posCnsEx・oriCnsEx・aimCnsEx・aimUpCnsEx）のコードは exprespy の同梱サンプル
examples/constraints.ma（MIT License, Copyright (c) 2016 Ryusuke Sasaki）のもの。動かす先は表示されるように
ジョイントにし、回転順を変えて（oriCnst は zxy、aimCnst は yzx）回転順の入力も確かめる。
  * posCnsEx: posCnst の回転のピボットのワールドの位置 = src のピボットのワールドの位置 + 親の空間の offsetTranslate
  * oriCnsEx: oriCnst のワールドの回転 = src のワールドの回転
  * aimCnsEx: aimCnst の Y 軸が src のピボットを向く（親の空間で求める）
  * aimUpCnsEx: aimUpCnst の回転（親の回転を打ち消さない。サンプルのとおり）の Y 軸がワールドで src を向き、
      Z 軸は upv への向きと直交し、X 軸は upv の側
  * timeEx: IN[0] ← time1.o（秒）、IN[1] = 3（接続のない入力の値）→ jT.ty = sin(2 · 秒) · 3
  * chainA → chainB: chainA の OUT[0] = src.t · 2（MVector）→ chainB の IN[0] → 長さ → jC.tx = 2 · |src.t|
      （import の別名 from maya.api.OpenMaya import MVector as V も確かめる）
  * quatEx: MQuaternion(角度, 軸) と asEulerRotation → jQ.r = (0, 0, src.rz)
  * badCmds（maya.cmds の呼び出し）・badMesh（メッシュの形状の入力）: 解析できない（警告を出し、評価しない）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "exprespy_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "exprespy_sample.json")

# exprespy の examples/constraints.ma のコード（MIT License, Copyright (c) 2016 Ryusuke Sasaki）
POS = ("pos = api.MPoint(IN[0] + IN[1] + IN[2])\npos *= IN[3]\npos *= IN[4]\npos -= IN[5] + IN[6]\npos += IN[7]\n"
       "OUT[0] = pos")
ORI = ("m = api.MEulerRotation(IN[0], IN[1]).asMatrix()\nm *= IN[2]\nm *= IN[3]\n"
       "r = api.MTransformationMatrix(m).rotation(False)\nr.reorderIt(IN[4])\nOUT[0] = r\n")
AIM = ("aim0 = api.MVector.kYaxisVector\n\npos = api.MPoint(IN[0] + IN[1] + IN[2])\npos *= IN[3]\npos *= IN[4]\n"
       "aim1 = pos - api.MPoint(IN[5] + IN[6] + IN[7])\nq = api.MQuaternion(aim0, aim1)\n"
       "r = api.MEulerRotation([0., 0., 0.], IN[8])\nr.setValue(q)\nOUT[0] = r")
AIM_UP = ("aim0 = api.MVector.kYaxisVector\nupv0 = api.MVector.kXaxisVector\ncrs0 = aim0 ^ upv0\n\n"
          "srcP = api.MPoint(IN[0] + IN[1] + IN[2])\nsrcP *= IN[3]\nupvP = api.MPoint(IN[4] + IN[5] + IN[6])\n"
          "upvP *= IN[7]\ndstP = api.MPoint(IN[8] + IN[9] + IN[10])\ndstP *= IN[11]\n\n"
          "aim1 = (srcP - dstP).normalize()\nupv1 = upvP - dstP\ncrs1 = (aim1 ^ upv1).normalize()\nupv1 = crs1 ^ aim1\n\n"
          "m = api.MMatrix([\n    aim0.x, upv0.x, crs0.x, 0.,\n    aim0.y, upv0.y, crs0.y, 0.,\n"
          "    aim0.z, upv0.z, crs0.z, 0.,\n    0., 0., 0., 1.])\nm *= api.MMatrix([\n    aim1.x, aim1.y, aim1.z, 0.,\n"
          "    upv1.x, upv1.y, upv1.z, 0.,\n    crs1.x, crs1.y, crs1.z, 0.,\n    0., 0., 0., 1.])\n"
          "r = api.MEulerRotation([0., 0., 0.], IN[12])\nr.setValue(m)\nOUT[0] = r\n")
TIME = "OUT[0] = math.sin(IN[0] * 2.0) * IN[1]"
CHAIN_A = "from maya.api.OpenMaya import MVector as V\nOUT[0] = V(IN[0]) * 2.0"
CHAIN_B = "v = IN[0]\nOUT[0] = v.length()"
QUAT = "q = api.MQuaternion(IN[0], api.MVector(0, 0, 1))\nOUT[0] = q.asEulerRotation()"
BAD_CMDS = 'OUT[0] = cmds.getAttr("src.tx")'
BAD_MESH = "OUT[0] = IN[0]"


def ma_string(code: str) -> str:
    return '"%s"' % code.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def exprespy(name: str, code: str, n_inputs: int = 0, extra=()):
    out = ['createNode exprespy -n "%s";' % name, '\tsetAttr ".cd" -type "string" %s;' % ma_string(code)]
    out += list(extra)
    if n_inputs:
        out.append('\tsetAttr -s %d ".i";' % n_inputs)
    return out


def main():
    sys.path.insert(0, ROOT)
    lines = ['//Maya ASCII 2024 scene', '//Name: exprespy_sample.ma',
             'requires maya "2024";', 'requires "exprespy" "3.0.1.20220627";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "srcParent";',
             '\tsetAttr ".t" -type "double3" -3.6209579737102082 -3.1508840554772384 1.8125463956988654 ;',
             '\tsetAttr ".r" -type "double3" 15.490065918518804 -8.671869650868171 -6.277893053908751 ;',
             'createNode transform -n "src" -p "srcParent";',
             '\tsetAttr ".t" -type "double3" -3.2190597336731517 7.1788784606446043 0.14298142548498544 ;',
             '\tsetAttr ".rp" -type "double3" 0.5 0.25 0 ;',
             '\tsetAttr ".rpt" -type "double3" 0 0.1 0.2 ;',
             'createNode locator -n "srcShape" -p "src";',
             'createNode transform -n "upv" -p "srcParent";',
             '\tsetAttr ".t" -type "double3" 3.9174512548878866 3.6918112123901938 1.3617678712437644 ;',
             'createNode locator -n "upvShape" -p "upv";',
             'createNode transform -n "dstParent";',
             '\tsetAttr ".t" -type "double3" -1.1007985577832899 0 -1.8906596441557157 ;',
             '\tsetAttr ".r" -type "double3" 7.0126736345998344 1.3546184852554239 -7.0084559661012937 ;',
             'createNode joint -n "posCnst" -p "dstParent";',
             '\taddAttr -ci true -k true -sn "offsetTranslate" -ln "offsetTranslate" -at "double3" -nc 3;',
             '\taddAttr -ci true -k true -sn "offsetTranslateX" -ln "offsetTranslateX" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\taddAttr -ci true -k true -sn "offsetTranslateY" -ln "offsetTranslateY" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\taddAttr -ci true -k true -sn "offsetTranslateZ" -ln "offsetTranslateZ" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\tsetAttr -k on ".offsetTranslate" -type "double3" 0 0 -3 ;',
             'createNode joint -n "oriCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 0 4.7832902674640021 0 ;',
             '\tsetAttr ".ro" 2;',
             'createNode joint -n "aimCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 2 -1 0.5 ;',
             '\tsetAttr ".ro" 1;',
             'createNode joint -n "aimUpCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 1.0109907869246533 0.5560976078619172 3.4206445512302697 ;']
    for name in ("jT", "jC", "jQ", "jX", "jM"):
        lines.append('createNode joint -n "%s";' % name)
    lines += ['createNode transform -n "box";', 'createNode mesh -n "boxShape" -p "box";']
    lines += exprespy("posCnsEx", POS, 8)
    lines += exprespy("oriCnsEx", ORI, 5)
    lines += exprespy("aimCnsEx", AIM, 9)
    lines += exprespy("aimUpCnsEx", AIM_UP, 13)
    lines += exprespy("timeEx", TIME, 2, ['\tsetAttr ".i[1]" 3;'])
    lines += exprespy("chainA", CHAIN_A, 1)
    lines += exprespy("chainB", CHAIN_B, 1)
    lines += exprespy("quatEx", QUAT, 1)
    lines += exprespy("badCmds", BAD_CMDS)
    lines += exprespy("badMesh", BAD_MESH, 1)
    lines += ['createNode animCurveTL -n "src_translateX";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 -3 24 3;',
              'createNode animCurveTA -n "src_rotateZ";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
              'createNode animCurveTL -n "upv_translateY";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 4 24 -2;',
              'createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;',
              'select -ne :time1;', '\tsetAttr ".o" 1;',
              'connectAttr "src_translateX.o" "src.tx";',
              'connectAttr "src_rotateZ.o" "src.rz";',
              'connectAttr "upv_translateY.o" "upv.ty";',
              'connectAttr "posCnsEx.o[0]" "posCnst.t";',
              'connectAttr "oriCnsEx.o[0]" "oriCnst.r";',
              'connectAttr "aimCnsEx.o[0]" "aimCnst.r";',
              'connectAttr "aimUpCnsEx.o[0]" "aimUpCnst.r";']
    ins = {
        "posCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "posCnst.pim", "posCnst.rp", "posCnst.rpt",
                     "posCnst.offsetTranslate"],
        "oriCnsEx": ["src.r", "src.ro", "src.pm", "oriCnst.pim", "oriCnst.ro"],
        "aimCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "aimCnst.pim", "aimCnst.t", "aimCnst.rp", "aimCnst.rpt",
                     "aimCnst.ro"],
        "aimUpCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "upv.t", "upv.rp", "upv.rpt", "upv.pm", "aimUpCnst.t",
                       "aimUpCnst.rp", "aimUpCnst.rpt", "aimUpCnst.pm", "aimUpCnst.ro"],
    }
    for node, plugs in ins.items():
        for k, p in enumerate(plugs):
            lines.append('connectAttr "%s" "%s.i[%d]";' % (p, node, k))
    lines += ['connectAttr ":time1.o" "timeEx.i[0]";',
              'connectAttr "timeEx.o[0]" "jT.ty";',
              'connectAttr "src.t" "chainA.i[0]";',
              'connectAttr "chainA.o[0]" "chainB.i[0]";',
              'connectAttr "chainB.o[0]" "jC.tx";',
              'connectAttr "src.rz" "quatEx.i[0]";',
              'connectAttr "quatEx.o[0]" "jQ.r";',
              'connectAttr "badCmds.o[0]" "jX.tx";',
              'connectAttr "boxShape.o" "badMesh.i[0]";',
              'connectAttr "badMesh.o[0]" "jM.tx";',
              '// End of exprespy_sample.ma']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print("書き出しました: %s" % OUT_MA)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT_MA, animation=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s" % OUT_JSON)
    for w in scene.get("warnings", []) + (scene.get("animation") or {}).get("warnings", []):
        print("  警告: %s" % w)


if __name__ == "__main__":
    main()
