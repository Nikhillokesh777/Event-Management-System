import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// useAuth.js — Custom hook to access AuthContext anywhere in the app
//
// Usage in any component:
//   const { user, login, logout, isAdmin } = useAuth();
//
// Instead of writing this every time:
//   const { user } = useContext(AuthContext)   ← verbose
// You write this:
//   const { user } = useAuth()                 ← clean
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);

  // Safety check — if useAuth is used outside AuthProvider, throw clear error
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>. Check your main.js.');
  }

  return context;
}
