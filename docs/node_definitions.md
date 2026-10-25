# 自作ノードの定義（node_defs）

プラグインの自作ノード（Maya の標準にないノード）は、.ma にノードの計算が書かれていないため、そのままでは評価できません（リグの診断で「評価できないノード」になります）。
**定義ファイル**に「どの属性から値を受け取り、何を計算して、どの属性に出すか」を書いておくと、ビューアがその計算を再現します。

- 定義ファイルは、ツールの配布者が用意して **ビューアに同梱** します（`ma_viewer/node_defs/*.json`）。利用者の環境にプラグインや Maya がなくても動きます。
- exe にするときも必ず含めます（`packaging/maya_ma_viewer.spec`）。`python packaging/build_exe.py` はビルドの前に定義を検証し、誤りがあれば止めます。
- 定義はデータ（計算式）で、プラグインのコードを実行するものではありません。ビューアは定義の計算を検証してから使います。
- 定義の確認: `python -m ma_viewer node-defs`（同梱の定義の一覧と誤り。誤りがあれば終了コード 1）。ファイルを指定して確かめることもできます（`python -m ma_viewer node-defs mine.json`）。
- 定義で評価したノードは、リグの診断に「定義で評価する自作ノード」として出ます。計算の実行時の誤り（0 で割る など）は、ビューアのリグの問題（警告）に出ます。

## ファイルの形式

```json
{
  "format": "maya-scene-viewer-node-definitions",
  "version": 1,
  "plugin": "myRigPlugin",
  "pluginVersion": "1.0",
  "nodes": {
    "weightedSum": {
      "description": "入力の重み付きの和",
      "attributes": [
        {"name": "input", "short": "in", "type": "double", "array": true},
        {"name": "weight", "short": "w", "type": "double", "array": true, "default": 1},
        {"name": "output", "short": "o", "type": "double", "output": true}
      ],
      "compute": [
        "total = 0",
        "for i in indices(input):",
        "    total += input[i] * weight[i]",
        "output = total"
      ]
    }
  }
}
```

| キー | 内容 |
|---|---|
| `format` / `version` | 固定（`maya-scene-viewer-node-definitions` / 1） |
| `plugin` / `pluginVersion` | プラグインの名前と版（省略可）。.ma の `requires "myRigPlugin" "1.1";` と版が違えば警告します（定義を作り直す目安） |
| `nodes` | ノードの型の名前（.ma の `createNode 型`）→ 定義。1 つのファイルに複数の型を書けます。同じ型が複数のファイルにあれば、ファイル名の順で後のものを使います |
| `attributes` | 属性の一覧（下記） |
| `compute` | 計算（文字列、または 1 行ずつの文字列のリスト） |

### 属性

| キー | 内容 |
|---|---|
| `name` | 名前（長い名前）。計算ではこの名前か短い名前で書きます |
| `short` | 短い名前（省略時は `name`）。.ma の接続・値は、長い名前・短い名前のどちらで書かれていても読めます |
| `type` | 型（下表。省略時は `double`） |
| `array` | 配列（数が不定の要素を持つ。`input[0]`・`input[5]` …）なら `true` |
| `output` | 出力なら `true`（ほかのノードへ値を出す属性。1 つ以上必要） |
| `default` | 既定値（.ma に値も接続もないとき）。角度は度で書きます |
| `children` | `compound` の子の属性（属性の一覧）。ベクトルの型では、成分の属性の名前（省略時は 短い名前 + `x`・`y`・`z`、例: `of` → `ofx`・`ofy`・`ofz`） |

| 型 | 値 |
|---|---|
| `double`・`float`・`int`・`bool`・`enum` | 数 |
| `distance` | 数（長さ。ファイルの単位のまま） |
| `angle` | 数（角度。計算ではラジアン。.ma の値・既定値は度） |
| `time` | 数（フレーム）。接続がなければ、いまのフレーム（time1 への接続は .ma の読み込みで消えるため） |
| `vector`・`double3`・`float3` | 3 つの数のリスト（成分の属性 `x`・`y`・`z` にも接続できる） |
| `angle3` | 3 つの数（角度。ラジアン） |
| `double2`・`float2`・`double4` | 2 つ・4 つの数のリスト |
| `matrix` | 4×4 の行列 |
| `compound` | 子の属性をまとめたもの（`children`）。`array` と組み合わせると、コンストレイントのターゲットのような「子を持つ要素の配列」 |

### 配列の属性（数が不定）

- 要素の数と番号は、ノードごとに .ma から決まります（値が書かれているか、接続されている番号）。番号は飛んでいても構いません（`input[0]`・`input[1]`・`input[5]`）。
- `for i in indices(input):` で、存在する要素の番号を小さい順にたどります。`count(input)` で数。
- 書かれていない番号の要素を読むと、その属性の既定値になります（`weight[i]` の既定値 1 など）。
- 配列の compound は `target[i].targetMatrix` のように、要素を選んでから子を書きます。入れ子（`target[i].point[j]`）も同じです。
- 出力の配列（`outValues[i] = …`）は、計算で代入した要素だけが出ます（ビューアでは、接続されている要素の値を使います）。

