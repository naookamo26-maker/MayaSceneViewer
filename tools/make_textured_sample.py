# -*- coding: utf-8 -*-
"""テクスチャ検証用のサンプル（Maya プロジェクト形式）を生成する。

  python tools/make_textured_sample.py   → samples/textured_project/

  textured_project/
  ├─ workspace.mel
  ├─ scenes/textured_sample.ma
  ├─ scenes/leaf_A.tga              （.ma と同じフォルダで見つかる）
  └─ sourceimages/
     ├─ props/quad_D.tga            （プロジェクトからの相対パスで見つかる）
     └─ tex/box_D.tga               （存在しない絶対パスから、sourceimages/tex/ で見つかる）

メッシュ:
  * quad_geo  … +Z 向きの板。四隅の色が違うテクスチャ（向きの確認用）
  * leaf_geo  … アルファ付きテクスチャ（aiStandardSurface の opacity に接続 → 透過）。
                 UV セットを 2 つ持ち、uvChooser で 2 つ目を指定
  * box_geo   … 面ごとに 2 つのマテリアル（片方はテクスチャが見つからない）。
                 面ごとに別の UV（頂点の分割が必要）で、2 本のジョイントにスキニング
  * plain_geo … 既定のマテリアル（initialShadingGroup）
  * hist_geo  … スキン付きで面ごとに 2 マテリアル。Maya と同じく、面の一覧はメッシュではなく
                 デフォーマ経路上の groupParts（.ic）にあり、groupId でメッシュと結びつく
  * uvset_geo … 現在の UV セット（cuvs）には面ごとの UV がなく、map1 にだけある
"""
from __future__ import annotations

import math
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
sys.path.insert(0, HERE)

from ma_viewer import mathutil as M  # noqa: E402
from make_sample_ma import edges_and_faces, fmt, fmts  # noqa: E402

OUT = os.path.join(ROOT, "samples", "textured_project")

QUAD_COLORS = {"tl": (230, 40, 40), "tr": (40, 200, 60), "bl": (40, 70, 230), "br": (240, 240, 240)}


# ---------------------------------------------------------------------------
# TGA
# ---------------------------------------------------------------------------

def write_tga(path, w, h, pixel, bpp=24, origin="bl", rle=False):
    """pixel(x, y) → (r, g, b, a)。y は画像の上からの行。"""
    rows = range(h) if origin == "tl" else range(h - 1, -1, -1)
    nb = bpp // 8

    def px(x, y):
        r, g, b, a = pixel(x, y)
        return bytes((b, g, r, a))[:nb]

    body = bytearray()
    for y in rows:
        line = [px(x, y) for x in range(w)]
        if not rle:
            body += b"".join(line)
            continue
        i = 0
        while i < w:
            run = 1
            while i + run < w and run < 128 and line[i + run] == line[i]:
                run += 1
            if run > 1:
                body += bytes((0x80 | (run - 1),)) + line[i]
                i += run
            else:
                j = i
                while j < w and j - i < 128 and (j + 1 >= w or line[j + 1] != line[j]):
                    j += 1
                j = max(j, i + 1)
                body += bytes((j - i - 1,)) + b"".join(line[i:j])
                i = j
    desc = (8 if bpp == 32 else 0) | (0x20 if origin == "tl" else 0)
    header = struct.pack("<BBBHHBHHHHBB", 0, 0, 10 if rle else 2, 0, 0, 0, 0, 0, w, h, bpp, desc)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(header + bytes(body))


