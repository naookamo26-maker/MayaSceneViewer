// Maya と同じ視点の操作（Alt + マウス）。three.js の OrbitControls の代わりに使う。
//   Alt + 左ドラッグ           タンブル（注視点のまわりを回る。横はワールドの Y 軸、縦は視点の横軸のまわり。真上を越えて回れる）
//   Alt + 中ドラッグ           トラック（画面と平行に動かす。注視点も一緒に動く）
//   Alt + 右ドラッグ           ドリー（注視点に近づく・離れる。右・下へで近づく）
//   Alt + 左 + 中ドラッグ      ドリー（Maya と同じ）
//   ホイール                   ドリー（Alt なしで使える）
//   Shift を押しながら始める    タンブル・トラックを最初に動かした向き（横か縦）だけに制限する
// Alt を押さないドラッグは、このクラスでは扱わない（ビューアでは矩形選択に使う）。
// OrbitControls と同じく object・target・enabled・update() と 'start' / 'change' / 'end' のイベントを持つ。
import { EventDispatcher, Quaternion, Vector3 } from 'three';

const _offset = new Vector3();
const _axis = new Vector3();
const _move = new Vector3();
const _qa = new Quaternion();
const _qb = new Quaternion();
const _Y = new Vector3(0, 1, 0);

/** マウスのボタン（PointerEvent.buttons）から操作の種類。Maya と同じく、左 + 中はドリー */
export function navModeOf(buttons) {
  const l = (buttons & 1) !== 0, r = (buttons & 2) !== 0, m = (buttons & 4) !== 0;
  if (l && m) return 'dolly';
  if (l) return 'tumble';
  if (m) return 'track';
  if (r) return 'dolly';
  return null;
}

/** PointerEvent.button（押したボタン）→ PointerEvent.buttons のビット */
export function buttonBit(button) {
  return button === 0 ? 1 : button === 1 ? 4 : button === 2 ? 2 : 0;
}

/** ドリーの量（ドラッグ）: 右・下へ動かすと近づく（> 0） */
export function dollyAmount(dx, dy) {
  return dx + dy;
}

/** 近づく量 amount（ピクセル）を、注視点までの距離の倍率にする（< 1 で近づく） */
export function dollyScale(amount, speed = 1) {
  return Math.pow(0.995, amount * speed);
}

/** ホイールの量（deltaY）→ 距離の倍率（OrbitControls と同じ量。奥へ回すと近づく） */
export function wheelScale(deltaY, deltaMode = 0, zoomSpeed = 1) {
  let d = deltaY;
  if (deltaMode === 1) d *= 16;              // 行単位
  else if (deltaMode === 2) d *= 100;        // ページ単位
  const s = Math.pow(0.95, zoomSpeed * Math.abs(d * 0.01));
  return d < 0 ? s : d > 0 ? 1 / s : 1;
}

/**
 * タンブル: object（カメラ）を target のまわりに回す（その場で向きも回す）。
 * yaw はワールドの Y 軸まわり、pitch は視点の横軸まわりの角度（ラジアン）
 */
export function tumble(object, target, yaw, pitch) {
  _axis.set(1, 0, 0).applyQuaternion(object.quaternion);
  _qa.setFromAxisAngle(_Y, yaw);
  _qb.setFromAxisAngle(_axis, pitch);
  _qa.multiply(_qb);                                      // 先に縦（視点の横軸）、次に横（ワールドの Y）
  _offset.subVectors(object.position, target).applyQuaternion(_qa);
  object.position.copy(target).add(_offset);
  object.quaternion.premultiply(_qa).normalize();
}

/** 1 ピクセルあたりのワールドの長さ（注視点の距離で）。トラックの量に使う */
export function worldPerPixel(object, target, heightPx) {
  if (object.isOrthographicCamera) return (object.top - object.bottom) / object.zoom / heightPx;
  const dist = object.position.distanceTo(target);
  return 2 * dist * Math.tan((object.fov * Math.PI / 180) / 2) / heightPx;
}

/** トラック: 画面上で dx, dy ピクセル動かした分だけ、カメラと注視点を動かす（つかんだものがマウスについてくる） */
export function track(object, target, dx, dy, perPx) {
  _move.set(-dx * perPx, dy * perPx, 0).applyQuaternion(object.quaternion);
  object.position.add(_move);
  target.add(_move);
}

/** ドリー: 注視点までの距離を scale 倍にする（平行投影はズーム）。注視点は越えない */
export function dolly(object, target, scale, minDistance = 1e-6) {
  if (!(scale > 0) || !Number.isFinite(scale)) return;
  if (object.isOrthographicCamera) {
    object.zoom = Math.min(1e6, Math.max(1e-6, object.zoom / scale));
    object.updateProjectionMatrix();
    return;
  }
  _offset.subVectors(object.position, target);
  const d = _offset.length();
  if (d < 1e-12) return;
  const nd = Math.max(minDistance, d * scale);
  object.position.copy(target).addScaledVector(_offset, nd / d);
}

