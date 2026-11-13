# -*- coding: utf-8 -*-
"""Maya 内の収集の計測と速い経路（docs/maintenance_plan.md の P4）を、偽の Maya で確かめる（Maya なし）。

* 計測: CollectTiming と、ログに出す行（timing_lines）。
* 速い経路: 同じデータを入れた偽の Maya のオブジェクトで、今の経路と同じ結果になるか。取れないとき・数が合わないときは
  今の経路に戻るか（None）。本物の Maya での一致と速さは tools/maya_collect_compare.py で確かめる（未実行）。
* tools/maya_collect_compare.diff_scenes: 違いを見つけるか。
"""
from __future__ import annotations

import os
import sys
import types
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))

import numpy as np  # noqa: E402

from ma_viewer import maya_scene as M  # noqa: E402


class FakePoint:
    """MPoint の代わり: .x・.y・.z と、(x, y, z, w) の並び"""

    def __init__(self, x, y, z):
        self.x, self.y, self.z = x, y, z
        self._v = (x, y, z, 1.0)

    def __len__(self):
        return 4

    def __getitem__(self, i):
        return self._v[i]


class FakePlug:
    """weightList[v].weights[k] の要素（論理番号と値）を持つ配列のプラグ"""

    def __init__(self, items, value=None):
        self.items = items                 # [(論理番号, 子の FakePlug)]
        self.value = value

    def numElements(self):
        return len(self.items)

    def elementByPhysicalIndex(self, i):
        logical, child = self.items[i]
        child.logical = logical
        return child

    def logicalIndex(self):
        return self.logical

    def child(self, _attr):
        return self.weights

    def asDouble(self):
        return self.value


def slow_skin_fn(stored):
    """今の経路（_skin_weights）が読む skinCluster: stored = {頂点: {論理番号: 値}}（保存されている要素だけ）"""
    rows = []
    for v in sorted(stored):
        row = FakePlug([])
        row.weights = FakePlug([(lo, FakePlug([], val)) for lo, val in sorted(stored[v].items())])
        rows.append((v, row))
    wl = FakePlug(rows)
    return types.SimpleNamespace(findPlug=lambda name, _w: wl, attribute=lambda name: name)


class TimingTest(unittest.TestCase):
    def test_lines(self):
        tm = M.CollectTiming(fast=True)
        tm.add("setAttr の文", 0.5, "transform")
        tm.add("setAttr の文", 0.25, "mesh")
        tm.add("setAttr の文", 0.25, "transform")
        tm.add("メッシュの形", 1.5)
        tm.count("速い経路を使えなかった辺")
        r = tm.result()
        self.assertTrue(r["fast"])
        self.assertEqual(r["parts"]["setAttr の文"], [1.0, 3])
        self.assertEqual(r["types"]["transform"], [0.75, 2])
        lines = M.timing_lines(r)
        self.assertIn("Maya からの収集の内訳: 合計", lines[0])
        self.assertIn("速い経路", lines[0])
        self.assertIn("setAttr の文 1.00 秒（3）", lines[0])
        self.assertIn("メッシュの形 1.50 秒（1）", lines[0])
        self.assertIn("速い経路を使えなかった辺 1 回", lines[0])
        self.assertTrue(lines[1].startswith("setAttr の文の型ごと（上位 2）: transform 0.75 秒（2 個）"))
        self.assertEqual(M.timing_lines(None), [])


