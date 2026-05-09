import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import './Toast.css';

// ─────────────────────────────────────────────────────────────────────────────
// Toast.jsx — Top-right slide in, 3s auto-dismiss with timer bar, 4 types
//
// SETUP in main.js — wrap app with <ToastProvider>:
//   <ToastProvider>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </ToastProvider>
//
// USE anywhere with useToast() hook:
//   const toast = useToast();
//   toast.success('Registered for Tech Fest 2024!');
//   toast.error('Something went wrong. Try again.');
//   toast.warning('Only 5 seats remaining!');
//   toast.info('New event: AI & ML Summit added.');
// ─────────────────────────────────────────────────────────────────────────────

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ── Single Toast item ─────────────────────────────────────────────────────────
function ToastItem({ id, type, message, onRemove }) {
  const [visible,  setVisible]  = useState(false);
  const [removing, setRemoving] = useState(false);
  const timerRef = useRef(null);

  const ICONS = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  const LABELS = {
    success: 'Success',
    error:   'Error',
    warning: 'Warning',
    info:    'Info',
  };

  // Slide in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Auto dismiss after 3s
  useEffect(() => {
    timerRef.current = setTimeout(() => handleRemove(), 3200);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleRemove = () => {
    clearTimeout(timerRef.current);
    setRemoving(true);
    // Wait for slide-out animation then remove from DOM
    setTimeout(() => onRemove(id), 320);
  };

  const classes = [
    'toast',
    `toast--${type}`,
    visible  ? 'toast--visible'  : '',
    removing ? 'toast--removing' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">

      {/* ── Icon ────────────────────────────────────────────── */}
      <div className={`toast__icon-box toast__icon-box--${type}`}>
        <span className="toast__icon">{ICONS[type]}</span>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="toast__content">
        <div className="toast__label">{LABELS[type]}</div>
        <div className="toast__message">{message}</div>
      </div>

      {/* ── Close button ────────────────────────────────────── */}
      <button
        className="toast__close"
        onClick={handleRemove}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6"  y2="18" />
          <line x1="6"  y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Timer bar (shrinks over 3s) ──────────────────────── */}
      <div className={`toast__timer toast__timer--${type}`} />

    </div>
  );
}

// ── Provider + Container ──────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Generate unique id
  const genId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addToast = useCallback((type, message) => {
    const id = genId();
    setToasts(prev => {
      // Max 4 toasts at once — remove oldest if exceeded
      const next = prev.length >= 4 ? prev.slice(1) : prev;
      return [...next, { id, type, message }];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Shorthand methods
  const toast = {
    success: (msg) => addToast('success', msg),
    error:   (msg) => addToast('error',   msg),
    warning: (msg) => addToast('warning', msg),
    info:    (msg) => addToast('info',    msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* ── Toast container (fixed top-right) ───────────────── */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <ToastItem
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
