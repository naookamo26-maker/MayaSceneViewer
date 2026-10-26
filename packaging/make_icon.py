# -*- coding: utf-8 -*-
"""アイコン（ma_viewer/icon/MayaSceneViewer.ico）を SVG から作る。  python packaging/make_icon.py

  前提: PySide6（ビューアと同じ。SVG の描画に QtSvg を使う）

小さいサイズでは細い線が潰れるため、サイズごとに描き分けた SVG を使う。
  48px 以上: icon_large.svg（各面 2×2 のワイヤーフレーム）
  24〜32px: icon_medium.svg（線を太くした版）
  16〜20px: icon_small.svg（面の境目の線だけ）
.ico の中身は各サイズの PNG（Windows Vista 以降が読める形式）。SVG を直したら、これを実行して .ico を作り直す。
"""
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ICON_DIR = os.path.join(ROOT, "ma_viewer", "icon")
OUT = os.path.join(ICON_DIR, "MayaSceneViewer.ico")
SIZES = (16, 20, 24, 32, 40, 48, 64, 128, 256)


def svg_for(size: int) -> str:
    name = "icon_large.svg" if size >= 48 else "icon_medium.svg" if size >= 24 else "icon_small.svg"
    return os.path.join(ICON_DIR, name)


def render_png(svg_path: str, size: int) -> bytes:
    from PySide6 import QtCore, QtGui, QtSvg
    renderer = QtSvg.QSvgRenderer(svg_path)
    if not renderer.isValid():
        raise ValueError("SVG を読めません: %s" % svg_path)
    img = QtGui.QImage(size, size, QtGui.QImage.Format.Format_ARGB32)
    img.fill(QtCore.Qt.GlobalColor.transparent)
    p = QtGui.QPainter(img)
    p.setRenderHint(QtGui.QPainter.RenderHint.Antialiasing, True)
    p.setRenderHint(QtGui.QPainter.RenderHint.SmoothPixmapTransform, True)
    renderer.render(p, QtCore.QRectF(0, 0, size, size))
    p.end()
    buf = QtCore.QBuffer()
    buf.open(QtCore.QIODevice.OpenModeFlag.WriteOnly)
    img.save(buf, "PNG")
    return bytes(buf.data())


def write_ico(path: str, images) -> None:
    """images: [(size, png_bytes)]。ICONDIR・ICONDIRENTRY のあとに PNG をそのまま並べる"""
    head = struct.pack("<HHH", 0, 1, len(images))
    offset = len(head) + 16 * len(images)
    entries, blobs = b"", b""
    for size, png in images:
        dim = 0 if size >= 256 else size            # 256 は 0 と書く
        entries += struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(png), offset)
        blobs += png
        offset += len(png)
    with open(path, "wb") as f:
        f.write(head + entries + blobs)


def main() -> int:
    try:
        from PySide6 import QtGui
    except ImportError as exc:
        print("PySide6 を読み込めません（%s）。pip install PySide6 でインストールしてください。" % exc)
        return 1
    app = QtGui.QGuiApplication.instance() or QtGui.QGuiApplication(sys.argv[:1])  # noqa: F841  QImage の描画に必要
    images = [(s, render_png(svg_for(s), s)) for s in SIZES]
    write_ico(OUT, images)
    print("作成: %s（%s px）" % (os.path.relpath(OUT, ROOT), "・".join(str(s) for s in SIZES)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
