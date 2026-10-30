# -*- coding: utf-8 -*-
""".ma のコマンド列を解釈し、ノード・属性・接続を保持するシーンモデル。

ビューアに必要な情報だけを保持する（メモリ節約のため、関係しない属性は読み捨てる）:
  * transform / joint 等の DAG ノード: 移動・回転・スケール等
  * mesh: 頂点(.vt) / 頂点調整(.pt) / 辺(.ed) / 面(.fc)
  * skinCluster: ウェイト(.wl) / バインド行列(.pm) / ジオメトリ行列(.gm)
  * tweak: 頂点オフセット(.vl[k].vt)
  * すべての接続（デフォーマの経路やインフルエンスの特定に使う）
"""
from __future__ import annotations

import os
import re
from typing import Callable, Dict, List, Optional, Tuple

from . import ma_reader as R

# 進捗の通知: progress(全体の割合 0〜1, 文言)。3 つめの引数を受け取る関数には、リファレンスを読んでいる間、
# いま読んでいるファイルの (文言, 割合) も渡す（progress_accepts_detail）
ProgressFn = Optional[Callable[..., None]]


def progress_accepts_detail(fn) -> bool:
    """進捗の関数が 3 つめの引数（いま読んでいるファイルの進み具合）を受け取るか"""
    if fn is None:
        return False
    import inspect
    try:
        params = list(inspect.signature(fn).parameters.values())
    except (TypeError, ValueError):
        return False
    if any(p.kind == p.VAR_POSITIONAL for p in params):
        return True
    return len([p for p in params if p.kind in (p.POSITIONAL_ONLY, p.POSITIONAL_OR_KEYWORD)]) >= 3

# numpy があれば、大量の数値（面の定義・ウェイト）をまとめて処理する（なければ従来の処理）
try:
    import numpy as np
except Exception:          # noqa: BLE001  Maya の古い版など
    np = None


def numpy_enabled() -> bool:
    """numpy の高速な経路を使うか（環境変数 MA_VIEWER_NO_NUMPY=1 で無効にできる。テスト用）"""
    return np is not None and os.environ.get("MA_VIEWER_NO_NUMPY") != "1"

# 変形ノードとして扱う型（transform 系の行列計算を行う DAG ノード）
TRANSFORM_TYPES = {
    "transform", "joint", "ikHandle", "ikEffector", "lodGroup", "place3dTexture",
    "nucleus", "hikIKEffector", "aimConstraint", "parentConstraint", "pointConstraint",
    "orientConstraint", "scaleConstraint", "poleVectorConstraint", "tangentConstraint",
    "normalConstraint", "geometryConstraint", "pointOnPolyConstraint", "dagContainer",
}

# シェイプ（行列を持たない DAG 末端ノード）として扱う型
SHAPE_TYPES = {
    "mesh", "nurbsCurve", "nurbsSurface", "locator", "camera", "subdiv", "lattice",
    "baseLattice", "clusterHandle", "follicle", "hairSystem", "nParticle", "particle",
    "imagePlane", "annotationShape", "distanceDimShape", "paramDimension", "pfxHair",
    "pfxToon", "stroke", "fluidShape", "heightField", "gpuCache", "aiStandIn",
    "pointLight", "directionalLight", "spotLight", "areaLight", "ambientLight",
    "volumeLight", "aiSkyDomeLight", "aiAreaLight", "deformBend", "deformTwist",
    "deformSquash", "deformFlare", "deformSine", "deformWave", "renderBox",
    "renderSphere", "renderCone", "implicitBox", "implicitSphere", "implicitCone",
}

_VEC3_ATTRS = {"t", "r", "s", "jo", "ra", "rp", "sp", "rpt", "spt", "sh"}
_VEC3_DEFAULTS = {"s": (1.0, 1.0, 1.0)}
_COMPONENT_ATTRS = {}
for _base in ("t", "r", "s", "jo", "ra", "rp", "sp", "rpt", "spt"):
    for _i, _ax in enumerate("xyz"):
        _COMPONENT_ATTRS[_base + _ax] = (_base, _i)
_COMPONENT_ATTRS.update({"shxy": ("sh", 0), "shxz": ("sh", 1), "shyz": ("sh", 2)})
# 移動・回転・スケールの制限（transform の属性）: 種類 → (最小, 最大, 最小を有効にする, 最大を有効にする) の短い名前。
# 値の成分は mtxl（最小の X）・xtxl（最大の X）など、有効にするフラグの成分は mtxe・xtxe など
LIMIT_ATTRS = {"t": ("mntl", "mxtl", "mtle", "xtle"), "r": ("mnrl", "mxrl", "mrle", "xrle"),
               "s": ("mnsl", "mxsl", "msle", "xsle")}
_LIMIT_ENABLES = {}
for _k, (_mn, _mx, _mne, _mxe) in LIMIT_ATTRS.items():
    _c = {"t": "t", "r": "r", "s": "s"}[_k]
    _VEC3_ATTRS |= {_mn, _mx}
    for _i, _ax in enumerate("xyz"):
        _COMPONENT_ATTRS["m%s%sl" % (_c, _ax)] = (_mn, _i)
        _COMPONENT_ATTRS["x%s%sl" % (_c, _ax)] = (_mx, _i)
        _LIMIT_ENABLES["m%s%se" % (_c, _ax)] = (_mne, _i)
        _LIMIT_ENABLES["x%s%se" % (_c, _ax)] = (_mxe, _i)
    _LIMIT_ENABLES[_mne] = (_mne, -1)
    _LIMIT_ENABLES[_mxe] = (_mxe, -1)
_VEC3_DEFAULTS.update({"mntl": (-1.0, -1.0, -1.0), "mxtl": (1.0, 1.0, 1.0), "mnsl": (-1.0, -1.0, -1.0),
                       "mxsl": (1.0, 1.0, 1.0)})   # 回転の既定値（±45 度）はファイルの角度の単位による（MaNode.limits）

def clamp_limits(v, lim) -> Tuple[float, float, float]:
    """3 つの値を制限（MaNode.limits の 1 種類分 [[最小 × 3], [最大 × 3]]。None は制限なし）の範囲に収める"""
    if not lim:
        return tuple(v)
    out = []
    for i in range(3):
        x = v[i]
        if lim[0][i] is not None and x < lim[0][i]:
            x = lim[0][i]
        if lim[1][i] is not None and x > lim[1][i]:
            x = lim[1][i]
        out.append(x)
    return tuple(out)


# ロックを読む属性（移動・回転・スケールのまとめと成分）
_LOCK_NAMES = {b + ax for b in "trs" for ax in ("", "x", "y", "z")}


def locked_channels(locks: Dict[str, bool]) -> Optional[Dict[str, List[bool]]]:
    """ロックの記録（setAttr -l の順）→ {"t" | "r" | "s": [X, Y, Z]}（ロックのないものは除く。なければ None）。
    まとめ（.t）のロックは成分すべて。あとの setAttr が前のものを上書きする（dict の順は書かれた順）"""
    out = {k: [False, False, False] for k in "trs"}
    for name, on in locks.items():
        if len(name) == 1:
            out[name] = [on, on, on]
        else:
            out[name[0]]["xyz".index(name[1])] = on
    out = {k: v for k, v in out.items() if any(v)}
    return out or None


# ノードのローカル行列を決める属性（短い名前）。ここに接続があればビューアが毎フレーム評価する
XFORM_BASES = ("t", "r", "s", "jo", "ra", "rp", "sp", "rpt", "spt")
XFORM_KEYS = (set(XFORM_BASES) | {b + ax for b in XFORM_BASES for ax in "xyz"}
              | {"sh", "shxy", "shxz", "shyz", "ro", "opm"})
_XFORM_GROUP_RE = re.compile(r"^(t|r|s|jo|ra|rp|sp|rpt|spt)[xyz]?$")


def xform_group(key: str) -> Optional[str]:
    """ローカル行列の属性の種類（tx → t・rpx → rp・shxy → sh・ro → ro）。ほかの属性は None"""
    b = key.split("[")[0].split(".")[0]
    if b in ("ro", "opm"):
        return b
    if b in ("sh", "shxy", "shxz", "shyz"):
        return "sh"
    m = _XFORM_GROUP_RE.match(b)
    return m.group(1) if m else None


_BOOL_ATTRS = {"v", "io", "it", "ssc", "ove", "ovv", "lodv", "ovrgbf", "tmp"}   # tmp: テンプレート
_INT_ATTRS = {"ro", "ovc", "ovdt"}    # ovc・ovdt: 描画のオーバーライドの色番号・表示の種類
_FLOAT_ATTRS = {"radi"}
# ノードの種類ごとに使う属性（これ以外の setAttr は値を解析せずに読み飛ばす）
_XFORM_NAMES = _VEC3_ATTRS | set(_COMPONENT_ATTRS) | set(_LIMIT_ENABLES) | _BOOL_ATTRS | _INT_ATTRS | _FLOAT_ATTRS | {"bps", "opm", "ovrgb"}
_MESH_NAMES = _XFORM_NAMES | {"vt", "pt", "ed", "fc", "cuvs", "uvst", "iog"}
_SKIN_NAMES = _XFORM_NAMES | {"wl", "pm", "gm", "skm", "mi", "nw", "wd"}
_PLUG_RE = re.compile(r'"([^"]*)"')

