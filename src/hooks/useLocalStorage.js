import { useState, useEffect, useRef } from 'react';

// This is the mock persistence layer for Cart/Wishlist/Auth. When you
// wire a real backend, this is the hook to replace (or wrap) with a
// call to your session/cart API.

// Fired when a write fails (quota exceeded, storage disabled). ToastProvider
// listens for it so users are told instead of silently losing data.
export const STORAGE_ERROR_EVENT = 'heim:storage-error';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      window.dispatchEvent(new CustomEvent(STORAGE_ERROR_EVENT, { detail: { key } }));
    }
  }, [key, value]);

  // Keep other tabs in sync (admin tab ↔ storefront tab).
  const initialRef = useRef(initialValue);
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key) return;
      try {
        setValue(event.newValue === null ? initialRef.current : JSON.parse(event.newValue));
      } catch {
        // Malformed value written elsewhere — ignore it.
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [value, setValue];
};