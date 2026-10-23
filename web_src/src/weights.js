// スキンウェイトの展開・統計・ヒートマップ配色。
import { Color } from 'three';

export const MAX_GPU_INFLUENCES = 8;
const SUM_TOLERANCE = 1e-3;

/**
 * JSON の疎配列（counts / indices / weights）を展開する。
 *
 * 変形用に、上位 8 インフルエンスを 2 組の vec4（skinIndex / skinWeight と skinIndex1 / skinWeight1）に詰める。
 * normalize が true なら合計で割って合計 1 にする（Maya のポスト正規化と同じ）。
 * 合計が 0 の頂点は zeroVertices に入れ、ここでは割り当てない（assignWeights で割り当てる）。
 *
 * eff[k] は「変形に使う値」（正規化後）。ヒートマップ・一覧・統計はこれを使う。
 */
export function decodeSkin(skin, vertexCount, opts = {}) {
  const normalize = opts.normalize !== false;
  const counts = skin.counts;
  const offsets = new Uint32Array(vertexCount + 1);
  for (let v = 0; v < vertexCount; v++) offsets[v + 1] = offsets[v] + (counts[v] || 0);
  const slots = Uint16Array.from(skin.indices);
  const values = Float32Array.from(skin.weights);
  const eff = new Float32Array(values.length);
  const nInf = skin.influences.length;

  const skinIndex = new Uint16Array(vertexCount * 4);
  const skinWeight = new Float32Array(vertexCount * 4);
  const skinIndex1 = new Uint16Array(vertexCount * 4);
  const skinWeight1 = new Float32Array(vertexCount * 4);
  const affected = new Uint32Array(nInf);
  const zeroVertices = [];
  let over4 = 0, overMax = 0, unnormalized = 0, maxCount = 0;
  const order = [];

  for (let v = 0; v < vertexCount; v++) {
    const a = offsets[v], b = offsets[v + 1];
    const n = b - a;
    if (n > maxCount) maxCount = n;
    let sum = 0;
    for (let k = a; k < b; k++) sum += values[k];
    if (sum <= 0) { zeroVertices.push(v); continue; }
    for (let k = a; k < b; k++) if (values[k] > 0) affected[slots[k]]++;
    if (Math.abs(sum - 1) > SUM_TOLERANCE) unnormalized++;
    if (n > 4) over4++;
    if (n > MAX_GPU_INFLUENCES) overMax++;
    const f = normalize ? 1 / sum : 1;
    for (let k = a; k < b; k++) eff[k] = values[k] * f;

    order.length = 0;
    for (let k = a; k < b; k++) order.push(k);
    if (n > MAX_GPU_INFLUENCES) order.sort((x, y) => eff[y] - eff[x]);
    const m = Math.min(n, MAX_GPU_INFLUENCES);
    let kept = 0;
    for (let i = 0; i < m; i++) kept += eff[order[i]];
    // 9 つ以上は上位 8 つに絞り、合計（正規化なら 1）を保つよう配分し直す
    const total = normalize ? 1 : sum;
    const scale = n > MAX_GPU_INFLUENCES && kept > 0 ? total / kept : 1;
    for (let i = 0; i < m; i++) {
      const slot = slots[order[i]], w = eff[order[i]] * scale;
      if (i < 4) { skinIndex[v * 4 + i] = slot; skinWeight[v * 4 + i] = w; }
      else { skinIndex1[v * 4 + i - 4] = slot; skinWeight1[v * 4 + i - 4] = w; }
    }
  }
  return {
    offsets, slots, values, eff, normalize, skinIndex, skinWeight, skinIndex1, skinWeight1,
    zeroVertices, override: new Map(),
    stats: { influenceCount: nInf, over4, overMax, unnormalized, zero: zeroVertices.length, maxCount, affected },
  };
}

/**
 * 頂点 v のウェイトを割り当てる（合計が 0 の頂点用）。list = [{ slot, w }]（合計 1）。
 * 一覧・ヒートマップ・変形のすべてにこの値を使う。
 */
export function assignWeights(decoded, v, list) {
  const sorted = list.filter((x) => x.w > 0).sort((a, b) => b.w - a.w).slice(0, MAX_GPU_INFLUENCES);
  const s = sorted.reduce((t, x) => t + x.w, 0) || 1;
  decoded.override.set(v, sorted.map((x) => ({ slot: x.slot, w: x.w / s })));
  for (let i = 0; i < 4; i++) {
    decoded.skinIndex[v * 4 + i] = 0; decoded.skinWeight[v * 4 + i] = 0;
    decoded.skinIndex1[v * 4 + i] = 0; decoded.skinWeight1[v * 4 + i] = 0;
  }
  sorted.forEach((x, i) => {
    if (i < 4) { decoded.skinIndex[v * 4 + i] = x.slot; decoded.skinWeight[v * 4 + i] = x.w / s; }
    else { decoded.skinIndex1[v * 4 + i - 4] = x.slot; decoded.skinWeight1[v * 4 + i - 4] = x.w / s; }
    decoded.stats.affected[x.slot]++;
  });
}

