# -*- coding: utf-8 -*-
"""Maya の現在のシーン → 共通 JSON（maya-scene-lite）。Maya 内でのみ動作する。

.ma パーサとの違い:
  * Maya が評価した結果をそのまま使うので、ヒストリが残っていても形状を取得できる
  * スキン付きメッシュは skinCluster の入力ジオメトリ（スキン適用前の形状）を使う
    → skinCluster より前段のデフォーマ（blendShape 等）の効果は形状に含まれる
  * 行列・頂点は Maya 内部単位（cm）。表示用の attrs は UI 単位の値
"""
from __future__ import annotations

import math
import os
from typing import Dict, List, Optional, Tuple

import maya.api.OpenMaya as om
import maya.api.OpenMayaAnim as oma
from maya import cmds

from . import schema
from .materials import (ALPHA_OUTPUTS, OPACITY_ATTRS, OUTPUT_CHANNEL, SCALAR_ATTRS, TextureResolver, albedo_attrs,
                        default_color, map_attrs, texture_entry, texture_warnings, to_udim_pattern)
from .mathutil import ROTATE_ORDERS, identity, inverse_or_identity, mul

WEIGHT_EPS = 1e-7

try:  # Maya 2022 以降には numpy が同梱されている
    import numpy as _np
except ImportError:  # pragma: no cover
    _np = None


# ---------------------------------------------------------------------------
# API の小さなヘルパー
# ---------------------------------------------------------------------------

def _sel(name: str):
    s = om.MSelectionList()
    s.add(name)
    return s


def _dag(name: str):
    return _sel(name).getDagPath(0)


def _mobject(name: str):
    return _sel(name).getDependNode(0)


def _matrix_from_plug(fn_dep, attr: str, logical: Optional[int] = None) -> List[float]:
    plug = fn_dep.findPlug(attr, False)
    if logical is not None:
        plug = plug.elementByLogicalIndex(logical)
    try:
        return list(om.MFnMatrixData(plug.asMObject()).matrix())
    except RuntimeError:
        return identity()


def _find_skin(shape: str) -> Tuple[Optional[str], Optional[object], int]:
    """メッシュを出力先に持つ skinCluster を探す。(名前, MFnSkinCluster, ジオメトリ番号)"""
    hist = cmds.listHistory(shape, pruneDagObjects=True) or []
    shape_obj = _mobject(shape)
    for sc in cmds.ls(hist, type="skinCluster") or []:
        fn = oma.MFnSkinCluster(_mobject(sc))
        try:
            idx = fn.indexForOutputShape(shape_obj)
        except RuntimeError:
            continue
        return sc, fn, idx
    return None, None, 0


def _skin_input_mesh(fn_skin, geo_index: int):
    """skinCluster の input[geo_index].inputGeometry（スキン適用前の形状）を MFnMesh で返す。"""
    plug = fn_skin.findPlug("input", False).elementByLogicalIndex(geo_index)
    geo_plug = plug.child(fn_skin.attribute("inputGeometry"))
    return om.MFnMesh(geo_plug.asMObject())


def _mesh_arrays(fn_mesh) -> Tuple[List[float], List[int], List[int]]:
    pts = fn_mesh.getPoints(om.MSpace.kObject)
    positions: List[float] = []
    ext = positions.extend
    for p in pts:
        ext((round(p.x, 6), round(p.y, 6), round(p.z, 6)))
    counts, connects = fn_mesh.getVertices()
    return positions, list(counts), list(connects)


def _uv_data(fn_mesh, counts: List[int], uv_set: Optional[str] = None) -> Optional[dict]:
    """UV（共通 JSON の uv）。uv_set がなければ現在の UV セット。"""
    try:
        names = list(fn_mesh.getUVSetNames())
        if not names:
            return None
        if uv_set not in names:
            try:
                uv_set = fn_mesh.currentUVSetName()
            except (RuntimeError, TypeError):
                uv_set = None
            if uv_set not in names:
                uv_set = names[0]
        us, vs = fn_mesh.getUVs(uv_set)
        if len(us) == 0:
            return None
        uv_counts, uv_ids = fn_mesh.getAssignedUVs(uv_set)
    except RuntimeError:
        return None
    values: List[float] = []
    for u, v in zip(us, vs):
        values += (round(u, 6), round(v, 6))
    uv_ids = list(uv_ids)
    indices: List[int] = []
    p = 0
    for f, n in enumerate(counts):
        c = uv_counts[f] if f < len(uv_counts) else 0
        indices.extend(uv_ids[p:p + c] if c == n else [-1] * n)
        p += c
    return {"set": uv_set, "values": values, "indices": indices}


