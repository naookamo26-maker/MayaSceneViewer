# -*- coding: utf-8 -*-
"""extract_maya のロジック検証（Maya なし）。

Maya API を最小限まねた偽モジュールにサンプル .ma と同じシーンを再現し、
Maya 抽出器の出力が .ma パーサの出力と一致するかを確かめる。
これは「API の意味をこう理解している」という前提の上での検証であり、
実際の Maya での動作確認の代わりにはならない。
"""
from __future__ import annotations

import os
import sys
import types
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import mathutil as M  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "sample_arm.ma")
LOGICAL = {"shoulder": 0, "elbow": 1, "forearm_twist": 3, "wrist": 4, "wrist_end": 5}


class FakeScene:
    """偽 Maya が参照するシーン。.ma パーサの結果から作る。"""

    def __init__(self, ref: dict, logical=None, scene_path="/proj/sample_arm.mb", project_root=None):
        self.ref = ref
        self.scene_path = scene_path
        self.project_root = project_root
        self.dag = {}       # path → dict
        for n in ref["nodes"]:
            self.dag[n["path"]] = {"kind": "xform", **n}
        self.meshes = {}
        for m in ref["meshes"]:
            t = ref["nodes"][m["transform"]]["path"]
            path = t + "|" + m["name"]
            self.dag[path] = {"kind": "mesh", "type": "mesh", "path": path, "data": m}
            self.meshes[path] = m
        self.selection = []
        arm = [m for m in ref["meshes"] if m["skin"]][0]
        sk = arm["skin"]
        self.skin = {
            "name": "skinCluster1",
            "shape": ref["nodes"][arm["transform"]]["path"] + "|" + arm["name"],
            "influences": [ref["nodes"][i]["path"] for i in sk["influences"]],
            "pm": sk["bindPreMatrices"],
            "gm": sk["geomMatrix"],
            "mesh": arm,
        }
        names = [p.rsplit("|", 1)[-1] for p in self.skin["influences"]]
        self.logical = logical or {n: i for i, n in enumerate(names)}
        # マテリアル: シェーダー名・SG 名・file ノード名 → 情報
        self.shaders = {m["name"]: m for m in ref.get("materials", [])}
        self.sgs = {m["shadingGroup"]: m for m in ref.get("materials", [])}
        self.files = {}
        for m in ref.get("materials", []):
            for mp in (m.get("maps") or {}).values():
                t = ref["textures"][mp["texture"]]
                if t["node"] not in self.files or mp is (m.get("maps") or {}).get("baseColor"):
                    self.files[t["node"]] = (m, t)
    def resolve(self, name):
        if name in self.dag or name == "skinCluster1":
            return name
        hits = [p for p in self.dag if p.endswith("|" + name)]
        if len(hits) == 1:
            return hits[0]
        raise RuntimeError("見つかりません: " + name)


SCENE: FakeScene = None


