import { create } from "zustand";
import api from '../API/api';
import toast from 'react-hot-toast';

const useCompanyTruckStore = create((set, get) => ({
  // State
  trucks: [],
  currentTruck: null,
  loading: false,
  truckError: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  allbrands: [],

  // Actions
  // Get all brands
  fetchAllBrands: async () => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.get(`/truck/get/allBrands`);
      
      set({
        allbrands: response.data.results,
        loading: false
      });
      return response.data;
    } catch (error) {
      set({ 
        truckError: error.response?.data?.message || 'Failed to fetch brands',
        loading: false 
      });
      throw error;
    }
  },

  // Add brand
  addTruck: async (data, params) => {
    set({ loading: true, truckError: null });
  
    try {
      const res = await api.post(`/truck/createTruck`, data, { params });
  
      set({ loading: false });
      return res.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add truck";
  
      set({
        truckError: message,
        loading: false,
      });
  
      return { success: false, message }; // ⚠️ no throw
    }
  },
  
  
  updateBrand: async (brandId, brandData) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.put(`/truck/brandupdate/${brandId}`, brandData);
  
      const { allbrands } = get();
  
      // Update the brand in the array
      const updatedBrands = allbrands.map((brand) =>
        brand.id === brandId ? response.data.results : brand
      );
  
      set({
        allbrands: updatedBrands,
        loading: false,
      });
  
      toast.success("Brand updated successfully");
  
      return response.data;
  
    } catch (error) {
      set({
        truckError: error.response?.data?.message || "Failed to update brand",
        loading: false,
      });
      throw error;
    }
  },
  
  

  deleteBrand: async (brandId) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.delete(`/truck/delete/brand/${brandId}`);
  
      const { allbrands } = get();     // get current brand list
  
      // Filter out deleted brand
      const updatedBrands = allbrands.filter((brand) => brand.id !== brandId);
  
      set({
        allbrands: updatedBrands,      // update state
        loading: false
      });
  
      toast.success("Brand deleted successfully");
      return response.data;
  
    } catch (error) {
      set({
        truckError: error.response?.data?.message || "Failed to delete brand",
        loading: false,
      });
      throw error;
    }
  },
  

  // Fetch all trucks for a company with pagination
  fetchTrucksByCompany: async (companyId, params = {}) => {
    set({ loading: true, truckError: null });
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
        truckError: error.response?.data?.message || 'Failed to fetch trucks',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch a single truck by ID
  fetchTruckById: async (truckId) => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.get(`/truck/${truckId}`);
      set({ 
        currentTruck: response.data.results.truck,
        loading: false 
      });
      return response.data.results;
    } catch (error) {
      set({ 
        truckError: error.response?.data?.message || 'Failed to fetch truck',
        loading: false 
      });
      throw error;
    }
  },

  // Add a new truck
  addTruck: async (truckData, params = {}) => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.post('/truck/register', truckData, {params});
      set({loading: false});
      toast.success('Truck added successfully');
      // setFormData({ ...initialFormState });

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to add truck";

  // Show toast here
      toast.error(message);

      console.log(error.response.data.message)
      set({ 
        truckError: error?.response?.data?.message || 'Failed to add truck',
        loading: false 
      });
      // throw error;
    }
  },


  bulkAddTrucks: async (truckList, params = {}) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.post('/truck/register/bulk', truckList, { params });
      set({ loading: false });
      toast.success('Bulk trucks added successfully');
      return response.data;
  
    } catch (error) {
      set({
        loading: false,
        truckError: error.response?.data?.message || "Failed to add trucks",
      });
      throw error;
    }
  },
  

  updateTruck: async (truckId, truckData) => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.put(`/truck/${truckId}`, truckData);
      set({loading: false});
      toast.success('Truck updated successfully');
      return response.data;
    } catch (error) {
      set({ 
        truckError: error.response?.data?.message || 'Failed to update truck',
        loading: false 
      });
      throw error;
    }
  },

  deleteTruck: async (truckId) => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.delete(`/truck/${truckId}`);
      set({loading: false});
      toast.success('Truck deleted successfully');
      return response.data;
    } catch (error) {
      set({ 
        truckError: error.response?.data?.message || 'Failed to delete truck',
        loading: false 
      });
      throw error;
    }
  },

  //change status
  changeTruckStatus: async (truckId, status) => {
    set({ loading: true, truckError: null });
    try {
      const response = await api.put(`/truck/changeStatus/${truckId}`, { status });
      set({loading: false});
      toast.success('Truck status changed successfully');
      return response.data;
    } catch (error) {
      set({ 
        truckError: error.response?.data?.message || 'Failed to change truck status',
        loading: false 
      });
      throw error;
    }
  },

    clearError: () => set({ truckError: null }),
    clearCurrentTruck: () => set({ currentTruck: null }),
    
}));

export default useCompanyTruckStore;