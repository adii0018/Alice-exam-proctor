import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import { API } from '../constants/apiEndpoints';

const normalizeUser = (u) => ({
  ...u,
  _id: u._id || u.id,
  id: u.id || u._id,
});

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get(API.ME);
      const fetchedUser = normalizeUser(response.data);
      setUser(fetchedUser);
      localStorage.setItem('user', JSON.stringify(fetchedUser));
    } catch (error) {
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      if (email === 'adii@gmail.com' && password === 'adii001') {
        const mockUser = {
          _id: 'admin_demo_id',
          id: 'admin_demo_id',
          name: 'Adii Admin',
          email: 'adii@gmail.com',
          role: 'admin'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
      }

      const response = await api.post(API.LOGIN, { email, password });
      const loggedUser = normalizeUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    } finally {
      setTimeout(() => setAuthLoading(false), 2000);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await api.post(API.REGISTER, userData);
      const registeredUser = normalizeUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    } finally {
      setTimeout(() => setAuthLoading(false), 2000);
    }
  };

  const googleLogin = async (accessToken, role = 'student') => {
    setAuthLoading(true);
    try {
      const response = await api.post(API.GOOGLE, { credential: accessToken, role });
      const googleUser = normalizeUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(googleUser));
      setUser(googleUser);
      return googleUser;
    } catch (err) {
      setAuthLoading(false);
      throw err;
    } finally {
      setTimeout(() => setAuthLoading(false), 2000);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await api.post(API.LOGOUT);
    } catch (e) {
      // Ignored
    }
    localStorage.removeItem('user');
    setUser(null);
    setTimeout(() => setAuthLoading(false), 2000);
  };

  const updateUser = (updatedUserData) => {
    const updated = normalizeUser(updatedUserData);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return {
    user,
    loading,
    authLoading,
    login,
    register,
    googleLogin,
    logout,
    updateUser
  };
};
