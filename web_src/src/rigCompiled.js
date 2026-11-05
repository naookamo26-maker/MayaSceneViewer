// リグの専用の評価（コンパイル）。
//
// RigEvaluator（rig.js）は、値ごとのキャッシュ（Map）・依存の記録・属性の値の引き回しを通して、どんなグラフでも
// 評価できる。この汎用の仕組みの負荷が大きいので、扱える種類のノードだけでできたリグは、最初の評価のあとで
// 「計画」（計算の順番・ノードごとの手順・時間で変わらない値）を作り、2 回目からは計画どおりに計算する。
// 計算は RigEvaluator と同じ数式を同じ順番で行い、結果はビット単位で同じになる（tests/compiled.test.mjs）。
//
// 専用に計算するもの: 動かないノード・カーブだけで動くノード・コンストレイントの出力（と、チャンネルと同じ属性の
// カーブ）で動くノード。コンストレイントの重み・オフセットなどは時間で変わらないもの、ターゲットは DAG ノード。
// それ以外の動くノード（IK・計算ノードの入力・推定のノードなど）は「任せるノード」として、計算の順番の中で
// RigEvaluator に計算させる。専用に計算した値（ワールド行列・ローカル行列・チャンネルの値）は RigEvaluator の
// フレームのキャッシュに入れるので、RigEvaluator はそれを読み、結果は同じになる（props・形の変わるカーブも、
// 評価のあとで RigEvaluator がキャッシュから求める）。ポーズ確認の追加分があるあいだは RigEvaluator が評価する。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { clampLimits, composeLocalMatrix, decomposeMaya, evaluateCurve, mayaEuler } from './animation.js';

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const EPS = 1e-9;
const XYZ = ['x', 'y', 'z'];
const THREE_ORDER = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'].map((o) => o.split('').reverse().join('').toUpperCase());
const VEC_KEYS = ['t', 'r', 's', 'jo', 'ra', 'rp', 'sp', 'rpt', 'spt', 'sh'];
const ANGLE_KEYS = new Set(['r', 'jo', 'ra']);
const SHEAR_AXIS = { shxy: 0, shxz: 1, shyz: 2 };
// 専用に計算するコンストレイントの種類 → 出力の属性（チャンネルにつながるもの）
const T_OUT = ['ct', 'ctx', 'cty', 'ctz'], R_OUT = ['cr', 'crx', 'cry', 'crz'], S_OUT = ['cs', 'csx', 'csy', 'csz'];
const CON_TYPES = {
  parentConstraint: new Set([...T_OUT, ...R_OUT]), pointConstraint: new Set(T_OUT), orientConstraint: new Set(R_OUT),
  scaleConstraint: new Set(S_OUT), aimConstraint: new Set(R_OUT), lookAt: new Set(R_OUT),
};
const IDENTITY = new Matrix4();
const STATIC = 0, SIMPLE = 1, DRIVEN = 2, DELEGATED = 3;

const _e = new Euler(), _v = new Vector3(), _s = new Vector3(), _m = new Matrix4(), _q = new Quaternion();
const eulerQuat = (deg, order, target) => target.setFromEuler(_e.set(deg[0] * D2R, deg[1] * D2R, deg[2] * D2R, THREE_ORDER[order] || 'ZYX'));
const radQuat = (rad, target) => target.setFromEuler(_e.set(rad[0], rad[1], rad[2], 'ZYX'));
const rotationOf = (m, target) => { decomposeMaya(m, _v, target, _s); return target; };

/** ローカル行列の属性の種類と成分（rig.js の xformKey と同じ） */
function xformKey(key) {
  if (key in SHEAR_AXIS) return ['sh', SHEAR_AXIS[key]];
  const m = /^(t|r|s|jo|ra|rp|sp|rpt|spt)([xyz])?$/.exec(key);
  return m ? [m[1], m[2] ? XYZ.indexOf(m[2]) : -1] : [key, -1];
}

/**
 * 計画を作る。rig は、ポーズ確認の追加分なしで 1 回評価したあとの RigEvaluator（時間で変わらない値が keep に入っている）。
 * deps: 動くノード → そのローカル行列が読んだ追加分のノード（再生キャッシュの nodeDeps に入れる）
 * @returns { plan } か、扱えないなら { reason }
 */
