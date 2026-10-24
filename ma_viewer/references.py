# -*- coding: utf-8 -*-
"""リファレンス（file -r）の読み込みに使う部品。

.ma のリファレンスは次の形で保存される:

  file -rdi 1 -ns "rig" -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "C:/proj/scenes/rig.ma";
  file -rdi 2 -ns "sub" -rfn "rig:subRN" -typ "mayaAscii" "C:/proj/scenes/sub.ma";
  file -r -ns "rig" -dr 1 -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "C:/proj/scenes/rig.ma";
  ...
  createNode reference -n "rigRN";
      setAttr ".ed" -type "dataReferenceEdits"
          "rigRN"
          "rigRN" 3
          2 "|rig:root|rig:hand_ctrl" "translate" " -type \\"double3\\" 1 2 3"
          0 "|rig:root" "|world_grp" "-s -r "
          5 4 "rigRN" "|rig:root|rig:hand_ctrl.translateX" "rigRN.placeHolderList[1]" ""
          "rig:subRN" 0;
  ...
  connectAttr "hand_ctrl_translateX.o" "rigRN.phl[1]";

  * file -rdi の行は、入れ子を含むすべてのリファレンスの読み込みの状態（-dr 1 = アンロード）を表す。
    file -r の行（いちばん外側のリファレンスだけ）の -dr 1 は「後で読み込む」という意味で、ふつうは常に付く。
  * リファレンスの編集（親のシーンで変えた値・つなぎ）は、reference ノードの .ed に書かれる。
    数字は編集の種類（0: parent, 1: addAttr, 2: setAttr, 3: connectAttr, 4: disconnectAttr,
    5: プレースホルダーへのつなぎ）。名前は .ed を持つファイルから見た名前空間で書かれる。
  * リファレンスの中のノードとつなぐ接続（アニメーションカーブなど）は、reference ノードの
    プレースホルダー（.phl[n]）とつないで保存され、編集の 5 で本当の相手のプラグが分かる。
"""
from __future__ import annotations

import os
import re
from typing import List, Optional, Tuple

from . import ma_reader as R

# 編集の種類ごとの、続く文字列の数（5 は数字を 1 つはさむ）
EDIT_ARITY = {0: 3, 1: 4, 2: 3, 3: 3, 4: 3, 5: 4}
EDIT_NAMES = {0: "parent", 1: "addAttr", 2: "setAttr", 3: "connectAttr", 4: "disconnectAttr", 5: "プレースホルダー"}

_COPY_SUFFIX_RE = re.compile(r"\{\d+\}$")          # 同じファイルを 2 回読んだときの "rig.ma{1}"


class RefInfo:
    """1 つのリファレンス（読み込めなかったものも含む）"""
    __slots__ = ("path", "resolved", "namespace", "prefix", "rfn", "depth", "loaded", "reason", "parent",
                 "node_count", "units")

    def __init__(self, path: str, namespace: str, prefix: str, rfn: str, depth: int, parent: Optional["RefInfo"]):
        self.path = path                    # ファイルに書かれたパス
        self.resolved: Optional[str] = None  # 見つかったファイル
        self.namespace = namespace          # 名前空間（入れ子なら "rig:sub"）
        self.prefix = prefix                # ノード名の前に付ける文字列（"rig:sub:"）
        self.rfn = rfn                      # reference ノードの名前（親のシーンから見た名前）
        self.depth = depth                  # 1 = いちばん外側
        self.loaded = False
        self.reason = ""                    # 読み込まなかった理由
        self.parent = parent
        self.node_count = 0
        self.units: Optional[Tuple[str, str]] = None   # リファレンスのファイルの (長さ, 角度) の単位

    def to_dict(self) -> dict:
        return {"namespace": self.namespace, "path": self.path, "resolved": self.resolved, "rfn": self.rfn,
                "depth": self.depth, "loaded": self.loaded, "reason": self.reason or None,
                "nodes": self.node_count}


def parse_file_command(rest: str) -> Optional[dict]:
    """file コマンドの引数（リファレンスの行だけ）→ {kind: "r" | "rdi", path, ns, rpr, rfn, deferred, type}"""
    toks = R.tokenize(rest)
    opts, pos = R.parse_flags(toks, ["-rdi", "-referenceDepthInfo", "-ns", "-namespace", "-rfn", "-referenceNode",
                                     "-rpr", "-renamingPrefix", "-op", "-options", "-typ", "-type", "-dr",
                                     "-deferReference", "-shd", "-sharedNodes", "-gl", "-mnc", "-lck", "-pmt"])
    if "-rdi" in opts or "-referenceDepthInfo" in opts:
        kind = "rdi"
    elif "-r" in opts or "-reference" in opts:
        kind = "r"
    else:
        return None
    paths = [t.value for t in pos if t.quoted]
    dr = opts.get("-dr", opts.get("-deferReference"))
    return {"kind": kind,
            "path": paths[-1] if paths else "",
            "ns": _str_opt(opts, "-ns", "-namespace"),
            "rpr": _str_opt(opts, "-rpr", "-renamingPrefix"),
            "rfn": _str_opt(opts, "-rfn", "-referenceNode"),
            "type": _str_opt(opts, "-typ", "-type"),
            "deferred": isinstance(dr, str) and dr.strip().lower() in ("1", "true", "yes", "on")}


