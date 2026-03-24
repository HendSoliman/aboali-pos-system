// ─── SalesPage.jsx ───────────────────────────────────────────────────────────
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Receipt from '../components/Receipt/Receipt';
import { PRODUCTS } from '../../../data/products';
import { useTheme } from '../../../context/ThemeContext';

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

const formatWeight = (item) => {
  if (!item.isLoose) return null;
  const w = parseFloat(item.weightValue ?? item.quantity);
  const u = item.weightUnit ?? 'كجم';
  if (u === 'جرام') return `${w} جرام`;
  return w < 1 ? `${(w * 1000).toFixed(0)} جرام` : `${w} كجم`;
};

// ─── Loose Product Modal ──────────────────────────────────────────────────────
function LooseProductModal({ isOpen, product, onClose, onAddToCart, t }) {
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit,  setWeightUnit]  = useState('كجم');

  const weightInKg = useMemo(() => {
    const val = parseFloat(weightValue);
    if (isNaN(val) || val <= 0) return 0;
    return weightUnit === 'جرام' ? val / 1000 : val;
  }, [weightValue, weightUnit]);

  const totalPrice = useMemo(() =>
    product ? weightInKg * product.price : 0,
  [weightInKg, product]);

  const isValid = weightInKg > 0;

  const handleConfirm = useCallback(() => {
    if (!isValid || !product) return;
    onAddToCart({
      ...product,
      id         : `${product.id}_${Date.now()}`,
      quantity   : weightInKg,
      weightValue: parseFloat(weightValue),
      weightUnit,
      price      : product.price,
      totalPrice,
      isLoose    : true,
    });
    setWeightValue('');
    setWeightUnit('كجم');
  }, [isValid, product, weightInKg, weightValue, weightUnit, totalPrice, onAddToCart]);

  const handleClose = useCallback(() => {
    setWeightValue('');
    setWeightUnit('كجم');
    onClose();
  }, [onClose]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && isValid) handleConfirm();
    if (e.key === 'Escape') handleClose();
  }, [isValid, handleConfirm, handleClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, backdropFilter: 'blur(4px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.surface, borderRadius: 20, padding: 32, width: 380,
          border: `1px solid ${t.border}`,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{product.emoji}</div>
          <h2 style={{ fontFamily: 'Cairo', color: t.text, fontSize: 20, fontWeight: 800, margin: 0 }}>
            {product.name}
          </h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#f59e0b22', border: '1px solid #f59e0b55',
            borderRadius: 20, padding: '4px 12px', marginTop: 8
          }}>
            <span style={{ fontSize: 14 }}>⚖️</span>
            <span style={{ fontFamily: 'Cairo', fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>
              منتج بالوزن — {formatCurrency(product.price)} / كجم
            </span>
          </div>
        </div>

        {/* Unit Toggle */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: t.muted, display: 'block', marginBottom: 8 }}>
            وحدة الوزن
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['كجم', 'جرام'].map(unit => (
              <button
                key={unit}
                onClick={() => setWeightUnit(unit)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 12,
                  border: '2px solid',
                  borderColor: weightUnit === unit ? '#10b981' : t.border,
                  background : weightUnit === unit ? '#064e3b'  : t.main,
                  color      : weightUnit === unit ? '#10b981'  : t.muted,
                  fontFamily: 'Cairo', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', transition: 'all .15s'
                }}
              >
                {unit === 'كجم' ? '⚖️ كيلوجرام' : '🔬 جرام'}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: t.muted, display: 'block', marginBottom: 8 }}>
            أدخل الكمية ({weightUnit})
          </label>
          <div style={{ position: 'relative' }}>
            <input
              autoFocus
              type="number"
              min="0"
              step={weightUnit === 'جرام' ? '1' : '0.1'}
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={weightUnit === 'جرام' ? 'مثال: 500' : 'مثال: 1.5'}
              style={{
                width: '100%', padding: '14px 16px', background: t.main,
                border: `2px solid ${isValid ? '#10b981' : t.border}`,
                borderRadius: 12, color: t.text, fontFamily: 'Cairo',
                fontSize: 18, fontWeight: 700, boxSizing: 'border-box',
                textAlign: 'center', transition: 'border-color .2s', outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Cairo', color: t.muted, fontSize: 13
            }}>{weightUnit}</span>
          </div>
        </div>

        {/* Price Preview */}
        <div style={{
          background: t.main, borderRadius: 14, padding: 16, marginBottom: 20,
          border: `1px solid ${isValid ? '#10b981' : t.border}`, transition: 'border-color .2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Cairo', color: t.muted, fontSize: 13 }}>الكمية</span>
            <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 13, fontWeight: 600 }}>
              {weightValue
                ? (weightUnit === 'جرام'
                    ? `${weightValue} جرام (${(parseFloat(weightValue)/1000).toFixed(3)} كجم)`
                    : `${weightValue} كجم`)
                : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Cairo', color: t.muted, fontSize: 13 }}>سعر الكيلو</span>
            <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 13 }}>{formatCurrency(product.price)}</span>
          </div>
          <div style={{ height: 1, background: t.border, margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 16, fontWeight: 800 }}>الإجمالي</span>
            <span style={{ fontFamily: 'Cairo', color: '#10b981', fontSize: 18, fontWeight: 800 }}>
              {isValid ? formatCurrency(totalPrice) : formatCurrency(0)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleClose} style={{
            flex: 1, padding: '13px 0', background: t.border, border: 'none',
            borderRadius: 12, fontFamily: 'Cairo', fontSize: 15, fontWeight: 700,
            color: t.muted, cursor: 'pointer'
          }}>إلغاء</button>
          <button onClick={handleConfirm} disabled={!isValid} style={{
            flex: 2, padding: '13px 0',
            background: isValid ? '#10b981' : t.border,
            border: 'none', borderRadius: 12, fontFamily: 'Cairo',
            fontSize: 15, fontWeight: 800,
            color: isValid ? '#fff' : t.muted,
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all .2s'
          }}>
            ✓ إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, t }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: t.surface,
        border: `1.5px solid ${product.isLoose ? '#78350f' : '#1e3a5f'}`,
        borderRadius: 16, padding: 16, cursor: 'pointer', textAlign: 'right',
        transition: 'transform .15s, box-shadow .15s, border-color .15s',
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', gap: 6, width: '100%'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = product.isLoose
          ? '0 8px 24px rgba(245,158,11,0.15)'
          : '0 8px 24px rgba(16,185,129,0.12)';
        e.currentTarget.style.borderColor = product.isLoose ? '#f59e0b' : '#10b981';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = product.isLoose ? '#78350f' : '#1e3a5f';
      }}
    >
      <span style={{
        position: 'absolute', top: 8, left: 8,
        background: product.isLoose ? '#f59e0b' : '#3b82f6',
        color: product.isLoose ? '#000' : '#fff',
        fontSize: 9, fontWeight: 800, fontFamily: 'Cairo',
        padding: '2px 8px', borderRadius: 20, letterSpacing: 0.5
      }}>
        {product.isLoose ? 'بالوزن' : 'معبأ'}
      </span>
      <div style={{ fontSize: 34, marginTop: 4 }}>{product.emoji}</div>
      <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.4 }}>
        {product.name}
      </div>
      <div style={{ fontFamily: 'Cairo', fontSize: 12, color: product.isLoose ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
        {formatCurrency(product.price)}
        <span style={{ color: t.muted, fontWeight: 400, fontSize: 11 }}>
          {product.isLoose ? ' / كجم' : ' / قطعة'}
        </span>
      </div>
    </button>
  );
}

