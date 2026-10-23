// three.js 側の検証: node --test tests/
// 前提: python -m ma_viewer export samples/sample_arm.ma -o samples/sample_arm.json
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Vector3 } from 'three';
import { buildScene, vertexWorldPosition, computeBounds } from '../src/sceneBuilder.js';
import { triangulatePolygons, buildWireIndex, triangulateNgon } from '../src/geometry.js';
import { decodeSkin, vertexWeights, weightsForSlot } from '../src/weights.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const samples = path.resolve(here, '../../samples');
const data = JSON.parse(readFileSync(path.join(samples, 'sample_arm.json'), 'utf8'));
const expected = JSON.parse(readFileSync(path.join(samples, 'sample_arm.expected.json'), 'utf8'));

const close = (a, b, tol) => Math.abs(a - b) <= tol;

test('ノード階層とワールド行列が Python の計算と一致する', () => {
  const built = buildScene(data);
  data.nodes.forEach((n, i) => {
    const e = built.nodeObjects[i].matrixWorld.elements;
    n.worldMatrix.forEach((v, k) => assert.ok(close(e[k], v, 1e-5), `${n.name}[${k}] ${e[k]} != ${v}`));
  });
});

test('スキン変形後の頂点位置が Maya の式と一致する（最大 5 インフルエンス・近似なし）', () => {
  const built = buildScene(data);
  const arm = built.meshes.find((m) => m.name === 'arm_geoShape');
  assert.ok(arm.skinned, 'SkinnedMesh が作られていない');
  const v = new Vector3();
  let maxErr = 0;
  for (let i = 0; i < arm.vertexCount; i++) {
    vertexWorldPosition(arm, i, true, v);
    const exp = expected.armDeformedWorld[i];
    maxErr = Math.max(maxErr, Math.abs(v.x - exp[0]), Math.abs(v.y - exp[1]), Math.abs(v.z - exp[2]));
  }
  assert.ok(maxErr < 1e-4, `最大誤差 ${maxErr}`);
});

test('バインドポーズ（スキン無効）の頂点位置が元形状と一致する', () => {
  const built = buildScene(data);
  const arm = built.meshes.find((m) => m.name === 'arm_geoShape');
  const v = new Vector3();
  for (let i = 0; i < arm.vertexCount; i++) {
    vertexWorldPosition(arm, i, false, v);
    const p = expected.armBindPositions[i];
    assert.ok(close(v.x, p[0], 1e-5) && close(v.y, p[1] + 5, 1e-5) && close(v.z, p[2], 1e-5), `頂点 ${i}`);
  }
});

test('ジョイントを元の姿勢にすると Maya のバインド形状に戻る', () => {
  const built = buildScene(data);
  const arm = built.meshes.find((m) => m.name === 'arm_geoShape');
  // 各インフルエンスのワールド行列をバインド時のものに差し替える
  const names = Object.keys(expected.jointWorldBind);
  for (const ji of built.jointIndices) {
    const o = built.nodeObjects[ji];
    if (names.includes(o.name)) {
      o.matrixWorld.fromArray(expected.jointWorldBind[o.name]);
    }
  }
  const v = new Vector3();
  for (let i = 0; i < arm.vertexCount; i++) {
    vertexWorldPosition(arm, i, true, v);
    const p = expected.armBindPositions[i];
    assert.ok(close(v.x, p[0], 1e-4) && close(v.y, p[1] + 5, 1e-4) && close(v.z, p[2], 1e-4), `頂点 ${i}`);
  }
});

test('ウェイトの展開と統計', () => {
  const arm = data.meshes.find((m) => m.name === 'arm_geoShape');
  const nv = arm.positions.length / 3;
  const d = decodeSkin(arm.skin, nv);
  assert.equal(d.stats.maxCount, 5);
  assert.equal(d.stats.over4, 12);
  assert.equal(d.stats.overMax, 0);
  assert.equal(d.stats.unnormalized, 0);
  assert.equal(d.stats.zero, 0);
  for (let i = 0; i < nv; i++) {
    let s = 0;
    for (let k = 0; k < 4; k++) s += d.skinWeight[i * 4 + k] + d.skinWeight1[i * 4 + k];
    assert.ok(close(s, 1, 1e-5), `頂点 ${i} の合計 ${s}`);
  }
  const w = vertexWeights(d, 150);
  assert.ok(w.length >= 1 && w[0].weight >= w[w.length - 1].weight);
  const slotW = weightsForSlot(d, 0, nv);
  assert.equal(slotW[0], 1);
});

