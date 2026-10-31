# 共通 JSON（maya-scene-lite）の仕様

.ma パーサ（`extract_ma.py`）と Maya 抽出器（`extract_maya.py`）が出力し、ビューア（three.js）が読み込む形式です。検証は `ma_viewer/schema.py` の `validate()` で行えます。

## 全体

```json
{
  "schema": "maya-scene-lite",
  "version": 1,
  "source": { "kind": "ma", "path": "...", "name": "scene.ma", "mayaVersion": "2024",
              "linearUnit": "cm", "angularUnit": "deg", "upAxis": "y" },
  "nodes":  [ ... ],
  "meshes": [ ... ],
  "curves": [ ... ],
  "cameras": [ ... ],
  "viewCamera": 0,
  "sequencer": { "start": 1, "end": 49, "shots": [ ... ] },
  "render": { "width": 1920, "height": 1080, "deviceAspectRatio": 1.778 },
  "materials": [ ... ],
  "textures": [ ... ],
  "warnings": [ "..." ],
  "stats": { "nodes": 10, "joints": 5, "meshes": 3, "vertices": 316, "polygons": 302, "skinnedMeshes": 1 },
  "animation": { ... }
}
```

`animation` は省略できます（アニメーションがない場合や、読み込まない設定の場合）。`curves` も省略できます（Maya 内からの抽出では出力しません）。`cameras`・`render` も省略できます（古い版の JSON）。

`source.kind` は `"ma"`（.ma から）か `"maya"`（Maya 内から）です。

`source.references` は .ma のリファレンス（`file -r`。入れ子も含む）の一覧です（省略可。Maya 内からの抽出では出力しません。Maya が読み込み済みのノードをそのまま出力するため）。リファレンスから読み込んだノードの名前には、名前空間が付きます（例: `rig:shoulder`、入れ子なら `rig:prop:crate`）。

| キー | 内容 |
|---|---|
| `namespace` | 名前空間（入れ子なら `rig:prop`。古い形式の名前の前置き `-rpr` なら `old_`） |
| `path` / `resolved` | ファイルに書かれたパスと、見つかったファイル（見つからなければ null） |
| `rfn` | reference ノードの名前 |
| `depth` | 入れ子の深さ（1 = いちばん外側） |
| `loaded` / `reason` | 読み込んだか。読み込まなかった理由（アンロード・ファイルが見つからない・.mb・循環など） |
| `nodes` | そのファイルから作ったノードの数（入れ子のリファレンスの分は含まない） |

## nodes

transform・joint などの変換ノードです。**親は必ず子より前に並びます。** 出力するのは、メッシュ・ジョイント・インフルエンスと、それらの祖先だけです。

