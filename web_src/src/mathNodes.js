// Maya 2024 以降の計算ノード（sum・multiply・clampRange など。Maya 2026 からの単位つきの DL 版も同じ計算）と、
// Maya 2020 以降の行列ノード（blendMatrix・aimMatrix・pickMatrix・parentMatrix）、行列の足し算（wtAddMatrix・addMatrix）、
// holdMatrix、時間の変換（unitToTimeConversion・timeToUnitConversion）、Maya 2026 から名前の変わった addDL・multDL。
// 属性の名前・既定値は Maya 2027 の技術資料（ノードの属性表）に合わせる。
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { composeMaya, decomposeMaya, mayaEuler } from './animation.js';

const XYZ = ['x', 'y', 'z'];
const XYZW = ['x', 'y', 'z', 'w'];
const ORDERS = ['xyz', 'yzx', 'zxy', 'xzy', 'yxz', 'zyx'];
const THREE_ORDER = ORDERS.map((o) => o.split('').reverse().join('').toUpperCase());

/** 型名 → 計算の種類（DL 版は単位が距離になるだけで、同じ計算。addDL・multDL は addDoubleLinear・multDoubleLinear の新しい名前） */
export function mathKind(type) {
  if (type === 'addDL') return 'addDoubleLinear';
  if (type === 'multDL') return 'multDoubleLinear';
  if (type === 'pointMatrixMultDL') return 'pointMatrixMult';
  const base = type.endsWith('DL') ? type.slice(0, -2) : type;
  return KINDS.has(base) ? base : null;
}

const SCALAR = ['absolute', 'acos', 'asin', 'atan', 'atan2', 'and', 'or', 'not', 'average', 'ceil', 'floor', 'round', 'truncate',
  'clampRange', 'cos', 'sin', 'tan', 'divide', 'equal', 'greaterThan', 'lessThan', 'inverseLerp', 'lerp', 'log', 'max', 'min',
  'modulo', 'multiply', 'negate', 'power', 'smoothStep', 'subtract', 'sum', 'pi', 'determinant', 'dotProduct', 'length'];
const VECTOR = ['crossProduct', 'normalize', 'rotateVector', 'multiplyPointByMatrix', 'multiplyVectorByMatrix', 'axisFromMatrix',
  'translationFromMatrix', 'rotationFromMatrix', 'scaleFromMatrix', 'pointMatrixMult'];
const VECTOR4 = ['rowFromMatrix', 'columnFromMatrix'];
const MATRIX = ['blendMatrix', 'aimMatrix', 'pickMatrix', 'parentMatrix', 'wtAddMatrix', 'addMatrix', 'holdMatrix'];
const OTHER = ['angleBetween', 'unitToTimeConversion', 'timeToUnitConversion'];
const KINDS = new Set([...SCALAR, ...VECTOR, ...VECTOR4, ...MATRIX, ...OTHER]);

// Maya 2026 からの単位つきの版（Maya 2027 の技術資料にあるもの）。distanceBetweenDL は rig.js で distanceBetween と同じに扱う
const DL_TYPES = [
  'absoluteDL', 'acosDL', 'angleBetweenDL', 'asinDL', 'atan2DL', 'atanDL', 'averageDL', 'axisFromMatrixDL', 'ceilDL',
  'clampRangeDL', 'columnFromMatrixDL', 'cosDL', 'crossProductDL', 'determinantDL', 'divideDL', 'dotProductDL',
  'equalDL', 'floorDL', 'greaterThanDL', 'inverseLerpDL', 'lengthDL', 'lerpDL', 'lessThanDL', 'logDL', 'maxDL',
  'minDL', 'moduloDL', 'multiplyDL', 'multiplyPointByMatrixDL', 'multiplyVectorByMatrixDL', 'negateDL',
  'normalizeDL', 'pointMatrixMultDL', 'powerDL', 'rotateVectorDL', 'roundDL', 'rowFromMatrixDL', 'scaleFromMatrixDL',
  'sinDL', 'smoothStepDL', 'subtractDL', 'sumDL', 'tanDL', 'translationFromMatrixDL', 'truncateDL',
];
/** 対応する型の名前（Python の rig.py の MATH_TYPES と同じにする） */
export const MATH_TYPES = [...KINDS, ...DL_TYPES, 'addDL', 'multDL'];

