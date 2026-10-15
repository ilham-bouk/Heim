import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mergeSettings } from '../services/settingsService';
import { STORAGE_KEYS } from '../utils/storageKeys';

const SettingsContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NO_OVERRIDES = {};

/**
 * Store settings (shape: services/settingsService.js, defaults: config/site.js).
 * Storage keeps whatever the admin saved; `settings` is that merged over the
 * defaults on every render.
 *
 * Existing orders keep their own totals: changing tax or shipping only affects
 * carts from now on.
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const SettingsProvider = ({ children }) => {
  const [stored, setStored] = useLocalStorage(STORAGE_KEYS.settings, NO_OVERRIDES);

  const value = useMemo(() => {
    // Real backend: PUT /admin/settings.
    const updateSettings = async (input) => {
      await delay(MOCK_LATENCY_MS);
      setStored(input);
    };

    return { settings: mergeSettings(stored), updateSettings };
  }, [stored, setStored]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};