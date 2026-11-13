// RigEvaluator のプラグ（属性の値の求め方・接続元の値・時間で変わらない値の記録）。rig.js から分けたもの（整備計画の D5）。
// メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Matrix4, Vector3 } from 'three';
import { evaluateCurve } from './animation.js';
import {
  componentOf, componentsOf, D2R, defaultsOf, INDICES, isAngleAttr, NOTHING, outputBaseOf, PLAN,
} from './rig.js';

export class PlugMethods {
  /**
   * 移動・回転・スケール以外で接続で決まる属性（animation.props: 表示・カメラの焦点距離など）の、
   * 現在のフレームの値。evaluate() のあとに呼ぶ。[{ kind, index, values: { 属性: 数値 }, static }]
   * （place2d の of・re は [u, v]）
   */
  evaluateProps() {
    if (this.current && this.current.props) return this.current.props;
    const out = [];
    for (const p of this.props) {
      const values = {};
      for (const [attr, src] of Object.entries(p.inputs || {})) {
        const v = this.deep(() => this.guard(`prop ${p.kind}${p.index}.${attr}`, () => this.source(src), () => undefined));
        if (p.kind === 'place2d' && (attr === 'of' || attr === 're') && Array.isArray(v)) {   // 2 つ組（u, v）
          if (v.length >= 2 && Number.isFinite(v[0]) && Number.isFinite(v[1])) values[attr] = [v[0], v[1]];
          continue;
        }
        const x = Array.isArray(v) ? v[0] : v;
        if (typeof x === 'number' && Number.isFinite(x)) values[attr] = x;
      }
      out.push({ kind: p.kind, index: p.index, values, static: p.static || null });
    }
    if (this.current) {
      this.current.props = out;
      this.addSnapshotBytes(this.current, out.reduce((n, p) => n + 64 + Object.keys(p.values).length * 48, 64));
    }
    return out;
  }

  /** リグで形が変わるカーブ（nurbsCurve のシェイプ）のグラフの id */
  curveIds() {
    if (!this.curveIdList) this.curveIdList = this.graph.filter((g) => g.type === 'nurbsCurve' && g.shape >= 0).map((g) => g.id);
    return this.curveIdList;
  }

  /** いまのフレームのカーブの形（plug(gid, 'local')。再生キャッシュにあればそれを使う） */
  curveShape(gid) {
    const c = this.current;
    if (c && c.curves.has(gid)) return c.curves.get(gid);
    const v = this.deep(() => this.plug(gid, 'local'));
    if (c) {
      c.curves.set(gid, v);
      if (v && v.isCurve && !this.countedCurves.has(v)) {   // CV（Vector3）1 個あたり約 64 バイト
        this.countedCurves.add(v);
        this.addSnapshotBytes(c, 160 + v.cvs.length * 64);
      }
    }
    return v;
  }

  /** 接続元の値 */
  source(src) {
    if (src.curve !== undefined) {
      const c = this.clip.curves[src.curve];
      if (!c) return undefined;
      const v = evaluateCurve(c, this.frame);
      this.varying = true;
      return c.type === 'TA' ? v * D2R : v;
    }
    const g = this.byId.get(src.node);
    if (!g) return undefined;
    return g.dag >= 0 ? this.dagPlug(g.dag, src.attr) : this.plug(src.node, src.attr);
  }

  /** グラフのノードの属性の値（接続 → 計算結果 → ファイルの値 → 既定値） */
  plug(id, attr) {
    let fm = this.cache.plug.get(id);
    if (!fm) { this.cache.plug.set(id, fm = new Map()); fm.ownerId = id; }   // ownerId: やり直しの印（memo）
    let km = this.keep.plug.get(id);
    if (!km) this.keep.plug.set(id, km = new Map());
    return this.memo(fm, km, attr, () => this.plugUncached(id, attr), NOTHING, () => `plug ${id}.${attr}`);
  }

  plugUncached(id, attr) {
    const g = this.byId.get(id);
    return this.plugWithPlan(g, attr, this.plugPlan(g, attr));
  }

  /** 求め方（plugPlan）がわかっている属性の値（専用の評価の読み手は、求め方を覚えておいて直接呼ぶ） */
  plugWithPlan(g, attr, plan) {
    const id = g.id;
    switch (plan.kind) {
      case PLAN.def: return this.defPlug(g, attr);
      case PLAN.input: return this.source(plan.src);
      case PLAN.component: {                               // 成分（ox）: 3 つ組（o）が接続されている
        const v = this.source(plan.src);
        return Array.isArray(v) ? v[plan.index] : undefined;
      }
      case PLAN.output: {                                  // 計算結果
        const outs = this.outputs(id);
        if (!outs) return undefined;
        return attr in outs ? outs[attr] : outs[plan.base];                           // ws[0] → ws
      }
      case PLAN.triple: {                                  // 3 つ組: 成分ごとに接続・値がある
        const def = plan.def;
        return plan.names.map((name, k) => {
          const v = this.plug(id, name);
          return v !== undefined ? v : (Array.isArray(def) ? def[k] : 0);
        });
      }
      default: return this.staticValue(g, attr);
    }
  }

