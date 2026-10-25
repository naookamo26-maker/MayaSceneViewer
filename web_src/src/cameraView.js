// シーンのカメラ（共通 JSON の cameras）: カメラから見るときの投影と、ビューポートに描くカメラの形。
//
// Maya のカメラの決まり（値は Maya の単位のまま）:
//   * 焦点距離 fl は mm、フィルムバック（hfa・vfa）とフィルムオフセット（hfo・vfo）はインチ。
//     フィルム上の x インチの点は、視線から tan = x · 25.4 / fl の方向に写る（cameraScale 倍に広がる）
//   * 解像度ゲート（レンダーの縦横比）をフィルムゲートに合わせる方法がフィルムフィット（ff）:
//     0 = フィル（ゲートがフィルムの内側に収まる）・1 = 水平・2 = 垂直・3 = オーバースキャン（フィルムがゲートの内側）
//   * 平行投影（o）のときは、orthographicWidth（ow）がフィルムの幅に当たる
//   * カメラはローカルの −Z を向き、+Y が上（three.js と同じ）
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } from 'three';

const MM_PER_INCH = 25.4;

/** 属性の現在の値（アニメーション・リグで決まる値 over があればそれを使う） */
export function cameraParams(cam, over = null) {
  const o = over || {};
  const pick = (attr, key) => (typeof o[attr] === 'number' ? o[attr] : cam[key]);
  return {
    fl: Math.max(pick('fl', 'focalLength'), 1e-3),
    hfa: Math.max(pick('hfa', 'horizontalFilmAperture'), 1e-6),
    vfa: Math.max(pick('vfa', 'verticalFilmAperture'), 1e-6),
    hfo: pick('hfo', 'horizontalFilmOffset') || 0,
    vfo: pick('vfo', 'verticalFilmOffset') || 0,
    lsr: pick('lsr', 'lensSqueezeRatio') || 1,
    cs: pick('cs', 'cameraScale') || 1,
    ow: Math.max(pick('ow', 'orthographicWidth'), 1e-6),
    near: Math.max(pick('ncp', 'nearClipPlane'), 1e-4),
    far: pick('fcp', 'farClipPlane'),
    fit: cam.filmFit ?? 1,
    ortho: !!cam.orthographic,
  };
}

/**
 * カメラから見るときの投影。解像度ゲートがビューポートに収まるように（周りに margin 倍の余白）広げる。
 * inset: ビューポートの上下の、ほかの表示に重なる高さ（ピクセル。下端のタイムラインなど）。
 *   ゲートはその内側の中央に収め、投影は重なる部分まで上下に広げる（画面全体に描く）
 * @returns {{ ortho, left, right, top, bottom, near, far, gate: {x, y, w, h} }}
 *   透視投影の left〜bottom は近クリップ面での範囲、平行投影はワールドの長さ。gate はビューポート上のピクセル
 */
export function cameraFrustum(p, viewW, viewH, renderAspect, margin = 1.06, inset = null) {
  const insetTop = Math.max(0, (inset && inset.top) || 0), insetBottom = Math.max(0, (inset && inset.bottom) || 0);
  const fullH = viewH;
  viewH = Math.max(viewH - insetTop - insetBottom, 1);   // ゲートを収める範囲の高さ
  const filmW = p.hfa * p.lsr, filmH = p.vfa;
  const filmAspect = filmW / filmH;
  const ra = renderAspect > 0 ? renderAspect : filmAspect;
  const horizontal = p.fit === 1 || (p.fit === 0 && ra >= filmAspect) || (p.fit === 3 && ra < filmAspect);
  const gateW = horizontal ? filmW : filmH * ra;
  const gateH = gateW / ra;
  const aspect = Math.max(viewW, 1) / Math.max(viewH, 1);
  let w, h;
  if (aspect > ra) { h = gateH * margin; w = h * aspect; } else { w = gateW * margin; h = w / aspect; }
  const cx = p.hfo, cy = p.vfo;                   // フィルムオフセット: 見る範囲の中心がずれる
  // フィルム上のインチ → 透視投影は近クリップ面での長さ、平行投影はワールドの長さ
  const k = p.ortho ? (p.ow / filmW) * p.cs : (p.near * MM_PER_INCH * p.cs) / p.fl;
  const gate = { w: (gateW / w) * viewW, h: (gateH / h) * viewH };
  gate.x = (viewW - gate.w) / 2;
  gate.y = insetTop + (viewH - gate.h) / 2;
  const perPx = h / viewH;                          // フィルム上の長さ（インチ）/ ピクセル
  const top = cy + h / 2 + insetTop * perPx, bottom = cy - h / 2 - (fullH - viewH - insetTop) * perPx;
  return {
    ortho: p.ortho,
    left: (cx - w / 2) * k, right: (cx + w / 2) * k, top: top * k, bottom: bottom * k,
    near: p.near, far: Math.max(p.far, p.near * 2), gate,
  };
}

