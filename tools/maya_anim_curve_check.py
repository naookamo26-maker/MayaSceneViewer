# -*- coding: utf-8 -*-
"""Maya の中で実行する: アニメーションカーブの評価結果を書き出す（ビューアとの比較用）。

Maya のスクリプトエディタ（Python）で次のように実行する（パスは書き換える）:

    import sys; sys.path.insert(0, r"C:/path/to/MayaSceneViewer/tools")
    import maya_anim_curve_check as m
    m.run(r"C:/temp/curve_check")           # テスト用のシーンを作って保存し、評価結果を書き出す
    # m.export_current(r"C:/temp/my_scene")  # いま開いているシーンのカーブを書き出す（シーンは変えない）

出力（フォルダの中）:
    curve_check.ma        テスト用のシーン（run のとき）
    curve_check.json      Maya が評価した値（カーブごとのキー・接線・範囲外の設定と、0.25 フレームごとの値。
                          回転の補間（rotationInterpolation）を変えた回転は、ノードの回転の値も）

この 2 つをビューアのリポジトリで比べる:
    python tools/compare_anim_curves.py curve_check.ma curve_check.json --report curve_report.md

テスト用のシーンの内容:
    接線の種類（spline・clamped・plateau・auto・autoease・automix・autocustom・linear・flat・step・stepnext・fixed）
    × キーの並び（上り・山と谷・平ら・間隔が不均等・2 キー・値の近いキー） × 重みなし・重み付き。
    山と谷の並びには、範囲外（linear・cycle・cycleRelative・oscillate）を変えたものも作る（端のキーの接線の確認）。
    回転は、回転の補間（独立したオイラー・同期したオイラー・クォータニオン）を変えたものを作る。
"""
import json
import os

import maya.cmds as cmds

TANGENTS = ["spline", "clamped", "plateau", "auto", "autoease", "automix", "autocustom", "linear", "flat", "step",
            "stepnext", "fixed"]
PATTERNS = {
    "rise": [(1, 0.0), (10, 5.0), (20, 12.0), (30, 13.0)],
    "peak": [(1, 0.0), (10, 8.0), (20, 2.0), (30, 6.0)],
    "flat": [(1, 0.0), (10, 5.0), (20, 5.0), (30, 0.0)],
    "uneven": [(1, 0.0), (3, 4.0), (20, 6.0), (22, 10.0), (40, 0.0)],
    "two": [(1, 0.0), (25, 10.0)],
    "near": [(1, 0.0), (10, 5.0), (11, 5.001), (30, 0.0)],
}
INFINITIES = ["linear", "cycle", "cycleRelative", "oscillate"]
ROTATION_MODES = ["euler", "quaternion", "quaternionSlerp", "quaternionSquad"]
STEP = 0.25            # 書き出す値の間隔（フレーム）


def _safe_name(s):
    return "".join(c if c.isalnum() else "_" for c in s)


def build_test_scene():
    """テスト用のカーブを作る（新しいシーン）。作ったカーブの名前の一覧を返す。"""
    cmds.file(new=True, force=True)
    cmds.currentUnit(time="film")
    cmds.currentUnit(linear="cm")
    cmds.currentUnit(angle="deg")
    made = []

    def keyed(name, keys, tangent, weighted, attr="translateX"):
        loc = cmds.spaceLocator(name=name)[0]
        for t, v in keys:
            cmds.setKeyframe(loc, attribute=attr, time=t, value=v)
        curve = cmds.listConnections("%s.%s" % (loc, attr), type="animCurve")[0]
        if weighted:
            cmds.keyTangent(curve, edit=True, weightedTangents=True)
        try:
            cmds.keyTangent(curve, edit=True, inTangentType=tangent, outTangentType=tangent)     # すべてのキー
        except Exception:  # noqa: BLE001
            cmds.delete(curve)                              # この Maya にない接線の種類（autocustom など）
            cmds.delete(loc)
            return None
        if tangent == "fixed":                              # 固定: 角度と重みをキーごとに変える
            for i, (t, _v) in enumerate(keys):
                cmds.keyTangent(curve, edit=True, time=(t, t), lock=False, inAngle=10.0 * (i + 1),
                                outAngle=-15.0 * (i + 1))
                if weighted:
                    cmds.keyTangent(curve, edit=True, time=(t, t), weightLock=False, inWeight=2.0 + i, outWeight=5.0 + 3 * i)
        made.append(cmds.rename(curve, name + "_curve"))
        return made[-1]

    for tangent in TANGENTS:
        for pattern, keys in PATTERNS.items():
            for weighted in (False, True):
                keyed(_safe_name("c_%s_%s_%s" % (tangent, pattern, "w" if weighted else "n")), keys, tangent, weighted)
        for inf in INFINITIES:                                  # 範囲外を変えると、端のキーの接線が変わるか
            c = keyed(_safe_name("c_%s_peak_inf_%s" % (tangent, inf)), PATTERNS["peak"], tangent, False)
            if c:
                cmds.setInfinity(c, preInfinite=inf, postInfinite=inf)
        # 回転（度）。角度のカーブ（animCurveTA）の単位の確認
        keyed(_safe_name("c_%s_rot" % tangent), [(1, 0.0), (12, 90.0), (24, -45.0), (36, 200.0)], tangent, False,
              attr="rotateZ")
    # 回転の補間を変えた回転（3 軸すべてにキー）
    for mode in ROTATION_MODES:
        loc = cmds.spaceLocator(name="r_" + mode)[0]
        for t, r in [(1, (0, 0, 0)), (12, (90, 45, 30)), (24, (-120, 80, 170)), (36, (30, -60, 10))]:
            for axis, v in zip("XYZ", r):
                cmds.setKeyframe(loc, attribute="rotate" + axis, time=t, value=v)
        curves = [cmds.listConnections("%s.rotate%s" % (loc, a), type="animCurve")[0] for a in "XYZ"]
        try:
            cmds.rotationInterpolation(curves, convert=mode)
        except Exception:  # noqa: BLE001
            print("回転の補間 %s にできませんでした" % mode)
    cmds.playbackOptions(minTime=1, maxTime=40)
    return made


