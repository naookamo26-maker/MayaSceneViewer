# 高速化の調査と実装の依頼（1.38.0 の時点）

各所の処理に高速化の余地がないかを測った結果と、実装する内容です。この文書だけで実装できるように、
測り方・試作のコード・確かめ方を書いてあります。調査ではリポジトリを変えていません（数字は一時フォルダのコピーで試作して測ったもの）。

実装するのは「1. クリックの選択」と「2. メッシュの組み立て」です。3 以降は、実装しない理由か、先に確かめることを書いています。

> **1.39.0 で 1 と 2 を実装しました。** 1 は `web_src/src/skinPick.js`（テストは `web_src/tests/skinPick.test.mjs`）。
> 試作の Möller–Trumbore ではなく three.js 0.187 の `Ray.intersectTriangle`（watertight）と同じ式で調べ、変形した位置も倍精度で
> `applyBoneTransform8` と同じ順に計算するので、当たりは標準とビット単位で同じです。ブラウザ（20 万頂点）で、クリック 250〜315 ms → 1〜22 ms・
> 姿勢を変えたあとのクリック 約 290 ms → 16 ms・矩形選択 54 → 11 ms。2 は下の試作の差分のとおりで、`buildScene` の結果は samples/ の全シーンと
> 20 万頂点のシーンでビット単位で同じまま、Node で初回 約 600 → 約 450 ms・2 回目以降 約 335 → 約 290 ms です。

## 測り方

- メッシュ: 20 万頂点・40 万三角形のスキン付きメッシュ（37 MB の .ma）。下の「大きなメッシュの作り方」で作る。
- リグ: `python tools/make_big_rig_sample.py 300 120 big300.ma --json big300.json`（7,204 ノード）と 1,500 本（36,004 ノード）。
  出力は一時フォルダに置く（リポジトリの中に作らない）。
- 環境: Linux・Python 3.13（numpy あり）・Node.js 22・ヘッドレスの Chromium（ソフトウェア描画）。
  Python は cProfile、JS は Node の `--cpu-prof` と Chromium の CPU プロファイル。

### 大きなメッシュの作り方

`tools/make_sample_ma.py` の円柱を大きくして、一時フォルダに書き出す（samples/ は変えない）。

```python
# mkbig.py（リポジトリの直下で: python mkbig.py 出力フォルダ → 出力フォルダ/samples/sample_arm.ma）
import sys, os
sys.path.insert(0, "tools")
import make_sample_ma as m
out = sys.argv[1]
orig_c = m.cylinder
m.cylinder = lambda: orig_c(segments=400, rings=500)
m.ROOT = out
class Stop(Exception): pass
orig_jw = m.joint_worlds
def jw(posed):
    if posed: raise Stop
    return orig_jw(posed)
m.joint_worlds = jw
try: m.main()
except Stop: pass
```

共通 JSON にする: `MA_VIEWER_NO_CACHE=1 python -m ma_viewer export 出力フォルダ/samples/sample_arm.ma -o mesh200k.json`

## 結果のまとめ

| # | 場所 | 現状 | 試作後 | 扱い |
|---|---|---|---|---|
| 1 | クリックの選択（スキン付きメッシュ） | 240〜400 ms／クリック | 15 ms（同じ姿勢の 2 回目以降は 7 ms） | 実装する |
| 2 | メッシュの組み立て（`buildScene`） | 初回 625 ms・2 回目以降 380 ms | 490 ms・280 ms | 実装する |
| 3 | .msv の書き出しの圧縮 | 0.80 秒（うち圧縮 0.78 秒） | レベル 1 で圧縮 0.1 秒 | 実際のシーンで大きさを確かめてから |
| 4 | リグの多い .ma の読み込み | 1 ノード約 150 µs | 行列の掛け算の展開で −5% | 必要になったら |
| 5 | リグの評価 | キャッシュなし 21.6 ms／フレーム（300 本） | - | 変えない（整備計画の P1 と同じ結論） |

