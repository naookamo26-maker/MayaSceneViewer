// 再生キャッシュを作る Web Worker（build.mjs で別にまとめ、ビューアに文字列として埋め込む。bakeWorkers.js が起動する）
import { bakeFrames, createBaker, bakerInfo } from './rigBakeCore.js';

let baker = null;
let token = -1;

self.onmessage = (e) => {
  const m = e.data;
  try {
    if (m.type === 'init') {
      // 受け取り: 画面のスレッドが送ってから、ここに届くまで（複製を受け取る時間・ワーカーの起動を含む）
      const recvMs = m.sentAt ? performance.timeOrigin + performance.now() - m.sentAt : null;
      baker = createBaker(m.anim, m.nodes);
      baker.timing.recvMs = recvMs;
      token = m.token;
      self.postMessage({ type: 'ready', token });
    } else if (m.type === 'probe') {
      // ［このフレームを確かめる］: 指定したフレームを評価して、値とワーカーの中の状態を返す（新しい評価器か、いまの評価器で）
      const b = m.fresh ? createBaker(m.anim, m.nodes) : (m.token === token ? baker : null);
      if (!b) { self.postMessage({ type: 'probe', id: m.id, frames: null }); return; }
      const r = bakeFrames(b, { frames: m.frames, poses: [] });
      self.postMessage({ type: 'probe', id: m.id, frames: r.frames.map((fr) => ({ f: fr.f, mats: fr.mats })), info: bakerInfo(b) });
    } else if (m.type === 'bake') {
      if (!baker || m.token !== token) { self.postMessage({ type: 'skipped', token: m.token, job: m.job }); return; }
      const r = bakeFrames(baker, m);
      self.postMessage({ type: 'baked', token, job: m.job, keysSig: m.sig, ...r }, r.frames.map((fr) => fr.mats.buffer));
    }
  } catch (err) {
    self.postMessage({ type: 'error', token: m.token, job: m.job, message: String((err && err.stack) || err) });
  }
};
