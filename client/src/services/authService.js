import api from './api';

export const authService = {
  /**
   * Register a new user.
   * @returns {{ token: string, user: object }}
   */
  register: async ({ name, email, password }) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data.data; // { token, user }
  },

  /**
   * Login an existing user.
   * @returns {{ token: string, user: object }}
   */
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data; // { token, user }
  },

  /**
   * Fetch the currently authenticated user's profile.
   * @returns {object} user
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  },

  /**
   * Client-side logout — clears token from localStorage.
   * No backend call needed as JWT is stateless.
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Update the user profile details (name, email, password).
   */
  updateProfile: async ({ name, email, password }) => {
    const response = await api.put('/auth/profile', { name, email, password });
    return response.data; // { success, message, data: { user } }
  },

  /**
   * Fetch the dynamic dashboard stats, activity logs, and AI breakdowns.
   */
  getDashboardStats: async () => {
    const response = await api.get('/auth/dashboard-stats');
    return response.data; // { success, data: { metrics, aiStats, scoreHistory, recentActivity } }
  },
};
