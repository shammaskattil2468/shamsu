/**
 * API service for interacting with the backend MongoDB server.
 * Includes graceful fallbacks when the backend/MongoDB is offline.
 */

export const apiService = {
  // Check MongoDB connection status
  async getStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) return { status: 'disconnected', offline: true };
      return await res.json();
    } catch {
      return { status: 'disconnected', offline: true };
    }
  },

  // Fetch portfolio data from MongoDB
  async getPortfolio() {
    try {
      const res = await fetch('/api/portfolio');
      if (res.status === 404) return null; // No custom document yet
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('[API] Could not fetch from MongoDB, using local cache:', err.message);
      return null;
    }
  },

  // Save portfolio data to MongoDB
  async savePortfolio(data) {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Failed to save: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('[API] Failed to persist to MongoDB:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Reset portfolio in MongoDB
  async resetPortfolio() {
    try {
      const res = await fetch('/api/portfolio/reset', { method: 'POST' });
      return await res.json();
    } catch (err) {
      console.warn('[API] Failed to reset in MongoDB:', err.message);
      return { success: false, error: err.message };
    }
  },

  // Send a contact message to MongoDB
  async submitContactMessage(messageData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      return await res.json();
    } catch (err) {
      console.warn('[API] Could not reach backend:', err.message);
      return { success: false, offline: true };
    }
  },

  // Get messages for admin inbox
  async getMessages() {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.warn('[API] Failed to fetch messages:', err.message);
      return [];
    }
  },

  // Delete message from inbox
  async deleteMessage(id) {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};
