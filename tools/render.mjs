#!/usr/bin/env node
/* render.mjs — 逐帧渲染（Puppeteer 驱动同一份页面，按 t 求值）
 * 用法:
 *   node tools/render.mjs --fps 60 --from 0 --to 137 --out frames
 *   node tools/render.mjs --fps 60 --from 0 --to 20 --out frames --step 1
 * 说明: 每个时间点都是纯函数求值，可以任意断点续跑（跳过已存在的帧）。
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { startServer, chromePath } from './server.mjs';

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i > 0 ? process.argv[i + 1] : d;
};
const FPS = parseFloat(arg('fps', '60'));
const FROM = parseFloat(arg('from', '0'));
const TO = parseFloat(arg('to', '137'));
const OUT = arg('out', 'frames');
const STEP = parseFloat(arg('step', '1'));   // 1 = 每帧都出；2 = 隔一帧
const W = parseInt(arg('w', '1920'), 10);
const H = parseInt(arg('h', '1080'), 10);

fs.mkdirSync(OUT, { recursive: true });
const { server, port } = await startServer(0);
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-device-scale-factor=1'],
  defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('[pageerror]', e.message));

await page.goto(`http://127.0.0.1:${port}/public/index.html?v=0&t=0&play=0&ui=0&bake=512`, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 300000, polling: 200 });
await page.evaluate(() => { PEL.director.bakeAll(); });

const total = Math.floor((TO - FROM) * FPS / STEP);
let done = 0;
const t0 = Date.now();
for (let n = 0; n < total; n++) {
  const t = FROM + (n * STEP) / FPS;
  const idx = Math.round(t * FPS);
  const file = path.join(OUT, String(idx).padStart(6, '0') + '.png');
  if (fs.existsSync(file)) { done++; continue; }
  await page.evaluate((tt) => {
    const D = PEL.director;
    D.frozen = true; D.frozenT = tt; D.t = tt;
    D.renderFrame(D.p, tt);
  }, t);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
  done++;
  if (done % 30 === 0) {
    const el = (Date.now() - t0) / 1000;
    console.log(`${done}/${total} 帧  ${(done / el).toFixed(1)} fps  ${el.toFixed(0)}s  当前 t=${t.toFixed(2)}`);
  }
}
console.log(`完成 ${done} 帧 → ${OUT}`);
await browser.close();
server.close();
