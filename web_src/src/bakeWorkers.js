// 再生キャッシュを Web Worker で作る（画面のスレッドを止めずに、コアの数だけ並べて作る）。
// ワーカーのコードは build.mjs が別にまとめて __RIG_WORKER_SOURCE__ に埋め込む（file:// のページからも起動できるよう Blob にする）。
// ワーカーが使えないとき（Node.js のテスト・起動に失敗したとき）は available が false になり、ビューアは従来どおり
// 画面のスレッドの空き時間に作る（main.js の scheduleBake）。
import { decodeBaked } from './rigBakeCore.js';

/* global __RIG_WORKER_SOURCE__ */
const SOURCE = typeof __RIG_WORKER_SOURCE__ === 'string' ? __RIG_WORKER_SOURCE__ : null;
const CHUNK = 8;                 // 1 回に頼むフレームの数（小さいほど早く届き、取り込みも細かくなる）
const START_DELAY = 300;         // 追加分が変わってから作り始めるまでの待ち（ms。ポーズ確認の操作中に作り直し続けないため）

export class BakeWorkers {
  /**
   * @param opts { count（ワーカーの数）, onImported(n)（取り込んだあと）, onError(message) }
   */
  constructor(opts = {}) {
    this.opts = opts;
    this.count = opts.count || Math.max(1, Math.min(4, ((typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2) - 1));
    this.workers = [];
    this.url = null;
    this.broken = !SOURCE || typeof Worker === 'undefined';
    this.token = 0;              // 評価器（アニメーション）ごとの番号。古い評価器の結果は捨てる
    this.rig = null;
    this.init = null;
    this.job = null;             // { id, sig, keys, poses, queue: フレーム, busy: 処理中のワーカーの数 }
    this.jobId = 0;
    this.timer = null;
    this.resetStats();
  }

  /** 評価のプロファイラに出す統計を消す（新しいアニメーションにしたとき） */
  resetStats() {
    this.stat = { frames: 0, workerMs: 0, wallMs: 0, wallFrames: 0, jobId: -1, jobBase: 0 };
  }

  /**
   * 評価のプロファイラに出す統計: { available, count, cores, frames（作ったフレーム）, perFrame（ワーカーの中の 1 フレームの
   * 評価の時間）, throughput（全体で 1 秒に作れたフレーム数。作り始めてから取り込むまで） }
   */
  stats() {
    const s = this.stat;
    return {
      available: this.available, count: this.count,
      cores: (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || null,
      frames: s.frames, perFrame: s.frames ? s.workerMs / s.frames : 0,
      throughput: s.wallMs > 0 ? (s.wallFrames * 1000) / s.wallMs : 0,
    };
  }

  get available() { return !this.broken; }

  /** 新しい評価器（アニメーション）にする。ワーカーは最初に頼むときに起動して、アニメーションを渡す */
  reset(rig, anim, nodes) {
    this.cancel();
    this.token++;
    this.resetStats();
    this.rig = rig;
    this.init = rig ? { anim, nodes } : null;
    for (const w of this.workers) w.ready = false;
  }

  /** いま作っているものを止める（ワーカーは止めない。処理中のフレームの結果は届けば取り込む） */
  cancel() {
    clearTimeout(this.timer);
    this.timer = null;
    this.job = null;
  }

  /** ワーカーをすべて終わらせる（ビューアを閉じる・シーンを消すとき） */
  dispose() {
    this.cancel();
    for (const w of this.workers) w.worker.terminate();
    this.workers = [];
    this.rig = null;
    this.init = null;
  }

  /**
   * 再生で使う追加分（pose = RigEvaluator.playbackPoseData()）の再生キャッシュを作る。todo() は、いま足りないフレーム。
   * 同じ追加分を作っている途中なら続ける。違えば、少し待ってから作り直す
   */
  request(pose, todo) {
    if (this.broken || !this.rig) return false;
    if (this.job && this.job.sig === pose.sig) return true;          // 作っている途中（再生中もそのまま続ける）
    this.cancel();
    this.timer = setTimeout(() => {
      this.timer = null;
      const frames = todo();
      if (!frames.length) return;
      this.job = { id: ++this.jobId, sig: pose.sig, keys: pose.keys, poses: pose.poses, queue: frames.slice(), busy: 0,
        start: performance.now() };
      this.ensureWorkers();
      for (const w of this.workers) this.dispatch(w);
    }, START_DELAY);
    return true;
  }

  ensureWorkers() {
    if (!this.url) this.url = URL.createObjectURL(new Blob([SOURCE], { type: 'text/javascript' }));
    while (this.workers.length < this.count) {
      let worker;
      try {
        worker = new Worker(this.url);
      } catch (err) {
        this.fail(`ワーカーを起動できません: ${err && err.message}`);
        return;
      }
      const w = { worker, ready: false, busy: false, token: -1 };
      worker.onmessage = (e) => this.onMessage(w, e.data);
      worker.onerror = (e) => this.fail(`ワーカーのエラー: ${e.message || e}`);
      this.workers.push(w);
    }
  }

  /** 空いているワーカーに、次のフレームを頼む */
  dispatch(w) {
    const job = this.job;
    if (this.broken || !job || w.busy) return;
    if (w.token !== this.token) {                         // このアニメーションをまだ渡していない
      w.worker.postMessage({ type: 'init', token: this.token, anim: this.init.anim, nodes: this.init.nodes });
      w.token = this.token;
    }
    const have = this.rig.layerFor(job.keys);
    const frames = [];
    while (job.queue.length && frames.length < CHUNK) {
      const f = job.queue.shift();
      if (!(have && have.frames.has(f))) frames.push(f);
    }
    if (!frames.length) { this.finishIfDone(); return; }
    w.busy = true;
    job.busy++;
    w.worker.postMessage({ type: 'bake', token: this.token, job: job.id, sig: job.sig, frames, poses: job.poses });
  }

  onMessage(w, m) {
    if (m.type === 'ready') return;
    if (m.type === 'error') { this.fail(m.message); return; }
    w.busy = false;
    const job = this.job;
    if (job && m.job === job.id) job.busy--;
    if (m.type === 'baked' && m.token === this.token && this.rig) {
      // 届いた結果は、作ったときの追加分のレイヤーに入れる（いまの追加分と違っても、その追加分の正しい値）
      const keys = job && m.job === job.id ? job.keys : null;
      if (keys) {
        const r = decodeBaked(m);
        const st = this.stat;
        st.frames += r.frames.length;
        st.workerMs += m.ms || 0;
        // 全体の速さ: 作り始めてから、いま取り込んだところまで（ジョブごとの区間を足す）
        const now = performance.now();
        if (st.jobId !== job.id) { st.jobId = job.id; st.jobBase = st.wallMs; }
        st.wallMs = st.jobBase + (now - job.start);
        st.wallFrames += r.frames.length;
        const n = this.rig.importSnapshots(keys, r.frames, r.deps, r.poseReads);
        if (n < r.frames.length && this.rig.playbackFull) job.queue.length = 0;   // 上限に達した
        if (this.opts.onImported) this.opts.onImported(n);
      }
    }
    if (this.job) this.dispatch(w);
    this.finishIfDone();
  }

  finishIfDone() {
    const job = this.job;
    if (job && !job.queue.length && job.busy <= 0) {
      this.job = null;
      if (this.opts.onDone) this.opts.onDone();
    }
  }

  fail(message) {
    if (this.broken) return;
    this.broken = true;
    this.dispose();
    if (this.opts.onError) this.opts.onError(message);
  }
}
