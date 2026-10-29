# -*- coding: utf-8 -*-
"""NURBS カーブの計算: .cc の読み書き・評価・ノットの挿入・分割・向きの反転・作り直し（最小二乗のあてはめ）。

カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）の形を読み込み時に求めるのに使う。
ビューアがリグとして毎フレーム評価するときは web_src/src/curve.js の同じ名前の関数を使うので、手順をそろえること。

カーブは Curve（次数・形（0 開・1 閉・2 周期）・ノット（両端を補ったもの。CV 数 + 次数 + 1 個）・CV・重み）。
.cc はノットの両端を 1 つずつ省いて書く（ノット数 = スパン数 + 2·次数 − 1）。
"""
from __future__ import annotations

from typing import List, Optional, Sequence


class Curve:
    __slots__ = ("degree", "form", "knots", "cvs", "weights")

    def __init__(self, degree: int, form: int, knots: List[float], cvs: List[List[float]],
                 weights: Optional[List[float]] = None):
        self.degree = degree
        self.form = form
        self.knots = knots
        self.cvs = cvs
        self.weights = weights

    @property
    def domain(self):
        return self.knots[self.degree], self.knots[len(self.cvs)]


def from_cc(cc: Sequence[float]) -> Optional[Curve]:
    """.cc の値（[次数, スパン数, 形, 有理, 次元, ノット数, ノット…, CV 数, CV…]）からカーブ。読めなければ None"""
    try:
        i = 0
        degree = int(round(cc[i])); i += 2
        form = int(round(cc[i])); i += 1
        rational = int(round(cc[i])) == 1; i += 1
        dim = int(round(cc[i])); i += 1
        nk = int(round(cc[i])); i += 1
        knots = [float(x) for x in cc[i:i + nk]]; i += nk
        ncv = int(round(cc[i])); i += 1
        stride = dim + (1 if rational else 0)
        cvs, weights = [], []
        for k in range(ncv):
            o = i + k * stride
            cvs.append([float(cc[o]), float(cc[o + 1]), float(cc[o + 2]) if dim >= 3 else 0.0])
            weights.append(float(cc[o + dim]) if rational else 1.0)
    except (IndexError, ValueError, TypeError):
        return None
    if degree < 1 or len(cvs) < degree + 1 or len(knots) != len(cvs) + degree - 1:
        return None
    return Curve(degree, form, [knots[0]] + knots + [knots[-1]], cvs, weights if rational else None)


def to_cc(c: Curve) -> List[float]:
    """カーブを .cc の値にする（次元 3）"""
    knots = c.knots[1:-1]
    rational = c.weights is not None
    out = [float(c.degree), float(len(c.cvs) - c.degree), float(c.form), 1.0 if rational else 0.0, 3.0, float(len(knots))]
    out += [float(k) for k in knots] + [float(len(c.cvs))]
    for k, p in enumerate(c.cvs):
        out += [float(p[0]), float(p[1]), float(p[2])]
        if rational:
            out.append(float(c.weights[k]))
    return out


# ---------------------------------------------------------------------------
# 評価（The NURBS Book の FindSpan・BasisFuns・DersBasisFuns）

def find_span(knots: List[float], p: int, n: int, u: float) -> int:
    """u を含む区間 [knots[k], knots[k+1]) の k（p ≤ k ≤ n − 1。n は CV 数）"""
    if u >= knots[n]:
        k = n - 1
        while k > p and knots[k] >= knots[n]:
            k -= 1
        return k
    if u <= knots[p]:
        k = p
        while k < n - 1 and knots[k + 1] <= knots[p]:
            k += 1
        return k
    lo, hi = p, n
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if u < knots[mid]:
            hi = mid
        else:
            lo = mid
    return lo


