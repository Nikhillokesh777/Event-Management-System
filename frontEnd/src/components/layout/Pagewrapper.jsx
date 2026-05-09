// PageWrapper.jsx — consistent max-width + padding for all pages
import React from 'react';

export function PageWrapper({ children, style = {} }) {
  return (
    <div style={{
      maxWidth:  '1200px',
      margin:    '0 auto',
      padding:   '32px 24px 64px',
      ...style,
    }}>
      {children}
    </div>
  );
}
