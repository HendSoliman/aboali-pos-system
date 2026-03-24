import React from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import SalesChart from '../components/SalesChart';
import InvoiceTable from '../components/InvoiceTable';
import useReports from '../hooks/useReports';
import { formatCurrency } from '../../../utils/formatters';
import './ReportsPage.css';

const ReportsPage = () => {
  const { stats } = useReports();

  return (
    <div className="reports-page">
      <h1 className="reports-title">التقارير والإحصائيات</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <ReportCard title="إجمالي المبيعات"   value={formatCurrency(stats.totalSales)}    icon={<DollarSign size={22} />} color="green"  />
        <ReportCard title="عدد الطلبات"       value={stats.totalOrders}                    icon={<ShoppingBag size={22} />} color="blue"   />
        <ReportCard title="متوسط قيمة الطلب"  value={formatCurrency(stats.avgOrderValue)} icon={<TrendingUp  size={22} />} color="yellow" />
        <ReportCard title="أكثر منتج مبيعاً"  value={stats.topProduct}                    icon={<Users       size={22} />} color="red"    />
      </div>

      <SalesChart />
      <InvoiceTable />
    </div>
  );
};

export default ReportsPage;