  /**
   * 属性の値の求め方（接続 → 成分の接続 → 計算結果 → 成分ごとの接続 → ファイルの値）。グラフの形だけで決まるので、
   * 属性ごとに最初の 1 回だけ調べて覚えておく
   */
  plugPlan(g, attr) {
    let plans = this.plans.get(g.id);
    if (!plans) this.plans.set(g.id, plans = new Map());
    let plan = plans.get(attr);
    if (plan) return plan;
    const inputs = g.inputs || {};
    if (g.def) {                                           // 自作ノード（成分などは定義が扱う）
      plan = { kind: PLAN.def };
      plans.set(attr, plan);
      return plan;
    }
    const comp = componentOf(g.type, attr);                // 成分（ox → o の 0 番目）
    const names = componentsOf(g.type, attr);              // まとめた属性の成分（o → ox・oy・oz）
    const outBase = outputBaseOf(g.type, attr);
    if (inputs[attr]) plan = { kind: PLAN.input, src: inputs[attr] };
    else if (comp && inputs[comp[0]]) plan = { kind: PLAN.component, src: inputs[comp[0]], index: comp[1] };
    else if (outBase !== null) plan = { kind: PLAN.output, base: outBase };
    else if (names.some((x) => inputs[x])) plan = { kind: PLAN.triple, names, def: this.staticValue(g, attr) };
    else plan = { kind: PLAN.static };
    plans.set(attr, plan);
    return plan;
  }

  /** ファイルの値（なければ型ごとの既定値）。角度はラジアンにする */
  staticValue(g, attr) {
    const attrs = g.attrs || {};
    const k = isAngleAttr(g.type, attr) ? D2R : 1;
    const scale = (v) => (Array.isArray(v) ? v.map((x) => x * k) : v * k);
    if (attr in attrs) return scale(attrs[attr]);
    const comp = componentOf(g.type, attr);
    if (comp && Array.isArray(attrs[comp[0]])) return attrs[comp[0]][comp[1]] * (isAngleAttr(g.type, comp[0]) ? D2R : 1);
    const names = componentsOf(g.type, attr);
    if (names.some((x) => x in attrs)) {
      const def = this.defaultValue(g.type, attr);
      return names.map((x, i) => (x in attrs ? attrs[x] : (Array.isArray(def) ? def[i] : 0)) * k);
    }
    return this.defaultValue(g.type, attr, k);
  }

  defaultValue(type, attr, k = 1) {
    if (/^w\d+$/.test(attr) || /\.tw$/.test(attr)) return 1;            // コンストレイントのウェイト
    const table = defaultsOf(type);
    const d = table ? table[attr] : undefined;
    if (d !== undefined) return Array.isArray(d) ? d.map((x) => x * k) : d * k;
    const comp = componentOf(type, attr);
    if (comp && table && Array.isArray(table[comp[0]])) return table[comp[0]][comp[1]] * k;
    return undefined;
  }

  /** 行列の属性（Matrix4。ファイルの値は 16 要素の配列。なければ単位行列） */
  mat(id, attr) {
    const v = this.plug(id, attr);
    if (v && v.isMatrix4) return v;
    if (Array.isArray(v) && v.length === 16) return new Matrix4().fromArray(v);
    return new Matrix4();
  }

  /** 配列の属性の添字（接続とファイルの値の両方から）。グラフの形だけで決まるので、ノードと re ごとに 1 回だけ求めて覚える */
  indices(g, re) {
    let byRe = INDICES.get(g);
    if (!byRe) INDICES.set(g, byRe = new Map());
    let out = byRe.get(re.source);
    if (!out) {
      const keys = [...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})];
      out = [...new Set(keys.map((k) => re.exec(k)).filter(Boolean).map((m) => +m[1]))].sort((a, b) => a - b);
      byRe.set(re.source, out);
    }
    return out;
  }

  /** 属性の名前の候補（短い名前・長い名前）のうち、接続か値があるもの（なければ最初の名前） */
  attrName(g, names) {
    return names.find((k) => (g.inputs && g.inputs[k]) || (g.attrs && k in g.attrs)) || names[0];
  }

  num(id, attr, def = 0) {
    const v = this.plug(id, attr);
    return typeof v === 'number' && Number.isFinite(v) ? v : def;
  }

  vec(id, base, def = [0, 0, 0]) {
    const v = this.plug(id, base);
    if (Array.isArray(v)) return def.map((d, i) => (Number.isFinite(v[i]) ? v[i] : d));
    return def.slice();
  }
}
