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
回数が変換の時点で決まるループ（range(定数)・IN・IN.items()・タプル・enumerate・zip）と内包表記は展開する
（IN[i]・OUT[i] の番号にループの変数を使える）。try: … except KeyError: は、入力の有無で通る側を選ぶ。
定数だけの式・None の判定は変換の時点で畳み込み、通らない道は書かない。
番号が実行時に決まる IN[i]・OUT[i] は、つながっている入力・出力との比較の連鎖にする。展開したループの中の実行時の
break・continue と、関数の中のループの return は、目印の変数で残りの文を囲む。辞書（キーごとに計算の変数）と
定数の文字列は、変換の時点で扱う。
変数・属性に入れたリストは要素を追い（append など）、コードの中のクラスはインスタンスを追ってメソッドを展開する。
except は、0 で割る・math の範囲外・if 条件: raise・ない入力を、実行前の条件と目印の変数に書き換える。
再帰は、引数が変換の時点で決まれば最後まで、実行時に決まれば 16 段まで展開する。
対応しないもの（理由を警告に出し、そのノードは評価しない）: 前回の値を持ち越す変数（初期化で入れた値の書き換え・
global）・maya.cmds・形状（メッシュ・カーブ）の入出力・中身が実行時に決まる文字列・実行時の条件で長さが変わる
リスト・Maya のクラスを親にするクラス・try の中の if・for の中の例外になりうる計算。
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


