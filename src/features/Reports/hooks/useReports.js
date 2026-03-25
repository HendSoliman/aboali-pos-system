// src/features/Reports/hooks/useReports.js
import { useState, useEffect } from 'react';
import { reportsApi } from '../../../services/api';

export default function useReports() {
  const [stats, setStats]   = useState({
    totalSales: 0, totalOrders: 0,
    avgOrderValue: 0, topProduct: '—', dailySales: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await reportsApi.getStats();
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { stats, loading };
}
