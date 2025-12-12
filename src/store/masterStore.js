import { create } from "zustand";
import api from "../API/api";
import toast from "react-hot-toast";

const useMasterStore = create((set,get) => ({
  authorities: [],
  loading: false,           // for form submit
  tableLoading: false,      // for table loading
  error: null,
  company: null,
  usAuthorities: [],
  canadaAuthorities: [],
  active: [],
  history: [],
  requested_by: null,

  // ===========================
  // FETCH ALL AUTHORITIES
  // ===========================
  fetchAuthorities: async () => {
    set({ tableLoading: true, error: null });

    try {
      const res = await api.get("/authority/getallAuthorities");

      // expecting an array (your API returns `res.data`)
      set({
        authorities: res.data, 
        tableLoading: false,
      });

      return res.data.results; 
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load authorities";

      set({ tableLoading: false, error: msg });
      toast.error(msg);
    }
  },

  // ===========================
  // CREATE AUTHORITY
  // ===========================
  createAuthority: async (authorityData) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/authority/register", authorityData);

      toast.success("Authority created successfully!");
      const list = await api.get("/authority/getallAuthorities");

      // Refresh list after creation

      set({
        authorities: list.data.results,
        loading: false,
      }); 
         
      return res.data;

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create authority";

      set({ loading: false, error: msg });
      toast.error(msg);

      throw err;
    }
  },

  updateAuthority: async (id, data) => {
    set({ loading: true, error: null });
  
    try {
      const res = await api.put(`/authority/update/${id}`, data);
  
      toast.success("Authority updated successfully!");
      const list = await api.get("/authority/getallAuthorities");

      // Refresh list after creation

      set({
        authorities: list.data.results,
        loading: false,
      }); 
         
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update authority";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  toggleAuthorityStatus: async (id, newStatus) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/authority/toggleStatus/${id}`, {
        is_active: newStatus,
      });
      toast.success("Authority status updated!");

      // Refresh list
      const newList = await get().fetchAuthorities();
      set({ authorities: newList, loading: false });

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update status";
      set({ loading: false, error: msg });
      toast.error(msg);
      throw err;
    }
  },

  fetchAuthoritiesByCompany: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/authority/byCompany");

      set({
        company: res.data.results.company,
        usAuthorities: res.data.results.usAuthorities,
        canadaAuthorities: res.data.results.canadaAuthorities,
        loading: false,
      });

      return res.data.results;

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load authorities";
      set({ loading: false, error: msg });
      toast.error(msg);
      console.log("Authority store error:", err);
    }
  },


  applyAuthorities: async (payload) => {
    try {
      set({ loading: true });
  
      const res = await api.post("/authority/apply", payload);
  
      toast.success("Authorities applied successfully!");
  
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to apply authorities";
      toast.error(msg);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchAuthorityList: async () => {
    try {
      set({ loading: true });

      const res = await api.get("/authority/list");
        console.log(res,"ressss")
      set({
        applications: res.data.active || [],
        // history: res.data.history || [],
        // requested_by: res.data.requested_by || null,
        loading: false,
      });

      return res.data.active;
    } catch (err) {
      console.error("Error fetching authority list:", err);
      set({ loading: false });
    }
  },
  
  

  
}));

export default useMasterStore;
