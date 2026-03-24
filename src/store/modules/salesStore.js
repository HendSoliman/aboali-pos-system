import { create } from 'zustand';
import { TAX_RATE } from '../../config/constants';

const useSalesStore = create((set, get) => ({
  /* ── State ─────────────────────────────────────── */
  cartItems:     [],
  discount:      0,
  discountType:  'fixed',   // 'fixed' | 'percent'
  paymentMethod: 'cash',
  customerNote:  '',

  /* ── Derived Getters ────────────────────────────── */
  get subtotal() {
    return get().cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  },
  get discountAmount() {
    const { discount, discountType } = get();
    const sub = get().subtotal;
    return discountType === 'percent'
      ? (sub * discount) / 100
      : Math.min(discount, sub);
  },
//  get taxAmount() {
//    return (get().subtotal - get().discountAmount) * TAX_RATE;
//  },
  get total() {
//    return get().subtotal - get().discountAmount + get().taxAmount;
    return get().subtotal - get().discountAmount ;
  },
  get itemCount() {
    return get().cartItems.reduce((sum, i) => sum + i.quantity, 0);
  },

  /* ── Actions ────────────────────────────────────── */
  addToCart: (product) => {
    set((state) => {
      const existing = state.cartItems.find((i) => i.id === product.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        cartItems: [...state.cartItems, { ...product, quantity: 1 }],
      };
    });
  },

  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) { get().removeFromCart(id); return; }
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () =>
    set({ cartItems: [], discount: 0, customerNote: '' }),

  setDiscount: (value, type = 'fixed') =>
    set({ discount: Math.max(0, Number(value)), discountType: type }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setCustomerNote:  (note)   => set({ customerNote: note }),
}));

export default useSalesStore;
