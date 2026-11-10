// Maya と同じ視点の操作（mayaControls.js）・矩形選択と修飾キー（marquee.js）・複数選択をハンドルで動かす計算（propagatePoseDelta）
import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix4, OrthographicCamera, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import {
  combineSelection, makeProjector, normRect, pointHitsRect, pointInTriangle, pointSegmentDistance, polylineHitsRect,
  segmentHitsRect, segmentsDistance, segmentsHitRect, selectionModeOf, trianglesHitRect,
} from '../src/marquee.js';
import { ControlOverlay } from '../src/controlOverlay.js';
import { Object3D, Ray } from 'three';
import { MayaControls, buttonBit, dolly, dollyAmount, dollyScale, navModeOf, track, tumble, wheelScale, worldPerPixel } from '../src/mayaControls.js';
import { poseFromTransform, poseMatrix, poseQuaternion, propagatePoseDelta } from '../src/pose.js';

const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const nearV = (a, b, tol = 1e-9) => a.distanceTo(b) <= tol;

// ---------------------------------------------------------------- 修飾キー
test('修飾キー: なし = 選び直す、Shift = 切り替え、Ctrl = 外す、Ctrl+Shift = 加える（Mac の Command は Ctrl）', () => {
  assert.equal(selectionModeOf({}), 'replace');
  assert.equal(selectionModeOf({ shiftKey: true }), 'toggle');
  assert.equal(selectionModeOf({ ctrlKey: true }), 'remove');
  assert.equal(selectionModeOf({ metaKey: true }), 'remove');
  assert.equal(selectionModeOf({ ctrlKey: true, shiftKey: true }), 'add');
});

test('選択の組み合わせ: 最後がリード', () => {
  assert.deepEqual(combineSelection([1, 2], [5, 3, 5], 'replace'), [5, 3]);
  assert.deepEqual(combineSelection([1, 2], [], 'replace'), []);              // 何もないところ: 解除
  assert.deepEqual(combineSelection([1, 2, 3], [2, 4], 'toggle'), [1, 3, 4]);  // 2 は外れ、4 が加わってリード
  assert.deepEqual(combineSelection([1, 2, 3], [2, 9], 'remove'), [1, 3]);
  assert.deepEqual(combineSelection([1, 2, 3], [2, 4], 'add'), [1, 3, 2, 4]); // 選び直したものはリードの側へ
  assert.deepEqual(combineSelection([1, 2], [], 'toggle'), [1, 2]);
  assert.deepEqual(combineSelection([], [7], 'remove'), []);
});

// ---------------------------------------------------------------- 矩形と図形
test('矩形と点・線分・三角形', () => {
  const r = normRect(30, 40, 10, 20);
  assert.deepEqual(r, { left: 10, top: 20, right: 30, bottom: 40 });
  assert.ok(segmentHitsRect(0, 30, 50, 30, r));          // 端点は外、矩形を横切る
  assert.ok(segmentHitsRect(15, 25, 100, 100, r));       // 端点が中
  assert.ok(!segmentHitsRect(0, 0, 50, 5, r));           // 上を通る
  assert.ok(!segmentHitsRect(0, 0, 9, 100, r));          // 左を通る
  assert.ok(segmentHitsRect(0, 60, 40, 0, r));           // 斜めに横切る
  assert.ok(pointInTriangle(1, 1, 0, 0, 10, 0, 0, 10));
  assert.ok(pointInTriangle(1, 1, 0, 0, 0, 10, 10, 0));  // 向きは問わない
  assert.ok(!pointInTriangle(9, 9, 0, 0, 10, 0, 0, 10));
});

/** 原点から +Z 方向に 10 離れて原点を見るカメラ（200 × 100 ピクセル） */
function frontCamera() {
  const cam = new PerspectiveCamera(60, 2, 0.1, 1000);
  cam.position.set(0, 0, 10);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld();
  return makeProjector(cam, 200, 100);
}

test('投影: 原点は画面の中央、カメラの後ろは front = false', () => {
  const project = frontCamera();
  const p = project(0, 0, 0);
  assert.ok(near(p.x, 100, 1e-6) && near(p.y, 50, 1e-6) && p.front);
  assert.ok(project(0, 1, 0).y < 50);                    // 上は画面の上（y が小さい）
  assert.equal(project(0, 0, 20).front, false);
  assert.ok(pointHitsRect(0, 0, 0, project, normRect(90, 40, 110, 60)));
  assert.ok(!pointHitsRect(0, 0, 20, project, normRect(0, 0, 200, 100)));
});

