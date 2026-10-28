/* s10-wayang.js — 第 10 版块 · 爪哇皮影戏（约 1800 · 中爪哇）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s10 = {
    id: 's10-wayang', n: 10, zh: '爪哇皮影戏', en: 'Wayang Kulit', era: '约 1800 · 中爪哇',
    stage: 1,
    palette: { bg: [26, 18, 22], ground: [20, 14, 18], frame: [120, 86, 40], ink: [232, 190, 110], body: [212, 158, 74], accent: [214, 160, 72], cardInk: [240, 206, 150], motif: 'zig' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
