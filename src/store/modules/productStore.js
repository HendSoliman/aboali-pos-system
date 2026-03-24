import { create } from 'zustand';
import { PRODUCTS } from '../../data/products';

const useProductStore = create((set, get) => ({
  products:   PRODUCTS,
  categories: ['all', 'مشروبات', 'وجبات', 'حلويات', 'مخبوزات', 'إضافات'],
  loading:    false,
  error:      null,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  getByCategory: (category) => {
    const { products } = get();
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  searchProducts: (query) => {
    const { products } = get();
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.includes(q) ||
        p.barcode?.includes(q) ||
        p.category.includes(q)
    );
  },
}));

export default useProductStore;
