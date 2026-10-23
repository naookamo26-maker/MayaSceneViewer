# -*- coding: utf-8 -*-
"""第 6 段階（cluster で動くワイヤー・標準の計算ノード・アニメーションレイヤー・リグの診断）の検証用サンプル .ma を生成する。

  python tools/make_rig6_sample.py          → samples/rig6_sample.ma, samples/rig6_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * 尻尾 t2_0〜t2_4（+X 方向、骨の長さ 2、z = -10）のスプライン IK。カーブ t2_curveShape は wire（t2_wireDef）で変形し、
    ワイヤー t2_wireShape は cluster 2 つで変形する（変形前の形は中間オブジェクト t2_wireShapeOrig）:
      cl_tip（CV 3 のウェイト 1）のハンドル cl_tipHandle は tip_ctrl の子。tip_ctrl.ty にキー 0 → 3
      cl_mid（CV 2 のウェイト 0.5）のハンドル cl_midHandle.ty にキー 0 → 2
  * 計算ノード（ctl の移動 tx 0 → 10・ty 0 → 4 のキーで動く）:
      u_jnt1.tx = addDoubleLinear(ctl.tx, 2)、u_jnt1.ty = multDoubleLinear(ctl.tx, 3)
      u_jnt2.t = clamp(ctl.t, -1〜1)（RGB の成分で接続）
      u_jnt3.tx = remapValue(ctl.tx。入力 0〜10、ランプ (0, 0)・(0.5, 1)・(1, 0) の線形)
      u_jnt3.ty = distanceBetween(ctl.wm, db_loc.wm)（db_loc は (0, 0, 5)）、u_jnt3.tz = setRange(ctl.tx, 0〜10 → 0〜1)
      u_jnt4.t = vectorProduct(外積: (1, 0, 0) × ctl.t)
      u_jnt5.tx = blendTwoAttr(ctl.tx, 10、ab 0.25)、u_jnt5.ty = blendWeighted(ctl.tx · 2 + ctl.ty)、
      u_jnt5.tz = choice(セレクター 1: ctl.tx, ctl.ty)
  * ドリブンキー: roll_jnt.rz = animCurveUA(roll_ctrl.roll。キー (0, 0)・(10, 90))。roll_ctrl.roll にキー 0 → 10
    roll_jnt.ty = animCurveUL(drv2.rx を unitConversion で度にした値。キー (0, 0)・(45, 3))。drv2.rx にキー 0 → 45
  * アニメーションレイヤー: lay_jnt.rx = animBlendNodeAdditiveRotation(ベースのキー 0 → 30、レイヤーのキー 0 → 10、
    レイヤー layer1 のウェイト 0.5)
  * 脚 leg_hip → leg_knee → leg_ankle の ikRPsolver。極ベクトルは knee_pv への poleVectorConstraint で、
    knee_pv.tx は自作ノード（未知の型 myRigNode）の出力 → 再生できない（リグの診断で見つける）。
    脚の IK まわり（ハンドル・poleVectorConstraint・knee_pv）はディスプレイレイヤー rig_layer に入っている
    （layerManager（displayLayerManager）→ rig_layer.id、rig_layer.di → 各ノードの .do。値の計算には関係しない）
  * pointOnCurveInfo: poc_jnt.t = ワイヤー t2_wireShape の長さの半分の点（turnOnPercentage）、
    poc_jnt2.t = パラメータ 1（終点）の接線の向き（normalizedTangent）
  * 腕 arm2_a → arm2_b → arm2_c（+X 方向、肘は +Z 側に曲がる）の ikRPsolver。極ベクトルは書かない
    （Maya の既定値 (0, 0, 1) のまま）。ハンドル arm2_ik.tx にキー 46 → 43
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

OUT = os.path.join(ROOT, "samples", "rig6_sample.ma")


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0006-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def shape(name, parent, cvs, **attrs):
        node("nurbsCurve", name, parent, **attrs)
        A('\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 %s;'
          % " ".join(" ".join(fmt(x) for x in c) for c in cvs))

    def anim(kind, name, keys):
        A('createNode animCurve%s -n "%s";' % (kind, name))
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    A('//Maya ASCII 2024 scene')
    A('//Name: rig6_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('requires "myRigPlugin" "1.0";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    # --- 尻尾: cluster → ワイヤー → スプライン IK のカーブ ------------------------------------
    z = -10
    straight = [(0, 0, z), (8 / 3.0, 0, z), (16 / 3.0, 0, z), (8, 0, z)]
    names = []
    for i in range(5):
        node("joint", "t2_%d" % i, names[-1] if names else None, t=(0, 0, z) if i == 0 else (2, 0, 0))
        names.append("t2_%d" % i)
    node("ikEffector", "t2_eff", "t2_3", t=(2, 0, 0), v="no")
    node("ikHandle", "t2_ik", roc="yes")
    node("transform", "t2_curve", it="no")
    node("nurbsCurve", "t2_curveShape", "t2_curve")
    shape("t2_curveShapeOrig", "t2_curve", straight, io="yes")
    node("transform", "t2_wire")
    node("nurbsCurve", "t2_wireShape", "t2_wire")
    shape("t2_wireShapeOrig", "t2_wire", straight, io="yes")
    node("transform", "t2_wireBaseWire", v="no")
    shape("t2_wireBaseWireShape", "t2_wireBaseWire", straight)
    A('createNode wire -n "t2_wireDef";')
    uid("t2_wireDef")
    A('\tsetAttr ".dds[0]" 20;')
    node("transform", "tip_ctrl")
    node("transform", "cl_tipHandle", "tip_ctrl")
    A('\tsetAttr ".rp" -type "double3" 8 0 %s ;' % fmt(z))
    A('\tsetAttr ".sp" -type "double3" 8 0 %s ;' % fmt(z))
    node("clusterHandle", "cl_tipHandleShape", "cl_tipHandle")
    node("transform", "cl_midHandle")
    node("clusterHandle", "cl_midHandleShape", "cl_midHandle")
    A('createNode cluster -n "cl_tip";')
    uid("cl_tip")
    A('\tsetAttr -s 4 ".wl[0].w[0:3]"  0 0 0 1;')
    A('\tsetAttr ".gm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1;')
    A('createNode cluster -n "cl_mid";')
    uid("cl_mid")
    A('\tsetAttr -s 4 ".wl[0].w[0:3]"  0 0 0.5 0;')
    anim("TL", "tip_ctrl_translateY", [(1, 0), (48, 3)])
    anim("TL", "cl_midHandle_translateY", [(1, 0), (48, 2)])

    # --- 標準の計算ノード ----------------------------------------------------------------
    node("transform", "ctl")
    node("transform", "db_loc", t=(0, 0, 5))
    node("joint", "u_jnt1", t=(2, 0, 0))
    node("addDoubleLinear", "u_add")
    A('\tsetAttr ".i2" 2;')
    node("multDoubleLinear", "u_mult")
    A('\tsetAttr ".i2" 3;')
    node("joint", "u_jnt2")
    node("clamp", "u_clamp")
    A('\tsetAttr ".mn" -type "float3" -1 -1 -1 ;')
    A('\tsetAttr ".mx" -type "float3" 1 1 1 ;')
    node("joint", "u_jnt3", t=(0, 5, 0))
    node("remapValue", "u_remap")
    A('\tsetAttr ".imx" 10;')
    A('\tsetAttr -s 3 ".vl[0:2]"  0 0 1 0.5 1 1 1 0 1;')
    node("distanceBetween", "u_dist")
    node("setRange", "u_range")
    A('\tsetAttr ".m" -type "float3" 1 0 0 ;')
    A('\tsetAttr ".om" -type "float3" 10 0 0 ;')
    node("joint", "u_jnt4")
    node("vectorProduct", "u_vp", op=2)
    A('\tsetAttr ".i1" -type "double3" 1 0 0 ;')
    node("joint", "u_jnt5", t=(2.5, 0, 0))
    node("blendTwoAttr", "u_b2a", ab=0.25)
    A('\tsetAttr ".i[1]" 10;')
    node("blendWeighted", "u_bw")
    A('\tsetAttr ".w[0]" 2;')
    node("choice", "u_choice", s=1)
    anim("TL", "ctl_translateX", [(1, 0), (48, 10)])
    anim("TL", "ctl_translateY", [(1, 0), (48, 4)])

    # --- ドリブンキー -------------------------------------------------------------------
    node("transform", "roll_ctrl")
    A('\taddAttr -ci true -k true -sn "roll" -ln "roll" -at "double";')
    node("transform", "drv2")
    node("joint", "roll_jnt", t=(0, 0, 20))
    anim("TU", "roll_ctrl_roll", [(1, 0), (48, 10)])
    anim("TA", "drv2_rotateX", [(1, 0), (48, 45)])
    anim("UA", "roll_jnt_rotateZ", [(0, 0), (10, 90)])
    anim("UL", "roll_jnt_translateY", [(0, 0), (45, 3)])
    node("unitConversion", "drv2_uc")
    A('\tsetAttr ".cf" 57.295779513082323;')

    # --- アニメーションレイヤー -----------------------------------------------------------
    node("joint", "lay_jnt", t=(0, 0, 10))
    A('createNode animLayer -n "BaseAnimation";')
    uid("BaseAnimation")
    A('createNode animLayer -n "layer1";')
    uid("layer1")
    A('\tsetAttr ".w" 0.5;')
    A('createNode animBlendNodeAdditiveRotation -n "lay_jnt_rotate_layer1";')
    uid("lay_jnt_rotate_layer1")
    anim("TA", "lay_jnt_rotateX_base", [(1, 0), (48, 30)])
    anim("TA", "lay_jnt_rotateX_layer1", [(1, 0), (48, 10)])

    # --- 自作ノードで動く極ベクトル ---------------------------------------------------------
    node("joint", "leg_hip", t=(20, 10, 0))
    node("joint", "leg_knee", "leg_hip", t=(0, -5, 1))
    node("joint", "leg_ankle", "leg_knee", t=(0, -5, -1))
    node("ikEffector", "leg_eff", "leg_knee", t=(0, -5, -1), v="no")
    node("transform", "foot_ctrl", t=(20, 0, 0))
    node("ikHandle", "leg_ik", "foot_ctrl")
    A('\tsetAttr ".pv" -type "double3" 0 0 10 ;')
    A('createNode poleVectorConstraint -n "leg_pvc" -p "leg_ik";')
    uid("leg_pvc")
    A('\taddAttr -dcb 0 -ci true -k true -sn "w0" -ln "knee_pvW0" -dv 1 -min 0 -at "double";')
    A('\tsetAttr -k on ".w0";')
    node("transform", "knee_pv", t=(20, 10, 10))
    A('createNode myRigNode -n "my_pv_driver";')
    uid("my_pv_driver")
    A('\tsetAttr ".amount" 3;')

    A('createNode displayLayerManager -n "layerManager";')
    uid("layerManager")
    A('\tsetAttr -s 2 ".dli[1]"  1;')
    node("displayLayer", "rig_layer")
    A('\tsetAttr ".do" 1;')

    # --- pointOnCurveInfo ------------------------------------------------------------
    node("joint", "poc_jnt", t=(4, 0, -10))
    node("pointOnCurveInfo", "poc_half", pr=0.5, top="yes")
    node("joint", "poc_jnt2", t=(1, 0, 0))
    node("pointOnCurveInfo", "poc_end", pr=1)

    # --- 極ベクトルが既定値の腕の IK ---------------------------------------------------------
    node("joint", "arm2_a", t=(40, 0, 10))
    node("joint", "arm2_b", "arm2_a", t=(3, 0, 1))
    node("joint", "arm2_c", "arm2_b", t=(3, 0, -1))
    node("ikEffector", "arm2_eff", "arm2_b", t=(3, 0, -1), v="no")
    node("ikHandle", "arm2_ik", t=(46, 0, 10))
    anim("TL", "arm2_ik_translateX", [(1, 46), (48, 43)])

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('createNode ikSplineSolver -n "ikSplineSolver";')
    uid("ikSplineSolver")
    A('createNode ikRPsolver -n "ikRPsolver";')
    uid("ikRPsolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a_, b_: A('connectAttr "%s" "%s";' % (a_, b_))  # noqa: E731
    C("t2_0.msg", "t2_ik.hsj")
    C("t2_eff.hp", "t2_ik.hee")
    C("ikSplineSolver.msg", "t2_ik.hsv")
    for ax in "xyz":
        C("t2_4.t%s" % ax, "t2_eff.t%s" % ax)
    C("t2_curveShape.ws", "t2_ik.ic")
    C("t2_curveShapeOrig.ws", "t2_wireDef.ip[0].ig")
    C("t2_wireDef.og[0]", "t2_curveShape.cr")
    C("t2_wireShape.ws", "t2_wireDef.dw[0]")
    C("t2_wireBaseWireShape.ws", "t2_wireDef.bw[0]")
    C("t2_wireShapeOrig.ws", "cl_tip.ip[0].ig")
    C("cl_tip.og[0]", "cl_mid.ip[0].ig")
    C("cl_mid.og[0]", "t2_wireShape.cr")
    C("cl_tipHandle.wm", "cl_tip.ma")
    C("cl_tipHandleShape.x", "cl_tip.x")
    C("cl_midHandle.wm", "cl_mid.ma")
    C("cl_midHandleShape.x", "cl_mid.x")
    C("tip_ctrl_translateY.o", "tip_ctrl.ty")
    C("cl_midHandle_translateY.o", "cl_midHandle.ty")

    C("ctl_translateX.o", "ctl.tx")
    C("ctl_translateY.o", "ctl.ty")
    C("ctl.tx", "u_add.i1")
    C("u_add.o", "u_jnt1.tx")
    C("ctl.tx", "u_mult.i1")
    C("u_mult.o", "u_jnt1.ty")
    for c, ax in zip("rgb", "xyz"):
        C("ctl.t%s" % ax, "u_clamp.ip%s" % c)
        C("u_clamp.op%s" % c, "u_jnt2.t%s" % ax)
    C("ctl.tx", "u_remap.i")
    C("u_remap.ov", "u_jnt3.tx")
    C("ctl.wm", "u_dist.im1")
    C("db_loc.wm", "u_dist.im2")
    C("u_dist.d", "u_jnt3.ty")
    C("ctl.tx", "u_range.vx")
    C("u_range.ox", "u_jnt3.tz")
    C("ctl.t", "u_vp.i2")
    C("u_vp.o", "u_jnt4.t")
    C("ctl.tx", "u_b2a.i[0]")
    C("u_b2a.o", "u_jnt5.tx")
    C("ctl.tx", "u_bw.i[0]")
    C("ctl.ty", "u_bw.i[1]")
    C("u_bw.o", "u_jnt5.ty")
    C("ctl.tx", "u_choice.i[0]")
    C("ctl.ty", "u_choice.i[1]")
    C("u_choice.o", "u_jnt5.tz")

    C("roll_ctrl_roll.o", "roll_ctrl.roll")
    C("roll_ctrl.roll", "roll_jnt_rotateZ.i")
    C("roll_jnt_rotateZ.o", "roll_jnt.rz")
    C("drv2_rotateX.o", "drv2.rx")
    C("drv2.rx", "drv2_uc.i")
    C("drv2_uc.o", "roll_jnt_translateY.i")
    C("roll_jnt_translateY.o", "roll_jnt.ty")
    C("lay_jnt_rotateX_base.o", "lay_jnt_rotate_layer1.iax")
    C("lay_jnt_rotateX_layer1.o", "lay_jnt_rotate_layer1.ibx")
    C("layer1.fo", "lay_jnt_rotate_layer1.wb")
    C("lay_jnt_rotate_layer1.ox", "lay_jnt.rx")

    C("leg_hip.msg", "leg_ik.hsj")
    C("leg_eff.hp", "leg_ik.hee")
    C("ikRPsolver.msg", "leg_ik.hsv")
    for ax in "xyz":
        C("leg_ankle.t%s" % ax, "leg_eff.t%s" % ax)
        C("leg_pvc.ct%s" % ax, "leg_ik.pv%s" % ax)
    C("leg_ik.pim", "leg_pvc.cpim")
    C("leg_hip.pm", "leg_pvc.ps")
    C("leg_hip.t", "leg_pvc.crp")
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
        C("knee_pv.%s" % src, "leg_pvc.tg[0].%s" % dst)
    C("leg_pvc.w0", "leg_pvc.tg[0].tw")
    C("my_pv_driver.out", "knee_pv.tx")
    C("t2_wireShape.ws", "poc_half.ic")
    C("poc_half.p", "poc_jnt.t")
    C("t2_wireShape.ws", "poc_end.ic")
    C("poc_end.nt", "poc_jnt2.t")
    C("arm2_a.msg", "arm2_ik.hsj")
    C("arm2_eff.hp", "arm2_ik.hee")
    C("ikRPsolver.msg", "arm2_ik.hsv")
    for ax in "xyz":
        C("arm2_c.t%s" % ax, "arm2_eff.t%s" % ax)
    C("arm2_ik_translateX.o", "arm2_ik.tx")
    C("layerManager.dli[1]", "rig_layer.id")
    for n in ("leg_ik", "leg_pvc", "knee_pv", "foot_ctrl"):
        C("rig_layer.di", "%s.do" % n)
    A('// End of rig6_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "rig6_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: rig6_sample.ma / rig6_sample.json")


if __name__ == "__main__":
    main()
