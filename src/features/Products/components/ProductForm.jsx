import React, { useState } from 'react';
import styles from './ProductForm.module.css';

// ─── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = ['مشروبات', 'وجبات', 'حلويات', 'سناكس', 'منوعات'];
const UNITS      = ['قطعة', 'كيلو', 'جرام', 'لتر', 'علبة', 'حبة', 'طبق'];
const EMOJIS     = ['🛍️','🥤','🍔','🍰','🍿','🧃','🍕','🍜','☕','🧁','🥗','🍱'];

// ─── The Missing Helper Function ───────────────────────────────────────────
const makeDefault = (initial) => ({
  nameAr  : initial?.nameAr   ?? '', // Will map to Arabic Name column
  name    : initial?.name     ?? '', // Will map to English Name column
  price   : initial?.price    ?? '',
  cost    : initial?.cost     ?? '',
  stock   : initial?.stock    ?? '',
  category: initial?.category ?? 'مشروبات',
  barcode : initial?.barcode  ?? '',
  emoji   : initial?.emoji    ?? '🛍️',
  unit    : initial?.unit     ?? 'قطعة',
  isLoose : initial?.isLoose  ?? false,
  active  : initial?.active   ?? true,
});

export default function ProductForm({ initial, onSubmit, onCancel, isSubmitting }) {
  // Now makeDefault is defined and can be called here
  const [form, setForm] = useState(() => makeDefault(initial));
  const [showEmojiPicker, setEmojiPicker] = useState(false);

  const set    = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggle = (key)      => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>

      {/* IDENTITY & CATEGORY */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>📦 بيانات التعريف والتصنيف</span>

       {/* Arabic Name Input (Matches name_ar in DB) */}
<div className={styles.field} style={{ gridColumn: 'span 2' }}>
  <label className={styles.label}>اسم المنتج (عربي) <span className={styles.required}>*</span></label>
<input
  className={styles.input}
  type="text"
  placeholder="مثال: مكرونة قلم"
  value={form.nameAr}
  required
  onChange={(e) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      nameAr: val,
      // This line forces the English 'name' to match 'nameAr' as you type
      name: val
    }));
  }}
/>
</div>

{/* English Name Input (Matches name in DB) */}
<div className={styles.field}>
  <label className={styles.label}>الاسم بالإنجليزية</label>
  <input
    className={styles.input}
    style={{ direction: 'ltr' }}
    type="text"
    placeholder="e.g. Penne Pasta"
    value={form.name} // Use name here
    onChange={e => set('name', e.target.value)}
  />
</div>

        <div className={styles.field}>
          <label className={styles.label}>الفئة</label>
          <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>أيقونة / باركود</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className={styles.emojiBtn} onClick={() => setEmojiPicker(!showEmojiPicker)}>
              {form.emoji}
            </button>
            <input className={styles.input} style={{ direction: 'ltr' }}
              type="text" placeholder="Barcode" value={form.barcode}
              onChange={e => set('barcode', e.target.value)} />
          </div>
          {showEmojiPicker && (
            <div className={styles.emojiPicker} style={{
                position: 'absolute', background: '#fff', border: '1px solid #ccc',
                zIndex: 100, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '5px'
            }}>
              {EMOJIS.map(em => (
                <span key={em} className={styles.emojiOption} onClick={() => { set('emoji', em); setEmojiPicker(false); }}>
                  {em}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRICING & STOCK */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>💰 المالية والمخزون</span>

        <div className={styles.field}>
          <label className={styles.label}>سعر البيع</label>
          <input className={`${styles.input} ${styles.priceInput}`} type="number" step="0.01"
            value={form.price} required onChange={e => set('price', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>الكمية</label>
          <input className={styles.input} type="number"
            value={form.stock} required onChange={e => set('stock', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>التكلفة</label>
          <input className={styles.input} type="number" step="0.01"
            value={form.cost} onChange={e => set('cost', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>الوحدة</label>
          <select className={styles.select} value={form.unit} onChange={e => set('unit', e.target.value)}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* TOGGLES */}
      <div className={styles.toggleContainer}>
        <button type="button"
                className={`${styles.toggleBtn} ${form.isLoose ? styles.toggleBtnActive : ''}`}
                onClick={() => toggle('isLoose')}>
          <div className={`${styles.toggleTrack} ${form.isLoose ? styles.toggleTrackActive : ''}`}>
            <div className={`${styles.toggleKnob} ${form.isLoose ? styles.toggleKnobActive : ''}`} />
          </div>
          <span className={styles.label}>بيع بالوزن</span>
        </button>

        <button type="button"
                className={`${styles.toggleBtn} ${form.active ? styles.toggleBtnActive : ''}`}
                onClick={() => toggle('active')}>
          <div className={`${styles.toggleTrack} ${form.active ? styles.toggleTrackActive : ''}`}>
            <div className={`${styles.toggleKnob} ${form.active ? styles.toggleKnobActive : ''}`} />
          </div>
          <span className={styles.label}>تفعيل</span>
        </button>
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>تراجع</button>
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'جاري...' : (initial ? 'تحديث' : 'إضافة')}
        </button>
      </div>
    </form>
  );
}