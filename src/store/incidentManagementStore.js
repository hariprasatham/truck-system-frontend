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
      try {
        set({ loading: true, error: null });
        const { page = get().pagination.currentPage, limit = get().pagination.itemsPerPage } = params;
        const response = await api.get("/accidentReport/all", {
          params: { page, limit }
        });

        set({
          incidents: response.data.results.accidentReports || [],
          pagination: {
            currentPage: response.data.results.pagination?.currentPage || currentPage,
            itemsPerPage: response.data.results.pagination?.itemsPerPage || itemsPerPage,
            totalPages: response.data.results.pagination?.totalPages || 1,
            totalItems: response.data.results.pagination?.totalItems || 0,
          },
          loading: false
        });

        return response.data.results;
      } catch (error) {
        console.error('Error fetching incidents:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to fetch incidents', 
          loading: false 
        });
        return null;
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

    setError: (error) => set({ error }),
  }))
);

export default useIncidentManagementStore;