// ─── Cart Item ────────────────────────────────────────────────────────────────
function CartItem({ item, onUpdate, onRemove, t }) {
  const weightLabel = formatWeight(item);
  const lineTotal   = item.isLoose
    ? item.totalPrice ?? (item.price * item.quantity)
    : item.price * item.quantity;

  const btnStyle = {
    width: 28, height: 28, background: t.border, border: 'none',
    borderRadius: 7, color: t.text, cursor: 'pointer', fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div style={{
      background: t.main, borderRadius: 12, padding: '10px 12px', marginBottom: 8,
      border: `1px solid ${item.isLoose ? '#78350f' : t.border}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>
            <span style={{ marginLeft: 4 }}>{item.emoji}</span>
            {item.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {item.isLoose ? (
              <span style={{
                background: '#f59e0b22', border: '1px solid #f59e0b55',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#f59e0b', fontWeight: 700
              }}>⚖️ {weightLabel}</span>
            ) : (
              <span style={{
                background: '#3b82f622', border: '1px solid #3b82f655',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#60a5fa', fontWeight: 700
              }}>📦 معبأ × {item.quantity}</span>
            )}
            <span style={{ fontFamily: 'Cairo', fontSize: 12, color: '#10b981', fontWeight: 700 }}>
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!item.isLoose && (
            <>
              <button onClick={() => onUpdate(item.id, item.quantity - 1)} style={btnStyle}>−</button>
              <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button onClick={() => onUpdate(item.id, item.quantity + 1)} style={btnStyle}>+</button>
            </>
          )}
          <button
            onClick={() => onRemove(item.id)}
            style={{ ...btnStyle, background: '#7f1d1d', color: '#ef4444' }}
          >✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
function Sidebar({ t, activePage, onNavigate, isCollapsed, onToggle }) {
  const navItems = [
    { id: 'sales',     icon: '🛒', label: 'نقطة البيع'   },
    { id: 'inventory', icon: '📦', label: 'المخزون'      },
    { id: 'reports',   icon: '📊', label: 'التقارير'     },
    { id: 'customers', icon: '👥', label: 'العملاء'      },
    { id: 'settings',  icon: '⚙️', label: 'الإعدادات'   },
  ];

  return (
    <nav style={{
      width: isCollapsed ? 64 : 200,
      background: t.surface,
      borderLeft: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width .25s ease',
      overflow: 'hidden', flexShrink: 0,
      zIndex: 10
    }}>
      {/* Logo / Toggle */}
      <div style={{
        padding: '16px 12px',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: 8, minHeight: 64
      }}>
        {!isCollapsed && (
          <div style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 13, color: '#10b981', lineHeight: 1.3 }}>
            🌿 أبو علي
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            background: t.main, border: `1px solid ${t.border}`,
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
            color: t.muted, fontSize: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: isCollapsed ? '10px' : '10px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: isActive ? '#064e3b' : 'transparent',
                color     : isActive ? '#10b981' : t.muted,
                fontFamily: 'Cairo', fontSize: 13, fontWeight: isActive ? 700 : 500,
                transition: 'all .15s', textAlign: 'right',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap', overflow: 'hidden'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.border; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span style={{
                  marginRight: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: '#10b981', flexShrink: 0
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom — Theme Toggle */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${t.border}` }}>
        <button
          onClick={t.toggleTheme}
          title="تغيير المظهر"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: isCollapsed ? '10px' : '10px 12px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: t.muted,
            fontFamily: 'Cairo', fontSize: 13, fontWeight: 500,
            transition: 'all .15s', width: '100%',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = t.border; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>{t.isDark ? '☀️' : '🌙'}</span>
          {!isCollapsed && <span>{t.isDark ? 'الوضع النهاري' : 'الوضع الليلي'}</span>}
        </button>
      </div>
    </nav>
  );
}