/** 出力の属性の名前（これ以外の名前で計算結果を探さない） */
export function mathOutputs(kind) {
  if (SCALAR.includes(kind) || kind === 'unitToTimeConversion' || kind === 'timeToUnitConversion') return /^(o|output)$/;
  if (VECTOR.includes(kind)) return /^(o|output)[xyz]?$/;
  if (VECTOR4.includes(kind)) return /^(o|output)[xyzw]?$/;
  if (kind === 'angleBetween') return /^(a|angle|ax[xyz]?|axis[XYZ]?|eu[xyz]?|euler[XYZ]?)$/;
  if (kind === 'blendMatrix' || kind === 'parentMatrix') return /^(omat|outputMatrix)$/;
  if (kind === 'aimMatrix' || kind === 'pickMatrix') return /^(tmat|outputMatrix)$/;
  if (kind === 'wtAddMatrix' || kind === 'addMatrix') return /^(o|matrixSum)$/;
  if (kind === 'holdMatrix') return /^(o|outMatrix)$/;
  if (kind === 'addDoubleLinear' || kind === 'multDoubleLinear') return /^o$/;
  return null;
}

/** ファイルの値が角度（.ma は度）の入力 */
export function mathAngleInput(kind, attr) {
  if (kind === 'cos' || kind === 'sin' || kind === 'tan') return attr === 'i';
  if (kind === 'rotateVector') return /^r[xyz]?$/.test(attr);
  return false;
}

/** 既定値（Maya の技術資料。0 と単位行列以外） */
export const MATH_DEFAULTS = {
  angleBetween: { v1: [0, 1, 0], v2: [0, 0, 1] },
  divide: { i2: 1 }, clampRange: { max: 1 }, log: { e: 2 }, power: { e: 2 }, modulo: { m: 1 }, smoothStep: { re: 1 },
  unitToTimeConversion: { cf: 1 }, timeToUnitConversion: { cf: 1 },
};

const v3 = (a) => new Vector3(a[0], a[1], a[2]);

/**
 * 計算する。ev は評価器（num・vec・mat・plug・indices・attrName と、ノード g）
 * @returns 出力の属性 → 値（数・配列・Matrix4）。計算できなければ null
 */
