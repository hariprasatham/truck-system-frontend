// src/store/companiesStore.js
import { create } from 'zustand';
import api from '../API/api';

const useCompaniesStore = create((set, get) => ({
  // State
  companies: [],
  currentCompany: null,
  loading: false,
  error: null,
  globalLoading: false,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),

  // Fetch all companies with pagination
  fetchCompanies: async () => {
    set({ loading: true, error: null, globalLoading: true });
    try {

      const response = await api.get('/company');

      const { results } = response.data;

      set({
        companies: results,
        loading: false,
        globalLoading: false,
      });

      return { results };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch companies';
      set({ error: errorMessage, loading: false, globalLoading: false });
      console.log("fetchCompanies error", error)
      throw new Error(errorMessage);
    }
  },

  // Fetch single company by ID
  fetchCompanyById: async (id) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.get(`/company/${id}`);
      set({ currentCompany: response.data, loading: false, globalLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch company';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Create new company
  createCompany: async (companyData) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.post('/company', companyData);
      set(state => ({
        companies: [response.data, ...state.companies],
        loading: false,
        globalLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create company';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Update company
  updateCompany: async (id, updateData) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      const response = await api.patch(`/company/${id}`, updateData);
      set(state => ({
        companies: state.companies.map(company =>
          company._id === id ? { ...company, ...response.data } : company
        ),
        currentCompany: state.currentCompany?._id === id
          ? { ...state.currentCompany, ...response.data }
          : state.currentCompany,
        loading: false,
        globalLoading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update company';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (id) => {
    set({ loading: true, error: null, globalLoading: true });
    try {
      await api.delete(`/company/${id}`);
      set(state => ({
        companies: state.companies.filter(company => company._id !== id),
        currentCompany: state.currentCompany?._id === id ? null : state.currentCompany,
        loading: false,
        globalLoading: false,
      }));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete company';
      set({ error: errorMessage, loading: false, globalLoading: false });
      throw error;
    }
  },

  // Clear current company
  clearCurrentCompany: () => set({ currentCompany: null }),
}));

export default useCompaniesStore;