// src/features/Products/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../../../services/api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productsApi.getAll(search);
      setProducts(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct = async (data) => {
    const res = await productsApi.create(data);
    setProducts(prev => [...prev, res.data]);
  };

  const updateProduct = async (id, data) => {
    const res = await productsApi.update(id, data);
    setProducts(prev => prev.map(p => p.id === id ? res.data : p));
  };

  const deleteProduct = async (id) => {
    await productsApi.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return { products, search, setSearch, loading, error,
           addProduct, updateProduct, deleteProduct };
}
