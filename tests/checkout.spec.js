const { test, expect } = require('@playwright/test');

// Playwright gives every test a fresh browser context, so each starts from a clean state.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Your cart is empty.')).toBeVisible();
});

test('successful checkout shows exactly one confirmation with a reference', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Notebook' }).click();
  await page.getByLabel('Full name (required)').fill('Ada Lovelace');
  const place = page.getByRole('button', { name: 'Place Order' });
  await place.click();

  const conf = page.getByTestId('confirmation');
  await expect(conf).toBeVisible();
  await expect(conf).toContainText('Thank you, Ada Lovelace');
  await expect(page.getByTestId('order-ref')).toHaveText(/^ORD-[A-Z0-9]+$/);
  await expect(page.getByTestId('error')).toBeEmpty();
  await expect(page.getByTestId('confirmation')).toHaveCount(1);
  await expect(place).toBeDisabled();
});

test('missing name blocks checkout, shows message, keeps cart', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Pen Set' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByTestId('error')).toHaveText('Please enter your full name.');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  await expect(page.getByTestId('order-total')).toHaveText('$12.75'); // cart preserved
  await expect(page.getByLabel('Pen Set quantity')).toHaveValue('1');
});

test('quantity change updates line total and order total exactly', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Notebook' }).click();   // 4.50
  await page.getByRole('button', { name: 'Add Pen Set' }).click();    // 12.75
  await expect(page.getByTestId('order-total')).toHaveText('$17.25');

  await page.getByLabel('Notebook quantity').fill('3');
  await expect(page.getByTestId('line-notebook')).toHaveText('$13.50');
  await expect(page.getByTestId('order-total')).toHaveText('$26.25');

  await page.getByRole('button', { name: 'Increase Pen Set' }).click();
  await expect(page.getByTestId('line-pen')).toHaveText('$25.50');
  await expect(page.getByTestId('order-total')).toHaveText('$39.00');
});
