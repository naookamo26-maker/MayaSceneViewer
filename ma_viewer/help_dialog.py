# -*- coding: utf-8 -*-
"""操作方法（ヘルプ → 操作方法、F1）のウィンドウ。

左に項目の一覧と検索欄、右にその項目の操作を表で出す。キーはキーキャップの形、ツールバーのボタンは
ビューアと同じアイコン（web/index.html の SVG）で示す。内容は SECTIONS にまとめ、HTML にするのは
section_html()（Qt なしでも使える。テスト用）。
"""
from __future__ import annotations

import html
import re
from typing import Dict, List, Optional, Sequence, Tuple

# 1 行 = (操作, 説明)。操作はキー・マウスの操作の並び（"@ボタンの id" はツールバーのアイコン、"［…］" はメニュー・ボタンの名前）
Row = Tuple[Sequence[str], str]
# 項目 = (名前, 一言の説明, 行, 補足（箇条書き）)
Section = Tuple[str, str, List[Row], List[str]]

SECTIONS: List[Section] = [
    ("視点", "ビューポートの見る向き・位置・大きさ", [
        (("左ドラッグ",), "回転"),
        (("中ドラッグ",), "移動"),
        (("右ドラッグ", "ホイール"), "ズーム"),
        (("F", "@btn-frame-sel"), "選択したものを画面に収める"),
        (("A", "@btn-frame-all"), "全体を画面に収める"),
        (("C",), "次のシーンのカメラから見る（ツールバーの［カメラ］でも選べる）"),
        (("Shift+C",), "自由視点に戻す"),
    ], [
        "カメラから見ているときも、停止中はドラッグで視点を動かせます（表示だけ。フレームを動かすか再生すると戻ります）。",
    ]),
    ("選択", "ノード・頂点を選ぶ", [
        (("クリック",), "ジョイント・カーブ・オブジェクトを選ぶ"),
        (("Esc",), "選択を解除"),
        (("F8", "@object", "@vertex"), "オブジェクトの選択と頂点の選択を切り替える（頂点ではいちばん近い頂点のウェイトを表示）"),
        (("@opt-pick-all",), "選択の制限を無視する（オンにすると、Maya のビューポートで選べないものもクリックで選ぶ）"),
    ], [
        "Maya のビューポートで選べないものは、クリックでは選びません: テンプレート、表示の種類がテンプレート・リファレンスのもの"
        "（ディスプレイレイヤー・描画のオーバーライド。ロケーターなどのシェイプ側の設定も含む）。階層からは選べます。",
    ]),
    ("ポーズ確認", "ハンドル・数値で動かして変形を確かめる（保存しない）", [
        (("Q", "@select"), "選択ツール"),
        (("W", "@translate"), "移動のハンドル"),
        (("E", "@rotate"), "回転のハンドル"),
        (("R", "@scale"), "スケールのハンドル"),
        (("+", "−"), "ハンドルの大きさ"),
        (("@opt-space",), "ハンドルの向き（オン: ワールド、オフ: ローカル）"),
        (("Ctrl+Z", "@btn-undo"), "元に戻す（Z でも可）"),
        (("Ctrl+Y", "Ctrl+Shift+Z", "@btn-redo"), "やり直す（Shift+Z でも可）"),
        (("［このノードを戻す］", "［すべて戻す］"), "動かした分を戻す（右パネル［選択］）"),
    ], [
        "右パネル［選択］のポーズ確認欄で、移動・回転・スケールを数値でも変えられます。",
        "コントローラーを動かすと、IK・コンストレイント・計算ノード・exprespy などが追従します。",
        "Maya でロックした属性は動きません。移動・回転・スケールの制限（limit）のあるものは、範囲の端で止まります。",
        "キーのある属性を動かした分は、フレームを変えるとカーブの値に戻ります。",
    ]),
    ("表示", "表示するものと表示の仕方", [
        (("4",), "ワイヤーのみ"),
        (("5",), "シェーディング（テクスチャなし）"),
        (("6", "@opt-tex"), "シェーディング（テクスチャあり）"),
        (("@opt-wire",), "ワイヤーを重ねる"),
        (("J", "@opt-joints"), "ジョイントの表示"),
        (("L", "@opt-controls"), "コントローラーの目印の表示（右の ▾ で、種別ごとの表示・色・大きさ）"),
        (("@opt-curves",), "NURBS カーブの表示"),
        (("@opt-xray",), "ジョイント・コントローラーを前面に表示（メッシュに隠れても見える）"),
        (("@opt-grid",), "グリッドの表示"),
        (("H",), "選択中のノードの表示・非表示を切り替える（階層の目のアイコンでも）"),
        (("Ctrl+H",), "隠す"),
        (("Shift+H",), "表示する"),
        (("B", "@opt-bind"), "バインドポーズとファイルの値（アニメーションの姿勢）を切り替える"),
        (("@opt-skin",), "スキン変形（オフでバインド時の形）"),
    ], [
        "ツールバーの［表示］で、シェーディング・ライト（フラットにするとテクスチャの色をそのまま表示）・ジョイントの軸と大きさ・"
        "再生のフレームレートの表示・リグの再生キャッシュの上限を選べます。",
        "薄く破線の枠のボタンは、いまの表示設定では効果がありません（ツールチップに理由を表示）。",
    ]),
    ("アニメーション", ".ma にキー・リグがあるとき（ビューポート下端のタイムライン）", [
        (("Alt+V", "@tl-play"), "再生・停止"),
        (("Alt+,", "@tl-prev"), "前のフレーム"),
        (("Alt+.", "@tl-next"), "次のフレーム"),
        ((",", "@tl-prev-key"), "前のキー"),
        ((".", "@tl-next-key"), "次のキー"),
        (("Home", "@tl-first"), "先頭のフレーム"),
        (("End", "@tl-last"), "最後のフレーム"),
    ], [
        "アニメーションはシーンの表示後に読み込みます。キーがあれば、姿勢の基準は自動で「ファイルの値」になります。",
        "コンストレイント・IK・計算ノード・ドリブンキー・expression・exprespy・キャラクターセット（Trax のクリップ）も評価します。",
        "シーンにショットがあると、ビューポートの上にカメラシーケンサを出します。トラックをクリックするか再生すると、"
        "ショットのカメラとフレームで表示します。",
        "再生中はビューポートの左上に、実際に表示できたフレームレートを出します（処理落ちすると赤くなります）。",
    ]),
    ("ウェイト・マップ", "スキンのウェイトとテクスチャのマップを確かめる", [
        (("［ウェイト］",), "「選択ジョイント」にしてジョイントを選ぶと、ヒートマップを表示（インフルエンスごとの色分けも）"),
        (("F8",), "頂点を選んで、その頂点のウェイトを表示"),
        (("［マップ］",), "合成（PBR）表示と、各マップ（ベースカラー・法線・ラフネス・メタリック・AO・エミッシブ・不透明度）の単独表示"),
    ], [
        "ジョイントを選んで W・E・R で動かすと、ウェイトによる変形を確かめられます。",
    ]),
    ("パネル", "左右のパネルと階層", [
        (("‹", "›"), "パネルを最小化する（最小化した帯をクリックで戻す）"),
        (("左パネルの右端をドラッグ",), "左パネルの幅を変える（ダブルクリックで元の幅）"),
        (("Shift+クリック",), "階層の ▸ ▾ で、その下の階層もまとめて開閉する"),
        (("@tree-expand-all", "@tree-collapse-all"), "階層をすべて開く・閉じる"),
        (("F",), "マウスが階層の上: 選択している行まで階層を開いてスクロール（ビューポートで選んでも階層は開かない）"),
        (("↑", "↓"), "マウスが階層の上: 前後の行を選ぶ"),
        (("←", "→"), "マウスが階層の上: 閉じる・開く（閉じていれば親、開いていれば最初の子を選ぶ）"),
        (("@btn-warnings",), "読み込み時の警告を表示"),
    ], [
        "階層の操作は Maya のアウトライナーに合わせています。閉じた中に選択があると、その祖先の行を薄く強調します。",
        "名前で絞り込むと、名前の合う行とその親の行（薄く）を表示します。",
    ]),
    ("メニュー", "ウィンドウ上部のメニュー", [
        (("Ctrl+O",), "［ファイル］開く（.ma・共通 JSON。ウィンドウへのドラッグ＆ドロップでも開ける）"),
        (("F5",), "［ファイル］再読み込み"),
        (("Ctrl+Shift+E",), "［ファイル］JSON として書き出し"),
        (("［アニメーションを読み込む］",), "［ファイル］.ma のアニメーションを読み込むか（次に開くファイルから）"),
        (("［リファレンスを読み込む］",), "［ファイル］リファレンス（file -r）の中身を、名前空間を付けて読み込むか（次に開くファイルから）"),
        (("［exprespy を評価する］",), "［ファイル］exprespy を評価するか（結果がおかしいときの切り分け用。オフにするとつながる値はファイルの値）"),
        (("Ctrl+W",), "［ファイル］閉じる"),
        (("Ctrl+Z", "Ctrl+Y"), "［編集］元に戻す・やり直す（ポーズ確認・表示の切り替えなど）"),
        (("Ctrl+L",), "［表示］ログ（警告は下部のパネルのタブで切り替え）"),
        (("［リグの診断…］",), "［表示］評価できないノード・リファレンスの編集の相手・IK の上流などを一覧にする"),
        (("F12",), "［表示］開発者ツール"),
        (("F1",), "［ヘルプ］この操作方法"),
    ], [
        "Maya の中で開いたときは［Maya］メニューで、Maya のシーン・選択から読み込み、選択を Maya と合わせられます。",
    ]),
]

