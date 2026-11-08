// リグの専用の評価（コンパイル）。
//
// RigEvaluator（rig.js）は、値ごとのキャッシュ（Map）・依存の記録・属性の値の引き回しを通して、どんなグラフでも
// 評価できる。この汎用の仕組みの負荷が大きいので、扱える種類のノードだけでできたリグは、最初の評価のあとで
// 「計画」（計算の順番・ノードごとの手順・時間で変わらない値）を作り、2 回目からは計画どおりに計算する。
// 計算は RigEvaluator と同じ数式を同じ順番で行い、結果はビット単位で同じになる（tests/compiled.test.mjs）。
//
// 専用に計算するもの: 動かないノード・カーブだけで動くノード・コンストレイントの出力（と、チャンネルと同じ属性の
// カーブ）で動くノード。コンストレイントの重み・オフセットなどは時間で変わらないもの、ターゲットは DAG ノード。
// IK（スプライン以外）で動くジョイントは、RigEvaluator と同じ解き方の関数（rig.js の solveIKCore）に、計画の値を
// 読ませて解く（極ベクトル・ひねり・ブレンドの属性は RigEvaluator の読み方のまま）。
// それ以外の動くノード（スプライン IK・計算ノードの入力・推定のノードなど）は「任せるノード」として、計算の順番の中で
// RigEvaluator に計算させる。専用に計算した値（ワールド行列・ローカル行列・チャンネルの値）は RigEvaluator の
// フレームのキャッシュに入れるので、RigEvaluator はそれを読み、結果は同じになる（props・形の変わるカーブも、
// 評価のあとで RigEvaluator がキャッシュから求める）。ポーズ確認の追加分があるあいだは RigEvaluator が評価する。
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { clampLimits, composeLocalMatrix, decomposeMaya, evaluateCurve, mayaEuler } from './animation.js';
import { solveIKCore } from './rig.js';
import { mathKind } from './mathNodes.js';
import { enterDeep, leaveDeep, mayOverflow, newDeepState, runDeep, useOrder } from './deepEval.js';

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
// 専用の評価で値を読む計算ノード（入力だけで出力が決まるもの。ほかに mathNodes.js の新しい計算ノード・自作ノードの定義）。
// 計算は RigEvaluator.outputsUncached をそのまま使う
const MATH_TYPES = new Set(['unitConversion', 'multiplyDivide', 'plusMinusAverage', 'reverse', 'condition', 'blendColors',
  'pairBlend', 'multMatrix', 'decomposeMatrix', 'composeMatrix', 'inverseMatrix', 'fourByFourMatrix', 'quatToEuler',
  'eulerToQuat', 'quatProd', 'quatInvert', 'quatNormalize', 'quatSlerp', 'addDoubleLinear', 'multDoubleLinear', 'clamp',
  'setRange', 'remapValue', 'distanceBetween', 'distanceBetweenDL', 'vectorProduct', 'blendTwoAttr', 'blendWeighted', 'choice',
  'animBlendNodeAdditiveDL', 'animBlendNodeAdditiveDA', 'animBlendNodeAdditive', 'animBlendNodeAdditiveF',
  'animBlendNodeAdditiveFL', 'animBlendNodeAdditiveFA', 'animBlendNodeAdditiveI16', 'animBlendNodeAdditiveI32',
  'animBlendNodeAdditiveScale', 'animBlendNodeBoolean', 'animBlendNodeEnum', 'animBlendNodeAdditiveRotation',
  'animCurveUA', 'animCurveUL', 'animCurveUU', 'animLayer', 'expression']);
const TRS_RE = /^[trs][xyz]?$/;
const MATRIX_PLUGS = new Set(['wm', 'worldMatrix', 'wim', 'worldInverseMatrix', 'm', 'matrix', 'xm', 'xformMatrix', 'im', 'inverseMatrix']);
const PM_PLUGS = new Set(['pm', 'parentMatrix', 'pim', 'parentInverseMatrix']);
const IDENTITY = new Matrix4();
const STATIC = 0, SIMPLE = 1, DRIVEN = 2, DELEGATED = 3;
const MAX_CYCLE_CUTS = 256;            // 計算の順番の循環を、ノードを任せて断つ回数の上限

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
  const r = build(rig, deps, true);
  // 数式ノードの読むノードで計算の順番が決まらないときは、数式ノードを任せて作り直す
  return r.cycle ? build(rig, deps, false) : r;
}

