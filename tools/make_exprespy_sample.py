# -*- coding: utf-8 -*-
"""exprespy（Python で式を書くノード）の評価の検証用サンプルを生成する。

  python tools/make_exprespy_sample.py
    → samples/exprespy_sample.ma（exprespy ノードを使うシーン）、
      samples/exprespy_sample.json（書き出した共通 JSON。web_src/tests/exprespy.test.mjs が読む）

再生範囲 1〜24。src.tx にキー（1: -3 → 24: 3）、src.rz にキー（1: 0 → 24: 90 度）、upv.ty にキー（1: 4 → 24: -2）。
コンストレイントの 4 つ（posCnsEx・oriCnsEx・aimCnsEx・aimUpCnsEx）のコードは exprespy の同梱サンプル
examples/constraints.ma（MIT License, Copyright (c) 2016 Ryusuke Sasaki）のもの。動かす先は表示されるように
ジョイントにし、回転順を変えて（oriCnst は zxy、aimCnst は yzx）回転順の入力も確かめる。
  * posCnsEx: posCnst の回転のピボットのワールドの位置 = src のピボットのワールドの位置 + 親の空間の offsetTranslate
  * oriCnsEx: oriCnst のワールドの回転 = src のワールドの回転
  * aimCnsEx: aimCnst の Y 軸が src のピボットを向く（親の空間で求める）
  * aimUpCnsEx: aimUpCnst の回転（親の回転を打ち消さない。サンプルのとおり）の Y 軸がワールドで src を向き、
      Z 軸は upv への向きと直交し、X 軸は upv の側
  * timeEx: IN[0] ← time1.o（秒）、IN[1] = 3（接続のない入力の値）→ jT.ty = sin(2 · 秒) · 3
  * chainA → chainB: chainA の OUT[0] = src.t · 2（MVector）→ chainB の IN[0] → 長さ → jC.tx = 2 · |src.t|
      （import の別名 from maya.api.OpenMaya import MVector as V も確かめる）
  * quatEx: MQuaternion(角度, 軸) と asEulerRotation → jQ.r = (0, 0, src.rz)
  * limitEx: 既定値つきの引数（def limit(val, max=None)）と None の判定 → jL.t = (max(tx, 0), max(-tx, 0),
      0〜1.5 に収めた tx)
  * pyEx: ループの展開・try / except KeyError・内包表記・分解代入・while → jP.t = (tx + 5, 2 · tx + 16, 2 - tx)、
      jP2.tx = 9（300 を 1 以下になるまで半分にする回数）
  * pyEx2: 実行時に決まる IN[i]・OUT[i]・展開したループの実行時の break・ループの中の return・辞書・定数の
      文字列 → jR.t = (tx > 0 なら 10 · tx + 2、でなければ tx + 2, tx + 2, tx > 2.5 なら 0、でなければ 2)、
      jR2.t = (tx ≥ 3 なら 0、でなければ tx + 2, 7, 0)
  * pyEx3: クラス（属性のリスト・メソッドの中の実行時の if）・リストの append・except（ZeroDivisionError・
      ValueError）・実行時の深さの再帰 → jS.t = (2 · max(tx, 0) + 8, -5, tx < 0 なら -1、でなければ √tx)、
      jS2.t = (30, 2 · tx + 5, 0)
  * aliasEx: クラスの別名（V = api.MVector）・min / max と同じ名前の引数と既定値・式の中の setValue と四元数の exp
      → jF.t = (k, 0.5 + 0.5 · k, 1)（k は tx / 2 を 0〜1 に収めた値）、jF.r = exp((0.2 · k, 0.2, 0.1, 0)) の回転
  * badCmds（maya.cmds の呼び出し）・badMesh（メッシュの形状の入力）: 解析できない（警告を出し、評価しない）

samples/exprespy_bendroll_sample.ma・.json: exprespy の同梱サンプル examples/bend_roll.ma（MIT License,
Copyright (c) 2016 Ryusuke Sasaki）のコード（if not COUNT: の初期化・def・lambda・IN.get・四元数の log・exp）。
src の回転にキー（rx 10 → -50・ry 20 → 70・rz -30 → 40 度、回転順 xzy）。src の回転を、曲げ（bend）とひねり（roll）に
分けて（decomposeRotExpr）組み立て直す（composeRotExpr）:
  * チェーン 1: bend1（曲げ）→ 子の roll1（ひねり）。roll1 のワールドの回転 = src の回転
  * チェーン 2: roll2（ひねり）→ 子の bend2（曲げ。reverseOrder）。bend2 のワールドの回転 = src の回転
  * チェーン 3（method = 1、指数写像）: roll3.rx = src の回転ベクトルの X 成分、bend3 = exp(回転ベクトルの Y・Z 成分)
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_MA = os.path.join(ROOT, "samples", "exprespy_sample.ma")
OUT_JSON = os.path.join(ROOT, "samples", "exprespy_sample.json")
OUT_BR_MA = os.path.join(ROOT, "samples", "exprespy_bendroll_sample.ma")
OUT_BR_JSON = os.path.join(ROOT, "samples", "exprespy_bendroll_sample.json")

# exprespy の examples/constraints.ma のコード（MIT License, Copyright (c) 2016 Ryusuke Sasaki）
POS = ("pos = api.MPoint(IN[0] + IN[1] + IN[2])\npos *= IN[3]\npos *= IN[4]\npos -= IN[5] + IN[6]\npos += IN[7]\n"
       "OUT[0] = pos")
ORI = ("m = api.MEulerRotation(IN[0], IN[1]).asMatrix()\nm *= IN[2]\nm *= IN[3]\n"
       "r = api.MTransformationMatrix(m).rotation(False)\nr.reorderIt(IN[4])\nOUT[0] = r\n")
AIM = ("aim0 = api.MVector.kYaxisVector\n\npos = api.MPoint(IN[0] + IN[1] + IN[2])\npos *= IN[3]\npos *= IN[4]\n"
       "aim1 = pos - api.MPoint(IN[5] + IN[6] + IN[7])\nq = api.MQuaternion(aim0, aim1)\n"
       "r = api.MEulerRotation([0., 0., 0.], IN[8])\nr.setValue(q)\nOUT[0] = r")
AIM_UP = ("aim0 = api.MVector.kYaxisVector\nupv0 = api.MVector.kXaxisVector\ncrs0 = aim0 ^ upv0\n\n"
          "srcP = api.MPoint(IN[0] + IN[1] + IN[2])\nsrcP *= IN[3]\nupvP = api.MPoint(IN[4] + IN[5] + IN[6])\n"
          "upvP *= IN[7]\ndstP = api.MPoint(IN[8] + IN[9] + IN[10])\ndstP *= IN[11]\n\n"
          "aim1 = (srcP - dstP).normalize()\nupv1 = upvP - dstP\ncrs1 = (aim1 ^ upv1).normalize()\nupv1 = crs1 ^ aim1\n\n"
          "m = api.MMatrix([\n    aim0.x, upv0.x, crs0.x, 0.,\n    aim0.y, upv0.y, crs0.y, 0.,\n"
          "    aim0.z, upv0.z, crs0.z, 0.,\n    0., 0., 0., 1.])\nm *= api.MMatrix([\n    aim1.x, aim1.y, aim1.z, 0.,\n"
          "    upv1.x, upv1.y, upv1.z, 0.,\n    crs1.x, crs1.y, crs1.z, 0.,\n    0., 0., 0., 1.])\n"
          "r = api.MEulerRotation([0., 0., 0.], IN[12])\nr.setValue(m)\nOUT[0] = r\n")
# exprespy の examples/bend_roll.ma のコード（MIT License, Copyright (c) 2016 Ryusuke Sasaki）
COMPOSE_ROT = """if not COUNT:
    from maya.api.OpenMaya import (
        MVector, MQuaternion, MEulerRotation,
    )
    from math import sin, cos, tan

    AT_ROLL = 0
    AT_BENDH = 1
    AT_BENDV = 2
    AT_AXIS_ORIENT = 3
    AT_ROTATE_ORDER = 4
    METHOD = 10
    AT_REVERSE_ORDER = 11

    ZERO3 = (0., 0., 0.)
    _X_VEC = MVector.kXaxisVector
    _Y_VEC = MVector.kYaxisVector
    _Z_VEC = MVector.kZaxisVector

    def fromRollBendHV(rhv):
        half = .5 * rhv[0]
        f = sin(half)
        quat = MQuaternion(_X_VEC[0] * f, _X_VEC[1] * f, _X_VEC[2] * f, cos(half))

        h = tan(-.5 * rhv[1])
        v = tan(.5 * rhv[2])
        f = 2. / (h * h + v * v + 1.)
        quat *= MQuaternion(_X_VEC, _X_VEC * (f - 1.) + _Y_VEC * (v * f) + _Z_VEC * (h * f))
        return quat