test('三角形の集まり: 頂点が中・辺が横切る・矩形が面の中、のどれでも当たる', () => {
  const project = frontCamera();
  // 画面いっぱいより大きい 1 枚の四角（2 つの三角形）
  const big = [-50, -50, 0, 50, -50, 0, 50, 50, 0, -50, 50, 0];
  const quad = [0, 1, 2, 0, 2, 3];
  assert.ok(trianglesHitRect(big, quad, project, normRect(95, 45, 105, 55)));     // 矩形が面の中（頂点も辺も入らない）
  // 小さい三角形: 中央の矩形から外れる
  const small = [3, 3, 0, 4, 3, 0, 3, 4, 0];
  assert.ok(!trianglesHitRect(small, null, project, normRect(95, 45, 105, 55)));
  assert.ok(trianglesHitRect(small, null, project, normRect(0, 0, 200, 100)));    // 全体を囲む
  // 細長い三角形の辺だけが矩形を横切る
  const thin = [-6, 0, 0, 6, 0.01, 0, 6, -0.01, 0];
  assert.ok(trianglesHitRect(thin, null, project, normRect(95, 45, 105, 55)));
  // カメラの後ろだけにある三角形は当たらない
  const behind = [-1, -1, 20, 1, -1, 20, 0, 1, 20];
  assert.ok(!trianglesHitRect(behind, null, project, normRect(0, 0, 200, 100)));
});

test('折れ線: 線が矩形を横切れば当たる', () => {
  const project = frontCamera();
  const line = [-5, 0, 0, 5, 0, 0];                      // 画面の中央を横切る（端点は矩形の外）
  assert.ok(polylineHitsRect(line, project, normRect(95, 45, 105, 55)));
  assert.ok(!polylineHitsRect(line, project, normRect(95, 0, 105, 10)));
});

// ---------------------------------------------------------------- 視点の操作
test('マウスのボタン: Alt+左 = タンブル、中 = トラック、右・左+中 = ドリー', () => {
  assert.equal(navModeOf(buttonBit(0)), 'tumble');
  assert.equal(navModeOf(buttonBit(1)), 'track');
  assert.equal(navModeOf(buttonBit(2)), 'dolly');
  assert.equal(navModeOf(1 | 4), 'dolly');
  assert.equal(navModeOf(0), null);
  assert.ok(dollyAmount(10, 0) > 0 && dollyAmount(0, 10) > 0 && dollyAmount(-10, 0) < 0);   // 右・下へで近づく
  assert.ok(dollyScale(100) < 1 && dollyScale(-100) > 1);
  assert.ok(wheelScale(-100) < 1 && wheelScale(100) > 1 && wheelScale(0) === 1);           // 奥へ回すと近づく
});

function freeCamera() {
  const cam = new PerspectiveCamera(45, 1.5, 0.1, 1000);
  cam.position.set(10, 5, 10);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld();
  return cam;
}
const fwdOf = (cam) => new Vector3(0, 0, -1).applyQuaternion(cam.quaternion);

test('タンブル: 注視点までの距離を保ち、注視点を見続ける。横はワールドの Y 軸まわり', () => {
  const cam = freeCamera(), target = new Vector3();
  const d0 = cam.position.distanceTo(target), y0 = cam.position.y;
  tumble(cam, target, 0.7, 0);
  assert.ok(near(cam.position.distanceTo(target), d0, 1e-9));
  assert.ok(near(cam.position.y, y0, 1e-9));                         // 横だけなら高さは変わらない
  assert.ok(nearV(fwdOf(cam), target.clone().sub(cam.position).normalize(), 1e-9));
  tumble(cam, target, 0, -0.4);                                      // 縦（上へ回り込む）
  assert.ok(cam.position.y > y0);
  assert.ok(near(cam.position.distanceTo(target), d0, 1e-9));
  assert.ok(nearV(fwdOf(cam), target.clone().sub(cam.position).normalize(), 1e-9));
  // 真上を越えて回れる（Maya と同じ。止まらない）
  for (let i = 0; i < 10; i++) tumble(cam, target, 0, -0.3);
  assert.ok(nearV(fwdOf(cam), target.clone().sub(cam.position).normalize(), 1e-9));
  const up = new Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
  assert.ok(up.y < 0, '逆さま');
});

