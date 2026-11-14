# 開発

このページは [README](../README.md) から分けたものです。 作業のルール（バージョンの上げ方）は [CLAUDE.md](../CLAUDE.md) です。

## 構成

```
MayaSceneViewer/
├─ run_viewer.py          スタンドアロン起動
├─ install_maya.py        Maya へのドラッグ＆ドロップでシェルフに登録
├─ packaging/             配る物を作る（exe: PyInstaller の spec・build_exe.py、1 ファイルの HTML: build_html.py、アイコンを作る make_icon.py）
├─ requirements.txt
├─ CLAUDE.md              作業のルール（バージョンを上げる条件と手順）
├─ ma_viewer/
│  ├─ ma_reader.py        .ma の字句解析（文の分割・setAttr の解析）
│  ├─ ma_scene.py         ノード・属性・接続の保持（リファレンスの読み込み・編集の適用も）
│  ├─ references.py       リファレンスのパスの探索・リファレンスの編集（dataReferenceEdits）の解析
│  ├─ materials.py        テクスチャパスの検索・シェーダーごとの属性名
│  ├─ extract_ma.py       .ma → 共通 JSON（行列計算・面の変換・デフォーマ経路の追跡・ウェイト）
│  ├─ animation.py        アニメーションカーブ → 共通 JSON の animation（2 段階読み込みの 2 段階目）
│  ├─ rig.py              リグ（コンストレイント・IK・計算ノード・行列ノード）の探索と animation.graph の作成
│  ├─ trax.py             キャラクターセットと Trax のクリップ（clipLibrary・clipScheduler・animClip）
│  ├─ hik.py              HumanIK の構成の読み取り（キャラクタライズ・スケルトンを動かすソース）と、コントロールリグの FK・リターゲット・スタンスの行列ノードへの組み立て
│  ├─ expression.py       expression の式が解釈できるかの判定
│  ├─ exprespy.py         exprespy（Python で式を書くノード）のコード → ノードごとの自作ノードの定義
│  ├─ place2d.py          place2dTexture（テクスチャの UV の繰り返し・オフセット）
│  ├─ custom_nodes.py     自作ノードの割り当て（設定ファイル）
│  ├─ curve_history.py    カーブのヒストリ（circle などの形を作るノード）から形を求める
│  ├─ node_defs.py        自作ノードの定義の読み込み・計算の検証と IR への変換（node_defs/ に同梱した定義）
│  ├─ plugin_convert.py   Python のノードプラグイン → 自作ノードの定義（convert-plugin）
│  ├─ rig_report.py       リグの診断
│  ├─ maya_scene.py       Maya で開いているシーン → .ma を解析したものと同じ形（OpenMaya 2.0。そのあとは extract_ma と共通）
│  ├─ mathutil.py         Maya の変換行列（transform / joint）
│  ├─ schema.py           共通 JSON の定義と検証
│  ├─ package.py          パッケージ（.msv）の書き出しと読み込み（テクスチャの WebP への変換）
│  ├─ viewer.py           Qt のウィンドウ・WebEngine 表示・読み込みスレッド・Maya 連携
│  ├─ help_dialog.py      操作方法のウィンドウ（ヘルプ → 操作方法）
│  ├─ app.py / cli.py     起動・コマンドライン（--selftest）
│  ├─ resources.py        画面ファイル・アイコンの場所を探す（exe の一時展開フォルダにも対応）
│  ├─ icon/               アイコン（SVG と、packaging/make_icon.py で作る MayaSceneViewer.ico）
│  ├─ maya_launcher.py    Maya からの起動
│  ├─ qt_compat.py        PySide6 の import
│  └─ web/                ビューア（index.html・style.css・viewer.bundle.js）
├─ web_src/               ビューアの JS ソース（three.js r187）とビルド・テスト
│                          （main.js 本体・ui.js 画面・rig.js リグの評価・nodeDef.js 自作ノードの定義の評価・trax.js クリップ・sequencer.js カメラシーケンサ・cameraView.js カメラ など）
├─ samples/               検証用の .ma と期待値（textured_project/ はテクスチャ確認用、reference_project/ はリファレンス確認用の Maya プロジェクト）
├─ tools/                 検証用データの生成（make_*_sample.py。アニメーション・リグ・テクスチャ・表示とカメラ・Trax・カメラシーケンサ・選択の可否・リファレンスなど）
├─ tests/                 テスト
└─ docs/data_format.md    共通 JSON の仕様
```

