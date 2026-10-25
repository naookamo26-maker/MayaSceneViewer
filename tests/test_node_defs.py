# -*- coding: utf-8 -*-
"""自作ノードの定義（node_defs）の読み込み・検証・シーンへの適用のテスト。

  python tests/test_node_defs.py
前提: python tools/make_nodedef_sample.py（samples/nodedef_sample.ma と定義を作る）
評価そのもの（計算の結果）は web_src/tests/nodeDef.test.mjs で確かめる。
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import node_defs as ND  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "nodedef_sample.ma")
DEFS = os.path.join(ROOT, "samples", "nodedef_sample_defs.json")

BASE = {"attributes": [
    {"name": "input", "short": "in", "type": "double", "array": True},
    {"name": "target", "short": "tg", "type": "compound", "array": True, "children": [
        {"name": "targetMatrix", "short": "tm", "type": "matrix"},
        {"name": "targetTranslate", "short": "tt", "type": "vector"}]},
    {"name": "settings", "short": "st", "type": "compound", "children": [
        {"name": "gain", "short": "gn", "type": "double", "default": 2}]},
    {"name": "offset", "short": "of", "type": "vector", "children": ["ofX", "ofY", "ofZ"]},
    {"name": "output", "short": "o", "type": "double", "output": True},
    {"name": "outValues", "short": "ov", "type": "double", "array": True, "output": True}],
    "compute": "output = 1"}


def node_def(compute=None, **over):
    spec = dict(BASE, **over)
    if compute is not None:
        spec["compute"] = compute
    return ND.NodeDef("testNode", spec, "test.json", None, None)


class TestCompile(unittest.TestCase):
    def test_array_loop_and_children(self):
        nd = node_def(["s = 0", "for i in indices(input):", "    s += input[i] * settings.gain",
                       "for i in indices(target):", "    p = xform_point(target[i].targetTranslate, target[i].targetMatrix)",
                       "    outValues[i] = p.x + offset.y", "output = s"])
        ir = nd.ir
        self.assertEqual(ir[1][0], "for")
        self.assertEqual(ir[1][2], ["c", "indices", [["p", [["in", None]]]]])
        self.assertEqual(ir[1][3][0][3][3], ["a", [["st", None], ["gn", None]]])   # compound（配列でない）の子
        self.assertEqual(ir[2][3][1][1], ["o", [["ov", ["l", "i"]]]])                # 出力の配列の要素

    def test_errors(self):
        cases = {
            "output = foo": "名前 foo が分かりません",
            "input = 1": "入力の属性 input には代入できません",
            "output = outValues[0]": "出力の属性 outValues は読めません",
            "output = input": "配列の属性 input は要素",
            "while 1:\n    pass": "while",
            "import math\noutput = 1": "import",
            "output = math.sin(1)": "math.sin ではなく sin",
            "output = unknownFunc(1)": "関数 unknownFunc は使えません",
            "output = sin(1, 2)": "引数の数",
            "for input in range(3):\n    output = 1": "属性の名前と同じ",
            "outValues = 1": "要素",
            "output = target[0]": "compound",
            "output = target.targetMatrix": "要素を選んでから",
            "output = indices(output)": "配列の属性に使います",
            "x = 1\noutput = x +": "2 行目",
            "output = 'text'": "数以外の値",
            "sin = 1\noutput = sin": "変数には使えません",
        }
        for code, expect in cases.items():
            with self.subTest(code=code):
                with self.assertRaises(ND.DefError) as cm:
                    node_def(code)
                self.assertIn(expect, cm.exception.text())

    def test_attribute_errors(self):
        with self.assertRaisesRegex(ND.DefError, "出力の属性"):
            node_def(attributes=[{"name": "a", "type": "double"}])
        with self.assertRaisesRegex(ND.DefError, "型 'text' は使えません"):
            node_def(attributes=[{"name": "a", "type": "text"}, {"name": "o", "output": True}])
        with self.assertRaisesRegex(ND.DefError, "既定値"):
            node_def(attributes=[{"name": "a", "type": "vector", "default": [1, 2]}, {"name": "o", "output": True}])
        with self.assertRaisesRegex(ND.DefError, "重なっています"):
            node_def(attributes=[{"name": "a", "short": "x"}, {"name": "b", "short": "x"}, {"name": "o", "output": True}])

    def test_normalize_plug(self):
        nd = node_def()
        cases = {"input[2]": "in[2]", "in[2]": "in[2]", "ip[3]": "in[3]",       # ip: .ma の読み込みで input が置き換わった名前
                 "target[0].targetMatrix": "tg[0].tm", "tg[1].tt": "tg[1].tt", "settings.gain": "gn", "st.gn": "gn",
                 "gain": "gn", "offset": "of", "ofY": "ofY", "output": "o", "outValues[4]": "ov[4]", "other": "other"}
        for src, expect in cases.items():
            self.assertEqual(nd.normalize_plug(src), expect, src)


class TestLoad(unittest.TestCase):
    def test_bundled_folder(self):
        """同梱のフォルダ（ma_viewer/node_defs）の定義はすべて読める"""
        self.assertTrue(os.path.isdir(ND.DEF_DIR))
        defs = ND.load_definitions()
        self.assertEqual(defs.errors, {})

    def test_file_errors(self):
        with tempfile.TemporaryDirectory() as d:
            bad = os.path.join(d, "bad.json")
            with open(bad, "w", encoding="utf-8") as f:
                f.write("{ not json")
            other = os.path.join(d, "other.json")
            with open(other, "w", encoding="utf-8") as f:
                json.dump({"nodes": {}}, f)
            defs = ND.load_definitions([bad, other])
        self.assertIn("読めません", defs.errors["bad.json"])
        self.assertIn("format", defs.errors["other.json"])


class TestScene(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.defs = ND.load_definitions([DEFS])
        cls.scene = load_ma(SAMPLE, animation=True, node_defs=cls.defs)
        cls.anim = cls.scene["animation"]
        cls.graph = {g["name"]: g for g in cls.anim["graph"]}

    def test_graph(self):
        ws = self.graph["ws1"]
        self.assertEqual((ws["type"], ws["def"]), ("weightedSum", "weightedSum"))
        self.assertEqual(ws["attrs"], {"in[1]": 2.0, "in[3]": 1.0, "w[0]": 0.5, "w[3]": 2.0})
        self.assertIn("in[0]", ws["inputs"])                      # 長い名前（input[0]）で接続していても短い名前
        mb = self.graph["mb1"]
        self.assertEqual(sorted(mb["inputs"]), ["tg[0].tm", "tg[1].tm"])   # target[1].targetMatrix も短い名前
        self.assertEqual(self.graph["jC"]["inputs"]["tx"]["attr"], "otx")

    def test_node_defs_in_animation(self):
        self.assertEqual(sorted(self.anim["nodeDefs"]), ["angleDouble", "divider", "matrixBlend", "waveNode",
                                                         "weightedSum"])
        d = self.anim["nodeDefs"]["matrixBlend"]
        self.assertEqual(d["attributes"][1]["components"], ["otx", "oty", "otz"])
        self.assertEqual(d["ir"][0][0], "set")

    def test_warnings(self):
        w = self.scene["warnings"]
        self.assertTrue(any("同梱の定義で評価します" in x and "weightedSum（1 個）" in x for x in w))
        self.assertTrue(any("1.0 用ですが、シーンは 1.1" in x for x in w))
        self.assertTrue(any("brokenNode を使えません" in x and "1 行目" in x for x in w))
        # 定義で評価するノードは「未対応」にしない（定義の壊れた brokenNode だけ）
        anim_w = " ".join(self.anim["warnings"])
        self.assertIn("brokenNode", anim_w)
        for t in ("weightedSum", "matrixBlend", "angleDouble", "waveNode", "divider"):
            self.assertNotIn(t, anim_w)
        self.assertEqual([self.scene["nodes"][i]["name"] for i in self.anim["tainted"]], ["jE"])

    def test_without_definitions(self):
        """定義がなければ、これまでどおり未対応のノード"""
        sc = load_ma(SAMPLE, animation=True, node_defs=ND.Definitions())
        # 自作ノードの先にしかカーブがないので、アニメーションそのものがなくなる
        self.assertIsNone(sc.get("animation"))
        self.assertTrue(any("jA" in w and "ws1（weightedSum）" in w for w in sc["warnings"]))

    def test_rig_report(self):
        text = rig_report_file(SAMPLE, self.defs)
        self.assertIn("■ 定義で評価する自作ノード", text)
        self.assertIn("weightedSum（ws1。定義 nodedef_sample_defs.json）", text)
        self.assertIn("■ 使えない自作ノードの定義", text)


if __name__ == "__main__":
    unittest.main()
