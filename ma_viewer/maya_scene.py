# -*- coding: utf-8 -*-
"""Maya で開いているシーン → MaScene（.ma を解析したものと同じ形）。

.ma を開いたときと同じ変換（extract_ma.load_staged）に渡すので、アニメーション・リグ・カーブ・マテリアル・
警告などの扱いはスタンドアロンと同じになる。一時ファイルは作らない。

  * ノード・属性・接続: Maya が .ma に書くのと同じ文（addAttr は MFnAttribute.getAddAttrCmd、setAttr は MPlug.getSetAttrCmds）を
    メモリの上で組み立て、.ma の解析器に通す。
    リファレンスは、Maya が読み込んだノード（名前空間つき）をそのまま出す（.mb のリファレンスも Maya が読む）
  * メッシュの形・UV とスキンウェイト（.ma の大部分を占めるデータ）: 文にせず、API から numpy の配列で直接入れる。
    ヒストリから作られるメッシュも、Maya が評価した形になる（.ma では形がファイルにない）

collect()（Maya の API。画面のスレッドで呼ぶ）→ SceneText.build()（Python だけ。読み込みのスレッドで呼べる）。
"""
from __future__ import annotations

import os
import re
import time
from typing import Dict, List, Optional, Tuple

import numpy as np

from .ma_scene import FlatFaces, MaScene, ProgressFn, parse_ma_text
from .references import RefInfo

try:
    import maya.api.OpenMaya as om
    from maya import cmds
except ImportError:          # Maya の外（テスト）。SceneText だけを使う
    om = cmds = None


class MeshArrays:
    """メッシュ 1 つの形（Maya の API から読んだもの）"""
    __slots__ = ("points", "counts", "connects", "edges", "smooth", "uv_sets", "current_uv")

    def __init__(self, points, counts, connects, edges, smooth, uv_sets=(), current_uv=None):
        self.points = np.asarray(points, dtype=np.float64).reshape(-1, 3)     # 頂点（オブジェクト空間）
        self.counts = np.asarray(counts, dtype=np.int64)                     # 面ごとの頂点の数
        self.connects = np.asarray(connects, dtype=np.int64)                 # 面の頂点の番号（面の順につなげたもの）
        self.edges = np.asarray(edges, dtype=np.int64).reshape(-1, 2)        # 辺の両端の頂点
        self.smooth = np.asarray(smooth, dtype=bool)                         # 辺がスムーズか（偽ならハードエッジ）
        # [(uvSet の論理番号, 名前, UV 座標 (n, 2), 面ごとの UV の数, UV の番号)]
        self.uv_sets = list(uv_sets)
        self.current_uv = current_uv


def mesh_data(md, m: MeshArrays) -> None:
    """MeshArrays を MeshData（.ma の vt・ed・fc・uvst を解析したものと同じ形。numpy の経路）に入れる"""
    md.vt = [(0, m.points.ravel())]
    md.pt = []
    md.ed = [(0, np.column_stack([m.edges, m.smooth]).astype(np.float64).ravel())]
    # 面の頂点の並び → 辺の番号（.ma の polyFaces と同じ。辺の向きが逆なら -番号-1）
    counts, conn = m.counts, m.connects
    starts = np.cumsum(counts) - counts
    nxt = np.arange(len(conn)) + 1
    ends = starts + counts                                    # 面の最後の頂点の次は、面の最初の頂点
    nxt[ends[counts > 0] - 1] = starts[counts > 0]
    a, b = conn, conn[nxt] if len(conn) else conn
    nv = max(int(m.points.shape[0]), int(conn.max()) + 1 if len(conn) else 0, 1)
    ek = np.minimum(m.edges[:, 0], m.edges[:, 1]) * nv + np.maximum(m.edges[:, 0], m.edges[:, 1])
    order = np.argsort(ek, kind="stable")
    key = np.minimum(a, b) * nv + np.maximum(a, b)
    pos = np.clip(np.searchsorted(ek[order], key), 0, max(len(order) - 1, 0))
    if len(order):
        e = order[pos]
        found = ek[e] == key
        signed = np.where(m.edges[e, 0] == a, e, -e - 1)
        signed = np.where(found, signed, len(ek))             # 辺が見つからない角は範囲外の番号（不正な面として除く）
    else:
        signed = np.full(len(conn), 0, dtype=np.int64)
    ff = FlatFaces()
    ff.counts, ff.edges, ff.uv = counts, signed.astype(np.int64), {}
    md.uvsp, md.uvsn = {}, {}
    for k, name, uv, uv_counts, uv_ids in m.uv_sets:
        uv_counts = np.asarray(uv_counts, dtype=np.int64)
        md.uvsp[k] = [(0, np.asarray(uv, dtype=np.float64).ravel())]
        md.uvsn[k] = name
        ff.uv[k] = (np.where(uv_counts == counts, counts, -1), np.asarray(uv_ids, dtype=np.int64),
                    np.cumsum(uv_counts) - uv_counts)
    md.cuvs = m.current_uv
    md.fc = [(0, ff, {})]
    md.holes = 0


