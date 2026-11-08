// スキンのないメッシュを、材質ごとに 1 つの BatchedMesh にまとめて描く（ドローコールを減らす）。
//
// three.js はメッシュ（と材質のスロット）ごとに描画の命令（ドローコール）を出す。メッシュが数千あると、命令を出すだけで
// CPU の時間がかかる。BatchedMesh は、たくさんのジオメトリを 1 つのバッファに入れ、見えるものだけを 1 回の命令
// （WEBGL_multi_draw）で描く。メッシュごとに表示・非表示と行列を持てるので、次のことはそのまま扱える:
//   * 表示・非表示（メッシュ・親のノードの visible。リグの .v・表示の切り替え・シェーディングなし）
//   * 動くノードの下の硬いメッシュ（描画の前に、元のメッシュのワールド行列を写す）
//   * 材質の差し替え（ライトなし・テクスチャの表示など。元のメッシュの材質を写す）
//   * 画面の外のメッシュを描かない（BatchedMesh がメッシュごとの球で判定する）
// 元のメッシュは残し（選択の光線・範囲・ワイヤーの表示に使う）、描画だけ外す（BATCHED_LAYER に移す。カメラは描かない）。
// 頂点カラーを書き換える表示（ウェイトの表示）では、まとめるのをやめて元のメッシュで描く（setEnabled）。
import { BatchedMesh, BufferAttribute, BufferGeometry, DetachedBindMode, Group, Matrix4, SkinnedMesh, Sphere, Vector3 } from 'three';
import { groupSphereOf, worldMatrixOf } from './sceneBuilder.js';

/** まとめて描くメッシュの元のオブジェクトを置くレイヤー（カメラは描かない。選択の光線はこのレイヤーも見る） */
export const BATCHED_LAYER = 6;

const ATTRS = ['position', 'normal', 'color', 'uv'];

/** スロット s（geometry.groups）の三角形だけを持つジオメトリ（使う頂点だけにまとめる） */
export function slotGeometry(geometry, group) {
  const src = geometry.index.array;
  const remap = new Map();
  const index = new Uint32Array(group.count);
  for (let i = 0; i < group.count; i++) {
    const v = src[group.start + i];
    let r = remap.get(v);
    if (r === undefined) { r = remap.size; remap.set(v, r); }
    index[i] = r;
  }
  const out = new BufferGeometry();
  for (const name of ATTRS) {
    const a = geometry.getAttribute(name);
    if (!a) continue;
    const n = a.itemSize;
    const arr = new a.array.constructor(remap.size * n);
    for (const [v, r] of remap) for (let k = 0; k < n; k++) arr[r * n + k] = a.array[v * n + k];
    out.setAttribute(name, new BufferAttribute(arr, n, a.normalized));
  }
  out.setIndex(new BufferAttribute(index, 1));
  return out;
}

/** 描くのに使う属性だけを持つジオメトリ（属性の配列は共有する） */
function drawGeometry(geometry) {
  const out = new BufferGeometry();
  for (const name of ATTRS) { const a = geometry.getAttribute(name); if (a) out.setAttribute(name, a); }
  out.setIndex(geometry.index);
  return out;
}

/** オブジェクトと、その親のすべてが表示か */
// 祖先まで表示か（sync の中で、同じ祖先を何度もたどらないよう、求めた結果を祖先にも覚える。sync のたびに visStamp を進める）
let visStamp = 0;
const _chain = [];
function shownInTree(o) {
  let res = true, n = 0;
  for (let p = o; p; p = p.parent) {
    if (p.__visStamp === visStamp) { res = p.__vis; break; }
    if (!p.visible) { res = false; p.__visStamp = visStamp; p.__vis = false; break; }
    _chain[n++] = p;
  }
  for (let i = 0; i < n; i++) { _chain[i].__visStamp = visStamp; _chain[i].__vis = res; }
  return res;
}

