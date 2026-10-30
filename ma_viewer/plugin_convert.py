# -*- coding: utf-8 -*-
"""Python のノードプラグイン（.py）を、自作ノードの定義（node_defs）に変換する。ツールの配布者が一度だけ使う。

  python -m ma_viewer convert-plugin myPlugin.py -o ma_viewer/node_defs/myPlugin.json

プラグインのコードは実行しない。Python の構文解析（ast）で次のものを読み、定義の計算（人が読める Python の書き方の
一部。docs/node_definitions.md）に書き換える。書き換えた計算は node_defs の検証にかけてから書き出す。
  * 登録: initializePlugin の registerNode(型の名前, id, 作成の関数, 初期化の関数)（ループで登録していてもよい）
  * 属性: 初期化の関数の MFnNumericAttribute・MFnUnitAttribute・MFnMatrixAttribute・MFnCompoundAttribute・
    MFnEnumAttribute の create / createPoint / createColor、array・writable・default の設定（API 2.0 のプロパティと
    API 1.0 の setArray など）、addChild、attributeAffects（影響を受ける属性を出力とする）
  * 計算: compute の inputValue / inputArrayValue / outputValue / outputArrayValue、配列の要素のたどり方
    （物理番号・論理番号・next）、子の属性（child）、値の取り出し（asDouble・asAngle・asMatrix など）、
    出力への書き込み（setDouble・set3Double・setMMatrix・setMAngle・MArrayDataBuilder など）、
    MVector・MPoint・MMatrix・MTransformationMatrix・MEulerRotation・MQuaternion・MAngle の主な演算、math の関数
  * plug による出し分け（if plug == …）は、すべての出力を計算するものとして扱う
変換できない書き方（self の状態・cmds・途中の return・while など）は、行番号つきで報告し、そのノードは書き出さない。
API 2.0（maya.api.OpenMaya）と API 1.0（maya.OpenMaya・OpenMayaMPx）のどちらでもよい（モジュール名は見ない）。
"""
from __future__ import annotations

import ast
import keyword
import os
from typing import Dict, List, Optional, Tuple

from . import node_defs as ND

VERSION = "1.0"


class ConvertError(Exception):
    def __init__(self, msg: str, node=None):
        super().__init__(msg)
        self.line = getattr(node, "lineno", 0) or 0


class _Cascade(ConvertError):
    """変換できなかった文で値を入れた変数を使った（その文の誤りは報告済みなので、重ねて報告しない）"""


def _fail(msg: str, node=None):
    raise ConvertError(msg, node)


def _const(node):
    """数・文字列・真偽の定数（なければ None）"""
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float, str, bool)):
        return node.value
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
        v = _const(node.operand)
        return -v if isinstance(v, (int, float)) and not isinstance(v, bool) else None
    return None


def _tail(node) -> Optional[str]:
    """om.MFnNumericData.kDouble → kDouble、MVector → MVector（モジュール名・クラス名は見ない）"""
    if isinstance(node, ast.Attribute):
        return node.attr
    if isinstance(node, ast.Name):
        return node.id
    return None


def _num_text(v) -> str:
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, float) and v == int(v) and abs(v) < 1e15:
        return "%.1f" % v
    return repr(v)


# ---------------------------------------------------------------------------
# 属性
# ---------------------------------------------------------------------------

_NUMERIC_TYPES = {
    "kDouble": "double", "kFloat": "float", "kInt": "int", "kLong": "int", "kShort": "int", "kByte": "int",
    "kChar": "int", "kBoolean": "bool", "kInt64": "int",
    "k3Double": "vector", "k3Float": "vector", "k3Int": "vector", "k3Long": "vector", "k3Short": "vector",
    "k2Double": "double2", "k2Float": "double2", "k2Int": "double2", "k2Long": "double2", "k2Short": "double2",
    "k4Double": "double4",
}
_UNIT_TYPES = {"kAngle": "angle", "kDistance": "distance", "kTime": "time"}


class AttrInfo:
    def __init__(self, long: str, short: str, typ: str, line: int):
        self.long = long
        self.short = short
        self.type = typ                          # node_defs の型。扱えない属性は "unsupported:理由"
        self.array = False
        self.writable = True
        self.default = None
        self.children: List["AttrInfo"] = []     # compound の子・ベクトルの成分の属性
        self.parent: Optional["AttrInfo"] = None
        self.line = line
        self.component_of: Optional["AttrInfo"] = None

    @property
    def supported(self) -> bool:
        return not self.type.startswith("unsupported")

    def spec(self, outputs) -> dict:
        out = {"name": self.long, "short": self.short, "type": self.type}
        if self.array:
            out["array"] = True
        if self in outputs and self.parent is None:
            out["output"] = True
        if self.type == "compound":
            out["children"] = [c.spec(outputs) for c in self.children if c.supported]
        elif self.type in ND.VECTOR_TYPES and self.children:
            out["children"] = [{"name": c.long, "short": c.short} for c in self.children]
        d = self.default_value()
        if d is not None:
            out["default"] = d
        return out

    def default_value(self):
        d = self.default
        if self.type in ND.VECTOR_TYPES:
            n = ND.VECTOR_TYPES[self.type]
            if isinstance(d, (list, tuple)) and len(d) == n and all(isinstance(x, (int, float)) for x in d):
                return [float(x) for x in d] if any(d) else None
            if self.children and d is None:
                vals = [c.default if isinstance(c.default, (int, float)) else 0.0 for c in self.children]
                return [float(v) for v in vals] if any(vals) else None
            if isinstance(d, (int, float)):
                return [float(d)] * n if d else None
            return None
        if self.type in ("matrix", "compound") or not isinstance(d, (int, float)):
            return None
        if self.type == "angle":
            import math
            return round(math.degrees(d), 9) if d else None   # 定義の既定値は度（create の既定値はラジアン）
        return float(d) if d else None


class FnState:
    """MFn…Attribute の関数セットの変数（最後に create した属性に設定が当たる）"""

    def __init__(self, kind: str):
        self.kind = kind
        self.current: Optional[AttrInfo] = None


_FN_KINDS = {"MFnNumericAttribute": "numeric", "MFnUnitAttribute": "unit", "MFnMatrixAttribute": "matrix",
             "MFnCompoundAttribute": "compound", "MFnEnumAttribute": "enum", "MFnTypedAttribute": "typed",
             "MFnMessageAttribute": "message", "MFnGenericAttribute": "generic", "MFnLightDataAttribute": "light"}


