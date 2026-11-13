# -*- coding: utf-8 -*-
"""計算ノードの細かな動作（Autodesk の資料で確かめたもの）を、.ma から読んでビューアの評価（JS）で確かめる。

* vectorProduct の内積（op 1）で normalizeOutput（.no）がオンなら、入力を正規化した内積（角度の cos）。
  出典: Autodesk Maya ノードの技術資料「vectorProduct」の normalizeOutput（「出力は -1〜1。実質的に入力ベクトルの
  間の角度の cos」）。長さ 0 のベクトルは 0 にする。
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


if __name__ == "__main__":
    unittest.main()
