// スキン付きメッシュのクリックの選択（skinPick.js）が、three.js の標準のレイキャストと同じ当たりを返すこと
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BackSide, DoubleSide, FrontSide, Matrix4, MeshBasicMaterial, Quaternion, Raycaster, Vector3 } from 'three';
import { buildScene, renderVertexWorldPosition } from '../src/sceneBuilder.js';
import { deformedPositions, intersectNearest, raycastSkinnedNearest, skinnedWorldPositions } from '../src/skinPick.js';

const load = (name) => buildScene(JSON.parse(readFileSync(new URL(`../../samples/${name}`, import.meta.url), 'utf8')));

/** 骨を回して、姿勢を変える */
function pose(built, seed = 1) {
  let r = seed;
  const rnd = () => { r = (r * 16807) % 2147483647; return r / 2147483647 - 0.5; };
  for (const ji of built.jointIndices) {
    const o = built.nodeObjects[ji];
    const q = new Quaternion().setFromAxisAngle(new Vector3(rnd(), rnd(), rnd()).normalize(), rnd() * 1.2);
    o.matrix.multiply(new Matrix4().makeRotationFromQuaternion(q));
  }
  built.root.updateMatrixWorld(true);
  for (const e of built.meshes) if (e.skinned) { e.skinned.boundingSphere = null; e.skinned.boundingBox = null; }
}

/** メッシュの範囲を、いくつかの向きから格子状に通る光線 */
function* rays(built, n = 9) {
  const box = { min: new Vector3(Infinity, Infinity, Infinity), max: new Vector3(-Infinity, -Infinity, -Infinity) };
  const v = new Vector3();
  for (const e of built.meshes) {
    if (!e.skinned) continue;
    for (let i = 0; i < e.geometry.attributes.position.count; i++) {
      renderVertexWorldPosition(e, i, true, v);
      box.min.min(v); box.max.max(v);
    }
  }
  const c = box.min.clone().add(box.max).multiplyScalar(0.5);
  const size = box.max.clone().sub(box.min).length();
  const dirs = [[0, 0, -1], [0, 0, 1], [1, 0, 0], [-1, 0, 0], [0, -1, 0], [0.3, -0.5, -0.8], [-0.7, 0.2, 0.4]];
  for (const d of dirs) {
    const dir = new Vector3(...d).normalize();
    const u = new Vector3(0, 1, 0).cross(dir);
    if (u.lengthSq() < 1e-6) u.set(1, 0, 0).cross(dir);
    u.normalize();
    const w = dir.clone().cross(u).normalize();
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const a = (i / (n - 1) - 0.5) * size * 0.9, b = (j / (n - 1) - 0.5) * size * 0.9;
      const origin = c.clone().addScaledVector(dir, -size * 2).addScaledVector(u, a).addScaledVector(w, b);
      yield new Raycaster(origin, dir);
    }
  }
}

/** 標準（three.js）と新しい方法の当たりが同じこと。当たった数を返す */
function compare(built, targetsOf = (b) => b.meshes.filter((e) => e.skinned).map((e) => e.skinned)) {
  const targets = targetsOf(built);
  const entry = new Map(built.meshes.filter((e) => e.skinned).map((e) => [e.skinned, e]));
  let hit = 0, miss = 0;
  for (const rc of rays(built)) {
    const std = rc.intersectObjects(targets, false)[0] || null;
    const mine = intersectNearest(rc, targets, (o) => entry.get(o));
    // 失敗したときにメッシュのオブジェクト全体を表示しないよう、番号と数値だけを比べる
    if (!std) { assert.ok(mine === null, `当たらないはずの光線が当たった（距離 ${mine && mine.distance}）`); miss++; continue; }
    hit++;
    assert.ok(mine, '当たるはずの光線が当たらない');
    assert.equal(mine.object.userData.meshIndex, std.object.userData.meshIndex);
    assert.ok(mine.object === std.object);
    assert.equal(mine.faceIndex, std.faceIndex);
    assert.equal(mine.distance, std.distance);
    assert.deepEqual([mine.face.a, mine.face.b, mine.face.c], [std.face.a, std.face.b, std.face.c]);
    assert.ok(mine.point.equals(std.point));
  }
  return { hit, miss };
}

