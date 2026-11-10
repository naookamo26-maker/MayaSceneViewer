// Maya の技術資料（ノードの属性の短い名前・型・既定値）に合わせた読み方の検証
// 名前: animLayer（.fgwt・.wgth・.mt・.ovrd・.pthg・.sam・.ram/.oram・.pwth・.pmte・.sslo・.csol・.chsl）、pairBlend（.rm）、composeMatrix（.ro）、remapValue（.vlp・.vlfv・.vli）、wire（.ro）
// 単位: character の角度の値（.av。ファイルは度）
// 既定値: multDoubleLinear の入力（0）、animBlendNodeAdditiveScale（ia・ib・acm 0）、ikHandle の .dwua（3）
// 古いサンプルの名前（.fo・.w・.m・.rxm・.iro・.fv・.rot）も読めることも確かめる
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Matrix4 } from 'three';
import { AnimationClip } from '../src/animation.js';
import { RigEvaluator } from '../src/rig.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const text = {};
const load = (name) => JSON.parse(text[name] ||= readFileSync(path.resolve(here, `../../samples/${name}.json`), 'utf8'));
const R2D = 180 / Math.PI;
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

/** サンプル name のグラフを edit で書き換えて評価する。戻り値 { rig, d, g(name) } */
function run(name, edit, frame) {
  const d = load(name);
  const byName = (n) => d.animation.graph.find((x) => x.name === n);
  if (edit) edit(byName, d);
  const rig = new RigEvaluator(new AnimationClip(d.animation), d.nodes, (ni) => new Matrix4().fromArray(d.nodes[ni].matrix));
  rig.evaluate(frame ?? d.animation.current ?? 1);
  return { rig, d, g: byName };
}
const out = (r, node, attr) => r.rig.plug(r.g(node).id, attr);

test('animLayer: ウェイト .wgth・前面のウェイト .fgwt（Maya の名前）、ミュート .mt、古い .w・.fo・.m も読む', () => {
  const base = run('rig6_sample', null, 48);
  assert.ok(near(out(base, 'layer1', 'fgwt'), 0.5));
  const b = out(base, 'lay_jnt_translateZ_blend1', 'o');
  // ベース 14 + レイヤー × 0.5（レイヤーのカーブは 48 フレームで 2）
  const muted = run('rig6_sample', (g) => { g('layer1').attrs.mt = 1; }, 48);
  assert.ok(near(out(muted, 'layer1', 'fgwt'), 0), 'ミュートなら前面のウェイト 0');
  assert.ok(out(muted, 'lay_jnt_translateZ_blend1', 'o') < b, 'ミュートしたレイヤーは重ならない');
  const old = run('rig6_sample', (g) => {
    const l = g('layer1');
    l.attrs = { w: 0.5 };
    for (const x of ['lay_jnt_translateZ_blend1']) g(x).inputs.wb = { node: l.id, attr: 'fo' };
  }, 48);
  assert.ok(near(out(old, 'lay_jnt_translateZ_blend1', 'o'), b), '古い名前（.w・.fo）でも同じ');
});

test('animLayer: Override のレイヤーは背面のウェイト .bgwt で下のレイヤーを弱める', () => {
  const r = run('rig6_sample', (g) => {
    const l = g('layer1');
    l.attrs.ovrd = 1;
    g('lay_jnt_translateZ_blend1').inputs.wa = { node: l.id, attr: 'bgwt' };
  }, 48);
  assert.ok(near(out(r, 'layer1', 'bgwt'), 0.5));
  const ia = r.rig.plug(r.g('lay_jnt_translateZ_blend1').id, 'ia'), ib = r.rig.plug(r.g('lay_jnt_translateZ_blend1').id, 'ib');
  assert.ok(near(out(r, 'lay_jnt_translateZ_blend1', 'o'), ia * 0.5 + ib * 0.5));
});

/** グラフにノードを足す（id は末尾の番号） */
function addNode(d, type, name, extra = {}) {
  const g = d.animation.graph;
  const n = { id: g.length, name, type, dag: -1, ...extra };
  g.push(n);
  return n;
}

