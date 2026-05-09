import React from 'react';
import './Badge.css';

// ─────────────────────────────────────────────────────────────────────────────
// Badge.jsx
//
// Usage:
//   <Badge color="green">FREE</Badge>
//   <Badge color="amber">₹500</Badge>
//   <Badge color="blue">College</Badge>
//   <Badge color="purple">External</Badge>
//   <Badge color="green">Attended</Badge>
//   <Badge color="blue">Registered</Badge>
//   <Badge color="red">Cancelled</Badge>
//   <Badge color="gray">Past</Badge>
//   <Badge color="gray">Draft</Badge>
//   <Badge color="green" dot>Live</Badge>
//   <Badge color="blue" size="lg">College Event</Badge>
// ─────────────────────────────────────────────────────────────────────────────

function Badge({
  children,
  color = 'blue',   // blue | green | amber | red | purple | gray
  size  = 'md',     // sm | md | lg
  dot   = false,    // show a colored dot on the left
  icon,             // optional emoji/icon before text
}) {

  const classes = [
    'badge',
    `badge--${color}`,
    `badge--${size}`,
  ].join(' ');

  return (
    <span className={classes}>
      {/* Dot indicator */}
      {dot && <span className="badge__dot" />}

      {/* Optional icon */}
      {icon && <span className="badge__icon">{icon}</span>}

      {/* Label */}
      <span className="badge__label">{children}</span>
    </span>
  );
}

export default Badge;
