# -*- coding: utf-8 -*-
"""パッケージ（.msv。ma_viewer/package.py）: 書き出し・読み込みの往復、同梱するテクスチャ、Pillow がない場合"""
from __future__ import annotations

import io
import json
import os
import shutil
import sys
import tempfile
import unittest
import zipfile
from unittest import mock

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import package, schema  # noqa: E402
from ma_viewer.cli import main as cli_main  # noqa: E402
from ma_viewer.extract_ma import load_ma  # noqa: E402

TEXTURED = os.path.join(ROOT, "samples", "textured_project", "scenes", "textured_sample.ma")
ARM = os.path.join(ROOT, "samples", "sample_arm.ma")
RIG = os.path.join(ROOT, "samples", "rig6_sample.ma")
HAS_PILLOW = package.pillow_status()[0]


def _strip(scene: dict) -> dict:
    """比べるため: テクスチャ（同梱で書き換わる）と、読み込み時に付く source.packagePath を除く"""
    s = json.loads(json.dumps(scene))
    s.pop("textures", None)
    (s.get("source") or {}).pop("packagePath", None)
    return s


class PackageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.textured = load_ma(TEXTURED, animation=True)
        cls.tmp = tempfile.mkdtemp(prefix="msv_test_")

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def out(self, name: str) -> str:
        return os.path.join(self.tmp, name)

    def test_roundtrip_same_as_json(self):
        """メッシュ・アニメーションの数値は、読み戻すと .json と同じ（base64 の形に戻る）"""
        for ma in (ARM, RIG, TEXTURED):
            scene = load_ma(ma, animation=True)
            path = self.out(os.path.basename(ma) + ".msv")
            r = package.write_package(scene, path)
            back, _pkg = package.read_package(path)
            self.assertEqual(_strip(back), _strip(scene), ma)
            self.assertLess(r["size"], len(json.dumps(scene, separators=(",", ":"))), ma)
            self.assertFalse(os.path.exists(path + ".part"))

    def test_source_scene_not_modified(self):
        before = json.dumps(self.textured, sort_keys=True)
        package.write_package(self.textured, self.out("nomod.msv"), textures="all")
        self.assertEqual(json.dumps(self.textured, sort_keys=True), before)

    def test_zip_layout(self):
        path = self.out("layout.msv")
        package.write_package(self.textured, path)
        with zipfile.ZipFile(path) as zf:
            names = set(zf.namelist())
            self.assertTrue({"manifest.json", "scene.json", package.BIN_NAME} <= names)
            manifest = json.loads(zf.read("manifest.json"))
            self.assertEqual(manifest["format"], package.FORMAT_NAME)
            self.assertEqual(manifest["textures"], "albedo")
            scene = json.loads(zf.read("scene.json"))
            # 数値の配列は bin への参照（base64 の data を持たない）
            pos = scene["meshes"][0]["positions"]
            self.assertEqual(pos["buffer"], package.BIN_NAME)
            self.assertNotIn("data", pos)
            self.assertEqual(pos["offset"] % 4, 0)
            for info in zf.infolist():                 # 画像は無圧縮、ほかは deflate
                want = zipfile.ZIP_STORED if info.filename.endswith((".webp", ".png", ".jpg")) else zipfile.ZIP_DEFLATED
                self.assertEqual(info.compress_type, want, info.filename)

    def test_albedo_only_default(self):
        path = self.out("albedo.msv")
        package.write_package(self.textured, path)
        scene, pkg = package.read_package(path)
        albedo = package.texture_indices(scene, "albedo")
        for i, t in enumerate(scene["textures"]):
            self.assertIsNone(t["resolved"])
            self.assertIsNone(t["url"])
            if t["node"] == "missing_file":
                self.assertEqual(t["omitted"], "missing")
            elif i in albedo:
                self.assertTrue(t["packed"], t["node"])
                self.assertIn(t["packed"], pkg.names)
            else:
                self.assertIsNone(t["packed"], t["node"])
                self.assertEqual(t["omitted"], "albedo-only", t["node"])
        names = {t["node"] for t in scene["textures"] if t.get("packed")}
        self.assertIn("pbr_base_file", names)
        self.assertNotIn("pbr_normal_file", names)
        udim = next(t for t in scene["textures"] if t.get("udim"))
        self.assertEqual([x["packed"] for x in udim["tiles"]], ["textures/8.1001.webp" if HAS_PILLOW else
                                                                "textures/8.1001.tga", udim["tiles"][1]["packed"]])
        self.assertEqual(len(udim["tiles"]), 2)
        self.assertEqual(pkg.texture_names(scene), {t["packed"] for t in scene["textures"] if t.get("packed")}
                         | {x["packed"] for x in udim["tiles"]})

    def test_textures_all_and_none(self):
        all_path, none_path = self.out("all.msv"), self.out("none.msv")
        package.write_package(self.textured, all_path, textures="all")
        package.write_package(self.textured, none_path, textures="none")
        scene_all, _ = package.read_package(all_path)
        scene_none, pkg_none = package.read_package(none_path)
        self.assertIn("pbr_normal_file", {t["node"] for t in scene_all["textures"] if t.get("packed")})
        self.assertFalse(any(t.get("packed") for t in scene_none["textures"]))
        self.assertFalse(any(n.startswith("textures/") for n in pkg_none.names))
        self.assertTrue(all(t["omitted"] in ("none",) for t in scene_none["textures"]))

    @unittest.skipUnless(HAS_PILLOW, "Pillow がない")
    def test_webp_keeps_alpha_and_shrinks(self):
        from PIL import Image
        path = self.out("webp.msv")
        r = package.write_package(self.textured, path)
        self.assertTrue(r["converted"])
        scene, pkg = package.read_package(path)
        for t in scene["textures"]:
            if t.get("packed"):
                self.assertEqual(t["format"], "webp")
        leaf = next(t for t in scene["textures"] if t["node"] == "leaf_file")
        img = Image.open(io.BytesIO(pkg.read(leaf["packed"])))
        self.assertEqual(img.format, "WEBP")
        self.assertIn("A", img.getbands())          # アルファ（切り抜き）を残す
        quad = next(t for t in scene["textures"] if t["node"] == "quad_file")
        self.assertNotIn("A", Image.open(io.BytesIO(pkg.read(quad["packed"]))).getbands())

    @unittest.skipUnless(HAS_PILLOW, "Pillow がない")
    def test_convert_image_resizes(self):
        from PIL import Image
        src = io.BytesIO()
        Image.new("RGB", (4096, 1024), (200, 30, 30)).save(src, "PNG")
        data, info = package.convert_image(src.getvalue(), max_size=2048, quality=80)
        self.assertEqual((info["width"], info["height"]), (2048, 512))
        self.assertEqual((info["sourceWidth"], info["sourceHeight"]), (4096, 1024))
        self.assertEqual(Image.open(io.BytesIO(data)).size, (2048, 512))
        # 16 bit のグレーも 8 bit にして変換できる
        src16 = io.BytesIO()
        Image.new("I;16", (8, 8), 40000).save(src16, "PNG")
        package.convert_image(src16.getvalue())

    def test_without_pillow_keeps_original(self):
        """Pillow がなければ、元の画像のまま入れて警告する（書き出しは止めない）"""
        path = self.out("nopil.msv")
        with mock.patch.object(package, "pillow_status", return_value=(False, "Pillow がありません")):
            r = package.write_package(self.textured, path)
        self.assertFalse(r["converted"])
        self.assertTrue(any("Pillow" in w for w in r["warnings"]))
        scene, pkg = package.read_package(path)
        quad = next(t for t in scene["textures"] if t["node"] == "quad_file")
        self.assertEqual(quad["format"], "tga")
        self.assertTrue(quad["packed"].endswith(".tga"))
        src = next(t for t in self.textured["textures"] if t["node"] == "quad_file")["resolved"]
        with open(src, "rb") as f:
            self.assertEqual(pkg.read(quad["packed"]), f.read())     # 元のファイルと同じバイト列

    def test_repack_from_package_copies_textures(self):
        """.msv から .msv へ: 同梱のテクスチャはそのまま移す（元の画像がなくてもよい）"""
        first = self.out("first.msv")
        package.write_package(self.textured, first)
        scene, pkg = package.read_package(first)
        second = self.out("second.msv")
        r = package.write_package(scene, second, source=pkg)
        scene2, pkg2 = package.read_package(second)
        self.assertEqual(r["textures"], len(pkg.texture_names(scene)))
        for t1, t2 in zip(scene["textures"], scene2["textures"]):
            self.assertEqual(bool(t1.get("packed")), bool(t2.get("packed")), t1["node"])
            if t1.get("packed"):
                self.assertEqual(pkg.read(t1["packed"]), pkg2.read(t2["packed"]))
        with zipfile.ZipFile(second) as zf:          # 読み込み時に付けた packagePath は書き出さない
            self.assertNotIn("packagePath", json.loads(zf.read("scene.json"))["source"])

    def test_bad_files(self):
        bad = self.out("bad.msv")
        with open(bad, "wb") as f:
            f.write(b"not a zip")
        with self.assertRaises(package.PackageError):
            package.read_package(bad)
        other = self.out("other.msv")
        with zipfile.ZipFile(other, "w") as zf:
            zf.writestr("readme.txt", "x")
        with self.assertRaises(package.PackageError):
            package.read_package(other)
        newer = self.out("newer.msv")
        with zipfile.ZipFile(newer, "w") as zf:
            zf.writestr("manifest.json", json.dumps({"format": package.FORMAT_NAME, "version": 99}))
            zf.writestr("scene.json", "{}")
        with self.assertRaises(package.PackageError):
            package.read_package(newer)

    def test_cli_pack(self):
        out = self.out("cli.msv")
        with mock.patch("sys.stdout", new=io.StringIO()):
            self.assertEqual(cli_main(["pack", TEXTURED, "-o", out, "-q"]), 0)
        scene, _ = package.read_package(out)
        schema.validate(scene)
        # 書き出した JSON からも作れる
        js = self.out("cli.json")
        out2 = self.out("cli2.msv")
        with mock.patch("sys.stdout", new=io.StringIO()):
            self.assertEqual(cli_main(["export", TEXTURED, "-o", js, "-q"]), 0)
            self.assertEqual(cli_main(["pack", js, "-o", out2, "-q", "--textures", "none"]), 0)
        with open(js, encoding="utf-8") as f:
            self.assertNotIn("\n", f.read())          # export の既定は字下げなし
        scene2, _ = package.read_package(out2)
        self.assertFalse(any(t.get("packed") for t in scene2["textures"]))

    def test_cli_export_from_package(self):
        """.msv → 共通 JSON（Maya 内で書き出したシーンの調査用）: .ma から直接書き出した JSON と同じ内容"""
        msv, js, direct = self.out("back.msv"), self.out("back.json"), self.out("direct.json")
        with mock.patch("sys.stdout", new=io.StringIO()):
            self.assertEqual(cli_main(["pack", ARM, "-o", msv, "-q"]), 0)
            self.assertEqual(cli_main(["export", msv, "-o", js, "-q"]), 0)
            self.assertEqual(cli_main(["export", ARM, "-o", direct, "-q"]), 0)
            self.assertEqual(cli_main(["export", msv, "-o", msv, "-q"]), 1)     # 入力と同じファイルには書かない
        with open(js, encoding="utf-8") as f:
            back = json.load(f)
        with open(direct, encoding="utf-8") as f:
            want = json.load(f)
        self.assertNotIn("packagePath", back["source"])
        self.assertEqual(_strip(back), _strip(want))
        schema.validate(back)


if __name__ == "__main__":
    unittest.main()
