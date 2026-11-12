# -*- coding: utf-8 -*-
"""Maya で開いているシーンから作った文（maya_scene.collect）と、同じシーンを保存した .ma の文を比べる（開発用）。

Maya 内の読み込みがスタンドアロンと違うとき、どのノードのどの属性の文が違うか（抜けている・余分・値が違う・
接続が違う）を一覧にする。.ma で保存したシーンを開き、変更していない状態で、Maya のスクリプトエディタで:

    import sys
    sys.path.append(r"C:/tools/maya_ma_viewer")          # このフォルダの場所
    sys.path.append(r"C:/tools/maya_ma_viewer/tools")
    import maya_compare
    maya_compare.run()                                   # 一覧をファイルに書き、場所と要約を出す

比べるのは、.ma のこのファイルに書かれたノード（リファレンスの中のノードは、Maya 側にしかないので数だけ）。
.ma のリファレンスの仮の接続（reference ノードの .phl[n] から）は、同じ接続先への Maya の接続と同じものとみなす。
メッシュの形・スキンウェイトなど、文にせず API から入れる属性（maya_scene.skip_attrs）は比べない。
"""
from __future__ import annotations

import os
import re
import tempfile
from collections import Counter, defaultdict
from typing import Dict, List, Tuple

from ma_viewer import ma_reader as R
from ma_viewer import maya_scene
from ma_viewer.ma_scene import read_ma_text_info

_PLUG = re.compile(r'"([^"]+)"')
_NUM = re.compile(r"^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$")


def _leaf(node: str) -> str:
    return node.split("|")[-1].lstrip(":")


def _statements(text: str):
    text = R.strip_line_comments(text)
    pos = 0
    while pos < len(text):
        end = R.statement_end(text, pos, text.find(";", pos))
        stmt = text[pos:end]
        pos = end + 1
        cmd, rest = R.split_command(stmt)
        if cmd is not None:
            yield cmd, rest


def blocks(text: str):
    """文 → ({ノード名: {"type", "set": {属性: 値の文}, "add": {独自の属性の長い名前}}}, {(接続元, 接続先)})"""
    nodes: Dict[str, dict] = {}
    conns = set()
    cur = None
    for cmd, rest in _statements(text):
        if cmd == "createNode":
            opts, pos = R.parse_flags(R.tokenize(rest), ["-n", "-name", "-p", "-parent"])
            name = _leaf(opts.get("-n") or opts.get("-name") or "")
            cur = nodes.setdefault(name, {"type": pos[0].value if pos else "", "set": {}, "add": set()})
        elif cmd == "select":
            _opts, pos = R.parse_flags(R.tokenize(rest), [])
            name = _leaf(pos[-1].value) if pos else ""
            cur = nodes.setdefault(name, {"type": "(select)", "set": {}, "add": set()}) if name else None
        elif cmd == "setAttr":
            m = _PLUG.search(rest)
            if not m:
                continue
            plug = m.group(1)
            target = cur
            if not plug.startswith("."):
                node, plug = R.split_node_attr(plug)
                target = nodes.setdefault(_leaf(node), {"type": "", "set": {}, "add": set()})
            if target is not None:
                target["set"][plug.lstrip(".")] = " ".join(rest[m.end():].split())
        elif cmd == "addAttr" and cur is not None:
            opts, _pos = R.parse_flags(R.tokenize(rest), ["-ln", "-longName", "-sn", "-shortName"])
            cur["add"].add(opts.get("-ln") or opts.get("-longName") or opts.get("-sn") or "")
        elif cmd == "connectAttr":
            plugs = _PLUG.findall(rest)
            if len(plugs) >= 2:
                ends = []
                for p in plugs[:2]:
                    node, attr = R.split_node_attr(p)
                    ends.append(_leaf(node) + "." + attr)
                conns.add(tuple(ends))
    return nodes, conns


def _same(a: str, b: str) -> bool:
    ta, tb = a.split(), b.split()
    if len(ta) != len(tb):
        return False
    for x, y in zip(ta, tb):
        if x == y:
            continue
        if _NUM.match(x) and _NUM.match(y) and abs(float(x) - float(y)) <= 1e-5 * max(1.0, abs(float(x))):
            continue
        return False
    return True


