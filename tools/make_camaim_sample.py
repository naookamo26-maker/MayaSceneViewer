# -*- coding: utf-8 -*-
"""カメラとエイム（lookAt）と、距離の寸法（distanceDimShape）の検証用サンプル .ma を生成する。

  python tools/make_camaim_sample.py      → samples/camaim_sample.ma, samples/camaim_sample.json

samples/sample_arm.ma に、次のものを足したもの（再生範囲 1〜24）:
  * cam_aim_group（lookAt）: Maya の「カメラとエイム」と同じつなぎ方。子に aim_cam（カメラ）と aim_cam_aim（ロケーター）
      aim_cam は (30, 10, 30)。aim_cam_aim の tx にキー（1: 0 → 24: 10）。twist（.tws）は 20 度（視線のまわりのロール）
  * roll_group（lookAt）: twist なしの同じカメラ（roll_cam。ロールの比較用）
  * shape_group（lookAt）: ターゲットの位置をロケーターのシェイプの worldPosition からつないだカメラ（shape_cam。
      ターゲットが DAG ノードでないときは、コンストレイントに入ってくる値から位置を求める）。エイムは (0, -4, 0)
  * shape_roll_group（lookAt）: twist をカメラのシェイプの独自の属性（rollAngle、doubleAngle、20 度）からつないだカメラ
  * attr_roll_group（lookAt）: twist を別のノード（roll_ctrl）の独自の属性（roll、doubleAngle、20 度）からつないだカメラ
      （どちらも cam_aim_group と同じロールになる）
  * bad_roll_group（lookAt）: twist を未対応のノード（frameCache）から unitConversion を通してつないだカメラ
      （twist の接続だけを外してファイルの値（0）にし、エイムの向きは求める）
  * distanceDimension1（distanceDimShape）: locStart（原点）と locEnd（tx にキー 1: 3 → 24: 9）の距離 →
      multiplyDivide（÷ 6）→ box.sx
"""
from __future__ import annotations

import json
import os
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "camaim_sample.ma")


def curve(kind, name, keys):
    return ['createNode animCurve%s -n "%s";' % (kind, name),
            '\trename -uid "00000000-0000-0000-0000-%012d";' % (zlib.crc32(name.encode()) % 10 ** 12),
            '\tsetAttr ".tan" 2;',
            '\tsetAttr ".wgt" no;',
            '\tsetAttr -s %d ".ktv[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("%g %g" % kv for kv in keys)),
            '\tsetAttr -s %d ".kit[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys)),
            '\tsetAttr -s %d ".kot[0:%d]"  %s;' % (len(keys), len(keys) - 1, " ".join("2" for _ in keys))]


