// リグのコントローラー（カーブの形のないもの）の目印。役割ごとに形を変え、色は役割か左右で塗り分ける。
// 大きさは、近くの骨の長さに合わせるか、画面上で一定にする。
import {
  BoxGeometry, BufferGeometry, Color, ConeGeometry, DynamicDrawUsage, EdgesGeometry, Float32BufferAttribute, Group,
  LineBasicMaterial, LineDashedMaterial, LineSegments, Object3D, OctahedronGeometry, Quaternion, TetrahedronGeometry,
  Vector3,
} from 'three';
import { CONTROL_ROLES, sideFromName } from './controlRoles.js';
import { segmentsDistance, segmentsHitRect } from './marquee.js';

/** 役割の色（ジョイントの水色・選択のアンバーとは形でも見分けられる） */
export const ROLE_COLORS = {
  ik: 0xff6b5b, pole: 0xff8ad8, spline: 0x59d98e, constraint: 0xc4e36b, aim: 0x5b9dff,
  switch: 0xffe45c, driven: 0xc792ff, locator: 0xb8c0c8, other: 0x9aa5b1,
};
/** 左右の色（Maya でよく使われる慣例: 左＝青・右＝赤・中央＝黄） */
export const SIDE_COLORS = { L: 0x4c8dff, R: 0xff5a5a, C: 0xffd84d };
const BONE_SCALE = 0.24;        // 近くの骨に合わせるとき: 骨の長さに対する目印の半径
const SCREEN_PX = 14;           // 画面上で一定のとき: 目印の半径（ピクセル）
export const PICK_PX = 5;       // クリックで選ぶ: 目印の線から画面上でこのピクセル以内（カーブと同じ。Maya と同じく線に触れれば選ぶ）

function ring(r, n, axis) {
  const p = [];
  for (let i = 0; i < n; i++) {
    for (const a of [(i / n) * Math.PI * 2, ((i + 1) / n) * Math.PI * 2]) {
      const c = Math.cos(a) * r, s = Math.sin(a) * r;
      p.push(...(axis === 'y' ? [c, 0, s] : axis === 'x' ? [0, c, s] : [c, s, 0]));
    }
  }
  return p;
}
const edges = (geo) => Array.from(new EdgesGeometry(geo).attributes.position.array);

/** 役割の形（半径 1 前後の線分。+Z が向きの基準: ポールベクターの先・エイムの面） */
export function shapePoints(role) {
  switch (role) {
    case 'ik': return edges(new BoxGeometry(1.6, 1.6, 1.6));
    case 'pole': { const g = new ConeGeometry(0.75, 1.8, 4, 1); g.rotateX(Math.PI / 2); return edges(g); }   // 四角錐（先が肘・膝）
    case 'spline': return [...ring(0.9, 40, 'y'), ...ring(0.9, 40, 'x'), ...ring(0.9, 40, 'z')];          // 球（3 本の輪）
    case 'constraint': {                                                                                   // 4 方向の矢印
      const p = [], L = 1.1, h = 0.32;
      for (const [x, z] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        p.push(0, 0, 0, x * L, 0, z * L);
        p.push(x * L, 0, z * L, x * (L - h) - z * h, 0, z * (L - h) + x * h);
        p.push(x * L, 0, z * L, x * (L - h) + z * h, 0, z * (L - h) - x * h);
      }
      return p.concat(ring(0.35, 24, 'y'));
    }
    case 'aim': return [...ring(1, 48, 'z'), ...ring(0.45, 32, 'z'),                                       // 照準
      -1.35, 0, 0, -0.2, 0, 0, 0.2, 0, 0, 1.35, 0, 0, 0, -1.35, 0, 0, -0.2, 0, 0, 0.2, 0, 0, 1.35, 0];
    case 'switch': return [0, -1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0.3, 0, 1, 0.3, 0, 0, 0.3, 0,     // 旗
      0, 0.3, 0, 1, 1, 0, 0, 1, 0, 1, 0.3, 0];
    case 'driven': return edges(new TetrahedronGeometry(1.05));                                            // 四面体
    case 'locator': return [-1.2, 0, 0, 1.2, 0, 0, 0, -1.2, 0, 0, 1.2, 0, 0, 0, -1.2, 0, 0, 1.2];         // 十字（ロケーター）
    default: return edges(new OctahedronGeometry(1));                                                      // 八面体
  }
}

