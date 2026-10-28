/* s01-sahara.js — 第 1 版块 · 撒哈拉岩画（约前 4000 · 塔西里高原）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s01 = {
    id: 's01-sahara', n: 1, zh: '撒哈拉岩画', en: 'Sahara Rock Art', era: '约前 4000 · 塔西里高原',
    stage: 1,
    palette: { bg: [122, 84, 56], ground: [96, 64, 42], frame: [158, 102, 56], ink: [42, 26, 16], body: [222, 160, 96], accent: [206, 120, 58], motif: 'dots' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
