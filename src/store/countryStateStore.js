
import { create } from 'zustand';
import api from '../API/api';
import toast from 'react-hot-toast';

export const useCountryStateStore = create((set, get) => ({
  countries: [],
  states: [],
  loading: false,
  error: null,

  // GET ALL COUNTRIES
  fetchAllCountries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/country/all");

      set({
        countries: response.data?.results,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch countries",
        loading: false,
      });
      throw error;
    }
  },

  // GET STATES BY COUNTRY ID
  fetchStatesByCountry: async (countryId) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get(`/country/states/${countryId}`);

      set({
        states: response?.data?.results,
        loading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch states",
        loading: false,
      });
      throw error;
    }
  },
}));