rhv = IN.get(AT_ROLL, 0.), IN.get(AT_BENDH, 0.), IN.get(AT_BENDV, 0.)

reverse = IN.get(AT_REVERSE_ORDER, 0)
if reverse:
    rhv = (-rhv[0], -rhv[1], -rhv[2])
if IN.get(METHOD, 0):
    quat = MQuaternion(rhv[0] * .5, rhv[1] * .5, rhv[2] * .5, 0.).exp()
else:
    quat = fromRollBendHV(rhv)
if reverse:
    quat = quat.inverse()

oriQ = MEulerRotation(IN.get(AT_AXIS_ORIENT, ZERO3)).asQuaternion()
quat = oriQ.inverse() * quat
quat *= oriQ

rot = MEulerRotation(ZERO3, IN.get(AT_ROTATE_ORDER, 0))
rot.setValue(quat)

OUT[0] = rot
"""
DECOMPOSE_ROT = """if not COUNT:
    from maya.api.OpenMaya import (
        MVector, MQuaternion, MEulerRotation,
    )
    from math import atan2, pi as _PI

    AT_ROTATE = 0
    AT_ROTATE_ORDER = 1
    AT_AXIS_ORIENT = 2
    METHOD = 10
    AT_REVERSE_ORDER = 11

    ZERO3 = (0., 0., 0.)
    _X_VEC = MVector.kXaxisVector
    _Y_VEC = MVector.kYaxisVector
    _Z_VEC = MVector.kZaxisVector

    _2PI = 2. * _PI
    boundAngle = lambda x: (x - _2PI) if x > _PI else ((x + _2PI) if x < -_PI else x)

    def toRollBendHV(quat):
        vec = _X_VEC.rotateBy(quat)
        bendQ = MQuaternion(_X_VEC, vec)
        b = (_X_VEC * vec) + 1.

        rollQ = quat * bendQ.inverse()
        return (
            boundAngle(atan2(rollQ[0], rollQ[3]) * 2.),
            atan2(_Z_VEC * vec, b) * -2.,
            atan2(_Y_VEC * vec, b) * 2.,
        )

