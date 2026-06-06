import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Set the default Authorization header for Axios
  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Synchronize authentication status on startup
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthHeader(token);
        const res = await axios.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Session recovery failed:', err.response?.data?.message || err.message);
        // Clear stale local token if verification fails
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  // Utility to wipe credentials
  const clearAuth = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setToken(null);
    setUser(null);
  };

  // Register Handler
  const register = async (username, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/register', { username, email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('token', userToken);
      setAuthHeader(userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Server error.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login Handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('token', userToken);
      setAuthHeader(userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const logout = () => {
    clearAuth();
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        register,
        login,
        logout,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
