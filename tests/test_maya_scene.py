# -*- coding: utf-8 -*-
"""Maya で開いているシーンの読み込み（maya_scene）が、同じシーンを .ma で開いたときと同じ結果になるか（Maya なし）。

Maya の API で集める部分（maya_scene.collect）はここでは動かせないので、サンプルの .ma を、collect が作るのと
同じ形に分けて SceneText に入れる: メッシュの形・UV とスキンウェイトは文から外し、.ma を解析した値から作った
配列（MeshArrays・(頂点, 番号, 値)）で渡す。ほかの文はそのまま（collect は Maya が .ma に書くのと同じ文を作る）。
これで、文にしないデータの入れ方と、そのあとの変換（アニメーション・リグを含む）がスタンドアロンと同じかを確かめる。
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

import numpy as np  # noqa: E402

from ma_viewer import ma_reader as R  # noqa: E402
from ma_viewer import maya_scene  # noqa: E402
from ma_viewer.extract_ma import _assemble_array, _list_chunks, load_ma_staged, view_camera  # noqa: E402
from ma_viewer.ma_scene import parse_ma_file, read_ma_text_info  # noqa: E402

SAMPLES = sorted(glob.glob(os.path.join(ROOT, "samples", "*.ma")))
_PLUG = re.compile(r'"([^"]+)"')


def _bulk(node_type: str, attr: str) -> bool:
    """collect が文にしない属性か（形の入力のないノードとして。maya_scene.skip_attrs）"""
    base = re.split(r"[\[.]", attr.lstrip("."), maxsplit=1)[0]
    return base in maya_scene.skip_attrs(node_type, False)


def mesh_arrays(n) -> maya_scene.MeshArrays:
    """.ma を解析したメッシュ → Maya の API から読むのと同じ形"""
    md = n.mesh
    pos = np.asarray(_assemble_array(md.vt, 3), dtype=np.float64)
    if md.pt:
        off = np.asarray(_assemble_array(md.pt, 3))
        pos[:len(off)] += off[:len(pos)]
    ed = np.asarray(_assemble_array(md.ed, 3)).reshape(-1, 3).astype(np.int64)
    counts, conn, face_uvs = [], [], []
    for _st, faces, uvs in sorted(_list_chunks(md.fc), key=lambda c: c[0]):
        for fi, face in enumerate(faces):
            counts.append(len(face))
            conn += [int(ed[e, 0]) if e >= 0 else int(ed[-e - 1, 1]) for e in face]
            face_uvs.append({k: (v[fi] if fi < len(v) else None) for k, v in (uvs or {}).items()})
    uv_sets = []
    for k in sorted(md.uvsp):
        uv = np.asarray(_assemble_array(md.uvsp[k], 2)).reshape(-1, 2)
        per = [f.get(k) for f in face_uvs]
        uv_sets.append((k, md.uvsn.get(k, "map%d" % (k + 1)), uv, [len(x) if x else 0 for x in per],
                        [u for x in per if x for u in x]))
    return maya_scene.MeshArrays(pos, counts, conn, ed[:, :2], ed[:, 2] != 0, uv_sets, md.cuvs)


def scene_text(path: str) -> maya_scene.SceneText:
    """サンプルの .ma → collect が作るのと同じ SceneText"""
    ref = parse_ma_file(path)
    st = maya_scene.SceneText(path)
    st.view_camera = view_camera(ref)          # collect は作業中のビューのカメラを入れる
    text = R.strip_line_comments(read_ma_text_info(path)[0])
    types = {}
    current = None
    pos = 0
    while pos < len(text):
        end = R.statement_end(text, pos, text.find(";", pos))
        stmt = text[pos:end]
        pos = end + 1
        cmd, rest = R.split_command(stmt)
        if cmd is None:
            continue
        if cmd == "createNode":
            toks = R.tokenize(rest)
            opts, args = R.parse_flags(toks, ["-n", "-name", "-p", "-parent"])
            current = opts.get("-n") or opts.get("-name")
            types[current] = args[0].value
        elif cmd == "select":
            current = None
        elif cmd == "setAttr":
            m = _PLUG.search(rest)
            plug = m.group(1) if m else ""
            node, attr = (current, plug) if plug.startswith(".") else R.split_node_attr(plug)
            if _bulk(types.get(node, ""), attr):
                continue
        st.lines.append(stmt.strip("\r\n") + ";")      # 字下げはそのまま（ノードのブロックの範囲を変えない）
    for n in ref.nodes:
        if n.mesh is not None and n.mesh.has_topology():
            st.meshes[n.path] = mesh_arrays(n)
        elif n.skin is not None:
            items = sorted((v, li, w) for v, d in n.skin.weights.items() for li, w in d.items())
            st.skins[n.name] = tuple(np.array(x) for x in zip(*items)) if items else (np.zeros(0, np.int64),) * 3
    return st


def _no_seconds(x):
    """計測した時間（seconds）を除く"""
    if isinstance(x, dict):
        return {k: _no_seconds(v) for k, v in x.items() if k != "seconds"}
    if isinstance(x, list):
        return [_no_seconds(v) for v in x]
    return x


def load(staged) -> dict:
    scene, load_animation = staged
    anim = load_animation()
    if anim is not None:
        scene["animation"] = anim
    return _no_seconds(json.loads(json.dumps(scene, default=lambda o: o.tolist())))


class TestSameAsMa(unittest.TestCase):
    def test_samples(self):
        self.assertGreater(len(SAMPLES), 10)
        for path in SAMPLES:
            with self.subTest(os.path.basename(path)):
                want = load(load_ma_staged(path))
                got = load(maya_scene.load_staged(scene_text(path)))
                self.assertEqual(got["source"].pop("kind"), "maya")
                want["source"].pop("kind")
                self.assertEqual(got, want)


class TestShapeInput(unittest.TestCase):
    def test_curve_with_input_has_no_cc(self):
        """変形の入力（.cr ← skinCluster）のあるカーブに、いま評価された形（.cc）を書くと、固定の形として読まれ、
        スプライン IK がリグについていかない（.ma には書かれない）。collect はその .cc を書かない"""
        path = os.path.join(ROOT, "samples", "ik_sample.ma")
        st = scene_text(path)
        at = st.lines.index('createNode nurbsCurve -n "spA_curveShape" -p "spA_curve";')
        st.lines.insert(at + 1, '\tsetAttr ".cc" -type "nurbsCurve" 3 1 0 no 3 6 0 0 0 1 1 1 4 -30 0 0 -30 2.66666667 0 '
                                '-30 5.33333333 0 -30 8 0;')
        curve = lambda sc: next(c for c in sc["curves"] if c["name"] == "spA_curveShape")  # noqa: E731
        self.assertNotEqual(curve(load(maya_scene.load_staged(st))), curve(load(load_ma_staged(path))))
        self.assertIn("cc", maya_scene.skip_attrs("nurbsCurve", True))
        self.assertNotIn("cc", maya_scene.skip_attrs("nurbsCurve", False))      # 入力のないカーブは形を書く


class _RefCmds:
    """リファレンスを問い合わせる cmds の代わり。rigRN は名前空間を問い合わせると失敗する
    （Maya の「関係付けられたネームスペースが見つかりません」）。sharedReferenceNode はファイルがない"""
    REFS = {"rigRN": {"filename": "C:/proj/scenes/rig.mb", "isLoaded": True, "nodes": ["rig:root", "rig:geo"],
                      "referenceNode": None},
            "rig:propRN": {"filename": "C:/proj/scenes/prop.ma", "isLoaded": False, "namespace": ":rig:prop",
                           "referenceNode": "rigRN"},
            "sharedReferenceNode": {}}

    def ls(self, type=None):
        return list(self.REFS)

    def referenceQuery(self, rfn, **flags):
        flag = next(k for k in flags if k not in ("unresolvedName", "withoutCopyNumber", "parent"))
        info = self.REFS[rfn]
        if flag not in info:
            raise RuntimeError("関係付けられたネームスペースが見つかりません")
        return info[flag]


class TestReferences(unittest.TestCase):
    def test_reference_without_namespace_query(self):
        saved = maya_scene.cmds
        maya_scene.cmds = _RefCmds()
        try:
            refs = maya_scene._references()
        finally:
            maya_scene.cmds = saved
        got = [(r.rfn, r.namespace, r.prefix, r.loaded, r.node_count, r.depth, r.reason) for r in refs]
        self.assertEqual(got, [("rigRN", "rig", "rig:", True, 2, 1, ""),
                               ("rig:propRN", "rig:prop", "rig:prop:", False, 0, 2, "Maya でアンロードされています")])


class TestExport(unittest.TestCase):
    def test_export_package(self):
        """mv.export: ウィンドウを開かずに、ビューアで開いたときと同じシーン（アニメーションも）を .msv に書き出す"""
        import tempfile
        from ma_viewer import maya_launcher
        from ma_viewer.package import read_package
        path = os.path.join(ROOT, "samples", "anim_sample.ma")
        saved = maya_scene.collect
        maya_scene.collect = lambda selection_only=False, progress=None: scene_text(path)
        try:
            with tempfile.TemporaryDirectory() as d:
                out = os.path.join(d, "out.msv")
                r = maya_launcher.export(out)
                self.assertTrue(os.path.isfile(out) and r["size"] > 0)
                got, _pkg = read_package(out)
                with self.assertRaises(ValueError):
                    maya_launcher.export(os.path.join(d, "out.json"))
        finally:
            maya_scene.collect = saved
        want = load(load_ma_staged(path))
        self.assertEqual(got["source"]["kind"], "maya")
        self.assertEqual([m["name"] for m in got["meshes"]], [m["name"] for m in want["meshes"]])
        self.assertEqual(len(got["animation"]["curves"]), len(want["animation"]["curves"]))


class TestMeshData(unittest.TestCase):
    def test_face_edges_and_uv(self):
        """面の頂点の並びから、.ma と同じ辺の番号（向きが逆なら -番号-1）・UV の対応を作る"""
        from ma_viewer.ma_scene import MeshData
        # 四角形 2 枚（頂点 0-1-4-3・1-2-5-4）。辺 1-4 はハードエッジ。2 枚めの面には UV がない
        pts = [(x, y, 0) for y in (0, 1) for x in (0, 1, 2)]
        edges = [(0, 1), (1, 2), (3, 4), (4, 5), (0, 3), (1, 4), (2, 5)]
        smooth = [1, 1, 1, 1, 1, 0, 1]
        m = maya_scene.MeshArrays(pts, [4, 4], [0, 1, 4, 3, 1, 2, 5, 4], edges, smooth,
                                  [(2, "map1", [(0, 0), (1, 0), (1, 1), (0, 1)], [4, 0], [0, 1, 2, 3])], "map1")
        md = MeshData()
        maya_scene.mesh_data(md, m)
        ff = md.fc[0][1]
        self.assertEqual(ff.edges.tolist(), [0, 5, -3, -5, 1, 6, -4, -6])
        self.assertEqual(md.ed[0][1].reshape(-1, 3)[5].tolist(), [1, 4, 0])
        per, flat, offs = ff.uv[2]
        self.assertEqual((per.tolist(), flat.tolist(), offs.tolist()), ([4, -1], [0, 1, 2, 3], [0, 4]))
        self.assertEqual((md.uvsn, md.cuvs), ({2: "map1"}, "map1"))


if __name__ == "__main__":
    unittest.main()
