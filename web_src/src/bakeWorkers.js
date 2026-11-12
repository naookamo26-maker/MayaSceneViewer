// 再生キャッシュを Web Worker で作る（画面のスレッドを止めずに、コアの数だけ並べて作る）。
// ワーカーのコードは build.mjs が別にまとめて __RIG_WORKER_SOURCE__ に埋め込む（file:// のページからも起動できるよう Blob にする）。
// ワーカーが使えないとき（Node.js のテスト・起動に失敗したとき）は available が false になり、ビューアは従来どおり
// 画面のスレッドの空き時間に作る（main.js の scheduleBake）。
import { decodeBaked } from './rigBakeCore.js';

/* global __RIG_WORKER_SOURCE__ */
const SOURCE = typeof __RIG_WORKER_SOURCE__ === 'string' ? __RIG_WORKER_SOURCE__ : null;
const CHUNK = 8;                 // 1 回に頼むフレームの数（小さいほど早く届き、取り込みも細かくなる）
// ワーカーごとの最初の頼みは 1 フレームにする（最初のフレームは、汎用の経路での評価と専用の評価の計画を作るので重い。
// 早く結果を届け、2 回目からは専用の評価で CHUNK ずつ作る）
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
    this.paused = false;         // 止めている（評価のプロファイラの記録中。CPU を取り合うと、測る値が大きくなる）
    this.resetStats();
  }

  /** 作るのを止める・続ける（止めているあいだは、新しいフレームを頼まない。頼んだ分は受け取る） */
  setPaused(on) {
    this.paused = !!on;
    if (!this.paused && this.job) for (const w of this.workers) this.dispatch(w);
  }

  /** 評価のプロファイラに出す統計を消す（新しいアニメーションにしたとき） */
  resetStats() {
    // firstMs: 作り始めてから最初の結果を取り込むまで・timing: ワーカーの中の時間（rigBakeCore.js の bakerTiming。最初のフレームが
    // いちばん遅かったワーカーのもの）
    this.stat = { frames: 0, workerMs: 0, wallMs: 0, wallFrames: 0, jobId: -1, jobBase: 0, firstMs: null, timing: null, startedAt: null,
      sendMs: 0 };                    // sendMs: アニメーションをワーカーに送るのに、画面のスレッドでかかった時間（複製）
  }

  /**
   * 評価のプロファイラに出す統計: { available, count, busy（いま作っている）, cores, frames（読み込んでから作ったフレーム）, perFrame（ワーカーの中の 1 フレームの
   * 評価の時間）, throughput（全体で 1 秒に作れたフレーム数。作り始めてから取り込むまで） }
   */
  stats() {
    const s = this.stat;
    return {
      available: this.available, count: this.count, busy: !!this.job, error: this.error || null,
      firstMs: s.firstMs, waitingMs: s.firstMs === null && s.startedAt !== null ? performance.now() - s.startedAt : null,
      timing: s.timing, sendMs: s.sendMs,
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
    this.warm();
  }

  /**
   * ワーカーを起動して、アニメーションを先に渡しておく（ワーカーの準備は重い: 評価器を作り、自作ノードの定義を関数にする。
   * 最初に頼むときまで待たずに始めると、画面側の残りの読み込み・最初の表示と並んで進む）
   */
  warm() {
    if (this.broken || !this.init || !this.rig) return;
    this.ensureWorkers();
    if (this.broken) return;
    this.stat.startedAt = performance.now();
    for (const w of this.workers) this.sendInit(w);
  }

  /** ワーカーに、いまのアニメーションを渡す（まだなら） */
  sendInit(w) {
    if (w.token === this.token) return;
    const t = performance.now();
    w.worker.postMessage({ type: 'init', token: this.token, anim: this.init.anim, nodes: this.init.nodes,
      chainSolver: this.rig.chainSolver, sentAt: performance.timeOrigin + t });
    this.stat.sendMs += performance.now() - t;
    w.token = this.token;
    w.sent = 0;
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
  request(pose, todo, reorder = false) {
    if (this.broken || !this.rig) return false;
    if (this.job && this.job.sig === pose.sig) {                       // 作っている途中（再生中もそのまま続ける）
      // いまの位置が飛んだら、残りの順番を並べ替える（いまワーカーが作っているフレームは除く）
      if (reorder) this.job.queue = todo().filter((f) => !this.job.inflight.has(f));
      return true;
    }
    this.cancel();
    this.timer = setTimeout(() => {
      this.timer = null;
      const frames = todo();
      if (!frames.length) return;
      this.job = { id: ++this.jobId, sig: pose.sig, keys: pose.keys, poses: pose.poses, queue: frames.slice(), busy: 0,
        start: performance.now(), inflight: new Set() };      // inflight: ワーカーが作っているフレーム
      if (this.stat.startedAt === null) this.stat.startedAt = this.job.start;   // warm していないとき
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
    if (this.broken || !job || w.busy || this.paused) return;
    this.sendInit(w);                                     // このアニメーションをまだ渡していなければ渡す
    const have = this.rig.layerFor(job.keys);
    const frames = [];
    const chunk = w.sent ? CHUNK : 1;
    while (job.queue.length && frames.length < chunk) {
      const f = job.queue.shift();
      if (!(have && have.frames.has(f))) frames.push(f);
    }
    if (!frames.length) { this.finishIfDone(); return; }
    w.busy = true;
    w.sent++;
    job.busy++;
    w.frames = frames;
    for (const f of frames) job.inflight.add(f);
    w.worker.postMessage({ type: 'bake', token: this.token, job: job.id, sig: job.sig, frames, poses: job.poses, f32: !!this.f32 });
  }

  /**
   * ［このフレームを確かめる］: 実際のワーカーでフレームを評価する。fresh なら新しく起動したワーカー（新しい評価器）、
   * そうでなければ、いま動いているワーカー（多くのフレームを作ったあとの評価器）。{ frames: [{ f, mats }], info } か null
   */
  probe(frames, fresh) {
    if (this.broken || !this.init || !SOURCE) return Promise.resolve(null);
    const id = this.probeId = (this.probeId || 0) + 1;
    return new Promise((resolve) => {
      const done = (r) => { clearTimeout(timer); resolve(r); };
      const timer = setTimeout(() => done(null), 120000);
      if (fresh) {
        if (!this.url) this.url = URL.createObjectURL(new Blob([SOURCE], { type: 'text/javascript' }));
        let worker;
        try { worker = new Worker(this.url); } catch (e) { done(null); return; }
        worker.onmessage = (e) => {
          if (e.data.type !== 'probe') return;
          worker.terminate();
          done(e.data.frames ? e.data : null);
        };
        worker.onerror = () => { worker.terminate(); done(null); };
        worker.postMessage({ type: 'probe', id, fresh: true, frames, anim: this.init.anim, nodes: this.init.nodes,
          chainSolver: this.rig && this.rig.chainSolver });
        return;
      }
      const w = this.workers.find((x) => x.token === this.token);
      if (!w) { done(null); return; }
      (this.probes || (this.probes = new Map())).set(id, (r) => done(r && r.frames ? r : null));
      w.worker.postMessage({ type: 'probe', id, token: this.token, frames });
    });
  }

  onMessage(w, m) {
    if (m.type === 'ready') return;
    if (m.type === 'probe') {                       // ［このフレームを確かめる］の結果（作っている途中の数え方には入れない）
      const cb = this.probes && this.probes.get(m.id);
      if (cb) { this.probes.delete(m.id); cb(m); }
      return;
    }
    if (m.type === 'error') { this.fail(m.message); return; }
    w.busy = false;
    const job = this.job;
    if (job && m.job === job.id) {
      job.busy--;
      for (const f of w.frames || []) job.inflight.delete(f);
    }
    if (m.type === 'baked' && m.token === this.token && this.rig) {
      // 届いた結果は、作ったときの追加分のレイヤーに入れる（いまの追加分と違っても、その追加分の正しい値）
      const keys = job && m.job === job.id ? job.keys : null;
      if (keys) {
        const r = decodeBaked(m);
        const st = this.stat;
        if (st.firstMs === null && st.startedAt !== null) st.firstMs = performance.now() - st.startedAt;
        const tm = m.timing;
        if (tm && tm.firstMs !== null && (!st.timing || tm.firstMs >= st.timing.firstMs)) st.timing = tm;
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
    this.error = message;                            // 評価のプロファイラに出す（使えなくなった理由）
    this.dispose();
    if (this.opts.onError) this.opts.onError(message);
  }
}
