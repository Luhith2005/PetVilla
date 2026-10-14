import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite proxy or relative path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guest session key helper
export const getSessionKey = () => {
  let key = localStorage.getItem('petvilla_guest_session');
  if (!key) {
    key = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('petvilla_guest_session', key);
  }
  return key;
};

// Request Interceptor: Attach Auth Token or Session Key
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('petvilla_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Session-Key'] = getSessionKey();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/users/login/') &&
      !originalRequest.url?.includes('/users/token/refresh/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('petvilla_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('/api/users/token/refresh/', {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('petvilla_access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Token refresh failed, clear local auth
          localStorage.removeItem('petvilla_access_token');
          localStorage.removeItem('petvilla_refresh_token');
          localStorage.removeItem('petvilla_user');
          window.dispatchEvent(new Event('auth-expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authService = {
  login: (credentials) => api.post('/api/users/login/', credentials),
  register: (userData) => api.post('/api/users/register/', userData),
  getProfile: () => api.get('/api/users/profile/'),
  updateProfile: (data) => api.patch('/api/users/profile/', data),
  logout: (refresh) => api.post('/api/users/logout/', { refresh }),
};

export const productsService = {
  getProducts: (params) => api.get('/api/products/', { params }),
  getFeatured: () => api.get('/api/products/featured/'),
  getProductDetail: (id) => api.get(`/api/products/${id}/`),
  getCategories: () => api.get('/api/products/categories/'),
  getPetTypes: () => api.get('/api/products/pet-types/'),
};

export const cartService = {
  getCart: () => api.get('/api/cart/'),
  addItem: (productId, quantity = 1) =>
    api.post('/api/cart/items/', { product_id: productId, quantity }),
  updateQuantity: (itemId, quantity) =>
    api.patch(`/api/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`/api/cart/items/${itemId}/`),
  clearCart: () => api.delete('/api/cart/'),
};

export const ordersService = {
  createOrder: (orderData) => api.post('/api/orders/', orderData),
  getOrders: () => api.get('/api/orders/'),
  getOrderDetail: (id) => api.get(`/api/orders/${id}/`),
  cancelOrder: (id) => api.post(`/api/orders/${id}/cancel/`),
};

export const sellerService = {
  getDashboardStats: () => api.get('/api/seller/dashboard/'),
  getProducts: () => api.get('/api/seller/products/'),
  createProduct: (data) => api.post('/api/seller/products/', data),
  updateProduct: (id, data) => api.patch(`/api/seller/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/api/seller/products/${id}/`),
  getOrders: () => api.get('/api/seller/orders/'),
};

export default api;