_SETATTR_PLUG = re.compile(r'^(setAttr\b[^"]*")([^".][^"]*?)(\.[^"]*")')


def _relative_plug(row: str) -> str:
    """setAttr "pCube1.t" … → setAttr ".t" …（ブロックの中の文は、いまのノードの属性）"""
    return _SETATTR_PLUG.sub(r"\1\3", row, count=1)


class SceneText:
    """.ma の文（メモリの上）と、文にしないメッシュの形・ウェイト。build() で MaScene にする"""

    def __init__(self, source_path: str = ""):
        self.source_path = source_path
        self.lines: List[str] = []
        self.meshes: Dict[str, MeshArrays] = {}     # ノード（.ma に書く名前）→ 形
        self.skins: Dict[str, tuple] = {}           # skinCluster → (頂点, インフルエンスの論理番号, 値)
        self.namespaces: Dict[str, str] = {}        # リファレンスから読んだノード → 名前の前置き（"rig:"）
        self.ref_infos: List[RefInfo] = []
        self.warnings: List[str] = []               # 集めるときの警告（MaScene の警告に入れる）
        self.view_camera: Optional[str] = None      # 作業中のビューのカメラ
        self.project_root: Optional[str] = None     # いまのプロジェクト（テクスチャを探す）
        # 集めるのにかかった時間（collect。画面が止まる時間）: {"total", "fast", "parts": {部分: [秒, 回数]},
        # "types": {ノードの型: [秒, 数]}}。ログの「Maya からの収集の内訳」に出す（timing_lines）
        self.timing: Optional[dict] = None

    def node(self, node_type: str, name: str, parent: Optional[str], setattrs) -> None:
        self.lines.append('createNode %s -n "%s"%s;' % (node_type, name, ' -p "%s"' % parent if parent else ""))
        self._attrs(setattrs)

    def select(self, name: str, setattrs) -> None:
        """既定のノード（time1・defaultResolution）の値（.ma と同じ select -ne）"""
        self.lines.append("select -ne :%s;" % name)
        self._attrs(setattrs)

    def _attrs(self, setattrs) -> None:
        """ノードのブロックの文。setattrs の 1 つは 1 つの属性の文（複数の文・複数の行のこともある。文の区切りは ;）。
        .ma と同じく字下げする（字下げのない行でブロックが終わるので、複数行の文も行ごとに）。
        属性はノードの名前を付けない形（setAttr ".cc"）にそろえる（あとから属性を読む処理はこの形を探す）"""
        for c in setattrs:
            rows = [r.strip() for r in c.splitlines() if r.strip()]
            rows = [_relative_plug(r) if r.startswith("setAttr") else r for r in rows]
            if rows and not rows[-1].endswith(";"):
                rows[-1] += ";"
            self.lines += ["\t" + r for r in rows]

    def connect(self, src: str, dst: str) -> None:
        self.lines.append('connectAttr "%s" "%s";' % (src, dst))

    def build(self, progress: ProgressFn = None) -> MaScene:
        text = "\n".join(self.lines) + "\n"
        self.lines = []                             # 文はつなげたものだけを持つ（メモリを 2 重に使わない）
        ms = parse_ma_text(text, self.source_path, progress, load_references=False)
        ms.source_kind = "maya"
        ms.view_camera_name = self.view_camera or ""
        ms.ref_infos = self.ref_infos
        for w in self.warnings:
            ms.warn(w)
        ms.project_root = self.project_root
        for name, m in self.meshes.items():
            n = ms.resolve(name)
            if n is not None and n.mesh is not None:
                mesh_data(n.mesh, m)
        for name, w in self.skins.items():
            n = ms.resolve(name)
            if n is not None and n.skin is not None:
                n.skin.arrays = w
        for name, ns in self.namespaces.items():
            n = ms.resolve(name)
            if n is not None:
                n.ns = ns
        return ms


