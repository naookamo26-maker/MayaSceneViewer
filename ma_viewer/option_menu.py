# -*- coding: utf-8 -*-
"""Maya のオプションボックス（❒）のように、項目の右端にオプションを開くボタンを付けられるメニュー。

項目そのものは Qt の標準の描画のまま（文字・ハイライトの色はパレットに従う）にし、右端の四角だけを
パレットの色で描き足す（暗い配色・明るい配色・Maya の配色のどれでも、ほかの項目と同じ色になる）。

  * 項目の左側をクリック・Enter: 項目の動作（いつもの設定で実行）
  * 右端の四角をクリック・→ キー: オプションを開く
"""
from __future__ import annotations

from typing import Callable, Dict

from .qt_compat import QtCore, QtGui, QtWidgets

# ショートカットの表示の右に、四角を描く場所を空ける（全角の空白。QMenu は幅の計算にも含める）
_BOX_GAP = "　　"


class OptionBoxMenu(QtWidgets.QMenu):
    def __init__(self, title: str, parent=None):
        super().__init__(title, parent)
        self._boxes: Dict[QtGui.QAction, Callable[[], None]] = {}
        self.setMouseTracking(True)
        self._hover_box = None

    def set_option_box(self, action: QtGui.QAction, callback: Callable[[], None]) -> None:
        """action の右端に四角を付け、押したら callback を呼ぶ（メニューを閉じてから）"""
        self._boxes[action] = callback
        shortcut = action.shortcut().toString(QtGui.QKeySequence.SequenceFormat.NativeText)
        label = action.text().split("\t")[0]
        action.setText("%s\t%s%s" % (label, shortcut, _BOX_GAP))
        tip = action.toolTip() if action.toolTip() != label else ""
        action.setToolTip((tip + "\n" if tip else "") + "右端の ❒（または →）でオプションを開く")
        self.setToolTipsVisible(True)

    def has_option_box(self, action) -> bool:
        return action in self._boxes

    def box_rect(self, action) -> QtCore.QRect:
        """四角の位置（メニューの座標）"""
        r = self.actionGeometry(action)
        size = max(8, min(r.height() - 10, self.fontMetrics().height() - 4))
        right = r.right() - max(6, (self.fontMetrics().horizontalAdvance(_BOX_GAP) - size) // 2)
        return QtCore.QRect(right - size, r.center().y() - size // 2, size, size)

    def _box_hit(self, action, pos: QtCore.QPoint) -> bool:
        if action not in self._boxes or not action.isEnabled():
            return False
        r = self.box_rect(action)
        hit = QtCore.QRect(r.left() - 6, self.actionGeometry(action).top(), self.width() - r.left() + 6,
                           self.actionGeometry(action).height())
        return hit.contains(pos)

    def open_options(self, action) -> None:
        cb = self._boxes.get(action)
        if cb is None:
            return
        self.hide()                                   # メニューを閉じてから開く（ダイアログがメニューの裏にならない）
        QtCore.QTimer.singleShot(0, cb)

    # ---- 描画・操作
    def paintEvent(self, event):
        super().paintEvent(event)
        if not self._boxes:
            return
        p = QtGui.QPainter(self)
        p.setRenderHint(QtGui.QPainter.RenderHint.Antialiasing, False)
        pal = self.palette()
        for action in self._boxes:
            if not action.isVisible() or not self.actionGeometry(action).isValid():
                continue
            active = self.activeAction() is action
            group = (QtGui.QPalette.ColorGroup.Normal if action.isEnabled() else QtGui.QPalette.ColorGroup.Disabled)
            color = pal.color(group, QtGui.QPalette.ColorRole.HighlightedText if active
                              else QtGui.QPalette.ColorRole.Text)
            r = self.box_rect(action)
            if active and self._hover_box is action:
                fill = QtGui.QColor(color)
                fill.setAlpha(70)
                p.fillRect(r.adjusted(-2, -2, 3, 3), fill)
            p.setPen(QtGui.QPen(color, 1))
            p.setBrush(QtCore.Qt.BrushStyle.NoBrush)
            p.drawRect(r)
        p.end()

    def mouseMoveEvent(self, event):
        super().mouseMoveEvent(event)
        pos = event.position().toPoint()
        action = self.actionAt(pos)
        hover = action if action is not None and self._box_hit(action, pos) else None
        if hover is not self._hover_box:
            self._hover_box = hover
            self.update()

    def leaveEvent(self, event):
        self._hover_box = None
        super().leaveEvent(event)
        self.update()

    def mouseReleaseEvent(self, event):
        pos = event.position().toPoint()
        action = self.actionAt(pos)
        if action is not None and self._box_hit(action, pos):
            self.open_options(action)
            return
        super().mouseReleaseEvent(event)

    def keyPressEvent(self, event):
        action = self.activeAction()
        if event.key() == QtCore.Qt.Key.Key_Right and action is not None and action in self._boxes and action.isEnabled():
            self.open_options(action)
            return
        super().keyPressEvent(event)


# 暗い配色（スタンドアロン）のメニューの区切り線。Fusion は背景より少し暗い色で描くため、暗い背景では見えない
MENU_SEPARATOR_CSS = "QMenu::separator { height: 1px; background: %s; margin: 4px 8px; }"
