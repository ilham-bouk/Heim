import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AddressContext = createContext();

const ADDRESS_STORAGE_KEY = 'heim_addresses';

/**
 * Address shape:
 * {
 *   id: string,
 *   label: string,       // 'Home' | 'Work' | custom free text
 *   fullName: string,
 *   line1: string,
 *   line2?: string,
 *   city: string,
 *   state: string,
 *   zip: string,
 *   country: string,
 *   isDefault: boolean
 * }
 */

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useLocalStorage(ADDRESS_STORAGE_KEY, []);

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0 ? true : !!address.isDefault,
    };

    setAddresses(prev => {
      const next = newAddress.isDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      return [...next, newAddress];
    });

    return newAddress;
  };

  const updateAddress = (id, updates) => {
    setAddresses(prev => {
      const next = updates.isDefault
        ? prev.map(a => ({ ...a, isDefault: false }))
        : prev;
      return next.map(a => (a.id === id ? { ...a, ...updates } : a));
    });
  };

  const removeAddress = (id) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // If we removed the default and others remain, promote the first one
      // so there's always a default whenever at least one address exists.
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const value = {
    addresses,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};