# setAttr を 1 つも使わず、DAG の子も持たない種類のノード（後に続く字下げされた行をまとめて読み飛ばす）
_SKIP_ATTR_TYPES = {
    # 一般的なユーティリティ・管理用のノード
    "unitConversion", "multiplyDivide", "plusMinusAverage", "condition", "reverse", "clamp", "setRange",
    "blendColors", "blendTwoAttr", "blendWeighted", "pairBlend", "multDoubleLinear", "addDoubleLinear",
    "decomposeMatrix", "composeMatrix", "multMatrix", "inverseMatrix", "pickMatrix", "blendMatrix", "fourByFourMatrix",
    "choice", "remapValue", "network", "expression", "script", "objectSet", "renderLayer",
    "displayLayerManager", "renderLayerManager", "nodeGraphEditorInfo", "hyperGraphInfo", "hyperView",
    "hyperLayout", "polyBlindData", "blindDataTemplate", "reference", "blendShape", "cluster", "ffd",
    "nonLinear", "wire", "wrap", "deltaMush", "tension", "animLayer", "character", "clipLibrary",
    "clipScheduler", "timeEditor", "timeEditorTracks", "sequenceManager", "shapeEditorManager",
    "poseInterpolatorManager", "lightLinker", "partition", "brush", "strokeGlobals", "ikRPsolver",
    "ikSCsolver", "ikSplineSolver", "ikSystem", "hikSolver", "controller",
    "aiOptions", "aiAOVDriver", "aiAOVFilter", "aiImagerDenoiserOidn",
    # リグの計算ノード（値は 2 段階目に属性の範囲から読む）
    "quatToEuler", "eulerToQuat", "quatProd", "quatInvert", "quatNormalize", "quatSlerp", "curveInfo",
    "distanceBetween", "vectorProduct", "angleBetween", "pointOnCurveInfo", "motionPath", "animBlendNodeAdditiveDL", "animBlendNodeAdditiveDA",
    "animBlendNodeAdditiveRotation", "animBlendNodeAdditiveScale", "animBlendNodeAdditive", "animBlendNodeAdditiveF",
    "animBlendNodeAdditiveFL", "animBlendNodeAdditiveFA", "animBlendNodeAdditiveI16", "animBlendNodeAdditiveI32",
    "animBlendNodeBoolean", "animBlendNodeEnum", "animBlendNodeTime",
}
# シェイプのうち、メッシュ以外（子を持たず、属性も使わない）
_SKIP_SHAPE_TYPES = SHAPE_TYPES - {"mesh"}


def skips_attrs(node_type: str) -> bool:
    """この種類のノードの setAttr はすべて読み飛ばしてよいか（MA_VIEWER_NO_SKIP=1 で無効。テスト用）"""
    if os.environ.get("MA_VIEWER_NO_SKIP") == "1" or node_type in RAW_TYPES or node_type in ("mesh", "skinCluster", "tweak", "groupParts"):
        return False
    return (node_type.startswith("animCurve") or node_type in _SKIP_ATTR_TYPES or node_type in _SKIP_SHAPE_TYPES
            or node_type.endswith("Constraint") or (node_type.startswith("poly") and node_type != "polyFaces"))

# 属性値をそのまま保持するノード型（マテリアル・テクスチャ）
RAW_TYPES = {
    "file", "place2dTexture", "uvChooser", "shadingEngine", "lambert", "blinn", "phong", "phongE",
    "anisotropic", "surfaceShader", "aiStandardSurface", "standardSurface", "openPBRSurface",
    "StingrayPBS", "usdPreviewSurface", "aiFlat", "dagPose", "groupParts", "bump2d", "aiNormalMap",
    "displayLayer", "camera",
}

_LINEAR_UNITS = {"mm": "mm", "millimeter": "mm", "cm": "cm", "centimeter": "cm",
                 "m": "m", "meter": "m", "km": "km", "kilometer": "km",
                 "in": "in", "inch": "in", "ft": "ft", "foot": "ft",
                 "yd": "yd", "yard": "yd", "mi": "mi", "mile": "mi"}
_ANGULAR_UNITS = {"deg": "deg", "degree": "deg", "rad": "rad", "radian": "rad",
                  "min": "min", "sec": "sec"}


class MeshData:
    __slots__ = ("vt", "pt", "ed", "fc", "holes", "uvsp", "uvsn", "cuvs", "groups")

    def __init__(self):
        self.vt: List[Tuple[int, List[float]]] = []      # (開始頂点番号, [x,y,z,...])
        self.pt: List[Tuple[int, List[float]]] = []
        self.ed: List[Tuple[int, List[int]]] = []        # (開始辺番号, [v1,v2,hard,...])
        # (開始面番号, [[辺番号...], ...], {UVセット番号: [面ごとの UV 番号リスト or None]})
        self.fc: List[Tuple[int, List[List[int]], Dict[int, list]]] = []
        self.holes = 0
        self.uvsp: Dict[int, List[Tuple[int, List[float]]]] = {}   # UVセット番号 → (開始番号, [u,v,...])
        self.uvsn: Dict[int, str] = {}                              # UVセット番号 → 名前
        self.cuvs: Optional[str] = None                             # 現在の UV セット名
        self.groups: Dict[int, List[Tuple[int, int]]] = {}          # objectGroups 番号 → 面の範囲

    def has_topology(self) -> bool:
        return bool(self.vt) and bool(self.ed) and bool(self.fc)


class SkinData:
    __slots__ = ("_weights", "sparse", "pm", "gm", "skm", "mi", "nw", "wd")

    def __init__(self):
        self._weights: Dict[int, Dict[int, float]] = {}  # 頂点 → {インフルエンス論理番号: 値}
        # まとめて書かれた疎形式の行（numpy の経路用）: [(最初の頂点, 最後の頂点, 値の文字列)]
        self.sparse: List[Tuple[int, int, List[str]]] = []
        self.pm: Dict[int, List[float]] = {}
        self.gm: Optional[List[float]] = None
        self.skm = 0
        self.mi = None
        self.nw = None
        self.wd = None      # weightDistribution（0: 距離, 1: 近傍）

    @property
    def weights(self) -> Dict[int, Dict[int, float]]:
        """頂点 → {論理番号: 値}。保持している疎形式の行は、参照した時点で辞書に展開する（記述順を保つ）"""
        if self.sparse:
            for a, b, vals in self.sparse:
                _sparse_into(self._weights, a, b, vals)
            self.sparse = []
        return self._weights


def _sparse_into(weights: Dict[int, Dict[int, float]], a: int, b: int, vals) -> None:
    """疎形式（頂点ごとに「個数 (番号 値)×個数」）を辞書に入れる。vals はトークンのリストか値の文字列"""
    if isinstance(vals, str):
        vals = vals.split()
    p = 0
    for v in range(a, b + 1):
        cnt = int(R.to_float(vals[p]))
        p += 1
        d = {}
        for _ in range(cnt):
            d[int(vals[p])] = float(vals[p + 1])
            p += 2
        weights[v] = d


class MaNode:
    __slots__ = ("name", "type", "parent", "children", "path", "order", "is_dag",
                 "xattrs", "mesh", "skin", "tweak", "inputs", "raw", "skip_attrs", "span", "attr_map", "ns", "espan",
                 "node_def", "baked", "xspans", "ssc_parent", "locks")

    def __init__(self, name: str, node_type: str, parent: Optional["MaNode"], order: int, ns: str = ""):
        self.name = name
        self.type = node_type
        self.parent = parent
        self.children: List[MaNode] = []
        self.order = order
        self.is_dag = parent is not None or node_type in TRANSFORM_TYPES or node_type in SHAPE_TYPES
        self.path = (parent.path if parent else "") + "|" + name
        self.xattrs: Dict[str, object] = {}
        self.mesh: Optional[MeshData] = MeshData() if node_type == "mesh" else None
        self.skin: Optional[SkinData] = SkinData() if node_type == "skinCluster" else None
        self.tweak: Optional[Dict[int, List[Tuple[int, List[float]]]]] = {} if node_type == "tweak" else None
        self.inputs: Dict[str, Tuple["MaNode", str]] = {}
        self.raw: Optional[Dict[str, List[str]]] = {} if node_type in RAW_TYPES else None
        self.skip_attrs = skips_attrs(node_type)       # setAttr をすべて読み飛ばす種類か
        self.span: Optional[Tuple[int, int]] = None     # 読み飛ばした属性の範囲（アニメーションを後から読むため）
        self.attr_map: Optional[Dict[str, str]] = None  # 自作ノードの割り当て: 属性名の読み替え（custom_nodes）
        self.ns = ns                                    # リファレンスから読んだノードなら、その名前の前置き（"rig:"）
        self.espan: Optional[Tuple[int, int]] = None    # リファレンスの編集で変えた属性（setAttr を並べた範囲）
        self.node_def = None                            # 自作ノードの定義（node_defs.NodeDef）で評価するとき
        self.baked: Optional[Dict[str, object]] = None  # 読み込みで求めた属性（ヒストリから求めたカーブの形 cc など）
        # ノードのブロックの外で、ノード名つきで値を入れた setAttr の範囲（属性を後から読むノード。カーブの形など）
        self.xspans: Optional[List[Tuple[int, int]]] = None
        # 親のスケールを打ち消す（自作ノードの割り当てで指定。ジョイントの segmentScaleCompensate と同じ計算を、
        # inverseScale の接続がなくても親のスケールで行う）
        self.ssc_parent = False
        self.locks: Dict[str, bool] = {}   # setAttr -l でロックした移動・回転・スケール（tx・t など → ロックするか）

    @property
    def is_shape(self) -> bool:
        if self.type in SHAPE_TYPES:
            return True
        if self.type in TRANSFORM_TYPES:
            return False
        # 型名が Shape で終わる DAG ノード（blendShape のような DG ノードはシェイプではない）
        return self.is_dag and self.type.endswith("Shape") and not self.children

    def vec3(self, name: str) -> Tuple[float, float, float]:
        v = self.xattrs.get(name)
        if v is None:
            return _VEC3_DEFAULTS.get(name, (0.0, 0.0, 0.0))
        return (v[0], v[1], v[2])

    def flag(self, name: str, default: bool) -> bool:
        v = self.xattrs.get(name)
        return default if v is None else bool(v)

    def limits(self, deg: float = 1.0) -> Optional[dict]:
        """移動・回転・スケールの制限（有効なものだけ）。{"t" | "r" | "s": [[最小 × 3], [最大 × 3]]}（無効な成分は None）。
        値はファイルの単位のまま。deg はファイルの単位での 1 度（回転の既定値 ±45 度に使う）。制限がなければ None"""
        out = {}
        for k, (mn, mx, mne, mxe) in LIMIT_ATTRS.items():
            en_lo = self.xattrs.get(mne) or (False, False, False)
            en_hi = self.xattrs.get(mxe) or (False, False, False)
            if not any(en_lo) and not any(en_hi):
                continue
            d = 45.0 * deg
            lo = self.xattrs.get(mn) or ((-d, -d, -d) if k == "r" else _VEC3_DEFAULTS[mn])
            hi = self.xattrs.get(mx) or ((d, d, d) if k == "r" else _VEC3_DEFAULTS[mx])
            lo = [-d if v != v else float(v) for v in lo]       # NaN（成分だけ書かれた残り）は既定値
            hi = [d if v != v else float(v) for v in hi]
            out[k] = [[lo[i] if en_lo[i] else None for i in range(3)], [hi[i] if en_hi[i] else None for i in range(3)]]
        return out or None

    def inverse_scale_source(self) -> Optional["MaNode"]:
        """親のスケールの打ち消し（ローカル行列の移動の直前に掛けるスケールの逆数）に使うスケールを持つノード。

        ジョイント: segmentScaleCompensate が有効で、inverseScale（.is）に接続があれば、その接続元（ふつうは親）。
        自作ノードの割り当てで打ち消しを指定したノード: 親。どちらでもなければ None
        """
        if self.type == "joint" and self.flag("ssc", True) and "is" in self.inputs:
            return self.inputs["is"][0]
        if self.ssc_parent and self.parent is not None:
            return self.parent
        return None

    def __repr__(self):
        return "<MaNode %s %s>" % (self.type, self.path)