export function buildPlan(rig, deps) {
  const fail = (reason) => ({ reason });
  if (!rig.keepStatic) return fail('時間で変わらない値を使い回さない設定');
  if (rig.problems.size) return fail('評価の打ち切り（循環など。計算の順番で結果が変わりうる）');
  const nodes = rig.sceneNodes;
  const staticPlug = (id, attr) => {
    const km = rig.keep.plug.get(id);
    return !!km && km.has(attr);
  };
  const steps = new Map();             // ノード番号 → 手順
  const cons = new Map();              // グラフの id → コンストレイントの手順
  const opmOf = (ni) => {
    const g = rig.dagGraph.get(ni);
    if (g && g.inputs && g.inputs.opm) return undefined;            // 接続された offsetParentMatrix（扱えない）
    const rest = rig.rest(ni);
    const v = rest ? rest.opm : nodes[ni].opm;
    return Array.isArray(v) && v.length === 16 ? new Matrix4().fromArray(v) : null;
  };

  // ---- コンストレイント（RigEvaluator.constraint と同じ。入力の属性は時間で変わらないものだけ）
  // 戻り値はコンストレイントの手順か、扱えない理由（文字列）
  const constraintOf = (g) => {
    if (cons.has(g.id)) return cons.get(g.id);
    const id = g.id, type = g.type;
    const usesOrientation = type === 'orientConstraint' || type === 'parentConstraint' || type === 'scaleConstraint';
    const need = (attr) => staticPlug(id, attr);
    const targets = [];
    for (const t of g.targets || []) {
      const tg = rig.byId.get(t.node);
      if (!tg || (tg.dag < 0 && usesOrientation)) continue;
      if (tg.dag < 0) return `${type} の DAG ノードでないターゲット`;
      const b = `tg[${t.index}]`;
      if (!need(`${b}.tw`)) return `${type} の時間で変わるウェイト`;
      const w = rig.num(id, `${b}.tw`, 1);
      if (!(w > 0)) continue;                                           // 重み 0 のターゲットは読まない（RigEvaluator と同じ）
      const t2 = { ni: tg.dag, w, m: new Matrix4(), q: new Quaternion() };
      if (type === 'parentConstraint') {
        for (const a of ['tot', 'tor', 'tsc']) if (!need(`${b}.${a}`)) return `${type} の時間で変わるオフセット`;
        const tot = rig.vec(id, `${b}.tot`), tor = rig.vec(id, `${b}.tor`);
        t2.tsc = rig.num(id, `${b}.tsc`, 1) >= 0.5;
        t2.tot = new Matrix4().makeTranslation(tot[0], tot[1], tot[2]);
        t2.tor = new Matrix4().makeRotationFromQuaternion(radQuat(tor, new Quaternion()));
      }
      targets.push(t2);
    }
    const total = targets.reduce((x, t) => x + t.w, 0);
    if (total <= EPS) return `${type} のウェイトが 0（レストの値）`;
    const driven = g.driven;
    const rest = (driven >= 0 && rig.rest(driven)) || { joint: false, ro: 0 };
    const c = {
      id, type, driven, targets, total, rest,
      joInv: rest.joint && rest.jo ? eulerQuat(rest.jo, 0, new Quaternion()).invert() : null, ro: rest.ro || 0,
      ref: null, stamp: -1, ct: [0, 0, 0], cr: [0, 0, 0], cs: [0, 0, 0], out: {},
    };
    const vecOf = (attr, def) => (need(attr) ? rig.vec(id, attr, def) : undefined);
    if (type === 'parentConstraint' || type === 'pointConstraint') {
      c.crp = vecOf('crp'); c.crt = vecOf('crt');
      if (!c.crp || !c.crt) return `${type} の時間で変わる回転ピボット`;
      c.o = type === 'pointConstraint' ? vecOf('o') : [0, 0, 0];
      if (!c.o) return `${type} の時間で変わるオフセット`;
    }
    if (type === 'parentConstraint') c.ref = g.attrs && Array.isArray(g.attrs.lr) ? g.attrs.lr.map((v) => v * D2R) : null;
    if (type === 'orientConstraint' || type === 'aimConstraint' || type === 'lookAt' || type === 'scaleConstraint') {
      c.o = vecOf('o', type === 'scaleConstraint' ? [1, 1, 1] : [0, 0, 0]);
      if (!c.o) return `${type} の時間で変わるオフセット`;
    }
    if (type === 'orientConstraint' || type === 'aimConstraint') {   // 親のスケールの打ち消し（compensate）
      if (!need('ssc')) return `${type} の時間で変わる scaleCompensate`;
      c.ssc = rig.num(id, 'ssc', 1) >= 0.5;
      c.isNode = (rest.isNode ?? -1) >= 0 && rig.rest(rest.isNode) ? rest.isNode : -1;
      c.isScale = rest.isScale || null;
    }
    if (type === 'aimConstraint' || type === 'lookAt') {
      for (const a of ['a', 'u', 'wut', 'wu']) if (!need(a)) return `${type} の時間で変わる ${a}`;
      c.a = new Vector3(...rig.vec(id, 'a', [1, 0, 0])).normalize();
      c.u = new Vector3(...rig.vec(id, 'u', [0, 1, 0]));
      c.wut = Math.round(rig.num(id, 'wut', 3));
      c.wu = new Vector3(...rig.vec(id, 'wu', [0, 1, 0]));
      if (c.wut === 1 || c.wut === 2) return `${type} のオブジェクトの world up`;
      c.upScene = (rig.clip.raw.upAxis || 'y') === 'z' ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
      c.tw = 0;
      if (type === 'lookAt' && (c.wut === 0 || c.wut === 3)) {
        const tn = rig.attrName(g, ['tws', 'twist']);
        if (!need(tn)) return `${type} の時間で変わる twist`;
        c.tw = rig.num(id, tn, 0);
      }
      // 動かされるノードの移動（chan 't'）・aim と up が平行なときの回転 0 の向き（jointOrient を含む）
      c.restRot = rotationOf(composeLocalMatrix({ ...rest, t: [0, 0, 0], s: [1, 1, 1], r: [0, 0, 0], ra: undefined, opm: undefined },
        null, new Matrix4()), new Quaternion());
    }
    cons.set(g.id, c);
    return c;
  };

  // ---- 動くノード
  const delegated = new Map();         // 任せた理由 → 数
  const delegate = (ni, why) => {
    delegated.set(why, (delegated.get(why) || 0) + 1);
    steps.set(ni, { ni, kind: DELEGATED, world: new Matrix4(), local: null, deps: deps.get(ni) || null });
  };
  for (const ni of rig.moving) {
    const why = movingStep(ni);
    if (why) delegate(ni, why);
  }
  function movingStep(ni) {
    if (rig.ikJoint.has(ni)) return 'IK で動くジョイント';
    if (rig.fallback.has(ni)) return '推定のノード';
    const e = rig.clip.byNode.get(ni);
    const rest = rig.rest(ni);
    if (!e || !rest) return '材料のない動くノード';
    const fromCurve = new Set(e.channels.map((ch) => ch.attr));
    const inputs = [];
    for (const [key2, src] of rig.chanInputs(ni)) {
      if (key2 === 'opm') return '接続された offsetParentMatrix';
      if (fromCurve.has(key2)) continue;                               // カーブの値を使う（接続は読まない）
      const [base, axis] = xformKey(key2);
      if (base === 'ro') return '接続された回転順';
      if (src.curve !== undefined) {
        const curve = rig.clip.curves[src.curve];
        if (curve) inputs.push({ base, axis, curve });
        continue;
      }
      const g = rig.byId.get(src.node);
      if (!g || g.dag >= 0 || !CON_TYPES[g.type] || g.def) return `チャンネルの入力（${g ? g.type : '不明'}）`;
      const attr = String(src.attr).replace(/\[\d+\]$/, '');
      if (!CON_TYPES[g.type].has(attr)) return `${g.type} の出力 ${src.attr}`;
      const con = constraintOf(g);
      if (typeof con === 'string') return con;
      inputs.push({ base, axis, con, attr });
    }
    const opm = opmOf(ni);
    if (opm === undefined) return '接続された offsetParentMatrix';
    steps.set(ni, {
      ni, kind: inputs.some((x) => x.con) ? DRIVEN : SIMPLE, e, rest, inputs, opm,
      fromCurve, cur: null, local: new Matrix4(), world: new Matrix4(),
      isNode: (rest.isNode ?? -1) >= 0 && rig.rest(rest.isNode) ? rest.isNode : -1,
      deps: deps.get(ni) || null,
    });
    return null;
  }
  // コンストレイントのターゲットは、ピボットの接続がないこと（あれば、そのコンストレイントで動くノードを任せる）
  for (const c of [...cons.values()]) {
    if (c.targets.some((t) => rig.rest(t.ni) && rig.chanInputs(t.ni).some(([k]) => /^(rp|rpt)[xyz]?$/.test(k)))) {
      cons.delete(c.id);
      for (const st of [...steps.values()]) if (st.inputs && st.inputs.some((x) => x.con === c)) delegate(st.ni, 'ターゲットの接続されたピボット');
    }
  }

  // ---- 計算の順番（親・ターゲット・親のスケールの打ち消しのノードが先）
  const order = [];
  let restFail = false;                // 動かないノードの材料が扱えない
  const state = new Map();             // 0 = 調べている途中・1 = 済み
  const visit = (ni) => {
    const st = state.get(ni);
    if (st === 1) return true;
    if (st === 0) return false;                                         // 循環
    state.set(ni, 0);
    const p = nodes[ni].parent;
    if (p >= 0 && !visit(p)) return false;
    const s = steps.get(ni);
    if (s && s.kind !== DELEGATED) {
      if (s.isNode >= 0 && !visit(s.isNode)) return false;
      for (const x of s.inputs) if (x.con) for (const t of x.con.targets) if (!visit(t.ni)) return false;
    }
    state.set(ni, 1);
    if (!s) {
      const opm = opmOf(ni);
      if (opm === undefined) return false;
      const st = { ni, kind: STATIC, opm, world: new Matrix4(), rest: rig.rest(ni) || null, cur: null, isNode: -1 };
      if (st.rest) {
        // 動かないが、レストの値を持つノード（コンストレイントのターゲット・親のスケールの元）。RigEvaluator は
        // チャンネルの経路で読む: カーブも入力もなければ、レストの値に制限を当てたもので毎フレーム同じ
        const e = rig.clip.byNode.get(ni);
        if ((e && e.channels.length) || rig.chanInputs(ni).length) { restFail = true; return false; }
        st.cur = { ...st.rest };
        for (const k of VEC_KEYS) if (st.rest[k]) st.cur[k] = st.rest[k].slice();
        clampLimits(st.cur);
        const isn = st.rest.isNode ?? -1;
        if (isn >= 0 && rig.rest(isn)) { restFail = true; return false; }   // 打ち消しの元がさらにある（扱わない）
      }
      steps.set(ni, st);
    }
    order.push(steps.get(ni));
    return true;
  };
  const why = () => (restFail ? '動かないノードのチャンネルの入力' : '計算の順番が決まらない（循環）');
  for (const ni of rig.moving) if (!visit(ni)) return fail(why());
  for (const c of cons.values()) {
    for (const t of c.targets) if (!visit(t.ni)) return fail(why());
    if (c.driven >= 0 && !visit(c.driven)) return fail(why());
  }
  for (const s of order) {
    if (s.kind === STATIC || s.kind === DELEGATED) continue;
    s.cur = { ...s.rest };
    for (const k of VEC_KEYS) if (s.rest[k]) s.cur[k] = s.rest[k].slice();
    // 入力で値を入れる、ファイルに値のない属性（ピボットなど。毎フレーム 0 から）
    s.zeroBases = [...new Set(s.inputs.map((x) => x.base))].filter((b) => !s.rest[b]);
  }
  if (!order.some((s) => s.kind === SIMPLE || s.kind === DRIVEN)) return fail(`専用に計算できる動くノードがない（${[...delegated.keys()].join('・')}）`);
  const plan = {
    rig, order, steps, cons: [...cons.values()],
    moving: [...rig.moving].map((ni) => steps.get(ni)),
    counts: { simple: order.filter((s) => s.kind === SIMPLE).length, driven: order.filter((s) => s.kind === DRIVEN).length,
      delegated: order.filter((s) => s.kind === DELEGATED).length, constraints: cons.size },
    delegated: Object.fromEntries(delegated),
    // RigEvaluator のフレームのキャッシュに値を入れるか: 任せたノード・props・形の変わるカーブがあるとき（RigEvaluator が
    // 読むので）。なければ入れない（評価のあとで RigEvaluator が値を求めても、計算し直すので同じ値）
    share: delegated.size > 0 || rig.props.length > 0 || rig.curveIds().length > 0,
    depsAdded: false,
  };
  return { plan };
}

