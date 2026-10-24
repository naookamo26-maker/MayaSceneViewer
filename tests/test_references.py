# -*- coding: utf-8 -*-
"""リファレンス（file -r）の読み込みのテスト。

  python tests/test_references.py
前提: python tools/make_reference_sample.py（samples/reference_project を作る）
"""
from __future__ import annotations

import os
import shutil
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.animation import build_animation  # noqa: E402
from ma_viewer.extract_ma import load_ma, scene_to_dict  # noqa: E402
from ma_viewer.ma_scene import parse_ma_file  # noqa: E402
from ma_viewer.references import parse_reference_edits  # noqa: E402
from ma_viewer.rig import parse_attrs  # noqa: E402

SHOT = os.path.join(ROOT, "samples", "reference_project", "scenes", "shot.ma")
HEADER = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


class TestSample(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(SHOT, animation=True)
        cls.nodes = {n["name"]: n for n in cls.scene["nodes"]}
        cls.refs = {r["namespace"]: r for r in cls.scene["source"]["references"]}

    def test_reference_states(self):
        """読み込んだもの・アンロード・見つからないもの。入れ子は名前空間をつなげる"""
        self.assertTrue(self.refs["armA"]["loaded"])
        self.assertTrue(self.refs["armA:prop"]["loaded"])
        self.assertEqual(self.refs["armA:prop"]["depth"], 2)
        self.assertFalse(self.refs["armB"]["loaded"])
        self.assertIn("アンロード", self.refs["armB"]["reason"])
        self.assertFalse(self.refs["missing"]["loaded"])
        self.assertIn("見つかりません", self.refs["missing"]["reason"])
        # 別のマシンの絶対パス → プロジェクトの中で見つける
        self.assertTrue(self.refs["armA"]["resolved"].replace("\\", "/").endswith("reference_project/assets/arm_rig.ma"))
        self.assertTrue(any("armB" in w and "アンロード" in w for w in self.scene["warnings"]))
        self.assertFalse(any(n.startswith("armB:") for n in self.nodes))

    def test_namespaced_nodes(self):
        self.assertIn("armA:shoulder", self.nodes)
        self.assertIn("armA:prop:crate", self.nodes)
        meshes = {m["name"]: m for m in self.scene["meshes"]}
        sk = meshes["armA:arm_geoShape"]["skin"]
        self.assertEqual(sk["cluster"], "armA:skinCluster1")
        self.assertEqual([self.scene["nodes"][i]["name"] for i in sk["influences"]][:2], ["armA:shoulder", "armA:elbow"])

    def test_shared_nodes_not_imported(self):
        """リファレンスの中の persp（createNode -s）・time1・再生範囲は、シーンのものを使う"""
        self.assertEqual(self.scene["cameras"], [])
        self.assertNotIn("armA:prop:persp", self.nodes)
        anim = self.scene["animation"]
        self.assertEqual((anim["start"], anim["end"]), (1.0, 24.0))
        self.assertEqual(anim["current"], 1.0)

    def test_parent_edit(self):
        """編集の parent: armA:rig_grp を world_grp（tz = 10）の子にする"""
        grp = self.nodes["armA:rig_grp"]
        self.assertEqual(grp["path"], "|world_grp|armA:rig_grp")
        self.assertEqual(self.scene["nodes"][grp["parent"]]["name"], "world_grp")
        self.assertAlmostEqual(self.nodes["armA:shoulder"]["worldMatrix"][14], 10.0)

    def test_nested_edits(self):
        """内側のファイル（arm_rig.ma）の編集（スケール 2）と、外側のファイルの編集（移動 3）が両方効く"""
        crate = self.nodes["armA:prop:crate"]
        self.assertEqual(crate["attrs"]["s"], [2.0, 2.0, 2.0])
        self.assertEqual(crate["attrs"]["t"], [3.0, 0.0, 0.0])

    def test_custom_attr_edit(self):
        """独自の属性への setAttr の編集は、リグの評価で使う属性にも入る（既定値 0 → 1）"""
        g = {x["name"]: x for x in self.scene["animation"]["graph"]}
        self.assertEqual(g["armA:hand_ctrl"]["attrs"]["fkik"], 1.0)

    def test_placeholder_animation(self):
        """プレースホルダー（armARN.phl[1]）を通したアニメーションカーブが、armA:hand_ctrl.tx を動かす"""
        anim = self.scene["animation"]
        idx = self.scene["nodes"].index(self.nodes["armA:hand_ctrl"])
        ch = [c for c in anim["channels"] if c["node"] == idx]
        self.assertEqual([c["attr"] for c in ch], ["tx"])
        self.assertEqual(anim["curves"][ch[0]["curve"]]["name"], "hand_ctrl_translateX")

    def test_without_references(self):
        sc = load_ma(SHOT, references=False)
        self.assertFalse(any(":" in n["name"] for n in sc["nodes"]))
        self.assertTrue(all(not r["loaded"] for r in sc["source"]["references"]))
        self.assertFalse(any("相手のノードがない" in w for w in sc["warnings"]))


class TestEdits(unittest.TestCase):
    def test_parse(self):
        text = ('"rigRN" "rigRN" 0 "rigRN" 4 '
                '2 "|rig:a" "translate" " -type \\"double3\\" 1 2 3" '
                '1 "|rig:a" "foo" "foo" " -ci 1 -at \\"double\\"" '
                '5 4 "rigRN" "|rig:a.translateX" "rigRN.placeHolderList[1]" "" '
                '9 "|rig:a" '
                '"rig:subRN" 1 3 "rig:sub:b.t" "rig:c.t" ""')
        edits, bad = parse_reference_edits(text)
        self.assertEqual(bad, 1)                          # 知らない種類（9）は読み飛ばす
        self.assertEqual([c for c, _ in edits], [2, 1, 5, 3])
        self.assertEqual(edits[0][1], ["|rig:a", "translate", ' -type "double3" 1 2 3'])
        self.assertEqual(edits[2][1][1:3], ["|rig:a.translateX", "rigRN.placeHolderList[1]"])
        self.assertEqual(edits[3][1], ["rig:sub:b.t", "rig:c.t", ""])

    def test_joined_strings(self):
        edits, bad = parse_reference_edits('"RN" "RN" 1 2 "a" "b" " 1" + "23"')
        self.assertEqual((bad, edits), (0, [(2, ["a", "b", " 123"])]))


class TestFiles(unittest.TestCase):
    """一時フォルダに .ma を書いて確かめる"""

    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def write(self, name, body, refs=""):
        path = os.path.join(self.dir, name)
        with open(path, "w", encoding="utf-8") as f:
            f.write(refs + HEADER + body)
        return path

    def test_cycle(self):
        """自分自身を読み込むリファレンス・互いに読み込むリファレンスは読まない"""
        p = self.write("loop.ma", 'createNode transform -n "a";\n',
                       refs='file -r -ns "x" -rfn "xRN" "loop.ma";\n')
        ms = parse_ma_file(p)
        self.assertEqual([n.name for n in ms.nodes], ["a"])
        self.assertIn("循環", ms.ref_infos[0].reason)
        self.write("b.ma", 'createNode transform -n "b";\n', refs='file -r -ns "c" -rfn "cRN" "c.ma";\n')
        self.write("c.ma", 'createNode transform -n "c";\n', refs='file -r -ns "b" -rfn "bRN" "b.ma";\n')
        ms = parse_ma_file(os.path.join(self.dir, "b.ma"))
        self.assertEqual(sorted(n.name for n in ms.nodes), ["b", "c:c"])
        self.assertIn("循環", ms.ref_infos[1].reason)

    def test_names_and_connections(self):
        """パス・ルートの名前空間（:）・接続の名前に名前空間が付く。接続の編集（3・4）も当てる"""
        self.write("child.ma", 'createNode transform -n "grp";\n'
                               'createNode transform -n "a" -p "grp";\n'
                               'createNode transform -n "b" -p "|grp";\n'
                               'createNode multiplyDivide -n "md";\n'
                               'connectAttr "|grp|a.tx" "md.i1x";\n'
                               'connectAttr "md.ox" "|grp|b.tx";\n'
                               'connectAttr "a.msg" ":defaultRenderGlobals.msg";\n')
        p = self.write("main.ma", 'createNode transform -n "drv";\n'
                                  'createNode reference -n "cRN";\n'
                                  '\tsetAttr ".ed" -type "dataReferenceEdits" \n'
                                  '\t\t"cRN" "cRN" 2\n'
                                  '\t\t4 "c:md.ox" "|c:grp|c:b.tx" ""\n'
                                  '\t\t3 "|drv.ty" "|c:grp|c:b.ty" "";\n',
                       refs='file -r -ns "c" -rfn "cRN" "child.ma";\n')
        ms = parse_ma_file(p)
        self.assertEqual(ms.resolve("c:b").path, "|c:grp|c:b")
        b = ms.resolve("c:b")
        self.assertNotIn("tx", b.inputs)                              # 4: disconnectAttr
        self.assertEqual((b.inputs["ty"][0].name, b.inputs["ty"][1]), ("drv", "ty"))   # 3: connectAttr
        md = ms.resolve("c:md")
        self.assertEqual(md.inputs["i1x"][0].name, "c:a")
        self.assertEqual(md.ns, "c:")
        self.assertEqual(ms.resolve("drv").ns, "")

    def test_rename_prefix_and_default_namespace(self):
        """古い形式の -rpr（名前の前置き）と、名前空間の指定がないとき（ファイル名）"""
        self.write("prop.ma", 'createNode transform -n "p";\n')
        p = self.write("main.ma", "", refs='file -r -rpr "old" -rfn "oldRN" "prop.ma";\n'
                                            'file -r -rfn "propRN" "prop.ma";\n')
        ms = parse_ma_file(p)
        self.assertEqual(sorted(n.name for n in ms.nodes), ["old_p", "prop:p"])

    def test_span_after_reference(self):
        """リファレンスの本文はシーンの本文の後ろにつながる。ノードの範囲（span）からキーと属性を読める"""
        self.write("anim.ma", 'createNode joint -n "ctrl";\n'
                              '\taddAttr -ci true -sn "amt" -ln "amt" -at "double";\n'
                              '\tsetAttr -k on ".amt" 0.25;\n'
                              'createNode animCurveTL -n "ctrl_tx";\n'
                              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 10 4;\n'
                              'connectAttr "ctrl_tx.o" "ctrl.tx";\n')
        p = self.write("main.ma", 'createNode reference -n "aRN";\n'
                                  '\tsetAttr ".ed" -type "dataReferenceEdits" \n'
                                  '\t\t"aRN" "aRN" 1\n'
                                  '\t\t2 "a:ctrl" "amt" " 0.75";\n',
                       refs='file -r -ns "a" -rfn "aRN" "anim.ma";\n')
        ms = parse_ma_file(p)
        ctrl = ms.resolve("a:ctrl")
        self.assertEqual(parse_attrs(ms.text, ctrl)["amt"], 0.75)     # 編集の値（ファイルの 0.25 より後）
        scene_to_dict(ms)
        anim = build_animation(ms, ms.out_index)
        self.assertEqual(len(anim["curves"]), 1)
        self.assertEqual(anim["curves"][0]["name"], "a:ctrl_tx")


if __name__ == "__main__":
    unittest.main()