export class MeshBatches {
  /**
   * @param built buildScene の結果
   * @param opts { minMembers: これより少ないまとまりは作らない（既定 2） }
   */
  constructor(built, opts = {}) {
    this.group = new Group();
    this.group.name = '__meshBatches';
    this.group.matrixAutoUpdate = false;              // まとめたメッシュはワールド空間（元のメッシュのワールド行列を写す）
    this.batches = [];
    this.pieces = [];                                 // { e, slot, batch, inst, vis, last: 写した行列 }
    this.enabled = true;
    const minMembers = opts.minMembers ?? 2;
    // スキンのないメッシュの、材質のスロットごとの部分 → まとまり（材質・属性の組み合わせが同じもの）
    const groups = new Map();
    for (const e of built.meshes) {
      if (e.skinned) continue;                        // スキン付き（形が骨で変わる）は、いままでどおり
      const g = e.geometry;
      const slots = e.materials.length > 1 && g.groups.length ? g.groups : [{ start: 0, count: g.index.count, materialIndex: 0 }];
      for (const grp of slots) {
        if (!grp.count) continue;
        const mat = e.materials[grp.materialIndex];
        const attrs = ATTRS.filter((n) => g.getAttribute(n)).join(',');
        const key = mat.uuid + '|' + attrs;
        let list = groups.get(key);
        if (!list) groups.set(key, list = []);
        list.push({ e, slot: grp.materialIndex, grp, single: slots.length === 1 });
      }
    }
    for (const list of groups.values()) {
      if (list.length < minMembers) continue;         // 1 つだけなら、まとめても減らない
      const geos = list.map((p) => (p.single ? drawGeometry(p.e.geometry) : slotGeometry(p.e.geometry, p.grp)));
      const verts = geos.reduce((n, g) => n + g.getAttribute('position').count, 0);
      const idx = geos.reduce((n, g) => n + g.index.count, 0);
      const batch = new BatchedMesh(list.length, verts, idx, list[0].e.materials[list[0].slot]);
      batch.name = '__batch';
      batch.matrixAutoUpdate = false;
      batch.frustumCulled = false;                    // メッシュごとに判定する（perObjectFrustumCulled）
      list.forEach((p, i) => {
        const gid = batch.addGeometry(geos[i]);
        const inst = batch.addInstance(gid);
        batch.setVisibleAt(inst, false);              // 最初の sync で決める
        this.pieces.push({ e: p.e, slot: p.slot, batch, inst, vis: false, last: new Float64Array(16).fill(NaN) });
      });
      this.batches.push(batch);
      this.group.add(batch);
    }
    // まとめたメッシュの元のオブジェクト（すべてのスロットをまとめたもの）は、描画から外す
    const count = new Map();
    for (const p of this.pieces) count.set(p.e, (count.get(p.e) || 0) + 1);
    this.batchedMeshes = new Set();
    for (const [e, n] of count) {
      const slots = e.materials.length > 1 && e.geometry.groups.length ? e.geometry.groups.filter((g) => g.count).length : 1;
      if (n === slots) this.batchedMeshes.add(e);
    }
    // 一部のスロットだけまとめたメッシュ（ほかのスロットが 1 つだけのまとまり）は、まとめずに元のまま描く
    this.pieces = this.pieces.filter((p) => {
      if (this.batchedMeshes.has(p.e)) return true;
      p.batch.deleteInstance(p.inst);
      return false;
    });
    this.applyLayers();
  }

  /** まとめたメッシュの数・まとまりの数（評価のプロファイラ） */
  stats() {
    return { meshes: this.batchedMeshes.size, batches: this.batches.length, enabled: this.enabled };
  }

  applyLayers() {
    for (const e of this.batchedMeshes) e.staticMesh.layers.set(this.enabled ? BATCHED_LAYER : 0);
    this.group.visible = this.enabled;
  }

  /** まとめて描くか（頂点カラーを書き換える表示では false にして、元のメッシュで描く） */
  setEnabled(on) {
    if (this.enabled === on) return;
    this.enabled = on;
    this.applyLayers();
  }

  /** 描画の前に、元のメッシュの表示・ワールド行列・材質を写す */
  sync() {
    if (!this.enabled) return;
    visStamp++;
    for (const p of this.pieces) {
      const o = p.e.staticMesh;
      const vis = shownInTree(o);
      if (vis !== p.vis) { p.batch.setVisibleAt(p.inst, vis); p.vis = vis; }
      if (!vis) continue;
      const m = worldMatrixOf(o);
      const a = m.elements, b = p.last;
      let same = true;
      for (let i = 0; i < 16; i++) if (a[i] !== b[i]) { same = false; break; }
      if (!same) { p.batch.setMatrixAt(p.inst, m); b.set(a); }
      const mat = Array.isArray(o.material) ? o.material[p.slot] : o.material;
      if (p.batch.material !== mat) p.batch.material = mat;
    }
  }

  dispose() {
    for (const e of this.batchedMeshes) e.staticMesh.layers.set(0);
    for (const b of this.batches) b.dispose();
    this.group.removeFromParent();
    this.batches = [];
    this.pieces = [];
    this.batchedMeshes = new Set();
  }
}

