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
            "s = 0\nfor i in range(int(IN[1])):\n    s += IN[i]\nOUT[0] = s": "IN[…] で選ぶ値の種類がそろっていません",
            "OUT[int(IN[1])] = 1": "接続されている出力がありません",
            "d = {'a': 1}\nOUT[0] = d['b']": "辞書にキー 'b' がありません",
            "n = 'a' + str(IN[1])\nOUT[0] = 1 if n == 'a1' else 0": "文字列の中身が変換の時点で決まりません",
            "try:\n    x = 1 / IN[0]\nexcept ValueError as e:\n    print(e)\n    x = 0\nOUT[0] = x": "の e を使っています",
            "try:\n    for i in range(2):\n        x = 1 / IN[1]\nexcept ZeroDivisionError:\n    x = 0\nOUT[0] = x":
                "try の中の if・for などの中の、例外になりうる計算",
            "l = []\nif IN[1] > 0:\n    l.append(1)\nOUT[0] = len(l)": "長さが実行時に決まる",
            "class A(api.MPxNode):\n    pass\nOUT[0] = 1": "親（api.MPxNode）は変換できません",
            "OUT[0] = sum(IN[1] for i in range(int(IN[1])))": "要素の数が決まる並び",
            'OUT[0] = cmds.getAttr("a.tx")': "maya.cmds",
            "def f(n):\n    return f(n - 1) + f(n - 2)\nOUT[0] = f(IN[1])": "関数の展開が大きすぎます",
            "OUT[0] = 'text'": "文字列は OUT に出せません",
            "def f(x):\n    if x:\n        return 1\nOUT[0] = f(1)": "すべての道で return",
            "def f(*xs):\n    return 1\nOUT[0] = f()": "*args",
            "def f(x, k=1):\n    return x\nOUT[0] = f(k=2)": "引数 x がありません",
            "def f(x):\n    return x\nOUT[0] = f(1, y=2)": "引数 y はありません",
            "x = 1\nOUT[0] = 1 if x is 1 else 0": "None との比較だけ",
            "if not COUNT:\n    total = 0\ntotal += 1\nOUT[0] = total": "total を、あとで書き換えています",
            "if not COUNT:\n    a = IN[1]\nOUT[0] = a": "初期化（if not COUNT:）の中で IN を使っています",
            "if not COUNT:\n    a = 1\nelse:\n    a = 2\nOUT[0] = a": "else",
            "f = lambda x: x\nOUT[0] = f": "関数 f を値として使っています",
            "OUT[0] = IN.get(7)": "出せない値（none）",
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
        self.assertIn("o1 = 0\n", nd.code)                    # 3 in IN は偽（IN[3] はない）
        self.assertNotIn("def ", nd.code)                     # 関数は展開する
        self.assertNotIn("lambda", nd.code)
        nd2, _, _ = translate("if COUNT == 0:\n    A = 2\nOUT[0] = IN.get(A, 5.)", {0: "num"})
        self.assertIn("o0 = 5.0", nd2.code)                   # IN[2] がないので既定値

    def test_default_args_and_none(self):
        code = ("def limit(val, max=None):\n    if val < 0: return 0\n    if max is not None and val > max: return max\n"
                "    return val\nOUT[0] = limit(IN[0])\nOUT[1] = limit(IN[0], max=2)\n"
                "f = lambda x, k=2: x * k\nOUT[2] = f(IN[0]) + f(IN[0], k=3)\n"
                "g = None\nOUT[3] = 1 if g is None and not g else 0")
        nd, outs, _ = translate(code, {0: "num"})
        self.assertEqual(outs, {0: "num", 1: "num", 2: "num", 3: "num"})
        first = nd.code.split("o0 = ")[0]
        self.assertNotIn(">", first)                          # max を省略した呼び出しは上限の判定を消す
        self.assertIn("(_val5 > 2)", nd.code)                 # max を渡した呼び出しは上限を判定する（定数のまま）
        self.assertIn("o3 = 1\n", nd.code + "\n")            # None の判定は変換の時点で決まる

    def test_python_constructs(self):
        """実際のコードで使われそうな Python の書き方（tests/exprespy_constructs.py の一覧）がすべて変換できる"""
        from exprespy_constructs import CASES, KINDS, OUT_CONNECTED
        for name, code, *kinds in CASES:
            with self.subTest(name=name):
                try:
                    translate(code, kinds[0] if kinds else KINDS, out_connected=OUT_CONNECTED)
                except ExprespyError as exc:
                    self.fail("%s: %s" % (name, exc.text()))

    def test_unrolled_loop_and_try(self):
        code = ("s = 0\nfor i in range(3):\n    s += IN[i]\nOUT[0] = s\n"
                "for k, v in IN.items():\n    if k == 1:\n        OUT[1] = v\n"
                "try:\n    x = IN[7]\nexcept KeyError:\n    x = -1\nOUT[2] = x\n"
                "OUT[3] = sum(IN[i] * 2 for i in range(3) if i != 1)\n"
                "a, b = IN[0], IN[1]\na, b = b, a\nOUT[4] = a - b")
        nd, outs, _ = translate(code, {0: "num", 1: "num", 2: "num"})
        self.assertIn("s = (s + i0)\ns = (s + i1)\ns = (s + i2)\no0 = s", nd.code)   # ループを展開する
        self.assertIn("o1 = i1", nd.code)
        self.assertIn("x = -1\no2 = x", nd.code)              # IN[7] はないので except の側
        self.assertIn("o3 = (0 + (i0 * 2) + (i2 * 2))", nd.code)

    def test_dynamic_index_and_flags(self):
        nd, _, notes = translate("s = 0\nfor i in range(int(IN[5])):\n    s += IN[i]\nOUT[0] = s\nOUT[int(IN[5])] = 1.0",
                                 {0: "num", 1: "num", 5: "num"}, out_connected={0, 1})
        self.assertIn("(i0 if _k1 == 0 else (i1 if _k1 == 1 else (i5 if _k1 == 5 else 0)))", nd.code)
        self.assertRegex(nd.code, r"elif _k\d+ == 1:\n    o1 = _v\d+")
        self.assertTrue(any("KeyError" in n for n in notes))  # ない番号は 0 にすることを注意に出す
        nd, _, _ = translate("def f():\n    for i in range(3):\n        if IN[i] > 1:\n            return i\n    return -1\n"
                             "OUT[0] = f()", {0: "num", 1: "num", 2: "num"})
        self.assertIn("if not _brk", nd.code)                  # 展開したループの実行時の return（目印で抜ける）
        self.assertIn("if not _done", nd.code)

    def test_dict_and_strings(self):
        nd, _, _ = translate("d = {'a': IN[0]}\nif IN[0] > 0:\n    d['a'] = 1\nside = 'L'\n"
                             "OUT[0] = d['a'] if side.upper() == 'L' else 0", {0: "num"})
        self.assertIn("if (i0 > 0):\n    _d1 = 1", nd.code)     # 実行時の if の中でも、キーの変数に入れる
        self.assertIn("o0 = _d1", nd.code)

    def test_lists_classes_except_recursion(self):
        nd, _, _ = translate("l = [0, 0]\nif IN[0] > 0:\n    l[1] = IN[0]\nl.append(3)\nOUT[0] = l[1] + len(l)",
                             {0: "num"})
        self.assertIn("if (i0 > 0):\n    _d2 = i0", nd.code)    # 実行時の if の中の要素の書き換え
        self.assertIn("o0 = (_d2 + 3)", nd.code)               # append した長さは変換の時点で決まる
        nd, _, _ = translate("class S:\n    def __init__(self):\n        self.n = 0\n    def add(self, x):\n"
                             "        if x > 0:\n            self.n += x\ns = S()\ns.add(IN[0])\nOUT[0] = s.n",
                             {0: "num"})
        self.assertRegex(nd.code, r"if \(_x\d+ > 0\):\n    (_d\d+) = \(\1 \+ _x\d+\)\no0 = \1")
        nd, _, _ = translate("try:\n    r = IN[0] / IN[1]\nexcept ZeroDivisionError:\n    r = 0\nOUT[0] = r",
                             {0: "num", 1: "num"})
        self.assertIn("if (i1 == 0):\n    _err1 = 1\nelse:\n    r = (i0 / i1)\nif _err1 == 1:\n    r = 0", nd.code)
        nd, _, notes = translate("def fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\nOUT[0] = fact(4)", {})
        self.assertNotIn("1 / 0", nd.code)                     # 定数の再帰は変換の時点で最後まで
        self.assertEqual(notes, [])
        nd, _, notes = translate("def fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\nOUT[0] = fact(IN[0])",
                                 {0: "num"})
        self.assertIn("(1 / 0)", nd.code)                      # 実行時の深さの再帰は 16 段まで
        self.assertTrue(any("16 段" in n for n in notes))

    def test_return_after_statements_in_loop(self):
        # ループの中の return の前の文（r = …）を、return より先に変換する
        nd, _, _ = translate("def f(t):\n    for n in range(3):\n        if t < n:\n            r = t * 2\n"
                             "            return r + n\n    return -1\nOUT[0] = f(IN[0])", {0: "num"})
        self.assertRegex(nd.code, r"_r\d+ = \(_t\d+ \* 2\)\n\s+_ret\d+ = \(_r\d+ \+ _n\d+\)")

    def test_and_or_values(self):
        nd, _, _ = translate("OUT[0] = IN[0] or 1.0\nOUT[1] = IN[0] and 0\nOUT[2] = 0 or IN[0]\n"
                             "OUT[3] = 2 or IN[0]\nOUT[4] = None or IN[0] or 5", {0: "num"})
        self.assertIn("o0 = (i0 or 1.0)", nd.code)           # Python と同じく、i0 が真なら i0
        self.assertIn("o1 = (i0 and 0)", nd.code)
        self.assertIn("o2 = i0", nd.code)
        self.assertIn("o3 = 2", nd.code)
        self.assertIn("o4 = (i0 or 5)", nd.code)

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
        for name in ("posCnsEx", "oriCnsEx", "aimCnsEx", "aimUpCnsEx", "timeEx", "chainA", "chainB", "quatEx",
                     "limitEx", "pyEx", "pyEx2", "pyEx3", "aliasEx", "lookupEx"):
            self.assertRegex(graph[name].get("def", ""), r"^exprespy:[0-9a-f]{12}$", name)
            self.assertIn(graph[name]["def"], anim["nodeDefs"])
        self.assertNotIn("def", graph.get("badCmds", {}))
        warnings = "\n".join(self.scene["warnings"])
        self.assertIn("exprespy 14 個", warnings)
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