def install_fake_maya():
    om = types.ModuleType("maya.api.OpenMaya")
    oma = types.ModuleType("maya.api.OpenMayaAnim")
    cmds = types.ModuleType("maya.cmds")

    class MFn:
        kShape = 1
        kMeshVertComponent = 2

    class MSpace:
        kObject = 0

    class Obj:
        def __init__(self, name):
            self.name = name

        def hasFn(self, fn):
            return fn == MFn.kShape and SCENE.dag.get(self.name, {}).get("kind") == "mesh"

    class MDagPath:
        def __init__(self, other=None):
            self.path = other.path if other is not None else ""

        def node(self):
            return Obj(self.path)

        def fullPathName(self):
            return self.path

        def inclusiveMatrix(self):
            d = SCENE.dag[self.path]
            if d["kind"] == "mesh":
                return list(SCENE.dag[self.path.rsplit("|", 1)[0]]["worldMatrix"])
            return list(d["worldMatrix"])

        def instanceNumber(self):
            return 0

        def isVisible(self):
            d = SCENE.dag[self.path]
            return d["data"]["visible"] if d["kind"] == "mesh" else d["visible"]

        def pop(self):
            self.path = self.path.rsplit("|", 1)[0]

    class MSelectionList:
        def __init__(self):
            self.items = []

        def add(self, name):
            self.items.append(SCENE.resolve(name))

        def getDagPath(self, i):
            p = MDagPath()
            p.path = self.items[i]
            return p

        def getDependNode(self, i):
            return Obj(self.items[i])

    class Data:
        def __init__(self, kind, value):
            self.kind, self.value = kind, value

    class Plug:
        def __init__(self, owner, name, index=None):
            self.owner, self.name, self.index = owner, name, index

        def elementByLogicalIndex(self, i):
            return Plug(self.owner, self.name, i)

        def child(self, attr):
            return Plug(self.owner, self.name + "." + attr, self.index)

        def asMObject(self):
            o = self.owner
            if self.name == "matrix":
                return Data("matrix", SCENE.dag[o]["matrix"])
            if o == "skinCluster1":
                sk = SCENE.skin
                if self.name == "bindPreMatrix":
                    slot = list(SCENE.logical.values()).index(self.index)
                    return Data("matrix", sk["pm"][slot])
                if self.name == "geomMatrix":
                    return Data("matrix", sk["gm"])
                if self.name == "input.inputGeometry" and self.index == 0:
                    return Data("mesh", sk["mesh"])
            raise RuntimeError("未対応のプラグ %s.%s" % (o, self.name))

    class MFnDependencyNode:
        def __init__(self, obj=None):
            self._name = obj.name if obj is not None else None

        def findPlug(self, name, _want_networked):
            return Plug(self._name, name)

        def attribute(self, name):
            return name

        def object(self):
            return Obj(self._name)

        def name(self):
            return self._name

    class MFnMatrixData:
        def __init__(self, data):
            assert data.kind == "matrix"
            self.data = data

        def matrix(self):
            return list(self.data.value)

    class P:
        def __init__(self, x, y, z):
            self.x, self.y, self.z = x, y, z

    class MFnMesh:
        def __init__(self, src):
            if isinstance(src, Data):
                self.m = src.value
            else:
                self.m = SCENE.meshes[src.path]
                if self.m["skin"]:
                    # 変形後シェイプの点はスキン後の位置だが、抽出器は入力形状を使うはず
                    self.deformed = True

        @property
        def numVertices(self):
            return len(self.m["positions"]) // 3

        def getPoints(self, space):
            p = self.m["positions"]
            return [P(p[i], p[i + 1], p[i + 2]) for i in range(0, len(p), 3)]

        def getVertices(self):
            return list(self.m["counts"]), list(self.m["indices"])

        # --- UV
        def getUVSetNames(self):
            return [self.m["uv"]["set"]] if self.m.get("uv") else []

        def currentUVSetName(self):
            return self.m["uv"]["set"]

        def getUVs(self, uv_set):
            v = self.m["uv"]["values"]
            return v[0::2], v[1::2]

        def getAssignedUVs(self, uv_set):
            idx = self.m["uv"]["indices"]
            counts, ids, off = [], [], 0
            for n in self.m["counts"]:
                face = idx[off:off + n]
                if all(i >= 0 for i in face):
                    counts.append(n)
                    ids += face
                else:
                    counts.append(0)
                off += n
            return counts, ids

        # --- 辺（ハードエッジ）
        def _edges(self):
            if not hasattr(self, "_edge_list"):
                seen, out, off = set(), [], 0
                for n in self.m["counts"]:
                    f = self.m["indices"][off:off + n]
                    for k in range(n):
                        a, b = f[k], f[(k + 1) % n]
                        key = (min(a, b), max(a, b))
                        if key not in seen:
                            seen.add(key)
                            out.append(key)
                    off += n
                h = self.m.get("hardEdges") or []
                self._hard = {(min(h[i], h[i + 1]), max(h[i], h[i + 1])) for i in range(0, len(h), 2)}
                self._edge_list = out
            return self._edge_list

        @property
        def numEdges(self):
            return len(self._edges())

        def getEdgeVertices(self, e):
            return self._edges()[e]

        def isEdgeSmooth(self, e):
            return self._edges()[e] not in self._hard

        # --- マテリアル（面ごとのシェーディンググループ）
        def getConnectedShaders(self, instance):
            mats = SCENE.ref.get("materials", [])
            per = self.m["faceMaterials"] or [self.m.get("material", -1)] * len(self.m["counts"])
            used = [i for i in dict.fromkeys(per) if i >= 0]
            sgs = [Obj(mats[i]["shadingGroup"]) for i in used]
            return sgs, [used.index(i) if i >= 0 else -1 for i in per]

    class MFnSingleIndexedComponent:
        def create(self, t):
            return Obj("comp")

        def setCompleteData(self, n):
            self.n = n

    om.MFn, om.MSpace, om.MDagPath, om.MSelectionList = MFn, MSpace, MDagPath, MSelectionList
    om.MFnDependencyNode, om.MFnMatrixData, om.MFnMesh = MFnDependencyNode, MFnMatrixData, MFnMesh
    om.MFnSingleIndexedComponent = MFnSingleIndexedComponent

    class MFnSkinCluster(MFnDependencyNode):
        def indexForOutputShape(self, obj):
            if obj.name == SCENE.skin["shape"]:
                return 0
            raise RuntimeError("出力先ではありません")

        def influenceObjects(self):
            out = []
            for p in SCENE.skin["influences"]:
                d = MDagPath()
                d.path = p
                out.append(d)
            return out

        def indexForInfluenceObject(self, p):
            return SCENE.logical[p.path.rsplit("|", 1)[-1]]

        def getWeights(self, dag, comp):
            m = SCENE.skin["mesh"]
            sk = m["skin"]
            nv = len(m["positions"]) // 3
            ni = len(sk["influences"])
            flat = [0.0] * (nv * ni)
            off = 0
            for v in range(nv):
                for k in range(sk["counts"][v]):
                    flat[v * ni + sk["indices"][off + k]] = sk["weights"][off + k]
                off += sk["counts"][v]
            return flat, ni

    oma.MFnSkinCluster = MFnSkinCluster

    def ls(*args, **kw):
        if kw.get("selection"):
            return list(SCENE.selection)
        if args:
            items = args[0]
            t = kw.get("type")
            types_ = {"skinCluster1": "skinCluster", "tweak1": "tweak"}
            return [i for i in items if t in (types_.get(i), "geometryFilter") and i in types_]
        t = kw.get("type")
        if t == "mesh":
            return [p for p, d in SCENE.dag.items() if d["kind"] == "mesh"]
        if t == "joint":
            return [p for p, d in SCENE.dag.items() if d.get("type") == "joint"]
        return []

    def listHistory(shape, **kw):
        return ["skinCluster1", "tweak1"] if shape == SCENE.skin["shape"] else []

    def nodeType(p):
        if p == "skinCluster1":
            return "skinCluster"
        if p == "tweak1":
            return "tweak"
        if p in SCENE.shaders:
            return SCENE.shaders[p]["type"]
        if p in SCENE.sgs:
            return "shadingEngine"
        if p in SCENE.files:
            return "file"
        return SCENE.dag[SCENE.resolve(p)]["type"]

    def getAttr(plug):
        node, attr = plug.rsplit(".", 1)
        if node == "skinCluster1" and attr == "skinningMethod":
            return 0
        if node == "skinCluster1" and attr == "normalizeWeights":
            return SCENE.skin["mesh"]["skin"]["normalize"]
        if node == "skinCluster1" and attr == "weightDistribution":
            return SCENE.skin["mesh"]["skin"].get("weightDistribution", 0)
        if node in SCENE.shaders:
            m = SCENE.shaders[node]
            from ma_viewer.materials import SCALAR_ATTRS
            for kind, (names, _d) in SCALAR_ATTRS.get(m["type"], {}).items():
                if attr in names:
                    return m.get(kind, _d)
            return [tuple(m["color"])]
        if node in SCENE.files:
            if attr == "fileTextureName":
                return SCENE.files[node][1]["path"]
            if attr == "computedFileTextureNamePattern":
                return ""          # Maya が解決できなかった場合を想定（自前の検索を使う）
            if attr == "uvTilingMode":
                return 0
            if attr in ("repeatUV", "offset"):          # place2dTexture から受け取る値（.ma の読み込みの uv と同じ）
                uv = SCENE.files[node][1].get("uv") or {"repeat": [1.0, 1.0], "offset": [0.0, 0.0]}
                return [tuple(uv["repeat" if attr == "repeatUV" else "offset"])]
        d = SCENE.dag[node]
        a = d.get("attrs", {})
        if attr in ("translate", "rotate", "scale", "jointOrient"):
            key = {"translate": "t", "rotate": "r", "scale": "s", "jointOrient": "jo"}[attr]
            return [tuple(a[key])]
        if attr == "rotateOrder":
            return M.ROTATE_ORDERS.index(a.get("ro", "xyz"))
        if attr == "inheritsTransform":
            return d.get("inheritsTransform", True)
        if attr == "visibility":
            if d["kind"] == "mesh":
                return d["data"].get("visibleSelf", True)
            return d.get("visible", True)
        if attr == "intermediateObject":
            return False
        if attr == "segmentScaleCompensate":
            return d.get("segmentScaleCompensate", True)
        if attr == "bindPose":
            # .ma パーサの結果から、バインド時のワールド行列を作って返す
            nodes = SCENE.ref["nodes"]
            i = [x["path"] for x in nodes].index(node)
            w = M.identity()
            chain = []
            while i >= 0:
                chain.append(nodes[i])
                i = nodes[i]["parent"]
            for x in reversed(chain):
                w = M.mul(x.get("bindMatrix", x["matrix"]), w)
            return w
        raise ValueError(plug)

    def listRelatives(s, allDescendents=False, fullPath=True, type=None):
        return [p for p, d in SCENE.dag.items() if p.startswith(s + "|") and d["type"] == type]

    from ma_viewer.materials import albedo_attrs

    from ma_viewer.materials import map_attrs, SCALAR_ATTRS

    def attributeQuery(attr, node=None, exists=False):
        if node in SCENE.shaders:
            t = SCENE.shaders[node]["type"]
            firsts = {a[0] for a in map_attrs(t).values()} | {albedo_attrs(t)[0]}
            firsts |= {n[0] for n, _d in SCALAR_ATTRS.get(t, {}).values()}
            return attr in firsts
        if node in SCENE.files:
            return attr == "ot"
        return False

    def listConnections(plug, source=True, destination=True, plugs=False, skipConversionNodes=False):
        node, attr = plug.split(".", 1)
        if node in SCENE.sgs and attr == "surfaceShader" and source:
            return [SCENE.sgs[node]["name"]]
        if node in SCENE.shaders and source and not destination:
            m = SCENE.shaders[node]
            out = {"rgb": "outColor", "r": "outColorR", "g": "outColorG", "b": "outColorB", "a": "outAlpha"}
            for kind, mp in (m.get("maps") or {}).items():
                if attr == map_attrs(m["type"])[kind][0]:
                    f = SCENE.ref["textures"][mp["texture"]]["node"]
                    return [f + "." + out[mp["channel"]]] if plugs else [f]
            return []
        if node in SCENE.files and destination and not source:
            m, _t = SCENE.files[node]
            return [m["name"] + ".opacity"] if (m["useAlpha"] and attr == "ot") else []
        return []

    cmds.ls, cmds.listHistory, cmds.nodeType, cmds.getAttr = ls, listHistory, nodeType, getAttr
    cmds.attributeQuery, cmds.listConnections = attributeQuery, listConnections
    cmds.uvLink = lambda **kw: []
    cmds.workspace = lambda **kw: SCENE.project_root
    cmds.listRelatives = listRelatives
    cmds.currentUnit = lambda **kw: "deg" if kw.get("angle") else "cm"
    cmds.file = lambda **kw: SCENE.scene_path
    cmds.about = lambda **kw: "2025"
    cmds.upAxis = lambda **kw: "y"

    maya = types.ModuleType("maya")
    api = types.ModuleType("maya.api")
    maya.cmds, maya.api = cmds, api
    api.OpenMaya, api.OpenMayaAnim = om, oma
    sys.modules.update({"maya": maya, "maya.api": api, "maya.api.OpenMaya": om,
                        "maya.api.OpenMayaAnim": oma, "maya.cmds": cmds})


