/* s16-8bit.js — 第 16 版块 · 8-bit 像素游戏（1980s · 客厅）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s16 = {
    id: 's16-8bit', n: 16, zh: '8-bit 像素游戏', en: '8-bit Platformer', era: '1980s · 客厅',
    stage: 1,
    palette: { bg: [26, 26, 46], ground: [18, 18, 34], frame: [233, 69, 96], ink: [246, 211, 101], body: [230, 230, 240], accent: [233, 69, 96], motif: 'grid' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