function build(rig, deps, useMath) {
  const fail = (reason, cycle = false) => ({ reason, cycle: cycle && useMath });
  if (!rig.keepStatic) return fail('時間で変わらない値を使い回さない設定');
  if (rig.problems.size) {
    const list = [...rig.problems];
    return fail(`評価の打ち切り（循環など。計算の順番で結果が変わりうる: ${list[0]}${list.length > 1 ? ` ほか ${list.length - 1} 件` : ''}）`);
  }
  const nodes = rig.sceneNodes;
  const staticPlug = (id, attr) => {
    const km = rig.keep.plug.get(id);
    return !!km && km.has(attr);
  };
  const steps = new Map();             // ノード番号 → 手順
  const NO_READS = { why: null, reads: [] };
  const walked = new Map();            // ノードの id（DAG ノードは id.属性）→ 結果（たどっている途中は NO_READS: 循環）
  const combine = (own, parts) => {
    const out = new Map();
    for (const r of own) out.set(r.ni + ':' + r.base, r);
    for (const p of parts) {
      if (p.why) return p;
      for (const r of p.reads) out.set(r.ni + ':' + r.base, r);
    }
    return { why: null, reads: [...out.values()] };
  };
  // 上流が長い鎖でスタックがあふれたら、いちばん深い所を先にたどってやり直す（deepEval.js。walkSource を呼ぶ所）
  const deepWalk = newDeepState();
  const remember = (key, compute) => {
    const hit = walked.get(key);
    if (hit) return hit;
    let r;
    let entered = false;
    try {
      walked.set(key, NO_READS);                         // try の中で付ける（あふれたら、下で必ず消す）
      enterDeep(deepWalk);                               // 入れ子の段数を数える（deepEval.js）
      entered = true;
      r = compute();
    } catch (e) {
      walked.delete(key);                                // たどっている途中の印を残さない（やり直しで循環に見えないように）
      if (deepWalk.depth && deepWalk.at === null && mayOverflow(e)) {
        deepWalk.at = () => remember(key, compute);
        deepWalk.at.place = walked;                      // 同じ計算か（deepEval.js の runDeep）
        deepWalk.at.key = key;
      }
      throw e;
    } finally {
      if (entered) leaveDeep(deepWalk);
    }
    walked.set(key, r);
    return r;
  };
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
    steps.set(ni, { ni, kind: DELEGATED, world: new Matrix4(), local: null, deps: deps.get(ni) || null, why });
  };
  for (const ni of rig.moving) {
    const why = movingStep(ni);
    if (why) delegate(ni, why);
  }
  function movingStep(ni) {
    if (rig.ikJoint.has(ni) && rig.byId.get(rig.ikJoint.get(ni)).ik.solver === 'ikSplineSolver') return 'スプライン IK で動くジョイント';
    if (rig.fallback.has(ni)) return '推定のノード';
    const e = rig.clip.byNode.get(ni);
    const rest = rig.rest(ni);
    if (!e || !rest) return '材料のない動くノード';
    const fromCurve = new Set(e.channels.map((ch) => ch.attr));
    const inputs = [], rawReads = [];
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
      if (g && useMath && !CON_TYPES[g.type]) {
        // 計算ノード・DAG ノードからの接続: 上流をたどって、扱える種類か・読む DAG ノードを調べる
        const w = runDeep(deepWalk, () => walkSource(src));
        if (w.why) return w.why;
        inputs.push({ base, axis, src });
        for (const r of w.reads) rawReads.push(r);
        continue;
      }
      // コンストレイントが自分も動く transform（dag >= 0。lookAt のグループ・子を持つコンストレイント）でも、出力の計算は同じ
      if (!g || !CON_TYPES[g.type] || g.def) return `チャンネルの入力（${g ? g.type : '不明'}）`;
      const attr = String(src.attr).replace(/\[\d+\]$/, '');
      if (!CON_TYPES[g.type].has(attr)) return `${g.type} の出力 ${src.attr}`;
      const con = constraintOf(g);
      if (typeof con === 'string') return con;
      inputs.push({ base, axis, con, attr });
    }
    const opm = opmOf(ni);
    if (opm === undefined) return '接続された offsetParentMatrix';
    steps.set(ni, {
      ni, kind: inputs.some((x) => x.con || x.src) ? DRIVEN : SIMPLE, e, rest, inputs, opm, rawReads, reads: [], done: -1,
      fromCurve, cur: null, local: new Matrix4(), world: new Matrix4(),
      isNode: (rest.isNode ?? -1) >= 0 && rig.rest(rest.isNode) ? rest.isNode : -1,
      deps: deps.get(ni) || null, ik: null, fk: null, fkStamp: -1,
    });
    return null;
  }

  // ---- 計算ノードの上流（RigEvaluator.source → plug → outputs と同じ形をたどる）。
  // 戻り値 { why: 扱えない理由か null, reads: 読む DAG ノードと属性 [{ ni, base }] }。ノード（DAG ノードは属性）ごとに
  // 結果を覚えて、どのノードも 1 回だけたどる（入力ごとにたどり直すと、大きな計算ノードのネットワークで時間が二乗で増える）
  function walkSource(src) {
    if (src.curve !== undefined) return NO_READS;
    const g = rig.byId.get(src.node);
    if (!g) return { why: 'チャンネルの入力（不明）', reads: [] };
    if (g.dag >= 0) {
      const base = String(src.attr).replace(/\[\d+\]$/, '');
      const self = { ni: g.dag, base };
      if (TRS_RE.test(base) || PM_PLUGS.has(base) || MATRIX_PLUGS.has(base)) return { why: null, reads: [self] };
      if (base === 'opm' || base === 'offsetParentMatrix') return { why: null, reads: [self] };    // RigEvaluator が求める
      // それ以外（ピボット・カスタム属性など）: その属性への接続をたどる
      return remember(g.id + '.' + base, () => combine([self],
        Object.entries(g.inputs || {}).filter(([k]) => k === base || k.startsWith(base)).map(([, s2]) => walkSource(s2))));
    }
    if (!(g.def || MATH_TYPES.has(g.type) || mathKind(g.type))) return { why: `チャンネルの入力（${g.type}）`, reads: [] };
    return remember(g.id, () => combine([], Object.values(g.inputs || {}).map(walkSource)));
  }
  // 読む DAG ノードから、先に計算しておくノード（reads）を決める。扱えなければ任せる
  const constChan = new Map();         // 動かないノード → チャンネルの値（レストの値に制限を当てたもの）
  const pmOpm = new Map();             // 手順のないノード → offsetParentMatrix
  const under = (x, ni) => { for (let p = x; p >= 0; p = nodes[p].parent) if (p === ni) return true; return false; };
  for (const st of [...steps.values()]) {
    if (!st.rawReads || !st.rawReads.length || st.kind === DELEGATED) continue;
    const why = (() => {
      const reads = new Set();
      for (const { ni: x, base } of st.rawReads) {
        if (TRS_RE.test(base)) {
          if (!rig.rest(x)) continue;
          const xs = steps.get(x);
          if (!rig.moving.has(x) || !xs) {
            if ((rig.clip.byNode.get(x) || { channels: [] }).channels.length || rig.chanInputs(x).length) return '動かないノードのチャンネルの入力を読む';
            if (!constChan.has(x)) {
              const r = rig.rest(x), c = { ...r };
              for (const k of VEC_KEYS) if (r[k]) c[k] = r[k].slice();
              constChan.set(x, clampLimits(c));
            }
            continue;
          }
          if (xs.kind === DELEGATED) continue;                           // RigEvaluator が求める
          if (base[0] === 't' && !xs.inputs.some((y) => (y.con || y.src) && y.base === 't')) continue;   // 移動はその場で求める
          reads.add(x);
        } else if (PM_PLUGS.has(base)) {
          const p = nodes[x].parent;
          if (p >= 0) reads.add(p);
          if (!steps.get(x)) {
            const o = opmOf(x);
            if (o === undefined) return '接続された offsetParentMatrix を読む';
            pmOpm.set(x, o);
          }
        } else if (MATRIX_PLUGS.has(base)) reads.add(x);
      }
      for (const x of reads) if (under(x, st.ni)) return '自分（とその下）の値を読む入力';
      st.reads = [...reads];
      return null;
    })();
    if (why) delegate(st.ni, why);
  }

  // ---- poleVectorConstraint（RigEvaluator.constraint の poleVectorConstraint と pvcTargetPosition・pvcStartPosition）。
  // ハンドルの pv がそのコンストレイントの ct だけにつながり、属性が時間で変わらない値か DAG ノードの t・rp・rpt・pm の
  // 直接の接続のときだけ。戻り値は手順か null（RigEvaluator が読む）
  function poleVectorOf(h, chain) {
    const ins = h.inputs || {};
    const srcs = ['pvx', 'pvy', 'pvz'].map((k) => ins[k]);
    if (ins.pv || srcs.some((x) => !x || x.curve !== undefined)) return null;
    const pg = rig.byId.get(srcs[0].node);
    if (!pg || pg.type !== 'poleVectorConstraint' || pg.def || pg.dag >= 0 || pg.driven !== h.dag) return null;
    if (srcs.some((x, a) => x.node !== pg.id || x.attr !== 'ct' + XYZ[a])) return null;
    const id = pg.id, pins = pg.inputs || {};
    // 属性の読み方: 時間で変わらない値（定数）か、DAG ノードからの接続（{ ni, attr }）
    const reader = (attr, kind) => {
      if (staticPlug(id, attr)) return { value: kind === 'mat' ? rig.mat(id, attr) : rig.vec(id, attr) };
      const src = pins[attr];
      if (!src || src.curve !== undefined) return null;
      const sg = rig.byId.get(src.node);
      if (!sg || sg.dag < 0) return null;
      const a = String(src.attr).replace(/\[\d+\]$/, '');
      if (kind === 'mat' ? a !== 'pm' : a !== 't') return null;
      return { ni: sg.dag, attr: a };
    };
    const targets = [];
    for (const t of pg.targets || []) {
      const tg = rig.byId.get(t.node);
      if (!tg) continue;
      const b = `tg[${t.index}]`;
      if (!staticPlug(id, `${b}.tw`)) return null;
      const w = rig.num(id, `${b}.tw`, 1);
      if (!(w > 0)) continue;
      if (!(pins[`${b}.tt`] || pins[`${b}.tpm`] || pins[`${b}.ttx`])) return null;      // ターゲットのワールド行列から（扱わない）
      const tt = reader(`${b}.tt`, 'vec'), trp = reader(`${b}.trp`, 'vec'), trt = reader(`${b}.trt`, 'vec'), tpm = reader(`${b}.tpm`, 'mat');
      if (!tt || !trp || !trt || !tpm || trp.ni !== undefined || trt.ni !== undefined) return null;
      targets.push({ w, tt, trp: trp.value, trt: trt.value, tpm });
    }
    const total = targets.reduce((x, t) => x + t.w, 0);
    if (total <= EPS) return null;
    const has = (k) => Object.keys(pins).some((x) => x === k || x.startsWith(k)) || Object.keys(pg.attrs || {}).some((x) => x === k || x.startsWith(k));
    if (!(has('crp') || has('ps') || has('crt'))) return null;
    const crp = reader('crp', 'vec'), crt = reader('crt', 'vec'), ps = reader('ps', 'mat');
    if (!crp || !crt || !ps || crt.ni !== undefined) return null;
    // 計算の順番: 読むノード（ターゲット・開始ジョイント）。開始ジョイントの pm はチェーンの開始ジョイントか、チェーンの外
    const reads = [];
    for (const r of [...targets.flatMap((t) => [t.tt, t.tpm]), crp, ps]) {
      if (r.ni === undefined) continue;
      if (chain.includes(r.ni) && !(r.ni === chain[0] && (r.attr === 'pm' || r.attr === 't'))) return null;
      if (!chain.includes(r.ni)) reads.push(r.ni);
      if (r.attr === 't' && rig.moving.has(r.ni) && steps.get(r.ni) && steps.get(r.ni).kind === DRIVEN
        && steps.get(r.ni).inputs.some((x) => (x.con || x.src) && x.base === 't')) return null;   // コンストレイントで移動するノード
    }
    return { id, targets, total, crp, crt: crt.value, ps, reads };
  }

  // ---- IK（スプライン以外）。チェーンのジョイント（終端を除く）がすべて専用に計算できるときだけ。扱えなければ任せる
  const iks = new Map();               // ハンドル（グラフの id）→ IK の手順
  for (const id of new Set(rig.ikJoint.values())) {
    const g = rig.byId.get(id);
    if (g.ik.solver === 'ikSplineSolver') continue;
    const chain = g.ik.chain, joints = chain.slice(0, -1), end = chain[chain.length - 1];
    const why = (() => {
      if (g.dag < 0) return 'IK のハンドルがない';
      for (const ni of joints) {
        const st = steps.get(ni);
        if (!st || st.kind === DELEGATED) return 'IK のチェーンに任せたジョイント';
        if (rig.ikJoint.get(ni) !== id) return '複数の IK のチェーン';
      }
      for (let p = g.dag; p >= 0; p = nodes[p].parent) if (chain.includes(p)) return 'IK のチェーンの下のハンドル';
      if (rig.moving.has(end)) {
        const st = steps.get(end);
        // IK が読むのは終端の移動の値だけ。移動に入るコンストレイントがあれば任せる（回転だけなら読まない）
        if (st && st.kind === DRIVEN && st.inputs.some((x) => (x.con || x.src) && x.base === 't')) return '入力で移動する IK の終端';
      } else if (rig.rest(end) && ((rig.clip.byNode.get(end) || { channels: [] }).channels.length || rig.chanInputs(end).length)) {
        return 'IK の終端のチャンネルの入力';
      }
      return null;
    })();
    if (why) {
      for (const ni of joints) if (steps.get(ni) && steps.get(ni).kind !== DELEGATED) delegate(ni, why);
      continue;
    }
    // 動かない終端の移動の値（RigEvaluator の chan(end, 't'): レストの値に制限を当てたもの）
    let endChan = null;
    if (!rig.moving.has(end) && rig.rest(end)) {
      const r = rig.rest(end);
      endChan = { ...r };
      for (const k of VEC_KEYS) if (r[k]) endChan[k] = r[k].slice();
      clampLimits(endChan);
    }
    const ik = { id, chain, joints, end, endMoving: rig.moving.has(end), endChan, handle: g.dag, stamp: -1, sol: null, ev: null,
      pvc: g.ik.solver === 'ikRPsolver' && chain.length >= 3 ? poleVectorOf(g, chain) : null, nums: new Map(), pvStamp: -1, pv: null };
    // 極ベクトル・ひねり・ブレンドで、時間で変わるのに専用に計算しないものがあれば、RigEvaluator が読む（キャッシュに値を入れる）
    // （解き方が読む属性: ブレンドはすべて、ひねり・極ベクトルは 3 本以上のジョイントの回転プレーンだけ）
    const rp = g.ik.solver === 'ikRPsolver' && chain.length >= 3;
    ik.reads = !staticPlug(id, 'ikb') || (rp && (!staticPlug(id, 'twi') || (!ik.pvc && !staticPlug(id, 'pv'))));
    iks.set(id, ik);
    for (const ni of joints) {
      const st = steps.get(ni);
      st.ik = ik;
      st.kind = DRIVEN;
    }
  }
  // コンストレイントのターゲットは、ピボットの接続がないこと（あれば、そのコンストレイントで動くノードを任せる）
  const badCons = new Set([...cons.values()].filter((c) => c.targets.some((t) => rig.rest(t.ni)
    && rig.chanInputs(t.ni).some(([k]) => /^(rp|rpt)[xyz]?$/.test(k)))));
  if (badCons.size) {
    for (const c of badCons) cons.delete(c.id);
    for (const st of [...steps.values()]) if (st.inputs && st.inputs.some((x) => badCons.has(x.con))) delegate(st.ni, 'ターゲットの接続されたピボット');
  }

  // ---- 計算の順番（親・ターゲット・親のスケールの打ち消しのノードが先）
  const order = [];
  let restFail = null;                 // 動かないノードの材料が扱えない（そのノード番号）
  let cycleAt = -1;                    // 循環を見つけたノード
  let cycle = null;                    // 循環のノードの並び（たどっている途中のノードのうち、cycleAt から先）
  const stack = [];                    // たどっている途中のノード
  const staticAdded = [];              // visit が足した動かないノードの手順（順番を決め直すときに消す）
  const state = new Map();             // 0 = 調べている途中・1 = 済み
  const visit = (ni) => {
    const st = state.get(ni);
    if (st === 1) return true;
    if (st === 0) {                                                     // 循環
      if (cycleAt < 0) { cycleAt = ni; cycle = stack.slice(stack.lastIndexOf(ni)); }
      return false;
    }
    state.set(ni, 0);
    stack.push(ni);
    const p = nodes[ni].parent;
    if (p >= 0 && !visit(p)) return false;
    const s = steps.get(ni);
    if (s && s.kind !== DELEGATED) {
      if (s.isNode >= 0 && !(s.ik && s.ik.chain.includes(s.isNode)) && !visit(s.isNode)) return false;
      for (const x of s.inputs) if (x.con) for (const t of x.con.targets) if (!visit(t.ni)) return false;
      if (s.reads) for (const x of s.reads) if (!visit(x)) return false;
      if (s.ik && s.ik.chain[0] === ni) {
        // 開始ジョイントで IK を解く: ハンドル・チェーンのジョイントのコンストレイントのターゲット・親のスケールの打ち消しの元が先
        const ik = s.ik;
        if (!visit(ik.handle)) return false;
        if (ik.pvc) for (const r of ik.pvc.reads) if (!visit(r)) return false;
        for (const m of ik.chain) {
          const ms = steps.get(m);
          const isn = ms ? ms.isNode : ((rig.rest(m) || {}).isNode ?? -1);
          if (isn >= 0 && rig.rest(isn) && !ik.chain.includes(isn) && !visit(isn)) return false;
          if (ms && ms.inputs && m !== ni) for (const x of ms.inputs) if (x.con) for (const t of x.con.targets) if (!visit(t.ni)) return false;
          if (ms && ms.reads && m !== ni) for (const x of ms.reads) if (!visit(x)) return false;
        }
      }
    }
    state.set(ni, 1);
    stack.pop();
    if (!s) {
      const opm = opmOf(ni);
      if (opm === undefined) return false;
      const st = { ni, kind: STATIC, opm, world: new Matrix4(), rest: rig.rest(ni) || null, cur: null, isNode: -1 };
      if (st.rest) {
        // 動かないが、レストの値を持つノード（コンストレイントのターゲット・親のスケールの元）。RigEvaluator は
        // チャンネルの経路で読む: カーブも入力もなければ、レストの値に制限を当てたもので毎フレーム同じ
        const e = rig.clip.byNode.get(ni);
        if ((e && e.channels.length) || rig.chanInputs(ni).length) { restFail = ni; return false; }
        st.cur = { ...st.rest };
        for (const k of VEC_KEYS) if (st.rest[k]) st.cur[k] = st.rest[k].slice();
        clampLimits(st.cur);
        // 親のスケールの打ち消しの元（レストの値があるもの）は先に計算する（isScaleOf がその値を読む）
        const isn = st.rest.isNode ?? -1;
        if (isn >= 0 && rig.rest(isn) && !visit(isn)) return false;
      }
      steps.set(ni, st);
      staticAdded.push(ni);
    }
    order.push(steps.get(ni));
    return true;
  };
  // 理由には、見つけたノードの名前と、同じ条件のノードの数を入れる（どのノードを直せばよいか分かるように）
  const nameOf = (ni) => (nodes[ni] && (nodes[ni].name || nodes[ni].path)) || `ノード ${ni}`;
  const why = () => {
    if (restFail === null) {
      // 循環のノードの並び（多ければ先頭から 6 個）。IK のチェーンのジョイントだけの循環は、任せられずに残る
      const names = cycle && cycle.length ? cycle.map(nameOf) : [cycleAt >= 0 ? nameOf(cycleAt) : '不明'];
      const shown = names.length > 6 ? [...names.slice(0, 6), `ほか ${names.length - 6} 個`] : names;
      return `計算の順番が決まらない（循環: ${shown.join(' → ')}）`;
    }
    let n = 0;
    nodes.forEach((_, i) => {
      if (rig.moving.has(i) || !rig.rest(i)) return;
      const e = rig.clip.byNode.get(i);
      if ((e && e.channels.length) || rig.chanInputs(i).length) n++;
    });
    return `動かないノードのチャンネルの入力（${nameOf(restFail)}${n > 1 ? ` ほか ${n - 1} 個` : ''}）`;
  };
  const runOrder = () => {
    order.length = 0;
    state.clear();
    stack.length = 0;
    restFail = null;
    cycleAt = -1;
    cycle = null;
    for (const ni of staticAdded) steps.delete(ni);
    staticAdded.length = 0;
    for (const ni of rig.moving) if (!visit(ni)) return false;
    for (const c of cons.values()) {
      for (const t of c.targets) if (!visit(t.ni)) return false;
      if (c.driven >= 0 && !visit(c.driven)) return false;
    }
    return true;
  };
  // ノード単位の順番に循環があっても、属性単位では順番が決まることがある（あるノードの回転を読み、そのノードが自分の
  // 別の属性を読む、など。RigEvaluator は属性ごとに求めるので計算できる）。循環の中のノードを 1 つ RigEvaluator に任せて
  // （IK のチェーンのジョイントは任せない）、順番を決め直す。任せたノードは、読むノードの値を自分で求める
  for (let cuts = 0; !runOrder(); cuts++) {
    const pick = restFail === null && cycle && cuts < MAX_CYCLE_CUTS
      ? cycle.find((x) => { const st = steps.get(x); return st && rig.moving.has(x) && (st.kind === SIMPLE || st.kind === DRIVEN) && !st.ik; })
      : undefined;
    if (pick === undefined) return fail(why(), restFail === null);
    delegate(pick, '計算の順番の循環の中のノード');
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
      delegated: order.filter((s) => s.kind === DELEGATED).length, constraints: cons.size, ik: iks.size },
    delegated: Object.fromEntries(delegated),
    iks: [...iks.values()],
    // RigEvaluator のフレームのキャッシュに値を入れるか: 任せたノード・props・形の変わるカーブがあるとき（RigEvaluator が
    // 読むので）。なければ入れない（評価のあとで RigEvaluator が値を求めても、計算し直すので同じ値）
    // IK の極ベクトル・ひねりなどの属性は RigEvaluator が読む（poleVectorConstraint などはキャッシュの値を使う）ので入れる
    share: delegated.size > 0 || [...iks.values()].some((ik) => ik.reads) || rig.props.length > 0 || rig.curveIds().length > 0,
    depsAdded: false, f: 0,
  };
  for (const ik of iks.values()) ik.ev = ikReader(plan, ik);
  plan.ad = useMath ? mathReader(plan, constChan, pmOpm) : null;
  plan.counts.math = order.filter((s) => s.inputs && s.inputs.some((x) => x.src)).length;
  return { plan };
}

