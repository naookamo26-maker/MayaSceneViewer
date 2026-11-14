# テイク（アニメーションだけの入出力）の計画と実装の依頼（1.40.1 の時点）

同じリグのアニメーションだけを取り出して、別のシーンに当てる・切り替える・保存する機能の計画です。
この文書だけで実装できるように、決めたこと・形式・手を入れる場所・確かめ方を書いてあります。
調査ではリポジトリを変えていません（試作と計測は一時フォルダで行った）。

FBX のテイクと同じ考え方です。メッシュ・リグ・テクスチャは 1 つだけ持ち、動きだけを何本も持って切り替えます。

## 言葉

| 言葉 | 意味 |
|---|---|
| テイク | 1 体のリグ（名前空間 1 つ）に対する、切り替えて使う動きのまとまり。キーと、当てる相手の名前を持つ |
| 土台 | テイクを当てる先のシーン（メッシュ・リグ）。シーンの `animation` から、アニメーション側のものを外したもの |
| シーンのアニメーション | シーンがもともと持っているアニメーション。テイクの一覧の先頭に置き、選ぶと元に戻る |
| 結び付け | カーブ → 相手（ノードの名前と属性） |
| `.msva` | テイクだけのファイル。1 ファイルに複数のテイクを入れられる。単体では表示できない |

「トラック」とは呼びません（Trax のクリップの段 `track` と混ざるため）。画面・ドキュメント・コードの名前は「テイク」（`take`）にそろえます。

## 決めたこと

ユーザーと決めた内容です。変えるときは、先に相談してください。

| 項目 | 決めたこと |
|---|---|
| 呼び方・拡張子 | テイク、`.msva` |
| 入れるもの | コントローラーのキー（時間のカーブ）、アニメーションレイヤーと Trax のノード、キーのない値（下の「キーのない値」）、リグに付いた表示のキー |
| 入れないもの | カメラのキー・カメラの属性のキー、カメラシーケンサー、ショット側で足したコンストレイント（警告を出す） |
| 単位 | 名前空間 1 つにつきテイク 1 つ。名前空間のないシーンは、カメラを除いた全体で 1 つ |
| キーのない値 | リファレンスのシーンは、リファレンスの編集の setAttr（アニメーターが変えた値）。リグを直接持つシーンは、キーのあるコントローラーの値だけ |
| 抽出元 | .ma（参照先のファイルがなくても取り出せること）、Maya で開いているシーン、既存の .msv・共通 JSON |
| 保存 | `.msva` に書き出す。.msv の中にも複数入れられる（古い版でも .msv は開けること） |
| フレームの範囲 | テイクごとに、元のフレーム番号のまま持つ。切り替えるとタイムラインの範囲もそのテイクのものになり、フレームは先頭へ移す |
| 切り替え | 一覧（リスト）の行をクリック。先頭の行は「シーンのアニメーション」 |
| 連続再生 | チェックしたテイクを、一覧の順に再生する。終わりまで行ったら次へ、末尾まで行ったら先頭へ。つなぎ目はブレンドしない。タイムラインは常にいまのテイクだけを示す（全体を帯で並べる表示は作らない） |
| ドロップ | 一覧に落とすとテイクとして足す。3D ビューに落とすといままでどおりシーンを開く（`.msva` はどこに落としてもテイクとして足す） |
| 体格の違うキャラ | 同じ仕様のリグなら、そのまま当てられること（ずれは許す）。大きさの補正は後の段階 |
| 後の段階 | 体格の違いの補正、テイクを重ねる・混ぜる、リグを省いたベイク（再生専用） |

## 調査でわかったこと

### いまの構造

- アニメーションは、シーン本体とは別のデータとして後から渡している（`web_src/src/main.js` の `setAnimation(anim)`。評価器・再生キャッシュ・
  タイムライン・カーブエディタをすべて作り直す）。**テイクの切り替えは、土台とテイクから `animation` を組み立てて `setAnimation` を呼べば済む。**
- カーブの番号（`animation.curves` の位置）を指している所は 5 つ:
  `animation.channels[].curve`、`animation.graph[].inputs[属性] = {"curve": 番号}`、`animation.props[].inputs[属性] = {"curve": 番号}`、
  ドリブンキーの `animation.graph[].curve`、Trax の `animation.graph[].trax.clips[].channels`（[data_format.md](data_format.md) の animation）。
- キーの配列（`times`・`values`・`tangentTypes`・`fixedTangents`）は全カーブをつなげたもので、カーブは `offset`・`count` で範囲を持つ。
  `fixedTangents` の 1 つ目の値は、つなげた配列の中のキーの番号。
- 動くノードは、ビューアが `channels` と `graph` から決める（`web_src/src/rig.js` の `this.moving`）。`animation.nodes` に項目が増えても、
  それだけでは動くノードにならない。
- .ma のリファレンスの編集は `ma_viewer/ma_scene.py` の `_finish_references`・`_apply_edit`・`_route_placeholders`、編集の読み取りは
  `ma_viewer/references.py` の `parse_reference_edits`。参照先のファイルがないと、編集は「相手のノードがない」として飛ばされ、
  カーブは相手を失って、いまはノード 0 個・アニメーションなしになる。
