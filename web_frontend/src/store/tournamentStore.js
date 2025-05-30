import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' ? '/api/tournois' : 'http://localhost:5000/api/tournois';
const useTournamentStore = create((set) => ({
  tournaments: [],
  loading: false,
  error: null,

  fetchTournaments: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ tournaments: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  updateTournament: async (id, tournamentData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/${id}`, tournamentData);
      set((state) => ({
        tournaments: state.tournaments.map(tournament => 
          tournament._id === id ? response.data : tournament
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  deleteTournament: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        tournaments: state.tournaments.filter(tournament => tournament._id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  }
}));

export default useTournamentStore;