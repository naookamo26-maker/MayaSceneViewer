// GPU のスキン変形が CPU の計算（Maya の式）と一致するかを、描画結果の画素で比べる自己診断。
// 開発者ツールから window.mayaViewer.debug.checkSkinning() で実行できる。
import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Vector3, WebGLRenderTarget } from 'three';
import { enableEightInfluences } from './skinning8.js';
import { renderVertexWorldPosition } from './sceneBuilder.js';

const LAYER_GPU = 30;
const LAYER_CPU = 31;

/**
 * @param app ViewerApp  @param meshIndex 対象メッシュ
 * @param opts.eightOnGpu false にすると three.js 標準（4 インフルエンス）のシェーダーで描く（比較の対照用）
 * @returns {{covered:number, mismatch:number, ratio:number}} ratio = 不一致画素 / 塗られた画素
 */
export function compareGpuCpuSkinning(app, meshIndex = 0, opts = {}) {
  const size = opts.size || 384;
  const eightOnGpu = opts.eightOnGpu !== false;
  const { renderer, camera, scene } = app;
  const e = app.built.meshes[meshIndex];
  if (!e || !e.skinned) throw new Error('スキン付きメッシュではありません');
  app.built.root.updateMatrixWorld(true);

  // CPU 側: 変形後のワールド座標でメッシュを作る（表示用頂点の単位）
  const count = e.geometry.attributes.position.count;
  const pos = new Float32Array(count * 3);
  const v = new Vector3();
  for (let i = 0; i < count; i++) {
    renderVertexWorldPosition(e, i, true, v);
    pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(pos, 3));
  g.setIndex(e.geometry.index);
  const matCpu = new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide });
  const cpu = new Mesh(g, matCpu);
  cpu.frustumCulled = false;
  cpu.layers.set(LAYER_CPU);
  scene.add(cpu);
  cpu.updateMatrixWorld(true);

  const matGpu = new MeshBasicMaterial({ color: 0xff0000, side: DoubleSide });
  if (eightOnGpu) enableEightInfluences(matGpu);
  const saved = {
    material: e.skinned.material, layers: e.skinned.layers.mask, visible: e.skinned.visible,
    cam: camera.layers.mask, aspect: camera.aspect, target: renderer.getRenderTarget(),
  };
  e.skinned.material = matGpu;
  e.skinned.layers.set(LAYER_GPU);
  e.skinned.visible = true;
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  const rt = new WebGLRenderTarget(size, size);
  const read = (layer) => {
    camera.layers.set(layer);
    renderer.setRenderTarget(rt);
    renderer.clear();
    renderer.render(scene, camera);
    const buf = new Uint8Array(size * size * 4);
    renderer.readRenderTargetPixels(rt, 0, 0, size, size, buf);
    return buf;
  };
  let a, b;
  try {
    a = read(LAYER_GPU);
    b = read(LAYER_CPU);
  } finally {
    renderer.setRenderTarget(saved.target);
    camera.layers.mask = saved.cam;
    camera.aspect = saved.aspect;
    camera.updateProjectionMatrix();
    e.skinned.material = saved.material;
    e.skinned.layers.mask = saved.layers;
    e.skinned.visible = saved.visible;
    scene.remove(cpu);
    g.dispose(); matCpu.dispose(); matGpu.dispose(); rt.dispose();
    app.requestRender();
  }
  let covered = 0, mismatch = 0;
  for (let i = 3; i < a.length; i += 4) {
    const ia = a[i] > 127, ib = b[i] > 127;
    if (ia || ib) covered++;
    if (ia !== ib) mismatch++;
  }
  return { covered, mismatch, ratio: covered ? mismatch / covered : 0 };
}