- .msv は zip で、ビューアは中身を名前で読む（`web_src/src/package.js`・`ma_viewer/package.py`）。知らない名前の中身は読まないので、
  中身を足しても古い版で開ける。

### 試作の結果

共通 JSON から「カーブ・結び付け・静的な値」を取り出し、カーブへの結び付けを外した同じリグに名前で当て直して、全フレームの行列を比べました
（試作のコードは末尾の「付録」）。

| サンプル | 結果 |
|---|---|
| `samples/reference_project/scenes/shot.ma` → `assets/arm_rig.ma`（リグ単体） | 完全に一致（名前空間 `armA:` と親の違い `\|world_grp` を吸収。`fkik = 1` を運ぶ） |
| `ctrl`・`hik`・`rig`・`rig3`・`stretch_spline`・`anim` | 完全に一致 |
| `rig6_sample` | 1 ノードだけ不一致。カーブの表を丸ごと入れ替えたため、リグのドリブンキー（animCurveUA・UL）のカーブが消えた |
| `trax_sample` | 不一致。Trax のクリップのカーブを運んでいない |

不一致の 2 つは試作の手抜きで、下の形式では対応してあります。ほかに、固定の接線（`fixedTangents`）を運ばないと `anim_sample` がずれました。

参照先のファイルがない状態でも、ショットの .ma だけから次のものを読めることを確かめました（`parse_reference_edits` の結果）:

```
(0, ['|armA:rig_grp', '|world_grp', '-s -r '])                                      親の変更
(2, ['|world_grp|armA:rig_grp|armA:hand_ctrl', 'fkik', ' 1'])                       キーのない値
(5, ['armARN', '|world_grp|armA:rig_grp|armA:hand_ctrl.translateX', 'armARN.placeHolderList[1]', ''])   結び付け
connectAttr "hand_ctrl_translateX.o" "armARN.phl[1]";                               カーブ → プレースホルダー
```

データの大きさ（合成の大きなリグ。カーブ 901 本・キー 4,203 個・graph 6,001 ノード。deflate 後）: キー 約 12 KB、リグ 約 100 KB。
キーは小さいので、テイクを何本持っても負担になりません。

## テイクの形式

### テイク 1 つ

```json
{
  "name": "shot010", "namespace": "armA",
  "source": { "kind": "ma", "name": "shot010.ma", "generatorVersion": "1.41.0" },
  "fps": 24, "timeUnit": "film", "linearUnit": "cm",
  "start": 1001, "end": 1050, "animStart": 1001, "animEnd": 1050,
  "curves":   [ { "name": "hand_ctrl_translateX", "type": "TL", "offset": 0, "count": 2,
                  "tangent": 2, "weighted": false, "pre": 0, "post": 0 } ],
  "times": [...], "values": [...], "tangentTypes": [...], "fixedTangents": [...],
  "bindings": [ { "target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "attr": "tx", "curve": 0 },
                { "target": "|armA:root|armA:arm_ctrl", "attr": "rx", "from": { "node": 0, "attr": "o" } } ],
  "nodes":    [ { "name": "arm_ctrl_rotateX_blend", "type": "animBlendNodeAdditiveDA",
                  "attrs": { "wa": 1, "wb": 1 },
                  "inputs": { "ia": { "curve": 1 }, "ib": { "curve": 2 }, "wb": { "node": 1, "attr": "fgwt" } } } ],
  "statics":  [ { "target": "|world_grp|armA:rig_grp|armA:hand_ctrl", "values": { "fkik": 1 } } ],
  "warnings": [ "..." ]
}
```

| キー | 内容 |
|---|---|
| `name` | 一覧に出す名前。初期値は抽出元のファイル名（拡張子なし）。同じファイルから複数取れたら、後ろに名前空間を付ける（`shot010 (armA)`） |
| `namespace` | 抽出元での名前空間（なければ `""`）。入れ子の外側まで含める（`armA`。`armA:prop` の小道具は別のテイク） |
| `fps`・`timeUnit` | キーのフレームの単位。再生はこのフレームレートで行う |
| `linearUnit` | 移動のカーブの値の単位。当てる先と違えば、当てるときに値を掛けて直す |
| `start`〜`animEnd` | 再生範囲とアニメーションの範囲。抽出元の playbackOptions（なければキーのある範囲） |
| `curves`・`times`・`values`・`tangentTypes`・`fixedTangents` | `animation` の同じ名前のキーと同じ形・同じ単位（[data_format.md](data_format.md)）。`offset` と `fixedTangents` のキーの番号は、このテイクの中の番号。時間のカーブ（TL・TA・TU）だけ。Trax のクリップのカーブは `"trax": true` |
| `bindings` | 結び付け。`curve`（このテイクの `curves` の番号）か `from`（このテイクの `nodes` の番号と出力の属性）のどちらかを持つ |
| `bindings[].target` | 相手のノードの DAG のフルパス（抽出元に書かれたまま。名前空間つき）。DAG でないノードは名前 |
| `bindings[].attr` | 相手の属性。移動・回転・スケール・表示は短い名前（`tx`〜`sz`・`v`）。独自の属性は、わかれば短い名前。参照先がなくて短い名前がわからないときは、ファイルに書かれた名前のままにして `"raw": true` を付ける |
| `nodes` | 一緒に運ぶアニメーション側のノード（animLayer・animBlendNode*・character と Trax など）。`animation.graph` の項目と同じ形で、`id`・`dag` は持たない。`inputs` の `node` は、このテイクの `nodes` の番号。リグ側のノードの出力を読む入力は `{"target": パス, "attr": 属性}` |
| `statics` | キーのない値。`values` は属性 → 数値（3 つ組は `tx` などの成分に分ける）。移動はファイルの長さの単位、回転は度、ほかはファイルに書かれた値 |
| `warnings` | 抽出のときの警告（運ばなかったコンストレイントなど）。当てたときに一覧へ出す |

