import apiClient from './apiClient';

// ── Products ──────────────────────────────────────────────────────────────
// baseURL = http://localhost:8080/api/v1  →  full URL = /api/v1/products ✅
export const productsApi = {
  getAll:      (search = '') => apiClient.get(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById:     (id)          => apiClient.get(`/products/${id}`),
  getByBarcode:(barcode)     => apiClient.get(`/products/barcode/${barcode}`),
  create:      (data)        => apiClient.post('/products', data),
  update:      (id, data)    => apiClient.put(`/products/${id}`, data),
  delete:      (id)          => apiClient.delete(`/products/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll:  (page = 0, size = 20) => apiClient.get(`/orders?page=${page}&size=${size}`),
  getById: (id)                  => apiClient.get(`/orders/${id}`),
  create:  (data)                => apiClient.post('/orders', data),
};

// ── Reports ───────────────────────────────────────────────────────────────
export const reportsApi = {
  getStats: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to)   params.set('to',   to);
    return apiClient.get(`/reports/stats?${params}`);
  },
};

// ── Settings ──────────────────────────────────────────────────────────────
export const settingsApi = {
  // interceptor already returns ApiResponse → .data is the settings object
  getAll: () => apiClient.get('/settings').then(r => r.data),

  bulkSave: (settings) =>
    apiClient.post(
      '/settings/bulk',
      Object.fromEntries(
        Object.entries(settings).map(([k, v]) => [
          k,
          v === null || v === undefined ? '' : String(v),
        ])
      )
    ).then(r => r.data),
};