class AttrScanner:
    """初期化の関数から属性を読む"""

    def __init__(self, module: "ModuleInfo", cls: Optional[ast.ClassDef]):
        self.module = module
        self.cls = cls
        self.attrs: Dict[str, AttrInfo] = {}     # 参照の名前（クラスの属性名・変数名）→ 属性
        self.order: List[AttrInfo] = []
        self.added: List[AttrInfo] = []
        self.affects: List[Tuple[AttrInfo, AttrInfo]] = []
        self.fns: Dict[str, FnState] = {}
        self.local: Dict[str, AttrInfo] = {}
        self.notes: List[str] = []
        self.in_class = False                    # クラスの直下の文を読んでいる
        self.returns: Optional[List[AttrInfo]] = None   # 補助の関数を読んでいるとき、return した属性
        self.depth = 0

    def fn_of(self, node) -> Optional[FnState]:
        """nAttr・cls.nAttr・self.nAttr・Cls.nAttr・om.MFnEnumAttribute() → 関数セット（クラスの直下のものは @名前）"""
        if isinstance(node, ast.Name):
            return self.fns.get(node.id)
        if isinstance(node, ast.Attribute):
            return self.fns.get("@" + node.attr)
        kind = self.fn_kind(node)
        if kind:
            return FnState(kind)                         # その場で作った関数セット
        return None

    def scan_class(self, cls: ast.ClassDef):
        """クラスの直下の文（nAttr = om.MFnNumericAttribute()、aIn = nAttr.create(…) など）"""
        self.in_class = True
        try:
            self.block([st for st in cls.body if not isinstance(st, (ast.FunctionDef, ast.ClassDef))], {})
        finally:
            self.in_class = False

    def name_value(self, node, env=None):
        """属性の名前など: 定数・モジュールの定数・クラスの定数（Cls.kName・cls.kName・self.kName）・
        補助の関数の引数・ループの変数、文字列の + と f 文字列"""
        v = _const(node)
        if v is not None:
            return v
        if isinstance(node, ast.Name) and env and node.id in env and not isinstance(env[node.id], AttrInfo):
            return env[node.id]
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Add):
            a, b = self.name_value(node.left, env), self.name_value(node.right, env)
            if isinstance(a, str) and isinstance(b, str):
                return a + b
            if isinstance(a, (int, float)) and isinstance(b, (int, float)):
                return a + b
            return None
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and not node.args \
                and node.func.attr in ("lower", "upper", "capitalize", "title"):
            base = self.name_value(node.func.value, env)    # "X".lower() など
            return getattr(base, node.func.attr)() if isinstance(base, str) else None
        if isinstance(node, ast.IfExp):
            test = self.name_value(node.test, env)
            if test is None:
                return None
            return self.name_value(node.body if test else node.orelse, env)
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Mod):
            fmt = self.name_value(node.left, env)
            items = node.right.elts if isinstance(node.right, ast.Tuple) else [node.right]
            vals = [self.name_value(x, env) for x in items]
            if isinstance(fmt, str) and all(v is not None for v in vals):
                try:
                    return fmt % tuple(vals)
                except (TypeError, ValueError):
                    return None
            return None
        if isinstance(node, ast.JoinedStr):
            out = []
            for part in node.values:
                v = self.name_value(part.value if isinstance(part, ast.FormattedValue) else part, env)
                if v is None:
                    return None
                out.append(str(v))
            return "".join(out)
        if isinstance(node, ast.Name):
            if node.id in self.module.consts:
                return self.module.consts[node.id]
            if self.in_class and self.cls is not None:
                return self.module.class_constant(self.cls.name, node.id)
            return None
        if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
            owner = node.value.id
            if owner in self.module.classes:
                return self.module.class_constant(owner, node.attr)
            if self.cls is not None:
                return self.module.class_constant(self.cls.name, node.attr)
        return None

    def ref(self, node, env) -> Optional[AttrInfo]:
        """Cls.aX・self.aX・aX → 属性"""
        if isinstance(node, ast.Name):
            if node.id in env:
                v = env[node.id]
                return v if isinstance(v, AttrInfo) else None
            return self.local.get(node.id) or self.attrs.get(node.id)
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "getattr" \
                and len(node.args) >= 2:
            name = self.name_value(node.args[1], env)    # getattr(cls, "aWeight" + key)
            return self.attrs.get(name) if isinstance(name, str) else None
        if isinstance(node, ast.Attribute):
            return self.attrs.get(node.attr)
        return None

    def scan(self, fn: ast.FunctionDef):
        self.block(fn.body, {})

    def block(self, stmts, env):
        for s in stmts:
            self.stmt(s, env)

    def stmt(self, s, env):
        if isinstance(s, ast.Return) and self.returns is not None and s.value is not None:
            a = self.ref(s.value, env) or self.create(s.value, env) or self.helper_call(s.value, env)
            if a is not None:
                self.returns.append(a)
            return
        if isinstance(s, (ast.Assign, ast.AnnAssign)):
            targets = s.targets if isinstance(s, ast.Assign) else [s.target]
            value = s.value
            if value is None:
                return
            fn_kind = self.fn_kind(value)
            if fn_kind:
                for t in targets:
                    fn = FnState(fn_kind)
                    if isinstance(t, ast.Name):
                        self.fns[t.id] = fn
                        if self.in_class:
                            self.fns["@" + t.id] = fn    # メソッドの中からは cls.nAttr・self.nAttr で参照する
                    elif isinstance(t, ast.Attribute):
                        self.fns["@" + t.attr] = fn
                return
            attr = self.create(value, env) or self.helper_call(value, env)
            if attr is not None:
                for t in targets:
                    self.bind(t, attr)
                return
            # 設定: nAttr.array = True など（API 2.0 のプロパティ）
            for t in targets:
                if isinstance(t, ast.Attribute) and self.fn_of(t.value) is not None:
                    self.setting(self.fn_of(t.value), t.attr, value)
                    return
            # 属性の参照の別名（a = Cls.aX、Cls.aX = a）
            src = self.ref(value, env)
            if src is not None:
                for t in targets:
                    self.bind(t, src)
            return
        if isinstance(s, ast.Expr) and isinstance(s.value, ast.Call):
            self.call(s.value, env)
            return
        if isinstance(s, ast.For):
            # for a in (Cls.aX, …)・for name, short in (("weightA", "wa"), …): のループを、要素ごとに読む
            items = s.iter.elts if isinstance(s.iter, (ast.Tuple, ast.List)) else (
                self.module.tuples.get(s.iter.id) if isinstance(s.iter, ast.Name) else None)
            for it in items or []:
                bound = self.loop_bind(s.target, it, env)
                if bound is not None:
                    self.block(s.body, dict(env, **bound))
            return
        if isinstance(s, (ast.If, ast.Try, ast.With)):
            for part in ("body", "orelse", "finalbody"):
                self.block(getattr(s, part, []) or [], env)
            for h in getattr(s, "handlers", []) or []:
                self.block(h.body, env)

    def loop_bind(self, target, item, env) -> Optional[dict]:
        """ループの変数 → 属性か定数（分からなければ None）"""
        if isinstance(target, ast.Name):
            v = self.ref(item, env)
            if v is None:
                v = self.name_value(item, env)
            return None if v is None else {target.id: v}
        if isinstance(target, (ast.Tuple, ast.List)) and isinstance(item, (ast.Tuple, ast.List)) \
                and len(target.elts) == len(item.elts):
            out = {}
            for t, it in zip(target.elts, item.elts):
                b = self.loop_bind(t, it, env)
                if b is None:
                    return None
                out.update(b)
            return out
        return None

    def resolve_function(self, func) -> Optional[Tuple[ast.FunctionDef, bool]]:
        """補助の関数（cls.helper・Cls.helper・self.helper・helper）→ (関数, 最初の引数 cls / self を除くか)"""
        fn = None
        if isinstance(func, ast.Name):
            fn = self.module.functions.get(func.id)
            return (fn, False) if fn is not None else None
        if isinstance(func, ast.Attribute) and isinstance(func.value, ast.Name):
            owner = self.module.classes.get(func.value.id) or self.cls
            if owner is not None:
                fn = self.module.method(owner, func.attr)
        if fn is None:
            return None
        decorators = {_tail(d) for d in fn.decorator_list}
        return fn, "staticmethod" not in decorators

    def helper_call(self, value, env) -> Optional[AttrInfo]:
        """属性を作って返す補助の関数（cls._weight("weightA", "wa", 0.5) など）を、引数を当てはめて読む"""
        if not isinstance(value, ast.Call) or self.depth >= 8:
            return None
        found = self.resolve_function(value.func)
        if found is None:
            return None
        fn, drop_first = found
        params = [a.arg for a in fn.args.args]
        if drop_first and params:
            params = params[1:]                          # cls・self
        sub = {}
        defaults = fn.args.defaults
        for name, d in zip(params[len(params) - len(defaults):], defaults):
            v = self.name_value(d, env)
            if v is not None:
                sub[name] = v
        args = list(zip(params, value.args)) + [(k.arg, k.value) for k in value.keywords if k.arg in params]
        for name, arg in args:
            v = self.ref(arg, env)
            if v is None:
                v = self.name_value(arg, env)
            if v is not None:
                sub[name] = v
        saved = (self.fns, self.local, self.returns)
        self.fns, self.local, self.returns = dict(self.fns), {}, []
        self.depth += 1
        try:
            self.block(fn.body, sub)
            result = self.returns[-1] if self.returns else None
        finally:
            self.depth -= 1
            self.fns, self.local, self.returns = saved
        return result

    def bind(self, target, attr: AttrInfo):
        if isinstance(target, ast.Name) and self.in_class:
            self.attrs[target.id] = attr                 # クラスの直下: メソッドの中からは self.aIn・cls.aIn
        elif isinstance(target, ast.Name):
            self.local[target.id] = attr
            self.attrs.setdefault(target.id, attr)
        elif isinstance(target, ast.Attribute):
            self.attrs[target.attr] = attr

    @staticmethod
    def fn_kind(value) -> Optional[str]:
        if isinstance(value, ast.Call) and not value.args:
            return _FN_KINDS.get(_tail(value.func) or "")
        return None

    def create(self, value, env=None) -> Optional[AttrInfo]:
        """fn.create(…) / createPoint / createColor → 属性"""
        if not (isinstance(value, ast.Call) and isinstance(value.func, ast.Attribute)
                and self.fn_of(value.func.value) is not None):
            return None
        fn = self.fn_of(value.func.value)
        method = value.func.attr
        if method not in ("create", "createPoint", "createColor", "createAddr"):
            return None
        args = value.args
        long_name = self.name_value(args[0], env) if args else None
        short_name = self.name_value(args[1], env) if len(args) > 1 else None
        if not isinstance(long_name, str):
            _fail("属性の名前（%s）が分かりません。文字列か、モジュール・クラスの定数にしてください"
                  % (ast.unparse(args[0]) if args else "なし"), value)
        if not isinstance(short_name, str):
            if len(args) > 1:
                self.notes.append("%d 行目: 属性 %s の短い名前（%s）が分からないので、長い名前を使います（.ma で短い名前の接続が"
                                  "読めません）" % (value.lineno, long_name, ast.unparse(args[1])))
            short_name = long_name
        line = value.lineno
        kind = fn.kind
        if method in ("createPoint", "createColor"):
            a = AttrInfo(long_name, short_name, "vector", line)
            sfx = ("X", "Y", "Z") if method == "createPoint" else ("R", "G", "B")
            a.children = [AttrInfo(long_name + s, short_name + s, "double", line) for s in sfx]
        elif kind == "numeric":
            if len(args) >= 3 and self.ref(args[2], {}) is not None:
                kids = [self.ref(x, {}) for x in args[2:]]
                if any(k is None for k in kids) or len(kids) not in (2, 3, 4):
                    _fail("数の compound の子の属性が分かりません", value)
                a = AttrInfo(long_name, short_name, {2: "double2", 3: "vector", 4: "double4"}[len(kids)], line)
                if any(k.type == "angle" for k in kids) and len(kids) == 3:
                    a.type = "angle3"
                a.children = kids
            else:
                t = _tail(args[2]) if len(args) >= 3 else "kDouble"
                typ = _NUMERIC_TYPES.get(t or "")
                a = AttrInfo(long_name, short_name, typ or "unsupported:数の型 %s" % t, line)
                if typ in ND.VECTOR_TYPES:
                    # create(k3Double など) の成分の属性は、名前 + 0・1・2（createPoint は X・Y・Z）
                    n = ND.VECTOR_TYPES[typ]
                    a.children = [AttrInfo(long_name + s, short_name + s, "double", line) for s in "0123"[:n]]
                if len(args) >= 4:
                    a.default = self.default_of(args[3:], env)
        elif kind == "unit":
            t = _tail(args[2]) if len(args) >= 3 else None
            typ = _UNIT_TYPES.get(t or "")
            a = AttrInfo(long_name, short_name, typ or "unsupported:単位の型 %s" % t, line)
            if len(args) >= 4:
                a.default = self.name_value(args[3], env)
        elif kind == "matrix":
            a = AttrInfo(long_name, short_name, "matrix", line)
        elif kind == "compound":
            a = AttrInfo(long_name, short_name, "compound", line)
        elif kind == "enum":
            a = AttrInfo(long_name, short_name, "enum", line)
            if len(args) >= 3:
                a.default = self.name_value(args[2], env)
        elif kind == "typed":
            # MFnTypedAttribute: 行列（MFnData.kMatrix）だけ扱える
            t = _tail(args[2]) if len(args) >= 3 else None
            a = AttrInfo(long_name, short_name,
                         "matrix" if t == "kMatrix" else "unsupported:型つきの属性 %s（文字列・形状・配列のデータなど）" % t,
                         line)
        else:
            a = AttrInfo(long_name, short_name, "unsupported:%s の属性（メッセージなど）" % kind, line)
        for c in a.children:
            c.component_of = a
            c.parent = a
        fn.current = a
        self.order.append(a)
        return a

    def default_of(self, args, env=None):
        vals = [self.name_value(x, env) for x in args]
        if len(vals) == 1:
            return vals[0]
        return vals if all(isinstance(v, (int, float)) for v in vals) else None

    def setting(self, fn: FnState, name: str, value):
        a = fn.current
        if a is None:
            return
        v = _const(value)
        if name in ("array", "setArray"):
            a.array = bool(v)
        elif name in ("writable", "setWritable"):
            a.writable = bool(v)
        elif name in ("default", "setDefault"):
            if isinstance(value, (ast.Tuple, ast.List)):
                a.default = [_const(x) for x in value.elts]
            elif isinstance(value, ast.Call) and _tail(value.func) in ("MAngle", "MDistance", "MTime") and value.args:
                a.default = _const(value.args[0])
            else:
                a.default = v

    def call(self, c: ast.Call, env):
        f = c.func
        name = _tail(f)
        # nAttr.setArray(True) など（API 1.0）・cAttr.addChild(…)
        if isinstance(f, ast.Attribute) and self.fn_of(f.value) is not None:
            fn = self.fn_of(f.value)
            if name == "addChild" and c.args:
                child = self.ref(c.args[0], env)
                if child is not None and fn.current is not None:
                    child.parent = fn.current
                    fn.current.children.append(child)
                return
            if name in ("setArray", "setWritable", "setDefault") and c.args:
                value = c.args[0] if len(c.args) == 1 else ast.Tuple(elts=c.args)
                self.setting(fn, name, value)
            return
        if name == "addAttribute" and c.args:
            a = self.ref(c.args[0], env)
            if a is not None and a not in self.added:
                self.added.append(a)
            return
        if name == "attributeAffects" and len(c.args) >= 2:
            src, dst = self.ref(c.args[0], env), self.ref(c.args[1], env)
            if src is not None and dst is not None:
                self.affects.append((src, dst))
            return
        if isinstance(f, ast.Name) and f.id == "setattr" and len(c.args) == 3:
            # setattr(cls, "aWeight" + key, nAttr.create(…))
            attr_name = self.name_value(c.args[1], env)
            value = c.args[2]
            a = self.ref(value, env) or self.create(value, env) or self.helper_call(value, env)
            if isinstance(attr_name, str) and a is not None:
                self.attrs[attr_name] = a
            return
        self.helper_call(c, env)                         # 属性を作って cls に入れる補助の関数

    def outputs(self) -> List[AttrInfo]:
        """出力の属性（attributeAffects で影響を受けるもの。なければ書き込めないもの）"""
        out = []
        for _src, dst in self.affects:
            top = dst
            while top.parent is not None:
                top = top.parent
            if top not in out:
                out.append(top)
        if not out:
            out = [a for a in self.order if not a.writable and a.parent is None]
        return out

    def top_level(self) -> List[AttrInfo]:
        """定義に入れる属性: addAttribute したもの（の順）と、作ったが addAttribute が見つからないもの"""
        attrs = list(self.added) + [a for a in self.order if a not in self.added]
        return [a for a in attrs if a.parent is None]


# ---------------------------------------------------------------------------
# 計算（compute）
# ---------------------------------------------------------------------------

class Value:
    """変換中の値。kind: num・vec・pt・mat・quat・eul・tm・unit（MAngle など）・hdl（属性の値の handle）・
    ahdl（配列の handle）・bld（MArrayDataBuilder）。code は定義の計算の式"""

    def __init__(self, kind: str, code: str = "", **extra):
        self.kind = kind
        self.code = code
        self.extra = extra

    def __repr__(self):
        return "Value(%s, %r)" % (self.kind, self.code)


_MATH = {"sin", "cos", "tan", "asin", "acos", "atan", "atan2", "sqrt", "pow", "exp", "log", "log10", "floor", "ceil",
         "degrees", "radians", "hypot", "fmod", "trunc"}
_MATH_RENAME = {"fabs": "abs"}
_VEC_CLASSES = {"MVector", "MFloatVector"}
_PT_CLASSES = {"MPoint", "MFloatPoint"}
_MAT_CLASSES = {"MMatrix", "MFloatMatrix"}
_ROT_ORDERS = {"kXYZ": 0, "kYZX": 1, "kZXY": 2, "kXZY": 3, "kYXZ": 4, "kZYX": 5}
_AXES = {"kXaxisVector": "[1.0, 0.0, 0.0]", "kYaxisVector": "[0.0, 1.0, 0.0]", "kZaxisVector": "[0.0, 0.0, 1.0]",
         "kXnegAxisVector": "[-1.0, 0.0, 0.0]", "kYnegAxisVector": "[0.0, -1.0, 0.0]",
         "kZnegAxisVector": "[0.0, 0.0, -1.0]", "kZeroVector": "[0.0, 0.0, 0.0]", "kOneVector": "[1.0, 1.0, 1.0]"}
_GETTERS_NUM = {"asDouble", "asFloat", "asInt", "asShort", "asLong", "asBool", "asChar", "asInt64", "asUChar"}
_GETTERS_VEC = {"asVector", "asFloatVector", "asDouble3", "asFloat3", "asInt3", "asShort3", "asLong3",
                "asDouble2", "asFloat2", "asInt2", "asShort2", "asLong2", "asDouble4"}
_GETTERS_MAT = {"asMatrix", "asFloatMatrix"}
_GETTERS_UNIT = {"asAngle", "asDistance", "asTime"}
_SETTERS_NUM = {"setDouble", "setFloat", "setInt", "setShort", "setLong", "setBool", "setChar", "setInt64"}
_SETTERS_VEC = {"setMVector", "setMFloatVector", "setMPoint", "setMFloatPoint"}
_SETTERS_SPLIT = {"set3Double", "set3Float", "set3Int", "set3Short", "set3Long", "set2Double", "set2Float",
                  "set2Int", "set2Short", "set2Long", "set4Double"}
_SETTERS_MAT = {"setMMatrix", "setMFloatMatrix"}
_SETTERS_OBJ = {"setMObject", "setData"}
_MATRIX_FROM_LIST = {"createMatrixFromList", "createFloatMatrixFromList"}
_SETTERS_UNIT = {"setMAngle", "setMDistance", "setMTime"}
_IGNORED_CALLS = {"setClean", "setAllClean", "set", "print", "displayInfo", "displayWarning", "displayError",
                  "inputArrayValue", "outputArrayValue"}
_LOGICAL_JUMP = {"jumpToLogicalElement", "jumpToElement", "jumpToLogicalIndex"}
_PHYSICAL_JUMP = {"jumpToPhysicalElement", "jumpToArrayElement"}
_LOGICAL_INDEX = {"elementLogicalIndex", "elementIndex"}
_RESERVED = set(ND.FUNCTIONS) | set(ND.ATTR_FUNCTIONS) | set(ND.CONSTANTS) | set(ND.TIME_NAMES) | set(keyword.kwlist)


