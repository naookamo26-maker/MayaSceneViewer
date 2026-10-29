// タイムライン（ビューポート下端）。再生・コマ送り・スライダー・キーの位置の表示。
// 操作は app（main.js）に任せ、ここは表示と入力だけを扱う。
const $ = (id) => document.getElementById(id);
const THUMB = 7;           // スライダーのつまみの半径（目盛りの位置をつまみの中心に合わせる）
const CACHE_BAND = 2;      // 再生キャッシュの帯の太さ（キャンバスの上端。キーの印より上）
const KEY_TOP = 5;         // キーの印の上端（キャッシュの帯と隙間を空ける。キャンバスはスライダーより 5px 上から）

const fmtFrame = (f) => (Number.isInteger(f) ? String(f) : f.toFixed(2));

export class Timeline {
  constructor(app) {
    this.app = app;
    this.clip = null;
    this.status = '';
    this.keys = [];
    this.cached = null;      // (f) => boolean  再生キャッシュにあるフレーム（なければ帯を描かない）
    this.root = $('timeline');
    if (!this.root) return;
    this.slider = $('tl-slider');
    this.canvas = $('tl-keys');
    const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
    on('tl-play', 'click', () => app.togglePlay());
    on('tl-prev', 'click', () => app.stepFrame(-1));
    on('tl-next', 'click', () => app.stepFrame(1));
    on('tl-prev-key', 'click', () => app.stepKey(-1));
    on('tl-next-key', 'click', () => app.stepKey(1));
    on('tl-first', 'click', () => app.goToEdge(-1));
    on('tl-last', 'click', () => app.goToEdge(1));
    this.slider.addEventListener('input', () => app.scrubTo(+this.slider.value));
    on('tl-frame', 'change', (e) => {
      const v = +e.target.value;
      if (Number.isFinite(v)) app.scrubTo(v); else this.setFrame(app.frame);
    });
    const range = () => app.setPlaybackRange(+$('tl-start').value, +$('tl-end').value);
    on('tl-start', 'change', range);
    on('tl-end', 'change', range);
    // 入力欄で Enter を押したら確定してフォーカスを外す（以降のキー操作をビューアに戻す）
    for (const id of ['tl-frame', 'tl-start', 'tl-end']) {
      on(id, 'keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });
    }
    new ResizeObserver(() => this.drawKeys()).observe(this.slider);
  }

  /** 読み込み状況（アニメーションがまだないときだけ帯に表示する）。空文字で消す */
  setStatus(text) {
    if (!this.root) return;
    this.status = text || '';
    $('tl-status').textContent = this.status;
    this.updateVisibility();
  }

  setClip(clip) {
    if (!this.root) return;
    this.clip = clip;
    if (clip) {
      this.status = '';
      $('tl-status').textContent = '';
      this.setRange(clip.start, clip.end);
      $('tl-info').textContent = `${fmtFrame(clip.fps)} fps`;
      $('tl-info').title = `時間単位: ${clip.raw.timeUnit || '?'}（アニメーションの範囲 ${fmtFrame(+clip.raw.animStart)}〜${fmtFrame(+clip.raw.animEnd)}）`;
      this.setFrame(clip.current);
    }
    this.root.classList.toggle('loading', !clip);
    for (const el of this.root.querySelectorAll('button, input')) el.disabled = !clip;
    this.updateVisibility();
  }

  updateVisibility() {
    const show = !!(this.clip || this.status);
    this.root.hidden = !show;
    document.getElementById('viewport').classList.toggle('has-timeline', show);
    if (show) this.drawKeys();
  }

  setRange(start, end) {
    this.slider.min = String(start);
    this.slider.max = String(end);
    $('tl-start').value = fmtFrame(start);
    $('tl-end').value = fmtFrame(end);
    this.drawKeys();
  }

  setFrame(f) {
    if (!this.root) return;
    this.slider.value = String(f);
    const input = $('tl-frame');
    if (document.activeElement !== input) input.value = fmtFrame(f);
  }

  setPlaying(on) {
    const b = $('tl-play');
    if (!b) return;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.title = on ? '停止（Alt+V）' : '再生（Alt+V）';
    b.setAttribute('aria-label', on ? '停止' : '再生');
    b.querySelector('.ic-play').style.display = on ? 'none' : '';
    b.querySelector('.ic-pause').style.display = on ? '' : 'none';
  }

  /** キーの時刻（選択ノードのもの、なければすべて）をスライダーの下に目盛りで描く */
  setKeys(times, label) {
    this.keys = times || [];
    if (this.canvas) this.canvas.title = label || '';
    this.drawKeys();
  }

  /**
   * 再生キャッシュにあるフレームを、スライダーの上端より少し上に緑の帯で描く（キーの印と重ならない高さ）。
   * has: (f) => boolean（null で消す）
   */
  setCached(has) {
    this.cached = has;
    this.drawKeys();
  }

  drawKeys() {
    const c = this.canvas;
    if (!c || !this.clip || this.root.hidden) return;
    const w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const s = this.clip.start, e = this.clip.end;
    const span = Math.max(e - s, 1e-9);
    const x = (t) => THUMB + ((t - s) / span) * (w - 2 * THUMB);
    // フレームの目盛り（多すぎるときは間引く）
    const step = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((k) => (w - 2 * THUMB) / (span / k) >= 6) || 1000;
    g.fillStyle = 'rgba(142, 151, 161, 0.35)';
    for (let t = Math.ceil(s / step) * step; t <= e; t += step) g.fillRect(Math.round(x(t)), h - 4, 1, 4);
    // 再生キャッシュにあるフレーム（続いているフレームは 1 本の帯にする）
    if (this.cached) {
      g.fillStyle = '#5fb37a';
      const f0 = Math.ceil(s), f1 = Math.floor(e);
      const left = (f) => Math.max(THUMB, x(f - 0.5)), right = (f) => Math.min(w - THUMB, x(f + 0.5));
      let run = null;
      for (let f = f0; f <= f1 + 1; f++) {
        if (f <= f1 && this.cached(f)) { if (run === null) run = f; continue; }
        if (run !== null) {
          const a = Math.floor(left(run)), b = Math.ceil(right(f - 1));
          g.fillRect(a, 0, Math.max(b - a, 1), CACHE_BAND);
          run = null;
        }
      }
    }
    // キー（キャッシュの帯の下から）
    g.fillStyle = '#e5675b';
    for (const t of this.keys) {
      if (t < s - 1e-6 || t > e + 1e-6) continue;
      g.fillRect(Math.round(x(t)) - 1, KEY_TOP, 2, h - KEY_TOP);
    }
  }
}