// ---------------------------------------------------------------------- スキン付きメッシュ
// 同じ Skeleton（shareSkeletons で共有したもの）・同じ材質のスキン付きメッシュを、1 つの SkinnedMesh にまとめて描く。
// three.js のスキン付きメッシュの頂点は M · B⁻¹ · Σ w · 骨 · (B · p)（M: メッシュのワールド行列、B: バインド行列）。
// M · B⁻¹（X）が同じメッシュどうしなら、頂点に先に B を掛けておけば（法線は B の 3×3）、バインド行列が単位行列の 1 つの
// メッシュ（ワールド行列 X）で同じ位置になる。法線も同じになるのは B が回転と移動だけのときなので、そういうメッシュだけまとめる。
// 毎フレーム（sync）、表示・X・材質を確かめ、合わないメッシュは外して元のメッシュで描く（顔ぶれが変わったら三角形の一覧を
// 作り直す）。何度も出入りするメッシュ（表示が切り替わり続けるものなど）は、まとめないことにする。
// 元のメッシュは残し（選択の光線・範囲）、まとめて描くあいだは描画から外す（BATCHED_LAYER）。

const SKIN_ATTRS = ['position', 'normal', 'color', 'uv', 'skinIndex', 'skinWeight', 'skinIndex1', 'skinWeight1'];
const MAX_TOGGLES = 6;                               // これより多く出入りしたメッシュはまとめない
const _x = new Matrix4();

/** B の 3×3 が回転（直交・行列式 1）か */
function isRigid(m) {
  const e = m.elements;
  const dot = (i, j) => e[i] * e[j] + e[i + 1] * e[j + 1] + e[i + 2] * e[j + 2];
  const tol = 1e-6;
  return Math.abs(dot(0, 0) - 1) < tol && Math.abs(dot(4, 4) - 1) < tol && Math.abs(dot(8, 8) - 1) < tol
    && Math.abs(dot(0, 4)) < tol && Math.abs(dot(0, 8)) < tol && Math.abs(dot(4, 8)) < tol && m.determinant() > 0;
}

/** 2 つの行列がほぼ同じか */
function nearMatrix(a, b) {
  for (let i = 0; i < 16; i++) if (Math.abs(a[i] - b[i]) > 1e-9 * (1 + Math.abs(b[i]))) return false;
  return true;
}

export class SkinBatches {
  /** @param built buildScene の結果（world: 行列を計算したあと。X を決めるため） */
  constructor(built, opts = {}) {
    this.group = new Group();
    this.group.name = '__skinBatches';
    this.group.matrixAutoUpdate = false;
    this.batches = [];                               // { mesh, pieces, members: Set(e), index: 全体の三角形, X, dirty }
    this.state = new Map();                          // e → { active, toggles, never, batches: [...] }
    this.enabled = true;
    const minMembers = opts.minMembers ?? 2;
    const groups = new Map();
    for (const e of built.meshes) {
      const o = e.skinned;
      if (!o || !e.skeleton || !isRigid(o.bindMatrix)) continue;
      const g = e.geometry;
      if (!g.getAttribute('skinIndex1')) continue;
      const X = _x.multiplyMatrices(worldMatrixOf(o), o.bindMatrixInverse).elements;
      const xkey = Array.from(X, (v) => Math.round(v * 1e6)).join(',');
      const slots = e.materials.length > 1 && g.groups.length ? g.groups : [{ start: 0, count: g.index.count, materialIndex: 0 }];
      const attrs = SKIN_ATTRS.filter((n) => g.getAttribute(n)).join(',');
      for (const grp of slots) {
        if (!grp.count) continue;
        const mat = e.materials[grp.materialIndex];
        const key = `${e.skeleton.uuid}|${mat.uuid}|${attrs}|${xkey}`;
        let list = groups.get(key);
        if (!list) groups.set(key, list = []);
        list.push({ e, slot: grp.materialIndex, grp });
      }
    }
    for (const list of groups.values()) {
      if (new Set(list.map((p) => p.e)).size < minMembers) continue;
      this.batches.push(this.buildBatch(list));
    }
    // まとめるのは、すべての材質のスロットがどこかのまとまりに入ったメッシュだけ
    const count = new Map();
    for (const b of this.batches) for (const p of b.pieces) count.set(p.e, (count.get(p.e) || 0) + 1);
    for (const [e, n] of count) {
      const slots = e.materials.length > 1 && e.geometry.groups.length ? e.geometry.groups.filter((g) => g.count).length : 1;
      if (n === slots) this.state.set(e, { active: false, toggles: 0, never: false, batches: [], last: new Float64Array(16).fill(NaN), near: false });
    }
    for (const b of this.batches) b.pieces = b.pieces.filter((p) => this.state.has(p.e));
    this.batches = this.batches.filter((b) => b.pieces.length);
    // メッシュごとに、入っているまとまり（材質のスロットごと）
    for (const b of this.batches) {
      for (const p of b.pieces) {
        const st = this.state.get(p.e);
        if (!st.batches.includes(b)) st.batches.push(b);
      }
    }
  }

