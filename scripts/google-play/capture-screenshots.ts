import { test, expect, Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('play-store-assets/phone/portrait');

async function waitStable(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => document.fonts?.status === 'loaded');
  await page.waitForTimeout(1200);
}

test('capture store screenshots from deterministic mode', async ({ page, baseURL }) => {
  await mkdir(OUT, { recursive: true });
  const url = `${baseURL}/?capture=1`;
  const captureFromHome = async (buttonLabel: string, outputName: string) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await waitStable(page);
    const trigger = page.getByText(buttonLabel, { exact: true });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await waitStable(page);
    await page.screenshot({ path: path.join(OUT, outputName) });
  };

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitStable(page);
  await page.screenshot({ path: path.join(OUT, '01-home.png') });

  await captureFromHome('Capture: Theory', '02-theory.png');
  await captureFromHome('Capture: Staff', '03-staff.png');
  await captureFromHome('Capture: Fretboard', '04-fretboard.png');
  await captureFromHome('Capture: Reading', '05-reading.png');
  await captureFromHome('Capture: Practice', '07-practice.png');
  await captureFromHome('Capture: Progress', '08-progress.png');

  // Feedback capture from quiz flow.
  await captureFromHome('Capture: Quiz', '06-feedback.png');
  await waitStable(page);
  const wrong = page.getByText('Fa / F', { exact: true }).first();
  await wrong.click();
  await waitStable(page);
  await page.screenshot({ path: path.join(OUT, '06-feedback.png') });
});
