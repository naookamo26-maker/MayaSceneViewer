// RigEvaluator の IK（回転プレーン・シングルチェーン・多関節・スプライン IK）と、その再現チェック。rig.js から分けたもの
// （整備計画の D5）。メソッドは RigEvaluator.prototype に足す（rig.js の installMethods）ので、this は RigEvaluator
import { Matrix3, Matrix4, Quaternion, Vector3 } from 'three';
import { composeLocalMatrix } from './animation.js';
import { derivativeAt, domain, parseNurbsCurve, pointAtDistance, pointAtLength, polyline } from './curve.js';
import {
  AIM_MODES, D2R, EPS, IDENTITY, IK_VARIANTS, NULL, R2D, XYZ, closestOnPolyline, fkChain, ikLocals, positionOf, rotateAlong,
  rotationOf, solveChain, solveIKCore, solveOneBone, variantLabel,
} from './rig.js';

export class IkMethods {
  /** IK ハンドル（グラフの id）を解き、開始ジョイントと中間ジョイントの回転（度）を返す */
  solveIK(id) {
    return this.memo(this.cache.ik, this.keep.ik, id, () => this.solveIKUncached(id), NULL, () => `ik ${id}`);
  }

  solveIKUncached(id) { return solveIKCore(this, id); }
  solveOneBone(id) { return solveOneBone(this, id); }
  fkChain(chain) { return fkChain(this, chain); }
  ikLocals(id, chain, P, Qnew) { return ikLocals(this, id, chain, P, Qnew); }
  rotateAlong(fk, q, delta, twistOf = null) { return rotateAlong(this, fk, q, delta, twistOf); }
  solveChain(id) { return solveChain(this, id); }

  /**
   * スプライン IK: ジョイントをカーブに沿って並べる（骨の長さを保ち、次のジョイントはカーブ上で骨の長さだけ離れた点。
   * カーブより長いチェーンは、カーブを終端の接線の向きにまっすぐ延ばした線の上）。
   * rootOnCurve なら開始ジョイントをカーブの始点（+ オフセット）に置く（ikBlend で FK の位置と混ぜる）。
   * 向きは最小の回転 + ひねり（roll は全体、twist は終端に向けて配分）。上級ツイスト（dtce）なら world up に合わせる
   */
  solveSpline(id) {
    const g = this.byId.get(id);
    const chain = g.ik.chain;
    if (chain.some((ni) => !this.rest(ni))) return null;
    const curve = this.plug(id, 'ic');
    if (!curve || !curve.isCurve) return null;
    const fk = this.fkChain(chain);
    const { pos } = fk;
    const n = pos.length;
    const lens = [];
    for (let i = 0; i < n - 1; i++) lens.push(pos[i + 1].distanceTo(pos[i]));
    const poly = polyline(curve);
    const roc = this.num(id, 'roc', 0) >= 0.5;
    let start, seg = 0;
    let shift = null;
    if (roc) {
      const s = Math.min(Math.max(this.num(id, 'off', 0), 0), 1) * poly.total;
      start = pointAtLength(poly, s);
      while (seg < poly.len.length - 2 && poly.len[seg + 1] < s) seg++;
    } else {
      // rootOnCurve オフ: 開始ジョイントはそのまま。開始ジョイントにいちばん近いカーブ上の点から並べ、
      // 開始ジョイントとその点のずれの分だけ、チェーン全体をずらす（カーブから離れても、カーブの形をなぞる）
      let best = Infinity;
      for (let k = 0; k < poly.pts.length - 1; k++) {
        const a = poly.pts[k], ab = new Vector3().subVectors(poly.pts[k + 1], a);
        const t = ab.lengthSq() > 0 ? Math.max(0, Math.min(1, new Vector3().subVectors(pos[0], a).dot(ab) / ab.lengthSq())) : 0;
        const c = a.clone().addScaledVector(ab, t);
        const d = c.distanceToSquared(pos[0]);
        if (d < best) { best = d; start = c; seg = k; }
      }
      if (!start) start = pos[0].clone();
      shift = new Vector3().subVectors(pos[0], start);
    }
    const q = [start];
    const beyond = this.splineBeyond(curve, poly);
    for (let i = 0; i < n - 1; i++) {
      const r = pointAtDistance(poly, q[i], lens[i], seg, curve);
      if (r) { q.push(r.point); seg = r.seg; } else q.push(beyond(q[i], lens[i]));
    }
    if (shift) for (const p of q) p.add(shift);
    const bones = n - 1;
    const roll = this.num(id, 'rol', 0);
    const advanced = this.num(id, 'dtce', 0) >= 0.5;
    const tw = this.splineTwists(id, bones, advanced);
    let Qnew;
    if (advanced && Math.round(this.num(id, 'dwut', 0)) !== 7) {
      // 上級ツイスト: up ベクトルに合わせた向きに、ロールとひねりの値を足す（Maya の資料: ひねりの値は Roll・Root Twist Mode と
      // 一緒に働き、置き換えない）。ひねりは骨の軸まわり
      Qnew = this.splineAdvancedTwist(id, fk, q, bones).map((qi, i) => {
        const a = roll + tw[i];
        if (Math.abs(a) <= EPS) return qi;
        const dir = new Vector3().subVectors(q[i + 1], q[i]).normalize();
        return new Quaternion().setFromAxisAngle(dir, a).multiply(qi);
      });
    } else {
      // 古い方式（上級ツイストなし・Relative）: 各ジョイントは 1 つ前のジョイントに対してひねる（増分を渡す）
      Qnew = this.rotateAlong(fk, q, new Quaternion(), (i) => (i === 0 ? roll : 0) + tw[i] - (i > 0 ? tw[i - 1] : 0));
    }
    const out = this.ikLocals(id, chain, fk.P, Qnew);
    if (roc) {
      // 開始ジョイントの移動も、回転と同じく ikBlend で FK の値と混ぜる（0 なら FK のまま。カーブに付けない）
      const t = start.clone().applyMatrix4(this.parentSpace(chain[0]).clone().invert()).toArray();
      const blend = Math.min(1, Math.max(0, this.num(id, 'ikb', 1)));
      if (blend < 1 - EPS) {
        const fkT = this.chan(chain[0], 'fk').t;
        for (let k = 0; k < 3; k++) t[k] = fkT[k] + (t[k] - fkT[k]) * blend;
      }
      out.set(chain[0], { r: out.get(chain[0]), t });
    }
    return out;
  }