## 計算の書き方

Python の書き方の一部です。

```python
total = 0                                  # ローカル変数
for i in indices(input):                   # 配列の要素をたどる（range(n) も使える）
    if weight[i] <= 0:
        continue
    total += input[i] * weight[i]
p = xform_point([0, 0, 0], target[0].targetMatrix)
output = total * settings.gain + p.x       # 出力の属性に代入する
```

- 使える文: 代入（`=`・`+=` など）、`if` / `elif` / `else`、`for … in …`、`break`、`continue`、`pass`。
- 使えないもの: `while`、関数の定義（`def`）、`import`、`return`、クラス、文字列、名前つきの引数（`order=1`）。
- 属性は名前で読み、出力の属性に代入します。入力の属性への代入・出力の属性を読むことはできません（計算した値はローカル変数に入れます）。
- 配列でない compound の子は `settings.gain` のように書きます。ベクトルの成分は `.x`・`.y`・`.z`・`.w` か `[0]`。
- 演算子: `+ - * / // % **`（`//` と `%` は Python と同じく負の数でも床関数）、比較 `== != < <= > >=`（`0 < x < 1` も可）、`and`・`or`・`not`、`a if 条件 else b`。
- ベクトル: `[x, y, z]` で作り、`+`・`-`、数との `*`・`/`。**ベクトル同士の `*` は使えません**（内積は `dot`、外積は `cross`）。
- 行列: `m1 * m2` は Maya と同じく **m1 を先に掛ける**（行ベクトルの規約）。行列とベクトルの `*` は使えません（点は `xform_point`、向きは `xform_vector`）。
- 角度はラジアン（`radians(度)`・`degrees(ラジアン)` で変換）。回転順は Maya の番号（0: xyz・1: yzx・2: zxy・3: xzy・4: yxz・5: zyx）。
- 時間: `frame`（いまのフレーム）・`time`（秒）。
- 定数: `pi`・`e`・`True`・`False`。

### 関数

| 種類 | 関数 |
|---|---|
| 数 | `sin cos tan asin acos atan atan2 sqrt pow exp log(x[, 底]) log10 abs floor ceil round(x[, 桁]) trunc sign hypot fmod min max clamp(x, 下, 上) lerp(a, b, t) smoothstep(e0, e1, x) radians degrees int float bool` |
| ベクトル | `vector(x, y, z) dot cross length normalize distance angle(a, b)`（`lerp`・`min`・`max` はリストにも使える） |
| 行列 | `identity() matrix(16 個の数のリスト) inverse transpose compose(移動, 回転, スケール[, 回転順]) translation(m) rotation(m[, 回転順]) scale(m) xform_point(点, m) xform_vector(向き, m)` |
| 四元数（`[x, y, z, w]`） | `quat_from_euler(回転[, 回転順]) euler_from_quat(q[, 回転順]) quat_from_matrix(m) matrix_from_quat(q) quat_mul(a, b)`（a を先に回す）`quat_slerp(a, b, t) quat_inverse quat_normalize` |
| 配列・接続 | `indices(配列の属性) count(配列の属性) connected(属性)`（引数は属性そのもの） |
| 繰り返し | `range(n)`・`range(a, b[, 刻み])` |

`compose` は Maya の変換と同じく、スケール → 回転 → 移動の順の行列（`S · R · T`）です。

## プラグインからの変換（convert-plugin）

Python で書いたノードプラグイン（.py）からは、定義を自動で作れます。配布者が一度だけ実行し、できた定義を同梱します。

```
python -m ma_viewer convert-plugin myPlugin.py                                  # 結果と変換した計算の表示だけ
python -m ma_viewer convert-plugin myPlugin.py -o ma_viewer/node_defs/myPlugin.json   # 書き出す
python -m ma_viewer node-defs                                                   # 同梱した定義を確かめる
```

- 実行には Python 3.9 以降が要ります（追加のパッケージは不要）。リポジトリ（または配布した ma_viewer フォルダ）のある場所で `python -m ma_viewer …` として実行します。**exe（MayaSceneViewer.exe）はビューアだけなので、このコマンドはありません。**
- プラグインのコードは **実行しません**（Maya も不要）。Python の構文を解析して、属性と compute の計算を読みます。
- `initializePlugin` の `registerNode` で登録したノードごとに、変換できたか（○）、できない理由（★ と行番号）、注意（※）を出します。変換できたノードだけを書き出し、1 つでも変換できなければ終了コード 1 です。
- `plugin` はファイル名（`--plugin` で変更。.ma の `requires` の名前に合わせます）、`pluginVersion` は `MFnPlugin(obj, 作者, 版)` の版（`--version` で変更）です。
- 変換した計算は人が読める形で書き出すので、必要なら手で直せます（`-o` を付けずに実行すると内容を確かめられます）。