test('多角形の分割: 12 角形・凹多角形・四角形', () => {
  const arm = data.meshes.find((m) => m.name === 'arm_geoShape');
  const pos = Float32Array.from(arm.positions);
  const tri = triangulatePolygons(pos, arm.counts, arm.indices);
  const expectedTris = arm.counts.reduce((s, n) => s + n - 2, 0);
  assert.equal(tri.triCount, expectedTris);
  // 凹多角形（L 字型）
  const L = new Float32Array([0, 0, 0, 2, 0, 0, 2, 1, 0, 1, 1, 0, 1, 2, 0, 0, 2, 0]);
  const t = triangulateNgon(L, [0, 1, 2, 3, 4, 5]);
  assert.equal(t.length, 12);
  let area = 0;
  for (let k = 0; k < t.length; k += 3) {
    const [a, b, c] = [t[k], t[k + 1], t[k + 2]];
    area += ((L[b * 3] - L[a * 3]) * (L[c * 3 + 1] - L[a * 3 + 1]) - (L[c * 3] - L[a * 3]) * (L[b * 3 + 1] - L[a * 3 + 1])) / 2;
  }
  assert.ok(close(area, 3, 1e-6), `面積 ${area}（全三角形が元と同じ向き）`);
  const wire = buildWireIndex([4, 4], [0, 1, 2, 3, 1, 4, 5, 2], 6);
  assert.equal(wire.edgeCount, 7);
});

test('バウンディングボックス', () => {
  const built = buildScene(data);
  const box = computeBounds(built, true);
  assert.ok(!box.isEmpty());
  assert.ok(box.max.x > 5 && box.min.y < 5);
});

// ---------------------------------------------------------------- ポーズ確認（移動・回転・スケール）
import { PoseState, poseMatrix, poseFromTransform, identityPose } from '../src/pose.js';
import { Matrix4, Quaternion } from 'three';

const nodeIdx = (name) => data.nodes.findIndex((n) => n.name === name);
const worldPos = (built, i) => new Vector3().setFromMatrixPosition(built.nodeObjects[i].matrixWorld);
const colLen = (m, c) => new Vector3(m.elements[c * 4], m.elements[c * 4 + 1], m.elements[c * 4 + 2]).length();

test('ポーズ: 移動はジョイント自身のローカル軸が基準', () => {
  const built = buildScene(data);
  const ps = new PoseState(built, data);
  const el = nodeIdx('elbow');
  const before = built.nodeObjects[el].matrixWorld.clone();
  ps.set(el, { t: [1.5, 0, 0], r: [0, 0, 0], s: [1, 1, 1] });
  built.root.updateMatrixWorld(true);
  const axisX = new Vector3(before.elements[0], before.elements[1], before.elements[2]);
  const expected = new Vector3().setFromMatrixPosition(before).addScaledVector(axisX, 1.5);
  assert.ok(worldPos(built, el).distanceTo(expected) < 1e-6);
});

test('ポーズ: 親ジョイントのスケールは子の位置だけを伸ばす（segmentScaleCompensate）', () => {
  const built = buildScene(data);
  const ps = new PoseState(built, data);
  const el = nodeIdx('elbow'), tw = nodeIdx('forearm_twist');
  const pe = worldPos(built, el), pt = worldPos(built, tw);
  const scaleBefore = [0, 1, 2].map((c) => colLen(built.nodeObjects[tw].matrixWorld, c));
  ps.set(el, { t: [0, 0, 0], r: [0, 0, 0], s: [2, 2, 2] });
  built.root.updateMatrixWorld(true);
  const expected = pe.clone().add(pt.clone().sub(pe).multiplyScalar(2));
  assert.ok(worldPos(built, tw).distanceTo(expected) < 1e-6, '子の位置が 2 倍の距離になる');
  const scaleAfter = [0, 1, 2].map((c) => colLen(built.nodeObjects[tw].matrixWorld, c));
  scaleAfter.forEach((v, i) => assert.ok(close(v, scaleBefore[i], 1e-6), `子のスケール軸 ${i}: ${v}`));
});