数値の配列は、`animation` と同じく base64 のバイナリ（`{"dtype", "count", "data"}`）か数値のリストです。

### アニメーション側のノード

次の型を「アニメーション側」とします。土台から外し、テイクの `nodes` で運びます。

- `animLayer`、`animBlendNode` で始まる型
- `character`（Trax のクリップを持つもの。`trax` のキーごと運ぶ）
- リファレンスのシーンでは、上に加えて「リファレンスの外（ショットのファイル）にあるノード」という条件も付ける（リグの中の animBlend ノードは土台に残す）。
  共通 JSON からの抽出では、ノードの名前に名前空間があるかで判定する

ショット側で足したコンストレイント（リファレンスの外にあるコンストレイント）は運ばず、テイクの `warnings` に名前を出します。

時間のカーブのうち、リグの中にあるもの（名前に、相手と同じ名前空間が付くもの。車輪の自動回転など）は、土台に残します。テイクには入れません。

### 名前の合わせ方（当てるとき）

1. `target` の各階層から、テイクの `namespace` を外す（`|world_grp|armA:rig_grp|armA:hand_ctrl` → `|world_grp|rig_grp|hand_ctrl`）。
2. 当てる先の名前空間（一覧で選べる。既定は下の「当てる先の決め方」）のノードから、同じように名前空間を外して、いちばん下の名前
   （`hand_ctrl`）が同じものを探す。
3. 同じ名前が複数あれば、パスの下からいちばん長く一致するものにする。それでも 1 つに決まらなければ「あいまい」として当てない。
4. 属性は、まず名前のまま、なければ graph の `names`（下の「共通 JSON に足すもの」）で長い名前から引く。

親の違い（リファレンスの編集で親を変えた・グループに入れた）は、下からの一致で吸収します。

**当てる先の決め方**: シーンの名前空間ごと（名前空間なしも含む）に、当たる結び付けの数を数えて、いちばん多いものにします。同じ数なら、
テイクの `namespace` と同じ名前のもの、それもなければ最初のもの。当たる結び付けが 0 のテイクは、ドロップでは足しません（ログに件数を出す）。
ファイルを選んで読み込んだときは、0 でも足して、行に警告の印を出します。

### `.msva`

.msv と同じ作りの zip です（`ma_viewer/package.py` の書き方をそのまま使う）。

| 中身 | 内容 |
|---|---|
| `manifest.json` | `{"format": "maya-scene-viewer-takes", "version": 1, "created": ..., "generator": "MayaSceneViewer", "generatorVersion": ...}` |
| `takes.json` | `{"takes": [テイク, ...]}`。数値の配列は `{"dtype", "count", "buffer": "bin/takes.bin", "offset", "encoding"}`（.msv の scene.json と同じ） |
| `bin/takes.bin` | 数値の配列（.msv の `bin/data.bin` と同じ詰め方） |

### .msv の中のテイク

.msv に `takes.json` と `bin/takes.bin` を足します（上と同じ形）。`manifest.json` の `version` は 2 のままにします（古い版は知らない中身を読まないので、
シーンとしてはそのまま開ける）。`scene.json` の `animation` は、いままでどおりシーンのアニメーションです。

選んでいたテイク・連続再生の設定は `view.json` に足します: `"takes": {"active": 番号（-1 はシーンのアニメーション）, "continuous": bool, "checked": [番号]}`。

### 共通 JSON に足すもの（互換を保つ）

当てるために、土台のシーンに次の 2 つが要ります。どちらも省略でき、ない古い .msv でも動くようにします。

| キー | 内容 | ないとき |
|---|---|---|
| `restNodes` | `animation.nodes` にないノード（transform・joint）の、ローカル行列の材料（`animation.nodes` の項目と同じ形。`ma_viewer/animation.py` の `rest_entry`）。土台でリグにつながっていないノード（FK だけのジョイントなど）にキーを当てるのに使う | `nodes[].attrs`（t・r・s・jo・ro）から作る。ピボット・rotateAxis のあるノードは形がずれるので、当てたときに警告を出す |
| `animation.graph[].names` | 独自の属性の、長い名前 → 短い名前（違うものだけ） | 属性の名前がそのまま一致するものだけ当てる |

`restNodes` は `animation` のないシーン（キーもリグもないモデル）にも要るので、シーンの直下に置きます。大きさは、合成のリグ（3,301 ノード）の
`animation.nodes` で 395 KB・deflate 後 14 KB でした。`samples/*.json` は作り直しになります（`tools/make_*.py`）。置き場所と大きさが気になる場合は、
実装のときに別の持ち方（アニメーションと一緒に渡すなど）にしてかまいません。

## 取り出す（抽出）

