# -*- coding: utf-8 -*-
"""骨ごとに伸び縮みするスプライン IK の検証用サンプル .ma を生成する。

  python tools/make_stretch_spline_sample.py   → samples/stretch_spline_sample.ma, samples/stretch_spline_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * 背骨 sb_0〜sb_4（+X 方向、骨の長さ 2、z = -8）のスプライン IK sb_ik（rootOnCurve）。カーブ sb_crvShape は
    cluster sb_cl（コンポーネントタグで CV 3 だけ）で変形する。ハンドル sb_clHandle にキー: tx 0 → 3・ty 0 → 4
  * カーブの上のパラメータ 0・0.25・0.5・0.75・1 の点（pointOnCurveInfo sb_poc0〜4。turnOnPercentage なし）
  * 骨 i の伸び: sb_i.sx = blendColors(sb_bc{i}: color1R = 点 i と点 i+1 の距離（distanceBetween sb_db{i}）、
    color2R = 2（addDoubleLinear sb_rest{i} の出力）、blender = スイッチ) ÷ 2（multiplyDivide sb_md{i}、割り算）
  * スイッチ: sb_switchCtrl.tx（10）× 0.1 を expression で sb_root.stretch_switch へ、それを別の expression で各 blendColors の
    blender へ（.O[0] = .I[0]）
  ジョイントは、カーブの上の点 sb_poc0〜4 に乗る（骨の長さ = 点どうしの距離）
  * 伸び縮みするジョイント sb_1 の子に、型を知らないノード sb_comp（型 myCompXform。回転 (0, 30, 0)）。
    ジョイント sb_follow は sb_comp への pointConstraint・orientConstraint（オフセットなし）で動く。
    sb_1 のスケールは X だけが 1 以外になるので、親のスケールを受け継ぐ transform として扱うと sb_comp の行列がゆがむ。
    割り当て {"myCompXform": {"as": "transform", "segmentScaleCompensate": true}}（親のスケールを打ち消す）を使った
    結果は samples/stretch_spline_mapped.json（sb_comp のワールドのスケールは 1、sb_follow の向きは sb_1 の向き · (0, 30, 0)）
保存時のフレーム（1）の各ノードの値は、リグの計算結果と一致するように書く（カーブはまっすぐで、骨の長さはどれも 2）。
"""
from __future__ import annotations

import json
import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