_FOLD_BIN = {ast.Add: lambda a, b: a + b, ast.Sub: lambda a, b: a - b, ast.Mult: lambda a, b: a * b,
             ast.Div: lambda a, b: a / b, ast.FloorDiv: lambda a, b: a // b, ast.Mod: lambda a, b: a % b}
_FOLD_CMP = {ast.Eq: lambda a, b: a == b, ast.NotEq: lambda a, b: a != b, ast.Lt: lambda a, b: a < b,
             ast.LtE: lambda a, b: a <= b, ast.Gt: lambda a, b: a > b, ast.GtE: lambda a, b: a >= b}


def _fold(node):
    """数・四則演算・比較・and / or / not・条件式だけの式の値（ほかを含めば None）"""
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
        return node.value
    if isinstance(node, ast.UnaryOp):
        v = _fold(node.operand)
        if v is None:
            return None
        return -v if isinstance(node.op, ast.USub) else +v if isinstance(node.op, ast.UAdd) else \
            (int(not v) if isinstance(node.op, ast.Not) else None)
    if isinstance(node, ast.BinOp) and type(node.op) in _FOLD_BIN:
        a, b = _fold(node.left), _fold(node.right)
        return None if a is None or b is None else _FOLD_BIN[type(node.op)](a, b)
    if isinstance(node, ast.Compare) and all(type(o) in _FOLD_CMP for o in node.ops):
        vals = [_fold(node.left)] + [_fold(c) for c in node.comparators]
        if any(v is None for v in vals):
            return None
        return int(all(_FOLD_CMP[type(o)](vals[k], vals[k + 1]) for k, o in enumerate(node.ops)))
    if isinstance(node, ast.BoolOp):
        vals = [_fold(v) for v in node.values]
        if any(v is None for v in vals):
            return None
        out = vals[0]
        for v in vals[1:]:
            out = (v if out else out) if isinstance(node.op, ast.And) else (out if out else v)
        return out
    if isinstance(node, ast.IfExp):
        c = _fold(node.test)
        return None if c is None else _fold(node.body if c else node.orelse)
    return None


def _has_return(node) -> bool:
    if isinstance(node, ast.Return):
        return True
    if isinstance(node, (ast.FunctionDef, ast.Lambda)):
        return False
    return any(_has_return(c) for c in ast.iter_child_nodes(node))


class _Pre(ast.expr):
    """変換済みの値を持つ式（右辺を 1 回だけ変換して、代入の処理に渡す）"""
    _fields = ()

    def __init__(self, value):
        super().__init__()
        self.value = value


_UNKNOWN = object()          # 変換の時点で決まらない値（比較のため）
_UNKNOWN_STR = object()      # 中身の決まらない文字列


class _Dynamic(PC.ConvertError):
    """番号・キーが変換の時点で決まらない（IN[i] の i が実行時に決まるなど）"""


class _Break(Exception):
    """展開したループの break（変換の時点で抜ける）"""


class _Continue(Exception):
    """展開したループの continue"""


class ExprespyTranslator(PC.Translator):
    """exprespy のコードを、定義の計算の文に書き換える。IN[n] は入力の属性 i<n>、OUT[n] = … は出力の属性 o<n>。
    if not COUNT:（最初の 1 回だけの初期化）は、中身が定数・import・関数の定義だけなら毎回実行するものとして扱う。
    関数（def・lambda）は呼び出したところに展開する"""

    def __init__(self, tree: ast.Module, in_kinds: Dict[int, str], api: int, out_connected=()):
        fn = ast.FunctionDef(name="compute", args=ast.arguments(
            posonlyargs=[], args=[ast.arg(arg=a) for a in ("__ep_self", "__ep_plug", "__ep_data")],
            kwonlyargs=[], kw_defaults=[], defaults=[]), body=tree.body, decorator_list=[], lineno=1)
        module = PC.ModuleInfo(ast.Module(body=[], type_ignores=[]))
        module.api = api
        super().__init__(_NoAttrs(), module, None, fn)
        self.in_kinds = in_kinds
        self.out_kinds: Dict[int, str] = {}
        self.out_connected = set(out_connected)
        self.taken |= {"i%d" % k for k in in_kinds} | {"o%d" % k for k in range(1000)}
        self.funcs: Dict[str, tuple] = {}   # 名前 → (引数, 本体, lambda か, 既定値)
        # 入れ子の状態: "loop" 計算の for・"if" 実行時の if・"func" 展開した関数の境目・
        # {"kind": "unroll"} 展開したループ（break・continue の目印の変数）・{"kind": "ret"} ループの中の return
        self.frames: list = []
        self.inlining: List[str] = []
        self.classes: Dict[str, dict] = {}   # コードの中のクラス（名前 → メソッド・クラスの属性・親）
        self.aliases: Dict[str, ast.expr] = {}   # API・math のクラスや関数の別名（_vec = api.MVector）
        self.method_ctx: list = []           # 展開中のメソッドの (クラス, self)（super() のため）
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
        # コードのどこかで定義する名前（代入・引数・関数・クラス・import・for・except … as・内包表記の変数）
        self.defined: set = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Name) and isinstance(node.ctx, (ast.Store, ast.Del)):
                self.defined.add(node.id)
            elif isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                self.defined.add(node.name)
            elif isinstance(node, ast.arg):
                self.defined.add(node.arg)
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                for a in node.names:                      # 別名と元の名前（別名は変換の前に元の名前に戻す）
                    self.defined.update({(a.asname or a.name).split(".")[0], a.name.split(".")[0], a.name.split(".")[-1]})
            elif isinstance(node, ast.ExceptHandler) and node.name:
                self.defined.add(node.name)

    # ---- IN・OUT
    def index_of(self, node, what: str) -> int:
        k = PC._const(node)
        if isinstance(node, ast.Name) and node.id in self.int_consts:
            k = self.int_consts[node.id]
        elif isinstance(node, ast.Name) and node.id in self.env:     # 展開したループの変数（定数）
            c = self.const_of(self.env[node.id].code)
            if c is not None and c == int(c):
                k = int(c)
        elif not isinstance(node, (ast.Constant, ast.Name)):
            try:                                          # IN[i + 1] など、変換の時点で決まる式
                c = self.const_of(self.num_code(self.expr(node), node))
            except PC.ConvertError:
                c = None
            if c is not None and c == int(c):
                k = int(c)
        if not isinstance(k, int) or isinstance(k, bool):
            raise _Dynamic("%s の番号が変換の時点で決まりません" % what, node)
        return k

    def io_index(self, node, name: str) -> Optional[int]:
        if isinstance(node, ast.Subscript) and isinstance(node.value, ast.Name) and node.value.id == name:
            return self.index_of(node.slice, "%s[…]" % name)
        return None

    def expr(self, e):
        if isinstance(e, _Pre):
            return e.value
        if isinstance(e, ast.Subscript) and isinstance(e.value, ast.Name) and e.value.id == "IN":
            try:
                k = self.index_of(e.slice, "IN[…]")
            except _Dynamic:
                return self.dynamic_input(e.slice, None, e)
            return self.input_value(k, e)
        if isinstance(e, ast.Subscript) and isinstance(e.value, ast.Name) and e.value.id == "OUT":
            PC._fail("OUT[n]（出力）を読んでいます。代入した値は変数に入れて使ってください", e)
        if isinstance(e, ast.Compare) and len(e.ops) == 1 and isinstance(e.ops[0], (ast.In, ast.NotIn)) \
                and isinstance(e.comparators[0], ast.Name) and e.comparators[0].id == "IN":
            try:
                has = "1" if self.index_of(e.left, "IN の番号") in self.in_kinds else "0"
            except _Dynamic:
                k = self.num_code(self.expr(e.left), e)
                has = "(%s)" % " or ".join("(%s == %d)" % (k, n) for n in sorted(self.in_kinds)) if self.in_kinds else "0"
            return PC.Value("num", has if isinstance(e.ops[0], ast.In) else "(not %s)" % has)
        v = self.const_expr(e)
        if v is not None:
            return v
        if isinstance(e, ast.Name):
            alias = self.alias_target(e)
            if alias is not None:                         # 別名をそのまま読む（V → api.MVector）
                return self.expr(alias)
        if isinstance(e, ast.Attribute):
            alias = self.alias_target(e)
            if alias is not None:                         # V.kXaxisVector → api.MVector.kXaxisVector
                return self.expr(alias)
            obj = self.obj_of(e.value)
            if obj is not None:
                return self.obj_attr(obj, e.attr, e)
            if isinstance(e.value, ast.Name) and e.value.id in self.classes and e.value.id not in self.env:
                v = self.class_attr(e.value.id, e.attr)
                if v is None:
                    PC._fail("クラス %s に属性 %s がありません" % (e.value.id, e.attr), e)
                return v
        if isinstance(e, ast.Lambda):
            PC._fail("lambda は、名前に入れて呼び出す形（f = lambda x: …）だけ変換できます", e)
        v = self.none_expr(e)
        if v is not None:
            return v
        if isinstance(e, ast.ListComp):
            vals = self.flat(self.comprehension(e), e)
            return PC.Value("vec", "[%s]" % ", ".join(self.num_code(x, e) for x in vals))
        if isinstance(e, ast.GeneratorExp):
            PC._fail("ジェネレータ式は sum・min・max・any・all・list・tuple の引数でだけ変換できます", e)
        return super().expr(e)

    def select(self, key_code: str, pairs, default, node, what: str):
        """実行時に決まる番号・キーで値を選ぶ式（(v0 if k == 0 else (v1 if k == 1 else 既定値))）"""
        kinds = {v.kind for _k, v in pairs} | ({default.kind} if default is not None else set())
        kinds = {"vec" if k == "pt" else k for k in kinds}
        if len(kinds) > 1:
            PC._fail("%s で選ぶ値の種類がそろっていません（%s）" % (what, "・".join(sorted(kinds))), node)
        kind = kinds.pop() if kinds else "num"
        if default is None:
            size = {"vec2": 2, "vec4": 4}.get(self.in_kinds.get(pairs[0][0]) if pairs else None, 3)
            zero = {"num": "0", "mat": "identity()", "quat": "[0.0, 0.0, 0.0, 1.0]"}.get(
                kind, "[%s]" % ", ".join(["0.0"] * size))
            default = PC.Value(kind, zero)
            self.notes.append("%d 行目: %s の番号・キーがないときは 0 にします（Maya では KeyError）"
                              % (getattr(node, "lineno", 0), what))
        k = self.fresh("k")
        self.emit("%s = %s" % (k, key_code))
        code = default.code
        for key, v in reversed(pairs):
            code = "(%s if %s == %s else %s)" % (v.code, k, PC._num_text(key), code)
        return PC.Value(kind, code, **default.extra)

    def dynamic_input(self, idx_node, default_node, node):
        """IN[i]・IN.get(i, 既定値)（i が実行時に決まる）→ つながっている入力との比較の連鎖"""
        pairs = [(k, self.input_value(k, node)) for k in sorted(self.in_kinds)]
        default = None
        if default_node is not None:
            default = self.expr(default_node)
            if default.kind == "none":
                default = None
        return self.select(self.num_code(self.expr(idx_node), node), pairs, default, node, "IN[…]")

    def dynamic_output(self, idx_node, value_node, s):
        """OUT[i] = 値（i が実行時に決まる）→ 接続されている出力ごとの if"""
        cands = sorted(self.out_connected | set(self.out_kinds))
        if not cands:
            PC._fail("OUT[…] の番号が実行時に決まりますが、接続されている出力がありません", s)
        v = self.out_value(value_node, s)
        kind = self.out_kind(v, s)
        tmp, k = self.fresh("v"), self.fresh("k")
        self.emit("%s = %s" % (tmp, v.code))
        self.emit("%s = %s" % (k, self.num_code(self.expr(idx_node), s)))
        for n, o in enumerate(cands):
            prev = self.out_kinds.get(o)
            if prev is not None and prev != kind:
                PC._fail("OUT[%d] に種類の違う値（%s と %s）を代入しています" % (o, prev, kind), s)
            self.out_kinds[o] = kind
            self.emit("%s %s == %d:" % ("if" if n == 0 else "elif", k, o))
            self.emit("    o%d = %s" % (o, tmp))

    def out_value(self, value_node, s):
        v = self.expr(value_node)
        if v.kind == "tm":
            v = self.tm_matrix(v)
        return v

    def out_kind(self, v, s) -> str:
        if v.kind == "str":
            PC._fail("文字列は OUT に出せません（ビューアは文字列の属性を扱いません）", s)
        kind = _OUT_KINDS.get(v.kind)
        if kind is None:
            PC._fail("OUT に出せない値（%s）を代入しています" % v.kind, s)
        if v.kind == "vec" and v.code.startswith("[") and v.code.count(",") in (1, 3):
            kind = "vec2" if v.code.count(",") == 1 else "vec4"     # 2 つ・4 つの数のリスト
        return kind

    # ---- 文字列・辞書（変換の時点で追う）
    @staticmethod
    def str_value(text) -> "PC.Value":
        """文字列（text が None なら、中身が変換の時点で分からない文字列）"""
        return PC.Value("str", repr(text) if text is not None else "''", s=text)

    def py_const(self, v):
        """変換の時点で決まる値（数・文字列・None・真偽）。決まらなければ _Dynamic"""
        if v.kind == "none":
            return None
        if v.kind == "str":
            if v.extra.get("s") is None:
                raise _Dynamic("文字列の中身が変換の時点で決まりません")
            return v.extra["s"]
        if v.kind in ("num", "unit"):
            c = self.const_of(v.code)
            if c is not None:
                return int(c) if c == int(c) else c
        raise _Dynamic("値が変換の時点で決まりません")

    def const_expr(self, e):
        """文字列・f 文字列・辞書の式（変換の時点で決まるもの）。対象外なら None"""
        if isinstance(e, ast.Constant) and isinstance(e.value, str):
            return self.str_value(e.value)
        if isinstance(e, ast.JoinedStr):               # f"…{x}…": 中身がすべて決まれば文字列、決まらなければ中身なし
            parts = []
            for v in e.values:
                if isinstance(v, ast.Constant):
                    parts.append(str(v.value))
                    continue
                try:
                    x = self.py_const(self.expr(v.value))
                    spec = "".join(str(c.value) for c in getattr(v.format_spec, "values", []) or [])
                    parts.append(format(x, spec) if spec else str(x))
                except (_Dynamic, ValueError, TypeError):
                    return self.str_value(None)
            return self.str_value("".join(parts))
        if isinstance(e, ast.Dict):
            items = {}
            for kn, vn in zip(e.keys, e.values):
                if kn is None:
                    src = self.dict_of(vn)
                    if src is None:
                        PC._fail("**辞書 は辞書の変数だけ展開できます", e)
                    for key, v in src.extra["items"].items():
                        items[key] = self.dict_slot(v, e)
                    continue
                items[self.dict_key(kn, e)] = self.dict_slot(self.tracked(vn), e)
            return PC.Value("dict", "", items=items)
        if isinstance(e, ast.Subscript):
            d = self.dict_of(e.value)
            if d is not None:
                return self.dict_get(d, e.slice, None, e, strict=True)
            lst = self.list_of(e.value)
            if lst is not None and isinstance(e.slice, ast.Slice):
                return self.make_list(self.sliced(lst.extra["items"], e.slice, e), e)   # 切り出し（新しいリスト）
            if isinstance(e.slice, ast.Slice) and self.is_text(e.value):
                return self.str_value(self.sliced(self.str_of(e.value), e.slice, e))
            if lst is not None:
                return self.list_get(lst, e.slice, e)
            if isinstance(e.slice, ast.Slice):
                PC._fail("切り出し（[a:b]）は、変数に入れたリストと文字列だけ変換できます", e)
            st = self.str_of(e.value) if self.is_text(e.value) else None
            if st is not None:
                try:
                    return self.str_value(st[self.index_of(e.slice, "文字列の添字")])
                except IndexError:
                    PC._fail("文字列の添字が範囲外です", e)
        if isinstance(e, ast.BinOp) and self.is_text(e.left):
            left = self.str_of(e.left)
            if left is not None:
                if isinstance(e.op, ast.Add):
                    right = self.str_of(e.right)
                    if right is None:
                        PC._fail("文字列に足せるのは文字列だけです", e)
                    return self.str_value(left + right)
                if isinstance(e.op, ast.Mod):            # "%s_%d" % (a, b)
                    args = e.right.elts if isinstance(e.right, ast.Tuple) else [e.right]
                    try:
                        return self.str_value(left % tuple(self.py_const(self.expr(a)) for a in args))
                    except _Dynamic:
                        return self.str_value(None)
                    except (TypeError, ValueError):
                        PC._fail("文字列の % の書式が合いません", e)
                if isinstance(e.op, ast.Mult):
                    return self.str_value(left * self.index_of(e.right, "文字列の繰り返し"))
        return None

    def str_of(self, node) -> Optional[str]:
        """文字列の式（is_text）なら、その中身（中身が分からなければ変換できない）。文字列でなければ None"""
        if not self.is_text(node):
            return None
        v = self.expr(node)
        if v.kind != "str":
            return None
        if v.extra.get("s") is None:
            PC._fail("文字列の中身が変換の時点で決まりません（実行時の値を入れた f 文字列など）", node)
        return v.extra["s"]

    def dict_of(self, node):
        """式が辞書なら、その値（Value。kind dict）。辞書でなければ None"""
        if isinstance(node, _Pre):
            return node.value if node.value.kind == "dict" else None
        if isinstance(node, ast.Name) and node.id in self.env and self.env[node.id].kind == "dict":
            return self.env[node.id]
        if isinstance(node, ast.Dict):
            return self.expr(node)
        if isinstance(node, ast.Attribute):                # オブジェクトの属性の辞書
            o = self.obj_of(node.value)
            v = o.extra["attrs"].get(node.attr) if o is not None else None
            return v if v is not None and v.kind == "dict" else None
        return None

    def dict_key(self, node, where):
        """辞書のキー（数・文字列）。変換の時点で決まらなければ _Dynamic"""
        v = self.expr(node)
        try:
            key = self.py_const(v)
        except _Dynamic:
            raise _Dynamic("辞書のキーが変換の時点で決まりません", where)
        if isinstance(key, float) and key == int(key):
            key = int(key)                                # 1.0 と 1 は同じキー（Python と同じ）
        return key

    def dict_slot(self, v, node, var=None):
        """辞書・リスト・オブジェクトの値。数・ベクトル・行列は要素ごとの計算の変数に入れる（実行時の if の中の
        書き換えのため）"""
        if v.kind in ("str", "none", "dict", "obj", "list") or v.extra.get("items") is not None:
            return v
        if v.kind == "tm":
            v = self.tm_matrix(v)
        if v.kind == "unit":
            v = PC.Value("num", v.code)
        if v.kind not in ("num", "vec", "pt", "mat", "quat", "eul"):
            PC._fail("辞書に入れられない値（%s）です" % v.kind, node)
        var = var or self.fresh("d")
        self.emit("%s = %s" % (var, v.code))
        return PC.Value(v.kind, var, **v.extra)

    def dict_get(self, d, key_node, default, node, strict: bool):
        items = d.extra["items"]
        try:
            key = self.dict_key(key_node, node)
        except _Dynamic:
            pairs = [(k, v) for k, v in items.items() if isinstance(k, (int, float))]
            if len(pairs) != len(items):
                PC._fail("実行時に決まるキーで読めるのは、キーがすべて数の辞書だけです", node)
            return self.select(self.num_code(self.expr(key_node), node), pairs, default, node, "辞書[…]")
        if key in items:
            return items[key]
        if strict:
            PC._fail("辞書にキー %r がありません（KeyError）" % (key,), node)
        return default if default is not None else PC.Value("none", "None")

    def dict_assign(self, target, value_node, s) -> bool:
        """辞書[キー] = 値。辞書でなければ False"""
        if not isinstance(target, ast.Subscript):
            return False
        d = self.dict_of(target.value)
        if d is None:
            return False
        items = d.extra["items"]
        v = self.tracked(value_node)
        try:
            key = self.dict_key(target.slice, s)
        except _Dynamic:
            # 実行時に決まるキー: 数のキーごとの if（ないキーは増やせない）
            nums = [k for k in items if isinstance(k, (int, float))]
            if not nums:
                PC._fail("実行時に決まるキーで書き込めるのは、数のキーのある辞書だけです", s)
            k = self.fresh("k")
            self.emit("%s = %s" % (k, self.num_code(self.expr(target.slice), s)))
            tmp = self.dict_slot(v, s)
            for n, key in enumerate(nums):
                cur = items[key]
                if cur.kind != tmp.kind:
                    PC._fail("辞書の値の種類が違います（%s と %s）" % (cur.kind, tmp.kind), s)
                self.emit("%s %s == %s:" % ("if" if n == 0 else "elif", k, PC._num_text(key)))
                self.emit("    %s = %s" % (cur.code, tmp.code))
            return True
        cur = items.get(key)
        if cur is not None and cur.kind not in ("str", "none", "dict") and v.kind not in ("str", "none", "dict"):
            if {cur.kind, v.kind} - {"vec", "pt"} and cur.kind != v.kind and not (cur.kind == "num" and v.kind == "unit"):
                PC._fail("辞書のキー %r に種類の違う値（%s と %s）を入れています" % (key, cur.kind, v.kind), s)
            items[key] = self.dict_slot(v, s, var=cur.code)     # 同じ変数に入れる（実行時の if の中でも正しい）
        else:
            if cur is not None and "if" in self.frames and (cur.kind in ("str", "dict") or v.kind in ("str", "dict")):
                PC._fail("実行時の if の中で、辞書の文字列・辞書の値を書き換えています（変換できません）", s)
            items[key] = self.dict_slot(v, s)
        return True

    def dict_aug(self, s: ast.AugAssign) -> bool:
        """辞書[キー] += 値"""
        if not isinstance(s.target, ast.Subscript) or self.dict_of(s.target.value) is None:
            return False
        d = self.dict_of(s.target.value)
        cur = self.dict_get(d, s.target.slice, None, s, strict=True)
        res = self.binop(s.op, cur, self.expr(s.value), s)
        self.dict_assign(s.target, _Pre(res), s)
        return True

    # ---- リスト（変数に入れたリストは、変換の時点で要素を追う）
    def runtime_depth(self) -> int:
        """実行時の if・計算の for の入れ子の深さ（長さを変える処理がそこで行われるか見るため）"""
        return sum(1 for f in self.frames if f in ("if", "loop"))

    def list_items_of(self, node, v):
        if isinstance(node, ast.List):
            return [self.expr(x) for x in node.elts]
        if isinstance(node, ast.ListComp):
            return self.flat(self.comprehension(node), node)
        items = self.static_items(node.args[0]) if node.args else []
        if items is None:
            PC._fail("list(…) は、要素の数が変換の時点で決まる並びだけ変換できます", node)
        return self.flat(items, node)

    def tracked(self, node):
        """値の式。リストの書き方（[…]・内包表記）なら、要素を追うリストにする（属性・辞書の値・要素に入れるため）"""
        if isinstance(node, (ast.List, ast.ListComp)):
            return self.make_list(self.list_items_of(node, None), node)
        return self.expr(node)

    def make_list(self, items, node):
        v = PC.Value("vec", "", items=[self.dict_slot(x, node) for x in items], depth=self.runtime_depth())
        self.relist(v)
        return v

    @staticmethod
    def relist(v):
        """リストの値の種類と式を、要素から作り直す（すべて数ならベクトルとしても使える）"""
        items = v.extra["items"]
        if all(x.kind in ("num", "unit") for x in items):
            v.kind, v.code = "vec", "[%s]" % ", ".join(x.code for x in items)
        else:
            v.kind, v.code = "list", ""

    @staticmethod
    def is_list(v) -> bool:
        return v.kind in ("vec", "list") and isinstance(v.extra.get("items"), list)

    def list_of(self, node):
        if isinstance(node, _Pre):
            return node.value if self.is_list(node.value) else None
        if isinstance(node, ast.Name) and node.id in self.env and self.is_list(self.env[node.id]):
            return self.env[node.id]
        if isinstance(node, ast.Attribute):                # オブジェクトの属性のリスト（self.items など）
            o = self.obj_of(node.value)
            v = o.extra["attrs"].get(node.attr) if o is not None else None
            return v if v is not None and self.is_list(v) else None
        return None

    def list_index(self, lst, node, where) -> int:
        n = len(lst.extra["items"])
        k = self.index_of(node, "リストの添字")
        if k < 0:
            k += n
        if not 0 <= k < n:
            PC._fail("リストの添字 %d が範囲外です（長さ %d）" % (k, n), where)
        return k

    def sliced(self, seq, sl: ast.Slice, node):
        """seq[a:b:c]（a・b・c は変換の時点で決まる数か省略）"""
        try:
            bounds = [None if x is None else self.index_of(x, "切り出しの位置") for x in (sl.lower, sl.upper, sl.step)]
        except _Dynamic:
            PC._fail("切り出しの位置が実行時に決まります（変換の時点で決まる数にしてください）", node)
        if bounds[2] == 0:
            PC._fail("切り出しの刻みが 0 です（ValueError）", node)
        return seq[slice(*bounds)]

    def list_get(self, lst, idx_node, node):
        items = lst.extra["items"]
        try:
            return items[self.list_index(lst, idx_node, node)]
        except _Dynamic:
            return self.select(self.num_code(self.expr(idx_node), node), list(enumerate(items)), None, node, "リスト[…]")

    def check_length_change(self, lst, node, what):
        if self.runtime_depth() > lst.extra.get("depth", 0):
            PC._fail("実行時の if・回数が実行時に決まるループの中でリストの %s をしています（長さが実行時に決まるため、"
                     "変換できません）" % what, node)

    def list_assign(self, target, value_node, s) -> bool:
        if not isinstance(target, ast.Subscript):
            return False
        lst = self.list_of(target.value)
        if lst is None:
            return False
        items = lst.extra["items"]
        v = self.tracked(value_node)
        try:
            k = self.list_index(lst, target.slice, s)
        except _Dynamic:
            tmp = self.dict_slot(v, s)
            kv = self.fresh("k")
            self.emit("%s = %s" % (kv, self.num_code(self.expr(target.slice), s)))
            for n, cur in enumerate(items):
                if cur.kind != tmp.kind:
                    PC._fail("リストの要素の種類が違います（%s と %s）" % (cur.kind, tmp.kind), s)
                self.emit("%s %s == %d:" % ("if" if n == 0 else "elif", kv, n))
                self.emit("    %s = %s" % (cur.code, tmp.code))
            return True
        cur = items[k]
        if cur.kind in ("str", "none", "dict", "obj", "list") or v.kind in ("str", "none", "dict", "obj", "list"):
            if self.runtime_depth() > lst.extra.get("depth", 0):
                PC._fail("実行時の if の中で、リストの文字列・辞書などの要素を書き換えています（変換できません）", s)
            items[k] = self.dict_slot(v, s)
        else:
            if cur.kind != v.kind and {cur.kind, v.kind} != {"vec", "pt"} and not (cur.kind == "num" and v.kind == "unit"):
                PC._fail("リストの要素に種類の違う値（%s と %s）を入れています" % (cur.kind, v.kind), s)
            items[k] = self.dict_slot(v, s, var=cur.code)
        self.relist(lst)
        return True

    def list_aug(self, s: ast.AugAssign) -> bool:
        if isinstance(s.target, ast.Name) and self.list_of(s.target) is not None and isinstance(s.op, ast.Add):
            lst = self.list_of(s.target)
            items = self.static_items(s.value)
            if items is None:
                PC._fail("リストに += できるのは、要素の数が決まる並びだけです", s)
            self.check_length_change(lst, s, "+=")
            lst.extra["items"].extend(self.dict_slot(x, s) for x in self.flat(items, s))
            self.relist(lst)
            return True
        if not isinstance(s.target, ast.Subscript) or self.list_of(s.target.value) is None:
            return False
        lst = self.list_of(s.target.value)
        cur = self.list_get(lst, s.target.slice, s)
        res = self.binop(s.op, cur, self.expr(s.value), s)
        self.list_assign(s.target, _Pre(res), s)
        return True

    def list_method(self, lst, e: ast.Call):
        f, items = e.func.attr, lst.extra["items"]
        if f == "append" and len(e.args) == 1:
            self.check_length_change(lst, e, "append")
            items.append(self.dict_slot(self.tracked(e.args[0]), e))
        elif f == "extend" and len(e.args) == 1:
            self.check_length_change(lst, e, "extend")
            seq = self.static_items(e.args[0])
            if seq is None:
                PC._fail("extend には、要素の数が決まる並びを渡してください", e)
            items.extend(self.dict_slot(x, e) for x in self.flat(seq, e))
        elif f == "insert" and len(e.args) == 2:
            self.check_length_change(lst, e, "insert")
            k = self.index_of(e.args[0], "insert の位置")
            items.insert(k, self.dict_slot(self.expr(e.args[1]), e))
        elif f == "pop" and len(e.args) <= 1:
            self.check_length_change(lst, e, "pop")
            if not items:
                PC._fail("空のリストを pop しています", e)
            k = self.list_index(lst, e.args[0], e) if e.args else len(items) - 1
            v = items.pop(k)
            self.relist(lst)
            return v
        elif f in ("reverse", "clear") and not e.args:
            self.check_length_change(lst, e, f)
            if f == "reverse":
                items.reverse()
            else:
                items.clear()
        elif f in ("index", "count") and len(e.args) == 1:
            x = self.py_const(self.expr(e.args[0]))
            vals = [self.py_const(v) for v in items]
            if f == "count":
                return PC.Value("num", str(vals.count(x)))
            if x not in vals:
                PC._fail("リストに %r がありません（ValueError）" % (x,), e)
            return PC.Value("num", str(vals.index(x)))
        elif f == "copy" and not e.args:
            return self.make_list(list(items), e)
        else:
            PC._fail("リストの %s は変換できません" % f, e)
        self.relist(lst)
        return PC.Value("none", "None")

    # ---- クラス（インスタンスは変換の時点で追い、メソッドは呼び出したところに展開する）
    def define_class(self, s: ast.ClassDef):
        bases = []
        for b in s.bases:
            if isinstance(b, ast.Name) and b.id == "object":
                continue
            if isinstance(b, ast.Name) and b.id in self.classes:
                bases.append(b.id)
                continue
            PC._fail("クラス %s の親（%s）は変換できません（コードの中で定義したクラスだけ）" % (s.name, ast.unparse(b)), s)
        if len(bases) > 1 or s.keywords or s.decorator_list:
            PC._fail("クラス %s の書き方（多重継承・デコレータ）は変換できません" % s.name, s)
        cls = {"name": s.name, "base": bases[0] if bases else None, "methods": {}, "static": set(), "attrs": {}}
        for st in s.body:
            if isinstance(st, ast.FunctionDef):
                deco = [PC._tail(d) for d in st.decorator_list]
                if any(d not in ("staticmethod",) for d in deco):
                    PC._fail("メソッド %s.%s のデコレータ（%s）は変換できません" % (s.name, st.name, "・".join(deco)), st)
                if st.args.vararg or st.args.kwarg or st.args.kwonlyargs or st.args.posonlyargs:
                    PC._fail("メソッド %s.%s の引数の書き方は変換できません" % (s.name, st.name), st)
                params = [a.arg for a in st.args.args]
                defaults = dict(zip(params[len(params) - len(st.args.defaults):], st.args.defaults))
                cls["methods"][st.name] = (params, st.body, False, defaults)
                if "staticmethod" in deco:
                    cls["static"].add(st.name)
            elif isinstance(st, ast.Assign) and len(st.targets) == 1 and isinstance(st.targets[0], ast.Name):
                cls["attrs"][st.targets[0].id] = self.dict_slot(self.expr(st.value), st)
            elif isinstance(st, ast.Pass) or (isinstance(st, ast.Expr) and isinstance(st.value, ast.Constant)):
                continue
            else:
                PC._fail("クラス %s の中のこの書き方は変換できません" % s.name, st)
        self.classes[s.name] = cls
        self.env.pop(s.name, None)

    def find_method(self, cls_name: str, name: str):
        while cls_name is not None:
            cls = self.classes[cls_name]
            if name in cls["methods"]:
                return cls_name, cls["methods"][name], name in cls["static"]
            cls_name = cls["base"]
        return None

    def class_attr(self, cls_name: str, name: str):
        while cls_name is not None:
            cls = self.classes[cls_name]
            if name in cls["attrs"]:
                return cls["attrs"][name]
            cls_name = cls["base"]
        return None

    def obj_of(self, node):
        """式がオブジェクト（コードの中のクラスのインスタンス）なら、その値。でなければ None"""
        if isinstance(node, _Pre):
            return node.value if node.value.kind == "obj" else None
        if isinstance(node, ast.Name) and node.id in self.env and self.env[node.id].kind == "obj":
            return self.env[node.id]
        if isinstance(node, ast.Attribute):
            o = self.obj_of(node.value)
            if o is not None:
                v = o.extra["attrs"].get(node.attr)
                return v if v is not None and v.kind == "obj" else None
        return None

    def instantiate(self, cls_name: str, e: ast.Call):
        obj = PC.Value("obj", "", cls=cls_name, attrs={})
        found = self.find_method(cls_name, "__init__")
        if found is not None:
            owner, func, _static = found
            self.method_ctx.append((owner, obj))
            try:
                self.inline("%s.__init__" % owner, e, func=func, bound=(obj,))
            finally:
                self.method_ctx.pop()
        elif e.args or e.keywords:
            PC._fail("クラス %s には __init__ がないので、引数を渡せません" % cls_name, e)
        return obj

    def obj_attr(self, obj, name: str, node):
        v = obj.extra["attrs"].get(name)
        if v is None:
            v = self.class_attr(obj.extra["cls"], name)
        if v is None:
            if self.find_method(obj.extra["cls"], name) is not None:
                PC._fail("メソッド %s を値として使っています（呼び出す形だけ変換できます）" % name, node)
            PC._fail("%s に属性 %s がありません（AttributeError）" % (obj.extra["cls"], name), node)
        return v

    def obj_assign(self, target, value_node, s) -> bool:
        if not isinstance(target, ast.Attribute):
            return False
        obj = self.obj_of(target.value)
        if obj is None:
            return False
        attrs = obj.extra["attrs"]
        v = self.tracked(value_node)
        cur = attrs.get(target.attr)
        tracked = ("str", "none", "dict", "obj", "list")
        if cur is not None and cur.kind not in tracked and v.kind not in tracked and cur.extra.get("items") is None:
            if cur.kind != v.kind and {cur.kind, v.kind} != {"vec", "pt"} and not (cur.kind == "num" and v.kind == "unit"):
                PC._fail("属性 %s に種類の違う値（%s と %s）を入れています" % (target.attr, cur.kind, v.kind), s)
            attrs[target.attr] = self.dict_slot(v, s, var=cur.code)
        else:
            if cur is not None and "if" in self.frames:
                PC._fail("実行時の if の中で、属性 %s の文字列・辞書などを書き換えています（変換できません）" % target.attr, s)
            attrs[target.attr] = self.dict_slot(v, s)
        return True

    def obj_aug(self, s: ast.AugAssign) -> bool:
        if not isinstance(s.target, ast.Attribute) or self.obj_of(s.target.value) is None:
            return False
        obj = self.obj_of(s.target.value)
        res = self.binop(s.op, self.obj_attr(obj, s.target.attr, s), self.expr(s.value), s)
        self.obj_assign(s.target, _Pre(res), s)
        return True

    def method_call(self, e: ast.Call):
        """obj.method(…)・Class.method(…)・super().method(…)。対象外なら None"""
        f = e.func
        if not isinstance(f, ast.Attribute):
            return None
        if isinstance(f.value, ast.Call) and isinstance(f.value.func, ast.Name) and f.value.func.id == "super" \
                and "super" not in self.env:
            if not self.method_ctx:
                PC._fail("super() はメソッドの中だけで使えます", e)
            owner, obj = self.method_ctx[-1]
            base = self.classes[owner]["base"]
            found = self.find_method(base, f.attr) if base else None
            if found is None:
                PC._fail("親クラスにメソッド %s がありません" % f.attr, e)
            return self.run_method(found, obj, e)
        obj = self.obj_of(f.value)
        if obj is None and isinstance(f.value, ast.Call):
            v = self.expr(f.value)                        # Cls(…).method(…)・f(…).method(…)（作ったその場で呼ぶ）
            if v.kind == "obj":
                obj = v
            elif self.is_list(v):
                return self.list_method(v, e)
            else:
                return self.call(ast.copy_location(ast.Call(func=ast.Attribute(value=_Pre(v), attr=f.attr, ctx=ast.Load()),
                                                            args=e.args, keywords=e.keywords), e))
        if obj is not None:
            found = self.find_method(obj.extra["cls"], f.attr)
            if found is None:
                PC._fail("%s にメソッド %s がありません" % (obj.extra["cls"], f.attr), e)
            return self.run_method(found, obj, e)
        if isinstance(f.value, ast.Name) and f.value.id in self.classes and f.value.id not in self.env:
            found = self.find_method(f.value.id, f.attr)
            if found is None:
                PC._fail("クラス %s にメソッド %s がありません" % (f.value.id, f.attr), e)
            return self.run_method(found, None, e)            # Class.method(obj, …)・静的メソッド
        lst = self.list_of(f.value)
        if lst is not None:
            return self.list_method(lst, e)
        return None

    def run_method(self, found, obj, e):
        owner, func, static = found
        self.method_ctx.append((owner, obj))
        try:
            return self.inline("%s.%s" % (owner, e.func.attr), e, func=func,
                               bound=() if static or obj is None else (obj,))
        finally:
            self.method_ctx.pop()

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
                if self.undefined(e.id):
                    return self.name_error(e.id, e)
                PC._fail("名前 %s が分かりません（値を入れていない変数・コードの外の名前）" % e.id, e)
        return super().name(e)

    def undefined(self, name: str) -> bool:
        """コードのどこにも定義のない名前か（打ち間違いなど。Python では、その行を実行したときだけ NameError）"""
        import builtins
        return (name not in self.defined and name not in self.aliases and name not in self.funcs
                and name not in self.classes and name not in _PRE_IMPORTED and not hasattr(builtins, name)
                and name not in PC._KNOWN_CLASSES and name not in PC._MATH
                and name not in ("IN", "OUT", "COUNT"))

    def name_error(self, name: str, node):
        """定義のない名前: その道を通ったら計算の誤り（Maya では NameError でノードの計算が止まる）。
        通らない道（使われない分岐）なら、ほかの出力はそのまま評価できる"""
        self.notes.append("%d 行目: 名前 %s はコードのどこにも定義がありません。ここを通るとそのフレームは計算の誤りに"
                          "なります（Maya では NameError）" % (getattr(node, "lineno", 0), name))
        return PC.Value("num", "(1 / 0)")

    # ---- 文
    def stmt(self, s):
        if isinstance(s, (ast.Import, ast.ImportFrom)):
            mods = [a.name for a in s.names] if isinstance(s, ast.Import) else [s.module or ""]
            bad = [m for m in mods if not any(m == ok or m.startswith(ok + ".") for ok in _OK_MODULES)]
            if bad:
                PC._fail("import %s は変換できません（math と maya.api.OpenMaya だけ）" % bad[0], s)
            return                                         # 別名は読む前に元の名前に戻してある
        if isinstance(s, ast.AugAssign) and isinstance(s.target, ast.Subscript) and \
                isinstance(s.target.value, ast.Name) and s.target.value.id == "OUT":
            PC._fail("OUT[n] への += などは変換できません（OUT は実行のたびに空になります）", s)
        if isinstance(s, ast.AugAssign) and (self.dict_aug(s) or self.list_aug(s) or self.obj_aug(s)):
            return
        if isinstance(s, ast.ClassDef):
            self.define_class(s)
            return
        if isinstance(s, ast.FunctionDef):
            self.define(s.name, s.args, s.body, False, s)
            return
        if isinstance(s, ast.Global):
            PC._fail("global（前回の値を持ち越す変数）は変換できません", s)
        if isinstance(s, ast.If) and _is_first_run(s.test):
            self.first_run(s)
            return
        if isinstance(s, (ast.Break, ast.Continue)) and self.jump(s):
            return
        if isinstance(s, ast.Try):
            self.try_stmt(s)
            return
        if isinstance(s, ast.Assert):
            self.notes.append("%d 行目: assert は無視しました" % s.lineno)
            return
        if isinstance(s, ast.Delete):
            for t in s.targets:
                if isinstance(t, ast.Name):
                    self.env.pop(t.id, None)
                elif isinstance(t, ast.Subscript):
                    d = self.dict_of(t.value)
                    if d is None:
                        PC._fail("del は変数と辞書の要素だけ変換できます", s)
                    d.extra["items"].pop(self.dict_key(t.slice, s), None)
            return
        if isinstance(s, ast.Assign) and (len(s.targets) > 1 or self.needs_split(s.targets[0], s.value)):
            self.multi_assign(s)
            return
        return super().stmt(s)

    def needs_split(self, target, value) -> bool:
        """分けて代入するか（a, b = c, d・OUT[0], OUT[1] = …・v[0], v[1] = …）"""
        if not isinstance(target, (ast.Tuple, ast.List)):
            return False
        if isinstance(value, (ast.Tuple, ast.List)):
            return True
        return not all(isinstance(t, ast.Name) for t in target.elts)

    def temp_name(self, node) -> ast.Name:
        n = ast.Name(id="__tmp%d" % (self.counter + 1), ctx=ast.Load())
        self.counter += 1
        return ast.copy_location(n, node)

    def multi_assign(self, s: ast.Assign):
        """a = b = 値・a, b = b, a（右辺を先にすべて求めてから入れる。Python と同じ）"""
        if len(s.targets) > 1:
            tmp = self.temp_name(s)
            self.assign(tmp, s.value, s)
            for t in s.targets:
                self.stmt(ast.copy_location(ast.Assign(targets=[t], value=tmp), s))
            return
        target, value = s.targets[0], s.value
        if any(isinstance(t, ast.Starred) for t in target.elts):
            PC._fail("*a のような分け方は変換できません", s)
        if isinstance(value, (ast.Tuple, ast.List)):
            if len(value.elts) != len(target.elts):
                PC._fail("分ける数が合いません（%d 個と %d 個）" % (len(target.elts), len(value.elts)), s)
            tmps = []
            for v in value.elts:
                tmp = self.temp_name(s)
                self.assign(tmp, v, s)
                tmps.append(tmp)
        else:
            whole = self.temp_name(s)
            self.assign(whole, value, s)
            tmps = [ast.copy_location(ast.Subscript(value=whole, slice=ast.Constant(k), ctx=ast.Load()), s)
                    for k in range(len(target.elts))]
        for t, v in zip(target.elts, tmps):
            self.stmt(ast.copy_location(ast.Assign(targets=[t], value=v), s))

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

    def alias_target(self, node) -> Optional[ast.expr]:
        """別名（_vec・_vec.kXaxisVector）を使う式なら、元の名前に戻した式"""
        parts = PC._dotted(node)
        if not parts or parts[0] not in self.aliases or parts[0] in self.env:
            return None
        return ast.copy_location(PC._dotted_expr(PC._dotted(self.aliases[parts[0]]) + parts[1:]), node)

    def api_alias(self, node) -> Optional[ast.expr]:
        """Maya の API・math のクラスや関数そのもの（api.MVector・math.sin・MVector・別名）なら、その元の式"""
        parts = PC._dotted(node)
        if not parts:
            return None
        root = parts[0]
        if root in self.aliases:
            return PC._dotted_expr(PC._dotted(self.aliases[root]) + parts[1:])
        if root in self.env or root in self.funcs or root in self.classes:
            return None
        last = parts[-1]
        # クラス（api.MVector・MVector）と math の関数（math.sin）だけ。定数（api.MVector.kYaxisVector・math.pi）は値
        if last in PC._KNOWN_CLASSES and len(parts) <= 2:
            return node                                   # MVector・api.MVector・om.MVector（import … as om）
        if root == "math" and len(parts) == 2 and (last in PC._MATH or last in PC._MATH_RENAME
                                                    or last in ("copysign", "isclose")):
            return node
        return None

    def assign(self, target, value_node, s):
        if isinstance(value_node, ast.Lambda) and isinstance(target, ast.Name):
            self.define(target.id, value_node.args, value_node.body, True, s)
            return
        if isinstance(target, ast.Name) and not isinstance(value_node, _Pre):
            alias = self.api_alias(value_node)
            if alias is not None:
                self.aliases[target.id] = alias           # _vec = api.MVector: 別名（計算の文にはしない）
                self.env.pop(target.id, None)
                return
        if isinstance(target, ast.Name) and not isinstance(value_node, _Pre):
            v = self.expr(value_node)
            if isinstance(value_node, (ast.List, ast.ListComp)) or (
                    isinstance(value_node, ast.Call) and isinstance(value_node.func, ast.Name)
                    and value_node.func.id == "list" and "list" not in self.env):
                v = self.make_list(self.list_items_of(value_node, v), value_node)   # 変数に入れるリスト（append など）
            if v.kind in ("none", "str", "dict", "obj", "list") or v.extra.get("items") is not None:
                self.env[target.id] = v                  # 変換の時点で追う値（計算の変数にしない。同じものを共有）
                return
            value_node = ast.copy_location(_Pre(v), value_node)   # 変換した値（右辺は 1 回だけ変換する）
        try:
            k = self.io_index(target, "OUT")
        except _Dynamic:
            self.dynamic_output(target.slice, value_node, s)
            return
        if k is None:
            if isinstance(target, ast.Subscript) and isinstance(target.value, ast.Name) and target.value.id == "IN":
                PC._fail("IN[n]（入力）に代入しています", s)
            if self.dict_assign(target, value_node, s) or self.list_assign(target, value_node, s) \
                    or self.obj_assign(target, value_node, s):
                return
            return super().assign(target, value_node, s)
        v = self.out_value(value_node, s)
        kind = self.out_kind(v, s)
        prev = self.out_kinds.get(k)
        if prev is not None and prev != kind:
            PC._fail("OUT[%d] に種類の違う値（%s と %s）を代入しています" % (k, prev, kind), s)
        self.out_kinds[k] = kind
        self.emit("o%d = %s" % (k, v.code))

    # ---- 変換の時点で要素が決まる並び（ループの展開・内包表記・sum など）
    UNROLL_LIMIT = 256          # 展開するループの回数の上限
    WHILE_LIMIT = 10000         # while の繰り返しの上限（for … range に書き換える）

    def static_items(self, node) -> Optional[list]:
        """変換の時点で要素の数が決まる並び。要素は Value か、Value のタプル（items()・enumerate・zip）。
        決まらなければ None"""
        if isinstance(node, ast.Name) and node.id == "IN" and node.id not in self.env:
            return [PC.Value("num", str(k)) for k in sorted(self.in_kinds)]
        d = self.dict_of(node)
        if d is not None:
            return [self.key_value(k) for k in d.extra["items"]]
        lst = self.list_of(node)
        if lst is not None:
            return list(lst.extra["items"])
        if isinstance(node, ast.Subscript) and isinstance(node.slice, ast.Slice) and self.list_of(node.value) is not None:
            return list(self.expr(node).extra["items"])       # 切り出したリスト（len(xs[1:]) など）
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and not node.args:
            d = self.dict_of(node.func.value)
            if d is not None and node.func.attr in ("keys", "values", "items"):
                items = d.extra["items"]
                if node.func.attr == "keys":
                    return [self.key_value(k) for k in items]
                if node.func.attr == "values":
                    return list(items.values())
                return [(self.key_value(k), v) for k, v in items.items()]
        if self.is_text(node):
            text = self.str_of(node)
            return [self.str_value(c) for c in text] if text is not None else None
        if isinstance(node, (ast.Tuple, ast.List, ast.Set)):
            out = []
            for x in node.elts:
                if isinstance(x, ast.Starred):
                    return None
                out.append(tuple(self.expr(y) for y in x.elts) if isinstance(x, ast.Tuple) else self.expr(x))
            return out
        if isinstance(node, (ast.ListComp, ast.GeneratorExp)):
            return self.comprehension(node)
        if not isinstance(node, ast.Call) or node.keywords and not (
                isinstance(node.func, ast.Name) and node.func.id == "enumerate"):
            return None
        f = node.func
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == "IN" and not node.args:
            keys = sorted(self.in_kinds)
            if f.attr == "keys":
                return [PC.Value("num", str(k)) for k in keys]
            if f.attr == "values":
                return [self.input_value(k, node) for k in keys]
            if f.attr == "items":
                return [(PC.Value("num", str(k)), self.input_value(k, node)) for k in keys]
            return None
        if not isinstance(f, ast.Name) or f.id in self.env or f.id in self.funcs:
            return None
        args = node.args
        if f.id == "range" and 1 <= len(args) <= 3:
            try:
                r = range(*[self.index_of(a, "range") for a in args])
            except PC.ConvertError:
                return None
            if len(r) > self.UNROLL_LIMIT:
                return None
            return [PC.Value("num", str(i)) for i in r]
        if f.id == "enumerate" and args:
            items = self.static_items(args[0])
            kw = {k.arg: k.value for k in node.keywords}
            start_node = args[1] if len(args) > 1 else kw.get("start")
            start = self.index_of(start_node, "enumerate") if start_node is not None else 0
            return None if items is None else [(PC.Value("num", str(start + k)), it) for k, it in enumerate(items)]
        if f.id == "zip" and args:
            lists = [self.static_items(a) for a in args]
            return None if any(x is None for x in lists) else [tuple(t) for t in zip(*lists)]
        if f.id in ("list", "tuple", "sorted", "reversed") and len(args) == 1:
            items = self.static_items(args[0])
            if items is None:
                return None
            if f.id == "reversed":
                return list(reversed(items))
            if f.id == "sorted":
                consts = [self.const_of(x.code) if isinstance(x, PC.Value) else None for x in items]
                if any(c is None for c in consts):
                    return None                           # 値が実行時に決まるものは並べ替えられない
                return [x for _c, x in sorted(zip(consts, items), key=lambda p: p[0])]
            return items
        return None

    def key_value(self, key):
        return self.str_value(key) if isinstance(key, str) else PC.Value("num", PC._num_text(key))

    def flat(self, items, node) -> list:
        """並びの要素（Value のタプルは不可）"""
        for x in items:
            if not isinstance(x, PC.Value):
                PC._fail("ここではタプルの並びは使えません", node)
        return list(items)

    def bind(self, target, item, node):
        """ループ・内包表記の変数に、並びの要素を入れる（変数にはせず、値の式のまま追う）"""
        if isinstance(target, ast.Name):
            if isinstance(item, tuple):
                PC._fail("for の変数 %s にタプルを入れています（a, b のように分けてください）" % target.id, node)
            self.env[target.id] = item
            return
        if isinstance(target, (ast.Tuple, ast.List)):
            if isinstance(item, PC.Value):
                if item.kind not in ("vec", "pt", "quat", "eul"):
                    PC._fail("この値は分けられません（%s）" % item.kind, node)
                item = tuple(PC.Value("num", "%s[%d]" % (item.code, k)) for k in range(len(target.elts)))
            if len(item) != len(target.elts):
                PC._fail("分ける数が合いません（%d 個と %d 個）" % (len(target.elts), len(item)), node)
            for t, x in zip(target.elts, item):
                self.bind(t, x, node)
            return
        PC._fail("この for の変数は変換できません", node)

    def comprehension(self, node) -> list:
        """[式 for x in 並び if 条件] の要素（並びと条件が変換の時点で決まるとき）"""
        out = []
        saved = dict(self.env)

        def rec(k):
            if k == len(node.generators):
                out.append(self.expr(node.elt))
                return
            g = node.generators[k]
            items = self.static_items(g.iter)
            if items is None:
                PC._fail("内包表記は、IN・タプル・リスト・range などの、要素の数が決まる並びだけ変換できます", g.iter)
            for it in items:
                self.bind(g.target, it, node)
                keep = True
                for c in g.ifs:
                    known = self.known_cond(c)
                    if known is None:
                        PC._fail("内包表記の if は、変換の時点で決まる条件だけ変換できます", c)
                    if not known:
                        keep = False
                        break
                if keep:
                    rec(k + 1)
        try:
            rec(0)
        finally:
            self.env = saved                              # 内包表記の変数は外に出さない（Python 3 と同じ）
        if len(out) > self.UNROLL_LIMIT:
            PC._fail("内包表記の要素が多すぎます（%d 個まで）" % self.UNROLL_LIMIT, node)
        return out

    # ---- ループ（展開する・そのまま for range にする・while）
    def for_stmt(self, s: ast.For):
        if s.orelse:
            PC._fail("for … else は変換できません", s)
        if self.needs_unroll(s):
            items = self.static_items(s.iter)
            if items is None and isinstance(s.target, ast.Name):
                # 要素の数が分からない並び（ベクトルの変数・range(int(IN[0])) など）は計算の for。
                # IN[i]・OUT[i] の番号は、実行時に選ぶ（比較の連鎖）
                items = False
            if items is False:
                pass
            elif items is None:
                PC._fail("この for は変換できません（IN[i] などで番号に使う変数は、range(定数)・IN・タプルなど、"
                         "回数が変換の時点で決まる並びでたどってください。%d 回まで）" % self.UNROLL_LIMIT, s)
            else:
                self.unroll(s, items)
                self.after_loop(s)
                return
        self.frames.append("loop")
        try:
            super().for_stmt(s)
        finally:
            self.frames.pop()
        self.after_loop(s)

    def needs_unroll(self, s: ast.For) -> bool:
        """ループを展開するか（range 以外の並び・タプルの変数・IN / OUT の番号に変数を使うとき）"""
        it = s.iter
        if not (isinstance(it, ast.Call) and isinstance(it.func, ast.Name) and it.func.id == "range"
                and it.func.id not in self.env) or not isinstance(s.target, ast.Name):
            return True
        return self.uses_index(s)

    @staticmethod
    def uses_index(s: ast.For) -> bool:
        """ループの変数を IN[…]・OUT[…]・IN.get(…) の番号に使うか"""
        names = {n.id for n in ast.walk(s.target) if isinstance(n, ast.Name)}
        for node in ast.walk(ast.Module(body=s.body, type_ignores=[])):
            idx = None
            if isinstance(node, ast.Subscript) and isinstance(node.value, ast.Name) and node.value.id in ("IN", "OUT"):
                idx = node.slice
            elif (isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "get"
                  and isinstance(node.func.value, ast.Name) and node.func.value.id == "IN" and node.args):
                idx = node.args[0]
            if idx is not None and any(isinstance(n, ast.Name) and n.id in names for n in ast.walk(idx)):
                return True
            # リスト・文字列の添字・切り出しの位置（l[i]・l[i:i + 2]）: 位置を定数にするため展開する
            if isinstance(node, ast.Subscript) and not (isinstance(node.value, ast.Name) and node.value.id in ("IN", "OUT")) \
                    and any(isinstance(n, ast.Name) and n.id in names for n in ast.walk(node.slice)):
                return True
        return False

    def unroll(self, s: ast.For, items: list):
        targets = {n.id for n in ast.walk(s.target) if isinstance(n, ast.Name)}
        stored = set(_scope_stores(s.body))
        if targets & stored:
            PC._fail("ループの変数 %s に代入しています（展開するループでは変換できません）" % "・".join(sorted(targets & stored)), s)
        fr = {"kind": "unroll", "brk": self.fresh("brk"), "cnt": self.fresh("cnt"), "b": False, "flags": 0}
        self.frames.append(fr)
        base = self.indent
        brk_line = len(self.lines)
        self.emit("%s = 0" % fr["brk"])
        try:
            for it in items:
                self.indent = base
                if fr["b"]:                               # 実行時の break のあとの繰り返しは、抜けていなければ
                    self.emit("if not %s:" % fr["brk"])
                    self.indent += 1
                self.bind(s.target, it, s)
                cnt_line = len(self.lines)
                self.emit("%s = 0" % fr["cnt"])
                guarded = False
                try:
                    for n, st in enumerate(s.body):
                        before = fr["flags"]
                        self.stmt_strict(st)
                        if fr["flags"] != before and not guarded and n + 1 < len(s.body):   # 実行時の break・continue のあとの文
                            self.emit("if not (%s or %s):" % (fr["brk"], fr["cnt"]))
                            self.indent += 1
                            guarded = True
                except _Continue:
                    pass
                except _Break:
                    break
                finally:
                    if not guarded and not fr.get("c_used"):
                        del self.lines[cnt_line]          # この繰り返しでは continue の目印を使わない
                    fr["c_used"] = False
        finally:
            self.frames.pop()
            self.indent = base
        if not fr["b"] and not fr["flags"]:
            del self.lines[brk_line]

    def stmt_strict(self, st):
        """文を変換する（変換できなければ、その場で止める。展開したループの中は途中で続けない）"""
        self.stmt(st)

    def while_stmt(self, s: ast.While):
        """while 条件: … → for _ in range(上限): if not 条件: break …（上限を超える繰り返しは打ち切る）"""
        if s.orelse:
            PC._fail("while … else は変換できません", s)
        k = self.fresh("w")
        self.emit("for %s in range(%d):" % (k, self.WHILE_LIMIT))
        self.indent += 1
        self.frames.append("loop")
        try:
            self.emit("if not %s:" % self.cond(s.test))
            self.emit("    break")
            n = len(self.lines)
            self.block(s.body)
            if len(self.lines) == n:
                self.emit("pass")
        finally:
            self.frames.pop()
            self.indent -= 1
        self.notes.append("%d 行目: while は %d 回までで打ち切ります" % (s.lineno, self.WHILE_LIMIT))
        self.after_loop(s)

    def jump(self, s):
        """break・continue: 展開したループの中なら変換の時点で抜ける。実行時の条件の中なら変換できない"""
        in_if = False
        for f in reversed(self.frames):
            if f in ("loop", "func"):
                return False                              # 計算の for の中（そのまま書く）
            if f == "if":
                in_if = True
                continue
            if isinstance(f, dict) and f["kind"] == "unroll":
                if not in_if:
                    raise _Break() if isinstance(s, ast.Break) else _Continue()
                # 実行時の条件の中: 目印の変数を立て、残りの文・繰り返しを目印で囲む
                if isinstance(s, ast.Break):
                    self.emit("%s = 1" % f["brk"])
                    f["b"] = True
                else:
                    self.emit("%s = 1" % f["cnt"])
                    f["c_used"] = True
                f["flags"] += 1
                return True
        return False

    def block(self, stmts, tail: bool = False):
        """文の並び。break・continue・return のあとの文（実行されない）は変換しない"""
        out, ret = [], None
        for st in stmts:
            if isinstance(st, ast.Return) and not tail and self.ret_frame() is not None:
                ret = st                                  # ループの中の return（前の文を変換してから）
                break
            out.append(st)
            if isinstance(st, (ast.Break, ast.Continue)):
                break
        res = super().block(out, tail)
        if ret is not None:
            self.loop_return(ret)
        return res

    def ret_frame(self):
        """ループの中の return を受ける関数の目印（関数の境目より内側）"""
        for f in reversed(self.frames):
            if f == "func":
                return None
            if isinstance(f, dict) and f["kind"] == "ret":
                return f
        return None

    def loop_return(self, st: ast.Return):
        """ループの中の return: 戻り値を入れ、戻った目印を立てて、ループを抜ける"""
        fr = self.ret_frame()
        self.set_return(st, fr["ret"])
        self.emit("%s = 1" % fr["done"])
        self.stmt(ast.copy_location(ast.Break(), st))

    def after_loop(self, node):
        """ループの中で return したら、外側のループも抜ける（関数の中の入れ子のループ）"""
        fr = self.ret_frame()
        if fr is None:
            return
        idx = self.frames.index(fr)
        if any(f == "loop" or isinstance(f, dict) and f["kind"] == "unroll" for f in self.frames[idx + 1:]):
            self.env[fr["name"]] = PC.Value("num", fr["done"])
            test = ast.Name(id=fr["name"], ctx=ast.Load())
            self.stmt(ast.copy_location(ast.If(test=test, body=[ast.Break()], orelse=[]), node))

    # ---- try（IN にない番号を読むと KeyError）
    _CATCH = {"KeyError", "LookupError", "Exception", "BaseException"}

    def missing_input(self, node) -> bool:
        """IN にない番号を IN[k] で読むか（変換の時点で番号が決まらなければ変換できない）"""
        for n in ast.walk(node):
            if isinstance(n, (ast.FunctionDef, ast.Lambda)):
                continue
            if isinstance(n, ast.Subscript) and isinstance(n.value, ast.Name) and n.value.id == "IN" \
                    and isinstance(n.ctx, ast.Load):
                try:
                    if self.index_of(n.slice, "IN[…]") not in self.in_kinds:
                        return True
                except _Dynamic:
                    PC._fail("try の中で、番号が実行時に決まる IN[…] を読んでいます（KeyError になるかが分かりません）", n)
        return False

    # 例外の親子（except で受けるか）。ここにない名前は Exception の子とみなす
    _EXC_PARENT = {"ZeroDivisionError": "ArithmeticError", "OverflowError": "ArithmeticError",
                   "ArithmeticError": "Exception", "KeyError": "LookupError", "IndexError": "LookupError",
                   "LookupError": "Exception", "ValueError": "Exception", "Exception": "BaseException"}

    def catches(self, handler, exc: str) -> bool:
        if handler.type is None:
            return True
        names = [PC._tail(x) for x in handler.type.elts] if isinstance(handler.type, ast.Tuple) else [PC._tail(handler.type)]
        x = exc
        while x is not None:
            if x in names:
                return True
            x = self._EXC_PARENT.get(x, "Exception" if x not in ("Exception", "BaseException") else None)
        return False

    def risks(self, st) -> List[Tuple[str, ast.expr, str]]:
        """文の実行で起きうる例外（例外の名前, 起きる条件の式の材料, 説明）。
        0 で割る（/・//・%）、math.sqrt・log・log10 の範囲外、math.acos・asin の範囲外。条件式（a if c else b）・
        and / or の右側など、実行されないかもしれない部分は見ない"""
        out = []

        def visit(n):
            if isinstance(n, (ast.FunctionDef, ast.Lambda, ast.ClassDef)):
                return
            if isinstance(n, ast.IfExp):
                visit(n.test)
                return
            if isinstance(n, ast.BoolOp):
                visit(n.values[0])
                return
            if isinstance(n, ast.BinOp) and isinstance(n.op, (ast.Div, ast.FloorDiv, ast.Mod)):
                out.append(("ZeroDivisionError", ("zero", n.right), "0 で割る"))
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and isinstance(n.func.value, ast.Name) \
                    and n.func.value.id == "math" and n.args:
                if n.func.attr == "sqrt":
                    out.append(("ValueError", ("neg", n.args[0]), "負の数の sqrt"))
                elif n.func.attr in ("log", "log10", "log2"):
                    out.append(("ValueError", ("nonpos", n.args[0]), "0 以下の log"))
                elif n.func.attr in ("acos", "asin"):
                    out.append(("ValueError", ("unit", n.args[0]), "範囲外の %s" % n.func.attr))
            for c in ast.iter_child_nodes(n):
                visit(c)
        if isinstance(st, ast.AugAssign) and isinstance(st.op, (ast.Div, ast.FloorDiv, ast.Mod)):
            out.append(("ZeroDivisionError", ("zero", st.value), "0 で割る"))
        for c in ([st.value] if isinstance(st, (ast.Assign, ast.AugAssign, ast.AnnAssign, ast.Expr, ast.Return))
                  and getattr(st, "value", None) is not None else []):
            visit(c)
        return out

    def risky_inside(self, st, handler_for) -> bool:
        """if・for などの中に、受ける except のある例外（0 で割る・math の範囲外・raise）があるか"""
        for n in ast.walk(st):
            if isinstance(n, ast.Raise) and handler_for(self.raise_name(n) or "Exception") is not None:
                return True
            if isinstance(n, (ast.Assign, ast.AugAssign, ast.Expr, ast.Return)) and n is not st:
                if any(handler_for(e) is not None for e, _r, _l in self.risks(n)):
                    return True
        return False

    def risk_cond(self, risk, node) -> Optional[str]:
        kind, operand = risk
        try:
            v = self.expr(operand)
        except PC.ConvertError:
            return None                                   # 割る数が数でない（ベクトルなど）。文の変換で理由を出す
        if v.kind not in ("num", "unit"):
            return None                                   # ベクトル ÷ 数 などの割る数でないもの
        x = v.code
        cond = {"zero": "(%s == 0)", "neg": "(%s < 0)", "nonpos": "(%s <= 0)", "unit": "(abs(%s) > 1)"}[kind] % x
        c = self.const_of(cond)
        return None if c == 0 else cond

    @staticmethod
    def raise_name(st) -> Optional[str]:
        exc = st.exc
        if exc is None:
            return None
        return PC._tail(exc.func if isinstance(exc, ast.Call) else exc)

    def try_stmt(self, s: ast.Try):  # noqa: C901
        """try: … except …: … を、例外の起きる条件に書き換える。
        IN にない番号の IN[k]（KeyError）は変換の時点で分かる。0 で割る・math の範囲外（ZeroDivisionError・ValueError）・
        if 条件: raise 例外 は、文を実行する前に条件を調べ、起きたら目印の変数（どの except か）を立てて残りの文を飛ばす"""
        for h in s.handlers:
            if h.name and any(isinstance(n, ast.Name) and n.id == h.name
                              for st in h.body for n in ast.walk(st)):
                PC._fail("except … as %s の %s を使っています（例外の中身は変換できません）" % (h.name, h.name), h)

        def handler_for(exc):
            return next((k for k, h in enumerate(s.handlers) if self.catches(h, exc)), None)
        err = self.fresh("err")
        err_line = len(self.lines)
        self.emit("%s = 0" % err)
        base = self.indent
        guarded = False                                   # 前の文で例外の目印を立てうるか
        static_err = None                                 # 変換の時点で決まった例外（except の番号）
        used = False
        if True:
            for st in s.body:
                # 変換の時点で決まる例外（IN にない番号・無条件の raise）
                exc = None
                if self.missing_input(st):
                    if not isinstance(st, (ast.Assign, ast.AugAssign, ast.AnnAssign, ast.Expr, ast.Return)):
                        PC._fail("try の中の if・for などの中で、ない入力（IN[k]）を読んでいます（変換できません）", st)
                    exc = "KeyError"
                elif isinstance(st, ast.Raise):
                    exc = self.raise_name(st) or "Exception"
                if exc is not None:
                    k = handler_for(exc)
                    if k is None:
                        PC._fail("try の中で %s が起きますが、受ける except がありません" % exc, st)
                    if guarded:
                        self.emit("if not %s:" % err)
                        self.emit("    %s = %d" % (err, k + 1))
                    else:
                        static_err = k
                    used = True
                    break
                # if 条件: raise 例外（実行時の条件）
                if isinstance(st, ast.If) and len(st.body) == 1 and isinstance(st.body[0], ast.Raise) and not st.orelse:
                    name = self.raise_name(st.body[0]) or "Exception"
                    k = handler_for(name)
                    if k is None:
                        PC._fail("try の中で %s が起きますが、受ける except がありません" % name, st)
                    known = self.known_cond(st.test)
                    if known is False:
                        continue
                    cond = "1" if known else self.cond(st.test)
                    self.emit(("if not %s and %s:" % (err, cond)) if guarded else ("if %s:" % cond))
                    self.emit("    %s = %d" % (err, k + 1))
                    guarded = used = True
                    continue
                # 実行時に起きうる例外（0 で割る・math の範囲外）
                conds = []
                for exc_name, risk, _label in self.risks(st):
                    k = handler_for(exc_name)
                    if k is None:
                        continue                          # 受ける except がない（Maya ではノードの誤り）
                    c = self.risk_cond(risk, st)
                    if c is not None:
                        conds.append((c, k))
                simple = isinstance(st, (ast.Assign, ast.AugAssign, ast.AnnAssign, ast.Expr, ast.Return))
                if not simple and self.risky_inside(st, handler_for):
                    PC._fail("try の中の if・for などの中の、例外になりうる計算（0 で割る・raise など）は変換できません", st)
                if guarded:
                    self.emit("if not %s:" % err)        # 前の文で例外が起きていなければ
                    self.indent += 1
                m = len(self.lines)
                skippable = guarded or bool(conds)        # 例外の目印で飛ばされうる文は、実行時の if の中と同じ扱い
                if skippable:
                    self.frames.append("if")
                try:
                    if conds:
                        for n, (c, k) in enumerate(conds):
                            self.emit("%s %s:" % ("if" if n == 0 else "elif", c))
                            self.emit("    %s = %d" % (err, k + 1))
                        self.emit("else:")
                        self.indent += 1
                        n0 = len(self.lines)
                        self.stmt(st)
                        if len(self.lines) == n0:
                            self.emit("pass")
                        guarded = used = True
                    else:
                        self.stmt(st)
                        if len(self.lines) == m and self.indent > base:
                            self.emit("pass")
                finally:
                    if skippable:
                        self.frames.pop()
                    self.indent = base
        if not used or static_err is not None and not guarded:
            del self.lines[err_line]                      # 目印を使わない
        # except・else・finally
        if static_err is not None:
            self.block(s.handlers[static_err].body)
        elif used:
            for n, h in enumerate(s.handlers):
                self.emit("%s %s == %d:" % ("if" if n == 0 else "elif", err, n + 1))
                self.indent += 1
                m = len(self.lines)
                self.frames.append("if")
                try:
                    self.block(h.body)
                finally:
                    self.frames.pop()
                if len(self.lines) == m:
                    self.emit("pass")
                self.indent -= 1
            if s.orelse:
                self.emit("else:")
                self.indent += 1
                self.frames.append("if")
                try:
                    self.block(s.orelse)
                finally:
                    self.frames.pop()
                self.indent -= 1
        else:
            self.block(s.orelse)
        self.block(s.finalbody)

    # ---- None と、変換の時点で決まる条件（def f(x, max=None): … if max is not None: … など）
    @staticmethod
    def const_of(code: str) -> Optional[float]:
        """式が定数だけでできていれば、その値（(3 < 3)・(2 * 0.5) など）。そうでなければ None"""
        try:
            return float(code)
        except (TypeError, ValueError):
            pass
        try:
            v = _fold(ast.parse(code, mode="eval").body)
        except (SyntaxError, ValueError, TypeError, ZeroDivisionError, OverflowError):
            return None
        return None if v is None or isinstance(v, complex) else float(v)

    def truth(self, v, node) -> str:
        """条件に使う値の式（None は偽。文字列・辞書は空なら偽）"""
        if v.kind == "none":
            return "0"
        if v.kind == "str":
            if v.extra.get("s") is None:
                PC._fail("中身が変換の時点で決まらない文字列を条件に使っています", node)
            return "1" if v.extra["s"] else "0"
        if v.kind == "dict":
            return "1" if v.extra["items"] else "0"
        if v.extra.get("items") is not None:
            return "1" if v.extra["items"] else "0"
        if v.kind == "obj":
            return "1"
        if v.kind == "unit":
            return v.code
        if v.kind != "num":
            PC._fail("条件に数以外（%s）を使っています" % v.kind, node)
        return v.code

    def cond(self, t) -> str:
        return self.truth(self.expr(t), t)

    def known_cond(self, test) -> Optional[bool]:
        """条件が変換の時点で決まれば真偽（None・is None・定数）。決まらなければ None（途中で書いた文は消す）"""
        n = len(self.lines)
        try:
            c = self.const_of(self.cond(test))
        except PC.ConvertError:
            c = None
        if c is None:
            del self.lines[n:]
            return None
        return bool(c)

    def if_branches(self, s, body, orelse, tail: bool):
        known = self.known_cond(s.test)
        if known is not None:
            self.block(body if known else orelse, tail=tail)
            return
        self.frames.append("if")
        try:
            return super().if_branches(s, body, orelse, tail)
        finally:
            self.frames.pop()

    def none_expr(self, e):
        """None がかかわる式（None・is / is not / == / !=・not・and / or）。かかわらなければ None"""
        if isinstance(e, ast.Constant) and e.value is None:
            return PC.Value("none", "None")
        if isinstance(e, ast.Compare) and any(self.is_text(x) for x in [e.left] + e.comparators):
            return self.const_compare(e)
        if isinstance(e, ast.Compare) and len(e.ops) == 1 and isinstance(e.ops[0], (ast.In, ast.NotIn)) and (
                self.dict_of(e.comparators[0]) is not None):
            d = self.dict_of(e.comparators[0])
            try:
                has = self.dict_key(e.left, e) in d.extra["items"]
                code = "1" if has else "0"
            except _Dynamic:
                k = self.num_code(self.expr(e.left), e)
                nums = [x for x in d.extra["items"] if isinstance(x, (int, float))]
                code = "(%s)" % " or ".join("(%s == %s)" % (k, PC._num_text(x)) for x in nums) if nums else "0"
            return PC.Value("num", code if isinstance(e.ops[0], ast.In) else "(not %s)" % code)
        if isinstance(e, ast.Compare) and len(e.ops) == 1 and isinstance(e.ops[0], (ast.Is, ast.IsNot, ast.Eq, ast.NotEq)):
            a, b = self.expr(e.left), self.expr(e.comparators[0])
            if a.kind == "none" or b.kind == "none":
                same = a.kind == b.kind
                return PC.Value("num", "1" if same == isinstance(e.ops[0], (ast.Is, ast.Eq)) else "0")
            if isinstance(e.ops[0], (ast.Is, ast.IsNot)):
                PC._fail("is・is not は None との比較だけ変換できます", e)
            return PC.Value("num", "(%s %s %s)" % (self.num_code(a, e), "==" if isinstance(e.ops[0], ast.Eq) else "!=",
                                                   self.num_code(b, e)))
        if isinstance(e, ast.Compare) and len(e.ops) == 1 and isinstance(e.ops[0], (ast.In, ast.NotIn)):
            items = self.static_items(e.comparators[0])
            if items is None:
                PC._fail("in・not in は、IN・タプル・リスト・range に対してだけ変換できます", e)
            a = self.num_code(self.expr(e.left), e)
            parts = ["(%s == %s)" % (a, self.num_code(v, e)) for v in self.flat(items, e)]
            code = "(%s)" % " or ".join(parts) if parts else "0"
            return PC.Value("num", code if isinstance(e.ops[0], ast.In) else "(not %s)" % code)
        if isinstance(e, ast.IfExp):
            known = self.known_cond(e.test)
            if known is not None:
                return self.expr(e.body if known else e.orelse)   # 通らない側は変換しない
            return None
        if isinstance(e, ast.UnaryOp) and isinstance(e.op, ast.Not):
            v = self.expr(e.operand)
            c = self.const_of(self.truth(v, e))
            if c is not None:
                return PC.Value("num", "0" if c else "1")
            return PC.Value("num", "(not %s)" % v.code)
        if isinstance(e, ast.BoolOp):
            is_and = isinstance(e.op, ast.And)
            parts = []
            for x in e.values:                           # 前から順に（決まった時点で残りは読まない。Python と同じ）
                code = self.truth(self.expr(x), x)
                c = self.const_of(code)
                if c is not None:
                    if bool(c) != is_and:
                        if not parts:
                            return PC.Value("num", code)     # 決まった値（a or b の a が真なら a）
                        parts.append(code)                    # x or 1.0: x が偽なら 1.0（ここで終わる）
                        break
                    if x is e.values[-1]:
                        parts.append(code)               # 最後の値は、そのまま結果
                    continue
                parts.append(code)
            if not parts:
                return PC.Value("num", "1" if is_and else "0")
            return PC.Value("num", parts[0] if len(parts) == 1 else
                            "(%s)" % (" and " if is_and else " or ").join(parts))
        return None

    _STR_METHODS = {"upper", "lower", "strip", "lstrip", "rstrip", "replace", "format", "title", "capitalize", "zfill",
                    "join"}

    def is_text(self, node) -> bool:
        """文字列の式か。式を変換せず、書き方の形だけで見る（文字列・f 文字列・文字列の変数・その + / % /
        添字・str()・文字列のメソッド・文字列を含むタプル）"""
        if isinstance(node, _Pre):
            return node.value.kind == "str"
        if isinstance(node, (ast.Constant, ast.JoinedStr)):
            return isinstance(node, ast.JoinedStr) or isinstance(node.value, str)
        if isinstance(node, ast.Name):
            return node.id in self.env and self.env[node.id].kind == "str"
        if isinstance(node, (ast.Tuple, ast.List, ast.Set)):
            return any(self.is_text(x) for x in node.elts)
        if isinstance(node, ast.BinOp):
            return self.is_text(node.left)
        if isinstance(node, ast.Subscript):
            return self.is_text(node.value)
        if isinstance(node, ast.Call):
            f = node.func
            if isinstance(f, ast.Name):
                return f.id == "str" and f.id not in self.env
            return isinstance(f, ast.Attribute) and f.attr in self._STR_METHODS and self.is_text(f.value)
        return False

    def const_compare(self, e: ast.Compare):
        """文字列を含む比較（==・!=・<・in など）を変換の時点で行う。中身が決まらない値と比べるときは、
        種類の違い（文字列と数）だけで決まる == / != に限る"""
        def value(node):
            if isinstance(node, (ast.Tuple, ast.List, ast.Set)):
                return tuple(value(x) for x in node.elts)
            d = self.dict_of(node)
            if d is not None:
                return tuple(d.extra["items"])
            v = self.expr(node)
            try:
                return self.py_const(v)
            except _Dynamic:
                return _UNKNOWN_STR if v.kind == "str" else _UNKNOWN
        vals = [value(x) for x in [e.left] + e.comparators]
        result = True
        for op, a, b in zip(e.ops, vals, vals[1:]):
            if _UNKNOWN in (a, b) or _UNKNOWN_STR in (a, b):
                str_a, str_b = isinstance(a, str) or a is _UNKNOWN_STR, isinstance(b, str) or b is _UNKNOWN_STR
                if isinstance(op, (ast.Eq, ast.NotEq)) and str_a != str_b:
                    ok = isinstance(op, ast.NotEq)       # 文字列と数は等しくない
                else:
                    PC._fail("中身が変換の時点で決まらない値と文字列を比べています", e)
            else:
                ops = {ast.Eq: lambda x, y: x == y, ast.NotEq: lambda x, y: x != y, ast.Lt: lambda x, y: x < y,
                       ast.LtE: lambda x, y: x <= y, ast.Gt: lambda x, y: x > y, ast.GtE: lambda x, y: x >= y,
                       ast.In: lambda x, y: x in y, ast.NotIn: lambda x, y: x not in y,
                       ast.Is: lambda x, y: x is y if x is None or y is None else x == y,
                       ast.IsNot: lambda x, y: x is not y if x is None or y is None else x != y}
                try:
                    ok = ops[type(op)](a, b)
                except TypeError:
                    PC._fail("比べられない値どうしを比べています", e)
            result = result and ok
        return PC.Value("num", "1" if result else "0")

    def num_code(self, v, node) -> str:
        if v.kind not in ("num", "unit"):
            PC._fail("数以外（%s）を比べています" % v.kind, node)
        return v.code

    # ---- 関数（呼び出したところに展開する）
    def define(self, name: str, args: ast.arguments, body, is_lambda: bool, node):
        if args.vararg or args.kwarg or args.kwonlyargs or args.posonlyargs:
            PC._fail("関数 %s の引数の書き方（*args・**kwargs・キーワード専用の引数）は変換できません" % name, node)
        if not is_lambda:
            for x in ast.walk(ast.Module(body=body, type_ignores=[])):
                if isinstance(x, (ast.Global, ast.Nonlocal)):
                    PC._fail("関数 %s の中の global・nonlocal は変換できません" % name, x)
        params = [a.arg for a in args.args]
        defaults = dict(zip(params[len(params) - len(args.defaults):], args.defaults))   # 引数の名前 → 既定値の式
        self.funcs[name] = (params, body, is_lambda, defaults)
        self.env.pop(name, None)

    def call(self, e):
        f = e.func
        if isinstance(f, (ast.Name, ast.Attribute)):
            alias = self.alias_target(f)
            if alias is not None:                         # _vec(x, y, z) → api.MVector(x, y, z)
                return self.call(ast.copy_location(ast.Call(func=alias, args=e.args, keywords=e.keywords), e))
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == "IN" and f.attr == "get":
            if not e.args or len(e.args) > 2 or e.keywords:
                PC._fail("IN.get(番号[, 既定値]) の形で書いてください", e)
            try:
                k = self.index_of(e.args[0], "IN.get")
            except _Dynamic:
                return self.dynamic_input(e.args[0], e.args[1] if len(e.args) > 1 else None, e)
            if k in self.in_kinds:
                return self.input_value(k, e)
            if len(e.args) < 2:
                return PC.Value("none", "None")          # 接続も値もない入力（Python と同じく None）
            return self.expr(e.args[1])
        if isinstance(f, ast.Name) and f.id in self.funcs and f.id not in self.env:
            return self.inline(f.id, e)
        if isinstance(f, ast.Name) and f.id in self.classes and f.id not in self.env:
            return self.instantiate(f.id, e)
        if isinstance(f, ast.Name) and f.id == "isinstance" and len(e.args) == 2 and "isinstance" not in self.env:
            obj = self.obj_of(e.args[0])
            names = [x.id for x in (e.args[1].elts if isinstance(e.args[1], ast.Tuple) else [e.args[1]])
                     if isinstance(x, ast.Name)]
            cls = obj.extra["cls"] if obj is not None else None
            chain = []
            while cls is not None:
                chain.append(cls)
                cls = self.classes[cls]["base"]
            return PC.Value("num", "1" if set(chain) & set(names) else "0")
        if isinstance(f, ast.Name) and f.id not in self.env and self.undefined(f.id):
            return self.name_error(f.id, e)                # 定義のない関数（打ち間違いなど）
        v = self.method_call(e)
        if v is not None:
            return v
        v = self.text_or_dict_call(e)
        if v is not None:
            return v
        if isinstance(f, ast.Name) and f.id not in self.env:
            v = self.builtin(f.id, e)
            if v is not None:
                return v
        return super().call(e)

    def text_or_dict_call(self, e: ast.Call):
        """str()・dict()・文字列のメソッド・辞書のメソッド。対象外なら None"""
        f = e.func
        if isinstance(f, ast.Name) and f.id not in self.env:
            if f.id == "str" and len(e.args) == 1:
                v = self.expr(e.args[0])
                try:
                    x = self.py_const(v)
                    return self.str_value(x if isinstance(x, str) else repr(x) if isinstance(x, float) else str(x))
                except _Dynamic:
                    return self.str_value(None)
            if f.id == "dict" and len(e.args) <= 1:
                items = {}
                if e.args:
                    src = self.dict_of(e.args[0])
                    pairs = list(src.extra["items"].items()) if src is not None else None
                    if pairs is None:
                        seq = self.static_items(e.args[0])
                        if seq is None:
                            PC._fail("dict(…) は辞書・(キー, 値) の並び・名前つきの引数から作れます", e)
                        pairs = [(self.py_const(k), v) for k, v in seq]
                    for k, v in pairs:
                        items[k] = self.dict_slot(v, e)
                for kw in e.keywords:
                    items[kw.arg] = self.dict_slot(self.expr(kw.value), e)
                return PC.Value("dict", "", items=items)
            if f.id == "len" and len(e.args) == 1:
                d = self.dict_of(e.args[0])
                if d is not None:
                    return PC.Value("num", str(len(d.extra["items"])))
                if self.is_text(e.args[0]):
                    return PC.Value("num", str(len(self.str_of(e.args[0]))))
            if f.id == "print":
                return PC.Value("none", "None")
            return None
        if not isinstance(f, ast.Attribute):
            return None
        d = self.dict_of(f.value)
        if d is not None:
            items = d.extra["items"]
            if f.attr == "get" and 1 <= len(e.args) <= 2:
                default = self.expr(e.args[1]) if len(e.args) > 1 else None
                return self.dict_get(d, e.args[0], default, e, strict=False)
            if f.attr in ("pop", "setdefault") and e.args:
                key = self.dict_key(e.args[0], e)
                if key in items:
                    v = items[key]
                    if f.attr == "pop":
                        del items[key]
                    return v
                if len(e.args) < 2:
                    if f.attr == "setdefault":
                        items[key] = PC.Value("none", "None")
                        return items[key]
                    PC._fail("辞書にキー %r がありません（KeyError）" % (key,), e)
                v = self.dict_slot(self.expr(e.args[1]), e)
                if f.attr == "setdefault":
                    items[key] = v
                return v
            if f.attr == "update":
                src = self.dict_of(e.args[0]) if e.args else None
                if e.args and src is None:
                    PC._fail("update には辞書を渡してください", e)
                for k, v in (list(src.extra["items"].items()) if src is not None else []) + [
                        (kw.arg, self.expr(kw.value)) for kw in e.keywords]:
                    self.dict_assign(ast.copy_location(ast.Subscript(value=_Pre(d), slice=_Pre(self.key_value(k)),
                                                                     ctx=ast.Store()), e), _Pre(v), e)
                return PC.Value("none", "None")
            if f.attr == "copy" and not e.args:
                return PC.Value("dict", "", items={k: self.dict_slot(v, e) for k, v in items.items()})
            if f.attr in ("keys", "values", "items"):
                PC._fail("辞書の %s() は for・list・len などの中で使ってください" % f.attr, e)
            PC._fail("辞書の %s は変換できません" % f.attr, e)
        if self.is_text(f.value):
            text = self.str_of(f.value)
            args = [self.py_const(self.expr(a)) for a in e.args]
            kw = {k.arg: self.py_const(self.expr(k.value)) for k in e.keywords}
            if f.attr in ("upper", "lower", "strip", "lstrip", "rstrip", "startswith", "endswith", "replace", "format",
                          "split", "join", "find", "count", "isdigit", "title", "capitalize", "zfill"):
                try:
                    r = getattr(text, f.attr)(*args, **kw)
                except (TypeError, ValueError, IndexError, KeyError) as exc:
                    PC._fail("文字列の %s を計算できません（%s）" % (f.attr, exc), e)
                if isinstance(r, bool):
                    return PC.Value("num", "1" if r else "0")
                if isinstance(r, int):
                    return PC.Value("num", str(r))
                if isinstance(r, list):
                    PC._fail("文字列の split の結果は、変換の時点の並びとしては使えません", e)
                return self.str_value(r)
            PC._fail("文字列の %s は変換できません" % f.attr, e)
        return None

    def builtin(self, name: str, e: ast.Call):
        """並びを受け取る組み込み関数（sum・len・min・max・any・all・list・tuple）。対象外なら None"""
        if name not in ("sum", "len", "min", "max", "any", "all", "list", "tuple") or e.keywords:
            return None
        if name in ("min", "max") and len(e.args) != 1:
            return None                                   # min(a, b) はそのまま
        if not e.args:
            return None
        items = self.static_items(e.args[0])
        if items is None:
            if name in ("len", "sum", "any", "all"):
                PC._fail("%s は、IN・タプル・リスト・range・内包表記に対してだけ変換できます" % name, e)
            return None
        if name == "len":
            return PC.Value("num", str(len(items)))
        vals = self.flat(items, e)
        if name in ("list", "tuple"):
            return PC.Value("vec", "[%s]" % ", ".join(self.num_code(v, e) for v in vals))
        codes = [self.num_code(v, e) for v in vals]
        if name == "sum":
            start = self.num_code(self.expr(e.args[1]), e) if len(e.args) > 1 else "0"
            return PC.Value("num", "(%s)" % " + ".join([start] + codes))
        if name in ("min", "max"):
            if not codes:
                PC._fail("%s に空の並びを渡しています" % name, e)
            return PC.Value("num", codes[0] if len(codes) == 1 else "%s(%s)" % (name, ", ".join(codes)))
        if not codes:
            return PC.Value("num", "1" if name == "all" else "0")
        return PC.Value("num", "(%s)" % (" and " if name == "all" else " or ").join("bool(%s)" % c for c in codes))

    def call_stmt(self, c):
        if isinstance(c.func, ast.Name) and c.func.id in self.funcs and c.func.id not in self.env:
            self.inline(c.func.id, c)
            return
        if isinstance(c.func, ast.Attribute) and self.dict_of(c.func.value) is not None:
            self.text_or_dict_call(c)                     # d.update(…)・d.pop(…) など
            return
        if self.method_call(c) is not None:               # obj.method(…)・リストの append など
            return
        if isinstance(c.func, ast.Name) and c.func.id in self.classes and c.func.id not in self.env:
            self.instantiate(c.func.id, c)
            return
        return super().call_stmt(c)

    RECURSION_LIMIT = 16        # 再帰を展開する深さ（越えると、実行時にそこへ来たら計算の誤り）
    INLINE_LIMIT = 2000         # 1 つのコードで関数を展開する回数の上限（再帰の展開が大きくなりすぎないように）

    def inline(self, name: str, e: ast.Call, func=None, bound=()):
        """関数を呼び出したところに展開する。func は (引数, 本体, lambda か, 既定値)（省略時は名前で引く）。
        bound は先に入れる引数の値（メソッドの self）"""
        params, body, is_lambda, defaults = func or self.funcs[name]
        self.inline_count = getattr(self, "inline_count", 0) + 1
        if self.inline_count > self.INLINE_LIMIT:
            PC._fail("関数の展開が大きすぎます（%d 回まで。枝分かれする再帰など）" % self.INLINE_LIMIT, e)
        if self.inlining.count(name) >= self.RECURSION_LIMIT:
            # 実行時に決まる深さの再帰: ここまで来たら計算の誤り（0 で割る）にして、黙って違う値を出さない
            self.notes.append("%d 行目: 再帰 %s は %d 段まで展開します（それより深いと、そのフレームは計算の誤りになります）"
                              % (e.lineno, name, self.RECURSION_LIMIT))
            return PC.Value("num", "(1 / 0)")
        if len(e.args) + len(bound) > len(params) or any(isinstance(a, ast.Starred) for a in e.args):
            PC._fail("関数 %s の引数が多すぎます（%d 個まで）" % (name, len(params) - len(bound)), e)
        nodes = dict(zip(params[len(bound):], e.args))
        for kw in e.keywords:
            if kw.arg is None or kw.arg not in params:
                PC._fail("関数 %s に引数 %s はありません" % (name, kw.arg or "**"), e)
            if kw.arg in nodes:
                PC._fail("関数 %s の引数 %s を 2 回渡しています" % (name, kw.arg), e)
            nodes[kw.arg] = kw.value
        for p in params[len(bound):]:
            if p not in nodes:
                if p not in defaults:
                    PC._fail("関数 %s の引数 %s がありません" % (name, p), e)
                nodes[p] = defaults[p]                   # 既定値（数・None など）
        args = list(bound) + [self.tracked(nodes[p]) for p in params[len(bound):]]   # [..] はリストとして渡す
        saved_env, saved_names = self.env, self.names
        stored = set() if is_lambda else set(_scope_stores(body))     # 関数の中で値を入れる名前
        local_names = set(params) | stored
        self.env = {k: v for k, v in saved_env.items() if k not in local_names}
        self.names = dict(saved_names)
        for n in sorted(local_names):
            self.names[n] = self.fresh(n.strip("_") or "v")
        self.inlining.append(name)
        self.frames.append("func")
        try:
            for p, v in zip(params, args):
                var = self.names[p]
                if v.kind == "tm":
                    v = self.tm_matrix(v)
                if v.kind in ("none", "str", "dict", "obj", "list") or self.is_list(v):
                    self.env[p] = v                      # 変換の時点で追う値（辞書・リスト・オブジェクトは Python と同じく共有）
                    continue
                if v.kind not in ("num", "unit", "vec", "pt", "mat", "quat", "eul"):
                    PC._fail("関数 %s に渡せない値（%s）を渡しています" % (name, v.kind), e)
                if v.kind in ("num", "unit") and p not in stored and self.const_of(v.code) is not None:
                    self.env[p] = PC.Value("num", v.code)    # 書き換えない定数の引数は定数のまま（range(n) の展開・条件の畳み込み）
                    continue
                self.emit("%s = %s" % (var, v.code))
                self.env[p] = PC.Value("num" if v.kind == "unit" else v.kind, var, **v.extra)
            if is_lambda:
                return self.expr(body)
            return self.function_body(name, body)
        finally:
            self.frames.pop()
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
                    known = self.known_cond(s.test)
                    if known is not None:
                        run(body if known else orelse)
                        return
                    self.emit("if %s:" % self.cond(s.test))
                    self.frames.append("if")
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
                    self.frames.pop()
                    return
                if _has_return(s):
                    # ループ（try など）の中の return: 戻った目印を置き、抜けたあとの文は戻っていなければ
                    done = self.fresh("done")
                    self.emit("%s = 0" % done)
                    fr = {"kind": "ret", "ret": ret, "done": done, "name": "__%s" % done}
                    self.frames.append(fr)
                    try:
                        self.stmt(s)
                    finally:
                        self.frames.remove(fr)
                    rest = list(block[k + 1:])
                    if rest:
                        self.emit("if not %s:" % done)
                        self.indent += 1
                        n = len(self.lines)
                        run(rest)
                        if len(self.lines) == n:
                            self.emit("pass")
                        self.indent -= 1
                    return
                self.stmt(s)
        run(list(stmts))
        if ret.get("const") is not None:
            return ret["const"]
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
        if v.kind in ("none", "str", "dict", "obj", "list") or v.extra.get("items") is not None:
            last_func = len(self.frames) - 1 - self.frames[::-1].index("func")
            if "var" in ret or ret.get("const") is not None or "if" in self.frames[last_func:]:
                PC._fail("実行時の分かれ道で、None・文字列・辞書を返しています（変換できません）", s)
            ret["const"] = v
            return
        if ret.get("const") is not None:
            PC._fail("return の値の種類が違います（%s と %s）" % (ret["const"].kind, v.kind), s)
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
    tr = ExprespyTranslator(tree, in_kinds, api, out_connected)
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
    ms.exprespy_unused = []
    if not nodes:
        return defs, ok, problems
    # 出力（.o[n]）の先が使われていない exprespy（どこにもつながっていない・使われていない exprespy にだけ
    # つながっている）は、変換も警告もしない（計算の結果を使うものがない）
    dests: Dict[int, list] = {id(n): [] for n in nodes}
    for src, sattr, dst, _dattr in ms.connections:
        if src.type == TYPE and id(src) in dests:
            io = io_plug(sattr)
            if io is not None and io[0] == "o":
                dests[id(src)].append(dst)
    unused = {id(n) for n in nodes if not dests[id(n)]}
    changed = True
    while changed:
        changed = False
        for n in nodes:
            if id(n) not in unused and all(d.type == TYPE and id(d) in unused for d in dests[id(n)]):
                unused.add(id(n))
                changed = True
    ms.exprespy_unused = [n.name for n in nodes if id(n) in unused]
    nodes = [n for n in nodes if id(n) not in unused]
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
            return ExprespyResult(nd, nd.out_kinds, nd.notes)
        nd, out_kinds, notes = translate(code, in_kinds, out_connected.get(id(n), ()), type_name=key,
                                         source="exprespy %s" % n.name)
        nd.out_kinds = out_kinds
        nd.notes = notes
        defs[key] = nd
        return ExprespyResult(nd, out_kinds, notes)

    used = set()
    notes_of: Dict[str, List[str]] = {}
    ms.exprespy_notes = notes_of                         # ノード名 → 変換の注意（再帰の深さ・ない番号は 0 など）
    for n in nodes:
        res = convert(n)
        if res is None:
            continue
        n.node_def = res.node_def
        used.add(id(n))
        ok.append(n.name)
        if res.notes:
            notes_of[n.name] = res.notes
    # 変換できなかったノードの理由は、変換できたノードの分を除く（循環の検出で先に入ったもの）
    for name in ok:
        problems.pop(name, None)
    ND.rename_plugs(ms, used)
    return defs, ok, problems
