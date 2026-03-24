import React from 'react';

const ReportCard = ({ title, value, icon, color = 'green' }) => {
  const colors = {
    green:  'text-primary-400 bg-primary-900/30',
    blue:   'text-blue-400   bg-blue-900/30',
    yellow: 'text-yellow-400 bg-yellow-900/30',
    red:    'text-red-400    bg-red-900/30',
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="font-cairo text-sm text-dark-400">{title}</p>
        <p className="font-cairo text-2xl font-bold text-dark-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default ReportCard;