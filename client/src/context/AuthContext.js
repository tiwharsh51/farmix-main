import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Returns the correct redirect path based on user role.
   * admin → /admin-dashboard | user → /user-dashboard
   */
  const getRedirectPath = (userData) => {
    return userData?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setUser(res.data.data);
      return { ...res.data, redirectTo: getRedirectPath(res.data.data) };
    }
  };

  /**
   * role: 'user' | 'admin'  (sent from Register form)
   */
  const register = async (name, email, password, role = 'user') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setUser(res.data.data);
      return { ...res.data, redirectTo: getRedirectPath(res.data.data) };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getRedirectPath }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
