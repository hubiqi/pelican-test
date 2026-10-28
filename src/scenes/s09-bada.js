/* s09-bada.js — 第 9 版块 · 八大山人写意（约 1690 · 南昌）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s09 = {
    id: 's09-bada', n: 9, zh: '八大山人写意', en: 'Bada Shanren', era: '约 1690 · 南昌',
    stage: 1,
    palette: { bg: [246, 243, 232], ground: [238, 235, 224], frame: [200, 196, 184], ink: [30, 30, 28], body: [252, 251, 246], accent: [110, 110, 104], motif: 'waves' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