def _units():
    return {"time": cmds.currentUnit(query=True, time=True), "linear": cmds.currentUnit(query=True, linear=True),
            "angle": cmds.currentUnit(query=True, angle=True)}


def _sample_times(times):
    t0, t1 = min(times), max(times)
    span = max(t1 - t0, 1.0)
    out, t = [], t0 - 1.5 * span
    while t <= t1 + 1.5 * span + 1e-9:
        out.append(round(t, 6))
        t += STEP
    return out


def curve_info(curve):
    times = cmds.keyframe(curve, query=True, timeChange=True) or []
    if not times:
        return None
    q = lambda **kw: cmds.keyTangent(curve, query=True, **kw) or []  # noqa: E731
    samples = _sample_times(times)
    values = [cmds.keyframe(curve, query=True, eval=True, time=(t, t))[0] for t in samples]
    return {
        "name": curve,
        "type": cmds.nodeType(curve),
        "weighted": bool((q(weightedTangents=True) or [False])[0]),
        "pre": (cmds.setInfinity(curve, query=True, preInfinite=True) or ["constant"])[0],
        "post": (cmds.setInfinity(curve, query=True, postInfinite=True) or ["constant"])[0],
        "keys": {"time": times, "value": cmds.keyframe(curve, query=True, valueChange=True) or [],
                 "inType": q(inTangentType=True), "outType": q(outTangentType=True),
                 "inAngle": q(inAngle=True), "outAngle": q(outAngle=True),
                 "inWeight": q(inWeight=True), "outWeight": q(outWeight=True)},
        "samples": samples,
        "values": values,
    }


def rotation_info():
    """回転の補間が「独立したオイラー」以外の回転（ノードの回転の値で比べる）"""
    out = []
    for node in cmds.ls(type="transform"):
        curves = []
        for a in "XYZ":
            c = cmds.listConnections("%s.rotate%s" % (node, a), type="animCurve", source=True, destination=False)
            curves.append(c[0] if c else None)
        if not all(curves):
            continue
        try:
            mode = cmds.rotationInterpolation(curves[0], query=True, convert=True)
        except Exception:  # noqa: BLE001
            mode = None
        mode = mode[0] if isinstance(mode, list) and mode else mode
        if mode in (None, "none", "euler", "independentEuler"):
            continue
        times = sorted(set(sum([cmds.keyframe(c, query=True, timeChange=True) or [] for c in curves], [])))
        samples = _sample_times(times)
        values = [list(cmds.getAttr(node + ".rotate", time=t)[0]) for t in samples]
        out.append({"node": node, "mode": mode, "curves": curves, "samples": samples, "values": values})
    return out


def export_current(folder, name=None):
    """いま開いているシーンのアニメーションカーブ（時間で引くもの）の評価結果を書き出す"""
    if not os.path.isdir(folder):
        os.makedirs(folder)
    name = name or "curve_check"
    curves = [c for c in cmds.ls(type=["animCurveTL", "animCurveTA", "animCurveTU"]) or []]
    data = {"maya": cmds.about(version=True), "units": _units(),
            "curves": [x for x in (curve_info(c) for c in curves) if x], "rotations": rotation_info()}
    path = os.path.join(folder, name + ".json")
    with open(path, "w") as f:
        json.dump(data, f)
    print("書き出しました: %s（カーブ %d 本）" % (path, len(data["curves"])))
    return path


def run(folder):
    """テスト用のシーンを作って保存し、評価結果を書き出す"""
    if not os.path.isdir(folder):
        os.makedirs(folder)
    build_test_scene()
    ma = os.path.join(folder, "curve_check.ma")
    cmds.file(rename=ma)
    cmds.file(save=True, type="mayaAscii", force=True)
    print("シーンを保存しました: %s" % ma)
    return export_current(folder, "curve_check")
