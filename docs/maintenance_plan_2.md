# 整備計画 2（1.36.0 の確認結果と、次の作業）

[maintenance_plan.md](maintenance_plan.md) の作業（1.31.6 → 1.36.0）を確認した結果と、そこで見つかった問題、
Maya 内で読み込んだときに HumanIK が動かない不具合の調査と、次の作業の計画です。
確認した版は 1.36.0（コミット `39df038`）。この確認ではコードを変更していません。

前提は [maintenance_plan.md](maintenance_plan.md) の「0. 前提」と同じです（Viewer としてだけ使う・.mb は解析しない・
cm だけ・Maya の動作を推測で変えない）。Autodesk の資料（help.autodesk.com）は読める環境です。

## 1. 確認したこと

| 確認 | 結果 |
|---|---|
| Python のテスト（numpy あり・なし） | 400 件合格（10 件は条件つきのスキップ） |
| Node のテスト | 454 件合格 |
| bundle の一致（`node build.mjs` → 差分） | 一致 |
| CI（push・pull_request） | 緑。Python 3.10・3.12 と Node |
| Qt のテスト（`tests/qt_*.py` 24 本） | **手元ではすべて合格**。CI の qt のジョブは失敗（下の C1） |
| 修正前（`0e83d75`）と修正後で、samples/ の全 .ma とリファレンスのサンプル・大きな合成リグを Python で変換した結果 | fourbyfour_sample の属性名（`in31` → `i31`・`output` → `o`。意図した変更）のほかは、警告も含めてすべて同じ |
| 修正前の `npm run bench -- --save` と、修正後の `--check` | すべて一致 |
| 前回の再現シーン | B1（長い名前の編集）: 0・5・10 で正しい。B2: 3,000 段の階層が読める。B3: 2,000 個の直列が読める。P3: cluster 400 個のシーンが 5.3 → 4.6 秒 |
| 長い名前で書いた標準の属性の接続（`md.input1X`・`uc.input` など） | 修正前は 0、修正後は正しい値（D1 の効果） |
| samples/ の全 .ma を、Maya 内の収集と同じ並び（DAG を親から順 → DG、接続は接続先の順）に並べ替えた結果 | 評価結果はすべて同じ（並びには依存していない） |

資料の確認（Maya 2024 の技術資料。別のモデルが根拠にした記述を、実際のページで確かめた）:

| 項目 | 資料の記述 | 判定 |
|---|---|---|
| setRange | 式 `OutValue = Min + (((Value-OldMin)/(OldMax-OldMin)) * (Max-Min))` だけ。範囲外を止めるとは書かれていない | 変えない判断は妥当 |
| vectorProduct の normalizeOutput | 「内積では、オンにすると出力が -1〜1。実質的に入力の間の角度の cos」 | 修正は妥当 |
| orientConstraint の interpType | 既定 1 | 妥当 |
| pairBlend の rotateOrder | 既定 0。rx・ry・rz の順番 | 妥当 |
| mesh の vertexNormalMethod | 既定 3（角度と面積） | 妥当 |
| condition の operation | 既定 0 | 実装と同じ |
| multiplyDivide の割り算 | 「Input 1 ÷ Input 2」だけ。0 割りの記述なし | Maya で確かめる項目のまま |

前回の計画で私が書いた P2（再生キャッシュの実メモリが表示の 2.2〜3.4 倍）は、別のモデルの測り直し（1.04〜1.05 倍）が
正しく、私の測り方がキャッシュ以外の増加を含んでいました。P2 は対応不要です。

## 2. 新しく見つかった問題

