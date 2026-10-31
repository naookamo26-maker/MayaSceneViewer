# -*- coding: utf-8 -*-
"""操作方法のウィンドウの内容（help_dialog）のテスト（Qt は使わない）"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.help_dialog import SECTIONS, search, section_html, toolbar_svgs, used_icons  # noqa: E402

INDEX = os.path.join(ROOT, "ma_viewer", "web", "index.html")


class TestHelp(unittest.TestCase):
    def test_icons_exist(self):
        """使うツールバーのアイコンは、すべてビューアの index.html にある"""
        svgs = toolbar_svgs(INDEX)
        self.assertEqual([k for k in used_icons() if k not in svgs], [])
        self.assertTrue(svgs["opt-joints"].startswith("<svg"))

    def test_sections(self):
        for i, (name, _lead, rows, _notes) in enumerate(SECTIONS):
            h = section_html(i, icons={"opt-joints": True})
            self.assertIn(name, h)
            self.assertEqual(h.count("<tr>"), len(rows))
        self.assertIn('src="icon:opt-joints"', section_html(3, icons={"opt-joints": True}))
        self.assertNotIn("icon:opt-joints", section_html(3))                 # アイコンがなければ出さない

    def test_search(self):
        names = [sec[0] for sec, _r, _n in search("再生")]
        self.assertIn("アニメーション", names)
        rows = dict((sec[0], r) for sec, r, _n in search("f8"))           # 大文字・小文字を区別しない
        self.assertTrue(any("F8" in ops for ops, _t in rows["選択"]))
        self.assertIn("合う操作はありません", section_html(query="存在しない操作"))
        self.assertIn("<h3", section_html(query="ロック"))


if __name__ == "__main__":
    unittest.main()
