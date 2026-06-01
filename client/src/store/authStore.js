import { create } from 'zustand';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true, // true on init so ProtectedRoute waits

  // ── Internal helpers ──────────────────────────────────────
  _setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  // ── Initialize — called once on app mount ─────────────────
  // Checks if a token exists and fetches user profile.
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false, isAuthenticated: false, user: null });
      return;
    }
    try {
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      // Token invalid or expired — clear everything
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },

  // ── Register ──────────────────────────────────────────────
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { token, user } = await authService.register({
        name,
        email,
        password,
      });
      get()._setToken(token);
      set({ user, isAuthenticated: true, loading: false });
      toast.success('Account created! Welcome aboard 🎉');
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      return { success: false, message };
    }
  },

  // ── Login ─────────────────────────────────────────────────
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { token, user } = await authService.login({ email, password });
      get()._setToken(token);
      set({ user, isAuthenticated: true, loading: false });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      return { success: true };
    } catch (error) {
      set({ loading: false });
      const message = error.response?.data?.message || 'Login failed.';
      toast.error(message);
      return { success: false, message };
    }
  },

  // ── Fetch Profile ─────────────────────────────────────────
  fetchProfile: async () => {
    try {
      const user = await authService.getProfile();
      set({ user, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, loading: false });
    toast.success('Logged out successfully.');
  },
}));

export default useAuthStore;