def basis_ders(knots: List[float], p: int, k: int, u: float, nd: int) -> List[List[float]]:
    """区間 k の基底関数 N[k−p..k] とその nd 階までの導関数: ders[階][j]"""
    ndu = [[0.0] * (p + 1) for _ in range(p + 1)]
    left = [0.0] * (p + 1)
    right = [0.0] * (p + 1)
    ndu[0][0] = 1.0
    for j in range(1, p + 1):
        left[j] = u - knots[k + 1 - j]
        right[j] = knots[k + j] - u
        saved = 0.0
        for r in range(j):
            ndu[j][r] = right[r + 1] + left[j - r]
            tmp = ndu[r][j - 1] / ndu[j][r] if ndu[j][r] != 0 else 0.0
            ndu[r][j] = saved + right[r + 1] * tmp
            saved = left[j - r] * tmp
        ndu[j][j] = saved
    ders = [[0.0] * (p + 1) for _ in range(nd + 1)]
    for j in range(p + 1):
        ders[0][j] = ndu[j][p]
    for r in range(p + 1):
        s1, s2 = 0, 1
        a = [[0.0] * (p + 1) for _ in range(2)]
        a[0][0] = 1.0
        for kk in range(1, nd + 1):
            d = 0.0
            rk, pk = r - kk, p - kk
            if r >= kk:
                a[s2][0] = a[s1][0] / ndu[pk + 1][rk] if ndu[pk + 1][rk] != 0 else 0.0
                d = a[s2][0] * ndu[rk][pk]
            j1 = 1 if rk >= -1 else -rk
            j2 = kk - 1 if r - 1 <= pk else p - r
            for j in range(j1, j2 + 1):
                a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j] if ndu[pk + 1][rk + j] != 0 else 0.0
                d += a[s2][j] * ndu[rk + j][pk]
            if r <= pk:
                a[s2][kk] = -a[s1][kk - 1] / ndu[pk + 1][r] if ndu[pk + 1][r] != 0 else 0.0
                d += a[s2][kk] * ndu[r][pk]
            ders[kk][r] = d
            s1, s2 = s2, s1
    f = p
    for kk in range(1, nd + 1):
        for j in range(p + 1):
            ders[kk][j] *= f
        f *= p - kk
    return ders


def point_at(c: Curve, u: float) -> List[float]:
    p, n = c.degree, len(c.cvs)
    k = find_span(c.knots, p, n, u)
    N = basis_ders(c.knots, p, k, u, 0)[0]
    w = c.weights
    acc = [0.0, 0.0, 0.0, 0.0]
    for j in range(p + 1):
        i = k - p + j
        wi = w[i] if w else 1.0
        for a in range(3):
            acc[a] += N[j] * c.cvs[i][a] * wi
        acc[3] += N[j] * wi
    return [acc[0] / acc[3], acc[1] / acc[3], acc[2] / acc[3]]


def derivative_at(c: Curve, u: float) -> List[float]:
    """1 階の導関数（有理のカーブは差分）"""
    p, n = c.degree, len(c.cvs)
    if c.weights:
        a, b = c.domain
        h = (b - a) * 1e-6
        u0, u1 = max(a, u - h), min(b, u + h)
        p0, p1 = point_at(c, u0), point_at(c, u1)
        return [(p1[i] - p0[i]) / (u1 - u0) for i in range(3)]
    k = find_span(c.knots, p, n, u)
    d1 = basis_ders(c.knots, p, k, u, 1)[1]
    out = [0.0, 0.0, 0.0]
    for j in range(p + 1):
        for a in range(3):
            out[a] += d1[j] * c.cvs[k - p + j][a]
    return out


# ---------------------------------------------------------------------------
# 向きの反転・ノットの挿入・分割

def reverse(c: Curve) -> Curve:
    """向きを反転（パラメータの範囲は同じ。Maya の reverseCurve）"""
    lo, hi = c.knots[0], c.knots[-1]
    return Curve(c.degree, c.form, [lo + hi - k for k in reversed(c.knots)], [list(p) for p in reversed(c.cvs)],
                 list(reversed(c.weights)) if c.weights else None)


def _homog(c: Curve) -> List[List[float]]:
    w = c.weights or [1.0] * len(c.cvs)
    return [[p[0] * wi, p[1] * wi, p[2] * wi, wi] for p, wi in zip(c.cvs, w)]


def _from_homog(c: Curve, knots, H) -> Curve:
    rational = c.weights is not None
    cvs = [[h[0] / h[3], h[1] / h[3], h[2] / h[3]] for h in H]
    return Curve(c.degree, c.form, knots, cvs, [h[3] for h in H] if rational else None)


