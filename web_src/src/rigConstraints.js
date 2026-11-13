// RigEvaluator のコンストレイントの評価（point・orient・parent・scale・poleVector・aim・lookAt）。rig.js から分けたもの
// （整備計画の D5）。メソッドは RigEvaluator.prototype に足す（installMethods）ので、this は RigEvaluator
import { Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { composeLocalMatrix, decomposeMaya, mayaEuler } from './animation.js';
import {
  D2R, EPS, IDENTITY, R2D, XYZ, _m, _q, _v, constraintQuat, eulerQuat, expand, expandInto, positionOf, radQuat, rotationOf,
} from './rig.js';

/** クラスのメソッド（constructor 以外）を、別のクラスのプロトタイプに写す */
export function installMethods(target, source) {
  for (const k of Object.getOwnPropertyNames(source.prototype)) {
    if (k !== 'constructor') Object.defineProperty(target.prototype, k, Object.getOwnPropertyDescriptor(source.prototype, k));
  }
}

export class ConstraintMethods {
  /** 出力（ct・cr・cs）は、動かされるノードの親の空間・内部単位 */
  constraint(g) {
    const id = g.id;
    // ターゲット。ターゲットの入力が DAG ノードでない（ロケーターのシェイプの worldPosition から位置だけが
    // つながるなど）ときは ni = -1 で、位置はコンストレイントに入ってくる値から求める（targetPosition）。
    // 向き・スケールを使うコンストレイント（orient・parent・scale）では、そのターゲットは使えない
    const usesOrientation = g.type === 'orientConstraint' || g.type === 'parentConstraint' || g.type === 'scaleConstraint';
    const targets = [];
    for (const t of g.targets || []) {
      const tg = this.byId.get(t.node);
      if (!tg || (tg.dag < 0 && usesOrientation)) continue;
      const w = this.num(id, `tg[${t.index}].tw`, 1);
      if (w > 0) targets.push({ ni: tg.dag, index: t.index, w });
    }
    const total = targets.reduce((s, t) => s + t.w, 0);
    if (total <= EPS) return this.constraintRest(g);
    const driven = g.driven;
    // 動かされるノードの親の空間（Maya の constraintParentInverseMatrix ← .parentInverseMatrix。offsetParentMatrix を含む）
    const pw = driven >= 0 ? this.parentSpace(driven) : IDENTITY;
    const pwInv = pw.clone().invert();
    const pivot = (t) => (t.ni < 0 ? this.targetPosition(id, t.index) : this.pivotWorld(t.ni));
    const weighted = (fn) => {
      const acc = new Vector3();
      for (const t of targets) acc.addScaledVector(fn(t), t.w / total);
      return acc;
    };
    const toTranslate = (pWorld) => {
      const p = pWorld.clone().applyMatrix4(pwInv);
      const o = g.type === 'pointConstraint' ? this.vec(id, 'o') : [0, 0, 0];
      const crp = this.vec(id, 'crp'), crt = this.vec(id, 'crt');
      return [p.x + o[0] - crp[0] - crt[0], p.y + o[1] - crp[1] - crt[1], p.z + o[2] - crp[2] - crt[2]];
    };
    // ワールドの回転 → 動かされるノードの回転の値（ラジアン）。Maya のコンストレイントは rotateAxis を使わない。
    // compensate: orient・aim の scaleCompensate（動かされるジョイントの親のスケールの打ち消し .is を親の空間に入れる）。
    // ref: 角度の選び方の基準（度。parentConstraint は前回の値 .lr に近い角度を選ぶ）
    const toRotate = (qWorld, opts = {}) => {
      let P = pw;
      if (opts.compensate && this.num(id, 'ssc', 1) >= 0.5) {
        const is = this.isScaleOf(driven);
        if (is) P = pw.clone().multiply(new Matrix4().makeScale(is[0] ? 1 / is[0] : 1, is[1] ? 1 / is[1] : 1, is[2] ? 1 / is[2] : 1));
      }
      const local = rotationOf(P).invert().multiply(qWorld);
      return this.localEuler(driven, local, { noRA: true, ref: opts.ref }).map((v) => v * D2R);
    };
    switch (g.type) {
      case 'pointConstraint':
        return expand('ct', toTranslate(weighted((t) => pivot(t))), XYZ);
      case 'poleVectorConstraint': {
        const target = weighted((t) => this.pvcTargetPosition(g, t));
        const start = this.pvcStartPosition(g);
        const v = target.sub(start);
        // 動かされるノード（IK ハンドル）の親の空間へ（スケール・反転を含む 3x3。IK 側の変換と打ち消し合う）
        return expand('ct', v.applyMatrix3(new Matrix3().setFromMatrix4(pwInv)).toArray(), XYZ);
      }
      case 'orientConstraint': {
        // ターゲットの向き = targetParentMatrix · 親のスケールの打ち消し · jointOrient · rotate（rotateAxis は入力にない）
        const o = this.vec(id, 'o');
        const q = constraintQuat(targets.map((t) => ({ q: rotationOf(this.targetMatrix(t.ni, false, true)), w: t.w })),
          Math.round(this.num(id, 'int', 1)));
        return expand('cr', toRotate(q.multiply(radQuat(o)), { compensate: true }), XYZ);
      }
      case 'parentConstraint': {
        // ターゲットの空間は、ターゲットの回転ピボット（原点ではない）を原点にする（Maya と同じ。cluster のハンドルのように
        // ピボットが原点から離れたターゲットで、動かされるノードのピボットがターゲットのピボットに付く）。
        // 向きは targetParentMatrix · 親のスケールの打ち消し（targetInverseScale）· jointOrient · rotate、オフセットの移動は
        // ターゲットのスケール（targetScale）込み
        const list = targets.map((t) => {
          const tot = this.vec(id, `tg[${t.index}].tot`), tor = this.vec(id, `tg[${t.index}].tor`);
          const m = this.targetMatrix(t.ni, true, this.num(id, `tg[${t.index}].tsc`, 1) >= 0.5)
            .multiply(_m.makeTranslation(tot[0], tot[1], tot[2]))
            .multiply(_m.makeRotationFromQuaternion(radQuat(tor, _q)));
          return { m, w: t.w };
        });
        const pos = new Vector3();
        for (const { m, w } of list) pos.addScaledVector(positionOf(m, _v.clone()), w / total);
        const q = constraintQuat(list.map(({ m, w }) => ({ q: rotationOf(m), w })), Math.round(this.num(id, 'int', 1)));
        const lr = g.attrs && Array.isArray(g.attrs.lr) ? g.attrs.lr : null;
        return expandInto(expand('ct', toTranslate(pos), XYZ), 'cr', toRotate(q, { ref: lr }), XYZ);
      }
      case 'aimConstraint': case 'lookAt': {
        // lookAt（カメラとエイム）も同じ。twist で視線のまわりに回す（world up がシーンの上・ベクトルのとき）
        // 動かされるノードの回転ピボットから、ターゲットの方へ aim ベクトル（.a）を向け、up ベクトル（.u）を
        // world up（.wut: 0 シーンの上・1 オブジェクト・2 オブジェクトの回転・3 ベクトル・4 なし）の側に向ける
        const rest = this.rest(driven) || {};
        const tt = driven >= 0 ? this.chan(driven, 't').t : [0, 0, 0];
        const add = (a, b) => (b ? [a[0] + b[0], a[1] + b[1], a[2] + b[2]] : a);
        const pd = new Vector3(...add(add(tt, rest.rp), rest.rpt)).applyMatrix4(pw);
        const dir = weighted((t) => pivot(t)).sub(pd);
        if (dir.lengthSq() < EPS) return null;
        dir.normalize();
        const a = new Vector3(...this.vec(id, 'a', [1, 0, 0])).normalize();
        const u = new Vector3(...this.vec(id, 'u', [0, 1, 0]));
        const wut = Math.round(this.num(id, 'wut', 3));
        const wu = new Vector3(...this.vec(id, 'wu', [0, 1, 0]));
        let up = null;
        if (wut === 0) up = (this.clip.raw.upAxis || 'y') === 'z' ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
        else if (wut === 1) up = positionOf(this.mat(id, 'wum')).sub(pd);
        else if (wut === 2) up = wu.clone().applyMatrix4(new Matrix4().extractRotation(this.mat(id, 'wum')));
        else if (wut === 3) up = wu;
        let q;
        const uPerp = u.clone().addScaledVector(a, -u.dot(a));
        const upPerp = up ? up.clone().addScaledVector(dir, -up.dot(dir)) : null;
        if (!up || uPerp.lengthSq() < EPS || upPerp.lengthSq() < EPS) {
          // up を決められない（aim と up が平行・world up なし）: 最短の回転。Maya は親の空間で、回転 0 の向きから
          // 測る（保存時の姿勢で確かめた）。再現チェックでは、ほかの候補（aimMode）も試す
          const mode = this.aimMode || 'parent';
          if (mode === 'world') q = new Quaternion().setFromUnitVectors(a, dir);
          else {
            const pr = rotationOf(pw);
            const dl = dir.clone().applyQuaternion(pr.clone().invert());          // 親の空間のターゲットの向き
            // 'parent': 回転 0 の向き（jointOrient を含む）から、'rest': コンストレイントのレスト回転（.rsrr。ラジアン → 度）から
            const rr = mode === 'rest' ? this.vec(id, 'rsrr', [0, 0, 0]).map((v) => v * R2D) : [0, 0, 0];
            const base = rotationOf(composeLocalMatrix({ ...rest, t: [0, 0, 0], s: [1, 1, 1], r: rr, ra: undefined, opm: undefined }, null, new Matrix4()));
            const qa = new Quaternion().setFromUnitVectors(a.clone().applyQuaternion(base), dl);
            q = pr.multiply(qa.multiply(base));
          }
        } else {
          const frame = (x, y) => new Matrix4().makeBasis(x, y, x.clone().cross(y));
          uPerp.normalize(); upPerp.normalize();
          q = new Quaternion().setFromRotationMatrix(frame(dir, upPerp).multiply(frame(a, uPerp).transpose()));
        }
        if (g.type === 'lookAt' && (wut === 0 || wut === 3)) {
          // ラジアン。Maya の正の twist は、視線（カメラ → ターゲット）のまわりに左ねじの向き（Maya と見比べて確かめた）
          const tw = this.num(id, this.attrName(g, ['tws', 'twist']), 0);
          if (Math.abs(tw) > 1e-12) q = new Quaternion().setFromAxisAngle(dir, -tw).multiply(q);
        }
        return expand('cr', toRotate(q.multiply(radQuat(this.vec(id, 'o'))), { compensate: g.type === 'aimConstraint' }), XYZ);
      }
      case 'scaleConstraint': {
        // Maya の資料: ワールド空間のターゲットのスケールの加重幾何平均。それを親の空間のスケールで割る
        const logs = [0, 0, 0], sign = [0, 0, 0];
        for (const t of targets) {
          decomposeMaya(this.world(t.ni)).s.toArray().forEach((v, k) => {
            logs[k] += (t.w / total) * Math.log(Math.max(Math.abs(v), 1e-12));
            sign[k] += t.w * Math.sign(v);
          });
        }
        const ps = decomposeMaya(pw).s.toArray();
        const o = this.vec(id, 'o', [1, 1, 1]);
        return expand('cs', logs.map((l, k) => (sign[k] < 0 ? -1 : 1) * Math.exp(l) / (ps[k] || 1) * o[k]), XYZ);
      }
      default: return null;
    }
  }

  /**
   * ターゲットのウェイトがすべて 0 のとき: enableRestPosition（.erp）が有効ならレストの値（.rst・.rsrr・.rs。成分は
   * .rtx・.rrx・.rsx など）、無効なら出力しない。.rsrr は角度の属性（ファイルの値は度、接続の値はラジアン）
   */
  constraintRest(g) {
    const id = g.id;
    if (this.num(id, 'erp', 0) < 0.5) return null;
    const rt = this.vec(id, 'rst', [0, 0, 0]), rr = this.vec(id, 'rsrr', [0, 0, 0]);
    switch (g.type) {
      case 'pointConstraint': return expand('ct', rt, XYZ);
      case 'orientConstraint': case 'aimConstraint': return expand('cr', rr, XYZ);
      case 'parentConstraint': return expandInto(expand('ct', rt, XYZ), 'cr', rr, XYZ);
      case 'scaleConstraint': return expand('cs', this.vec(id, 'rs', [1, 1, 1]), XYZ);
      default: return null;
    }
  }

  /**
   * コンストレイントのターゲットの回転ピボットのワールド位置（Maya の式: (translate + rotatePivot + rotatePivotTranslate) ·
   * targetParentMatrix。ターゲットの回転・スケールによらない）。値の材料がないノードはワールド行列の位置
   */
  pivotWorld(ni) {
    if (!this.rest(ni)) return positionOf(this.world(ni));
    const t = this.posedT(ni);
    const rp = this.dagPlug(ni, 'rp'), rpt = this.dagPlug(ni, 'rpt');
    return new Vector3(t[0] + rp[0] + rpt[0], t[1] + rp[1] + rpt[1], t[2] + rp[2] + rpt[2]).applyMatrix4(this.parentSpace(ni));
  }

  /**
   * コンストレイントのターゲットの行列（Maya のコンストレイントの入力から組み立てる。rotateAxis・せん断は入力にない）:
   * 親の空間 · 回転ピボットの位置 · [親のスケールの打ち消し] · jointOrient · rotate · [scale]（three.js の順）
   */
  targetMatrix(ni, withScale, withInverseScale) {
    const rest = this.rest(ni);
    if (!rest) return this.world(ni).clone();
    const c = this.posedChan(ni);                         // ポーズ確認で動かした分も含める（ターゲットを動かすと追従する）
    const m = this.parentSpace(ni).clone().setPosition(this.pivotWorld(ni));
    if (withInverseScale) {
      const is = this.isScaleOf(ni);
      if (is) m.multiply(_m.makeScale(is[0] ? 1 / is[0] : 1, is[1] ? 1 / is[1] : 1, is[2] ? 1 / is[2] : 1));
    }
    if (rest.joint && c.jo) m.multiply(_m.makeRotationFromQuaternion(eulerQuat(c.jo, 0, _q)));
    m.multiply(_m.makeRotationFromQuaternion(eulerQuat(c.r, c.ro || 0, _q)));
    if (withScale) m.multiply(_m.makeScale(c.s[0], c.s[1], c.s[2]));
    return m;
  }

  /**
   * コンストレイントに入ってくる値から求めたターゲットの位置（Maya の式: (targetTranslate + targetRotatePivot +
   * targetRotateTranslate) を targetParentMatrix でワールドへ。つながっていない値はファイルの値か 0・単位行列）
   */
  targetPosition(id, index) {
    const b = `tg[${index}]`;
    const [tt, trp, trt] = ['tt', 'trp', 'trt'].map((k) => this.vec(id, `${b}.${k}`));
    return new Vector3(tt[0] + trp[0] + trt[0], tt[1] + trp[1] + trt[1], tt[2] + trp[2] + trt[2])
      .applyMatrix4(this.mat(id, `${b}.tpm`));
  }

  /**
   * 親の空間での回転（四元数）を、ノードの回転の値（度）にする。
   * joint: 回転部分 = JO · R · RA（three.js の順）、transform: R · RA。
   * opts.noRA: rotateAxis を使わない（Maya のコンストレイントは rotateAxis の入力を持たない）。
   * opts.ref: 角度の選び方の基準（度。Maya のコンストレイントは前回の値（.lr）に近い角度を選ぶ）。なければ 0 に近い方
   */
  localEuler(ni, localQuat, opts = {}) {
    const rest = this.rest(ni) || { joint: false, ro: 0 };
    let q = localQuat.clone();
    if (rest.joint && rest.jo) q = eulerQuat(rest.jo, 0).invert().multiply(q);
    if (rest.ra && !opts.noRA) q.multiply(eulerQuat(rest.ra, 0).invert());
    const e = mayaEuler(q, rest.ro || 0, opts.ref ? opts.ref.map((v) => v * D2R) : null);
    return [e[0] * R2D, e[1] * R2D, e[2] * R2D];
  }
}
