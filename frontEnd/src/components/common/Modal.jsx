import React, { useEffect, useCallback } from 'react';
import Button from './Button';
import './Modal.css';
import { formatFee, formatDate } from '../../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Modal.jsx
//
// Usage:
//   // Register confirmation
//   <Modal
//     isOpen={showModal}
//     onClose={() => setShowModal(false)}
//     type="register"
//     event={selectedEvent}
//     onConfirm={handleRegister}
//     loading={registering}
//   />
//
//   // Delete / danger confirmation
//   <Modal
//     isOpen={showDelete}
//     onClose={() => setShowDelete(false)}
//     type="danger"
//     title="Delete Event"
//     message="Are you sure you want to delete Tech Fest 2024? This cannot be undone."
//     confirmLabel="Yes, Delete"
//     onConfirm={handleDelete}
//     loading={deleting}
//   />
//
//   // Generic modal with custom children
//   <Modal isOpen={open} onClose={close} title="Custom Modal">
//     <p>Any content here</p>
//   </Modal>
// ─────────────────────────────────────────────────────────────────────────────

function Modal({
  isOpen,
  onClose,
  onConfirm,
  type         = 'default',  // default | register | danger
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  loading      = false,
  event,                     // pass full event object for register type
  children,
}) {

  // ── Close on Escape key ──────────────────────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) onClose();
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Lock body scroll when open ───────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Close on backdrop click ──────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── Render register modal content ────────────────────────────────────────
  const renderRegisterContent = () => (
    <>
      {/* Icon */}
      <div className="modal__icon modal__icon--register">🎟️</div>

      {/* Title */}
      <h2 className="modal__title">Confirm Registration</h2>
      <p className="modal__subtitle">You're about to register for this event</p>

      {/* Event info card */}
      {event && (
        <div className="modal__event-card">
          {event.image && (
            <img src={event.image} alt={event.title} className="modal__event-img" />
          )}
          <div className="modal__event-info">
            <div className="modal__event-title">{event.title}</div>
            <div className="modal__event-meta">
              <span>📅 {formatDate(event.date)}</span>
              <span>🕐 {event.time}</span>
            </div>
            <div className="modal__event-meta">
              <span>📍 {event.venue}</span>
            </div>
          </div>
          <div className={`modal__event-fee ${event.isFree ? 'modal__event-fee--free' : 'modal__event-fee--paid'}`}>
            {formatFee(event)}
          </div>
        </div>
      )}

      {/* Fee warning if paid */}
      {event && !event.isFree && (
        <div className="modal__fee-notice">
          <span>💳</span>
          <span>A fee of <strong>₹{event.fee}</strong> will be collected at the venue</span>
        </div>
      )}

      {/* Actions */}
      <div className="modal__actions">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={onConfirm} loading={loading}>
          {loading ? 'Registering...' : 'Confirm Registration'}
        </Button>
      </div>
    </>
  );

  // ── Render danger/delete modal content ───────────────────────────────────
  const renderDangerContent = () => (
    <>
      {/* Warning icon */}
      <div className="modal__icon modal__icon--danger">⚠️</div>

      <h2 className="modal__title modal__title--danger">
        {title || 'Are you sure?'}
      </h2>
      <p className="modal__message">
        {message || 'This action cannot be undone.'}
      </p>

      <div className="modal__actions">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {loading ? 'Deleting...' : (confirmLabel || 'Yes, Delete')}
        </Button>
      </div>
    </>
  );

  // ── Render default modal content ─────────────────────────────────────────
  const renderDefaultContent = () => (
    <>
      {title && <h2 className="modal__title">{title}</h2>}
      {message && <p className="modal__message">{message}</p>}
      {children}
      {onConfirm && (
        <div className="modal__actions">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      )}
    </>
  );

  return (
    // ── Backdrop ────────────────────────────────────────────────────────────
    <div className="modal-backdrop" onClick={handleBackdropClick}>

      {/* ── Modal box ───────────────────────────────────────────────────── */}
      <div className={`modal-box modal-box--${type}`} role="dialog" aria-modal="true">

        {/* Close X button */}
        <button className="modal__close" onClick={onClose} aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Content based on type */}
        {type === 'register' && renderRegisterContent()}
        {type === 'danger'   && renderDangerContent()}
        {type === 'default'  && renderDefaultContent()}

      </div>
    </div>
  );
}

export default Modal;
