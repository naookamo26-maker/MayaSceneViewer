# -*- coding: utf-8 -*-
"""コンポーネントタグ（Maya 2022 以降。デフォーマが変形する CV を名前で選ぶ）の検証用サンプル .ma を生成する。

  python tools/make_component_tag_sample.py   → samples/component_tag_sample.ma, samples/component_tag_sample.json

内容（作業単位 cm・度・film、再生範囲 1〜48）:
  * ひれ fin_0〜fin_4（+X 方向、骨の長さ 2、z = 5）のスプライン IK fin_ik。カーブ fin_slaveShape は wire（fin_wire）で変形し、
    ワイヤー fin_drvShape は cluster 4 つ（fin_k1〜fin_k4）を順に通って変形する（変形前の形は fin_drvShapeOrig）。
  * cluster はウェイト（wl）を書かず、どの CV を動かすかをコンポーネントタグで選ぶ:
      fin_drvShapeOrig のタグ fin_k1〜fin_k4 は CV 0〜3 をひとつずつ持つ（.gtag[i] と、.cc の CV の後ろの "gtag" … の両方に書く）
      fin_kN.ip[0].gtg = "fin_kN"
  * fin_k4Handle.ty にキー 0 → 3、fin_k3Handle.ty にキー 0 → 1.5（ほかのハンドルは動かない）。
    タグを使わずに全部の CV を動かすと、ワイヤーは曲がらずに 4.5 上がるだけになる。
  * 比べるための cluster fin_all（.ip[0].gtg = "*"。ワイヤー fin_allShape の全部の CV を動かす）。ハンドル fin_allHandle.ty にキー 0 → 2
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

OUT = os.path.join(ROOT, "samples", "component_tag_sample.ma")


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def main():
    L = []
    A = L.append

    def uid(name):
        A('\trename -uid "00000000-0000-0000-0007-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12))

    def node(kind, name, parent=None, **attrs):
        A('createNode %s -n "%s"%s;' % (kind, name, ' -p "%s"' % parent if parent else ""))
        uid(name)
        for k, v in attrs.items():
            if isinstance(v, (list, tuple)):
                A('\tsetAttr ".%s" -type "double3" %s ;' % (k, " ".join(fmt(x) for x in v)))
            else:
                A('\tsetAttr ".%s" %s;' % (k, v))

    def shape(name, parent, cvs, tags=None, **attrs):
        node("nurbsCurve", name, parent, **attrs)
        tail = ""
        if tags:
            for i, (tag, comp) in enumerate(tags):
                A('\tsetAttr ".gtag[%d].gtagnm" -type "string" "%s";' % (i, tag))
                A('\tsetAttr ".gtag[%d].gtagcmp" -type "componentList" 1 "%s";' % (i, comp))
            tail = ' "gtag" %d %s' % (len(tags), " ".join('"%s" 1 "%s"' % t for t in tags))
        A('\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 %s%s;'
          % (" ".join(" ".join(fmt(x) for x in c) for c in cvs), tail))

    def anim(name, keys):
        A('createNode animCurveTL -n "%s";' % name)
        uid(name)
        A('\tsetAttr ".tan" 2;')
        A('\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % k for k in keys)))

    A('//Maya ASCII 2024 scene')
    A('//Name: component_tag_sample.ma')
    A('//Codeset: UTF-8')
    A('requires maya "2024";')
    A('currentUnit -l centimeter -a degree -t film;')
    A('fileInfo "application" "maya";')

    z = 5
    straight = [(0, 0, z), (8 / 3.0, 0, z), (16 / 3.0, 0, z), (8, 0, z)]
    prev = None
    for i in range(5):
        node("joint", "fin_%d" % i, prev, t=(0, 0, z) if i == 0 else (2, 0, 0))
        prev = "fin_%d" % i
    node("ikEffector", "fin_eff", "fin_3", t=(2, 0, 0), v="no")
    node("ikHandle", "fin_ik", roc="yes")
    node("transform", "fin_slave", it="no")
    node("nurbsCurve", "fin_slaveShape", "fin_slave")
    shape("fin_slaveShapeOrig", "fin_slave", straight, io="yes")
    node("transform", "fin_drv")
    node("nurbsCurve", "fin_drvShape", "fin_drv")
    shape("fin_drvShapeOrig", "fin_drv", straight, io="yes",
          tags=[("fin_k%d" % (k + 1), "cv[%d]" % k) for k in range(4)])
    node("transform", "fin_base", v="no")
    shape("fin_baseShape", "fin_base", straight)
    A('createNode wire -n "fin_wire";')
    uid("fin_wire")
    A('\tsetAttr ".dds[0]" 20;')
    A('\tsetAttr ".ip[0].gtg" -type "string" "*";')
    for k in range(1, 5):
        node("transform", "fin_k%dHandle" % k)
        node("clusterHandle", "fin_k%dHandleShape" % k, "fin_k%dHandle" % k)
        A('createNode cluster -n "fin_k%d";' % k)
        uid("fin_k%d" % k)
        A('\tsetAttr ".ip[0].gtg" -type "string" "fin_k%d";' % k)
    anim("fin_k4Handle_translateY", [(1, 0), (48, 3)])
    anim("fin_k3Handle_translateY", [(1, 0), (48, 1.5)])

    # 比べるため: タグの式 "*"（全部の CV）の cluster
    node("transform", "fin_allCrv")
    node("nurbsCurve", "fin_allShape", "fin_allCrv")
    shape("fin_allShapeOrig", "fin_allCrv", [(x, 0, -5) for x, _y, _z in straight], io="yes",
          tags=[("fin_all", "cv[*]")])
    node("transform", "fin_allHandle")
    node("clusterHandle", "fin_allHandleShape", "fin_allHandle")
    A('createNode cluster -n "fin_all";')
    uid("fin_all")
    A('\tsetAttr ".ip[0].gtg" -type "string" "*";')
    anim("fin_allHandle_translateY", [(1, 0), (48, 2)])

    node("script", "sceneConfigurationScriptNode")
    A('\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";')
    A('createNode ikSplineSolver -n "ikSplineSolver";')
    uid("ikSplineSolver")
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')

    C = lambda a_, b_: A('connectAttr "%s" "%s";' % (a_, b_))  # noqa: E731
    C("fin_0.msg", "fin_ik.hsj")
    C("fin_eff.hp", "fin_ik.hee")
    C("ikSplineSolver.msg", "fin_ik.hsv")
    for ax in "xyz":
        C("fin_4.t%s" % ax, "fin_eff.t%s" % ax)
    C("fin_slaveShape.ws", "fin_ik.ic")
    C("fin_slaveShapeOrig.ws", "fin_wire.ip[0].ig")
    C("fin_wire.og[0]", "fin_slaveShape.cr")
    C("fin_drvShape.ws", "fin_wire.dw[0]")
    C("fin_baseShape.ws", "fin_wire.bw[0]")
    C("fin_drvShapeOrig.ws", "fin_k1.ip[0].ig")
    for k in range(1, 4):
        C("fin_k%d.og[0]" % k, "fin_k%d.ip[0].ig" % (k + 1))
    C("fin_k4.og[0]", "fin_drvShape.cr")
    for k in range(1, 5):
        C("fin_k%dHandle.wm" % k, "fin_k%d.ma" % k)
        C("fin_k%dHandleShape.x" % k, "fin_k%d.x" % k)
    C("fin_k4Handle_translateY.o", "fin_k4Handle.ty")
    C("fin_k3Handle_translateY.o", "fin_k3Handle.ty")
    C("fin_allShapeOrig.ws", "fin_all.ip[0].ig")
    C("fin_all.og[0]", "fin_allShape.cr")
    C("fin_allHandle.wm", "fin_all.ma")
    C("fin_allHandleShape.x", "fin_all.x")
    C("fin_allHandle_translateY.o", "fin_allHandle.ty")
    A('// End of component_tag_sample.ma')

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L) + "\n")
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "component_tag_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: component_tag_sample.ma / component_tag_sample.json")


if __name__ == "__main__":
    main()