class Translator:
    """compute の本体を、定義の計算の文に書き換える"""

    def __init__(self, scanner: AttrScanner, module: "ModuleInfo", cls: ast.ClassDef, fn: ast.FunctionDef):
        self.sc = scanner
        self.module = module
        self.cls = cls
        self.fn = fn
        params = [a.arg for a in fn.args.args]
        if len(params) < 3:
            _fail("compute の引数（self, plug, data）が足りません", fn)
        self.self_name, self.plug_name, self.data_name = params[0], params[1], params[2]
        self.lines: List[str] = []
        self.indent = 0
        self.env: Dict[str, Value] = {}
        self.names: Dict[str, str] = {}
        self.problems: List[Tuple[int, str]] = []
        self.notes: List[str] = []
        self.counter = 0
        taken = set()
        for a in scanner.order:
            taken.update((a.long, a.short))
            for c in a.children:
                taken.update((c.long, c.short))
        self.taken = taken | _RESERVED
        self.outputs = set(scanner.outputs())
        self.written: List[AttrInfo] = []                # 値を書き込んだ出力（上の階層の属性）
        self.out_vars: Dict[str, str] = {}               # 書き込んだ出力 → その値を入れた変数（あとで読むため）
        self.read_outputs = self.outputs_read_in(fn)
        self.kept: Optional[List[AttrInfo]] = None        # 定義に入れる上の階層の属性（変換の前に決める）

    def outputs_read_in(self, fn) -> set:
        """compute の中で inputValue で読んでいる出力の属性（attributeAffects で次の出力につながる途中の属性）"""
        out = set()
        for node in ast.walk(fn):
            if isinstance(node, ast.Call) and _tail(node.func) in ("inputValue", "inputArrayValue") and node.args:
                a = self.sc.attrs.get(_tail(node.args[0]) or "")
                if a is not None and a in self.outputs:
                    out.add(a)
        return out

    def emit_output(self, target: str, top: "AttrInfo", code: str):
        """出力への書き込み。あとで読む出力は、値を変数にも入れる"""
        if top not in self.written:
            self.written.append(top)
        if top in self.read_outputs:
            var = self.out_vars.get(target) or self.fresh("out")
            self.out_vars[target] = var
            self.emit("%s = %s" % (var, code))
            code = var
        self.emit("%s = %s" % (target, code))

    # ---- 出力
    def emit(self, line: str):
        self.lines.append("    " * self.indent + line)

    def emit_assign(self, name: str, code: str):
        if code != name:                                 # x = x は書かない
            self.emit("%s = %s" % (name, code))

    def local(self, name: str) -> str:
        """プラグインの変数名 → 定義の変数名（属性・関数の名前と重なれば _ を付ける）"""
        if name not in self.names:
            n = name
            while n in self.taken:
                n += "_"
            self.names[name] = n
        return self.names[name]

    def fresh(self, base: str) -> str:
        self.counter += 1
        n = "_%s%d" % (base, self.counter)
        self.taken.add(n)
        return n

    def translate(self) -> List[str]:
        self.block(self.fn.body, tail=True)
        return self.lines

    # ---- 属性の参照
    def attr_ref(self, node) -> Optional[AttrInfo]:
        if isinstance(node, ast.Attribute):
            # self.aIn・Cls.aIn・cls.aIn・self.__class__.aIn・type(self).aIn（変数の値の属性は除く）
            if isinstance(node.value, ast.Name) and node.value.id in self.env:
                return None
            return self.sc.attrs.get(node.attr)
        if isinstance(node, ast.Name) and node.id not in self.env:
            return self.sc.attrs.get(node.id)
        return None

    def need_attr(self, node) -> AttrInfo:
        a = self.attr_ref(node)
        if a is None:
            known = sorted({k for k, v in self.sc.attrs.items() if v.parent is None and k not in self.sc.local})
            _fail("属性 %s が分かりません（初期化の関数で作った属性を指していません。作った属性: %s）"
                  % (ast.unparse(node), "・".join(known) or "なし"), node)
        if not a.supported:
            _fail("属性 %s は扱えません（%s）" % (a.long, a.type.split(":", 1)[-1]), node)
        if self.kept is not None and self.top_of(a) not in self.kept:
            # 定義に入れなかった属性（同じ名前の属性が 2 つあって外したもの）→ 名前が同じ、定義に入れた属性
            alt = self.find_kept(a)
            if alt is None:
                _fail("属性 %s（%s。%d 行目で作った属性）は定義に入っていません（同じ名前の別の属性を使ったか、"
                      "addAttribute していません）" % (ast.unparse(node), a.long, a.line), node)
            self.notes.append("%d 行目: %s は、%d 行目で作った属性 %s として読みます（同じ名前の属性が 2 つあるため）"
                              % (getattr(node, "lineno", 0), ast.unparse(node), alt.line, alt.long))
            a = alt
        return a

    @staticmethod
    def top_of(a: "AttrInfo") -> "AttrInfo":
        while a.parent is not None:
            a = a.parent
        return a

    def find_kept(self, a: "AttrInfo") -> Optional["AttrInfo"]:
        names = {a.long, a.short}
        todo = list(self.kept or [])
        best = None
        while todo:
            k = todo.pop(0)
            if k.long == a.long and k.type == a.type:
                return k
            if best is None and names & {k.long, k.short}:
                best = k
            todo.extend(k.children)
        return best

    def attr_path(self, a: "AttrInfo", node) -> list:
        """属性 → 定義の計算での道筋（配列でない compound の子は 親.子）"""
        chain = []
        x = a
        while x is not None:
            chain.append(x)
            x = x.parent if x.parent is not None and x.parent.type == "compound" else None
        chain.reverse()
        for p in chain[:-1]:
            if p.array:
                _fail("配列の compound %s の子 %s を、要素を選ばずに読んでいます（%s.inputValue のあと child で読んでください）"
                      % (p.long, a.long, p.long), node)
        return [(x, None) for x in chain]

    @staticmethod
    def path_text(path) -> str:
        out = []
        for attr, idx in path:
            out.append(attr.long + ("[%s]" % idx if idx is not None else ""))
        return ".".join(out)

    # ---- 文
    def block(self, stmts, tail: bool = False):
        """tail: この文の並びのあとに、compute の文が続かない（ここでの return は compute の終わり）"""
        for k, s in enumerate(stmts):
            if isinstance(s, ast.Return):
                if tail:
                    return                               # 以降の文は実行されない
                self.problem(s, "ループの中の return は変換できません（break を使ってください）")
                return
            if isinstance(s, ast.If) and self.plug_test(s.test) is not None:
                # if plug == outA: … elif plug == outB: … → すべての出力を計算するので、どの分かれ道も順に変換する
                self.block(s.body, tail=True)
                self.block(s.orelse, tail=True)
                continue
            if tail and isinstance(s, ast.If) and (self.ends_with_return(s.body) or self.ends_with_return(s.orelse)):
                # if 条件: … return → 条件が成り立たなければ、残りの文を実行する（if … else に書き換える）
                rest = list(stmts[k + 1:])
                body = s.body if self.ends_with_return(s.body) else s.body + rest
                orelse = s.orelse if self.ends_with_return(s.orelse) else s.orelse + rest
                try:
                    self.if_branches(s, body, orelse, tail=True)
                except _Cascade:
                    pass
                except ConvertError as exc:
                    self.problems.append((exc.line or s.lineno, str(exc)))
                return
            try:
                self.stmt(s)
            except _Cascade:
                self.mark_failed(s)
            except ConvertError as exc:
                self.problems.append((exc.line or getattr(s, "lineno", 0), str(exc)))
                self.mark_failed(s)

    def mark_failed(self, s):
        """変換できなかった文で値を入れる変数を、変換できない値にする"""
        targets = []
        if isinstance(s, ast.Assign):
            targets = s.targets
        elif isinstance(s, (ast.AnnAssign, ast.AugAssign)):
            targets = [s.target]
        for t in targets:
            for n in ast.walk(t):
                if isinstance(n, ast.Name):
                    self.env[n.id] = Value("failed")

    @staticmethod
    def is_trivial_tail(stmts) -> bool:
        return all(isinstance(s, (ast.Pass, ast.Return)) for s in stmts)

    @classmethod
    def ends_with_return(cls, stmts) -> bool:
        """文の並びのどの道も return で終わる"""
        if not stmts:
            return False
        last = stmts[-1]
        if isinstance(last, (ast.Return, ast.Raise)):
            return True
        if isinstance(last, ast.If):
            return cls.ends_with_return(last.body) and cls.ends_with_return(last.orelse)
        return False

    def problem(self, node, msg):
        self.problems.append((getattr(node, "lineno", 0), msg))

    def stmt(self, s):
        if isinstance(s, (ast.Pass,)):
            return
        if isinstance(s, ast.Expr):
            if isinstance(s.value, ast.Constant) and isinstance(s.value.value, str):
                return                                   # docstring
            if isinstance(s.value, ast.Call):
                self.call_stmt(s.value)
                return
            _fail("この文は変換できません", s)
        if isinstance(s, (ast.Assign, ast.AnnAssign)):
            targets = s.targets if isinstance(s, ast.Assign) else [s.target]
            if s.value is None:
                return
            if len(targets) != 1:
                _fail("a = b = c のような連続した代入は変換できません", s)
            self.assign(targets[0], s.value, s)
            return
        if isinstance(s, ast.AugAssign):
            self.aug(s)
            return
        if isinstance(s, ast.If):
            self.if_stmt(s)
            return
        if isinstance(s, ast.For):
            self.for_stmt(s)
            return
        if isinstance(s, ast.While):
            self.while_stmt(s)
            return
        if isinstance(s, (ast.Break, ast.Continue)):
            self.emit("break" if isinstance(s, ast.Break) else "continue")
            return
        names = {ast.Try: "try", ast.With: "with", ast.FunctionDef: "関数の定義", ast.Import: "import",
                 ast.ImportFrom: "import", ast.Global: "global", ast.Delete: "del", ast.Raise: "raise"}
        what = next((v for k, v in names.items() if isinstance(s, k)), type(s).__name__)
        _fail("%s は変換できません" % what, s)

    def assign(self, target, value_node, s):
        if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id == self.self_name:
            _fail("self.%s への代入（前回の計算の結果を覚える）は変換できません。ビューアはフレームごとに独立して計算します"
                  % target.attr, s)
        v = self.expr(value_node)
        if isinstance(target, ast.Name):
            # 値を読める入力の handle・MTransformationMatrix・MFnMatrixData は、代入した時点の値を変数に書き出す
            # （同じ名前の使い回し・if の分かれ道ごとの代入・if の中での変更でも、Maya と同じ順に値が決まるように）
            if v.kind == "hdl" and self.readable_handle(v) and v.extra["path"][0][0] not in self.outputs:
                name = self.local(target.id)
                self.emit("%s = %s" % (name, self.path_text(v.extra["path"])))
                self.env[target.id] = Value("hdl", **dict(v.extra, var=name))
                return
            if v.kind == "tm":
                name = self.local(target.id)
                self.emit_assign(name, self.tm_matrix(v).code)
                self.env[target.id] = Value("tm", m=name, order=v.extra.get("order", "0"), var=name)
                return
            if v.kind == "mfn" and v.extra.get("mat") is not None:
                name = self.local(target.id)
                self.emit_assign(name, v.extra["mat"])
                self.env[target.id] = Value("mfn", mat=name)
                return
            if v.kind in ("hdl", "ahdl", "bld", "tm", "mfn", "this", "depfn"):
                self.env[target.id] = v                  # 配列・compound・出力の handle などは変数に入れず、そのまま追う
                return
            name = self.local(target.id)
            self.emit_assign(name, v.code)
            self.env[target.id] = Value(v.kind, name, **v.extra)
            return
        if isinstance(target, (ast.Tuple, ast.List)):
            if v.kind not in ("vec", "pt", "eul", "quat"):
                _fail("この値は分解して代入できません", s)
            tmp = self.fresh("t")
            self.emit("%s = %s" % (tmp, v.code))
            for k, t in enumerate(target.elts):
                if not isinstance(t, ast.Name):
                    _fail("分解して代入する先は変数にしてください", s)
                name = self.local(t.id)
                self.emit("%s = %s[%d]" % (name, tmp, k))
                self.env[t.id] = Value("num", name)
            return
        if isinstance(target, ast.Attribute) and isinstance(target.value, ast.Name) and target.value.id in self.env:
            base = self.env[target.value.id]
            if target.attr in ("x", "y", "z", "w") and base.kind in ("vec", "pt", "quat", "eul"):
                k = "xyzw".index(target.attr)
                self.emit("%s[%d] = %s" % (base.code, k, self.num(value_node).code))
                return
        _fail("この代入先は変換できません", s)

    def aug(self, s: ast.AugAssign):
        if not isinstance(s.target, ast.Name) or s.target.id not in self.env:
            _fail("この代入先（+= など）は変換できません", s)
        left = self.env[s.target.id]
        right = self.expr(s.value)
        res = self.binop(s.op, left, right, s)
        self.emit("%s = %s" % (left.code, res.code))
        self.env[s.target.id] = Value(res.kind, left.code, **res.extra)

    # ---- plug による出し分け（すべての出力を計算するので、plug == … は真、plug != … は偽とみなす）
    def plug_test(self, t) -> Optional[bool]:
        def is_plug(n):
            if isinstance(n, ast.Name) and n.id == self.plug_name:
                return True
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute):
                return is_plug(n.func.value) and n.func.attr in ("parent", "array", "attribute")
            if isinstance(n, ast.Attribute):
                return is_plug(n.value)
            return False
        if isinstance(t, ast.Compare) and len(t.ops) == 1 and (is_plug(t.left) or is_plug(t.comparators[0])):
            op = t.ops[0]
            if isinstance(op, (ast.Eq, ast.In, ast.Is)):
                return True
            if isinstance(op, (ast.NotEq, ast.NotIn, ast.IsNot)):
                return False
        if isinstance(t, ast.BoolOp):
            vals = [self.plug_test(v) for v in t.values]
            if any(v is None for v in vals):
                return None
            return any(vals) if isinstance(t.op, ast.Or) else all(vals)
        if isinstance(t, ast.UnaryOp) and isinstance(t.op, ast.Not):
            v = self.plug_test(t.operand)
            return None if v is None else not v
        if is_plug(t):
            return True
        return None

    def if_stmt(self, s: ast.If):
        self.if_branches(s, s.body, s.orelse, tail=False)

    def if_branches(self, s: ast.If, body, orelse, tail: bool):
        if self.plug_test(s.test) is not None:
            self.block(body, tail=True)
            self.block(orelse, tail=True)
            return
        cond = self.cond(s.test)
        head = len(self.lines)
        self.emit("if %s:" % cond)
        self.indent += 1
        n = len(self.lines)
        self.block(body, tail=tail)
        empty_body = len(self.lines) == n
        if empty_body:
            self.emit("pass")
        self.indent -= 1
        if orelse:
            mark = len(self.lines)
            self.emit("else:")
            self.indent += 1
            n = len(self.lines)
            self.block(orelse, tail=tail)
            if len(self.lines) == n:
                del self.lines[mark:]                    # 中身のない else は書かない
            elif empty_body:
                # if 条件: pass / else: … → if not 条件: …
                self.lines[head] = self.lines[head].replace("if %s:" % cond, "if %s:" % self.negate(cond), 1)
                del self.lines[mark]
                del self.lines[head + 1]
            self.indent -= 1

    @staticmethod
    def negate(cond: str) -> str:
        if cond.startswith("(not ") and cond.endswith(")") and Translator.balanced(cond[5:-1]):
            return cond[5:-1]
        return "not %s" % cond

    @staticmethod
    def balanced(text: str) -> bool:
        depth = 0
        for ch in text:
            depth += {"(": 1, "[": 1, ")": -1, "]": -1}.get(ch, 0)
            if depth < 0:
                return False
        return depth == 0

    def cond(self, t) -> str:
        v = self.expr(t)
        if v.kind not in ("num",):
            _fail("条件に数以外（%s）を使っています" % v.kind, t)
        return v.code

    def array_count_handle(self, it) -> Optional[Value]:
        """range(len(arr))・range(arr.elementCount())・range(arr.__len__()) の arr（配列の handle）"""
        if not (isinstance(it, ast.Call) and _tail(it.func) == "range" and len(it.args) == 1):
            return None
        a = it.args[0]
        if isinstance(a, ast.Call) and isinstance(a.func, ast.Name) and a.func.id == "len" and len(a.args) == 1:
            h = self.env.get(a.args[0].id) if isinstance(a.args[0], ast.Name) else None
            return h if h is not None and h.kind == "ahdl" else None
        if isinstance(a, ast.Call) and isinstance(a.func, ast.Attribute) and a.func.attr in ("elementCount", "__len__"):
            h = self.env.get(a.func.value.id) if isinstance(a.func.value, ast.Name) else None
            return h if h is not None and h.kind == "ahdl" else None
        if isinstance(a, ast.Name) and a.id in self.env and self.env[a.id].extra.get("count_of") is not None:
            return self.env[a.id].extra["count_of"]
        return None

    def for_stmt(self, s: ast.For):
        if s.orelse:
            _fail("for … else は変換できません", s)
        if not isinstance(s.target, ast.Name):
            _fail("for の変数は 1 つの名前にしてください", s)
        arr = self.array_count_handle(s.iter)
        if arr is not None:
            self.element_loop(arr, s.target.id, s.body, s)
            return
        it = self.expr(s.iter)
        if it.kind != "vec" and not it.extra.get("iterable"):
            _fail("この繰り返しは変換できません（range か、配列の要素のたどり方にしてください）", s)
        name = self.local(s.target.id)
        self.env[s.target.id] = Value("num", name)
        self.emit("for %s in %s:" % (name, it.code))
        self.indent += 1
        n = len(self.lines)
        self.block(s.body)
        if len(self.lines) == n:
            self.emit("pass")
        self.indent -= 1

    def element_loop(self, arr: Value, phys_name: Optional[str], body, node):
        """配列の handle の要素を順にたどるループ → for _i in indices(属性)"""
        idx = self.fresh("i")
        path = arr.extra["path"]
        if arr.extra.get("output"):
            _fail("出力の配列の要素をたどるループは変換できません（入力の配列でたどってください）", node)
        uses_phys = phys_name is not None and self.uses_name(body, phys_name)
        if uses_phys:
            pname = self.local(phys_name)
            self.emit("%s = -1" % pname)
            self.env[phys_name] = Value("num", pname)
        self.emit("for %s in indices(%s):" % (idx, self.path_text(path)))
        self.indent += 1
        if uses_phys:
            self.emit("%s += 1" % self.local(phys_name))
        saved = arr.extra.get("current")
        arr.extra["current"] = idx
        arr.extra["in_loop"] = True
        n = len(self.lines)
        self.block(body)
        if len(self.lines) == n:
            self.emit("pass")
        arr.extra["current"] = saved
        arr.extra["in_loop"] = False
        self.indent -= 1

    def uses_name(self, body, name) -> bool:
        """name を、配列の handle の位置の移動（jumpTo…）以外で使っているか"""
        for node in body:
            for sub in ast.walk(node):
                if isinstance(sub, ast.Call) and isinstance(sub.func, ast.Attribute) and sub.func.attr in _PHYSICAL_JUMP:
                    continue
                if isinstance(sub, ast.Name) and sub.id == name:
                    parent_jump = False
                    for cand in ast.walk(node):
                        if (isinstance(cand, ast.Call) and isinstance(cand.func, ast.Attribute)
                                and cand.func.attr in _PHYSICAL_JUMP and sub in cand.args):
                            parent_jump = True
                    if not parent_jump:
                        return True
        return False

    def while_stmt(self, s: ast.While):
        # while not arr.isDone(): … arr.next() → 要素をたどるループ
        t = s.test
        if (isinstance(t, ast.UnaryOp) and isinstance(t.op, ast.Not) and isinstance(t.operand, ast.Call)
                and isinstance(t.operand.func, ast.Attribute) and t.operand.func.attr == "isDone"
                and isinstance(t.operand.func.value, ast.Name)):
            arr = self.env.get(t.operand.func.value.id)
            if arr is not None and arr.kind == "ahdl":
                self.element_loop(arr, None, s.body, s)
                return
        _fail("while は変換できません（配列の要素をたどる while not arr.isDone() だけ変換できます）", s)

    # ---- 呼び出しの文（出力への書き込みなど）
    def call_stmt(self, c: ast.Call):
        f = c.func
        if isinstance(f, ast.Name) and f.id == "print":
            self.notes.append("%d 行目: print は無視しました" % c.lineno)
            return
        if not isinstance(f, ast.Attribute):
            _fail("この関数の呼び出しは変換できません", c)
        name = f.attr
        # data.setClean(plug) など
        if name in _IGNORED_CALLS:
            if name.startswith("display"):
                self.notes.append("%d 行目: %s は無視しました" % (c.lineno, name))
            return
        if isinstance(f.value, ast.Name) and f.value.id == self.data_name:
            if name in ("setClean",):
                return
            _fail("data.%s は変換できません" % name, c)
        if name in _MATRIX_FROM_LIST:
            self.matrix_from_list(c)
            return
        base = self.expr_obj(f.value)
        if base is None:
            _fail("この呼び出しは変換できません", c)
        if base.kind == "ahdl":
            if name in _PHYSICAL_JUMP:
                if not base.extra.get("in_loop"):
                    _fail("配列の要素をたどるループの外で、物理番号の位置へ移動しています", c)
                return
            if name in _LOGICAL_JUMP:
                base.extra["current"] = self.num(c.args[0]).code
                return
            if name == "next":
                return                                   # 要素をたどるループの中（ループが次の要素へ進む）
            _fail("配列の handle の %s は変換できません" % name, c)
        if base.kind == "hdl":
            self.write_output(base, name, c)
            return
        if base.kind == "mat" and name in ("setElement", "setToIdentity", "setToProduct"):
            if not base.code.isidentifier():
                _fail("%s は、行列の変数に対してだけ変換できます" % name, c)
            if name == "setElement" and len(c.args) >= 3:
                self.emit("%s = set_element(%s, %s, %s, %s)" % (base.code, base.code, self.num(c.args[0]).code,
                                                                self.num(c.args[1]).code, self.num(c.args[2]).code))
                return
            if name == "setToIdentity":
                self.emit("%s = identity()" % base.code)
                return
            if name == "setToProduct" and len(c.args) >= 2:
                a, b = self.expr(c.args[0]), self.expr(c.args[1])
                if a.kind != "mat" or b.kind != "mat":
                    _fail("setToProduct に行列以外を渡しています", c)
                self.emit("%s = (%s * %s)" % (base.code, a.code, b.code))
                return
        if base.kind in ("vec", "pt") and name == "normalize":
            self.emit("%s = normalize(%s)" % (base.code, base.code))
            return
        if base.kind == "quat" and name in ("normalizeIt", "invertIt", "conjugateIt"):
            fn = "quat_normalize" if name == "normalizeIt" else "quat_inverse"
            self.emit("%s = %s(%s)" % (base.code, fn, base.code))
            return
        if base.kind == "tm":
            self.tm_setter(base, name, c)
            return
        if base.kind == "eul" and name in ("reorderIt", "setValue"):
            self.euler_setter(base, name, c)
            return
        _fail("%s の %s は変換できません" % (base.kind, name), c)

    def euler_setter(self, r: Value, m: str, c: ast.Call):
        """MEulerRotation の変数を書き換える（reorderIt: 回転は変えず回転順を変える。setValue: 回転順は変えずに値を入れる）"""
        if not r.code.isidentifier():
            _fail("%s は、MEulerRotation の変数に対してだけ変換できます" % m, c)
        order = r.extra.get("order", "0")
        if m == "reorderIt":
            if not c.args:
                _fail("reorderIt に回転順がありません", c)
            new = self.num(c.args[0]).code
            self.emit("%s = euler_from_quat(quat_from_euler(%s, %s), %s)" % (r.code, r.code, order, new))
            r.extra["order"] = new
            return
        if not c.args:
            _fail("setValue に値がありません", c)
        if len(c.args) >= 3:
            self.emit("%s = [%s]" % (r.code, ", ".join(self.num(a).code for a in c.args[:3])))
            r.extra["order"] = self.num(c.args[3]).code if len(c.args) > 3 else "0"
            return
        v = self.expr(c.args[0])
        if v.kind == "tm":
            v = self.tm_matrix(v)
        if v.kind == "quat":
            self.emit("%s = euler_from_quat(%s, %s)" % (r.code, v.code, order))
        elif v.kind == "mat":
            self.emit("%s = rotation(%s, %s)" % (r.code, v.code, order))
        elif v.kind == "eul":
            self.emit("%s = %s" % (r.code, v.code))
            r.extra["order"] = v.extra.get("order", "0")
        elif v.kind in ("vec", "pt"):
            # 3 つの数（ラジアン）と回転順（省略時は xyz）
            self.emit("%s = %s" % (r.code, v.code))
            r.extra["order"] = self.num(c.args[1]).code if len(c.args) > 1 else "0"
        else:
            _fail("setValue に回転以外（%s）を渡しています" % v.kind, c)

    def matrix_from_list(self, c: ast.Call):
        """MScriptUtil.createMatrixFromList(16 個の数のリスト, 行列) → 行列 = matrix(リスト)"""
        if len(c.args) < 2 or not isinstance(c.args[1], ast.Name):
            _fail("%s の 2 番目の引数は、行列の変数にしてください" % c.func.attr, c)
        items = c.args[0]
        if isinstance(items, (ast.List, ast.Tuple)) and len(items.elts) != 16:
            _fail("%s のリストの要素が 16 個ではありません（%d 個）" % (c.func.attr, len(items.elts)), c)
        v = self.expr(items)
        if v.kind != "vec":
            _fail("%s には数のリストを渡してください" % c.func.attr, c)
        target = c.args[1].id
        name = self.local(target)
        self.emit("%s = matrix(%s)" % (name, v.code))
        self.env[target] = Value("mat", name)

    def write_output(self, h: Value, name: str, c):
        if name in ("setClean",):
            return
        if not h.extra.get("output"):
            _fail("入力の handle に書き込んでいます（%s）" % name, c)
        target = self.path_text(h.extra["path"])
        info = h.extra["path"][-1][0]
        top = h.extra["path"][0][0]
        if name in _SETTERS_NUM or name in _SETTERS_UNIT:
            v = self.expr(c.args[0])
            if v.kind == "unit":
                v = Value("num", v.code)
            if v.kind != "num":
                _fail("%s に数以外を渡しています" % name, c)
            self.emit_output(target, top, v.code)
            return
        if name in _SETTERS_SPLIT:
            parts = [self.num(a).code for a in c.args]
            self.emit_output(target, top, "[%s]" % ", ".join(parts))
            return
        if name in _SETTERS_VEC:
            v = self.expr(c.args[0])
            if v.kind not in ("vec", "pt"):
                _fail("%s にベクトル以外を渡しています" % name, c)
            self.emit_output(target, top, self.vec3(v))
            return
        if name in _SETTERS_MAT:
            v = self.expr(c.args[0])
            if v.kind == "tm":
                v = self.tm_matrix(v)
            if v.kind != "mat":
                _fail("%s に行列以外を渡しています" % name, c)
            self.emit_output(target, top, v.code)
            return
        if name in _SETTERS_OBJ and c.args:
            # 型つきの行列の属性: handle.setMObject(MFnMatrixData().create(m))
            v = self.expr(c.args[0])
            if v.kind != "mobj" or info.type != "matrix":
                _fail("%s は、行列の属性に MFnMatrixData().create(行列) を渡すときだけ変換できます" % name, c)
            self.emit_output(target, top, v.code)
            return
        _fail("出力の %s（%s）は変換できません" % (name, info.long), c)

    @staticmethod
    def vec3(v: Value) -> str:
        return v.code

    # ---- 式
    def expr_obj(self, node) -> Optional[Value]:
        """メソッドを呼ぶ対象（変数・handle など）"""
        try:
            return self.expr(node)
        except ConvertError:
            return None

    def num(self, node) -> Value:
        v = self.expr(node)
        if v.kind == "unit":
            return Value("num", v.code)
        if v.kind != "num":
            _fail("数以外（%s）を数として使っています" % v.kind, node)
        return v

    def expr(self, e) -> Value:
        c = _const(e)
        if c is not None:
            if isinstance(c, str):
                _fail("文字列（%r）は変換できません" % c, e)
            return Value("num", _num_text(c))
        if isinstance(e, ast.Name):
            return self.name(e)
        if isinstance(e, ast.Attribute):
            return self.attribute(e)
        if isinstance(e, ast.BinOp):
            return self.binop(e.op, self.expr(e.left), self.expr(e.right), e)
        if isinstance(e, ast.UnaryOp):
            v = self.expr(e.operand)
            if isinstance(e.op, ast.Not):
                if v.code.startswith("(not ") and v.code.endswith(")") and self.balanced(v.code[5:-1]):
                    return Value("num", v.code[5:-1])        # not (not x) → x
                return Value("num", "(not %s)" % v.code)
            if isinstance(e.op, ast.USub):
                if v.kind in ("num", "vec", "pt"):
                    return Value(v.kind if v.kind != "pt" else "vec", "(-%s)" % v.code)
                _fail("%s の符号は反転できません" % v.kind, e)
            return v
        if isinstance(e, ast.BoolOp):
            op = " and " if isinstance(e.op, ast.And) else " or "
            return Value("num", "(%s)" % op.join(self.expr(x).code for x in e.values))
        if isinstance(e, ast.Compare):
            ops = {ast.Eq: "==", ast.NotEq: "!=", ast.Lt: "<", ast.LtE: "<=", ast.Gt: ">", ast.GtE: ">="}
            parts = [self.num(e.left).code]
            for op, right in zip(e.ops, e.comparators):
                if type(op) not in ops:
                    _fail("この比較は変換できません", e)
                parts += [ops[type(op)], self.num(right).code]
            return Value("num", "(%s)" % " ".join(parts))
        if isinstance(e, ast.IfExp):
            a, b = self.expr(e.body), self.expr(e.orelse)
            if a.kind != b.kind and {a.kind, b.kind} != {"vec", "pt"}:
                _fail("if … else の両側の値の種類が違います（%s と %s）" % (a.kind, b.kind), e)
            return Value(a.kind, "(%s if %s else %s)" % (a.code, self.cond(e.test), b.code))
        if isinstance(e, (ast.Tuple, ast.List)):
            items = [self.num(x).code for x in e.elts]
            return Value("vec", "[%s]" % ", ".join(items))
        if isinstance(e, ast.Subscript):
            if isinstance(e.value, ast.Subscript):
                inner = self.expr_obj(e.value.value)
                if inner is not None and inner.kind == "mat":
                    # API 1.0 の m[行][列]
                    return Value("num", "element(%s, %s, %s)" % (inner.code, self.num(e.value.slice).code,
                                                                 self.num(e.slice).code))
            base = self.expr(e.value)
            if base.kind == "mat":
                # API 2.0 の m[番号]（0〜15、行の順）
                i = _const(e.slice)
                if isinstance(i, int) and not isinstance(i, bool) and 0 <= i < 16:
                    return Value("num", "element(%s, %d, %d)" % (base.code, i // 4, i % 4))
                return Value("num", "matrix_values(%s)[%s]" % (base.code, self.num(e.slice).code))
            if base.kind not in ("vec", "pt", "quat", "eul"):
                _fail("%s に添字は使えません" % base.kind, e)
            return Value("num", "%s[%s]" % (base.code, self.num(e.slice).code))
        if isinstance(e, ast.Call):
            return self.call(e)
        _fail("この書き方（%s）は変換できません" % type(e).__name__, e)

    def name(self, e: ast.Name) -> Value:
        if e.id in self.env:
            if self.env[e.id].kind == "failed":
                raise _Cascade("", e)
            return self.env[e.id]
        if e.id in ("True", "False"):
            return Value("num", "1" if e.id == "True" else "0")
        v = self.module.constant(e.id, self.cls)
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            return Value("num", _num_text(v))
        if e.id == self.self_name:
            _fail("self は変換できません（前回の計算の結果などを使っています）", e)
        if e.id in (self.data_name, self.plug_name):
            _fail("%s をそのまま値として使っています" % e.id, e)
        _fail("名前 %s が分かりません（compute の中で値を入れていない変数・モジュールの変数）" % e.id, e)

    def attribute(self, e: ast.Attribute) -> Value:
        a = e.attr
        if isinstance(e.value, ast.Name) and e.value.id == "math":
            if a == "pi":
                return Value("num", "pi")
            if a == "e":
                return Value("num", "e")
        if a in _AXES:
            return Value("vec", _AXES[a])
        owner = _tail(e.value)
        if a in ("kIdentity", "identity"):
            # 単位行列など（om.MMatrix.kIdentity）。クラスが分からなければ行列とみなす
            if owner == "MQuaternion":
                return Value("quat", "[0.0, 0.0, 0.0, 1.0]")
            if owner == "MEulerRotation":
                return Value("eul", "[0.0, 0.0, 0.0]", order="0")
            if owner == "MTransformationMatrix":
                return Value("tm", t="[0.0, 0.0, 0.0]", r="[0.0, 0.0, 0.0]", s="[1.0, 1.0, 1.0]", order="0")
            if owner in _MAT_CLASSES or a == "kIdentity":
                return Value("mat", "identity()")
        if a in _ROT_ORDERS:
            return Value("num", str(_ROT_ORDERS[a]))
        if isinstance(e.value, ast.Name) and e.value.id == self.self_name:
            if a in self.sc.attrs:
                _fail("属性 %s を値として使っています（data.inputValue で読んでください）" % a, e)
            _fail("self.%s（ノードが覚えている値）は変換できません" % a, e)
        # クラスの定数（Cls.EPS）
        if isinstance(e.value, ast.Name):
            v = self.module.class_constant(e.value.id, a)
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                return Value("num", _num_text(v))
        parts = _dotted(e)
        if parts and parts[0] not in self.env and parts[0] not in (self.data_name, self.plug_name) \
                and len(parts) >= 3 and _is_class_name(parts[-2]):
            # om.MMatrix.xxx などのクラスの定数（名前 om が分かりません、とは言わない）
            _fail("%s（%s の定数）は変換できません" % (".".join(parts), parts[-2]), e)
        base = self.expr(e.value)
        if a in ("x", "y", "z", "w") and base.kind in ("vec", "pt", "quat", "eul"):
            return Value("num", "%s.%s" % (base.code, a))
        if base.kind == "unit" and a == "value":
            return Value("num", base.code)
        if base.kind == "tm" and a == "rotationOrder":
            return Value("num", str(base.extra.get("order", "0")))
        _fail("%s の .%s は変換できません" % (base.kind, a), e)

    def binop(self, op, a: Value, b: Value, node) -> Value:
        for v in (a, b):
            if v.kind == "unit":
                v.kind = "num"
            if v.kind == "tm":
                _fail("MTransformationMatrix の演算は変換できません（asMatrix() を使ってください）", node)
        k = (a.kind, b.kind)
        sym = {ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/", ast.FloorDiv: "//", ast.Mod: "%",
               ast.Pow: "**", ast.BitXor: "^"}.get(type(op))
        if sym is None:
            _fail("この演算子は変換できません", node)
        vecs = ("vec", "pt")
        if k == ("num", "num"):
            if sym == "^":
                _fail("数の ^ は変換できません", node)
            return Value("num", "(%s %s %s)" % (a.code, sym, b.code))
        if sym == "^" and a.kind in vecs and b.kind in vecs:
            return Value("vec", "cross(%s, %s)" % (a.code, b.code))          # MVector の ^ は外積
        if sym == "*":
            if a.kind in vecs and b.kind in vecs:
                return Value("num", "dot(%s, %s)" % (a.code, b.code))         # MVector の * は内積
            if a.kind == "pt" and b.kind == "mat":
                return Value("pt", "xform_point(%s, %s)" % (a.code, b.code))
            if a.kind == "vec" and b.kind == "mat":
                return Value("vec", "xform_vector(%s, %s)" % (a.code, b.code))
            if k == ("mat", "mat"):
                return Value("mat", "(%s * %s)" % (a.code, b.code))
            if k == ("quat", "quat"):
                return Value("quat", "quat_mul(%s, %s)" % (a.code, b.code))
            if a.kind in vecs and b.kind == "num" or a.kind == "num" and b.kind in vecs:
                return Value("vec", "(%s * %s)" % (a.code, b.code))
        if sym in ("+", "-") and a.kind in vecs and b.kind in vecs:
            # 点 - 点 = ベクトル、点 ± ベクトル = 点、ベクトル ± ベクトル = ベクトル
            kind = "vec" if (a.kind == b.kind) or sym == "-" and a.kind == "pt" and b.kind == "pt" else "pt"
            if a.kind == "vec" and b.kind == "vec":
                kind = "vec"
            return Value(kind, "(%s %s %s)" % (a.code, sym, b.code))
        if sym == "/" and a.kind in vecs and b.kind == "num":
            return Value(a.kind, "(%s / %s)" % (a.code, b.code))
        _fail("%s %s %s は変換できません" % (a.kind, sym, b.kind), node)

    # ---- 関数・コンストラクタ・メソッド
    def call(self, e: ast.Call) -> Value:
        f = e.func
        kw = {k.arg: k.value for k in e.keywords}
        # data.inputValue(attr) など
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == self.data_name:
            if f.attr in ("inputValue", "outputValue"):
                a = self.need_attr(e.args[0])
                return Value("hdl", path=self.attr_path(a, e), output=f.attr == "outputValue")
            if f.attr in ("inputArrayValue", "outputArrayValue"):
                a = self.need_attr(e.args[0])
                if not a.array:
                    _fail("配列でない属性 %s を inputArrayValue で読んでいます" % a.long, e)
                return Value("ahdl", path=[(a, None)], output=f.attr == "outputArrayValue", current=None)
            _fail("data.%s は変換できません" % f.attr, e)
        name = _tail(f)
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == self.self_name:
            if f.attr == "thisMObject":
                return Value("this")
            _fail("self.%s()（ノードのメソッドの呼び出し）は変換できません。計算を compute の中に書いてください" % f.attr, e)
        if isinstance(f, ast.Name) and f.id in self.module.functions:
            _fail("関数 %s()（プラグインの中の関数）は変換できません。計算を compute の中に書いてください" % f.id, e)
        # math・組み込み
        if isinstance(f, ast.Attribute) and isinstance(f.value, ast.Name) and f.value.id == "math":
            if f.attr in _MATH or f.attr in _MATH_RENAME:
                fn = _MATH_RENAME.get(f.attr, f.attr)
                return Value("num", "%s(%s)" % (fn, ", ".join(self.num(a).code for a in e.args)))
            _fail("math.%s は変換できません" % f.attr, e)
        if isinstance(f, ast.Name) and f.id in self.env and self.env[f.id].kind == "mat" and len(e.args) == 2:
            # API 1.0 の m(行, 列)
            return Value("num", "element(%s, %s, %s)" % (self.env[f.id].code, self.num(e.args[0]).code,
                                                         self.num(e.args[1]).code))
        if isinstance(f, ast.Name):
            if f.id in ("abs", "min", "max", "pow", "round", "float", "int", "bool") and f.id not in self.env:
                return Value("num", "%s(%s)" % (f.id, ", ".join(self.num(a).code for a in e.args)))
            if f.id == "len" and e.args:
                h = self.env.get(e.args[0].id) if isinstance(e.args[0], ast.Name) else None
                if h is not None and h.kind == "ahdl":
                    return Value("num", "count(%s)" % self.path_text(h.extra["path"]), count_of=h)
            if f.id == "range":
                return Value("vec", "range(%s)" % ", ".join(self.num(a).code for a in e.args), iterable=True)
        # コンストラクタ
        if name in _VEC_CLASSES or name in _PT_CLASSES:
            return self.make_vector(name, e)
        if name in _MAT_CLASSES:
            return self.make_matrix(e)
        if name == "MPlug" and len(e.args) >= 2:
            # MPlug(self.thisMObject(), 属性) の値を読む（compute の中では入力の値と同じ）
            if self.expr(e.args[0]).kind != "this":
                _fail("MPlug は、このノード（self.thisMObject()）の属性だけ変換できます", e)
            return self.plug_value(self.need_attr(e.args[1]))
        if name == "MFnDependencyNode" and e.args:
            if self.expr(e.args[0]).kind != "this":
                _fail("MFnDependencyNode は、このノード（self.thisMObject()）だけ変換できます", e)
            return Value("depfn")
        if name == "MFnMatrixData":
            # 型つきの行列の属性のデータ。MFnMatrixData(handle.data()).matrix()・MFnMatrixData().create(m)
            if not e.args:
                return Value("mfn")
            v = self.expr(e.args[0])
            if v.kind != "mobj":
                _fail("MFnMatrixData には、行列の属性の handle.data() を渡してください", e)
            return Value("mfn", mat=v.code)
        if name == "MTransformationMatrix":
            if e.args:
                m = self.expr(e.args[0])
                if m.kind == "tm":
                    return Value("tm", **dict(m.extra))
                if m.kind != "mat":
                    _fail("MTransformationMatrix に行列以外を渡しています", e)
                return Value("tm", m=m.code, order="0")
            return Value("tm", t="[0.0, 0.0, 0.0]", r="[0.0, 0.0, 0.0]", s="[1.0, 1.0, 1.0]", order="0")
        if name == "MEulerRotation":
            if not e.args:
                return Value("eul", "[0.0, 0.0, 0.0]", order="0")
            if len(e.args) >= 3:
                order = self.num(e.args[3]).code if len(e.args) > 3 else "0"
                return Value("eul", "[%s]" % ", ".join(self.num(a).code for a in e.args[:3]), order=order)
            v = self.expr(e.args[0])
            order = self.num(e.args[1]).code if len(e.args) > 1 else "0"
            return Value("eul", v.code, order=order)
        if name == "MQuaternion":
            if not e.args:
                return Value("quat", "[0.0, 0.0, 0.0, 1.0]")
            if len(e.args) == 4:
                return Value("quat", "[%s]" % ", ".join(self.num(a).code for a in e.args))
            first = self.expr(e.args[0])
            if len(e.args) == 1 and first.kind in ("quat", "vec"):
                return Value("quat", first.code)     # MQuaternion(q)・MQuaternion([x, y, z, w])
            if len(e.args) in (2, 3):
                second = self.expr(e.args[1])
                factor = self.num(e.args[2]).code if len(e.args) == 3 else None
                if first.kind in ("vec", "pt") and second.kind in ("vec", "pt"):
                    return Value("quat", self.quat_between(first.code, second.code, factor))
                if first.kind in ("num", "unit") and second.kind in ("vec", "pt") and factor is None:
                    return Value("quat", self.quat_axis_angle(second.code, first.code))
            _fail("この MQuaternion の作り方は変換できません", e)
        if name in ("MAngle", "MDistance", "MTime"):
            v = self.num(e.args[0]).code if e.args else "0.0"
            unit = _tail(e.args[1]) if len(e.args) > 1 else None
            if name == "MAngle" and unit == "kDegrees":
                v = "radians(%s)" % v
            elif name == "MAngle" and unit not in (None, "kRadians"):
                _fail("MAngle の単位 %s は変換できません" % unit, e)
            if name == "MDistance" and unit not in (None, "kCentimeters"):
                _fail("MDistance の単位 %s は変換できません（cm だけ）" % unit, e)
            return Value("unit", v)
        if name == "slerp" and isinstance(f, ast.Attribute) and _tail(f.value) == "MQuaternion":
            a, b, t = (self.expr(x) for x in e.args[:3])
            return Value("quat", "quat_slerp(%s, %s, %s)" % (a.code, b.code, t.code))
        if not isinstance(f, ast.Attribute):
            _fail("関数 %s は変換できません" % (name or "?"), e)
        return self.method(self.expr(f.value), f.attr, e, kw)

    def quat_between(self, a: str, b: str, factor: Optional[str] = None) -> str:
        """MQuaternion(a, b[, factor]): 向き a を b へ回す最短の回転（factor 倍の角度）。値を入れた変数の名前を返す。
        a と b が逆向き（外積が 0）なら、a に垂直な軸で 180 度"""
        va, vb, c, ln, h, n, q = (self.fresh(x) for x in ("qa", "qb", "qc", "ql", "qh", "qn", "q"))
        self.emit("%s = %s" % (va, a))
        self.emit("%s = %s" % (vb, b))
        self.emit("%s = cross(%s, %s)" % (c, va, vb))
        self.emit("%s = length(%s)" % (ln, c))
        self.emit("if %s < 1e-10:" % ln)
        self.emit("    %s = cross(%s, [1.0, 0.0, 0.0])" % (c, va))
        self.emit("    if length(%s) < 1e-10:" % c)
        self.emit("        %s = cross(%s, [0.0, 1.0, 0.0])" % (c, va))
        self.emit("%s = atan2(%s, dot(%s, %s)) %s/ 2" % (h, ln, va, vb, "* %s " % factor if factor else ""))
        self.emit("%s = normalize(%s)" % (n, c))
        self.emit("%s = [%s[0] * sin(%s), %s[1] * sin(%s), %s[2] * sin(%s), cos(%s)]" % (q, n, h, n, h, n, h, h))
        return q

    def quat_log_exp(self, quat: str, m: str) -> str:
        """MQuaternion の log（(軸 · 角度, log |q|)）・exp（e^w · (軸 · sin |v|, cos |v|)）。値を入れた変数の名前を返す"""
        q, ln, k, out = (self.fresh(x) for x in ("q", "ql", "qk", "q"))
        self.emit("%s = %s" % (q, quat))
        self.emit("%s = length([%s[0], %s[1], %s[2]])" % (ln, q, q, q))
        if m == "log":
            self.emit("%s = (atan2(%s, %s[3]) / %s if %s > 1e-12 else 0.0)" % (k, ln, q, ln, ln))
            self.emit("%s = [%s[0] * %s, %s[1] * %s, %s[2] * %s, log(length(%s))]" % (out, q, k, q, k, q, k, q))
        else:
            self.emit("%s = exp(%s[3]) * (sin(%s) / %s if %s > 1e-12 else 1.0)" % (k, q, ln, ln, ln))
            self.emit("%s = [%s[0] * %s, %s[1] * %s, %s[2] * %s, exp(%s[3]) * cos(%s)]" % (out, q, k, q, k, q, k, q, ln))
        return out

    def quat_axis_angle(self, axis: str, angle: str) -> str:
        """MQuaternion(角度, 軸): 軸のまわりに角度（ラジアン）回す回転。値を入れた変数の名前を返す"""
        n, h, q = (self.fresh(x) for x in ("qn", "qh", "q"))
        self.emit("%s = normalize(%s)" % (n, axis))
        self.emit("%s = %s / 2" % (h, angle))
        self.emit("%s = [%s[0] * sin(%s), %s[1] * sin(%s), %s[2] * sin(%s), cos(%s)]" % (q, n, h, n, h, n, h, h))
        return q

    def make_vector(self, cls: str, e: ast.Call) -> Value:
        kind = "pt" if cls in _PT_CLASSES else "vec"
        if not e.args:
            return Value(kind, "[0.0, 0.0, 0.0]")
        if len(e.args) >= 3:
            return Value(kind, "[%s]" % ", ".join(self.num(a).code for a in e.args[:3]))
        v = self.expr(e.args[0])
        if v.kind in ("vec", "pt"):
            return Value(kind, v.code)
        _fail("この %s の作り方は変換できません" % cls, e)

    def make_matrix(self, e: ast.Call) -> Value:
        if not e.args:
            return Value("mat", "identity()")
        a = e.args[0]
        if isinstance(a, (ast.List, ast.Tuple)):
            items = a.elts
            if items and isinstance(items[0], (ast.List, ast.Tuple)):
                items = [x for row in items for x in row.elts]
            if len(items) != 16:
                _fail("MMatrix の要素が 16 個ではありません", e)
            return Value("mat", "matrix([%s])" % ", ".join(self.num(x).code for x in items))
        v = self.expr(a)
        if v.kind == "mat":
            return v
        _fail("この MMatrix の作り方は変換できません", e)

    def method(self, base: Value, m: str, e: ast.Call, kw) -> Value:
        args = e.args
        k = base.kind
        if k == "hdl":
            return self.handle_method(base, m, e)
        if k == "ahdl":
            if m in _LOGICAL_INDEX:
                if base.extra.get("current") is None:
                    _fail("要素を選ぶ前に %s を呼んでいます" % m, e)
                return Value("num", base.extra["current"])
            if m in ("inputValue", "outputValue"):
                cur = base.extra.get("current")
                if cur is None:
                    _fail("配列の要素を選ばずに %s を呼んでいます" % m, e)
                path = list(base.extra["path"])
                path[-1] = (path[-1][0], cur)
                return Value("hdl", path=path, output=base.extra.get("output"))
            if m in ("elementCount", "__len__"):
                return Value("num", "count(%s)" % self.path_text(base.extra["path"]), count_of=base)
            if m == "builder":
                return Value("bld", arr=base)
            _fail("配列の handle の %s は変換できません" % m, e)
        if k == "bld":
            if m in ("addElement",) and args:
                arr = base.extra["arr"]
                path = list(arr.extra["path"])
                path[-1] = (path[-1][0], self.num(args[0]).code)
                return Value("hdl", path=path, output=True)
            _fail("MArrayDataBuilder の %s は変換できません（addElement(番号) を使ってください）" % m, e)
        if k == "unit":
            if m in ("asRadians", "asCentimeters"):
                return Value("num", base.code)
            if m == "asDegrees":
                return Value("num", "degrees(%s)" % base.code)
            if m == "asUnits" and args and _tail(args[0]) in ("kRadians", "kCentimeters", "uiUnit"):
                return Value("num", base.code)
            if m == "asUnits" and args and _tail(args[0]) == "kDegrees":
                return Value("num", "degrees(%s)" % base.code)
            _fail("%s は変換できません" % m, e)
        if k in ("vec", "pt"):
            if m == "normalize" and not args:
                # API 2.0 の MVector.normalize() は自分を正規化して、自分を返す
                if base.code.isidentifier():
                    self.emit("%s = normalize(%s)" % (base.code, base.code))
                    return Value("vec", base.code)
                return Value("vec", "normalize(%s)" % base.code)
            if m in ("length",):
                return Value("num", "length(%s)" % base.code)
            if m in ("normal",):
                return Value("vec", "normalize(%s)" % base.code)
            if m == "angle" and args:
                return Value("num", "angle(%s, %s)" % (base.code, self.expr(args[0]).code))
            if m == "distanceTo" and args:
                return Value("num", "distance(%s, %s)" % (base.code, self.expr(args[0]).code))
            if m in ("rotateBy",) and args:
                r = self.expr(args[0])
                if r.kind == "quat":
                    return Value(k, "xform_vector(%s, matrix_from_quat(%s))" % (base.code, r.code))
            _fail("ベクトルの %s は変換できません" % m, e)
        if k == "mat":
            if m == "inverse":
                return Value("mat", "inverse(%s)" % base.code)
            if m == "transpose":
                return Value("mat", "transpose(%s)" % base.code)
            if m == "homogenize":
                return base
            if m == "getElement" and len(args) >= 2:
                return Value("num", "element(%s, %s, %s)" % (base.code, self.num(args[0]).code, self.num(args[1]).code))
            if m == "det4x4":
                return Value("num", "determinant(%s)" % base.code)
            if m == "det3x3":
                return Value("num", "determinant3(%s)" % base.code)
            if m == "isEquivalent" and args:
                other = self.expr(args[0])
                if other.kind != "mat":
                    _fail("isEquivalent に行列以外を渡しています", e)
                tol = ", %s" % self.num(args[1]).code if len(args) > 1 else ""
                return Value("num", "equivalent(%s, %s%s)" % (base.code, other.code, tol))
            if m == "isSingular":
                return Value("num", "(abs(determinant(%s)) < 1e-10)" % base.code)
            _fail("行列の %s は変換できません" % m, e)
        if k == "tm":
            return self.tm_method(base, m, e, kw)
        if k == "depfn":
            if m == "findPlug" and args:
                a = args[0]
                c = _const(a)
                if isinstance(c, str):
                    attr = next((x for x in (self.kept or []) if c in (x.long, x.short)), None) or \
                        next((x for x in self.sc.order if c in (x.long, x.short)), None)
                    if attr is None:
                        _fail("findPlug の属性 %r が、初期化の関数で作った属性にありません" % c, e)
                    if not attr.supported:
                        _fail("属性 %s は扱えません（%s）" % (attr.long, attr.type.split(":", 1)[-1]), e)
                else:
                    attr = self.need_attr(a)
                return self.plug_value(attr)
            _fail("MFnDependencyNode の %s は変換できません（findPlug だけ）" % m, e)
        if k == "mobj":
            if m == "isNull":
                path = base.extra.get("path")
                if path:
                    self.notes.append("%d 行目: isNull は「%s に接続がない」として扱います（.ma に値だけが書かれていると、"
                                      "Maya と違う結果になることがあります）" % (e.lineno, path))
                return Value("num", "(not connected(%s))" % path if path else "0")
            _fail("MObject の %s は変換できません" % m, e)
        if k == "mfn":
            if m in ("matrix", "transformation"):
                if base.extra.get("mat") is None:
                    _fail("データを渡していない MFnMatrixData の %s を呼んでいます" % m, e)
                if m == "matrix":
                    return Value("mat", base.extra["mat"])
                return Value("tm", m=base.extra["mat"], order="0")
            if m == "create" and args:
                v = self.expr(args[0])
                if v.kind == "tm":
                    v = self.tm_matrix(v)
                if v.kind != "mat":
                    _fail("MFnMatrixData.create に行列以外を渡しています", e)
                return Value("mobj", v.code)
            _fail("MFnMatrixData の %s は変換できません" % m, e)
        if k == "eul":
            order = base.extra.get("order", "0")
            if m == "asQuaternion":
                return Value("quat", "quat_from_euler(%s, %s)" % (base.code, order))
            if m == "asMatrix":
                return Value("mat", "compose([0.0, 0.0, 0.0], %s, [1.0, 1.0, 1.0], %s)" % (base.code, order))
            if m == "asVector":
                return Value("vec", base.code)
            if m == "reorder" and args:
                new = self.num(args[0]).code
                return Value("eul", "euler_from_quat(quat_from_euler(%s, %s), %s)" % (base.code, order, new), order=new)
            _fail("MEulerRotation の %s は変換できません" % m, e)
        if k == "quat":
            if m == "asEulerRotation":
                return Value("eul", "euler_from_quat(%s)" % base.code, order="0")
            if m == "asMatrix":
                return Value("mat", "matrix_from_quat(%s)" % base.code)
            if m in ("inverse", "conjugate"):
                return Value("quat", "quat_inverse(%s)" % base.code)
            if m == "normal":
                return Value("quat", "quat_normalize(%s)" % base.code)
            if m in ("log", "exp") and not args:
                return Value("quat", self.quat_log_exp(base.code, m))
            _fail("MQuaternion の %s は変換できません" % m, e)
        _fail("%s の %s は変換できません" % (k, m), e)

    @staticmethod
    def readable_handle(h: Value) -> bool:
        """値をそのまま読める入力の handle（出力・要素を選んでいない配列・compound・扱えない属性は除く）"""
        path = h.extra.get("path") or []
        if h.extra.get("output") or not path:
            return False
        info, idx = path[-1]
        return info.supported and info.type != "compound" and not (info.array and idx is None)

    def plug_value(self, attr: "AttrInfo") -> Value:
        return Value("hdl", path=self.attr_path(attr, None), output=False, plug=True)

    def handle_method(self, h: Value, m: str, e) -> Value:
        path = h.extra["path"]
        info = path[-1][0]
        if h.extra.get("plug"):
            # MPlug だけのメソッド
            if m == "isConnected":
                return Value("num", "connected(%s)" % self.path_text(path))
            if m in ("elementByLogicalIndex",) and e.args:
                if not info.array or path[-1][1] is not None:
                    _fail("配列でない属性の %s を呼んでいます" % m, e)
                path = list(path)
                path[-1] = (info, self.num(e.args[0]).code)
                return Value("hdl", path=path, output=False, plug=True)
            if m in ("numElements", "evaluateNumElements"):
                if not info.array:
                    _fail("配列でない属性の %s を呼んでいます" % m, e)
                return Value("num", "count(%s)" % self.path_text(path))
            if m == "asMObject":
                m = "data"
            if m in ("asMAngle", "asMDistance", "asMTime"):
                m = "as" + m[3:]
        if m == "child" and e.args:
            child = self.need_attr(e.args[0])
            if child not in info.children:
                _fail("%s は %s の子の属性ではありません" % (child.long, info.long), e)
            return Value("hdl", path=list(path) + [(child, None)], output=h.extra.get("output"))
        if h.extra.get("output") and m not in _GETTERS_NUM | _GETTERS_VEC | _GETTERS_MAT | _GETTERS_UNIT:
            _fail("出力の handle の %s は変換できません" % m, e)
        code = h.extra.get("var") or self.path_text(path)
        if not h.extra.get("output") and path[0][0] in self.outputs and not h.extra.get("var"):
            # 出力の属性を読む（attributeAffects で次の出力につながる途中の属性）→ 書き込んだ値の変数
            text = self.path_text(path)
            if text not in self.out_vars:
                _fail("出力 %s を、値を書き込む前に読んでいます（定義では出力を読めないので、書き込んだ値を使います。"
                      "書き込む処理を、読む処理より前に書いてください）" % text, e)
            code = self.out_vars[text]
        if info.array and path[-1][1] is None:
            _fail("配列の属性 %s を、要素を選ばずに読んでいます" % info.long, e)
        if m == "data":
            if info.type != "matrix" or h.extra.get("output"):
                _fail("handle.data() は、入力の行列の属性（MFnMatrixData で読む）だけ変換できます", e)
            return Value("mobj", code, path=self.path_text(path))
        if m in _GETTERS_NUM:
            if info.type in ND.VECTOR_TYPES or info.type in ("matrix", "compound"):
                _fail("%s（%s）を %s で読んでいます" % (info.long, info.type, m), e)
            return Value("num", code)
        if m in _GETTERS_UNIT:
            if info.type == "time":
                self.notes.append("%d 行目: %s の時間はフレームとして扱います" % (e.lineno, info.long))
            return Value("unit", code)
        if m in _GETTERS_VEC:
            if info.type not in ND.VECTOR_TYPES:
                _fail("%s（%s）を %s で読んでいます" % (info.long, info.type, m), e)
            return Value("vec", code)
        if m in _GETTERS_MAT:
            if info.type != "matrix":
                _fail("%s（%s）を %s で読んでいます" % (info.long, info.type, m), e)
            return Value("mat", code)
        _fail("handle の %s は変換できません（文字列・形状などは扱えません）" % m, e)

    # ---- MTransformationMatrix（値を組み立てる途中の状態を追う）
    def tm_parts(self, tm: Value):
        x = tm.extra
        if "m" in x:
            order = x.get("order", "0")
            return {"t": "translation(%s)" % x["m"], "r": "rotation(%s, %s)" % (x["m"], order),
                    "s": "scale(%s)" % x["m"], "order": order}
        return {"t": x["t"], "r": x["r"], "s": x["s"], "order": x.get("order", "0")}

    def tm_matrix(self, tm: Value) -> Value:
        x = tm.extra
        if "m" in x:
            return Value("mat", x["m"])
        return Value("mat", "compose(%s, %s, %s, %s)" % (x["t"], x["r"], x["s"], x.get("order", "0")))

    def tm_method(self, tm: Value, m: str, e, kw) -> Value:
        parts = self.tm_parts(tm)
        if m in ("translation", "getTranslation"):
            return Value("vec", parts["t"])
        if m in ("rotation", "eulerRotation"):
            as_q = kw.get("asQuaternion") or (e.args[0] if e.args else None)
            if m == "rotation" and self.module.api == 1 or as_q is not None and _const(as_q):
                # API 1.0 の rotation() は MQuaternion（API 2.0 は asQuaternion=True のとき）
                return Value("quat", "quat_from_euler(%s, %s)" % (parts["r"], parts["order"]))
            return Value("eul", parts["r"], order=parts["order"])
        if m == "rotationComponents":
            return Value("vec", parts["r"])
        if m in ("scale", "getScale"):
            return Value("vec", parts["s"])
        if m == "asMatrix":
            return self.tm_matrix(tm)
        if m == "asMatrixInverse":
            return Value("mat", "inverse(%s)" % self.tm_matrix(tm).code)
        if m == "rotationOrder":
            return Value("num", parts["order"])
        _fail("MTransformationMatrix の %s は変換できません" % m, e)

    def tm_setter(self, tm: Value, m: str, c):
        parts = self.tm_parts(tm)
        x = tm.extra
        if m == "setTranslation" and c.args:
            parts["t"] = self.expr(c.args[0]).code
        elif m in ("setRotation", "rotateTo") and c.args:
            r = self.expr(c.args[0])
            if r.kind == "quat":
                parts["r"] = "euler_from_quat(%s, %s)" % (r.code, parts["order"])
            elif r.kind == "eul":
                parts["r"] = r.code
                parts["order"] = r.extra.get("order", "0")
            else:
                _fail("setRotation に回転以外を渡しています", c)
        elif m in ("setScale",) and c.args:
            parts["s"] = self.expr(c.args[0]).code
        elif m == "setRotationOrder":
            # 回転そのものは変えず、回転順だけ変える（Maya の既定の reorder=True）
            x["order"] = self.num(c.args[0]).code
            return
        else:
            _fail("MTransformationMatrix の %s は変換できません" % m, c)
        var = x.get("var")
        if var:
            # 変数の MTransformationMatrix は、変更したところで書き出す（if の中の変更を、その分かれ道だけに効かせる）
            self.emit("%s = compose(%s, %s, %s, %s)" % (var, parts["t"], parts["r"], parts["s"], parts["order"]))
            x.clear()
            x.update(m=var, order=parts["order"], var=var)
            return
        x.clear()
        x.update(parts)


# compute の中で解釈できる関数・メソッドの名前（解釈できないものの一覧を作るため。クラスは問わず名前で見る）
_KNOWN_METHODS = (_GETTERS_NUM | _GETTERS_VEC | _GETTERS_MAT | _GETTERS_UNIT | _SETTERS_NUM | _SETTERS_VEC
                  | _SETTERS_SPLIT | _SETTERS_MAT | _SETTERS_UNIT | _SETTERS_OBJ | _IGNORED_CALLS | _LOGICAL_JUMP
                  | _PHYSICAL_JUMP | _LOGICAL_INDEX | _MATRIX_FROM_LIST | {
                      "inputValue", "outputValue", "child", "elementCount", "__len__", "builder", "addElement",
                      "next", "isDone", "asRadians", "asCentimeters", "asDegrees", "asUnits", "length", "normal",
                      "angle", "distanceTo", "rotateBy", "inverse", "transpose", "homogenize", "asQuaternion",
                      "asMatrix", "asEulerRotation", "conjugate", "normalize", "normalizeIt", "invertIt",
                      "conjugateIt", "translation", "getTranslation", "rotation", "eulerRotation",
                      "rotationComponents", "scale", "getScale", "asMatrixInverse", "rotationOrder", "setTranslation",
                      "setRotation", "rotateTo", "setScale", "setRotationOrder", "matrix", "transformation", "create",
                      "data", "isNull", "parent", "array", "attribute", "slerp", "thisMObject", "findPlug",
                      "isConnected", "elementByLogicalIndex", "numElements", "evaluateNumElements", "asMObject",
                      "asMAngle", "asMDistance", "asMTime", "getElement", "det4x4", "det3x3", "isEquivalent",
                      "isSingular", "setElement", "setToIdentity", "setToProduct", "reorderIt", "reorder", "setValue",
                      "asVector", "log", "exp"})
_KNOWN_CLASSES = _VEC_CLASSES | _PT_CLASSES | _MAT_CLASSES | {
    "MTransformationMatrix", "MEulerRotation", "MQuaternion", "MAngle", "MDistance", "MTime", "MFnMatrixData",
    "MPlug", "MFnDependencyNode"}
_KNOWN_FUNCTIONS = {"abs", "min", "max", "pow", "round", "float", "int", "bool", "len", "range", "print", "type"}


_KNOWN_CONSTANTS = ({"kIdentity", "identity", "kWorld", "kTransform", "kObject", "kPreTransform", "kPostTransform",
                     "kInvalid", "kRadians", "kDegrees", "kCentimeters", "uiUnit", "kTolerance"}
                    | set(_AXES) | set(_ROT_ORDERS))


def _is_class_name(name: str) -> bool:
    """MMatrix・MSpace などの Maya のクラスの名前らしい"""
    return len(name) > 1 and name[0] == "M" and name[1].isupper()


def unknown_calls(fn: ast.FunctionDef, module: "ModuleInfo") -> Dict[str, List[int]]:
    """compute の中の、解釈できない関数・メソッドの呼び出し → 行番号（実行の流れに関係なく、すべて）"""
    self_name = fn.args.args[0].arg if fn.args.args else "self"
    found: Dict[str, List[int]] = {}
    local_names = {n.id for n in ast.walk(fn) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store)}

    def add(name, node):
        found.setdefault(name, [])
        if node.lineno not in found[name]:
            found[name].append(node.lineno)
    funcs = {id(n.func) for n in ast.walk(fn) if isinstance(n, ast.Call)}
    for node in ast.walk(fn):
        if isinstance(node, ast.Attribute) and id(node) not in funcs:
            # クラスの定数（om.MMatrix.kIdentity など）
            owner = _tail(node.value)
            if owner and _is_class_name(owner) and node.attr not in _KNOWN_CONSTANTS:
                add("%s.%s" % (owner, node.attr), node)
            continue
        if not isinstance(node, ast.Call):
            continue
        f = node.func
        if isinstance(f, ast.Name):
            if f.id in local_names:
                pass                                     # 変数の呼び出し（API 1.0 の m(行, 列) など）
            elif f.id in module.functions:
                add("%s()（プラグインの関数）" % f.id, node)
            elif f.id not in _KNOWN_FUNCTIONS and f.id not in _KNOWN_CLASSES:
                add("%s()" % f.id, node)
        elif isinstance(f, ast.Attribute):
            owner = f.value.id if isinstance(f.value, ast.Name) else None
            if owner == "math":
                if f.attr not in _MATH and f.attr not in _MATH_RENAME:
                    add("math.%s()" % f.attr, node)
            elif owner == self_name and f.attr != "thisMObject":
                add("self.%s()" % f.attr, node)
            elif f.attr[:1] == "M" and f.attr[1:2].isupper():
                if f.attr not in _KNOWN_CLASSES:
                    add("%s()" % f.attr, node)
            elif f.attr not in _KNOWN_METHODS:
                add(".%s()" % f.attr, node)
    return found


# ---------------------------------------------------------------------------
# 別名（import … as・from … import・モジュールの先頭の 別名 = om.MVector など）

def _dotted(node) -> Optional[List[str]]:
    """om.MFnNumericData.kDouble → ["om", "MFnNumericData", "kDouble"]（名前と . だけの式でなければ None）"""
    parts = []
    while isinstance(node, ast.Attribute):
        parts.append(node.attr)
        node = node.value
    if not isinstance(node, ast.Name):
        return None
    return [node.id] + parts[::-1]


def _dotted_expr(parts: List[str]) -> ast.expr:
    node: ast.expr = ast.Name(id=parts[0], ctx=ast.Load())
    for p in parts[1:]:
        node = ast.Attribute(value=node, attr=p, ctx=ast.Load())
    return node


class AliasResolver(ast.NodeTransformer):
    """別名を元の名前に戻す（変換はクラス・メソッドの名前の最後の部分と、math の名前で見るため）。
    関数の中で同じ名前に値を入れていれば、その関数の中では置き換えない"""

    def __init__(self, tree: ast.Module):
        self.aliases: Dict[str, List[str]] = {}
        self.stack: List[set] = []
        modules: Dict[str, str] = {}
        star_math = False
        stmts = []
        for st in tree.body:                             # try: import … except: … の中も見る
            stmts.append(st)
            if isinstance(st, (ast.Try, ast.If)):
                stmts += list(st.body) + [x for h in getattr(st, "handlers", []) for x in h.body] + list(st.orelse)
        for st in stmts:
            if isinstance(st, ast.Import):
                for a in st.names:
                    if a.asname:
                        modules[a.asname] = a.name
                        if a.name == "math" and a.asname != "math":
                            self.aliases[a.asname] = ["math"]
                    else:
                        modules[a.name.split(".")[0]] = a.name.split(".")[0]
            elif isinstance(st, ast.ImportFrom):
                for a in st.names:
                    if a.name == "*":
                        star_math = star_math or st.module == "math"
                        continue
                    local = a.asname or a.name
                    if st.module == "math":
                        self.aliases[local] = ["math", a.name]
                    else:
                        modules[local] = "%s.%s" % (st.module, a.name)
                        if local != a.name:
                            self.aliases[local] = [a.name]
            elif isinstance(st, ast.Assign) and len(st.targets) == 1 and isinstance(st.targets[0], ast.Name):
                parts = _dotted(st.value)
                if parts and len(parts) >= 2 and (parts[0] in modules or parts[0] in self.aliases):
                    root = self.aliases.get(parts[0], [parts[0]])
                    self.aliases[st.targets[0].id] = root + parts[1:]
        if star_math:
            for name in _MATH | set(_MATH_RENAME) | {"pi", "e"}:
                self.aliases.setdefault(name, ["math", name])

    def resolve(self, tree: ast.Module) -> ast.Module:
        if not self.aliases:
            return tree
        return ast.fix_missing_locations(self.visit(tree))

    def visit_FunctionDef(self, node):
        stored = {a.arg for a in node.args.args + node.args.kwonlyargs}
        stored |= {n.id for n in ast.walk(node) if isinstance(n, ast.Name) and isinstance(n.ctx, (ast.Store, ast.Del))}
        self.stack.append(stored)
        self.generic_visit(node)
        self.stack.pop()
        return node

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load) and node.id in self.aliases and not any(node.id in s for s in self.stack):
            return ast.copy_location(_dotted_expr(self.aliases[node.id]), node)
        return node


