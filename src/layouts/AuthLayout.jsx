import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div
    style={{
      minHeight:       '100vh',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      backgroundColor: 'var(--color-primary)',
      padding:         '24px',
    }}
  >
    <div
      style={{
        width:           '100%',
        maxWidth:        '440px',
        background:      'var(--color-surface)',
        borderRadius:    'var(--border-radius-xl)',
        border:          '1px solid var(--color-surface-border)',
        boxShadow:       'var(--shadow-modal)',
        padding:         '40px',
        animation:       'scaleIn 0.3s ease-out',
      }}
    >
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;