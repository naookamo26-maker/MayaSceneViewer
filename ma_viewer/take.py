# -*- coding: utf-8 -*-
"""テイク（アニメーションだけの入出力）のファイルの読み込み（Qt 版・コマンドラインで共通。Qt に依存しない）。

ビューアのテイクの一覧に渡す「テイクの元」を作る:
  * .msva            テイクをそのまま       {"kind": "takes", "takes": [...], "name"}
  * .msv・共通 JSON   メッシュなどを外したシーン {"kind": "scene", "scene": {...}, "name"}
  * .ma              .ma をシーンとして読み（アニメーションも読む）、同じくメッシュなどを外したシーン
シーンからテイクを取り出すのはビューア（web_src/src/takes.js の splitAnimation）で行う。
.ma は、表示に効くカーブ（表示するノードとリグを動かすもの）だけを読む（.ma を開いたときと同じ）。
リファレンスを読まない・参照先が見つからないと、リファレンスのコントローラーにつながるカーブは相手がなく、取り出せない。
"""
from __future__ import annotations

import json
import os
from typing import Callable, List, Optional, Tuple

TAKE_SOURCE_EXT = (".msva", ".msv", ".json", ".ma")

ProgressFn = Optional[Callable[[str], None]]
FractionFn = Optional[Callable[[float, str], None]]     # 進み具合（0〜1, 文言）。テイクの一覧の読み込み中の行に出す


def source_scene(scene: dict) -> dict:
    """テイクを取り出すためのシーン（ビューアに渡す）。メッシュの形・テクスチャ・カーブの形を外し、ノードのパス・
    アニメーション・カメラ・入っているテイクだけを残す"""
    keep = ("schema", "version", "source", "nodes", "restNodes", "cameras", "animation", "savedTakes")
    out = {k: scene[k] for k in keep if k in scene}
    out["nodes"] = [{k: n.get(k) for k in ("name", "path", "type", "parent", "matrix", "attrs", "visible", "opm")
                     if k in n} for n in scene.get("nodes") or []]
    out["meshes"] = [{k: m.get(k) for k in ("name", "path", "visible") if k in m} for m in scene.get("meshes") or []]
    out["curves"] = [{k: c.get(k) for k in ("name", "path", "visible") if k in c} for c in scene.get("curves") or []]
    src = out.get("source")
    if isinstance(src, dict):
        out["source"] = {k: v for k, v in src.items() if k != "packagePath"}
    return out


def _stage(progress: ProgressFn, step, name: str, lo: float, hi: float):
    """読み込みの 1 段階の進み具合（0〜1）を、全体の lo〜hi に割り振って知らせる関数"""
    def prog(frac, msg, *_rest):
        if progress is not None:
            progress("%s: %s" % (name, msg))
        try:
            f = float(frac)
        except (TypeError, ValueError):
            f = 0.0
        step(lo + (hi - lo) * max(0.0, min(1.0, f)), msg)
    return prog


def _missing_references(scene: dict) -> List[dict]:
    """読み込めなかったリファレンス（いちばん外側のもの）"""
    refs = (scene.get("source") or {}).get("references") or []
    return [r for r in refs if not r.get("loaded") and r.get("namespace")
            and not any(o is not r and not o.get("loaded") and o.get("namespace")
                        and r["namespace"].startswith(o["namespace"] + ":") for o in refs)]


