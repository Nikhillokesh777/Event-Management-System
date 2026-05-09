import React from 'react';
import './Loader.css';

// ─────────────────────────────────────────────────────────────────────────────
// Loader.jsx
//
// Usage:
//   // Full page loader (centered on whole screen)
//   <Loader fullPage />
//   <Loader fullPage label="Loading events..." />
//
//   // Section loader (centered in a card or container)
//   <Loader section />
//   <Loader section label="Fetching data..." />
//
//   // Inline loader (small, sits next to text)
//   <Loader size="sm" />
//   <Loader size="md" />
//   <Loader size="lg" />
//
//   // Custom color
//   <Loader color="green" />
//   <Loader color="white" />   ← inside dark buttons
// ─────────────────────────────────────────────────────────────────────────────

function Loader({
  fullPage = false,   // centers on entire viewport
  section  = false,   // centers inside a card/section
  size     = 'md',   // sm | md | lg | xl
  color    = 'indigo', // indigo | blue | green | white | gray
  label,              // optional text below spinner
}) {

  const spinner = (
    <div className={`loader__ring loader__ring--${size} loader__ring--${color}`}>
      {/* Four arc segments create the Apple-style spinner */}
      <div className="loader__arc" />
    </div>
  );

  // Full page — covers entire viewport
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className="loader-fullpage__inner">
          {/* Brand mark above spinner */}
          <div className="loader-fullpage__brand">
            <span className="loader-fullpage__emoji">🎓</span>
          </div>
          {spinner}
          {label && <p className="loader__label loader__label--fullpage">{label}</p>}
        </div>
      </div>
    );
  }

  // Section — centered inside a container
  if (section) {
    return (
      <div className="loader-section">
        {spinner}
        {label && <p className="loader__label">{label}</p>}
      </div>
    );
  }

  // Inline — just the spinner, no wrapper
  return (
    <span className="loader-inline">
      {spinner}
      {label && <span className="loader__label loader__label--inline">{label}</span>}
    </span>
  );
}

export default Loader;