# ---------------------------------------------------------------------------
# Maya の API で集める（Maya 内でのみ動作する）
# ---------------------------------------------------------------------------

# 文にしない属性（API から直接入れる形・ウェイトと、ビューアが使わない大きなデータ）
_SKIP_ATTRS = {
    "mesh": {"vt", "ed", "fc", "uvst", "pt", "n", "clst"},
    "skinCluster": {"wl"},
    "blendShape": {"it"},                 # ターゲットの形（ビューアは blendShape を評価しない）
}
# 形の入力（ヒストリ・デフォーマ）があるときに書かない、形の値。.ma と同じく、形は入力から求める
# （書くと、いま評価された形が固定の形として読まれ、リグで動かなくなる）
_INPUT_SHAPE = {"nurbsCurve": ("cr", "cc")}


def skip_attrs(node_type: str, shape_input: bool) -> set:
    """文にしない属性。shape_input: 形の入力（_INPUT_SHAPE の入力の属性）に接続があるか"""
    out = set(_SKIP_ATTRS.get(node_type, ()))
    if shape_input and node_type in _INPUT_SHAPE:
        out.add(_INPUT_SHAPE[node_type][1])
    return out
# 既定のノードのうち、.ma と同じく select -ne で値を書くもの（ほかの既定のノードは .ma の解析でも作られない）
_DEFAULT_NODES = ("defaultResolution",)
# 書かないノード: 画面の構成（作業中のビューのカメラは SceneText.view_camera に入れる）と、再生範囲（いまの値を書く）
_SKIP_NODES = {"uiConfigurationScriptNode", "sceneConfigurationScriptNode"}


def _geometry_types():
    return {om.MFnData.kMesh, om.MFnData.kNurbsSurface, om.MFnData.kSubdSurface, om.MFnData.kLattice}


def _setattr_cmds(obj, fn, skip) -> List[str]:
    """ノードのブロックの文（Maya が .ma に書くもの）: 独自の属性の addAttr（getAddAttrCmd。複合の属性の子も）と、
    値が既定と違う属性の setAttr（複合・配列の属性は子と要素もまとめて）。.ma と同じく addAttr を先に書く。
    addAttr は、独自の属性の種類（角度など）と既定値（-dv。既定値のままの属性は setAttr を書かない）に要る。
    接続の先の属性の値も、.ma と同じく書く（評価の出発点・評価できないときの値に使う）"""
    adds: List[str] = []
    out: List[str] = []
    geometry = _geometry_types()
    for i in range(fn.attributeCount()):
        a = fn.attribute(i)
        fa = om.MFnAttribute(a)
        if fa.dynamic:
            try:
                adds.append(fa.getAddAttrCmd(False))
            except RuntimeError:
                pass
        if not fa.parent.isNull() or not fa.storable or fa.shortName in skip:
            continue
        if a.hasFn(om.MFn.kTypedAttribute) and om.MFnTypedAttribute(a).attrType() in geometry:
            continue
        plug = om.MPlug(obj, a)
        try:
            # 長い値の文は複数の行に分けて返る（カーブの形・長い文字列など。; は最後の行だけ）。1 つの属性の行はつなげる
            rows = plug.getSetAttrCmds(om.MPlug.kNonDefault, False)
        except RuntimeError:
            continue
        if len(rows):
            out.append("\n".join(rows))
    return adds + out


