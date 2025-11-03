// src/store/companyDriverStore.js
import { create } from 'zustand';
import api from '../API/api';

const useCompanyDriverStore = create((set, get) => ({
  // State
  drivers: [],
  currentDriver: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Actions
  // Fetch all drivers for a company with pagination
  fetchDriversByCompany: async (companyId, userId, page = 1, search = '') => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/company/${companyId}/users/${userId}/drivers`, {
        params: { page, search }
      });
      
      set({
        drivers: response.data.results.drivers,
        pagination: {
          currentPage: response.data.results.pagination.currentPage,
          totalPages: response.data.results.pagination.totalPages,
          totalItems: response.data.results.pagination.totalItems,
          itemsPerPage: response.data.results.pagination.itemsPerPage,
        },
        loading: false
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch drivers',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch a single driver by ID
  fetchDriverById: async (driverId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/driver/${driverId}`);
      set({ 
        currentDriver: response.data,
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch driver',
        loading: false 
      });
      throw error;
    }
  },

  // Add a new driver
  addDriver: async (driverData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/driver', driverData);
      set(state => ({
        drivers: [response.data, ...state.drivers],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add driver',
        loading: false 
      });
      throw error;
    }
  },

  // Update a driver
  updateDriver: async (driverId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/driver/${driverId}`, updateData);
      set(state => ({
        drivers: state.drivers.map(driver => 
          driver.id === driverId ? { ...driver, ...response.data } : driver
        ),
        currentDriver: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update driver',
        loading: false 
      });
      throw error;
    }
  },

  // Delete a driver
  deleteDriver: async (driverId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/driver/${driverId}`);
      set(state => ({
        drivers: state.drivers.filter(driver => driver.id !== driverId),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete driver',
        loading: false 
      });
      throw error;
    }
  },

  // Toggle driver active status
  toggleDriverStatus: async (driverId, isActive) => {

    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/driver/${driverId}/status`, { isActive });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update driver status',
        loading: false 
      });
      throw error;
    }
  },

  // Clear current driver
  clearCurrentDriver: () => set({ currentDriver: null }),

  // Clear errors
  clearError: () => set({ error: null }),
}));

export default useCompanyDriverStore;