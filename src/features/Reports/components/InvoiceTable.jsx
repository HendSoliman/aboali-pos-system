// src/features/Reports/components/InvoiceTable.jsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const formatCurrency = (n = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(n);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const STATUS_MAP = {
  COMPLETED : { label: 'مكتمل',   bg: '#064e3b', color: '#10b981' },
  PENDING   : { label: 'معلق',    bg: '#1e3a5f', color: '#3b82f6' },
  CANCELLED : { label: 'ملغي',    bg: '#7f1d1d', color: '#ef4444' },
};

export default function InvoiceTable({ orders = [] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const t = {
    surface : isDark ? '#1f2937' : '#ffffff',
    surface2: isDark ? '#111827' : '#f9fafb',
    border  : isDark ? '#374151' : '#e5e7eb',
    text    : isDark ? '#f3f4f6' : '#111827',
    subtext : isDark ? '#9ca3af' : '#6b7280',
  };

  if (!orders.length) {
    return (
      <div style={{
        padding: 40, textAlign: 'center',
        fontFamily: 'Cairo', color: t.subtext, fontSize: 14
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🧾</div>
        لا توجد فواتير في هذه الفترة
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Cairo' }}>
        <thead>
          <tr style={{ background: t.surface2, borderBottom: `2px solid ${t.border}` }}>
            {['رقم الفاتورة', 'التاريخ', 'طريقة الدفع', 'الإجمالي', 'الحالة'].map(h => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'right',
                color: t.subtext, fontSize: 12, fontWeight: 700, fontFamily: 'Cairo'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => {
            const statusInfo = STATUS_MAP[order.status] ?? { label: order.status, bg: '#374151', color: '#9ca3af' };
            return (
              <tr
                key={order.id ?? i}
                style={{
                  borderBottom: `1px solid ${t.border}`,
                  transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = t.surface2}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Invoice Number */}
                <td style={{ padding: '12px 16px', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
                  {order.orderNumber ?? `#${order.id}`}
                </td>

                {/* Date */}
                <td style={{ padding: '12px 16px', color: t.subtext, fontSize: 12 }}>
                  {formatDate(order.createdAt)}
                </td>

                {/* Payment Method */}
                <td style={{ padding: '12px 16px', color: t.text, fontSize: 13 }}>
                  {order.paymentMethod === 'CASH' ? '💵 نقدي' : order.paymentMethod ?? '—'}
                </td>

                {/* Total */}
                <td style={{ padding: '12px 16px', color: t.text, fontSize: 14, fontWeight: 800 }}>
                  {formatCurrency(order.total ?? 0)}
                </td>

                {/* Status Badge */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: statusInfo.bg, color: statusInfo.color,
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: 11, fontWeight: 700, fontFamily: 'Cairo'
                  }}>
                    {statusInfo.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}