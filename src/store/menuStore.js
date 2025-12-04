import { create } from 'zustand';
import api from "../API/api"
import toast from "react-hot-toast";

const useMenuStore = create((set, get) => ({
  // State
  allMenus: [],
  allMenusForAssignment: [],
 assignedMenus: [],
  userMenus: [],
  loading: false,
  error: null,
    pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },

  // Fetch all menus
  fetchAllMenus: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/menu/all', {
        params: {
          page: params.page || get().pagination.page,
          limit: params.limit || get().pagination.limit,
        },
      });
      const { menuItems, pagination } = response.data.results;
      set({ allMenus: menuItems, pagination, loading: false,});
      return menuItems
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch menus',
        loading: false 
      });
      throw error;
    }
  },

    fetchAllMenusForAssignment: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/menu/all-menus');
      const { menuItems, pagination } = response.data.results;
      set({ allMenusForAssignment: menuItems, loading: false,});
      return menuItems
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

  getMenuById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/menu/get/${id}`);
      set({ loading: false });
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch menu',
        loading: false 
      });
      throw error;
    }
  },

  updateMenu: async (id, menuData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/menu/update/${id}`, menuData);
      // Refresh menus after update
      await get().fetchAllMenus();
      set({loading: false, error: null, });
      toast.success("Menu updated successfully");
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update menu',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createMenu: async (menuData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/menu/create`, menuData);
      // Refresh menus after update
      await get().fetchAllMenus();
      set({loading: false, error: null, });
      toast.success("Menu created successfully");
      return response.data.results;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create menu',
        loading: false 
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/menu/delete/${id}`);
      // Refresh menus after delete
      await get().fetchAllMenus();
      set({loading: false, error: null, });
      toast.success("Menu deleted successfully");
      return response.data.results;
    } catch (error) {
      toast.error(error.response?.data?.message);
      set({ 
        error: error.response?.data?.message || 'Failed to delete menu',
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