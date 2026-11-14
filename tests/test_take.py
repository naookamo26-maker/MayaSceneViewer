# -*- coding: utf-8 -*-
"""テイク（アニメーションだけの入出力）のテスト: 共通 JSON の restNodes・graph の names、.msva・.msv の takes.json。

  python -m unittest tests.test_take
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest
import zipfile
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.animation import build_animation, rest_matrix  # noqa: E402
from ma_viewer.extract_ma import scene_to_dict  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text  # noqa: E402

HEADER = 'requires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'
BODY = '''createNode transform -n "ctrl";
	addAttr -ci true -sn "sw" -ln "switchValue" -at "double";
	setAttr ".t" -type "double3" 1 2 3 ;
	setAttr ".r" -type "double3" 0 30 0 ;
	setAttr -k on ".sw" 0.5;
createNode joint -n "root";
	setAttr ".t" -type "double3" 0 1 0 ;
	setAttr ".jo" -type "double3" 0 0 90 ;
createNode joint -n "fk" -p "root";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode multiplyDivide -n "md";
	setAttr ".i2" -type "float3" 2 1 1 ;
createNode animCurveTL -n "ctrl_translateX";
	setAttr ".tan" 18;
	setAttr -s 2 ".ktv[0:1]"  1 0 10 5;
connectAttr "ctrl_translateX.o" "ctrl.tx";
connectAttr "ctrl.switchValue" "md.i1x";
connectAttr "md.ox" "root.tx";
'''


def from_text(body: str):
    ms = parse_ma_text(HEADER + body, "test.ma")
    sc = scene_to_dict(ms)
    return sc, build_animation(ms, ms.out_index)


class TestSceneAdditions(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene, cls.anim = from_text(BODY)

    def test_rest_nodes_for_all_nodes(self):
        rest = {e["node"]: e for e in self.scene["restNodes"]}
        names = [n["name"] for n in self.scene["nodes"]]
        self.assertEqual(sorted(rest), list(range(len(names))))
        fk = rest[names.index("fk")]
        self.assertTrue(fk["joint"])
        self.assertEqual(fk["t"], [2.0, 0.0, 0.0])
        # animation.nodes にあるものと同じ形
        for e in self.anim["nodes"]:
            self.assertEqual(rest[e["node"]], e)
        # 材料から組み立てた行列が、ノードの行列と同じ
        for ni, e in rest.items():
            m = rest_matrix(e)
            for a, b in zip(m, self.scene["nodes"][ni]["matrix"]):
                self.assertAlmostEqual(a, b, places=5)

    def test_graph_names(self):
        g = next(g for g in self.anim["graph"] if g["name"] == "ctrl")
        self.assertEqual(g.get("names"), {"switchValue": "sw"})
        md = next(g for g in self.anim["graph"] if g["name"] == "md")
        self.assertNotIn("names", md)


def sample_take(name="shot010", n=3):
    from ma_viewer.schema import pack_array
    return {
        "name": name, "namespace": "armA", "source": {"kind": "ma", "name": name + ".ma"},
        "fps": 24, "timeUnit": "film", "linearUnit": "cm", "start": 1, "end": 10, "animStart": 1, "animEnd": 10,
        "curves": [{"name": "hand_ctrl_translateX", "type": "TL", "offset": 0, "count": n, "tangent": 18,
                    "weighted": False, "pre": 0, "post": 0}],
        "times": pack_array([1.0 + i for i in range(n)], "float32"),
        "values": [0.5 * i for i in range(n)],                       # 数値のリストでもよい
        "tangentTypes": pack_array([0] * (2 * n), "uint8"),
        "fixedTangents": pack_array([], "float32"),
        "bindings": [{"target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "attr": "tx", "curve": 0}],
        "nodes": [], "statics": [{"target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "values": {"fkik": 1}}],
        "warnings": [],
    }


class TestTakeFiles(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def path(self, name):
        return os.path.join(self.tmp.name, name)

    def test_msva_round_trip(self):
        from ma_viewer import package
        from ma_viewer.schema import array_values
        takes = [sample_take("a"), sample_take("b", 5)]
        info = package.write_takes(takes, self.path("t.msva"))
        self.assertEqual(info["takes"], 2)
        with zipfile.ZipFile(self.path("t.msva")) as zf:
            self.assertEqual(sorted(zf.namelist()), ["bin/takes.bin", "manifest.json", "takes.json"])
            man = json.loads(zf.read("manifest.json"))
            self.assertEqual(man["format"], "maya-scene-viewer-takes")
            ref = json.loads(zf.read("takes.json"))["takes"][1]["times"]
            self.assertEqual(ref["buffer"], "bin/takes.bin")
        back = package.read_takes(self.path("t.msva"))
        self.assertEqual([t["name"] for t in back], ["a", "b"])
        self.assertEqual(list(array_values(back[1]["times"])), [1.0, 2.0, 3.0, 4.0, 5.0])
        self.assertEqual(list(array_values(back[1]["values"])), [0.0, 0.5, 1.0, 1.5, 2.0])
        self.assertEqual(back[0]["statics"], takes[0]["statics"])
        self.assertTrue(package.is_takes(self.path("t.msva")))

    def test_msva_is_not_a_scene(self):
        from ma_viewer import package
        package.write_takes([sample_take()], self.path("t.msva"))
        with self.assertRaises(package.PackageError):
            package.read_package(self.path("t.msva"))

    def test_msv_with_takes(self):
        from ma_viewer import package
        scene, _pkg = package.read_package(os.path.join(ROOT, "samples", "sample_arm.msv"))
        self.assertNotIn("savedTakes", scene)
        self.assertEqual(package.read_takes(os.path.join(ROOT, "samples", "sample_arm.msv")), [])
        info = package.write_package(scene, self.path("s.msv"), textures="none", takes=[sample_take()])
        self.assertEqual(info["takes"], 1)
        scene2, _ = package.read_package(self.path("s.msv"))
        self.assertEqual([t["name"] for t in scene2["savedTakes"]], ["shot010"])
        self.assertEqual(len(package.read_takes(self.path("s.msv"))), 1)
        # 版の番号は 2 のまま（古い版でも開ける）。テイクを除けば、シーンは同じ
        with zipfile.ZipFile(self.path("s.msv")) as zf:
            self.assertEqual(json.loads(zf.read("manifest.json"))["version"], 2)
        a = {k: v for k, v in scene2.items() if k not in ("savedTakes", "source")}
        b = {k: v for k, v in scene.items() if k != "source"}
        self.assertEqual(a, b)
        # "keep" で引き継ぐ（pack で作り直すとき）、None で外す
        package.write_package(scene2, self.path("s2.msv"), textures="none")
        self.assertEqual(len(package.read_takes(self.path("s2.msv"))), 1)
        package.write_package(scene2, self.path("s3.msv"), textures="none", takes=None)
        self.assertEqual(package.read_takes(self.path("s3.msv")), [])

    def test_old_reader_ignores_takes(self):
        """takes.json を読まない読み方（1.40 の read_package と同じ: scene.json と bin/data.bin だけ）で、シーンが同じ"""
        from ma_viewer import package
        scene, _pkg = package.read_package(os.path.join(ROOT, "samples", "sample_arm.msv"))
        package.write_package(scene, self.path("s.msv"), textures="none", takes=[sample_take()])
        with zipfile.ZipFile(self.path("s.msv")) as zf:
            raw = json.loads(zf.read("scene.json"))
        self.assertNotIn("takes", raw)
        self.assertNotIn("savedTakes", raw)
        self.assertTrue(all(r.get("buffer") != "bin/takes.bin" for r in _refs(raw)))


def _refs(obj):
    if isinstance(obj, dict):
        if "buffer" in obj:
            yield obj
        for v in obj.values():
            yield from _refs(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _refs(v)


if __name__ == "__main__":
    unittest.main()
