import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import PaymentMethodForm from '../components/forms/PaymentMethodForm';
import OptionCard from '../components/checkout/OptionCard';
import { useAuth } from '../context/AuthContext';
import { usePaymentMethods } from '../context/PaymentMethodContext';
import { useCheckout } from '../context/CheckoutContext';
import { getNextStepHref, getPreviousStepHref } from '../utils/checkoutSteps';
import { toPaymentSnapshot } from '../utils/payment';

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { paymentMethods, addPaymentMethod } = usePaymentMethods();
  const { draft, updateDraft } = useCheckout();

  // Saved methods are device-global (not per-user), so guests never see them.
  const savedMethods = isAuthenticated ? paymentMethods : [];
  const draftPayment = draft.payment;

  const options =
    draftPayment && !savedMethods.some((m) => m.id === draftPayment.id)
      ? [draftPayment, ...savedMethods]
      : savedMethods;

  const [selectedId, setSelectedId] = useState(
    () => draftPayment?.id ?? savedMethods.find((m) => m.isDefault)?.id ?? null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);

  const isFormOpen = isAddingNew || options.length === 0;

  const commit = (payment) => {
    updateDraft({ payment });
    navigate(getNextStepHref('payment'));
  };

  const handleContinue = () => {
    const payment = options.find((m) => m.id === selectedId);
    if (payment) commit(payment);
  };

  // The form hands us the raw card number exactly once. Either the context
  // reduces it to brand+last4 (saved), or we do (unsaved). It is never stored.
  const handleAddNew = (values, { save }) => {
    commit(
      save
        ? addPaymentMethod(values)
        : { id: `checkout_${Date.now()}`, ...toPaymentSnapshot(values) }
    );
  };

  return (
    <section aria-labelledby="payment-heading" className="space-y-8">
      <div>
        <h1 id="payment-heading" className="text-2xl font-bold text-foreground">Payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose how you'd like to pay.</p>
      </div>

      {options.length > 0 && (
        <fieldset>
          <legend className="sr-only">Choose a payment method</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {options.map((method) => (
              <OptionCard
                key={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedId === method.id}
                onChange={() => setSelectedId(method.id)}
              >
                <span className="flex items-center gap-2 pr-6 mb-2 font-semibold text-foreground">
                  <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  {method.brand} •••• {method.last4}
                </span>
                <span className="block text-sm text-muted-foreground">{method.cardholderName}</span>
                <span className="block text-sm text-muted-foreground">
                  Expires {method.expMonth}/{method.expYear}
                </span>
              </OptionCard>
            ))}
          </div>
        </fieldset>
      )}

      {isFormOpen ? (
        <PaymentMethodForm
          allowSave={isAuthenticated}
          submitLabel="Use this card"
          onSubmit={handleAddNew}
          onCancel={options.length > 0 ? () => setIsAddingNew(false) : undefined}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a new card
          </Button>
          <Button onClick={handleContinue} disabled={!selectedId}>
            Continue
          </Button>
        </div>
      )}

      <Link
        to={getPreviousStepHref('payment')}
        className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to shipping
      </Link>
    </section>
  );
};

export default CheckoutPayment;