const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = {
  async getStatus() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Failed to fetch status');
    }
    return response.json();
  },

  async processRequest() {
    const response = await fetch(`${API_BASE_URL}/process`);
    if (!response.ok) {
      throw new Error('Failed to process request');
    }
    return response.json();
  },

  async unstableRequest() {
    const response = await fetch(`${API_BASE_URL}/unstable`);
    if (!response.ok) {
      const error = new Error('Unstable API failed');
      error.status = response.status;
      throw error;
    }
    return response.json();
  },

  async getData(itemId) {
    const response = await fetch(`${API_BASE_URL}/data/${itemId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  },

  // New: fetch car details by name (external endpoint)
  async getCarDetailsByName(name) {
    const encoded = encodeURIComponent(name);
    const response = await fetch(`http://98.130.85.46:8000/getCarDetailsByName/${encoded}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }
    return response.json();
  }
};

export default api;
