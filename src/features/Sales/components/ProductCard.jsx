import React from 'react';
import styles from './ProductCard.module.css';
import { formatCurrency } from '../../../utils/formatters';

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}
      onClick={() => !isOutOfStock && onAddToCart(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && !isOutOfStock && onAddToCart(product)}
    >
      {/* Emoji / Image */}
      <div className={styles.imageWrapper}>
        <span className={styles.emoji}>{product.emoji || '📦'}</span>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.category}>{product.category}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          <span className={`${styles.stock} ${product.stock <= 5 ? styles.lowStock : ''}`}>
            {isOutOfStock ? 'نفد' : `${product.stock}`}
          </span>
        </div>
      </div>

      {isOutOfStock && <div className={styles.overlay}>نفد المخزون</div>}
    </div>
  );
};

export default ProductCard;