// ─── Header Bar ───────────────────────────────────────────────────────────────
function HeaderBar({ t }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{
      height: 56, background: t.surface, borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0
    }}>
      {/* Left — store name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🌿</span>
        <div>
          <div style={{ fontFamily: 'Cairo', fontWeight: 900, fontSize: 14, color: t.text, lineHeight: 1.2 }}>
            علافة وعطارة الحاج أبو علي
          </div>
          <div style={{ fontFamily: 'Cairo', fontSize: 11, color: t.muted }}>نقطة البيع</div>
        </div>
      </div>

      {/* Center — date & time */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cairo', fontWeight: 700, fontSize: 15, color: t.text }}>{timeStr}</div>
        <div style={{ fontFamily: 'Cairo', fontSize: 11, color: t.muted }}>{dateStr}</div>
      </div>

      {/* Right — cashier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: t.text }}>الحاج أبوعلي</div>
          <div style={{ fontFamily: 'Cairo', fontSize: 11, color: '#10b981' }}>كاشير ✓</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#064e3b', border: '2px solid #10b981',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18
        }}>👨‍💼</div>
      </div>
    </div>
  );
}

// ─── SalesPage ────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // ── Theme token map ───────────────────────────────────────────────────────
  const t = useMemo(() => ({
    main        : isDark ? '#111827' : '#f9fafb',
    surface     : isDark ? '#1f2937' : '#ffffff',
    border      : isDark ? '#374151' : '#e5e7eb',
    text        : isDark ? '#f3f4f6' : '#111827',
    muted       : isDark ? '#9ca3af' : '#6b7280',
    isDark,
    toggleTheme,
  }), [isDark, toggleTheme]);

  const [cart,           setCart]           = useState([]);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [looseProduct,   setLooseProduct]   = useState(null);
  const [showReceipt,    setShowReceipt]    = useState(false);
  const [receiptData,    setReceiptData]    = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage,     setActivePage]     = useState('sales');

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    if (product.isLoose) {
      setLooseProduct(product);
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id && !i.isLoose);
      if (ex) return prev.map(i =>
        i.id === product.id && !i.isLoose ? { ...i, quantity: i.quantity + 1 } : i
      );
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleLooseAdd = useCallback((item) => {
    setCart(prev => [...prev, item]);
    setLooseProduct(null);
  }, []);

  const removeFromCart = useCallback((id) =>
    setCart(prev => prev.filter(i => i.id !== id)), []);

  const updateQty = useCallback((id, qty) =>
    setCart(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    )), []);

  const cartSubtotal = useMemo(() =>
    cart.reduce((sum, i) =>
      sum + (i.isLoose
        ? (i.totalPrice ?? i.price * i.quantity)
        : i.price * i.quantity), 0),
  [cart]);

  const discountAmount = 0;
  const cartTotal      = cartSubtotal - discountAmount;

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const orderData = {
      invoiceNumber : `INV-${Date.now().toString(36).toUpperCase()}`.slice(-10),
      date          : new Date(),
      cashierName   : 'الحاج أبوعلي',
      storeName     : 'علافة وعطارة الحاج أبو علي',
      paymentMethod : 'نقدي',
      amountPaid    : cartTotal,
      change        : 0,
      items: cart.filter(Boolean).map((item, idx) => ({
        id         : item.id       ?? idx,
        name       : item.name     ?? `صنف ${idx + 1}`,
        emoji      : item.emoji    ?? '📦',
        price      : parseFloat(item.price    ?? 0),
        quantity   : parseFloat(item.quantity ?? 1),
        isLoose    : item.isLoose  ?? false,
        weightValue: item.weightValue ?? null,
        weightUnit : item.weightUnit  ?? null,
        totalPrice : item.isLoose
          ? (item.totalPrice ?? item.price * item.quantity)
          : item.price * item.quantity,
        weightLabel: item.isLoose ? formatWeight(item) : null,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      total   : cartTotal,
    };
    setReceiptData(orderData);
    setCart([]);
    setShowReceipt(true);
  }, [cart, cartSubtotal, discountAmount, cartTotal]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() =>
    PRODUCTS.filter(p => {
      const matchCat   = activeCategory === 'الكل' || p.category === activeCategory;
      const matchQuery = p.name.includes(searchQuery);
      return matchCat && matchQuery;
    }),
  [activeCategory, searchQuery]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: t.main, overflow: 'hidden'
    }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <HeaderBar t={t} />

      {/* ── Body Row ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <Sidebar
          t={t}
          activePage={activePage}
          onNavigate={setActivePage}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(v => !v)}
        />

        {/* ── Cart Panel ──────────────────────────────────────────── */}
        <aside style={{
          width: 340, background: t.surface,
          borderLeft: `1px solid ${t.border}`,
          display: 'flex', flexDirection: 'column', flexShrink: 0
        }}>
          {/* Cart Header */}
          <div style={{
            padding: '14px 16px', fontFamily: 'Cairo', fontSize: 16,
            fontWeight: 800, color: t.text,
            borderBottom: `1px solid ${t.border}`,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            🛒 سلة المشتريات
            {cart.length > 0 && (
              <span style={{
                background: '#10b981', color: '#fff', borderRadius: 20,
                fontSize: 11, fontWeight: 800, padding: '1px 8px', fontFamily: 'Cairo'
              }}>{cart.length}</span>
            )}
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                style={{
                  marginRight: 'auto', background: '#7f1d1d', border: 'none',
                  borderRadius: 8, padding: '3px 10px', cursor: 'pointer',
                  fontFamily: 'Cairo', fontSize: 11, color: '#ef4444', fontWeight: 700
                }}
              >مسح الكل</button>
            )}
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: t.muted, fontFamily: 'Cairo', marginTop: 60 }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
                <div style={{ fontSize: 13 }}>السلة فارغة</div>
                <div style={{ fontSize: 11, marginTop: 4, color: t.muted, opacity: 0.6 }}>
                  انقر على منتج لإضافته
                </div>
              </div>
            ) : (
              cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={updateQty}
                  onRemove={removeFromCart}
                  t={t}
                />
              ))
            )}
          </div>

          {/* Totals & Checkout */}
          <div style={{ padding: 14, borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Cairo', color: t.muted, marginBottom: 8, fontSize: 13 }}>
              <span>المجموع الفرعي</span>
              <span>{formatCurrency(cartSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Cairo', color: '#f59e0b', marginBottom: 8, fontSize: 13 }}>
                <span>الخصم</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div style={{ height: 1, background: t.border, margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Cairo', color: t.text, fontSize: 16, fontWeight: 800, marginBottom: 14 }}>
              <span>الإجمالي</span>
              <span style={{ color: '#10b981' }}>{formatCurrency(cartTotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              style={{
                width: '100%', padding: '13px', border: 'none', borderRadius: 14,
                background: cart.length ? '#10b981' : t.border,
                fontFamily: 'Cairo', fontSize: 15, fontWeight: 800,
                color: cart.length ? '#fff' : t.muted,
                cursor: cart.length ? 'pointer' : 'not-allowed',
                transition: 'all .2s'
              }}
            >إتمام الشراء ←</button>
          </div>
        </aside>

        {/* ── Products Panel ───────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

          {/* Type Legend */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {[
              { color: '#f59e0b', bg: '#f59e0b22', border: '#f59e0b55', label: '⚖️ منتجات بالوزن' },
              { color: '#3b82f6', bg: '#3b82f622', border: '#3b82f655', label: '📦 منتجات معبأة'  },
            ].map(({ color, bg, border, label }) => (
              <div key={label} style={{
                background: bg, border: `1px solid ${border}`,
                borderRadius: 20, padding: '4px 12px',
                fontFamily: 'Cairo', fontSize: 12, color, fontWeight: 700
              }}>{label}</div>
            ))}
          </div>

          {/* Search */}
          <input
            placeholder="🔍 ابحث عن منتج..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', background: t.surface,
              border: `1.5px solid ${t.border}`, borderRadius: 12, color: t.text,
              fontFamily: 'Cairo', fontSize: 14, marginBottom: 14,
              boxSizing: 'border-box', outline: 'none', transition: 'border-color .2s'
            }}
            onFocus={e => e.target.style.borderColor = '#10b981'}
            onBlur={e  => e.target.style.borderColor = t.border}
          />

{/*            */}{/* Category Tabs */}
{/*           <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}> */}
{/*             {CATEGORIES.map(cat => ( */}
{/*               <button */}
{/*                 key={cat} */}
{/*                 onClick={() => setActiveCategory(cat)} */}
{/*                 style={{ */}
{/*                   padding: '5px 14px', borderRadius: 20, border: '1.5px solid', */}
{/*                   borderColor: activeCategory === cat ? '#10b981' : t.border, */}
{/*                   background : activeCategory === cat ? '#064e3b'  : t.surface, */}
{/*                   color      : activeCategory === cat ? '#10b981'  : t.muted, */}
{/*                   fontFamily: 'Cairo', fontSize: 12, fontWeight: 600, */}
{/*                   cursor: 'pointer', transition: 'all .15s' */}
{/*                 }} */}
{/*               >{cat}</button> */}
{/*             ))} */}
{/*           </div> */}

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 10
          }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => addToCart(product)}
                t={t}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', color: t.muted, fontFamily: 'Cairo', marginTop: 60 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 14 }}>لا توجد منتجات مطابقة</div>
            </div>
          )}
        </main>
      </div>

      {/* ── Loose Modal ──────────────────────────────────────────── */}
      <LooseProductModal
        isOpen={!!looseProduct}
        product={looseProduct}
        onClose={() => setLooseProduct(null)}
        onAddToCart={handleLooseAdd}
        t={t}
      />

      {/* ── Receipt ──────────────────────────────────────────────── */}
      {showReceipt && receiptData && (
        <Receipt
          isOpen={showReceipt}
          orderData={receiptData}
          onClose={() => { setShowReceipt(false); setReceiptData(null); }}
        />
      )}
    </div>
  );
}