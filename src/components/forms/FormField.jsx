import { useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Label + control + hint + error, wired together for accessibility.
 * `children` is a render function receiving the props to spread on the control
 * (id, aria-*, and the shared input classes), so it works for <input>,
 * <select> and <textarea>:
 *
 *   <FormField label="Name" required error={errors.name}>
 *     {(control) => <input name="name" value={v} onChange={fn} {...control} />}
 *   </FormField>
 *
 * @param {string} label
 * @param {string} [error] - message; also sets aria-invalid
 * @param {string} [hint]
 * @param {boolean} [required] - shows "*" and sets aria-required (validation is yours)
 * @param {string} [className] - wrapper classes, e.g. 'sm:col-span-2'
 */
const FormField = ({ label, error, hint, required = false, className = '', children }) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  const controlProps = {
    id,
    'aria-invalid': !!error,
    'aria-required': required || undefined,
    'aria-describedby': describedBy,
    className: `w-full scroll-mt-28 rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary ${
      error ? 'border-destructive' : 'border-border'
    }`,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required && <span aria-hidden="true" className="text-destructive"> *</span>}
      </label>
      {children(controlProps)}
      {hint && <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;