export function evaluateMath(ev, g, kind) {
  const id = g.id;
  const num = (a, d = 0) => ev.num(id, a, d);
  const vec = (a, d = [0, 0, 0]) => ev.vec(id, a, d);
  const list = (base) => ev.indices(g, new RegExp(`^${base}\\[(\\d+)\\]$`)).map((k) => num(`${base}[${k}]`, 0));
  const vec3out = (v) => ({ ...expand('o', v.toArray(), XYZ) });
  const point = () => {                                          // multiplyPointByMatrix の入力（成分の短い名前は x・y・z）
    const w = vec('i');
    const has = (k) => (g.inputs && g.inputs[k]) || (g.attrs && k in g.attrs);
    return v3(XYZ.map((c, i) => (has(c) ? num(c, 0) : w[i])));
  };
  switch (kind) {
    case 'addDoubleLinear': return { o: num('i1') + num('i2') };
    case 'multDoubleLinear': return { o: num('i1') * num('i2') };
    case 'absolute': return { o: Math.abs(num('i')) };
    case 'negate': return { o: -num('i') };
    case 'acos': return { o: Math.acos(Math.min(1, Math.max(-1, num('i')))) };
    case 'asin': return { o: Math.asin(Math.min(1, Math.max(-1, num('i')))) };
    case 'atan': return { o: Math.atan(num('i')) };
    case 'atan2': return { o: Math.atan2(num('i2'), num('i1')) };      // 入力 1 が x、入力 2 が y
    case 'cos': return { o: Math.cos(num('i')) };
    case 'sin': return { o: Math.sin(num('i')) };
    case 'tan': return { o: Math.tan(num('i')) };
    case 'pi': return { o: Math.PI };
    case 'and': return { o: num('i1') >= 0.5 && num('i2') >= 0.5 ? 1 : 0 };
    case 'or': return { o: num('i1') >= 0.5 || num('i2') >= 0.5 ? 1 : 0 };
    case 'not': return { o: num('i') >= 0.5 ? 0 : 1 };
    case 'equal': return { o: Math.abs(num('i1') - num('i2')) <= num('e', 0) ? 1 : 0 };
    case 'greaterThan': return { o: num('i1') > num('i2') ? 1 : 0 };
    case 'lessThan': return { o: num('i1') < num('i2') ? 1 : 0 };
    case 'ceil': return { o: Math.ceil(num('i')) };
    case 'floor': return { o: Math.floor(num('i')) };
    case 'round': return { o: Math.floor(num('i') + 0.5) };            // 0.5 は 1 に（資料）
    case 'truncate': return { o: Math.trunc(num('i')) };
    case 'clampRange': return { o: Math.min(Math.max(num('i'), num('min', 0)), num('max', 1)) };
    case 'divide': { const b = num('i2', 1); return { o: b === 0 ? 0 : num('i1') / b }; }   // Maya は 0 で割るとエラー
    case 'subtract': return { o: num('i1') - num('i2') };
    case 'sum': return { o: list('i').reduce((a, b) => a + b, 0) };
    case 'multiply': { const l = list('i'); return { o: l.length ? l.reduce((a, b) => a * b, 1) : 0 }; }
    case 'average': { const l = list('i'); return { o: l.length ? l.reduce((a, b) => a + b, 0) / l.length : 0 }; }
    case 'max': { const l = list('i'); return { o: l.length ? Math.max(...l) : 0 }; }
    case 'min': { const l = list('i'); return { o: l.length ? Math.min(...l) : 0 }; }
    // lerp・inverseLerp: 資料の式（o = w·i1 + (1 − w)·i2）と inverseLerp の式（w = −i1 / (i2 − i1)）が食い違うので、
    // 一般的な定義（w = 0 で入力 1、1 で入力 2）にする
    case 'lerp': { const a = num('i1'), b = num('i2'); return { o: a + (b - a) * num('w', 0) }; }
    case 'inverseLerp': { const a = num('i1'), b = num('i2'); return { o: b === a ? 0 : (num('i') - a) / (b - a) }; }
    case 'log': { const b = num('e', 2), x = num('i'); return { o: b > 0 && b !== 1 && x > 0 ? Math.log(x) / Math.log(b) : 0 }; }
    case 'power': return { o: Math.pow(num('i'), num('e', 2)) };
    case 'modulo': { const m = num('m', 1), x = num('i'); return { o: m === 0 ? x : ((x % m) + m) % m }; }
    case 'smoothStep': {
      const le = num('le', 0), re = num('re', 1);
      const t = re === le ? (num('i') >= re ? 1 : 0) : Math.min(1, Math.max(0, (num('i') - le) / (re - le)));
      return { o: t * t * (3 - 2 * t) };
    }
    case 'dotProduct': return { o: v3(vec('i1')).dot(v3(vec('i2'))) };
    case 'length': return { o: v3(vec('i')).length() };
    case 'determinant': return { o: ev.mat(id, 'i').determinant() };
    case 'crossProduct': return vec3out(v3(vec('i1')).cross(v3(vec('i2'))));
    case 'normalize': { const v = v3(vec('i')); return vec3out(v.lengthSq() > 0 ? v.normalize() : v); }
    case 'rotateVector': {
      const r = vec('r');
      const q = new Quaternion().setFromEuler(new Euler(r[0], r[1], r[2], THREE_ORDER[Math.round(num('ro', 0))] || 'ZYX'));
      return vec3out(v3(vec('i')).applyQuaternion(q));
    }
    case 'multiplyPointByMatrix': return vec3out(point().applyMatrix4(ev.mat(id, 'm')));
    case 'multiplyVectorByMatrix': return vec3out(transformVector(point(), ev.mat(id, 'm')));
    case 'pointMatrixMult': {                                     // 昔からのノードと DL 版（inPoint・inMatrix・vectorMultiply）
      const p = v3(vec('ip')), m = ev.mat(id, 'im');
      return vec3out(num('vm', 0) >= 0.5 ? transformVector(p, m) : p.applyMatrix4(m));
    }
    case 'axisFromMatrix': {                                      // Maya の行（X・Y・Z の軸）。正規化しない
      const e = ev.mat(id, 'i').elements, k = Math.min(2, Math.max(0, Math.round(num('op', 0)))) * 4;
      return vec3out(new Vector3(e[k], e[k + 1], e[k + 2]));
    }
    case 'rowFromMatrix': case 'columnFromMatrix': {
      const e = ev.mat(id, 'm').elements, k = Math.min(3, Math.max(0, Math.round(num('i', 0))));
      const v = kind === 'rowFromMatrix' ? [e[k * 4], e[k * 4 + 1], e[k * 4 + 2], e[k * 4 + 3]] : [e[k], e[4 + k], e[8 + k], e[12 + k]];
      return expand('o', v, XYZW);
    }
    case 'translationFromMatrix': return vec3out(new Vector3().setFromMatrixPosition(ev.mat(id, 'i')));
    case 'scaleFromMatrix': return vec3out(decomposeMaya(ev.mat(id, 'i')).s);
    case 'rotationFromMatrix': {
      return vec3out(new Vector3(...mayaEuler(decomposeMaya(ev.mat(id, 'i')).q, 0)));
    }
    case 'angleBetween': {
      const a = v3(vec('v1', [0, 1, 0])), b = v3(vec('v2', [0, 0, 1]));
      if (a.lengthSq() === 0 || b.lengthSq() === 0) return { a: 0, ...expand('ax', [0, 0, 1], XYZ), ...expand('eu', [0, 0, 0], XYZ) };
      a.normalize(); b.normalize();
      const q = new Quaternion().setFromUnitVectors(a, b);
      const angle = Math.acos(Math.min(1, Math.max(-1, a.dot(b))));
      const axis = new Vector3().crossVectors(a, b);
      if (axis.lengthSq() < 1e-24) axis.set(0, 0, 1); else axis.normalize();
      return { a: angle, angle, ...expand('ax', axis.toArray(), XYZ), ...expand('eu', mayaEuler(q, 0), XYZ) };
    }
    // 時間の変換: ビューアの時間はフレーム（シーンのフレームレートの単位）として扱う
    case 'unitToTimeConversion': case 'timeToUnitConversion': return { o: num('i') * num('cf', 1) };
    case 'wtAddMatrix': {
      const out = new Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      for (const k of ev.indices(g, /^i\[(\d+)\]/)) addScaled(out, ev.mat(id, `i[${k}].m`), num(`i[${k}].w`, 0));
      return { o: out, matrixSum: out };
    }
    case 'addMatrix': {
      const out = new Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      for (const k of ev.indices(g, /^i\[(\d+)\]$/)) addScaled(out, ev.mat(id, `i[${k}]`), 1);
      return { o: out, matrixSum: out };
    }
    // holdMatrix: 入力の行列をそのまま出す（入力がなければファイルに残った値）
    case 'holdMatrix': {
      const has = (g.inputs && g.inputs.i) || (g.attrs && 'i' in g.attrs);
      const file = g.attrs && Array.isArray(g.attrs.o) && g.attrs.o.length === 16 ? new Matrix4().fromArray(g.attrs.o) : new Matrix4();
      const m = has ? ev.mat(id, 'i') : file;               // 出力の名前（o）で読むと自分の計算に戻るので、ファイルの値を直接読む
      return { o: m, outMatrix: m };
    }
    case 'pickMatrix': {
      const d = decomposeMaya(ev.mat(id, 'imat'));
      const use = (a) => num(a, 1) >= 0.5;
      const m = composeMaya(use('tra') ? d.t.toArray() : [0, 0, 0], use('rot') ? d.q : new Quaternion(),
        use('sca') ? d.s.toArray() : [1, 1, 1], use('she') ? d.sh.toArray() : [0, 0, 0]);
      return { tmat: m, outputMatrix: m };
    }
    case 'blendMatrix': return blendMatrix(ev, g);
    case 'parentMatrix': return parentMatrix(ev, g);
    case 'aimMatrix': return aimMatrix(ev, g);
    default: return null;
  }
}