## 1. クリックの選択（実装する）

### いまの動き

`web_src/src/main.js` の `pick` は、スキン付きメッシュ（`e.skinned`）を three.js の `Raycaster.intersectObjects` に渡す。
three.js の `SkinnedMesh` のレイキャストは、三角形の頂点ごとに `applyBoneTransform`（`skinning8.js` の
`applyBoneTransform8`）を呼ぶ（40 万三角形 × 3 回）。`applyBoneTransform8` は、インフルエンスごとに
`bones[b].matrixWorld · boneInverses[b]` を掛け直す。姿勢を変えたあと（`poseDirty`）は、範囲の球の計算でも全頂点を変形する。

ブラウザでの実測（20 万頂点。`app.pick` を直接呼ぶ）:

| 操作 | 時間（ms。3 回） |
|---|---|
| クリック（メッシュの上・オブジェクトの選択） | 401・320・371 |
| クリック（頂点の選択） | 278・289・288 |
| 姿勢を変えたあとのクリック | 348・344・466 |
| クリック（何もない所） | 2.8・0.8・0.5 |
| 矩形選択 | 76・65・57 |

プロファイルは `applyBoneTransform8` 29%・`Matrix4.multiplyMatrices` 18%・`Vector3.applyMatrix4` 17%。

### 変える内容

骨ごとの行列（`boneWorld · boneInverse`）を 1 回だけ作り、表示用頂点をすべて 1 回だけ変形して型付き配列に入れ、
その配列で三角形を調べる。式は `applyBoneTransform8` と同じ
（`bindMatrixInverse · Σ w · boneWorld · boneInverse · bindMatrix · p`。結果はメッシュのローカル空間）。

Node での比較（`buildScene` したメッシュの骨を回してから。5 回）:

| 方法 | 時間（ms） |
|---|---|
| 標準（three.js のレイキャスト） | 269・295・243・238・238 |
| 標準（姿勢を変えたあと。範囲の球も計算） | 286・285・287 |
| 試作（変形 + 三角形の判定） | 30・16・16・16・15 |
| 試作（変形した位置を使い回す） | 7.3・7.3・7.3・7.1・6.3 |

当たった三角形は標準と同じ（番号 32270・距離 46.249497）。変形後の位置の、`applyBoneTransform` との差の最大は 2.4e-7
（結果を Float32Array に入れるための丸め）。

試作のコード（1 つのメッシュ・1 本のレイで比べただけのもの。置き場所は `skinning8.js` か `sceneBuilder.js` がよい）:

