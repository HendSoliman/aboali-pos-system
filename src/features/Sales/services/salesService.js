import api from '../../../services/api';

const salesService = {
  createInvoice:    (data)       => api.post('/invoices', data),
  getInvoices:      (params)     => api.get('/invoices', params),
  getInvoiceById:   (id)         => api.get(`/invoices/${id}`),
  getDailySummary:  ()           => api.get('/invoices/summary/daily'),
};

export default salesService;
