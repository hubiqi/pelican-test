/* s11-ukiyoe.js — 第 11 版块 · 浮世绘（1830s · 歌川广重）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s11 = {
    id: 's11-ukiyoe', n: 11, zh: '浮世绘', en: 'Ukiyo-e · Tokaido', era: '1830s · 歌川广重',
    stage: 1,
    palette: { bg: [34, 62, 104], ground: [58, 84, 110], frame: [216, 200, 168], ink: [22, 34, 58], body: [236, 226, 200], accent: [188, 72, 52], motif: 'waves' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
