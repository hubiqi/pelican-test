#!/usr/bin/env node
/* shot.mjs — 抓单帧
 * 用法: node tools/shot.mjs <t> <out.png> [--page public/index.html]
 *      node tools/shot.mjs --sheet "1,7,13,19" sheet.png --cols 4
 */
import puppeteer from 'puppeteer-core';
import { startServer, chromePath } from './server.mjs';

const args = process.argv.slice(2);
const sheetMode = args[0] === '--sheet';
const times = sheetMode ? args[1] : args[0];
const out = sheetMode ? args[2] : args[1];

const opt = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--cols') opt.cols = args[++i];
  if (args[i] === '--w') opt.w = args[++i];
  if (args[i] === '--page') opt.page = args[++i];
}

const { server, port } = await startServer(0);
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-device-scale-factor=1'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });

let url, clip;
if (sheetMode) {
  url = `http://127.0.0.1:${port}/public/sheet.html?v=0&t=${times}&cols=${opt.cols || 4}&w=${opt.w || 480}`;
} else {
  url = `http://127.0.0.1:${port}/${opt.page || 'public/index.html'}?v=0&t=${times}&play=0&ui=0`;
  clip = { x: 0, y: 0, width: 1920, height: 1080 };
}
await page.goto(url, { waitUntil: 'load', timeout: 120000 });
await page.waitForFunction('window.__READY__ === true', { timeout: 300000, polling: 200 });
if (sheetMode) {
  const box = await page.evaluate(() => {
    const c = document.getElementById('grid');
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, width: c.width, height: c.height };
  });
  await page.setViewport({ width: Math.max(400, Math.ceil(box.width)), height: Math.max(400, Math.ceil(box.height)), deviceScaleFactor: 1 });
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: out, fullPage: true });
} else {
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: out, clip });
}
const errs = await page.evaluate(() => (window.__ERRS__ || []).slice(0, 5));
if (errs.length) console.error('页面报错:', errs);
console.log('saved', out);
await browser.close();
server.close();
