const API_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`
});

export const api = {
  auth: {
    login: (credentials) => 
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then(res => res.json()),

    register: (userData) => 
      fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(res => res.json()),
  },

  restaurants: {
    getAll: () => fetch(`${API_URL}/restaurants`).then(res => res.json()),
  },

  admin: {
    // This is the core call for your Dashboard initialization
    getStats: async () => {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch admin data");
      return response.json();
    }
  },

  orders: {
    updateStatus: (id, data) => 
      fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      }).then(res => res.json()),
  }
};