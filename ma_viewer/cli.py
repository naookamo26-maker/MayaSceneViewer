# -*- coding: utf-8 -*-
"""コマンドライン:

  python -m ma_viewer                    ビューアを起動
  python -m ma_viewer view scene.ma      ファイルを開いてビューアを起動
  python -m ma_viewer export scene.ma -o scene.json   共通 JSON に変換（.msv からも戻せる）
  python -m ma_viewer pack scene.ma -o scene.msv      パッケージ（.msv。小さく、アルベドのテクスチャ入り）に変換
  python -m ma_viewer build-html -o viewer.html       ビューアを 1 ファイルの HTML にまとめる（--embed scene.msv でシーン入り）
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
from . import schema


def _progress(frac, msg):
    sys.stderr.write("\r%-60s" % msg[:60])
    sys.stderr.flush()


def cmd_export(args) -> int:
    """.ma・.msv → 共通 JSON"""
    from . import package
    t0 = time.time()
    if package.is_package(args.input):
        # パッケージを共通 JSON に戻す（Maya 内で書き出したシーンの調査など）。同梱のテクスチャは JSON からは使えない
        scene, _pkg = package.read_package(args.input)
        scene["source"].pop("packagePath", None)
        scene.pop("savedView", None)               # 表示の状態はパッケージだけのもの
        if args.no_animation:
            scene.pop("animation", None)
        if any(t.get("packed") for t in scene.get("textures") or []):
            print("  お知らせ: パッケージに同梱したテクスチャは、JSON では表示されません（.msv のまま開いてください）")
    else:
        from .extract_ma import load_ma
        scene = load_ma(args.input, progress=None if args.quiet else _progress, animation=not args.no_animation)
        if not args.quiet:
            sys.stderr.write("\n")
    out = args.output or os.path.splitext(args.input)[0] + ".json"
    if os.path.abspath(out) == os.path.abspath(args.input):
        print("入力と同じファイルには書き出せません: %s" % out, file=sys.stderr)
        return 1
    with open(out, "w", encoding="utf-8") as f:
        if args.pretty:
            json.dump(scene, f, ensure_ascii=False, indent=1)
        else:
            json.dump(scene, f, ensure_ascii=False, separators=(",", ":"))
    print("書き出しました: %s（%.2f 秒）" % (out, time.time() - t0))
    for w in scene.get("warnings", []) + (scene.get("animation") or {}).get("warnings", []):
        print("  警告: " + w)
    return 0


def _mb(n: int) -> str:
    return "%.2f MB" % (n / 1048576.0) if n >= 1048576 else "%.1f KB" % (n / 1024.0)


def cmd_pack(args) -> int:
    """.ma・.json・.msv → .msv"""
    from . import package
    t0 = time.time()
    src = args.input
    low = src.lower()
    source_pkg = None
    if low.endswith(".json"):
        with open(src, encoding="utf-8") as f:
            scene = json.load(f)
        schema.validate(scene)
        if args.no_animation:
            scene.pop("animation", None)
    elif package.is_package(low):
        scene, source_pkg = package.read_package(src)
        if args.no_animation:
            scene.pop("animation", None)
    elif low.endswith(".mb"):
        print("Maya バイナリ (.mb) は読み込めません。Maya で .ma として保存し直してください。", file=sys.stderr)
        return 1
    else:
        from .extract_ma import load_ma
        scene = load_ma(src, progress=None if args.quiet else _progress, animation=not args.no_animation)
        if not args.quiet:
            sys.stderr.write("\n")
    out = args.output or os.path.splitext(src)[0] + package.EXT
    if os.path.abspath(out) == os.path.abspath(src):
        print("入力と同じファイルには書き出せません: %s" % out, file=sys.stderr)
        return 1
    say = None if args.quiet else (lambda msg: sys.stderr.write("\r%-60s" % msg[:60]))
    r = package.write_package(scene, out, textures=args.textures, max_size=args.max_size, quality=args.quality,
                              source=source_pkg, convert=False if args.keep_textures else None, progress=say,
                              view=None if args.no_view else "keep")
    if not args.quiet:
        sys.stderr.write("\r%-60s\r" % "")
    print("書き出しました: %s（%s・%.2f 秒）" % (out, _mb(r["size"]), time.time() - t0))
    if r["textures"]:
        print("  テクスチャ %d 枚（%s → %s%s）" % (r["textures"], _mb(r["textureBytesIn"]), _mb(r["textureBytesOut"]),
                                           "・WebP" if r["converted"] else "・元のまま"))
    for w in r["warnings"]:
        print("  警告: " + w)
    if not args.quiet:
        for w in scene.get("warnings") or []:
            print("  警告: " + w)
    return 0


def cmd_build_html(args) -> int:
    """ビューアを 1 ファイルの HTML にまとめる（--embed でシーンを埋め込む）"""
    from . import html_build
    t0 = time.time()
    if args.embed and not os.path.isfile(args.embed):
        print("ファイルが見つかりません: %s" % args.embed, file=sys.stderr)
        return 1
    out = args.output or (os.path.splitext(args.embed)[0] + ".html" if args.embed else "viewer.html")
    if args.embed and os.path.abspath(out) == os.path.abspath(args.embed):
        print("入力と同じファイルには書き出せません: %s" % out, file=sys.stderr)
        return 1
    say = None if args.quiet else (lambda msg: sys.stderr.write("\r%-60s" % msg[:60]))
    try:
        size = html_build.write_html(out, embed=args.embed, textures=args.textures, progress=say)
    except (ValueError, RuntimeError, OSError) as exc:
        print("書き出せませんでした: %s" % exc, file=sys.stderr)
        return 1
    if say:
        sys.stderr.write("\r%-60s\r" % "")
    print("書き出しました: %s（%s・%.2f 秒）" % (out, _mb(size), time.time() - t0))
    if args.embed:
        print("  シーンを埋め込みました: %s（開くとこのシーンを表示します）" % os.path.basename(args.embed))
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
            sc = schema.array_values(sk["counts"])
            extra = "  スキン: %s（インフルエンス %d, 最大 %d/頂点）" % (
                sk["cluster"], len(sk["influences"]), max(sc) if sc else 0)
        print("  - %s: 頂点 %d, 面 %d%s%s" % (m["name"], schema.array_len(m["positions"]) // 3,
                                          schema.array_len(m["counts"]),
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
        per = m.get("faceMaterials") or [m.get("material", -1)] * schema.array_len(m["counts"])
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
    idx = schema.array_values(m["uv"]["indices"])
    off = bad = 0
    for c in schema.array_values(m["counts"]):
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
        print("  ○ %s（%s%s）入力 %s → 出力 %s" % (t, nd.source, "・%s %s" % (nd.plugin, nd.plugin_version or "")
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


def _safe_console():
    """出力の文字コード（Windows の cp932 など）で表せない文字は ? にする（止まらないように）"""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="replace")
        except (AttributeError, ValueError, OSError):
            pass


def main(argv=None) -> int:
    _safe_console()
    from . import __version__
    p = argparse.ArgumentParser(prog="ma_viewer", description="Maya ASCII 簡易ビューア")
    p.add_argument("-V", "--version", action="version", version="Maya Scene Viewer %s" % __version__)
    sub = p.add_subparsers(dest="cmd")
    pe = sub.add_parser("export", help=".ma・.msv を共通 JSON に変換")
    pe.add_argument("input")
    pe.add_argument("-o", "--output")
    pe.add_argument("--pretty", action="store_true", help="字下げ・改行を入れて出力（読みやすいが大きくなる）")
    pe.add_argument("--compact", action="store_true", help=argparse.SUPPRESS)    # 互換のため（いまは既定）
    pe.add_argument("-q", "--quiet", action="store_true")
    pe.add_argument("--no-animation", action="store_true", help="アニメーションを書き出さない")
    pk = sub.add_parser("pack", help=".ma・.json をパッケージ（.msv）に変換（数値をバイナリで圧縮し、テクスチャを同梱）")
    pk.add_argument("input", help=".ma・.json・.msv")
    pk.add_argument("-o", "--output", help="書き出す .msv（省略時は入力と同じ名前）")
    pk.add_argument("--textures", choices=("albedo", "all", "none"), default="albedo",
                    help="同梱するテクスチャ（既定 albedo: アルベドのみ。all: すべてのマップ。none: 入れない）")
    pk.add_argument("--max-size", type=int, default=2048, help="テクスチャの長い辺の上限（px。既定 2048。0 で縮めない）")
    pk.add_argument("--quality", type=int, default=80, help="WebP の品質（1〜100。既定 80）")
    pk.add_argument("--keep-textures", action="store_true", help="テクスチャを WebP にせず、元のファイルのまま入れる")
    pk.add_argument("--no-animation", action="store_true", help="アニメーションを書き出さない")
    pk.add_argument("--no-view", action="store_true", help="元の .msv の表示の状態（カメラ・表示設定など）を引き継がない")
    pk.add_argument("-q", "--quiet", action="store_true")
    pb = sub.add_parser("build-html", help="ビューアを CSS・JS 込みの 1 ファイルの HTML にまとめる（Teams・Slack などで渡す用）")
    pb.add_argument("-o", "--output", help="書き出す HTML（省略時は viewer.html。--embed なら入力と同じ名前）")
    pb.add_argument("--embed", help="埋め込むシーン（.msv。.ma・.json ならパッケージにしてから入れる）。開くとこのシーンを表示する")
    pb.add_argument("--textures", choices=("albedo", "all", "none"), default="albedo",
                    help=".ma・.json を埋め込むときに同梱するテクスチャ（既定 albedo。.msv はそのまま）")
    pb.add_argument("-q", "--quiet", action="store_true")
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
    if args.cmd == "pack":
        return cmd_pack(args)
    if args.cmd == "build-html":
        return cmd_build_html(args)
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
