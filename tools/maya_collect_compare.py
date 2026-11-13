# -*- coding: utf-8 -*-
"""Maya の中で実行する: Maya 内の読み込みの収集（maya_scene.collect）を、今の経路と速い経路で比べる（開発用）。

**未実行**: Maya のない環境で書いた。速い経路（MA_VIEWER_MAYA_FAST=1）は、これで同じ結果になることと速さを
確かめてから既定にする（docs/maintenance_plan.md の P4）。

開いているシーン（重いシーンほど差が分かる）で、Maya のスクリプトエディタ（Python）から:

    import sys
    sys.path.append(r"C:/tools/MayaSceneViewer")           # このリポジトリの場所
    sys.path.append(r"C:/tools/MayaSceneViewer/tools")
    import maya_collect_compare as m
    m.run()                                                # 結果を表示し、一時フォルダに JSON を書く
    # m.run(repeat=3, selection_only=True)                 # 選択範囲・くり返し

それぞれの経路で collect を repeat 回ずつ行い、いちばん速い回の部分ごとの時間（ログの「Maya からの収集の内訳」と
同じ）と、結果の違いを出す。比べるもの: .ma の文（SceneText.lines）・メッシュの頂点・面・辺・スムーズ・UV・
スキンウェイト（(頂点, 論理番号) → 値。0 の要素は比べない）。違いがなければ「結果は同じ」。
シーンは変えない。
"""
from __future__ import annotations

import json
import os
import tempfile

import numpy as np

from ma_viewer import maya_scene


def _weights(w):
    v, lo, val = w
    return {(int(a), int(b)): float(c) for a, b, c in zip(v, lo, val) if c != 0.0}


def diff_scenes(a, b, tol: float = 0.0) -> list:
    """2 つの SceneText の違い（文字列の一覧。なければ空）"""
    out = []
    if a.lines != b.lines:
        n = sum(1 for x, y in zip(a.lines, b.lines) if x != y) + abs(len(a.lines) - len(b.lines))
        first = next((i for i, (x, y) in enumerate(zip(a.lines, b.lines)) if x != y), min(len(a.lines), len(b.lines)))
        out.append("文が %d 行違う（最初は %d 行目: %r / %r）" % (
            n, first, a.lines[first] if first < len(a.lines) else None, b.lines[first] if first < len(b.lines) else None))
    for key in sorted(set(a.meshes) | set(b.meshes)):
        ma, mb = a.meshes.get(key), b.meshes.get(key)
        if ma is None or mb is None:
            out.append("メッシュ %s が片方にしかない" % key)
            continue
        if ma.points.shape != mb.points.shape or not np.allclose(ma.points, mb.points, rtol=0, atol=tol):
            out.append("メッシュ %s の頂点が違う" % key)
        for name in ("counts", "connects", "edges", "smooth"):
            if not np.array_equal(getattr(ma, name), getattr(mb, name)):
                out.append("メッシュ %s の %s が違う" % (key, name))
        if len(ma.uv_sets) != len(mb.uv_sets) or any(
                x[0] != y[0] or x[1] != y[1] or not np.array_equal(x[2], y[2]) or not np.array_equal(x[3], y[3])
                or not np.array_equal(x[4], y[4]) for x, y in zip(ma.uv_sets, mb.uv_sets)):
            out.append("メッシュ %s の UV が違う" % key)
    for key in sorted(set(a.skins) | set(b.skins)):
        wa, wb = a.skins.get(key), b.skins.get(key)
        if wa is None or wb is None:
            out.append("スキン %s が片方にしかない" % key)
            continue
        da, db = _weights(wa), _weights(wb)
        if set(da) != set(db):
            out.append("スキン %s のウェイトの要素が違う（今の経路だけ %d・速い経路だけ %d）" % (
                key, len(set(da) - set(db)), len(set(db) - set(da))))
        bad = [k for k in set(da) & set(db) if abs(da[k] - db[k]) > tol]
        if bad:
            out.append("スキン %s のウェイトの値が %d 個違う（例 %s: %r / %r）" % (key, len(bad), bad[0], da[bad[0]], db[bad[0]]))
    return out


def run(repeat: int = 2, selection_only: bool = False, out_path=None) -> dict:
    best = {}
    scenes = {}
    for fast in (False, True):
        for _ in range(max(1, repeat)):
            st = maya_scene.collect(selection_only, fast=fast)
            if fast not in best or st.timing["total"] < best[fast]["total"]:
                best[fast] = st.timing
                scenes[fast] = st
    diffs = diff_scenes(scenes[False], scenes[True])
    for fast in (False, True):
        for line in maya_scene.timing_lines(best[fast]):
            print(line)
    slow, quick = best[False]["total"], best[True]["total"]
    print("合計: 今の経路 %.2f 秒 → 速い経路 %.2f 秒（%.1f 倍）" % (slow, quick, slow / quick if quick else 0.0))
    print("結果は同じ" if not diffs else "違い:\n  " + "\n  ".join(diffs))
    result = {"slow": best[False], "fast": best[True], "diffs": diffs}
    out_path = out_path or os.path.join(tempfile.gettempdir(), "maya_collect_compare.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print("書き出しました: %s" % out_path)
    return result
