import { useEffect, useId, useRef } from 'react';
import Button from './Button';

/**
 * Inline "are you sure?" block (no modal). Render it next to/below the control
 * that triggered it, and keep that trigger mounted.
 *
 * Focus: moves to Cancel on open; Escape cancels; when it closes and focus was
 * lost with it, focus returns to the control that was focused before it opened.
 * (A parent that moves focus elsewhere itself, e.g. after a delete, wins.)
 *
 * @param {string} message
 * @param {string} [confirmLabel='Delete']
 * @param {boolean} [busy=false] - disables the confirm button while the action runs
 * @param {() => void} onConfirm
 * @param {() => void} onCancel
 */
const ConfirmInline = ({ message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) => {
  const messageId = useId();
  const cancelRef = useRef(null);

  useEffect(() => {
    const trigger = document.activeElement;
    cancelRef.current?.focus();

    return () => {
      const active = document.activeElement;
      const focusLost = !active || active === document.body;
      if (focusLost && trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  return (
    <div
      role="group"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <p id={messageId} className="text-sm font-medium text-foreground">{message}</p>
      <div className="flex items-center gap-2">
        <Button
          ref={cancelRef}
          type="button"
          variant="outline"
          size="sm"
          aria-describedby={messageId}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={busy}
          className="disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onConfirm}
        >
          {busy ? 'Deleting…' : confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmInline;