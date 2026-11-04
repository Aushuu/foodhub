// FoodHub API Service
// Connects frontend to the Express backend and MongoDB Atlas
import { INITIAL_FOODS } from './foodData';

const BASE_URL = '/api';
const ORDERS_STORAGE_KEY = 'foodhub_stored_orders';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('foodhub_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Local storage orders persistence helpers
export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const storeOrderLocally = (order) => {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter((o) => o._id !== order._id)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to store order locally:', e);
  }
};

export const updateStoredOrderStatus = (orderId, newStatus) => {
  try {
    const existing = getStoredOrders();
    const updated = existing.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update local order status:', e);
  }
};

export const api = {
  // Foods
  async getFoods(category = '', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    try {
      const res = await fetch(`${BASE_URL}/foods?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('API getFoods network issue, using fallback data:', err);
    }

    // High reliability fallback: Filter INITIAL_FOODS locally
    let list = [...INITIAL_FOODS];
    if (category && category !== 'all') {
      list = list.filter((f) => f.category && f.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getFoodById(id) {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) return data;
      }
    } catch (err) {
      console.warn('API getFoodById failed, checking fallback catalog:', err);
    }

    const item = INITIAL_FOODS.find((f) => (f._id || f.id) === id || f.name.toLowerCase() === id.toLowerCase());
    if (item) return item;
    throw new Error('Food item not found');
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

  // Orders - Stored in MongoDB Atlas with client persistence fallback
  async createOrder(orderData) {
    // Generate valid 24-character hexadecimal ID for universal compatibility
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fallbackOrder = {
      _id: randomHex,
      ...orderData,
      orderStatus: orderData.orderStatus || 'Placed',
      estimatedDeliveryMinutes: 28,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const data = await res.json();
        storeOrderLocally(data);
        return data;
      }
    } catch (err) {
      console.warn('API createOrder remote network error, saving order locally:', err);
    }

    // Always ensure the order is saved locally so the user can immediately track it
    storeOrderLocally(fallbackOrder);
    return fallbackOrder;
  },

  async getMyOrders(email = '') {
    const localOrders = getStoredOrders();
    try {
      let url = `${BASE_URL}/orders/my`;
      if (email) url += `?email=${encodeURIComponent(email)}`;

      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const serverOrders = await res.json();
        if (Array.isArray(serverOrders)) {
          // Merge server orders and local orders
          const combined = [...serverOrders];
          const serverIds = new Set(serverOrders.map((o) => o._id?.toString()));
          for (const lo of localOrders) {
            if (!serverIds.has(lo._id?.toString())) {
              combined.push(lo);
            }
          }
          combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return combined;
        }
      }
    } catch (err) {
      console.warn('API getMyOrders failed, returning local orders:', err);
    }
    return localOrders;
  },

  // Admin Only: Fetch all customer orders received
  async getAllOrders() {
    const localOrders = getStoredOrders();
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const serverOrders = await res.json();
        if (Array.isArray(serverOrders)) {
          const combined = [...serverOrders];
          const serverIds = new Set(serverOrders.map((o) => o._id?.toString()));
          for (const lo of localOrders) {
            if (!serverIds.has(lo._id?.toString())) {
              combined.push(lo);
            }
          }
          combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          return combined;
        }
      }
    } catch (err) {
      console.warn('API getAllOrders failed, using local orders cache:', err);
    }
    return localOrders;
  },

  // Update order status (Customer Live simulation or Admin Kitchen updates)
  async updateOrderStatus(orderId, status) {
    updateStoredOrderStatus(orderId, status);
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ orderId, orderStatus: status })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API updateOrderStatus server error, updated locally:', err);
    }
    return { _id: orderId, orderStatus: status };
  }
};
