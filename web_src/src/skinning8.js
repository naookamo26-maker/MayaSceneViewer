// 1 頂点あたり 8 インフルエンスまでのスキニング。
//
// three.js 標準の SkinnedMesh は 4 インフルエンス（skinIndex / skinWeight の vec4 1 組）まで。
// ここでは 2 組目（skinIndex1 / skinWeight1）を追加し、
//   * GPU: マテリアルのシェーダーを差し替えて 8 本の骨の行列を合成する
//   * CPU: 頂点ピックや表示範囲の計算に使う applyBoneTransform も 8 本で計算する
// three.js r160 のシェーダーチャンクを基にしている（r187 でも同じ内容であることを確認済み。バージョンを上げるときは要確認）。
import { Matrix4, Vector3, Vector4 } from 'three';

export const MAX_INFLUENCES = 8;
const PROGRAM_KEY = 'maya-viewer-skin8';

const PARS = /* glsl */`
#include <skinning_pars_vertex>
#ifdef USE_SKINNING
	attribute vec4 skinIndex1;
	attribute vec4 skinWeight1;
#endif
`;

const BASE = /* glsl */`
#include <skinbase_vertex>
#ifdef USE_SKINNING
	mat4 boneMat1X = getBoneMatrix( skinIndex1.x );
	mat4 boneMat1Y = getBoneMatrix( skinIndex1.y );
	mat4 boneMat1Z = getBoneMatrix( skinIndex1.z );
	mat4 boneMat1W = getBoneMatrix( skinIndex1.w );
#endif
`;

const NORMAL = /* glsl */`
#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix += skinWeight1.x * boneMat1X;
	skinMatrix += skinWeight1.y * boneMat1Y;
	skinMatrix += skinWeight1.z * boneMat1Z;
	skinMatrix += skinWeight1.w * boneMat1W;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif
`;

const VERTEX = /* glsl */`
#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned += boneMat1X * skinVertex * skinWeight1.x;
	skinned += boneMat1Y * skinVertex * skinWeight1.y;
	skinned += boneMat1Z * skinVertex * skinWeight1.z;
	skinned += boneMat1W * skinVertex * skinWeight1.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif
`;

/** 頂点シェーダーのソースを 8 インフルエンス版にする（テスト用に公開） */
export function patchVertexShader(src) {
  const rep = (s, from, to) => {
    if (!s.includes(from)) throw new Error('シェーダーに ' + from + ' が見つかりません（three.js のバージョンを確認してください）');
    return s.replace(from, to);
  };
  let s = src;
  s = rep(s, '#include <skinning_pars_vertex>', PARS);
  s = rep(s, '#include <skinbase_vertex>', BASE);
  if (s.includes('#include <skinnormal_vertex>')) s = s.replace('#include <skinnormal_vertex>', NORMAL);
  s = rep(s, '#include <skinning_vertex>', VERTEX);
  return s;
}

/**
 * マテリアルを 8 インフルエンス対応にする。スキンなしのメッシュでは USE_SKINNING が
 * 定義されないので、同じマテリアルを共有していても影響しない。
 * スキン付きジオメトリには skinIndex1 / skinWeight1 を必ず持たせること
 * （無い属性は既定値 (0,0,0,1) になり、ウェイトが紛れ込むため）。
 */
export function enableEightInfluences(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = patchVertexShader(shader.vertexShader);
  };
  material.customProgramCacheKey = () => PROGRAM_KEY;
  material.needsUpdate = true;
  return material;
}

const _base = new Vector3();
const _tmp = new Vector3();
const _si = new Vector4();
const _sw = new Vector4();
const _m = new Matrix4();
const SETS = [['skinIndex', 'skinWeight'], ['skinIndex1', 'skinWeight1']];

/** SkinnedMesh.applyBoneTransform の 8 インフルエンス版（結果はメッシュのローカル空間） */
export function applyBoneTransform8(mesh, index, vector) {
  const skeleton = mesh.skeleton;
  const attrs = mesh.geometry.attributes;
  _base.copy(vector).applyMatrix4(mesh.bindMatrix);
  vector.set(0, 0, 0);
  for (const [si, sw] of SETS) {
    const ia = attrs[si], wa = attrs[sw];
    if (!ia || !wa) continue;
    _si.fromBufferAttribute(ia, index);
    _sw.fromBufferAttribute(wa, index);
    for (let i = 0; i < 4; i++) {
      const w = _sw.getComponent(i);
      if (w !== 0) {
        const b = _si.getComponent(i);
        _m.multiplyMatrices(skeleton.bones[b].matrixWorld, skeleton.boneInverses[b]);
        vector.addScaledVector(_tmp.copy(_base).applyMatrix4(_m), w);
      }
    }
  }
  return vector.applyMatrix4(mesh.bindMatrixInverse);
}

/** SkinnedMesh の CPU 側計算（ピック・表示範囲）を 8 インフルエンス版にする */
export function useEightInfluencesOnCpu(mesh) {
  mesh.applyBoneTransform = function applyBoneTransform(index, vector) {
    return applyBoneTransform8(this, index, vector);
  };
  return mesh;
}
