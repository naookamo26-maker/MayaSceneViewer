// RigEvaluator の計算ノード（unitConversion・multiplyDivide・pairBlend・行列ノード・カーブの情報・expression・
// アニメーションレイヤーなど）の評価。rig.js から分けたもの（整備計画の D5）。新しい計算ノード（Maya 2024 以降）の計算は
// mathNodes.js。メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { composeMaya, decomposeMaya, evaluateCurve, mayaEuler } from './animation.js';
import { compileExpression } from './expression.js';
import { evaluateTrax } from './trax.js';
import {
  arcLength, curveSegment, domain, nearestParam, parseNurbsCurve, pointAt, polyline, rebuildCurve, reverseCurve, withCvs,
} from './curve.js';
import { evaluateMath, mathKind } from './mathNodes.js';
import { mayOverflow } from './deepEval.js';
import {
  D2R, EPS, IDENTITY, NOT_COMMON, NULL, OUTPUTS, OUT_ATTR, RGB, THREE_ORDER, TIME_RE, XY, XYZ, XYZW, _cpE, _cpQ, _dcQ, _dcS,
  _dcSh, _dcT, _e,
  closestOnPolyline, expand, expandInto, layerRotation, positionOf, weightedPow,
} from './rig.js';

export class MathMethods {
  outputs(id) {
    return this.memo(this.cache.out, this.keep.out, id, () => this.outputsUncached(id), NULL, () => `out ${id}`);
  }

  /** よく使う種類の計算ノードの出力（outputsUncached の先に振り分ける）。それ以外の種類は NOT_COMMON */
  outputsCommon(id, g) {
    let o = null;
    switch (g.type) {
      case 'unitConversion': o = { o: this.num(id, 'i') * this.num(id, 'cf', 1) }; break;
      case 'multMatrix': {
        // Maya の o = i[0] · i[1] · …（行ベクトル）は、three.js では … · i[1] · i[0]
        const out = new Matrix4();
        for (const i of this.indices(g, /^i\[(\d+)\]$/)) out.premultiply(this.mat(id, `i[${i}]`));
        o = { o: out };
        break;
      }
      case 'decomposeMatrix': {
        // Maya と同じ分け方（せん断を分けてから回転にする。鏡に映した行列は Z のスケールを負にする（MTransformationMatrix。
        // コンストレイントの 3 軸とは違う）。角度は 0 に近い方）
        // 途中の値（_dc*）は使い回すので、入力はすべて先に読む（読むと、ほかの decomposeMatrix を計算して書き換えることがある）
        const m = this.mat(id, 'imat'), ro = Math.round(this.num(id, 'ro', 0));
        const { t, q, s, sh } = decomposeMaya(m, _dcT, _dcQ, _dcS, _dcSh, 'z');
        const e = mayaEuler(q, ro);
        // 出力は決まった名前なので、1 つのオブジェクトリテラルで作る（よく使うノード。形が毎回同じで速い）
        o = {
          ot: [t.x, t.y, t.z], otx: t.x, oty: t.y, otz: t.z,
          or: e, orx: e[0], ory: e[1], orz: e[2],
          os: [s.x, s.y, s.z], osx: s.x, osy: s.y, osz: s.z,
          osh: [sh.x, sh.y, sh.z], oshx: sh.x, oshy: sh.y, oshz: sh.z,
          oq: [q.x, q.y, q.z, q.w], oqx: q.x, oqy: q.y, oqz: q.z, oqw: q.w,
        };
        break;
      }
      case 'composeMatrix': {
        const t = this.vec(id, 'it'), r = this.vec(id, 'ir'), s = this.vec(id, 'is', [1, 1, 1]);
        const sh = this.vec(id, 'ish');                     // せん断（inputShear）も入れる
        let q;
        if (this.num(id, 'uer', 1) >= 0.5) {
          // 回転順は .ro（Maya の技術資料。古いサンプルの .iro も読む）
          const ro = this.num(id, this.attrName(this.byId.get(id), ['ro', 'iro']), 0);
          // 途中の値（_cpQ・_cpE）は使い回すので、入力はすべて先に読んである（このあとは属性を読まない）
          q = _cpQ.setFromEuler(_cpE.set(r[0], r[1], r[2], THREE_ORDER[Math.round(ro)] || 'ZYX'));
        } else {
          const v = this.vec(id, 'iq', [0, 0, 0, 1]);
          q = new Quaternion(v[0], v[1], v[2], v[3] ?? 1).normalize();
        }
        o = { omat: composeMaya(t, q, s, sh) };
        break;
      }
      case 'inverseMatrix': o = { omat: this.mat(id, 'imat').clone().invert() }; break;
      // アニメーションレイヤー: 下のレイヤーまでの値（ia）にこのレイヤーの値（ib）をウェイトで重ねる
      case 'animBlendNodeAdditiveDL': case 'animBlendNodeAdditiveDA': case 'animBlendNodeAdditive':
      case 'animBlendNodeAdditiveF': case 'animBlendNodeAdditiveFL': case 'animBlendNodeAdditiveFA':
      case 'animBlendNodeTime':
        o = { o: this.num(id, 'ia', 0) * this.num(id, 'wa', 1) + this.num(id, 'ib', 0) * this.num(id, 'wb', 1) };
        break;
      case 'animBlendNodeAdditiveI16': case 'animBlendNodeAdditiveI32':
        o = { o: Math.round(this.num(id, 'ia', 0) * this.num(id, 'wa', 1) + this.num(id, 'ib', 0) * this.num(id, 'wb', 1)) };
        break;
      case 'animBlendNodeAdditiveScale': {
        // かけ算で重ねる（acm 1。レイヤーの .sam の既定）: ia^wa · ib^wb。足し算（acm 0）: ia · wa + ib · wb
        // （Maya の技術資料の式。Override のレイヤーは wa（背面のウェイト）で下のレイヤーを弱める）
        const ia = this.num(id, 'ia', 0), ib = this.num(id, 'ib', 0), wa = this.num(id, 'wa', 1), wb = this.num(id, 'wb', 1);
        o = { o: this.num(id, 'acm', 0) >= 0.5 ? weightedPow(ia, wa) * weightedPow(ib, wb) : ia * wa + ib * wb };
        break;
      }
      case 'animBlendNodeBoolean': case 'animBlendNodeEnum':
        // 足し合わせられない型: ウェイトが 0 でなければこのレイヤーの値、0 なら下のレイヤーまでの値（Maya の技術資料）
        o = { o: this.num(id, 'wb', 1) > 0 ? this.num(id, 'ib', 0) : this.num(id, 'ia', 0) };
        break;
      case 'animBlendNodeAdditiveRotation': {
        // 成分ごとに読む（vec と同じ値。3 つ組を読むと成分を読んで配列を作り直すので、よく使うノードでは直接読む）
        const wa = this.num(id, 'wa', 1), wb = this.num(id, 'wb', 1);
        const ax = this.num(id, 'iax', 0), ay = this.num(id, 'iay', 0), az = this.num(id, 'iaz', 0);
        const bx = this.num(id, 'ibx', 0), by = this.num(id, 'iby', 0), bz = this.num(id, 'ibz', 0);
        let x, y, z;
        if (this.num(id, 'acm', 0) >= 0.5) {
          // レイヤーごと（.ram 1）: クォータニオンで重ねる（入力の値はすべて先に読んである）
          [x, y, z] = layerRotation([ax, ay, az], [bx, by, bz], wa, wb, Math.round(this.num(id, 'ro', 0)));
        } else {
          // 成分ごと（.ram 0。Maya の既定）: ia · wa + ib · wb
          x = ax * wa + bx * wb; y = ay * wa + by * wb; z = az * wa + bz * wb;
        }
        o = { o: [x, y, z], ox: x, oy: y, oz: z };
        break;
      }
      default: return NOT_COMMON;
    }
    return o;
  }

