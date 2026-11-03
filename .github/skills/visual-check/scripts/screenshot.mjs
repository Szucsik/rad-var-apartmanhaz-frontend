#!/usr/bin/env node
// Screenshots every section of the running site at many desktop/mobile resolutions and reports
// layout problems (horizontal overflow, page errors). See ../SKILL.md for usage.
//
// playwright-core is resolved from the CURRENT WORKING DIRECTORY (install it in a scratch folder,
// not in the repository), and Google Chrome is used as the browser.

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || 'true'];
}));

const url = args.url ?? 'http://localhost:4200/';
const out = path.resolve(args.out ?? 'screenshots');
const language = args.lang; // hu | pl | en | de; default: whatever the site picks
const settle = Number(args.settle ?? 2200); // ms to wait after each scroll (scroll animations ~1s)

const ALL_SIZES = [
  ['2560x1440', 2560, 1440], ['1920x1080', 1920, 1080], ['1536x864', 1536, 864], ['1440x900', 1440, 900],
  ['1366x768', 1366, 768], ['1280x720', 1280, 720], ['1024x768', 1024, 768],
  ['768x1024', 768, 1024], ['844x390', 844, 390], ['430x932', 430, 932], ['390x844', 390, 844], ['360x640', 360, 640],
];
const sizes = args.sizes
  ? args.sizes.split(',').map(size => { const [w, h] = size.split('x').map(Number); return [size, w, h]; })
  : ALL_SIZES;

const require = createRequire(path.join(process.cwd(), 'noop.js'));
let chromium;
try {
  ({ chromium } = require('playwright-core'));
} catch {
  console.error('playwright-core not found in the current directory. Run: npm i playwright-core');
  process.exit(2);
}

const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' };
const browser = await chromium.launch(launchOptions);
fs.mkdirSync(out, { recursive: true });

const SECTIONS = ['app-home', 'app-gallery', 'app-booking', 'app-history', 'app-contacts'];
let problems = 0;

for (const [name, width, height] of sizes) {
  const mobile = (width < 1024 && width < height) || height <= 500;
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  // Skip the once-per-session intro animation and optionally force a language.
  await context.addInitScript(lang => {
    sessionStorage.setItem('isLoaded', 'testval');
    if (lang) localStorage.setItem('language', lang);
  }, language);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  await page.goto(url);
  await page.waitForSelector('app-loading', { state: 'detached', timeout: 30000 });
  await page.waitForTimeout(2500);

  const layout = await page.evaluate(selectors => ({
    sections: selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return [selector, null, null];
      const rect = element.getBoundingClientRect();
      return [selector, Math.round(rect.top + scrollY), Math.round(rect.height)];
    }),
    documentHeight: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth - innerWidth,
  }), SECTIONS);

  // Scroll through the page viewport by viewport so scroll-triggered animations play before each shot.
  let slice = 0;
  for (let y = 0; y < layout.documentHeight; y += height) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(settle);
    await page.screenshot({ path: path.join(out, `${name}-${String(slice++).padStart(2, '0')}.png`) });
  }

  const flags = [];
  if (layout.overflowX > 0) flags.push(`HORIZONTAL OVERFLOW ${layout.overflowX}px`);
  if (errors.length) flags.push(`${errors.length} PAGE ERROR(S): ${[...new Set(errors)].slice(0, 3).join(' | ')}`);
  problems += flags.length;

  const sections = layout.sections.map(([selector, top, h]) => `${selector.replace('app-', '')}@${top}+${h}`).join(' ');
  console.log(`${name.padEnd(9)} ${String(slice).padStart(2)} shots  ${sections}${flags.length ? '  !! ' + flags.join('; ') : ''}`);
  await context.close();
}

await browser.close();
console.log(`\nScreenshots: ${out}`);
process.exit(problems ? 1 : 0);
