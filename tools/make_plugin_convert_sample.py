# -*- coding: utf-8 -*-
"""プラグインの変換（convert-plugin）の検証用サンプルを生成する。

  python tools/make_plugin_convert_sample.py
    → samples/plugin_convert_defs.json（samples/plugins/*.py を変換した定義。ビューアには同梱しない）、
      samples/plugin_convert_sample.ma（変換した型のノードを使うシーン）、
      samples/plugin_convert_sample.json（その定義を使って書き出した共通 JSON。web_src/tests/pluginConvert.test.mjs が読む）

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 10）、ctrl.rz にキー（1: 0 → 24: 90 度）。期待する値はプラグインの compute と同じ式:
  * ws（weightedSumNode）: input[0] ← ctrl.tx、input[2] = 3、weight[0] = 0.5、weight[2] = 2 → jA.ty = 0.5 · tx + 6
  * ta（targetAverage）: target[0].targetMatrix ← locA.wm（(tx, 0, 0)）、target[1] ← locB.wm（(4, 0, 0)）、
      targetWeight[1] = 3 → outTranslate → jB.t = ((tx + 12) / 4, 0, 0)、成分 otX → jC.tx
  * an（angleScale）: inAngle ← ctrl.rz、factor は既定値 2、offsetAngle = 10 度 → jD.rx = 2 · rz + 10 度
  * am（aimMatrix2）: baseMatrix ← locA.wm、targetMatrix ← locC.wm（(0, 5, 10)）、upVector は既定値 (0, 1, 0)
      → outMatrix → decomposeMatrix → jF.t・jF.r
  * sa（stretchArray）: inValue[0] ← ctrl.tx、inValue[1] = 5、stretch = 3 → outValue[0] = 3 · tx → jE.tx、
      outValue[1] = -5 → jE.ty（出力の配列）
  * ls（legacySum、API 1.0）: values[0] ← ctrl.tx、values[1] = 2、gain = 0.5 → jG.tx = (tx + 2) · 0.5
  * vl（vectorLength、API 1.0）: inVector = (0, 3, 4)、成分 inVectorX（ivx）← ctrl.tx
      → length → jG.ty = √(tx² + 25)、normal → jH.t
  * mo（matrixOffset、API 1.0・型つきの行列の属性）: inMatrix ← locD.wm（移動 (tx, 2, 3)・回転 (30, 45, 60) 度）、
      offset = (1, 2, 3)、mode = 1（引く）→ outMatrix → decomposeMatrix → jI.t = (tx - 1, 0, 0)・jI.r は locD と同じ回転
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PLUGINS = [os.path.join(ROOT, "samples", "plugins", n) for n in ("sampleRigNodes.py", "sampleRigNodesApi1.py")]
OUT_DEFS = os.path.join(ROOT, "samples", "plugin_convert_defs.json")
OUT_MA = os.path.join(ROOT, "samples", "plugin_convert_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "plugin_convert_sample.json")


def main():
    sys.path.insert(0, ROOT)
    from ma_viewer.plugin_convert import convert_file
    nodes = {}
    for p in PLUGINS:
        data, _results, _problems = convert_file(p)
        nodes.update(data["nodes"])
    defs = {"format": "maya-scene-viewer-node-definitions", "version": 1, "plugin": "sampleRigNodes",
            "pluginVersion": "1.2", "nodes": nodes}
    with open(OUT_DEFS, "w", encoding="utf-8", newline="\n") as f:
        json.dump(defs, f, ensure_ascii=False, indent=2)
        f.write("\n")

    lines = ['//Maya ASCII 2024 scene', '//Name: plugin_convert_sample.ma',
             'requires maya "2024";', 'requires "sampleRigNodes" "1.2";', 'requires "sampleRigNodesApi1" "0.9";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "ctrl";',
             'createNode transform -n "locA";', 'createNode locator -n "locAShape" -p "locA";',
             'createNode transform -n "locB";', '\tsetAttr ".t" -type "double3" 4 0 0 ;',
             'createNode locator -n "locBShape" -p "locB";',
             'createNode transform -n "locC";', '\tsetAttr ".t" -type "double3" 0 5 10 ;',
             'createNode locator -n "locCShape" -p "locC";',
             'createNode transform -n "locD";', '\tsetAttr ".t" -type "double3" 0 2 3 ;',
             '\tsetAttr ".r" -type "double3" 30 45 60 ;',
             'createNode locator -n "locDShape" -p "locD";']
    for name in ("jA", "jB", "jC", "jD", "jE", "jF", "jG", "jH", "jI"):
        lines += ['createNode joint -n "%s";' % name]
    lines += ['createNode weightedSumNode -n "ws";',
              '\tsetAttr ".in[2]" 3;', '\tsetAttr ".w[0]" 0.5;', '\tsetAttr ".w[2]" 2;',
              'createNode targetAverage -n "ta";', '\tsetAttr ".tg[1].tw" 3;',
              'createNode angleScale -n "an";', '\tsetAttr ".oa" 10;',
              'createNode aimMatrix2 -n "am";',
              'createNode decomposeMatrix -n "dm";',
              'createNode stretchArray -n "sa";', '\tsetAttr ".iv[1]" 5;', '\tsetAttr ".st" 3;',
              'createNode legacySum -n "ls";', '\tsetAttr ".vals[1]" 2;', '\tsetAttr ".gn" 0.5;',
              'createNode vectorLength -n "vl";', '\tsetAttr ".iv" -type "double3" 0 3 4 ;',
              'createNode matrixOffset -n "mo";', '\tsetAttr ".of" -type "double3" 1 2 3 ;', '\tsetAttr ".md" 1;',
              'createNode decomposeMatrix -n "dm2";',
              'createNode animCurveTL -n "ctrl_translateX";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 10;',
              'createNode animCurveTA -n "ctrl_rotateZ";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
              'createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;',
              'connectAttr "ctrl_translateX.o" "ctrl.tx";',
              'connectAttr "ctrl_rotateZ.o" "ctrl.rz";',
              'connectAttr "ctrl.tx" "locA.tx";',
              'connectAttr "ctrl.tx" "ws.input[0]";',
              'connectAttr "ws.o" "jA.ty";',
              'connectAttr "locA.wm" "ta.tg[0].tm";',
              'connectAttr "locB.wm" "ta.target[1].targetMatrix";',
              'connectAttr "ta.ot" "jB.t";',
              'connectAttr "ta.otX" "jC.tx";',
              'connectAttr "ctrl.rz" "an.ia";',
              'connectAttr "an.out" "jD.rx";',
              'connectAttr "locA.wm" "am.bm";',
              'connectAttr "locC.wm" "am.tgm";',
              'connectAttr "am.om" "dm.imat";',
              'connectAttr "dm.ot" "jF.t";',
              'connectAttr "dm.or" "jF.r";',
              'connectAttr "ctrl.tx" "sa.iv[0]";',
              'connectAttr "sa.ov[0]" "jE.tx";',
              'connectAttr "sa.ov[1]" "jE.ty";',
              'connectAttr "ctrl.tx" "ls.vals[0]";',
              'connectAttr "ls.res" "jG.tx";',
              'connectAttr "ctrl.tx" "vl.ivx";',
              'connectAttr "vl.len" "jG.ty";',
              'connectAttr "vl.nrm" "jH.t";',
              'connectAttr "ctrl.tx" "locD.tx";',
              'connectAttr "locD.wm" "mo.im";',
              'connectAttr "mo.om" "dm2.imat";',
              'connectAttr "dm2.ot" "jI.t";',
              'connectAttr "dm2.or" "jI.r";',
              '// End of plugin_convert_sample.ma']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print("書き出しました: %s / %s" % (OUT_DEFS, OUT_MA))
    from ma_viewer.extract_ma import load_ma
    from ma_viewer.node_defs import load_definitions
    scene = load_ma(OUT_MA, animation=True, node_defs=load_definitions([OUT_DEFS]))
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s" % OUT_JSON)
    for w in scene.get("warnings", []):
        print("  警告: %s" % w)


if __name__ == "__main__":
    main()
