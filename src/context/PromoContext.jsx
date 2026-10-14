import { createContext, useContext, useMemo } from 'react';
import { useSeededCollection } from '../hooks/useSeededCollection';
import { getSeedPromos } from '../data/promoSeed';
import { applyPromoInput, createPromo, findPromoByCode, isCodeTaken, normalizeCode } from '../services/promoService';
import { STORAGE_KEYS } from '../utils/storageKeys';

const PromoContext = createContext();

const MOCK_LATENCY_MS = 400; // simulated network delay: remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Promo codes (see services/promoService.js for the shape). Promos are keyed
 * by CODE, not a numeric id: carts and orders already refer to them by code,
 * and the code can't change after creation (delete + recreate instead).
 *
 * Mutations are async (mock latency): addPromo(input), updatePromo(code, input),
 * deletePromo(code). Deleting is safe: orders keep their own discount amount and
 * code text, and carts simply lose the discount (CartContext reports it).
 *
 * Real backend: replace the persistence inside this provider with fetches;
 * the values it exposes can stay the same.
 */
export const PromoProvider = ({ children }) => {
  const [promos, setPromos] = useSeededCollection(STORAGE_KEYS.promos, getSeedPromos);

  const value = useMemo(() => {
    // Real backend: POST /admin/promos, PATCH /admin/promos/:code, DELETE /admin/promos/:code.
    const addPromo = async (input) => {
      if (isCodeTaken(promos, input.code)) {
        throw new Error(`A promo with the code “${normalizeCode(input.code)}” already exists.`);
      }
      const promo = createPromo(input);
      await delay(MOCK_LATENCY_MS);
      setPromos((prev) => [...prev, promo]);
      return promo;
    };

    const updatePromo = async (code, input) => {
      if (!findPromoByCode(promos, code)) throw new Error('This promo no longer exists.');
      await delay(MOCK_LATENCY_MS);
      setPromos((prev) => prev.map((promo) => (promo.code === code ? applyPromoInput(promo, input) : promo)));
    };

    const deletePromo = async (code) => {
      await delay(MOCK_LATENCY_MS);
      setPromos((prev) => prev.filter((promo) => promo.code !== code));
    };

    return { promos, addPromo, updatePromo, deletePromo };
  }, [promos, setPromos]);

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>;
};

export const usePromos = () => {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error('usePromos must be used within a PromoProvider');
  }
  return context;
};