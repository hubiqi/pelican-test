/* s04-tang.js — 第 4 版块 · 唐代白描（约 750 · 长安）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s04 = {
    id: 's04-tang', n: 4, zh: '唐代白描', en: 'Tang Ink Outline', era: '约 750 · 长安',
    stage: 1,
    palette: { bg: [240, 235, 222], ground: [228, 222, 206], frame: [190, 182, 164], ink: [26, 24, 22], body: [248, 246, 240], accent: [120, 110, 96], motif: 'lines' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
