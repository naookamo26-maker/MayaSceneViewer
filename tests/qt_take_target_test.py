# -*- coding: utf-8 -*-
"""テイクの当てる先（名前空間のない同じリグが 2 体）と並べ替えの確認（Qt）。

  python tests/qt_take_target_test.py      （画面のない Linux では xvfb-run -a を付ける）

1. 同じリグを |charA・|charB の下に並べたシーン（名前空間なし）にテイクを足すと、当てる先の候補が 2 つ出る（既定は charA）
2. 行の一覧で charB に変えると、charB だけが動く
3. 並べ替え（ソート・Alt+↑↓）で、選んでいるテイクはそのまま
4. .msv に書き出して開き直すと、順番・当てる先（charB）・選んでいたテイクが戻る
前提: samples/anim_sample.json
"""
from __future__ import annotations

import copy
import json
import os
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

STATE_JS = """JSON.stringify((() => {
  const a = window.mayaViewer.debug.app;
  const s = window.mayaViewer.getStats();
  const rows = [...document.querySelectorAll('#take-list .take-row')].slice(1);
  const moving = {};
  if (a.rig) for (const ni of a.rig.moving) { const g = a.data.nodes[ni].path.split('|')[1]; moving[g] = (moving[g] || 0) + 1; }
  return { loaded: !!s.loaded, name: a.sceneName || '', active: a.activeTake, moving,
           rows: rows.map((r) => (r.querySelector('.take-name') || {}).textContent || ''),
           targets: rows.map((r) => { const sel = r.querySelector('select.take-target'); return sel ? sel.options[sel.selectedIndex].textContent : ''; }) };
})())"""


