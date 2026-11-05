# -*- coding: utf-8 -*-
"""変換結果（ビューアに送る共通 JSON の文字列）のディスクキャッシュ。

同じ .ma を開き直すとき、変換結果に影響するものが前回と同じなら、解析と変換をせずに保存した結果を使う。
影響するもの（どれかが変われば使わない）:

  * .ma 本体と、読み込んだリファレンスのファイル（パス・大きさ・更新時刻）
  * 読み込みの設定（リファレンスを読むか）と、ビューアのプログラム（ma_viewer の中のファイル。同梱の自作ノードの定義を含む）
  * 自作ノードの割り当ての設定ファイル（custom_nodes.config_paths。あるかないかも）
  * リファレンスとテクスチャを探した結果。使う前に同じ引数で探し直して、見つかるファイルが同じか比べる
    （環境変数・workspace.mel・あとから置いたテクスチャなども、これで気づく）

置き場所: 環境変数 MA_VIEWER_CACHE_DIR、なければ Windows は %LOCALAPPDATA%/MayaSceneViewer/cache、それ以外は
~/.cache/MayaSceneViewer。MA_VIEWER_NO_CACHE=1 なら使わない。合計が上限（MA_VIEWER_CACHE_MB、既定 1024 MB）を
超えたら、古く使ったものから消す。中身は zlib で圧縮した JSON の文字列。
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import time
import zlib
from typing import Dict, List, Optional, Tuple

FORMAT = 1                       # 保存の形式の版（変えたら古いものは使わない）
_EXT = (".meta.json", ".scene.z", ".anim.z")


def enabled() -> bool:
    return os.environ.get("MA_VIEWER_NO_CACHE") != "1"


def cache_dir() -> str:
    d = os.environ.get("MA_VIEWER_CACHE_DIR")
    if d:
        return d
    if sys.platform == "win32" and os.environ.get("LOCALAPPDATA"):
        return os.path.join(os.environ["LOCALAPPDATA"], "MayaSceneViewer", "cache")
    return os.path.join(os.path.expanduser("~"), ".cache", "MayaSceneViewer")


def limit_bytes() -> int:
    try:
        return max(0, int(float(os.environ.get("MA_VIEWER_CACHE_MB", "1024")) * 1024 * 1024))
    except ValueError:
        return 1024 * 1024 * 1024


def _norm(p: str) -> str:
    return os.path.normcase(os.path.abspath(p))


def _stat(p: str) -> Optional[List[int]]:
    """[大きさ, 更新時刻（ns）]。なければ None"""
    try:
        st = os.stat(p)
    except OSError:
        return None
    return [st.st_size, st.st_mtime_ns]


_CODE: Optional[str] = None


def code_version() -> str:
    """ビューアのプログラムの版の目印（ma_viewer の中のファイルの名前・大きさ・更新時刻。exe なら exe そのもの）"""
    global _CODE
    if _CODE is None:
        h = hashlib.sha1(str(FORMAT).encode())
        if getattr(sys, "frozen", False):
            h.update(repr((sys.executable, _stat(sys.executable))).encode())
        else:
            root = os.path.dirname(os.path.abspath(__file__))
            for cur, dirs, files in os.walk(root):
                dirs[:] = sorted(d for d in dirs if d not in ("__pycache__", "web", "icon"))
                for f in sorted(files):
                    if f.endswith((".py", ".json")):
                        p = os.path.join(cur, f)
                        h.update(repr((os.path.relpath(p, root), _stat(p))).encode())
        _CODE = h.hexdigest()
    return _CODE


def _key(path: str, references: bool) -> str:
    raw = json.dumps([FORMAT, code_version(), _norm(path), bool(references)])
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()


def _files(base: str) -> Tuple[str, str, str]:
    return tuple(base + e for e in _EXT)  # type: ignore[return-value]


# ---------------------------------------------------------------------------
# 変換したときの状態（record）と、その確かめ（_valid）

def _texture_snapshot(entry: dict) -> dict:
    return {"resolved": entry.get("resolved"), "format": entry.get("format"), "note": entry.get("note"),
            "tiles": [t.get("resolved") for t in entry.get("tiles") or []]}


def record(ms, path: str) -> dict:
    """変換に影響した外部の状態（ms は解析したシーン。変換のあとに呼ぶ）"""
    from .custom_nodes import config_paths
    files = [[_norm(path), _stat(path)]]
    for ri in getattr(ms, "ref_infos", []):
        if ri.loaded and ri.resolved:
            files.append([_norm(ri.resolved), _stat(ri.resolved)])
    for p in config_paths(path):
        files.append([_norm(p), _stat(p)])
    refs = [[raw, referencing, found] for (raw, referencing), found in getattr(ms, "_resolved", {}).items()]
    tex = getattr(ms, "texture_lookups", None) or {"extra_dirs": [], "calls": []}
    return {"files": files, "refs": refs,
            "textures": {"extra_dirs": tex["extra_dirs"],
                         "calls": [[name, raw, _texture_snapshot(entry)] for name, raw, entry in tex["calls"]]}}


def _valid(meta: dict, path: str) -> bool:
    for p, st in meta.get("files", []):
        if _stat(p) != st:
            return False
    refs = meta.get("refs", [])
    if refs:
        from .references import resolve_reference_path
        for raw, referencing, found in refs:
            if resolve_reference_path(raw, referencing, path)[0] != found:
                return False
    tex = meta.get("textures") or {}
    calls = tex.get("calls") or []
    if calls:
        from .materials import TextureResolver, texture_entry
        resolver = TextureResolver(path, extra_dirs=list(tex.get("extra_dirs") or []))
        for name, raw, snap in calls:
            if _texture_snapshot(texture_entry(name, raw, resolver)) != snap:
                return False
    return True


# ---------------------------------------------------------------------------

class Hit:
    """キャッシュから読んだ結果。scene_text / anim_text はビューアに送る JSON の文字列（アニメーションは
    保存していなければ None。has_animation が False なら、アニメーションのないシーン）"""

    def __init__(self, scene_text: str, anim_text: Optional[str], animation_state: str, timing: dict):
        self.scene_text = scene_text
        self.anim_text = anim_text
        self.animation_state = animation_state      # "stored" | "none" | "missing"
        self.timing = timing


def lookup(path: str, references: bool, animation: bool) -> Optional[Hit]:
    """使える保存があれば Hit。animation が True で、アニメーションを保存していなければ使わない（None）"""
    if not enabled():
        return None
    base = os.path.join(cache_dir(), _key(path, references))
    meta_p, scene_p, anim_p = _files(base)
    try:
        with open(meta_p, encoding="utf-8") as f:
            meta = json.load(f)
        if meta.get("format") != FORMAT or meta.get("code") != code_version():
            return None
        state = meta.get("animation", "missing")
        if animation and state == "missing":
            return None
        if not _valid(meta, path):
            return None
        with open(scene_p, "rb") as f:
            scene_text = zlib.decompress(f.read()).decode("utf-8")
        anim_text = None
        if animation and state == "stored":
            with open(anim_p, "rb") as f:
                anim_text = zlib.decompress(f.read()).decode("utf-8")
    except (OSError, ValueError, zlib.error):
        return None
    try:
        os.utime(meta_p)                        # 使った時刻（古いものから消すため）
    except OSError:
        pass
    return Hit(scene_text, anim_text, state, meta.get("timing") or {})


def _write(p: str, data: bytes) -> None:
    tmp = "%s.%d.tmp" % (p, os.getpid())
    with open(tmp, "wb") as f:
        f.write(data)
    os.replace(tmp, p)


def store_scene(path: str, references: bool, meta: dict, scene_text: str, timing: Optional[dict] = None) -> bool:
    """1 段階目の結果を保存する（アニメーションはまだ。store_animation で足す）。保存できたら True"""
    if not enabled():
        return False
    try:
        d = cache_dir()
        os.makedirs(d, exist_ok=True)
        base = os.path.join(d, _key(path, references))
        meta_p, scene_p, anim_p = _files(base)
        _write(scene_p, zlib.compress(scene_text.encode("utf-8"), 1))
        if os.path.exists(anim_p):
            os.remove(anim_p)
        full = dict(meta, format=FORMAT, code=code_version(), path=_norm(path), animation="missing",
                    timing=timing or {}, saved=time.time())
        _write(meta_p, json.dumps(full).encode("utf-8"))
        prune()
        return True
    except OSError:
        return False


def store_animation(path: str, references: bool, anim_text: Optional[str]) -> bool:
    """2 段階目の結果を足す（anim_text が None なら、アニメーションのないシーン）"""
    if not enabled():
        return False
    try:
        base = os.path.join(cache_dir(), _key(path, references))
        meta_p, _scene_p, anim_p = _files(base)
        with open(meta_p, encoding="utf-8") as f:
            meta = json.load(f)
        if anim_text is not None:
            _write(anim_p, zlib.compress(anim_text.encode("utf-8"), 1))
        meta["animation"] = "stored" if anim_text is not None else "none"
        _write(meta_p, json.dumps(meta).encode("utf-8"))
        prune()
        return True
    except (OSError, ValueError):
        return False


def entries() -> List[Tuple[str, int, float]]:
    """保存しているもの [(キー, バイト数, 最後に使った時刻)]"""
    d = cache_dir()
    out: Dict[str, List[float]] = {}
    try:
        names = os.listdir(d)
    except OSError:
        return []
    for n in names:
        for e in _EXT:
            if n.endswith(e):
                k = n[:-len(e)]
                try:
                    st = os.stat(os.path.join(d, n))
                except OSError:
                    continue
                v = out.setdefault(k, [0, 0.0])
                v[0] += st.st_size
                if e == ".meta.json":
                    v[1] = st.st_mtime
    return [(k, int(v[0]), v[1]) for k, v in out.items()]


def total_bytes() -> int:
    return sum(b for _k, b, _t in entries())


def prune(limit: Optional[int] = None) -> None:
    """合計が上限を超えていれば、最後に使ったのが古いものから消す"""
    limit = limit_bytes() if limit is None else limit
    items = sorted(entries(), key=lambda x: x[2])
    total = sum(b for _k, b, _t in items)
    for k, b, _t in items:
        if total <= limit:
            break
        _remove(k)
        total -= b


def _remove(key: str) -> None:
    for p in _files(os.path.join(cache_dir(), key)):
        try:
            os.remove(p)
        except OSError:
            pass


def clear() -> int:
    """すべて消す。消した数"""
    items = entries()
    for k, _b, _t in items:
        _remove(k)
    return len(items)
