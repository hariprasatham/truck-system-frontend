import { create } from "zustand";
import api from "../API/api";
import toast from "react-hot-toast";

const useFleetStore = create((set, get) => ({
  fleets: [],
  allTrucks: [],
  loading: false,
  error: null,

  // ------------------------------------------
  // FETCH FLEETS FOR COMPANY
  // ------------------------------------------
  fetchFleets: async () => {
    set({ loading: true, error: null });
  
    try {
      const res = await api.get("/fleet");
  
      const rawFleets = res.data.code || [];
  
      // Transform FleetTrucks → trucks[]
      const fleets = rawFleets.map((f) => ({
        ...f,
        trucks: f.FleetTrucks.map((ft) => ft.Truck),
      }));
  
      set({ fleets, loading: false });
      return fleets;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch fleets";
      set({ error: msg, loading: false });
      throw err;
    }
  },
  
  

  // ------------------------------------------
  // ADD FLEET
  // ------------------------------------------
  addFleet: async (fleetData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/fleet", fleetData);
      const newFleet = res.data?.results || res.data;
      set((state) => ({ fleets: [...state.fleets, newFleet], loading: false }));
      toast.success("Fleet added successfully");
      return newFleet;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add fleet";
      set({ error: msg, loading: false });
      toast.error(msg);
      throw err;
    }
  },

  // ------------------------------------------
  // FETCH ALL TRUCKS
  // ------------------------------------------
  fetchAllTrucks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/trucks"); // your API
      const trucks = Array.isArray(res.data) ? res.data : res.data.trucks || [];
      set({ allTrucks: trucks, loading: false });
      return trucks;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch trucks";
      set({ error: msg, loading: false });
    //   toast.error(msg);
      throw err;
    }
  },

  updateFleet: async (fleetId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/fleet/${fleetId}`, data);
  
      // Update the list locally
      set((state) => ({
        fleets: state.fleets.map((f) =>
          f.id === fleetId ? { ...f, ...data } : f
        ),
        loading: false,
      }));
  
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update fleet";
      set({ error: msg, loading: false });
      throw err;
    }
  },

   // -----------------------------------------------------
  //  LINK TRUCKS TO FLEET
  // -----------------------------------------------------
  linkTrucks: async (fleetId, truckIds) => {
    try {
      const res = await api.post(`/fleet/${fleetId}/link-trucks`, {
        truck_ids: truckIds,
      });

      toast.success("Trucks linked successfully");

      await get().fetchFleets(); // refresh fleets
      await get().fetchAllTrucksByCompanies(); // refresh truck join status

      return res.data;

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to link trucks");
      throw err;
    }
  },
  
  fetchAllTrucksByCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/truck/truck-by-companies");
  
      const trucks = res.data?.results || [];
  
      set({
        allTrucks: trucks,
        loading: false,
      });
  
      return trucks;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch trucks";
      toast.error(msg);
      set({ error: msg, loading: false });
    }
  },
  

  
}));

export default useFleetStore;
