// リグで切り替える表示（animation.props の .v など）と、シーンのカメラの投影の検証
// 前提: python tools/make_vis_camera_sample.py（samples/vis_camera_sample.json を作る）
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator, visibleFrom } from '../src/rig.js';
import { cameraFrustum, cameraParams } from '../src/cameraView.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.resolve(here, '../../samples/vis_camera_sample.json'), 'utf8'));
const names = data.nodes.map((n) => n.name);
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

/** フレーム f の表示: { ノード名・メッシュ名: 表示されるか }（リグで決まるものだけ） */
function visibilityAt(f) {
  const rig = new RigEvaluator(new AnimationClip(data.animation), data.nodes, (ni) => new Matrix4().fromArray(data.nodes[ni].matrix));
  rig.evaluate(f);
  const out = {};
  for (const p of rig.evaluateProps()) {
    const name = p.kind === 'node' ? names[p.index] : p.kind === 'mesh' ? data.meshes[p.index].name : data.cameras[p.index].name;
    out[name] = p.kind === 'camera' ? p.values : visibleFrom({ ...p.static, ...p.values });
  }
  return out;
}

test('表示の判定（.v・.lodv・描画のオーバーライド）', () => {
  assert.equal(visibleFrom({}), true);
  assert.equal(visibleFrom({ v: 0 }), false);
  assert.equal(visibleFrom({ lodv: 0 }), false);
  assert.equal(visibleFrom({ ove: 1, ovv: 0 }), false);
  assert.equal(visibleFrom({ ove: 0, ovv: 0 }), true);       // オーバーライドが無効なら ovv は効かない
});

test('コントローラーの独自の属性で決まる表示を、フレームごとに評価する', () => {
  const f1 = visibilityAt(1), f12 = visibilityAt(12), f24 = visibilityAt(24);
  // vis_ctrl.geoVis（no）→ box.v: 常に非表示
  assert.equal(f1.box, false);
  assert.equal(f24.box, false);
  // geoVis → reverse → arm_geoShape.lodv: 1 − 0 = 1 で表示
  assert.equal(f1.arm_geoShape, true);
  // vis_ctrl.proxyVis（キー: 1 → 1、12 → 0、ステップ）→ arm_geo.v
  assert.equal(f1.arm_geo, true);
  assert.equal(visibilityAt(11).arm_geo, true);
  assert.equal(f12.arm_geo, false);
  assert.equal(f24.arm_geo, false);
});

test('カメラの焦点距離のキーを評価する', () => {
  assert.ok(near(visibilityAt(1).shot_cam.fl, 35, 1e-4));
  assert.ok(near(visibilityAt(24).shot_cam.fl, 85, 1e-4));
});

test('透視投影: フィルムフィット水平なら、解像度ゲートの幅がフィルムの幅（水平の画角 = 2·atan(hfa·25.4/2/fl)）', () => {
  const cam = data.cameras.find((c) => c.name === 'shot_cam');
  const p = cameraParams(cam, { fl: 50 });
  const W = 1600, H = 900;
  const fr = cameraFrustum(p, W, H, 16 / 9, 1);                // 余白なし・ビューポートとゲートが同じ縦横比
  const halfTan = (fr.right - fr.left) / 2 / fr.near;
  assert.ok(near(halfTan, (cam.horizontalFilmAperture * 25.4 / 2) / 50, 1e-9));
  assert.ok(near(fr.gate.w, W, 1e-6) && near(fr.gate.h, H, 1e-6));
  // 縦横比はレンダーの解像度（16:9）。フィルム（3:2）より横長なので、上下が切れる
  assert.ok(near((fr.top - fr.bottom) / (fr.right - fr.left), 9 / 16, 1e-9));
});

