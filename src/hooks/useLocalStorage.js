import { useState, useEffect } from 'react';

// This is the mock persistence layer for Cart/Wishlist/Auth. When you
// wire a real backend, this is the hook to replace (or wrap) with a
// call to your session/cart API.

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
      // Storage unavailable — fail silently.
    }
  }, [key, value]);

  return [value, setValue];
};