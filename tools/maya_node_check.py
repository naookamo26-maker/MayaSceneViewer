# -*- coding: utf-8 -*-
"""Maya の中で実行する: 計算ノードなどの細かな動作を確かめ、表にする（docs/maintenance_plan.md の「8」の項目）。

**未実行**: このスクリプトは Maya のない環境で書いたもので、まだ Maya で実行していません。
最初に実行したときは、エラーで止まった項目を直してから結果を使ってください（項目ごとに独立していて、
1 つが失敗してもほかは続けます）。

Maya のスクリプトエディタ（Python）で:

    import sys; sys.path.insert(0, r"C:/path/to/MayaSceneViewer/tools")
    import maya_node_check as m
    m.run(r"C:/temp/node_check")        # 新しいシーンで確かめ、node_check.json と node_check.md を書く

mayapy なら:  mayapy tools/maya_node_check.py C:/temp/node_check

結果（node_check.md）を docs/maya_verification.md の「結果」に貼り、ビューアの実装との違いを直す。
シーンは新しく作る（開いているシーンは保存せずに閉じるので、先に保存しておく）。
"""
from __future__ import annotations

import json
import os
import sys
import traceback

import maya.cmds as cmds

CHECKS = []


def check(title, viewer):
    """確かめる項目の登録。viewer: いまのビューアの実装（表に一緒に出す）"""
    def deco(fn):
        CHECKS.append((fn.__name__, title, viewer, fn))
        return fn
    return deco


def _new():
    cmds.file(new=True, force=True)
    cmds.currentUnit(linear="cm", angle="deg", time="film")


def _drive(node_attr, values, kind="animCurveTU"):
    """node_attr をカーブで動かす（フレーム 1, 2, 3, ... に values）。カーブの名前を返す"""
    crv = cmds.createNode(kind)
    for i, v in enumerate(values):
        cmds.setKeyframe(crv, time=i + 1, value=v)
    cmds.keyTangent(crv, inTangentType="linear", outTangentType="linear")
    cmds.connectAttr(crv + ".output", node_attr, force=True)
    return crv


def _at(f, attr):
    cmds.currentTime(f, update=True)
    v = cmds.getAttr(attr)
    return v[0] if isinstance(v, list) and len(v) == 1 else v


@check("setRange: oldMin・oldMax の外の入力", "外へ延ばす（rig.js の setRange）")
def set_range():
    _new()
    rows = []
    for omin, omax in ((0.0, 10.0), (10.0, 0.0)):
        n = cmds.createNode("setRange")
        cmds.setAttr(n + ".min", 0, 0, 0, type="double3")
        cmds.setAttr(n + ".max", 1, 1, 1, type="double3")
        cmds.setAttr(n + ".oldMin", omin, omin, omin, type="double3")
        cmds.setAttr(n + ".oldMax", omax, omax, omax, type="double3")
        for x in (-5.0, 0.0, 5.0, 10.0, 15.0):
            cmds.setAttr(n + ".valueX", x)
            rows.append({"oldMin": omin, "oldMax": omax, "value": x, "outValueX": cmds.getAttr(n + ".outValueX")})
    return rows


@check("vectorProduct: 内積（op 1）と normalizeOutput", "正規化しない（rig.js の vectorProduct）")
def vector_product():
    _new()
    rows = []
    for no in (0, 1):
        for a, b in (((2, 0, 0), (3, 3, 0)), ((0, 0, 0), (1, 0, 0)), ((1, 2, 3), (-4, 5, 0.5))):
            n = cmds.createNode("vectorProduct")
            cmds.setAttr(n + ".operation", 1)
            cmds.setAttr(n + ".normalizeOutput", no)
            cmds.setAttr(n + ".input1", *a, type="double3")
            cmds.setAttr(n + ".input2", *b, type="double3")
            rows.append({"normalizeOutput": no, "input1": a, "input2": b, "output": cmds.getAttr(n + ".output")[0]})
    return rows


@check("表示（bool）に入る小数", "0.5 以上で表示（rig.js の hiddenByProps）")
def bool_fraction():
    _new()
    t = cmds.createNode("transform", name="visTest")
    cmds.createNode("locator", parent=t)
    _drive(t + ".visibility", [0.3, 0.5, 0.7, 0.49999, 0.0])
    path = t
    rows = []
    import maya.api.OpenMaya as om
    sel = om.MSelectionList()
    sel.add(path)
    dag = sel.getDagPath(0)
    for f, v in enumerate([0.3, 0.5, 0.7, 0.49999, 0.0]):
        got = _at(f + 1, t + ".visibility")
        rows.append({"curve": v, "getAttr": got, "isVisible": dag.isVisible()})
    return rows


