// src/features/Reports/components/SalesChart.jsx
import React, { useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const formatCurrency = (n = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(n);

const formatDay = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function SalesChart({ dailySales = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const t = {
    surface : isDark ? '#1f2937' : '#ffffff',
    border  : isDark ? '#374151' : '#e5e7eb',
    text    : isDark ? '#f3f4f6' : '#111827',
    subtext : isDark ? '#9ca3af' : '#6b7280',
    grid    : isDark ? '#ffffff0a' : '#00000008',
  };

  const maxValue = useMemo(
    () => Math.max(...dailySales.map(d => d.total ?? 0), 1),
    [dailySales]
  );

  // Empty state
  if (!dailySales.length) {
    return (
      <div style={{
        height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Cairo', color: t.subtext, fontSize: 14, flexDirection: 'column', gap: 8
      }}>
        <span style={{ fontSize: 36 }}>📊</span>
        <span>لا توجد بيانات مبيعات في هذه الفترة</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, padding: '0 4px' }}>
        {dailySales.map((day, i) => {
          const pct = maxValue > 0 ? (day.total / maxValue) * 100 : 0;
          return (
            <div
              key={day.date ?? i}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              {/* Tooltip on hover */}
              <div className="chart-bar-wrap" style={{ width: '100%', position: 'relative', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <div
                  title={`${formatDay(day.date)}: ${formatCurrency(day.total)}`}
                  style={{
                    width: '100%',
                    height: `${Math.max(pct, 4)}%`,
                    background: pct > 60
                      ? 'linear-gradient(180deg, #10b981, #059669)'
                      : pct > 30
                        ? 'linear-gradient(180deg, #3b82f6, #2563eb)'
                        : 'linear-gradient(180deg, #6b7280, #4b5563)',
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height 0.4s ease',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'brightness(1.2)';
                    e.currentTarget.style.transform = 'scaleX(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}
                />
              </div>
              {/* Day label */}
              <span style={{
                fontFamily: 'Cairo', fontSize: 10, color: t.subtext,
                textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis', maxWidth: '100%'
              }}>
                {new Date(day.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Y-axis hint */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${t.border}`
      }}>
        <span style={{ fontFamily: 'Cairo', fontSize: 11, color: t.subtext }}>0</span>
        <span style={{ fontFamily: 'Cairo', fontSize: 11, color: t.subtext }}>
          الحد الأقصى: {formatCurrency(maxValue)}
        </span>
      </div>
    </div>
  );
}