```js
const _m = new Matrix4(), _inv = new Matrix4(), _ray = new Ray();
/** 変形後の表示用頂点の位置（メッシュのローカル空間）。骨ごとの行列は 1 回だけ作る */
function deformedLocal(e, out) {
  const sm = e.skinned, sk = sm.skeleton, A = e.geometry.attributes;
  const pos = A.position.array, n = A.position.count;
  const nb = sk.bones.length;
  const bm = new Float64Array(nb * 16);
  for (let b = 0; b < nb; b++) { _m.multiplyMatrices(sk.bones[b].matrixWorld, sk.boneInverses[b]); bm.set(_m.elements, b * 16); }
  const B = sm.bindMatrix.elements, BI = sm.bindMatrixInverse.elements;
  const sets = [[A.skinIndex.array, A.skinWeight.array]];
  if (A.skinIndex1) sets.push([A.skinIndex1.array, A.skinWeight1.array]);
  for (let v = 0; v < n; v++) {
    const px = pos[v * 3], py = pos[v * 3 + 1], pz = pos[v * 3 + 2];
    const bx = B[0] * px + B[4] * py + B[8] * pz + B[12], by = B[1] * px + B[5] * py + B[9] * pz + B[13], bz = B[2] * px + B[6] * py + B[10] * pz + B[14];
    let x = 0, y = 0, z = 0;
    for (let s = 0; s < sets.length; s++) {
      const ia = sets[s][0], wa = sets[s][1];
      for (let k = 0; k < 4; k++) {
        const w = wa[v * 4 + k];
        if (w === 0) continue;
        const o = ia[v * 4 + k] * 16;
        x += w * (bm[o] * bx + bm[o + 4] * by + bm[o + 8] * bz + bm[o + 12]);
        y += w * (bm[o + 1] * bx + bm[o + 5] * by + bm[o + 9] * bz + bm[o + 13]);
        z += w * (bm[o + 2] * bx + bm[o + 6] * by + bm[o + 10] * bz + bm[o + 14]);
      }
    }
    out[v * 3] = BI[0] * x + BI[4] * y + BI[8] * z + BI[12];
    out[v * 3 + 1] = BI[1] * x + BI[5] * y + BI[9] * z + BI[13];
    out[v * 3 + 2] = BI[2] * x + BI[6] * y + BI[10] * z + BI[14];
  }
  return out;
}
/** いちばん手前の三角形（表だけ・両面は side で）。Möller–Trumbore */
function nearestHit(P, index, ray, side) {
  const ox = ray.origin.x, oy = ray.origin.y, oz = ray.origin.z, dx = ray.direction.x, dy = ray.direction.y, dz = ray.direction.z;
  let best = Infinity, bt = -1;
  for (let t = 0, n = index.length; t < n; t += 3) {
    const a = index[t] * 3, b = index[t + 1] * 3, c = index[t + 2] * 3;
    const ax = P[a], ay = P[a + 1], az = P[a + 2];
    const e1x = P[b] - ax, e1y = P[b + 1] - ay, e1z = P[b + 2] - az;
    const e2x = P[c] - ax, e2y = P[c + 1] - ay, e2z = P[c + 2] - az;
    const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (side === 0 ? det <= 0 : side === 1 ? det >= 0 : det === 0) continue;   // 0 表・1 裏・2 両面
    const inv = 1 / det;
    const tx = ox - ax, ty = oy - ay, tz = oz - az;
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const v = (dx * qx + dy * qy + dz * qz) * inv;
    if (v < 0 || u + v > 1) continue;
    const d = (e2x * qx + e2y * qy + e2z * qz) * inv;
    if (d >= 0 && d < best) { best = d; bt = t / 3; }
  }
  return { tri: bt, t: best };
}
```

### 実装するときに決めること・気を付けること

- 使う所: `pick`（オブジェクト・頂点の両方）。同じ変形の関数を、矩形選択（`nodesInRect` のメッシュの部分。いまは
  `renderVertexWorldPosition` を頂点ごとに呼ぶ）にも使う。`computeBounds`・`characterRadius` は間引いているので、そのままでよい。
- 変形した位置の使い回し: 姿勢が変わるまで覚えておくと、2 回目以降は 7 ms になる。無効にする条件は、いまの `poseDirty`
  （`afterPoseChange` が立てる）に合わせる。メモリは表示用頂点 × 12 バイト（20 万頂点で 2.4 MB）。使い回さなくても 15 ms なので、
  無効にする条件が複雑になるなら、毎回変形するだけでもよい。
- 当たりの判定を three.js の標準と合わせること:
  - 面の向き: 材質の `side`（表・裏・両面）。材質が配列（`geometry.groups`）のメッシュは、三角形のグループごとの材質で決める。
    見えない材質（`visible` が false）の扱いも、標準と同じにする。
  - `raycaster.near`・`far`。
  - レイはメッシュの `matrixWorld` の逆行列でローカル空間に移す。スケールがあると、ローカルの t はワールドの距離と違う。
    カーブの当たり（`curveHit.distance`）と比べるのはワールドの距離なので、当たった点をワールドに戻して距離を求める。
  - 複数のメッシュのうち、いちばん手前のものを選ぶ。
  - 頂点の選択では、当たった三角形の 3 つの表示用頂点（いまの `h.face.a`・`b`・`c`）と当たった点（`h.point`）が要る。