/** 記録されているジョイント（合計 0 の頂点では値 0 のもの） */
export function listedSlots(decoded, v) {
  const out = [];
  for (let k = decoded.offsets[v]; k < decoded.offsets[v + 1]; k++) out.push(decoded.slots[k]);
  return out;
}

/** 頂点 v の [{ slot, weight（保存値）, effective（変形に使う値）, assigned（割り当てたもの） }]（変形に使う値の大きい順） */
export function vertexWeights(decoded, v) {
  const out = [];
  const ov = decoded.override.get(v);
  if (ov) {
    const raw = new Map();
    for (let k = decoded.offsets[v]; k < decoded.offsets[v + 1]; k++) raw.set(decoded.slots[k], decoded.values[k]);
    for (const x of ov) out.push({ slot: x.slot, weight: raw.get(x.slot) || 0, effective: x.w, assigned: true });
    for (const [slot, w] of raw) if (!ov.some((x) => x.slot === slot)) out.push({ slot, weight: w, effective: 0, assigned: true });
  } else {
    for (let k = decoded.offsets[v]; k < decoded.offsets[v + 1]; k++) {
      out.push({ slot: decoded.slots[k], weight: decoded.values[k], effective: decoded.eff[k] });
    }
  }
  out.sort((a, b) => b.effective - a.effective);
  return out;
}

/** 頂点 v のスロット slot の、変形に使う値 */
export function effectiveWeight(decoded, v, slot) {
  const ov = decoded.override.get(v);
  if (ov) { const x = ov.find((e) => e.slot === slot); return x ? x.w : 0; }
  for (let k = decoded.offsets[v]; k < decoded.offsets[v + 1]; k++) if (decoded.slots[k] === slot) return decoded.eff[k];
  return 0;
}

/** スロット slot の頂点ごとの値（変形に使う値） */
export function weightsForSlot(decoded, slot, vertexCount) {
  const out = new Float32Array(vertexCount);
  if (slot < 0) return out;
  for (let v = 0; v < vertexCount; v++) out[v] = effectiveWeight(decoded, v, slot);
  return out;
}

const _c = new Color();

/** 0 → 青、0.5 → 緑、1 → 赤。0 ちょうどは暗い灰色。 */
export function heatColor(w, target) {
  if (!(w > 1e-6)) return target.setRGB(0.11, 0.12, 0.16);
  const x = Math.min(1, Math.max(0, w));
  return target.setHSL((1 - x) * 0.6667, 0.95, 0.5);
}

/** ジョイント番号ごとの識別色（黄金角で色相を散らす） */
export function jointColor(nodeIndex, target) {
  const h = (nodeIndex * 0.6180339887) % 1;
  return target.setHSL(h, 0.7, 0.55);
}

/** 選択ジョイントのヒートマップを color 属性に書き込む */
export function fillHeatmap(colorArray, decoded, slot, vertexCount) {
  for (let v = 0; v < vertexCount; v++) {
    heatColor(slot >= 0 ? effectiveWeight(decoded, v, slot) : 0, _c);
    colorArray[v * 3] = _c.r; colorArray[v * 3 + 1] = _c.g; colorArray[v * 3 + 2] = _c.b;
  }
}

/** 全インフルエンスを識別色でブレンドして color 属性に書き込む */
export function fillInfluenceBlend(colorArray, decoded, influences, vertexCount) {
  const palette = influences.map((ni) => jointColor(ni, new Color()));
  for (let v = 0; v < vertexCount; v++) {
    let r = 0, g = 0, b = 0, s = 0;
    const add = (slot, w) => { const c = palette[slot]; r += c.r * w; g += c.g * w; b += c.b * w; s += w; };
    const ov = decoded.override.get(v);
    if (ov) for (const x of ov) add(x.slot, x.w);
    else for (let k = decoded.offsets[v]; k < decoded.offsets[v + 1]; k++) add(decoded.slots[k], decoded.eff[k]);
    if (s <= 0) { r = 0.11; g = 0.12; b = 0.16; } else { r /= s; g /= s; b /= s; }
    colorArray[v * 3] = r; colorArray[v * 3 + 1] = g; colorArray[v * 3 + 2] = b;
  }
}

export function fillSolid(colorArray, r, g, b) {
  for (let i = 0; i < colorArray.length; i += 3) {
    colorArray[i] = r; colorArray[i + 1] = g; colorArray[i + 2] = b;
  }
}
