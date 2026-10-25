# -*- coding: utf-8 -*-
"""カーブのヒストリ（形を作るノード）から、カーブの形（.cc）を求める。

Maya は、ヒストリのあるカーブの形を .ma に保存しない（開いたときに、形を作るノードから計算し直す）。
そのままではビューアに形がないので、読み込んだ直後に、計算できる形を作るノードの結果をカーブの形（.cc）として
持たせ、作成の接続（create）を外す。こうすると、表示・変形（skinCluster など）・スプライン IK のどれも、
ヒストリを削除したカーブと同じに扱える。

計算できる形を作るノード:
  * makeNurbCircle（circle）: 法線・中心・半径・次数（1・3）・分割数。sweep 360 度・useTolerance なしのとき
  * transformGeometry（フリーズトランスフォームなど）: 入力の形に行列を掛ける（invertTransform も）
計算できないもの（rebuildCurve など）は、カーブの名前と形を作るノードを覚えておき、警告とリグの診断に出す。
"""
from __future__ import annotations

import math
from typing import Dict, List, Optional, Tuple

from . import mathutil

_DEFORM_INPUT_PREFIX = "ip["


def _attrs(ms, n) -> dict:
    from .rig import parse_attrs
    return parse_attrs(getattr(ms, "text", ""), n)


def _num(v, default=0.0) -> float:
    if isinstance(v, bool):
        return 1.0 if v else 0.0
    if isinstance(v, (int, float)):
        return float(v)
    return default


def _vec(a: dict, key: str, default):
    v = a.get(key)
    if isinstance(v, list) and len(v) >= 3:
        return [_num(x) for x in v[:3]]
    return [_num(a.get(key + s), d) for s, d in zip("xyz", default)]


# ---------------------------------------------------------------------------
# .cc（[次数, スパン数, 形, 有理か, 次元, ノットの数, ノット…, CV の数, CV の座標…]）

def periodic_cc(degree: int, points: List[List[float]]) -> List[float]:
    """周期的な（閉じた）カーブ。points は重ならない CV（末尾に先頭の degree 個を重ねる）"""
    s = len(points)
    knots = [float(-(degree - 1) + i) for i in range(s + 2 * degree - 1)]
    cvs = points + points[:degree]
    out = [float(degree), float(s), 2.0, 0.0, 3.0, float(len(knots))] + knots + [float(len(cvs))]
    for p in cvs:
        out += [float(p[0]), float(p[1]), float(p[2])]
    return out


def map_cvs(cc: List[float], fn) -> Optional[List[float]]:
    """CV の座標に fn((x, y, z)) → (x, y, z) を当てた .cc"""
    try:
        rational = cc[3] >= 0.5
        dim = int(cc[4])
        nk = int(cc[5])
        ncv = int(cc[6 + nk])
    except (IndexError, ValueError, TypeError):
        return None
    stride = dim + (1 if rational else 0)
    start = 7 + nk
    if dim < 2 or len(cc) < start + ncv * stride:
        return None
    out = list(cc)
    for k in range(ncv):
        i = start + k * stride
        p = list(cc[i:i + dim]) + [0.0] * (3 - dim)
        q = fn(p)
        out[i:i + dim] = q[:dim]
    return out


def _xform(m: List[float]):
    """Maya の行ベクトルの規約で、点に行列（行の順の 16 個）を掛ける"""
    def f(p):
        x, y, z = p[:3]
        return [x * m[0] + y * m[4] + z * m[8] + m[12],
                x * m[1] + y * m[5] + z * m[9] + m[13],
                x * m[2] + y * m[6] + z * m[10] + m[14]]
    return f


# ---------------------------------------------------------------------------
# 形を作るノード

class Unsupported(Exception):
    """計算できない（理由つき）。node: いちばん奥で止まったノード（集計に使う）"""

    def __init__(self, msg: str, node=None):
        super().__init__(msg)
        self.node = node


