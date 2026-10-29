# -*- coding: utf-8 -*-
"""Maya 2024 以降の計算ノード・Maya 2020 以降の行列ノード・Maya 2026 からの DL 版と addDL・multDL の検証用サンプルを生成する。

  python tools/make_math_sample.py   → samples/math_sample.ma, samples/math_sample.json

再生範囲 1〜24。ctrl.tx にキー（1: 0 → 24: 10）、ctrl.rz にキー（1: 0 → 24: 90）、ctrl.tz = 5。
  * スカラー: addDL・multDL・sum・multiply・subtract・clampRange・smoothStep・divide → lerp・cos・sin（ファイルの値 30 度）・
    acos・greaterThan → not・max・round・modulo・power・sumDL・distanceBetweenDL → ジョイントの移動・回転
  * ベクトル: crossProduct・angleBetween・rotateVector
  * 行列: blendMatrix（ウェイト ← ctrl.tx / 10）・pickMatrix（移動だけ）・aimMatrix（X 軸を ctrl へ）・parentMatrix（オフセット (0, 2, 0)）・
    wtAddMatrix・translationFromMatrix・rotationFromMatrix・multiplyPointByMatrix・pointMatrixMult・axisFromMatrix
    → offsetParentMatrix・移動・回転
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "math_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "math_sample.json")


def main():
    L = ['//Maya ASCII 2027 scene', '//Name: math_sample.ma', 'requires maya "2027";',
         'currentUnit -l centimeter -a degree -t film;',
         'createNode transform -n "ctrl";', '\tsetAttr ".tz" 5;',
         'createNode joint -n "mA";',
         'createNode joint -n "mB";', '\tsetAttr ".t" -type "double3" 10 0 0 ;', '\tsetAttr ".r" -type "double3" 0 0 90 ;']
    C = []

    def node(t, n, *attrs):
        L.append('createNode %s -n "%s";' % (t, n))
        for a in attrs:
            L.append('\tsetAttr %s;' % a)

    def joint(n):
        L.append('createNode joint -n "%s";' % n)

    def con(a, b):
        C.append('connectAttr "%s" "%s";' % (a, b))

    # --- スカラー -------------------------------------------------------------------
    joint("s_add")
    node("addDL", "add_dl", '".i2" 2')
    con("ctrl.tx", "add_dl.i1"); con("add_dl.o", "s_add.tx")
    node("multDL", "mult_dl", '".i2" 3')
    con("ctrl.tx", "mult_dl.i1"); con("mult_dl.o", "s_add.ty")
    joint("s_sum")
    node("sum", "sum1", '".i[1]" 1', '".i[2]" 2')
    con("ctrl.tx", "sum1.i[0]"); con("sum1.o", "s_sum.tx")
    node("multiply", "mul1", '".i[1]" 2')
    con("ctrl.tx", "mul1.i[0]"); con("mul1.o", "s_sum.ty")
    node("subtract", "sub1", '".i2" 4')
    con("ctrl.tx", "sub1.i1"); con("sub1.o", "s_sum.tz")
    joint("s_clamp")
    node("clampRange", "clamp1", '".min" 2', '".max" 6')
    con("ctrl.tx", "clamp1.i"); con("clamp1.o", "s_clamp.tx")
    node("smoothStep", "ss1", '".re" 10')
    con("ctrl.tx", "ss1.i"); con("ss1.o", "s_clamp.ty")
    node("divide", "div1", '".i2" 10')
    node("lerp", "lerp1", '".i1" 2', '".i2" 12')
    con("ctrl.tx", "div1.i1"); con("div1.o", "lerp1.w"); con("lerp1.o", "s_clamp.tz")
    joint("s_trig")
    node("cos", "cos1")
    con("ctrl.rz", "cos1.i"); con("cos1.o", "s_trig.tx")
    node("sin", "sin1", '".i" 30')                        # ファイルの値（度）
    con("sin1.o", "s_trig.ty")
    node("acos", "acos1")
    con("cos1.o", "acos1.i"); con("acos1.o", "s_trig.rz")
    joint("s_cmp")
    node("greaterThan", "gt1", '".i2" 5')
    con("ctrl.tx", "gt1.i1"); con("gt1.o", "s_cmp.tx")
    node("not", "not1")
    con("gt1.o", "not1.i"); con("not1.o", "s_cmp.ty")
    node("max", "max1", '".i[1]" 3')
    con("ctrl.tx", "max1.i[0]"); con("max1.o", "s_cmp.tz")
    joint("s_rnd")
    node("round", "round1")
    con("ctrl.tx", "round1.i"); con("round1.o", "s_rnd.tx")
    node("modulo", "mod1", '".m" 3')
    con("ctrl.tx", "mod1.i"); con("mod1.o", "s_rnd.ty")
    node("power", "pow1")                                  # 指数は既定値 2
    con("ctrl.tx", "pow1.i"); con("pow1.o", "s_rnd.tz")
    joint("s_dl")
    node("sumDL", "sum_dl", '".i[1]" 5')
    con("ctrl.tx", "sum_dl.i[0]"); con("sum_dl.o", "s_dl.tx")
    node("distanceBetweenDL", "dist_dl")
    con("ctrl.t", "dist_dl.p2"); con("dist_dl.d", "s_dl.ty")

    # --- ベクトル -----------------------------------------------------------------
    joint("v_cross")
    node("crossProduct", "cross1", '".i1" -type "double3" 1 0 0 ', '".i2" -type "double3" 0 1 0 ')
    con("cross1.o", "v_cross.t")
    joint("v_ab")
    node("angleBetween", "ab1", '".v1" -type "double3" 1 0 0 ', '".v2" -type "double3" 0 1 0 ')
    con("ab1.eu", "v_ab.r")
    joint("v_rot")
    node("rotateVector", "rv1", '".i" -type "double3" 1 0 0 ')
    con("ctrl.r", "rv1.r"); con("rv1.o", "v_rot.t")

    # --- 行列 -----------------------------------------------------------------------
    for n in ("m_blend", "m_pick", "m_aim", "m_par", "m_wt", "m_tr", "m_pt", "m_pmm", "m_ax"):
        L.append('createNode joint -n "%s";' % n)
    node("blendMatrix", "bm1")
    con("mA.wm", "bm1.imat"); con("mB.wm", "bm1.tgt[0].tmat"); con("div1.o", "bm1.tgt[0].wgt")
    con("bm1.omat", "m_blend.opm")
    node("pickMatrix", "pick1", '".rot" no', '".sca" no', '".she" no')
    con("mB.wm", "pick1.imat"); con("pick1.tmat", "m_pick.opm")
    node("aimMatrix", "aim1")
    con("mA.wm", "aim1.imat"); con("ctrl.wm", "aim1.pmat"); con("aim1.tmat", "m_aim.opm")
    node("parentMatrix", "par1", '".tgt[0].ofm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 2 0 1')
    con("ctrl.wm", "par1.tgt[0].tmat"); con("par1.omat", "m_par.opm")
    node("wtAddMatrix", "wt1", '".i[0].w" 0.5', '".i[1].w" 0.5')
    con("mA.wm", "wt1.i[0].m"); con("mB.wm", "wt1.i[1].m"); con("wt1.o", "m_wt.opm")
    node("translationFromMatrix", "tfm1")
    con("ctrl.wm", "tfm1.i"); con("tfm1.o", "m_tr.t")
    node("rotationFromMatrix", "rfm1")
    con("ctrl.wm", "rfm1.i"); con("rfm1.o", "m_tr.r")
    node("multiplyPointByMatrix", "mpm1", '".x" 1')
    con("ctrl.wm", "mpm1.m"); con("mpm1.o", "m_pt.t")
    node("pointMatrixMult", "pmm1", '".ip" -type "double3" 1 0 0 ')
    con("ctrl.wm", "pmm1.im"); con("pmm1.o", "m_pmm.t")
    node("axisFromMatrix", "axm1", '".op" 1')
    con("ctrl.wm", "axm1.i"); con("axm1.o", "m_ax.t")

    L += ['createNode animCurveTL -n "ctrl_translateX";', '\tsetAttr ".tan" 2;',
          '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 10;',
          'createNode animCurveTA -n "ctrl_rotateZ";', '\tsetAttr ".tan" 2;',
          '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
          'createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
          '\tsetAttr ".st" 6;']
    C = ['connectAttr "ctrl_translateX.o" "ctrl.tx";', 'connectAttr "ctrl_rotateZ.o" "ctrl.rz";'] + C
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of math_sample.ma']) + "\n")
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
