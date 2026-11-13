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

    def test_edit_with_moved_path(self):
        """保存したあとに元のファイルで階層を変えた: パスで見つからなければ、同じ名前のノード（1 つだけ）に当てる。
        見つからない編集は、相手の名前を記録する（リグの診断に出す）"""
        self.write("model.ma", 'createNode transform -n "geo";\n'
                               'createNode transform -n "twin";\n'
                               'createNode transform -n "twin" -p "geo";\n')
        p = self.write("main.ma", 'createNode transform -n "face:ctrl";\n'
                                  'createNode reference -n "mRN";\n'
                                  '\tsetAttr ".ed" -type "dataReferenceEdits" \n'
                                  '\t\t"mRN" "mRN" 4\n'
                                  '\t\t5 4 "mRN" "|m:old_grp|m:geo.translateX" "mRN.placeHolderList[1]" ""\n'
                                  '\t\t2 "|m:old_grp|m:geo" "translateY" " 2"\n'
                                  '\t\t2 "|m:old_grp|m:twin" "translateY" " 3"\n'
                                  '\t\t2 "|m:gone" "translateY" " 4";\n'
                                  'connectAttr "face:ctrl.tx" "mRN.phl[1]";\n',
                       refs='file -r -ns "m" -rfn "mRN" "model.ma";\n')
        ms = parse_ma_file(p)
        geo = ms.resolve("|m:geo")
        self.assertEqual((geo.inputs["tx"][0].name, geo.inputs["tx"][1]), ("face:ctrl", "tx"))   # プレースホルダー
        self.assertEqual(parse_attrs(ms.text, geo)["ty"], 2.0)                                     # setAttr
        self.assertEqual([p for p, _r in ms.ref_edit_by_name], ["|m:old_grp|m:geo"] * 2)
        missing = sorted(name for _rn, _k, name in ms.ref_edit_missing)
        self.assertEqual(missing, ["|m:gone", "|m:old_grp|m:twin"])        # twin は同じ名前が 2 つあるので当てない
        self.assertTrue(any("相手のノードがない" in w for w in ms.warnings))
        from ma_viewer.rig_report import _ref_edit_section
        text = "\n".join(_ref_edit_section(ms))
        self.assertIn("|m:gone（mRN の編集: setAttr 1 件）", text)

    # 付録 A（docs/maintenance_plan.md の B1）: 独自の属性の、長い名前で書いた編集と短い名前で書いた接続
    RIG_B1 = ('createNode transform -n "ctrl";\n'
              '\taddAttr -ci true -sn "ikfk" -ln "ikFkBlend" -min 0 -max 1 -at "double";\n'
              '\tsetAttr -k on ".ikfk";\n'
              'createNode joint -n "jnt";\n'
              'createNode multiplyDivide -n "md";\n'
              '\tsetAttr ".i2" -type "float3" 10 10 10 ;\n'
              'connectAttr "ctrl.ikfk" "md.i1x";\n'
              'connectAttr "md.ox" "jnt.tx";\n')

    def shot_b1(self, edits):
        self.write("rig.ma", self.RIG_B1)
        return self.write("shot.ma", 'createNode reference -n "rigRN";\n'
                                     '\tsetAttr -s 2 ".phl";\n'
                                     '\tsetAttr ".phl[1]" 0;\n'
                                     '\tsetAttr ".ed" -type "dataReferenceEdits" \n'
                                     '\t\t"rigRN"\n'
                                     '\t\t"rigRN" 0\n'
                                     '\t\t"rigRN" %d\n%s;\n'
                                     'createNode animCurveTU -n "ctrl_ikFkBlend";\n'
                                     '\tsetAttr ".tan" 2;\n'
                                     '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 1;\n'
                                     'createNode script -n "sceneConfigurationScriptNode";\n'
                                     '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";\n'
                                     '\tsetAttr ".st" 6;\n'
                                     'connectAttr "ctrl_ikFkBlend.o" "rigRN.phl[1]";\n'
                                     % (len(edits), "\n".join("\t\t" + e for e in edits)),
                          refs='file -rdi 1 -ns "rig" -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "rig.ma";\n'
                               'file -r -ns "rig" -dr 1 -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "rig.ma";\n')

    def test_custom_attr_long_name_edit(self):
        """B1: 編集の長い名前（ctrl.ikFkBlend）を、リグの中の接続の短い名前（ctrl.ikfk）にそろえる。
        カーブが再生され（警告なし）、編集の setAttr の値も短い名前で読める"""
        p = self.shot_b1(['5 4 "rigRN" "|rig:ctrl.ikFkBlend" "rigRN.placeHolderList[1]" ""',
                          '2 "|rig:ctrl" "ikFkBlend" " 0.5"'])
        ms = parse_ma_file(p)
        ctrl = ms.resolve("rig:ctrl")
        self.assertEqual(ctrl.custom_names, {"ikFkBlend": "ikfk"})
        self.assertEqual(ctrl.inputs["ikfk"][0].name, "ctrl_ikFkBlend")
        self.assertNotIn("ikFkBlend", ctrl.inputs)
        self.assertEqual(parse_attrs(ms.text, ctrl)["ikfk"], 0.5)
        scene = load_ma(p, animation=True)
        anim = scene["animation"]
        self.assertEqual(len(anim["curves"]), 1)
        self.assertFalse([w for w in anim.get("warnings", []) if "ikFkBlend" in w], anim.get("warnings"))
        self.assertEqual(self.eval_tx(scene, "jnt", [1, 12.5, 24]), [0.0, 5.0, 10.0])

    def eval_tx(self, scene, name, frames):
        """ビューアの評価（Node.js）でのノードのワールドの移動 X。Node がなければテストを飛ばす"""
        import json
        import subprocess
        node = shutil.which("node")
        web = os.path.join(ROOT, "web_src")
        if node is None or not os.path.isdir(os.path.join(web, "node_modules")):
            self.skipTest("Node.js と web_src の npm ci が要る")
        sj = os.path.join(self.dir, "scene.json")
        with open(sj, "w", encoding="utf-8") as f:
            json.dump(scene, f)
        code = ("import { readFileSync } from 'node:fs';"
                "import { makeViewer, viewerFrame } from './tools/verify.mjs';"
                "const s = JSON.parse(readFileSync(process.argv[1], 'utf8')); const v = makeViewer(s);"
                "const i = s.nodes.findIndex((n) => n.name.endsWith(process.argv[2]));"
                "console.log(JSON.stringify(JSON.parse(process.argv[3]).map((f) => "
                "+viewerFrame(v, f).world[i].elements[12].toFixed(6))));")
        out = subprocess.run([node, "--input-type=module", "-e", code, sj, name, json.dumps(frames)], cwd=web,
                             check=True, capture_output=True, text=True).stdout
        return json.loads(out)

    def test_custom_attr_short_name_edit_unchanged(self):
        """短い名前で書いた編集は今までどおり"""
        p = self.shot_b1(['5 4 "rigRN" "|rig:ctrl.ikfk" "rigRN.placeHolderList[1]" ""'])
        ms = parse_ma_file(p)
        self.assertEqual(ms.resolve("rig:ctrl").inputs["ikfk"][0].name, "ctrl_ikFkBlend")

    def test_custom_names_in_skipped_block_and_compound(self):
        """属性を読み飛ばすノード（計算ノード）のブロックの中の addAttr・複合の属性の子（-p）・ノード名つきの addAttr。
        接続を書いた名前（長い・短い）によらず同じキーになる"""
        p = self.write("a.ma", 'createNode multiplyDivide -n "md";\n'
                               '\taddAttr -ci true -sn "amt" -ln "amount" -at "double";\n'
                               '\taddAttr -ci true -uac -sn "vec" -ln "vector" -at "double3" -nc 3;\n'
                               '\taddAttr -ci true -sn "vx" -ln "vectorX" -at "double" -p "vector";\n'
                               '\tsetAttr ".i2" -type "float3" 1 1 1 ;\n'
                               'createNode transform -n "a";\n'
                               'createNode transform -n "b";\n'
                               'addAttr -ci true -sn "gn" -ln "gain" -at "double" "b";\n'
                               'connectAttr "a.tx" "md.amount";\n'
                               'connectAttr "a.ty" "md.vector.vectorX";\n'
                               'connectAttr "md.amt" "b.gain";\n')
        ms = parse_ma_file(p)
        md, b = ms.resolve("md"), ms.resolve("b")
        self.assertEqual(md.custom_names, {"amount": "amt", "vector": "vec", "vectorX": "vx"})
        self.assertEqual(sorted(md.inputs), ["amt", "vec.vx"])
        self.assertEqual(b.inputs["gn"], (md, "amt"))

    def test_custom_attr_added_by_edit(self):
        """リファレンスの編集の addAttr（code 1）で足した属性: 長い名前で書いた接続も短い名前にそろえる"""
        self.write("rig.ma", 'createNode transform -n "ctrl";\n')
        p = self.write("shot.ma", 'createNode transform -n "drv";\n'
                                  'createNode reference -n "rigRN";\n'
                                  '\tsetAttr ".ed" -type "dataReferenceEdits" \n'
                                  '\t\t"rigRN" "rigRN" 3\n'
                                  '\t\t1 "|rig:ctrl" "extra" "ex" " -ci 1 -sn \\"ex\\" -ln \\"extra\\" -at \\"double\\""\n'
                                  '\t\t3 "|drv.tx" "|rig:ctrl.extra" ""\n'
                                  '\t\t2 "|rig:ctrl" "extra" " 2";\n',
                       refs='file -r -ns "rig" -rfn "rigRN" "rig.ma";\n')
        ms = parse_ma_file(p)
        ctrl = ms.resolve("rig:ctrl")
        self.assertEqual(ctrl.custom_names, {"extra": "ex"})
        self.assertEqual(ctrl.inputs["ex"][0].name, "drv")
        self.assertEqual(parse_attrs(ms.text, ctrl)["ex"], 2.0)

    def test_unit_warnings(self):
        """M1: cm 以外の作業単位は対応しない（警告だけ）。リファレンスは長さ・角度・時間の違いを警告する"""
        path = os.path.join(self.dir, "inch.ma")
        with open(path, "w", encoding="utf-8") as f:
            f.write('requires maya "2024";\ncurrentUnit -l inch -a degree -t film;\ncreateNode joint -n "j";\n')
        scene = load_ma(path)
        self.assertTrue(any("作業単位が in です。cm 以外の作業単位には対応していません" in w and "保存し直して" in w
                            for w in scene["warnings"]), scene["warnings"])
        ref = os.path.join(self.dir, "ref.ma")
        with open(ref, "w", encoding="utf-8") as f:
            f.write('requires maya "2024";\ncurrentUnit -l centimeter -a radian -t ntsc;\ncreateNode joint -n "k";\n')
        p = self.write("main.ma", "", refs='file -r -ns "r" -rfn "rRN" "ref.ma";\n')
        ms = parse_ma_file(p)
        w = [x for x in ms.warnings if "リファレンス「r」の作業単位" in x]
        self.assertEqual(len(w), 1, ms.warnings)
        self.assertIn("（角度 rad・時間 ntsc）がシーン（角度 deg・時間 film）と違います", w[0])
        self.write("same.ma", 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n')
        ms = parse_ma_file(self.write("main2.ma", "", refs='file -r -ns "s" -rfn "sRN" "same.ma";\n'))
        self.assertFalse([x for x in ms.warnings if "作業単位" in x])

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
