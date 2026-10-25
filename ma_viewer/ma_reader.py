# -*- coding: utf-8 -*-
"""Maya ASCII (.ma) の字句解析。

.ma は MEL コマンドの列で、文はセミコロンで終わる。ここでは
  1. 文字列・コメントを考慮してファイルを文単位に分割し、
  2. 各文をコマンド名と引数に分け、
  3. setAttr は大きな数値ブロックを高速に扱えるよう専用に解析する。

巨大なファイル（数百 MB）でも扱えるよう、数値ブロックは正規表現で
1 トークンずつ切らず、str.split() で一括分割する。
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, Iterator, List, Optional, Sequence, Tuple, Union

# 文の区切り検出用: 文字列リテラル / 行コメント / セミコロン
_STMT_RE = re.compile(r'"(?:[^"\\]|\\.)*"|//[^\n]*|;', re.S)
# 一般トークン: 文字列リテラル or 空白以外の連続
_TOKEN_RE = re.compile(r'"(?:[^"\\]|\\.)*"|[^\s"]+', re.S)
# 位置指定でトークンを 1 つ読む
_NEXT_TOKEN_RE = re.compile(r'\s*("(?:[^"\\]|\\.)*"|[^\s"]+)', re.S)
_CMD_RE = re.compile(r'\s*([A-Za-z_][\w]*)')
# 属性パスの 1 要素: name, name[3], name[0:7], name[*]
_ATTR_ELEM_RE = re.compile(r'([A-Za-z_]\w*)(?:\[(\*|-?\d+)(?::(-?\d+))?\])?')

_UNESCAPE = {'"': '"', "\\": "\\", "n": "\n", "t": "\t", "r": "\r"}

# setAttr のフラグ
_SETATTR_FLAGS_WITH_ARG = {
    "-s", "-size", "-k", "-keyable", "-l", "-lock", "-cb", "-channelBox",
    "-ch", "-capacityHint", "-type", "-typ", "-ca", "-caching",
}
_SETATTR_FLAGS_NO_ARG = {"-av", "-alteredValue", "-c", "-clamp"}
_NUMERIC_WORDS = {"-inf", "-nan", "-infinity"}

# 長い属性名 → 短縮名（.ma は通常短縮名で書かれるが、手書き等に備える）
ATTR_ALIASES = {
    "translate": "t", "rotate": "r", "scale": "s", "shear": "sh",
    "translateX": "tx", "translateY": "ty", "translateZ": "tz",
    "rotateX": "rx", "rotateY": "ry", "rotateZ": "rz",
    "scaleX": "sx", "scaleY": "sy", "scaleZ": "sz",
    "rotateOrder": "ro", "rotateAxis": "ra", "rotatePivot": "rp", "scalePivot": "sp",
    "rotatePivotTranslate": "rpt", "scalePivotTranslate": "spt",
    "rotateAxisX": "rax", "rotateAxisY": "ray", "rotateAxisZ": "raz",
    "jointOrient": "jo", "jointOrientX": "jox", "jointOrientY": "joy", "jointOrientZ": "joz",
    "segmentScaleCompensate": "ssc", "inverseScale": "is", "radius": "radi",
    "visibility": "v", "lodVisibility": "lodv", "intermediateObject": "io", "template": "tmp",
    "overrideDisplayType": "ovdt",
    "overrideEnabled": "ove", "overrideVisibility": "ovv",
    "inheritsTransform": "it", "worldMatrix": "wm",
    # 注意: "matrix" は transform では m、skinCluster では ma なので別名変換しない
    "vrts": "vt", "edge": "ed", "face": "fc", "pnts": "pt",
    "cached": "cc",                    # nurbsCurve の形（長い名前）
    "inMesh": "i", "outMesh": "o", "worldMesh": "w",
    "weightList": "wl", "weights": "w", "bindPreMatrix": "pm", "geomMatrix": "gm",
    "skinningMethod": "skm", "maxInfluences": "mi", "normalizeWeights": "nw",
    "input": "ip", "inputGeometry": "ig", "outputGeometry": "og", "groupId": "gi",
    "vlist": "vl", "vertex": "vt",
    "uvSet": "uvst", "uvSetName": "uvsn", "uvSetPoints": "uvsp", "currentUVSet": "cuvs",
    "instObjGroups": "iog", "objectGroups": "og", "objectGrpCompList": "gcl",
    "dagSetMembers": "dsm", "surfaceShader": "ss", "fileTextureName": "ftn",
    "outColor": "oc", "outTransparency": "ot", "outAlpha": "oa", "uvCoord": "uv", "outUV": "o",
    "message": "msg", "members": "m", "xformMatrix": "xm",
    "placeHolderList": "phl",          # reference ノードのプレースホルダー（リファレンスの中のノードとの接続）
    # ikHandle（スクリプトで作ったリグは、長い名前で接続していることがある）
    "poleVector": "pv", "poleVectorX": "pvx", "poleVectorY": "pvy", "poleVectorZ": "pvz",
    "twist": "twi", "roll": "rol", "ikBlend": "ikb", "rootOnCurve": "roc",
    "handleStartJoint": "hsj", "handleEndEffector": "hee", "ikSolver": "hsv", "inCurve": "ic",
    "dTwistControlEnable": "dtce", "dWorldUpType": "dwut", "dWorldUpAxis": "dwua", "dForwardAxis": "dfa",
    "dWorldUpMatrix": "dwum", "dWorldUpMatrixEnd": "dwue", "dWorldUpVector": "dwuv", "dWorldUpVectorEnd": "dwve",
    "preferredAngle": "pa", "parentMatrix": "pm", "parentInverseMatrix": "pim", "worldInverseMatrix": "wim",
    # コンストレイント
    "target": "tg", "targetTranslate": "tt", "targetRotate": "tr", "targetScale": "ts", "targetParentMatrix": "tpm",
    "targetWeight": "tw", "targetRotatePivot": "trp", "targetRotateTranslate": "trt", "targetRotateOrder": "tro",
    "targetJointOrient": "tjo", "targetOffsetTranslate": "tot", "targetOffsetRotate": "tor",
    "constraintTranslate": "ct", "constraintTranslateX": "ctx", "constraintTranslateY": "cty", "constraintTranslateZ": "ctz",
    "constraintRotate": "cr", "constraintRotateX": "crx", "constraintRotateY": "cry", "constraintRotateZ": "crz",
    "constraintScale": "cs", "constraintParentInverseMatrix": "cpim", "constraintRotatePivot": "crp",
    "constraintRotateTranslate": "crt", "constraintRotateOrder": "cro", "constraintJointOrient": "cjo", "pivotSpace": "ps",
}


def unquote(tok: str) -> str:
    """"..." を外してエスケープを戻す。"""
    if len(tok) >= 2 and tok[0] == '"' and tok[-1] == '"':
        body = tok[1:-1]
        if "\\" not in body:
            return body
        out = []
        i = 0
        while i < len(body):
            c = body[i]
            if c == "\\" and i + 1 < len(body):
                out.append(_UNESCAPE.get(body[i + 1], body[i + 1]))
                i += 2
            else:
                out.append(c)
                i += 1
        return "".join(out)
    return tok


@dataclass
class Token:
    text: str
    quoted: bool

    @property
    def value(self) -> str:
        return unquote(self.text) if self.quoted else self.text


def tokenize(text: str) -> List[Token]:
    return [Token(t, t.startswith('"')) for t in _TOKEN_RE.findall(text)]


_LINE_COMMENT_RE = re.compile(r"(?m)^[ \t]*//[^\n]*")
_INDENTED_COMMENT_RE = re.compile(r"\n[ \t]+//")      # 改行から始めると、正規表現が候補を素早く絞れる
_STRING_ONLY_RE = re.compile(r'"(?:[^"\\]|\\.)*"', re.S)


# 文の終わり（文字列リテラルの中の ; は読み飛ばす）。展開したループの形にして、長い文字列でも 1 回で進む
_STMT_TAIL_RE = re.compile(r'[^";]*(?:"(?:[^"\\]|\\.)*"[^";]*)*;', re.S)


def statement_end(text: str, pos: int, end: int) -> int:
    """pos から始まる文の終わり（; の位置）。end は pos 以降で最初の ;。
    その手前で文字列が閉じていなければ、正規表現で本当の終わりまで一度に進む
    （; を 1 つずつ足して数え直すと、; の多い長い文字列で 2 乗の時間がかかるため）。"""
    if end < 0:
        return len(text)
    q = text.count('"', pos, end)                # 切り出さずに数える（ほとんどの文はここで終わる）
    if q == 0 or (q % 2 == 0 and text.find("\\", pos, end) < 0):
        return end
    if not _quote_open(text[pos:end]):
        return end
    m = _STMT_TAIL_RE.match(text, pos)
    return m.end() - 1 if m else len(text)


def strip_line_comments(text: str) -> str:
    """行頭の // コメントを除く。Maya のコメントはファイルの先頭と末尾の行頭にしかないので、
    行頭の // を文字列検索で探してその行だけ除く（ファイル全体に正規表現をかけるより速い）。
    字下げされたコメントがあれば、従来の正規表現で除く。"""
    if "//" not in text:
        return text
    pieces = []
    pos = 0
    n = len(text)
    i = 0 if text.startswith("//") else text.find("\n//")
    while i >= 0:
        start = i if i == 0 and text.startswith("//") and pos == 0 else i + 1
        pieces.append(text[pos:start])
        eol = text.find("\n", start)
        pos = n if eol < 0 else eol
        i = text.find("\n//", pos)
    pieces.append(text[pos:])
    out = "".join(pieces)
    if _INDENTED_COMMENT_RE.search(out) or out.lstrip(" \t").startswith("//"):   # 字下げされたコメント（まれ）
        out = _LINE_COMMENT_RE.sub("", out)
    return out


def _quote_open(s: str) -> bool:
    """文字列リテラルが閉じていないか（文字列の中に ; があって途中で分割された）"""
    if '"' not in s:
        return False
    if "\\" not in s:
        return s.count('"') % 2 == 1
    return '"' in _STRING_ONLY_RE.sub("", s)


def iter_statements(text: str) -> Iterator[Tuple[int, str]]:
    """(文のおおよその開始オフセット, 文テキスト) を列挙する。セミコロンは含まない。

    行頭のコメント（//）を一括で除いてから、; で一気に分割する（C の文字列処理なので速い）。
    文字列の中に ; がある場合だけ、引用符が閉じるまで次の断片とつなぎ直す。
    （オフセットは進捗の表示にだけ使う）
    """
    text = strip_line_comments(text)
    n = len(text)
    pos = 0
    while pos < n:
        end = statement_end(text, pos, text.find(";", pos))
        piece = text[pos:end]
        if piece.strip():
            yield pos, piece
        pos = end + 1


def iter_statements_regex(text: str) -> Iterator[Tuple[int, str]]:
    """iter_statements の以前の実装（正規表現で 1 つずつ）。結果の突き合わせ用に残す。"""
    start = 0
    cuts: List[Tuple[int, int]] = []
    for m in _STMT_RE.finditer(text):
        c = text[m.start()]
        if c == ";":
            end = m.start()
            if cuts:
                pieces = []
                p = start
                for a, b in cuts:
                    pieces.append(text[p:a])
                    p = b
                pieces.append(text[p:end])
                stmt = "".join(pieces)
                cuts = []
            else:
                stmt = text[start:end]
            yield start, stmt
            start = m.end()
        elif c == "/":
            cuts.append((m.start(), m.end()))
        # 文字列リテラルは読み飛ばすだけ
    tail = text[start:]
    if cuts:
        # 末尾のコメントを除去
        pieces = []
        p = start
        for a, b in cuts:
            pieces.append(text[p:a])
            p = b
        pieces.append(text[p:])
        tail = "".join(pieces)
    if tail.strip():
        yield start, tail


def split_command(stmt: str) -> Tuple[Optional[str], str]:
    m = _CMD_RE.match(stmt)
    if not m:
        return None, ""
    return m.group(1), stmt[m.end():]


# ---------------------------------------------------------------------------
# 属性パス
# ---------------------------------------------------------------------------

IndexSpec = Union[None, int, Tuple[int, int], str]


@dataclass
class AttrElem:
    name: str
    index: IndexSpec = None

    def key(self) -> str:
        if self.index is None:
            return self.name
        if isinstance(self.index, tuple):
            return "%s[%d:%d]" % (self.name, self.index[0], self.index[1])
        return "%s[%s]" % (self.name, self.index)


_ATTR_PATH_CACHE: Dict[str, Tuple[AttrElem, ...]] = {}
_NORMALIZED_CACHE: Dict[str, str] = {}


def parse_attr_path(path: str) -> List[AttrElem]:
    """".wl[0:7].w" → [AttrElem('wl', (0,7)), AttrElem('w')]。長い名前は短縮名に正規化。
    同じパスは何度も出てくるので、結果をキャッシュする（要素は書き換えないこと）。"""
    hit = _ATTR_PATH_CACHE.get(path)
    if hit is not None:
        return list(hit)
    elems = _parse_attr_path(path)
    if len(_ATTR_PATH_CACHE) < 500000:
        _ATTR_PATH_CACHE[path] = tuple(elems)
    return elems


def _parse_attr_path(path: str) -> List[AttrElem]:
    elems: List[AttrElem] = []
    for part in path.strip(".").split("."):
        if not part:
            continue
        m = _ATTR_ELEM_RE.fullmatch(part)
        if not m:
            elems.append(AttrElem(part))
            continue
        name = ATTR_ALIASES.get(m.group(1), m.group(1))
        idx: IndexSpec = None
        if m.group(2) is not None:
            if m.group(2) == "*":
                idx = "*"
            elif m.group(3) is not None:
                idx = (int(m.group(2)), int(m.group(3)))
            else:
                idx = int(m.group(2))
        elems.append(AttrElem(name, idx))
    return elems


def normalize_attr(path: str) -> str:
    """接続の検索キー用に属性パスを正規化（例 'worldMatrix[0]' → 'wm[0]'）。"""
    hit = _NORMALIZED_CACHE.get(path)
    if hit is None:
        hit = ".".join(e.key() for e in parse_attr_path(path))
        if len(_NORMALIZED_CACHE) < 500000:
            _NORMALIZED_CACHE[path] = hit
    return hit


def split_node_attr(plug: str) -> Tuple[str, str]:
    """'|grp|joint1.wm[0]' → ('|grp|joint1', 'wm[0]')。ノード名に '.' は含まれない。"""
    if "." not in plug:
        return plug, ""
    node, attr = plug.split(".", 1)
    return node, attr


# ---------------------------------------------------------------------------
# setAttr
# ---------------------------------------------------------------------------

@dataclass
class SetAttr:
    plug: str                     # 文に書かれた属性（".t" や "joint1.t"）
    type: Optional[str] = None    # -type の値
    size: Optional[int] = None    # -s の値
    values_text: str = ""         # 値部分の生テキスト

    _values: Optional[List[str]] = field(default=None, repr=False)

    def values(self) -> List[str]:
        """値トークン（文字列は引用符を外す）。"""
        if self._values is None:
            vt = self.values_text
            if '"' in vt:
                self._values = [unquote(t) for t in _TOKEN_RE.findall(vt)]
            else:
                self._values = vt.split()
        return self._values


def parse_setattr(rest: str) -> Optional[SetAttr]:
    """setAttr の引数部分を解析する。属性名が見つからなければ None。"""
    pos = 0
    plug: Optional[str] = None
    typ: Optional[str] = None
    size: Optional[int] = None
    n = len(rest)
    while pos < n:
        m = _NEXT_TOKEN_RE.match(rest, pos)
        if not m:
            break
        tok = m.group(1)
        if tok[0] == '"':
            if plug is None:
                plug = unquote(tok)
                pos = m.end()
                continue
            break  # 文字列値の始まり
        if (len(tok) > 1 and tok[0] == "-" and tok[1].isalpha()
                and tok.lower() not in _NUMERIC_WORDS):
            pos = m.end()
            if tok in _SETATTR_FLAGS_WITH_ARG:
                m2 = _NEXT_TOKEN_RE.match(rest, pos)
                if not m2:
                    break
                arg = m2.group(1)
                pos = m2.end()
                if tok in ("-type", "-typ"):
                    typ = unquote(arg)
                elif tok in ("-s", "-size"):
                    try:
                        size = int(arg)
                    except ValueError:
                        pass
            # 引数なしフラグ・未知フラグは読み飛ばす
            continue
        break  # 数値などの値
    if plug is None:
        return None
    return SetAttr(plug=plug, type=typ, size=size, values_text=rest[pos:])


# ---------------------------------------------------------------------------
# 値の変換
# ---------------------------------------------------------------------------

_BOOL_WORDS = {"yes": 1.0, "true": 1.0, "on": 1.0, "no": 0.0, "false": 0.0, "off": 0.0}


def to_float(tok: str) -> float:
    try:
        return float(tok)
    except ValueError:
        low = tok.lower()
        if low in _BOOL_WORDS:
            return _BOOL_WORDS[low]
        raise


def to_floats(toks: Sequence[str]) -> List[float]:
    try:
        return [float(t) for t in toks]
    except ValueError:
        return [to_float(t) for t in toks]


def to_bool(tok: str) -> bool:
    return to_float(tok) != 0.0


def parse_flags(tokens: Sequence[Token], flags_with_arg: Sequence[str]) -> Tuple[dict, List[Token]]:
    """一般コマンド用: フラグと位置引数を分ける。"""
    opts: dict = {}
    positional: List[Token] = []
    i = 0
    fwa = set(flags_with_arg)
    while i < len(tokens):
        t = tokens[i]
        if not t.quoted and len(t.text) > 1 and t.text[0] == "-" and t.text[1].isalpha():
            if t.text in fwa and i + 1 < len(tokens):
                opts[t.text] = tokens[i + 1].value
                i += 2
                continue
            opts[t.text] = True
            i += 1
            continue
        positional.append(t)
        i += 1
    return opts, positional
