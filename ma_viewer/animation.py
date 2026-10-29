# -*- coding: utf-8 -*-
"""アニメーションカーブ（animCurveTL / TA / TU）→ ビューア用のキー列（共通 JSON の animation）。

読み込みを 2 段階に分けるため、.ma の解析（ma_scene）ではカーブの中身を読まず、
ファイル上の範囲（MaNode.span）だけを覚えておく。シーンを表示したあとで、
表示するノードにつながっているカーブの範囲だけをここで読む。

キーの補間（スプライン・オートなどの接線の計算と、カーブの評価）はビューア（JS）側で行う。
ここではキーの時刻・値・接線の種類と、固定の接線（kix / kiy / kox / koy）を単位をそろえて渡すだけにする
（キーの多いモーションでも Python 側のループを増やさないため）。

単位:
  * 時刻はファイルの時間単位のフレーム（currentUnit -t）
  * 値は TL がファイルの長さの単位、TA が度、TU はそのまま
  * 固定の接線は (x: フレーム, y: 値の単位)。.ma では x が秒、y が内部単位（cm・ラジアン）で書かれている
"""
from __future__ import annotations

import base64
import math
import re
from array import array
from typing import Callable, Dict, List, Optional, Tuple

from .ma_scene import TRANSFORM_TYPES, MaNode, MaScene, np, numpy_enabled
from . import ma_reader as R
from . import mathutil as M

ProgressFn = Optional[Callable[[float, str], None]]

CURVE_TYPES = {"animCurveTL": "TL", "animCurveTA": "TA", "animCurveTU": "TU"}
# ドリブンキー（入力はドライバーの値。時間では評価しない。リグのノードとして graph に入れる）
DRIVEN_CURVE_TYPES = {"animCurveUA": "UA", "animCurveUL": "UL", "animCurveUU": "UU"}
CURVE_KINDS = {**CURVE_TYPES, **DRIVEN_CURVE_TYPES}

# アニメーションで動かせる属性（ノードの移動・回転・スケール）
CHANNELS = {
    "tx": ("t", 0), "ty": ("t", 1), "tz": ("t", 2),
    "rx": ("r", 0), "ry": ("r", 1), "rz": ("r", 2),
    "sx": ("s", 0), "sy": ("s", 1), "sz": ("s", 2),
}

# currentUnit -t の名前 → 1 秒あたりのフレーム数
_FPS = {
    "game": 15.0, "film": 24.0, "pal": 25.0, "ntsc": 30.0, "show": 48.0, "palf": 50.0, "ntscf": 60.0,
    "sec": 1.0, "min": 1.0 / 60.0, "hour": 1.0 / 3600.0, "millisec": 1000.0,
}
_FPS_RE = re.compile(r"^(\d+(?:\.\d+)?)(?:fps|df)$")

# 長さの単位 → cm（固定の接線の y は cm で書かれている）
_CM_PER_UNIT = {"mm": 0.1, "cm": 1.0, "m": 100.0, "km": 100000.0, "in": 2.54, "ft": 30.48,
                "yd": 91.44, "mi": 160934.4}

# カーブのブロック内の setAttr: 属性名・添字（範囲）・値
_SETATTR_RE = re.compile(r'setAttr\b[^";]*"\.(\w+)(?:\[(\d+)(?::(\d+))?\])?"([^;]*);')
_PLAYBACK_RE = re.compile(r"playbackOptions\b([^;\"]*)")
_PLAYBACK_FLAGS = {"-min": "min", "-minTime": "min", "-max": "max", "-maxTime": "max",
                   "-ast": "animStart", "-animationStartTime": "animStart",
                   "-aet": "animEnd", "-animationEndTime": "animEnd"}


def fps_of(time_unit: str) -> float:
    u = (time_unit or "film").strip()
    if u in _FPS:
        return _FPS[u]
    m = _FPS_RE.match(u)
    if m:
        return float(m.group(1))
    return 24.0