test('animLayer: スケールの重ね方は Maya と同じくレイヤーの .sam（既定 1 = かけ算）を .acm につないで読む', () => {
  // Maya のファイル: setAttr ".acm" は書かず、connectAttr "layer.sam" "blend.acm"（.sam は既定値なら書かない）
  const conn = (edit) => run('rig6_sample', (g, d) => {
    const b = g('lay_jnt_scaleY_blend1');
    delete b.attrs.acm;
    b.inputs.acm = { node: g('layer1').id, attr: 'sam' };
    if (edit) edit(g, d);
  }, 48);
  const mult = conn();
  assert.ok(near(out(mult, 'lay_jnt_scaleY_blend1', 'o'), 2 * 1.5 ** 0.5), 'かけ算（ia · ib^wb）: ' + out(mult, 'lay_jnt_scaleY_blend1', 'o'));
  const add = conn((g) => { g('layer1').attrs.sam = 0; });
  assert.ok(near(out(add, 'lay_jnt_scaleY_blend1', 'o'), 2 + 1.5 * 0.5), '足し算（ia · wa + ib · wb）');
});

test('animBlendNodeAdditiveScale: かけ算は ia^wa · ib^wb（Override のレイヤーは下のレイヤーを置き換える）', () => {
  const r = run('rig6_sample', (g) => {
    const l = g('layer1');
    l.attrs = { wgth: 1, ovrd: 1 };
    g('lay_jnt_scaleY_blend1').inputs.wa = { node: l.id, attr: 'bgwt' };
  }, 48);
  assert.ok(near(out(r, 'layer1', 'bgwt'), 0));
  assert.ok(near(out(r, 'lay_jnt_scaleY_blend1', 'o'), 1.5), 'ウェイト 1 の Override はこのレイヤーの値だけ');
});

test('animLayer: Override で Passthrough（.pthg）がオフなら、下のレイヤーは見えない（ウェイトはこのレイヤーの量）', () => {
  const r = run('rig6_sample', (g) => {
    const l = g('layer1');
    Object.assign(l.attrs, { ovrd: 1, pthg: 0 });
    g('lay_jnt_translateZ_blend1').inputs.wa = { node: l.id, attr: 'bgwt' };
  }, 48);
  assert.ok(near(out(r, 'layer1', 'bgwt'), 0));
  const ib = r.rig.plug(r.g('lay_jnt_translateZ_blend1').id, 'ib');
  assert.ok(near(out(r, 'lay_jnt_translateZ_blend1', 'o'), ib * 0.5));
  // ミュートした Override のレイヤーは、下のレイヤーをそのまま通す
  const m = run('rig6_sample', (g) => {
    const l = g('layer1');
    Object.assign(l.attrs, { ovrd: 1, pthg: 0, mt: 1 });
    g('lay_jnt_translateZ_blend1').inputs.wa = { node: l.id, attr: 'bgwt' };
  }, 48);
  assert.ok(near(out(m, 'layer1', 'bgwt'), 1));
  assert.ok(near(out(m, 'lay_jnt_translateZ_blend1', 'o'), m.rig.plug(m.g('lay_jnt_translateZ_blend1').id, 'ia')));
});

test('animLayer: 親のレイヤーのウェイト・ミュート（.fgwt → .pwth、.omte → .pmte）と、兄弟のソロ（.csol → .sslo）', () => {
  const tree = (parentAttrs, layerAttrs = {}, siblingAttrs = {}) => run('rig6_sample', (g, d) => {
    const p = addNode(d, 'animLayer', 'parentLayer', { attrs: parentAttrs });
    const s = addNode(d, 'animLayer', 'siblingLayer', { attrs: siblingAttrs });
    const l = g('layer1');
    Object.assign(l.attrs, layerAttrs);
    l.inputs = { pwth: { node: p.id, attr: 'fgwt' }, pmte: { node: p.id, attr: 'omte' }, sslo: { node: p.id, attr: 'csol' } };
    p.inputs = { 'chsl[0]': { node: l.id, attr: 'sl' }, 'chsl[1]': { node: s.id, attr: 'sl' } };
  }, 48);
  const fg = (r) => out(r, 'layer1', 'fgwt');
  assert.ok(near(fg(tree({ wgth: 0.5 })), 0.25), '親のウェイトを掛ける');
  assert.ok(near(fg(tree({ mt: 1 })), 0), '親をミュートすると子もミュート');
  assert.equal(out(tree({ mt: 1 }), 'layer1', 'omte'), 1);
  assert.ok(near(fg(tree({}, {}, { sl: 1 })), 0), '兄弟がソロならミュート');
  assert.ok(near(fg(tree({}, { sl: 1 }, { sl: 1 })), 0.5), '自分もソロなら再生する');
  const r = tree({}, {}, { sl: 1 });
  assert.equal(out(r, 'parentLayer', 'csol'), 1);
});

