# -*- coding: utf-8 -*-
"""exprespy（Python で式を書くノードのプラグイン。https://github.com/ryusas/maya_exprespy）の評価。

exprespy ノードはコード（.cd・code。Python）を持ち、コードの中の属性の参照は入力 IN[n]・出力 OUT[n] に置き換えて
保存される。実際の属性は .i[n]（input）・.o[n]（output）に接続される:
  setAttr ".cd" -type "string" "pos = api.MPoint(IN[0] + IN[1])\\npos *= IN[2]\\nOUT[0] = pos";
  connectAttr "src.t" "posCnsEx.i[0]";  connectAttr "src.pm" "posCnsEx.i[2]";  connectAttr "posCnsEx.o[0]" "dst.t";

コードは実行しない。プラグインの変換（plugin_convert）と同じく構文を解析して、ノードごとの自作ノードの定義
（node_defs.NodeDef）に書き換える。入力・出力は番号ごとに別の属性（i0・i1 …、o0 …）にする（exprespy の入出力は
番号ごとに型が違う。i[0] はベクトル、i[2] は行列など）。入力の型は接続元の属性（なければ .ma の値）から、出力の
型は代入した値から決める。exprespy は単位を変換しない（角度はラジアン、時間は秒）ので、ビューアの接続の値
（回転はラジアン）をそのまま渡す。

対応する書き方は Maya の Python API（maya.api.OpenMaya の MVector・MPoint・MMatrix・MEulerRotation・
MQuaternion・MTransformationMatrix）と math（plugin_convert.Translator が解釈するもの）。
if not COUNT:（最初の 1 回だけの初期化）は、中身が定数・import・関数の定義だけなら毎回実行するものとして扱い、
関数（def・lambda）は呼び出したところに展開する。IN[n]・IN.get(n, 既定値) の番号は、数か一度だけ整数を入れた名前。
対応しないもの（理由を警告に出し、そのノードは評価しない）: 前回の値を持ち越す変数（初期化で入れた値の書き換え・
global）・maya.cmds・形状（メッシュ・カーブ）の入出力・文字列・IN[変数]・再帰呼び出し・ループの中の return。
"""
from __future__ import annotations

import ast
import hashlib
import json
import re
from typing import Dict, List, Optional, Tuple

from . import ma_reader as R
from . import node_defs as ND
from . import plugin_convert as PC

TYPE = "exprespy"

_CODE_RE = re.compile(r'setAttr\s+(?:-k\s+\w+\s+)?"\.(?:cd|code)"\s+-type\s+"string"\s*\(?\s*'
                      r'("(?:[^"\\]|\\.)*"(?:\s*\+\s*"(?:[^"\\]|\\.)*")*)', re.S)
_STR_RE = re.compile(r'"(?:[^"\\]|\\.)*"', re.S)
_IO_RE = re.compile(r"^(i|input|ip|o|output)\[(\d+)\]$")

# 入出力の種類（kind）→ 定義の属性の型
_ATTR_TYPES = {"num": "double", "time": "double", "vec3": "double3", "vec2": "double2", "vec4": "double4",
               "mat": "matrix"}
# 変換の値の種類（plugin_convert.Value.kind）→ 出力の種類
_OUT_KINDS = {"num": "num", "unit": "num", "vec": "vec3", "pt": "vec3", "eul": "vec3", "quat": "vec4", "mat": "mat"}

# 標準ノードの属性の型（.ma の読み込みでそろえた短い名前。ここにない数の属性は num）
_DAG_VEC3 = {"t", "r", "s", "rp", "sp", "rpt", "spt", "ra", "jo", "sh", "is", "pa", "lp", "los", "wp"}
_DAG_MAT = {"pm", "pim", "wm", "wim", "m", "im", "xm", "opm", "bps", "worldMatrix", "parentMatrix",
            "worldInverseMatrix", "parentInverseMatrix", "matrix", "inverseMatrix", "offsetParentMatrix"}