def playback_range(ms: MaScene) -> Dict[str, float]:
    """sceneConfigurationScriptNode の playbackOptions から再生範囲を読む（なければ空）。"""
    # リファレンスの中の script は使わない（Maya もリファレンスの再生範囲は使わない）
    nodes = [n for n in ms.nodes if n.type == "script" and n.span is not None and not n.ns]
    nodes.sort(key=lambda n: n.name != "sceneConfigurationScriptNode")
    for n in nodes:
        m = _PLAYBACK_RE.search(ms.text, n.span[0], n.span[1])
        if not m:
            continue
        toks = m.group(1).split()
        out: Dict[str, float] = {}
        for i, t in enumerate(toks[:-1]):
            key = _PLAYBACK_FLAGS.get(t)
            if key:
                try:
                    out[key] = float(toks[i + 1])
                except ValueError:
                    pass
        if out:
            return out
    return {}


def _floats(body: str) -> List[float]:
    if numpy_enabled():
        try:
            return np.fromstring(body, dtype=np.float64, sep=" ")
        except (ValueError, DeprecationWarning):
            pass
    return [R.to_float(t) for t in body.split()]


def _bool(tok: str) -> bool:
    return tok.lower() in ("yes", "true", "on", "1")


class Curve:
    """1 本のカーブのキー（単位はまだファイルのまま）"""
    __slots__ = ("node", "kind", "times", "values", "kit", "kot", "fixed", "tan", "weighted", "pre", "post")

    def __init__(self, node: MaNode, kind: str):
        self.node = node
        self.kind = kind
        self.times: List[float] = []
        self.values: List[float] = []
        self.kit: Dict[int, int] = {}
        self.kot: Dict[int, int] = {}
        self.fixed: Dict[str, Dict[int, float]] = {"kix": {}, "kiy": {}, "kox": {}, "koy": {}}
        self.tan = 0
        self.weighted = False
        self.pre = 0
        self.post = 0