抽出は 2 か所に作ります。どちらも同じ形式を出し、同じシーンなら同じ結果になること（下の「確かめ方」）。

### A. .ma と Maya のシーンから（Python。新しい `ma_viewer/take.py`）

`MaScene`（.ma の解析の結果。Maya 内は `maya_scene.py` の `SceneText.build()` が同じものを作る）から取り出します。共通 JSON を作る前の段階なので、
表示に効かないカーブも落とさず、メッシュも読みません。

1. リファレンスの外にある時間のカーブ（animCurveTL・TA・TU）を集める。
2. カーブの出力の先をたどる:
   - 実在するノード → 結び付け（パスと属性。属性は `MaScene.attr_key` で短い名前にする）。
   - アニメーション側のノード → テイクの `nodes` に入れ、その出力の先をさらにたどる。
   - reference ノードのプレースホルダー（`.phl[n]`）で、相手が解決できない（参照先がない・アンロード）→ リファレンスの編集（コード 5）に書かれた
     プラグの文字列から結び付けを作る。属性は全体の表（`ma_reader.normalize_attr`）で短くし、表にない名前は `"raw": true`。
   - リファレンスの編集のコード 3（connectAttr）で、片方がショット側のノードのものも同じように扱う。
3. カメラ（カメラのシェイプを持つ transform と、カメラのシェイプ）への結び付けは捨てる。
4. キーのない値:
   - リファレンスのあるシーン: その名前空間のノードへの編集のコード 2（setAttr）のうち、数値のもの。
   - リファレンスのないシーン: キーのあるノード（結び付けの相手）の、キーのない移動・回転・スケールと独自の属性の値。
5. 名前空間ごとに分けて、テイクにする。結び付けが 1 つもない名前空間は出さない。
6. カーブの中身は、`ma_viewer/animation.py` の `parse_curve`・`curve_record` をそのまま使う（単位の変換も同じ）。
   アニメーション側のノードの `attrs`・`inputs` は、`ma_viewer/rig.py` の `build_graph` が graph の項目を作るのと同じ処理を使う（関数に分けて共有する）。

参照先がないときのために、`ma_scene.py` に次の変更が要ります。

- 相手のノードがなくて飛ばした編集（コード 2・3・5）を、捨てずに覚えておく（いまは `ref_edit_missing` に名前だけ入れている）。
- 抽出専用の読み方では、参照先のファイルを読まない（`parse_ma_file(path, load_references=False)` がある）。参照先があってもなくても同じ結果になるよう、
  **抽出はいつも「参照先を読まない」で行う**のを勧めます。速く、手元に参照先があるかどうかで結果が変わりません。
  ただし独自の属性の短い名前がわからなくなるので、当てる側の `names` で引けることを確かめてください。

Maya 内（`ma_viewer/maya_scene.py`）は、集めた文を同じ処理に通します。参照先が見つからずアンロードのままのシーンでも、カーブと編集は
Maya が持っているはずですが、**未確認**です（`cmds.referenceQuery(editStrings=True)` が、アンロードのリファレンスでも返すか）。

### B. 共通 JSON から（JS。新しい `web_src/src/takes.js`）

読み込み済みのシーン・.msv・共通 JSON から取り出します（ブラウザでも動かすため JS で作る）。

- `splitAnimation(scene, namespace)` → `{ base, take }`。`base` は、その名前空間のアニメーション側のものを外した `animation`（カーブは詰め直し、
  ドリブンキーとリグの中の時間のカーブは残す）。`take` は外したもの。
- 結び付けは、`channels`・graph の `inputs`・`props` の `inputs` の `{"curve"}` から作る。同じ相手・同じ属性は 1 つにまとめる
  （DAG ノードは `channels` と graph の `inputs` の両方に同じカーブがある）。
- カメラは、`scene.cameras[].transform` のノードと、`props` の `kind: "camera"` を除く。
- キーのない値は、キーのある相手の、キーのない t・r・s（`animation.nodes` から）と、graph の `attrs` の独自の属性（表示の属性を除く）。
- .msv は表示に効かないカーブを持たないので、取り出せるのは残っているカーブだけ（制限として README に書く）。

## 当てる（JS。`web_src/src/takes.js`）

`composeAnimation(scene, base, [{ take, namespace }]) → { animation, report }`。純粋な関数にして、Node のテストで確かめられるようにします。

1. `base` を写す（graph・channels・props・nodes・キーの配列）。元は書き換えない。
2. テイクのカーブを `curves`・キーの配列の後ろに足し、番号をずらす（`fixedTangents` のキーの番号も）。長さの単位が違えば TL の値と接線を掛ける。
3. テイクの `nodes` を graph の後ろに足し、`id` を振り直す。`{"target"}` の入力は、土台の graph のノードの `{"node", "attr"}` にする。
4. 結び付けを当てる。相手が:
   - シーンのノードで、属性が `tx`〜`sz` → `channels` に足す。`animation.nodes` になければ `restNodes`（なければ `nodes[].attrs`）から項目を足す。
     graph にそのノードがあれば、graph の `inputs` にも入れる（Python の `build_animation`・`build_graph` が出す形と同じにする）。
   - graph のノードの、それ以外の属性 → graph の `inputs`。
   - 表示（`v`）→ `props` の `inputs`（項目がなければ足す。`static` は土台の値）。
   - `from` のもの → `{"node": 振り直した id, "attr"}` を入れる。