test('animBlendNodeBoolean・Enum: ウェイトが 0 でなければこのレイヤーの値、0 なら下のレイヤーまでの値', () => {
  for (const type of ['animBlendNodeBoolean', 'animBlendNodeEnum']) {
    for (const [wb, want] of [[0.25, 3], [1, 3], [0, 2]]) {
      const r = run('rig6_sample', (g, d) => { addNode(d, type, 'bl', { attrs: { ia: 2, ib: 3, wb } }); }, 1);
      assert.equal(out(r, 'bl', 'o'), want, `${type} wb ${wb}`);
    }
  }
});

test('animBlendNodeAdditiveRotation: レイヤーごとの重ね方（.acm 1 ← レイヤーの .oram）はクォータニオンで重ねる', () => {
  // 1 軸だけの回転なら、成分ごとの重ね方と同じ値（30° + 10° × 0.5）
  const one = run('rig6_sample', (g) => {
    const b = g('lay_jnt_rotate_layer1');
    g('layer1').attrs.ram = 1;
    b.inputs.acm = { node: g('layer1').id, attr: 'oram' };
  }, 48);
  assert.ok(near(out(one, 'lay_jnt_rotate_layer1', 'ox') * R2D, 35, 1e-6), '' + out(one, 'lay_jnt_rotate_layer1', 'ox') * R2D);
  // 2 軸の回転を重ねると、成分ごとの和（x 30・y 10）とは違う値になる
  const two = (acm) => run('rig6_sample', (g) => {
    const b = g('lay_jnt_rotate_layer1');
    b.attrs = { acm, iay: 0 };
    b.inputs = { iax: b.inputs.iax, iby: { curve: b.inputs.ibx.curve } };
    b.inputs.wb = { node: g('layer1').id, attr: 'fgwt' };
    g('layer1').attrs.wgth = 1;
  }, 48);
  const comp = two(0), lay = two(1);
  const v = (r) => ['ox', 'oy', 'oz'].map((a) => out(r, 'lay_jnt_rotate_layer1', a) * R2D);
  assert.ok(near(v(comp)[0], 30) && near(v(comp)[1], 10), '成分ごと: ' + v(comp));
  assert.ok(v(lay).some((x, i) => !near(x, v(comp)[i], 1e-3)), 'レイヤーごと: ' + v(lay));
});

test('pairBlend: 回転のモード .rm（3 軸に共通）で入力 1・入力 2 だけにする。古い軸ごとの .rxm も読む', () => {
  const mix = run('rig_sample');
  const only1 = run('rig_sample', (g) => { g('pb').attrs.rm = 1; });
  const only2 = run('rig_sample', (g) => { g('pb').attrs.rm = 2; });
  assert.ok(near(out(mix, 'pb', 'orz') * R2D, 45, 1e-6), '既定は混ぜる（ウェイト 0.5）: ' + out(mix, 'pb', 'orz') * R2D);
  assert.ok(near(out(only1, 'pb', 'orz') * R2D, 0), '入力 1 だけ');
  assert.ok(near(out(only2, 'pb', 'orz') * R2D, 90), '入力 2 だけ');
  const old = run('rig_sample', (g) => { g('pb').attrs.rzm = 2; });
  assert.ok(near(out(old, 'pb', 'orz') * R2D, 90), '古い軸ごとの名前');
});