test('トラック: カメラと注視点が一緒に動き、注視点は画面上でマウスについてくる', () => {
  const cam = freeCamera(), target = new Vector3();
  const per = worldPerPixel(cam, target, 600);
  const before = target.clone();
  track(cam, target, 30, -20, per);
  cam.updateMatrixWorld();
  const project = makeProjector(cam, 900, 600);
  const p = project(before.x, before.y, before.z);
  assert.ok(near(p.x, 450 + 30, 1e-6) && near(p.y, 300 - 20, 1e-6), `${p.x}, ${p.y}`);
  assert.ok(nearV(fwdOf(cam), target.clone().sub(cam.position).normalize(), 1e-9));
});

test('ドリー: 注視点に近づく（越えない）。平行投影はズーム', () => {
  const cam = freeCamera(), target = new Vector3();
  const d0 = cam.position.distanceTo(target);
  dolly(cam, target, 0.5);
  assert.ok(near(cam.position.distanceTo(target), d0 * 0.5, 1e-9));
  dolly(cam, target, 1e-12, 1e-3);
  assert.ok(near(cam.position.distanceTo(target), 1e-3, 1e-12));
  const o = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  dolly(o, target, 0.5);
  assert.equal(o.zoom, 2);
});

/** テスト用のポインターイベントを受ける要素 */
function fakeElement() {
  const handlers = {};
  return {
    clientHeight: 500,
    addEventListener: (t, f) => { (handlers[t] ||= []).push(f); },
    removeEventListener: () => {},
    setPointerCapture: () => {}, hasPointerCapture: () => false, releasePointerCapture: () => {},
    fire: (t, e) => (handlers[t] || []).forEach((f) => f({ preventDefault() {}, pointerId: 1, ...e, type: t })),
  };
}

test('MayaControls: Alt なしのドラッグでは動かない。Alt+左で回り、離すと止まる', () => {
  const el = fakeElement();
  const cam = freeCamera();
  const c = new MayaControls(cam, el);
  const events = [];
  for (const t of ['start', 'change', 'end']) c.addEventListener(t, () => events.push(t));
  const p0 = cam.position.clone();
  el.fire('pointerdown', { button: 0, buttons: 1, clientX: 100, clientY: 100, altKey: false });
  el.fire('pointermove', { buttons: 1, clientX: 160, clientY: 100 });
  el.fire('pointerup', { button: 0, buttons: 0, clientX: 160, clientY: 100 });
  assert.ok(nearV(cam.position, p0), 'Alt なしは矩形選択（視点は動かない）');
  assert.deepEqual(events, []);
  el.fire('pointerdown', { button: 0, buttons: 1, clientX: 100, clientY: 100, altKey: true });
  assert.ok(c.dragging);
  el.fire('pointermove', { buttons: 1, clientX: 160, clientY: 100, altKey: true });
  el.fire('pointerup', { button: 0, buttons: 0, clientX: 160, clientY: 100 });
  assert.ok(!c.dragging);
  assert.ok(!nearV(cam.position, p0));
  assert.ok(near(cam.position.distanceTo(c.target), p0.length(), 1e-9));
  assert.deepEqual(events, ['start', 'change', 'end']);
  // 無効のときは Alt でも動かない（再生中のカメラなど）
  c.enabled = false;
  const p1 = cam.position.clone();
  el.fire('pointerdown', { button: 0, buttons: 1, clientX: 100, clientY: 100, altKey: true });
  el.fire('pointermove', { buttons: 1, clientX: 200, clientY: 100, altKey: true });
  assert.ok(nearV(cam.position, p1));
});

test('MayaControls: Alt+左のまま中を足すとドリー、Shift で横だけに制限', () => {
  const el = fakeElement();
  const cam = freeCamera();
  const c = new MayaControls(cam, el);
  const d0 = cam.position.distanceTo(c.target);
  el.fire('pointerdown', { button: 0, buttons: 1, clientX: 100, clientY: 100, altKey: true });
  el.fire('pointermove', { buttons: 1 | 4, clientX: 150, clientY: 100, altKey: true });   // 左 + 中 → ドリー（右へ = 近づく）
  assert.ok(cam.position.distanceTo(c.target) < d0);
  el.fire('pointerup', { button: 0, buttons: 0, clientX: 150, clientY: 100 });
  // Shift+Alt+中: 最初に横へ動かしたら、縦の動きは無視する
  const y0 = cam.position.clone().sub(c.target);
  el.fire('pointerdown', { button: 1, buttons: 4, clientX: 100, clientY: 100, altKey: true, shiftKey: true });
  el.fire('pointermove', { buttons: 4, clientX: 110, clientY: 101, altKey: true });
  const t1 = c.target.clone();
  el.fire('pointermove', { buttons: 4, clientX: 110, clientY: 160, altKey: true });     // 縦だけの動き → 動かない
  assert.ok(nearV(c.target, t1, 1e-12));
  el.fire('pointerup', { button: 1, buttons: 0, clientX: 110, clientY: 160 });
  assert.ok(nearV(cam.position.clone().sub(c.target), y0, 1e-9), 'トラックはカメラと注視点を一緒に動かす');
});