class FastPathTest(unittest.TestCase):
    def test_points(self):
        pts = [FakePoint(1.0, 2.0, 3.0), FakePoint(-4.5, 0.0, 1e-9)]
        self.assertTrue(np.array_equal(M._points_fast(pts), np.asarray(M._points_slow(pts), dtype=np.float64)))
        self.assertEqual(M._points_fast([]).shape, (0, 3))

    def test_edges(self):
        ed = [(0, 1, 0), (1, 2, 1), (2, 0, 1)]
        fn = types.SimpleNamespace(getEdgeVertices=lambda e: ed[e][:2], isEdgeSmooth=lambda e: bool(ed[e][2]))
        saved = M.cmds
        try:
            M.cmds = types.SimpleNamespace(getAttr=lambda plug: [tuple(float(x) for x in r) for r in ed])
            fast = M._edges_fast("|m|mShape", 3)
            slow = M._edges_slow(fn, 3)
            self.assertTrue(np.array_equal(fast[0], slow[0]) and np.array_equal(fast[1], slow[1]))
            self.assertIsNone(M._edges_fast("|m|mShape", 4))            # 数が合わない → 今の経路
            M.cmds = types.SimpleNamespace(getAttr=lambda plug: (_ for _ in ()).throw(RuntimeError("no")))
            self.assertIsNone(M._edges_fast("|m|mShape", 3))            # 読めない → 今の経路
            self.assertEqual(M._edges_fast("|m|mShape", 0)[0].shape, (0, 2))
        finally:
            M.cmds = saved

    def test_weights_from_dense_matches_slow(self):
        # インフルエンスの論理番号は飛び飛びで、並びも昇順でない（influenceObjects の順）
        logical = np.array([5, 0, 2])
        dense = np.array([[0.0, 0.25, 0.75],      # 頂点 0: 論理番号 0 → 0.25、2 → 0.75
                          [1.0, 0.0, 0.0],        # 頂点 1: 5 → 1.0
                          [0.0, 0.0, 0.0],        # 頂点 2: なし
                          [0.5, 0.5, 0.0]])
        stored = {0: {0: 0.25, 2: 0.75}, 1: {5: 1.0}, 3: {5: 0.5, 0: 0.5}}
        fast = M.weights_from_dense(dense, logical)
        slow = M._skin_weights(slow_skin_fn(stored))
        for a, b in zip(fast, slow):
            self.assertTrue(np.array_equal(a, b), (fast, slow))

    def test_skin_weights_fast_api(self):
        """MFnSkinCluster.getWeights を使う流れ（偽の OpenMayaAnim）。メッシュでない・複数の形なら None"""
        dense = [0.0, 1.0, 0.3, 0.7]                           # 頂点 2 つ × インフルエンス 2 つ
        infl = ["jA", "jB"]

        class Path:
            def __init__(self, mesh=True):
                self.mesh = mesh

            def hasFn(self, _t):
                return self.mesh

        class Skin:
            outputs = 1
            mesh = True

            def __init__(self, _obj):
                pass

            def numOutputConnections(self):
                return Skin.outputs

            def indexForOutputConnection(self, i):
                return i

            def getPathAtIndex(self, _i):
                return Path(Skin.mesh)

            def getWeights(self, _path, _comp):
                return dense, 2

            def influenceObjects(self):
                return infl

            def indexForInfluenceObject(self, p):
                return {"jA": 3, "jB": 1}[p]

        class Comp:
            def create(self, _t):
                return "comp"

            def setCompleteData(self, n):
                self.n = n

        oma = types.ModuleType("maya.api.OpenMayaAnim")
        oma.MFnSkinCluster = Skin
        fake_om = types.SimpleNamespace(MFn=types.SimpleNamespace(kMesh=1, kMeshVertComponent=2),
                                        MFnMesh=lambda p: types.SimpleNamespace(numVertices=2),
                                        MFnSingleIndexedComponent=Comp)
        maya = types.ModuleType("maya")
        api = types.ModuleType("maya.api")
        api.OpenMayaAnim = oma
        maya.api = api
        saved_mod = {k: sys.modules.get(k) for k in ("maya", "maya.api", "maya.api.OpenMayaAnim")}
        saved_om = M.om
        sys.modules.update({"maya": maya, "maya.api": api, "maya.api.OpenMayaAnim": oma})
        M.om = fake_om
        try:
            v, lo, w = M._skin_weights_fast("skin")
            self.assertEqual((v.tolist(), lo.tolist(), w.tolist()), ([0, 1, 1], [1, 1, 3], [1.0, 0.7, 0.3]))
            Skin.outputs = 2
            self.assertIsNone(M._skin_weights_fast("skin"))            # 2 つの形を変形する → 今の経路
            Skin.outputs, Skin.mesh = 1, False
            self.assertIsNone(M._skin_weights_fast("skin"))            # メッシュでない → 今の経路
        finally:
            M.om = saved_om
            for k, mod in saved_mod.items():
                if mod is None:
                    sys.modules.pop(k, None)
                else:
                    sys.modules[k] = mod

    def test_fast_env(self):
        saved = os.environ.pop(M.FAST_ENV, None)
        try:
            self.assertFalse(M.fast_enabled())                       # 既定はオフ
            os.environ[M.FAST_ENV] = "1"
            self.assertTrue(M.fast_enabled())
        finally:
            os.environ.pop(M.FAST_ENV, None)
            if saved is not None:
                os.environ[M.FAST_ENV] = saved


class CompareToolTest(unittest.TestCase):
    def scene(self, w=0.5, edges=((0, 1), (1, 2), (2, 0))):
        st = M.SceneText("")
        st.lines = ['createNode mesh -n "mShape";']
        st.meshes["mShape"] = M.MeshArrays([(0, 0, 0), (1, 0, 0), (0, 1, 0)], [3], [0, 1, 2], list(edges),
                                           [True, True, False])
        st.skins["skin"] = (np.array([0, 0]), np.array([0, 1]), np.array([w, 1 - w]))
        return st

    def test_diff(self):
        from maya_collect_compare import diff_scenes
        self.assertEqual(diff_scenes(self.scene(), self.scene()), [])
        d = diff_scenes(self.scene(), self.scene(w=0.25, edges=((0, 1), (2, 1), (2, 0))))
        self.assertTrue(any("edges が違う" in x for x in d), d)
        self.assertTrue(any("ウェイトの値が 2 個違う" in x for x in d), d)
        b = self.scene()
        b.lines = ['createNode mesh -n "other";']
        self.assertTrue(any("文が 1 行違う" in x for x in diff_scenes(self.scene(), b)))


if __name__ == "__main__":
    unittest.main()
