/* s06-qingming.js — 第 6 版块 · 清明上河图（约 1100 · 张择端）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s06 = {
    id: 's06-qingming', n: 6, zh: '清明上河图', en: 'Along the River', era: '约 1100 · 张择端',
    stage: 1,
    palette: { bg: [216, 200, 164], ground: [198, 182, 146], frame: [140, 120, 86], ink: [52, 44, 36], body: [242, 236, 222], accent: [96, 120, 84], motif: 'dots' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
