# -*- coding: utf-8 -*-
"""カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）の形の計算（nurbs.py と curve_history.py）

  python tests/test_curve_ops.py   （前提: python tools/make_curve_ops_sample.py）
"""
from __future__ import annotations

import json
import math
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import nurbs  # noqa: E402
from ma_viewer.curve_history import Unsupported  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "curve_ops_sample.json")


def _src():
    cvs = [[0, 0, 0], [1, 2, 0], [2, -1, 1], [3, 3, 0], [4, 0, -1], [5, 2, 0], [6, 0, 0]]
    return nurbs.Curve(3, 0, nurbs.uniform_knots(0, 4, 4, 3, True), cvs)


class NurbsTest(unittest.TestCase):
    def test_insert_split_reverse_keep_shape(self):
        c = _src()
        pts = [nurbs.point_at(c, u / 10) for u in range(41)]
        c2 = nurbs.insert_knot(c, 1.3, 2)
        self.assertLess(max(math.dist(p, nurbs.point_at(c2, u / 10)) for u, p in enumerate(pts)), 1e-12)
        r = nurbs.reverse(c)
        self.assertEqual(r.domain, (0, 4))
        self.assertLess(max(math.dist(p, nurbs.point_at(r, 4 - u / 10)) for u, p in enumerate(pts)), 1e-12)
        s = nurbs.segment(c, 0.7, 2.9)
        self.assertEqual(s.domain, (0.7, 2.9))
        self.assertLess(max(math.dist(nurbs.point_at(c, 0.7 + i * 0.044), nurbs.point_at(s, 0.7 + i * 0.044)) for i in range(51)), 1e-12)

    def test_rebuild(self):
        c = _src()
        same = nurbs.rebuild(c, 4, 3)                  # 同じスパン数・次数なら元の形
        self.assertLess(max(math.dist(nurbs.point_at(c, u / 10), nurbs.point_at(same, u / 10)) for u in range(41)), 1e-9)
        r = nurbs.rebuild(c, 8, 3, keep_range=0)
        self.assertEqual(r.domain, (0.0, 1.0))
        self.assertEqual(len(r.cvs), 11)
        self.assertLess(math.dist(nurbs.point_at(r, 0), [0, 0, 0]), 1e-7, "端の点を保つ")
        self.assertLess(math.dist(nurbs.point_at(r, 1), [6, 0, 0]), 1e-7)
        self.assertLess(max(math.dist(nurbs.point_at(c, u / 10), nurbs.point_at(r, u / 40)) for u in range(41)), 0.05, "形はほぼ同じ")
        r2 = nurbs.rebuild(c, 3, 3, keep_range=2)
        self.assertEqual(r2.domain, (0.0, 3.0))
        k = nurbs.rebuild(c, 1, 1, keep_cvs=True)
        self.assertEqual(k.cvs, c.cvs, "keepControlPoints は CV をそのまま")
        self.assertEqual(k.degree, 3)

    def test_cc_round_trip(self):
        c = nurbs.rebuild(_src(), 6, 3)
        back = nurbs.from_cc(nurbs.to_cc(c))
        self.assertEqual(back.knots, c.knots)
        self.assertEqual(back.cvs, c.cvs)

    def test_nearest(self):
        c = _src()
        u = nurbs.nearest_param(c, [3, 3, 0])
        d = math.dist(nurbs.point_at(c, u), [3, 3, 0])
        self.assertLessEqual(d, min(math.dist(nurbs.point_at(c, t / 400), [3, 3, 0]) for t in range(1601)) + 1e-9)


class SampleTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.load(open(SAMPLE, encoding="utf-8"))
        cls.curves = {c["name"]: nurbs.from_cc(c["cc"]) for c in cls.data["curves"]}

    def test_baked_shapes(self):
        src = self.curves["srcShape"]
        rb = self.curves["rbShape"]
        exp = nurbs.rebuild(src, 8, 3, keep_range=0, multiple_ends=True)
        self.assertEqual(rb.domain, (0.0, 1.0))
        self.assertLess(max(math.dist(nurbs.point_at(rb, u / 20), nurbs.point_at(exp, u / 20)) for u in range(21)), 1e-5)
        rv = self.curves["rvShape"]
        self.assertLess(math.dist(nurbs.point_at(rv, 0), [6, 0, 0]), 1e-5)
        self.assertLess(math.dist(nurbs.point_at(rv, 4), [0, 0, 0]), 1e-5)
        dt0, dt2, sc = self.curves["dt0Shape"], self.curves["dt2Shape"], self.curves["scShape"]
        self.assertEqual(dt0.domain, (0.0, 1.5))
        self.assertEqual(dt2.domain, (2.5, 4.0))
        self.assertEqual(sc.domain, (1.0, 3.0))
        for seg in (dt0, dt2, sc):
            a, b = seg.domain
            for u in (a, (a + b) / 2, b):
                self.assertLess(math.dist(nurbs.point_at(seg, u), nurbs.point_at(src, u)), 1e-5)   # JSON は丸めて書く

    def test_static_baked_and_dynamic_in_rig(self):
        names = {g["name"] for g in self.data["animation"]["graph"]}
        self.assertNotIn("rb_rebuild", names, "動かないヒストリは焼き付ける")
        self.assertIn("dyn_rebuild", names, "入力の形が動くヒストリはリグとして評価する")
        self.assertIn("npc", names)
        self.assertFalse([w for w in self.data["warnings"] if "計算できない" in w or "未対応" in w], self.data["warnings"])

    def test_unsupported_rebuild_type(self):
        from unittest import mock
        from ma_viewer import curve_history

        class N:
            def __init__(self, t, name, inputs=None):
                self.type, self.name, self.inputs = t, name, inputs or {}
        src = N("nurbsCurve", "c")
        node = N("rebuildCurve", "rb", {"ic": (src, "l")})
        attrs = {id(src): {"cc": nurbs.to_cc(_src())}, id(node): {"rt": 4}}
        with mock.patch.object(curve_history, "_attrs", lambda _ms, n: attrs[id(n)]):
            with self.assertRaises(Unsupported) as cm:
                curve_history.output_cc(None, node, "oc")
            self.assertIn("curvature", str(cm.exception))
            attrs[id(node)] = {"rt": 4, "kcp": 1}           # keepControlPoints なら種類によらず計算できる
            self.assertEqual(nurbs.from_cc(curve_history.output_cc(None, node, "oc")).cvs, _src().cvs)


if __name__ == "__main__":
    unittest.main()
