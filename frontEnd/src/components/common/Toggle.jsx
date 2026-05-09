import React from 'react';
import './Toggle.css';

// ─────────────────────────────────────────────────────────────────────────────
// Toggle.jsx
//
// Usage:
//   <Toggle label="Free Event"      checked={isFree}    onChange={setIsFree} />
//   <Toggle label="College Event"   checked={isCollege} onChange={setIsCollege} />
//   <Toggle label="Publish Now"     checked={publish}   onChange={setPublish} color="green" />
//   <Toggle label="Notifications"   checked={notif}     onChange={setNotif}  size="sm" />
//   <Toggle label="Disabled option" checked={false}     onChange={() => {}}  disabled />
//   <Toggle
//     label="Paid Event"
//     sublabel="Students will be charged a fee"
//     checked={isPaid}
//     onChange={setIsPaid}
//   />
// ─────────────────────────────────────────────────────────────────────────────

function Toggle({
  label,
  sublabel,            // optional smaller description below label
  checked   = false,
  onChange,
  disabled  = false,
  size      = 'md',   // sm | md | lg
  color     = 'blue', // blue | green | indigo
  id,
  name,
}) {

  const toggleId = id || name || `toggle-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  const classes = [
    'toggle-wrapper',
    disabled ? 'toggle-wrapper--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <label htmlFor={toggleId} className={classes}>

      {/* ── Hidden native checkbox (for accessibility) ─────── */}
      <input
        type="checkbox"
        id={toggleId}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="toggle-input"
      />

      {/* ── Visual Track + Thumb ───────────────────────────── */}
      <span className={`toggle-track toggle-track--${size} toggle-track--${color} ${checked ? 'toggle-track--on' : ''}`}>
        <span className={`toggle-thumb toggle-thumb--${size} ${checked ? 'toggle-thumb--on' : ''}`} />
      </span>

      {/* ── Label area ────────────────────────────────────── */}
      {(label || sublabel) && (
        <span className="toggle-labels">
          {label    && <span className="toggle-label">{label}</span>}
          {sublabel && <span className="toggle-sublabel">{sublabel}</span>}
        </span>
      )}

    </label>
  );
}

export default Toggle;
