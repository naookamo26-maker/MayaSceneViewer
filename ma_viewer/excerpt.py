# -*- coding: utf-8 -*-
""".ma から、指定したノードとその子孫の部分だけを抜き出す（不具合の報告・調査用）。

  python -m ma_viewer excerpt scene.ma                 lookAt（カメラとエイム）をすべて
  python -m ma_viewer excerpt scene.ma camera1_group   名前を指定（複数可）

出力するもの:
  * 指定したノードと、その子孫（-p でつながる子・孫）の createNode のブロック
  * それらのノードがかかわる connectAttr の行
  * 1 段上流のノード（それらに値を入れるカーブ・計算ノードなど）の createNode のブロック（長いものは途中まで）
"""
from __future__ import annotations

import re
from typing import Dict, List, Set, Tuple

from .ma_scene import read_ma_text

_CREATE_RE = re.compile(r'^createNode\s+(\S+)\s+(?:.*?)-n\s+"([^"]+)"(.*)$')
_PARENT_RE = re.compile(r'-p\s+"([^"]+)"')
_CONNECT_RE = re.compile(r'^\s*connectAttr\s+(?:-\S+\s+)*"([^"]+)"\s+"([^"]+)"')
UPSTREAM_LINES = 12                                     # 上流のノードのブロックは、この行数まで


def _short(path: str) -> str:
    """プラグ・パスのノード名（|grp|cam.tx → cam）"""
    node = path.split(".", 1)[0]
    return node.rsplit("|", 1)[-1]


def _blocks(text: str) -> Tuple[List[Tuple[str, str, str, List[str]]], List[Tuple[str, str, str]]]:
    """createNode のブロック [(型, 名前, 親, 行)] と、connectAttr の行 [(元, 先, 行)]"""
    blocks, conns = [], []
    cur = None
    for line in text.splitlines():
        if line.startswith(("\t", " ")) and cur is not None:
            cur[3].append(line)
            continue
        cur = None
        m = _CREATE_RE.match(line)
        if m:
            pm = _PARENT_RE.search(m.group(3))
            cur = (m.group(1), m.group(2), _short(pm.group(1)) if pm else "", [line])
            blocks.append(cur)
            continue
        c = _CONNECT_RE.match(line)
        if c:
            conns.append((c.group(1), c.group(2), line.strip()))
    return blocks, conns


def excerpt(path: str, names: List[str] = ()) -> str:
    text = read_ma_text(path)
    blocks, conns = _blocks(text)
    by_name: Dict[str, Tuple[str, str, str, List[str]]] = {b[1]: b for b in blocks}
    roots = list(names) or [b[1] for b in blocks if b[0] == "lookAt"]
    if not roots:
        return "lookAt のノードが見つかりません。ノードの名前を指定してください。"
    missing = [n for n in roots if n not in by_name]
    picked: Set[str] = {n for n in roots if n in by_name}
    grew = True
    while grew:                                          # 子孫（-p の親が選んだノード）を足す
        grew = False
        for t, n, parent, _lines in blocks:
            if parent in picked and n not in picked:
                picked.add(n)
                grew = True
    related = [(s, d, line) for s, d, line in conns if _short(s) in picked or _short(d) in picked]
    upstream = []
    for s, d, _line in related:
        sn = _short(s)
        if _short(d) in picked and sn not in picked and sn in by_name and sn not in upstream:
            upstream.append(sn)

    out = ["// %s から抜き出し（%s）" % (path.replace("\\", "/").rsplit("/", 1)[-1], "・".join(roots))]
    for n in missing:
        out.append("// 見つからないノード: %s" % n)
    for line in text.splitlines()[:40]:                  # 単位・バージョン（ファイルの先頭の設定）
        if line.startswith(("currentUnit", "fileInfo \"version\"", "requires maya")):
            out.append(line)
    out.append("")
    out.append("// ---- ノード")
    for t, n, _p, lines in blocks:
        if n in picked:
            out.extend(lines)
    out.append("")
    out.append("// ---- 1 段上流のノード（長いものは %d 行まで）" % UPSTREAM_LINES)
    for n in upstream:
        lines = by_name[n][3]
        out.extend(lines[:UPSTREAM_LINES])
        if len(lines) > UPSTREAM_LINES:
            out.append("\t// …（あと %d 行）" % (len(lines) - UPSTREAM_LINES))
    out.append("")
    out.append("// ---- 接続")
    out.extend(line for _s, _d, line in related)
    return "\n".join(out)
