# -*- coding: utf-8 -*-
"""自作ノードの定義（node_defs）の検証用サンプルを生成する。

  python tools/make_nodedef_sample.py
    → samples/nodedef_sample.ma（シーン）、samples/nodedef_sample_defs.json（テスト用の定義。ビューアには同梱しない）、
      samples/nodedef_sample.json（定義を使って書き出した共通 JSON）

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 10）、ctrl.rz にキー（1: 0 → 24: 90 度）。
  * ws1（weightedSum）: 数が不定の配列 input[]・weight[]。input[0] ← ctrl.tx（長い名前 input で接続）、
      input[1] = 2・input[3] = 1（番号が飛ぶ）、weight[0] = 0.5・weight[3] = 2（weight[1] は既定値 1）
      → jA.ty = 0.5 · tx + 2 + 2
  * mb1（matrixBlend）: 配列の compound target[i].targetMatrix（ロケーターの worldMatrix）・targetWeight。
      locA は (tx, 0, 0)（tx ← ctrl.tx）、locB は (4, 0, 0)、targetWeight[1] = 3
      → 出力 outTranslate（ベクトル）= 重み付きの平均 ((tx + 12) / 4, 0, 0) → jB.t、成分 otx → jC.tx
  * ad1（angleDouble）: 角度の入力 inAngle ← ctrl.rz、offset = 10 度（ファイルの値は度）→ jD.rx = 2 · rz + 10 度
  * wv1（waveNode）: 時間の属性 inTime（接続なし → いまのフレーム）→ jA.tz = sin(frame · 0.1) · 2
  * dv1（divider）: 1 / input（input は 0）→ 0 で割る誤り（リグの問題として報告）→ jE.tz
  * bk1（brokenNode）: 定義の計算に書き方の誤りがある → 使えない定義として警告し、評価できないノードとして扱う → jE.ty
  * 定義のプラグインの版は 1.0、シーンの requires は 1.1（版の違いの警告）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "nodedef_sample.ma")
OUT_DEFS = os.path.join(ROOT, "samples", "nodedef_sample_defs.json")
OUT_JSON = os.path.join(ROOT, "samples", "nodedef_sample.json")

DEFS = {
    "format": "maya-scene-viewer-node-definitions",
    "version": 1,
    "plugin": "nodeDefSamplePlugin",
    "pluginVersion": "1.0",
    "nodes": {
        "weightedSum": {
            "description": "入力の重み付きの和",
            "attributes": [
                {"name": "input", "short": "in", "type": "double", "array": True},
                {"name": "weight", "short": "w", "type": "double", "array": True, "default": 1},
                {"name": "output", "short": "o", "type": "double", "output": True},
            ],
            "compute": [
                "total = 0",
                "for i in indices(input):",
                "    total += input[i] * weight[i]",
                "output = total",
            ],
        },
        "matrixBlend": {
            "description": "ターゲットの位置の重み付きの平均",
            "attributes": [
                {"name": "target", "short": "tg", "type": "compound", "array": True, "children": [
                    {"name": "targetMatrix", "short": "tm", "type": "matrix"},
                    {"name": "targetWeight", "short": "tw", "type": "double", "default": 1}]},
                {"name": "outTranslate", "short": "ot", "type": "vector", "output": True},
            ],
            "compute": [
                "p = [0, 0, 0]",
                "wsum = 0",
                "for i in indices(target):",
                "    w = target[i].targetWeight",
                "    p = p + xform_point([0, 0, 0], target[i].targetMatrix) * w",
                "    wsum += w",
                "outTranslate = p / wsum if wsum > 0 else p",
            ],
        },
        "angleDouble": {
            "attributes": [
                {"name": "inAngle", "short": "ia", "type": "angle"},
                {"name": "offset", "short": "of", "type": "angle"},
                {"name": "outAngle", "short": "oa", "type": "angle", "output": True},
            ],
            "compute": "outAngle = inAngle * 2 + offset",
        },
        "waveNode": {
            "attributes": [
                {"name": "inTime", "short": "it", "type": "time"},
                {"name": "amplitude", "short": "amp", "type": "double", "default": 2},
                {"name": "output", "short": "o", "type": "double", "output": True},
            ],
            "compute": "output = sin(inTime * 0.1) * amplitude",
        },
        "divider": {
            "attributes": [
                {"name": "input", "short": "in", "type": "double"},
                {"name": "output", "short": "o", "type": "double", "output": True},
            ],
            "compute": "output = 1 / input",
        },
        "brokenNode": {
            "attributes": [
                {"name": "input", "short": "in", "type": "double"},
                {"name": "output", "short": "o", "type": "double", "output": True},
            ],
            "compute": ["x = input *", "output = x"],
        },
    },
}


def main():
    lines = ['//Maya ASCII 2024 scene', '//Name: nodedef_sample.ma',
             'requires maya "2024";', 'requires "nodeDefSamplePlugin" "1.1";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "ctrl";',
             'createNode transform -n "locA";', 'createNode locator -n "locAShape" -p "locA";',
             'createNode transform -n "locB";', '\tsetAttr ".t" -type "double3" 4 0 0 ;',
             'createNode locator -n "locBShape" -p "locB";']
    import math
    joints = {"jA": (0, 4, 2 * math.sin(0.1)), "jB": (3, 0, -5), "jC": (3, 0, -10), "jD": (0, 0, -15),
              "jE": (0, 0, -20)}
    for name, t in joints.items():
        lines += ['createNode joint -n "%s";' % name, '\tsetAttr ".t" -type "double3" %r %r %r ;' % t]
    lines += ['createNode weightedSum -n "ws1";',
              '\tsetAttr ".in[1]" 2;', '\tsetAttr ".in[3]" 1;',
              '\tsetAttr ".w[0]" 0.5;', '\tsetAttr ".w[3]" 2;',
              'createNode matrixBlend -n "mb1";', '\tsetAttr ".tg[1].tw" 3;',
              'createNode angleDouble -n "ad1";', '\tsetAttr ".of" 10;',
              'createNode waveNode -n "wv1";',
              'createNode divider -n "dv1";',
              'createNode brokenNode -n "bk1";',
              'createNode animCurveTL -n "ctrl_translateX";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 10;',
              'createNode animCurveTA -n "ctrl_rotateZ";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
              'createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;',
              'connectAttr "ctrl_translateX.o" "ctrl.tx";',
              'connectAttr "ctrl_rotateZ.o" "ctrl.rz";',
              'connectAttr "ctrl.tx" "ws1.input[0]";',          # 長い名前（読み込みで標準の別名 ip になる）
              'connectAttr "ws1.o" "jA.ty";',
              'connectAttr "ctrl.tx" "locA.tx";',
              'connectAttr "locA.wm" "mb1.tg[0].tm";',
              'connectAttr "locB.wm" "mb1.target[1].targetMatrix";',
              'connectAttr "mb1.ot" "jB.t";',
              'connectAttr "mb1.otx" "jC.tx";',
              'connectAttr "ctrl.rz" "ad1.ia";',
              'connectAttr "ad1.oa" "jD.rx";',
              'connectAttr "wv1.o" "jA.tz";',
              'connectAttr "dv1.o" "jE.tz";',
              'connectAttr "bk1.o" "jE.ty";',
              '// End of nodedef_sample.ma']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    with open(OUT_DEFS, "w", encoding="utf-8", newline="\n") as f:
        json.dump(DEFS, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("書き出しました: %s / %s" % (OUT_MA, OUT_DEFS))
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    from ma_viewer.node_defs import load_definitions
    scene = load_ma(OUT_MA, animation=True, node_defs=load_definitions([OUT_DEFS]))
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s" % OUT_JSON)


if __name__ == "__main__":
    main()