| キー | 内容 |
|---|---|
| `name` / `path` | 名前と DAG フルパス（例: `\|rig_grp\|shoulder`） |
| `type` | `"joint"`、`"transform"` など Maya のノード型 |
| `parent` | 親の番号（ルートは -1） |
| `matrix` | ローカル行列（16 要素） |
| `locked` | Maya でロックした移動・回転・スケール（`{ "t" | "r" | "s": [X, Y, Z] }`。ロックのあるものだけ。まとめ（.t）のロックは 3 成分とも） |
| `limits` | 移動・回転・スケールの制限（Maya の minTransLimit など。有効なものだけ）`{ "t" | "r" | "s": [[最小 × 3], [最大 × 3]] }`（無効な成分は null。回転は度）。`matrix` は制限に収めた値。ポーズ確認で動かした値もこの範囲に収める |
| `pivots` | `limits` のあるノードの、既定値でないピボット・rotateAxis（度）・せん断（`rp`・`sp`・`rpt`・`spt`・`ra`・`sh`）。ポーズ確認で動かした結果をチャンネルの値に分けるのに使う |
| `opm` | offsetParentMatrix（16 要素。単位行列でないときだけ。`matrix` には掛け込み済み。親の空間 `.parentMatrix` = 親のワールド行列 · opm を求めるのに使う） |
| `worldMatrix` | ワールド行列（参照用。ビューアは階層から計算し直す） |
| `inheritsTransform` | false の場合、ビューアはルート直下に置く |
| `segmentScaleCompensate` | joint のみ（省略時は true）。ポーズ確認で親ジョイントをスケールしたときの補正に使う |
| `bindMatrix` | バインドポーズのローカル行列（情報があるノードのみ）。情報のないノードは matrix のまま親についていく |
| `bindSource` | bindMatrix の情報源: `pm`（skinCluster の .pm）・`dagPose`・`bps`（ジョイントの .bps） |
| `drivenBy` | 移動・回転などが接続で決まっている場合の接続元（例: `r ← uc1（unitConversion）`）。この場合 .ma に値がないため、matrix はバインドポーズの姿勢（bindMatrix があれば）か既定値になる |
| `visible` | 自身の表示状態 |
| `unselectable` | Maya のビューポートで選択できないとき、その理由（`テンプレート`・`リファレンス`）。テンプレート（.template。祖先も含む）と、描画のオーバーライドかディスプレイレイヤーの表示の種類（近い方の設定）から決める。meshes・curves も同じ |
| `shape` | ロケーターのシェイプを持つ transform は `"locator"`（省略可。.ma のみ）。リグのコントローラーの目印の形に使う |
| `color` | 描画のオーバーライドかディスプレイレイヤーの色 `[r, g, b]`（省略可。.ma のみ）。ロケーターならシェイプ、なければ transform から祖先へ、curves の color と同じ探し方。コントローラーの目印の色に使う |
| `pivot` | コントローラーの目印を置く位置（オブジェクト空間）。回転のピボット（.rp）、ロケーターはシェイプの localPosition（省略可。0 のときと .ma 以外は省略）。フリーズしたコントローラーや cluster のハンドルは、移動が 0 でもここが形の位置になる |
| `attrs` | 表示用の値。`t`、`r`（度）、`s`、`jo`（度、joint のみ）、`ro`（`"xyz"` など） |

## meshes

| キー | 内容 |
|---|---|
| `name` / `path` | シェイプの名前とフルパス |
| `transform` | 親 transform の nodes 番号 |
| `visible` | 親を含めた実際の表示状態 |
| `visibleSelf` | メッシュ自身の表示状態（親の表示状態は nodes の visible を使う） |
| `positions` | 頂点座標 `[x, y, z, ...]`（オブジェクト空間）。スキン付きの場合はバインド時（スキン適用前）の形状 |
| `counts` | 面ごとの頂点数 |
| `indices` | 面の頂点番号を連結したもの（Maya の面の頂点順） |
| `hardEdges` | ハードエッジ（スムーズでない辺）の頂点の組 `[a, b, a, b, ...]`。この辺をまたぐ面どうしは法線を分ける |
| `uv` | UV（なければ null）。`{"set": UVセット名, "values": [u, v, ...], "indices": [面の角ごとの UV 番号（indices と同じ長さ。UV のない角は -1）]}` |
| `material` | 面すべてが同じマテリアルのときの materials 番号（-1 は既定のマテリアル） |
| `faceMaterials` | 面ごとに違う場合の、面ごとの materials 番号（同じなら null） |
| `skin` | スキンがなければ null |

### skin

ウェイトは疎配列で持ちます。頂点 v のウェイトは、`counts[0..v-1]` の合計を開始位置として `counts[v]` 個並んでいます。

| キー | 内容 |
|---|---|
| `cluster` | skinCluster の名前 |
| `method` | スキニング方式（0 = リニア、1 = デュアルクォータニオン、2 = ブレンド） |
| `normalize` | ウェイトの正規化の設定（0 = なし、1 = インタラクティブ、2 = ポスト）。参考情報で、ビューアは常に正規化する |
| `weightDistribution` | ウェイトの分配（0 = 距離、1 = 近傍）。合計が 0 の頂点の割り当て方に使う |
| `influences` | インフルエンスの nodes 番号。この並び順を「スロット番号」と呼ぶ |
| `bindPreMatrices` | 各インフルエンスのバインド行列（skinCluster の `.pm`）。influences と同じ順 |
| `geomMatrix` | skinCluster の `.gm`（バインド時のメッシュのワールド行列） |
| `counts` | 頂点ごとのインフルエンス数（頂点数と同じ長さ） |
| `indices` | スロット番号を連結したもの |
| `weights` | ウェイト値を連結したもの。合計が 0 の頂点だけは、記録されているジョイントを値 0 で含む |

