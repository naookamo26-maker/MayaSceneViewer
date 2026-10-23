# -*- coding: utf-8 -*-
"""値を求められないノードの推定（バインドポーズの形を保つ）の検証用サンプル .ma を生成する。

  python tools/make_fallback_sample.py      → samples/fallback_sample.ma, samples/fallback_sample.json

samples/sample_arm.ma（スキン付きの腕）に、次を足したもの:
  * rig_grp.ty にキー（0 → 5）
  * ctrl_grp の移動はエクスプレッションで決まる（未対応。ファイルに値がないので原点に集まる）
  * arm_ctrl（ctrl_grp の子）への parentConstraint で shoulder を動かす
    → arm_ctrl の位置が分からないので、shoulder は rig_grp からの相対をバインドポーズの形で推定する
  * elbow.rz はドリブンキー（animCurveUA。未対応）→ shoulder からの相対をバインドポーズの形で推定する
  * box.tx はエクスプレッション（バインドポーズの情報がないので推定できない）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "fallback_sample.ma")


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = text[:end], text[end:]
    body = body.replace("//Name: sample_arm.ma", "//Name: fallback_sample.ma")
    add = [
        'createNode transform -n "ctrl_grp";',
        'createNode transform -n "arm_ctrl" -p "ctrl_grp";',
        'createNode parentConstraint -n "shoulder_parentConstraint1" -p "shoulder";',
        '\tsetAttr -k on ".w0";',
        'createNode expression -n "grp_expr";',
        '\tsetAttr ".ixp" -type "string" ".O[0] = 10;";',
        'createNode expression -n "box_expr";',
        'createNode animCurveUA -n "elbow_drivenKey";',
        '\tsetAttr -s 2 ".ktv[0:1]"  0 0 1 90;',
        'createNode animCurveTL -n "rig_grp_translateY";',
        '\tsetAttr ".tan" 2;',
        '\tsetAttr -s 2 ".ktv[0:1]"  1 0 48 5;',
        'createNode script -n "sceneConfigurationScriptNode";',
        '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";',
        'connectAttr "grp_expr.out[0]" "ctrl_grp.tx";',
        'connectAttr "box_expr.out[0]" "box.tx";',
        'connectAttr "arm_ctrl.ty" "elbow_drivenKey.i";',
        'connectAttr "elbow_drivenKey.o" "elbow.rz";',
        'connectAttr "rig_grp_translateY.o" "rig_grp.ty";',
        'connectAttr "shoulder_parentConstraint1.w0" "shoulder_parentConstraint1.tg[0].tw";',
        'connectAttr "shoulder.pim" "shoulder_parentConstraint1.cpim";',
        'connectAttr "shoulder.ro" "shoulder_parentConstraint1.cro";',
        'connectAttr "shoulder.jo" "shoulder_parentConstraint1.cjo";',
    ]
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"), ("pm", "tpm")):
        add.append('connectAttr "arm_ctrl.%s" "shoulder_parentConstraint1.tg[0].%s";' % (src, dst))
    for ax in "xyz":
        add.append('connectAttr "shoulder_parentConstraint1.ct%s" "shoulder.t%s";' % (ax, ax))
        add.append('connectAttr "shoulder_parentConstraint1.cr%s" "shoulder.r%s";' % (ax, ax))
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(body + "\n".join(add) + "\n" + tail.replace("sample_arm.ma", "fallback_sample.ma"))
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "fallback_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: fallback_sample.ma / fallback_sample.json")


if __name__ == "__main__":
    main()
