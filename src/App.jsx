// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { themes } from './styles/themes';
import MainLayout from './layouts/MainLayout';
import SalesPage from './features/Sales/pages/SalesPage';
import ProductManagementPage from './features/Products/pages/ProductManagementPage';
import ReportsPage from './features/Reports/pages/ReportsPage';
import SettingsPage from './features/Settings/pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Applies CSS vars to :root whenever theme changes
function ThemeApplier({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    const vars = themes[theme];
    if (!vars) return;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [theme]);

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeApplier>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/sales" replace />} />
              <Route path="sales"    element={<SalesPage />} />
              <Route path="products" element={<ProductManagementPage />} />
              <Route path="reports"  element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ThemeApplier>
    </ThemeProvider>
  );
}