# 速い経路（Maya で確かめるまで既定ではオフ。MA_VIEWER_MAYA_FAST=1 か collect(fast=True) で使う）。
# 1 要素ずつの API の呼び出しを、まとめて取る呼び出しにする。結果が今の経路と同じかと速さは
# tools/maya_collect_compare.py で確かめる。取れない・数が合わないときは今の経路に戻す
FAST_ENV = "MA_VIEWER_MAYA_FAST"


def fast_enabled() -> bool:
    return os.environ.get(FAST_ENV) == "1"


def _points_slow(pts) -> list:
    return [(p.x, p.y, p.z) for p in pts]


def _points_fast(pts) -> np.ndarray:
    """MPointArray → (n, 3)。MPoint は (x, y, z, w) の並びなので、numpy でまとめて変換して w を落とす"""
    a = np.array(pts, dtype=np.float64)
    return a.reshape(-1, 4)[:, :3] if a.size else np.zeros((0, 3))


def _edges_slow(fn, ne: int):
    edges = np.empty((ne, 2), dtype=np.int64)
    smooth = np.empty(ne, dtype=bool)
    for e in range(ne):
        edges[e] = fn.getEdgeVertices(e)
        smooth[e] = fn.isEdgeSmooth(e)
    return edges, smooth


def _edges_fast(name: str, ne: int):
    """辺の両端とスムーズか（.ma の .ed と同じ値: 頂点 2 つと、スムーズなら 1）を、1 回の getAttr で読む。
    読めない・数が合わないときは None（今の経路に戻す）"""
    if ne == 0:
        return np.empty((0, 2), dtype=np.int64), np.empty(0, dtype=bool)
    try:
        rows = cmds.getAttr("%s.ed[0:%d]" % (name, ne - 1))
    except (RuntimeError, ValueError, TypeError):
        return None
    try:
        arr = np.asarray(rows, dtype=np.float64).reshape(-1, 3)
    except (ValueError, TypeError):
        return None
    if arr.shape[0] != ne:
        return None
    return arr[:, :2].astype(np.int64), arr[:, 2] != 0


def _mesh_arrays(obj, fast: bool = False, timing=None) -> MeshArrays:
    fn = om.MFnMesh(obj)
    pts = fn.getPoints(om.MSpace.kObject)
    counts, connects = fn.getVertices()
    ne = fn.numEdges
    got = _edges_fast(om.MFnDagNode(obj).fullPathName(), ne) if fast else None
    if got is None and fast and timing is not None:
        timing.count("速い経路を使えなかった辺")
    edges, smooth = got if got is not None else _edges_slow(fn, ne)
    logical = {}                                         # UV セットの名前 → uvSet の論理番号（uvChooser などが使う）
    uvst = fn.findPlug("uvSet", False)
    name_attr = fn.attribute("uvSetName")
    for i in range(uvst.numElements()):
        e = uvst.elementByPhysicalIndex(i)
        logical[e.child(name_attr).asString()] = e.logicalIndex()
    uv_sets = []
    for k, name in enumerate(fn.getUVSetNames()):
        us, vs = fn.getUVs(name)
        uv_counts, uv_ids = fn.getAssignedUVs(name)
        uv_sets.append((logical.get(name, k), name, np.column_stack([np.array(us), np.array(vs)]),
                        np.array(uv_counts), np.array(uv_ids)))
    try:
        current = fn.currentUVSetName()
    except RuntimeError:
        current = None
    return MeshArrays(_points_fast(pts) if fast else _points_slow(pts), np.array(counts), np.array(connects), edges,
                      smooth, uv_sets, current)


