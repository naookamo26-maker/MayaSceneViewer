# -*- coding: utf-8 -*-
"""シーンを開くときの経過の記録（ログに出す）。

ファイルを開き始めてから、段階が終わるたびに mark() で記録し、すべて終わったら summary() の文章をログに出す:

  読み込みの経過（開始からの秒数・その段階にかかった秒数）
    +0.00 秒  開始
    +1.23 秒  解析・変換（1.23 秒）
    +1.80 秒  ビューアでの組み立てと最初の描画（0.57 秒）
    …
  シーンを開くのに 2.55 秒かかりました。

段階の終わりは、Python の読み込みスレッド（解析・変換、アニメーションの解析）と、ビューア（最初の描画・
アニメーションの準備）の両方から届く。ビューアの段階は届いた時刻で記録する。
"""
from __future__ import annotations

import time
from typing import Callable, List, Optional, Tuple


def fmt_seconds(s: float) -> str:
    return "%.2f 秒" % s


class LoadClock:
    """1 回の読み込みの経過。expect_animation: アニメーションの準備が終わるまでを「開く」に含める"""

    def __init__(self, path: str, now: Callable[[], float] = time.perf_counter):
        self.path = path
        self.now = now
        self.start = now()
        self.marks: List[Tuple[str, float]] = [("開始", 0.0)]
        self.scene_done = False
        self.expect_animation = False
        self.animation_done = False
        self.finished_at: Optional[float] = None

    def elapsed(self) -> float:
        return self.now() - self.start

    def mark(self, label: str) -> float:
        t = self.elapsed()
        self.marks.append((label, t))
        return t

    @property
    def finished(self) -> bool:
        return self.finished_at is not None

    def ready(self) -> bool:
        """シーンの表示（と、読むならアニメーションの準備）が終わった"""
        return self.scene_done and (not self.expect_animation or self.animation_done)

    def finish(self) -> float:
        if self.finished_at is None:
            self.finished_at = self.marks[-1][1] if len(self.marks) > 1 else self.elapsed()
        return self.finished_at

    def summary(self) -> str:
        lines = ["読み込みの経過（開始からの秒数・その段階にかかった秒数）"]
        prev = 0.0
        for label, t in self.marks:
            if label == "開始":
                lines.append("  +%s  開始" % fmt_seconds(t))
            else:
                lines.append("  +%s  %s（%s）" % (fmt_seconds(t), label, fmt_seconds(t - prev)))
            prev = t
        return "\n".join(lines)

    def total_message(self) -> str:
        return "シーンを開くのに %.2f 秒かかりました。" % self.finish()
