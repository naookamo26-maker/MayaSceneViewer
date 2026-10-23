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
  "materials": [ ... ],
  "textures": [ ... ],
  "warnings": [ "..." ],
  "stats": { "nodes": 10, "joints": 5, "meshes": 3, "vertices": 316, "polygons": 302, "skinnedMeshes": 1 }
}
```

`source.kind` は `"ma"`（.ma から）か `"maya"`（Maya 内から）です。

## nodes

transform・joint などの変換ノードです。**親は必ず子より前に並びます。** 出力するのは、メッシュ・ジョイント・インフルエンスと、それらの祖先だけです。

| キー | 内容 |
|---|---|
| `name` / `path` | 名前と DAG フルパス（例: `\|rig_grp\|shoulder`） |
| `type` | `"joint"`、`"transform"` など Maya のノード型 |
| `parent` | 親の番号（ルートは -1） |
| `matrix` | ローカル行列（16 要素） |
| `worldMatrix` | ワールド行列（参照用。ビューアは階層から計算し直す） |
| `inheritsTransform` | false の場合、ビューアはルート直下に置く |
| `segmentScaleCompensate` | joint のみ（省略時は true）。ポーズ確認で親ジョイントをスケールしたときの補正に使う |
| `bindMatrix` | バインドポーズのローカル行列（情報があるノードのみ）。情報のないノードは matrix のまま親についていく |
| `bindSource` | bindMatrix の情報源: `pm`（skinCluster の .pm）・`dagPose`・`bps`（ジョイントの .bps） |
| `drivenBy` | 移動・回転などが接続で決まっている場合の接続元（例: `r ← uc1（unitConversion）`）。この場合 .ma に値がないため、matrix はバインドポーズの姿勢（bindMatrix があれば）か既定値になる |
| `visible` | 自身の表示状態 |
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

### スキン変形

Maya（行ベクトル規約）:

```
p' = Σ wᵢ · p · gm · pmᵢ · Wᵢ · gm⁻¹        Wᵢ はインフルエンスの現在のワールド行列
```

three.js では `SkinnedMesh` を detached モードにし、`bind(skeleton, gm)` と `boneInverses = pm` を指定すると同じ結果になります。
