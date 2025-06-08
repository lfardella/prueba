import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, loginWithEmail, registerWithEmail, logout, verifyEmail } from '../api/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(email, password);
      setUser(user);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await registerWithEmail(email, name, password);
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (email: string, code: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await verifyEmail(email, code);
      if (success && user) {
        setUser({ ...user, isVerified: true });
        localStorage.setItem('isLoggedIn', 'true');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('isLoggedIn');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verify,
        logoutUser,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};