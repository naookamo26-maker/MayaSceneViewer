# -*- coding: utf-8 -*-
"""ブラウザ版のビューアを、CSS・JS 込みの 1 ファイルの HTML にする（Teams・Slack などで渡す用）。
python packaging/build_html.py

  前提: なし（Python だけで作れる）。ビューアの JS（ma_viewer/web/viewer.bundle.js）が web_src より古そうなら、
        Node.js があれば作り直す（なければ注意を出して、いまの JS のまま作る。--no-js-check で確かめない）
  出力: dist/MayaSceneViewer.html（ビューアだけ。開いてから .msv をドロップする）

  python packaging/build_html.py --embed scene.msv           → dist/scene.html（シーン入り。開くとそのシーンを表示）
  python packaging/build_html.py --embed a.msv --embed b.ma  → dist/a.html・dist/b.html（1 ファイルにつき 1 つ）
  python packaging/build_html.py -o out/viewer.html          出力先を指定（--embed が 1 つのときだけ）

  --embed に .ma・.json を指定したら、パッケージ（.msv）にしてから入れる（--textures で同梱するテクスチャ。既定 albedo）。

できたあと、外のファイル（style.css・viewer.bundle.js）を読んでいないかを確かめる。動作の確認はブラウザで開くだけ:
  dist/MayaSceneViewer.html をブラウザ（Chrome・Edge）で開き、samples/textured_sample.msv をドロップする
"""
import argparse
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
WEB = os.path.join(ROOT, "ma_viewer", "web")
WEB_SRC = os.path.join(ROOT, "web_src")
DIST = os.path.join(ROOT, "dist")
DEFAULT_NAME = "MayaSceneViewer.html"


def _newest(paths):
    return max((os.path.getmtime(p) for p in paths if os.path.isfile(p)), default=0.0)


def js_sources():
    out = [os.path.join(ROOT, "ma_viewer", "version.py"), os.path.join(WEB_SRC, "build.mjs")]
    for d, _dirs, files in os.walk(os.path.join(WEB_SRC, "src")):
        out += [os.path.join(d, f) for f in files if f.endswith(".js")]
    return out


def ensure_bundle(check: bool) -> bool:
    """ビューアの JS が web_src（とバージョン）より古そうなら作り直す。JS がなく作れもしなければ False。
    更新時刻で見るので、git で取得し直した直後は最新でも古く見えることがある。そのため Node.js がなければ止めない"""
    bundle = os.path.join(WEB, "viewer.bundle.js")
    missing = [f for f in ("index.html", "style.css", "viewer.bundle.js") if not os.path.isfile(os.path.join(WEB, f))]
    stale = not missing and check and os.path.isdir(WEB_SRC) and _newest(js_sources()) > os.path.getmtime(bundle)
    if not missing and not stale:
        return True
    why = "ビューアのファイルが足りません: %s" % ", ".join(missing) if missing else \
        "ビューアの JS（viewer.bundle.js）が web_src より古いようです"
    print(why)
    node = shutil.which("node")
    if not node or not os.path.isdir(os.path.join(WEB_SRC, "node_modules")):
        if missing:
            print("Node.js か、web_src の依存（cd web_src && npm install）がないため作れません（cd web_src && npm run build）")
            return False
        print("  注意: Node.js か web_src の依存がないため作り直さず、いまの JS のまま作ります"
              "（web_src を直したなら cd web_src && npm run build）")
        return True
    print("  作り直します（cd web_src && node build.mjs）")
    r = subprocess.run([node, "build.mjs"], cwd=WEB_SRC)
    return r.returncode == 0


def verify(path: str) -> list:
    """できた HTML の確認。問題の一覧（なければ空）"""
    with open(path, encoding="utf-8") as f:
        page = f.read()
    problems = []
    if re.search(r"<script[^>]+src=", page):
        problems.append("外の JS を読む <script src> が残っています")
    if re.search(r'<link[^>]+rel="stylesheet"', page):
        problems.append("外の CSS を読む <link> が残っています")
    from ma_viewer.version import __version__
    if '"%s"' % __version__ not in page:
        problems.append("ビューアのバージョン（%s）が入っていません（JS を作り直してください）" % __version__)
    return problems


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="ブラウザ版のビューアを 1 ファイルの HTML にする")
    ap.add_argument("--embed", action="append", default=[], metavar="FILE",
                    help="埋め込むシーン（.msv・.ma・.json）。複数指定でき、1 ファイルにつき 1 つの HTML を作る")
    ap.add_argument("-o", "--output", help="出力先（省略時は dist/。--embed が 2 つ以上なら使えない）")
    ap.add_argument("--textures", choices=("albedo", "all", "none"), default="albedo",
                    help=".ma・.json を埋め込むときに同梱するテクスチャ（既定 albedo。.msv はそのまま）")
    ap.add_argument("--no-js-check", action="store_true", help="ビューアの JS が古くないかを確かめない")
    args = ap.parse_args(argv)
    if args.output and len(args.embed) > 1:
        print("-o は --embed が 1 つのときだけ使えます（2 つ以上なら dist/ にファイル名ごとに作ります）")
        return 1
    for p in args.embed:
        if not os.path.isfile(p):
            print("ファイルが見つかりません: %s" % p)
            return 1
    if not ensure_bundle(not args.no_js_check):
        return 1
    sys.path.insert(0, ROOT)
    from ma_viewer import html_build
    jobs = [(None, args.output or os.path.join(DIST, DEFAULT_NAME))] if not args.embed else \
        [(p, args.output or os.path.join(DIST, os.path.splitext(os.path.basename(p))[0] + ".html")) for p in args.embed]
    failed = False
    for embed, out in jobs:
        os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
        try:
            size = html_build.write_html(out, embed=embed, textures=args.textures)
        except (ValueError, RuntimeError, OSError) as exc:
            print("作れませんでした: %s（%s）" % (out, exc))
            failed = True
            continue
        problems = verify(out)
        print("作りました: %s（%.2f MB%s）" % (os.path.relpath(out, os.getcwd()), size / 1048576.0,
                                         "・シーン入り: %s" % os.path.basename(embed) if embed else ""))
        for p in problems:
            print("  問題: " + p)
        failed = failed or bool(problems)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
