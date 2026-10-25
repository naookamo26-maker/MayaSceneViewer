# -*- coding: utf-8 -*-
"""自作ノード（プラグイン）の定義: 属性と計算を書いた定義ファイルで、型を知らないノードを評価する。

定義ファイルは、ツールの配布者が用意してビューアに同梱する（ma_viewer/node_defs/*.json。exe にも含める）。
利用者の環境にプラグインや Maya がなくても、定義があればそのノードの計算をビューアで再現できる。
書き方は docs/node_definitions.md。

  {
    "format": "maya-scene-viewer-node-definitions", "version": 1,
    "plugin": "myRigPlugin", "pluginVersion": "1.0",
    "nodes": {
      "weightedSum": {
        "attributes": [
          {"name": "input", "short": "in", "type": "double", "array": true},
          {"name": "weight", "short": "w", "type": "double", "array": true, "default": 1},
          {"name": "output", "short": "o", "type": "double", "output": true}
        ],
        "compute": [
          "total = 0",
          "for i in indices(input):",
          "    total += input[i] * weight[i]",
          "output = total"
        ]
      }
    }
  }

計算（compute）は Python の書き方の一部（代入・if・for・式・関数の呼び出し）。ここで ast で構文を解析して
検証し、ビューア（web_src/src/nodeDef.js）が評価する木の形（IR）に変換する。プラグインのコードは実行しない。
"""
from __future__ import annotations

import ast
import json
import os
import re
from typing import Dict, List, Optional, Tuple


FORMAT = "maya-scene-viewer-node-definitions"
DEF_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "node_defs")

# 属性の型
NUMBER_TYPES = {"double", "float", "int", "bool", "enum", "angle", "distance", "time"}
VECTOR_TYPES = {"vector": 3, "double3": 3, "float3": 3, "angle3": 3, "double2": 2, "float2": 2, "double4": 4}
ALL_TYPES = NUMBER_TYPES | set(VECTOR_TYPES) | {"matrix", "compound"}

# 計算で使える関数: 名前 → (最少の引数, 最多の引数)。None は上限なし
FUNCTIONS: Dict[str, Tuple[int, Optional[int]]] = {
    # 数
    "sin": (1, 1), "cos": (1, 1), "tan": (1, 1), "asin": (1, 1), "acos": (1, 1), "atan": (1, 1), "atan2": (2, 2),
    "sqrt": (1, 1), "pow": (2, 2), "exp": (1, 1), "log": (1, 2), "log10": (1, 1), "abs": (1, 1), "floor": (1, 1),
    "ceil": (1, 1), "round": (1, 2), "trunc": (1, 1), "sign": (1, 1), "min": (1, None), "max": (1, None),
    "clamp": (3, 3), "lerp": (3, 3), "smoothstep": (3, 3), "radians": (1, 1), "degrees": (1, 1), "hypot": (2, 2),
    "fmod": (2, 2), "int": (1, 1), "float": (1, 1), "bool": (1, 1),
    # ベクトル（数のリスト）
    "vector": (3, 3), "dot": (2, 2), "cross": (2, 2), "length": (1, 1), "normalize": (1, 1), "distance": (2, 2),
    "angle": (2, 2),
    # 行列（Maya と同じ行ベクトルの規約。m1 * m2 は m1 を先に掛ける）
    "identity": (0, 0), "matrix": (1, 1), "inverse": (1, 1), "transpose": (1, 1), "compose": (3, 4),
    "translation": (1, 1), "rotation": (1, 2), "scale": (1, 1), "xform_point": (2, 2), "xform_vector": (2, 2),
    "element": (3, 3), "set_element": (4, 4), "matrix_values": (1, 1), "determinant": (1, 1), "determinant3": (1, 1),
    "equivalent": (2, 3),
    # 四元数（[x, y, z, w]）
    "quat_from_euler": (1, 2), "euler_from_quat": (1, 2), "quat_from_matrix": (1, 1), "matrix_from_quat": (1, 1),
    "quat_mul": (2, 2), "quat_slerp": (3, 3), "quat_inverse": (1, 1), "quat_normalize": (1, 1),
    # 範囲
    "range": (1, 3),
}
# 引数に属性そのもの（値ではなく）を取る関数
ATTR_FUNCTIONS = {"indices": "配列の属性の、存在する要素の番号", "count": "配列の属性の要素の数",
                  "connected": "属性が接続されているか"}
