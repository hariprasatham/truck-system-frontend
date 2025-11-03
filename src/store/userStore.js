import { create } from 'zustand';
import api from "../API/api"

const useUserStore = create((set, get) => ({
  // State
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  loading: false,
  error: null,
  globalLoading: false,

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!get().token;
  },

    setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),


  // Set user data
  setUser: (user) => {
    set({ user, error: null });
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  // Set authentication tokens
  setAuthTokens: ({ access_token, refresh_token }) => {
    set({ 
      token: access_token,
      refreshToken: refresh_token,
      error: null 
    });
    
    try {
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      } else {
        localStorage.removeItem('access_token');
      }
      
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      } else {
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.error('Error saving tokens to localStorage:', error);
    }
  },

  // Login user
  login: async (credentials) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, access_token, refresh_token } = response.data.results;
      
      // Update state and storage
      set({ user, loading: false, globalLoading: false   });
      get().setAuthTokens({ access_token, refresh_token });
      
      // Save user data last to ensure tokens are set first
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
      
      return response.data;
    } catch (error) {
        console.log("error",error)
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Attempt to call the logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all auth data
      set({ 
        user: null, 
        token: null, 
        refreshToken: null, 
        error: null 
      });
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Fetch current user profile
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      set({ user, loading: false });
      
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
      
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch('/users/me', userData);
      const updatedUser = response.data;
      
      set(state => ({
        user: { ...state.user, ...updatedUser },
        loading: false
      }));
      
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updatedUser }));
      } catch (error) {
        console.error('Error updating user in localStorage:', error);
      }
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useUserStore;