/* intro.js — 开场 5 秒：一本正经地胡说。
 * 纸张、衬线、素描插图、两条字幕。第二条字幕落在第 3 小节强拍（t=4.0），
 * 然后鹈鹕在第 1 道画框上（t=5.0）骑进第一格。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const K = root.PEL.kit;
  const B = root.PEL.beat;

  // 素描插图：用骨骼木偶的静止姿势，细线画在「图版」里
  function plate(g, x, y, w, h) {
    g.push();
    // 图版边框（凹印）
    g.noFill();
    g.stroke(120, 108, 90, 110);
    g.strokeWeight(1.2);
    g.rect(x, y, w, h);
    g.stroke(120, 108, 90, 60);
    g.rect(x + 5, y + 5, w - 10, h - 10);

    // 素描鹈鹕（固定姿势：t=0.25 的某个踩踏位置）
    const pose = P.rig.solve(0.25);
    g.push();
    g.translate(x + w * 0.5 - 30, y + h - 24);
    g.scale(0.52);
    P.rig.paint(g, pose, 'line', { ink: [70, 62, 50], w: 2.2, alpha: 0.9 });
    g.pop();
    // 铅笔排线阴影
    g.stroke(90, 82, 68, 26);
    g.strokeWeight(0.8);
    for (let i = 0; i < 14; i++) {
      const yy = y + h - 34 - i * 2.2;
      g.line(x + 14 + i * 2, yy, x + w - 16 - i * 3, yy);
    }
    g.pop();
  }

  function render(g, ctx) {
    const t = ctx.tGlobal;
    K.paper(g, 1000, 1000, { base: [243, 237, 224], seed: 11, grain: 1.1 });
    // 边缘做旧
    K.vignette(g, 1000, 1000, 0.16, [120, 96, 64]);

    // 栏目小字
    g.push();
    g.noStroke();
    g.fill(96, 86, 70, 170);
    g.textFont('Georgia, "Times New Roman", serif');
    g.textSize(15);
    g.textAlign('left', 'baseline');
    g.text('A BRIEF HISTORY OF PELICANS ON BICYCLES', 74, 268);
    g.textAlign('right', 'baseline');
    g.text('卷一 · 摹本', 926, 268);
    g.stroke(96, 86, 70, 80);
    g.strokeWeight(1);
    g.line(74, 280, 926, 280);
    g.pop();

    // 图版 + 图注
    plate(g, 596, 300, 320, 196);
    g.push();
    g.noStroke();
    g.fill(88, 78, 62, 200);
    g.textFont('"Noto Serif SC", "Songti SC", serif');
    g.textSize(16);
    g.textAlign('center', 'baseline');
    g.text('图一　鹈鹕骑行图（摹本）', 756, 524);
    g.pop();

    // 字幕
    const a1 = B.smooth((t - 0.75) / 0.5);
    const a2 = B.smooth((t - 4.0) / 0.14);
    const a3 = B.smooth((t - 4.5) / 0.45);
    g.push();
    g.textAlign('center', 'baseline');
    g.textFont('"Noto Serif SC", "Songti SC", "Source Han Serif SC", serif');

    g.fill(32, 30, 28, 255 * a1);
    g.textSize(40);
    g.text('人类自古以来就痴迷于画鹈鹕骑自行车。', 500, 640);

    const push = 1 + 0.02 * B.smooth((t - 4.0) / 0.2);
    g.push();
    g.translate(500, 706);
    g.scale(push, push);
    g.fill(32, 30, 28, 255 * a2);
    g.textSize(34);
    g.text('——早在自行车被发明之前。', 0, 0);
    g.pop();

    g.fill(110, 98, 80, 255 * a3 * 0.9);
    g.textFont('Georgia, "Times New Roman", "Noto Serif SC", serif');
    g.textSize(17);
    g.text('——《鹈鹕骑行艺术通史》，卷一（虚构书名）', 500, 752);
    g.pop();

    K.grain(g, 1000, 1000, 0.5, 3, 5);
  }

  P.intro = { render: render };
})(typeof window !== 'undefined' ? window : globalThis);
