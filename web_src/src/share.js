// 共有用の URL: クエリパラメーターの読み書きと、URL からの読み込みに失敗したときの理由。DOM に依存しない（Node でテストできる）。
//
//   ?file=https://…/scene.msv   開くファイル（.msv・共通 JSON）
//   &frame=24                   フレーム
//   &camera=shotCam             シーンのカメラから見る（transform の名前かパス）
//   &view=px,py,pz,tx,ty,tz,fov 自由視点の位置・注視点・画角
//   &wire=1&lighting=flat …     表示の設定（.msv の表示の状態と同じ項目）
//
// クエリの指定は、.msv に保存した表示の状態より優先する（保存した状態を入れたあとに入れる）。

const DIGITS = 4;
const round = (v, d = DIGITS) => {
  const k = 10 ** d;
  return Math.round(v * k) / k;
};

/** 設定の値 → クエリの文字列（型は既定値で決める） */
function encodeSetting(value) {
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return String(round(value));
  if (Array.isArray(value)) return value.length ? value.join(',') : '-';
  if (value && typeof value === 'object') {
    const on = Object.keys(value).filter((k) => value[k]);
    return on.length ? on.join(',') : '-';
  }
  return String(value);
}

/** クエリの文字列 → 設定の値（読めなければ undefined） */
function decodeSetting(text, def) {
  if (typeof def === 'boolean') {
    if (/^(1|true|on|yes)$/i.test(text)) return true;
    if (/^(0|false|off|no)$/i.test(text)) return false;
    return undefined;
  }
  if (typeof def === 'number') {
    const n = Number(text);
    return text !== '' && Number.isFinite(n) ? n : undefined;
  }
  if (Array.isArray(def)) return text === '-' || text === '' ? [] : text.split(',').map((s) => s.trim()).filter(Boolean);
  if (def && typeof def === 'object') {
    const on = new Set(text === '-' ? [] : text.split(',').map((s) => s.trim()));
    const unknown = [...on].filter((k) => !(k in def));
    if (unknown.length) return undefined;
    return Object.fromEntries(Object.keys(def).map((k) => [k, on.has(k)]));
  }
  return text;
}

/**
 * クエリ（location.search）を読む。
 * @param search '?file=…&frame=…'
 * @param defaults 表示の設定の既定値（キーと型。.msv の表示の状態と同じ項目）
 * @returns { file, view（applyViewState に渡せる部分的な表示の状態。指定がなければ null）, invalid: [読めなかったキー] }
 */
export function parseShareQuery(search, defaults) {
  const q = new URLSearchParams(search || '');
  const out = { file: null, view: null, invalid: [] };
  const view = { version: 1 };
  let any = false;
  if (q.get('file')) out.file = q.get('file');
  if (q.has('frame')) {
    const f = Number(q.get('frame'));
    if (q.get('frame') !== '' && Number.isFinite(f)) { view.frame = f; any = true; } else out.invalid.push('frame');
  }
  if (q.get('camera')) {
    view.camera = { mode: 'scene', path: q.get('camera') };
    any = true;
  } else if (q.has('view')) {
    const v = (q.get('view') || '').split(',').map(Number);
    if ((v.length === 6 || v.length === 7) && v.every(Number.isFinite)) {
      view.camera = { mode: 'free', position: v.slice(0, 3), target: v.slice(3, 6) };
      if (v.length === 7) view.camera.fov = v[6];
      any = true;
    } else out.invalid.push('view');
  }
  const settings = {};
  for (const [key, def] of Object.entries(defaults || {})) {
    if (!q.has(key)) continue;
    const value = decodeSetting(q.get(key), def);
    if (value === undefined) out.invalid.push(key);
    else { settings[key] = value; any = true; }
  }
  if (Object.keys(settings).length) view.settings = settings;
  out.view = any ? view : null;
  return out;
}

/**
 * 表示の状態（viewState()）→ クエリの文字列（'?' は付けない）。
 * 設定は、受け取った人が開いたときの状態（baseline: 既定値に .msv に保存した設定を重ねたもの）と違うものだけ入れる。
 * @param state viewState() の結果
 * @param baseline 設定の基準（キーと値）
 * @param opts { file: 開いたファイルの URL（なければ入れない） }
 */
export function buildShareQuery(state, baseline, opts = {}) {
  const q = new URLSearchParams();
  if (opts.file) q.set('file', opts.file);
  if (state && Number.isFinite(state.frame)) q.set('frame', String(round(state.frame, 3)));
  const cam = state && state.camera;
  if (cam && cam.mode === 'scene' && (cam.name || cam.path)) q.set('camera', cam.name || cam.path);
  else if (cam && cam.mode === 'free' && cam.position && cam.target) {
    q.set('view', [...cam.position, ...cam.target].map((v) => round(v)).concat(Number.isFinite(cam.fov) ? [round(cam.fov, 2)] : []).join(','));
  }
  for (const [key, value] of Object.entries((state && state.settings) || {})) {
    if (!(key in (baseline || {}))) continue;
    if (encodeSetting(value) === encodeSetting(baseline[key])) continue;
    q.set(key, encodeSetting(value));
  }
  return q.toString().replace(/%2C/g, ',');
}

/**
 * URL からの読み込みに失敗したときの説明。
 * @param info { url: 読もうとした URL, page: ページの URL, status: HTTP の状態（応答があれば）, contentType, error: 例外（応答がなければ） }
 */
export function fetchFailureMessage(info) {
  let url, page;
  try { url = new URL(info.url, info.page); } catch (e) { return `URL として読めません: ${info.url}`; }
  try { page = new URL(info.page); } catch (e) { page = null; }
  const name = decodeURIComponent(url.pathname.split('/').pop() || url.href);
  const head = `${name} を読み込めませんでした。\n`;
  const fallback = 'ファイルをダウンロードして、このページにドロップするか［ファイル］→［ローカルファイルから開く］で開いてください。';
  if (info.status) {
    if (info.status === 404 || info.status === 410) return `${head}ファイルが見つかりません（${info.status}）。URL を確かめてください。\n${url.href}`;
    if (info.status === 401 || info.status === 403) {
      return `${head}ログインやアクセスの権限が必要な場所です（${info.status}）。ビューアの中からは、ログインが必要なファイルを読めません。\n${fallback}`;
    }
    return `${head}サーバーがエラーを返しました（${info.status}）。\n${fallback}`;
  }
  if (info.contentType && /text\/html/i.test(info.contentType)) {
    return `${head}ファイルではなく Web ページ（ログインのページなど）が返りました。`
      + `ログインが必要な場所のファイルは読めません。\n${fallback}`;
  }
  if (url.protocol === 'file:') {
    return `${head}ブラウザの制限で、この PC 上のファイルは URL では読めません。［ファイル］→［ローカルファイルから開く］かドロップで開いてください。`;
  }
  if (page && page.protocol === 'https:' && url.protocol === 'http:') {
    return `${head}https のページから http の URL は読めません（ブラウザが安全でない通信として止めます）。https の URL を指定してください。`;
  }
  if (info.error) {
    return `${head}サーバーが、ほかのページからの読み込みを許可していない（CORS）か、サーバーにつながりません。`
      + `HTML と同じサーバーに置くか、${fallback}`;
  }
  return `${head}${fallback}`;
}

/** 読み込んだデータが .msv（zip）か: 先頭が PK\x03\x04 */
export function isZip(buffer) {
  const b = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
  return b.length === 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
}
