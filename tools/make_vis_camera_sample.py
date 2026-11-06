# -*- coding: utf-8 -*-
"""リグで切り替える表示（visibility）と、シーンのカメラの検証用サンプル .ma を生成する。

  python tools/make_vis_camera_sample.py          → samples/vis_camera_sample.ma, samples/vis_camera_sample.json

samples/sample_arm.ma に、次のものを足したもの（再生範囲 1〜24）:
  * vis_ctrl: 独自の属性 geoVis（bool、保存時は no）と proxyVis（long。キー: 1 → 1、12 → 0、ステップ）を持つコントローラー
      vis_ctrl.geoVis → box.v                         （Maya では箱は常に非表示）
      vis_ctrl.geoVis → vis_rev（reverse）→ arm_geoShape.lodv  （1 − 0 = 1 なので腕は表示のまま）
      vis_ctrl.proxyVis → arm_geo.v                   （腕は 12 フレームから非表示）
  * 移動で切り替える表示（IK・FK の切り替えの形。保存時は FK 側を表示）: switch_ctrl.tx（保存時 0）→ sw_cond（condition。
    0.5 より大きければ 1、そうでなければ 0）→ ik_ctrl.v（保存時は非表示）・ik_layer.v（ディスプレイレイヤー。保存時は非表示。
    ik_extra が入っている）、sw_cond → sw_rev（reverse）→ fk_ctrlShape.v（カーブのシェイプ。保存時は表示）
    形のないコントローラー（ロケーター。リグを動かすので出力に加わる）: ik_loc_grp（保存時は非表示）.v ← sw_cond、
    その子の ik_loc（.t → ik_loc_jnt.t）と、シェイプの表示が sw_cond で決まる ik_pv（ik_pvShape.v。保存時は非表示。.t → ik_pv_jnt.t）
  * shot_cam: 透視投影のカメラ（焦点距離にキー: 1 → 35mm、24 → 85mm。フィルムバック 36×24mm 相当・フィルムフィット水平）
  * ortho_cam: 平行投影のカメラ（真上から。orthographicWidth 40）
  * レンダーの解像度（defaultResolution）: 1920×1080
  * 保存したときの Maya のビュー（uiConfigurationScriptNode の Current Layout）: shot_cam から見ていた
"""
from __future__ import annotations

import os
import re
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


def line_shape(name, parent):
    """長さ 1 の直線のカーブのシェイプ（コントローラーの形の代わり）"""
    return ['createNode nurbsCurve -n "%s" -p "%s";' % (name, parent),
            '\tsetAttr -k off ".v";',
            '\tsetAttr ".cc" -type "nurbsCurve" 1 1 0 no 3 2 0 1 2 0 0 0 1 0 0 ;']


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace('//Name: sample_arm.ma', '//Name: vis_camera_sample.ma')

    # Maya が書き出す画面構成のスクリプト（1 画面のレイアウトで、透視ビューのパネルから shot_cam を見ている）
    ui = r'''createNode script -n "uiConfigurationScriptNode";
	setAttr ".b" -type "string" (
		"// Maya Mel UI Configuration File.\n//\n\nglobal string $gMainPane;\nif (`paneLayout -exists $gMainPane`) {\n\t$panelName = `sceneUIReplacement -getNextPanel \"modelPanel\" (localizedPanelLabel(\"Top View\")) `;\n\tif (\"\" != $panelName) {\n        modelEditor -e \n            -camera \"|top\" \n\t}\n"
		+ "\t\tpanelConfiguration -edit -label (localizedPanelLabel(\"Current Layout\")) \n\t\t\t-userCreated false\n\t\t\t-configString \"global string $gMainPane; paneLayout -e -cn \\\"single\\\" -ps 1 100 100 $gMainPane;\"\n\t\t\t-removeAllPanels\n\t\t\t-ap false\n\t\t\t\t(localizedPanelLabel(\"Persp View\")) \n\t\t\t\t\"modelPanel\"\n"
		+ "\t\t\t\t\"$panelName = `modelPanel -unParent -l (localizedPanelLabel(\\\"Persp View\\\")) -mbv $menusOkayInPanels `;\\n$editorName = $panelName;\\nmodelEditor -e \\n    -cam \\\"|shot_cam\\\" \\n\"\n"
		+ "\t\t\t\t$configName;\n}\n");
	setAttr ".st" 3;'''
    body = re.sub(r'createNode script -n "uiConfigurationScriptNode";.*?setAttr ".st" 3;', lambda _m: ui, body, count=1, flags=re.S)
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
    out += [
        'createNode transform -n "switch_ctrl";',
        '\tsetAttr ".t" -type "double3" 0 12 -8 ;',
        *line_shape("switch_ctrlShape", "switch_ctrl"),
        'createNode transform -n "ik_ctrl";',
        '\tsetAttr ".v" no;',
        '\tsetAttr ".t" -type "double3" -8 8 0 ;',
        *line_shape("ik_ctrlShape", "ik_ctrl"),
        'createNode transform -n "fk_ctrl";',
        '\tsetAttr ".t" -type "double3" -8 4 0 ;',
        *line_shape("fk_ctrlShape", "fk_ctrl"),
        'createNode transform -n "ik_extra";',
        '\tsetAttr ".t" -type "double3" -8 0 0 ;',
        *line_shape("ik_extraShape", "ik_extra"),
        'createNode transform -n "ik_loc_grp";',
        '\tsetAttr ".v" no;',
        'createNode transform -n "ik_loc" -p "ik_loc_grp";',
        '\tsetAttr ".t" -type "double3" -12 8 0 ;',
        'createNode locator -n "ik_locShape" -p "ik_loc";',
        '\tsetAttr -k off ".v";',
        'createNode transform -n "ik_pv";',
        '\tsetAttr ".t" -type "double3" -12 4 0 ;',
        'createNode locator -n "ik_pvShape" -p "ik_pv";',
        '\tsetAttr -k off ".v" no;',
        'createNode joint -n "ik_loc_jnt";',
        'createNode joint -n "ik_pv_jnt";',
        'createNode condition -n "sw_cond";',
        '\tsetAttr ".st" 0.5;',
        '\tsetAttr ".op" 2;',
        '\tsetAttr ".ct" -type "float3" 1 1 1 ;',
        '\tsetAttr ".cf" -type "float3" 0 0 0 ;',
        'createNode reverse -n "sw_rev";',
        'createNode displayLayer -n "ik_layer";',
        '\tsetAttr ".v" no;',
        '\tsetAttr ".do" 1;',
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
        'connectAttr "switch_ctrl.tx" "sw_cond.ft";',
        'connectAttr "sw_cond.ocr" "ik_ctrl.v";',
        'connectAttr "sw_cond.ocr" "ik_layer.v";',
        'connectAttr "ik_layer.di" "ik_extra.do";',
        'connectAttr "sw_cond.ocr" "sw_rev.ix";',
        'connectAttr "sw_rev.ox" "fk_ctrlShape.v";',
        'connectAttr "sw_cond.ocr" "ik_loc_grp.v";',
        'connectAttr "sw_cond.ocr" "ik_pvShape.v";',
        'connectAttr "ik_loc.t" "ik_loc_jnt.t";',
        'connectAttr "ik_pv.t" "ik_pv_jnt.t";',
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
