// ─── SalesPage.jsx ───────────────────────────────────────────────────────────
import React, { useState, useMemo, useCallback } from 'react';
import Receipt from '../components/Receipt/Receipt';
import { MOCK_PRODUCTS } from '../../../data/products';

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

const formatWeight = (item) => {
  if (!item.isLoose) return null;
  const w = parseFloat(item.weightValue ?? item.quantity);
  const u = item.weightUnit ?? 'كجم';
  if (u === 'جرام') return `${w} جرام`;
  return w < 1 ? `${(w * 1000).toFixed(0)} جرام` : `${w} كجم`;
};

// ─── Loose Product Modal (inline) ────────────────────────────────────────────
function LooseProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit]   = useState('كجم');

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
      id          : `${product.id}_${Date.now()}`,
      quantity    : weightInKg,
      weightValue : parseFloat(weightValue),
      weightUnit,
      price       : product.price,
      totalPrice,
      isLoose     : true,
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
          background: '#1f2937', borderRadius: 20, padding: 32, width: 380,
          border: '1px solid #374151', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{product.emoji}</div>
          <h2 style={{ fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 20, fontWeight: 800, margin: 0 }}>
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
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: '#9ca3af', display: 'block', marginBottom: 8 }}>
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
                  borderColor  : weightUnit === unit ? '#10b981' : '#374151',
                  background   : weightUnit === unit ? '#064e3b'  : '#111827',
                  color        : weightUnit === unit ? '#10b981'  : '#9ca3af',
                  fontFamily: 'Cairo', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  transition: 'all .15s'
                }}
              >
                {unit === 'كجم' ? '⚖️ كيلوجرام' : '🔬 جرام'}
              </button>
            ))}
          </div>
        </div>

        {/* Weight Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: 'Cairo', fontSize: 13, color: '#9ca3af', display: 'block', marginBottom: 8 }}>
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
                width: '100%', padding: '14px 16px', background: '#111827',
                border: `2px solid ${isValid ? '#10b981' : '#374151'}`,
                borderRadius: 12, color: '#f3f4f6', fontFamily: 'Cairo',
                fontSize: 18, fontWeight: 700, boxSizing: 'border-box',
                textAlign: 'center', transition: 'border-color .2s',
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Cairo', color: '#6b7280', fontSize: 13
            }}>{weightUnit}</span>
          </div>
        </div>

        {/* Live Price Preview */}
        <div style={{
          background: '#111827', borderRadius: 14, padding: 16, marginBottom: 20,
          border: `1px solid ${isValid ? '#10b981' : '#374151'}`, transition: 'border-color .2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Cairo', color: '#9ca3af', fontSize: 13 }}>الكمية</span>
            <span style={{ fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 13, fontWeight: 600 }}>
              {weightValue
                ? (weightUnit === 'جرام'
                    ? `${weightValue} جرام (${(parseFloat(weightValue)/1000).toFixed(3)} كجم)`
                    : `${weightValue} كجم`)
                : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Cairo', color: '#9ca3af', fontSize: 13 }}>سعر الكيلو</span>
            <span style={{ fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 13 }}>{formatCurrency(product.price)}</span>
          </div>
          <div style={{ height: 1, background: '#374151', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 16, fontWeight: 800 }}>الإجمالي</span>
            <span style={{ fontFamily: 'Cairo', color: '#10b981', fontSize: 18, fontWeight: 800 }}>
              {isValid ? formatCurrency(totalPrice) : formatCurrency(0)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleClose} style={{
            flex: 1, padding: '13px 0', background: '#374151', border: 'none',
            borderRadius: 12, fontFamily: 'Cairo', fontSize: 15, fontWeight: 700,
            color: '#9ca3af', cursor: 'pointer'
          }}>إلغاء</button>
          <button onClick={handleConfirm} disabled={!isValid} style={{
            flex: 2, padding: '13px 0',
            background: isValid ? '#10b981' : '#374151',
            border: 'none', borderRadius: 12, fontFamily: 'Cairo',
            fontSize: 15, fontWeight: 800,
            color: isValid ? '#fff' : '#6b7280',
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
function ProductCard({ product, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#1f2937',
        border: `1.5px solid ${product.isLoose ? '#78350f' : '#1e3a5f'}`,
        borderRadius: 16, padding: 16, cursor: 'pointer', textAlign: 'right',
        transition: 'transform .15s, box-shadow .15s, border-color .15s',
        position: 'relative', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', gap: 6
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
      {/* Type Badge */}
      <span style={{
        position: 'absolute', top: 8, left: 8,
        background: product.isLoose ? '#f59e0b' : '#3b82f6',
        color: product.isLoose ? '#000' : '#fff',
        fontSize: 9, fontWeight: 800, fontFamily: 'Cairo',
        padding: '2px 8px', borderRadius: 20,
        letterSpacing: 0.5
      }}>
        {product.isLoose ? ' بالوزن' : ' معبأ'}
      </span>

      <div style={{ fontSize: 34, marginTop: 4 }}>{product.emoji}</div>
      <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: '#f3f4f6', lineHeight: 1.4 }}>
        {product.name}
      </div>
      <div style={{ fontFamily: 'Cairo', fontSize: 12, color: product.isLoose ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
        {formatCurrency(product.price)}
        <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 11 }}>
          {product.isLoose ? ' / كجم' : ' / قطعة'}
        </span>
      </div>
    </button>
  );
}

// ─── Cart Item ────────────────────────────────────────────────────────────────
function CartItem({ item, onUpdate, onRemove }) {
  const weightLabel = formatWeight(item);
  const lineTotal   = item.isLoose
    ? item.totalPrice ?? (item.price * item.quantity)
    : item.price * item.quantity;

  return (
    <div style={{
      background: '#111827', borderRadius: 12, padding: '10px 12px', marginBottom: 8,
      border: `1px solid ${item.isLoose ? '#78350f' : '#374151'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 13, fontWeight: 700, color: '#f3f4f6', marginBottom: 2 }}>
            <span style={{ marginLeft: 4 }}>{item.emoji}</span>
            {item.name}
          </div>

          {/* Weight / Qty badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {item.isLoose ? (
              <span style={{
                background: '#f59e0b22', border: '1px solid #f59e0b55',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#f59e0b', fontWeight: 700
              }}>
                ⚖️ {weightLabel}
              </span>
            ) : (
              <span style={{
                background: '#3b82f622', border: '1px solid #3b82f655',
                borderRadius: 20, padding: '1px 8px',
                fontFamily: 'Cairo', fontSize: 11, color: '#60a5fa', fontWeight: 700
              }}>
                📦 معبأ × {item.quantity}
              </span>
            )}
            <span style={{ fontFamily: 'Cairo', fontSize: 12, color: '#10b981', fontWeight: 700 }}>
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!item.isLoose && (
            <>
              <button onClick={() => onUpdate(item.id, item.quantity - 1)} style={btnStyle}>−</button>
              <span style={{ fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button onClick={() => onUpdate(item.id, item.quantity + 1)} style={btnStyle}>+</button>
            </>
          )}
          <button onClick={() => onRemove(item.id)} style={{ ...btnStyle, background: '#7f1d1d', color: '#ef4444' }}>✕</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 28, height: 28, background: '#374151', border: 'none',
  borderRadius: 7, color: '#fff', cursor: 'pointer', fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

// ─── SalesPage ────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const [cart,           setCart]           = useState([]);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [looseProduct,   setLooseProduct]   = useState(null);
  const [showReceipt,    setShowReceipt]    = useState(false);
  const [receiptData,    setReceiptData]    = useState(null);

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addToCart = useCallback((product) => {
    if (product.isLoose) { setLooseProduct(product); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id && !i.isLoose);
      if (ex) return prev.map(i => i.id === product.id && !i.isLoose ? { ...i, quantity: i.quantity + 1 } : i);
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
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)), []);

  const cartSubtotal = useMemo(() =>
    cart.reduce((sum, i) =>
      sum + (i.isLoose ? (i.totalPrice ?? i.price * i.quantity) : i.price * i.quantity), 0),
  [cart]);

  const discountAmount = 0;
  const taxRate        = 0.15;
//   const taxAmount      = (cartSubtotal - discountAmount) * taxRate;
//   const cartTotal      = cartSubtotal - discountAmount + taxAmount;
  const cartTotal      = cartSubtotal - discountAmount;

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    const orderData = {
      invoiceNumber : `INV-${Date.now().toString(36).toUpperCase()}`.slice(-10),
      date          : new Date(),
      cashierName   : 'الحاج أبوعلي',
      storeName     : 'علافة وعطارة الحاج أبو علي ',
      paymentMethod : 'نقدي',
      amountPaid    : cartTotal,
      change        : 0,
      items: cart.filter(Boolean).map((item, idx) => ({
        id         : item.id    ?? idx,
        name       : item.name  ?? `صنف ${idx + 1}`,
        emoji      : item.emoji ?? '📦',
        price      : parseFloat(item.price ?? 0),
        quantity   : parseFloat(item.quantity ?? 1),
        isLoose    : item.isLoose ?? false,
        weightValue: item.weightValue ?? null,
        weightUnit : item.weightUnit  ?? null,
        totalPrice : item.isLoose
          ? (item.totalPrice ?? item.price * item.quantity)
          : item.price * item.quantity,
        // Human-readable weight label for receipt
        weightLabel: item.isLoose ? formatWeight(item) : null,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
//       tax     : taxAmount,
      total   : cartTotal,
    };
    setReceiptData(orderData);
    setCart([]);
    setShowReceipt(true);
//   }, [cart, cartSubtotal, discountAmount, taxAmount, cartTotal]);
  }, [cart, cartSubtotal, discountAmount, cartTotal]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    return ['الكل', ...cats];
  }, []);

  const filteredProducts = useMemo(() =>
    MOCK_PRODUCTS.filter(p => {
      const matchCat   = activeCategory === 'الكل' || p.category === activeCategory;
      const matchQuery = p.name.includes(searchQuery);
      return matchCat && matchQuery;
    }),
  [activeCategory, searchQuery]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ display: 'flex', height: '100vh', background: '#111827' }}>

      {/* ── Cart Panel ──────────────────────────────────────────── */}
      <aside style={{
        width: 360, background: '#1f2937',
        borderLeft: '1px solid #374151', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px 20px', fontFamily: 'Cairo', fontSize: 18,
          fontWeight: 800, color: '#f3f4f6', borderBottom: '1px solid #374151',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          🛒 سلة المشتريات
          {cart.length > 0 && (
            <span style={{
              background: '#10b981', color: '#fff', borderRadius: 20,
              fontSize: 12, fontWeight: 800, padding: '1px 8px', fontFamily: 'Cairo'
            }}>{cart.length}</span>
          )}
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#4b5563', fontFamily: 'Cairo', marginTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <div style={{ fontSize: 14 }}>السلة فارغة</div>
            </div>
          ) : (
            cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={updateQty}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {/* Totals */}
        <div style={{ padding: 16, borderTop: '1px solid #374151' }}>
          {[
            { label: 'المجموع الفرعي', value: cartSubtotal, color: '#9ca3af' },
            ...(discountAmount > 0 ? [{ label: 'الخصم', value: -discountAmount, color: '#f59e0b' }] : []),
//             { label: `الضريبة (${(taxRate * 100).toFixed(0)}%)`, value: taxAmount, color: '#9ca3af' },
//             { label: `الضريبة (${(taxRate * 100).toFixed(0)}%)`, value: taxAmount, color: '#9ca3af' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Cairo', color, marginBottom: 8, fontSize: 13 }}>
              <span>{label}</span>
              <span>{formatCurrency(Math.abs(value))}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#374151', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Cairo', color: '#f3f4f6', fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
            <span>الإجمالي</span>
            <span style={{ color: '#10b981' }}>{formatCurrency(cartTotal)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 14,
              background: cart.length ? '#10b981' : '#374151',
              fontFamily: 'Cairo', fontSize: 16, fontWeight: 800,
              color: cart.length ? '#fff' : '#6b7280',
              cursor: cart.length ? 'pointer' : 'not-allowed',
              transition: 'all .2s'
            }}
          >
            إتمام الشراء ←
          </button>
        </div>
      </aside>

      {/* ── Products Panel ───────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { color: '#f59e0b', bg: '#f59e0b22', border: '#f59e0b55', label: '⚖️ منتجات بالوزن' },
            { color: '#3b82f6', bg: '#3b82f622', border: '#3b82f655', label: '📦 منتجات معبأة' },
          ].map(({ color, bg, border, label }) => (
            <div key={label} style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: 20, padding: '5px 14px',
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
            width: '100%', padding: '12px 16px', background: '#1f2937',
            border: '1.5px solid #374151', borderRadius: 12, color: '#f3f4f6',
            fontFamily: 'Cairo', fontSize: 14, marginBottom: 16, boxSizing: 'border-box',
            outline: 'none'
          }}
        />

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
              borderColor : activeCategory === cat ? '#10b981' : '#374151',
              background  : activeCategory === cat ? '#064e3b'  : '#1f2937',
              color       : activeCategory === cat ? '#10b981'  : '#9ca3af',
              fontFamily: 'Cairo', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all .15s'
            }}>{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12 }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => addToCart(product)} />
          ))}
        </div>
      </main>

      {/* ── Loose Modal ──────────────────────────────────────────── */}
      <LooseProductModal
        isOpen={!!looseProduct}
        product={looseProduct}
        onClose={() => setLooseProduct(null)}
        onAddToCart={handleLooseAdd}
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