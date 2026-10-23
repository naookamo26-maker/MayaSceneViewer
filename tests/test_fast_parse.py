# -*- coding: utf-8 -*-
"""高速化した解析（文の切り出し・読み飛ばし・numpy）と、従来の処理で結果が同じになるか。

  python -m unittest tests.test_fast_parse
"""
from __future__ import annotations

import os
import subprocess
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

FILES = [os.path.join(ROOT, "samples", "sample_arm.ma"),
         os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")]
FILES += [p for p in ("/tmp/big.ma", "/tmp/rig_many.ma", "/tmp/rig_real.ma") if os.path.exists(p)]

# 別プロセスで、環境変数を変えて変換結果を JSON で受け取る（モジュールの初期化時の設定も反映させるため）
CODE = r"""
import json, sys
sys.path.insert(0, %r)
from ma_viewer.extract_ma import load_ma
sc = load_ma(sys.argv[1])
sc.pop("source")
print(json.dumps(sc, sort_keys=True))
""" % ROOT


def convert(path, **env):
    e = dict(os.environ, **env)
    out = subprocess.run([sys.executable, "-c", CODE, path], env=e, capture_output=True, text=True, check=True)
    import json
    return json.loads(out.stdout)


class TestFastParse(unittest.TestCase):
    def test_same_result_as_full_parse(self):
        from test_numpy_path import _close
        for path in FILES:
            with self.subTest(path=os.path.basename(path)):
                slow = convert(path, MA_VIEWER_NO_SKIP="1", MA_VIEWER_NO_NUMPY="1")
                fast = convert(path)
                _close(slow, fast)

    def test_long_string_with_semicolons(self):
        # ; の多い長い文字列（スクリプトや設定を入れた文字列属性）でも、文の切り出しが 2 乗にならないこと
        import time
        from ma_viewer.ma_scene import parse_ma_text
        mel = "\\n".join('setAttr \\"node%d.tx\\" %d; print(\\"x;y\\");' % (i, i) for i in range(10000))
        text = ('createNode transform -n "rig_settings";\n\taddAttr -ci true -sn "data" -ln "data" -dt "string";\n'
                '\tsetAttr ".data" -type "string" "%s";\ncreateNode transform -n "after";\n'
                '\tsetAttr ".t" -type "double3" 1 2 3 ;\n' % mel)
        t = time.perf_counter()
        ms = parse_ma_text(text)
        self.assertLess(time.perf_counter() - t, 2.0)
        self.assertEqual([n.xattrs.get("t") for n in ms.nodes if n.name == "after"], [[1.0, 2.0, 3.0]])

    def test_comments(self):
        from ma_viewer import ma_reader as R
        text = ('//Maya ASCII 2024 scene\n//Name: a.ma\nrequires maya "2024";\n'
                'setAttr ".p" -type "string" "//server/share;x";\n  // indented ; comment\nsetAttr ".b" 1;\n// End')
        got = [s.strip() for _o, s in R.iter_statements(text) if s.strip()]
        old = [s.strip() for _o, s in R.iter_statements_regex(text) if s.strip()]
        self.assertEqual(got, old)

    def test_skip_rules(self):
        from ma_viewer.ma_scene import skips_attrs
        for t in ("animCurveTL", "nurbsCurve", "parentConstraint", "unitConversion", "polyCube", "blendShape"):
            self.assertTrue(skips_attrs(t), t)
        for t in ("transform", "joint", "mesh", "skinCluster", "tweak", "groupParts", "dagPose", "file",
                  "lambert", "aiStandardSurface", "bump2d", "myPluginTransform"):
            self.assertFalse(skips_attrs(t), t)

    def test_block_skip_keeps_following_commands(self):
        # 読み飛ばしたブロックのすぐ後の文（字下げなし）は処理されること
        from ma_viewer.ma_scene import parse_ma_text
        text = ('createNode animCurveTL -n "a";\n\tsetAttr -s 2 ".ktv[0:1]" 1 2 3 4;\n'
                'createNode transform -n "t";\n\tsetAttr ".t" -type "double3" 1 2 3 ;\n'
                'createNode nurbsCurve -n "cs" -p "t";\n\tsetAttr ".cc" -type "nurbsCurve" 1 1 0 no 3 2 0 1 2 0 0 0 1 0 0;\n'
                'connectAttr "a.o" "t.tx";\n')
        ms = parse_ma_text(text)
        t = [x for x in ms.nodes if x.name == "t"][0]
        self.assertEqual(t.xattrs["t"], [1.0, 2.0, 3.0])
        self.assertIn("tx", t.inputs)
        self.assertEqual(ms.stats.get("読み飛ばし"), 2)


if __name__ == "__main__":
    unittest.main()
