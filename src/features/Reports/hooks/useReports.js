import { useState } from 'react';
import { PRODUCTS } from '../../../data/products';

const useReports = () => {
  const [period, setPeriod] = useState('daily');

  const stats = {
    totalSales:    12540,
    totalOrders:   87,
    avgOrderValue: 144.13,
    topProduct:    PRODUCTS[0].name,
  };

  return { stats, period, setPeriod };
};

export default useReports;
