# 整備計画（Maya との食い違い・不具合・重い部分・今後の整備）

ツール全体を調査した結果と、その修正の計画です。この文書だけで作業を始められるように書いています。
調査した版は 1.31.6（コミット `0e83d75`）。調査ではコードを変更していません。

## 0. 前提（決定済み）

作業する人（モデル）は、次の前提を変えないでください。

| 項目 | 決定 |
|---|---|
| 用途 | Viewer としてだけ使う。読み取りの再現性を重視する |
| .mb | 今後も解析しない（提案もしない） |
| Maya での確認 | **今は使えない前提で進める**。将来使えるようになる可能性はあるので、そのときにすぐ確かめられる道具と手順は用意しておく |
| 作業単位 | **cm だけを使う**。cm 以外の単位への対応（値の換算）は実装しない |
| バージョン | `CLAUDE.md` のルールに従う（1 つの PR につき 1 回。手順 1〜5 を守る） |
| ブランチ・PR | 作業の指示に従う。PR は頼まれたときだけ作る |

Maya で確かめられないことから、次のルールで進めます。

- **Maya の動作を推測で変えない**。計算を変えてよいのは、(a) このリポジトリの中で食い違いを実証できるもの、(b) Autodesk の公開資料（ノードの技術資料・ユーザーガイド）に書かれているもの、のどちらかだけ。資料は作業のときに開いて確かめ、PR の説明に出典を書く。
- 資料で確かめられないものは変えず、「8. Maya で確かめる項目」に残す。
- 変更の前後で既存の結果が変わらないことは、`cd web_src && npm run bench -- --save before.json` → 変更 → `npm run bench -- --check before.json` で確かめる（意図して変える計算は、その差だけが出ること）。

## 進み具合

