# -*- coding: utf-8 -*-
"""ノードの多いシーンの階層（見えている行だけを要素にする仮想リスト）を確認する。

行が ui.js の TREE_VIRTUAL_ROWS（2,000 行）より多いと、見えている範囲の行だけを要素にする。テストの中で
3,000 行を超えるシーンを作り、スクロール・選択の表示（F）・キー操作・クリック・絞り込み・すべて閉じるを確かめる。

  python tests/qt_tree_virtual_test.py      （画面のない Linux では xvfb-run -a を付ける）
"""
from __future__ import annotations

import json
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

GROUPS, PER_GROUP, CHAIN = 30, 100, 40


def make_scene(path: str) -> None:
    """grp0〜grp29（transform）の下に 100 個ずつのジョイントと、深さ 40 のジョイントのチェーン chain0〜chain39
    （形もジョイントもない transform は出力されないため、ジョイントにする）"""
    lines = ['requires maya "2024";', "currentUnit -l centimeter -a degree -t film;"]
    for g in range(GROUPS):
        lines.append('createNode transform -n "grp%d";' % g)
        for k in range(PER_GROUP):
            lines.append('createNode joint -n "g%d_item%d" -p "grp%d";' % (g, k, g))
    parent = None
    for c in range(CHAIN):
        lines.append('createNode joint -n "chain%d"%s;' % (c, ' -p "%s"' % parent if parent else ""))
        parent = "chain%d" % c
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


HELPER = r"""
window.__tv = (() => {
  const tree = () => document.getElementById('tree');
  const rows = () => [...document.querySelectorAll('#tree .row')];
  const names = () => rows().map((r) => r.querySelector('.name').textContent);
  const ui = () => window.mayaViewer.debug.app.ui;
  const state = () => {
    const t = tree(), tr = t.getBoundingClientRect();
    const sel = rows().find((r) => r.classList.contains('selected'));
    const sr = sel ? sel.getBoundingClientRect() : null;
    return {
      dom: rows().length, total: ui().rows.length, shown: ui().shownRows.length, virtual: ui().treeVirtual,
      scrollHeight: t.scrollHeight, clientHeight: t.clientHeight, names: names(),
      selName: sel ? sel.querySelector('.name').textContent : null,
      selInView: !!sr && sr.top >= tr.top - 1 && sr.bottom <= tr.bottom + 1,
      lead: window.mayaViewer.getStats().selected,
    };
  };
  const scrollTo = (y) => new Promise((res) => { tree().scrollTop = y; requestAnimationFrame(() => requestAnimationFrame(() => res(state()))); });
  const key = (k) => {
    tree().dispatchEvent(new PointerEvent('pointerenter'));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => res(state()))));
  };
  const clickName = (name) => {
    const r = rows().find((x) => x.querySelector('.name').textContent === name);
    if (!r) return null;
    r.querySelector('.name').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return state();
  };
  const filter = (text) => {
    const f = document.getElementById('tree-filter');
    f.value = text; f.dispatchEvent(new Event('input', { bubbles: true }));
    return new Promise((res) => requestAnimationFrame(() => res(state())));
  };
  const eye = (name) => {
    const r = rows().find((x) => x.querySelector('.name').textContent === name);
    r.querySelector('.eye').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return new Promise((res) => requestAnimationFrame(() => {
      const r2 = rows().find((x) => x.querySelector('.name').textContent === name);
      res({ pressed: r2.querySelector('.eye').getAttribute('aria-pressed'), dim: r2.classList.contains('dim') });
    }));
  };
  return { state, scrollTo, key, clickName, filter, eye };
})(); 'ok'
"""


