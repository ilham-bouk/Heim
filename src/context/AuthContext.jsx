import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { ROLES } from '../utils/constants';
import { DEMO_ADMIN } from '../config/demo';

const AuthContext = createContext();

// Mock auth: persists a fake "session" to localStorage so the UI can simulate
// a signed-in state. Replace signIn/signUp/signOut with real API calls, and
// swap the localStorage session for httpOnly cookies or a token store, when
// you connect a real backend.
//
// ROLES: the session user carries `role` ('admin' | 'customer'). Here it is
// assigned by matching config/demo.js. A real backend returns the role in the
// session. NOTE: anyone can edit localStorage, so this is UI gating only and
// NOT security. Real authorisation must be enforced server-side.

const MOCK_LATENCY_MS = 800; // simulated network delay — remove when wiring a real API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isDemoAdminEmail = (email) => email.trim().toLowerCase() === DEMO_ADMIN.email;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.auth, null);

  // Customers: any credentials (mock). Demo admin: password must match.
  const signIn = async ({ email, password, fullName }) => {
    await delay(MOCK_LATENCY_MS);
    const isAdmin = isDemoAdminEmail(email);
    if (isAdmin && password !== DEMO_ADMIN.password) {
      throw new Error('Invalid email or password');
    }
    const nextUser = {
      email: isAdmin ? DEMO_ADMIN.email : email.trim(),
      fullName: isAdmin ? DEMO_ADMIN.fullName : fullName || email.split('@')[0],
      role: isAdmin ? ROLES.ADMIN : ROLES.CUSTOMER,
      phone: '',
      birthday: '',
    };
    setUser(nextUser);
    return nextUser;
  };

  const signUp = async ({ fullName, email }) => {
    await delay(MOCK_LATENCY_MS);
    if (isDemoAdminEmail(email)) {
      throw new Error('This email is reserved for the demo admin. Please use another one.');
    }
    const nextUser = { email: email.trim(), fullName, role: ROLES.CUSTOMER, phone: '', birthday: '' };
    setUser(nextUser);
    return nextUser;
  };

  const signOut = () => setUser(null);

  // Mock profile update — merges into the local user object. A real
  // backend would PATCH /me here.
  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    return Promise.resolve();
  };

  // Mock password change.
  const updatePassword = ({ currentPassword, newPassword }) => {
    if (!currentPassword) {
      return Promise.reject(new Error('Current password is required'));
    }
    if (!newPassword || newPassword.length < 8) {
      return Promise.reject(new Error('New password must be at least 8 characters'));
    }
    return Promise.resolve();
  };

  // Sessions saved before roles existed have no `role`: treat them as customers.
  const role = user ? user.role ?? ROLES.CUSTOMER : null;

  const value = {
    user,
    isAuthenticated: !!user,
    role,
    hasRole: (requiredRole) => role === requiredRole,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};