## curves

NURBS カーブ（nurbsCurve のシェイプ。中間オブジェクトを除く）です。省略可。カーブを持つ transform は nodes に出力します。

| キー | 内容 |
|---|---|
| `name` / `path` | シェイプの名前とフルパス |
| `transform` | 親 transform の nodes 番号。線はこの transform の空間に描く |
| `visible` / `visibleSelf` | 親を含めた実際の表示状態 / シェイプ自身の表示状態（.v・.lodv・描画のオーバーライドの .ovv・ディスプレイレイヤー） |
| `cc` | .ma の `.cc`（`-type "nurbsCurve"`）の値: 次数, スパン数, 形（0 開・1 閉・2 周期的）, 有理（0/1）, 次元, ノット数, ノット…, CV 数, CV…（有理なら各 CV に重み）。Maya はノットの両端を 1 つずつ省いて書くので、評価のときに補う。シェイプに形が保存されていない（skinCluster などで変形している）ときは、入力（create ← 変形ノード ← …）をたどった変形前の形で、`fromInput` が true |
| `tweaks` | `.cp` の調整 `[[CV 番号, x, y, z], …]`（cc の CV に足す。0 でないものだけ。省略可） |
| `color` | 表示色 `[r, g, b]`（0〜1）。シェイプ → 親 → その祖先の順に、ディスプレイレイヤー（有効なもの）の色か、描画のオーバーライド（.ove が on）の色（.ovrgbf なら .ovrgb、そうでなければ色番号 .ovc）を探す。見つからなければ null（ビューアの既定の色） |
| `display` | 表示の種類（.ovdt・レイヤーの .dt）: 0 通常・1 テンプレート（灰色で描く）・2 リファレンス |

リグで形が変わるカーブ（skinCluster・制御点の接続）は、animation.graph の nurbsCurve の `shape` がこの番号を指し、ビューアは毎フレーム変形した形に差し替えます。

## cameras

シーンのカメラ（起動時からある persp・top・front・side と中間オブジェクトは除く）。カメラの transform は nodes に入り、アニメーション・リグで動きます。値は Maya の単位のままです。

| キー | 内容 |
|---|---|
| `name` / `shape` / `path` | transform の名前・シェイプの名前・シェイプのフルパス |
| `transform` | カメラの transform の nodes 番号（カメラはローカルの −Z を向き、+Y が上） |
| `focalLength` | 焦点距離（mm） |
| `horizontalFilmAperture` / `verticalFilmAperture` | フィルムバック（インチ。.ma では `.cap` の 2 つ組） |
| `horizontalFilmOffset` / `verticalFilmOffset` | フィルムオフセット（インチ。.ma では `.fio`） |
| `filmFit` | 0 = フィル・1 = 水平・2 = 垂直・3 = オーバースキャン |
| `nearClipPlane` / `farClipPlane` | クリップ面（長さの単位） |
| `orthographic` / `orthographicWidth` | 平行投影か、そのときの見える幅（長さの単位） |
| `lensSqueezeRatio` / `cameraScale` / `renderable` | レンズのスクイーズ比・カメラのスケール・レンダー可能か |

## viewCamera

保存したときに Maya のビュー（メインのパネル）で見ていたカメラの、cameras の番号です。ビューアは読み込んだときにそのカメラから表示します。persp などの起動時のカメラや、分からないときは -1（自由視点）。.ma では uiConfigurationScriptNode の「Current Layout」のパネル構成で、最初に置かれたモデルパネルのカメラ（`-cam`）を使います。Maya 内からの抽出では、作業中のモデルパネルのカメラです。

## sequencer

カメラシーケンサのショット（なければ null）。`start` / `end` はシーケンスの範囲。

