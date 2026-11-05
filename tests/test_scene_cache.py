# -*- coding: utf-8 -*-
"""変換結果のディスクキャッシュ（ma_viewer/scene_cache.py）: 使える条件・使わない条件"""
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
import time
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from ma_viewer import scene_cache  # noqa: E402
from ma_viewer.extract_ma import load_ma_staged  # noqa: E402


def convert_and_store(path: str, references: bool = True, animation: bool = True) -> dict:
    """ビューアの読み込みスレッドと同じ順に変換して保存する。(シーン, アニメーション) の JSON 文字列を返す"""
    scene, load_animation = load_ma_staged(path, references=references)
    text = json.dumps(scene, separators=(",", ":"))
    ok = scene_cache.store_scene(path, references, scene_cache.record(load_animation.scene, path), text)
    anim_text = None
    if animation:
        anim = load_animation(None)
        anim_text = json.dumps(anim, separators=(",", ":")) if anim is not None else None
        scene_cache.store_animation(path, references, anim_text)
    return {"ok": ok, "scene": text, "anim": anim_text}


def touch(path: str) -> None:
    """更新時刻を確実に変える"""
    st = os.stat(path)
    os.utime(path, ns=(st.st_atime_ns, st.st_mtime_ns + 2_000_000_000))


class SceneCacheTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="scene_cache_")
        self.env = {k: os.environ.get(k) for k in ("MA_VIEWER_CACHE_DIR", "MA_VIEWER_NO_CACHE", "MA_VIEWER_CACHE_MB")}
        os.environ["MA_VIEWER_CACHE_DIR"] = os.path.join(self.tmp, "cache")
        os.environ.pop("MA_VIEWER_NO_CACHE", None)
        os.environ.pop("MA_VIEWER_CACHE_MB", None)

    def tearDown(self):
        for k, v in self.env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
        shutil.rmtree(self.tmp, ignore_errors=True)

    def copy(self, rel: str) -> str:
        """samples/ の中のものを作業フォルダに写して、そのパスを返す"""
        src = os.path.join(ROOT, "samples", rel)
        dst = os.path.join(self.tmp, "work", rel)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
        return dst

    def test_hit_returns_the_same_text_and_misses_when_the_file_changes(self):
        path = self.copy("anim_sample.ma")
        self.assertIsNone(scene_cache.lookup(path, True, True), "まだ保存していない")
        saved = convert_and_store(path)
        self.assertTrue(saved["ok"])
        hit = scene_cache.lookup(path, True, True)
        self.assertIsNotNone(hit)
        self.assertEqual(hit.scene_text, saved["scene"])
        self.assertEqual(hit.anim_text, saved["anim"])
        self.assertIsNone(scene_cache.lookup(path, False, True), "リファレンスを読むかの設定が違えば使わない")
        touch(path)
        self.assertIsNone(scene_cache.lookup(path, True, True), ".ma が変われば使わない")

    def test_animation_is_stored_after_the_second_stage(self):
        path = self.copy("anim_sample.ma")
        convert_and_store(path, animation=False)
        self.assertIsNone(scene_cache.lookup(path, True, True), "アニメーションを保存していなければ、読むときは使わない")
        hit = scene_cache.lookup(path, True, False)
        self.assertTrue(hit is not None and hit.anim_text is None, "アニメーションを読まないなら使える")
        no_anim = self.copy("sample_arm.ma")                       # アニメーションのないシーン
        convert_and_store(no_anim)
        hit = scene_cache.lookup(no_anim, True, True)
        self.assertTrue(hit is not None and hit.animation_state == "none" and hit.anim_text is None)

    def test_reference_file_change_and_new_reference_location(self):
        proj = self.copy("reference_project")
        shot = os.path.join(proj, "scenes", "shot.ma")
        convert_and_store(shot)
        self.assertIsNotNone(scene_cache.lookup(shot, True, True))
        touch(os.path.join(proj, "assets", "arm_rig.ma"))
        self.assertIsNone(scene_cache.lookup(shot, True, True), "リファレンスのファイルが変われば使わない")
        convert_and_store(shot)
        self.assertIsNotNone(scene_cache.lookup(shot, True, True))
        # 見つからなかったリファレンス（missing）が、あとから見つかる場所に置かれた
        with open(os.path.join(scene_cache.cache_dir(), scene_cache._key(shot, True) + ".meta.json"), encoding="utf-8") as f:
            meta = json.load(f)
        missing = [r for r in meta["refs"] if r[2] is None]
        self.assertTrue(missing, "サンプルには見つからないリファレンスがある")
        name = os.path.basename(missing[0][0].replace("\\", "/"))
        shutil.copy2(os.path.join(proj, "assets", "prop.ma"), os.path.join(proj, "scenes", name))
        self.assertIsNone(scene_cache.lookup(shot, True, True), "見つからなかったリファレンスが見つかるようになれば使わない")

    def test_texture_found_later_and_node_map_file(self):
        proj = self.copy("textured_project")
        path = os.path.join(proj, "scenes", "textured_sample.ma")
        saved = convert_and_store(path)
        scene = json.loads(saved["scene"])
        found = [t for t in scene["textures"] if t.get("resolved") and not t.get("udim")]
        self.assertTrue(found)
        self.assertIsNotNone(scene_cache.lookup(path, True, True))
        os.remove(found[0]["resolved"])
        self.assertIsNone(scene_cache.lookup(path, True, True), "使っていたテクスチャがなくなれば使わない")
        convert_and_store(path)
        self.assertIsNotNone(scene_cache.lookup(path, True, True))
        with open(os.path.join(os.path.dirname(path), "ma_viewer_nodes.json"), "w") as f:
            json.dump({}, f)
        self.assertIsNone(scene_cache.lookup(path, True, True), "自作ノードの設定ファイルが置かれたら使わない")

    def test_program_version_and_disable(self):
        path = self.copy("anim_sample.ma")
        convert_and_store(path)
        old = scene_cache._CODE
        try:
            scene_cache._CODE = "another-version"
            self.assertIsNone(scene_cache.lookup(path, True, True), "ビューアのプログラムが変われば使わない")
        finally:
            scene_cache._CODE = old
        os.environ["MA_VIEWER_NO_CACHE"] = "1"
        self.assertIsNone(scene_cache.lookup(path, True, True), "MA_VIEWER_NO_CACHE=1 なら使わない")

    def test_prune_removes_least_recently_used(self):
        a, b = self.copy("anim_sample.ma"), self.copy("sample_arm.ma")
        convert_and_store(a)
        convert_and_store(b)
        now = time.time()
        meta = lambda x: os.path.join(scene_cache.cache_dir(), scene_cache._key(x, True) + ".meta.json")  # noqa: E731
        os.utime(meta(a), (now, now))                          # a を最近使った（時刻は明示する。ファイルの時刻は粗いことがある）
        os.utime(meta(b), (now - 100, now - 100))
        size_b = [x for x in scene_cache.entries() if x[0] == scene_cache._key(b, True)][0][1]
        scene_cache.prune(scene_cache.total_bytes() - size_b)
        self.assertIsNotNone(scene_cache.lookup(a, True, True))
        self.assertIsNone(scene_cache.lookup(b, True, True), "上限を超えたら、最後に使ったのが古いものから消す")
        self.assertEqual(scene_cache.clear(), 1)
        self.assertEqual(scene_cache.entries(), [])


if __name__ == "__main__":
    unittest.main()
