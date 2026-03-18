import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Clear localStorage to ensure clean state
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('page loads with heading', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Meeting Cost');
});

test('add attendee increases count', async ({ page }) => {
  // Default has 2 attendees
  const heading = page.getByRole('heading', { name: /Attendees/ });
  await expect(heading).toContainText('(2)');

  await page.getByRole('button', { name: '+ Add' }).click();
  await expect(heading).toContainText('(3)');
});

test('role selection updates dropdown value', async ({ page }) => {
  // First attendee dropdown — change it to Director
  const selects = page.locator('.attendee-row select');
  const firstSelect = selects.first();
  await firstSelect.selectOption('director');
  await expect(firstSelect).toHaveValue('director');
});

test('start timer and cost increments', async ({ page }) => {
  const startBtn = page.getByRole('button', { name: /Start/ });
  await startBtn.click();

  // Wait a bit for cost to accumulate
  await page.waitForTimeout(1500);

  const tickerAmount = page.locator('.ticker-amount');
  const costText = await tickerAmount.textContent();
  const costValue = parseFloat(costText!.replace(/,/g, ''));
  expect(costValue).toBeGreaterThan(0);
});

test('pause timer stops cost from changing', async ({ page }) => {
  // Start
  await page.getByRole('button', { name: /Start/ }).click();
  await page.waitForTimeout(1200);

  // Pause
  await page.getByRole('button', { name: /Pause/ }).click();
  await page.waitForTimeout(300);

  // Record cost after pause
  const costAfterPause = await page.locator('.ticker-amount').textContent();

  // Wait and verify cost hasn't changed
  await page.waitForTimeout(1000);
  const costLater = await page.locator('.ticker-amount').textContent();
  expect(costAfterPause).toBe(costLater);
});

test('cost projections table shows preset durations', async ({ page }) => {
  // The projections table should be visible below the timer
  await expect(page.getByRole('heading', { name: /Cost Projections/ })).toBeVisible();

  // Should show preset duration rows (5, 15, 30, 60 min)
  const table = page.locator('.quick-calc-table');
  await expect(table).toBeVisible();
  const rows = table.locator('tbody tr');
  const count = await rows.count();
  // 4 presets + 1 custom input row
  expect(count).toBeGreaterThanOrEqual(5);
});

test('cost projections custom minutes input works', async ({ page }) => {
  const customInput = page.locator('.custom-minutes-input');
  await customInput.fill('90');

  // The custom row should now show a cost value
  const lastCostCell = page.locator('.quick-calc-table tbody tr:last-child .cost-cell');
  const text = await lastCostCell.textContent();
  expect(text).toMatch(/\$[\d,.]+/);
});

test('meeting stats shows per-minute and coffees', async ({ page }) => {
  // Stats section is visible in timer mode
  await expect(page.locator('.meeting-stats')).toBeVisible();

  // Check Per Minute stat exists
  await expect(page.locator('.stat-label', { hasText: 'Per Minute' })).toBeVisible();

  // Check Coffees stat exists
  await expect(page.locator('.stat-label', { hasText: 'Coffees' })).toBeVisible();
});

test('reset clears cost to zero', async ({ page }) => {
  // Start timer
  await page.getByRole('button', { name: /Start/ }).click();
  await page.waitForTimeout(1200);

  // Pause first (reset is enabled when elapsed > 0)
  await page.getByRole('button', { name: /Pause/ }).click();

  // Click reset
  await page.getByRole('button', { name: /Reset/ }).click();

  // Cost should be $0.00
  const costText = await page.locator('.ticker-amount').textContent();
  expect(costText).toBe('0.00');
});
