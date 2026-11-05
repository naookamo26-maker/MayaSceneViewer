// リグの専用の評価（コンパイル）。
//
// RigEvaluator（rig.js）は、値ごとのキャッシュ（Map）・依存の記録・属性の値の引き回しを通して、どんなグラフでも
// 評価できる。この汎用の仕組みの負荷が大きいので、扱える種類のノードだけでできたリグは、最初の評価のあとで
// 「計画」（計算の順番・ノードごとの手順・時間で変わらない値）を作り、2 回目からは計画どおりに計算する。
// 計算は RigEvaluator と同じ数式を同じ順番で行い、結果はビット単位で同じになる（tests/compiled.test.mjs）。
//
// 扱えるもの（段階 1）: 動かないノード・カーブだけで動くノード・parentConstraint の出力（と、チャンネルと同じ
// 属性のカーブ）で動くノード。コンストレイントの重み・オフセットなどは時間で変わらないもの、ターゲットは DAG ノード。
// それ以外（IK・ほかのコンストレイント・計算ノードの入力・props・形の変わるカーブ・推定のノードなど）を含むリグは
// 計画を作らず、RigEvaluator がこれまでどおり評価する。ポーズ確認の追加分があるあいだも RigEvaluator が評価する。
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
const CONSTRAINT_OUT = new Set(['ct', 'ctx', 'cty', 'ctz', 'cr', 'crx', 'cry', 'crz']);
const IDENTITY = new Matrix4();
const STATIC = 0, SIMPLE = 1, DRIVEN = 2;

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
  if (rig.props.length) return fail('接続で決まる表示・カメラなどの値（props）');
  if (rig.curveIds().length) return fail('リグで形が変わるカーブ');
  if (rig.problems.size) return fail('評価の打ち切り（循環など）');
  if (rig.fallback.size || rig.tainted.size) return fail('推定・不明のノード');
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

  // ---- コンストレイント
  const constraintOf = (g) => {
    if (cons.has(g.id)) return cons.get(g.id);
    const id = g.id;
    const targets = [];
    for (const t of g.targets || []) {
      const tg = rig.byId.get(t.node);
      if (!tg || tg.dag < 0) continue;                                  // parentConstraint は DAG ノードのターゲットだけ使う
      const b = `tg[${t.index}]`;
      if (!staticPlug(id, `${b}.tw`)) return null;
      const w = rig.num(id, `${b}.tw`, 1);
      if (!(w > 0)) continue;                                           // 重み 0 のターゲットは読まない（RigEvaluator と同じ）
      for (const a of ['tot', 'tor', 'tsc']) if (!staticPlug(id, `${b}.${a}`)) return null;
      const tot = rig.vec(id, `${b}.tot`), tor = rig.vec(id, `${b}.tor`);
      targets.push({ ni: tg.dag, w, tsc: rig.num(id, `${b}.tsc`, 1) >= 0.5,
        tot: new Matrix4().makeTranslation(tot[0], tot[1], tot[2]),
        tor: new Matrix4().makeRotationFromQuaternion(radQuat(tor, new Quaternion())),
        m: new Matrix4(), q: new Quaternion() });
    }
    const total = targets.reduce((s, t) => s + t.w, 0);
    if (total <= EPS) return null;                                      // レストの値（扱えない）
    if (!staticPlug(id, 'crp') || !staticPlug(id, 'crt')) return null;
    const driven = g.driven;
    const rest = (driven >= 0 && rig.rest(driven)) || { joint: false, ro: 0 };
    const c = {
      id, driven, targets, total, crp: rig.vec(id, 'crp'), crt: rig.vec(id, 'crt'),
      ref: g.attrs && Array.isArray(g.attrs.lr) ? g.attrs.lr.map((v) => v * D2R) : null,
      joInv: rest.joint && rest.jo ? eulerQuat(rest.jo, 0, new Quaternion()).invert() : null, ro: rest.ro || 0,
      stamp: -1, ct: [0, 0, 0], cr: [0, 0, 0], out: {},
    };
    cons.set(g.id, c);
    return c;
  };

  // ---- 動くノード
  for (const ni of rig.moving) {
    if (rig.ikJoint.has(ni)) return fail('IK で動くジョイント');
    const e = rig.clip.byNode.get(ni);
    const rest = rig.rest(ni);
    if (!e || !rest) return fail('材料のない動くノード');
    const fromCurve = new Set(e.channels.map((ch) => ch.attr));
    const inputs = [];
    for (const [key2, src] of rig.chanInputs(ni)) {
      if (key2 === 'opm') return fail('接続された offsetParentMatrix');
      if (fromCurve.has(key2)) continue;                               // カーブの値を使う（接続は読まない）
      const [base, axis] = xformKey(key2);
      if (base === 'ro') return fail('接続された回転順');
      if (src.curve !== undefined) {
        const curve = rig.clip.curves[src.curve];
        if (curve) inputs.push({ base, axis, curve });
        continue;
      }
      const g = rig.byId.get(src.node);
      if (!g || g.dag >= 0 || g.type !== 'parentConstraint' || g.def) return fail(`チャンネルの入力（${g ? g.type : '不明'}）`);
      const attr = String(src.attr).replace(/\[\d+\]$/, '');
      if (!CONSTRAINT_OUT.has(attr)) return fail(`parentConstraint の出力 ${src.attr}`);
      const con = constraintOf(g);
      if (!con) return fail('parentConstraint の時間で変わる入力・レストの値');
      inputs.push({ base, axis, con, attr });
    }
    const opm = opmOf(ni);
    if (opm === undefined) return fail('接続された offsetParentMatrix');
    steps.set(ni, {
      ni, kind: inputs.some((x) => x.con) ? DRIVEN : SIMPLE, e, rest, inputs, opm,
      fromCurve, cur: null, local: new Matrix4(), world: new Matrix4(),
      isNode: (rest.isNode ?? -1) >= 0 && rig.rest(rest.isNode) ? rest.isNode : -1,
      deps: deps.get(ni) || null,
    });
  }
  // コンストレイントのターゲットは、ピボットの接続がないこと
  for (const c of cons.values()) {
    for (const t of c.targets) {
      if (rig.rest(t.ni) && rig.chanInputs(t.ni).some(([k]) => /^(rp|rpt)[xyz]?$/.test(k))) return fail('ターゲットの接続されたピボット');
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
    if (s) {
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
    if (s.kind === STATIC) continue;
    s.cur = { ...s.rest };
    for (const k of VEC_KEYS) if (s.rest[k]) s.cur[k] = s.rest[k].slice();
    // 入力で値を入れる、ファイルに値のない属性（ピボットなど。毎フレーム 0 から）
    s.zeroBases = [...new Set(s.inputs.map((x) => x.base))].filter((b) => !s.rest[b]);
  }
  const plan = {
    rig, order, steps, cons: [...cons.values()],
    moving: [...rig.moving].map((ni) => steps.get(ni)),
    counts: { simple: order.filter((s) => s.kind === SIMPLE).length, driven: order.filter((s) => s.kind === DRIVEN).length,
      constraints: cons.size },
    depsAdded: false,
  };
  return { plan };
}

// ---------------------------------------------------------------------------- 1 フレームの計算

function parentWorld(plan, ni) {
  const n = plan.rig.sceneNodes[ni];
  return n.parent >= 0 && n.inheritsTransform !== false ? plan.steps.get(n.parent).world : IDENTITY;
}

/** 親の空間（RigEvaluator.parentSpace と同じ: 親のワールド行列 · offsetParentMatrix） */
function parentSpace(plan, ni, target) {
  const P = parentWorld(plan, ni);
  const o = plan.steps.get(ni).opm;
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
      if (c.stamp !== plan.stamp) evalConstraint(plan, c);
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
  if (rest.isScale || (rest.isNode ?? -1) >= 0) isScale = s.isNode >= 0 ? plan.steps.get(s.isNode).cur.s : rest.isScale;
  composeLocalMatrix(cur, isScale, s.local);
}

const _ps = new Matrix4(), _pw = new Matrix4(), _pwInv = new Matrix4(), _piv = new Vector3(), _pos = new Vector3();
const _qa = new Quaternion(), _qs = new Quaternion();

/** parentConstraint の出力（RigEvaluator.constraint の parentConstraint と同じ） */
function evalConstraint(plan, c) {
  c.stamp = plan.stamp;
  const rig = plan.rig;
  const pw = c.driven >= 0 ? parentSpace(plan, c.driven, _pw) : IDENTITY;
  _pwInv.copy(pw).invert();
  for (const t of c.targets) {
    const ts = plan.steps.get(t.ni), m = t.m;
    if (!ts.cur) {                                   // レストの値のないノード: ワールド行列そのもの
      m.copy(ts.world);
    } else {
      // ターゲットの行列: 親の空間 · 回転ピボットの位置 · [親のスケールの打ち消し] · jointOrient · rotate · scale
      const tc = ts.cur, trest = ts.rest;
      const ps = parentSpace(plan, t.ni, _ps);
      const rp = trest.rp || [0, 0, 0], rpt = trest.rpt || [0, 0, 0];
      _piv.set(tc.t[0] + rp[0] + rpt[0], tc.t[1] + rp[1] + rpt[1], tc.t[2] + rp[2] + rpt[2]).applyMatrix4(ps);
      m.copy(ps).setPosition(_piv);
      if (t.tsc) {
        const is = ts.isNode >= 0 ? plan.steps.get(ts.isNode).cur.s : (trest.isScale || null);
        if (is) m.multiply(_m.makeScale(is[0] ? 1 / is[0] : 1, is[1] ? 1 / is[1] : 1, is[2] ? 1 / is[2] : 1));
      }
      if (trest.joint && tc.jo) m.multiply(_m.makeRotationFromQuaternion(eulerQuat(tc.jo, 0, _q)));
      m.multiply(_m.makeRotationFromQuaternion(eulerQuat(tc.r, tc.ro || 0, _q)));
      m.multiply(_m.makeScale(tc.s[0], tc.s[1], tc.s[2]));
    }
    m.multiply(t.tot).multiply(t.tor);
  }
  // 位置と向き（重み付きの平均）
  _pos.set(0, 0, 0);
  for (const t of c.targets) _pos.addScaledVector(_v.setFromMatrixPosition(t.m), t.w / c.total);
  const ref = rotationOf(c.targets[0].m, c.targets[0].q);
  _qa.set(0, 0, 0, 0);
  for (const t of c.targets) {
    const q = t === c.targets[0] ? ref : rotationOf(t.m, t.q);
    const sgn = q.dot(ref) < 0 ? -t.w : t.w;
    _qa.x += q.x * sgn; _qa.y += q.y * sgn; _qa.z += q.z * sgn; _qa.w += q.w * sgn;
  }
  _qa.normalize();
  // 動かされるノードの親の空間へ
  _pos.applyMatrix4(_pwInv);
  const ct = c.ct, cr = c.cr;
  ct[0] = _pos.x + 0 - c.crp[0] - c.crt[0];
  ct[1] = _pos.y + 0 - c.crp[1] - c.crt[1];
  ct[2] = _pos.z + 0 - c.crp[2] - c.crt[2];
  rotationOf(pw, _qs).invert().multiply(_qa);
  if (c.joInv) _qs.premultiply(c.joInv);
  const er = mayaEuler(_qs, c.ro, c.ref);
  for (let a = 0; a < 3; a++) cr[a] = er[a] * R2D * D2R;
  const o = c.out;
  o.ct = ct; o.ctx = ct[0]; o.cty = ct[1]; o.ctz = ct[2];
  o.cr = cr; o.crx = cr[0]; o.cry = cr[1]; o.crz = cr[2];
}

/**
 * フレーム f を計画どおりに計算する。動くノードのローカル行列を target（ノード番号 → Matrix4）に入れる
 */
export function runPlan(plan, f, target) {
  plan.stamp = (plan.stamp || 0) + 1;
  const rig = plan.rig;
  for (const s of plan.order) {
    if (s.kind === STATIC) {
      s.world.multiplyMatrices(parentWorld(plan, s.ni), rig.staticLocal(s.ni));
      continue;
    }
    evalChannels(plan, s, f);
    s.world.multiplyMatrices(parentWorld(plan, s.ni), s.local);
  }
  for (const s of plan.moving) {
    const m = target.get(s.ni) || new Matrix4();
    target.set(s.ni, m.copy(s.local));
  }
  return target;
}