| # | 内容 | 場所 | 根拠 |
|---|---|---|---|
| N1 | **接線の種類の番号が資料と違う**。資料（2023・2024・2026 の animCurve）は「18 = Auto、27 = AutoMix、28 = AutoEase、29 = AutoCustom。19〜26 はユーザーが使えるカスタムの種類」。ビューアは AutoMix = 19・AutoEase = 20・AutoCustom = 21 としている。27・28・29 で保存されたカーブは「不明」の扱い（スプラインの傾き）になる | `web_src/src/animation.js:16`〜`19`（`TANGENT`）、`curveEditor.js:22`、`docs/animation_curves.md:37`（「19〜21 と想定。Maya での確認が必要」）、`docs/data_format.md:222` | 資料 |
| N2 | **独自の属性の名前が全体の表（`ATTR_ALIASES`）の名前と同じとき、addAttr の既定値（`-dv`）が読まれない**。例: コントローラーの `roll`・`twist`・`ikBlend`・`radius`・`target`・`input` を `-dv 1` で作り、既定値のまま（setAttr なし・キーなし）だと、Maya は 1、ビューアは 0。キーや setAttr があれば正しい。1.31.6 でも同じ（退行ではない） | `ma_viewer/rig.py` の `parse_attrs`（`_addattr_default` の名前はそのまま `out[name]` に入れ、読む側は `attr_key` で `roll` → `rol` に読み替える） | 実測（付録 A） |
| C1 | CI の qt のジョブが失敗する（手動実行 1 回。約 15 秒で全テストが失敗）。手元では、ライブラリを入れただけでは「WebGL のコンテキストを作れない」で失敗し、`QTWEBENGINE_CHROMIUM_FLAGS` にソフトウェア描画の指定を足すと 24 本すべて合格した | `.github/workflows/test.yml` の qt のジョブ | 実測 |
| R1 | Maya 内の収集で、接続元のノードを `MObjectHandle.hashCode()` の値で引いている。資料上、この値は一意と保証されていない。衝突すると、接続が別のノードからのものとして書かれる（気づけない） | `ma_viewer/maya_scene.py` の `collect`（`ident`） | コード |
| R2 | `.tan` が書かれていないカーブをオート（18）として扱っているが、資料の `tangentType` の既定値は 4（有効な値の一覧にない値）。オートとする根拠は資料にない。Maya は既定と違う値を必ず書くので、実際に困る場面は少ない | `animation.js:34` | 資料 |

## 3. HumanIK が Maya 内の読み込みで動かない件

### 分かったこと

- 症状: Maya で開いているシーンを転送すると、HumanIK のキャラクター全体が動かない。同じシーンの .ma を開くと動く。
- **原因は特定できていません。** Maya のない環境では再現できませんでした。
- .ma と Maya 内の読み込みは、`SceneText`（集めた文）から先がまったく同じコードです。手元で次を確かめました。
  - `samples/hik_sample.ma` を Maya 内と同じ形（文とメッシュ・ウェイトの配列）に分けて読む: .ma と同じ結果（`tests/test_maya_scene.py`）。
  - ノードと接続を Maya 内の収集と同じ並びに並べ替える: 同じ結果。
  - 1.31.6 から 1.36.0 への変更で、`collect` の既定の経路の処理は変わっていない（計測が入っただけ）。
- したがって、違いは「本物の Maya の API が返すもの」が保存した .ma の文と違うところにあります。`hik.py` が使う情報は次の 5 つで、どれかが欠けると全体が動かなくなります。

| # | `hik.py` が使う情報 | 欠けたときの症状 |
|---|---|---|
| 1 | `HIKCharacterNode` のノード | キャラクターが見つからない |
| 2 | ジョイントの `.ch`（`Character`）→ キャラクターの部位の属性の接続 | 部位が 0 個になり、何も組み立てない（**全体が止まる**。Maya が評価した姿勢のまま） |
| 3 | `HIKState2SK` の `.InputCharacterDefinition`・`.InputCharacterState` の接続 | ソースを見分けられない（全体が止まる） |
| 4 | `HIKState2SK` → ジョイントの接続（元の属性名の末尾が `Tx`〜`Sz`） | ジョイントにつながらない（全体が止まる） |
| 5 | `HIKCharacterNode` のスタンスの値（`<部位>Tx`〜`Rz` の setAttr）と、`HIKFK2State` へのコントローラーの接続 | 形が崩れる・FK の部位がなくなる |

### 考えられる原因（確度の順。どれも未確認）

