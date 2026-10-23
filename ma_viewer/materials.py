# -*- coding: utf-8 -*-
"""マテリアル・テクスチャまわりの共通処理（.ma パーサと Maya 抽出器の両方で使う）。

  * テクスチャパスの検索（TextureResolver）
  * シェーダーの種類ごとの「アルベド（色）」と「不透明度」の属性名
"""
from __future__ import annotations

import difflib
import os
import re
from typing import Dict, List, Optional, Sequence, Tuple

# 表示できる画像形式（拡張子 → 形式名）。tga は three.js の TGALoader、その他はブラウザが読む
SUPPORTED_FORMATS = {".tga": "tga", ".png": "png", ".jpg": "jpeg", ".jpeg": "jpeg",
                     ".bmp": "bmp", ".gif": "gif", ".webp": "webp"}

# シェーダーの種類 → アルベドの属性名（.ma の短縮名と、cmds 用の長い名前の両方）
ALBEDO_ATTRS: Dict[str, Tuple[str, ...]] = {
    "lambert": ("c", "color"),
    "blinn": ("c", "color"),
    "phong": ("c", "color"),
    "phongE": ("c", "color"),
    "anisotropic": ("c", "color"),
    "surfaceShader": ("oc", "outColor"),
    "aiStandardSurface": ("baseColor", "base_color"),
    "standardSurface": ("bc", "baseColor"),
    "openPBRSurface": ("bc", "baseColor"),
    "StingrayPBS": ("TEX_color_map",),
    "usdPreviewSurface": ("dc", "diffuseColor"),
    "aiFlat": ("color",),
}
FALLBACK_ALBEDO_ATTRS = ("c", "color", "baseColor", "bc", "base_color", "diffuseColor", "dc")

# 不透明度・透明度の属性名（ここにアルベドと同じ file ノードのアルファがつながっていれば透過を使う）
OPACITY_ATTRS = ("it", "transparency", "opacity", "opc", "o", "geometryOpacity", "go",
                 "TEX_opacity_map", "opacityThreshold")
ALPHA_OUTPUTS = ("ot", "oa", "outTransparency", "outAlpha")

DEFAULT_COLORS = {"aiStandardSurface": (0.8, 0.8, 0.8), "standardSurface": (0.8, 0.8, 0.8),
                  "openPBRSurface": (0.8, 0.8, 0.8)}


def albedo_attrs(shader_type: str) -> Tuple[str, ...]:
    return ALBEDO_ATTRS.get(shader_type, FALLBACK_ALBEDO_ATTRS)


# 表示に使うマップの種類
MAP_KINDS = ("baseColor", "normal", "roughness", "metalness", "ao", "emissive", "opacity")

# シェーダーの種類 → マップの種類 → 属性名（.ma の短縮名と、cmds 用の長い名前）
_STD_SURFACE = {"baseColor": ("bc", "baseColor"), "roughness": ("sr", "specularRoughness"),
                "metalness": ("m", "metalness"), "emissive": ("ec", "emissionColor"),
                "opacity": ("opc", "opacity"), "normal": ("n", "normalCamera")}
MAP_ATTRS: Dict[str, Dict[str, Tuple[str, ...]]] = {
    "aiStandardSurface": {"baseColor": ("baseColor", "base_color"), "roughness": ("specularRoughness",),
                          "metalness": ("metalness",), "emissive": ("emissionColor",), "opacity": ("opacity",),
                          "normal": ("normalCamera", "n")},
    "standardSurface": _STD_SURFACE,
    "openPBRSurface": _STD_SURFACE,
    "StingrayPBS": {"baseColor": ("TEX_color_map",), "normal": ("TEX_normal_map",),
                    "roughness": ("TEX_roughness_map",), "metalness": ("TEX_metallic_map",),
                    "ao": ("TEX_ao_map",), "emissive": ("TEX_emissive_map",)},
    "usdPreviewSurface": {"baseColor": ("dc", "diffuseColor"), "roughness": ("rgh", "roughness"),
                          "metalness": ("mtl", "metallic"), "ao": ("occ", "occlusion"),
                          "emissive": ("ec", "emissiveColor"), "opacity": ("opa", "opacity"),
                          "normal": ("nrm", "normal")},
}
_LAMBERT_MAPS = {"baseColor": ("c", "color"), "normal": ("n", "normalCamera")}
for _t in ("lambert", "blinn", "phong", "phongE", "anisotropic"):
    MAP_ATTRS[_t] = _LAMBERT_MAPS
MAP_ATTRS["surfaceShader"] = {"baseColor": ("oc", "outColor")}

