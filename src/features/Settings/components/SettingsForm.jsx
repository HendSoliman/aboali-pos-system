// src/features/Settings/components/SettingsForm.jsx
import React, { useState } from 'react';
import '../pages/SettingsPage.css';

const SettingsForm = ({ initial = {}, onSave }) => {
  const [form, setForm] = useState({
    storeName:    initial.storeName    || 'متجر نقاط البيع',
    phone:        initial.phone        || '',
    address:      initial.address      || '',
    taxRate:      initial.taxRate      || 15,
    autoPrint:    initial.autoPrint    ?? true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="settings-card">
      <h2 className="settings-card-title">إعدادات المتجر</h2>

      <div className="form-field">
        <label htmlFor="storeName">اسم المتجر</label>
        <input id="storeName" value={form.storeName}
          onChange={e => set('storeName', e.target.value)}
          placeholder="متجر نقاط البيع" />
      </div>

      <div className="form-field">
        <label htmlFor="phone">رقم الجوال</label>
        <input id="phone" value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+966 5xx xxx xxxx" />
      </div>

      <div className="form-field">
        <label htmlFor="address">عنوان المتجر</label>
        <input id="address" value={form.address}
          onChange={e => set('address', e.target.value)}
          placeholder="المدينة، الحي" />
      </div>

      <div className="form-field">
        <label htmlFor="taxRate">نسبة الضريبة %</label>
        <input id="taxRate" type="number" min="0" max="100" value={form.taxRate}
          onChange={e => set('taxRate', Number(e.target.value))} />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={form.autoPrint}
          onChange={e => set('autoPrint', e.target.checked)} />
        <span>طباعة الفاتورة تلقائياً</span>
      </label>

      <button type="submit" className="save-btn">حفظ الإعدادات</button>
    </form>
  );
};

export default SettingsForm;