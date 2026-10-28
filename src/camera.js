/* camera.js — 贯穿全片的那条路。
 *
 * 世界模型：20 幅画并排挂在一条走廊上，每幅宽 1920（= 一屏）。
 * 第 k 幅的中心在世界坐标 x = k*1920。
 * 镜头大部分时间静止停在第 k 幅上（画面稳、细节能看清），
 * 只在每道画框的位置快速平移过去 —— 平移的中点正好落在强拍上，
 * 于是「穿过画框」= 打点，配合一次轻微推近。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const B = root.PEL.beat;

  const PANEL_W = 1920;
  const PANEL_H = 1080;
  const DESIGN = 1000;                       // 场景设计方格边长
  const COVER = PANEL_W / DESIGN;            // 1.92：设计单位 → 屏幕像素
  const Y_OFFSET = -(PANEL_H / COVER - DESIGN) / 2;  // -218.75：设计方格比 16:9 高，上下各裁这么多

  // 镜头所处的「版块索引」连续值：整数 = 正对该版块，x.5 = 正在穿框
  function camIndex(t, q) {
    const n = (t - B.BLOCKS_START) / B.BLOCK_DUR;   // 版块 1 覆盖 [0,1)
    const qq = q === undefined ? 0.07 : q;
    const u = n + 0.5;
    let k = Math.round(u);
    if (k < 1) k = 1;
    if (k > B.BLOCK_COUNT) k = B.BLOCK_COUNT;
    const m = u - (k - 0.5);                          // 0..1，0.5 = 正对画心
    let h;
    if (m < qq) h = 0.5 * B.smooth(m / qq);
    else if (m > 1 - qq) h = 0.5 + 0.5 * B.smooth((m - (1 - qq)) / qq);
    else h = 0.5;
    return (k - 0.5) + h;
  }

  // 穿框时的推近包络
  function bump(t) {
    let s = 0;
    for (let k = 1; k <= B.BLOCK_COUNT; k++) {
      const d = (t - B.gateTime(k)) / 0.27;
      s += Math.exp(-d * d);
    }
    return Math.min(1, s);
  }

  function state(t) {
    const ci = camIndex(t);
    return {
      index: ci,
      x: ci * PANEL_W,
      zoom: 1 + 0.055 * bump(t),
      bump: bump(t),
      roll: Math.sin(t * 0.7) * 0.0015,
    };
  }

  // 把「第 k 幅」的设计坐标变换到屏幕：调用方负责 save/restore
  function applyPanel(g, cam, k) {
    const cx = k * PANEL_W;
    g.translate(PANEL_W / 2, PANEL_H / 2);      // 屏幕中心
    g.scale(cam.zoom, cam.zoom);
    g.rotate(cam.roll);
    g.translate(-cam.x, 0);                     // 世界 → 相对镜头
    g.translate(cx - PANEL_W / 2, -PANEL_H / 2 + 0);  // 面板左上角
    g.scale(COVER, COVER);                      // 设计单位
    g.translate(0, Y_OFFSET);
  }

  // 设计坐标中的屏幕可见范围（供场景判断安全带）
  const VISIBLE = { top: -Y_OFFSET, bottom: -Y_OFFSET + PANEL_H / COVER };

  P.camera = { PANEL_W, PANEL_H, DESIGN, COVER, Y_OFFSET, VISIBLE, panelX: function (k) { return k * PANEL_W; }, camIndex, bump, state, applyPanel };
})(typeof window !== 'undefined' ? window : globalThis);