class TestExtractMayaFake(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        global SCENE
        cls.ref = load_ma(SAMPLE)
        SCENE = FakeScene(cls.ref, logical=LOGICAL)
        install_fake_maya()
        sys.modules.pop("ma_viewer.extract_maya", None)
        from ma_viewer import extract_maya
        cls.em = extract_maya

    @classmethod
    def tearDownClass(cls):
        for k in ["maya", "maya.api", "maya.api.OpenMaya", "maya.api.OpenMayaAnim", "maya.cmds",
                  "ma_viewer.extract_maya"]:
            sys.modules.pop(k, None)

    def test_whole_scene_matches_ma_parser(self):
        out = self.em.extract_scene()
        ref = self.ref
        ref_nodes = {n["path"]: n for n in ref["nodes"]}
        out_nodes = {n["path"]: n for n in out["nodes"]}
        self.assertEqual(set(out_nodes), set(ref_nodes))
        for p, n in out_nodes.items():
            self.assertTrue(M.is_close(n["matrix"], ref_nodes[p]["matrix"], 1e-9), p)
            if n["parent"] >= 0:
                self.assertEqual(out["nodes"][n["parent"]]["path"], p.rsplit("|", 1)[0])
                self.assertLess(n["parent"], out["nodes"].index(n))
        ref_m = {m["name"]: m for m in ref["meshes"]}
        for m in out["meshes"]:
            r = ref_m[m["name"]]
            self.assertEqual(m["counts"], r["counts"])
            self.assertEqual(m["indices"], r["indices"])
            self.assertTrue(M.is_close(m["positions"], r["positions"], 1e-6))
            self.assertEqual(m["visible"], r["visible"])
            if r["skin"]:
                names = lambda sc, nodes: [nodes[i]["path"] for i in sc["influences"]]  # noqa: E731
                self.assertEqual(names(m["skin"], out["nodes"]), names(r["skin"], ref["nodes"]))
                self.assertEqual(m["skin"]["counts"], r["skin"]["counts"])
                self.assertEqual(m["skin"]["indices"], r["skin"]["indices"])
                self.assertTrue(M.is_close(m["skin"]["weights"], r["skin"]["weights"], 1e-6))
                for a, b in zip(m["skin"]["bindPreMatrices"], r["skin"]["bindPreMatrices"]):
                    self.assertTrue(M.is_close(a, b, 1e-9))
        self.assertEqual(out["source"]["kind"], "maya")
        for p, n in out_nodes.items():
            r = ref_nodes[p]
            self.assertEqual("bindMatrix" in n, "bindMatrix" in r, p)
            if "bindMatrix" in n:
                self.assertTrue(M.is_close(n["bindMatrix"], r["bindMatrix"], 1e-7), p)
                self.assertEqual(n["bindSource"], r["bindSource"], p)
        self.assertEqual(out["stats"]["joints"], 5)

    def test_pure_python_weights_same_as_numpy(self):
        flat = [0.0, 0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        np_mod = self.em._np
        a = self.em._sparse_weights(flat, 3, 3)
        self.em._np = None
        try:
            b = self.em._sparse_weights(flat, 3, 3)
        finally:
            self.em._np = np_mod
        self.assertEqual(a, b)
        self.assertEqual(a[0], [2, 1, 0])

    def test_selection_only(self):
        SCENE.selection = ["|rig_grp"]
        out = self.em.extract_scene(selection_only=True)
        self.assertEqual(out["meshes"], [])
        self.assertEqual(out["stats"]["joints"], 5)
        SCENE.selection = []
        with self.assertRaises(RuntimeError):
            self.em.extract_scene(selection_only=True)


if __name__ == "__main__":
    unittest.main()


class TestExtractMayaFakeTextured(unittest.TestCase):
    """テクスチャ付きサンプルで、Maya 抽出器のマテリアル・テクスチャ・UV が .ma パーサと一致するか"""

    @classmethod
    def setUpClass(cls):
        global SCENE
        from ma_viewer.materials import find_project_root
        path = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")
        cls.ref = load_ma(path)
        SCENE = FakeScene(cls.ref, scene_path=path, project_root=find_project_root(path))
        install_fake_maya()
        sys.modules.pop("ma_viewer.extract_maya", None)
        from ma_viewer import extract_maya
        cls.out = extract_maya.extract_scene()

    @classmethod
    def tearDownClass(cls):
        for k in ["maya", "maya.api", "maya.api.OpenMaya", "maya.api.OpenMayaAnim", "maya.cmds",
                  "ma_viewer.extract_maya"]:
            sys.modules.pop(k, None)

    def test_materials_and_textures(self):
        key = lambda sc, m: (m["name"], m["type"], tuple(m["color"]), m["useAlpha"],  # noqa: E731
                             sc["textures"][m["texture"]]["node"] if m["texture"] >= 0 else None,
                             tuple(sorted((k, sc["textures"][v["texture"]]["node"], v["channel"])
                                          for k, v in m["maps"].items())),
                             m.get("roughness"), m.get("metalness"))
        self.assertEqual(sorted(key(self.out, m) for m in self.out["materials"]),
                         sorted(key(self.ref, m) for m in self.ref["materials"]))
        res = lambda sc: sorted((t["node"], t["resolved"],  # noqa: E731
                                 tuple(tuple((t.get("uv") or {}).get(k, ())) for k in ("repeat", "offset")))
                                for t in sc["textures"])
        self.assertEqual(res(self.out), res(self.ref))
        self.assertTrue(any("missing_D.tga" in w for w in self.out["warnings"]))

    def test_mesh_assignment_and_uv(self):
        ref_m = {m["name"]: m for m in self.ref["meshes"]}
        mat_name = lambda sc, i: sc["materials"][i]["name"] if i >= 0 else None  # noqa: E731
        for m in self.out["meshes"]:
            r = ref_m[m["name"]]
            per = lambda sc, x: [mat_name(sc, i) for i in (x["faceMaterials"] or [x["material"]] * len(x["counts"]))]  # noqa: E731
            self.assertEqual(per(self.out, m), per(self.ref, r), m["name"])
            self.assertEqual(m["uv"]["set"], r["uv"]["set"])
            self.assertEqual(m["uv"]["indices"], r["uv"]["indices"])
            hard = lambda x: sorted(tuple(sorted(x["hardEdges"][i:i + 2])) for i in range(0, len(x["hardEdges"]), 2))  # noqa: E731
            self.assertEqual(hard(m), hard(r), m["name"])
            self.assertTrue(M.is_close(m["uv"]["values"], r["uv"]["values"], 1e-6))
        from ma_viewer import schema
        self.assertEqual(schema.validate(self.out), [])