def quad_pixel(w, h):
    def f(x, y):
        if x % 16 == 0 or y % 16 == 0:
            return (20, 20, 20, 255)
        key = ("t" if y < h // 2 else "b") + ("l" if x < w // 2 else "r")
        r, g, b = QUAD_COLORS[key]
        return (r, g, b, 255)
    return f


def box_pixel(x, y):
    c = ((x // 16) + (y // 16)) % 2
    return (210, 150, 60, 255) if c else (120, 70, 30, 255)


def leaf_pixel(w, h):
    def f(x, y):
        dx, dy = (x + 0.5) / w - 0.5, (y + 0.5) / h - 0.5
        inside = dx * dx * 1.6 + dy * dy < 0.2
        return (90, 190, 70, 255 if inside else 0)
    return f


# ---------------------------------------------------------------------------
# .ma の書き出し
# ---------------------------------------------------------------------------

def write_mesh(L, pos, faces, uvsets, current="map1", groups=None, orig=False):
    """uvsets: [(名前, [(u,v),...], 面ごとの UV 番号リスト)]"""
    A = L.append
    if orig:
        A('\tsetAttr ".io" yes;')
    for k, (name, uvs, _fu) in enumerate(uvsets):
        A('\tsetAttr ".uvst[%d].uvsn" -type "string" "%s";' % (k, name))
        A('\tsetAttr -s %d ".uvst[%d].uvsp[0:%d]" -type "float2" %s;'
          % (len(uvs), k, len(uvs) - 1, fmts([c for uv in uvs for c in uv])))
    A('\tsetAttr ".cuvs" -type "string" "%s";' % current)
    if groups:
        A('\tsetAttr -s %d ".iog[0].og";' % len(groups))
        for gi, comp in enumerate(groups):
            A('\tsetAttr ".iog[0].og[%d].gcl" -type "componentList" 1 "%s";' % (gi, comp))
    A('\tsetAttr ".vir" yes;')
    A('\tsetAttr ".vif" yes;')
    A('\tsetAttr -s %d ".vt[0:%d]"  %s;' % (len(pos), len(pos) - 1, fmts([c for p in pos for c in p])))
    edges, fe = edges_and_faces(faces)
    A('\tsetAttr -s %d ".ed[0:%d]"  %s;' % (len(edges), len(edges) - 1, " ".join("%d %d 0" % e for e in edges)))
    body = []
    for fi, f in enumerate(fe):
        body.append("f %d %s" % (len(f), " ".join(map(str, f))))
        for k, (_n, _uvs, fu) in enumerate(uvsets):
            body.append("mu %d %d %s" % (k, len(fu[fi]), " ".join(map(str, fu[fi]))))
    A('\tsetAttr -s %d -ch %d ".fc[0:%d]" -type "polyFaces" \n\t\t%s;'
      % (len(fe), sum(map(len, fe)), len(fe) - 1, "\n\t\t".join(body)))


def material(L, conns, mtype, name, color_attr, color, tex_file=None, alpha_to=None):
    A = L.append
    A('createNode %s -n "%s";' % (mtype, name))
    A('\tsetAttr ".%s" -type "float3" %s ;' % (color_attr, fmts(color)))
    A('createNode shadingEngine -n "%sSG";' % name)
    A('\tsetAttr ".ihi" 0;')
    A('\tsetAttr ".ro" yes;')
    out_attr = "out" if mtype.startswith("ai") else "oc"
    conns.append('connectAttr "%s.%s" "%sSG.ss";' % (name, out_attr, name))
    if tex_file:
        fnode, ftn = tex_file
        A('createNode file -n "%s";' % fnode)
        A('\tsetAttr ".ftn" -type "string" "%s";' % ftn)
        A('\tsetAttr ".cs" -type "string" "sRGB";')
        A('createNode place2dTexture -n "%s_place";' % fnode)
        conns.append('connectAttr "%s_place.o" "%s.uv";' % (fnode, fnode))
        conns.append('connectAttr "%s_place.ofs" "%s.fs";' % (fnode, fnode))
        conns.append('connectAttr "%s.oc" "%s.%s";' % (fnode, name, color_attr))
        conns.append('connectAttr ":defaultColorMgtGlobals.cme" "%s.cme";' % fnode)
        if alpha_to:
            conns.append('connectAttr "%s.ot" "%s.%s";' % (fnode, name, alpha_to))


def main():
    os.makedirs(os.path.join(OUT, "scenes"), exist_ok=True)
    with open(os.path.join(OUT, "workspace.mel"), "w", encoding="utf-8") as f:
        f.write('//Maya 2024 Project Definition\n\nworkspace -fr "scene" "scenes";\n'
                'workspace -fr "sourceImages" "sourceimages";\nworkspace -fr "images" "images";\n')
    write_tga(os.path.join(OUT, "sourceimages", "props", "quad_D.tga"), 64, 64, quad_pixel(64, 64),
              bpp=24, origin="bl", rle=True)
    write_tga(os.path.join(OUT, "sourceimages", "tex", "box_D.tga"), 64, 64, box_pixel, bpp=24, origin="tl")
    write_tga(os.path.join(OUT, "scenes", "leaf_A.tga"), 64, 64, leaf_pixel(64, 64), bpp=32, origin="tl", rle=True)

    L = []
    C = []
    A = L.append
    A("//Maya ASCII 2024 scene")
    A("//Name: textured_sample.ma")
    A("//Codeset: UTF-8")
    A('requires maya "2024";')
    A('requires -nodeType "aiStandardSurface" "mtoa" "5.3.0";')
    A("currentUnit -l centimeter -a degree -t film;")
    A('fileInfo "application" "maya";')

    # --- 四隅の色の板（向きの確認） --------------------------------------
    quad = [(-1, -1, 0), (1, -1, 0), (1, 1, 0), (-1, 1, 0)]
    A('createNode transform -n "quad_geo";')
    A('\tsetAttr ".t" -type "double3" -3 1.2 0 ;')
    A('createNode mesh -n "quad_geoShape" -p "quad_geo";')
    write_mesh(L, quad, [[0, 1, 2, 3]], [("map1", [(0, 0), (1, 0), (1, 1), (0, 1)], [[0, 1, 2, 3]])])
    material(L, C, "lambert", "quad_mat", "c", (0.2, 0.3, 0.4), ("quad_file", "sourceimages/props/quad_D.tga"))
    C.append('connectAttr "quad_geoShape.iog" "quad_matSG.dsm" -na;')

    # --- アルファで切り抜く葉（UV セット 2 つ、uvChooser で 2 つ目） ------------------
    A('createNode transform -n "leaf_geo";')
    A('\tsetAttr ".t" -type "double3" 0 1.2 0 ;')
    A('createNode mesh -n "leaf_geoShape" -p "leaf_geo";')
    write_mesh(L, quad, [[0, 1, 2, 3]],
               [("map1", [(0.25, 0.25), (0.75, 0.25), (0.75, 0.75), (0.25, 0.75)], [[0, 1, 2, 3]]),
                ("leafUV", [(0, 0), (1, 0), (1, 1), (0, 1)], [[0, 1, 2, 3]])])
    material(L, C, "aiStandardSurface", "leaf_mat", "baseColor", (0.8, 0.8, 0.8),
             ("leaf_file", "Z:/assets/plants/leaf_A.tga"), alpha_to="opacity")
    A('createNode uvChooser -n "leaf_uvChooser";')
    C.append('connectAttr "leaf_geoShape.uvst[1].uvsn" "leaf_uvChooser.uvs[0]";')
    C.append('connectAttr "leaf_uvChooser.ouv" "leaf_file_place.uv";')
    C.append('connectAttr "leaf_geoShape.iog" "leaf_matSG.dsm" -na;')

    # --- 面ごとに 2 マテリアル・面ごとの UV・スキン付きの箱 ----------------------------
    h = 0.6
    bpos = [(-h, 0, h), (h, 0, h), (-h, 2 * h, h), (h, 2 * h, h),
            (-h, 2 * h, -h), (h, 2 * h, -h), (-h, 0, -h), (h, 0, -h)]
    bfaces = [[0, 1, 3, 2], [2, 3, 5, 4], [4, 5, 7, 6], [6, 7, 1, 0], [1, 7, 5, 3], [6, 0, 2, 4]]
    buvs = []
    bfu = []
    for fi in range(6):
        base = len(buvs)
        buvs += [(0, 0), (1, 0), (1, 1), (0, 1)]
        bfu.append([base, base + 1, base + 2, base + 3])
    A('createNode transform -n "box_geo";')
    A('\tsetAttr ".t" -type "double3" 3 0 0 ;')
    A('createNode mesh -n "box_geoShape" -p "box_geo";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr -s 2 ".iog[0].og";')
    A('\tsetAttr ".iog[0].og[0].gcl" -type "componentList" 1 "f[0:2]";')
    A('\tsetAttr ".iog[0].og[1].gcl" -type "componentList" 1 "f[3:5]";')
    A('\tsetAttr ".vir" yes;')
    A('createNode mesh -n "box_geoShapeOrig" -p "box_geo";')
    write_mesh(L, bpos, bfaces, [("map1", buvs, bfu)], orig=True)
    material(L, C, "lambert", "box_matA", "c", (0.5, 0.5, 0.5), ("box_file", "C:/old_pc/work/chr/tex/box_D.tga"))
    material(L, C, "lambert", "box_matB", "c", (0.25, 0.55, 0.65), ("missing_file", "C:/nowhere/missing_D.tga"))
    C.append('connectAttr "box_geoShape.iog.og[0]" "box_matASG.dsm" -na;')
    C.append('connectAttr "box_geoShape.iog.og[1]" "box_matBSG.dsm" -na;')

    # ジョイント 2 本（下と上）。上側をバインド後に回転させておく
    j_bind = {"box_root": M.translate((3, 0, 0)), "box_top": M.translate((3, 2 * h, 0))}
    A('createNode joint -n "box_root";')
    A('\tsetAttr ".t" -type "double3" 3 0 0 ;')
    A('createNode joint -n "box_top" -p "box_root";')
    A('\tsetAttr ".t" -type "double3" 0 %s 0 ;' % fmt(2 * h))
    A('\tsetAttr ".r" -type "double3" 0 0 25 ;')
    A('createNode skinCluster -n "box_skin";')
    A('\tsetAttr -s 8 ".wl";')
    rows = []
    for (x, y, z) in bpos:
        t = y / (2 * h)
        rows.append("2 0 %s 1 %s" % (fmt(1 - t), fmt(t)) if 0 < t < 1 else ("1 0 1" if t == 0 else "1 1 1"))
    A('\tsetAttr ".wl[0:7].w"\n\t\t%s;' % "\n\t\t".join(rows))
    A('\tsetAttr -s 2 ".pm";')
    A('\tsetAttr ".pm[0]" -type "matrix" %s;' % fmts(M.inverse(j_bind["box_root"])))
    A('\tsetAttr ".pm[1]" -type "matrix" %s;' % fmts(M.inverse(j_bind["box_top"])))
    A('\tsetAttr ".gm" -type "matrix" %s;' % fmts(M.translate((3, 0, 0))))
    C.append('connectAttr "box_root.wm" "box_skin.ma[0]";')
    C.append('connectAttr "box_top.wm" "box_skin.ma[1]";')
    C.append('connectAttr "box_root.s" "box_top.is";')
    C.append('connectAttr "box_geoShapeOrig.w" "box_skin.ip[0].ig";')
    C.append('connectAttr "box_skin.og[0]" "box_geoShape.i";')

    # --- 既定のマテリアル ------------------------------------------------------
    A('createNode transform -n "plain_geo";')
    A('\tsetAttr ".t" -type "double3" 0 -1.5 0 ;')
    A('createNode mesh -n "plain_geoShape" -p "plain_geo";')
    write_mesh(L, quad, [[0, 1, 2, 3]], [("map1", [(0, 0), (1, 0), (1, 1), (0, 1)], [[0, 1, 2, 3]])])
    C.append('connectAttr "plain_geoShape.iog" ":initialShadingGroup.dsm" -na;')

    # --- スキン付き・面ごとの割り当てが groupParts にあるメッシュ（Maya がヒストリ付きで書く形） --------
    A('createNode transform -n "hist_geo";')
    A('\tsetAttr ".t" -type "double3" 6 0 0 ;')
    A('createNode mesh -n "hist_geoShape" -p "hist_geo";')
    A('\tsetAttr -k off ".v";')
    A('\tsetAttr -s 2 ".iog[0].og";')          # 面の一覧（.gcl）はメッシュに書かれない
    A('\tsetAttr ".vir" yes;')
    A('createNode mesh -n "hist_geoShapeOrig" -p "hist_geo";')
    write_mesh(L, bpos, bfaces, [("map1", buvs, bfu)], orig=True)
    A('createNode joint -n "hist_root";')
    A('\tsetAttr ".t" -type "double3" 6 0 0 ;')
    A('\tsetAttr ".bps" -type "matrix" %s;' % fmts(M.translate((6, 0, 0))))
    A('createNode skinCluster -n "hist_skin";')
    A('\tsetAttr ".wl[0:7].w"\n\t\t%s;' % "\n\t\t".join(["1 0 1"] * 8))
    A('\tsetAttr ".pm[0]" -type "matrix" %s;' % fmts(M.translate((-6, 0, 0))))
    A('\tsetAttr ".gm" -type "matrix" %s;' % fmts(M.translate((6, 0, 0))))
    for gi, comp in ((0, "f[0:2]"), (1, "f[3:5]")):
        A('createNode groupId -n "hist_groupId%d";' % gi)
        A('\tsetAttr ".ihi" 0;')
        A('createNode groupParts -n "hist_groupParts%d";' % gi)
        A('\tsetAttr ".ihi" 0;')
        A('\tsetAttr ".ic" -type "componentList" 1 "%s";' % comp)
    A('createNode groupId -n "hist_skinGroupId";')
    A('createNode groupParts -n "hist_skinGroupParts";')
    A('\tsetAttr ".ic" -type "componentList" 1 "vtx[*]";')
    # Orig → groupParts0 → groupParts1 → skinGroupParts → skinCluster → 変形後シェイプ
    C.append('connectAttr "hist_geoShapeOrig.w" "hist_groupParts0.ig";')
    C.append('connectAttr "hist_groupId0.id" "hist_groupParts0.gi";')
    C.append('connectAttr "hist_groupParts0.og" "hist_groupParts1.ig";')
    C.append('connectAttr "hist_groupId1.id" "hist_groupParts1.gi";')
    C.append('connectAttr "hist_groupParts1.og" "hist_skinGroupParts.ig";')
    C.append('connectAttr "hist_skinGroupId.id" "hist_skinGroupParts.gi";')
    C.append('connectAttr "hist_skinGroupParts.og" "hist_skin.ip[0].ig";')
    C.append('connectAttr "hist_skinGroupId.id" "hist_skin.ip[0].gi";')
    C.append('connectAttr "hist_skin.og[0]" "hist_geoShape.i";')
    C.append('connectAttr "hist_root.wm" "hist_skin.ma[0]";')
    C.append('connectAttr "hist_groupId0.id" "hist_geoShape.iog.og[0].gid";')
    C.append('connectAttr "hist_groupId1.id" "hist_geoShape.iog.og[1].gid";')
    C.append('connectAttr "box_matASG.mwc" "hist_geoShape.iog.og[0].gco";')
    C.append('connectAttr "quad_matSG.mwc" "hist_geoShape.iog.og[1].gco";')
    C.append('connectAttr "hist_geoShape.iog.og[0]" "box_matASG.dsm" -na;')
    C.append('connectAttr "hist_geoShape.iog.og[1]" "quad_matSG.dsm" -na;')
    C.append('connectAttr "hist_groupId0.msg" "box_matASG.gn" -na;')
    C.append('connectAttr "hist_groupId1.msg" "quad_matSG.gn" -na;')

    # --- 現在の UV セットに面ごとの UV がないメッシュ ------------------------------------
    A('createNode transform -n "uvset_geo";')
    A('\tsetAttr ".t" -type "double3" 3 -1.5 0 ;')
    A('createNode mesh -n "uvset_geoShape" -p "uvset_geo";')
    A('\tsetAttr ".uvst[1].uvsn" -type "string" "emptySet";')
    A('\tsetAttr ".uvst[1].uvsp[0:3]" -type "float2" 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5;')   # 座標はあるが面との対応（mu）がない
    write_mesh(L, quad, [[0, 1, 2, 3]], [("map1", [(0, 0), (1, 0), (1, 1), (0, 1)], [[0, 1, 2, 3]])],
               current="emptySet")
    C.append('connectAttr "uvset_geoShape.iog" "quad_matSG.dsm" -na;')

    # --- PBR・ノーマルマップ・UDIM ------------------------------------------------------
    pbr = os.path.join(OUT, "sourceimages", "pbr")
    write_tga(os.path.join(pbr, "pbr_base.tga"), 64, 64, lambda x, y: (200, 120 + y, 60, 255), bpp=24)
    # ORM: R = AO（左が明るい）、G = ラフネス（上 230 / 下 30）、B = メタリック（左 0 / 右 255）
    write_tga(os.path.join(pbr, "pbr_orm.tga"), 64, 64,
              lambda x, y: (255 - x * 3, 230 if y < 32 else 30, 0 if x < 32 else 255, 255), bpp=24, rle=True)
    # 法線マップ: 8px ごとに +X / -X に傾いた縞
    write_tga(os.path.join(pbr, "pbr_normal.tga"), 64, 64,
              lambda x, y: ((220, 128, 180, 255) if (x // 8) % 2 == 0 else (36, 128, 180, 255)), bpp=24)
    write_tga(os.path.join(pbr, "pbr_emissive.tga"), 64, 64,
              lambda x, y: ((40, 240, 255, 255) if (x - 32) ** 2 + (y - 32) ** 2 < 100 else (0, 0, 0, 255)), bpp=24)
    udim = os.path.join(OUT, "sourceimages", "udim")
    write_tga(os.path.join(udim, "tile.1001.tga"), 32, 32, lambda x, y: (230, 60, 60, 255), bpp=24)
    write_tga(os.path.join(udim, "tile.1002.tga"), 32, 32, lambda x, y: (60, 90, 230, 255), bpp=24)

    def file_node(name, path, cs="sRGB", extra=()):
        A('createNode file -n "%s";' % name)
        A('\tsetAttr ".ftn" -type "string" "%s";' % path)
        A('\tsetAttr ".cs" -type "string" "%s";' % cs)
        for e in extra:
            A(e)
        A('createNode place2dTexture -n "%s_place";' % name)
        C.append('connectAttr "%s_place.o" "%s.uv";' % (name, name))

    def plane(name, t, uv_scale=1.0):
        A('createNode transform -n "%s";' % name)
        A('\tsetAttr ".t" -type "double3" %s ;' % fmts(t))
        A('createNode mesh -n "%sShape" -p "%s";' % (name, name))
        write_mesh(L, quad, [[0, 1, 2, 3]],
                   [("map1", [(0, 0), (uv_scale, 0), (uv_scale, 1), (0, 1)], [[0, 1, 2, 3]])])

    # aiStandardSurface（ベースカラー・ORM の G/B・エミッシブ・aiNormalMap 経由の法線）
    plane("pbr_geo", (-3, -1.5, 0))
    A('createNode aiStandardSurface -n "pbr_mat";')
    A('\tsetAttr ".specularRoughness" 0.4;')
    A('\tsetAttr ".emission" 1;')
    A('createNode shadingEngine -n "pbr_matSG";')
    file_node("pbr_base_file", "sourceimages/pbr/pbr_base.tga")
    file_node("pbr_orm_file", "sourceimages/pbr/pbr_orm.tga", cs="Raw")
    file_node("pbr_emit_file", "sourceimages/pbr/pbr_emissive.tga")
    file_node("pbr_normal_file", "sourceimages/pbr/pbr_normal.tga", cs="Raw")
    A('createNode aiNormalMap -n "pbr_aiNormalMap";')
    C.append('connectAttr "pbr_mat.out" "pbr_matSG.ss";')
    C.append('connectAttr "pbr_base_file.oc" "pbr_mat.baseColor";')
    C.append('connectAttr "pbr_orm_file.ocg" "pbr_mat.specularRoughness";')
    C.append('connectAttr "pbr_orm_file.ocb" "pbr_mat.metalness";')
    C.append('connectAttr "pbr_emit_file.oc" "pbr_mat.emissionColor";')
    C.append('connectAttr "pbr_normal_file.oc" "pbr_aiNormalMap.input";')
    C.append('connectAttr "pbr_aiNormalMap.outValue" "pbr_mat.normalCamera";')
    C.append('connectAttr "pbr_geoShape.iog" "pbr_matSG.dsm" -na;')

    # StingrayPBS（カラー・法線・ラフネス・AO のスロット）
    plane("sting_geo", (-6, 1.2, 0))
    A('createNode StingrayPBS -n "sting_mat";')
    A('createNode shadingEngine -n "sting_matSG";')
    C.append('connectAttr "sting_mat.oc" "sting_matSG.ss";')
    C.append('connectAttr "pbr_base_file.oc" "sting_mat.TEX_color_map";')
    C.append('connectAttr "pbr_normal_file.oc" "sting_mat.TEX_normal_map";')
    C.append('connectAttr "pbr_orm_file.oc" "sting_mat.TEX_roughness_map";')
    C.append('connectAttr "pbr_orm_file.oc" "sting_mat.TEX_ao_map";')
    C.append('connectAttr "sting_geoShape.iog" "sting_matSG.dsm" -na;')

    # lambert + bump2d（Maya 標準の法線マップ指定: bumpInterp = 1）
    plane("nrm_geo", (-6, -1.5, 0))
    A('createNode lambert -n "nrm_mat";')
    A('\tsetAttr ".c" -type "float3" 0.6 0.6 0.6 ;')
    A('createNode shadingEngine -n "nrm_matSG";')
    A('createNode bump2d -n "nrm_bump";')
    A('\tsetAttr ".bi" 1;')
    C.append('connectAttr "nrm_mat.oc" "nrm_matSG.ss";')
    C.append('connectAttr "pbr_normal_file.oa" "nrm_bump.bv";')
    C.append('connectAttr "nrm_bump.o" "nrm_mat.n";')
    C.append('connectAttr "nrm_geoShape.iog" "nrm_matSG.dsm" -na;')

    # UDIM（タイル番号入りのファイル名 + uvTilingMode = 3）。2 タイルにまたがる板
    A('createNode transform -n "udim_geo";')
    A('\tsetAttr ".t" -type "double3" 0 3.6 0 ;')
    A('createNode mesh -n "udim_geoShape" -p "udim_geo";')
    write_mesh(L, [(-2, -1, 0), (0, -1, 0), (0, 1, 0), (-2, 1, 0), (2, -1, 0), (2, 1, 0)],
               [[0, 1, 2, 3], [1, 4, 5, 2]],
               [("map1", [(0, 0), (1, 0), (1, 1), (0, 1), (1.0001, 0), (2, 0), (2, 1), (1.0001, 1)],
                 [[0, 1, 2, 3], [4, 5, 6, 7]])])
    A('createNode lambert -n "udim_mat";')
    A('createNode shadingEngine -n "udim_matSG";')
    file_node("udim_file", "sourceimages/udim/tile.1001.tga", extra=('\tsetAttr ".uvt" 3;',))
    C.append('connectAttr "udim_mat.oc" "udim_matSG.ss";')
    C.append('connectAttr "udim_file.oc" "udim_mat.c";')
    C.append('connectAttr "udim_geoShape.iog" "udim_matSG.dsm" -na;')

    A('select -ne :initialShadingGroup;')
    A('\tsetAttr -s 2 ".dsm";')
    text = "\n".join(L + C) + "\n// End of textured_sample.ma\n"
    with open(os.path.join(OUT, "scenes", "textured_sample.ma"), "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("生成しました: %s" % os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
