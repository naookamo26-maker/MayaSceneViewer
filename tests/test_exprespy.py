# -*- coding: utf-8 -*-
"""exprespy（Python で式を書くノード）のコードの変換と、シーンへの適用のテスト。

  python tests/test_exprespy.py
前提: python tools/make_exprespy_sample.py（samples/exprespy_sample.ma を作る）
変換した定義の評価の結果は web_src/tests/exprespy.test.mjs で確かめる。
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import schema  # noqa: E402
from ma_viewer.exprespy import ExprespyError, io_plug, translate  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "exprespy_sample.ma")


def problem(code, kinds=None):
    try:
        translate(code, kinds if kinds is not None else {0: "vec3", 1: "num"})
    except ExprespyError as exc:
        return exc.text()
    return None


class TranslateTest(unittest.TestCase):
    def test_io_plug(self):
        self.assertEqual(io_plug("i[3]"), ("i", 3))
        self.assertEqual(io_plug("ip[2]"), ("i", 2))           # input は .ma の読み込みで ip になる
        self.assertEqual(io_plug("output[0]"), ("o", 0))
        self.assertIsNone(io_plug("cd"))

    def test_types_from_inputs_and_outputs(self):
        nd, outs, _ = translate("m = api.MEulerRotation(IN[0], IN[1]).asMatrix()\nm *= IN[2]\n"
                                "OUT[0] = api.MTransformationMatrix(m).rotation(False)\nOUT[1] = IN[1] * 2\n"
                                "OUT[2] = m",
                                {0: "vec3", 1: "num", 2: "mat"})
        types = {a.short: a.type for a in nd.attrs}
        self.assertEqual(types, {"i0": "double3", "i1": "double", "i2": "matrix", "o0": "double3", "o1": "double",
                                 "o2": "matrix"})
        self.assertEqual(outs, {0: "vec3", 1: "num", 2: "mat"})
        self.assertEqual(nd.normalize_plug("i[2]"), "i2")
        self.assertEqual(nd.normalize_plug("o[0]"), "o0")

    def test_time_input_is_seconds(self):
        nd, _, _ = translate("OUT[0] = IN[0] * 2", {0: "time"})
        self.assertIn("o0 = (time * 2)", nd.code)
        self.assertNotIn("i0", {a.short for a in nd.attrs})

    def test_connected_output_without_assignment(self):
        nd, outs, _ = translate("OUT[0] = 1.0", {}, out_connected={0, 3})
        self.assertEqual(outs, {0: "num", 3: "num"})

    def test_quaternion_and_euler_methods(self):
        nd, outs, _ = translate("q = api.MQuaternion(IN[0], IN[1])\nr = api.MEulerRotation([0., 0., 0.], 2)\n"
                                "r.setValue(q)\nr.reorderIt(1)\nOUT[0] = r\nOUT[1] = q",
                                {0: "vec3", 1: "vec3"})
        self.assertIn("euler_from_quat(", nd.code)
        self.assertIn("euler_from_quat(quat_from_euler(r, 2), 1)", nd.code)
        self.assertEqual(outs, {0: "vec3", 1: "vec4"})

    def test_unsupported(self):
        cases = {
            "OUT[0] = COUNT": "if not COUNT:（最初の 1 回だけの初期化）の形でだけ",
            "s = 0\nfor i in range(2):\n    s += IN[i]\nOUT[0] = s": "番号を変数で選ぶ",
            'OUT[0] = cmds.getAttr("a.tx")': "maya.cmds",
            "def f(x):\n    return f(x)\nOUT[0] = f(1)": "再帰呼び出し",
            "def f(x):\n    for i in range(3):\n        return x\n    return 0\nOUT[0] = f(1)": "ループの中の return",
            "def f(x):\n    if x:\n        return 1\nOUT[0] = f(1)": "すべての道で return",
            "def f(x=1):\n    return x\nOUT[0] = f()": "既定値",
            "if not COUNT:\n    total = 0\ntotal += 1\nOUT[0] = total": "total を、あとで書き換えています",
            "if not COUNT:\n    a = IN[1]\nOUT[0] = a": "初期化（if not COUNT:）の中で IN を使っています",
            "if not COUNT:\n    a = 1\nelse:\n    a = 2\nOUT[0] = a": "else",
            "f = lambda x: x\nOUT[0] = f": "関数 f を値として使っています",
            "OUT[0] = IN.get(7)": "IN.get(7) の既定値がなく",
            "global g\nOUT[0] = 1": "global",
            "OUT[0] = 1\nOUT[1] = OUT[0]": "OUT[n]（出力）を読んで",
            "OUT[0] = IN[5]": "IN[5] に接続も値もありません",
            "import random\nOUT[0] = random.random()": "import random",
            "OUT[0] = api.MVector()\nOUT[0] = 1.0": "種類の違う値",
            "OUT[0] = api1.MVector() + api.MVector()": "API 1.0（api1）と 2.0（api）を混ぜた",
            "OUT[0] = (": "書き方の誤り",
            "x = 1": "OUT[n] への代入がありません",
            'OUT[0] = "abc"': "文字列",
        }
        for code, expect in cases.items():
            with self.subTest(code=code):
                msg = problem(code)
                self.assertIsNotNone(msg, code)
                self.assertIn(expect, msg)

    def test_first_run_block_and_functions(self):
        code = ("if not COUNT:\n    from math import atan2, pi as _PI\n    K = 1\n    ZERO3 = (0., 0., 0.)\n"
                "    half = lambda x: x * .5\n"
                "    def f(v, s):\n        w = v * s\n        if s > 0:\n            return w\n        return -w\n"
                "a = f(IN.get(K, ZERO3), half(IN[0]))\n"
                "OUT[0] = a\nOUT[1] = 1 if 3 in IN else 0\nOUT[2] = atan2(1, 1) + _PI")
        nd, outs, _ = translate(code, {0: "num", 1: "vec3"})
        self.assertEqual(outs, {0: "vec3", 1: "num", 2: "num"})
        self.assertIn("i1", nd.code)                          # IN.get(K, …) の K は 1
        self.assertIn("o1 = (1 if 0 else 0)", nd.code)        # 3 in IN は 0（IN[3] はない）
        self.assertNotIn("def ", nd.code)                     # 関数は展開する
        self.assertNotIn("lambda", nd.code)
        nd2, _, _ = translate("if COUNT == 0:\n    A = 2\nOUT[0] = IN.get(A, 5.)", {0: "num"})
        self.assertIn("o0 = 5.0", nd2.code)                   # IN[2] がないので既定値

    def test_quaternion_log_exp(self):
        nd, outs, _ = translate("q = api.MQuaternion(IN[0], 0.5, 0.25, 0.).exp()\nOUT[0] = q.log()", {0: "num"})
        self.assertEqual(outs, {0: "vec4"})
        self.assertIn("atan2(", nd.code)
        self.assertIn("exp(", nd.code)

    def test_problem_has_line_number(self):
        self.assertTrue(problem("a = 1\nOUT[0] = cmds.ls()").startswith("2 行目: "))


class SceneTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(SAMPLE, animation=True)

    def test_defined_and_problems(self):
        anim = self.scene["animation"]
        graph = {g["name"]: g for g in anim["graph"] if g["type"] == "exprespy"}
        for name in ("posCnsEx", "oriCnsEx", "aimCnsEx", "aimUpCnsEx", "timeEx", "chainA", "chainB", "quatEx"):
            self.assertRegex(graph[name].get("def", ""), r"^exprespy:[0-9a-f]{12}$", name)
            self.assertIn(graph[name]["def"], anim["nodeDefs"])
        self.assertNotIn("def", graph.get("badCmds", {}))
        warnings = "\n".join(self.scene["warnings"])
        self.assertIn("exprespy 8 個", warnings)
        self.assertIn("exprespy badCmds のコードを解析できません（1 行目: maya.cmds", warnings)
        self.assertIn("exprespy badMesh のコードを解析できません（形状（boxShape.o）", warnings)
        anim_warnings = "\n".join(anim["warnings"])
        self.assertIn("コードを解析できない exprespy（", anim_warnings)

    def test_inputs_are_renamed(self):
        graph = {g["name"]: g for g in self.scene["animation"]["graph"]}
        self.assertEqual(sorted(graph["posCnsEx"]["inputs"]), ["i%d" % k for k in sorted(range(8), key=str)])
        dst = graph["posCnst"]["inputs"]["t"]
        self.assertEqual(dst["attr"], "o0")
        self.assertEqual(graph["timeEx"]["attrs"], {"i1": 3})
        self.assertNotIn("i0", graph["timeEx"].get("inputs", {}))       # time1 は接続ではなく、定義の time

    def test_same_code_shares_definition(self):
        with open(SAMPLE, encoding="utf-8") as f:
            text = f.read()
        text = text.replace('connectAttr "src.rz" "quatEx.i[0]";',
                            'connectAttr "src.rz" "quatEx.i[0]";\nconnectAttr "src.ry" "quatEx2.i[0]";\n'
                            'connectAttr "quatEx2.o[0]" "jX.r";')
        text = text.replace('createNode exprespy -n "quatEx";',
                            'createNode exprespy -n "quatEx2";\n\tsetAttr ".cd" -type "string" '
                            '"q = api.MQuaternion(IN[0], api.MVector(0, 0, 1))\\nOUT[0] = q.asEulerRotation()";\n'
                            'createNode exprespy -n "quatEx";')
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "share.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            scene = load_ma(path, animation=True)
        graph = {g["name"]: g for g in scene["animation"]["graph"]}
        self.assertEqual(graph["quatEx"]["def"], graph["quatEx2"]["def"])
        self.assertNotEqual(graph["quatEx"]["def"], graph["chainB"]["def"])

    def test_downstream_of_bad_exprespy(self):
        with open(SAMPLE, encoding="utf-8") as f:
            text = f.read()
        text = text.replace('connectAttr "badCmds.o[0]" "jX.tx";',
                            'connectAttr "badCmds.o[0]" "chainB2.i[0]";\nconnectAttr "chainB2.o[0]" "jX.tx";')
        text = text.replace('createNode exprespy -n "badCmds";',
                            'createNode exprespy -n "chainB2";\n\tsetAttr ".cd" -type "string" "OUT[0] = IN[0]";\n'
                            'createNode exprespy -n "badCmds";')
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "down.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            scene = load_ma(path, animation=True)
        self.assertIn("exprespy chainB2 のコードを解析できません（接続元の exprespy badCmds のコードを解析できません）",
                      "\n".join(scene["warnings"]))

    def test_bend_roll_sample(self):
        scene = load_ma(os.path.join(ROOT, "samples", "exprespy_bendroll_sample.ma"), animation=True)
        graph = [g for g in scene["animation"]["graph"] if g["type"] == "exprespy"]
        self.assertEqual(len(graph), 9)
        self.assertTrue(all(g.get("def") for g in graph))
        self.assertIn("exprespy 9 個", "\n".join(scene["warnings"]))
        by_name = {g["name"]: g for g in scene["animation"]["graph"]}
        # 自分の独自の属性（method・reverseOrder）を入力にする
        self.assertEqual(by_name["composeRotExpr"]["inputs"]["i11"], {"node": by_name["composeRotExpr"]["id"],
                                                                      "attr": "reverseOrder"})

    def test_json_round_trip(self):
        text = json.dumps(self.scene, ensure_ascii=False)
        back = json.loads(text)
        schema.validate(back)
        self.assertEqual(back["animation"]["nodeDefs"], self.scene["animation"]["nodeDefs"])

    def test_rig_report(self):
        report = rig_report_file(SAMPLE)
        self.assertIn("■ コードを解析して評価する exprespy: posCnsEx", report)
        self.assertIn("  exprespy badCmds: 1 行目: maya.cmds", report)
        self.assertNotIn('"exprespy": {', report)                    # 割り当ての雛形は出さない


if __name__ == "__main__":
    unittest.main()
