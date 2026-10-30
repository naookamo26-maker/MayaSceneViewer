# -*- coding: utf-8 -*-
"""place2dTexture（テクスチャの UV の配置）の繰り返し（repeatUV）とオフセット（offset）。

Maya の file ノードは place2dTexture の outUV（.o）を uvCoord（.uv）に、repeatUV・offset などを同じ名前の属性に
受け取り、テクスチャを UV × 繰り返し + オフセット の位置で引く（rotateUV などがないとき）。ビューアは three.js の
テクスチャの repeat・offset に同じ値を入れる（texture.offset / repeat は uv' = uv · repeat + offset）。

  * 静的な値: 共通 JSON の textures[i].uv = {"place2d": 番号, "repeat": [u, v], "offset": [u, v]}
  * 接続（キー・ジョイント・計算ノード・exprespy など）で決まる値: animation.props の種類 "place2d"（index は
    place2d の番号）。属性は ofu・ofv・reu・rev と、2 つまとめた of・re。ビューアがフレームごとに評価して反映する
  * 反映しないもの（既定値でなければ警告）: rotateUV・rotateFrame・translateFrame・coverage・mirrorU / V・
    stagger・wrapU / V のオフ・noiseUV。UDIM のテクスチャ
"""
from __future__ import annotations

from typing import Dict, List, Optional, Tuple

# animation.props の属性 → .ma の属性の名前（短い名前・長い名前）
PROP_ALIASES: Dict[str, Tuple[str, ...]] = {
    "ofu": ("ofu", "offsetU"), "ofv": ("ofv", "offsetV"), "reu": ("reu", "repeatU"), "rev": ("rev", "repeatV"),
    "of": ("of", "offset"), "re": ("re", "repeatUV"),
}
PROP_KEYS = tuple(PROP_ALIASES)

# 反映しない属性: (名前（短い・長い）, 既定値, 説明)。2 つ組は成分の名前も
_UNSUPPORTED = [
    (("ro", "rotateUV"), 0.0, "rotateUV"),
    (("rf", "rotateFrame"), 0.0, "rotateFrame"),
    (("tf", "translateFrame"), (0.0, 0.0), "translateFrame"),
    (("tfu", "translateFrameU"), 0.0, "translateFrame"),
    (("tfv", "translateFrameV"), 0.0, "translateFrame"),
    (("c", "coverage"), (1.0, 1.0), "coverage"),
    (("cu", "coverageU"), 1.0, "coverage"),
    (("cv", "coverageV"), 1.0, "coverage"),
    (("mu", "mirrorU"), False, "mirrorU"),
    (("mv", "mirrorV"), False, "mirrorV"),
    (("s", "stagger"), False, "stagger"),
    (("wu", "wrapU"), True, "wrapU"),
    (("wv", "wrapV"), True, "wrapV"),
    (("n", "noiseUV"), (0.0, 0.0), "noiseUV"),
    (("nu", "noiseU"), 0.0, "noiseUV"),
    (("nv", "noiseV"), 0.0, "noiseUV"),
]
_UNSUPPORTED_NAMES = frozenset(k for names, _d, _l in _UNSUPPORTED for k in names)
_PROP_NAMES = frozenset(k for names in PROP_ALIASES.values() for k in names)
_TRUE = {"yes", "on", "true", "1"}
_FALSE = {"no", "off", "false", "0"}


def _raw(n, names):
    raw = n.raw or {}
    for k in names:
        if raw.get(k):
            return raw[k]
    return None


def _floats(vals) -> Optional[List[float]]:
    try:
        return [float(v) for v in vals]
    except (TypeError, ValueError):
        return None


def _pair(n, whole, u, v, default) -> List[float]:
    out = list(default)
    w = _floats(_raw(n, whole) or [])
    if w and len(w) >= 2:
        out = w[:2]
    for k, names in enumerate((u, v)):
        x = _floats(_raw(n, names) or [])
        if x:
            out[k] = x[0]
    return out


def place2d_of(f) -> Optional[object]:
    """file ノードにつながる place2dTexture（uvCoord・offset・repeatUV の接続元）"""
    for key in ("uv", "of", "offset", "re", "repeatUV"):
        src = f.inputs.get(key)
        if src is not None and src[0].type == "place2dTexture":
            return src[0]
    return None


def collect(ms) -> List[object]:
    """file ノードにつながる place2dTexture（シーンの順）。ms.place2d_index（id → 番号）も作る"""
    seen = {}
    for n in ms.nodes:
        if n.type != "file":
            continue
        p = place2d_of(n)
        if p is not None and id(p) not in seen:
            seen[id(p)] = p
    nodes = sorted(seen.values(), key=lambda x: x.order)
    ms.place2d_index = {id(p): k for k, p in enumerate(nodes)}
    return nodes


def static_uv(p) -> Tuple[List[float], List[float]]:
    """(repeat, offset) のファイルの値"""
    return (_pair(p, ("re", "repeatUV"), ("reu", "repeatU"), ("rev", "repeatV"), (1.0, 1.0)),
            _pair(p, ("of", "offset"), ("ofu", "offsetU"), ("ofv", "offsetV"), (0.0, 0.0)))


def unsupported(p) -> List[str]:
    """反映しない属性のうち、既定値でないもの・接続のあるもの（名前の一覧）"""
    out: List[str] = []
    if _UNSUPPORTED_NAMES.isdisjoint(p.inputs) and _UNSUPPORTED_NAMES.isdisjoint(p.raw or ()):
        return out                                   # 値も接続もない（ほとんどの place2dTexture）
    for names, default, label in _UNSUPPORTED:
        if label in out:
            continue
        if any(k in p.inputs for k in names):
            out.append(label)
            continue
        vals = _raw(p, names)
        if vals is None:
            continue
        if isinstance(default, bool):
            s = str(vals[0]).lower()
            on = True if s in _TRUE else False if s in _FALSE else None
            if on is not None and on != default:
                out.append(label)
            continue
        x = _floats(vals)
        want = list(default) if isinstance(default, tuple) else [default]
        if x and any(abs(a - b) > 1e-9 for a, b in zip(x, want)):
            out.append(label)
    return out


def connected(p) -> bool:
    """繰り返し・オフセットに接続があるか（ビューアがフレームごとに評価する）"""
    return not _PROP_NAMES.isdisjoint(p.inputs)


def uv_entry(ms, f, entry: dict, used_by: str) -> Optional[dict]:
    """textures[i] の uv（繰り返し・オフセットが既定値でないか接続があるとき）。反映しないものは警告する"""
    p = place2d_of(f)
    if p is None:
        return None
    index = getattr(ms, "place2d_index", {}).get(id(p))
    repeat, offset = static_uv(p)
    plain = repeat == [1.0, 1.0] and offset == [0.0, 0.0] and not connected(p)
    bad = unsupported(p)
    if bad:
        ms.warn("%s（%s）: place2dTexture %s の %s は反映しません（繰り返し・オフセットだけ反映します）。"
                % (used_by, f.name, p.name, "・".join(bad)), key="#place2dTexture " + p.name)
    if plain or index is None:
        return None
    if entry.get("udim"):
        ms.warn("%s（%s）: UDIM のテクスチャの place2dTexture %s の繰り返し・オフセットは反映しません。"
                % (used_by, f.name, p.name), key="#place2dTexture UDIM " + p.name)
        return None
    ms.place2d_used = getattr(ms, "place2d_used", set()) | {index}
    return {"place2d": index, "repeat": repeat, "offset": offset}