function expand(base, values, suffixes) {
  const o = { [base]: values.slice() };
  suffixes.forEach((s, i) => { o[base + s] = values[i]; });
  return o;
}

/** ベクトル × 行列（移動を除く。Maya の行ベクトル v · M） */
function transformVector(v, m) {
  const e = m.elements;
  return new Vector3(v.x * e[0] + v.y * e[4] + v.z * e[8], v.x * e[1] + v.y * e[5] + v.z * e[9], v.x * e[2] + v.y * e[6] + v.z * e[10]);
}

function addScaled(out, m, w) {
  for (let i = 0; i < 16; i++) out.elements[i] += m.elements[i] * w;
}

/** Maya の行列の積 a · b（行ベクトル）は three.js では b · a */
const mul = (a, b) => b.clone().multiply(a);

/** 2 つの分解（移動・回転・スケール・せん断）を、成分ごとの割合で混ぜる */
function mixParts(a, b, w) {
  return {
    t: a.t.clone().lerp(b.t, w.t), q: a.q.clone().slerp(b.q, w.r),
    s: a.s.clone().lerp(b.s, w.s), sh: a.sh.clone().lerp(b.sh, w.sh),
  };
}
const composeParts = (p) => composeMaya(p.t.toArray(), p.q, p.s.toArray(), p.sh.toArray());

