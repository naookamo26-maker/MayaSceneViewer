# -*- coding: utf-8 -*-
"""Maya の正解と比べる道具の確認（Maya なし）。

* tools/maya_export_truth.py: Maya を呼ぶ部分を偽物に差し替え、出力の形式・既定のカメラを除く・時間を戻すことを確かめる。
* tools/maya_node_check.py: maya.cmds を偽物にして読み込めること（項目が登録されること）だけを確かめる。
* python -m ma_viewer verify: ビューアの評価から作った正解とは差 0、ずらすと検出されること（Node.js が要る）。
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import types
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))

import maya_export_truth as T  # noqa: E402


class FakeApi:
    """MayaApi と同じメソッドを持つ偽物: ノード a（x 方向に毎フレーム 1 動く）と子の b、既定のカメラ persp"""

    def __init__(self, unit="cm"):
        self.t = 5.0
        self.times = []
        self.unit = unit

    def info(self):
        return {"fps": 24.0, "start": 1.0, "end": 3.0, "mayaVersion": "2024", "linearUnit": self.unit,
                "currentTime": self.t}

    def transforms(self):
        return ["|a", "|a|b", "|persp"]

    def set_time(self, f):
        self.t = f
        self.times.append(f)

    def sample(self, name):
        m = [1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, self.t, 0, 0, 1.0]
        if name == "|a|b":
            m[13] = 2.0
        return m, name != "|a|b" or self.t != 2.0, True


class ExportTruthTest(unittest.TestCase):
    def test_format(self):
        api = FakeApi()
        logs = []
        data = T.collect(api, log=logs.append)
        self.assertEqual(sorted(data["nodes"]), ["|a", "|a|b"])          # 既定のカメラは除く
        a = data["nodes"]["|a"]
        self.assertEqual(a["frames"], [1.0, 2.0, 3.0])
        self.assertEqual([w[12] for w in a["world"]], [1.0, 2.0, 3.0])
        self.assertEqual(data["nodes"]["|a|b"]["visible"], [True, False, True])
        self.assertEqual(len(a["world"][0]), 16)
        self.assertEqual(api.t, 5.0)                                       # 現在のフレームを戻す
        self.assertEqual((data["fps"], data["start"], data["end"], data["source"]), (24.0, 1.0, 3.0, "maya"))
        self.assertEqual(logs, [])

    def test_range_and_unit_warning(self):
        logs = []
        data = T.collect(FakeApi(unit="m"), start=2, end=3, step=0.5, log=logs.append)
        self.assertEqual(data["nodes"]["|a"]["frames"], [2.0, 2.5, 3.0])
        self.assertTrue(any("cm ではありません" in x for x in logs))

    def test_run_writes_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = os.path.join(tmp, "truth.json")
            T.run(out, api=FakeApi())
            with open(out, encoding="utf-8") as f:
                self.assertEqual(len(json.load(f)["nodes"]["|a"]["world"]), 3)


class NodeCheckImportTest(unittest.TestCase):
    def test_import_with_fake_maya(self):
        maya = types.ModuleType("maya")
        maya.cmds = types.ModuleType("maya.cmds")
        saved = {k: sys.modules.get(k) for k in ("maya", "maya.cmds", "maya_node_check")}
        sys.modules["maya"] = maya
        sys.modules["maya.cmds"] = maya.cmds
        sys.modules.pop("maya_node_check", None)
        try:
            import maya_node_check as M
            names = [c[0] for c in M.CHECKS]
            for n in ("set_range", "vector_product", "bool_fraction", "enum_fraction", "divide_by_zero", "curve_tan",
                      "constraint_interp", "pair_blend_ro", "reference_edit_names", "unit_format"):
                self.assertIn(n, names)
            self.assertIn("未実行", M.__doc__)
        finally:
            for k, v in saved.items():
                if v is None:
                    sys.modules.pop(k, None)
                else:
                    sys.modules[k] = v


NODE = shutil.which("node")
HAS_WEB = os.path.isdir(os.path.join(ROOT, "web_src", "node_modules"))


@unittest.skipUnless(NODE and HAS_WEB, "Node.js と web_src の npm ci が要る")
class VerifyCliTest(unittest.TestCase):
    def test_verify_zero_and_detect(self):
        scene = os.path.join(ROOT, "samples", "rig_sample.ma")
        with tempfile.TemporaryDirectory() as tmp:
            sj = os.path.join(tmp, "scene.json")
            truth = os.path.join(tmp, "truth.json")
            from ma_viewer.extract_ma import load_ma
            with open(sj, "w", encoding="utf-8") as f:
                json.dump(load_ma(scene, animation=True), f)
            subprocess.run([NODE, "tools/verify.mjs", sj, "--make-truth", truth], check=True,
                           cwd=os.path.join(ROOT, "web_src"), stdout=subprocess.DEVNULL)

            def verify(*extra):
                return subprocess.run([sys.executable, "-m", "ma_viewer", "verify", scene, truth, *extra], cwd=ROOT,
                                      capture_output=True, text=True, encoding="utf-8")
            r = verify()
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            self.assertIn("を超えたノード: 0", r.stdout)
            with open(truth, encoding="utf-8") as f:
                data = json.load(f)
            data["nodes"]["|head"]["world"][5][12] += 0.5
            with open(truth, "w", encoding="utf-8") as f:
                json.dump(data, f)
            report = os.path.join(tmp, "report.json")
            r = verify("--report", report)
            self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
            self.assertIn("を超えたノード: 1", r.stdout)
            with open(report, encoding="utf-8") as f:
                rows = json.load(f)["rows"]
            self.assertEqual(rows[0]["path"], "|head")
            self.assertAlmostEqual(rows[0]["pos"], 0.5, places=6)


if __name__ == "__main__":
    unittest.main()
