import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EMPTY_ADDRESS = {
  label: '', fullName: '', line1: '', line2: '', city: '', state: '', zip: '', country: '',
};

/**
 * Shared address form (Account → Addresses, Checkout → Shipping).
 * Owns its own field state; the parent decides what "submit" means.
 *
 * @param {object} [initialValues] - prefill, e.g. the address being edited
 * @param {string} [submitLabel='Save Address']
 * @param {boolean} [showLabel=true] - show the "Label" field (Home, Work…)
 * @param {boolean} [allowSave=false] - show a "Save to my account" checkbox
 *   (the Label field then only appears once it's ticked)
 * @param {(values: object, options: {save: boolean}) => void} onSubmit
 * @param {() => void} [onCancel] - the Cancel button only renders when provided
 * @param {string} [className]
 */
const AddressForm = ({
  initialValues,
  submitLabel = 'Save Address',
  showLabel = true,
  allowSave = false,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [formData, setFormData] = useState({ ...EMPTY_ADDRESS, ...initialValues });
  const [saveToAccount, setSaveToAccount] = useState(false);

  const isLabelVisible = showLabel && (!allowSave || saveToAccount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, { save: allowSave && saveToAccount });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-5 rounded-lg border border-border bg-secondary/40 space-y-4 ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLabelVisible && (
          <Input name="label" aria-label="Label" placeholder="Label (e.g. Home, Work)" value={formData.label} onChange={handleChange} required />
        )}
        <Input
          name="fullName"
          aria-label="Full name"
          autoComplete="name"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className={isLabelVisible ? '' : 'sm:col-span-2'}
        />
      </div>
      <Input name="line1" aria-label="Address line 1" autoComplete="address-line1" placeholder="Address line 1" value={formData.line1} onChange={handleChange} required />
      <Input name="line2" aria-label="Address line 2" autoComplete="address-line2" placeholder="Address line 2 (optional)" value={formData.line2} onChange={handleChange} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input name="city" aria-label="City" autoComplete="address-level2" placeholder="City" value={formData.city} onChange={handleChange} required />
        <Input name="state" aria-label="State" autoComplete="address-level1" placeholder="State" value={formData.state} onChange={handleChange} required />
        <Input name="zip" aria-label="ZIP code" autoComplete="postal-code" placeholder="ZIP code" value={formData.zip} onChange={handleChange} required />
      </div>
      <Input name="country" aria-label="Country" autoComplete="country-name" placeholder="Country" value={formData.country} onChange={handleChange} required />

      {allowSave && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={saveToAccount}
            onChange={(e) => setSaveToAccount(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">Save this address to my account</span>
        </label>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="sm">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;