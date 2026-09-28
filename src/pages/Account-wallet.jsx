import { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, CalendarClock, Percent } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { usePaymentMethods } from '../context/PaymentMethodContext';

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i));

const EMPTY_FORM = { cardholderName: '', cardNumber: '', expMonth: '', expYear: '', isDefault: false };

// Illustrative marketing content only — not user data, so it lives here
// rather than mockData.js/a service. A real integration would replace this
// block with your financing partner's own SDK/checkout widget (Affirm,
// Klarna, PayPal Pay Later, etc.).
const FINANCING_OPTIONS = [
  {
    icon: CalendarClock,
    name: 'Pay in 4',
    description: 'Split any order into 4 interest-free payments, billed every 2 weeks.',
  },
  {
    icon: Percent,
    name: 'Monthly Financing',
    description: 'Spread purchases over 3, 6, or 12 months. Rates as low as 0% APR for qualified buyers.',
  },
];

const AccountWallet = () => {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = usePaymentMethods();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const digitsOnly = formData.cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(digitsOnly)) {
      setError('Enter a valid card number');
      return;
    }
    if (!formData.expMonth || !formData.expYear) {
      setError('Select an expiration date');
      return;
    }

    addPaymentMethod({ ...formData, cardNumber: digitsOnly });
    setFormData(EMPTY_FORM);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">

      {/* Payment methods */}
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Wallet</h1>
            <p className="text-sm text-muted-foreground">
              Manage the payment methods saved to your account.
            </p>
          </div>
          {!isAdding && (
            <Button variant="primary" size="sm" onClick={() => setIsAdding(true)} className="shrink-0 gap-2">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-lg border border-border bg-secondary/40 space-y-4">
            <Input
              name="cardholderName"
              placeholder="Name on card"
              value={formData.cardholderName}
              onChange={handleChange}
              required
            />
            <Input
              name="cardNumber"
              inputMode="numeric"
              placeholder="Card number"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="expMonth"
                value={formData.expMonth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Month</option>
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                name="expYear"
                value={formData.expYear}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">Set as default payment method</span>
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <p className="text-xs text-muted-foreground">
              This is a UI demo — no real payment processor is connected. Only the last 4 digits are stored.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm">Add Card</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setIsAdding(false); setFormData(EMPTY_FORM); setError(''); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {paymentMethods.length === 0 && !isAdding ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground">No payment methods saved yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="relative border border-border rounded-lg p-5">
                {method.isDefault && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-success">
                    <Check className="w-3.5 h-3.5" /> Default
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{method.brand} •••• {method.last4}</span>
                </div>
                <p className="text-sm text-muted-foreground">{method.cardholderName}</p>
                <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => removePaymentMethod(method.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors ml-auto"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financing — informational only, no state */}
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <h2 className="text-xl font-bold text-foreground mb-1">Financing Options</h2>
        <p className="text-sm text-muted-foreground mb-6">Available at checkout for eligible orders.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FINANCING_OPTIONS.map((option) => (
            <div key={option.name} className="flex gap-4 p-5 rounded-lg border border-border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 shrink-0">
                <option.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{option.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountWallet;