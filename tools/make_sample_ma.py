# -*- coding: utf-8 -*-
"""検証用サンプル .ma と期待値 JSON を生成する。

  python tools/make_sample_ma.py            → samples/sample_arm.ma, samples/sample_arm.expected.json

内容:
  * 円柱の腕メッシュ（両端は 12 角形の面）を 5 本のジョイントでスキニング
    - Orig シェイプ（中間オブジェクト）に形状、変形後シェイプは形状なし
    - Orig → groupParts → tweak → groupParts → skinCluster → 変形後シェイプ
    - インフルエンス論理番号に欠番あり（ma[2] なし）
    - ウェイトは疎形式と密形式を混在、一部の頂点は 5 インフルエンス
    - .pt と tweak による頂点オフセット
    - バインド後にポーズを変更（jointOrient・回転順・スケール補正を含む）
  * ピボット・シアー・回転順を持つ箱（スキンなし）
  * 非表示メッシュ、ヒストリが残ったメッシュ（警告対象）
  * ; や // を含む文字列を持つ script ノード
"""
from __future__ import annotations

import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from ma_viewer import mathutil as M  # noqa: E402

D2R = math.pi / 180.0


def fmt(v):
    s = "%.9g" % v
    return "0" if s == "-0" else s


def fmts(vals):
    return " ".join(fmt(v) for v in vals)


# ---------------------------------------------------------------------------
# ジオメトリ
# ---------------------------------------------------------------------------

def cylinder(segments=12, rings=25, length=12.0, radius=1.0):
    pos = []
    for r in range(rings):
        x = length * r / (rings - 1)
        for j in range(segments):
            th = 2 * math.pi * j / segments
            pos.append((x, radius * math.cos(th), radius * math.sin(th)))
    faces = []
    for r in range(rings - 1):
        for j in range(segments):
            v0 = r * segments + j
            v1 = r * segments + (j + 1) % segments
            v2 = (r + 1) * segments + (j + 1) % segments
            v3 = (r + 1) * segments + j
            faces.append([v0, v1, v2, v3])
    faces.append([j for j in reversed(range(segments))])                      # x=0 側（-X 向き）
    faces.append([(rings - 1) * segments + j for j in range(segments)])       # 先端（+X 向き）
    return pos, faces


def cube(size=1.0):
    h = size / 2
    pos = [(-h, -h, h), (h, -h, h), (-h, h, h), (h, h, h),
           (-h, h, -h), (h, h, -h), (-h, -h, -h), (h, -h, -h)]
    faces = [[0, 1, 3, 2], [2, 3, 5, 4], [4, 5, 7, 6], [6, 7, 1, 0], [1, 7, 5, 3], [6, 0, 2, 4]]
    return pos, faces


def edges_and_faces(faces):
    """頂点リストの面 → Maya 形式（辺リストと、辺番号による面）。"""
    edge_index = {}
    edges = []
    face_edges = []
    for f in faces:
        fe = []
        for k in range(len(f)):
            a, b = f[k], f[(k + 1) % len(f)]
            key = (min(a, b), max(a, b))
            if key not in edge_index:
                edge_index[key] = len(edges)
                edges.append((a, b))
            e = edge_index[key]
            fe.append(e if edges[e] == (a, b) else -e - 1)
        face_edges.append(fe)
    return edges, face_edges


def write_mesh_data(lines, pos, faces, pt=None, with_uv=True, chunk=40, smooth=None):
    """smooth(a, b) → 辺 a-b がスムーズなら True（省略時はすべてハード。.ed の 3 つ目の値は 1 = スムーズ）"""
    n = len(pos)
    edges, fe = edges_and_faces(faces)
    if with_uv:
        lines.append('\tsetAttr ".uvst[0].uvsn" -type "string" "map1";')
        lines.append('\tsetAttr -s %d ".uvst[0].uvsp[0:%d]" -type "float2" %s;'
                     % (n, n - 1, fmts([c for i in range(n) for c in ((i % 7) / 7.0, (i // 7) / 50.0)])))
        lines.append('\tsetAttr ".cuvs" -type "string" "map1";')
    lines.append('\tsetAttr ".vir" yes;')
    lines.append('\tsetAttr ".vif" yes;')
    if pt:
        for i, off in pt.items():
            lines.append('\tsetAttr ".pt[%d]" -type "float3" %s ;' % (i, fmts(off)))
    lines.append('\tsetAttr -s %d ".vt";' % n)
    for a in range(0, n, chunk):
        b = min(n, a + chunk) - 1
        body = "\n\t\t ".join(fmts(pos[i]) for i in range(a, b + 1))
        lines.append('\tsetAttr ".vt[%d:%d]"  %s;' % (a, b, body))
    ne = len(edges)
    lines.append('\tsetAttr -s %d ".ed";' % ne)
    for a in range(0, ne, chunk * 2):
        b = min(ne, a + chunk * 2) - 1
        body = "\n\t\t ".join("%d %d %d" % (edges[i] + (1 if smooth and smooth(*edges[i]) else 0,))
                                 for i in range(a, b + 1))
        lines.append('\tsetAttr ".ed[%d:%d]"  %s;' % (a, b, body))
    nf = len(fe)
    body = []
    for fi, f in enumerate(fe):
        body.append("f %d %s" % (len(f), " ".join(str(e) for e in f)))
        if with_uv:
            body.append("mu 0 %d %s" % (len(f), " ".join(str(v) for v in faces[fi])))
    lines.append('\tsetAttr -s %d -ch %d ".fc[0:%d]" -type "polyFaces" \n\t\t%s;'
                 % (nf, sum(len(f) for f in fe), nf - 1, "\n\t\t".join(body)))
    lines.append('\tsetAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;')


# ---------------------------------------------------------------------------

JOINTS = [
    # name, parent, t, jo, ro, bind r, posed r, posed s
    ("shoulder", "rig_grp", (0, 5, 0), (90, 0, 0), 0, (0, 0, 0), (0, 0, 20), (1, 1, 1)),
    ("elbow", "shoulder", (6, 0, 0), (0, 0, 0), 0, (0, 0, 0), (0, -45, 0), (1, 1, 1)),
    ("forearm_twist", "elbow", (3, 0, 0), (0, 0, 0), 0, (0, 0, 0), (60, 0, 0), (1, 1.1, 1.1)),
    ("wrist", "forearm_twist", (3, 0, 0), (0, 0, 15), 1, (0, 0, -15), (30, 10, -15), (1, 1, 1)),
    ("wrist_end", "wrist", (1, 0, 0), (0, 0, 0), 0, (0, 0, 0), (0, 0, 0), (1, 1, 1)),
]
INFLUENCE_LOGICAL = {"shoulder": 0, "elbow": 1, "forearm_twist": 3, "wrist": 4, "wrist_end": 5}
MESH_T = (0, 5, 0)


def joint_worlds(posed: bool):
    worlds = {"rig_grp": M.identity()}
    scales = {}
    for name, parent, t, jo, ro, br, pr, ps in JOINTS:
        r = pr if posed else br
        s = ps if posed else (1, 1, 1)
        ips = scales.get(parent)
        loc = M.joint_matrix(t=t, r=[x * D2R for x in r], s=s, ro=M.ROTATE_ORDERS[ro],
                             jo=[x * D2R for x in jo], inverse_parent_scale=ips)
        worlds[name] = M.mul(loc, worlds[parent])
        scales[name] = s
    return worlds


def arm_weights(pos):
    """x 方向の区分線形補間 + 一部頂点に 5 インフルエンス。キーは論理番号。"""
    centers = [("shoulder", 0.0), ("elbow", 6.0), ("forearm_twist", 9.0), ("wrist", 12.0)]
    out = []
    for i, (x, y, z) in enumerate(pos):
        if abs(x - 6.0) < 1e-6:
            d = {"elbow": 0.9, "shoulder": 0.04, "forearm_twist": 0.03, "wrist": 0.02, "wrist_end": 0.01}
        elif x <= 3.0:
            d = {"shoulder": 1.0}
        else:
            d = {}
            for k in range(len(centers) - 1):
                (n0, c0), (n1, c1) = centers[k], centers[k + 1]
                if k == 0:
                    c0 = 3.0
                if c0 <= x <= c1:
                    a = (x - c0) / (c1 - c0)
                    d = {n0: round(1 - a, 6), n1: round(a, 6)}
                    break
        out.append({INFLUENCE_LOGICAL[k]: v for k, v in d.items() if v > 0})
    return out


def main():
    lines = []
    A = lines.append
    A("//Maya ASCII 2024 scene")
    A("//Name: sample_arm.ma")
    A("//Last modified: Tue, Oct 20, 2026 10:00:00 AM")
    A("//Codeset: UTF-8")
    A('requires maya "2024";')
    A('requires "stereoCamera" "10.0";')
    A("currentUnit -l centimeter -a degree -t film;")
    A('fileInfo "application" "maya";')
    A('fileInfo "product" "Maya 2024";')
    A('fileInfo "version" "2024";')
    A('fileInfo "cutIdentifier" "202302170737-4500172811";')
    A('fileInfo "osv" "Windows 11 Pro v2009 (Build: 22631)";')
    A('fileInfo "UUID" "0A1B2C3D-0000-0000-0000-000000000000";')
    A('createNode transform -s -n "persp";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000001";')
    A('\tsetAttr ".v" no;')
    A('\tsetAttr ".t" -type "double3" 28 21 28 ;')
    A('\tsetAttr ".r" -type "double3" -27.938352729602379 44.999999999999972 -5.172681101354183e-14 ;')
    A('createNode camera -s -n "perspShape" -p "persp";')
    A('\tsetAttr -k off ".v" no;')
    A('\tsetAttr ".fl" 34.999999999999993;')

    # --- 腕メッシュ ---------------------------------------------------------
    pos, faces = cylinder()
    n = len(pos)
    pt = {0: (0.0, 0.1, 0.0)}
    tweak_off = {1: (0.0, 0.0, 0.1)}
    A('createNode transform -n "arm_geo";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000010";')
    A('\tsetAttr ".t" -type "double3" %s ;' % fmts(MESH_T))
    A('createNode mesh -n "arm_geoShape" -p "arm_geo";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000011";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr -s 4 ".iog[0].og";')
    A('\tsetAttr ".vir" yes;')
    A('\tsetAttr ".vif" yes;')
    A('\tsetAttr ".uvst[0].uvsn" -type "string" "map1";')
    A('\tsetAttr ".cuvs" -type "string" "map1";')
    A('\tsetAttr ".dcc" -type "string" "Ambient+Diffuse";')
    A('createNode mesh -n "arm_geoShapeOrig" -p "arm_geo";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000012";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr ".io" yes;')
    segs = 12
    last_ring = len(pos) // segs - 1
    ring = lambda v: v // segs  # noqa: E731
    # 端面との境目（同じリング上の辺で、そのリングが端）だけハード
    write_mesh_data(lines, pos, faces, pt=pt,
                    smooth=lambda a, b: not (ring(a) == ring(b) and ring(a) in (0, last_ring)))

    # --- ジョイント ----------------------------------------------------------
    A('createNode transform -n "rig_grp";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000020";')
    worlds_bind = joint_worlds(False)
    for name, parent, t, jo, ro, br, pr, ps in JOINTS:
        A('createNode joint -n "%s" -p "%s";' % (name, parent))
        A('\trename -uid "AAAA0000-0000-0000-0000-0000000001%02d";' % len(name))
        A('\taddAttr -ci true -sn "liw" -ln "lockInfluenceWeights" -min 0 -max 1 -at "bool";')
        A('\tsetAttr ".uoc" 1;')
        if name == "wrist_end":
            A('\tsetAttr "%s.translate" -type "double3" %s ;' % (name, fmts(t)))  # 長い名前の形式
        else:
            A('\tsetAttr ".t" -type "double3" %s ;' % fmts(t))
        if ro:
            A('\tsetAttr ".ro" %d;' % ro)
        if any(pr):
            A('\tsetAttr ".r" -type "double3" %s ;' % fmts(pr))
        if ps != (1, 1, 1):
            A('\tsetAttr ".s" -type "double3" %s ;' % fmts(ps))
        A('\tsetAttr ".mnrl" -type "double3" -360 -360 -360 ;')
        A('\tsetAttr ".mxrl" -type "double3" 360 360 360 ;')
        A('\tsetAttr ".jo" -type "double3" %s ;' % fmts(jo))
        A('\tsetAttr ".bps" -type "matrix" %s;' % fmts(worlds_bind[name]))
        A('\tsetAttr ".radi" 0.5;')

    # --- 箱（ピボット・シアー・回転順） --------------------------------------
    A('createNode transform -n "props_grp";')
    A('\tsetAttr ".t" -type "double3" 0 0 -6 ;')
    A('\tsetAttr ".r" -type "double3" 0 30 0 ;')
    A('\tsetAttr ".ro" 2;')
    A('createNode transform -n "box" -p "props_grp";')
    A('\tsetAttr ".t" -type "double3" 3 1 0 ;')
    A('\tsetAttr ".r" -type "double3" 10 0 45 ;')
    A('\tsetAttr ".s" -type "double3" 2 1 1 ;')
    A('\tsetAttr ".sh" -type "double3" 0.2 0 0 ;')
    A('\tsetAttr ".rp" -type "double3" 1 0 0 ;')
    A('\tsetAttr ".sp" -type "double3" 0.5 0 0 ;')
    A('\tsetAttr ".spt" -type "double3" 0.5 0 0 ;')
    A('createNode mesh -n "boxShape" -p "box";')
    A('\tsetAttr -k off ".v";')
    cpos, cfaces = cube()
    write_mesh_data(lines, cpos, cfaces, with_uv=False)

    # --- 非表示メッシュ ----------------------------------------------------------
    A('createNode transform -n "hidden_geo";')
    A('\tsetAttr ".v" no;')
    A('\tsetAttr ".t" -type "double3" -4 1 0 ;')
    A('createNode mesh -n "hidden_geoShape" -p "hidden_geo";')
    A('\tsetAttr -k off ".v";')
    write_mesh_data(lines, cpos, cfaces, with_uv=False)

    # --- ヒストリが残ったメッシュ（形状データなし） ---------------------------------
    A('createNode transform -n "history_geo";')
    A('\tsetAttr ".t" -type "double3" 0 0 6 ;')
    A('createNode mesh -n "history_geoShape" -p "history_geo";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr ".vir" yes;')

    # --- DG ノード ------------------------------------------------------------
    A('createNode lightLinker -s -n "lightLinker1";')
    A('\tsetAttr -s 2 ".lnk";')
    A('createNode script -n "uiConfigurationScriptNode";')
    A('\tsetAttr ".b" -type "string" ("// Maya Mel UI Configuration File.\\n// x; y //\\n"'
      '\n\t\t+ "if (`panel -q -exists $p`) {; print \\"a;b\\"; }\\n");')
    A('\tsetAttr ".st" 3;')
    A('createNode polySphere -n "polySphere1";')
    A('\tsetAttr ".sa" 12;')
    A('createNode skinCluster -n "skinCluster1";')
    A('\trename -uid "AAAA0000-0000-0000-0000-000000000030";')
    wts = arm_weights(pos)
    A('\tsetAttr -s %d ".wl";' % n)
    dense_vertex = 7
    blocks = [(0, dense_vertex - 1), (dense_vertex + 1, n - 1)]
    for a0, b0 in blocks:
        for a in range(a0, b0 + 1, 60):
            b = min(b0, a + 59)
            rows = []
            for v in range(a, b + 1):
                items = sorted(wts[v].items())
                rows.append("%d %s" % (len(items), " ".join("%d %s" % (k, fmt(w)) for k, w in items)))
            A('\tsetAttr ".wl[%d:%d].w"\n\t\t%s;' % (a, b, "\n\t\t".join(rows)))
    items = sorted(wts[dense_vertex].items())
    ks = [k for k, _ in items]
    if ks == list(range(ks[0], ks[-1] + 1)):
        A('\tsetAttr -s %d ".wl[%d].w[%d:%d]"  %s;' % (len(ks), dense_vertex, ks[0], ks[-1],
                                                      fmts([w for _, w in items])))
    else:
        for k, w in items:
            A('\tsetAttr ".wl[%d].w[%d]" %s;' % (dense_vertex, k, fmt(w)))
    A('\tsetAttr -s %d ".pm";' % len(INFLUENCE_LOGICAL))
    for name, li in INFLUENCE_LOGICAL.items():
        A('\tsetAttr ".pm[%d]" -type "matrix" %s;' % (li, fmts(M.inverse(worlds_bind[name]))))
    gm = M.translate(MESH_T)
    A('\tsetAttr ".gm" -type "matrix" %s;' % fmts(gm))
    A('\tsetAttr -s %d ".ma";' % len(INFLUENCE_LOGICAL))
    A('\tsetAttr -s %d ".dpf[0:%d]"  4 4 4 4 4 4;' % (6, 5))
    A('\tsetAttr ".mi" 5;')
    A('\tsetAttr ".ucm" yes;')
    A('\tsetAttr -s %d ".ifcl";' % len(INFLUENCE_LOGICAL))
    A('createNode tweak -n "tweak1";')
    for i, off in tweak_off.items():
        A('\tsetAttr ".vl[0].vt[%d]" -type "float3" %s ;' % (i, fmts(off)))
    A('createNode objectSet -n "skinCluster1Set";')
    A('\tsetAttr ".ihi" 0;')
    A('\tsetAttr ".vo" yes;')
    A('createNode groupId -n "skinCluster1GroupId";')
    A('createNode groupParts -n "skinCluster1GroupParts";')
    A('\tsetAttr ".ic" -type "componentList" 1 "vtx[*]";')
    A('createNode groupParts -n "groupParts2";')
    A('\tsetAttr ".ic" -type "componentList" 1 "vtx[*]";')
    A('createNode dagPose -n "bindPose1";')
    A('\tsetAttr -s 6 ".wm";')
    A('\tsetAttr ".bp" yes;')
    A('select -ne :time1;')
    A('\tsetAttr ".o" 1;')
    A('\tsetAttr ".unw" 1;')
    A('select -ne :hardwareRenderingGlobals;')
    A('\tsetAttr ".t" -type "double3" 9 9 9 ;')
    A('select -ne :renderPartition;')
    A('\tsetAttr -s 2 ".st";')

    # --- 接続 ---------------------------------------------------------------
    A('connectAttr "skinCluster1GroupId.id" "arm_geoShape.iog.og[0].gid";')
    A('connectAttr "skinCluster1Set.mwc" "arm_geoShape.iog.og[0].gco";')
    A('connectAttr "skinCluster1.og[0]" "arm_geoShape.i";')
    for name, li in INFLUENCE_LOGICAL.items():
        A('connectAttr "%s.wm" "skinCluster1.ma[%d]";' % (name, li))
        A('connectAttr "%s.liw" "skinCluster1.lw[%d]";' % (name, li))
        A('connectAttr "%s.obcc" "skinCluster1.ifcl[%d]";' % (name, li))
    for name, parent, *_ in JOINTS:
        if parent != "rig_grp":
            A('connectAttr "%s.s" "%s.is";' % (parent, name))
    A('connectAttr "skinCluster1GroupParts.og" "skinCluster1.ip[0].ig";')
    A('connectAttr "skinCluster1GroupId.id" "skinCluster1.ip[0].gi";')
    A('connectAttr "bindPose1.msg" "skinCluster1.bp";')
    A('connectAttr "tweak1.og[0]" "skinCluster1GroupParts.ig";')
    A('connectAttr "groupParts2.og" "tweak1.ip[0].ig";')
    A('connectAttr "arm_geoShapeOrig.w" "groupParts2.ig";')
    A('connectAttr "polySphere1.out" "history_geoShape.i";')
    A('connectAttr "skinCluster1GroupId.msg" "skinCluster1Set.gn" -na;')
    A('relationship "link" ":lightLinker1" ":initialShadingGroup.message" ":defaultLightSet.message";')
    A('connectAttr "arm_geoShape.iog" ":initialShadingGroup.dsm" -na;')
    A('connectAttr "boxShape.iog" ":initialShadingGroup.dsm" -na;')
    A("// End of sample_arm.ma")
    text = "\n".join(lines) + "\n"

    out_dir = os.path.join(ROOT, "samples")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "sample_arm.ma"), "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

    # --- 期待値 --------------------------------------------------------------
    bind_local = [list(p) for p in pos]
    for i, off in pt.items():
        bind_local[i] = [a + b for a, b in zip(bind_local[i], off)]
    for i, off in tweak_off.items():
        bind_local[i] = [a + b for a, b in zip(bind_local[i], off)]
    worlds_posed = joint_worlds(True)
    mesh_world = M.translate(MESH_T)
    gm_inv = M.inverse(gm)
    name_of = {li: nm for nm, li in INFLUENCE_LOGICAL.items()}
    skin_m = {li: M.mul(M.inverse(worlds_bind[nm]), worlds_posed[nm]) for li, nm in name_of.items()}

    def deform(p, w):
        pw = M.transform_point(p, gm)
        acc = [0.0, 0.0, 0.0]
        for li, wt in w.items():
            q = M.transform_point(pw, skin_m[li])
            acc = [a + wt * b for a, b in zip(acc, q)]
        local = M.transform_point(acc, gm_inv)
        return M.transform_point(local, mesh_world)

    exact = []
    top4 = []
    for p, w in zip(bind_local, wts):
        exact.append(deform(p, w))
        items = sorted(w.items(), key=lambda kv: -kv[1])[:4]
        s = sum(v for _, v in items)
        top4.append(deform(p, {k: v / s for k, v in items}))

    expected = {
        "jointWorldPosed": {k: v for k, v in worlds_posed.items() if k != "rig_grp"},
        "jointWorldBind": {k: v for k, v in worlds_bind.items() if k != "rig_grp"},
        "armBindPositions": bind_local,
        "armDeformedWorld": exact,
        "armDeformedWorldTop4": top4,
        "armWeights": [{str(k): v for k, v in w.items()} for w in wts],
        "influenceLogical": INFLUENCE_LOGICAL,
        "armFaceCount": len(faces),
        "armVertexCount": n,
    }
    with open(os.path.join(out_dir, "sample_arm.expected.json"), "w", encoding="utf-8") as f:
        json.dump(expected, f, indent=1)
    print("生成しました: samples/sample_arm.ma（%d 行）" % len(text.splitlines()))


if __name__ == "__main__":
    main()