test('composeMatrix: 回転順は .ro（古い .iro も同じ）', () => {
  const def = run('fourbyfour_sample');
  const ro = run('fourbyfour_sample', (g) => { g('cm_sh').attrs.ro = 2; });
  const iro = run('fourbyfour_sample', (g) => { g('cm_sh').attrs.iro = 2; });
  const m = (r) => out(r, 'cm_sh', 'omat');
  assert.ok(!m(ro).equals(m(def)), '回転順を変えると行列が変わる');
  assert.ok(m(ro).equals(m(iro)), '古い名前でも同じ');
});

test('remapValue: 値の表の項目は .vlp・.vlfv・.vli（古い .vp・.fv・.vi も読む）', () => {
  const f = 24;
  const base = run('rig6_sample', null, f);
  const byNew = run('rig6_sample', (g) => { g('u_remap').attrs['vl[1].vlfv'] = 0.25; }, f);
  const byOld = run('rig6_sample', (g) => { g('u_remap').attrs['vl[1].fv'] = 0.25; }, f);
  assert.ok(!near(out(byNew, 'u_remap', 'ov'), out(base, 'u_remap', 'ov')), '項目の値を変えると出力が変わる');
  assert.ok(near(out(byNew, 'u_remap', 'ov'), out(byOld, 'u_remap', 'ov')));
});

test('wire: 回転の効きは .ro を読む（古い .rot だけなら .rot）', () => {
  // サンプルのワイヤーは回転しないので形では差が出ない。読む属性の名前を確かめる
  const readNames = (attrs) => {
    const names = [];
    const orig = RigEvaluator.prototype.num;
    RigEvaluator.prototype.num = function (id, attr, def) {
      if (this.byId.get(id).type === 'wire') names.push(attr);
      return orig.call(this, id, attr, def);
    };
    try { run('rig6_sample', (g) => { Object.assign(g('t2_wireDef').attrs, attrs); }, 48); } finally { RigEvaluator.prototype.num = orig; }
    return names;
  };
  assert.ok(readNames({ ro: 0.5 }).includes('ro'));
  assert.ok(!readNames({ ro: 0.5 }).includes('rot'));
  assert.ok(readNames({ rot: 0.5 }).includes('rot'), '古い名前だけなら古い名前');
  assert.ok(readNames({}).includes('ro'), 'どちらもなければ .ro（既定値 1）');
});

test('character: 角度の値（.av）のファイルの値は度として読む', () => {
  const r = run('trax_sample', (g) => {
    const c = g('character1');
    delete c.trax;                                         // クリップを外し、ファイルの値だけにする
    c.attrs['av[1]'] = 30;
  }, 1);
  const shoulder = r.d.nodes.findIndex((n) => n.name === 'shoulder');
  assert.ok(near(r.rig.chan(shoulder).r[2], 30, 1e-6), String(r.rig.chan(shoulder).r[2]));
});

test('既定値: multDoubleLinear の入力は 0、animBlendNodeAdditiveScale は足し算（acm 0）', () => {
  const r = run('rig6_sample', (g) => { delete g('u_mult').attrs.i2; }, 24);
  assert.ok(near(out(r, 'u_mult', 'o'), 0), '書かれていない入力は 0');
  const add = run('rig6_sample', (g) => { delete g('lay_jnt_scaleY_blend1').attrs.acm; }, 48);
  const n = add.g('lay_jnt_scaleY_blend1').id;
  assert.ok(near(out(add, 'lay_jnt_scaleY_blend1', 'o'), add.rig.plug(n, 'ia') + add.rig.plug(n, 'ib') * 0.5), '足し算');
});

test('既定値: ikHandle の .dwua（上級ツイストの up 軸）は 3（+Z）', () => {
  const pos = (r) => r.g('spB_ik').ik.chain.map((ni) => r.rig.world(ni).elements.slice(0, 12)).flat();
  const none = run('ik_sample', (g) => { delete g('spB_ik').attrs.dwua; });
  const z = run('ik_sample', (g) => { g('spB_ik').attrs.dwua = 3; });
  const y = run('ik_sample', (g) => { g('spB_ik').attrs.dwua = 0; });
  assert.ok(pos(none).every((x, i) => near(x, pos(z)[i], 1e-9)), '書かれていなければ +Z');
  assert.ok(!pos(none).every((x, i) => near(x, pos(y)[i], 1e-9)), '+Y とは違う');
});
