// src/features/Reports/pages/ReportsPage.jsx
import React from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import SalesChart from '../components/SalesChart';
import InvoiceTable from '../components/InvoiceTable';
import useReports from '../hooks/useReports';
import { formatCurrency } from '../../../utils/formatters';
import './ReportsPage.css';

const STAT_CARDS = (stats) => [
  { title: 'إجمالي المبيعات',  value: formatCurrency(stats.totalSales),    icon: DollarSign, color: 'green'  },
  { title: 'عدد الطلبات',      value: stats.totalOrders,                    icon: ShoppingBag, color: 'blue'  },
  { title: 'متوسط قيمة الطلب', value: formatCurrency(stats.avgOrderValue), icon: TrendingUp,  color: 'yellow' },
  { title: 'أكثر منتج مبيعاً', value: stats.topProduct,                    icon: Users,       color: 'red'   },
];

const ReportsPage = () => {
  const { stats } = useReports();

  return (
    <div className="reports-page">
      <h1 className="reports-title">التقارير والإحصائيات</h1>

      {/* Stat Cards */}
      <div className="stats-grid">
        {STAT_CARDS(stats).map(({ title, value, icon: Icon, color }) => (
          <div key={title} className="stat-card">
            <div className={`stat-icon ${color}`}>
              <Icon size={20} />
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <div className="chart-title">مبيعات الأسبوع</div>
        <SalesChart />
      </div>

      {/* Invoice Table */}
      <div className="invoice-wrapper">
        <div className="invoice-header">آخر الفواتير</div>
        <InvoiceTable />
      </div>
    </div>
  );
};

export default ReportsPage;