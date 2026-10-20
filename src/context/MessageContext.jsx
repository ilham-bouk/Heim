import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { getSeedMessages } from '../data/messageSeed';
import {
  countUnread,
  createMessage,
  findMessageById,
  removeMessage,
  updateMessageRead,
} from '../services/messageService';
import { STORAGE_KEYS } from '../utils/storageKeys';

const MessageContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Contact-form messages (shape: services/messageService.js). The public Contact
 * form calls sendMessage; the admin reads, flags and deletes them.
 *
 * Mutations are async (mock latency): sendMessage(input), setMessageRead(id, read),
 * deleteMessage(id).
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useSeededCollection(STORAGE_KEYS.messages, getSeedMessages);
  const [idCounters, setIdCounters] = useLocalStorage(STORAGE_KEYS.messageIdCounters, {});

  const value = useMemo(() => {
    // IDs are never reused, even after a delete (same reasoning as CatalogContext).
    // Real backend: the server assigns the ID.
    const reserveId = () => {
      const id = Math.max(0, idCounters.messages ?? 0, ...messages.map((message) => message.id)) + 1;
      setIdCounters((prev) => ({ ...prev, messages: id }));
      return id;
    };

    // Real backend: POST /contact.
    const sendMessage = async (input) => {
      const message = createMessage(input, reserveId());
      await delay(MOCK_LATENCY_MS);
      setMessages((prev) => [...prev, message]);
      return message;
    };

    // Real backend: PATCH /admin/messages/:id.
    const setMessageRead = async (id, read) => {
      await delay(MOCK_LATENCY_MS);
      setMessages((prev) => updateMessageRead(prev, id, read));
    };

    // Real backend: DELETE /admin/messages/:id.
    const deleteMessage = async (id) => {
      await delay(MOCK_LATENCY_MS);
      setMessages((prev) => removeMessage(prev, id));
    };

    return {
      messages,
      unreadCount: countUnread(messages),
      getMessageById: (id) => findMessageById(messages, id),
      sendMessage,
      setMessageRead,
      deleteMessage,
    };
  }, [messages, idCounters, setMessages, setIdCounters]);

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};