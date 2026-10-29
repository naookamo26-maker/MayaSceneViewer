# -*- coding: utf-8 -*-
"""コンストレイントの空間と行列の分け方の検証用サンプルを生成する（Maya が保存した実物のリグとの照合で確かめた解釈）。

  python tools/make_constraint_space_sample.py   → samples/constraint_space_sample.ma, samples/constraint_space_sample.json

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 4）、ctrl.rz にキー（1: 0 → 24: 90）。
  * opmJ（offsetParentMatrix で (5, 0, 0) 移動）: tgtA（ctrl の子。移動 (10, 2, 0)）への pointConstraint
      → opmJ のワールドの位置 = tgtA のワールドの位置（親の空間 = 親のワールド行列 · offsetParentMatrix）
    opmJ.m → decomposeMatrix → rM.t（opm を含まないローカル）、opmJ.pm → rP.t = (5, 0, 0)、opmJ.im → rI.t
  * sC: sA（スケール 1）と sB（スケール 4）への scaleConstraint（ウェイト 1・1）→ 加重幾何平均で sC.s = (2, 2, 2)
  * raJ（rotateAxis (0, 0, 30)）: ctrl への orientConstraint → raJ.r = (0, 0, ctrl.rz)（コンストレイントは rotateAxis を使わない）
  * restJ: ウェイト 0 の parentConstraint（enableRestPosition あり）→ restJ.t = .rst (1, 2, 3)・restJ.r = .rsrr (0, 0, 45)
  * eJ: composeMatrix（回転 (180, 30, 180)）→ decomposeMatrix → eJ.r = (0, 150, 0)（Maya の角度の選び方）
  * lrJ: 回転 0 の lrT への parentConstraint（.lr = (0, 360, 0)）→ lrJ.r = (0, 360, 0)（前回の値に近い角度）
  * e0 → e1（長さ 2）: ジョイント 2 つの回転プレーン IK（ハンドルは ctrl の子。移動 (0, 3, 0)）→ e1 はハンドルの方を向く
  * pvJ: pvT（transform。rotatePivot (1, 0, 0)・scalePivot (0, 1, 0)・スケール 2）への pointConstraint
      → pvJ の位置 = (translate + rotatePivot + rotatePivotTranslate) · 親 = (1, 0, 0)
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "constraint_space_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "constraint_space_sample.json")


def main():
    L = ['//Maya ASCII 2027 scene', '//Name: constraint_space_sample.ma', 'requires maya "2027";',
         'currentUnit -l centimeter -a degree -t film;']
    C = []

    def A(s):
        L.append(s)

    def con(a, b):
        C.append('connectAttr "%s" "%s";' % (a, b))

    def node(t, n, parent=None, *attrs):
        A('createNode %s -n "%s"%s;' % (t, n, ' -p "%s"' % parent if parent else ""))
        for a in attrs:
            A('\tsetAttr %s;' % a)

    def constraint(kind, name, driven, targets, *attrs):
        A('createNode %s -n "%s" -p "%s";' % (kind, name, driven))
        for i, (tname, _w) in enumerate(targets):
            A('\taddAttr -dcb 0 -ci true -k true -sn "w%d" -ln "%sW%d" -dv 1 -min 0 -at "double";' % (i, tname, i))
        for i, (_tname, w) in enumerate(targets):
            A('\tsetAttr -k on ".w%d"%s;' % (i, "" if w is None else " %g" % w))
        for a in attrs:
            A('\tsetAttr %s;' % a)
        for i, (_tname, _w) in enumerate(targets):
            con("%s.w%d" % (name, i), "%s.tg[%d].tw" % (name, i))
        con(driven + ".pim", name + ".cpim")

    def target(name, i, tname, plugs):
        for src, dst in plugs:
            con("%s.%s" % (tname, src), "%s.tg[%d].%s" % (name, i, dst))

    POINT = (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm"))
    ORIENT = (("r", "tr"), ("ro", "tro"), ("pm", "tpm"), ("jo", "tjo"))
    PARENT = (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"), ("pm", "tpm"),
              ("jo", "tjo"), ("ssc", "tsc"), ("is", "tis"))

    node("transform", "ctrl")
    node("joint", "tgtA", "ctrl", '".t" -type "double3" 10 2 0 ')

    # offsetParentMatrix のある、pointConstraint で動くジョイントと、その行列のプラグ
    node("joint", "opmJ", None, '".opm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 5 0 0 1')
    constraint("pointConstraint", "opmJ_pc", "opmJ", [("tgtA", None)])
    target("opmJ_pc", 0, "tgtA", POINT)
    for a in "xyz":
        con("opmJ_pc.ct%s" % a, "opmJ.t%s" % a)
    con("opmJ.rp", "opmJ_pc.crp")
    con("opmJ.rpt", "opmJ_pc.crt")
    for j, plug in (("rM", "m"), ("rP", "pm"), ("rI", "im")):
        node("joint", j)
        node("decomposeMatrix", "dm_" + j)
        con("opmJ." + plug, "dm_%s.imat" % j)
        con("dm_%s.ot" % j, j + ".t")

    # scaleConstraint（加重幾何平均）
    node("joint", "sA")
    node("joint", "sB", None, '".s" -type "double3" 4 4 4 ')
    node("joint", "sC")
    constraint("scaleConstraint", "sC_sc", "sC", [("sA", None), ("sB", None)])
    for i, t in enumerate(("sA", "sB")):
        target("sC_sc", i, t, (("s", "ts"), ("pm", "tpm")))
    for a in "xyz":
        con("sC_sc.cs%s" % a, "sC.s%s" % a)

    # rotateAxis のあるジョイントの orientConstraint
    node("joint", "raJ", None, '".ra" -type "double3" 0 0 30 ')
    constraint("orientConstraint", "raJ_oc", "raJ", [("ctrl", None)])
    target("raJ_oc", 0, "ctrl", ORIENT)
    for a in "xyz":
        con("raJ_oc.cr%s" % a, "raJ.r%s" % a)
    con("raJ.ro", "raJ_oc.cro")
    con("raJ.jo", "raJ_oc.cjo")

    # ウェイト 0 の parentConstraint（enableRestPosition）
    node("joint", "restJ")
    constraint("parentConstraint", "restJ_pc", "restJ", [("tgtA", 0)], '".erp" yes', '".rst" -type "double3" 1 2 3 ',
               '".rsrr" -type "double3" 0 0 45 ')
    target("restJ_pc", 0, "tgtA", PARENT)
    for a in "xyz":
        con("restJ_pc.ct%s" % a, "restJ.t%s" % a)
        con("restJ_pc.cr%s" % a, "restJ.r%s" % a)
    con("restJ.ro", "restJ_pc.cro")
    con("restJ.rp", "restJ_pc.crp")
    con("restJ.rpt", "restJ_pc.crt")
    con("restJ.jo", "restJ_pc.cjo")

    # 角度の選び方（行列 → 回転）
    node("joint", "eJ")
    node("composeMatrix", "cm_e", None, '".ir" -type "double3" 180 30 180 ')
    node("decomposeMatrix", "dm_e")
    con("cm_e.omat", "dm_e.imat")
    con("dm_e.or", "eJ.r")

    # parentConstraint は前回の値（.lr）に近い角度を選ぶ
    node("joint", "lrT", None, '".t" -type "double3" 0 -3 0 ')
    node("joint", "lrJ", None, '".t" -type "double3" 0 -3 0 ')
    constraint("parentConstraint", "lrJ_pc", "lrJ", [("lrT", None)], '".lr" -type "double3" 0 360 0 ')
    target("lrJ_pc", 0, "lrT", PARENT)
    for a in "xyz":
        con("lrJ_pc.ct%s" % a, "lrJ.t%s" % a)
        con("lrJ_pc.cr%s" % a, "lrJ.r%s" % a)
    con("lrJ.ro", "lrJ_pc.cro")
    con("lrJ.rp", "lrJ_pc.crp")
    con("lrJ.rpt", "lrJ_pc.crt")
    con("lrJ.jo", "lrJ_pc.cjo")

    # ジョイント 2 つの回転プレーン IK
    node("joint", "e0")
    node("joint", "e1", "e0", '".t" -type "double3" 2 0 0 ')
    node("ikEffector", "e_eff", "e0", '".t" -type "double3" 2 0 0 ')
    node("ikHandle", "e_ik", "ctrl", '".t" -type "double3" 0 3 0 ')
    node("ikRPsolver", "ikRPsolver")
    con("e0.msg", "e_ik.hsj")
    con("e_eff.hp", "e_ik.hee")
    con("ikRPsolver.msg", "e_ik.hsv")
    for a in "xyz":
        con("e1.t%s" % a, "e_eff.t%s" % a)

    # ターゲットの回転ピボットの位置（translate + rotatePivot + rotatePivotTranslate）· 親
    node("transform", "pvT", None, '".rp" -type "double3" 1 0 0 ', '".sp" -type "double3" 0 1 0 ',
         '".s" -type "double3" 2 2 2 ')
    node("joint", "pvTC", "pvT")
    node("joint", "pvJ")
    constraint("pointConstraint", "pvJ_pc", "pvJ", [("pvT", None)])
    target("pvJ_pc", 0, "pvT", POINT)
    for a in "xyz":
        con("pvJ_pc.ct%s" % a, "pvJ.t%s" % a)
    con("pvJ.rp", "pvJ_pc.crp")
    con("pvJ.rpt", "pvJ_pc.crt")

    A('createNode animCurveTL -n "ctrl_translateX";')
    A('\tsetAttr ".tan" 2;')
    A('\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 4;')
    A('createNode animCurveTA -n "ctrl_rotateZ";')
    A('\tsetAttr ".tan" 2;')
    A('\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;')
    A('createNode script -n "sceneConfigurationScriptNode";')
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";')
    A('\tsetAttr ".st" 6;')
    C = ['connectAttr "ctrl_translateX.o" "ctrl.tx";', 'connectAttr "ctrl_rotateZ.o" "ctrl.rz";'] + C
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of constraint_space_sample.ma']) + "\n")
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
