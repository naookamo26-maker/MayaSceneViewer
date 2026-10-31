# -*- coding: utf-8 -*-
"""層を重ねるノード（layeredShader・layeredTexture）のマテリアル・テクスチャ。

.ma の読み込み（extract_ma）と、Maya からの読み込み（extract_maya。つながりを持つ偽の cmds で）の両方で、
表示する層（上から見て最初の不透明な層）のテクスチャを使い、それより上の見える層を警告することを確かめる。

  python tests/test_layered.py
"""
from __future__ import annotations

import os
import re
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

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
connectAttr "decal_mat.ot" "lsA.cs[0].it";
connectAttr "base_mat.oc" "lsA.cs[1].c";
connectAttr "base_mat.ot" "lsA.cs[1].it";
createNode file -n "direct_file";
	setAttr ".ftn" -type "string" "direct.png";
createNode layeredShader -n "lsB";
	setAttr ".cs[0].it" -type "float3" 0 0 0 ;
connectAttr "direct_file.oc" "lsB.cs[0].c";
createNode layeredShader -n "lsC";
	setAttr ".cs[0].c" -type "float3" 1 0 0 ;
	setAttr ".cs[0].it" -type "float3" 1 1 1 ;
	setAttr ".cs[1].c" -type "float3" 0 0 1 ;
	setAttr ".cs[1].it" -type "float3" 0 0 0 ;
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


class GraphCmds:
    """.ma のつながりと値をそのまま持つ偽の cmds（マテリアルまわりだけ）"""

    LONG = {"c": "color", "it": "transparency", "a": "alpha", "oc": "outColor", "ot": "outTransparency",
            "ftn": "fileTextureName", "cs": "inputs", "bm": "blendMode", "iv": "isVisible", "ss": "surfaceShader"}
    DEFAULTS = {"transparency": (0.0, 0.0, 0.0), "alpha": 1.0, "blendMode": 1, "isVisible": True,
                "color": (0.5, 0.5, 0.5), "repeatUV": (1.0, 1.0), "offset": (0.0, 0.0), "uvTilingMode": 0,
                "computedFileTextureNamePattern": ""}

    def __init__(self, ms):
        self.types = {n.name: n.type for n in ms.nodes}
        self.values, self.conns = {}, {}
        for n in ms.nodes:
            for k, v in (n.raw or {}).items():
                if v:
                    self.values[(n.name, self.long(k))] = v[0] if len(v) == 1 else tuple(float(x) for x in v)
        for src, sattr, dst, dattr in ms.connections:
            self.conns[(dst.name, self.long(dattr))] = (src.name, self.long(sattr))

    def long(self, attr):
        return re.sub(r"[A-Za-z]+", lambda m: self.LONG.get(m.group(0), m.group(0)), attr)

    def nodeType(self, node):
        return self.types[node]

    def split(self, plug):
        node, attr = plug.split(".", 1)
        return node, self.long(attr)                     # Maya と同じく、短い名前でも長い名前でも受け付ける

    def getAttr(self, plug, multiIndices=False):
        node, attr = self.split(plug)
        if multiIndices:
            pat = re.compile(r"^%s\[(\d+)\]" % re.escape(attr))
            idx = {int(m.group(1)) for (n, a) in list(self.values) + list(self.conns) if n == node for m in [pat.match(a)] if m}
            return sorted(idx)
        v = self.values.get((node, attr))
        if v is None:
            v = self.DEFAULTS.get(attr.rsplit(".", 1)[-1], 0.0)
        if attr.endswith("fileTextureName"):
            return str(v).strip('"')
        if isinstance(v, tuple):
            return [v]
        if isinstance(v, str):
            low = v.lower()
            if low in ("yes", "no", "on", "off", "true", "false"):
                return low in ("yes", "on", "true")
            return float(v)
        return v

    def listConnections(self, plug, source=True, destination=True, plugs=False, skipConversionNodes=False, type=None):
        node, attr = self.split(plug)
        out = []
        if source:
            src = self.conns.get((node, attr))
            if src and (type is None or self.types[src[0]] == type):
                out.append("%s.%s" % src if plugs else src[0])
        if destination and not source:
            for (dn, da), (sn, sa) in self.conns.items():
                if sn == node and sa == attr:
                    out.append("%s.%s" % (dn, da) if plugs else dn)
        return out

    def attributeQuery(self, attr, node=None, exists=False):
        from ma_viewer.materials import MAP_ATTRS
        t = self.types.get(node)
        if t == "file":
            return attr in ("outTransparency", "outAlpha", "ot", "oa")
        names = {a for attrs in MAP_ATTRS.get(t, {}).values() for a in attrs}
        return attr in names or attr in ("transparency", "color")

    def objExists(self, plug):
        node, attr = self.split(plug)
        return node in self.types and (bool(re.match(r"^inputs\[\d+\]\.", attr)) or self.attributeQuery(attr, node))


class TestMaya(unittest.TestCase):
    """extract_maya の層の処理（偽の cmds に .ma のつながりを入れて、.ma の読み込みと同じ結果になるか）"""

    @classmethod
    def setUpClass(cls):
        if "maya.cmds" not in sys.modules:
            from test_extract_maya_fake import install_fake_maya
            install_fake_maya()
        from ma_viewer import extract_maya
        cls.em = extract_maya
        cls.ms = parse_ma_text(HEADER + MA, "layered.ma")
        cls.fake = GraphCmds(cls.ms)

    def setUp(self):
        cmds = self.em.cmds
        names = ("nodeType", "getAttr", "listConnections", "attributeQuery", "objExists")
        self.saved = {k: getattr(cmds, k, None) for k in names}
        for k in names:
            setattr(cmds, k, getattr(self.fake, k))

    def tearDown(self):
        for k, v in self.saved.items():
            if v is None:
                delattr(self.em.cmds, k)
            else:
                setattr(self.em.cmds, k, v)

    def extractor(self):
        from ma_viewer.materials import TextureResolver
        ex = object.__new__(self.em._Extractor)
        ex.materials, ex.textures, ex.warnings = [], [], []
        ex._mat_of, ex._tex_of, ex._file_of_mat = {}, {}, {}
        ex.resolver = TextureResolver("")
        return ex

    def test_same_as_ma(self):
        ex = self.extractor()
        got = {}
        for name in ("lsA", "lsB", "lsC", "ltMat"):
            m = ex.materials[ex._material_for_sg(name + "SG")]
            got[name] = (m["name"], m["type"], ex.textures[m["texture"]]["node"] if m["texture"] >= 0 else None)
        self.assertEqual(got, {"lsA": ("lsA", "layeredShader", "base_file"),
                               "lsB": ("lsB", "layeredShader", "direct_file"),
                               "lsC": ("lsC", "layeredShader", None),
                               "ltMat": ("ltMat", "lambert", "bottom_file")})
        w = "\n".join(ex.warnings)
        self.assertIn("lsA（layeredShader）: 層 0", w)
        self.assertIn("lt（layeredTexture）: 層 0", w)
        self.assertNotIn("lsC（", w)


if __name__ == "__main__":
    unittest.main()
