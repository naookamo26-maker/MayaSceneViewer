# -*- coding: utf-8 -*-
"""カメラシーケンサの検証用サンプル .ma を生成する。

  python tools/make_sequencer_sample.py      → samples/sequencer_sample.ma, samples/sequencer_sample.json
前提: python tools/make_vis_camera_sample.py（samples/vis_camera_sample.ma に足す）

ショット（シーケンスのフレーム。sequenceEndFrame = 開始 + preHold + (endFrame − startFrame) × scale + postHold）:
  * SH010（shot1）: shot_cam、シーンの 1〜12 → シーケンスの 1〜12。トラック 1
  * SH020（shot2）: ortho_cam、シーンの 12〜24 → シーケンスの 13〜25。トラック 1
  * SH030（shot3）: shot_cam、シーンの 20〜24 を scale 2・preHold 2 → シーケンスの 26〜36（26〜28 は 20 で止まる）
  * SH015（shot4）: ortho_cam、シーンの 1〜4 → シーケンスの 5〜8。トラック 2（重なる SH010 より優先）
  * SH099（shot5）: ミュート（トラック 2、シーケンスの 15〜17。無視する）
  * SH040（shot6）: 起動時のカメラ persp、シーンの 1〜10 → シーケンスの 40〜49
Maya の書き出し形式を推定して作ったもの（実際の Maya のファイルとは細部が違うことがある）。
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "samples", "vis_camera_sample.ma")
OUT = os.path.join(ROOT, "samples", "sequencer_sample.ma")

SHOTS = [
    # 名前, ショット名, カメラ, sf, ef, ssf, トラック, その他
    ("shot1", "SH010", "shot_camShape", 1, 12, 1, 1, {}),
    ("shot2", "SH020", "ortho_camShape", 12, 24, 13, 1, {}),
    ("shot3", "SH030", "shot_camShape", 20, 24, 26, 1, {"s": 2, "prh": 2}),
    ("shot4", "SH015", "ortho_camShape", 1, 4, 5, 2, {}),
    ("shot5", "SH099", "shot_camShape", 1, 3, 15, 2, {"mt": "yes"}),
    ("shot6", "SH040", "perspShape", 1, 10, 40, 1, {}),
]


def main():
    with open(SRC, encoding="utf-8") as f:
        text = f.read()
    end = text.rfind("// End of")
    body, tail = (text[:end], text[end:]) if end >= 0 else (text, "")
    body = body.replace("//Name: vis_camera_sample.ma", "//Name: sequencer_sample.ma")
    out = ['createNode sequencer -n "sequencer1";', '\tsetAttr -s %d ".shts";' % len(SHOTS)]
    conns = []
    for name, shot_name, cam, sf, ef, ssf, trk, extra in SHOTS:
        out += ['createNode shot -n "%s";' % name,
                '\tsetAttr ".ihi" 0;',
                '\tsetAttr ".sf" %g;' % sf,
                '\tsetAttr ".ef" %g;' % ef,
                '\tsetAttr ".ssf" %g;' % ssf,
                '\tsetAttr ".trk" %d;' % trk,
                '\tsetAttr ".sn" -type "string" "%s";' % shot_name]
        out += ['\tsetAttr ".%s" %s;' % (k, v) for k, v in extra.items()]
        conns += ['connectAttr "%s.msg" "%s.ccm";' % (cam, name),
                  'connectAttr "%s.msg" "sequencer1.shts" -na;' % name]
    text = body + "\n".join(out + conns) + "\n" + tail.replace("vis_camera_sample.ma", "sequencer_sample.ma")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("書き出しました: %s" % OUT)
    sys.path.insert(0, ROOT)
    from ma_viewer.extract_ma import load_ma
    scene = load_ma(OUT, animation=True)
    with open(os.path.join(ROOT, "samples", "sequencer_sample.json"), "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=1)
    print("書き出しました: sequencer_sample.json")


if __name__ == "__main__":
    main()
