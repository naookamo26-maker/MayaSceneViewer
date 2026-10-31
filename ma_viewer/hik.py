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


@dataclass
class HikCharacter:
    node: object                                # HIKCharacterNode（MaNode）
    bones: Dict[str, object] = field(default_factory=dict)      # 部位 → ジョイント
    driven: List[object] = field(default_factory=list)          # HIKState2SK で動くノード
    sources: List[HikSource] = field(default_factory=list)      # HIKState2SK ごとのソース
    feeds: List[str] = field(default_factory=list)              # このキャラクターをソースにするキャラクター
    keyed_bones: int = 0                        # キーのある部位のジョイントの数

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


def _dag_sources(n) -> int:
    """n に行列などを渡している DAG ノードの数（コントロールリグのコントローラーを数える）"""
    seen = set()
    for _k, (src, _a) in n.inputs.items():
        if src.is_dag or src.type in HIK_DAG_TYPES or src.type == "joint":
            seen.add(id(src))
    return len(seen)


def _effector_chain(n, out: HikSource, depth: int = 0):
    """IK エフェクターの状態（.InputEffectorState）をさかのぼる"""
    if n is None or depth > 8:
        return
    if n.type == "HIKPinning2State":
        out.pinning = True
        _effector_chain(_src(n, "InputEffectorState"), out, depth + 1)
    elif n.type == "HIKEffector2State":
        out.ik += _dag_sources(n)


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
            out.fk = _dag_sources(cs)
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
    """HIKState2SK で動くスケルトンごとに 1 つの警告"""
    out = []
    for c in chars:
        if not c.driven:
            continue
        how = "・".join(dict.fromkeys(describe_source(s) for s in c.sources))
        out.append("HumanIK: キャラクター %s のスケルトン（%s。%d 個）は、%sで動きます。ビューアは HumanIK を評価しないため、"
                   "これらの動きは再生されません（バインドポーズの情報があればその形で、なければファイルの値で表示します）。"
                   "Maya でスケルトンにベイクして保存する"
                   "（HumanIK のパネルの［ベイク処理］→［スケルトンのベイク処理］）と、キーとして再生できます"
                   "（Maya 内で読み込むと、Maya が評価した姿勢で表示します）。"
                   % (c.name, _names(c.driven), len(c.driven), how))
    return out


def hik_report(chars: List[HikCharacter]) -> List[str]:
    """リグの診断の「HumanIK」の節"""
    out = ["■ HumanIK（ビューアは評価しません。動きはスケルトンにベイクすると再生できます）"]
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
        if c.driven:
            for s in c.sources:
                out.append("    ★ スケルトンを動かすもの: %s（%s → HIKState2SK）" % (describe_source(s), s.via))
            out.append("    ★ HumanIK で動くノード: %d 個（%s）" % (len(c.driven), _names(c.driven, 8)))
        elif c.bones:
            out.append("    ✓ スケルトンは HumanIK で動いていません（ジョイントのキー・ファイルの値で表示）")
        if c.feeds:
            out.append("    このキャラクターをソースにするキャラクター: %s（部位のジョイントのうちキーのあるもの %d 個）"
                       % ("、".join(c.feeds), c.keyed_bones))
    return out
