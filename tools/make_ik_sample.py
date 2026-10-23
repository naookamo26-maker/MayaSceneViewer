# -*- coding: utf-8 -*-
"""第 4 段階（displayLayer・四元数ノード・3 本以上のジョイントの IK・スプライン IK）の検証用サンプル .ma を生成する。

  python tools/make_ik_sample.py          → samples/ik_sample.ma, samples/ik_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * proxy_geo（箱）は非表示のディスプレイレイヤー hidden_layer に入っている。layer_jnt.tx = reverse(hidden_layer.v) = 1
  * q_jnt の回転 = quatToEuler(decomposeMatrix(q_ctrl.matrix).oq)（q_ctrl の回転と同じ）
    q2_jnt の回転 = quatToEuler(quatProd(eulerToQuat(q_ctrl.r), quatInvert(eulerToQuat((0, 0, 45)))))
    q3_jnt の回転 = quatToEuler(quatSlerp(単位, eulerToQuat(q_ctrl.r), 0.5))
  * rp4_a〜rp4_d（ジョイント 4 つ）の ikRPsolver（極ベクトルは rp4_pv への poleVectorConstraint）、
    sc4_a〜sc4_d の ikSCsolver
  * spA_0〜spA_4（+Y 方向、骨の長さ 2）のスプライン IK。カーブは drv_bot・drv_top の skinCluster で変形（drv_top にキー）。
    rootOnCurve。len_jnt.tx = curveInfo(カーブ).arcLength
  * spB_0〜spB_4（+X 方向）のスプライン IK。カーブの制御点はロケーター（worldPosition）で動かす（spB_loc3 にキー）。
    上級ツイスト: オブジェクトの回転（始点 spB_upS・終点 spB_upE。spB_upE の rx にキー 0 → 150。ひねりの角度を均等に配る）
保存時のフレーム（1）の各ノードの値は、リグの計算結果と一致するように書く（カーブはまっすぐで、ジョイントはその上）。
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

OUT = os.path.join(ROOT, "samples", "ik_sample.ma")


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0004-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def curve_cc(cvs):
        """3 次・1 スパンのカーブ（CV 4 つ）"""
        return ('\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 %s;'
                % " ".join(" ".join(fmt(x) for x in c) for c in cvs))

    def anim(kind, name, keys):
        A('createNode animCurve%s -n "%s";' % (kind, name))
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    def chain(prefix, n, start, step, parent=None):
        names = []
        for i in range(n):
            name = "%s_%d" % (prefix, i) if prefix.startswith("sp") else "%s_%s" % (prefix, "abcd"[i])
            node("joint", name, names[-1] if names else parent, t=start if i == 0 else step)
            names.append(name)
        return names

    A('//Maya ASCII 2024 scene')
    A('//Name: ik_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('requires "quatNodes" "1.0";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    # --- displayLayer ---------------------------------------------------------------
    node("displayLayer", "hidden_layer", v="no")
    A('\tsetAttr ".do" 1;')
    node("transform", "proxy_geo", t=(0, 0, 20))
    A('createNode mesh -n "proxy_geoShape" -p "proxy_geo";')
    uid("proxy_geoShape")
    pos, faces = cube(1.0)
    write_mesh_data(L, pos, faces, with_uv=False)
    node("joint", "layer_jnt", t=(1, 0, 25))
    node("reverse", "layer_rev")

    # --- 四元数ノード ---------------------------------------------------------------
    node("transform", "q_ctrl", t=(0, 0, 30), r=(0, 30, 0))
    node("joint", "q_jnt", t=(0, 0, 30), r=(0, 30, 0))
    node("decomposeMatrix", "q_dec")
    node("quatToEuler", "q_q2e")
    node("joint", "q2_jnt", t=(3, 0, 30), r=(0, 30, -45))
    node("eulerToQuat", "q_e2q_ctrl")
    node("eulerToQuat", "q_e2q_45")
    A('\tsetAttr ".irt" -type "double3" 0 0 45 ;')
    node("quatInvert", "q_inv")
    node("quatProd", "q_prod")
    node("quatToEuler", "q_q2e_2")
    node("joint", "q3_jnt", t=(6, 0, 30), r=(0, 15, 0))
    node("quatSlerp", "q_slerp")
    A('\tsetAttr ".it" 0.5;')
    node("quatToEuler", "q_q2e_3")

    # --- 3 本以上のジョイントの IK ------------------------------------------------------
    chain("rp4", 4, (0, 0, -20), (3, 0, -1))
    # 3 つ目・4 つ目は曲がりを付けて -z 側に膨らんだ形（終端は (9, 0, -20)）
    A('setAttr "rp4_c.t" -type "double3" 3 0 1 ;')
    A('setAttr "rp4_d.t" -type "double3" 3 0 0 ;')
    node("ikEffector", "rp4_eff", "rp4_c", t=(3, 0, 0), v="no")
    node("transform", "rp4_ctrl", t=(9, 0, -20))
    node("ikHandle", "rp4_ik", "rp4_ctrl")
    A('createNode poleVectorConstraint -n "rp4_pvc" -p "rp4_ik";')
    uid("rp4_pvc")
    A('\tsetAttr -k on ".w0";')
    node("transform", "rp4_pv", t=(4.5, 0, -30))
    chain("sc4", 4, (20, 0, -20), (3, 0, -1))
    A('setAttr "sc4_c.t" -type "double3" 3 0 1 ;')
    A('setAttr "sc4_d.t" -type "double3" 3 0 0 ;')
    node("ikEffector", "sc4_eff", "sc4_c", t=(3, 0, 0), v="no")
    node("transform", "sc4_ctrl", t=(29, 0, -20))
    node("ikHandle", "sc4_ik", "sc4_ctrl")

    # --- スプライン IK（skinCluster で動くカーブ） ---------------------------------------
    chain("spA", 5, (-30, 0, 0), (0, 2, 0))
    node("ikEffector", "spA_eff", "spA_3", t=(0, 2, 0), v="no")
    node("ikHandle", "spA_ik", roc="yes")
    node("transform", "spA_curve", it="no")
    A('createNode nurbsCurve -n "spA_curveShape" -p "spA_curve";')
    uid("spA_curveShape")
    A('createNode nurbsCurve -n "spA_curveShapeOrig" -p "spA_curve";')
    uid("spA_curveShapeOrig")
    A('\tsetAttr ".io" yes;')
    A(curve_cc([(-30, 0, 0), (-30, 8 / 3.0, 0), (-30, 16 / 3.0, 0), (-30, 8, 0)]))
    node("joint", "drv_bot", t=(-30, 0, 0))
    node("joint", "drv_top", t=(-30, 8, 0))
    A('createNode skinCluster -n "spA_skin";')
    uid("spA_skin")
    A('\tsetAttr -s 4 ".wl";')
    A('\tsetAttr ".wl[0:3].w" 1 0 1 1 0 1 1 1 1 1 1 1;')
    A('\tsetAttr -s 2 ".pm";')
    A('\tsetAttr ".pm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 30 0 0 1;')
    A('\tsetAttr ".pm[1]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 30 -8 0 1;')
    A('\tsetAttr ".gm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1;')
    A('createNode curveInfo -n "spA_info";')
    uid("spA_info")
    node("joint", "len_jnt", t=(8, 0, 10))

    # --- スプライン IK（ロケーターで動くカーブ・上級ツイスト） --------------------------------
    chain("spB", 5, (0, 0, 10), (2, 0, 0))
    node("ikEffector", "spB_eff", "spB_3", t=(2, 0, 0), v="no")
    node("ikHandle", "spB_ik", roc="yes", dtce="yes", dwut=4, dwua=0, dfa=0)
    A('\tsetAttr ".dwuv" -type "double3" 0 1 0 ;')
    A('\tsetAttr ".dwve" -type "double3" 0 1 0 ;')
    node("transform", "spB_curve", it="no")
    A('createNode nurbsCurve -n "spB_curveShape" -p "spB_curve";')
    uid("spB_curveShape")
    A(curve_cc([(0, 0, 10), (8 / 3.0, 0, 10), (16 / 3.0, 0, 10), (8, 0, 10)]))
    for i, x in enumerate((0, 8 / 3.0, 16 / 3.0, 8)):
        node("transform", "spB_loc%d" % i, t=(x, 0, 10))
        A('createNode locator -n "spB_loc%dShape" -p "spB_loc%d";' % (i, i))
        uid("spB_loc%dShape" % i)
    node("transform", "spB_upS", t=(0, 3, 10))
    node("transform", "spB_upE", t=(8, 3, 10))

    # --- キー -----------------------------------------------------------------------
    anim("TA", "q_ctrl_rotateX", [(1, 0), (48, 90)])
    anim("TL", "rp4_ctrl_translateX", [(1, 9), (48, 6)])
    anim("TL", "rp4_ctrl_translateY", [(1, 0), (48, 2)])
    anim("TL", "sc4_ctrl_translateX", [(1, 29), (48, 26)])
    anim("TL", "sc4_ctrl_translateZ", [(1, -20), (48, -18)])
    anim("TL", "drv_top_translateX", [(1, -30), (48, -26)])
    anim("TL", "drv_top_translateZ", [(1, 0), (48, 2)])
    anim("TL", "spB_loc3_translateY", [(1, 0), (48, 3)])
    anim("TA", "spB_upE_rotateX", [(1, 0), (48, 150)])
    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    for s in ("ikRPsolver", "ikSCsolver", "ikSplineSolver"):
        A('createNode %s -n "%s";' % (s, s))
        uid(s)
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a, b: A('connectAttr "%s" "%s";' % (a, b))  # noqa: E731
    xyz = "xyz"
    C("hidden_layer.di", "proxy_geo.do")
    C("hidden_layer.v", "layer_rev.ix")
    C("layer_rev.ox", "layer_jnt.tx")
    C("q_ctrl.m", "q_dec.imat")
    C("q_dec.oq", "q_q2e.iq")
    C("q_q2e.ort", "q_jnt.r")
    C("q_ctrl.r", "q_e2q_ctrl.irt")
    C("q_e2q_45.oq", "q_inv.iq")
    C("q_e2q_ctrl.oq", "q_prod.iq1")
    C("q_inv.oq", "q_prod.iq2")
    C("q_prod.oq", "q_q2e_2.iq")
    C("q_q2e_2.ort", "q2_jnt.r")
    C("q_e2q_ctrl.oq", "q_slerp.iq2")
    C("q_slerp.oq", "q_q2e_3.iq")
    C("q_q2e_3.ort", "q3_jnt.r")
    for handle, solver, start, eff, end in (("rp4_ik", "ikRPsolver", "rp4_a", "rp4_eff", "rp4_d"),
                                            ("sc4_ik", "ikSCsolver", "sc4_a", "sc4_eff", "sc4_d"),
                                            ("spA_ik", "ikSplineSolver", "spA_0", "spA_eff", "spA_4"),
                                            ("spB_ik", "ikSplineSolver", "spB_0", "spB_eff", "spB_4")):
        C("%s.msg" % start, "%s.hsj" % handle)
        C("%s.hp" % eff, "%s.hee" % handle)
        C("%s.msg" % solver, "%s.hsv" % handle)
        for ax in xyz:
            C("%s.t%s" % (end, ax), "%s.t%s" % (eff, ax))
    for ax in xyz:
        C("rp4_pvc.ct%s" % ax, "rp4_ik.pv%s" % ax)
    C("rp4_ik.pim", "rp4_pvc.cpim")
    C("rp4_a.pm", "rp4_pvc.ps")
    C("rp4_a.t", "rp4_pvc.crp")
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
        C("rp4_pv.%s" % src, "rp4_pvc.tg[0].%s" % dst)
    C("rp4_pvc.w0", "rp4_pvc.tg[0].tw")
    C("spA_curveShapeOrig.ws", "spA_skin.ip[0].ig")
    C("spA_skin.og[0]", "spA_curveShape.cr")
    C("drv_bot.wm", "spA_skin.ma[0]")
    C("drv_top.wm", "spA_skin.ma[1]")
    C("spA_curveShape.ws", "spA_ik.ic")
    C("spA_curveShape.ws", "spA_info.ic")
    C("spA_info.al", "len_jnt.tx")
    for i in range(4):
        C("spB_loc%dShape.wp" % i, "spB_curveShape.cp[%d]" % i)
    C("spB_curveShape.ws", "spB_ik.ic")
    C("spB_upS.wm", "spB_ik.dwum")
    C("spB_upE.wm", "spB_ik.dwue")
    for name, attr in (("q_ctrl", "rotateX"), ("rp4_ctrl", "translateX"), ("rp4_ctrl", "translateY"),
                       ("sc4_ctrl", "translateX"), ("sc4_ctrl", "translateZ"), ("drv_top", "translateX"),
                       ("drv_top", "translateZ"), ("spB_loc3", "translateY"), ("spB_upE", "rotateX")):
        short = {"translateX": "tx", "translateY": "ty", "translateZ": "tz", "rotateX": "rx"}[attr]
        C("%s_%s.o" % (name, attr), "%s.%s" % (name, short))
    A('// End of ik_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "ik_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: ik_sample.ma / ik_sample.json")


if __name__ == "__main__":
    main()
