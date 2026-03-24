import api from '../../../services/api';

const reportService = {
  getDailySales:   (date)  => api.get('/reports/daily',   { date }),
  getMonthlySales: (month) => api.get('/reports/monthly', { month }),
  getTopProducts:  ()      => api.get('/reports/top-products'),
};

export default reportService;