test('フィルムフィット: 垂直・フィル・オーバースキャン', () => {
  const base = { focalLength: 35, horizontalFilmAperture: 1.5, verticalFilmAperture: 1, filmFit: 2,
    nearClipPlane: 1, farClipPlane: 1000, orthographicWidth: 30, lensSqueezeRatio: 1, cameraScale: 1,
    horizontalFilmOffset: 0, verticalFilmOffset: 0, orthographic: false };
  const vTan = (cam, ra) => { const fr = cameraFrustum(cameraParams(cam), 1000, 1000 / ra, ra, 1); return (fr.top - fr.bottom) / 2 / fr.near; };
  const tanV = (1 * 25.4 / 2) / 35, tanH = (1.5 * 25.4 / 2) / 35;
  assert.ok(near(vTan(base, 2), tanV, 1e-9));                            // 垂直: ゲートの高さ = フィルムの高さ
  assert.ok(near(vTan({ ...base, filmFit: 0 }, 2), tanH / 2, 1e-9));     // フィル: 横長のゲートは幅をフィルムに合わせる
  assert.ok(near(vTan({ ...base, filmFit: 3 }, 2), tanV, 1e-9));         // オーバースキャン: フィルムがゲートの内側
  assert.ok(near(vTan({ ...base, filmFit: 0 }, 1), tanV, 1e-9));         // フィル: 縦長寄りのゲートは高さを合わせる
});

test('平行投影: orthographicWidth がゲートの幅', () => {
  const cam = data.cameras.find((c) => c.name === 'ortho_cam');
  const fr = cameraFrustum(cameraParams(cam), 1920, 1080, 16 / 9, 1);
  assert.equal(fr.ortho, true);
  assert.ok(near(fr.right - fr.left, 40, 1e-9));
  assert.ok(near(fr.top - fr.bottom, 40 * 9 / 16, 1e-9));
});

test('ビューポートが横長なら、ゲートを高さに合わせて左右に余白を作る', () => {
  const cam = data.cameras.find((c) => c.name === 'shot_cam');
  const fr = cameraFrustum(cameraParams(cam), 2000, 500, 16 / 9, 1);
  assert.ok(near(fr.gate.h, 500, 1e-6));
  assert.ok(near(fr.gate.w, 500 * 16 / 9, 1e-6));
  assert.ok(near(fr.gate.x, (2000 - 500 * 16 / 9) / 2, 1e-6));
});

test('上下に重なる表示（タイムラインなど）があれば、ゲートはその内側に収め、投影は画面全体に広げる', () => {
  const cam = data.cameras.find((c) => c.name === 'shot_cam');
  const p = cameraParams(cam);
  const W = 2000, H = 600, inset = { top: 30, bottom: 40 };
  const fr = cameraFrustum(p, W, H, 16 / 9, 1.06, inset);
  // ゲートは上端 30px・下端 40px を避けた範囲（高さ 530px）の中央
  assert.ok(near(fr.gate.h, 530 / 1.06, 1e-6));
  assert.ok(near(fr.gate.y - 30, 600 - 40 - (fr.gate.y + fr.gate.h), 1e-6));
  assert.ok(fr.gate.y >= 30 && fr.gate.y + fr.gate.h <= H - 40);
  assert.ok(near(fr.gate.w / fr.gate.h, 16 / 9, 1e-9));
  // 投影の上下の範囲を画面のピクセルに割り振ると、ゲートの上端・下端がフィルム上のゲートの上下の端（縦の中心から ±半分）に一致する
  const at = (y) => fr.top - (y / H) * (fr.top - fr.bottom);
  const center = (at(fr.gate.y) + at(fr.gate.y + fr.gate.h)) / 2;
  assert.ok(near(center, 0, 1e-9));                                      // フィルムオフセットなし: ゲートの中心が視線
  const plain = cameraFrustum(p, W, 530, 16 / 9, 1.06);                  // 重なりのない 530px のビューポートと同じ写り方
  assert.ok(near(at(fr.gate.y), plain.top - (plain.gate.y / 530) * (plain.top - plain.bottom), 1e-9));
  assert.ok(near(fr.right - fr.left, plain.right - plain.left, 1e-9));
});
