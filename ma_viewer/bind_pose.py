# -*- coding: utf-8 -*-
"""バインドポーズの選び方（.ma のパーサと Maya 内の書き出しで共通）。

同じジョイントが複数の skinCluster（またはバインドポーズの dagPose）に入っていて、バインド時の行列が
食い違うことがある（あとから別のメッシュをバインドし直した・ジョイントを動かしてからバインドしたなど。
Maya の「バインドポーズに移動」がエラーになる状態）。ビューアの「バインドポーズ」の姿勢は 1 つしか
選べないので、同じ行列ごとにまとめ、重み（そのバインドで動く頂点の数）の合計がいちばん大きいものを使う。
"""
from __future__ import annotations

from typing import List, Optional, Sequence, Tuple

# 同じ行列とみなす差（回転・スケールの成分はそのまま、移動の成分は (1 + 大きさ) 倍まで）
ROT_TOL = 1e-3
POS_TOL = 1e-3


def same_matrix(a: Sequence[float], b: Sequence[float]) -> bool:
    for k in range(16):
        if k in (12, 13, 14):
            tol = POS_TOL * (1.0 + max(abs(a[k]), abs(b[k])))
        else:
            tol = ROT_TOL
        if abs(a[k] - b[k]) > tol:
            return False
    return True


def choose(cands: List[Tuple[str, Sequence[float], float]]) -> Tuple[Optional[Sequence[float]], List[str], List[List[str]]]:
    """候補 [(情報源の名前, ワールド行列, 重み)] → (使う行列, その行列の情報源, 使わなかった行列ごとの情報源)。
    重みの合計が同じなら、先に出てきたもの"""
    groups: List[list] = []                     # [行列, 情報源の一覧, 重みの合計, 最初の順番]
    for i, (label, m, w) in enumerate(cands):
        for g in groups:
            if same_matrix(g[0], m):
                if label not in g[1]:
                    g[1].append(label)
                g[2] += w
                break
        else:
            groups.append([m, [label], w, i])
    if not groups:
        return None, [], []
    groups.sort(key=lambda g: (-g[2], g[3]))
    return groups[0][0], groups[0][1], [g[1] for g in groups[1:]]


def conflict_warning(conflicts: List[Tuple[str, List[str], List[List[str]]]], what: str = "skinCluster") -> Optional[str]:
    """食い違い [(ノード名, 使った情報源, 使わなかった情報源の組)] → 警告の文（なければ None）"""
    if not conflicts:
        return None
    ex = []
    for name, used, others in conflicts[:3]:
        ex.append("%s（%s を使用。%s は別の姿勢）" % (name, "・".join(used), " / ".join("・".join(o) for o in others)))
    more = " ほか %d 個" % (len(conflicts) - 3) if len(conflicts) > 3 else ""
    return ("バインドポーズが複数あります: %d 個のノードで、%s ごとにバインド時の姿勢が違います。例: %s%s。"
            "動かす頂点の多い側をバインドポーズとして表示します。ほかの側でバインドしたメッシュは、"
            "バインドポーズの表示で元の形からずれます（変形の計算はメッシュごとの値を使うので、ファイルの値・アニメーションの"
            "表示には影響しません）。" % (len(conflicts), what, "、".join(ex), more))
