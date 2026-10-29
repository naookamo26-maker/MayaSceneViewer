# -*- coding: utf-8 -*-
"""tools/compare_anim_curves.py（Maya の評価結果とビューアの比較）の動作確認。

Maya がないので、ビューア自身の評価を「Maya の値」とした参照を作り、全カーブが一致すること、
1 本の値をずらすとそのカーブだけ一致しないと報告すること、接線の種類の番号の対応表を出すことを確かめる。
JS の評価に Node.js と web_src/node_modules（three）が要るので、なければ飛ばす。
"""
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))

SAMPLE = os.path.join(ROOT, "samples", "anim_sample.ma")
HAS_NODE = shutil.which("node") is not None and os.path.isdir(os.path.join(ROOT, "web_src", "node_modules", "three"))
INFINITY_NAMES = {0: "constant", 1: "linear", 3: "cycle", 4: "cycleRelative", 5: "oscillate"}


@unittest.skipUnless(HAS_NODE, "Node.js と web_src/node_modules が必要")
class CompareAnimCurvesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import compare_anim_curves as C
        from ma_viewer.ma_scene import parse_ma_file
        cls.C = C
        ms = parse_ma_file(SAMPLE, load_references=False)
        names = [n.name for n in ms.nodes if n.type in C.CURVE_TYPES]
        anim, found, codes = C.build(ms, names)
        samples = [[t * 0.5 for t in range(-20, 80)] for _ in found]
        js = C.evaluate_in_js(anim, samples)
        code_name = {v: k for k, v in C.VIEWER_CODES.items()}
        curves = []
        for i, (name, meta) in enumerate(zip(found, anim["curves"])):
            kit, kot, tan, _stored = codes[name]
            n = meta["count"]
            node = next(x for x in ms.nodes if x.name == name)
            cv = C.parse_curve(ms.text, node)
            curves.append({
                "name": name, "type": node.type, "weighted": meta["weighted"],
                "pre": INFINITY_NAMES[meta["pre"]], "post": INFINITY_NAMES[meta["post"]],
                "keys": {"time": list(cv.times), "value": list(cv.values),
                         "inType": [code_name.get(k or tan, "auto") for k in kit],
                         "outType": [code_name.get(k or tan, "auto") for k in kot],
                         "inAngle": [0.0] * n, "outAngle": [0.0] * n, "inWeight": [1.0] * n, "outWeight": [1.0] * n},
                "samples": samples[i], "values": js["values"][i],
            })
        cls.ref = {"maya": "test", "units": {"time": "film", "linear": "cm", "angle": "deg"}, "curves": curves, "rotations": []}

    def run_compare(self, ref):
        tmp = tempfile.mkdtemp()
        try:
            path, report = os.path.join(tmp, "ref.json"), os.path.join(tmp, "report.md")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(ref, f)
            code = self.C.main([SAMPLE, path, "--report", report])
            with open(report, encoding="utf-8") as f:
                return code, f.read()
        finally:
            shutil.rmtree(tmp)

    def test_all_match(self):
        code, text = self.run_compare(self.ref)
        self.assertEqual(code, 0, text)
        self.assertNotIn("★", text)
        self.assertIn("| auto | 既定 18 | 18 | ✓ |", text)          # キーに種類がなく、カーブの既定（.tan）を使う
        self.assertIn("| linear | 2 | 2 | ✓ |", text)
        self.assertIn("| fixed | 重み付き | 4 / 4 |", text)               # 重み付きの固定の接線は .ma に値がある

    def test_detects_difference(self):
        ref = json.loads(json.dumps(self.ref))
        bad = ref["curves"][0]
        bad["values"] = [v + 0.5 for v in bad["values"]]
        code, text = self.run_compare(ref)
        self.assertEqual(code, 1)
        self.assertIn("## 一致しないカーブの詳細", text)
        self.assertIn("### %s（" % bad["name"], text)
        self.assertEqual(text.count("### "), 1, text)


if __name__ == "__main__":
    unittest.main()