- スキンのないメッシュ（`staticMesh`）と、スキンを表示しない設定（`settings.skin` がオフ）は、いまのまま three.js のレイキャストでよい
  （頂点の変形がないので速い）。まとめて描くメッシュ（`BATCHED_LAYER`）の扱いも変えない。
- 9 つ以上のインフルエンス・ウェイトの合計が 1 でないメッシュでも、`applyBoneTransform8` と同じ結果になること
  （属性 `skinIndex`・`skinWeight`・`skinIndex1`・`skinWeight1` をそのまま使えば同じになる）。
- 先に範囲で外せるメッシュは外す（いまは `boundingSphere`。変形した位置から箱を作るか、`skinCull` の球を使う）。メッシュの数が多いシーンで、
  クリックのたびに全メッシュを変形しないため。

### 確かめ方

- テスト（`web_src/tests/selection.test.mjs` などに足す）: samples/ のスキン付きメッシュ（`sample_arm.json`・`shared_skin_sample.json` など）で、
  骨を動かしたあと、いくつかのレイについて、新しい方法と three.js の `intersectObjects` の結果（メッシュ・三角形の番号・距離）が同じこと。
  表・裏・両面と、当たらないレイも入れる。
- Qt のテスト（`tests/qt_select_test.py`）がそのまま通ること。
- 20 万頂点のシーンで、クリックの時間を測る。ブラウザの開発者ツールで:

```js
const a = mayaViewer.debug.app, r = a.canvas.getBoundingClientRect();
const t = performance.now();
a.pick({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 });
performance.now() - t;
```

## 2. メッシュの組み立て（実装する）

`buildScene`（`web_src/src/sceneBuilder.js`）は、変換結果のキャッシュが効いたときも .msv を開くときも毎回かかる。
20 万頂点で、ブラウザのログの「シーンの組み立て」は 0.56 秒（ビューア側の読み込み全体は約 0.9 秒）。

Node でのプロファイル（4 回の合計に対する割合）: `cornerNormals` 18%・`buildMesh` 15%・`buildSkinCull` 11%・`base64ToBytes` 6%・
`buildWireIndex` 5%・`decodeSkin` 4%・`smooth`（`cornerNormals` の中）4%。

次の 3 つを試作し、結果が同じまま、初回 625 → 約 490 ms（−21%）・2 回目以降 380 → 約 280 ms（−26%）になった（5 回ずつ実行）。
結果は、法線の配列と `skinCull` の球が一致し、既存のテスト（`scene`・`normals`・`meshBatches`・`selection`・`textures`・
`componentTags` の 75 件）も合格した。

1. `buildMesh` の法線のコピー: コーナーごとに `subarray` を作って `set` しているのを、要素を直接写す。
2. `buildSkinCull`: 頂点ごとの分割代入（`for (const [ia, wa] of sets)`）と、骨ごとの Map・点の配列を、型付き配列にする。
   先にウェイトを確かめて数え、点は 1 つの Float64Array に入れる。
3. `cornerNormals` のハードエッジの判定: 頂点の組ごとに Set を引いているのを、ハードエッジの端の頂点（`onHard`）どうしのときだけ引く。

試作の差分（1 と 2。1.38.0 の `web_src/src/sceneBuilder.js` に対して）:

```diff
--- web_src/src/sceneBuilder.js	2026-11-13 22:42:50.787960521 +0000
+++ web_src/src/sceneBuilder.js	2026-11-14 03:12:45.908464897 +0000
@@ -287,44 +287,72 @@
   const g = e.geometry, sk = e.skeleton, sm = e.skinned;
   if (!g || !sk || !sm) return null;
   const pos = g.attributes.position.array;
-  const sets = [[g.attributes.skinIndex, g.attributes.skinWeight], [g.attributes.skinIndex1, g.attributes.skinWeight1]];
+  const A = g.attributes;
+  const ias = [], was = [];
+  if (A.skinIndex && A.skinWeight) { ias.push(A.skinIndex.array); was.push(A.skinWeight.array); }
+  if (A.skinIndex1 && A.skinWeight1) { ias.push(A.skinIndex1.array); was.push(A.skinWeight1.array); }
   const n = g.attributes.position.count;
   const nb = sk.bones.length;
-  // 骨ごとの変換（骨の逆行列 · bindMatrix）と、骨のローカル空間の点の範囲（箱 → 球）
-  const toBone = new Map();
-  const box = new Map();                           // 骨 → [minx, miny, minz, maxx, maxy, maxz]
-  const pts = new Map();                           // 骨 → 点（球の半径を求める）
+  const nSet = ias.length;
+  // 1 回目: 確かめる・数える
+  let total = 0;
+  for (let s = 0; s < nSet; s++) {
+    const wa = was[s], ia = ias[s];
+    for (let i = 0, m = n * 4; i < m; i++) {
+      const w = wa[i];
+      if (w === 0) continue;
+      if (!(w > 0)) return null;
+      if (ia[i] >= nb) return null;
+      total++;
+    }
+  }
   for (let v = 0; v < n; v++) {
     let sum = 0;
-    for (const [ia, wa] of sets) {
-      if (!ia || !wa) continue;
+    for (let s = 0; s < nSet; s++) { const wa = was[s], o = v * 4; for (let k = 0; k < 4; k++) sum += wa[o + k]; }
+    if (Math.abs(sum - 1) > 1e-4) return null;
+  }
+  const mats = new Array(nb).fill(null);
+  const box = new Float64Array(nb * 6);
+  const seen = new Uint8Array(nb);
+  const order = [];
+  const px = new Float64Array(total * 3), pb = new Int32Array(total);
+  let t = 0;
+  for (let v = 0; v < n; v++) {
+    const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2];
+    for (let s = 0; s < nSet; s++) {
+      const wa = was[s], ia = ias[s];
       for (let k = 0; k < 4; k++) {
-        const w = wa.array[v * 4 + k];
-        if (w === 0) continue;
-        if (!(w > 0)) return null;                 // 負のウェイト（範囲を保証できない）
-        sum += w;
-        const b = ia.array[v * 4 + k];
-        if (b >= nb) return null;
-        let m = toBone.get(b);
-        if (!m) toBone.set(b, m = new Matrix4().multiplyMatrices(sk.boneInverses[b], sm.bindMatrix));
-        _cv.set(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]).applyMatrix4(m);
-        let bx = box.get(b);
-        if (!bx) { box.set(b, bx = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]); pts.set(b, []); }
-        bx[0] = Math.min(bx[0], _cv.x); bx[1] = Math.min(bx[1], _cv.y); bx[2] = Math.min(bx[2], _cv.z);
-        bx[3] = Math.max(bx[3], _cv.x); bx[4] = Math.max(bx[4], _cv.y); bx[5] = Math.max(bx[5], _cv.z);
-        pts.get(b).push(_cv.x, _cv.y, _cv.z);
+        const i = v * 4 + k;
+        if (wa[i] === 0) continue;
+        const b = ia[i];
+        let m = mats[b];
+        if (!m) m = mats[b] = new Matrix4().multiplyMatrices(sk.boneInverses[b], sm.bindMatrix).elements;
+        const w = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);
+        const cx = (m[0] * x + m[4] * y + m[8] * z + m[12]) * w;
+        const cy = (m[1] * x + m[5] * y + m[9] * z + m[13]) * w;
+        const cz = (m[2] * x + m[6] * y + m[10] * z + m[14]) * w;
+        const o = b * 6;
+        if (!seen[b]) { seen[b] = 1; order.push(b); box[o] = box[o + 3] = cx; box[o + 1] = box[o + 4] = cy; box[o + 2] = box[o + 5] = cz; }
+        else {
+          if (cx < box[o]) box[o] = cx; if (cy < box[o + 1]) box[o + 1] = cy; if (cz < box[o + 2]) box[o + 2] = cz;
+          if (cx > box[o + 3]) box[o + 3] = cx; if (cy > box[o + 4]) box[o + 4] = cy; if (cz > box[o + 5]) box[o + 5] = cz;
+        }
+        px[t * 3] = cx; px[t * 3 + 1] = cy; px[t * 3 + 2] = cz; pb[t++] = b;
       }
     }
-    if (Math.abs(sum - 1) > 1e-4) return null;     // ウェイトの合計が 1 でない
+  }
+  const r2 = new Float64Array(nb);
+  for (let i = 0; i < t; i++) {
+    const o = pb[i] * 6;
+    const dx = px[i * 3] - (box[o] + box[o + 3]) / 2, dy = px[i * 3 + 1] - (box[o + 1] + box[o + 4]) / 2, dz = px[i * 3 + 2] - (box[o + 2] + box[o + 5]) / 2;
+    const d = dx * dx + dy * dy + dz * dz;
+    if (d > r2[pb[i]]) r2[pb[i]] = d;
   }
   const bones = [], data = [];
-  for (const [b, bx] of box) {
-    const cx = (bx[0] + bx[3]) / 2, cy = (bx[1] + bx[4]) / 2, cz = (bx[2] + bx[5]) / 2;
-    let r2 = 0;
-    const p = pts.get(b);
-    for (let i = 0; i < p.length; i += 3) r2 = Math.max(r2, (p[i] - cx) ** 2 + (p[i + 1] - cy) ** 2 + (p[i + 2] - cz) ** 2);
+  for (const b of order) {
+    const o = b * 6;
     bones.push(b);
-    data.push(cx, cy, cz, Math.sqrt(r2) * (1 + 1e-6) + 1e-9);
+    data.push((box[o] + box[o + 3]) / 2, (box[o + 1] + box[o + 4]) / 2, (box[o + 2] + box[o + 5]) / 2, Math.sqrt(r2[b]) * (1 + 1e-6) + 1e-9);
   }
   return { bones: Int32Array.from(bones), spheres: Float64Array.from(data) };
 }
@@ -772,7 +800,13 @@
   const { origOf, firstRender, cornerRender } = topo;
   // 表示用頂点の法線（同じまとまりのコーナーは同じ法線）
   const renderNormals = new Float32Array(topo.renderCount * 3);
-  for (let c = 0; c < cornerRender.length; c++) renderNormals.set(cn.normals.subarray(c * 3, c * 3 + 3), cornerRender[c] * 3);
+  {
+    const src = cn.normals;
+    for (let c = 0, n = cornerRender.length; c < n; c++) {
+      const d = cornerRender[c] * 3, o = c * 3;
+      renderNormals[d] = src[o]; renderNormals[d + 1] = src[o + 1]; renderNormals[d + 2] = src[o + 2];
+    }
+  }
 
   // 面ごとのマテリアル（UDIM ならタイルごと）→ このメッシュ内のスロット
   const faceMat = m.faceMaterials || null;
```