@check("enum・整数の属性に入る小数（condition.operation・choice.selector）", "Math.round（四捨五入）")
def enum_fraction():
    _new()
    vals = [1.4, 1.5, 1.6, 2.5, -0.5]
    cond = cmds.createNode("condition")
    cmds.setAttr(cond + ".firstTerm", 1)
    cmds.setAttr(cond + ".secondTerm", 2)
    cmds.setAttr(cond + ".colorIfTrue", 1, 1, 1, type="double3")
    cmds.setAttr(cond + ".colorIfFalse", 0, 0, 0, type="double3")
    _drive(cond + ".operation", vals)
    ch = cmds.createNode("choice")
    for i in range(4):
        cmds.setAttr(ch + ".input[%d]" % i, 10 * i)
    _drive(ch + ".selector", vals)
    rows = []
    for f, v in enumerate(vals):
        rows.append({"curve": v, "condition.operation": _at(f + 1, cond + ".operation"),
                     "condition.outColorR": _at(f + 1, cond + ".outColorR"),
                     "choice.selector": _at(f + 1, ch + ".selector"), "choice.output": _at(f + 1, ch + ".output")})
    return rows


@check("multiplyDivide の 0 割り", "入力 1 をそのまま返す（rig.js の multiplyDivide）")
def divide_by_zero():
    _new()
    rows = []
    for op in (2, 3):                                   # 2: 割る・3: べき乗（参考）
        n = cmds.createNode("multiplyDivide")
        cmds.setAttr(n + ".operation", op)
        cmds.setAttr(n + ".input1", 5, -5, 0, type="double3")
        cmds.setAttr(n + ".input2", 0, 0, 0, type="double3")
        rows.append({"operation": op, "output": cmds.getAttr(n + ".output")[0]})
    return rows


@check(".tan が書かれないカーブ", "オート（animation.js）")
def curve_tan():
    """接線の既定の種類ごとにカーブを作って .ma に保存し、.tan の setAttr があるかを調べる"""
    import tempfile
    rows = []
    for itt, ott in (("auto", "auto"), ("spline", "spline"), ("linear", "linear"), ("clamped", "clamped"),
                     ("flat", "flat"), ("stepnext", "step"), ("plateau", "plateau")):
        _new()
        cmds.keyTangent(g=True, inTangentType=itt, outTangentType=ott)
        t = cmds.createNode("transform", name="tanTest")
        cmds.setKeyframe(t, attribute="translateX", time=1, value=0)
        cmds.setKeyframe(t, attribute="translateX", time=10, value=5)
        path = os.path.join(tempfile.gettempdir(), "maya_node_check_tan.ma")
        cmds.file(rename=path)
        cmds.file(save=True, type="mayaAscii", force=True)
        text = open(path, encoding="utf-8", errors="replace").read()
        block = text[text.find("createNode animCurveTL"):]
        block = block[:block.find("createNode", 10)]
        rows.append({"default": "%s/%s" % (itt, ott), "has .tan": '".tan"' in block,
                     "lines": [ln.strip() for ln in block.splitlines()[1:6]]})
    cmds.keyTangent(g=True, inTangentType="auto", outTangentType="auto")
    return rows


@check("orientConstraint の interpType（2・3 ターゲット）", "常に平均（符号をそろえた四元数の和の正規化）")
def constraint_interp():
    rows = []
    targets = ((0, 0, 0), (0, 170, 0), (0, -100, 30))
    for count in (2, 3):
        for it in range(5):                              # 0 No Flip・1 Average・2 Shortest・3 Longest・4 Cache
            _new()
            tg = []
            for k in range(count):
                t = cmds.createNode("transform", name="tg%d" % k)
                cmds.setAttr(t + ".rotate", *targets[k], type="double3")
                tg.append(t)
            d = cmds.createNode("transform", name="driven")
            c = cmds.orientConstraint(*(tg + [d]))[0]
            cmds.setAttr(c + ".interpType", it)
            rows.append({"targets": count, "interpType": it, "rotate": cmds.getAttr(d + ".rotate")[0]})
    return rows


@check("pairBlend の四元数補間（.ri 1）と回転順（.ro）", "回転順 xyz 固定")
def pair_blend_ro():
    rows = []
    for ro in range(6):
        _new()
        pb = cmds.createNode("pairBlend")
        cmds.setAttr(pb + ".rotInterpolation", 1)
        cmds.setAttr(pb + ".rotateOrder", ro)
        cmds.setAttr(pb + ".inRotate1", 30, 60, 10, type="double3")
        cmds.setAttr(pb + ".inRotate2", -40, 20, 80, type="double3")
        cmds.setAttr(pb + ".weight", 0.35)
        rows.append({"rotateOrder": ro, "outRotate": cmds.getAttr(pb + ".outRotate")[0]})
    return rows


