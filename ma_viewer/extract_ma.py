# -*- coding: utf-8 -*-
""".ma（MaScene）→ 共通 JSON（maya-scene-lite）。

主な処理:
  * transform / joint のローカル行列とワールド行列の計算
  * メッシュの面（辺番号）→ 頂点番号への変換
  * 変形後シェイプからデフォーマ経路をさかのぼり、元形状（〜Orig）と skinCluster を特定
  * skinCluster のウェイト・バインド行列をスロット番号付きの疎配列に変換
"""
from __future__ import annotations

import math
import os
import re
from typing import Dict, List, Optional, Tuple

from . import mathutil as M
from . import schema
from .ma_scene import (FAST, FlatFaces, MaNode, MaScene, ProgressFn, RawNumbers, _ranges, fast_numbers, np,
                       numpy_enabled, parse_component_list, parse_ma_file)
from . import ma_reader as R
from .materials import (ALPHA_OUTPUTS, OPACITY_ATTRS, OUTPUT_CHANNEL, SCALAR_ATTRS, TextureResolver, albedo_attrs,
                        default_color, map_attrs, texture_entry, texture_warnings, to_udim_pattern)

_OG_RE = re.compile(r"og\[(\d+)\]$")
_INFLUENCE_RE = re.compile(r"(?:ma|matrix)\[(\d+)\]$")


class _Ctx:
    def __init__(self, ms: MaScene):
        self.ms = ms
        self.ang = math.pi / 180.0 if ms.angular_unit == "deg" else 1.0
        self.local: Dict[int, List[float]] = {}
        self.world: Dict[int, List[float]] = {}

    def rad(self, v):
        return (v[0] * self.ang, v[1] * self.ang, v[2] * self.ang)

    def deg(self, v):
        """ファイルの角度単位 → 度（表示用）。"""
        k = self.ang * 180.0 / math.pi
        return [v[0] * k, v[1] * k, v[2] * k]

    # ------------------------------------------------------------------
    def local_matrix(self, n: MaNode) -> List[float]:
        m = self.local.get(id(n))
        if m is not None:
            return m
        ro_i = int(n.xattrs.get("ro", 0) or 0)
        ro = M.ROTATE_ORDERS[ro_i] if 0 <= ro_i < 6 else "xyz"
        if n.type == "joint":
            ips = None
            if n.flag("ssc", True):
                src = n.inputs.get("is")
                if src is not None:
                    ips = src[0].vec3("s")
            m = M.joint_matrix(t=n.vec3("t"), r=self.rad(n.vec3("r")), s=n.vec3("s"), ro=ro,
                               ra=self.rad(n.vec3("ra")), jo=self.rad(n.vec3("jo")),
                               inverse_parent_scale=ips)
        else:
            m = M.transform_matrix(t=n.vec3("t"), r=self.rad(n.vec3("r")), s=n.vec3("s"), ro=ro,
                                   ra=self.rad(n.vec3("ra")), rp=n.vec3("rp"), sp=n.vec3("sp"),
                                   rpt=n.vec3("rpt"), spt=n.vec3("spt"), sh=n.vec3("sh"))
        opm = n.xattrs.get("opm")
        if opm is not None and len(opm) == 16:
            m = M.mul(m, opm)               # offsetParentMatrix: ワールド行列 = ローカル · opm · 親
        self.local[id(n)] = m
        return m

    def world_matrix(self, n: MaNode) -> List[float]:
        m = self.world.get(id(n))
        if m is not None:
            return m
        loc = self.local_matrix(n)
        p = n.parent
        if p is not None and n.flag("it", True):
            m = M.mul(loc, self.world_matrix(p))
        else:
            m = loc
        self.world[id(n)] = m
        return m


def _visible_self(n: MaNode) -> bool:
    if not n.flag("v", True) or not n.flag("lodv", True):
        return False
    if n.flag("ove", False) and not n.flag("ovv", True):
        return False
    return not _hidden_by_layer(n)


def _hidden_by_layer(n: MaNode) -> bool:
    """ディスプレイレイヤー（.do ← displayLayer.di）が非表示か（レイヤーが無効なら影響しない）"""
    src = n.inputs.get("do")
    if src is None or src[0].type != "displayLayer" or src[0].raw is None:
        return False
    raw = src[0].raw
    if "e" in raw and raw["e"] and not R.to_bool(raw["e"][0]):
        return False
    return "v" in raw and bool(raw["v"]) and not R.to_bool(raw["v"][0])


def _visible_effective(n: Optional[MaNode]) -> bool:
    while n is not None:
        if not _visible_self(n):
            return False
        n = n.parent
    return True


# ---------------------------------------------------------------------------
# NURBS カーブ（コントローラーなど）
# ---------------------------------------------------------------------------

# Maya の色番号（描画のオーバーライド・ディスプレイレイヤーの color。0 は既定の色）
INDEX_COLORS = [
    None, (0, 0, 0), (0.25, 0.25, 0.25), (0.6, 0.6, 0.6), (0.608, 0, 0.157), (0, 0.016, 0.376), (0, 0, 1),
    (0, 0.275, 0.098), (0.149, 0, 0.263), (0.784, 0, 0.784), (0.541, 0.282, 0.2), (0.247, 0.137, 0.122),
    (0.6, 0.149, 0), (1, 0, 0), (0, 1, 0), (0, 0.255, 0.6), (1, 1, 1), (1, 1, 0), (0.392, 0.863, 1),
    (0.263, 1, 0.639), (1, 0.69, 0.69), (0.894, 0.675, 0.475), (1, 1, 0.388), (0, 0.6, 0.329),
    (0.631, 0.416, 0.188), (0.62, 0.631, 0.188), (0.408, 0.631, 0.188), (0.188, 0.631, 0.365),
    (0.188, 0.631, 0.631), (0.188, 0.404, 0.631), (0.435, 0.188, 0.631), (0.631, 0.188, 0.416),
]
_CURVE_DEFORM_INPUT = re.compile(r"^ip\[\d+\]\.ig$")


def _num(v, default=0.0) -> float:
    if isinstance(v, list):
        v = v[0] if v else default
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


def _shape_attrs(ms: MaScene, n: MaNode) -> dict:
    """属性を読み飛ばしたノード（カーブのシェイプ）の setAttr を、覚えておいた範囲から読む"""
    from .rig import parse_attrs
    return parse_attrs(ms.text, n)


def _layer_override(n: MaNode):
    """ディスプレイレイヤー（有効なもの）の (色, 表示の種類)。レイヤーがなければ None"""
    src = n.inputs.get("do")
    if src is None or src[0].type != "displayLayer" or src[0].raw is None:
        return None
    raw = src[0].raw

    def get(*keys):
        for k in keys:
            if raw.get(k):
                return raw[k]
        return None
    e = get("e")
    if e and not R.to_bool(e[0]):
        return None
    color = None
    rgbf, rgb = get("ovrgbf"), get("ovrgb", "crgb", "clr")
    if rgbf and R.to_bool(rgbf[0]) and rgb and len(rgb) >= 3:
        color = R.to_floats(rgb[:3])
    else:
        c = get("c")
        k = int(R.to_float(c[0])) if c else 0
        color = list(INDEX_COLORS[k]) if 0 < k < len(INDEX_COLORS) else None
    dt = get("dt")
    return color, int(R.to_float(dt[0])) if dt else 0


def _own_override(get):
    """描画のオーバーライド（ove が有効なもの）の (色, 表示の種類)。get(属性名) で値を読む"""
    if _num(get("ove")) < 0.5:
        return None
    if _num(get("ovrgbf")) >= 0.5 and isinstance(get("ovrgb"), list) and len(get("ovrgb")) >= 3:
        color = [float(x) for x in get("ovrgb")[:3]]
    else:
        k = int(_num(get("ovc")))
        color = list(INDEX_COLORS[k]) if 0 < k < len(INDEX_COLORS) else None
    return color, int(_num(get("ovdt")))