| キー（shots の各要素） | 内容 |
|---|---|
| `name` / `shotName` | shot ノードの名前と、ショット名（.sn） |
| `camera` | ショットのカメラ（.currentCamera）の cameras の番号（-1 はなし）。起動時のカメラでも cameras に入れる |
| `startFrame` / `endFrame` | シーンのフレーム範囲 |
| `sequenceStartFrame` / `sequenceEndFrame` | シーケンス上の範囲。終わりは 開始 + preHold + (endFrame − startFrame) × scale + postHold |
| `scale` / `preHold` / `postHold` | シーンの範囲に掛ける倍率と、前後に最初・最後のフレームを保つフレーム数 |
| `track` / `mute` | トラックの番号（1 が一番上の段。重なるときは番号の小さい方を使う）とミュート |

## render

レンダーの解像度（defaultResolution）。カメラから見るときの解像度ゲートの縦横比に `deviceAspectRatio` を使います。なければ 640×480（4:3）。

## materials

| キー | 内容 |
|---|---|
| `name` / `type` / `shadingGroup` | シェーダーの名前・ノード型・シェーディンググループ |
| `color` | 色（アルベド）の値（線形）。テクスチャがあるときは使わない |
| `texture` | アルベドのテクスチャの textures 番号（なければ -1。maps.baseColor と同じ） |
| `maps` | マップの種類（`baseColor`・`normal`・`roughness`・`metalness`・`ao`・`emissive`・`opacity`）→ `{"texture": textures 番号, "channel": "rgb"・"r"・"g"・"b"・"a"}`。channel は file ノードのどの出力をつないでいるか（ORM の G をラフネスに、など） |
| `roughness` / `metalness` | マップがないときのラフネス・メタリックの値（PBR のシェーダーのみ） |
| `useAlpha` | Maya で同じ file ノードのアルファが不透明度・透明度につながっているか |

## textures

| キー | 内容 |
|---|---|
| `node` | file ノードの名前 |
| `path` | ファイルに書かれたパス |
| `resolved` | 見つかったファイルの絶対パス（見つからなければ null） |
| `url` | resolved の file:// URL |
| `format` | `tga`・`png`・`jpeg` など（表示できない形式なら null） |
| `tried` | 探したパスの一覧（順番どおり） |
| `udim` / `tiles` | UDIM のとき true と、見つかったタイル `[{"tile": 1001, "resolved": ..., "url": ...}]` |
| `note` | 補足（同じ名前のファイルが複数見つかったときなど） |
| `uv` | place2dTexture の UV の配置（繰り返し・オフセットが既定値でないか、接続で動くとき）。`{"place2d": 番号, "repeat": [u, v], "offset": [u, v]}`。テクスチャを UV × repeat + offset の位置で引く。`place2d` は animation.props の `place2d` の番号。rotateUV などほかの属性と UDIM は反映しない（警告） |

## animation

アニメーションカーブ（animCurveTL・TA・TU）のキーです。.ma の読み込みは 2 段階で、ビューアはシーン本体を先に受け取り、animation は後から別に受け取ります（Qt では `setAnimation`）。JSON ファイルに含まれている場合は、シーンと一緒に読み込みます。

```json
{
  "fps": 24, "timeUnit": "film",
  "start": 1, "end": 24, "animStart": 1, "animEnd": 30, "current": 1,
  "curves":   [ { "name": "shoulder_rotateZ", "type": "TA", "offset": 0, "count": 3,
                  "tangent": 18, "weighted": false, "pre": 0, "post": 0 } ],
  "channels": [ { "node": 2, "attr": "rz", "curve": 0 } ],
  "nodes":    [ { "node": 2, "joint": true, "ro": 0, "t": [0, 5, 0], "r": [0, 0, 20], "s": [1, 1, 1],
                  "ra": [0, 0, 0], "jo": [90, 0, 0] } ],
  "times":  { "dtype": "float32", "count": 14, "data": "<base64>" },
  "values": { "dtype": "float32", "count": 14, "data": "<base64>" },
  "tangentTypes":  { "dtype": "uint8", "count": 28, "data": "<base64>" },
  "fixedTangents": { "dtype": "float32", "count": 10, "data": "<base64>" },
  "warnings": [ "..." ],
  "stats": { "curves": 6, "keys": 14, "channels": 6, "nodes": 5, "seconds": 0.001 }
}
```

