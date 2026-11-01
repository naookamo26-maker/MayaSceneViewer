# -*- coding: utf-8 -*-
"""コンポーネントタグ（Maya 2022 以降。デフォーマが変形する CV をタグで選ぶ）の読み取りの検証。

前提: python tools/make_component_tag_sample.py（samples/component_tag_sample.ma を作る）
"""
import os
import re
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.component_tags import evaluate  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "component_tag_sample.ma")


class ComponentTagTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(SAMPLE, encoding="utf-8") as f:
            cls.text = f.read()

    def masks(self, text):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "variant.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(text)
            scene = load_ma(path, animation=True)
        return {g["name"]: g.get("mask") for g in scene["animation"]["graph"] if g["type"] in ("cluster", "wire")}

    def test_expression(self):
        tags = {"lo": {0, 1}, "mid": {1, 2}, "tipA": {3}, "tipB": {4}}
        self.assertEqual(evaluate("*", tags, 6), {0, 1, 2, 3, 4, 5})
        self.assertEqual(evaluate("lo+mid", tags, 6), {0, 1, 2})
        self.assertEqual(evaluate("lo mid", tags, 6), {0, 1, 2})
        self.assertEqual(evaluate("lo-mid", tags, 6), {0})
        self.assertEqual(evaluate("lo^mid", tags, 6), {1})
        self.assertEqual(evaluate("tip*", tags, 6), {3, 4})
        self.assertEqual(evaluate("*-tip*", tags, 6), {0, 1, 2, 5})
        self.assertEqual(evaluate("none", tags, 6), set())

    def test_masks_from_sample(self):
        m = self.masks(self.text)
        self.assertEqual([m["fin_k%d" % k] for k in range(1, 5)], [{"0": [k]} for k in range(4)])
        self.assertIsNone(m["fin_all"])                  # "*" はすべて（入れない）
        self.assertIsNone(m["fin_wire"])

    def test_tags_from_one_place(self):
        """タグが .gtag[i] だけ・.cc の後ろだけに書かれていても読む"""
        attrs_only = "\n".join(ln for ln in self.text.splitlines()
                               if not ln.startswith('\tsetAttr ".gtag['))
        cc_only = self.text
        for ln in self.text.splitlines():
            if ln.startswith('\tsetAttr ".cc"') and '"gtag"' in ln:
                cc_only = cc_only.replace(ln, ln[:ln.index(' "gtag"')] + ";")
        for name, text in (("cc の後ろだけ", attrs_only), (".gtag[i] だけ", cc_only)):
            with self.subTest(name=name):
                self.assertNotEqual(text, self.text)
                m = self.masks(text)
                self.assertEqual(m["fin_k3"], {"0": [2]})

    def test_empty_expression_is_ignored(self):
        """式が空のものは、タグを使わない書き方として扱う（全部の CV。ウェイトで決まる）"""
        m = self.masks(self.text.replace('".ip[0].gtg" -type "string" "fin_k2";', '".ip[0].gtg" -type "string" "";'))
        self.assertIsNone(m["fin_k2"])
        self.assertEqual(m["fin_k3"], {"0": [2]})

    def test_report_shows_tagged_cvs(self):
        report = rig_report_file(SAMPLE)
        self.assertIn("fin_k4（cluster）", report)
        self.assertIn("コンポーネントタグで動かす CV（入力 0）: 3", report)


def group_parts_variant(text):
    """サンプルからタグを消し、Maya 2021 までの書き方（cluster ごとに groupParts の .ic "cv[n]" と groupId）にする"""
    text = "\n".join(ln for ln in text.splitlines() if ".gtag[" not in ln and ".ip[0].gtg" not in ln)
    text = re.sub(r' "gtag" 4 .*?;', ";", text)
    prev = {1: "fin_drvShapeOrig.ws", 2: "fin_k1.og[0]", 3: "fin_k2.og[0]", 4: "fin_k3.og[0]"}
    add = []
    for n in range(1, 5):
        old = 'connectAttr "%s" "fin_k%d.ip[0].ig";' % (prev[n], n)
        assert old in text
        text = text.replace(old, "")
        add += ['createNode groupId -n "fin_k%dGroupId";' % n,
                'createNode groupParts -n "fin_k%dGroupParts";' % n,
                '\tsetAttr ".ic" -type "componentList" 1 "cv[%d]";' % (n - 1),
                'connectAttr "%s" "fin_k%dGroupParts.ig";' % (prev[n], n),
                'connectAttr "fin_k%dGroupId.id" "fin_k%dGroupParts.gi";' % (n, n),
                'connectAttr "fin_k%dGroupParts.og" "fin_k%d.ip[0].ig";' % (n, n),
                'connectAttr "fin_k%dGroupId.id" "fin_k%d.ip[0].gi";' % (n, n)]
    return text.replace("// End of", "\n".join(add) + "\n// End of")


class GroupPartsTest(unittest.TestCase):
    """タグを使わない古い書き方: groupParts の .inputComponents（cv[n]）と groupId で、cluster が動かす CV を選ぶ"""

    setUpClass = ComponentTagTest.__dict__["setUpClass"]
    masks = ComponentTagTest.masks

    def test_masks_from_group_parts(self):
        text = group_parts_variant(self.text)
        self.assertNotIn(".gtg", text)
        m = self.masks(text)
        self.assertEqual([m["fin_k%d" % k] for k in range(1, 5)], [{"0": [k]} for k in range(4)])
        self.assertIsNone(m["fin_all"])

    def test_all_cvs_or_other_group(self):
        """cv[*]・全部の CV を並べたもの・別の groupId の groupParts は、絞らない（入れない）"""
        text = group_parts_variant(self.text)
        m = self.masks(text.replace('"fin_k2GroupParts";\n\tsetAttr ".ic" -type "componentList" 1 "cv[1]";',
                                    '"fin_k2GroupParts";\n\tsetAttr ".ic" -type "componentList" 1 "cv[*]";')
                           .replace('"fin_k3GroupParts";\n\tsetAttr ".ic" -type "componentList" 1 "cv[2]";',
                                    '"fin_k3GroupParts";\n\tsetAttr ".ic" -type "componentList" 1 "cv[0:3]";')
                           .replace('connectAttr "fin_k4GroupId.id" "fin_k4GroupParts.gi";',
                                    'connectAttr "fin_k1GroupId.id" "fin_k4GroupParts.gi";'))
        self.assertEqual(m["fin_k1"], {"0": [0]})
        self.assertIsNone(m["fin_k2"])
        self.assertIsNone(m["fin_k3"])
        self.assertIsNone(m["fin_k4"])

    def test_report_shows_group_parts(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "variant.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(group_parts_variant(self.text))
            report = rig_report_file(path)
        self.assertIn("groupPartsで動かす CV（入力 0）: 3（fin_k4GroupParts の .inputComponents（1 cv[3]））", report)
        self.assertIn("fin_wire（wire）.og[0]: 評価できる・動かす CV（入力 0）: 全部（groupId（.ip[0].gi）がつながっていない", report)


if __name__ == "__main__":
    unittest.main()
