# -*- coding: utf-8 -*-
"""ビューアに渡す共通 JSON（maya-scene-lite）の定義と検証。

.ma パーサ（extract_ma）と Maya 抽出器（extract_maya）はどちらもこの形式を出力し、
ビューア（three.js）はこの形式だけを読む。

{
  "schema": "maya-scene-lite",
  "version": 1,
  "source": {"kind": "ma" | "maya", "path": str, "mayaVersion": str | null,
             "linearUnit": "cm", "angularUnit": "deg", "upAxis": "y"},
  "nodes": [                      # transform / joint。親が必ず子より前に並ぶ
    {"name": str, "path": str,    # path は DAG フルパス（"|grp|joint1"）
     "type": "joint" | "transform" | その他の transform 系ノード型,
     "parent": int (-1 = ルート),
     "matrix": [16],              # ローカル行列
     "worldMatrix": [16],         # ワールド行列（参照用）
     "inheritsTransform": bool,
     "segmentScaleCompensate": bool,  # joint のみ（省略時は true）
     "visible": bool,             # 自身の表示状態
     "attrs": {"t": [3], "r": [3](度), "s": [3], "jo": [3](度), "ro": "xyz"}}
  ],
  "meshes": [
    {"name": str, "path": str, "transform": int (nodes の番号),
     "visible": bool,             # 親を含めた実効的な表示状態
     "visibleSelf": bool,         # メッシュ自身の表示状態（省略時は visible と同じ）
     "positions": [x, y, z, ...], # オブジェクト空間（スキン時はバインド時の形状）
     "counts": [面ごとの頂点数], "indices": [面の頂点番号を連結],
     "skin": null | {
        "cluster": str, "method": int (0=リニア, 1=DQ, 2=ブレンド),
        "normalize": int (0=なし, 1=インタラクティブ, 2=ポスト。省略時 1),
        "influences": [nodes の番号, ...],       # スロット順
        "bindPreMatrices": [[16], ...],          # influences と同じ順
        "geomMatrix": [16],
        "counts": [頂点ごとのインフルエンス数],
        "indices": [influences のスロット番号を連結],
        "weights": [値を連結]}}
  ],
  "warnings": [str],
  "stats": {...}
}

行列は Maya の行優先・行ベクトル規約の 16 要素。three.js の Matrix4.fromArray() に
そのまま渡せる（列優先・列ベクトル規約と同じ並びになる）。
"""
from __future__ import annotations

from typing import List

SCHEMA_NAME = "maya-scene-lite"
SCHEMA_VERSION = 1


class SchemaError(ValueError):
    pass