def _skin_weights_fast(obj):
    """skinCluster のウェイトを MFnSkinCluster.getWeights でまとめて取る（速い経路）→ (頂点, インフルエンスの論理番号, 値)。
    値が 0 の要素は入れない。並びは今の経路と同じ（頂点、インフルエンスの論理番号の順）。
    変形するメッシュが 1 つでないとき・取れないときは None（今の経路に戻す）"""
    import maya.api.OpenMayaAnim as oma
    try:
        sk = oma.MFnSkinCluster(obj)
        if sk.numOutputConnections() != 1:
            return None
        path = sk.getPathAtIndex(sk.indexForOutputConnection(0))
        if not path.hasFn(om.MFn.kMesh):
            return None
        nv = om.MFnMesh(path).numVertices
        comp = om.MFnSingleIndexedComponent()
        cobj = comp.create(om.MFn.kMeshVertComponent)
        comp.setCompleteData(nv)
        weights, count = sk.getWeights(path, cobj)
        infl = sk.influenceObjects()
        logical = np.array([sk.indexForInfluenceObject(infl[k]) for k in range(len(infl))], dtype=np.int64)
    except (RuntimeError, ValueError, TypeError):
        return None
    w = np.asarray(weights, dtype=np.float64)
    if count != len(logical) or w.size != nv * count:
        return None
    return weights_from_dense(w.reshape(nv, count), logical)


def weights_from_dense(w: np.ndarray, logical: np.ndarray) -> tuple:
    """(頂点 × インフルエンス) の表と、インフルエンスの論理番号 → (頂点, 論理番号, 値)。0 は入れない。
    並びは頂点の順、同じ頂点では論理番号の順（weightList を物理番号の順に読むのと同じ）"""
    v, k = np.nonzero(w)
    lo = logical[k] if len(logical) else k.astype(np.int64)
    order = np.lexsort((lo, v))
    return v[order].astype(np.int64), lo[order].astype(np.int64), w[v, k][order].astype(np.float64)


def _skin_weights(fn) -> tuple:
    """skinCluster の weightList（.ma の wl と同じ値）→ (頂点, インフルエンスの論理番号, 値)"""
    wl = fn.findPlug("weightList", False)
    w_attr = fn.attribute("weights")
    V: List[int] = []
    L: List[int] = []
    W: List[float] = []
    for i in range(wl.numElements()):
        e = wl.elementByPhysicalIndex(i)
        v = e.logicalIndex()
        wp = e.child(w_attr)
        for j in range(wp.numElements()):
            we = wp.elementByPhysicalIndex(j)
            V.append(v)
            L.append(we.logicalIndex())
            W.append(we.asDouble())
    return np.array(V, dtype=np.int64), np.array(L, dtype=np.int64), np.array(W, dtype=np.float64)


def _plug_name(plug) -> str:
    return plug.partialName(includeNodeName=False, includeNonMandatoryIndices=False, includeInstancedIndices=False,
                            useAlias=False, useFullAttributePath=False, useLongNames=False)


def _selection_closure() -> set:
    """選択したノードとその子孫、それらの上流（ヒストリ・コンストレイント・キーなど）とシェーディング、その祖先（.ma の名前）"""
    sel = cmds.ls(selection=True, long=True, objectsOnly=True) or []
    if not sel:
        raise RuntimeError("何も選択されていません。メッシュかジョイント（またはその親）を選択してください。")
    roots = list(sel) + (cmds.listRelatives(sel, allDescendents=True, fullPath=True) or [])
    keep = set(cmds.ls(roots, long=True) or [])
    keep.update(cmds.ls(cmds.listHistory(roots) or [], long=True) or [])
    sgs = cmds.listConnections(roots, type="shadingEngine") or []
    if sgs:
        keep.update(cmds.ls(sgs + (cmds.listHistory(sgs) or []), long=True) or [])
    for p in list(keep):
        while "|" in p.lstrip("|"):
            p = p.rsplit("|", 1)[0]
            keep.add(p)
    return keep


