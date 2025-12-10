import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nova_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const data = await api.post<{ user: User, token: string }>('/auth.php?action=login', { email, password });
      setUser(data.user);
      localStorage.setItem('nova_user', JSON.stringify(data.user));
      // In a real app, store token in HttpOnly cookie or secure storage
      localStorage.setItem('nova_token', data.token);
    } catch (err: any) {
      alert("Login failed: " + err.message);
      throw err;
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      const data = await api.post<{ user: User, token: string }>('/auth.php?action=register', { name, email, password });
      setUser(data.user);
      localStorage.setItem('nova_user', JSON.stringify(data.user));
    } catch (err: any) {
      alert("Registration failed: " + err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nova_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};