# time1（シーンの時間）の setAttr を受け取るための目印。ノード一覧には入れない
_TIME_NODE = MaNode("time1", "time", None, -1)


class MaScene:
    def __init__(self, source_path: str = ""):
        self.source_path = source_path
        self.nodes: List[MaNode] = []
        self._by_name: Dict[str, List[MaNode]] = {}
        self.current: Optional[MaNode] = None
        self.linear_unit = "cm"
        self.angular_unit = "deg"
        self.maya_version: Optional[str] = None
        self.up_axis = "y"
        self.time_unit = "film"
        self.current_time: Optional[float] = None    # time1 の .o（保存時の現在フレーム）
        # time1（ノード一覧にない）からの接続: [(先のノード, 先の属性)]。exprespy の入力の時間（秒）を見分けるため
        self.time_inputs: List[Tuple[MaNode, str]] = []
        # defaultResolution（レンダーの解像度。select -ne :defaultResolution のあとの setAttr を受け取る）
        self.resolution = MaNode("defaultResolution", "resolution", None, -1)
        self.resolution.raw = {}
        self.text = ""                               # コメントを除いた本文（animCurve などの span はこの位置）
        self.out_index: Dict[int, int] = {}          # id(ノード) → 共通 JSON の nodes の番号（変換後に設定）
        self.graph_info = None                       # rig.GraphInfo（変換時に設定）
        self.bind_ids = set()                        # バインドポーズの情報を持つノードの id（変換時に設定）
        self.references: List[str] = []              # file -r に書かれたパス（入れ子のリファレンスも含む）
        self.ref_infos: list = []                    # references.RefInfo（読み込んだ順）
        self.load_references = True                  # False ならリファレンスを読み込まない（ノードは作らない）
        self.prefix = ""                             # 解析中のファイルのノード名の前置き（リファレンスなら "rig:"）
        self.ref_depth = 0                           # 解析中のファイルの入れ子の深さ（0 = 開いたシーン）
        self._ref_current = None                     # 解析中のリファレンス（RefInfo）
        self._ref_deferred: Dict[str, bool] = {}     # reference ノード名 → アンロードか（file -rdi の行。外側を優先）
        self._ref_files: List[str] = []              # 解析中のファイルの並び（循環の検出用）
        # 解析し終えたファイルの (前置き, reference ノード)。内側のファイルから順（編集を当てる順）
        self._ref_segments: List[Tuple[str, List["MaNode"]]] = []
        self._pieces: List[str] = []                 # 本文の断片（開いたシーン → リファレンス → 編集の属性）
        self._text_len = 0
        self._placeholders: Dict[Tuple[int, str], str] = {}  # (reference ノード, "phl[n]") → 本当のプラグ
        self._seg_refnodes: List[List["MaNode"]] = [[]]  # 解析中のファイルごとの reference ノード
        self._progress: ProgressFn = None
        self._progress_detail = False                # _progress が 3 つめの引数を受け取るか
        # 全体の進捗: 開いたファイルとリファレンスの本文の文字数の合計（見積もり）と、読み終えた文字数
        self._bytes_total = 0
        self._bytes_done = 0
        self._ref_expected: Dict[str, int] = {}      # reference ノード名 → 見積もった文字数（file -rdi の行から）
        self._ref_started = 0                        # 読み始めたリファレンスの数
        self._resolved: Dict[Tuple[str, str], Optional[str]] = {}   # (書かれたパス, 読み込む側) → 見つかったファイル
        self.plugins: List[str] = []                 # requires で読み込むプラグイン（maya 以外）
        self.plugin_versions: Dict[str, str] = {}    # プラグイン → requires に書かれた版
        self.plugin_node_types: Dict[str, str] = {}  # requires -nodeType に書かれた型 → プラグイン
        self.stats: Dict[str, int] = {}          # 文の種類ごとの数（読み込みの内訳に出す）
        # 「文の種類 ノードの種類」ごとの [秒, 文の数, 文字数]（どこに時間がかかっているかを調べる）
        self.cost: Dict[str, List[float]] = {}
        self.read_seconds = 0.0
        self.connections: List[Tuple[MaNode, str, MaNode, str]] = []   # (元, 元の属性, 先, 先の属性)
        self.warnings: List[str] = []
        self._warn_keys: Dict[str, int] = {}
        self._warn_limits: Dict[str, int] = {}

    # ------------------------------------------------------------------
    def warn(self, msg: str, key: Optional[str] = None, limit: int = 1):
        """警告を記録する。key が同じものは limit 件まで（以降は件数だけ数える）。"""
        k = key or msg
        n = self._warn_keys.get(k, 0)
        self._warn_keys[k] = n + 1
        self._warn_limits[k] = limit
        if n < limit:
            self.warnings.append(msg)

    def finalize_warnings(self):
        for k, n in self._warn_keys.items():
            extra = n - self._warn_limits.get(k, 1)          # 書かずに数えただけの件数
            if extra > 0 and k.startswith("#"):
                self.warnings.append("（同様の警告が他に %d 件: %s）" % (extra, k[1:]))

    # ------------------------------------------------------------------
    def qualify(self, ref: str) -> str:
        """解析中のファイルに書かれた名前（パス）を、シーンの名前にする（リファレンスなら名前空間を付ける）。
        ":" で始まる名前はルートの名前空間（:time1・:initialShadingGroup など）。"""
        p = self.prefix
        if not p or not ref:
            return ref
        if "|" not in ref:
            return ref[1:] if ref[0] == ":" else p + ref
        return "|".join(x if not x else (x[1:] if x[0] == ":" else p + x) for x in ref.split("|"))

    def _qualify_plug(self, plug: str) -> str:
        if not self.prefix or plug.startswith("."):
            return plug
        nname, attr = R.split_node_attr(plug)
        q = self.qualify(nname)
        return q + "." + attr if attr else q

    def resolve(self, ref: str) -> Optional[MaNode]:
        """ノード名・部分パス・フルパスからノードを引く。"""
        if not ref:
            return None
        ref = ref.lstrip(":") if not ref.startswith("|") else ref
        if "|" in ref:
            parts = [p for p in ref.split("|") if p]
            if not parts:
                return None
            cands = self._by_name.get(parts[-1], [])
            if ref.startswith("|"):
                for c in cands:
                    if c.path == ref:
                        return c
                return None
            suffix = "|" + "|".join(parts)
            for c in cands:
                if c.path.endswith(suffix):
                    return c
            return None
        cands = self._by_name.get(ref)
        if not cands:
            return None
        if len(cands) > 1:
            # .ma では曖昧な名前は通常パスで書かれる。DAG 外ノードを優先
            for c in cands:
                if c.parent is None:
                    return c
        return cands[0]

    # ------------------------------------------------------------------
    def handle(self, cmd: str, rest: str):
        if cmd == "setAttr":
            if self.current is _TIME_NODE and self._set_time_attr(rest):
                return
            if not self._wants_setattr(rest):
                return                      # 使わない属性（アニメーションのキー・カーブの形状・法線など）
            sa = R.parse_setattr(rest)
            if sa is not None:
                self._set_attr(sa)
        elif cmd == "createNode":
            self._create_node(rest)
        elif cmd == "connectAttr":
            self._connect(rest, connect=True)
        elif cmd == "disconnectAttr":
            self._connect(rest, connect=False)
        elif cmd == "select":
            self._select(rest)
        elif cmd == "currentUnit":
            opts, _ = R.parse_flags(R.tokenize(rest), ["-l", "-linear", "-a", "-angle", "-t", "-time"])
            lin = opts.get("-l") or opts.get("-linear")
            ang = opts.get("-a") or opts.get("-angle")
            tim = opts.get("-t") or opts.get("-time")
            if self.ref_depth:
                # リファレンスの単位はシーンの単位を変えない（違えば、読み終えたあとに警告する）
                if self._ref_current is not None and isinstance(lin, str):
                    self._ref_current.units = (_LINEAR_UNITS.get(lin, lin),
                                               _ANGULAR_UNITS.get(ang, ang) if isinstance(ang, str) else "deg")
                return
            if isinstance(tim, str):
                self.time_unit = tim
            if isinstance(lin, str):
                self.linear_unit = _LINEAR_UNITS.get(lin, lin)
            if isinstance(ang, str):
                self.angular_unit = _ANGULAR_UNITS.get(ang, ang)
        elif cmd == "requires":
            # requires [-nodeType 型 …] [-dataType 型 …] "プラグイン" "版";
            toks = R.tokenize(rest)
            vals, types, k = [], [], 0
            while k < len(toks):
                t = toks[k]
                if t.text.startswith("-"):
                    if t.text in ("-nodeType", "-nt", "-dataType", "-dt") and k + 1 < len(toks):
                        if t.text in ("-nodeType", "-nt"):
                            types.append(toks[k + 1].value)
                        k += 2
                        continue
                    k += 1
                    continue
                vals.append(t.value)
                k += 1
            if vals and vals[0] != "maya":
                for nt in types:
                    self.plugin_node_types.setdefault(nt, vals[0])
            if len(vals) >= 2 and vals[0] == "maya":
                if self.maya_version is None and not self.ref_depth:
                    self.maya_version = vals[1]
            elif vals and vals[0] != "maya" and vals[0] not in self.plugins:
                self.plugins.append(vals[0])
                if len(vals) >= 2:
                    self.plugin_versions[vals[0]] = vals[1]
        elif cmd == "fileInfo":
            vals = [t.value for t in R.tokenize(rest) if t.quoted]
            if len(vals) >= 2 and vals[0] == "upAxis" and not self.ref_depth:
                self.up_axis = vals[1]
        elif cmd == "file":
            self._file_command(rest)
        elif cmd == "parent":
            self.warn("parent コマンド（インスタンス等）は未対応のため無視しました。",
                      key="#parent コマンド")
        # rename / addAttr / lockNode / relationship / fileInfo 等は不要なので無視

    def _wants_setattr(self, rest: str) -> bool:
        """値を解析する前に、ノードと属性名だけを見て、使う setAttr かを判定する（大きなファイルで効く）"""
        if _NO_SKIP:
            return True
        m = _PLUG_RE.search(rest)
        if m is None:
            return True
        plug = m.group(1)
        if plug.startswith("."):
            node = self.current
            attr = plug[1:]
        else:
            nname, attr = R.split_node_attr(plug)
            node = self.resolve(self.qualify(nname))
        if node is None or node.skip_attrs:
            return False
        if node.raw is not None or node.tweak is not None:
            return True                     # マテリアル・file・dagPose など（小さいので全部読む）
        cut = len(attr)
        for ch in "[.":
            i = attr.find(ch)
            if 0 <= i < cut:
                cut = i
        base = R.ATTR_ALIASES.get(attr[:cut], attr[:cut])
        if node.mesh is not None:
            return base in _MESH_NAMES
        if node.skin is not None:
            return base in _SKIN_NAMES
        return base in _XFORM_NAMES

    def _set_time_attr(self, rest: str) -> bool:
        """select :time1 のあとの setAttr ".o"（現在のフレーム）。ノード名つきのプラグは通常どおり処理する。"""
        sa = R.parse_setattr(rest)
        if sa is None or not sa.plug.startswith("."):
            return False
        if sa.plug[1:] in ("o", "outTime"):
            vals = sa.values()
            try:
                self.current_time = R.to_float(vals[0]) if vals else None
            except ValueError:
                pass
        return True

    # ------------------------------------------------------------------
    def _create_node(self, rest: str):
        toks = R.tokenize(rest)
        opts, pos = R.parse_flags(toks, ["-n", "-name", "-p", "-parent"])
        if not pos:
            return
        node_type = pos[0].value
        name = opts.get("-n") or opts.get("-name") or (node_type + str(len(self.nodes)))
        parent_ref = opts.get("-p") or opts.get("-parent")
        shared = bool(opts.get("-s") or opts.get("-shared"))
        if shared and self.ref_depth:
            # リファレンスの中の共有ノード（persp などの起動時のカメラ・lightLinker1）は、シーンのものを使う。
            # Maya と同じく、リファレンスからは読み込まない（続く setAttr も当てない）
            self.current = None
            return
        if self.prefix:
            if isinstance(name, str):
                name = self.qualify(name)
            if isinstance(parent_ref, str):
                parent_ref = self.qualify(parent_ref)
        if shared:
            existing = self.resolve(name)
            if existing is not None:
                self.current = existing
                return
        parent = None
        if isinstance(parent_ref, str):
            parent = self.resolve(parent_ref)
            if parent is None:
                self.warn("親ノード「%s」が見つかりません（%s）" % (parent_ref, name),
                          key="#親ノード未検出")
        node = MaNode(name, node_type, parent, len(self.nodes), self.prefix if self.ref_depth else "")
        if self._ref_current is not None:
            self._ref_current.node_count += 1
        if node_type == "reference" and self._seg_refnodes:
            self._seg_refnodes[-1].append(node)
        if parent is not None:
            parent.children.append(node)
            parent.is_dag = True
        self.nodes.append(node)
        self._by_name.setdefault(name, []).append(node)
        self.current = node

    def _select(self, rest: str):
        toks = R.tokenize(rest)
        _, pos = R.parse_flags(toks, [])
        if pos and self.ref_depth:
            # リファレンスの中: シーンの時間・解像度はシーン（開いたファイル）のものを使う
            target = pos[-1].value
            self.current = None if target.lstrip(":") in ("time1", "defaultResolution") else \
                self.resolve(self.qualify(target))
        elif pos and pos[-1].value.lstrip(":") == "time1" and self.resolve(pos[-1].value) is None:
            self.current = _TIME_NODE              # select -ne :time1; setAttr ".o" 1;
        elif pos and pos[-1].value.lstrip(":") == "defaultResolution" and self.resolve(pos[-1].value) is None:
            self.current = self.resolution         # select -ne :defaultResolution; setAttr ".w" 1920;
        elif pos:
            self.current = self.resolve(pos[-1].value)
        else:
            self.current = None

    def _connect(self, rest: str, connect: bool):
        plugs = _PLUG_RE.findall(rest)
        if len(plugs) != 2 or "\\" in rest:
            # 引用符の 2 つのプラグ以外の書き方（エスケープ入りなど）は従来どおり解析する
            toks = R.tokenize(rest)
            _, pos = R.parse_flags(toks, ["-l", "-lock"])
            plugs = [t.value for t in pos]
        if len(plugs) < 2:
            return
        sn, sattr = R.split_node_attr(plugs[0])
        dn, dattr = R.split_node_attr(plugs[1])
        src = self.resolve(self.qualify(sn))
        dst = self.resolve(self.qualify(dn))
        if src is None and dst is not None and connect and self.qualify(sn).lstrip(":") == "time1":
            self.time_inputs.append((dst, R.normalize_attr(dattr)))
        if src is None or dst is None:
            return
        key = R.normalize_attr(dattr)
        skey = R.normalize_attr(sattr)
        if connect:
            dst.inputs[key] = (src, skey)
            self.connections.append((src, skey, dst, key))
        else:
            dst.inputs.pop(key, None)
            self.connections = [c for c in self.connections
                                if not (c[0] is src and c[1] == skey and c[2] is dst and c[3] == key)]

    # ------------------------------------------------------------------
    # リファレンス（references.py に形式の説明）
    def _file_command(self, rest: str):
        from .references import parse_file_command
        info = parse_file_command(rest)
        if info is None:
            return
        path = info["path"]
        if path and path not in self.references:
            self.references.append(path)
        rfn = self.qualify(info["rfn"]) if info["rfn"] else ""
        if info["kind"] == "rdi":
            # 読み込みの状態。外側のファイル（先に読む）に書かれたものを優先する
            if rfn and rfn not in self._ref_deferred:
                self._ref_deferred[rfn] = info["deferred"]
            # 全体の進捗の見積もり: 開いたファイルの file -rdi の行には、入れ子を含むすべてのリファレンスが並ぶ
            if (rfn and rfn not in self._ref_expected and self.load_references and not self._ref_deferred.get(rfn)
                    and info["type"] != "mayaBinary" and not path.lower().endswith(".mb")):
                resolved = self._resolve_ref(path)
                if resolved is not None:
                    try:
                        size = os.path.getsize(resolved)
                    except OSError:
                        size = 0
                    self._ref_expected[rfn] = size
                    self._bytes_total += size
            return
        self._load_reference(info, rfn)

    def _resolve_ref(self, path: str) -> Optional[str]:
        from .references import resolve_reference_path
        referencing = self._ref_files[-1] if self._ref_files else self.source_path
        key = (path, referencing)
        if key not in self._resolved:
            self._resolved[key] = resolve_reference_path(path, referencing, self.source_path)[0]
        return self._resolved[key]

    def _drop_estimate(self, rfn: str):
        """読み込まなかったリファレンスを、全体の進捗の見積もりから外す"""
        self._bytes_total -= self._ref_expected.pop(rfn, 0)

    def _load_reference(self, info: dict, rfn: str):
        from .references import RefInfo, default_namespace
        path = info["path"]
        if info["ns"] is None and info["rpr"]:
            local = info["rpr"] + "_"              # 古い形式（名前の前置き）
        else:
            ns = (info["ns"] if info["ns"] is not None else default_namespace(path)).strip(":")
            local = ns + ":" if ns else ""         # -ns ":" はルートの名前空間
        prefix = self.prefix + local
        ri = RefInfo(path, prefix[:-1] if prefix.endswith(":") else prefix, prefix, rfn, self.ref_depth + 1,
                     self._ref_current)
        self.ref_infos.append(ri)
        if not self.load_references:
            ri.reason = "リファレンスを読み込まない設定です"
            return
        if self._ref_deferred.get(rfn):
            ri.reason = "アンロードされています（Maya でリファレンスを読み込まない状態）"
            return
        if info["type"] == "mayaBinary" or path.lower().endswith(".mb"):
            ri.reason = "Maya バイナリ（.mb）は読み込めません"
            self._drop_estimate(rfn)
            return
        resolved = self._resolve_ref(path)
        if resolved is None:
            ri.reason = "ファイルが見つかりません"
            self._drop_estimate(rfn)
            return
        ri.resolved = resolved
        key = os.path.normcase(os.path.abspath(resolved))
        if any(os.path.normcase(os.path.abspath(f)) == key for f in self._ref_files):
            ri.reason = "自分自身を読み込むリファレンス（循環）です"
            self._drop_estimate(rfn)
            return
        if self.ref_depth >= 32:
            ri.reason = "入れ子が深すぎます"
            self._drop_estimate(rfn)
            return
        import time
        t0 = time.perf_counter()
        try:
            text = R.strip_line_comments(read_ma_text(resolved))
        except (OSError, ValueError) as exc:
            ri.reason = "読み込めません（%s）" % exc
            self._drop_estimate(rfn)
            return
        self.read_seconds += time.perf_counter() - t0
        # 見積もり（ファイルの大きさ）を本文の文字数に置き換える。file -rdi の行になかったものは、ここで足す
        self._bytes_total += len(text) - self._ref_expected.get(rfn, 0)
        self._ref_expected[rfn or ("#%d" % len(self.ref_infos))] = len(text)
        self._ref_started += 1
        base = self._text_len + 1                  # 本文の後ろにつなげる（ノードの範囲 span はつなげた本文の位置）
        self._pieces.append("\n" + text)
        self._text_len += 1 + len(text)
        saved = (self.prefix, self.ref_depth, self._ref_current, self.current)
        self.prefix, self.ref_depth, self._ref_current, self.current = prefix, self.ref_depth + 1, ri, None
        self._ref_files.append(resolved)
        self._seg_refnodes.append([])
        try:
            # 同じファイルを何度も読むことがあるので、名前空間も出す（arm_rig.ma（arm3））
            label = os.path.basename(resolved) + ("（%s）" % ri.namespace if ri.namespace else "")
            _parse_segment(self, text, base, label)
        finally:
            self._ref_segments.append((prefix, self._seg_refnodes.pop()))
            self._ref_files.pop()
            self.prefix, self.ref_depth, self._ref_current, self.current = saved
        ri.loaded = True

    def _report_parse(self, seg_frac: float, name: str):
        """解析の進捗を通知する。割合は、開いたファイルとリファレンスを合わせた全体のもの"""
        frac = min(self._bytes_done / max(self._bytes_total, 1), 1.0)
        count = len(self._ref_expected)
        if not count:
            self._progress(frac, "解析中 %d%%" % int(frac * 100))
            return
        msg = "解析中 %d%%（リファレンス %d / %d）" % (int(frac * 100), min(self._ref_started, count), count)
        if self._progress_detail:
            self._progress(frac, msg, ("%s を解析中 %d%%" % (name, int(seg_frac * 100)), seg_frac))
        else:
            self._progress(frac, "%s・%s" % (msg, name))

    def _finish_references(self):
        """リファレンスの編集（reference ノードの .ed）を、内側のファイルのものから順に当てる。
        そのあと、プレースホルダー（reference ノードの .phl[n]）につないだ接続を、本当の相手につなぎ直す。"""
        from .references import EDIT_NAMES, parse_reference_edits, reference_edits_text
        self._ref_segments.append(("", self._seg_refnodes.pop() if self._seg_refnodes else []))
        text = "".join(self._pieces)
        overlay: Dict[int, List[str]] = {}
        nodes_of: Dict[int, MaNode] = {}
        skipped: Dict[str, int] = {}
        # 読み込まなかったリファレンスの中のノード（その編集は黙って飛ばす）
        unloaded = [ri.prefix for ri in self.ref_infos if not ri.loaded and ri.prefix]
        for prefix, rnodes in self._ref_segments:
            self.prefix = prefix
            for rn in rnodes:
                body = reference_edits_text(text, rn.span) if rn.span is not None else None
                if not body:
                    continue
                edits, bad = parse_reference_edits(body)
                if bad:
                    self.warn("%s: リファレンスの編集のうち %d 件を読めませんでした。" % (rn.name, bad),
                              key="#リファレンスの編集の読み取り", limit=5)
                for code, args in edits:
                    missing = self._apply_edit(code, args, overlay, nodes_of)
                    if missing is not None and not any(p in missing for p in unloaded):
                        skipped[EDIT_NAMES[code]] = skipped.get(EDIT_NAMES[code], 0) + 1
        self.prefix = ""
        self.current = None
        if overlay:
            # 編集で変えた属性を、ノードごとの setAttr の並びとして本文の後ろに置く（範囲から属性を読む処理のため）
            chunks = ["\n"]
            pos = self._text_len + 1
            for nid, lines in overlay.items():
                body = "\n".join(lines) + "\n"
                nodes_of[nid].espan = (pos, pos + len(body))
                chunks.append(body)
                pos += len(body)
            self._pieces.append("".join(chunks))
            self._text_len = pos
        self._route_placeholders()
        for ri in self.ref_infos:
            if ri.loaded and ri.units and ri.units[0] != self.linear_unit:
                self.warn("リファレンス「%s」の作業単位（%s）がシーン（%s）と違います。値はファイルに書かれたまま使います。"
                          % (ri.namespace or ri.path, ri.units[0], self.linear_unit), key="#リファレンスの単位")
        if skipped:
            self.warn("リファレンスの編集のうち、相手のノードがないものを無視しました（%s）。"
                      % "、".join("%s %d 件" % kv for kv in sorted(skipped.items())), key="#リファレンスの編集の相手")

    def _apply_edit(self, code: int, args: List[str], overlay: Dict[int, List[str]],
                    nodes_of: Dict[int, MaNode]) -> Optional[str]:
        """リファレンスの編集を 1 件当てる。相手のノードがなければ、その名前（あれば None）"""
        if code == 2:                                      # setAttr: ノード 属性 値
            node = self.resolve(self.qualify(args[0]))
            if node is None:
                return self.qualify(args[0])
            value = args[2] if args[2][:1].isspace() else " " + args[2]
            self.current = None
            self.handle("setAttr", '"%s.%s"%s' % (args[0], args[1], value))     # 名前空間は handle で付く
            overlay.setdefault(id(node), []).append('setAttr ".%s"%s;' % (args[1], value))
            nodes_of[id(node)] = node
        elif code == 1:                                    # addAttr: ノード 長い名前 短い名前 フラグ
            node = self.resolve(self.qualify(args[0]))
            if node is None:
                return self.qualify(args[0])
            overlay.setdefault(id(node), []).append("addAttr %s;" % args[3])
            nodes_of[id(node)] = node
        elif code in (3, 4):                               # connectAttr / disconnectAttr: 元 先 フラグ
            src, dst = (self._qualify_plug(p) for p in args[:2])
            for p in (src, dst):
                if self.resolve(R.split_node_attr(p)[0]) is None:
                    return p
            prefix, self.prefix = self.prefix, ""          # 名前空間は付け終えた
            self._connect('"%s" "%s"' % (src, dst), connect=code == 3)
            self.prefix = prefix
        elif code == 0:                                    # parent: 子 親 フラグ
            child = self.resolve(self.qualify(args[0]))
            if child is None:
                return self.qualify(args[0])
            world = "-w" in args[2].split() or not args[1]
            parent = None if world else self.resolve(self.qualify(args[1]))
            if parent is None and not world:
                return self.qualify(args[1])
            self._reparent(child, parent)
        elif code == 5:                                    # プレースホルダー: reference ノード プラグ プレースホルダー
            plugs = args[1:3]
            ph = next((p for p in plugs if ".placeHolderList[" in p or ".phl[" in p), None)
            other = next((p for p in plugs if p is not ph), None)
            if ph is None or other is None:
                return ""
            pn, pattr = R.split_node_attr(self._qualify_plug(ph))
            rn = self.resolve(pn)
            if rn is None:
                return pn
            self._placeholders[(id(rn), R.normalize_attr(pattr))] = self._qualify_plug(other)
        return None

    def _reparent(self, node: MaNode, parent: Optional[MaNode]):
        if node.parent is parent or node is parent:
            return
        if node.parent is not None and node in node.parent.children:
            node.parent.children.remove(node)
        node.parent = parent
        if parent is not None:
            parent.children.append(node)
            parent.is_dag = True
        stack = [node]
        while stack:
            x = stack.pop()
            x.path = (x.parent.path if x.parent else "") + "|" + x.name
            stack.extend(x.children)

    def _route_placeholders(self):
        """reference ノードの .phl[n] につないだ接続を、リファレンスの中の本当のプラグにつなぎ直す"""
        if not self._placeholders:
            return
        real: Dict[Tuple[int, str], Tuple[MaNode, str]] = {}
        for key, plug in self._placeholders.items():
            nname, attr = R.split_node_attr(plug)
            node = self.resolve(nname)
            if node is not None and attr:
                real[key] = (node, R.normalize_attr(attr))
        if not real:
            return
        out = []
        for c in self.connections:
            src, sattr, dst, dattr = c
            s = real.get((id(src), sattr))
            d = real.get((id(dst), dattr))
            if s is None and d is None:
                out.append(c)
                continue
            src2, sattr2 = s or (src, sattr)
            dst2, dattr2 = d or (dst, dattr)
            if dst.inputs.get(dattr) == (src, sattr):
                del dst.inputs[dattr]
            dst2.inputs[dattr2] = (src2, sattr2)
            out.append((src2, sattr2, dst2, dattr2))
        self.connections = out

    # ------------------------------------------------------------------
    def _set_attr(self, sa: R.SetAttr):
        plug = sa.plug
        if plug.startswith("."):
            node = self.current
            attr = plug[1:]
        else:
            nname, attr = R.split_node_attr(plug)
            node = self.resolve(self.qualify(nname))
        if node is None or not attr:
            return
        elems = R.parse_attr_path(attr)
        if not elems:
            return
        if sa.lock is not None and len(elems) == 1 and elems[0].name in _LOCK_NAMES:
            node.locks.pop(elems[0].name, None)          # あとに書かれたものを優先する（順番を書かれた順にする）
            node.locks[elems[0].name] = sa.lock          # Maya でロックした属性（ビューアのポーズ確認でも動かさない）
        try:
            if node.mesh is not None and self._set_mesh_attr(node, elems, sa):
                return
            if node.skin is not None:
                self._set_skin_attr(node, elems, sa)
                return
            if node.tweak is not None:
                self._set_tweak_attr(node, elems, sa)
                return
            if node.raw is not None:
                node.raw[".".join(e.key() for e in elems)] = sa.values()
                return
            if len(elems) == 1:
                self._set_xform_attr(node, elems[0].name, sa)
        except (ValueError, IndexError) as exc:
            self.warn("属性値を読めませんでした: %s.%s（%s）" % (node.name, attr, exc),
                      key="#属性値の解析失敗", limit=5)

    def _set_xform_attr(self, node: MaNode, name: str, sa: R.SetAttr):
        if name in _VEC3_ATTRS:
            vals = sa.values()
            if len(vals) >= 3:
                node.xattrs[name] = R.to_floats(vals[:3])
        elif name in _COMPONENT_ATTRS:
            base, i = _COMPONENT_ATTRS[name]
            vals = sa.values()
            if vals:
                vec = node.xattrs.get(base)
                if vec is None:
                    # 回転の制限の既定値は角度の単位によるので、未定（NaN）にしておく（MaNode.limits）
                    vec = [float("nan")] * 3 if base in ("mnrl", "mxrl") else list(_VEC3_DEFAULTS.get(base, (0.0, 0.0, 0.0)))
                    node.xattrs[base] = vec
                vec[i] = R.to_float(vals[0])
        elif name in _LIMIT_ENABLES:
            base, i = _LIMIT_ENABLES[name]
            vals = sa.values()
            vec = node.xattrs.setdefault(base, [False, False, False])
            if i >= 0 and vals:
                vec[i] = R.to_bool(vals[0])
            elif i < 0:
                for j, v in enumerate(vals[:3]):
                    vec[j] = R.to_bool(v)
        elif name in _BOOL_ATTRS:
            vals = sa.values()
            if vals:
                node.xattrs[name] = R.to_bool(vals[0])
        elif name in _INT_ATTRS:
            vals = sa.values()
            if vals:
                node.xattrs[name] = int(R.to_float(vals[0]))
        elif name in _FLOAT_ATTRS:
            vals = sa.values()
            if vals:
                node.xattrs[name] = R.to_float(vals[0])
        elif name == "ovrgb":
            vals = sa.values()                 # 描画のオーバーライドの RGB 色（カーブの色に使う）
            if len(vals) >= 3:
                node.xattrs["ovrgb"] = R.to_floats(vals[:3])
        elif name in ("opm", "offsetParentMatrix"):
            mats = parse_matrices(sa)          # offsetParentMatrix（Maya 2020 以降。ローカル行列のあとに掛ける）
            if mats:
                node.xattrs["opm"] = mats[0]
        elif name == "bps" and node.type == "joint":
            mats = parse_matrices(sa)          # バインド時のワールド行列
            if mats:
                node.xattrs["bps"] = mats[0]

    @staticmethod
    def _range_start(idx) -> int:
        if idx is None:
            return 0
        if isinstance(idx, tuple):
            return idx[0]
        if isinstance(idx, int):
            return idx
        raise ValueError("範囲指定 %r は未対応" % (idx,))

    def _set_mesh_attr(self, node: MaNode, elems, sa: R.SetAttr) -> bool:
        """mesh 固有の属性なら処理して True を返す。"""
        md = node.mesh
        head = elems[0]
        name = head.name
        if len(elems) == 1:
            if name in ("vt", "pt"):
                nums = _raw_or_numbers(sa, head.index, 3)
                if nums:
                    chunk = (self._range_start(head.index), nums)
                    (md.vt if name == "vt" else md.pt).append(chunk)
                return True
            if name == "ed":
                nums = _raw_or_numbers(sa, head.index, 3, as_int=True)
                if nums:
                    md.ed.append((self._range_start(head.index), nums))
                return True
            if name == "fc":
                if numpy_enabled() and len(sa.values_text) >= _NUMPY_MIN_CHARS and '"' not in sa.values_text:
                    flat = parse_polyfaces_np(sa.values_text)       # 値の文字列から直接（トークンに分けない）
                    if flat is not None:
                        md.fc.append((self._range_start(head.index), flat, None))
                        return True
                vals = sa.values()
                if vals:
                    flat = parse_polyfaces_np(vals) if numpy_enabled() else None
                    if flat is not None:
                        md.fc.append((self._range_start(head.index), flat, None))
                    else:
                        faces, holes, uvs = parse_polyfaces(vals)
                        md.fc.append((self._range_start(head.index), faces, uvs))
                        md.holes += holes
                return True
            if name == "cuvs":
                vals = sa.values()
                if vals:
                    md.cuvs = vals[-1]
                return True
            return False
        if len(elems) == 2 and name == "uvst":
            k = head.index if isinstance(head.index, int) else 0
            sub = elems[1]
            if sub.name == "uvsp":
                nums = _raw_or_numbers(sa, sub.index, 2)
                if nums:
                    md.uvsp.setdefault(k, []).append((self._range_start(sub.index), nums))
                return True
            if sub.name == "uvsn":
                vals = sa.values()
                if vals:
                    md.uvsn[k] = vals[-1]
                return True
            return True
        if name == "iog" and elems[-1].name == "gcl":
            og = [e for e in elems if e.name == "og"]
            if og and isinstance(og[0].index, int):
                md.groups[og[0].index] = parse_component_list(sa.values(), "f")
            return True
        if len(elems) == 2 and name == "pt" and isinstance(head.index, int):
            comp = {"px": 0, "py": 1, "pz": 2, "pntx": 0, "pnty": 1, "pntz": 2}.get(elems[1].name)
            vals = sa.values()
            if comp is not None and vals:
                v = [0.0, 0.0, 0.0]
                v[comp] = R.to_float(vals[0])
                md.pt.append((head.index, v))
            return True
        return False

    def _set_skin_attr(self, node: MaNode, elems, sa: R.SetAttr):
        sk = node.skin
        head = elems[0]
        name = head.name
        if name == "wl":
            if len(elems) < 2 or elems[1].name != "w":
                return
            if not sa.values_text.strip():
                return
            vspec = head.index
            wspec = elems[1].index
            if wspec is None:
                # 疎形式: 頂点ごとに「個数 (番号 値)×個数」
                if isinstance(vspec, int):
                    a, b = vspec, vspec
                elif isinstance(vspec, tuple):
                    a, b = vspec
                else:
                    return
                if numpy_enabled() and '"' not in sa.values_text:
                    # 値の文字列のまま保持し、変換時にすべての文をつなげて一度に数値化する（extract_ma の _skin_arrays_np）
                    sk.sparse.append((a, b, sa.values_text))
                else:
                    _sparse_into(sk.weights, a, b, sa.values())
            else:
                if not isinstance(vspec, int):
                    return
                vals = sa.values()
                # 範囲の行（sk.sparse）は保持したまま、1 頂点ずつの書き方だけを辞書に入れる
                # （sk.weights を参照すると範囲の行がすべて辞書に展開され、速い経路が使えなくなる）
                d = sk._weights.setdefault(vspec, {})
                if isinstance(wspec, int):
                    d[wspec] = float(vals[0])
                elif isinstance(wspec, tuple):
                    for k, j in enumerate(range(wspec[0], wspec[1] + 1)):
                        if k < len(vals):
                            d[j] = float(vals[k])
        elif name == "pm":
            mats = parse_matrices(sa)
            start = self._range_start(head.index)
            for k, m in enumerate(mats):
                sk.pm[start + k] = m
        elif name == "gm":
            mats = parse_matrices(sa)
            if mats:
                sk.gm = mats[0]
        elif name in ("skm", "mi", "nw", "wd") and len(elems) == 1:
            vals = sa.values()
            if vals:
                setattr(sk, name, int(R.to_float(vals[0])))

    def _set_tweak_attr(self, node: MaNode, elems, sa: R.SetAttr):
        if len(elems) == 2 and elems[0].name == "vl" and elems[1].name == "vt":
            gi = elems[0].index if isinstance(elems[0].index, int) else 0
            vals = sa.values()
            if vals:
                node.tweak.setdefault(gi, []).append((self._range_start(elems[1].index), R.to_floats(vals)))


