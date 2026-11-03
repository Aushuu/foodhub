// FoodHub API Service
// Connects frontend to the Express backend and MongoDB Atlas

const BASE_URL = '/api';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('foodhub_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Foods
  async getFoods(category = '', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${BASE_URL}/foods?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch foods (${res.status})`);
    }
    return await res.json();
  },

  async getFoodById(id) {
    const res = await fetch(`${BASE_URL}/foods/${id}`);
    if (!res.ok) {
      throw new Error('Food item not found');
    }
    return await res.json();
  },

  async createFood(foodData) {
    const res = await fetch(`${BASE_URL}/foods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(foodData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create food');
    return data;
  },

  async updateFood(id, foodData) {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(foodData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update food');
    return data;
  },

  async deleteFood(id) {
    const res = await fetch(`${BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete food');
    return data;
  },

  // Auth - Verified against MongoDB Atlas
  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email or password');
    return data;
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Not authenticated');
    return await res.json();
  },

  // Orders - Stored directly in MongoDB Atlas
  async createOrder(orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  },

  async getMyOrders() {
    const res = await fetch(`${BASE_URL}/orders/my`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Failed to load orders (${res.status})`);
    return await res.json();
  },

  // Admin Only: Fetch all customer orders received
  async getAllOrders() {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch orders (${res.status})`);
    return await res.json();
  },

  // Admin Only: Update order status
  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, orderStatus: status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
  }
};
