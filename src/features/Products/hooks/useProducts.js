import { useState } from 'react';
import { useProductStore } from '../../../store/appStore';

const useProducts = () => {
  const store = useProductStore();
  const [search, setSearch] = useState('');

  const filtered = search
    ? store.products.filter((p) => p.name.includes(search) || p.barcode?.includes(search))
    : store.products;

  return {
    products: filtered,
    categories: store.categories,
    search, setSearch,
    addProduct:    store.addProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
  };
};

export default useProducts;
