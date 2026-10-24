// カメラシーケンサ（共通 JSON の sequencer）: ショットの選び方・時間の対応と、下部のパネル。
//
// ショットはシーンの startFrame〜endFrame を、シーケンスの sequenceStartFrame から scale 倍の長さで並べたもの
// （前後の preHold・postHold のあいだは最初・最後のフレームで止まる）。シーケンスのフレーム f は [f, f + 1) を占める。
// 同じフレームに複数のショットがあるときは、トラックの番号が大きい（パネルで上に表示する）ショットを使う。
// ミュートしたショットは使わない。

/** シーケンスのフレーム seq で使うショット（なければ null） */
export function activeShot(shots, seq) {
  let best = null;
  for (const s of shots || []) {
    if (s.mute || seq < s.sequenceStartFrame || seq >= s.sequenceEndFrame + 1) continue;
    if (!best || s.track > best.track || (s.track === best.track && s.sequenceStartFrame > best.sequenceStartFrame)) best = s;
  }
  return best;
}

/** シーケンスのフレーム seq に対応する、ショットのシーンのフレーム */
export function shotTime(shot, seq) {
  const scale = Math.abs(shot.scale) > 1e-9 ? shot.scale : 1;
  let local = seq - shot.sequenceStartFrame - (shot.preHold || 0);
  if (local <= 0) return shot.startFrame;
  const play = (shot.endFrame - shot.startFrame) * scale;
  if (local >= play) return shot.endFrame;
  local /= scale;
  return shot.startFrame + local;
}

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtF = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** 下部のパネル（トラックごとのショットの並び・再生ボタン・シーケンスのフレーム） */
export class SequencerPanel {
  constructor(app) {
    this.app = app;
    this.seq = null;
    $('seq-play').addEventListener('click', () => app.toggleSequencePlay());
    $('seq-first').addEventListener('click', () => app.setSequenceFrame(this.seq ? this.seq.start : 0, { follow: true }));
    $('seq-prev-shot').addEventListener('click', () => app.stepShot(-1));
    $('seq-next-shot').addEventListener('click', () => app.stepShot(1));
    $('seq-last').addEventListener('click', () => app.setSequenceFrame(this.seq ? this.seq.end : 0, { follow: true }));
    $('seq-follow').addEventListener('change', (e) => app.setSequenceFollow(e.target.checked));
    $('seq-frame').addEventListener('change', (e) => {
      const v = parseFloat(e.target.value);
      if (Number.isFinite(v)) app.setSequenceFrame(v, { follow: true });
    });
    $('seq-collapse').addEventListener('click', () => this.setCollapsed(!document.body.classList.contains('sequencer-collapsed')));
    // トラックの上をクリック・ドラッグしてシーケンスのフレームを動かす
    const lanes = $('seq-lanes');
    let drag = false;
    const scrub = (e) => {
      if (!this.seq) return;
      const r = lanes.getBoundingClientRect();
      const x = Math.min(Math.max((e.clientX - r.left) / Math.max(r.width, 1), 0), 0.9999);
      app.setSequenceFrame(Math.floor(this.seq.start + x * this.span()), { follow: true });
    };
    lanes.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = true;
      try { lanes.setPointerCapture(e.pointerId); } catch (err) { /* 合成イベントなど */ }
      app.pauseSequence();
      scrub(e);
    });
    lanes.addEventListener('pointermove', (e) => { if (drag) scrub(e); });
    const end = () => { drag = false; };
    lanes.addEventListener('pointerup', end);
    lanes.addEventListener('pointercancel', end);
  }

  /** シーケンスの長さ（フレーム。最後のフレームも 1 フレーム分の幅を持つ） */
  span() { return Math.max(this.seq.end + 1 - this.seq.start, 1); }

  pct(f) { return ((f - this.seq.start) / this.span()) * 100; }

  setCollapsed(on) {
    document.body.classList.toggle('sequencer-collapsed', on);
    $('seq-collapse').setAttribute('aria-expanded', String(!on));
    $('seq-collapse').textContent = on ? '▾' : '▴';         // パネルはビューポートの上: 閉じると上に縮む
    $('seq-collapse').title = on ? 'カメラシーケンサを開く' : 'カメラシーケンサを最小化';
  }

  /** @param seq 共通 JSON の sequencer（なければ null でパネルを隠す） @param cameras カメラの一覧（名前の表示用） */
  build(seq, cameras) {
    this.seq = seq && seq.shots && seq.shots.length ? seq : null;
    document.body.classList.toggle('has-sequencer', !!this.seq);
    $('sequencer').hidden = !this.seq;
    const rows = $('seq-rows');
    rows.textContent = '';
    if (!this.seq) return;
    const tracks = [...new Set(this.seq.shots.map((s) => s.track))].sort((a, b) => b - a);   // 番号の大きいトラックを上に
    const camName = (ci) => (ci >= 0 && cameras[ci] ? cameras[ci].name : '（カメラなし）');
    for (const t of tracks) {
      const row = document.createElement('div');
      row.className = 'seq-row';
      row.innerHTML = `<span class="seq-track-label">トラック ${t}</span><div class="seq-lane"></div>`;
      const lane = row.lastChild;
      this.seq.shots.forEach((s, i) => {
        if (s.track !== t) return;
        const el = document.createElement('div');
        el.className = 'seq-shot' + (s.mute ? ' muted' : '');
        el.dataset.shot = String(i);
        el.style.left = `${this.pct(s.sequenceStartFrame)}%`;
        el.style.width = `${(Math.max(s.sequenceEndFrame + 1 - s.sequenceStartFrame, 0.2) / this.span()) * 100}%`;
        el.title = `${s.shotName}（${s.name}）${s.mute ? '・ミュート' : ''}\nカメラ: ${camName(s.camera)}\n`
          + `シーケンス ${fmtF(s.sequenceStartFrame)}〜${fmtF(s.sequenceEndFrame)}・シーン ${fmtF(s.startFrame)}〜${fmtF(s.endFrame)}`
          + (s.scale !== 1 ? `・スケール ${s.scale}` : '') + (s.preHold || s.postHold ? `・ホールド ${s.preHold || 0} / ${s.postHold || 0}` : '');
        el.innerHTML = `<b>${esc(s.shotName)}</b><span>${esc(camName(s.camera))}</span>`
          + `<span class="seq-range">${fmtF(s.startFrame)}〜${fmtF(s.endFrame)}</span>`;
        lane.appendChild(el);
      });
      rows.appendChild(row);
    }
    this.buildRuler();
    $('seq-frame').min = String(this.seq.start);
    $('seq-frame').max = String(this.seq.end);
  }

  buildRuler() {
    const ruler = $('seq-ruler');
    ruler.textContent = '';
    const span = this.span();
    const step = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((s) => span / s <= 12) || 1000;
    for (let f = Math.ceil(this.seq.start / step) * step; f <= this.seq.end; f += step) {
      const tick = document.createElement('span');
      tick.className = 'seq-tick';
      tick.style.left = `${this.pct(f)}%`;
      tick.textContent = String(f);
      ruler.appendChild(tick);
    }
  }

  /** シーケンスのフレームと、いまのショットの表示 */
  update(seqFrame, shot, cameras, follow, playing) {
    if (!this.seq) return;
    $('seq-playhead').style.left = `${this.pct(Math.min(Math.max(seqFrame, this.seq.start), this.seq.end + 0.999))}%`;
    if (document.activeElement !== $('seq-frame')) $('seq-frame').value = fmtF(seqFrame);
    const i = shot ? this.seq.shots.indexOf(shot) : -1;
    document.querySelectorAll('#seq-rows .seq-shot').forEach((el) => el.classList.toggle('current', +el.dataset.shot === i));
    const cam = shot && shot.camera >= 0 && cameras[shot.camera] ? cameras[shot.camera].name : '';
    $('seq-shot').textContent = shot
      ? `${shot.shotName}・${cam || 'カメラなし'}・シーンのフレーム ${fmtF(+shotTime(shot, seqFrame).toFixed(2))}`
      : 'ショットなし';
    $('seq-follow').checked = follow;
    $('seq-play').setAttribute('aria-pressed', String(playing));
    $('seq-play').title = playing ? '停止' : 'シーケンスを再生（ショットのカメラとフレームに切り替えて再生）';
    $('seq-play').querySelector('.ic-play').style.display = playing ? 'none' : '';
    $('seq-play').querySelector('.ic-pause').style.display = playing ? '' : 'none';
  }
}
