# -*- coding: utf-8 -*-
"""深い階層・長い計算ノードの鎖が、再帰の上限に当たらずに読めること（docs/maintenance_plan.md の B2・B3）。

以前は約 1,000 段の階層（extract_ma の world_matrix・bind_visit・visit）と、約 500 個の直列の計算ノード
（rig.discover・analyze_fallback）で RecursionError になっていた。Node.js があれば、ビューアの評価（JS）まで通す。
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.extract_ma import load_ma  # noqa: E402

HEAD = '//Maya ASCII 2024 scene\nrequires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'


def deep_hierarchy(depth: int) -> str:
    """j0 → j1 → … の階層。どれも移動 (1, 0, 0)。j0 の移動 X にキー（1 → 0、24 → 10）"""
    s = [HEAD]
    for i in range(depth):
        s.append('createNode joint -n "j%d"%s;\n\tsetAttr ".t" -type "double3" 1 0 0;\n'
                 % (i, ' -p "j%d"' % (i - 1) if i else ""))
    s.append('createNode animCurveTL -n "j0_tx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 10;\n'
             'connectAttr "j0_tx.o" "j0.tx";\n')
    return "".join(s)


def deep_graph(depth: int) -> str:
    """ctrl.tx → a0 → a1 → … → j.tx（addDoubleLinear で 1 ずつ足す）。ctrl.tx にキー（1 → 0、24 → 5）"""
    s = [HEAD, 'createNode joint -n "j";\ncreateNode transform -n "ctrl";\n']
    for i in range(depth):
        s.append('createNode addDoubleLinear -n "a%d";\n\tsetAttr ".i2" 1;\n' % i)
    s.append('createNode animCurveTL -n "ctrl_tx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 5;\n')
    s.append('connectAttr "ctrl_tx.o" "ctrl.tx";\nconnectAttr "ctrl.tx" "a0.i1";\n')
    for i in range(1, depth):
        s.append('connectAttr "a%d.o" "a%d.i1";\n' % (i - 1, i))
    s.append('connectAttr "a%d.o" "j.tx";\n' % (depth - 1))
    return "".join(s)


NODE = shutil.which("node")
WEB = os.path.join(ROOT, "web_src")


class DeepSceneTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def load(self, name: str, text: str) -> dict:
        path = os.path.join(self.dir, name)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return load_ma(path, animation=True)

    def world_tx(self, scene: dict, name: str, frames) -> list:
        if NODE is None or not os.path.isdir(os.path.join(WEB, "node_modules")):
            self.skipTest("Node.js と web_src の npm ci が要る")
        sj = os.path.join(self.dir, "scene.json")
        with open(sj, "w", encoding="utf-8") as f:
            json.dump(scene, f)
        code = ("import { readFileSync } from 'node:fs';"
                "import { makeViewer, viewerFrame } from './tools/verify.mjs';"
                "const s = JSON.parse(readFileSync(process.argv[1], 'utf8')); const v = makeViewer(s);"
                "const i = s.nodes.findIndex((n) => n.name === process.argv[2]);"
                "console.log(JSON.stringify(JSON.parse(process.argv[3]).map((f) => "
                "+viewerFrame(v, f).world[i].elements[12].toFixed(6))));")
        out = subprocess.run([NODE, "--input-type=module", "-e", code, sj, name, json.dumps(frames)], cwd=WEB,
                             check=True, capture_output=True, text=True).stdout
        return json.loads(out)

    def test_deep_hierarchy(self):
        depth = 3000
        scene = self.load("deep_h.ma", deep_hierarchy(depth))
        nodes = scene["nodes"]
        self.assertEqual(len(nodes), depth)
        # 出力の番号は深さ優先（親が先）
        self.assertEqual([n["parent"] for n in nodes[:3]], [-1, 0, 1])
        self.assertEqual(nodes[-1]["name"], "j%d" % (depth - 1))
        self.assertAlmostEqual(nodes[-1]["worldMatrix"][12], float(depth))
        # j0 の移動 X はキーで 0 → 10（ほかの depth − 1 個は 1 ずつ）
        self.assertEqual(self.world_tx(scene, "j%d" % (depth - 1), [1, 24]), [depth - 1, depth + 9])

    def test_long_graph_chain(self):
        depth = 2000
        scene = self.load("deep_g.ma", deep_graph(depth))
        anim = scene["animation"]
        self.assertEqual(len(anim["graph"]) >= depth, True)
        self.assertFalse(anim.get("warnings"), anim.get("warnings"))
        self.assertEqual(self.world_tx(scene, "j", [1, 24]), [depth, depth + 5])

    def test_children_order(self):
        """子は書かれた順（スタックでたどっても、再帰のときと同じ番号）"""
        text = HEAD + ('createNode joint -n "r";\n'
                       'createNode joint -n "b" -p "r";\n'
                       'createNode joint -n "b2" -p "b";\n'
                       'createNode joint -n "a" -p "r";\n'
                       'createNode joint -n "s";\n')
        scene = self.load("order.ma", text)
        self.assertEqual([(n["name"], n["parent"]) for n in scene["nodes"]],
                         [("r", -1), ("b", 0), ("b2", 1), ("a", 0), ("s", -1)])


if __name__ == "__main__":
    unittest.main()
