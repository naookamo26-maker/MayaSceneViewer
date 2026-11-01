"""コンポーネントタグ（Maya 2022 以降）: デフォーマが変形するカーブの CV を名前で選ぶ。

カーブのシェイプ（ふつうは Orig）にタグを書く。
  setAttr ".gtag[0].gtagnm" -type "string" "cluster1";
  setAttr ".gtag[0].gtagcmp" -type "componentList" 1 "cv[0]";
.cc（-type "nurbsCurve"）の CV の後ろにも同じものが続く（"gtag" 数 "名前" 数 "cv[0]" …）。
タグは形と一緒に下流へ流れるので、デフォーマの入力（ip[k].ig）を上流へたどって最初に見つかったタグを使う。

デフォーマは入力ごとに式（ip[k].gtg）でタグを選ぶ。既定の "*" はすべて。
  "a+b" は和、"a-b" は差、"a^b" は共通部分（左から順に）。名前には * などのワイルドカードが使える。
"""
from __future__ import annotations

import fnmatch
import re
from typing import Dict, List, Optional, Set

from .ma_scene import MaNode, MaScene
from . import ma_reader as R

_SETATTR_RE = re.compile(r"setAttr\b([^;]*);")
_TAG_RE = re.compile(r"^gtag\[(\d+)\]\.(gtagnm|gtagcmp)$")
_EXPR_RE = re.compile(r"^ip\[(\d+)\]\.gtg$")
_CV_RE = re.compile(r"^cv\[(\*|\d+)(?::(\d+))?\]$")
# 上流へたどるときの、デフォーマ・形を作るノードの入力の形
_UPSTREAM_RE = re.compile(r"^(ip\[\d+\]\.ig|ig|cr)$")


def _setattrs(ms: MaScene, node: MaNode):
    """ノードのブロック（と、ブロックの外のノード名つきの setAttr）の setAttr を (属性, SetAttr) で返す"""
    spans = [s for s in (node.span, node.espan) if s is not None] + sorted(node.xspans or [])
    for a, b in spans:
        for m in _SETATTR_RE.finditer(ms.text, a, b):
            sa = R.parse_setattr(m.group(1))
            if sa is None:
                continue
            attr = sa.plug[1:] if sa.plug.startswith(".") else R.split_node_attr(sa.plug)[1]
            yield R.normalize_attr(attr), sa


def _components(tokens: List[str], ncv: int) -> Set[int]:
    """componentList の値（数 "cv[0]" "cv[2:4]" …）の CV の番号"""
    out: Set[int] = set()
    for tok in tokens:
        m = _CV_RE.match(tok.strip())
        if not m:
            continue
        if m.group(1) == "*":
            out.update(range(ncv))
        else:
            a = int(m.group(1))
            out.update(range(a, int(m.group(2) or a) + 1))
    return out


def _cc_layout(vals: List[str]):
    """-type "nurbsCurve" の値の、形の部分の長さと CV の数（読めなければ None）"""
    try:
        rational = vals[3].lower() in ("yes", "true", "on", "1")
        dim = int(float(vals[4]))
        nk = int(float(vals[5]))
        ncv = int(float(vals[6 + nk]))
    except (ValueError, IndexError):
        return None
    return 7 + nk + ncv * (dim + (1 if rational else 0)), ncv


def curve_tags(ms: MaScene, node: MaNode):
    """カーブのタグ {名前: CV の番号} と CV の数。タグがなければ ({}, CV の数)"""
    ncv = 0
    names: Dict[int, str] = {}
    comps: Dict[int, List[str]] = {}
    tags: Dict[str, Set[int]] = {}
    trailing: List[str] = []
    for key, sa in _setattrs(ms, node):
        if key == "cc" and sa.type == "nurbsCurve":
            vals = sa.values()
            lay = _cc_layout(vals)
            if lay is not None:
                ncv = lay[1]
                trailing = vals[lay[0]:]
            continue
        m = _TAG_RE.match(key)
        if m:
            i = int(m.group(1))
            if m.group(2) == "gtagnm" and sa.values():
                names[i] = sa.values()[0]
            elif m.group(2) == "gtagcmp":
                comps[i] = sa.values()[1:]          # 先頭は要素の数
    # .cc の後ろのタグ: "gtag" 数 ("名前" 数 "cv[…]" …) × 数
    if len(trailing) >= 2 and trailing[0] == "gtag":
        try:
            pos, count = 2, int(trailing[1])
            for _ in range(count):
                name, k = trailing[pos], int(trailing[pos + 1])
                tags[name] = _components(trailing[pos + 2:pos + 2 + k], ncv)
                pos += 2 + k
        except (ValueError, IndexError):
            pass
    for i, name in names.items():
        tags[name] = _components(comps.get(i, []), ncv)
    return tags, ncv