  /** まとまりを作る: 頂点に B を掛けた（法線は B の 3×3）属性をつなげ、ピースごとの三角形（全体の番号）を覚える */
  buildBatch(list) {
    const subs = list.map((p) => {
      const g = p.e.geometry;
      const single = p.e.materials.length <= 1 || !g.groups.length;
      return slotGeometryAttrs(g, single ? { start: 0, count: g.index.count } : p.grp, SKIN_ATTRS);
    });
    const verts = subs.reduce((n, s) => n + s.count, 0), idx = subs.reduce((n, s) => n + s.index.length, 0);
    const geo = new BufferGeometry();
    const first = subs[0].attrs;
    const arrays = {};
    for (const name of Object.keys(first)) {
      const a = first[name];
      arrays[name] = new a.array.constructor(verts * a.itemSize);
      geo.setAttribute(name, new BufferAttribute(arrays[name], a.itemSize, a.normalized));
    }
    const pieces = [];
    let vo = 0;
    const full = new Uint32Array(idx);
    let io = 0;
    list.forEach((p, k) => {
      const s = subs[k], B = p.e.skinned.bindMatrix.elements;
      for (const name of Object.keys(arrays)) {
        const src = s.attrs[name].array, n = s.attrs[name].itemSize, dst = arrays[name];
        if (name === 'position' || name === 'normal') {
          const w = name === 'position' ? 1 : 0;
          for (let v = 0; v < s.count; v++) {
            const x = src[v * 3], y = src[v * 3 + 1], z = src[v * 3 + 2], o = (vo + v) * 3;
            dst[o] = B[0] * x + B[4] * y + B[8] * z + B[12] * w;
            dst[o + 1] = B[1] * x + B[5] * y + B[9] * z + B[13] * w;
            dst[o + 2] = B[2] * x + B[6] * y + B[10] * z + B[14] * w;
          }
        } else dst.set(src.subarray(0, s.count * n), vo * n);
      }
      const start = io;
      for (let i = 0; i < s.index.length; i++) full[io++] = s.index[i] + vo;
      pieces.push({ e: p.e, slot: p.slot, start, count: s.index.length });
      vo += s.count;
    });
    geo.setIndex(new BufferAttribute(new Uint32Array(idx), 1));
    geo.setDrawRange(0, 0);
    const e0 = list[0].e;
    const mesh = new SkinnedMesh(geo, e0.materials[list[0].slot]);
    mesh.name = '__skinBatch';
    mesh.bindMode = DetachedBindMode;
    mesh.bind(e0.skeleton, new Matrix4());
    mesh.matrixAutoUpdate = false;
    const X = new Matrix4().multiplyMatrices(worldMatrixOf(e0.skinned), e0.skinned.bindMatrixInverse);
    mesh.matrix.copy(X);
    mesh.matrixWorld.copy(X);
    const batch = { mesh, pieces, full, X, members: new Set(), dirty: true, cullable: true };
    // 画面の外なら描かない: 入っているメッシュの骨ごとの球（スキンの計算の空間）を包む球を、X でワールドに移して判定する
    mesh.frustumCulled = true;
    mesh.intersectsFrustum = (frustum) => {
      if (!batch.cullable) return true;
      const s = unionSkinSphere(batch);
      return !s || frustum.intersectsSphere(s);
    };
    this.group.add(mesh);
    return batch;
  }

  stats() {
    let meshes = 0;
    for (const st of this.state.values()) if (st.active) meshes++;
    return { meshes, batches: this.batches.length };
  }

  setEnabled(on) {
    if (this.enabled === on) return;
    this.enabled = on;
    if (!on) {
      for (const [e, st] of this.state) { st.active = false; e.skinned.layers.set(0); }
      for (const b of this.batches) { b.members.clear(); b.dirty = true; b.mesh.visible = false; }
    }
  }