_DG_OUTPUTS = {
    "multiplyDivide": {"o": "vec3"}, "plusMinusAverage": {"o3": "vec3", "o2": "vec2"}, "reverse": {"o": "vec3"},
    "condition": {"oc": "vec3"}, "blendColors": {"op": "vec3"}, "clamp": {"op": "vec3"}, "setRange": {"o": "vec3"},
    "vectorProduct": {"o": "vec3"}, "pairBlend": {"ot": "vec3", "or": "vec3"},
    "pointOnCurveInfo": {"p": "vec3", "n": "vec3", "t": "vec3", "nn": "vec3", "nt": "vec3"},
    "pointConstraint": {"ct": "vec3"}, "orientConstraint": {"cr": "vec3"}, "aimConstraint": {"cr": "vec3"},
    "parentConstraint": {"ct": "vec3", "cr": "vec3"}, "scaleConstraint": {"cs": "vec3"},
    "poleVectorConstraint": {"ct": "vec3"}, "nearestPointOnCurve": {"p": "vec3"},
    "decomposeMatrix": {"ot": "vec3", "or": "vec3", "os": "vec3", "osh": "vec3", "oq": "vec4"},
    "composeMatrix": {"omat": "mat"}, "multMatrix": {"o": "mat"}, "inverseMatrix": {"omat": "mat"},
    "fourByFourMatrix": {"o": "mat"}, "wtAddMatrix": {"o": "mat"}, "addMatrix": {"o": "mat"},
    "holdMatrix": {"o": "mat"}, "blendMatrix": {"omat": "mat"}, "aimMatrix": {"omat": "mat"},
    "pickMatrix": {"omat": "mat"}, "parentMatrix": {"omat": "mat"}, "quatToEuler": {"ort": "vec3"},
    "eulerToQuat": {"oq": "vec4"}, "quatProd": {"oq": "vec4"}, "quatInvert": {"oq": "vec4"},
    "quatNormalize": {"oq": "vec4"}, "quatSlerp": {"oq": "vec4"}, "pointMatrixMult": {"o": "vec3"},
}
# 形状（メッシュ・カーブ・サーフェス）の属性。exprespy では MObject になり、ビューアでは扱えない
_GEOMETRY_TYPES = {"mesh", "nurbsCurve", "nurbsSurface", "lattice", "subdiv", "bezierCurve"}
_GEOMETRY_ATTRS = {"o", "outMesh", "w", "worldMesh", "ws", "worldSpace", "l", "local", "cc", "create", "i", "inMesh",
                   "og", "outputGeometry", "lo", "latticeOutput"}
_ADDATTR_TYPES = {"double3": "vec3", "float3": "vec3", "long3": "vec3", "short3": "vec3", "double2": "vec2",
                  "float2": "vec2", "long2": "vec2", "short2": "vec2", "double4": "vec4", "matrix": "mat",
                  "fltMatrix": "mat"}
# exprespy があらかじめ import しているモジュール（コードの中で名前だけで使える）
_PRE_IMPORTED = {"api": "maya.api.OpenMaya", "api1": "maya.OpenMaya", "math": "math", "sys": "sys",
                 "cmds": "maya.cmds", "mel": "maya.mel"}
_OK_MODULES = ("math", "maya.api.OpenMaya", "maya.OpenMaya", "maya.api")


class ExprespyError(Exception):
    def __init__(self, msg: str, line: int = 0):
        super().__init__(msg)
        self.line = line

    def text(self) -> str:
        return ("%d 行目: %s" % (self.line, self)) if self.line else str(self)


def code_text(ms, n) -> Optional[str]:
    """exprespy ノードのコード（.cd）。属性の範囲（span）から読む"""
    if n.span is None or not ms.text:
        return None
    a, b = n.span
    m = _CODE_RE.search(ms.text, a, b)
    if not m:
        return None
    return "".join(R.unquote(t) for t in _STR_RE.findall(m.group(1)))


def io_plug(attr: str) -> Optional[Tuple[str, int]]:
    """i[3]・input[3] → ("i", 3)、o[0]・output[0] → ("o", 0)"""
    m = _IO_RE.match(attr)
    if not m:
        return None
    return ("o" if m.group(1) in ("o", "output") else "i"), int(m.group(2))


class ExprespyDef(ND.NodeDef):
    """exprespy ノード（1 つ）の定義。.ma の i[3]・o[0] を、定義の属性 i3・o0 に読み替える"""

    def normalize_plug(self, attr: str) -> str:
        io = io_plug(attr)
        if io is not None:
            return "%s%d" % io
        return super().normalize_plug(attr)