// ---------------------------------------------------------------------------- 1 フレームの計算

/** チャンネルの値（mode: 'full' | 'fk' | 't'）。専用に計算したノードは計算した値、任せたノードは RigEvaluator から */
function chanOf(plan, ni, mode) {
  const s = plan.steps.get(ni);
  return s && s.cur && s.kind !== DELEGATED ? s.cur : plan.rig.chan(ni, mode);
}

function parentWorld(plan, ni) {
  const n = plan.rig.sceneNodes[ni];
  return n.parent >= 0 && n.inheritsTransform !== false ? plan.steps.get(n.parent).world : IDENTITY;
}

/** 親の空間（RigEvaluator.parentSpace と同じ: 親のワールド行列 · offsetParentMatrix） */
function parentSpace(plan, ni, target) {
  const st = plan.steps.get(ni);
  if (st.kind === DELEGATED) return plan.rig.parentSpace(ni);       // 任せたノード（offsetParentMatrix の接続も含めて）
  const P = parentWorld(plan, ni);
  const o = st.opm;
  return o ? target.copy(P).multiply(o) : P;
}

/** チャンネルの値とローカル行列（RigEvaluator.chan('full') → localFileUncached と同じ） */
function evalChannels(plan, s, f) {
  const { rest, cur, e } = s;
  for (const k of VEC_KEYS) if (rest[k]) { const a = cur[k], b = rest[k]; a[0] = b[0]; a[1] = b[1]; a[2] = b[2]; }
  for (const b of s.zeroBases) cur[b] = [0, 0, 0];
  cur.ro = rest.ro;
  for (const ch of e.channels) cur[ch.base][ch.axis] = evaluateCurve(ch.curve, f);
  for (const x of s.inputs) {
    let v;
    if (x.curve) {
      v = evaluateCurve(x.curve, f);
      v = x.curve.type === 'TA' ? v * D2R : v;
    } else {
      const c = x.con;
      if (c.stamp !== plan.stamp) evalConstraint(plan, c, f);
      v = c.out[x.attr];
    }
    if (v === undefined) continue;
    const k = ANGLE_KEYS.has(x.base) ? R2D : 1;
    if (x.axis < 0) {
      if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (!s.fromCurve.has(x.base + XYZ[a])) cur[x.base][a] = v[a] * k;
    } else if (typeof v === 'number') cur[x.base][x.axis] = v * k;
  }
  clampLimits(cur);
  let isScale = null;
  if (rest.isScale || (rest.isNode ?? -1) >= 0) isScale = s.isNode >= 0 ? chanOf(plan, s.isNode, 'full').s : rest.isScale;
  composeLocalMatrix(cur, isScale, s.local);
}