  /** 描画の前に: メッシュごとに、まとめて描けるか（表示・X・材質）を決め、変わったまとまりの三角形の一覧を作り直す */
  sync() {
    if (!this.enabled) return;
    visStamp++;
    for (const [e, st] of this.state) {
      const o = e.skinned;
      let want = !st.never && shownInTree(o);
      if (want) {
        // メッシュの親を動かした（ポーズ確認など）: まとめたときの X（M · B⁻¹）と違えば、元のメッシュで描く。
        // M が前の sync と同じなら、前の判定のまま（X を計算し直さない）
        const M = worldMatrixOf(o).elements, last = st.last;
        let same = true;
        for (let i = 0; i < 16; i++) if (M[i] !== last[i]) { same = false; break; }
        if (!same) {
          last.set(M);
          const X = _x.multiplyMatrices(o.matrixWorld, o.bindMatrixInverse).elements;
          st.near = st.batches.every((b) => nearMatrix(X, b.X.elements));
        }
        want = st.near;
      }
      if (want === st.active) continue;
      st.active = want;
      if (++st.toggles > MAX_TOGGLES) { st.never = true; st.active = false; want = false; }
      o.layers.set(want ? BATCHED_LAYER : 0);
      for (const b of st.batches) {
        if (want) b.members.add(e); else b.members.delete(e);
        b.dirty = true;
      }
    }
    for (const b of this.batches) {
      // 材質は、入っているメッシュの今の材質（ライトなしの表示など）
      for (const e of b.members) {
        const p = b.pieces.find((x) => x.e === e);
        const mat = Array.isArray(e.skinned.material) ? e.skinned.material[p.slot] : e.skinned.material;
        if (b.mesh.material !== mat) b.mesh.material = mat;
        break;
      }
      if (!b.dirty) continue;
      b.dirty = false;
      const index = b.mesh.geometry.index;
      let n = 0;
      for (const p of b.pieces) {
        if (!b.members.has(p.e)) continue;
        index.array.set(b.full.subarray(p.start, p.start + p.count), n);
        n += p.count;
      }
      index.needsUpdate = true;
      b.mesh.geometry.setDrawRange(0, n);
      b.mesh.visible = n > 0;
      b.cullable = [...b.members].every((e) => e.cullGroup && e.skinCull);
    }
  }

  dispose() {
    for (const e of this.state.keys()) e.skinned.layers.set(0);
    for (const b of this.batches) b.mesh.geometry.dispose();
    this.group.removeFromParent();
    this.batches = [];
    this.state = new Map();
  }
}

/** まとまりに入っているメッシュの骨ごとの球を包む球（ワールド）。求められなければ null */
const _us = new Sphere(), _uc = new Vector3();
function unionSkinSphere(batch) {
  let has = false;
  const seen = new Set();
  for (const e of batch.members) {
    if (seen.has(e.cullGroup)) continue;
    seen.add(e.cullGroup);
    const g = groupSphereOf(e.cullGroup);
    if (!g) return null;
    _uc.set(g.cx, g.cy, g.cz);
    if (!has) { _us.center.copy(_uc); _us.radius = g.radius; has = true; continue; }
    // 2 つの球を包む球
    const d = _us.center.distanceTo(_uc);
    if (d + g.radius <= _us.radius) continue;
    if (d + _us.radius <= g.radius) { _us.center.copy(_uc); _us.radius = g.radius; continue; }
    const r = (d + _us.radius + g.radius) / 2;
    _us.center.lerp(_uc, (r - _us.radius) / d);
    _us.radius = r;
  }
  if (!has) return null;
  _us.applyMatrix4(batch.X);
  return _us;
}

/** ジオメトリの範囲 group（三角形の頂点の番号）の頂点だけの属性 { count, attrs: { 名前: { array, itemSize, normalized } }, index } */
function slotGeometryAttrs(geometry, group, names) {
  const src = geometry.index.array;
  const remap = new Map();
  const index = new Uint32Array(group.count);
  for (let i = 0; i < group.count; i++) {
    const v = src[group.start + i];
    let r = remap.get(v);
    if (r === undefined) { r = remap.size; remap.set(v, r); }
    index[i] = r;
  }
  const attrs = {};
  for (const name of names) {
    const a = geometry.getAttribute(name);
    if (!a) continue;
    const n = a.itemSize;
    const arr = new a.array.constructor(remap.size * n);
    for (const [v, r] of remap) for (let k = 0; k < n; k++) arr[r * n + k] = a.array[v * n + k];
    attrs[name] = { array: arr, itemSize: n, normalized: a.normalized };
  }
  return { count: remap.size, attrs, index };
}
