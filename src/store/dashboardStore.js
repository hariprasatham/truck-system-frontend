import { create } from 'zustand';
import api from "../API/api"
const useDashboardStore = create((set) => ({
  stats: {},
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get(`/auth/dashboard`);

        set({ stats: res.data.data, role: res.data.role, loading: false });
      
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      set({ loading: false, error: err.message || "Failed to fetch dashboard data" });
    }
  },

}));

export default useDashboardStore;