試作の差分（3。`web_src/src/normals.js`）:

```diff
--- web_src/src/normals.js	2026-11-13 22:42:50.783960521 +0000
+++ web_src/src/normals.js	2026-11-14 03:13:41.152396181 +0000
@@ -72,11 +72,14 @@
 
   // ハードエッジ（少ないので Set で十分）
   const hard = new Set();
+  const onHard = new Uint8Array(vertexCount);            // ハードエッジの端の頂点か（Set を引く回数を減らす）
   for (let i = 0; i + 1 < (hardEdges ? hardEdges.length : 0); i += 2) {
     const a = hardEdges[i], b = hardEdges[i + 1];
     hard.add(a < b ? a * vertexCount + b : b * vertexCount + a);
+    if (a < vertexCount) onHard[a] = 1;
+    if (b < vertexCount) onHard[b] = 1;
   }
-  const smooth = (v, u) => !hard.size || !hard.has(v < u ? v * vertexCount + u : u * vertexCount + v);
+  const smooth = (v, u) => !onHard[v] || !onHard[u] || !hard.has(v < u ? v * vertexCount + u : u * vertexCount + v);
 
   const parent = new Int32Array(nCorner);
   for (let c = 0; c < nCorner; c++) parent[c] = c;
```

### 気を付けること

