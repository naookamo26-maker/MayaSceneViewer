# -*- coding: utf-8 -*-
"""リグ（コンストレイント・IK・計算ノード）の依存関係の探索と、共通 JSON の animation.graph の作成。

1 段階目（scene_to_dict）: 表示するノードの移動・回転・スケールにつながる接続を上流へたどり、
  評価に必要なノード（コントローラー・IK ハンドル・コンストレイント・計算ノード・カーブ）を洗い出す。
  接続だけを見るので軽い。コントローラーなどの DAG ノードは、出力するノードに加える。
2 段階目（animation.build_animation）: 洗い出したノードの属性の値をファイルの範囲（span）から読み、
  ビューアが評価できる形（ノード・静的な値・接続）にする。評価そのものはビューア（web_src/src/rig.js）で行う。

対応するノード:
  * コンストレイント: point・orient・parent・scale・poleVector・aim
  * IK: ikRPsolver の 2 ボーン（開始ジョイント → 中間 → 終端）、ikSCsolver の 1〜2 ボーン
  * 計算ノード: unitConversion・pairBlend・blendColors・multiplyDivide・plusMinusAverage・reverse・condition
  * 行列ノード: multMatrix・decomposeMatrix・composeMatrix・inverseMatrix、DAG ノードの offsetParentMatrix
  * アニメーションカーブ（animCurveTL / TA / TU）
これ以外のノード（エクスプレッション・ドリブンキー・行列ノードなど）に当たったら、そこから先は評価せず警告する。
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional, Set, Tuple

from .ma_scene import MaNode, MaScene
from . import ma_reader as R

CURVE_TYPES = {"animCurveTL", "animCurveTA", "animCurveTU"}
CONSTRAINT_TYPES = {"pointConstraint", "orientConstraint", "parentConstraint", "scaleConstraint", "poleVectorConstraint",
                    "aimConstraint"}
UTILITY_TYPES = {"unitConversion", "pairBlend", "blendColors", "multiplyDivide", "plusMinusAverage", "reverse",
                 "condition", "multMatrix", "decomposeMatrix", "composeMatrix", "inverseMatrix"}
SUPPORTED_DG = CONSTRAINT_TYPES | UTILITY_TYPES

# DAG ノードの行列の属性（上流は、そのノードと祖先の移動・回転・スケールのすべて）
_MATRIX_PLUGS = {"pm", "pim", "wm", "wim", "m", "im", "xm", "worldMatrix", "parentMatrix", "worldInverseMatrix",
                 "parentInverseMatrix", "matrix", "inverseMatrix"}
_CHANNEL_KEYS = {"t", "tx", "ty", "tz", "r", "rx", "ry", "rz", "s", "sx", "sy", "sz", "opm"}
# DAG ノードの属性のうち、ファイルの値を rest_entry で渡すもの（graph の attrs には入れない）
_STANDARD_ATTRS = _CHANNEL_KEYS | {"jo", "jox", "joy", "joz", "ra", "rax", "ray", "raz", "rp", "rpx", "rpy", "rpz",
                                   "sp", "spx", "spy", "spz", "rpt", "spt", "sh", "ro", "v", "it", "ssc", "radi",
                                   "bps", "io", "ove", "ovv", "lodv", "hio", "dla", "dsc", "uoc", "oc", "otx", "rlio",
                                   "mnrl", "mxrl", "mnsl", "mxsl", "mntl", "mxtl", "xm", "is", "liw", "fbx"}
# _CHANNEL_KEYS のうち、値は rest_entry で渡すもの（offsetParentMatrix も含む）

_SETATTR_RE = re.compile(r"setAttr\b([^;]*);")
_TG_RE = re.compile(r"^tg\[(\d+)\]\.(\w+)$")
_RANGE_RE = re.compile(r"^(\w+)\[(\d+):(\d+)\](.*)$")


def _base(attr: str) -> str:
    return attr.split("[")[0].split(".")[0]


def _dag_like(n: MaNode) -> bool:
    return n.is_dag and not n.is_shape and n.type not in SUPPORTED_DG


def _evaluable(n: MaNode) -> bool:
    """接続元として評価できるか（コンストレイントはターゲットがあるときだけ）"""
    if n.type in CURVE_TYPES or n.type in UTILITY_TYPES or _dag_like(n):
        return True                                   # DAG ノードからの直接の接続（ctrl.t → joint.t など）も評価できる
    if n.type in CONSTRAINT_TYPES:
        return any(_TG_RE.match(k) for k in n.inputs)
    return False


class GraphInfo:
    """1 段階目で見つけた、評価に必要なノードと接続"""

    def __init__(self):
        self.dag: Dict[int, MaNode] = {}               # 評価にかかわる DAG ノード（出力するノードに加える）
        self.dg: Dict[int, MaNode] = {}                # コンストレイント・計算ノード
        self.curves: Dict[int, MaNode] = {}            # 上の入力になっているカーブ
        self.edges: Dict[int, Dict[str, Tuple[MaNode, str]]] = {}   # id(使う側) → {属性: (元, 元の属性)}
        self.ik: List[dict] = []                       # {"handle", "solver", "chain": [joint...], "problem"}
        self.unsupported: Dict[str, List[Tuple[str, str, str]]] = {}   # 型 → [(ノード名, 使う側, 属性)]
        self.graph_driven: Set[int] = set()            # チャンネルの接続元がすべて評価できるノード

    @property
    def empty(self) -> bool:
        return not self.dg and not self.ik and not any(
            src.type not in CURVE_TYPES for e in self.edges.values() for src, _ in e.values())


def discover(ms: MaScene, keep: Set[int]) -> GraphInfo:
    """表示するノード（keep）を動かす接続を上流へたどる。"""
    info = GraphInfo()
    world_done: Set[int] = set()
    plug_done: Set[Tuple[int, str]] = set()

    def add_edge(consumer: MaNode, key: str):
        if (id(consumer), key) in plug_done:
            return
        plug_done.add((id(consumer), key))
        src, sattr = consumer.inputs[key]
        info.edges.setdefault(id(consumer), {})[key] = (src, sattr)
        if _dag_like(consumer):
            info.dag[id(consumer)] = consumer
        need_plug(src, sattr, consumer, key)

    def need_channels(n: MaNode, base: Optional[str] = None):
        for key in list(n.inputs):
            kb = _base(key)
            if kb in _CHANNEL_KEYS and (base is None or kb[0] == base[0]):
                add_edge(n, key)

    def need_world(n: Optional[MaNode]):
        while n is not None and id(n) not in world_done:
            world_done.add(id(n))
            if _dag_like(n):
                info.dag[id(n)] = n
            need_channels(n)
            n = n.parent

    def need_plug(n: MaNode, attr: str, consumer: MaNode, ckey: str):
        if n.type in CURVE_TYPES:
            info.curves[id(n)] = n
            return
        if n.type in SUPPORTED_DG:
            if id(n) not in info.dg:
                info.dg[id(n)] = n
                for key in list(n.inputs):
                    add_edge(n, key)
            return
        if _dag_like(n):
            info.dag[id(n)] = n
            b = _base(attr)
            if b in _MATRIX_PLUGS:
                need_world(n)
            elif b in _CHANNEL_KEYS:
                need_channels(n, b)
            elif attr in n.inputs:                       # 独自の属性（IK/FK の切り替えなど）
                add_edge(n, attr)
            return
        info.unsupported.setdefault(n.type, []).append((n.name, consumer.name, ckey))

    # 表示するノードのチャンネルの入力
    for n in ms.nodes:
        if id(n) in keep and _dag_like(n) and n.inputs:
            need_channels(n)
            srcs = [src for key, (src, _sa) in n.inputs.items() if _base(key) in _CHANNEL_KEYS]
            if srcs and all(_evaluable(s) for s in srcs):
                info.graph_driven.add(id(n))

    # IK ハンドル（開始ジョイントが表示するノードのもの）
    for src, sattr, dst, dattr in ms.connections:
        if dst.type != "ikHandle" or dattr != "hsj" or id(src) not in keep:
            continue
        handle, start = dst, src
        solver = handle.inputs.get("hsv")
        eff = handle.inputs.get("hee")
        end = None
        if eff is not None:
            e = eff[0].inputs.get("tx") or eff[0].inputs.get("t")
            end = e[0] if e else None
        chain: List[MaNode] = []
        x = end
        while x is not None and x is not start:
            chain.append(x)
            x = x.parent
        entry = {"handle": handle, "solver": solver[0].type if solver else "ikSCsolver", "chain": [], "problem": None}
        if end is None or x is not start:
            entry["problem"] = "終端のジョイントが見つかりません"
        else:
            chain.append(start)
            entry["chain"] = list(reversed(chain))
            n_joints = len(entry["chain"])
            if entry["solver"] not in ("ikRPsolver", "ikSCsolver"):
                entry["problem"] = "%s は未対応です（ikRPsolver・ikSCsolver のみ）" % entry["solver"]
            elif entry["solver"] == "ikRPsolver" and n_joints != 3:
                entry["problem"] = "ジョイント %d 個の ikRPsolver は未対応です（2 ボーンのみ）" % n_joints
            elif entry["solver"] == "ikSCsolver" and n_joints not in (2, 3):
                entry["problem"] = "ジョイント %d 個の ikSCsolver は未対応です（1〜2 ボーンのみ）" % n_joints
        info.ik.append(entry)
        if entry["problem"]:
            continue
        need_world(handle)
        need_world(end)
        for key in list(handle.inputs):
            if _base(key) in ("pv", "pvx", "pvy", "pvz", "twi", "ikb"):
                add_edge(handle, key)
    return info


# ---------------------------------------------------------------------------
# 2 段階目: 属性の値の読み取りと graph の作成
# ---------------------------------------------------------------------------

def _value(tok: str):
    t = tok.lower()
    if t in ("yes", "true", "on"):
        return 1.0
    if t in ("no", "false", "off"):
        return 0.0
    return R.to_float(tok)


def parse_attrs(text: str, node: MaNode, skip=()) -> Dict[str, object]:
    """ノードのブロック（span）の setAttr から、数値の属性を読む（ノード名つきのプラグは対象外）。"""
    out: Dict[str, object] = {}
    if node.span is None or not text:
        return out
    a, b = node.span
    for m in _SETATTR_RE.finditer(text, a, b):
        sa = R.parse_setattr(m.group(1))
        if sa is None or not sa.plug.startswith(".") or sa.type == "string":
            continue
        key = R.normalize_attr(sa.plug[1:])
        if not key or _base(key) in skip:
            continue
        vals = []
        try:
            for tok in sa.values():
                vals.append(_value(tok))
        except (ValueError, TypeError):
            continue
        if not vals:
            continue
        m = _RANGE_RE.match(key)
        if m:                                            # i1[0:2] → i1[0]・i1[1]・i1[2]
            name, a0, a1, rest = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
            count = a1 - a0 + 1
            per = len(vals) // count if count > 0 else 0
            for k in range(count if per else 0):
                v = vals[k * per:(k + 1) * per]
                out["%s[%d]%s" % (name, a0 + k, rest)] = v[0] if len(v) == 1 else v
            continue
        out[key] = vals[0] if len(vals) == 1 else vals
    return out


def build_graph(ms: MaScene, info: GraphInfo, out_index: Dict[int, int], curve_index: Dict[int, int]):
    """animation.graph（ノードの一覧）と、評価で動く DAG ノード（出力の番号）の集合を返す。"""
    gid: Dict[int, int] = {}
    order: List[MaNode] = []
    for n in sorted(list(info.dag.values()) + list(info.dg.values()), key=lambda x: x.order):
        if id(n) in info.dg or id(n) in out_index:
            gid[id(n)] = len(order)
            order.append(n)
    ik_of = {id(e["handle"]): e for e in info.ik if not e["problem"]}
    nodes = []
    moving: Set[int] = set()
    for n in order:
        is_dag = id(n) not in info.dg
        entry = {"id": gid[id(n)], "name": n.name, "type": n.type, "dag": out_index[id(n)] if is_dag else -1}
        attrs = parse_attrs(ms.text, n, _STANDARD_ATTRS if is_dag else ())
        if attrs:
            entry["attrs"] = attrs
        inputs = {}
        for key, (src, sattr) in info.edges.get(id(n), {}).items():
            if src.type in CURVE_TYPES:
                if id(src) in curve_index:
                    inputs[key] = {"curve": curve_index[id(src)]}
            elif id(src) in gid and (src.type not in CONSTRAINT_TYPES or _evaluable(src)):
                inputs[key] = {"node": gid[id(src)], "attr": sattr}     # ターゲットのないコンストレイントは評価しない
        if inputs:
            entry["inputs"] = inputs
            if is_dag and any(_base(k) in _CHANNEL_KEYS for k in inputs):
                moving.add(out_index[id(n)])
        if n.type in CONSTRAINT_TYPES:
            driven = out_index.get(id(n.parent)) if n.parent is not None else None
            for key, (src, _sattr) in n.inputs.items():
                if n.type == "poleVectorConstraint" and key in ("crp", "ps") and id(src) in out_index:
                    entry["pivot"] = out_index[id(src)]
                elif _base(key) in ("cpim",) and n.parent is None and id(src) in out_index:
                    driven = out_index[id(src)]
            targets = {}
            for key, (src, _sattr) in n.inputs.items():
                m = _TG_RE.match(key)
                if m and m.group(2) in ("tpm", "tt", "tr", "ts", "tpm") and id(src) in gid:
                    targets[int(m.group(1))] = gid[id(src)]
            entry["driven"] = driven if driven is not None else -1
            entry["targets"] = [{"index": i, "node": targets[i]} for i in sorted(targets)]
        if id(n) in ik_of:
            e = ik_of[id(n)]
            entry["ik"] = {"solver": e["solver"], "chain": [out_index[id(j)] for j in e["chain"]]}
            moving.update(out_index[id(j)] for j in e["chain"][:-1])
        nodes.append(entry)
    return nodes, moving


_PARENT_MATRIX_PLUGS = {"pm", "pim", "parentMatrix", "parentInverseMatrix"}


def analyze_fallback(info: GraphInfo, kept: List[MaNode], bind_ids: Set[int], out_index: Dict[int, int]):
    """値を求められないノード（未対応のノードの影響を受けるノード）を調べる。

    接続の構造だけで決まる（フレームによらない）ので、ここでまとめて調べる:
      * unresolved: 移動・回転などの接続元が、未対応のノード（またはその影響を受けるノード）
      * tainted（不明）: ワールドの位置が分からない（unresolved か、親が tainted）。バインドポーズの情報があれば推定に回す
      * anchored（推定）: バインドポーズの情報があるノードが unresolved か、親が tainted。
        「確かな一番近い祖先」からの相対をバインドポーズのとおりに保つ（形を保ったまま、確かな部分の動きについていく）
    循環（コンストレイントの cpim ← 動かすノードの pim など）は「求められる」とみなして打ち切る。
    戻り値: (fallback のリスト, tainted のノード番号のリスト)
    """
    busy: Set[Tuple[str, int]] = set()
    memo: Dict[Tuple[str, int], object] = {}
    ik_of: Dict[int, MaNode] = {}
    for e in info.ik:
        if not e["problem"]:
            for j in e["chain"][:-1]:
                ik_of[id(j)] = e["handle"]

    def guarded(kind, n, fn, optimistic):
        key = (kind, id(n))
        if key in memo:
            return memo[key]
        if key in busy:
            return optimistic
        busy.add(key)
        try:
            v = fn()
        finally:
            busy.discard(key)
        memo[key] = v
        return v

    def parent_of(n):
        return n.parent if n.parent is not None and n.flag("it", True) else None

    def bad_source(src: MaNode, sattr: str) -> bool:
        if src.type in CURVE_TYPES:
            return False
        if src.type in SUPPORTED_DG:
            if src.type in CONSTRAINT_TYPES and not _evaluable(src):
                return True
            return guarded("dg", src, lambda: any(bad_source(s, a) for s, a in info.edges.get(id(src), {}).values()),
                           False)
        if _dag_like(src):
            b = _base(sattr)
            if b in _PARENT_MATRIX_PLUGS:
                return tainted(parent_of(src))
            if b in _MATRIX_PLUGS:
                return tainted(src)
            if b in _CHANNEL_KEYS:
                return any(k[0] == b[0] for k in unresolved(src))
            e = info.edges.get(id(src), {}).get(sattr)
            return bad_source(*e) if e else False
        return True                                      # 未対応のノード

    def unresolved(n: MaNode) -> List[str]:
        def calc():
            keys = [k for k, (s, a) in info.edges.get(id(n), {}).items()
                    if _base(k) in _CHANNEL_KEYS and bad_source(s, a)]
            h = ik_of.get(id(n))
            if h is not None and (tainted(h) or any(bad_source(s, a) for k, (s, a) in info.edges.get(id(h), {}).items()
                                                    if _base(k) in ("pv", "pvx", "pvy", "pvz", "twi", "ikb"))):
                keys.append("r（IK: %s）" % h.name)
            return keys
        return guarded("unres", n, calc, [])

    def tainted(n: Optional[MaNode]) -> bool:
        if n is None:
            return False

        def calc():
            bad = bool(unresolved(n)) or tainted(parent_of(n))
            return bad and id(n) not in bind_ids          # バインドポーズの情報があれば推定できる
        return guarded("taint", n, calc, False)

    fallback, tainted_out = [], []
    for n in kept:
        ni = out_index[id(n)]
        if id(n) in bind_ids and (unresolved(n) or tainted(parent_of(n))):
            a = parent_of(n)
            while a is not None and tainted(a):
                a = parent_of(a)
            fallback.append({"node": ni, "anchor": out_index.get(id(a), -1) if a is not None else -1,
                             "unresolved": unresolved(n)})
        elif tainted(n):
            tainted_out.append(ni)
    return fallback, tainted_out


def graph_warnings(info: GraphInfo) -> List[str]:
    out = []
    for t, items in sorted(info.unsupported.items(), key=lambda kv: -len(kv[1])):
        names = sorted({c for _n, c, _a in items})
        out.append("アニメーション: %s（%s など）は未対応のため、これにつながる %s の値は再生されません。"
                   % (t, items[0][0], "、".join(names[:4]) + (" ほか" if len(names) > 4 else "")))
    for e in info.ik:
        if e["problem"]:
            out.append("アニメーション: IK ハンドル %s は再生されません（%s）。" % (e["handle"].name, e["problem"]))
    return out