// ---------------------------------------------------------------------------- 1 フレームの計算

/** チャンネルの値（mode: 'full' | 'fk' | 't'）。専用に計算したノードは計算した値、任せたノードは RigEvaluator から */
function chanOf(plan, ni, mode) {
  const s = plan.steps.get(ni);
  if (s && s.ik && mode === 'fk') return fkOf(plan, s);
  return s && s.cur && s.kind !== DELEGATED ? s.cur : plan.rig.chan(ni, mode);
}

/** IK で動くジョイントの FK の値（IK を除いたチャンネルの値。RigEvaluator.chan(ni, 'fk')）。フレームごとに 1 回 */
function fkOf(plan, s) {
  if (s.fkStamp !== plan.stamp) {
    if (!s.fk) { s.fk = { ...s.rest }; for (const k of VEC_KEYS) if (s.rest[k]) s.fk[k] = s.rest[k].slice(); }
    channelValues(plan, s, plan.f, s.fk);
    s.fkStamp = plan.stamp;
  }
  return s.fk;
}

/** IK を解く（フレームごとに 1 回）。開始ジョイント・中間ジョイントなど → 回転（度）の Map か null */
function solveOf(plan, ik) {
  if (ik.stamp !== plan.stamp) { ik.sol = solveIKCore(ik.ev, ik.id); ik.stamp = plan.stamp; }
  return ik.sol;
}

