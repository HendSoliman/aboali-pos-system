import React, { useState } from 'react';
import { Button } from '../../../components';
import { validateProduct } from '../../../utils/validators';

const EMPTY = { name: '', category: '', price: '', stock: '', barcode: '', emoji: '' };

const ProductForm = ({ initial = EMPTY, onSubmit, onCancel }) => {
  const [form,   setForm]   = useState(initial);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateProduct(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  const Field = ({ label, id, ...props }) => (
    <div className="flex flex-col gap-1">
      <label className="font-cairo text-sm text-dark-400">{label}</label>
      <input id={id} className={`input-base ${errors[id] ? 'border-red-500' : ''}`} {...props} />
      {errors[id] && <span className="text-xs text-red-400">{errors[id]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="اسم المنتج *" id="name" value={form.name}
        onChange={(e) => set('name', e.target.value)} placeholder="أدخل اسم المنتج" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="السعر *" id="price" type="number" value={form.price}
          onChange={(e) => set('price', e.target.value)} placeholder="0.00" min="0" step="0.01" />
        <Field label="المخزون *" id="stock" type="number" value={form.stock}
          onChange={(e) => set('stock', e.target.value)} placeholder="0" min="0" />
      </div>
      <Field label="الفئة" id="category" value={form.category}
        onChange={(e) => set('category', e.target.value)} placeholder="مثال: مشروبات" />
      <div className="grid grid-cols-2 gap-4">
        <Field label="الباركود" id="barcode" value={form.barcode}
          onChange={(e) => set('barcode', e.target.value)} placeholder="1234567890" />
        <Field label="الإيموجي" id="emoji" value={form.emoji}
          onChange={(e) => set('emoji', e.target.value)} placeholder="☕" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" fullWidth onClick={onCancel} type="button">إلغاء</Button>
        <Button variant="primary" fullWidth type="submit">حفظ المنتج</Button>
      </div>
    </form>
  );
};

export default ProductForm;