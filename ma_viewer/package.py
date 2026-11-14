# -*- coding: utf-8 -*-
"""シーンのパッケージ（.msv）の書き出しと読み込み。

.msv は zip で、共通 JSON と数値のバイナリ・テクスチャを 1 ファイルにまとめたもの。共通 JSON（.json）より小さく、
テクスチャも入るので、別の PC やブラウザでもそのまま同じ見た目で開ける。

  manifest.json   {"format": "maya-scene-viewer-package", "version": 2, "textures": "albedo", ...}
  scene.json      共通 JSON（animation を含む）。数値の配列（base64 の {"dtype", "count", "data"}）は
                  {"dtype", "count", "buffer": "bin/data.bin", "offset": バイト位置, "encoding": 詰め方} に置き換える
  bin/data.bin    数値の配列を並べたバイナリ（各配列の先頭は 4 バイト境界）。配列ごとに、よく縮むように詰め直してある
                  （encoding。配列ごとに、いちばん小さく縮むものを選ぶ）:
                    "none"           リトルエンディアンの値がそのまま並ぶ（version 1 の .msv は encoding がなく、これと同じ）
                    "shuffle"        値のバイトを桁ごとに並べ替える（全要素の 1 バイト目、2 バイト目、…の順）
                    "delta-shuffle"  整数だけ: 前の要素との差（型の桁で回り込む。先頭は 0 との差）にしてから、同じく並べ替える
  textures/*      同梱したテクスチャ（Pillow があれば WebP にする。textures[i].packed がその名前）
  view.json       書き出したときの表示の状態（カメラ・表示設定・非表示・フレーム・ポーズ。省略可）。
                  ビューアが作る（web_src/src/main.js の viewState）。読み込むと scene["savedView"] に入る

zip の圧縮は、JSON とバイナリは deflate、WebP・PNG・JPEG（もともと圧縮されている画像）は無圧縮で入れる。
読み込みは一時ファイルを作らず、メモリの上で展開する。

テクスチャ（textures の各項目）:
  * 同梱したもの: "packed" に zip の中の名前、"format" に形式（"webp" など）。"resolved"・"url" は null
    （UDIM はタイルごとに tiles[k].packed）
  * 同梱しなかったもの: "packed": null、"omitted": "albedo-only"（アルベドだけ入れたとき）・"none"（入れないとき）・
    "missing"（元から見つからない）・"unreadable"（読めない・表示できない形式）
"""
from __future__ import annotations

import base64
import io
import json
import os
import time
import zipfile
import zlib
from typing import Callable, Dict, List, Optional, Tuple

from . import schema
from .version import __version__

EXT = ".msv"
FORMAT_NAME = "maya-scene-viewer-package"
FORMAT_VERSION = 2               # 2: 数値の配列を詰め直す（encoding）。1 の .msv も読める
BIN_NAME = "bin/data.bin"
VIEW_NAME = "view.json"
_RUNTIME_KEYS = ("packagePath", )          # source の中の、読み込み時だけ付けるキー（書き出さない）
TEXTURE_MODES = ("albedo", "all", "none")
DEFAULT_TEXTURES = "albedo"
DEFAULT_MAX_SIZE = 2048          # ビューアが表示に使う大きさの上限（web_src/src/textures.js の MAX_TEXTURE_SIZE）と同じ
DEFAULT_QUALITY = 75               # WebP の品質（80 → 75 で、色の画像は約 2 割・法線マップは約 4 割小さく、見た目の差はわずか）
_STORED_EXT = (".webp", ".png", ".jpg", ".jpeg")
_DTYPE_SIZE = {"float32": 4, "int32": 4, "uint16": 2, "uint8": 1}
_INT_DTYPES = {"int32": ("<u4", "I"), "uint16": ("<u2", "H"), "uint8": ("u1", "B")}   # 差を取る型（符号なしで回り込む）
BIN_COMPRESS_LEVEL = 1           # 数値のバイナリの deflate のレベル（6 と大きさはほぼ同じで、2〜3 倍速い）


def is_package(path: str) -> bool:
    return str(path).lower().endswith(EXT)


class PackageError(ValueError):
    pass


