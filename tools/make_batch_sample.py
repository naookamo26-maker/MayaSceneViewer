# -*- coding: utf-8 -*-
"""スキンのないメッシュを材質ごとにまとめて描く（web_src/src/meshBatches.js）の検証用サンプルを生成する。

  python tools/make_batch_sample.py   → samples/batch_sample.ma, samples/batch_sample.json

  * 動かない箱 60 個（材質 matA・matB・matC を順に。UV あり）
  * UV のない箱 4 個（matA。属性が違うので別のまとまり）
  * 面ごとに材質が違う箱 1 個（f[0:2] = matA・f[3:5] = matB）
  * キーで動くグループ mover（tx にキー）の下の硬い箱 6 個（matB）
  * 非表示の箱 1 個（matC）・表示（.v）にキーがある箱 1 個（matC。フレーム 12 から非表示）
  再生範囲 1〜24
web_src/tests/meshBatches.test.mjs で、まとめたときに表示・行列・材質が元のメッシュと同じになることを確かめる。
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "batch_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "batch_sample.json")

CUBE_POS = [(-0.4, -0.4, 0.4), (0.4, -0.4, 0.4), (-0.4, 0.4, 0.4), (0.4, 0.4, 0.4),
            (-0.4, 0.4, -0.4), (0.4, 0.4, -0.4), (-0.4, -0.4, -0.4), (0.4, -0.4, -0.4)]
CUBE_FACES = [[0, 1, 3, 2], [2, 3, 5, 4], [4, 5, 7, 6], [6, 7, 1, 0], [1, 7, 5, 3], [6, 0, 2, 4]]


def fmt(v):
    return " ".join("%.6g" % x for x in v)


def main():
    sys.path.insert(0, HERE)
    from make_sample_ma import write_mesh_data
    L = ['//Maya ASCII 2024 scene', '//Name: batch_sample.ma', 'requires maya "2024";',
         'currentUnit -l centimeter -a degree -t film;']
    C = []
    for name, col in (("matA", (0.8, 0.3, 0.2)), ("matB", (0.2, 0.6, 0.3)), ("matC", (0.2, 0.3, 0.8))):
        L.append('createNode lambert -n "%s";' % name)
        L.append('\tsetAttr ".c" -type "float3" %s ;' % fmt(col))
        L.append('createNode shadingEngine -n "%sSG";' % name)
        L.append('\tsetAttr ".ihi" 0;')
        L.append('\tsetAttr ".ro" yes;')
        C.append('connectAttr "%s.oc" "%sSG.ss";' % (name, name))

    def cube(name, t, mat, parent=None, uv=True, hidden=False, faces_mat=None):
        L.append('createNode transform -n "%s"%s;' % (name, ' -p "%s"' % parent if parent else ""))
        L.append('\tsetAttr ".t" -type "double3" %s ;' % fmt(t))
        if hidden:
            L.append('\tsetAttr ".v" no;')
        L.append('createNode mesh -n "%sShape" -p "%s";' % (name, name))
        L.append('\tsetAttr -k off ".v";')
        if faces_mat:
            L.append('\tsetAttr -s 2 ".iog[0].og";')
            for gi, comp in enumerate(c for c, _ in faces_mat):
                L.append('\tsetAttr ".iog[0].og[%d].gcl" -type "componentList" 1 "%s";' % (gi, comp))
        write_mesh_data(L, CUBE_POS, CUBE_FACES, with_uv=uv)
        if faces_mat:
            for gi, (_, m) in enumerate(faces_mat):
                C.append('connectAttr "%sShape.iog.og[%d]" "%sSG.dsm" -na;' % (name, gi, m))
        else:
            C.append('connectAttr "%sShape.iog" "%sSG.dsm" -na;' % (name, mat))

    mats = ["matA", "matB", "matC"]
    for i in range(60):
        cube("box%d" % i, ((i % 10) * 1.2, (i // 10) * 1.2, 0), mats[i % 3])
    for i in range(4):
        cube("nouv%d" % i, (i * 1.2, -1.5, 0), "matA", uv=False)
    cube("multi", (6, -1.5, 0), None, faces_mat=[("f[0:2]", "matA"), ("f[3:5]", "matB")])
    L.append('createNode transform -n "mover";')
    L.append('createNode animCurveTL -n "mover_tx";')
    L.append('\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 6;')
    C.append('connectAttr "mover_tx.o" "mover.tx";')
    for i in range(6):
        cube("ride%d" % i, (i * 1.2, 0, 3), "matB", parent="mover")
    cube("hiddenBox", (0, 0, -3), "matC", hidden=True)
    cube("blinkBox", (1.2, 0, -3), "matC")
    L.append('createNode animCurveTU -n "blinkBox_v";')
    L.append('\tsetAttr -s 2 ".ktv[0:1]"  1 1 12 0;')
    L.append('\tsetAttr -s 2 ".kot[0:1]"  5 5;')
    C.append('connectAttr "blinkBox_v.o" "blinkBox.v";')
    L += ['createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";', '\tsetAttr ".st" 6;']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ["// End of batch_sample.ma"]) + "\n")
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
