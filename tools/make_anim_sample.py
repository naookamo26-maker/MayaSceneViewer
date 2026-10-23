# -*- coding: utf-8 -*-
"""アニメーションの検証用サンプル .ma を生成する。

  python tools/make_anim_sample.py          → samples/anim_sample.ma

samples/sample_arm.ma に、次のアニメーションカーブを足したもの:
  * shoulder.rz   オート接線（.tan 18）の 3 キー
  * elbow.ry      リニア（kit / kot = 2）
  * wrist.rx      ステップ（kot = 5）
  * shoulder.sx   スケール（子ジョイントのスケール補正の確認用）
  * box.tx        重み付きの固定接線（wgt yes、kix / kiy / kox / koy）。ピボットを持つ transform
  * rig_grp.ty    繰り返し（.pst 3）
  * box.v         表示のカーブ（未対応の警告の確認用）
  * persp.tx      表示しないノードのカーブ（読み込まないことの確認用）
  * forearm_twist.tx は pointConstraint で決まる（再生されない警告の確認用）
再生範囲は sceneConfigurationScriptNode の playbackOptions（1〜24、アニメーション範囲 1〜30）。
"""
from __future__ import annotations

import os
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "anim_sample.ma")


def curve(kind, name, keys, extra=()):
    lines = ['createNode animCurve%s -n "%s";' % (kind, name),
             '\trename -uid "00000000-0000-0000-0000-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12),
             '\tsetAttr ".tan" 18;',
             '\tsetAttr ".wgt" no;',
             '\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1,
                                                   " ".join("%g %g" % kv for kv in keys))]
    lines.extend("\t" + e for e in extra)
    return lines


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace('//Name: sample_arm.ma', '//Name: anim_sample.ma')

    out = [
        'createNode script -n "sceneConfigurationScriptNode";',
        '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 30 ";',
        '\tsetAttr ".st" 6;',
        'createNode pointConstraint -n "forearm_twist_pointConstraint1" -p "forearm_twist";',
        '\tsetAttr -k on ".w0";',
    ]
    out += curve("TA", "shoulder_rotateZ", [(1, 0), (12, 45), (24, 0)])
    out += curve("TA", "elbow_rotateY", [(1, 0), (24, -90)],
                 ['setAttr -s 2 ".kit[0:1]"  2 2;', 'setAttr -s 2 ".kot[0:1]"  2 2;'])
    out += curve("TA", "wrist_rotateX", [(1, 0), (10, 30), (20, -30)],
                 ['setAttr -s 3 ".kot[0:2]"  5 5 5;'])
    out += curve("TU", "shoulder_scaleX", [(1, 1), (24, 1.5)],
                 ['setAttr -s 2 ".kit[0:1]"  2 2;', 'setAttr -s 2 ".kot[0:1]"  2 2;'])
    # 重み付きの固定接線: x は秒、y は cm。出の接線を長く（重く）して、立ち上がりを遅らせる
    out += curve("TL", "box_translateX", [(1, 0), (25, 10)],
                 ['setAttr ".wgt" yes;',
                  'setAttr -s 2 ".kit[0:1]"  1 1;', 'setAttr -s 2 ".kot[0:1]"  1 1;',
                  'setAttr -s 2 ".kix[0:1]"  0.5 0.5;', 'setAttr -s 2 ".kiy[0:1]"  0 0;',
                  'setAttr -s 2 ".kox[0:1]"  1.5 0.5;', 'setAttr -s 2 ".koy[0:1]"  0 0;'])
    out += curve("TL", "rig_grp_translateY", [(1, 0), (13, 2)],
                 ['setAttr -s 2 ".kit[0:1]"  2 2;', 'setAttr -s 2 ".kot[0:1]"  2 2;', 'setAttr ".pst" 3;'])
    out += curve("TU", "box_visibility", [(1, 1), (12, 0)], ['setAttr -s 2 ".kot[0:1]"  5 5;'])
    out += curve("TL", "persp_translateX", [(1, 0), (24, 5)])
    out += [
        'connectAttr "shoulder_rotateZ.o" "shoulder.rz";',
        'connectAttr "elbow_rotateY.o" "elbow.ry";',
        'connectAttr "wrist_rotateX.o" "wrist.rx";',
        'connectAttr "shoulder_scaleX.o" "shoulder.sx";',
        'connectAttr "box_translateX.o" "box.tx";',
        'connectAttr "rig_grp_translateY.o" "rig_grp.ty";',
        'connectAttr "box_visibility.o" "box.v";',
        'connectAttr "persp_translateX.o" "persp.tx";',
        'connectAttr "forearm_twist_pointConstraint1.ctx" "forearm_twist.tx";',
    ]
    text = body + "\n".join(out) + "\n" + tail.replace("sample_arm.ma", "anim_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)
    write_json_and_expected()


# フレームごとのカーブの値（手計算）。None はその時刻では確かめない（オート接線・重み付きの区間の途中）
EXPECTED_VALUES = {
    1: {"shoulder.rz": 0, "shoulder.sx": 1, "elbow.ry": 0, "wrist.rx": 0, "rig_grp.ty": 0, "box.tx": 0},
    12: {"shoulder.rz": 45, "shoulder.sx": 1 + 0.5 * 11 / 23, "elbow.ry": -90 * 11 / 23, "wrist.rx": 30,
         "rig_grp.ty": 2 * 11 / 12},
    24: {"shoulder.rz": 0, "shoulder.sx": 1.5, "elbow.ry": -90, "wrist.rx": -30, "rig_grp.ty": 2 * 11 / 12},
    25: {"box.tx": 10},
    30: {"shoulder.rz": 0, "shoulder.sx": 1.5, "elbow.ry": -90, "wrist.rx": -30, "rig_grp.ty": 2 * 5 / 12,
         "box.tx": 10},
}


def write_json_and_expected():
    """共通 JSON（anim_sample.json）と、フレームごとのローカル行列の期待値（anim_sample.expected.json）"""
    import json
    import sys
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    from ma_viewer.animation import rest_matrix

    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "anim_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    names = [n["name"] for n in scene["nodes"]]
    rest = {e["node"]: e for e in scene["animation"]["nodes"]}
    frames = {}
    for frame, vals in EXPECTED_VALUES.items():
        cur = {ni: json.loads(json.dumps(e)) for ni, e in rest.items()}
        known = set()
        for key, v in vals.items():
            node, attr = key.split(".")
            ni = names.index(node)
            cur[ni][attr[0]]["xyz".index(attr[1])] = v
            known.add(ni)
        out = {}
        for ni, e in cur.items():
            if e.get("isNode", -1) >= 0:
                e["isScale"] = cur[e["isNode"]]["s"] if e["isNode"] in cur else e["isScale"]
                if e["isNode"] not in known and e["isNode"] in cur:
                    continue                        # 親のスケールを確かめないフレーム
            if ni in known or not any(c["node"] == ni for c in scene["animation"]["channels"]):
                out[names[ni]] = [round(x, 9) for x in rest_matrix(e)]
        frames[str(frame)] = out
    with open(os.path.join(ROOT, "samples", "anim_sample.expected.json"), "w", encoding="utf-8") as f:
        json.dump({"frames": frames}, f, ensure_ascii=False, indent=1)
    print("書き出しました: anim_sample.json / anim_sample.expected.json")


if __name__ == "__main__":
    main()