def _nodes(selection_only: bool):
    """書き出すノード: [(MObject, .ma に書く名前, 親のパス)]。DAG は親から順（MItDag）、そのあと DG ノード。
    既定のノードは .ma と同じく除く。canBeWritten() は使わない（.ma に書かれるノードにも偽のものがある。IK のソルバーなど）"""
    keep = _selection_closure() if selection_only else None
    out = []
    it = om.MItDag(om.MItDag.kDepthFirst)
    while not it.isDone():
        path = it.getPath()
        if path.length() == 0:                     # ワールド
            it.next()
            continue
        fn = om.MFnDagNode(path)
        full = path.fullPathName()
        if path.instanceNumber() > 0 or fn.isDefaultNode:
            it.prune()                             # インスタンスの 2 つめ以降（.ma の解析でも使わない）・既定のノード
        elif keep is None or full in keep:
            parent = full.rsplit("|", 1)[0]
            out.append((it.currentItem(), full, full.rsplit("|", 1)[1], parent or None))
        it.next()
    it = om.MItDependencyNodes()
    while not it.isDone():
        obj = it.thisNode()
        it.next()
        if obj.hasFn(om.MFn.kDagNode):
            continue
        fn = om.MFnDependencyNode(obj)
        name = fn.name()
        if (fn.isDefaultNode or fn.typeName == "reference" or name in _SKIP_NODES
                or (keep is not None and name not in keep)):
            continue
        out.append((obj, name, name, None))
    return out


def _ref_query(rfn: str, default, **flags):
    """referenceQuery。問い合わせられない reference ノード（名前空間のないもの・ファイルのないものなど）は default"""
    try:
        return cmds.referenceQuery(rfn, **flags)
    except RuntimeError:
        return default


def _references() -> List[RefInfo]:
    """読み込んだリファレンス（.ma の file -r と同じ情報。ノードは Maya が読み込んだものを使う）"""
    infos: List[Tuple[RefInfo, Optional[str]]] = []
    by_rfn: Dict[str, RefInfo] = {}
    for rfn in cmds.ls(type="reference") or []:
        path = _ref_query(rfn, None, filename=True, unresolvedName=True, withoutCopyNumber=True)
        if not path:                               # sharedReferenceNode など、ファイルのない reference ノード
            continue
        loaded = bool(_ref_query(rfn, False, isLoaded=True))
        nodes = (_ref_query(rfn, None, nodes=True) or []) if loaded else []
        ns = _ref_query(rfn, None, namespace=True)
        if ns is None:                             # 名前空間を問い合わせられなければ、ノードの名前から
            ns = next((n.rpartition(":")[0] for n in nodes if ":" in n), "")
        ns = ns.lstrip(":")
        ri = RefInfo(path, ns, ns + ":" if ns else "", rfn, 1, None)
        ri.resolved = _ref_query(rfn, None, filename=True, withoutCopyNumber=True)
        ri.loaded = loaded
        ri.node_count = len(nodes)
        if not loaded:
            ri.reason = "Maya でアンロードされています"
        by_rfn[rfn] = ri
        infos.append((ri, _ref_query(rfn, None, referenceNode=True, parent=True)))
    for ri, parent_rfn in infos:
        ri.parent = by_rfn.get(parent_rfn)
    for ri, _p in infos:                           # 入れ子の深さ（1 = いちばん外側）
        p = ri.parent
        while p is not None:
            ri.depth += 1
            p = p.parent
    return [ri for ri, _p in infos]


def _view_camera() -> str:
    """Maya で作業中のビュー（モデルパネル）のカメラ（ビューがない（バッチ）なら空）"""
    try:
        panel = cmds.getPanel(withFocus=True)
        if not panel or cmds.getPanel(typeOf=panel) != "modelPanel":
            panel = cmds.playblast(activeEditor=True)
        cam = cmds.modelEditor(panel, query=True, camera=True) or ""
        return (cmds.ls(cam, long=True) or [cam])[0].lstrip("|")
    except Exception:  # noqa: BLE001
        return ""