def read_source(path: str, references: bool = True, progress: ProgressFn = None,
                fraction: FractionFn = None) -> Tuple[Optional[dict], List[str]]:
    """1 つのファイルから、テイクの元（とお知らせ）を作る。読めないものは例外。
    progress は文言だけ（コマンドライン）、fraction は (0〜1, 文言)（テイクの一覧の読み込み中の行）"""
    from . import package
    name = os.path.basename(path)
    low = path.lower()
    notes: List[str] = []

    def step(frac: float, msg: str):
        if fraction is not None:
            fraction(max(0.0, min(1.0, frac)), msg)
    if low.endswith(package.TAKES_EXT):
        step(0.2, "テイクを読み込み中")
        return {"kind": "takes", "takes": package.read_takes(path), "name": name}, notes
    if low.endswith(".msv"):
        step(0.2, "パッケージを読み込み中")
        scene, _pkg = package.read_package(path)
        step(0.8, "テイクを取り出し中")
        return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes
    if low.endswith(".json"):
        step(0.2, "JSON を読み込み中")
        with open(path, "r", encoding="utf-8") as f:
            scene = json.load(f)
        step(0.8, "テイクを取り出し中")
        return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes
    if low.endswith(".ma"):
        from .extract_ma import load_ma_staged
        # 読み込みは 2 段階（シーンの解析・変換 → アニメーション）で、それぞれが 0〜1 で知らせてくる。合わせて 0〜1 に
        # なるように割り振る（シーン 0〜0.7・アニメーション 0.7〜0.9。残りは参照先のないリファレンスの取り出しと受け渡し）
        scene_prog = _stage(progress, step, name, 0.0, 0.7)
        anim_prog = _stage(progress, step, name, 0.7, 0.9)
        scene, load_animation = load_ma_staged(path, scene_prog, references=references)
        anim = load_animation(anim_prog)
        if anim is not None:
            scene["animation"] = anim
        # 読み込めなかったリファレンス（参照先がない・アンロード・読まない設定）のキーは、参照先を読まずに、
        # リファレンスの編集から取り出す（takes_from_ma）
        missing = _missing_references(scene)
        extra: List[dict] = []
        if missing:
            spaces = [r["namespace"] for r in missing]
            step(0.9, "リファレンスの編集から取り出し中")
            got, n2 = takes_from_ma(path, progress)
            notes.extend(n2)
            extra = [t for t in got if any(t["namespace"] == ns or t["namespace"].startswith(ns + ":") for ns in spaces)]
            if extra:
                notes.append("%s: 参照先を読み込めなかったリファレンス（%s）のキーは、リファレンスの編集から取り出しました"
                             % (name, "・".join(t["namespace"] for t in extra)))
        if not scene.get("animation") and not extra:
            notes.append("%s: 取り出せるアニメーションがありません" % name)
            return None, notes
        src = {"kind": "scene", "scene": source_scene(scene), "name": name}
        if extra:
            src["takes"] = extra                       # シーンから取り出したものに足す
        return src, notes
    if low.endswith(".mb"):
        raise ValueError("Maya バイナリ (.mb) からはテイクを取り出せません。.ma として保存し直してください")
    raise ValueError("テイクを読めない種類のファイルです（.msva・.msv・.json・.ma）")


def read_maya_source(st, progress: ProgressFn = None, fraction: FractionFn = None) -> Tuple[Optional[dict], List[str]]:
    """Maya で開いているシーン（maya_scene.collect が集めた SceneText）から、テイクの元を作る。
    変換は .ma を開いたときと同じ（maya_scene.load_staged）。Maya の API は使わないので、読み込みスレッドで呼べる"""
    from .maya_scene import load_staged
    name = os.path.basename(getattr(st, "source_path", "") or "") or "Maya シーン"
    notes: List[str] = []

    def step(frac, msg):
        if fraction is not None:
            fraction(max(0.0, min(1.0, frac)), msg)
    # 2 段階（シーン → アニメーション）を合わせて 0〜0.9 に割り振る（.ma と同じ）
    scene, load_animation = load_staged(st, _stage(progress, step, name, 0.0, 0.7))
    anim = load_animation(_stage(progress, step, name, 0.7, 0.9))
    if anim is not None:
        scene["animation"] = anim
    missing = _missing_references(scene)
    if missing:
        notes.append("%s: Maya で読み込んでいないリファレンス（%s）のキーは取り出せません（.ma を保存して読み込むと、"
                     "リファレンスの編集から取り出せます）" % (name, "・".join(r["namespace"] for r in missing)))
    if not scene.get("animation"):
        notes.append("%s: 取り出せるアニメーションがありません" % name)
        return None, notes
    return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes


def read_sources(paths, references: bool = True, progress: ProgressFn = None):
    """いくつかのファイルからテイクの元を作る（ファイル名の順）。戻り値: (元の一覧, お知らせ, (ファイル名, 誤り) の一覧)"""
    sources, notes, errors = [], [], []
    for path in sorted(paths, key=lambda p: os.path.basename(p).lower()):
        if progress is not None:
            progress("%s を読み込み中" % os.path.basename(path))
        try:
            src, n = read_source(path, references, progress)
        except Exception as exc:  # noqa: BLE001
            errors.append((os.path.basename(path), str(exc)))
            continue
        notes.extend(n)
        if src is not None:
            sources.append(src)
    return sources, notes, errors


class TakeToolError(RuntimeError):
    """テイクを取り出す道具（Node.js と web_src）が使えない"""


def extract_takes(paths, namespaces=None, references: bool = True, progress: ProgressFn = None):
    """ファイル（.msva・.ma・.msv・共通 JSON）からテイクを取り出す（コマンドライン用）。
    シーンからの取り出しはビューアと同じ JS（web_src/src/takes.js）を Node.js で動かす（web_src の npm ci が要る）。
    戻り値: (テイクの一覧（数値の配列は base64）, お知らせ, (ファイル名, 誤り) の一覧)"""
    import shutil
    import subprocess
    import tempfile
    sources, notes, errors = read_sources(paths, references, progress)
    if not sources:
        return [], notes, errors
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    script = os.path.join(root, "web_src", "tools", "takes.mjs")
    if not os.path.isfile(script) or not os.path.isdir(os.path.join(root, "web_src", "node_modules")):
        raise TakeToolError("テイクを取り出すには、ソースのフォルダで web_src の npm install（npm ci）を済ませてください: %s"
                            % script)
    node = shutil.which("node")
    if node is None:
        raise TakeToolError("Node.js（node）が見つかりません（テイクの取り出しに使います）")
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "sources.json")
        out = os.path.join(tmp, "takes.json")
        with open(src, "w", encoding="utf-8") as f:
            json.dump(sources, f, ensure_ascii=False, separators=(",", ":"))
        cmd = [node, script, src, out]
        for ns in namespaces or []:
            cmd += ["--namespace", ns]
        r = subprocess.run(cmd, cwd=os.path.join(root, "web_src"), capture_output=True, text=True, encoding="utf-8")
        if r.returncode != 0:
            raise TakeToolError("テイクを取り出せませんでした: %s" % (r.stderr.strip().splitlines() or ["不明"])[-1])
        with open(out, "r", encoding="utf-8") as f:
            takes = json.load(f)
    return takes, notes, errors


def take_summary(t: dict) -> str:
    """テイク 1 つの概要（名前・名前空間・範囲・カーブの数・結び付けの数）"""
    return "%s  名前空間 %s・%g〜%g（%g fps）・カーブ %d 本・結び付け %d・レイヤーなどのノード %d" % (
        t.get("name", ""), t.get("namespace") or "なし", t.get("start", 0), t.get("end", 0), t.get("fps", 24),
        len(t.get("curves") or []), len(t.get("bindings") or []), len(t.get("nodes") or []))


# ---------------------------------------------------------------------------- .ma から直接（参照先なし）
# 参照先のファイルを読まずに .ma を解析し、ショットのファイルにあるカーブ・アニメーション側のノードと、相手のノードが
# なくて当てなかったリファレンスの編集（プレースホルダー・connectAttr・setAttr。MaScene.ref_edits_unresolved）から
# テイクを作る（docs/take_plan.md の「A」）。形はビューアの splitAnimation が作るものと同じ（docs/data_format.md「テイク」）。

