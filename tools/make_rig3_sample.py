# -*- coding: utf-8 -*-
"""第 3 段階（aimConstraint・シングルチェーン IK・行列ノード・offsetParentMatrix）の検証用サンプル .ma を生成する。

  python tools/make_rig3_sample.py          → samples/rig3_sample.ma, samples/rig3_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * eye は look_tgt への aimConstraint（aim (1, 0, 0)・up (0, 1, 0)、world up はオブジェクト eye_up）
  * aim_vec は look_tgt への aimConstraint（up (0, 0, 1)、world up はベクトル (0, 0, 1)）
  * sc_a → sc_b を ikSCsolver の sc_ik（1 ボーン）、sc2_a → sc2_b → sc2_c を sc2_ik（2 ボーン）で動かす
  * mm_jnt = decomposeMatrix(multMatrix(移動 (2, 0, 0) の行列, mm_ctrl.worldMatrix))
    （Maya の行ベクトル規約で、mm_ctrl のローカル軸で (2, 0, 0) ずらした位置と向き）
  * cm_jnt = decomposeMatrix(inverseMatrix(composeMatrix(cm_ctrl の移動, 回転 (0, 0, 30))))
  * opm_jnt は offsetParentMatrix（移動 (5, 0, -20)）を持つ。opm_follow の offsetParentMatrix は opm_src.worldMatrix
  * sc4_a〜sc4_d（ジョイント 4 つ、まっすぐ）の ikSCsolver（第 4 段階で対応。まっすぐ伸びた状態でハンドルに届く）
保存時のフレーム（1）の各ノードの値は、リグの計算結果と一致するように書く。
"""
from __future__ import annotations

import json
import math
import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

