# Test Plan and Results

## Risks (highest first)
1. Wrong total (price/quantity math, stale totals after edits).
2. Duplicate order / double confirmation on repeated Place Order.
3. Checkout allowed with empty cart or blank name.
4. Validation loses what the customer entered.
5. Invalid quantities (0, negative, blank, huge, decimal).
6. Confirmation without a reference, or name rendered as HTML (XSS).

## Cases
| ID | Case | Type | Expected | Result |
|----|------|------|----------|--------|
| A1 | Add Notebook, enter name, Place Order | Automated | One confirmation, `ORD-` reference, button disabled | Pass |
| A2 | Pen Set in cart, blank name, Place Order | Automated | "Please enter your full name.", no confirmation, cart kept | Pass |
| A3 | Notebook qty 3, Pen +1 | Automated | $13.50 / $25.50 lines, $39.00 total | Pass |
| M1 | Empty cart, name filled, Place Order | Manual (scripted, `evidence/m1-empty-cart.png`) | Empty-cart message, no confirmation, name kept | Pass: message shown, name "Grace Hopper" preserved |
| M2 | Rapid double-click (+ triple click) on Place Order | Manual (scripted, `evidence/m2-double-click.png`) | One confirmation, one reference | Pass: 1 visible confirmation |
| M3 | Qty 0 / blank / 150 / 2.5 | Not run | Clamped to 1..99 integer | Not executed; logic exists in `setQty` |

## Defects
No open defects were found by M1/M2.

Two defects were found in my first build by automated check A3 and fixed before the final run:
- **D1 Totals stale while typing a quantity.** Steps: add Notebook, type 3 in quantity. Expected $13.50; actual $4.50 until the field lost focus (only a `change` handler). Fix: live `input` handler.
- **D2 First +/- click after typing is lost.** Steps: type a quantity, then click "Increase". Expected qty+1; actual unchanged, because the blur re-rendered the table and replaced the button mid-click. Fix: re-render on `change` only when the value is invalid.
Evidence: failing runs showed `Expected "$13.50", Received "$4.50"` and `Expected "$25.50", Received "$12.75"`.

## Limitations
Chromium only; no mobile or accessibility audit; M3 not executed.
