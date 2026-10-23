# -*- coding: utf-8 -*-
"""リグ（コンストレイント・IK・計算ノード）の検証用サンプル .ma を生成する。

  python tools/make_rig_sample.py          → samples/rig_sample.ma, samples/rig_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * 腕の IK: shoulder → elbow → wrist（→ hand_end）を ikRPsolver の arm_ik で動かす。
    arm_ik は hand_ctrl の子。hand_ctrl の移動・回転にキー。極ベクトルは elbow_pv への poleVectorConstraint
  * wrist の回転は hand_ctrl への orientConstraint
  * prop（箱のメッシュ）は wrist への parentConstraint（オフセット: 移動 (2, 0, 0)・回転 (0, 0, 90)）
  * head は tgtA・tgtB への pointConstraint（tgtB のウェイト w1 にキー: 1 → 3）
  * scl_jnt は scl_ctrl（スケール 2）への scaleConstraint
  * util_jnt・pb_jnt は ctrl_util から計算ノードで動かす:
      tx = 4 · ty + 1（multiplyDivide → plusMinusAverage）
      rz = 90 · (1 − ty) 度（reverse → multiplyDivide → unitConversion）
      sy = ty > 0.5 なら 2、そうでなければ 1（condition）
      sz = 3 · blend + 1 · (1 − blend)（blendColors。blend は ctrl_util の独自の属性 = 0.25）
      pb_jnt の移動 = 0.5 · ctrl_util の移動、回転 = (0, 0, 45)（pairBlend）
  * expr_jnt はエクスプレッション（ry）とドリブンキー animCurveUA（rx）で動く（未対応の警告の確認用）
保存時のフレーム（1）の各ノードの値は、リグの計算結果と一致するように書く。
"""
from __future__ import annotations

import json
import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
sys.path.insert(0, HERE)

from make_sample_ma import cube, write_mesh_data  # noqa: E402

