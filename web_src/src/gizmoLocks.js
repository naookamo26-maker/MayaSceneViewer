// ハンドル（three.js の TransformControls）の、ロックした軸の表示と操作。
//
// Maya と同じく、ロックした属性（移動・回転・スケールの成分）の軸のハンドルは消さずに灰色で描き、つかめないようにする
// （チャンネルボックスでロックした属性が灰色になるのと同じ色の意味）。3 成分ともロックしていれば、すべてのハンドルが灰色。
// 平面のハンドル（XY など）・中央のハンドル（XYZ）・視点の回転（E・XYZE）は、含む軸がすべてロックされているときだけ灰色にする
// （一部だけなら動かせ、ロックした成分は結果で固定する: ViewerApp.lockedPose）。
import { Color } from 'three';

export const LOCKED_COLOR = new Color(0xa0a4a8);
const LOCKED_OPACITY = 0.8;

/**
 * ハンドルの名前（X・Y・Z・XY・YZ・XZ・XYZ・E・XYZE など）が、ロックした軸 locks（[X, Y, Z] の真偽）で動かせないか
 */
export function handleLocked(name, locks) {
  if (!name || !locks || !locks.some(Boolean)) return false;
  // E（視点の向きの回転）・XYZE（自由回転）は 3 軸すべてにかかる
  if (name === 'E' || name === 'XYZE') return locks.every(Boolean);
  const axes = [0, 1, 2].filter((i) => name.includes('XYZ'[i]));
  return axes.length > 0 && axes.every((i) => !!locks[i]);
}

/**
 * TransformControls に、ロックした軸を設定できるようにする（1 回だけ呼ぶ）。
 *   controls.setLockedAxes([X, Y, Z] | null)   いまのモードのロック
 *   controls.lockedAxis                         ポインターが乗っているロックしたハンドルの名前（なければ null）
 */
export function installGizmoLocks(controls) {
  controls.lockedAxes = null;
  controls.lockedAxis = null;
  controls.setLockedAxes = (locks) => {
    const next = locks && locks.some(Boolean) ? locks.map(Boolean) : null;
    if (String(next) === String(controls.lockedAxes)) return;
    controls.lockedAxes = next;
    if (controls.axis && handleLocked(controls.axis, next)) controls.axis = null;
    controls.dispatchEvent({ type: 'change' });
  };
  // ポインターを乗せたハンドルがロックした軸なら、つかまない（axis を null にする。ハイライトもしない）
  const hover = controls.pointerHover.bind(controls);
  controls.pointerHover = (pointer) => {
    hover(pointer);
    controls.lockedAxis = null;
    if (controls.axis && handleLocked(controls.axis, controls.lockedAxes)) {
      controls.lockedAxis = controls.axis;
      controls.axis = null;
    }
  };
  // 描画: ロックした軸のハンドルを灰色・半透明にする（元の updateMatrixWorld が色を戻したあとに上書きする）
  const gizmo = controls._gizmo;
  // ハンドルはマテリアルを共有している（Mesh.clone）。1 つを灰色にしても、ほかに移らないよう別々にする
  for (const mode of ['translate', 'rotate', 'scale']) {
    for (const handle of gizmo.gizmo[mode].children) if (handle.material) handle.material = handle.material.clone();
  }
  const update = gizmo.updateMatrixWorld.bind(gizmo);
  gizmo.updateMatrixWorld = (force) => {
    update(force);
    const locks = controls.lockedAxes;
    if (!locks) return;
    for (const handle of gizmo.gizmo[gizmo.mode].children) {
      if (handle.tag === 'helper' || !handleLocked(handle.name, locks)) continue;
      handle.material.color.copy(LOCKED_COLOR);
      handle.material.opacity = Math.min(handle.material._opacity ?? 1, LOCKED_OPACITY);
    }
  };
}