Python と three.js の間は、共通 JSON（`maya-scene-lite` 形式）だけでやり取りします。Maya 内の読み込み（`maya_scene.py`）は .ma の解析と同じ形にしてから同じ変換を通すので、出力の形式も同じで、ビューアは読み込み元を区別しません。仕様は [docs/data_format.md](data_format.md) を参照してください。


## テスト

```
python -m unittest discover -s tests -p "test_*.py"     # Python（パーサ・行列・抽出器）
cd web_src && npm install && npm test                   # three.js 側（スキン変形が Maya の式と一致するか、アニメーションの補間・行列、リグの評価等）
python tests/qt_smoke_test.py                           # Qt ウィンドウの自動操作（画面が必要）
python tests/qt_gizmo_test.py                           # ハンドル（移動・回転・スケール）をマウス操作で動かす
python tests/qt_skin8_test.py                           # GPU のスキン変形（8 インフルエンス）を描画結果で CPU の計算と比較
python tests/qt_texture_test.py                         # テクスチャの読み込み・向き・透過・ウェイト表示との切り替え
python tests/qt_maps_test.py                            # フラットライト・マップの単独表示・ノーマルマップ・UDIM（画面の画素で確認）
python tests/qt_toolbar_test.py                         # ツールバー（アイコンの切り替え・メニューの開閉と状態表示）
python tests/qt_overlay_test.py                         # ビューポートの中央の表示（起動直後の案内・読み込み中・エラー）が重ならない
python tests/qt_menu_test.py                            # メニューの構成・書き出しのオプションボックス（❒）・区切り線の色（暗い・明るい配色）・［ウインドウ］→［評価のプロファイラ］
python tests/qt_warnings_test.py                        # 警告のパネル（ログとタブ切り替え、メニュー・アイコンから開く、読み込み直しで更新、コピー）
python tests/qt_review_test.py                          # ログの読み込みの経過・ステータスバー 1 列・キャッシュの使用量と上限・警告の分類・リグの診断のウィンドウ
python tests/qt_tree_panel_test.py                      # 階層の開閉（Shift+クリック・すべて開閉）と左パネルの幅
python tests/qt_reference_tree_test.py                  # 階層のリファレンスの印・名前空間、メッシュの行の選択と選択情報のメッシュの欄
python tests/qt_tree_virtual_test.py                    # ノードの多いシーンの階層（見えている行だけを描く: スクロール・F・キー操作・クリック・目のアイコン・絞り込み）
python tests/qt_properties_test.py                      # 右パネル: カメラの欄（焦点距離・画角・このカメラから見る）、頂点の欄の出し分け
python tests/qt_camera_menu_test.py                     # カメラの多いシーンのメニュー（一覧のスクロール）と、解像度ゲートがタイムラインに重ならないこと
python tests/qt_undo_test.py                            # 元に戻す・やり直し（キー・メニュー・操作の単位）
python tests/qt_visibility_test.py                      # ノードの表示・非表示（目のアイコン・Ctrl+H / Shift+H）
python tests/qt_viscam_test.py                          # リグで切り替える表示・シーンのカメラ（開いたときのカメラ・メニューの 2 クリック）・バインドポーズのボタン・効果のないボタンの表示・グリッドの軸の色
python tests/qt_select_test.py                          # クリックでの選択（オブジェクト・頂点・F8）、Maya で選択できないもの、フレームレートの表示の位置、右パネルのボタン
python tests/qt_sequencer_test.py                       # カメラシーケンサ（ビューポートの上のパネル・クリックでの移動・再生）、再生のフレームレートの表示、キャラクターセットの Trax のクリップ
python tests/qt_maya_fake_test.py                       # Maya 用ウィンドウの連携（Maya で集める部分を .ma から作ったものに差し替える）
python tests/qt_animation_test.py                       # アニメーション（2 段階読み込み・タイムライン・読み込み中の中止・JSON の往復）
python tests/qt_rig_test.py                             # リグ（IK・コンストレイントの再生、コントローラーを動かしたときの追従と元に戻す、キーのないリグ、行列ノード・SC IK、多関節 IK・スプライン IK、カーブの表示と expression、cluster・ドリブンキー・リグの診断）
python tests/qt_playback_cache_test.py                  # リグの再生キャッシュ（空き時間に作る・ポーズ確認で作り直す・元に戻すと残したものを使う・キーのある値は作り直さない・タイムラインの帯と表示・上限の設定と保存）
python tests/qt_load_test.py                            # 読み込み中の動き（前のシーンの再生・再生キャッシュの作成を止める・同じファイルは読み直さない・別のファイルを開くと中止して最後のものだけ読む・失敗しても前のシーンが残る）
```

画面のない環境（Linux のサーバー・CI）では、仮の画面（Xvfb）と、WebGL のソフトウェア描画（SwiftShader）で Qt のテストを動かします。
GPU がないと、指定なしでは「WebGL のコンテキストを作れない」で失敗します。Qt の xcb プラグインが読めない
（「Could not load the Qt platform plugin "xcb"」）ときは、足りないライブラリを `ldd` で調べます（`libxcb-icccm4`・`libxcb-keysyms1` など）。
CI の qt のジョブ（手動実行。`.github/workflows/test.yml`）も同じ指定です。

```
apt-get install -y xvfb libegl1 libgl1 libnss3 libxkbcommon-x11-0 libxcb-cursor0 libxcb-icccm4 libxcb-keysyms1
pip install PySide6 numpy Pillow
export QTWEBENGINE_DISABLE_SANDBOX=1
export QTWEBENGINE_CHROMIUM_FLAGS="--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl"
for t in tests/qt_*.py; do xvfb-run -a python "$t" || echo "失敗: $t"; done
```

アニメーションカーブの評価は、Autodesk の animX（Maya と同じ評価をする公開ライブラリ）を書き写した参照実装と `web_src/tests/animx.test.mjs` で比べています。Maya との違いの調査結果と、Maya で評価した値と比べる手順（`tools/maya_anim_curve_check.py`・`tools/compare_anim_curves.py`）は [docs/animation_curves.md](animation_curves.md) にあります。