@check("リファレンスの編集の属性名（長い名前か短い名前か）", "両方に対応（1.31.7）")
def reference_edit_names():
    import tempfile
    tmp = tempfile.mkdtemp(prefix="maya_node_check_")
    _new()
    c = cmds.createNode("transform", name="ctrl")
    cmds.addAttr(c, shortName="ikfk", longName="ikFkBlend", min=0, max=1, attributeType="double", keyable=True)
    md = cmds.createNode("multiplyDivide", name="md")
    j = cmds.createNode("joint", name="jnt")
    cmds.connectAttr(c + ".ikfk", md + ".input1X")
    cmds.connectAttr(md + ".outputX", j + ".translateX")
    rig = os.path.join(tmp, "rig.ma")
    cmds.file(rename=rig)
    cmds.file(save=True, type="mayaAscii", force=True)
    _new()
    cmds.file(rig, reference=True, namespace="rig")
    cmds.setKeyframe("rig:ctrl", attribute="ikFkBlend", time=1, value=0)
    cmds.setKeyframe("rig:ctrl", attribute="ikFkBlend", time=24, value=1)
    cmds.setAttr("rig:md.input2X", 3)
    shot = os.path.join(tmp, "shot.ma")
    cmds.file(rename=shot)
    cmds.file(save=True, type="mayaAscii", force=True)
    text = open(shot, encoding="utf-8", errors="replace").read()
    start = text.find('".ed"')
    return [{"file": shot, "ed": text[start:start + 1200] if start >= 0 else "（.ed がない）"}]


@check("cm 以外の作業単位の .ma の書式", "対応しない（警告だけ）")
def unit_format():
    import tempfile
    _new()
    cmds.currentUnit(linear="m")
    t = cmds.polyCube(width=1, height=1, depth=1, name="unitCube")[0]
    cmds.setAttr(t + ".translate", 2, 0, 0, type="double3")
    path = os.path.join(tempfile.gettempdir(), "maya_node_check_unit.ma")
    cmds.file(rename=path)
    cmds.file(save=True, type="mayaAscii", force=True)
    cmds.currentUnit(linear="cm")
    text = open(path, encoding="utf-8", errors="replace").read()
    lines = [ln.strip() for ln in text.splitlines() if '".t"' in ln or '".vt' in ln or '".pt' in ln or "currentUnit" in ln]
    return [{"file": path, "lines": lines[:20]}]


def run(out_dir: str) -> list:
    """すべての項目を確かめ、out_dir に node_check.json と node_check.md を書く"""
    os.makedirs(out_dir, exist_ok=True)
    results = []
    for name, title, viewer, fn in CHECKS:
        try:
            rows = fn()
            results.append({"name": name, "title": title, "viewer": viewer, "rows": rows})
        except Exception:
            results.append({"name": name, "title": title, "viewer": viewer, "error": traceback.format_exc()})
    about = {"mayaVersion": str(cmds.about(version=True)), "checks": results}
    with open(os.path.join(out_dir, "node_check.json"), "w", encoding="utf-8") as f:
        json.dump(about, f, ensure_ascii=False, indent=1, default=str)
    md = ["# Maya での確認の結果（Maya %s）" % about["mayaVersion"], ""]
    for r in results:
        md.append("## %s" % r["title"])
        md.append("")
        md.append("ビューアの実装: %s" % r["viewer"])
        md.append("")
        if "error" in r:
            md.append("```\n%s```" % r["error"])
        else:
            rows = r["rows"]
            keys = list(rows[0].keys()) if rows else []
            md.append("| " + " | ".join(keys) + " |")
            md.append("|" + "---|" * len(keys))
            for row in rows:
                md.append("| " + " | ".join(str(row[k]).replace("|", "\\|").replace("\n", " ") for k in keys) + " |")
        md.append("")
    with open(os.path.join(out_dir, "node_check.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(md))
    print("書き出しました: %s（項目 %d・失敗 %d）" % (out_dir, len(results), sum(1 for r in results if "error" in r)))
    return results


if __name__ == "__main__":
    import maya.standalone
    maya.standalone.initialize(name="python")
    try:
        run(sys.argv[1] if len(sys.argv) > 1 else "node_check")
    finally:
        maya.standalone.uninitialize()