  /**
   * スプライン IK のチェーンがカーブより長いときの、カーブの先のジョイントの置き方。カーブを終端の接線の向きにまっすぐ
   * 延ばした線の上で、1 つ前のジョイント from から骨の長さ len だけ離れた点を返す関数（カーブの上と同じく、骨の長さを
   * 保って線の上に並べる）。終端の接線が求まらなければ（終端の CV が重なるなど）、折れ線の最後の線分の向き
   */
  splineBeyond(curve, poly) {
    const end = poly.pts[poly.pts.length - 1];
    let dir = derivativeAt(curve, domain(curve)[1]);
    if (!(dir.lengthSq() > EPS)) dir = new Vector3().subVectors(end, poly.pts[poly.pts.length - 2]);
    dir.normalize();
    return (from, len) => {
      // |end + s · dir − from| = len を s ≥ 0 で解く（from がカーブの上なら end は球の内側なので必ず解がある）
      const ef = new Vector3().subVectors(end, from);
      const b = dir.dot(ef), disc = b * b - (ef.lengthSq() - len * len);
      if (disc < 0) return from.clone().addScaledVector(dir, len);
      return end.clone().addScaledVector(dir, Math.max(0, -b + Math.sqrt(disc)));
    };
  }

  /**
   * スプライン IK のジョイントごとのひねり（ラジアン。開始から終端の手前まで bones 個。ロールは含めない）。
   * - ひねりの値: ふだんは Twist（終端で合計）。上級ツイストの Start/End（.dtvt 1）は始点・終点の値（.dtse。度）の間。
   *   Ramp（.dtvt 2）はテクスチャを評価できないので 0
   * - 配り方（.twt）: リニア・イーズイン（終端側で多く）・イーズアウト（開始側で多く）・イーズインアウト（中ほどで多く）。
   *   Maya の資料には形の式がないので、2 次・smoothstep で近似する
   * - Root Twist Mode（.rtm）: オフなら開始ジョイントはひねらず（0）、残りに配る。オンなら開始ジョイントも少しひねる
   */
  splineTwists(id, bones, advanced) {
    const EASE = [(u) => u, (u) => u * u, (u) => 1 - (1 - u) * (1 - u), (u) => u * u * (3 - 2 * u)];
    const ease = EASE[Math.round(this.num(id, 'twt', 0))] || EASE[0];
    const rootTwist = this.num(id, 'rtm', 0) >= 0.5;
    const type = advanced ? Math.round(this.num(id, 'dtvt', 0)) : 0;
    const out = [];
    for (let i = 0; i < bones; i++) {
      if (type === 1) {
        const se = this.vec(id, 'dtse', [this.num(id, 'dtst', 0), this.num(id, 'dten', 0)]);
        const u = bones > 1 ? i / (bones - 1) : 1;
        out.push((se[0] + (se[1] - se[0]) * ease(u)) * D2R);
      } else if (type === 2) {
        out.push(0);
      } else {
        const u = rootTwist ? (i + 1) / bones : (bones > 1 ? i / (bones - 1) : 1);
        out.push(this.num(id, 'twi', 0) * ease(u));
      }
    }
    return out;
  }

  /**
   * 上級ツイスト: 骨の向きに forward 軸（.dpa。古いサンプルは .dfa）を、world up に up 軸（.dwua）を向ける。
   * 始点・終点の 2 つを使う種類（.dwut 2・4・6）は、始点と終点の up のなす角（ひねり）をチェーンに沿って均等に配る
   * （up のベクトルを直線で補間すると、向きの差が大きいときに途中で潰れて反転するため）。
   * up 軸の Closest は、＋と−のうち world up に近い方を使う（最小の回転で並べたときの向きで決める）
   */
  splineAdvancedTwist(id, fk, q, bones) {
    const AXES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const UP = [[0, 1, 0], [0, -1, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1], [0, 0, 1], [1, 0, 0], [-1, 0, 0], [1, 0, 0]];
    const upAxis = Math.round(this.num(id, 'dwua', 3));          // Maya の既定値は 3（+Z）
    const closest = upAxis === 2 || upAxis === 5 || upAxis === 8;
    const fa = new Vector3(...(AXES[Math.round(this.num(id, 'dpa', this.num(id, 'dfa', 0)))] || AXES[0]));
    const ua = new Vector3(...(UP[upAxis] || UP[0]));
    const type = Math.round(this.num(id, 'dwut', 0));
    const vecIn = (attr, mat) => {
      const v = new Vector3(...this.vec(id, attr, [0, 1, 0]));
      return mat ? v.applyMatrix4(new Matrix4().extractRotation(this.mat(id, mat))) : v;
    };
    const objPos = (mat) => positionOf(this.mat(id, mat));
    const sceneUp = (this.clip.raw.upAxis || 'y') === 'z' ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
    const dirs = [];
    for (let i = 0; i < bones; i++) dirs.push(new Vector3().subVectors(q[i + 1], q[i]).normalize());
    // ジョイントごとの world up（始点・終点を使う種類は両端だけ）
    const upOf = (i, start) => {
      const p = q[i];
      switch (type) {
        case 1: return objPos('dwum').sub(p);
        case 2: return objPos(start ? 'dwum' : 'dwue').sub(p);
        case 3: return vecIn('dwuv', 'dwum');
        case 4: return start ? vecIn('dwuv', 'dwum') : vecIn('dwve', 'dwue');
        case 5: return vecIn('dwuv');
        case 6: return vecIn(start ? 'dwuv' : 'dwve');
        default: return sceneUp.clone();
      }
    };
    const perp = (v, dir) => {
      v.addScaledVector(dir, -v.dot(dir));
      return v.lengthSq() < EPS ? null : v.normalize();
    };
    const ups = new Array(bones).fill(null);
    if ((type === 2 || type === 4 || type === 6) && bones > 1 && this.ikVariant && this.ikVariant.splineInterp === 'lerp') {
      // （再現チェックの候補）始点と終点の up のベクトルを直線で補間する
      const a = upOf(0, true), b = upOf(bones - 1, false);
      for (let i = 0; i < bones; i++) ups[i] = perp(a.clone().lerp(b, i / (bones - 1)), dirs[i]);
    } else if ((type === 2 || type === 4 || type === 6) && bones > 1) {
      // 始点の up を骨に沿って最小の回転で運び、終点の up とのずれの角度を、始点からの長さに比例して配る
      const u0 = perp(upOf(0, true), dirs[0]);
      const u1 = perp(upOf(bones - 1, false), dirs[bones - 1]);
      if (u0) {
        const carried = [u0.clone()];
        for (let i = 1; i < bones; i++) {
          carried.push(perp(carried[i - 1].clone().applyQuaternion(new Quaternion().setFromUnitVectors(dirs[i - 1], dirs[i])), dirs[i])
            || carried[i - 1].clone());
        }
        const last = carried[bones - 1];
        const total = u1 ? Math.atan2(dirs[bones - 1].dot(last.clone().cross(u1)), last.dot(u1)) : 0;
        const along = [0];
        for (let i = 1; i < bones; i++) along.push(along[i - 1] + q[i].distanceTo(q[i - 1]));
        const span = along[bones - 1] || 1;
        for (let i = 0; i < bones; i++) {
          ups[i] = carried[i].clone().applyQuaternion(new Quaternion().setFromAxisAngle(dirs[i], total * along[i] / span));
        }
      }
    } else {
      for (let i = 0; i < bones; i++) ups[i] = perp(upOf(i, true), dirs[i]);
    }
    const frame = (x, y) => new Matrix4().makeBasis(x, y, x.clone().cross(y));
    const faN = fa.clone().normalize();
    const uaP = ua.clone().addScaledVector(faN, -ua.dot(faN)).normalize();
    const flipped = uaP.clone().negate();
    const minimal = closest ? this.rotateAlong(fk, q, new Quaternion()) : null;
    const out = [];
    for (let i = 0; i < bones; i++) {
      const dir = dirs[i];
      const up = ups[i];
      if (!up) { out.push(new Quaternion().setFromUnitVectors(faN, dir)); continue; }
      // Closest: 最小の回転で並べたときの up 軸が world up と逆向きなら、− の軸を world up に向ける
      const axis = closest && uaP.clone().applyQuaternion(minimal[i]).dot(up) < 0 ? flipped : uaP;
      out.push(new Quaternion().setFromRotationMatrix(frame(dir, up).multiply(frame(faN, axis).transpose())));
    }
    return out;
  }