def section_names() -> List[str]:
    return [s[0] for s in SECTIONS]


def _matches(text: str, words: List[str]) -> bool:
    t = text.lower()
    return all(w in t for w in words)


def search(query: str) -> List[Tuple[Section, List[Row], List[str]]]:
    """検索語（空白区切り。すべて含むもの）に合う行と補足を、項目ごとに返す"""
    words = [w.lower() for w in query.split() if w]
    out = []
    for sec in SECTIONS:
        name, lead, rows, notes = sec
        if words and _matches(name + " " + lead, words):
            out.append((sec, rows, notes))
            continue
        hit_rows = [r for r in rows if _matches(" ".join(r[0]) + " " + r[1], words)]
        hit_notes = [n for n in notes if _matches(n, words)]
        if hit_rows or hit_notes:
            out.append((sec, hit_rows, hit_notes))
    return out


def _colors(dark: bool) -> Dict[str, str]:
    if dark:
        return {"key_bg": "#3b4048", "key_fg": "#f1f3f4", "muted": "#a7adb5", "rule": "#454b54", "head": "#e8eaed",
                "accent": "#8ab4f8"}
    return {"key_bg": "#e8eaed", "key_fg": "#202124", "muted": "#5f6368", "rule": "#dadce0", "head": "#202124",
            "accent": "#1a73e8"}


