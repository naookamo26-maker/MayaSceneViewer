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
        self.assertIn("ヒストリのあるカーブ 3 本の形を、形を作るノード（circle など）から計算しました", warnings)
        self.assertIn("形を作るノードの型: makeTextCurves 1 本、rebuildCurve 1 本", warnings)
        self.assertIn("rbDShape: 形を作るノード rbD_rebuild（rebuildCurve。カーブの作り直し", warnings)
        self.assertIn("txFShape: 形を作るノード txF_freeze の入力: txF_text（makeTextCurves。文字のカーブ", warnings)
        report = rig_report_file(SAMPLE)
        self.assertIn("✓ 形を計算したカーブ: 3 本", report)
        self.assertIn("★ rebuildCurve で形を作るカーブ: 1 本", report)
        # transformGeometry の入力が makeTextCurves → いちばん奥の makeTextCurves として数え、理由を出す
        self.assertIn("★ makeTextCurves で形を作るカーブ: 1 本", report)
        self.assertIn("txFShape（txF_freeze の入力: txF_text（makeTextCurves。文字のカーブ。形はフォントから作られるため", report)

    def test_world_space_input(self):
        """transformGeometry の入力がカーブのワールド空間の形（.worldSpace）→ そのカーブの transform のワールド行列を掛ける。
        ワールド空間の形は動きうるので焼き付けず、表示の形（読み込んだときの値）だけを求め、リグとして評価する"""
        self.assertTrue(self.curves["wsEShape"].get("fromInput"))
        graph = {g["name"]: g for g in self.scene["animation"]["graph"]}
        self.assertEqual(graph["wsE_freeze"]["type"], "transformGeometry")
        cvs = cvs_of(self.curves["wsEShape"]["cc"])
        self.assertTrue(all(abs(p[2] - 7) < 1e-6 for p in cvs), cvs)
        self.assertEqual([round(p[1], 4) for p in cvs], [0.0, 2.6667, 5.3333, 8.0])

    def test_rig_transform_geometry_is_not_baked(self):
        """行列が接続された transformGeometry は焼き付けず、接続を残してリグとして評価する（コントローラーに付いてくる）"""
        graph = {g["name"]: g for g in self.scene["animation"]["graph"]}
        self.assertIn("rgTG", graph)
        self.assertEqual(sorted(graph["rgTG"]["inputs"]), ["ig", "txf"])
        self.assertIn("cr", graph["rgCrvShape"]["inputs"])
        self.assertTrue(self.curves["rgCrvShape"].get("fromInput"))
        # 表示の形（読み込んだときの値。txf は接続なので単位行列）
        self.assertEqual(len(cvs_of(self.curves["rgCrvShape"]["cc"])), 4)

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
        sp["chain"] = [
            {"name": "crvShape", "type": "nurbsCurve", "attr": "ws", "out": {"cvs": 4, "start": [0, 0, 0], "end": [0, 4, 0]},
             "fileShape": False, "cp": 0, "shown": False},
            {"name": "wire1", "type": "wire", "attr": "og[0]", "out": {"cvs": 4, "start": [0, 0, 0], "end": [0, 4, 0]},
             "envelope": 1.0, "tagged": 3, "deformed": 0.0,
             "wires": [{"index": 0, "wire": "drvShape", "base": "baseShape", "sameCount": True,
                                         "moved": 0.0, "dropoff": 1.0, "dropoffInFile": False,
                                         "reach": {"cvs": 4, "inside": 1, "nearest": 0.5, "farthest": 3.0},
                                         "driver": [
                                             {"name": "drvShape", "type": "nurbsCurve", "attr": "ws", "out": None,
                                              "fileShape": False, "cp": 0},
                                             {"name": "cl1", "type": "cluster", "attr": "og[0]", "out": None,
                                              "handle": "cl1Handle.wm", "handlePos": [1, 2, 3], "pm": "なし（単位行列）",
                                              "tagged": [2], "movedCvs": [[2, 1.5]]}],
                                         "wireShape": {"cvs": 4, "start": [0, 0, 0], "end": [0, 4, 0]},
                                         "baseShape": {"cvs": 4, "start": [0, 0, 0], "end": [0, 4, 0]}}]},
            {"name": "drv2", "type": "wire", "attr": "og[0]", "out": None, "envelope": 1.0,
             "wires": [{"index": 0, "wire": "a", "base": "b", "sameCount": False, "moved": None, "dropoff": 1.0,
                        "dropoffInFile": True, "wireShape": None, "baseShape": None,
                        "wireInfo": {"inGraph": True, "type": "nurbsCurve", "fileShape": False, "parsed": False,
                                     "create": True},
                        "baseInfo": {"inGraph": True, "type": "nurbsCurve", "fileShape": True, "parsed": False,
                                     "create": False}}]}]
        text = "\n".join(_spline_detail(h, sp))
        self.assertIn("crvShape（nurbsCurve）.ws: (0.000, 0.000, 0.000) → (0.000, 4.000, 0.000)（CV 4 個）・ファイルの形 なし", text)
        self.assertIn("ワイヤー dw[0] drvShape: (0.000, 0.000, 0.000) → (0.000, 4.000, 0.000) ／ ベース bw[0] baseShape", text)
        self.assertIn("影響範囲 dropoff 1.000（ファイルに値がないので既定値）", text)
        self.assertIn("★ ワイヤーがベースから動いていない", text)
        self.assertIn("画面のカーブ: 描かない", text)
        self.assertIn("コンポーネントタグで動かす CV 3 個・変形するカーブの CV の最大の移動 0.000", text)
        self.assertIn("一番近い 0.500・一番遠い 3.000（影響範囲の中の CV 1 / 4 個）", text)
        self.assertIn("★ 影響範囲 dropoff（1.000）より遠い CV は", text)
        self.assertIn("ワイヤー dw[0] の上流:", text)
        self.assertIn("            cl1（cluster）.og[0]: 出力のカーブを求められない・ハンドル cl1Handle.wm の位置 (1.000, 2.000, 3.000)"
                      "・bindPreMatrix: なし（単位行列）・タグで動かす CV: 2・動いた CV: 2（1.500）", text)
        self.assertIn("★ ワイヤーとベースの CV の数が違う", text)
        self.assertIn("drv2（wire）.og[0]: 出力のカーブを求められない", text)
        self.assertIn("★ ワイヤーのカーブの形を求められない理由: 形はファイルになく、作成の入力（create）を評価できない", text)
        self.assertIn("★ ベースのカーブの形を求められない理由: ファイルの形（.cc）はあるが、ビューアが読めない", text)
        del sp["chain"]
        sp.update(fileToCurve=[0.5, 0.5, 0.5], rootOnCurve=False, curveLength=4.0)
        text = "\n".join(_spline_detail(h, sp))
        self.assertIn("カーブの形をなぞったまま、どれもカーブから 0.5000 離れています（rootOnCurve オフ", text)

    def test_curve_tree_in_ik_section(self):
        """リグの診断の IK ハンドル: スプライン IK のカーブの形の上流（wire のワイヤーとベース・変形・元のカーブ）"""
        report = rig_report_file(os.path.join(ROOT, "samples", "rig6_sample.ma"))
        self.assertIn("  カーブの形の上流（★ は形が分からない・評価できないもの）:", report)
        self.assertIn("・ t2_curveShape（nurbsCurve）.ws: 形はファイルになく、入力（create）から作る", report)
        self.assertIn("← ワイヤー dw[0]:", report)
        self.assertIn("✓ t2_wireBaseWireShape（nurbsCurve）.ws: 形 あり（ファイル）", report)
        # 計算できない形を作るノード
        _scene, report = self.load_variant('connectAttr "spC_curveShape.ws" "spC_ik.ic";',
                                           'connectAttr "rbDShape.ws" "spC_ik.ic";')
        self.assertIn("★ rbD_rebuild（rebuildCurve）.oc: ビューアでは評価できない", report)

    def test_named_setattr_outside_block(self):
        """カーブの形が、ノードのブロックの外にノード名つきで書かれている（setAttr "spC_curveShapeOrig.cc" …）・長い名前 .cached"""
        line = [ln for ln in self.text.splitlines() if ln.startswith('\tsetAttr ".cc"') and "8 0;" in ln][0]
        for name in ("cc", "cached"):
            with self.subTest(name=name):
                moved = self.text.replace('\tsetAttr ".io" yes;\n' + line + "\n", '\tsetAttr ".io" yes;\n', 1)
                self.assertNotEqual(moved, self.text)
                moved = moved.replace("// End of curve_history_sample.ma",
                                      line.replace('\tsetAttr ".cc"', 'setAttr "spC_curveShapeOrig.%s"' % name)
                                      + "\n// End of curve_history_sample.ma")
                with tempfile.TemporaryDirectory() as tmp:
                    path = os.path.join(tmp, "named.ma")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(moved)
                    scene = load_ma(path, animation=True)
                curves = {c["name"]: c for c in scene["curves"]}
                self.assertIn("spC_curveShape", curves)
                cvs = cvs_of(curves["spC_curveShape"]["cc"])
                self.assertTrue(all(abs(p[0] - 20) < 1e-6 for p in cvs), cvs)

    def test_component_tags_after_cvs(self):
        """Maya 2022 以降の書き方: .cc の CV の後ろにコンポーネントタグ（"gtag" …）が続いても形を読む"""
        line = [ln for ln in self.text.splitlines() if ln.startswith('\tsetAttr ".cc"') and "8 0;" in ln][0]
        tags = ('\tsetAttr ".gtag[0].gtagnm" -type "string" "clusterQ";\n'
                '\tsetAttr ".gtag[0].gtagcmp" -type "componentList" 1 "cv[0:1]";\n')
        tagged = tags + line[:-1] + ' "gtag" 2 "clusterQ" 1 "cv[0:1]" "clusterR" 1 "cv[2:3]";'
        scene, _report = self.load_variant(line, tagged)
        curves = {c["name"]: c for c in scene["curves"]}
        self.assertIn("spC_curveShape", curves)
        cvs = cvs_of(curves["spC_curveShape"]["cc"])
        self.assertEqual(len(cvs), 4)
        self.assertTrue(all(abs(p[0] - 20) < 1e-6 for p in cvs[:1]), cvs)

    def test_unsupported_circle_options(self):
        scene, report = self.load_variant('\tsetAttr ".r" 2;', '\tsetAttr ".r" 2;\n\tsetAttr ".sw" 180;')
        self.assertNotIn("ringAShape", [c["name"] for c in scene["curves"]])
        self.assertIn("sweep 180 度", report)


if __name__ == "__main__":
    unittest.main()
