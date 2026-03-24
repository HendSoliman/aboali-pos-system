import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import styles from './CartItem.module.css';
import { formatCurrency } from '../../../utils/formatters';

const CartItem = ({ item, onUpdateQty, onRemove }) => (
  <div className={styles.item}>
    <div className={styles.emoji}>{item.emoji || '📦'}</div>
    <div className={styles.details}>
      <p className={styles.name}>{item.name}</p>
      <p className={styles.unitPrice}>{formatCurrency(item.price)} × {item.quantity}</p>
    </div>
    <div className={styles.controls}>
      <div className={styles.qtyControls}>
        <button
          className={styles.qtyBtn}
          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
        >
          <Minus size={12} />
        </button>
        <span className={styles.qty}>{item.quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
        >
          <Plus size={12} />
        </button>
      </div>
      <p className={styles.totalPrice}>{formatCurrency(item.price * item.quantity)}</p>
      <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

export default CartItem;