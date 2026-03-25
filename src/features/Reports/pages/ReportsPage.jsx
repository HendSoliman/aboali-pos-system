// src/features/Reports/pages/ReportsPage.jsx
import React, { useState, useCallback } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign, RefreshCw } from 'lucide-react';
import SalesChart    from '../components/SalesChart';
import InvoiceTable  from '../components/InvoiceTable';
import useReports    from '../hooks/useReports';
import Receipt       from '../../Sales/components/Receipt/Receipt';
import { formatCurrency } from '../../../utils/formatters';
import './ReportsPage.css';

// ─── Stat card config ─────────────────────────────────────────────────────────
const STAT_CARDS = (stats) => [
  { title: 'إجمالي المبيعات',  value: formatCurrency(stats.totalSales),    icon: DollarSign,  color: 'green'  },
  { title: 'عدد الطلبات',      value: stats.totalOrders,                   icon: ShoppingBag, color: 'blue'   },
  { title: 'متوسط قيمة الطلب', value: formatCurrency(stats.avgOrderValue), icon: TrendingUp,  color: 'yellow' },
  { title: 'أكثر منتج مبيعاً', value: stats.topProduct,                   icon: Users,       color: 'red'    },
];

// ─── Transform a raw API order → the shape Receipt expects ───────────────────
const transformOrderToReceipt = (order) => ({
  invoiceNumber : order.orderNumber ?? `#${order.id}`,
  date          : order.createdAt   ? new Date(order.createdAt) : new Date(),
  cashierName   : 'الحاج أبوعلي',
  storeName     : 'علافة وعطارة الحاج أبو علي',
  paymentMethod : order.paymentMethod === 'CASH' ? 'نقدي' : (order.paymentMethod ?? 'نقدي'),
  amountPaid    : order.total ?? 0,
  change        : 0,
  notes         : order.notes ?? '',

  // Map API items → Receipt item shape
  items: (order.items ?? []).map((item, idx) => ({
    id         : item.productId ?? idx,
    name       : item.name      ?? `صنف ${idx + 1}`,
    emoji      : item.emoji     ?? '📦',
    price      : parseFloat(item.price    ?? 0),
    quantity   : parseFloat(item.quantity ?? 1),
    isLoose    : false,           // stored orders are already resolved
    weightValue: null,
    weightUnit : null,
    totalPrice : parseFloat(item.subtotal ?? item.price * item.quantity),
    weightLabel: null,
  })),

  subtotal: order.subtotal ?? order.total ?? 0,
  discount: order.discount ?? 0,
  tax     : order.tax      ?? 0,
  total   : order.total    ?? 0,
});

// ─── ReportsPage ──────────────────────────────────────────────────────────────
const ReportsPage = () => {
  const {
    stats, orders, loading, error,
    dateFrom, dateTo, setDateFrom, setDateTo, refresh,
  } = useReports();

  // ── Receipt state ─────────────────────────────────────────────────────────
  const [receiptData,  setReceiptData]  = useState(null);
  const [showReceipt,  setShowReceipt]  = useState(false);

  const handleRowClick = useCallback((order) => {
    const transformed = transformOrderToReceipt(order);
    setReceiptData(transformed);
    setShowReceipt(true);
  }, []);

  const handleCloseReceipt = useCallback(() => {
    setShowReceipt(false);
    setReceiptData(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="reports-page" dir="rtl">

      {/* ── Title Row ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="reports-title" style={{ margin: 0 }}>التقارير والإحصائيات</h1>

        {/* Date Range + Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: '#9ca3af' }}>من</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={inputStyle}
          />
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: '#9ca3af' }}>إلى</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: '#10b981', color: '#fff', fontFamily: 'Cairo',
              fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, transition: 'opacity .2s',
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            تحديث
          </button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────── */}
      {error && (
        <div style={{
          background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 10,
          padding: '12px 16px', marginBottom: 20, fontFamily: 'Cairo',
          color: '#ef4444', fontSize: 14, display: 'flex', justifyContent: 'space-between',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={refresh} style={{
            background: 'none', border: 'none', color: '#ef4444',
            fontFamily: 'Cairo', cursor: 'pointer', fontSize: 13,
          }}>إعادة المحاولة</button>
        </div>
      )}

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="stats-grid">
        {STAT_CARDS(stats).map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="stat-card">
            <div className={`stat-icon ${color}`}><Icon size={20} /></div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">
              {loading ? <span style={skeletonStyle} /> : value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart ──────────────────────────────────────────────── */}
      <div className="chart-wrapper">
        <div className="chart-title">مبيعات الفترة المختارة</div>
        <SalesChart data={stats.dailySales} loading={loading} />
      </div>

      {/* ── Invoice Table ───────────────────────────────────────── */}
      <div className="invoice-wrapper">
        <div className="invoice-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>🧾 آخر الفواتير</span>
          <span style={{
            fontFamily: 'Cairo', fontSize: 12, color: '#6b7280', fontWeight: 400,
          }}>
            اضغط على أي فاتورة لعرضها وطباعتها
          </span>
        </div>

        <InvoiceTable
          orders={orders}
          loading={loading}
          onRowClick={handleRowClick}
        />
      </div>

      {/* ── Receipt Modal ───────────────────────────────────────── */}
      {showReceipt && receiptData && (
        <Receipt
          isOpen={showReceipt}
          orderData={receiptData}
          onClose={handleCloseReceipt}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ─── Shared micro-styles ─────────────────────────────────────────────────────
const inputStyle = {
  padding: '7px 10px', borderRadius: 8,
  border: '1.5px solid #374151',
  background: '#1f2937', color: '#f3f4f6',
  fontFamily: 'Cairo', fontSize: 13, outline: 'none',
};

const skeletonStyle = {
  display: 'inline-block', width: 80, height: 18,
  background: 'linear-gradient(90deg,#374151 25%,#4b5563 50%,#374151 75%)',
  backgroundSize: '200% 100%',
  borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite',
};

export default ReportsPage;