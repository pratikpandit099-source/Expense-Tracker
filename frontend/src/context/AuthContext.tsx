import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setAccessToken } from '../api/client.js';
import { User, ApiResponse } from '../types/index.js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    try {
      // Attempt silent refresh using httpOnly cookie
      const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/refresh');
      if (res.data.success && res.data.data) {
        setAccessToken(res.data.data.accessToken);
        setUser(res.data.data.user);
      }
    } catch {
      // User is not logged in / no refresh token
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', {
      email,
      password,
    });

    if (res.data.success && res.data.data) {
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword?: string) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });

    if (res.data.success && res.data.data) {
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
      toast.success('Account created successfully! Welcome to ExpenseFlow.');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      setAccessToken(null);
      setUser(null);
      toast.info('You have been logged out.');
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
      if (res.data.success && res.data.data) {
        setUser(res.data.data.user);
      }
    } catch {
      // Profile fetch failed
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
