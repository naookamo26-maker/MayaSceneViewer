# -*- coding: utf-8 -*-
"""Maya の中で実行する: ノードの型ごとの属性の長い名前 → 短い名前の表を、Maya から作る（ma_viewer/attr_names.json と同じ形）。

**未実行**: Maya のない環境で書いた。ふだんは Autodesk の技術資料から作った表（tools/make_attr_names.py）を使う。
Maya が使えるなら、こちらで作り直すと、資料にない型（プラグインのノード）や版の違いも反映できる。

    import sys; sys.path.insert(0, r"C:/path/to/MayaSceneViewer/tools")
    import maya_dump_attr_names as m
    m.run(r"C:/path/to/MayaSceneViewer/ma_viewer/attr_names.json")             # 今の表の型について作り直す
    # m.run(out, types=["multiplyDivide", "quatProd"])                          # 型を指定する

親の型は使わず、型ごとに継承した属性も含めて全部入れる（parents は空）。
"""
import json
import os

import maya.cmds as cmds


def names_of(node_type):
    """{長い名前: 短い名前}（同じものは入れない）。作れない型は None"""
    try:
        longs = cmds.attributeInfo(allAttributes=True, type=node_type) or []
    except RuntimeError:
        return None
    out = {}
    for ln in longs:
        try:
            sn = cmds.attributeQuery(ln, type=node_type, shortName=True)
        except RuntimeError:
            continue
        if sn and sn != ln:
            out[ln] = sn
    return out


def run(out_path, types=None):
    if types is None:
        with open(out_path, encoding="utf-8") as f:
            old = json.load(f)
        types = sorted(set(old.get("types", {})) | set(old.get("parents", {})))
    table, missing = {}, []
    for t in types:
        names = names_of(t)
        if names is None:
            missing.append(t)
        elif names:
            table[t] = dict(sorted(names.items()))
    data = {"source": "Maya %s (attributeQuery)" % cmds.about(version=True), "versions": [cmds.about(version=True)],
            "otherVersion": {}, "parents": {}, "types": table}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=0)
        f.write("\n")
    print("書き出しました: %s（型 %d。作れない型 %d: %s）" % (out_path, len(table), len(missing), ", ".join(missing)))
    return data
