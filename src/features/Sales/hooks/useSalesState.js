import { useSalesStore } from '../../../store/appStore';

const useSalesState = () => {
  const store = useSalesStore();

  const subtotal       = store.cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = store.discountType === 'percent'
    ? (subtotal * store.discount) / 100
    : Math.min(store.discount, subtotal);
//  const taxAmount      = (subtotal - discountAmount) * 0.15;
//  const total          = subtotal - discountAmount + taxAmount;
  const total          = subtotal - discountAmount ;
  const itemCount      = store.cartItems.reduce((s, i) => s + i.quantity, 0);
    // ── Add these alongside your existing useState declarations ──────────────────
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error,        setError]        = useState(null);

  return {
    ...store,
    subtotal,
    discountAmount,
//    taxAmount,
    total,
    itemCount,
    handleAddToCart:    store.addToCart,
    handleRemoveItem:   store.removeFromCart,
    handleUpdateQty:    store.updateQuantity,
    handleClearCart:    store.clearCart,
    handleSetDiscount:  store.setDiscount,
    handlePaymentMethod: store.setPaymentMethod,
  };
};

export default useSalesState;
