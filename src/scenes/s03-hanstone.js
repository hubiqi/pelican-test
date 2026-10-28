/* s03-hanstone.js — 第 3 版块 · 汉画像石拓片（约 100 · 山东）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s03 = {
    id: 's03-hanstone', n: 3, zh: '汉画像石拓片', en: 'Han Stone Rubbing', era: '约 100 · 山东',
    stage: 1,
    palette: { bg: [20, 20, 16], ground: [14, 14, 12], frame: [70, 66, 58], ink: [236, 232, 220], body: [210, 206, 192], accent: [120, 116, 104], cardInk: [236, 232, 220], motif: 'lines' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
