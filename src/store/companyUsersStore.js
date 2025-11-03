// src/store/companyUsersStore.js
import { create } from 'zustand';
import api from '../API/api';

const useCompanyUsersStore = create((set, get) => ({
  // State
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  globalLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),

  // Fetch users by company ID with pagination and filters
  fetchUsersByCompany: async (companyId, params = {}) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const { page = get().pagination.page, limit = get().pagination.limit, ...filters } = params;
      const response = await api.get(`/company/${companyId}/users`, {
        params: {
          page,
          limit,
          ...filters,
        },
      });

      const { users, pagination } = response.data.results;

      set({
        users: users,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.pages,
        },
        loading: false,
        globalLoading: false,
      });

      return { users, pagination };
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Fetch single user by ID within a company
  fetchUserById: async (companyId, userId) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.get(`/companies/${companyId}/users/${userId}`);
      set({ currentUser: response.data, loading: false, globalLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Add user to company
  addUserToCompany: async (companyId, userData) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.post(`/company/${companyId}/users`, userData);
      set(state => ({
        users: [response.data, ...state.users],
        loading: false,
        globalLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add user';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Update user in company
  updateUserInCompany: async (companyId, userId, updateData) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.patch(`/companies/${companyId}/users/${userId}`, updateData);
      set(state => ({
        users: state.users.map(user =>
          user._id === userId ? { ...user, ...response.data } : user
        ),
        currentUser: state.currentUser?._id === userId
          ? { ...state.currentUser, ...response.data }
          : state.currentUser,
        loading: false,
        globalLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Remove user from company
  removeUserFromCompany: async (companyId, userId) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      await api.delete(`/company/${companyId}/users/${userId}`);
      set(state => ({
        users: state.users.filter(user => user._id !== userId),
        currentUser: state.currentUser?._id === userId ? null : state.currentUser,
        loading: false,
        globalLoading: false,
      }));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove user';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  changeUserActiveStatus: async (companyId, userId) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      // Send PATCH request (this toggles the user's status in your backend)
      const response = await api.patch(`/company/${companyId}/users/${userId}`);
      const updatedUser = response.data; // assuming API returns the updated user object

      // Update the user in the local store (instead of removing)
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? updatedUser : user
        ),
        loading: false,
        globalLoading: false,
      }));

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change the user status";
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Clear current user
  clearCurrentUser: () => set({ currentUser: null }),

  // Reset store
  reset: () => set({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    globalLoading: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    }
  }),
}));

export default useCompanyUsersStore;