def validate(scene: dict) -> List[str]:
    """形式を検証する。致命的な問題は SchemaError、軽微な問題は文字列のリストで返す。"""
    notes: List[str] = []
    if scene.get("schema") != SCHEMA_NAME:
        raise SchemaError("schema が %s ではありません" % SCHEMA_NAME)
    if int(scene.get("version", 0)) > SCHEMA_VERSION:
        notes.append("新しい版の形式です（version %s）" % scene.get("version"))
    nodes = scene.get("nodes")
    meshes = scene.get("meshes")
    if not isinstance(nodes, list) or not isinstance(meshes, list):
        raise SchemaError("nodes / meshes がありません")
    for i, n in enumerate(nodes):
        p = n.get("parent", -1)
        if p >= i:
            raise SchemaError("nodes[%d] の親 (%d) が後ろにあります" % (i, p))
        if len(n.get("matrix", ())) != 16:
            raise SchemaError("nodes[%d] の matrix が 16 要素ではありません" % i)
    nn = len(nodes)
    for mi, m in enumerate(meshes):
        pos = m.get("positions", [])
        if len(pos) % 3:
            raise SchemaError("meshes[%d] の positions が 3 の倍数ではありません" % mi)
        nv = len(pos) // 3
        counts = m.get("counts", [])
        idx = m.get("indices", [])
        if sum(counts) != len(idx):
            raise SchemaError("meshes[%d] の counts と indices の長さが合いません" % mi)
        if idx and (max(idx) >= nv or min(idx) < 0):
            raise SchemaError("meshes[%d] の indices が頂点数の範囲外です" % mi)
        if not (0 <= m.get("transform", -1) < nn):
            raise SchemaError("meshes[%d] の transform が不正です" % mi)
        he = m.get("hardEdges") or []
        if len(he) % 2 or (he and (max(he) >= nv or min(he) < 0)):
            raise SchemaError("meshes[%d] の hardEdges が不正です" % mi)
        nmat = len(scene.get("materials") or [])
        uv = m.get("uv")
        if uv:
            nuv = len(uv["values"]) // 2
            if len(uv["values"]) % 2 or len(uv["indices"]) != len(idx):
                raise SchemaError("meshes[%d] の uv の配列長が合いません" % mi)
            if uv["indices"] and (max(uv["indices"]) >= nuv or min(uv["indices"]) < -1):
                raise SchemaError("meshes[%d] の uv.indices が範囲外です" % mi)
        fm = m.get("faceMaterials")
        if fm is not None:
            if len(fm) != len(counts):
                raise SchemaError("meshes[%d] の faceMaterials が面の数と合いません" % mi)
            if fm and (max(fm) >= nmat or min(fm) < -1):
                raise SchemaError("meshes[%d] の faceMaterials が範囲外です" % mi)
        if not (-1 <= m.get("material", -1) < nmat):
            raise SchemaError("meshes[%d] の material が範囲外です" % mi)
        sk = m.get("skin")
        if sk:
            ni = len(sk["influences"])
            if len(sk["bindPreMatrices"]) != ni:
                raise SchemaError("meshes[%d] の bindPreMatrices の数が合いません" % mi)
            if any(not (0 <= x < nn) for x in sk["influences"]):
                raise SchemaError("meshes[%d] の influences が不正です" % mi)
            if len(sk["counts"]) != nv:
                raise SchemaError("meshes[%d] の skin.counts が頂点数と合いません" % mi)
            if sum(sk["counts"]) != len(sk["indices"]) or len(sk["indices"]) != len(sk["weights"]):
                raise SchemaError("meshes[%d] の skin の配列長が合いません" % mi)
            if sk["indices"] and max(sk["indices"]) >= ni:
                raise SchemaError("meshes[%d] の skin.indices が範囲外です" % mi)
    ntex = len(scene.get("textures") or [])
    for i, mat in enumerate(scene.get("materials") or []):
        if not (-1 <= mat.get("texture", -1) < ntex):
            raise SchemaError("materials[%d] の texture が範囲外です" % i)
    anim = scene.get("animation")
    if anim:
        validate_animation(anim, nn)
    return notes


def _array_len(entry) -> int:
    """数値の配列（リスト、または {"dtype", "count", "data"} の base64）の要素数"""
    if isinstance(entry, list):
        return len(entry)
    if isinstance(entry, dict) and isinstance(entry.get("data"), str):
        return int(entry.get("count", 0))
    raise SchemaError("animation の配列の形式が不正です")


def validate_animation(anim: dict, nn: int) -> None:
    if not (float(anim.get("fps", 0)) > 0):
        raise SchemaError("animation.fps が不正です")
    nkeys = _array_len(anim.get("times", []))
    if _array_len(anim.get("values", [])) != nkeys:
        raise SchemaError("animation の times と values の長さが合いません")
    if _array_len(anim.get("tangentTypes", [])) not in (0, nkeys * 2):
        raise SchemaError("animation.tangentTypes の長さが合いません")
    if _array_len(anim.get("fixedTangents", [])) % 5:
        raise SchemaError("animation.fixedTangents の長さが 5 の倍数ではありません")
    curves = anim.get("curves") or []
    for i, c in enumerate(curves):
        if c.get("offset", -1) < 0 or c.get("count", 0) < 1 or c["offset"] + c["count"] > nkeys:
            raise SchemaError("animation.curves[%d] のキーの範囲が不正です" % i)
    for i, ch in enumerate(anim.get("channels") or []):
        if not (0 <= ch.get("node", -1) < nn) or not (0 <= ch.get("curve", -1) < len(curves)):
            raise SchemaError("animation.channels[%d] が範囲外です" % i)
        if ch.get("attr") not in ("tx", "ty", "tz", "rx", "ry", "rz", "sx", "sy", "sz"):
            raise SchemaError("animation.channels[%d] の attr が不正です" % i)
    for i, n in enumerate(anim.get("nodes") or []):
        if not (0 <= n.get("node", -1) < nn):
            raise SchemaError("animation.nodes[%d] が範囲外です" % i)


def round_list(values, ndigits: int = 6) -> list:
    if len(values) > 512:                        # ある程度大きな配列は numpy でまとめて丸める
        from .ma_scene import np, numpy_enabled
        if numpy_enabled():
            return np.round(np.asarray(values, dtype=np.float64), ndigits).tolist()
    return [round(float(v), ndigits) for v in values]


def matrix_list(m) -> list:
    return [round(float(v), 10) for v in m]