const _ps = new Matrix4(), _pw = new Matrix4(), _pwInv = new Matrix4(), _P = new Matrix4(), _piv = new Vector3(), _pos = new Vector3();
const _qa = new Quaternion(), _qs = new Quaternion(), _dt = new Vector3(), _dq = new Quaternion(), _ds = new Vector3(), _dsh = new Vector3();

/** ピボットの位置（RigEvaluator.pivotWorld と同じ） */
function pivotWorld(plan, ni, out) {
  const rig = plan.rig;
  if (!rig.rest(ni)) return out.setFromMatrixPosition(plan.steps.get(ni).world);
  const s = plan.steps.get(ni), trest = rig.rest(ni);
  const tt = s.kind === DELEGATED ? rig.chan(ni, 't').t : chanOf(plan, ni, 'full').t;
  const rp = trest.rp || [0, 0, 0], rpt = trest.rpt || [0, 0, 0];
  return out.set(tt[0] + rp[0] + rpt[0], tt[1] + rp[1] + rpt[1], tt[2] + rp[2] + rpt[2]).applyMatrix4(parentSpace(plan, ni, _ps));
}

/** 親のスケールの打ち消しのスケール（RigEvaluator.isScaleOf と同じ） */
function isScaleOf(plan, ni) {
  const rest = plan.rig.rest(ni);
  if (!rest) return null;
  const isn = rest.isNode ?? -1;
  if (isn >= 0 && plan.rig.rest(isn)) return chanOf(plan, isn, 'fk').s;
  return rest.isScale || null;
}

