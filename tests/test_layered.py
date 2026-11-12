# -*- coding: utf-8 -*-
"""層を重ねるノード（layeredShader・layeredTexture）のマテリアル・テクスチャ。

表示する層（上から見て最初の不透明な層）のテクスチャを使い、それより上の見える層を警告することを確かめる。

  python tests/test_layered.py
"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.extract_ma import _MaterialBuilder  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402
from ma_viewer.materials import pick_layer  # noqa: E402

# lsA: 層 0 はデカール（file のアルファで抜くマスク）、層 1 は不透明な土台 → 層 1 を表示し、層 0 を警告
# lsB: 層 0 の色に file が直接つながり、透明度 0 → その file
# lsC: 層 0 は完全に透明（見えない）、層 1 は色の値だけ → 層 1 の色、警告なし
# ltMat: lambert の色に layeredTexture。層 0 はアルファ 0.5、層 1 は不透明 → 層 1 の file、層 0 を警告
MA = """
createNode lambert -n "decal_mat";
createNode file -n "decal_file";
	setAttr ".ftn" -type "string" "decal.png";
connectAttr "decal_file.oc" "decal_mat.c";
connectAttr "decal_file.ot" "decal_mat.it";
createNode lambert -n "base_mat";
createNode file -n "base_file";
	setAttr ".ftn" -type "string" "base.png";
connectAttr "base_file.oc" "base_mat.c";
createNode layeredShader -n "lsA";
	setAttr -s 2 ".cs";
connectAttr "decal_mat.oc" "lsA.cs[0].c";
connectAttr "decal_mat.ot" "lsA.cs[0].t";
connectAttr "base_mat.oc" "lsA.cs[1].c";
connectAttr "base_mat.ot" "lsA.cs[1].t";
createNode file -n "direct_file";
	setAttr ".ftn" -type "string" "direct.png";
createNode layeredShader -n "lsB";
	setAttr ".cs[0].t" -type "float3" 0 0 0 ;
connectAttr "direct_file.oc" "lsB.cs[0].c";
createNode layeredShader -n "lsC";
	setAttr ".cs[0].c" -type "float3" 1 0 0 ;
	setAttr ".cs[0].t" -type "float3" 1 1 1 ;
	setAttr ".cs[1].c" -type "float3" 0 0 1 ;
	setAttr ".cs[1].t" -type "float3" 0 0 0 ;
createNode file -n "top_file";
	setAttr ".ftn" -type "string" "top.png";
createNode file -n "bottom_file";
	setAttr ".ftn" -type "string" "bottom.png";
createNode layeredTexture -n "lt";
	setAttr ".cs[0].a" 0.5;
connectAttr "top_file.oc" "lt.cs[0].c";
connectAttr "bottom_file.oc" "lt.cs[1].c";
createNode lambert -n "ltMat";
connectAttr "lt.oc" "ltMat.c";
"""
for _name in ("lsA", "lsB", "lsC", "ltMat"):
    MA += 'createNode shadingEngine -n "%sSG";\nconnectAttr "%s.oc" "%sSG.ss";\n' % (_name, _name, _name)
HEADER = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


def tex_node(builder, mat):
    return builder.textures[mat["texture"]]["node"] if mat["texture"] >= 0 else None


class TestPickLayer(unittest.TestCase):
    def test_rules(self):
        shader = {0: {"value": 0.5}, 1: {"connected": True}, 2: {"value": 0.0}, 3: {}}
        self.assertEqual(pick_layer("layeredShader", list(shader), lambda i: shader[i]), (2, [0, 1]))
        clear = {0: {"value": 1.0}, 1: {}}
        self.assertEqual(pick_layer("layeredShader", list(clear), lambda i: clear[i]), (1, []))   # 透明な層は数えない
        tex = {0: {"value": 1.0, "blend": 4}, 1: {"value": 1.0, "visible": False}, 2: {}}       # 4: Add は重ねる
        self.assertEqual(pick_layer("layeredTexture", list(tex), lambda i: tex[i]), (2, [0]))
        none = {0: {"value": 0.3}, 1: {"connected": True}}
        self.assertEqual(pick_layer("layeredShader", list(none), lambda i: none[i]), (1, [0]))   # 不透明がない: いちばん下


class TestMa(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ms = parse_ma_text(HEADER + MA, "layered.ma")
        cls.b = _MaterialBuilder(cls.ms)
        cls.mats = {}
        for name in ("lsA", "lsB", "lsC", "ltMat"):
            i = cls.b.material_for_sg(cls.ms.resolve(name + "SG"))
            cls.mats[name] = cls.b.materials[i]

    def test_layered_shader(self):
        a = self.mats["lsA"]
        self.assertEqual((a["name"], a["type"]), ("lsA", "layeredShader"))     # 名前と種類はシーンのまま
        self.assertEqual(tex_node(self.b, a), "base_file")
        self.assertEqual(tex_node(self.b, self.mats["lsB"]), "direct_file")
        c = self.mats["lsC"]
        self.assertEqual((c["texture"], c["color"]), (-1, [0.0, 0.0, 1.0]))

    def test_layered_texture(self):
        self.assertEqual(tex_node(self.b, self.mats["ltMat"]), "bottom_file")

    def test_warnings(self):
        w = "\n".join(self.ms.warnings)
        self.assertIn("lsA（layeredShader）: 層 0 は半透明かマスク付きのため重ねて表示できません。層 1（base_mat）", w)
        self.assertIn("lt（layeredTexture）: 層 0", w)
        self.assertNotIn("lsB（", w)
        self.assertNotIn("lsC（", w)


if __name__ == "__main__":
    unittest.main()