CONSTANTS = {"pi": 3.141592653589793, "e": 2.718281828459045, "True": 1, "False": 0}
TIME_NAMES = {"frame", "time"}          # いまのフレーム・秒

_BIN_OPS = {ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/", ast.FloorDiv: "//", ast.Mod: "%", ast.Pow: "**"}
_CMP_OPS = {ast.Eq: "==", ast.NotEq: "!=", ast.Lt: "<", ast.LtE: "<=", ast.Gt: ">", ast.GtE: ">="}
_COMPONENTS = {"x": 0, "y": 1, "z": 2, "w": 3}
_ELEM_RE = re.compile(r"([A-Za-z_]\w*)(?:\[([^\]]*)\])?")


def _reverse_aliases() -> Dict[str, List[str]]:
    """.ma の読み込みで標準ノードの別名に置き換えた名前（ip）→ 元の名前の候補（input）"""
    from .ma_reader import ATTR_ALIASES
    out: Dict[str, List[str]] = {}
    for long_name, short in ATTR_ALIASES.items():
        out.setdefault(short, []).append(long_name)
    return out


_REV_ALIASES = _reverse_aliases()


class DefError(Exception):
    """定義の誤り（line: 計算の何行目か。0 は計算以外）"""

    def __init__(self, msg: str, line: int = 0):
        super().__init__(msg)
        self.line = line

    def text(self) -> str:
        return ("計算の %d 行目: %s" % (self.line, self)) if self.line else str(self)


# ---------------------------------------------------------------------------
# 属性
# ---------------------------------------------------------------------------

class AttrDef:
    """属性の定義（compound は子を持つ）"""

    def __init__(self, spec: dict, parent: Optional["AttrDef"] = None):
        if not isinstance(spec, dict):
            raise DefError("属性の書き方が違います: %r" % (spec,))
        self.name = spec.get("name")
        if not isinstance(self.name, str) or not re.match(r"^[A-Za-z_]\w*$", self.name):
            raise DefError("属性の名前（name）がないか、使えない文字を含みます: %r" % (self.name,))
        self.short = spec.get("short") or self.name
        if not re.match(r"^[A-Za-z_]\w*$", self.short):
            raise DefError("%s: 短い名前（short）に使えない文字を含みます" % self.name)
        self.type = spec.get("type", "double")
        if self.type not in ALL_TYPES:
            raise DefError("%s: 型 %r は使えません（%s）" % (self.name, self.type, "・".join(sorted(ALL_TYPES))))
        self.array = bool(spec.get("array", False))
        self.output = bool(spec.get("output", parent.output if parent else False))
        self.parent = parent
        self.default = spec.get("default")
        self.children: List[AttrDef] = []
        self.components: List[str] = []           # ベクトルの成分の属性（短い名前）
        if self.type == "compound":
            kids = spec.get("children")
            if not isinstance(kids, list) or not kids:
                raise DefError("%s: compound には子の属性（children）が必要です" % self.name)
            self.children = [AttrDef(k, self) for k in kids]
        elif self.type in VECTOR_TYPES:
            n = VECTOR_TYPES[self.type]
            comps = spec.get("children")
            if comps is None:
                comps = [self.short + s for s in "xyzw"[:n]]   # 既定: 短い名前 + x・y・z（Maya の tx・ty・tz と同じ）
            if not isinstance(comps, list) or len(comps) != n:
                raise DefError("%s: 成分の属性（children）は %d 個の名前で書いてください" % (self.name, n))
            self.components = [c["short"] if isinstance(c, dict) else str(c) for c in comps]
            self.component_names = [c["name"] if isinstance(c, dict) and "name" in c else str(c) for c in comps]
        if self.default is None:
            self.default = self._default()
        self._check_default()

    def _default(self):
        if self.type in VECTOR_TYPES:
            return [0.0] * VECTOR_TYPES[self.type]
        if self.type == "matrix":
            return [1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0]
        if self.type == "compound":
            return None
        return 0.0

    def _check_default(self):
        d = self.default
        if self.type in VECTOR_TYPES:
            ok = isinstance(d, list) and len(d) == VECTOR_TYPES[self.type] and all(isinstance(x, (int, float)) for x in d)
        elif self.type == "matrix":
            ok = isinstance(d, list) and len(d) == 16 and all(isinstance(x, (int, float)) for x in d)
        elif self.type == "compound":
            ok = d is None
        else:
            ok = isinstance(d, (int, float))
        if not ok:
            raise DefError("%s: 既定値（default）が型 %s に合いません: %r" % (self.name, self.type, d))

    def find_child(self, name: str) -> Optional["AttrDef"]:
        return next((c for c in self.children if name in (c.name, c.short)), None)

    def to_json(self) -> dict:
        out = {"name": self.name, "short": self.short, "type": self.type}
        if self.array:
            out["array"] = True
        if self.output:
            out["output"] = True
        if self.default is not None:
            out["default"] = self.default
        if self.children:
            out["children"] = [c.to_json() for c in self.children]
        if self.components:
            out["components"] = self.components
        return out


class NodeDef:
    """1 つのノードの型の定義"""

    def __init__(self, type_name: str, spec: dict, source: str, plugin: Optional[str], plugin_version: Optional[str]):
        self.type = type_name
        self.source = source
        self.plugin = plugin
        self.plugin_version = plugin_version
        self.description = spec.get("description", "")
        attrs = spec.get("attributes")
        if not isinstance(attrs, list) or not attrs:
            raise DefError("属性（attributes）がありません")
        self.attrs = [AttrDef(a) for a in attrs]
        self.by_name: Dict[str, AttrDef] = {}
        for a in self._all_attrs():
            for key in {a.name, a.short} | set(a.components) | set(getattr(a, "component_names", [])):
                if key in self.by_name and self.by_name[key] is not a:
                    raise DefError("属性の名前 %s が重なっています" % key)
                self.by_name[key] = a
        if not any(a.output for a in self.attrs):
            raise DefError("出力の属性（\"output\": true）がありません")
        code = spec.get("compute")
        if isinstance(code, list):
            code = "\n".join(str(x) for x in code)
        if not isinstance(code, str) or not code.strip():
            raise DefError("計算（compute）がありません")
        self.code = code
        self.ir = Compiler(self).compile(code)

    def _all_attrs(self):
        stack = list(self.attrs)
        while stack:
            a = stack.pop(0)
            yield a
            stack.extend(a.children)

    def top(self, name: str) -> Optional[AttrDef]:
        return next((a for a in self.attrs if name in (a.name, a.short)), None)

    def _lookup(self, name: str, find):
        """名前で引く。.ma の読み込みで標準の別名に置き換わった名前（input → ip）は、元の名前でも引く"""
        a = find(name)
        if a is None:
            for orig in _REV_ALIASES.get(name, ()):
                a = find(orig)
                if a is not None:
                    break
        return a

    def to_json(self) -> dict:
        """ビューアに渡す形（共通 JSON の animation.nodeDefs）"""
        return {"type": self.type, "attributes": [a.to_json() for a in self.attrs], "ir": self.ir}

    # ---- 属性名の正規化（.ma の長い名前・短い名前 → 短い名前）
    def normalize_plug(self, attr: str) -> str:
        """input[2] → in[2]、target[0].targetMatrix → tg[0].tm、ベクトルの成分は成分の短い名前"""
        # 標準ノードの別名（input → ip など）は当てはめない（自作ノードの属性の名前なので）
        elems = _ELEM_RE.findall(attr)
        if not elems or ".".join(n + ("[%s]" % i if i else "") for n, i in elems) != attr:
            return attr
        out = []
        scope: Optional[AttrDef] = None
        for k, (name, idx) in enumerate(elems):
            a = None
            if scope is None:
                a = self._lookup(name, lambda x: self.top(x) or self._component(x))
            elif scope.children:
                a = self._lookup(name, scope.find_child)
            if a is None and scope is None and k == 0:
                # compound（配列でない）の子は、親を書かずに子の名前だけでも書ける
                a = self._lookup(name, lambda x: next((c for c in self._all_attrs() if c.parent is not None
                                                       and not c.parent.array and x in (c.name, c.short)), None))
            if a is None:
                out.append(name + ("[%s]" % idx if idx else ""))
                scope = None
                continue
            if isinstance(a, tuple):                  # ベクトルの成分
                out.append(a[1] + ("[%s]" % idx if idx else ""))
                scope = None
                continue
            out.append(a.short if not idx else "%s[%s]" % (a.short, idx))
            scope = a
        # compound（配列でない）の子は、子の短い名前だけにそろえる（node.ctl.gn → gn）
        if len(out) >= 2 and "[" not in out[0]:
            parent = self.top(out[0].split("[")[0])
            if parent is not None and parent.children and not parent.array:
                out = out[1:]
        return ".".join(out)

    def _component(self, name: str):
        for a in self._all_attrs():
            names = getattr(a, "component_names", [])
            for k, c in enumerate(a.components):
                if name == c or (k < len(names) and name == names[k]):
                    return (a, c)
        return None


# ---------------------------------------------------------------------------
# 計算の変換（Python の書き方の一部 → IR）
#
# 式:   ["n", 数]  ["v", [式...]]  ["l", 名前]  ["a", 属性のパス]  ["b", 演算子, 式, 式]  ["u", 演算子, 式]
#       ["if", 条件, 式, 式]  ["c", 関数名, [式...]]  ["i", 式, 添字の式]  ["g", 式, 成分の番号]
#       属性のパス: [[短い名前, 添字の式 or None], ...]（compound の子は 2 つ目以降）
# 文:   ["set", 代入先, 式]  ["aug", 演算子, 代入先, 式]  ["if", 条件, [文...], [文...]]
#       ["for", 変数名, 式, [文...]]  ["break"]  ["continue"]
#       代入先: ["l", 名前]  ["o", 属性のパス]  ["li", 名前, 添字の式]
# ---------------------------------------------------------------------------

class Compiler:
    def __init__(self, nd: NodeDef):
        self.nd = nd
        self.locals: set = set()

    def compile(self, code: str) -> list:
        try:
            tree = ast.parse(code, mode="exec")
        except SyntaxError as exc:
            raise DefError("書き方の誤り（%s）" % exc.msg, exc.lineno or 0)
        # 代入される名前（ローカル変数と出力）を先に集める
        for node in ast.walk(tree):
            if isinstance(node, (ast.Assign, ast.AugAssign, ast.For)):
                targets = node.targets if isinstance(node, ast.Assign) else [node.target]
                for t in targets:
                    if isinstance(t, ast.Name) and self.nd.top(t.id) is None:
                        self.locals.add(t.id)
        for name in self.locals:
            if name in FUNCTIONS or name in ATTR_FUNCTIONS or name in CONSTANTS or name in TIME_NAMES:
                raise DefError("%s は関数・定数の名前なので、変数には使えません" % name)
        return self.block(tree.body)

    def err(self, node, msg):
        raise DefError(msg, getattr(node, "lineno", 0))

    # ---- 文
    def block(self, stmts) -> list:
        return [self.stmt(s) for s in stmts if not isinstance(s, ast.Pass)
                and not (isinstance(s, ast.Expr) and isinstance(s.value, ast.Constant) and isinstance(s.value.value, str))]

    def stmt(self, s) -> list:
        if isinstance(s, ast.Assign):
            if len(s.targets) != 1:
                self.err(s, "a = b = c のような連続した代入は使えません")
            return ["set", self.target(s.targets[0]), self.expr(s.value)]
        if isinstance(s, ast.AugAssign):
            op = _BIN_OPS.get(type(s.op))
            if op is None:
                self.err(s, "使えない演算子です")
            return ["aug", op, self.target(s.target), self.expr(s.value)]
        if isinstance(s, ast.If):
            return ["if", self.expr(s.test), self.block(s.body), self.block(s.orelse)]
        if isinstance(s, ast.For):
            if not isinstance(s.target, ast.Name):
                self.err(s, "for の変数は 1 つの名前にしてください")
            if s.target.id not in self.locals:
                self.err(s, "for の変数 %s は属性の名前と同じです。別の名前にしてください" % s.target.id)
            if s.orelse:
                self.err(s, "for … else は使えません")
            return ["for", s.target.id, self.expr(s.iter, allow_attr_calls=True), self.block(s.body)]
        if isinstance(s, ast.Break):
            return ["break"]
        if isinstance(s, ast.Continue):
            return ["continue"]
        names = {ast.While: "while（終わらない恐れがあるため）", ast.FunctionDef: "関数の定義（def）",
                 ast.Return: "return", ast.Import: "import", ast.ImportFrom: "import", ast.ClassDef: "class",
                 ast.With: "with", ast.Try: "try", ast.Delete: "del", ast.Global: "global"}
        what = next((v for k, v in names.items() if isinstance(s, k)), type(s).__name__)
        self.err(s, "%s は使えません" % what)

    def target(self, t) -> list:
        if isinstance(t, ast.Name):
            if t.id in self.locals:
                return ["l", t.id]
            a = self.nd.top(t.id)
            if a is None:
                self.err(t, "代入先 %s が分かりません" % t.id)
            if not a.output:
                self.err(t, "入力の属性 %s には代入できません（ローカル変数には別の名前を使ってください）" % t.id)
            if a.array or a.type == "compound":
                self.err(t, "%s は配列・compound なので、要素（%s[i]・%s[i].子）に代入してください" % (t.id, t.id, t.id))
            return ["o", [[a.short, None]]]
        if isinstance(t, ast.Subscript) and isinstance(t.value, ast.Name) and t.value.id in self.locals:
            return ["li", t.value.id, self.expr(self._index(t))]
        path, a = self.attr_path(t)
        if path is None:
            self.err(t, "この形の代入先は使えません")
        if not a.output:
            self.err(t, "入力の属性 %s には代入できません" % a.name)
        if a.array and path[-1][1] is None:
            self.err(t, "配列の属性 %s は要素（[i]）に代入してください" % a.name)
        return ["o", path]

    # ---- 属性のパス（input[i]・target[i].matrix）
    def attr_path(self, node):
        """属性を指す式なら (パス, 属性の定義)。属性でなければ (None, None)"""
        if isinstance(node, ast.Name):
            if node.id in self.locals:
                return None, None
            a = self.nd.top(node.id)
            return ([[a.short, None]], a) if a is not None else (None, None)
        if isinstance(node, ast.Subscript):
            path, a = self.attr_path(node.value)
            if path is None or a is None:
                return None, None
            if not a.array:
                return None, None                     # ベクトルの成分（vec[0]）などは値の添字として扱う
            if path[-1][1] is not None:
                self.err(node, "%s の添字が 2 重です" % a.name)
            path = [list(p) for p in path]
            path[-1][1] = self.expr(self._index(node))
            return path, a
        if isinstance(node, ast.Attribute):
            path, a = self.attr_path(node.value)
            if path is None or a is None or not a.children:
                return None, None
            if a.array and path[-1][1] is None:
                self.err(node, "配列の compound %s は要素を選んでから子を書いてください（%s[i].%s）"
                         % (a.name, a.name, node.attr))
            c = a.find_child(node.attr)
            if c is None:
                self.err(node, "%s に子の属性 %s はありません" % (a.name, node.attr))
            return path + [[c.short, None]], c
        return None, None

    @staticmethod
    def _index(sub):
        return sub.slice                              # Python 3.9 以降（ast.Index で包まれない）

    # ---- 式
    def expr(self, e, allow_attr_calls: bool = False) -> list:
        path, a = self.attr_path(e)
        if path is not None:
            if a.output:
                self.err(e, "出力の属性 %s は読めません（計算した値はローカル変数に入れてください）" % a.name)
            if a.array and path[-1][1] is None:
                self.err(e, "配列の属性 %s は要素（%s[i]）を読むか、indices(%s) でたどってください" % (a.name, a.name, a.name))
            if a.type == "compound":
                self.err(e, "compound %s は子の属性（%s.子）を読んでください" % (a.name, a.name))
            return ["a", path]
        if isinstance(e, ast.Constant):
            v = e.value
            if isinstance(v, bool):
                return ["n", 1 if v else 0]
            if isinstance(v, (int, float)):
                return ["n", v]
            self.err(e, "数以外の値（%r）は使えません" % (v,))
        if isinstance(e, ast.Name):
            if e.id in self.locals:
                return ["l", e.id]
            if e.id in CONSTANTS:
                return ["n", CONSTANTS[e.id]]
            if e.id in TIME_NAMES:
                return ["c", e.id, []]
            if e.id in FUNCTIONS or e.id in ATTR_FUNCTIONS:
                self.err(e, "%s は関数です（%s(…) と呼んでください）" % (e.id, e.id))
            self.err(e, "名前 %s が分かりません（属性・変数・関数のどれでもありません）" % e.id)
        if isinstance(e, ast.BinOp):
            op = _BIN_OPS.get(type(e.op))
            if op is None:
                self.err(e, "使えない演算子です")
            return ["b", op, self.expr(e.left), self.expr(e.right)]
        if isinstance(e, ast.UnaryOp):
            if isinstance(e.op, ast.USub):
                return ["u", "-", self.expr(e.operand)]
            if isinstance(e.op, ast.UAdd):
                return self.expr(e.operand)
            if isinstance(e.op, ast.Not):
                return ["u", "not", self.expr(e.operand)]
            self.err(e, "使えない演算子です")
        if isinstance(e, ast.BoolOp):
            op = "and" if isinstance(e.op, ast.And) else "or"
            out = self.expr(e.values[0])
            for v in e.values[1:]:
                out = ["b", op, out, self.expr(v)]
            return out
        if isinstance(e, ast.Compare):
            parts = []
            left = e.left
            for op_node, right in zip(e.ops, e.comparators):
                op = _CMP_OPS.get(type(op_node))
                if op is None:
                    self.err(e, "使えない比較です（in・is は使えません）")
                parts.append(["b", op, self.expr(left), self.expr(right)])
                left = right
            out = parts[0]
            for p in parts[1:]:
                out = ["b", "and", out, p]
            return out
        if isinstance(e, ast.IfExp):
            return ["if", self.expr(e.test), self.expr(e.body), self.expr(e.orelse)]
        if isinstance(e, (ast.List, ast.Tuple)):
            return ["v", [self.expr(x) for x in e.elts]]
        if isinstance(e, ast.Subscript):
            return ["i", self.expr(e.value), self.expr(self._index(e))]
        if isinstance(e, ast.Attribute):
            if e.attr in _COMPONENTS:
                return ["g", self.expr(e.value), _COMPONENTS[e.attr]]
            self.err(e, ".%s は使えません（ベクトルの成分は .x・.y・.z・.w）" % e.attr)
        if isinstance(e, ast.Call):
            return self.call(e)
        self.err(e, "この書き方（%s）は使えません" % type(e).__name__)

    def call(self, e) -> list:
        if not isinstance(e.func, ast.Name):
            self.err(e, "関数は名前で呼んでください（math.sin ではなく sin）")
        if e.keywords:
            self.err(e, "名前つきの引数（%s=…）は使えません" % e.keywords[0].arg)
        name = e.func.id
        if name in ATTR_FUNCTIONS:
            if len(e.args) != 1:
                self.err(e, "%s は属性を 1 つ取ります" % name)
            path, a = self.attr_path(e.args[0])
            if path is None:
                self.err(e, "%s の引数は属性にしてください（%s(input)）" % (name, name))
            if name in ("indices", "count") and not a.array:
                self.err(e, "%s は配列の属性に使います（%s は配列ではありません）" % (name, a.name))
            return ["c", name, [["p", path]]]
        if name not in FUNCTIONS:
            self.err(e, "関数 %s は使えません" % name)
        lo, hi = FUNCTIONS[name]
        if len(e.args) < lo or (hi is not None and len(e.args) > hi):
            self.err(e, "%s の引数の数が違います" % name)
        return ["c", name, [self.expr(x) for x in e.args]]


# ---------------------------------------------------------------------------
# 読み込みとシーンへの適用
# ---------------------------------------------------------------------------

class Definitions:
    """読み込んだ定義（型 → NodeDef）と、読めなかったもの（型またはファイル → 理由）"""

    def __init__(self):
        self.nodes: Dict[str, NodeDef] = {}
        self.errors: Dict[str, str] = {}

    def __bool__(self):
        return bool(self.nodes) or bool(self.errors)


def load_definitions(paths: Optional[List[str]] = None) -> Definitions:
    """定義ファイル（既定は ma_viewer/node_defs/*.json）を読む。同じ型が複数あれば、後のファイルを優先する"""
    out = Definitions()
    if paths is None:
        paths = sorted(os.path.join(DEF_DIR, f) for f in os.listdir(DEF_DIR)) if os.path.isdir(DEF_DIR) else []
    for p in paths:
        if not p.lower().endswith(".json"):
            continue
        name = os.path.basename(p)
        try:
            with open(p, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, ValueError) as exc:
            out.errors[name] = "読めません（%s）" % exc
            continue
        load_data(out, data, name)
    return out


def load_data(out: Definitions, data, name: str) -> None:
    if not isinstance(data, dict) or data.get("format") != FORMAT:
        out.errors[name] = "定義ファイルの形式（\"format\": \"%s\"）ではありません" % FORMAT
        return
    nodes = data.get("nodes")
    if not isinstance(nodes, dict):
        out.errors[name] = "ノードの定義（nodes）がありません"
        return
    for t, spec in nodes.items():
        try:
            out.nodes[t] = NodeDef(t, spec if isinstance(spec, dict) else {}, name, data.get("plugin"),
                                   data.get("pluginVersion"))
            out.errors.pop(t, None)
        except DefError as exc:
            out.errors[t] = "%s（%s）" % (exc.text(), name)


def apply_definitions(ms, defs: Definitions) -> Dict[str, List[str]]:
    """定義のある型のノードを、定義で評価するノードにする（属性の名前を短い名前にそろえる）。
    戻り値: 型 → ノード名の一覧"""
    applied: Dict[str, List[str]] = {}
    if not defs.nodes:
        return applied
    used = set()
    for n in ms.nodes:
        nd = defs.nodes.get(n.type)
        if nd is None:
            continue
        n.node_def = nd
        applied.setdefault(n.type, []).append(n.name)
        used.add(id(n))
    if not used:
        return applied
    norm = {}

    def rename(n, attr):
        key = (id(n), attr)
        if key not in norm:
            norm[key] = n.node_def.normalize_plug(attr)
        return norm[key]

    ms.connections = [(s, rename(s, sa) if id(s) in used else sa, d, rename(d, da) if id(d) in used else da)
                      for s, sa, d, da in ms.connections]
    for n in ms.nodes:
        if not n.inputs:
            continue
        new = {}
        for key, (src, sattr) in n.inputs.items():
            if id(src) in used:
                sattr = rename(src, sattr)
            if id(n) in used:
                key = rename(n, key)
            new[key] = (src, sattr)
        n.inputs = new
    return applied


def plugin_version_warnings(ms, applied: Dict[str, List[str]], defs: Definitions) -> List[str]:
    """定義のプラグインの版と、.ma の requires の版が違えば警告"""
    out = []
    versions = getattr(ms, "plugin_versions", {}) or {}
    seen = set()
    for t in applied:
        nd = defs.nodes[t]
        if not nd.plugin or not nd.plugin_version or (nd.plugin, nd.source) in seen:
            continue
        seen.add((nd.plugin, nd.source))
        v = versions.get(nd.plugin)
        if v is not None and str(v) != str(nd.plugin_version):
            out.append("自作ノードの定義 %s はプラグイン %s %s 用ですが、シーンは %s を使っています。"
                       "計算が変わっている場合は定義を作り直してください。" % (nd.source, nd.plugin, nd.plugin_version, v))
    return out