test('変形した位置: applyBoneTransform8（頂点ごと）とビット単位で同じ。骨・ウェイトを変えると作り直す', () => {
  const built = load('shared_skin_sample.json');
  pose(built, 3);
  const v = new Vector3();
  for (const e of built.meshes.filter((x) => x.skinned)) {
    const c = deformedPositions(e);
    assert.ok(c);
    const n = e.geometry.attributes.position.count;
    for (let i = 0; i < n; i++) {
      v.fromBufferAttribute(e.geometry.attributes.position, i);
      e.skinned.applyBoneTransform(i, v);
      assert.deepEqual([c.positions[i * 3], c.positions[i * 3 + 1], c.positions[i * 3 + 2]], [v.x, v.y, v.z]);
    }
    assert.ok(deformedPositions(e) === c, '姿勢が同じなら使い回す');
    // 矩形選択のワールドの位置も、頂点ごとに求めたものと同じ
    const w = new Float32Array(n * 3), ref = new Float32Array(n * 3);
    skinnedWorldPositions(e, e.skinned.matrixWorld, w);
    for (let i = 0; i < n; i++) { renderVertexWorldPosition(e, i, true, v); ref[i * 3] = v.x; ref[i * 3 + 1] = v.y; ref[i * 3 + 2] = v.z; }
    assert.deepEqual(w, ref);
  }
  const e = built.meshes.find((x) => x.skinned);
  const c = deformedPositions(e);
  pose(built, 5);
  const c2 = deformedPositions(e);
  assert.ok(c2 !== c, '骨が動いたら作り直す');
  const sw = e.geometry.attributes.skinWeight;
  sw.needsUpdate = true;                                  // ウェイトを変えた（version が上がる）
  assert.ok(deformedPositions(e) !== c2, 'ウェイトが変わったら作り直す');
});

test('当たり: 標準のレイキャストと同じ（メッシュ・三角形・距離・点）。姿勢を変えたあと・当たらない光線も', () => {
  for (const name of ['sample_arm.json', 'shared_skin_sample.json', 'select_sample.json']) {
    const built = load(name);
    const r0 = compare(built);
    assert.ok(r0.hit > 20 && r0.miss > 5, `${name}: ${JSON.stringify(r0)}`);
    pose(built, 7);
    const r1 = compare(built);
    assert.ok(r1.hit > 20, `${name}: ${JSON.stringify(r1)}`);
    pose(built, 11);
    compare(built);                                       // 前の姿勢の変形を使い回さない
  }
});

test('当たり: 面の向き（表・裏・両面）・材質の配列（グループごと）・near / far も標準と同じ', () => {
  const built = load('shared_skin_sample.json');
  pose(built, 13);
  const skinned = built.meshes.filter((e) => e.skinned);
  for (const side of [FrontSide, BackSide, DoubleSide]) {
    for (const e of skinned) { e.skinned.material = e.skinned.material.clone(); e.skinned.material.side = side; }
    assert.ok(compare(built).hit > 0);
  }
  // 材質の配列: 三角形の前半は裏、後半は両面。描く範囲（drawRange）も狭める
  const e = skinned[0];
  const g = e.geometry, cnt = g.index.count;
  const half = Math.floor(cnt / 6) * 3;
  g.clearGroups();
  g.addGroup(0, half, 0);
  g.addGroup(half, cnt - half, 1);
  e.skinned.material = [new MeshBasicMaterial({ side: BackSide }), new MeshBasicMaterial({ side: DoubleSide })];
  compare(built);
  g.setDrawRange(3, cnt - 9);
  compare(built);
  // near / far: 光線の始点から離して、手前の当たりを除く
  const entry = new Map(skinned.map((x) => [x.skinned, x]));
  const targets = skinned.map((x) => x.skinned);
  let checked = 0;
  for (const rc of rays(built, 7)) {
    const first = rc.intersectObjects(targets, false)[0];
    if (!first) continue;
    rc.near = first.distance + 1e-6;
    rc.far = first.distance + 50;
    const std = rc.intersectObjects(targets, false)[0] || null;
    const mine = intersectNearest(rc, targets, (o) => entry.get(o));
    if (!std) { assert.ok(mine === null); continue; }
    assert.equal(mine.distance, std.distance);
    assert.equal(mine.faceIndex, std.faceIndex);
    checked++;
  }
  assert.ok(checked > 0);
});

test('当たり: メッシュの拡大縮小があっても、距離はワールドで比べる（スキンなしのメッシュとまぜても標準と同じ）', () => {
  const built = load('shared_skin_sample.json');
  const e = built.meshes.find((x) => x.skinned);
  e.skinned.matrix.makeScale(2, 0.5, 1.5);               // メッシュのワールド行列に拡大縮小を入れる
  e.skinned.matrixWorld.copy(e.skinned.parent.matrixWorld).multiply(e.skinned.matrix);
  pose(built, 17);
  e.skinned.matrixWorld.copy(e.skinned.parent.matrixWorld).multiply(e.skinned.matrix);
  compare(built, (b) => b.meshes.map((x) => x.skinned || x.staticMesh).filter(Boolean));
});

test('範囲で外す: 光線がメッシュの範囲を通らなければ、変形せずに外す', () => {
  const built = load('sample_arm.json');
  const e = built.meshes.find((x) => x.skinned);
  pose(built, 19);
  e.deformCache = null;
  const rc = new Raycaster(new Vector3(1e4, 1e4, 1e4), new Vector3(0, 1, 0));
  assert.ok(raycastSkinnedNearest(e, rc) === null);
  assert.ok(e.deformCache === null, '外れる光線では変形しない（skinCull の範囲で外す）');
});