test('ポーズ: 基準フレーム · 追加分 = ノードのワールド行列（ハンドルの位置と一致）', () => {
  const built = buildScene(data);
  const ps = new PoseState(built, data);
  const el = nodeIdx('elbow'), wr = nodeIdx('wrist');
  ps.set(el, { t: [0, 0.3, 0], r: [10, 20, 30], s: [1.5, 1, 1] });
  ps.set(wr, { t: [0.2, 0, 0], r: [0, -40, 5], s: [1, 2, 1] });
  built.root.updateMatrixWorld(true);
  for (const ni of [el, wr]) {
    const m = ps.frameMatrix(ni).multiply(poseMatrix(ps.get(ni)));
    const w = built.nodeObjects[ni].matrixWorld;
    m.elements.forEach((v, k) => assert.ok(close(v, w.elements[k], 1e-6), `${ni}[${k}]`));
  }
  // ハンドル（代理オブジェクト）の変換から読み戻した姿勢が一致する
  const p = ps.get(wr);
  const pos = new Vector3(), q = new Quaternion(), s = new Vector3();
  poseMatrix(p).decompose(pos, q, s);
  const back = poseFromTransform(pos, q, s);
  [...back.t, ...back.r, ...back.s].forEach((v, k) => assert.ok(close(v, [...p.t, ...p.r, ...p.s][k], 1e-6)));
});

test('ポーズ: リセットでファイル上の姿勢に戻る', () => {
  const built = buildScene(data);
  const ps = new PoseState(built, data);
  const el = nodeIdx('elbow'), tw = nodeIdx('forearm_twist');
  const b = built.nodeObjects[tw].matrix.clone();
  ps.set(el, { t: [1, 0, 0], r: [0, 45, 0], s: [3, 1, 1] });
  ps.set(tw, { t: [0, 0, 0], r: [90, 0, 0], s: [1, 1, 1] });
  ps.reset(el);
  ps.resetAll();
  assert.equal(ps.size, 0);
  built.nodeObjects[tw].matrix.elements.forEach((v, k) => assert.ok(close(v, b.elements[k], 1e-12)));
  ps.set(el, identityPose());
  assert.ok(!ps.has(el));
});

// ---------------------------------------------------------------- 8 インフルエンス
import { ShaderLib } from 'three';
import { patchVertexShader, MAX_INFLUENCES } from '../src/skinning8.js';

/** X 方向に並んだ nJ 本のジョイントと、細長い板のメッシュ（weightsOf(v) で各ジョイントのウェイト） */
function chainScene(nJ, weightsOf) {
  const T = (x) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1];
  const nodes = [{ name: 'geo', path: '|geo', type: 'transform', parent: -1, matrix: T(0), worldMatrix: T(0), attrs: {} }];
  for (let j = 0; j < nJ; j++) {
    const path = Array.from({ length: j + 1 }, (_, k) => '|j' + k).join('');
    nodes.push({ name: 'j' + j, path, type: 'joint', parent: j === 0 ? -1 : j, matrix: T(j === 0 ? 0 : 1),
      worldMatrix: T(j), attrs: {}, segmentScaleCompensate: true });
  }
  const cols = nJ * 2 + 1;
  const positions = [];
  for (let c = 0; c < cols; c++) positions.push(c * 0.5, 0, -0.5, c * 0.5, 0, 0.5);
  const counts = [], indices = [];
  for (let c = 0; c < cols - 1; c++) { counts.push(4); indices.push(c * 2, c * 2 + 2, c * 2 + 3, c * 2 + 1); }
  const nv = cols * 2;
  const sc = [], si = [], sw = [];
  for (let v = 0; v < nv; v++) {
    const w = weightsOf(v);
    let c = 0;
    w.forEach((x, j) => { if (x > 0) { si.push(j); sw.push(x); c++; } });
    sc.push(c);
  }
  return {
    schema: 'maya-scene-lite', version: 1, source: { kind: 'test' }, warnings: [], stats: {},
    nodes,
    meshes: [{ name: 'geoShape', path: '|geo|geoShape', transform: 0, visible: true, positions, counts, indices,
      skin: { cluster: 'sc', method: 0, influences: Array.from({ length: nJ }, (_, j) => j + 1),
        bindPreMatrices: Array.from({ length: nJ }, (_, j) => T(-j)), geomMatrix: T(0),
        counts: sc, indices: si, weights: sw } }],
  };
}

/** Maya の式（行列は three.js 規約）: Σ w · Wj · pmj · p。weights は使うものだけ */
function mayaDeform(built, scene, v, weights) {
  const m = scene.meshes[0];
  const p = new Vector3().fromArray(m.positions, v * 3);
  const acc = new Vector3();
  weights.forEach((w, j) => {
    if (!w) return;
    const bone = built.nodeObjects[m.skin.influences[j]];
    const mat = new Matrix4().multiplyMatrices(bone.matrixWorld, new Matrix4().fromArray(m.skin.bindPreMatrices[j]));
    acc.addScaledVector(p.clone().applyMatrix4(mat), w);
  });
  return acc;
}

