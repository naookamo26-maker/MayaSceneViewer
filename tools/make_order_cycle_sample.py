# -*- coding: utf-8 -*-
"""専用の評価（web_src/src/rigCompiled.js）の、ノード単位の計算の順番の循環を確かめるサンプルを生成する。

  python tools/make_order_cycle_sample.py   → samples/order_cycle_sample.ma, samples/order_cycle_sample.json

  * ジョイント ty（移動は z への pointConstraint で決まる）・tx（rz を ty.tx から読む）。ty.rx ← tx.rz
    → 専用の評価のノード単位の順番では、tx は ty（コンストレイントで移動するノード）を先に、ty は回転の入力の tx を
      先に求めることになって循環する。RigEvaluator は ty の移動だけ（回転を求めない chan 't'）を読むので計算できる
  * z: tx にキー。childY: ty の子（tz にキー）
  再生範囲 1〜24
web_src/tests/compiled.test.mjs で、循環の中のノードを任せて専用の評価になり、汎用の経路と同じ値になることを確かめる。
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "order_cycle_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "order_cycle_sample.json")


def main():
    L = ['//Maya ASCII 2024 scene', '//Name: order_cycle_sample.ma', 'requires maya "2024";',
         'currentUnit -l centimeter -a degree -t film;']
    C = []

    def node(name, t, parent=None):
        L.append('createNode joint -n "%s"%s;' % (name, ' -p "%s"' % parent if parent else ""))
        L.append('\tsetAttr ".t" -type "double3" %g %g %g ;' % t)

    def key(name, attr, kind, values):
        cn = "%s_%s" % (name, attr)
        L.append('createNode animCurve%s -n "%s";' % (kind, cn))
        L.append('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(values), len(values) - 1, " ".join("%g %g" % kv for kv in values)))
        C.append('connectAttr "%s.o" "%s.%s";' % (cn, name, attr))

    node("z", (0, 0, 0))
    node("ty", (2, 0, 0))
    node("tx", (-2, 0, 0))
    node("childY", (0, 1, 0), parent="ty")
    key("z", "tx", "TL", [(1, 0), (12, 3), (24, -2)])
    key("z", "ty", "TL", [(1, 0), (24, 4)])
    key("childY", "tz", "TL", [(1, 0), (24, 2)])
    # ty の移動: z への pointConstraint
    L.append('createNode pointConstraint -n "ty_pc" -p "ty";')
    L.append('\taddAttr -dcb 0 -ci true -k true -sn "w0" -ln "zW0" -dv 1 -min 0 -at "double";')
    L.append('\tsetAttr -k on ".w0" 1;')
    C.append('connectAttr "ty_pc.w0" "ty_pc.tg[0].tw";')
    for src, dst in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("pm", "tpm")):
        C.append('connectAttr "z.%s" "ty_pc.tg[0].%s";' % (src, dst))
    for src, dst in (("pim", "cpim"), ("rp", "crp"), ("rpt", "crt")):
        C.append('connectAttr "ty.%s" "ty_pc.%s";' % (src, dst))
    for a in "xyz":
        C.append('connectAttr "ty_pc.ct%s" "ty.t%s";' % (a, a))
    C.append('connectAttr "ty.tx" "tx.rz";')
    C.append('connectAttr "tx.rz" "ty.rx";')
    L += ['createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";', '\tsetAttr ".st" 6;']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ["// End of order_cycle_sample.ma"]) + "\n")
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
