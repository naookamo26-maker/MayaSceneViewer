# -*- coding: utf-8 -*-
"""ノードの型ごとの属性の長い名前 → 短い名前の表（ma_viewer/attr_names.json）を、Autodesk の技術資料から作る（開発用）。

  python tools/make_attr_names.py [--cache DIR] [--versions 2024,2026]

対象は、ビューアが評価・読み込みに使う型（rig.py の SUPPORTED_DG・GEOMETRY_TYPES、ma_scene の TRANSFORM_TYPES、
カーブなど。ALL_TYPES）と、その親の型（transform → dagNode → … 。資料の「Parents」欄）。
資料: https://help.autodesk.com/cloudhelp/<版>/ENU/Maya-Tech-Docs/Nodes/<型>.html の属性の表
（「長い名前 (短い名前)」）。--versions の順に探す（2024 の資料にない DL 版の計算ノードは 2026 の資料にある）。長い名前と短い名前が同じ属性は入れない。資料にない型（Maya 2024 以降の新しい計算ノードの
一部・自作ノードなど）は飛ばす（その型は、いままでどおり全体の表 ma_reader.ATTR_ALIASES だけで読み替える）。

出力の形: {"source", "version", "parents": {型: 親の型}, "types": {型: {長い名前: 短い名前}}}（親の型の属性は親に入れる）。
Maya が使えるなら、tools/maya_dump_attr_names.py で Maya から同じ形の表を作れる（そちらが正しい）。
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
OUT = os.path.join(ROOT, "ma_viewer", "attr_names.json")
URL = "https://help.autodesk.com/cloudhelp/%s/ENU/Maya-Tech-Docs/Nodes/%s.html"

_ATTR_RE = re.compile(r'class="attrName"[^>]*>(?:<a name="[^"]*"></a>)?<b><code>(\w+)</code></b>\s*\(<b><code>(\w+)</code></b>\)')
_PARENT_RE = re.compile(r"<th>Parents</th>.*?</tr><tr><td[^>]*>[^<]*</td><td[^>]*>(.*?)</td>", re.S)


def all_types() -> list:
    import ma_viewer.rig as rig
    import ma_viewer.ma_scene as ms
    from ma_viewer.animation import CURVE_TYPES
    types = (set(rig.SUPPORTED_DG) | set(rig.GEOMETRY_TYPES) | set(ms.TRANSFORM_TYPES) | set(CURVE_TYPES)
             | {"ikHandle", "ikEffector", "skinCluster", "mesh", "nurbsCurve", "displayLayer", "reference",
                "place2dTexture", "file", "dagPose", "tweak", "groupParts", "groupId", "camera", "lambert", "blinn",
                "phong", "standardSurface", "aiStandardSurface", "shadingEngine", "bump2d", "animCurveUA", "animCurveUL",
                "animCurveUU", "animCurveUT"})
    return sorted(types)


def fetch(node_type: str, versions, cache: str):
    """資料のページと、その版（どの版にもなければ (None, None)）"""
    for version in versions:
        text = _fetch(node_type, version, cache)
        if text is not None:
            return text, version
    return None, None


def _fetch(node_type: str, version: str, cache: str):
    path = os.path.join(cache, version, node_type + ".html")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path):
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
        return text or None
    try:
        with urllib.request.urlopen(URL % (version, node_type), timeout=30) as r:
            text = r.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        if exc.code != 404:
            raise
        text = ""
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    return text or None


def parse(text: str):
    """(親の型, {長い名前: 短い名前})"""
    m = _PARENT_RE.search(text)
    parent = None
    if m:
        p = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        parent = p or None
    names = {}
    for ln, sn in _ATTR_RE.findall(text):
        if ln != sn:
            names[ln] = sn
    return parent, names


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", default=os.path.join(ROOT, ".attr_names_cache"), help="取得したページを置くフォルダ")
    ap.add_argument("--versions", default="2024,2026", help="探す資料の版（カンマ区切り。前のものを優先）")
    ap.add_argument("-o", "--output", default=OUT)
    args = ap.parse_args(argv)
    os.makedirs(args.cache, exist_ok=True)
    todo = all_types()
    versions = [v.strip() for v in args.versions.split(",") if v.strip()]
    parents, types, missing, used = {}, {}, [], {}
    seen = set()
    while todo:
        t = todo.pop(0)
        if t in seen:
            continue
        seen.add(t)
        text, version = fetch(t, versions, args.cache)
        if text is None:
            missing.append(t)
            continue
        if version != versions[0]:
            used[t] = version
        parent, names = parse(text)
        if names:
            types[t] = dict(sorted(names.items()))
        if parent and parent != t:                        # node のページは自分自身を親に書いている
            parents[t] = parent
            if parent not in seen:
                todo.append(parent)
    out = {"source": "Autodesk Maya Technical Documentation (Nodes)", "versions": versions,
           "otherVersion": dict(sorted(used.items())),           # 最初の版の資料になく、ほかの版から読んだ型
           "parents": dict(sorted(parents.items())), "types": dict(sorted(types.items()))}
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=0, sort_keys=False)
        f.write("\n")
    print("書き出しました: %s（型 %d・名前 %d。資料にない型 %d: %s）" % (
        args.output, len(types), sum(len(v) for v in types.values()), len(missing), ", ".join(missing)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
