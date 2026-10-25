# -*- coding: utf-8 -*-
"""ヒストリのあるカーブ（形を作るノードから形を求める）のテスト。

  python tests/test_curve_history.py
前提: python tools/make_curve_history_sample.py（samples/curve_history_sample.ma を作る）
スプライン IK の評価は web_src/tests/curveHistory.test.mjs で確かめる。
"""
from __future__ import annotations

import math
import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.extract_ma import load_ma  # noqa: E402
from ma_viewer.rig_report import rig_report_file  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "curve_history_sample.ma")


def cvs_of(cc):
    nk = int(cc[5])
    ncv = int(cc[6 + nk])
    start = 7 + nk
    return [cc[start + 3 * k:start + 3 * k + 3] for k in range(ncv)]


class CurveHistoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(SAMPLE, encoding="utf-8") as f:
            cls.text = f.read()
        cls.scene = load_ma(SAMPLE, animation=True)
        cls.curves = {c["name"]: c for c in cls.scene["curves"]}

    def load_variant(self, old, new):
        self.assertIn(old, self.text)
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "variant.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(self.text.replace(old, new))
            return load_ma(path, animation=True), rig_report_file(path)

    def test_circle_matches_maya(self):
        """makeNurbCircle（法線 +Y・半径 2・3 次・8 分割）: Maya の円と同じ CV（半径 1 で 1.108194・0.783612）"""
        cc = self.curves["ringAShape"]["cc"]
        self.assertEqual(cc[:6], [3.0, 8.0, 2.0, 0.0, 3.0, 13.0])
        self.assertEqual(cc[6:19], [float(k) for k in range(-2, 11)])
        cvs = cvs_of(cc)
        self.assertEqual(len(cvs), 11)
        expect = [(0.783612, 0, -0.783612), (0, 0, -1.108194), (-0.783612, 0, -0.783612), (-1.108194, 0, 0),
                  (-0.783612, 0, 0.783612), (0, 0, 1.108194), (0.783612, 0, 0.783612), (1.108194, 0, 0)]
        for got, exp in zip(cvs, expect + expect[:3]):
            for g, e in zip(got, exp):
                self.assertAlmostEqual(g, 2 * e, places=5)

    def test_polygon_circle(self):
        """1 次・6 分割・中心 (0, 0, 3)・法線は既定の +Z → CV は中心から半径 1 の正六角形（XY 平面）"""
        cvs = cvs_of(self.curves["hexBShape"]["cc"])
        self.assertEqual(len(cvs), 7)
        self.assertEqual(cvs[0], cvs[-1])
        for x, y, z in cvs:
            self.assertAlmostEqual(math.hypot(x, y), 1.0, places=5)
            self.assertAlmostEqual(z, 3.0, places=5)

    def test_transform_geometry(self):
        cvs = cvs_of(self.curves["spC_curveShape"]["cc"])
        self.assertEqual([round(p[1], 4) for p in cvs], [0.0, 2.6667, 5.3333, 8.0])
        self.assertTrue(all(abs(p[0] - 20) < 1e-6 for p in cvs))
        # invertTransform: 逆の行列（X に -20）
        scene, _report = self.load_variant('createNode transformGeometry -n "spC_freeze";',
                                           'createNode transformGeometry -n "spC_freeze";\n\tsetAttr ".itf" yes;')
        cvs = cvs_of(next(c for c in scene["curves"] if c["name"] == "spC_curveShape")["cc"])
        self.assertTrue(all(abs(p[0] + 20) < 1e-6 for p in cvs))

    def test_warnings_and_report(self):
        warnings = "\n".join(self.scene["warnings"])
        self.assertIn("ヒストリのあるカーブ 4 本の形を、形を作るノード（circle など）から計算しました", warnings)
        self.assertIn("形を作るノードの型: makeTextCurves 1 本、rebuildCurve 1 本", warnings)
        self.assertIn("rbDShape: 形を作るノード rbD_rebuild（rebuildCurve。カーブの作り直し", warnings)
        self.assertIn("txFShape: 形を作るノード txF_freeze の入力: txF_text（makeTextCurves。文字のカーブ", warnings)
        report = rig_report_file(SAMPLE)
        self.assertIn("✓ 形を計算したカーブ: 4 本", report)
        self.assertIn("★ rebuildCurve で形を作るカーブ: 1 本", report)
        # transformGeometry の入力が makeTextCurves → いちばん奥の makeTextCurves として数え、理由を出す
        self.assertIn("★ makeTextCurves で形を作るカーブ: 1 本", report)
        self.assertIn("txFShape（txF_freeze の入力: txF_text（makeTextCurves。文字のカーブ。形はフォントから作られるため", report)

    def test_world_space_input(self):
        """transformGeometry の入力がカーブのワールド空間の形（.worldSpace）→ そのカーブの transform のワールド行列を掛ける"""
        cvs = cvs_of(self.curves["wsEShape"]["cc"])
        self.assertTrue(all(abs(p[2] - 7) < 1e-6 for p in cvs), cvs)
        self.assertEqual([round(p[1], 4) for p in cvs], [0.0, 2.6667, 5.3333, 8.0])

    def test_spline_ik_with_unknown_curve_shape(self):
        """スプライン IK のカーブの形が分からなければ、IK の問題として理由を出す"""
        _scene, report = self.load_variant('connectAttr "spC_curveShape.ws" "spC_ik.ic";',
                                           'connectAttr "rbDShape.ws" "spC_ik.ic";')
        self.assertIn("スプライン IK のカーブ rbDShape の形が分かりません（形を作るノード rbD_rebuild（rebuildCurve。", report)

    def test_spline_verification_text(self):
        """再現チェックのスプライン IK の詳細の文章: カーブの上にあるか・離れているかで見立てを変える"""
        from ma_viewer.rig_report import _spline_detail
        h = {"chain": ["a", "b", "c"]}
        sp = {"curveLength": 4.0, "chainLength": 4.0, "start": [0, 0, 0], "end": [0, 4, 0], "cvs": 4, "degree": 3,
              "fileToCurve": [0.0, 0.0002, 0.0], "evalToCurve": [0.0, 0.0, 0.0], "rootToStart": 0.0,
              "rootOnCurve": True, "offset": 0.0, "advancedTwist": False,
              "curveFrom": {"name": "crvShape", "attr": "ws", "inputs": ["cr ← skin（skinCluster）"], "hasFileShape": True}}
        text = "\n".join(_spline_detail(h, sp))
        self.assertIn("カーブ: crvShape.ws（CV 4 個・3 次。ファイルの形 あり）・入力 cr ← skin（skinCluster）", text)
        self.assertIn("Maya のジョイントは、こちらのカーブの上にあります", text)
        sp.update(fileToCurve=[0.5, 0.3, 0.1], rootToStart=0.5, curveLength=3.0)
        text = "\n".join(_spline_detail(h, sp))
        self.assertIn("こちらのカーブから最大 0.5000 離れています", text)
        self.assertIn("rootOnCurve なのに、Maya の開始ジョイントがこちらのカーブの始点から 0.5000 離れています", text)
        self.assertIn("カーブがチェーンより短い", text)
        self.assertIn("形を求められません", "\n".join(_spline_detail(h, {"missing": True})))

    def test_unsupported_circle_options(self):
        scene, report = self.load_variant('\tsetAttr ".r" 2;', '\tsetAttr ".r" 2;\n\tsetAttr ".sw" 180;')
        self.assertNotIn("ringAShape", [c["name"] for c in scene["curves"]])
        self.assertIn("sweep 180 度", report)


if __name__ == "__main__":
    unittest.main()