# ---------------------------------------------------------------------------
# 入力の型（接続元の属性・.ma の値から）
# ---------------------------------------------------------------------------

def _addattr_kinds(ms, n) -> Dict[str, str]:
    """独自の属性（addAttr -at double3 など）の名前 → 種類"""
    out: Dict[str, str] = {}
    if n.span is None or not ms.text:
        return out
    spans = [s for s in (n.span, n.espan) if s is not None]
    for a, b in spans:
        for m in re.finditer(r"addAttr\b([^;]*);", ms.text[a:b]):
            toks = R.tokenize(m.group(1))
            typ = None
            names = []
            vals = [t.value for t in toks]
            for k, v in enumerate(vals[:-1]):
                if v in ("-at", "-attributeType", "-dt", "-dataType"):
                    typ = vals[k + 1]
                elif v in ("-ln", "-longName", "-sn", "-shortName"):
                    names.append(vals[k + 1])
            kind = _ADDATTR_TYPES.get(typ or "")
            if kind:
                for name in names:
                    out[name] = kind
                    out[R.normalize_attr(name)] = kind
    return out


class _Kinds:
    """接続元の属性の種類を求める（exprespy から exprespy への接続は、元のノードを先に変換して出力の種類を使う）"""

    def __init__(self, ms, convert):
        self.ms = ms
        self.convert = convert                   # exprespy ノード → 変換の結果（ExprespyResult。失敗なら None）
        self.custom: Dict[int, Dict[str, str]] = {}

    def of(self, src, attr: str) -> Optional[str]:
        last = attr.split(".")[-1]
        base = last.split("[")[0]
        io = io_plug(attr) if src.type == TYPE else None
        if io is not None:                         # exprespy の出力（自分の独自の属性は下の addAttr で見る）
            if io[0] != "o":
                return None
            res = self.convert(src)
            if res is None:
                raise ExprespyError("接続元の exprespy %s のコードを解析できません" % src.name)
            return res.out_kinds.get(io[1])
        if src.node_def is not None:
            a = src.node_def.by_name.get(base)
            if a is None:
                return None
            comp = base in a.components or base in getattr(a, "component_names", [])
            if comp or a.type in ND.NUMBER_TYPES:
                return "num"
            if a.type == "matrix":
                return "mat"
            return {3: "vec3", 2: "vec2", 4: "vec4"}.get(ND.VECTOR_TYPES.get(a.type, 0))
        if (src.type in _GEOMETRY_TYPES and base in _GEOMETRY_ATTRS) or base in ("og", "outputGeometry"):
            raise ExprespyError("形状（%s.%s）の入力は変換できません（メッシュ・カーブのデータは扱えません）"
                                % (src.name, attr))
        if id(src) not in self.custom:
            self.custom[id(src)] = _addattr_kinds(self.ms, src)
        if base in self.custom[id(src)]:
            return self.custom[id(src)][base]
        if src.is_dag:
            if base in _DAG_MAT:
                return "mat"
            if base in _DAG_VEC3:
                return "vec3"
            return "num"
        table = _DG_OUTPUTS.get(src.type)
        if table is not None and base in table:
            return table[base]
        return "num"


def _value_kind(v) -> Optional[str]:
    """.ma の値（parse_attrs の結果）の種類"""
    if isinstance(v, bool):
        return "num"
    if isinstance(v, (int, float)):
        return "num"
    if isinstance(v, list) and all(isinstance(x, (int, float)) for x in v):
        return {2: "vec2", 3: "vec3", 4: "vec4", 16: "mat"}.get(len(v))
    return None


# ---------------------------------------------------------------------------
# コードの変換
# ---------------------------------------------------------------------------

class _NoAttrs:
    """plugin_convert.Translator に渡す属性の一覧（exprespy は IN・OUT だけなので空）"""
    attrs: Dict[str, object] = {}
    order: List[object] = []
    local: set = set()

    @staticmethod
    def outputs():
        return []


def _module_names(tree) -> set:
    names = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Name):
            names.add(node.id)
    return names


