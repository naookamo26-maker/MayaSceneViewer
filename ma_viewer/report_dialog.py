# -*- coding: utf-8 -*-
"""リグの診断のウィンドウ（ヘルプ → リグの診断）。

診断の文章（rig_report.py。「■ 見出し」で始まる項目の並び）を項目に分け、操作方法のウィンドウと同じく、左に項目の
一覧と検索欄、右にその項目を出す。IK ハンドルのように「- 」で始まる行（または ✓ ・★ で始まる行）が並ぶ項目は、
一覧で項目の下にそれぞれを並べ、選ぶとその分だけを出す。先頭の「概要」には、項目ごとの要点（★ の数・最初の行）を出す。
文章を分けて HTML にするのは parse_sections()・section_html()（Qt なしでも使える。テスト用）。
"""
from __future__ import annotations

import html
import re
from typing import List, Optional, Tuple

OK, BAD = "✓", "★"
# 並んだもの（「- 」の行）がそのまま問題である項目（★ を付けずに並べる）
ISSUE_SECTIONS = ("評価できないノード", "値を求められないノード", "使えない自作ノードの定義", "警告",
                  "リファレンスの編集で相手のノードが見つからないもの")


class Section:
    """項目: name（一覧の名前）・inline（見出しの行のコロンのあと）・lines（本文の行）・entries（[(名前, 行)]）"""

    def __init__(self, name: str, inline: str = ""):
        self.name = name
        self.inline = inline
        self.lines: List[str] = []
        self.entries: List[Tuple[str, List[str]]] = []

    @property
    def problems(self) -> int:
        """確かめた方がよいものの数（★ の数。問題を並べる項目は、並んだ数）"""
        n = sum(line.count(BAD) for line in self.lines) + self.inline.count(BAD)
        if self.name.startswith(ISSUE_SECTIONS):
            n = max(n, sum(1 for line in self.lines if line.startswith("- ")))
        return n

    def summary(self) -> str:
        """概要の 1 行"""
        if self.inline:
            return self.inline
        for line in self.lines:
            t = line.strip()
            if t:
                return t
        return ""


def _split_heading(text: str) -> Tuple[str, str]:
    """「■ プラグイン（requires）: a、b」→（"プラグイン（requires）", "a、b"）。括弧の中のコロンでは分けない"""
    depth = 0
    for i, ch in enumerate(text):
        if ch in "（(「":
            depth += 1
        elif ch in "）)」":
            depth = max(0, depth - 1)
        elif depth == 0 and ch in ":：" and (i + 1 >= len(text) or text[i + 1] in " 　"):
            return text[:i].strip(), text[i + 1:].strip()
    return text.strip(), ""


def _entry_name(line: str) -> str:
    """「- t2_ik（ikSplineSolver）: t2_0 → …」→「t2_ik（ikSplineSolver）」"""
    t = line.strip()
    if t.startswith("- "):
        t = t[2:]
    name, _rest = _split_heading(t)
    return name


def _is_entry(line: str) -> bool:
    return line.startswith("- ") or line.startswith(OK + " ") or line.startswith(BAD + " ")


def parse_sections(text: str) -> Tuple[List[str], List[Section]]:
    """診断の文章 →（前書きの行, 項目の並び）"""
    head: List[str] = []
    sections: List[Section] = []
    cur: Optional[Section] = None
    for line in text.splitlines():
        if line.startswith("リグの診断") or (line.startswith("（" + OK) and BAD in line):   # 前書き（どこにあっても）
            head.append(line)
            cur = None
            continue
        if line.startswith("■"):
            name, inline = _split_heading(line[1:].strip())
            cur = Section(name, inline)
            sections.append(cur)
            continue
        if cur is None:
            if line.strip():
                head.append(line)
            continue
        cur.lines.append(line)
    for s in sections:
        while s.lines and not s.lines[-1].strip():
            s.lines.pop()
        # 項目の中の並び（「- 」や ✓ ・★ で始まる行と、その下の字下げした行）
        entries: List[Tuple[str, List[str]]] = []
        for line in s.lines:
            if _is_entry(line):
                entries.append((_entry_name(line), [line]))
            elif entries and (line.startswith(" ") or not line.strip()):
                entries[-1][1].append(line)
        # 2 つ以上で、名前が短く重ならないときだけ一覧で分ける（警告のような長い文の並びは分けない）
        names = [n for n, _ in entries]
        if len(entries) >= 2 and len(set(names)) == len(names) and all(len(n) <= 48 for n in names):
            s.entries = entries
    return head, sections


# ---------------------------------------------------------------------------
# HTML

def _css(dark: bool) -> str:
    fg_dim = "#9aa0a6" if dark else "#5f6368"
    ok = "#5bb974" if dark else "#188038"
    bad = "#f28b82" if dark else "#c5221f"
    return ("<style>h2 { margin: 0 0 6px; } .inline { margin: 0 0 8px; } .dim { color: %s; }"
            " .ok { color: %s; } .bad { color: %s; font-weight: bold; }"
            " pre { white-space: pre-wrap; margin: 0; font-family: monospace; }"
            " td, th { padding: 3px 10px 3px 0; vertical-align: top; text-align: left; }"
            " hr { border: 0; border-top: 1px solid %s; }</style>" % (fg_dim, ok, bad, fg_dim))


def _line_html(line: str) -> str:
    e = html.escape(line)
    e = e.replace(BAD, '<span class="bad">%s</span>' % BAD).replace(OK, '<span class="ok">%s</span>' % OK)
    return e


