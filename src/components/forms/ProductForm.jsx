import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import Button from '../ui/Button';
import FormField from './FormField';
import ImageField from './ImageField';
import { PLACEHOLDER_PRODUCT_IMAGE, SPEC_LABELS } from '../../services/productService';

const BADGE_OPTIONS = ['New', 'Sale', 'Bestseller'];

const toFormValues = (product) => ({
  name: product?.name ?? '',
  category: product?.category ?? '',
  price: product ? String(product.price) : '',
  discount: product?.discount ? String(product.discount) : '',
  badge: product?.badge ?? '',
  featured: !!product?.featured,
  description: product?.description ?? '',
  specs: Object.fromEntries(
    SPEC_LABELS.map((label) => [label, product?.specs?.find((s) => s.label === label)?.value ?? ''])
  ),
});

const validate = (values) => {
  const errors = {};

  if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!values.category) errors.category = 'Select a category';

  const price = Number(values.price);
  if (!values.price.trim()) errors.price = 'Price is required';
  else if (!Number.isInteger(price) || price < 1) errors.price = 'Enter a whole number of 1 or more';

  if (values.discount.trim()) {
    const discount = Number(values.discount);
    if (!Number.isInteger(discount) || discount < 1 || discount > 90) {
      errors.discount = 'Enter a whole number from 1 to 90';
    }
  }

  if (values.badge === 'Sale' && !values.discount.trim()) {
    errors.badge = 'A "Sale" badge needs a discount';
  }

  if (!values.description.trim()) errors.description = 'Description is required';

  return errors;
};

// Form strings -> the typed payload the catalog expects (the future API body).
const toInput = (values) => ({
  name: values.name.trim(),
  category: values.category,
  price: Number(values.price),
  discount: values.discount.trim() ? Number(values.discount) : 0,
  badge: values.badge,
  featured: values.featured,
  description: values.description.trim(),
  specs: SPEC_LABELS.map((label) => ({ label, value: values.specs[label].trim() })).filter((s) => s.value),
});

/**
 * Add / edit product form. Owns its field state; the page decides what
 * "submit" means (see pages/Admin-product-form.jsx).
 *
 * @param {object|null} [product] - the product being edited; omit to add
 * @param {Array<{id: number, name: string}>} categories
 * @param {string} [submitLabel='Save product']
 * @param {string} cancelTo - where Cancel goes
 * @param {(input: object) => Promise<void>} onSubmit - receives the typed payload
 */
const ProductForm = ({ product = null, categories, submitLabel = 'Save product', cancelTo, onSubmit }) => {
  const formRef = useRef(null);
  const [values, setValues] = useState(() => toFormValues(product));
  const [errors, setErrors] = useState({});
  const [submitCount, setSubmitCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // After a failed submit, move focus to the first invalid field.
  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const clearError = (name) =>
    setErrors((prev) => {
      if (!prev[name] && !(name === 'discount' && prev.badge)) return prev;
      // Changing the discount can resolve the "Sale needs a discount" error too.
      return { ...prev, [name]: '', ...(name === 'discount' ? { badge: '' } : {}) };
    });

  const setField = (name) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const setSpec = (label) => (e) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, specs: { ...prev.specs, [label]: value } }));
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
        <legend className="mb-4 text-lg font-bold text-foreground">Basic information</legend>
        <FormField label="Name" required error={errors.name}>
          {(control) => (
            <input name="name" type="text" value={values.name} onChange={setField('name')} placeholder="e.g. Oak Bookshelf" {...control} />
          )}
        </FormField>
        <FormField label="Category" required error={errors.category}>
          {(control) => (
            <select name="category" value={values.category} onChange={setField('category')} {...control}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          )}
        </FormField>
        <FormField label="Description" required error={errors.description}>
          {(control) => (
            <textarea name="description" rows={5} value={values.description} onChange={setField('description')} placeholder="A short description shown on the product page." {...control} />
          )}
        </FormField>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Pricing and visibility</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Price ($)" required error={errors.price}>
            {(control) => (
              <input name="price" type="number" inputMode="numeric" min="1" step="1" value={values.price} onChange={setField('price')} {...control} />
            )}
          </FormField>
          <FormField label="Discount (%)" error={errors.discount} hint="Optional. 1 to 90.">
            {(control) => (
              <input name="discount" type="number" inputMode="numeric" min="1" max="90" step="1" value={values.discount} onChange={setField('discount')} {...control} />
            )}
          </FormField>
          <FormField label="Badge" error={errors.badge} hint="Choose “Sale” to show the discount percentage on the product card.">
            {(control) => (
              <select name="badge" value={values.badge} onChange={setField('badge')} {...control}>
                <option value="">No badge</option>
                {BADGE_OPTIONS.map((badge) => (
                  <option key={badge} value={badge}>{badge}</option>
                ))}
              </select>
            )}
          </FormField>
        </div>
        <label className="flex w-fit cursor-pointer select-none items-center gap-2.5">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => setValues((prev) => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground">Featured on the home page</span>
        </label>
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Image</legend>
        <ImageField image={product?.image ?? PLACEHOLDER_PRODUCT_IMAGE} />
      </fieldset>

      <fieldset className="min-w-0 space-y-5">
        <legend className="mb-4 text-lg font-bold text-foreground">Specifications</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {SPEC_LABELS.map((label) => (
            <FormField key={label} label={label}>
              {(control) => (
                <input name={`spec-${label}`} type="text" value={values.specs[label]} onChange={setSpec(label)} {...control} />
              )}
            </FormField>
          ))}
        </div>
      </fieldset>

      {hasErrors && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          Please fix the highlighted fields.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSaving} className="disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? 'Saving…' : submitLabel}
        </Button>
        <Button as={Link} to={cancelTo} variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;