リグの評価には、どんなグラフでも評価できる汎用の経路（`web_src/src/rig.js` の RigEvaluator）と、扱える種類のノードだけでできたリグを計画どおりに速く計算する専用の評価（`web_src/src/rigCompiled.js`。最初の評価のあとで計画を作り、ポーズ確認の追加分がないあいだ使う）があります。専用の評価は汎用の経路と同じ数式を同じ順番で計算し、結果はビット単位で同じです（`web_src/tests/compiled.test.mjs`。サンプルは `python tools/make_compiled_sample.py`）。キーで動くノードと、parent・point・orient・scale・aim コンストレイント、lookAt（world up がシーンの上・ベクトル・なし）で動くノードと、IK（回転プレーン・シングルチェーン。poleVectorConstraint の極ベクトルを含む。解き方の関数は汎用の経路と共有）で動くジョイントと、計算ノード（multiplyDivide・plusMinusAverage・decomposeMatrix・アニメーションレイヤー（animBlendNode・animLayer）・expression（入力とフレームだけで出力が決まる式）・Maya 2024 以降の計算ノード・自作ノードの定義など。入力だけで出力が決まるもの。計算は汎用の経路のものを、値の読み方だけ差し替えて使う）・DAG ノードの直接の接続で動くノードを専用に計算し、それ以外のノード（スプライン IK・カーブの形を読むノード・形の変わるカーブなど）は汎用の経路に任せて、同じフレームの中で混ぜて計算します（任せた理由と件数は `rig.compiledPlan.delegated`）。専用に計算できるノードがない・評価が循環するリグは汎用の経路だけで評価します（`rig.compiledReason` に理由。原因のノードの名前と、同じ条件のノードの数も入れます。評価のプロファイラの「専用の評価」にも出ます）。動かないノード（HumanIK の部位に割り当てていない途中のジョイントなど）が、親のスケールの打ち消しの元を持っていても、その元を先に計算して専用の評価で扱います（`web_src/tests/compiled.test.mjs`。サンプルは `python tools/make_static_is_sample.py`）。リグの評価の速さは `cd web_src && npm run bench` で測れます（samples/ のアニメーションを全フレーム評価し、1 フレームあたりの時間を 1 周目・2 周目以降・再生キャッシュなし・汎用の経路だけ・時間で変わらない値の使い回しなしに分けて出し、専用の評価を使ったかも出します）。評価の高速化の前後で結果が変わらないことは、`npm run bench -- --save before.json` で変更前の結果を保存し、変更後に `npm run bench -- --check before.json` で確かめます。描画の準備も、大きなシーン向けに次のようにしています。(1) 同じジョイントを同じバインド行列で使うスキン付きメッシュは、1 つの Skeleton（骨の和集合）を共有し、骨の行列の計算と GPU への転送を、メッシュの数からまとまりの数に減らします（`sceneBuilder.js` の `shareSkeletons`。各メッシュの骨の番号を和集合の番号に振り直す。変形の結果は同じ。`web_src/tests/scene.test.mjs`、サンプルは `python tools/make_shared_skin_sample.py`）。(2) フレームを変えただけのとき（再生・スクラブ）は、動くノード（と子）の下だけ行列を計算し直し、描画のときにシーン全体を計算し直しません（ポーズ確認・設定の変更などのあとは、これまでどおり全体を計算します）。(3) メッシュ・カーブの線（子を持たない表示用のオブジェクト）は、非表示のあいだワールド行列を計算せず（表示に切り替えると、次の描画の前に計算し直す）、表示中は親のワールド行列をコピーします（`installLeafUpdate`）。(4) 画面の外のメッシュは描きません（視錐台カリング）。動かないメッシュは形の範囲で、スキン付きメッシュは、同じジョイントを使うメッシュのまとまり（ほぼキャラクター単位）ごとに、骨ごとにその骨が影響する頂点を包む球を読み込み時に求めておき、描画のたびにいまのジョイントの行列で移した球を包む球で判定します（計算は骨の数だけで、メッシュの数に比例しない。まとまりごと画面の外のときに描かない。ウェイトの合計が 1 の混ぜ合わせなので、変形した頂点は必ずこの中に入る。`web_src/tests/scene.test.mjs` で、せん断を含むジョイントの動きでも全頂点が入ることを確かめる）。ウェイトの合計が 1 でない頂点のあるメッシュは、範囲を保証できないので判定しません。リグの評価のキャッシュのテストは `web_src/tests/cache.test.mjs` です（キャッシュを使わずに毎回評価した結果と比べる）。評価のプロファイラのテストは `web_src/tests/profiler.test.mjs` です（記録しても評価の結果が変わらないこと・種類ごと・経路ごと・ノードごとの集計・文字の結果）。

