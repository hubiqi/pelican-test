/* s02-egypt.js — 第 2 版块 · 埃及壁画（约前 1300 · 底比斯）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s02 = {
    id: 's02-egypt', n: 2, zh: '埃及壁画', en: 'Egyptian Tomb Painting', era: '约前 1300 · 底比斯',
    stage: 1,
    palette: { bg: [214, 190, 146], ground: [196, 166, 118], frame: [140, 108, 64], ink: [34, 42, 78], body: [232, 216, 178], accent: [170, 68, 46], motif: 'grid' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
