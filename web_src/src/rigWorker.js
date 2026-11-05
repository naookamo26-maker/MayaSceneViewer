// 再生キャッシュを作る Web Worker（build.mjs で別にまとめ、ビューアに文字列として埋め込む。bakeWorkers.js が起動する）
import { bakeFrames, createBaker } from './rigBakeCore.js';

let baker = null;
let token = -1;

self.onmessage = (e) => {
  const m = e.data;
  try {
    if (m.type === 'init') {
      baker = createBaker(m.anim, m.nodes);
      token = m.token;
      self.postMessage({ type: 'ready', token });
    } else if (m.type === 'bake') {
      if (!baker || m.token !== token) { self.postMessage({ type: 'skipped', token: m.token, job: m.job }); return; }
      const r = bakeFrames(baker, m);
      self.postMessage({ type: 'baked', token, job: m.job, keysSig: m.sig, ...r }, r.frames.map((fr) => fr.mats.buffer));
    }
  } catch (err) {
    self.postMessage({ type: 'error', token: m.token, job: m.job, message: String((err && err.stack) || err) });
  }
};
