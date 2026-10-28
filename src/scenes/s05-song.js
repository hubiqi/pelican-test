/* s05-song.js — 第 5 版块 · 宋代山水（约 1000 · 范宽《溪山行旅图》）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s05 = {
    id: 's05-song', n: 5, zh: '宋代山水', en: 'Song Landscape', era: '约 1000 · 范宽《溪山行旅图》',
    stage: 1,
    palette: { bg: [206, 202, 192], ground: [176, 172, 160], frame: [120, 116, 104], ink: [48, 48, 44], body: [235, 232, 224], accent: [92, 96, 90], motif: 'waves' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
