// 矩形選択（マーキー）と、修飾キーによる選択の組み合わせ（Maya と同じ）。three.js のシーンに依存しない計算だけを置く。
//   クリック・ドラッグ           選び直す
//   Shift                        切り替え（選んでいなければ加え、選んでいれば外す）
//   Ctrl                         外す
//   Ctrl + Shift                 加える
// 選択は順番つきの配列で、最後の要素がリード（最後に選んだもの。Maya の緑で示すもの）。
import { Matrix4 } from 'three';

/** マウスの修飾キーから選択の仕方（Mac の Command は Ctrl と同じに扱う） */
export function selectionModeOf(e) {
  const ctrl = !!(e && (e.ctrlKey || e.metaKey));
  const shift = !!(e && e.shiftKey);
  if (ctrl && shift) return 'add';
  if (ctrl) return 'remove';
  if (shift) return 'toggle';
  return 'replace';
}

/**
 * いまの選択 current に hits を組み合わせた、新しい選択（配列。最後がリード）。
 * replace で hits が空なら空（何もないところをクリックすると選択を解除）。add・toggle で加えたものはリードになる
 */
export function combineSelection(current, hits, mode) {
  const uniq = [];
  for (const h of hits) if (!uniq.includes(h)) uniq.push(h);
  if (mode === 'replace') return uniq;
  let out = current.slice();
  if (mode === 'remove') return out.filter((n) => !uniq.includes(n));
  for (const h of uniq) {
    const i = out.indexOf(h);
    if (mode === 'toggle' && i >= 0) { out.splice(i, 1); continue; }
    if (i >= 0) out.splice(i, 1);
    out.push(h);
  }
  return out;
}

/** 2 点から矩形（左上・右下。ピクセル） */
export function normRect(x0, y0, x1, y1) {
  return { left: Math.min(x0, x1), top: Math.min(y0, y1), right: Math.max(x0, x1), bottom: Math.max(y0, y1) };
}

export function pointInRect(x, y, r) {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/** 線分 a-b が矩形にかかるか（端点が中にあるか、辺と交わる。Liang–Barsky） */
export function segmentHitsRect(ax, ay, bx, by, r) {
  if (pointInRect(ax, ay, r) || pointInRect(bx, by, r)) return true;
  const dx = bx - ax, dy = by - ay;
  let t0 = 0, t1 = 1;
  const clip = (p, q) => {
    if (Math.abs(p) < 1e-12) return q >= 0;
    const t = q / p;
    if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
    else { if (t < t0) return false; if (t < t1) t1 = t; }
    return true;
  };
  return clip(-dx, ax - r.left) && clip(dx, r.right - ax) && clip(-dy, ay - r.top) && clip(dy, r.bottom - ay) && t0 <= t1;
}

/** 点が三角形の中にあるか（向きは問わない） */
export function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
  const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
  const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
  const neg = d1 < 0 || d2 < 0 || d3 < 0, pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

/**
 * ワールド座標 → 画面のピクセル（左上が原点）に写す関数を作る。
 * 戻り値 project(x, y, z, out) は out = { x, y, front }（front: カメラの前にあるか）を返す
 */
export function makeProjector(camera, width, height) {
  camera.updateMatrixWorld();
  const vp = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  const e = vp.elements;
  return (x, y, z, out = {}) => {
    const cx = e[0] * x + e[4] * y + e[8] * z + e[12];
    const cy = e[1] * x + e[5] * y + e[9] * z + e[13];
    const cw = e[3] * x + e[7] * y + e[11] * z + e[15];
    out.front = cw > 1e-9;
    const w = out.front ? cw : 1e-9;
    out.x = (cx / w * 0.5 + 0.5) * width;
    out.y = (0.5 - cy / w * 0.5) * height;
    return out;
  };
}

/** Vector3 を写す（テスト・少数の点用） */
export function projectPoint(project, v, out = {}) {
  return project(v.x, v.y, v.z, out);
}

/**
 * 三角形の集まり（ワールド座標の頂点 positions = [x, y, z, ...]、index は三角形ごとの頂点番号。null なら 3 つずつ）が
 * 矩形にかかるか。頂点が中にある・辺が矩形と交わる・矩形が三角形の中にある、のどれかなら true。
 * カメラの後ろの頂点を含む三角形は、前にある頂点だけで判定する
 */
export function trianglesHitRect(positions, index, project, r) {
  const n = positions.length / 3;
  const sx = new Float32Array(n), sy = new Float32Array(n);
  const front = new Uint8Array(n);
  const p = {};
  let anyFront = false;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    project(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], p);
    sx[i] = p.x; sy[i] = p.y; front[i] = p.front ? 1 : 0;
    if (!p.front) continue;
    anyFront = true;
    if (pointInRect(p.x, p.y, r)) return true;
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
  }
  if (!anyFront) return false;
  // 前にある頂点の範囲が矩形から離れていれば、辺も矩形にかからない（後ろの頂点を含む三角形は判定しないため）
  if (maxX < r.left || minX > r.right || maxY < r.top || minY > r.bottom) return false;
  const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
  const triCount = index ? Math.floor(index.length / 3) : Math.floor(n / 3);
  for (let t = 0; t < triCount; t++) {
    const a = index ? index[t * 3] : t * 3, b = index ? index[t * 3 + 1] : t * 3 + 1, c = index ? index[t * 3 + 2] : t * 3 + 2;
    if (!(front[a] && front[b] && front[c])) continue;
    if (segmentHitsRect(sx[a], sy[a], sx[b], sy[b], r) || segmentHitsRect(sx[b], sy[b], sx[c], sy[c], r)
      || segmentHitsRect(sx[c], sy[c], sx[a], sy[a], r) || pointInTriangle(cx, cy, sx[a], sy[a], sx[b], sy[b], sx[c], sy[c])) return true;
  }
  return false;
}

/** 折れ線（ワールド座標 positions = [x, y, z, ...]）が矩形にかかるか */
export function polylineHitsRect(positions, project, r) {
  const n = positions.length / 3;
  const a = {}, b = {};
  let prev = false;
  for (let i = 0; i < n; i++) {
    project(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], b);
    if (b.front && pointInRect(b.x, b.y, r)) return true;
    if (prev && b.front && segmentHitsRect(a.x, a.y, b.x, b.y, r)) return true;
    a.x = b.x; a.y = b.y;
    prev = b.front;
  }
  return false;
}

/** 点（ワールド座標）が矩形の中に写るか */
export function pointHitsRect(x, y, z, project, r) {
  const p = project(x, y, z, {});
  return p.front && pointInRect(p.x, p.y, r);
}
