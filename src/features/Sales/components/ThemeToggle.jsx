import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      style={{
        position:        'relative',
        display:         'flex',
        alignItems:      'center',
        gap:             8,
        padding:         '7px 14px 7px 10px',
        background:      'var(--bg-card)',
        border:          '1.5px solid var(--border-strong)',
        borderRadius:    40,
        cursor:          'pointer',
        transition:      'all 0.25s cubic-bezier(.4,0,.2,1)',
        boxShadow:       'var(--shadow-card)',
        overflow:        'hidden',
      }}
    >
      {/* Animated track */}
      <div style={{
        width:        42,
        height:       24,
        background:   isDark ? '#1e2d5e' : '#dde6ff',
        borderRadius: 99,
        position:     'relative',
        border:       `1.5px solid ${isDark ? '#4f7cff55' : '#3b6bff44'}`,
        transition:   'background 0.3s',
        flexShrink:   0,
      }}>
        {/* Thumb */}
        <div style={{
          position:     'absolute',
          top:          2,
          left:         isDark ? 18 : 2,
          width:        16,
          height:       16,
          borderRadius: '50%',
          background:   isDark ? '#4f7cff' : '#3b6bff',
          boxShadow:    `0 0 8px ${isDark ? '#4f7cff88' : '#3b6bff66'}`,
          transition:   'left 0.25s cubic-bezier(.4,0,.2,1), background 0.3s',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     9,
        }}>
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>

      {/* Label */}
      <span style={{
        fontFamily:  'Cairo, sans-serif',
        fontSize:    12,
        fontWeight:  700,
        color:       'var(--text-secondary)',
        whiteSpace:  'nowrap',
        transition:  'color 0.3s',
      }}>
        {isDark ? 'داكن' : 'فاتح'}
      </span>
    </button>
  );
}