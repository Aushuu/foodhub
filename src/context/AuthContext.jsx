import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodhub_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, we can optionally verify with api.getMe()
    const verifyUser = async () => {
      if (token) {
        try {
          const data = await api.getMe();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('foodhub_user', JSON.stringify(data.user));
          }
        } catch (err) {
          // Keep existing local user if running offline/dev mode
        }
      }
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('foodhub_token', data.token);
      localStorage.setItem('foodhub_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('foodhub_token', data.token);
      localStorage.setItem('foodhub_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodhub_token');
    localStorage.removeItem('foodhub_user');
  };

  const updateUserProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('foodhub_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

