/* s07-maya.js — 第 7 版块 · 玛雅抄本（约 1200 · 尤卡坦）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s07 = {
    id: 's07-maya', n: 7, zh: '玛雅抄本', en: 'Maya Codex', era: '约 1200 · 尤卡坦',
    stage: 1,
    palette: { bg: [228, 210, 158], ground: [208, 190, 138], frame: [150, 60, 44], ink: [110, 40, 34], body: [236, 222, 180], accent: [58, 90, 140], motif: 'grid' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