test('8 インフルエンス: 8 本すべてが変形に効く（均等ウェイト・末端を回転）', () => {
  assert.equal(MAX_INFLUENCES, 8);
  const scene = chainScene(8, () => Array(8).fill(1 / 8));
  const built = buildScene(scene);
  const ps = new PoseState(built, scene);
  ps.set(8, { t: [0, 0.5, 0], r: [0, 0, 70], s: [1, 1, 1] });   // 8 本目（スロット 7）
  ps.set(6, { t: [0, 0, 0], r: [30, 0, 0], s: [1, 1.5, 1] });   // 6 本目（スロット 5）
  built.root.updateMatrixWorld(true);
  const e = built.meshes[0];
  assert.equal(e.skin.stats.maxCount, 8);
  const v = new Vector3();
  let maxErr = 0, maxMove = 0;
  for (let i = 0; i < e.vertexCount; i++) {
    vertexWorldPosition(e, i, true, v);
    const exp = mayaDeform(built, scene, i, Array(8).fill(1 / 8));
    maxErr = Math.max(maxErr, v.distanceTo(exp));
    maxMove = Math.max(maxMove, v.distanceTo(new Vector3().fromArray(scene.meshes[0].positions, i * 3)));
  }
  assert.ok(maxMove > 0.1, `ポーズで頂点が動く（${maxMove}）`);
  assert.ok(maxErr < 1e-5, `最大誤差 ${maxErr}`);
});

test('8 インフルエンス: 10 インフルエンスの頂点は上位 8 つに絞って配分し直す', () => {
  const w10 = [0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.03, 0.02, 0.01];
  const scene = chainScene(10, () => w10);
  const built = buildScene(scene);
  const e = built.meshes[0];
  assert.equal(e.skin.stats.overMax, e.vertexCount);
  const sum = w10.reduce((a, b) => a + b, 0);
  const kept = w10.slice(0, 8).reduce((a, b) => a + b, 0);
  const top8 = w10.map((w, j) => (j < 8 ? w * sum / kept : 0));
  let s8 = 0;
  for (let k = 0; k < 4; k++) s8 += e.skin.skinWeight[k] + e.skin.skinWeight1[k];
  assert.ok(close(s8, sum, 1e-6), `配分後の合計 ${s8}`);
  assert.deepEqual([...e.skin.skinIndex.slice(0, 4), ...e.skin.skinIndex1.slice(0, 4)], [0, 1, 2, 3, 4, 5, 6, 7]);
  const ps = new PoseState(built, scene);
  ps.set(5, { t: [0, 0, 0], r: [0, 0, 45], s: [1, 1, 1] });
  built.root.updateMatrixWorld(true);
  const v = new Vector3();
  for (let i = 0; i < e.vertexCount; i++) {
    vertexWorldPosition(e, i, true, v);
    assert.ok(v.distanceTo(mayaDeform(built, scene, i, top8)) < 1e-5, `頂点 ${i}`);
  }
});

test('8 インフルエンス: three.js のシェーダーに差し替えを適用できる', () => {
  for (const name of ['standard', 'basic']) {
    const src = patchVertexShader(ShaderLib[name].vertexShader);
    for (const key of ['skinIndex1', 'skinWeight1', 'boneMat1W', 'skinWeight1.w * boneMat1W', 'boneMat1W * skinVertex * skinWeight1.w']) {
      assert.ok(src.includes(key), `${name}: ${key}`);
    }
    assert.ok(!src.includes('#include <skinning_vertex>') && !src.includes('#include <skinnormal_vertex>'), name);
  }
});

// ---------------------------------------------------------------- テクスチャ（UV・マテリアル・頂点の分割）
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { buildRenderTopology, renderVertexWorldPosition, originalVertex } from '../src/sceneBuilder.js';

const texJsonPath = path.join(tmpdir(), 'maya_viewer_textured_test.json');
execFileSync('python3', ['-m', 'ma_viewer', 'export', '-q', path.join(samples, 'textured_project', 'scenes', 'textured_sample.ma'),
  '-o', texJsonPath], { cwd: path.resolve(here, '../..') });
const texData = JSON.parse(readFileSync(texJsonPath, 'utf8'));
const meshByName = (built, name) => built.meshes.find((m) => m.name === name);

