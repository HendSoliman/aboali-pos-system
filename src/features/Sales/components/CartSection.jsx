import React, { useState } from 'react';
import { ShoppingCart, Trash2, CreditCard, Banknote, ArrowUpDown } from 'lucide-react';
import CartItem from './CartItem';
import NumPad from './NumPad';
import CheckoutModal from './CheckoutModal';
import useSalesState from '../hooks/useSalesState';
import { formatCurrency } from '../../../utils/formatters';
import { PAYMENT_METHODS, PAYMENT_LABELS } from '../../../config/constants';

const CartSection = () => {
  const {
    cartItems, subtotal, discountAmount, total, itemCount,
    discount, discountType, paymentMethod,
    handleUpdateQty, handleRemoveItem, handleClearCart,
    handleSetDiscount, handlePaymentMethod,
  } = useSalesState();

  const [discountInput,  setDiscountInput]  = useState('0');
  const [isCheckoutOpen, setCheckoutOpen]   = useState(false);
  const [activeNumPad,   setActiveNumPad]   = useState(null); // 'discount' | null

  const applyDiscount = (val) => {
    setDiscountInput(val);
    handleSetDiscount(Number(val), discountType);
  };

  const paymentIcons = {
    cash:     <Banknote    size={16} />,
    card:     <CreditCard  size={16} />,
    transfer: <ArrowUpDown size={16} />,
  };

  return (
    <div className="flex flex-col h-full bg-dark-800 border-r border-dark-700"
         style={{ width: '380px', minWidth: '340px' }}>

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-primary-400" />
          <span className="font-cairo font-bold text-dark-100">
            السلة
          </span>
          {itemCount > 0 && (
            <span className="badge-green">{itemCount}</span>
          )}
        </div>
        {cartItems.length > 0 && (
          <button
            className="btn-ghost text-xs gap-1 flex items-center"
            onClick={handleClearCart}
          >
            <Trash2 size={13} />
            مسح الكل
          </button>
        )}
      </div>

      {/* ── Cart Items ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-dark-500 gap-3">
            <ShoppingCart size={48} strokeWidth={1} />
            <p className="font-cairo text-sm">السلة فارغة</p>
            <p className="font-cairo text-xs">انقر على منتج لإضافته</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemoveItem}
            />
          ))
        )}
      </div>

      {/* ── Bottom Panel ───────────────────────────── */}
      {cartItems.length > 0 && (
        <div className="border-t border-dark-700 p-4 flex flex-col gap-3">

          {/* Discount */}
          <div className="flex items-center gap-2">
            <label className="font-cairo text-sm text-dark-400 flex-shrink-0">خصم:</label>
            <input
              className="input-base flex-1 text-center"
              value={discountInput}
              readOnly
              onClick={() => setActiveNumPad(activeNumPad === 'discount' ? null : 'discount')}
              placeholder="0"
            />
            <div className="flex gap-1">
              {['fixed','percent'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSetDiscount(Number(discountInput), t)}
                  className={`btn text-xs px-2 py-1 ${
                    discountType === t ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {t === 'fixed' ? 'ج.م' : '%'}
                </button>
              ))}
            </div>
          </div>

          {/* NumPad for discount */}
          {activeNumPad === 'discount' && (
            <NumPad value={discountInput} onChange={applyDiscount} />
          )}

          {/* Totals */}
          <div className="bg-dark-900 rounded-xl p-3 flex flex-col gap-1.5">
            <Row label="المجموع الفرعي:" value={formatCurrency(subtotal)} />
            {discountAmount > 0 && (
              <Row label="الخصم:" value={`-${formatCurrency(discountAmount)}`} valueClass="text-yellow-400" />
            )}
{/*             <Row label={`ضريبة (15%):`} value={formatCurrency(taxAmount)} /> */}
            <div className="border-t border-dark-700 my-1" />
            <Row label="الإجمالي:" value={formatCurrency(total)} bold />
          </div>

          {/* Payment Method */}
          <div className="flex gap-2">
            {Object.values(PAYMENT_METHODS).map((m) => (
              <button
                key={m}
                onClick={() => handlePaymentMethod(m)}
                className={`btn flex-1 gap-1 text-xs ${
                  paymentMethod === m ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {paymentIcons[m]}
                {PAYMENT_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            className="btn-primary btn w-full text-base py-3"
            onClick={() => setCheckoutOpen(true)}
          >
            إتمام الدفع — {formatCurrency(total)}
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
};

const Row = ({ label, value, bold = false, valueClass = '' }) => (
  <div className="flex justify-between items-center">
    <span className={`font-cairo text-sm ${bold ? 'font-bold text-dark-100' : 'text-dark-400'}`}>
      {label}
    </span>
    <span className={`font-cairo text-sm ${bold ? 'font-bold text-primary-400' : 'text-dark-200'} ${valueClass}`}>
      {value}
    </span>
  </div>
);

export default CartSection;