# ---------------------------------------------------------------------------- 画像の変換
def pillow_status() -> Tuple[bool, str]:
    """(WebP に変換できるか, できないときの理由)"""
    try:
        from PIL import Image, features   # noqa: F401
    except ImportError:
        return False, "Pillow がありません（pip install Pillow で入れると、テクスチャを WebP にして小さくできます）"
    try:
        if not features.check("webp"):
            return False, "Pillow が WebP に対応していません"
    except Exception:  # noqa: BLE001
        pass
    return True, ""


def convert_image(data: bytes, max_size: int = DEFAULT_MAX_SIZE, quality: int = DEFAULT_QUALITY) -> Tuple[bytes, dict]:
    """画像のバイト列を WebP にする（長い辺を max_size 以下に縮める。アルファは残す）。
    戻り値: (WebP のバイト列, {"width", "height", "sourceWidth", "sourceHeight", "alpha"})。読めなければ例外"""
    from PIL import Image
    img = Image.open(io.BytesIO(data))
    img.load()
    sw, sh = img.size
    # 16 bit・浮動小数の画像は 8 bit にする（WebP は 8 bit のみ）
    if img.mode in ("I;16", "I;16B", "I;16L", "I"):
        img = img.point(lambda v: v * (1 / 256.0)).convert("L")
    elif img.mode == "F":
        img = img.point(lambda v: v * 255.0).convert("L")
    alpha = "A" in img.getbands() or (img.mode == "P" and "transparency" in img.info) or "transparency" in img.info
    img = img.convert("RGBA" if alpha else "RGB")
    if max_size and max(sw, sh) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, "WEBP", quality=int(quality), method=4)
    return out.getvalue(), {"width": img.size[0], "height": img.size[1], "sourceWidth": sw, "sourceHeight": sh,
                            "alpha": bool(alpha)}


# ---------------------------------------------------------------------------- 数値の配列の詰め方
def _shuffle(raw: bytes, size: int) -> bytes:
    """値のバイトを桁ごとに並べ替える（全要素の 1 バイト目、2 バイト目、…）"""
    if size == 1:
        return bytes(raw)
    return b"".join(raw[i::size] for i in range(size))


def _unshuffle(raw: bytes, size: int) -> bytes:
    if size == 1:
        return bytes(raw)
    n = len(raw) // size
    out = bytearray(len(raw))
    for i in range(size):
        out[i::size] = raw[i * n:(i + 1) * n]
    return bytes(out)


def _np():
    try:
        import numpy
        return numpy
    except ImportError:
        return None


def _int_array(raw: bytes, code: str):
    import array
    import sys
    a = array.array(code)
    if a.itemsize != _DTYPE_SIZE_BY_CODE[code]:
        raise PackageError("この環境では %s の配列を扱えません" % code)
    a.frombytes(raw)
    if sys.byteorder == "big":
        a.byteswap()
    return a


def _int_bytes(a) -> bytes:
    import sys
    if sys.byteorder == "big":
        a.byteswap()
    return a.tobytes()


_DTYPE_SIZE_BY_CODE = {"I": 4, "H": 2, "B": 1}


def _delta(raw: bytes, dtype: str) -> bytes:
    """前の要素との差（符号なしの型の桁で回り込む）"""
    npdt, code = _INT_DTYPES[dtype]
    np = _np()
    if np is not None:
        a = np.frombuffer(raw, dtype=npdt)
        d = a.copy()
        d[1:] -= a[:-1]
        return d.tobytes()
    import array
    import itertools
    a = _int_array(raw, code)
    mask = (1 << (8 * a.itemsize)) - 1
    return _int_bytes(array.array(code, [(x - y) & mask for x, y in zip(a, itertools.chain((0,), a))]))


def _undelta(raw: bytes, dtype: str) -> bytes:
    npdt, code = _INT_DTYPES[dtype]
    np = _np()
    if np is not None:
        return np.cumsum(np.frombuffer(raw, dtype=npdt), dtype=npdt).tobytes()
    import array
    import itertools
    a = _int_array(raw, code)
    mask = (1 << (8 * a.itemsize)) - 1
    return _int_bytes(array.array(code, [v & mask for v in itertools.accumulate(a)]))


ENCODINGS = ("none", "shuffle", "delta-shuffle")
_TRIAL_BYTES = 128 * 1024        # 大きな配列は、途中の 4 か所（合わせて 512 KB）だけで詰め方を試す