# 計算できない形を作るノードの、理由の説明
_WHY = {
    "makeTextCurves": "文字のカーブ。形はフォントから作られるため、ビューアでは作れない",
    "rebuildCurve": "カーブの作り直し。Maya の近似の計算を再現できない",
}


def _circle(ms, node, _attr, world=None) -> List[float]:
    a = _attrs(ms, node)
    if _num(a.get("ut")) >= 0.5:
        raise Unsupported("useTolerance（許容値で分割数を決める）")
    sweep = _num(a.get("sw"), 360.0)
    if abs(sweep - 360.0) > 1e-6:
        raise Unsupported("sweep %g 度（円弧）" % sweep)
    degree = int(round(_num(a.get("d"), 3.0)))
    if degree not in (1, 3):
        raise Unsupported("次数 %d" % degree)
    s = int(round(_num(a.get("s"), 8.0)))
    if s < 3:
        raise Unsupported("分割数 %d" % s)
    r = _num(a.get("r"), 1.0)
    n = _vec(a, "nr", (0.0, 0.0, 1.0))
    c = _vec(a, "c", (0.0, 0.0, 0.0))
    ln = math.sqrt(sum(x * x for x in n)) or 1.0
    n = [x / ln for x in n]
    # 円の面の基準の向き: X 軸を面に落としたもの（法線が X 軸に近ければ Y 軸）。
    # 法線が +Y のとき、Maya と同じく最初の CV は X 軸から -Z へ 1 区間回した位置になる
    ref = [1.0, 0.0, 0.0] if abs(n[0]) < 0.9 else [0.0, 1.0, 0.0]
    d = sum(p * q for p, q in zip(ref, n))
    u = [p - d * q for p, q in zip(ref, n)]
    lu = math.sqrt(sum(x * x for x in u))
    u = [x / lu for x in u]
    v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]]   # n × u
    step = 2.0 * math.pi / s
    # 3 次の周期的な B スプラインの CV の半径（カーブが CV の向きで半径 r を通る）。1 次はそのまま
    radius = r * 6.0 / (4.0 + 2.0 * math.cos(step)) if degree == 3 else r
    pts = []
    for k in range(s):
        t = (k + 1) * step
        ct, st = math.cos(t), math.sin(t)
        pts.append([c[i] + radius * (ct * u[i] + st * v[i]) for i in range(3)])
    return periodic_cc(degree, pts)


def _transform_geometry(ms, node, _attr, world=None) -> List[float]:
    a = _attrs(ms, node)
    src = node.inputs.get("ig")
    if src is None:
        raise Unsupported("%s に入力の形（inputGeometry）がない" % node.name, node)
    cc = output_cc(ms, src[0], src[1], world=world)
    m = a.get("txf")
    m = [float(x) for x in m] if isinstance(m, list) and len(m) == 16 else mathutil.identity()
    if _num(a.get("itf")) >= 0.5:
        try:
            m = list(mathutil.inverse(m))
        except ValueError:
            raise Unsupported("逆行列のない行列（invertTransform）") from None
    out = map_cvs(cc, _xform(m))
    if out is None:
        raise Unsupported("入力の形が読めない")
    return out


PRODUCERS = {
    "makeNurbCircle": _circle,
    "transformGeometry": _transform_geometry,
}


