// src/features/Products/components/ProductForm.jsx
import React, { useState } from 'react';
import styles from './ProductForm.module.css';

const CATEGORIES = ['مشروبات', 'وجبات', 'حلويات', 'سناكس', 'منوعات'];

const defaultState = {
  name:     '',
  price:    '',
  stock:    '',
  category: 'مشروبات',
  barcode:  '',
  emoji:    '🛍️',
};

const ProductForm = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial ? {
    name:     initial.name     ?? '',
    price:    initial.price    ?? '',
    stock:    initial.stock    ?? '',
    category: initial.category ?? 'مشروبات',
    barcode:  initial.barcode  ?? '',
    emoji:    initial.emoji    ?? '🛍️',
  } : defaultState);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* Row 1 – Name */}
      <div className={styles.field}>
        <label>اسم المنتج</label>
        <input
          type="text"
          placeholder="أدخل اسم المنتج"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </div>

      {/* Row 2 – Price + Stock */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label>السعر (ج.م)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>المخزون</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 3 – Category */}
      <div className={styles.field}>
        <label>الفئة</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Row 4 – Barcode */}
      <div className={styles.field}>
        <label>الباركود</label>
        <input
          type="text"
          placeholder="1234567890"
          value={form.barcode}
          onChange={(e) => set('barcode', e.target.value)}
        />
      </div>

      {/* Row 5 – Emoji */}
      <div className={styles.field}>
        <label>الإيموجي</label>
        <input
          type="text"
          placeholder="🛍️"
          value={form.emoji}
          onChange={(e) => set('emoji', e.target.value)}
          maxLength={2}
          style={{ fontSize: '22px', textAlign: 'center' }}
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          إلغاء
        </button>
        <button type="submit" className={styles.submitBtn}>
          {initial ? 'حفظ التعديلات' : 'حفظ المنتج'}
        </button>
      </div>

    </form>
  );
};

export default ProductForm;