| 段階 | 状態 |
|---|---|
| 0 | 済み: CI（`.github/workflows/test.yml`）・大きなリグのベンチ（`tools/make_big_rig_sample.py`・`--file`。[benchmark.md](benchmark.md)）・正解と比べる道具（`tools/maya_export_truth.py`・`python -m ma_viewer verify`・`tools/maya_node_check.py`。[maya_verification.md](maya_verification.md)） |
| 1 | 1.32.0 に含めた（当初の予定は 1.31.7）: B1・B2・B3・M1・M3 は済み。M2 は変えない（下の「M2・M3 の資料の確認」） |
| 2 | 1.32.0（段階 0〜1 と同じブランチ・同じ PR なので、1.31.7 を含めて 1 回だけ上げた）: M4・M5 は済み（下の「段階 2 の資料の確認」） |
| 3 | 1.32.0 に含めた: P3・P5 は済み（付録 D のシーンで `wire_shapes` 1.34 → 0.016 秒、読み込み 2.57 → 1.17 秒。結果は処理時間の値のほかは同じ）。P2 は済み（コードは変えない。下の「P2 について」）。**P4 は未着手**（Maya で確かめられないため、計画どおり Maya が使えるようになるまで待つ）。P1 は測った結果、変えない（下の「P1 の測定」） |
| IK | 1.33.0（計画の外。下の「IK（回転プレーン・シングルチェーン）の資料の確認」） |
| 4 | D6・D8 は済み（版は上げない: 動作の変わらない内部の整理とドキュメント）。D6: `rig.parse_attrs`・`component_tags`・`animation.parse_curve` の setAttr・addAttr の切り出しを、1 段階目と同じ `ma_reader.iter_commands`（`statement_end`）にした（samples/ の結果と読み込みの速さは同じ）。D8: README の「対応範囲と制限」「構成」「開発」「動作確認の状況」を `docs/support_and_limits.md`・`docs/development.md`・`docs/verification_status.md` に分け、テストの件数・Maya での確認の行・構成のフォルダ名を直した。D1 は 1.34.0 で済み（下の「D1 の作り」）。D5 は済み（下の「D5 の進み具合」） |
| 5 | 1.35.0: M6 は済み（下の「D5 の進み具合: (1) 計算ノードの型の一覧（Python の `rig.MATH_TYPES` と JS の `mathNodes.MATH_TYPES`）を `ma_viewer/node_types.json` の 1 か所にし、両方がそれを読む（`math.test.mjs` は、登録した型と JS の計算の実装が同じことを確かめる。型を足すときに Python を直さなくてよい）。(2) `rig.js` の計算ノード（unitConversion・multiplyDivide・pairBlend・行列ノード・カーブの情報・expression・アニメーションレイヤーなど。約 720 行）を `rigMath.js` に分けた。分けたファイルが `rig.js` の名前の import を忘れていないかは `web_src/tests/rigSplit.test.mjs` が確かめる（その経路を通るまで ReferenceError にならないため）。(2') `rig.js` の IK（回転プレーン・シングルチェーン・多関節・スプライン IK と再現チェック。約 800 行）を `rigIk.js` に分けた。(3) `rig.js` のコンストレイントの評価（`constraint`・`constraintRest`・`pivotWorld`・`targetMatrix`・`targetPosition`）を `rigConstraints.js` に分けた（メソッドのまま `installMethods` でプロトタイプに足す。ベンチの `--check` はビット単位で一致、bundle も Chromium で確かめた）。(4) 再生キャッシュと評価の入口（evaluate。約 560 行）を `rigPlayback.js` に分けた（分けるときの import・export は区切りの範囲が使う名前から作り、`rig.js` で使わなくなった import は取り除いた）。(5) DAG ノード（`rigDag.js`）・プラグ（`rigPlug.js`）・自作ノードの定義（`rigNodeDef.js`）・表示用（`rigDisplay.js`）も分けた。`rig.js`（4,114 行）は、作るとき（constructor）・共通の補助関数・IK を解く関数だけの約 1,200 行になった。(6) 型ごとの登録を `ma_viewer/node_types.json` の `types`（kind: Python がたどる種類・outputs: 出力の属性の名前・defaults: 既定値・angles: 度で書かれる角度の属性）と `skipAttrs`（1 段階目で setAttr を読み飛ばす型）にまとめ、Python の `CONSTRAINT_TYPES`・`UTILITY_TYPES`・`GEOMETRY_TYPES`・`_SKIP_ATTR_TYPES` と JS の `DEFAULTS`・`OUTPUTS`・`isAngleAttr` がそれを読む（置き換えの前後で中身が同じことを確かめた。`tests/test_node_types.py`）。ノードの型を 1 つ足すときは、JSON に足して、JS の計算（`rigMath.js` など）を書くと、型ごとの「1 段階目で読み飛ばすか」「入力をたどるか」「出力の名前」「既定値」「角度の属性」の登録。1 回に 1 種類ずつ PR を分ける。

P1 の測定: 手足 300 本・120 フレームの 1 周目（新しい評価器で全フレーム）を `node --cpu-prof` で測ると 17 ms／フレームで、プロファイルは平ら（GC 9%・`channelValues` 8%・`plug` 7%・`Matrix4.multiplyMatrices` 5%、ほかは 3% 以下）。計画の候補（入力ごとのクロージャ・2 回の Map 引き）は、すでに入力ごとの読む関数と属性のスロットで済んでいる。残りを詰めても数 % で、再生キャッシュとワーカーがあるので、計画の「効果が小さければやらない」により変えない。

M6 の資料の確認」） |

M2・M3 の資料の確認（Autodesk Maya 2024 のノードの技術資料。help.autodesk.com の Maya-Tech-Docs/Nodes の setRange.html・vectorProduct.html）:
- M3: vectorProduct の normalizeOutput の説明に「内積（ベクトルを出さない）では、オンにすると出力が -1〜1 に収まる。実質的に入力ベクトルの間の角度の cos」とある。これに合わせて、op 1 で `.no` がオンなら入力を正規化してから内積にした（長さ 0 のベクトルは 0）。テストは `tests/test_node_math.py`（汎用の経路と専用の評価の両方）。
- M2: setRange の資料にある式は `OutValue = Min + (((Value-OldMin)/(OldMax-OldMin)) * (Max-Min))` だけで、範囲外の値を止める（clamp）とは書かれていない。いまの実装（外へ延ばす）はこの式のとおりなので、変えない。Maya での実際の動作は「8」で確かめる。

段階 2 の資料の確認（同じ技術資料の orientConstraint.html・parentConstraint.html・pairBlend.html）:
- M4: interpType（.int。既定 1）は「0 No Flip（前のフレームに依存）・1 Average（四元数の平均）・2 Shortest（ターゲットの間の最短の経路）・3 Longest（最長の経路）・4 Cache（キャッシュした結果）。ターゲットが 1 つなら補間しない」。式どおりに評価できる 2 ターゲットの Shortest を最短の弧の slerp にした（汎用の経路の `constraintQuat` と専用の評価の `averageQuat`）。ほかは平均のまま、警告を出す（`animation._interp_warning`。リグの診断にも出る）。
- M5: pairBlend の rotateOrder（.ro）は「動かされるノードの回転順。それに合わせて回転の値を出す」。四元数補間（.ri 1）の入力と出力に使うようにした。既定 0 では計算の手順も結果も変わらない。
- テストは `tests/test_node_math.py`（汎用と専用の両方。期待値は Python で別に計算）。

IK（回転プレーン・シングルチェーン）の資料の確認（技術資料の ikRPsolver・ikSCsolver・ikHandle・joint と、ユーザーガイドの「Rotate Plane IK solver」「IK solvers」）:
- いまの実装と合っていること: 極ベクトルは ikHandle の親の空間で解釈する（再現チェックの候補の `pvSpace: handle` が既定）。開始ジョイントを回して、チェーンの面（すべてのジョイントを含む面）を「開始ジョイント → エフェクタの線と極ベクトルの面」に合わせ、twist をオフセットにする（`plane: points` が既定）。極ベクトルの既定値は (0, 0, 1)。ikBlend は 1 で IK・0 で FK・間は混ぜる。preferredAngle は解を求めるときの初めの形（まっすぐなチェーンで使う）。
- 資料にあるがビューアが使わないもの: ジョイントの jointType（.jt・.jtx/.jty/.jtz・.dm。ない回転の軸は IK で使わない）、stiffness（.st）、回転の制限の減衰（.ndr/.nst・.xdr/.xst）。式がないので計算は変えず、IK のチェーンで使われていれば警告とリグの診断に出すようにした（`rig.ik_joint_notes`）。シングルチェーンは「位置を合わせたあと、開始 → エフェクタの線のまわりに開始ジョイントを回して、エフェクタの向きをハンドルにできるだけ合わせる」とあるが、ビューアはハンドルの向きを使わない（FK の形の面を保つ）。基準の向き（作ったときのずれをどう扱うか）が書かれていないので、変えていない。
- 資料に式がないもの: twist の符号と 0 の基準の面（reference plane の決め方）、面が反転する境目。
- 式のないものは「8」に足し、`tools/maya_node_check.py` に確かめる項目（`rp_twist`・`sc_handle_rotation`・`ik_joint_type`）を足した。

M6 の資料の確認（技術資料「mesh」）: vertexNormalMethod（.vnm。既定 3）は「頂点法線は隣の面の法線を合わせて求める。Unweighted は単純な平均、Angle Weighted は面の辺がその頂点で作る角度の重み付き和、Area Weighted は面積の重み付き和、Angle And Area Weighted（既定）は角度と面積の両方を使った重み付き和」。両方を使う式は書かれていないので、角度 × 面積とした（`web_src/src/normals.js`。Maya で確かめる項目に足した）。.vnm を共通 JSON の meshes の `normalMethod` に出す（既定の 3 は省く）。ユーザーが指定した法線（.n。1e+20 は Maya が計算した法線の印）とスムーズメッシュプレビュー（.dsm）は使わず、警告を出す。頂点カラーは対応しない（計画どおり）。

D1 の作り: 型ごとの属性名の表 `ma_viewer/attr_names.json` を、Autodesk の技術資料（Maya 2024。2024 にない DL 版の計算ノードは 2026）の属性の表から `tools/make_attr_names.py` で作った（型 214・名前約 3,000。親の型の名前は親に入れ、`attr_names.names_for` が合わせる）。資料にない型（四元数ノード・inverseMatrix などのプラグインのノード）は全体の表のまま。`MaScene.attr_key` が、型の表 → 独自の属性 → 全体の表（`ATTR_ALIASES`）の順に読み替え、接続・プレースホルダー・リファレンスの編集・`parse_attrs` で使う（1 段階目の setAttr は Maya が短い名前で書くので変えていない）。`rig.js` の既定値の表の名前がすべて資料の名前にあることを確かめた。Maya が使えるなら `tools/maya_dump_attr_names.py`（未実行）で Maya から作り直せる。

P3・P5 の作り: `MaScene.outgoing()`（元のノードごとの出ていく接続の索引。接続のリストの作り直し・追加を見て作り直す）を `wire_shapes` が使う。`disconnectAttr` はリストを作り直さず、位置の索引で該当の接続を None にし、リファレンスの編集を当て終えたら詰める（`_compact_connections`）。テストは `tests/test_connections.py`（並びが前と同じこと・索引が変更に追いつくこと・全接続の走査が 1 回だけのこと）。

P2 について: 0-b のベンチで、再生キャッシュの実際のメモリ（キャッシュあり・なしの評価器の、GC 後の `heapUsed + external` の増加の差）を測り直すと、`playbackStats().bytes` の 1.04〜1.05 倍だった（[benchmark.md](benchmark.md)）。下の「2.2〜3.4 倍」は、キャッシュ以外の増加も含めて測っていたと考えられる。段階 3 の P2 の受け入れ（1.3 倍以内）は、いまの時点で満たしている。

## 1. 調査時点の状態

- テスト: `python -m unittest discover -s tests -p "test_*.py"` 361 件合格（2 件スキップ）。`cd web_src && npm ci && npm test` 447 件合格。
- `cd web_src && node build.mjs` の結果は、コミットされている `ma_viewer/web/viewer.bundle.js` と一致（差分なし）。
- CI（`.github/`）はない。

## 2. 見つかった問題の一覧

根拠の種類: **実測** = 小さな .ma を作って確かめた。**コード** = 読んで確認した。**要確認** = Maya の知識に基づく（Maya か公開資料での確認が要る）。

### 不具合

| # | 内容 | 場所 | 根拠 |
|---|---|---|---|
| B1 | リファレンスの編集が属性の長い名前（`ctrl.ikFkBlend`）で書かれ、リグの中の接続が短い名前（`ctrl.ikfk`）のとき、キーが「移動・回転・スケール以外の属性（ikFkBlend）のカーブは再生しません」の警告になり、その先のジョイントが動かない。長い名前と短い名前が同じ属性（`-ln` だけで作ったもの）は問題ない | `ma_viewer/ma_reader.py:39`（`ATTR_ALIASES`。ノードの型によらない 1 つの表）、`ma_scene.py:702`（`_connect`）・`:926`（`_apply_edit`） | 実測（付録 A） |
| B2 | 階層が約 1,000 段を超えると `RecursionError` で読み込めない（500 段は成功、1,200 段で失敗） | `extract_ma.py:72`（`world_matrix`）・`:1566`（`bind_visit`）・`:1616`（`visit`） | 実測（付録 B） |
| B3 | 計算ノードが約 500 個直列につながると `RecursionError`（200 個は成功、600 個で失敗）。JS 側は `deepEval.js` で対策済みだが、Python が先に落ちる | `rig.py:272`〜`361`（`add_edge` ↔ `need_plug`） | 実測（付録 B） |

### Maya との食い違い

| # | 内容 | 場所 | 根拠 |
|---|---|---|---|
| M1 | cm 以外の作業単位では形が崩れる（移動は作業単位、行列と頂点は cm で書かれるため）。**対応しない（前提）**。警告だけを分かりやすくする | `extract_ma.py:1311`、`ma_scene.py:549`・`:892` | コード |
| M2 | setRange が、範囲外の入力を止めずに外へ延ばす。Maya は oldMin・oldMax で止めるはず | `web_src/src/rig.js:2119` | 要確認 |
| M3 | vectorProduct の内積（op 1）で normalizeOutput（`.no`）が効かない。Maya は入力を正規化した内積（cos）を返すはず | `rig.js:2142`（`op !== 1` で除いている） | 要確認 |
| M4 | orientConstraint・parentConstraint の補間の種類（interpType）を読まず、常に平均（符号をそろえた四元数の和の正規化）。Shortest・Longest・No Flip・Cache で差が出る | `rig.js:2689`〜`2712`、`averageQuat`（`rig.js:430`） | コード |
| M5 | pairBlend の四元数補間（`.ri` = 1）が、回転順 xyz 固定（`.ro` を見ない） | `rig.js:2619`、`radQuat`（`rig.js:425`） | コード |
| M6 | メッシュの見た目: ロックした法線（ユーザー法線）を読まない。頂点法線の重みは面積だけ（Maya の既定は角度と面積）。スムーズメッシュプレビュー・頂点カラーは未対応 | `web_src/src/normals.js`、`ma_scene.py:157`（`_MESH_NAMES` に法線がない） | コード |
| M7 | 細部（Maya での確認が要る）: 表示（bool）を 0.5 で切る判定、enum を `Math.round` で丸める扱い、multiplyDivide の 0 割りで入力 1 を返す扱い、`.tan` が書かれていないカーブをオートにする扱い | `rig.js:471`・`:2545`、`animation.js:34` | 要確認 |

### 重い部分

| # | 内容 | 実測 |
|---|---|---|
| P1 | リグの評価の 1 周目（キャッシュのないフレーム）。プロファイルの上位は `rigCompiled.js:830` `channelValues` 16%、`:621` `plug` 13%、GC 6.5%、`Matrix4.multiplyMatrices` 5% | グラフ 6,001 ノード（動くノード 2,101）で 21 ms／フレーム、30,001 ノードで 110 ms。汎用の経路だけなら 49・297 ms。2 周目以降は 0.3・1.3 ms。最初の 1 フレームは 276・1,242 ms |
| P2 | 再生キャッシュの実際のメモリが、`playbackStats().bytes`（上限 512 MB の計算に使う値）より大きい | GC 後の増加は、表示 24 MB に対し 52 MB、121 MB に対し 406 MB（2.2〜3.4 倍）。120 フレーム |
| P3 | `rig.py:242` `wire_shapes` が、wire・cluster ごとに全接続を走査する（中のループも全接続）。`discover` は最大 4 回呼ばれる | cluster 400 個・接続 5 万で 1.3 秒（読み込み 5.3 秒の 24%）。接続の数に比例 |
| P4 | Maya 内の収集が、画面のスレッドで要素ごとに API を呼ぶ: 辺ごと（`maya_scene.py:224`）、ウェイトの要素ごと（`:254`）、全ノードの全属性ごとの `getSetAttrCmds`（`:194`） | 未計測（Maya がない） |
| P5 | `disconnectAttr` のたびに接続のリスト全体を作り直す（`ma_scene.py:726`）。リファレンスの編集に disconnect が多いと効く | コード |

参考: Python の読み込みはノードの数にほぼ比例（7,204 ノード 0.76 秒、36,004 ノード 4.26 秒。JSON は 3.5・17.9 MB）。

### 整備・拡張の懸念

| # | 内容 |
|---|---|
| D1 | 属性名の読み替えが、ノードの型によらない 1 つの表（`ATTR_ALIASES`）。`input`→`ip`、`twist`→`twi`、`weights`→`w`、`target`→`tg` のように、型で意味の違う名前を同じに読み替える。B1 の根本で、型を増やすたびに衝突の危険が増える |
| D2 | Maya の正解の値と比べる仕組みがない（保存時のフレームの値との比較だけ）。サンプルを自作している限り、M2・M3 のような誤りは見つからない |
| D3 | Maya 内の経路（`maya_scene.py`）が「Maya の .ma の書き出しの再実装」。1.31.1〜1.31.6 の修正はすべてここ。テストは偽の Maya |
| D4 | CI がない。テストも bundle の一致も手作業 |
| D5 | 大きなファイルと重複: `rig.js` 4,091 行（`RigEvaluator` 1 クラス）、`main.js` 3,563 行、`plugin_convert.py` 2,661 行、`exprespy.py` 2,565 行。評価は汎用（`rig.js`）と専用（`rigCompiled.js`）の 2 経路。ノードの型を 1 つ増やすのに、`ma_scene.py` の `_SKIP_ATTR_TYPES`、`rig.py` の `UTILITY_TYPES`・`MATH_TYPES`、`rig.js` の出力・既定値・角度の属性、`mathNodes.js` を直す |
| D6 | setAttr の読み取りが 2 系統: 1 段階目の `ma_reader.parse_setattr` と、あとから範囲（span）を正規表現で読み直す `rig.parse_attrs`（`rig.py:597`）・`animation.py` の `_SETATTR_RE` |
| D7 | ベンチ（`web_src/bench/rig.bench.mjs`）は samples/ だけで、最大 155 ノード。実物の規模での劣化に気づけない |
| D8 | README が 173 KB・604 行で 1 行が非常に長い。古い記述がある（「自動テストの全体」の件数 144・138・16、「実際の Maya での動作: 未確認」と、ほかの行の「Maya が保存した実物で確かめた」の食い違い、「構成」の先頭の `maya_ma_viewer/`） |

## 3. 作業の順番

| 段階 | 内容 | バージョン |
|---|---|---|
| 0 | 土台: CI・大きなリグのベンチ・Maya の正解と比べる道具（Maya なしで作れる部分） | 上げない |
| 1 | 不具合: B1・B2・B3、M1 の警告、資料で確かめられた M2・M3 | パッチ（1.31.7） |
| 2 | 読む属性を増やす: M4・M5（資料で確かめられた範囲） | マイナー（1.32.0） |
| 3 | 速さ: P3・P5・P2・P4・P1 | マイナー（「評価を速くする」は CLAUDE.md でマイナー。段階 2 と同じ PR なら二重に上げない） |
| 4 | 構造: D1・D5・D6・D8 | 動作が変わらなければ上げない |
| 5 | 見た目: M6 | マイナー |

段階 0 と 1 は 1 つの PR にまとめてよい。段階ごとに、Python と Node のテストが全部通ること・`node build.mjs` をやり直したこと・ベンチの `--check` を確かめる。

## 4. 段階 0: 土台

### 0-a. CI

- `.github/workflows/test.yml` を作る。push と pull_request で次を実行する。
  1. Python（3.10 以上）: `pip install numpy Pillow` → `python -m unittest discover -s tests -p "test_*.py"`。`MA_VIEWER_NO_NUMPY=1` でもう 1 回（numpy のない経路）。
  2. Node: `cd web_src && npm ci && npm test`。
  3. bundle の一致: `cd web_src && node build.mjs && git diff --exit-code -- ../ma_viewer/web/viewer.bundle.js`。
- Qt のテスト（`tests/qt_*.py`）は `xvfb-run -a` と PySide6 が要る。最初は入れず、別のジョブ（手動実行 `workflow_dispatch`）にする。
- 受け入れ: ワークフローが緑になる。bundle を古いままにすると 3 が落ちる。

### 0-b. 大きなリグのベンチ

- `tools/make_big_rig_sample.py` を作る（付録 C のスクリプトを元にする）。引数は手足の数・フレーム数・出力先。samples/ には入れない（大きいので、ベンチのときに一時フォルダへ作る）。
- `web_src/bench/rig.bench.mjs` に `--file <json>` を足し、指定した共通 JSON だけを測れるようにする。README の「開発」に手順を 1 行足す。
- 測る値: 1 周目・2 周目以降・キャッシュなし・汎用の経路だけ（今の列と同じ）に、最初の 1 フレームの時間と、GC 後のメモリの増加（`node --expose-gc`）と `playbackStats().bytes` を足す。
- 基準の値（この文書の 2 の P1・P2）を README か docs に書いておく。
- 受け入れ: 手足 300 本・120 フレームで、今回の値（キャッシュなし約 21 ms）に近い値が出る。

### 0-c. Maya の正解と比べる道具（Maya なしで作れる部分）

目的: Maya が使えるようになったとき、スクリプトを 1 回実行するだけで食い違いを数値で出せるようにする。

- **Maya 側**（`tools/maya_export_truth.py`。Maya のスクリプトエディタか mayapy で実行する）: 開いているシーンの再生範囲の各フレームで、すべての DAG ノードの `xform -q -ws -m` に当たるワールド行列（`MFnDagNode` の `worldMatrix`）と、表示（`.v`）を JSON に書く。形式は `{"fps", "start", "end", "nodes": {フルパス: {"frames": [...], "world": [[16 個]...], "visible": [...]}}}`。`maya.cmds`・`maya.api.OpenMaya` だけを使い、ビューアのコードに依存しない（`tools/maya_anim_curve_check.py` と同じ作り）。
- **ビューア側**（`python -m ma_viewer verify scene.ma truth.json` か `tools/compare_truth.py`）: .ma を読み、各フレームを評価して、ノードごとのワールド行列の差（位置の距離・回転の角度）の最大を出す。差の大きい順に 20 個と、差がしきい値（位置 0.001・回転 0.01 度）を超えたノードの数を出す。
  - 評価は JS（`RigEvaluator`）なので、Node のスクリプト（`web_src/tools/verify.mjs`）で JSON を読んで比べ、Python の CLI からはそれを呼ぶか、手順だけ書く。どちらにするかは実装のしやすさで決めてよい。
- **Maya なしのテスト**: 正解の JSON を、ビューアの評価結果から作ったもの（差 0 になる）と、わざと 1 ノードをずらしたもの（検出される）で確かめる。Maya 側のスクリプトは、`tests/qt_maya_fake_test.py` と同じ考え方で、API を呼ぶ部分を差し替えて形式だけ確かめる。
- **計算ノードごとの確認シーン**（`tools/maya_node_check.py`）: 「8. Maya で確かめる項目」の各項目について、Maya でノードを作り、入力を入れ、出力を読んで表にするスクリプト。Maya がなくても書いておく（実行はできないので、ヘッダーに「未実行」と書く）。
- docs に `docs/maya_verification.md` を作り、Maya が使えるようになったときの手順（どのスクリプトをどの順に実行し、結果をどこに貼るか）を書く。
- 受け入れ: Maya なしのテストが通る。手順書だけを読んで Maya 側の作業ができる。

## 5. 段階 1: 不具合（パッチ）

### B1. 独自の属性の長い名前・短い名前

- 原因: 接続の先の属性のキーは `R.normalize_attr`（全体の表）で決まる。独自の属性は表にないので、長い名前で書かれた接続は長い名前のキー、短い名前で書かれた接続は短い名前のキーになり、同じ属性が別物になる。
- 方針: ノードごとに、addAttr の `-ln`（長い名前）→ `-sn`（短い名前）の表を持ち、接続と setAttr のキーを**短い名前**にそろえる。
  - addAttr の文は、いまは 1 段階目で読み飛ばしている（`ma_scene.py:596`）。`handle` に `addAttr` を足し、`-ln`・`-sn` だけを読んで `MaNode` に入れる（スロットを 1 つ足す。値や型は今までどおり 2 段階目の `rig.parse_attrs` が読む）。`addAttr` はノードのブロックの中（`self.current`）と、ノード名つき（`addAttr … "node"`）の両方がある。複合の属性の子（`-p 親`）も同じに読む。
  - リファレンスの編集の addAttr（`_apply_edit` の code 1。`args[1]` が長い名前、`args[2]` が短い名前）も同じ表に入れる。
  - 読み替える場所: `_connect`（元・先の両方の属性の、**先頭の要素の名前**）、`_route_placeholders`（`real` を作るところ）、`_apply_edit` の setAttr（overlay に入れる文の属性名）、`rig.parse_attrs`（`_addattr_default` が長い名前・短い名前の両方に既定値を入れている所と、setAttr のキー）。
  - 接続は addAttr より後に書かれるので、接続のときに表を引けば足りる。リファレンスの編集は読み終えたあとに当てるので同じ。
  - 短い名前で書かれた既存の動作を変えないこと（samples/ の結果が変わらないこと）。
- テスト: 付録 A のシーンを `tests/test_references.py`（なければ近いテスト）に足す。長い名前の編集で、カーブが `animation.curves` に入り、警告が出ないこと。編集の setAttr（`2 "|rig:ctrl" "ikFkBlend" " 1"`）でも値が読まれること。Node 側で `jnt.tx` がフレーム 1・12.5・24 で 0・5・10 になること。
- 注意: 標準の属性の長い名前（`multiplyDivide1.input1X` など）は、この修正では直らない。段階 4 の D1 で扱う。

### B2・B3. 再帰をループにする

- `extract_ma.py`: `_Ctx.world_matrix` は、祖先をたどって根から順に計算する形にする。`bind_visit`・`visit` は、スタック（リスト）を使う形にする。**出力の順番（`out_nodes` の番号 = 深さ優先・子は書かれた順）を変えないこと**。
- `rig.py` の `discover`: `add_edge` → `need_plug` → `add_edge` の再帰を、作業のリスト（待ち行列）にする。たどる順番で結果（`info.edges`・`info.dag`・`info.dg` の辞書の順、`info.unsupported` の順）が変わると、graph の番号や警告の順が変わる。**samples/ の JSON が変わらないこと**を確かめる（`tools/make_*_sample.py` で作り直して差分がないこと、または `tests/` の期待値）。順番を保てないなら、`sys.setrecursionlimit` を一時的に上げる方法（`exprespy.py:2391` と同じ）でもよい。その場合はスレッドのスタックの大きさ（読み込みは `QThread` で行う）にも注意する。
- ほかにも再帰がないか探す（`rig.py` の `_upstream_of`・`analyze_fallback`、`hik.py`、`curve_history.py`、`rig_report.py`、`scene_cache.py`）。
- テスト: 付録 B の 3,000 段の階層と、2,000 個の直列の計算ノードが読めること。Node 側の `web_src/tests/deepChain.test.mjs` と同じ規模で、Python から JS まで通ること。

### M1. cm 以外の警告

- 値の換算はしない。警告の文を「cm 以外の作業単位には対応していません。移動の値と、行列・頂点の値の単位が合わないため、形が崩れます。Maya で作業単位を cm にして保存し直してください」の趣旨にする（`extract_ma.py:1311`）。リファレンスの単位が違うときの警告（`ma_scene.py:892`）も同じ趣旨にし、角度・時間の単位が違う場合も警告に出す（いまは長さだけ）。
- README の「対応範囲と制限」の該当の行を直す。

### M2・M3. 資料で確かめられたら直す

- 作業のときに Autodesk の資料（ノードの技術資料の setRange・vectorProduct、ユーザーガイドの「Set Range」「Vector Product」）を開く。
  - M3: 資料に「Normalize Output をオンにした内積は、ベクトルの間の角度の cos」とあれば、`rig.js:2134`〜`2143` を「op が 1 で `.no` がオンなら、a・b を正規化してから内積」にする（長さ 0 のベクトルは 0）。
  - M2: 資料に範囲外を止める（clamp）とあれば、`rig.js:2119` で入力を `[on, om]`（oldMin・oldMax）に収めてから写す。oldMin > oldMax のときの扱いは資料になければ変えない。
- 資料で確かめられなければ変えず、「8」に残す。
- 専用の評価（`rigCompiled.js`）は汎用の計算を共有しているが、`web_src/tests/compiled.test.mjs` が通ること（ビット単位で同じ）を確かめる。`web_src/tests/rig6.test.mjs` の該当のテストに、範囲外の入力・`.no` オンの内積を足す。

## 6. 段階 2〜3

### M4. コンストレイントの補間の種類（マイナー）

- orientConstraint・parentConstraint の `interpType`（短い名前 `int`。0 No Flip・1 Average・2 Shortest・3 Longest・4 Cache）を読む。既定は 1（Average）で、いまの計算のまま。
- 資料で式が分かるのは Shortest（最短の弧で補間）まで。2 ターゲットの Shortest は slerp にする。3 ターゲット以上・No Flip・Longest・Cache は式が公開されていないので、いまの平均のままにして、**警告とリグの診断に「補間の種類 ○○ は平均として評価します」と出す**。
- `rig.py` の `_SOFT_INPUTS` やコンストレイントの属性の読み取りに `int` が通ることを確かめる。

### M5. pairBlend の回転順（マイナー）

- `.ro`（rotateOrder）を読み、四元数補間（`.ri` = 1）の入力と出力の回転順に使う（`eulerQuat`・`mayaEuler` に渡す）。既定 0 では結果が変わらないこと。

### P3・P5. 接続の索引（Python）

- `MaScene` に、元のノードごとの出ていく接続の索引（`id(src)` → `[(sattr, dst, dattr)]`）を、必要になったときに 1 回作って持つ。`wire_shapes` はこれを使う（全接続の走査をやめる）。`extract_ma.py` の `_MaterialBuilder.__init__`・dagPose の索引など、接続を全走査している所も、効果があれば同じ索引にする。
- `_connect` の disconnect は、リストを作り直さず、該当の 1 件を消す（先の `inputs` から元を引けば、探す範囲は小さい）。索引を持つなら、接続が変わったら無効にする。
- 受け入れ: 付録 D のシーン（cluster 400 個・接続 5 万）で、`wire_shapes` の時間が 0.1 秒未満になる。結果は変わらない。

### P2. 再生キャッシュのメモリの数え方

- `rig.js` の `addSnapshotBytes`・`storeSnapshot`・`playbackStats`（`rig.js:905`〜`930`・`:1072`）が数えていないものを調べる（スナップショットごとの `Map`・配列のオブジェクトの分、`props` やカーブの形、ノードごとの `Matrix4` など）。
- 方針は 2 つのどちらか（測って決める）: (a) 数え方を実際に合わせる。(b) スナップショットを、フレームごとに 1 本の型付き配列だけにして、オブジェクトを減らす（`packSnapshotMats` が既にあるので、残りを寄せる）。
- 受け入れ: 0-b のベンチで、GC 後の増加が `bytes` の 1.3 倍以内。

### P4. Maya 内の収集（Maya がないので、偽の Maya のテストで形を守る）

- `_skin_weights`: `maya.api.OpenMayaAnim.MFnSkinCluster.getWeights(path, component)` でまとめて取り、インフルエンスの並び（`influenceObjects` と `indexForInfluenceObject`）から論理番号に直す。結果の形（頂点・論理番号・値の 3 本の配列）は変えない。0 の値を落とすかは、いまの結果（保存されている要素だけ）と同じになるようにする。
- `_mesh_arrays`: 頂点は `MPointArray` を 1 点ずつタプルにせずにまとめて配列にする。辺は、面の頂点の並び（`getVertices`）から作れる（`mesh_data` が既に辺を探している）。スムーズかどうかは `MItMeshEdge` を 1 回回すか、`getEdgeVertices`・`isEdgeSmooth` をやめられる API を使う。
- `_setattr_cmds`: 全属性を回す代わりに、型ごとに「読む必要のある属性」だけにできないか検討する（ただし 1.31.2〜1.31.4 で直した「値を書く」の動作を変えないこと）。
- **Maya で実行できないので、この項目は変更を小さくし、偽の Maya のテスト（`tests/qt_maya_fake_test.py`・`tests/test_maya_scene.py`）が通ることを確かめ、PR の説明に「Maya で未確認」と書く**。不安があれば、Maya が使えるようになるまで手を付けない。

### P1. リグの評価の 1 周目

- 先に 0-b のベンチとプロファイル（`node --cpu-prof`）で、どこが効くかを測る。
- 候補: (1) `channelValues`（`rigCompiled.js:830`）で、入力ごとのクロージャと `plan.ad.deep` の呼び出しを減らす。(2) `plug`（`:621`）の、ノードの `Map` → 属性の `Map` の 2 回引きを、計画を作るときに決めた番号（スロットの配列）の 1 回引きにする。(3) フレームごとに作る配列・`Matrix4`・`Vector3` を使い回す。
- 条件: 汎用の経路と**ビット単位で同じ結果**（`web_src/tests/compiled.test.mjs`、ベンチの `--check`）。効果が小さければやらない。再生キャッシュとワーカー（`bakeWorkers.js`）があるので、優先度は低い。

## 7. 段階 4〜5

### D1. 型ごとの属性名の表

- 目的: 標準のノードの属性の長い名前 → 短い名前を、ノードの型ごとに持つ（`ATTR_ALIASES` の置き換え）。
- 表の元は Maya（`attributeQuery`・`listAttr`）で作るのが正しい。Maya がないので、**作るスクリプト（`tools/maya_dump_attr_names.py`）だけを書いておき**、いまは、コードが使っている名前（`rig.js`・`rig.py`・`mathNodes.js`・`ATTR_ALIASES`）から、対応している型の分だけを手で表にする（`ma_viewer/attr_names.json` など）。
- 読み替えは `R.normalize_attr(path)` を `normalize_attr(path, node_type)` にして、型の表 → 独自の属性（B1 の表）→ 全体の表（いまの `ATTR_ALIASES`。残す）の順に引く。
- `rig.js` の `attrName(g, ['tws', 'twist'])` のような「両方の名前を試す」書き方は、読み替えが効けば要らなくなるが、消すのは急がない。
- 受け入れ: samples/ の結果が変わらない。`web_src/tests/mayaAttrNames.test.mjs` が通る。長い名前で書いた接続（`multiplyDivide1.input1X`・`outputX`）のテストを足す。

### D5. ノードの型の登録を 1 か所に

- ノードの型ごとに「1 段階目で setAttr を読み飛ばすか」「入力をたどるか」「出力の名前」「既定値」「角度の属性」を 1 つの定義（JSON）にまとめ、Python と JS の両方がそれを読む形にする。`web_src/tests/math.test.mjs:42` がしている「Python と JS の一覧が同じか」の検査が要らなくなる。
- `rig.js` は、種類ごと（コンストレイント・IK・スプライン IK・カーブの変形・計算ノード・再現チェック）にファイルを分ける。`RigEvaluator` のメソッドのままでよい（プロトタイプに足す形）。動作を変えない。分ける前後でベンチの `--check` と全テスト。
- 大きな変更なので、1 回に 1 種類ずつ、PR を分ける。

### D6. setAttr の読み取りを 1 系統に

- `rig.parse_attrs` の `_SETATTR_RE`（`;` までを 1 文とみなす。文字列の中の `;` で切れる）を、`ma_reader.statement_end` を使った文の切り出しにする。結果が変わらないこと。

### D8. README

- 「対応範囲と制限」「開発」「動作確認の状況」を `docs/` に分け、README は概要・使い方・リンクにする。1 つの段落・表のセルを短くする。
- 古い記述を直す: テストの件数（数を書かず、コマンドだけにする）、「実際の Maya での動作: 未確認」の行（いまの状況に合わせる）、「構成」の先頭のフォルダ名。
- `tests/test_version.py` が README の「いまのバージョンは x.y.z です。」を見ているので、その行は README に残す。

### M6. メッシュの見た目（マイナー）

- 頂点法線の重み: `normals.js` の面の法線の足し方を、面積 × その頂点での角度にする（Maya の既定の「角度と面積」。`.vnm` を読めるなら読む）。資料で式を確かめる。
- ロックした法線: .ma の `.n`（法線の一覧）と面の頂点ごとの法線の番号を読む。書式は Maya の実物のファイルで確かめたいので、Maya が使えるようになってからでよい。それまでは、ロックした法線のあるメッシュ（`.n` の setAttr がある）に警告を出すだけにする。
- スムーズメッシュプレビュー（`.dsm`）は、警告を出すだけにする（細分割は実装しない）。

## 8. Maya で確かめる項目（いまは変えない）

Maya が使えるようになったら、0-c の `tools/maya_node_check.py` で確かめ、結果に合わせて直す。

| 項目 | いまの実装 | 確かめること |
|---|---|---|
| setRange の範囲外（M2） | 外へ延ばす（資料の式のとおり。資料に clamp の記述はない） | oldMin・oldMax の外の入力の出力。oldMin > oldMax のとき |
| vectorProduct の内積と `.no`（M3） | 1.32.0 で資料に合わせて直した（正規化した内積） | `.no` オン・op 1 の出力（資料どおりか）・長さ 0 のとき |
| 表示（bool）に入る小数 | 0.5 以上で表示（`rig.js:471`） | animCurveTU の値 0.3・0.5・0.7 が `.v` につながるときの表示 |
| enum・整数の属性に入る小数 | `Math.round`（condition の `.op`、choice の `.s` など） | 1.4・1.5・1.6 を入れたときの扱い（丸め・切り捨て） |
| multiplyDivide の 0 割り | 入力 1 をそのまま返す（`rig.js:2545`） | 割る数 0 のときの出力 |
| `.tan` が書かれていないカーブ | オート（`animation.js:34`） | Maya が `.tan` を書かないのはどの種類のときか |
| コンストレイントの補間の種類（M4） | Average と 2 ターゲットの Shortest（slerp）。ほかは平均（警告） | No Flip・Longest・Cache の結果。3 ターゲット以上の Shortest。2 ターゲットの Shortest が slerp と一致するか |
| cm 以外の単位の .ma の書式 | 対応しない | （参考）移動は作業単位、行列・頂点は cm で書かれるか |
| リファレンスの編集の属性名 | B1 で両方に対応 | 編集の connectAttr・setAttr・プレースホルダーが長い名前で書かれるか |
| 回転プレーン IK の twist の向き・0 の基準・反転の境目 | 開始 → ハンドルの軸のまわりに正の向き | `rp_twist` の結果と、ビューアの評価の比較 |
| シングルチェーン IK のハンドルの回転 | 使わない（FK の形の面を保つ） | `sc_handle_rotation`: ハンドルを回したとき、チェーンが開始 → エフェクタの線のまわりに回るか・作ったときのずれの扱い |
| IK と jointType・stiffness・damping | 使わない（警告） | `ik_joint_type`: 肘を z だけにしたとき・stiffness を付けたときの解 |
| Maya 内の収集の時間（P4） | 未計測 | 大きなシーンで、収集（画面が止まる時間）の内訳 |
| 頂点法線の重み（角度と面積） | 角度 × 面積 | Maya の頂点法線（`polyNormalPerVertex -q -xyz`）と、ビューアの法線の比較 |
| 全体の再現性 | 保存時のフレームだけ | 0-c の正解の JSON との差（実物のリグで） |

## 付録 A. B1 を再現するシーン

`rig.ma`:

```
//Maya ASCII 2024 scene
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode transform -n "ctrl";
	addAttr -ci true -sn "ikfk" -ln "ikFkBlend" -min 0 -max 1 -at "double";
	setAttr -k on ".ikfk";
createNode joint -n "jnt";
createNode multiplyDivide -n "md";
	setAttr ".i2" -type "float3" 10 10 10 ;
connectAttr "ctrl.ikfk" "md.i1x";
connectAttr "md.ox" "jnt.tx";
```

`shot.ma`（同じフォルダ）:

```
//Maya ASCII 2024 scene
file -rdi 1 -ns "rig" -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "rig.ma";
file -r -ns "rig" -dr 1 -rfn "rigRN" -op "v=0;" -typ "mayaAscii" "rig.ma";
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode reference -n "rigRN";
	setAttr -s 2 ".phl";
	setAttr ".phl[1]" 0;
	setAttr ".ed" -type "dataReferenceEdits" 
		"rigRN"
		"rigRN" 0
		"rigRN" 1
		5 4 "rigRN" "|rig:ctrl.ikFkBlend" "rigRN.placeHolderList[1]" "";
createNode animCurveTU -n "ctrl_ikFkBlend";
	setAttr ".tan" 2;
	setAttr -s 2 ".ktv[0:1]"  1 0 24 1;
createNode script -n "sceneConfigurationScriptNode";
	setAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";
	setAttr ".st" 6;
connectAttr "ctrl_ikFkBlend.o" "rigRN.phl[1]";
```

結果（1.31.6）: `extract_ma.load_ma("shot.ma", animation=True)` の `animation.curves` が空で、警告「アニメーション: 移動・回転・スケール以外の属性（ikFkBlend）のカーブは再生しません。」が出る。`RigEvaluator` で評価した `jnt` の移動 X は、フレーム 1・12.5・24 で 0・0・0（正しくは 0・5・10）。編集の `ctrl.ikFkBlend` を `ctrl.ikfk` に書き換えると 0・5・10 になる。

## 付録 B. B2・B3 を再現するシーン

```python
HEAD = '//Maya ASCII 2024 scene\nrequires maya "2024";\ncurrentUnit -l centimeter -a degree -t film;\n'

def deep_hierarchy(depth):          # 1,200 で RecursionError
    s = HEAD
    for i in range(depth):
        s += 'createNode joint -n "j%d"%s;\n\tsetAttr ".t" -type "double3" 1 0 0;\n' % (
            i, ' -p "j%d"' % (i - 1) if i else "")
    return s

def deep_graph(depth):              # 600 で RecursionError
    s = HEAD + 'createNode joint -n "j";\ncreateNode transform -n "ctrl";\n'
    for i in range(depth):
        s += 'createNode addDoubleLinear -n "a%d";\n\tsetAttr ".i2" 1;\n' % i
    s += 'connectAttr "ctrl.tx" "a0.i1";\n'
    for i in range(1, depth):
        s += 'connectAttr "a%d.o" "a%d.i1";\n' % (i - 1, i)
    return s + 'connectAttr "a%d.o" "j.tx";\n' % (depth - 1)
```

どちらも、ファイルに書いて `extract_ma.load_ma(path, animation=True)` で読む。

## 付録 C. 大きな合成リグを作るスクリプト（0-b の元）

`python gen_big.py 300 120 big300.ma` で、手足 300 本（7,204 ノード・接続 16,501）・120 フレーム。
`extract_ma.load_ma(path, animation=True)` の結果を JSON に保存し、`RigEvaluator` で全フレームを評価する。

```python
"""大きな合成リグ: 手足 N 本（コントローラー + 3 関節の RP IK + 極ベクトル + parentConstraint + 計算ノード）"""
import sys
N = int(sys.argv[1]); FR = int(sys.argv[2]); out = sys.argv[3]
L = ['//Maya ASCII 2024 scene', 'requires maya "2024";', 'currentUnit -l centimeter -a degree -t film;']
C = []
def node(t, n, p=None, attrs=()):
    L.append('createNode %s -n "%s"%s;' % (t, n, ' -p "%s"' % p if p else ""))
    for a in attrs: L.append("\t" + a + ";")
def con(a, b): C.append('connectAttr "%s" "%s";' % (a, b))
def curve(kind, n, vals):
    node(kind, n, attrs=['setAttr ".tan" 18', 'setAttr -s %d ".ktv[0:%d]" %s' % (len(vals), len(vals) - 1, " ".join("%d %g" % (1 + i * (FR // (len(vals) - 1)), v) for i, v in enumerate(vals)))])
node("ikRPsolver", "ikRPsolver")
node("transform", "root")
curve("animCurveTL", "root_tx", [0, 5, 0]); con("root_tx.o", "root.tx")
for i in range(N):
    p = "L%d_" % i
    node("transform", p + "grp", "root", ['setAttr ".t" -type "double3" %d 0 0' % (i * 3)])
    node("joint", p + "a", p + "grp", ['setAttr ".jo" -type "double3" 0 0 -60'])
    node("joint", p + "b", p + "a", ['setAttr ".t" -type "double3" 4 0 0', 'setAttr ".jo" -type "double3" 0 0 120', 'setAttr ".pa" -type "double3" 0 0 10'])
    node("joint", p + "c", p + "b", ['setAttr ".t" -type "double3" 4 0 0'])
    node("ikEffector", p + "eff", p + "b")
    node("transform", p + "ctrl", p + "grp", ['setAttr ".t" -type "double3" 4 0 0', 'addAttr -ci true -sn "st" -ln "stretch" -dv 1 -at "double"', 'setAttr -k on ".st" 1'])
    node("ikHandle", p + "ik", p + "ctrl")
    node("poleVectorConstraint", p + "pvc", p + "ik")
    node("transform", p + "pv", p + "grp", ['setAttr ".t" -type "double3" 2 5 0'])
    con(p + "a.msg", p + "ik.hsj"); con(p + "eff.hp", p + "ik.hee"); con("ikRPsolver.msg", p + "ik.hsv")
    for ax in "xyz": con(p + "c.t" + ax, p + "eff.t" + ax)
    con(p + "pv.t", p + "pvc.tg[0].tt"); con(p + "pv.rp", p + "pvc.tg[0].trp"); con(p + "pv.rpt", p + "pvc.tg[0].trt"); con(p + "pv.pm", p + "pvc.tg[0].tpm")
    con(p + "pvc.w0", p + "pvc.tg[0].tw"); con(p + "ik.pim", p + "pvc.cpim"); con(p + "a.pm", p + "pvc.ps"); con(p + "a.t", p + "pvc.crp")
    for ax in "xyz": con(p + "pvc.ct" + ax, p + "ik.pv" + ax)
    for k, ax in enumerate("xy"):
        curve("animCurveTL", p + "ctrl_t" + ax, [4 if ax == "x" else 0, 2 + k, 6, 4 if ax == "x" else 0, 3]); con(p + "ctrl_t" + ax + ".o", p + "ctrl.t" + ax)
    curve("animCurveTA", p + "ctrl_rz", [0, 30, -30, 0]); con(p + "ctrl_rz.o", p + "ctrl.rz")
    # 手首の先のジョイント 4 つ: parentConstraint・計算ノード・行列ノード
    node("joint", p + "hand", p + "grp")
    node("parentConstraint", p + "pc", p + "hand")
    for a, b in (("t", "tt"), ("rp", "trp"), ("rpt", "trt"), ("r", "tr"), ("ro", "tro"), ("s", "ts"), ("pm", "tpm"), ("jo", "tjo")):
        con(p + "c." + a, p + "pc.tg[0]." + b)
    con(p + "pc.w0", p + "pc.tg[0].tw"); con(p + "hand.pim", p + "pc.cpim"); con(p + "hand.ro", p + "pc.cro"); con(p + "hand.rp", p + "pc.crp"); con(p + "hand.rpt", p + "pc.crt"); con(p + "hand.jo", p + "pc.cjo")
    for ax in "xyz": con(p + "pc.ct" + ax, p + "hand.t" + ax); con(p + "pc.cr" + ax, p + "hand.r" + ax)
    node("multiplyDivide", p + "md", attrs=['setAttr ".i2" -type "float3" 2 2 2'])
    node("plusMinusAverage", p + "pma"); node("condition", p + "cond", attrs=['setAttr ".op" 2']); node("clamp", p + "cl", attrs=['setAttr ".mx" -type "float3" 9 9 9'])
    con(p + "ctrl.t", p + "md.i1"); con(p + "md.o", p + "pma.i3[0]"); con(p + "ctrl.s", p + "pma.i3[1]"); con(p + "pma.o3x", p + "cond.ft"); con(p + "pma.o3", p + "cond.ct"); con(p + "cond.oc", p + "cl.ip")
    node("joint", p + "tw1", p + "grp"); con(p + "cl.op", p + "tw1.t")
    node("multMatrix", p + "mm"); node("decomposeMatrix", p + "dm")
    con(p + "c.wm[0]", p + "mm.i[0]"); con(p + "grp.wim[0]", p + "mm.i[1]"); con(p + "mm.o", p + "dm.imat")
    node("joint", p + "tw2", p + "grp"); con(p + "dm.ot", p + "tw2.t"); con(p + "dm.or", p + "tw2.r"); con(p + "dm.os", p + "tw2.s")
    node("unitConversion", p + "uc", attrs=['setAttr ".cf" 0.5']); node("joint", p + "tw3", p + "tw2"); con(p + "ctrl.rz", p + "uc.i"); con(p + "uc.o", p + "tw3.rx")
node("script", "sceneConfigurationScriptNode", attrs=['setAttr ".b" -type "string" "playbackOptions -min 1 -max %d -ast 1 -aet %d "' % (FR, FR), 'setAttr ".st" 6'])
open(out, "w").write("\n".join(L + C) + "\n")
print(out, "nodes", sum(1 for x in L if x.startswith("createNode")), "connections", len(C))
```

## 付録 D. cluster の多いシーン（P3 の元）

cluster 1 個につき、ジョイント 3 つのスプライン IK・カーブ（変形後と Orig）・cluster とハンドルを作り、次の接続をする。
これを 400 組と、無関係な transform 5 万個（`x{i-1}.v` → `x{i}.v` の接続）を 1 つのシーンに入れる。

```
createNode joint -n "k0_j0";
createNode joint -n "k0_j1" -p "k0_j0";
	setAttr ".t" -type "double3" 1 0 0;
createNode joint -n "k0_j2" -p "k0_j1";
	setAttr ".t" -type "double3" 1 0 0;
createNode ikEffector -n "k0_eff" -p "k0_j1";
createNode ikHandle -n "k0_ik";
createNode transform -n "k0_crv";
createNode nurbsCurve -n "k0_crvShape" -p "k0_crv";
createNode nurbsCurve -n "k0_crvShapeOrig" -p "k0_crv";
	setAttr ".io" yes;
	setAttr ".cc" -type "nurbsCurve" 1 3 0 no 3 4 0 1 2 3 4 0 0 0 1 0 0 2 0 0 3 0 0;
createNode transform -n "k0_h";
createNode clusterHandle -n "k0_hShape" -p "k0_h";
createNode cluster -n "k0_cl";
createNode ikSplineSolver -n "ikSplineSolver";
connectAttr "k0_j0.msg" "k0_ik.hsj";
connectAttr "k0_eff.hp" "k0_ik.hee";
connectAttr "ikSplineSolver.msg" "k0_ik.hsv";
connectAttr "k0_j2.tx" "k0_eff.tx";
connectAttr "k0_crvShape.ws" "k0_ik.ic";
connectAttr "k0_crvShapeOrig.ws" "k0_cl.ip[0].ig";
connectAttr "k0_cl.og[0]" "k0_crvShape.cr";
connectAttr "k0_h.wm" "k0_cl.ma";
```

結果（1.31.6）: cluster 400 個・接続 5 万で読み込み 5.3 秒、そのうち `wire_shapes` が 1.29 秒（800 回の呼び出し）。