def _op_html(op: str, c: Dict[str, str], icons: Dict[str, bool]) -> str:
    if op.startswith("@"):
        if icons.get(op[1:]):
            return '<img src="icon:%s" width="22" height="22">' % html.escape(op[1:])
        return ""
    if op.startswith("［"):
        return '<span style="color:%s;">%s</span>' % (c["accent"], html.escape(op))
    return ('<span style="background-color:%s; color:%s; font-family:Consolas,Menlo,monospace;">&nbsp;%s&nbsp;</span>'
            % (c["key_bg"], c["key_fg"], html.escape(op)))


def _rows_html(rows: List[Row], c: Dict[str, str], icons: Dict[str, bool]) -> str:
    if not rows:
        return ""
    out = ['<table width="100%" cellspacing="0" cellpadding="6" style="margin-top:4px;">']
    for k, (ops, text) in enumerate(rows):
        parts = [p for p in (_op_html(o, c, icons) for o in ops) if p]
        desc = html.escape(text)
        border = "" if k == len(rows) - 1 else "border-bottom:1px solid %s;" % c["rule"]
        out.append('<tr><td width="28%%" style="%s white-space:nowrap;">%s</td><td style="%s">%s</td></tr>'
                   % (border, "&nbsp;".join(parts), border, desc))
    out.append("</table>")
    return "".join(out)


def _notes_html(notes: List[str], c: Dict[str, str]) -> str:
    if not notes:
        return ""
    items = "".join('<li style="margin-bottom:4px;">%s</li>' % html.escape(n) for n in notes)
    return '<p style="color:%s; margin:12px 0 2px 0;">補足</p><ul style="margin-top:0;">%s</ul>' % (c["muted"], items)


def section_html(index: Optional[int] = None, query: str = "", dark: bool = False,
                 icons: Optional[Dict[str, bool]] = None) -> str:
    """項目 index（または検索語 query に合うもの）の HTML。icons は使えるアイコン（id → True）"""
    c = _colors(dark)
    icons = icons or {}
    if query.strip():
        found = search(query)
        if not found:
            return '<p style="color:%s;">「%s」に合う操作はありません。</p>' % (c["muted"], html.escape(query))
        blocks = []
        for (name, _lead, _rows, _notes), rows, notes in found:
            blocks.append('<h3 style="color:%s; margin:14px 0 2px 0;">%s</h3>%s%s'
                          % (c["head"], html.escape(name), _rows_html(rows, c, icons), _notes_html(notes, c)))
        return "".join(blocks)
    name, lead, rows, notes = SECTIONS[index or 0]
    return ('<h2 style="color:%s; margin:0;">%s</h2><p style="color:%s; margin:2px 0 8px 0;">%s</p>%s%s'
            % (c["head"], html.escape(name), c["muted"], html.escape(lead), _rows_html(rows, c, icons),
               _notes_html(notes, c)))


