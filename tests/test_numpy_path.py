# -*- coding: utf-8 -*-
"""numpy の高速な経路と従来の処理で、.ma の変換結果が同じになるか。

  python -m unittest tests.test_numpy_path
"""
from __future__ import annotations

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import ma_scene  # noqa: E402
sys.path.insert(0, os.path.join(ROOT, "tests"))
from ma_viewer.extract_ma import load_ma, scene_to_dict  # noqa: E402

SAMPLES = [os.path.join(ROOT, "samples", "sample_arm.ma"),
           os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")]
if os.path.exists("/tmp/big.ma"):
    SAMPLES.append("/tmp/big.ma")


def _close(a, b, path="", tol=1e-6):
    """小数は tol まで許す。それ以外は完全一致"""
    if isinstance(a, float) or isinstance(b, float):
        if not (isinstance(a, (int, float)) and isinstance(b, (int, float))) or abs(a - b) > tol:
            raise AssertionError("%s: %r != %r" % (path, a, b))
    elif isinstance(a, dict):
        if set(a) != set(b):
            raise AssertionError("%s: キーが違う %s / %s" % (path, sorted(a), sorted(b)))
        for k in a:
            _close(a[k], b[k], path + "." + str(k), tol)
    elif isinstance(a, list):
        if len(a) != len(b):
            raise AssertionError("%s: 長さが違う %d / %d" % (path, len(a), len(b)))
        for i, (x, y) in enumerate(zip(a, b)):
            _close(x, y, "%s[%d]" % (path, i), tol)
    elif a != b:
        raise AssertionError("%s: %r != %r" % (path, a, b))


def _both(fn):
    os.environ["MA_VIEWER_NO_NUMPY"] = "1"
    try:
        slow = fn()
    finally:
        del os.environ["MA_VIEWER_NO_NUMPY"]
    return slow, fn()


@unittest.skipUnless(ma_scene.np is not None, "numpy がない")
class TestNumpyPath(unittest.TestCase):
    def test_samples_identical(self):
        for path in SAMPLES:
            with self.subTest(path=os.path.basename(path)):
                slow, fast = _both(lambda: load_ma(path))
                slow.pop("source"), fast.pop("source")
                _close(slow, fast)

    def test_edge_cases(self):
        # 穴付きの面（従来の処理に任せる）、不正な辺番号、mu が 2 回、ウェイトの書き方の混在、範囲外の頂点・番号
        text = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
createNode mesh -n "gShapeOrig" -p "g";
\tsetAttr ".io" yes;
\tsetAttr -s 2 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
\tsetAttr ".vt[0:4]" 0 0 0 1 0 0 1 1 0 0 1 0 2 2 0;
\tsetAttr ".ed[0:5]" 0 1 0 1 2 1 2 3 1 3 0 0 2 4 1 4 3 0;
\tsetAttr ".fc[0:1]" -type "polyFaces" f 4 0 1 2 3 mu 0 4 0 1 2 3 mu 0 4 3 2 1 0 f 3 -3 4 5;
\tsetAttr ".fc[2]" -type "polyFaces" f 3 0 1 99;
createNode mesh -n "hShape" -p "g";
\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2 h 3 0 1 2;
createNode joint -n "j0";
createNode joint -n "j1";
createNode skinCluster -n "sc";
\tsetAttr ".wl[0:2].w" 2 0 0.5 1 0.5 1 7 1 2 0 0 1 0;
\tsetAttr ".wl[4:5].w" 1 1 1 1 0 1;
connectAttr "j0.wm" "sc.ma[0]";
connectAttr "j1.wm" "sc.ma[1]";
connectAttr "gShapeOrig.w" "sc.ip[0].ig";
connectAttr "sc.og[0]" "gShape.i";
"""
        slow, fast = _both(lambda: scene_to_dict(ma_scene.parse_ma_text(text)))
        _close(slow, fast)
        m = {x["name"]: x for x in fast["meshes"]}
        self.assertEqual(m["gShape"]["counts"], [4, 3])                     # 不正な面は除外
        self.assertEqual(m["gShape"]["uv"]["indices"][:4], [0, 1, 2, 3])     # mu が 2 回なら最初のもの
        self.assertEqual(m["gShape"]["skin"]["counts"], [2, 0, 2, 0, 1])     # 範囲外の頂点（5）は無視


if __name__ == "__main__":
    unittest.main()


@unittest.skipUnless(ma_scene.np is not None, "numpy がない")
class TestFastPathUsed(unittest.TestCase):
    """結果が同じなだけでなく、実際に速い経路を通っていること（従来の処理に戻っていないこと）"""

    def _scene(self):
        # 大きな面の定義（値の文字列から直接解析する経路）に、頂点カラー（mc）と面の色（fc）を含める
        n = 30
        vt = " ".join("%d %d 0" % (x, z) for z in range(n) for x in range(n))
        edges, emap = [], {}

        def edge(a, b):
            key = (min(a, b), max(a, b))
            if key not in emap:
                emap[key] = len(edges)
                edges.append(key)
            k = emap[key]
            return k if (a, b) == key else -k - 1
        faces = []
        for z in range(n - 1):
            for x in range(n - 1):
                v = [z * n + x, z * n + x + 1, (z + 1) * n + x + 1, (z + 1) * n + x]
                es = [edge(v[i], v[(i + 1) % 4]) for i in range(4)]
                f = "f 4 %s mu 0 4 %s" % (" ".join(map(str, es)), " ".join(map(str, v)))
                if (x + z) % 7 == 0:
                    f += " mc 0 4 %s" % " ".join(map(str, v))
                if (x + z) % 11 == 0:
                    f += " fc 4 0 1 2 3"
                faces.append(f)
        uv = " ".join("%d %d" % (x, z) for z in range(n) for x in range(n))
        text = (
            'createNode transform -n "g";\ncreateNode mesh -n "gShape" -p "g";\ncreateNode mesh -n "gShapeOrig" -p "g";\n'
            '\tsetAttr ".io" yes;\n'
            '\tsetAttr ".uvst[0].uvsp[0:%d]" -type "float2" %s;\n' % (n * n - 1, uv)
            + '\tsetAttr ".vt[0:%d]" %s;\n' % (n * n - 1, vt)
            + '\tsetAttr ".ed[0:%d]" %s;\n' % (len(edges) - 1, " ".join("%d %d 1" % e for e in edges))
            + '\tsetAttr ".fc[0:%d]" -type "polyFaces" %s;\n' % (len(faces) - 1, " ".join(faces))
            + 'createNode joint -n "j0";\ncreateNode joint -n "j1";\ncreateNode skinCluster -n "sc";\n'
            # 範囲でまとめた書き方と、1 頂点ずつの書き方が混在（同じ頂点は重ならない）
            + '\tsetAttr ".wl[0:%d].w" %s;\n' % (n * n - 2, " ".join("2 0 0.25 1 0.75" for _ in range(n * n - 1)))
            + '\tsetAttr ".wl[%d].w[1]" 1;\n' % (n * n - 1)
            + 'connectAttr "j0.wm" "sc.ma[0]";\nconnectAttr "j1.wm" "sc.ma[1]";\n'
            'connectAttr "gShapeOrig.w" "sc.ip[0].ig";\nconnectAttr "sc.og[0]" "gShape.i";\n')
        return text

    def test_fast_paths_are_used(self):
        text = self._scene()
        self.assertGreater(len(text), 20000)
        slow, fast = _both(lambda: scene_to_dict(ma_scene.parse_ma_text(text)))
        _close(slow, fast)
        ma_scene.FAST.clear()
        scene_to_dict(ma_scene.parse_ma_text(text))
        used = dict(ma_scene.FAST)
        self.assertEqual(used.get("面: 速い経路"), 1, used)
        self.assertEqual(used.get("ウェイト: 速い経路"), 1, used)
        self.assertGreaterEqual(used.get("数値: 速い経路", 0), 3, used)     # 頂点・辺・UV
        self.assertFalse([k for k in used if "従来" in k], used)
        m = fast["meshes"][0]
        self.assertEqual(len(m["counts"]), 29 * 29)
        self.assertEqual(m["skin"]["counts"][-1], 1)                         # 1 頂点ずつの書き方の分も入る
