/* _placeholder.js — 阶段 1 的占位画面。
 * 20 个版块各自有配色、地面、纹样和标题卡，鹈鹕照常在里头骑，
 * 但正式美术在阶段 2/3 会逐个替换 render()。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const K = root.PEL.kit;
  const B = root.PEL.beat;

  function drawMotif(g, sc, t) {
    const pal = sc.palette;
    const c = pal.motifCol || pal.accent;
    g.push();
    g.noStroke();
    g.fill(c[0], c[1], c[2], 46);
    const m = pal.motif || 'dots';
    for (let i = 0; i < 26; i++) {
      const x = ((i * 83 + 40) % 1000);
      const y = 240 + K.hash(i * 3.1) * 380;
      const s = 6 + K.hash(i * 7.7) * 10;
      if (m === 'dots') g.ellipse(x, y, s, s);
      else if (m === 'waves') { g.push(); g.translate(x, y); g.noFill(); g.stroke(c[0], c[1], c[2], 40); g.strokeWeight(2); g.arc(0, 0, s * 3, s * 2, Math.PI, Math.PI * 2); g.pop(); }
      else if (m === 'grid') { g.rect(x, y, s, s); }
      else if (m === 'zig') { g.push(); g.translate(x, y); g.rotate(0.5); g.rect(0, 0, s * 1.6, s * 0.5); g.pop(); }
      else if (m === 'lines') { g.rect(x, y, 2, s * 2); }
    }
    g.pop();
  }

  function render(g, sc, ctx) {
    const pal = sc.palette;
    const t = ctx.t;
    const u = ctx.u;

    // 底色 + 渐变
    g.noStroke();
    const grd = g.drawingContext.createLinearGradient(0, 0, 0, 1000);
    grd.addColorStop(0, 'rgb(' + pal.bg.map(function (v, i) { return Math.round(v * (i === 2 ? 1.06 : 0.94)); }).join(',') + ')');
    grd.addColorStop(1, 'rgb(' + pal.bg.join(',') + ')');
    g.drawingContext.fillStyle = grd;
    g.drawingContext.fillRect(0, 0, 1000, 1000);

    // 纸/石/屏质感
    K.grain(g, 1000, 1000, 0.35, 3, sc.n * 7);

    // 远景地平线
    g.noStroke();
    g.fill(pal.ground[0] * 0.82, pal.ground[1] * 0.82, pal.ground[2] * 0.82);
    g.rect(0, 560, 1000, 440);
    g.fill(pal.ground[0], pal.ground[1], pal.ground[2]);
    g.rect(0, 610, 1000, 390);

    drawMotif(g, sc, t);

    // 路面：一条横贯的暗带 + 滚动虚线
    const gy = K.GROUND_Y;
    g.noStroke();
    g.fill(pal.ink[0], pal.ink[1], pal.ink[2], 26);
    g.rect(0, gy + 4, 1000, 26);
    const off = ctx.scroll % 90;
    g.stroke(pal.ink[0], pal.ink[1], pal.ink[2], 70);
    g.strokeWeight(4);
    for (let x = -90; x < 1000 + 90; x += 90) {
      g.line(x - off, gy + 17, x - off + 44, gy + 17);
    }

    // 画框（左右立柱 —— 穿框时看到的就是这两根）
    g.noStroke();
    g.fill(pal.frame[0], pal.frame[1], pal.frame[2]);
    g.rect(0, 0, 44, 1000);
    g.rect(956, 0, 44, 1000);
    g.fill(pal.frame[0] * 1.12, pal.frame[1] * 1.12, pal.frame[2] * 1.12);
    g.rect(38, 0, 8, 1000);
    g.rect(954, 0, 8, 1000);
    // 框内暗角
    K.vignette(g, 1000, 1000, 0.28);

    // 鹈鹕
    const px = 300 + u * 380;
    const pose = P.rig.solve(ctx.tGlobal);
    g.push();
    g.translate(px, gy + 2);
    g.scale(1.0);
    P.rig.paint(g, pose, 'fill', { ink: pal.ink, body: pal.body, accent: pal.accent, w: 2.6 });
    g.pop();

    // 标题卡
    K.titleCard(g, {
      x: 74, y: 330, zh: sc.zh, en: sc.en, era: sc.era,
      ink: pal.cardInk || pal.ink, accent: pal.accent,
    });
  }

  P.placeholder = { render: render };
})(typeof window !== 'undefined' ? window : globalThis);