def _scope_stores(stmts) -> Dict[str, int]:
    """文の並びの中で値を入れる名前と回数（関数の中は数えない。関数の定義・lambda の代入も 1 回）"""
    out: Dict[str, int] = {}

    def visit(node):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            out[node.name] = out.get(node.name, 0) + 1
            return
        if isinstance(node, ast.Lambda):
            return
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            out[node.id] = out.get(node.id, 0) + 1
        for c in ast.iter_child_nodes(node):
            visit(c)
    for s in stmts:
        visit(s)
    return out


def _is_first_run(test) -> bool:
    """if not COUNT:・if COUNT == 0:・if COUNT < 1:（最初の 1 回だけの初期化）"""
    if isinstance(test, ast.UnaryOp) and isinstance(test.op, ast.Not):
        return isinstance(test.operand, ast.Name) and test.operand.id == "COUNT"
    if isinstance(test, ast.Compare) and len(test.ops) == 1:
        left, right, op = test.left, test.comparators[0], test.ops[0]
        if isinstance(right, ast.Name) and right.id == "COUNT" and isinstance(op, ast.Eq):
            left, right = right, left
        if isinstance(left, ast.Name) and left.id == "COUNT":
            c = PC._const(right)
            return (isinstance(op, ast.Eq) and c == 0 or isinstance(op, ast.Lt) and c == 1
                    or isinstance(op, ast.LtE) and c == 0)
    return False


def _has_return(node) -> bool:
    if isinstance(node, ast.Return):
        return True
    if isinstance(node, (ast.FunctionDef, ast.Lambda)):
        return False
    return any(_has_return(c) for c in ast.iter_child_nodes(node))


