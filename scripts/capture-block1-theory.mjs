#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';

const BASE = process.env.APP_URL ?? 'http://localhost:8081';
const OUT = path.resolve('docs/qa/screenshots');
const stamp = process.env.SCREENSHOT_TAG ?? 'mvp-start';

async function capture() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const homePath = path.join(OUT, `home-${stamp}.png`);
  await page.screenshot({ path: homePath, fullPage: true });
  console.log(`Saved ${homePath}`);

  // First lesson on fresh path: Bienvenida (block 1)
  await page.getByText('Bienvenida', { exact: true }).click();
  await page.waitForTimeout(1500);

  const bienvenidaPath = path.join(OUT, `block1-bienvenida-${stamp}.png`);
  await page.screenshot({ path: bienvenidaPath, fullPage: true });
  console.log(`Saved ${bienvenidaPath}`);

  await page.goBack();
  await page.waitForTimeout(1000);

  await page.getByText('La primera cuerda', { exact: true }).click();
  await page.waitForTimeout(1500);

  const theory1Path = path.join(OUT, `block1-theory1-${stamp}.png`);
  await page.screenshot({ path: theory1Path, fullPage: true });
  console.log(`Saved ${theory1Path}`);

  await browser.close();
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