def _trial_slices(raw: bytes, size: int) -> List[bytes]:
    """詰め方を試す部分。小さい配列は全体、大きい配列は等間隔の 4 か所（要素の境目で切る）"""
    if len(raw) <= 4 * _TRIAL_BYTES:
        return [raw]
    step = len(raw) // 4
    out = []
    for k in range(4):
        start = (k * step) // size * size
        out.append(raw[start:start + _TRIAL_BYTES])
    return out



def encode_array(raw: bytes, dtype: str, encoding: Optional[str] = None) -> Tuple[bytes, str]:
    """リトルエンディアンの値の並び → (詰め直したバイト列, encoding)。
    encoding を省くと、試しに deflate（BIN_COMPRESS_LEVEL）して、いちばん小さくなるものを選ぶ
    （同じ大きさなら ENCODINGS の前のもの。向き不向きがデータで違う: 頂点の順がばらばらの面の番号は差を取ると
    かえって大きく、同じ値の多いウェイトは並べ替えると大きくなる）"""
    size = _DTYPE_SIZE[dtype]
    if encoding is None:
        samples = _trial_slices(raw, size)
        best = None
        for enc in ENCODINGS:
            if enc == "delta-shuffle" and dtype not in _INT_DTYPES:
                continue
            n = sum(len(zlib.compress(encode_array(part, dtype, enc)[0], BIN_COMPRESS_LEVEL)) for part in samples)
            if best is None or n < best[0]:
                best = (n, enc)
        return encode_array(raw, dtype, best[1])
    if encoding == "none":
        return bytes(raw), "none"
    if encoding == "shuffle":
        return _shuffle(raw, size), "shuffle"
    if encoding == "delta-shuffle" and dtype in _INT_DTYPES:
        return _shuffle(_delta(raw, dtype), size), "delta-shuffle"
    raise PackageError("対応していない配列の詰め方です: %s（%s）" % (encoding, dtype))


def decode_array(raw: bytes, dtype: str, encoding: Optional[str]) -> bytes:
    """encode_array の逆（encoding が None（version 1 の .msv）か "none" なら、そのままの値の並び）"""
    if not encoding or encoding == "none":
        return bytes(raw)
    size = _DTYPE_SIZE[dtype]
    if encoding == "shuffle":
        return _unshuffle(raw, size)
    if encoding == "delta-shuffle" and dtype in _INT_DTYPES:
        return _undelta(_unshuffle(raw, size), dtype)
    raise PackageError("対応していない配列の詰め方です: %s（%s）" % (encoding, dtype))


# ---------------------------------------------------------------------------- 書き出し
def _move_arrays(obj, chunks: List[bytes], pos: List[int]):
    """base64 の配列をバイナリに移した、新しい入れ物を返す（元のシーンは書き換えない）"""
    if isinstance(obj, dict):
        if schema.is_packed(obj) and isinstance(obj.get("data"), str):
            raw = base64.b64decode(obj["data"])
            if obj["dtype"] not in _DTYPE_SIZE:
                raise PackageError("対応していない配列の型です: %s" % obj["dtype"])
            raw, encoding = encode_array(raw, obj["dtype"])
            pad = (-pos[0]) % 4
            if pad:
                chunks.append(b"\0" * pad)
                pos[0] += pad
            ref = {"dtype": obj["dtype"], "count": obj["count"], "buffer": BIN_NAME, "offset": pos[0], "encoding": encoding}
            chunks.append(raw)
            pos[0] += len(raw)
            return ref
        return {k: _move_arrays(v, chunks, pos) for k, v in obj.items()}
    if isinstance(obj, list):
        if not any(isinstance(v, (dict, list)) for v in obj):
            return obj
        return [_move_arrays(v, chunks, pos) for v in obj]
    return obj


def texture_indices(scene: dict, mode: str) -> set:
    """同梱するテクスチャの番号。albedo: マテリアルのアルベド（maps.baseColor・texture）。all: すべて"""
    textures = scene.get("textures") or []
    if mode == "all":
        return set(range(len(textures)))
    if mode != "albedo":
        return set()
    out = set()
    for m in scene.get("materials") or []:
        ti = ((m.get("maps") or {}).get("baseColor") or {}).get("texture", m.get("texture", -1))
        if isinstance(ti, int) and 0 <= ti < len(textures):
            out.add(ti)
        if isinstance(m.get("texture"), int) and 0 <= m["texture"] < len(textures):
            out.add(m["texture"])
    return out


