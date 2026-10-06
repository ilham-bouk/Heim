import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: { Icon: CheckCircle, iconClass: 'text-success', borderClass: 'border-success/30' },
  error: { Icon: AlertCircle, iconClass: 'text-destructive', borderClass: 'border-destructive/30' },
  info: { Icon: Info, iconClass: 'text-accent', borderClass: 'border-border' },
};

const ToastItem = ({ toast, onDismiss }) => {
  const [paused, setPaused] = useState(false);
  const { Icon, iconClass, borderClass } = VARIANTS[toast.variant];

  // Timer pauses while hovered or focused so people can finish reading.
  useEffect(() => {
    if (!toast.duration || paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, paused, onDismiss]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onDismiss(toast.id);
      }}
      className={`pointer-events-auto mt-3 flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg motion-safe:animate-toast-in ${borderClass}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} aria-hidden="true" />
      <p className="flex-1 text-sm text-foreground">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-m-1 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

/**
 * Two always-mounted live regions (a region must exist before content is
 * added for screen readers to announce it): polite for success/info, assertive
 * for errors. Sits above the sticky Header (z-50).
 */
const ToastViewport = ({ toasts, onDismiss }) => (
  <div className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col items-end sm:inset-x-auto sm:right-4 sm:w-96">
    <div role="status" aria-live="polite" aria-atomic="false" className="w-full">
      {toasts.filter((t) => t.variant !== 'error').map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
    <div role="alert" aria-live="assertive" aria-atomic="false" className="w-full">
      {toasts.filter((t) => t.variant === 'error').map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  </div>
);

export default ToastViewport;