def _lines_html(lines: List[str]) -> str:
    return "<pre>%s</pre>" % "\n".join(_line_html(x) for x in lines)


def overview_html(head: List[str], sections: List[Section], dark: bool = False) -> str:
    rows = []
    for s in sections:
        n = s.problems
        state = '<span class="bad">%s %d</span>' % (BAD, n) if n else '<span class="ok">%s</span>' % OK
        rows.append("<tr><td>%s</td><td>%s</td><td class=\"dim\">%s</td></tr>"
                    % (html.escape(s.name), state, html.escape(s.summary())))
    return (_css(dark) + "<h2>概要</h2>" + _lines_html(head) + "<hr>"
            + "<p class=\"dim\">左の一覧から項目を選ぶと、その内容を表示します（%s のある項目は評価できないものを含みます）。</p>" % BAD
            + "<table><tr><th>項目</th><th>状態</th><th>要点</th></tr>%s</table>" % "".join(rows))


def section_html(s: Section, entry: Optional[int] = None, dark: bool = False) -> str:
    out = [_css(dark), "<h2>%s</h2>" % html.escape(s.name)]
    if entry is not None and 0 <= entry < len(s.entries):
        name, lines = s.entries[entry]
        out[1] = "<h2>%s ／ %s</h2>" % (html.escape(s.name), html.escape(name))
        out.append(_lines_html(lines))
        return "".join(out)
    if s.inline:
        out.append('<p class="inline">%s</p>' % _line_html(s.inline))
    if s.lines:
        out.append(_lines_html(s.lines))
    elif not s.inline:
        out.append('<p class="dim">なし</p>')
    return "".join(out)


def search_html(sections: List[Section], query: str, dark: bool = False) -> str:
    """検索: 言葉を含む行を項目ごとに出す"""
    q = query.strip().lower()
    out = [_css(dark), "<h2>「%s」を含む行</h2>" % html.escape(query.strip())]
    found = 0
    for s in sections:
        hits = [x for x in ([s.inline] if s.inline else []) + s.lines if q in x.lower()]
        if hits:
            found += len(hits)
            out.append("<h3>%s</h3>" % html.escape(s.name))
            out.append(_lines_html(hits))
    if not found:
        out.append('<p class="dim">見つかりません。</p>')
    return "".join(out)


# ---------------------------------------------------------------------------
# ウィンドウ

def show_report(parent, title: str, text: str):
    """リグの診断のウィンドウを開く（左に項目の一覧と検索欄、右にその項目）"""
    from .qt_compat import QtGui, QtWidgets
    head, sections = parse_sections(text)
    dlg = QtWidgets.QDialog(parent)
    dlg.setWindowTitle(title)
    dlg.resize(980, 680)
    dark = dlg.palette().color(QtGui.QPalette.ColorRole.Window).lightness() < 128

    search_box = QtWidgets.QLineEdit()
    search_box.setPlaceholderText("検索（例: ★、ノードの名前）")
    search_box.setClearButtonEnabled(True)
    tree = QtWidgets.QTreeWidget()
    tree.setHeaderHidden(True)
    tree.setFixedWidth(260)
    tree.setStyleSheet("QTreeWidget::item { padding: 4px 2px; }")
    top = QtWidgets.QTreeWidgetItem(["概要"])
    top.setData(0, 256, (-1, None))
    tree.addTopLevelItem(top)
    for i, s in enumerate(sections):
        label = ("%s %s" % (BAD, s.name)) if s.problems else s.name
        item = QtWidgets.QTreeWidgetItem([label])
        item.setData(0, 256, (i, None))
        item.setToolTip(0, s.name)
        for j, (name, lines) in enumerate(s.entries):
            bad = any(BAD in x for x in lines)
            child = QtWidgets.QTreeWidgetItem([("%s %s" % (BAD, name)) if bad else name])
            child.setData(0, 256, (i, j))
            child.setToolTip(0, name)
            item.addChild(child)
        tree.addTopLevelItem(item)
    view = QtWidgets.QTextBrowser()
    view.setOpenLinks(False)

    def refresh():
        q = search_box.text()
        tree.setEnabled(not q.strip())
        if q.strip():
            view.setHtml(search_html(sections, q, dark))
            return
        item = tree.currentItem()
        i, j = item.data(0, 256) if item is not None else (-1, None)
        view.setHtml(overview_html(head, sections, dark) if i < 0 else section_html(sections[i], j, dark))

    tree.currentItemChanged.connect(lambda *_: refresh())
    search_box.textChanged.connect(lambda _t: refresh())
    left = QtWidgets.QVBoxLayout()
    left.addWidget(search_box)
    left.addWidget(tree, 1)
    body = QtWidgets.QHBoxLayout()
    body.addLayout(left)
    body.addWidget(view, 1)
    b_copy = QtWidgets.QPushButton("すべてコピー")
    b_copy.clicked.connect(lambda: QtWidgets.QApplication.clipboard().setText(text))
    b_close = QtWidgets.QPushButton("閉じる")
    b_close.clicked.connect(dlg.accept)
    row = QtWidgets.QHBoxLayout()
    row.addStretch(1)
    row.addWidget(b_copy)
    row.addWidget(b_close)
    lay = QtWidgets.QVBoxLayout(dlg)
    lay.addLayout(body, 1)
    lay.addLayout(row)
    tree.setCurrentItem(top)
    refresh()
    dlg.report_tree = tree                 # テスト用
    dlg.report_view = view
    dlg.report_search = search_box
    dlg.show()
    return dlg
