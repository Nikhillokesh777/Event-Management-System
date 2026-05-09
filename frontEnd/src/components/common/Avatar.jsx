import React from 'react';
import './Avatar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Avatar.jsx
//
// Usage:
//   <Avatar name="Arjun Mehta" color="#4F46E5" />
//   <Avatar name="Priya Sharma" color="#10B981" size="lg" />
//   <Avatar image="https://..." name="Rohit" size="sm" />
//   <Avatar name="Admin" color="#4F46E5" size="xl" ring />
//   <Avatar name="Sneha" color="#EF4444" size="md" showStatus status="online" />
// ─────────────────────────────────────────────────────────────────────────────

// Derives initials from full name — "Arjun Mehta" → "AM"
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

function Avatar({
  name       = '',
  image,               // profile image URL (optional)
  color      = '#4F46E5', // base color for gradient + ring
  size       = 'md',   // xs | sm | md | lg | xl | 2xl
  ring       = false,  // force show colored ring border
  showStatus = false,  // show online/offline dot
  status     = 'online', // online | offline | away
  onClick,
}) {

  const initials  = getInitials(name);
  const isClickable = !!onClick;

  const classes = [
    'avatar',
    `avatar--${size}`,
    ring        ? 'avatar--ring'      : '',
    isClickable ? 'avatar--clickable' : '',
  ].filter(Boolean).join(' ');

  // Build gradient from user color toward a lighter/bluer tone
  const gradient = `linear-gradient(135deg, ${color} 0%, ${shiftColor(color)} 100%)`;

  return (
    <div
      className={classes}
      onClick={onClick}
      style={{ '--avatar-color': color, '--avatar-gradient': gradient }}
      title={name}
    >
      {/* ── Image or Initials ──────────────────────────────── */}
      {image ? (
        <img
          src={image}
          alt={name}
          className="avatar__image"
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <span className="avatar__initials">{initials}</span>
      )}

      {/* ── Status Dot ────────────────────────────────────── */}
      {showStatus && (
        <span className={`avatar__status avatar__status--${status}`} />
      )}
    </div>
  );
}

// ─── Helper: shift the color slightly toward blue for gradient end ────────────
function shiftColor(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Mix toward #3B82F6 (blue) by 40%
    const tr = 59, tg = 130, tb = 246;
    const nr = Math.round(r + (tr - r) * 0.4);
    const ng = Math.round(g + (tg - g) * 0.4);
    const nb = Math.round(b + (tb - b) * 0.4);
    return `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`;
  } catch {
    return '#3B82F6';
  }
}

export default Avatar;
