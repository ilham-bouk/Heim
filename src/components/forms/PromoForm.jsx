import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import FormField from './FormField';
import { PROMO_CODE_PATTERN, PROMO_TYPES, normalizeCode } from '../../services/promoService';

const toFormValues = (promo) => ({
  code: promo?.code ?? '',
  type: promo?.type ?? 'percent',
  value: promo ? String(promo.value) : '',
  expiresAt: promo?.expiresAt ?? '',
  active: promo ? promo.active : true,
});

const validate = (values, existingCodes, isEditing) => {
  const errors = {};

  if (!isEditing) {
    const code = normalizeCode(values.code);
    if (!PROMO_CODE_PATTERN.test(code)) errors.code = 'Use 3 to 20 letters, numbers, hyphens or underscores';
    else if (existingCodes.includes(code)) errors.code = 'A promo with this code already exists';
  }

  const value = Number(values.value);
  if (!values.value.trim()) errors.value = 'Value is required';
  else if (!Number.isInteger(value) || value < 1) errors.value = 'Enter a whole number of 1 or more';
  else if (values.type === 'percent' && value > 100) errors.value = 'A percentage can be at most 100';

  return errors;
};

// Form strings -> the typed payload the promo store expects (the future API body).
const toInput = (values) => ({
  code: normalizeCode(values.code),
  type: values.type,
  value: Number(values.value),
  expiresAt: values.expiresAt || undefined,
  active: values.active,
});

/**
 * Inline add / edit promo panel (the page decides what "submit" means, see
 * pages/Admin-promos.jsx). The code is read-only when editing.
 * Focus moves into the form when it opens.
 *
 * @param {object|null} [promo] - the promo being edited; omit to add
 * @param {string[]} existingCodes - codes already taken by OTHER promos
 * @param {string} [submitLabel='Save promo']
 * @param {(input: object) => Promise<void>} onSubmit
 * @param {() => void} onCancel
 * @param {string} [className]
 */
const PromoForm = ({ promo = null, existingCodes, submitLabel = 'Save promo', onSubmit, onCancel, className = '' }) => {
  const formRef = useRef(null);
  const isEditing = promo !== null;
  const [values, setValues] = useState(() => toFormValues(promo));
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // On open: focus the first editable field (the code is locked when editing).
  useEffect(() => {
    formRef.current?.querySelector(isEditing ? '[name="value"]' : '[name="code"]')?.focus();
  }, [isEditing]);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const setField = (name, transform = (value) => value) => (e) => {
    const value = transform(e.target.value);
    setValues((prev) => ({ ...prev, [name]: value }));
    // Changing the type changes what a valid value is, so clear that error too.
    setErrors((prev) => ({ ...prev, [name]: '', ...(name === 'type' ? { value: '' } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(values, existingCodes, isEditing);
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

  const isPercent = values.type === 'percent';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 rounded-lg border border-border bg-secondary/40 p-5 ${className}`}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Code"
          required
          error={errors.code}
          hint={isEditing ? "The code can't be changed. Delete the promo and create a new one instead." : 'Customers type this at the cart. Saved in uppercase.'}
        >
          {(control) => (
            <input
              name="code"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              readOnly={isEditing}
              value={values.code}
              onChange={setField('code', (value) => value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              {...control}
              className={`${control.className} read-only:cursor-not-allowed read-only:bg-secondary read-only:text-muted-foreground`}
            />
          )}
        </FormField>

        <FormField label="Type">
          {(control) => (
            <select name="type" value={values.type} onChange={setField('type')} {...control}>
              {PROMO_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label={`Value (${isPercent ? '%' : '$'})`}
          required
          error={errors.value}
          hint={isPercent ? 'Percentage off the subtotal, 1 to 100.' : 'Amount off the subtotal. Never more than the subtotal.'}
        >
          {(control) => (
            <input name="value" type="number" inputMode="numeric" min="1" step="1" value={values.value} onChange={setField('value')} {...control} />
          )}
        </FormField>

        <FormField label="Expires" hint="Optional. The code works through the end of this day.">
          {(control) => (
            <input name="expiresAt" type="date" value={values.expiresAt} onChange={setField('expiresAt')} {...control} />
          )}
        </FormField>
      </div>

      <label className="flex w-fit cursor-pointer select-none items-center gap-2.5">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => setValues((prev) => ({ ...prev, active: e.target.checked }))}
          className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
        />
        <span className="text-sm text-foreground">Active (customers can apply it)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="sm" disabled={isSaving} className="disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? 'Saving…' : submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PromoForm;