# ---------------------------------------------------------------------------
# モジュール（登録・クラス・定数）
# ---------------------------------------------------------------------------

class ModuleInfo:
    def __init__(self, tree: ast.Module):
        self.tree = tree
        self.consts: Dict[str, object] = {}
        self.classes: Dict[str, ast.ClassDef] = {}
        self.functions: Dict[str, ast.FunctionDef] = {}
        self.tuples: Dict[str, List[ast.expr]] = {}
        self.api = self.detect_api(tree)
        for s in tree.body:
            if isinstance(s, ast.ClassDef):
                self.classes[s.name] = s
            elif isinstance(s, ast.FunctionDef):
                self.functions[s.name] = s
            elif isinstance(s, ast.Assign) and len(s.targets) == 1 and isinstance(s.targets[0], ast.Name):
                name = s.targets[0].id
                v = _const(s.value)
                if v is not None:
                    self.consts[name] = v
                elif isinstance(s.value, (ast.Tuple, ast.List)):
                    self.tuples[name] = list(s.value.elts)

    @staticmethod
    def detect_api(tree: ast.Module) -> int:
        """Maya の Python API の版（2: maya.api.OpenMaya・maya_useNewAPI、1: maya.OpenMaya・OpenMayaMPx）"""
        old = False
        for s in ast.walk(tree):
            if isinstance(s, ast.FunctionDef) and s.name == "maya_useNewAPI":
                return 2
            names = []
            if isinstance(s, ast.Import):
                names = [a.name for a in s.names]
            elif isinstance(s, ast.ImportFrom):
                names = [s.module or ""] + ["%s.%s" % (s.module, a.name) for a in s.names]
            for n in names:
                if n.startswith("maya.api"):
                    return 2
                if n.startswith("maya.OpenMaya") or n == "maya":
                    old = True
        return 1 if old else 2

    def constant(self, name: str, cls: Optional[ast.ClassDef] = None):
        return self.consts.get(name)

    def chain(self, cls: ast.ClassDef) -> List[ast.ClassDef]:
        """クラスと、このファイルの中の親クラス（子 → 親の順）"""
        out, todo = [], [cls]
        while todo:
            c = todo.pop(0)
            if c in out:
                continue
            out.append(c)
            for b in c.bases:
                name = _tail(b)
                if name in self.classes:
                    todo.append(self.classes[name])
        return out

    def class_constant(self, cls_name: str, attr: str):
        cls = self.classes.get(cls_name)
        if cls is None:
            return None
        for c in self.chain(cls):
            for s in c.body:
                if isinstance(s, ast.Assign) and len(s.targets) == 1 and isinstance(s.targets[0], ast.Name) \
                        and s.targets[0].id == attr:
                    return _const(s.value)
        return None

    def method(self, cls: ast.ClassDef, name: str) -> Optional[ast.FunctionDef]:
        for c in self.chain(cls):
            m = next((s for s in c.body if isinstance(s, ast.FunctionDef) and s.name == name), None)
            if m is not None:
                return m
        return None

    def registrations(self) -> Tuple[List[dict], Optional[str], List[str]]:
        """[(型の名前, クラス, 初期化の関数, 行)]・プラグインの版・問題"""
        fn = self.functions.get("initializePlugin")
        if fn is None:
            return [], None, ["initializePlugin がありません"]
        regs: List[dict] = []
        problems: List[str] = []
        version = [None]

        def value(node, env):
            if isinstance(node, ast.Name) and node.id in env:
                return env[node.id]
            c = _const(node)
            if c is not None:
                return c
            if isinstance(node, ast.Name):
                return self.consts.get(node.id, ("name", node.id))
            if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
                owner = env.get(node.value.id, ("class", node.value.id))
                if isinstance(owner, tuple) and owner[0] == "class":
                    v = self.class_constant(owner[1], node.attr)
                    return v if v is not None else ("member", owner[1], node.attr)
            return None

        def walk(stmts, env):
            for s in stmts:
                if isinstance(s, ast.For) and isinstance(s.target, ast.Name):
                    items = s.iter.elts if isinstance(s.iter, (ast.Tuple, ast.List)) else (
                        self.tuples.get(s.iter.id) if isinstance(s.iter, ast.Name) else None)
                    for it in items or []:
                        if isinstance(it, ast.Name):
                            walk(s.body, dict(env, **{s.target.id: ("class", it.id)}))
                    continue
                for part in ("body", "orelse", "finalbody"):
                    if part != "body" or not isinstance(s, (ast.Expr, ast.Assign)):
                        walk(getattr(s, part, []) or [], env)
                for h in getattr(s, "handlers", []) or []:
                    walk(h.body, env)
                for c in ast.walk(s) if isinstance(s, (ast.Expr, ast.Assign)) else []:
                    if not isinstance(c, ast.Call):
                        continue
                    name = _tail(c.func)
                    if name == "MFnPlugin" and len(c.args) >= 3 and isinstance(_const(c.args[2]), str):
                        version[0] = _const(c.args[2])
                    if name == "registerNode" and len(c.args) >= 4:
                        type_name = value(c.args[0], env)
                        if not isinstance(type_name, str):
                            problems.append("%d 行目: 登録するノードの型の名前が分かりません" % c.lineno)
                            continue
                        cls = self.creator_class(c.args[2], env)
                        init = self.initializer(c.args[3], env)
                        regs.append({"type": type_name, "class": cls, "init": init, "line": c.lineno})
        walk(fn.body, {})
        return regs, version[0], problems

    def creator_class(self, node, env) -> Optional[ast.ClassDef]:
        if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
            owner = env.get(node.value.id, ("class", node.value.id))
            if isinstance(owner, tuple) and owner[0] == "class":
                return self.classes.get(owner[1])
        if isinstance(node, ast.Name) and node.id in self.functions:
            for sub in ast.walk(self.functions[node.id]):
                if isinstance(sub, ast.Call) and isinstance(sub.func, ast.Name) and sub.func.id in self.classes:
                    return self.classes[sub.func.id]
        if isinstance(node, ast.Lambda):
            for sub in ast.walk(node.body):
                if isinstance(sub, ast.Call) and isinstance(sub.func, ast.Name) and sub.func.id in self.classes:
                    return self.classes[sub.func.id]
        return None

    def initializer(self, node, env) -> Optional[Tuple[ast.FunctionDef, Optional[ast.ClassDef]]]:
        if isinstance(node, ast.Attribute) and isinstance(node.value, ast.Name):
            owner = env.get(node.value.id, ("class", node.value.id))
            if isinstance(owner, tuple) and owner[0] == "class" and owner[1] in self.classes:
                cls = self.classes[owner[1]]
                m = self.method(cls, node.attr)
                return (m, cls) if m is not None else None
        if isinstance(node, ast.Name) and node.id in self.functions:
            return self.functions[node.id], None
        return None


# ---------------------------------------------------------------------------
# 変換
# ---------------------------------------------------------------------------

class NodeResult:
    def __init__(self, type_name: str, cls_name: str, line: int):
        self.type = type_name
        self.cls = cls_name
        self.line = line
        self.spec: Optional[dict] = None
        self.problems: List[Tuple[int, str]] = []
        self.notes: List[str] = []
        self.unknown: Dict[str, List[int]] = {}         # 解釈できない関数・メソッド → 行番号

    @property
    def ok(self) -> bool:
        return self.spec is not None and not self.problems


def _attr_summary(spec: dict) -> str:
    """{"name": "aaa_in", "short": "in", "type": "matrix"} → aaa_in（in・matrix）"""
    text = "%s（%s・%s%s）" % (spec["name"], spec.get("short", spec["name"]), spec.get("type", "double"),
                            "・出力" if spec.get("output") else "")
    kids = spec.get("children") or []
    if kids:
        text += "［%s］" % "・".join(k["name"] + ("/" + k["short"] if k.get("short") else "") if isinstance(k, dict)
                                   else str(k) for k in kids)
    return text


def _names_of(a: AttrInfo) -> set:
    names = {a.long, a.short}
    for c in a.children:
        names |= _names_of(c)
    return names


def dedupe_attributes(scanner: "AttrScanner", r: "NodeResult") -> List[AttrInfo]:
    """定義に入れる属性。addAttribute していない属性と名前が重なるもの（if の両側で作るなど）は、先のものだけ使う"""
    out: List[AttrInfo] = []
    seen: Dict[str, AttrInfo] = {}
    for a in scanner.top_level():
        clash = [n for n in sorted(_names_of(a)) if n in seen and seen[n] is not a]
        if clash and a not in scanner.added:
            r.notes.append("%d 行目: 属性 %s は、%d 行目の属性と名前（%s）が重なるので使いません"
                           % (a.line, a.long, seen[clash[0]].line, "・".join(clash)))
            continue
        if clash:
            r.problems.append((a.line, "属性 %s の名前（%s）が、%d 行目で作った属性と重なっています"
                               % (a.long, "・".join(clash), seen[clash[0]].line)))
        for n in _names_of(a):
            seen.setdefault(n, a)
        out.append(a)
    return out