def _str_opt(opts: dict, *names) -> Optional[str]:
    for n in names:
        v = opts.get(n)
        if isinstance(v, str):
            return v
    return None


def default_namespace(path: str) -> str:
    """名前空間の指定がないときの名前（Maya と同じくファイル名）"""
    return os.path.splitext(os.path.basename(_COPY_SUFFIX_RE.sub("", path.replace("\\", "/"))))[0]


def resolve_reference_path(raw: str, referencing_path: str, main_path: str) -> Tuple[Optional[str], List[str]]:
    """リファレンスのパスを探す。(見つかったパス, 探したパス)。

      1. 書かれたパスそのもの（環境変数を展開。相対パスならプロジェクトのルート → 読み込む側の .ma のフォルダ
         → シーンのフォルダを基準）
      2. 読み込む側の .ma のフォルダ・シーンのフォルダ・プロジェクトの scenes フォルダで、ファイル名
         （見つからなければ親フォルダ名を 1 つずつ足したもの）
    """
    from .materials import find_project_root
    p = os.path.expandvars(_COPY_SUFFIX_RE.sub("", raw.strip())).replace("\\", "/")
    ref_dir = os.path.dirname(os.path.abspath(referencing_path)) if referencing_path else os.getcwd()
    main_dir = os.path.dirname(os.path.abspath(main_path)) if main_path else ref_dir
    project = find_project_root(main_path) if main_path else None
    cands: List[str] = []
    is_abs = p.startswith("/") or bool(re.match(r"^[A-Za-z]:/", p))
    if is_abs:
        cands.append(p)
    else:
        for base in ([project] if project else []) + [ref_dir, main_dir]:
            cands.append(os.path.join(base, p))
    parts = [x for x in p.split("/") if x and x not in (".", "..") and not x.endswith(":")]
    bases = [ref_dir, main_dir] + ([os.path.join(project, "scenes"), project] if project else [])
    for base in bases:
        for k in range(1, len(parts) + 1):
            cands.append(os.path.join(base, *parts[-k:]))
    tried: List[str] = []
    seen = set()
    for c in cands:
        key = os.path.normcase(os.path.normpath(c))
        if key in seen:
            continue
        seen.add(key)
        tried.append(c)
        if os.path.isfile(c):
            return os.path.normpath(c), tried
    return None, tried


def _join_tokens(toks: List[R.Token]) -> List[R.Token]:
    """"..." + "..." と分けて書かれた長い文字列を 1 つにまとめる"""
    out: List[R.Token] = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if t.quoted:
            text = t.value
            while i + 2 < len(toks) and toks[i + 1].text == "+" and toks[i + 2].quoted:
                text += toks[i + 2].value
                i += 2
            out.append(R.Token('"%s"' % text.replace("\\", "\\\\").replace('"', '\\"'), True))
        else:
            out.append(t)
        i += 1
    return out


def parse_reference_edits(values_text: str) -> Tuple[List[tuple], int]:
    """dataReferenceEdits の値 → ([(編集の種類, [文字列...])], 読めなかった編集の数)。
    5（プレースホルダー）の文字列は [reference ノード, プラグ, プレースホルダー, ...]。"""
    toks = _join_tokens(R.tokenize(values_text))
    edits: List[tuple] = []
    bad = 0
    i = 1 if toks and toks[0].quoted else 0      # 最初の文字列は .ed を持つ reference ノードの名前
    n = len(toks)
    left = 0                                    # いまの区切りの、残りの編集の数
    while i < n:
        t = toks[i]
        if t.quoted:                            # 区切り: "reference ノード" 編集の数
            try:
                left = int(toks[i + 1].text) if i + 1 < n else 0
            except ValueError:
                left = 0
            i += 2
            continue
        left -= 1
        try:
            code = int(t.text)
        except ValueError:
            bad += 1
            i += 1
            continue
        i += 1
        if code == 5 and i < n and not toks[i].quoted:
            i += 1                              # つなぎの向き（3・4）
        arity = EDIT_ARITY.get(code)
        if arity is None:
            # 知らない種類: 次の数字（次の編集）までの文字列を読み飛ばす。区切りの最後の編集なら、
            # 次の区切り（"reference ノード" 数）の手前で止める
            bad += 1
            while i < n and toks[i].quoted:
                if left <= 0 and i + 1 < n and not toks[i + 1].quoted and toks[i + 1].text.isdigit():
                    break
                i += 1
            continue
        args = [x.value for x in toks[i:i + arity] if x.quoted]
        if len(args) != arity:
            bad += 1
            break
        i += arity
        edits.append((code, args))
    return edits, bad


_ED_SETATTR_RE = re.compile(r'setAttr\s+"\.(?:ed|edits)"\s+-type\s+"dataReferenceEdits"', re.S)


def reference_edits_text(text: str, span: Tuple[int, int]) -> Optional[str]:
    """reference ノードのブロックから、.ed（dataReferenceEdits）の値の部分を取り出す"""
    a, b = span
    m = _ED_SETATTR_RE.search(text, a, b)
    if not m:
        return None
    end = R.statement_end(text, m.end(), text.find(";", m.end()))
    return text[m.end():min(end, len(text))]
