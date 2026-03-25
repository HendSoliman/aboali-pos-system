import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../../../services/api';

// ── Interceptor already did: res → res.data = ApiResponse          ─────────
// ── So awaited result is:  ApiResponse { success, message, data }  ─────────
// ── We just need one more .data to get the payload                 ─────────
const unwrap = (apiResponse) =>
  apiResponse?.data      // ApiResponse.data = actual payload
  ?? apiResponse;        // fallback if backend returns raw value

// ── Normalize API types → safe JS types ──────────────────────────────────
const normalize = (p) => ({
  ...p,
  id     : p.id,
  name   : p.name    ?? '',
  nameAr : p.nameAr  ?? p.name_ar ?? '',
  price  : parseFloat(p.price ?? 0),
  cost   : p.cost != null ? parseFloat(p.cost) : null,  // ✅ null stays null
  stock  : parseInt(p.stock ?? 0, 10),
  isLoose: p.isLoose ?? false,
  active : p.active  ?? true,
  emoji  : p.emoji   ?? '📦',
  unit   : p.unit    ?? 'قطعة',
});

// ── Build POST/PUT payload ────────────────────────────────────────────────
const toPayload = (data) => ({
  name    : data.name?.trim()     ?? '',
  nameAr  : data.nameAr?.trim()  || null,
  barcode : data.barcode?.trim() || null,
  category: data.category?.trim() || null,
  price   : parseFloat(data.price  ?? 0),
  cost    : data.cost != null && data.cost !== '' ? parseFloat(data.cost) : null,
  stock   : parseInt(data.stock ?? 0, 10),
  emoji   : data.emoji   ?? '📦',
  unit    : data.unit    ?? 'قطعة',
  isLoose : Boolean(data.isLoose),
  active  : data.active !== false,
});

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      // interceptor returns ApiResponse → unwrap() pulls .data → array
      const res  = await productsApi.getAll(query);
      const list = unwrap(res);
      setProducts(Array.isArray(list) ? list.map(normalize) : []);
    } catch (err) {
      // interceptor already extracted the message string
      setError(err.message ?? 'فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(search); }, [fetchProducts, search]);

  // ── Add ──────────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (data) => {
    const res     = await productsApi.create(toPayload(data));
    const created = normalize(unwrap(res));   // ApiResponse.data = new ProductDTO
    setProducts(prev => [created, ...prev]);
    return created;
  }, []);

  // ── Update ───────────────────────────────────────────────────────────────
  const updateProduct = useCallback(async (id, data) => {
    const res     = await productsApi.update(id, toPayload(data));
    const updated = normalize(unwrap(res));   // ApiResponse.data = updated ProductDTO
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  }, []);

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteProduct = useCallback(async (id) => {
    await productsApi.delete(id);            // ApiResponse.data = null (we ignore it)
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return { products, loading, error, search, setSearch, addProduct, updateProduct, deleteProduct };
}
