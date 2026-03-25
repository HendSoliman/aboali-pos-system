// src/features/Reports/hooks/useReports.js
import { useState, useEffect, useCallback } from 'react';
import { reportsApi, ordersApi } from '../../../services/api';

// ── Sensible defaults so components never crash on null ───────────────────────
const EMPTY_STATS = {
  totalSales   : 0,
  totalOrders  : 0,
  avgOrderValue: 0,
  topProduct   : '—',
  dailySales   : [],   // [{ date: '2026-03-20', total: 320.5 }, ...]
};

// Helper: today and 7 days ago as ISO date strings (YYYY-MM-DD)
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export default function useReports() {
  const [stats,   setStats]   = useState(EMPTY_STATS);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Date range — default: last 7 days
  const [dateFrom, setDateFrom] = useState(daysAgoISO(7));
  const [dateTo,   setDateTo]   = useState(todayISO());

  // ── Fetch stats from /reports/stats?from=&to= ─────────────────────────────
  const fetchStats = useCallback(async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        reportsApi.getStats(from, to),
        ordersApi.getAll(0, 10),  // latest 10 orders for the table
      ]);

      // statsRes = { success, data: { totalSales, totalOrders, avgOrderValue, topProduct, dailySales } }
      const s = statsRes?.data ?? statsRes ?? {};
      setStats({
        totalSales   : s.totalSales    ?? 0,
        totalOrders  : s.totalOrders   ?? 0,
        avgOrderValue: s.avgOrderValue ?? 0,
        topProduct   : s.topProduct    ?? '—',
        dailySales   : Array.isArray(s.dailySales) ? s.dailySales : [],
      });

      // ordersRes = { success, data: { content: [...], totalPages, totalElements } }
      //          OR { success, data: [...] }  depending on backend
      const raw = ordersRes?.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.content)
          ? raw.content
          : [];
      setOrders(list);

    } catch (err) {
      setError(err.message ?? 'فشل تحميل التقارير');
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever date range changes
  useEffect(() => {
    fetchStats(dateFrom, dateTo);
  }, [dateFrom, dateTo, fetchStats]);

  return {
    stats,
    orders,
    loading,
    error,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    refresh: () => fetchStats(dateFrom, dateTo),
  };
}