def output_cc(ms, node, attr: str, depth: int = 0, world=None) -> List[float]:
    """ノードの出力（attr）の形。nurbsCurve ならその形（ヒストリがあればそこから）。
    world: ノード → ワールド行列（カーブのワールド空間の出力 worldSpace に使う。読み込んだときの値）"""
    if depth > 32:
        raise Unsupported("ヒストリが深すぎる", node)
    if node.type == "nurbsCurve":
        if attr.startswith("ws") or attr.startswith("worldSpace"):
            # ワールド空間の形 = カーブの形 · カーブの transform のワールド行列
            if world is None or node.parent is None:
                raise Unsupported("%s のワールド空間の形" % node.name, node)
            local = output_cc(ms, node, "local", depth + 1, world)
            out = map_cvs(local, _xform(list(world(node.parent))))
            if out is None:
                raise Unsupported("%s の形が読めない" % node.name, node)
            return out
        baked = getattr(node, "baked", None) or {}
        cc = baked.get("cc")
        if cc is None:
            cc = _attrs(ms, node).get("cc")
        if isinstance(cc, list) and len(cc) > 6:
            return [float(x) for x in cc]
        src = node.inputs.get("cr")
        if src is None:
            raise Unsupported("%s に形がない" % node.name, node)
        if src[0].type not in PRODUCERS and src[0].type != "nurbsCurve" and _is_deformer(src[0]):
            raise Unsupported("%s の形は変形（%s（%s））の結果" % (node.name, src[0].name, src[0].type), src[0])
        return output_cc(ms, src[0], src[1], depth + 1, world)
    fn = PRODUCERS.get(node.type)
    if fn is None:
        why = _WHY.get(node.type, "ビューアで計算できない")
        raise Unsupported("%s（%s。%s）" % (node.name, node.type, why), node)
    return fn(ms, node, attr, world=world)


# ---------------------------------------------------------------------------
# 読み込んだシーンに当てる

def bake_curve_history(ms, world=None) -> Dict[str, List[Tuple[str, str]]]:
    """形が保存されていないカーブに、形を作るノードから求めた形を持たせる。

    world: ノード → ワールド行列（読み込んだときの値。ワールド空間の形を入力にするノードに使う）

    戻り値: 計算できなかった形を作るノードの型 → [(カーブの名前, 理由)]（ms.curve_history_problems にも入れる）
    """
    problems: Dict[str, List[Tuple[str, str]]] = {}
    reasons: Dict[int, str] = {}                     # カーブ（id）→ 形が分からない理由
    baked = 0
    for n in ms.nodes:
        if n.type != "nurbsCurve" or n.span is None:
            continue
        src = n.inputs.get("cr")
        if src is None:
            continue
        x, sattr = src
        cc = _attrs(ms, n).get("cc")
        if isinstance(cc, list) and len(cc) > 6:
            continue
        if x.type == "transformGeometry" and not is_static(x, sattr):
            # 動く transformGeometry（行列が接続されている・入力が変形やワールド空間の形）: 接続を残し、
            # ビューアがリグとして評価する。上流に形の元（保存された形・計算できる形を作るノード）がなければ報告する
            exc = _base_problem(ms, x, sattr, world)
            if exc is not None:
                key = exc.node.type if exc.node is not None and exc.node.type != "nurbsCurve" else x.type
                reasons[id(n)] = "%s の入力: %s" % (x.name, exc)
                problems.setdefault(key, []).append((n.name, reasons[id(n)]))
            continue
        # 変形（skinCluster など）を経由するものは、変形の入力のカーブ（ShapeOrig）のほうで扱う
        if x.type not in PRODUCERS and x.type != "nurbsCurve":
            if not _is_deformer(x):
                why = _WHY.get(x.type, "ビューアで計算できない")
                reasons[id(n)] = "%s（%s。%s）" % (x.name, x.type, why)
                problems.setdefault(x.type, []).append((n.name, reasons[id(n)]))
            continue
        try:
            shape = output_cc(ms, x, sattr, world=world)
        except Unsupported as exc:
            # いちばん奥で止まったノードの型で数える（transformGeometry の入力が makeTextCurves など）
            key = exc.node.type if exc.node is not None and exc.node.type != "nurbsCurve" else x.type
            reasons[id(n)] = str(exc) if key == x.type else "%s の入力: %s" % (x.name, exc)
            problems.setdefault(key, []).append((n.name, reasons[id(n)]))
            continue
        n.baked = dict(n.baked or {}, cc=shape)
        # 作成の接続を外す（形を作るノードは評価しない）
        n.inputs.pop("cr", None)
        ms.connections = [c for c in ms.connections if not (c[2] is n and c[3] == "cr")]
        baked += 1
    ms.curve_history_baked = baked
    ms.curve_history_problems = problems
    ms.curve_history_reasons = reasons
    return problems


