# 自作ノードの定義（同梱用）

このフォルダの `*.json` は、プラグインの自作ノードの定義です。ビューアは起動のたびにここを読み、定義のある型のノードを評価します（exe にも必ず含めます）。

- 書き方: `docs/node_definitions.md`
- 確認: `python -m ma_viewer node-defs`（誤りがあれば終了コード 1。`python packaging/build_exe.py` もビルドの前に確かめます）
- ここにはツールとして配布する定義だけを置いてください（テスト用の定義は `samples/nodedef_sample_defs.json` にあります）。
