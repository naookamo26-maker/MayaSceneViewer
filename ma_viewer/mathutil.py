# -*- coding: utf-8 -*-
"""4x4 行列演算（純 Python）。

規約:
  * 行列は長さ 16 のフラットな list（行優先）。
  * Maya と同じ「行ベクトル」規約: 点 p は p' = p * M と変換する。
    平行移動は要素 [12], [13], [14] に入る。
  * この 16 要素の並びは three.js の Matrix4.fromArray()（列優先・列ベクトル）に
    そのまま渡すと同じ変換になる。

numpy に依存しないのは、Maya 同梱の Python でも追加インストールなしで動かすため。
"""
from __future__ import annotations

import math
from typing import List, Sequence

Mat = List[float]

ROTATE_ORDERS = ("xyz", "yzx", "zxy", "xzy", "yxz", "zyx")


def identity() -> Mat:
    return [1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0]


def mul(a: Sequence[float], b: Sequence[float]) -> Mat:
    """a * b（行ベクトル規約では a を先に適用）。"""
    r = [0.0] * 16
    for i in range(4):
        a0, a1, a2, a3 = a[i * 4], a[i * 4 + 1], a[i * 4 + 2], a[i * 4 + 3]
        for j in range(4):
            r[i * 4 + j] = a0 * b[j] + a1 * b[4 + j] + a2 * b[8 + j] + a3 * b[12 + j]
    return r


def mul_chain(*mats: Sequence[float]) -> Mat:
    r = identity()
    for m in mats:
        r = mul(r, m)
    return r


def translate(t: Sequence[float]) -> Mat:
    m = identity()
    m[12], m[13], m[14] = float(t[0]), float(t[1]), float(t[2])
    return m


def scale(s: Sequence[float]) -> Mat:
    m = identity()
    m[0], m[5], m[10] = float(s[0]), float(s[1]), float(s[2])
    return m


def shear(sh: Sequence[float]) -> Mat:
    """Maya の shear (xy, xz, yz)。"""
    m = identity()
    m[4] = float(sh[0])   # 行1 列0 : xy
    m[8] = float(sh[1])   # 行2 列0 : xz
    m[9] = float(sh[2])   # 行2 列1 : yz
    return m


def rot_x(a: float) -> Mat:
    c, s = math.cos(a), math.sin(a)
    return [1.0, 0.0, 0.0, 0.0,
            0.0, c, s, 0.0,
            0.0, -s, c, 0.0,
            0.0, 0.0, 0.0, 1.0]


def rot_y(a: float) -> Mat:
    c, s = math.cos(a), math.sin(a)
    return [c, 0.0, -s, 0.0,
            0.0, 1.0, 0.0, 0.0,
            s, 0.0, c, 0.0,
            0.0, 0.0, 0.0, 1.0]


def rot_z(a: float) -> Mat:
    c, s = math.cos(a), math.sin(a)
    return [c, s, 0.0, 0.0,
            -s, c, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0]


def euler(r: Sequence[float], order: str = "xyz") -> Mat:
    """ラジアンのオイラー角から回転行列を作る。

    Maya の回転順 "xyz" は X → Y → Z の順に適用されるため、
    行ベクトル規約では Rx * Ry * Rz になる。
    """
    rx, ry, rz = float(r[0]), float(r[1]), float(r[2])
    table = {"x": rot_x(rx), "y": rot_y(ry), "z": rot_z(rz)}
    m = identity()
    for axis in order:
        m = mul(m, table[axis])
    return m


def inverse(m: Sequence[float]) -> Mat:
    """一般 4x4 逆行列（部分ピボット付きガウス・ジョルダン法）。"""
    a = [list(m[i * 4:(i + 1) * 4]) + [1.0 if i == j else 0.0 for j in range(4)] for i in range(4)]
    for col in range(4):
        pivot = max(range(col, 4), key=lambda r: abs(a[r][col]))
        if abs(a[pivot][col]) < 1e-15:
            raise ValueError("逆行列が存在しません（特異行列）")
        a[col], a[pivot] = a[pivot], a[col]
        pv = a[col][col]
        row = a[col]
        for k in range(8):
            row[k] /= pv
        for r in range(4):
            if r != col:
                f = a[r][col]
                if f != 0.0:
                    rr = a[r]
                    for k in range(8):
                        rr[k] -= f * row[k]
    return [a[i][4 + j] for i in range(4) for j in range(4)]


def inverse_or_identity(m: Sequence[float]) -> Mat:
    try:
        return inverse(m)
    except ValueError:
        return identity()


def transform_point(p: Sequence[float], m: Sequence[float]) -> List[float]:
    x, y, z = float(p[0]), float(p[1]), float(p[2])
    return [x * m[0] + y * m[4] + z * m[8] + m[12],
            x * m[1] + y * m[5] + z * m[9] + m[13],
            x * m[2] + y * m[6] + z * m[10] + m[14]]


def position(m: Sequence[float]) -> List[float]:
    return [m[12], m[13], m[14]]


def is_close(a: Sequence[float], b: Sequence[float], tol: float = 1e-6) -> bool:
    return all(abs(x - y) <= tol for x, y in zip(a, b))


# ---------------------------------------------------------------------------
# Maya のノード行列
# ---------------------------------------------------------------------------

def _inverse_scale(ps) -> Mat:
    if ps is None:
        return identity()
    return scale((1.0 / ps[0] if ps[0] else 1.0,
                  1.0 / ps[1] if ps[1] else 1.0,
                  1.0 / ps[2] if ps[2] else 1.0))


