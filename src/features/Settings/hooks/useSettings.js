// src/features/Settings/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../../../services/api';

const DEFAULTS = {
  store_name     : 'علافة وعطارة الحاج أبو علي',
  store_address  : '',
  store_phone    : '',
  currency       : 'EGP',
  tax_rate       : '0',
  receipt_footer : 'شكراً لتعاملكم معنا',
  cashier_name   : 'الحاج أبوعلي',
  default_payment_method: 'CASH',   // ← add this
};

// Backend GET returns: { success, data: { store_name: "...", tax_rate: "..." } }
// OR sometimes: { success, data: [ {key, value}, ... ] }
// Handle both shapes safely
const normalizeResponse = (res) => {
  const data = res?.data ?? res;

  // Shape A: already a flat object { store_name: "...", ... }
  if (data && !Array.isArray(data) && typeof data === 'object') {
    return data;
  }

  // Shape B: array [{key, value}, ...]
  if (Array.isArray(data)) {
    return data.reduce((acc, { key, value }) => ({ ...acc, [key]: value ?? '' }), {});
  }

  return {};
};

// ✅ KEY FIX: Send a flat object { key: stringValue } to match Map<String,String>
const toFlatStringMap = (obj = {}) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = value === null || value === undefined ? '' : String(value);
    return acc;
  }, {});

export default function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await settingsApi.getAll();
      const flat = normalizeResponse(res);
      setSettings({ ...DEFAULTS, ...flat });
    } catch (err) {
      setError(err.message ?? 'فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const saveSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // ✅ Sends: { "store_name": "...", "tax_rate": "15" }
      // Matches controller: @RequestBody Map<String, String> settings
      const payload = toFlatStringMap(newSettings);
      await settingsApi.bulkSave(payload);

      setSettings(prev => ({ ...prev, ...newSettings }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message ?? 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    success,
    saveSettings,
    reloadSettings: loadSettings,
  };
}