/**
 * 計算ノードの値の読み方: RigEvaluator を土台に、plug・outputs・dagPlug だけを差し替えたもの。計算ノードの種類ごとの
 * 計算（outputsUncached）・属性の求め方（plugUncached）は RigEvaluator のものをそのまま使う。
 * 時間で変わらない値は RigEvaluator が覚えた値（keep）、時間で変わる値はフレームごとに 1 回計算し、
 * DAG ノードの移動・回転・スケール・行列は計画の値を返す
 */
function mathReader(plan, constChan, pmOpm) {
  const rig = plan.rig;
  const proto = Object.getPrototypeOf(rig);
  const ad = Object.create(rig);
  // 読み手の上で値を覚える所（RigEvaluator の memo。world・chan など）は、時間で変わらない値（keep）に入れない。
  // 読み手の plug・outputs・dagPlug は計画の値を返し、「時間で変わる」の印（varying）を付けないので、時間で変わる値を
  // keep に入れて以後のフレームで使い回してしまう（スプライン IK のカーブが止まるなど）。このフレームの値として覚える
  ad.keepStatic = false;
  // ノードごとの記録: 時間で変わらない値（RigEvaluator の keep）と、このフレームの値（stamp が違えば捨てる）
  const recs = new Map();
  const recOf = (id) => {
    let r = recs.get(id);
    if (!r) recs.set(id, r = { g: rig.byId.get(id), km: rig.keep.plug.get(id) || null, slots: new Map(), out: undefined, outStamp: -1 });
    return r;
  };
  // 属性ごとの記録（スロット）: 時間で変わらない値か・求め方（plugPlan）・このフレームの値とそのフレームの番号（stamp）。
  // 属性を読むたびに表を何度も引かないよう、2 回目からはスロットを引くだけにする
  const slotOf = (r, attr) => {
    const sl = { fixed: false, v: undefined, stamp: -1, plan: null };
    if (r.km && r.km.has(attr)) { sl.fixed = true; sl.v = r.km.get(attr); }
    r.slots.set(attr, sl);
    return sl;
  };
  ad.plug = function plug(id, attr) {
    const r = recs.get(id) || recOf(id);
    const sl = r.slots.get(attr) || slotOf(r, attr);
    if (sl.fixed || sl.stamp === plan.stamp) return sl.v;
    // 時間で変わらない値があとから覚えられていれば使う（任せたノードを RigEvaluator が求めたときなど）
    const km = r.km || (r.km = rig.keep.plug.get(id) || null);
    if (km && km.has(attr)) { sl.fixed = true; sl.v = km.get(attr); return sl.v; }
    let v;
    let entered = false;
    try {
      enterDeep(ad.deepState);                           // 入れ子の段数を数える（deepEval.js）
      entered = true;
      v = proto.plugWithPlan.call(ad, r.g, attr, sl.plan || (sl.plan = proto.plugPlan.call(ad, r.g, attr)));
    } catch (e) {
      const ds = ad.deepState;                         // ad.outputs と同じ
      if (ds.depth && ds.at === null && mayOverflow(e)) {
        ds.at = () => ad.plug(id, attr);
        ds.at.warm = { key: `p${id}.${attr}`, id, attr };   // 次のフレームから先に求める（rig.js の prewarmDeep）
        ds.at.place = r.slots;                         // 同じ計算か（deepEval.js の runDeep）
        ds.at.key = attr;
      }
      throw e;
    } finally {
      if (entered) leaveDeep(ad.deepState);
    }
    sl.v = v;
    sl.stamp = plan.stamp;
    return v;
  };
  ad.outputs = function outputs(id) {
    const ko = rig.keep.out.get(id);
    if (ko !== undefined || rig.keep.out.has(id)) return ko;
    const r = recOf(id);
    if (r.outStamp !== plan.stamp) {
      let entered = false;
      try {
        enterDeep(ad.deepState);                         // 入れ子の段数を数える（deepEval.js）
        entered = true;
        r.out = proto.outputsUncached.call(ad, id);
      } catch (e) {
        // スタックがあふれたら、この値をあとで浅い所から求め直せるようにする（rig.js の memo と同じ。deep）
        const ds = ad.deepState;
        if (ds.depth && ds.at === null && mayOverflow(e)) {
          ds.at = () => ad.outputs(id);
          ds.at.warm = { key: `o${id}`, id, attr: null };   // 次のフレームから先に求める（rig.js の prewarmDeep）
          ds.at.place = recs;                            // 同じ計算か（deepEval.js の runDeep）
          ds.at.key = id;
        }
        throw e;
      } finally {
        if (entered) leaveDeep(ad.deepState);
      }
      r.outStamp = plan.stamp;
    }
    return r.out;
  };
  // 属性名の解析（添字を除いた名前・移動回転スケールか・その成分）は名前で決まるので、名前ごとに 1 回だけ行う
  const parsed = new Map();
  const parse = (attr) => {
    let p = parsed.get(attr);
    if (!p) {
      const base = attr.replace(/\[\d+\]$/, '');
      const trs = TRS_RE.test(base);
      parsed.set(attr, p = { base, trs, axis: trs && base.length === 2 ? XYZ.indexOf(base[1]) : -1 });
    }
    return p;
  };
  const comp = (arr, k) => (k >= 0 ? arr[k] : arr);
  ad.dagPlug = function dagPlug(ni, attr) {
    const { base, trs, axis } = parse(attr);
    const s = plan.steps.get(ni);
    if (trs) {
      if (!rig.rest(ni)) return axis >= 0 ? (base[0] === 's' ? 1 : 0) : (base[0] === 's' ? [1, 1, 1] : [0, 0, 0]);
      let c;
      if (!s) c = constChan.get(ni);
      else if (s.kind === DELEGATED) c = rig.chan(ni, base[0] === 't' ? 't' : 'full');
      else if (s.kind === STATIC) c = s.cur;
      else if (base[0] === 't' && s.done !== plan.stamp) c = chanTObj(plan, ni, plan.f);
      else c = s.cur;
      if (!c) return proto.dagPlug.call(rig, ni, attr);
      if (base[0] === 't') return comp(c.t, axis);
      if (base[0] === 'r') return comp(c.r.map((v) => v * D2R), axis);
      return comp(c.s, axis);
    }
    if (PM_PLUGS.has(base)) {
      let m;
      if (s && s.kind === DELEGATED) m = rig.parentSpace(ni);
      else {
        const P = parentWorld(plan, ni), o = s ? s.opm : pmOpm.get(ni);
        m = o ? new Matrix4().copy(P).multiply(o) : P;
      }
      return base === 'pm' || base === 'parentMatrix' ? m : m.clone().invert();
    }
    if (MATRIX_PLUGS.has(base) && s && s.kind !== DELEGATED) {
      const world = base === 'wm' || base === 'worldMatrix' || base === 'wim' || base === 'worldInverseMatrix';
      let m = s.world;
      if (!world) {
        // ローカル行列は offsetParentMatrix を含まない（RigEvaluator.localMatrix と同じ）
        const L = s.kind === STATIC ? rig.staticLocal(ni) : s.local;
        m = s.opm ? s.opm.clone().invert().multiply(L) : L;
      }
      const inv = base === 'wim' || base === 'worldInverseMatrix' || base === 'im' || base === 'inverseMatrix';
      return inv ? m.clone().invert() : m;
    }
    return proto.dagPlug.call(ad, ni, attr);
  };
  return ad;
}

