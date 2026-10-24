# -*- coding: utf-8 -*-
"""キャラクターセットと Trax のクリップの検証用サンプル .ma を生成する。

  python tools/make_trax_sample.py          → samples/trax_sample.ma, samples/trax_sample.json

samples/sample_arm.ma に、次のものを足したもの（再生範囲 1〜80）:
  * character1: shoulder.rz（angularValues[1]）と box.tx（linearValues[1]）を持つキャラクターセット
  * clipLibrary1 のソースクリップ（キーはクリップの中の時間。接線はリニア）
      swingSource（0〜10）: shoulder.rz 0 → 90、box.tx 0 → 5
      raiseSource（0〜20）: shoulder.rz 0 → -45、box.tx 0 → -3
  * タイムラインのクリップ（animClip のインスタンス）
      swing1: 開始 1、サイクル 1 回追加（postCycle 1）→ 1〜21 で 2 回
      raise1: 開始 30、スケール 2（40 フレームかけて再生）→ 30〜70。トラック 1
  * character2: rig_grp.ty にカーブを直接つないだキャラクターセット（クリップなし）
キーの値は書き出し時に分かる（期待値はテストで確認する）。
Maya の書き出し形式を推定して作ったもの（実際の Maya のファイルとは細部が違うことがある）。
"""
from __future__ import annotations

import json
import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "trax_sample.ma")


def curve(kind, name, keys):
    return ['createNode animCurve%s -n "%s";' % (kind, name),
            '\trename -uid "00000000-0000-0000-0000-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12),
            '\tsetAttr ".tan" 2;',
            '\tsetAttr ".wgt" no;',
            '\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % kv for kv in keys)),
            '\tsetAttr -s %d ".kit[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys)),
            '\tsetAttr -s %d ".kot[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys))]


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace('//Name: sample_arm.ma', '//Name: trax_sample.ma')
    mapping = '2 "shoulder.rotateZ" 2 1 "box.translateX" 1 1'
    out = [
        'createNode script -n "sceneConfigurationScriptNode";',
        '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 80 -ast 1 -aet 80 ";',
        '\tsetAttr ".st" 6;',
        'createNode character -n "character1";',
        '\taddAttr -ci true -h true -sn "aal" -ln "attributeAliasList" -dt "attributeAlias";',
        '\tsetAttr -s 2 ".dnsm";',
        '\tsetAttr -s 1 ".lv";',
        '\tsetAttr ".lv[1]" 0;',
        '\tsetAttr -s 1 ".av";',
        '\tsetAttr ".av[1]" 0;',
        '\tsetAttr ".am" -type "characterMapping" %s  ;' % mapping,
        '\tsetAttr ".aal" -type "attributeAlias" {"shoulder_rotateZ","angularValues[1]","box_translateX","linearValues[1]"} ;',
        'createNode clipLibrary -n "clipLibrary1";',
        '\tsetAttr -s 2 ".cel";',
        '\tsetAttr -s 2 ".cel[0].cev";',
        '\tsetAttr -s 2 ".cel[1].cev";',
        '\tsetAttr ".cd[0].cm" -type "characterMapping" %s  ;' % mapping,
        '\tsetAttr ".cd[0].cim" -type "Int32Array" 2 0 1 ;',
        '\tsetAttr ".cd[1].cm" -type "characterMapping" %s  ;' % mapping,
        '\tsetAttr ".cd[1].cim" -type "Int32Array" 2 0 1 ;',
        'createNode clipScheduler -n "clipScheduler1";',
        '\tsetAttr -s 2 ".cl";',
        '\tsetAttr -s 2 ".tr[0:1]" 0 1;',
        # ソースクリップ
        'createNode animClip -n "swingSource";',
        '\tsetAttr ".ihi" 0;',
        '\tsetAttr -s 2 ".ac[0:1]" yes yes;',
        '\tsetAttr ".ss" 0;',
        '\tsetAttr ".se" 10;',
        '\tsetAttr ".ci" no;',
        'createNode animClip -n "raiseSource";',
        '\tsetAttr ".ihi" 0;',
        '\tsetAttr -s 2 ".ac[0:1]" yes yes;',
        '\tsetAttr ".ss" 0;',
        '\tsetAttr ".se" 20;',
        '\tsetAttr ".ci" no;',
        # タイムラインのクリップ
        'createNode animClip -n "swing1";',
        '\tsetAttr -s 2 ".ac[0:1]" yes yes;',
        '\tsetAttr ".st" 1;',
        '\tsetAttr ".ss" 0;',
        '\tsetAttr ".se" 10;',
        '\tsetAttr ".ca" 1;',
        'createNode animClip -n "raise1";',
        '\tsetAttr -s 2 ".ac[0:1]" yes yes;',
        '\tsetAttr ".st" 30;',
        '\tsetAttr ".ss" 0;',
        '\tsetAttr ".se" 20;',
        '\tsetAttr ".sc" 2;',
        'createNode character -n "character2";',
        '\tsetAttr -s 1 ".dnsm";',
        '\tsetAttr ".lv[0]" 0;',
    ]
    out += curve("TA", "swing_shoulder_rotateZ", [(0, 0), (10, 90)])
    out += curve("TL", "swing_box_translateX", [(0, 0), (10, 5)])
    out += curve("TA", "raise_shoulder_rotateZ", [(0, 0), (20, -45)])
    out += curve("TL", "raise_box_translateX", [(0, 0), (20, -3)])
    out += curve("TL", "character2_rig_grp_translateY", [(1, 0), (80, 4)])
    out += [
        'connectAttr "shoulder.rz" "character1.dnsm" -na;',
        'connectAttr "box.tx" "character1.dnsm" -na;',
        'connectAttr "character1.av[1]" "shoulder.rz";',
        'connectAttr "character1.lv[1]" "box.tx";',
        'connectAttr "clipLibrary1.msg" "character1.lib";',
        'connectAttr "clipScheduler1.msg" "character1.sch";',
        'connectAttr "swing_shoulder_rotateZ.a" "clipLibrary1.cel[0].cev[0].cevr";',
        'connectAttr "swing_box_translateX.a" "clipLibrary1.cel[0].cev[1].cevr";',
        'connectAttr "raise_shoulder_rotateZ.a" "clipLibrary1.cel[1].cev[0].cevr";',
        'connectAttr "raise_box_translateX.a" "clipLibrary1.cel[1].cev[1].cevr";',
        'connectAttr "swingSource.cl" "clipLibrary1.sc[0]";',
        'connectAttr "raiseSource.cl" "clipLibrary1.sc[1]";',
        'connectAttr "swing1.cl" "clipScheduler1.cl[0]";',
        'connectAttr "raise1.cl" "clipScheduler1.cl[1]";',
        'connectAttr "rig_grp.ty" "character2.dnsm" -na;',
        'connectAttr "character2_rig_grp_translateY.o" "character2.lv[0]";',
        'connectAttr "character2.lv[0]" "rig_grp.ty";',
    ]
    text = body + "\n".join(out) + "\n" + tail.replace("sample_arm.ma", "trax_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "trax_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: trax_sample.json")


if __name__ == "__main__":
    main()