def transform_matrix(t=(0, 0, 0), r=(0, 0, 0), s=(1, 1, 1), ro="xyz",
                     ra=(0, 0, 0), rp=(0, 0, 0), sp=(0, 0, 0),
                     rpt=(0, 0, 0), spt=(0, 0, 0), sh=(0, 0, 0), inverse_parent_scale=None) -> Mat:
    """transform ノードのローカル行列（角度はラジアン）。

    M = [-SP] [S] [SH] [SP] [SPT] [-RP] [RA] [R] [RP] [RPT] [IS] [T]
    IS は親のスケールを打ち消すとき（自作ノードの割り当てで指定）の「親のスケールの逆数」。ふつうは単位行列。
    """
    neg_sp = translate((-sp[0], -sp[1], -sp[2]))
    neg_rp = translate((-rp[0], -rp[1], -rp[2]))
    return mul_chain(neg_sp, scale(s), shear(sh), translate(sp), translate(spt),
                     neg_rp, euler(ra, "xyz"), euler(r, ro), translate(rp),
                     translate(rpt), _inverse_scale(inverse_parent_scale), translate(t))


def joint_matrix(t=(0, 0, 0), r=(0, 0, 0), s=(1, 1, 1), ro="xyz",
                 ra=(0, 0, 0), jo=(0, 0, 0), inverse_parent_scale=None) -> Mat:
    """joint ノードのローカル行列（角度はラジアン）。

    M = [S] [RA] [R] [JO] [IS] [T]
    IS は segmentScaleCompensate 有効時の「親ジョイントのスケールの逆数」。
    """
    return mul_chain(scale(s), euler(ra, "xyz"), euler(r, ro), euler(jo, "xyz"),
                     _inverse_scale(inverse_parent_scale), translate(t))


def xform_data_to_matrix(values: Sequence[float]) -> Mat:
    """`-type "matrix" "xform" ...` 形式（Maya の分解済みの変換。dagPose の .xm など）を行列に戻す。

    並び（角度はラジアン）:
      scale(3) rotate(3) rotateOrder(1) translate(3) shear(3)
      scalePivot(3) scalePivotTranslate(3) rotatePivot(3) rotatePivotTranslate(3)
      rotateAxis(四元数 4) jointOrient(四元数 4) inverseScale(3) [segmentScaleCompensate]
    後半は省略されることがあるので、存在する分だけ使う。

    M = [-SP][S][SH][SP][SPT][-RP][RA][R][JO][RP][RPT][IS][T]
    （ジョイントでは SP・RP が 0 なので、joint_matrix の [S][RA][R][JO][IS][T] と同じになる）
    """
    v = [float(x) for x in values]
    get = lambda i, n, d: v[i:i + n] if len(v) >= i + n else list(d)  # noqa: E731
    s = get(0, 3, (1, 1, 1))
    r = get(3, 3, (0, 0, 0))
    ro_i = int(v[6]) if len(v) > 6 else 0
    t = get(7, 3, (0, 0, 0))
    sh = get(10, 3, (0, 0, 0))
    sp = get(13, 3, (0, 0, 0))
    spt = get(16, 3, (0, 0, 0))
    rp = get(19, 3, (0, 0, 0))
    rpt = get(22, 3, (0, 0, 0))
    ra_m = quat_to_matrix(get(25, 4, (0, 0, 0, 1)))
    jo_m = quat_to_matrix(get(29, 4, (0, 0, 0, 1)))
    inv_s = get(33, 3, (1, 1, 1))
    is_m = scale([1.0 / x if x else 1.0 for x in inv_s])
    ro = ROTATE_ORDERS[ro_i] if 0 <= ro_i < 6 else "xyz"
    neg_sp = translate((-sp[0], -sp[1], -sp[2]))
    neg_rp = translate((-rp[0], -rp[1], -rp[2]))
    return mul_chain(neg_sp, scale(s), shear(sh), translate(sp), translate(spt),
                     neg_rp, ra_m, euler(r, ro), jo_m, translate(rp), translate(rpt), is_m, translate(t))


def matrix_to_quat(m: Sequence[float]) -> List[float]:
    """回転行列（行ベクトル規約）→ 四元数 [x, y, z, w]（テスト用）"""
    # 列ベクトル規約の行列 R は m の転置
    r00, r01, r02 = m[0], m[4], m[8]
    r10, r11, r12 = m[1], m[5], m[9]
    r20, r21, r22 = m[2], m[6], m[10]
    tr = r00 + r11 + r22
    if tr > 0:
        k = 0.5 / math.sqrt(tr + 1.0)
        return [(r21 - r12) * k, (r02 - r20) * k, (r10 - r01) * k, 0.25 / k]
    if r00 > r11 and r00 > r22:
        k = 2.0 * math.sqrt(1.0 + r00 - r11 - r22)
        return [0.25 * k, (r01 + r10) / k, (r02 + r20) / k, (r21 - r12) / k]
    if r11 > r22:
        k = 2.0 * math.sqrt(1.0 + r11 - r00 - r22)
        return [(r01 + r10) / k, 0.25 * k, (r12 + r21) / k, (r02 - r20) / k]
    k = 2.0 * math.sqrt(1.0 + r22 - r00 - r11)
    return [(r02 + r20) / k, (r12 + r21) / k, 0.25 * k, (r10 - r01) / k]


def quat_to_matrix(q: Sequence[float]) -> Mat:
    x, y, z, w = (float(c) for c in q)
    n = math.sqrt(x * x + y * y + z * z + w * w) or 1.0
    x, y, z, w = x / n, y / n, z / n, w / n
    # 行ベクトル規約（列ベクトル版の転置）
    return [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0.0,
            2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0.0,
            2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0.0,
            0.0, 0.0, 0.0, 1.0]
