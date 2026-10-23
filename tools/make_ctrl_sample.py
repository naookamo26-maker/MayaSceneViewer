# -*- coding: utf-8 -*-
"""第 5 段階（NURBS カーブの表示・expression）の検証用サンプル .ma を生成する。

  python tools/make_ctrl_sample.py          → samples/ctrl_sample.ma, samples/ctrl_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  カーブ
  * ctrl_circle: 周期的な 3 次の円（8 スパン）。シェイプの描画のオーバーライドで黄色（色番号 17）。
    ry 0 → 90・ty 0 → 5 のキー。arm_a.r ← ctrl_circle.r（直接の接続）
  * ctrl_square: 1 次の閉じた四角形。transform の描画のオーバーライドで RGB (0.2, 0.9, 0.5)（シェイプは指定なし）
  * ctrl_layer: ディスプレイレイヤー ctrl_layer_L（色番号 13 = 赤）に入っている
  * ctrl_tmpl: シェイプのオーバーライドでテンプレート表示（ovdt 1）
  * ctrl_hidden: シェイプが非表示（v off）
  * ctrl_tweak: 3 次・1 スパンの直線（0,0,0)〜(3,0,0) の CV 1 に .cp の調整 (0, 2, 0)
  * ctrl_multi: シェイプを 2 つ持つ transform（色番号 6 と 14）
  * ctrl_ioonly: 中間オブジェクト（io）のシェイプしかない transform（表示しない）
  スプライン IK の上級ツイスト（カーブはまっすぐ、ジョイントは +X 方向に 4 本の骨）
  * spC: world up がベクトル（始点・終点。.dwut 6）。up 軸 +Z、始点 (0, 0, 1)・終点は X 軸まわりに 170° 回したもの。
    ひねりは骨ごとに 170/3° ずつ（ベクトルを直線で補間すると途中で潰れて反転する）
  * spD: 開始ジョイントの jointOrient が (180, 0, 0)（Y 軸が下向き）。シーンの上・up 軸 Closest Y → 向きは変わらない
  * spE: spD と同じで up 軸 Positive Y → X 軸まわりに 180° 回って Y 軸が上を向く
  expression
  * expr_wave: .O[0] = sin(frame * 0.2) * 3 → e_jnt1.ty
  * expr_logic: 変数・if/else・clamp・整数の割り算。入力 .I[0] ← ctrl_circle.ty。
    .O[0] → e_jnt2.ty（ctrl_circle.ty > 2.5 なら 2 倍、そうでなければ 0）、
    .O[1] → unitConversion → e_jnt2.rz（clamp(0, 45, frame) 度）、.O[2] → e_jnt2.tx（7 / 2 = 3）
  * expr_mel: getAttr を使う式（解釈できない）→ e_jnt3.ty
  キーのあるノードにコンストレイントを付けたときの pairBlend（独自の属性 blendPoint1・blendOrient1 がウェイト）
  * bp_pv: bp_tgt への pointConstraint。blendPoint1 はキーなし（addAttr の既定値 1 のまま。setAttr は書かれない）
    → 常にコンストレイントの位置。pairBlend の入力は成分ごと（itx1・itx2 など）
  * bo_obj: bo_tgt（回転 (0, 0, 60)）への orientConstraint。blendOrient1 にキー 1 → 0 → rz = 60 · ウェイト
  * bp2_pv: bp_tgt への pointConstraint。blendPoint1 にキー 1 → 0（キーの tx は 0）
  wire（尻尾）
  * tail_0〜tail_4（+X 方向、骨の長さ 2、z = -40）のスプライン IK。カーブ tail_curveShape は wire（tail_wireDef）で変形する
    （変形前の形は中間オブジェクト tail_curveShapeOrig）。ワイヤー tail_wireShape の CV はロケーター tw_loc0〜3 で動かし、
    tw_loc3.ty にキー 0 → 3、tw_loc2.ty に 0 → 1.5。ベースワイヤー tail_wireBaseWire は非表示。影響範囲 20
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

OUT = os.path.join(ROOT, "samples", "ctrl_sample.ma")


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def circle_cvs(r=1.0):
    """Maya の円（法線 Y、周期的な 3 次・8 スパン）の CV 11 個（最後の 3 つは最初の 3 つと同じ）"""
    pts = []
    for k in range(8):
        a = math.radians(45 * k + 45)
        pts.append((r * math.cos(a), 0.0, -r * math.sin(a)))
    return pts + pts[:3]


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0005-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def shape(name, parent, degree, form, knots, cvs, **attrs):
        node("nurbsCurve", name, parent, **attrs)
        spans = len(cvs) - degree
        A('\tsetAttr ".cc" -type "nurbsCurve" \n\t\t%d %d %d no 3\n\t\t%d %s\n\t\t%d\n%s\n\t\t;'
          % (degree, spans, form, len(knots), " ".join(fmt(k) for k in knots), len(cvs),
             "\n".join("\t\t" + " ".join(fmt(x) for x in c) for c in cvs)))

    def anim(kind, name, keys):
        A('createNode animCurve%s -n "%s";' % (kind, name))
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    A('//Maya ASCII 2024 scene')
    A('//Name: ctrl_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    # --- カーブ ----------------------------------------------------------------------
    node("displayLayer", "ctrl_layer_L", c=13)
    A('\tsetAttr ".do" 1;')
    node("transform", "ctrl_circle")
    shape("ctrl_circleShape", "ctrl_circle", 3, 2, list(range(-2, 11)), circle_cvs(3), ove="yes", ovc=17)
    node("joint", "arm_a")
    node("joint", "arm_b", "arm_a", t=(4, 0, 0))
    node("transform", "ctrl_square", t=(8, 0, 0), ove="yes", ovrgbf="yes")
    A('\tsetAttr ".ovrgb" -type "float3" 0.2 0.9 0.5 ;')
    sq = [(-1, 0, -1), (1, 0, -1), (1, 0, 1), (-1, 0, 1), (-1, 0, -1)]
    shape("ctrl_squareShape", "ctrl_square", 1, 1, [0, 1, 2, 3, 4], sq)
    node("transform", "ctrl_layer", t=(14, 0, 0))
    shape("ctrl_layerShape", "ctrl_layer", 1, 0, [0, 1], [(0, 0, 0), (0, 3, 0)])
    node("transform", "ctrl_tmpl", t=(18, 0, 0))
    shape("ctrl_tmplShape", "ctrl_tmpl", 1, 0, [0, 1], [(0, 0, 0), (0, 3, 0)], ove="yes", ovdt=1)
    node("transform", "ctrl_hidden", t=(20, 0, 0))
    shape("ctrl_hiddenShape", "ctrl_hidden", 1, 0, [0, 1], [(0, 0, 0), (0, 3, 0)], v="no")
    node("transform", "ctrl_tweak", t=(0, 0, 8))
    shape("ctrl_tweakShape", "ctrl_tweak", 3, 0, [0, 0, 0, 1, 1, 1], [(0, 0, 0), (1, 0, 0), (2, 0, 0), (3, 0, 0)])
    A('\tsetAttr -s 4 ".cp[0:3]" -type "double3" 0 0 0 0 2 0 0 0 0 0 0 0 ;')
    node("transform", "ctrl_multi", t=(0, 0, -8))
    shape("ctrl_multiShape1", "ctrl_multi", 1, 0, [0, 1], [(0, 0, 0), (2, 0, 0)], ove="yes", ovc=6)
    shape("ctrl_multiShape2", "ctrl_multi", 1, 0, [0, 1], [(0, 0, 0), (0, 0, 2)], ove="yes", ovc=14)
    node("transform", "ctrl_ioonly", t=(0, 0, -12))
    shape("ctrl_ioonlyShape", "ctrl_ioonly", 1, 0, [0, 1], [(0, 0, 0), (2, 0, 0)], io="yes")

    # --- スプライン IK の上級ツイスト -----------------------------------------------------
    def spline(prefix, z, handle_attrs, jo=None, r=None):
        names = []
        for i in range(5):
            name = "%s_%d" % (prefix, i)
            attrs = {"t": (0, 0, z) if i == 0 else (2, 0, 0)}
            if i == 0 and jo:
                attrs["jo"] = jo
            if r and 0 < i < 4:
                attrs["r"] = r
            node("joint", name, names[-1] if names else None, **attrs)
            names.append(name)
        node("ikEffector", prefix + "_eff", names[3], t=(2, 0, 0), v="no")
        node("ikHandle", prefix + "_ik", roc="yes", dtce="yes", **handle_attrs)
        node("transform", prefix + "_curve")
        shape(prefix + "_curveShape", prefix + "_curve", 3, 0, [0, 0, 0, 1, 1, 1],
              [(0, 0, z), (8 / 3.0, 0, z), (16 / 3.0, 0, z), (8, 0, z)])
        return names

    twist = 170.0
    end_up = (0, -math.sin(math.radians(twist)), math.cos(math.radians(twist)))
    spline("spC", 30, {"dwut": 6, "dwua": 3, "dfa": 0, "dwuv": (0, 0, 1), "dwve": end_up}, r=(twist / 3, 0, 0))
    spline("spD", 34, {"dwut": 0, "dwua": 2, "dfa": 0}, jo=(180, 0, 0))
    spline("spE", 38, {"dwut": 0, "dwua": 0, "dfa": 0}, jo=(180, 0, 0))
    A('setAttr "spE_0.r" -type "double3" 180 0 0 ;')

    # --- expression ------------------------------------------------------------------
    def expression(name, text, n_in, n_out):
        A('createNode expression -n "%s";' % name)
        uid(name)
        A('\tsetAttr -k on ".nds";')
        if n_in:
            A('\tsetAttr -s %d ".in";' % n_in)
        A('\tsetAttr -s %d ".out";' % n_out)
        A('\tsetAttr ".ixp" -type "string" "%s";' % text.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n"))

    node("joint", "e_jnt1", t=(0, 3 * math.sin(0.2), -20))
    expression("expr_wave", ".O[0] = sin(frame * 0.2) * 3;", 0, 1)
    node("joint", "e_jnt2", t=(3, 0, -20), r=(0, 0, 1))
    expression("expr_logic", "// コメント\nfloat $h = .I[0];\nif ($h > 2.5)\n\t.O[0] = $h * 2;\nelse\n\t.O[0] = 0;\n"
               ".O[1] = clamp(0, 45, frame);\n.O[2] = 7 / 2;", 1, 3)
    node("unitConversion", "expr_logic_uc")
    A('\tsetAttr ".cf" 0.017453292519943295;')
    node("joint", "e_jnt3", t=(6, 1, -20))
    expression("expr_mel", '.O[0] = `getAttr "ctrl_circle.ty"`;', 0, 1)

    # --- pairBlend（コンストレイント + キー。blendPoint1・blendOrient1） ----------------------
    def blend_attr(name):
        A('\taddAttr -ci true -k true -sn "%s" -ln "%s" -dv 1 -smn 0 -smx 1 -at "double";' % (name, name))

    def con(kind, name, parent, target):
        A('createNode %s -n "%s" -p "%s";' % (kind, name, parent))
        uid(name)
        A('\taddAttr -dcb 0 -ci true -k true -sn "w0" -ln "%sW0" -dv 1 -min 0 -at "double";' % target)
        A('\tsetAttr -k on ".w0";')

    node("transform", "bp_tgt", t=(10, 0, -30))
    node("joint", "bp_pv", t=(10, 0, -30))
    blend_attr("blendPoint1")
    con("pointConstraint", "bp_pv_pointConstraint1", "bp_pv", "bp_tgt")
    node("pairBlend", "bp_pb")
    node("joint", "bp2_pv", t=(10, 0, -30))
    blend_attr("blendPoint1")
    con("pointConstraint", "bp2_pv_pointConstraint1", "bp2_pv", "bp_tgt")
    node("pairBlend", "bp2_pb")
    node("transform", "bo_tgt", t=(0, 0, -30), r=(0, 0, 60))
    node("joint", "bo_obj", t=(0, 2, -30), r=(0, 0, 60))
    blend_attr("blendOrient1")
    con("orientConstraint", "bo_obj_orientConstraint1", "bo_obj", "bo_tgt")
    node("pairBlend", "bo_pb")
    anim("TL", "bp_pv_translateX", [(1, 0), (48, 0)])
    anim("TL", "bp2_pv_translateX", [(1, 0), (48, 0)])
    anim("TU", "bp2_pv_blendPoint1", [(1, 1), (48, 0)])
    anim("TA", "bo_obj_rotateZ", [(1, 0), (48, 0)])
    anim("TU", "bo_obj_blendOrient1", [(1, 1), (48, 0)])
    anim("TL", "bp_tgt_translateY", [(1, 0), (48, 5)])

    # --- wire（尻尾: スプライン IK のカーブをワイヤーで変形） ------------------------------------
    straight = [(0, 0, -40), (8 / 3.0, 0, -40), (16 / 3.0, 0, -40), (8, 0, -40)]
    names = []
    for i in range(5):
        node("joint", "tail_%d" % i, names[-1] if names else None, t=(0, 0, -40) if i == 0 else (2, 0, 0))
        names.append("tail_%d" % i)
    node("ikEffector", "tail_eff", "tail_3", t=(2, 0, 0), v="no")
    node("ikHandle", "tail_ik", roc="yes")
    node("transform", "tail_curve", it="no")
    node("nurbsCurve", "tail_curveShape", "tail_curve")
    shape("tail_curveShapeOrig", "tail_curve", 3, 0, [0, 0, 0, 1, 1, 1], straight, io="yes")
    node("transform", "tail_wire")
    shape("tail_wireShape", "tail_wire", 3, 0, [0, 0, 0, 1, 1, 1], straight)
    node("transform", "tail_wireBaseWire", v="no")
    shape("tail_wireBaseWireShape", "tail_wireBaseWire", 3, 0, [0, 0, 0, 1, 1, 1], straight)
    for i, c in enumerate(straight):
        node("transform", "tw_loc%d" % i, t=c)
        node("locator", "tw_loc%dShape" % i, "tw_loc%d" % i)
    A('createNode wire -n "tail_wireDef";')
    uid("tail_wireDef")
    A('\tsetAttr ".dds[0]" 20;')
    A('\tsetAttr -s 4 ".wl[0].w[0:3]"  1 1 1 1;')
    anim("TL", "tw_loc3_translateY", [(1, 0), (48, 3)])
    anim("TL", "tw_loc2_translateY", [(1, 0), (48, 1.5)])

    anim("TA", "ctrl_circle_rotateY", [(1, 0), (48, 90)])
    anim("TL", "ctrl_circle_translateY", [(1, 0), (48, 5)])

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('createNode ikSplineSolver -n "ikSplineSolver";')
    uid("ikSplineSolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a_, b_: A('connectAttr "%s" "%s";' % (a_, b_))  # noqa: E731
    C("ctrl_layer_L.di", "ctrl_layer.do")
    C("ctrl_circle_rotateY.o", "ctrl_circle.ry")
    C("ctrl_circle_translateY.o", "ctrl_circle.ty")
    C("ctrl_circle.r", "arm_a.r")
    C("tail_0.msg", "tail_ik.hsj")
    C("tail_eff.hp", "tail_ik.hee")
    C("ikSplineSolver.msg", "tail_ik.hsv")
    for ax in "xyz":
        C("tail_4.t%s" % ax, "tail_eff.t%s" % ax)
    C("tail_curveShape.ws", "tail_ik.ic")
    C("tail_curveShapeOrig.ws", "tail_wireDef.ip[0].ig")
    C("tail_wireDef.og[0]", "tail_curveShape.cr")
    C("tail_wireShape.ws", "tail_wireDef.dw[0]")
    C("tail_wireBaseWireShape.ws", "tail_wireDef.bw[0]")
    for i in range(4):
        C("tw_loc%dShape.wp" % i, "tail_wireShape.cp[%d]" % i)
    C("tw_loc3_translateY.o", "tw_loc3.ty")
    C("tw_loc2_translateY.o", "tw_loc2.ty")
    C("bp_tgt_translateY.o", "bp_tgt.ty")
    for pv, pb in (("bp_pv", "bp_pb"), ("bp2_pv", "bp2_pb")):
        c = pv + "_pointConstraint1"
        for ax in "xyz":
            C("%s.ot%s" % (pb, ax), "%s.t%s" % (pv, ax))
            C("%s.ct%s" % (c, ax), "%s.it%s2" % (pb, ax))
        C("%s_translateX.o" % pv, "%s.itx1" % pb)
        C("%s.blendPoint1" % pv, "%s.w" % pb)
        C("%s.pim" % pv, "%s.cpim" % c)
        for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
            C("bp_tgt.%s" % src, "%s.tg[0].%s" % (c, dst))
        C("%s.w0" % c, "%s.tg[0].tw" % c)
    C("bp2_pv_blendPoint1.o", "bp2_pv.blendPoint1")
    C("bo_pb.orz", "bo_obj.rz")
    C("bo_obj_rotateZ.o", "bo_pb.irz1")
    C("bo_obj_orientConstraint1.crz", "bo_pb.irz2")
    C("bo_obj_blendOrient1.o", "bo_obj.blendOrient1")
    C("bo_obj.blendOrient1", "bo_pb.w")
    C("bo_obj.pim", "bo_obj_orientConstraint1.cpim")
    C("bo_obj.jo", "bo_obj_orientConstraint1.cjo")
    C("bo_obj.ro", "bo_obj_orientConstraint1.cro")
    C("bo_obj.is", "bo_obj_orientConstraint1.is")
    C("bo_tgt.r", "bo_obj_orientConstraint1.tg[0].tr")
    C("bo_tgt.ro", "bo_obj_orientConstraint1.tg[0].tro")
    C("bo_tgt.pm", "bo_obj_orientConstraint1.tg[0].tpm")
    C("bo_obj_orientConstraint1.w0", "bo_obj_orientConstraint1.tg[0].tw")
    C("expr_wave.out[0]", "e_jnt1.ty")
    C(":time1.o", "expr_wave.tim")
    C("ctrl_circle.ty", "expr_logic.in[0]")
    C("expr_logic.out[0]", "e_jnt2.ty")
    C("expr_logic.out[1]", "expr_logic_uc.i")
    C("expr_logic_uc.o", "e_jnt2.rz")
    C("expr_logic.out[2]", "e_jnt2.tx")
    C("expr_mel.out[0]", "e_jnt3.ty")
    for p in ("spC", "spD", "spE"):
        C("%s_0.msg" % p, "%s_ik.hsj" % p)
        C("%s_eff.hp" % p, "%s_ik.hee" % p)
        C("ikSplineSolver.msg", "%s_ik.hsv" % p)
        for ax in "xyz":
            C("%s_4.t%s" % (p, ax), "%s_eff.t%s" % (p, ax))
        C("%s_curveShape.ws" % p, "%s_ik.ic" % p)
    A('// End of ctrl_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "ctrl_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: ctrl_sample.ma / ctrl_sample.json")


if __name__ == "__main__":
    main()
