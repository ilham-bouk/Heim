import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import FormField from './FormField';
import { SOCIAL_NETWORKS, fromPercent, toPercent } from '../../services/settingsService';
import { isValidEmail, isValidHttpUrl } from '../../utils/validators';

// One line per row in the textareas (address, hours).
const toLines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean);

const toFormValues = ({ store, contact, social, pricing }) => ({
  name: store.name,
  tagline: store.tagline,
  address: contact.address.join('\n'),
  phone: contact.phone,
  phoneAlt: contact.phoneAlt,
  email: contact.email,
  supportEmail: contact.supportEmail,
  hours: contact.hours.join('\n'),
  social: Object.fromEntries(SOCIAL_NETWORKS.map(({ key }) => [key, social[key] ?? ''])),
  taxRate: String(toPercent(pricing.taxRate)),
  freeShippingThreshold: String(pricing.freeShippingThreshold),
  standardShippingCost: String(pricing.standardShippingCost),
});

const isWholeNumber = (text) => {
  const number = Number(text);
  return text.trim() !== '' && Number.isInteger(number) && number >= 0;
};

const validate = (values) => {
  const errors = {};

  if (values.name.trim().length < 2) errors.name = 'Store name must be at least 2 characters';
  if (!values.tagline.trim()) errors.tagline = 'Tagline is required';

  if (toLines(values.address).length === 0) errors.address = 'Add at least one address line';
  if (!values.phone.trim()) errors.phone = 'Phone number is required';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(values.email.trim())) errors.email = 'Please enter a valid email address';
  if (values.supportEmail.trim() && !isValidEmail(values.supportEmail.trim())) {
    errors.supportEmail = 'Please enter a valid email address';
  }
  if (toLines(values.hours).length === 0) errors.hours = 'Add at least one line of opening hours';

  SOCIAL_NETWORKS.forEach(({ key }) => {
    const url = values.social[key].trim();
    if (url && !isValidHttpUrl(url)) errors[key] = 'Enter a full link starting with https://';
  });

  const taxRate = Number(values.taxRate);
  if (!values.taxRate.trim()) errors.taxRate = 'Tax rate is required';
  else if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) errors.taxRate = 'Enter a number from 0 to 100';

  if (!isWholeNumber(values.freeShippingThreshold)) errors.freeShippingThreshold = 'Enter a whole number of 0 or more';
  if (!isWholeNumber(values.standardShippingCost)) errors.standardShippingCost = 'Enter a whole number of 0 or more';

  return errors;
};

// Form strings -> the typed settings object the store expects (the future API body).
const toInput = (values) => ({
  store: { name: values.name.trim(), tagline: values.tagline.trim() },
  contact: {
    address: toLines(values.address),
    phone: values.phone.trim(),
    phoneAlt: values.phoneAlt.trim(),
    email: values.email.trim(),
    supportEmail: values.supportEmail.trim(),
    hours: toLines(values.hours),
  },
  social: Object.fromEntries(SOCIAL_NETWORKS.map(({ key }) => [key, values.social[key].trim()])),
  pricing: {
    taxRate: fromPercent(Number(values.taxRate)),
    freeShippingThreshold: Number(values.freeShippingThreshold),
    standardShippingCost: Number(values.standardShippingCost),
  },
});

/**
 * Store settings form (the page decides what "submit" means, see
 * pages/Admin-settings.jsx). Reads `settings` once on mount.
 * Tax is shown as a percent but stored as a fraction.
 *
 * @param {object} settings - current settings (see services/settingsService.js)
 * @param {(input: object) => Promise<void>} onSubmit - receives the typed settings object
 */
const SettingsForm = ({ settings, onSubmit }) => {
  const formRef = useRef(null);
  const [values, setValues] = useState(() => toFormValues(settings));
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const setField = (name) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const setSocial = (key) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmitCount((count) => count + 1);
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(toInput(values));
    } finally {
      setIsSaving(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-10">
      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Store</legend>
        <FormField label="Store name" required error={errors.name} hint="Shown in the header, footer and sign-in pages.">
          {(control) => (
            <input name="name" type="text" value={values.name} onChange={setField('name')} {...control} />
          )}
        </FormField>
        <FormField label="Tagline" required error={errors.tagline} hint="Shown under the logo in the footer.">
          {(control) => (
            <textarea name="tagline" rows={3} value={values.tagline} onChange={setField('tagline')} {...control} />
          )}
        </FormField>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Contact and social</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Address" required error={errors.address} hint="One line per row." className="sm:col-span-2">
            {(control) => (
              <textarea name="address" rows={3} value={values.address} onChange={setField('address')} {...control} />
            )}
          </FormField>
          <FormField label="Phone" required error={errors.phone}>
            {(control) => (
              <input name="phone" type="tel" value={values.phone} onChange={setField('phone')} {...control} />
            )}
          </FormField>
          <FormField label="Second phone" hint="Optional.">
            {(control) => (
              <input name="phoneAlt" type="tel" value={values.phoneAlt} onChange={setField('phoneAlt')} {...control} />
            )}
          </FormField>
          <FormField label="Email" required error={errors.email}>
            {(control) => (
              <input name="email" type="email" value={values.email} onChange={setField('email')} {...control} />
            )}
          </FormField>
          <FormField label="Support email" error={errors.supportEmail} hint="Optional.">
            {(control) => (
              <input name="supportEmail" type="email" value={values.supportEmail} onChange={setField('supportEmail')} {...control} />
            )}
          </FormField>
          <FormField label="Opening hours" required error={errors.hours} hint="One line per row." className="sm:col-span-2">
            {(control) => (
              <textarea name="hours" rows={3} value={values.hours} onChange={setField('hours')} {...control} />
            )}
          </FormField>
          {SOCIAL_NETWORKS.map(({ key, label }) => (
            <FormField
              key={key}
              label={label}
              error={errors[key]}
              hint="Optional. Leave empty to hide the link in the footer."
            >
              {(control) => (
                <input
                  name={`social-${key}`}
                  type="url"
                  value={values.social[key]}
                  onChange={setSocial(key)}
                  placeholder="https://"
                  {...control}
                />
              )}
            </FormField>
          ))}
        </div>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Pricing and shipping</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="Tax rate (%)" required error={errors.taxRate} hint="Applied to the subtotal, e.g. 7.5 for 7.5%.">
            {(control) => (
              <input name="taxRate" type="number" inputMode="decimal" min="0" max="100" step="0.01" value={values.taxRate} onChange={setField('taxRate')} {...control} />
            )}
          </FormField>
          <FormField label="Free shipping from ($)" required error={errors.freeShippingThreshold} hint="Subtotals at or above this ship free. 0 = always free.">
            {(control) => (
              <input name="freeShippingThreshold" type="number" inputMode="numeric" min="0" step="1" value={values.freeShippingThreshold} onChange={setField('freeShippingThreshold')} {...control} />
            )}
          </FormField>
          <FormField label="Standard shipping ($)" required error={errors.standardShippingCost} hint="Charged below the free-shipping amount.">
            {(control) => (
              <input name="standardShippingCost" type="number" inputMode="numeric" min="0" step="1" value={values.standardShippingCost} onChange={setField('standardShippingCost')} {...control} />
            )}
          </FormField>
        </div>
        <p className="text-xs text-muted-foreground">
          Changes apply to carts from now on. Orders already placed keep the totals they were charged.
        </p>
      </fieldset>

      {hasErrors && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          Please fix the highlighted fields.
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSaving} className="disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;