quat = MEulerRotation(IN.get(AT_AXIS_ORIENT, ZERO3)).asQuaternion()
oriQ = quat.inverse()
quat *= MEulerRotation(IN.get(AT_ROTATE, ZERO3), IN.get(AT_ROTATE_ORDER, 0)).asQuaternion()
quat *= oriQ

reverse = IN.get(AT_REVERSE_ORDER, 0)
if reverse:
    quat = quat.inverse()
if IN.get(METHOD, 0):
    rhv = quat.log()
    rhv = (rhv[0] * 2., rhv[1] * 2., rhv[2] * 2.)
else:
    rhv = toRollBendHV(quat)
if reverse:
    rhv = (-rhv[0], -rhv[1], -rhv[2])

OUT[0] = rhv[0]
OUT[1] = rhv[1]
OUT[2] = rhv[2]
"""
TIME = "OUT[0] = math.sin(IN[0] * 2.0) * IN[1]"
CHAIN_A = "from maya.api.OpenMaya import MVector as V\nOUT[0] = V(IN[0]) * 2.0"
CHAIN_B = "v = IN[0]\nOUT[0] = v.length()"
QUAT = "q = api.MQuaternion(IN[0], api.MVector(0, 0, 1))\nOUT[0] = q.asEulerRotation()"
# 既定値つきの引数・None の判定・日本語のコメント（実際のリグのコードと同じ形）
LIMIT = ("if not COUNT:\n    # 0 未満は 0、max があれば max まで\n    def limit(val, max=None):\n"
         "        if val < 0: return 0\n        if max is not None and val > max: return max\n        return val\n"
         "# 右目スケール\nOUT[0] = limit(IN[0])\nOUT[1] = limit(IN[0] * -1)\nOUT[2] = limit(IN[0], max=1.5)")
# ループの展開・try / except KeyError・内包表記・分解代入・while（IN[0] ← src.tx、IN[1] = 2・IN[2] = 3）
PY = ("s = 0\nfor i in range(3):\n    s += IN[i]\nOUT[0] = s\n"
      "try:\n    extra = IN[9]\nexcept KeyError:\n    extra = 10\n"
      "OUT[1] = extra + sum(IN[i] * 2 for i in range(3) if i != 1)\n"
      "a, b = IN[0], IN[1]\na, b = b, a\nOUT[2] = a - b\n"
      "n = 0\nx = IN[2] * 100\nwhile x > 1:\n    x /= 2\n    n += 1\nOUT[3] = n if 2 in (1, 2) else -1")
# 実行時に決まる IN[i]・OUT[i]・展開したループの実行時の break・ループの中の return・辞書・定数の文字列
# （IN[0] ← src.tx、IN[1] = 2・IN[2] = 3・IN[5] = 2）
PY2 = ("d = {'a': IN[0], 'b': 2}\nif IN[0] > 0:\n    d['a'] = IN[0] * 10\n"
       "s = 0\nfor i in range(int(IN[5])):\n    s += IN[i]\n"
       "def first_over(n):\n    for i in range(3):\n        if IN[i] > n:\n            return i\n    return -1\n"
       "side = 'L'\nOUT[0] = d['a'] + d['b']\nOUT[1] = s\nOUT[2] = first_over(2.5) if side == 'L' else 0\n"
       "t = 0\nfor i in range(3):\n    if IN[i] >= 3:\n        break\n    t += IN[i]\nOUT[3] = t\n"
       "OUT[int(IN[5]) + 2] = 7.0")
# クラス・リストの append・except（ZeroDivisionError・ValueError）・再帰
# （IN[0] ← src.tx、IN[1] = 2・IN[2] = 0.5）
PY3 = ("class Acc(object):\n    SCALE = 2.0\n    def __init__(self):\n        self.total = 0\n        self.items = []\n"
       "    def add(self, x):\n        if x > 0:\n            self.total += x * self.SCALE\n        self.items.append(x)\n"
       "acc = Acc()\nfor i in range(3):\n    acc.add(IN[i])\nOUT[0] = acc.total + len(acc.items)\n"
       "try:\n    r = 1 / (IN[1] - 2)\nexcept ZeroDivisionError:\n    r = -5\nOUT[1] = r\n"
       "try:\n    q = math.sqrt(IN[0])\nexcept ValueError:\n    q = -1\nOUT[2] = q\n"
       "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n"
       "OUT[3] = fact(int(IN[1]) + 1) + fact(4)\n"
       "vals = []\nfor i in range(3):\n    vals.append(IN[i] * 2)\nOUT[4] = sum(vals)")
# クラスの別名・組み込みと同じ名前の引数・式の中の setValue を使うコード（よくある書き方を組み合わせた例）
# （IN[0] ← src.tx、IN[1] = 0.5・IN[2] = 0.2）
ALIAS = ("if not COUNT:\n    V = api.MVector\n    E = api.MEulerRotation\n    Q = api.MQuaternion\n"
         "def remap01(v, min, max, clamp_low=False, clamp_high=False):\n"
         "    t = (v - min) / (max - min)\n    if clamp_low and t < 0:\n        return 0\n"
         "    if clamp_high and t > 1:\n        return 1\n    return t\n"
         "k = remap01(IN[0], 0.0, 2.0, True, True)\n"
         "OUT[0] = V(k, IN[1] + 0.5 * k, 1.0)\n"
         "ax = 0.2 * k\nay = IN[2]\naz = 0.1\n"
         "OUT[1] = E().setValue(Q(ax, ay, az, 0).exp())")
BAD_CMDS = 'OUT[0] = cmds.getAttr("src.tx")'
BAD_MESH = "OUT[0] = IN[0]"


def ma_string(code: str) -> str:
    return '"%s"' % code.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def exprespy(name: str, code: str, n_inputs: int = 0, extra=()):
    out = ['createNode exprespy -n "%s";' % name, '\tsetAttr ".cd" -type "string" %s;' % ma_string(code)]
    out += list(extra)
    if n_inputs:
        out.append('\tsetAttr -s %d ".i";' % n_inputs)
    return out


def rot_node(name: str, code: str, method: int, reverse: bool, values=()):
    """bend_roll.ma と同じ exprespy（独自の属性 method・reverseOrder を自分の入力 i[10]・i[11] につなぐ）"""
    out = ['createNode exprespy -n "%s";' % name,
           '\taddAttr -ci true -sn "method" -ln "method" -min 0 -max 1 '
           '-en "Stereographic Projection:Exponential Map" -at "enum";',
           '\taddAttr -ci true -sn "reverseOrder" -ln "reverseOrder" -min 0 -max 1 -at "bool";',
           '\tsetAttr ".cd" -type "string" %s;' % ma_string(code)]
    out += ['\tsetAttr ".i[%d]" %s;' % kv for kv in values]
    if method:
        out.append('\tsetAttr ".method" %d;' % method)
    if reverse:
        out.append('\tsetAttr ".reverseOrder" yes;')
    return out


def bend_roll_scene():
    lines = ['//Maya ASCII 2024 scene', '//Name: exprespy_bendroll_sample.ma',
             'requires maya "2024";', 'requires "exprespy" "3.0.1.20220627";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode joint -n "src";', '\tsetAttr ".ro" 3;',
             'createNode joint -n "srcEnd" -p "src";', '\tsetAttr ".t" -type "double3" 5 0 0 ;',
             'createNode joint -n "bend1";', '\tsetAttr ".t" -type "double3" 0 0 2 ;',
             'createNode joint -n "roll1" -p "bend1";', '\tsetAttr ".t" -type "double3" 2 0 0 ;',
             'createNode joint -n "end1" -p "roll1";', '\tsetAttr ".t" -type "double3" 3 0 0 ;',
             'createNode joint -n "roll2";', '\tsetAttr ".t" -type "double3" 0 0 4 ;',
             'createNode joint -n "bend2" -p "roll2";',
             'createNode joint -n "end2" -p "bend2";', '\tsetAttr ".t" -type "double3" 5 0 0 ;',
             'createNode joint -n "roll3";', '\tsetAttr ".t" -type "double3" 0 0 6 ;',
             'createNode joint -n "bend3";', '\tsetAttr ".t" -type "double3" 0 0 8 ;']
    z3 = ("-type \"double3\" 0 0 0 ",)
    lines += rot_node("decomposeRotExpr", DECOMPOSE_ROT, 0, False, [(2, z3[0])])
    lines += rot_node("composeRotExpr", COMPOSE_ROT, 0, True, [(0, "0"), (3, z3[0])])
    lines += rot_node("composeRotExpr1", COMPOSE_ROT, 0, False, [(1, "0"), (2, "0"), (3, z3[0])])
    lines += rot_node("decomposeRotExpr1", DECOMPOSE_ROT, 0, True, [(2, z3[0])])
    lines += rot_node("composeRotExpr2", COMPOSE_ROT, 0, True, [(1, "0"), (2, "0"), (3, z3[0])])
    lines += rot_node("composeRotExpr3", COMPOSE_ROT, 0, False, [(0, "0"), (3, z3[0])])
    lines += rot_node("decomposeRotExpr2", DECOMPOSE_ROT, 1, False, [(2, z3[0])])
    lines += rot_node("composeRotExpr4", COMPOSE_ROT, 1, False, [(1, "0"), (2, "0"), (3, z3[0])])
    lines += rot_node("composeRotExpr5", COMPOSE_ROT, 1, False, [(0, "0"), (3, z3[0])])
    for axis, (a, b) in zip("XYZ", ((10, -50), (20, 70), (-30, 40))):
        lines += ['createNode animCurveTA -n "src_rotate%s";' % axis, '\tsetAttr ".tan" 2;',
                  '\tsetAttr -s 2 ".ktv[0:1]"  1 %d 24 %d;' % (a, b)]
    lines += ['createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;']
    lines += ['connectAttr "src_rotate%s.o" "src.r%s";' % (a, a.lower()) for a in "XYZ"]
    for name in ("decomposeRotExpr", "decomposeRotExpr1", "decomposeRotExpr2"):
        lines += ['connectAttr "src.r" "%s.i[0]";' % name, 'connectAttr "src.ro" "%s.i[1]";' % name]
    links = [("decomposeRotExpr", 1, "composeRotExpr", 1), ("decomposeRotExpr", 2, "composeRotExpr", 2),
             ("decomposeRotExpr", 0, "composeRotExpr1", 0), ("decomposeRotExpr1", 0, "composeRotExpr2", 0),
             ("decomposeRotExpr1", 1, "composeRotExpr3", 1), ("decomposeRotExpr1", 2, "composeRotExpr3", 2),
             ("decomposeRotExpr2", 0, "composeRotExpr4", 0), ("decomposeRotExpr2", 1, "composeRotExpr5", 1),
             ("decomposeRotExpr2", 2, "composeRotExpr5", 2)]
    lines += ['connectAttr "%s.o[%d]" "%s.i[%d]";' % x for x in links]
    for node, joint in (("composeRotExpr", "bend1"), ("composeRotExpr1", "roll1"), ("composeRotExpr2", "roll2"),
                        ("composeRotExpr3", "bend2"), ("composeRotExpr4", "roll3"), ("composeRotExpr5", "bend3")):
        lines += ['connectAttr "%s.o[0]" "%s.r";' % (node, joint), 'connectAttr "%s.ro" "%s.i[4]";' % (joint, node)]
    for name in ("decomposeRotExpr", "decomposeRotExpr1", "decomposeRotExpr2", "composeRotExpr", "composeRotExpr1",
                 "composeRotExpr2", "composeRotExpr3", "composeRotExpr4", "composeRotExpr5"):
        lines += ['connectAttr "%s.method" "%s.i[10]";' % (name, name),
                  'connectAttr "%s.reverseOrder" "%s.i[11]";' % (name, name)]
    lines.append('// End of exprespy_bendroll_sample.ma')
    return lines


def write_scene(lines, ma_path, json_path):
    with open(ma_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")
    print("書き出しました: %s" % ma_path)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(ma_path, animation=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s" % json_path)
    for w in scene.get("warnings", []) + (scene.get("animation") or {}).get("warnings", []):
        print("  警告: %s" % w)


def main():
    sys.path.insert(0, ROOT)
    lines = ['//Maya ASCII 2024 scene', '//Name: exprespy_sample.ma',
             'requires maya "2024";', 'requires "exprespy" "3.0.1.20220627";',
             'currentUnit -l centimeter -a degree -t film;',
             'createNode transform -n "srcParent";',
             '\tsetAttr ".t" -type "double3" -3.6209579737102082 -3.1508840554772384 1.8125463956988654 ;',
             '\tsetAttr ".r" -type "double3" 15.490065918518804 -8.671869650868171 -6.277893053908751 ;',
             'createNode transform -n "src" -p "srcParent";',
             '\tsetAttr ".t" -type "double3" -3.2190597336731517 7.1788784606446043 0.14298142548498544 ;',
             '\tsetAttr ".rp" -type "double3" 0.5 0.25 0 ;',
             '\tsetAttr ".rpt" -type "double3" 0 0.1 0.2 ;',
             'createNode locator -n "srcShape" -p "src";',
             'createNode transform -n "upv" -p "srcParent";',
             '\tsetAttr ".t" -type "double3" 3.9174512548878866 3.6918112123901938 1.3617678712437644 ;',
             'createNode locator -n "upvShape" -p "upv";',
             'createNode transform -n "dstParent";',
             '\tsetAttr ".t" -type "double3" -1.1007985577832899 0 -1.8906596441557157 ;',
             '\tsetAttr ".r" -type "double3" 7.0126736345998344 1.3546184852554239 -7.0084559661012937 ;',
             'createNode joint -n "posCnst" -p "dstParent";',
             '\taddAttr -ci true -k true -sn "offsetTranslate" -ln "offsetTranslate" -at "double3" -nc 3;',
             '\taddAttr -ci true -k true -sn "offsetTranslateX" -ln "offsetTranslateX" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\taddAttr -ci true -k true -sn "offsetTranslateY" -ln "offsetTranslateY" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\taddAttr -ci true -k true -sn "offsetTranslateZ" -ln "offsetTranslateZ" -at "doubleLinear" '
             '-p "offsetTranslate";',
             '\tsetAttr -k on ".offsetTranslate" -type "double3" 0 0 -3 ;',
             'createNode joint -n "oriCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 0 4.7832902674640021 0 ;',
             '\tsetAttr ".ro" 2;',
             'createNode joint -n "aimCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 2 -1 0.5 ;',
             '\tsetAttr ".ro" 1;',
             'createNode joint -n "aimUpCnst" -p "dstParent";',
             '\tsetAttr ".t" -type "double3" 1.0109907869246533 0.5560976078619172 3.4206445512302697 ;']
    for name in ("jT", "jC", "jQ", "jX", "jM", "jL", "jP", "jP2", "jR", "jR2", "jS", "jS2", "jF"):
        lines.append('createNode joint -n "%s";' % name)
    lines += ['createNode transform -n "box";', 'createNode mesh -n "boxShape" -p "box";']
    lines += exprespy("posCnsEx", POS, 8)
    lines += exprespy("oriCnsEx", ORI, 5)
    lines += exprespy("aimCnsEx", AIM, 9)
    lines += exprespy("aimUpCnsEx", AIM_UP, 13)
    lines += exprespy("timeEx", TIME, 2, ['\tsetAttr ".i[1]" 3;'])
    lines += exprespy("chainA", CHAIN_A, 1)
    lines += exprespy("chainB", CHAIN_B, 1)
    lines += exprespy("quatEx", QUAT, 1)
    lines += exprespy("limitEx", LIMIT, 1)
    lines += exprespy("pyEx", PY, 3, ['\tsetAttr ".i[1]" 2;', '\tsetAttr ".i[2]" 3;'])
    lines += exprespy("pyEx2", PY2, 6, ['\tsetAttr ".i[1]" 2;', '\tsetAttr ".i[2]" 3;', '\tsetAttr ".i[5]" 2;'])
    lines += exprespy("pyEx3", PY3, 3, ['\tsetAttr ".i[1]" 2;', '\tsetAttr ".i[2]" 0.5;'])
    lines += exprespy("aliasEx", ALIAS, 3, ['\tsetAttr ".i[1]" 0.5;', '\tsetAttr ".i[2]" 0.2;'])
    lines += exprespy("badCmds", BAD_CMDS)
    lines += exprespy("badMesh", BAD_MESH, 1)
    lines += ['createNode animCurveTL -n "src_translateX";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 -3 24 3;',
              'createNode animCurveTA -n "src_rotateZ";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 90;',
              'createNode animCurveTL -n "upv_translateY";', '\tsetAttr ".tan" 2;',
              '\tsetAttr -s 2 ".ktv[0:1]"  1 4 24 -2;',
              'createNode script -n "sceneConfigurationScriptNode";',
              '\tsetAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";',
              '\tsetAttr ".st" 6;',
              'select -ne :time1;', '\tsetAttr ".o" 1;',
              'connectAttr "src_translateX.o" "src.tx";',
              'connectAttr "src_rotateZ.o" "src.rz";',
              'connectAttr "upv_translateY.o" "upv.ty";',
              'connectAttr "posCnsEx.o[0]" "posCnst.t";',
              'connectAttr "oriCnsEx.o[0]" "oriCnst.r";',
              'connectAttr "aimCnsEx.o[0]" "aimCnst.r";',
              'connectAttr "aimUpCnsEx.o[0]" "aimUpCnst.r";']
    ins = {
        "posCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "posCnst.pim", "posCnst.rp", "posCnst.rpt",
                     "posCnst.offsetTranslate"],
        "oriCnsEx": ["src.r", "src.ro", "src.pm", "oriCnst.pim", "oriCnst.ro"],
        "aimCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "aimCnst.pim", "aimCnst.t", "aimCnst.rp", "aimCnst.rpt",
                     "aimCnst.ro"],
        "aimUpCnsEx": ["src.t", "src.rp", "src.rpt", "src.pm", "upv.t", "upv.rp", "upv.rpt", "upv.pm", "aimUpCnst.t",
                       "aimUpCnst.rp", "aimUpCnst.rpt", "aimUpCnst.pm", "aimUpCnst.ro"],
    }
    for node, plugs in ins.items():
        for k, p in enumerate(plugs):
            lines.append('connectAttr "%s" "%s.i[%d]";' % (p, node, k))
    lines += ['connectAttr ":time1.o" "timeEx.i[0]";',
              'connectAttr "timeEx.o[0]" "jT.ty";',
              'connectAttr "src.t" "chainA.i[0]";',
              'connectAttr "chainA.o[0]" "chainB.i[0]";',
              'connectAttr "chainB.o[0]" "jC.tx";',
              'connectAttr "src.rz" "quatEx.i[0]";',
              'connectAttr "quatEx.o[0]" "jQ.r";',
              'connectAttr "src.tx" "limitEx.i[0]";',
              'connectAttr "limitEx.o[0]" "jL.tx";',
              'connectAttr "limitEx.o[1]" "jL.ty";',
              'connectAttr "limitEx.o[2]" "jL.tz";',
              'connectAttr "src.tx" "pyEx.i[0]";',
              'connectAttr "pyEx.o[0]" "jP.tx";',
              'connectAttr "pyEx.o[1]" "jP.ty";',
              'connectAttr "pyEx.o[2]" "jP.tz";',
              'connectAttr "pyEx.o[3]" "jP2.tx";',
              'connectAttr "src.tx" "pyEx2.i[0]";',
              'connectAttr "pyEx2.o[0]" "jR.tx";',
              'connectAttr "pyEx2.o[1]" "jR.ty";',
              'connectAttr "pyEx2.o[2]" "jR.tz";',
              'connectAttr "pyEx2.o[3]" "jR2.tx";',
              'connectAttr "pyEx2.o[4]" "jR2.ty";',
              'connectAttr "src.tx" "pyEx3.i[0]";',
              'connectAttr "pyEx3.o[0]" "jS.tx";',
              'connectAttr "pyEx3.o[1]" "jS.ty";',
              'connectAttr "pyEx3.o[2]" "jS.tz";',
              'connectAttr "pyEx3.o[3]" "jS2.tx";',
              'connectAttr "pyEx3.o[4]" "jS2.ty";',
              'connectAttr "src.tx" "aliasEx.i[0]";',
              'connectAttr "aliasEx.o[0]" "jF.t";',
              'connectAttr "aliasEx.o[1]" "jF.r";',
              'connectAttr "badCmds.o[0]" "jX.tx";',
              'connectAttr "boxShape.o" "badMesh.i[0]";',
              'connectAttr "badMesh.o[0]" "jM.tx";',
              '// End of exprespy_sample.ma']
    write_scene(lines, OUT_MA, OUT_JSON)
    write_scene(bend_roll_scene(), OUT_BR_MA, OUT_BR_JSON)


if __name__ == "__main__":
    main()
