import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import FormField from './FormField';
import ImageField from './ImageField';
import { PLACEHOLDER_CATEGORY_IMAGE } from '../../services/productService';

/**
 * Inline add / edit category panel (the page decides what "submit" means).
 * Focus moves to the name field when it opens.
 *
 * @param {object|null} [category] - the category being edited; omit to add
 * @param {string[]} existingNames - names already taken by OTHER categories
 * @param {string} [submitLabel='Save category']
 * @param {(values: {name: string}) => Promise<void>} onSubmit
 * @param {() => void} onCancel
 * @param {string} [className]
 */
const CategoryForm = ({ category = null, existingNames, submitLabel = 'Save category', onSubmit, onCancel, className = '' }) => {
  const nameRef = useRef(null);
  const [name, setName] = useState(category?.name ?? '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    if (existingNames.some((existing) => existing.trim().toLowerCase() === trimmed.toLowerCase())) {
      return 'A category with this name already exists';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = validate();
    setError(message);
    if (message) {
      nameRef.current?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({ name: name.trim() });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 rounded-lg border border-border bg-secondary/40 p-5 ${className}`}
    >
      <FormField
        label="Name"
        required
        error={error}
        hint={category ? 'Renaming updates every product in this category.' : undefined}
      >
        {(control) => (
          <input
            ref={nameRef}
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g. Hallway"
            {...control}
          />
        )}
      </FormField>

      <ImageField image={category?.image ?? PLACEHOLDER_CATEGORY_IMAGE} />

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

export default CategoryForm;