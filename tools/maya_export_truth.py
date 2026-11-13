# -*- coding: utf-8 -*-
"""Maya の中で実行する: 開いているシーンの「正解」（各フレームのワールド行列と表示）を JSON に書き出す。

ビューアの評価と比べるための道具です（docs/maya_verification.md）。ビューアのコードには依存しません
（maya.cmds と maya.api.OpenMaya だけを使う）。Maya のスクリプトエディタ（Python）で:

    import sys; sys.path.insert(0, r"C:/path/to/MayaSceneViewer/tools")
    import maya_export_truth as t
    t.run(r"C:/temp/scene_truth.json")                 # 再生範囲の全フレーム
    # t.run(r"C:/temp/scene_truth.json", start=1, end=24, step=1)

mayapy なら:  mayapy tools/maya_export_truth.py scene.ma scene_truth.json [--start N --end N --step N]

書き出した JSON をビューアのリポジトリで比べる:
    python -m ma_viewer verify scene.ma scene_truth.json

出力の形式:
    {"fps", "start", "end", "mayaVersion", "linearUnit", "source": "maya",
     "nodes": {DAG のフルパス: {"frames": [...], "world": [[16 個], ...], "visible": [...], "shown": [...]}}}
  * 対象は transform（joint などの派生も）。シェイプ・既定のカメラ（persp など）は含めない。
  * world: MDagPath.inclusiveMatrix()（内部単位 = cm）。16 個は行の順（移動は 12〜14 番目）。
  * visible: ノード自身の .v（値）。shown: 親・ディスプレイレイヤー・描画のオーバーライドを含めた表示（MDagPath.isVisible）。
  * 作業単位は cm を前提にする（ビューアは cm 以外に対応しない）。cm 以外なら警告を出す。
シーンは変えない（現在のフレームは最後に元に戻す）。
"""
from __future__ import annotations

import json
import sys

DEFAULT_CAMERAS = {"|persp", "|top", "|front", "|side", "|bottom", "|left", "|back"}


class MayaApi:
    """Maya を呼ぶ部分（テストでは同じメソッドを持つ偽物に差し替える）"""

    def __init__(self):
        import maya.cmds as cmds
        import maya.api.OpenMaya as om
        self.cmds = cmds
        self.om = om

    def info(self) -> dict:
        c = self.cmds
        unit = c.currentUnit(q=True, time=True)
        fps = {"game": 15.0, "film": 24.0, "pal": 25.0, "ntsc": 30.0, "show": 48.0, "palf": 50.0, "ntscf": 60.0}.get(unit)
        if fps is None and unit.endswith("fps"):          # "120fps" など
            try:
                fps = float(unit[:-3])
            except ValueError:
                fps = None
        return {"fps": fps or 24.0, "start": c.playbackOptions(q=True, min=True),
                "end": c.playbackOptions(q=True, max=True), "mayaVersion": str(c.about(version=True)),
                "linearUnit": c.currentUnit(q=True, linear=True), "currentTime": c.currentTime(q=True)}

    def transforms(self) -> list:
        return self.cmds.ls(type="transform", long=True) or []

    def set_time(self, f: float) -> None:
        self.cmds.currentTime(f, update=True)

    def _path(self, name):
        sel = self.om.MSelectionList()
        sel.add(name)
        return sel.getDagPath(0)

    def sample(self, name: str):
        """(ワールド行列の 16 個, 自身の表示, 親を含めた表示)"""
        path = self._path(name)
        world = [float(x) for x in path.inclusiveMatrix()]
        visible = bool(self.cmds.getAttr(name + ".visibility"))
        return world, visible, bool(path.isVisible())


def collect(api, start=None, end=None, step=1.0, log=print) -> dict:
    """各フレームの値を集めて、出力の形式の dict を返す"""
    info = api.info()
    start = info["start"] if start is None else start
    end = info["end"] if end is None else end
    if step <= 0:
        raise ValueError("step は正の数にしてください")
    if info.get("linearUnit") not in (None, "cm", "centimeter"):
        log("警告: 作業単位が cm ではありません（%s）。ビューアは cm 以外に対応していません" % info.get("linearUnit"))
    names = [n for n in api.transforms() if n not in DEFAULT_CAMERAS]
    frames = []
    f = float(start)
    while f <= end + 1e-9:
        frames.append(round(f, 6))
        f += step
    nodes = {n: {"frames": [], "world": [], "visible": [], "shown": []} for n in names}
    try:
        for k, f in enumerate(frames):
            api.set_time(f)
            for n in names:
                e = nodes[n]
                try:
                    world, visible, shown = api.sample(n)
                except Exception as exc:          # 消えたノード・読めない属性は、そのフレームを飛ばす
                    log("読めないノード %s（フレーム %s）: %s" % (n, f, exc))
                    continue
                e["frames"].append(f)
                e["world"].append(world)
                e["visible"].append(visible)
                e["shown"].append(shown)
            if log and (k + 1) % 50 == 0:
                log("  %d / %d フレーム" % (k + 1, len(frames)))
    finally:
        if info.get("currentTime") is not None:
            api.set_time(info["currentTime"])
    return {"source": "maya", "fps": info["fps"], "start": start, "end": end, "mayaVersion": info.get("mayaVersion"),
            "linearUnit": info.get("linearUnit"), "nodes": nodes}


def run(out_path: str, start=None, end=None, step=1.0, api=None) -> dict:
    """開いているシーンの正解を out_path に書く。書いた dict を返す"""
    data = collect(api or MayaApi(), start, end, step)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print("書き出しました: %s（ノード %d・フレーム %s〜%s）" % (out_path, len(data["nodes"]), data["start"], data["end"]))
    return data


def _main(argv) -> int:
    import argparse
    ap = argparse.ArgumentParser(description="mayapy で .ma を開き、正解の JSON を書く")
    ap.add_argument("scene")
    ap.add_argument("out")
    ap.add_argument("--start", type=float, default=None)
    ap.add_argument("--end", type=float, default=None)
    ap.add_argument("--step", type=float, default=1.0)
    args = ap.parse_args(argv)
    import maya.standalone
    maya.standalone.initialize(name="python")
    try:
        import maya.cmds as cmds
        cmds.file(args.scene, open=True, force=True)
        run(args.out, args.start, args.end, args.step)
    finally:
        maya.standalone.uninitialize()
    return 0


if __name__ == "__main__":
    sys.exit(_main(sys.argv[1:]))
