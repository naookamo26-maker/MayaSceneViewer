# -*- coding: utf-8 -*-
"""自作ノードの定義の計算を JavaScript の関数にしたもの（web_src/src/nodeDef.js の generateRunner）が、IR をたどる計算と
同じ結果になることを確かめるための定義を書き出す。

  python tools/make_nodedef_compile_fixture.py   → samples/nodedef_compile_defs.json

exprespy のコードで使われそうな Python の書き方の一覧（tests/exprespy_constructs.py）を、ビューアと同じ変換（exprespy.translate）で
定義にしたもの。web_src/tests/nodeDefCompile.test.mjs が、いろいろな入力で 2 つの計算を比べる。
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "samples", "nodedef_compile_defs.json")


def main():
    sys.path.insert(0, ROOT)
    sys.path.insert(0, os.path.join(ROOT, "tests"))
    from exprespy_constructs import CASES, KINDS, OUT_CONNECTED
    from ma_viewer.exprespy import ExprespyError, translate
    defs = []
    for name, code, *kinds in CASES:
        try:
            nd, _, _ = translate(code, kinds[0] if kinds else KINDS, out_connected=OUT_CONNECTED, type_name="exprespy")
        except ExprespyError as exc:  # 変換できない例（tests/test_exprespy.py が見つける）は飛ばす
            print("  変換できません: %s（%s）" % (name, exc.text()))
            continue
        defs.append({"name": name, "def": nd.to_json()})
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(defs, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: %s（%d 個）" % (OUT, len(defs)))


if __name__ == "__main__":
    main()