# ---------------------------------------------------------------------------

def parse_polyfaces(toks: List[str]) -> Tuple[List[List[int]], int, Dict[int, list]]:
    """polyFaces 形式を解析する。

    f N e1..eN       : 面（辺番号。負値 -k-1 は辺 k の逆向き）
    mu uvSet N i1..iN: 直前の面の UV 番号（UV セットごと）
    h N e1..eN       : 穴（未対応。件数のみ数え、続く mu も読み捨てる）
    mc colorSet N .. / fc N .. : 読み飛ばす

    戻り値: (面ごとの辺番号, 穴の数, {UVセット番号: [面ごとの UV 番号リスト or None]})
    """
    faces: List[List[int]] = []
    add_face = faces.append
    uvs: Dict[int, list] = {}
    holes = 0
    in_hole = False
    i = 0
    n = len(toks)
    while i < n:
        t = toks[i]
        if t == "f":
            j = i + 2 + int(toks[i + 1])
            add_face(list(map(int, toks[i + 2:j])))
            in_hole = False
            i = j
        elif t == "mu":
            j = i + 3 + int(toks[i + 2])
            if not in_hole and faces:
                s = int(toks[i + 1])
                lst = uvs.get(s)
                if lst is None:
                    lst = uvs[s] = []
                nf = len(faces)
                if len(lst) < nf - 1:
                    lst.extend([None] * (nf - 1 - len(lst)))
                if len(lst) == nf - 1:
                    lst.append(list(map(int, toks[i + 3:j])))
            i = j
        elif t == "h":
            holes += 1
            in_hole = True
            i += 2 + int(toks[i + 1])
        elif t == "mc":
            i += 3 + int(toks[i + 2])
        elif t == "fc":
            i += 2 + int(toks[i + 1])
        else:
            raise ValueError("polyFaces の未知の記号 '%s'" % t)
    for lst in uvs.values():
        while len(lst) < len(faces):
            lst.append(None)
    return faces, holes, uvs


