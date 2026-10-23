# -*- coding: utf-8 -*-
"""リグの診断: 再生がおかしいときに、原因になりそうなノードを探すための一覧を作る。

  python -m ma_viewer rig scene.ma          （Qt 版は［表示］→［リグの診断］）

内容:
  * ファイルが読み込むプラグイン（自作ノードの手がかり）
  * 評価できない（未対応・未知の型の）ノードと、それを使っているノード
  * IK ハンドルごとに、ソルバー・ジョイント・極ベクトル・ひねり・ハンドルの位置を何が決めているか（上流のつながり）
    行頭の印: ✓ 評価できる / ★ 評価できない（ここから先はファイルの値） / ・ ファイルの値（接続なし）
  * 値を求められないノード（バインドポーズの形で推定・推定できない）
"""
from __future__ import annotations

from typing import List, Optional, Set

from .ma_scene import MaNode, MaScene
from .rig import (CONSTRAINT_TYPES, CURVE_TYPES, GEOMETRY_TYPES, SUPPORTED_DG, _CHANNEL_KEYS, _DISPLAY_KEYS, _MATRIX_PLUGS,
                  _base, _dag_like, _evaluable)

MAX_DEPTH = 10
MAX_LINES = 60


class _Tracer:
    """接続を上流へたどって、つながりを字下げした行にする"""

    def __init__(self, ms: MaScene):
        self.ms = ms
        self.info = ms.graph_info
        self.lines: List[str] = []
        self.seen: Set[tuple] = set()
        self.bad: List[str] = []

    def status(self, n: MaNode) -> str:
        if n.type in CURVE_TYPES:
            return "✓"
        if n.type == "expression":
            return "✓" if _evaluable(n, self.info) else "★"
        if n.type in CONSTRAINT_TYPES:
            return "✓" if _evaluable(n) else "★"
        if n.type in SUPPORTED_DG or n.type in GEOMETRY_TYPES or _dag_like(n):
            return "✓"
        return "★"

    def label(self, n: MaNode, attr: str) -> str:
        what = n.type
        if n.type in CURVE_TYPES:
            what = "アニメーションカーブ"
        elif n.type == "expression" and not _evaluable(n, self.info):
            what = "expression・解釈できない: %s" % self.info.expression_problems.get(n.name, "")
        elif self.status(n) == "★":
            what = "%s・未対応" % n.type
        return "%s.%s（%s）" % (n.name, attr, what)

    def add(self, depth: int, text: str):
        if len(self.lines) < MAX_LINES:
            self.lines.append("    " + "  " * depth + text)
        elif len(self.lines) == MAX_LINES:
            self.lines.append("    " + "  " * depth + "…（以下省略）")

    def plug(self, consumer: MaNode, key: str, depth: int):
        """consumer.key の入力をたどる（接続のない DAG ノードの値は書かない）"""
        src, sattr = consumer.inputs[key]
        if src is consumer:
            return                                             # 自分の属性（コンストレイントのウェイトなど）
        mark = self.status(src)
        line = "%s %s ← %s" % (mark, key, self.label(src, sattr))
        if mark == "★":
            self.add(depth, line)
            self.bad.append("%s（%s）" % (src.name, src.type))
            return
        if src.type in CURVE_TYPES or depth >= MAX_DEPTH:
            self.add(depth, line)
            return
        k = (id(src), _base(sattr) if _dag_like(src) else "")
        if k in self.seen:
            if not _dag_like(src):
                self.add(depth, line + " …上に同じ")
            return
        self.seen.add(k)
        at = len(self.lines)
        self.add(depth, line)
        before = len(self.lines)
        if _dag_like(src):
            self.dag(src, sattr, depth + 1)
            if len(self.lines) == before and depth > 0:
                del self.lines[at:]                            # 接続のない DAG ノード: ファイルの値なので省く
            return
        # 評価で使う接続だけをたどる（ディスプレイレイヤーの .do・clusterHandle の .x などは値に関係しない）
        used = self.info.edges.get(id(src)) if self.info is not None and id(src) in self.info.dg else None
        for key2 in sorted(used if used is not None else src.inputs):
            if used is None and (_base(key2) in _DISPLAY_KEYS or key2 in ("tim", "time", "x")):
                continue
            self.plug(src, key2, depth + 1)

    def dag(self, n: MaNode, attr: str, depth: int):
        """DAG ノードの値: 行列ならそのノードと祖先の移動・回転など、チャンネルならその接続"""
        b = _base(attr)
        if b in _MATRIX_PLUGS:
            x: Optional[MaNode] = n if b not in ("pm", "pim", "parentMatrix", "parentInverseMatrix") else n.parent
            while x is not None:
                for k in sorted(x.inputs):
                    if _base(k) in _CHANNEL_KEYS:
                        self.plug(x, k, depth)
                x = x.parent if x.flag("it", True) else None
        elif b in _CHANNEL_KEYS:
            for k in sorted(n.inputs):
                if _base(k) in _CHANNEL_KEYS and k[0] == b[0]:
                    self.plug(n, k, depth)
        elif attr in n.inputs:
            self.plug(n, attr, depth)