def insert_knot(c: Curve, u: float, times: int) -> Curve:
    """ノット u を times 回挿入（Boehm。形は変わらない）"""
    p = c.degree
    H = _homog(c)
    knots = list(c.knots)
    for _ in range(times):
        n = len(H)
        k = find_span(knots, p, n, u)
        new = []
        for i in range(n + 1):
            if i <= k - p:
                new.append(H[i])
            elif i > k:
                new.append(H[i - 1])
            else:
                den = knots[i + p] - knots[i]
                a = (u - knots[i]) / den if den != 0 else 0.0
                new.append([(1 - a) * H[i - 1][j] + a * H[i][j] for j in range(4)])
        H = new
        knots = knots[:k + 1] + [u] + knots[k + 1:]
    return _from_homog(c, knots, H)


def segment(c: Curve, a: float, b: float) -> Optional[Curve]:
    """パラメータ a〜b の部分（パラメータはそのまま。開いたカーブとして返す）。範囲がなければ None"""
    lo, hi = c.domain
    a, b = max(lo, min(hi, a)), max(lo, min(hi, b))
    if b - a <= 1e-12 * max(1.0, abs(hi - lo)):
        return None
    p = c.degree
    x = c
    for u in (a, b):
        if lo < u < hi:
            mult = sum(1 for k in x.knots if abs(k - u) <= 1e-12)
            if mult < p:
                x = insert_knot(x, u, p - mult)
    H = _homog(x)
    n = len(H)
    # a で始まる区間の最初の CV から、b で終わる区間の最後の CV まで
    first = find_span(x.knots, p, n, a) - p if a > lo else 0
    last = find_span(x.knots, p, n, b) if b < hi else n - 1
    if b < hi:
        while last > p and x.knots[last] >= b - 1e-12:
            last -= 1
    knots = [a] * (p + 1) + [k for k in x.knots[first + p + 1:last + 1] if a + 1e-12 < k < b - 1e-12] + [b] * (p + 1)
    cvs = H[first:last + 1]
    if len(knots) != len(cvs) + p + 1:
        return None
    return _from_homog(Curve(p, 0, [], [], x.weights), knots, cvs)


# ---------------------------------------------------------------------------
# 作り直し（rebuildCurve の uniform）

def uniform_knots(a: float, b: float, spans: int, degree: int, multiple_ends: bool) -> List[float]:
    """一様なノット（両端を補ったもの）。multiple_ends なら両端を次数 + 1 重にする（端の CV を通る）"""
    h = (b - a) / spans
    if multiple_ends:
        return [a] * (degree + 1) + [a + h * i for i in range(1, spans)] + [b] * (degree + 1)
    return [a + h * (j - degree) for j in range(spans + 2 * degree + 1)]


def _solve(G: List[List[float]], R: List[List[float]]) -> List[List[float]]:
    """G · X = R（部分ピボットのガウスの消去）。G は n×n、R は n×3"""
    n = len(G)
    A = [list(G[i]) + list(R[i]) for i in range(n)]
    m = len(R[0])
    for c in range(n):
        piv = max(range(c, n), key=lambda r: abs(A[r][c]))
        if abs(A[piv][c]) < 1e-300:
            continue
        A[c], A[piv] = A[piv], A[c]
        for r in range(n):
            if r != c and A[r][c] != 0:
                f = A[r][c] / A[c][c]
                for k in range(c, n + m):
                    A[r][k] -= f * A[c][k]
    return [[A[i][n + j] / A[i][i] if A[i][i] != 0 else 0.0 for j in range(m)] for i in range(n)]