class FlatFaces:
    """polyFaces を平らな配列のまま持つ（numpy の経路）。

    counts: 面ごとの頂点数、edges: 辺番号を連結したもの、
    uv: {UV セット番号: (面ごとの UV 数（なければ -1）, UV 番号を連結したもの, 面ごとの開始位置)}
    """
    __slots__ = ("counts", "edges", "uv")

    def __len__(self):
        return len(self.counts)

    def uv_coverage(self, k: int) -> int:
        u = self.uv.get(k)
        return int((u[0] >= 0).sum()) if u else 0

    def to_lists(self):
        """従来の形（面ごとの辺番号のリスト, {UV セット: [面ごとの UV 番号 or None]}）に戻す"""
        e = self.edges.tolist()
        faces, off = [], 0
        for n in self.counts.tolist():
            faces.append(e[off:off + n])
            off += n
        uvs = {}
        for k, (cnt, flat, offs) in self.uv.items():
            f, o = flat.tolist(), offs.tolist()
            uvs[k] = [None if n < 0 else f[o[i]:o[i] + n] for i, n in enumerate(cnt.tolist())]
        return faces, uvs


# polyFaces の記号 f・mu・mc・fc の目印（辺番号とは重ならない大きな負の数）
_MARK_F, _MARK_MU, _MARK_MC, _MARK_FCOL = -(1 << 60), -(1 << 60) - 1, -(1 << 60) - 2, -(1 << 60) - 3
# 速い経路を使えた数・従来の処理に戻った理由（読み込みの内訳に出す）
FAST: Dict[str, int] = {}


