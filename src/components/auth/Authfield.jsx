import { useId } from 'react';
import { AlertCircle } from 'lucide-react';

const baseClass =
  'w-full py-2.5 pl-10 rounded-lg border text-foreground text-sm placeholder:text-muted-foreground ' +
  'transition-colors focus:outline-none focus:ring-2 focus:border-transparent';

export const FieldError = ({ id, message }) =>
  message ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive-text">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  ) : null;

/**
 * Label + icon + input + error for the auth forms, wired for accessibility
 * (aria-invalid, aria-describedby). Other props go to the <input>.
 *
 * @param {string} label
 * @param {React.ElementType} icon - a lucide icon component, shown inside the field
 * @param {string} [error]
 * @param {React.ReactNode} [labelAction] - right of the label (e.g. "Forgot password?")
 * @param {React.ReactNode} [trailing] - inside the field, right (e.g. show/hide button)
 * @param {React.ReactNode} [footer] - under the field, above the error (e.g. strength bar)
 */
const AuthField = ({ label, icon: Icon, error, labelAction, trailing, footer, ...inputProps }) => {
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = !!error;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        <input
          id={id}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`${baseClass} ${trailing ? 'pr-11' : 'pr-4'} ${
            hasError
              ? 'border-destructive bg-destructive/10 focus:ring-destructive'
              : 'border-border bg-card hover:border-muted-foreground focus:ring-primary'
          }`}
          {...inputProps}
        />
        {trailing}
      </div>
      {footer}
      <FieldError id={errorId} message={error} />
    </div>
  );
};

export default AuthField;