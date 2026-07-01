/* ==========================================================================
   Norrland — Product data
   Single source of truth for every product. Referenced by id everywhere
   else (cards, cart, related items) so nothing has to be duplicated.
   ========================================================================== */

const PRODUCTS = [
  {
    id: "p1",
    name: "Ceramic Mug",
    category: "Kitchen",
    price: 18.00,
    label: "Mug",
    featured: true,
    description: "A stoneware mug with a soft matte glaze, thrown for a comfortable grip and a slow morning."
  },
  {
    id: "p2",
    name: "Canvas Tote",
    category: "Bags",
    price: 24.00,
    label: "Tote",
    featured: true,
    description: "Heavyweight cotton canvas with reinforced straps — built to carry groceries, books, or the day's errands."
  },
  {
    id: "p3",
    name: "Wool Throw",
    category: "Home",
    price: 58.00,
    label: "Throw",
    featured: true,
    description: "A lambswool throw woven in a simple twill, warm enough for the coldest evenings by the window."
  },
  {
    id: "p4",
    name: "Oak Candle",
    category: "Home",
    price: 14.00,
    label: "Candle",
    featured: true,
    description: "Soy wax scented with cedar and oakmoss, poured into a reusable oak-toned ceramic vessel."
  },
  {
    id: "p5",
    name: "Linen Napkins",
    category: "Kitchen",
    price: 22.00,
    label: "Napkins",
    featured: false,
    description: "A set of four stonewashed linen napkins that soften with every wash."
  },
  {
    id: "p6",
    name: "Leather Card Holder",
    category: "Bags",
    price: 32.00,
    label: "Card Holder",
    featured: false,
    description: "Vegetable-tanned leather that darkens beautifully with age, sized for cards and a few folded bills."
  },
  {
    id: "p7",
    name: "Stoneware Bowl",
    category: "Kitchen",
    price: 26.00,
    label: "Bowl",
    featured: false,
    description: "A wide, shallow bowl glazed in warm oat — equally at home holding soup or fruit."
  },
  {
    id: "p8",
    name: "Woven Basket",
    category: "Home",
    price: 45.00,
    label: "Basket",
    featured: false,
    description: "Hand-woven seagrass basket for blankets, firewood, or the things that never have a home."
  }
];

/* Helper: look up a single product by id. Returns undefined if not found. */
function getProductById(id) {
  return PRODUCTS.find(function (p) { return p.id === id; });
}

/* Helper: unique list of categories, in first-seen order. */
function getCategories() {
  const seen = [];
  PRODUCTS.forEach(function (p) {
    if (seen.indexOf(p.category) === -1) seen.push(p.category);
  });
  return seen;
}