class _Packer:
    """テクスチャを zip に入れる（同じファイルは 1 回だけ）"""

    def __init__(self, zf: zipfile.ZipFile, convert: bool, max_size: int, quality: int,
                 source: Optional["Package"], warnings: List[str]):
        self.zf = zf
        self.convert = convert
        self.max_size = max_size
        self.quality = quality
        self.source = source
        self.warnings = warnings
        self.done: Dict[str, Tuple[Optional[str], Optional[str]]] = {}   # 元 → (zip の中の名前, 形式)
        self.count = 0
        self.bytes_in = 0
        self.bytes_out = 0

    def add(self, label: str, resolved: Optional[str], packed: Optional[str], fmt: Optional[str], stem: str):
        """1 枚入れる。戻り値: (zip の中の名前, 形式)。入れられなければ (None, 理由)"""
        key = ("pkg:" + packed) if packed else ("file:" + os.path.normcase(os.path.abspath(resolved or "")))
        if key in self.done:
            return self.done[key]
        result = self._add(label, resolved, packed, fmt, stem)
        self.done[key] = result
        return result

    def _add(self, label, resolved, packed, fmt, stem):
        if packed:                                    # 元が .msv: 変換済みの中身をそのまま移す
            if self.source is None:
                return None, "unreadable"
            try:
                data = self.source.read(packed)
            except (KeyError, OSError) as exc:
                self.warnings.append("%s: 同梱のテクスチャを読めません（%s）" % (label, exc))
                return None, "unreadable"
            name = "textures/%s%s" % (stem, os.path.splitext(packed)[1].lower())
            self._write(name, data, len(data))
            return name, fmt
        if not resolved or not os.path.isfile(resolved):
            return None, "missing"
        try:
            with open(resolved, "rb") as f:
                data = f.read()
        except OSError as exc:
            self.warnings.append("%s: テクスチャを読めません: %s（%s）" % (label, resolved, exc))
            return None, "unreadable"
        if self.convert:
            try:
                webp, _info = convert_image(data, self.max_size, self.quality)
                name = "textures/%s.webp" % stem
                self._write(name, webp, len(data))
                return name, "webp"
            except Exception as exc:  # noqa: BLE001  Pillow で読めない形式（EXR など）
                if not fmt:
                    self.warnings.append("%s: テクスチャを WebP にできないため、入れません: %s（%s）"
                                         % (label, os.path.basename(resolved), exc))
                    return None, "unreadable"
                self.warnings.append("%s: テクスチャを WebP にできないため、元のまま入れます: %s（%s）"
                                     % (label, os.path.basename(resolved), exc))
        if not fmt:                                   # ビューアで表示できない形式
            return None, "unreadable"
        name = "textures/%s%s" % (stem, os.path.splitext(resolved)[1].lower())
        self._write(name, data, len(data))
        return name, fmt

    def _write(self, name, data, size_in):
        comp = zipfile.ZIP_STORED if name.endswith(_STORED_EXT) else zipfile.ZIP_DEFLATED
        self.zf.writestr(zipfile.ZipInfo(name, _date_time()), data, compress_type=comp)
        self.count += 1
        self.bytes_in += size_in
        self.bytes_out += len(data)


def _date_time():
    return time.localtime()[:6]


def _pack_textures(scene_out: dict, mode: str, packer: _Packer) -> None:
    """scene_out の textures を、同梱したもの・しなかったものの形に書き換える"""
    textures = scene_out.get("textures") or []
    include = texture_indices(scene_out, mode)
    omitted_reason = "albedo-only" if mode == "albedo" else "none"
    for ti, t in enumerate(textures):
        t = dict(t)
        textures[ti] = t
        label = t.get("node") or "texture %d" % ti
        if ti not in include:
            t.update({"packed": None, "omitted": omitted_reason, "resolved": None, "url": None})
            if t.get("udim"):
                t["tiles"] = [dict(x, resolved=None, url=None, packed=None) for x in t.get("tiles") or []]
            continue
        if t.get("udim"):
            tiles = []
            reason = "missing"
            fmt_out = t.get("format")
            for tile in t.get("tiles") or []:
                name, fmt = packer.add(label, tile.get("resolved"), tile.get("packed"), t.get("format"),
                                       "%d.%s" % (ti, tile.get("tile")))
                if name:
                    fmt_out = fmt
                    tiles.append(dict(tile, resolved=None, url=None, packed=name))
                else:
                    reason = fmt
            t.update({"tiles": tiles, "resolved": None, "url": None, "format": fmt_out if tiles else t.get("format"),
                      "packed": tiles[0]["packed"] if tiles else None})
            if not tiles:
                t["omitted"] = reason
            continue
        name, fmt = packer.add(label, t.get("resolved"), t.get("packed"), t.get("format"), str(ti))
        if name:
            t.update({"packed": name, "format": fmt, "resolved": None, "url": None})
            t.pop("omitted", None)
        else:
            t.update({"packed": None, "omitted": fmt, "resolved": None, "url": None})


