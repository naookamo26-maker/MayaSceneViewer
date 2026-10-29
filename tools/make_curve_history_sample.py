# -*- coding: utf-8 -*-
"""ヒストリのあるカーブ（形を作るノードから形を求める）の検証用サンプルを生成する。

  python tools/make_curve_history_sample.py   → samples/curve_history_sample.ma, samples/curve_history_sample.json

再生範囲 1〜24。カーブの形（.cc）は、どれもファイルに書かない（Maya がヒストリのあるカーブを保存したときと同じ）。
  * ringA: makeNurbCircle（法線 +Y・半径 2・3 次・8 分割）→ ringAShape.create
  * hexB: makeNurbCircle（法線は既定の +Z・1 次・6 分割・中心 (0, 0, 3)）→ hexBShape.create
  * spC_curve: 元の形 spC_curveShapeOrig（+Y にまっすぐ、長さ 8）を transformGeometry（移動 (20, 0, 0)）に通した形
    → spC_curveShape.create。spC_curve.tx にキー（1: 0 → 24: 5）。
    spC_0〜spC_4（+Y 方向、骨の長さ 2、根元 (20, 0, 0)）のスプライン IK のカーブ（rootOnCurve）
  * rbD: offsetCurve（ビューアでは計算できない）→ rbDShape.create（警告とリグの診断に出る）
  * wsE（移動 (0, 0, 7)）: 元の形 wsEShapeOrig のワールド空間の形（.worldSpace）を transformGeometry（単位行列）に通した形
    → wsEShape.create（形の CV は z = 7。表示では wsE の移動が加わって z = 14）
  * txF: makeTextCurves（文字のカーブ。ビューアでは計算できない）→ transformGeometry → txFShape.create
    （集計では、いちばん奥の makeTextCurves として数える）
  * リグとして動く transformGeometry（焼き付けずに評価する）:
    rgSrcShape（ワールドで (40, 0〜8, 10) のまっすぐなカーブ。終端の CV は rgLoc の worldPosition。rgLoc.tx にキー 40 → 44）
    のワールド空間の形 → rgTG（txf ← rgGrp.worldInverseMatrix。rgGrp は移動 (0, 0, 10)）→ rgGrp の下の rgCrvShape.create
    → rgCrvShape のワールド空間の形は rgSrcShape と同じ。spR_0〜spR_4（根元 (40, 0, 10)、+Y、骨の長さ 2）のスプライン IK のカーブ
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "curve_history_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "curve_history_sample.json")

STRAIGHT = '3 1 0 no 3 6 0 0 0 1 1 1 4 0 0 0 0 2.66666667 0 0 5.33333333 0 0 8 0'


def main():
    L = ['//Maya ASCII 2024 scene', '//Name: curve_history_sample.ma', 'requires maya "2024";',
         'currentUnit -l centimeter -a degree -t film;']
    A = L.append
    A('createNode transform -n "ringA";')
    A('createNode nurbsCurve -n "ringAShape" -p "ringA";')
    A('\tsetAttr -k off ".v";')
    A('createNode makeNurbCircle -n "ringA_circle";')
    A('\tsetAttr ".nr" -type "double3" 0 1 0 ;')
    A('\tsetAttr ".r" 2;')
    A('createNode transform -n "hexB";')
    A('createNode nurbsCurve -n "hexBShape" -p "hexB";')
    A('createNode makeNurbCircle -n "hexB_circle";')
    A('\tsetAttr ".c" -type "double3" 0 0 3 ;')
    A('\tsetAttr ".d" 1;')
    A('\tsetAttr ".s" 6;')
    # スプライン IK
    parent = None
    for i in range(5):
        A('createNode joint -n "spC_%d"%s;' % (i, ' -p "spC_%d"' % (i - 1) if i else ""))
        A('\tsetAttr ".t" -type "double3" %s ;' % ("20 0 0" if i == 0 else "0 2 0"))
    A('createNode ikEffector -n "spC_eff" -p "spC_3";')
    A('\tsetAttr ".t" -type "double3" 0 2 0 ;')
    A('\tsetAttr ".v" no;')
    A('createNode ikHandle -n "spC_ik";')
    A('\tsetAttr ".roc" yes;')
    A('createNode transform -n "spC_curve";')
    A('\tsetAttr ".it" no;')
    A('createNode nurbsCurve -n "spC_curveShape" -p "spC_curve";')
    A('createNode nurbsCurve -n "spC_curveShapeOrig" -p "spC_curve";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr ".io" yes;')
    A('\tsetAttr ".cc" -type "nurbsCurve" %s;' % STRAIGHT)
    A('createNode transformGeometry -n "spC_freeze";')
    A('\tsetAttr ".txf" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 20 0 0 1;')
    # 計算できない形を作るノード
    A('createNode transform -n "rbD";')
    A('createNode nurbsCurve -n "rbDShape" -p "rbD";')
    A('createNode nurbsCurve -n "rbDShapeOrig" -p "rbD";')
    A('\tsetAttr ".io" yes;')
    A('\tsetAttr ".cc" -type "nurbsCurve" %s;' % STRAIGHT)
    A('createNode offsetCurve -n "rbD_offset";')
    A('\tsetAttr ".d" 2;')
    A('createNode transform -n "wsE";')
    A('\tsetAttr ".t" -type "double3" 0 0 7 ;')
    A('createNode nurbsCurve -n "wsEShape" -p "wsE";')
    A('createNode nurbsCurve -n "wsEShapeOrig" -p "wsE";')
    A('\tsetAttr ".io" yes;')
    A('\tsetAttr ".cc" -type "nurbsCurve" %s;' % STRAIGHT)
    A('createNode transformGeometry -n "wsE_freeze";')
    A('createNode transform -n "txF";')
    A('createNode nurbsCurve -n "txFShape" -p "txF";')
    A('createNode makeTextCurves -n "txF_text";')
    A('createNode transformGeometry -n "txF_freeze";')
    A('createNode transform -n "rgGrp";')
    A('\tsetAttr ".t" -type "double3" 0 0 10 ;')
    A('createNode transform -n "rgCrv" -p "rgGrp";')
    A('createNode nurbsCurve -n "rgCrvShape" -p "rgCrv";')
    A('createNode transform -n "rgSrc";')
    A('createNode nurbsCurve -n "rgSrcShape" -p "rgSrc";')
    A('\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 40 0 10 40 2.66666667 10 40 5.33333333 10 40 8 10;')
    A('createNode transform -n "rgLoc";')
    A('\tsetAttr ".t" -type "double3" 40 8 10 ;')
    A('createNode locator -n "rgLocShape" -p "rgLoc";')
    A('createNode transformGeometry -n "rgTG";')
    for i in range(5):
        A('createNode joint -n "spR_%d"%s;' % (i, ' -p "spR_%d"' % (i - 1) if i else ""))
        A('\tsetAttr ".t" -type "double3" %s ;' % ("40 0 10" if i == 0 else "0 2 0"))
    A('createNode ikEffector -n "spR_eff" -p "spR_3";')
    A('\tsetAttr ".t" -type "double3" 0 2 0 ;')
    A('createNode ikHandle -n "spR_ik";')
    A('\tsetAttr ".roc" yes;')
    A('createNode animCurveTL -n "rgLoc_translateX";')
    A('\tsetAttr ".tan" 2;')
    A('\tsetAttr -s 2 ".ktv[0:1]"  1 40 24 44;')
    A('createNode animCurveTL -n "spC_curve_translateX";')
    A('\tsetAttr ".tan" 2;')
    A('\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 5;')
    A('createNode script -n "sceneConfigurationScriptNode";')
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";')
    A('\tsetAttr ".st" 6;')
    A('createNode ikSplineSolver -n "ikSplineSolver";')
    C = lambda a, b: A('connectAttr "%s" "%s";' % (a, b))  # noqa: E731
    C("ringA_circle.oc", "ringAShape.cr")
    C("hexB_circle.oc", "hexBShape.cr")
    C("spC_curveShapeOrig.l", "spC_freeze.ig")
    C("spC_freeze.og", "spC_curveShape.cr")
    C("spC_curve_translateX.o", "spC_curve.tx")
    C("spC_0.msg", "spC_ik.hsj")
    C("spC_eff.hp", "spC_ik.hee")
    C("ikSplineSolver.msg", "spC_ik.hsv")
    for ax in "xyz":
        C("spC_4.t%s" % ax, "spC_eff.t%s" % ax)
    C("spC_curveShape.ws", "spC_ik.ic")
    C("rbDShapeOrig.ws", "rbD_offset.ic")
    C("rbD_offset.oc[0]", "rbDShape.cr")
    C("wsEShapeOrig.ws", "wsE_freeze.ig")
    C("wsE_freeze.og", "wsEShape.cr")
    C("txF_text.oc[0]", "txF_freeze.ig")
    C("txF_freeze.og", "txFShape.cr")
    C("rgLoc_translateX.o", "rgLoc.tx")
    C("rgLocShape.wp", "rgSrcShape.cp[3]")
    C("rgSrcShape.ws", "rgTG.ig")
    C("rgGrp.wim", "rgTG.txf")
    C("rgTG.og", "rgCrvShape.cr")
    C("spR_0.msg", "spR_ik.hsj")
    C("spR_eff.hp", "spR_ik.hee")
    C("ikSplineSolver.msg", "spR_ik.hsv")
    for ax in "xyz":
        C("spR_4.t%s" % ax, "spR_eff.t%s" % ax)
    C("rgCrvShape.ws", "spR_ik.ic")
    A('// End of curve_history_sample.ma')
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT_MA, animation=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s / %s" % (OUT_MA, OUT_JSON))
    for w in scene.get("warnings", []):
        print("  警告: %s" % w)


if __name__ == "__main__":
    main()