test('テクスチャ: UV の継ぎ目で頂点を分け、元の頂点番号と対応づける', () => {
  const built = buildScene(texData);
  const box = meshByName(built, 'box_geoShape');
  assert.equal(box.vertexCount, 8);
  assert.equal(box.renderVertexCount, 24, '面ごとに UV が違うので各頂点が 3 つに分かれる');
  for (let v = 0; v < 8; v++) assert.equal(originalVertex(box, box.firstRender[v]), v);
  // 分けた頂点どうしの位置（スキン後）と法線が一致する（継ぎ目で形や陰影が割れない）
  const ps = new PoseState(built, texData);
  ps.set(texData.nodes.findIndex((n) => n.name === 'box_top'), { t: [0, 0, 0], r: [0, 40, 0], s: [1, 1, 1] });
  built.root.updateMatrixWorld(true);
  const nrm = box.geometry.attributes.normal;
  const a = new Vector3(), b = new Vector3();
  for (let r = 0; r < box.renderVertexCount; r++) {
    const f = box.firstRender[box.origOf[r]];
    renderVertexWorldPosition(box, r, true, a);
    renderVertexWorldPosition(box, f, true, b);
    assert.ok(a.distanceTo(b) < 1e-6, `表示用頂点 ${r}`);
    // 箱の辺はすべてハードエッジなので、法線は面の向き（軸方向）になる
    const n = [nrm.getX(r), nrm.getY(r), nrm.getZ(r)].map(Math.abs).sort((x, y) => y - x);
    assert.ok(close(n[0], 1, 1e-6) && n[1] < 1e-6, `表示用頂点 ${r} の法線`);
  }
  const uv = box.geometry.attributes.uv;
  assert.equal(uv.count, 24);
});

test('テクスチャ: 面ごとのマテリアルをグループに分ける', () => {
  const built = buildScene(texData);
  const box = meshByName(built, 'box_geoShape');
  assert.equal(box.materials.length, 2);
  assert.deepEqual(box.materials.map((m) => m.name), ['box_matA', 'box_matB']);
  assert.deepEqual(box.geometry.groups.map((g) => [g.count, g.materialIndex]), [[18, 0], [18, 1]]);
  assert.ok(Array.isArray(box.skinned.material));
  const quad = meshByName(built, 'quad_geoShape');
  assert.equal(quad.geometry.groups.length, 0);
  assert.equal(quad.skinned, null);
  assert.equal(quad.staticMesh.material.name, 'quad_mat');
  assert.equal(meshByName(built, 'plain_geoShape').staticMesh.material, built.defaultMaterial);
  const leaf = built.materials.find((m) => m.name === 'leaf_mat');
  assert.ok(leaf.userData.useAlpha);
  assert.ok(leaf.userData.textureIndex >= 0);
  const matB = built.materials.find((m) => m.name === 'box_matB');
  assert.equal(texData.textures[matB.userData.textureIndex].resolved, null);
  assert.ok(close(matB.userData.baseColor.r, 0.25, 1e-6));
});

test('テクスチャ: UV がなければ頂点を分けない', () => {
  const topo = buildRenderTopology({ indices: [0, 1, 2, 0, 2, 3], uv: null }, 4);
  assert.equal(topo.renderCount, 4);
  const withUv = buildRenderTopology({ indices: [0, 1, 2, 0, 2, 3],
    uv: { values: [0, 0, 1, 0, 1, 1, 0, 1, 5, 5], indices: [0, 1, 2, 4, 2, 3] } }, 5);
  // 面で使う表示用頂点は 5 つ（頂点 0 だけ 2 つの UV を持つ）＋どの面にも使われない頂点 4
  assert.equal(withUv.renderCount, 6);
  assert.equal(withUv.firstRender[4], 5, 'どの面にも使われていない頂点も残す');
  assert.deepEqual(Array.from(withUv.cornerRender), [0, 1, 2, 3, 2, 4]);
});

import { resizeRGBA } from '../src/textures.js';

test('テクスチャ: 縮小しても透明な画素の色を保つ', () => {
  // 2x2 → 1x1。左上だけ不透明の赤、ほかは透明だが色は緑
  const src = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0]);
  const out = resizeRGBA(src, 2, 2, 1, 1);
  assert.deepEqual(Array.from(out), [63, 191, 0, 63]);
});

// ---------------------------------------------------------------- バインドポーズ
import { applyPoseSource, hasBindPose } from '../src/sceneBuilder.js';