_VIS = {"v", "lodv", "ove", "ovv"}
_SHAPE_PROPS = {"mesh": "mesh", "nurbsCurve": "curve"}
_CAMERA_TYPES = {"camera"}


def _ns_of(name: str) -> str:
    leaf = (name or "").split("|")[-1]
    i = leaf.rfind(":")
    return leaf[:i] if i > 0 else ""


def _is_anim_node(ms, n) -> bool:
    if n.type == "animLayer" or n.type.startswith("animBlendNode"):
        return True
    if n.type == "character":
        from .trax import library_and_scheduler
        return library_and_scheduler(ms, n)[0] is not None
    return False


def _is_camera(n) -> bool:
    return n.type in _CAMERA_TYPES or any(c.type in _CAMERA_TYPES for c in getattr(n, "children", []) or [])


def _attr_name(attr: str):
    """ファイルに書かれた属性の名前 → (短い名前, raw)。全体の表で短くできない名前は、そのまま raw とする"""
    from . import ma_reader as R
    from .rig import _CHANNEL_KEYS
    key = R.normalize_attr(attr)
    known = key != attr or key in _CHANNEL_KEYS or key in _VIS
    return key, not known


def _numbers(value: str) -> Optional[List[float]]:
    """setAttr の値の文字列 → 数値の並び（-type の指定は読み飛ばす。数値でなければ None）"""
    toks = value.split()
    out: List[float] = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if t == "-type":
            i += 2
            continue
        if t.startswith("-"):
            try:
                out.append(float(t))
            except ValueError:
                i += 2 if i + 1 < len(toks) else 1
                continue
        else:
            try:
                out.append(float(t))
            except ValueError:
                if t in ("yes", "on", "true"):
                    out.append(1.0)
                elif t in ("no", "off", "false"):
                    out.append(0.0)
                else:
                    return None
        i += 1
    return out or None


