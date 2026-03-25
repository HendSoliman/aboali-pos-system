// src/features/Settings/pages/SettingsPage.jsx
import React from 'react';
import SettingsForm from '../components/SettingsForm';
import useSettings from '../hooks/useSettings';
import './SettingsPage.css';

const SettingsPage = () => {
  const { settings, saveSettings, loading, saving, error, success } = useSettings();

  if (loading) {
    return (
      <div className="settings-page">
        <h1 className="settings-title">الإعدادات</h1>
        <div style={{ fontFamily: 'Cairo', color: '#9ca3af', padding: 24 }}>
          ⏳ جاري تحميل الإعدادات...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h1 className="settings-title">الإعدادات</h1>

      {/* Success / Error banners */}
      {success && (
        <div style={{
          background: '#064e3b', border: '1px solid #10b981', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, fontFamily: 'Cairo',
          fontSize: 14, color: '#10b981'
        }}>
          ✅ تم حفظ الإعدادات بنجاح
        </div>
      )}
      {error && (
        <div style={{
          background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, fontFamily: 'Cairo',
          fontSize: 14, color: '#ef4444'
        }}>
          ⚠️ {error}
        </div>
      )}

      <SettingsForm
        initial={settings}
        onSave={saveSettings}
        saving={saving}
      />
    </div>
  );
};

export default SettingsPage;