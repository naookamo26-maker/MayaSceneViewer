# リグの評価のベンチ

`web_src/bench/rig.bench.mjs` で、リグの評価の速さと再生キャッシュのメモリを測ります（開発用）。

```
cd web_src
npm run bench                                      # samples/ の全シーン
npm run bench -- --save before.json                # 全フレームの結果を保存（変更の前）
npm run bench -- --check before.json               # 保存した結果と同じか（変更の後）

# 大きな合成リグ（samples/ には入れない。一時フォルダに作る）
python ../tools/make_big_rig_sample.py 300 120 /tmp/big300.ma --json /tmp/big300.json
node --expose-gc bench/rig.bench.mjs --file /tmp/big300.json --repeat 5
```

列の意味:

| 列 | 内容 |
|---|---|
| `nodes` / `graph` | 動くノードの数 / グラフのノードの数 |
| `once` | 新しい評価器の最初の 1 フレーム（ms。計画を作る分を含む） |
| `first` | 1 周目（読み込み直後の再生）の 1 フレームあたり（ms） |
| `warm` | 2 周目以降（再生キャッシュから） |
| `nocache` | 再生キャッシュなしの評価（専用の評価を使う） |
| `generic` | 汎用の経路だけ（専用の評価を使わない。キャッシュなし） |
| `nokeep` | 時間で変わらない値もフレームごとに計算する |
| `cacheMB` | 1 周目のあとの `playbackStats().bytes`（再生キャッシュの上限の計算に使う値） |
| `realMB` | GC 後のヒープ（`heapUsed + external`）の増加の、キャッシュありとなし（上限 0）の評価器での差。`--expose-gc` のときだけ |

## 基準の値

1.31.6 の時点（Linux・Node.js 22。手足の数・120 フレーム。`make_big_rig_sample.py`）:

| 手足 | ノード・接続 | graph / 動くノード | once | first | warm | nocache | generic | cacheMB | realMB |
|---|---|---|---|---|---|---|---|---|---|
| 300 | 7,204・16,501 | 6,001 / 2,101 | 235〜296 | 16.5〜19.4 | 0.15〜0.24 | 12.6〜14.2 | 41.6〜44.8 | 23.1 | 24.1 |
| 1,500 | 36,004・82,501 | 30,001 / 10,501 | 1,108 | 112 | 1.2 | 100 | 269 | 115.4 | 120.6 |

（ms。幅は数回の実行のばらつき）

再生キャッシュの実際のメモリは、数えている値の 1.04〜1.05 倍でした。整備計画の調査（P2）では 2.2〜3.4 倍と
見ていましたが、そのときの測り方は、キャッシュ以外（評価器が作るオブジェクトなど）の増加も含んでいたと考えられます。
