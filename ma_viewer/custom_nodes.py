# -*- coding: utf-8 -*-
"""自作ノード（プラグイン）の割り当て: 型を知らないノードを、同じ計算をする標準ノードとして扱う。

自作ノードの中の計算は .ma に書かれていないため、利用者が設定ファイルで「どの標準ノードと同じか」を教える。

設定ファイル（JSON。後のものが優先）:
  1. ~/.ma_viewer/nodes.json
  2. 環境変数 MA_VIEWER_NODES のパス
  3. .ma と同じフォルダの ma_viewer_nodes.json

書き方:
  {
    "myMatrixBlend": {"as": "multMatrix", "attrs": {"inMatrix": "i[0]", "outMatrix": "o"}},
    "myCtrlTransform": {"as": "transform"}
  }
  * "as": 扱う標準ノードの型（multMatrix・inverseMatrix・decomposeMatrix・composeMatrix・transform など、ビューアが
    評価できる型）
  * "attrs": 自作ノードの属性名 → 標準ノードの属性名（短い名前）。"i" のように添字なしで書くと元の添字を引き継ぎ
    （inMatrix[2] → i[2]）、"i[0]" のように添字つきで書くとその属性にする
"""
from __future__ import annotations

import json
import os
import re
from typing import Dict, List, Optional

from . import ma_reader as R

FILE_NAME = "ma_viewer_nodes.json"
_ATTR_RE = re.compile(r"^(\w+)(\[\d+\])?(.*)$")


def config_paths(ma_path: Optional[str]) -> List[str]:
    paths = [os.path.join(os.path.expanduser("~"), ".ma_viewer", "nodes.json")]
    env = os.environ.get("MA_VIEWER_NODES")
    if env:
        paths.append(env)
    if ma_path:
        paths.append(os.path.join(os.path.dirname(os.path.abspath(ma_path)), FILE_NAME))
    return paths


def load_node_map(ma_path: Optional[str], warn=None) -> Dict[str, dict]:
    """設定ファイルを読んで、型 → {"as", "attrs"} を返す（読めないファイルは warn で知らせて飛ばす）"""
    out: Dict[str, dict] = {}
    for p in config_paths(ma_path):
        if not os.path.isfile(p):
            continue
        try:
            with open(p, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, ValueError) as exc:
            if warn:
                warn("自作ノードの設定 %s を読めませんでした（%s）" % (p, exc))
            continue
        if not isinstance(data, dict):
            continue
        for t, spec in data.items():
            if isinstance(spec, str):
                spec = {"as": spec}
            if isinstance(spec, dict) and isinstance(spec.get("as"), str) and not t.startswith("_"):
                out[t] = {"as": spec["as"], "attrs": dict(spec.get("attrs") or {}), "from": p}
    return out


def rename_attr(attr: str, amap: Dict[str, str]) -> str:
    m = _ATTR_RE.match(attr)
    if not m or m.group(1) not in amap:
        return attr
    target = amap[m.group(1)]
    if "[" in target:
        return target + m.group(3)
    return target + (m.group(2) or "") + m.group(3)


def apply_node_map(ms, mapping: Dict[str, dict]) -> Dict[str, List[str]]:
    """割り当てのある型のノードを、標準ノードとして扱うように書き換える。戻り値: 型 → ノード名の一覧"""
    from .ma_scene import TRANSFORM_TYPES
    if not mapping:
        return {}
    applied: Dict[str, List[str]] = {}
    mapped = {}
    for n in ms.nodes:
        spec = mapping.get(n.type)
        if spec is None:
            continue
        applied.setdefault(n.type, []).append(n.name)
        # 属性名は .ma の読み込みと同じく短い名前にそろえる（input と ip のどちらで書いてもよい）
        amap = {R.normalize_attr(k).split("[")[0] or k: v for k, v in spec["attrs"].items()}
        amap.update(spec["attrs"])
        mapped[id(n)] = amap
        n.attr_map = amap or None
        n.type = spec["as"]
        if spec["as"] in TRANSFORM_TYPES:
            n.is_dag = True
    if not mapped:
        return applied
    conns = []
    for src, sattr, dst, dattr in ms.connections:
        if id(src) in mapped:
            sattr = rename_attr(sattr, mapped[id(src)])
        if id(dst) in mapped:
            dattr = rename_attr(dattr, mapped[id(dst)])
        conns.append((src, sattr, dst, dattr))
    ms.connections = conns
    for n in ms.nodes:
        if not n.inputs:
            continue
        new = {}
        for key, (src, sattr) in n.inputs.items():
            if id(src) in mapped:
                sattr = rename_attr(sattr, mapped[id(src)])
            if id(n) in mapped:
                key = rename_attr(key, mapped[id(n)])
            new[key] = (src, sattr)
        n.inputs = new
    return applied


def template_for(ms, type_name: str) -> dict:
    """設定ファイルの雛形（つながっている属性の名前を入れる）"""
    ins, outs = set(), set()
    for src, sattr, dst, dattr in ms.connections:
        if dst.type == type_name:
            ins.add(_ATTR_RE.match(dattr).group(1) if _ATTR_RE.match(dattr) else dattr)
        if src.type == type_name:
            outs.add(_ATTR_RE.match(sattr).group(1) if _ATTR_RE.match(sattr) else sattr)
    return {"as": "（同じ計算をする標準ノードの型。例: multMatrix）",
            "attrs": {**{a: "（入力）" for a in sorted(ins)}, **{a: "（出力）" for a in sorted(outs)}}}