def _ik_section(ms: MaScene, entry: dict) -> List[str]:
    h: MaNode = entry["handle"]
    chain = " → ".join(j.name for j in entry["chain"]) or "（不明）"
    out = ["- %s（%s）: %s" % (h.name, entry["solver"], chain)]
    if entry["problem"]:
        out.append("    ★ 再生しない: %s" % entry["problem"])
        return out
    parts = [("ハンドルの位置", lambda t: t.dag(h, "wm", 0))]
    if entry["solver"] == "ikRPsolver":
        pv = [k for k in sorted(h.inputs) if _base(k) in ("pv", "pvx", "pvy", "pvz")]
        parts.append(("極ベクトル", (lambda t, pv=pv: [t.plug(h, k, 0) for k in pv]) if pv else None))
        parts.append(("ひねり（twist）", (lambda t: t.plug(h, "twi", 0)) if "twi" in h.inputs else None))
    if entry["solver"] == "ikSplineSolver":
        keys = [k for k in sorted(h.inputs) if _base(k) in ("ic", "twi", "rol", "dwum", "dwue", "dwuv", "dwve")]
        parts.append(("カーブ・ひねり・world up", (lambda t, keys=keys: [t.plug(h, k, 0) for k in keys]) if keys else None))
    parts.append(("開始ジョイントの親", lambda t: t.dag(entry["chain"][0], "pm", 0)))
    for title, fn in parts:
        if fn is None:
            out.append("  %s: ファイルの値（接続なし）" % title)
            continue
        t = _Tracer(ms)
        fn(t)
        if not t.lines:
            out.append("  %s: ファイルの値（接続なし）" % title)
            continue
        verdict = "★ 評価できないノードがある: %s" % "、".join(dict.fromkeys(t.bad)) if t.bad else "✓ すべて評価できる"
        out.append("  %s: %s" % (title, verdict))
        out.extend(t.lines)
    return out


# 下流をたどるときに無視する接続先のノード（表示・管理用。値の計算に関係しない）
_MANAGER_TYPES = {"displayLayer", "displayLayerManager", "renderLayer", "renderLayerManager", "objectSet", "shadingEngine",
                  "nodeGraphEditorInfo", "hyperLayout", "hyperView", "hyperGraphInfo", "animLayer", "character",
                  "lightLinker", "partition", "controller"}
_MAX_VISIT = 20000