def camera_and_aim(group, cam, aim, twist, shape_target=False, aim_pos=(0, 5, 0), shape_roll=None):
    """Maya の［作成］→［カメラ］→［カメラとエイム］と同じ形（lookAt のグループの下にカメラとエイムのロケーター）"""
    lines = ['createNode lookAt -n "%s";' % group,
             '\tsetAttr ".a" -type "double3" 0 0 -1 ;']
    if twist:
        lines.append('\tsetAttr ".tws" %g;' % twist)
    lines += ['createNode transform -n "%s" -p "%s";' % (cam, group),
              '\tsetAttr ".t" -type "double3" 30 10 30 ;',
              'createNode camera -n "%sShape" -p "%s";' % (cam, cam)]
    if shape_roll is not None:
        lines += ['\taddAttr -ci true -sn "rol" -ln "rollAngle" -at "doubleAngle";',
                  '\tsetAttr -k on ".rol" %g;' % shape_roll]
    lines += ['\tsetAttr -k off ".v";',
              '\tsetAttr ".cap" -type "double2" 1.41732 0.94488 ;',
              'createNode transform -n "%s" -p "%s";' % (aim, group),
              '\tsetAttr ".t" -type "double3" %g %g %g ;' % aim_pos,
              'createNode locator -n "%sShape" -p "%s";' % (aim, aim),
              '\tsetAttr -k off ".v";']
    conns = ['connectAttr "%s.crx" "%s.rx";' % (group, cam), 'connectAttr "%s.cry" "%s.ry";' % (group, cam),
             'connectAttr "%s.crz" "%s.rz";' % (group, cam), 'connectAttr "%s.pim" "%s.cpim";' % (cam, group),
             'connectAttr "%s.t" "%s.ct";' % (cam, group), 'connectAttr "%s.rp" "%s.crp";' % (cam, group),
             'connectAttr "%s.rpt" "%s.crt";' % (cam, group), 'connectAttr "%s.ro" "%s.cro";' % (cam, group),
             ]
    if shape_roll is not None:
        conns.append('connectAttr "%sShape.rol" "%s.tws";' % (cam, group))
    if shape_target:
        conns.append('connectAttr "%sShape.wp" "%s.tg[0].tt";' % (aim, group))
    else:
        conns += ['connectAttr "%s.t" "%s.tg[0].tt";' % (aim, group), 'connectAttr "%s.rp" "%s.tg[0].trp";' % (aim, group),
                  'connectAttr "%s.rpt" "%s.tg[0].trt";' % (aim, group), 'connectAttr "%s.pm" "%s.tg[0].tpm";' % (aim, group)]
    return lines, conns


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace("//Name: sample_arm.ma", "//Name: camaim_sample.ma")
    out = ['createNode script -n "sceneConfigurationScriptNode";',
           '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
           '\tsetAttr ".st" 6;']
    conns = []
    for args, kw in ((("cam_aim_group", "aim_cam", "aim_cam_aim", 20), {}), (("roll_group", "roll_cam", "roll_cam_aim", 0), {}),
                     (("shape_group", "shape_cam", "shape_cam_aim", 0), {"shape_target": True, "aim_pos": (0, -4, 0)}),
                     (("shape_roll_group", "shape_roll_cam", "shape_roll_cam_aim", 0), {"shape_roll": 20}),
                     (("attr_roll_group", "attr_roll_cam", "attr_roll_cam_aim", 0), {}),
                     (("bad_roll_group", "bad_roll_cam", "bad_roll_cam_aim", 0), {})):
        a, c = camera_and_aim(*args, **kw)
        out += a
        conns += c
    out += ['createNode transform -n "roll_ctrl";',
            '\taddAttr -ci true -sn "roll" -ln "roll" -at "doubleAngle";',
            '\tsetAttr -k on ".roll" 20;',
            'createNode locator -n "roll_ctrlShape" -p "roll_ctrl";',
            '\tsetAttr -k off ".v";']
    out += ['createNode frameCache -n "roll_cache";',
            'createNode unitConversion -n "roll_uc";',
            '\tsetAttr ".cf" 0.017453292519943295;']
    conns += ['connectAttr "roll_ctrl.roll" "attr_roll_group.tws";',
              'connectAttr "roll_cache.v" "roll_uc.i";',
              'connectAttr "roll_uc.o" "bad_roll_group.tws";']
    out += ['createNode transform -n "distanceDimension1";',
            'createNode distanceDimShape -n "distanceDimensionShape1" -p "distanceDimension1";',
            '\tsetAttr -k off ".v";',
            'createNode transform -n "locStart";',
            'createNode locator -n "locStartShape" -p "locStart";',
            'createNode transform -n "locEnd";',
            'createNode locator -n "locEndShape" -p "locEnd";',
            'createNode multiplyDivide -n "stretch_md";',
            '\tsetAttr ".op" 2;',
            '\tsetAttr ".i2" -type "float3" 6 1 1 ;']
    out += curve("TL", "aim_cam_aim_translateX", [(1, 0), (24, 10)])
    out += curve("TL", "locEnd_translateX", [(1, 3), (24, 9)])
    conns += ['connectAttr "aim_cam_aim_translateX.o" "aim_cam_aim.tx";',
              'connectAttr "locEnd_translateX.o" "locEnd.tx";',
              'connectAttr "locStartShape.wp" "distanceDimensionShape1.sp";',
              'connectAttr "locEndShape.wp" "distanceDimensionShape1.ep";',
              'connectAttr "distanceDimensionShape1.dist" "stretch_md.i1x";',
              'connectAttr "stretch_md.ox" "box.sx";']
    text = body + "\n".join(out + conns) + "\n" + tail.replace("sample_arm.ma", "camaim_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "camaim_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: camaim_sample.json")


if __name__ == "__main__":
    main()
