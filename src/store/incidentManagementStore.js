import { create } from 'zustand'
import api from '../API/api';
import { devtools } from 'zustand/middleware'

const useIncidentManagementStore = create(
  devtools((set, get) => ({
    incidents: [],
    currentIncident: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1,
      totalItems: 0,
    },

    getAllIncidents: async (params = {}) => {
      const state = get();
      if (state.loading) return;

      set({ loading: true });
      try {
        const { page = state.pagination.currentPage, limit = state.pagination.itemsPerPage } = params;
        const response = await api.get("/accidentReport/all", { 
          params: { page, limit } 
        });
        
        const { pagination, accidentReports } = response.data.results;
        
        set({
          incidents: Array.isArray(accidentReports) ? accidentReports : [],
          pagination: {
            currentPage: Number(pagination?.currentPage) || 1,
            itemsPerPage: Number(pagination?.itemsPerPage) || 10,
            totalPages: Number(pagination?.totalPages) || 0,
            totalItems: Number(pagination?.totalItems) || 0,
          },
          loading: false
        });
        
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch incidents',
          loading: false 
        });
      }
    },
    getIncidentById: async (id) => {
      try {
        set({ loading: true, error: null });
        const response = await api.get(`/accidentReport/${id}`);
        
        set({
          currentIncident: response.data.results,
          loading: false
        });
        
        return response.data.results;
      } catch (error) {
        console.error('Error fetching incident:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to fetch incident', 
          loading: false 
        });
        return null;
      }
    },

    StatusAndSignature:async (id, data) => {
      try {
        set({ loading: true, error: null });
        const response = await api.put(`/accidentReport/statusAndSignature/${id}`, data);
        
        set({
          currentIncident: response.data.results,
          error: null
        });
        
        return response.data.results;
      } catch (error) {
        console.error('Error updating incident status and signature:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to update incident status and signature',
          currentIncident: null
        });
        return null;
      } finally {
        set({ loading: false });
      }
    },

    getImage:async (filePath) => {
      try {
        const response = await api.get(`/accidentReport/evidence`, {
          params: { filePath },
          responseType: 'arraybuffer',
        });
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });

        return { blob, type: contentType };  // Return both properly
      } catch (error) {
        console.error('Error fetching image:', error);
        return null;
      }
    },

    deleteIncident:async (id) => {
      try {
        set({ loading: true, error: null });
        const response = await api.delete(`/accidentReport/${id}`);
        
        set({
          error: null,
          loading: false
        });
        
        return response.data.results;
      } catch (error) {
        console.error('Error deleting incident:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to delete incident',
          loading: false
        });
        return null;
      } finally {
        set({ loading: false });
      }
    },

    setError: (error) => set({ error }),
  }))
);

export default useIncidentManagementStore;