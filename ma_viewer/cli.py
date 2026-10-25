# -*- coding: utf-8 -*-
"""コマンドライン:

  python -m ma_viewer                    ビューアを起動
  python -m ma_viewer view scene.ma      ファイルを開いてビューアを起動
  python -m ma_viewer export scene.ma -o scene.json   共通 JSON に変換
  python -m ma_viewer info scene.ma      内容の概要と警告を表示
  python -m ma_viewer rig scene.ma       リグの診断（評価できないノードと、IK の極ベクトルなどの上流）
  python -m ma_viewer excerpt scene.ma [ノード名...]   指定したノード（省略時は lookAt）の部分だけを抜き出す
  python -m ma_viewer node-defs          同梱した自作ノードの定義の一覧と誤り
  python -m ma_viewer convert-plugin plugin.py -o ma_viewer/node_defs/plugin.json
                                         Python のノードプラグインを自作ノードの定義に変換（配布者が一度だけ使う）
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
    scene = load_ma(args.input, progress=None if args.quiet else _progress, animation=not args.no_animation)
    if not args.quiet:
        sys.stderr.write("\n")
    out = args.output or os.path.splitext(args.input)[0] + ".json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(scene, f, ensure_ascii=False, separators=(",", ":"), indent=None if args.compact else 1)
    print("書き出しました: %s（%.2f 秒）" % (out, time.time() - t0))
    for w in scene["warnings"] + (scene.get("animation") or {}).get("warnings", []):
        print("  警告: " + w)
    return 0


def cmd_info(args) -> int:
    from .extract_ma import load_ma
    t0 = time.time()
    scene = load_ma(args.input, animation=True)
    st = scene["stats"]
    print("ファイル: %s" % args.input)
    print("Maya: %s / 単位: %s, %s" % (scene["source"]["mayaVersion"], scene["source"]["linearUnit"],
                                     scene["source"]["angularUnit"]))
    for r in scene["source"].get("references") or []:
        state = ("読み込み（ノード %d）→ %s" % (r["nodes"], r["resolved"]) if r["loaded"]
                 else "読み込まない: %s" % r["reason"])
        print("リファレンス %s%s: %s  [%s]" % ("  " * (r["depth"] - 1), r["namespace"] or "（名前空間なし）",
                                         r["path"], state))
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
    anim = scene.get("animation")
    if anim:
        a = anim["stats"]
        print("アニメーション: カーブ %d 本・キー %d 個・ノード %d 個 / %s（%g fps）・再生範囲 %g〜%g"
              % (a["curves"], a["keys"], a["nodes"], anim["timeUnit"], anim["fps"], anim["start"], anim["end"]))
    warnings = scene["warnings"] + (anim or {}).get("warnings", [])
    if warnings:
        print("警告:")
        for w in warnings:
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


def cmd_rig(args) -> int:
    from .rig_report import rig_report_file
    text = rig_report_file(args.input)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text + "\n")
        print("書き出しました: %s" % args.output)
    else:
        print(text)
    return 0


def cmd_excerpt(args) -> int:
    from .excerpt import excerpt
    text = excerpt(args.input, args.nodes)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(text + "\n")
        print("書き出しました: %s" % args.output)
    else:
        print(text)
    return 0


def cmd_node_defs(args) -> int:
    """同梱した自作ノードの定義（ma_viewer/node_defs）の一覧と誤り。誤りがあれば終了コード 1"""
    from .node_defs import DEF_DIR, load_definitions
    defs = load_definitions(args.files or None)
    print("自作ノードの定義: %s" % (", ".join(args.files) if args.files else DEF_DIR))
    for t, nd in sorted(defs.nodes.items()):
        ins = [a.name for a in nd.attrs if not a.output]
        outs = [a.name for a in nd.attrs if a.output]
        print("  ✓ %s（%s%s）入力 %s → 出力 %s" % (t, nd.source, "・%s %s" % (nd.plugin, nd.plugin_version or "")
                                              if nd.plugin else "", "・".join(ins) or "なし", "・".join(outs)))
    for t, why in sorted(defs.errors.items()):
        print("  ★ %s: %s" % (t, why))
    if not defs.nodes and not defs.errors:
        print("  （なし）")
    return 1 if defs.errors else 0


def cmd_convert_plugin(args) -> int:
    """Python のノードプラグイン → 自作ノードの定義。変換できないノードがあれば終了コード 1"""
    from .plugin_convert import convert_file, report_text
    data, results, problems = convert_file(args.input, args.plugin, args.version)
    print(report_text(args.input, data, results, problems))
    if args.show or not args.output:
        for t, spec in data.get("nodes", {}).items():
            print("\n--- %s の計算" % t)
            print("\n".join("    " + line for line in spec["compute"]))
    if args.output:
        if data.get("nodes"):
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")
            print("書き出し: %s（%d 個のノード）" % (args.output, len(data["nodes"])))
        else:
            print("変換できたノードがないので、書き出していません")
    else:
        print("\n（-o 定義ファイル.json で書き出します。同梱するなら ma_viewer/node_defs/ に置いてください）")
    return 1 if problems or any(not r.ok for r in results) else 0


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
    pe.add_argument("--no-animation", action="store_true", help="アニメーションを書き出さない")
    pi = sub.add_parser("info", help="内容の概要を表示")
    pi.add_argument("input")
    pr = sub.add_parser("rig", help="リグの診断（評価できないノードと IK の上流）")
    pr.add_argument("input")
    pr.add_argument("-o", "--output", help="テキストファイルに書き出す")
    px = sub.add_parser("excerpt", help="指定したノード（省略時は lookAt）とその子孫・接続だけを抜き出す")
    px.add_argument("input")
    px.add_argument("nodes", nargs="*", help="ノードの名前（省略時は lookAt をすべて）")
    px.add_argument("-o", "--output", help="テキストファイルに書き出す")
    pn = sub.add_parser("node-defs", help="同梱した自作ノードの定義（ma_viewer/node_defs）の一覧と誤りを表示")
    pn.add_argument("files", nargs="*", help="定義ファイル（省略時は同梱のフォルダ）")
    pc = sub.add_parser("convert-plugin", help="Python のノードプラグイン（.py）を自作ノードの定義（.json）に変換")
    pc.add_argument("input", help="プラグインのファイル（.py）")
    pc.add_argument("-o", "--output", help="定義ファイル（.json）に書き出す（省略時は結果の表示だけ）")
    pc.add_argument("--plugin", help="プラグインの名前（省略時はファイル名。.ma の requires の名前に合わせる）")
    pc.add_argument("--version", help="プラグインの版（省略時は MFnPlugin の 3 番目の引数）")
    pc.add_argument("--show", action="store_true", help="書き出すときも変換した計算を表示する")
    pv = sub.add_parser("view", help="ビューアを起動")
    pv.add_argument("input", nargs="?")
    args = p.parse_args(argv)
    if args.cmd == "export":
        return cmd_export(args)
    if args.cmd == "info":
        return cmd_info(args)
    if args.cmd == "rig":
        return cmd_rig(args)
    if args.cmd == "excerpt":
        return cmd_excerpt(args)
    if args.cmd == "node-defs":
        return cmd_node_defs(args)
    if args.cmd == "convert-plugin":
        return cmd_convert_plugin(args)
    if args.cmd == "view":
        return cmd_view(args)
    from .app import main as app_main
    return app_main([])


if __name__ == "__main__":
    sys.exit(main())
