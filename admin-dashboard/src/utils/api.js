import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats/'),
  
  // Users
  getUsers: (params) => api.get('/admin/users/', { params }),
  getUsersByRole: (role) => api.get('/admin/users/by_role/', { params: { role } }),
  suspendUser: (userId) => api.post(`/admin/users/${userId}/suspend/`),
  activateUser: (userId) => api.post(`/admin/users/${userId}/activate/`),
  
  // Restaurant Requests
  getRestaurantRequests: () => api.get('/admin/restaurant-requests/'),
  approveRestaurant: (requestId) => api.post(`/admin/restaurant-requests/${requestId}/approve/`),
  rejectRestaurant: (requestId, reason) => api.post(`/admin/restaurant-requests/${requestId}/reject/`, { reason }),
  
  // Restaurants
  getRestaurants: (params) => api.get('/admin/restaurants/', { params }),
  toggleRestaurant: (restaurantId) => api.post(`/admin/restaurants/${restaurantId}/toggle_open/`),
  suspendRestaurant: (restaurantId) => api.post(`/admin/restaurants/${restaurantId}/suspend/`),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders/', { params }),
  getPendingOrders: () => api.get('/admin/orders/pending_orders/'),
  getOrderSummary: () => api.get('/admin/orders/summary/'),
  
  // Payments
  getPayments: (params) => api.get('/admin/payments/', { params }),
  getPaymentsByMethod: (method) => api.get('/admin/payments/by_method/', { params: { method } }),
  
  // Reports
  getRevenueReport: (days = 30) => api.get('/admin/revenue-report/', { params: { days } }),
  
  // Delivery Agents
  getDeliveryAgentApprovals: () => api.get('/admin/delivery-agents/approvals/'),
  approveDeliveryAgent: (agentId) => api.post('/admin/delivery-agents/approvals/', { agent_id: agentId }),
};

export default api;