- 2 の試作は、点の変換を `Vector3.applyMatrix4` と同じ式（w で割る）で書いてある。結果（球の中心・半径）がビット単位で同じことを、
  置き換えの前後で確かめる。ウェイトの合計は、試作では頂点ごとに 4 つずつ足している（元は 0 でないものだけ足す。結果は同じ）。
  `null` を返す条件（負のウェイト・骨の番号が範囲外・合計が 1 でない）は、どれに当たっても `null` なので、調べる順は変わってよい。
- 3 は、ハードエッジの頂点番号が頂点数以上の（壊れた）データでも、いまと同じ結果になるようにしてある（`onHard` に入れないだけで、
  Set には入る。そのような辺は、いまもどの組とも一致しない）。
- そのほかの小さな候補（試していない）: `buildWireIndex` と `cornerNormals` が同じ「頂点 → コーナー」の表を別々に作っている（共通にできる）。
  `base64ToBytes` は `Uint8Array.fromBase64` がない環境（Qt 6.5 の Chromium 108 など）で `atob` と 1 文字ずつのループになる
  （20 万頂点で約 35 ms）。

### 確かめ方

- 置き換えの前後で、samples/ の全シーンと 20 万頂点のシーンについて、`buildScene` の結果（各メッシュの `normal`・`position`・`index` の
  配列と `skinCull`）が同じこと。`web_src` で `npm test`。
- 時間: 下のスクリプトを、置き換えの前後で 5 回ずつ。

```js
// build_time.mjs（web_src に置いて: node build_time.mjs mesh200k.json。測ったら消す）
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { buildScene } from './src/sceneBuilder.js';
const text = readFileSync(process.argv[2], 'utf8');
const ts = [];
for (let i = 0; i < 5; i++) { const data = JSON.parse(text); const t = performance.now(); buildScene(data); ts.push(performance.now() - t); }
console.log('初回', ts[0].toFixed(0), '2 回目以降の最小', Math.min(...ts.slice(1)).toFixed(0), 'ms');
```

## 3. .msv の書き出しの圧縮（先に確かめる）

> **1.40.0 で対応しました。** 円柱のほかに、形を凹凸でゆがめ値を半端にしたもの・頂点や面の順を入れ替えたものでも比べ、
> レベル 1 と 6 の大きさの差は ±2% 以内でした（時間は 2.5〜3 倍違う）。そのうえで .msv を version 2 にし、数値の配列を
> 配列ごとに「そのまま・バイトの並べ替え・差分＋並べ替え」のうち最も縮むもので詰めてから、レベル 1 で圧縮します（docs/data_format.md）。
> 20 万頂点で、円柱は 3.29 → 0.57 MB・書き出し 0.73 → 0.13 秒、頂点の順がばらばらのものは 6.28 → 5.02 MB・0.82 → 0.33 秒。
> version 1 の .msv も読めます。あわせて、テクスチャの WebP の品質の既定を 80 → 75 にしました。

`package.write_package` は 20 万頂点で 0.80 秒、そのうち 0.78 秒が zlib の圧縮（`compresslevel=6`）。`bin/data.bin`（14.1 MB）で比べると:

| レベル | 大きさ | 圧縮 | 展開 |
|---|---|---|---|
| 1 | 2.97 MB | 95 ms | 52 ms |
| 3 | 3.06 MB | 175 ms | 52 ms |
| 4 | 3.16 MB | 156 ms | 51 ms |
| 6（いま） | 3.29 MB | 717 ms | 58 ms |