自作ノードの定義（exprespy を変換したものも）の計算は、ビューアで読み込むときに JavaScript の関数にして実行します（`web_src/src/nodeDef.js` の `generateRunner`。毎フレーム IR をたどるより速い）。IR をたどる計算（`interpret`）と同じ補助関数を同じ順番で使い、同じ結果・同じ誤りになることを `web_src/tests/nodeDefCompile.test.mjs` で確かめます（サンプルの定義と、exprespy の書き方の一覧を変換した定義 `samples/nodedef_compile_defs.json`（`python tools/make_nodedef_compile_fixture.py`）に、いろいろな入力を与えて比べる）。関数にできない形（for の外の break など）や、関数を作れない環境では IR をたどって計算します。評価のプロファイラの「自作ノードの定義」に、関数にした数が出ます。自作ノードの定義のテストは `tests/test_node_defs.py`（読み込み・検証・シーンへの適用）と `web_src/tests/nodeDef.test.mjs`（評価）です。サンプルとテスト用の定義は `python tools/make_nodedef_sample.py` で作ります（`samples/nodedef_sample_defs.json`。ビューアには同梱しません）。
ヒストリのあるカーブのテストは `tests/test_curve_history.py`（形の計算・警告・リグの診断）と `web_src/tests/curveHistory.test.mjs`（表示とスプライン IK）です（サンプルは `python tools/make_curve_history_sample.py`）。骨ごとに伸び縮みするスプライン IK（カーブ上の点どうしの距離 → blendColors → multiplyDivide → ジョイントのスケール）と、その下の親のスケールを打ち消す自作ノード（割り当ての segmentScaleCompensate）のテストは `web_src/tests/stretchSpline.test.mjs` と `tests/test_scale_compensation.py` です（サンプルは `python tools/make_stretch_spline_sample.py`）。コンポーネントタグのテストは `tests/test_component_tags.py`（タグと式の読み取り・groupParts による指定・リグの診断）と `web_src/tests/componentTags.test.mjs`（cluster → wire → スプライン IK）です（サンプルは `python tools/make_component_tag_sample.py`）。
HumanIK のテストは `tests/test_hik.py`（構成の読み取り・ソースの見分け・FK の行列ノードの組み立て・警告・リグの診断。シーンはテストの中で書く）と `web_src/tests/hik.test.mjs`（HumanIK で動くスケルトンの評価: コントロールリグの FK（スタンスでバインドポーズと一致・キーとポーズ確認でコントローラーに追従・キャラクタライズしていないジョイント）、リターゲット（ソースのスタンスでバインドポーズと一致・ソースの部位と同じだけワールドで回る・腰の高さの比・骨の長さ・ソースにない部位）、スタンス（基準を動かしたキャラクター））です（サンプルは `python tools/make_hik_sample.py`）。
fourByFourMatrix のテストは `web_src/tests/fourByFour.test.mjs` です（サンプルは `python tools/make_fourbyfour_sample.py`）。
スプライン IK の ikBlend（開始ジョイントの移動）・up ベクトルの成分・カーブより長いチェーン・キーで決まる rootOnCurve のテストは `web_src/tests/splineIk.test.mjs` です（シーンはテストの中で作る）。
視点の操作（Maya と同じ Alt + マウス。`web_src/src/mayaControls.js`）・矩形選択と修飾キーによる選択の組み合わせ（`web_src/src/marquee.js`）・複数選択をハンドルで一緒に動かす計算（`propagatePoseDelta`）のテストは `web_src/tests/selection.test.mjs` です。スキン付きメッシュのクリックの選択と矩形選択は、骨ごとの行列を 1 回だけ作って表示用頂点をまとめて変形し（姿勢が変わるまで覚えて使い回す）、three.js の標準のレイキャストと同じ式で三角形を調べます（`web_src/src/skinPick.js`）。当たり（メッシュ・三角形・距離・点）が標準と同じこと（姿勢を変えたあと・表・裏・両面・材質の配列・near / far・拡大縮小）は `web_src/tests/skinPick.test.mjs` で確かめます。
Maya 2024 以降の計算ノード・行列ノード・DL 版・addDL・multDL のテストは `web_src/tests/math.test.mjs` です（サンプルは `python tools/make_math_sample.py`）。カーブのヒストリ（rebuildCurve・reverseCurve・detachCurve・subCurve）と nearestPointOnCurve のテストは `tests/test_curve_ops.py`（形の計算・焼き付け）と `web_src/tests/curveOps.test.mjs`（読み込みとビューアの計算の一致・動くヒストリ・スプライン IK）です（サンプルは `python tools/make_curve_ops_sample.py`）。
テクスチャの UV の繰り返し・オフセット（place2dTexture）のテストは `tests/test_place2d.py`（読み取り・警告・props）と `web_src/tests/place2d.test.mjs`（ジョイント・キー・exprespy で動かした値をテクスチャに入れる）です（サンプルは `python tools/make_place2d_sample.py`）。
exprespy のテストは `tests/test_exprespy.py`（変換の結果・解析できない書き方・シーンへの適用・リグの診断）と `web_src/tests/exprespy.test.mjs`（評価をコンストレイントの性質・回転の曲げとひねりへの分解と組み立て直しと比べる）です（サンプルは `python tools/make_exprespy_sample.py`。exprespy の同梱サンプルの constraints.ma・bend_roll.ma のコードを使う）。
プラグインからの変換のテストは `tests/test_plugin_convert.py`（変換の結果・変換できない書き方・CLI）と `web_src/tests/pluginConvert.test.mjs`（変換した定義の評価をプラグインの式と比べる）です。サンプルのプラグインは `samples/plugins/`、変換した定義とシーンは `python tools/make_plugin_convert_sample.py` で作ります（`samples/plugin_convert_defs.json`・`samples/plugin_convert_sample.ma`）。