5. `statics` を当てる（`animation.nodes` の t・r・s、graph の `attrs`）。キーのある成分には当てない。
6. `fps`・`start`〜`animEnd`・`current`（= `start`）をテイクのものにする。
7. `report`: 当たった数、当たらなかった結び付け（理由: 相手がない・あいまい・属性がない）、当たらなかった静的な値の数、警告。

複数の相手（キャラ A にテイク 1、キャラ B にテイク 2）は、同じ関数にテイクを複数渡します。範囲とフレームレートは、最後に選んだテイクのものにします。
画面で複数の相手を扱うのは段階 3 で、段階 1 では 1 つだけ渡します。

当てたあとの graph が土台と同じ形でない（ノードが増える）ので、再生キャッシュ・ワーカーには組み立てた `animation` をそのまま渡します
（`setAnimation` がいまやっていること）。

## 画面

### テイクの一覧

左右のパネル（`web_src/src/ui.js` の `bindPanels`。ツリー・ノードの情報がある所）に「テイク」の一覧を足します。置く場所は、既存のツリーと
並べて見やすい所を実装のときに決めてください。テイクが 1 つもなく、シーンにアニメーションもないときは、落とせる場所として空の一覧を出します。

| 要素 | 内容 |
|---|---|
| 先頭の行 | 「シーンのアニメーション」（アニメーションのないシーンでは「アニメーションなし」）。消せない |
| 行 | 名前、範囲（1001〜1050）、フレーム数、当てている相手（名前空間）、警告の印（当たらなかった結び付けがあるとき。クリックで中身の一覧） |
| いまのテイク | 強調して表示（`aria-current`） |
| クリック | そのテイクに切り替えて、先頭のフレームへ。再生中なら再生を続ける |
| チェック | 連続再生に含めるか（既定はオン） |
| 並べ替え | ドラッグで順番を変える。キーボードでも変えられること |
| 行の操作 | 名前の変更、削除、`.msva` に書き出す |
| 一覧の操作 | 読み込む（ファイルを選ぶ）、すべて・チェックしたものを `.msva` に書き出す、連続再生のオン・オフ |

ファイルメニューにも「テイクを読み込む…」「テイクを書き出す…」を足します（Qt 版は `ma_viewer/viewer.py` の `_build_actions`、ブラウザは
`ma_viewer/web/index.html` の `menu-file`。`file-input` の `accept` に `.msva` を足す）。

### 切り替え（`web_src/src/main.js`）

- シーンを読み込んだら、シーンの `animation` を「シーンのアニメーション」として取っておく。テイクを足したときに、相手の名前空間の土台を作る
  （`splitAnimation`。名前空間ごとに 1 回）。
- `setTake(番号)`: `composeAnimation` → `setAnimation(組み立てたもの)` → 先頭のフレームへ。-1 はシーンのアニメーションに戻す。
- テイク（シーンのアニメーション以外）を選んでいるあいだは、シーケンスで見る表示を外す（`setSequenceFollow(false)`）。
- シーンを開き直す・別のシーンを開くと、テイクの一覧は空にする（.msv に入っていたものは読み込む）。
- 範囲を狭めたら（`main.js` の `clip.start`・`clip.end` を変える所）、そのテイクの `start`・`end` として覚える。
- 表示の状態（`getViewState`・`applyViewState`）に、選んでいたテイクと連続再生の設定を足す。
- フレームレートがシーンと違うテイクは、切り替えたときにログへ出す。

`setAnimation` は評価器と再生キャッシュを作り直すので、重いリグでは切り替えの直後に少し待ちます。段階 1 ではそのままにします。

### 連続再生

再生がいまのテイクの範囲の終わりに来たら（`main.js` の再生を進める所。いまは範囲の先頭へ戻している）、連続再生がオンなら、
次のチェック済みのテイクへ `setTake` して再生を続けます。末尾の次は先頭です。チェック済みが 1 つなら、いままでどおりのループです。
`setAnimation` は再生を止めるので（`this.pause()`）、切り替えたあとに再生を始め直します。

切り替えの引っかかりを減らす工夫（次のテイクの再生キャッシュを先に作る）は、段階 1〜3 が終わってから、必要なら行います。

### ドロップ

| 落とすファイル | 一覧に落とす | それ以外（3D ビューなど）に落とす |
|---|---|---|
| `.msva` | テイクを足す | テイクを足す（シーンがなければ「先にシーンを開いてください」） |
| `.ma`・`.mb` | 抽出してテイクを足す（Qt 版・Maya 内だけ。`.mb` は Maya 内だけ） | シーンを開く（いままでどおり） |
| `.msv`・`.json` | 抽出してテイクを足す | シーンを開く（いままでどおり） |

- 落とした位置（行のあいだ）に入れる。複数のファイルは、ファイル名の順に足す。
- 1 つのファイルに複数のテイクがあれば、いまのシーンに当たるものだけ足す（上の「当てる先の決め方」）。
- ドラッグ中は、一覧の枠を強調して「ここに落とすとテイクとして足す」と示す。

**ブラウザ**: いまは `document` 全体でドロップを受けて `loadFile` を呼んでいる（`main.js` の `drop`）。落ちた場所が一覧の中かどうかで分ける。
複数のファイル（`dataTransfer.files`）を受ける。

