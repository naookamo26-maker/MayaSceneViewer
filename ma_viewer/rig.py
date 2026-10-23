# -*- coding: utf-8 -*-
"""リグ（コンストレイント・IK・計算ノード）の依存関係の探索と、共通 JSON の animation.graph の作成。

1 段階目（scene_to_dict）: 表示するノードの移動・回転・スケールにつながる接続を上流へたどり、
  評価に必要なノード（コントローラー・IK ハンドル・コンストレイント・計算ノード・カーブ）を洗い出す。
  接続だけを見るので軽い。コントローラーなどの DAG ノードは、出力するノードに加える。
2 段階目（animation.build_animation）: 洗い出したノードの属性の値をファイルの範囲（span）から読み、
  ビューアが評価できる形（ノード・静的な値・接続）にする。評価そのものはビューア（web_src/src/rig.js）で行う。

対応するノード:
  * コンストレイント: point・orient・parent・scale・poleVector・aim
  * IK: ikRPsolver・ikSCsolver（ジョイントの数は問わない）、ikSplineSolver（nurbsCurve に沿わせる）
  * 計算ノード: unitConversion・pairBlend・blendColors・multiplyDivide・plusMinusAverage・reverse・condition・
    addDoubleLinear・multDoubleLinear・clamp・setRange・remapValue・distanceBetween・vectorProduct・blendTwoAttr・
    blendWeighted・choice・expression（式を解釈できるもの）
  * ドリブンキー: animCurveUA・UL・UU（ドライバーの値でキーを引く）
  * アニメーションレイヤー: animBlendNodeAdditiveDL・DA・Rotation、animLayer（ウェイトとミュート）
  * 行列ノード: multMatrix・decomposeMatrix・composeMatrix・inverseMatrix、DAG ノードの offsetParentMatrix
  * 四元数ノード: quatToEuler・eulerToQuat・quatProd・quatInvert・quatNormalize・quatSlerp
  * そのほか: curveInfo（カーブの長さ）、pointOnCurveInfo（カーブ上の点・接線・法線）、displayLayer（値を読むだけ）
  * カーブ: nurbsCurve と、それを動かす skinCluster・wire・cluster・制御点（controlPoints）の接続・ロケーター（worldPosition）
  * アニメーションカーブ（animCurveTL / TA / TU）
これ以外のノード（エクスプレッション・ドリブンキー・行列ノードなど）に当たったら、そこから先は評価せず警告する。
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional, Set, Tuple

from .ma_scene import MaNode, MaScene
from . import ma_reader as R

CURVE_TYPES = {"animCurveTL", "animCurveTA", "animCurveTU"}
CONSTRAINT_TYPES = {"pointConstraint", "orientConstraint", "parentConstraint", "scaleConstraint", "poleVectorConstraint",
                    "aimConstraint"}
UTILITY_TYPES = {"unitConversion", "pairBlend", "blendColors", "multiplyDivide", "plusMinusAverage", "reverse",
                 "condition", "multMatrix", "decomposeMatrix", "composeMatrix", "inverseMatrix",
                 "quatToEuler", "eulerToQuat", "quatProd", "quatInvert", "quatNormalize", "quatSlerp", "curveInfo",
                 "displayLayer", "expression", "addDoubleLinear", "multDoubleLinear", "clamp", "setRange", "remapValue",
                 "distanceBetween", "vectorProduct", "blendTwoAttr", "blendWeighted", "choice",
                 "animBlendNodeAdditiveDL", "animBlendNodeAdditiveDA", "animBlendNodeAdditiveRotation", "animLayer",
                 "animCurveUA", "animCurveUL", "animCurveUU", "pointOnCurveInfo"}
# 入力をたどらない（値を読むだけの）ノード
_NO_INPUT_TYPES = {"displayLayer", "animLayer"}       # animLayer はウェイトとミュートを読むだけ
# カーブと、それを動かすノード（必要な入力だけをたどる）
GEOMETRY_TYPES = {"nurbsCurve", "skinCluster", "tweak", "groupParts", "locator", "wire", "cluster"}
_GEOMETRY_INPUTS = {
    "nurbsCurve": re.compile(r"^(cr|cp\[\d+\].*)$"),            # create・controlPoints
    "skinCluster": re.compile(r"^(ma\[\d+\]|pm\[\d+\]|ip\[\d+\]\.ig)$"),
    "tweak": re.compile(r"^ip\[\d+\]\.ig$"),
    "groupParts": re.compile(r"^ig$"),
    # wire: 変形するカーブ・ワイヤー（dw）・ベースワイヤー（bw）・影響範囲（dds）・スケール（sc）・回転・エンベロープ
    "cluster": re.compile(r"^(ip\[\d+\]\.ig|ma|pm|en)$"),         # ハンドルのワールド行列・bindPreMatrix
    "wire": re.compile(r"^(ip\[\d+\]\.ig|dw\[\d+\]|bw\[\d+\]|dds\[\d+\]|sc\[\d+\]|rot|en)$"),
    "locator": None,
}
# スプライン IK のハンドルで使う属性（カーブ・ひねり・上級ツイスト）
_SPLINE_HANDLE_KEYS = {"ic", "twi", "rol", "off", "dtce", "dwut", "dwua", "dfa", "dwum", "dwue", "dwuv", "dwve"}
SUPPORTED_DG = CONSTRAINT_TYPES | UTILITY_TYPES

# DAG ノードの行列の属性（上流は、そのノードと祖先の移動・回転・スケールのすべて）
_MATRIX_PLUGS = {"pm", "pim", "wm", "wim", "m", "im", "xm", "worldMatrix", "parentMatrix", "worldInverseMatrix",
                 "parentInverseMatrix", "matrix", "inverseMatrix"}
_CHANNEL_KEYS = {"t", "tx", "ty", "tz", "r", "rx", "ry", "rz", "s", "sx", "sy", "sz", "opm"}
# DAG ノードの属性のうち、ファイルの値を rest_entry で渡すもの（graph の attrs には入れない）
_STANDARD_ATTRS = _CHANNEL_KEYS | {"jo", "jox", "joy", "joz", "ra", "rax", "ray", "raz", "rp", "rpx", "rpy", "rpz",
                                   "sp", "spx", "spy", "spz", "rpt", "spt", "sh", "ro", "v", "it", "ssc", "radi",
                                   "bps", "io", "ove", "ovv", "lodv", "hio", "dla", "dsc", "uoc", "oc", "otx", "rlio",
                                   "mnrl", "mxrl", "mnsl", "mxsl", "mntl", "mxtl", "xm", "is", "liw", "fbx"}
# _CHANNEL_KEYS のうち、値は rest_entry で渡すもの（offsetParentMatrix も含む）

_SETATTR_RE = re.compile(r"setAttr\b([^;]*);")
_ADDATTR_RE = re.compile(r"addAttr\b([^;]*);")
_TG_RE = re.compile(r"^tg\[(\d+)\]\.(\w+)$")
_RANGE_RE = re.compile(r"^(.*?)\[(\d+):(\d+)\](.*)$")   # 最初の範囲（wl[0].w[0:5] も）


def _base(attr: str) -> str:
    return attr.split("[")[0].split(".")[0]


def _dag_like(n: MaNode) -> bool:
    return n.is_dag and not n.is_shape and n.type not in SUPPORTED_DG


def _evaluable(n: MaNode, info: Optional["GraphInfo"] = None) -> bool:
    """接続元として評価できるか（コンストレイントはターゲットがあるときだけ。expression は式を解釈できるときだけ）"""
    if n.type == "expression":
        return info is not None and id(n) in info.expressions
    if n.type in CURVE_TYPES or n.type in UTILITY_TYPES or _dag_like(n):
        return True                                   # DAG ノードからの直接の接続（ctrl.t → joint.t など）も評価できる
    if n.type in CONSTRAINT_TYPES:
        return any(_TG_RE.match(k) for k in n.inputs)
    return False


class GraphInfo:
    """1 段階目で見つけた、評価に必要なノードと接続"""

    def __init__(self):
        self.dag: Dict[int, MaNode] = {}               # 評価にかかわる DAG ノード（出力するノードに加える）
        self.dg: Dict[int, MaNode] = {}                # コンストレイント・計算ノード
        self.curves: Dict[int, MaNode] = {}            # 上の入力になっているカーブ
        self.edges: Dict[int, Dict[str, Tuple[MaNode, str]]] = {}   # id(使う側) → {属性: (元, 元の属性)}
        self.ik: List[dict] = []                       # {"handle", "solver", "chain": [joint...], "problem"}
        self.unsupported: Dict[str, List[Tuple[str, str, str]]] = {}   # 型 → [(ノード名, 使う側, 属性)]
        self.graph_driven: Set[int] = set()            # チャンネルの接続元がすべて評価できるノード
        self.expressions: Dict[int, str] = {}          # 解釈できる expression の式
        self.expression_problems: Dict[str, str] = {}  # 解釈できない expression の名前 → 理由

    @property
    def empty(self) -> bool:
        return not self.dg and not self.ik and not any(
            src.type not in CURVE_TYPES for e in self.edges.values() for src, _ in e.values())


# 表示だけに使う接続（値の計算に使わない）。コンストレイントは DAG ノードなので、ディスプレイレイヤーの .do などを持つ
_DISPLAY_KEYS = {"do", "drawOverride", "iog", "instObjGroups", "msg", "message"}

_DEFORM_OUT = re.compile(r"^og\[(\d+)\]$")


def wire_shapes(ms: MaScene, wire: MaNode) -> Dict[int, MaNode]:
    """デフォーマ（wire・cluster）の出力（og[k]）の先にある、変形されるカーブ（ほかのデフォーマを経由してもよい）"""
    out: Dict[int, MaNode] = {}
    for src, sattr, dst, _dattr in ms.connections:
        m = _DEFORM_OUT.match(sattr) if src is wire else None
        if not m:
            continue
        x, seen = dst, set()
        while x is not None and x.type != "nurbsCurve" and id(x) not in seen:
            seen.add(id(x))
            nxt = None
            for s2, a2, d2, _ in ms.connections:
                if s2 is x and (a2 == "og" or a2.startswith("og[")):
                    nxt = d2
                    break
            x = nxt
        if x is not None and x.type == "nurbsCurve" and x.parent is not None:
            out[int(m.group(1))] = x
    return out


def discover(ms: MaScene, keep: Set[int], geometry=()) -> GraphInfo:
    """表示するノード（keep）と、表示するカーブ（geometry。変形の入力を持つもの）を動かす接続を上流へたどる。"""
    info = GraphInfo()
    world_done: Set[int] = set()
    plug_done: Set[Tuple[int, str]] = set()

    def add_edge(consumer: MaNode, key: str):
        if (id(consumer), key) in plug_done:
            return
        plug_done.add((id(consumer), key))
        src, sattr = consumer.inputs[key]
        info.edges.setdefault(id(consumer), {})[key] = (src, sattr)
        if _dag_like(consumer):
            info.dag[id(consumer)] = consumer
        need_plug(src, sattr, consumer, key)

    def need_channels(n: MaNode, base: Optional[str] = None):
        for key in list(n.inputs):
            kb = _base(key)
            if kb in _CHANNEL_KEYS and (base is None or kb[0] == base[0]):
                add_edge(n, key)

    def need_world(n: Optional[MaNode]):
        while n is not None and id(n) not in world_done:
            world_done.add(id(n))
            if _dag_like(n):
                info.dag[id(n)] = n
            need_channels(n)
            n = n.parent

    def need_plug(n: MaNode, attr: str, consumer: MaNode, ckey: str):
        if n.type in CURVE_TYPES:
            info.curves[id(n)] = n
            return
        if n.type == "expression" and id(n) not in info.dg:
            from .expression import read_expression
            text, problem = read_expression(ms, n)
            if problem:
                info.unsupported.setdefault("expression", []).append((n.name, consumer.name, ckey))
                info.expression_problems[n.name] = problem
                return
            info.expressions[id(n)] = text
        if n.type in SUPPORTED_DG:
            if id(n) not in info.dg:
                info.dg[id(n)] = n
                if n.type not in _NO_INPUT_TYPES:
                    for key in list(n.inputs):
                        if n.type == "expression" and key in ("tim", "time"):
                            continue                     # 時間はビューアのフレームから求める
                        if _base(key) in _DISPLAY_KEYS:
                            continue                     # 表示だけの接続（コンストレイントのディスプレイレイヤーなど）
                        add_edge(n, key)
            return
        if n.type in GEOMETRY_TYPES:
            if id(n) not in info.dg:
                info.dg[id(n)] = n
                pat = _GEOMETRY_INPUTS[n.type]
                for key in list(n.inputs):
                    if pat is not None and pat.match(key):
                        add_edge(n, key)
                if n.type in ("nurbsCurve", "locator"):
                    need_world(n.parent)                 # ワールド空間（ws・worldPosition）は親の行列から
                if n.type in ("wire", "cluster"):
                    for shape in wire_shapes(ms, n).values():
                        need_world(shape.parent)         # ワイヤーはワールド空間で変形する（変形するカーブの位置）
            return
        if _dag_like(n):
            info.dag[id(n)] = n
            b = _base(attr)
            if b in _MATRIX_PLUGS:
                need_world(n)
            elif b in _CHANNEL_KEYS:
                need_channels(n, b)
            elif attr in n.inputs:                       # 独自の属性（IK/FK の切り替えなど）
                add_edge(n, attr)
            return
        info.unsupported.setdefault(n.type, []).append((n.name, consumer.name, ckey))

    # 表示するノードのチャンネルの入力
    for n in ms.nodes:
        if id(n) in keep and _dag_like(n) and n.inputs:
            need_channels(n)
            srcs = [src for key, (src, _sa) in n.inputs.items() if _base(key) in _CHANNEL_KEYS]
            if srcs and all(_evaluable(s, info) for s in srcs):
                info.graph_driven.add(id(n))

    # 表示するカーブの形を決める入力（skinCluster・制御点の接続など）
    for n in geometry:
        cr = n.inputs.get("cr")
        if any(k.startswith("cp[") for k in n.inputs) or (cr is not None and cr[0].type in GEOMETRY_TYPES):
            need_plug(n, "local", n, "")             # makeNurbCircle などの作成ノードは、保存された形（.cc）を使う

    # IK ハンドル（開始ジョイントが表示するノードのもの）
    for src, sattr, dst, dattr in ms.connections:
        if dst.type != "ikHandle" or dattr != "hsj" or id(src) not in keep:
            continue
        handle, start = dst, src
        solver = handle.inputs.get("hsv")
        eff = handle.inputs.get("hee")
        end = None
        if eff is not None:
            e = eff[0].inputs.get("tx") or eff[0].inputs.get("t")
            end = e[0] if e else None
        chain: List[MaNode] = []
        x = end
        while x is not None and x is not start:
            chain.append(x)
            x = x.parent
        entry = {"handle": handle, "solver": solver[0].type if solver else "ikSCsolver", "chain": [], "problem": None,
                 "curve": None}
        if end is None or x is not start:
            entry["problem"] = "終端のジョイントが見つかりません"
        else:
            chain.append(start)
            entry["chain"] = list(reversed(chain))
            n_joints = len(entry["chain"])
            curve = handle.inputs.get("ic")
            if entry["solver"] not in ("ikRPsolver", "ikSCsolver", "ikSplineSolver"):
                entry["problem"] = "%s は未対応です" % entry["solver"]
            elif entry["solver"] == "ikRPsolver" and n_joints < 3:
                entry["problem"] = "ikRPsolver のジョイントが %d 個しかありません" % n_joints
            elif entry["solver"] == "ikSplineSolver" and (curve is None or curve[0].type != "nurbsCurve"):
                entry["problem"] = "スプライン IK のカーブ（nurbsCurve）が見つかりません"
            elif entry["solver"] == "ikSplineSolver":
                entry["curve"] = curve[0]
        info.ik.append(entry)
        if entry["problem"]:
            continue
        need_world(handle)
        need_world(end)
        keys = _SPLINE_HANDLE_KEYS if entry["solver"] == "ikSplineSolver" else {"pv", "pvx", "pvy", "pvz", "twi", "ikb"}
        for key in list(handle.inputs):
            if _base(key) in keys:
                add_edge(handle, key)
    # リグの探索で見つかった DAG ノード（コントローラー・極ベクトルの目印など）も、チャンネルの接続元がすべて
    # 評価できれば「リグで値が決まる」扱いにする（「ファイルに値がありません」の警告を出さない）
    for n in list(info.dag.values()):
        srcs = [src for key, (src, _sa) in n.inputs.items() if _base(key) in _CHANNEL_KEYS]
        if srcs and all(_evaluable(s, info) for s in srcs):
            info.graph_driven.add(id(n))
    return info


# ---------------------------------------------------------------------------
# 2 段階目: 属性の値の読み取りと graph の作成
# ---------------------------------------------------------------------------

def _value(tok: str):
    t = tok.lower()
    if t in ("yes", "true", "on"):
        return 1.0
    if t in ("no", "false", "off"):
        return 0.0
    return R.to_float(tok)


def _addattr_default(rest: str):
    """addAttr の (短い名前, 長い名前, 既定値 -dv)。既定値のない（数値でない）属性は None"""
    toks = R.tokenize(rest)
    opts, _pos = R.parse_flags(toks, ["-sn", "-shortName", "-ln", "-longName", "-dv", "-defaultValue", "-at",
                                      "-attributeType", "-dt", "-dataType", "-p", "-parent", "-nc", "-numberOfChildren",
                                      "-min", "-max", "-smn", "-smx", "-en", "-enumName", "-h", "-k", "-ci", "-dcb"])
    dv = opts.get("-dv", opts.get("-defaultValue"))
    sn = opts.get("-sn") or opts.get("-shortName")
    ln = opts.get("-ln") or opts.get("-longName")
    if not isinstance(dv, str) or not (sn or ln):
        return None
    try:
        return sn, ln, _value(dv)
    except (ValueError, TypeError):
        return None


def parse_attrs(text: str, node: MaNode, skip=()) -> Dict[str, object]:
    """ノードのブロック（span）の setAttr から、数値の属性を読む（ノード名つきのプラグは対象外）。

    独自の属性（addAttr）の既定値（-dv）も入れる。Maya は既定値のままの属性を setAttr で書かないため
    （コンストレイントを付けたときにできる blendPoint1 などのウェイト）。
    """
    out: Dict[str, object] = {}
    if node.span is None or not text:
        return out
    a, b = node.span
    for m in _ADDATTR_RE.finditer(text, a, b):
        d = _addattr_default(m.group(1))
        if d is not None:
            sn, ln, dv = d
            for name in (sn, ln):
                if name and _base(name) not in skip:
                    out[name] = dv
    for m in _SETATTR_RE.finditer(text, a, b):
        sa = R.parse_setattr(m.group(1))
        if sa is None or not sa.plug.startswith(".") or sa.type == "string":
            continue
        key = R.normalize_attr(sa.plug[1:])
        if not key or _base(key) in skip:
            continue
        vals = []
        try:
            for tok in sa.values():
                vals.append(_value(tok))
        except (ValueError, TypeError):
            continue
        if not vals:
            continue
        m = _RANGE_RE.match(key)
        if m:                                            # i1[0:2] → i1[0]・i1[1]・i1[2]
            name, a0, a1, rest = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
            count = a1 - a0 + 1
            per = len(vals) // count if count > 0 else 0
            for k in range(count if per else 0):
                v = vals[k * per:(k + 1) * per]
                out["%s[%d]%s" % (name, a0 + k, rest)] = v[0] if len(v) == 1 else v
            continue
        out[key] = vals[0] if len(vals) == 1 else vals
    return out


def build_graph(ms: MaScene, info: GraphInfo, out_index: Dict[int, int], curve_index: Dict[int, int],
                shape_index: Optional[Dict[int, int]] = None):
    """animation.graph（ノードの一覧）と、評価で動く DAG ノード（出力の番号）の集合を返す。"""
    shape_index = shape_index or {}
    gid: Dict[int, int] = {}
    order: List[MaNode] = []
    for n in sorted(list(info.dag.values()) + list(info.dg.values()), key=lambda x: x.order):
        if id(n) in info.dg or id(n) in out_index:
            gid[id(n)] = len(order)
            order.append(n)
    ik_of = {id(e["handle"]): e for e in info.ik if not e["problem"]}
    nodes = []
    moving: Set[int] = set()
    for n in order:
        is_dag = id(n) not in info.dg
        entry = {"id": gid[id(n)], "name": n.name, "type": n.type, "dag": out_index[id(n)] if is_dag else -1}
        attrs = parse_attrs(ms.text, n, _STANDARD_ATTRS if is_dag else ())
        if attrs:
            entry["attrs"] = attrs
        inputs = {}
        for key, (src, sattr) in info.edges.get(id(n), {}).items():
            if src.type in CURVE_TYPES:
                if id(src) in curve_index:
                    inputs[key] = {"curve": curve_index[id(src)]}
            elif id(src) in gid and (src.type not in CONSTRAINT_TYPES or _evaluable(src)):
                inputs[key] = {"node": gid[id(src)], "attr": sattr}     # ターゲットのないコンストレイントは評価しない
        if inputs:
            entry["inputs"] = inputs
            if is_dag and any(_base(k) in _CHANNEL_KEYS for k in inputs):
                moving.add(out_index[id(n)])
        if n.type in CONSTRAINT_TYPES:
            driven = out_index.get(id(n.parent)) if n.parent is not None else None
            for key, (src, _sattr) in n.inputs.items():
                if n.type == "poleVectorConstraint" and key in ("crp", "ps") and id(src) in out_index:
                    entry["pivot"] = out_index[id(src)]
                elif _base(key) in ("cpim",) and n.parent is None and id(src) in out_index:
                    driven = out_index[id(src)]
            targets = {}
            for key, (src, _sattr) in n.inputs.items():
                m = _TG_RE.match(key)
                if m and m.group(2) in ("tpm", "tt", "tr", "ts", "tpm") and id(src) in gid:
                    targets[int(m.group(1))] = gid[id(src)]
            entry["driven"] = driven if driven is not None else -1
            entry["targets"] = [{"index": i, "node": targets[i]} for i in sorted(targets)]
        if id(n) in ik_of:
            e = ik_of[id(n)]
            entry["ik"] = {"solver": e["solver"], "chain": [out_index[id(j)] for j in e["chain"]]}
            moving.update(out_index[id(j)] for j in e["chain"][:-1])
        if n.type in ("nurbsCurve", "locator"):
            entry["parent"] = out_index.get(id(n.parent), -1) if n.parent is not None else -1
            if id(n) in shape_index:
                entry["shape"] = shape_index[id(n)]     # 表示するカーブ（共通 JSON の curves の番号）
        if n.type.startswith("animCurveU") and id(n) in curve_index:
            entry["curve"] = curve_index[id(n)]           # ドリブンキー（animation.curves の番号。入力 i で引く）
        if n.type == "expression" and id(n) in info.expressions:
            entry["expr"] = info.expressions[id(n)]       # 式（ビューアの expression.js で解釈する）
        if n.type in ("wire", "cluster"):
            # 変形するカーブの transform（ワールド空間へ移して変形し、戻す）
            entry["geom"] = {str(k): out_index.get(id(shape.parent), -1) for k, shape in wire_shapes(ms, n).items()}
        if n.type == "skinCluster" and n.skin is not None:
            sk = n.skin
            entry["skin"] = {
                "weights": [[v, i, round(w, 6)] for v, d in sorted(sk.weights.items()) for i, w in sorted(d.items())],
                "pm": {str(i): [float(x) for x in m] for i, m in sk.pm.items()},
                "gm": [float(x) for x in sk.gm] if sk.gm else None,
            }
        nodes.append(entry)
    return nodes, moving


_PARENT_MATRIX_PLUGS = {"pm", "pim", "parentMatrix", "parentInverseMatrix"}


def analyze_fallback(info: GraphInfo, kept: List[MaNode], bind_ids: Set[int], out_index: Dict[int, int]):
    """値を求められないノード（未対応のノードの影響を受けるノード）を調べる。

    接続の構造だけで決まる（フレームによらない）ので、ここでまとめて調べる:
      * unresolved: 移動・回転などの接続元が、未対応のノード（またはその影響を受けるノード）
      * tainted（不明）: ワールドの位置が分からない（unresolved か、親が tainted）。バインドポーズの情報があれば推定に回す
      * anchored（推定）: バインドポーズの情報があるノードが unresolved か、親が tainted。
        「確かな一番近い祖先」からの相対をバインドポーズのとおりに保つ（形を保ったまま、確かな部分の動きについていく）
    循環（コンストレイントの cpim ← 動かすノードの pim など）は「求められる」とみなして打ち切る。
    戻り値: (fallback のリスト, tainted のノード番号のリスト)
    """
    busy: Set[Tuple[str, int]] = set()
    memo: Dict[Tuple[str, int], object] = {}
    ik_of: Dict[int, MaNode] = {}
    for e in info.ik:
        if not e["problem"]:
            for j in e["chain"][:-1]:
                ik_of[id(j)] = e["handle"]

    def guarded(kind, n, fn, optimistic):
        key = (kind, id(n))
        if key in memo:
            return memo[key]
        if key in busy:
            return optimistic
        busy.add(key)
        try:
            v = fn()
        finally:
            busy.discard(key)
        memo[key] = v
        return v

    def parent_of(n):
        return n.parent if n.parent is not None and n.flag("it", True) else None

    def bad_source(src: MaNode, sattr: str) -> bool:
        if src.type in CURVE_TYPES:
            return False
        if src.type in SUPPORTED_DG or src.type in GEOMETRY_TYPES:
            if src.type in CONSTRAINT_TYPES and not _evaluable(src):
                return True
            if src.type == "expression" and id(src) not in info.expressions:
                return True
            if src.type in ("nurbsCurve", "locator") and tainted(src.parent):
                return True
            return guarded("dg", src, lambda: any(bad_source(s, a) for s, a in info.edges.get(id(src), {}).values()),
                           False)
        if _dag_like(src):
            b = _base(sattr)
            if b in _PARENT_MATRIX_PLUGS:
                return tainted(parent_of(src))
            if b in _MATRIX_PLUGS:
                return tainted(src)
            if b in _CHANNEL_KEYS:
                return any(k[0] == b[0] for k in unresolved(src))
            e = info.edges.get(id(src), {}).get(sattr)
            return bad_source(*e) if e else False
        return True                                      # 未対応のノード

    def unresolved(n: MaNode) -> List[str]:
        def calc():
            keys = [k for k, (s, a) in info.edges.get(id(n), {}).items()
                    if _base(k) in _CHANNEL_KEYS and bad_source(s, a)]
            h = ik_of.get(id(n))
            if h is not None and (tainted(h) or any(bad_source(s, a) for s, a in info.edges.get(id(h), {}).values())):
                keys.append("r（IK: %s）" % h.name)
            return keys
        return guarded("unres", n, calc, [])

    def tainted(n: Optional[MaNode]) -> bool:
        if n is None:
            return False

        def calc():
            bad = bool(unresolved(n)) or tainted(parent_of(n))
            return bad and id(n) not in bind_ids          # バインドポーズの情報があれば推定できる
        return guarded("taint", n, calc, False)

    fallback, tainted_out = [], []
    for n in kept:
        ni = out_index[id(n)]
        if id(n) in bind_ids and (unresolved(n) or tainted(parent_of(n))):
            a = parent_of(n)
            while a is not None and tainted(a):
                a = parent_of(a)
            fallback.append({"node": ni, "anchor": out_index.get(id(a), -1) if a is not None else -1,
                             "unresolved": unresolved(n)})
        elif tainted(n):
            tainted_out.append(ni)
    return fallback, tainted_out


def graph_warnings(info: GraphInfo) -> List[str]:
    out = []
    for t, items in sorted(info.unsupported.items(), key=lambda kv: -len(kv[1])):
        names = sorted({c for _n, c, _a in items})
        if t == "expression":
            out.append("アニメーション: 解釈できない expression（%s など）につながる %s の値は再生されません。"
                       % (items[0][0], "、".join(names[:4]) + (" ほか" if len(names) > 4 else "")))
            continue
        out.append("アニメーション: %s（%s など）は未対応のため、これにつながる %s の値は再生されません。"
                   % (t, items[0][0], "、".join(names[:4]) + (" ほか" if len(names) > 4 else "")))
    for e in info.ik:
        if e["problem"]:
            out.append("アニメーション: IK ハンドル %s は再生されません（%s）。" % (e["handle"].name, e["problem"]))
    for name, problem in sorted(info.expression_problems.items()):
        out.append("アニメーション: expression %s を解釈できません（%s）。" % (name, problem))
    return out