class ExprespyTranslator(PC.Translator):
    """exprespy のコードを、定義の計算の文に書き換える。IN[n] は入力の属性 i<n>、OUT[n] = … は出力の属性 o<n>。
    if not COUNT:（最初の 1 回だけの初期化）は、中身が定数・import・関数の定義だけなら毎回実行するものとして扱う。
    関数（def・lambda）は呼び出したところに展開する"""

    def __init__(self, tree: ast.Module, in_kinds: Dict[int, str], api: int):
        fn = ast.FunctionDef(name="compute", args=ast.arguments(
            posonlyargs=[], args=[ast.arg(arg=a) for a in ("__ep_self", "__ep_plug", "__ep_data")],
            kwonlyargs=[], kw_defaults=[], defaults=[]), body=tree.body, decorator_list=[], lineno=1)
        module = PC.ModuleInfo(ast.Module(body=[], type_ignores=[]))
        module.api = api
        super().__init__(_NoAttrs(), module, None, fn)
        self.in_kinds = in_kinds
        self.out_kinds: Dict[int, str] = {}
        self.taken |= {"i%d" % k for k in in_kinds} | {"o%d" % k for k in range(1000)}
        self.funcs: Dict[str, Tuple[List[str], object, bool]] = {}   # 名前 → (引数, 本体, lambda か)
        self.inlining: List[str] = []
        # 一度だけ整数を入れる名前（IN[AT_ROLL] の番号に使える）
        stores = _scope_stores(tree.body)
        self.int_consts: Dict[str, int] = {}
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
                c = PC._const(node.value)
                name = node.targets[0].id
                if isinstance(c, int) and not isinstance(c, bool) and stores.get(name) == 1:
                    self.int_consts[name] = c
        # 初期化（if not COUNT:）で値を入れて、ほかで書き換える名前（前回の値を持ち越す）
        init, rest = [], []
        for s in tree.body:
            (init if isinstance(s, ast.If) and _is_first_run(s.test) else rest).append(s)
        init_names = _scope_stores([x for s in init for x in s.body])
        self.carried = sorted(set(init_names) & set(_scope_stores(rest)))

    # ---- IN・OUT
    def index_of(self, node, what: str) -> int:
        k = PC._const(node)
        if isinstance(node, ast.Name) and node.id in self.int_consts:
            k = self.int_consts[node.id]
        if not isinstance(k, int) or isinstance(k, bool):
            PC._fail("%s の番号を変数で選ぶ書き方は変換できません。番号か、一度だけ整数を入れた名前を書いてください" % what,
                     node)
        return k

    def io_index(self, node, name: str) -> Optional[int]:
        if isinstance(node, ast.Subscript) and isinstance(node.value, ast.Name) and node.value.id == name:
            return self.index_of(node.slice, "%s[…]" % name)
        return None

    def expr(self, e):
        k = self.io_index(e, "IN")
        if k is not None:
            return self.input_value(k, e)
        if self.io_index(e, "OUT") is not None:
            PC._fail("OUT[n]（出力）を読んでいます。代入した値は変数に入れて使ってください", e)
        if isinstance(e, ast.Compare) and len(e.ops) == 1 and isinstance(e.ops[0], (ast.In, ast.NotIn)) \
                and isinstance(e.comparators[0], ast.Name) and e.comparators[0].id == "IN":
            has = self.index_of(e.left, "IN の番号") in self.in_kinds
            return PC.Value("num", "1" if has == isinstance(e.ops[0], ast.In) else "0")
        if isinstance(e, ast.Lambda):
            PC._fail("lambda は、名前に入れて呼び出す形（f = lambda x: …）だけ変換できます", e)
        return super().expr(e)

    def input_value(self, k: int, node):
        kind = self.in_kinds.get(k)
        if kind is None:
            PC._fail("IN[%d] に接続も値もありません（Maya でも KeyError になります）" % k, node)
        if kind == "time":
            return PC.Value("num", "time")                # time1 からの接続（exprespy では秒）
        code = "i%d" % k
        if kind == "mat":
            return PC.Value("mat", code)
        if kind == "num":
            return PC.Value("num", code)
        return PC.Value("vec", code)                      # double3 は MVector、ほかの数の compound はリスト

    def name(self, e):
        if e.id not in self.env:
            if e.id in ("IN", "OUT"):
                PC._fail("%s をそのまま使っています（%s[0] のように番号で読み書きしてください）" % (e.id, e.id), e)
            if e.id == "COUNT":
                PC._fail("COUNT（実行の回数）は、if not COUNT:（最初の 1 回だけの初期化）の形でだけ変換できます", e)
            if e.id in ("cmds", "mel"):
                PC._fail("maya.%s の呼び出しは変換できません（ほかのノードを直接見る処理は再現できません）" % e.id, e)
            if e.id in self.funcs:
                PC._fail("関数 %s を値として使っています（呼び出す形だけ変換できます）" % e.id, e)
            if e.id in _PRE_IMPORTED:
                PC._fail("%s をそのまま値として使っています" % e.id, e)
            if e.id not in ("True", "False"):
                PC._fail("名前 %s が分かりません（値を入れていない変数・コードの外の名前）" % e.id, e)
        return super().name(e)

    # ---- 文
    def stmt(self, s):
        if isinstance(s, (ast.Import, ast.ImportFrom)):
            mods = [a.name for a in s.names] if isinstance(s, ast.Import) else [s.module or ""]
            bad = [m for m in mods if not any(m == ok or m.startswith(ok + ".") for ok in _OK_MODULES)]
            if bad:
                PC._fail("import %s は変換できません（math と maya.api.OpenMaya だけ）" % bad[0], s)
            return                                         # 別名は読む前に元の名前に戻してある
        if isinstance(s, ast.AugAssign) and self.io_index(s.target, "OUT") is not None:
            PC._fail("OUT[n] への += などは変換できません（OUT は実行のたびに空になります）", s)
        if isinstance(s, ast.FunctionDef):
            self.define(s.name, s.args, s.body, False, s)
            return
        if isinstance(s, ast.Global):
            PC._fail("global（前回の値を持ち越す変数）は変換できません", s)
        if isinstance(s, ast.If) and _is_first_run(s.test):
            self.first_run(s)
            return
        return super().stmt(s)

    def first_run(self, s: ast.If):
        """if not COUNT: …（最初の 1 回だけ実行する初期化）。毎回同じ値になるなら、毎回実行しても結果は同じ"""
        if s.orelse:
            PC._fail("if not COUNT: … else: …（2 回目以降だけの処理）は変換できません", s.orelse[0])
        for node in ast.walk(ast.Module(body=s.body, type_ignores=[])):
            if isinstance(node, ast.Name) and node.id in ("IN", "OUT"):
                PC._fail("初期化（if not COUNT:）の中で %s を使っています（最初の 1 回の値を持ち越すため、再現できません）"
                         % node.id, node)
        if self.carried:
            PC._fail("初期化（if not COUNT:）で値を入れた %s を、あとで書き換えています（前回の値を持ち越すため、"
                     "再現できません）" % "・".join(self.carried), s)
        self.block(s.body)

    def assign(self, target, value_node, s):
        if isinstance(value_node, ast.Lambda) and isinstance(target, ast.Name):
            self.define(target.id, value_node.args, value_node.body, True, s)
            return
        k = self.io_index(target, "OUT")
        if k is None:
            if isinstance(target, ast.Subscript) and isinstance(target.value, ast.Name) and target.value.id == "IN":
                PC._fail("IN[n]（入力）に代入しています", s)
            return super().assign(target, value_node, s)
        v = self.expr(value_node)
        if v.kind == "tm":
            v = self.tm_matrix(v)
        kind = _OUT_KINDS.get(v.kind)
        if kind is None:
            PC._fail("OUT[%d] に出せない値（%s）を代入しています" % (k, v.kind), s)
        if v.kind == "vec" and v.code.startswith("[") and v.code.count(",") in (1, 3):
            kind = "vec2" if v.code.count(",") == 1 else "vec4"     # 2 つ・4 つの数のリスト
        prev = self.out_kinds.get(k)
        if prev is not None and prev != kind:
            PC._fail("OUT[%d] に種類の違う値（%s と %s）を代入しています" % (k, prev, kind), s)
        self.out_kinds[k] = kind
        self.emit("o%d = %s" % (k, v.code))

    # ---- 関数（呼び出したところに展開する）
    def define(self, name: str, args: ast.arguments, body, is_lambda: bool, node):
        if args.vararg or args.kwarg or args.kwonlyargs or args.defaults or args.posonlyargs:
            PC._fail("関数 %s の引数の書き方（既定値・*args・**kwargs）は変換できません" % name, node)
        if not is_lambda:
            for x in ast.walk(ast.Module(body=body, type_ignores=[])):
                if isinstance(x, (ast.Global, ast.Nonlocal)):
                    PC._fail("関数 %s の中の global・nonlocal は変換できません" % name, x)
        self.funcs[name] = ([a.arg for a in args.args], body, is_lambda)
        self.env.pop(name, None)

    def call(self, e):
        f = e.func
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == "IN" and f.attr == "get":
            if not e.args or len(e.args) > 2 or e.keywords:
                PC._fail("IN.get(番号[, 既定値]) の形で書いてください", e)
            k = self.index_of(e.args[0], "IN.get")
            if k in self.in_kinds:
                return self.input_value(k, e)
            if len(e.args) < 2:
                PC._fail("IN.get(%d) の既定値がなく、IN[%d] に接続も値もありません" % (k, k), e)
            return self.expr(e.args[1])
        if isinstance(f, ast.Name) and f.id in self.funcs and f.id not in self.env:
            return self.inline(f.id, e)
        return super().call(e)

    def call_stmt(self, c):
        if isinstance(c.func, ast.Name) and c.func.id in self.funcs and c.func.id not in self.env:
            self.inline(c.func.id, c)
            return
        return super().call_stmt(c)

    def inline(self, name: str, e: ast.Call):
        params, body, is_lambda = self.funcs[name]
        if name in self.inlining:
            PC._fail("関数 %s の再帰呼び出しは変換できません" % name, e)
        if e.keywords or len(e.args) != len(params):
            PC._fail("関数 %s の引数の数が違います（%d 個）" % (name, len(params)), e)
        args = [self.expr(a) for a in e.args]
        saved_env, saved_names = self.env, self.names
        local_names = set(params) | (set() if is_lambda else set(_scope_stores(body)))
        self.env = {k: v for k, v in saved_env.items() if k not in local_names}
        self.names = dict(saved_names)
        for n in sorted(local_names):
            self.names[n] = self.fresh(n.strip("_") or "v")
        self.inlining.append(name)
        try:
            for p, v in zip(params, args):
                var = self.names[p]
                if v.kind == "tm":
                    v = self.tm_matrix(v)
                if v.kind not in ("num", "unit", "vec", "pt", "mat", "quat", "eul"):
                    PC._fail("関数 %s に渡せない値（%s）を渡しています" % (name, v.kind), e)
                self.emit("%s = %s" % (var, v.code))
                self.env[p] = PC.Value("num" if v.kind == "unit" else v.kind, var, **v.extra)
            if is_lambda:
                return self.expr(body)
            return self.function_body(name, body)
        finally:
            self.inlining.pop()
            self.env, self.names = saved_env, saved_names

    def function_body(self, name: str, stmts):
        """関数の本体を変換し、戻り値を入れた変数を返す。return は最後（if の分かれ道の最後も可）だけ"""
        ret = {}
        if any(_has_return(s) for s in stmts) and not self.ends_with_return(stmts):
            PC._fail("関数 %s は、すべての道で return してください" % name, stmts[-1])

        def run(block):
            for k, s in enumerate(block):
                if isinstance(s, ast.Return):
                    self.set_return(s, ret)
                    return
                if isinstance(s, ast.If) and _has_return(s):
                    rest = list(block[k + 1:])
                    body = s.body if self.ends_with_return(s.body) else s.body + rest
                    orelse = s.orelse if self.ends_with_return(s.orelse) else s.orelse + rest
                    self.emit("if %s:" % self.cond(s.test))
                    for part, last in ((body, False), (orelse, True)):
                        if last:
                            if not part:
                                break
                            self.emit("else:")
                        self.indent += 1
                        n = len(self.lines)
                        run(part)
                        if len(self.lines) == n:
                            self.emit("pass")
                        self.indent -= 1
                    return
                if _has_return(s):
                    PC._fail("ループの中の return は変換できません", s)
                self.stmt(s)
        run(list(stmts))
        if "var" not in ret:
            return PC.Value("none")
        return PC.Value(ret["kind"], ret["var"], **ret["extra"])

    def set_return(self, s: ast.Return, ret: dict):
        if s.value is None:
            PC._fail("値のない return は変換できません", s)
        v = self.expr(s.value)
        if v.kind == "tm":
            v = self.tm_matrix(v)
        if v.kind == "unit":
            v = PC.Value("num", v.code)
        if "var" not in ret:
            ret.update(var=self.fresh("ret"), kind=v.kind, extra=dict(v.extra))
        elif ret["kind"] != v.kind and {ret["kind"], v.kind} != {"vec", "pt"}:
            PC._fail("return の値の種類が違います（%s と %s）" % (ret["kind"], v.kind), s)
        self.emit("%s = %s" % (ret["var"], v.code))


