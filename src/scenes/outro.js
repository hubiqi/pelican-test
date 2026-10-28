/* outro.js — 结尾 12 秒：新闻发布会。
 * 展墙 7×3 = 21 格：前 20 格是 20 个版块的定格，第 21 格是空的新闻发布席。
 * τ: 0 全景 → 1.5 推镜 → 6.5 停在第 21 格（闪光灯打在强拍上）→ 10.4 鹈鹕闪过 → 11.2 定格。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const K = root.PEL.kit;
  const B = root.PEL.beat;

  const COLS = 7, ROWS = 3, N = COLS * ROWS;
  const WALL_X = 50, WALL_W = 900, GAP = 10;
  const CELL = (WALL_W - GAP * (COLS - 1)) / COLS;       // 120
  const WALL_Y = 246;
  const WALL_H = CELL * ROWS + GAP * (ROWS - 1);          // 380

  function cellRect(i) {
    const c = i % COLS, r = Math.floor(i / COLS);
    return { x: WALL_X + c * (CELL + GAP), y: WALL_Y + r * (CELL + GAP), w: CELL, h: CELL };
  }

  // 第 21 格：空席位
  function emptySeat(g, w) {
    const s = w / 100;
    g.push();
    g.scale(s, s);
    // 背板
    g.noStroke();
    const grd = g.drawingContext.createLinearGradient(0, 0, 0, 100);
    grd.addColorStop(0, 'rgba(58,56,50,1)');
    grd.addColorStop(1, 'rgba(30,29,26,1)');
    g.drawingContext.fillStyle = grd;
    g.drawingContext.fillRect(0, 0, 100, 100);
    // 聚光
    g.drawingContext.save();
    const sp = g.drawingContext.createRadialGradient(50, 34, 4, 50, 44, 52);
    sp.addColorStop(0, 'rgba(255,238,196,0.30)');
    sp.addColorStop(1, 'rgba(255,238,196,0)');
    g.drawingContext.fillStyle = sp;
    g.drawingContext.fillRect(0, 0, 100, 100);
    g.drawingContext.restore();

    // 椅子（空着）：椅背 + 座面 + 四条腿，都是细线，读得出「没人坐」
    g.push();
    g.noFill();
    g.stroke(206, 200, 184, 165);
    g.strokeWeight(1.5);
    g.strokeJoin('round');
    // 椅背
    g.beginShape();
    g.vertex(41, 52); g.vertex(41, 30); g.vertex(50, 27); g.vertex(59, 30); g.vertex(59, 52);
    g.endShape();
    // 座面
    g.line(38, 53, 62, 53);
    // 腿
    g.line(41, 53, 39, 68);
    g.line(59, 53, 61, 68);
    // 扶手
    g.stroke(206, 200, 184, 110);
    g.line(36, 46, 41, 46);
    g.line(59, 46, 64, 46);
    g.pop();

    // 桌上的一点热光，让空席位显得「刚有人待过」
    g.drawingContext.save();
    const gl = g.drawingContext.createRadialGradient(50, 40, 2, 50, 40, 34);
    gl.addColorStop(0, 'rgba(255,226,168,0.10)');
    gl.addColorStop(1, 'rgba(255,226,168,0)');
    g.drawingContext.fillStyle = gl;
    g.drawingContext.fillRect(14, 8, 72, 66);
    g.drawingContext.restore();

    // 桌子
    g.noStroke();
    g.fill(46, 44, 40);
    g.rect(10, 66, 80, 12, 1.5);
    g.fill(62, 58, 52);
    g.rect(10, 66, 80, 3, 1.5);

    // 一排麦克风（不含任何真实媒体标志）
    for (let i = 0; i < 5; i++) {
      const x = 22 + i * 14;
      g.stroke(150, 146, 136, 210);
      g.strokeWeight(1.2);
      g.line(x, 66, x + (x < 50 ? -3 : 3), 54);
      g.noStroke();
      g.fill(30, 30, 28);
      g.ellipse(x + (x < 50 ? -3 : 3), 53, 5.2, 6.4);
      g.fill(90, 88, 82, 160);
      g.ellipse(x + (x < 50 ? -3.4 : 2.6), 51.6, 2.2, 2.6);
    }

    // 席卡
    g.push();
    g.translate(50, 64);
    g.fill(238, 234, 222);
    g.noStroke();
    g.rect(-13, -6, 26, 8, 0.8);
    g.fill(28, 26, 24);
    g.textAlign('center', 'baseline');
    g.textFont('"Noto Serif SC", "Songti SC", serif');
    g.textSize(5.0);
    g.text('鹈鹕（本人）', 0, -1.4);
    g.pop();
    g.pop();
  }

  function render(g, ctx) {
    const tau = ctx.tLocal;
    const frozen = Math.min(tau, 11.2);

    // 背景：展厅的墙
    g.noStroke();
    g.fill(19, 19, 21);
    g.rect(0, 0, 1000, 1000);
    const grd = g.drawingContext.createLinearGradient(0, 200, 0, 800);
    grd.addColorStop(0, 'rgba(44,42,44,1)');
    grd.addColorStop(1, 'rgba(16,16,18,1)');
    g.drawingContext.fillStyle = grd;
    g.drawingContext.fillRect(0, 0, 1000, 1000);

    // 镜头：先拉远式微调，再推向第 21 格
    const e = B.smooth((frozen - 1.5) / 5.0);
    const z0 = 1.18 - 0.18 * B.smooth(frozen / 0.9);
    const z = z0 + (3.35 - 1) * e;
    const c21 = cellRect(20);
    const fx = 500 + (c21.x + c21.w / 2 - 500) * e;
    const fy = 500 + (c21.y + c21.h / 2 - 500) * e;

    g.push();
    g.translate(500, 500);
    g.scale(z, z);
    g.translate(-fx, -fy);

    // 展墙
    for (let i = 0; i < N; i++) {
      const r = cellRect(i);
      // 框
      g.noStroke();
      g.fill(96, 88, 74);
      g.rect(r.x - 2.5, r.y - 2.5, r.w + 5, r.h + 5);
      g.fill(42, 38, 32);
      g.rect(r.x - 1.2, r.y - 1.2, r.w + 2.4, r.h + 2.4);

      if (i < 20) {
        const still = ctx.stills && ctx.stills[i];
        if (still) {
          g.image(still, r.x, r.y, r.w, r.h);
        } else {
          g.fill(30, 30, 32);
          g.rect(r.x, r.y, r.w, r.h);
          g.fill(120, 120, 120, 200);
          g.textAlign('center', 'center');
          g.textSize(9);
          g.text(i + 1, r.x + r.w / 2, r.y + r.h / 2);
        }
        // 玻璃反光
        g.noStroke();
        g.fill(255, 255, 255, 10);
        g.beginShape();
        g.vertex(r.x, r.y);
        g.vertex(r.x + r.w * 0.55, r.y);
        g.vertex(r.x, r.y + r.h * 0.6);
        g.endShape('close');
      } else {
        g.push();
        g.translate(r.x, r.y);
        emptySeat(g, r.w);
        g.pop();
      }
      // 序号小牌
      g.fill(196, 190, 172, 190);
      g.textAlign('center', 'top');
      g.textFont('Georgia, serif');
      g.textSize(4.6);
      g.text(i < 20 ? String(i + 1) : '—', r.x + r.w / 2, r.y + r.h + 1.5);
    }
    g.pop();

    // 闪光灯：推镜过程中在强拍上咔嚓
    const flashBeats = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5];
    let flash = 0;
    for (let i = 0; i < flashBeats.length; i++) {
      const d = (frozen - flashBeats[i]) / 0.09;
      flash = Math.max(flash, Math.exp(-d * d));
    }
    if (flash > 0.004) {
      g.push();
      g.noStroke();
      g.fill(255, 246, 226, 235 * flash);
      g.rect(0, 0, 1000, 1000);
      g.pop();
    }

    // 鹈鹕一闪而过（在席位后方）
    if (tau > 10.35 && tau < 11.12) {
      const f = (tau - 10.35) / 0.77;
      const px = 300 + f * 760;
      g.push();
      g.translate(px, 700);
      g.scale(0.62);
      const pose = P.rig.solve(tau * 1.6);
      P.rig.paint(g, pose, 'silhouette', { ink: [14, 13, 12], w: 2.6, alpha: 0.92 });
      g.pop();
    }

    // 字幕
    const cap1 = B.smooth((tau - 0.5) / 0.5) * (1 - B.smooth((tau - 3.4) / 0.5));
    const cap2 = B.smooth((tau - 7.6) / 0.5);
    g.push();
    g.textAlign('center', 'baseline');
    g.textFont('"Noto Serif SC", "Songti SC", serif');
    g.noStroke();
    if (cap1 > 0.01) {
      g.fill(238, 234, 224, 255 * cap1);
      g.textSize(30);
      g.text('截至目前，人类共提交了 20 份答卷。', 500, 700);
    }
    if (cap2 > 0.01) {
      g.fill(238, 234, 224, 255 * cap2);
      g.textSize(30);
      g.text('鹈鹕本人对此尚未发表评论。', 500, 700);
      g.fill(150, 146, 136, 200 * cap2);
      g.textSize(14);
      g.textFont('Georgia, "Times New Roman", serif');
      g.text('THE PELICAN COULD NOT BE REACHED FOR COMMENT', 500, 726);
    }
    g.pop();

    K.vignette(g, 1000, 1000, 0.42);
    K.grain(g, 1000, 1000, 0.6, 2, 3);
  }

  P.outro = { render: render, cellRect: cellRect, CELL: CELL, N: N };
})(typeof window !== 'undefined' ? window : globalThis);
