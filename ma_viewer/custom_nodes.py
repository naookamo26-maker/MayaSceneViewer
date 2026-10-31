# -*- coding: utf-8 -*-
"""自作ノード（プラグイン）の割り当て: 型を知らないノードを、同じ計算をする標準ノードとして扱う。

自作ノードの中の計算は .ma に書かれていないため、利用者が設定ファイルで「どの標準ノードと同じか」を教える。

設定ファイル（JSON。後のものが優先）:
  1. ~/.ma_viewer/nodes.json
  2. 環境変数 MA_VIEWER_NODES のパス
  3. .ma と同じフォルダの ma_viewer_nodes.json

書き方:
  {
    "myMatrixBlend": {"as": "multMatrix", "attrs": {"inMatrix": "i[0]", "outMatrix": "o"}},
    "myCtrlTransform": {"as": "transform"},
    "myCompXform": {"as": "transform", "segmentScaleCompensate": true},
    "myBone": {"as": "joint"}
  }
  * "as": 扱う標準ノードの型（multMatrix・inverseMatrix・decomposeMatrix・composeMatrix・transform・joint など、
    ビューアが評価できる型）。型を知らない DAG ノードは、指定がなければ transform として扱う
  * "segmentScaleCompensate": transform・joint として扱うノードで、親のスケールを打ち消すか（ジョイントの
    segmentScaleCompensate と同じ計算。親のスケールの逆数を、ローカル行列の移動の直前に掛ける）。
    inverseScale の接続がなくても、親のスケールを使う。"joint" の既定は true、"transform" の既定は false
  * "attrs": 自作ノードの属性名 → 標準ノードの属性名（短い名前）。"i" のように添字なしで書くと元の添字を引き継ぎ
    （inMatrix[2] → i[2]）、"i[0]" のように添字つきで書くとその属性にする
"""
from __future__ import annotations

import json
import os
import re
from typing import Dict, List, Optional

from . import ma_reader as R

FILE_NAME = "ma_viewer_nodes.json"
_ATTR_RE = re.compile(r"^(\w+)(\[\d+\])?(.*)$")


def config_paths(ma_path: Optional[str]) -> List[str]:
    paths = [os.path.join(os.path.expanduser("~"), ".ma_viewer", "nodes.json")]
    env = os.environ.get("MA_VIEWER_NODES")
    if env:
        paths.append(env)
    if ma_path:
        paths.append(os.path.join(os.path.dirname(os.path.abspath(ma_path)), FILE_NAME))
    return paths


def load_node_map(ma_path: Optional[str], warn=None) -> Dict[str, dict]:
    """設定ファイルを読んで、型 → {"as", "attrs"} を返す（読めないファイルは warn で知らせて飛ばす）"""
    out: Dict[str, dict] = {}
    for p in config_paths(ma_path):
        if not os.path.isfile(p):
            continue
        try:
            with open(p, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, ValueError) as exc:
            if warn:
                warn("自作ノードの設定 %s を読めませんでした（%s）" % (p, exc))
            continue
        if not isinstance(data, dict):
            continue
        for t, spec in data.items():
            if isinstance(spec, str):
                spec = {"as": spec}
            if isinstance(spec, dict) and isinstance(spec.get("as"), str) and not t.startswith("_"):
                out[t] = dict(normalize_spec(spec), **{"from": p})
    return out


def normalize_spec(spec) -> dict:
    """割り当て 1 つを {"as", "attrs", "ssc"} にそろえる（"segmentScaleCompensate" の既定は joint だけ true）"""
    if isinstance(spec, str):
        spec = {"as": spec}
    ssc = spec.get("ssc", spec.get("segmentScaleCompensate", spec["as"] == "joint"))
    return {"as": spec["as"], "attrs": dict(spec.get("attrs") or {}), "ssc": bool(ssc),
            **({"from": spec["from"]} if "from" in spec else {})}


def rename_attr(attr: str, amap: Dict[str, str]) -> str:
    m = _ATTR_RE.match(attr)
    if not m or m.group(1) not in amap:
        return attr
    target = amap[m.group(1)]
    if "[" in target:
        return target + m.group(3)
    return target + (m.group(2) or "") + m.group(3)


def apply_node_map(ms, mapping: Dict[str, dict]) -> Dict[str, List[str]]:
    """割り当てのある型のノードを、標準ノードとして扱うように書き換える。戻り値: 型 → ノード名の一覧"""
    from .ma_scene import TRANSFORM_TYPES
    if not mapping:
        return {}
    applied: Dict[str, List[str]] = {}
    mapped = {}
    mapping = {t: normalize_spec(v) for t, v in mapping.items()}
    for n in ms.nodes:
        spec = mapping.get(n.type)
        if spec is None:
            continue
        applied.setdefault(n.type, []).append(n.name)
        # 属性名は .ma の読み込みと同じく短い名前にそろえる（input と ip のどちらで書いてもよい）
        amap = {R.normalize_attr(k).split("[")[0] or k: v for k, v in spec["attrs"].items()}
        amap.update(spec["attrs"])
        mapped[id(n)] = amap
        n.attr_map = amap or None
        n.type = spec["as"]
        if spec["as"] in TRANSFORM_TYPES:
            n.is_dag = True
            n.ssc_parent = bool(spec.get("ssc"))         # 親のスケールを打ち消す（segmentScaleCompensate）
    if not mapped:
        return applied
    conns = []
    for src, sattr, dst, dattr in ms.connections:
        if id(src) in mapped:
            sattr = rename_attr(sattr, mapped[id(src)])
        if id(dst) in mapped:
            dattr = rename_attr(dattr, mapped[id(dst)])
        conns.append((src, sattr, dst, dattr))
    ms.connections = conns
    for n in ms.nodes:
        if not n.inputs:
            continue
        new = {}
        for key, (src, sattr) in n.inputs.items():
            if id(src) in mapped:
                sattr = rename_attr(sattr, mapped[id(src)])
            if id(n) in mapped:
                key = rename_attr(key, mapped[id(n)])
            new[key] = (src, sattr)
        n.inputs = new
    return applied


