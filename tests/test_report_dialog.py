# -*- coding: utf-8 -*-
"""リグの診断のウィンドウ（ma_viewer/report_dialog.py）: 文章を項目に分ける・HTML にする（Qt なし）"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.report_dialog import overview_html, parse_sections, search_html, section_html  # noqa: E402
from ma_viewer.rig_report import format_verification, rig_report_file  # noqa: E402


class ReportDialogTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.text = format_verification(None) + "\n\n" + rig_report_file(os.path.join(ROOT, "samples", "rig6_sample.ma"))
        cls.head, cls.sections = parse_sections(cls.text)
        cls.by = {s.name: s for s in cls.sections}

    def test_sections(self):
        self.assertTrue(self.head[0].startswith("リグの診断: ") and self.head[0].endswith("rig6_sample.ma"))
        self.assertTrue(self.head[1].startswith("（✓ 評価できる / ★ 評価できない"), "前書きは再現チェックの項目のあとでも前書き")
        self.assertEqual(self.sections[0].name, "保存時のフレームの再現チェック（IK）")
        self.assertEqual(self.sections[0].problems, 0, "凡例の ★ は数えない")
        self.assertEqual(self.by["プラグイン（requires）"].inline, "myRigPlugin", "見出しの行のコロンのあと")
        ik = self.by["IK ハンドル"]
        self.assertEqual([n for n, _ in ik.entries][:2], ["t2_ik（ikSplineSolver）", "leg_ik（ikRPsolver）"], "ハンドルごとに分ける")
        self.assertGreater(ik.problems, 0)
        self.assertEqual(self.by["評価できないノード"].problems, 2, "問題を並べる項目は並んだ数")
        self.assertEqual(self.by["警告"].entries, [], "長い文の並びは分けない")
        # 本文の行はすべて、どこかの項目か前書きに入る
        joined = "\n".join(self.head + [x for s in self.sections for x in ([s.inline] + s.lines)])
        for line in self.text.splitlines():
            if line.strip() and not line.startswith("■"):
                self.assertIn(line, joined)

    def test_html(self):
        ov = overview_html(self.head, self.sections)
        self.assertIn("概要", ov)
        self.assertIn("IK ハンドル", ov)
        ik = self.by["IK ハンドル"]
        one = section_html(ik, 1)
        self.assertIn("IK ハンドル ／ leg_ik（ikRPsolver）", one)
        self.assertIn('<span class="bad">★</span>', one, "★ を色分けする")
        self.assertNotIn("t2_ik", one, "選んだハンドルの分だけ")
        found = search_html(self.sections, "my_pv_driver")
        self.assertIn("my_pv_driver", found)
        self.assertIn("<h3>IK ハンドル</h3>", found)


if __name__ == "__main__":
    unittest.main()
