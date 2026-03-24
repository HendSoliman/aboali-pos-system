import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import styles from './ProductTable.module.css';

const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          {['المنتج', 'الفئة', 'السعر', 'المخزون', 'الباركود', 'إجراءات'].map((h) => (
            <th key={h} className={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className={styles.tr}>
            <td className={styles.td}>
              <span className="ml-2">{p.emoji}</span>{p.name}
            </td>
            <td className={styles.td}><span className="badge-blue">{p.category}</span></td>
            <td className={styles.td}>{formatCurrency(p.price)}</td>
            <td className={styles.td}>
              <span className={p.stock <= 5 ? 'badge-red' : 'badge-green'}>{p.stock}</span>
            </td>
            <td className={styles.td}><code className="text-xs text-dark-400">{p.barcode}</code></td>
            <td className={styles.td}>
              <div className="flex gap-2">
                <button className="btn-ghost p-1.5 rounded-lg" onClick={() => onEdit(p)}>
                  <Edit2 size={14} />
                </button>
                <button className="btn-ghost p-1.5 rounded-lg text-red-500 hover:text-red-400" onClick={() => onDelete(p.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductTable;