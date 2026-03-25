// src/features/Settings/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../../../services/api';

/**
 * Backend returns:
 *   GET /settings → { success, data: [ { key, value, description? }, ... ] }
 *   POST /settings/bulk → { success, message, data: [...] }
 *
 * This hook converts the key-value array → a flat object for easy form binding,
 * and converts back when saving.
 */

// ── Default fallbacks so SettingsForm always has values ──────────────────────
const DEFAULTS = {
  store_name     : 'علافة وعطارة الحاج أبو علي',
  store_address  : '',
  store_phone    : '',
  currency       : 'EGP',
  tax_rate       : '0',
  receipt_footer : 'شكراً لتعاملكم معنا',
  cashier_name   : 'الحاج أبوعلي',
};

// Convert array [{key, value}] → flat object { key: value }
const arrayToObject = (arr = []) =>
  arr.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

// Convert flat object { key: value } → array [{key, value}]
const objectToArray = (obj = {}) =>
  Object.entries(obj).map(([key, value]) => ({ key, value }));

export default function useSettings() {
  const [settings, setSettings]   = useState(DEFAULTS);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [error,    setError]      = useState(null);
  const [success,  setSuccess]    = useState(false);

  // ── Load from backend ───────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await settingsApi.getAll();
      // res = { success, data: [{key, value}, ...] }
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      // Merge with defaults so missing keys always have fallback values
      setSettings({ ...DEFAULTS, ...arrayToObject(list) });
    } catch (err) {
      setError(err.message ?? 'فشل تحميل الإعدادات');
      // Keep defaults on error so form still renders
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  // ── Save to backend ─────────────────────────────────────────────────────
  const saveSettings = useCallback(async (newSettings) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = objectToArray(newSettings);
      // POST /settings/bulk → { success, message, data: [...] }
      await settingsApi.bulkSave(payload);
      // Optimistically update local state
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
