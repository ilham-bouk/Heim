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

/** 13 to 19 digits that pass the Luhn checksum (spaces are ignored). */
export const isValidCardNumber = (cardNumber) => {
  const digits = cardNumber.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
};

/** A card is valid through the END of its expiry month. */
export const isCardExpired = (expMonth, expYear, now = new Date()) => {
  const year = Number(expYear);
  const month = Number(expMonth);
  return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
};

/** Safe-to-store description of a card (no full number). */
export const toPaymentSnapshot = ({ cardNumber, cardholderName, expMonth, expYear }) => ({
  brand: detectBrand(cardNumber),
  last4: cardNumber.trim().slice(-4),
  expMonth,
  expYear,
  cardholderName,
});