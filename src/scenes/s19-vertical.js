/* s19-vertical.js — 第 19 版块 · 竖屏短视频（2020s · 算法推荐）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s19 = {
    id: 's19-vertical', n: 19, zh: '竖屏短视频', en: 'Vertical Video', era: '2020s · 算法推荐',
    stage: 1,
    palette: { bg: [18, 18, 20], ground: [26, 26, 30], frame: [40, 40, 44], ink: [240, 240, 240], body: [250, 250, 250], accent: [254, 44, 85], cardInk: [240, 240, 240], motif: 'dots' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