def rebuild(c: Curve, spans: int, degree: int, keep_range: int = 1, multiple_ends: bool = True,
            keep_end_points: bool = True, keep_tangents: bool = True, keep_cvs: bool = False) -> Curve:
    """一様なノットで作り直す（Maya の rebuildCurve の uniform の近似）。

    keep_range: 0 = 0〜1、1 = 元のパラメータの範囲、2 = 0〜スパン数。keep_cvs なら CV はそのままでノットだけ一様に。
    それ以外は、元のカーブの点（元のパラメータで均等に取る）に最小二乗であてはめる。keep_end_points・keep_tangents は
    端の点・端の接線を重い重みの条件として加える（周期的なカーブは周期的なまま作り直す）
    """
    t0, t1 = c.domain
    periodic = c.form == 2
    if keep_cvs:
        degree = c.degree
        n_unique = len(c.cvs) - (c.degree if periodic else 0)
        spans = n_unique if periodic else len(c.cvs) - degree
    spans = max(1, int(spans))
    degree = max(1, int(degree))
    if periodic:
        spans = max(spans, degree)
    a, b = {0: (0.0, 1.0), 2: (0.0, float(spans))}.get(keep_range, (t0, t1))
    knots = uniform_knots(a, b, spans, degree, multiple_ends and not periodic)
    ncv = spans + degree
    if keep_cvs:
        cvs = [list(p) for p in c.cvs]
        return Curve(degree, c.form, knots, cvs, list(c.weights) if c.weights else None)
    n_free = spans if periodic else ncv                      # 周期的なら最後の degree 個は最初の CV と同じ
    col = (lambda i: i % spans) if periodic else (lambda i: i)
    rows, rhs, wts = [], [], []

    def add_row(u, order, target, w):
        k = find_span(knots, degree, ncv, u)
        D = basis_ders(knots, degree, k, u, order)[order]
        row = [0.0] * n_free
        for j in range(degree + 1):
            row[col(k - degree + j)] += D[j]
        rows.append(row)
        rhs.append(target)
        wts.append(w)

    m = max(10 * ncv, 100)
    to_new = (b - a) / (t1 - t0) if t1 != t0 else 1.0
    for s in range(m + 1):
        t = t0 + (t1 - t0) * s / m
        add_row(a + (t - t0) * to_new, 0, point_at(c, t), 1.0)
    if not periodic:
        W = 1e9
        if keep_end_points:
            add_row(a, 0, point_at(c, t0), W)
            add_row(b, 0, point_at(c, t1), W)
        if keep_tangents and degree > 1:
            add_row(a, 1, [x / to_new for x in derivative_at(c, t0)], W)
            add_row(b, 1, [x / to_new for x in derivative_at(c, t1)], W)
    G = [[0.0] * n_free for _ in range(n_free)]
    R = [[0.0] * 3 for _ in range(n_free)]
    for row, y, w in zip(rows, rhs, wts):
        nz = [i for i, v in enumerate(row) if v != 0]
        for i in nz:
            R[i] = [R[i][d] + w * row[i] * y[d] for d in range(3)]
            for j in nz:
                G[i][j] += w * row[i] * row[j]
    for i in range(n_free):
        G[i][i] += 1e-12                                      # CV に点がかからないときの退化を避ける
    X = _solve(G, R)
    cvs = [list(X[col(i)]) for i in range(ncv)]
    return Curve(degree, 2 if periodic else 0, knots, cvs, None)


def nearest_param(c: Curve, p: Sequence[float], samples: int = 0) -> float:
    """点 p にいちばん近いカーブ上のパラメータ（粗く探してから、前後の区間を黄金分割で詰める）"""
    a, b = c.domain
    n = samples or max(64, 16 * (len(c.cvs) - c.degree))

    def dist2(u):
        q = point_at(c, u)
        return sum((q[i] - p[i]) ** 2 for i in range(3))
    best, k = min((dist2(a + (b - a) * s / n), s) for s in range(n + 1))
    lo, hi = a + (b - a) * max(0, k - 1) / n, a + (b - a) * min(n, k + 1) / n
    g = (5 ** 0.5 - 1) / 2
    x1, x2 = hi - g * (hi - lo), lo + g * (hi - lo)
    f1, f2 = dist2(x1), dist2(x2)
    for _ in range(80):
        if f1 <= f2:
            hi, x2, f2 = x2, x1, f1
            x1 = hi - g * (hi - lo)
            f1 = dist2(x1)
        else:
            lo, x1, f1 = x1, x2, f2
            x2 = lo + g * (hi - lo)
            f2 = dist2(x2)
    return (lo + hi) / 2