# Maya の標準のノードの型のうち、ビューアが評価しないことのあるもの（自作ノードの割り当ての雛形を出さない）。
# ビューアが評価する型（rig の SUPPORTED_DG など）も標準の型として扱う
_STANDARD_TYPES = frozenset("""
    follicle hairSystem nucleus nRigid nCloth nParticle particle pfxHair hairConstraint dynamicConstraint
    blendShape nonLinear deformBend deformTwist deformSquash deformFlare deformSine deformWave deltaMush tension
    ffd lattice baseLattice wrap shrinkWrap proximityWrap sculpt softMod softModHandle jiggle textureDeformer
    solidify morph cluster clusterHandle jointCluster skinCluster wire tweak groupParts groupId transformGeometry
    uvPin proximityPin pointOnSurfaceInfo closestPointOnSurface closestPointOnMesh nearestPointOnCurve
    pointOnCurveInfo curveInfo motionPath tangentConstraint normalConstraint geometryConstraint
    pointOnPolyConstraint rigidConstraint symmetryConstraint ikSpringSolver ikSplineSolver ikRPsolver ikSCsolver
    ikMCsolver ikPASolver hikSolver ikHandle ikEffector angleBetween arcLengthDimension distanceDimShape
    distanceBetween curveFromMeshEdge curveFromSurfaceIso curveFromSurfaceUV curveFromMeshCoM loft extrude revolve
    rebuildSurface rebuildCurve nurbsTessellate planarTrimSurface offsetCurve extendCurve attachCurve detachCurve
    fitBspline makeTextCurves makeNurbCircle makeNurbSphere makeNurbPlane makeNurbCylinder reverseCurve subCurve
    nurbsCurve nurbsSurface mesh locator camera joint transform remapColor remapHsv rgbToHsv hsvToRgb luminance
    contrast gammaCorrect samplerInfo particleSamplerInfo ramp file place2dTexture place3dTexture projection
    layeredTexture noise checker setRange remapValue clamp condition reverse multiplyDivide plusMinusAverage
    blendColors blendWeighted blendTwoAttr pairBlend choice chooser frameCache timeToUnitConversion
    unitToTimeConversion unitConversion mute character characterOffset clipLibrary clipScheduler animClip
    dagPose objectSet partition shadingEngine materialInfo lambert blinn phong phongE anisotropic surfaceShader
    standardSurface openPBRSurface usdPreviewSurface displayLayer renderLayer animLayer reference expression
    script time multMatrix decomposeMatrix composeMatrix inverseMatrix fourByFourMatrix wtAddMatrix addMatrix
    holdMatrix blendMatrix aimMatrix pickMatrix parentMatrix vectorProduct quatToEuler eulerToQuat quatProd
    quatInvert quatNormalize quatSlerp quatAdd quatConjugate quatNegate quatSub addDoubleLinear multDoubleLinear
    pointMatrixMult pointConstraint orientConstraint parentConstraint scaleConstraint aimConstraint
    poleVectorConstraint lookAt uvChooser bump2d network container deleteComponent
""".split())
_STANDARD_PREFIXES = ("poly", "animCurve", "animBlendNode", "HIK", "hik", "deform")
# Maya に付属するプラグイン（requires -nodeType に型が書かれていても、自作ノードではない）
BUNDLED_PLUGINS = {"mayaHIK", "matrixNodes", "quatNodes", "lookdevKit"}


def is_standard_type(ms, type_name: str) -> bool:
    """Maya の標準のノードの型か（requires -nodeType でプラグインの型と書かれていれば標準ではない。
    ただし mayaHIK など Maya に付属するプラグインの型は標準）。一覧にない型は自作ノードとみなす（割り当ての雛形を出す）"""
    plugin = (getattr(ms, "plugin_node_types", None) or {}).get(type_name)
    if plugin is not None and plugin not in BUNDLED_PLUGINS:
        return False
    if type_name in _STANDARD_TYPES or type_name.startswith(_STANDARD_PREFIXES):
        return True
    from .rig import SUPPORTED_DG                       # ビューアが評価する型（新しい計算ノードなども）
    return type_name in SUPPORTED_DG


def template_for(ms, type_name: str) -> dict:
    """設定ファイルの雛形（つながっている属性の名前を入れる）"""
    ins, outs = set(), set()
    for src, sattr, dst, dattr in ms.connections:
        if dst.type == type_name:
            ins.add(_ATTR_RE.match(dattr).group(1) if _ATTR_RE.match(dattr) else dattr)
        if src.type == type_name:
            outs.add(_ATTR_RE.match(sattr).group(1) if _ATTR_RE.match(sattr) else sattr)
    return {"as": "（同じ計算をする標準ノードの型。例: multMatrix）",
            "attrs": {**{a: "（入力）" for a in sorted(ins)}, **{a: "（出力）" for a in sorted(outs)}}}
