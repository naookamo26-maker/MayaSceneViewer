# -*- coding: utf-8 -*-
"""fourByFourMatrix（16 個の数から行列を作る標準のノード）の検証用サンプルを生成する。

  python tools/make_fourbyfour_sample.py   → samples/fourbyfour_sample.ma, samples/fourbyfour_sample.json

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 10）、ctrl.ty にキー（1: 0 → 24: 4）。
  * fbf: 回転の部分は Z 30 度（i00 = cos・i01 = sin・i10 = -sin・i11 = cos。Maya の行の順）、移動は
    i30 ← ctrl.tx（短い名前で接続）、in31 ← ctrl.ty（長い名前で接続）、i32 = 5（ファイルの値）
    → output（長い名前）→ decomposeMatrix → jA.t = (tx, ty, 5)・jA.r = (0, 0, 30)
    → o（短い名前）→ jB.offsetParentMatrix（jB.t = (1, 0, 0)）→ jB のワールドの位置 = (cos30 + tx, sin30 + ty, 5)
  * fbf_id: 値も接続もない → 単位行列 → jC.offsetParentMatrix（jC.t = (0, 3, 0)）→ jC のワールドの位置 = (0, 3, 0)
  * 鏡に映した行列（行列式が負）の decomposeMatrix。Maya は反転を 3 軸のスケールに入れる:
      fbf_mz: diag(1, 1, -1)（移動 i30 ← ctrl.tx）→ dm_mz → jD.r = (0, 0, 180)（dm_mz.os = (-1, -1, -1)）
      fbf_mr: 行 X = (0, 1, 0)・Y = (-1, 0, 0)・Z = (0, 0, -1) → dm_mr → jE.r = (0, 0, -90)（dm_mr.os = (-1, -1, -1)）
  * せん断: composeMatrix cm_sh（移動 (1, 2, 3)・回転 (20, -35, 60)・スケール (0.5, 2, 1.5)・せん断 (0.4, -0.3, 0.2)。
    移動 X ← ctrl.tx）→ dm_sh（decomposeMatrix）→ jF.r = (20, -35, 60)・dm_sh.os・dm_sh.osh は元の値に戻る
"""
from __future__ import annotations

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "fourbyfour_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "fourbyfour_sample.json")


def main():
    c, s = math.cos(math.radians(30)), math.sin(math.radians(30))
    lines = ['//Maya ASCII 2024 scene', '//Name: fourbyfour_sample.ma', 'requires maya "2024";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "ctrl";',
             'createNode joint -n "jA";',
             'createNode joint -n "jB";', '\tsetAttr ".t" -type "double3" 1 0 0 ;',
             'createNode joint -n "jC";', '\tsetAttr ".t" -type "double3" 0 3 0 ;',
             'createNode fourByFourMatrix -n "fbf";',
             '\tsetAttr ".i00" %r;' % c, '\tsetAttr ".i01" %r;' % s,
             '\tsetAttr ".i10" %r;' % -s, '\tsetAttr ".i11" %r;' % c, '\tsetAttr ".i32" 5;',
             'createNode fourByFourMatrix -n "fbf_id";',
             'createNode joint -n "jD";', 'createNode joint -n "jE";',
             'createNode fourByFourMatrix -n "fbf_mz";', '\tsetAttr ".i22" -1;',
             'createNode fourByFourMatrix -n "fbf_mr";', '\tsetAttr ".i00" 0;', '\tsetAttr ".i01" 1;',
             '\tsetAttr ".i10" -1;', '\tsetAttr ".i11" 0;', '\tsetAttr ".i22" -1;',
             'createNode decomposeMatrix -n "dm_mz";', 'createNode decomposeMatrix -n "dm_mr";',
             'createNode joint -n "jF";',
             'createNode composeMatrix -n "cm_sh";', '\tsetAttr ".it" -type "double3" 1 2 3 ;',
             '\tsetAttr ".ir" -type "double3" 20 -35 60 ;', '\tsetAttr ".is" -type "double3" 0.5 2 1.5 ;',
             '\tsetAttr ".ish" -type "double3" 0.4 -0.3 0.2 ;',
             'createNode decomposeMatrix -n "dm_sh";',
             'createNode decomposeMatrix -n "dm";',
             'createNode animCurveTL -n "ctrl_translateX";', '\tsetAttr ".tan" 2;',
             '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 10;',
             'createNode animCurveTL -n "ctrl_translateY";', '\tsetAttr ".tan" 2;',
             '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 4;',
             'createNode script -n "sceneConfigurationScriptNode";',
             '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
             '\tsetAttr ".st" 6;',
             'connectAttr "ctrl_translateX.o" "ctrl.tx";',
             'connectAttr "ctrl_translateY.o" "ctrl.ty";',
             'connectAttr "ctrl.tx" "fbf.i30";',
             'connectAttr "ctrl.ty" "fbf.in31";',
             'connectAttr "fbf.output" "dm.imat";',
             'connectAttr "dm.ot" "jA.t";',
             'connectAttr "dm.or" "jA.r";',
             'connectAttr "fbf.o" "jB.opm";',
             'connectAttr "fbf_id.o" "jC.opm";',
             'connectAttr "ctrl.tx" "fbf_mz.i30";',
             'connectAttr "fbf_mz.o" "dm_mz.imat";',
             'connectAttr "dm_mz.or" "jD.r";',
             'connectAttr "ctrl.tx" "fbf_mr.i30";',
             'connectAttr "fbf_mr.o" "dm_mr.imat";',
             'connectAttr "dm_mr.or" "jE.r";',
             'connectAttr "ctrl.tx" "cm_sh.itx";',
             'connectAttr "cm_sh.omat" "dm_sh.imat";',
             'connectAttr "dm_sh.or" "jF.r";',
             '// End of fourbyfour_sample.ma']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
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