def evaluate(expr: str, tags: Dict[str, Set[int]], ncv: int) -> Set[int]:
    """タグの式（"*"・"a+b"・"a-b"・"a^b"。空白も和）の CV の番号"""
    every = set(range(ncv))
    result: Optional[Set[int]] = None
    op = "+"
    for tok in re.findall(r"[+\-^]|[^\s+\-^]+", expr):
        if tok in "+-^":
            op = tok
            continue
        if tok == "*":
            s = set(every)
        else:
            s = set()
            for name, comp in tags.items():
                if fnmatch.fnmatchcase(name, tok):
                    s |= comp
        if result is None:
            result = s if op != "-" else every - s
        elif op == "+":
            result |= s
        elif op == "-":
            result -= s
        else:
            result &= s
        op = "+"
    return result if result is not None else set()


def _tagged_source(ms: MaScene, node: MaNode, key: str) -> Optional[MaNode]:
    """デフォーマの入力（key）を上流へたどり、タグを持つカーブを返す"""
    x, seen = node.inputs.get(key, (None, ""))[0], set()
    while x is not None and id(x) not in seen:
        seen.add(id(x))
        if x.type == "nurbsCurve" and curve_tags(ms, x)[0]:
            return x
        nxt = None
        for k, (src, _sattr) in x.inputs.items():
            if _UPSTREAM_RE.match(k):
                nxt = src
                break
        x = nxt
    return None


def _source_curve(node: MaNode, key: str) -> Optional[MaNode]:
    """デフォーマの入力（key）を上流へたどった、元のカーブ（CV の数を知るため）"""
    x, seen = node.inputs.get(key, (None, ""))[0], set()
    while x is not None and id(x) not in seen:
        seen.add(id(x))
        if x.type == "nurbsCurve":
            return x
        nxt = None
        for k, (src, _sattr) in x.inputs.items():
            if _UPSTREAM_RE.match(k):
                nxt = src
                break
        x = nxt
    return None


def group_parts_detail(ms: MaScene, node: MaNode, k: int):
    """コンポーネントタグを使わない古い書き方: デフォーマの入力 k（ip[k].ig）の上流の groupParts のうち、デフォーマと
    同じ groupId（ip[k].gi ← groupId → groupParts.gi）のものの .inputComponents（cv[1] など）。
    (CV の番号のリスト（すべてなら None）, 診断の説明) を返す"""
    from .ma_scene import parse_component_list
    gid = node.inputs.get("ip[%d].gi" % k)
    x, seen = node.inputs.get("ip[%d].ig" % k, (None, ""))[0], set()
    parts, passed = None, []
    while x is not None and id(x) not in seen and x.type != "nurbsCurve":
        seen.add(id(x))
        if x.type == "groupParts":
            g = x.inputs.get("gi", (None,))[0]
            passed.append("%s（groupId %s）" % (x.name, g.name if g is not None else "なし"))
            if gid is not None and g is gid[0]:
                parts = x
                break
        nxt = None
        for key, (src, _sattr) in x.inputs.items():
            if _UPSTREAM_RE.match(key):
                nxt = src
                break
        x = nxt
    if gid is None:
        return None, "groupId（.ip[%d].gi）がつながっていないので全部の CV。上流の groupParts: %s" % (
            k, "、".join(passed) or "なし")
    if parts is None:
        return None, "groupId %s につながる groupParts が上流にないので全部の CV。上流の groupParts: %s" % (
            gid[0].name, "、".join(passed) or "なし")
    ic = (parts.raw or {}).get("ic") or []
    shown_ic = " ".join(ic[:6]) + (" …" if len(ic) > 6 else "")
    ranges = parse_component_list(ic, "cv")
    if not ranges:
        return None, "%s の .inputComponents（%s）に CV の指定がないので全部の CV" % (parts.name, shown_ic or "値なし")
    if any(b < 0 for _a, b in ranges):
        return None, "%s の .inputComponents が cv[*]（全部の CV）" % parts.name
    src = _source_curve(node, "ip[%d].ig" % k)
    ncv = curve_tags(ms, src)[1] if src is not None else 0
    sel = sorted({v for a, b in ranges for v in range(a, b + 1)})
    if ncv and len(sel) >= ncv and sel[-1] < ncv:
        return None, "%s の .inputComponents（%s）が全部の CV（%d 個）" % (parts.name, shown_ic, ncv)
    return sel, "%s の .inputComponents（%s）" % (parts.name, shown_ic)