def _header(st: SceneText) -> None:
    """.ma の先頭の文（requires・currentUnit・fileInfo）と、現在のフレーム・再生範囲"""
    st.lines.append('requires maya "%s";' % cmds.about(version=True))
    # pluginsInUse は名前と版を交互に並べた一覧（読み込まれているプラグインの名前だけを使う）
    for name in cmds.pluginInfo(query=True, pluginsInUse=True) or []:
        try:
            if not cmds.pluginInfo(name, query=True, loaded=True):
                continue
            types = cmds.pluginInfo(name, query=True, dependNode=True) or []
            version = cmds.pluginInfo(name, query=True, version=True) or ""
        except RuntimeError:
            continue
        st.lines.append("requires %s\"%s\" \"%s\";" % ("".join('-nodeType "%s" ' % t for t in types), name, version))
    st.lines.append("currentUnit -l %s -a %s -t %s;" % (cmds.currentUnit(query=True, linear=True),
                                                       cmds.currentUnit(query=True, angle=True),
                                                       cmds.currentUnit(query=True, time=True)))
    st.lines.append('fileInfo "upAxis" "%s";' % cmds.upAxis(query=True, axis=True))
    q = lambda **kw: cmds.playbackOptions(query=True, **kw)  # noqa: E731
    st.node("script", "sceneConfigurationScriptNode", None, [
        'setAttr ".b" -type "string" "playbackOptions -min %s -max %s -ast %s -aet %s "'
        % (q(minTime=True), q(maxTime=True), q(animationStartTime=True), q(animationEndTime=True)),
        'setAttr ".st" 6'])
    st.select("time1", ['setAttr ".o" %s' % cmds.currentTime(query=True)])


class CollectTiming:
    """collect の部分ごと・ノードの型ごとの時間（秒）と回数"""

    def __init__(self, fast: bool):
        self.start = time.perf_counter()
        self.fast = fast
        self.parts: Dict[str, List[float]] = {}
        self.types: Dict[str, List[float]] = {}

    def add(self, part: str, seconds: float, node_type: Optional[str] = None) -> None:
        p = self.parts.setdefault(part, [0.0, 0])
        p[0] += seconds
        p[1] += 1
        if node_type is not None:
            t = self.types.setdefault(node_type, [0.0, 0])
            t[0] += seconds
            t[1] += 1

    def count(self, part: str) -> None:
        self.parts.setdefault(part, [0.0, 0])[1] += 1

    def result(self) -> dict:
        return {"total": time.perf_counter() - self.start, "fast": self.fast,
                "parts": {k: list(v) for k, v in self.parts.items()},
                "types": {k: list(v) for k, v in self.types.items()}}


# timing_lines に出す部分の順
_PARTS = ("ノードの一覧", "setAttr の文", "メッシュの形", "スキンウェイト", "接続", "リファレンス・ビュー")


def timing_lines(timing: Optional[dict], top: int = 6) -> List[str]:
    """collect の時間をログの行にする（なければ空）"""
    if not timing:
        return []
    parts = timing.get("parts", {})
    shown = [k for k in _PARTS if k in parts] + sorted(k for k in parts if k not in _PARTS)
    items = []
    for k in shown:
        sec, n = parts[k]
        items.append("%s %d 回" % (k, n) if k.startswith("速い経路を使えなかった") else "%s %.2f 秒（%s）" % (
            k, sec, "{:,}".format(int(n))))
    lines = ["Maya からの収集の内訳: 合計 %.2f 秒（画面が止まる時間。%s）・%s" % (
        timing.get("total", 0.0), "速い経路" if timing.get("fast") else "今の経路", "・".join(items))]
    types = sorted(timing.get("types", {}).items(), key=lambda kv: -kv[1][0])[:top]
    if types:
        lines.append("setAttr の文の型ごと（上位 %d）: %s" % (len(types), "・".join(
            "%s %.2f 秒（%s 個）" % (t, sec, "{:,}".format(int(n))) for t, (sec, n) in types)))
    return lines