/** ターゲットの行列（RigEvaluator.targetMatrix と同じ）。m に入れる */
function targetMatrix(plan, ni, withScale, withInverseScale, m) {
  const rig = plan.rig;
  if (!rig.rest(ni)) return m.copy(plan.steps.get(ni).world);        // レストの値のないノード: ワールド行列そのもの
  const tc = chanOf(plan, ni, 'full');
  pivotWorld(plan, ni, _piv);
  m.copy(parentSpace(plan, ni, _ps)).setPosition(_piv);
  if (withInverseScale) {
    const is = isScaleOf(plan, ni);
    if (is) m.multiply(_m.makeScale(is[0] ? 1 / is[0] : 1, is[1] ? 1 / is[1] : 1, is[2] ? 1 / is[2] : 1));
  }
  if (rig.rest(ni).joint && tc.jo) m.multiply(_m.makeRotationFromQuaternion(eulerQuat(tc.jo, 0, _q)));
  m.multiply(_m.makeRotationFromQuaternion(eulerQuat(tc.r, tc.ro || 0, _q)));
  if (withScale) m.multiply(_m.makeScale(tc.s[0], tc.s[1], tc.s[2]));
  return m;
}

/** 重み付きの回転の平均（RigEvaluator の averageQuat と同じ）。targets の q を使う */
function averageQuat(c, out) {
  const ref = c.targets[0].q;
  out.set(0, 0, 0, 0);
  for (const t of c.targets) {
    const q = t.q, sgn = q.dot(ref) < 0 ? -t.w : t.w;
    out.x += q.x * sgn; out.y += q.y * sgn; out.z += q.z * sgn; out.w += q.w * sgn;
  }
  return out.normalize();
}

