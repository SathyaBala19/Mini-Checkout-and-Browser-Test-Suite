# Mini Checkout

Single-page checkout (plain HTML/JS, no backend). Two products: Notebook $4.50, Pen Set $12.75.
Add/remove items, change quantities (typing, +/-), line and order totals update, name is required,
success shows a confirmation with an `ORD-...` reference. Place Order can only succeed once.

## Run

```bash
npm install
npm start          # http://localhost:8080
```

## Automated tests (Playwright, Chromium)

```bash
npx playwright install chromium   # first time only
npm test
```

Three checks in `tests/checkout.spec.js`: successful checkout, missing name blocks checkout,
quantity change gives exact totals. Each test gets a fresh browser context (clean state) and
asserts on visible text with auto-waiting; there are no fixed sleeps.

## Manual browser steps

1. Open http://localhost:8080 with the cart empty, type a name, click **Place Order**: expect the
   "cart is empty" message, no confirmation, name kept.
2. Add Notebook, double-click **Place Order** quickly: expect exactly one confirmation and one reference.

`node tests/manual-evidence.js` (with the server running) scripts both and writes screenshots to `evidence/`.

See [TEST_PLAN.md](TEST_PLAN.md) for risks, cases and results.