| キー | 内容 |
|---|---|
| `fps` / `timeUnit` | 1 秒あたりのフレーム数と、.ma の時間単位（`currentUnit -t`） |
| `upAxis` | シーンの上の軸（`y` または `z`。aimConstraint の world up「シーンの上」に使う） |
| `start` / `end` | 再生範囲（playbackOptions の -min / -max。なければキーのある範囲） |
| `animStart` / `animEnd` | アニメーションの範囲（playbackOptions の -ast / -aet） |
| `current` | 読み込み直後のフレーム（time1 の .o） |
| `curves` | カーブごとの設定。`type` は TL・TA・TU（時間で引く）か、UA・UL・UU（ドリブンキー。入力はドライバーの値で、graph のノードとして評価する。キーの「時刻」は入力の値、固定の接線の x も入力の単位）。キーは `times` などの `offset` から `count` 個。`tangent` はカーブの既定の接線の種類（.tan）、`pre` / `post` は範囲外の振る舞い（0 = 一定、1 = リニア、3 = 繰り返し、4 = オフセット付き繰り返し、5 = 往復） |
| `channels` | どのノード（nodes の番号）のどの属性（`tx`〜`sz`）をどのカーブが動かすか |
| `nodes` | 動くノードのローカル行列の材料。アニメーションしない成分はこの値を使う。角度は度。joint は `jo`、transform は `rp`・`sp`・`rpt`・`spt`・`sh`（0 でないもの）を持つ。segmentScaleCompensate の対象のジョイントは `isNode`（.is につながったノードの番号）と `isScale`（その静的なスケール）を持つ。offsetParentMatrix が単位行列でなければ `opm`（16 要素）を持つ。移動・回転・スケールの制限が有効なら `lim`（`{ "t" | "r" | "s": [[最小 × 3], [最大 × 3]] }`。無効な成分は null、回転は度）を持ち、ビューアはカーブ・接続・IK で決まった値をこの範囲に収める。親のスケールが動くジョイントは、自分が動かなくても含む |
| `times` / `values` | キーの時刻（フレーム）と値。値は TL がファイルの長さの単位、TA が度、TU はそのまま |
| `tangentTypes` | キーごとに（入りの種類, 出の種類）。.ma の kit / kot の値（1 = 固定、2 = リニア、3 = フラット、5 = ステップ、9 = スプライン、10 = クランプ、16 = プラトー、17 = ステップ（次）、18 = オート、19 = オートミックス、20 = オートイーズ、21 = オートカスタムなど）。0 はカーブの既定 |
| `fixedTangents` | 固定の接線。5 つずつ（キーの番号, 入りの x, 入りの y, 出の x, 出の y）。x はフレーム、y は値の単位（.ma の秒・cm・ラジアンから変換済み）。値のない側は NaN |
| `warnings` | 再生できないもの（コンストレイントで動くノードなど） |

数値の配列は、base64 にしたリトルエンディアンのバイナリ（`{"dtype", "count", "data"}`）か、数値のリストです。キーの多いモーションでも小さく、速く受け渡せるよう、通常はバイナリにします。

接線の傾きの計算（スプライン・オートなど）とカーブの評価はビューアで行います（`web_src/src/animation.js`）。Maya との違いの調査と確認の手順は [animation_curves.md](animation_curves.md)。

### animation.graph

リグ（コンストレイント・IK・計算ノード）の評価に使うノードの一覧です（なければ空）。評価はビューアで行います（`web_src/src/rig.js`）。

```json
{ "id": 4, "name": "arm_ik", "type": "ikHandle", "dag": 5,
  "attrs":  { "roc": 1 },
  "inputs": { "pvx": { "node": 5, "attr": "ctx" }, "rz": { "curve": 2 } },
  "ik": { "solver": "ikRPsolver", "chain": [0, 1, 2] } }
```

