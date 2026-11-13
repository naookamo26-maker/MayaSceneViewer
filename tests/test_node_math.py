# -*- coding: utf-8 -*-
"""計算ノードの細かな動作（Autodesk の資料で確かめたもの）を、.ma から読んでビューアの評価（JS）で確かめる。

* vectorProduct の内積（op 1）で normalizeOutput（.no）がオンなら、入力を正規化した内積（角度の cos）。
  出典: Autodesk Maya ノードの技術資料「vectorProduct」の normalizeOutput（「出力は -1〜1。実質的に入力ベクトルの
  間の角度の cos」）。長さ 0 のベクトルは 0 にする。
* orientConstraint・parentConstraint の interpType（.int）: 2 ターゲットの Shortest は最短の弧の slerp。
  Average（既定）はいままでどおりの平均。式の分からない種類は平均として評価し、警告を出す。
  出典: Autodesk Maya ノードの技術資料「orientConstraint」「parentConstraint」の interpType。
* pairBlend の四元数補間（.ri 1）は、回転順（.ro）で入力を四元数にし、同じ回転順で出力する。
  出典: Autodesk Maya ノードの技術資料「pairBlend」の rotateOrder。
汎用の経路（rig.js）と専用の評価（rigCompiled.js）の両方で確かめる。Node.js が要る。
"""
from __future__ import annotations

import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.extract_ma import load_ma  # noqa: E402

HEAD = '//Maya ASCII 2024 scene\nrequires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'
NODE = shutil.which("node")
WEB = os.path.join(ROOT, "web_src")

# vectorProduct → ジョイントの移動 X。ctrl.tx にキー（入力 1 の X を動かして、評価の対象にする）
CASES = [  # (名前, normalizeOutput, 入力 1（ctrl.tx は X に足す）, 入力 2)
    ("dotNo", 1, (2, 0, 0), (3, 3, 0)),
    ("dotRaw", 0, (2, 0, 0), (3, 3, 0)),
    ("dotZero", 1, (0, 0, 0), (1, 0, 0)),
    ("dotNo2", 1, (1, 2, 3), (-4, 5, 0.5)),
]


def scene_text() -> str:
    s = [HEAD, 'createNode transform -n "ctrl";\n',
         'createNode animCurveTL -n "ctrl_tx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 0;\n']
    con = ['connectAttr "ctrl_tx.o" "ctrl.tx";\n']
    for name, no, a, b in CASES:
        s.append('createNode joint -n "j_%s";\n' % name)
        s.append('createNode plusMinusAverage -n "pa_%s";\n\tsetAttr ".i3[1]" -type "float3" %g %g %g ;\n' % ((name,) + a))
        s.append('createNode vectorProduct -n "vp_%s";\n\tsetAttr ".no" %s;\n'
                 '\tsetAttr ".i2" -type "double3" %g %g %g ;\n' % ((name, "yes" if no else "no") + b))
        con.append('connectAttr "ctrl.t" "pa_%s.i3[0]";\n' % name)
        con.append('connectAttr "pa_%s.o3" "vp_%s.i1";\n' % (name, name))
        con.append('connectAttr "vp_%s.ox" "j_%s.tx";\n' % (name, name))
    return "".join(s + con)


def expected(no, a, b) -> float:
    d = sum(x * y for x, y in zip(a, b))
    if not no:
        return d
    la, lb = math.sqrt(sum(x * x for x in a)), math.sqrt(sum(x * x for x in b))
    return 0.0 if la == 0 or lb == 0 else d / (la * lb)


