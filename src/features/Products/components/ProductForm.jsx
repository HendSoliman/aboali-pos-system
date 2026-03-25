import React, { useState } from 'react';
import styles from './ProductForm.module.css';

const CATEGORIES = ['مشروبات', 'وجبات', 'حلويات', 'سناكس', 'منوعات'];
const UNITS      = ['قطعة', 'كيلو', 'جرام', 'لتر', 'علبة', 'حبة', 'طبق'];
const EMOJIS     = ['🛍️','🥤','🍔','🍰','🍿','🧃','🍕','🍜','☕','🧁','🥗','🍱'];

const makeDefault = (initial) => ({
  name    : initial?.name     ?? '',
  nameAr  : initial?.nameAr   ?? '',
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
  const [form, setForm] = useState(() => makeDefault(initial));
  const [showEmojiPicker, setEmojiPicker] = useState(false);

  const set    = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggle = (key)      => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* IDENTITY SECTION */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>📦 بيانات التعريف</span>
        <div className={styles.field}>
          <label className={styles.label}>اسم المنتج (عربي) <span className={styles.required}>*</span></label>
          <input className={styles.input} type="text" placeholder="مثال: عصير برتقال طبيعي"
            value={form.name} required onChange={e => set('name', e.target.value)} />
        </div>

        <div className={styles.row} style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className={styles.field}>
            <label className={styles.label}>الاسم بالإنجليزية</label>
            <input className={styles.input} style={{ direction: 'ltr' }}
              type="text" placeholder="Orange Juice" value={form.nameAr}
              onChange={e => set('nameAr', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>الباركود</label>
            <input className={styles.input} style={{ direction: 'ltr' }}
              type="text" placeholder="00000000" value={form.barcode}
              onChange={e => set('barcode', e.target.value)} />
          </div>
        </div>
      </div>

      {/* PRICING & STOCK */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>💰 المالية والمخزون</span>
        <div className={styles.row} style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className={styles.field}>
            <label className={styles.label}>سعر البيع</label>
            <input className={`${styles.input} ${styles.priceInput}`} type="number" step="0.01"
              value={form.price} required onChange={e => set('price', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>سعر التكلفة</label>
            <input className={styles.input} type="number" step="0.01"
              value={form.cost} onChange={e => set('cost', e.target.value)} />
          </div>
        </div>

        <div className={styles.row} style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className={styles.field}>
            <label className={styles.label}>الكمية المتوفرة</label>
            <input className={styles.input} type="number"
              value={form.stock} required onChange={e => set('stock', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>وحدة القياس</label>
            <select className={styles.select} value={form.unit} onChange={e => set('unit', e.target.value)}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* APPEARANCE */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>🎨 العرض والتصنيف</span>
        <div className={styles.row} style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className={styles.field}>
            <label className={styles.label}>الفئة</label>
            <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>أيقونة</label>
            <div className={styles.emojiContainer}>
              <button type="button" className={styles.emojiBtn} onClick={() => setEmojiPicker(!showEmojiPicker)}>
                {form.emoji}
              </button>
              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  {EMOJIS.map(em => (
                    <span key={em} className={styles.emojiOption} onClick={() => { set('emoji', em); setEmojiPicker(false) }}>
                      {em}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          <div>
            <div className={styles.label} style={{ color: form.isLoose ? '#10b981' : '#f3f4f6', fontWeight: 700 }}>بيع بالوزن</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>ميزان إلكتروني</div>
          </div>
        </button>

        <button type="button"
                className={`${styles.toggleBtn} ${form.active ? styles.toggleBtnActive : ''}`}
                onClick={() => toggle('active')}>
          <div className={`${styles.toggleTrack} ${form.active ? styles.toggleTrackActive : ''}`}>
            <div className={`${styles.toggleKnob} ${form.active ? styles.toggleKnobActive : ''}`} />
          </div>
          <div>
            <div className={styles.label} style={{ color: form.active ? '#10b981' : '#f3f4f6', fontWeight: 700 }}>تفعيل المنتج</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>ظهور في الكاشير</div>
          </div>
        </button>
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>تراجع</button>
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'جاري الحفظ...' : (initial ? 'تحديث البيانات' : 'إضافة للمخزن')}
        </button>
      </div>
    </form>
  );
}