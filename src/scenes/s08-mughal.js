/* s08-mughal.js — 第 8 版块 · 莫卧儿细密画（约 1600 · 拉合尔）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s08 = {
    id: 's08-mughal', n: 8, zh: '莫卧儿细密画', en: 'Mughal Miniature', era: '约 1600 · 拉合尔',
    stage: 1,
    palette: { bg: [236, 220, 178], ground: [214, 196, 152], frame: [196, 160, 60], ink: [58, 48, 34], body: [246, 238, 214], accent: [96, 124, 72], motif: 'zig' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
