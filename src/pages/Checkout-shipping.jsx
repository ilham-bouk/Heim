import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, Mail, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import AddressForm from '../components/forms/AddressForm';
import OptionCard from '../components/checkout/OptionCard';
import { useAuth } from '../context/AuthContext';
import { useAddresses } from '../context/AddressContext';
import { useCheckout } from '../context/CheckoutContext';
import { getNextStepHref } from '../utils/checkoutSteps';
import { isValidEmail } from '../utils/validators';

const emailFieldClass =
  'w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-foreground text-sm placeholder:text-muted-foreground ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const CheckoutShipping = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const { addresses, addAddress } = useAddresses();
  const { draft, updateDraft } = useCheckout();

  // Saved addresses are device-global (not per-user), so guests never see them.
  const savedAddresses = isAuthenticated ? addresses : [];
  const draftAddress = draft.shippingAddress;

  // Options = the address already chosen for this order (if it isn't a saved one)
  // followed by the saved list. Unsaved/guest addresses therefore show up as a
  // selectable card when the user navigates back to this step.
  const options =
    draftAddress && !savedAddresses.some((a) => a.id === draftAddress.id)
      ? [draftAddress, ...savedAddresses]
      : savedAddresses;

  const [selectedId, setSelectedId] = useState(
    () => draftAddress?.id ?? savedAddresses.find((a) => a.isDefault)?.id ?? null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [guestEmail, setGuestEmail] = useState(draft.email);
  const [emailError, setEmailError] = useState('');

  const isFormOpen = isAddingNew || options.length === 0;

  // Single exit point: validates guest email, stores a snapshot, moves on.
  const commit = (address) => {
    let email = user?.email;

    if (!isAuthenticated) {
      email = guestEmail.trim();
      if (!isValidEmail(email)) {
        setEmailError(email ? 'Please enter a valid email address' : 'Email is required');
        emailRef.current?.focus();
        return;
      }
    }

    updateDraft({ shippingAddress: address, email });
    navigate(getNextStepHref('shipping'));
  };

  const handleContinue = () => {
    const address = options.find((a) => a.id === selectedId);
    if (address) commit(address);
  };

  // `save` is only ever true for signed-in users (see AddressForm's allowSave).
  const handleAddNew = (values, { save }) => {
    commit(save ? addAddress(values) : { ...values, id: `checkout_${Date.now()}`, isDefault: false });
  };

  return (
    <section aria-labelledby="shipping-heading" className="space-y-8">
      <div>
        <h1 id="shipping-heading" className="text-2xl font-bold text-foreground">Shipping</h1>
        <p className="mt-1 text-sm text-muted-foreground">Where should we send your order?</p>
      </div>

      {!isAuthenticated && (
        <div>
          <label htmlFor="checkout-email" className="block text-sm font-semibold text-foreground mb-1.5">
            Contact email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input
              ref={emailRef}
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={guestEmail}
              onChange={(e) => {
                setGuestEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'checkout-email-error' : undefined}
              className={`${emailFieldClass} ${emailError ? 'border-destructive' : 'border-border'}`}
            />
          </div>
          {emailError && (
            <p id="checkout-email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {emailError}
            </p>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/signin"
              state={{ from: { pathname: '/checkout' } }}
              className="font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Sign in
            </Link>{' '}
            to use your saved addresses.
          </p>
        </div>
      )}

      {options.length > 0 && (
        <fieldset>
          <legend className="sr-only">Choose a shipping address</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {options.map((address) => (
              <OptionCard
                key={address.id}
                name="shippingAddress"
                value={address.id}
                checked={selectedId === address.id}
                onChange={() => setSelectedId(address.id)}
              >
                <span className="block pr-6 font-semibold text-foreground mb-1">
                  {address.label || address.fullName}
                </span>
                <span className="block text-sm text-muted-foreground leading-relaxed">
                  {address.fullName}<br />
                  {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                  {address.city}, {address.state} {address.zip}<br />
                  {address.country}
                </span>
              </OptionCard>
            ))}
          </div>
        </fieldset>
      )}

      {isFormOpen ? (
        <AddressForm
          showLabel={isAuthenticated}
          allowSave={isAuthenticated}
          submitLabel="Use this address"
          onSubmit={handleAddNew}
          onCancel={options.length > 0 ? () => setIsAddingNew(false) : undefined}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add a new address
          </Button>
          <Button onClick={handleContinue} disabled={!selectedId}>
            Continue
          </Button>
        </div>
      )}

      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Return to cart
      </Link>
    </section>
  );
};

export default CheckoutShipping;