# -*- coding: utf-8 -*-
"""大きな合成リグの .ma（と共通 JSON）を作る（ベンチ用。samples/ には入れない）。

  python tools/make_big_rig_sample.py 手足の数 フレーム数 出力.ma [--json 出力.json]

手足 1 本: コントローラー + 3 関節の RP IK + 極ベクトル + parentConstraint + 計算ノード
（multiplyDivide・plusMinusAverage・condition・clamp・multMatrix・decomposeMatrix・unitConversion）。
手足 300 本・120 フレームで 7,204 ノード・接続 16,501。

--json を付けると、extract_ma.load_ma(…, animation=True) の結果も保存する。
ベンチ: cd web_src && node --expose-gc bench/rig.bench.mjs --file 出力.json
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def build(n: int, frames: int) -> tuple[str, int, int]:
    """手足 n 本・frames フレームのシーンの .ma の文と、ノードの数・接続の数を返す"""
    L = ['//Maya ASCII 2024 scene', 'requires maya "2024";', 'currentUnit -l centimeter -a degree -t film;']
    C = []

    def node(t, name, p=None, attrs=()):
        L.append('createNode %s -n "%s"%s;' % (t, name, ' -p "%s"' % p if p else ""))
        for a in attrs:
            L.append("\t" + a + ";")

    def con(a, b):
        C.append('connectAttr "%s" "%s";' % (a, b))

    def curve(kind, name, vals):
        keys = " ".join("%d %g" % (1 + i * (frames // (len(vals) - 1)), v) for i, v in enumerate(vals))
        node(kind, name, attrs=['setAttr ".tan" 18',
                                'setAttr -s %d ".ktv[0:%d]" %s' % (len(vals), len(vals) - 1, keys)])

    node("ikRPsolver", "ikRPsolver")
    node("transform", "root")
    curve("animCurveTL", "root_tx", [0, 5, 0])
    con("root_tx.o", "root.tx")
    for i in range(n):
        p = "L%d_" % i
        node("transform", p + "grp", "root", ['setAttr ".t" -type "double3" %d 0 0' % (i * 3)])
        node("joint", p + "a", p + "grp", ['setAttr ".jo" -type "double3" 0 0 -60'])
        node("joint", p + "b", p + "a", ['setAttr ".t" -type "double3" 4 0 0',
                                         'setAttr ".jo" -type "double3" 0 0 120',
                                         'setAttr ".pa" -type "double3" 0 0 10'])
        node("joint", p + "c", p + "b", ['setAttr ".t" -type "double3" 4 0 0'])
        node("ikEffector", p + "eff", p + "b")
        node("transform", p + "ctrl", p + "grp", ['setAttr ".t" -type "double3" 4 0 0',
                                                  'addAttr -ci true -sn "st" -ln "stretch" -dv 1 -at "double"',
                                                  'setAttr -k on ".st" 1'])
        node("ikHandle", p + "ik", p + "ctrl")
        node("poleVectorConstraint", p + "pvc", p + "ik")
        node("transform", p + "pv", p + "grp", ['setAttr ".t" -type "double3" 2 5 0'])
        con(p + "a.msg", p + "ik.hsj")
        con(p + "eff.hp", p + "ik.hee")
        con("ikRPsolver.msg", p + "ik.hsv")
        for ax in "xyz":
            con(p + "c.t" + ax, p + "eff.t" + ax)
        con(p + "pv.t", p + "pvc.tg[0].tt")
        con(p + "pv.rp", p + "pvc.tg[0].trp")
        con(p + "pv.rpt", p + "pvc.tg[0].trt")
        con(p + "pv.pm", p + "pvc.tg[0].tpm")
        con(p + "pvc.w0", p + "pvc.tg[0].tw")
        con(p + "ik.pim", p + "pvc.cpim")
        con(p + "a.pm", p + "pvc.ps")
        con(p + "a.t", p + "pvc.crp")
        for ax in "xyz":
            con(p + "pvc.ct" + ax, p + "ik.pv" + ax)
        for k, ax in enumerate("xy"):
            base = 4 if ax == "x" else 0
            curve("animCurveTL", p + "ctrl_t" + ax, [base, 2 + k, 6, base, 3])
            con(p + "ctrl_t" + ax + ".o", p + "ctrl.t" + ax)
        curve("animCurveTA", p + "ctrl_rz", [0, 30, -30, 0])
        con(p + "ctrl_rz.o", p + "ctrl.rz")
        # 手首の先のジョイント 4 つ: parentConstraint・計算ノード・行列ノード
        node("joint", p + "hand", p + "grp")
        node("parentConstraint", p + "pc", p + "hand")
        for a, b in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"),
                     ("pm", "tpm"), ("jo", "tjo")):
            con(p + "c." + a, p + "pc.tg[0]." + b)
        con(p + "pc.w0", p + "pc.tg[0].tw")
        con(p + "hand.pim", p + "pc.cpim")
        con(p + "hand.ro", p + "pc.cro")
        con(p + "hand.rp", p + "pc.crp")
        con(p + "hand.rpt", p + "pc.crt")
        con(p + "hand.jo", p + "pc.cjo")
        for ax in "xyz":
            con(p + "pc.ct" + ax, p + "hand.t" + ax)
            con(p + "pc.cr" + ax, p + "hand.r" + ax)
        node("multiplyDivide", p + "md", attrs=['setAttr ".i2" -type "float3" 2 2 2'])
        node("plusMinusAverage", p + "pma")
        node("condition", p + "cond", attrs=['setAttr ".op" 2'])
        node("clamp", p + "cl", attrs=['setAttr ".mx" -type "float3" 9 9 9'])
        con(p + "ctrl.t", p + "md.i1")
        con(p + "md.o", p + "pma.i3[0]")
        con(p + "ctrl.s", p + "pma.i3[1]")
        con(p + "pma.o3x", p + "cond.ft")
        con(p + "pma.o3", p + "cond.ct")
        con(p + "cond.oc", p + "cl.ip")
        node("joint", p + "tw1", p + "grp")
        con(p + "cl.op", p + "tw1.t")
        node("multMatrix", p + "mm")
        node("decomposeMatrix", p + "dm")
        con(p + "c.wm[0]", p + "mm.i[0]")
        con(p + "grp.wim[0]", p + "mm.i[1]")
        con(p + "mm.o", p + "dm.imat")
        node("joint", p + "tw2", p + "grp")
        con(p + "dm.ot", p + "tw2.t")
        con(p + "dm.or", p + "tw2.r")
        con(p + "dm.os", p + "tw2.s")
        node("unitConversion", p + "uc", attrs=['setAttr ".cf" 0.5'])
        node("joint", p + "tw3", p + "tw2")
        con(p + "ctrl.rz", p + "uc.i")
        con(p + "uc.o", p + "tw3.rx")
    node("script", "sceneConfigurationScriptNode",
         attrs=['setAttr ".b" -type "string" "playbackOptions -min 1 -max %d -ast 1 -aet %d "' % (frames, frames),
                'setAttr ".st" 6'])
    nodes = sum(1 for x in L if x.startswith("createNode"))
    return "\n".join(L + C) + "\n", nodes, len(C)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="大きな合成リグの .ma を作る（ベンチ用）")
    ap.add_argument("limbs", type=int, help="手足の数")
    ap.add_argument("frames", type=int, help="フレーム数（再生範囲 1〜この数）")
    ap.add_argument("out", help="出力する .ma")
    ap.add_argument("--json", default=None, help="共通 JSON も保存する（アニメーションを含む）")
    args = ap.parse_args(argv)
    if args.limbs < 1 or args.frames < 4:
        ap.error("手足は 1 本以上、フレームは 4 以上にしてください")
    text, nodes, conns = build(args.limbs, args.frames)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(text)
    print("%s: ノード %d・接続 %d" % (args.out, nodes, conns))
    if args.json:
        sys.path.insert(0, ROOT)
        from ma_viewer.extract_ma import load_ma
        scene = load_ma(args.out, animation=True)
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(scene, f, ensure_ascii=False, separators=(",", ":"))
        print("%s: 共通 JSON" % args.json)
    return 0


if __name__ == "__main__":
    sys.exit(main())