/** 極ベクトル（ハンドルの親の空間。RigEvaluator の poleVectorConstraint の出力 ct → ハンドルの pv と同じ） */
function poleVector(plan, ik, def) {
  const c = ik.pvc;
  const vecOf = (r) => {
    if (r.value) return r.value;
    const ch = chanTOf(plan, r.ni);
    return ch ? ch.t : [0, 0, 0];
  };
  const matOf = (r) => (r.value ? r.value : parentSpace(plan, r.ni, new Matrix4()));
  const acc = new Vector3();
  for (const t of c.targets) {
    const tt = vecOf(t.tt), trp = t.trp, trt = t.trt;
    acc.addScaledVector(new Vector3(tt[0] + trp[0] + trt[0], tt[1] + trp[1] + trt[1], tt[2] + trp[2] + trt[2]).applyMatrix4(matOf(t.tpm)), t.w / c.total);
  }
  const crp = vecOf(c.crp), crt = c.crt;
  const start = new Vector3(crp[0] + crt[0], crp[1] + crt[1], crp[2] + crt[2]).applyMatrix4(matOf(c.ps));
  const pwInv = parentSpace(plan, ik.handle, new Matrix4()).clone().invert();
  const ct = acc.sub(start).applyMatrix3(new Matrix3().setFromMatrix4(pwInv)).toArray();
  return def.map((d, i) => (Number.isFinite(ct[i]) ? ct[i] : d));
}

