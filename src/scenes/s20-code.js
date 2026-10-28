/* s20-code.js — 第 20 版块 · 代码美学（2020s · 大模型时代）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s20 = {
    id: 's20-code', n: 20, zh: '代码美学', en: 'Code Aesthetic', era: '2020s · 大模型时代',
    stage: 1,
    palette: { bg: [13, 17, 23], ground: [22, 27, 34], frame: [48, 54, 61], ink: [230, 237, 243], body: [200, 220, 230], accent: [126, 231, 135], cardInk: [230, 237, 243], motif: 'lines' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
