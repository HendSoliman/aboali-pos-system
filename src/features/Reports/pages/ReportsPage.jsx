// src/features/Reports/pages/ReportsPage.jsx
import React, { useMemo } from 'react';
import { TrendingUp, ShoppingBag, Package, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import SalesChart    from '../components/SalesChart';
import InvoiceTable  from '../components/InvoiceTable';
import useReports    from '../hooks/useReports';
import { useTheme }  from '../../../context/ThemeContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (n = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(n);

const makeTokens = (theme) => ({
  main    : theme === 'dark' ? '#111827' : '#f3f4f6',
  surface : theme === 'dark' ? '#1f2937' : '#ffffff',
  surface2: theme === 'dark' ? '#111827' : '#f9fafb',
  border  : theme === 'dark' ? '#374151' : '#e5e7eb',
  text    : theme === 'dark' ? '#f3f4f6' : '#111827',
  subtext : theme === 'dark' ? '#9ca3af' : '#6b7280',
  input   : theme === 'dark' ? '#111827' : '#f9fafb',
});

// ─── Stat Card ────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  green : { icon: '#10b981', bg: '#064e3b', ring: '#10b98133' },
  blue  : { icon: '#3b82f6', bg: '#1e3a5f', ring: '#3b82f633' },
  yellow: { icon: '#f59e0b', bg: '#78350f', ring: '#f59e0b33' },
  red   : { icon: '#f87171', bg: '#7f1d1d', ring: '#f8717133' },
};