def convert_source(source: str, filename: str = "plugin.py", plugin: Optional[str] = None,
                   plugin_version: Optional[str] = None) -> Tuple[dict, List[NodeResult], List[str]]:
    """プラグインのソース → (定義のファイルの内容, ノードごとの結果, 全体の問題)"""
    try:
        tree = ast.parse(source, filename=filename)
    except SyntaxError as exc:
        return {}, [], ["%d 行目: プラグインの書き方の誤り（%s）" % (exc.lineno or 0, exc.msg)]
    tree = AliasResolver(tree).resolve(tree)
    module = ModuleInfo(tree)
    regs, version, problems = module.registrations()
    if not regs and not problems:
        problems.append("registerNode が見つかりません（initializePlugin で登録しているノードがありません）")
    results: List[NodeResult] = []
    nodes = {}
    for reg in regs:
        cls = reg["class"]
        r = NodeResult(reg["type"], cls.name if cls is not None else "?", reg["line"])
        results.append(r)
        if cls is None:
            r.problems.append((reg["line"], "ノードのクラス（作成の関数が返すもの）が分かりません"))
            continue
        if reg["init"] is None:
            r.problems.append((reg["line"], "初期化の関数が分かりません"))
            continue
        init_fn, _init_cls = reg["init"]
        scanner = AttrScanner(module, cls)
        try:
            for c in reversed(module.chain(cls)):
                scanner.scan_class(c)
            scanner.scan(init_fn)
        except ConvertError as exc:
            r.problems.append((exc.line, "属性: %s" % exc))
            continue
        compute = module.method(cls, "compute")
        if compute is None:
            r.problems.append((cls.lineno, "compute がありません（%s）" % cls.name))
            continue
        r.unknown = unknown_calls(compute, module)
        outputs = scanner.outputs()
        tops = dedupe_attributes(scanner, r)
        unsupported = [a for a in tops if not a.supported]
        for a in unsupported:
            r.notes.append("%d 行目: 属性 %s は扱えないので定義に入れません（%s）"
                           % (a.line, a.long, a.type.split(":", 1)[-1]))
        try:
            tr = Translator(scanner, module, cls, compute)
            tr.kept = [a for a in tops if a.supported]
            lines = tr.translate()
        except ConvertError as exc:
            r.problems.append((exc.line, str(exc)))
            continue
        r.problems.extend(tr.problems)
        r.notes.extend(scanner.notes + tr.notes)
        if r.problems:
            continue
        for a in tr.written:
            if a not in outputs:
                # attributeAffects に出てこないが、compute で値を書き込んでいる → 出力
                outputs.append(a)
                r.notes.append("属性 %s は attributeAffects にありませんが、compute で値を書き込んでいるので出力にします" % a.long)
        written = {line.split("=")[0].strip().split("[")[0].split(".")[0] for line in lines if "=" in line}
        spec = {"description": "%s の %s から変換（convert-plugin %s）" % (os.path.basename(filename), cls.name, VERSION),
                "attributes": [a.spec(outputs) for a in tops if a.supported],
                "compute": lines or ["pass"]}
        if not any(a.get("output") for a in spec["attributes"]):
            r.problems.append((cls.lineno, "出力の属性が分かりません（attributeAffects がありません）"))
            continue
        missing = [a.long for a in outputs if a.long not in written]
        if missing:
            r.notes.append("出力 %s に値を書き込む文が見つかりません（定義ではその出力は既定値のままです）" % "・".join(missing))
        try:
            ND.NodeDef(r.type, spec, filename, plugin, plugin_version)
        except ND.DefError as exc:
            where = ""
            if exc.line and 0 < exc.line <= len(spec["compute"]):
                where = "\n        変換した計算の %d 行目: %s" % (exc.line, spec["compute"][exc.line - 1].strip())
            elif not exc.line:
                # 属性の誤り（名前の重なりなど）→ 変換した属性の一覧
                where = "\n        変換した属性: %s" % "、".join(_attr_summary(a) for a in spec["attributes"])
            r.problems.append((0, "変換した計算の検証で誤り（変換ツールの不具合の可能性があります）: %s%s"
                               % (exc.text(), where)))
            continue
        r.spec = spec
        nodes[r.type] = spec
    data = {"format": ND.FORMAT, "version": 1,
            "plugin": plugin or os.path.splitext(os.path.basename(filename))[0],
            "pluginVersion": plugin_version or version or "",
            "nodes": nodes}
    if not data["pluginVersion"]:
        del data["pluginVersion"]
    return data, results, problems


