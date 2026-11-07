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
import { BatchedMesh, BufferAttribute, BufferGeometry, Group } from 'three';
import { worldMatrixOf } from './sceneBuilder.js';

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
function shownInTree(o) {
  for (let p = o; p; p = p.parent) if (!p.visible) return false;
  return true;
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