**Qt 版**: Web ビューはドロップを受けず（`viewer.py` の `self.view.setAcceptDrops(False)`）、ウィンドウの `dropEvent` が受けている。
落ちた位置を Web ビューの座標にして、ビューアに「その位置は一覧の中か・何行目か」を聞いてから分ける（`run_js` の結果は後から届くので、
ドロップを受けてから聞く）。ドラッグ中の強調も同じ問い合わせで行う。ページの拡大率と画面の倍率で座標がずれないことを確かめてください。
`_dropped_path` は最初の 1 つしか返さないので、テイクの場合は全部を返すようにします。`OPENABLE_EXT` に `.msva` を足します。

Qt 版でのファイルの読み方:

| ファイル | 流れ |
|---|---|
| `.msva` | Python が読んで（`package.py`）、テイクの JSON をビューアへ渡す |
| `.ma` | 読み込みのスレッドで抽出（A）して、テイクの JSON をビューアへ渡す。画面を止めない。進み具合はステータスバーに出す |
| `.msv`・`.json` | Python が読み、メッシュ・テクスチャ・カーブの形を外して（`nodes` のパスと `animation`・`cameras` だけ残す）ビューアへ渡し、ビューアが抽出（B）する |

書き出しは、ビューアからテイクの JSON を受け取って Python が書きます（`getViewState` と同じ受け渡し）。.msv の書き出し
（`viewer.py` の `_export_package_with` → `package.write_package`）にも、一覧のテイクを入れます（`write_package` に `takes` の引数を足す。
`"keep"` なら元の .msv のものを引き継ぐ。`view` と同じ扱い）。

ブラウザの `.msva` の書き出しは、段階 2 で作ります（zip を書く処理がまだないため。`CompressionStream` が使えるはず）。難しければ Qt 版だけにして、
README に書いてください。

### コマンドライン（`ma_viewer/cli.py`）

```
python -m ma_viewer take shot010.ma -o shot010.msva            # 抽出（名前空間ごとに全部）
python -m ma_viewer take shot010.ma --namespace armA -o a.msva # 1 つだけ
python -m ma_viewer take scene.msv -o scene.msva               # .msv・共通 JSON から
python -m ma_viewer info shot010.msva                          # テイクの一覧（名前・名前空間・範囲・カーブの数）
python -m ma_viewer pack rig.ma --take shot010.ma --take shot020.msva -o rig.msv   # テイクを入れた .msv
```

.msv・共通 JSON からの抽出（B）は JS にしかないので、コマンドラインでは Node.js を呼ぶか（`verify` と同じやり方）、Python にも小さく作るかを
実装のときに決めてください。Python にも作る場合は、A・B と同じ結果になるテストを足します。

## 進め方

段階ごとに PR を分けるのを勧めます。どの段階も、単独で使える状態にします。

| 段階 | 内容 |
|---|---|
| 1 | 形式（テイク・`.msva`・.msv の中のテイク）、`takes.js`（`splitAnimation`・`composeAnimation`。アニメーションレイヤー・Trax を含む）、`restNodes`・`names`、一覧（切り替え・削除・名前の変更）、`.msva`・.msv・共通 JSON の読み込みとドロップ、Qt 版の `.msva` と .msv への書き出し |
| 2 | `take.py`（.ma・Maya からの抽出。参照先なしを含む）、Qt 版の .ma のドロップ、Maya 内の「開いているシーンからテイクを取り出す」、コマンドライン、ブラウザの `.msva` の書き出し |
| 3 | 連続再生（チェック・並べ替え）、複数の相手（当てる先の名前空間を行で選ぶ・相手ごとに別のテイク） |
| 4（必要になったら） | 切り替えの引っかかりを減らす、体格の違いの補正（腰の高さの比で移動のキーを掛ける）、リグを省いたベイク（下の「後の段階」） |

段階 1 でアニメーションレイヤー・Trax の持ち運びが重ければ、段階 1 では「アニメーション側のノードのあるシーンからは抽出しない（警告を出す）」に
して、段階 2 の最初に回してもかまいません。その場合も、形式（`nodes`・`from`）は最初から入れておきます。

## 確かめ方

- **往復**（`web_src/tests/takes.test.mjs`）: `samples/*.json` のアニメーションのあるシーンすべてで、`splitAnimation` → `composeAnimation` の結果を
  評価し、元の `animation` と全フレームの行列（`rig.evaluate`）・`evaluateProps`・カーブの形が同じこと。`rig6_sample`（ドリブンキー・
  アニメーションレイヤー）、`trax_sample`、`anim_sample`（固定の接線）、`hik_sample` を必ず含める。
- **別のシーンへ**: `samples/reference_project/scenes/shot.ma` のテイクを、`assets/arm_rig.ma`（名前空間なし・親が違う）に当てて、`shot.ma` を
  そのまま開いたときと、同じ名前のノードの行列が同じこと。
- **参照先なし**（`tests/test_take.py`）: `shot.ma` だけを一時フォルダに写して抽出した結果が、参照先のある状態で抽出した結果と同じこと
  （属性の `raw` を除く）。それを `arm_rig.ma` に当てて、上と同じ行列になること。