def _hard_edges(fn_mesh) -> List[int]:
    """スムーズでない辺（ハードエッジ）を頂点の組で返す"""
    out: List[int] = []
    try:
        for e in range(fn_mesh.numEdges):
            if not fn_mesh.isEdgeSmooth(e):
                a, b = fn_mesh.getEdgeVertices(e)
                out += (int(a), int(b))
    except RuntimeError:
        return []
    return out


def _opacity_plug(plug: str) -> bool:
    """'shader.opacityR' や 'shader.transparency' が不透明度・透明度の属性か"""
    attr = plug.split(".", 1)[1].split("[")[0] if "." in plug else plug
    return attr in OPACITY_ATTRS or (attr[-1:] in "RGB" and attr[:-1] in OPACITY_ATTRS)


def _sparse_weights(flat, n_verts: int, n_inf: int) -> Tuple[List[int], List[int], List[float]]:
    """getWeights の密な配列（頂点 × インフルエンス）→ 疎配列。"""
    if n_verts == 0 or n_inf == 0:
        return [0] * n_verts, [], []
    if _np is not None:
        arr = _np.asarray(list(flat), dtype=_np.float64).reshape(n_verts, n_inf)
        rows, cols = _np.nonzero(arr > WEIGHT_EPS)
        counts = _np.bincount(rows, minlength=n_verts).tolist()
        return counts, cols.tolist(), _np.round(arr[rows, cols], 6).tolist()
    w = list(flat)
    counts: List[int] = []
    idx: List[int] = []
    vals: List[float] = []
    for v in range(n_verts):
        base = v * n_inf
        c = 0
        for k in range(n_inf):
            x = w[base + k]
            if x > WEIGHT_EPS:
                idx.append(k)
                vals.append(round(x, 6))
                c += 1
        counts.append(c)
    return counts, idx, vals


# ---------------------------------------------------------------------------