OUT = os.path.join(ROOT, "samples", "rig_sample.ma")


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0001-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join("%g" % x for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def constraint(kind, name, parent, weights):
        A('createNode %s -n "%s" -p "%s";' % (kind, name, parent))
        uid(name)
        for i, (tname, w) in enumerate(weights):
            A('\taddAttr -dcb 0 -ci true -k true -sn "w%d" -ln "%sW%d" -dv 1 -min 0 -at "double";' % (i, tname, i))
        A('\tsetAttr -k on ".nds";')
        for i, (_tname, w) in enumerate(weights):
            A('\tsetAttr -k on ".w%d"%s;' % (i, "" if w is None else " %g" % w))

    def curve(kind, name, keys, linear=True):
        A('createNode animCurve%s -n "%s";' % (kind, name))
        uid(name)
        A('\tsetAttr ".tan" %d;' % (2 if linear else 18))
        A('\tsetAttr ".wgt" no;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    A('//Maya ASCII 2024 scene')
    A('//Name: rig_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    # --- 腕の IK ----------------------------------------------------------------
    node("joint", "shoulder", t=(0, 10, 0))
    node("joint", "elbow", "shoulder", t=(5, 0, -1), pa=(0, 0, 0))
    node("joint", "wrist", "elbow", t=(5, 0, 1))
    node("joint", "hand_end", "wrist", t=(2, 0, 0))
    node("ikEffector", "effector1", "elbow", t=(5, 0, 1), v="no", hd="yes")
    node("transform", "hand_ctrl", t=(10, 10, 0))
    node("ikHandle", "arm_ik", "hand_ctrl", roc="yes")
    constraint("poleVectorConstraint", "arm_ik_poleVectorConstraint1", "arm_ik", [("elbow_pv", None)])
    node("transform", "elbow_pv", t=(5, 10, -10))
    constraint("orientConstraint", "wrist_orientConstraint1", "wrist", [("hand_ctrl", None)])

    # --- parentConstraint（箱） ------------------------------------------------------
    node("transform", "prop", t=(12, 10, 0), r=(0, 0, 90))
    A('createNode mesh -n "propShape" -p "prop";')
    uid("propShape")
    A('\tsetAttr -k off ".v";')
    pos, faces = cube(1.0)
    write_mesh_data(L, pos, faces, with_uv=False)
    constraint("parentConstraint", "prop_parentConstraint1", "prop", [("wrist", None)])
    A('\tsetAttr ".tg[0].tot" -type "double3" 2 0 0 ;')
    A('\tsetAttr ".tg[0].tor" -type "double3" 0 0 90 ;')
    A('\tsetAttr ".rst" -type "double3" 12 10 0 ;')

    # --- pointConstraint（ターゲット 2 つ） -------------------------------------------
    node("transform", "tgtA", t=(-5, 20, 0))
    node("transform", "tgtB", t=(5, 20, 0))
    node("joint", "head", t=(0, 20, 0))
    constraint("pointConstraint", "head_pointConstraint1", "head", [("tgtA", 1), ("tgtB", None)])

    # --- scaleConstraint -----------------------------------------------------------
    node("transform", "scl_ctrl", t=(0, 0, 10), s=(2, 2, 2))
    node("joint", "scl_jnt", t=(0, 0, 10), s=(2, 2, 2))
    constraint("scaleConstraint", "scl_jnt_scaleConstraint1", "scl_jnt", [("scl_ctrl", None)])

    # --- 計算ノード ----------------------------------------------------------------
    node("transform", "ctrl_util", t=(2, 0, 0))
    A('\taddAttr -ci true -k true -sn "blend" -ln "blend" -dv 0 -at "double";')
    A('\tsetAttr -k on ".blend" 0.25;')
    node("joint", "util_jnt", t=(1, 0, -10), r=(0, 0, 90), s=(1, 1, 1.5))
    node("joint", "pb_jnt", t=(1, 0, 0), r=(0, 0, 45))
    node("multiplyDivide", "md_scale")
    A('\tsetAttr ".i2" -type "float3" 4 1 1 ;')
    node("plusMinusAverage", "pma_add")
    A('\tsetAttr -s 2 ".i1";')
    A('\tsetAttr ".i1[1]" 1;')
    node("reverse", "rev")
    node("multiplyDivide", "md_angle")
    A('\tsetAttr ".i2" -type "float3" 90 1 1 ;')
    node("unitConversion", "uc_angle")
    A('\tsetAttr ".cf" 0.017453292519943295;')
    node("condition", "cond")
    A('\tsetAttr ".op" 2;')
    A('\tsetAttr ".st" 0.5;')
    A('\tsetAttr ".ct" -type "float3" 2 0 0 ;')
    A('\tsetAttr ".cf" -type "float3" 1 0 0 ;')
    node("blendColors", "bc")
    A('\tsetAttr ".c1" -type "float3" 3 0 0 ;')
    A('\tsetAttr ".c2" -type "float3" 1 0 0 ;')
    node("pairBlend", "pb")
    A('\tsetAttr ".w" 0.5;')
    A('\tsetAttr ".ir2" -type "double3" 0 0 90 ;')

    # --- 未対応（エクスプレッション・ドリブンキー） ------------------------------------
    node("joint", "expr_jnt", t=(0, 0, -20))
    node("expression", "expression1")
    A('\tsetAttr -k on ".nds";')
    A('\tsetAttr ".ixp" -type "string" ".O[0] = frame;";')
    curve("UA", "drv_key", [(0, 0), (1, 45)])

    # --- キー -----------------------------------------------------------------------
    curve("TL", "hand_ctrl_translateX", [(1, 10), (24, 7), (48, 10)])
    curve("TL", "hand_ctrl_translateY", [(1, 10), (24, 13), (48, 10)])
    curve("TA", "hand_ctrl_rotateZ", [(1, 0), (48, 30)])
    curve("TU", "head_pointConstraint1_w1", [(1, 1), (48, 3)])
    curve("TL", "ctrl_util_translateY", [(1, 0), (48, 1)])

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('\tsetAttr ".st" 6;')
    A('createNode ikRPsolver -n "ikRPsolver";')
    uid("ikRPsolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')
    A('\tsetAttr ".unw" 1;')

    C = lambda a, b: A('connectAttr "%s" "%s";' % (a, b))  # noqa: E731
    xyz = "xyz"
    # IK
    C("shoulder.msg", "arm_ik.hsj")
    C("effector1.hp", "arm_ik.hee")
    C("ikRPsolver.msg", "arm_ik.hsv")
    for a in xyz:
        C("wrist.t%s" % a, "effector1.t%s" % a)
    pvc = "arm_ik_poleVectorConstraint1"
    for a in xyz:
        C("%s.ct%s" % (pvc, a), "arm_ik.pv%s" % a)
    C("arm_ik.pim", pvc + ".cpim")
    C("shoulder.pm", pvc + ".ps")
    C("shoulder.t", pvc + ".crp")
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
        C("elbow_pv.%s" % src, "%s.tg[0].%s" % (pvc, dst))
    C(pvc + ".w0", pvc + ".tg[0].tw")
    # orientConstraint
    oc = "wrist_orientConstraint1"
    for a in xyz:
        C("%s.cr%s" % (oc, a), "wrist.r%s" % a)
    C("wrist.ro", oc + ".cro")
    C("wrist.pim", oc + ".cpim")
    C("wrist.jo", oc + ".cjo")
    C("wrist.is", oc + ".is")
    for src, dst in (("r", "tr"), ("ro", "tro"), ("pm", "tpm"), ("jo", "tjo")):
        C("hand_ctrl.%s" % src, "%s.tg[0].%s" % (oc, dst))
    C(oc + ".w0", oc + ".tg[0].tw")
    # parentConstraint
    pc = "prop_parentConstraint1"
    for a in xyz:
        C("%s.ct%s" % (pc, a), "prop.t%s" % a)
        C("%s.cr%s" % (pc, a), "prop.r%s" % a)
    C("prop.ro", pc + ".cro")
    C("prop.pim", pc + ".cpim")
    C("prop.rp", pc + ".crp")
    C("prop.rpt", pc + ".crt")
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"),
                     ("pm", "tpm"), ("jo", "tjo"), ("ssc", "tsc"), ("is", "tis")):
        C("wrist.%s" % src, "%s.tg[0].%s" % (pc, dst))
    C(pc + ".w0", pc + ".tg[0].tw")
    # pointConstraint
    pt = "head_pointConstraint1"
    for a in xyz:
        C("%s.ct%s" % (pt, a), "head.t%s" % a)
    C("head.pim", pt + ".cpim")
    C("head.rp", pt + ".crp")
    C("head.rpt", pt + ".crt")
    for i, tgt in enumerate(("tgtA", "tgtB")):
        for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
            C("%s.%s" % (tgt, src), "%s.tg[%d].%s" % (pt, i, dst))
        C("%s.w%d" % (pt, i), "%s.tg[%d].tw" % (pt, i))
    C("head_pointConstraint1_w1.o", pt + ".w1")
    # scaleConstraint
    sc = "scl_jnt_scaleConstraint1"
    for a in xyz:
        C("%s.cs%s" % (sc, a), "scl_jnt.s%s" % a)
    C("scl_jnt.pim", sc + ".cpim")
    C("scl_ctrl.s", sc + ".tg[0].ts")
    C("scl_ctrl.pm", sc + ".tg[0].tpm")
    C(sc + ".w0", sc + ".tg[0].tw")
    # 計算ノード
    C("ctrl_util.ty", "md_scale.i1x")
    C("md_scale.ox", "pma_add.i1[0]")
    C("pma_add.o1", "util_jnt.tx")
    C("ctrl_util.ty", "rev.ix")
    C("rev.ox", "md_angle.i1x")
    C("md_angle.ox", "uc_angle.i")
    C("uc_angle.o", "util_jnt.rz")
    C("ctrl_util.ty", "cond.ft")
    C("cond.ocr", "util_jnt.sy")
    C("ctrl_util.blend", "bc.b")
    C("bc.opr", "util_jnt.sz")
    C("ctrl_util.t", "pb.it2")
    C("pb.ot", "pb_jnt.t")
    C("pb.or", "pb_jnt.r")
    # 未対応
    C("expression1.out[0]", "expr_jnt.ry")
    C("ctrl_util.ty", "drv_key.i")
    C("drv_key.o", "expr_jnt.rx")
    # キー
    C("hand_ctrl_translateX.o", "hand_ctrl.tx")
    C("hand_ctrl_translateY.o", "hand_ctrl.ty")
    C("hand_ctrl_rotateZ.o", "hand_ctrl.rz")
    C("ctrl_util_translateY.o", "ctrl_util.ty")
    A('// End of rig_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "rig_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: rig_sample.ma / rig_sample.json")


if __name__ == "__main__":
    main()