- **A と B が同じ**: 同じ .ma から、Python の抽出（A）と、共通 JSON からの抽出（B）で、当てた結果の行列が同じこと。
- **カメラを運ばない**: `samples/sequencer_sample`・`camaim_sample` で、テイクにカメラへの結び付けがなく、土台にカメラのキーが残ること。
- **当たらないもの**: 相手のないテイクを当てても落ちず、`report` に理由つきで出ること。あいまいな名前（同じ名前のノードが 2 つ）も。
- **古い .msv**: `samples/sample_arm_v1.msv`・`sample_arm.msv`（`restNodes`・`names`・`takes.json` なし）が、いままでどおり開けること。
  テイクを入れた .msv を、`takes.json` を読まない読み方（いまの `package.py` の `read_package`）で開いて、シーンが同じこと。
- **体格の違うリグ**: `tools/` に、`arm_rig.ma` の骨の長さを変えたリグを作るスクリプトを足し、同じテイクが全部の結び付けで当たること
  （行列は違ってよい。コントローラーの値が同じこと）。
- **Qt 版**（`tests/qt_take_test.py`）: 一覧の表示、切り替えで範囲とフレームが変わること、ドロップの振り分け（一覧の中・外）、.msv への書き出しと
  読み直しで一覧が戻ること。
- サンプル: `tools/make_take_sample.py` で、同じリグを参照する 2 つのショット（名前空間が違う・片方はアニメーションレイヤーあり）と、
  それを入れた `.msva`・.msv を `samples/` に作る。
- 既存のテストがすべて通ること（`python -m unittest discover tests`、`cd web_src && npm test`）。再生のベンチ（[benchmark.md](benchmark.md)）の
  `--save`・`--check` で、テイクを使わないときの評価結果が変わらないこと。

## 気を付けること

- **元の `animation` を書き換えない**: `setAnimation` は受け取った `animation` を `this.data.animation` に入れ、ワーカーへも渡す。
  土台とテイクは別に持ち、組み立てのたびに新しいオブジェクトを作る。キーの配列（型付き配列）は写さずに共有してよいが、`setAnimation` はキーの配列を
  ワーカーへ渡す形に取り出す（`clip.takeKeyArrays(anim)`）ので、その処理が土台・テイクの配列を書き換えないことを確かめる。
- **カーブの番号**: 上の「いまの構造」の 5 か所をすべて振り直す。1 か所でも漏れると、別のカーブを読む。
- **独自の属性の単位**: 角度の型の独自の属性は、graph の `attrs` ではラジアンになっている（読むときに変換している）。参照先なしの抽出では型が
  わからないので、ファイルに書かれた値のままになる。段階 2 では制限として README に書き、当てる側で型がわかるなら直す。
- **ポーズ確認**: ビューアで変えたポーズ（追加分）は、切り替えても `setAnimation` のいまの動きのままにする。
- **警告**: 当たらなかった結び付けは、既存の警告の一覧（`ui.setWarnings`）に 1 件ずつ足さず、テイクの行から見られるようにする（件数だけログへ）。
- **書き言葉**: 画面とドキュメントの文は、いまの README と同じ書き方にそろえる（「テイク」「当てる」「取り出す」）。

## 後の段階（この計画では実装しない）

**リグを省いたベイク（再生専用の .msv）**: 再生キャッシュが作っている「フレームごとの行列」を .msv に保存する案です。調査の結果:

- 速さ（合成リグ: 手足 300・graph 6,001 ノード・120 フレーム。1 フレームあたり）: リグを評価 12.8 ms、1 周目 16.3 ms、再生キャッシュから 0.15 ms。
  再生キャッシュができたあとは、いまもベイクと同じ速さ。ベイクで速くなるのは、開いた直後の準備（最初の 1 フレームで約 240 ms）と、
  キャッシュを作る待ち時間。
- 大きさは「動くノードの数 × フレーム数 × 48 バイト」（上の合成リグで 12 MB。圧縮前）で、リグ（deflate 後 0.1 MB）より大きくなりやすい。
  小さなサンプルでは deflate 後で約 1/3。表示に効くノード（スキンのジョイントなど）だけに絞れば減らせる。
- 失うもの: コントローラーを動かすポーズ確認、リグの診断、カーブとキーの表示、体格の違うキャラへの流用。
- 利点: Maya 内から書き出すときに Maya の評価結果を焼けば、未対応のノードのあるリグでも正確に再生できる。

既定にはせず、書き出しの選択肢として足すのがよい、という結論です。

**テイクを重ねる・混ぜる**（Trax・アニメーションレイヤーのように同時に効かせる・ブレンドでつなぐ）: ブレンドの計算と、並べるための画面が要るので、
切り替えと連続再生が使われてから考えます。

## バージョン

この文書だけの変更では上げません。実装する PR は、互換を保った機能の追加なので、マイナーを上げます（段階 1 の PR で 1.40.1 → 1.41.0。
1 つの PR につき 1 回。CLAUDE.md の手順）。.msv の形式の `version` は 2 のままです。

実装のときに直すドキュメント: README（できること・使い方・操作・コマンドライン）、[data_format.md](data_format.md)（テイク・`.msva`・.msv の
中身・`restNodes`・`names`・`view.json`）、[support_and_limits.md](support_and_limits.md)（運ばないもの・.msv からの抽出の制限）、
ヘルプ（`ma_viewer/help_dialog.py`）。