@unittest.skipUnless(NODE and os.path.isdir(os.path.join(WEB, "node_modules")), "Node.js と web_src の npm ci が要る")
class VectorProductTest(unittest.TestCase):
    def test_dot_normalize_output(self):
        tmp = tempfile.mkdtemp()
        try:
            path = os.path.join(tmp, "vp.ma")
            with open(path, "w", encoding="utf-8") as f:
                f.write(scene_text())
            scene = load_ma(path, animation=True)
            self.assertFalse(scene["animation"].get("warnings"), scene["animation"].get("warnings"))
            sj = os.path.join(tmp, "scene.json")
            with open(sj, "w", encoding="utf-8") as f:
                json.dump(scene, f)
            code = ("import { readFileSync } from 'node:fs';"
                    "import { Matrix4 } from 'three';"
                    "import { AnimationClip } from './src/animation.js';"
                    "import { RigEvaluator } from './src/rig.js';"
                    "const s = JSON.parse(readFileSync(process.argv[1], 'utf8')); const out = {};"
                    "for (const compiled of [false, true]) {"
                    "  const rig = new RigEvaluator(new AnimationClip(s.animation), s.nodes,"
                    "    (ni) => new Matrix4().fromArray(s.nodes[ni].matrix));"
                    "  rig.playbackLimit = 0; rig.useCompiled = compiled;"
                    "  for (const f of [1, 2, 3]) rig.evaluate(f);"
                    "  const m = rig.evaluate(5); const r = {};"
                    "  s.nodes.forEach((n, i) => { if (m.get(i)) r[n.name] = m.get(i).elements[12]; });"
                    "  out[compiled ? 'compiled' : 'generic'] = { values: r, plan: !!rig.compiledPlan };"
                    "}"
                    "console.log(JSON.stringify(out));")
            res = json.loads(subprocess.run([NODE, "--input-type=module", "-e", code, sj], cwd=WEB, check=True,
                                            capture_output=True, text=True).stdout)
            self.assertTrue(res["compiled"]["plan"], "専用の評価を使っていない")
            for path_kind in ("generic", "compiled"):
                vals = res[path_kind]["values"]
                for name, no, a, b in CASES:
                    self.assertAlmostEqual(vals["j_" + name], expected(no, a, b), places=6,
                                           msg="%s %s" % (path_kind, name))
            self.assertEqual(res["generic"]["values"], res["compiled"]["values"])     # ビット単位で同じ
            self.assertAlmostEqual(res["generic"]["values"]["j_dotNo"], math.sqrt(0.5), places=9)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


ORDERS = ["xyz", "yzx", "zxy", "xzy", "yxz", "zyx"]


def qmul(a, b):
    aw, ax, ay, az = a
    bw, bx, by, bz = b
    return (aw * bw - ax * bx - ay * by - az * bz, aw * bx + ax * bw + ay * bz - az * by,
            aw * by - ax * bz + ay * bw + az * bx, aw * bz + ax * by - ay * bx + az * bw)


def euler_quat(deg, order="xyz"):
    """Maya の回転順（xyz なら X → Y → Z の順に回す）の四元数 (w, x, y, z)"""
    q = (1.0, 0.0, 0.0, 0.0)
    for ax in order:
        k = "xyz".index(ax)
        h = math.radians(deg[k]) / 2
        r = [math.cos(h), 0.0, 0.0, 0.0]
        r[1 + k] = math.sin(h)
        q = qmul(tuple(r), q)                             # 後の回転を左から掛ける
    return q


def slerp(a, b, t):
    d = sum(x * y for x, y in zip(a, b))
    if d < 0:
        b, d = tuple(-x for x in b), -d
    th = math.acos(min(1.0, d))
    if th < 1e-12:
        return a
    sa, sb = math.sin((1 - t) * th) / math.sin(th), math.sin(t * th) / math.sin(th)
    return tuple(sa * x + sb * y for x, y in zip(a, b))


def nlerp(qs, ws):
    ref = qs[0]
    acc = [0.0] * 4
    for q, w in zip(qs, ws):
        sg = -w if sum(x * y for x, y in zip(q, ref)) < 0 else w
        acc = [a + sg * x for a, x in zip(acc, q)]
    n = math.sqrt(sum(x * x for x in acc))
    return tuple(x / n for x in acc)


def angle_between(a, b) -> float:
    """2 つの向きの間の角度（度）。acos は 0 の近くで丸めの誤差が大きいので、相対の回転 a⁻¹·b から atan2 で求める"""
    rw, rx, ry, rz = qmul((a[0], -a[1], -a[2], -a[3]), tuple(b))
    return math.degrees(2 * math.atan2(math.sqrt(rx * rx + ry * ry + rz * rz), abs(rw)))


