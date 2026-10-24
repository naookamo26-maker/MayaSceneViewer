# -*- coding: utf-8 -*-
"""Maya での選択の可否（テンプレート・リファレンス）の検証用サンプル .ma を生成する。

  python tools/make_select_sample.py      → samples/select_sample.ma, samples/select_sample.json

samples/sample_arm.ma に、次のものを足したもの:
  * box: テンプレート（.template）→ ビューポートでは選べない
  * arm_geo: 表示の種類がリファレンスのディスプレイレイヤー（refLayer）に入れる → 選べない
  * wrist: 描画のオーバーライドの表示の種類をテンプレートにする → wrist とその子（wrist_end）は選べない
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "sample_arm.ma")
OUT = os.path.join(ROOT, "samples", "select_sample.ma")


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace("//Name: sample_arm.ma", "//Name: select_sample.ma")
    out = [
        'select -ne |props_grp|box;',
        '\tsetAttr ".tmp" yes;',
        'select -ne |rig_grp|shoulder|elbow|forearm_twist|wrist;',
        '\tsetAttr ".ove" yes;',
        '\tsetAttr ".ovdt" 1;',
        'createNode displayLayer -n "refLayer";',
        '\tsetAttr ".dt" 2;',
        '\tsetAttr ".do" 1;',
        'connectAttr "refLayer.di" "arm_geo.do";',
    ]
    text = body + "\n".join(out) + "\n" + tail.replace("sample_arm.ma", "select_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT)
    with open(os.path.join(ROOT, "samples", "select_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: select_sample.json")


if __name__ == "__main__":
    main()
