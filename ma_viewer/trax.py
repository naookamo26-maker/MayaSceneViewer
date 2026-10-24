# -*- coding: utf-8 -*-
"""キャラクターセット（character）と Trax のクリップ（clipLibrary・clipScheduler・animClip）。

キャラクターセットに入れた属性は、character の linearValues（lv）・angularValues（av）・unitlessValues（uv）・
timeValues（tv）の出力からつながる（character1.lv[3] → pCube1.tx）。その値は次のどちらかで決まる:
  * カーブが character の属性に直接つながる（クリップなし）: その値をそのまま通す
  * Trax のクリップ: clipLibrary が元のクリップ（ソースクリップ）のカーブを持ち（cel[k].cev[c].cevr ← カーブ）、
    clipScheduler とクリップの animClip（インスタンス）が、タイムライン上の位置・範囲・スケール・サイクル・
    ウェイト・トラック・有効を持つ

1 段階目（discover）は character の入力と、クリップのカーブを洗い出すだけ（curves_of_character）。
2 段階目（build_graph）で属性の値を読み、graph の character の "trax" を作る（build_trax）。評価はビューア（rig.js）。

属性名は短い名前・長い名前のどちらでも読む（Maya の版で違うことがあるため）。
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional, Tuple

from .ma_scene import MaNode, MaScene
from . import ma_reader as R

CHAR_KINDS = ("lv", "av", "uv", "tv")                  # linearValues・angularValues・unitlessValues・timeValues
_LONG_KINDS = {"linearValues": "lv", "angularValues": "av", "unitlessValues": "uv", "timeValues": "tv"}
TRAX_TYPES = ("clipLibrary", "clipScheduler", "animClip")
# character の入力のうち、値として通さないもの（メンバーの登録・クリップの管理用の接続）
_CHAR_SKIP_KEYS = {"dnsm", "dsm", "dagSetMembers", "dnSetMembers", "msg", "message", "ce", "clipEvaluate"}

_CHAR_PLUG_RE = re.compile(r"^(lv|av|uv|tv|linearValues|angularValues|unitlessValues|timeValues)\[(\d+)\]$")
_CEV_RE = re.compile(r"^(?:cel|clipEvalList)\[(\d+)\]\.(?:cev|clipEval)\[(\d+)\]")
_SC_RE = re.compile(r"^(?:sc|sourceClip)\[(\d+)\]$")
_MAPPING_RE = re.compile(r'setAttr\s+"\.(am|characterMapping|cd\[(\d+)\]\.cm|clipData\[(\d+)\]\.clipMapping)"'
                         r'\s+-type\s+"characterMapping"\s+(\d+)([^;]*);')
_INT_ARRAY_RE = re.compile(r'setAttr\s+"\.(?:cd|clipData)\[(\d+)\]\.(?:cim|clipIndexMapping)"\s+-type\s+"Int32Array"'
                           r'\s+(\d+)([^;]*);')
_KIND_CODE = {1: "lv", 2: "av", 3: "tv", 0: "uv"}     # characterMapping の種類の番号（推定。名前で引けないときだけ使う）

# クリップの属性: (読む名前の候補, 既定値)。animClip の値を優先し、なければ clipScheduler の配列（名前[j]）
CLIP_ATTRS = {
    "start": (("st", "start", "sf", "startFrame"), 0.0),
    "sourceStart": (("ss", "sourceStart"), None),
    "sourceEnd": (("se", "sourceEnd"), None),
    "scale": (("sc", "scale"), 1.0),
    "weight": (("w", "weight"), 1.0),
    "preCycle": (("cb", "preCycle"), 0.0),
    "postCycle": (("ca", "postCycle"), None),
    "cycle": (("cy", "cycle"), 1.0),                    # 古い版（postCycle の前）: 全体の回数
    "hold": (("h", "hold"), 0.0),
    "enable": (("ea", "enable"), 1.0),
    "track": (("tr", "track"), 0.0),
    "absolute": (("ac", "absoluteChannel"), 1.0),
}


def _plug_kind(attr: str) -> Optional[str]:
    m = _CHAR_PLUG_RE.match(attr)
    if not m:
        return None
    return "%s[%s]" % (_LONG_KINDS.get(m.group(1), m.group(1)), m.group(2))


def _linked(ms: MaScene, a: MaNode, types) -> List[MaNode]:
    """a と（どちら向きでも）接続している、types のノード"""
    out = []
    for s, _sa, d, _da in ms.connections:
        other = d if s is a else s if d is a else None
        if other is not None and other.type in types and other not in out:
            out.append(other)
    return out


def library_and_scheduler(ms: MaScene, char: MaNode) -> Tuple[Optional[MaNode], Optional[MaNode]]:
    """キャラクターの clipLibrary と clipScheduler（1 つずつ。接続で探し、なければシーンに 1 つしかないもの）"""
    libs = _linked(ms, char, ("clipLibrary",))
    scheds = _linked(ms, char, ("clipScheduler",))
    if not libs and scheds:
        libs = _linked(ms, scheds[0], ("clipLibrary",))
    if not scheds and libs:
        scheds = _linked(ms, libs[0], ("clipScheduler",))
    n_chars = sum(1 for n in ms.nodes if n.type == "character")
    if not libs and n_chars == 1:
        libs = [n for n in ms.nodes if n.type == "clipLibrary"][:1]
    if not scheds and n_chars == 1:
        scheds = [n for n in ms.nodes if n.type == "clipScheduler"][:1]
    return (libs[0] if libs else None), (scheds[0] if scheds else None)


def library_curves(ms: MaScene, lib: MaNode) -> List[Tuple[int, int, MaNode]]:
    """clipLibrary につながるクリップのカーブ: [(ソースクリップの番号 k, チャンネル c, カーブ)]"""
    out = []
    for s, _sa, d, da in ms.connections:
        if d is lib and s.type.startswith("animCurve"):
            m = _CEV_RE.match(da)
            if m:
                out.append((int(m.group(1)), int(m.group(2)), s))
    return out


def curves_of_character(ms: MaScene, char: MaNode) -> List[MaNode]:
    """1 段階目: キャラクターのクリップのカーブ（アニメーションで読み込むもの）"""
    lib, _sched = library_and_scheduler(ms, char)
    return [c for _k, _c, c in library_curves(ms, lib)] if lib is not None else []


def skip_input(char: MaNode, key: str, src: MaNode) -> bool:
    """character の入力のうち、値として通さないもの"""
    return key.split("[")[0] in _CHAR_SKIP_KEYS or src.type in TRAX_TYPES


# ---------------------------------------------------------------------------
# 2 段階目
# ---------------------------------------------------------------------------

def _mappings(text: str, node: MaNode) -> Dict[object, List[Tuple[str, int, int]]]:
    """characterMapping（"am" はキャラクター、k はソースクリップ k）: [(メンバーの属性の名前, 種類の番号, 添字)]"""
    out: Dict[object, List[Tuple[str, int, int]]] = {}
    if node.span is None or not text:
        return out
    a, b = node.span
    for m in _MAPPING_RE.finditer(text, a, b):
        key = "am" if m.group(1) in ("am", "characterMapping") else int(m.group(2) or m.group(3))
        toks = R.tokenize(m.group(5))
        items = []
        vals = [t.value for t in toks]
        for i in range(0, len(vals) - 2, 3):
            try:
                items.append((vals[i], int(float(vals[i + 1])), int(float(vals[i + 2]))))
            except ValueError:
                break
        out[key] = items
    return out


def _index_maps(text: str, lib: MaNode) -> Dict[int, List[int]]:
    out: Dict[int, List[int]] = {}
    if lib.span is None or not text:
        return out
    a, b = lib.span
    for m in _INT_ARRAY_RE.finditer(text, a, b):
        try:
            out[int(m.group(1))] = [int(x) for x in m.group(3).split()]
        except ValueError:
            pass
    return out


def _member_plugs(ms: MaScene, char: MaNode) -> Dict[Tuple[int, str], str]:
    """キャラクターの出力 → メンバー: {(id(メンバー), 属性): "lv[3]"}"""
    out = {}
    for s, sa, d, da in ms.connections:
        if s is char:
            k = _plug_kind(sa)
            if k:
                out[(id(d), da)] = k
    return out


def _resolve_member(ms: MaScene, name: str) -> Tuple[Optional[MaNode], str]:
    node_name, attr = R.split_node_attr(name)
    return ms.resolve(node_name), R.normalize_attr(attr)


def _clip_value(attrs: dict, sched_attrs: dict, j: Optional[int], names, default):
    for nm in names:
        if nm in attrs:
            return attrs[nm]
    if j is not None:
        for nm in names:
            key = "%s[%d]" % (nm, j)
            if key in sched_attrs:
                return sched_attrs[key]
    return default


def _num(v, default=0.0) -> float:
    if isinstance(v, list):
        v = v[0] if v else default
    try:
        return float(v)
    except (TypeError, ValueError):
        return default


def build_trax(ms: MaScene, char: MaNode, curve_index: Dict[int, int], warn) -> Optional[dict]:
    """graph の character の "trax": {"clips": [...]}。クリップがなければ None。

    各クリップ: start・sourceStart・sourceEnd・scale・weight・preCycle・postCycle・hold・enable・track・absolute と、
    channels {"lv[3]": animation.curves の番号}（キャラクターの出力の属性 → ソースクリップのカーブ）
    """
    from .rig import parse_attrs
    lib, sched = library_and_scheduler(ms, char)
    if lib is None:
        return None
    text = ms.text
    char_map = _mappings(text, char).get("am", [])
    lib_maps = _mappings(text, lib)
    index_maps = _index_maps(text, lib)
    members = _member_plugs(ms, char)

    def plug_for(k: int, c: int) -> Optional[str]:
        """ソースクリップ k のチャンネル c が動かす、キャラクターの出力の属性（"lv[3]" など）"""
        cands = []
        if c < len(char_map):
            cands.append(char_map[c])                 # チャンネルの番号 = キャラクターの番号（Maya の説明）
        cm = lib_maps.get(k, [])
        cim = index_maps.get(k)
        if cim and c in cim and cim.index(c) < len(cm):
            cands.append(cm[cim.index(c)])
        if c < len(cm):
            cands.append(cm[c])
        for name, code, idx in cands:
            node, attr = _resolve_member(ms, name)
            if node is not None and (id(node), attr) in members:
                return members[(id(node), attr)]
            if code in _KIND_CODE:
                return "%s[%d]" % (_KIND_CODE[code], idx)
        return None

    # ソースクリップ（clipLibrary.sc[k] ← animClip）とそのカーブ
    sources: Dict[int, MaNode] = {}
    for s, _sa, d, da in ms.connections:
        m = _SC_RE.match(da)
        if d is lib and m and s.type == "animClip":
            sources[int(m.group(1))] = s
    channels: Dict[int, Dict[str, int]] = {}
    for k, c, curve in library_curves(ms, lib):
        if id(curve) not in curve_index:
            continue
        plug = plug_for(k, c)
        if plug is None:
            warn("アニメーション: %s のクリップのカーブ %s が動かす属性が分かりません。" % (char.name, curve.name))
            continue
        channels.setdefault(k, {})[plug] = curve_index[id(curve)]
    if not channels:
        return None
    source_of = {id(n): k for k, n in sources.items()}

    # インスタンス（タイムラインに置いたクリップ）: clipScheduler につながる animClip（ソースクリップ以外）
    sched_attrs = parse_attrs(text, sched) if sched is not None else {}
    instances: List[Tuple[MaNode, Optional[int]]] = []
    if sched is not None:
        for s, sa, d, da in ms.connections:
            for clip, attr in ((s, da) if d is sched else (None, None), (d, sa) if s is sched else (None, None)):
                if clip is None or clip.type != "animClip" or id(clip) in source_of:
                    continue
                m = re.search(r"\[(\d+)\]", attr or "")
                if all(clip is not x for x, _ in instances):
                    instances.append((clip, int(m.group(1)) if m else None))
    if not instances:
        # スケジューラーとのつながりが見つからなければ、ソース以外の animClip すべて
        instances = [(n, None) for n in ms.nodes if n.type == "animClip" and id(n) not in source_of
                     and _num(parse_attrs(text, n).get("ci", 1.0), 1.0) >= 0.5]

    clips = []
    for order, (clip, j) in enumerate(instances):
        attrs = parse_attrs(text, clip)
        # 元のソースクリップ: 接続 → 名前（clip1 ↔ clip1Source） → ソースが 1 つだけ
        k = None
        for other in _linked(ms, clip, ("animClip",)):
            if id(other) in source_of:
                k = source_of[id(other)]
                break
        if k is None:
            for kk, src in sources.items():
                if src.name in (clip.name + "Source", re.sub(r"\d+$", "", clip.name) + "Source"):
                    k = kk
                    break
        if k is None and len(channels) == 1:
            k = next(iter(channels))
        if k is None or k not in channels:
            warn("アニメーション: クリップ %s の元のクリップが分かりません（再生しません）。" % clip.name)
            continue
        src_attrs = parse_attrs(text, sources[k]) if k in sources else {}
        v = {key: _clip_value(attrs, sched_attrs, j, names, d) for key, (names, d) in CLIP_ATTRS.items()}
        # ソースの範囲がなければ、ソースクリップの値かカーブのキーの範囲
        for key in ("sourceStart", "sourceEnd"):
            if v[key] is None:
                v[key] = _clip_value(src_attrs, {}, None, CLIP_ATTRS[key][0], None)
        entry = {"name": clip.name, "order": order, "channels": channels[k]}
        for key in CLIP_ATTRS:
            if v[key] is not None:
                entry[key] = _num(v[key])
        if v["postCycle"] is None:
            entry["postCycle"] = max(_num(v["cycle"], 1.0) - 1.0, 0.0)
        entry.pop("cycle", None)
        clips.append(entry)
    if not clips:
        return None
    if any(c.get("absolute", 1.0) < 0.5 for c in clips):
        warn("アニメーション: %s のクリップに相対（relative）のチャンネルがあります。絶対として再生します。" % char.name)
    return {"clips": clips}
