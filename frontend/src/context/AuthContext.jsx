import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('petvilla_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('petvilla_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getProfile();
      setUser(res.data);
      localStorage.setItem('petvilla_user', JSON.stringify(res.data));
    } catch (err) {
      console.warn('Profile fetch failed:', err);
      // If unauthorized, token might be invalid
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth-expired', handleExpired);
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  const login = async (username, password) => {
    setAuthError(null);
    try {
      const res = await authService.login({ username, password });
      localStorage.setItem('petvilla_access_token', res.data.access);
      localStorage.setItem('petvilla_refresh_token', res.data.refresh);

      const profileRes = await authService.getProfile();
      setUser(profileRes.data);
      localStorage.setItem('petvilla_user', JSON.stringify(profileRes.data));
      return { success: true, user: profileRes.data };
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid credentials. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      await authService.register(userData);
      // Immediately log in user with provided credentials
      return await login(userData.username, userData.password);
    } catch (err) {
      let msg = 'Registration failed. Please check your inputs.';
      if (err.response?.data) {
        const firstKey = Object.keys(err.response.data)[0];
        const firstErr = err.response.data[firstKey];
        msg = Array.isArray(firstErr) ? `${firstKey}: ${firstErr[0]}` : String(firstErr);
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      setUser(res.data);
      localStorage.setItem('petvilla_user', JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data || 'Failed to update profile' };
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('petvilla_refresh_token');
    if (refresh) {
      try {
        await authService.logout(refresh);
      } catch (e) {
        // Ignore logout error
      }
    }
    localStorage.removeItem('petvilla_access_token');
    localStorage.removeItem('petvilla_refresh_token');
    localStorage.removeItem('petvilla_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: !!user,
        isSeller: user?.user_type === 'seller',
        isCustomer: user?.user_type === 'customer',
        login,
        register,
        logout,
        updateProfile,
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
