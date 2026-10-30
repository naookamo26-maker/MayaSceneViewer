# サードパーティのライセンス

## three.js r160（ma_viewer/web/viewer.bundle.js に同梱）

https://github.com/mrdoob/three.js

```
The MIT License

Copyright © 2010-2023 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## animX（テストの参照実装・同梱なし）

Apache License 2.0 — https://github.com/Autodesk/animx （Copyright Autodesk, Inc.）

`web_src/tests/animxReference.mjs` は animX のカーブの評価を JavaScript に書き写したもの（テストでのみ使用）。
ビューアのオート系の接線と重み付きの区間の計算（`web_src/src/animation.js`）も animX と同じ式にしている。

## esbuild（ビルド時のみ使用・同梱なし）

MIT License — https://github.com/evanw/esbuild

## exprespy のサンプルのコード（テストのサンプルのみ・ビューアには同梱なし）

https://github.com/ryusas/maya_exprespy — `samples/exprespy_sample.ma`・`samples/exprespy_bendroll_sample.ma`・`tools/make_exprespy_sample.py` のコードは、exprespy の examples/constraints.ma・examples/bend_roll.ma のもの。

```
MIT License

Copyright (c) 2016 Ryusuke Sasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## PySide6（同梱なし）

LGPLv3 / GPLv3 / 商用 — https://doc.qt.io/qtforpython-6/licenses.html
