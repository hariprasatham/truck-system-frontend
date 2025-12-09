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
  fuelUnits: [],

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
  


  addBrand: async (brandData) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.post(`/truck/addBrand`, brandData);
  
      const { allbrands } = get();
  
      set({
        allbrands: [...allbrands, response.data.results],
        loading: false
      });
  
      return { success: true, data: response.data.results };
  
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to add brand";
  
      set({
        truckError: message,
        loading: false
      });
  
      return { success: false, message }; // <── return clean error, don't throw
    }
  },
  

  // Add brand
  // addTruck: async (data, params) => {
  //   set({ loading: true, truckError: null });
  
  //   try {
  //     const res = await api.post(`/truck/createTruck`, data, { params });
  
  //     set({ loading: false });
  //     return res.data
  //   } catch (error) {
  //     const message = error.response?.data?.message || "Failed to add truck";
  
  //     set({
  //       truckError: message,
  //       loading: false,
  //     });
  
  //     return { success: false, message }; // ⚠️ no throw
  //   }
  // },
  
  
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


  bulkAddTrucks: async (truckList, params = {}) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.post('/truck/register/bulk', truckList, { params });
  
      set({ loading: false });
  
      return response.data; // 🔥 return full API response
  
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add trucks";
  
      set({
        loading: false,
        truckError: message,
      });
  
      return { error: true, message }; // 🔥 return safe object instead of throwing
    }
  },

  uploadFuelUnits: async (data) => {
  set({ loading: true, truckError: null });

  try {
    const res = await api.post("/fuel/upload_fuel_unit", data);
    set({ loading: false });
    await get().fetchFuelUnits();
    // SUCCESS TOAST (from backend)
    toast.success(res.data?.message || "Fuel unit data uploaded!");

    return res.data;        // send it back to component

  } catch (error) {
    const message =
      error.response?.data?.message || "Upload failed";

    set({ loading: false, truckError: message });

    toast.error(message);   // ERROR TOAST HERE

    throw error;
  }
},


  uploadJurisdictionData: async (data) => {
    set({ loading: true, truckError: null });
  
    try {
      const response = await api.post("/fuel/upload_judis_fuel_unit", data);
      set({ loading: false });
      await get().fetchFuelUnits();
      const res = response.data;
  
      // 🔔 Show toast directly here
      if (res?.results) {
        toast.success(
          `${res.message} | Inserted: ${res.results.inserted}, ` +
          `Skipped: ${res.results.skipped_duplicates}`
        );
        // fetchFuelUnits()
      } else {
        toast.success("Jurisdiction data uploaded successfully!");
      }
  
      return res; // return whole response (not just .data)
    } catch (error) {
      set({ loading: false });
  
      const message =
        error.response?.data?.message || "Failed to upload jurisdiction data";
  
      set({ truckError: message });
  
      toast.error(message); // 🔔 error toast here
      throw error;
    }
  },
  

  // Fetch fuel units with optional filters
  fetchFuelUnits: async (filters = {}) => {
    set({ loading: true, truckError: null });
    try {
      const params = {};
      if (filters.state) params.state = filters.state;
      if (filters.unit_no) params.unit_no = filters.unit_no;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const response = await api.get("/fuel/fetch_fuel_units", { params });

      set({ fuelUnits: response.data.results || [], loading: false });
      return response.data.results || [];
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch fuel units";
      set({ loading: false, truckError: message, fuelUnits: [] });
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