import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ToastViewport from '../components/ui/ToastViewport';
import { STORAGE_ERROR_EVENT } from '../hooks/useLocalStorage';

const ToastContext = createContext();

const MAX_VISIBLE = 4;
const STORAGE_ERROR_COOLDOWN_MS = 5000;

// 0 = stays until dismissed. Errors never time out.
const DEFAULT_DURATION = { success: 4000, info: 5000, error: 0 };

/**
 * Usage: const toast = useToast(); toast.success('Product saved');
 * Methods: success | error | info (message, { duration? }) and dismiss(id).
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const lastStorageError = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((variant, message, options = {}) => {
    const id = ++nextId.current;
    const duration = options.duration ?? DEFAULT_DURATION[variant];
    setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), { id, variant, message, duration }]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      success: (message, options) => push('success', message, options),
      error: (message, options) => push('error', message, options),
      info: (message, options) => push('info', message, options),
      dismiss,
    }),
    [push, dismiss]
  );

  // useLocalStorage reports failed writes (quota full / storage disabled).
  useEffect(() => {
    const handleStorageError = () => {
      const now = Date.now();
      if (now - lastStorageError.current < STORAGE_ERROR_COOLDOWN_MS) return;
      lastStorageError.current = now;
      api.error("Your changes couldn't be saved: browser storage is full or unavailable.");
    };
    window.addEventListener(STORAGE_ERROR_EVENT, handleStorageError);
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, handleStorageError);
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};