export class MayaControls extends EventDispatcher {
  constructor(object, domElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.target = new Vector3();
    this.enabled = true;
    this.rotateSpeed = 1;
    this.dollySpeed = 1;
    this.zoomSpeed = 1;
    this.minDistance = 1e-6;
    this.drag = null;         // { id, x, y, mode, lock: null | 'x' | 'y' | 'pending', moved }

    this._onDown = (e) => this.onPointerDown(e);
    this._onMove = (e) => this.onPointerMove(e);
    this._onUp = (e) => this.onPointerUp(e);
    this._onWheel = (e) => this.onWheel(e);
    domElement.addEventListener('pointerdown', this._onDown);
    domElement.addEventListener('pointermove', this._onMove);
    domElement.addEventListener('pointerup', this._onUp);
    domElement.addEventListener('pointercancel', this._onUp);
    domElement.addEventListener('lostpointercapture', this._onUp);
    domElement.addEventListener('wheel', this._onWheel, { passive: false });
  }

  dispose() {
    const el = this.domElement;
    el.removeEventListener('pointerdown', this._onDown);
    el.removeEventListener('pointermove', this._onMove);
    el.removeEventListener('pointerup', this._onUp);
    el.removeEventListener('pointercancel', this._onUp);
    el.removeEventListener('lostpointercapture', this._onUp);
    el.removeEventListener('wheel', this._onWheel);
  }

  /** いま視点を動かしているか */
  get dragging() { return !!this.drag; }

  /** 注視点を向く（上はワールドの Y。真上を越えて逆さまになっていれば -Y を上にして、逆さまのまま保つ） */
  update() {
    const o = this.object;
    const upY = _axis.set(0, 1, 0).applyQuaternion(o.quaternion).y;
    o.up.set(0, upY < 0 ? -1 : 1, 0);
    o.lookAt(this.target);
    o.updateMatrixWorld();
    return true;
  }

  onPointerDown(e) {
    if (!this.enabled || !e.altKey || this.drag) return;
    const mode = navModeOf(buttonBit(e.button));
    if (!mode) return;
    e.preventDefault();
    try { this.domElement.setPointerCapture(e.pointerId); } catch { /* 合成イベントなど */ }
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, mode, lock: e.shiftKey ? 'pending' : null, sx: 0, sy: 0, leveled: false };
    this.dispatchEvent({ type: 'start' });
  }

  onPointerMove(e) {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    if (!this.enabled) { this.finish(); return; }
    const mode = navModeOf(e.buttons);                    // 途中で左 + 中にしたらドリーに切り替える
    if (!mode) { this.finish(); return; }
    let dx = e.clientX - d.x, dy = e.clientY - d.y;
    d.x = e.clientX; d.y = e.clientY;
    if (mode !== d.mode) { d.mode = mode; d.lock = d.lock ? 'pending' : null; d.sx = d.sy = 0; }
    if (!dx && !dy) return;
    if (d.lock && mode !== 'dolly') {
      // Shift: 最初に 4 ピクセル動いた向きだけにする（Maya と同じ）
      if (d.lock === 'pending') {
        d.sx += dx; d.sy += dy;
        if (Math.hypot(d.sx, d.sy) < 4) return;
        d.lock = Math.abs(d.sx) >= Math.abs(d.sy) ? 'x' : 'y';
        dx = d.sx; dy = d.sy;
      }
      if (d.lock === 'x') dy = 0; else dx = 0;
    }
    this.apply(mode, dx, dy, d);
  }

  /** ドラッグの 1 回分の動きを視点に加える */
  apply(mode, dx, dy, d = {}) {
    const o = this.object;
    const h = Math.max(1, this.domElement.clientHeight || 1);
    if (mode === 'tumble') {
      if (!d.leveled) { this.update(); d.leveled = true; }  // 視線まわりの傾き（ロール）をなくしてから回す
      tumble(o, this.target, -2 * Math.PI * dx / h * this.rotateSpeed, -2 * Math.PI * dy / h * this.rotateSpeed);
    } else if (mode === 'track') {
      track(o, this.target, dx, dy, worldPerPixel(o, this.target, h));
    } else if (mode === 'dolly') {
      dolly(o, this.target, dollyScale(dollyAmount(dx, dy), this.dollySpeed), this.minDistance);
    }
    o.updateMatrixWorld();
    this.dispatchEvent({ type: 'change' });
  }

  onPointerUp(e) {
    const d = this.drag;
    if (!d || (e.pointerId !== undefined && e.pointerId !== d.id)) return;
    // 押しているボタンが残っていれば続ける（左 + 中から中だけにしたときなど）
    if (e.type === 'pointerup' && navModeOf(e.buttons)) return;
    this.finish();
  }

  finish() {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    try { if (this.domElement.hasPointerCapture && this.domElement.hasPointerCapture(d.id)) this.domElement.releasePointerCapture(d.id); } catch { /* 無視 */ }
    this.dispatchEvent({ type: 'end' });
  }

  onWheel(e) {
    if (!this.enabled || this.drag) return;
    e.preventDefault();
    const s = wheelScale(e.deltaY, e.deltaMode, this.zoomSpeed);
    if (s === 1) return;
    this.dispatchEvent({ type: 'start' });
    dolly(this.object, this.target, s, this.minDistance);
    this.object.updateMatrixWorld();
    this.dispatchEvent({ type: 'change' });
    this.dispatchEvent({ type: 'end' });
  }
}
