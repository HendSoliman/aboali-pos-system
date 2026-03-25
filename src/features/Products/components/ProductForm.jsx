import React, { useState } from 'react';

const CATEGORIES = ['مشروبات', 'وجبات', 'حلويات', 'سناكس', 'منوعات'];
const UNITS      = ['قطعة', 'كيلو', 'جرام', 'لتر', 'علبة', 'حبة', 'طبق'];
const EMOJIS     = ['🛍️','🥤','🍔','🍰','🍿','🧃','🍕','🍜','☕','🧁','🥗','🍱'];

// ── Stable defaults — every field the backend requires ──────────────────────
const makeDefault = (initial) => ({
  name    : initial?.name     ?? '',
  nameAr  : initial?.nameAr   ?? '',
  price   : initial?.price    ?? '',
  cost    : initial?.cost     ?? '',
  stock   : initial?.stock    ?? '',
  category: initial?.category ?? 'مشروبات',
  barcode : initial?.barcode  ?? '',
  emoji   : initial?.emoji    ?? '🛍️',
  unit    : initial?.unit     ?? 'قطعة',   // ✅ THE FIX — was missing entirely
  isLoose : initial?.isLoose  ?? false,
  active  : initial?.active   ?? true,
});

export default function ProductForm({ initial, onSubmit, onCancel, isSubmitting }) {
  const [form,         setForm]         = useState(() => makeDefault(initial));
  const [showEmojiPicker, setEmojiPicker] = useState(false);

  const set    = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggle = (key)      => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);   // toPayload() in useProducts handles coercion
  };

  /* ── Styles ─────────────────────────────────────────────────────────────── */
  const css = {
    form: {
      display: 'flex', flexDirection: 'column', gap: 16,
      fontFamily: "'Cairo', sans-serif", direction: 'rtl',
    },
    section: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
    },
    sectionTitle: {
      fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
      color: '#6b7280', textTransform: 'uppercase', marginBottom: 2,
    },
    row: { display: 'grid', gap: 12 },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 12, fontWeight: 600, color: '#9ca3af' },
    input: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '9px 12px',
      color: '#f1f5f9', fontSize: 14, fontFamily: "'Cairo', sans-serif",
      outline: 'none', transition: 'border-color .2s',
      width: '100%', boxSizing: 'border-box',
    },
    select: {
      background: '#1e2433',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '9px 12px',
      color: '#f1f5f9', fontSize: 14, fontFamily: "'Cairo', sans-serif",
      outline: 'none', width: '100%', cursor: 'pointer',
    },
    toggle: (active) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      background: active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${active ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 8, padding: '9px 13px', cursor: 'pointer',
      transition: 'all .2s',
    }),
    toggleDot: (active) => ({
      width: 32, height: 18, borderRadius: 9,
      background: active ? '#22c55e' : '#374151',
      position: 'relative', transition: 'background .2s', flexShrink: 0,
    }),
    toggleKnob: (active) => ({
      position: 'absolute', top: 2,
      right: active ? 2 : 'auto', left: active ? 'auto' : 2,
      width: 14, height: 14, borderRadius: '50%',
      background: '#fff', transition: 'all .2s',
    }),
    emojiBtn: {
      fontSize: 26, background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
      lineHeight: 1, flexShrink: 0,
    },
    emojiGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 6, marginTop: 8,
      background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: 10,
    },
    emojiOption: (active) => ({
      fontSize: 22, padding: '4px 2px', textAlign: 'center',
      borderRadius: 6, cursor: 'pointer',
      background: active ? 'rgba(99,102,241,0.3)' : 'transparent',
      border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
      transition: 'background .15s',
    }),
    actions: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4,
    },
    cancelBtn: {
      padding: '10px 0', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)',
      background: 'transparent', color: '#9ca3af', fontSize: 14,
      fontFamily: "'Cairo', sans-serif", fontWeight: 600, cursor: 'pointer',
      transition: 'all .2s',
    },
    submitBtn: {
      padding: '10px 0', borderRadius: 9, border: 'none',
      background: isSubmitting ? '#374151' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      color: '#fff', fontSize: 14, fontFamily: "'Cairo', sans-serif",
      fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'opacity .2s',
    },
    required: { color: '#ef4444', marginRight: 2 },
  };

  return (
    <>
      {/* Cairo font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input:focus, select:focus { border-color: rgba(99,102,241,0.6) !important; }
      `}</style>

      <form style={css.form} onSubmit={handleSubmit}>

        {/* ── Section 1: Identity ─────────────────────────────────────────── */}
        <div style={css.section}>
          <span style={css.sectionTitle}>بيانات المنتج</span>

          {/* Name AR */}
          <div style={css.field}>
            <label style={css.label}>
              اسم المنتج (عربي)<span style={css.required}>*</span>
            </label>
            <input style={css.input} type="text" placeholder="مثال: عصير برتقال"
              value={form.name} required
              onChange={e => set('name', e.target.value)} />
          </div>

          {/* Name EN */}
          <div style={css.field}>
            <label style={css.label}>اسم المنتج (إنجليزي)</label>
            <input style={{ ...css.input, direction: 'ltr' }}
              type="text" placeholder="e.g. Orange Juice"
              value={form.nameAr}
              onChange={e => set('nameAr', e.target.value)} />
          </div>

          {/* Barcode */}
          <div style={css.field}>
            <label style={css.label}>الباركود</label>
            <input style={{ ...css.input, direction: 'ltr', letterSpacing: '0.05em' }}
              type="text" placeholder="1234567890123"
              value={form.barcode}
              onChange={e => set('barcode', e.target.value)} />
          </div>
        </div>

        {/* ── Section 2: Pricing ──────────────────────────────────────────── */}
        <div style={css.section}>
          <span style={css.sectionTitle}>الأسعار والمخزون</span>

          {/* Price + Cost */}
          <div style={{ ...css.row, gridTemplateColumns: '1fr 1fr' }}>
            <div style={css.field}>
              <label style={css.label}>
                سعر البيع (ج.م)<span style={css.required}>*</span>
              </label>
              <input style={css.input} type="number" min="0" step="0.01"
                placeholder="0.00" value={form.price} required
                onChange={e => set('price', e.target.value)} />
            </div>
            <div style={css.field}>
              <label style={css.label}>سعر التكلفة (ج.م)</label>
              <input style={css.input} type="number" min="0" step="0.01"
                placeholder="0.00" value={form.cost}
                onChange={e => set('cost', e.target.value)} />
            </div>
          </div>

          {/* Stock + Unit */}
          <div style={{ ...css.row, gridTemplateColumns: '1fr 1fr' }}>
            <div style={css.field}>
              <label style={css.label}>
                المخزون<span style={css.required}>*</span>
              </label>
              <input style={css.input} type="number" min="0"
                placeholder="0" value={form.stock} required
                onChange={e => set('stock', e.target.value)} />
            </div>
            {/* ✅ THIS IS THE FIX — unit field was completely missing */}
            <div style={css.field}>
              <label style={css.label}>
                وحدة القياس<span style={css.required}>*</span>
              </label>
              <select style={css.select}
                value={form.unit}
                onChange={e => set('unit', e.target.value)}>
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Section 3: Classification ───────────────────────────────────── */}
        <div style={css.section}>
          <span style={css.sectionTitle}>التصنيف والعرض</span>

          {/* Category */}
          <div style={css.field}>
            <label style={css.label}>الفئة</label>
            <select style={css.select}
              value={form.category}
              onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Emoji picker */}
          <div style={css.field}>
            <label style={css.label}>الأيقونة</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" style={css.emojiBtn}
                onClick={() => setEmojiPicker(p => !p)}>
                {form.emoji}
              </button>
              <input style={{ ...css.input, flex: 1 }}
                type="text" placeholder="🛍️" maxLength={2}
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)} />
            </div>
            {showEmojiPicker && (
              <div style={css.emojiGrid}>
                {EMOJIS.map(em => (
                  <button key={em} type="button"
                    style={css.emojiOption(form.emoji === em)}
                    onClick={() => { set('emoji', em); setEmojiPicker(false); }}>
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Section 4: Toggles ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

          {/* isLoose toggle */}
          <button type="button"
            style={css.toggle(form.isLoose)}
            onClick={() => toggle('isLoose')}>
            <div style={css.toggleDot(form.isLoose)}>
              <div style={css.toggleKnob(form.isLoose)} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700,
                color: form.isLoose ? '#4ade80' : '#9ca3af' }}>
                مباع بالوزن
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>
                {form.isLoose ? 'نعم — كيلو/جرام' : 'لا — وحدات محددة'}
              </div>
            </div>
          </button>

          {/* active toggle */}
          <button type="button"
            style={css.toggle(form.active)}
            onClick={() => toggle('active')}>
            <div style={css.toggleDot(form.active)}>
              <div style={css.toggleKnob(form.active)} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700,
                color: form.active ? '#4ade80' : '#9ca3af' }}>
                حالة المنتج
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>
                {form.active ? 'نشط — يظهر في الكاشير' : 'مخفي — لا يظهر'}
              </div>
            </div>
          </button>

        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div style={css.actions}>
          <button type="button" style={css.cancelBtn} onClick={onCancel}>
            إلغاء
          </button>
          <button type="submit" style={css.submitBtn} disabled={isSubmitting}>
            {isSubmitting
              ? <><span style={{ fontSize: 16 }}>⏳</span> جارٍ الحفظ...</>
              : <><span style={{ fontSize: 16 }}>✓</span> {initial ? 'حفظ التعديلات' : 'إضافة المنتج'}</>
            }
          </button>
        </div>

      </form>
    </>
  );
}