import apiClient from './apiClient';

// ── Products ────────────────────────────────────────────────────
export const productsApi = {
  getAll:      (search = '')      => apiClient.get(`/products${search ? `?search=${search}` : ''}`),
  getById:     (id)               => apiClient.get(`/products/${id}`),
  getByBarcode:(barcode)          => apiClient.get(`/products/barcode/${barcode}`),
  create:      (data)             => apiClient.post('/products', data),
  update:      (id, data)         => apiClient.put(`/products/${id}`, data),
  delete:      (id)               => apiClient.delete(`/products/${id}`),
};

// ── Orders ──────────────────────────────────────────────────────
export const ordersApi = {
  getAll:  (page = 0, size = 20)  => apiClient.get(`/orders?page=${page}&size=${size}`),
  getById: (id)                   => apiClient.get(`/orders/${id}`),
  create:  (data)                 => apiClient.post('/orders', data),
};

// ── Reports ─────────────────────────────────────────────────────
export const reportsApi = {
  getStats: (from, to) => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to)   params.set('to', to);
    return apiClient.get(`/reports/stats?${params}`);
  },
};

// ── Settings ────────────────────────────────────────────────────
export const settingsApi = {
  getAll:    ()          => apiClient.get('/settings'),
  bulkSave:  (settings)  => apiClient.post('/settings/bulk', settings),
};