def curve_display(shape: MaNode, attrs: dict):
    """カーブの表示色と表示の種類（0 通常・1 テンプレート・2 リファレンス）。

    Maya と同じく、シェイプ → 親 transform → その祖先の順に、ディスプレイレイヤーか描画のオーバーライドを探す
    （レイヤーに入っているノードはレイヤーの設定、そうでなければ自分のオーバーライド）。
    """
    x: Optional[MaNode] = shape
    while x is not None:
        o = _layer_override(x)
        if o is None:
            o = _own_override(attrs.get if x is shape else (lambda k, x=x: x.xattrs.get(k)))
        if o is not None:
            return o
        x = x.parent
    return None, 0


def curve_shape_source(ms: MaScene, shape: MaNode, attrs: dict):
    """カーブの形（.cc の値）。保存されていなければ、変形の入力（create ← skinCluster など）をたどって元の形を使う"""
    cc = attrs.get("cc")
    if isinstance(cc, list) and len(cc) > 6:
        return cc, False
    seen = set()
    src = shape.inputs.get("cr")
    x = src[0] if src else None
    while x is not None and id(x) not in seen:
        seen.add(id(x))
        if x.type == "nurbsCurve":
            cc = _shape_attrs(ms, x).get("cc")
            if isinstance(cc, list) and len(cc) > 6:
                return cc, True
            nxt = x.inputs.get("cr")
        elif x.type == "groupParts":
            nxt = x.inputs.get("ig")
        else:
            keys = sorted(k for k in x.inputs if _CURVE_DEFORM_INPUT.match(k))
            nxt = x.inputs.get(keys[0]) if keys else None
        x = nxt[0] if nxt else None
    return None, False


def collect_curves(ms: MaScene) -> List[Tuple[MaNode, dict]]:
    """表示する nurbsCurve（中間オブジェクトを除く）と、その属性"""
    out = []
    for n in ms.nodes:
        if n.type != "nurbsCurve" or n.parent is None or n.span is None:
            continue
        a = _shape_attrs(ms, n)
        if _num(a.get("io")) >= 0.5:
            continue
        out.append((n, a))
    return out


def curve_entry(ms: MaScene, n: MaNode, a: dict, t_idx: int) -> Optional[dict]:
    cc, from_input = curve_shape_source(ms, n, a)
    if cc is None:
        ms.warn("%s: カーブの形（.cc）が見つからないため表示しません（ヒストリを削除して保存してください）" % n.name,
                key="#カーブの形なし", limit=10)
        return None
    if _num(cc[0]) < 1:
        return None
    visible_self = (_num(a.get("v"), 1) >= 0.5 and _num(a.get("lodv"), 1) >= 0.5
                    and not (_num(a.get("ove")) >= 0.5 and _num(a.get("ovv"), 1) < 0.5) and not _hidden_by_layer(n))
    color, display = curve_display(n, a)
    tweaks = []
    for k, v in a.items():
        m = re.match(r"^cp\[(\d+)\]$", k)
        if m and isinstance(v, list) and len(v) >= 3 and any(abs(x) > 0 for x in v[:3]):
            tweaks.append([int(m.group(1))] + [float(x) for x in v[:3]])
    entry = {
        "name": n.name,
        "path": n.path,
        "transform": t_idx,
        "visible": visible_self and _visible_effective(n.parent),
        "visibleSelf": visible_self,
        "cc": schema.round_list([float(x) for x in cc]),
        "color": schema.round_list(color) if color else None,
        "display": display,
    }
    if tweaks:
        entry["tweaks"] = sorted(tweaks)
    if from_input:
        entry["fromInput"] = True             # 変形前の形（アニメーションを読み込むと変形した形にする）
    return entry


# ---------------------------------------------------------------------------
# メッシュ
# ---------------------------------------------------------------------------

def _fast(key: str) -> None:
    FAST[key] = FAST.get(key, 0) + 1


def _materialize(chunks) -> None:
    """値の文字列のままの断片（RawNumbers）を数値のリストにする。すべての断片をつなげて一度に数値化し、
    要素数で切り分ける（要素数が合わなければ、断片ごとに従来の処理）。結果は chunks に書き戻す。"""
    raw = [i for i, (_s, v) in enumerate(chunks) if isinstance(v, RawNumbers)]
    if not raw:
        return
    as_int = chunks[raw[0]][1].as_int
    arr = fast_numbers(" ".join(chunks[i][1].text for i in raw), np.int64 if as_int else np.float64)
    if arr is not None and len(arr) == sum(chunks[i][1].count for i in raw):
        _fast("数値: 速い経路")
        off = 0
        for i in raw:
            c = chunks[i][1].count
            chunks[i] = (chunks[i][0], arr[off:off + c].tolist())
            off += c
        return
    _fast("数値: 従来の処理（要素数が合わない）" if arr is not None else "数値: 従来の処理（数値以外の記述）")
    for i in raw:
        vals = chunks[i][1].text.split()
        chunks[i] = (chunks[i][0], [int(R.to_float(v)) for v in vals] if as_int else R.to_floats(vals))


