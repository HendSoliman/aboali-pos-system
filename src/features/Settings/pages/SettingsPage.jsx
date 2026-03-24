// src/features/Settings/pages/SettingsPage.jsx
import React from 'react';
import SettingsForm from '../components/SettingsForm';
import useSettings from '../hooks/useSettings';
import './SettingsPage.css';

const SettingsPage = () => {
  const { settings, saveSettings } = useSettings();

  return (
    <div className="settings-page">
      <h1 className="settings-title">الإعدادات</h1>
      <SettingsForm initial={settings} onSave={saveSettings} />
    </div>
  );
};

export default SettingsPage;