/* s14-nosferatu.js — 第 14 版块 · 诺斯费拉图（1922 · 默片）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s14 = {
    id: 's14-nosferatu', n: 14, zh: '诺斯费拉图', en: 'Nosferatu', era: '1922 · 默片',
    stage: 1,
    palette: { bg: [12, 12, 14], ground: [8, 8, 10], frame: [70, 66, 60], ink: [214, 210, 198], body: [150, 148, 140], accent: [180, 176, 164], cardInk: [220, 216, 204], motif: 'lines' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
