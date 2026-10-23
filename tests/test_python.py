# -*- coding: utf-8 -*-
"""Python 側の単体テスト。  python -m unittest discover -s tests"""
from __future__ import annotations

import json
import math
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import ma_reader as R  # noqa: E402
from ma_viewer import mathutil as M  # noqa: E402
from ma_viewer import schema  # noqa: E402
from ma_viewer.extract_ma import load_ma, scene_to_dict  # noqa: E402
from ma_viewer.ma_scene import parse_ma_text, parse_polyfaces  # noqa: E402

SAMPLE = os.path.join(ROOT, "samples", "sample_arm.ma")
EXPECTED = os.path.join(ROOT, "samples", "sample_arm.expected.json")


class TestReader(unittest.TestCase):
    def test_statements_with_strings_and_comments(self):
        text = ('//Maya ASCII\n// x;y\nrequires maya "2024";\n'
                'setAttr ".b" -type "string" ("a; // b" + "c\\"; d");\n'
                'createNode transform -n "a";')
        stmts = [s.strip() for _, s in R.iter_statements(text)]
        self.assertEqual(len(stmts), 3)
        self.assertTrue(stmts[0].startswith("requires"))
        self.assertIn('"c\\"; d"', stmts[1])
        self.assertEqual(stmts[2], 'createNode transform -n "a"')

    def test_setattr_flags_after_name(self):
        sa = R.parse_setattr(' -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" f 4 0 1 2 3')
        self.assertEqual(sa.plug, ".fc[0:5]")
        self.assertEqual(sa.type, "polyFaces")
        self.assertEqual(sa.size, 6)
        self.assertEqual(sa.values()[:3], ["f", "4", "0"])

    def test_setattr_negative_numbers_and_bool(self):
        sa = R.parse_setattr(' -k off ".t" -type "double3" -1 -0.5 2e-3 ')
        self.assertEqual(R.to_floats(sa.values()), [-1.0, -0.5, 0.002])
        sa = R.parse_setattr(' ".io" yes')
        self.assertTrue(R.to_bool(sa.values()[0]))

    def test_attr_path(self):
        e = R.parse_attr_path(".weightList[0:7].weights")
        self.assertEqual([(x.name, x.index) for x in e], [("wl", (0, 7)), ("w", None)])
        self.assertEqual(R.normalize_attr("worldMatrix[0]"), "wm[0]")
        self.assertEqual(R.normalize_attr("ip[0].ig"), "ip[0].ig")

    def test_polyfaces(self):
        faces, holes, uvs = parse_polyfaces(
            "f 3 0 1 2 mu 0 3 0 1 2 mu 1 3 5 6 7 h 3 3 4 5 mu 0 3 9 9 9 f 4 -1 -2 -3 6 mc 0 4 1 2 3 4".split())
        self.assertEqual(faces, [[0, 1, 2], [-1, -2, -3, 6]])
        self.assertEqual(holes, 1)
        # 穴の mu は読み捨て、UV のない面は None
        self.assertEqual(uvs, {0: [[0, 1, 2], None], 1: [[5, 6, 7], None]})


class TestMath(unittest.TestCase):
    def test_rotation_conventions(self):
        # Maya: Y 軸 +90 度で +X は -Z を向く
        p = M.transform_point((1, 0, 0), M.euler((0, math.pi / 2, 0)))
        self.assertTrue(M.is_close(p, (0, 0, -1)))
        # X 軸 +90 度で +Y は +Z を向く
        p = M.transform_point((0, 1, 0), M.euler((math.pi / 2, 0, 0)))
        self.assertTrue(M.is_close(p, (0, 0, 1)))
        # 回転順 xyz は X → Y → Z の順に適用
        r = (math.pi / 2, math.pi / 2, 0)
        p = M.transform_point((0, 1, 0), M.euler(r, "xyz"))  # X: Y→Z, Y: Z→X
        self.assertTrue(M.is_close(p, (1, 0, 0)))
        p = M.transform_point((0, 1, 0), M.euler(r, "yxz"))  # Y: 変化なし, X: Y→Z
        self.assertTrue(M.is_close(p, (0, 0, 1)))

    def test_rotate_pivot(self):
        m = M.transform_matrix(r=(0, math.pi / 2, 0), rp=(1, 0, 0))
        self.assertTrue(M.is_close(M.transform_point((1, 0, 0), m), (1, 0, 0)))
        self.assertTrue(M.is_close(M.transform_point((0, 0, 0), m), (1, 0, 1)))

    def test_scale_pivot(self):
        m = M.transform_matrix(s=(2, 2, 2), sp=(1, 0, 0))
        self.assertTrue(M.is_close(M.transform_point((1, 0, 0), m), (1, 0, 0)))
        self.assertTrue(M.is_close(M.transform_point((2, 0, 0), m), (3, 0, 0)))

    def test_joint_orient_order(self):
        # r → jo の順（行ベクトル）: r=Z90, jo=X90 で +X は +Y → +Z
        m = M.joint_matrix(r=(0, 0, math.pi / 2), jo=(math.pi / 2, 0, 0))
        self.assertTrue(M.is_close(M.transform_point((1, 0, 0), m), (0, 0, 1)))

    def test_inverse(self):
        m = M.transform_matrix(t=(1, 2, 3), r=(0.3, 0.2, 0.1), s=(2, 1, 0.5), sh=(0.2, 0, 0.1))
        self.assertTrue(M.is_close(M.mul(m, M.inverse(m)), M.identity(), 1e-9))

    def test_xform_data(self):
        m = M.xform_data_to_matrix([1, 1, 1, 0, math.pi / 2, 0, 0, 5, 0, 0])
        self.assertTrue(M.is_close(M.transform_point((1, 0, 0), m), (5, 0, -1)))


