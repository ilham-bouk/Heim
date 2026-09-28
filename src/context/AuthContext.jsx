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
    setUser({ email, fullName: fullName || email.split('@')[0], phone: '', birthday: '' });
    return Promise.resolve({ email });
  };

  const signUp = ({ fullName, email }) => {
    setUser({ email, fullName, phone: '', birthday: '' });
    return Promise.resolve({ email });
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

  const value = {
    user,
    isAuthenticated: !!user,
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