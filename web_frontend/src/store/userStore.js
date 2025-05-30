import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.MODE === 'production' ? '/api/users' : 'http://localhost:5000/api/users';

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  // Récupérer tous les utilisateurs
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(API_URL);
      set({ users: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      toast.error(error.response?.data?.message || error.message);
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      set((state) => ({
        users: state.users.map(user => 
          user._id === id ? response.data : user
        ),
        loading: false
      }));
      toast.success('Utilisateur mis à jour avec succès');
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        users: state.users.filter(user => user._id !== id),
        loading: false
      }));
      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  }
}));

export default useUserStore;