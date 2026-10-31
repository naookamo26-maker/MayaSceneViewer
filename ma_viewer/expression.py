# -*- coding: utf-8 -*-
"""expression ノードの式（.ixp）の読み取りと、ビューアで解釈できるかの判定。

式の評価はビューア（web_src/src/expression.js）が行う。ここでは字句だけを見て、解釈できない書き方
（MEL コマンド・文字列・ベクトル・入出力以外の属性の参照など）を含む式を見分ける。
解釈できない式は「未対応」として扱い、つながるノードはバインドポーズの形で推定する。

.ma では、式の中の属性の参照は入力 .I[n]・出力 .O[n] に置き換えて保存される:
  setAttr ".ixp" -type "string" ".O[0] = sin(.I[0] * 0.1) * 5;\\n.O[1] = frame;";
"""
from __future__ import annotations

import re
from typing import Optional, Tuple

from . import ma_reader as R

# ビューアの解釈器（expression.js の FUNCTIONS）と同じ一覧
FUNCTIONS = {
    "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "sind", "cosd", "tand", "asind", "acosd", "atand", "atan2d",
    "abs", "sqrt", "pow", "exp", "log", "log10", "floor", "ceil", "trunc", "sign", "min", "max", "clamp",
    "smoothstep", "linstep", "deg_to_rad", "rad_to_deg", "fmod", "hypot", "equivalent", "equivalentTol",
}
KEYWORDS = {"float", "int", "if", "else", "for", "while", "frame", "time", "true", "false", "on", "off", "yes", "no"}

_IXP_RE = re.compile(r'setAttr\s+(?:-k\s+\w+\s+)?"\.(?:ixp|internalExpression)"\s+-type\s+"string"\s*\(?\s*'
                     r'("(?:[^"\\]|\\.)*"(?:\s*\+\s*"(?:[^"\\]|\\.)*")*)', re.S)
_STR_RE = re.compile(r'"(?:[^"\\]|\\.)*"', re.S)
_TOKEN_RE = re.compile(r"""
    (?P<ws>\s+|//[^\n]*|/\*.*?\*/)
  | (?P<num>(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)
  | (?P<io>\.[IO]\[\d+\])
  | (?P<attr>\.[A-Za-z_]\w*)
  | (?P<var>\$\w+)
  | (?P<name>[A-Za-z_]\w*)
  | (?P<str>")
  | (?P<tick>`)
  | (?P<vec><<|>>)
  | (?P<op>\+\+|--|[-+*/%]=|==|!=|<=|>=|&&|\|\||[-+*/%=<>!?:;,(){}\[\]^])
""", re.S | re.X)


def expression_text(ms, n) -> Optional[str]:
    """expression ノードの式（.ixp）。属性の範囲（span）から読む"""
    if n.span is None or not ms.text:
        return None
    a, b = n.span
    m = _IXP_RE.search(ms.text, a, b)
    if not m:
        return None
    return R.string_value_at(ms, m.start(1), b) or "".join(R.unquote(t) for t in _STR_RE.findall(m.group(1)))


def check_expression(text: str) -> Optional[str]:
    """解釈できない書き方があれば、その理由（なければ None）"""
    pos = 0
    tokens = []
    while pos < len(text):
        m = _TOKEN_RE.match(text, pos)
        if not m:
            return "読めない文字「%s」" % text[pos]
        pos = m.end()
        kind = m.lastgroup
        if kind == "ws":
            continue
        tokens.append((kind, m.group(kind)))
    for k, (kind, value) in enumerate(tokens):
        nxt = tokens[k + 1] if k + 1 < len(tokens) else (None, None)
        if kind == "str":
            return "文字列を使っています"
        if kind == "tick":
            return "MEL コマンドの呼び出し（`…`）を使っています"
        if kind == "vec":
            return "ベクトル（<<…>>）を使っています"
        if kind == "attr":
            return "入力・出力（.I・.O）以外の属性 %s を参照しています" % value
        if kind == "name":
            if value in KEYWORDS:
                continue
            if nxt[1] == "(":
                if value not in FUNCTIONS:
                    return "未対応の関数・コマンド %s を使っています" % value
            elif nxt[0] == "attr":
                return "オブジェクトの属性 %s%s を参照しています" % (value, nxt[1])
            else:
                return "未対応の名前 %s を使っています" % value
    return None


def read_expression(ms, n) -> Tuple[Optional[str], Optional[str]]:
    """(式, 解釈できない理由)"""
    text = expression_text(ms, n)
    if text is None:
        return None, "式（.ixp）が見つかりません"
    return text, check_expression(text)
