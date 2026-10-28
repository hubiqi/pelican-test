/* s17-chat.js — 第 17 版块 · 早期聊天窗口（2000s · 网吧）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s17 = {
    id: 's17-chat', n: 17, zh: '早期聊天窗口', en: 'Early Chat Client', era: '2000s · 网吧',
    stage: 1,
    palette: { bg: [212, 208, 200], ground: [196, 192, 184], frame: [90, 110, 160], ink: [32, 32, 32], body: [244, 244, 240], accent: [10, 36, 106], motif: 'lines' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