/** pre / post の空間（資料の文言どおり、入力の行列に preSpaceMatrix を掛け、結果に postSpaceMatrix を掛ける。推定） */
function spaces(ev, id) {
  const pre = ev.mat(id, 'premat'), post = ev.mat(id, 'pstmat');
  return { into: (m) => mul(m, pre), out: (m) => mul(m, post) };
}

/**
 * blendMatrix: 入力の行列（imat）を、ターゲット（tgt[i].tmat）へ順に混ぜる（前の結果を次のターゲットと混ぜる）。
 * 割合はウェイト（wgt）× エンベロープ（env）× 成分ごとのウェイト（移動 tra・回転 rot・スケール sca・せん断 she）
 */
function blendMatrix(ev, g) {
  const id = g.id;
  const num = (a, d) => ev.num(id, a, d);
  const sp = spaces(ev, id);
  const input = ev.mat(id, 'imat');
  if (num('enb', 1) < 0.5) return { omat: input.clone(), outputMatrix: input.clone() };
  const env = num('env', 1);
  let cur = decomposeMaya(sp.into(input));
  for (const k of ev.indices(g, /^tgt\[(\d+)\]/)) {
    const b = `tgt[${k}]`;
    if (num(`${b}.umt`, 1) < 0.5) continue;
    const w = num(`${b}.wgt`, 1) * env;
    const tgt = decomposeMaya(sp.into(ev.mat(id, `${b}.tmat`)));
    cur = mixParts(cur, tgt, { t: w * num(`${b}.tra`, 1), r: w * num(`${b}.rot`, 1), s: w * num(`${b}.sca`, 1), sh: w * num(`${b}.she`, 1) });
  }
  const m = sp.out(composeParts(cur));
  return { omat: m, outputMatrix: m };
}

/**
 * parentMatrix: ターゲットごとに offsetMatrix · targetMatrix（ターゲットを親としたときの行列）を求め、
 * ウェイトで正規化して混ぜる（移動・スケール・せん断は加重平均、回転は四元数の加重平均）。エンベロープで入力の行列と混ぜる
 */