EVAL_ROT = ("import { readFileSync } from 'node:fs';"
            "import { Matrix4, Quaternion } from 'three';"
            "import { AnimationClip } from './src/animation.js';"
            "import { RigEvaluator } from './src/rig.js';"
            "import { makeViewer, viewerFrame } from './tools/verify.mjs';"
            "const s = JSON.parse(readFileSync(process.argv[1], 'utf8')); const out = {};"
            "for (const compiled of [false, true]) {"
            "  const v = makeViewer(s); v.rig.playbackLimit = 0; v.rig.useCompiled = compiled;"
            "  for (const f of [1, 2, 3]) viewerFrame(v, f);"
            "  const r = viewerFrame(v, 5); const q = {};"
            "  s.nodes.forEach((n, i) => { const x = new Quaternion().setFromRotationMatrix(r.world[i]);"
            "    q[n.name] = [x.w, x.x, x.y, x.z]; });"
            "  out[compiled ? 'compiled' : 'generic'] = { q, plan: !!v.rig.compiledPlan };"
            "}"
            "console.log(JSON.stringify(out));")


@unittest.skipUnless(NODE and os.path.isdir(os.path.join(WEB, "node_modules")), "Node.js と web_src の npm ci が要る")
class RotationBlendTest(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def run_scene(self, text):
        path = os.path.join(self.dir, "s.ma")
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        scene = load_ma(path, animation=True)
        sj = os.path.join(self.dir, "s.json")
        with open(sj, "w", encoding="utf-8") as f:
            json.dump(scene, f)
        res = json.loads(subprocess.run([NODE, "--input-type=module", "-e", EVAL_ROT, sj], cwd=WEB, check=True,
                                        capture_output=True, text=True).stdout)
        return scene, res

    def check(self, res, name, want, tol=1e-6):
        for kind in ("generic", "compiled"):
            got = res[kind]["q"][name]
            self.assertLess(angle_between(got, want), tol, "%s %s: %s != %s" % (kind, name, got, want))
        self.assertEqual(res["generic"]["q"][name], res["compiled"]["q"][name])     # ビット単位で同じ

    # 動かされるノード d_k（ターゲット a_k・b_k、重み 1・3）。ctrl.tx のキーで評価の対象にする
    TARGET_A, TARGET_B, W = (10, 20, 0), (0, 170, 40), (1.0, 3.0)

    def constraint_scene(self, cases):
        s = [HEAD, 'createNode transform -n "ctrl";\n',
             'createNode animCurveTL -n "ctrl_tx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 0;\n']
        con = ['connectAttr "ctrl_tx.o" "ctrl.tx";\n']
        for name, ctype, interp in cases:
            for t, r in (("a", self.TARGET_A), ("b", self.TARGET_B)):
                s.append('createNode joint -n "%s_%s";\n\tsetAttr ".r" -type "double3" %g %g %g;\n' % ((t, name) + r))
            s.append('createNode joint -n "d_%s";\n' % name)
            s.append('createNode %s -n "c_%s" -p "d_%s";\n' % (ctype, name, name))
            s.append('\taddAttr -ci true -k true -sn "w0" -ln "aW0" -dv 1 -min 0 -at "double";\n'
                     '\taddAttr -ci true -k true -sn "w1" -ln "bW1" -dv 1 -min 0 -at "double";\n')
            if interp is not None:
                s.append('\tsetAttr ".int" %d;\n' % interp)
            s.append('\tsetAttr ".w0" %g;\n\tsetAttr ".w1" %g;\n' % self.W)
            for k, t in enumerate("ab"):
                tg = "c_%s.tg[%d]" % (name, k)
                for a, b in (("r", "tr"), ("ro", "tro"), ("pm", "tpm"), ("jo", "tjo"), ("t", "tt"), ("rp", "trp"),
                             ("rpt", "trt"), ("s", "ts")):
                    if ctype == "orientConstraint" and b in ("tt", "trp", "trt", "ts"):
                        continue
                    con.append('connectAttr "%s_%s.%s" "%s.%s";\n' % (t, name, a, tg, b))
                con.append('connectAttr "c_%s.w%d" "%s.tw";\n' % (name, k, tg))
            con.append('connectAttr "d_%s.ro" "c_%s.cro";\nconnectAttr "d_%s.pim" "c_%s.cpim";\n' % ((name,) * 4))
            con.append('connectAttr "d_%s.jo" "c_%s.cjo";\n' % (name, name))
            for ax in "xyz":
                con.append('connectAttr "c_%s.cr%s" "d_%s.r%s";\n' % (name, ax, name, ax))
            if ctype == "parentConstraint":
                con.append('connectAttr "d_%s.rp" "c_%s.crp";\nconnectAttr "d_%s.rpt" "c_%s.crt";\n' % ((name,) * 4))
                for ax in "xyz":
                    con.append('connectAttr "c_%s.ct%s" "d_%s.t%s";\n' % (name, ax, name, ax))
        return "".join(s + con)

    def test_constraint_interp_type(self):
        cases = [("ocDef", "orientConstraint", None), ("ocAvg", "orientConstraint", 1),
                 ("ocShort", "orientConstraint", 2), ("ocLong", "orientConstraint", 3),
                 ("pcShort", "parentConstraint", 2), ("pcNoFlip", "parentConstraint", 0)]
        scene, res = self.run_scene(self.constraint_scene(cases))
        self.assertTrue(res["compiled"]["plan"], "専用の評価を使っていない")
        qa, qb = euler_quat(self.TARGET_A), euler_quat(self.TARGET_B)
        t = self.W[1] / sum(self.W)
        short, avg = slerp(qa, qb, t), nlerp([qa, qb], self.W)
        self.assertGreater(angle_between(short, avg), 1.0)        # 平均と slerp で違う向き（テストの意味がある）
        for name, _ctype, interp in cases:
            self.check(res, "d_" + name, short if interp == 2 else avg)
        warns = scene["animation"].get("warnings", [])
        self.assertTrue(any("c_ocLong の補間の種類 Longest（ターゲット 2 個）は平均" in w for w in warns), warns)
        self.assertTrue(any("c_pcNoFlip の補間の種類 No Flip" in w for w in warns), warns)
        self.assertFalse([w for w in warns if "Shortest" in w or "Average" in w and "c_ocAvg" in w], warns)

    def test_pair_blend_rotate_order(self):
        r1, r2, w = (30, 60, 10), (-40, 20, 80), 0.35
        s = [HEAD, 'createNode transform -n "ctrl";\n',
             'createNode animCurveTL -n "ctrl_tx";\n\tsetAttr -s 2 ".ktv[0:1]"  1 0 24 0;\n']
        con = ['connectAttr "ctrl_tx.o" "ctrl.tx";\n']
        for ro in range(6):
            s.append('createNode joint -n "j%d";\n\tsetAttr ".ro" %d;\n' % (ro, ro))
            s.append('createNode pairBlend -n "pb%d";\n\tsetAttr ".ri" 1;\n\tsetAttr ".ro" %d;\n'
                     '\tsetAttr ".ir1" -type "double3" %g %g %g ;\n\tsetAttr ".ir2" -type "double3" %g %g %g ;\n'
                     % ((ro, ro) + r1 + r2))
            s.append('createNode addDoubleLinear -n "w%d";\n\tsetAttr ".i2" %g;\n' % (ro, w))
            con.append('connectAttr "ctrl.tx" "w%d.i1";\nconnectAttr "w%d.o" "pb%d.w";\n' % (ro, ro, ro))
            con.append('connectAttr "pb%d.or" "j%d.r";\n' % (ro, ro))
        scene, res = self.run_scene("".join(s + con))
        self.assertFalse(scene["animation"].get("warnings"), scene["animation"].get("warnings"))
        for ro in range(6):
            o = ORDERS[ro]
            self.check(res, "j%d" % ro, slerp(euler_quat(r1, o), euler_quat(r2, o), w))


if __name__ == "__main__":
    unittest.main()
