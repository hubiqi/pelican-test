/* beat.js — 全片的时间与节拍基准。
 * 120 BPM：1 拍 0.5 s，1 小节 2 s。
 * Intro 2.5 小节（5 s）→ 20 个版块 × 3 小节（6 s = 120 s）→ Outro 6 小节（12 s）= 137 s ≈ 2:17
 * 所有场景都用「绝对时间 t（秒）」驱动的纯函数，不做帧间状态。
 */
(function (root) {
  const BPM = 120;
  const SPB = 60 / BPM;          // 0.5 s / beat
  const BAR = SPB * 4;           // 2 s / bar

  const BLOCK_COUNT = 20;
  const BLOCK_DUR = BAR * 3;     // 6 s
  const INTRO_DUR = BAR * 2.5;   // 5 s
  const OUTRO_DUR = BAR * 6;     // 12 s

  const BLOCKS_START = INTRO_DUR;                                  // 5
  const BLOCKS_END = BLOCKS_START + BLOCK_COUNT * BLOCK_DUR;        // 125
  const TOTAL = BLOCKS_END + OUTRO_DUR;                            // 137

  const TAU = Math.PI * 2;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const easeInOut = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1));

  // 拍内相位 0..1
  function beatPhase(t) { return (t / SPB) % 1; }
  function barPhase(t) { return (t / BAR) % 1; }
  function beatIndex(t) { return Math.floor(t / SPB); }

  // 强拍冲击包络：拍点上 1，半拍后衰减到 ~0
  function pulse(t, sharpness) {
    const p = beatPhase(t);
    const k = sharpness === undefined ? 5 : sharpness;
    return Math.exp(-p * k);
  }
  // 小节冲击（只在小节头）
  function barPulse(t, sharpness) {
    const p = barPhase(t);
    const k = sharpness === undefined ? 4 : sharpness;
    return Math.exp(-p * k);
  }

  // 时间量化（复古顿挫：皮影戏 / 8-bit / 聊天窗动图用 8~12 次每秒）
  function quantize(t, fps) { return Math.floor(t * fps + 1e-6) / fps; }

  // ---- 版块定位 ------------------------------------------------------------
  // 返回 { index, t0, t1, local, u }；index: 0=intro, 1..20=版块, 21=outro
  function blockAt(t) {
    if (t < BLOCKS_START) return { index: 0, t0: 0, t1: BLOCKS_START, local: t, u: t / BLOCKS_START };
    if (t >= BLOCKS_END) {
      return { index: BLOCK_COUNT + 1, t0: BLOCKS_END, t1: TOTAL, local: t - BLOCKS_END, u: (t - BLOCKS_END) / OUTRO_DUR };
    }
    const i = Math.floor((t - BLOCKS_START) / BLOCK_DUR);      // 0..19
    const t0 = BLOCKS_START + i * BLOCK_DUR;
    const local = t - t0;
    return { index: i + 1, t0, t1: t0 + BLOCK_DUR, local, u: local / BLOCK_DUR };
  }

  // 第 k 个版块的起始时间（k=1..20）；也就是第 k 道画框的通过时刻
  function blockStart(k) { return BLOCKS_START + (k - 1) * BLOCK_DUR; }

  // 通过第 k 道画框（进入第 k 格）所在的强拍时刻
  function gateTime(k) { return blockStart(k); }

  // 脚踏：一圈 = 两拍 = 1 s，全片连续不重来
  function pedalAngle(t) { return TAU * (t / (SPB * 2)); }
  // 车轮：与脚踏 1:1（单速车）
  function wheelAngle(t) { return pedalAngle(t); }

  // 路面滚动距离（设计单位/秒）：轮半径 58 → 弧长 2πR 每转
  const WHEEL_R = 58;
  function roadScroll(t) { return (t / (SPB * 2)) * TAU * WHEEL_R; }

  root.PEL = root.PEL || {};
  root.PEL.beat = {
    BPM, SPB, BAR, TAU,
    BLOCK_COUNT, BLOCK_DUR, INTRO_DUR, OUTRO_DUR,
    BLOCKS_START, BLOCKS_END, OUTRO_START: BLOCKS_END, TOTAL,
    WHEEL_R,
    clamp, smooth, easeInOut,
    beatPhase, barPhase, beatIndex, pulse, barPulse, quantize,
    blockAt, blockStart, gateTime, pedalAngle, wheelAngle, roadScroll,
  };
})(typeof window !== 'undefined' ? window : globalThis);
