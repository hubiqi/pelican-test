/* s13-scream.js — 第 13 版块 · 呐喊（1893 · 奥斯陆）
 * 阶段 1：占位（配色 + 地面 + 纹样 + 标题卡 + 骑行的鹈鹕）。
 * 阶段 2/3 换成这一格真正的画风实现时，只需要替换本文件的 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  P.scenes = P.scenes || {};
  P.scenes.s13 = {
    id: 's13-scream', n: 13, zh: '呐喊', en: 'The Scream', era: '1893 · 奥斯陆',
    stage: 1,
    palette: { bg: [200, 98, 52], ground: [40, 68, 96], frame: [120, 70, 50], ink: [38, 34, 44], body: [226, 214, 196], accent: [170, 70, 50], motif: 'waves' },
    render: function (g, ctx) { P.placeholder.render(g, this, ctx); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