/** ノードの chan(ni, 't')（専用に計算するノード・任せたノード・動かないノード）。レストの値がなければ null */
function chanTOf(plan, ni) {
  const s = plan.steps.get(ni);
  if (!plan.rig.rest(ni)) return null;
  if (s.kind === STATIC) return s.cur;
  return chanTObj(plan, ni, plan.f);
}

/** IK の解き方（rig.js の solveIKCore）に渡す値の読み方。RigEvaluator の同じ名前のメソッドの値を、計画の値で返す */
function ikReader(plan, ik) {
  const rig = plan.rig;
  const ev = {
    byId: rig.byId, dagGraph: rig.dagGraph, ikVariant: null,
    rest: (ni) => rig.rest(ni),
    chan: (ni, mode) => {
      if (mode === 't') {
        if (ni !== ik.end) return rig.chan(ni, 't');
        return ik.endMoving ? chanTObj(plan, ni, plan.f) : ik.endChan;
      }
      return chanOf(plan, ni, mode);
    },
    isScaleOf: (ni) => isScaleOf(plan, ni),
    world: (ni) => plan.steps.get(ni).world,
    parentWorld: (ni) => parentWorld(plan, ni),
    parentSpace: (ni) => parentSpace(plan, ni, new Matrix4()),
    // 極ベクトル（ハンドルの親の空間）→ ワールド（RigEvaluator.pvWorld。ikVariant なし）
    pvWorld: (pv, handleNi) => new Vector3(pv[0], pv[1], pv[2]).applyMatrix3(new Matrix3().setFromMatrix4(ev.parentSpace(handleNi))),
    twistSign: () => 1,
    // ハンドルの属性: 時間で変わらないものは最初に読んだ値を使い回す。極ベクトルは専用に計算できれば計算する
    num: (id, attr, def) => {
      if (id !== ik.id) return rig.num(id, attr, def);
      const key = attr + ':' + def;
      if (ik.nums.has(key)) return ik.nums.get(key);
      const v = rig.num(id, attr, def);
      if (plan.rig.keep.plug.get(id) && plan.rig.keep.plug.get(id).has(attr)) ik.nums.set(key, v);
      return v;
    },
    vec: (id, attr, def) => (id === ik.id && attr === 'pv' && ik.pvc ? poleVector(plan, ik, def) : rig.vec(id, attr, def)),
    localEuler: (ni, q, opts) => rig.localEuler(ni, q, opts),
  };
  return ev;
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
  const { rest, cur } = s;
  if (s.ik) {
    // IK を除いた値に、IK の回転を入れて制限を当てる（RigEvaluator.chan('full') と同じ順番）
    const fk = fkOf(plan, s);
    for (const k of VEC_KEYS) { const a = fk[k]; if (a) { if (!cur[k]) cur[k] = [0, 0, 0]; const c = cur[k]; c[0] = a[0]; c[1] = a[1]; c[2] = a[2]; } }
    cur.ro = fk.ro;
    const sol = solveOf(plan, s.ik);
    const v = sol && sol.get(s.ni);
    if (Array.isArray(v)) { cur.r[0] = v[0]; cur.r[1] = v[1]; cur.r[2] = v[2]; }
    clampLimits(cur);
  } else channelValues(plan, s, f, cur);
  let isScale = null;
  if (rest.isScale || (rest.isNode ?? -1) >= 0) isScale = s.isNode >= 0 ? chanOf(plan, s.isNode, 'fk').s : rest.isScale;
  composeLocalMatrix(cur, isScale, s.local);
}