# ラフネス・メタリックの値（マップがないときに使う）の属性名と既定値
SCALAR_ATTRS = {
    "aiStandardSurface": {"roughness": (("specularRoughness",), 0.2), "metalness": (("metalness",), 0.0)},
    "standardSurface": {"roughness": (("sr", "specularRoughness"), 0.2), "metalness": (("m", "metalness"), 0.0)},
    "openPBRSurface": {"roughness": (("sr", "specularRoughness"), 0.3), "metalness": (("m", "metalness"), 0.0)},
    "usdPreviewSurface": {"roughness": (("rgh", "roughness"), 0.5), "metalness": (("mtl", "metallic"), 0.0)},
}

# file ノードの出力属性 → 使うチャンネル
OUTPUT_CHANNEL = {"oc": "rgb", "outColor": "rgb", "ocr": "r", "outColorR": "r", "ocg": "g", "outColorG": "g",
                  "ocb": "b", "outColorB": "b", "oa": "a", "outAlpha": "a",
                  # 透明度の出力も、画像のアルファから決まるのでアルファを読む
                  "ot": "a", "outTransparency": "a"}


def map_attrs(shader_type: str) -> Dict[str, Tuple[str, ...]]:
    return MAP_ATTRS.get(shader_type, {"baseColor": FALLBACK_ALBEDO_ATTRS, "normal": ("n", "normalCamera")})


_TILE_RE = re.compile(r"(?<!\d)(1\d{3})(?!\d)")


def to_udim_pattern(path: str) -> str:
    """タイル番号入りのファイル名（tile.1001.tga）→ <UDIM> 入りのパターン（uvTilingMode = UDIM のとき）"""
    p = _norm(path)
    d, name = (p.rsplit("/", 1) if "/" in p else ("", p))
    hits = list(_TILE_RE.finditer(name))
    if not hits:
        return path
    m = hits[-1]
    name = name[:m.start()] + "<UDIM>" + name[m.end():]
    return (d + "/" + name) if d else name


def is_udim(path: str) -> bool:
    return "<udim>" in path.lower()


def default_color(shader_type: str) -> Tuple[float, float, float]:
    return DEFAULT_COLORS.get(shader_type, (0.5, 0.5, 0.5))


def texture_format(path: str) -> Optional[str]:
    return SUPPORTED_FORMATS.get(os.path.splitext(path)[1].lower())


# ---------------------------------------------------------------------------
# テクスチャパスの検索
# ---------------------------------------------------------------------------

_DRIVE_RE = re.compile(r"^[A-Za-z]:/")
_SOURCEIMAGES_RE = re.compile(r'workspace\s+-fr\s+"sourceImages"\s+"([^"]*)"')


def _norm(p: str) -> str:
    return p.replace("\\", "/")


def _is_abs(p: str) -> bool:
    return p.startswith("/") or bool(_DRIVE_RE.match(p))


def find_project_root(scene_path: str) -> Optional[str]:
    """シーンファイルの上位フォルダをたどり、workspace.mel のあるフォルダを返す。"""
    d = os.path.dirname(os.path.abspath(scene_path))
    while True:
        if os.path.isfile(os.path.join(d, "workspace.mel")):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            return None
        d = parent


def sourceimages_dir(project_root: str) -> str:
    """workspace.mel の sourceImages の設定（なければ "sourceimages"）。"""
    name = "sourceimages"
    try:
        with open(os.path.join(project_root, "workspace.mel"), encoding="utf-8", errors="replace") as f:
            m = _SOURCEIMAGES_RE.search(f.read())
        if m and m.group(1).strip():
            name = m.group(1).strip()
    except OSError:
        pass
    name = _norm(name)
    return name if _is_abs(name) else os.path.join(project_root, name)


# 4 番目の検索（シーンと同じフォルダにあるフォルダの中）の範囲
SIBLING_MAX_DEPTH = 4          # シーンのフォルダから数えた深さ
SIBLING_MAX_DIRS = 5000        # 調べるフォルダ数の上限（巨大なフォルダで止まらないように）


def name_similarity(scene_stem: str, folder: str) -> float:
    """シーンのファイル名とフォルダ名の近さ（0〜1.5）。含む関係なら加点する。"""
    a, b = scene_stem.lower(), folder.lower()
    score = difflib.SequenceMatcher(None, a, b).ratio()
    if a and b and (a in b or b in a):
        score += 0.5
    return score


