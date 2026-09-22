import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

// Mock auth — persists a fake "session" to localStorage so the UI can
// simulate a signed-in state (Header account icon, future Account page
// guards, etc). Replace signIn/signUp/signOut with real API calls, and
// swap the localStorage-backed session for httpOnly cookies or a proper
// token store, when you connect a real backend.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('heim_auth_user', null);

  const signIn = ({ email, fullName }) => {
    setUser({ email, fullName: fullName || email.split('@')[0] });
    return Promise.resolve({ email });
  };

  const signUp = ({ fullName, email }) => {
    setUser({ email, fullName });
    return Promise.resolve({ email });
  };

  const signOut = () => setUser(null);

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
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