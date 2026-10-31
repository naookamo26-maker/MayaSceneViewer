# -*- coding: utf-8 -*-
"""HumanIK（HIK）の構成の読み取り（評価はしない）。

.ma の接続だけを見て、キャラクター（HIKCharacterNode）ごとに次を調べる。警告とリグの診断に使う。
  * キャラクタライズ: どのジョイントがどの部位（Hips・LeftUpLeg など）か（ジョイントの .ch → キャラクターの部位の属性）
  * スケルトンを動かすもの: HIKState2SK（HIK が求めた姿勢をジョイントの移動・回転・スケールに書き出すノード）の
    入力（.InputCharacterState）をさかのぼって、ソースを見分ける
      - HIKRetargeterNode → 別のキャラクターからのリターゲット（ソースは .InputCharacterDefinitionSrc のキャラクター）
      - HIKSolverNode ← HIKFK2State（FK のコントローラー）・HIKEffector2State / HIKPinning2State（IK エフェクター）
        → コントロールリグ
      - HIKSolverNode に入力がない → スタンス（キャラクタライズの姿勢）
  * コントロールリグのノードの数（FK のコントローラー・IK エフェクター）

HumanIK のソルバーは計算式が公開されていないため、ビューアは評価しない（HIKState2SK で動くジョイントは、
バインドポーズの形で推定して表示する）。Maya でスケルトンにベイクして保存すれば、キーとして再生できる。
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

# HumanIK のノード（mayaHIK プラグイン。Maya に付属）。DG ノードは "HIK" で始まり、DAG ノードは "hik" で始まる
HIK_DAG_TYPES = {"hikFKJoint", "hikIKEffector", "hikFloorContactMarker"}
HIK_PLUGIN = "mayaHIK"

_CURVES = ("animCurveTL", "animCurveTA", "animCurveTU")


def is_hik_type(type_name: str) -> bool:
    return type_name.startswith("HIK") or type_name in HIK_DAG_TYPES or type_name == "hikSolver"


@dataclass
class HikSource:
    kind: str                                   # retarget・control_rig・stance・unknown
    character: Optional[object] = None          # リターゲットのソースのキャラクター（MaNode）
    fk: int = 0                                 # コントロールリグの FK のコントローラーの数
    ik: int = 0                                 # コントロールリグの IK エフェクターの数
    pinning: bool = False                       # ピン留め（HIKPinning2State）を通る
    via: str = ""                               # スケルトンに書き出すまでのノード（診断用）
    other: str = ""                             # unknown のときの入力の型
    state2sk: Optional[object] = None           # スケルトンに書き出す HIKState2SK
    fk2state: Optional[object] = None           # コントロールリグの FK のコントローラーを読む HIKFK2State
    effectors: List[object] = field(default_factory=list)       # コントロールリグの IK エフェクター（hikIKEffector）


@dataclass
class HikCharacter:
    node: object                                # HIKCharacterNode（MaNode）
    bones: Dict[str, object] = field(default_factory=dict)      # 部位 → ジョイント
    driven: List[object] = field(default_factory=list)          # HIKState2SK で動くノード
    sources: List[HikSource] = field(default_factory=list)      # HIKState2SK ごとのソース
    feeds: List[str] = field(default_factory=list)              # このキャラクターをソースにするキャラクター
    keyed_bones: int = 0                        # キーのある部位のジョイントの数
    fk_parts: List[str] = field(default_factory=list)           # FK のコントローラーで評価する部位
    fk_missing: List[str] = field(default_factory=list)         # FK のコントローラーのない部位（評価しない）
    ik_active: List[str] = field(default_factory=list)          # Reach が 0 でない（またはキーのある）IK エフェクター

    @property
    def name(self) -> str:
        return self.node.name


def _input(n, attr: str) -> Optional[Tuple[object, str]]:
    """n の属性 attr（大文字・小文字を区別しない）への入力 (接続元, 接続元の属性)"""
    hit = n.inputs.get(attr)
    if hit is not None:
        return hit
    low = attr.lower()
    for k, v in n.inputs.items():
        if k.lower() == low:
            return v
    return None


def _src(n, attr: str):
    hit = _input(n, attr)
    return hit[0] if hit else None


def _dag_sources(n) -> List[object]:
    """n に行列などを渡している DAG ノード（コントロールリグのコントローラー。Reference は数えない）"""
    seen: Dict[int, object] = {}
    for k, (src, _a) in n.inputs.items():
        if (src.is_dag or src.type in HIK_DAG_TYPES or src.type == "joint") and not k.startswith("Reference"):
            seen.setdefault(id(src), src)
    return list(seen.values())


def _effector_chain(n, out: HikSource, depth: int = 0):
    """IK エフェクターの状態（.InputEffectorState）をさかのぼる"""
    if n is None or depth > 8:
        return
    if n.type == "HIKPinning2State":
        out.pinning = True
        _effector_chain(_src(n, "InputEffectorState"), out, depth + 1)
    elif n.type == "HIKEffector2State":
        out.effectors = _dag_sources(n)
        out.ik = len(out.effectors)


def _classify(state, depth: int = 0) -> HikSource:
    """HIKState2SK の .InputCharacterState の接続元から、ソースを見分ける"""
    if state is None:
        return HikSource("stance", via="（入力なし）")
    if state.type == "HIKRetargeterNode":
        return HikSource("retarget", character=_src(state, "InputCharacterDefinitionSrc"), via=state.name)
    if state.type == "HIKSolverNode" and depth < 4:
        out = HikSource("stance", via=state.name)
        cs = _src(state, "InputCharacterState")
        if cs is not None and cs.type == "HIKFK2State":
            out.fk2state = cs
            out.fk = len(_dag_sources(cs))
        elif cs is not None:
            inner = _classify(cs, depth + 1)
            if inner.kind == "retarget":
                inner.via = "%s → %s" % (inner.via, state.name)
                return inner
        _effector_chain(_src(state, "InputEffectorState"), out)
        if out.fk or out.ik or cs is not None and cs.type == "HIKFK2State":
            out.kind = "control_rig"
        return out
    return HikSource("unknown", via=state.name, other=state.type)


def analyze_hik(ms) -> List[HikCharacter]:
    """シーンの HumanIK のキャラクターと、そのスケルトンを動かすものを調べる（接続だけを見る）"""
    chars = {id(n): HikCharacter(n) for n in ms.nodes if n.type == "HIKCharacterNode"}
    if not chars and not any(n.type == "HIKState2SK" for n in ms.nodes):
        return []
    for src, sattr, dst, dattr in ms.connections:
        c = chars.get(id(dst))
        if c is not None and sattr.split("[")[0] in ("ch", "Character") and src.is_dag:
            c.bones.setdefault(dattr.split("[")[0], src)
    outs: Dict[int, List[object]] = {}
    for src, _sattr, dst, _dattr in ms.connections:
        if src.type == "HIKState2SK" and dst.is_dag:
            lst = outs.setdefault(id(src), [])
            if all(x is not dst for x in lst):
                lst.append(dst)
    for n in ms.nodes:
        if n.type != "HIKState2SK":
            continue
        cdef = _src(n, "InputCharacterDefinition")
        c = chars.get(id(cdef)) if cdef is not None else None
        if c is None:                           # キャラクターの分からない書き出し（ふつうはない）
            c = chars.setdefault(id(n), HikCharacter(n))
        c.sources.append(_classify(_src(n, "InputCharacterState")))
        c.sources[-1].state2sk = n
        for d in outs.get(id(n), []):
            if all(x is not d for x in c.driven):
                c.driven.append(d)
    for c in chars.values():
        for s in c.sources:
            if s.kind == "retarget" and s.character is not None and id(s.character) in chars:
                feeds = chars[id(s.character)].feeds
                if c.name not in feeds:
                    feeds.append(c.name)
        c.keyed_bones = sum(1 for j in c.bones.values()
                            if any(src.type in _CURVES for src, _a in j.inputs.values()))
    return sorted(chars.values(), key=lambda c: c.name)


def hik_driven_ids(chars: List[HikCharacter]) -> set:
    return {id(d) for c in chars for d in c.driven}


def describe_source(s: HikSource) -> str:
    if s.kind == "retarget":
        return "キャラクター %s からのリターゲット" % (s.character.name if s.character is not None else "（不明）")
    if s.kind == "control_rig":
        parts = []
        if s.fk:
            parts.append("FK のコントローラー %d 個" % s.fk)
        if s.ik:
            parts.append("IK エフェクター %d 個" % s.ik)
        if s.pinning:
            parts.append("ピン留めあり")
        return "コントロールリグ" + ("（%s）" % "・".join(parts) if parts else "")
    if s.kind == "stance":
        return "スタンス（キャラクタライズの姿勢。ソースなし）"
    return "%s（%s）" % (s.via, s.other)


def _names(nodes, k: int = 4) -> str:
    names = [n.name for n in nodes]
    return "、".join(names[:k]) + (" ほか" if len(names) > k else "")


def hik_warnings(chars: List[HikCharacter]) -> List[str]:
    """キャラクターごとの警告（FK で評価するスケルトンと、評価しない HIKState2SK で動くスケルトン）"""
    out = []
    for c in chars:
        if c.fk_parts:
            out.append("HumanIK: キャラクター %s のスケルトン（%d 部位）は、コントロールリグの FK のコントローラーから求めて"
                       "再生します（HumanIK の計算は公開されていないため近似です。IK エフェクター・ピン留め・床の接地・"
                       "Pull などの全身の解き方は再現しません）。" % (c.name, len(c.fk_parts)))
            if c.ik_active:
                out.append("HumanIK: キャラクター %s の IK エフェクター %s は Reach が 0 ではない（またはキーがある）ため、"
                           "Maya では FK の姿勢から動きますが、ビューアは FK の姿勢で表示します。"
                           % (c.name, "、".join(c.ik_active[:6]) + (" ほか" if len(c.ik_active) > 6 else "")))
        if not c.driven:
            continue
        how = "・".join(dict.fromkeys(describe_source(s) for s in c.sources if s.kind != "control_rig" or not c.fk_parts))
        how = how or "コントロールリグ（FK のコントローラーのない部位）"
        out.append("HumanIK: キャラクター %s のスケルトン（%s。%d 個）は、%sで動きます。ビューアは HumanIK を評価しないため、"
                   "これらの動きは再生されません（バインドポーズの情報があればその形で、なければファイルの値で表示します）。"
                   "Maya でスケルトンにベイクして保存する"
                   "（HumanIK のパネルの［ベイク処理］→［スケルトンのベイク処理］）と、キーとして再生できます"
                   "（Maya 内で読み込むと、Maya が評価した姿勢で表示します）。"
                   % (c.name, _names(c.driven), len(c.driven), how))
    return out


def hik_report(chars: List[HikCharacter]) -> List[str]:
    """リグの診断の「HumanIK」の節"""
    out = ["■ HumanIK（コントロールリグの FK は近似で評価。そのほかは評価しません。スケルトンにベイクすると再生できます）"]
    if not chars:
        out.append("  なし")
        return out
    for c in chars:
        if c.node.type != "HIKCharacterNode":
            out.append("- %s（%s）: キャラクターの分からない HumanIK の書き出し" % (c.name, c.node.type))
        else:
            out.append("- キャラクター %s: 部位 %d 個をキャラクタライズ（%s）"
                       % (c.name, len(c.bones), "、".join("%s=%s" % (k, j.name) for k, j in list(c.bones.items())[:6])
                          + (" ほか" if len(c.bones) > 6 else "")))
        for s in c.sources:
            mark = "✓" if s.kind == "control_rig" and c.fk_parts else "★"
            out.append("    %s スケルトンを動かすもの: %s（%s → HIKState2SK）" % (mark, describe_source(s), s.via))
        if c.fk_parts:
            out.append("    ✓ FK のコントローラーから求める部位: %d 個（%s）"
                       % (len(c.fk_parts), "、".join(c.fk_parts[:8]) + (" ほか" if len(c.fk_parts) > 8 else "")))
        if c.fk_missing:
            out.append("    ★ FK のコントローラーのない部位（評価しません）: %s" % "、".join(c.fk_missing))
        if c.ik_active:
            out.append("    ★ Reach が 0 でない IK エフェクター（FK の姿勢で表示）: %s" % "、".join(c.ik_active))
        if c.driven:
            out.append("    ★ HumanIK で動くノード（評価しません）: %d 個（%s）" % (len(c.driven), _names(c.driven, 8)))
        elif c.bones and not c.fk_parts:
            out.append("    ✓ スケルトンは HumanIK で動いていません（ジョイントのキー・ファイルの値で表示）")
        if c.feeds:
            out.append("    このキャラクターをソースにするキャラクター: %s（部位のジョイントのうちキーのあるもの %d 個）"
                       % ("、".join(c.feeds), c.keyed_bones))
    return out


# ---------------------------------------------------------------------------
# コントロールリグの FK → スケルトン（ビューアの行列ノードに組み立てる）
# ---------------------------------------------------------------------------
#
# HumanIK のコントロールリグの FK のコントローラー（hikFKJoint）は、スタンス（キャラクタライズの姿勢）で回転の値が 0、
# ワールドの向きがスタンスの「HumanIK の向き」になるように作られる（Kano・Rokoko のシーンで確かめた。位置は
# スケルトンの部位の位置と同じ）。スケルトンの部位のスタンスのワールドの向きは、キャラクター（HIKCharacterNode）の
# <部位>Rx・Ry・Rz（xyz の順のオイラー角。<部位>JointOrient は掛けない）、位置は <部位>Tx・Ty・Tz。
# IK エフェクターの Reach が 0 なら、HumanIK はコントローラーの FK の姿勢をそのまま使うので、スケルトンの部位の
# ワールドの行列は（行ベクトル）
#     W = O · C,   O = 回転(スタンスのスケルトンの向き) · 回転(スタンスのコントローラーの向き)⁻¹
# （C はコントローラーのワールドの行列。位置はスタンスで一致するので O は回転だけ）。ジョイントのローカルは
#     L = W · pim,   移動 = L の移動,   回転 = rotateAxis⁻¹ · L · jointOrient⁻¹ を回転順で分けたもの
# これを multMatrix → decomposeMatrix の組で作り、HIKState2SK の代わりにジョイントの移動・回転へつなぐ
# （評価はビューアの行列ノードのまま。ポーズ確認でコントローラーを動かしても追従する）。
# スケールは扱わない（つないでいた HIKState2SK の接続を外し、ファイルの値・既定値のまま）。

_FK_CHANNELS = ("Tx", "Ty", "Tz", "Rx", "Ry", "Rz", "Sx", "Sy", "Sz")


def _rot_only(m):
    out = list(m)
    out[12:15] = [0.0, 0.0, 0.0]
    return out


def _local_rot(n, k):
    """回転の値を 0 にしたときのローカルの回転（rotateAxis · jointOrient。offsetParentMatrix も掛ける）"""
    from . import mathutil as M
    ra = n.vec3("ra")
    m = M.euler([ra[0] * k, ra[1] * k, ra[2] * k], "xyz")
    if n.type == "joint":
        jo = n.vec3("jo")
        m = M.mul(m, M.euler([jo[0] * k, jo[1] * k, jo[2] * k], "xyz"))
    opm = n.xattrs.get("opm")
    if opm is not None and len(opm) == 16:
        m = M.mul(m, _rot_only(opm))
    return m


def _rest_world_rot(n, k):
    """回転の値を 0 にしたときのワールドの回転（コントローラーのスタンスの向き）"""
    from . import mathutil as M
    m = M.identity()
    x = n
    while x is not None:
        m = M.mul(m, _local_rot(x, k))
        x = x.parent if x.flag("it", True) else None
    return m


def _new_node(ms, name: str, type_name: str, baked: dict):
    from .ma_scene import MaNode
    n = MaNode(name, type_name, None, len(ms.nodes), "")
    n.baked = baked
    ms.nodes.append(n)
    return n


def _connect(ms, src, sattr: str, dst, dattr: str):
    dst.inputs[dattr] = (src, sattr)
    ms.connections.append((src, sattr, dst, dattr))


def _is_keyed(n, attrs) -> bool:
    return any(_base_attr(k) in attrs and src.type.startswith("animCurve") for k, (src, _a) in n.inputs.items())


def _base_attr(k: str) -> str:
    return k.split("[")[0]


def build_fk_rigs(ms, chars: List[HikCharacter]) -> int:
    """コントロールリグで動くスケルトンを、FK のコントローラーからの行列ノードに置き換える。戻り値: 置き換えた部位の数"""
    from . import mathutil as M
    from .rig import parse_attrs
    k = math.pi / 180.0 if ms.angular_unit not in ("rad", "radian") else 1.0
    total = 0
    for c in chars:
        if c.node.type != "HIKCharacterNode":
            continue
        stance = None
        for s in c.sources:
            if s.kind != "control_rig" or s.fk2state is None or s.state2sk is None:
                continue
            if stance is None:
                stance = parse_attrs(ms.text, c.node) if c.node.span else {}
            ctrl = {}
            for key, (src, sattr) in s.fk2state.inputs.items():
                if key.endswith("GX") and sattr.split("[")[0] in ("wm", "worldMatrix") and src.is_dag:
                    ctrl[key[:-2]] = src
            for e in s.effectors:
                attrs = parse_attrs(ms.text, e) if e.span else {}
                reach = [abs(float(attrs.get(a, 0) or 0)) for a in ("rt", "rr")]
                if max(reach) > 1e-6 or _is_keyed(e, ("rt", "rr", "reachTranslation", "reachRotation")):
                    c.ik_active.append(e.name)
            # HIKState2SK の出力: 部位 → (ジョイント, [(出力の属性, ジョイントの属性)])
            joints: Dict[str, Tuple[object, List[Tuple[str, str]]]] = {}
            for src, sattr, dst, dattr in ms.connections:
                if src is s.state2sk and dst.is_dag and sattr[-2:] in _FK_CHANNELS:
                    part = sattr[:-2]
                    j, lst = joints.setdefault(part, (dst, []))
                    if j is dst:
                        lst.append((sattr, dattr))
            for part, (j, plugs) in sorted(joints.items()):
                cn = ctrl.get(part)
                if cn is None:
                    c.fk_missing.append(part)
                    continue
                g = lambda a: float(stance.get(part + a, 0) or 0)       # noqa: E731
                skel = M.euler([g("Rx") * k, g("Ry") * k, g("Rz") * k], "xyz")
                off = M.mul(skel, M.inverse(_rest_world_rot(cn, k)))
                ra, jo = j.vec3("ra"), j.vec3("jo")
                inv_ra = M.inverse(M.euler([ra[0] * k, ra[1] * k, ra[2] * k], "xyz"))
                inv_jo = M.inverse(M.euler([jo[0] * k, jo[1] * k, jo[2] * k], "xyz"))
                ro = int(j.xattrs.get("ro", 0) or 0)
                base = "%s_hikFK" % j.name
                mt = _new_node(ms, base + "_t", "multMatrix", {"i[0]": off})
                mr = _new_node(ms, base + "_r", "multMatrix", {"i[0]": M.mul(inv_ra, off), "i[3]": inv_jo})
                dt = _new_node(ms, base + "_dt", "decomposeMatrix", {})
                dr = _new_node(ms, base + "_dr", "decomposeMatrix", {"ro": ro})
                for m in (mt, mr):
                    _connect(ms, cn, "wm", m, "i[1]")
                    _connect(ms, j, "pim", m, "i[2]")
                _connect(ms, mt, "o", dt, "imat")
                _connect(ms, mr, "o", dr, "imat")
                # HIKState2SK の接続を外して、移動・回転を行列ノードからつなぐ
                drop = {d for _sa, d in plugs}
                ms.connections = [x for x in ms.connections if not (x[0] is s.state2sk and x[2] is j)]
                for d in drop:
                    if j.inputs.get(d, (None,))[0] is s.state2sk:
                        del j.inputs[d]
                for axis in "xyz":
                    _connect(ms, dt, "ot" + axis, j, "t" + axis)
                    _connect(ms, dr, "or" + axis, j, "r" + axis)
                c.fk_parts.append(part)
                total += 1
            c.driven = [d for d in c.driven if any(src.type == "HIKState2SK" for src, _a in d.inputs.values())]
    return total
