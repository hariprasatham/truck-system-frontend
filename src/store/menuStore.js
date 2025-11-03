import { create } from 'zustand';
import api from "../API/api"
import toast from "react-hot-toast";

const useMenuStore = create((set, get) => ({
  // State
  allMenus: [],
 assignedMenus: [],
  userMenus: [],
  loading: false,
  error: null,

  // Fetch all menus
  fetchAllMenus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/menu/all');
      set({ allMenus: response.data.results, loading: false,});
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch menus',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch menus assigned to current user
  fetchUserMenus: async () => {

    set({ loading: true, error: null });
    try {
      const response = await api.get(`/menu/my-menu/`);
      set({ userMenus: response.data.results, loading: false });
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user menus',
        loading: false 
      });
      throw error;
    }
  },

    // Fetch menus for a specific user (for admin assignment)
  fetchAssignedMenus: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/menu/user/${userId}`);
      set({ assignedMenus: response.data.results, loading: false });
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user menus',
        loading: false 
      });
      throw error;
    }
  },

  // Update user menus
  updateUserMenus: async (userId, menuIds) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/menu/assign-permissions/${userId}`, { menuIds });
      // Refresh user menus after update
      await get().fetchUserMenus();
      set({loading: false, error: null, });
      toast.success("Menu assigned successfully");
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update user menus',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearAssignedMenus: () => set({ assignedMenus: [] }),

  // Clear error
  clearError: () => set({ error: null })
}));

export default useMenuStore;