class ExprespyResult:
    def __init__(self, nd: ExprespyDef, out_kinds: Dict[int, str], notes: List[str]):
        self.node_def = nd
        self.out_kinds = out_kinds
        self.notes = notes


def translate(code: str, in_kinds: Dict[int, str], out_connected=(), type_name: str = "exprespy",
              source: str = "exprespy"):
    """コードを定義に変換する。戻り値: (ExprespyDef, 出力の種類, 注意)。変換できなければ ExprespyError"""
    try:
        tree = ast.parse(code.replace("\r\n", "\n"), mode="exec")
    except SyntaxError as exc:
        raise ExprespyError("書き方の誤り（%s）" % exc.msg, exc.lineno or 0)
    names = _module_names(tree)
    if "api1" in names and "api" in names:
        raise ExprespyError("Python API 1.0（api1）と 2.0（api）を混ぜたコードは変換できません")
    api = 1 if "api1" in names else 2
    tree = PC.AliasResolver(tree).resolve(tree)
    tr = ExprespyTranslator(tree, in_kinds, api)
    try:
        lines = tr.translate()
    except PC.ConvertError as exc:
        raise ExprespyError(str(exc), exc.line)
    if tr.problems:
        line, msg = sorted(tr.problems, key=lambda p: p[0] or 0)[0]
        raise ExprespyError(msg, line)
    attrs = []
    for k in sorted(in_kinds):
        if in_kinds[k] != "time":
            attrs.append({"name": "i%d" % k, "type": _ATTR_TYPES[in_kinds[k]]})
    out_kinds = dict(tr.out_kinds)
    for k in out_connected:
        out_kinds.setdefault(k, "num")                    # 接続されているが代入しない出力（値は変わらない）
    if not out_kinds:
        raise ExprespyError("OUT[n] への代入がありません")
    for k in sorted(out_kinds):
        attrs.append({"name": "o%d" % k, "type": _ATTR_TYPES[out_kinds[k]], "output": True})
    spec = {"description": "exprespy のコードを変換した定義", "attributes": attrs,
            "compute": lines or ["pass"]}
    try:
        nd = ExprespyDef(type_name, spec, source, TYPE, None)
    except ND.DefError as exc:
        raise ExprespyError("変換した計算を検証できません（%s）" % exc.text())
    return nd, out_kinds, list(tr.notes)