/** ビューポートに描くカメラの形（視野の四角錐と、上を示す三角形）。カメラの transform の子にする */
export class CameraIcons {
  constructor() {
    this.items = [];                                 // カメラの番号 → { line, parent }
    this.material = new LineBasicMaterial({ color: 0xb9c6d2, transparent: true, opacity: 0.9, depthTest: true });
    this.selectedMaterial = new LineBasicMaterial({ color: 0xf2a93b, transparent: true, opacity: 1, depthTest: true });
  }

  /** @param size 四角錐の奥行き（シーンの大きさに合わせる） */
  build(built, cameras, size) {
    this.clear();
    (cameras || []).forEach((cam, ci) => {
      const parent = built.nodeObjects[cam.transform];
      if (!parent) { this.items[ci] = null; return; }
      const line = new LineSegments(iconGeometry(cameraParams(cam), size), this.material);
      line.name = '__cameraIcon';
      line.renderOrder = 5;
      line.userData.cameraIndex = ci;
      parent.add(line);
      this.items[ci] = { line, parent, node: cam.transform };
    });
  }

  clear() {
    for (const it of this.items) {
      if (!it) continue;
      it.parent.remove(it.line);
      it.line.geometry.dispose();
    }
    this.items = [];
  }

  /** @param hiddenOf (ノード番号) => 隠れているか  @param viewing いま見ているカメラ（その形は描かない） */
  update(show, hiddenOf, viewing, selectedNode) {
    this.items.forEach((it, ci) => {
      if (!it) return;
      it.line.visible = show && ci !== viewing && !hiddenOf(it.node);
      it.line.material = it.node === selectedNode ? this.selectedMaterial : this.material;
    });
  }
}

function iconGeometry(p, size) {
  // 奥行き size の四角錐。底面はフィルムゲートの形（平行投影は箱）
  const filmW = p.hfa * p.lsr, filmH = p.vfa;
  const d = size;
  let hw, hh;
  if (p.ortho) { hw = d * 0.45; hh = hw * (filmH / filmW); } else {
    hw = Math.min(d * filmW * MM_PER_INCH / (2 * p.fl), d * 2);
    hh = hw * (filmH / filmW);
  }
  const s = p.ortho ? 1 : 0;                         // 平行投影は手前も同じ大きさ
  const n = [[-hw * s, -hh * s, 0], [hw * s, -hh * s, 0], [hw * s, hh * s, 0], [-hw * s, hh * s, 0]];
  const f = [[-hw, -hh, -d], [hw, -hh, -d], [hw, hh, -d], [-hw, hh, -d]];
  const pts = [];
  const seg = (a, b) => pts.push(...a, ...b);
  for (let i = 0; i < 4; i++) {
    seg(f[i], f[(i + 1) % 4]);
    seg(n[i], f[i]);
    if (p.ortho) seg(n[i], n[(i + 1) % 4]);
  }
  // 上を示す三角形（底面の上辺の上）
  const up = [[-hw * 0.5, hh * 1.08, -d], [hw * 0.5, hh * 1.08, -d], [0, hh * 1.6, -d]];
  seg(up[0], up[1]); seg(up[1], up[2]); seg(up[2], up[0]);
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pts, 3));
  return g;
}
