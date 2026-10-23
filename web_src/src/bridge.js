// Qt（Python）との通信。QWebChannel が使えない環境（通常のブラウザ）では何もしない。
//   JS → Python : bridge.nodeSelected(path) / bridge.jsReady() / bridge.log(level, text)
//   Python → JS : window.mayaViewer.* を runJavaScript で呼ぶ

export function isQtHost() {
  return typeof window !== 'undefined' && typeof window.qt !== 'undefined' && !!window.qt.webChannelTransport;
}

export function connectBridge(onReady) {
  if (!isQtHost() || typeof window.QWebChannel === 'undefined') return false;
  // eslint-disable-next-line no-new
  new window.QWebChannel(window.qt.webChannelTransport, (channel) => {
    const b = channel.objects.bridge;
    if (b) onReady(b);
  });
  return true;
}