def _base(attr: str) -> str:
    """属性の番号を外した形（pm[3] → pm[]）。数を数えるのに使う"""
    return re.sub(r"\[[^\]]*\]", "[]", attr)


def compare_text(maya_text: str, ma_text: str) -> Tuple[str, List[str]]:
    """(要約, 一覧の行)"""
    mn, mc = blocks(maya_text)
    an, ac = blocks(ma_text)
    counts: Counter = Counter()
    examples: Dict[Tuple[str, str, str], List[str]] = defaultdict(list)

    def note(kind: str, ntype: str, attr: str, line: str):
        key = (kind, ntype, _base(attr))
        counts[key] += 1
        if len(examples[key]) < 3:
            examples[key].append(line)

    for name, a in an.items():
        m = mn.get(name)
        if m is None:
            note("Maya にないノード", a["type"], "", name)
            continue
        skip = maya_scene.skip_attrs(a["type"], False)
        for attr, val in a["set"].items():
            if re.split(r"[\[.]", attr, maxsplit=1)[0] in skip:
                continue
            if attr not in m["set"]:
                note(".ma だけにある値", a["type"], attr, "%s.%s = %s" % (name, attr, val[:160]))
            elif not _same(val, m["set"][attr]):
                note("値が違う", a["type"], attr, "%s.%s\n      .ma : %s\n      Maya: %s"
                     % (name, attr, val[:300], m["set"][attr][:300]))
        for attr, val in m["set"].items():
            if attr not in a["set"]:
                note("Maya だけにある値", a["type"], attr, "%s.%s = %s" % (name, attr, val[:160]))
        for ln in a["add"] - m["add"]:
            note(".ma だけにある addAttr", a["type"], ln, "%s.%s" % (name, ln))
    extra_nodes = Counter(m["type"] for name, m in mn.items() if name not in an)
    types = {name: a["type"] for name, a in an.items()}
    ma_only = ac - mc
    maya_only = {(s, d) for s, d in mc - ac if d.split(".")[0] in an}      # 接続元はリファレンスの中でもよい
    # .ma のリファレンスの仮の接続（reference ノードの .phl[n]）は、同じ接続先への Maya の接続と同じものとみなす
    maya_dst = {d for _s, d in maya_only}
    same = {d for s, d in ma_only if ".phl[" in s and d in maya_dst}
    for src, dst in ma_only:
        if dst not in same:
            note(".ma だけにある接続", types.get(dst.split(".")[0], "?"), dst.split(".", 1)[1], "%s -> %s" % (src, dst))
    for src, dst in maya_only:
        if dst not in same:
            note("Maya だけにある接続", types.get(dst.split(".")[0], "?"), dst.split(".", 1)[1], "%s -> %s" % (src, dst))

    lines = []
    for key, n in sorted(counts.items(), key=lambda kv: (kv[0][0], -kv[1], kv[0][1], kv[0][2])):
        kind, ntype, attr = key
        lines.append("[%s] %s%s × %d" % (kind, ntype, "." + attr if attr else "", n))
        lines += ["    " + e for e in examples[key]]
    if extra_nodes:
        lines.append("[Maya だけにあるノード（リファレンスの中など）] " +
                     "、".join("%s %d" % kv for kv in extra_nodes.most_common(15)))
    summary = "違い %d 件（%d 種類）。.ma のノード %d・Maya のノード %d" % (
        sum(counts.values()), len(counts), len(an), len(mn))
    return summary, lines


def run(path: str = "", out: str = "") -> str:
    """Maya 内で: いまのシーンを集めて、保存した .ma（省略時はいま開いているファイル）と比べ、一覧をファイルに書く"""
    from maya import cmds
    path = path or cmds.file(query=True, sceneName=True)
    if not path.lower().endswith(".ma"):
        raise RuntimeError(".ma で保存したシーンを開いてから実行してください: %s" % path)
    st = maya_scene.collect()
    summary, lines = compare_text("\n".join(st.lines), read_ma_text_info(path)[0])
    out = out or os.path.join(tempfile.gettempdir(), "maya_compare.txt")
    with open(out, "w", encoding="utf-8") as f:
        f.write(summary + "\n\n" + "\n".join(lines) + "\n")
    print(summary)
    print("\n".join(line for line in lines if not line.startswith("    "))[:4000])
    print("一覧を書き出しました:", out)
    return out