def is_static(node, attr: str = "", depth: int = 0) -> bool:
    """形が動かない（読み込んだときの値だけで決まる）ヒストリか。動くものは焼き付けず、リグとして評価する"""
    if depth > 32:
        return False
    if node.type == "nurbsCurve":
        if attr.startswith("ws") or attr.startswith("worldSpace"):
            return False                                  # ワールド空間の形は、親の transform とともに動く
        if any(k.startswith("cp[") for k in node.inputs):
            return False
        src = node.inputs.get("cr")
        return src is None or is_static(src[0], src[1], depth + 1)
    if node.type == "makeNurbCircle":
        return True                                       # 円は、ビューアでは保存された値で作る
    if node.type == "transformGeometry":
        if set(node.inputs) - {"ig"}:
            return False                                  # 行列（txf）などが接続されている
        src = node.inputs.get("ig")
        return src is not None and is_static(src[0], src[1], depth + 1)
    return False


def _base_problem(ms, node, attr: str, world, depth: int = 0) -> Optional[Unsupported]:
    """動くヒストリの上流に、形の元（保存された形・計算できる形を作るノード）があるか。なければその理由"""
    if depth > 32:
        return Unsupported("ヒストリが深すぎる", node)
    try:
        output_cc(ms, node, attr, world=world)
        return None
    except Unsupported as exc:
        d = exc.node
        if d is None or not _is_deformer(d):
            return exc
        # 変形（skinCluster・groupParts など）は、その入力のカーブをたどる
        keys = sorted(k for k in d.inputs if k.startswith(_DEFORM_INPUT_PREFIX) and k.endswith(".ig"))
        if not keys and "ig" in d.inputs:
            keys = ["ig"]
        if not keys:
            return exc
        s = d.inputs[keys[0]]
        return _base_problem(ms, s[0], s[1], world, depth + 1)


def shape_problem(ms, shape) -> str:
    """形の分からないカーブの理由（形を作るノード）"""
    why = (getattr(ms, "curve_history_reasons", None) or {}).get(id(shape))
    if why:
        return "形を作るノード %sを計算できません" % why
    blocker = shape_blocker(ms, shape)
    if blocker is not None:
        return "形を作るノード %s（%s）を計算できません" % (blocker.name, blocker.type)
    return "カーブの形（.cc）が保存されていません"


def _is_deformer(x) -> bool:
    """変形のノード（入力のカーブ ip[k].ig を持つ）か、groupParts"""
    return x.type == "groupParts" or any(k.startswith(_DEFORM_INPUT_PREFIX) and k.endswith(".ig") for k in x.inputs)


def shape_blocker(ms, shape) -> Optional[object]:
    """形の分からないカーブの、上流で止まったノード（形を作る、計算できないノード）"""
    seen = set()
    src = shape.inputs.get("cr")
    x = src[0] if src else None
    last = None
    while x is not None and id(x) not in seen:
        seen.add(id(x))
        last = x
        if x.type == "nurbsCurve":
            nxt = x.inputs.get("cr")
        elif x.type in ("groupParts", "transformGeometry"):
            nxt = x.inputs.get("ig")
        else:
            keys = sorted(k for k in x.inputs if k.startswith(_DEFORM_INPUT_PREFIX) and k.endswith(".ig"))
            if not keys:
                return x if x.type != "nurbsCurve" else None
            nxt = x.inputs.get(keys[0])
        x = nxt[0] if nxt else None
    return last if last is not None and last.type != "nurbsCurve" else None
