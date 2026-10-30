# -*- coding: utf-8 -*-
"""place2dTexture（テクスチャの UV の繰り返し・オフセット）の検証用サンプルを生成する。

  python tools/make_place2d_sample.py
    → samples/textured_project/scenes/place2d_sample.ma（テクスチャはプロジェクトの sourceimages/props/quad_D.tga）

テスト（tests/test_place2d.py・web_src/tests/place2d.test.mjs）はこの .ma を読み込んで確かめる。
再生範囲 1〜24。ジョイント texJ にキー（tx: 1: 0 → 24: 1、ty: 1: 0 → 24: 2）。四角形 5 枚に、それぞれ別の
file ノード・place2dTexture のテクスチャを貼る:
  * q1（p1）: 静的な値。repeatUV (2, 3)・offset (0.25, 0.5)
  * q2（p2）: ジョイントで動かす。texJ.tx → offsetU（長い名前で接続）、texJ.ty → multiplyDivide（× 0.5）→ ofv、
      repeatV = 2 → offset = (tx, ty / 2)・repeat = (1, 2)
  * q3（p3）: exprespy で 2 つ組の offset をまとめて動かす。OUT[0] = [tx · 0.5, tx] → offset = (tx / 2, tx)
  * q4（p4）: キー（animCurveTU）で repeatU を動かす。1: 1 → 24: 4
  * q5（p5）: rotateUV = 30 と offset (0.1, 0)。rotateUV は反映しない（警告）。offset は反映する
"""
from __future__ import annotations

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "textured_project", "scenes", "place2d_sample.ma")


def quad(k: int, x: float):
    return ['createNode transform -n "q%d";' % k, '\tsetAttr ".t" -type "double3" %g 0 0 ;' % x,
            'createNode mesh -n "q%dShape" -p "q%d";' % (k, k),
            '\tsetAttr ".uvst[0].uvsn" -type "string" "map1";',
            '\tsetAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;',
            '\tsetAttr ".cuvs" -type "string" "map1";',
            '\tsetAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;',
            '\tsetAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;',
            '\tsetAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" ',
            '\t\tf 4 0 1 2 3',
            '\t\tmu 0 4 0 1 2 3;',
            'createNode lambert -n "m%d";' % k,
            'createNode shadingEngine -n "m%dSG";' % k, '\tsetAttr ".ro" yes;',
            'createNode file -n "f%d";' % k, '\tsetAttr ".ftn" -type "string" "sourceimages/props/quad_D.tga";',
            'createNode place2dTexture -n "p%d";' % k]


def links(k: int):
    # Maya が file ノードを作るときにつなぐ主な属性（uvCoord・repeatUV・offset・rotateUV など）
    out = ['connectAttr "p%d.o" "f%d.uv";' % (k, k), 'connectAttr "p%d.re" "f%d.re";' % (k, k),
           'connectAttr "p%d.of" "f%d.of";' % (k, k), 'connectAttr "p%d.ro" "f%d.ro";' % (k, k),
           'connectAttr "f%d.oc" "m%d.c";' % (k, k), 'connectAttr "m%d.oc" "m%dSG.ss";' % (k, k),
           'connectAttr "q%dShape.iog" "m%dSG.dsm" -na;' % (k, k)]
    return out


def main():
    lines = ['//Maya ASCII 2024 scene', '//Name: place2d_sample.ma',
             'requires maya "2024";', 'requires "exprespy" "3.0.1.20220627";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode joint -n "texJ";']
    for k in range(1, 6):
        lines += quad(k, 3 * (k - 1))
    lines += ['\tsetAttr ".ro" 30;', '\tsetAttr ".of" -type "float2" 0.1 0 ;']          # p5
    # p1: 静的な値（ブロックの外から setAttr する）
    lines += ['select -ne p1;', '\tsetAttr ".re" -type "float2" 2 3 ;', '\tsetAttr ".of" -type "float2" 0.25 0.5 ;',
              'select -ne p2;', '\tsetAttr ".rev" 2;',
              'createNode multiplyDivide -n "half";', '\tsetAttr ".i2" -type "float3" 0.5 0.5 0.5 ;',
              'createNode exprespy -n "uvEx";',
              '\tsetAttr ".cd" -type "string" "OUT[0] = [IN[0] * 0.5, IN[0]]";',
              'createNode animCurveTL -n "texJ_translateX";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 1;',
              'createNode animCurveTL -n "texJ_translateY";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 2;',
              'createNode animCurveTU -n "p4_repeatU";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 1 24 4;',
              'createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;']
    for k in range(1, 6):
        lines += links(k)
    lines += ['connectAttr "texJ_translateX.o" "texJ.tx";',
              'connectAttr "texJ_translateY.o" "texJ.ty";',
              'connectAttr "texJ.tx" "p2.offsetU";',
              'connectAttr "texJ.ty" "half.i1y";',
              'connectAttr "half.oy" "p2.ofv";',
              'connectAttr "texJ.tx" "uvEx.i[0]";',
              'connectAttr "uvEx.o[0]" "p3.of";',
              'connectAttr "p4_repeatU.o" "p4.reu";',
              '// End of place2d_sample.ma']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print("書き出しました: %s" % OUT_MA)


if __name__ == "__main__":
    main()
