#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';

const BASE = process.env.APP_URL ?? 'http://localhost:8081';
const OUT = path.resolve('docs/qa/screenshots');
const stamp = process.env.SCREENSHOT_TAG ?? 'current';

async function capture() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  const homePath = path.join(OUT, `home-${stamp}.png`);
  await page.screenshot({ path: homePath, fullPage: true });
  console.log(`Saved ${homePath}`);

  const continueBtn = page.getByText('CONTINUAR', { exact: true });
  if (await continueBtn.count()) {
    await continueBtn.click();
    await page.waitForTimeout(2000);
    const theoryPath = path.join(OUT, `theory-${stamp}.png`);
    await page.screenshot({ path: theoryPath, fullPage: true });
    console.log(`Saved ${theoryPath}`);

    for (let i = 0; i < 8; i += 1) {
      const nextBtn = page.getByText('Siguiente', { exact: true });
      const doneBtn = page.getByText('Continuar', { exact: true });
      if (await nextBtn.count()) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      } else if (await doneBtn.count()) {
        await doneBtn.click();
        break;
      } else {
        break;
      }
    }

    await page.waitForTimeout(2000);
    const exercisePath = path.join(OUT, `exercise-${stamp}.png`);
    await page.screenshot({ path: exercisePath, fullPage: true });
    console.log(`Saved ${exercisePath}`);
  }

  await browser.close();
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
