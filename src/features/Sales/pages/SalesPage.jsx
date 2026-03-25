// ─── SalesPage.jsx ───────────────────────────────────────────────────────────
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Receipt    from '../components/Receipt/Receipt';
import SettingsPage from '../../Settings/pages/SettingsPage';
import { useTheme }           from '../../../context/ThemeContext';
import { productsApi, ordersApi } from '../../../services/api';
import useSettings            from '../../Settings/hooks/useSettings';
import { Settings as SettingsIcon, X as CloseIcon } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getDisplayName = (p) => p?.nameAr ?? p?.name_ar ?? p?.name ?? '';

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

const formatWeight = (item) => {
  if (!item.isLoose) return null;
  const w = parseFloat(item.weightValue ?? item.quantity);
  const u = item.weightUnit ?? 'كجم';
  if (u === 'جرام') return `${w} جرام`;
  return w < 1 ? `${(w * 1000).toFixed(0)} جرام` : `${w} كجم`;
};

// ─── Theme token map ──────────────────────────────────────────────────────────
const makeTokens = (theme) => ({
  main    : theme === 'dark' ? '#111827' : '#f9fafb',
  surface : theme === 'dark' ? '#1f2937' : '#ffffff',
  surface2: theme === 'dark' ? '#111827' : '#f3f4f6',
  border  : theme === 'dark' ? '#374151' : '#e5e7eb',
  text    : theme === 'dark' ? '#f3f4f6' : '#111827',
  subtext : theme === 'dark' ? '#9ca3af' : '#6b7280',
  input   : theme === 'dark' ? '#111827' : '#f9fafb',
});

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard({ t }) {
  return (
    <div style={{
      background: t.surface, border: `1.5px solid ${t.border}`,
      borderRadius: 16, padding: 16, display: 'flex',
      flexDirection: 'column', gap: 10, overflow: 'hidden',
    }}>
      {[40, '80%', '50%'].map((w, i) => (
        <div key={i} style={{
          width: typeof w === 'number' ? w : w,
          height: i === 0 ? 40 : i === 1 ? 12 : 10,
          borderRadius: i === 0 ? 10 : 6,
          background: t.border,
          animation: `skeleton-pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry, t }) {
  return (
    <div style={{
      background: '#7f1d1d33', border: '1px solid #ef444466',
      borderRadius: 12, padding: '12px 16px', marginBottom: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    }}>
      <span style={{ fontFamily: 'Cairo', fontSize: 13, color: '#ef4444' }}>⚠️ {message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          background: '#ef4444', border: 'none', borderRadius: 8,
          padding: '5px 12px', fontFamily: 'Cairo', fontSize: 12,
          fontWeight: 700, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>إعادة المحاولة</button>
      )}
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type = 'success', visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0, transition: 'all 0.3s ease',
      background: type === 'success' ? '#064e3b' : '#7f1d1d',
      border: `1px solid ${type === 'success' ? '#10b981' : '#ef4444'}`,
      borderRadius: 14, padding: '12px 24px',
      fontFamily: 'Cairo', fontSize: 14, fontWeight: 700,
      color: type === 'success' ? '#10b981' : '#ef4444',
      zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      pointerEvents: 'none',
    }}>
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
}

// ─── Settings Drawer ──────────────────────────────────────────────────────────
function SettingsDrawer({ open, onClose, t }) {
  // Trap Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .25s ease',
        }}
      />

      {/* Drawer panel — slides in from the left (RTL: the "far" side) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 520, zIndex: 1200,
        background: t.surface,
        borderRight: `1px solid ${t.border}`,
        boxShadow: '8px 0 40px rgba(0,0,0,0.4)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SettingsIcon size={20} style={{ color: '#10b981' }} />
            <span style={{
              fontFamily: 'Cairo', fontSize: 18, fontWeight: 800, color: t.text,
            }}>الإعدادات</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: t.surface2, border: `1px solid ${t.border}`,
              borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.subtext, transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ef444422'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.surface2;  e.currentTarget.style.color = t.subtext; }}
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Scrollable settings content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <SettingsPage />
        </div>
      </div>
    </>
  );
}

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
    const arabicName = getDisplayName(product);
    onAddToCart({
      ...product,
      id         : product.id, // Keep this as the original numeric ID
      cartKey    : `${product.id}_${Date.now()}`,
      name       : arabicName,
      nameAr     : arabicName,
      quantity   : weightInKg, // This is already (weight / 1000) for grams
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
    <div onClick={handleClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1050, backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.surface, borderRadius: 20, padding: 32, width: 380,
        border: `1px solid ${t.border}`, boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{product.emoji ?? '📦'}</div>
          <h2 style={{ fontFamily: 'Cairo', color: t.text, fontSize: 20, fontWeight: 800, margin: 0 }}>
            {getDisplayName(product)}
          </h2>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#f59e0b22', border: '1px solid #f59e0b55',
            borderRadius: 20, padding: '4px 12px', marginTop: 8,
          }}>
            <span style={{ fontSize: 14 }}>⚖️</span>
            <span style={{ fontFamily: 'Cairo', fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>
              منتج بالوزن — {formatCurrency(product.price)} / كجم
            </span>
          </div>
        </div>

        {/* Unit Toggle */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: t.subtext, display: 'block', marginBottom: 8 }}>
            وحدة الوزن
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['كجم', 'جرام'].map(unit => (
              <button key={unit} onClick={() => setWeightUnit(unit)} style={{
                flex: 1, padding: '10px 0', borderRadius: 12, border: '2px solid',
                borderColor : weightUnit === unit ? '#10b981' : t.border,
                background  : weightUnit === unit ? '#064e3b'  : t.input,
                color       : weightUnit === unit ? '#10b981'  : t.subtext,
                fontFamily: 'Cairo', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all .15s',
              }}>
                {unit === 'كجم' ? '⚖️ كيلوجرام' : '🔬 جرام'}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: t.subtext, display: 'block', marginBottom: 8 }}>
            أدخل الكمية ({weightUnit})
          </label>
          <div style={{ position: 'relative' }}>
            <input
              autoFocus type="number" min="0"
              step={weightUnit === 'جرام' ? '1' : '0.1'}
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={weightUnit === 'جرام' ? 'مثال: 500' : 'مثال: 1.5'}
              style={{
                width: '100%', padding: '14px 16px', background: t.input,
                border: `2px solid ${isValid ? '#10b981' : t.border}`,
                borderRadius: 12, color: t.text, fontFamily: 'Cairo',
                fontSize: 18, fontWeight: 700, boxSizing: 'border-box',
                textAlign: 'center', transition: 'border-color .2s', outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Cairo', color: t.subtext, fontSize: 13,
            }}>{weightUnit}</span>
          </div>
        </div>

        {/* Live Price Preview */}
        <div style={{
          background: t.input, borderRadius: 14, padding: 16, marginBottom: 20,
          border: `1px solid ${isValid ? '#10b981' : t.border}`, transition: 'border-color .2s',
        }}>
          {[
            { label: 'الكمية', value: weightValue
                ? (weightUnit === 'جرام'
                    ? `${weightValue} جرام (${(parseFloat(weightValue)/1000).toFixed(3)} كجم)`
                    : `${weightValue} كجم`)
                : '—' },
            { label: 'سعر الكيلو', value: formatCurrency(product.price) },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Cairo', color: t.subtext, fontSize: 13 }}>{row.label}</span>
              <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 13, fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: t.border, margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 16, fontWeight: 800 }}>الإجمالي</span>
            <span style={{ fontFamily: 'Cairo', color: '#10b981', fontSize: 18, fontWeight: 800 }}>
              {formatCurrency(isValid ? totalPrice : 0)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleClose} style={{
            flex: 1, padding: '13px 0', background: t.border, border: 'none',
            borderRadius: 12, fontFamily: 'Cairo', fontSize: 15, fontWeight: 700,
            color: t.subtext, cursor: 'pointer',
          }}>إلغاء</button>
          <button onClick={handleConfirm} disabled={!isValid} style={{
            flex: 2, padding: '13px 0',
            background: isValid ? '#10b981' : t.border, border: 'none',
            borderRadius: 12, fontFamily: 'Cairo', fontSize: 15, fontWeight: 800,
            color: isValid ? '#fff' : t.subtext,
            cursor: isValid ? 'pointer' : 'not-allowed', transition: 'all .2s',
          }}>✓ إضافة للسلة</button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, t }) {
  const isOutOfStock = product.stock === 0;
  const arabicName   = getDisplayName(product);

  return (
    <button
      onClick={isOutOfStock ? undefined : onClick}
      disabled={isOutOfStock}
      style={{
        background: t.surface,
        border: `1.5px solid ${product.isLoose ? '#78350f' : '#1e3a5f'}`,
        borderRadius: 16, padding: 16,
        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
        textAlign: 'right', transition: 'transform .15s, box-shadow .15s, border-color .15s',
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', gap: 6, opacity: isOutOfStock ? 0.55 : 1,
      }}
      onMouseEnter={e => {
        if (isOutOfStock) return;
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
        padding: '2px 8px', borderRadius: 20,
      }}>
        {product.isLoose ? 'بالوزن' : 'معبأ'}
      </span>

      {isOutOfStock && (
        <span style={{
          position: 'absolute', top: 8, right: 8,
          background: '#7f1d1d', color: '#ef4444',
          fontSize: 9, fontWeight: 800, fontFamily: 'Cairo',
          padding: '2px 8px', borderRadius: 20,
        }}>نفد المخزون</span>
      )}

      <div style={{ fontSize: 34, marginTop: 4 }}>{product.emoji ?? '📦'}</div>
      <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.4 }}>
        {arabicName}
      </div>
      <div style={{ fontFamily: 'Cairo', fontSize: 12, color: product.isLoose ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
        {formatCurrency(product.price)}
        <span style={{ color: t.subtext, fontWeight: 400, fontSize: 11 }}>
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
    ? (item.totalPrice ?? item.price * item.quantity)
    : item.price * item.quantity;

  const displayName = item.nameAr ?? item.name_ar ?? item.name;

  const btnStyle = {
    width: 28, height: 28, background: t.border, border: 'none',
    borderRadius: 7, color: t.text, cursor: 'pointer', fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{
      background: t.surface2, borderRadius: 12, padding: '10px 12px', marginBottom: 8,
      border: `1px solid ${item.isLoose ? '#78350f' : t.border}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>
            <span style={{ marginLeft: 4 }}>{item.emoji}</span>
            {displayName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {item.isLoose ? (
              <span style={{
                background: '#f59e0b22', border: '1px solid #f59e0b55',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#f59e0b', fontWeight: 700,
              }}>⚖️ {weightLabel}</span>
            ) : (
              <span style={{
                background: '#3b82f622', border: '1px solid #3b82f655',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#60a5fa', fontWeight: 700,
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
              <button onClick={() => onUpdate( item.quantity - 1)} style={btnStyle}>−</button>
              <span style={{ fontFamily: 'Cairo', color: t.text, fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button onClick={() => onUpdate(item.quantity + 1)} style={btnStyle}>+</button>
            </>
          )}
          <button onClick={() => onRemove()}
            style={{ ...btnStyle, background: '#7f1d1d', color: '#ef4444' }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── SalesPage ────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const { theme }  = useTheme();
  const t          = useMemo(() => makeTokens(theme), [theme]);

  // ── Settings integration ──────────────────────────────────────────────────
  const { settings } = useSettings();

  // Derive live values from settings with safe fallbacks
  const storeName    = settings?.store_name    ?? 'علافة وعطارة الحاج أبو علي';
  const cashierName  = settings?.cashier_name  ?? 'الحاج أبوعلي';
  const taxRate      = parseFloat(settings?.tax_rate ?? '0') || 0;
  const defaultPayment = settings?.default_payment_method ?? 'CASH';

  // ── Settings drawer state ─────────────────────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ── Products state ────────────────────────────────────────────────────────
  const [products,        setProducts]        = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError,   setProductsError]   = useState(null);

  // ── Cart state ────────────────────────────────────────────────────────────
  const [cart,            setCart]            = useState([]);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('الكل');
  const [looseProduct,    setLooseProduct]    = useState(null);
  const [paymentMethod,   setPaymentMethod]   = useState(defaultPayment);

  // Keep paymentMethod in sync when settings load
  useEffect(() => {
    if (defaultPayment) setPaymentMethod(defaultPayment);
  }, [defaultPayment]);

  // ── Receipt state ─────────────────────────────────────────────────────────
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // ── Order submission state ────────────────────────────────────────────────
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message, type });
    toastTimerRef.current = setTimeout(() =>
      setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  // ── Load products ─────────────────────────────────────────────────────────
  const loadProducts = useCallback(async (search = '') => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res  = await productsApi.getAll(search);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setProducts(list);
    } catch (err) {
      setProductsError(err.message ?? 'فشل تحميل المنتجات');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ── Debounced backend search ──────────────────────────────────────────────
  const searchDebounceRef = useRef(null);
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => loadProducts(value), 400);
  }, [loadProducts]);

  // ── Cart helpers ──────────────────────────────────────────────────────────
const addToCart = useCallback((product) => {
  if (product.isLoose) { setLooseProduct(product); return; }
  const arabicName = getDisplayName(product);
  setCart(prev => {
    const ex = prev.find(i => i.id === product.id && !i.isLoose);
    if (ex) return prev.map(i =>
      i.id === product.id && !i.isLoose
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
    return [...prev, {
      ...product,
      cartKey : `${product.id}_${Date.now()}`,   // ✅ unique key
      name    : arabicName,
      nameAr  : arabicName,
      quantity: 1,
    }];
  });
}, []);

const handleLooseAdd = useCallback((item) => {
  // Always store quantity as whole grams in the cart
  const quantityInGrams = item.weightUnit === 'جرام'
    ? Math.round(item.weightValue)
    : Math.round(item.weightValue * 1000); // kg → grams

  setCart(prev => [...prev, {
    ...item,
    cartKey    : `${item.id}_${Date.now()}`,   // unique key for duplicates
    quantity   : quantityInGrams,              // ✅ always integer grams
    weightValue: item.weightValue,             // keep original for display
    weightUnit : item.weightUnit,              // keep original for display
    unit       : 'جرام',                       // canonical unit in cart
    totalPrice : item.totalPrice,              // already correct from modal
  }]);
  setLooseProduct(null);
}, []);

const removeFromCart = useCallback((cartKey) =>
  setCart(prev => prev.filter(i => i.cartKey !== cartKey)), []);

const updateQty = useCallback((cartKey, qty) =>
  setCart(prev => prev.map(i =>
    i.cartKey === cartKey ? { ...i, quantity: Math.max(1, qty) } : i
  )), []);

  const clearCart       = useCallback(() => setCart([]), []);

  // ── Totals ────────────────────────────────────────────────────────────────
  const cartSubtotal = useMemo(() =>
    cart.reduce((sum, i) =>
      sum + (i.isLoose ? (i.totalPrice ?? i.price * i.quantity) : i.price * i.quantity), 0),
  [cart]);

    const discountAmount = 0;

    const taxAmount = parseFloat((cartSubtotal * (taxRate / 100)).toFixed(2));
    const cartTotal = parseFloat((cartSubtotal + taxAmount - discountAmount).toFixed(2));


  // ── Checkout → POST /orders ───────────────────────────────────────────────
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0 || isSubmitting) return;

    const orderPayload = {
      orderNumber  : `INV-${Date.now().toString(36).toUpperCase()}`.slice(-10),
      status       : 'COMPLETED',
      paymentMethod,
      notes        : '',
      items: cart.map(item => {
          const finalPrice = item.isLoose
            ? (item.price / 1000) // Price per gram
            : item.price;

         return {
          productId : Number(item.id),
          name      : getDisplayName(item),
          price     : parseFloat(item.isLoose ? item.price : item.price),
          quantity  : item.isLoose ? parseFloat(item.quantity.toFixed(3)) : item.quantity,
          unit      : item.isLoose ? (item.weightUnit || 'جرام') : (item.unit || 'قطعة'),
          subtotal  : parseFloat((item.totalPrice ?? item.price * item.quantity).toFixed(2)),
        };
      }),
      subtotal: parseFloat(cartSubtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      tax  : parseFloat(taxAmount.toFixed(2)),
      total: parseFloat((cartSubtotal - discountAmount + taxAmount).toFixed(2)),

    };

    setIsSubmitting(true);
    setCheckoutError(null);
// ── In handleCheckout, fix the date field ─────────────────────────────────
// const formatReceiptDate = (iso) => {
//   try {
//     const d = iso ? new Date(iso) : new Date();
//     return d.toLocaleString('ar-EG', {
//       year: 'numeric', month: 'long', day: 'numeric',
//       hour: '2-digit', minute: '2-digit',
//     });
//   } catch { return String(iso ?? ''); }
// };

    try {
      const res        = await ordersApi.create(orderPayload);
      const savedOrder = res?.data ?? res;

    // ── Inside the try block, fix the receipt object ──────────────────────────

const receipt = {
  invoiceNumber : savedOrder.orderNumber ?? orderPayload.orderNumber,
//   date          : formatReceiptDate(savedOrder.createdAt),  // ✅ string, never Date object
  date: savedOrder.createdAt ?? new Date().toISOString(),  // raw ISO string

  cashierName   : cashierName,
  storeName     : storeName,
  paymentMethod : paymentMethod,
  amountPaid    : cartTotal,
  change        : 0,
  items: cart.filter(Boolean).map((item, idx) => ({
    id         : item.id          ?? idx,
    name       : getDisplayName(item),
    emoji      : item.emoji       ?? '📦',
    price      : parseFloat(item.price   ?? 0),
    quantity   : parseFloat(item.quantity ?? 1),
    isLoose    : item.isLoose     ?? false,
    weightValue: item.weightValue ?? null,
    weightUnit : item.weightUnit  ?? null,
    totalPrice : item.isLoose
      ? (item.totalPrice ?? item.price * item.quantity)
      : item.price * item.quantity,
    weightLabel: item.isLoose ? formatWeight(item) : null,
    unit: item.isLoose ? (item.weightUnit || 'جرام') : (item.unit || 'قطعة'),
  })),
  subtotal     : cartSubtotal,
  discount     : discountAmount,
  tax          : taxAmount,
  total        : cartTotal,

  receiptNumber: savedOrder?.orderNumber
    ?? (savedOrder?.id
      ? `INV-${String(savedOrder.id).padStart(4, '0')}`
      : orderPayload.orderNumber),
  itemsCount: cart.reduce((sum, i) => sum + (i.isLoose ? 0 : i.quantity), 0),
  linesCount: cart.length,
};


      setCart([]);
      setReceiptData(receipt);
      setShowReceipt(true);
      showToast('تم إتمام الطلب بنجاح ✓', 'success');

    } catch (err) {
      const msg = err.message ?? 'فشل في إتمام الطلب، حاول مرة أخرى';
      setCheckoutError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
}, [cart, cartSubtotal, discountAmount, cartTotal, taxAmount,
    paymentMethod, storeName, cashierName, isSubmitting, showToast]);
  // ── Derived ───────────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['الكل', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() =>
    products.filter(p => activeCategory === 'الكل' || p.category === activeCategory),
  [products, activeCategory]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ display: 'flex', height: '100vh', background: t.main, overflow: 'hidden' }}>

      {/* ── Cart Panel ── */}
      <aside style={{
        width: 360, background: t.surface,
        borderLeft: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{
          padding: '16px 20px', fontFamily: 'Cairo', fontSize: 18,
          fontWeight: 800, color: t.text, borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            🛒 سلة المشتريات
            {cart.length > 0 && (
              <span style={{
                background: '#10b981', color: '#fff', borderRadius: 20,
                fontSize: 12, fontWeight: 800, padding: '1px 8px', fontFamily: 'Cairo',
              }}>{cart.length}</span>
            )}
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} style={{
              background: 'none', border: 'none', fontFamily: 'Cairo',
              fontSize: 12, color: '#ef4444', cursor: 'pointer', fontWeight: 700,
            }}>مسح الكل ✕</button>
          )}
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: t.subtext, fontFamily: 'Cairo', marginTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <div style={{ fontSize: 14 }}>السلة فارغة</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>أضف منتجاً للبدء</div>
            </div>
          ) : (
            cart.map(item => (
             <CartItem
  key={item.cartKey}           // ✅ was item.id
  item={item}
  onUpdate={(qty) => updateQty(item.cartKey, qty)}   // ✅
  onRemove={() => removeFromCart(item.cartKey)}        // ✅
  t={t}
/>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        <div style={{ padding: 16, borderTop: `1px solid ${t.border}` }}>
          {checkoutError && (
            <div style={{
              background: '#7f1d1d33', border: '1px solid #ef444466',
              borderRadius: 10, padding: '8px 12px', marginBottom: 12,
              fontFamily: 'Cairo', fontSize: 12, color: '#ef4444',
            }}>⚠️ {checkoutError}</div>
          )}

          {/* Subtotal */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Cairo', color: t.subtext, marginBottom: 8, fontSize: 13,
          }}>
            <span>المجموع الفرعي</span>
            <span>{formatCurrency(cartSubtotal)}</span>
          </div>

          {/* Tax row — only shown if taxRate > 0 */}
          {taxRate > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Cairo', color: t.subtext, marginBottom: 8, fontSize: 13,
            }}>
           <span>ضريبة ({taxRate.toFixed(0)}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}

          {/* Discount row */}
          {discountAmount > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Cairo', color: '#f59e0b', marginBottom: 8, fontSize: 13,
            }}>
              <span>الخصم</span>
              <span>− {formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div style={{ height: 1, background: t.border, margin: '10px 0' }} />

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Cairo', color: t.text, fontSize: 17, fontWeight: 800, marginBottom: 12,
          }}>
            <span>الإجمالي</span>
            <span style={{ color: '#10b981' }}>{formatCurrency(cartTotal)}</span>
          </div>

          {/* Payment method toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[
              { id: 'CASH', label: '💵 نقدي' },
              { id: 'CARD', label: '💳 بطاقة' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                style={{
                  flex: 1, padding: '9px 0', border: '1.5px solid',
                  borderColor : paymentMethod === opt.id ? '#10b981' : t.border,
                  background  : paymentMethod === opt.id ? '#064e3b'  : t.surface2,
                  borderRadius: 10, fontFamily: 'Cairo', fontSize: 13, fontWeight: 700,
                  color: paymentMethod === opt.id ? '#10b981' : t.subtext,
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >{opt.label}</button>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 14,
              background: cart.length && !isSubmitting ? '#10b981' : t.border,
              fontFamily: 'Cairo', fontSize: 16, fontWeight: 800,
              color: cart.length && !isSubmitting ? '#fff' : t.subtext,
              cursor: cart.length && !isSubmitting ? 'pointer' : 'not-allowed',
              transition: 'all .2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{
                  width: 16, height: 16, border: '2px solid #ffffff44',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin .7s linear infinite', display: 'inline-block',
                }} />
                جارٍ الحفظ...
              </>
            ) : 'إتمام الشراء ←'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </aside>

      {/* ── Products Panel ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar: store name + settings button */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          {/* Store name badge (from settings) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: '8px 14px',
          }}>
            <span style={{ fontSize: 18 }}>🏪</span>
            <span style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 700, color: t.text }}>
              {storeName}
            </span>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="الإعدادات"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: t.surface, border: `1.5px solid ${t.border}`,
              borderRadius: 12, padding: '8px 14px', cursor: 'pointer',
              fontFamily: 'Cairo', fontSize: 13, fontWeight: 700,
              color: t.subtext, transition: 'all .15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.color = '#10b981';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = t.border;
              e.currentTarget.style.color = t.subtext;
            }}
          >
            <SettingsIcon size={16} />
            الإعدادات
          </button>
        </div>

        {/* Type Legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { color: '#f59e0b', bg: '#f59e0b22', border: '#f59e0b55', label: '⚖️ منتجات بالوزن' },
            { color: '#3b82f6', bg: '#3b82f622', border: '#3b82f655', label: '📦 منتجات معبأة'  },
          ].map(({ color, bg, border, label }) => (
            <div key={label} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 20,
              padding: '5px 14px', fontFamily: 'Cairo', fontSize: 12, color, fontWeight: 700,
            }}>{label}</div>
          ))}
        </div>

        {/* Search */}
        <input
          placeholder="🔍 ابحث عن منتج..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%', padding: '12px 16px', background: t.surface,
            border: `1.5px solid ${t.border}`, borderRadius: 12, color: t.text,
            fontFamily: 'Cairo', fontSize: 14, marginBottom: 16,
            boxSizing: 'border-box', outline: 'none',
          }}
        />

        {productsError && (
          <ErrorBanner message={productsError} onRetry={() => loadProducts(searchQuery)} t={t} />
        )}

        {/* Categories */}
        {!productsLoading && categories.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
                borderColor : activeCategory === cat ? '#10b981' : t.border,
                background  : activeCategory === cat ? '#064e3b'  : t.surface,
                color       : activeCategory === cat ? '#10b981'  : t.subtext,
                fontFamily: 'Cairo', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all .15s',
              }}>{cat}</button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: 12,
        }}>
          {productsLoading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} t={t} />)
            : filteredProducts.length === 0
              ? (
                <div style={{
                  gridColumn: '1 / -1', textAlign: 'center',
                  color: t.subtext, fontFamily: 'Cairo', paddingTop: 60,
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 15 }}>لا توجد منتجات مطابقة</div>
                </div>
              )
              : filteredProducts.map(product => (
                <ProductCard
                  key={product.id} product={product}
                  onClick={() => addToCart(product)} t={t}
                />
              ))
          }
        </div>
      </main>

      {/* ── Settings Drawer ───────────────────────────────────────────────── */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        t={t}
      />

      {/* ── Loose Weight Modal ────────────────────────────────────────────── */}
      <LooseProductModal
        isOpen={!!looseProduct}
        product={looseProduct}
        onClose={() => setLooseProduct(null)}
        onAddToCart={handleLooseAdd}
        t={t}
      />

      {/* ── Receipt Modal ─────────────────────────────────────────────────── */}
    {showReceipt && receiptData && (
  <Receipt
    isOpen={showReceipt}
    orderData={receiptData}
    settings={settings}
    onClose={() => {
      setShowReceipt(false);
      setReceiptData(null);
    }}
  />
)}



      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
}