/** ワールドの回転 → 動かされるノードの回転の値（ラジアン。RigEvaluator の toRotate と同じ） */
function toRotate(plan, c, pw, qWorld, compensate, ref) {
  let P = pw;
  if (compensate && c.ssc) {
    const is = isScaleOf(plan, c.driven);
    if (is) P = _P.copy(pw).multiply(_m.makeScale(is[0] ? 1 / is[0] : 1, is[1] ? 1 / is[1] : 1, is[2] ? 1 / is[2] : 1));
  }
  rotationOf(P, _qs).invert().multiply(qWorld);
  if (c.joInv) _qs.premultiply(c.joInv);
  const er = mayaEuler(_qs, c.ro, ref);
  const cr = c.cr;
  for (let a = 0; a < 3; a++) cr[a] = er[a] * R2D * D2R;
  return cr;
}

/** 位置 → 動かされるノードの移動の値（RigEvaluator の toTranslate と同じ） */
function toTranslate(c, pWorld) {
  pWorld.applyMatrix4(_pwInv);
  const ct = c.ct, o = c.o;
  ct[0] = pWorld.x + o[0] - c.crp[0] - c.crt[0];
  ct[1] = pWorld.y + o[1] - c.crp[1] - c.crt[1];
  ct[2] = pWorld.z + o[2] - c.crp[2] - c.crt[2];
  return ct;
}

