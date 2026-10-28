/* main.js — 调度、镜头、转场与播放控制。
 * 画面 = renderFrame(图形上下文, 绝对时间 t) 的纯函数：同一 t 永远同一帧，
 * 所以可以拖动进度条、可以逐帧导出、可以做接触表。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const B = P.beat;
  const K = P.kit;
  const CAM = P.camera;

  const W = 1920, H = 1080;
  const SCENE_ORDER = [
    's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10',
    's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 's20',
  ];

  const D = {
    p: null, buf: null, bakes: [], bakeSize: 512, bakeNext: 0, ready: false,
    playing: true, t: 0, tOffset: 0, onTime: null, opts: {},
  };

  function sceneList() {
    return SCENE_ORDER.map(function (k) { return P.scenes[k]; }).filter(Boolean);
  }
  function sceneByIndex(n) { return P.scenes['s' + (n < 10 ? '0' + n : n)]; }

  // ---- 初始化 ----
  function init(p, opts) {
    D.p = p;
    D.opts = opts || {};
    K.p = p;
    D.buf = p.createGraphics(W, W);   // 设计方格 1000 → 1920 像素，正方形
    D.buf.pixelDensity(1);
    D.bakeSize = D.opts.bakeSize || 512;
    D.bakes = [];
    for (let i = 0; i < 20; i++) D.bakes.push(null);
    D.bakeNext = 0;
    D.ready = true;
  }

  // ---- 烘焙 20 张定格（用在结尾展墙上）----
  function bakeOne(i) {
    const sc = sceneByIndex(i + 1);
    if (!sc) return;
    const s = D.bakeSize;
    const g = D.p.createGraphics(s, s);
    g.pixelDensity(1);
    const heroT = B.blockStart(i + 1) + 3.3;
    const ctx = makeCtx(heroT, i + 1);
    g.push();
    g.scale(s / 1000, s / 1000);
    sc.render(g, ctx);
    g.pop();
    D.bakes[i] = g;
  }

  function makeCtx(t, index) {
    const t0 = index >= 1 && index <= 20 ? B.blockStart(index) : (index >= 21 ? B.BLOCKS_END : 0);
    const dur = index >= 1 && index <= 20 ? B.BLOCK_DUR : (index >= 21 ? B.OUTRO_DUR : B.BLOCKS_START);
    const local = t - t0;
    return {
      t: local, tLocal: local, tGlobal: t, u: local / dur, index: index,
      scroll: B.roadScroll(t),
      beat: B, kit: K, rig: P.rig.solve(t),
      stills: D.bakes,
    };
  }

  // ---- 主渲染：把一帧画进 1920×1080 的目标 ----
  function renderFrame(g, t) {
    g.push();
    g.background(0);
    const info = B.blockAt(t);

    if (info.index === 0) {
      // 开场：整幅设计方格 cover 到画面
      g.push();
      g.translate(0, -420);
      g.scale(1.92, 1.92);
      P.intro.render(g, makeCtx(t, 0));
      g.pop();
    } else if (info.index >= 21) {
      // 结尾
      g.push();
      g.translate(0, -420);
      g.scale(1.92, 1.92);
      P.outro.render(g, makeCtx(t, 21));
      g.pop();
    } else {
      const cam = CAM.state(t);
      // 只画与当前视口有交集的画板（绝大多数时间只有 1 张，穿框时 2 张）
      const halfView = (W / 2) / cam.zoom;
      const first = Math.max(1, Math.floor((cam.x - halfView) / CAM.PANEL_W) - 0);
      const last = Math.min(20, Math.ceil((cam.x + halfView) / CAM.PANEL_W));
      for (let k = first; k <= last; k++) {
        const sc = sceneByIndex(k);
        if (!sc) continue;
        // 画进 1920×1920 的方格缓冲
        D.buf.clear();
        D.buf.push();
        D.buf.scale(W / 1000, W / 1000);
        sc.render(D.buf, makeCtx(t, k));
        D.buf.pop();
        // 贴到世界坐标上
        const cx = k * CAM.PANEL_W;
        g.push();
        g.translate(W / 2, H / 2);
        g.scale(cam.zoom, cam.zoom);
        g.rotate(cam.roll);
        g.translate(-cam.x, 0);
        g.image(D.buf, cx - W / 2, -W / 2, W, W);   // 方格中心对齐画面中心
        g.pop();
      }
    }
    g.pop();
  }

  // ---- 预览运行时 ----
  let lastMs = 0;
  function tick(p) {
    const now = p.millis();
    const dt = lastMs ? Math.min(0.1, (now - lastMs) / 1000) : 0;
    lastMs = now;
    if (D.frozen) {
      D.t = D.frozenT;
    } else if (D.playing) {
      D.t += dt;
      if (D.t > B.TOTAL) D.t = 0;
    }
    // 快到结尾时把展墙要用的定格烘出来（每帧 1 张，摊薄卡顿）
    if (D.t > B.BLOCKS_END - 2.5 && D.bakeNext < 20) bakeOne(D.bakeNext++);
    renderFrame(p, D.t);
    if (D.onTime) D.onTime(D.t);
  }

  function seek(t) {
    D.t = Math.max(0, Math.min(B.TOTAL - 1e-3, t));
    D.frozenT = D.t;
  }
  function freeze(t) { D.frozen = true; seek(t); }
  function unfreeze() { D.frozen = false; }

  P.director = {
    W, H, D, init, renderFrame, tick, seek, sceneList, sceneByIndex, makeCtx,
    get t() { return D.t; },
    set t(v) { D.t = v; },
    freeze, unfreeze,
    play: function () { D.playing = true; },
    pause: function () { D.playing = false; },
    isPlaying: function () { return D.playing; },
    bakeAll: function () { while (D.bakeNext < 20) bakeOne(D.bakeNext++); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
