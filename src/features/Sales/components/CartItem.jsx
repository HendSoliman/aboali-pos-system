import React from 'react';
import { Minus, Plus, Trash2, Pencil } from 'lucide-react';
import styles from './CartItem.module.css';
import { formatCurrency } from '../../../utils/formatters';

// ─── Loose Item Row ────────────────────────────────────────────────────────────
const LooseCartItem = ({ item, onEditLoose, onRemove }) => (
  <div className={styles.item}>
    {/* Emoji */}
    <div className={styles.emoji}>{item.emoji || '⚖️'}</div>

    {/* Details */}
    <div className={styles.details}>
      <p className={styles.name}>{item.name}</p>
      <p className={styles.unitPrice}>
        <span className={styles.looseBadge}>بالوزن</span>
        {item.quantity} {item.unitLabel ?? 'كجم'}
        &nbsp;×&nbsp;
        {formatCurrency(item.price)}
      </p>
    </div>

    {/* Controls */}
    <div className={styles.controls}>
      {/* Edit weight button — reopens the LooseProductModal */}
      <button
        className={styles.editBtn}
        onClick={() => onEditLoose(item)}
        title="تعديل الوزن"
      >
        <Pencil size={13} />
      </button>

      {/* Line total */}
      <p className={styles.totalPrice}>
        {formatCurrency(item.price * item.quantity)}
      </p>

      {/* Remove */}
      <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ─── Fixed Item Row ────────────────────────────────────────────────────────────
const FixedCartItem = ({ item, onUpdateQty, onRemove }) => (
  <div className={styles.item}>
    <div className={styles.emoji}>{item.emoji || '📦'}</div>

    <div className={styles.details}>
      <p className={styles.name}>{item.name}</p>
      <p className={styles.unitPrice}>
        {formatCurrency(item.price)} × {item.quantity}
      </p>
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

      <p className={styles.totalPrice}>
        {formatCurrency(item.price * item.quantity)}
      </p>

      <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ─── Main Export — picks the right row ────────────────────────────────────────
const CartItem = ({ item, onUpdateQty, onRemove, onEditLoose }) => {
  if (item.isLoose) {
    return (
      <LooseCartItem
        item={item}
        onEditLoose={onEditLoose}
        onRemove={onRemove}
      />
    );
  }

  return (
    <FixedCartItem
      item={item}
      onUpdateQty={onUpdateQty}
      onRemove={onRemove}
    />
  );
};

export default CartItem;