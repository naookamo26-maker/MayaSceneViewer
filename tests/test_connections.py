# -*- coding: utf-8 -*-
"""接続の索引（MaScene.outgoing）と、リストを作り直さない disconnectAttr（docs/maintenance_plan.md の P3・P5）。"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.ma_scene import parse_ma_text  # noqa: E402
from ma_viewer.rig import wire_shapes  # noqa: E402

HEAD = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


def names(ms):
    return [(s.name, sa, d.name, da) for s, sa, d, da in ms.connections]


class DisconnectTest(unittest.TestCase):
    def test_disconnect_keeps_order(self):
        """disconnect のあとの接続の並びは、前のやり方（リストの作り直し）と同じ。つなぎ直し・同じ接続の 2 回目も"""
        text = HEAD + "".join('createNode transform -n "n%d";\n' % i for i in range(5)) + (
            'connectAttr "n0.tx" "n1.tx";\n'
            'connectAttr "n0.ty" "n2.ty";\n'
            'connectAttr "n1.tx" "n3.tx";\n'
            'disconnectAttr "n0.ty" "n2.ty";\n'
            'connectAttr "n2.tz" "n4.tz";\n'
            'disconnectAttr "n0.tx" "n1.tx";\n'
            'connectAttr "n0.tx" "n1.tx";\n'
            'disconnectAttr "n9.tx" "n1.tx";\n'           # ないノード
            'disconnectAttr "n1.tx" "n3.ty";\n')          # ない接続
        ms = parse_ma_text(text)
        self.assertEqual(names(ms), [("n1", "tx", "n3", "tx"), ("n2", "tz", "n4", "tz"), ("n0", "tx", "n1", "tx")])
        self.assertNotIn(None, ms.connections)
        self.assertNotIn("ty", ms.resolve("n2").inputs)
        self.assertEqual(ms.resolve("n1").inputs["tx"][0].name, "n0")

    def test_outgoing_index_follows_changes(self):
        """索引は接続のリストが変わったら（作り直し・追加）作り直す"""
        text = HEAD + 'createNode transform -n "a";\ncreateNode transform -n "b";\ncreateNode transform -n "c";\n' \
            'connectAttr "a.tx" "b.tx";\nconnectAttr "a.ty" "c.ty";\n'
        ms = parse_ma_text(text)
        a, b, c = (ms.resolve(x) for x in "abc")
        self.assertEqual([(sa, d.name) for sa, d, _ in ms.outgoing()[id(a)]], [("tx", "b"), ("ty", "c")])
        ms.connections.append((b, "tz", c, "tz"))                       # 追加（hik.py など）
        self.assertEqual([d.name for _sa, d, _ in ms.outgoing()[id(b)]], ["c"])
        ms.connections = [x for x in ms.connections if x[0] is not a]  # 作り直し（curve_history.py など）
        self.assertNotIn(id(a), ms.outgoing())


class CountingList(list):
    """全体を走査した回数を数えるリスト"""
    scans = 0

    def __iter__(self):
        CountingList.scans += 1
        return super().__iter__()


class WireShapesIndexTest(unittest.TestCase):
    def test_many_clusters_scan_once(self):
        """cluster ごとに全接続を走査しない（付録 D）。索引を作るときの 1 回だけ"""
        L, C = [HEAD], []
        for k in range(50):
            p = "k%d_" % k
            L.append('createNode transform -n "%scrv";\ncreateNode nurbsCurve -n "%sshape" -p "%scrv";\n'
                     'createNode cluster -n "%scl";\ncreateNode tweak -n "%stw";\n' % (p, p, p, p, p))
            C.append('connectAttr "%scl.og[0]" "%stw.ip[0].ig";\nconnectAttr "%stw.og[0]" "%sshape.cr";\n'
                     % (p, p, p, p))
        for i in range(1000):
            L.append('createNode transform -n "x%d";\n' % i)
            if i:
                C.append('connectAttr "x%d.v" "x%d.v";\n' % (i - 1, i))
        ms = parse_ma_text("".join(L + C))
        ms.connections = CountingList(ms.connections)
        CountingList.scans = 0
        clusters = [n for n in ms.nodes if n.type == "cluster"]
        for cl in clusters:
            got = wire_shapes(ms, cl)
            self.assertEqual(list(got), [0])
            self.assertEqual(got[0].name, cl.name.replace("_cl", "_shape"))
        self.assertEqual(CountingList.scans, 1)


if __name__ == "__main__":
    unittest.main()


class StatementSplitTest(unittest.TestCase):
    """setAttr の読み直し（rig.parse_attrs）の文の切り出しは 1 段階目と同じ（R.iter_commands。文字列の中の ; で切らない。
    D6）。以前の正規表現（; までを 1 文）でも、この例は parse_setattr が引用符のないプラグを読まないため同じ結果になる"""

    def test_semicolon_in_string(self):
        from ma_viewer.rig import parse_attrs
        # 文字列の中の「setAttr .amt 99」は文ではない（本物の値 0.25 のまま）
        text = HEAD + ('createNode transform -n "ctrl";\n'
                       '\taddAttr -ci true -sn "amt" -ln "amt" -dv 1 -at "double";\n'
                       '\taddAttr -ci true -sn "note" -ln "note" -dt "string";\n'
                       '\tsetAttr -k on ".amt" 0.25;\n'
                       '\tsetAttr ".note" -type "string" "a; setAttr .amt 99; b";\n'
                       'createNode transform -n "other";\n')
        ms = parse_ma_text(text)
        attrs = parse_attrs(ms.text, ms.resolve("ctrl"))
        self.assertEqual(attrs["amt"], 0.25)
        self.assertNotIn("note", attrs)                     # 文字列の値は読まない
