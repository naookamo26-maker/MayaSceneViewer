# Maya で確かめる手順

ビューアの評価が Maya と同じかを、Maya で書き出した「正解」と数値で比べる手順です。
いまは Maya を使えない環境で開発しているため、ここにある Maya 側のスクリプトは**まだ Maya で実行していません**
（Maya なしで確かめられる部分は `tests/test_truth_tools.py`・`web_src/tests/verify.test.mjs` で確かめています）。
Maya が使えるようになったら、上から順に実行してください。

## 準備

- このリポジトリを Maya を使う PC に置く（例: `C:/tools/MayaSceneViewer`）。
- ビューアのリポジトリ側で、Python と Node.js が使えること（`cd web_src && npm ci`）。
- シーンの作業単位は cm（ビューアは cm 以外に対応しません）。

## 1. 実物のリグで、全体の再現性を比べる

1. Maya で、確かめたいシーン（.ma）を開く。
2. スクリプトエディタ（Python）で実行する:

   ```python
   import sys; sys.path.insert(0, r"C:/tools/MayaSceneViewer/tools")
   import maya_export_truth as t
   t.run(r"C:/temp/scene_truth.json")            # 再生範囲の全フレーム（t.run(path, start=1, end=24) で範囲を指定）
   ```

   mayapy なら `mayapy tools/maya_export_truth.py scene.ma scene_truth.json`。
   全 transform のワールド行列（`MDagPath.inclusiveMatrix`）と表示（`.v`・`MDagPath.isVisible`）をフレームごとに書きます。
   ノードとフレームが多いと大きくなるので、長いシーンは範囲を絞ってください。
3. ビューアのリポジトリで比べる:

   ```
   python -m ma_viewer verify scene.ma scene_truth.json --report scene_report.json
   ```

   差の大きい順に 20 個のノードと、しきい値（位置 0.001 cm・回転 0.01 度。`--pos`・`--rot` で変えられる）を
   超えたノードの数を表示します。超えたものがあれば終了コード 1。
   `--report` の JSON には全ノードの結果（最大の差・そのフレーム・表示の食い違いのフレーム数・備考）が入ります。
   備考の「バインドポーズで推定」「値を求められない」は、ビューアが未対応のノードのために推定したものです。

## 2. 計算ノードの細かな動作を確かめる

1. Maya で、開いているシーンを保存する（このスクリプトは新しいシーンを作ります）。
2. スクリプトエディタで実行する:

   ```python
   import sys; sys.path.insert(0, r"C:/tools/MayaSceneViewer/tools")
   import maya_node_check as m
   m.run(r"C:/temp/node_check")
   ```

3. `C:/temp/node_check/node_check.md` を、下の「結果」に貼る。エラーになった項目は、スクリプトを直してやり直す
   （初めての実行なので、Maya の版によってはコマンドの引数が違うかもしれません）。

確かめる項目（[整備計画](maintenance_plan.md) の「8」）:

| 項目 | いまのビューアの実装 |
|---|---|
| setRange の oldMin・oldMax の外の入力・oldMin > oldMax | 外へ延ばす（資料の式のとおり） |
| vectorProduct の内積（op 1）と normalizeOutput | 正規化した内積（角度の cos。長さ 0 は 0。資料に合わせた） |
| 表示（bool）に入る小数（0.3・0.5・0.7） | 0.5 以上で表示 |
| enum・整数の属性に入る小数（condition の `.op`・choice の `.s`） | 四捨五入（`Math.round`） |
| multiplyDivide の 0 割り | 入力 1 をそのまま返す |
| `.tan` が書かれないカーブ（接線の既定の種類ごと） | オート |
| オートミックス・オートイーズのキーを保存した .ma の `kit`・`kot` の値 | 資料の番号（27・28）として読む。19〜26 はカスタムの種類としてスプラインで評価 |
| orientConstraint の interpType（2・3 ターゲット） | Average と 2 ターゲットの Shortest（slerp）。ほかは平均として評価 |
| pairBlend の四元数補間と回転順 | 回転順 .ro で補間（資料に合わせた） |
| 回転プレーン IK の twist の向きと 0 の基準・極ベクトル | 開始 → ハンドルの軸のまわりに正の向き |
| シングルチェーン IK のハンドルの回転 | 使わない（FK の形の面を保つ） |
| IK と jointType・stiffness | 使わない（警告だけ） |
| リファレンスの編集の属性名（長い名前・短い名前） | 両方に対応 |
| cm 以外の作業単位の .ma の書式 | 対応しない（警告） |

## 3. Maya 内の読み込みの速さ（収集）

Maya 内で読み込むと、ログに「Maya からの収集の内訳」（画面が止まる時間の内訳: setAttr の文・メッシュの形・
スキンウェイト・接続など）が出ます。重いシーンで確かめたら、速い経路（既定はオフ）と比べます:

```python
import sys
sys.path.append(r"C:/tools/MayaSceneViewer")
sys.path.append(r"C:/tools/MayaSceneViewer/tools")
import maya_collect_compare as m
m.run()                      # 今の経路と速い経路で collect を 2 回ずつ行い、時間と結果の違いを出す
```

「結果は同じ」で速ければ、速い経路を既定にできます（`ma_viewer/maya_scene.py` の `fast_enabled`）。違いが出たら、
その内容（JSON）を結果に貼ってください。速い経路だけを試すときは、Maya を起動する前に環境変数
`MA_VIEWER_MAYA_FAST=1` を設定します。

## 4. アニメーションカーブ

カーブの評価は別の道具で比べます（[animation_curves.md](animation_curves.md)）:
`tools/maya_anim_curve_check.py` → `python tools/compare_anim_curves.py`。

## 5. Maya 内の読み込み（文）

Maya 内の読み込み（`ma_viewer/maya_scene.py`）が .ma の読み込みと同じ文を作るかは `tools/maya_compare.py` で比べます
（使い方はそのファイルの先頭）。

## 結果

（Maya で実行したら、日付・Maya の版・シーンと一緒にここへ貼る）