画面のない Linux では `xvfb-run -a` を付けて実行します。

push と pull_request で、Python（numpy あり・なし）と Node.js のテスト、bundle がソースと一致するかを GitHub Actions で確かめます（`.github/workflows/test.yml`。Qt のテストは手動実行のジョブ）。

リグの評価の速さは `cd web_src && npm run bench` で測ります。大きな合成リグ（`python tools/make_big_rig_sample.py 300 120 big.ma --json big.json`）は `node --expose-gc bench/rig.bench.mjs --file big.json` で測ります。列の意味と基準の値は [docs/benchmark.md](benchmark.md) です。

Maya で書き出した正解（各フレームのワールド行列と表示。`tools/maya_export_truth.py`）とビューアの評価は `python -m ma_viewer verify scene.ma truth.json` で比べます。手順は [docs/maya_verification.md](maya_verification.md) です。

## ノードの型を足す

ノードの型の登録は `ma_viewer/node_types.json` の 1 か所で、Python（`rig.py`・`ma_scene.py`）と JS（`rig.js`・`mathNodes.js`）が同じものを読みます。

- Maya 2024 以降の新しい計算ノード（sum・multiply など）は `math` に名前を足し、計算を `web_src/src/mathNodes.js` に書きます（`web_src/tests/math.test.mjs` が、登録と実装が同じかを確かめます）。
- そのほかの評価する型は `types` に足します。`kind`（Python がたどる種類: utility・constraint・geometry）、`outputs`（出力の属性の名前の正規表現）、`defaults`（ファイルに値がないときの既定値）、`angles`（ファイルに度で書かれる角度の属性）を書き、計算を `web_src/src/rigMath.js`（計算ノード）などに書きます。
- 1 段階目で setAttr を読み飛ばしてよい型は `skipAttrs` に足します。
- 属性の長い名前 → 短い名前は `ma_viewer/attr_names.json`（`python tools/make_attr_names.py` で Autodesk の技術資料から作り直す）です。

`RigEvaluator` は種類ごとのファイル（`rigPlayback.js`・`rigDag.js`・`rigPlug.js`・`rigNodeDef.js`・`rigMath.js`・`rigConstraints.js`・`rigIk.js`・`rigDisplay.js`）に分けてあり、`rig.js` の `installMethods` でプロトタイプに足します。使う `rig.js` の名前は import します（`web_src/tests/rigSplit.test.mjs` が漏れを確かめます）。

## ビューア（JS）の変更

`web_src/src/` を編集したら、`web_src` で `npm run build` を実行します。`ma_viewer/web/viewer.bundle.js` が更新されます。配布には Node.js は不要で、ビルド済みの bundle を同梱しています。

bundle は ES モジュールではなく、通常の `<script>` で読める形式です。これは、file:// で開いたページからは ES モジュールを読み込めないためです。