# ---------------------------------------------------------------------------
# シーンへの適用
# ---------------------------------------------------------------------------

def apply_exprespy(ms) -> Tuple[Dict[str, ExprespyDef], List[str], Dict[str, str]]:
    """シーンの exprespy ノードを変換し、定義で評価するノードにする。

    戻り値: (定義の名前 → 定義, 評価するノードの名前, 評価できないノードの名前 → 理由)。
    定義の名前は「exprespy:」とコード・入出力の型から作った短いハッシュ（同じコードと型のノードは定義を共有し、
    リファレンスの名前空間などで同じ名前のノードがあっても重ならない）。
    """
    nodes = [n for n in ms.nodes if n.type == TYPE]
    defs: Dict[str, ExprespyDef] = {}
    ok: List[str] = []
    problems: Dict[str, str] = {}
    if not nodes:
        return defs, ok, problems
    from .rig import parse_attrs
    time_in = {(id(n), a) for n, a in getattr(ms, "time_inputs", [])}
    out_connected: Dict[int, set] = {}
    for src, sattr, _dst, _dattr in ms.connections:
        if src.type == TYPE:
            io = io_plug(sattr)
            if io is not None and io[0] == "o":
                out_connected.setdefault(id(src), set()).add(io[1])
    results: Dict[int, Optional[ExprespyResult]] = {}
    busy: set = set()

    def convert(n) -> Optional[ExprespyResult]:
        if id(n) in results:
            return results[id(n)]
        if id(n) in busy:
            problems[n.name] = "exprespy どうしの接続が循環しています"
            return None
        busy.add(id(n))
        try:
            res = _convert(n)
        except ExprespyError as exc:
            problems.setdefault(n.name, exc.text())
            res = None
        busy.discard(id(n))
        results[id(n)] = res
        return res

    kinds = _Kinds(ms, convert)

    def _convert(n) -> ExprespyResult:
        code = code_text(ms, n)
        if code is None:
            raise ExprespyError("コード（.cd）が見つかりません")
        if not code.strip():
            raise ExprespyError("コード（.cd）が空です")
        values = parse_attrs(ms.text, n)
        in_kinds: Dict[int, str] = {}
        for key, v in values.items():
            io = io_plug(key)
            if io is not None and io[0] == "i":
                kind = _value_kind(v)
                if kind is not None:
                    in_kinds[io[1]] = kind
        for key, (src, sattr) in n.inputs.items():
            io = io_plug(key)
            if io is None or io[0] != "i":
                continue
            kind = kinds.of(src, sattr)
            if kind is None:
                raise ExprespyError("IN[%d] の型が分かりません（接続元 %s.%s）" % (io[1], src.name, sattr))
            in_kinds[io[1]] = kind
        for node_id, a in time_in:
            io = io_plug(a)
            if node_id == id(n) and io is not None and io[0] == "i":
                in_kinds[io[1]] = "time"
        payload = json.dumps([code, sorted(in_kinds.items()), sorted(out_connected.get(id(n), ()))],
                             ensure_ascii=False)
        key = "%s:%s" % (TYPE, hashlib.sha1(payload.encode("utf-8")).hexdigest()[:12])
        if key in defs:
            nd = defs[key]
            return ExprespyResult(nd, nd.out_kinds, [])
        nd, out_kinds, notes = translate(code, in_kinds, out_connected.get(id(n), ()), type_name=key,
                                         source="exprespy %s" % n.name)
        nd.out_kinds = out_kinds
        defs[key] = nd
        return ExprespyResult(nd, out_kinds, notes)

    used = set()
    for n in nodes:
        res = convert(n)
        if res is None:
            continue
        n.node_def = res.node_def
        used.add(id(n))
        ok.append(n.name)
    # 変換できなかったノードの理由は、変換できたノードの分を除く（循環の検出で先に入ったもの）
    for name in ok:
        problems.pop(name, None)
    ND.rename_plugs(ms, used)
    return defs, ok, problems