| キー | 内容 |
|---|---|
| `id` | graph の中の番号（`inputs` の `node` が指す） |
| `name` / `type` | ノードの名前と型 |
| `dag` | DAG ノード（ジョイント・トランスフォーム・IK ハンドル）なら nodes の番号、コンストレイント・計算ノードなら -1。DAG ノードは animation.nodes にローカル行列の材料がある |
| `attrs` | ファイルに書かれた属性の値（数値、または 3 つ組などのリスト）。`i1[0:2]` のような範囲は `i1[0]`・`i1[1]`・`i1[2]` に分ける。DAG ノードは移動・回転などの標準の属性を除く（独自の属性・`pa` など） |
| `inputs` | 属性への接続。`{"node": id, "attr": 接続元の属性}` か、カーブなら `{"curve": curves の番号}` |
| `driven` | コンストレイントが動かすノード（nodes の番号）。`targets` はターゲット（`{"index": tg の番号, "node": id}`） |
| `pivot` | poleVectorConstraint の開始ジョイント（nodes の番号）。開始の位置は crp・crt・ps の接続・値から求め、どれもなければこのノードの位置 |
| `ik` | IK ハンドルのソルバー（ikRPsolver・ikSCsolver・ikSplineSolver）と、開始から終端までのジョイント（nodes の番号）。スプライン IK のカーブは `inputs` の `ic` |
| `parent` | nurbsCurve・locator（シェイプ）の親のトランスフォーム（nodes の番号）。ワールド空間（ws・worldPosition）の計算に使う |
| `shape` | nurbsCurve が表示するカーブのとき、そのトップレベルの curves の番号（inputs の `curve` が指す animation.curves とは別） |
| `expr` | expression の式（.ixp。.I[n]・.O[n] で入出力を参照する）。出力は `out[n]`、入力は `inputs` の `in[n]`。時間（.tim）はつながず、ビューアのフレームから求める。解釈できない書き方（MEL コマンド・文字列・ベクトル・未対応の関数・.I/.O 以外の属性）を含む式は graph に入れず、未対応のノードとして警告し、つながるノードを fallback・tainted に回す（判定は `ma_viewer/expression.py`、評価は `web_src/src/expression.js`） |
| `curve` | ドリブンキー（animCurveUA・UL・UU）のとき、animation.curves の番号。入力は `inputs` の `i` |
| `trax` | キャラクターセット（character）の Trax のクリップ `{"clips": [...]}`。各クリップは `start`・`sourceStart`・`sourceEnd`・`scale`・`weight`・`preCycle`・`postCycle`・`hold`・`enable`・`track`・`absolute` と、`channels`（キャラクターの出力の属性 `lv[i]`・`av[i]`・`uv[i]`・`tv[i]` → animation.curves の番号）。キャラクターの出力は、カーブが直接つながる属性（`inputs`）はそのまま、ほかはそのフレームで有効なクリップの値。クリップのカーブは animation.curves で `"trax": true`（キーがクリップの中の時間なので、再生範囲・キーの印には使わない） |
| `geom` | wire・cluster が変形するカーブの transform（`{"出力の番号 k": nodes の番号}`）。ワイヤー（`dw[i]`）・ベースワイヤー（`bw[i]`）はワールド空間なので、カーブをこの行列でワールドへ移して変形し、戻す。CV のウェイトは attrs の `wl[k].w[v]`（なければ 1）。cluster は attrs の `gm[k]` があればそちらを使う |
| `def` | 自作ノードの定義で評価するとき、その型（`animation.nodeDefs` のキー）。属性の名前は定義の短い名前にそろえてある（`attrs`・`inputs`）。評価は `web_src/src/nodeDef.js`、定義の書き方は [node_definitions.md](node_definitions.md) |
| `skin` | カーブを動かす skinCluster のウェイト `[[CV の番号, インフルエンスの論理番号, 値], …]`、`pm`（論理番号 → 16 要素）、`gm`。インフルエンスは `inputs` の `ma[i]` |

### animation.nodeDefs

graph で使っている自作ノードの定義（型 → `{"type", "attributes", "ir"}`）。exprespy のノードはコードからノードごとに作った定義で、キーは `exprespy:` と 12 桁のハッシュ（コードと入出力の型から。同じものは共有する）、属性は入力 `i0`・`i1` …、出力 `o0` …（.ma の `.i[n]`・`.o[n]`）。`attributes` は定義の属性（`name`・`short`・`type`・`array`・`output`・`default`・`children`・ベクトルの成分の `components`）、`ir` は計算を Python の構文解析で検証して木の形にしたもの（`ma_viewer/node_defs.py` の Compiler の説明を参照）。ビューアが IR を関数に組み立てて評価する。

### animation.props

