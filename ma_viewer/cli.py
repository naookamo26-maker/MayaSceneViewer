# -*- coding: utf-8 -*-
"""コマンドライン:

  python -m ma_viewer                    ビューアを起動
  python -m ma_viewer view scene.ma      ファイルを開いてビューアを起動
  python -m ma_viewer export scene.ma -o scene.json   共通 JSON に変換
  python -m ma_viewer info scene.ma      内容の概要と警告を表示
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time


def _progress(frac, msg):
    sys.stderr.write("\r%-60s" % msg[:60])
    sys.stderr.flush()


def cmd_export(args) -> int:
    from .extract_ma import load_ma
    t0 = time.time()
    scene = load_ma(args.input, progress=None if args.quiet else _progress)
    if not args.quiet:
        sys.stderr.write("\n")
    out = args.output or os.path.splitext(args.input)[0] + ".json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=None if args.compact else 1)
    print("書き出しました: %s（%.2f 秒）" % (out, time.time() - t0))
    for w in scene["warnings"]:
        print("  警告: " + w)
    return 0


def cmd_info(args) -> int:
    from .extract_ma import load_ma
    t0 = time.time()
    scene = load_ma(args.input)
    st = scene["stats"]
    print("ファイル: %s" % args.input)
    print("Maya: %s / 単位: %s, %s" % (scene["source"]["mayaVersion"], scene["source"]["linearUnit"],
                                     scene["source"]["angularUnit"]))
    print("ノード %d（ジョイント %d） / メッシュ %d（スキン %d） / 頂点 %d / 面 %d"
          % (st["nodes"], st["joints"], st["meshes"], st["skinnedMeshes"], st["vertices"], st["polygons"]))
    for m in scene["meshes"]:
        sk = m["skin"]
        extra = ""
        if sk:
            extra = "  スキン: %s（インフルエンス %d, 最大 %d/頂点）" % (
                sk["cluster"], len(sk["influences"]), max(sk["counts"]) if sk["counts"] else 0)
        print("  - %s: 頂点 %d, 面 %d%s%s" % (m["name"], len(m["positions"]) // 3, len(m["counts"]),
                                          "" if m["visible"] else "（非表示）", extra))
        # UV とマテリアル（テクスチャが貼られない原因を調べるため）
        uv = m.get("uv")
        if uv:
            missing = _faces_without_uv(m)
            print("      UV: %s（UV のない面 %d）" % (uv["set"], missing))
        else:
            print("      UV: なし")
        mats = scene.get("materials") or []
        texs = scene.get("textures") or []
        per = m.get("faceMaterials") or [m.get("material", -1)] * len(m["counts"])
        for mi in sorted(set(per)):
            n = per.count(mi)
            if mi < 0:
                print("      既定のマテリアル: %d 面" % n)
                continue
            md = mats[mi]
            t = texs[md["texture"]] if md["texture"] >= 0 else None
            tex = "テクスチャなし" if t is None else (
                "%s（%s）" % (os.path.basename(t["resolved"]), "見つかった") if t["resolved"]
                else "%s（見つからない）" % t["path"])
            print("      %s（%s）: %d 面 → %s" % (md["name"], md["type"], n, tex))
    if scene["warnings"]:
        print("警告:")
        for w in scene["warnings"]:
            print("  - " + w)
    print("処理時間: %.2f 秒" % (time.time() - t0))
    return 0


def _faces_without_uv(m) -> int:
    idx = m["uv"]["indices"]
    off = bad = 0
    for c in m["counts"]:
        if any(i < 0 for i in idx[off:off + c]):
            bad += 1
        off += c
    return bad


def cmd_view(args) -> int:
    from .app import main as app_main
    return app_main([args.input] if args.input else [])


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="ma_viewer", description="Maya ASCII 簡易ビューア")
    sub = p.add_subparsers(dest="cmd")
    pe = sub.add_parser("export", help=".ma を共通 JSON に変換")
    pe.add_argument("input")
    pe.add_argument("-o", "--output")
    pe.add_argument("--compact", action="store_true", help="改行なしで出力")
    pe.add_argument("-q", "--quiet", action="store_true")
    pi = sub.add_parser("info", help="内容の概要を表示")
    pi.add_argument("input")
    pv = sub.add_parser("view", help="ビューアを起動")
    pv.add_argument("input", nargs="?")
    args = p.parse_args(argv)
    if args.cmd == "export":
        return cmd_export(args)
    if args.cmd == "info":
        return cmd_info(args)
    if args.cmd == "view":
        return cmd_view(args)
    from .app import main as app_main
    return app_main([])


if __name__ == "__main__":
    sys.exit(main())
