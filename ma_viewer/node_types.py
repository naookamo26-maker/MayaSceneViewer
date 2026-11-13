# -*- coding: utf-8 -*-
"""ノードの型の登録（ma_viewer/node_types.json）。Python（rig.py・ma_scene.py）と JS（rig.js・mathNodes.js）が同じものを読む
（整備計画の D5）。型を足すときは JSON に足す（JS の計算は web_src/src/rig*.js・mathNodes.js に書く）"""
from __future__ import annotations

import json
import os
from typing import Set

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "node_types.json"), encoding="utf-8") as _f:
    NODE_TYPES: dict = json.load(_f)


def types_of_kind(kind: str) -> Set[str]:
    """kind（utility・constraint・geometry・other）の型の集合"""
    return {t for t, e in NODE_TYPES["types"].items() if e.get("kind") == kind}