1. **選択範囲だけの転送**（`_selection_closure`）: `cmds.listHistory` は値に影響する接続だけをたどる。ジョイントの `.ch` → キャラクターの接続（メッセージ）や、プロパティのノードが範囲に入らず、上の 2 が欠ける可能性がある。シーン全体の転送でも起きるなら、これではない。
2. **1.32.0〜1.36.0 の退行**: 属性名の読み替え（型ごとの表・独自の属性の addAttr）が、Maya の API が返す文の形（`getAddAttrCmd`・`partialName`）と合わないところがある可能性。.ma の経路は全サンプルで同じ結果を確かめたが、本物の API の出力では確かめられない。1.31.6 に戻して動くなら、これ。
3. **HIK のノードで `getSetAttrCmds`・`getConnections` が .ma と違うものを返す**: mayaHIK はプラグインのノードで、資料がない（技術資料に `HIKCharacterNode` のページはない）。保存のときだけ書かれる値・独自のデータ型の属性の文などで、上の 3〜5 が欠ける可能性。
4. **R1（ハッシュの衝突）**: ノードの多いシーンで、接続元が別のノードになる。HumanIK に限らないが、症状は合う。

### 切り分けの手順（Maya で実行できる人にお願いするもの。いまの版のまま実行できる）

問題のシーンを **.ma で保存して開き、変更していない状態**で行います。

1. **リグの診断を 2 通りで開く**: (a) Maya から転送したあと、(b) 同じ .ma をスタンドアロンで開いたあと、
   ［リグの診断］の「■ HumanIK」の節を保存する。違う行（部位の数・「スケルトンを動かすもの」・「FK のコントローラーから求める部位」）で、上の表の 1〜5 のどれが欠けたかが分かる。
2. **文の違いの一覧**: Maya のスクリプトエディタで `tools/maya_compare.py` を実行する（使い方はファイルの先頭）。出力のファイルを保存する。
3. **集めた文をそのまま保存**（手元で再現するため。メッシュの形とウェイトは入らないので小さい）:

   ```python
   import sys
   sys.path.append(r"C:/tools/maya_ma_viewer")        # このフォルダの場所
   from ma_viewer import maya_scene
   st = maya_scene.collect()                          # 選択範囲で起きるなら collect(True)
   open(r"C:/temp/hik_live.ma", "w", encoding="utf-8").write("\n".join(st.lines) + "\n")
   ```

   `hik_live.ma` と、保存した .ma（HumanIK に関係するノードだけでもよい）があれば、Maya なしで再現・修正・テストができる。
4. **次の 3 点を教えてもらう**: シーン全体の転送か選択範囲か。1.31.6（`git checkout 0e83d75`）でも起きるか。ビューアのログ（Ctrl+L）の HumanIK の警告の文。

### 修正の作業（上の結果が出てから）

- H-1: 切り分けの道具を足す（Maya なしで作れる。版は上げない）。
  - `tools/maya_compare.py` に `dump(path)`（上の 3 を 1 行で）と、HumanIK の要約（`hik.analyze_hik` の結果を、集めた文と .ma の両方で出して並べる）を足す。
  - `collect` のログに、集めたノードの型ごとの数と接続の数を出す（HIK のノードが 0 個なら、そこで分かる）。
- H-2: 原因に合わせて直す（パッチ）。`hik_live.ma` から最小のシーンを作り、`tests/test_hik.py` に入れる。
  - 原因 1 なら: 選択範囲に、範囲の中のノードから出るメッセージの接続の先（`HIKCharacterNode` など HIK の型）と、その上流を足す。
  - 原因 2・3 なら: 違う文を、.ma と同じ形にそろえる（`maya_scene.py`）。
- H-3: R1 を直す（原因でなくても）。`ident` を、DAG ノードはフルパス（`MFnDagNode(src.node()).fullPathName()`。インスタンスは最初のパス）、DG ノードは名前（`MFnDependencyNode.name()`）で引く辞書にする。偽の Maya のテストで形を守る。

## 4. 次の作業

| 順 | 内容 | バージョン |
|---|---|---|
| 1 | N1・N2・C1（下） | パッチ（1.36.1） |
| 2 | H-1（道具）→ Maya での切り分け → H-2・H-3 | 道具は上げない。修正はパッチ |
| 3 | R2 は Maya で確かめる項目に足すだけ | 上げない |

### N1. 接線の種類の番号

