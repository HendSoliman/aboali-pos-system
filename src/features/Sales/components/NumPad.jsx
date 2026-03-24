import React from 'react';
import { Delete } from 'lucide-react';

const KEYS = ['7','8','9','4','5','6','1','2','3','.',  '0','⌫'];

const NumPad = ({ value = '', onChange }) => {
  const handleKey = (key) => {
    if (key === '⌫') {
      onChange(value.slice(0, -1) || '0');
    } else if (key === '.' && value.includes('.')) {
      return;
    } else {
      const next = value === '0' ? key : value + key;
      onChange(next);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((k) => (
        <button
          key={k}
          onClick={() => handleKey(k)}
          className={`
            h-12 rounded-xl font-cairo font-bold text-lg
            transition-all duration-150 select-none
            ${k === '⌫'
              ? 'bg-red-900 hover:bg-red-700 text-red-300'
              : 'bg-dark-700 hover:bg-dark-600 text-dark-100 active:scale-95'
            }
          `}
        >
          {k === '⌫' ? <Delete size={18} className="mx-auto" /> : k}
        </button>
      ))}
    </div>
  );
};

export default NumPad;