function StatCard({ title, value, icon: Icon, color, loading, t }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: '20px 24px',
      border: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transition: 'transform .15s, box-shadow .15s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${c.ring}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      {/* Icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color={c.icon} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cairo', fontSize: 12, color: t.subtext, marginBottom: 4 }}>
          {title}
        </div>
        {loading ? (
          <div style={{
            height: 24, width: '60%', borderRadius: 6,
            background: t.border, animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        ) : (
          <div style={{
            fontFamily: 'Cairo', fontSize: 20, fontWeight: 800,
            color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Date Input ───────────────────────────────────────────────────────────────
function DateInput({ label, value, onChange, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontFamily: 'Cairo', fontSize: 12, color: t.subtext }}>{label}</label>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '8px 12px', background: t.input,
          border: `1.5px solid ${t.border}`, borderRadius: 10,
          color: t.text, fontFamily: 'Cairo', fontSize: 13,
          outline: 'none', cursor: 'pointer',
        }}
      />
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry, t }) {
  return (
    <div style={{
      background: '#7f1d1d', border: '1px solid #ef444455',
      borderRadius: 12, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
    }}>
      <AlertCircle size={18} color="#ef4444" />
      <span style={{ fontFamily: 'Cairo', color: '#fca5a5', fontSize: 14, flex: 1 }}>
        {message}
      </span>
      <button onClick={onRetry} style={{
        background: '#ef4444', color: '#fff', border: 'none',
        borderRadius: 8, padding: '6px 14px',
        fontFamily: 'Cairo', fontSize: 13, cursor: 'pointer',
      }}>
        إعادة المحاولة
      </button>
    </div>
  );
}

// ─── Quick Range Buttons ──────────────────────────────────────────────────────
const RANGES = [
  { label: 'اليوم',       days: 0  },
  { label: 'آخر 7 أيام',  days: 7  },
  { label: 'آخر 30 يوم',  days: 30 },
  { label: 'آخر 90 يوم',  days: 90 },
];

const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const todayISO = () => new Date().toISOString().slice(0, 10);

// ─── ReportsPage ──────────────────────────────────────────────────────────────
const ReportsPage = () => {
  const { theme } = useTheme();
  const t = useMemo(() => makeTokens(theme), [theme]);

  const {
    stats, orders, loading, error,
    dateFrom, dateTo, setDateFrom, setDateTo,
    refresh,
  } = useReports();

  // Build stat cards with live data
  const STAT_CARDS = [
    { title: 'إجمالي المبيعات',  value: formatCurrency(stats.totalSales),    icon: DollarSign, color: 'green'  },
    { title: 'عدد الطلبات',      value: stats.totalOrders,                    icon: ShoppingBag,color: 'blue'   },
    { title: 'متوسط قيمة الطلب', value: formatCurrency(stats.avgOrderValue), icon: TrendingUp, color: 'yellow' },
    { title: 'أكثر منتج مبيعاً', value: stats.topProduct,                    icon: Package,    color: 'red'    },
  ];

  return (
    <div dir="rtl" style={{ background: t.main, minHeight: '100vh', padding: 24, boxSizing: 'border-box' }}>

      {/* ── Keyframes (injected once) ───────────────────────────────────────── */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Cairo', fontSize: 24, fontWeight: 800, color: t.text, margin: 0 }}>
            📊 التقارير والإحصائيات
          </h1>
          <p style={{ fontFamily: 'Cairo', fontSize: 13, color: t.subtext, margin: '4px 0 0' }}>
            تحليل المبيعات والأداء العام للمتجر
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', background: t.surface,
            border: `1.5px solid ${t.border}`, borderRadius: 12,
            fontFamily: 'Cairo', fontSize: 13, color: t.text,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          }}
        >
          <RefreshCw
            size={15}
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
          />
          تحديث
        </button>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────────── */}
      {error && <ErrorBanner message={error} onRetry={refresh} t={t} />}

      {/* ── Date Range Controls ──────────────────────────────────────────────── */}
      <div style={{
        background: t.surface, borderRadius: 16, padding: '16px 20px',
        border: `1px solid ${t.border}`, marginBottom: 24,
        display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap',
      }}>
        {/* Quick range buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'Cairo', fontSize: 12, color: t.subtext }}>اختيار سريع</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {RANGES.map(({ label, days }) => {
              const from = days === 0 ? todayISO() : daysAgoISO(days);
              const to   = todayISO();
              const isActive = dateFrom === from && dateTo === to;
              return (
                <button
                  key={label}
                  onClick={() => { setDateFrom(from); setDateTo(to); }}
                  style={{
                    padding: '7px 14px', borderRadius: 10, border: '1.5px solid',
                    borderColor : isActive ? '#10b981' : t.border,
                    background  : isActive ? '#064e3b'  : t.input,
                    color       : isActive ? '#10b981'  : t.subtext,
                    fontFamily: 'Cairo', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 40, background: t.border, flexShrink: 0 }} />

        {/* Custom date inputs */}
        <DateInput label="من تاريخ"   value={dateFrom} onChange={setDateFrom} t={t} />
        <DateInput label="إلى تاريخ"  value={dateTo}   onChange={setDateTo}   t={t} />

        {/* Active range label */}
        <div style={{
          marginRight: 'auto', fontFamily: 'Cairo', fontSize: 12, color: t.subtext,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 2,
        }}>
          <span>الفترة المحددة</span>
          <span style={{ color: t.text, fontWeight: 700, fontSize: 13 }}>
            {dateFrom} → {dateTo}
          </span>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {STAT_CARDS.map(({ title, value, icon, color }) => (
          <StatCard
            key={title}
            title={title}
            value={value}
            icon={icon}
            color={color}
            loading={loading}
            t={t}
          />
        ))}
      </div>

      {/* ── Chart + Table Row ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Sales Chart */}
        <div style={{
          background: t.surface, borderRadius: 16, padding: 24,
          border: `1px solid ${t.border}`,
        }}>
          <div style={{
            fontFamily: 'Cairo', fontSize: 16, fontWeight: 800,
            color: t.text, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            📈 مبيعات الفترة المختارة
          </div>
          {loading ? (
            <div style={{
              height: 200, background: t.surface2, borderRadius: 10,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ) : (
            <SalesChart dailySales={stats.dailySales} />
          )}
        </div>

        {/* Mini summary card */}
        <div style={{
          background: t.surface, borderRadius: 16, padding: 24,
          border: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: 800, color: t.text }}>
            📋 ملخص الفترة
          </div>

          {[
            { label: 'إجمالي الإيرادات', value: formatCurrency(stats.totalSales),     color: '#10b981' },
            { label: 'عدد الطلبات',      value: `${stats.totalOrders} طلب`,           color: '#3b82f6' },
            { label: 'متوسط الطلب',      value: formatCurrency(stats.avgOrderValue),  color: '#f59e0b' },
            { label: 'أكثر المنتجات',    value: stats.topProduct,                     color: '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', background: t.surface2, borderRadius: 10,
            }}>
              <span style={{ fontFamily: 'Cairo', fontSize: 13, color: t.subtext }}>{label}</span>
              {loading ? (
                <div style={{
                  height: 16, width: 80, borderRadius: 4,
                  background: t.border, animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              ) : (
                <span style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 800, color }}>
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Invoice Table ────────────────────────────────────────────────────── */}
      <div style={{
        background: t.surface, borderRadius: 16,
        border: `1px solid ${t.border}`, overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px', borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: 800, color: t.text }}>
            🧾 آخر الفواتير
          </div>
          <div style={{ fontFamily: 'Cairo', fontSize: 12, color: t.subtext }}>
            يعرض آخر 10 طلبات
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                height: 44, borderRadius: 8, background: t.surface2,
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : (
          <InvoiceTable orders={orders} />
        )}
      </div>

    </div>
  );
};

export default ReportsPage;