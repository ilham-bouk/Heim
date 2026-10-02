// Card helpers shared by PaymentMethodContext and Checkout.
// The full card number must never be persisted: only the derived brand + last4.

export const detectBrand = (cardNumber) => {
  const digit = cardNumber.trim()[0];
  if (digit === '4') return 'Visa';
  if (digit === '5') return 'Mastercard';
  if (digit === '3') return 'Amex';
  if (digit === '6') return 'Discover';
  return 'Card';
};

/** Safe-to-store description of a card (no full number). */
export const toPaymentSnapshot = ({ cardNumber, cardholderName, expMonth, expYear }) => ({
  brand: detectBrand(cardNumber),
  last4: cardNumber.trim().slice(-4),
  expMonth,
  expYear,
  cardholderName,
});