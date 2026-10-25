# -*- coding: utf-8 -*-
"""Python のノードプラグインから自作ノードの定義への変換（convert-plugin）のテスト。

  python tests/test_plugin_convert.py
前提: python tools/make_plugin_convert_sample.py（samples/plugin_convert_defs.json を作る）
変換した定義の評価の結果は web_src/tests/pluginConvert.test.mjs で確かめる。
"""
from __future__ import annotations

import contextlib
import io
import json
import os
import sys
import tempfile
import textwrap
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import cli  # noqa: E402
from ma_viewer import node_defs as ND  # noqa: E402
from ma_viewer.plugin_convert import convert_file, convert_source  # noqa: E402

API2 = os.path.join(ROOT, "samples", "plugins", "sampleRigNodes.py")
API1 = os.path.join(ROOT, "samples", "plugins", "sampleRigNodesApi1.py")
SAMPLE_DEFS = os.path.join(ROOT, "samples", "plugin_convert_defs.json")

TEMPLATE = '''
import math
import maya.api.OpenMaya as om

class TestNode(om.MPxNode):
    @staticmethod
    def creator():
        return TestNode()

    @staticmethod
    def initialize():
        nAttr = om.MFnNumericAttribute()
        uAttr = om.MFnUnitAttribute()
        tAttr = om.MFnTypedAttribute()
        TestNode.aIn = nAttr.create("input", "in", om.MFnNumericData.kDouble, 0.0)
        TestNode.aArr = nAttr.create("values", "vs", om.MFnNumericData.kDouble, 0.0)
        nAttr.array = True
        TestNode.aAng = uAttr.create("angle", "ang", om.MFnUnitAttribute.kAngle, 0.5)
        TestNode.aName = tAttr.create("label", "lb", om.MFnData.kString)
        TestNode.aOut = nAttr.create("output", "o", om.MFnNumericData.kDouble, 0.0)
        nAttr.writable = False
        for a in (TestNode.aIn, TestNode.aArr, TestNode.aAng, TestNode.aName, TestNode.aOut):
            TestNode.addAttribute(a)
        TestNode.attributeAffects(TestNode.aIn, TestNode.aOut)

    def compute(self, plug, data):
%s

def initializePlugin(obj):
    plugin = om.MFnPlugin(obj, "me", "2.0")
    plugin.registerNode("testNode", om.MTypeId(1), TestNode.creator, TestNode.initialize)
'''


def convert_compute(body: str):
    src = TEMPLATE % textwrap.indent(textwrap.dedent(body).strip("\n"), " " * 8)
    data, results, problems = convert_source(src, "testPlugin.py")
    assert not problems, problems
    assert len(results) == 1
    return data, results[0]


class SamplePluginTest(unittest.TestCase):
    def test_api2_sample(self):
        data, results, problems = convert_file(API2)
        self.assertEqual(problems, [])
        self.assertEqual(data["plugin"], "sampleRigNodes")
        self.assertEqual(data["pluginVersion"], "1.2")              # MFnPlugin の 3 番目の引数
        ok = {r.type for r in results if r.ok}
        self.assertEqual(ok, {"weightedSumNode", "targetAverage", "angleScale", "aimMatrix2", "stretchArray"})
        self.assertEqual(set(data["nodes"]), ok)
        bad = next(r for r in results if r.type == "statefulNode")
        msgs = [m for _line, m in bad.problems]
        self.assertTrue(any("self.previous" in m for m in msgs), msgs)
        self.assertEqual(len(msgs), 2, msgs)                       # 値を入れられなかった変数の、重ねた誤りは出さない
        self.assertTrue(all(line > 0 for line, _m in bad.problems))

    def test_api1_sample(self):
        data, results, problems = convert_file(API1)
        self.assertEqual(problems, [])
        self.assertEqual(data["pluginVersion"], "0.9")
        self.assertEqual({r.type for r in results if r.ok}, {"legacySum", "vectorLength", "matrixOffset"})
        vl = {a["name"]: a for a in data["nodes"]["vectorLength"]["attributes"]}
        # 子の属性から作った数の compound は、その子を成分とするベクトル
        self.assertEqual(vl["inVector"]["type"], "vector")
        self.assertEqual([c["short"] for c in vl["inVector"]["children"]], ["ivx", "ivy", "ivz"])
        self.assertTrue(vl["length"]["output"] and vl["normal"]["output"])
        # 型つきの行列の属性（MFnTypedAttribute・MFnData.kMatrix）と、MFnMatrixData の読み書き
        mo = data["nodes"]["matrixOffset"]
        self.assertEqual({a["name"]: a["type"] for a in mo["attributes"]},
                         {"inMatrix": "matrix", "offset": "vector", "mode": "enum", "outMatrix": "matrix"})
        self.assertEqual(mo["compute"][-1], "    outMatrix = outObject")

    def test_attributes(self):
        data, _results, _problems = convert_file(API2)
        aim = {a["name"]: a for a in data["nodes"]["aimMatrix2"]["attributes"]}
        self.assertEqual(aim["upVector"]["default"], [0.0, 1.0, 0.0])
        self.assertEqual([c["name"] for c in aim["upVector"]["children"]], ["upVector0", "upVector1", "upVector2"])
        self.assertEqual(aim["outMatrix"]["type"], "matrix")
        ta = {a["name"]: a for a in data["nodes"]["targetAverage"]["attributes"]}
        self.assertTrue(ta["target"]["array"])
        self.assertEqual([c["name"] for c in ta["target"]["children"]], ["targetMatrix", "targetWeight"])
        self.assertEqual([c["short"] for c in ta["outTranslate"]["children"]], ["otX", "otY", "otZ"])
        sa = {a["name"]: a for a in data["nodes"]["stretchArray"]["attributes"]}
        self.assertTrue(sa["outValue"]["array"] and sa["outValue"]["output"])
        ws = data["nodes"]["weightedSumNode"]
        self.assertIn("for _i1 in indices(input):", ws["compute"])

    def test_sample_defs_are_current(self):
        """samples/plugin_convert_defs.json はいまの変換ツールの結果（違えば tools/make_plugin_convert_sample.py で作り直す）"""
        nodes = {}
        for p in (API2, API1):
            nodes.update(convert_file(p)[0]["nodes"])
        with open(SAMPLE_DEFS, encoding="utf-8") as f:
            self.assertEqual(json.load(f)["nodes"], nodes)
        defs = ND.load_definitions([SAMPLE_DEFS])
        self.assertEqual(defs.errors, {})
        self.assertEqual(len(defs.nodes), 8)


