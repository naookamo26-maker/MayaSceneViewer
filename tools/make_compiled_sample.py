# -*- coding: utf-8 -*-
"""リグの専用の評価（web_src/src/rigCompiled.js）の検証用サンプルを生成する。

  python tools/make_compiled_sample.py   → samples/compiled_sample.ma, samples/compiled_sample.json

段階 1 で扱う要素（キーで動くノード・parentConstraint）を詰め込み、専用の評価の計画が作られることと、
従来の評価器（RigEvaluator）と全フレームでビット単位で同じ結果になることを web_src/tests/compiled.test.mjs で確かめる。
再生範囲 1〜30。
  * grp（動かない）→ c0（回転順 zxy・ピボット (1, 0, 0)・(0, 0.5, 0)・移動と回転のキー）
      → c1（ジョイント。jointOrient・回転の制限・rz のキー）→ c2（スケールのキー・scalePivot）→ s3（動かない）
      → jt（ジョイント。c2 のスケールを .is で打ち消す・rx のキー）
  * j0（ジョイント。回転順 yzx・jointOrient・回転ピボット）← c0 への parentConstraint（オフセットの移動・回転、crp・crt）
  * j1（j0 の子。j0 のスケールを .is で打ち消す）← c1（0.3）と s3（0.7）への parentConstraint（前回の値 .lr）
  * j2（j1 の子）← jt への parentConstraint（ターゲットの親のスケールの打ち消し tsc）
  * j3（offsetParentMatrix あり）← j1（コンストレイントで動くノード）への parentConstraint
  * jm（tx にキー）← c0 への parentConstraint（回転だけ）
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "compiled_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "compiled_sample.json")


def main():
    L = ['//Maya ASCII 2027 scene', '//Name: compiled_sample.ma', 'requires maya "2027";',
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

    def keys(n, attr, kind, pairs):
        cname = "%s_%s" % (n, attr)
        A('createNode %s -n "%s";' % (kind, cname))
        A('\tsetAttr ".tan" 18;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(pairs), len(pairs) - 1, " ".join("%g %g" % p for p in pairs)))
        con(cname + ".o", "%s.%s" % (n, attr))

    PARENT = (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"), ("pm", "tpm"))
    JOINT = (("jo", "tjo"), ("ssc", "tsc"), ("is", "tis"))

    def parent_constraint(name, driven, targets, attrs=(), outputs="tr"):
        A('createNode parentConstraint -n "%s" -p "%s";' % (name, driven))
        for i, (t, _w, _off, _joint) in enumerate(targets):
            A('\taddAttr -dcb 0 -ci true -k true -sn "w%d" -ln "%sW%d" -dv 1 -min 0 -at "double";' % (i, t, i))
        for i, (_t, w, off, _joint) in enumerate(targets):
            A('\tsetAttr -k on ".w%d" %g;' % (i, w))
            if off:
                A('\tsetAttr ".tg[%d].tot" -type "double3" %g %g %g ;' % ((i,) + off[0]))
                A('\tsetAttr ".tg[%d].tor" -type "double3" %g %g %g ;' % ((i,) + off[1]))
        for a in attrs:
            A('\tsetAttr %s;' % a)
        for i, (t, _w, _off, joint) in enumerate(targets):
            con("%s.w%d" % (name, i), "%s.tg[%d].tw" % (name, i))
            for src, dst in PARENT + (JOINT if joint else ()):
                con("%s.%s" % (t, src), "%s.tg[%d].%s" % (name, i, dst))
        con(driven + ".pim", name + ".cpim")
        con(driven + ".rp", name + ".crp")
        con(driven + ".rpt", name + ".crt")
        con(driven + ".ro", name + ".cro")
        for a in "xyz":
            if "t" in outputs:
                con("%s.ct%s" % (name, a), "%s.t%s" % (driven, a))
            if "r" in outputs:
                con("%s.cr%s" % (name, a), "%s.r%s" % (driven, a))

    frames = range(1, 31, 3)
    node("transform", "grp", None, '".t" -type "double3" 0 1 0 ', '".r" -type "double3" 0 20 0 ')
    node("transform", "c0", "grp", '".ro" 2', '".rp" -type "double3" 1 0 0 ', '".rpt" -type "double3" 0 0.5 0 ')
    keys("c0", "tx", "animCurveTL", [(f, 0.2 * f) for f in frames])
    keys("c0", "rx", "animCurveTA", [(f, 7 * f % 90) for f in frames])
    keys("c0", "ry", "animCurveTA", [(f, -4 * f) for f in frames])
    keys("c0", "rz", "animCurveTA", [(f, 3 * f + 10) for f in frames])
    node("joint", "c1", "c0", '".t" -type "double3" 2 0 0 ', '".jo" -type "double3" 10 20 30 ',
         '".mnrl" -type "double3" -45 -45 -20 ', '".mxrl" -type "double3" 45 45 40 ', '".mrze" yes', '".xrze" yes')
    keys("c1", "rz", "animCurveTA", [(f, 5 * f - 60) for f in frames])
    node("transform", "c2", "c1", '".t" -type "double3" 1.5 0 0 ', '".sp" -type "double3" 0 0.3 0 ')
    for a in ("sx", "sy", "sz"):
        keys("c2", a, "animCurveTU", [(f, 1 + 0.02 * f * (1 + "xyz".index(a[1]))) for f in frames])
    node("transform", "s3", "c2", '".t" -type "double3" 0 1 0 ', '".r" -type "double3" 15 0 0 ')
    node("joint", "jt", "c2", '".t" -type "double3" 0 0 1 ', '".jo" -type "double3" 0 30 0 ')
    con("c2.s", "jt.is")
    keys("jt", "rx", "animCurveTA", [(f, 2 * f) for f in frames])

    node("joint", "j0", None, '".ro" 1', '".jo" -type "double3" 0 0 15 ', '".rp" -type "double3" 0.2 0 0 ')
    parent_constraint("j0_pc", "j0", [("c0", 1, ((1, 0, 0), (0, 0.3, 0)), False)])
    node("joint", "j1", "j0", '".t" -type "double3" 3 0 0 ')
    con("j0.s", "j1.is")
    parent_constraint("j1_pc", "j1", [("c1", 0.3, None, True), ("s3", 0.7, None, False)], ('".lr" -type "double3" 0 360 0 ',))
    node("joint", "j2", "j1", '".t" -type "double3" 2 0 0 ')
    parent_constraint("j2_pc", "j2", [("jt", 1, None, True)])
    node("joint", "j3", None, '".opm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 5 0 0 1')
    parent_constraint("j3_pc", "j3", [("j1", 1, None, True)])
    node("joint", "jm", None)
    keys("jm", "tx", "animCurveTL", [(f, -0.1 * f) for f in frames])
    parent_constraint("jm_pc", "jm", [("c0", 1, None, False)], outputs="r")

    A('createNode script -n "sceneConfigurationScriptNode";')
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 30 -ast 1 -aet 30 ";')
    A('\tsetAttr ".st" 6;')
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ['// End of compiled_sample.ma']) + "\n")
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
