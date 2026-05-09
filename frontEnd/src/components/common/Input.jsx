import React, { useState } from 'react';
import './Input.css';

// ─────────────────────────────────────────────────────────────────────────────
// Input.jsx
//
// Usage:
//   <Input label="Email" type="email" />
//   <Input label="Password" type="password" />
//   <Input label="Search" icon="🔍" />
//   <Input label="Name" error="Name is required" />
//   <Input label="Email" success="Looks good!" />
//   <Input label="Bio" multiline rows={4} />
//   <Input label="Venue" value={val} onChange={e => setVal(e.target.value)} />
// ─────────────────────────────────────────────────────────────────────────────

function Input({
  label,
  type        = 'text',
  placeholder = '',
  value       = '',
  onChange,
  icon,               // left icon (emoji or character)
  error,              // red state — string message shown below
  success,            // green state — string message shown below
  disabled  = false,
  multiline = false,  // renders <textarea> instead of <input>
  rows      = 3,
  name,
  id,
  style     = {},
  inputStyle = {},
}) {

  const [focused,     setFocused]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Float the label when focused OR when there is a value
  const isFloated = focused || value !== '';

  // Determine current state for styling
  const stateClass = error   ? 'input-wrapper--error'
                   : success ? 'input-wrapper--success'
                   : focused ? 'input-wrapper--focused'
                   : '';

  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  // Actual input type — toggle password visibility
  const resolvedType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  const sharedProps = {
    id:          inputId,
    name:        name,
    value:       value,
    onChange:    onChange,
    disabled:    disabled,
    onFocus:     () => setFocused(true),
    onBlur:      () => setFocused(false),
    className:   `input-field ${icon ? 'input-field--has-icon' : ''} ${type === 'password' ? 'input-field--has-toggle' : ''}`,
    style:       inputStyle,
    // placeholder is empty — the floating label acts as placeholder
    placeholder: isFloated ? placeholder : '',
  };

  return (
    <div className={`input-wrapper ${stateClass} ${disabled ? 'input-wrapper--disabled' : ''}`} style={style}>

      {/* ── Left Icon ─────────────────────────────────────────── */}
      {icon && (
        <span className={`input-icon ${isFloated ? 'input-icon--active' : ''}`}>
          {icon}
        </span>
      )}

      {/* ── Input or Textarea ──────────────────────────────────── */}
      {multiline ? (
        <textarea
          {...sharedProps}
          rows={rows}
          className={`input-field input-field--textarea ${icon ? 'input-field--has-icon' : ''}`}
        />
      ) : (
        <input
          {...sharedProps}
          type={resolvedType}
        />
      )}

      {/* ── Floating Label ────────────────────────────────────── */}
      {label && (
        <label
          htmlFor={inputId}
          className={`input-label ${isFloated ? 'input-label--floated' : ''} ${icon ? 'input-label--with-icon' : ''}`}
        >
          {label}
        </label>
      )}

      {/* ── Password Toggle ───────────────────────────────────── */}
      {type === 'password' && (
        <button
          type="button"
          className="input-toggle"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            // Eye-off icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            // Eye icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}

      {/* ── Success Icon ──────────────────────────────────────── */}
      {success && !error && type !== 'password' && (
        <span className="input-success-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}

      {/* ── Messages ──────────────────────────────────────────── */}
      {error && (
        <p className="input-message input-message--error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/>
          </svg>
          {error}
        </p>
      )}

      {success && !error && (
        <p className="input-message input-message--success">
          {success}
        </p>
      )}

    </div>
  );
}

export default Input;