class TextureResolver:
    """テクスチャパスを次の順に探す。

      1. 書かれているパスそのもの（相対パスならプロジェクトのルート → シーンのフォルダを基準）
      2. Maya プロジェクトなら sourceimages フォルダ
      3. シーン（.ma）と同じフォルダ
      4. シーンと同じフォルダにあるフォルダの中（下の階層まで、ファイル名で探す）

    2・3 では、まずファイル名だけで探し、見つからなければ元のパスの親フォルダ名を
    1 つずつ足して探す（a.tga → tex/a.tga → chr/tex/a.tga …）。
    4 で複数見つかった場合は、シーンのファイル名に名前が近いフォルダのものを選ぶ
    （同じなら浅いもの → パスの順）。
    """

    def __init__(self, scene_path: str = "", project_root: Optional[str] = None, auto_project: bool = True):
        self.scene_dir = os.path.dirname(os.path.abspath(scene_path)) if scene_path else os.getcwd()
        if project_root is None and auto_project and scene_path:
            project_root = find_project_root(scene_path)
        self.project_root = project_root
        self.sourceimages = sourceimages_dir(project_root) if project_root else None
        self.scene_stem = os.path.splitext(os.path.basename(scene_path))[0] if scene_path else ""
        self._cache: Dict[str, Tuple[Optional[str], List[str]]] = {}
        self._sibling_index: Optional[Dict[str, List[str]]] = None
        self.notes: Dict[str, str] = {}      # 生のパス → 補足（4 で複数見つかったときなど）

    def candidates(self, raw: str, preferred: Sequence[str] = ()) -> List[str]:
        p = _norm(os.path.expandvars(raw.strip()))
        out: List[str] = [_norm(x) for x in preferred if x]
        if _is_abs(p):
            out.append(p)
        else:
            if self.project_root:
                out.append(_norm(os.path.join(self.project_root, p)))
            out.append(_norm(os.path.join(self.scene_dir, p)))
        parts = [x for x in p.split("/") if x and x not in (".", "..") and not x.endswith(":")]
        for base in ([self.sourceimages] if self.sourceimages else []) + [self.scene_dir]:
            for k in range(1, len(parts) + 1):
                out.append(_norm(os.path.join(base, *parts[-k:])))
        seen = set()
        uniq = []
        for c in out:
            key = os.path.normcase(os.path.normpath(c))
            if key not in seen:
                seen.add(key)
                uniq.append(c)
        return uniq

    def resolve_udim(self, raw: str, preferred: Sequence[str] = ()) -> Tuple[List[dict], List[str]]:
        """<UDIM> 入りのパス → 見つかったタイル [{tile, resolved}]（同じフォルダのもの）と、探したフォルダ。

        探すフォルダの順序は通常の検索と同じ。最後に、シーンと同じフォルダにあるフォルダの中も探す。
        """
        p = _norm(os.path.expandvars(raw.strip()))
        name = p.split("/")[-1]
        rx = re.compile("^" + re.escape(name).replace(re.escape("<UDIM>"), r"(1\d{3})")
                        .replace(re.escape("<udim>"), r"(1\d{3})") + "$", re.IGNORECASE)
        tried: List[str] = []
        for c in self.candidates(raw, preferred):
            d = os.path.dirname(c)
            if d in tried:
                continue
            tried.append(d)
            try:
                files = os.listdir(d)
            except OSError:
                continue
            tiles = sorted((int(m.group(1)), os.path.join(d, f)) for f in files for m in [rx.match(f)] if m)
            if tiles:
                return [{"tile": t, "resolved": os.path.abspath(f)} for t, f in tiles], tried
        tried.append(_norm(os.path.join(self.scene_dir, "*", "**", name)))
        if self._sibling_index is None:
            self._sibling_index = self._build_sibling_index()
        by_dir: Dict[str, List[Tuple[int, str]]] = {}
        for key, paths in self._sibling_index.items():
            m = rx.match(key)
            if m:
                for path in paths:
                    by_dir.setdefault(os.path.dirname(path), []).append((int(m.group(1)), path))
        if not by_dir:
            return [], tried

        def rank(d):
            rel = os.path.relpath(d, self.scene_dir)
            return (-name_similarity(self.scene_stem, rel.split(os.sep)[0]), rel.count(os.sep), rel.lower())
        best = sorted(by_dir, key=rank)[0]
        return [{"tile": t, "resolved": os.path.abspath(f)} for t, f in sorted(by_dir[best])], tried

    def resolve(self, raw: str, preferred: Sequence[str] = ()) -> Tuple[Optional[str], List[str]]:
        """(見つかったパス or None, 試したパスの一覧)"""
        key = raw + "\0" + "\0".join(preferred)
        if key in self._cache:
            return self._cache[key]
        tried: List[str] = []
        found = None
        if raw and "<udim>" not in raw.lower() and "<uvtile>" not in raw.lower():
            for c in self.candidates(raw, preferred):
                tried.append(c)
                if os.path.isfile(c):
                    found = os.path.abspath(c)
                    break
            if found is None:
                found = self._search_siblings(raw, tried)
        self._cache[key] = (found, tried)
        return found, tried

    # ------------------------------------------------------------------
    def _build_sibling_index(self) -> Dict[str, List[str]]:
        """シーンのフォルダにあるフォルダの中のファイル一覧（小文字のファイル名 → パス）。1 回だけ作る。"""
        index: Dict[str, List[str]] = {}
        root = self.scene_dir
        dirs_seen = 0
        try:
            tops = sorted(e.name for e in os.scandir(root) if e.is_dir() and not e.name.startswith("."))
        except OSError:
            return index
        for top in tops:
            for cur, subdirs, files in os.walk(os.path.join(root, top)):
                dirs_seen += 1
                depth = os.path.relpath(cur, root).count(os.sep) + 1
                subdirs[:] = sorted(d for d in subdirs if not d.startswith(".")) if depth < SIBLING_MAX_DEPTH else []
                for f in files:
                    index.setdefault(f.lower(), []).append(os.path.join(cur, f))
                if dirs_seen >= SIBLING_MAX_DIRS:
                    return index
        return index

    def _search_siblings(self, raw: str, tried: List[str]) -> Optional[str]:
        name = _norm(os.path.expandvars(raw.strip())).split("/")[-1]
        if not name:
            return None
        tried.append(_norm(os.path.join(self.scene_dir, "*", "**", name)))
        if self._sibling_index is None:
            self._sibling_index = self._build_sibling_index()
        hits = self._sibling_index.get(name.lower(), [])
        if not hits:
            return None

        def rank(p):
            rel = os.path.relpath(p, self.scene_dir)
            top = rel.split(os.sep)[0]
            return (-name_similarity(self.scene_stem, top), rel.count(os.sep), rel.lower())
        hits = sorted(hits, key=rank)
        best = os.path.abspath(hits[0])
        if len(hits) > 1:
            others = [os.path.relpath(h, self.scene_dir) for h in hits[1:4]]
            self.notes[raw] = ("同じ名前のファイルが %d 個見つかったため、シーン名に近いフォルダの %s を使います（ほか: %s%s）"
                               % (len(hits), os.path.relpath(best, self.scene_dir), " / ".join(others),
                                  " ほか" if len(hits) > 4 else ""))
        return best