def hidden_curve_targets(ms: MaScene):
    """読み込まないカーブ（表示するノード・リグの入力でないノードを動かすもの）と、動かすノードの下流の行き先。

    戻り値: [(ノード, [(カーブ名, 属性)], 結果)]。結果は ("reach", 経路の文字列) か ("mesh", 経路) か ("none", 行き先の型の一覧)
    経路が見つかったら、表示するノードに影響しているのに、こちらがたどれていない（診断で ★ にする）。
    """
    from .animation import CURVE_TYPES as TIME_CURVES
    info = ms.graph_info
    out_index = getattr(ms, "out_index", {}) or {}
    graph_ids = set(info.dg) | set(info.dag) if info is not None else set()
    targets = {}
    for src, sattr, dst, dattr in ms.connections:
        if src.type not in TIME_CURVES or id(dst) in out_index or (info is not None and id(src) in info.curves):
            continue
        targets.setdefault(id(dst), (dst, []))[1].append((src.name, dattr))
    if not targets:
        return []
    down = {}
    for src, sattr, dst, dattr in ms.connections:
        if _base(sattr) in _DISPLAY_KEYS or _base(dattr) in _DISPLAY_KEYS or dst.type in _MANAGER_TYPES:
            continue
        down.setdefault(id(src), []).append((sattr, dst, dattr))
    result = []
    for nid, (node, curves) in targets.items():
        prev = {nid: None}
        queue = [node]
        found = None
        seen_types = set()
        while queue and len(prev) < _MAX_VISIT:
            x = queue.pop(0)
            if x is not node and (id(x) in out_index or id(x) in graph_ids):
                found = ("reach", x)
                break
            if x is not node and x.type == "mesh":
                found = found or ("mesh", x)
                continue
            nexts = [(sa, d, da) for sa, d, da in down.get(id(x), ())]
            nexts += [("（子）", c, "") for c in x.children]           # DAG の子は親の動きについていく
            for sa, d, da in nexts:
                if id(d) in prev:
                    continue
                prev[id(d)] = (x, sa, da)
                seen_types.add(d.type)
                queue.append(d)
        if found is None:
            result.append((node, curves, ("none", sorted(seen_types))))
            continue
        # 経路を組み立てる（動かすノード → … → 届いたノード）
        steps, y = [], found[1]
        while prev.get(id(y)) is not None:
            px, sa, da = prev[id(y)]
            steps.append("%s.%s → %s.%s（%s）" % (px.name, sa, y.name, da, y.type) if da else "%s の子 %s" % (px.name, y.name))
            y = px
        result.append((node, curves, (found[0], "、".join(reversed(steps)))))
    return result


def rig_report(ms: MaScene, scene: dict, anim: Optional[dict]) -> str:
    """scene_to_dict（と build_animation）を済ませた MaScene から、診断の文章を作る"""
    info = ms.graph_info
    names = [n["name"] for n in scene["nodes"]]
    out = ["リグの診断: %s" % (ms.source_path or "")]
    out.append("（✓ 評価できる / ★ 評価できない。★ から先の値はファイルに保存された値のまま）")
    out.append("")
    out.append("■ プラグイン（requires）: %s" % ("、".join(ms.plugins) if ms.plugins else "なし"))
    custom = getattr(ms, "custom_transforms", {}) or {}
    if custom:
        out.append("■ transform として扱った自作ノード: %s" % "、".join(
            "%s（%s）" % (t, "、".join(names[:5]) + (" ほか" if len(names) > 5 else "")) for t, names in sorted(custom.items())))
    out.append("")
    out.append("■ 評価できないノード")
    if info is None or (not info.unsupported and not any(e["problem"] for e in info.ik)):
        out.append("  なし")
    else:
        for t, items in sorted(info.unsupported.items(), key=lambda kv: -len(kv[1])):
            out.append("- %s: %d か所" % (t, len(items)))
            for name, consumer, attr in items[:8]:
                out.append("    %s → %s.%s" % (name, consumer, attr))
            if len(items) > 8:
                out.append("    …ほか %d か所" % (len(items) - 8))
        for name, problem in sorted(info.expression_problems.items()):
            out.append("  expression %s: %s" % (name, problem))
    out.append("")
    out.append("■ IK ハンドル")
    if info is None or not info.ik:
        out.append("  なし")
    else:
        for e in info.ik:
            out.extend(_ik_section(ms, e))
    out.append("")
    out.append("■ 読み込まないカーブ（表示していないノードを動かすもの）")
    hidden = hidden_curve_targets(ms)
    if not hidden:
        out.append("  なし")
    reach = [h for h in hidden if h[2][0] == "reach"]
    mesh = [h for h in hidden if h[2][0] == "mesh"]
    none = [h for h in hidden if h[2][0] == "none"]
    for node, curves, (_k, path) in reach:
        out.append("★ %s（%s）: 表示するノード・リグに影響しているのに、たどれていない（カーブ %d 本: %s）"
                   % (node.name, node.type, len(curves), "、".join("%s→%s" % c for c in curves[:4])))
        out.append("    経路: %s" % path)
    for node, curves, (_k, path) in mesh:
        out.append("- %s（%s）: メッシュの変形（blendShape など。未対応）に使われている（カーブ %d 本）。経路: %s"
                   % (node.name, node.type, len(curves), path))
    if none:
        out.append("✓ 表示するノードに影響しない: %d 個（%s）" % (
            len(none), "、".join("%s（%s）" % (n.name, "・".join(sorted({a for _c, a in c}))[:40]) for n, c, _r in none[:12])
            + (" ほか" if len(none) > 12 else "")))
    out.append("")
    out.append("■ 値を求められないノード")
    fb = (anim or {}).get("fallback") or []
    tainted = (anim or {}).get("tainted") or []
    if not fb and not tainted:
        out.append("  なし")
    for f in fb:
        anchor = names[f["anchor"]] if f["anchor"] >= 0 else "ワールド"
        out.append("- %s: バインドポーズの形で推定（基準 %s、求められない属性 %s）"
                   % (names[f["node"]], anchor, "・".join(f["unresolved"]) or "親"))
    if tainted:
        out.append("- 推定できない（ファイルの値のまま）: %s" % "、".join(names[i] for i in tainted[:30])
                   + (" ほか %d 個" % (len(tainted) - 30) if len(tainted) > 30 else ""))
    warnings = scene["warnings"] + (anim or {}).get("warnings", [])
    if warnings:
        out.append("")
        out.append("■ 警告")
        out.extend("- " + w for w in warnings)
    return "\n".join(out)


def format_verification(result: Optional[dict]) -> str:
    """ビューアの保存時のフレームの再現チェック（mayaViewer.verifyRig() の結果）を文章にする"""
    out = ["■ 保存時のフレームの再現チェック（IK）"]
    if not result:
        out.append("  アニメーション（リグ）を読み込んでいないため、確認できません")
        return "\n".join(out)
    handles = result.get("handles") or []
    out.append("  フレーム %g で、IK で動くジョイントの回転を、ファイルに保存された値（保存したときに Maya が解いた結果）と比べます。"
               % result.get("frame", 0))
    out.append("  ねじれ = 骨の軸まわりのずれ、曲がり = 骨の向きのずれ（度）")
    if not handles:
        out.append("  IK ハンドルはありません")
    for h in handles:
        mark = "✓" if h["ok"] else "★"
        extra = ""
        if h.get("pv") is not None:
            extra = "・極ベクトル（ワールド）(%s)・ひねり %.2f°" % (", ".join("%.3f" % v for v in h["pv"]), h["twist"])
        out.append("%s %s（%s）%s" % (mark, h["handle"], h["solver"], extra))
        if not h["joints"]:
            out.append("    比べられるジョイントがありません（回転が接続で決まる）")
        for j in h["joints"]:
            jm = "✓" if j["ok"] else "★"
            out.append("    %s %s: ずれ %.2f°（ねじれ %+.2f°・曲がり %.2f°）・位置 %.4f"
                       % (jm, j["name"], j["angle"], j["roll"], j["bend"], j["position"]))
        if h.get("reach") is not None and h["reach"] > 1e-3:
            out.append("    ★ ファイルの値の終端が、評価したハンドルの位置から %.4f 離れている"
                       "（ハンドルを動かすリグの側がずれているか、Maya でも届いていなかった）" % h["reach"])
        best = h.get("best")
        if best:
            out.append("    → 一番合う解き方: %s（ずれ %.2f°。今の解き方は %.2f°）" % (best["label"], best["error"], h["error"]))
    bad = [h["handle"] for h in handles if not h["ok"]]
    out.append("")
    out.append("  → ずれのある IK: %s" % ("、".join(bad) if bad else "なし（保存時のフレームでは Maya と一致）"))
    # 一番合う解き方の集計（ずれが 0.5° 以下に収まったもの）。多くの IK で同じものが合えば、それが Maya の解き方
    fits = {}
    for h in handles:
        b = h.get("best")
        if b and b["error"] <= 0.5:
            fits.setdefault(b["label"], []).append(h["handle"])
    for label, names in sorted(fits.items(), key=lambda kv: -len(kv[1])):
        out.append("  → 「%s」にすると一致する IK: %d 個（%s）" % (label, len(names), "、".join(names[:8])))
    unfit = [h["handle"] for h in handles if not h["ok"] and not (h.get("best") and h["best"]["error"] <= 0.5)]
    if unfit:
        out.append("  → どの解き方でも一致しない IK: %s（ハンドルや極ベクトルを動かすリグの側か、ほかの原因）" % "、".join(unfit))
    return "\n".join(out)


def rig_report_file(path: str) -> str:
    from .animation import build_animation
    from .extract_ma import scene_to_dict
    from .ma_scene import parse_ma_file
    ms = parse_ma_file(path)
    scene = scene_to_dict(ms)
    anim = build_animation(ms, ms.out_index) if ms.text else None
    return rig_report(ms, scene, anim)