const _p = new Vector3();
const _piv = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _t = new Vector3();
const _c = new Color();

export class ControlOverlay {
  constructor() {
    this.group = new Group();
    this.group.name = '__controlOverlay';
    this.shapes = {};                 // 役割 → 形の線分の頂点（Float32Array）
    for (const r of CONTROL_ROLES) this.shapes[r] = Float32Array.from(shapePoints(r));
    // 目印はすべて 1 つの線分の集まり（頂点色）にまとめて描く（1 個ずつ描くと、目印の多いリグで描画の呼び出しが増えるため）。
    // items の obj は位置・向き・大きさを求めるためのもの（シーンには入れない）
    this.items = [];                  // { ni, role, info, obj, side, color, ref, size, vOff, vCount（まとめた線分での頂点の範囲） }
    this.markerMat = new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 });
    this.markers = null;
    this.colorMode = 'role';
    this.sizeMode = 'bone';
    this.scale = 1;
    this.hiddenRoles = new Set();
    this.xray = true;
    this.pixelAt = null;              // (worldPos) => 1 ピクセルのワールドでの長さ（画面上で一定のとき）
    this.lineMat = new LineDashedMaterial({ vertexColors: true, dashSize: 1, gapSize: 0.7, transparent: true, opacity: 0.8 });
    this.lines = null;
  }

  clear() {
    this.items = [];
    if (this.markers) { this.group.remove(this.markers); this.markers.geometry.dispose(); this.markers = null; }
    if (this.lines) { this.group.remove(this.lines); this.lines.geometry.dispose(); this.lines = null; }
  }

  /**
   * @param list 目印を出すノード番号
   * @param roles classifyControls() の結果
   * @param ctx { nodes, objs: nodeObjects, boneLen(ni), nearestJoint(pos), medianBone, charRadius }
   */
  build(list, roles, ctx) {
    this.clear();
    this.ctx = ctx;
    const eps = Math.max(ctx.charRadius * 0.02, 1e-6);
    for (const ni of list) {
      const info = roles.get(ni) || { role: 'other' };
      this.markerPos(ni, _p);
      const side = sideFromName(ctx.nodes[ni].name) || (_p.x > eps ? 'L' : _p.x < -eps ? 'R' : 'C');   // キャラクターの左は +X
      const obj = new Object3D();
      obj.matrixAutoUpdate = false;
      this.items.push({ ni, role: info.role, info, obj, side, ref: this.refLength(info, _p), size: 0 });
    }
    const nv = this.items.reduce((a, it) => a + this.shapes[it.role].length / 3, 0);
    if (nv) {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(new Float32Array(nv * 3), 3).setUsage(DynamicDrawUsage));
      g.setAttribute('color', new Float32BufferAttribute(new Float32Array(nv * 3), 3).setUsage(DynamicDrawUsage));
      g.setDrawRange(0, 0);
      this.markers = new LineSegments(g, this.markerMat);
      this.markers.frustumCulled = false;
      this.group.add(this.markers);
    }
    // 破線（ポールベクター → 肘・膝、エイム → 向くノード）
    const n = this.items.filter((it) => it.info.lineTo >= 0).length;
    if (n) {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(new Float32Array(n * 6), 3).setUsage(DynamicDrawUsage));
      g.setAttribute('color', new Float32BufferAttribute(new Float32Array(n * 6), 3).setUsage(DynamicDrawUsage));
      this.lines = new LineSegments(g, this.lineMat);
      this.lines.frustumCulled = false;
      this.group.add(this.lines);
    }
    this.applyXray();
    this.applyColors();
  }

  /** 目印を置く位置: ピボット（ロケーターは localPosition。共通 JSON の pivot）をワールドへ */
  markerPos(ni, out) {
    const pv = this.ctx.nodes[ni].pivot;
    const m = this.ctx.objs[ni].matrixWorld;
    return pv ? out.set(pv[0], pv[1], pv[2]).applyMatrix4(m) : out.setFromMatrixPosition(m);
  }

  /** 近くの骨の長さ（大きさの基準）。チェーンなら骨の平均、ジョイントならその骨、なければいちばん近いジョイントの骨 */
  refLength(info, pos) {
    const c = this.ctx, objs = c.objs;
    let len = 0;
    if (info.chain && info.chain.length > 1) {
      for (let k = 1; k < info.chain.length; k++) {
        len += _t.setFromMatrixPosition(objs[info.chain[k - 1]].matrixWorld).distanceTo(_s.setFromMatrixPosition(objs[info.chain[k]].matrixWorld));
      }
      len /= info.chain.length - 1;
    } else if (info.joint >= 0) {
      len = c.boneLen(info.joint);
    } else {
      const j = c.nearestJoint(pos);
      if (j >= 0) len = c.boneLen(j);
    }
    // ジョイントのないシーンや極端な骨は、キャラクター（スキンのあるメッシュ）の大きさと骨の長さの中央値で抑える
    const m = c.medianBone;
    if (!(len > 1e-9)) len = m > 0 ? m : c.charRadius * 0.15;
    if (m > 0) len = Math.min(Math.max(len, m * 0.25), m * 4);
    return len;
  }

  setColorMode(v) { this.colorMode = v; this.applyColors(); }
  setSizeMode(v) { this.sizeMode = v; }
  setScale(v) { this.scale = v; }
  setHiddenRoles(set) { this.hiddenRoles = new Set(set); }
  setXray(v) { this.xray = v; this.applyXray(); }

  applyXray() {
    for (const m of [this.markerMat, this.lineMat]) { m.depthTest = !this.xray; m.depthWrite = !this.xray; m.needsUpdate = true; }
    if (this.markers) this.markers.renderOrder = this.xray ? 10 : 0;
    if (this.lines) this.lines.renderOrder = this.xray ? 10 : 0;
  }

  /** 色: Maya の描画のオーバーライド・ディスプレイレイヤーの色 → 役割の色か左右の色 */
  applyColors() {
    for (const it of this.items) {
      const own = this.ctx && this.ctx.nodes[it.ni].color;
      it.color = own ? new Color().setRGB(own[0], own[1], own[2]) : new Color(this.colorMode === 'side' ? SIDE_COLORS[it.side] : ROLE_COLORS[it.role]);
    }
  }

  /** シーンにある役割ごとの数 */
  counts() {
    const out = Object.fromEntries(CONTROL_ROLES.map((r) => [r, 0]));
    for (const it of this.items) out[it.role]++;
    return out;
  }

  /**
   * 位置・向き・大きさ・色を合わせる
   * @param o { selectColorOf(ni) => Color | null, isHidden(ni), statusColor(ni) => Color | null }
   */
  update(o) {
    if (!this.items.length) return;
    const objs = this.ctx.objs;
    let nl = 0;
    const lp = this.lines ? this.lines.geometry.attributes.position.array : null;
    const lc = this.lines ? this.lines.geometry.attributes.color.array : null;
    const mp = this.markers ? this.markers.geometry.attributes.position.array : null;
    const mc = this.markers ? this.markers.geometry.attributes.color.array : null;
    let nv = 0;                                   // 書いた目印の頂点の数（表示するものだけを前から詰める）
    for (const it of this.items) {
      const show = !this.hiddenRoles.has(it.role) && !o.isHidden(it.ni);
      it.obj.visible = show;
      it.shown = show;
      if (!show) continue;
      objs[it.ni].matrixWorld.decompose(_piv, _q, _s);
      this.markerPos(it.ni, _p);
      const size = (this.sizeMode === 'screen' && this.pixelAt ? SCREEN_PX * this.pixelAt(_p) : it.ref * BONE_SCALE) * this.scale;
      it.size = size;
      const to = it.info.lineTo >= 0 ? this.markerPos(it.info.lineTo, _t) : null;
      it.obj.position.copy(_p);
      if (to && to.distanceToSquared(_p) > 1e-12) it.obj.lookAt(to);      // ポールベクター・エイム: 結ぶ先を向く
      else it.obj.quaternion.copy(_q);
      it.obj.scale.setScalar(size);
      it.obj.updateMatrix();
      it.obj.updateMatrixWorld();
      _c.copy(o.selectColorOf(it.ni) || o.statusColor(it.ni) || it.color);
      it.vOff = nv;
      it.vCount = mp ? this.shapes[it.role].length / 3 : 0;
      if (mp) {                                    // 形の頂点を目印の行列で動かして、まとめた線分に書く
        const sh = this.shapes[it.role], e = it.obj.matrixWorld.elements;
        for (let k = 0; k < sh.length; k += 3, nv++) {
          const x = sh[k], y = sh[k + 1], z = sh[k + 2], d = nv * 3;
          mp[d] = e[0] * x + e[4] * y + e[8] * z + e[12];
          mp[d + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
          mp[d + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
          mc[d] = _c.r; mc[d + 1] = _c.g; mc[d + 2] = _c.b;
        }
      }
      if (to && lp) {
        lp.set([_p.x, _p.y, _p.z, to.x, to.y, to.z], nl * 6);
        lc.set([_c.r, _c.g, _c.b, _c.r, _c.g, _c.b], nl * 6);
        nl++;
      }
    }
    if (this.markers) {
      const g = this.markers.geometry;
      g.setDrawRange(0, nv);
      g.attributes.position.needsUpdate = true;
      g.attributes.color.needsUpdate = true;
      this.markers.visible = nv > 0;              // 描くものがなければ隠す（描画数 0 の警告を避ける）
    }
    if (this.lines) {
      const g = this.lines.geometry;
      g.setDrawRange(0, nl * 2);
      g.attributes.position.needsUpdate = true;
      g.attributes.color.needsUpdate = true;
      this.lines.computeLineDistances();
      // 破線の間隔は目印の大きさに合わせる
      const typical = this.items.reduce((a, it) => a + (it.shown ? it.size : 0), 0) / Math.max(1, this.items.filter((it) => it.shown).length);
      this.lineMat.dashSize = typical * 0.35;
      this.lineMat.gapSize = typical * 0.25;
      this.lines.visible = nl > 0;
    }
  }

  /**
   * クリックした点に近い目印のノード番号（なければ -1）。Maya と同じく、目印の線（ロケーターの十字・箱の辺など）の
   * どこかから画面上で tol ピクセル以内なら当たり。線にいちばん近いもの（1 ピクセル刻み）→ 手前 → IK ハンドルよりその親
   * （手のコントローラーなど）の順に選ぶ。
   * @param ray クリックのレイ（手前かの比較に使う） @param project makeProjector の関数 @param x,y クリックの位置（ピクセル）
   */
  pick(ray, project, x, y, tol = PICK_PX) {
    const pos = this.markers ? this.markers.geometry.attributes.position.array : null;
    if (!pos) return -1;
    let best = null;
    for (const it of this.items) {
      if (!it.shown || !it.vCount) continue;
      const d = segmentsDistance(pos, it.vOff, it.vCount, project, x, y);
      if (!(d <= tol)) continue;
      const t = _t.subVectors(it.obj.position, ray.origin).dot(ray.direction);
      const handle = this.ctx.nodes[it.ni].type === 'ikHandle' ? 1 : 0;
      const key = [Math.round(d), t, handle];
      if (!best || key[0] < best.key[0] || (key[0] === best.key[0] && (key[1] < best.key[1] - 1e-6
        || (Math.abs(key[1] - best.key[1]) <= 1e-6 && key[2] < best.key[2])))) best = { ni: it.ni, key };
    }
    return best ? best.ni : -1;
  }

  /** 矩形（ピクセル）に線が一部でもかかる目印のノード番号（Maya のマーキー選択と同じ） */
  inRect(project, rect) {
    const pos = this.markers ? this.markers.geometry.attributes.position.array : null;
    const out = [];
    if (!pos) return out;
    for (const it of this.items) {
      if (it.shown && it.vCount && segmentsHitRect(pos, it.vOff, it.vCount, project, rect)) out.push(it.ni);
    }
    return out;
  }
}