移動・回転・スケール以外で、接続（リグ・カーブ）で値が決まる属性です。ビューアがフレームごとに評価します（なければ空）。

```json
{ "kind": "node", "index": 8,
  "inputs": { "v": { "node": 0, "attr": "geoVis" } },
  "static": { "v": 1, "lodv": 1, "ove": 0, "ovv": 1, "layerHidden": false } }
```

| キー | 内容 |
|---|---|
| `kind` / `index` | 対象。`node`（nodes の番号）・`mesh`（meshes の番号）・`camera`（cameras の番号）・`place2d`（textures の `uv.place2d` の番号。その place2dTexture を使うテクスチャすべて） |
| `inputs` | 属性への接続（graph の `inputs` と同じ形）。node・mesh は表示の属性（`v`・`lodv`・`ove`・`ovv`）、camera は `fl`・`hfa`・`vfa`・`ncp`・`fcp`・`ow`・`hfo`・`vfo`・`lsr`・`cs`、place2d は `ofu`・`ofv`・`reu`・`rev` と 2 つ組の `of`・`re`（長い名前 offsetU などの接続もこの名前） |
| `static` | node・mesh のみ。接続されていない表示の属性のファイルの値と、ディスプレイレイヤーで隠れているか（`layerHidden`） |

表示されるのは `v` と `lodv` が 0.5 以上で、`ove` が有効なら `ovv` も 0.5 以上のとき（ディスプレイレイヤーで隠れていないこと）。接続元が評価できない（未対応のノード）属性は入れず、ファイルの値のまま表示します。graph の DAG ノードは、表示の属性が既定と違う値（`v` = 0 など）なら `attrs` に持ちます（別のノードの表示の入力になるとき用）。

### animation.fallback・animation.tainted

値を求められないノード（未対応のノードの影響を受けるノード）です。接続の構造だけで決まるので、Python が調べて出力します。

| キー | 内容 |
|---|---|
| `fallback` | バインドポーズの形で推定するノード `[{"node": nodes の番号, "anchor": 基準の祖先（-1 はワールド）, "unresolved": [求められない属性]}]`。ワールド行列 = W(anchor) · B(anchor)⁻¹ · B(node)（B はバインドポーズのワールド行列。情報のないノードはファイルの値で計算） |
| `tainted` | 推定もできない（バインドポーズの情報がない）ノードの番号。子にも伝わる（子が fallback にある場合を除く） |

値の単位は Maya の内部単位にそろえて評価します（角度はラジアン。ファイルに度で書かれた角度の属性は読むときに変換する）。行列の属性（`-type "matrix"`）は 16 要素の配列で、行列の規約は nodes の `matrix` と同じです。

## 行列の規約

行列は Maya と同じ**行ベクトル規約・行優先**の 16 要素です（点 p は `p' = p · M`、平行移動は要素 12〜14）。

この並びは、three.js の `Matrix4.fromArray()`（列優先・列ベクトル規約）にそのまま渡すと同じ変換になります。転置は不要です。

### transform のローカル行列

```
M = [-SP] [S] [SH] [SP] [SPT] [-RP] [RA] [R] [RP] [RPT] [T]
```

SP・RP はスケール・回転ピボット、SPT・RPT はその補正移動、RA は rotateAxis、R は回転順（rotateOrder）に従った回転です。

### joint のローカル行列

```
M = [S] [RA] [R] [JO] [IS] [T]
```

JO は jointOrient です。IS は segmentScaleCompensate が有効なときの、親ジョイントのスケールの逆数です（`.is` に接続された親の `.s` から求めます）。

### offsetParentMatrix

offsetParentMatrix（OPM。Maya 2020 以降）がある場合、nodes の `matrix` は transform・joint のどちらも次の値です。

```
matrix = M · OPM          ワールド行列 = matrix · 親のワールド行列
```

### スキン変形

Maya（行ベクトル規約）:

```
p' = Σ wᵢ · p · gm · pmᵢ · Wᵢ · gm⁻¹        Wᵢ はインフルエンスの現在のワールド行列
```

three.js では `SkinnedMesh` を detached モードにし、`bind(skeleton, gm)` と `boneInverses = pm` を指定すると同じ結果になります。