def collect(selection_only: bool = False, progress: ProgressFn = None, fast: Optional[bool] = None) -> SceneText:
    """Maya で開いているシーン（または選択範囲）を集める。Maya の API を使うので、画面のスレッドで呼ぶ。
    fast: 速い経路を使うか（省略時は環境変数 MA_VIEWER_MAYA_FAST=1 のときだけ）。かかった時間は st.timing"""
    fast = fast_enabled() if fast is None else bool(fast)
    tm = CollectTiming(fast)
    clock = time.perf_counter
    st = SceneText(cmds.file(query=True, sceneName=True) or "")
    _header(st)
    t0 = clock()
    nodes = _nodes(selection_only)
    tm.add("ノードの一覧", clock() - t0)
    ident: Dict[int, str] = {}
    total = max(len(nodes), 1)
    for i, (obj, key, name, parent) in enumerate(nodes):
        if progress and i % 200 == 0:
            progress(i / total, "Maya からシーンを取得中: %s" % name)
        fn = om.MFnDependencyNode(obj)
        t = fn.typeName
        t0 = clock()
        shape_input = t in _INPUT_SHAPE and fn.findPlug(_INPUT_SHAPE[t][0], False).isDestination
        st.node(t, name, parent, _setattr_cmds(obj, fn, skip_attrs(t, shape_input)))
        tm.add("setAttr の文", clock() - t0, t)
        ident[om.MObjectHandle(obj).hashCode()] = key
        if fn.isFromReferencedFile and ":" in name:
            st.namespaces[key] = name.rsplit("|", 1)[-1].rpartition(":")[0] + ":"
        if t == "mesh":
            t0 = clock()
            st.meshes[key] = _mesh_arrays(obj, fast, tm)
            tm.add("メッシュの形", clock() - t0)
        elif t == "skinCluster":
            t0 = clock()
            w = _skin_weights_fast(obj) if fast else None
            if w is None and fast:
                tm.count("速い経路を使えなかったスキンウェイト")
            st.skins[key] = w if w is not None else _skin_weights(fn)
            tm.add("スキンウェイト", clock() - t0)
    t0 = clock()
    for name in _DEFAULT_NODES:
        obj = om.MSelectionList().add(name).getDependNode(0)
        st.select(name, _setattr_cmds(obj, om.MFnDependencyNode(obj), ()))
    tm.add("setAttr の文", clock() - t0)
    if progress:
        progress(1.0, "Maya からつながりを取得中")
    t0 = clock()
    for obj, key, _name, _parent in nodes:
        for plug in om.MFnDependencyNode(obj).getConnections():
            if not plug.isDestination:
                continue
            # source() は unitConversion を飛ばして元の属性を返すので、.ma と同じく unitConversion を経由する接続にする
            # （飛ばすと単位の換算が抜ける: 角度と数値の間の接続など）
            src = plug.sourceWithConversion()
            if src.isNull:
                continue
            sobj = src.node()
            skey = ident.get(om.MObjectHandle(sobj).hashCode())
            if skey is None and om.MFnDependencyNode(sobj).name() == "time1":
                skey = "time1"                       # 時間の入力（.ma の解析と同じく、time1 のノードは作らない）
            if skey is not None:
                st.connect(skey + "." + _plug_name(src), key + "." + _plug_name(plug))
    tm.add("接続", clock() - t0)
    t0 = clock()
    try:
        st.ref_infos = _references()
    except Exception as exc:  # noqa: BLE001  リファレンスの一覧は補助の情報。取れなくてもシーンは読む
        st.warnings.append("リファレンスの一覧を取得できませんでした（%s）。ノードはそのまま表示します。" % exc)
    st.view_camera = _view_camera()
    try:
        st.project_root = (cmds.workspace(query=True, rootDirectory=True) or "").rstrip("/\\") or None
    except RuntimeError:
        pass
    tm.add("リファレンス・ビュー", clock() - t0)
    st.timing = tm.result()
    return st


def load_staged(st: SceneText, progress: ProgressFn = None):
    """集めたシーンを、.ma と同じ 2 段階の読み込みにかける。(共通 JSON, アニメーションを読む関数)"""
    from .extract_ma import load_staged as staged
    return staged(st.build, progress)
