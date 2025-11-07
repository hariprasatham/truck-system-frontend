import { create } from "zustand";
import api from '../API/api';
import toast from 'react-hot-toast';

const useCompanyTruckStore = create((set, get) => ({
  // State
  trucks: [],
  currentTruck: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },

  // Actions
  // Fetch all trucks for a company with pagination
  fetchTrucksByCompany: async (companyId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = get().pagination.page, limit = get().pagination.limit, ...filters } = params;
      const response = await api.get(`/company/truck/${companyId}`, {
        params: { page, limit, ...filters }
      });
      
      set({
        trucks: response.data.results.trucks,
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
        error: error.response?.data?.message || 'Failed to fetch trucks',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch a single truck by ID
  fetchTruckById: async (truckId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/truck/${truckId}`);
      set({ 
        currentTruck: response.data.results.truck,
        loading: false 
      });
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch truck',
        loading: false 
      });
      throw error;
    }
  },

  // Add a new truck
  addTruck: async (truckData, params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/truck/register', truckData, {params});
      set({loading: false});
      toast.success('Truck added successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add truck',
        loading: false 
      });
      throw error;
    }
  },

  updateTruck: async (truckId, truckData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/truck/${truckId}`, truckData);
      set({loading: false});
      toast.success('Truck updated successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update truck',
        loading: false 
      });
      throw error;
    }
  },

  deleteTruck: async (truckId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/truck/${truckId}`);
      set({loading: false});
      toast.success('Truck deleted successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete truck',
        loading: false 
      });
      throw error;
    }
  },

  //change status
  changeTruckStatus: async (truckId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/truck/changeStatus/${truckId}`, { status });
      set({loading: false});
      toast.success('Truck status changed successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to change truck status',
        loading: false 
      });
      throw error;
    }
  },

    clearError: () => set({ error: null }),
    clearCurrentTruck: () => set({ currentTruck: null }),
    
}));

export default useCompanyTruckStore;