test('バインドポーズ: ジョイントがバインド時の位置に戻り、メッシュが元形状と一致する', () => {
  const built = buildScene(data);
  assert.ok(hasBindPose(built));
  applyPoseSource(built, 'bind');
  for (const [name, mat] of Object.entries(expected.jointWorldBind)) {
    const o = built.nodeObjects[data.nodes.findIndex((n) => n.name === name)];
    o.matrixWorld.elements.forEach((v, k) => assert.ok(close(v, mat[k], 1e-6), `${name}[${k}]`));
  }
  const arm = built.meshes.find((m) => m.name === 'arm_geoShape');
  const v = new Vector3();
  for (let i = 0; i < arm.vertexCount; i++) {
    vertexWorldPosition(arm, i, true, v);
    const p = expected.armBindPositions[i];
    assert.ok(close(v.x, p[0], 1e-5) && close(v.y, p[1] + 5, 1e-5) && close(v.z, p[2], 1e-5), `頂点 ${i}`);
  }
  // ファイルの値に戻すと、保存時のポーズ
  applyPoseSource(built, 'file');
  vertexWorldPosition(arm, 299, true, v);
  const e = expected.armDeformedWorld[299];
  assert.ok(close(v.x, e[0], 1e-4) && close(v.y, e[1], 1e-4) && close(v.z, e[2], 1e-4));
});

test('バインドポーズ: 切り替えてもポーズ確認の追加分を保つ', () => {
  const built = buildScene(data);
  const ps = new PoseState(built, data);
  const el = data.nodes.findIndex((n) => n.name === 'elbow');
  ps.set(el, { t: [0, 0, 0], r: [0, 0, 30], s: [1, 1, 1] });
  applyPoseSource(built, 'bind');
  ps.reapplyAll();
  built.root.updateMatrixWorld(true);
  const m = ps.frameMatrix(el).multiply(poseMatrix(ps.get(el)));
  m.elements.forEach((x, k) => assert.ok(close(x, built.nodeObjects[el].matrixWorld.elements[k], 1e-6)));
  const base = new Matrix4().fromArray(data.nodes[el].bindMatrix);
  const expectLocal = base.clone().multiply(poseMatrix(ps.get(el)));
  built.nodeObjects[el].matrix.elements.forEach((x, k) => assert.ok(close(x, expectLocal.elements[k], 1e-9)));
});

// ---------------------------------------------------------------- 元に戻す・やり直し
import { History, sameChanges } from '../src/history.js';

test('履歴: 元に戻す・やり直し・新しい操作でやり直しが消える・上限', () => {
  const state = new Map();
  const h = new History((changes) => { for (const [k, v] of changes) state.set(k, v); }, 3);
  const op = (label, k, before, after) => { state.set(k, after); h.push({ label, before: [[k, before]], after: [[k, after]] }); };
  op('a', 1, null, 10);
  op('b', 1, 10, 20);
  assert.equal(h.undoLabel, 'b');
  assert.equal(h.undo().label, 'b'); assert.equal(state.get(1), 10);
  assert.equal(h.undo().label, 'a'); assert.equal(state.get(1), null);
  assert.equal(h.undo(), null);
  assert.equal(h.redo().label, 'a'); assert.equal(state.get(1), 10);
  assert.ok(h.canRedo);
  op('c', 2, null, 5);                       // 新しい操作でやり直しの履歴は消える
  assert.ok(!h.canRedo);
  op('d', 2, 5, 6); op('e', 2, 6, 7);
  assert.equal(h.undoStack.length, 3);       // 上限を超えた古いものは捨てる
  assert.deepEqual(h.undoStack.map((e) => e.label), ['c', 'd', 'e']);
  assert.ok(sameChanges([[1, null]], [[1, null]]) && !sameChanges([[1, null]], [[1, { t: [0, 0, 0] }]]));
});

// ---------------------------------------------------------------- ウェイトの正規化（Maya のポスト正規化）
import { applySkinNormalization } from '../src/sceneBuilder.js';

test('正規化: 合計が 1 でないウェイトを、ポストなら変形時に合計で割る', () => {
  const scene = chainScene(8, () => Array(8).fill(0.6 / 8));      // 合計 0.6
  scene.meshes[0].skin.normalize = 2;                                // ポスト
  const built = buildScene(scene);                                   // 既定は 'maya'（設定に従う）
  const e = built.meshes[0];
  const orig = (i) => new Vector3().fromArray(scene.meshes[0].positions, i * 3);
  const v = new Vector3();
  const maxErr = (scale) => {
    let m = 0;
    for (let i = 0; i < e.vertexCount; i++) m = Math.max(m, vertexWorldPosition(e, i, true, v).distanceTo(orig(i).multiplyScalar(scale)));
    return m;
  };
  assert.ok(e.skin.normalize);
  assert.ok(maxErr(1) < 1e-5, 'ポスト: 元の位置のまま');
  applySkinNormalization(built, 'none');
  assert.ok(maxErr(0.6) < 1e-5, '正規化しない: 原点側に 0.6 倍');
  applySkinNormalization(built, 'always');
  assert.ok(maxErr(1) < 1e-5, '常に正規化: 元の位置');
  // Maya の設定がインタラクティブでも、ビューアは常に正規化する
  scene.meshes[0].skin.normalize = 1;
  const b2 = buildScene(scene);
  assert.ok(b2.meshes[0].skin.normalize);
  // 変形に使う値（ヒートマップ・一覧）
  const w = vertexWeights(e.skin, 0);
  assert.ok(close(w[0].weight, 0.075, 1e-6) && close(w[0].effective, 0.125, 1e-6));
});

