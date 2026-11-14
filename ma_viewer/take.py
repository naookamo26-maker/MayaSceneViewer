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


def _missing_references(scene: dict) -> List[str]:
    """読み込めなかったリファレンス（名前空間とその理由）"""
    out = []
    for r in (scene.get("source") or {}).get("references") or []:
        if not r.get("loaded"):
            out.append("%s（%s）" % (r.get("namespace") or r.get("path"), r.get("reason") or "読み込めません"))
    return out


def read_source(path: str, references: bool = True, progress: ProgressFn = None) -> Tuple[Optional[dict], List[str]]:
    """1 つのファイルから、テイクの元（とお知らせ）を作る。読めないものは例外"""
    from . import package
    name = os.path.basename(path)
    low = path.lower()
    notes: List[str] = []
    if low.endswith(package.TAKES_EXT):
        return {"kind": "takes", "takes": package.read_takes(path), "name": name}, notes
    if low.endswith(".msv"):
        scene, _pkg = package.read_package(path)
        return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes
    if low.endswith(".json"):
        with open(path, "r", encoding="utf-8") as f:
            scene = json.load(f)
        return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes
    if low.endswith(".ma"):
        from .extract_ma import load_ma

        def prog(frac, msg, *_rest):
            if progress is not None:
                progress("%s: %s" % (name, msg))
        scene = load_ma(path, prog, animation=True, references=references)
        missing = _missing_references(scene)
        if missing:
            notes.append("%s: 読み込めなかったリファレンスのキーは取り出せません: %s" % (name, "・".join(missing)))
        if not scene.get("animation"):
            notes.append("%s: 取り出せるアニメーションがありません" % name)
            return None, notes
        return {"kind": "scene", "scene": source_scene(scene), "name": name}, notes
    if low.endswith(".mb"):
        raise ValueError("Maya バイナリ (.mb) からはテイクを取り出せません。.ma として保存し直してください")
    raise ValueError("テイクを読めない種類のファイルです（.msva・.msv・.json・.ma）")


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