OUT = os.path.join(ROOT, "samples", "rig3_sample.ma")


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0003-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def matrix(attr, m):
        A('\tsetAttr ".%s" -type "matrix" %s;' % (attr, " ".join(fmt(x) for x in m)))

    def translate(x, y, z):
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]

    def constraint(kind, name, parent, targets):
        A('createNode %s -n "%s" -p "%s";' % (kind, name, parent))
        uid(name)
        for i, t in enumerate(targets):
            A('\taddAttr -dcb 0 -ci true -k true -sn "w%d" -ln "%sW%d" -dv 1 -min 0 -at "double";' % (i, t, i))
        for i, _t in enumerate(targets):
            A('\tsetAttr -k on ".w%d";' % i)

    def curve(kind, name, keys):
        A('createNode animCurve%s -n "%s";' % (kind, name))
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr ".wgt" no;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    A('//Maya ASCII 2024 scene')
    A('//Name: rig3_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    # --- aimConstraint ------------------------------------------------------------
    node("transform", "look_tgt", t=(10, 15, 5))
    node("transform", "eye_up", t=(0, 25, 5))
    node("joint", "eye", t=(0, 15, 5))
    constraint("aimConstraint", "eye_aimConstraint1", "eye", ["look_tgt"])
    A('\tsetAttr ".wut" 1;')
    node("joint", "aim_vec", t=(0, 15, -5), r=(0, -45, 0))
    constraint("aimConstraint", "aim_vec_aimConstraint1", "aim_vec", ["look_tgt"])
    A('\tsetAttr ".u" -type "double3" 0 0 1 ;')
    A('\tsetAttr ".wu" -type "double3" 0 0 1 ;')

    # --- シングルチェーン IK --------------------------------------------------------
    node("joint", "sc_a", t=(20, 0, 0))
    node("joint", "sc_b", "sc_a", t=(0, 5, 0))
    node("ikEffector", "sc_eff", "sc_a", t=(0, 5, 0), v="no")
    node("transform", "sc_ctrl", t=(20, 5, 0))
    node("ikHandle", "sc_ik", "sc_ctrl")
    node("joint", "sc2_a", t=(30, 0, 0))
    node("joint", "sc2_b", "sc2_a", t=(3, 0, -1))
    node("joint", "sc2_c", "sc2_b", t=(3, 0, 1))
    node("ikEffector", "sc2_eff", "sc2_b", t=(3, 0, 1), v="no")
    node("transform", "sc2_ctrl", t=(36, 0, 0))
    node("ikHandle", "sc2_ik", "sc2_ctrl")
    node("joint", "sc4_a", t=(40, 0, 0))
    node("joint", "sc4_b", "sc4_a", t=(2, 0, 0))
    node("joint", "sc4_c", "sc4_b", t=(2, 0, 0))
    node("joint", "sc4_d", "sc4_c", t=(2, 0, 0))
    node("ikEffector", "sc4_eff", "sc4_c", t=(2, 0, 0), v="no")
    node("ikHandle", "sc4_ik", t=(46, 0, 0))

    # --- 行列ノード ----------------------------------------------------------------
    node("transform", "mm_ctrl", t=(-20, 0, 0))
    node("joint", "mm_jnt", t=(-18, 0, 0))
    node("multMatrix", "mm_mult")
    matrix("i[0]", translate(2, 0, 0))
    node("decomposeMatrix", "mm_dec")
    node("transform", "cm_ctrl", t=(1, 2, 3))
    a = math.radians(-30)                 # inverse(T · Rz(30)): 回転 -30°、移動 -Rz(-30)·t
    t = (1, 2, 3)
    inv_t = (-(math.cos(a) * t[0] - math.sin(a) * t[1]), -(math.sin(a) * t[0] + math.cos(a) * t[1]), -t[2])
    node("joint", "cm_jnt", t=inv_t, r=(0, 0, -30))
    node("composeMatrix", "cm_comp")
    A('\tsetAttr ".ir" -type "double3" 0 0 30 ;')
    node("inverseMatrix", "cm_inv")
    node("decomposeMatrix", "cm_dec")

    # --- offsetParentMatrix ----------------------------------------------------------
    node("joint", "opm_jnt", t=(1, 0, 0))
    matrix("opm", translate(5, 0, -20))
    node("transform", "opm_src", t=(0, 0, -30))
    node("joint", "opm_follow", t=(0, 1, 0))
    matrix("opm", translate(0, 0, -30))   # 接続（opm_src.worldMatrix）の保存時の値

    # --- キー ---------------------------------------------------------------------
    curve("TL", "look_tgt_translateY", [(1, 15), (48, 20)])
    curve("TL", "look_tgt_translateZ", [(1, 5), (24, 15), (48, 5)])
    curve("TL", "sc_ctrl_translateX", [(1, 20), (48, 23)])
    curve("TL", "sc_ctrl_translateZ", [(1, 0), (48, 2)])
    curve("TL", "sc2_ctrl_translateX", [(1, 36), (48, 33)])
    curve("TL", "sc2_ctrl_translateY", [(1, 0), (48, 2)])
    curve("TA", "mm_ctrl_rotateY", [(1, 0), (48, 90)])
    curve("TL", "cm_ctrl_translateX", [(1, 1), (48, 4)])
    curve("TL", "opm_src_translateX", [(1, 0), (48, 5)])

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('createNode ikSCsolver -n "ikSCsolver";')
    uid("ikSCsolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a_, b_: A('connectAttr "%s" "%s";' % (a_, b_))  # noqa: E731
    xyz = "xyz"
    for drv, con, up in (("eye", "eye_aimConstraint1", True), ("aim_vec", "aim_vec_aimConstraint1", False)):
        for ax in xyz:
            C("%s.cr%s" % (con, ax), "%s.r%s" % (drv, ax))
        for src, dst in (("pim", "cpim"), ("t", "ct"), ("rp", "crp"), ("rpt", "crt"), ("ro", "cro"), ("jo", "cjo"),
                         ("is", "is")):
            C("%s.%s" % (drv, src), "%s.%s" % (con, dst))
        for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
            C("look_tgt.%s" % src, "%s.tg[0].%s" % (con, dst))
        C(con + ".w0", con + ".tg[0].tw")
        if up:
            C("eye_up.wm", con + ".wum")
    for handle, start, eff, end in (("sc_ik", "sc_a", "sc_eff", "sc_b"), ("sc2_ik", "sc2_a", "sc2_eff", "sc2_c"),
                                    ("sc4_ik", "sc4_a", "sc4_eff", "sc4_d")):
        C("%s.msg" % start, "%s.hsj" % handle)
        C("%s.hp" % eff, "%s.hee" % handle)
        C("ikSCsolver.msg", "%s.hsv" % handle)
        for ax in xyz:
            C("%s.t%s" % (end, ax), "%s.t%s" % (eff, ax))
    C("mm_ctrl.wm", "mm_mult.i[1]")
    C("mm_mult.o", "mm_dec.imat")
    C("mm_dec.ot", "mm_jnt.t")
    C("mm_dec.or", "mm_jnt.r")
    C("cm_ctrl.t", "cm_comp.it")
    C("cm_comp.omat", "cm_inv.imat")
    C("cm_inv.omat", "cm_dec.imat")
    C("cm_dec.ot", "cm_jnt.t")
    C("cm_dec.or", "cm_jnt.r")
    C("opm_src.wm", "opm_follow.opm")
    for name, attr in (("look_tgt", "ty"), ("look_tgt", "tz"), ("sc_ctrl", "tx"), ("sc_ctrl", "tz"),
                       ("sc2_ctrl", "tx"), ("sc2_ctrl", "ty"), ("mm_ctrl", "ry"), ("cm_ctrl", "tx"), ("opm_src", "tx")):
        long = {"tx": "translateX", "ty": "translateY", "tz": "translateZ", "ry": "rotateY"}[attr]
        C("%s_%s.o" % (name, long), "%s.%s" % (name, attr))
    A('// End of rig3_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "rig3_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: rig3_sample.ma / rig3_sample.json")


if __name__ == "__main__":
    main()
