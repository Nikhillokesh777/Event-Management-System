 import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    setUser(null);
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const isAdmin    = user?.role === 'admin';
  const isStudent  = user?.role === 'student';
  const isLoggedIn = !!user;

  if (loading) return (
    <div style={{
      minHeight:'100vh', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'#F8F9FF', fontFamily:"'DM Sans', sans-serif"
    }}>
      <div style={{ textAlign:'center' }}>
        <div style={{
          width:44, height:44,
          border:'4px solid #EEF2FF',
          borderTop:'4px solid #4F46E5',
          borderRadius:'50%',
          animation:'spin 0.8s linear infinite',
          margin:'0 auto 16px'
        }} />
        <p style={{ color:'#6B7280', fontSize:14 }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isStudent, isLoggedIn, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}