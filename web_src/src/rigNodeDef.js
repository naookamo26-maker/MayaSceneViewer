// RigEvaluator の自作ノードの定義（nodeDef.js で JavaScript にした計算の実行・入力の読み方）。rig.js から分けたもの（整備計画の D5）。
// メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Matrix4 } from 'three';
import { mayOverflow } from './deepEval.js';
import { componentPlug } from './nodeDef.js';
import { D2R } from './rig.js';

export class NodeDefMethods {
  /** 定義で評価するノードの属性の値（出力は計算結果、入力は接続 → ファイルの値 → 既定値） */
  defPlug(g, attr) {
    const d = this.defs.get(g.def);
    if (!d) return undefined;
    if (d.isOutput(attr)) {
      const outs = this.outputs(g.id);
      return outs ? outs[attr] : undefined;
    }
    return this.defRead(g, attr, d.infoOf(attr));
  }

  defOutputs(g) {
    const d = this.defs.get(g.def);
    if (!d) {
      this.problems.add(`${g.name}: 自作ノードの定義 ${g.def} を読めません`);
      return null;
    }
    this.varying = true;                           // 定義の計算はいまのフレームを読める
    const prof = this.profile;
    if (prof && prof.defNode) return this.defOutputsProfiled(g, d, prof);
    // 1 回の計算の中では入力の値は変わらないので、同じ入力は 1 回だけ読む（exprespy のコードで同じ IN[i] を何度も書くと、
    // その数だけ読み込みが起きていた）。計算は入力の値を書き換えない（代入は複製する）ので、同じ値を渡してよい
    const seen = new Map();
    const io = {
      frame: this.frame,
      fps: this.clip.fps || 24,
      read: (plug, info) => {
        let v = seen.get(plug);
        if (v === undefined && !seen.has(plug)) { v = this.defRead(g, plug, info); seen.set(plug, v); }
        return v;
      },
      indices: (prefix) => this.defIndices(g, prefix),
      connected: (plug) => {
        const keys = Object.keys(g.inputs || {});
        return keys.some((k) => k === plug || k.startsWith(`${plug}.`) || k.startsWith(`${plug}[`));
      },
    };
    try {
      return d.run(io);
    } catch (e) {
      if (this.deepState.depth && mayOverflow(e)) throw e;    // スタックのあふれは deep がやり直す（値なしにしない）
      this.problems.add(`${g.name}（${g.def}）: ${e.message}`);
      return null;
    }
  }

  /** 定義のノードの入力の値。角度はラジアン、時間は接続がなければいまのフレーム */
  /**
   * 評価のプロファイラの記録中の defOutputs: 計算そのものと、入力の読み込み（上流の値を求める時間を含む）を分けて測る。
   * 入力の読み込みの中でほかの自作ノードを計算したら、その時間は内側のノードに付ける（外側の読み込みから引く）
   */
  defOutputsProfiled(g, d, prof) {
    const stack = prof.defStack || (prof.defStack = []);
    const rec = { read: 0, child: 0, reads: 0 };
    stack.push(rec);
    const seen = new Map();                        // defOutputs と同じく、同じ入力は 1 回だけ読む
    const io = {
      frame: this.frame,
      fps: this.clip.fps || 24,
      read: (plug, info) => {
        rec.reads++;
        if (seen.has(plug)) return seen.get(plug);
        const t = performance.now();
        try {
          const v = this.defRead(g, plug, info);
          seen.set(plug, v);
          return v;
        } finally { rec.read += performance.now() - t; }
      },
      indices: (prefix) => this.defIndices(g, prefix),
      connected: (plug) => {
        const keys = Object.keys(g.inputs || {});
        return keys.some((k) => k === plug || k.startsWith(`${plug}.`) || k.startsWith(`${plug}[`));
      },
    };
    const t0 = performance.now();
    try {
      return d.run(io);
    } catch (e) {
      if (this.deepState.depth && mayOverflow(e)) throw e;    // スタックのあふれは deep がやり直す（値なしにしない）
      this.problems.add(`${g.name}（${g.def}）: ${e.message}`);
      return null;
    } finally {
      const total = performance.now() - t0;
      stack.pop();
      if (stack.length) stack[stack.length - 1].child += total;
      prof.defNode(g, d, total - rec.read, Math.max(0, rec.read - rec.child), rec.reads, seen.size);
    }
  }

  defRead(g, plug, info) {
    const inputs = g.inputs || {}, attrs = g.attrs || {};
    if (!info) return inputs[plug] ? this.source(inputs[plug]) : attrs[plug];
    if (info.component !== undefined) {            // ベクトルの成分（inx）を直接読む
      if (inputs[plug]) {
        const v = this.source(inputs[plug]);
        return typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : 0);
      }
      const k = info.angle ? D2R : 1;
      if (typeof attrs[plug] === 'number') return attrs[plug] * k;
      const d = info.of.default || [];
      return (d[info.component] ?? 0) * k;
    }
    const k = info.angle ? D2R : 1;
    if (info.type === 'matrix') {
      const v = inputs[plug] ? this.source(inputs[plug]) : attrs[plug];
      if (v && v.isMatrix4) return v;
      return new Matrix4().fromArray(Array.isArray(v) && v.length === 16 ? v : info.default);
    }
    if (info.size) {
      // ベクトル: 全体の接続 → 成分ごとの接続・値 → 全体の値 → 既定値
      if (inputs[plug]) {
        const v = this.source(inputs[plug]);
        if (Array.isArray(v)) return v.slice(0, info.size);
      }
      const whole = Array.isArray(attrs[plug]) ? attrs[plug] : null;
      return (info.components || []).map((c, i) => {
        const cp = componentPlug(plug, c);
        if (inputs[cp]) {
          const v = this.source(inputs[cp]);
          return typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : 0);
        }
        if (typeof attrs[cp] === 'number') return attrs[cp] * k;
        if (whole && typeof whole[i] === 'number') return whole[i] * k;
        return (info.default ? info.default[i] : 0) * k;
      });
    }
    // 数
    if (inputs[plug]) {
      const v = this.source(inputs[plug]);
      if (typeof v === 'number') return v;
      if (Array.isArray(v) && typeof v[0] === 'number') return v[0];
      return 0;
    }
    if (info.type === 'time') { this.varying = true; return this.frame; }   // 時間（time1 への接続は .ma の読み込みで消えるため、いまのフレーム）
    if (typeof attrs[plug] === 'number') return attrs[plug] * k;
    if (Array.isArray(attrs[plug]) && typeof attrs[plug][0] === 'number') return attrs[plug][0] * k;
    return (typeof info.default === 'number' ? info.default : 0) * k;
  }

  /** 配列の属性（prefix[n]）の、存在する要素の番号（接続とファイルの値から。小さい順） */
  defIndices(g, prefix) {
    const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.indices(g, new RegExp(`^${esc}\\[(\\d+)\\]`));
  }
}
