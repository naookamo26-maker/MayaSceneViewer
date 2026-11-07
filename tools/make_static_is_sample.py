# -*- coding: utf-8 -*-
"""動かないジョイントが、親のスケールの打ち消し（.is）の元を持つリグのサンプルを生成する。

  python tools/make_static_is_sample.py   → samples/static_is_sample.ma, samples/static_is_sample.json

HumanIK の部位に割り当てていない途中のジョイントのように、自分は動かないが、親（打ち消しの元）は動き、
自分の行列は計算ノードやコンストレイントから読まれるジョイントがあっても、リグの専用の評価（rigCompiled.js）を
使えること（以前はこのノード 1 つでリグ全体を汎用の経路で評価していた）を web_src/tests/compiled.test.mjs で確かめる。
再生範囲 1〜24。
  * A（rx・tx にキー）→ B（動かない。A のスケールを .is で打ち消す。rz 10）→ C（ry にキー。B のスケールを .is で打ち消す）
  * B.wm → decomposeMatrix → D.t・D.r（D はジョイント）
  * E ← B への parentConstraint（オフセットなし）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "static_is_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "static_is_sample.json")


def main():
    L = ['//Maya ASCII 2024 scene', '//Name: static_is_sample.ma', 'requires maya "2024";',
         'currentUnit -l centimeter -a degree -t film;',
         'createNode joint -n "A";',
         'createNode joint -n "B" -p "A";',
         '\tsetAttr ".t" -type "double3" 2 0 0 ;',
         '\tsetAttr ".r" -type "double3" 0 0 10 ;',
         'createNode joint -n "C" -p "B";',
         '\tsetAttr ".t" -type "double3" 2 0 0 ;',
         'createNode joint -n "D";',
         'createNode decomposeMatrix -n "dm";',
         'createNode joint -n "E";',
         'createNode parentConstraint -n "E_parentConstraint1" -p "E";',
         '\taddAttr -dcb 0 -ci true -k true -sn "w0" -ln "BW0" -dv 1 -min 0 -at "double";',
         '\tsetAttr -k on ".w0";',
         'createNode animCurveTA -n "A_rotateX";',
         '\tsetAttr ".tan" 18;',
         '\tsetAttr -s 3 ".ktv[0:2]"  1 0 12 45 24 90;',
         'createNode animCurveTL -n "A_translateX";',
         '\tsetAttr ".tan" 18;',
         '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 3;',
         'createNode animCurveTA -n "C_rotateY";',
         '\tsetAttr ".tan" 18;',
         '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 45;',
         'createNode script -n "sceneConfigurationScriptNode";',
         '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
         '\tsetAttr ".st" 6;']
    C = ['connectAttr "A_rotateX.o" "A.rx";',
         'connectAttr "A_translateX.o" "A.tx";',
         'connectAttr "C_rotateY.o" "C.ry";',
         'connectAttr "A.s" "B.is";',
         'connectAttr "B.s" "C.is";',
         'connectAttr "B.wm" "dm.imat";',
         'connectAttr "dm.ot" "D.t";',
         'connectAttr "dm.or" "D.r";',
         'connectAttr "B.t" "E_parentConstraint1.tg[0].tt";',
         'connectAttr "B.rp" "E_parentConstraint1.tg[0].trp";',
         'connectAttr "B.rpt" "E_parentConstraint1.tg[0].trt";',
         'connectAttr "B.r" "E_parentConstraint1.tg[0].tr";',
         'connectAttr "B.ro" "E_parentConstraint1.tg[0].tro";',
         'connectAttr "B.s" "E_parentConstraint1.tg[0].ts";',
         'connectAttr "B.pm" "E_parentConstraint1.tg[0].tpm";',
         'connectAttr "B.jo" "E_parentConstraint1.tg[0].tjo";',
         'connectAttr "B.ssc" "E_parentConstraint1.tg[0].tsc";',
         'connectAttr "B.is" "E_parentConstraint1.tg[0].tis";',
         'connectAttr "E_parentConstraint1.w0" "E_parentConstraint1.tg[0].tw";',
         'connectAttr "E.ro" "E_parentConstraint1.cro";',
         'connectAttr "E.pim" "E_parentConstraint1.cpim";',
         'connectAttr "E.rp" "E_parentConstraint1.crp";',
         'connectAttr "E.rpt" "E_parentConstraint1.crt";',
         'connectAttr "E.jo" "E_parentConstraint1.cjo";',
         'connectAttr "E_parentConstraint1.ctx" "E.tx";',
         'connectAttr "E_parentConstraint1.cty" "E.ty";',
         'connectAttr "E_parentConstraint1.ctz" "E.tz";',
         'connectAttr "E_parentConstraint1.crx" "E.rx";',
         'connectAttr "E_parentConstraint1.cry" "E.ry";',
         'connectAttr "E_parentConstraint1.crz" "E.rz";']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of static_is_sample.ma']) + "\n")
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT_MA, animation=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s / %s" % (OUT_MA, OUT_JSON))
    for w in scene.get("warnings", []):
        print("  警告: %s" % w)
    for w in (scene.get("animation") or {}).get("warnings", []):
        print("  警告: %s" % w)


if __name__ == "__main__":
    main()
