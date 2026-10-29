# -*- coding: utf-8 -*-
"""Maya が評価したアニメーションカーブの値（tools/maya_anim_curve_check.py の出力）と、ビューアの評価を比べる。

    python tools/compare_anim_curves.py scene.ma scene.json [--report report.md] [--tol 1e-4]

.ma をビューアと同じ方法で読み（ma_viewer.animation）、ビューアの JS（web_src/src/animation.js）で同じ時刻を評価して、
Maya の値との差を接線の種類・重みの有無・範囲外の設定ごとにまとめる。あわせて次も確かめる:
  * .ma に書かれた接線の種類の番号（kit / kot）と、Maya が答えた種類の名前の対応（ビューアの番号の想定と合うか）
  * 回転の補間（rotationInterpolation）を変えた回転の、ノードの回転の値との差
JS の評価には Node.js を使う（web_src で npm install を済ませておく）。
"""
from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer.ma_scene import parse_ma_file  # noqa: E402
from ma_viewer.animation import CURVE_TYPES, _CM_PER_UNIT, _pack, curve_record, fps_of, parse_curve  # noqa: E402

# ビューアが想定している .ma の接線の種類の番号（web_src/src/animation.js の TANGENT）
VIEWER_CODES = {"fixed": 1, "linear": 2, "flat": 3, "step": 5, "slow": 6, "fast": 7, "spline": 9, "clamped": 10,
                "plateau": 16, "stepnext": 17, "auto": 18, "automix": 19, "autoease": 20, "autocustom": 21}
INFINITY_CODES = {"constant": 0, "linear": 1, "cycle": 3, "cycleRelative": 4, "oscillate": 5}
EVAL_SCRIPT = os.path.join(ROOT, "web_src", "tools", "eval_curves.mjs")


def evaluate_in_js(anim: dict, samples: list) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        src, dst = os.path.join(tmp, "in.json"), os.path.join(tmp, "out.json")
        with open(src, "w", encoding="utf-8") as f:
            json.dump({"anim": anim, "samples": samples}, f)
        subprocess.run(["node", EVAL_SCRIPT, src, dst], check=True, cwd=os.path.join(ROOT, "web_src"))
        with open(dst, encoding="utf-8") as f:
            return json.load(f)