test('正規化: 10 インフルエンスの頂点は上位 8 つに絞って合計 1 にする', () => {
  const w10 = [0.24, 0.16, 0.12, 0.08, 0.064, 0.048, 0.04, 0.024, 0.016, 0.008];   // 合計 0.8
  const scene = chainScene(10, () => w10);
  scene.meshes[0].skin.normalize = 2;
  const e = buildScene(scene).meshes[0];
  let s = 0;
  for (let k = 0; k < 4; k++) s += e.skin.skinWeight[k] + e.skin.skinWeight1[k];
  assert.ok(close(s, 1, 1e-6), `合計 ${s}`);
  const kept = w10.slice(0, 8).reduce((a, b) => a + b, 0);
  assert.ok(close(e.skin.skinWeight[0], 0.24 / kept, 1e-6));
});


// ---------------------------------------------------------------- ハードエッジ・UDIM・マップ
import { cornerNormals } from '../src/normals.js';
import { usageFor, neededKinds } from '../src/mapManager.js';
import { channelPixels } from '../src/textures.js';

test('ハードエッジ: 腕の側面は滑らか、端面との境目だけ法線を分ける', () => {
  const built = buildScene(data);
  const arm = built.meshes.find((m) => m.name === 'arm_geoShape');
  const m = data.meshes.find((x) => x.name === 'arm_geoShape');
  // 側面の頂点（リング 5）は 1 つの表示用頂点のまま、法線は放射方向
  const nrm = arm.geometry.attributes.normal;
  const v = 5 * 12 + 3;
  const dups = [];
  for (let r = 0; r < arm.renderVertexCount; r++) if (arm.origOf[r] === v) dups.push(r);
  assert.equal(dups.length, 1);
  const p = m.positions.slice(v * 3, v * 3 + 3);
  const radial = new Vector3(0, p[1], p[2]).normalize();
  assert.ok(new Vector3(nrm.getX(dups[0]), nrm.getY(dups[0]), nrm.getZ(dups[0])).dot(radial) > 0.99);
  // 端面（リング 0）の頂点は、側面用と端面用の 2 つに分かれる
  const capDups = [];
  for (let r = 0; r < arm.renderVertexCount; r++) if (arm.origOf[r] === 3) capDups.push(r);
  assert.equal(capDups.length, 2);
  const ns = capDups.map((r) => new Vector3(nrm.getX(r), nrm.getY(r), nrm.getZ(r)));
  assert.ok(ns.some((n) => n.x < -0.99), '端面の法線は -X');
  // ハードエッジがなければ分けない
  const sm = cornerNormals(Float32Array.from(m.positions), m.counts, m.indices, [], m.positions.length / 3);
  const cs = []; m.indices.forEach((x, c) => { if (x === 3) cs.push(sm.group[c]); });
  assert.equal(new Set(cs).size, 1);
});

test('UDIM: 面の UV の位置からタイルを判定し、タイルごとのマテリアルに振り分ける', () => {
  const built = buildScene(texData);
  const e = built.meshes.find((m) => m.name === 'udim_geoShape');
  assert.deepEqual(e.materials.map((m) => m.name), ['udim_mat <1001>', 'udim_mat <1002>']);
  assert.deepEqual(e.materials.map((m) => m.userData.maps.baseColor.key).map((k) => k.split(':')[1]), ['1001', '1002']);
});

