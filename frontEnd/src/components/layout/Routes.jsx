// PrivateRoute.jsx — redirects to /login if not logged in
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// AdminRoute.jsx — redirects to /dashboard if not admin
export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user)    return <Navigate to="/login"     replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