OUT = os.path.join(ROOT, "samples", "stretch_spline_sample.ma")
# 自作ノードの割り当て（ma_viewer_nodes.json と同じ書き方）: 親のスケールを打ち消す transform として扱う
NODE_MAP = {"myCompXform": {"as": "transform", "segmentScaleCompensate": True}}


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0008-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def anim(name, keys):
        A('createNode animCurveTL -n "%s";' % name)
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    def expression(name, text):
        A('createNode expression -n "%s";' % name)
        uid(name)
        A('\tsetAttr -k on ".nds";')
        A('\tsetAttr ".ixp" -type "string" "%s";' % text)

    A('//Maya ASCII 2024 scene')
    A('//Name: stretch_spline_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    z = -8
    straight = [(0, 0, z), (8 / 3.0, 0, z), (16 / 3.0, 0, z), (8, 0, z)]
    prev = None
    for i in range(5):
        node("joint", "sb_%d" % i, prev, t=(0, 0, z) if i == 0 else (2, 0, 0))
        prev = "sb_%d" % i
    node("ikEffector", "sb_eff", "sb_3", t=(2, 0, 0), v="no")
    node("ikHandle", "sb_ik", roc="yes")
    node("transform", "sb_crv")
    node("nurbsCurve", "sb_crvShape", "sb_crv")
    node("nurbsCurve", "sb_crvShapeOrig", "sb_crv", io="yes")
    A('\tsetAttr ".gtag[0].gtagnm" -type "string" "sb_cl";')
    A('\tsetAttr ".gtag[0].gtagcmp" -type "componentList" 1 "cv[3]";')
    A('\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 %s "gtag" 1 "sb_cl" 1 "cv[3]";'
      % " ".join(" ".join(fmt(x) for x in c) for c in straight))
    node("transform", "sb_clHandle", rp=straight[3], sp=straight[3])
    node("clusterHandle", "sb_clHandleShape", "sb_clHandle")
    A('createNode cluster -n "sb_cl";')
    uid("sb_cl")
    A('\tsetAttr ".ip[0].gtg" -type "string" "sb_cl";')
    A('\tsetAttr ".gm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1;')
    anim("sb_clHandle_translateX", [(1, 0), (48, 3)])
    anim("sb_clHandle_translateY", [(1, 0), (48, 4)])

    # 伸びのスイッチ（自作の transform の独自の属性を expression で決める形）
    node("transform", "sb_switchCtrl", t=(10, 0, 0))
    node("transform", "sb_root")
    A('\taddAttr -ci true -sn "stretch_switch" -ln "stretch_switch" -at "double";')
    A('\tsetAttr -k on ".stretch_switch" 1;')
    expression("sb_switchExpr", ".O[0] = .I[0] * 0.1;")
    for i in range(5):
        node("pointOnCurveInfo", "sb_poc%d" % i)
        A('\tsetAttr ".pr" %s;' % fmt(i / 4.0))
    for i in range(4):
        node("distanceBetween", "sb_db%d" % i)
        node("addDoubleLinear", "sb_rest%d" % i)
        A('\tsetAttr ".i1" 1.999;')
        A('\tsetAttr ".i2" 0.001;')
        expression("sb_bcExpr%d" % i, ".O[0] = .I[0];")
        node("blendColors", "sb_bc%d" % i)
        node("multiplyDivide", "sb_md%d" % i)
        A('\tsetAttr ".op" 2;')
        A('\tsetAttr ".i2" -type "float3" 2 1 1 ;')

    # 伸び縮みするジョイントの子の、型を知らないノードと、それにコンストレイントで付くジョイント
    A('createNode myCompXform -n "sb_comp" -p "sb_1";')
    uid("sb_comp")
    A('\tsetAttr ".r" -type "double3" 0 30 0 ;')
    node("joint", "sb_follow", t=(2, 0, z), r=(0, 30, 0))
    for kind in ("pointConstraint", "orientConstraint"):
        A('createNode %s -n "sb_follow_%s" -p "sb_follow";' % (kind, kind))
        uid("sb_follow_" + kind)
        A('\taddAttr -dcb 0 -ci true -k true -sn "w0" -ln "sb_compW0" -dv 1 -min 0 -at "double";')
        A('\tsetAttr -k on ".nds";')
        A('\tsetAttr -k on ".w0";')

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('createNode ikSplineSolver -n "ikSplineSolver";')
    uid("ikSplineSolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a_, b_: A('connectAttr "%s" "%s";' % (a_, b_))  # noqa: E731
    for i in range(4):
        C("sb_%d.s" % i, "sb_%d.is" % (i + 1))          # Maya がジョイントの親子に付ける（親のスケールを子で打ち消す）
    C("sb_0.msg", "sb_ik.hsj")
    C("sb_eff.hp", "sb_ik.hee")
    C("ikSplineSolver.msg", "sb_ik.hsv")
    for ax in "xyz":
        C("sb_4.t%s" % ax, "sb_eff.t%s" % ax)
    C("sb_crvShape.ws", "sb_ik.ic")
    C("sb_crvShapeOrig.ws", "sb_cl.ip[0].ig")
    C("sb_cl.og[0]", "sb_crvShape.cr")
    C("sb_clHandle.wm", "sb_cl.ma")
    C("sb_clHandleShape.x", "sb_cl.x")
    C("sb_clHandle_translateX.o", "sb_clHandle.tx")
    C("sb_clHandle_translateY.o", "sb_clHandle.ty")
    C("sb_switchCtrl.tx", "sb_switchExpr.in[0]")
    C("sb_switchExpr.out[0]", "sb_root.stretch_switch")
    C(":time1.o", "sb_switchExpr.tim")
    for i in range(5):
        C("sb_crvShape.ws", "sb_poc%d.ic" % i)
    for i in range(4):
        C("sb_poc%d.p" % i, "sb_db%d.p1" % i)
        C("sb_poc%d.p" % (i + 1), "sb_db%d.p2" % i)
        C("sb_db%d.d" % i, "sb_bc%d.c1r" % i)
        C("sb_rest%d.o" % i, "sb_bc%d.c2r" % i)
        C("sb_root.stretch_switch", "sb_bcExpr%d.in[0]" % i)
        C("sb_bcExpr%d.out[0]" % i, "sb_bc%d.b" % i)
        C(":time1.o", "sb_bcExpr%d.tim" % i)
        C("sb_bc%d.opr" % i, "sb_md%d.i1x" % i)
        C("sb_md%d.ox" % i, "sb_%d.sx" % i)
    pc, oc = "sb_follow_pointConstraint", "sb_follow_orientConstraint"
    for a in "xyz":
        C("%s.ct%s" % (pc, a), "sb_follow.t%s" % a)
        C("%s.cr%s" % (oc, a), "sb_follow.r%s" % a)
    for c in (pc, oc):
        C("sb_follow.pim", c + ".cpim")
        C(c + ".w0", c + ".tg[0].tw")
    C("sb_follow.rp", pc + ".crp")
    C("sb_follow.rpt", pc + ".crt")
    C("sb_follow.ro", oc + ".cro")
    C("sb_follow.jo", oc + ".cjo")
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
        C("sb_comp.%s" % src, "%s.tg[0].%s" % (pc, dst))
    for src, dst in (("r", "tr"), ("ro", "tro"), ("pm", "tpm")):
        C("sb_comp.%s" % src, "%s.tg[0].%s" % (oc, dst))
    A('// End of stretch_spline_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "stretch_spline_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    mapped = load_ma(OUT, animation=True, node_map=NODE_MAP)
    with open(os.path.join(ROOT, "samples", "stretch_spline_mapped.json"), "w", encoding="utf-8") as f:
        json.dump(mapped, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: stretch_spline_sample.ma / stretch_spline_sample.json / stretch_spline_mapped.json")


if __name__ == "__main__":
    main()