def fast_numbers(toks, dtype=None):
    """空白区切りの数値（トークンのリスト、または文字列そのもの）を、numpy の文字列解析で一度に数値化する
    （1 つずつ変換するより数倍速い）。解析できない記号があれば None（従来の処理に任せる）。"""
    import warnings
    text = toks if isinstance(toks, str) else " ".join(toks)
    with warnings.catch_warnings():
        # 途中で解析できない文字があると、numpy は警告を出してそこまでの結果を返すので、例外にして検出する
        warnings.simplefilter("error")
        try:
            arr = np.fromstring(text, dtype=dtype or np.float64, sep=" ")
        except (ValueError, DeprecationWarning):
            return None
    if not isinstance(toks, str) and len(arr) != len(toks):
        return None
    return arr


_NUMPY_MIN_CHARS = 2048     # これより短い文は従来の処理のほうが速い（numpy を呼ぶ準備の負荷のため）


class RawNumbers:
    """数値に変換する前の値の文字列と、その要素数（.vt[0:165] なら 166 × 3）。
    組み立てるときに、同じ属性の断片をつなげて numpy で一度に数値化する（extract_ma の _materialize）。"""
    __slots__ = ("text", "count", "as_int")

    def __init__(self, text: str, count: int, as_int: bool):
        self.text = text
        self.count = count
        self.as_int = as_int

    def __len__(self):
        return self.count


