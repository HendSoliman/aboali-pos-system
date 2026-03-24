import React from 'react';

const BAR_DATA = [
  { label: 'السبت', value: 1800 },
  { label: 'الأحد', value: 2400 },
  { label: 'الاثنين', value: 1600 },
  { label: 'الثلاثاء', value: 3200 },
  { label: 'الأربعاء', value: 2800 },
  { label: 'الخميس', value: 3800 },
  { label: 'الجمعة', value: 4200 },
];

const max = Math.max(...BAR_DATA.map((d) => d.value));

const SalesChart = () => (
  <div className="card p-5">
    <h3 className="font-cairo font-bold text-dark-100 mb-4">مبيعات الأسبوع</h3>
    <div className="flex items-end gap-3 h-40">
      {BAR_DATA.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-full bg-primary-600 rounded-t-lg transition-all duration-500"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <span className="font-cairo text-xs text-dark-400">{d.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SalesChart;