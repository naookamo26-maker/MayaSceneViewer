# -*- coding: utf-8 -*-
"""スキン付きメッシュの Skeleton の共有（web_src/src/sceneBuilder.js の shareSkeletons）の検証用サンプルを生成する。

  python tools/make_shared_skin_sample.py   → samples/shared_skin_sample.ma, samples/shared_skin_sample.json

  * ジョイントの鎖 A（a0〜a14）・B（b0〜b9）。どちらも rz にキー（再生範囲 1〜24）
  * m0: A の a0〜a9 にバインド、m1: A の a5〜a14（m0 と一部が重なり、スロットの番号が違う）、
    m2: B（インフルエンスの並びを逆順にする）→ m0〜m2 は 1 つの Skeleton を共有できる
  * m3: A の a0〜a4 にバインドするが、a2 のバインド行列（.pm）だけ違う → 別の Skeleton のまま
web_src/tests/scene.test.mjs で、共有したときとしないときで、スキンで変形した頂点の位置が同じことを確かめる。
"""
from __future__ import annotations

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "shared_skin_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "shared_skin_sample.json")


def fmt(v):
    return " ".join("%.6g" % x for x in v)


def mat_t(x, y, z):
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]


def main():
    sys.path.insert(0, HERE)
    from make_sample_ma import write_mesh_data
    L = ['//Maya ASCII 2024 scene', '//Name: shared_skin_sample.ma', 'requires maya "2024";',
         'currentUnit -l centimeter -a degree -t film;']
    C = []
    world = {}
    for chain, n, x0 in (("a", 15, 0.0), ("b", 10, 4.0)):
        for j in range(n):
            name = "%s%d" % (chain, j)
            parent = None if j == 0 else "%s%d" % (chain, j - 1)
            L.append('createNode joint -n "%s"%s;' % (name, ' -p "%s"' % parent if parent else ""))
            L.append('\tsetAttr ".t" -type "double3" %s ;' % fmt((x0, 0, 0) if j == 0 else (0, 1, 0)))
            world[name] = (x0, float(j), 0.0)
            L.append('createNode animCurveTA -n "%s_rz";' % name)
            L.append('\tsetAttr -s 3 ".ktv[0:2]"  1 0 12 %g 24 %g;' % (6 + j, -4 - j))
            C.append('connectAttr "%s_rz.o" "%s.rz";' % (name, name))
            if parent:
                C.append('connectAttr "%s.s" "%s.is";' % (parent, name))

    def mesh(mi, x, y0, joints, pm_override=None):
        segs, rings = 8, 12
        y1 = y0 + len(joints) - 1
        pos, faces = [], []
        for r in range(rings):
            for s in range(segs):
                th = 2 * math.pi * s / segs
                pos.append((x + 0.3 * math.cos(th), y0 + (y1 - y0) * r / (rings - 1), 0.3 * math.sin(th)))
        for r in range(rings - 1):
            for s in range(segs):
                a = r * segs + s
                b = r * segs + (s + 1) % segs
                faces.append([a, b, b + segs, a + segs])
        mn = "m%d" % mi
        L.append('createNode transform -n "%s";' % mn)
        L.append('createNode mesh -n "%sShape" -p "%s";' % (mn, mn))
        L.append('\tsetAttr -k off ".v";')
        L.append('createNode mesh -n "%sShapeOrig" -p "%s";' % (mn, mn))
        L.append('\tsetAttr -k off ".v";')
        L.append('\tsetAttr ".io" yes;')
        write_mesh_data(L, pos, faces, with_uv=False)
        sk = "skin%d" % mi
        L.append('createNode skinCluster -n "%s";' % sk)
        L.append('\tsetAttr -s %d ".wl";' % len(pos))
        # インフルエンスの論理番号 li → ジョイント（joints の並びのまま。m2 は逆順で渡す）
        by_world_y = sorted(range(len(joints)), key=lambda li: world[joints[li]][1])
        rows = []
        for (_, y, _) in pos:
            k = min(len(joints) - 1, max(0, int(y - y0)))
            f = (y - y0) - k
            k2 = min(len(joints) - 1, k + 1)
            a, b = by_world_y[k], by_world_y[k2]
            rows.append("2 %d %g %d %g" % (a, 1 - f, b, f) if a != b else "1 %d 1" % a)
        L.append('\tsetAttr ".wl[0:%d].w"\n\t\t%s;' % (len(pos) - 1, "\n\t\t".join(rows)))
        L.append('\tsetAttr -s %d ".pm";' % len(joints))
        for li, jn in enumerate(joints):
            wx, wy, wz = world[jn]
            pm = mat_t(-wx, -wy, -wz)
            if pm_override and jn in pm_override:
                pm = pm_override[jn]
            L.append('\tsetAttr ".pm[%d]" -type "matrix" %s;' % (li, fmt(pm)))
            C.append('connectAttr "%s.wm" "%s.ma[%d]";' % (jn, sk, li))
        L.append('\tsetAttr ".gm" -type "matrix" %s;' % fmt(mat_t(0, 0, 0)))
        C.append('connectAttr "%sShapeOrig.w" "%s.ip[0].ig";' % (mn, sk))
        C.append('connectAttr "%s.og[0]" "%sShape.i";' % (sk, mn))

    mesh(0, 0.0, 0.0, ["a%d" % j for j in range(0, 10)])
    mesh(1, 0.0, 5.0, ["a%d" % j for j in range(5, 15)])
    mesh(2, 4.0, 0.0, ["b%d" % j for j in reversed(range(10))])
    mesh(3, 0.0, 0.0, ["a%d" % j for j in range(0, 5)], pm_override={"a2": mat_t(-0.1, -2.0, 0.0)})
    L += ['createNode script -n "sceneConfigurationScriptNode";',
          '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";', '\tsetAttr ".st" 6;']
    with open(OUT_MA, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L + C + ["// End of shared_skin_sample.ma"]) + "\n")
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