def main() -> int:
    from ma_viewer.qt_compat import QtCore, QtWidgets
    QtCore.QCoreApplication.setAttribute(QtCore.Qt.ApplicationAttribute.AA_ShareOpenGLContexts, True)
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv[:1])
    from ma_viewer.viewer import ViewerWindow
    win = ViewerWindow(host="standalone")
    win.resize(1400, 860)
    win.show()
    ok = {"v": True}
    tmp = tempfile.mkdtemp(prefix="tree_virtual_")
    path = os.path.join(tmp, "many_nodes.ma")
    make_scene(path)

    def check(cond, msg):
        print(("OK " if cond else "NG ") + msg)
        if not cond:
            ok["v"] = False

    def parse(r):
        return json.loads(r) if isinstance(r, str) and r[:1] and r[0] in "{[" else r

    def js(code, then, delay=150):
        win.viewer.run_js(code, lambda r: QtCore.QTimer.singleShot(delay, lambda: then(parse(r))))

    def js_async(code, then, delay=150):
        """Promise を返す式。結果を window.__r に入れて取り出す"""
        win.viewer.run_js("window.__r = null; Promise.resolve(%s).then((v) => { window.__r = JSON.stringify(v); }); 1" % code,
                          lambda _r: poll(then, delay))

    def poll(then, delay, n=0):
        def got(r):
            if (r in (None, "", "null")) and n < 50:
                QtCore.QTimer.singleShot(100, lambda: poll(then, delay, n + 1))
            else:
                QtCore.QTimer.singleShot(delay, lambda: then(parse(r)))
        win.viewer.run_js("window.__r", got)

    def run(steps):
        if steps:
            steps[0](lambda *_: run(steps[1:]))

    def wait_loaded(nxt, n=0):
        def got(s):
            if (not s or not s.get("total")) and n < 100:
                QtCore.QTimer.singleShot(200, lambda: wait_loaded(nxt, n + 1))
            else:
                nxt(s)
        js("(window.__tv ? JSON.stringify(__tv.state()) : 'null')", got, 0)

    expected_rows = GROUPS * (PER_GROUP + 1) + CHAIN

    def s_load(nxt):
        win.open_file(path)

        def loaded(s):
            check(s["total"] == expected_rows and s["virtual"], "行 %s 行で仮想リストになる: %s" % (s["total"], s["virtual"]))
            check(s["dom"] < 150, "要素にするのは見えている範囲の行だけ: %s 行" % s["dom"])
            check(abs(s["scrollHeight"] - s["shown"] * 22) <= 40,
                  "スクロールできる高さは表示している行の数 × 22px: %s（%s 行）" % (s["scrollHeight"], s["shown"]))
            check(s["names"][:2] == ["grp0", "g0_item0"], "先頭から描く: %s" % s["names"][:2])
            nxt()
        js(HELPER, lambda _: wait_loaded(loaded), 300)

    def s_scroll(nxt):
        def got(s):
            check("chain1" in s["names"] or "chain0" in s["names"], "いちばん下までスクロールすると最後の行を描く: %s" % s["names"][-3:])
            check(s["dom"] < 150, "スクロールしても要素は見えている範囲だけ: %s" % s["dom"])
            nxt()
        js_async("__tv.scrollTo(1e9)", got)

    def s_reveal(nxt):
        # 閉じた階層の奥（chain30）を選び、F で祖先を開いてまん中にスクロールする
        def after_f(s):
            check(s["selName"] == "chain30" and s["selInView"], "F で閉じた奥の行を開いて表示する: %s %s" % (s["selName"], s["selInView"]))
            nxt()

        def selected(_):
            js_async("__tv.scrollTo(0).then(() => __tv.key('f'))", after_f)
        js("window.mayaViewer.selectByPath('|chain0|chain1|chain2|chain3|chain4|chain5|chain6|chain7|chain8|chain9|chain10|"
           "chain11|chain12|chain13|chain14|chain15|chain16|chain17|chain18|chain19|chain20|chain21|chain22|chain23|chain24|"
           "chain25|chain26|chain27|chain28|chain29|chain30'); 1", selected)

    def s_keys(nxt):
        # chain30 は F で祖先を開いただけで、自分は閉じている。→ で開いて ↓ で子の chain31 へ進む
        before = {}

        def right(s):
            check(s["selName"] == "chain30" and s["shown"] == before["shown"] + 1,
                  "→ で選んだ行を開く: %s → %s 行" % (before["shown"], s["shown"]))
            js_async("__tv.key('ArrowDown')", down)

        def down(s):
            check(s["selName"] == "chain31" and s["selInView"], "↓ で次の行を選び、見える位置にする: %s" % s["selName"])
            js_async("__tv.key('ArrowUp')", up)

        def up(s):
            check(s["selName"] == "chain30", "↑ で前の行を選ぶ: %s" % s["selName"])
            nxt()
        js("JSON.stringify(__tv.state())", lambda s: (before.update(s), js_async("__tv.key('ArrowRight')", right)))

    def s_click(nxt):
        def scrolled(_):
            js("JSON.stringify(__tv.clickName('g15_item50'))", clicked)

        def clicked(s):
            check(bool(s) and s["selName"] == "g15_item50" and (s["lead"] or "").endswith("g15_item50"),
                  "スクロールした先の行をクリックで選べる: %s" % (s and s["selName"]))
            js_async("__tv.eye('g15_item50')", hidden)

        def hidden(e):
            check(e["pressed"] == "false", "目のアイコンで隠すと、描いている行のアイコンが変わる: %s" % e)
            js_async("__tv.eye('g15_item50')", lambda e2: (check(e2["pressed"] == "true", "もう一度押すと表示に戻る: %s" % e2), nxt()))
        js_async("__tv.scrollTo(%d)" % ((15 * (PER_GROUP + 1) + 40) * 22 - 200), scrolled)

    def s_filter(nxt):
        def got(s):
            check(s["shown"] == 11 + 1 and sorted(s["names"]) == sorted(["grp7"] + ["g7_item%d" % k for k in [1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]]),
                  "絞り込みで合う行と親だけになる: %s 行 %s" % (s["shown"], s["names"]))
            js_async("__tv.filter('')", cleared)

        def cleared(s):
            check(s["shown"] > 2000 and s["dom"] < 150, "絞り込みを外すと元に戻る: %s 行" % s["shown"])
            nxt()
        js_async("__tv.filter('g7_item1')", got)

    def s_collapse(nxt):
        def got(s):
            check(s["shown"] == GROUPS + 1 and s["dom"] == GROUPS + 1, "すべて閉じると根の行だけになる: %s 行（要素 %s）" % (s["shown"], s["dom"]))
            nxt()
        js_async("(document.getElementById('tree-collapse-all').click(), __tv.scrollTo(0))", got)

    win.viewer.pageReady.connect(lambda: QtCore.QTimer.singleShot(200, lambda: run(
        [s_load, s_scroll, s_reveal, s_keys, s_click, s_filter, s_collapse, lambda _: app.quit()])))
    QtCore.QTimer.singleShot(120000, lambda: (print("NG タイムアウト"), ok.update(v=False), app.quit()))
    app.exec()
    print("結果:", "OK" if ok["v"] else "NG")
    return 0 if ok["v"] else 1


if __name__ == "__main__":
    sys.exit(main())
