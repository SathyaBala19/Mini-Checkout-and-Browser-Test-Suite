// Scripted run of the two manual checks; saves screenshots to evidence/.
// Usage: npx http-server . -p 8080 -s  (in another terminal), then: node tests/manual-evidence.js
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');

  // M1: empty cart
  await page.fill('#name', 'Grace Hopper');
  await page.click('#place-order');
  console.log('M1 error:', await page.textContent('#error'));
  console.log('M1 confirmation hidden:', await page.locator('#confirmation').isHidden());
  console.log('M1 name preserved:', await page.inputValue('#name'));
  await page.screenshot({ path: 'evidence/m1-empty-cart.png' });

  // M2: rapid double-click (and a triple click) on Place Order
  await page.click('[data-add="notebook"]');
  await page.dblclick('#place-order');
  await page.click('#place-order', { force: true, clickCount: 3 });
  console.log('M2 visible confirmations:', await page.locator('[data-testid=confirmation]:visible').count());
  console.log('M2 ref:', await page.textContent('#conf-ref'));
  await page.screenshot({ path: 'evidence/m2-double-click.png' });

  await browser.close();
})();
