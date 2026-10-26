/**
 * Final price after a product's discount percentage, if any.
 * Rounds down to whole currency units (this mock catalog has no cents).
 * @param {{price: number, discount?: number}} item
 * @returns {number}
 */
export const getFinalPrice = (item) =>
  item.discount
    ? Math.floor(item.price - (item.price * (item.discount / 100)))
    : item.price;

/**
 * Tailwind classes for a product's badge pill, keyed by badge text.
 * Every variant is a solid token background with light text (4.5:1 or better).
 * Unrecognized badges fall back to the accent style.
 * @param {string} badge - e.g. 'Sale', 'New', 'Bestseller'
 */
export const getBadgeClass = (badge) => {
  if (badge === 'Sale') return 'bg-destructive text-primary-foreground';
  if (badge === 'New') return 'bg-primary text-primary-foreground';
  if (badge === 'Bestseller') return 'bg-success-text text-primary-foreground';
  return 'bg-accent-text text-primary-foreground';
};