# -*- coding: utf-8 -*-
"""リグで切り替える表示（visibility）と、シーンのカメラの検証用サンプル .ma を生成する。

  python tools/make_vis_camera_sample.py          → samples/vis_camera_sample.ma, samples/vis_camera_sample.json

samples/sample_arm.ma に、次のものを足したもの（再生範囲 1〜24）:
  * vis_ctrl: 独自の属性 geoVis（bool、保存時は no）と proxyVis（long。キー: 1 → 1、12 → 0、ステップ）を持つコントローラー
      vis_ctrl.geoVis → box.v                         （Maya では箱は常に非表示）
      vis_ctrl.geoVis → vis_rev（reverse）→ arm_geoShape.lodv  （1 − 0 = 1 なので腕は表示のまま）
      vis_ctrl.proxyVis → arm_geo.v                   （腕は 12 フレームから非表示）
  * shot_cam: 透視投影のカメラ（焦点距離にキー: 1 → 35mm、24 → 85mm。フィルムバック 36×24mm 相当・フィルムフィット水平）
  * ortho_cam: 平行投影のカメラ（真上から。orthographicWidth 40）
  * レンダーの解像度（defaultResolution）: 1920×1080
"""
from __future__ import annotations

import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "vis_camera_sample.ma")


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
    body = body.replace('//Name: sample_arm.ma', '//Name: vis_camera_sample.ma')

    out = [
        'createNode script -n "sceneConfigurationScriptNode";',
        '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
        '\tsetAttr ".st" 6;',
        'createNode transform -n "vis_ctrl";',
        '\taddAttr -ci true -sn "geoVis" -ln "geoVis" -min 0 -max 1 -at "bool";',
        '\taddAttr -ci true -sn "proxyVis" -ln "proxyVis" -dv 1 -min 0 -max 1 -at "long";',
        '\tsetAttr ".t" -type "double3" 0 12 0 ;',
        '\tsetAttr -k on ".geoVis" no;',
        '\tsetAttr -k on ".proxyVis";',
        'createNode reverse -n "vis_rev";',
        # 透視投影のカメラ（Maya の書き方: フィルムバックは .cap の 2 つ組。インチ）
        'createNode transform -n "shot_cam";',
        '\tsetAttr ".t" -type "double3" 40 18 40 ;',
        '\tsetAttr ".r" -type "double3" -15 45 0 ;',
        'createNode camera -n "shot_camShape" -p "shot_cam";',
        '\tsetAttr -k off ".v";',
        '\tsetAttr ".cap" -type "double2" 1.41732 0.94488 ;',
        '\tsetAttr ".ff" 1;',
        '\tsetAttr ".ncp" 1;',
        '\tsetAttr ".coi" 58;',
        # 平行投影のカメラ（真上から見下ろす）
        'createNode transform -n "ortho_cam";',
        '\tsetAttr ".t" -type "double3" 0 60 0 ;',
        '\tsetAttr ".r" -type "double3" -90 0 0 ;',
        'createNode camera -n "ortho_camShape" -p "ortho_cam";',
        '\tsetAttr -k off ".v";',
        '\tsetAttr ".o" yes;',
        '\tsetAttr ".ow" 40;',
    ]
    out += curve("TU", "vis_ctrl_proxyVis", [(1, 1), (12, 0)], ['setAttr -s 2 ".kot[0:1]"  5 5;'])
    out += curve("TU", "shot_camShape_focalLength", [(1, 35), (24, 85)],
                 ['setAttr -s 2 ".kit[0:1]"  2 2;', 'setAttr -s 2 ".kot[0:1]"  2 2;'])
    out += [
        'select -ne :defaultResolution;',
        '\tsetAttr ".w" 1920;',
        '\tsetAttr ".h" 1080;',
        '\tsetAttr ".dar" 1.7777777910232544;',
        'connectAttr "vis_ctrl.geoVis" "box.v";',
        'connectAttr "vis_ctrl.geoVis" "vis_rev.ix";',
        'connectAttr "vis_rev.ox" "arm_geoShape.lodv";',
        'connectAttr "vis_ctrl_proxyVis.o" "vis_ctrl.proxyVis";',
        'connectAttr "vis_ctrl.proxyVis" "arm_geo.v";',
        'connectAttr "shot_camShape_focalLength.o" "shot_camShape.fl";',
    ]
    text = body + "\n".join(out) + "\n" + tail.replace("sample_arm.ma", "vis_camera_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)

    import json
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "vis_camera_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: vis_camera_sample.json")


if __name__ == "__main__":
    main()