def two_rigs(path_out: str):
    """anim_sample.json のリグを、名前空間を付けずに |charA・|charB の下に 2 体並べたシーン"""
    with open(os.path.join(ROOT, "samples", "anim_sample.json"), encoding="utf-8") as f:
        src = json.load(f)
    nodes, rest, meshes = [], [], []
    for g, x in (("charA", -15.0), ("charB", 15.0)):
        gi = len(nodes)
        nodes.append({"name": g, "path": "|" + g, "type": "transform", "parent": -1, "visible": True,
                      "matrix": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1],
                      "attrs": {"t": [x, 0, 0], "r": [0, 0, 0], "s": [1, 1, 1], "ro": "xyz"}})
        rest.append({"node": gi, "joint": False, "ro": 0, "t": [x, 0, 0], "r": [0, 0, 0], "s": [1, 1, 1], "ra": [0, 0, 0]})
        off = len(nodes)
        for n in src["nodes"]:
            n2 = dict(n, path="|" + g + n["path"], parent=n["parent"] + off if n["parent"] >= 0 else gi)
            nodes.append(n2)
        for e in src["animation"]["nodes"]:
            e2 = dict(e, node=e["node"] + off)
            if e.get("isNode", -1) >= 0:
                e2["isNode"] = e["isNode"] + off
            rest.append(e2)
        for m in src["meshes"]:
            m2 = copy.deepcopy(m)
            m2["path"] = "|" + g + m["path"]
            m2["transform"] = m["transform"] + off
            if m2.get("skin"):
                m2["skin"]["influences"] = [i + off for i in m["skin"]["influences"]]
            meshes.append(m2)
    out = dict(src, nodes=nodes, restNodes=rest, meshes=meshes, curves=[], cameras=[])
    out.pop("animation", None)
    out["source"] = dict(src["source"], name="two_rigs.json")
    with open(path_out, "w", encoding="utf-8") as f:
        json.dump(out, f)


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer import package
    from ma_viewer.viewer import ViewerWindow
    tmp = tempfile.TemporaryDirectory()
    scene_path = os.path.join(tmp.name, "two_rigs.json")
    two_rigs(scene_path)
    take_src = os.path.join(ROOT, "samples", "anim_sample.json")
    short = os.path.join(tmp.name, "a_short.json")
    with open(take_src, encoding="utf-8") as f:
        d = json.load(f)
    d["animation"]["end"] = 10
    d["source"]["name"] = "a_short.ma"
    with open(short, "w", encoding="utf-8") as f:
        json.dump(d, f)
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    ok = {"v": True}
    saved = {}

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def parse(r):
        if isinstance(r, str) and r[:1] in "{[":
            try:
                return json.loads(r)
            except ValueError:
                return r
        return r

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(parse(r))))

    def state(then):
        js(STATE_JS, then, 0)

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def wait_until(cond, then, timeout=30):
        t0 = time.time()

        def poll():
            def got(s):
                if (isinstance(s, dict) and cond(s)) or time.time() - t0 > timeout:
                    then(s)
                else:
                    QtCore.QTimer.singleShot(200, poll)
            state(got)
        QtCore.QTimer.singleShot(300, poll)

    def step_open(nxt):
        win.open_file(scene_path)
        wait_until(lambda s: s["loaded"] and s["name"] == "two_rigs.json", lambda s: (
            check(s["loaded"], "2 体のリグのシーンを開く"), nxt()))

    def step_add(nxt):
        win.load_take_files([take_src, short])
        wait_until(lambda s: len(s["rows"]) == 2, lambda s: (
            check(s["rows"] == ["a_short", "anim_sample"], "テイクを足す（ファイル名の順）: %s" % s["rows"]),
            check(s["targets"] == ["charA（6）", "charA（6）"], "当てる先の候補を出し、既定は charA: %s" % s["targets"]),
            nxt()))

    def step_target(nxt):
        js("(() => { const a = window.mayaViewer.debug.app; a.setTake(1); a.setTakeTarget(1, 1); return 1; })()",
           lambda _r: state(lambda s: (
               check(s["targets"][1] == "charB（6）", "当てる先を charB に変える: %s" % s["targets"]),
               check(s["active"] == 1 and list(s["moving"]) == ["charB"], "charB だけが動く: %s" % s["moving"]),
               nxt())), 1000)

    def step_sort(nxt):
        js("(() => { const a = window.mayaViewer.debug.app; a.sortTakes('name', true); return 1; })()",
           lambda _r: state(lambda s: (
               check(s["rows"] == ["anim_sample", "a_short"] and s["active"] == 0,
                     "名前の降順に並べ替えても、選んでいるテイクはそのまま: %s・%s" % (s["rows"], s["active"])),
               nxt())), 300)

    def step_alt(nxt):
        js("(() => { const r = document.querySelector('#take-list .take-row[data-index=\"1\"]'); r.focus();"
           " r.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true, bubbles: true })); return 1; })()",
           lambda _r: state(lambda s: (
               check(s["rows"] == ["a_short", "anim_sample"] and s["active"] == 1, "Alt+↑ で上へ動かす: %s" % s["rows"]),
               nxt())), 300)

    def step_save(nxt):
        out = os.path.join(tmp.name, "two_rigs.msv")
        saved["msv"] = out
        orig = QtWidgets.QFileDialog.getSaveFileName
        QtWidgets.QFileDialog.getSaveFileName = staticmethod(lambda *a, **k: (out, ""))
        win._export_package_with(dict(win.package_options(), view=True, textures="none"))

        def later():
            QtWidgets.QFileDialog.getSaveFileName = orig
            scene, _pkg = package.read_package(out)
            takes = scene.get("savedTakes") or []
            check([t["name"] for t in takes] == ["a_short", "anim_sample"], ".msv に並べた順で入れる")
            check(takes and takes[1].get("appliedTo") == {"namespace": "", "root": "|charB"},
                  "当てていた先（appliedTo）を入れる: %s" % (takes[1].get("appliedTo") if takes else None))
            nxt()
        QtCore.QTimer.singleShot(2500, later)

    def step_reopen(nxt):
        win.open_file(saved["msv"])
        wait_until(lambda s: s["loaded"] and s["name"] == "two_rigs.json" and len(s["rows"]) == 2 and s["active"] == 1,
                   lambda s: (
                       check(s["rows"] == ["a_short", "anim_sample"], "開き直すと順番が戻る: %s" % s["rows"]),
                       check(s["targets"] == ["charA（6）", "charB（6）"], "当てる先が戻る: %s" % s["targets"]),
                       check(s["active"] == 1 and list(s["moving"]) == ["charB"], "選んでいたテイクを charB に当てる: %s" % s["moving"]),
                       nxt()))

    def finish(*_):
        win.close()
        tmp.cleanup()
        app.quit()

    QtCore.QTimer.singleShot(500, lambda: run([step_open, step_add, step_target, step_sort, step_alt, step_save,
                                               step_reopen, finish]))
    QtCore.QTimer.singleShot(120000, lambda: (check(False, "時間切れ"), finish()))
    app.exec()
    print("ALL OK" if ok["v"] else "FAILED")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