このデータではレベル 1 のほうが速くて小さいが、規則的な合成データ（円柱）なので、実際のシーンでは大きさが逆になると考えられる。
.msv は「小さい」ことが目的なので、実際の制作シーンのいくつかで大きさと時間を比べてから決める（確かめずに変えない）。

## 4. リグの多い .ma の読み込み（必要になったら）

> **1.40.0 で対応しました。** ノードが 5 倍になると時間は約 6 倍で、比例より多い分はアニメーションの読み込みの間の GC でした
> （解析と変換の間はもとから止めていた）。そこでも GC を止め、`mathutil.mul` を展開しました。出力は samples/ の全 .ma と
> 合成のリグで同じまま、7,204 ノード 0.91 → 0.79 秒・36,004 ノード 5.75 → 4.20 秒。

`load_ma(…, animation=True)` は 7,204 ノードで約 1.0 秒、36,004 ノードで 5.4 秒（ノード数に比例。1 ノード約 150 µs）。
内訳（7,204 ノード）: 解析 0.23 秒（connectAttr 0.08・createNode 0.07）、変換 0.51 秒（バインドポーズ 0.22・ノードの出力（行列）0.14・
出力するノードの決定 0.10）、アニメーション約 0.3 秒。

プロファイルは平らで、目立つのは `mathutil.mul`（6 万回）・`rig._trampoline`・`dict.get`（59 万回）・`id`（40 万回）。
`mathutil.mul` を 16 個の式に展開すると、結果は同じまま 0.895 → 0.850 秒（−5%）。ほかの候補は、`transform_matrix` の
単位行列の掛け算を省くこと（-0.0 の符号が変わりうるので、出力の JSON が同じかを確かめる）。

2 回目以降は変換結果のキャッシュ（約 0.1 秒）が効くので、数万ノードのリグで初回が遅いと言われたときに取り組めばよい。

## 5. 変えない所

- リグの評価: キャッシュなし 21.6 ms／フレーム（300 本。2,101 個の動くノード）。`channelValues` 16%・`plug` 9%・GC 6%・
  `Matrix4.multiplyMatrices` 5% で、整備計画の P1 の測定と同じ形。再生キャッシュ（0.17 ms／フレーム）とワーカーがあるので変えない。
  最初の 1 フレーム（約 280 ms。計画を作る分）は JIT と GC が主で、特定の重い所はない。
- メッシュの .ma の解析: 37 MB で約 1.1 秒。`numpy.fromstring` が主。
- Qt への受け渡しとキャッシュ: JSON 化 45 ms・保存の圧縮 177 ms・読み出し（展開と解釈）約 110 ms。どれも読み込みのスレッドで行う。
- フレームの反映（`applyFrameInner`）: 変わったノードだけ写す・ワールド行列も変わったノードの下だけ、になっている。
- そのほかの操作（20 万頂点）: 全体を表示 10 ms・ウェイト表示 17 ms・表示の切り替え 20〜45 ms。

## 測れていない所

- Qt 版（PySide6 がない環境で測った）: `runJavaScript` での受け渡し・QWebChannel でのテクスチャの受け渡し（`readPackedBase64` は
  テクスチャごとに zip を開き直す）。
- Maya 内の収集（整備計画の P4 のまま）。
- GPU: ソフトウェア描画なので、最初の描画（約 0.2 秒）・スキン付きメッシュの描画は実機と違う。
- 実際の制作シーン: すべて合成データ。UV の継ぎ目・ハードエッジの多いモデル・メッシュの数が多いシーンでは、配分が変わりうる。

## バージョン

1 と 2 を実装する PR は、CLAUDE.md の表の「評価を速くする」と同じ扱い（互換を保った、目に見える動作の変更）で、マイナーを上げる
（1.38.0 → 1.39.0。1 つの PR なら 1 回）。この文書だけの変更では上げない。
