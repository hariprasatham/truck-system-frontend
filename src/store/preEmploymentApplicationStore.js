import { create } from 'zustand';
import api from "../API/api"
import toast from "react-hot-toast";


const usePreEmploymentApplicationStore = create((set, get) => ({
  allApplications: [],
  loading: false,
  error: null,
  currentApplication: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  fetchAllApplications: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/preEmploymentApplication/all', {
        params: {
          page: params.page || get().pagination.page,
          limit: params.limit || get().pagination.limit,
        },
      });
      const { preEmploymentApplications, pagination } = response.data.results;
      set({ allApplications: preEmploymentApplications, pagination, loading: false,});
      return preEmploymentApplications
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch applications',
        loading: false 
      });
      throw error;
    }
  },
  fetchApplicationById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/preEmploymentApplication/get/${id}`);
      set({ currentApplication: response.data.results, loading: false });
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch application',
        loading: false 
      });
      throw error;
    }
  },

  createApplication: async (applicationData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/preEmploymentApplication/create`, applicationData);
      // Refresh applications after update
      set({loading: false, error: null, });
      toast.success("Application created successfully");
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create application',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateApplication: async (id, applicationData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/preEmploymentApplication/update/${id}`, applicationData);
      // Refresh applications after update
      set({loading: false, error: null, });
      toast.success("Application updated successfully");
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update application',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteApplication: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/preEmploymentApplication/delete/${id}`);
      // Refresh applications after delete
      await get().fetchAllApplications();
      set({loading: false, error: null, });
      toast.success("Application deleted successfully");
      return response.data.results;
    } catch (error) {
      toast.error(error.response?.data?.message);
      set({ 
        error: error.response?.data?.message || 'Failed to delete application',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  downloadApplication: async (filePath) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`preEmploymentApplication/download`, { filePath }, { responseType: 'blob' });
      set({ loading: false });
      toast.success('Application Downloaded successfully');
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to download application',
        loading: false 
      });
      throw error;
    }
  },
  clearError: () => set({ error: null })
}));

export default usePreEmploymentApplicationStore;