import React from 'react';
import './Button.css';

// ─────────────────────────────────────────────────────────────────────────────
// Button.jsx
//
// Usage:
//   <Button>Register</Button>
//   <Button variant="secondary">Cancel</Button>
//   <Button variant="danger">Delete</Button>
//   <Button variant="ghost">View Details</Button>
//   <Button variant="success">Confirm</Button>
//   <Button size="sm">Small</Button>
//   <Button size="lg">Large</Button>
//   <Button loading>Saving...</Button>
//   <Button disabled>Unavailable</Button>
//   <Button icon="→">Continue</Button>
//   <Button fullWidth>Full Width</Button>
// ─────────────────────────────────────────────────────────────────────────────

function Button({
  children,
  variant  = 'primary',   // primary | secondary | danger | ghost | success
  size     = 'md',        // sm | md | lg
  loading  = false,       // shows spinner, disables click
  disabled = false,       // grayed out, no click
  fullWidth = false,      // 100% width
  icon,                   // optional icon/emoji after text
  onClick,
  type     = 'button',
  className = '',
  style = {},
}) {

  const isDisabled = disabled || loading;

  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth  ? 'btn--full'     : '',
    isDisabled ? 'btn--disabled' : '',
    loading    ? 'btn--loading'  : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      style={style}
    >
      {/* Spinner shown when loading */}
      {loading && <span className="btn__spinner" />}

      {/* Button label */}
      <span className="btn__label">{children}</span>

      {/* Optional icon on the right */}
      {icon && !loading && <span className="btn__icon">{icon}</span>}
    </button>
  );
}

export default Button;