def _raw_or_numbers(sa, index, stride: int, as_int: bool = False):
    """numpy の経路なら RawNumbers（範囲から要素数が分かるとき）、そうでなければ数値のリスト"""
    if numpy_enabled() and '"' not in sa.values_text:
        if isinstance(index, tuple):
            return RawNumbers(sa.values_text, (index[1] - index[0] + 1) * stride, as_int)
        if isinstance(index, int):
            return RawNumbers(sa.values_text, stride, as_int)
    return _numbers(sa, as_int)


def _numbers(sa, as_int: bool = False):
    """setAttr の値を数値のリストにする（大きな文は numpy で値の文字列から一度に。小さな文は 1 つずつ）"""
    if numpy_enabled() and len(sa.values_text) >= _NUMPY_MIN_CHARS and '"' not in sa.values_text:
        arr = fast_numbers(sa.values_text, np.int64 if as_int else np.float64)
        if arr is not None:
            return arr.tolist()
    vals = sa.values()
    return [int(v) for v in vals] if as_int else R.to_floats(vals)


def _ranges(starts, lengths):
    """[starts[i], starts[i] + lengths[i]) を連結した位置"""
    total = int(lengths.sum())
    if not total:
        return np.zeros(0, dtype=np.int64)
    rel = np.arange(total, dtype=np.int64) - np.repeat(np.cumsum(lengths) - lengths, lengths)
    return np.repeat(starts, lengths) + rel


def parse_polyfaces_np(toks) -> Optional[FlatFaces]:
    """polyFaces を numpy でまとめて解析する（toks はトークンのリストか値の文字列）。
    頂点カラー（mc）・面の色（fc）の記述は読み飛ばす。穴（h）を含むなど、想定と違う並びなら None を返し、
    従来の parse_polyfaces に任せる。"""
    if not toks:
        return None
    import warnings
    if isinstance(toks, str):
        # 値の文字列そのもの。改行・タブを空白にそろえてから記号を目印の数値に置き換える
        text = " " + toks.replace("\n", " ").replace("\t", " ").replace("\r", " ") + " "
    else:
        text = " " + " ".join(toks) + " "
    if " h " in text:
        FAST["面: 従来の処理（穴付きの面）"] = FAST.get("面: 従来の処理（穴付きの面）", 0) + 1
        return None
    for word, mark in ((" f ", _MARK_F), (" mu ", _MARK_MU), (" mc ", _MARK_MC), (" fc ", _MARK_FCOL)):
        if word in text:
            text = text.replace(word, " %d " % mark)
    with warnings.catch_warnings():
        warnings.simplefilter("error")
        try:
            nums = np.fromstring(text, dtype=np.int64, sep=" ")
        except (ValueError, DeprecationWarning):
            FAST["面: 従来の処理（数値以外の記述）"] = FAST.get("面: 従来の処理（数値以外の記述）", 0) + 1
            return None
    if not isinstance(toks, str) and len(nums) != len(toks):
        return None
    is_f = nums == _MARK_F
    is_mu = nums == _MARK_MU
    fidx = np.flatnonzero(is_f)
    if not len(fidx) or fidx[0] != 0:
        return None
    fcount = nums[fidx + 1]
    muidx = np.flatnonzero(is_mu)
    mcnt = nums[muidx + 2] if len(muidx) else np.zeros(0, dtype=np.int64)
    mcidx = np.flatnonzero(nums == _MARK_MC)                 # 頂点カラー: mc セット 個数 番号…（読み飛ばす）
    fcidx = np.flatnonzero(nums == _MARK_FCOL)               # 面の色: fc 個数 番号…（読み飛ばす）
    ccnt = nums[mcidx + 2] if len(mcidx) else np.zeros(0, dtype=np.int64)
    fccnt = nums[fcidx + 1] if len(fcidx) else np.zeros(0, dtype=np.int64)
    # 並びの確認: すべての要素が、面・UV・カラーのどれかの塊に含まれていること（個数は要素の数で比べる）
    total = int((fcount + 2).sum() + (mcnt + 3).sum() + (ccnt + 3).sum() + (fccnt + 2).sum())
    if (total != len(nums) or (fcount < 0).any() or (mcnt < 0).any() or (ccnt < 0).any()
            or (fccnt < 0).any()):
        FAST["面: 従来の処理（並びが想定外）"] = FAST.get("面: 従来の処理（並びが想定外）", 0) + 1
        return None
    FAST["面: 速い経路"] = FAST.get("面: 速い経路", 0) + 1
    ff = FlatFaces()
    ff.counts = fcount
    ff.edges = nums[_ranges(fidx + 2, fcount)]
    ff.uv = {}
    if len(muidx):
        sets = nums[muidx + 1]
        owner = np.searchsorted(fidx, muidx) - 1         # 直前の面
        for k in np.unique(sets):
            sel = sets == k
            own, cnt, st = owner[sel], mcnt[sel], muidx[sel] + 3
            first = np.ones(len(own), dtype=bool)          # 同じ面に 2 回あれば最初のものを使う
            first[1:] = own[1:] != own[:-1]
            own, cnt, st = own[first], cnt[first], st[first]
            per = np.full(len(fidx), -1, dtype=np.int64)
            per[own] = cnt
            offs = np.zeros(len(fidx), dtype=np.int64)
            offs[own] = np.cumsum(cnt) - cnt
            ff.uv[int(k)] = (per, nums[_ranges(st, cnt)], offs)
    return ff