- `animation.js` の `TANGENT` を `AUTO_MIX: 27, AUTO_EASE: 28, AUTO_CUSTOM: 29` にする。19〜26（カスタムの種類）は、いままでの「不明」と同じ扱い（スプラインの傾き）にし、読み込みの警告に「カスタムの接線の種類 N はスプラインとして評価します」を出す。
- 種類は `Uint8Array` で渡しているので 29 まで入る（64 以上の予約の値は 255 までしか入らない。256 以上は警告を出して不明の扱いにする。`animation.py` 側で確かめる）。
- 直す場所: `animation.js`・`curveEditor.js` の名前の表・`docs/animation_curves.md`（37 行目の「想定」を資料の値に）・`docs/data_format.md`・`docs/support_and_limits.md`・`tools/compare_anim_curves.py`・`tools/maya_anim_curve_check.py`・サンプルを作るツール（19・20 を使っているもの）・`web_src/tests/animx.test.mjs` などのテスト。
- 出典を PR に書く: `https://help.autodesk.com/cloudhelp/2024/ENU/Maya-Tech-Docs/Nodes/animCurve.html` の tangentType・keyTanInType。
- 受け入れ: 27・28 のキーが、いままでの 19・20 と同じ値になるテスト。19 が不明の扱いになるテスト。

### N2. 独自の属性の既定値

- `rig.parse_attrs` で、addAttr の既定値を入れるキーを、setAttr のキーと同じ読み替え（`MaScene.attr_key(node, name)`）にする。短い名前・長い名前の両方を読み替えて入れる。
- 角度の属性の名前（`angles`）も同じ読み替えにそろっているか確かめる。
- 受け入れ: 付録 A のシーンで 10・10・10。`roll`・`twist`・`ikBlend`・`radius` を `tests/test_rig.py` に足す。samples/ の結果が変わらないこと。

### C1. CI の Qt のジョブ

- `.github/workflows/test.yml` の qt のジョブの `env` に次を足す。

  ```
  QTWEBENGINE_CHROMIUM_FLAGS: "--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl"
  ```

- それでも失敗するなら、失敗したテストのログの末尾を出すステップを足して原因を見る（手元で足りなかったライブラリは `libegl1`）。
- 通るようになったら、push でも qt のジョブを回すか（24 本で約 4 分）を決める。`docs/development.md` に、画面のない環境で Qt のテストを動かす手順（上の環境変数）を書く。

## 5. Maya で確かめる項目に足すもの

[maintenance_plan.md](maintenance_plan.md) の「8」の表に足します。

| 項目 | いまの実装 | 確かめること |
|---|---|---|
| HumanIK の Maya 内の読み込み | 全体が動かない（3 章） | 3 章の切り分けの手順 |
| 接線の種類 27〜29 | N1 で資料に合わせる | AutoMix・AutoEase のキーを保存した .ma の `kit`・`kot` の値 |
| `.tan` のないカーブ | オート | Maya が `.tan` を書かないことがあるか。あれば、そのカーブの接線の種類 |
| Maya 内の収集の接続元 | ハッシュの値で引く（R1） | H-3 のあと、大きなシーンで `tools/maya_compare.py` の接続の違いが 0 になるか |

## 付録 A. N2 を再現するシーン

```
//Maya ASCII 2024 scene
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode transform -n "ctrl";
	addAttr -ci true -sn "roll" -ln "roll" -dv 1 -at "double";
	setAttr -k on ".roll";
createNode joint -n "jnt";
createNode multiplyDivide -n "md";
	setAttr ".i2" -type "float3" 10 10 10 ;
createNode script -n "sceneConfigurationScriptNode";
	setAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";
	setAttr ".st" 6;
connectAttr "ctrl.roll" "md.i1x";
connectAttr "md.ox" "jnt.tx";
```

結果（1.36.0・1.31.6 とも）: `jnt` の移動 X が 0（正しくは 10）。属性の名前を `foo` にすると 10 になる。

## 付録 B. 画面のない環境で Qt のテストを動かす

```
apt-get install -y xvfb libegl1 libgl1 libnss3 libxkbcommon-x11-0 libxcb-cursor0
pip install PySide6 numpy Pillow
export QTWEBENGINE_DISABLE_SANDBOX=1
export QTWEBENGINE_CHROMIUM_FLAGS="--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl"
for t in tests/qt_*.py; do xvfb-run -a python "$t" || echo "失敗: $t"; done
```
