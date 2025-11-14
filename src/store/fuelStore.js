import { create } from 'zustand';
import api from "../API/api"
import toast from "react-hot-toast";


const useFuelStore = create((set, get) => ({
    fuelInvoices: [],
    currentFuelInvoice: [],
    spinnerMessage: "",
    trucks: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    },

    getAllFuelInvoices: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const { page = get().pagination.page, limit = get().pagination.limit, ...filters } = params;
            const response = await api.get("fuel/fuelInvoices", {
                params: {
                    page,
                    limit,
                    ...filters,
                },
            });
            set({ fuelInvoices: response.data.results.fuels, pagination: {
                page: response.data.results.pagination.currentPage,
                limit: response.data.results.pagination.itemsPerPage,
                total: response.data.results.pagination.totalItems,
                totalPages: response.data.results.pagination.totalPages,
            }, loading: false });
        } catch (error) {
            console.error("Error fetching fuel invoices:", error);
            set({ error: "Failed to fetch fuel invoices", loading: false });
        }
    },

    fetchAllTrucksForFuelInvoice: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get('/truck/getAllTruck');
            set({
                trucks: response.data.results,
                loading: false
            });
            return response.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch trucks',
                loading: false
            });
            throw error;
        }
    },

    downloadFuelInvoice: async (fuelId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/fuel/${fuelId}/download`, {
                responseType: 'blob',
            });
            set({ loading: false });
            toast.success("Fuel invoice downloaded successfully");
            return response.data;
        } catch (error) {
            console.error("Error downloading fuel invoice:", error);
            set({ error: "Failed to download fuel invoice", loading: false });
        }
    },

    getFuelInvoiceById: async (fuelId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/fuel/${fuelId}/data`);
            set({ currentFuelInvoice: response.data.results.fuel.statewiseFuelData, loading: false });
            return response.data;
        } catch (error) {
            console.error("Error fetching fuel invoice:", error);
            set({ error: "Failed to fetch fuel invoice", loading: false });
        }
    },

    uploadFuelSheet: async (formData) => {
        set({ loading: true, error: null, spinnerMessage: "Uploading fuel sheet..." });
        try {
            const response = await api.post("/fuel/uploadFuelSheet", formData);
            set({ spinnerMessage: "Checking fuel sheet status..." });
            console.log("Fuel Record ID: ", response.data.results.fuelRecordId);
            get().checkFuelSheetStatus(response.data.results.jobId, response.data.results.fuelRecordId);
            return response.data;
        } catch (error) {
            console.error("Error uploading fuel invoice:", error);
            set({ error: "Failed to upload fuel invoice", loading: false });
        }
    },

    checkFuelSheetStatus: async (jobId, fuelRecordId) => {
        set({ loading: true, error: null });
        try {
            console.log("Fuel Record ID status: ", fuelRecordId);
            const response = await api.get(`/fuel/getFuelSheetStatus/${jobId}`);
            if(response.data.results.jobStatus != "SUCCEEDED" && response.data.results.jobStatus != "FAILED"){
                setTimeout(() => {
                    get().checkFuelSheetStatus(jobId, fuelRecordId);
                }, 5000);
            }else{
                set({ spinnerMessage: "Processing fuel sheet..." });
                get().processFuelSheetResults(jobId, fuelRecordId);
            }
            // return response.data;
        } catch (error) {
            console.error("Error checking fuel sheet status:", error);
            set({ error: "Failed to check fuel sheet status", loading: false });
        }
    },

    processFuelSheetResults: async (jobId, fuelRecordId) => {
        set({error: null, spinnerMessage: "Processing fuel sheet..." });
        try {
            const response = await api.get(`/fuel/getFuelSheetResults/${jobId}`, {
                params: {
                    fuelRecordId
                }
            });
            get().getAllFuelInvoices();
            set({ loading: false , error: null, spinnerMessage: ""});
            return response.data;
        } catch (error) {
            console.error("Error processing fuel sheet:", error);
            set({ error: "Failed to process fuel sheet", loading: false });
        }
    },



}));

export default useFuelStore;