## 付録: 試作のコード

共通 JSON の A からカーブと結び付けを取り出し、B に名前で当てて、評価結果を比べたものです（`web_src/bench/` に置いて
`node bench/probe.mjs A.json B.json`）。カーブの表を丸ごと入れ替えているので、ドリブンキーのあるリグ・Trax では合いません（上の形式では対応済み）。
番号の振り直しと、結び付けの作り方の参考にしてください。

```js
import { readFileSync } from 'node:fs';
import { Matrix4 } from 'three';
import { AnimationClip, decodeArray } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';
const [fa, fb] = process.argv.slice(2);
const A = JSON.parse(readFileSync(fa, 'utf8')), B = JSON.parse(readFileSync(fb, 'utf8'));
const leaf = (s) => s.split('|').pop().split(':').pop();          // 名前空間と親を外した名前
function extract(sc) {
  const a = sc.animation, bind = [], statics = [];
  for (const ch of a.channels) bind.push({ target: leaf(sc.nodes[ch.node].path), attr: ch.attr, curve: ch.curve });
  for (const g of a.graph) {
    for (const [k, v] of Object.entries(g.inputs || {})) {
      if ('curve' in v && !(g.curve >= 0)) bind.push({ target: leaf(g.name), attr: k, curve: v.curve, graph: true });
    }
    if (g.dag >= 0 && g.attrs && Object.keys(g.attrs).length) statics.push({ target: leaf(g.name), attrs: g.attrs });
  }
  const used = [...new Set(bind.map((b) => b.curve))].sort((x, y) => x - y);
  const T = decodeArray(a.times), V = decodeArray(a.values), K = decodeArray(a.tangentTypes, Uint8Array), F = decodeArray(a.fixedTangents);
  const fixedOf = (c) => {
    const o = [];
    for (let i = 0; i < F.length; i += 5) if (F[i] >= c.offset && F[i] < c.offset + c.count) o.push(F[i] - c.offset, F[i + 1], F[i + 2], F[i + 3], F[i + 4]);
    return o;
  };
  const keys = (c) => ({ ...c, offset: undefined, times: Array.from(T.subarray(c.offset, c.offset + c.count)),
    values: Array.from(V.subarray(c.offset, c.offset + c.count)), types: Array.from(K.subarray(c.offset * 2, (c.offset + c.count) * 2)), fixed: fixedOf(c) });
  return { fps: a.fps, start: a.start, end: a.end, curves: used.map((i) => keys(a.curves[i])),
    bindings: bind.map((b) => ({ ...b, curve: used.indexOf(b.curve) })), statics };
}
function apply(sc, tr) {
  const a = sc.animation, miss = [];
  const byNode = new Map(sc.nodes.map((n, i) => [leaf(n.path), i]));
  const byGraph = new Map(a.graph.map((g) => [leaf(g.name), g]));
  const times = [], values = [], curves = [], types = [], fixed = [];
  for (const c of tr.curves) {
    for (let i = 0; i < c.fixed.length; i += 5) fixed.push(c.fixed[i] + times.length, ...c.fixed.slice(i + 1, i + 5));
    curves.push({ ...c, times: undefined, values: undefined, offset: times.length, count: c.times.length });
    times.push(...c.times); values.push(...c.values); types.push(...c.types);
  }
  Object.assign(a, { curves, times, values, tangentTypes: types, fixedTangents: fixed, channels: [], start: tr.start, end: tr.end, fps: tr.fps });
  for (const b of tr.bindings) {
    if (b.graph) { const g = byGraph.get(b.target); if (g) (g.inputs || (g.inputs = {}))[b.attr] = { curve: b.curve }; else miss.push(b); }
    else {
      const ni = byNode.get(b.target);
      if (ni !== undefined && a.nodes.some((n) => n.node === ni)) a.channels.push({ node: ni, attr: b.attr, curve: b.curve }); else miss.push(b);
    }
  }
  for (const s of tr.statics) { const g = byGraph.get(s.target); if (g) g.attrs = { ...(g.attrs || {}), ...s.attrs }; else miss.push(s); }
  return miss;
}
function evalAll(sc) {
  const clip = new AnimationClip(sc.animation);
  const st = sc.nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(clip, sc.nodes, (ni) => st[ni]);
  rig.playbackLimit = 0;
  const res = new Map();
  for (let f = Math.ceil(clip.start); f <= clip.end; f++) for (const [ni, m] of rig.evaluate(f)) res.set(leaf(sc.nodes[ni].path) + '@' + f, [...m.elements]);
  return res;
}
const take = extract(A);
const ra = evalAll(A);
const miss = apply(B, take);
const rb = evalAll(B);
let worst = 0;
for (const [k, m] of ra) { const o = rb.get(k); if (o) for (let i = 0; i < 16; i++) worst = Math.max(worst, Math.abs(m[i] - o[i])); }
console.log('当てられなかった結び付け', miss.length, '最大の差', worst);
```

B を「A からカーブへの結び付けを外したもの」にして往復を確かめるには、`animation.channels` を空にし、graph の `inputs` から `{"curve"}` を
（ドリブンキーのノードを除いて）消します。
