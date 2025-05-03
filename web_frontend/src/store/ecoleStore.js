import { create } from "zustand";
import axios from "axios";

const ECOLE_API = import.meta.env.MODE === "development"? "http://localhost:5000/api/ecoles": "/api/ecoles";

axios.defaults.withCredentials = true;

export const useEcoleStore = create((set) => ({
  ecoles: [],
  isLoading: false,
  error: null,

  fetchEcoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(ECOLE_API);
      set({ ecoles: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erreur lors de la récupération des écoles.",
        isLoading: false,
      });
    }
  },
}));