class TestExtract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(SAMPLE)
        with open(EXPECTED, encoding="utf-8") as f:
            cls.exp = json.load(f)
        cls.by_name = {n["name"]: (i, n) for i, n in enumerate(cls.scene["nodes"])}
        cls.meshes = {m["name"]: m for m in cls.scene["meshes"]}

    def test_schema(self):
        self.assertEqual(schema.validate(self.scene), [])

    def test_hierarchy_order(self):
        names = [n["name"] for n in self.scene["nodes"]]
        self.assertNotIn("persp", names)  # メッシュ・ジョイントを含まない階層は除外
        self.assertEqual(self.scene["nodes"][self.by_name["elbow"][1]["parent"]]["name"], "shoulder")

    def test_joint_world_matrices(self):
        for name, mat in self.exp["jointWorldPosed"].items():
            got = self.scene["nodes"][self.by_name[name][0]]["worldMatrix"]
            self.assertTrue(M.is_close(got, mat, 1e-7), name)

    def test_local_times_parent_is_world(self):
        nodes = self.scene["nodes"]
        for n in nodes:
            w = n["matrix"] if n["parent"] < 0 else M.mul(n["matrix"], nodes[n["parent"]]["worldMatrix"])
            self.assertTrue(M.is_close(w, n["worldMatrix"], 1e-7), n["name"])

    def test_arm_geometry_from_orig(self):
        arm = self.meshes["arm_geoShape"]
        self.assertEqual(len(arm["positions"]) // 3, self.exp["armVertexCount"])
        self.assertEqual(len(arm["counts"]), self.exp["armFaceCount"])
        self.assertIn(12, arm["counts"])  # 12 角形の端面
        for i, p in enumerate(self.exp["armBindPositions"]):
            self.assertTrue(M.is_close(arm["positions"][i * 3:i * 3 + 3], p, 1e-5), i)

    def test_face_winding_outward(self):
        arm = self.meshes["arm_geoShape"]
        pos, cnt, idx = arm["positions"], arm["counts"], arm["indices"]
        a, b, c = idx[0], idx[1], idx[2]
        P = lambda i: pos[i * 3:i * 3 + 3]
        u = [P(b)[k] - P(a)[k] for k in range(3)]
        v = [P(c)[k] - P(a)[k] for k in range(3)]
        nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
        center = [(P(a)[k] + P(c)[k]) / 2 for k in range(3)]
        radial = [0, center[1], center[2]]
        self.assertGreater(sum(nrm[k] * radial[k] for k in range(3)), 0)

    def test_skin_mapping_and_deformation(self):
        arm = self.meshes["arm_geoShape"]
        sk = arm["skin"]
        nodes = self.scene["nodes"]
        inf_names = [nodes[i]["name"] for i in sk["influences"]]
        self.assertEqual(inf_names, ["shoulder", "elbow", "forearm_twist", "wrist", "wrist_end"])
        nv = len(arm["positions"]) // 3
        off = 0
        gm = sk["geomMatrix"]
        gmi = M.inverse(gm)
        mesh_world = nodes[arm["transform"]]["worldMatrix"]
        skin_m = [M.mul(sk["bindPreMatrices"][s], nodes[sk["influences"][s]]["worldMatrix"])
                  for s in range(len(sk["influences"]))]
        logical = self.exp["influenceLogical"]
        for v in range(nv):
            c = sk["counts"][v]
            got_w = {inf_names[sk["indices"][off + k]]: sk["weights"][off + k] for k in range(c)}
            exp_w = {name: w for name, li in logical.items()
                     for k, w in self.exp["armWeights"][v].items() if int(k) == li}
            self.assertEqual(set(got_w), set(exp_w), v)
            p = arm["positions"][v * 3:v * 3 + 3]
            pw = M.transform_point(p, gm)
            acc = [0.0, 0.0, 0.0]
            for k in range(c):
                q = M.transform_point(pw, skin_m[sk["indices"][off + k]])
                acc = [acc[j] + sk["weights"][off + k] * q[j] for j in range(3)]
            res = M.transform_point(M.transform_point(acc, gmi), mesh_world)
            self.assertTrue(M.is_close(res, self.exp["armDeformedWorld"][v], 1e-4), v)
            off += c
        self.assertEqual(max(sk["counts"]), 5)

    def test_visibility_and_warnings(self):
        self.assertFalse(self.meshes["hidden_geoShape"]["visible"])
        self.assertTrue(self.meshes["boxShape"]["visible"])
        self.assertNotIn("history_geoShape", self.meshes)
        self.assertTrue(any("history_geoShape" in w for w in self.scene["warnings"]))

    def test_box_pivots(self):
        box = self.scene["nodes"][self.by_name["box"][0]]
        # スケールピボット (0.5,0,0) の点はスケール・シアーで動かず、spt で (1,0,0) へ移る。
        # そこは回転ピボットなので回転でも動かず、最後に t=(3,1,0) だけ移動する。
        m = box["matrix"]
        p = M.transform_point((0.5, 0, 0), m)
        self.assertTrue(M.is_close(p, (4, 1, 0), 1e-6))


class TestInline(unittest.TestCase):
    def test_sparse_and_dense_weights_and_aliases(self):
        text = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
\tsetAttr -s 3 ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr -s 3 ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr -s 1 ".fc[0]" -type "polyFaces" f 3 0 1 2;
createNode joint -n "j1";
createNode joint -n "j2" -p "j1";
\tsetAttr "j2.translateX" 2;
createNode skinCluster -n "sc";
\tsetAttr ".weightList[0:1].weights" 1 0 1 2 0 0.25 1 0.75;
\tsetAttr -s 2 ".wl[2].w[0:1]" 0.5 0.5;
connectAttr "j1.worldMatrix[0]" "sc.matrix[0]";
connectAttr "j2.wm" "sc.ma[1]";
"""
        ms = parse_ma_text(text)
        sk = [n for n in ms.nodes if n.type == "skinCluster"][0].skin
        self.assertEqual(sk.weights[0], {0: 1.0})
        self.assertEqual(sk.weights[1], {0: 0.25, 1: 0.75})
        self.assertEqual(sk.weights[2], {0: 0.5, 1: 0.5})
        j2 = [n for n in ms.nodes if n.name == "j2"][0]
        self.assertEqual(j2.vec3("t"), (2.0, 0.0, 0.0))
        sc = [n for n in ms.nodes if n.type == "skinCluster"][0]
        self.assertIn("matrix[0]", sc.inputs)  # matrix は別名変換しない
        scene = scene_to_dict(ms)
        self.assertEqual(scene["meshes"][0]["indices"], [0, 1, 2])

    def test_negative_edge_reverses(self):
        text = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
\tsetAttr ".vt[0:3]" 0 0 0 1 0 0 1 1 0 0 1 0;
\tsetAttr ".ed[0:4]" 0 1 0 1 2 0 2 3 0 3 0 0 0 2 0;
\tsetAttr ".fc[0:1]" -type "polyFaces" f 3 0 1 -5 f 3 4 2 3;
"""
        scene = scene_to_dict(parse_ma_text(text))
        self.assertEqual(scene["meshes"][0]["indices"], [0, 1, 2, 0, 2, 3])


if __name__ == "__main__":
    unittest.main()


# ---------------------------------------------------------------------------
# テクスチャ・マテリアル
# ---------------------------------------------------------------------------
import tempfile  # noqa: E402

from ma_viewer.materials import TextureResolver  # noqa: E402

TEXTURED = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")


class TestTextureResolver(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        self.proj = os.path.join(self.root, "proj")
        os.makedirs(os.path.join(self.proj, "scenes", "sub"))
        os.makedirs(os.path.join(self.proj, "sourceimages", "tex"))
        with open(os.path.join(self.proj, "workspace.mel"), "w") as f:
            f.write('workspace -fr "sourceImages" "sourceimages";\n')
        self.scene = os.path.join(self.proj, "scenes", "sub", "a.ma")

    def tearDown(self):
        self.tmp.cleanup()

    def touch(self, *parts):
        p = os.path.join(*parts)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, "wb").close()
        return p

    def test_absolute_first(self):
        p = self.touch(self.root, "abs", "x.tga")
        self.touch(self.proj, "sourceimages", "x.tga")
        found, tried = TextureResolver(self.scene).resolve(p.replace("\\", "/"))
        self.assertEqual(os.path.normcase(found), os.path.normcase(p))
        self.assertEqual(len(tried), 1)

    def test_sourceimages_before_scene_dir_with_parent_folders(self):
        want = self.touch(self.proj, "sourceimages", "tex", "b.tga")
        self.touch(self.proj, "scenes", "sub", "tex", "b.tga")   # .ma 側にもあるが sourceimages が先
        found, tried = TextureResolver(self.scene).resolve("D:/old/chr/tex/b.tga")
        self.assertEqual(os.path.normcase(found), os.path.normcase(want))
        names = [t.replace("\\", "/").split("/proj/")[-1] for t in tried]
        self.assertEqual(names, ["D:/old/chr/tex/b.tga", "sourceimages/b.tga", "sourceimages/tex/b.tga"])

    def test_scene_dir_when_not_in_sourceimages(self):
        want = self.touch(self.proj, "scenes", "sub", "chr", "tex", "c.tga")
        found, tried = TextureResolver(self.scene).resolve("D:/old/chr/tex/c.tga")
        self.assertEqual(os.path.normcase(found), os.path.normcase(want))
        self.assertTrue(tried[-1].endswith("scenes/sub/chr/tex/c.tga"))

    def test_project_relative_and_no_project(self):
        want = self.touch(self.proj, "sourceimages", "tex", "d.tga")
        found, _ = TextureResolver(self.scene).resolve("sourceimages/tex/d.tga")
        self.assertEqual(os.path.normcase(found), os.path.normcase(want))
        # プロジェクト外のシーンでは sourceimages を探さない
        loose = os.path.join(self.root, "loose", "e.ma")
        os.makedirs(os.path.dirname(loose))
        r = TextureResolver(loose)
        self.assertIsNone(r.project_root)
        found, tried = r.resolve("D:/x/d.tga")
        self.assertIsNone(found)
        self.assertFalse(any("sourceimages" in t for t in tried))

    def test_env_and_udim(self):
        want = self.touch(self.root, "envdir", "f.tga")
        os.environ["MAVIEW_TEST_TEX"] = os.path.join(self.root, "envdir")
        found, _ = TextureResolver(self.scene).resolve("$MAVIEW_TEST_TEX/f.tga")
        self.assertEqual(os.path.normcase(found), os.path.normcase(want))
        found, tried = TextureResolver(self.scene).resolve("C:/t/body.<UDIM>.tga")
        self.assertIsNone(found)
        self.assertEqual(tried, [])


class TestTexturedScene(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(TEXTURED)
        cls.mesh = {m["name"]: m for m in cls.scene["meshes"]}
        cls.mat = {m["name"]: (i, m) for i, m in enumerate(cls.scene["materials"])}
        cls.tex = cls.scene["textures"]

    def test_schema(self):
        self.assertEqual(schema.validate(self.scene), [])

    def test_texture_resolution(self):
        by_node = {t["node"]: t for t in self.tex}
        rel = lambda t: t["resolved"].replace("\\", "/").split("textured_project/")[-1] if t["resolved"] else None  # noqa: E731
        self.assertEqual(rel(by_node["quad_file"]), "sourceimages/props/quad_D.tga")
        self.assertEqual(rel(by_node["box_file"]), "sourceimages/tex/box_D.tga")
        self.assertEqual(rel(by_node["leaf_file"]), "scenes/leaf_A.tga")
        self.assertIsNone(by_node["missing_file"]["resolved"])
        self.assertEqual(by_node["quad_file"]["format"], "tga")
        self.assertTrue(by_node["quad_file"]["url"].startswith("file:///"))
        self.assertTrue(any("missing_D.tga" in w for w in self.scene["warnings"]))

    def test_materials(self):
        i, quad = self.mat["quad_mat"]
        self.assertEqual(quad["type"], "lambert")
        self.assertEqual(self.tex[quad["texture"]]["node"], "quad_file")
        self.assertFalse(quad["useAlpha"])
        _, leaf = self.mat["leaf_mat"]
        self.assertEqual(leaf["type"], "aiStandardSurface")
        self.assertTrue(leaf["useAlpha"], "opacity に同じ file のアルファがつながっている")
        _, b = self.mat["box_matB"]
        self.assertEqual(b["color"], [0.25, 0.55, 0.65])
        self.assertEqual(self.mesh["quad_geoShape"]["material"], i)
        self.assertIsNone(self.mesh["quad_geoShape"]["faceMaterials"])

    def test_face_materials_uv_and_skin(self):
        box = self.mesh["box_geoShape"]
        a, b = self.mat["box_matA"][0], self.mat["box_matB"][0]
        self.assertEqual(box["faceMaterials"], [a, a, a, b, b, b])
        self.assertEqual(box["uv"]["set"], "map1")
        self.assertEqual(len(box["uv"]["indices"]), 24)
        self.assertEqual(len(box["uv"]["values"]), 48)
        self.assertIsNotNone(box["skin"])

    def test_uv_set_from_uvchooser_and_default_material(self):
        self.assertEqual(self.mesh["leaf_geoShape"]["uv"]["set"], "leafUV")
        self.assertEqual(self.mesh["leaf_geoShape"]["uv"]["values"][:4], [0, 0, 1, 0])
        plain = self.mesh["plain_geoShape"]
        self.assertEqual(plain["material"], -1)
        self.assertEqual(self.mesh["quad_geoShape"]["uv"]["indices"], [0, 1, 2, 3])


# ---------------------------------------------------------------------------
# バインドポーズ・接続で値が決まるノード
# ---------------------------------------------------------------------------

BIND_MA = """
createNode transform -n "rig";
createNode joint -n "root" -p "rig";
\tsetAttr ".t" -type "double3" 0 0.5 0 ;
\tsetAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 9 0 1;
createNode joint -n "mid" -p "root";
\tsetAttr ".bps" -type "matrix" 0 1 0 0 -1 0 0 0 0 0 1 0 2 1 0 1;
createNode joint -n "tip" -p "mid";
\tsetAttr ".t" -type "double3" 1 0 0 ;
createNode joint -n "free" -p "rig";
createNode transform -n "ctrl";
\tsetAttr ".t" -type "double3" 2 1 0 ;
\tsetAttr ".r" -type "double3" 0 0 90 ;
createNode unitConversion -n "uc1";
\tsetAttr ".cf" 0.017453292519943295;
createNode transform -n "geo";
createNode mesh -n "geoShape" -p "geo";
createNode mesh -n "geoShapeOrig" -p "geo";
\tsetAttr ".io" yes;
\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2;
createNode skinCluster -n "sc";
\tsetAttr ".wl[0:2].w" 1 0 1 1 0 1 1 0 1;
\tsetAttr ".pm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 0 -1 0 1;
createNode dagPose -n "bindPose1";
\tsetAttr -s 2 ".xm";
\tsetAttr ".xm[0]" -type "matrix" "xform" 1 1 1 0 0 0 0 0 0.5 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 1 yes;
\tsetAttr ".xm[1]" -type "matrix" "xform" 1 1 1 0 0 0 0 0 7 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 1 yes;
\tsetAttr ".bp" yes;
connectAttr "ctrl.t" "mid.t";
connectAttr "ctrl.r" "uc1.i";
connectAttr "uc1.o" "mid.r";
connectAttr "ctrl.t" "free.t";
connectAttr "root.wm" "sc.ma[0]";
connectAttr "geoShapeOrig.w" "sc.ip[0].ig";
connectAttr "sc.og[0]" "geoShape.i";
connectAttr "rig.msg" "bindPose1.m[0]";
connectAttr "root.msg" "bindPose1.m[1]";
"""


class TestBindPose(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scene = scene_to_dict(parse_ma_text(BIND_MA))
        cls.n = {x["name"]: x for x in cls.scene["nodes"]}
        cls.nodes = cls.scene["nodes"]

    def bind_world(self, name):
        """bindMatrix（なければ matrix）を親からたどったワールド行列"""
        i = [x["name"] for x in self.nodes].index(name)
        chain = []
        while i >= 0:
            chain.append(self.nodes[i])
            i = self.nodes[i]["parent"]
        w = M.identity()
        for x in reversed(chain):
            w = M.mul(x.get("bindMatrix", x["matrix"]), w)
        return w

    def test_sources_and_priority(self):
        self.assertEqual(self.n["rig"]["bindSource"], "dagPose")      # dagPose の xm（ローカル）
        self.assertEqual(self.n["root"]["bindSource"], "pm")          # .pm が .bps（古い値）と dagPose より優先
        self.assertEqual(self.n["mid"]["bindSource"], "bps")
        self.assertNotIn("bindMatrix", self.n["tip"])
        self.assertNotIn("bindMatrix", self.n["free"])

    def test_bind_world_positions(self):
        self.assertTrue(M.is_close(M.position(self.bind_world("rig")), (0, 0.5, 0)))
        self.assertTrue(M.is_close(M.position(self.bind_world("root")), (0, 1, 0)))
        self.assertTrue(M.is_close(self.bind_world("mid"), [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 2, 1, 0, 1]))
        # 情報源のない tip はファイル上のローカル値 (1,0,0) のまま、回転した mid についていく
        self.assertTrue(M.is_close(M.position(self.bind_world("tip")), (2, 2, 0)))

    def test_driven_nodes(self):
        mid, free = self.n["mid"], self.n["free"]
        self.assertTrue(any(d.startswith("t ← ctrl") for d in mid["drivenBy"]))
        self.assertTrue(any(d.startswith("r ← uc1（unitConversion）") for d in mid["drivenBy"]))
        # 「ファイルの値」でも、値が読めない mid はバインドポーズの姿勢に置き換える
        self.assertTrue(M.is_close(mid["matrix"], mid["bindMatrix"]))
        # 置き換えるのは親に対するローカルな姿勢。親 root のファイル上の位置（y=0.5）が基準になる
        self.assertTrue(M.is_close(M.position(mid["worldMatrix"]), (2, 0.5, 0)))
        # バインド情報もない free は既定値のまま（警告）
        self.assertTrue(M.is_close(free["matrix"], M.identity()))
        # 接続元（ctrl の直接の接続・unitConversion）はリグとして評価できるので、警告は出さず、
        # アニメーションの読み込みで評価する（animation.graph に入る）
        warns = " ".join(self.scene["warnings"])
        self.assertNotIn("mid: ", warns)
        self.assertNotIn("free: ", warns)
        self.assertEqual(self.scene["stats"]["drivenNodes"], 2)
        self.assertEqual(schema.validate(self.scene), [])
        from ma_viewer.animation import build_animation
        ms = parse_ma_text(BIND_MA)
        scene_to_dict(ms)
        graph = {g["name"]: g for g in build_animation(ms, ms.out_index)["graph"]}
        self.assertEqual(set(graph["mid"]["inputs"]), {"t", "r"})
        self.assertEqual(graph["free"]["inputs"]["t"]["attr"], "t")

    def test_unsupported_driver_warns(self):
        """評価できないノード（エクスプレッション）で値が決まるノードには、従来どおり警告を出す"""
        text = BIND_MA + 'createNode expression -n "ex";\nconnectAttr "ex.out[0]" "tip.tx";\n'
        warns = " ".join(scene_to_dict(parse_ma_text(text))["warnings"])
        self.assertIn("tip: ", warns)

    def test_xform_with_joint_orient(self):
        # rotate=0, jointOrient=Z90（四元数）, translate=(1,2,3) → joint_matrix と一致
        q = M.matrix_to_quat(M.euler((0, 0, math.pi / 2)))
        vals = [1, 1, 1, 0, 0, 0, 0, 1, 2, 3] + [0] * 15 + [0, 0, 0, 1] + q + [1, 1, 1]
        ref = M.joint_matrix(t=(1, 2, 3), jo=(0, 0, math.pi / 2))
        self.assertTrue(M.is_close(M.xform_data_to_matrix(vals), ref, 1e-9))


class TestTextureAssignmentEdgeCases(unittest.TestCase):
    """テクスチャが貼られなかったケース（ヒストリ付きの面ごとの割り当て・面との対応がない UV セット）"""

    @classmethod
    def setUpClass(cls):
        cls.scene = load_ma(TEXTURED)
        cls.mesh = {m["name"]: m for m in cls.scene["meshes"]}
        cls.names = [m["name"] for m in cls.scene["materials"]]

    def test_face_groups_from_groupparts(self):
        m = self.mesh["hist_geoShape"]
        self.assertEqual([self.names[i] for i in m["faceMaterials"]], ["box_matA"] * 3 + ["quad_mat"] * 3)
        self.assertIsNotNone(m["skin"])

    def test_uv_set_without_face_mapping_falls_back(self):
        m = self.mesh["uvset_geoShape"]
        self.assertEqual(m["uv"]["set"], "map1")
        self.assertNotIn(-1, m["uv"]["indices"])
        w = " ".join(self.scene["warnings"])
        self.assertIn("uvset_geoShape: 現在の UV セット「emptySet」", w)
        self.assertNotIn("leaf_geoShape: 現在の UV セット", w)   # uvChooser で選んだものは警告しない

    def test_unresolved_group_warns(self):
        text = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
\tsetAttr -s 1 ".iog[0].og";
\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2;
createNode lambert -n "m1";
createNode shadingEngine -n "m1SG";
connectAttr "m1.oc" "m1SG.ss";
connectAttr "gShape.iog.og[0]" "m1SG.dsm" -na;
"""
        sc = scene_to_dict(parse_ma_text(text))
        self.assertEqual(sc["meshes"][0]["material"], -1)
        self.assertTrue(any("objectGroups[0]" in w and "m1" in w for w in sc["warnings"]))


class TestNormalizeSetting(unittest.TestCase):
    def test_nw(self):
        base = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
createNode mesh -n "gShapeOrig" -p "g";
\tsetAttr ".io" yes;
\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2;
createNode joint -n "j";
createNode skinCluster -n "sc";
\tsetAttr ".wl[0:2].w" 1 0 0.5 1 0 0.5 1 0 0.5;
%s
connectAttr "j.wm" "sc.ma[0]";
connectAttr "gShapeOrig.w" "sc.ip[0].ig";
connectAttr "sc.og[0]" "gShape.i";
"""
        post = scene_to_dict(parse_ma_text(base % '\tsetAttr ".nw" 2;'))
        default = scene_to_dict(parse_ma_text(base % ""))
        self.assertEqual(post["meshes"][0]["skin"]["normalize"], 2)
        self.assertEqual(default["meshes"][0]["skin"]["normalize"], 1)


class TestResources(unittest.TestCase):
    """exe 化（PyInstaller の一時展開フォルダ）でも web 一式が見つかるか"""

    def setUp(self):
        from ma_viewer import resources
        self.res = resources
        self.tmp = tempfile.TemporaryDirectory()
        self.saved = {k: getattr(sys, k, None) for k in ("frozen", "_MEIPASS")}
        self.env = os.environ.pop("MA_VIEWER_WEB_DIR", None)

    def tearDown(self):
        for k, v in self.saved.items():
            if v is None:
                if hasattr(sys, k):
                    delattr(sys, k)
            else:
                setattr(sys, k, v)
        if self.env is not None:
            os.environ["MA_VIEWER_WEB_DIR"] = self.env
        self.tmp.cleanup()

    def make_web(self, *parts):
        d = os.path.join(self.tmp.name, *parts)
        os.makedirs(d)
        for f in self.res.WEB_FILES:
            open(os.path.join(d, f), "w").close()
        return d

    def freeze(self):
        sys.frozen = True
        sys._MEIPASS = self.tmp.name

    def test_meipass_layouts(self):
        self.freeze()
        d = self.make_web("web")                     # --add-data "ma_viewer/web;web" の場合
        self.assertEqual(os.path.normcase(self.res.web_dir()), os.path.normcase(d))
        d2 = self.make_web("ma_viewer", "web")       # spec と同じ配置が優先
        self.assertEqual(os.path.normcase(self.res.web_dir()), os.path.normcase(d2))

    def test_env_override(self):
        d = self.make_web("custom")
        os.environ["MA_VIEWER_WEB_DIR"] = d
        try:
            self.assertEqual(os.path.normcase(self.res.web_dir()), os.path.normcase(d))
        finally:
            del os.environ["MA_VIEWER_WEB_DIR"]

    def test_not_found_message(self):
        self.freeze()
        os.environ["MA_VIEWER_WEB_DIR"] = os.path.join(self.tmp.name, "nowhere")
        try:
            # パッケージ内の web は存在するので、それより前の候補だけを確認する
            cands = self.res.web_dir_candidates()
            self.assertEqual(os.path.normcase(cands[0]), os.path.normcase(os.path.join(self.tmp.name, "nowhere")))
            self.assertIn(os.path.normcase(os.path.join(self.tmp.name, "ma_viewer", "web")), [os.path.normcase(c) for c in cands])
        finally:
            del os.environ["MA_VIEWER_WEB_DIR"]
        # すべての候補に無い場合のメッセージ
        orig = self.res.web_dir_candidates
        self.res.web_dir_candidates = lambda: [os.path.join(self.tmp.name, "a"), os.path.join(self.tmp.name, "b")]
        try:
            with self.assertRaises(FileNotFoundError) as cm:
                self.res.web_dir()
            msg = str(cm.exception)
            self.assertIn("探した場所", msg)
            self.assertIn("--add-data", msg)
        finally:
            self.res.web_dir_candidates = orig


class TestTextureSiblingSearch(unittest.TestCase):
    """4 番目の検索: シーンと同じフォルダにあるフォルダの中から探し、シーン名に近いフォルダを選ぶ"""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.d = self.tmp.name
        for rel in ("chr_b/tex/body_D.tga", "chr_a_textures/v2/body_D.tga", "common/a/b/c/d/deep_D.tga",
                    "zz_other/only_D.tga", ".hidden/body_D.tga"):
            p = os.path.join(self.d, *rel.split("/"))
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, "wb").close()

    def tearDown(self):
        self.tmp.cleanup()

    def test_prefers_folder_close_to_scene_name(self):
        r = TextureResolver(os.path.join(self.d, "chr_a.ma"))
        found, tried = r.resolve("D:/old/pc/body_D.tga")
        self.assertTrue(found.replace("\\", "/").endswith("chr_a_textures/v2/body_D.tga"))
        self.assertTrue(tried[-1].endswith("*/**/body_D.tga"))
        self.assertIn("2 個見つかった", r.notes["D:/old/pc/body_D.tga"])
        r2 = TextureResolver(os.path.join(self.d, "chr_b.ma"))
        self.assertTrue(r2.resolve("D:/old/pc/body_D.tga")[0].replace("\\", "/").endswith("chr_b/tex/body_D.tga"))

    def test_single_hit_and_limits(self):
        r = TextureResolver(os.path.join(self.d, "chr_a.ma"))
        found, _ = r.resolve("X:/a/ONLY_d.tga")                  # 大文字・小文字は区別しない
        self.assertTrue(found.replace("\\", "/").endswith("zz_other/only_D.tga"))
        self.assertNotIn("X:/a/ONLY_d.tga", r.notes)             # 1 つだけなら補足なし
        self.assertIsNone(r.resolve("X:/deep_D.tga")[0])         # 深さ 5 は探さない
        self.assertIsNone(r.resolve("X:/none_D.tga")[0])

    def test_earlier_rules_win(self):
        open(os.path.join(self.d, "body_D.tga"), "wb").close()    # .ma と同じフォルダにあれば 3 で見つかる
        found, tried = TextureResolver(os.path.join(self.d, "chr_a.ma")).resolve("D:/old/body_D.tga")
        self.assertEqual(os.path.dirname(found), os.path.abspath(self.d))
        self.assertFalse(any("*" in t for t in tried))


class TestZeroWeights(unittest.TestCase):
    def test_zero_sum_vertex_keeps_listed_influences(self):
        text = """
createNode transform -n "g";
createNode mesh -n "gShape" -p "g";
createNode mesh -n "gShapeOrig" -p "g";
\tsetAttr ".io" yes;
\tsetAttr ".vt[0:2]" 0 0 0 1 0 0 0 1 0;
\tsetAttr ".ed[0:2]" 0 1 0 1 2 0 2 0 0;
\tsetAttr ".fc[0]" -type "polyFaces" f 3 0 1 2;
createNode joint -n "j0";
createNode joint -n "j1";
createNode skinCluster -n "sc";
\tsetAttr ".wl[0:2].w" 2 0 0.5 1 0 1 1 0 2 0 0 1 0;
\tsetAttr ".wd" 1;
connectAttr "j0.wm" "sc.ma[0]";
connectAttr "j1.wm" "sc.ma[1]";
connectAttr "gShapeOrig.w" "sc.ip[0].ig";
connectAttr "sc.og[0]" "gShape.i";
"""
        sk = scene_to_dict(parse_ma_text(text))["meshes"][0]["skin"]
        # 頂点 0: 0 の値は捨てる / 頂点 1: 合計 0 → 記録のある j1 を値 0 で残す / 頂点 2: 両方を値 0 で残す
        self.assertEqual(sk["counts"], [1, 1, 2])
        self.assertEqual(sk["indices"], [0, 1, 0, 1])
        self.assertEqual(sk["weights"], [0.5, 0.0, 0.0, 0.0])
        self.assertEqual(sk["weightDistribution"], 1)