  /** 極ベクトルを解釈する空間（ふだんはハンドルの親。再現チェックでは候補を切り替える） */
  pvSpace(handleNi, startNi) {
    const sp = this.ikVariant ? this.ikVariant.pvSpace : null;
    if (sp === 'world') return IDENTITY;
    if (sp === 'start') return this.parentSpace(startNi);
    return this.parentSpace(handleNi);
  }

  /**
   * poleVectorConstraint の開始の位置: Maya と同じく、コンストレイントの属性 (crp + crt) を pivotSpace（ps）で
   * ワールドへ移す（ふつうは crp ← 開始ジョイントの t、ps ← その parentMatrix）。crp・ps のどちらも
   * 接続・値がなければ、開始ジョイント（pivot）の位置
   */
  pvcStartPosition(g) {
    const inputs = g.inputs || {};
    const attrs = g.attrs || {};
    const has = (k) => Object.keys(inputs).some((x) => x === k || x.startsWith(k)) || Object.keys(attrs).some((x) => x === k || x.startsWith(k));
    if (has('crp') || has('ps') || has('crt')) {
      const crp = this.vec(g.id, 'crp'), crt = this.vec(g.id, 'crt');
      return new Vector3(crp[0] + crt[0], crp[1] + crt[1], crp[2] + crt[2]).applyMatrix4(this.mat(g.id, 'ps'));
    }
    return g.pivot >= 0 ? this.pivotPosition(g.pivot) : new Vector3();
  }

  /** poleVectorConstraint のターゲットの位置: (tt + trp + trt) を targetParentMatrix（tpm）でワールドへ（Maya と同じ） */
  pvcTargetPosition(g, t) {
    const k = t.index;
    const inputs = g.inputs || {};
    if (inputs[`tg[${k}].tt`] || inputs[`tg[${k}].tpm`] || inputs[`tg[${k}].ttx`]) {
      const tt = this.vec(g.id, `tg[${k}].tt`), trp = this.vec(g.id, `tg[${k}].trp`), trt = this.vec(g.id, `tg[${k}].trt`);
      return new Vector3(tt[0] + trp[0] + trt[0], tt[1] + trp[1] + trt[1], tt[2] + trp[2] + trt[2]).applyMatrix4(this.mat(g.id, `tg[${k}].tpm`));
    }
    const r = this.rest(t.ni);
    const rp = r && r.rp ? r.rp : [0, 0, 0];
    return new Vector3(rp[0], rp[1], rp[2]).applyMatrix4(this.world(t.ni));
  }

  /** 極ベクトル（ハンドルの親の空間の値）→ ワールド（スケール・反転を含む 3x3。poleVectorConstraint の変換と打ち消し合う） */
  pvWorld(pvLocal, handleNi, startNi) {
    const v = new Vector3(pvLocal[0], pvLocal[1], pvLocal[2]);
    const M = this.pvSpace(handleNi, startNi);
    const conv = this.ikVariant ? this.ikVariant.pvConvert : null;
    // （再現チェックの候補）IK 側は親の回転だけで戻す: rot = 反転を除いた回転、reflect = 反転を残した回転
    if (conv === 'rot') return v.applyQuaternion(rotationOf(M));
    if (conv === 'reflect') return v.applyMatrix4(new Matrix4().extractRotation(M));
    return v.applyMatrix3(new Matrix3().setFromMatrix4(M));
  }

  /** ひねりの向き（ふだんは 1。再現チェックでは −1・0 も試す） */
  twistSign() {
    const t = this.ikVariant ? this.ikVariant.twistSign : undefined;
    return typeof t === 'number' ? t : 1;
  }

  /**
   * ファイルに書かれた値で組み立てたローカル行列（保存したときの Maya の答え。再現チェックに使う）。
   * 移動・スケールが接続で決まる（ファイルに値がない）ときは評価した値を使う。回転が接続で決まるときは比べられないので null
   */
  fileRestLocal(ni) {
    const rest = this.rest(ni);
    if (!rest) return null;
    const g = this.dagGraph.get(ni);
    const keys = g && g.inputs ? Object.keys(g.inputs) : [];
    if (keys.some((k) => /^r[xyz]?$/.test(k))) return null;
    // キー（アニメーションカーブ）で決まる成分もファイルに値がないので、評価した値を使う（カーブの評価は確か）
    const e = this.clip.byNode.get(ni);
    const curve = new Set((e ? e.channels : []).map((c) => c.base));
    const c = { ...rest };
    if (curve.has('r')) c.r = this.chan(ni, 'fk').r;
    if (curve.has('t') || keys.some((k) => /^t[xyz]?$/.test(k))) c.t = this.chan(ni, 't').t;
    if (curve.has('s') || keys.some((k) => /^s[xyz]?$/.test(k))) c.s = this.chan(ni).s;
    if (keys.includes('opm')) c.opm = this.chan(ni).opm;           // 接続で決まる offsetParentMatrix
    return composeLocalMatrix(c, this.isScaleOf(ni), new Matrix4());
  }

