/**
+ * Final price after a product's discount percentage, if any.
+ * Rounds down to whole currency units (this mock catalog has no cents).
+ * @param {{price: number, discount?: number}} item
+ * @returns {number}
+ */
export const getFinalPrice = (item) =>
  item.discount
    ? Math.floor(item.price - (item.price * (item.discount / 100)))
    : item.price;

/**
+ * Tailwind classes for a product's badge pill, keyed by badge text.
+ * Unrecognized badges fall back to the "other" purple style.
+ * @param {string} badge - e.g. 'Sale', 'New', 'Bestseller'
+ */
export const getBadgeClass = (badge) => {
  if (badge === 'Sale') return 'bg-red-500 text-white';
  if (badge === 'New') return 'bg-blue-500 text-white';
  return 'bg-purple-500 text-white';
};