def group_parts_mask(ms: MaScene, node: MaNode, k: int) -> Optional[List[int]]:
    """group_parts_detail の CV の番号のリスト（すべてなら None）"""
    return group_parts_detail(ms, node, k)[0]


def mask_notes(ms: MaScene, node: MaNode) -> Dict[str, str]:
    """診断用: デフォーマの入力ごとに、動かす CV をどう決めたか（タグの式・groupParts・全部の CV とその理由）"""
    exprs = {}
    for key, sa in _setattrs(ms, node):
        m = _EXPR_RE.match(key)
        if m and sa.type == "string" and sa.values():
            exprs[int(m.group(1))] = sa.values()[0].strip()
    out: Dict[str, str] = {}
    for key in node.inputs:
        m = re.match(r"^ip\[(\d+)\]\.ig$", key)
        if not m:
            continue
        k = int(m.group(1))
        expr = exprs.get(k)
        if expr not in (None, "", "*"):
            out[str(k)] = "コンポーネントタグの式 %s" % expr
        else:
            out[str(k)] = group_parts_detail(ms, node, k)[1]
    return out


def deformer_masks(ms: MaScene, node: MaNode, sources: Optional[Dict[str, str]] = None) -> Dict[str, List[int]]:
    """デフォーマの入力ごとの、変形する CV の番号 {"k": [番号…]}。コンポーネントタグ（ip[k].gtg）で選ぶか、タグを
    使わない古い書き方なら groupParts の .inputComponents で選ぶ。すべての CV なら入れない。
    sources を渡すと、入力ごとにどちらで選んだか（"コンポーネントタグ" / "groupParts"）を入れる"""
    sources = {} if sources is None else sources
    exprs = {}
    for key, sa in _setattrs(ms, node):
        m = _EXPR_RE.match(key)
        if m and sa.type == "string" and sa.values():
            exprs[int(m.group(1))] = sa.values()[0].strip()
    out: Dict[str, List[int]] = {}
    for k, expr in sorted(exprs.items()):
        if not expr or expr == "*":
            continue                                   # 空は、タグを使わない（groupParts などで選ぶ）古い書き方として扱う
        src = _tagged_source(ms, node, "ip[%d].ig" % k)
        if src is None:
            continue
        tags, ncv = curve_tags(ms, src)
        sel = evaluate(expr, tags, ncv)
        if len(sel) < ncv:
            out[str(k)] = sorted(sel)
            sources[str(k)] = "コンポーネントタグ"
    # タグの式がない入力は、groupParts の .inputComponents で選ぶ
    for key in node.inputs:
        m = re.match(r"^ip\[(\d+)\]\.ig$", key)
        if not m or str(int(m.group(1))) in out or exprs.get(int(m.group(1))) not in (None, "", "*"):
            continue
        sel = group_parts_mask(ms, node, int(m.group(1)))
        if sel is not None:
            out[m.group(1)] = sel
            sources[m.group(1)] = "groupParts"
    return out