  /** IK のチェーンの、評価した回転とファイルの回転の比較（verifySaved の 1 ハンドル分） */
  compareChain(g, fileLocal, tol) {
    const chain = g.ik.chain;
    const joints = [];
    let parentFile = this.parentWorld(chain[0]);
    let endFile = null;
    const filePos = [];
    const fileW = [];
    for (let k = 0; k < chain.length; k++) {
      const ni = chain[k];
      const file = fileLocal(ni);
      if (!file) break;
      const Wf = parentFile.clone().multiply(file);
      filePos.push(positionOf(Wf));
      fileW.push(Wf);
      if (k === chain.length - 1) { endFile = Wf; break; }
      const We = this.world(ni);
      const qf = rotationOf(Wf), qe = rotationOf(We);
      const d = qe.clone().multiply(qf.clone().invert());                      // ファイル → 評価 の回転
      if (d.w < 0) { d.x = -d.x; d.y = -d.y; d.z = -d.z; d.w = -d.w; }
      const angle = 2 * Math.acos(Math.min(1, d.w)) * R2D;
      // 骨の向き（次のジョイントへ）のまわりの成分（ねじれ）と、それ以外（曲がり）に分ける
      const nextLocal = fileLocal(chain[k + 1]);
      const bone = nextLocal ? new Vector3().setFromMatrixPosition(nextLocal).applyQuaternion(qf).normalize() : null;
      let roll = 0, bend = angle;
      if (bone && bone.lengthSq() > EPS) {
        const proj = bone.clone().multiplyScalar(new Vector3(d.x, d.y, d.z).dot(bone));
        const twist = new Quaternion(proj.x, proj.y, proj.z, d.w).normalize();
        roll = 2 * Math.atan2(new Vector3(twist.x, twist.y, twist.z).dot(bone), twist.w) * R2D;
        if (roll > 180) roll -= 360;
        if (roll < -180) roll += 360;
        const swing = d.clone().multiply(twist.clone().invert());
        bend = 2 * Math.acos(Math.min(1, Math.abs(swing.w))) * R2D;
      }
      const position = positionOf(Wf).distanceTo(positionOf(We));
      joints.push({ node: ni, name: this.sceneNodes[ni].name, angle, roll, bend, position, ok: angle <= tol });
      parentFile = Wf;
    }
    // ファイルの値の終端と、評価したハンドルの位置の距離（大きければ、ハンドルを動かすリグの側の問題）
    const H = positionOf(this.world(g.dag));
    const reach = endFile ? positionOf(endFile).distanceTo(H) : null;
    // 回転プレーン: ファイルの姿勢の「曲がる向き」（Maya が使った極ベクトル＋ひねり）と、こちらの極ベクトル＋ひねりの差。
    // 大きければ、極ベクトル・ひねりの入力（それを決めるノードの評価）が Maya と違う
    let poleError = null;
    let impliedPv = null;
    if (g.ik.solver === 'ikRPsolver' && filePos.length === chain.length && chain.length >= 3) {
      const A = filePos[0];
      const u = H.clone().sub(A).normalize();
      const side = new Vector3();
      for (let k = 1; k < filePos.length - 1; k++) {
        const v = filePos[k].clone().sub(A);
        side.add(v.addScaledVector(u, -v.dot(u)));
      }
      const pvL = this.vec(g.id, 'pv', [0, 0, 1]);
      const pv = this.pvWorld(pvL, g.dag, chain[0]);
      const pv0 = pv.clone();
      const want = pv.addScaledVector(u, -pv.dot(u));
      if (this.ikVariant && this.ikVariant.side === -1) want.negate();
      const tw = this.num(g.id, 'twi', 0) * this.twistSign();
      if (Math.abs(tw) > EPS) want.applyQuaternion(new Quaternion().setFromAxisAngle(u, tw));
      if (side.lengthSq() > EPS && want.lengthSq() > EPS) {
        side.normalize(); want.normalize();
        poleError = Math.atan2(u.dot(want.clone().cross(side)), want.dot(side)) * R2D;   // want → side の角度（u まわり）
        // Maya の姿勢に合う極ベクトル（ワールド）: こちらの極ベクトルを u まわりに poleError 回したもの
        impliedPv = pv0.applyAxisAngle(u, poleError * D2R);
      }
    }
    // 詳細（ずれの原因を調べるための生の数値。ワールド空間）
    const r3 = (v) => v.toArray().map((x) => Math.round(x * 1e4) / 1e4);
    const evalPos = chain.map((ni) => positionOf(this.world(ni)));
    const lens = (P) => P.slice(1).map((p, k) => Math.round(p.distanceTo(P[k]) * 1e4) / 1e4);
    const detail = {
      fileJoints: filePos.map(r3), evalJoints: evalPos.map(r3), handle: r3(H),
      impliedPv: impliedPv ? r3(impliedPv) : null,
      fileLengths: lens(filePos), evalLengths: lens(evalPos),
      pv: g.ik.solver === 'ikRPsolver'
        ? r3(this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, chain[0]))
        : null,
      twist: Math.round(this.num(g.id, 'twi', 0) * R2D * 1e4) / 1e4,
      ikBlend: this.num(g.id, 'ikb', 1),
      roll: Math.round(this.num(g.id, 'rol', 0) * R2D * 1e4) / 1e4,
      // ikHandle のチャンネルボックスと同じ値（Pole Vector X/Y/Z はハンドルの親の空間。Maya と見比べる用）
      pvAttr: g.ik.solver === 'ikRPsolver' ? this.vec(g.id, 'pv', [0, 0, 1]).map((x) => Math.round(x * 1e4) / 1e4) : null,
      twistInputs: Object.keys(g.inputs || {}).filter((k) => /^(twi|rol|pv[xyz]?)$/.test(k)),
    };
    {
      // ハンドルの親のスケール（反転は負の値）。極ベクトルの空間の変換に関わる
      const hp = this.sceneNodes[g.dag].parent;
      const Pm = this.parentWorld(g.dag);
      const sc = new Vector3(), pq = new Quaternion();
      Pm.decompose(new Vector3(), pq, sc);
      detail.handleParent = { name: hp >= 0 ? this.sceneNodes[hp].name : '（ワールド）',
        scale: sc.toArray().map((x) => Math.round(x * 1e4) / 1e4), mirrored: Pm.determinant() < 0 };
      const sp = this.sceneNodes[chain[0]].parent;
      const Sm = this.parentWorld(chain[0]);
      Sm.decompose(new Vector3(), pq, sc);
      detail.startParent = { name: sp >= 0 ? this.sceneNodes[sp].name : '（ワールド）',
        scale: sc.toArray().map((x) => Math.round(x * 1e4) / 1e4), mirrored: Sm.determinant() < 0 };
    }
    // ジョイントの軸と基準面（開始 → ハンドル と 極ベクトル＋ひねり の面）の法線のなす角（度）。
    // Maya の答え（ファイル）でどれかの軸が 0° / 180° なら、Maya はその軸を基準面の法線にそろえている
    if (g.ik.solver === 'ikRPsolver' && filePos.length) {
      const u = H.clone().sub(filePos[0]).normalize();
      const v = this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, chain[0]);
      v.addScaledVector(u, -v.dot(u));
      const tw = this.num(g.id, 'twi', 0) * this.twistSign();
      if (Math.abs(tw) > EPS) v.applyQuaternion(new Quaternion().setFromAxisAngle(u, tw));
      const nRef = u.clone().cross(v).normalize();
      const nFile = filePos.length >= 3 ? filePos[1].clone().sub(filePos[0]).cross(filePos[2].clone().sub(filePos[1])).normalize() : null;
      const axesTo = (W, n) => [0, 1, 2].map((a) => {
        const ax = new Vector3().setFromMatrixColumn(W, a).normalize();
        return Math.round(Math.acos(Math.max(-1, Math.min(1, ax.dot(n)))) * R2D * 100) / 100;
      });
      detail.axes = chain.slice(0, -1).map((ni, k) => {
        const rest = this.rest(ni) || {};
        const dg = this.dagGraph.get(ni);
        const pa = dg && dg.attrs && Array.isArray(dg.attrs.pa) ? dg.attrs.pa : null;
        const round = (a) => (Array.isArray(a) ? a.map((x) => Math.round(x * 1e3) / 1e3) : null);
        return {
          name: this.sceneNodes[ni].name,
          fileToRef: fileW[k] ? axesTo(fileW[k], nRef) : null,
          evalToRef: axesTo(this.world(ni), nRef),
          fileToChain: fileW[k] && nFile ? axesTo(fileW[k], nFile) : null,
          r: round(rest.r), jo: round(rest.jo), ra: round(rest.ra), pa: round(pa), ro: rest.ro ?? 0,
        };
      });
    }
    if (g.ik.solver === 'ikSplineSolver') detail.spline = this.splineDetail(g, filePos, evalPos);
    return { joints, reach, poleError, detail, error: joints.reduce((m, j) => Math.max(m, j.angle), 0) };
  }

  /**
   * スプライン IK の再現チェックの詳細: Maya の答え（ファイルのジョイントの位置）が、こちらのカーブの上にあるか。
   * 上にあれば、カーブは Maya と同じで、ずれはジョイントの並べ方（ソルバー）の違い。離れていれば、カーブの形・位置の違い
   */
  splineDetail(g, filePos, evalPos) {
    const c = this.plug(g.id, 'ic');
    if (!c || !c.isCurve) return { missing: true };
    const { pts, total } = polyline(c, 64);
    const seg = (p, a, b) => {
      const ab = b.clone().sub(a);
      const t = ab.lengthSq() > 0 ? Math.max(0, Math.min(1, p.clone().sub(a).dot(ab) / ab.lengthSq())) : 0;
      return p.distanceTo(a.clone().addScaledVector(ab, t));
    };
    const toCurve = (p) => {
      let best = Infinity;
      for (let k = 1; k < pts.length; k++) best = Math.min(best, seg(p, pts[k - 1], pts[k]));
      return best;
    };
    const r4 = (x) => Math.round(x * 1e4) / 1e4;
    const r3 = (v) => v.toArray().map(r4);
    const chainLength = filePos.slice(1).reduce((sum, p, k) => sum + p.distanceTo(filePos[k]), 0);
    return {
      curveLength: r4(total),
      chainLength: r4(chainLength),
      start: r3(pts[0]),
      end: r3(pts[pts.length - 1]),
      cvs: c.cvs.length,
      degree: c.degree,
      fileToCurve: filePos.map((p) => r4(toCurve(p))),
      evalToCurve: evalPos.map((p) => r4(toCurve(p))),
      rootToStart: filePos.length ? r4(filePos[0].distanceTo(pts[0])) : null,
      rootOnCurve: this.num(g.id, 'roc', 0) >= 0.5,
      offset: r4(this.num(g.id, 'off', 0)),
      advancedTwist: this.num(g.id, 'dtce', 0) >= 0.5,
      curveFrom: this.curveSource(g),
      chain: this.curveChain(g),
    };
  }

  /**
   * スプライン IK のカーブの上流（カーブ ← 変形 ← … ← 元のカーブ）を順にたどり、それぞれの出力のカーブの始点・終点を並べる。
   * wire は、ワイヤー（dw）とベースワイヤー（bw）の位置・差（ワイヤーがどれだけ動いたか）・影響範囲・エンベロープも出す
   */
  curveChain(g) {
    return this.chainFrom((g.inputs || {}).ic, 0);
  }

  /** カーブの出力 src（{ node, attr }）から上流へたどる（curveChain）。depth 0 では wire のワイヤーの上流（driver）もたどる */
  chainFrom(src, depth) {
    const r3 = (v) => v.toArray().map((x) => Math.round(x * 1e3) / 1e3);
    const ends = (c) => (c && c.isCurve ? { cvs: c.cvs.length, start: r3(c.cvs[0]), end: r3(c.cvs[c.cvs.length - 1]) } : null);
    const steps = [];
    const seen = new Set();
    while (src && !seen.has(src.node) && steps.length < 40) {
      seen.add(src.node);
      const n = this.byId.get(src.node);
      if (!n) { steps.push({ name: src.node, type: '?', attr: src.attr, missing: true }); break; }
      const step = { name: n.name, type: n.type, attr: src.attr, out: ends(this.plug(src.node, src.attr)) };
      const ins = n.inputs || {};
      let next = null;
      if (n.type === 'nurbsCurve') {
        next = ins.cr || null;
        step.fileShape = !!(n.attrs && n.attrs.cc);
        step.cp = Object.keys(ins).filter((k) => /^cp\[/.test(k)).length;
        step.shown = typeof n.shape === 'number' && n.shape >= 0;   // 画面のカーブを、評価した形で描き直すか
        // CV の位置（Maya の xform -q -ws -t と見比べるため。ws ならワールド、local ならカーブのローカル）
        const c = this.plug(src.node, src.attr);
        if (c && c.isCurve) step.points = c.cvs.map((p) => p.toArray().map((x) => Math.round(x * 10) / 10));
      } else if (n.type === 'groupParts' || n.type === 'transformGeometry') {
        next = ins.ig || null;
        if (n.type === 'transformGeometry') step.txf = ins.txf ? '接続' : ((n.attrs || {}).txf ? 'ファイルの値' : '単位行列');
      } else {
        const k = this.indices(n, /^ip\[(\d+)\]\.ig$/)[0];
        next = k !== undefined ? ins[`ip[${k}].ig`] : null;
      }
      if (n.type === 'cluster') {
        // ハンドル（ma の接続元）の位置と、この cluster が動かした CV（入力と出力の差）
        const name = (x) => (x && this.byId.get(x.node) ? this.byId.get(x.node).name : null);
        step.handle = ins.ma ? `${name(ins.ma) || '?'}.${ins.ma.attr}` : null;
        step.handlePos = r3(new Vector3().setFromMatrixPosition(this.mat(n.id, 'ma')));
        step.pm = ins.pm ? '接続' : ((n.attrs || {}).pm ? 'ファイルの値' : 'なし（単位行列）');
        const k = this.indices(n, /^ip\[(\d+)\]\.ig$/)[0];
        const a = k !== undefined ? this.plug(n.id, `ip[${k}].ig`) : null;
        const b = k !== undefined ? this.plug(n.id, `og[${k}]`) : null;
        if (a && b && a.isCurve && b.isCurve && a.cvs.length === b.cvs.length) {
          step.movedCvs = a.cvs.map((p, v) => [v, Math.round(p.distanceTo(b.cvs[v]) * 1e3) / 1e3]).filter(([, d]) => d > 1e-4);
        }
        const only = k !== undefined ? this.maskOf(n, k) : null;
        step.tagged = only ? [...only].sort((x, y) => x - y) : null;
      }
      if (n.type === 'wire') {
        step.envelope = this.num(n.id, 'en', 1);
        step.wires = this.indices(n, /^dw\[(\d+)\]$/).map((i) => {
          const W = this.plug(n.id, `dw[${i}]`), B = this.plug(n.id, `bw[${i}]`);
          const dw = ins[`dw[${i}]`], bw = ins[`bw[${i}]`];
          const name = (x) => (x && this.byId.get(x.node) ? this.byId.get(x.node).name : null);
          let moved = null;
          if (W && W.isCurve && B && B.isCurve && W.cvs.length === B.cvs.length) {
            moved = Math.round(Math.max(...W.cvs.map((p, k) => p.distanceTo(B.cvs[k]))) * 1e3) / 1e3;
          }
          // カーブの形の手がかり（ファイルの形があるか・読めるか・作成の入力があるか）
          const shapeOf = (x) => {
            const c = x ? this.byId.get(x.node) : null;
            if (!c) return x ? { inGraph: false } : null;
            const cc = (c.attrs || {}).cc;
            return { inGraph: true, type: c.type, fileShape: !!cc, parsed: !!(cc && parseNurbsCurve(cc)),
              create: !!(c.inputs || {}).cr, createFrom: c.createFrom || null };
          };
          return { index: i, wire: name(dw), base: name(bw), wireShape: ends(W), baseShape: ends(B), moved,
            wireInfo: shapeOf(dw), baseInfo: shapeOf(bw),
            sameCount: !!(W && B && W.isCurve && B.isCurve && W.cvs.length === B.cvs.length),
            dropoff: this.num(n.id, `dds[${i}]`, 1), dropoffInFile: (n.attrs || {})[`dds[${i}]`] !== undefined,
            reach: B && B.isCurve ? this.wireReach(n, B, this.num(n.id, `dds[${i}]`, 1)) : null,
            driver: depth < 1 && dw ? this.chainFrom(dw, depth + 1) : null };
        });
        // 変形するカーブを、wire が実際にどれだけ動かしたか（入力と出力の CV の最大の差。ワールド空間）
        const k = this.indices(n, /^ip\[(\d+)\]\.ig$/)[0];
        const inp = k !== undefined ? this.wireInput(n, k) : null;
        const og = k !== undefined ? this.plug(n.id, `og[${k}]`) : null;
        if (inp && og && og.isCurve && og.cvs.length === inp.world.length) {
          step.deformed = Math.round(Math.max(...og.cvs.map((p, v) => p.clone().applyMatrix4(inp.Wg).distanceTo(inp.world[v]))) * 1e3) / 1e3;
        }
        const only = k !== undefined ? this.maskOf(n, k) : null;
        if (only) step.tagged = only.size;
      }
      steps.push(step);
      src = next;
    }
    return steps;
  }

  /** wire の変形するカーブの CV と、ベースワイヤー B との距離（影響範囲 dds の中にある CV の数・一番近い・一番遠い） */
  wireReach(n, B, dds) {
    const k = this.indices(n, /^ip\[(\d+)\]\.ig$/)[0];
    const inp = k !== undefined ? this.wireInput(n, k) : null;
    if (!inp) return null;
    const pb = polyline(B, 32).pts;
    const ds = inp.world.map((p) => closestOnPolyline(pb, p).d);
    const r = (x) => Math.round(x * 1e3) / 1e3;
    return { cvs: ds.length, inside: ds.filter((d) => d < dds).length, nearest: r(Math.min(...ds)), farthest: r(Math.max(...ds)) };
  }

  /** スプライン IK のカーブ（ic）が、どのノードから来ているか（カーブの名前と、形を決める入力） */
  curveSource(g) {
    const src = (g.inputs || {}).ic;
    if (!src) return null;
    const cg = this.byId.get(src.node);
    if (!cg) return null;
    const ins = Object.entries(cg.inputs || {}).filter(([k]) => k === 'cr' || /^cp\[/.test(k)).map(([k, v]) => {
      const sg = this.byId.get(v.node);
      return `${k} ← ${sg ? sg.name : '?'}（${sg ? sg.type : '?'}）`;
    });
    return { name: cg.name, attr: src.attr, inputs: ins.slice(0, 4), hasFileShape: !!(cg.attrs && cg.attrs.cc) };
  }

  /**
   * 保存時のフレームの再現チェック: IK で回転が決まるジョイントについて、評価した回転とファイルに保存された回転
   * （保存したときに Maya が IK を解いた結果）を比べる。evaluate(clip.current) のあとに呼ぶ。
   * ずれがあれば、解き方の候補（ひねりの向き・極ベクトルの空間・肘の側・スプライン IK のひねりの配り方）を
   * 総当たりで試して、ファイルの値に一番合うものを best に入れる。
   * 戻り値: IK ハンドルごとに { handle, solver, chain, pv（ワールド）, twist（度）, joints, reach, error, best, ok }
   */
  /**
   * 開始ジョイントの親が、ファイルの値（保存時の Maya の答え）からどれだけずれているか。
   * ルートから親までを順に、評価したローカル行列とファイルのローカル行列を比べ、最初にずれるノードも探す
   * （値が接続で決まり、ファイルに値がないノードは比べられないので飛ばす）
   */
  parentDrift(ni, fileLocal, tol, includeSelf = false) {
    const chain = includeSelf ? [ni] : [];
    for (let x = this.sceneNodes[ni].parent; x >= 0; x = this.sceneNodes[x].inheritsTransform !== false ? this.sceneNodes[x].parent : -1) chain.unshift(x);
    if (!chain.length) return null;
    let Wf = new Matrix4();
    let firstBad = null;
    const unchecked = [];
    for (const x of chain) {
      const evalLocal = this.localFile(x);
      const by = this.connectedChannels(x);
      if (by.length) unchecked.push({ name: this.sceneNodes[x].name, by });
      let file = this.rest(x) ? fileLocal(x) : this.staticLocal(x);
      if (!file) file = evalLocal;                                   // 比べられない（回転が接続で決まる）
      Wf = Wf.clone().multiply(file);
      if (!firstBad) {
        const d = rotationOf(evalLocal).clone().multiply(rotationOf(file).clone().invert());
        const ang = 2 * Math.acos(Math.min(1, Math.abs(d.w))) * R2D;
        const pos = positionOf(evalLocal).distanceTo(positionOf(file));
        if (ang > tol || pos > 1e-3) {
          const ik = this.ikJoint.has(x) ? this.byId.get(this.ikJoint.get(x)).name : null;
          firstBad = { name: this.sceneNodes[x].name, angle: ang, position: pos, ik };
        }
      }
    }
    const We = this.world(chain[chain.length - 1]);
    const d = rotationOf(We).clone().multiply(rotationOf(Wf).clone().invert());
    return { name: this.sceneNodes[chain[chain.length - 1]].name, angle: 2 * Math.acos(Math.min(1, Math.abs(d.w))) * R2D,
      position: positionOf(We).distanceTo(positionOf(Wf)), firstBad, unchecked };
  }

  /**
   * 接続で決まるチャンネル（移動・回転・スケール・offsetParentMatrix）と、その接続元（ノード名と型）。
   * これらはファイルに確かな値がないため、再現チェックでは評価した値をそのまま使う（ずれを見つけられない）
   */
  connectedChannels(ni) {
    const g = this.dagGraph.get(ni);
    if (!g || !g.inputs) return [];
    const out = new Map();
    for (const [k, src] of Object.entries(g.inputs)) {
      const m = /^(t|r|s|opm)[xyz]?$/.exec(k);
      if (!m) continue;
      let from;
      if (src.node === undefined) from = 'キー';
      else {
        const sg = this.byId.get(src.node);
        from = sg ? `${sg.name}（${sg.type}）` : '?';
      }
      const label = { t: '移動', r: '回転', s: 'スケール', opm: 'offsetParentMatrix' }[m[1]];
      if (from === 'キー') continue;                                // キーはカーブを正しく評価できる
      if (!out.has(label)) out.set(label, new Set());
      out.get(label).add(from);
    }
    return [...out].map(([what, set]) => ({ what, from: [...set] }));
  }

  /**
   * 極ベクトルを決める poleVectorConstraint のターゲットごとの、ウェイト・計算した位置・ファイルの値とのずれ
   * （そのノード自身と親を、ルートから順に比べて最初にずれるノード）。極ベクトルが接続で決まらなければ null
   */
  poleTargets(g, fileLocal, tol) {
    const inputs = g.inputs || {};
    const src = inputs.pv || inputs.pvx || inputs.pvy || inputs.pvz;
    const cg = src && src.node !== undefined ? this.byId.get(src.node) : null;
    if (!cg) return null;
    if (cg.type !== 'poleVectorConstraint') return { via: `${cg.name}（${cg.type}）`, targets: [] };
    const start = this.pvcStartPosition(cg);
    const offset = this.vec(cg.id, 'o', [0, 0, 0]);
    // 開始の位置の材料（crp・crt・ps）の接続元。つながっていない属性は値
    const srcName = (key) => {
      const src = (cg.inputs || {})[key];
      if (!src) return null;
      if (src.node === undefined) return 'カーブ';
      const sg = this.byId.get(src.node);
      return sg ? `${sg.name}.${src.attr}` : '?';
    };
    const startInputs = {};
    for (const key of ['crp', 'crt', 'ps']) {
      const s2 = srcName(key);
      startInputs[key] = s2 || (key === 'ps' ? '（接続なし）' : `（接続なし: ${this.vec(cg.id, key).map((x) => Math.round(x * 1e4) / 1e4).join(', ')}）`);
    }
    const targets = (cg.targets || []).map((t) => {
      const tg = this.byId.get(t.node);
      if (!tg || tg.dag < 0) return null;
      const ni = tg.dag;
      const pos = this.pvcTargetPosition(cg, { index: t.index, ni });
      return { name: this.sceneNodes[ni].name, weight: this.num(cg.id, `tg[${t.index}].tw`, 1),
        position: pos.toArray().map((x) => Math.round(x * 1e4) / 1e4),
        drift: this.parentDrift(ni, fileLocal, tol, true) };
    }).filter(Boolean);
    return { via: cg.name, start: start ? start.toArray().map((x) => Math.round(x * 1e4) / 1e4) : null, startInputs,
      offset: offset.some((x) => Math.abs(x) > 1e-9) ? offset : null, targets };
  }

  /**
   * IK の入力（極ベクトル・ハンドルの位置・ひねり）が、その IK で回るジョイント（またはその子）に依存しているか（循環）。
   * 循環があると Maya は 1 つ前の評価の値で解くため、保存された姿勢と入力の値が食い違う。
   * 戻り値: { pole, handle, twist } それぞれ、循環が通るジョイントの名前（なければ null）
   */
  chainCycle(g) {
    const rotated = new Set(g.ik.chain.slice(0, -1));
    const MATRIX_PARENT = /^(pm|pim|parentMatrix|parentInverseMatrix)(\[\d+\])?$/;
    const MATRIX_WORLD = /^(wm|wim|worldMatrix|worldInverseMatrix|xm|xformMatrix|wp|worldPosition)(\[\d+\])?/;
    const ROTATE = /^(r[xyz]?|rotate[XYZ]?|m|matrix)$/;
    const search = (seeds) => {
      const seen = new Set();
      const stack = [...seeds];
      while (stack.length) {
        const [kind, key] = stack.pop();
        const tag = `${kind}${key}`;
        if (key === undefined || key < 0 || seen.has(tag)) continue;
        seen.add(tag);
        if (kind === 'w') {                                     // ワールド行列: 自分と親たち
          for (let x = key; x >= 0; x = this.sceneNodes[x].parent) {
            if (rotated.has(x)) return this.sceneNodes[x].name;
            stack.push(['c', x]);
          }
          continue;
        }
        const gg = kind === 'c' ? this.dagGraph.get(key) : this.byId.get(key);
        if (!gg) continue;
        for (const src of Object.values(gg.inputs || {})) {
          if (src.node === undefined || src.node === gg.id) continue;
          const sg = this.byId.get(src.node);
          if (!sg) continue;
          if (sg.dag < 0) { stack.push(['g', sg.id]); continue; }
          const attr = String(src.attr || '');
          if (MATRIX_PARENT.test(attr)) stack.push(['w', this.sceneNodes[sg.dag].parent]);
          else if (MATRIX_WORLD.test(attr)) stack.push(['w', sg.dag]);
          else {
            if (ROTATE.test(attr) && rotated.has(sg.dag)) return this.sceneNodes[sg.dag].name;
            stack.push(['c', sg.dag]);
          }
        }
      }
      return null;
    };
    const inputs = g.inputs || {};
    const from = (keys) => keys.filter((k) => inputs[k] && inputs[k].node !== undefined).map((k) => {
      const sg = this.byId.get(inputs[k].node);
      return sg && sg.dag >= 0 ? ['c', sg.dag] : ['g', inputs[k].node];
    });
    // ポール: コンストレイントの ps（開始ジョイントの親の行列）は IK で動かないので、そのまま調べてよい
    return {
      pole: search(from(['pv', 'pvx', 'pvy', 'pvz'])),
      handle: search([['w', this.sceneNodes[g.dag].parent], ...from(['t', 'tx', 'ty', 'tz'])]),
      twist: search(from(['twi'])),
    };
  }

  /**
   * 極ベクトルの目標が、aim と up が平行な aimConstraint で動くとき、その解き方の候補（aimMode）ごとに目標の位置を求め、
   * Maya の姿勢から逆算した目標の位置との距離を返す。該当しなければ null
   */
  tryAimModes(g, pt, detail) {
    if (!pt || !pt.targets || pt.targets.length !== 1 || !pt.start || !detail || !detail.impliedPv) return null;
    const uses = (pt.targets[0].drift && pt.targets[0].drift.unchecked || [])
      .some((u) => u.by.some((b) => b.from.some((f) => f.endsWith('（aimConstraint）'))));
    if (!uses) return null;
    const want = new Vector3(...pt.start).add(new Vector3(...detail.impliedPv));
    const cg = this.byId.get((g.inputs.pv || g.inputs.pvx || g.inputs.pvy || g.inputs.pvz).node);
    const t = cg.targets.find((x) => this.byId.get(x.node) && this.byId.get(x.node).dag >= 0);
    const ni = this.byId.get(t.node).dag;
    const out = [];
    for (const [mode, label] of AIM_MODES) {
      this.aimMode = mode;
      this.reset();
      const pos = this.pvcTargetPosition(cg, { index: t.index, ni });
      out.push({ mode, label, distance: Math.round(pos.distanceTo(want) * 1e4) / 1e4 });
    }
    this.aimMode = null;
    this.reset();
    return out;
  }

  verifySaved(fileLocal, tol = 0.5) {
    const out = [];
    for (const g of this.graph) {
      if (!g.ik) continue;
      const base = this.compareChain(g, fileLocal, tol);
      const parent = this.parentDrift(g.ik.chain[0], fileLocal, tol);
      const poleTargets = g.ik.solver === 'ikRPsolver' ? this.poleTargets(g, fileLocal, tol) : null;
      let best = null;
      if (base.error > tol && base.joints.length) {
        for (const v of IK_VARIANTS[g.ik.solver] || []) {
          this.ikVariant = v;
          this.reset();
          const r = this.compareChain(g, fileLocal, tol);
          if (!best || r.error < best.error - 1e-6) best = { variant: v, label: variantLabel(v), error: r.error };
        }
        this.ikVariant = null;
        this.reset();
      }
      const pv = g.ik.solver === 'ikRPsolver'
        ? this.pvWorld(this.vec(g.id, 'pv', [0, 0, 1]), g.dag, g.ik.chain[0]).toArray()
        : null;
      if (poleTargets) poleTargets.aimModes = this.tryAimModes(g, poleTargets, base.detail);
      out.push({ handle: g.name, solver: g.ik.solver, chain: g.ik.chain.map((ni) => this.sceneNodes[ni].name), pv,
        twist: this.num(g.id, 'twi', 0) * R2D, joints: base.joints, reach: base.reach, poleError: base.poleError, parent,
        detail: base.detail, poleTargets, cycle: this.chainCycle(g),
        error: base.error, best,
        ok: base.joints.every((j) => j.ok) });
    }
    return out;
  }

  isScaleOf(ni) {
    const rest = this.rest(ni);
    if (!rest) return null;
    if ((rest.isNode ?? -1) >= 0 && this.rest(rest.isNode)) return this.chan(rest.isNode, 'fk').s;
    return rest.isScale || null;
  }
}