test('MayaControls: ホイールは Alt なしで近づく', () => {
  const el = fakeElement();
  const cam = freeCamera();
  const c = new MayaControls(cam, el);
  const d0 = cam.position.distanceTo(c.target);
  el.fire('wheel', { deltaY: -100, deltaMode: 0 });
  assert.ok(cam.position.distanceTo(c.target) < d0);
});

// ---------------------------------------------------------------- 複数選択をハンドルで動かす
const world = (frame, p) => frame.clone().multiply(poseMatrix(p, new Matrix4()));
const posOf = (m) => new Vector3().setFromMatrixPosition(m);
const rotOf = (m) => { const q = new Quaternion(); m.decompose(new Vector3(), q, new Vector3()); return q; };
const sameQ = (a, b, tol = 1e-9) => near(Math.abs(a.dot(b)), 1, tol);

const leadFrame = new Matrix4().compose(new Vector3(1, 2, 3), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), 0.6), new Vector3(1, 1, 1));
const otherFrame = new Matrix4().compose(new Vector3(-4, 0, 2), new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -1.1), new Vector3(2, 2, 2));
const leadStart = { t: [0.5, 0, 0], r: [10, 0, 5], s: [1, 1, 1] };
const otherStart = { t: [0, 1, 0], r: [0, 30, 0], s: [1, 2, 1] };

test('複数選択の移動（ワールド）: ほかのノードもワールドで同じだけ動く', () => {
  const leadNow = { ...leadStart, t: [1.5, -0.5, 2] };
  const moved = posOf(world(leadFrame, leadNow)).sub(posOf(world(leadFrame, leadStart)));
  const p = propagatePoseDelta('translate', true, leadStart, leadNow, leadFrame, otherStart, otherFrame);
  const got = posOf(world(otherFrame, p)).sub(posOf(world(otherFrame, otherStart)));
  assert.ok(nearV(got, moved, 1e-9), `${got.toArray()} / ${moved.toArray()}`);
});

test('複数選択の移動（ローカル）: リードの軸での量を、それぞれの軸で', () => {
  const qs = poseQuaternion(leadStart);
  const along = new Vector3(0, 0, 2);                                  // リードの自分の Z 軸に 2
  const leadNow = { ...leadStart, t: new Vector3().fromArray(leadStart.t).add(along.clone().applyQuaternion(qs)).toArray() };
  const p = propagatePoseDelta('translate', false, leadStart, leadNow, leadFrame, otherStart, otherFrame);
  const qi = poseQuaternion(otherStart);
  const d = new Vector3().fromArray(p.t).sub(new Vector3().fromArray(otherStart.t));
  assert.ok(nearV(d, along.clone().applyQuaternion(qi), 1e-9));
});

test('複数選択の回転（ワールド）: ほかのノードもワールドで同じ回転', () => {
  const rw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.8);   // ワールドの Y まわり
  // リードのワールドの向きに rw を掛けた姿勢を作る
  const fl = rotOf(leadFrame);
  const wl = fl.clone().multiply(poseQuaternion(leadStart));
  const qn = fl.clone().invert().multiply(rw.clone().multiply(wl));
  const leadNow = { ...leadStart, r: poseFromTransform(new Vector3(), qn, new Vector3(1, 1, 1)).r };
  const p = propagatePoseDelta('rotate', true, leadStart, leadNow, leadFrame, otherStart, otherFrame);
  const before = rotOf(world(otherFrame, otherStart)), after = rotOf(world(otherFrame, p));
  assert.ok(sameQ(after, rw.clone().multiply(before), 1e-9));
  assert.ok(nearV(posOf(world(otherFrame, p)), posOf(world(otherFrame, otherStart)), 1e-9), 'ピボットは動かない');
});

