'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from './api';
import type { User } from './types';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('pocket_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function persist(data: AuthResponse) {
    localStorage.setItem('pocket_token', data.token);
    localStorage.setItem('pocket_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const data = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persist(data);
    router.push('/dashboard');
  }

  async function register(email: string, password: string, name: string) {
    const data = await apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    persist(data);
    router.push('/dashboard');
  }

  function logout() {
    localStorage.removeItem('pocket_token');
    localStorage.removeItem('pocket_user');
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
