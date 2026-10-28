/* rig.js — 鹈鹕 + 自行车的参数化骨骼木偶。
 *
 * 一套姿势，交给 20 种画风各自的绘制函数。只要都调用 solve(t)，
 * 换风格时动作就完全连续（脚踏、车轮、点头永远对得上拍）。
 *
 * 坐标：原点 = 两轮之间地面点，y 轴向下为正（p5 习惯），所以车在 y<0。
 * 单位：设计单位（1000 宽的画面里，整车约 250 单位长）。
 */
(function (root) {
  const P = (root.PEL = root.PEL || {});
  const B = root.PEL.beat;
  const K = root.PEL.kit;
  const TAU = Math.PI * 2;

  const R = 56;
  const GEO = {
    R,
    rear: { x: -118, y: -R },
    front: { x: 118, y: -R },
    bb: { x: -8, y: -52 },
    seat: { x: -74, y: -142 },
    headTop: { x: 74, y: -148 },
    bar: { x: 96, y: -160 },
    crank: 25,
    chainring: 21,
    cog: 11,
  };

  const RIDER = {
    hip: { x: -50, y: -158 },
    bodyC: { x: -16, y: -200 },
    bodyRot: -13 * Math.PI / 180,
    shoulder: { x: 16, y: -216 },
    headC: { x: 84, y: -254 },
    headR: 15.5,
    thigh: 62, shin: 64,
    upperArm: 42, foreArm: 44,
  };

  // 身体轮廓（局部坐标，绕 bodyC 旋转），含尾端
  const BODY_LOCAL = [
    { x: -86, y: -30 }, { x: -62, y: -50 }, { x: -26, y: -56 }, { x: 12, y: -52 },
    { x: 40, y: -34 }, { x: 46, y: -12 }, { x: 26, y: 8 }, { x: -12, y: 12 },
    { x: -50, y: 6 }, { x: -74, y: -6 },
  ];
  // 收起的翅膀（贴着身体的一块，局部坐标）
  const WING_LOCAL = [
    { x: -50, y: -30 }, { x: -20, y: -40 }, { x: 10, y: -36 }, { x: 30, y: -22 },
    { x: 24, y: -2 }, { x: 2, y: 6 }, { x: -34, y: 0 },
  ];

  function ik2(root_, target, l1, l2, bend) {
    let dx = target.x - root_.x, dy = target.y - root_.y;
    let d = Math.hypot(dx, dy) || 1e-6;
    const maxD = (l1 + l2) * 0.999;
    const minD = Math.abs(l1 - l2) * 1.001 + 0.001;
    if (d > maxD) { const s = maxD / d; dx *= s; dy *= s; d = maxD; }
    if (d < minD) { const s = minD / d; dx *= s; dy *= s; d = minD; }
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const ux = dx / d, uy = dy / d;
    return { x: root_.x + ux * a + bend * (-uy) * h, y: root_.y + uy * a + bend * ux * h };
  }

  function toWorld(local, origin, rot) {
    const c = Math.cos(rot), s = Math.sin(rot);
    return local.map(function (q) {
      return { x: origin.x + q.x * c - q.y * s, y: origin.y + q.x * s + q.y * c };
    });
  }

  function solve(t, opt) {
    const o = opt || {};
    const phase = o.phase === undefined ? 0 : o.phase;
    const theta = B.pedalAngle(t + phase);          // 曲柄：1 圈 / 秒
    const wheelA = B.wheelAngle(t + phase);

    const pedalA = { x: GEO.bb.x + Math.cos(theta) * GEO.crank, y: GEO.bb.y + Math.sin(theta) * GEO.crank };
    const pedalB = { x: GEO.bb.x - Math.cos(theta) * GEO.crank, y: GEO.bb.y - Math.sin(theta) * GEO.crank };

    const bob = Math.sin(theta * 2) * 2.0;
    const sway = Math.sin(theta * 2 + 0.5) * 1.4;

    const hip = { x: RIDER.hip.x + sway * 0.4, y: RIDER.hip.y + bob * 0.5 };
    const shoulder = { x: RIDER.shoulder.x + sway, y: RIDER.shoulder.y + bob };
    const headC = { x: RIDER.headC.x + sway * 1.1, y: RIDER.headC.y + bob * 1.2 };
    const bodyC = { x: RIDER.bodyC.x + sway * 0.5, y: RIDER.bodyC.y + bob * 0.7 };

    const neck = [
      { x: shoulder.x - 12, y: shoulder.y + 4 },
      { x: shoulder.x + 14, y: shoulder.y - 16 + bob * 0.3 },
      { x: shoulder.x + 40, y: shoulder.y - 30 + bob * 0.6 },
      { x: headC.x - 12, y: headC.y + 10 },
    ];

    const body = toWorld(BODY_LOCAL, bodyC, RIDER.bodyRot);
    const wing = toWorld(WING_LOCAL, bodyC, RIDER.bodyRot);

    const beakRoot = { x: headC.x + 8, y: headC.y - 3 };
    const beakTip = { x: beakRoot.x + 96, y: beakRoot.y + 8 };
    const pouch = [
      { x: beakTip.x, y: beakTip.y + 1 },
      { x: beakTip.x - 16, y: beakTip.y + 18 },
      { x: beakRoot.x + 42, y: beakRoot.y + 30 },
      { x: beakRoot.x + 12, y: beakRoot.y + 22 },
      { x: beakRoot.x + 1, y: beakRoot.y + 9 },
    ];

    const legNear = { hip, knee: ik2(hip, pedalA, RIDER.thigh, RIDER.shin, 1), foot: pedalA };
    const hipFar = { x: hip.x - 7, y: hip.y - 3 };
    const legFar = { hip: hipFar, knee: ik2(hipFar, pedalB, RIDER.thigh, RIDER.shin, 1), foot: pedalB };

    const armNear = { shoulder, elbow: ik2(shoulder, GEO.bar, RIDER.upperArm, RIDER.foreArm, -1), hand: GEO.bar };
    const shFar = { x: shoulder.x - 8, y: shoulder.y + 3 };
    const barFar = { x: GEO.bar.x - 14, y: GEO.bar.y + 4 };
    const armFar = { shoulder: shFar, elbow: ik2(shFar, barFar, RIDER.upperArm, RIDER.foreArm, -1), hand: barFar };

    return {
      t, theta, wheelA, geo: GEO, rider: RIDER,
      hip, shoulder, headC, bodyC, body, wing, neck, beakRoot, beakTip, pouch, bob,
      legs: { near: legNear, far: legFar },
      arms: { near: armNear, far: armFar },
      pedals: { a: pedalA, b: pedalB },
      wheel: { R: GEO.R, angle: wheelA },
    };
  }

  // ---------- 默认绘制（中性版；各场景会用同一份 pose 自己重画） ----------
  // style: 'fill' | 'line' | 'silhouette'
  function paint(g, p, style, opt) {
    const o = Object.assign({
      ink: [32, 30, 28], body: [246, 245, 240], accent: [216, 140, 76],
      w: 2.4, alpha: 1, back: 0.4,
    }, opt || {});
    const ink = o.ink, solid = style === 'silhouette', lineOnly = style === 'line';
    const F = p.geo;
    const A = o.alpha;

    function st(w, a) {
      g.stroke(ink[0], ink[1], ink[2], 255 * (a === undefined ? 1 : a) * A);
      g.strokeWeight(w);
      g.strokeCap('round'); g.strokeJoin('round');
    }
    function fl(c, a) {
      if (lineOnly || solid) { g.noFill(); return; }
      g.fill(c[0], c[1], c[2], 255 * (a === undefined ? 1 : a) * A);
    }
    function shapePts(pts, close, spl) {
      g.beginShape();
      (spl ? K.spline(pts.concat(close ? [pts[0]] : []), 6) : pts.map(function (q) { return [q.x, q.y]; }))
        .forEach(function (q) { g.vertex(q[0], q[1]); });
      if (close) g.endShape('close'); else g.endShape();
    }

    g.push();

    // ---- 车轮 ----
    [F.rear, F.front].forEach(function (hub) {
      g.push();
      g.translate(hub.x, hub.y);
      const r = p.wheel.R;
      if (solid) {
        g.noStroke(); g.fill(ink[0], ink[1], ink[2], 255 * A);
        g.ellipse(0, 0, r * 2, r * 2);
      } else {
        st(o.w * 2.0); fl(o.body, 0.55);
        g.ellipse(0, 0, r * 2, r * 2);
        g.push(); g.rotate(p.wheel.angle);
        for (let s = 0; s < 10; s++) {
          const a = (s / 10) * TAU;
          st(o.w * 0.45, 0.75);
          g.line(Math.cos(a) * 5, Math.sin(a) * 5, Math.cos(a) * (r - 2), Math.sin(a) * (r - 2));
        }
        g.pop();
        st(o.w * 1.0); g.noFill(); g.ellipse(0, 0, r * 0.45, r * 0.45);
      }
      g.pop();
    });

    // ---- 车架 ----
    const tubes = [[F.bb, F.seat], [F.seat, F.headTop], [F.headTop, F.bb], [F.bb, F.rear], [F.seat, F.rear], [F.headTop, F.front]];
    st(o.w * (solid ? 3.2 : 1.8));
    g.line(F.headTop.x, F.headTop.y, F.headTop.x + 8, F.headTop.y + 4);
    tubes.forEach(function (t2) { g.line(t2[0].x, t2[0].y, t2[1].x, t2[1].y); });
    st(o.w * 1.6);
    g.line(F.headTop.x, F.headTop.y, F.bar.x, F.bar.y);
    g.line(F.bar.x, F.bar.y, F.bar.x - 20, F.bar.y - 3);
    g.line(F.seat.x - 20, F.seat.y - 1, F.seat.x + 12, F.seat.y + 2);
    st(o.w * 0.7, 0.7); g.noFill();
    g.ellipse(F.bb.x, F.bb.y, F.chainring * 2, F.chainring * 2);
    g.ellipse(F.rear.x, F.rear.y, F.cog * 2, F.cog * 2);
    g.line(F.bb.x, F.bb.y - F.chainring, F.rear.x, F.rear.y - F.cog);
    g.line(F.bb.x, F.bb.y + F.chainring, F.rear.x, F.rear.y + F.cog);
    st(o.w * 1.5);
    g.line(F.bb.x, F.bb.y, p.pedals.a.x, p.pedals.a.y);
    g.line(F.bb.x, F.bb.y, p.pedals.b.x, p.pedals.b.y);
    st(o.w * 2.0);
    g.line(p.pedals.a.x - 6, p.pedals.a.y, p.pedals.a.x + 8, p.pedals.a.y);
    g.line(p.pedals.b.x - 6, p.pedals.b.y, p.pedals.b.x + 8, p.pedals.b.y);

    // ---- 腿 ----
    function limb(seg, w, a, legCol) {
      const lc = solid ? ink : (legCol || o.accent);
      if (solid) { st(w * 1.1, a); }
      else {
        st(w * 1.5, a);
        g.line(seg.hip.x, seg.hip.y, seg.knee.x, seg.knee.y);
        g.line(seg.knee.x, seg.knee.y, seg.foot.x, seg.foot.y);
        st(w * 0.95, a);
        g.stroke(lc[0], lc[1], lc[2], 255 * a * A);
      }
      g.line(seg.hip.x, seg.hip.y, seg.knee.x, seg.knee.y);
      g.line(seg.knee.x, seg.knee.y, seg.foot.x, seg.foot.y);
      g.push();
      fl(lc, a); st(w * 0.5, a);
      g.beginShape();
      g.vertex(seg.foot.x - 6, seg.foot.y - 1);
      g.vertex(seg.foot.x + 15, seg.foot.y - 5);
      g.vertex(seg.foot.x + 13, seg.foot.y + 5);
      g.endShape('close');
      g.pop();
    }

    // ---- 翅膀（伸向车把的前臂）----
    function arm(seg, w, a, col) {
      if (solid) { st(w * 2.2, a); }
      else {
        st(w * 1.5, a);
        g.line(seg.shoulder.x, seg.shoulder.y, seg.elbow.x, seg.elbow.y);
        g.line(seg.elbow.x, seg.elbow.y, seg.hand.x, seg.hand.y);
        st(w * 1.0, a);
        g.stroke(col[0], col[1], col[2], 255 * a * A);
      }
      g.line(seg.shoulder.x, seg.shoulder.y, seg.elbow.x, seg.elbow.y);
      g.line(seg.elbow.x, seg.elbow.y, seg.hand.x, seg.hand.y);
    }

    const bodyCol = solid ? ink : o.body;
    limb(p.legs.far, o.w * 1.5, o.back, o.accent);
    arm(p.arms.far, o.w * 3.4, o.back, o.body);

    // ---- 身体（含尾）----
    fl(bodyCol); st(o.w * 1.9);
    shapePts(p.body, true, true);

    // ---- 脖子 ----
    K.tapered(g, p.neck, 16, 10, bodyCol, solid ? null : ink, o.w * 0.95, A);

    // ---- 头 ----
    fl(bodyCol); st(o.w * 1.7);
    g.ellipse(p.headC.x, p.headC.y, p.rider.headR * 2.15, p.rider.headR * 1.95);

    // ---- 喙 ----
    fl(o.accent, 0.95); st(o.w * 1.5);
    g.beginShape();
    g.vertex(p.beakRoot.x, p.beakRoot.y - 5);
    g.vertex(p.beakTip.x, p.beakTip.y - 3);
    K.spline(p.pouch, 8).forEach(function (q) { g.vertex(q[0], q[1]); });
    g.endShape('close');
    st(o.w * 0.85, 0.85);
    g.line(p.beakRoot.x + 2, p.beakRoot.y - 1, p.beakTip.x, p.beakTip.y - 1);

    // 眼
    if (!solid) {
      g.noStroke();
      g.fill(ink[0], ink[1], ink[2], 245 * A);
      g.ellipse(p.headC.x + 6, p.headC.y - 6, 5.2, 5.2);
      g.fill(255, 255, 255, 215 * A);
      g.ellipse(p.headC.x + 7.3, p.headC.y - 7.4, 1.7, 1.7);
    }

    // ---- 近侧腿 ----
    limb(p.legs.near, o.w * 2.0, 1, o.accent);
    // ---- 近侧翅膀：贴身的翅面 + 伸向车把的前臂 ----
    fl(solid ? ink : [Math.min(255, o.body[0] * 0.94), Math.min(255, o.body[1] * 0.94), Math.min(255, o.body[2] * 0.94)]);
    st(o.w * 1.3);
    shapePts(p.wing, true, true);
    arm(p.arms.near, o.w * 3.8, 1, o.body);

    g.pop();
  }

  P.rig = { solve, paint, GEO, RIDER, ik2, BODY_LOCAL, WING_LOCAL };
})(typeof window !== 'undefined' ? window : globalThis);
