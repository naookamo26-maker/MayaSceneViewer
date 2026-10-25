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

import json
import re
from typing import List, Optional, Set

from .custom_nodes import FILE_NAME, template_for

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
        if n.type in SUPPORTED_DG or n.type in GEOMETRY_TYPES or _dag_like(n) or n.node_def is not None:
            return "✓"
        return "★"

    def label(self, n: MaNode, attr: str) -> str:
        what = n.type
        if n.type in CURVE_TYPES:
            what = "アニメーションカーブ"
        elif n.node_def is not None:
            what = "%s・定義 %s で評価" % (n.type, n.node_def.source)
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
        out.extend(_spline_curve_tree(ms, entry))
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
    out.extend(_spline_curve_tree(ms, entry))
    return out


def _spline_curve_tree(ms: MaScene, entry: dict) -> List[str]:
    h: MaNode = entry["handle"]
    if entry["solver"] != "ikSplineSolver" or "ic" not in h.inputs:
        return []
    src, sattr = h.inputs["ic"]
    return ["  カーブの形の上流（★ は形が分からない・評価できないもの）:"] + _curve_tree(ms, src, sattr)


# カーブの形の上流をたどる入力（ノードの型 → 入力の属性の正規表現）
_CURVE_TREE_INPUTS = {
    "nurbsCurve": re.compile(r"^cr$"),
    "groupParts": re.compile(r"^ig$"),
    "transformGeometry": re.compile(r"^(ig|txf)$"),
    "tweak": re.compile(r"^ip\[\d+\]\.ig$"),
    "skinCluster": re.compile(r"^ip\[\d+\]\.ig$"),
    "cluster": re.compile(r"^ip\[\d+\]\.ig$"),
    "wire": re.compile(r"^(ip\[\d+\]\.ig|dw\[\d+\]|bw\[\d+\])$"),
}


