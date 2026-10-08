import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DATA_VERSION } from '../utils/constants';

const isCurrent = (stored) => stored?.version === DATA_VERSION && Array.isArray(stored.items);

/**
 * A persisted collection that starts as a full copy of its seed data.
 * Stored as { version, items }. When DATA_VERSION changes (new seed data,
 * changed shapes, re-hashed image URLs) the stale copy is replaced by a
 * fresh seed on next load.
 *
 * @param {string} key - a STORAGE_KEYS entry
 * @param {() => Array} getSeed - must be a stable (module-level) function
 * @returns {[Array, (updater: (items: Array) => Array) => void]}
 *
 * Real backend: replace this hook with a data-fetching hook; the contexts
 * built on it keep exposing the same values.
 */
export const useSeededCollection = (key, getSeed) => {
  const [stored, setStored] = useLocalStorage(key, { version: DATA_VERSION, items: getSeed() });

  // Replace an outdated copy so storage always mirrors what the app shows.
  useEffect(() => {
    if (!isCurrent(stored)) setStored({ version: DATA_VERSION, items: getSeed() });
  }, [stored, setStored, getSeed]);

  const items = isCurrent(stored) ? stored.items : getSeed();

  const setItems = useCallback(
    (updater) =>
      setStored((prev) => ({
        version: DATA_VERSION,
        items: updater(isCurrent(prev) ? prev.items : getSeed()),
      })),
    [setStored, getSeed]
  );

  return [items, setItems];
};