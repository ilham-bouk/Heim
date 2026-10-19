import { createContext, useContext, useMemo } from 'react';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { getSeedSubscribers } from '../data/subscriberSeed';
import { addSubscriber, removeSubscriber } from '../services/subscriberService';
import { STORAGE_KEYS } from '../utils/storageKeys';

const SubscriberContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Newsletter subscribers (shape: services/subscriberService.js), keyed by
 * normalized email. Neither mutation reports whether the email already existed:
 * subscribing twice is a silent no-op, so the public form can't be used to
 * discover who is on the list.
 *
 * Mutations are async (mock latency): subscribe(email), unsubscribe(email).
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const SubscriberProvider = ({ children }) => {
  const [subscribers, setSubscribers] = useSeededCollection(STORAGE_KEYS.subscribers, getSeedSubscribers);

  const value = useMemo(() => {
    // Real backend: POST /newsletter/subscribers.
    // The duplicate check runs inside the updater so two quick submits can't both insert.
    const subscribe = async (email) => {
      await delay(MOCK_LATENCY_MS);
      setSubscribers((prev) => addSubscriber(prev, email));
    };

    // Real backend: DELETE /admin/subscribers/:email.
    const unsubscribe = async (email) => {
      await delay(MOCK_LATENCY_MS);
      setSubscribers((prev) => removeSubscriber(prev, email));
    };

    return { subscribers, subscribe, unsubscribe };
  }, [subscribers, setSubscribers]);

  return <SubscriberContext.Provider value={value}>{children}</SubscriberContext.Provider>;
};

export const useSubscribers = () => {
  const context = useContext(SubscriberContext);
  if (!context) {
    throw new Error('useSubscribers must be used within a SubscriberProvider');
  }
  return context;
};