def _curve_tree(ms: MaScene, node: MaNode, attr: str, indent: str = "    ", seen=None, budget=None) -> List[str]:
    """カーブの形が決まるまでの上流（変形・ヒストリ・wire のワイヤーとベース）を木の形で並べる"""
    from .curve_history import PRODUCERS
    from .rig import GEOMETRY_TYPES, parse_attrs
    seen = set() if seen is None else seen
    budget = [60] if budget is None else budget
    if budget[0] <= 0:
        return [indent + "…（多いので省略）"]
    budget[0] -= 1
    if id(node) in seen:
        return [indent + "%s（%s）.%s: （上に同じ）" % (node.name, node.type, attr)]
    seen.add(id(node))
    if node.type == "nurbsCurve":
        a = parse_attrs(ms.text, node)
        cps = sum(1 for k in node.inputs if k.startswith("cp["))
        if isinstance(a.get("cc"), list) and len(a.get("cc")) > 6:
            how = "形 あり（ヒストリから計算）" if node.baked and "cc" in node.baked else "形 あり（ファイル）"
            mark = "✓"
        elif "cr" in node.inputs:
            how, mark = "形はファイルになく、入力（create）から作る", "・"
        else:
            how, mark = "形がない（ファイルにも入力にもない）", "★"
        extra = "・制御点の接続 %d 個" % cps if cps else ""
        line = "%s %s（nurbsCurve）.%s: %s%s" % (mark, node.name, attr, how, extra)
    elif node.type in GEOMETRY_TYPES:
        line = "✓ %s（%s）.%s: 評価できる" % (node.name, node.type, attr)
        if node.type in ("wire", "cluster", "skinCluster"):
            from .component_tags import deformer_masks
            for k, cvs in sorted(deformer_masks(ms, node).items()):
                shown = ", ".join(str(v) for v in cvs[:12]) + (" …" if len(cvs) > 12 else "")
                line += "・コンポーネントタグで動かす CV（入力 %s）: %s" % (k, shown or "なし")
    elif node.type in PRODUCERS:
        line = "✓ %s（%s）.%s: 形を作るノード（計算できる）" % (node.name, node.type, attr)
    elif node.type in ("multMatrix", "decomposeMatrix", "composeMatrix", "inverseMatrix") or node.is_dag:
        line = "✓ %s（%s）.%s: 行列" % (node.name, node.type, attr)
    else:
        line = "★ %s（%s）.%s: ビューアでは評価できない（形を作るノード・未対応のノード）" % (node.name, node.type, attr)
    out = [indent + line]
    pat = _CURVE_TREE_INPUTS.get(node.type)
    if pat is not None:
        for key in sorted(node.inputs, key=lambda k: (not k.startswith("ip["), k)):
            if not pat.match(key):
                continue
            label = {"cr": "create", "ig": "入力", "txf": "行列"}.get(key, key)
            if key.startswith("dw["):
                label = "ワイヤー " + key
            elif key.startswith("bw["):
                label = "ベース " + key
            src, sattr = node.inputs[key]
            out.append(indent + "  ← %s:" % label)
            out.extend(_curve_tree(ms, src, sattr, indent + "    ", seen, budget))
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
    defined = getattr(ms, "defined_nodes", {}) or {}
    defs = getattr(ms, "node_defs", None)
    if defined:
        out.append("■ 定義で評価する自作ノード: %s" % "、".join(
            "%s（%s。定義 %s）" % (t, "、".join(names[:5]), defs.nodes[t].source) for t, names in sorted(defined.items())))
    if defs is not None:
        bad = [(t, why) for t, why in sorted(defs.errors.items())
               if t.endswith(".json") or any(n.type == t for n in ms.nodes)]
        if bad:
            out.append("■ 使えない自作ノードの定義（同梱の定義を直してください）")
            for t, why in bad:
                out.append("  %s: %s" % (t, why))
    mapped = getattr(ms, "mapped_nodes", {}) or {}
    if mapped:
        out.append("■ 設定ファイルで割り当てた自作ノード: %s" % "、".join(
            "%s → %s（%s）" % (t, ms.node_map[t]["as"], "、".join(names[:5])) for t, names in sorted(mapped.items())))
    templates = {t: template_for(ms, t) for t in sorted(info.unsupported) if t != "expression"} if info else {}
    if templates:
        out.append("")
        out.append("■ 自作ノードの割り当て（設定ファイルの雛形）")
        out.append("  評価できないノードが自作ノードなら、同じ計算をする標準ノードに割り当てると評価できます。")
        out.append("  次を %s という名前で .ma と同じフォルダに保存し、「as」（標準ノードの型）と、属性名の対応"
                   "（標準ノードの短い属性名）を書き換えてから開き直してください。" % FILE_NAME)
        out.append("  例: 入力の行列を掛けて出力するノード → {\"as\": \"multMatrix\", \"attrs\": {\"inMatrix\": \"i[0]\", \"outMatrix\": \"o\"}}")
        for line in json.dumps(templates, ensure_ascii=False, indent=2).splitlines():
            out.append("  " + line)
    out.append("")
    out.append("■ IK ハンドル")
    if info is None or not info.ik:
        out.append("  なし")
    else:
        for e in info.ik:
            out.extend(_ik_section(ms, e))
    out.append("")
    out.append("■ ヒストリのあるカーブ（形を作るノードから形を求めるもの）")
    baked = getattr(ms, "curve_history_baked", 0)
    problems = getattr(ms, "curve_history_problems", {}) or {}
    if not baked and not problems:
        out.append("  なし")
    if baked:
        out.append("  ✓ 形を計算したカーブ: %d 本（circle・transformGeometry など）" % baked)
    for t, items in sorted(problems.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        out.append("  ★ %s で形を作るカーブ: %d 本（ビューアでは形を計算できないので、表示もスプライン IK もできません）"
                   % (t, len(items)))
        for name, why in items[:20]:
            out.append("      %s（%s）" % (name, why))
        if len(items) > 20:
            out.append("      ほか %d 本" % (len(items) - 20))
    if problems:
        out.append("  Maya でカーブのヒストリを削除（Edit > Delete by Type > History）して保存すると、形が保存されます。")
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


def _spline_detail(h: dict, sp: dict) -> List[str]:
    """スプライン IK の再現チェックの詳細と、ずれの原因の見立て"""
    out = []
    if sp.get("missing"):
        out.append("      ★ スプライン IK のカーブ（ic）の形を求められません（カーブの形・変形の評価を疑う）")
        return out
    src = sp.get("curveFrom") or {}
    out.append("      カーブ: %s.%s（CV %d 個・%d 次。ファイルの形 %s）%s" % (
        src.get("name", "?"), src.get("attr", "?"), sp["cvs"], sp["degree"], "あり" if src.get("hasFileShape") else "なし",
        "・入力 " + "・".join(src["inputs"]) if src.get("inputs") else ""))
    out.append("      カーブの長さ %.4f ／ チェーンの長さ（ファイル）%.4f・始点 (%s)・終点 (%s)" % (
        sp["curveLength"], sp["chainLength"], ", ".join("%.4f" % x for x in sp["start"]),
        ", ".join("%.4f" % x for x in sp["end"])))
    out.append("      rootOnCurve %s・offset %.4f・上級ツイスト %s" % (
        "オン" if sp["rootOnCurve"] else "オフ", sp["offset"], "オン" if sp["advancedTwist"] else "オフ"))
    names = h.get("chain") or []
    pair = lambda vals: "・".join("%s %.4f" % (names[k] if k < len(names) else k, v) for k, v in enumerate(vals))  # noqa: E731
    out.append("      カーブからの距離（ファイル = Maya の答え）: %s" % pair(sp["fileToCurve"]))
    out.append("      カーブからの距離（計算 = ビューア）: %s" % pair(sp["evalToCurve"]))
    tol = 1e-3 * max(1.0, sp["chainLength"])
    dists = sp["fileToCurve"] or [0.0]
    worst = max(dists)
    if worst <= tol:
        out.append("      → Maya のジョイントは、こちらのカーブの上にあります（カーブの形・位置は Maya と同じ）。"
                   "ずれは、ジョイントをカーブに並べる位置か、ひねりの解き方の違いです")
    elif not sp["rootOnCurve"] and worst - min(dists) <= tol:
        out.append("      → Maya のジョイントは、カーブの形をなぞったまま、どれもカーブから %.4f 離れています"
                   "（rootOnCurve オフで、開始ジョイントがカーブから離れているため。ビューアも同じ解き方です）" % worst)
    else:
        out.append("      → Maya のジョイントが、こちらのカーブから最大 %.4f 離れています（カーブの形・位置が Maya と違う）。"
                   "カーブの変形（skinCluster・cluster・wire）、ヒストリから求めた形、カーブの transform の位置を疑ってください"
                   % worst)
    if sp["rootOnCurve"] and sp.get("rootToStart") is not None and sp["rootToStart"] > tol:
        out.append("      ★ rootOnCurve なのに、Maya の開始ジョイントがこちらのカーブの始点から %.4f 離れています"
                   "（カーブの向き・始点が Maya と違う可能性）" % sp["rootToStart"])
    chain = sp.get("chain") or []
    if chain:
        out.append("      カーブの上流（出力のカーブの始点 → 終点。ワールド空間の出力 ws はワールド、local はカーブのローカル）:")
        out.extend(_chain_lines(chain, "        "))
    if sp["curveLength"] + tol < sp["chainLength"]:
        out.append("      ※ カーブがチェーンより短い（%.4f < %.4f）: 届かない先のジョイントの置き方は、Maya と違うことがあります"
                   % (sp["curveLength"], sp["chainLength"]))
    return out


def _chain_lines(chain, ind: str) -> List[str]:
    """スプライン IK のカーブの上流（rig.js の curveChain）を 1 段ずつ文章にする。wire はワイヤーの上流（driver）も字下げして並べる"""
    out: List[str] = []
    f3 = lambda v: "(%s)" % ", ".join("%.3f" % x for x in v)  # noqa: E731
    for st in chain:
        o = st.get("out")
        where = "%s → %s（CV %d 個）" % (f3(o["start"]), f3(o["end"]), o["cvs"]) if o else "出力のカーブを求められない"
        extra = []
        if st["type"] == "nurbsCurve":
            extra.append("ファイルの形 %s" % ("あり" if st.get("fileShape") else "なし"))
            if st.get("cp"):
                extra.append("制御点の接続 %d 個" % st["cp"])
            if "shown" in st:
                extra.append("画面のカーブ: %s" % ("評価した形で毎フレーム描き直す" if st["shown"]
                                                  else "描かない（中間オブジェクト・表示しないカーブ。画面に見えるのは別のカーブ）"))
        if st.get("txf"):
            extra.append("txf: %s" % st["txf"])
        if st["type"] == "wire":
            extra.append("エンベロープ %.3f" % st.get("envelope", 1))
            if st.get("tagged") is not None:
                extra.append("コンポーネントタグで動かす CV %d 個" % st["tagged"])
            if st.get("deformed") is not None:
                extra.append("変形するカーブの CV の最大の移動 %.3f" % st["deformed"])
        if st["type"] == "cluster":
            extra.append("ハンドル %s の位置 %s" % (st.get("handle") or "（接続なし）", f3(st["handlePos"]) if st.get("handlePos") else "?"))
            extra.append("bindPreMatrix: %s" % st.get("pm", "?"))
            if st.get("tagged") is not None:
                extra.append("タグで動かす CV: %s" % (", ".join(str(v) for v in st["tagged"][:12]) or "なし"))
            if st.get("movedCvs") is not None:
                mv = st["movedCvs"]
                extra.append("動いた CV: %s" % (", ".join("%d（%.3f）" % (v, d) for v, d in mv[:12])
                                                 + (" …" if len(mv) > 12 else "") if mv else "なし"))
        out.append(ind + "%s（%s）.%s: %s%s" % (st["name"], st["type"], st["attr"], where,
                                              "・" + "・".join(extra) if extra else ""))
        for w in st.get("wires") or []:
            ws, bs = w.get("wireShape"), w.get("baseShape")
            out.append(ind + "  " + "ワイヤー dw[%d] %s: %s ／ ベース bw[%d] %s: %s" % (
                w["index"], w.get("wire") or "?", "%s → %s" % (f3(ws["start"]), f3(ws["end"])) if ws else "求められない",
                w["index"], w.get("base") or "?", "%s → %s" % (f3(bs["start"]), f3(bs["end"])) if bs else "求められない"))
            for label, key in (("ワイヤー", "wireInfo"), ("ベース", "baseInfo")):
                inf = w.get(key)
                shape = w.get("wireShape" if key == "wireInfo" else "baseShape")
                if inf is None or shape:
                    continue
                if not inf.get("inGraph"):
                    why = "リグに入っていない（たどれていない）"
                elif inf.get("type") != "nurbsCurve":
                    why = "nurbsCurve ではない（%s）" % inf.get("type")
                elif inf.get("fileShape") and not inf.get("parsed"):
                    why = "ファイルの形（.cc）はあるが、ビューアが読めない"
                elif inf.get("createFrom"):
                    cf = inf["createFrom"]
                    why = "形はファイルになく、作成の入力（create）の %s（%s）をビューアで評価できない" % (cf["name"], cf["type"])
                elif inf.get("create"):
                    why = "形はファイルになく、作成の入力（create）を評価できない（上流をカーブの形の上流の木で確認）"
                else:
                    why = "形がファイルにも入力にもない"
                out.append(ind + "  " + "★ %sのカーブの形を求められない理由: %s" % (label, why))
            if not w.get("sameCount"):
                out.append(ind + "  " + "★ ワイヤーとベースの CV の数が違う（または求められない）ため、ビューアはこのワイヤーで変形しません")
            elif w.get("moved") is not None:
                out.append(ind + "  " + "ワイヤーとベースの差（CV の最大の移動）%.3f・影響範囲 dropoff %.3f%s" % (
                    w["moved"], w["dropoff"], "" if w.get("dropoffInFile") else "（ファイルに値がないので既定値）"))
                if w["moved"] < 1e-6:
                    out.append(ind + "  " + "★ ワイヤーがベースから動いていない（ワイヤーを動かすリグが評価できていないか、保存時は動いていない）")
                r = w.get("reach")
                if r:
                    out.append(ind + "  " + "変形するカーブの CV とベースの距離: 一番近い %.3f・一番遠い %.3f（影響範囲の中の CV %d / %d 個）"
                               % (r["nearest"], r["farthest"], r["inside"], r["cvs"]))
                    if r["inside"] < r["cvs"]:
                        out.append(ind + "  " + "★ 影響範囲 dropoff（%.3f）より遠い CV は、ビューアの wire では動きません。"
                                   "Maya の wire の dropoffDistance の値を確認してください" % w["dropoff"])
            if w.get("driver"):
                out.append(ind + "  " + "ワイヤー dw[%d] の上流:" % w["index"])
                out.extend(_chain_lines(w["driver"], ind + "    "))
    return out


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
    shown_detail = [0]                                    # 詳細は、ずれのある IK の最初の 3 本だけ
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
        par = h.get("parent")
        if par and (par["angle"] > 0.5 or par["position"] > 1e-3):
            fb = par.get("firstBad")
            where = ""
            if fb:
                where = "。最初にずれるノード: %s（向き %.2f°・位置 %.4f%s）" % (
                    fb["name"], fb["angle"], fb["position"], "。IK %s で動く" % fb["ik"] if fb.get("ik") else "")
            out.append("    ★ 開始ジョイントの親 %s が Maya とずれている（向き %.2f°・位置 %.4f）%s"
                       "（この IK ではなく、親の側が原因）" % (par["name"], par["angle"], par["position"], where))
        elif par:
            out.append("    ✓ 開始ジョイントの親 %s は Maya と一致" % par["name"])
        pe = h.get("poleError")
        if pe is not None and not h["ok"]:
            if abs(pe) > 0.5:
                out.append("    ★ 肘（膝）の向き: Maya の姿勢は、こちらの極ベクトル＋ひねりから %+.2f° 回った向き"
                           "（極ベクトル・ひねりの入力が Maya と違う。極ベクトルを決めるノードの評価を疑う）" % pe)
            else:
                out.append("    ✓ 肘（膝）の向き: 極ベクトル＋ひねりの入力は Maya と一致（%+.2f°）" % pe)
        det = h.get("detail")
        if det and det.get("spline") is not None and not h["ok"]:
            # スプライン IK は、詳細の本数の制限とは別に、カーブとジョイントの関係をいつも出す
            out.append("    ［スプライン IK］ワールド空間")
            out.extend(_spline_detail(h, det["spline"]))
        if det and not h["ok"] and shown_detail[0] < 3:
            shown_detail[0] += 1
            fmt3 = lambda v: "(%s)" % ", ".join("%.4f" % x for x in v)  # noqa: E731
            out.append("    ［詳細］ワールド空間。ファイル = 保存時の Maya の答え、計算 = ビューア")
            for k, name in enumerate(h["chain"]):
                fj = det["fileJoints"][k] if k < len(det["fileJoints"]) else None
                ej = det["evalJoints"][k] if k < len(det["evalJoints"]) else None
                out.append("      %s: ファイル %s ／ 計算 %s" % (name, fmt3(fj) if fj else "-", fmt3(ej) if ej else "-"))
            out.append("      ハンドルの位置（計算）%s" % fmt3(det["handle"]))
            out.append("      骨の長さ: ファイル %s ／ 計算 %s" % (det["fileLengths"], det["evalLengths"]))
            if det.get("pv") is not None:
                out.append("      極ベクトル（ワールド・計算）%s・ひねり %.4f°・ikBlend %.3f"
                           % (fmt3(det["pv"]), det["twist"], det["ikBlend"]))
                if det.get("impliedPv"):
                    # ソルバーが同じなら、Maya はこの極ベクトルで解いている（チャンネルボックスの値と比べられる）
                    out.append("      Maya の姿勢に合う極ベクトル（ワールド・逆算）%s（こちらの極ベクトルを 開始→ハンドル の軸のまわりに"
                               "回したもの。ハンドルの親が回転していなければ、Maya のチャンネルボックスの Pole Vector と同じ値になるはず）"
                               % fmt3(det["impliedPv"]))
            for key, label in (("handleParent", "ハンドルの親"), ("startParent", "開始ジョイントの親")):
                hp = det.get(key)
                if hp:
                    out.append("      %s %s: スケール %s%s" % (label, hp["name"], hp["scale"], "・反転あり" if hp["mirrored"] else ""))
            if det.get("roll"):
                out.append("      ハンドルの roll %.4f°" % det["roll"])
            if det.get("pvAttr") is not None:
                out.append("      チャンネルボックスの値（Maya で同じフレームの %s と見比べてください）: Pole Vector X/Y/Z %s・Twist %.4f%s"
                           % (h["handle"], det["pvAttr"], det["twist"],
                              "（接続: %s）" % "・".join(det.get("twistInputs") or []) if det.get("twistInputs") else "（接続なし）"))
            if det.get("axes"):
                out.append("      ジョイントの軸（X, Y, Z）と、基準面（開始→ハンドル と 極ベクトル＋ひねり の面）の法線のなす角（度）:")
                for ax in det["axes"]:
                    out.append("        %s: Maya %s ／ 計算 %s ／ Maya の 3 点の面の法線とは %s" % (
                        ax["name"], ax["fileToRef"], ax["evalToRef"], ax["fileToChain"]))
                    out.append("          rotate %s・jointOrient %s・rotateAxis %s・preferredAngle %s・回転順 %s" % (
                        ax["r"], ax["jo"], ax["ra"], ax["pa"] if ax["pa"] is not None else "（なし）", ax["ro"]))
        cyc = h.get("cycle") or {}
        if not h["ok"]:
            for key, label in (("pole", "極ベクトル"), ("handle", "ハンドルの位置"), ("twist", "ひねり")):
                if cyc.get(key):
                    # 循環: Maya は 1 つ前の評価の値で解くため、保存された姿勢と入力の値が食い違う
                    out.append("    ★ %sが、この IK で回るジョイント %s（またはその子）に依存している（循環。Maya は 1 つ前の"
                               "評価の値で解くので、保存された姿勢と合わないことがある）" % (label, cyc[key]))
        pt = h.get("poleTargets")
        if pt and not h["ok"]:
            if not pt.get("targets"):
                out.append("    極ベクトルは %s で決まる" % pt["via"])
            else:
                out.append("    極ベクトルの目標（%s。開始の位置 %s）%s" % (
                    pt["via"], "(%s)" % ", ".join("%.4f" % x for x in pt["start"]) if pt.get("start") else "-",
                    "・★ オフセット %s（使っていない）" % pt["offset"] if pt.get("offset") else ""))
                si = pt.get("startInputs")
                if si:
                    # Maya は開始の位置を (crp + crt) · ps で求める（ふつうは crp ← 開始ジョイントの t、ps ← その pm）
                    out.append("      開始の位置の材料: crp ← %s・crt ← %s・ps ← %s" % (
                        si.get("crp", "-"), si.get("crt", "-"), si.get("ps", "-")))
            implied = (h.get("detail") or {}).get("impliedPv")
            if pt.get("targets") and implied and pt.get("start") and len(pt["targets"]) == 1:
                pos = [a + b for a, b in zip(pt["start"], implied)]
                out.append("      Maya の姿勢に合う目標の位置（逆算。開始の位置 + 上の極ベクトル）(%s)"
                           % ", ".join("%.4f" % x for x in pos))
            for t in pt.get("targets", []):
                d = t.get("drift")
                fb = d.get("firstBad") if d else None
                state = ("★ ファイルの値とずれている（最初にずれるノード: %s。向き %.2f°・位置 %.4f%s）"
                         % (fb["name"], fb["angle"], fb["position"], "。IK %s で動く" % fb["ik"] if fb.get("ik") else "")
                         if fb else "✓ ファイルの値と一致")
                out.append("      %s（ウェイト %.3f）: 位置 (%s)・%s" % (
                    t["name"], t["weight"], ", ".join("%.4f" % x for x in t["position"]), state))
                for u in (d or {}).get("unchecked") or []:
                    # 接続で決まるチャンネルはファイルに確かな値がなく、評価した値で比べている（✓ でもずれていることがある）
                    out.append("        ・%s の%s は接続で決まるので比べていない（%s）" % (
                        u["name"], "・".join(b["what"] for b in u["by"]),
                        "、".join("%s ← %s" % (b["what"], "・".join(b["from"])) for b in u["by"])))
        modes = (pt or {}).get("aimModes") if not h["ok"] else None
        if modes:
            # 目標を動かす aimConstraint が aim と up が平行（ひねりが決まらない）なら、Maya がどこから測る最短の回転か
            out.append("    目標を動かす aimConstraint の解き方の候補（aim と up が平行なとき。Maya の姿勢に合う目標の位置との距離）:")
            top = min(modes, key=lambda m: m["distance"])
            for m in modes:
                out.append("      %s %s: %.4f" % ("→" if m is top else "  ", m["label"], m["distance"]))
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
    pole_bad = [h["handle"] for h in handles if not h["ok"] and h.get("poleError") is not None and abs(h["poleError"]) > 0.5]
    reach_bad = [h["handle"] for h in handles if not h["ok"] and h.get("reach") is not None and h["reach"] > 1e-3]
    parent_bad = [h for h in handles if not h["ok"] and h.get("parent")
                  and (h["parent"]["angle"] > 0.5 or h["parent"]["position"] > 1e-3)]
    if parent_bad:
        sources = {}
        for h in parent_bad:
            fb = h["parent"].get("firstBad")
            key = (fb["name"] + ("（IK %s）" % fb["ik"] if fb.get("ik") else "")) if fb else "（不明）"
            sources.setdefault(key, []).append(h["handle"])
        out.append("  → 開始ジョイントの親がずれている IK: %d 個（親の側が原因）" % len(parent_bad))
        for key, names in sorted(sources.items(), key=lambda kv: -len(kv[1])):
            out.append("      最初にずれるノード %s: %s" % (key, "、".join(names[:8])))
    if pole_bad:
        out.append("  → 極ベクトル・ひねりの入力が Maya と違う IK: %d 個（%s）" % (len(pole_bad), "、".join(pole_bad[:8])))
    if reach_bad:
        out.append("  → ハンドルの位置（終端の届く先）が Maya と違う IK: %d 個（%s）" % (len(reach_bad), "、".join(reach_bad[:8])))
    if unfit:
        out.append("  → どの解き方でも一致しない IK: %s（ハンドルや極ベクトルを動かすリグの側か、ほかの原因）" % "、".join(unfit))
    return "\n".join(out)


def rig_report_file(path: str, node_defs=None) -> str:
    """node_defs: 自作ノードの定義（省略時は ma_viewer/node_defs に同梱したもの。テスト用）"""
    from .animation import build_animation
    from .extract_ma import scene_to_dict
    from .ma_scene import parse_ma_file
    ms = parse_ma_file(path)
    if node_defs is not None:
        ms.node_defs = node_defs
    scene = scene_to_dict(ms)
    anim = build_animation(ms, ms.out_index) if ms.text else None
    return rig_report(ms, scene, anim)