class ComputeTest(unittest.TestCase):
    def test_simple(self):
        data, r = convert_compute('''
            if plug != TestNode.aOut:
                return
            x = data.inputValue(TestNode.aIn).asDouble()
            a = data.inputValue(TestNode.aAng).asAngle().asDegrees()
            data.outputValue(TestNode.aOut).setDouble(math.sqrt(abs(x)) + a)
            data.setClean(plug)
        ''')
        self.assertTrue(r.ok, r.problems)
        spec = data["nodes"]["testNode"]
        self.assertEqual(spec["compute"], ["x = input", "a = degrees(angle)",
                                           "output = (sqrt(abs(x)) + a)"])
        attrs = {a["name"]: a for a in spec["attributes"]}
        self.assertAlmostEqual(attrs["angle"]["default"], 28.64788976, places=6)   # ラジアン → 度
        self.assertNotIn("label", attrs)                                           # 文字列の属性は入れない
        self.assertTrue(any("label" in n and "kString" in n for n in r.notes), r.notes)

    def test_local_names_do_not_hide_attributes(self):
        data, r = convert_compute('''
            input = data.inputValue(TestNode.aIn).asDouble()
            length = input * 2
            data.outputValue(TestNode.aOut).setDouble(length)
        ''')
        self.assertTrue(r.ok, r.problems)
        self.assertEqual(data["nodes"]["testNode"]["compute"],
                         ["input_ = input", "length_ = (input_ * 2)", "output = length_"])

    def test_element_loop_with_isdone(self):
        data, r = convert_compute('''
            arr = data.inputArrayValue(TestNode.aArr)
            total = 0.0
            while not arr.isDone():
                total += arr.inputValue().asDouble() * arr.elementLogicalIndex()
                arr.next()
            data.outputValue(TestNode.aOut).setDouble(total / max(len(arr), 1))
        ''')
        self.assertTrue(r.ok, r.problems)
        self.assertEqual(data["nodes"]["testNode"]["compute"], [
            "total = 0.0", "for _i1 in indices(values):", "    total = (total + (values[_i1] * _i1))",
            "output = (total / max(count(values), 1))"])

    def test_vector_and_matrix(self):
        data, r = convert_compute('''
            x = data.inputValue(TestNode.aIn).asDouble()
            v = om.MVector(x, 0.0, 1.0)
            q = om.MEulerRotation(0.0, x, 0.0).asQuaternion()
            m = om.MTransformationMatrix()
            m.setTranslation(v * 2.0, om.MSpace.kTransform)
            m.setRotation(q)
            p = om.MPoint(1.0, 0.0, 0.0) * m.asMatrix()
            data.outputValue(TestNode.aOut).setDouble(p.x + v * om.MVector.kXaxisVector)
        ''')
        self.assertTrue(r.ok, r.problems)
        code = data["nodes"]["testNode"]["compute"]
        self.assertIn("p = xform_point([1.0, 0.0, 0.0], compose((v * 2.0), euler_from_quat(q, 0), "
                      "[1.0, 1.0, 1.0], 0))", code)
        self.assertEqual(code[-1], "output = (p.x + dot(v, [1.0, 0.0, 0.0]))")

    def test_unsupported(self):
        cases = {
            "x = 0\nwhile x < 3:\n    x += 1": "while",
            "import maya.cmds as cmds\ny = cmds.getAttr('a.tx')": "import",
            "s = data.inputValue(TestNode.aName).asString()": "label",
            "try:\n    x = 1\nexcept Exception:\n    x = 2": "try",
            "for i in range(3):\n    return": "return",
            "self.count = 1": "self.count",
            "data.inputValue(TestNode.aIn).setDouble(1.0)": "入力の handle",
            "x = data.inputValue(TestNode.aArr).asDouble()": "要素を選ばずに",
            "x = 'abc'": "文字列",
            "x = self.helper(1.0)": "self.helper()",
        }
        for body, word in cases.items():
            with self.subTest(body=body):
                _data, r = convert_compute(body + "\ndata.outputValue(TestNode.aOut).setDouble(1.0)")
                self.assertFalse(r.ok)
                self.assertTrue(any(word in m for _l, m in r.problems), r.problems)

    def test_early_return(self):
        """if 条件: return は、残りの文を else に入れた if に書き換える"""
        data, r = convert_compute('''
            if plug != TestNode.aOut:
                return
            h = data.inputValue(TestNode.aIn)
            x = h.asDouble()
            if x < 0.0:
                data.outputValue(TestNode.aOut).setDouble(0.0)
                return
            elif x > 10.0:
                return
            data.outputValue(TestNode.aOut).setDouble(x * 2.0)
        ''')
        self.assertTrue(r.ok, r.problems)
        self.assertEqual(data["nodes"]["testNode"]["compute"], [
            "x = input", "if (x < 0.0):", "    output = 0.0", "else:", "    if not (x > 10.0):",
            "        output = (x * 2.0)"])

    def test_plug_and_isnull(self):
        """MPlug（thisMObject・findPlug）で読む値、MObject の isNull（繋がっていない）"""
        data, r = convert_compute('''
            this = self.thisMObject()
            mode = om.MPlug(this, TestNode.aIn).asShort()
            fn = om.MFnDependencyNode(this)
            n = fn.findPlug("values", False).numElements()
            first = fn.findPlug(TestNode.aArr, False).elementByLogicalIndex(0).asDouble()
            linked = om.MPlug(this, TestNode.aIn).isConnected()
            obj = data.inputValue(TestNode.aIn).data()
            if obj.isNull():
                return
            data.outputValue(TestNode.aOut).setDouble(mode + n + first + linked)
        ''')
        # aIn は数の属性なので、data() は使えない（行列の属性だけ）
        self.assertFalse(r.ok)
        self.assertTrue(any("data()" in m for _l, m in r.problems), r.problems)
        src = TEMPLATE.replace('TestNode.aIn = nAttr.create("input", "in", om.MFnNumericData.kDouble, 0.0)',
                               'TestNode.aIn = tAttr.create("input", "in", om.MFnData.kMatrix)')
        body = '''
            this = self.thisMObject()
            fn = om.MFnDependencyNode(this)
            n = fn.findPlug("values", False).numElements()
            first = fn.findPlug(TestNode.aArr, False).elementByLogicalIndex(0).asDouble()
            linked = om.MPlug(this, TestNode.aIn).isConnected()
            obj = data.inputValue(TestNode.aIn).data()
            if obj.isNull():
                return
            m = om.MFnMatrixData(obj).matrix()
            data.outputValue(TestNode.aOut).setDouble(m.getElement(3, 0) + n + first + linked)
        '''
        data, results, _p = convert_source(src % textwrap.indent(textwrap.dedent(body).strip("\n"), " " * 8), "t.py")
        r = results[0]
        self.assertFalse(r.ok)                                   # getElement は未対応 → 一覧に出る
        self.assertEqual(list(r.unknown), [".getElement()"])
        body = body.replace("m.getElement(3, 0)", "1.0")
        data, results, _p = convert_source(src % textwrap.indent(textwrap.dedent(body).strip("\n"), " " * 8), "t.py")
        r = results[0]
        self.assertTrue(r.ok, r.problems)
        self.assertEqual(r.unknown, {})
        self.assertEqual(data["nodes"]["testNode"]["compute"], [
            "n = count(values)", "first = values[0]", "linked = connected(input)", "obj = input",
            "if connected(input):", "    m = obj", "    output = (((1.0 + n) + first) + linked)"])
        self.assertTrue(any("isNull" in n for n in r.notes), r.notes)

    def test_unknown_calls_listed(self):
        """解釈できない関数・メソッドは、実行の流れに関係なくすべて一覧にする"""
        data, r = convert_compute('''
            x = data.inputValue(TestNode.aIn).asDouble()
            y = om.MRampAttribute(self.thisMObject(), TestNode.aIn).getValueAtPosition(x)
            z = helper(x) + math.gamma(x) + self.cache(x)
            data.outputValue(TestNode.aOut).setDouble(x.foo())
        ''')
        self.assertFalse(r.ok)
        self.assertEqual(set(r.unknown), {"MRampAttribute()", ".getValueAtPosition()", "helper()", "math.gamma()",
                                          "self.cache()", ".foo()"})
        from ma_viewer.plugin_convert import report_text
        text = report_text("t.py", data, [r], [])
        self.assertIn("■ 解釈できない関数・メソッドの一覧", text)
        self.assertIn("  .getValueAtPosition(): testNode（", text)

    def test_matrix_from_list(self):
        """MScriptUtil.createMatrixFromList(リスト, 行列) → 行列 = matrix(リスト)"""
        data, r = convert_compute('''
            x = data.inputValue(TestNode.aIn).asDouble()
            values = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, x, 0.0, 0.0, 1.0]
            m = om.MMatrix()
            om.MScriptUtil.createMatrixFromList(values, m)
            p = om.MPoint() * m
            data.outputValue(TestNode.aOut).setDouble(p.x)
        ''')
        self.assertTrue(r.ok, r.problems)
        self.assertEqual(r.unknown, {})
        self.assertIn("m = matrix(values_)", data["nodes"]["testNode"]["compute"])
        _data, r = convert_compute('''
            m = om.MMatrix()
            om.MScriptUtil.createMatrixFromList([1.0, 0.0], m)
        ''')
        self.assertFalse(r.ok)
        self.assertTrue(any("16 個" in msg for _l, msg in r.problems), r.problems)

    def test_missing_output_write_is_noted(self):
        data, r = convert_compute("x = data.inputValue(TestNode.aIn).asDouble()")
        self.assertTrue(r.ok, r.problems)
        self.assertTrue(any("output" in n and "既定値" in n for n in r.notes), r.notes)

    def test_registration_problems(self):
        data, results, problems = convert_source("x = 1\n", "empty.py")
        self.assertEqual(results, [])
        self.assertTrue(problems and "initializePlugin" in problems[0])
        data, results, problems = convert_source("def f(:\n", "broken.py")
        self.assertTrue(problems and "書き方の誤り" in problems[0])


class CliTest(unittest.TestCase):
    def run_cli(self, *argv):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = cli.main(list(argv))
        return code, out.getvalue()

    def test_write_and_exit_code(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "api1.json")
            code, text = self.run_cli("convert-plugin", API1, "-o", path, "--plugin", "myPlugin")
            self.assertEqual(code, 0, text)
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            self.assertEqual(data["plugin"], "myPlugin")
            self.assertEqual(ND.load_definitions([path]).errors, {})
            path2 = os.path.join(tmp, "api2.json")
            code, text = self.run_cli("convert-plugin", API2, "-o", path2)
            self.assertEqual(code, 1)                           # statefulNode を変換できない
            self.assertIn("★ statefulNode", text)
            self.assertIn("変換できたノード: 5 / 6", text)
            with open(path2, encoding="utf-8") as f:
                self.assertNotIn("statefulNode", json.load(f)["nodes"])

    def test_dry_run_shows_compute(self):
        code, text = self.run_cli("convert-plugin", API1)
        self.assertEqual(code, 0)
        self.assertIn("--- legacySum の計算", text)
        self.assertIn("for _i1 in indices(values):", text)

    def test_cp932_console(self):
        """出力が cp932（Windows の日本語の環境でファイル・パイプに出すときなど）でも止まらない"""
        import subprocess
        env = dict(os.environ, PYTHONIOENCODING="cp932")
        sample = os.path.join(ROOT, "samples", "plugin_convert_sample.ma")
        for argv, expect in ((["convert-plugin", API1], 0), (["convert-plugin", API2], 1), (["node-defs"], 0),
                             (["rig", sample], 0)):
            with self.subTest(argv=argv):
                r = subprocess.run([sys.executable, "-m", "ma_viewer"] + argv, cwd=ROOT, env=env,
                                   capture_output=True)
                self.assertEqual(r.returncode, expect, r.stderr.decode("cp932", "replace"))
                self.assertNotIn(b"UnicodeEncodeError", r.stderr)


if __name__ == "__main__":
    unittest.main()