def takes_from_ma(path: str, progress: ProgressFn = None, namespaces=None) -> Tuple[List[dict], List[str]]:
    """.ma から、参照先のファイルを読まずにテイクを取り出す（名前空間ごと）。戻り値: (テイクの一覧, お知らせ)。
    namespaces を渡すと、その名前空間のテイクだけ。数値の配列は base64"""
    from . import ma_reader as R
    from .animation import CURVE_TYPES, _CM_PER_UNIT, _pack, curve_record, fps_of, parse_curve, playback_range
    from .ma_scene import parse_ma_file
    from .rig import _STANDARD_ATTRS, parse_attrs
    from .version import __version__

    def prog(frac, msg, *_rest):
        if progress is not None:
            progress("%s: %s" % (os.path.basename(path), msg))
    ms = parse_ma_file(path, prog, load_references=False)
    notes: List[str] = []
    fps = fps_of(ms.time_unit)
    ang_k = 180.0 / 3.141592653589793 if ms.angular_unit in ("rad", "radian") else 1.0
    cm = _CM_PER_UNIT.get(ms.linear_unit, 1.0)
    rad_k = 1.0 if ms.angular_unit in ("rad", "radian") else 3.141592653589793 / 180.0
    by_name = {}
    for n in ms.nodes:
        by_name.setdefault(n.name, n)

    def node_of(name: str):
        return ms.resolve(name) if name else None

    # --- 外の相手（リファレンスの中）: プレースホルダーと connectAttr の編集 ---------------------
    holders = {}                                         # (reference ノード, phl[n]) → "パス.属性"
    extra_edges = []                                     # (元のノード, 元の属性, 外のプラグ)
    statics_edits = []
    for e in ms.ref_edits_unresolved:
        if e["code"] == 5:
            holders[(e["holder"], e["phl"])] = e["plug"]
        elif e["code"] == 3:
            sn, sattr = R.split_node_attr(e["src"])
            src = node_of(sn)
            if src is not None and node_of(R.split_node_attr(e["dst"])[0]) is None:
                extra_edges.append((src, R.normalize_attr(sattr), e["dst"]))
        elif e["code"] == 2:
            statics_edits.append(e)
    # 出力の先: ノード → [(出力の属性, ("real", ノード, 属性) | ("ext", パス, 属性))]
    outs: Dict[int, list] = {}
    ins: Dict[int, Dict[str, tuple]] = {}
    for src, sattr, dst, dattr in ms.connections:
        if dst.type == "reference":
            plug = holders.get((dst.name, dattr))
            if plug is None:
                continue
            tn, ta = R.split_node_attr(plug)
            target = ("ext", tn, ta)
        else:
            target = ("real", dst, dattr)
            ins.setdefault(id(dst), {})[dattr] = (src, sattr)
        outs.setdefault(id(src), []).append((sattr, target))
    for src, sattr, plug in extra_edges:
        tn, ta = R.split_node_attr(plug)
        outs.setdefault(id(src), []).append((sattr, ("ext", tn, ta)))
    # リファレンスの中のノードの出力を読む入力（プレースホルダーから入るもの）: 入る側 → {属性: ("ext", パス, 属性)}
    for src, sattr, dst, dattr in ms.connections:
        if src.type == "reference":
            plug = holders.get((src.name, sattr))
            if plug is not None:
                tn, ta = R.split_node_attr(plug)
                ins.setdefault(id(dst), {})[dattr] = ("ext", tn, ta)

    # --- カーブ（時間のカーブ。Trax のクリップのカーブも）------------------------------------
    trax_curves = {id(s) for s, _sa, d, _da in ms.connections if d.type == "clipLibrary" and s.type in CURVE_TYPES}
    curves = [n for n in ms.nodes if n.type in CURVE_TYPES and n.span is not None]
    curve_index = {id(c): i for i, c in enumerate(curves)}
    anim_nodes = [n for n in ms.nodes if _is_anim_node(ms, n)]
    anim_index = {id(n): i for i, n in enumerate(anim_nodes)}

    def target_of(t):
        """出力の先 → (相手のパス・名前, 属性, raw, prop, 名前空間) か None（カメラ・アニメーション側のノード）"""
        if t[0] == "ext":
            path_, attr = t[1], t[2]
            key, raw = _attr_name(attr)
            prop = "node" if key in _VIS else None
            return path_, key, raw, prop, _ns_of(path_)
        node, attr = t[1], t[2]
        if id(node) in anim_index or node.type in ("reference", "clipLibrary", "clipScheduler", "animCurveTL",
                                                   "animCurveTA", "animCurveTU") or _is_camera(node):
            return None
        name = node.path if node.is_dag else node.name
        prop = None
        if attr in _VIS:
            prop = _SHAPE_PROPS.get(node.type, "node")
        return name, attr, False, prop, _ns_of(name)

    # --- 結び付け（名前空間ごと）-----------------------------------------------------------
    per_ns: Dict[str, dict] = {}

    def bucket(ns):
        return per_ns.setdefault(ns, {"bindings": [], "keys": set(), "curves": set(), "nodes": set(), "targets": {}})

    def add_binding(src_kind, src_id, sattr, t):
        tt = target_of(t)
        if tt is None:
            return
        name, attr, raw, prop, ns = tt
        b = bucket(ns)
        key = (prop or "", name, attr)
        if key in b["keys"]:
            return
        b["keys"].add(key)
        rec = {"target": name, "attr": attr}
        if src_kind == "curve":
            rec["curve"] = src_id
            b["curves"].add(src_id)
        else:
            rec["from"] = {"node": src_id, "attr": sattr}
            b["nodes"].add(src_id)
        if raw:
            rec["raw"] = True
        if prop:
            rec["prop"] = prop
        b["bindings"].append(rec)
        if not prop:
            b["targets"].setdefault(name, (t, set()))[1].add(attr)

    for c in curves:
        if id(c) in trax_curves:
            continue
        for sattr, t in outs.get(id(c), ()):
            if sattr not in ("o", "output"):
                continue
            if t[0] == "real" and id(t[1]) in anim_index:
                continue                                  # アニメーション側のノードの入力（ノードから運ぶ）
            add_binding("curve", curve_index[id(c)], sattr, t)
    for n in anim_nodes:
        for sattr, t in outs.get(id(n), ()):
            if t[0] == "real" and id(t[1]) in anim_index:
                continue
            add_binding("node", anim_index[id(n)], sattr, t)

    # アニメーション側のノード: 名前空間のテイクに入れるものを、上流へたどって集める
    def node_inputs(n):
        return ins.get(id(n), {})
    for ns, b in per_ns.items():
        stack = list(b["nodes"])
        while stack:
            k = stack.pop()
            for _attr, src in node_inputs(anim_nodes[k]).items():
                if src[0] == "ext":
                    continue
                s = src[0]
                if id(s) in anim_index and anim_index[id(s)] not in b["nodes"]:
                    b["nodes"].add(anim_index[id(s)])
                    stack.append(anim_index[id(s)])
                elif id(s) in curve_index:
                    b["curves"].add(curve_index[id(s)])
        for k in b["nodes"]:                              # Trax のクリップのカーブ
            n = anim_nodes[k]
            if n.type == "character":
                for s, _sa, d, _da in ms.connections:
                    if d.type == "clipLibrary" and id(s) in curve_index:
                        b["curves"].add(curve_index[id(s)])

    # --- キーのない値 ----------------------------------------------------------------------
    for e in statics_edits:
        ns = _ns_of(e["node"])
        if ns not in per_ns:
            continue
        nums = _numbers(e["value"])
        if nums is None:
            continue
        key, _raw = _attr_name(e["attr"])
        base = key.split("[")[0]
        vals = {}
        if base in ("t", "r", "s") and len(nums) == 3:
            k = ang_k if base == "r" else 1.0
            for ax, v in zip("xyz", nums):
                vals[base + ax] = v * k
        elif base in ("tx", "ty", "tz", "sx", "sy", "sz") and len(nums) == 1:
            vals[base] = nums[0]
        elif base in ("rx", "ry", "rz") and len(nums) == 1:
            vals[base] = nums[0] * ang_k
        elif base not in _STANDARD_ATTRS and base not in _VIS and len(nums) == 1 and "." not in key:
            vals[key] = nums[0]
        if not vals:
            continue
        st = per_ns[ns].setdefault("statics", {})
        st.setdefault(e["node"], {}).update(vals)
    # リファレンスでない相手（ショットのファイルのノード）: キーのある相手の、キーのない t・r・s と独自の属性
    for ns, b in per_ns.items():
        st = b.setdefault("statics", {})
        for name, (t, attrs) in b["targets"].items():
            if t[0] != "real":
                continue
            node = t[1]
            vals = {}
            if node.is_dag and node.type in ("transform", "joint"):
                for base in ("t", "r", "s"):
                    v = node.vec3(base)
                    k = ang_k if base == "r" else 1.0
                    for ax, x in zip("xyz", v):
                        if base + ax not in attrs:
                            vals[base + ax] = x * k
                for a, x in parse_attrs(ms.text, node, _STANDARD_ATTRS, angle_k=rad_k).items():
                    if isinstance(x, (int, float)) and a not in attrs and a not in _VIS and a not in ("pa", "pax", "pay", "paz") \
                            and a not in ins.get(id(node), {}):
                        vals[a] = float(x)
            if vals:
                st.setdefault(name, {}).update({k: v for k, v in vals.items() if k not in st.get(name, {})})

    # --- 警告: ショット側で足したコンストレイント ----------------------------------------------
    for ns, b in per_ns.items():
        names = sorted({n.name for n in ms.nodes if n.type.endswith("Constraint") for _sa, t in outs.get(id(n), ())
                        if t[0] == "ext" and _ns_of(t[1]) == ns})
        b["warnings"] = ["ショット側で足したコンストレイントは運びません: %s" % "・".join(names)] if names and ns else []

    # --- テイクにする ------------------------------------------------------------------------
    pb = playback_range(ms)
    base_name = os.path.splitext(os.path.basename(path))[0]
    want = [ns for ns in per_ns if per_ns[ns]["bindings"] and (namespaces is None or ns in namespaces)]
    takes = []
    for ns in sorted(want):
        b = per_ns[ns]
        order = sorted(b["curves"])
        local = {ci: i for i, ci in enumerate(order)}
        node_order = sorted(b["nodes"])
        nlocal = {k: i for i, k in enumerate(node_order)}
        times, values, types, fixed, metas, ranges = [], [], bytearray(), [], [], []
        off = 0
        for ci in order:
            cv = parse_curve(ms.text, curves[ci])
            vals, chunk, fx, meta = curve_record(cv, off, fps, ang_k, cm)
            if id(curves[ci]) in trax_curves:
                meta["trax"] = True
            else:
                ranges.extend(cv.times)
            times.extend(cv.times)
            values.extend(vals)
            types += chunk
            fixed.extend(fx)
            metas.append(meta)
            off += len(cv.times)
        bindings = []
        for r in b["bindings"]:
            r = dict(r)
            if "curve" in r:
                r["curve"] = local[r["curve"]]
            else:
                r["from"] = {"node": nlocal[r["from"]["node"]], "attr": r["from"]["attr"]}
            bindings.append(r)
        nodes = []
        for k in node_order:
            n = anim_nodes[k]
            e = {"name": n.name, "type": n.type}
            attrs = parse_attrs(ms.text, n, angle_k=rad_k)
            if attrs:
                e["attrs"] = attrs
            inputs = {}
            for attr, src in node_inputs(n).items():
                if src[0] == "ext":
                    key, _raw = _attr_name(src[2])
                    inputs[attr] = {"target": src[1], "attr": key}
                    continue
                s, sattr = src
                if id(s) in curve_index and curve_index[id(s)] in local:
                    inputs[attr] = {"curve": local[curve_index[id(s)]]}
                elif id(s) in anim_index and anim_index[id(s)] in nlocal:
                    inputs[attr] = {"node": nlocal[anim_index[id(s)]], "attr": sattr}
                elif s.type not in ("reference", "clipLibrary", "clipScheduler", "time"):
                    inputs[attr] = {"target": s.path if s.is_dag else s.name, "attr": sattr}
            if inputs:
                e["inputs"] = inputs
            if n.type == "character":
                from .trax import build_trax
                gidx = {id(c): local[curve_index[id(c)]] for c in curves if curve_index[id(c)] in local}
                trax = build_trax(ms, n, gidx, lambda _w: None)
                if trax:
                    e["trax"] = trax
            nodes.append(e)
        t_first = min(ranges) if ranges else pb.get("min", 1.0)
        t_last = max(ranges) if ranges else pb.get("max", t_first)
        start, end = pb.get("min", t_first), pb.get("max", t_last)
        if end < start:
            start, end = end, start
        name = base_name if len(want) == 1 else "%s (%s)" % (base_name, ns or "名前空間なし")
        takes.append({
            "name": name, "namespace": ns,
            "source": {"kind": "ma", "name": os.path.basename(path), "generatorVersion": __version__,
                       "references": False},
            "fps": fps, "timeUnit": ms.time_unit, "linearUnit": ms.linear_unit,
            "start": start, "end": end,
            "animStart": pb.get("animStart", min(start, t_first)), "animEnd": pb.get("animEnd", max(end, t_last)),
            "curves": metas,
            "times": _pack(times, "float32"), "values": _pack(values, "float32"),
            "tangentTypes": _pack(types, "uint8"), "fixedTangents": _pack(fixed, "float32"),
            "bindings": bindings, "nodes": nodes,
            "statics": [{"target": t, "values": v} for t, v in sorted(b.get("statics", {}).items()) if v],
            "warnings": b.get("warnings", []),
        })
    return takes, notes
