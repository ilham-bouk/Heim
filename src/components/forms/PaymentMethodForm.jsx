import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i));

const EMPTY_FORM = { cardholderName: '', cardNumber: '', expMonth: '', expYear: '', isDefault: false };

/**
 * Shared card form (Account → Wallet, Checkout → Payment). UI demo only — in a
 * real integration replace this component with your processor's hosted fields
 * (Stripe Elements, etc.) so raw card data never touches your code.
 *
 * `onSubmit` receives the raw card number ONCE, digits only. Callers must reduce
 * it to brand + last4 immediately (see utils/payment.js) and never persist it.
 *
 * @param {string} [submitLabel='Add Card']
 * @param {boolean} [showDefaultOption=false] - "Set as default" checkbox (Wallet)
 * @param {boolean} [allowSave=false] - "Save to my account" checkbox (Checkout, members only)
 * @param {(values: object, options: {save: boolean}) => void} onSubmit
 * @param {() => void} [onCancel]
 * @param {string} [className]
 */
const PaymentMethodForm = ({
  submitLabel = 'Add Card',
  showDefaultOption = false,
  allowSave = false,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cardNumber = formData.cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) {
      setError('Enter a valid card number');
      return;
    }
    if (!formData.expMonth || !formData.expYear) {
      setError('Select an expiration date');
      return;
    }

    onSubmit({ ...formData, cardNumber }, { save: allowSave && saveToAccount });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-5 rounded-lg border border-border bg-secondary/40 space-y-4 ${className}`}
    >
      <Input name="cardholderName" aria-label="Name on card" autoComplete="cc-name" placeholder="Name on card" value={formData.cardholderName} onChange={handleChange} required />
      <Input name="cardNumber" aria-label="Card number" autoComplete="cc-number" inputMode="numeric" placeholder="Card number" value={formData.cardNumber} onChange={handleChange} required />
      <div className="grid grid-cols-2 gap-4">
        <select
          name="expMonth"
          aria-label="Expiration month"
          autoComplete="cc-exp-month"
          value={formData.expMonth}
          onChange={handleChange}
          required
          className={"w-full px-4 py-2.5 border border-border rounded-lg text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          name="expYear"
          aria-label="Expiration year"
          autoComplete="cc-exp-year"
          value={formData.expYear}
          onChange={handleChange}
          required
          className={"w-full px-4 py-2.5 border border-border rounded-lg text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"}
        >
          <option value="">Year</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {showDefaultOption && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">Set as default payment method</span>
        </label>
      )}

      {allowSave && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={saveToAccount}
            onChange={(e) => setSaveToAccount(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">Save this card to my wallet</span>
        </label>
      )}

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        This is a UI demo — no real payment processor is connected. Only the last 4 digits are stored.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="sm">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
};

export default PaymentMethodForm;