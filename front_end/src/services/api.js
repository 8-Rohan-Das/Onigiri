import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),
  logout: () => api.post('/logout'),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  resetPassword: (email, password) => api.post('/reset-password', { email, password }),
};

// User API calls
export const userAPI = {
  getProfile: (userId) => api.get('/user/profile', { params: { userId } }),
  updateProfile: (userData) => api.put('/user/profile', userData),
  updateProfileImage: (userId, profileImage) => api.put('/user/profile', { userId, profileImage }),
  getOrderHistory: () => api.get('/user/orders'),
};

// Product API calls
export const productAPI = {
  getProducts: (category = null) => {
    const url = category ? `/products?category=${category}` : '/products';
    return api.get(url);
  },
  getProduct: (id) => api.get(`/products/${id}`),
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.delete(`/orders/${id}`),
  clearHistory: (deliveryIds, paymentIds) => api.delete('/orders/clear', { data: { deliveryIds, paymentIds } }),
};

// Delivery API calls
export const deliveryAPI = {
  createDelivery: (deliveryData) => api.post('/deliveries', deliveryData),
  getDeliveryStatus: (id) => api.get(`/deliveries/${id}/status`),
  updateStatus: (id, status) => api.patch(`/deliveries/${id}/status`, { status }),
};

// Payment API calls
export const paymentAPI = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
  getStatus: (id) => api.get(`/payments/${id}/status`),
};

export default api;
