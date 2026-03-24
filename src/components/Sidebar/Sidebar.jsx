import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, BarChart2,
  Settings, LogOut, Zap
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/sales',    icon: ShoppingCart, label: 'المبيعات'  },
  { to: '/products', icon: Package,      label: 'المنتجات'  },
  { to: '/reports',  icon: BarChart2,    label: 'التقارير'  },
  { to: '/settings', icon: Settings,     label: 'الإعدادات' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={22} color="#10b981" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Icon size={20} />
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className={styles.bottom}>
        <button
          className={styles.logoutBtn}
          onClick={() => navigate('/')}
          title="تسجيل الخروج"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;