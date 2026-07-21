function addToCart(id, qty) {
  qty = qty || 1;

  const product = typeof getProductById === "function"
    ? getProductById(id)
    : null;

  if (!product) {
    console.warn("Unknown product id:", id);
    return;
  }

  const cart = getCart();
  const existing = cart.find(function (item) {
    return item.id === id;
  });

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: id,
      qty: qty
    });
  }

  saveCart(cart);

  /* ---------- Adobe Data Layer ---------- */

  adobeDataLayer.push({
    event: "addToCart",
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: qty
    },
    cta: {
      name: "Add to Cart"
    }
  });

  console.log("Adobe Data Layer:", adobeDataLayer);

  showToast(product.name + " added to cart");
}
