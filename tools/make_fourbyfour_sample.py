# -*- coding: utf-8 -*-
"""fourByFourMatrix（16 個の数から行列を作る標準のノード）の検証用サンプルを生成する。

  python tools/make_fourbyfour_sample.py   → samples/fourbyfour_sample.ma, samples/fourbyfour_sample.json

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 10）、ctrl.ty にキー（1: 0 → 24: 4）。
  * fbf: 回転の部分は Z 30 度（i00 = cos・i01 = sin・i10 = -sin・i11 = cos。Maya の行の順）、移動は
    i30 ← ctrl.tx（短い名前で接続）、in31 ← ctrl.ty（長い名前で接続）、i32 = 5（ファイルの値）
    → output（長い名前）→ decomposeMatrix → jA.t = (tx, ty, 5)・jA.r = (0, 0, 30)
    → o（短い名前）→ jB.offsetParentMatrix（jB.t = (1, 0, 0)）→ jB のワールドの位置 = (cos30 + tx, sin30 + ty, 5)
  * fbf_id: 値も接続もない → 単位行列 → jC.offsetParentMatrix（jC.t = (0, 3, 0)）→ jC のワールドの位置 = (0, 3, 0)
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
