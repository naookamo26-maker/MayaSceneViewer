# -*- coding: utf-8 -*-
"""リファレンス（file -r）の検証用サンプルを生成する。

  python tools/make_reference_sample.py   → samples/reference_project/（Maya プロジェクトの形）

  workspace.mel
  assets/arm_rig.ma    samples/sample_arm.ma に、hand_ctrl（独自の属性 fkik。既定値 0 → box.v）と、
                       入れ子のリファレンス prop（assets/prop.ma）を足したもの。
                       自分の reference ノード propRN の編集で、prop:crate のスケールを 2 にする。
                       再生範囲は 1〜100（シーンの再生範囲には使わない）
  assets/prop.ma       板ポリゴン 1 枚（crate）
  scenes/shot.ma       開くシーン。リファレンスはどれも別のマシンの絶対パスで書く（プロジェクトの中を探す）
    * armA（arm_rig.ma）: 編集で次のことをする
        - armA:rig_grp を world_grp（tz = 10）の子にする（parent）
        - armA:hand_ctrl.fkik を 1 にする（setAttr。box が表示される）
        - armA:prop:crate を tx = 3 に動かす（入れ子のリファレンスの編集）
        - アニメーションカーブ hand_ctrl_translateX（1: 0 → 24: 5）を、プレースホルダー armARN.phl[1] を通して
          armA:hand_ctrl.tx につなぐ
    * armB（arm_rig.ma）: アンロード（file -rdi の行に -dr 1）。読み込まない
    * missing（missing.ma）: ファイルがない
    再生範囲は 1〜24
"""
from __future__ import annotations

import os
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT_DIR = os.path.join(ROOT, "samples", "reference_project")