test('複数選択の回転（ローカル）とスケール: それぞれの軸で同じだけ', () => {
  const d = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 0.5);
  const qn = poseQuaternion(leadStart).multiply(d);
  const leadNow = { ...leadStart, r: poseFromTransform(new Vector3(), qn, new Vector3(1, 1, 1)).r };
  const p = propagatePoseDelta('rotate', false, leadStart, leadNow, leadFrame, otherStart, otherFrame);
  assert.ok(sameQ(poseQuaternion(p), poseQuaternion(otherStart).multiply(d), 1e-9));
  const s = propagatePoseDelta('scale', false, leadStart, { ...leadStart, s: [2, 1, 0.5] }, leadFrame, otherStart, otherFrame);
  assert.deepEqual(s.s, [2, 2, 0.5]);
  assert.deepEqual(s.t, otherStart.t);
});

// ---------------------------------------------------------------- コントローラーの目印の選択（線に触れれば選ぶ）
test('点と線分の距離（ピクセル）', () => {
  assert.ok(near(pointSegmentDistance(5, 3, 0, 0, 10, 0), 3));
  assert.ok(near(pointSegmentDistance(-4, 3, 0, 0, 10, 0), 5));    // 端点の外: 端点までの距離
  assert.ok(near(pointSegmentDistance(2, 2, 1, 1, 1, 1), Math.SQRT2)); // 長さ 0
});

// 正面から見る正射影のカメラ（1 ワールド単位 = 10 ピクセル、原点が画面の中央 (100, 100)）
function orthoFront() {
  const cam = new OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
  cam.position.set(0, 0, 50);
  cam.updateMatrixWorld();
  return cam;
}

test('線分の集まり: 画面上の距離と矩形', () => {
  const project = makeProjector(orthoFront(), 200, 200);
  const cross = [-2, 0, 0, 2, 0, 0, 0, -2, 0, 0, 2, 0];   // 十字（腕の長さ 2 = 20 ピクセル）
  assert.ok(near(segmentsDistance(cross, 0, 4, project, 118, 102), 2, 1e-6));   // 腕の先の近く
  assert.ok(near(segmentsDistance(cross, 0, 4, project, 110, 110), 10, 1e-6));  // 腕の間（線から 10 ピクセル）
  assert.ok(segmentsHitRect(cross, 0, 4, project, normRect(115, 95, 130, 105)));   // 腕の先だけがかかる
  assert.ok(!segmentsHitRect(cross, 0, 4, project, normRect(105, 105, 130, 130))); // 腕の間
  assert.equal(segmentsDistance(cross, 2, 2, project, 118, 102), 18);              // 範囲（縦の線だけ）
});

function overlayWith(role, ni = 0) {
  const ov = new ControlOverlay();
  const obj = new Object3D();
  obj.updateMatrixWorld();
  const ctx = {
    nodes: [{ name: 'ctrl', type: 'transform' }], objs: [obj],
    boneLen: () => 1, nearestJoint: () => -1, medianBone: 1, charRadius: 1,
  };
  ov.build([ni], new Map([[ni, { role }]]), ctx);
  ov.setScale(20);                                     // 半径 4.8（画面で 48 ピクセル）
  ov.update({ selectColorOf: () => null, isHidden: () => false, statusColor: () => null });
  return ov;
}

test('コントローラーの目印: Maya と同じく線のどこかに触れれば選ぶ（中心から離れた腕の先でも）', () => {
  const ov = overlayWith('locator');
  const size = ov.items[0].size;                       // 目印の半径（ワールド）。十字の腕は半径の 1.2 倍
  const cam = orthoFront();
  const project = makeProjector(cam, 200, 200);
  const ray = new Ray(new Vector3(0, 0, 50), new Vector3(0, 0, -1));
  const tip = 100 + size * 1.15 * 10;                  // 腕の先の近く（半径の外）
  assert.ok(size * 1.15 > size * 1.05);
  assert.equal(ov.pick(ray, project, tip, 101), 0);
  assert.equal(ov.pick(ray, project, 100 + size * 6, 100 + size * 6), -1);   // 腕の間（線から離れたところ）は選ばない
  assert.equal(ov.pick(ray, project, 100, 100 - size * 12 - 3), 0);          // 縦の腕の先から 3 ピクセル
  assert.equal(ov.pick(ray, project, 100, 100 - size * 12 - 8), -1);         // 8 ピクセル離れると選ばない
  assert.deepEqual(ov.inRect(project, normRect(tip - 2, 95, tip + 20, 105)), [0]);
  assert.deepEqual(ov.inRect(project, normRect(150, 150, 190, 190)), []);
});