def write_package(scene: dict, path: str, textures: str = DEFAULT_TEXTURES, max_size: int = DEFAULT_MAX_SIZE,
                  quality: int = DEFAULT_QUALITY, source: Optional["Package"] = None,
                  convert: Optional[bool] = None, progress: Optional[Callable[[str], None]] = None,
                  view="keep") -> dict:
    """シーン（共通 JSON の dict）を .msv に書き出す。元のシーンは書き換えない。
    textures: "albedo"（既定。アルベドのみ）・"all"・"none"。
    source: シーンを .msv から読んだときのパッケージ（同梱のテクスチャをそのまま移す）。
    convert: テクスチャを WebP にするか（None なら Pillow があれば変換する）。
    view: 表示の状態（dict）。"keep" なら、シーンが持つもの（.msv から読んだ savedView）をそのまま入れる。None なら入れない。
    戻り値: {"path", "size", "textures", "converted", "warnings"}"""
    if textures not in TEXTURE_MODES:
        raise ValueError("textures は %s のどれかです" % " / ".join(TEXTURE_MODES))
    warnings: List[str] = []
    can_convert, why = pillow_status()
    if convert is None or convert:
        if textures != "none" and not can_convert:
            warnings.append("テクスチャは変換せず、元のまま入れます: " + why)
        convert = can_convert
    say = progress or (lambda msg: None)

    say("数値の配列をまとめています")
    chunks: List[bytes] = []
    scene_out = _move_arrays(scene, chunks, [0])
    if view == "keep":
        view = scene.get("savedView")
    scene_out.pop("savedView", None)
    if isinstance(scene_out.get("source"), dict):
        scene_out["source"] = dict(scene_out["source"])
        for k in _RUNTIME_KEYS:
            scene_out["source"].pop(k, None)
    if scene_out.get("textures") is not None:
        scene_out["textures"] = list(scene_out["textures"])

    tmp = path + ".part"
    try:
        with zipfile.ZipFile(tmp, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
            packer = _Packer(zf, convert, max_size, quality, source, warnings)
            if textures != "none" or scene_out.get("textures"):
                say("テクスチャを入れています")
                _pack_textures(scene_out, textures, packer)
            manifest = {"format": FORMAT_NAME, "version": FORMAT_VERSION, "textures": textures,
                        "textureFormat": "webp" if convert else "original", "maxSize": max_size if convert else None,
                        "created": time.strftime("%Y-%m-%dT%H:%M:%S"), "generator": "MayaSceneViewer",
                        "generatorVersion": __version__}
            say("書き込んでいます")
            zf.writestr(zipfile.ZipInfo("manifest.json", _date_time()),
                        json.dumps(manifest, ensure_ascii=False, indent=1), compress_type=zipfile.ZIP_DEFLATED)
            zf.writestr(zipfile.ZipInfo("scene.json", _date_time()),
                        json.dumps(scene_out, ensure_ascii=False, separators=(",", ":")),
                        compress_type=zipfile.ZIP_DEFLATED)
            zf.writestr(zipfile.ZipInfo(BIN_NAME, _date_time()), b"".join(chunks), compress_type=zipfile.ZIP_DEFLATED,
                        compresslevel=BIN_COMPRESS_LEVEL)
            if isinstance(view, dict):
                zf.writestr(zipfile.ZipInfo(VIEW_NAME, _date_time()), json.dumps(view, ensure_ascii=False),
                            compress_type=zipfile.ZIP_DEFLATED)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.remove(tmp)
        except OSError:
            pass
        raise
    return {"path": path, "size": os.path.getsize(path), "textures": packer.count, "converted": bool(convert),
            "view": isinstance(view, dict),
            "textureBytesIn": packer.bytes_in, "textureBytesOut": packer.bytes_out, "warnings": warnings}


# ---------------------------------------------------------------------------- 読み込み
class Package:
    """開いた .msv。中身はその都度 zip から読む（展開したファイルは作らない）"""

    def __init__(self, path: str):
        self.path = os.path.abspath(path)
        try:
            with zipfile.ZipFile(self.path) as zf:
                self.names = set(zf.namelist())
                if "scene.json" not in self.names:
                    raise PackageError("%s はシーンのパッケージ（.msv）ではありません（scene.json がありません）"
                                       % os.path.basename(path))
                self.manifest = json.loads(zf.read("manifest.json")) if "manifest.json" in self.names else {}
        except zipfile.BadZipFile as exc:
            raise PackageError("%s を読めません（zip として壊れています: %s）" % (os.path.basename(path), exc))
        if self.manifest.get("format") not in (None, FORMAT_NAME):
            raise PackageError("対応していないパッケージです（format: %s）" % self.manifest.get("format"))
        if int(self.manifest.get("version") or 1) > FORMAT_VERSION:
            raise PackageError("新しい版のビューアで作られたパッケージです（version %s）。ビューアを更新してください"
                               % self.manifest.get("version"))

    def read(self, name: str) -> bytes:
        with zipfile.ZipFile(self.path) as zf:
            return zf.read(name)

    def texture_names(self, scene: dict) -> set:
        """シーンの textures が指す、zip の中の名前（ビューアに渡してよいもの）"""
        out = set()
        for t in scene.get("textures") or []:
            if t.get("packed"):
                out.add(t["packed"])
            for tile in t.get("tiles") or []:
                if tile.get("packed"):
                    out.add(tile["packed"])
        return out & self.names

    def load_scene(self) -> dict:
        """共通 JSON の dict にする（数値の配列は base64 の {"dtype", "count", "data"} に戻す。.json と同じ形）"""
        with zipfile.ZipFile(self.path) as zf:
            scene = json.loads(zf.read("scene.json").decode("utf-8"))
            buffers: Dict[str, bytes] = {}

            def restore(obj):
                if isinstance(obj, dict):
                    if "buffer" in obj and "dtype" in obj and "count" in obj and "data" not in obj:
                        name = obj["buffer"]
                        if name not in buffers:
                            buffers[name] = zf.read(name)
                        size = _DTYPE_SIZE.get(obj["dtype"])
                        if size is None:
                            raise PackageError("対応していない配列の型です: %s" % obj["dtype"])
                        start = int(obj.get("offset") or 0)
                        raw = buffers[name][start:start + size * int(obj["count"])]
                        if len(raw) != size * int(obj["count"]):
                            raise PackageError("パッケージの数値のデータが足りません（壊れている可能性があります）")
                        raw = decode_array(raw, obj["dtype"], obj.get("encoding"))
                        return {"dtype": obj["dtype"], "count": obj["count"], "data": base64.b64encode(raw).decode("ascii")}
                    for k, v in obj.items():
                        if isinstance(v, (dict, list)):
                            obj[k] = restore(v)
                    return obj
                if isinstance(obj, list):
                    for i, v in enumerate(obj):
                        if isinstance(v, (dict, list)):
                            obj[i] = restore(v)
                return obj
            scene = restore(scene)
        src = scene.setdefault("source", {})
        src.setdefault("name", os.path.basename(self.path))
        src["packagePath"] = self.path              # 同梱のテクスチャを渡すため（書き出しには含めない）
        view = self.view()
        if view is not None:
            scene["savedView"] = view               # ビューアが読み込みの最後に入れる（書き出しでは view.json に戻す）
        return scene

    def view(self) -> Optional[dict]:
        """書き出したときの表示の状態（view.json。なければ None）"""
        if VIEW_NAME not in self.names:
            return None
        try:
            v = json.loads(self.read(VIEW_NAME).decode("utf-8"))
        except (ValueError, KeyError, OSError):
            return None
        return v if isinstance(v, dict) else None


def read_package(path: str) -> Tuple[dict, Package]:
    """.msv を開いて (シーン, パッケージ) を返す。シーンは .json を読んだときと同じ形"""
    pkg = Package(path)
    scene = pkg.load_scene()
    schema.validate(scene)
    return scene, pkg