const _weighted = new Vector3();
/** ターゲットのピボットの重み付きの平均 */
function weightedPivot(plan, c, out) {
  out.set(0, 0, 0);
  for (const t of c.targets) out.addScaledVector(pivotWorld(plan, t.ni, _weighted), t.w / c.total);
  return out;
}

/** 動かされるノードの移動の値（RigEvaluator の chan(ni, 't').t と同じ: 移動のカーブと移動の入力だけ） */
function chanT(plan, ni, f) {
  const s = plan.steps.get(ni);
  if (s.kind === DELEGATED) return plan.rig.chan(ni, 't').t;
  const rest = s.rest;
  const out = { ...rest };
  for (const k of VEC_KEYS) if (rest[k]) out[k] = rest[k].slice();
  for (const ch of s.e.channels) if (ch.base === 't') out.t[ch.axis] = evaluateCurve(ch.curve, f);
  for (const x of s.inputs) {
    if (x.base !== 't') continue;
    let v;
    if (x.curve) { v = evaluateCurve(x.curve, f); v = x.curve.type === 'TA' ? v * D2R : v; }
    else { if (x.con.stamp !== plan.stamp) evalConstraint(plan, x.con, f); v = x.con.out[x.attr]; }
    if (v === undefined) continue;
    if (!out.t) out.t = [0, 0, 0];
    if (x.axis < 0) { if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (!s.fromCurve.has('t' + XYZ[a])) out.t[a] = v[a]; }
    else if (typeof v === 'number') out.t[x.axis] = v;
  }
  return clampLimits(out).t;
}

/** コンストレイントの出力（RigEvaluator.constraint と同じ）。c.out に入れる（求められなければ空） */
function evalConstraint(plan, c, f) {
  c.stamp = plan.stamp;
  const pw = c.driven >= 0 ? parentSpace(plan, c.driven, _pw) : IDENTITY;
  _pwInv.copy(pw).invert();
  const o = c.out;                                                   // 種類ごとに同じ鍵を上書きする（aim は出力しないことがある）
  switch (c.type) {
    case 'pointConstraint': {
      const ct = toTranslate(c, weightedPivot(plan, c, _pos));
      o.ct = ct; o.ctx = ct[0]; o.cty = ct[1]; o.ctz = ct[2];
      return;
    }
    case 'orientConstraint': {
      for (const t of c.targets) rotationOf(targetMatrix(plan, t.ni, false, true, t.m), t.q);
      const q = averageQuat(c, _qa).multiply(radQuat(c.o, _q));
      const cr = toRotate(plan, c, pw, q, true, null);
      o.cr = cr; o.crx = cr[0]; o.cry = cr[1]; o.crz = cr[2];
      return;
    }
    case 'parentConstraint': {
      for (const t of c.targets) targetMatrix(plan, t.ni, true, t.tsc, t.m).multiply(t.tot).multiply(t.tor);
      _pos.set(0, 0, 0);
      for (const t of c.targets) _pos.addScaledVector(_v.setFromMatrixPosition(t.m), t.w / c.total);
      for (const t of c.targets) rotationOf(t.m, t.q);
      const q = averageQuat(c, _qa);
      const ct = toTranslate(c, _pos);
      const cr = toRotate(plan, c, pw, q, false, c.ref);
      o.ct = ct; o.ctx = ct[0]; o.cty = ct[1]; o.ctz = ct[2];
      o.cr = cr; o.crx = cr[0]; o.cry = cr[1]; o.crz = cr[2];
      return;
    }
    case 'scaleConstraint': {
      const logs = [0, 0, 0], sign = [0, 0, 0];
      for (const t of c.targets) {
        decomposeMaya(plan.steps.get(t.ni).world, _dt, _dq, _ds, _dsh);
        const v = [_ds.x, _ds.y, _ds.z];
        for (let k = 0; k < 3; k++) {
          logs[k] += (t.w / c.total) * Math.log(Math.max(Math.abs(v[k]), 1e-12));
          sign[k] += t.w * Math.sign(v[k]);
        }
      }
      decomposeMaya(pw, _dt, _dq, _ds, _dsh);
      const ps = [_ds.x, _ds.y, _ds.z];
      const cs = c.cs;
      for (let k = 0; k < 3; k++) cs[k] = (sign[k] < 0 ? -1 : 1) * Math.exp(logs[k]) / (ps[k] || 1) * c.o[k];
      o.cs = cs; o.csx = cs[0]; o.csy = cs[1]; o.csz = cs[2];
      return;
    }
    case 'aimConstraint': case 'lookAt': {
      const rest = c.rest;
      const tt = c.driven >= 0 ? chanT(plan, c.driven, f) : [0, 0, 0];
      const add = (a, b) => (b ? [a[0] + b[0], a[1] + b[1], a[2] + b[2]] : a);
      const pd = new Vector3(...add(add(tt, rest.rp), rest.rpt)).applyMatrix4(pw);
      const dir = weightedPivot(plan, c, new Vector3()).sub(pd);
      if (dir.lengthSq() < EPS) { delete o.cr; delete o.crx; delete o.cry; delete o.crz; return; }                                 // 向きが決まらない（出力しない）
      dir.normalize();
      const a = c.a, u = c.u, wu = c.wu;
      let up = null;
      if (c.wut === 0) up = c.upScene;
      else if (c.wut === 3) up = wu;
      let q;
      const uPerp = u.clone().addScaledVector(a, -u.dot(a));
      const upPerp = up ? up.clone().addScaledVector(dir, -up.dot(dir)) : null;
      if (!up || uPerp.lengthSq() < EPS || upPerp.lengthSq() < EPS) {
        // up を決められない: 親の空間で、回転 0 の向きから測った最短の回転（RigEvaluator の aimMode 'parent'）
        const pr = rotationOf(pw, new Quaternion());
        const dl = dir.clone().applyQuaternion(pr.clone().invert());
        const base = c.restRot.clone();
        const qa = new Quaternion().setFromUnitVectors(a.clone().applyQuaternion(base), dl);
        q = pr.multiply(qa.multiply(base));
      } else {
        const frame = (x, y) => new Matrix4().makeBasis(x, y, x.clone().cross(y));
        uPerp.normalize(); upPerp.normalize();
        q = new Quaternion().setFromRotationMatrix(frame(dir, upPerp).multiply(frame(a, uPerp).transpose()));
      }
      if (c.type === 'lookAt' && (c.wut === 0 || c.wut === 3) && Math.abs(c.tw) > 1e-12) {
        q = new Quaternion().setFromAxisAngle(dir, -c.tw).multiply(q);
      }
      const cr = toRotate(plan, c, pw, q.multiply(radQuat(c.o, _q)), c.type === 'aimConstraint', null);
      o.cr = cr; o.crx = cr[0]; o.cry = cr[1]; o.crz = cr[2];
      return;
    }
    default:
  }
}

