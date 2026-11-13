# -*- coding: utf-8 -*-
"""ノードの型ごとの、属性の長い名前 → 短い名前（attr_names.json。Autodesk の技術資料から tools/make_attr_names.py で作る）。

接続・リファレンスの編集・setAttr の読み直しで、属性名を短い名前にそろえるのに使う（MaScene.attr_key）。
型の表は親の型（transform → dagNode → …）の名前も含める。表にない型（自作ノード・プラグインのノード）は None
（全体の表 ma_reader.ATTR_ALIASES だけで読み替える）。
"""
from __future__ import annotations

import json
import os
from typing import Dict, FrozenSet, Optional, Tuple

_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "attr_names.json")
_data: Optional[dict] = None
_flat: Dict[str, Optional[Tuple[Dict[str, str], FrozenSet[str]]]] = {}


def _load() -> dict:
    global _data
    if _data is None:
        try:
            with open(_PATH, encoding="utf-8") as f:
                _data = json.load(f)
        except (OSError, ValueError):
            _data = {"parents": {}, "types": {}}
    return _data


def names_for(node_type: str) -> Optional[Tuple[Dict[str, str], FrozenSet[str]]]:
    """型の (長い名前 → 短い名前, 短い名前の集合)。親の型の名前も含める（子の型を優先）。表にない型は None"""
    hit = _flat.get(node_type, False)
    if hit is not False:
        return hit
    d = _load()
    types, parents = d.get("types", {}), d.get("parents", {})
    if node_type not in types and node_type not in parents:
        _flat[node_type] = None
        return None
    out: Dict[str, str] = {}
    seen = set()
    t: Optional[str] = node_type
    while t and t not in seen:
        seen.add(t)
        for ln, sn in types.get(t, {}).items():
            out.setdefault(ln, sn)
        t = parents.get(t)
    res = (out, frozenset(out.values()))
    _flat[node_type] = res
    return res