class _Extractor:
    def __init__(self, progress=None):
        self.nodes: List[dict] = []
        self.index_of: Dict[str, int] = {}
        self.meshes: List[dict] = []
        self.cameras: List[dict] = []
        self.warnings: List[str] = []
        self.progress = progress
        self.bind_pm: Dict[str, List[float]] = {}    # パス → バインド時のワールド行列（.pm の逆行列）
        self.bind_bps: Dict[str, List[float]] = {}   # パス → ジョイントの bindPose 属性
        self.materials: List[dict] = []
        self.textures: List[dict] = []
        self._mat_of: Dict[str, int] = {}
        self._tex_of: Dict[str, int] = {}
        self._file_of_mat: Dict[int, str] = {}
        scene_path = cmds.file(query=True, sceneName=True) or ""
        try:
            project = cmds.workspace(query=True, rootDirectory=True) or None
        except RuntimeError:
            project = None
        self.resolver = TextureResolver(scene_path, project_root=project.rstrip("/\\") if project else None)
        ang = cmds.currentUnit(query=True, angle=True)
        self.to_deg = 180.0 / math.pi if ang in ("rad", "radian") else 1.0

    def warn(self, msg: str):
        if msg not in self.warnings:
            self.warnings.append(msg)

    # ------------------------------------------------------------------
    def add_node(self, path: str) -> int:
        """transform / joint を親から順に登録する。"""
        if path in self.index_of:
            return self.index_of[path]
        parent = path.rsplit("|", 1)[0]
        pidx = self.add_node(parent) if parent else -1
        dag = _dag(path)
        fn = om.MFnDependencyNode(dag.node())
        ntype = cmds.nodeType(path)
        attrs = {}
        try:
            g = lambda a: list(cmds.getAttr(path + "." + a)[0])  # noqa: E731
            attrs = {
                "t": schema.round_list(g("translate")),
                "r": schema.round_list([v * self.to_deg for v in g("rotate")]),
                "s": schema.round_list(g("scale")),
                "ro": ROTATE_ORDERS[int(cmds.getAttr(path + ".rotateOrder"))],
            }
            if ntype == "joint":
                attrs["jo"] = schema.round_list([v * self.to_deg for v in g("jointOrient")])
        except (ValueError, RuntimeError, IndexError):
            pass
        entry = {
            "name": path.rsplit("|", 1)[-1],
            "path": path,
            "type": ntype,
            "parent": pidx,
            "matrix": schema.matrix_list(_matrix_from_plug(fn, "matrix")),
            "worldMatrix": schema.matrix_list(list(dag.inclusiveMatrix())),
            "inheritsTransform": bool(cmds.getAttr(path + ".inheritsTransform")),
            "visible": bool(cmds.getAttr(path + ".visibility")),
            "attrs": attrs,
        }
        if ntype == "joint":
            entry["segmentScaleCompensate"] = bool(cmds.getAttr(path + ".segmentScaleCompensate"))
            try:
                bps = cmds.getAttr(path + ".bindPose")
                if isinstance(bps, (list, tuple)) and len(bps) == 16:
                    self.bind_bps[path] = [float(v) for v in bps]
            except (RuntimeError, ValueError):
                pass
        idx = len(self.nodes)
        self.index_of[path] = idx
        self.nodes.append(entry)
        return idx

    def add_camera(self, shape: str):
        """カメラ（シェイプ）を登録する。値は Maya の単位のまま（焦点距離 mm・フィルムバック インチ）"""
        g = lambda a: cmds.getAttr(shape + "." + a)  # noqa: E731
        parent = shape.rsplit("|", 1)[0]
        entry = {"name": parent.rsplit("|", 1)[-1], "shape": shape.rsplit("|", 1)[-1], "path": shape,
                 "transform": self.add_node(parent)}
        for attr in ("focalLength", "horizontalFilmAperture", "verticalFilmAperture", "nearClipPlane", "farClipPlane",
                     "orthographicWidth", "lensSqueezeRatio", "horizontalFilmOffset", "verticalFilmOffset", "cameraScale"):
            entry[attr] = round(float(g(attr)), 6)
        entry["filmFit"] = int(g("filmFit"))
        entry["orthographic"] = bool(g("orthographic"))
        entry["renderable"] = bool(g("renderable"))
        self.cameras.append(entry)

    def _view_camera(self) -> int:
        """Maya で作業中のビュー（モデルパネル）のカメラの、cameras の番号（起動時のカメラなどは -1）"""
        try:
            panel = cmds.getPanel(withFocus=True)
            if not panel or cmds.getPanel(typeOf=panel) != "modelPanel":
                panel = cmds.playblast(activeEditor=True)
            cam = cmds.modelEditor(panel, query=True, camera=True) or ""
            cam_long = (cmds.ls(cam, long=True) or [cam])[0]
        except Exception:  # noqa: BLE001  ビューがない（バッチ）など
            return -1
        for i, c in enumerate(self.cameras):
            if cam_long in (c["path"], c["path"].rsplit("|", 1)[0]):
                return i
        return -1

    @staticmethod
    def _render_settings() -> dict:
        try:
            w = int(cmds.getAttr("defaultResolution.width"))
            h = int(cmds.getAttr("defaultResolution.height"))
            dar = float(cmds.getAttr("defaultResolution.deviceAspectRatio"))
        except (RuntimeError, ValueError, TypeError, KeyError):
            w, h, dar = 640, 480, 4.0 / 3.0
        return {"width": w, "height": h, "deviceAspectRatio": dar}

    def _influence_path(self, dag) -> str:
        p = om.MDagPath(dag)
        if p.node().hasFn(om.MFn.kShape):
            p.pop()
        return p.fullPathName()

    # ------------------------------------------------------------------
    def add_mesh(self, shape: str):
        dag = _dag(shape)
        full = dag.fullPathName()
        transform = full.rsplit("|", 1)[0]
        t_idx = self.add_node(transform)
        name = full.rsplit("|", 1)[-1]

        sc_name, fn_skin, geo_index = _find_skin(full)
        source = None
        if fn_skin is not None:
            try:
                source = _skin_input_mesh(fn_skin, geo_index)
            except RuntimeError as exc:
                self.warn("%s: skinCluster の入力形状を取得できません（%s）。スキンなしで表示します。" % (name, exc))
                fn_skin = None
        if source is None:
            source = om.MFnMesh(dag)
        positions, counts, indices = _mesh_arrays(source)
        nv = len(positions) // 3
        face_mats = self._face_materials(dag, len(counts), name)
        uv = _uv_data(source, counts, self._uv_set_for(face_mats, full))
        if uv is None and any(m >= 0 and self.materials[m]["texture"] >= 0 for m in set(face_mats)):
            self.warn("%s: テクスチャのあるマテリアルが割り当てられていますが、UV がありません" % name)

        hist = cmds.listHistory(full, pruneDagObjects=True) or []
        others = [d for d in (cmds.ls(hist, type="geometryFilter") or [])
                  if cmds.nodeType(d) not in ("skinCluster", "tweak")]
        if fn_skin is not None and others:
            self.warn("%s: デフォーマ %s があります。skinCluster より前段のものは形状に含まれますが、"
                      "後段のものは反映されません。" % (name, ", ".join(others)))

        skin = None
        if fn_skin is not None:
            skin = self._skin_data(name, sc_name, fn_skin, dag, nv)

        self.meshes.append({
            "name": name,
            "path": full,
            "transform": t_idx,
            "visible": bool(dag.isVisible()),
            "visibleSelf": bool(cmds.getAttr(full + ".visibility")),
            "positions": positions,
            "counts": counts,
            "indices": indices,
            "uv": uv,
            "hardEdges": _hard_edges(source),
            "material": face_mats[0] if face_mats and len(set(face_mats)) == 1 else -1,
            "faceMaterials": face_mats if len(set(face_mats)) > 1 else None,
            "skin": skin,
        })

    # ------------------------------------------------------------------ マテリアル
    def _face_materials(self, dag, n_faces: int, mesh_name: str) -> List[int]:
        try:
            sgs, per_face = om.MFnMesh(dag).getConnectedShaders(dag.instanceNumber())
        except RuntimeError:
            return [-1] * n_faces
        mats = [self._material_for_sg(om.MFnDependencyNode(o).name()) for o in sgs]
        out = [mats[i] if 0 <= i < len(mats) else -1 for i in per_face]
        if len(out) != n_faces:
            self.warn("%s: マテリアルの割り当てと面の数が合いません（%d / %d）" % (mesh_name, len(out), n_faces))
            out = (out + [-1] * n_faces)[:n_faces]
        return out

    def _material_for_sg(self, sg: str) -> int:
        shaders = cmds.listConnections(sg + ".surfaceShader", source=True, destination=False) or []
        if not shaders:
            return -1
        shader = shaders[0]
        if shader in self._mat_of:
            return self._mat_of[shader]
        stype = cmds.nodeType(shader)
        color = list(default_color(stype))
        for a in albedo_attrs(stype):
            if not cmds.attributeQuery(a, node=shader, exists=True):
                continue
            try:
                val = cmds.getAttr(shader + "." + a)
                if isinstance(val, list) and val and isinstance(val[0], tuple) and len(val[0]) >= 3:
                    color = [float(x) for x in val[0][:3]]
            except (RuntimeError, ValueError):
                pass
            break
        maps = {}
        file_node = None
        for kind, attrs in map_attrs(stype).items():
            src = self._map_source(shader, kind, attrs)
            if src is None:
                continue
            f, ch = src
            maps[kind] = {"texture": self._texture_for(f, shader), "channel": ch}
            if kind == "baseColor":
                file_node = f
        scalars = {}
        for kind, (names, default) in SCALAR_ATTRS.get(stype, {}).items():
            scalars[kind] = default
            for a in names:
                if cmds.attributeQuery(a, node=shader, exists=True):
                    try:
                        scalars[kind] = float(cmds.getAttr(shader + "." + a))
                    except (RuntimeError, ValueError, TypeError):
                        pass
                    break
        use_alpha = False
        if file_node is not None:
            plugs = []
            for out in ALPHA_OUTPUTS:
                if cmds.attributeQuery(out, node=file_node, exists=True):
                    plugs += cmds.listConnections(file_node + "." + out, source=False, destination=True,
                                                  plugs=True, skipConversionNodes=True) or []
            use_alpha = any(p.split(".", 1)[0] == shader and _opacity_plug(p) for p in plugs)
        idx = len(self.materials)
        self._mat_of[shader] = idx
        if file_node is not None:
            self._file_of_mat[idx] = file_node
        entry = {"name": shader, "type": stype, "shadingGroup": sg, "color": schema.round_list(color),
                 "texture": maps.get("baseColor", {}).get("texture", -1), "useAlpha": use_alpha, "maps": maps}
        entry.update(scalars)
        self.materials.append(entry)
        return idx

    def _map_source(self, shader: str, kind: str, attrs):
        """マップの種類 kind の接続元 → (file ノード, チャンネル)。法線は bump2d・aiNormalMap 経由も。"""
        for a in attrs:
            if not cmds.attributeQuery(a, node=shader, exists=True):
                continue
            plugs = cmds.listConnections(shader + "." + a, source=True, destination=False, plugs=True,
                                         skipConversionNodes=True) or []
            if not plugs:
                return None
            node, sattr = plugs[0].split(".", 1)
            t = cmds.nodeType(node)
            if t == "file":
                return node, OUTPUT_CHANNEL.get(sattr, "rgb")
            if kind == "normal" and t == "bump2d":
                interp = int(cmds.getAttr(node + ".bumpInterp"))
                f = cmds.listConnections(node + ".bumpValue", source=True, destination=False, type="file") or []
                if interp in (1, 2) and f:
                    return f[0], "rgb"
                self.warn("%s: 高さのバンプ（bump2d・%s）は未対応です。法線マップ（Tangent Space Normals）のみ表示します。"
                          % (shader, node))
                return None
            if kind == "normal" and t == "aiNormalMap":
                f = cmds.listConnections(node + ".input", source=True, destination=False, type="file") or []
                if f:
                    return f[0], "rgb"
            self.warn("%s: %s に %s（%s）がつながっています。file ノードが直接つながっている場合のみ表示します。"
                      % (shader, a, node, t))
            return None
        return None

    def _texture_for(self, file_node: str, used_by: str) -> int:
        if file_node in self._tex_of:
            return self._tex_of[file_node]
        raw = cmds.getAttr(file_node + ".fileTextureName") or ""
        try:
            if int(cmds.getAttr(file_node + ".uvTilingMode")) == 3:      # UDIM
                raw = to_udim_pattern(raw)
        except (RuntimeError, ValueError, TypeError):
            pass
        preferred = []
        try:
            resolved_by_maya = cmds.getAttr(file_node + ".computedFileTextureNamePattern") or ""
            if resolved_by_maya:
                preferred.append(resolved_by_maya)
        except (RuntimeError, ValueError):
            pass
        entry = texture_entry(file_node, raw, self.resolver, preferred)
        for w in texture_warnings(entry, used_by):
            self.warn(w)
        self._tex_of[file_node] = len(self.textures)
        self.textures.append(entry)
        return self._tex_of[file_node]

    def _uv_set_for(self, face_mats: List[int], shape_path: str) -> Optional[str]:
        """テクスチャに紐づけられた UV セット（uvLink）。なければ None（現在の UV セット）"""
        short = shape_path.rsplit("|", 1)[-1]
        for m in sorted(set(face_mats)):
            f = self._file_of_mat.get(m)
            if not f:
                continue
            try:
                links = cmds.uvLink(query=True, texture=f) or []
            except RuntimeError:
                continue
            for link in links:          # 例: "pCubeShape1.uvSet[1].uvSetName"
                node = link.split(".", 1)[0]
                if node in (short, shape_path):
                    try:
                        return cmds.getAttr(link)
                    except (RuntimeError, ValueError):
                        pass
        return None

    def _skin_data(self, mesh_name: str, sc_name: str, fn_skin, out_dag, nv: int) -> Optional[dict]:
        infl = fn_skin.influenceObjects()
        if len(infl) == 0:
            self.warn("%s: %s にインフルエンスがありません" % (mesh_name, sc_name))
            return None
        dep = om.MFnDependencyNode(fn_skin.object())
        influences: List[int] = []
        pms: List[List[float]] = []
        for p in infl:
            path = self._influence_path(p)
            influences.append(self.add_node(path))
            li = fn_skin.indexForInfluenceObject(p)
            pm = _matrix_from_plug(dep, "bindPreMatrix", li)
            pms.append(schema.matrix_list(pm))
            self.bind_pm.setdefault(path, inverse_or_identity(pm))

        n_out = om.MFnMesh(out_dag).numVertices
        comp_fn = om.MFnSingleIndexedComponent()
        comp = comp_fn.create(om.MFn.kMeshVertComponent)
        comp_fn.setCompleteData(n_out)
        weights, n_inf = fn_skin.getWeights(out_dag, comp)
        counts, idx, vals = _sparse_weights(weights, n_out, n_inf)
        counts, idx, vals = self._keep_listed_zero(fn_skin, dep, infl, counts, idx, vals)
        if n_out != nv:
            self.warn("%s: スキン前後で頂点数が違います（%d → %d）。ウェイトの対応がずれている可能性があります。"
                      % (mesh_name, nv, n_out))
            if n_out > nv:
                keep = sum(counts[:nv])
                counts, idx, vals = counts[:nv], idx[:keep], vals[:keep]
            else:
                counts = counts + [0] * (nv - n_out)
        method = int(cmds.getAttr(sc_name + ".skinningMethod"))
        if method:
            self.warn("%s: スキニング方式が %s です。ビューアはリニアのみで変形します。"
                      % (sc_name, {1: "デュアルクォータニオン", 2: "ブレンド"}.get(method, str(method))))
        return {
            "cluster": sc_name,
            "method": method,
            "normalize": int(cmds.getAttr(sc_name + ".normalizeWeights")),
            "weightDistribution": int(cmds.getAttr(sc_name + ".weightDistribution")),
            "influences": influences,
            "bindPreMatrices": pms,
            "geomMatrix": schema.matrix_list(_matrix_from_plug(dep, "geomMatrix")),
            "counts": counts,
            "indices": idx,
            "weights": vals,
        }

    # ------------------------------------------------------------------
    def _keep_listed_zero(self, fn_skin, dep, infl, counts, idx, vals):
        """合計が 0 の頂点に、記録されているジョイント（値 0）を加える（.ma パーサと同じ形にする）"""
        zero = [v for v, c in enumerate(counts) if c == 0]
        if not zero:
            return counts, idx, vals
        phys_of = {fn_skin.indexForInfluenceObject(p): k for k, p in enumerate(infl)}
        wl = dep.findPlug("weightList", False)
        w_attr = dep.attribute("weights")
        extra = {}
        for v in zero:
            try:
                plug = wl.elementByLogicalIndex(v).child(w_attr)
                listed = [phys_of[li] for li in plug.getExistingArrayAttributeIndices() if li in phys_of]
            except RuntimeError:
                listed = []
            if listed:
                extra[v] = sorted(listed)
        if not extra:
            return counts, idx, vals
        new_counts, new_idx, new_vals = [], [], []
        off = 0
        for v, c in enumerate(counts):
            if v in extra:
                new_counts.append(len(extra[v]))
                new_idx += extra[v]
                new_vals += [0.0] * len(extra[v])
            else:
                new_counts.append(c)
                new_idx += idx[off:off + c]
                new_vals += vals[off:off + c]
            off += c
        return new_counts, new_idx, new_vals

    def _apply_bind_pose(self):
        """バインドポーズ（.pm → bindPose 属性の優先順）のローカル行列を nodes に入れる"""
        worlds: List[List[float]] = []
        for n in self.nodes:
            p = n["parent"]
            pw = worlds[p] if p >= 0 and n["inheritsTransform"] else identity()
            src = None
            if n["path"] in self.bind_pm:
                W, src = self.bind_pm[n["path"]], "pm"
            elif n["path"] in self.bind_bps:
                W, src = self.bind_bps[n["path"]], "bps"
            else:
                W = mul(n["matrix"], pw)
            worlds.append(W)
            if src:
                n["bindMatrix"] = schema.matrix_list(mul(W, inverse_or_identity(pw)))
                n["bindSource"] = src

    def to_dict(self) -> dict:
        self._apply_bind_pose()
        scene_path = cmds.file(query=True, sceneName=True) or ""
        nverts = sum(len(m["positions"]) // 3 for m in self.meshes)
        return {
            "schema": schema.SCHEMA_NAME,
            "version": schema.SCHEMA_VERSION,
            "source": {
                "kind": "maya",
                "path": scene_path,
                "name": os.path.basename(scene_path) if scene_path else "untitled（Maya）",
                "mayaVersion": cmds.about(version=True),
                "linearUnit": "cm",
                "angularUnit": "deg",
                "uiLinearUnit": cmds.currentUnit(query=True, linear=True),
                "upAxis": cmds.upAxis(query=True, axis=True),
            },
            "nodes": self.nodes,
            "meshes": self.meshes,
            "cameras": self.cameras,
            "viewCamera": self._view_camera(),
            "render": self._render_settings(),
            "materials": self.materials,
            "textures": self.textures,
            "warnings": self.warnings,
            "stats": {
                "nodes": len(self.nodes),
                "joints": sum(1 for n in self.nodes if n["type"] == "joint"),
                "meshes": len(self.meshes),
                "cameras": len(self.cameras),
                "vertices": nverts,
                "polygons": sum(len(m["counts"]) for m in self.meshes),
                "skinnedMeshes": sum(1 for m in self.meshes if m["skin"]),
                "materials": len(self.materials),
                "textures": len(self.textures),
                "texturesMissing": sum(1 for t in self.textures if not t["resolved"]),
                "bindPoseNodes": sum(1 for n in self.nodes if "bindMatrix" in n),
                "drivenNodes": 0,
            },
        }


def _unique(paths):
    seen = set()
    out = []
    for p in paths:
        if p not in seen and "->" not in p:
            seen.add(p)
            out.append(p)
    return out


def _collect(selection_only: bool) -> Tuple[List[str], List[str]]:
    if not selection_only:
        meshes = cmds.ls(type="mesh", long=True, noIntermediate=True) or []
        joints = cmds.ls(type="joint", long=True) or []
        return _unique(meshes), _unique(joints)
    sel = cmds.ls(selection=True, long=True, objectsOnly=True) or []
    if not sel:
        raise RuntimeError("何も選択されていません。メッシュかジョイント（またはその親）を選択してください。")
    meshes: List[str] = []
    joints: List[str] = []
    for s in sel:
        t = cmds.nodeType(s)
        if t == "mesh":
            meshes.append(s)
        elif t == "joint":
            joints.append(s)
        meshes += cmds.listRelatives(s, allDescendents=True, fullPath=True, type="mesh") or []
        joints += cmds.listRelatives(s, allDescendents=True, fullPath=True, type="joint") or []
    meshes = [m for m in meshes if not cmds.getAttr(m + ".intermediateObject")]
    return _unique(meshes), _unique(joints)


def _collect_cameras(selection_only: bool) -> List[str]:
    if selection_only:
        cams: List[str] = []
        for s in cmds.ls(selection=True, long=True, objectsOnly=True) or []:
            if cmds.nodeType(s) == "camera":
                cams.append(s)
            cams += cmds.listRelatives(s, allDescendents=True, fullPath=True, type="camera") or []
    else:
        cams = cmds.ls(type="camera", long=True) or []
    out = []
    for c in _unique(cams):
        try:
            if cmds.getAttr(c + ".intermediateObject") or cmds.camera(c, query=True, startupCamera=True):
                continue
        except (RuntimeError, ValueError, AttributeError):
            continue
        out.append(c)
    return out


def extract_scene(selection_only: bool = False, progress=None) -> dict:
    """現在の Maya シーン（または選択範囲）を共通 JSON（dict）にする。"""
    meshes, joints = _collect(selection_only)
    ex = _Extractor(progress)
    total = max(len(meshes), 1)
    for i, m in enumerate(meshes):
        if progress:
            progress(i / total, "メッシュを取得中: %s" % m.rsplit("|", 1)[-1])
        try:
            ex.add_mesh(m)
        except Exception as exc:  # noqa: BLE001  1 つの失敗で全体を止めない
            ex.warn("%s を取得できませんでした: %s" % (m, exc))
    for j in sorted(joints, key=lambda p: p.count("|")):
        ex.add_node(j)
    # シーンのカメラ（起動時からある persp・top・front・side は除く）。選択範囲のときは選択の下にあるものだけ
    for c in _collect_cameras(selection_only):
        try:
            ex.add_camera(c)
        except Exception as exc:  # noqa: BLE001
            ex.warn("カメラ %s を取得できませんでした: %s" % (c, exc))
    if not ex.meshes and not ex.nodes:
        ex.warn("表示できるメッシュもジョイントもありません。")
    scene = ex.to_dict()
    schema.validate(scene)
    return scene