/** チャンネルの値（IK を除く。RigEvaluator.chan('fk') と同じ）を cur に入れる */
function channelValues(plan, s, f, cur) {
  const { rest, e } = s;
  for (const k of VEC_KEYS) if (rest[k]) { const a = cur[k], b = rest[k]; a[0] = b[0]; a[1] = b[1]; a[2] = b[2]; }
  for (const b of s.zeroBases) { const a = cur[b]; if (a) { a[0] = 0; a[1] = 0; a[2] = 0; } else cur[b] = [0, 0, 0]; }
  cur.ro = rest.ro;
  for (const ch of e.channels) cur[ch.base][ch.axis] = evaluateCurve(ch.curve, f);
  for (const x of s.inputs) {
    let v;
    if (x.curve) {
      v = evaluateCurve(x.curve, f);
      v = x.curve.type === 'TA' ? v * D2R : v;
    } else {
      // 長い鎖でもスタックがあふれないように（deep）。読む関数は入力ごとに 1 回だけ作る
      if (x.src) v = plan.ad.deep(x.read || (x.read = () => plan.ad.source(x.src)));
      else {
        const c = x.con;
        if (c.stamp !== plan.stamp) evalConstraint(plan, c, f);
        v = c.out[x.attr];
      }
    }
    if (v === undefined) continue;
    const k = ANGLE_KEYS.has(x.base) ? R2D : 1;
    if (x.axis < 0) {
      // 軸ごとに、カーブで決まる属性でないか（入力ごとに 1 回だけ調べる）
      const free = x.free || (x.free = [0, 1, 2].map((a) => !s.fromCurve.has(x.base + XYZ[a])));
      if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (free[a]) cur[x.base][a] = v[a] * k;
    } else if (typeof v === 'number') cur[x.base][x.axis] = v * k;
  }
  clampLimits(cur);
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
  return chanTObj(plan, ni, f).t;
}

