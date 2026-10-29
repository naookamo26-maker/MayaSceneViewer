# -*- coding: utf-8 -*-
"""transform・joint の、移動・回転・スケール以外のローカル行列の属性への接続と、移動・回転・スケールの制限の検証用サンプルを生成する。

  python tools/make_dag_attrs_sample.py   → samples/dag_attrs_sample.ma, samples/dag_attrs_sample.json

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 4）、ctrl.rz にキー（1: 0 → 24: 90）。
  * piv（transform。rz = 90）: rotatePivotX ← ctrl.tx。子 pivC（1, 0, 0）はピボットのまわりに回る
  * lim（joint）: tx ← ctrl.tx（最大 2）、rz ← ctrl.rz（最大 45 度）。子 limC（1, 0, 0）
  * limS（transform）: ファイルの rx = 90 が最大 30 度を超えている（静的な行列も制限に収める）。子 limSC（0, 1, 0）
  * jj（joint）: jointOrientZ ← ctrl.rz。子 jk（1, 0, 0）
  * raJ（joint）: rotateAxisZ ← ctrl.rz。子 raC（1, 0, 0）
  * roT（joint。r = (90, 0, 90)）: rotateOrder ← カーブ（1: 0 = xyz → 24: 2 = zxy）。子 roC（1, 0, 0）
  * shT（transform）: shearXY ← ctrl.tx。子 shC（0, 1, 0）
  * rd（joint）: t ← piv.rp（ピボットの値を読む）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "dag_attrs_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "dag_attrs_sample.json")


def main():
    L = ['//Maya ASCII 2027 scene', '//Name: dag_attrs_sample.ma', 'requires maya "2027";',
         'currentUnit -l centimeter -a degree -t film;',
         'createNode transform -n "ctrl";']
    C = []

    def con(a, b):
        C.append('connectAttr "%s" "%s";' % (a, b))

    def node(t, n, parent=None, *attrs):
        L.append('createNode %s -n "%s"%s;' % (t, n, ' -p "%s"' % parent if parent else ""))
        for a in attrs:
            L.append('\tsetAttr %s;' % a)

    def child(n, parent, t):
        node("joint", n, parent, '".t" -type "double3" %s ' % t)

    node("transform", "piv", None, '".r" -type "double3" 0 0 90 ')
    child("pivC", "piv", "1 0 0")
    con("ctrl.tx", "piv.rpx")
    node("joint", "lim", None, '".mxtl" -type "double3" 2 1 1 ', '".xtxe" yes', '".mxrl" -type "double3" 45 45 45 ',
         '".xrze" yes')
    child("limC", "lim", "1 0 0")
    con("ctrl.tx", "lim.tx"); con("ctrl.rz", "lim.rz")
    node("transform", "limS", None, '".r" -type "double3" 90 0 0 ', '".xrxl" 30', '".xrxe" yes')
    child("limSC", "limS", "0 1 0")
    node("joint", "jj")
    child("jk", "jj", "1 0 0")
    con("ctrl.rz", "jj.joz")
    node("joint", "raJ")
    child("raC", "raJ", "1 0 0")
    con("ctrl.rz", "raJ.raz")
    node("joint", "roT", None, '".r" -type "double3" 90 0 90 ')
    child("roC", "roT", "1 0 0")
    node("transform", "shT")
    child("shC", "shT", "0 1 0")
    con("ctrl.tx", "shT.shxy")
    node("joint", "rd")
    con("piv.rp", "rd.t")

    L += ['createNode animCurveTL -n "ctrl_translateX";', '\tsetAttr ".tan" 2;', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 4;',
          'createNode animCurveTA -n "ctrl_rotateZ";', '\tsetAttr ".tan" 2;', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
          'createNode animCurveTU -n "roT_rotateOrder";', '\tsetAttr ".tan" 2;', '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 2;',
          'createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
          '\tsetAttr ".st" 6;']
    C = ['connectAttr "ctrl_translateX.o" "ctrl.tx";', 'connectAttr "ctrl_rotateZ.o" "ctrl.rz";',
         'connectAttr "roT_rotateOrder.o" "roT.ro";'] + C
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of dag_attrs_sample.ma']) + "\n")
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