def curve(kind, name, keys):
    return ['createNode animCurve%s -n "%s";' % (kind, name),
            '\trename -uid "00000000-0000-0000-0000-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12),
            '\tsetAttr ".tan" 2;',
            '\tsetAttr ".wgt" no;',
            '\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % kv for kv in keys)),
            '\tsetAttr -s %d ".kit[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys)),
            '\tsetAttr -s %d ".kot[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys))]


HEADER = ['requires maya "2024";',
          'currentUnit -l centimeter -a degree -t film;',
          'fileInfo "application" "maya";']


def playback(lo, hi):
    return ['createNode script -n "sceneConfigurationScriptNode";',
            '\tsetAttr ".b" -type "string" "playbackOptions -min %d -max %d -ast %d -aet %d ";' % (lo, hi, lo, hi),
            '\tsetAttr ".st" 6;']


def prop_ma():
    lines = ["//Maya ASCII 2024 scene", "//Name: prop.ma"] + HEADER + [
        'createNode transform -n "crate";',
        'createNode mesh -n "crateShape" -p "crate";',
        '\tsetAttr -k off ".v";',
        '\tsetAttr -s 4 ".vt[0:3]"  -1 0 1 1 0 1 -1 0 -1 1 0 -1;',
        '\tsetAttr -s 4 ".ed[0:3]"  0 1 0 0 2 0 1 3 0 2 3 0;',
        '\tsetAttr -s 1 -ch 4 ".fc[0]" -type "polyFaces" ',
        '\t\tf 4 0 2 -4 -2;',
        'createNode transform -s -n "persp";',
        '\tsetAttr ".t" -type "double3" 99 99 99 ;',
        'createNode camera -s -n "perspShape" -p "persp";',
        '\tsetAttr ".fl" 50;',
        'select -ne :time1;',
        '\tsetAttr ".o" 50;',
        "// End of prop.ma"]
    return "\n".join(lines) + "\n"


def arm_rig_ma():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body = text[:end] if end >= 0 else text
    body = body.replace("//Name: sample_arm.ma", "//Name: arm_rig.ma")
    # リファレンスの行はファイルの先頭（requires の前）に書かれる
    refs = ['file -rdi 1 -ns "prop" -rfn "propRN" -op "v=0;" -typ "mayaAscii" "D:/other_pc/demo/assets/prop.ma";',
            'file -r -ns "prop" -dr 1 -rfn "propRN" -op "v=0;" -typ "mayaAscii" "D:/other_pc/demo/assets/prop.ma";']
    lines = body.split("\n")
    at = next(i for i, ln in enumerate(lines) if ln.startswith("requires"))
    lines[at:at] = refs
    body = "\n".join(lines)
    out = ['createNode transform -n "hand_ctrl" -p "rig_grp";',
           '\taddAttr -ci true -sn "fkik" -ln "fkik" -min 0 -max 1 -at "double";',
           '\tsetAttr ".t" -type "double3" 20 0 0 ;',
           'createNode locator -n "hand_ctrlShape" -p "hand_ctrl";',
           '\tsetAttr -k off ".v";',
           'createNode reference -n "propRN";',
           '\tsetAttr ".ed" -type "dataReferenceEdits" ',
           '\t\t"propRN"',
           '\t\t"propRN" 1',
           '\t\t2 "|prop:crate" "scale" " -type \\"double3\\" 2 2 2";',
           '\tsetAttr ".ptag" -type "string" "";',
           'lockNode -l 1 ;']
    out += playback(1, 100)
    conns = ['connectAttr "hand_ctrl.fkik" "box.v";']
    return body + "\n".join(out + conns) + "\n// End of arm_rig.ma\n"


def shot_ma():
    lines = ["//Maya ASCII 2024 scene", "//Name: shot.ma",
             'file -rdi 1 -ns "armA" -rfn "armARN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma";',
             'file -rdi 2 -ns "prop" -rfn "armA:propRN" -op "v=0;" -typ "mayaAscii" "D:/other_pc/demo/assets/prop.ma";',
             'file -rdi 1 -ns "armB" -dr 1 -rfn "armBRN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma{1}";',
             'file -rdi 1 -ns "missing" -rfn "missingRN" -op "v=0;" -typ "mayaAscii" "C:/nowhere/missing.ma";',
             'file -r -ns "armA" -dr 1 -rfn "armARN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma";',
             'file -r -ns "armB" -dr 1 -rfn "armBRN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma{1}";',
             'file -r -ns "missing" -dr 1 -rfn "missingRN" -op "v=0;" -typ "mayaAscii" "C:/nowhere/missing.ma";'] + HEADER
    lines += ['createNode transform -n "world_grp";',
              '\tsetAttr ".t" -type "double3" 0 0 10 ;',
              'createNode reference -n "armARN";',
              '\tsetAttr ".fn[0]" -type "string" "C:/projects/demo/assets/arm_rig.ma";',
              '\tsetAttr -s 2 ".phl";',
              '\tsetAttr ".phl[1]" 0;',
              '\tsetAttr ".ed" -type "dataReferenceEdits" ',
              '\t\t"armARN"',
              '\t\t"armARN" 0',
              '\t\t"armARN" 3',
              '\t\t0 "|armA:rig_grp" "|world_grp" "-s -r "',
              '\t\t2 "|world_grp|armA:rig_grp|armA:hand_ctrl" "fkik" " 1"',
              '\t\t5 4 "armARN" "|world_grp|armA:rig_grp|armA:hand_ctrl.translateX" "armARN.placeHolderList[1]" ""',
              '\t\t"armA:propRN" 1',
              '\t\t2 "|armA:prop:crate" "translate" " -type \\"double3\\" 3 0 0";',
              '\tsetAttr ".ptag" -type "string" "";',
              'lockNode -l 1 ;',
              'createNode reference -n "armBRN";',
              '\tsetAttr ".ed" -type "dataReferenceEdits" ',
              '\t\t"armBRN";',
              'lockNode -l 1 ;',
              'createNode reference -n "missingRN";',
              'lockNode -l 1 ;',
              'createNode reference -n "sharedReferenceNode";',
              '\tsetAttr ".ed" -type "dataReferenceEdits" ',
              '\t\t"sharedReferenceNode";']
    lines += playback(1, 24)
    lines += curve("TL", "hand_ctrl_translateX", [(1, 0), (24, 5)])
    lines += ['connectAttr "hand_ctrl_translateX.o" "armARN.phl[1]";',
              "// End of shot.ma"]
    return "\n".join(lines) + "\n"


def main():
    for sub in ("assets", "scenes"):
        os.makedirs(os.path.join(OUT_DIR, sub), exist_ok=True)
    files = {"workspace.mel": '//Maya 2024 Project Definition\n\nworkspace -fr "scene" "scenes";\n',
             os.path.join("assets", "prop.ma"): prop_ma(),
             os.path.join("assets", "arm_rig.ma"): arm_rig_ma(),
             os.path.join("scenes", "shot.ma"): shot_ma()}
    for rel, text in files.items():
        path = os.path.join(OUT_DIR, rel)
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        print("書き出しました: %s" % path)


if __name__ == "__main__":
    main()