/**
 * フレーム f を計画どおりに計算する。動くノードのローカル行列を target（ノード番号 → Matrix4）に入れる
 */
export function runPlan(plan, f, target) {
  plan.stamp = (plan.stamp || 0) + 1;
  const rig = plan.rig;
  const cache = rig.cache;
  for (const s of plan.order) {
    const ni = s.ni;
    if (s.kind === STATIC) {
      s.world.multiplyMatrices(parentWorld(plan, ni), rig.staticLocal(ni));
    } else if (s.kind === DELEGATED) {
      s.local = rig.localFile(ni);                  // RigEvaluator が計算する（専用に計算した値はキャッシュから読む）
      s.world.multiplyMatrices(parentWorld(plan, ni), s.local);
    } else {
      evalChannels(plan, s, f);
      s.world.multiplyMatrices(parentWorld(plan, ni), s.local);
      // RigEvaluator が読む値を、そのフレームのキャッシュに入れる（chan の 'full'・'fk'。IK がないので同じ値。
      // 't' は回転を求めない別の値なので入れない）
      if (plan.share) {
        cache.local.set(ni, s.local);
        cache.chan.set(ni * 3, s.cur);
        cache.chan.set(ni * 3 + 1, s.cur);
      }
    }
    if (plan.share) cache.world.set(ni, s.world);
  }
  for (const s of plan.moving) {
    const m = target.get(s.ni) || new Matrix4();
    target.set(s.ni, m.copy(s.local));
  }
  return target;
}