def build(ms, names):
    """名前のカーブを共通 JSON の animation の形にする。戻り値: (animation, 見つかった名前の順, .ma の接線の種類)"""
    fps = fps_of(ms.time_unit)
    ang_k = 180.0 / math.pi if ms.angular_unit in ("rad", "radian") else 1.0
    cm = _CM_PER_UNIT.get(ms.linear_unit, 1.0)
    by_name = {}
    for n in ms.nodes:
        if n.type in CURVE_TYPES and n.span is not None:
            by_name.setdefault(n.name, n)
            by_name.setdefault(n.name.split(":")[-1], n)
    curves, times, values, types, fixed, found, codes = [], [], [], bytearray(), [], [], {}
    offset = 0
    for name in names:
        node = by_name.get(name) or by_name.get(name.split("|")[-1].split(":")[-1])
        if node is None:
            continue
        cv = parse_curve(ms.text, node)
        if not len(cv.times):
            continue
        vals, chunk, fx, meta = curve_record(cv, offset, fps, ang_k, cm)
        curves.append(meta)
        times.extend(float(t) for t in cv.times)
        values.extend(float(v) for v in vals)
        types += chunk
        fixed.extend(fx)
        offset += len(cv.times)
        found.append(name)
        stored = (set(cv.fixed["kix"]) & set(cv.fixed["kiy"]), set(cv.fixed["kox"]) & set(cv.fixed["koy"]))
        codes[name] = ([cv.kit.get(k, 0) for k in range(len(cv.times))], [cv.kot.get(k, 0) for k in range(len(cv.times))], cv.tan,
                       stored)
    # ビューアに渡すときと同じ形（float32 の base64。固定の接線のない側は NaN のまま）
    anim = {"fps": fps, "curves": curves, "times": _pack(times, "float32"), "values": _pack(values, "float32"),
            "tangentTypes": _pack(types, "uint8"), "fixedTangents": _pack(fixed, "float32")}
    return anim, found, codes


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Maya とビューアのアニメーションカーブの評価を比べる")
    ap.add_argument("ma")
    ap.add_argument("reference", help="tools/maya_anim_curve_check.py が書き出した JSON")
    ap.add_argument("--report", default=None, help="結果を書く Markdown（省略時は画面に出す）")
    ap.add_argument("--tol", type=float, default=1e-4, help="一致とみなす差（値の大きさに対する割合。既定 1e-4）")
    args = ap.parse_args(argv)

    with open(args.reference, encoding="utf-8") as f:
        ref = json.load(f)
    ms = parse_ma_file(args.ma, load_references=False)
    units = ref.get("units", {})
    ang = (180.0 / math.pi) if units.get("angle") in ("rad", "radian") else 1.0     # Maya の値を度にする
    ref_curves = {c["name"]: c for c in ref.get("curves", [])}
    rot_names = [c for r in ref.get("rotations", []) for c in r["curves"]]
    names = list(ref_curves) + [n for n in rot_names if n not in ref_curves]
    anim, found, codes = build(ms, names)
    samples = []
    for name in found:
        if name in ref_curves:
            samples.append(ref_curves[name]["samples"])
        else:
            r = next(r for r in ref["rotations"] if name in r["curves"])
            samples.append(r["samples"])
    js = evaluate_in_js(anim, samples)
    index = {name: i for i, name in enumerate(found)}

    lines = ["# アニメーションカーブの比較（Maya %s とビューア）" % ref.get("maya", "?"), "",
             "- シーン: `%s`（時間 %s・長さ %s・角度 %s）" % (os.path.basename(args.ma), ms.time_unit, ms.linear_unit, ms.angular_unit),
             "- Maya の単位: %s" % json.dumps(units, ensure_ascii=False),
             "- 一致の基準: 差 ≤ %g × max(1, |値|)" % args.tol, ""]
    missing = [n for n in ref_curves if n not in index]
    if missing:
        lines.append("- .ma に見つからないカーブ: %d 本（%s）" % (len(missing), ", ".join(missing[:10])))
        lines.append("")

    # --- 接線の種類の番号 --------------------------------------------------
    seen, stored_count = {}, {}
    for name in found:
        c = ref_curves.get(name)
        if not c:
            continue
        kit, kot, tan, stored = codes[name]
        for side, names_, nums, has in (("in", c["keys"]["inType"], kit, stored[0]), ("out", c["keys"]["outType"], kot, stored[1])):
            for k, (nm, num) in enumerate(zip(names_, nums)):
                seen.setdefault(nm, set()).add(num if num else ("既定 %d" % tan))
                key = (nm, "重み付き" if c["weighted"] else "重みなし")
                cnt = stored_count.setdefault(key, [0, 0])
                cnt[0] += 1
                cnt[1] += k in has
    lines += ["## 接線の種類の番号（.ma の kit / kot）", "", "| Maya の名前 | .ma の番号 | ビューアの想定 | 判定 |", "|---|---|---|---|"]
    for nm in sorted(seen):
        got = sorted(seen[nm], key=str)
        want = VIEWER_CODES.get(nm)
        ok = all(g == want or (isinstance(g, str) and g.endswith(" %d" % want)) for g in got) if want else False
        lines.append("| %s | %s | %s | %s |" % (nm, ", ".join(map(str, got)), want if want else "（なし）", "✓" if ok else "★ 違う"))
    lines.append("")
    # Maya が計算した接線が .ma に残っていれば、ビューアは近似で計算し直さずにそれを使える
    lines += ["## 接線の値（kix・kiy / kox・koy）が .ma に書かれているキー", "",
              "ビューアは、固定の接線と重み付きのカーブだけ .ma の値を使い、それ以外は接線の種類から計算し直す。", "",
              "| 接線の種類 | 重み | 書かれている / キーの側の数 |", "|---|---|---|"]
    for key in sorted(stored_count):
        total, has = stored_count[key]
        lines.append("| %s | %s | %d / %d |" % (key[0], key[1], has, total))
    lines.append("")

    # --- カーブの値 ----------------------------------------------------------
    groups, details = {}, []
    for name in found:
        c = ref_curves.get(name)
        if not c:
            continue
        i = index[name]
        k = ang if c["type"] == "animCurveTA" else 1.0
        worst, at = 0.0, None
        for t, mv, vv in zip(c["samples"], c["values"], js["values"][i]):
            mv = mv * k
            err = abs(vv - mv) / max(1.0, abs(mv))
            if err > worst:
                worst, at = err, (t, mv, vv)
        types = sorted(set(c["keys"]["inType"]) | set(c["keys"]["outType"]))
        key = ("・".join(types), "重み付き" if c["weighted"] else "重みなし", "%s / %s" % (c["pre"], c["post"]))
        g = groups.setdefault(key, [0, 0, 0.0])
        g[0] += 1
        g[1] += worst <= args.tol
        g[2] = max(g[2], worst)
        if worst > args.tol:
            details.append((name, c, i, worst, at, k))
    lines += ["## カーブの値（接線の種類・重み・範囲外ごと）", "", "| 接線の種類 | 重み | 範囲外（前 / 後） | 本数 | 一致 | 最大の差 |",
              "|---|---|---|---|---|---|"]
    for key in sorted(groups):
        n, ok, worst = groups[key]
        lines.append("| %s | %s | %s | %d | %s | %.2e |" % (key[0], key[1], key[2], n, "✓ %d" % ok if ok == n else "★ %d / %d" % (ok, n), worst))
    lines.append("")
    if details:
        lines += ["## 一致しないカーブの詳細", "",
                  "傾きの列: ビューアは値 / フレーム。Maya の角度からの傾きは、角度が「値 / 秒」のときは tan(角度) / fps、"
                  "「値 / フレーム」のときは tan(角度) と同じになる（どちらの約束かは、リニアのキーで確かめられる）。", ""]
        fps = fps_of(ms.time_unit)
        for name, c, i, worst, at, k in sorted(details, key=lambda d: -d[3]):
            kk = c["keys"]
            lines += ["### %s（最大の差 %.3g・フレーム %g で Maya %.6g / ビューア %.6g）" % (name, worst, at[0], at[1], at[2]), "",
                      "重み: %s・範囲外: %s / %s" % ("あり" if c["weighted"] else "なし", c["pre"], c["post"]), "",
                      "| 時刻 | 値 | 種類（入り / 出） | Maya の角度（入り / 出） | Maya の重み | tan(角度)/fps | ビューアの傾き |",
                      "|---|---|---|---|---|---|---|"]
            for j, t in enumerate(kk["time"]):
                ia, oa = kk["inAngle"][j], kk["outAngle"][j]
                sl = js["slopes"][i][j] if j < len(js["slopes"][i]) else [float("nan")] * 2
                lines.append("| %g | %.6g | %s / %s | %.4f / %.4f | %.4g / %.4g | %.6g / %.6g | %.6g / %.6g |" % (
                    t, kk["value"][j] * k, kk["inType"][j], kk["outType"][j], ia, oa, kk["inWeight"][j], kk["outWeight"][j],
                    math.tan(math.radians(ia)) / fps * k, math.tan(math.radians(oa)) / fps * k, sl[0], sl[1]))
            lines.append("")

    # --- 回転の補間 -----------------------------------------------------------
    rots = ref.get("rotations", [])
    if rots:
        lines += ["## 回転の補間（rotationInterpolation）", "",
                  "ビューアは回転の補間を読まず、X・Y・Z のカーブを別々に評価する（独立したオイラー）。", "",
                  "| ノード | 補間 | 最大の差（度） |", "|---|---|---|"]
        for r in rots:
            if not all(n in index for n in r["curves"]):
                lines.append("| %s | %s | （.ma にカーブがない） |" % (r["node"], r["mode"]))
                continue
            worst = 0.0
            for axis, cname in enumerate(r["curves"]):
                vals = js["values"][index[cname]]
                for v, mv in zip(vals, r["values"]):
                    worst = max(worst, abs(v - mv[axis] * ang))
            lines.append("| %s | %s | %.4g |" % (r["node"], r["mode"], worst))
        lines.append("")

    text = "\n".join(lines)
    if args.report:
        with open(args.report, "w", encoding="utf-8") as f:
            f.write(text)
        print("書き出しました: %s" % args.report)
    else:
        print(text)
    return 0 if not details else 1


if __name__ == "__main__":
    sys.exit(main())
