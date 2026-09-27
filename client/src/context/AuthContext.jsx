import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('smt_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('smt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smt_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('smt_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('smt_token', res.token);
      localStorage.setItem('smt_user', JSON.stringify(res.user));
    }
    return res;
  };

  const registerParent = async (data) => {
    const res = await authService.registerParent(data);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('smt_token', res.token);
      localStorage.setItem('smt_user', JSON.stringify(res.user));
    }
    return res;
  };

  const registerTutor = async (formData) => {
    const res = await authService.registerTutor(formData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('smt_token', res.token);
      localStorage.setItem('smt_user', JSON.stringify(res.user));
    }
    return res;
  };

  const registerCenter = async (formData) => {
    const res = await authService.registerCenter(formData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('smt_token', res.token);
      localStorage.setItem('smt_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smt_token');
    localStorage.removeItem('smt_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('smt_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isParent = role === 'parent';
  const isTutor = role === 'tutor';
  const isCenter = role === 'center';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role,
        isAdmin,
        isParent,
        isTutor,
        isCenter,
        login,
        registerParent,
        registerTutor,
        registerCenter,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
