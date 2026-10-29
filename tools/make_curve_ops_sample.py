# -*- coding: utf-8 -*-
"""カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）と nearestPointOnCurve の検証用サンプルを生成する。

  python tools/make_curve_ops_sample.py   → samples/curve_ops_sample.ma, samples/curve_ops_sample.json

再生範囲 1〜24。元のカーブ src（3 次・4 スパン・パラメータ 0〜4 の波形。形はファイルにある）。
動かないヒストリ（読み込みで形を焼き付ける。カーブの形 .cc はファイルに書かない。Maya が保存したときと同じ）:
  * rb: src → rebuildCurve（8 スパン・3 次・パラメータ 0〜1（keepRange 0）・端は多重ノット（endKnots 1））→ rbShape
  * rv: src → reverseCurve → rvShape
  * dt: src → detachCurve（パラメータ 1.5・2.5 で分割。出力 0 と 2 を使う。出力 1 は keep で捨てる）→ dt0Shape・dt2Shape
  * sc: src → subCurve（パラメータ 1〜3）→ scShape
  * スプライン IK: sp_0〜sp_4（骨の長さ 1）のカーブは rbShape（rootOnCurve）
動くヒストリ（ビューアがリグとして毎フレーム評価する）:
  * dyn: dynSrc（src と同じ形。終端の CV ← loc の worldPosition。loc.ty にキー 0 → 3）→ rebuildCurve（6 スパン・keepRange 1）→ dynShape
nearestPointOnCurve:
  * npc: src のワールド空間の形と、probe の位置（probe.tx にキー 0 → 6、ty = 3）→ nj.t（いちばん近い点）・nj2.tx（パラメータ）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "curve_ops_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "curve_ops_sample.json")

# 3 次・4 スパン（CV 7 個）・パラメータ 0〜4、端は多重ノット
SRC_CVS = [(0, 0, 0), (1, 2, 0), (2, -1, 1), (3, 3, 0), (4, 0, -1), (5, 2, 0), (6, 0, 0)]
SRC_CC = "3 4 0 no 3 9 0 0 0 1 2 3 4 4 4 7 " + " ".join("%g %g %g" % p for p in SRC_CVS)


def main():
    L = ['//Maya ASCII 2027 scene', '//Name: curve_ops_sample.ma', 'requires maya "2027";',
         'currentUnit -l centimeter -a degree -t film;',
         'createNode transform -n "src";', 'createNode nurbsCurve -n "srcShape" -p "src";',
         '\tsetAttr ".cc" -type "nurbsCurve" %s;' % SRC_CC]
    C = []

    def con(a, b):
        C.append('connectAttr "%s" "%s";' % (a, b))

    def curve(name):
        L.append('createNode transform -n "%s";' % name)
        L.append('createNode nurbsCurve -n "%sShape" -p "%s";' % (name, name))

    def node(t, n, *attrs):
        L.append('createNode %s -n "%s";' % (t, n))
        for a in attrs:
            L.append('\tsetAttr %s;' % a)

    curve("rb")
    node("rebuildCurve", "rb_rebuild", '".s" 8', '".kr" 0', '".end" 1')
    con("srcShape.l", "rb_rebuild.ic"); con("rb_rebuild.oc", "rbShape.cr")
    curve("rv")
    node("reverseCurve", "rv_reverse")
    con("srcShape.l", "rv_reverse.ic"); con("rv_reverse.oc", "rvShape.cr")
    curve("dt0"); curve("dt2")
    node("detachCurve", "dt_detach", '-s 2 ".p[0:1]" 1.5 2.5', '-s 3 ".k[0:2]" yes no yes')
    con("srcShape.l", "dt_detach.ic"); con("dt_detach.oc[0]", "dt0Shape.cr"); con("dt_detach.oc[2]", "dt2Shape.cr")
    curve("sc")
    node("subCurve", "sc_sub", '".min" 1', '".max" 3')
    con("srcShape.l", "sc_sub.ic"); con("sc_sub.oc", "scShape.cr")

    # スプライン IK（作り直したカーブに沿わせる）
    for i in range(5):
        L.append('createNode joint -n "sp_%d"%s;' % (i, ' -p "sp_%d"' % (i - 1) if i else ""))
        L.append('\tsetAttr ".t" -type "double3" %s ;' % ("0 0 0" if i == 0 else "1 0 0"))
    L += ['createNode ikEffector -n "sp_eff" -p "sp_3";', '\tsetAttr ".t" -type "double3" 1 0 0 ;',
          'createNode ikHandle -n "sp_ik";', '\tsetAttr ".roc" yes;', 'createNode ikSplineSolver -n "ikSplineSolver";']
    con("sp_0.msg", "sp_ik.hsj"); con("sp_eff.hp", "sp_ik.hee"); con("ikSplineSolver.msg", "sp_ik.hsv")
    for ax in "xyz":
        con("sp_4.t%s" % ax, "sp_eff.t%s" % ax)
    con("rbShape.ws", "sp_ik.ic")

    # 動くヒストリ: 終端の CV がロケーターで動くカーブを作り直す
    L += ['createNode transform -n "dynSrc";', 'createNode nurbsCurve -n "dynSrcShape" -p "dynSrc";',
          '\tsetAttr ".cc" -type "nurbsCurve" %s;' % SRC_CC,
          'createNode transform -n "loc";', '\tsetAttr ".t" -type "double3" 6 0 0 ;',
          'createNode locator -n "locShape" -p "loc";']
    curve("dyn")
    node("rebuildCurve", "dyn_rebuild", '".s" 6', '".end" 1')
    con("locShape.wp", "dynSrcShape.cp[6]")
    con("dynSrcShape.ws", "dyn_rebuild.ic"); con("dyn_rebuild.oc", "dynShape.cr")

    # nearestPointOnCurve
    L += ['createNode transform -n "probe";', '\tsetAttr ".ty" 3;',
          'createNode joint -n "nj";', 'createNode joint -n "nj2";']
    node("nearestPointOnCurve", "npc")
    con("srcShape.ws", "npc.ic"); con("probe.t", "npc.ip"); con("npc.p", "nj.t"); con("npc.pr", "nj2.tx")

    L += ['createNode animCurveTL -n "loc_translateY";', '\tsetAttr ".tan" 2;', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 3;',
          'createNode animCurveTL -n "probe_translateX";', '\tsetAttr ".tan" 2;', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 6;',
          'createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
          '\tsetAttr ".st" 6;']
    C = ['connectAttr "loc_translateY.o" "loc.ty";', 'connectAttr "probe_translateX.o" "probe.tx";'] + C
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of curve_ops_sample.ma']) + "\n")
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
