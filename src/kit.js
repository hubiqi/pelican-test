/* kit.js — 全片共用绘图工具包。
 * 约定：所有场景在 1000×1000 的设计方格里作画（cover 裁切成 16:9，
 * 所以上下各 219 单位会被裁掉 —— 关键信息请留在 y∈[219,781] 安全带内）。
 * 不依赖具体风格：每个场景自己决定笔法，kit 只提供确定性的噪声、纸张、
 * 墨线、文字、画框等基础件。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const B = root.PEL.beat;
  const TAU = Math.PI * 2;

  // ---- 确定性噪声 ---------------------------------------------------------
  function hash(n) {
    let x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }
  function hash2(x, y) { return hash(x * 57.13 + y * 131.71); }
  function noise1(x) {
    const i = Math.floor(x), f = x - i;
    const a = hash(i), b = hash(i + 1);
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  }
  function noise2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
  }
  function fbm(x, y, oct, lac, gain) {
    oct = oct || 4; lac = lac || 2; gain = gain || 0.5;
    let s = 0, a = 0.5, f = 1;
    for (let i = 0; i < oct; i++) { s += a * noise2(x * f, y * f); f *= lac; a *= gain; }
    return s;
  }

  // Catmull-Rom 采样（p5 2.x 去掉了 curveVertex，自己插值更可控）
  function spline(pts, res) {
    res = res || 8;
    const n = pts.length;
    function X(p) { return p.x !== undefined ? p.x : p[0]; }
    function Y(p) { return p.y !== undefined ? p.y : p[1]; }
    const out = [];
    if (n < 2) return pts.map(function (p) { return [X(p), Y(p)]; });
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      const x0 = X(p0), y0 = Y(p0), x1 = X(p1), y1 = Y(p1), x2 = X(p2), y2 = Y(p2), x3 = X(p3), y3 = Y(p3);
      for (let j = 0; j < res; j++) {
        const t = j / res, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * x1 + (-x0 + x2) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 + (-x0 + 3 * x1 - 3 * x2 + x3) * t3),
          0.5 * (2 * y1 + (-y0 + y2) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 + (-y0 + 3 * y1 - 3 * y2 + y3) * t3),
        ]);
      }
    }
    out.push([X(pts[n - 1]), Y(pts[n - 1])]);
    return out;
  }


  // 锥形描边：沿路径生成一条粗细渐变的带状多边形（脖子、飘带、墨线用）
  function tapered(g, pts, w0, w1, fillCol, strokeCol, strokeW, alpha) {
    const path = spline(pts, 10);
    const L = [], R = [];
    for (let i = 0; i < path.length; i++) {
      const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1e-6;
      dx /= len; dy /= len;
      const f = i / (path.length - 1);
      const w = (w0 + (w1 - w0) * f) * 0.5;
      L.push([path[i][0] - dy * w, path[i][1] + dx * w]);
      R.push([path[i][0] + dy * w, path[i][1] - dx * w]);
    }
    g.push();
    if (fillCol) g.fill(fillCol[0], fillCol[1], fillCol[2], 255 * (alpha === undefined ? 1 : alpha));
    else g.noFill();
    if (strokeCol) {
      g.stroke(strokeCol[0], strokeCol[1], strokeCol[2], 255 * (alpha === undefined ? 1 : alpha));
      g.strokeWeight(strokeW || 1);
      g.strokeJoin('round');
    } else g.noStroke();
    g.beginShape();
    L.forEach(function (q) { g.vertex(q[0], q[1]); });
    for (let i = R.length - 1; i >= 0; i--) g.vertex(R[i][0], R[i][1]);
    g.endShape('close');
    g.pop();
  }

  // ---- 纸张 / 底材 --------------------------------------------------------
  // 宣纸：米色底 + 细纤维 + 少量深斑
  function paper(g, w, h, opt) {
    const o = Object.assign({ base: [242, 236, 222], fiber: 0.06, seed: 1, grain: 1 }, opt || {});
    g.noStroke();
    g.fill(o.base[0], o.base[1], o.base[2]);
    g.rect(0, 0, w, h);
    // 大块不均匀（手工纸的云斑）
    g.noStroke();
    for (let i = 0; i < 90; i++) {
      const x = hash(i * 3.7 + o.seed) * w;
      const y = hash(i * 8.1 + o.seed * 2) * h;
      const r = 40 + hash(i * 5.3 + 9) * 160;
      g.fill(0, 0, 0, 0.012 * o.grain);
      g.ellipse(x, y, r, r * 0.7);
    }
    // 纤维
    g.noFill();
    const n = Math.floor(w * h / 4200);
    for (let i = 0; i < n; i++) {
      const x = hash(i * 1.7 + o.seed) * w;
      const y = hash(i * 2.3 + o.seed * 3) * h;
      const len = 4 + hash(i * 9.1) * 16;
      const ang = hash(i * 4.4) * TAU;
      g.stroke(120, 108, 92, 10 + hash(i * 6.1) * 18);
      g.strokeWeight(0.4 + hash(i * 7.7) * 0.7);
      g.line(x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    }
  }

  // 颗粒噪点：预生成一张 256×256 的噪声贴图，用 pattern 一次铺满（比逐点快两个数量级）
  let _grainTile = null;
  function grainTile(p) {
    if (_grainTile) return _grainTile;
    const t = p.createGraphics(256, 256);
    t.pixelDensity(1);
    t.loadPixels();
    const d = t.pixels;
    for (let i = 0; i < d.length; i += 4) {
      const v = 128 + (Math.random() - 0.5) * 210;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    t.updatePixels();
    _grainTile = t;
    return t;
  }

  function grain(g, w, h, amount, size, seed) {
    const p = P.kit.p || (root.PEL && root.PEL.director && root.PEL.director.D.p);
    if (!p) return;
    const tile = grainTile(p);
    const ctx = g.drawingContext;
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = (amount === undefined ? 0.4 : amount) * 0.55;
    const pat = ctx.createPattern(tile.canvas, 'repeat');
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function vignette(g, w, h, strength, tint) {
    const ctx = g.drawingContext;
    const grd = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.78);
    const c = tint || [0, 0, 0];
    grd.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    grd.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},${strength || 0.35})`);
    ctx.save();
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // ---- 笔触 ---------------------------------------------------------------
  // 一条「毛边」线：沿路径撒抖动点，宽度随时间轻微起伏（飞白靠间隔断笔）
  function stroke(g, pts, opt) {
    const o = Object.assign({ weight: 3, color: [30, 30, 30], alpha: 1, jitter: 0.8, seed: 1, dry: 0 }, opt || {});
    g.noFill();
    g.stroke(o.color[0], o.color[1], o.color[2], 255 * o.alpha);
    const steps = Math.max(2, Math.floor(pts.length * 3));
    g.strokeWeight(o.weight);
    g.beginShape();
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      for (let s = 0; s < steps; s++) {
        const f = s / steps;
        const x = a[0] + (b[0] - a[0]) * f;
        const y = a[1] + (b[1] - a[1]) * f;
        const j = (noise1(i * 7 + s * 0.9 + o.seed * 13) - 0.5) * o.jitter;
        g.vertex(x + j, y + j * 0.6);
      }
    }
    const last = pts[pts.length - 1];
    g.vertex(last[0], last[1]);
    g.endShape();
    // 干笔飞白
    if (o.dry > 0) {
      for (let i = 0; i < pts.length * 6; i++) {
        const f = hash(i * 3.3 + o.seed) ;
        const seg = f * (pts.length - 1);
        const a = pts[Math.floor(seg)], b = pts[Math.min(pts.length - 1, Math.floor(seg) + 1)];
        const ff = seg - Math.floor(seg);
        const x = a[0] + (b[0] - a[0]) * ff, y = a[1] + (b[1] - a[1]) * ff;
        if (hash(i * 5.1) > 0.55) continue;
        g.stroke(o.color[0], o.color[1], o.color[2], 255 * o.alpha * 0.35);
        g.strokeWeight(o.weight * 0.4);
        g.line(x, y, x + (hash(i * 8.8) - 0.5) * 26, y + (hash(i * 4.2) - 0.5) * 18);
      }
    }
  }

  // 墨色晕染（湿边）
  function bleed(g, x, y, r, col, alpha) {
    g.noStroke();
    for (let i = 6; i > 0; i--) {
      g.fill(col[0], col[1], col[2], (alpha || 0.12) * (i / 6) * 0.5);
      g.ellipse(x, y, r * (1 + i * 0.12), r * (1 + i * 0.1));
    }
  }

  // 虚线（路面中线、路径提示）
  function dashed(g, x1, y1, x2, y2, dash, gap, col, weight) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const dx = (x2 - x1) / len, dy = (y2 - y1) / len;
    g.stroke(col[0], col[1], col[2], col[3] === undefined ? 255 : col[3]);
    g.strokeWeight(weight || 3);
    for (let d = 0; d < len; d += dash + gap) {
      const e = Math.min(d + dash, len);
      g.line(x1 + dx * d, y1 + dy * d, x1 + dx * e, y1 + dy * e);
    }
  }

  // ---- 文字 ---------------------------------------------------------------
  // 统一标题卡：中文名 / 英文名 / 年代。位置在安全带内左下。
  // 每个场景可以覆盖 style，但默认这版保证 1080p 下可读。
  function titleCard(g, o) {
    const opt = Object.assign({
      x: 56, y: 690, zh: '', en: '', era: '',
      ink: [34, 32, 30], alpha: 1, accent: null, align: 'left', serif: 'serif',
    }, o || {});
    g.push();
    g.textAlign(opt.align === 'right' ? 'right' : 'left', 'baseline');
    const x = opt.x;
    g.noStroke();
    // 年代
    g.fill(opt.ink[0], opt.ink[1], opt.ink[2], 190 * opt.alpha);
    g.textFont('Georgia, "Times New Roman", serif');
    g.textSize(21);
    g.text(opt.era, x, opt.y - 62);
    // 中文名
    g.fill(opt.ink[0], opt.ink[1], opt.ink[2], 255 * opt.alpha);
    g.textFont('"Noto Serif SC", "Songti SC", "Source Han Serif SC", serif');
    g.textSize(44);
    g.text(opt.zh, x, opt.y);
    // 英文名
    g.fill(opt.ink[0], opt.ink[1], opt.ink[2], 190 * opt.alpha);
    g.textFont('Georgia, "Times New Roman", serif');
    g.textSize(24);
    g.text(opt.en, x, opt.y + 34);
    // 装饰横线
    if (opt.accent) {
      g.fill(opt.accent[0], opt.accent[1], opt.accent[2], 255 * opt.alpha);
      g.rect(x, opt.y + 52, 74, 2.5);
    }
    g.pop();
  }

  // 场景地面默认高度（设计单位）；各场景可以自己改，但默认值让「路」连贯
  const GROUND_Y = 690;
  // 安全带上边界（cover 裁切后可见范围）
  const SAFE_TOP = 218.75;
  const SAFE_BOTTOM = 781.25;

  P.kit = {
    hash, hash2, noise1, noise2, fbm,
    paper, grain, vignette, stroke, bleed, dashed, spline, tapered,
    titleCard,
    GROUND_Y, SAFE_TOP, SAFE_BOTTOM, grainTile,
    p: null,
    TAU,
  };
})(typeof window !== 'undefined' ? window : globalThis);
