# -*- coding: utf-8 -*-
"""Maya が分けて保存した長い文字列（"…" + "…"）を、ファイルの文字コード（シフト JIS など）で読み直すテスト。

  python tests/test_ma_strings.py
シフト JIS では「表」「ソ」「能」などの 2 バイト目が 0x5C（\\）になる。ファイルの中に読めないバイトがあると本文を
latin-1 で読むため、exprespy・expression のコードは元のバイト列に戻して読み直す。
"""
from __future__ import annotations

import os
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import ma_reader as R  # noqa: E402
from ma_viewer.exprespy import code_text, translate  # noqa: E402
from ma_viewer.expression import expression_text  # noqa: E402
from ma_viewer.ma_scene import parse_ma_file  # noqa: E402

CODE = "# 表\nx = 1.0\n# ソ\nz = 1.0 + -0.339 * IN[0]\ns = \"能\"\nOUT[0] = api.MVector(x ,x ,z)\n"


def maya_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def scene_bytes(node_type: str, attr: str, chunks, extra: bytes = b"") -> bytes:
    body = b'\n\t\t+ '.join(b'"' + c + b'"' for c in chunks)
    return (b'//Maya ASCII 2020 scene\n//Codeset: 932\nrequires maya "2020";\n' + extra
            + b'createNode ' + node_type.encode() + b' -n "n1";\n\tsetAttr ".' + attr.encode()
            + b'" -type "string" (\n\t\t' + body + b');\n')


class JoinQuotedTest(unittest.TestCase):
    def test_split_inside_double_byte_char(self):
        b = maya_escape(CODE).encode("cp932")
        cut = b.index("表".encode("cp932")) + 1            # 「表」の 1 バイト目と 2 バイト目（0x5C）の間
        raw = b'"' + b[:cut] + b'"\n\t\t+ "' + b[cut:] + b'");'
        self.assertEqual(R.join_quoted_bytes(raw, "cp932"), CODE)

    def test_utf8_and_escapes(self):
        raw = '"a\\"b\\\\c\\n日本" + "語"'.encode("utf-8")
        self.assertEqual(R.join_quoted_bytes(raw, "utf-8"), 'a"b\\c\n日本語')


class SceneTest(unittest.TestCase):
    def load(self, data: bytes):
        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "s.ma")
            with open(path, "wb") as f:
                f.write(data)
            return parse_ma_file(path)

    def test_exprespy_code_split_inside_char(self):
        b = maya_escape(CODE).encode("cp932")
        p1 = b.index("表".encode("cp932")) + 1
        p2 = b.index("能".encode("cp932")) + 1
        ms = self.load(scene_bytes("exprespy", "cd", [b[:p1], b[p1:p2], b[p2:]]))
        self.assertEqual(ms.text_encoding, "latin-1")      # 文字の途中で分けてあるので、本文は latin-1 で読む
        text = code_text(ms, ms.resolve("n1"))
        self.assertEqual(text, CODE)
        translate(text, {0: "num"})                         # 書き方の誤りにならない

    def test_other_unreadable_bytes(self):
        b = maya_escape(CODE).encode("cp932")
        extra = b'createNode transform -n "t";\n\tsetAttr ".nt" -type "string" "\x81";\n'
        ms = self.load(scene_bytes("exprespy", "cd", [b], extra))
        self.assertEqual(code_text(ms, ms.resolve("n1")), CODE)

    def test_expression_ixp(self):
        ixp = "// 表\n.O[0] = frame;\n"
        b = maya_escape(ixp).encode("cp932")
        cut = b.index("表".encode("cp932")) + 1
        ms = self.load(scene_bytes("expression", "ixp", [b[:cut], b[cut:]]))
        self.assertEqual(expression_text(ms, ms.resolve("n1")), ixp)

    def test_long_expression_in_parentheses(self):
        # Maya は長い文字列を ( "…" + "…" ) で保存する（文字コードがふつうに読めるファイルでも、式を見つける）
        ms = self.load(scene_bytes("expression", "ixp", [b"// a\\n", b".O[0] = frame;"]))
        self.assertEqual(ms.text_encoding, "cp932")
        self.assertEqual(expression_text(ms, ms.resolve("n1")), "// a\n.O[0] = frame;")

    def test_syntax_error_shows_line(self):
        from ma_viewer.exprespy import ExprespyError
        with self.assertRaises(ExprespyError) as cm:
            translate("x = 1\nOUT[0] = (x\u3000+ 1)", {})
        self.assertIn("読んだ行: OUT[0] = (x\\u3000+ 1)", cm.exception.text())


if __name__ == "__main__":
    unittest.main()
