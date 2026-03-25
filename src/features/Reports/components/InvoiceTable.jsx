// src/features/Reports/components/InvoiceTable.jsx
import React from 'react';
import { Eye, Printer } from 'lucide-react';

const statusMap = {
  COMPLETED : { label: 'مكتمل',   bg: '#064e3b', color: '#10b981', dot: '#10b981' },
  PENDING   : { label: 'معلق',    bg: '#1c1917', color: '#f59e0b', dot: '#f59e0b' },
  CANCELLED : { label: 'ملغي',    bg: '#450a0a', color: '#ef4444', dot: '#ef4444' },
};

const formatCurrencyLocal = (amount = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function InvoiceTable({ orders = [], loading = false, onRowClick }) {
  if (loading) {
    return (
      <div style={{ padding: '32px 0', textAlign: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            height: 52, background: '#1f2937', borderRadius: 10,
            marginBottom: 8, opacity: 1 - i * 0.15,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 0',
        color: '#6b7280', fontFamily: 'Cairo',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
        <div style={{ fontSize: 15 }}>لا توجد فواتير بعد</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px',
        fontFamily: 'Cairo',
      }}>
        {/* ── Head ── */}
        <thead>
          <tr>
            {['رقم الفاتورة', 'التاريخ', 'المنتجات', 'الحالة', 'الإجمالي', ''].map((h) => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'right',
                fontSize: 12, color: '#6b7280', fontWeight: 700,
                borderBottom: '1px solid #374151', whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {orders.map((order) => {
            const status  = statusMap[order.status] ?? statusMap.COMPLETED;
            const itemCount = Array.isArray(order.items) ? order.items.length : 0;

            return (
              <tr
                key={order.id ?? order.orderNumber}
                onClick={() => onRowClick?.(order)}
                style={{
                  cursor     : 'pointer',
                  transition : 'background .15s',
                  background : '#1f2937',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#263447';
                  // highlight the "عرض" button
                  const btn = e.currentTarget.querySelector('.view-btn');
                  if (btn) {
                    btn.style.background   = '#10b981';
                    btn.style.color        = '#fff';
                    btn.style.borderColor  = '#10b981';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#1f2937';
                  const btn = e.currentTarget.querySelector('.view-btn');
                  if (btn) {
                    btn.style.background   = 'transparent';
                    btn.style.color        = '#6b7280';
                    btn.style.borderColor  = '#374151';
                  }
                }}
              >
                {/* Order Number */}
                <td style={{ padding: '14px', borderRadius: '10px 0 0 10px' }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 13,
                    color: '#10b981', fontWeight: 700,
                    background: '#064e3b44', borderRadius: 6,
                    padding: '3px 8px',
                  }}>
                    {order.orderNumber ?? `#${order.id}`}
                  </span>
                </td>

                {/* Date */}
                <td style={{ padding: '14px', color: '#9ca3af', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {formatDate(order.createdAt)}
                </td>

                {/* Items count */}
                <td style={{ padding: '14px' }}>
                  <span style={{
                    background: '#1e3a5f', color: '#60a5fa',
                    borderRadius: 20, padding: '3px 10px',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    📦 {itemCount} {itemCount === 1 ? 'صنف' : 'أصناف'}
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: '14px' }}>
                  <span style={{
                    background: status.bg, color: status.color,
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, fontWeight: 700,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: status.dot, display: 'inline-block',
                    }} />
                    {status.label}
                  </span>
                </td>

                {/* Total */}
                <td style={{
                  padding: '14px', color: '#10b981',
                  fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap',
                }}>
                  {formatCurrencyLocal(order.total)}
                </td>

                {/* Action Button */}
                <td style={{ padding: '14px', borderRadius: '0 10px 10px 0', textAlign: 'center' }}>
                  <button
                    className="view-btn"
                    onClick={e => { e.stopPropagation(); onRowClick?.(order); }}
                    title="عرض وطباعة الفاتورة"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 8,
                      border: '1.5px solid #374151',
                      background: 'transparent', color: '#6b7280',
                      fontFamily: 'Cairo', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
                    }}
                  >
                    <Eye size={13} />
                    عرض
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}