def parse_curve(text: str, node: MaNode) -> Curve:
    """animCurve のブロック（node.span）からキーと設定を読む。"""
    cv = Curve(node, CURVE_KINDS[node.type])
    pieces: List[Tuple[int, object]] = []            # (先頭の添字, [時刻, 値, 時刻, 値, ...])
    a, b = node.span
    for m in _SETATTR_RE.finditer(text, a, b):
        name, i0, body = m.group(1), m.group(2), m.group(4)
        start = int(i0) if i0 is not None else 0
        if name in ("ktv", "keyTimeValue"):
            pieces.append((start, _floats(body)))
        elif name in ("kit", "kot", "keyTanInType", "keyTanOutType"):
            d = cv.kit if name in ("kit", "keyTanInType") else cv.kot
            for k, tok in enumerate(body.split()):
                try:
                    d[start + k] = int(float(tok))
                except ValueError:
                    pass
        elif name in ("kix", "kiy", "kox", "koy"):
            d = cv.fixed[name]
            for k, v in enumerate(_floats(body)):
                d[start + k] = float(v)
        elif name in ("tan", "tangentType"):
            toks = body.split()
            if toks:
                cv.tan = int(float(toks[0]))
        elif name in ("wgt", "weightedTangents"):
            toks = body.split()
            if toks:
                cv.weighted = _bool(toks[0])
        elif name in ("pre", "preInfinity", "pst", "postInfinity"):
            toks = body.split()
            if toks:
                v = int(float(toks[0]))
                if name in ("pre", "preInfinity"):
                    cv.pre = v
                else:
                    cv.post = v
    if len(pieces) == 1 and pieces[0][0] == 0:
        flat = pieces[0][1]
        cv.times = flat[0::2]
        cv.values = flat[1::2]
    elif pieces:
        keys: Dict[int, Tuple[float, float]] = {}
        for start, flat in pieces:
            for k in range(len(flat) // 2):
                keys[start + k] = (float(flat[2 * k]), float(flat[2 * k + 1]))
        order = sorted(keys)
        cv.times = [keys[k][0] for k in order]
        cv.values = [keys[k][1] for k in order]
        remap = {k: j for j, k in enumerate(order)}
        cv.kit = {remap[k]: v for k, v in cv.kit.items() if k in remap}
        cv.kot = {remap[k]: v for k, v in cv.kot.items() if k in remap}
        for name in cv.fixed:
            cv.fixed[name] = {remap[k]: v for k, v in cv.fixed[name].items() if k in remap}
    n = min(len(cv.times), len(cv.values))
    cv.times, cv.values = cv.times[:n], cv.values[:n]
    return cv


def _pack(values, dtype: str) -> dict:
    """数値の列を base64 のバイナリにする（JSON の数値より小さく、変換も速い）。リトルエンディアン。"""
    if isinstance(values, (bytes, bytearray)):
        data = bytes(values)
    elif numpy_enabled():
        arr = np.asarray(values, dtype="<f4" if dtype == "float32" else "u1")
        data = arr.tobytes()
    else:
        arr = array("f" if dtype == "float32" else "B", values)
        if arr.itemsize > 1 and array("H", [1]).tobytes()[0] != 1:
            arr.byteswap()
        data = arr.tobytes()
    return {"dtype": dtype, "count": len(values), "data": base64.b64encode(data).decode("ascii")}


def unpack(entry) -> list:
    """_pack の逆（テスト・確認用）。数値のリストもそのまま受け付ける。"""
    if isinstance(entry, list):
        return entry
    raw = base64.b64decode(entry["data"])
    arr = array("f" if entry["dtype"] == "float32" else "B")
    arr.frombytes(raw)
    if arr.itemsize > 1 and array("H", [1]).tobytes()[0] != 1:
        arr.byteswap()
    return list(arr)


def _concat(chunks):
    if numpy_enabled():
        return np.concatenate([np.asarray(c, dtype=np.float64) for c in chunks]) if chunks else np.zeros(0)
    out: List[float] = []
    for c in chunks:
        out.extend(c)
    return out


def _scaled(values, k: float):
    if k == 1.0:
        return values
    if numpy_enabled():
        return np.asarray(values, dtype=np.float64) * k
    return [v * k for v in values]


def curve_record(cv: Curve, offset: int, fps: float, ang_k: float, cm: float):
    """1 本のカーブを共通 JSON の形にする（単位をそろえる）。

    戻り値: (値, 接線の種類（キーごとに 2 バイト）, 固定の接線（5 つずつ。キーの番号は offset から）, curves の 1 項目)
    """
    n = len(cv.times)
    vk = ang_k if cv.kind in ("TA", "UA") else 1.0
    tk = (180.0 / math.pi) if cv.kind in ("TA", "UA") else (1.0 / cm if cv.kind in ("TL", "UL") else 1.0)
    xk = fps if cv.kind[0] == "T" else 1.0           # 固定の接線の x: 時間は秒 → フレーム、ドリブンキーは入力の値のまま
    chunk = bytearray(2 * n)
    for k, v in cv.kit.items():
        if 0 <= k < n:
            chunk[2 * k] = v & 255
    for k, v in cv.kot.items():
        if 0 <= k < n:
            chunk[2 * k + 1] = v & 255
    fixed: List[float] = []
    fx = cv.fixed
    nan = float("nan")
    for k in sorted(set(fx["kix"]) | set(fx["kox"])):
        ix, iy = fx["kix"].get(k), fx["kiy"].get(k)
        ox, oy = fx["kox"].get(k), fx["koy"].get(k)
        fixed.extend((offset + k,
                      ix * xk if ix is not None and iy is not None else nan,
                      iy * tk if ix is not None and iy is not None else nan,
                      ox * xk if ox is not None and oy is not None else nan,
                      oy * tk if ox is not None and oy is not None else nan))
    meta = {"name": cv.node.name, "type": cv.kind, "offset": offset, "count": n,
            "tangent": cv.tan, "weighted": cv.weighted, "pre": cv.pre, "post": cv.post}
    return _scaled(cv.values, vk), chunk, fixed, meta


def build_animation(ms: MaScene, out_index: Dict[int, int], progress: ProgressFn = None) -> Optional[dict]:
    """表示するノード（out_index にあるノード）を動かすカーブを読み、共通 JSON の animation を作る。

    カーブがなければ None。progress は (0〜1, 文言) で呼ぶ（例外を投げれば中止できる）。
    """
    import time
    t0 = time.perf_counter()
    fps = fps_of(ms.time_unit)
    ang_k = 180.0 / math.pi if ms.angular_unit in ("rad", "radian") else 1.0
    cm = _CM_PER_UNIT.get(ms.linear_unit, 1.0)
    warnings: List[str] = []

    # --- カーブ → 動かす属性 ---------------------------------------------
    targets: Dict[int, List[Tuple[int, str]]] = {}        # id(カーブ) → [(ノード番号, 属性)]
    curve_nodes: Dict[int, MaNode] = {}
    skipped_attr: Dict[str, int] = {}
    hidden_targets = 0
    via: Dict[str, int] = {}
    graph_curves = ms.graph_info.curves if ms.graph_info is not None else {}
    for src, sattr, dst, dattr in ms.connections:
        if src.type not in CURVE_TYPES or src.span is None or sattr not in ("o", "output"):
            continue
        ni = out_index.get(id(dst))
        if ni is None:
            if id(src) in graph_curves:
                continue                                  # リグの入力（コンストレイントのウェイトなど）
            if dst.type in TRANSFORM_TYPES or dst.is_dag:
                hidden_targets += 1                       # コントローラーなど、表示しないノード
            else:
                via[dst.type] = via.get(dst.type, 0) + 1
            continue
        if dattr in CHANNELS:
            targets.setdefault(id(src), []).append((ni, dattr))
            curve_nodes[id(src)] = src
        elif id(src) not in graph_curves:                 # 独自の属性（blendPoint1 など）はリグの入力なら使う
            skipped_attr[dattr] = skipped_attr.get(dattr, 0) + 1

    kept_nodes = {i: n for n in ms.nodes for i in [out_index.get(id(n))] if i is not None}
    # リグ（コンストレイント・IK・計算ノード）。入力になっているカーブも読む
    info = ms.graph_info
    has_graph = info is not None and (not info.empty or bool(info.unsupported))
    if has_graph:
        for cid, c in info.curves.items():
            if c.span is not None:
                curve_nodes[cid] = c
        for cid, c in info.dg.items():                   # ドリブンキー
            if c.type in DRIVEN_CURVE_TYPES and c.span is not None:
                curve_nodes[cid] = c

    if not targets and not has_graph:
        return None

    # Trax のクリップのカーブ（clipLibrary につながるもの）
    trax_curves = {id(s) for s, _sa, d, _da in ms.connections if d.type == "clipLibrary" and s.type in CURVE_TYPES}
    # --- カーブの読み込み ------------------------------------------------
    order = sorted(curve_nodes.values(), key=lambda c: c.order)
    curve_index: Dict[int, int] = {}
    curves_out = []
    channels_out = []
    times_chunks, values_chunks = [], []
    range_chunks = []                                      # 時間のカーブのキーの時刻（再生範囲に使う）
    types = bytearray()                                    # キーごとに (入りの種類, 出の種類)。0 はカーブの既定
    fixed: List[float] = []
    offset = 0
    total = max(len(order), 1)
    for ci, node in enumerate(order):
        if progress is not None and ci % 64 == 0:
            progress(ci / total, "アニメーションを読み込み中 %d%%" % int(ci * 100 / total))
        cv = parse_curve(ms.text, node)
        n = len(cv.times)
        if n == 0:
            continue
        values, chunk, fixed_k, meta = curve_record(cv, offset, fps, ang_k, cm)
        times_chunks.append(cv.times)
        trax = id(node) in trax_curves
        if cv.kind[0] == "T" and not trax:
            range_chunks.append(cv.times)                  # Trax のクリップのキーはクリップの中の時間なので除く
        values_chunks.append(values)
        types += chunk
        fixed.extend(fixed_k)
        index = len(curves_out)
        curve_index[id(node)] = index
        curves_out.append(meta)
        if trax:
            curves_out[-1]["trax"] = True
        for ni, attr in targets.get(id(node), ()):
            channels_out.append({"node": ni, "attr": attr, "curve": index})
        offset += n

    graph_nodes, moving = [], set()
    if has_graph:
        from .rig import build_graph, graph_warnings
        graph_nodes, moving = build_graph(ms, info, out_index, curve_index, getattr(ms, "curve_shapes", {}))
        warnings.extend(graph_warnings(info))
        for g in graph_nodes:
            if g["type"].endswith("Constraint") and not g.get("targets"):
                warnings.append("アニメーション: %s にターゲットがないため、評価しません。" % g["name"])
    props_out = build_props(ms, info, out_index, curve_index) if has_graph else []
    # 値を求められないノード: バインドポーズの形で推定する（fallback）・推定もできない（tainted）
    fallback, tainted = [], []
    if has_graph:
        from .rig import analyze_fallback
        kept_list = [kept_nodes[i] for i in sorted(kept_nodes)]
        fallback, tainted = analyze_fallback(info, kept_list, ms.bind_ids, out_index)
        if fallback or tainted:
            warnings.append("アニメーション: 値を求められないノードのうち %d 個はバインドポーズの形で推定して表示し、"
                            "%d 個は推定できないためファイルの値（既定値）のまま表示します。" % (len(fallback), len(tainted)))
    if not channels_out and not moving and not fallback and not props_out:
        return None
    channels_out.sort(key=lambda c: (c["node"], c["attr"]))

    # --- 動くノードの静的な値（ビューアがフレームごとにローカル行列を組み立て直すため）------
    # カーブ・リグで動くノード、リグの評価に使う DAG ノード、親のスケールで動く子ジョイント
    animated = {c["node"] for c in channels_out} | moving
    in_graph = {g["dag"] for g in graph_nodes if g["dag"] >= 0}
    # スケールが動くノード（子ジョイントのスケール補正が変わる）
    scaled = {c["node"] for c in channels_out if c["attr"][0] == "s"} | {
        g["dag"] for g in graph_nodes if g["dag"] >= 0 and any(k[0] == "s" for k in g.get("inputs", {}))}
    rest_nodes = []
    for ni in sorted(kept_nodes):
        n = kept_nodes[ni]
        is_src = n.inverse_scale_source()
        is_idx = out_index.get(id(is_src)) if is_src is not None else None
        if ni not in animated and ni not in in_graph and not (is_idx is not None and is_idx in scaled):
            continue
        rest_nodes.append(rest_entry(n, ni, ang_k, is_src, is_idx))

    # --- 警告 -------------------------------------------------------------
    if via:
        warnings.append("アニメーション: %s を経由するカーブは再生しません（%d 本）。" % (
            "・".join(sorted(via)), sum(via.values())))
    if skipped_attr:
        warnings.append("アニメーション: 移動・回転・スケール以外の属性（%s）のカーブは再生しません。"
                        % "・".join(sorted(skipped_attr)[:8]))
    if hidden_targets:
        warnings.append("アニメーション: 表示していないノード（コントローラーなど）を動かすカーブ %d 本は読み込みません"
                        "（表示するノードへの影響の有無は、リグの診断の「読み込まないカーブ」で確認できます）。"
                        % hidden_targets)

    times_all = _concat(times_chunks)
    values_all = _concat(values_chunks)
    range_all = _concat(range_chunks)
    pb = playback_range(ms)
    now = ms.current_time if ms.current_time is not None else 1.0
    t_first = float((np.min if numpy_enabled() else min)(range_all)) if len(range_all) else now
    t_last = float((np.max if numpy_enabled() else max)(range_all)) if len(range_all) else now
    start = pb.get("min", t_first)
    end = pb.get("max", t_last)
    if end < start:
        start, end = end, start
    return {
        "fps": fps,
        "timeUnit": ms.time_unit,
        "upAxis": ms.up_axis,
        "start": start,
        "end": end,
        "animStart": pb.get("animStart", min(start, t_first)),
        "animEnd": pb.get("animEnd", max(end, t_last)),
        "current": ms.current_time if ms.current_time is not None else start,
        "curves": curves_out,
        "channels": channels_out,
        "nodes": rest_nodes,
        "graph": graph_nodes,
        # 自作ノードの定義（node_defs）: 型 → 属性と計算（IR）。graph のノードの "def" から引く
        "nodeDefs": {t: nd.to_json() for t, nd in sorted(_used_defs(ms, graph_nodes).items())},
        "fallback": fallback,
        "tainted": tainted,
        "props": props_out,
        "times": _pack(times_all, "float32"),
        "values": _pack(values_all, "float32"),
        "tangentTypes": _pack(types, "uint8"),
        "fixedTangents": _pack(fixed, "float32"),
        "warnings": warnings,
        "stats": {"curves": len(curves_out), "keys": offset, "channels": len(channels_out),
                  "nodes": len(animated), "graphNodes": len(graph_nodes),
                  "seconds": round(time.perf_counter() - t0, 4)},
    }


def _used_defs(ms: MaScene, graph_nodes: List[dict]) -> dict:
    """graph で使っている自作ノードの定義（型 → NodeDef）"""
    used = {g["def"] for g in graph_nodes if g.get("def")}
    defs = getattr(ms, "node_defs", None)
    return {t: defs.nodes[t] for t in used if defs is not None and t in defs.nodes}


def build_props(ms: MaScene, info, out_index: Dict[int, int], curve_index: Dict[int, int]) -> List[dict]:
    """移動・回転・スケール以外で、接続で決まる属性（表示・カメラの焦点距離など）。ビューアがフレームごとに評価する。

    [{"kind": "node" | "mesh" | "camera", "index": 番号, "inputs": {属性: 接続元}, "static": {...}}]。
    接続元は graph の inputs と同じ形。評価できない接続元（未対応のノード）の属性は入れない（ファイルの値のまま）。
    """
    from .extract_ma import _hidden_by_layer
    from .rig import CONSTRAINT_TYPES, VIS_DEFAULTS, _evaluable
    index_of = {"node": out_index, "mesh": getattr(ms, "mesh_index", {}), "camera": getattr(ms, "camera_index", {})}
    by_target: Dict[Tuple[str, int], dict] = {}
    for kind, consumer, key, src, sattr in info.props:
        idx = index_of[kind].get(id(consumer))
        if idx is None:
            continue
        if src.type in CURVE_TYPES:
            if id(src) not in curve_index:
                continue
            inp = {"curve": curve_index[id(src)]}
        elif id(src) in info.gid and (src.type not in CONSTRAINT_TYPES or _evaluable(src)):
            inp = {"node": info.gid[id(src)], "attr": sattr}
        else:
            continue
        e = by_target.get((kind, idx))
        if e is None:
            e = by_target[(kind, idx)] = {"kind": kind, "index": idx, "inputs": {}}
            if kind in ("node", "mesh"):
                # 接続されていない表示の属性はファイルの値（ディスプレイレイヤーで隠れているかも）
                e["static"] = {k: (1.0 if consumer.flag(k, d >= 0.5) else 0.0) for k, d in VIS_DEFAULTS.items()}
                e["static"]["layerHidden"] = _hidden_by_layer(consumer)
        e["inputs"][key] = inp
    return [by_target[k] for k in sorted(by_target)]


def rest_entry(n: MaNode, ni: int, ang_k: float, is_src: Optional[MaNode], is_idx: Optional[int]) -> dict:
    """ローカル行列の材料（角度は度）。アニメーションしない成分はこの値のまま使う。"""
    deg = lambda v: [v[0] * ang_k, v[1] * ang_k, v[2] * ang_k]  # noqa: E731
    ro_i = int(n.xattrs.get("ro", 0) or 0)
    e = {
        "node": ni,
        "joint": n.type == "joint",
        "ro": ro_i if 0 <= ro_i < 6 else 0,
        "t": list(n.vec3("t")), "r": deg(n.vec3("r")), "s": list(n.vec3("s")),
        "ra": deg(n.vec3("ra")),
    }
    opm = n.xattrs.get("opm")
    if opm is not None and len(opm) == 16 and any(abs(a - b) > 1e-12 for a, b in zip(opm, M.identity())):
        e["opm"] = [float(x) for x in opm]
    if is_src is not None:                             # 親のスケールの打ち消し（ジョイントの segmentScaleCompensate など）
        e["isNode"] = is_idx if is_idx is not None else -1
        e["isScale"] = list(is_src.vec3("s"))
    if n.type == "joint":
        e["jo"] = deg(n.vec3("jo"))
    else:
        for k in ("rp", "sp", "rpt", "spt", "sh"):
            v = n.vec3(k)
            if any(v):
                e[k] = list(v)
    return e


def rest_matrix(e: dict) -> List[float]:
    """rest_entry からローカル行列を組み立てる（ビューアの計算と同じ。テスト用）"""
    rad = lambda v: [x * math.pi / 180.0 for x in v]  # noqa: E731
    ro = M.ROTATE_ORDERS[e.get("ro", 0)]
    ips = e.get("isScale") if "isScale" in e else None
    if e["joint"]:
        m = M.joint_matrix(t=e["t"], r=rad(e["r"]), s=e["s"], ro=ro, ra=rad(e["ra"]), jo=rad(e.get("jo", [0, 0, 0])),
                           inverse_parent_scale=ips)
    else:
        z = [0.0, 0.0, 0.0]
        m = M.transform_matrix(t=e["t"], r=rad(e["r"]), s=e["s"], ro=ro, ra=rad(e["ra"]), rp=e.get("rp", z),
                               sp=e.get("sp", z), rpt=e.get("rpt", z), spt=e.get("spt", z), sh=e.get("sh", z),
                               inverse_parent_scale=ips)
    return M.mul(m, e["opm"]) if "opm" in e else m