def _assemble_flat(chunks, stride: int) -> List[float]:
    """(開始番号, 値) のチャンク列を 1 本の配列にまとめる（後勝ち）。"""
    if not chunks:
        return []
    _materialize(chunks)
    n = 0
    for start, vals in chunks:
        n = max(n, start + len(vals) // stride)
    out = [0.0] * (n * stride)
    for start, vals in chunks:
        a = start * stride
        out[a:a + len(vals)] = vals
    return out


def _list_chunks(chunks):
    """面の定義の塊を従来の形（面ごとのリスト）にそろえる（numpy の経路を使わないとき）"""
    out = []
    for st, faces, uvs in chunks:
        if isinstance(faces, FlatFaces):
            faces, uvs = faces.to_lists()
        out.append((st, faces, uvs))
    return out


def _geometry_np(n: MaNode, ms: MaScene, md, edges, nv: int, uv_set: Optional[int], n_uv: int):
    """build_mesh_geometry の numpy の経路（面の定義がすべて FlatFaces のとき）。
    戻り値: (counts, indices, kept, UV 番号（角ごと）or None, UV のない面の数, 不正な面の数)"""
    chunks = sorted(md.fc, key=lambda c: c[0])
    counts = np.concatenate([c[1].counts for c in chunks])
    E = np.concatenate([c[1].edges for c in chunks])
    face_no = np.concatenate([st + np.arange(len(c), dtype=np.int64) for st, c, _u in chunks])
    ed = np.asarray(edges, dtype=np.float64).reshape(-1, 3).astype(np.int64)
    ne = len(ed)
    k = np.where(E >= 0, E, -E - 1)
    ok_e = k < ne
    kk = np.where(ok_e, k, 0)
    verts = np.where(E >= 0, ed[kk, 0], ed[kk, 1]) if ne else np.zeros(len(E), dtype=np.int64)
    starts = np.cumsum(counts) - counts
    nonempty = counts > 0
    face_ok = counts >= 3
    if len(E):
        # 面ごとに「すべての辺が範囲内」「頂点番号が頂点数未満」を調べる（空の面は reduceat に渡さない）
        idx = starts[nonempty]
        all_ok = np.zeros(len(counts), dtype=bool)
        all_ok[nonempty] = np.add.reduceat(ok_e.astype(np.int64), idx) == counts[nonempty]
        vmax = np.full(len(counts), nv, dtype=np.int64)
        vmax[nonempty] = np.maximum.reduceat(np.where(ok_e, verts, nv), idx)
        face_ok &= all_ok & (vmax < nv)
    corner_ok = np.repeat(face_ok, counts)
    out_counts = counts[face_ok]
    out_indices = verts[corner_ok]
    kept = face_no[face_ok]
    uv_idx, missing = None, 0
    if n_uv:
        uv_all = np.full(len(E), -1, dtype=np.int64)
        has_uv = np.zeros(len(counts), dtype=bool)
        base = 0
        for st, c, _u in chunks:
            nf = len(c)
            u = c.uv.get(uv_set)
            if u is not None:
                per, flat, offs = u
                cnt_c = c.counts
                ok = per == cnt_c
                sel = np.flatnonzero(ok)
                if len(sel):
                    dst = _ranges(starts[base + sel], cnt_c[sel])
                    src = _ranges(offs[sel], cnt_c[sel])
                    uv_all[dst] = flat[src]
                has_uv[base:base + nf] = ok
            base += nf
        uv_all[(uv_all < 0) | (uv_all >= n_uv)] = -1
        uv_idx = uv_all[corner_ok]
        missing = int((face_ok & ~has_uv).sum())
    return (out_counts.tolist(), out_indices.tolist(), kept.tolist(),
            None if uv_idx is None else uv_idx.tolist(), missing, int((~face_ok).sum()))


def build_mesh_geometry(n: MaNode, ms: MaScene, tweaks=None, uv_set: Optional[int] = None, uv_md=None):
    """MeshData → (positions, counts, indices, 残した面の元の番号, UV)。

    UV は {"set": 名前, "values": [u, v, ...], "indices": [面の頂点ごとの UV 番号 or -1]} か None。
    """
    md = n.mesh
    pos = _assemble_flat(md.vt, 3)
    nv = len(pos) // 3
    if md.pt:
        pt = _assemble_flat(md.pt, 3)
        for i in range(min(len(pt), len(pos))):
            pos[i] += pt[i]
    for chunks in (tweaks or []):
        off = _assemble_flat(chunks, 3)
        for i in range(min(len(off), len(pos))):
            pos[i] += off[i]
    edges = _assemble_flat(md.ed, 3)
    ne = len(edges) // 3
    if (uv_md is None and numpy_enabled() and md.fc
            and all(isinstance(c[1], FlatFaces) for c in md.fc)):
        uv_values = _assemble_flat(md.uvsp.get(uv_set, []), 2) if uv_set is not None else []
        n_uv = len(uv_values) // 2
        counts, indices, kept, uv_idx, missing, bad = _geometry_np(n, ms, md, edges, nv, uv_set, n_uv)
        return _finish_geometry(n, ms, md, md, pos, counts, indices, kept, uv_set, uv_values, uv_idx, missing,
                                bad, edges, ne)
    counts: List[int] = []
    indices: List[int] = []
    kept: List[int] = []
    umd = uv_md or md      # UV を読むシェイプ（通常は形状と同じ）
    uv_faces = {}
    if uv_md is not None:
        for st, faces_, uvs_ in _list_chunks(umd.fc):
            for fi_, x in enumerate((uvs_ or {}).get(uv_set, [])):
                uv_faces[st + fi_] = x
    uv_values = _assemble_flat(umd.uvsp.get(uv_set, []), 2) if uv_set is not None else []
    n_uv = len(uv_values) // 2
    uv_idx: List[int] = []
    uv_faces_missing = 0
    bad = 0
    face_no = -1
    for _start, faces, face_uvs in sorted(_list_chunks(md.fc), key=lambda c: c[0]):
        set_uvs = face_uvs.get(uv_set) if (uv_set is not None and face_uvs and uv_md is None) else None
        for fi, face in enumerate(faces):
            face_no = _start + fi
            verts = []
            ok = True
            for e in face:
                if e >= 0:
                    if e >= ne:
                        ok = False
                        break
                    verts.append(int(edges[e * 3]))
                else:
                    k = -e - 1
                    if k >= ne:
                        ok = False
                        break
                    verts.append(int(edges[k * 3 + 1]))
            if not ok or len(verts) < 3 or max(verts) >= nv:
                bad += 1
                continue
            counts.append(len(verts))
            indices.extend(verts)
            kept.append(face_no)
            if n_uv:
                if uv_md is not None:
                    fu = uv_faces.get(face_no)
                else:
                    fu = set_uvs[fi] if set_uvs is not None and fi < len(set_uvs) else None
                if fu is not None and len(fu) == len(verts):
                    uv_idx.extend(u if 0 <= u < n_uv else -1 for u in fu)
                else:
                    uv_faces_missing += 1
                    uv_idx.extend([-1] * len(verts))
    return _finish_geometry(n, ms, md, umd, pos, counts, indices, kept, uv_set, uv_values,
                            uv_idx if n_uv else None, uv_faces_missing, bad, edges, ne)


def _finish_geometry(n, ms, md, umd, pos, counts, indices, kept, uv_set, uv_values, uv_idx, uv_faces_missing,
                     bad, edges, ne):
    """build_mesh_geometry の後半（警告・UV・ハードエッジ）。従来の経路と numpy の経路で共通"""
    if bad:
        ms.warn("%s: 不正な面 %d 個を除外しました" % (n.name, bad))
    if md.holes:
        ms.warn("%s: 穴付きの面 %d 個は穴を無視して表示します" % (n.name, md.holes))
    uv = None
    if uv_idx is not None:
        uv = {"set": uv_set_name(umd, uv_set), "values": schema.round_list(uv_values),
              "indices": uv_idx}
        if uv_faces_missing:
            ms.warn("%s: UV のない面が %d 個あります" % (n.name, uv_faces_missing))
    # ハードエッジ: .ed の 3 つ目の値が 0（1 = スムーズ）の辺を、頂点の組で返す
    if numpy_enabled() and ne:
        e = np.asarray(edges, dtype=np.float64).reshape(-1, 3)
        hard = e[e[:, 2] == 0, :2].astype(np.int64).ravel().tolist()
    else:
        hard = []
        for i in range(ne):
            if not edges[i * 3 + 2]:
                hard.append(int(edges[i * 3]))
                hard.append(int(edges[i * 3 + 1]))
    return pos, counts, indices, kept, uv, hard


def uv_coverage(md, k: int) -> int:
    """UV セット k で、面との対応（polyFaces の mu）がある面の数"""
    total = 0
    for _st, faces, uvs in md.fc:
        if isinstance(faces, FlatFaces):
            total += faces.uv_coverage(k)
        else:
            total += sum(1 for x in (uvs or {}).get(k, []) if x is not None)
    return total


def choose_uv_set(md, preferred: Optional[int]) -> Optional[int]:
    """使う UV セット番号。指定 → 現在の UV セット → 最小の番号。

    ただし、座標はあっても面との対応がない UV セットは使えないので、
    その場合は対応のある面がいちばん多い UV セットを使う。
    """
    if not md.uvsp:
        return None
    cov = {k: uv_coverage(md, k) for k in md.uvsp}
    order = []
    if preferred is not None and preferred in md.uvsp:
        order.append(preferred)
    if md.cuvs:
        order += [k for k, name in md.uvsn.items() if name == md.cuvs and k in md.uvsp]
    order.append(min(md.uvsp))
    for k in order:
        if cov.get(k):
            return k
    best = max(cov, key=lambda k: cov[k])
    return best if cov[best] else order[0]


def uv_set_name(md, k: Optional[int]) -> str:
    return md.uvsn.get(k, "map%d" % (k + 1)) if k is not None else ""


_MEMBER_RE = re.compile(r"^m\[(\d+)\]$")
# 移動・回転・スケールなど、ノードの行列を決める属性（ここに接続があると .ma に値が残らない）
_CHANNEL_ATTRS = {"t", "tx", "ty", "tz", "r", "rx", "ry", "rz", "s", "sx", "sy", "sz", "jo", "jox", "joy", "joz",
                  "ra", "rax", "ray", "raz", "sh", "rp", "sp", "rpt", "spt", "ro", "opm"}
# アニメーションカーブで再生できる属性（animation.CHANNELS と同じ）
_CURVE_CHANNELS = {"tx", "ty", "tz", "rx", "ry", "rz", "sx", "sy", "sz"}
BIND_SOURCE_LABELS = {"pm": "skinCluster の .pm", "dagPose": "dagPose", "bps": "ジョイントの .bps"}


def _matrix_tokens(vals) -> Optional[List[float]]:
    """setAttr の値（"xform" 形式または 16 個の数値）→ 行列"""
    if not vals:
        return None
    try:
        if vals[0] == "xform":
            return M.xform_data_to_matrix([float(v) for v in vals[1:] if v not in ("yes", "no", "true", "false")])
        nums = [float(v) for v in vals[:16]]
        return nums if len(nums) == 16 else None
    except ValueError:
        return None


def _is_bind_pose(dp: MaNode, bp_sources) -> bool:
    """バインドポーズの dagPose か（.bp が yes、または skinCluster の .bp につながっている）"""
    vals = (dp.raw or {}).get("bp")
    if vals and vals[0] in ("yes", "true", "1", "on"):
        return True
    return id(dp) in bp_sources


_UVSN_RE = re.compile(r"uvst\[(\d+)\]\.uvsn$")
_IOG_RE = re.compile(r"^iog(?:\[(\d+)\])?(?:\.og\[(\d+)\])?$")


def _string_value(vals) -> str:
    """文字列属性の値（("a" + "b") の連結にも対応）"""
    return "".join(v for v in (vals or []) if v not in ("(", ")", "+"))


class _MaterialBuilder:
    """シェーディンググループ → マテリアル・テクスチャ（共通 JSON の materials / textures）"""

    def __init__(self, ms: MaScene):
        self.ms = ms
        self.resolver = TextureResolver(ms.source_path) if ms.source_path else TextureResolver("")
        self.materials: List[dict] = []
        self.textures: List[dict] = []
        self._mat_of: Dict[int, int] = {}
        self._tex_of: Dict[int, int] = {}
        self._file_of_mat: Dict[int, MaNode] = {}
        # メッシュ → [(メッシュ側の属性, シェーディンググループ)]
        self.members: Dict[int, List[Tuple[str, MaNode]]] = {}
        # groupId → それを使う groupParts（ヒストリ付きメッシュの面ごとの割り当て）
        self.parts_of_gid: Dict[int, List[MaNode]] = {}
        for src, sattr, dst, dattr in ms.connections:
            if dst.type == "shadingEngine" and dattr.split("[")[0] == "dsm":
                self.members.setdefault(id(src), []).append((sattr, dst))
            elif dst.type == "groupParts" and dattr == "gi" and src.type == "groupId":
                self.parts_of_gid.setdefault(id(src), []).append(dst)

    def group_faces(self, n: MaNode, k: int):
        """objectGroups[k] の面の一覧。メッシュの .gcl になければ、groupId → groupParts の .ic から探す。

        デフォーマ（skinCluster など）を持つメッシュでは、Maya は面の一覧をメッシュではなく
        デフォーマ経路上の groupParts に書き、groupId でメッシュと結びつける。
        """
        ranges = n.mesh.groups.get(k)
        if ranges:
            return ranges, "gcl"
        for key in ("iog.og[%d].gid" % k, "iog[0].og[%d].gid" % k):
            src = n.inputs.get(key)
            if src is None:
                continue
            for gp in self.parts_of_gid.get(id(src[0]), []):
                r = parse_component_list((gp.raw or {}).get("ic") or [], "f")
                if r:
                    return r, "groupParts"
        return None, None

    def texture_for(self, f: MaNode, used_by: str) -> int:
        if id(f) in self._tex_of:
            return self._tex_of[id(f)]
        raw_attrs = f.raw or {}
        raw = _string_value(raw_attrs.get("ftn"))
        if (raw_attrs.get("uvt") or [""])[0] == "3":       # uvTilingMode = UDIM（ファイル名はタイル番号入り）
            raw = to_udim_pattern(raw)
        entry = texture_entry(f.name, raw, self.resolver)
        for w in texture_warnings(entry, used_by):
            self.ms.warn(w)
        self._tex_of[id(f)] = len(self.textures)
        self.textures.append(entry)
        return self._tex_of[id(f)]

    def _map_source(self, shader: MaNode, kind: str, attrs) -> Optional[Tuple[MaNode, str]]:
        """マップの種類 kind の接続元 → (file ノード, チャンネル)。法線は bump2d・aiNormalMap 経由も。"""
        for a in attrs:
            src = shader.inputs.get(a)
            if src is None:
                continue
            node, sattr = src
            if node.type == "file":
                return node, OUTPUT_CHANNEL.get(sattr, "rgb")
            if kind == "normal" and node.type == "bump2d":
                interp = ((node.raw or {}).get("bi") or ["0"])[0]
                f = node.inputs.get("bv")
                if interp in ("1", "2") and f and f[0].type == "file":
                    return f[0], "rgb"           # Maya は bumpValue に outAlpha をつなぐが、法線は RGB から読む
                self.ms.warn("%s: 高さのバンプ（bump2d・%s）は未対応です。法線マップ（Tangent Space Normals）のみ表示します。"
                             % (shader.name, node.name), key="#高さのバンプ " + shader.name)
                return None
            if kind == "normal" and node.type == "aiNormalMap":
                # 属性名 input は短縮名 ip に正規化されている
                f = node.inputs.get("ip") or node.inputs.get("input") or node.inputs.get("i")
                if f and f[0].type == "file":
                    return f[0], "rgb"
            self.ms.warn("%s: %s に %s（%s）がつながっています。file ノードが直接つながっている場合のみ表示します。"
                         % (shader.name, a, node.name, node.type), key="#file 以外 %s %s" % (shader.name, kind))
            return None
        return None

    def material_for_sg(self, sg: MaNode) -> int:
        ss = sg.inputs.get("ss")
        if ss is None:
            return -1
        shader = ss[0]
        if id(shader) in self._mat_of:
            return self._mat_of[id(shader)]
        raw = shader.raw or {}
        color = list(default_color(shader.type))
        for a in albedo_attrs(shader.type):
            vals = raw.get(a)
            if vals and len(vals) >= 3:
                try:
                    color = [float(v) for v in vals[:3]]
                except ValueError:
                    pass
                break
        maps = {}
        base_file = None
        for kind, attrs in map_attrs(shader.type).items():
            src = self._map_source(shader, kind, attrs)
            if src is None:
                continue
            f, ch = src
            maps[kind] = {"texture": self.texture_for(f, shader.name), "channel": ch}
            if kind == "baseColor":
                base_file = f
        scalars = {}
        for kind, (names, default) in SCALAR_ATTRS.get(shader.type, {}).items():
            val = default
            for a in names:
                if raw.get(a):
                    try:
                        val = float(raw[a][0])
                    except ValueError:
                        pass
                    break
            scalars[kind] = val
        use_alpha = False
        if base_file is not None:
            for key, (src, sattr) in shader.inputs.items():
                if src is base_file and key.split("[")[0] in OPACITY_ATTRS and sattr in ALPHA_OUTPUTS:
                    use_alpha = True
                    break
        idx = len(self.materials)
        self._mat_of[id(shader)] = idx
        if base_file is not None:
            self._file_of_mat[idx] = base_file
        entry = {"name": shader.name, "type": shader.type, "shadingGroup": sg.name,
                 "color": schema.round_list(color), "texture": maps.get("baseColor", {}).get("texture", -1),
                 "useAlpha": use_alpha, "maps": maps}
        entry.update(scalars)
        self.materials.append(entry)
        return idx

    def preferred_uv_set(self, mat_idx: int, meshes) -> Optional[int]:
        """file ← place2dTexture ← uvChooser ← メッシュの uvst[k].uvsn なら k"""
        f = self._file_of_mat.get(mat_idx)
        if f is None:
            return None
        p = f.inputs.get("uv")
        if p is None:
            return None
        c = p[0].inputs.get("uv")
        if c is None or c[0].type != "uvChooser":
            return None
        for key, (src, sattr) in c[0].inputs.items():
            if key.startswith("uvs") and any(src is m for m in meshes):
                m = _UVSN_RE.match(sattr)
                if m:
                    return int(m.group(1))
        return None

    def face_materials(self, n: MaNode, n_faces: int) -> List[int]:
        """メッシュの元の面ごとのマテリアル番号（-1 は割り当てなし）"""
        out = [-1] * n_faces
        whole = []
        groups = []
        for sattr, sg in self.members.get(id(n), []):
            m = _IOG_RE.match(sattr)
            if not m or (m.group(1) not in (None, "0")):
                continue          # インスタンス 2 つ目以降は対象外
            mat = self.material_for_sg(sg)
            if m.group(2) is None:
                whole.append(mat)
            else:
                groups.append((int(m.group(2)), mat))
        for mat in whole:
            out = [mat] * n_faces
        for k, mat in groups:
            ranges, _how = self.group_faces(n, k)
            if ranges is None:
                name = self.materials[mat]["name"] if mat >= 0 else "?"
                self.ms.warn("%s: マテリアル %s を割り当てた面の一覧（objectGroups[%d]）が見つかりません。"
                             "この面は既定のマテリアルで表示します。" % (n.name, name, k))
                continue
            for a, b in ranges:
                b = n_faces - 1 if b < 0 else min(b, n_faces - 1)
                for fi in range(max(a, 0), b + 1):
                    out[fi] = mat
        return out


def trace_geometry_source(shape: MaNode) -> Tuple[Optional[MaNode], List[Tuple[MaNode, Optional[int]]], Optional[MaNode]]:
    """変形後シェイプの .inMesh からさかのぼる。

    戻り値: (元形状メッシュ or None, 経路上のデフォーマ [(node, geomIndex)], 途中で止まったノード)
    """
    src = shape.inputs.get("i")
    deformers: List[Tuple[MaNode, Optional[int]]] = []
    seen = set()
    while src is not None:
        node, sattr = src
        if id(node) in seen:
            return None, deformers, node
        seen.add(id(node))
        if node.type == "mesh":
            return node, deformers, None
        m = _OG_RE.match(sattr)
        if m:
            k = int(m.group(1))
            deformers.append((node, k))
            src = node.inputs.get("ip[%d].ig" % k)
        elif sattr == "og":
            deformers.append((node, None))
            src = node.inputs.get("ig")
        else:
            return None, deformers, node
    return None, deformers, None


# ---------------------------------------------------------------------------

# 直近の scene_to_dict の段階ごとの時間（秒）。読み込みの内訳をログに出すために使う
CONVERT_TIMING: Dict[str, float] = {}


class _Lap:
    """段階ごとの時間を CONVERT_TIMING に足し込む"""

    def __init__(self):
        import time
        self._now = time.perf_counter
        self.t = self._now()

    def __call__(self, key: str):
        t = self._now()
        CONVERT_TIMING[key] = CONVERT_TIMING.get(key, 0.0) + (t - self.t)
        self.t = t


def scene_to_dict(ms: MaScene, progress: ProgressFn = None) -> dict:
    CONVERT_TIMING.clear()
    lap = _Lap()
    ctx = _Ctx(ms)
    if ms.linear_unit != "cm":
        ms.warn("作業単位が %s です。値はファイルに書かれたまま表示します（cm 以外は未検証）。" % ms.linear_unit)
    if ms.angular_unit not in ("deg", "rad"):
        ms.warn("角度単位 %s は未対応です（度として扱います）。" % ms.angular_unit)
        ctx.ang = math.pi / 180.0
    for ref in ms.references:
        ms.warn("リファレンス「%s」は読み込みません（このファイル内のデータのみ表示）。" % ref,
                key="#リファレンス", limit=5)

    # --- メッシュと関連情報の収集 --------------------------------------
    mesh_entries = []
    used_influences: List[MaNode] = []
    for n in ms.nodes:
        if n.type != "mesh" or n.flag("io", False):
            continue
        if n.parent is None:
            ms.warn("%s: 親 transform のないメッシュは除外しました" % n.name)
            continue
        source = n
        deformers: List[Tuple[MaNode, Optional[int]]] = []
        if "i" in n.inputs:
            src_mesh, deformers, stopped = trace_geometry_source(n)
            if src_mesh is not None and src_mesh.mesh.has_topology():
                source = src_mesh
            elif n.mesh.has_topology():
                if stopped is not None:
                    ms.warn("%s: 入力側に %s（%s）があり、元形状を特定できません。保存時の形状を表示します。"
                            % (n.name, stopped.name, stopped.type))
                deformers = []
            else:
                what = "%s（%s）" % (stopped.name, stopped.type) if stopped else "入力"
                ms.warn("%s: 形状データがありません（%s から生成されています。ヒストリを削除して保存してください）"
                        % (n.name, what))
                continue
        elif not n.mesh.has_topology():
            ms.warn("%s: 形状データ（頂点・辺・面）がないため除外しました" % n.name)
            continue

        skin_node = None
        skin_geo_index = 0
        tweaks = []
        for dn, k in deformers:
            if dn.type == "skinCluster":
                if skin_node is None:
                    skin_node, skin_geo_index = dn, (k or 0)
                else:
                    ms.warn("%s: skinCluster が複数あります（%s のみ使用）" % (n.name, skin_node.name))
            elif dn.type == "tweak":
                tweaks.append(dn.tweak.get(k or 0, []))
            elif dn.type not in ("groupParts",):
                ms.warn("%s: デフォーマ %s（%s）の効果は反映しません" % (n.name, dn.name, dn.type),
                        key="#未対応のデフォーマ " + dn.name)
        mesh_entries.append((n, source, skin_node, skin_geo_index, tweaks))
        if skin_node is not None:
            for key, (src, _sattr) in skin_node.inputs.items():
                if _INFLUENCE_RE.match(key):
                    used_influences.append(src)

    if progress:
        progress(0.0, "ノード階層を構築中")

    lap("メッシュとデフォーマの検索")
    # --- 出力するノードの決定（メッシュ・ジョイント・インフルエンスとその祖先） --
    keep = set()

    def keep_chain(x: Optional[MaNode]):
        while x is not None and id(x) not in keep:
            keep.add(id(x))
            x = x.parent

    for n in ms.nodes:
        if n.type == "joint":
            keep_chain(n)
    for n, *_ in mesh_entries:
        keep_chain(n.parent)
    for inf in used_influences:
        if inf.is_shape:
            inf = inf.parent
        keep_chain(inf)
    # NURBS カーブ（コントローラーの形など）とその transform
    curve_shapes = collect_curves(ms)
    for n, _a in curve_shapes:
        keep_chain(n.parent)
    # リグ（コンストレイント・IK・計算ノード）の評価に必要なコントローラーなども出力する
    from .rig import discover
    graph_info = discover(ms, keep, [n for n, _a in curve_shapes])
    for n in list(graph_info.dag.values()):
        keep_chain(n)
    ms.graph_info = graph_info

    lap("出力するノードの決定")
    # --- バインドポーズ（.pm → dagPose → .bps の優先順）---------------------------
    bind_src: Dict[int, Tuple[List[float], str, str]] = {}   # id → (行列, "world" | "local", 情報源)
    for n, _source, skin_node, _gi, _tw in mesh_entries:
        if skin_node is None:
            continue
        for key, (src, _sattr) in skin_node.inputs.items():
            m = _INFLUENCE_RE.match(key)
            if not m:
                continue
            node = src.parent if src.is_shape else src
            pm = skin_node.skin.pm.get(int(m.group(1)))
            if pm is not None and id(node) not in bind_src:
                try:
                    bind_src[id(node)] = (M.inverse(pm), "world", "pm")
                except ValueError:
                    pass
    # 接続はつながり先ごとに 1 回だけ索引化する（dagPose ごとに全接続を走査すると、大きなリグで遅い）
    pose_inputs: Dict[int, list] = {}
    bp_sources = set()
    for c in ms.connections:
        if c[2].type == "dagPose":
            pose_inputs.setdefault(id(c[2]), []).append(c)
        elif c[3] == "bp" and c[2].type == "skinCluster":
            bp_sources.add(id(c[0]))
    for dp in ms.nodes:
        if dp.type != "dagPose" or dp.raw is None or not _is_bind_pose(dp, bp_sources):
            continue
        for src, sattr, dst, dattr in pose_inputs.get(id(dp), ()):
            mm = _MEMBER_RE.match(dattr)
            if not mm or id(src) in bind_src:
                continue
            i = int(mm.group(1))
            wm = _matrix_tokens(dp.raw.get("wm[%d]" % i))
            if wm:
                bind_src[id(src)] = (wm, "world", "dagPose")
                continue
            xm = _matrix_tokens(dp.raw.get("xm[%d]" % i))
            if xm:
                bind_src[id(src)] = (xm, "local", "dagPose")
    for n in ms.nodes:
        if n.type == "joint" and id(n) not in bind_src and "bps" in n.xattrs:
            bind_src[id(n)] = (n.xattrs["bps"], "world", "bps")

    # 接続で値が決まる（.ma に値が残っていない）属性
    driven: Dict[int, List[str]] = {}
    curve_driven = set()                # 接続元がすべてカーブか、評価できるノード（アニメーションで評価する）
    for n in ms.nodes:
        if id(n) not in keep or n.is_shape:
            continue
        by_curve = True
        for key, (src, sattr) in n.inputs.items():
            if key.split("[")[0].split(".")[0] in _CHANNEL_ATTRS:
                driven.setdefault(id(n), []).append("%s ← %s（%s）" % (key, src.name, src.type))
                by_curve = by_curve and key in _CURVE_CHANNELS and src.type in ("animCurveTL", "animCurveTA", "animCurveTU")
        if (by_curve or id(n) in graph_info.graph_driven) and id(n) in driven:
            curve_driven.add(id(n))     # アニメーションを読み込むと評価される（カーブ・コンストレイント・計算ノード）

    # バインド時のワールド行列（情報源のないノードはファイル上のローカル値のまま親についていく）
    bind_local: Dict[int, List[float]] = {}

    def bind_visit(x: MaNode, parent_world: List[float]):
        if id(x) not in keep or x.is_shape:
            return
        pw = parent_world if (x.parent is not None and x.flag("it", True)) else M.identity()
        b = bind_src.get(id(x))
        if b and b[1] == "world":
            W = b[0]
            bind_local[id(x)] = M.mul(W, M.inverse_or_identity(pw))
        elif b:
            W = M.mul(b[0], pw)
            bind_local[id(x)] = b[0]
        else:
            W = M.mul(ctx.local_matrix(x), pw)
        for c in x.children:
            bind_visit(c, W)

    for n in ms.nodes:
        if n.parent is None and n.is_dag:
            bind_visit(n, M.identity())

    # 「ファイルの値」でも、接続で値が決まるノードはバインドポーズの姿勢に置き換える
    node_of = {id(x): x for x in ms.nodes}
    for nid, chans in driven.items():
        node = node_of[nid]
        shown = "、".join(chans[:3]) + (" ほか" if len(chans) > 3 else "")
        if nid in bind_local:
            ctx.local[nid] = bind_local[nid]
        if nid in curve_driven:
            continue                    # アニメーションカーブで決まる（アニメーションを読み込むとその値で表示する）
        if nid in bind_local:
            ms.warn("%s: %s が接続で決まるため、ファイルに値がありません。バインドポーズ（%s）の姿勢で表示します。"
                    % (node.name, shown, BIND_SOURCE_LABELS[bind_src[nid][2]]), key="#接続で値が決まるノード", limit=20)
        else:
            ms.warn("%s: %s が接続で決まるため、ファイルに値がありません。バインドポーズの情報もないため、"
                    "既定値（移動 0・回転 0）で表示しています。" % (node.name, shown),
                    key="#接続で値が決まるノード", limit=20)
    ctx.world.clear()

    lap("バインドポーズ")
    out_nodes = []
    index_of: Dict[int, int] = {}

    def visit(x: MaNode, parent_idx: int):
        if id(x) not in keep or x.is_shape:
            return
        idx = len(out_nodes)
        index_of[id(x)] = idx
        ro_i = int(x.xattrs.get("ro", 0) or 0)
        attrs = {
            "t": list(x.vec3("t")),
            "r": ctx.deg(x.vec3("r")),
            "s": list(x.vec3("s")),
            "ro": M.ROTATE_ORDERS[ro_i] if 0 <= ro_i < 6 else "xyz",
        }
        if x.type == "joint":
            attrs["jo"] = ctx.deg(x.vec3("jo"))
        entry = {
            "name": x.name,
            "path": x.path,
            "type": x.type,
            "parent": parent_idx,
            "matrix": schema.matrix_list(ctx.local_matrix(x)),
            "worldMatrix": schema.matrix_list(ctx.world_matrix(x)),
            "inheritsTransform": x.flag("it", True),
            "visible": _visible_self(x),
            "attrs": {k: (schema.round_list(v) if isinstance(v, list) else v) for k, v in attrs.items()},
        }
        if x.type == "joint":
            entry["segmentScaleCompensate"] = x.flag("ssc", True)
        if id(x) in bind_local:
            entry["bindMatrix"] = schema.matrix_list(bind_local[id(x)])
            entry["bindSource"] = bind_src[id(x)][2]
        if id(x) in driven:
            entry["drivenBy"] = driven[id(x)]
        out_nodes.append(entry)
        for c in x.children:
            visit(c, idx)

    for n in ms.nodes:
        if n.parent is None and n.is_dag:
            visit(n, -1)

    lap("ノードの出力（行列）")
    # --- メッシュの出力 ---------------------------------------------------
    out_meshes = []
    mb = _MaterialBuilder(ms)
    total = max(len(mesh_entries), 1)
    for mi, (n, source, skin_node, geo_index, tweaks) in enumerate(mesh_entries):
        if progress:
            progress(mi / total, "メッシュを変換中: %s" % n.name)
        md = source.mesh
        n_faces_all = max((st + len(fs) for st, fs, _uv in md.fc), default=0)
        lap("メッシュ（その他）")
        mats_all = mb.face_materials(n, n_faces_all)
        lap("マテリアル")
        pref = None
        for mat in sorted(set(mats_all)):
            if mat >= 0:
                pref = mb.preferred_uv_set(mat, (n, source))
                if pref is not None:
                    break
        uv_set = choose_uv_set(md, pref)
        uv_md = None
        if (uv_set is None or not uv_coverage(md, uv_set)) and source is not n and n.mesh.has_topology():
            # 元形状に UV がなければ、変形後シェイプの UV を使う
            alt = choose_uv_set(n.mesh, pref)
            if alt is not None and uv_coverage(n.mesh, alt):
                uv_set, uv_md = alt, n.mesh
        umd = uv_md or md
        cur = [k for k, nm in umd.uvsn.items() if nm == umd.cuvs]
        if cur and uv_set is not None and uv_set not in cur and not uv_coverage(umd, cur[0]):
            ms.warn("%s: 現在の UV セット「%s」には面との対応がないため、「%s」を使います"
                    % (n.name, umd.cuvs, uv_set_name(umd, uv_set)))
        lap("メッシュ（その他）")
        pos, counts, indices, kept, uv, hard = build_mesh_geometry(source, ms, tweaks, uv_set, uv_md)
        lap("メッシュの形状")
        face_mats = [mats_all[f] if 0 <= f < len(mats_all) else -1 for f in kept]
        if uv is None and any(m >= 0 and mb.materials[m]["texture"] >= 0 for m in set(face_mats)):
            ms.warn("%s: テクスチャのあるマテリアルが割り当てられていますが、UV がありません" % n.name)
        if not counts:
            ms.warn("%s: 有効な面がないため除外しました" % n.name)
            continue
        t_idx = index_of.get(id(n.parent))
        if t_idx is None:
            continue
        entry = {
            "name": n.name,
            "path": n.path,
            "transform": t_idx,
            "visible": _visible_effective(n),
            "visibleSelf": _visible_self(n),
            "positions": schema.round_list(pos),
            "counts": counts,
            "indices": indices,
            "uv": uv,
            "hardEdges": hard,
            "material": face_mats[0] if face_mats and len(set(face_mats)) == 1 else -1,
            "faceMaterials": face_mats if len(set(face_mats)) > 1 else None,
            "skin": None,
        }
        if skin_node is not None:
            lap("メッシュ（その他）")
            entry["skin"] = _build_skin(ms, ctx, n, skin_node, len(pos) // 3, index_of)
            lap("スキン")
        out_meshes.append(entry)

    # --- カーブの出力 -----------------------------------------------------
    out_curves = []
    curve_out: Dict[int, int] = {}
    for n, a in curve_shapes:
        t_idx = index_of.get(id(n.parent))
        entry = curve_entry(ms, n, a, t_idx) if t_idx is not None else None
        if entry is not None:
            curve_out[id(n)] = len(out_curves)
            out_curves.append(entry)
    ms.curve_shapes = curve_out
    lap("カーブ")

    ms.finalize_warnings()
    nverts = sum(len(m["positions"]) // 3 for m in out_meshes)
    npolys = sum(len(m["counts"]) for m in out_meshes)
    scene = {
        "schema": schema.SCHEMA_NAME,
        "version": schema.SCHEMA_VERSION,
        "source": {
            "kind": "ma",
            "path": ms.source_path,
            "name": os.path.basename(ms.source_path) if ms.source_path else "",
            "mayaVersion": ms.maya_version,
            "linearUnit": ms.linear_unit,
            "angularUnit": ms.angular_unit,
            "upAxis": ms.up_axis,
        },
        "nodes": out_nodes,
        "meshes": out_meshes,
        "curves": out_curves,
        "materials": mb.materials,
        "textures": mb.textures,
        "warnings": list(ms.warnings),
        "stats": {
            "nodes": len(out_nodes),
            "joints": sum(1 for x in out_nodes if x["type"] == "joint"),
            "meshes": len(out_meshes),
            "curves": len(out_curves),
            "vertices": nverts,
            "polygons": npolys,
            "skinnedMeshes": sum(1 for m in out_meshes if m["skin"]),
            "materials": len(mb.materials),
            "textures": len(mb.textures),
            "texturesMissing": sum(1 for t in mb.textures if not t["resolved"]),
            "bindPoseNodes": sum(1 for x in out_nodes if "bindMatrix" in x),
            "drivenNodes": sum(1 for x in out_nodes if "drivenBy" in x),
        },
    }
    lap("メッシュ（その他）")
    ms.out_index = index_of            # アニメーションを後から読むときに使う（出力するノードの番号）
    ms.bind_ids = set(bind_src)         # バインドポーズの情報を持つノード（値を求められないときの推定に使う）
    return scene


def _skin_arrays(sk, nverts: int, slot_of: Dict[int, int]):
    """頂点ごとのウェイト（従来の処理）→ (counts, indices, weights, ウェイトのない頂点数, 不明なインフルエンス数, 範囲外があるか)"""
    counts: List[int] = []
    indices: List[int] = []
    weights: List[float] = []
    missing = 0
    unknown = 0
    table = sk.weights
    for v in range(nverts):
        d = table.get(v)
        if not d:
            missing += 1
            counts.append(0)
            continue
        c = 0
        # 合計が 0 の頂点は、記録されているジョイント（値 0）も残す（ビューアで割り当て先に使う）
        all_zero = all(w <= 0.0 for w in d.values())
        for li, w in sorted(d.items()):
            if w <= 0.0 and not all_zero:
                continue
            s = slot_of.get(li)
            if s is None:
                unknown += 1
                continue
            indices.append(s)
            weights.append(round(max(w, 0.0), 6))
            c += 1
        counts.append(c)
    extra = any(v >= nverts for v in table)
    return counts, indices, weights, missing, unknown, extra


def _skin_arrays_np(sk, nverts: int, slot_of: Dict[int, int]):
    """_skin_arrays の numpy の経路。疎形式の行（sk.sparse）だけで、頂点の範囲が重ならないとき。
    すべての文の値をつなげて一度に数値化する（文が数万に分かれていても、numpy を呼ぶのは 1 回）。
    条件に合わなければ None（従来の処理に任せる）。"""
    chunks = sorted(sk.sparse, key=lambda c: c[0])
    if any(chunks[i][0] <= chunks[i - 1][1] for i in range(1, len(chunks))):
        _fast("ウェイト: 従来の処理（頂点の範囲が重複）")
        return None
    dense = sk._weights                      # 1 頂点ずつの書き方（範囲の行と同じ頂点があれば、従来の処理）
    if dense and any(a <= v <= b for v in dense for a, b, _v in chunks):
        _fast("ウェイト: 従来の処理（同じ頂点に 2 通りの書き方）")
        return None
    arr = fast_numbers(" ".join(v if isinstance(v, str) else " ".join(v) for _a, _b, v in chunks))
    if arr is None:
        _fast("ウェイト: 従来の処理（数値以外の記述）")
        return None
    al = arr.tolist()
    cnts: List[int] = []
    starts: List[int] = []
    vids: List[int] = []
    p = 0
    try:
        for a, b, _v in chunks:              # 行の区切りだけは順に読む（1 行の長さが行ごとに違うため）
            for v in range(a, b + 1):
                c = int(al[p])
                cnts.append(c)
                starts.append(p + 1)
                vids.append(v)
                p += 1 + 2 * c
    except (IndexError, ValueError):
        _fast("ウェイト: 従来の処理（行の数が合わない）")
        return None
    if p != len(al):
        _fast("ウェイト: 従来の処理（行の数が合わない）")
        return None
    # 1 頂点ずつの書き方の分を後ろに足す
    for v, d in dense.items():
        for li, w in d.items():
            cnts.append(1)
            vids.append(v)
            starts.append(len(al))
            al.append(float(li))
            al.append(float(w))
    if dense:
        arr = np.asarray(al, dtype=np.float64)
    _fast("ウェイト: 速い経路")
    cnts_a = np.asarray(cnts, dtype=np.int64)
    st = np.asarray(starts, dtype=np.int64)
    rep = np.repeat(st, cnts_a)
    pos = rep + 2 * (_ranges(st, cnts_a) - rep)       # 各行の「番号」の位置（値はその次）
    V = np.repeat(np.asarray(vids, dtype=np.int64), cnts_a)
    L = arr[pos].astype(np.int64)
    W = arr[pos + 1]

    extra = bool((V >= nverts).any())
    inside = V < nverts
    V, L, W = V[inside], L[inside], W[inside]
    # 同じ頂点・同じ番号が 2 回あれば後のものを使い、頂点 → 番号の順に並べる（従来の sorted(d.items()) と同じ）
    order = np.lexsort((L, V))
    V, L, W = V[order], L[order], W[order]
    if len(V) > 1:
        keep = np.ones(len(V), dtype=bool)
        keep[:-1] = (V[:-1] != V[1:]) | (L[:-1] != L[1:])
        V, L, W = V[keep], L[keep], W[keep]
    has_row = np.bincount(V, minlength=nverts)[:nverts] > 0
    positive = np.bincount(V, weights=(W > 0).astype(np.float64), minlength=nverts)[:nverts] > 0
    w_ok = (W > 0) | ~positive[V]                  # 合計が 0 の頂点は値 0 のものも残す
    lut = np.full(int(L.max()) + 1 if len(L) else 1, -1, dtype=np.int64)
    for li, s in slot_of.items():
        if 0 <= li < len(lut):
            lut[li] = s
    slots = np.where((L >= 0) & (L < len(lut)), lut[np.clip(L, 0, len(lut) - 1)], -1)
    unknown = int((w_ok & (slots < 0)).sum())
    keep = w_ok & (slots >= 0)
    counts = np.bincount(V[keep], minlength=nverts)[:nverts]
    weights = np.round(np.maximum(W[keep], 0.0), 6)
    return (counts.tolist(), slots[keep].tolist(), weights.tolist(), int((~has_row).sum()), unknown, extra)


def _build_skin(ms: MaScene, ctx: _Ctx, shape: MaNode, sk_node: MaNode, nverts: int,
                index_of: Dict[int, int]) -> Optional[dict]:
    sk = sk_node.skin
    infl: List[Tuple[int, MaNode]] = []
    for key, (src, _sattr) in sk_node.inputs.items():
        m = _INFLUENCE_RE.match(key)
        if m:
            node = src.parent if src.is_shape else src
            infl.append((int(m.group(1)), node))
    if not infl:
        ms.warn("%s: %s にインフルエンスが接続されていません" % (shape.name, sk_node.name))
        return None
    infl.sort(key=lambda x: x[0])
    slot_of: Dict[int, int] = {}
    influences: List[int] = []
    pms: List[List[float]] = []
    for li, node in infl:
        ni = index_of.get(id(node))
        if ni is None:
            continue
        slot_of[li] = len(influences)
        influences.append(ni)
        pm = sk.pm.get(li)
        if pm is None:
            pm = M.inverse_or_identity(ctx.world_matrix(node))
            ms.warn("%s: %s のバインド行列(.pm[%d])がないため、現在の姿勢をバインドポーズとみなします"
                    % (sk_node.name, node.name, li), key="#バインド行列の欠落 " + sk_node.name)
        pms.append(schema.matrix_list(pm))
    if sk.skm:
        ms.warn("%s: スキニング方式が %s です。ビューアはリニアのみで変形します。"
                % (sk_node.name, {1: "デュアルクォータニオン", 2: "ブレンド"}.get(sk.skm, str(sk.skm))))

    arrays = _skin_arrays_np(sk, nverts, slot_of) if (numpy_enabled() and sk.sparse) else None
    if arrays is not None:
        counts, indices, weights, missing, unknown, extra = arrays
    else:
        counts, indices, weights, missing, unknown, extra = _skin_arrays(sk, nverts, slot_of)
    if missing:
        ms.warn("%s: ウェイトが記録されていない頂点が %d 個あります" % (sk_node.name, missing))
    if unknown:
        ms.warn("%s: 接続されていないインフルエンスへのウェイトが %d 件あります（無視）" % (sk_node.name, unknown))
    if extra:
        ms.warn("%s: 頂点数（%d）を超える番号のウェイトがあります。トポロジーが変わっている可能性があります。"
                % (sk_node.name, nverts))
    return {
        "cluster": sk_node.name,
        "method": int(sk.skm or 0),
        # ウェイトの正規化（0: なし, 1: インタラクティブ（既定）, 2: ポスト = 変形時に合計で割る）
        "normalize": int(sk.nw) if sk.nw is not None else 1,
        # ウェイトの分配（合計が 0 の頂点の割り当て方。0: 距離, 1: 近傍）
        "weightDistribution": int(sk.wd) if sk.wd is not None else 0,
        "influences": influences,
        "bindPreMatrices": pms,
        "geomMatrix": schema.matrix_list(sk.gm if sk.gm else M.identity()),
        "counts": counts,
        "indices": indices,
        "weights": weights,
    }


# 直近の load_ma の処理時間（秒）。読み込みの内訳をログに出すために使う
LAST_TIMING: Dict[str, float] = {}


def load_ma(path: str, progress: ProgressFn = None, animation: bool = False) -> dict:
    """.ma ファイルを読み、共通 JSON（dict）を返す。animation=True ならアニメーションも読む（scene["animation"]）。"""
    scene, load_animation = load_ma_staged(path, progress)
    if animation:
        anim = load_animation(progress)
        if anim is not None:
            scene["animation"] = anim
    return scene


def load_ma_staged(path: str, progress: ProgressFn = None):
    """.ma を 2 段階で読む。(共通 JSON, アニメーションを読む関数) を返す。

    1 段階目（この関数）はアニメーションカーブの中身を読まず、範囲だけを覚えておく。
    返した関数を呼ぶと、表示するノードを動かすカーブだけを読み、animation（なければ None）を返す。
    シーンを先に表示しておき、アニメーションは後から読み込むために使う。
    """
    import gc
    import time
    # 解析中は大量のオブジェクトを作るので、ガベージコレクションを止めておく（循環参照はほぼ作らない。約 1 割速い）
    gc_was = gc.isenabled()
    gc.disable()
    FAST.clear()
    try:
        t0 = time.perf_counter()
        ms = parse_ma_file(path, progress)
        t1 = time.perf_counter()
        if progress:
            progress(1.0, "ビューア用データに変換中")
        sc = scene_to_dict(ms, progress)
    finally:
        if gc_was:
            gc.enable()
    LAST_TIMING.clear()
    top = sorted(ms.cost.items(), key=lambda kv: -kv[1][0])[:6]
    handled = sum(v[0] for v in ms.cost.values())
    LAST_TIMING.update(read=ms.read_seconds, top_parse=[(k, v[0], int(v[1]), int(v[2])) for k, v in top],
                       parse_other=max(0.0, (t1 - t0) - ms.read_seconds - handled), fast=dict(FAST),
                       top_convert=sorted(CONVERT_TIMING.items(), key=lambda kv: -kv[1])[:6])
    LAST_TIMING.update(parse=t1 - t0, convert=time.perf_counter() - t1,
                       statements=sum(v for k, v in ms.stats.items() if k != "読み飛ばし"),
                       skipped=ms.stats.get("読み飛ばし", 0), numpy=numpy_enabled())

    # アニメーションカーブもリグもなければ、本文（.ma の全文）をすぐに手放す（大きなファイルでメモリを抱えないため）
    has_rig = ms.graph_info is not None and not ms.graph_info.empty
    if not has_rig and not any(n.span is not None and n.type.startswith("animCurve") for n in ms.nodes):
        ms.text = ""

    def load_animation(progress2: ProgressFn = None) -> Optional[dict]:
        if not ms.text:
            return None
        from .animation import build_animation
        try:
            return build_animation(ms, getattr(ms, "out_index", {}), progress2)
        finally:
            ms.text = ""                 # 読み終えたら本文を手放す

    return sc, load_animation