/** RigEvaluator の chan(ni, 't') と同じ値（移動のカーブと移動の入力だけ。ほかはレストの値） */
function chanTObj(plan, ni, f) {
  const s = plan.steps.get(ni);
  if (s.kind === DELEGATED) return plan.rig.chan(ni, 't');
  const rest = s.rest;
  const out = { ...rest };
  for (const k of VEC_KEYS) if (rest[k]) out[k] = rest[k].slice();
  for (const ch of s.e.channels) if (ch.base === 't') out.t[ch.axis] = evaluateCurve(ch.curve, f);
  for (const x of s.inputs) {
    if (x.base !== 't') continue;
    let v;
    if (x.curve) { v = evaluateCurve(x.curve, f); v = x.curve.type === 'TA' ? v * D2R : v; }
    else if (x.src) v = plan.ad.deep(() => plan.ad.source(x.src));
    else { if (x.con.stamp !== plan.stamp) evalConstraint(plan, x.con, f); v = x.con.out[x.attr]; }
    if (v === undefined) continue;
    if (!out.t) out.t = [0, 0, 0];
    if (x.axis < 0) { if (Array.isArray(v)) for (let a = 0; a < 3; a++) if (!s.fromCurve.has('t' + XYZ[a])) out.t[a] = v[a]; }
    else if (typeof v === 'number') out.t[x.axis] = v;
  }
  return clampLimits(out);
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
  plan.f = f;
  const rig = plan.rig;
  const cache = rig.cache;
  // 評価のプロファイラの記録中だけ、手順ごとの時間を渡す（profile.step(手順, ms)。手順の中で初めて読んだ
  // コンストレイント・計算ノード・IK の計算は、その手順の時間に入る）
  const prof = plan.profile || null;
  let t0 = prof ? performance.now() : 0;
  useOrder(rig.deepState, 'plan');                 // 専用の評価で覚えた順番（汎用の経路の順番は使わない。二重に求めないように）
  if (plan.ad) rig.prewarmDeep(plan.ad);           // 鎖が長くてスタックがあふれた所は、深い所から先に求める
  for (const s of plan.order) {
    const ni = s.ni;
    if (s.kind === STATIC) {
      s.world.multiplyMatrices(parentWorld(plan, ni), rig.staticLocal(ni));
    } else if (s.kind === DELEGATED) {
      s.local = rig.deep(() => rig.localFile(ni));  // RigEvaluator が計算する（専用に計算した値はキャッシュから読む）
      s.world.multiplyMatrices(parentWorld(plan, ni), s.local);
    } else {
      evalChannels(plan, s, f);
      s.world.multiplyMatrices(parentWorld(plan, ni), s.local);
      s.done = plan.stamp;
      // RigEvaluator が読む値を、そのフレームのキャッシュに入れる（chan の 'full'・'fk'。IK がないので同じ値。
      // 't' は回転を求めない別の値なので入れない）
      if (plan.share) {
        cache.local.set(ni, s.local);
        cache.chan.set(ni * 3, s.cur);
        cache.chan.set(ni * 3 + 1, s.ik ? fkOf(plan, s) : s.cur);
      }
    }
    if (plan.share) cache.world.set(ni, s.world);
    if (prof) { const t1 = performance.now(); prof.step(plan, s, t1 - t0); t0 = t1; }
  }
  for (const s of plan.moving) {
    const m = target.get(s.ni) || new Matrix4();
    target.set(s.ni, m.copy(s.local));
  }
  return target;
}

/**
 * 評価のプロファイラの分類: 計画の手順が何で動くか。{ path: 'compiled'（専用の評価）| 'generic'（汎用の経路に任せた）,
 * label: 種類, why: 任せた理由（任せたときだけ） }
 */
export function stepCategory(plan, s) {
  if (s.kind === STATIC) return { path: 'compiled', label: '動かないノード（親の行列を掛けるだけ）' };
  if (s.kind === DELEGATED) return { path: 'generic', label: `汎用の経路に任せたノード（${s.why || '理由不明'}）`, why: s.why || '理由不明' };
  if (s.ik) {
    const g = plan.rig.byId.get(s.ik.id);
    return { path: 'compiled', label: `IK（${(g && g.ik && g.ik.solver) || 'IK'}）で動くジョイント` };
  }
  const types = new Set();
  for (const x of s.inputs || []) {
    if (x.con) types.add(x.con.type);
    else if (x.src) {
      const g = plan.rig.byId.get(x.src.node);
      types.add(!g ? '計算ノード' : g.dag >= 0 ? 'DAG ノードの直接の接続' : `計算ノード（${g.type}）`);
    }
  }
  if (!types.size) return { path: 'compiled', label: 'キーで動くノード' };
  return { path: 'compiled', label: `${[...types].sort().join('・')} で動くノード` };
}