def texture_entry(node_name: str, raw: str, resolver: TextureResolver, preferred: Sequence[str] = ()) -> dict:
    """共通 JSON の textures[] の 1 件。UDIM なら tiles に各タイルを入れる。"""
    from pathlib import Path
    pref_udim = [x for x in preferred if x and is_udim(x)]
    if is_udim(raw) or pref_udim:
        pattern = raw if is_udim(raw) else pref_udim[0]
        tiles, tried = resolver.resolve_udim(pattern, [x for x in preferred if x and not is_udim(x)])
        for t in tiles:
            t["url"] = Path(t["resolved"]).as_uri()
        first = tiles[0]["resolved"] if tiles else None
        return {"node": node_name, "path": raw, "resolved": first, "url": tiles[0]["url"] if tiles else None,
                "format": texture_format(first or pattern), "tried": tried, "udim": True, "tiles": tiles}
    found, tried = resolver.resolve(raw, preferred)
    fmt = texture_format(found or raw)
    entry = {"node": node_name, "path": raw, "resolved": found, "url": None, "format": fmt, "tried": tried}
    if raw in resolver.notes:
        entry["note"] = resolver.notes[raw]
    if found:
        entry["url"] = Path(found).as_uri()
    return entry


def texture_warnings(entry: dict, used_by: str) -> List[str]:
    raw = entry["path"]
    if not raw:
        return ["%s: %s のファイル名が空です" % (used_by, entry["node"])]
    low = raw.lower()
    if "<uvtile>" in low:
        return ["%s: <UVTILE> 形式のタイル（%s）は未対応です（<UDIM> のみ対応）" % (used_by, raw)]
    if entry.get("udim") and not entry.get("tiles"):
        return ["%s: UDIM のテクスチャが見つかりません: %s（探したフォルダ: %s）"
                % (used_by, raw, " / ".join(entry["tried"][:6]))]
    if entry["resolved"] is None:
        shown = entry["tried"][:6]
        more = len(entry["tried"]) - len(shown)
        return ["%s: テクスチャが見つかりません: %s（試したパス: %s%s）"
                % (used_by, raw, " / ".join(shown), " ほか %d 件" % more if more > 0 else "")]
    if entry.get("note"):
        return ["%s: %s" % (used_by, entry["note"])]
    if entry["format"] is None:
        return ["%s: %s の形式（%s）は表示できません（TGA・PNG・JPEG などに対応）"
                % (used_by, os.path.basename(entry["resolved"]), os.path.splitext(entry["resolved"])[1])]
    return []
