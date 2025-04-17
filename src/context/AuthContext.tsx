import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { API } from '../constants/api';

export interface AuthUser {
  nickname: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetchWithAuth(API.auth.validate);
      const data = await res.json();

      if (data.valid) {
        setUser({ nickname: data.nickname, role: data.role });
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error al validar el token:', err);
      setError('Error al validar el token');
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