def convert_file(path: str, plugin: Optional[str] = None, plugin_version: Optional[str] = None):
    with open(path, encoding="utf-8") as f:
        source = f.read()
    return convert_source(source, os.path.basename(path), plugin, plugin_version)


def report_text(path: str, data: dict, results: List[NodeResult], problems: List[str]) -> str:
    version = data.get("pluginVersion")
    out = ["プラグインの変換: %s（プラグイン %s%s）" % (path, data.get("plugin", "?"), " " + version if version else "")]
    for p in problems:
        out.append("  ★ %s" % p)
    for r in results:
        if r.ok:
            outs = [a["name"] for a in r.spec["attributes"] if a.get("output")]
            ins = [a["name"] for a in r.spec["attributes"] if not a.get("output")]
            out.append("  ○ %s（%s）入力 %s → 出力 %s" % (r.type, r.cls, "・".join(ins) or "なし", "・".join(outs)))
        else:
            out.append("  ★ %s（%s）: 変換できません" % (r.type, r.cls))
            for line, msg in r.problems:
                out.append("      %s%s" % ("%d 行目: " % line if line else "", msg))
        for n in r.notes:
            out.append("      ※ %s" % n)
        if r.unknown and not r.ok:
            out.append("      解釈できない関数・メソッド: %s" % "、".join(
                "%s（%s 行目）" % (name, "・".join(str(x) for x in lines)) for name, lines in r.unknown.items()))
    ok = sum(1 for r in results if r.ok)
    out.append("変換できたノード: %d / %d" % (ok, len(results)))
    summary = unknown_summary(results)
    if summary:
        out.append("")
        out.append("■ 解釈できない関数・メソッドの一覧（変換できなかったノードの compute。対応を相談するときに使ってください）")
        for name, where in summary:
            out.append("  %s: %s" % (name, "、".join(where)))
    return "\n".join(out)


def unknown_summary(results: List[NodeResult]) -> List[Tuple[str, List[str]]]:
    """変換できなかったノードの、解釈できない関数・メソッド → [ノードの型（行番号）]（名前の順）"""
    table: Dict[str, List[str]] = {}
    for r in results:
        if r.ok:
            continue
        for name, lines in r.unknown.items():
            table.setdefault(name, []).append("%s（%s 行目）" % (r.type, "・".join(str(x) for x in lines)))
    return sorted(table.items(), key=lambda kv: kv[0].lstrip(".").lower())