| 読むもの | 内容 |
|---|---|
| 登録 | `registerNode(型の名前, id, 作成の関数, 初期化の関数)`。クラスの一覧をループで登録していてもよい。名前は定数・クラスの属性から |
| 属性 | `MFnNumericAttribute`（数・`k3Double` などのベクトル・`createPoint`・`createColor`・子の属性から作る数の compound）・`MFnUnitAttribute`（角度・長さ・時間）・`MFnMatrixAttribute`・`MFnTypedAttribute` の行列（`MFnData.kMatrix`）・`MFnCompoundAttribute`（`addChild`）・`MFnEnumAttribute`。`array`・`writable`・`default`（API 1.0 は `setArray` など）。出力は `attributeAffects` で影響を受ける属性 |
| 計算 | `inputValue`・`outputValue`・`inputArrayValue`・`outputArrayValue`、`child`、`asDouble`・`asFloat`・`asInt`・`asBool`・`asAngle`・`asDistance`・`asTime`・`asMatrix`・`asVector`・`asDouble3` など、`setDouble`・`set3Double`・`setMVector`・`setMMatrix`・`setMAngle` など、型つきの行列の `MFnMatrixData(handle.data()).matrix()`・`.transformation()` と `setMObject(MFnMatrixData().create(行列))`、`MScriptUtil.createMatrixFromList(16 個の数のリスト, 行列)` |
| 配列 | `for i in range(len(arr))`（API 1.0 は `elementCount()`）＋ `jumpToPhysicalElement` / `jumpToArrayElement`、`while not arr.isDone(): … arr.next()`、論理番号（`elementLogicalIndex` / `elementIndex`）と `jumpToLogicalElement` / `jumpToElement`、出力の配列の `builder()`・`addElement(番号)` |
| 値 | `MVector`・`MPoint`（`*` は内積、`^` は外積、点 × 行列）・`MMatrix`・`MTransformationMatrix`（移動・回転・スケールの取り出しと設定）・`MEulerRotation`・`MQuaternion`・`MAngle`、`math` の関数、`abs`・`min`・`max`・`round` |
| plug | `if plug == 出力:`・`plug.parent()`・`plug.array()` による出し分けは、すべての出力を計算するものとして扱います |
| MPlug | `MPlug(self.thisMObject(), 属性)`・`MFnDependencyNode(self.thisMObject()).findPlug(属性 / "名前")` の値（`asShort` など）、`isConnected`（→ `connected`）、`elementByLogicalIndex`、`numElements`、`asMObject` |
| return | `if 条件: … return` は、残りの文を else に入れた if に書き換えます（`if obj.isNull(): return` など）。`isNull` は「その属性に接続がない」として扱います |

変換できない書き方（そのノードは書き出しません）:

- `self` に値を覚える（前回の計算の結果を使う）。ビューアはフレームごとに独立して計算します。
- `maya.cmds`・ほかのノードを直接見る処理、文字列・メッシュ・カーブなど形状の属性を読む計算。
- `while`（配列をたどる `while not arr.isDone()` は可）、`try`、ループの中の `return`。
- `self` のメソッドやプラグインの中の関数の呼び出し（計算を compute の中に書いてください）。

変換できなかったノードがあると、結果の最後に **「解釈できない関数・メソッドの一覧」** を出します。compute の中の呼び出しを実行の流れに関係なくすべて調べて、変換ツールが知らない名前（`.getElement()`・`MRampAttribute()`・`self.helper()` など）を、ノードと行番号つきで並べます。対応を相談するときは、この一覧を見せてください。

扱えない型の属性（文字列など）は、compute で読んでいなければ定義から外し、注意（※）を出します。出力に書き込む文が見つからなければ、その出力は既定値のままになるので注意を出します。

`create(…, k3Double)` で作ったベクトルの成分の属性は、Maya と同じく名前に `0`・`1`・`2` を付けた名前（`upVector0`、短い名前 `up0`）、`createPoint` は `X`・`Y`・`Z`、`createColor` は `R`・`G`・`B` です。

サンプル: `samples/plugins/sampleRigNodes.py`（API 2.0）・`samples/plugins/sampleRigNodesApi1.py`（API 1.0）。変換した定義は `samples/plugin_convert_defs.json`（`python tools/make_plugin_convert_sample.py`）。

## 制限

- 計算はフレームごとに独立して行います。前のフレームの結果を持ち越すノード（シミュレーション・積分など）は再現できません。
- 形状（メッシュ・カーブの形）を入出力するノード（デフォーマなど）、文字列の属性、`maya.cmds` に当たる処理（ほかのノードを直接見に行くなど）は扱えません。
- 実行時の誤り（0 で割る・型の合わない演算・未設定の変数など）があると、そのフレームはそのノードの出力を使わず、リグの問題として報告します。
- 1 回の計算の繰り返しは 20 万回までです（終わらない計算を止めるため）。
