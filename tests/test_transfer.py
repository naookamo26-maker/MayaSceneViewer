# -*- coding: utf-8 -*-
"""ビューアへの転送で大きな数値の配列を抜き出す（schema.split_blobs）。

  python -m unittest tests.test_transfer
"""
from __future__ import annotations

import copy
import json
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import schema  # noqa: E402


class TestSplitBlobs(unittest.TestCase):
    def test_split(self):
        big = schema.pack_array(list(range(100)), "int32")
        small = schema.pack_array([1.5, 2.5], "float32")
        scene = {"meshes": [{"positions": big, "uv": {"values": small}}, {"positions": big}],
                 "nodes": [{"name": "a", "matrix": [1, 0]}], "animation": None}
        before = copy.deepcopy(scene)
        skel, blobs = schema.split_blobs(scene, min_chars=100)
        self.assertEqual(scene, before)                              # 元のデータは変えない
        self.assertEqual(skel["meshes"][0]["positions"], {"dtype": "int32", "count": 100, "blob": 0})
        self.assertEqual(skel["meshes"][1]["positions"], {"dtype": "int32", "count": 100, "blob": 1})
        self.assertEqual(skel["meshes"][0]["uv"]["values"], small)   # 小さい配列は JSON に残す
        self.assertEqual(blobs, [big["data"], big["data"]])
        self.assertIs(skel["nodes"], scene["nodes"])                 # 抜き出さない部分は共有する
        json.dumps(skel)                                             # そのまま JSON にできる

    def test_nothing_to_split(self):
        scene = {"meshes": [{"positions": schema.pack_array([1.0], "float32")}]}
        skel, blobs = schema.split_blobs(scene)
        self.assertIs(skel, scene)
        self.assertEqual(blobs, [])


if __name__ == "__main__":
    unittest.main()
