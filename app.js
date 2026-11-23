(function () {
  const PRODUCTS = [
    { id: 'notebook', name: 'Notebook', cents: 450 },
    { id: 'pen', name: 'Pen Set', cents: 1275 },
  ];
  const MAX_QTY = 99;
  let cart = {};       // id -> qty
  let placed = false;

  const $ = (id) => document.getElementById(id);
  const money = (c) => '$' + (c / 100).toFixed(2);
  const find = (id) => PRODUCTS.find((p) => p.id === id);
  const total = () => Object.entries(cart).reduce((s, [id, q]) => s + find(id).cents * q, 0);
  const clearError = () => { $('error').textContent = ''; };

  function renderProducts() {
    $('products').innerHTML = PRODUCTS.map((p) =>
      `<li>${p.name} - ${money(p.cents)} <button type="button" data-add="${p.id}">Add ${p.name}</button></li>`).join('');
  }

  function renderCart() {
    const ids = Object.keys(cart);
    const dis = placed ? 'disabled' : '';
    $('empty-cart').hidden = ids.length > 0;
    $('cart-table').hidden = ids.length === 0;
    $('cart-body').innerHTML = ids.map((id) => {
      const p = find(id), q = cart[id];
      return `<tr data-row="${id}">
        <td>${p.name}</td><td>${money(p.cents)}</td>
        <td><button type="button" data-dec="${id}" aria-label="Decrease ${p.name}" ${dis}>-</button>
            <input type="number" min="1" max="${MAX_QTY}" value="${q}" data-qty="${id}" aria-label="${p.name} quantity" ${dis}>
            <button type="button" data-inc="${id}" aria-label="Increase ${p.name}" ${dis}>+</button></td>
        <td data-testid="line-${id}">${money(p.cents * q)}</td>
        <td><button type="button" data-remove="${id}" ${dis}>Remove ${p.name}</button></td></tr>`;
    }).join('');
    $('order-total').textContent = money(total());
    document.querySelectorAll('[data-add]').forEach((b) => { b.disabled = placed; });
  }

  function setQty(id, q) {
    q = Math.floor(Number(q));
    if (!Number.isFinite(q) || q < 1) q = 1;
    cart[id] = Math.min(q, MAX_QTY);
    clearError(); renderCart();
  }

  document.addEventListener('click', (e) => {
    if (placed) return;
    const d = e.target.dataset;
    if (d.add) setQty(d.add, (cart[d.add] || 0) + 1);
    else if (d.inc) setQty(d.inc, cart[d.inc] + 1);
    else if (d.dec) {
      if (cart[d.dec] <= 1) delete cart[d.dec]; else cart[d.dec]--;
      clearError(); renderCart();
    } else if (d.remove) { delete cart[d.remove]; clearError(); renderCart(); }
  });
  // Live update while typing, without re-rendering (keeps focus/caret in the field).
  document.addEventListener('input', (e) => {
    const id = e.target.dataset && e.target.dataset.qty;
    if (placed || !id) return;
    const q = Number(e.target.value);
    if (!Number.isInteger(q) || q < 1 || q > MAX_QTY) return;
    cart[id] = q;
    document.querySelector(`[data-testid="line-${id}"]`).textContent = money(find(id).cents * q);
    $('order-total').textContent = money(total());
    clearError();
  });
  document.addEventListener('change', (e) => {
    const id = e.target.dataset.qty;
    if (placed || !id) return;
    const q = Number(e.target.value);
    // Re-render only to correct an invalid entry; re-rendering on every blur
    // would replace the button being clicked and swallow that click.
    if (Number.isInteger(q) && q >= 1 && q <= MAX_QTY) return;
    setQty(id, q);
  });

  $('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (placed) return;                       // double-submit guard
    const name = $('name').value.trim();
    if (Object.keys(cart).length === 0) { $('error').textContent = 'Your cart is empty. Add at least one item.'; return; }
    if (!name) { $('error').textContent = 'Please enter your full name.'; $('name').focus(); return; }
    placed = true;
    $('place-order').disabled = true;
    $('name').disabled = true;
    clearError();
    $('conf-name').textContent = name;        // textContent: no HTML injection
    $('conf-ref').textContent = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    $('conf-total').textContent = money(total());
    $('confirmation').hidden = false;
    renderCart();
  });

  $('new-order').addEventListener('click', () => {
    cart = {}; placed = false;
    $('name').value = ''; $('name').disabled = false;
    $('place-order').disabled = false;
    $('confirmation').hidden = true;
    clearError(); renderCart();
  });

  renderProducts(); renderCart();
})();
