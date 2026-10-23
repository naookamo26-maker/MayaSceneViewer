# -*- coding: utf-8 -*-
"""ハンドル（移動・回転・スケール）をマウス操作で動かす確認。

  python tests/qt_gizmo_test.py [--shot out_dir]      （画面のない Linux では xvfb-run -a を付ける）

ハンドルの上にマウスを移動 → 押す → ドラッグ → 離す、を画面上で再現し、
ポーズが変わること・カメラが動かないこと・離したときに選択が変わらないことを確かめる。
"""
from __future__ import annotations

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

HELPER_JS = r"""
window.__gz = (() => {
  const app = window.mayaViewer.debug.app;
  const g = app.gizmo;
  const V = app.camera.position.constructor;
  const rect = () => app.canvas.getBoundingClientRect();
  const toScreen = (p) => {
    const q = p.clone().project(app.camera), r = rect();
    return [r.left + (q.x + 1) / 2 * r.width, r.top + (1 - q.y) / 2 * r.height];
  };
  // 実際のマウスと同じく、移動イベントの button は -1（押した・離したときだけ 0）
  const ev = (type, x, y, buttons) => app.canvas.dispatchEvent(new PointerEvent(type, {
    clientX: x, clientY: y, button: type === 'pointermove' ? -1 : 0, buttons, pointerId: 1, pointerType: 'mouse',
    isPrimary: true, bubbles: true, cancelable: true }));
  const key = (k) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  /** ハンドルの部品（axis）の上にマウスを移動できる画面座標を探す */
  const find = (axis) => {
    app.render();
    const k = g._gizmo.picker[g.mode].children[0].scale.x;   // ハンドルの 1 単位のワールド長
    const c = new V(), q = app.poseProxy.getWorldQuaternion(new (app.poseProxy.quaternion.constructor)());
    app.poseProxy.getWorldPosition(c);
    const ax = { X: new V(1, 0, 0), Y: new V(0, 1, 0), Z: new V(0, 0, 1) };
    const d = ax[axis].clone().applyQuaternion(q);
    const cands = [];
    if (g.mode === 'rotate') {
      // 回転のリング（半径 0.5）。他の軸のリングと重ならない 45 度の位置
      const others = Object.keys(ax).filter((a) => a !== axis).map((a) => ax[a].clone().applyQuaternion(q));
      for (const s of [1, -1]) for (const t of [1, -1]) {
        cands.push(c.clone().addScaledVector(others[0], 0.354 * k * s).addScaledVector(others[1], 0.354 * k * t));
      }
    } else {
      for (const t of [0.45, 0.35, 0.55, 0.25]) cands.push(c.clone().addScaledVector(d, t * k));
    }
    for (const p of cands) {
      const [x, y] = toScreen(p);
      ev('pointermove', x, y, 0);
      if (g.axis === axis) {
        const [x2, y2] = toScreen(c.clone().addScaledVector(d, 1.2 * k));
        const [x0, y0] = toScreen(c);
        let dx = x2 - x0, dy = y2 - y0; const l = Math.hypot(dx, dy) || 1;
        return { x, y, dirx: dx / l, diry: dy / l };
      }
    }
    return null;
  };
  /** 押して dx, dy だけドラッグして離す */
  const drag = (x, y, dx, dy) => {
    ev('pointerdown', x, y, 1);
    for (let i = 1; i <= 8; i++) ev('pointermove', x + dx * i / 8, y + dy * i / 8, 1);
    ev('pointerup', x + dx, y + dy, 0);
  };
  const idx = (name) => app.data.nodes.findIndex((n) => n.name === name);
  const colLen = (m, c) => Math.hypot(m.elements[c * 4], m.elements[c * 4 + 1], m.elements[c * 4 + 2]);
  const state = () => ({
    selected: app.selected >= 0 ? app.data.nodes[app.selected].name : null,
    mode: g.mode, attached: !!g.object, tool: app.settings.tool,
    camera: app.camera.position.toArray().map((v) => +v.toFixed(6)),
    elbow: app.pose.get(idx('elbow')),
    twistScale: [0, 1, 2].map((c) => +colLen(app.built.nodeObjects[idx('forearm_twist')].matrixWorld, c).toFixed(6)),
    twistPos: app.built.nodeObjects[idx('forearm_twist')].matrixWorld.elements.slice(12, 15).map((v) => +v.toFixed(4)),
    poseInputs: ['pose-tx', 'pose-rx', 'pose-sx'].map((id) => document.getElementById(id).value),
    // ハンドル（代理オブジェクト）と選択ノードのワールド位置のずれ
    handleOffset: app.selected < 0 ? null : +app.poseProxy.getWorldPosition(new V())
      .distanceTo(new V().setFromMatrixPosition(app.built.nodeObjects[app.selected].matrixWorld)).toFixed(9),
  });
  const vp = () => { const r = rect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
  return { find, drag, key, state, vp };
})(); 'ok'
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shot", default=None)
    args = ap.parse_args()

    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.app import apply_dark_style
    from ma_viewer.viewer import ViewerWindow
    apply_dark_style(app)

    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    ok = {"v": True}
    st = {}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def js(code, then, delay=150):
        def cb(r):
            QtCore.QTimer.singleShot(delay, lambda: then(json.loads(r) if isinstance(r, str) and r[:1] in "{[" else r))
        win.viewer.run_js(code, cb)

    def state(then):
        js("JSON.stringify(__gz.state())", then)

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def s_load(nxt):
        win.open_file(os.path.join(ROOT, "samples", "sample_arm.ma"))
        QtCore.QTimer.singleShot(2500, nxt)

    def s_helper(nxt):
        js(HELPER_JS + "; window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow'); __gz.key('w'); 'ok'", nxt, 400)

    def s_translate(nxt):
        def got(before):
            st["before"] = before
            check(before["attached"] and before["mode"] == "translate", "W で移動ハンドルが付く")
            check(before["handleOffset"] == 0, "ハンドルが選択ジョイントの位置に出る（ずれ %s）" % before["handleOffset"])
            js("(()=>{const h=__gz.find('X'); if(!h) return 'none'; __gz.drag(h.x,h.y,h.dirx*80,h.diry*80); return 'dragged';})()",
               lambda r: state(lambda after: (check(r == "dragged", "移動ハンドル X を掴めた"),
                                              check(after["elbow"]["t"][0] > 0.05 and abs(after["elbow"]["t"][1]) < 1e-6,
                                                    "ローカル X 方向に移動: t=%s" % after["elbow"]["t"]),
                                              check(after["camera"] == before["camera"], "ドラッグ中にカメラが動かない"),
                                              check(after["selected"] == "elbow", "離しても選択が変わらない"),
                                              check(after["handleOffset"] == 0, "移動後もハンドルがジョイントに付いている"),
                                              check(after["poseInputs"][0] not in ("0", ""), "パネルの移動 X に反映: %s" % after["poseInputs"][0]),
                                              nxt())), 300)
        state(got)

    def s_rotate(nxt):
        js("__gz.key('e'); 'ok'", lambda _: js(
            "(()=>{const h=__gz.find('X'); if(!h) return 'none'; __gz.drag(h.x,h.y,40,60); return 'dragged';})()",
            lambda r: state(lambda after: (check(r == "dragged", "回転ハンドル X を掴めた"),
                                           check(abs(after["elbow"]["r"][0]) > 1 and abs(after["elbow"]["r"][1]) < 1e-3
                                                 and abs(after["elbow"]["r"][2]) < 1e-3,
                                                 "X 軸まわりだけ回転: r=%s" % [round(v, 2) for v in after["elbow"]["r"]]),
                                           check(after["elbow"]["t"][0] > 0.05, "移動の値は保たれる"),
                                           nxt())), 300), 300)

    def s_scale(nxt):
        def got(before):
            js("__gz.key('r'); 'ok'", lambda _: js(
                "(()=>{const h=__gz.find('X'); if(!h) return 'none'; __gz.drag(h.x,h.y,h.dirx*90,h.diry*90); return 'dragged';})()",
                lambda r: state(lambda after: (
                    check(r == "dragged", "スケールハンドル X を掴めた"),
                    check(after["elbow"]["s"][0] > 1.05 and after["elbow"]["s"][1] == 1 and after["elbow"]["s"][2] == 1,
                          "X だけスケール: s=%s" % [round(v, 3) for v in after["elbow"]["s"]]),
                    check(after["twistScale"] == before["twistScale"], "子ジョイント自身は拡大されない: %s" % after["twistScale"]),
                    check(after["twistPos"] != before["twistPos"], "子ジョイントの位置は伸びる"),
                    check(after["handleOffset"] == 0, "スケール後もハンドルがジョイントに付いている"),
                    nxt())), 300), 300)
        state(got)

    def s_shot(nxt):
        if not args.shot:
            return nxt()
        os.makedirs(args.shot, exist_ok=True)
        js("__gz.key('e'); window.mayaViewer.debug.app.render(); 'ok'",
           lambda _: (win.grab().save(os.path.join(args.shot, "gizmo.png")), print("画像を保存しました"), nxt()), 400)

    def s_reset(nxt):
        js("document.getElementById('pose-reset-all').click(); 'ok'",
           lambda _: state(lambda s: (check(s["elbow"] == {"t": [0, 0, 0], "r": [0, 0, 0], "s": [1, 1, 1]}, "すべて戻す"),
                                      nxt())), 200)

    def s_child_after_parent_pose(nxt):
        # 親（ひじ）を曲げてから子（手首）を選び、ハンドルが手首に出るか
        js("""(()=>{const app=window.mayaViewer.debug.app; const i=app.data.nodes.findIndex(n=>n.name==='elbow');
              app.setPose(i,{t:[0,0,0],r:[0,0,-35],s:[1,1,1]}); __gz.key('q');
              window.mayaViewer.selectByPath('|rig_grp|shoulder|elbow|forearm_twist|wrist'); __gz.key('w'); return 'ok';})()""",
           lambda _: state(lambda s: (check(s["selected"] == "wrist" and s["handleOffset"] == 0,
                                            "親を曲げたあと子を選んでもハンドルが子に出る（ずれ %s）" % s["handleOffset"]),
                                      nxt())), 300)

    def s_camera_stops(nxt):
        # 何もない所をドラッグしてカメラを回し、離したあとに動き続けないか
        def got(r):
            print("  カメラ（前・離した直後）:", r["before"], r["atUp"])
            check(r["atUp"] != r["before"], "ドラッグでカメラが回る")
            js("JSON.stringify(window.mayaViewer.debug.app.camera.position.toArray().map(v=>+v.toFixed(6)))",
               lambda later: (check(later == r["atUp"], "離したあとカメラが止まる（0.7 秒後も同じ位置）"), nxt()), 0)
        js("""(()=>{const app=window.mayaViewer.debug.app; __gz.key('q'); const v=__gz.vp();
              const cam=()=>app.camera.position.toArray().map(x=>+x.toFixed(6)); const before=cam();
              __gz.drag(v.left+40, v.top+v.height-80, 160, -30); return JSON.stringify({before, atUp: cam()});})()""",
           got, 700)

    def s_panels(nxt):
        def collapsed(r):
            print("  ビューポートの幅（前→最小化後）:", r["w0"], "→", r["w1"])
            check(r["w1"] > r["w0"] + 400, "左右を最小化するとビューポートが広がる")
            check(r["strips"] == [30, 30], "最小化した側は 30px の帯になる: %s" % r["strips"])
            js("(()=>{document.getElementById('left-expand').click(); document.getElementById('right-expand').click(); return 1;})()",
               lambda _: js("JSON.stringify(__gz.vp().width)",
                            lambda w2: (check(abs(float(w2) - r["w0"]) < 1, "帯をクリックすると元の幅に戻る（%s）" % w2), nxt()), 0), 400)

        def do_collapse(w0):
            w0 = float(w0)
            js("(()=>{document.getElementById('left-collapse').click(); document.getElementById('right-collapse').click(); return 1;})()",
               lambda _: js("JSON.stringify({w0:%s, w1: __gz.vp().width, strips: ['left','right'].map(s=>document.getElementById(s).getBoundingClientRect().width)})" % w0,
                            lambda r: (shot_collapsed(), collapsed(r)), 0), 400)

        def shot_collapsed():
            if args.shot:
                win.grab().save(os.path.join(args.shot, "panels_collapsed.png"))
        js("JSON.stringify(__gz.vp().width)", do_collapse, 0)

    def s_select_tool(nxt):
        js("__gz.key('q'); 'ok'", lambda _: state(lambda s: (check(not s["attached"], "Q でハンドルが外れる"), nxt())))

    def s_end(_nxt):
        app.quit()

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(
        200, lambda: run([s_load, s_helper, s_translate, s_rotate, s_scale, s_shot, s_reset, s_child_after_parent_pose, s_select_tool, s_camera_stops, s_panels, s_end])))
    QtCore.QTimer.singleShot(60000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
