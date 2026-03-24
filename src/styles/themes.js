// src/styles/themes.js
export const themes = {
  dark: {
    // ── Backgrounds ───────────────────────────────
    '--bg-root':        '#0f1117',
    '--bg-surface':     '#1a1d27',
    '--bg-card':        '#21242f',
    '--bg-input':       '#1a1d27',
    '--bg-hover':       '#2a2d3a',
    '--bg-sidebar':     '#161820',

    // ── Borders ───────────────────────────────────
    '--border':         '#2e3145',
    '--border-strong':  '#3d4160',

    // ── Text ──────────────────────────────────────
    '--text-primary':   '#f0f2ff',
    '--text-secondary': '#8b90a8',
    '--text-muted':     '#555a72',

    // ── Accent ────────────────────────────────────
    '--accent':         '#4f7cff',
    '--accent-dim':     '#1e2d5e',
    '--accent-hover':   '#6b92ff',

    // ── Status ────────────────────────────────────
    '--success':        '#22c55e',
    '--success-dim':    '#052e16',
    '--warning':        '#f59e0b',
    '--warning-dim':    '#451a03',
    '--danger':         '#ef4444',
    '--danger-dim':     '#450a0a',

    // ── Misc ──────────────────────────────────────
    '--shadow':         '0 4px 24px rgba(0,0,0,0.4)',
    '--shadow-card':    '0 2px 12px rgba(0,0,0,0.3)',
    '--radius':         '14px',

    // ── Sidebar (used by Sidebar.module.css) ──────
    '--sidebar-bg':                 '#161820',
    '--sidebar-border':             '#2e3145',
    '--sidebar-logo-bg':            '#052e16',
    '--sidebar-icon':               '#8b90a8',
    '--sidebar-hover-bg':           '#2a2d3a',
    '--sidebar-hover-color':        '#f0f2ff',
    '--sidebar-active-bg':          '#1e2d5e',
    '--sidebar-active-color':       '#4f7cff',
    '--sidebar-logout-hover-bg':    '#450a0a',
    '--sidebar-logout-hover-color': '#ef4444',
  },

  light: {
    // ── Backgrounds ───────────────────────────────
    '--bg-root':        '#f0f2f9',
    '--bg-surface':     '#ffffff',
    '--bg-card':        '#f8f9fd',
    '--bg-input':       '#ffffff',
    '--bg-hover':       '#eef0f8',
    '--bg-sidebar':     '#ffffff',

    // ── Borders ───────────────────────────────────
    '--border':         '#e2e5f0',
    '--border-strong':  '#c8cce0',

    // ── Text ──────────────────────────────────────
    '--text-primary':   '#1a1d2e',
    '--text-secondary': '#5a6080',
    '--text-muted':     '#9398b0',

    // ── Accent ────────────────────────────────────
    '--accent':         '#3b6bff',
    '--accent-dim':     '#dde6ff',
    '--accent-hover':   '#2855e0',

    // ── Status ────────────────────────────────────
    '--success':        '#16a34a',
    '--success-dim':    '#dcfce7',
    '--warning':        '#d97706',
    '--warning-dim':    '#fef3c7',
    '--danger':         '#dc2626',
    '--danger-dim':     '#fee2e2',

    // ── Misc ──────────────────────────────────────
    '--shadow':         '0 4px 24px rgba(100,110,160,0.10)',
    '--shadow-card':    '0 2px 12px rgba(100,110,160,0.08)',
    '--radius':         '14px',

    // ── Sidebar (used by Sidebar.module.css) ──────
    '--sidebar-bg':                 '#ffffff',
    '--sidebar-border':             '#e2e5f0',
    '--sidebar-logo-bg':            '#dcfce7',
    '--sidebar-icon':               '#5a6080',
    '--sidebar-hover-bg':           '#eef0f8',
    '--sidebar-hover-color':        '#1a1d2e',
    '--sidebar-active-bg':          '#dde6ff',
    '--sidebar-active-color':       '#3b6bff',
    '--sidebar-logout-hover-bg':    '#fee2e2',
    '--sidebar-logout-hover-color': '#dc2626',
  },
};
