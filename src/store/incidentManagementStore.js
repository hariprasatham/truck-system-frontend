import { create } from 'zustand'
import api from '../API/api';
import { devtools } from 'zustand/middleware'

const useIncidentManagementStore = create(
  devtools((set, get) => ({
    incidents: [],
    currentIncident: null,
    loading: false,
    error: null,
    meetingNotes: null,
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

    StatusAndSignature: async (id, data) => {
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

    getImage: async (filePath) => {
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
    getWitnessAudio: async (filePath) => {
  try {
    const response = await api.get(`/accidentReport/evidence`, {
      params: { filePath },
      responseType: 'arraybuffer',
    });
    // MIME type mappings
    const mimeTypes = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac'
    };
    // Try to determine the MIME type from the file extension
    let mimeType = 'audio/mpeg'; // default
    if (filePath) {
      const ext = `.${filePath.split('.').pop().toLowerCase()}`;
      mimeType = mimeTypes[ext] || 'audio/mpeg';
    }
    const blob = new Blob([response.data], { type: mimeType });
    
    console.log('Audio blob created:', {
      size: blob.size,
      type: mimeType,
      filePath,
      blobType: blob.type
    });
    return {
      blob,
      type: mimeType
    };
  } catch (error) {
    console.error('Error in getWitnessAudio:', {
      error,
      filePath,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return null;
  }
},

    deleteIncident: async (id) => {
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

    addMeetingNotes: async (incidentId, meetingNotes) => {
      console.log(meetingNotes, incidentId)
      try {
        set({ loading: true, error: null });
        const response = await api.post(`/accidentReport/meetingPoints`, {
          incidentId,
          ...meetingNotes
        });

        set({
          error: null,
          loading: false,
          meetingNotes: response.data.results
        });

        return response.data.results;
      } catch (error) {
        console.error('Error adding meeting notes:', error);
        set({
          error: error.response?.data?.message || `Error adding meeting notes`,
          loading: false,
          meetingNotes: null
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getMeetingNotes: async (incidentId) => {
      try {
        set({ loading: true, error: null });
        const response = await api.get(`/accidentReport/meetingPoints/${incidentId}`);

        set({
          error: null,
          loading: false,
          meetingNotes: response.data.results
        });

        return response.data.results;
      } catch (error) {
        console.error('Error fetching meeting notes:', error);
        set({
          error: error.response?.data?.message || `Error fetching meeting notes`,
          loading: false,
          meetingNotes: null
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    downloadReport: async (incidentId)=>{
      try {
        set({ loading: true, error: null });
        const response = await api.get(`/accidentReport/download/${incidentId}`, {
         responseType: 'blob'
        });
        set({ loading: false });
        return response.data;
        
      } catch (error) {
        set({ loading: false, error: error.response?.data?.message || `Error downloading report` });
        console.error('Error downloading report:', error);
        throw error;
      }
    },

    setError: (error) => set({ error }),
  }))
);

export default useIncidentManagementStore;