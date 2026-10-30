# -*- coding: utf-8 -*-
"""place2dTexture（テクスチャの UV の繰り返し・オフセット）の読み取りと、動く値（animation.props）のテスト。

  python tests/test_place2d.py
前提: python tools/make_place2d_sample.py（samples/textured_project/scenes/place2d_sample.ma を作る）
ビューアでの反映は web_src/tests/place2d.test.mjs で確かめる。
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import schema  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "textured_project", "scenes", "place2d_sample.ma")


def scene_with(place2d_lines, extra=()):
    """四角形 1 枚・file・place2dTexture（p）のシーンを読み込む"""
    lines = ['requires maya "2024";', 'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "q";', 'createNode mesh -n "qShape" -p "q";',
             '\tsetAttr ".uvst[0].uvsn" -type "string" "map1";',
             '\tsetAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;',
             '\tsetAttr ".cuvs" -type "string" "map1";',
             '\tsetAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;',
             '\tsetAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;',
             '\tsetAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" ', '\t\tf 4 0 1 2 3', '\t\tmu 0 4 0 1 2 3;',
             'createNode lambert -n "m";', 'createNode shadingEngine -n "mSG";',
             'createNode file -n "f";', '\tsetAttr ".ftn" -type "string" "%s";' % ("tex.<UDIM>.png" if "udim" in extra else "tex.png")]
    if "udim" in extra:
        lines.append('\tsetAttr ".uvt" 3;')
    lines += ['createNode place2dTexture -n "p";'] + list(place2d_lines)
    lines += ['connectAttr "p.o" "f.uv";', 'connectAttr "f.oc" "m.c";', 'connectAttr "m.oc" "mSG.ss";',
              'connectAttr "qShape.iog" "mSG.dsm" -na;']
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "p.ma")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("\n".join(lines) + "\n")
        return load_ma(path, animation=True)


class Place2dTest(unittest.TestCase):
    def test_static_short_and_long_names(self):
        s = scene_with(['\tsetAttr ".re" -type "float2" 2 3 ;', '\tsetAttr ".ofv" 0.5;'])
        self.assertEqual(s["textures"][0]["uv"], {"place2d": 0, "repeat": [2.0, 3.0], "offset": [0.0, 0.5]})
        s = scene_with(['\tsetAttr ".repeatU" 4;', '\tsetAttr ".offset" -type "float2" 0.1 0.2 ;'])
        self.assertEqual(s["textures"][0]["uv"], {"place2d": 0, "repeat": [4.0, 1.0], "offset": [0.1, 0.2]})

    def test_default_has_no_uv(self):
        s = scene_with([])
        self.assertNotIn("uv", s["textures"][0])
        self.assertFalse([w for w in s["warnings"] if "place2dTexture" in w])

    def test_unsupported_attrs(self):
        s = scene_with(['\tsetAttr ".ro" 45;', '\tsetAttr ".wu" no;', '\tsetAttr ".c" -type "float2" 0.5 1 ;',
                        '\tsetAttr ".mu" yes;'])
        w = "\n".join(s["warnings"])
        self.assertIn("place2dTexture p の rotateUV・coverage・mirrorU・wrapU は反映しません", w)
        self.assertNotIn("uv", s["textures"][0])               # 繰り返し・オフセットは既定値
        s = scene_with(['\tsetAttr ".wu" yes;', '\tsetAttr ".tf" -type "float2" 0 0 ;'])   # 既定値と同じ
        self.assertFalse([x for x in s["warnings"] if "place2dTexture" in x])

    def test_udim_is_not_reflected(self):
        s = scene_with(['\tsetAttr ".of" -type "float2" 0.5 0 ;'], extra=("udim",))
        self.assertNotIn("uv", s["textures"][0])
        self.assertIn("UDIM のテクスチャの place2dTexture p の繰り返し・オフセットは反映しません", "\n".join(s["warnings"]))

    def test_sample_props(self):
        s = load_ma(SAMPLE, animation=True)
        schema.validate(s)
        uv = {t["node"]: t["uv"] for t in s["textures"]}
        self.assertEqual(uv["f1"], {"place2d": 0, "repeat": [2.0, 3.0], "offset": [0.25, 0.5]})
        props = {p["index"]: p for p in s["animation"]["props"] if p["kind"] == "place2d"}
        self.assertEqual(sorted(props[uv["f2"]["place2d"]]["inputs"]), ["ofu", "ofv"])   # offsetU（長い名前）も ofu
        self.assertEqual(sorted(props[uv["f3"]["place2d"]]["inputs"]), ["of"])
        self.assertIn("curve", props[uv["f4"]["place2d"]]["inputs"]["reu"])
        self.assertNotIn(uv["f1"]["place2d"], props)                                    # 動かない
        self.assertIn("place2dTexture p5 の rotateUV は反映しません", "\n".join(s["warnings"]))

    def test_schema_rejects_bad_place2d_index(self):
        s = load_ma(SAMPLE, animation=True)
        s["animation"]["props"].append({"kind": "place2d", "index": 99, "inputs": {}})
        with self.assertRaises(schema.SchemaError):
            schema.validate(s)


if __name__ == "__main__":
    unittest.main()
