import { CURRENCY } from '../config/constants';

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return `0 ${CURRENCY.symbol}`;
  return new Intl.NumberFormat('ar-EG', {
    style:    'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date));

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('ar-EG', {
    year:   'numeric', month: 'short', day: 'numeric',
    hour:   '2-digit', minute: '2-digit',
  }).format(new Date(date));

export const formatNumber = (n) =>
  new Intl.NumberFormat('ar-EG').format(n);

export const formatPercent = (n) =>
  new Intl.NumberFormat('ar-EG', { style: 'percent', maximumFractionDigits: 1 }).format(n);
