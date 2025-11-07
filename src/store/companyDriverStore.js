// src/store/companyDriverStore.js
import { create } from 'zustand';
import api from '../API/api';
import toast from 'react-hot-toast';

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
  fetchDriversByCompany: async (companyId, userId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = get().pagination.page, limit = get().pagination.limit, ...filters } = params;
      const response = await api.get(`/company/${companyId}/users/${userId}/drivers`, {
        params: { page, limit, ...filters }
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
        currentDriver: response.data.results.driver,
        loading: false 
      });
      return response.data.results.driver;
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
      toast.success('Driver added successfully');
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
      toast.success('Driver updated successfully');
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
      toast.success('Driver deleted successfully');
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
      // set({ loading: false });
      set(state => ({
      drivers: state.drivers.map(driver => 
        driver.id === driverId ? { ...driver, isActive } : driver
      ),
      loading: false
    }));
      toast.success('Driver status updated successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update driver status',
        loading: false 
      });
      throw error;
    }
  },

  uploadMedicalReport: async (driverId, reportData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`driver/uploadDrugReport/${driverId}`, reportData);
      set({loading: false});
      toast.success('Medical report uploaded successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload medical report',
        loading: false 
      });
      throw error;
    }
  },

  uploadDriverLicense: async (licenseData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`driver/uploadLicense`, licenseData);
      set({loading: false});
      toast.success('Driver license uploaded successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload driver license',
        loading: false 
      });
      throw error;
    }
  },

  downloadMedicalReport: async (pdfPath) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`driver/downloadMedicalReport`, { filePath: pdfPath }, { responseType: 'blob' });
      set({ loading: false });
      toast.success('Medical report downloaded successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to download medical report',
        loading: false 
      });
      throw error;
    }
  },

  downloadLicense: async (filePath) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`driver/downloadLicense`, { filePath }, { responseType: 'blob' });
      set({ loading: false });
      toast.success('License fetched successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to download license',
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