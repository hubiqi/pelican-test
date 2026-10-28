/* s12-vangogh.js — 第 12 版块 · 星月夜（1889 · 圣雷米）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s12 = {
    id: 's12-vangogh', n: 12, zh: '星月夜', en: 'The Starry Night', era: '1889 · 圣雷米',
    stage: 1,
    palette: { bg: [30, 52, 96], ground: [26, 44, 72], frame: [190, 160, 80], ink: [18, 28, 52], body: [226, 214, 168], accent: [242, 193, 78], motif: 'waves' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