_COMP_RE = re.compile(r"^(\w+)\[(\*|\d+)(?::(\d+))?\]$")


def parse_component_list(toks: List[str], kind: str) -> List[Tuple[int, int]]:
    """componentList（例: 2 "f[0:5]" "f[7]"）→ [(開始, 終了)]。"f[*]" は (0, -1)。"""
    out: List[Tuple[int, int]] = []
    for t in toks:
        m = _COMP_RE.match(t)
        if not m or m.group(1) != kind:
            continue
        if m.group(2) == "*":
            out.append((0, -1))
        else:
            a = int(m.group(2))
            out.append((a, int(m.group(3)) if m.group(3) else a))
    return out


def parse_matrices(sa: R.SetAttr) -> List[List[float]]:
    from . import mathutil as M
    vals = sa.values()
    if not vals:
        return []
    if vals[0] == "xform":
        return [M.xform_data_to_matrix(R.to_floats([v for v in vals[1:] if v not in ("yes", "no")]))]
    nums = R.to_floats(vals)
    return [nums[i:i + 16] for i in range(0, len(nums) - 15, 16)]


# ---------------------------------------------------------------------------

_CODESET_RE = re.compile(rb"//Codeset:\s*(\S+)")
_CODESET_MAP = {"932": "cp932", "936": "gbk", "949": "cp949", "950": "cp950",
                "1252": "cp1252", "UTF-8": "utf-8", "utf-8": "utf-8", "65001": "utf-8"}


def read_ma_text(path: str) -> str:
    with open(path, "rb") as f:
        data = f.read()
    if data[:4] in (b"FOR4", b"FOR8"):
        raise ValueError("Maya バイナリ (.mb) は読み込めません。Maya で .ma として保存し直してください。")
    enc = None
    m = _CODESET_RE.search(data[:4096])
    if m:
        enc = _CODESET_MAP.get(m.group(1).decode("ascii", "ignore"))
    for e in ([enc] if enc else []) + ["utf-8", "cp932"]:
        try:
            return data.decode(e)
        except (UnicodeDecodeError, LookupError):
            continue
    return data.decode("latin-1")


_BLOCK_END_RE = re.compile(r"\n(?=[^\t \n])")
# 後から中身を読むために、属性の範囲（span）を覚えておくノード（アニメーションカーブ・再生範囲を持つ script・カーブの形）
# camera: 独自の属性（ロールなど）がリグの入力になることがあるため、範囲を覚えて後から読む
_SPAN_TYPES = ("animCurveTL", "animCurveTA", "animCurveTU", "script", "displayLayer", "nurbsCurve", "camera")
_NO_SKIP = os.environ.get("MA_VIEWER_NO_SKIP") == "1"


def _span_for_unknown(n: MaNode) -> bool:
    """そのほかの（大きなデータを持たない）ノードも範囲を覚える（自作ノードの独自の属性を後から読むため）"""
    return (n.mesh is None and n.skin is None and n.tweak is None and n.raw is None and n.type not in SHAPE_TYPES
            and not n.type.startswith("poly") and n.type not in ("groupId", "groupParts"))


def parse_ma_text(text: str, source_path: str = "", progress: ProgressFn = None,
                  load_references: bool = True) -> MaScene:
    """.ma の文を順に処理する。

    文の区切り（;）は str.find で探し、文字列の中の ; だけ引用符を数えてつなぎ直す。
    setAttr を使わない種類のノード（アニメーションカーブ・カーブの形状・ユーティリティなど）は、
    createNode のあとに字下げされて続く行（そのノードの setAttr など）を、1 文ずつ処理せずにまとめて読み飛ばす。

    リファレンス（file -r）は、その文のところで読み込み、ノード名に名前空間を付けて同じシーンに入れる。
    リファレンスの本文は、このファイルの本文の後ろにつなげる（scene.text。ノードの範囲 span はその位置）。
    load_references=False なら、リファレンスは読み込まない（MA_VIEWER_NO_REFERENCES=1 でも同じ）。
    """
    scene = MaScene(source_path)
    scene.load_references = load_references and os.environ.get("MA_VIEWER_NO_REFERENCES") != "1"
    text = R.strip_line_comments(text)
    scene._pieces = [text]
    scene._text_len = len(text)
    scene._ref_files = [source_path] if source_path else []
    scene._progress = progress
    scene._progress_detail = progress_accepts_detail(progress)
    scene._bytes_total = len(text)
    _parse_segment(scene, text, 0, os.path.basename(source_path) if source_path else "シーン")
    scene._finish_references()
    scene.text = text if len(scene._pieces) == 1 else "".join(scene._pieces)
    scene._pieces = []
    if progress is not None:
        progress(1.0, "解析完了")
    return scene


def _parse_segment(scene: MaScene, text: str, base: int, name: str) -> None:
    """1 つのファイルの本文の文を順に処理する。base: つなげた本文（scene.text）での、この本文の開始位置。
    name: 進捗に出すファイル名"""
    n = len(text)
    progress = scene._progress
    counted = 0                                       # 全体の進捗に足した文字数
    total = max(n, 1)
    next_report = 0.0
    find = text.find
    statement_end = R.statement_end
    split_command = R.split_command
    counts = scene.stats
    cost = scene.cost
    import time
    clock = time.perf_counter
    pos = 0
    while pos < n:
        end = statement_end(text, pos, find(";", pos))    # 文字列の中の ; は飛ばす
        stmt = text[pos:end]
        start = pos
        pos = end + 1
        cmd, rest = split_command(stmt)
        if cmd is None:
            continue
        counts[cmd] = counts.get(cmd, 0) + 1
        t_stmt = clock()
        if cmd == "setAttr":
            _remember_named_setattr(scene, rest, base + start, base + end + 1)
        scene.handle(cmd, rest)
        cur = scene.current
        key = cmd if cmd != "setAttr" else "setAttr " + (cur.type if cur is not None else "?")
        c = cost.get(key)
        if c is None:
            c = cost[key] = [0.0, 0, 0]
        if cmd != "file":                  # file -r の時間（リファレンスの解析）は、その中の文の時間として数える
            c[0] += clock() - t_stmt
        c[1] += 1
        c[2] += len(stmt)
        if cmd == "createNode" and scene.current is not None and (
                scene.current.skip_attrs or scene.current.type in _SPAN_TYPES or scene.current.type in TRANSFORM_TYPES
                or _span_for_unknown(scene.current)):
            m = _BLOCK_END_RE.search(text, pos)
            skip_to = m.start() + 1 if m else n
            # 範囲を覚えておく（アニメーションカーブ・リグの計算ノード・コントローラーの独自の属性を後から読むため）
            scene.current.span = (base + pos, base + skip_to)
            if skip_to > pos and scene.current.skip_attrs:
                counts["読み飛ばし"] = counts.get("読み飛ばし", 0) + text.count(";", pos, skip_to)
                pos = skip_to
        if progress is not None and pos / total >= next_report:
            at = min(pos, n)
            scene._bytes_done += at - counted
            counted = at
            scene._report_parse(at / total, name)
            next_report += 0.02
    scene._bytes_done += n - counted


def _remember_named_setattr(scene: "MaScene", rest: str, a: int, b: int):
    """ノードのブロックの外の、ノード名つきの setAttr（setAttr "curveShapeOrig.cc" …）。属性を後から読むノード
    （カーブの形など、読み込みでは値を読み飛ばすノード）なら、その範囲を覚えておく"""
    m = _PLUG_RE.search(rest)
    if m is None or m.group(1).startswith("."):
        return
    nname, _attr = R.split_node_attr(m.group(1))
    node = scene.resolve(scene.qualify(nname))
    if node is None or node.span is None or not node.skip_attrs:
        return
    if node.xspans is None:
        node.xspans = []
    node.xspans.append((a, b))


def parse_ma_file(path: str, progress: ProgressFn = None, load_references: bool = True) -> MaScene:
    if progress:
        progress(0.0, "読み込み中: %s" % os.path.basename(path))
    import time
    t0 = time.perf_counter()
    text = read_ma_text(path)
    read_seconds = time.perf_counter() - t0
    scene = parse_ma_text(text, path, progress, load_references=load_references)
    scene.read_seconds += read_seconds          # リファレンスを読んだ時間も含む
    return scene
