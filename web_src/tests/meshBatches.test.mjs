// スキンのないメッシュを材質ごとにまとめて描く（meshBatches.js）: まとめ方と、元のメッシュの表示・行列・材質の写し方
// 前提: python tools/make_batch_sample.py（samples/batch_sample.json）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4, Vector3 } from 'three';
import { buildScene } from '../src/sceneBuilder.js';
import { BATCHED_LAYER, MeshBatches, slotGeometry } from '../src/meshBatches.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = () => JSON.parse(readFileSync(path.resolve(here, '../../samples/batch_sample.json'), 'utf8'));

function setup() {
  const data = load();
  const built = buildScene(data);
  const batches = new MeshBatches(built);
  const byName = (n) => built.meshes.find((e) => e.name === `${n}Shape`);
  const node = (n) => built.nodeObjects[data.nodes.findIndex((x) => x.name === n)];
  return { data, built, batches, byName, node };
}

/** まとめたメッシュの中の、ジオメトリ gid の三角形の頂点の位置（ローカル空間） */
function batchTriangles(batch, gid) {
  const info = batch._geometryInfo[gid];
  const pos = batch.geometry.attributes.position, idx = batch.geometry.index.array;
  const out = [];
  for (let i = info.indexStart; i < info.indexStart + info.indexCount; i++) out.push(...new Vector3().fromBufferAttribute(pos, idx[i]).toArray());
  return out;
}

/** 元のジオメトリの、三角形の範囲 [start, start + count) の頂点の位置 */
function originalTriangles(geometry, start, count) {
  const pos = geometry.attributes.position, idx = geometry.index.array;
  const out = [];
  for (let i = start; i < start + count; i++) out.push(...new Vector3().fromBufferAttribute(pos, idx[i]).toArray());
  return out;
}

test('材質・属性ごとにまとめ、元のメッシュは描画から外す（選択の光線のレイヤーへ）', () => {
  const { built, batches } = setup();
  // matA（UV あり）・matB・matC・matA（UV なし）の 4 つ。面ごとに材質が違う箱は matA と matB に分かれて入る
  assert.equal(batches.batches.length, 4);
  assert.equal(batches.batchedMeshes.size, built.meshes.length);
  assert.equal(batches.pieces.length, built.meshes.length + 1);
  for (const e of built.meshes) assert.equal(e.staticMesh.layers.mask, 1 << BATCHED_LAYER, e.name);
  const sizes = batches.batches.map((b) => b._instanceInfo.length).sort((a, b) => a - b);
  assert.deepEqual(sizes, [4, 21, 22, 27]);
});

test('まとめたジオメトリは、元のメッシュ（複数の材質なら、その材質の部分）と同じ三角形', () => {
  const { batches } = setup();
  for (const p of batches.pieces) {
    const g = p.e.geometry;
    const grp = g.groups.length ? g.groups.find((x) => x.materialIndex === p.slot) : { start: 0, count: g.index.count };
    const gid = p.batch._instanceInfo[p.inst].geometryIndex;
    assert.deepEqual(batchTriangles(p.batch, gid), originalTriangles(g, grp.start, grp.count), `${p.e.name} スロット ${p.slot}`);
  }
});

test('slotGeometry: 使う頂点だけにまとめ、同じ三角形・同じ属性の値', () => {
  const { byName } = setup();
  const e = byName('multi');
  for (const grp of e.geometry.groups) {
    const sub = slotGeometry(e.geometry, grp);
    assert.deepEqual(originalTriangles(sub, 0, sub.index.count), originalTriangles(e.geometry, grp.start, grp.count));
    assert.ok(sub.attributes.position.count < e.geometry.attributes.position.count);
    for (const name of ['normal', 'uv', 'color']) assert.ok(sub.getAttribute(name), name);
  }
});

test('sync: 表示（親のノードも）・ワールド行列（動くノードの下）・材質を写す', () => {
  const { built, batches, byName, node } = setup();
  node('hiddenBox').visible = false;                 // ノードの非表示は、画面側（main.js の updateVisibility）が反映する
  built.root.updateMatrixWorld(true);
  batches.sync();
  const visOf = (e) => batches.pieces.filter((p) => p.e === e).map((p) => p.batch.getVisibleAt(p.inst));
  assert.deepEqual(visOf(byName('box0')), [true]);
  assert.deepEqual(visOf(byName('hiddenBox')), [false], '親のノードが非表示');
  // メッシュを非表示にする・親のノードを非表示にする
  byName('box1').staticMesh.visible = false;
  node('mover').visible = false;
  batches.sync();
  assert.deepEqual(visOf(byName('box1')), [false]);
  assert.deepEqual(visOf(byName('ride3')), [false]);
  node('mover').visible = true;
  // 動くノードを動かすと、その下の箱の行列が変わる
  node('mover').matrix.makeTranslation(5, 0, 0);
  node('mover').matrixWorldNeedsUpdate = true;
  built.root.updateMatrixWorld();
  batches.sync();
  const ride = byName('ride2');
  const p = batches.pieces.find((x) => x.e === ride);
  assert.equal(p.batch.getVisibleAt(p.inst), true);
  // BatchedMesh は行列を 32 ビットの浮動小数点数のテクスチャに持つ（GPU に送る元のメッシュの行列も 32 ビット）
  assert.deepEqual(p.batch.getMatrixAt(p.inst, new Matrix4()).elements, ride.staticMesh.matrixWorld.elements.map(Math.fround));
  assert.equal(ride.staticMesh.matrixWorld.elements[12], 5 + 2 * 1.2);
  // 材質の差し替え（ライトなし）
  const unlit = ride.materials[0].userData.unlit;
  for (const e of built.meshes) e.staticMesh.material = e.materials.length > 1 ? e.materials.map((m) => m.userData.unlit) : e.materials[0].userData.unlit;
  batches.sync();
  assert.equal(p.batch.material, unlit);
  for (const b of batches.batches) assert.equal(b.material.isMeshBasicMaterial, true);
});

test('setEnabled(false): 元のメッシュで描く（ウェイトの表示）。戻すとまた外す。dispose で元に戻す', () => {
  const { built, batches } = setup();
  batches.setEnabled(false);
  assert.equal(batches.group.visible, false);
  for (const e of built.meshes) assert.equal(e.staticMesh.layers.mask, 1, e.name);
  batches.setEnabled(true);
  assert.equal(batches.group.visible, true);
  for (const e of built.meshes) assert.equal(e.staticMesh.layers.mask, 1 << BATCHED_LAYER, e.name);
  batches.dispose();
  for (const e of built.meshes) assert.equal(e.staticMesh.layers.mask, 1, e.name);
});

test('材質が 1 つのメッシュにしか使われていなければ、まとめない（元のまま描く）', () => {
  const data = load();
  data.meshes = data.meshes.filter((m) => /^(box0|box1|box2)Shape$/.test(m.name));   // matA・matB・matC が 1 つずつ
  const built = buildScene(data);
  const batches = new MeshBatches(built);
  assert.equal(batches.batches.length, 0);
  for (const e of built.meshes) assert.equal(e.staticMesh.layers.mask, 1);
});