def used_icons() -> List[str]:
    """SECTIONS で使うツールバーのアイコンの id"""
    out = []
    for _n, _l, rows, _notes in SECTIONS:
        for ops, _t in rows:
            out += [o[1:] for o in ops if o.startswith("@") and o[1:] not in out]
    return out


def toolbar_svgs(index_html_path: str) -> Dict[str, str]:
    """web/index.html のボタン（id か data-tool・data-pick）のアイコンの SVG"""
    try:
        with open(index_html_path, encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return {}
    out = {}
    for m in re.finditer(r'<button\b([^>]*)>\s*(<svg\b.*?</svg>)', text, re.S):
        attrs = m.group(1)
        key = re.search(r'\b(?:id|data-tool|data-pick)="([^"]+)"', attrs)
        if key and key.group(1) not in out:
            out[key.group(1)] = m.group(2)
    return out


def show_help(parent, index_html_path: Optional[str]):
    """操作方法のウィンドウを開く（同じ親から 2 回目以降は、前のウィンドウを前に出す）"""
    from .qt_compat import QtCore, QtGui, QtWidgets
    old = getattr(parent, "_help_dialog", None)
    if old is not None:
        try:
            old.show()
            old.raise_()
            old.activateWindow()
            return old
        except RuntimeError:
            pass
    dlg = QtWidgets.QDialog(parent)
    dlg.setWindowTitle("操作方法")
    dlg.resize(880, 640)
    pal = dlg.palette()
    dark = pal.color(QtGui.QPalette.ColorRole.Window).lightness() < 128
    text_color = pal.color(QtGui.QPalette.ColorRole.WindowText).name()

    search_box = QtWidgets.QLineEdit()
    search_box.setPlaceholderText("検索（例: 再生、ロック、F8）")
    search_box.setClearButtonEnabled(True)
    lst = QtWidgets.QListWidget()
    lst.addItems(section_names())
    lst.setFixedWidth(170)
    lst.setStyleSheet("QListWidget::item { padding: 6px 8px; }")
    view = QtWidgets.QTextBrowser()
    view.setOpenLinks(False)

    icons = {}
    svgs = toolbar_svgs(index_html_path) if index_html_path else {}
    try:
        from PySide6 import QtSvg
    except ImportError:  # pragma: no cover - QtSvg のない環境ではアイコンなし
        QtSvg = None
    if QtSvg is not None:
        doc = view.document()
        scale = 3
        for key in used_icons():
            svg = svgs.get(key)
            if not svg:
                continue
            r = QtSvg.QSvgRenderer(QtCore.QByteArray(svg.replace("currentColor", text_color).encode("utf-8")))
            if not r.isValid():
                continue
            img = QtGui.QImage(22 * scale, 22 * scale, QtGui.QImage.Format.Format_ARGB32_Premultiplied)
            img.fill(0)
            p = QtGui.QPainter(img)
            r.render(p, QtCore.QRectF(1 * scale, 1 * scale, 20 * scale, 20 * scale))
            p.end()                        # 大きく描いて、表示は width・height で縮める（高解像度の画面用。22 ピクセル）
            doc.addResource(QtGui.QTextDocument.ResourceType.ImageResource, QtCore.QUrl("icon:" + key), img)
            icons[key] = True

    def refresh():
        q = search_box.text()
        lst.setEnabled(not q.strip())
        view.setHtml(section_html(lst.currentRow(), q, dark, icons))

    lst.currentRowChanged.connect(lambda _r: refresh())
    search_box.textChanged.connect(lambda _t: refresh())
    left = QtWidgets.QVBoxLayout()
    left.addWidget(search_box)
    left.addWidget(lst, 1)
    body = QtWidgets.QHBoxLayout()
    body.addLayout(left)
    body.addWidget(view, 1)
    close = QtWidgets.QPushButton("閉じる")
    close.clicked.connect(dlg.close)
    row = QtWidgets.QHBoxLayout()
    row.addStretch(1)
    row.addWidget(close)
    lay = QtWidgets.QVBoxLayout(dlg)
    lay.addLayout(body, 1)
    lay.addLayout(row)
    lst.setCurrentRow(0)
    refresh()
    parent._help_dialog = dlg
    dlg.help_view = view                   # テスト用
    dlg.help_search = search_box
    dlg.help_list = lst
    dlg.show()
    return dlg