  /**
   * アニメーションレイヤーの出力（Maya の技術資料・ユーザーガイド。保存されたシーンの値で確かめた）。
   * ミュート .omte: 自分のミュート .mt・親のミュート .pmte・兄弟がソロでこのレイヤーはソロでない（.sslo かつ .sl でない）。
   * 子のレイヤーへは .omte → .pmte、.fgwt → .pwth、.csol → .sslo とつながる。
   * 前面のウェイト .fgwt（古いサンプルの .fo も）: ミュートなら 0、それ以外はウェイト .wgth × 親のウェイト .pwth。
   * 背面のウェイト .bgwt（blend ノードの wa）: 足し算のレイヤーとミュートしたレイヤーは 1。Override は、Passthrough
   * （.pthg）なら 1 − 前面のウェイト（下のレイヤーと混ぜる）、そうでなければ 0（下のレイヤーは見えない）
   */
  animLayer(g) {
    const id = g.id;
    const soloOut = this.num(id, 'sslo', 0) >= 0.5 && this.num(id, 'sl', 0) < 0.5;
    const muted = this.num(id, this.attrName(g, ['mt', 'm']), 0) >= 0.5 || this.num(id, 'pmte', 0) >= 0.5 || soloOut;
    const fg = muted ? 0 : this.num(id, this.attrName(g, ['wgth', 'w']), 1) * this.num(id, 'pwth', 1);
    let bg = 1;
    if (!muted && this.num(id, 'ovrd', 0) >= 0.5) bg = this.num(id, 'pthg', 1) >= 0.5 ? 1 - fg : 0;
    // 子のレイヤーのどれかがソロ（.chsl[i] ← 子の .sl）
    let csol = 0;
    for (const k of new Set([...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})])) {
      if (/^chsl\[\d+\]$/.test(k) && this.num(id, k, 0) >= 0.5) { csol = 1; break; }
    }
    return { fgwt: fg, fo: fg, bgwt: bg, omte: muted ? 1 : 0, oram: this.num(id, 'ram', 0), csol };
  }

  outputsUncached(id) {
    const g = this.byId.get(id);
    if (g.def) return this.defOutputs(g);
    // よく使う種類は、小さな関数で先に振り分ける（大きな振り分けは種類の名前を上から順に比べるので、後ろの種類ほど遅い）
    const common = this.outputsCommon(id, g);
    if (common !== NOT_COMMON) return common;
    let o = null;
    switch (g.type === 'distanceBetweenDL' ? 'distanceBetween' : g.type) {
      case 'multiplyDivide': o = this.multiplyDivide(id); break;
      case 'plusMinusAverage': o = this.plusMinusAverage(id); break;
      case 'reverse': o = expand('o', this.vec(id, 'i').map((x) => 1 - x), XYZ); break;
      case 'condition': o = this.condition(id); break;
      case 'blendColors': o = this.blendColors(id); break;
      case 'pairBlend': o = this.pairBlend(id); break;
      case 'pointConstraint': case 'orientConstraint': case 'parentConstraint':
      case 'scaleConstraint': case 'poleVectorConstraint': case 'aimConstraint': case 'lookAt':
        o = this.constraint(g);
        break;
      case 'distanceDimShape': {
        // 距離の寸法: 開始点（.startPoint）と終了点（.endPoint。ふつうはロケーターの worldPosition）の距離
        const p = (names) => new Vector3(...this.vec(id, this.attrName(g, names)));
        const d = p(['sp', 'startPoint']).distanceTo(p(['ep', 'endPoint']));
        o = { dist: d, distance: d };
        break;
      }
      case 'fourByFourMatrix': {
        // 16 個の数（i00〜i33 = 行・列。長い名前は in00〜in33）を、Maya の行の順に並べた行列。既定値は単位行列
        const v = [];
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const x = this.plug(id, `i${r}${c}`) ?? this.plug(id, `in${r}${c}`);
            v.push(typeof x === 'number' ? x : (r === c ? 1 : 0));
          }
        }
        const m = new Matrix4().fromArray(v);
        o = { o: m, output: m };
        break;
      }
      case 'quatToEuler': {
        o = expand('ort', mayaEuler(this.quat(id, 'iq').normalize(), this.order(id, 'iro')), XYZ);
        break;
      }
      case 'eulerToQuat': {
        const r = this.vec(id, 'irt');
        const q = new Quaternion().setFromEuler(new Euler(r[0], r[1], r[2], this.order(id, 'iro')));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatProd': {
        // Maya の積 input1 · input2 は「1 を先に回してから 2」（行ベクトル規約）。three.js では q2 · q1
        const q = this.quat(id, 'iq2').multiply(this.quat(id, 'iq1'));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatInvert': case 'quatNormalize': {
        const q = this.quat(id, 'iq').normalize();
        if (g.type === 'quatInvert') q.invert();
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'quatSlerp': {
        const q = this.quat(id, 'iq1').normalize().slerp(this.quat(id, 'iq2').normalize(), this.num(id, 'it', 0));
        o = expand('oq', [q.x, q.y, q.z, q.w], XYZW);
        break;
      }
      case 'curveInfo': {
        const c = this.plug(id, 'ic');
        const al = c && c.isCurve ? arcLength(c) : 0;
        o = { al, arcLength: al };
        break;
      }
      case 'nurbsCurve': o = this.curveOutputs(g); break;
      case 'locator': {
        const p = positionOf(g.parent >= 0 ? this.world(g.parent) : IDENTITY).toArray();
        o = { wp: p, worldPosition: p };
        break;
      }
      case 'skinCluster': o = this.skinCurve(g); break;
      case 'wire': o = this.wireCurves(g); break;
      case 'cluster': o = this.clusterCurves(g); break;
      case 'addDoubleLinear': o = { o: this.num(id, 'i1', 0) + this.num(id, 'i2', 0) }; break;
      case 'multDoubleLinear': o = { o: this.num(id, 'i1', 0) * this.num(id, 'i2', 0) }; break;
      case 'clamp': {
        const v = this.vec(id, 'ip'), lo = this.vec(id, 'mn'), hi = this.vec(id, 'mx');
        o = expand('op', v.map((x, i) => Math.min(Math.max(x, lo[i]), hi[i])), RGB);
        break;
      }
      case 'setRange': {
        const v = this.vec(id, 'v'), n = this.vec(id, 'n'), m = this.vec(id, 'm'), on = this.vec(id, 'on'), om = this.vec(id, 'om');
        o = expand('o', v.map((x, i) => (Math.abs(om[i] - on[i]) < 1e-12 ? n[i] : n[i] + (x - on[i]) / (om[i] - on[i]) * (m[i] - n[i]))), XYZ);
        break;
      }
      case 'remapValue': o = this.remapValue(g); break;
      case 'pointOnCurveInfo': o = this.pointOnCurve(g); break;
      case 'distanceBetween': {
        const p1 = new Vector3(...this.vec(id, 'p1')).applyMatrix4(this.mat(id, 'im1'));
        const p2 = new Vector3(...this.vec(id, 'p2')).applyMatrix4(this.mat(id, 'im2'));
        o = { d: p1.distanceTo(p2) };
        break;
      }
      case 'vectorProduct': {
        // op: 0 なし・1 内積・2 外積・3 ベクトル × 行列・4 点 × 行列
        const a = new Vector3(...this.vec(id, 'i1')), b = new Vector3(...this.vec(id, 'i2'));
        const op = Math.round(this.num(id, 'op', 1));
        let r;
        const no = this.num(id, 'no', 0) >= 0.5;
        if (op === 1) {
          // 内積で normalizeOutput がオンなら、入力を正規化してからの内積（角度の cos。-1〜1）。長さ 0 のベクトルは 0。
          // 出典: Autodesk Maya ノードの技術資料「vectorProduct」（normalizeOutput の説明）
          const d = no ? a.clone().normalize().dot(b.clone().normalize()) : a.dot(b);
          r = new Vector3(d, d, d);
        } else if (op === 2) r = a.clone().cross(b);
        else if (op === 3) r = a.clone().applyMatrix3(new Matrix3().setFromMatrix4(this.mat(id, 'm')));   // 移動を除く
        else if (op === 4) r = a.clone().applyMatrix4(this.mat(id, 'm'));
        else r = a.clone();
        if (no && op !== 1) r.normalize();
        o = expand('o', r.toArray(), XYZ);
        break;
      }
      case 'blendTwoAttr': {
        const ab = this.num(id, 'ab', 0);
        o = { o: this.num(id, 'i[0]', 0) * (1 - ab) + this.num(id, 'i[1]', 0) * ab };
        break;
      }
      case 'blendWeighted': {
        let sum = 0;
        for (const k of this.indices(g, /^i\[(\d+)\]$/)) sum += this.num(id, `i[${k}]`, 0) * this.num(id, `w[${k}]`, 1);
        o = { o: sum };
        break;
      }
      case 'choice': o = { o: this.plug(id, `i[${Math.round(this.num(id, 's', 0))}]`) }; break;
      case 'character': {
        // キャラクターセット: カーブが直接つながる属性はそのまま（plugUncached で先に返る）。
        // Trax のクリップがあれば、いまのフレームで有効なクリップの値。なければファイルの値
        o = {};
        // （角度の値 av[i] のファイルの値は度。ほかの角度の出力と同じくラジアンにする）
        for (const [k, v] of Object.entries(g.attrs || {})) if (OUTPUTS.character.test(k)) o[k] = /^av\[/.test(k) ? v * D2R : v;
        if (g.trax) this.varying = true;
        if (g.trax) Object.assign(o, evaluateTrax(g.trax, this.frame, this.clip.curves, (c, v) => (c.type === 'TA' ? v * D2R : v)));
        break;
      }
      case 'animCurveUA': case 'animCurveUL': case 'animCurveUU': {
        // ドリブンキー: 入力（ドライバーの値。角度は unitConversion で度になっている）でカーブを引く
        const c = this.clip.curves[g.curve];
        if (!c) break;
        const v = evaluateCurve(c, this.num(id, 'i', 0));
        o = { o: g.type === 'animCurveUA' ? v * D2R : v };
        o.output = o.o;
        break;
      }
      case 'animLayer': o = this.animLayer(g); break;
      case 'expression': o = this.expression(g); break;
      case 'tweak': {                                       // 頂点の調整は反映しない（形はそのまま通す）
        const c = this.plug(id, 'ip[0].ig');
        o = c && c.isCurve ? { og: c } : null;
        break;
      }
      case 'groupParts': {
        const c = this.plug(id, 'ig');
        o = c && c.isCurve ? { og: c } : null;
        break;
      }
      case 'transformGeometry': {
        // 入力のカーブの CV に行列を掛ける（Maya の行ベクトルの p · txf。invertTransform なら逆行列）
        const c = this.plug(id, 'ig');
        if (!c || !c.isCurve) { o = null; break; }
        const m = this.mat(id, 'txf').clone();
        if (this.num(id, 'itf', 0) >= 0.5) m.invert();
        o = { og: withCvs(c, c.cvs.map((p) => p.clone().applyMatrix4(m))) };
        break;
      }
      // カーブのヒストリ（入力の形が動く・属性が接続されているもの。動かないものは読み込みで焼き付ける）。
      // 計算は curve.js（読み込みの ma_viewer/nurbs.py と同じ手順）
      case 'rebuildCurve': {
        const c = this.plug(id, 'ic');
        const keepCvs = this.num(id, 'kcp', 0) >= 0.5;
        if (!c || !c.isCurve || (Math.round(this.num(id, 'rt', 0)) !== 0 && !keepCvs)) { o = null; break; }   // uniform だけ
        o = { oc: rebuildCurve(c, {
          spans: this.num(id, 's', 4), degree: this.num(id, 'd', 3), keepRange: Math.round(this.num(id, 'kr', 1)),
          multipleEnds: this.num(id, 'end', 0) >= 0.5, keepEndPoints: this.num(id, 'kep', 1) >= 0.5,
          keepTangents: this.num(id, 'kt', 1) >= 0.5, keepCvs,
        }) };
        break;
      }
      case 'reverseCurve': {
        const c = this.plug(id, 'ic');
        o = c && c.isCurve ? { oc: reverseCurve(c) } : null;
        break;
      }
      case 'subCurve': {
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve || c.form === 2) { o = null; break; }
        const [lo, hi] = domain(c);
        const mn = this.num(id, 'min', 0), mx = this.num(id, 'max', -1);
        const [a, b] = this.num(id, 'r', 0) >= 0.5 ? [lo + (hi - lo) * mn, lo + (hi - lo) * mx] : [mn, mx < mn ? hi : mx];
        o = { oc: curveSegment(c, a, b) };
        break;
      }
      case 'detachCurve': {
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve || c.form === 2) { o = null; break; }
        const [lo, hi] = domain(c);
        const cuts = [lo, ...this.indices(g, /^p\[(\d+)\]$/).map((k) => this.num(id, `p[${k}]`, 0)), hi];
        o = {};
        for (let k = 0; k + 1 < cuts.length; k++) {
          if (this.num(id, `k[${k}]`, 1) < 0.5) continue;              // 残さない部分（keep）
          o[`oc[${k}]`] = curveSegment(c, cuts[k], cuts[k + 1]);
        }
        break;
      }
      case 'nearestPointOnCurve': {
        // 入力の点（.ip）にいちばん近いカーブ（.ic）上の点（.p）とパラメータ（.pr）
        const c = this.plug(id, 'ic');
        if (!c || !c.isCurve) { o = null; break; }
        const u = nearestParam(c, new Vector3(...this.vec(id, 'ip')));
        const p = pointAt(c, u).toArray();
        o = expandInto({ pr: u, parameter: u, position: p, positionX: p[0], positionY: p[1], positionZ: p[2] }, 'p', p, XYZ);
        break;
      }
      default: {
        const mk = mathKind(g.type);                             // 新しい計算ノード・行列ノード（mathNodes.js）
        if (mk) o = evaluateMath(this, g, mk);
        break;
      }
    }
    return o;
  }

  /** wire の入力 k のカーブ（ワールド空間の CV）と、ワールド行列（変形するカーブの transform） */
  wireInput(g, k) {
    const c = this.plug(g.id, `ip[${k}].ig`);
    if (!c || !c.isCurve) return null;
    const gp = (g.geom || {})[k];
    const Wg = gp >= 0 ? this.world(gp) : IDENTITY;
    return { curve: c, Wg, world: c.cvs.map((p) => p.clone().applyMatrix4(Wg)) };
  }

  /**
   * wire: ワイヤー（dw[i]）とベースワイヤー（bw[i]）の差で、カーブ（ip[k].ig）の CV を動かす（ワールド空間で計算）。
   * CV ごとにベースワイヤーの一番近い点（パラメータ u）を求め、距離 d と影響範囲 dds[i] から重み f = (1 − (d/dds)²)²。
   *   p' = W(u) + R · (p − B(u)) · (1 + (sc − 1) · f)    （B・W はベースワイヤー・ワイヤーの点、R は接線の向きの変化 × rot · f）
   *   移動量 = (p' − p) · f をワイヤーごとに足し、エンベロープ（en）と CV のウェイト（wl[k].w[v]）を掛ける。
   * Maya の計算式は公開されていないので近似（tension・localInfluence・holder は使わない）
   */
  wireCurves(g) {
    const id = g.id;
    const wires = this.indices(g, /^dw\[(\d+)\]$/).map((i) => {
      const W = this.plug(id, `dw[${i}]`), B = this.plug(id, `bw[${i}]`);
      if (!W || !W.isCurve || !B || !B.isCurve || W.cvs.length !== B.cvs.length) return null;
      // 同じパラメータで折れ線にする（ベースの点とワイヤーの点が対応する）
      const pb = polyline(B, 32).pts, pw = polyline(W, 32).pts;
      return { pb, pw, dds: this.num(id, `dds[${i}]`, 1), sc: this.num(id, `sc[${i}]`, 1) };
    }).filter(Boolean);
    // 回転の効きは .ro（Maya の技術資料。古いサンプルの .rot も読む）
    const en = this.num(id, 'en', 1), rot = this.num(id, this.attrName(g, ['ro', 'rot']), 1);
    const out = {};
    for (const k of this.indices(g, /^ip\[(\d+)\]\.ig$/)) {
      const c = this.plug(id, `ip[${k}].ig`);
      if (!c || !c.isCurve) continue;
      const gp = (g.geom || {})[k];
      const Wg = gp >= 0 ? this.world(gp) : IDENTITY;
      const WgInv = Wg.clone().invert();
      const attrs = g.attrs || {};
      const only = this.maskOf(g, k);
      const cvs = c.cvs.map((local, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const weight = (typeof wv === 'number' ? wv : 1) * en;
        if (!wires.length || Math.abs(weight) < EPS || (only && !only.has(v))) return local.clone();
        const p = local.clone().applyMatrix4(Wg);
        const disp = new Vector3();
        for (const { pb, pw, dds, sc } of wires) {
          const { d, j: bj, t: bt } = closestOnPolyline(pb, p);
          if (dds <= EPS || d >= dds) continue;
          const x = d / dds;
          const f = (1 - x * x) * (1 - x * x);
          const Bu = new Vector3().lerpVectors(pb[bj], pb[bj + 1], bt);
          const Wu = new Vector3().lerpVectors(pw[bj], pw[bj + 1], bt);
          const tb = new Vector3().subVectors(pb[bj + 1], pb[bj]).normalize();
          const tw = new Vector3().subVectors(pw[bj + 1], pw[bj]).normalize();
          const R = new Quaternion().slerp(new Quaternion().setFromUnitVectors(tb, tw), Math.min(1, Math.max(0, rot * f)));
          const q = new Vector3().subVectors(p, Bu).multiplyScalar(1 + (sc - 1) * f).applyQuaternion(R);
          disp.add(Wu.add(q).sub(p).multiplyScalar(f));
        }
        return p.addScaledVector(disp, weight).applyMatrix4(WgInv);
      });
      out[`og[${k}]`] = withCvs(c, cvs);
      if (!out.og) out.og = out[`og[${k}]`];
    }
    return out;
  }

  /** コンポーネントタグか groupParts の .inputComponents で選んだ、入力 k の変形する CV の番号（Set）。選んでいなければ null（すべて） */
  maskOf(g, k) {
    const list = (g.mask || {})[k];
    if (!Array.isArray(list)) return null;
    let sets = this.derived.maskSets.get(g);
    if (!sets) this.derived.maskSets.set(g, sets = {});
    if (!sets[k]) sets[k] = new Set(list);
    return sets[k];
  }

  /**
   * cluster: ハンドルの行列でカーブ（ip[k].ig）の CV を動かす。
   * Maya の p · gm · pm · ma · gm⁻¹（行ベクトル）を three.js の順で gm⁻¹ · ma · pm · gm とし、CV のウェイト（wl[k].w[v]）と
   * エンベロープで元の位置と混ぜる。gm（geomMatrix）がファイルになければ、変形するカーブの transform のワールド行列。
   * relative（ハンドルの親の動きを除く）には対応しない
   */
  clusterCurves(g) {
    const id = g.id;
    const D = this.mat(id, 'ma').clone().multiply(this.mat(id, 'pm'));
    const en = this.num(id, 'en', 1);
    const attrs = g.attrs || {};
    const out = {};
    for (const k of this.indices(g, /^ip\[(\d+)\]\.ig$/)) {
      const c = this.plug(id, `ip[${k}].ig`);
      if (!c || !c.isCurve) continue;
      const gp = (g.geom || {})[k];
      const G = Array.isArray(attrs[`gm[${k}]`]) ? new Matrix4().fromArray(attrs[`gm[${k}]`]) : (gp >= 0 ? this.world(gp) : IDENTITY);
      const M = G.clone().invert().multiply(D).multiply(G);
      const only = this.maskOf(g, k);
      const cvs = c.cvs.map((p, v) => {
        const wv = attrs[`wl[${k}].w[${v}]`];
        const w = (typeof wv === 'number' ? wv : 1) * en;
        if (only && !only.has(v)) return p.clone();
        return Math.abs(w) < EPS ? p.clone() : p.clone().lerp(p.clone().applyMatrix4(M), w);
      });
      out[`og[${k}]`] = withCvs(c, cvs);
      if (!out.og) out.og = out[`og[${k}]`];
    }
    return out;
  }

  /**
   * pointOnCurveInfo: カーブ（ic）のパラメータ pr の点・接線・法線。turnOnPercentage（top）なら pr はパラメータの範囲を
   * 0〜1 にそろえた値（長さの割合ではない。カーブの伸び方によって点の間隔は変わる）。
   * 接線（t）はパラメータでの微分、法線（n）は 2 階微分の接線に垂直な成分（曲率の向き）。どちらも差分で求める
   */
  pointOnCurve(g) {
    const id = g.id;
    const c = this.plug(id, 'ic');
    if (!c || !c.isCurve) return null;
    const [u0, u1] = domain(c);
    let u = this.num(id, 'pr', 0);
    // turnOnPercentage: pr はパラメータの範囲を 0〜1 にそろえた値（Maya と同じ。長さの割合ではない）
    if (this.num(id, 'top', 0) >= 0.5) u = u0 + (u1 - u0) * Math.min(Math.max(u, 0), 1);
    u = Math.min(Math.max(u, u0), u1);
    const h = (u1 - u0) * 1e-4;
    const at = (x) => pointAt(c, Math.min(Math.max(x, u0), u1));
    const p = at(u);
    const a = Math.max(u - h, u0), b = Math.min(u + h, u1);
    const t = at(b).sub(at(a)).divideScalar(b - a);
    const d2 = at(b).add(at(a)).sub(p.clone().multiplyScalar(2)).divideScalar(((b - a) / 2) ** 2);
    const tn = t.clone().normalize();
    const n = d2.clone().addScaledVector(tn, -d2.dot(tn));
    const speed2 = t.lengthSq();
    const curvature = speed2 > EPS ? n.length() / speed2 : 0;
    const cr = curvature > EPS ? 1 / curvature : 0;
    const cc = curvature > EPS ? p.clone().addScaledVector(n.clone().normalize(), cr) : p.clone();
    const o = { cr };
    expandInto(o, 'p', p.toArray(), XYZ);
    expandInto(o, 't', t.toArray(), XYZ);
    expandInto(o, 'nt', tn.toArray(), XYZ);
    expandInto(o, 'n', n.toArray(), XYZ);
    expandInto(o, 'nn', n.clone().normalize().toArray(), XYZ);
    return expandInto(o, 'cc', cc.toArray(), XYZ);
  }

  /** remapValue: 入力を 0〜1 にして値のランプ（vl[i]: 位置 vp・値 fv・補間 vi）を引き、出力の範囲に戻す */
  remapValue(g) {
    const id = g.id;
    const lo = this.num(id, 'imn', 0), hi = this.num(id, 'imx', 1);
    const t = Math.abs(hi - lo) < 1e-12 ? 0 : (this.num(id, 'i', 0) - lo) / (hi - lo);
    const attrs = g.attrs || {};
    const pts = this.indices(g, /^vl\[(\d+)\]/).map((i) => {
      const whole = attrs[`vl[${i}]`];
      // 項目の名前は .vlp・.vlfv・.vli（Maya の技術資料）。古いサンプルの .vp・.fv・.vi も読む
      const get = (names, k, def) => {
        for (const name of names) {
          if ((g.inputs || {})[`vl[${i}].${name}`]) return this.num(id, `vl[${i}].${name}`, def);
          if (typeof attrs[`vl[${i}].${name}`] === 'number') return attrs[`vl[${i}].${name}`];
        }
        return Array.isArray(whole) && Number.isFinite(whole[k]) ? whole[k] : def;
      };
      return { p: get(['vlp', 'vp'], 0, 0), v: get(['vlfv', 'fv'], 1, 0), interp: Math.round(get(['vli', 'vi'], 2, 1)) };
    }).sort((a, b) => a.p - b.p);
    let r;
    if (!pts.length) r = Math.min(1, Math.max(0, t));                        // 既定: (0, 0)〜(1, 1) の直線
    else if (t <= pts[0].p) r = pts[0].v;
    else if (t >= pts[pts.length - 1].p) r = pts[pts.length - 1].v;
    else {
      let j = 0;
      while (j < pts.length - 2 && pts[j + 1].p <= t) j++;
      const a = pts[j], b = pts[j + 1];
      const u = (t - a.p) / Math.max(b.p - a.p, 1e-12);
      // 補間: 0 なし・1 線形・2 スムーズ・3 スプライン（スムーズで近似）
      const f = a.interp === 0 ? 0 : a.interp === 1 ? u : u * u * (3 - 2 * u);
      r = a.v + (b.v - a.v) * f;
    }
    const omn = this.num(id, 'omn', 0), omx = this.num(id, 'omx', 1);
    const ov = omn + r * (omx - omn);
    return { ov, outValue: ov };
  }

  /** expression: 式を（最初の 1 回だけ）関数にして、このフレームの値で評価する。出力は out[n] */
  expression(g) {
    let compiled = this.derived.programs.get(g);
    if (compiled === undefined) {
      try {
        // 時間を読むか・入力の属性の名前は式で決まるので、最初の 1 回だけ求める
        compiled = { program: compileExpression(g.expr || ''), problem: null, time: TIME_RE.test(g.expr || ''), inAttr: [] };
      } catch (err) {
        compiled = { program: null, problem: err.message };
      }
      this.derived.programs.set(g, compiled);
    }
    if (!compiled.program) {
      this.problems.add(`expression ${g.name} を解釈できません: ${compiled.problem}`);
      return null;
    }
    if (compiled.time) this.varying = true;
    const inAttr = compiled.inAttr, id = g.id;
    let res;
    try {
      res = compiled.program.run({
        input: (k) => this.num(id, inAttr[k] || (inAttr[k] = `in[${k}]`), 0),
        frame: this.frame,
        time: this.frame / (this.clip.fps || 24),
      });
    } catch (err) {
      if (this.deepState.depth && mayOverflow(err)) throw err;  // スタックのあふれは deep がやり直す
      this.problems.add(`expression ${g.name}: ${err.message}`);
      return null;
    }
    const o = {};
    for (const [k, v] of res.out) if (Number.isFinite(v)) o[OUT_ATTR[k] || `out[${k}]`] = v;
    return o;
  }

  quat(id, base) {
    const v = this.vec(id, base, [0, 0, 0, 1]);
    return new Quaternion(v[0], v[1], v[2], v[3]);
  }

  order(id, attr) { return THREE_ORDER[Math.round(this.num(id, attr, 0))] || 'ZYX'; }

  /** nurbsCurve の出力: local（形）と ws（ワールド空間）。形は create の接続か .cc。制御点（cp）の接続は位置をそのまま使う */
  curveOutputs(g) {
    let base = null;
    const inputs = g.inputs || {};
    if (inputs.cr) {
      const v = this.source(inputs.cr);
      if (v && v.isCurve) base = v;
    }
    if (!base) base = parseNurbsCurve((g.attrs || {}).cc);
    if (!base) return null;
    const cvs = base.cvs.map((c) => c.clone());
    for (const [k, v] of Object.entries(g.attrs || {})) {          // ファイルの調整（tweak）は足す
      const m = /^cp\[(\d+)\]$/.exec(k);
      if (m && cvs[+m[1]] && Array.isArray(v)) cvs[+m[1]].add(new Vector3(v[0], v[1], v[2]));
    }
    for (const [k, src] of Object.entries(inputs)) {               // 接続は位置そのもの
      const m = /^cp\[(\d+)\](?:\.([xyz])v)?$/.exec(k);
      if (!m || !cvs[+m[1]]) continue;
      const v = this.source(src);
      if (m[2] && typeof v === 'number') cvs[+m[1]].setComponent(XYZ.indexOf(m[2]), v);
      else if (Array.isArray(v)) cvs[+m[1]].set(v[0], v[1], v[2]);
    }
    const local = withCvs(base, cvs);
    const Wp = g.parent >= 0 ? this.world(g.parent) : IDENTITY;
    const ws = withCvs(base, cvs.map((c) => c.clone().applyMatrix4(Wp)));
    return { l: local, local, ws, worldSpace: ws };
  }

  /** カーブの skinCluster: p' = Σ w · (W · pm · gm) · p → gm⁻¹（three.js の順。Maya の p · gm · pm · W · gm⁻¹） */
  skinCurve(g) {
    const c = this.plug(g.id, 'ip[0].ig');
    if (!c || !c.isCurve || !g.skin) return null;
    let weightsOf = this.derived.weightsOf.get(g);
    if (!weightsOf) {
      this.derived.weightsOf.set(g, weightsOf = new Map());
      for (const [v, i, w] of g.skin.weights) {
        if (!weightsOf.has(v)) weightsOf.set(v, []);
        weightsOf.get(v).push([i, w]);
      }
    }
    const gm = g.skin.gm ? new Matrix4().fromArray(g.skin.gm) : new Matrix4();
    const gmInv = gm.clone().invert();
    const mats = new Map();
    const matOf = (i) => {
      if (!mats.has(i)) {
        const pmIn = (g.inputs || {})[`pm[${i}]`];
        const pm = pmIn ? this.mat(g.id, `pm[${i}]`) : new Matrix4().fromArray(g.skin.pm[String(i)] || new Matrix4().elements);
        mats.set(i, this.mat(g.id, `ma[${i}]`).clone().multiply(pm).multiply(gm));
      }
      return mats.get(i);
    };
    const only = this.maskOf(g, 0);
    const cvs = c.cvs.map((p, v) => {
      const list = weightsOf.get(v);
      if (!list || (only && !only.has(v))) return p.clone();
      const acc = new Vector3();
      let total = 0;
      for (const [i, w] of list) {
        if (w === 0) continue;
        acc.addScaledVector(p.clone().applyMatrix4(matOf(i)), w);
        total += w;
      }
      return total > EPS ? acc.divideScalar(total).applyMatrix4(gmInv) : p.clone();
    });
    const out = withCvs(c, cvs);
    return { og: out };
  }

  multiplyDivide(id) {
    const a = this.vec(id, 'i1'), b = this.vec(id, 'i2', [1, 1, 1]);
    const op = Math.round(this.num(id, 'op', 1));
    const r = a.map((x, i) => {
      if (op === 1) return x * b[i];
      if (op === 2) return Math.abs(b[i]) < EPS ? x : x / b[i];
      if (op === 3) return x ** b[i];
      return x;
    });
    return expand('o', r, XYZ);
  }

  plusMinusAverage(id) {
    const g = this.byId.get(id);
    const op = Math.round(this.num(id, 'op', 1));
    const keys = new Set([...Object.keys(g.inputs || {}), ...Object.keys(g.attrs || {})]);
    const idx = (re) => [...new Set([...keys].map((k) => re.exec(k)).filter(Boolean).map((m) => +m[1]))].sort((a, b) => a - b);
    const combine = (list) => {
      if (!list.length) return 0;
      if (op === 2) return list.slice(1).reduce((s, x) => s - x, list[0]);
      const sum = list.reduce((s, x) => s + x, 0);
      if (op === 3) return sum / list.length;
      return op === 0 ? list[0] : sum;
    };
    // 2D・3D の入力の成分は i2[0].i2x・i3[0].i3x の名前
    const element = (kind, i, sfx) => {
      const base = `i${kind}[${i}]`;
      const whole = this.plug(id, base);
      return sfx.map((s, k) => {
        const v = this.plug(id, `${base}.i${kind}${s}`);
        if (typeof v === 'number') return v;
        return Array.isArray(whole) ? whole[k] : 0;
      });
    };
    const one = idx(/^i1\[(\d+)\]$/).map((i) => this.num(id, `i1[${i}]`));
    const two = idx(/^i2\[(\d+)\]/).map((i) => element(2, i, XY));
    const three = idx(/^i3\[(\d+)\]/).map((i) => element(3, i, XYZ));
    const o2 = [0, 1].map((a) => combine(two.map((v) => v[a])));
    const o3 = [0, 1, 2].map((a) => combine(three.map((v) => v[a])));
    return expandInto(expandInto({ o1: combine(one) }, 'o2', o2, XY), 'o3', o3, XYZ);
  }

  condition(id) {
    const a = this.num(id, 'ft'), b = this.num(id, 'st');
    const op = Math.round(this.num(id, 'op'));
    const ok = [a === b, a !== b, a > b, a >= b, a < b, a <= b][op] ?? false;
    return expand('oc', ok ? this.vec(id, 'ct', [0, 0, 0]) : this.vec(id, 'cf', [1, 1, 1]), RGB);
  }

  blendColors(id) {
    const c1 = this.vec(id, 'c1', [1, 0, 0]), c2 = this.vec(id, 'c2', [0, 0, 1]);
    const b = this.num(id, 'b', 0.5);
    return expand('op', c1.map((x, i) => x * b + c2[i] * (1 - b)), RGB);
  }

  pairBlend(id) {
    const w = this.num(id, 'w', 1);
    // 入力の成分は「軸 → 番号」の順の名前（itx1・irz2 など）。3 つ組（it1）の接続・値もある
    const g = this.byId.get(id);
    const inputs = g.inputs || {}, attrs = g.attrs || {};
    const tri = (b, k, angle) => {
      const whole = this.vec(id, `${b}${k}`);
      return XYZ.map((ax, i) => {
        const key = `${b}${ax}${k}`;
        if (inputs[key]) return this.num(id, key, 0);
        if (typeof attrs[key] === 'number') return attrs[key] * (angle ? D2R : 1);
        return whole[i];
      });
    };
    const t1 = tri('it', 1, false), t2 = tri('it', 2, false);
    const r1 = tri('ir', 1, true), r2 = tri('ir', 2, true);
    // 成分ごとのモード: 0 = 混ぜる、1 = 入力 1 だけ、2 = 入力 2 だけ
    const mode = (name) => Math.round(this.num(id, name, 0));
    const pick = (a, b, m) => (m === 1 ? a : m === 2 ? b : a * (1 - w) + b * w);
    const ot = XYZ.map((ax, i) => pick(t1[i], t2[i], mode(`t${ax}m`)));
    let or;
    const rotMode = Math.round(this.num(id, 'rm', 0));
    if (rotMode === 1 || rotMode === 2) {                  // 回転は入力 1（または 2）だけ
      or = (rotMode === 1 ? r1 : r2).slice();
    } else if (Math.round(this.num(id, 'ri', 0)) === 1) {        // 四元数で補間
      // 入力と出力の回転は、動かされるノードの回転順（.ro。Autodesk の技術資料「pairBlend」の rotateOrder）
      const order = THREE_ORDER[Math.round(this.num(id, 'ro', 0))] || 'ZYX';
      const quat = (r) => new Quaternion().setFromEuler(_e.set(r[0], r[1], r[2], order));
      const q = quat(r1).slerp(quat(r2), w);
      const e = new Euler().setFromQuaternion(q, order);
      or = [e.x, e.y, e.z];
    } else {
      // 回転のモードは .rm（3 軸に共通。Maya の技術資料）で、ここでは混ぜる（0）。
      // 古いサンプルの軸ごとの名前（.rxm など）があればそれを使う
      or = XYZ.map((ax, i) => {
        const own = `r${ax}m`;
        return pick(r1[i], r2[i], (g.inputs && g.inputs[own]) || (g.attrs && own in g.attrs) ? mode(own) : 0);
      });
    }
    return expandInto(expand('ot', ot, XYZ), 'or', or, XYZ);
  }
}