test('マップ: 必要な種類・用途・チャンネルの取り出し', () => {
  const st = { textures: true, mapView: 'combined', maps: { normal: true, roughness: false, metalness: true } };
  assert.deepEqual(neededKinds(st), ['baseColor', 'normal', 'metalness']);
  assert.deepEqual(neededKinds({ ...st, mapView: 'roughness' }), ['roughness']);
  assert.deepEqual(neededKinds({ ...st, textures: false }), []);
  assert.equal(usageFor('baseColor', 'rgb', false), 'color');
  assert.equal(usageFor('normal', 'rgb', false), 'normal');
  assert.equal(usageFor('roughness', 'g', false), 'scalar:g');
  assert.equal(usageFor('ao', 'rgb', false), 'scalar:r');       // グレースケール画像全体なら R を使う
  assert.equal(usageFor('roughness', 'g', true), 'view:g');
  const px = new Uint8Array([10, 20, 30, 40]);
  assert.deepEqual(Array.from(channelPixels(px, 'g')), [20, 20, 20, 255]);
  // PBR のマテリアル: ORM の G をラフネス、B をメタリックに
  const built = buildScene(texData);
  const pbr = built.materials.find((m) => m.name === 'pbr_mat').userData;
  assert.equal(pbr.maps.roughness.channel, 'g');
  assert.equal(pbr.maps.metalness.channel, 'b');
  assert.equal(pbr.maps.roughness.key, pbr.maps.metalness.key, '同じ画像は同じキー（1 回だけ読む）');
  assert.ok(pbr.maps.normal && pbr.maps.emissive);
  assert.equal(pbr.roughness, 0.4);
});


// ---------------------------------------------------------------- 合計が 0 の頂点の割り当て
test('合計 0 の頂点: 記録されたジョイントに距離で配分（1 つなら 100%・等距離なら 50% ずつ）、記録がなければ最寄りに 100%', () => {
  // ジョイントは X = 0, 1, 2, 3。板の頂点は X = 0, 0.5, 1, 1.5, ...（Z = ±0.5）
  const scene = chainScene(4, (v) => {
    const x = Math.floor(v / 2) * 0.5;
    const w = [0, 0, 0, 0];
    if (x <= 0.5) return [1, 0, 0, 0];
    return w;          // それ以外はひとまず全部 0（下で個別に設定）
  });
  const sk = scene.meshes[0].skin;
  // 頂点ごとのウェイトを作り直す: 頂点 4（X=1）は j1 だけ値 0、頂点 6（X=1.5）は j1 と j2 が値 0、頂点 8（X=2）は記録なし
  const per = [];
  const nv = scene.meshes[0].positions.length / 3;
  for (let v = 0; v < nv; v++) {
    const x = Math.floor(v / 2) * 0.5;
    if (v === 4) per.push([[1, 0]]);
    else if (v === 6) per.push([[1, 0], [2, 0]]);
    else if (v === 8) per.push([]);
    else per.push([[Math.min(3, Math.round(x)), 1]]);
  }
  sk.counts = per.map((p) => p.length);
  sk.indices = per.flat().map((p) => p[0]);
  sk.weights = per.flat().map((p) => p[1]);
  const built = buildScene(scene);
  const e = built.meshes[0];
  assert.equal(e.skin.stats.zero, 3);
  const w = (v) => vertexWeights(e.skin, v).filter((x) => x.effective > 0).map((x) => [x.slot, +x.effective.toFixed(4)]);
  assert.deepEqual(w(4), [[1, 1]], '記録が 1 つなら 100%');
  assert.deepEqual(w(6).sort(), [[1, 0.5], [2, 0.5]], '等距離の 2 つなら 50% ずつ');
  assert.deepEqual(w(8), [[2, 1]], '記録がなければ最寄りのジョイント（X=2）に 100%');
  // 原点に飛ばない: バインドポーズのままなら元の位置
  const v = new Vector3();
  for (const i of [4, 6, 8]) {
    vertexWorldPosition(e, i, true, v);
    assert.ok(v.distanceTo(new Vector3().fromArray(scene.meshes[0].positions, i * 3)) < 1e-5, `頂点 ${i}`);
  }
});

test('合計 0 の頂点: 「ウェイトの分配」が近傍なら、隣の頂点のウェイトの平均', () => {
  const scene = chainScene(4, (v) => (Math.floor(v / 2) < 2 ? [1, 0, 0, 0] : [0, 0, 1, 0]));
  const sk = scene.meshes[0].skin;
  sk.weightDistribution = 1;
  // 頂点 2（X=0.5, Z=-0.5）だけ合計 0。隣は頂点 0・3（j0）と頂点 4（j2）
  const per = [];
  const nv = scene.meshes[0].positions.length / 3;
  for (let v = 0; v < nv; v++) per.push(v === 2 ? [] : (Math.floor(v / 2) < 2 ? [[0, 1]] : [[2, 1]]));
  sk.counts = per.map((p) => p.length);
  sk.indices = per.flat().map((p) => p[0]);
  sk.weights = per.flat().map((p) => p[1]);
  const e = buildScene(scene).meshes[0];
  const got = Object.fromEntries(vertexWeights(e.skin, 2).filter((x) => x.effective > 0).map((x) => [x.slot, +x.effective.toFixed(4)]));
  assert.deepEqual(got, { 0: 0.6667, 2: 0.3333 });
});
