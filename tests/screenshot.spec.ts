import { test } from '@playwright/test';

test('capture app screenshot', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Add a few more attendees with varied roles for visual interest
  await page.getByRole('button', { name: '+ Add' }).click();
  await page.getByRole('button', { name: '+ Add' }).click();

  // Set different roles: Junior, Senior (default), Director, VP
  const selects = page.locator('.attendee-row select');
  await selects.nth(0).selectOption('junior');
  await selects.nth(1).selectOption('senior');
  await selects.nth(2).selectOption('director');
  await selects.nth(3).selectOption('vp');

  // Start the timer and let cost accumulate
  await page.getByRole('button', { name: /Start/ }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /Pause/ }).click();

  // Small delay to ensure the UI is stable after pausing
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'screenshot.png', fullPage: true });
});
