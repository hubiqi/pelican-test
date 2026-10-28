/* s15-scope.js — 第 15 版块 · 示波器矢量图（1950s · 实验室）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s15 = {
    id: 's15-scope', n: 15, zh: '示波器矢量图', en: 'Oscilloscope Vector', era: '1950s · 实验室',
    stage: 1,
    palette: { bg: [4, 18, 10], ground: [4, 14, 8], frame: [40, 60, 46], ink: [86, 255, 150], body: [70, 230, 140], accent: [120, 255, 180], cardInk: [120, 255, 170], motif: 'grid' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
