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

    def test_overwrite_same_files(self):
        """開いている .msv（同梱のテクスチャあり）・.msva に、同じ名前で上書きできる"""
        import shutil
        from ma_viewer import package
        p = self.path("tex.msv")
        shutil.copy(os.path.join(ROOT, "samples", "textured_sample.msv"), p)
        scene, pkg = package.read_package(p)
        before = sorted(n for n in pkg.names if n.startswith("textures/"))
        self.assertTrue(before)
        r = package.write_package(scene, p, textures="all", source=package.Package(p), takes=[sample_take()])
        self.assertEqual(r["textures"], len(before))
        scene2, pkg2 = package.read_package(p)
        self.assertEqual(sorted(n for n in pkg2.names if n.startswith("textures/")), before, "同梱のテクスチャを残す")
        self.assertEqual(len(scene2["savedTakes"]), 1)
        self.assertFalse(os.path.exists(p + ".part"))
        q = self.path("t.msva")
        package.write_takes([sample_take("a")], q)
        package.write_takes(package.read_takes(q) + [sample_take("b")], q)
        self.assertEqual([t["name"] for t in package.read_takes(q)], ["a", "b"])

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


class TestTakeSources(unittest.TestCase):
    """テイクの元（ma_viewer.take）: .ma・.msv・共通 JSON・.msva を、ビューアに渡す形にする"""
    SHOT = os.path.join(ROOT, "samples", "reference_project", "scenes", "shot.ma")

    def test_ma_source(self):
        from ma_viewer.take import read_sources
        sources, notes, errors = read_sources([self.SHOT])
        self.assertEqual(errors, [])
        self.assertEqual(len(sources), 1)
        src = sources[0]
        self.assertEqual((src["kind"], src["name"]), ("scene", "shot.ma"))
        sc = src["scene"]
        self.assertIn("animation", sc)
        self.assertTrue(all("positions" not in m for m in sc["meshes"]), "メッシュの形は外す")
        self.assertTrue(any(n["path"].endswith("armA:hand_ctrl") for n in sc["nodes"]))
        self.assertIn("hand_ctrl_translateX", [c["name"] for c in sc["animation"]["curves"]])

    def test_order_and_errors(self):
        from ma_viewer import package
        from ma_viewer.take import read_sources
        with tempfile.TemporaryDirectory() as d:
            package.write_takes([sample_take("z")], os.path.join(d, "b.msva"))
            with open(os.path.join(d, "a.json"), "w", encoding="utf-8") as f:
                f.write("{")
            open(os.path.join(d, "c.mb"), "wb").close()
            sources, _notes, errors = read_sources([os.path.join(d, n) for n in ("c.mb", "b.msva", "a.json")])
        self.assertEqual([s["kind"] for s in sources], ["takes"])
        self.assertEqual([e[0] for e in errors], ["a.json", "c.mb"], "ファイル名の順。読めないものは理由つき")

    def test_ma_without_reference_file(self):
        """参照先のないショットの .ma: 読めるが、リファレンスのキーは取り出せないことを知らせる"""
        import shutil
        from ma_viewer.take import read_sources
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, "shot.ma")
            shutil.copy(self.SHOT, p)
            sources, notes, errors = read_sources([p])
        self.assertEqual(errors, [])
        self.assertTrue(any("読み込めなかったリファレンス" in n and "armA" in n for n in notes), notes)
        # 参照先がなくても、リファレンスの編集（プレースホルダー・setAttr）から取り出す
        takes = sources[0]["takes"]
        self.assertEqual([t["namespace"] for t in takes], ["armA"])
        self.assertEqual(takes[0]["bindings"], [{"target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "attr": "tx", "curve": 0}])
        self.assertEqual(takes[0]["statics"], [{"target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "values": {"fkik": 1.0}}])

    def test_maya_source(self):
        """Maya で開いているシーン（collect と同じ形のもの）から、テイクの元を作る"""
        sys.path.insert(0, os.path.join(ROOT, "tests"))
        import test_maya_scene as T
        from ma_viewer.take import read_maya_source
        st = T.scene_text(os.path.join(ROOT, "samples", "anim_sample.ma"))
        src, notes = read_maya_source(st)
        self.assertEqual(notes, [])
        self.assertEqual((src["kind"], src["name"]), ("scene", "anim_sample.ma"))
        self.assertEqual(src["scene"]["source"]["kind"], "maya")
        self.assertTrue(src["scene"]["animation"]["curves"])
        self.assertTrue(all("positions" not in m for m in src["scene"]["meshes"]))

    def test_unresolved_edits_are_kept(self):
        """参照先を読まないと、当てなかった編集（setAttr・プレースホルダー）を名前空間つきで覚える"""
        from ma_viewer.ma_scene import parse_ma_file
        ms = parse_ma_file(self.SHOT, load_references=False)
        codes = {(e["code"], e.get("node") or e.get("plug")) for e in ms.ref_edits_unresolved}
        self.assertIn((5, "|world_grp|armA:rig_grp|armA:hand_ctrl.translateX"), codes)
        self.assertIn((2, "|world_grp|armA:rig_grp|armA:hand_ctrl"), codes)
        ms2 = parse_ma_file(self.SHOT)                       # 参照先を読めば、ほぼすべて当たる
        self.assertNotIn((5, "|world_grp|armA:rig_grp|armA:hand_ctrl.translateX"),
                         {(e["code"], e.get("plug")) for e in ms2.ref_edits_unresolved})


class TestTakeCommand(unittest.TestCase):
    """コマンドライン: take・info（.msva）・pack --take（Node.js と web_src の npm ci が要る。なければ飛ばす）"""

    def setUp(self):
        import shutil
        if shutil.which("node") is None or not os.path.isdir(os.path.join(ROOT, "web_src", "node_modules")):
            self.skipTest("Node.js か web_src/node_modules がない")
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def run_cli(self, *argv):
        import contextlib
        import io
        from ma_viewer.cli import main
        buf, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(err):
            rc = main(list(argv))
        return rc, buf.getvalue(), err.getvalue()

    def test_take_info_pack(self):
        from ma_viewer import package
        shot = os.path.join(ROOT, "samples", "reference_project", "scenes", "shot.ma")
        rig6 = os.path.join(ROOT, "samples", "rig6_sample.json")
        out = os.path.join(self.tmp.name, "c.msva")
        rc, text, _err = self.run_cli("take", shot, rig6, "-o", out, "-q")
        self.assertEqual(rc, 0, text)
        takes = package.read_takes(out)
        self.assertEqual(sorted((t["name"], t["namespace"]) for t in takes), [("rig6_sample", ""), ("shot", "armA")])
        shot_take = next(t for t in takes if t["name"] == "shot")
        self.assertEqual(shot_take["bindings"][0]["attr"], "tx")
        self.assertTrue(any(s["values"].get("fkik") == 1 for s in shot_take["statics"]))
        rc, text, _err = self.run_cli("info", out)
        self.assertEqual(rc, 0)
        self.assertIn("テイク 2 個", text)
        self.assertIn("名前空間 armA", text)
        msv = os.path.join(self.tmp.name, "r.msv")
        rig = os.path.join(ROOT, "samples", "reference_project", "assets", "arm_rig.ma")
        rc, text, _err = self.run_cli("pack", rig, "--take", out, "--namespace", "armA", "-o", msv, "-q")
        self.assertEqual(rc, 0, text)
        self.assertEqual([t["name"] for t in package.read_takes(msv)], ["shot"])
        rc, _text, err = self.run_cli("take", shot, "--namespace", "nope", "-o", os.path.join(self.tmp.name, "x.msva"), "-q")
        self.assertEqual(rc, 1)
        self.assertIn("見つかりません", err)


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
