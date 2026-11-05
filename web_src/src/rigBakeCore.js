// 再生キャッシュを別の評価器（Web Worker）で作るための中核。DOM に依存しないので Node.js でもテストできる。
//   ワーカー: createBaker → bakeFrames（結果は postMessage で送れる形）
//   ビューア: decodeBaked で戻して RigEvaluator.importSnapshots に入れる
import { Matrix4, Vector3 } from 'three';
import { AnimationClip } from './animation.js';
import { RigEvaluator } from './rig.js';
import { makeCurve } from './curve.js';

/**
 * 評価器を作る。動かないノードのローカル行列は nodes の matrix（ビューアの fileMatrix と同じ値）
 * @param anim 共通 JSON の animation（オブジェクトか JSON の文字列）  @param nodes 共通 JSON の nodes
 */
export function createBaker(anim, nodes) {
  const data = typeof anim === 'string' ? JSON.parse(anim) : anim;
  const clip = new AnimationClip(data);
  const statics = nodes.map((n) => new Matrix4().fromArray(n.matrix));
  const rig = new RigEvaluator(clip, nodes, (ni) => statics[ni]);
  rig.setPlaybackLimit(Number.MAX_SAFE_INTEGER);      // 作ったフレームはすぐ送って捨てるので、上限はなし
  return { rig, sentDeps: new Map(), sentReads: new Set() };
}

/** カーブの形を送れる形にする（CV の Vector3 を平らな配列に） */
export function encodeCurve(v) {
  if (!v || !v.isCurve) return v;
  const cvs = new Float64Array(v.cvs.length * 3);
  v.cvs.forEach((p, i) => { cvs[i * 3] = p.x; cvs[i * 3 + 1] = p.y; cvs[i * 3 + 2] = p.z; });
  return { isCurve: true, degree: v.degree, form: v.form, knots: v.knots, cvs, weights: v.weights };
}

export function decodeCurve(c) {
  if (!c || !c.isCurve || !(c.cvs instanceof Float64Array)) return c;
  const cvs = [];
  for (let i = 0; i < c.cvs.length; i += 3) cvs.push(new Vector3(c.cvs[i], c.cvs[i + 1], c.cvs[i + 2]));
  return makeCurve(c.degree, c.form, c.knots, cvs, c.weights);
}

/**
 * フレームを評価して、再生キャッシュに入れる値を返す。
 * @param req { frames: 整数のフレーム, poses: [[ノード番号, 行列の 16 要素 | null, 目印]]（RigEvaluator.playbackPoseData） }
 * @returns { frames: [{ f, mats: Float64Array, props, curves: [[グラフの id, カーブ]] }], deps: [[動くノード, ノード…]],
 *   poseReads: [追加分を読んだノード] }。deps・poseReads は前回から増えたものだけ
 */
export function bakeFrames(baker, req) {
  const { rig } = baker;
  let poseOf, poseKey;
  if (req.poses && req.poses.length) {
    const mats = new Map();
    for (const [ni, m] of req.poses) if (m) mats.set(ni, new Matrix4().fromArray(m));
    poseOf = (ni) => mats.get(ni) || null;
    poseKey = new Map(req.poses.map((p) => [p[0], p[2]]));
  }
  const scratch = new Map();
  const frames = [];
  for (const f of req.frames) {
    rig.evaluate(f, poseOf, scratch, poseKey);
    const cur = rig.current;
    if (!cur) continue;
    if (rig.props.length) rig.evaluateProps();
    for (const gid of rig.curveIds()) rig.curveShape(gid);
    frames.push({ f, mats: cur.mats, props: cur.props, curves: [...cur.curves].map(([g, v]) => [g, encodeCurve(v)]) });
  }
  const deps = [];
  for (const [ni, set] of rig.nodeDeps) {
    if (baker.sentDeps.get(ni) === set.size) continue;
    baker.sentDeps.set(ni, set.size);
    deps.push([ni, [...set]]);
  }
  const poseReads = [];
  for (const n of rig.poseReads) if (!baker.sentReads.has(n)) { baker.sentReads.add(n); poseReads.push(n); }
  rig.clearPlayback();                                  // 送ったものは捨てる（時間で変わらない値の使い回しは残る）
  return { frames, deps, poseReads };
}

/** bakeFrames の結果（postMessage で受け取ったもの）を、importSnapshots に渡せる形に戻す */
export function decodeBaked(result) {
  return {
    frames: result.frames.map((fr) => ({ f: fr.f, mats: fr.mats, props: fr.props,
      curves: new Map(fr.curves.map(([g, c]) => [g, decodeCurve(c)])) })),
    deps: result.deps,
    poseReads: result.poseReads || [],
  };
}
