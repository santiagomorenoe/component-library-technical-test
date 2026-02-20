'use client';

import { useState, useCallback, useEffect } from 'react';
import { getStoredToken, getStoredUser, saveAuth, clearAuth } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

export interface UseAuthReturn {
  token: string | null;
  user: AuthUser | null;
  initialized: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
    setUser(getStoredUser());
    setInitialized(true);
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    saveAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return { token, user, initialized, login, logout };
}
