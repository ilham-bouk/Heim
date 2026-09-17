export const getFinalPrice = (item) =>
  item.discount
    ? Math.floor(item.price - (item.price * (item.discount / 100)))
    : item.price;

export const getBadgeClass = (badge) => {
  if (badge === 'Sale') return 'bg-red-500 text-white';
  if (badge === 'New') return 'bg-blue-500 text-white';
  return 'bg-purple-500 text-white';
};