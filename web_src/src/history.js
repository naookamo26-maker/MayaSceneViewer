// 元に戻す・やり直しの履歴（DOM に依存しない）。
// 1 件 = { label, before: [[nodeIndex, 姿勢 or null], ...], after: [...] }。null は「変更なし（ファイル上の姿勢）」。
export class History {
  /** @param apply (changes) => void  変更の一覧を適用する関数 */
  constructor(apply, limit = 200) {
    this.apply = apply;
    this.limit = limit;
    this.undoStack = [];
    this.redoStack = [];
    this.onChange = null;
  }

  get canUndo() { return this.undoStack.length > 0; }
  get canRedo() { return this.redoStack.length > 0; }
  get undoLabel() { return this.canUndo ? this.undoStack[this.undoStack.length - 1].label : ''; }
  get redoLabel() { return this.canRedo ? this.redoStack[this.redoStack.length - 1].label : ''; }

  /** 新しい操作を記録する（やり直しの履歴は消える） */
  push(entry) {
    this.undoStack.push(entry);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack.length = 0;
    this.changed();
  }

  undo() {
    const e = this.undoStack.pop();
    if (!e) return null;
    this.apply(e.before);
    this.redoStack.push(e);
    this.changed();
    return e;
  }

  redo() {
    const e = this.redoStack.pop();
    if (!e) return null;
    this.apply(e.after);
    this.undoStack.push(e);
    this.changed();
    return e;
  }

  clear() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.changed();
  }

  changed() {
    if (this.onChange) this.onChange(this);
  }
}

/** 2 つの変更一覧が同じ姿勢か */
export function sameChanges(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