function parentMatrix(ev, g) {
  const id = g.id;
  const num = (a, d) => ev.num(id, a, d);
  const sp = spaces(ev, id);
  const input = ev.mat(id, 'imat');
  if (num('enb', 1) < 0.5) return { omat: input.clone(), outputMatrix: input.clone() };
  const parts = [];
  for (const k of ev.indices(g, /^tgt\[(\d+)\]/)) {
    const b = `tgt[${k}]`;
    if (num(`${b}.umt`, 1) < 0.5) continue;
    const w = num(`${b}.wgt`, 1);
    if (w <= 0) continue;
    parts.push({ w, d: decomposeMaya(mul(ev.mat(id, `${b}.ofm`), sp.into(ev.mat(id, `${b}.tmat`)))) });
  }
  const base = decomposeMaya(sp.into(input));
  let res = base;
  const total = parts.reduce((a, p) => a + p.w, 0);
  if (total > 0) {
    const t = new Vector3(), s = new Vector3(), sh = new Vector3();
    const q0 = parts[0].d.q, qs = new Quaternion(0, 0, 0, 0);
    for (const { w, d } of parts) {
      const f = w / total;
      t.addScaledVector(d.t, f); s.addScaledVector(d.s, f); sh.addScaledVector(d.sh, f);
      const sign = d.q.dot(q0) < 0 ? -f : f;                     // 同じ向きの半球にそろえて足す
      qs.set(qs.x + d.q.x * sign, qs.y + d.q.y * sign, qs.z + d.q.z * sign, qs.w + d.q.w * sign);
    }
    const blended = { t, q: qs.normalize(), s, sh };
    const env = num('env', 1);
    res = mixParts(base, blended, { t: env, r: env, s: env, sh: env });
  }
  const m = sp.out(composeParts(res));
  return { omat: m, outputMatrix: m };
}

/**
 * aimMatrix: 入力の行列の主軸（primaryInputAxis）をターゲットへ向け、副軸（secondaryInputAxis）を副ターゲットの側へ向ける。
 * モード（資料に列挙値の説明がないため Maya の UI の並びで推定）: 主軸 0 ロック・1 エイム（ターゲットの位置へ）・2 揃える（ターゲットの
 * 行列の中のベクトルの向き）、副軸 0 なし・1 エイム・2 揃える。移動・スケールは入力のまま。エンベロープで入力の回転と混ぜる
 */
function aimMatrix(ev, g) {
  const id = g.id;
  const num = (a, d) => ev.num(id, a, d);
  const vec = (a, d) => new Vector3(...ev.vec(id, a, d));
  const sp = spaces(ev, id);
  const input = ev.mat(id, 'imat');
  if (num('enb', 1) < 0.5) return { tmat: input.clone(), outputMatrix: input.clone() };
  const M = sp.into(input);
  const d = decomposeMaya(M);
  const pos = d.t;
  const dirOf = (mode, matAttr, vecAttr) => {
    const T = sp.into(ev.mat(id, matAttr));
    if (mode === 1) return new Vector3().setFromMatrixPosition(T).sub(pos);
    if (mode === 2) return transformVector(vec(vecAttr, [0, 0, 0]), T);
    return null;
  };
  const q = d.q.clone();
  const pm = Math.round(num('prmd', 1));
  const pAxisL = vec('pmi', [1, 0, 0]).normalize();
  const pDir = dirOf(pm, 'pmat', 'pmiv');
  if (pDir && pDir.lengthSq() > 1e-18 && pAxisL.lengthSq() > 0) {
    const cur = pAxisL.clone().applyQuaternion(q);
    q.premultiply(new Quaternion().setFromUnitVectors(cur, pDir.normalize()));
  }
  const sm = Math.round(num('sm', 0));
  const sAxisL = vec('smi', [0, 1, 0]);
  const sDir = dirOf(sm, 'smat', 'smiv');
  if (sDir && sAxisL.lengthSq() > 0) {
    const pAxis = pAxisL.clone().applyQuaternion(q);
    const proj = (v) => v.clone().addScaledVector(pAxis, -v.dot(pAxis));
    const a = proj(sAxisL.clone().normalize().applyQuaternion(q)), b = proj(sDir);
    if (a.lengthSq() > 1e-18 && b.lengthSq() > 1e-18) {
      a.normalize(); b.normalize();
      const ang = Math.atan2(pAxis.dot(new Vector3().crossVectors(a, b)), a.dot(b));
      q.premultiply(new Quaternion().setFromAxisAngle(pAxis, ang));
    }
  }
  const out = d.q.clone().slerp(q, num('env', 1));
  const m = sp.out(composeMaya(d.t.toArray(), out, d.s.toArray(), d.sh.toArray()));
  return { tmat: m, outputMatrix: m };
}
