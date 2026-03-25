
// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor: unwrap data / handle errors ──────────
apiClient.interceptors.response.use(
  (res) => res.data,          // returns { success, message, data }
  (err) => {
    const msg = err.response?.data?.message || 'حدث خطأ في الاتصال بالخادم';
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;
