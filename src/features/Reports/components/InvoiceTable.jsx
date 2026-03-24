import React from 'react';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

const MOCK = [
  { id: 'INV-001', date: new Date(), items: 4, total: 182.5,  method: 'نقداً' },
  { id: 'INV-002', date: new Date(), items: 2, total: 65.0,   method: 'بطاقة' },
  { id: 'INV-003', date: new Date(), items: 7, total: 430.75, method: 'نقداً' },
];

const InvoiceTable = () => (
  <div className="card overflow-hidden">
    <div className="px-5 py-3 border-b border-dark-700">
      <h3 className="font-cairo font-bold text-dark-100">آخر الفواتير</h3>
    </div>
    <table className="w-full">
      <thead>
        <tr className="bg-dark-900">
          {['رقم الفاتورة', 'التاريخ', 'المنتجات', 'الإجمالي', 'الدفع'].map((h) => (
            <th key={h} className="p-3 text-right font-cairo text-xs text-dark-400 font-bold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MOCK.map((inv) => (
          <tr key={inv.id} className="border-t border-dark-700 hover:bg-dark-700 transition-colors">
            <td className="p-3 font-cairo text-sm text-primary-400 font-bold">{inv.id}</td>
            <td className="p-3 font-cairo text-sm text-dark-300">{formatDateTime(inv.date)}</td>
            <td className="p-3 font-cairo text-sm text-dark-300">{inv.items} منتج</td>
            <td className="p-3 font-cairo text-sm font-bold text-dark-100">{formatCurrency(inv.total)}</td>
            <td className="p-3 font-cairo text-sm text-dark-300">{inv.method}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InvoiceTable;