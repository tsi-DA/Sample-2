/* ==========================================================================
   Norrland — Site behavior
   Requires products.js to be loaded first on any page that renders
   products or the cart. Cart state lives in localStorage under "norrland_cart"
   as an array of { id, qty }.
   ========================================================================== */

const CART_KEY = "norrland_cart";

/* ---------- Cart storage helpers ---------- */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Could not read cart, resetting.", e);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty) {
  qty = qty || 1;
  const product = typeof getProductById === "function" ? getProductById(id) : null;
  if (!product) {
    console.warn("Unknown product id:", id);
    return;
  }
  const cart = getCart();
  const existing = cart.find(function (item) { return item.id === id; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart(cart);
  showToast(product.name + " added to cart");
}

function removeFromCart(id) {
  const cart = getCart().filter(function (item) { return item.id !== id; });
  saveCart(cart);
  renderCartPage();
}

function setQty(id, qty) {
  qty = parseInt(qty, 10);
  let cart = getCart();
  if (isNaN(qty) || qty < 1) {
    cart = cart.filter(function (item) { return item.id !== id; });
  } else {
    const item = cart.find(function (i) { return i.id === id; });
    if (item) item.qty = qty;
  }
  saveCart(cart);
  renderCartPage();
}

function cartTotalCount() {
  return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function cartTotalPrice() {
  const cart = getCart();
  let total = 0;
  cart.forEach(function (item) {
    const product = getProductById(item.id);
    if (product) total += product.price * item.qty;
  });
  return total;
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cartTotalCount();
}

/* ---------- Rendering: product grid (index + products pages) ---------- */

function renderProductCard(product) {
  return (
    '<article class="card" data-id="' + product.id + '" data-category="' + product.category + '">' +
      '<div class="card__img">' + product.label + '</div>' +
      '<div class="card__body">' +
        '<p class="card__eyebrow">' + product.category + '</p>' +
        '<p class="card__title">' + product.name + '</p>' +
        '<p class="card__price">$' + product.price.toFixed(2) + '</p>' +
        '<button class="card__btn" onclick="addToCart(\'' + product.id + '\', 1)">Add to Cart</button>' +
      '</div>' +
    '</article>'
  );
}

function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  const featured = PRODUCTS.filter(function (p) { return p.featured; });
  grid.innerHTML = featured.map(renderProductCard).join("");
}

function renderProductGrid(filterCategory) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const list = filterCategory && filterCategory !== "All"
    ? PRODUCTS.filter(function (p) { return p.category === filterCategory; })
    : PRODUCTS;
  grid.innerHTML = list.length
    ? list.map(renderProductCard).join("")
    : '<p class="empty-state">No products in this category yet.</p>';
}

function renderCategoryFilters() {
  const wrap = document.getElementById("category-filters");
  if (!wrap) return;
  const categories = ["All"].concat(getCategories());
  wrap.innerHTML = categories.map(function (cat) {
    return '<button class="filter-btn" data-category="' + cat + '" onclick="selectCategory(\'' + cat + '\', this)">' + cat + '</button>';
  }).join("");
  const first = wrap.querySelector('.filter-btn');
  if (first) first.classList.add("is-active");
}

function selectCategory(category, btn) {
  document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
  if (btn) btn.classList.add("is-active");
  renderProductGrid(category);
}

/* ---------- Rendering: cart page ---------- */

function renderCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-state">Your cart is empty. <a href="products.html">Browse the shop →</a></p>';
    const summary = document.getElementById("cart-summary");
    if (summary) summary.style.display = "none";
    return;
  }

  const summary = document.getElementById("cart-summary");
  if (summary) summary.style.display = "";

  container.innerHTML = cart.map(function (item) {
    const product = getProductById(item.id);
    if (!product) return "";
    const lineTotal = (product.price * item.qty).toFixed(2);
    return (
      '<div class="cart-row" data-id="' + product.id + '">' +
        '<div class="cart-row__img">' + product.label + '</div>' +
        '<div class="cart-row__info">' +
          '<p class="cart-row__title">' + product.name + '</p>' +
          '<p class="cart-row__category">' + product.category + '</p>' +
          '<p class="cart-row__price">$' + product.price.toFixed(2) + ' each</p>' +
        '</div>' +
        '<div class="cart-row__qty">' +
          '<label for="qty-' + product.id + '" class="sr-only">Quantity for ' + product.name + '</label>' +
          '<input type="number" id="qty-' + product.id + '" min="1" value="' + item.qty + '" ' +
            'onchange="setQty(\'' + product.id + '\', this.value)">' +
        '</div>' +
        '<div class="cart-row__total">$' + lineTotal + '</div>' +
        '<button class="cart-row__remove" aria-label="Remove ' + product.name + '" onclick="removeFromCart(\'' + product.id + '\')">✕</button>' +
      '</div>'
    );
  }).join("");

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = "$" + cartTotalPrice().toFixed(2);
}

/* ---------- Misc UI ---------- */

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("toast--visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () {
    toast.classList.remove("toast--visible");
  }, 2200);
}

function handleNewsletter(event) {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector('input[type="email"]');
  if (input && input.value) {
    showToast("Subscribed with " + input.value);
    form.reset();
  }
  return false;
}

function handleContact(event) {
  event.preventDefault();
  const form = event.target;
  showToast("Message sent — we'll get back to you soon.");
  form.reset();
  return false;
}

function toggleNav() {
  const links = document.querySelector(".nav__links");
  if (links) links.classList.toggle("nav__links--open");
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  const toggle = document.querySelector(".nav__toggle");
  if (toggle) toggle.addEventListener("click", toggleNav);

  renderFeatured();

  if (document.getElementById("product-grid")) {
    renderCategoryFilters();
    renderProductGrid("All");
  }

  renderCartPage();
});
