import React, { useState, useCallback, useEffect } from 'react';

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

export default function LooseProductModal({ isOpen, product, onClose, onAddToCart }) {
  // ✅ ALL hooks at the top — unconditionally, always
  const [weight, setWeight]   = useState('');
  const [error,  setError]    = useState('');

  // Reset state whenever the modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setWeight('');
      setError('');
    }
  }, [isOpen, product]);

  const handleWeightChange = useCallback((e) => {
    const val = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setWeight(val);
      setError('');
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (!product) return;

    const parsed = parseFloat(weight);

    if (!weight || isNaN(parsed) || parsed <= 0) {
      setError('الرجاء إدخال وزن صحيح أكبر من صفر');
      return;
    }

    if (typeof onAddToCart !== 'function') {
      console.error('[LooseProductModal] onAddToCart is not a function');
      return;
    }

    const looseItem = {
      id         : `${product.id}-loose-${Date.now()}`, // unique ID per entry
      name       : product.name,
      emoji      : product.emoji  ?? '⚖️',
      price      : product.price, // price per kg/unit
      quantity   : parsed,
      unitLabel  : product.unit   ?? 'كجم',
      isLoose    : true,
      category   : product.category ?? '',
    };

    onAddToCart(looseItem);

    // Reset after confirming
    setWeight('');
    setError('');
  }, [weight, product, onAddToCart]);

  const handleClose = useCallback(() => {
    setWeight('');
    setError('');
    if (typeof onClose === 'function') onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter')  handleConfirm();
    if (e.key === 'Escape') handleClose();
  }, [handleConfirm, handleClose]);

  // ✅ Early return AFTER all hooks
  if (!isOpen || !product) return null;

  const parsedWeight = parseFloat(weight) || 0;
  const lineTotal    = parsedWeight * (product.price ?? 0);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={handleClose}
    >
      <div
        dir="rtl"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1f2937', borderRadius: 18, padding: 28, width: 360,
          border: '1.5px solid #374151', boxShadow: '0 25px 60px rgba(0,0,0,.5)',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 32 }}>{product.emoji ?? '⚖️'}</span>
            <div>
              <div style={{ color: '#f3f4f6', fontSize: 16, fontWeight: 800 }}>{product.name}</div>
              <div style={{ color: '#10b981', fontSize: 12 }}>
                {formatCurrency(product.price)} / {product.unit ?? 'كجم'}
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: '#374151', border: 'none', borderRadius: 8,
              color: '#9ca3af', width: 32, height: 32, cursor: 'pointer',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Weight Input */}
        <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 6 }}>
          أدخل الوزن ({product.unit ?? 'كجم'})
        </label>
        <input
          autoFocus
          type="text"
          inputMode="decimal"
          value={weight}
          onChange={handleWeightChange}
          onKeyDown={handleKeyDown}
          placeholder={`مثال: 1.5`}
          style={{
            width: '100%', padding: '13px 16px', background: '#111827',
            border: `1.5px solid ${error ? '#ef4444' : '#374151'}`,
            borderRadius: 12, color: '#f3f4f6', fontSize: 18,
            fontFamily: 'Cairo', boxSizing: 'border-box', outline: 'none',
            textAlign: 'center', letterSpacing: 2,
          }}
        />

        {/* Error */}
        {error && (
          <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Live Total */}
        {parsedWeight > 0 && (
          <div style={{
            marginTop: 14, padding: '12px 16px', background: '#064e3b',
            borderRadius: 10, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#6ee7b7', fontSize: 13 }}>
              {parsedWeight} {product.unit ?? 'كجم'} × {formatCurrency(product.price)}
            </span>
            <span style={{ color: '#10b981', fontSize: 16, fontWeight: 800 }}>
              {formatCurrency(lineTotal)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1, padding: 13, background: '#374151', border: 'none',
              borderRadius: 12, color: '#9ca3af', fontFamily: 'Cairo',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >إلغاء</button>
          <button
            onClick={handleConfirm}
            disabled={!weight || parseFloat(weight) <= 0}
            style={{
              flex: 2, padding: 13,
              background: (weight && parseFloat(weight) > 0) ? '#10b981' : '#374151',
              border: 'none', borderRadius: 12, color: '#fff',
              fontFamily: 'Cairo', fontSize: 15, fontWeight: 800,
              cursor: (weight && parseFloat(weight) > 0) ? 'pointer' : 'not-allowed',
              transition: 'background .2s',
            }}
          >
            ✅ إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  );
}